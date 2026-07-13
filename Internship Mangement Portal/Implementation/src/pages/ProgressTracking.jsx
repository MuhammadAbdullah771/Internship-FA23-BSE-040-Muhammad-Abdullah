import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { Check, ExternalLink, RefreshCw, Users } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import DonutChart from '../components/charts/DonutChart';
import { useAuth } from '../context/AuthContext';
import { useAppPaths } from '../hooks/useAppPaths';
import { fetchStudentDashboard } from '../services/studentService';
import { fetchAdminProgress } from '../services/adminService';
import { useRealtimePoll } from '../hooks/useRealtimePoll';
import { useRealtimeStream } from '../hooks/useRealtimeStream';
import { ROUTES } from '../constants';

const STATUS_MILESTONES = [
  { key: 'onboarding', title: 'Portal Onboarding', description: 'Complete your portal access application' },
  { key: 'approved', title: 'Portal Approved', description: 'Get approved to access the internship portal' },
  { key: 'first_task', title: 'First Task Assigned', description: 'Receive your first internship assignment' },
  { key: 'halfway', title: 'Halfway Point', description: 'Complete 50% of your assigned tasks' },
  { key: 'all_done', title: 'All Tasks Complete', description: 'Finish every assigned task' },
  { key: 'certificate', title: 'Certificate Ready', description: 'Earn your internship certificate' },
];

function AdminProgressView() {
  const { data, loading, lastUpdated, refresh } = useRealtimePoll(fetchAdminProgress, { interval: 10000 });

  useRealtimeStream(
    ['students:updated', 'portal-access:reviewed', 'portal-access:updated', 'tasks:updated'],
    () => refresh(true),
  );

  const students = data?.students || [];
  const summary = data?.summary || {};

  if (loading && !data) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Progress"
        subtitle="Live internship progress for Clerk-authenticated students."
        actions={(
          <Button variant="outline" icon={RefreshCw} onClick={() => refresh(false)}>
            Refresh
          </Button>
        )}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Clerk Students', value: summary.totalStudents ?? 0 },
          { label: 'Active Enrollments', value: summary.activeEnrollments ?? 0 },
          { label: 'With Tasks', value: summary.withTasks ?? 0 },
          { label: 'Avg Progress', value: `${summary.avgProgress ?? 0}%` },
        ].map((item) => (
          <Card key={item.label} glass className="p-4">
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
          </Card>
        ))}
      </div>

      {lastUpdated && (
        <p className="text-xs text-gray-500">Updated {lastUpdated.toLocaleTimeString()}</p>
      )}

      {students.length === 0 ? (
        <Card glass className="p-12 text-center">
          <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No Clerk students yet</p>
          <p className="text-sm text-gray-500 mt-1">Progress appears after students sign in with Clerk.</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {students.map((student) => (
            <Card key={student.id} glass className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar src={student.avatar} name={student.name} />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{student.name}</p>
                    <p className="text-sm text-gray-500 truncate">{student.email}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {student.internshipTitle || 'No internship'} · {student.institute || '—'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant={student.portalAccessStatus === 'approved' ? 'success' : 'warning'}>
                    {student.portalAccessStatus}
                  </Badge>
                  <Badge variant={student.enrollmentStatus === 'active' ? 'success' : 'default'}>
                    {student.enrollmentStatus}
                  </Badge>
                  <div className="min-w-[140px]">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Tasks</span>
                      <span>{student.taskStats.completed}/{student.taskStats.total}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${student.taskStats.progressPercent}%` }}
                      />
                    </div>
                  </div>
                  <Link to={ROUTES.SUPERADMIN.TASKS}>
                    <Button size="sm" variant="outline">
                      Tasks
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProgressTracking() {
  const { user, isStudent } = useAuth();
  const paths = useAppPaths();

  const {
    data: dashboard,
    loading,
    refresh,
  } = useRealtimePoll(fetchStudentDashboard, { interval: 10000, enabled: isStudent });

  useRealtimeStream(
    ['tasks:updated', 'portal-access:updated', 'portal-access:reviewed'],
    () => refresh(true),
    { enabled: isStudent },
  );

  if (!isStudent) {
    return <AdminProgressView />;
  }

  if (loading && !dashboard) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-500">Could not load progress.</p>
        <Button onClick={() => refresh(false)}>Try again</Button>
      </div>
    );
  }

  const stats = dashboard?.stats || {};
  const progress = stats.progressPercent || 0;
  const portalApproved = user?.portalAccessStatus === 'approved';
  const hasTasks = stats.total > 0;
  const allDone = hasTasks && stats.completed === stats.total;
  const certReady = dashboard?.certificateStatus === 'verified';

  const milestoneState = {
    onboarding: user?.portalAccessStatus !== 'unsubmitted',
    approved: portalApproved,
    first_task: hasTasks,
    halfway: progress >= 50,
    all_done: allDone,
    certificate: certReady,
  };

  const activeIndex = STATUS_MILESTONES.findIndex((m) => !milestoneState[m.key]);
  const currentIndex = activeIndex === -1 ? STATUS_MILESTONES.length - 1 : activeIndex;

  const tasksByStatus = [
    { label: 'To Do', count: stats.todo || 0, color: 'bg-gray-400' },
    { label: 'In Progress', count: stats.inProgress || 0, color: 'bg-blue-500' },
    { label: 'In Review', count: stats.review || 0, color: 'bg-amber-500' },
    { label: 'Completed', count: stats.completed || 0, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Progress Tracking"
        subtitle="Monitor your internship milestones and task completion."
        eyebrow="Performance"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card glass hover>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Overall Progress</h2>
            <Link to={paths.TASKS} className="text-sm text-emerald-600 hover:text-emerald-500 flex items-center gap-1">
              View Tasks <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
          <DonutChart value={progress} size={220} label={progress >= 80 ? 'EXCELLENT' : progress >= 50 ? 'GOOD' : 'IN PROGRESS'} />
          <div className="flex items-center justify-center gap-8 mt-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-xs text-gray-400">Completed</p>
              <p className="text-lg font-bold text-gray-900">{stats.completed || 0}</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <p className="text-xs text-gray-400">Total Tasks</p>
              <p className="text-lg font-bold text-gray-900">{stats.total || 0}</p>
            </div>
          </div>
        </Card>

        <Card glass hover>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Breakdown</h2>
          <div className="space-y-4">
            {tasksByStatus.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-semibold text-gray-900">{item.count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: stats.total ? `${(item.count / stats.total) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Internship Milestones</h2>
          <Badge variant="primary">{STATUS_MILESTONES.filter((m) => milestoneState[m.key]).length} / {STATUS_MILESTONES.length}</Badge>
        </div>
        <div className="space-y-4">
          {STATUS_MILESTONES.map((m, i) => {
            const completed = milestoneState[m.key];
            const active = i === currentIndex && !completed;
            return (
              <div
                key={m.key}
                className={`flex gap-4 p-4 rounded-xl ${active ? 'bg-primary-50' : ''}`}
              >
                <div className="flex flex-col items-center">
                  {completed ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  ) : active ? (
                    <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold text-sm ${!completed && !active ? 'text-gray-400' : 'text-gray-900'}`}>
                      {m.title}
                    </h3>
                    {completed && <Badge variant="success" className="text-[10px]">Done</Badge>}
                    {active && <Badge variant="primary" className="text-[10px]">Current</Badge>}
                  </div>
                  <p className={`text-xs ${!completed && !active ? 'text-gray-400' : 'text-gray-500'}`}>
                    {m.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
