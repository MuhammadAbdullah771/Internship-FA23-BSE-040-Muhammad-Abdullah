import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useSignUp } from '@clerk/clerk-react';
import PasswordInput from '../components/auth/PasswordInput';
import SocialAuthButtons from '../components/auth/SocialAuthButtons';
import ErrorMessage from '../components/ui/ErrorMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuthContext } from '../context/AuthContext';
import {
  getClerkErrorMessage,
  splitFullName,
  validateRegisterForm,
} from '../utils/authValidation';

const Register = () => {
  const navigate = useNavigate();
  const { isSignedIn, refreshAppUser } = useAuthContext();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isSignedIn && !pendingVerification) {
      navigate('/dashboard', { replace: true });
    }
  }, [isSignedIn, pendingVerification, navigate]);

  if (isSignedIn && !pendingVerification) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormError('');
  };

  const completeSession = async (sessionId) => {
    await setActive({ session: sessionId });
    await refreshAppUser();
    navigate('/dashboard', { replace: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    const errors = validateRegisterForm(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    if (!isLoaded) return;

    setSubmitting(true);

    try {
      const { firstName, lastName } = splitFullName(form.fullName);

      const result = await signUp.create({
        emailAddress: form.email.trim(),
        password: form.password,
        firstName,
        lastName: lastName || undefined,
      });

      if (result.status === 'complete') {
        await completeSession(result.createdSessionId);
        return;
      }

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (error) {
      setFormError(getClerkErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    setFormError('');

    if (!code.trim()) {
      setFormError('Enter the verification code from your email');
      return;
    }
    if (!isLoaded) return;

    setSubmitting(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      if (result.status === 'complete') {
        await completeSession(result.createdSessionId);
        return;
      }

      setFormError('Verification incomplete. Please try again.');
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
          {pendingVerification ? 'Verify your email' : 'Create account'}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {pendingVerification
            ? `Enter the code sent to ${form.email}`
            : 'Join InternShowcase to build your intern profile, upload projects, and share your portfolio.'}
        </p>

        {!pendingVerification ? (
          <>
            <div className="mt-8">
              <SocialAuthButtons
                mode="signUp"
                disabled={submitting}
                onError={setFormError}
              />
            </div>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-line" />
              <span className="text-xs uppercase tracking-wide text-muted">
                or
              </span>
              <div className="h-px flex-1 bg-line" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {formError && <ErrorMessage message={formError} />}

              <div>
                <label
                  htmlFor="fullName"
                  className="mb-1.5 block text-sm font-medium text-ink"
                >
                  Full name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  disabled={submitting}
                  className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60"
                  placeholder="Muhammad Abdullah"
                />
                {fieldErrors.fullName && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-ink"
                >
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
                  autoComplete="new-password"
                  disabled={submitting}
                  error={fieldErrors.password}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-sm font-medium text-ink"
                >
                  Confirm password
                </label>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  disabled={submitting}
                  error={fieldErrors.confirmPassword}
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !isLoaded}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting && (
                  <LoadingSpinner
                    size="sm"
                    className="border-white border-t-transparent"
                  />
                )}
                {submitting ? 'Creating account...' : 'Create account with email'}
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={handleVerify} className="mt-8 space-y-4" noValidate>
            {formError && <ErrorMessage message={formError} />}

            <div>
              <label htmlFor="code" className="mb-1.5 block text-sm font-medium text-ink">
                Verification code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setFormError('');
                }}
                disabled={submitting}
                className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60"
                placeholder="Enter 6-digit code"
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
              {submitting ? 'Verifying...' : 'Verify email'}
            </button>
          </form>
        )}

        {!pendingVerification && (
          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-700 hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </section>
  );
};

export default Register;
