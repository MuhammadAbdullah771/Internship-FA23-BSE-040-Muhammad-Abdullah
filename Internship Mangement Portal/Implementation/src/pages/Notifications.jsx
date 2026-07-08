import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { Clock, CheckSquare, MessageCircle, Info, Briefcase, UserPlus, FileText } from 'lucide-react';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useAppPaths } from '../hooks/useAppPaths';
import { fetchStudentDashboard } from '../services/studentService';
import { fetchMyApplications } from '../services/internshipService';
import { fetchAdminDashboard } from '../services/adminService';
import { useRealtimePoll } from '../hooks/useRealtimePoll';
import { useRealtimeStream } from '../hooks/useRealtimeStream';
import { ROUTES } from '../constants';

const iconMap = {
  deadline: { icon: Clock, color: 'bg-red-500/15 text-red-400' },
  task: { icon: CheckSquare, color: 'bg-emerald-500/15 text-emerald-400' },
  feedback: { icon: MessageCircle, color: 'bg-amber-500/15 text-amber-400' },
  system: { icon: Info, color: 'bg-blue-500/15 text-blue-400' },
  application: { icon: Briefcase, color: 'bg-violet-500/15 text-violet-400' },
  portal: { icon: FileText, color: 'bg-cyan-500/15 text-cyan-400' },
  signup: { icon: UserPlus, color: 'bg-emerald-500/15 text-emerald-400' },
};

function buildStudentNotifications(dashboard, applications, paths) {
  const items = [];
  const now = new Date();

  (dashboard?.upcomingDeadlines || []).forEach((task) => {
    const due = new Date(task.dueDate);
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    if (diffDays <= 3) {
      items.push({
        id: `deadline-${task.id}`,
        group: diffDays <= 0 ? 'Today' : 'This Week',
        type: 'deadline',
        title: diffDays <= 0 ? 'Task Overdue' : 'Upcoming Deadline',
        description: `"${task.title}" is ${diffDays <= 0 ? 'overdue' : `due in ${diffDays} day(s)`}`,
        time: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        link: { text: 'View Task', to: paths.taskDetail(task.id) },
        unread: diffDays <= 1,
      });
    }
  });

  (dashboard?.recentTasks || [])
    .filter((t) => t.status === 'review')
    .forEach((task) => {
      items.push({
        id: `review-${task.id}`,
        group: 'This Week',
        type: 'feedback',
        title: 'Task Under Review',
        description: `"${task.title}" has been submitted and is awaiting mentor review.`,
        time: 'Recently',
        link: { text: 'View Task', to: paths.taskDetail(task.id) },
        unread: true,
      });
    });

  (applications || []).forEach((app) => {
    items.push({
      id: `app-${app.id}`,
      group: 'Applications',
      type: 'application',
      title: `Application: ${app.posting?.title || 'Internship'}`,
      description: `Status: ${app.status.charAt(0).toUpperCase() + app.status.slice(1)}`,
      time: new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      link: { text: 'View Applications', to: ROUTES.STUDENT.APPLICATIONS },
      unread: app.status === 'pending',
    });
  });

  if (dashboard?.certificateStatus === 'pending') {
    items.push({
      id: 'cert-pending',
      group: 'This Week',
      type: 'system',
      title: 'Certificate Pending Verification',
      description: 'All tasks are complete. Your certificate is awaiting mentor verification.',
      time: 'Now',
      link: { text: 'View Certificate', to: paths.CERTIFICATE },
      unread: true,
    });
  }

  if (items.length === 0) {
    items.push({
      id: 'empty',
      group: 'General',
      type: 'system',
      title: "You're all caught up!",
      description: 'No new notifications. Check back after completing tasks or applying to internships.',
      time: '',
      unread: false,
    });
  }

  return items;
}

function buildAdminNotifications(dashboard) {
  const items = [];
  const stats = dashboard?.stats || {};

  if (stats.pendingPortal > 0) {
    items.push({
      id: 'pending-portal',
      group: 'Action Required',
      type: 'portal',
      title: `${stats.pendingPortal} portal application${stats.pendingPortal > 1 ? 's' : ''} pending`,
      description: 'Clerk students are waiting for portal access approval.',
      time: 'Now',
      link: { text: 'Review Approvals', to: ROUTES.SUPERADMIN.APPROVALS },
      unread: true,
    });
  }

  if (stats.tasksInReview > 0) {
    items.push({
      id: 'tasks-review',
      group: 'Action Required',
      type: 'task',
      title: `${stats.tasksInReview} task${stats.tasksInReview > 1 ? 's' : ''} in review`,
      description: 'Student submissions need your review.',
      time: 'Now',
      link: { text: 'View Tasks', to: ROUTES.SUPERADMIN.TASKS },
      unread: true,
    });
  }

  (dashboard?.recentActivities || []).slice(0, 8).forEach((activity) => {
    items.push({
      id: activity.id,
      group: 'Recent Activity',
      type: activity.type === 'signup' ? 'signup' : activity.type === 'application' ? 'application' : 'portal',
      title: activity.type === 'signup' ? 'New Clerk signup' : activity.type === 'application' ? 'New application' : 'Portal submission',
      description: activity.message,
      time: activity.at ? new Date(activity.at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '',
      unread: false,
    });
  });

  if (items.length === 0) {
    items.push({
      id: 'admin-empty',
      group: 'General',
      type: 'system',
      title: 'All clear',
      description: 'No pending actions. Clerk student activity will appear here in real time.',
      time: '',
      unread: false,
    });
  }

  return items;
}

export default function Notifications() {
  const { isStudent } = useAuth();
  const paths = useAppPaths();

  const studentQuery = useRealtimePoll(
    async () => {
      const [dashboard, applications] = await Promise.all([
        fetchStudentDashboard().catch(() => null),
        fetchMyApplications().catch(() => []),
      ]);
      return buildStudentNotifications(dashboard, applications, paths);
    },
    { interval: 12000, enabled: isStudent },
  );

  const adminQuery = useRealtimePoll(
    async () => {
      const dashboard = await fetchAdminDashboard();
      return buildAdminNotifications(dashboard);
    },
    { interval: 8000, enabled: !isStudent },
  );

  useRealtimeStream(
    ['portal-access:submitted', 'portal-access:reviewed', 'students:updated', 'applications:updated'],
    () => adminQuery.refresh(true),
    { enabled: !isStudent },
  );

  const notifications = useMemo(
    () => (isStudent ? studentQuery.data : adminQuery.data) || [],
    [isStudent, studentQuery.data, adminQuery.data],
  );

  const loading = isStudent ? studentQuery.loading : adminQuery.loading;
  const groups = [...new Set(notifications.map((n) => n.group))];

  if (loading && notifications.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Notifications"
        subtitle={isStudent ? 'Alerts about tasks, deadlines, and applications.' : 'Live alerts from Clerk students and portal activity.'}
        eyebrow="Inbox"
        dark={!isStudent}
      />

      {groups.map((group) => (
        <div key={group}>
          <h2 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isStudent ? 'text-gray-400' : 'text-slate-500'}`}>
            {group}
          </h2>
          <div className="space-y-3">
            {notifications
              .filter((n) => n.group === group)
              .map((notif) => {
                const { icon: Icon, color } = iconMap[notif.type] || iconMap.system;
                return (
                  <Card
                    key={notif.id}
                    className={`!p-4 ${notif.unread
                      ? isStudent
                        ? 'bg-primary-50/50 border-primary-100'
                        : 'bg-emerald-500/5 border-emerald-500/20'
                      : isStudent
                        ? ''
                        : 'bg-slate-800/40 border-slate-700/60'
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={`text-sm font-semibold ${isStudent ? 'text-gray-900' : 'text-white'}`}>{notif.title}</h3>
                          {notif.time && <span className={`text-xs shrink-0 ${isStudent ? 'text-gray-400' : 'text-slate-500'}`}>{notif.time}</span>}
                        </div>
                        <p className={`text-sm mt-1 ${isStudent ? 'text-gray-500' : 'text-slate-400'}`}>{notif.description}</p>
                        {notif.link && (
                          <Link to={notif.link.to} className="text-sm font-medium text-emerald-500 hover:text-emerald-400 mt-2 inline-block">
                            {notif.link.text}
                          </Link>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
