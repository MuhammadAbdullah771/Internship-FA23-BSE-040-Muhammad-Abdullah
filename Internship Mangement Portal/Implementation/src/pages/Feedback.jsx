import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { useAppPaths } from '../hooks/useAppPaths';
import { fetchStudentDashboard } from '../services/studentService';
import { feedbackSessions } from '../constants/data';

export default function Feedback() {
  const { isStudent } = useAuth();
  const paths = useAppPaths();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(isStudent);

  useEffect(() => {
    if (!isStudent) return;
    fetchStudentDashboard()
      .then((data) => {
        const reviewed = (data.allTasks || []).filter((t) => t.status === 'done' || t.status === 'review');
        setTasks(reviewed);
      })
      .catch(() => toast.error('Failed to load feedback'))
      .finally(() => setLoading(false));
  }, [isStudent]);

  if (!isStudent) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Performance Feedback</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            {feedbackSessions.map((session) => (
              <Card key={session.id} className="!p-4">
                <p className="font-semibold text-gray-900">{session.name}</p>
                <p className="text-xs text-gray-400">{session.role}</p>
              </Card>
            ))}
          </div>
          <Card className="lg:col-span-2">
            <p className="text-gray-500 text-center py-12">Admin feedback management view</p>
          </Card>
        </div>
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

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm text-gray-400 mb-1">Reports &gt; Feedback</p>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Mentor Feedback</h1>
        <p className="text-gray-500 mt-1">Track feedback on your submitted tasks.</p>
      </motion.div>

      {tasks.length === 0 ? (
        <Card className="text-center py-16">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No feedback yet</h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Submit your tasks for review. Mentor feedback will appear here once tasks are reviewed.
          </p>
          <Link to={paths.TASKS} className="inline-block mt-6 text-emerald-600 font-medium hover:text-emerald-500">
            Go to Tasks
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="!p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {task.status === 'done' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-500 mt-0.5" />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {task.status === 'done'
                        ? 'This task has been completed and approved.'
                        : 'Your submission is under review. Feedback will appear once your mentor reviews it.'}
                    </p>
                    {task.submission?.comments && (
                      <p className="text-sm text-gray-600 mt-2 italic">
                        Your note: &ldquo;{task.submission.comments}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant={task.status === 'done' ? 'success' : 'warning'}>
                  {task.status === 'done' ? 'Approved' : 'In Review'}
                </Badge>
              </div>
              <Link to={paths.taskDetail(task.id)} className="text-sm text-emerald-600 hover:text-emerald-500 mt-3 inline-block">
                View Task Details
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
