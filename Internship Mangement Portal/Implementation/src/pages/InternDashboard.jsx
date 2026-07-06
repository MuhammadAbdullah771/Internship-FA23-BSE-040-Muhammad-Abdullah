import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, Clock, CheckCircle, TrendingUp, Star,
  ArrowRight, BookOpen, Award,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import DonutChart from '../components/charts/DonutChart';
import Avatar from '../components/ui/Avatar';
import DashboardStatCard from '../components/student/DashboardStatCard';
import CertificatePanel from '../components/student/CertificatePanel';
import { useAuth } from '../context/AuthContext';
import { useAppPaths } from '../hooks/useAppPaths';
import { fetchStudentDashboard } from '../services/studentService';

const statIcons = { CheckCircle, TrendingUp, Clock, Star };

const taskStatusVariant = {
  done: 'success',
  in_progress: 'primary',
  todo: 'default',
  review: 'warning',
};

const taskStatusLabel = {
  done: 'Done',
  in_progress: 'In Progress',
  todo: 'To Do',
  review: 'In Review',
};

function formatDeadline(dueDate) {
  if (!dueDate) return 'No due date';
  const due = new Date(dueDate);
  const now = new Date();
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays < 0) return 'Overdue';
  return due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDeadlineBox(dueDate) {
  if (!dueDate) return { month: '—', day: '—', urgent: false };
  const due = new Date(dueDate);
  const now = new Date();
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  return {
    month: due.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: due.getDate(),
    urgent: diffDays <= 1,
  };
}

export default function InternDashboard() {
  const { user } = useAuth();
  const paths = useAppPaths();
  const firstName = user?.name?.split(' ')[0] || 'Student';
  const fullName = user?.name || 'Student';

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchStudentDashboard();
      setDashboard(data);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleRequestVerification = () => {
    toast.success('Verification request sent to your mentor');
  };

  const handleDownload = () => {
    toast.success('Certificate download will be available once verified');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = dashboard?.stats || {};
  const recentTasks = dashboard?.recentTasks || [];
  const upcomingDeadlines = dashboard?.upcomingDeadlines || [];
  const progress = stats.progressPercent || 0;
  const trackTitle = dashboard?.trackTitle || 'Internship';
  const cohort = dashboard?.cohort || 'Internship Program';
  const certStatus = dashboard?.certificateStatus || 'locked';

  const studentStats = [
    { label: 'Tasks Completed', value: String(stats.completed || 0), change: `${stats.total || 0} total`, icon: 'CheckCircle', color: 'emerald' },
    { label: 'In Progress', value: String(stats.inProgress || 0), change: `${stats.review || 0} in review`, icon: 'TrendingUp', color: 'blue' },
    { label: 'Pending', value: String(stats.todo || 0), change: 'To do', icon: 'Clock', color: 'amber' },
    { label: 'Progress', value: `${progress}%`, change: 'Overall completion', icon: 'Star', color: 'purple' },
  ];

  const certificationData = {
    program: trackTitle,
    grade: progress >= 80 ? 'A' : progress >= 60 ? 'B' : 'In Progress',
    skills: dashboard?.intern?.track ? [dashboard.intern.track] : [trackTitle],
    completionDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    certificateId: user?.id ? `IH-${user.id.slice(-8).toUpperCase()}` : 'IH-PENDING',
  };

  const internshipTrack = {
    title: trackTitle,
    cohort,
    mentor: 'Your Mentor',
    progress,
    startDate: user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '—',
    endDate: '—',
  };

  const firstInProgressTask = recentTasks.find((t) => t.status === 'in_progress') || recentTasks[0];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-gradient-to-r from-white via-white to-emerald-50/60 relative overflow-hidden border-emerald-100/60">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <Avatar src={user?.avatar} name={fullName} size="lg" />
              <div>
                <p className="text-sm text-emerald-600 font-medium mb-0.5">{cohort}</p>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Good morning, {firstName}!
                </h1>
                <p className="text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
                  <BookOpen className="w-4 h-4" />
                  {trackTitle} Track
                  {dashboard?.institute && (
                    <>
                      <span className="text-gray-300">|</span>
                      {dashboard.institute}
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {firstInProgressTask && (
                <Link to={paths.taskSubmit(firstInProgressTask.id)}>
                  <Button variant="outline" icon={FileText}>Submit Work</Button>
                </Link>
              )}
              <Link to={paths.TASKS}>
                <Button variant="purple" icon={Clock}>View Tasks</Button>
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {studentStats.map((stat, i) => {
          const Icon = statIcons[stat.icon];
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <DashboardStatCard {...stat} icon={Icon} />
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Current Tasks</h2>
                <p className="text-xs text-gray-500">Your active assignments</p>
              </div>
              <Link to={paths.TASKS} className="text-sm font-medium text-emerald-600 hover:text-emerald-500 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {recentTasks.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No tasks assigned yet. Check back soon!</p>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <Link
                    key={task.id}
                    to={paths.taskDetail(task.id)}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      task.status === 'done' ? 'bg-emerald-100' : task.status === 'in_progress' ? 'bg-emerald-50' : 'bg-gray-100'
                    }`}>
                      {task.status === 'done' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-400">{formatDeadline(task.dueDate)}</p>
                    </div>
                    <Badge variant={taskStatusVariant[task.status] || 'default'}>
                      {taskStatusLabel[task.status] || task.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          <Card id="certificate">
            <CertificatePanel
              studentName={fullName}
              certification={certificationData}
              track={internshipTrack}
              status={certStatus}
              onRequestVerification={handleRequestVerification}
              onDownload={handleDownload}
            />
          </Card>
        </motion.div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Progress</h2>
            <DonutChart value={progress} size={200} />
            <p className="text-center text-sm text-gray-500 mt-2">of internship complete</p>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Tasks Done</span>
                <span className="font-medium text-gray-900">{stats.completed || 0} / {stats.total || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Applications</span>
                <span className="font-medium text-gray-900">{stats.applicationCount || 0}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h2>
            {upcomingDeadlines.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No upcoming deadlines</p>
            ) : (
              <div className="space-y-4">
                {upcomingDeadlines.slice(0, 3).map((task) => {
                  const box = formatDeadlineBox(task.dueDate);
                  return (
                    <Link
                      key={task.id}
                      to={paths.taskDetail(task.id)}
                      className="flex items-start gap-4 hover:bg-gray-50 -mx-2 px-2 py-1 rounded-lg transition-colors"
                    >
                      <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 border ${
                        box.urgent ? 'bg-red-50 border-red-100' : 'bg-gray-100 border-gray-100'
                      }`}>
                        <span className={`text-[10px] font-semibold uppercase ${box.urgent ? 'text-red-400' : 'text-gray-400'}`}>
                          {box.month}
                        </span>
                        <span className={`text-xl font-bold leading-none ${box.urgent ? 'text-red-600' : 'text-gray-900'}`}>
                          {box.day}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{task.title}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{formatDeadline(task.dueDate)}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </Card>

          <Link to={paths.APPLICATIONS}>
            <Card className="hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">My Applications</p>
                  <p className="text-sm text-gray-500">{stats.applicationCount || 0} application(s)</p>
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-600" />
              </div>
            </Card>
          </Link>

          <Link to={paths.CERTIFICATE}>
            <Card className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white border-0 hover:shadow-premium-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-8 h-8 opacity-90" />
                <div>
                  <p className="font-semibold">Earn Your Certificate</p>
                  <p className="text-xs text-emerald-100">Complete all tasks to qualify</p>
                </div>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-emerald-100">{progress}% complete — keep going!</p>
            </Card>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
