import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants';

export default function StudentSignup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = (data) => {
    const result = signup({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    });
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success('Account created! Welcome to InternHub.');
    navigate(result.redirect);
  };

  return (
    <AuthLayout
      variant="student"
      title="Create Account"
      subtitle="Join InternHub to discover internships, build skills, and launch your career."
      features={[
        'Free access to virtual internships',
        'Track progress & submit assignments',
        'Connect with mentors & peers',
      ]}
    >
      <div className="flex items-center gap-3 p-3 mb-6 rounded-xl bg-emerald-50 border border-emerald-100">
        <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Student Sign Up</p>
          <p className="text-xs text-gray-500">Create your internship portal account</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            icon={User}
            placeholder="Alex"
            error={errors.firstName?.message}
            {...register('firstName', { required: 'First name is required' })}
          />
          <Input
            label="Last Name"
            icon={User}
            placeholder="Mercer"
            error={errors.lastName?.message}
            {...register('lastName', { required: 'Last name is required' })}
          />
        </div>

        <Input
          label="Email Address"
          icon={Mail}
          type="email"
          placeholder="you@university.edu"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
          })}
        />

        <Input
          label="Password"
          icon={Lock}
          type="password"
          placeholder="Min. 6 characters"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
          })}
        />

        <Input
          label="Confirm Password"
          icon={Lock}
          type="password"
          placeholder="Repeat password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
        />

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 mt-0.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            {...register('terms', { required: 'You must accept the terms' })}
          />
          <span className="text-sm text-gray-600 leading-snug">
            I agree to the{' '}
            <a href="#" className="text-emerald-600 font-medium hover:text-emerald-500">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-emerald-600 font-medium hover:text-emerald-500">Privacy Policy</a>
          </span>
        </label>
        {errors.terms && <p className="text-xs text-red-500 -mt-2">{errors.terms.message}</p>}

        <Button type="submit" className="w-full !from-emerald-600 !to-teal-500" size="lg">
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link to={ROUTES.STUDENT_LOGIN} className="font-semibold text-emerald-600 hover:text-emerald-500">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
