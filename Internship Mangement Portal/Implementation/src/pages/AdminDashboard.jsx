import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, UserCheck, CheckCircle, Briefcase, Shield, Lock, TrendingUp,
  AlertTriangle, RefreshCw, FileText, Clock, GraduationCap, UserPlus,
} from 'lucide-react';
import DashboardCard from '../components/common/DashboardCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import AreaLineChart from '../components/charts/AreaLineChart';
import BarChartComponent from '../components/charts/BarChartComponent';
import DepartmentDonut from '../components/charts/DepartmentDonut';
import { ROUTES } from '../constants';
import { useAuth } from '../context/AuthContext';
import { fetchAdminDashboard } from '../services/adminService';
import { useRealtimePoll } from '../hooks/useRealtimePoll';
import { useRealtimeStream } from '../hooks/useRealtimeStream';

const statIcons = { Users, UserCheck, CheckCircle, Briefcase };

function formatRelativeTime(date) {
  if (!date) return '—';
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(date).toLocaleDateString();
}

const activityIcons = {
  application: Briefcase,
  'portal-access': FileText,
  signup: UserPlus,
};

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data, loading, lastUpdated, refresh } = useRealtimePoll(fetchAdminDashboard, { interval: 8000 });

  useRealtimeStream(
    [
      'portal-access:submitted',
      'portal-access:reviewed',
      'portal-access:updated',
      'students:updated',
      'applications:updated',
    ],
    () => refresh(true),
  );

  const stats = data?.stats;
  const charts = data?.charts || {};

  const adminStats = stats ? [
    { label: 'Clerk Students', value: stats.totalClerkStudents, change: 'Live', icon: 'Users', color: 'emerald', iconColor: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pending Reviews', value: stats.pendingPortal, change: 'Live', icon: 'UserCheck', color: 'amber', iconColor: 'bg-amber-50 text-amber-600' },
    { label: 'Active Enrollments', value: stats.activeEnrollments, change: 'Live', icon: 'CheckCircle', color: 'blue', iconColor: 'bg-blue-50 text-blue-600' },
    { label: 'Applications', value: stats.totalApplications, change: 'Live', icon: 'Briefcase', color: 'purple', iconColor: 'bg-violet-50 text-violet-600' },
  ] : [];

  const verificationQueue = data?.verificationQueue || [];
  const securityMetrics = data?.securityMetrics || [];
  const recentActivities = data?.recentActivities || [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card glass className="relative overflow-hidden border-0 !p-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/8 via-transparent to-teal-500/10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Admin Command Center</h1>
                    <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px]">
                      <Lock className="w-3 h-3 mr-1" /> Real-time
                    </Badge>
                  </div>
                  <p className="text-gray-500 text-sm max-w-xl">
                    Live data from Clerk-authenticated students only. No seeded or dummy records.
                    {lastUpdated ? ` · Updated ${lastUpdated.toLocaleTimeString()}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" icon={RefreshCw} onClick={() => refresh(false)}>
                  Refresh
                </Button>
                <Link to={ROUTES.SUPERADMIN.APPROVALS}>
                  <Button variant="outline" icon={UserCheck}>
                    Approvals
                  </Button>
                </Link>
                <Link to={ROUTES.SUPERADMIN.INTERNS}>
                  <Button className="!from-emerald-600 !to-teal-500" icon={Users}>Clerk Students</Button>
                </Link>
              </div>
            </div>

            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-100">
              {(securityMetrics.length ? securityMetrics : [{ label: 'Loading...', value: '—' }]).map((m) => (
                <div key={m.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-slate-200/60 backdrop-blur-sm">
                  {m.urgent && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
                  <div>
                    <p className="text-xl font-bold text-gray-900">{m.value}</p>
                    <p className="text-[11px] text-gray-500">{m.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {(loading && !data ? [{ label: 'Loading...', value: '—', icon: 'Users', iconColor: 'bg-emerald-50 text-emerald-600' }] : adminStats).map((stat, i) => {
          const Icon = statIcons[stat.icon];
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <DashboardCard {...stat} icon={Icon} />
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card glass className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Portal Access Queue</h2>
              <p className="text-sm text-gray-500">Clerk students awaiting review</p>
            </div>
            <Badge className="bg-amber-50 text-amber-700 border border-amber-100">
              {verificationQueue.length} pending
            </Badge>
          </div>
          <div className="space-y-3">
            {verificationQueue.length === 0 ? (
              <p className="text-sm text-gray-500 py-8 text-center rounded-xl border border-dashed border-gray-200">
                No pending portal applications from Clerk students
              </p>
            ) : verificationQueue.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white/70 hover:border-emerald-200 transition-all"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar src={item.avatar} name={item.name} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 truncate">{item.internshipTitle} · {item.company || item.institute}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Submitted {formatRelativeTime(item.submittedAt)}</p>
                  </div>
                </div>
                <Link to={ROUTES.SUPERADMIN.APPROVALS}>
                  <Button size="sm" className="!from-emerald-600 !to-teal-500">Review</Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>

        <Card glass>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Live Snapshot</h2>
          <p className="text-sm text-gray-500 mb-5">Clerk student platform totals</p>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Rejected applications</span><strong className="text-gray-900">{stats?.rejectedPortal ?? '—'}</strong></div>
            <div className="flex justify-between"><span className="text-gray-500">Completed enrollments</span><strong className="text-gray-900">{stats?.completedEnrollments ?? '—'}</strong></div>
            <div className="flex justify-between"><span className="text-gray-500">Open applications</span><strong className="text-gray-900">{stats?.pendingApplications ?? '—'}</strong></div>
            <div className="flex justify-between"><span className="text-gray-500">Active postings</span><strong className="text-gray-900">{stats?.totalPostings ?? '—'}</strong></div>
            <div className="flex justify-between"><span className="text-gray-500">Tasks in review</span><strong className="text-gray-900">{stats?.tasksInReview ?? '—'}</strong></div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card glass className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-900">Clerk Signups (8 weeks)</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">New student accounts synced from Clerk</p>
          <AreaLineChart data={charts.signupsOverTime} emptyMessage="No Clerk signups yet" />
        </Card>
        <Card glass>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Enrollment Status</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">Active vs completed internships</p>
          <DepartmentDonut
            data={charts.enrollmentChart}
            centerLabel={stats ? `${stats.activeEnrollments} Active` : '0 Active'}
            emptyMessage="No enrollments yet"
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card glass>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Portal Status Breakdown</h2>
          <p className="text-sm text-gray-500 mb-4">Clerk students by application status</p>
          <BarChartComponent
            data={charts.portalStatusChart}
            emptyMessage="No Clerk students yet"
          />
        </Card>
        <Card glass>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Applications by Internship</h2>
          <p className="text-sm text-gray-500 mb-4">From Clerk-authenticated students</p>
          <BarChartComponent
            data={charts.applicationsByPosting}
            emptyMessage="No applications yet"
          />
        </Card>
      </div>

      <Card glass>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-2">
          {recentActivities.length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">No activity from Clerk students yet</p>
          ) : recentActivities.map((activity) => {
            const Icon = activityIcons[activity.type] || FileText;
            return (
              <div key={`${activity.type}-${activity.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> {formatRelativeTime(activity.at)}
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
