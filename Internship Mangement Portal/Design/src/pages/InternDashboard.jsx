import { useState, useMemo } from 'react';
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
import TaskTrackTimeline from '../components/student/TaskTrackTimeline';
import CertificatePanel from '../components/student/CertificatePanel';
import {
  studentStats, internshipTrack, taskTracks, trackTasks, certificationData,
} from '../constants/studentData';
import { useAuth } from '../context/AuthContext';
import { useAppPaths } from '../hooks/useAppPaths';
import { ROUTES } from '../constants';
const statIcons = { CheckCircle, TrendingUp, Clock, Star };

const taskStatusVariant = {
  completed: 'success',
  in_progress: 'primary',
  pending: 'default',
};

const taskStatusLabel = {
  completed: 'Done',
  in_progress: 'In Progress',
  pending: 'Pending',
};

export default function InternDashboard() {
  const { user } = useAuth();
  const paths = useAppPaths();
  const firstName = user?.name?.split(' ')[0] || 'Student';
  const fullName = user?.name || 'Student';

  const [certStatus, setCertStatus] = useState('pending');

  const allTracksComplete = useMemo(
    () => taskTracks.every((t) => t.status === 'completed'),
    []
  );

  const handleRequestVerification = () => {
    toast.success('Verification request sent to your mentor');
    setCertStatus('pending');
  };

  const handleDownload = () => {
    toast.success('Certificate download started');
  };

  const demoVerify = () => {
    setCertStatus('verified');
    toast.success('Internship verified! Certificate is now available.');
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-gradient-to-r from-white via-white to-emerald-50/60 relative overflow-hidden border-emerald-100/60">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <Avatar src={user?.avatar} name={fullName} size="lg" />
              <div>
                <p className="text-sm text-emerald-600 font-medium mb-0.5">{internshipTrack.cohort}</p>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Good morning, {firstName}!
                </h1>
                <p className="text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
                  <BookOpen className="w-4 h-4" />
                  {internshipTrack.title} Track
                  <span className="text-gray-300">|</span>
                  Mentor: {internshipTrack.mentor}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link to={paths.TASK_SUBMIT}>
                <Button variant="outline" icon={FileText}>Submit Work</Button>
              </Link>
              <Link to={paths.TASKS}>
                <Button variant="purple" icon={Clock}>View Tasks</Button>
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats */}
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

      {/* Task Tracks */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Internship Task Tracks</h2>
              <p className="text-sm text-gray-500">Your learning path from onboarding to certification</p>
            </div>
            <Link to={paths.PROGRESS}>
              <Button variant="purple-light" size="sm" icon={TrendingUp}>Track Progress</Button>
            </Link>
          </div>
          <TaskTrackTimeline tracks={taskTracks} />
        </Card>
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Current track tasks */}
          <Card>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Current Track Tasks</h2>
                <p className="text-xs text-gray-500">Core Project phase</p>
              </div>
              <Link to={paths.TASKS} className="text-sm font-medium text-emerald-600 hover:text-emerald-500 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {trackTasks.map((task) => (
                <Link
                  key={task.id}
                  to={paths.taskDetail(task.id)}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    task.status === 'completed' ? 'bg-emerald-100' : task.status === 'in_progress' ? 'bg-emerald-50' : 'bg-gray-100'
                  }`}>
                    {task.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <FileText className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-400">{task.track} &bull; Due {task.due}</p>
                  </div>
                  <Badge variant={taskStatusVariant[task.status]}>{taskStatusLabel[task.status]}</Badge>
                </Link>
              ))}
            </div>
          </Card>

          {/* Certification */}
          <Card id="certificate">
            <CertificatePanel
              studentName={fullName}
              certification={certificationData}
              track={internshipTrack}
              status={certStatus === 'verified' ? 'verified' : certStatus === 'pending' ? 'pending' : allTracksComplete ? 'pending' : 'locked'}
              onRequestVerification={handleRequestVerification}
              onDownload={handleDownload}
            />
            {certStatus !== 'verified' && (
              <p className="text-xs text-gray-400 mt-4 text-center">
                Demo: <button onClick={demoVerify} className="text-emerald-600 font-medium hover:underline">Simulate verification approval</button>
              </p>
            )}
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
            <DonutChart value={internshipTrack.progress} size={200} />
            <p className="text-center text-sm text-gray-500 mt-2">of internship complete</p>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Start Date</span>
                <span className="font-medium text-gray-900">{internshipTrack.startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">End Date</span>
                <span className="font-medium text-gray-900">{internshipTrack.endDate}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-red-50 flex flex-col items-center justify-center shrink-0 border border-red-100">
                  <span className="text-[10px] font-semibold text-red-400 uppercase">OCT</span>
                  <span className="text-xl font-bold text-red-600 leading-none">18</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">API Integration Due</p>
                  <p className="text-sm text-gray-500 mt-0.5">Core Project track task</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gray-100 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase">OCT</span>
                  <span className="text-xl font-bold text-gray-900 leading-none">25</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Mid-term Evaluation</p>
                  <p className="text-sm text-gray-500 mt-0.5">Submit self-reflection to HR</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Mentor Feedback</h2>
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100/50">
              <div className="flex items-center gap-3 mb-3">
                <Avatar src={internshipTrack.mentorAvatar} name={internshipTrack.mentor} size="sm" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{internshipTrack.mentor}</p>
                  <p className="text-xs text-gray-400">2 days ago</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 italic leading-relaxed">
                &ldquo;{firstName}, great progress on the dashboard project. Focus on API error handling
                and test coverage for the next submission.&rdquo;
              </p>
            </div>
            <Link to={paths.FEEDBACK} className="block mt-3 text-sm font-medium text-emerald-600 hover:text-emerald-500 text-center">
              View all feedback
            </Link>
          </Card>

          <Link to={paths.CERTIFICATE}>
            <Card className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white border-0 hover:shadow-premium-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-8 h-8 opacity-90" />
              <div>
                <p className="font-semibold">Earn Your Certificate</p>
                <p className="text-xs text-emerald-100">Complete all tracks to qualify</p>
              </div>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-white rounded-full" style={{ width: `${internshipTrack.progress}%` }} />
            </div>
            <p className="text-xs text-emerald-100">{internshipTrack.progress}% complete — keep going!</p>
            </Card>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
