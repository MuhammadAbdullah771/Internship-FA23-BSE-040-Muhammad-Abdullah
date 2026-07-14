import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSignIn } from '@clerk/clerk-react';
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
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-muted">
          Welcome back to InternShowcase. Sign in to manage your projects and
          portfolio.
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
          <span className="text-xs uppercase tracking-wide text-muted">or</span>
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
              className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60"
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
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting && (
              <LoadingSpinner size="sm" className="border-white border-t-transparent" />
            )}
            {submitting ? 'Signing in...' : 'Sign in with email'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-brand-700 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
