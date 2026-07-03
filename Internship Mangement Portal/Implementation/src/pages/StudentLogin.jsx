import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { ROUTES, ROLES } from '../constants';

export default function StudentLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: 'alex.mercer@example.com' },
  });

  const onSubmit = (data) => {
    const result = login(data.email, data.password, ROLES.STUDENT);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success('Welcome! Explore internships and your dashboard.');
    navigate(result.redirect);
  };

  return (
    <AuthLayout
      variant="student"
      title="Internship Portal"
      subtitle="Sign in to browse internships, manage tasks, and track your progress."
      features={[
        'Browse 10+ tech internship tracks',
        'Submit assignments & track deadlines',
        'Receive mentor feedback in real-time',
      ]}
    >
      <div className="flex items-center gap-3 p-3 mb-6 rounded-xl bg-emerald-50 border border-emerald-100">
        <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Student Access</p>
          <p className="text-xs text-gray-500">For interns & students</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email Address"
          icon={Mail}
          type="email"
          placeholder="you@university.edu"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</label>
            <Link to={ROUTES.FORGOT_PASSWORD} className="text-xs font-medium text-emerald-600 hover:text-emerald-500">
              Forgot password?
            </Link>
          </div>
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
          <span className="text-sm text-gray-600">Keep me signed in</span>
        </label>

        <Button type="submit" className="w-full !from-emerald-600 !to-teal-500" size="lg">
          Sign In to Portal
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don&apos;t have an account?{' '}
        <Link to={ROUTES.STUDENT_SIGNUP} className="font-semibold text-emerald-600 hover:text-emerald-500">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
