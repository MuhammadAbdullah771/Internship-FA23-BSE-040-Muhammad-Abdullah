import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Briefcase, User } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAuth } from '../../context/AuthContext';
import { ROUTES, ROLES } from '../../constants';

export default function InternshipLoginPanel() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isStudent, user, signup } = useAuth();
  const [mode, setMode] = useState('login');
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { email: 'alex.mercer@example.com' },
  });
  const password = watch('password');

  if (isAuthenticated && isStudent) {
    return (
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-premium p-6 lg:p-8 h-fit sticky top-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Welcome back!</p>
            <p className="text-sm text-gray-500">{user?.name}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          You&apos;re signed in. Browse internships below and click <strong>Apply Now</strong> to submit your application.
        </p>
        <div className="space-y-3">
          <Button
            className="w-full !from-emerald-600 !to-teal-500"
            onClick={() => navigate(ROUTES.STUDENT.DASHBOARD)}
          >
            Go to Dashboard
          </Button>
          <Button variant="outline" className="w-full" onClick={() => navigate(ROUTES.STUDENT.TASKS)}>
            View My Tasks
          </Button>
        </div>
      </div>
    );
  }

  const onLogin = async (data) => {
    const result = await login(data.email, data.password, ROLES.STUDENT);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success('Signed in! You can now apply to internships.');
    navigate(ROUTES.STUDENT.PORTAL);
  };

  const onSignup = async (data) => {
    const result = await signup({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    });
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success('Account created! Start applying to internships.');
    navigate(ROUTES.STUDENT.PORTAL);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-premium p-6 lg:p-8 h-fit sticky top-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-gray-900 text-lg">Internship Portal</h2>
          <p className="text-sm text-gray-500">Sign in to apply for internships</p>
        </div>
      </div>

      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        {['login', 'signup'].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-all ${
              mode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            {m === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        ))}
      </div>

      {mode === 'login' ? (
        <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
          <Input label="Email" icon={Mail} type="email" error={errors.email?.message} {...register('email', { required: 'Required' })} />
          <Input label="Password" icon={Lock} type="password" error={errors.password?.message} {...register('password', { required: 'Required' })} />
          <Button type="submit" className="w-full !from-emerald-600 !to-teal-500" disabled={isSubmitting}>
            Sign In to Portal
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmit(onSignup)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First" icon={User} {...register('firstName', { required: true })} />
            <Input label="Last" icon={User} {...register('lastName', { required: true })} />
          </div>
          <Input label="Email" icon={Mail} type="email" {...register('email', { required: true })} />
          <Input label="Password" icon={Lock} type="password" {...register('password', { required: true, minLength: 6 })} />
          <Input
            label="Confirm"
            icon={Lock}
            type="password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', { validate: (v) => v === password || 'Passwords do not match' })}
          />
          <Button type="submit" className="w-full !from-emerald-600 !to-teal-500" disabled={isSubmitting}>
            Create Account
          </Button>
        </form>
      )}

      <p className="text-center text-xs text-gray-400 mt-4">Demo: alex.mercer@example.com / student123</p>
    </div>
  );
}
