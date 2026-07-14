import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const Dashboard = () => {
  const { appUser, clerkUser, isSyncing, authError, logout, refreshAppUser } =
    useAuthContext();

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Dashboard
          </h1>
          <p className="mt-2 text-muted">
            You are signed in. Profile and project modules come next.
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-white"
        >
          Log out
        </button>
      </div>

      {authError && (
        <div className="mt-6">
          <ErrorMessage message={authError} onRetry={refreshAppUser} />
        </div>
      )}

      {isSyncing && !appUser ? (
        <div className="mt-10 flex items-center gap-3 text-muted">
          <LoadingSpinner size="sm" />
          Syncing your account...
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Your InternShowcase profile
            </p>
            <div className="mt-3 flex items-center gap-3">
              {(appUser?.profileImage || clerkUser?.imageUrl) && (
                <img
                  src={appUser?.profileImage || clerkUser?.imageUrl}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover"
                />
              )}
              <p className="font-display text-lg font-semibold text-ink">
                {appUser?.fullName || '—'}
              </p>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Email</dt>
                <dd className="text-ink">{appUser?.email || '—'}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Role</dt>
                <dd className="capitalize text-ink">{appUser?.role || '—'}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Sign-in method</dt>
                <dd className="capitalize text-ink">
                  {appUser?.primaryAuthProvider || 'email'}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Linked methods</dt>
                <dd className="capitalize text-ink">
                  {(appUser?.authProviders || ['email']).join(', ')}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-line bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Next steps
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Your account is ready. Upcoming modules will let you complete your
              intern profile, upload projects, and publish a shareable
              portfolio.
            </p>
          </div>
        </div>
      )}

      <p className="mt-8 text-sm text-muted">
        <Link to="/" className="text-brand-700 hover:underline">
          Back to home
        </Link>
      </p>
    </section>
  );
};

export default Dashboard;
