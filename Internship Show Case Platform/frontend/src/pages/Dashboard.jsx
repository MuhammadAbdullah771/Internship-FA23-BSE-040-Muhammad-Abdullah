import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { getMyProfile } from '../api/profile';
import { getMyProjects } from '../api/projects';
import ProfileCompletion from '../components/profile/ProfileCompletion';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import PageShell from '../components/ui/PageShell';
import { resolveMediaUrl } from '../utils/mediaUrl';

const Dashboard = () => {
  const { appUser, clerkUser, isSyncing, authError, refreshAppUser } =
    useAuthContext();
  const [profile, setProfile] = useState(null);
  const [completion, setCompletion] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [profileRes, projectsRes] = await Promise.all([
          getMyProfile(),
          getMyProjects(),
        ]);
        if (!active) return;
        setProfile(profileRes.data?.data?.profile || null);
        setCompletion(profileRes.data?.data?.completionPercent || 0);
        setProjectCount(projectsRes.data?.data?.count || 0);
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to load dashboard');
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const displayName =
    profile?.fullName || appUser?.fullName || clerkUser?.fullName || 'Intern';
  const avatar =
    resolveMediaUrl(profile?.profileImage) ||
    resolveMediaUrl(appUser?.profileImage) ||
    clerkUser?.imageUrl ||
    '';

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="animate-fade-up max-w-2xl">
            <p className="font-display text-[11px] font-semibold tracking-[0.24em] text-brand-600 uppercase">
              Workspace
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-[3.35rem] lg:leading-[1.05]">
              Welcome back, {displayName.split(' ')[0]}.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted text-balance">
              Keep your profile sharp and ship a portfolio recruiters can trust
              in a glance.
            </p>
          </div>
          <div className="animate-fade-up delay-2 flex flex-wrap gap-3">
            <Link
              to="/projects"
              className="btn-ghost rounded-xl px-5 py-3 text-sm font-medium text-ink"
            >
              Manage projects
            </Link>
            <Link
              to="/projects/new"
              className="btn-premium rounded-xl px-5 py-3 text-sm font-semibold text-white"
            >
              Add project
            </Link>
          </div>
        </div>

        {(authError || error) && (
          <div className="mt-8">
            <ErrorMessage
              message={authError || error}
              onRetry={() => {
                refreshAppUser();
                window.location.reload();
              }}
            />
          </div>
        )}

        {loading || isSyncing ? (
          <div className="mt-16 flex items-center gap-3 text-muted">
            <LoadingSpinner />
            Loading your workspace...
          </div>
        ) : (
          <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="panel-premium animate-scale-in overflow-hidden rounded-[1.85rem] p-6 sm:p-8">
              <div className="flex items-start gap-4">
                {avatar ? (
                  <img
                    src={avatar}
                    alt=""
                    className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white shadow-[0_10px_30px_rgba(12,23,20,0.12)]"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-200 to-brand-500 font-display text-xl font-semibold text-white shadow-[0_10px_30px_rgba(29,111,82,0.25)]">
                    {displayName.charAt(0)}
                  </div>
                )}
                <div>
                  <h2 className="font-display text-2xl font-semibold text-ink">
                    {displayName}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {profile?.professionalTitle ||
                      'Add a professional title to stand out'}
                  </p>
                  <p className="mt-3 text-sm text-muted">
                    {appUser?.email ||
                      clerkUser?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Location', value: profile?.location || '—' },
                  { label: 'Skills', value: profile?.skills?.length || 0 },
                  { label: 'Projects', value: projectCount },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-line/50 bg-surface/70 px-4 py-4"
                  >
                    <p className="text-[10px] font-semibold tracking-[0.16em] text-muted uppercase">
                      {item.label}
                    </p>
                    <p className="mt-2 font-display text-lg font-semibold text-ink">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/profile/edit"
                  className="text-sm font-semibold text-brand-700 hover:underline"
                >
                  Edit profile →
                </Link>
                <Link
                  to="/projects"
                  className="text-sm font-semibold text-brand-700 hover:underline"
                >
                  View projects →
                </Link>
              </div>
            </div>

            <div className="panel-premium animate-scale-in delay-2 rounded-[1.85rem] p-6 sm:p-8">
              <ProfileCompletion percent={completion} />
              <p className="mt-6 text-sm leading-relaxed text-muted">
                Finish bio, skills, and socials — then add a project with a
                strong cover and clear outcomes.
              </p>
              <Link
                to="/projects/new"
                className="btn-premium mt-7 inline-flex rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
              >
                {projectCount
                  ? 'Add another project'
                  : 'Create your first project'}
              </Link>
            </div>
          </div>
        )}
      </section>
    </PageShell>
  );
};

export default Dashboard;
