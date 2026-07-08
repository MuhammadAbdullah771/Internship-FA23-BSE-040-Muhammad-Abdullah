import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, CheckCircle, Clock, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '../context/AuthContext';
import { useAppPaths } from '../hooks/useAppPaths';
import { fetchStudentDashboard } from '../services/studentService';
import { fetchTaskBoard } from '../services/taskService';
import { useRealtimePoll } from '../hooks/useRealtimePoll';
import { useRealtimeStream } from '../hooks/useRealtimeStream';

export default function Feedback() {
  const { isStudent } = useAuth();
  const paths = useAppPaths();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(isStudent);

  const {
    data: taskBoard,
    loading: adminLoading,
    refresh: refreshBoard,
  } = useRealtimePoll(fetchTaskBoard, { interval: 10000, enabled: !isStudent });

  useRealtimeStream(['tasks:updated'], () => refreshBoard(true), { enabled: !isStudent });

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
    const reviewTasks = taskBoard?.review || [];

    if (adminLoading && !taskBoard) {
      return (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Task Review Queue</h1>
          <p className="text-slate-400 mt-1">Live submissions awaiting admin review from Clerk students.</p>
        </motion.div>

        {reviewTasks.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700/60 p-12 text-center">
            <ClipboardList className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No tasks in review</p>
            <p className="text-sm text-slate-500 mt-1">Student task submissions will appear here in real time.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {reviewTasks.map((task) => (
              <Card key={task.id} className="bg-slate-800/50 border-slate-700/60 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    {task.assignee ? <Avatar src={task.assignee} name={task.title} size="sm" /> : null}
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-slate-400 mt-1 line-clamp-2">{task.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="warning">In Review</Badge>
                        <Badge variant="default">{task.priority}</Badge>
                      </div>
                    </div>
                  </div>
                  <Link to={paths.taskDetail(task.id)}>
                    <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 cursor-pointer hover:bg-emerald-500/25">
                      Open Task
                    </Badge>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
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
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Performance Feedback</h1>
        <p className="text-gray-500 mt-1">Review notes on your submitted and completed tasks.</p>
      </motion.div>

      {tasks.length === 0 ? (
        <Card className="text-center py-12">
          <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No feedback available yet. Complete tasks to receive mentor reviews.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="!p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                </div>
                <Badge variant={task.status === 'done' ? 'success' : 'warning'}>
                  {task.status === 'done' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                  {task.status === 'done' ? 'Completed' : 'In Review'}
                </Badge>
              </div>
              <Link to={paths.taskDetail(task.id)} className="text-sm font-medium text-emerald-600 hover:text-emerald-500 mt-3 inline-block">
                View task details
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
