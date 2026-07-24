import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardAnalytics, getDashboardStats } from '../api/dashboard';
import ErrorMessage from '../components/ui/ErrorMessage';
import ProfileCompletion from '../components/profile/ProfileCompletion';
import Skeleton from '../components/ui/Skeleton';
import { resolveMediaUrl } from '../utils/mediaUrl';
import { categoryLabel } from '../utils/projectValidation';

const StatCard = ({ label, value, hint }) => (
  <div className="stat-card animate-scale-in rounded-2xl px-4 py-4 pl-5">
    <p className="text-[10px] font-semibold tracking-[0.16em] text-muted uppercase">
      {label}
    </p>
    <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
      {value}
    </p>
    {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        getDashboardStats(),
        getDashboardAnalytics(14),
      ]);
      setData(statsRes.data?.data || null);
      setAnalytics(analyticsRes.data?.data || null);
    } catch (err) {
      setError(err.message || 'Unable to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 py-2">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-8">
        <ErrorMessage message={error || 'Dashboard unavailable'} onRetry={load} />
      </div>
    );
  }

  const displayName = data.profile?.fullName || data.user?.fullName || 'Intern';
  const avatar =
    resolveMediaUrl(data.profile?.profileImage) ||
    resolveMediaUrl(data.user?.profileImage) ||
    '';
  const maxSeries = Math.max(
    1,
    ...(analytics?.series || []).flatMap((day) => [
      day.portfolio,
      day.project,
    ])
  );

  return (
    <div className="space-y-8 py-2">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="animate-fade-up">
          <p className="font-display text-[11px] font-semibold tracking-[0.24em] text-brand-600 uppercase">
            Dashboard
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Welcome back, {displayName.split(' ')[0]}.
          </h1>
          <p className="mt-2 text-sm text-muted">
            Track portfolio reach, project views, and profile readiness.
          </p>
        </div>
        <div className="animate-fade-up delay-1 flex flex-wrap gap-2">
          <Link
            to="/projects/new"
            className="btn-premium rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          >
            Add project
          </Link>
          <Link
            to="/portfolio"
            className="btn-ghost rounded-xl px-4 py-2.5 text-sm font-medium text-ink"
          >
            Edit portfolio
          </Link>
        </div>
      </div>

      <div className="stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total projects"
          value={data.stats.totalProjects}
          hint="In your workspace"
        />
        <StatCard
          label="Portfolio views"
          value={data.stats.portfolioViews}
          hint={`${data.stats.portfolioViews7d} in last 7 days`}
        />
        <StatCard
          label="Project views"
          value={data.stats.totalProjectViews}
          hint={`${data.stats.projectViews7d} in last 7 days`}
        />
        <StatCard
          label="Profile completion"
          value={`${data.completionPercent}%`}
          hint={data.stats.portfolioStatus}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="panel-premium animate-scale-in rounded-[1.75rem] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-ink">
              Views (14 days)
            </h2>
            <p className="text-xs text-muted">
              Portfolio {analytics?.totals?.portfolio || 0} · Projects{' '}
              {analytics?.totals?.project || 0}
            </p>
          </div>
          <div className="mt-5 flex h-44 items-end gap-1.5 rounded-2xl bg-gradient-to-t from-brand-50/60 to-transparent px-1 pb-1 sm:gap-2">
            {(analytics?.series || []).map((day) => (
              <div
                key={day.date}
                className="flex flex-1 flex-col items-center justify-end gap-1"
                title={`${day.date}: portfolio ${day.portfolio}, projects ${day.project}`}
              >
                <div
                  className="chart-bar w-full rounded-t-md opacity-80"
                  style={{
                    height: `${Math.max(6, (day.project / maxSeries) * 100)}%`,
                  }}
                />
                <div
                  className="chart-bar-strong w-full rounded-t-md"
                  style={{
                    height: `${Math.max(6, (day.portfolio / maxSeries) * 100)}%`,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-brand-700" /> Portfolio
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-brand-300" /> Projects
            </span>
          </div>
        </div>

        <div className="panel-premium animate-scale-in delay-1 rounded-[1.75rem] p-5 sm:p-6">
          <div className="flex items-start gap-4">
            {avatar ? (
              <img
                src={avatar}
                alt=""
                className="h-14 w-14 rounded-2xl object-cover ring-2 ring-brand-100"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-200 to-brand-600 font-display text-xl font-semibold text-white">
                {displayName.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">
                {displayName}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {data.profile?.professionalTitle || 'Add a professional title'}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <ProfileCompletion percent={data.completionPercent} />
          </div>
          {data.stats.publicUrl && data.stats.portfolioStatus === 'published' ? (
            <Link
              to={data.stats.publicUrl}
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 transition hover:gap-2"
            >
              Open public portfolio →
            </Link>
          ) : (
            <Link
              to="/portfolio"
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 transition hover:gap-2"
            >
              Publish your portfolio →
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="panel-premium rounded-[1.75rem] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-ink">
              Recent projects
            </h2>
            <Link
              to="/projects"
              className="text-sm font-semibold text-brand-700 hover:underline"
            >
              View all
            </Link>
          </div>
          {data.recentProjects?.length ? (
            <ul className="mt-4 space-y-3">
              {data.recentProjects.map((project) => {
                const cover = resolveMediaUrl(project.images?.[0]);
                return (
                  <li key={project.id}>
                    <Link
                      to={`/projects/${project.id}`}
                      className="list-row flex items-center gap-3 rounded-2xl p-3"
                    >
                      {cover ? (
                        <img
                          src={cover}
                          alt=""
                          className="h-12 w-16 rounded-lg object-cover"
                        />
                      ) : (
                        <span className="flex h-12 w-16 items-center justify-center rounded-lg bg-brand-50 text-[10px] font-semibold tracking-wider text-brand-800 uppercase">
                          {categoryLabel(project.category)}
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-ink">
                          {project.title}
                        </p>
                        <p className="truncate text-xs text-muted">
                          {project.viewCount || 0} views
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted">
              No projects yet.{' '}
              <Link
                to="/projects/new"
                className="font-semibold text-brand-700 hover:underline"
              >
                Create one
              </Link>
            </p>
          )}
        </div>

        <div className="panel-premium rounded-[1.75rem] p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            Quick actions
          </h2>
          <div className="mt-4 grid gap-2">
            {data.quickActions?.map((action) => (
              <Link
                key={action.href}
                to={action.href}
                className="list-row rounded-xl px-4 py-3 text-sm font-medium text-ink"
              >
                {action.label} →
              </Link>
            ))}
          </div>
          {analytics?.topProjects?.length > 0 && (
            <div className="mt-6 border-t border-line/60 pt-5">
              <h3 className="text-sm font-semibold text-ink">Top viewed</h3>
              <ul className="mt-3 space-y-2">
                {analytics.topProjects.map((project) => (
                  <li
                    key={project.id}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="truncate text-muted">{project.title}</span>
                    <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-0.5 font-semibold text-brand-800">
                      {project.viewCount}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
