import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, UserCheck, CheckCircle, Briefcase, Eye, ChevronDown,
  Shield, Award, FileText, UserPlus, Calendar, Check, X, Lock,
  TrendingUp, AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardCard from '../components/common/DashboardCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import AreaLineChart from '../components/charts/AreaLineChart';
import BarChartComponent from '../components/charts/BarChartComponent';
import {
  adminStats, adminSecurityMetrics, verificationQueue,
  cohortOverview, recentActivities, adminNotifications,
} from '../constants/adminData';
import { ROUTES } from '../constants';
import { useAuth } from '../context/AuthContext';

const statIcons = { Users, UserCheck, CheckCircle, Briefcase };
const activityIcons = { FileText, UserPlus, Calendar, Award };

export default function AdminDashboard() {
  const { user } = useAuth();

  const handleApprove = (name) => {
    toast.success(`Certificate approved for ${name}`);
  };

  const handleReject = (name) => {
    toast.error(`Verification rejected for ${name}`);
  };

  return (
    <div className="space-y-6">
      {/* Secure header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 border-slate-700 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl lg:text-3xl font-bold">Secure Admin Overview</h1>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
                    <Lock className="w-3 h-3 mr-1" /> Protected
                  </Badge>
                </div>
                <p className="text-slate-400 text-sm">
                  Welcome back, {user?.name?.split(' ')[0] || 'Admin'}. Monitor programs, verify completions, and manage your cohort.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to={ROUTES.SUPERADMIN.INTERNS}>
                <Button variant="outline" className="!border-slate-600 !text-slate-200 !bg-slate-700/50 hover:!bg-slate-700" icon={Users}>
                  Manage Interns
                </Button>
              </Link>
              <Link to={ROUTES.SUPERADMIN.REPORTS}>
                <Button variant="purple" icon={TrendingUp}>View Reports</Button>
              </Link>
            </div>
          </div>

          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-700">
            {adminSecurityMetrics.map((m) => (
              <div key={m.label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/40 border border-slate-600/50">
                {m.urgent && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                <div>
                  <p className="text-xl font-bold text-white">{m.value}</p>
                  <p className="text-[11px] text-slate-400">{m.label}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {adminStats.map((stat, i) => {
          const Icon = statIcons[stat.icon];
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <DashboardCard {...stat} icon={Icon} />
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification queue */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                Certificate Verification Queue
              </h2>
              <p className="text-sm text-gray-500">Review and approve internship completion requests</p>
            </div>
            <Badge variant="warning">{verificationQueue.length} Pending</Badge>
          </div>
          <div className="space-y-3">
            {verificationQueue.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar src={item.avatar} name={item.name} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.track} &bull; {item.progress}% complete</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Requested {item.requestedAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={X}
                    onClick={() => handleReject(item.name)}
                    className="!text-red-600 !border-red-200 hover:!bg-red-50"
                  >
                    Reject
                  </Button>
                  <Button variant="purple" size="sm" icon={Check} onClick={() => handleApprove(item.name)}>
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Cohort overview */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Cohort Overview</h2>
          <p className="text-sm text-gray-500 mb-5">Completion rates by department</p>
          <div className="space-y-4">
            {cohortOverview.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-700">{c.name}</span>
                  <span className="text-gray-500">{c.interns} interns &bull; {c.completion}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.completion}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
            <button className="flex items-center gap-1 text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
              This Month <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <AreaLineChart />
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Weekly Attendance</h2>
          </div>
          <BarChartComponent />
        </Card>
      </div>

      {/* Activities & alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            <button className="text-sm font-medium text-emerald-600 hover:text-emerald-500">View All</button>
          </div>
          <div className="space-y-1">
            {recentActivities.map((activity) => {
              const Icon = activityIcons[activity.icon] || FileText;
              return (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activity.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">
                      {activity.text} <span className="font-semibold text-gray-900">{activity.highlight}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{activity.time} &bull; {activity.dept}</p>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-gray-100" aria-label="View activity">
                    <Eye className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">System Alerts</h2>
            <Badge variant="danger">3 New</Badge>
          </div>
          <div className="space-y-3">
            {adminNotifications.map((notif) => (
              <div key={notif.id} className={`p-4 rounded-xl border ${notif.color}`}>
                <div className="flex items-start gap-2">
                  {notif.urgent && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{notif.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
