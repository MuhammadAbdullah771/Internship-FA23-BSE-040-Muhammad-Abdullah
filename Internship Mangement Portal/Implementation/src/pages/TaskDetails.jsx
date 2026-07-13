import { useEffect, useState, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Paperclip, MessageSquare, CheckCircle2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '../context/AuthContext';
import { useAppPaths } from '../hooks/useAppPaths';
import { fetchTask, updateTaskStatus, deleteTask } from '../services/taskService';
import { useRealtimeStream } from '../hooks/useRealtimeStream';
import { PRIORITY_COLORS } from '../constants';

const STATUS_LABELS = {
  todo: { label: 'To Do', variant: 'default' },
  in_progress: { label: 'In Progress', variant: 'primary' },
  review: { label: 'In Review', variant: 'warning' },
  done: { label: 'Completed', variant: 'success' },
};

const ADMIN_STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'In Review' },
  { value: 'done', label: 'Completed' },
];

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isStudent, isSuperadmin } = useAuth();
  const paths = useAppPaths();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const loadTask = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await fetchTask(id);
      setTask(data);
    } catch {
      if (!silent) {
        toast.error('Task not found');
        navigate(paths.TASKS);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [id, navigate, paths.TASKS]);

  useEffect(() => {
    loadTask(false);
  }, [loadTask]);

  useRealtimeStream(['tasks:updated'], (_event, payload) => {
    if (!payload?.taskId || payload.taskId === id) {
      loadTask(true);
    }
  });

  const handleAdminStatus = async (status) => {
    setUpdating(true);
    const result = await updateTaskStatus(id, status);
    setUpdating(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    setTask(result.task);
    toast.success(status === 'done' ? 'Task approved as complete' : 'Status updated');
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task permanently?')) return;
    setUpdating(true);
    const result = await deleteTask(id);
    setUpdating(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success('Task deleted');
    navigate(paths.TASKS);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!task) return null;

  const statusInfo = STATUS_LABELS[task.status] || STATUS_LABELS.todo;
  const canSubmit = isStudent && task.status !== 'done' && task.status !== 'review';

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        to={paths.TASKS}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
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
          <div className="flex flex-wrap gap-2">
            {canSubmit && (
              <Link to={paths.taskSubmit(task.id)}>
                <Button variant="purple">Submit Task</Button>
              </Link>
            )}
            {isSuperadmin && task.status === 'review' && (
              <Button
                className="!from-emerald-600 !to-teal-500"
                icon={CheckCircle2}
                disabled={updating}
                onClick={() => handleAdminStatus('done')}
              >
                Approve Complete
              </Button>
            )}
            {isSuperadmin && (
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
                icon={Trash2}
                disabled={updating}
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card glass>
            <h2 className="text-lg font-semibold mb-3 text-gray-900">Description</h2>
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-600">
              {task.description || 'No description provided.'}
            </p>
          </Card>

          {task.submission?.githubLink && (
            <Card glass>
              <h2 className="text-lg font-semibold mb-3 text-gray-900">
                {isSuperadmin ? 'Student Submission' : 'Your Submission'}
              </h2>
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
                  <p className="mt-2 text-gray-600">{task.submission.comments}</p>
                )}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card glass>
            <h3 className="text-sm font-semibold mb-4 text-gray-900">Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Assignee</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Avatar src={task.assignee || user?.avatar} name={task.assigneeName || user?.name} size="sm" />
                    <span className="text-sm font-medium text-gray-900">
                      {task.assigneeName || (isStudent ? user?.name : 'Unassigned')}
                    </span>
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

          {isSuperadmin && (
            <Card glass>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Update Status</h3>
              <select
                value={task.status}
                disabled={updating}
                onChange={(e) => handleAdminStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-gray-700"
              >
                {ADMIN_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
