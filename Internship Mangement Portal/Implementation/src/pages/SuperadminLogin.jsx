import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants';

export default function SuperadminLogin() {
  const navigate = useNavigate();
  const { loginSuperadmin } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await loginSuperadmin({
        email: data.email,
        password: data.password,
      });
      toast.success('Welcome back, Superadmin');
      navigate(ROUTES.SUPERADMIN.DASHBOARD);
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid email or password';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      variant="superadmin"
      title="Superadmin Portal"
      subtitle="Authorized personnel only. Sign in with your admin credentials."
      backLink={ROUTES.STUDENT.PORTAL}
      backLabel="Back to Internship Portal"
      features={[
        'Manage intern cohorts & assignments',
        'Review applications & payment proofs',
        'Analytics, reports & performance tracking',
      ]}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Admin Email"
          type="email"
          icon={Mail}
          placeholder="superadmin@internhub.io"
          autoComplete="username"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email',
            },
          })}
        />

        <Input
          label="Password"
          type="password"
          icon={Lock}
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />

        <Button
          type="submit"
          className="w-full !from-slate-800 !to-slate-700"
          size="lg"
          disabled={submitting}
        >
          {submitting ? 'Signing in...' : 'Sign In to Admin Portal'}
        </Button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
        Superadmin accounts are created by the system administrator only.
        <br />
        Unauthorized access is prohibited.
      </p>
    </AuthLayout>
  );
}
