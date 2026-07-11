import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, ArrowRight, ClipboardList, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import InternshipLoginPanel from './InternshipLoginPanel';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { fetchInternshipPostings, applyToInternship } from '../../services/internshipService';
import { fetchStudentDashboard } from '../../services/studentService';
import { useAuth } from '../../context/AuthContext';
import { useRealtimePoll } from '../../hooks/useRealtimePoll';
import { useRealtimeStream } from '../../hooks/useRealtimeStream';
import { isStudentPortalApproved, ROUTES } from '../../constants';

const statusLabel = {
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'In Review',
  done: 'Done',
};

const statusVariant = {
  todo: 'default',
  in_progress: 'primary',
  review: 'warning',
  done: 'success',
};

export default function InternshipPortalContent() {
  const [postings, setPostings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { isAuthenticated, isStudent, user } = useAuth();
  const portalReady = isAuthenticated && isStudent && isStudentPortalApproved(user);

  const {
    data: dashboard,
    refresh: refreshDashboard,
  } = useRealtimePoll(fetchStudentDashboard, {
    interval: 10000,
    enabled: portalReady,
  });

  useRealtimeStream(['tasks:updated'], () => refreshDashboard(true), { enabled: portalReady });

  useEffect(() => {
    setLoading(true);
    fetchInternshipPostings(filter === 'trending' ? { trending: true } : {})
      .then(setPostings)
      .catch(() => toast.error('Failed to load internships'))
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => {
    if (location.hash !== '#internship-programs') return;
    const timer = window.setTimeout(() => {
      document.getElementById('internship-programs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    return () => window.clearTimeout(timer);
  }, [location.hash, loading]);

  const handleApply = async (posting) => {
    if (!isAuthenticated || !isStudent) {
      toast.error('Please sign in to apply for internships');
      return;
    }
    const result = await applyToInternship(posting.id);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(result.message);
  };

  const myTasks = dashboard?.recentTasks || [];
  const taskStats = dashboard?.stats;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="text-center mb-10">
        <span className="inline-block px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full mb-3">
          Internship Portal
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          {portalReady ? (
            <>Your <span className="text-emerald-600">Internship Hub</span></>
          ) : (
            <>Find Your <span className="text-emerald-600">Dream Internship</span></>
          )}
        </h1>
        <p className="mt-3 text-gray-500 max-w-xl mx-auto">
          {portalReady
            ? 'View tasks assigned by your superadmin and explore available internship tracks.'
            : 'Sign in on the left with Google or email, then apply to any track below.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-6">
          <InternshipLoginPanel />

          {portalReady && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-premium p-5">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList className="w-5 h-5 text-emerald-600" />
                <h2 className="font-bold text-gray-900">My Assigned Tasks</h2>
              </div>

              {taskStats && (
                <div className="grid grid-cols-2 gap-2 mb-4 text-center">
                  <div className="rounded-xl bg-emerald-50 p-2">
                    <p className="text-lg font-bold text-emerald-700">{taskStats.total || 0}</p>
                    <p className="text-[10px] text-emerald-600 font-semibold">Total</p>
                  </div>
                  <div className="rounded-xl bg-amber-50 p-2">
                    <p className="text-lg font-bold text-amber-700">{(taskStats.todo || 0) + (taskStats.inProgress || 0) + (taskStats.review || 0)}</p>
                    <p className="text-[10px] text-amber-600 font-semibold">Open</p>
                  </div>
                </div>
              )}

              {myTasks.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">
                  No tasks assigned yet. Your superadmin will assign tasks here.
                </p>
              ) : (
                <div className="space-y-3">
                  {myTasks.map((task) => (
                    <Link
                      key={task.id}
                      to={ROUTES.STUDENT.taskDetail(task.id)}
                      className="block p-3 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-2">{task.title}</p>
                        <Badge variant={statusVariant[task.status] || 'default'} className="shrink-0">
                          {statusLabel[task.status] || task.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{task.date}</p>
                    </Link>
                  ))}
                </div>
              )}

              <Link to={ROUTES.STUDENT.TASKS} className="block mt-4">
                <Button variant="outline" className="w-full" icon={ArrowRight}>
                  Open Task Board
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {portalReady && dashboard?.trackTitle && (
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-1">Your enrollment</p>
                <h2 className="text-lg font-bold text-gray-900">{dashboard.trackTitle}</h2>
                {dashboard.institute && <p className="text-sm text-gray-500">{dashboard.institute}</p>}
              </div>
              <div className="flex gap-2">
                <Link to={ROUTES.STUDENT.DASHBOARD}>
                  <Button className="!from-emerald-600 !to-teal-500" icon={CheckCircle2}>Dashboard</Button>
                </Link>
                <Link to={ROUTES.STUDENT.TASKS}>
                  <Button variant="outline" icon={ClipboardList}>Tasks</Button>
                </Link>
              </div>
            </div>
          )}

          <div id="internship-programs" className="scroll-mt-24 space-y-6">
          <div className="flex gap-2">
            {['all', 'trending'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                  filter === f ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'All Tracks' : 'Trending'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {postings.map((posting, i) => (
                <motion.article
                  key={posting.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-emerald-100 transition-all"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img src={posting.image} alt={posting.title} className="w-full h-full object-cover" />
                    {posting.trending && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold uppercase rounded-full">
                        Trending
                      </span>
                    )}
                    <span className="absolute top-3 right-3 px-2 py-0.5 bg-white/90 text-gray-600 text-[10px] font-semibold rounded-full">
                      {posting.level}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900">{posting.title}</h3>
                    <p className="text-xs text-gray-400 mb-2">{posting.company}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {posting.tags?.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] rounded">{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{posting.duration}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{posting.type || 'Virtual'}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{posting.spots} spots</span>
                    </div>
                    {!portalReady && (
                      <button
                        type="button"
                        onClick={() => handleApply(posting)}
                        className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
