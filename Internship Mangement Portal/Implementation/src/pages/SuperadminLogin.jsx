import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { ROUTES, ROLES } from '../constants';

export default function SuperadminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password, ROLES.SUPERADMIN);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success('Welcome, Super Admin');
    navigate(result.redirect);
  };

  return (
    <AuthLayout
      variant="superadmin"
      title="Superadmin Portal"
      subtitle="Authorized personnel only. Enter your credentials to access the administration dashboard."
      backLink={ROUTES.STUDENT.PORTAL}
      backLabel="Back to Internship Portal"
      features={[
        'Manage intern cohorts & assignments',
        'Analytics, reports & performance tracking',
        'Role-based secure access control',
      ]}
    >
      <div className="flex items-center gap-3 p-3 mb-6 rounded-xl bg-slate-50 border border-slate-200">
        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Restricted Access</p>
          <p className="text-xs text-gray-500">Superadmin credentials required</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Admin Email"
          icon={Mail}
          type="email"
          placeholder="admin@internhub.io"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <Input
            icon={Lock}
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', { required: 'Password is required' })}
          />
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            {...register('remember')}
          />
          <span className="text-sm text-gray-600">Trust this device for 30 days</span>
        </label>

        <Button
          type="submit"
          className="w-full !from-slate-800 !to-slate-700 hover:!from-slate-700 hover:!to-slate-600"
          size="lg"
        >
          Access Admin Portal
        </Button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
        This is a secure area. All login attempts are monitored.
        <br />
        Unauthorized access is prohibited.
      </p>
    </AuthLayout>
  );
}
