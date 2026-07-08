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

const DEMO_EMAIL = 'superadmin@internhub.io';
const DEMO_PASSWORD = 'superadmin123';

export default function SuperadminLogin() {
  const navigate = useNavigate();
  const { loginSuperadmin } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await loginSuperadmin({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });
      toast.success('Welcome back, Superadmin');
      navigate(ROUTES.SUPERADMIN.DASHBOARD);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Invalid email or password';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setValue('email', DEMO_EMAIL);
    setValue('password', DEMO_PASSWORD);
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
      <div className="mb-5 p-4 rounded-xl bg-slate-100 border border-slate-200 text-sm">
        <p className="font-semibold text-slate-800 mb-1">Demo superadmin credentials</p>
        <p className="text-slate-600">Email: <strong>{DEMO_EMAIL}</strong></p>
        <p className="text-slate-600">Password: <strong>{DEMO_PASSWORD}</strong></p>
        <button
          type="button"
          onClick={fillDemoCredentials}
          className="mt-2 text-xs font-semibold text-emerald-700 hover:text-emerald-600"
        >
          Fill credentials
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Admin Email"
          type="email"
          icon={Mail}
          placeholder={DEMO_EMAIL}
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
        Use the demo credentials above. Run <code className="bg-gray-100 px-1 rounded">npm run seed</code> if login fails.
      </p>
    </AuthLayout>
  );
}
