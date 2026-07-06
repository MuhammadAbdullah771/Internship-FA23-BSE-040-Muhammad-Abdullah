import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, TrendingUp, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DashboardCard from '../components/common/DashboardCard';
import { useAuth } from '../context/AuthContext';
import { useAppPaths } from '../hooks/useAppPaths';
import { fetchStudentDashboard } from '../services/studentService';
import AreaLineChart from '../components/charts/AreaLineChart';
import DepartmentDonut from '../components/charts/DepartmentDonut';

export default function Reports() {
  const { isStudent } = useAuth();
  const paths = useAppPaths();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(isStudent);

  useEffect(() => {
    if (!isStudent) return;
    fetchStudentDashboard()
      .then(setDashboard)
      .catch(() => toast.error('Failed to load reports'))
      .finally(() => setLoading(false));
  }, [isStudent]);

  if (!isStudent) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Reports &amp; Analytics</h1>
        <Card>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <AreaLineChart height={300} />
            </Card>
            <DepartmentDonut />
          </div>
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

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Reports</h1>
        <p className="text-gray-500 mt-1">Your personal internship performance summary.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard
          label="Task Completion"
          value={`${progress}%`}
          change={`${stats.completed || 0} of ${stats.total || 0} tasks done`}
          icon={CheckCircle}
          iconColor="bg-emerald-50 text-emerald-600"
        >
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </DashboardCard>
        <DashboardCard
          label="In Progress"
          value={String(stats.inProgress || 0)}
          subtext={`${stats.review || 0} awaiting review`}
          icon={TrendingUp}
          iconColor="bg-blue-50 text-blue-600"
        />
        <DashboardCard
          label="Pending Tasks"
          value={String(stats.todo || 0)}
          subtext="Not yet started"
          icon={Clock}
          iconColor="bg-amber-50 text-amber-600"
        />
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'To Do', count: stats.todo || 0, color: 'text-gray-600' },
            { label: 'In Progress', count: stats.inProgress || 0, color: 'text-blue-600' },
            { label: 'In Review', count: stats.review || 0, color: 'text-amber-600' },
            { label: 'Completed', count: stats.completed || 0, color: 'text-emerald-600' },
          ].map((item) => (
            <div key={item.label} className="text-center p-4 bg-gray-50 rounded-xl">
              <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
              <p className="text-xs text-gray-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <Link to={paths.TASKS}>
            <Button variant="purple" icon={FileText}>View All Tasks</Button>
          </Link>
          <Link to={paths.PROGRESS}>
            <Button variant="outline" icon={TrendingUp}>Track Progress</Button>
          </Link>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Internship Track</h2>
        <p className="text-gray-600">{dashboard?.trackTitle || 'Internship'}</p>
        {dashboard?.institute && (
          <p className="text-sm text-gray-500 mt-1">{dashboard.institute}</p>
        )}
      </Card>
    </div>
  );
}
