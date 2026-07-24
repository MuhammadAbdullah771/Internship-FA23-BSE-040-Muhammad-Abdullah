import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSignIn } from '@clerk/clerk-react';
import AuthShell from '../components/auth/AuthShell';
import PasswordInput from '../components/auth/PasswordInput';
import SocialAuthButtons from '../components/auth/SocialAuthButtons';
import ErrorMessage from '../components/ui/ErrorMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuthContext } from '../context/AuthContext';
import {
  getClerkErrorMessage,
  validateLoginForm,
} from '../utils/authValidation';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn, refreshAppUser } = useAuthContext();
  const { isLoaded, signIn, setActive } = useSignIn();

  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isSignedIn) {
      navigate(from, { replace: true });
    }
  }, [isSignedIn, from, navigate]);

  if (isSignedIn) {
    return <Navigate to={from} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    const errors = validateLoginForm(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (!isLoaded) return;

    setSubmitting(true);

    try {
      const result = await signIn.create({
        identifier: form.email.trim(),
        password: form.password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        await refreshAppUser();
        navigate(from, { replace: true });
        return;
      }

      setFormError(
        'Additional verification is required. Please check your email.'
      );
    } catch (error) {
      setFormError(getClerkErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back to your workspace."
      subtitle="Sign in to manage projects, polish your portfolio, and track how recruiters engage."
    >
      <div className="lg:hidden">
        <p className="font-display text-xl font-semibold text-ink">
          Intern<span className="text-brand-600">Showcase</span>
        </p>
      </div>
      <h2 className="mt-2 font-display text-2xl font-semibold text-ink lg:mt-0">
        Sign in
      </h2>
      <p className="mt-2 text-sm text-muted">
        Continue with Google or use your email.
      </p>

      <div className="mt-8">
        <SocialAuthButtons
          mode="signIn"
          disabled={submitting}
          onError={setFormError}
        />
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-line" />
        <span className="text-xs tracking-wide text-muted uppercase">or</span>
        <div className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {formError && <ErrorMessage message={formError} />}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            disabled={submitting}
            className="field-premium w-full rounded-xl px-3.5 py-2.5 text-sm text-ink disabled:opacity-60"
            placeholder="you@example.com"
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            Password
          </label>
          <PasswordInput
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            disabled={submitting}
            error={fieldErrors.password}
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !isLoaded}
          className="btn-premium flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting && (
            <LoadingSpinner size="sm" className="border-white border-t-transparent" />
          )}
          {submitting ? 'Signing in...' : 'Sign in with email'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-semibold text-brand-700 hover:underline">
          Create one
        </Link>
      </p>
    </AuthShell>
  );
};

export default Login;
