import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { createTask } from '../../services/taskService';
import { fetchAdminStudents } from '../../services/adminService';

const PRIORITIES = ['Low', 'Medium', 'High'];

export default function TaskFormModal({ isOpen, onClose, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      priority: 'Medium',
      assigneeId: '',
      dueDate: '',
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
      return;
    }

    let cancelled = false;
    setLoadingStudents(true);
    fetchAdminStudents({ page: 1, limit: 100, portalStatus: 'approved' })
      .then((data) => {
        if (!cancelled) setStudents(data.students || []);
      })
      .catch(() => {
        if (!cancelled) toast.error('Failed to load Clerk students');
      })
      .finally(() => {
        if (!cancelled) setLoadingStudents(false);
      });

    return () => { cancelled = true; };
  }, [isOpen, reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    const result = await createTask({
      title: data.title.trim(),
      description: data.description?.trim() || '',
      priority: data.priority,
      assigneeId: data.assigneeId || null,
      dueDate: data.dueDate || null,
      status: 'todo',
    });
    setSubmitting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success('Task created and assigned');
    onSuccess?.(result.task);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Task">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Title"
          error={errors.title?.message}
          {...register('title', { required: 'Title is required' })}
        />

        <Textarea
          label="Description"
          rows={3}
          {...register('description')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              {...register('priority')}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <Input
            label="Due Date"
            type="date"
            {...register('dueDate')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Assign to Clerk Student
          </label>
          <select
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            disabled={loadingStudents}
            {...register('assigneeId')}
          >
            <option value="">Unassigned</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.displayName || student.name} ({student.email})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Only approved Clerk students are listed.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
