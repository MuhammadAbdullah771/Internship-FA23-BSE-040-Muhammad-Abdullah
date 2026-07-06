import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import DonutChart from '../components/charts/DonutChart';
import { useAuth } from '../context/AuthContext';
import { useAppPaths } from '../hooks/useAppPaths';
import { fetchStudentDashboard } from '../services/studentService';

const STATUS_MILESTONES = [
  { key: 'onboarding', title: 'Portal Onboarding', description: 'Complete your portal access application' },
  { key: 'approved', title: 'Portal Approved', description: 'Get approved to access the internship portal' },
  { key: 'first_task', title: 'First Task Assigned', description: 'Receive your first internship assignment' },
  { key: 'halfway', title: 'Halfway Point', description: 'Complete 50% of your assigned tasks' },
  { key: 'all_done', title: 'All Tasks Complete', description: 'Finish every assigned task' },
  { key: 'certificate', title: 'Certificate Ready', description: 'Earn your internship certificate' },
];

export default function ProgressTracking() {
  const { user, isStudent } = useAuth();
  const paths = useAppPaths();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(isStudent);

  const loadProgress = useCallback(async () => {
    if (!isStudent) return;
    setLoading(true);
    try {
      const data = await fetchStudentDashboard();
      setDashboard(data);
    } catch {
      toast.error('Failed to load progress');
    } finally {
      setLoading(false);
    }
  }, [isStudent]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  if (!isStudent) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Progress Tracking</h1>
        <Card>
          <p className="text-gray-500 text-center py-12">Use the admin dashboard to view intern progress.</p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
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
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Progress Tracking</h1>
        <p className="text-gray-500 mt-1">Monitor your internship milestones and task completion.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
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

        <Card>
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
