import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ROUTES } from '../constants';

export default function ForgotPassword() {
  const { register, handleSubmit } = useForm();

  const onSubmit = () => {
    toast.success('Reset link sent to your email');
  };

  return (
    <AuthLayout
      variant="student"
      title="Reset Password"
      subtitle="Enter your email address and we'll send you a link to reset your password."
      features={[
        'Secure password recovery',
        'Link expires in 24 hours',
        'Contact support if you need help',
      ]}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email Address"
          icon={Mail}
          type="email"
          placeholder="you@university.edu"
          {...register('email', { required: true })}
        />
        <Button type="submit" className="w-full" size="lg">
          Send Reset Link
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Remember your password?{' '}
        <Link to={ROUTES.STUDENT_LOGIN} className="font-semibold text-emerald-600 hover:text-emerald-500">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
