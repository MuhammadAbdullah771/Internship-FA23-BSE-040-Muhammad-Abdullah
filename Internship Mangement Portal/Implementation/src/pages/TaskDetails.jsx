import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Paperclip, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '../context/AuthContext';
import { useAppPaths } from '../hooks/useAppPaths';
import { fetchTask } from '../services/taskService';
import { PRIORITY_COLORS } from '../constants';

const STATUS_LABELS = {
  todo: { label: 'To Do', variant: 'default' },
  in_progress: { label: 'In Progress', variant: 'primary' },
  review: { label: 'In Review', variant: 'warning' },
  done: { label: 'Completed', variant: 'success' },
};

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isStudent } = useAuth();
  const paths = useAppPaths();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await fetchTask(id);
        if (!cancelled) setTask(data);
      } catch {
        if (!cancelled) {
          toast.error('Task not found');
          navigate(paths.TASKS);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id, navigate, paths.TASKS]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!task) return null;

  const statusInfo = STATUS_LABELS[task.status] || STATUS_LABELS.todo;
  const canSubmit = isStudent && task.status !== 'done' && task.status !== 'review';

  return (
    <div className="space-y-6 max-w-4xl">
      <Link to={paths.TASKS} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="w-4 h-4" />
        Back to Tasks
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={PRIORITY_COLORS[task.priority]}>{task.priority} Priority</Badge>
              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{task.title}</h1>
            {task.submission?.status === 'submitted' && (
              <p className="text-sm text-emerald-600 mt-1">Submission received — awaiting review</p>
            )}
          </div>
          {canSubmit && (
            <Link to={paths.taskSubmit(task.id)}>
              <Button variant="purple">Submit Task</Button>
            </Link>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {task.description || 'No description provided.'}
            </p>
          </Card>

          {task.submission?.githubLink && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Submission</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-500">GitHub: </span>
                  <a href={task.submission.githubLink} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">
                    {task.submission.githubLink}
                  </a>
                </p>
                {task.submission.liveUrl && (
                  <p>
                    <span className="text-gray-500">Live URL: </span>
                    <a href={task.submission.liveUrl} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">
                      {task.submission.liveUrl}
                    </a>
                  </p>
                )}
                {task.submission.comments && (
                  <p className="text-gray-600 mt-2">{task.submission.comments}</p>
                )}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Assignee</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Avatar src={user?.avatar} name={task.assigneeName || user?.name} size="sm" />
                    <span className="text-sm font-medium text-gray-900">{task.assigneeName || user?.name}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Due Date</p>
                  <p className={`text-sm font-medium ${task.dateUrgent ? 'text-red-500' : 'text-gray-900'}`}>
                    {task.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Paperclip className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Attachments</p>
                  <p className="text-sm font-medium text-gray-900">{task.attachments} files</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Comments</p>
                  <p className="text-sm font-medium text-gray-900">{task.comments} comments</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
