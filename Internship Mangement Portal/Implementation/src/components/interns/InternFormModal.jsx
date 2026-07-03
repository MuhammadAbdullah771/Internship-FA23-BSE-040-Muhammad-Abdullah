import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Modal from '../common/Modal';
import { createIntern } from '../../services/internService';

const DEPARTMENTS = ['Engineering', 'Design', 'Marketing'];
const STATUSES = ['Active', 'Onboarding', 'Completed'];

export default function InternFormModal({ isOpen, onClose, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      status: 'Onboarding',
      intake: new Date().getFullYear().toString(),
    },
  });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    const result = await createIntern({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      track: data.track,
      department: data.department,
      intake: data.intake,
      status: data.status,
    });
    setSubmitting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success('Intern added successfully');
    onSuccess?.(result.intern);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Intern">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            error={errors.firstName?.message}
            {...register('firstName', { required: 'Required' })}
          />
          <Input
            label="Last Name"
            error={errors.lastName?.message}
            {...register('lastName', { required: 'Required' })}
          />
        </div>

        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register('email', { required: 'Required' })}
        />

        <Input
          label="Track / Role"
          placeholder="e.g. Software Engineering"
          error={errors.track?.message}
          {...register('track', { required: 'Required' })}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Department
            </label>
            <select
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
              {...register('department', { required: 'Required' })}
            >
              <option value="">Select...</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department.message}</p>}
          </div>

          <Input
            label="Intake Year"
            error={errors.intake?.message}
            {...register('intake', { required: 'Required' })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Status
          </label>
          <select
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
            {...register('status')}
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="purple" className="flex-1" disabled={submitting}>
            {submitting ? 'Saving...' : 'Add Intern'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
