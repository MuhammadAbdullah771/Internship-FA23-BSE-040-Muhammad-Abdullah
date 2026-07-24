import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyProfile } from '../api/profile';
import ProfileCompletion from '../components/profile/ProfileCompletion';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { resolveMediaUrl } from '../utils/mediaUrl';

const ExternalLink = ({ href, label }) => {
  if (!href) return <span className="text-muted">—</span>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-brand-700 break-all hover:underline"
    >
      {label || href}
    </a>
  );
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [completion, setCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getMyProfile();
        if (!active) return;
        setProfile(res.data?.data?.profile || null);
        setCompletion(res.data?.data?.completionPercent || 0);
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to load profile');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-muted">
        <LoadingSpinner />
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!profile) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand-600 uppercase">
          Profile
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">
          Build your intern identity
        </h1>
        <p className="mt-4 text-muted">
          You have not created a profile yet. Add personal details, education,
          skills, and social links to get started.
        </p>
        <Link
          to="/profile/edit"
          className="mt-8 inline-flex rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Create profile
        </Link>
      </section>
    );
  }

  const avatar = resolveMediaUrl(profile.profileImage);

  return (
    <div className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(40,163,122,0.12),transparent_40%),linear-gradient(180deg,#eef4f1_0%,#ffffff_60%)]" />
      </div>

      <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="overflow-hidden rounded-[2rem] border border-line bg-white/85 shadow-[0_24px_70px_rgba(12,23,20,0.07)] backdrop-blur-sm">
          <div className="relative h-44 overflow-hidden sm:h-56">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1800&q=80"
              alt=""
              className="h-full w-full object-cover brightness-[0.78] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
          </div>

          <div className="relative -mt-12 px-6 pb-8 sm:px-10 sm:pb-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                {avatar ? (
                  <img
                    src={avatar}
                    alt=""
                    className="h-24 w-24 rounded-3xl object-cover ring-4 ring-white"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-brand-100 font-display text-3xl font-semibold text-brand-800 ring-4 ring-white">
                    {profile.fullName?.charAt(0) || 'I'}
                  </div>
                )}
                <div className="pb-1">
                  <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
                    {profile.fullName}
                  </h1>
                  <p className="mt-1 text-muted">
                    {profile.professionalTitle || 'Professional title not set'}
                  </p>
                </div>
              </div>
              <Link
                to="/profile/edit"
                className="rounded-xl bg-brand-600 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Edit profile
              </Link>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-8">
                <div>
                  <h2 className="font-display text-lg font-semibold text-ink">
                    About
                  </h2>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted sm:text-base">
                    {profile.bio || 'No bio added yet.'}
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-lg font-semibold text-ink">
                    Skills
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(profile.skills || []).length === 0 ? (
                      <p className="text-sm text-muted">No skills added yet.</p>
                    ) : (
                      profile.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-800"
                        >
                          {skill}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <ProfileCompletion
                  percent={completion}
                  className="rounded-2xl border border-line bg-surface p-5"
                />

                <div className="rounded-2xl border border-line bg-surface p-5">
                  <h2 className="font-display text-lg font-semibold text-ink">
                    Education & location
                  </h2>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted">Location</dt>
                      <dd className="text-right text-ink">
                        {profile.location || '—'}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted">University</dt>
                      <dd className="text-right text-ink">
                        {profile.university || '—'}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted">Degree</dt>
                      <dd className="text-right text-ink">
                        {profile.degree || '—'}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted">Graduation</dt>
                      <dd className="text-right text-ink">
                        {profile.graduationYear || '—'}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-2xl border border-line bg-surface p-5">
                  <h2 className="font-display text-lg font-semibold text-ink">
                    Social links
                  </h2>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div>
                      <dt className="text-muted">GitHub</dt>
                      <dd className="mt-1">
                        <ExternalLink href={profile.githubUrl} />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted">LinkedIn</dt>
                      <dd className="mt-1">
                        <ExternalLink href={profile.linkedinUrl} />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted">Portfolio</dt>
                      <dd className="mt-1">
                        <ExternalLink href={profile.portfolioUrl} />
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
