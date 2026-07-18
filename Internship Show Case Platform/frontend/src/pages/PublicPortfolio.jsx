import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPublicPortfolio, getPublicProject } from '../api/portfolio';
import PublicProjectModal from '../components/portfolio/PublicProjectModal';
import ShareBar from '../components/portfolio/ShareBar';
import ErrorMessage from '../components/ui/ErrorMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { resolveMediaUrl } from '../utils/mediaUrl';

const themeShell = {
  minimal: 'bg-neutral-50 text-neutral-900',
  professional: 'bg-surface text-ink',
  creative: 'bg-slate-950 text-white',
  bold: 'bg-neutral-950 text-white',
};

const themeMuted = {
  minimal: 'text-black/55',
  professional: 'text-muted',
  creative: 'text-white/65',
  bold: 'text-white/60',
};

const themePanel = {
  minimal: 'bg-white border border-black/10',
  professional: 'bg-white/90 border border-line',
  creative: 'bg-white/8 border border-white/12',
  bold: 'bg-neutral-900 border border-white/10',
};

const PublicPortfolio = () => {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getPublicPortfolio(username);
      setData(res.data?.data || null);
    } catch (err) {
      setData(null);
      setError(err.message || 'Portfolio not found');
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    load();
  }, [load]);

  const openProject = async (project) => {
    setModalOpen(true);
    setSelectedProject(project);
    setModalLoading(true);
    try {
      const res = await getPublicProject(username, project.id);
      setSelectedProject(res.data?.data?.project || project);
    } catch {
      setSelectedProject(project);
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-3 text-muted">
        <LoadingSpinner />
        Loading portfolio…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20">
        <ErrorMessage message={error || 'Portfolio not found'} onRetry={load} />
        <p className="mt-6 text-center text-sm text-muted">
          This portfolio may be private or the link is incorrect.{' '}
          <Link to="/" className="font-semibold text-brand-700 hover:underline">
            Go home
          </Link>
        </p>
      </div>
    );
  }

  const { settings, intern, projects } = data;
  const theme = settings.theme || 'professional';
  const accent = settings.primaryColor || '#1d6f52';
  const visibility = settings.sectionVisibility || {};
  const custom = settings.customization || {};
  const muted = themeMuted[theme] || themeMuted.professional;
  const panel = themePanel[theme] || themePanel.professional;
  const shell = themeShell[theme] || themeShell.professional;
  const isDark = theme === 'creative' || theme === 'bold';
  const headline =
    settings.customHeadline ||
    custom.about?.headline ||
    `${intern.fullName}${intern.professionalTitle ? ` — ${intern.professionalTitle}` : ''}`;
  const avatar = resolveMediaUrl(intern.profileImage);
  const portfolioPath = `/portfolio/${settings.username}`;

  return (
    <div className={`min-h-[70vh] ${shell}`}>
      <div
        className="h-1.5 w-full"
        style={{ background: accent }}
        aria-hidden="true"
      />

      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden="true"
          style={{
            background: `radial-gradient(ellipse 70% 55% at 85% 10%, ${accent}33, transparent 55%), radial-gradient(ellipse 50% 40% at 10% 90%, ${accent}22, transparent 60%)`,
          }}
        />

        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="animate-fade-up max-w-2xl">
              <div className="flex items-start gap-4 sm:gap-5">
                {avatar ? (
                  <img
                    src={avatar}
                    alt=""
                    className="h-20 w-20 rounded-2xl object-cover shadow-lg ring-2 ring-white/30 sm:h-24 sm:w-24"
                  />
                ) : (
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-2xl font-display text-3xl font-semibold text-white shadow-lg sm:h-24 sm:w-24"
                    style={{ background: accent }}
                  >
                    {intern.fullName.charAt(0)}
                  </div>
                )}
                <div>
                  <p
                    className="text-[11px] font-semibold tracking-[0.22em] uppercase"
                    style={{ color: accent }}
                  >
                    Portfolio
                  </p>
                  <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                    {intern.fullName}
                  </h1>
                  {intern.professionalTitle && (
                    <p className={`mt-2 text-base sm:text-lg ${muted}`}>
                      {intern.professionalTitle}
                    </p>
                  )}
                  <p className="mt-3 max-w-xl text-sm leading-relaxed sm:text-base">
                    {headline}
                  </p>
                </div>
              </div>
            </div>

            <div className="animate-fade-up delay-2">
              <ShareBar
                url={portfolioPath}
                title={`${intern.fullName} — Portfolio`}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-8 px-4 pb-16 sm:px-6">
        {visibility.about !== false && (
          <section
            className={`animate-rise rounded-[1.75rem] p-6 sm:p-8 ${panel}`}
          >
            <h2
              className="text-xs font-semibold tracking-[0.18em] uppercase"
              style={{ color: accent }}
            >
              About
            </h2>
            <p className="mt-3 text-base leading-relaxed">
              {intern.bio || 'This intern has not added an about section yet.'}
            </p>
            <div className={`mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm ${muted}`}>
              {intern.location && <span>{intern.location}</span>}
              {(intern.degree || intern.university || intern.graduationYear) && (
                <span>
                  {[intern.degree, intern.university, intern.graduationYear]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
              )}
            </div>
          </section>
        )}

        {visibility.skills !== false && (
          <section
            className={`animate-rise delay-1 rounded-[1.75rem] p-6 sm:p-8 ${panel}`}
          >
            <h2
              className="text-xs font-semibold tracking-[0.18em] uppercase"
              style={{ color: accent }}
            >
              {custom.skills?.title || 'Skills'}
            </h2>
            {intern.skills?.length ? (
              custom.skills?.layout === 'list' ? (
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {intern.skills.map((skill) => (
                    <li key={skill} className="flex items-center gap-2 text-sm">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: accent }}
                      />
                      {skill}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-4 flex flex-wrap gap-2">
                  {intern.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full px-3 py-1.5 text-sm font-medium text-white"
                      style={{ background: accent }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )
            ) : (
              <p className={`mt-3 text-sm ${muted}`}>No skills listed yet.</p>
            )}
          </section>
        )}

        {visibility.projects !== false && (
          <section className="animate-rise delay-2">
            <h2
              className="text-xs font-semibold tracking-[0.18em] uppercase"
              style={{ color: accent }}
            >
              {custom.projects?.title || 'Projects'}
            </h2>
            {projects?.length ? (
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {projects.map((project) => {
                  const cover = resolveMediaUrl(project.images?.[0]);
                  return (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => openProject(project)}
                      className={`group overflow-hidden rounded-[1.5rem] text-left transition ${panel} hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(12,23,20,0.12)]`}
                    >
                      {cover ? (
                        <img
                          src={cover}
                          alt=""
                          className="h-40 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div
                          className="flex h-40 items-center justify-center text-sm font-medium text-white/90"
                          style={{ background: accent }}
                        >
                          {project.title}
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="font-display text-lg font-semibold">
                          {project.title}
                        </h3>
                        <p className={`mt-2 line-clamp-3 text-sm leading-relaxed ${muted}`}>
                          {project.shortDescription}
                        </p>
                        {project.technologies?.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {project.technologies.slice(0, 4).map((tech) => (
                              <span
                                key={tech}
                                className={`rounded px-1.5 py-0.5 text-[10px] ${muted} border border-current/15`}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        <p
                          className="mt-4 text-sm font-semibold"
                          style={{ color: accent }}
                        >
                          View details →
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className={`mt-3 text-sm ${muted}`}>No projects published yet.</p>
            )}
          </section>
        )}

        {visibility.contact !== false && (
          <section
            className={`animate-rise delay-3 rounded-[1.75rem] p-6 sm:p-8 ${panel}`}
          >
            <h2
              className="text-xs font-semibold tracking-[0.18em] uppercase"
              style={{ color: accent }}
            >
              {custom.contact?.title || 'Get in touch'}
            </h2>
            <p className={`mt-3 text-sm leading-relaxed ${muted}`}>
              {custom.contact?.message ||
                'Open to internship and junior roles. Reach out anytime.'}
            </p>
            <div className="mt-5 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-4">
              {intern.email && (
                <a
                  href={`mailto:${intern.email}`}
                  className="font-medium underline-offset-2 hover:underline"
                  style={{ color: accent }}
                >
                  {intern.email}
                </a>
              )}
              {intern.githubUrl && (
                <a
                  href={intern.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline-offset-2 hover:underline"
                  style={{ color: accent }}
                >
                  GitHub
                </a>
              )}
              {intern.linkedinUrl && (
                <a
                  href={intern.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline-offset-2 hover:underline"
                  style={{ color: accent }}
                >
                  LinkedIn
                </a>
              )}
            </div>
          </section>
        )}

        <p className={`pt-4 text-center text-xs ${muted}`}>
          Built on Intern Showcase
          {isDark ? '' : ' · '}
          <Link
            to="/"
            className="font-medium underline-offset-2 hover:underline"
            style={{ color: accent }}
          >
            Create yours
          </Link>
        </p>
      </div>

      <PublicProjectModal
        open={modalOpen}
        project={selectedProject}
        loading={modalLoading}
        accent={accent}
        onClose={() => {
          setModalOpen(false);
          setSelectedProject(null);
        }}
      />
    </div>
  );
};

export default PublicPortfolio;
