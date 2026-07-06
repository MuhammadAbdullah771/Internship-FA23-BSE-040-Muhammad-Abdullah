import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Code, Link as LinkIcon, UploadCloud, Lightbulb, MoveRight, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import { useAppPaths } from '../hooks/useAppPaths';
import { fetchTask, submitTask } from '../services/taskService';

const STATUS_LABELS = {
  todo: 'TO DO',
  in_progress: 'IN PROGRESS',
  review: 'IN REVIEW',
  done: 'COMPLETED',
};

function formatSubmissionTime(date) {
  if (!date) return '';
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function TaskSubmission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const paths = useAppPaths();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await fetchTask(id);
        if (!cancelled) {
          setTask(data);
          reset({
            github: data.submission?.githubLink || '',
            liveUrl: data.submission?.liveUrl || '',
            comments: data.submission?.comments || '',
          });
        }
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
  }, [id, navigate, paths.TASKS, reset]);

  const saveSubmission = async (formData, submit = false) => {
    setSubmitting(true);
    const result = await submitTask(id, {
      githubLink: formData.github,
      liveUrl: formData.liveUrl || '',
      comments: formData.comments || '',
      submit,
    });
    setSubmitting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    setTask(result.task);
    if (submit) {
      toast.success('Task submitted for review!');
      navigate(paths.taskDetail(id));
    } else {
      toast.success('Draft saved successfully');
    }
  };

  const onSaveDraft = handleSubmit((data) => saveSubmission(data, false));
  const onSubmit = handleSubmit((data) => saveSubmission(data, true));

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!task) return null;

  const history = [];
  if (task.submission?.submittedAt) {
    history.push({
      id: 'submitted',
      title: 'Submitted for Review',
      time: formatSubmissionTime(task.submission.submittedAt),
      detail: 'Your work was sent to your mentor for review.',
      active: true,
    });
  }
  if (task.submission?.githubLink || task.submission?.status === 'draft') {
    history.push({
      id: 'draft',
      title: task.submission?.status === 'draft' ? 'Draft Saved' : 'Work Uploaded',
      time: formatSubmissionTime(task.updatedAt),
      detail: task.submission?.githubLink ? `GitHub: ${task.submission.githubLink}` : 'Draft in progress',
      active: !task.submission?.submittedAt,
    });
  }
  history.push({
    id: 'assigned',
    title: 'Task Assigned',
    time: formatSubmissionTime(task.createdAt),
    detail: 'You received this assignment from your mentor.',
    active: false,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm text-gray-400 mb-1">
            <Link to={paths.TASKS} className="hover:text-gray-600">Tasks</Link>
            {' > '}
            <Link to={paths.taskDetail(id)} className="hover:text-gray-600">{task.title}</Link>
            {' > Submit'}
          </p>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Submit Task</h1>
          <p className="text-gray-500 mt-1">{task.title}</p>
        </motion.div>
        <Badge variant="primary" className="self-start flex items-center gap-1.5 px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-primary-600" />
          {STATUS_LABELS[task.status] || task.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Task Details</h2>
            <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">
              {task.description || 'No description provided.'}
            </p>
          </Card>

          <Card>
            <form className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  GitHub Link <span className="text-red-500">*</span>
                </label>
                <Input
                  icon={Code}
                  placeholder="https://github.com/username/repo"
                  {...register('github', { required: true })}
                />
              </div>
              <Input
                label="Live URL (Optional)"
                icon={LinkIcon}
                placeholder="https://your-app.vercel.app"
                {...register('liveUrl')}
              />
              <Textarea
                label="Comments"
                placeholder="Add any notes for the reviewer..."
                rows={4}
                {...register('comments')}
              />

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Attachments</p>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center opacity-60">
                  <UploadCloud className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">File uploads coming soon</p>
                  <p className="text-xs text-gray-400 mt-1">Use GitHub link for now</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="min-w-[160px]"
                  onClick={onSaveDraft}
                  disabled={submitting}
                >
                  Save Draft
                </Button>
                <Button
                  type="button"
                  variant="purple"
                  icon={Send}
                  className="min-w-[160px]"
                  onClick={onSubmit}
                  disabled={submitting}
                >
                  Submit for Review
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission History</h3>
            <div className="space-y-0">
              {history.map((item, i) => (
                <div key={item.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${item.active ? 'bg-primary-600 ring-4 ring-primary-100' : 'bg-gray-200'}`} />
                    {i < history.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 my-1" />}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.time}</p>
                    <p className="text-xs text-gray-500 mt-1 break-all">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="bg-primary-50 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-primary-700 mb-1">Submission Tips</h4>
                <p className="text-xs text-primary-600/80 leading-relaxed">
                  Include a working GitHub repository link. Make sure your README explains how to run the project.
                  Submit for review only when your work is complete.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
