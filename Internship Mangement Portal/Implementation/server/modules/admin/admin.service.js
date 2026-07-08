import { User } from '../../models/User.js';
import { InternshipApplication } from '../../models/InternshipApplication.js';
import { InternshipPosting } from '../../models/InternshipPosting.js';
import { Task } from '../../models/Task.js';
import { ROLES } from '../../constants/roles.js';
import { toUserDTO } from '../../utils/userSerializer.js';
import { enrichPortalAccessPosting } from '../portal-access/portal-access.service.js';

const CLERK_STUDENT_FILTER = {
  role: ROLES.STUDENT,
  clerkId: { $exists: true, $ne: null },
};

const CHART_COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#6366F1'];

function clerkStudentQuery(extra = {}) {
  return { ...CLERK_STUDENT_FILTER, ...extra };
}

function buildWeekBuckets(weeks = 8) {
  const buckets = [];
  const now = new Date();
  for (let i = weeks - 1; i >= 0; i -= 1) {
    const start = new Date(now);
    start.setDate(start.getDate() - i * 7);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    buckets.push({
      start,
      end,
      label: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: 0,
    });
  }
  return buckets;
}

async function getSignupsOverTime() {
  const students = await User.find(CLERK_STUDENT_FILTER).select('createdAt').lean();
  const buckets = buildWeekBuckets(8);

  students.forEach((student) => {
    const created = new Date(student.createdAt);
    const bucket = buckets.find((b) => created >= b.start && created < b.end);
    if (bucket) bucket.value += 1;
  });

  return buckets.map(({ label, value }) => ({ name: label, value }));
}

async function getPortalStatusChart() {
  const statuses = ['unsubmitted', 'pending', 'approved', 'rejected'];
  const counts = await Promise.all(
    statuses.map((status) => User.countDocuments(clerkStudentQuery({ 'portalAccess.status': status }))),
  );

  return statuses
    .map((status, index) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: counts[index],
      color: CHART_COLORS[index % CHART_COLORS.length],
    }))
    .filter((item) => item.value > 0);
}

async function getEnrollmentChart() {
  const statuses = [
    { key: 'none', label: 'Not Enrolled', color: '#94A3B8' },
    { key: 'active', label: 'Active', color: '#10B981' },
    { key: 'completed', label: 'Completed', color: '#3B82F6' },
  ];

  const counts = await Promise.all(
    statuses.map(({ key }) => User.countDocuments(clerkStudentQuery({ 'portalAccess.enrollmentStatus': key }))),
  );

  return statuses
    .map((status, index) => ({
      name: status.label,
      value: counts[index],
      color: status.color,
    }))
    .filter((item) => item.value > 0);
}

async function getApplicationsByPosting() {
  const applications = await InternshipApplication.find()
    .populate('postingId', 'title')
    .populate('userId', 'clerkId')
    .lean();

  const clerkApps = applications.filter((app) => app.userId?.clerkId);
  const grouped = new Map();

  clerkApps.forEach((app) => {
    const title = app.postingId?.title || 'Unknown';
    grouped.set(title, (grouped.get(title) || 0) + 1);
  });

  return [...grouped.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

export async function getDashboardStats() {
  const [
    totalClerkStudents,
    pendingPortal,
    approvedStudents,
    rejectedPortal,
    activeEnrollments,
    completedEnrollments,
    totalApplications,
    pendingApplications,
    totalPostings,
    tasksInReview,
    recentPending,
    recentApplications,
    recentClerkStudents,
  ] = await Promise.all([
    User.countDocuments(CLERK_STUDENT_FILTER),
    User.countDocuments(clerkStudentQuery({ 'portalAccess.status': 'pending' })),
    User.countDocuments(clerkStudentQuery({ 'portalAccess.status': 'approved' })),
    User.countDocuments(clerkStudentQuery({ 'portalAccess.status': 'rejected' })),
    User.countDocuments(clerkStudentQuery({ 'portalAccess.enrollmentStatus': 'active' })),
    User.countDocuments(clerkStudentQuery({ 'portalAccess.enrollmentStatus': 'completed' })),
    InternshipApplication.countDocuments(),
    InternshipApplication.countDocuments({ status: 'pending' }),
    InternshipPosting.countDocuments({ isActive: true }),
    Task.countDocuments({ status: 'review' }),
    User.find(clerkStudentQuery({ 'portalAccess.status': 'pending' }))
      .sort({ 'portalAccess.submittedAt': -1 })
      .limit(5)
      .populate('portalAccess.postingId', 'title company duration level'),
    InternshipApplication.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({ path: 'userId', select: 'firstName lastName email avatar clerkId portalAccess.fullName' })
      .populate('postingId', 'title company'),
    User.find(CLERK_STUDENT_FILTER)
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email avatar createdAt clerkId portalAccess.fullName'),
  ]);

  const [signupsOverTime, portalStatusChart, enrollmentChart, applicationsByPosting] = await Promise.all([
    getSignupsOverTime(),
    getPortalStatusChart(),
    getEnrollmentChart(),
    getApplicationsByPosting(),
  ]);

  const clerkRecentApplications = recentApplications.filter((app) => app.userId?.clerkId);

  const verificationQueue = recentPending.map((user) => {
    const dto = toUserDTO(user);
    const posting = user.portalAccess?.postingId;
    return {
      id: dto.id,
      name: dto.portalAccess?.fullName || dto.name,
      email: dto.email,
      avatar: dto.avatar,
      internshipTitle: dto.portalAccess?.internshipTitle || posting?.title || '',
      company: posting?.company || '',
      institute: dto.portalAccess?.institute || '',
      submittedAt: dto.portalAccess?.submittedAt,
    };
  });

  const recentActivities = [
    ...clerkRecentApplications.map((app) => ({
      id: app._id.toString(),
      type: 'application',
      message: `${app.userId?.portalAccess?.fullName || app.userId?.firstName || 'Student'} ${app.userId?.lastName || ''}`.trim()
        + ` applied to ${app.postingId?.title || 'an internship'}`,
      at: app.createdAt,
    })),
    ...recentPending.map((user) => ({
      id: user._id.toString(),
      type: 'portal-access',
      message: `${user.portalAccess?.fullName || user.fullName} submitted portal access for ${user.portalAccess?.internshipTitle || 'an internship'}`,
      at: user.portalAccess?.submittedAt || user.updatedAt,
    })),
    ...recentClerkStudents.map((user) => ({
      id: `signup-${user._id.toString()}`,
      type: 'signup',
      message: `${user.portalAccess?.fullName || user.fullName} joined via Clerk`,
      at: user.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 10);

  return {
    stats: {
      totalClerkStudents,
      pendingPortal,
      approvedStudents,
      rejectedPortal,
      activeEnrollments,
      completedEnrollments,
      totalApplications,
      pendingApplications,
      totalPostings,
      tasksInReview,
    },
    verificationQueue,
    recentActivities,
    charts: {
      signupsOverTime,
      portalStatusChart,
      enrollmentChart,
      applicationsByPosting,
    },
    securityMetrics: [
      { label: 'Clerk Students', value: totalClerkStudents },
      { label: 'Pending Reviews', value: pendingPortal, urgent: pendingPortal > 0 },
      { label: 'Active Enrollments', value: activeEnrollments },
      { label: 'Tasks in Review', value: tasksInReview, urgent: tasksInReview > 0 },
    ],
  };
}

export async function listClerkStudents({
  page = 1,
  limit = 10,
  search,
  portalStatus,
  enrollmentStatus,
} = {}) {
  const filter = { ...CLERK_STUDENT_FILTER };

  if (portalStatus) {
    filter['portalAccess.status'] = portalStatus;
  }
  if (enrollmentStatus) {
    filter['portalAccess.enrollmentStatus'] = enrollmentStatus;
  }
  if (search?.trim()) {
    const term = search.trim();
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { email: regex },
      { firstName: regex },
      { lastName: regex },
      { 'portalAccess.fullName': regex },
      { 'portalAccess.institute': regex },
    ];
  }

  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  const enriched = await Promise.all(users.map((user) => enrichPortalAccessPosting(user)));

  const students = enriched.map((user) => {
    const dto = toUserDTO(user);
    return {
      ...dto,
      name: dto.portalAccess?.fullName || dto.name,
      displayName: dto.portalAccess?.fullName || dto.name,
      joinedAt: dto.createdAt,
      isClerkUser: Boolean(user.clerkId),
    };
  });

  return {
    students,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
    filters: {
      portalStatuses: ['unsubmitted', 'pending', 'approved', 'rejected'],
      enrollmentStatuses: ['none', 'active', 'completed'],
    },
  };
}

export async function getAdminReports() {
  const dashboard = await getDashboardStats();
  return {
    stats: dashboard.stats,
    charts: dashboard.charts,
    securityMetrics: dashboard.securityMetrics,
  };
}
