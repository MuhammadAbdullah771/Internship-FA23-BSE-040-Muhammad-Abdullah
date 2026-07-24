import { resolveMediaUrl } from '../../utils/mediaUrl';

const THEME_STYLES = {
  minimal: {
    shell: 'bg-neutral-50 text-neutral-900',
    panel: 'bg-white border border-black/10',
    muted: 'text-black/55',
    radius: 'rounded-none',
  },
  professional: {
    shell: 'bg-surface text-ink',
    panel: 'bg-white/90 border border-line',
    muted: 'text-muted',
    radius: 'rounded-2xl',
  },
  creative: {
    shell: 'bg-slate-900 text-white',
    panel: 'bg-white/8 border border-white/12',
    muted: 'text-white/65',
    radius: 'rounded-3xl',
  },
  bold: {
    shell: 'bg-neutral-950 text-white',
    panel: 'bg-neutral-900 border border-white/10',
    muted: 'text-white/60',
    radius: 'rounded-xl',
  },
};

const PortfolioPreview = ({ settings, profile, projects, user }) => {
  if (!settings) {
    return (
      <div className="flex h-full min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-line bg-white/50 text-sm text-muted">
        Configure your portfolio to see a live preview
      </div>
    );
  }

  const theme = THEME_STYLES[settings.theme] || THEME_STYLES.professional;
  const accent = settings.primaryColor || '#1d6f52';
  const visibility = settings.sectionVisibility || {};
  const custom = settings.customization || {};
  const name = profile?.fullName || user?.fullName || 'Your Name';
  const title = profile?.professionalTitle || 'Professional title';
  const headline =
    settings.customHeadline ||
    custom.about?.headline ||
    `${name} — ${title}`;
  const aboutText =
    custom.about?.intro ||
    profile?.bio ||
    'Add a short about intro to introduce yourself to recruiters.';
  const avatar =
    resolveMediaUrl(profile?.profileImage) ||
    resolveMediaUrl(user?.profileImage) ||
    '';
  const skills = profile?.skills || [];
  const skillsTitle = custom.skills?.title || 'Skills';
  const projectsTitle = custom.projects?.title || 'Projects';
  const contactTitle = custom.contact?.title || 'Get in touch';
  const contactMessage =
    custom.contact?.message ||
    'Open to internship and junior roles. Reach out anytime.';

  return (
    <div
      className={`overflow-hidden border border-line/70 shadow-[0_20px_50px_rgba(12,23,20,0.08)] ${theme.shell} ${theme.radius}`}
      style={{ '--preview-accent': accent }}
    >
      <div
        className="h-1.5 w-full"
        style={{ background: 'var(--preview-accent)' }}
        aria-hidden="true"
      />

      <div className="max-h-[720px] overflow-y-auto p-5 sm:p-6">
        <header className="animate-fade-up">
          <div className="flex items-start gap-4">
            {avatar ? (
              <img
                src={avatar}
                alt=""
                className={`h-14 w-14 object-cover ring-2 ring-white/40 ${theme.radius === 'rounded-none' ? '' : 'rounded-2xl'}`}
              />
            ) : (
              <div
                className={`flex h-14 w-14 items-center justify-center text-lg font-semibold text-white ${theme.radius === 'rounded-none' ? '' : 'rounded-2xl'}`}
                style={{ background: accent }}
              >
                {name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p
                className="text-[10px] font-semibold tracking-[0.2em] uppercase"
                style={{ color: accent }}
              >
                Portfolio
              </p>
              <h2 className="mt-1 font-display text-xl font-semibold leading-tight sm:text-2xl">
                {headline}
              </h2>
              <p className={`mt-1 text-sm ${theme.muted}`}>{title}</p>
            </div>
          </div>
        </header>

        {visibility.about !== false && (
          <section className={`mt-6 ${theme.panel} p-4 ${theme.radius}`}>
            <h3
              className="text-xs font-semibold tracking-[0.16em] uppercase"
              style={{ color: accent }}
            >
              About
            </h3>
            <p className="mt-2 text-sm leading-relaxed">{aboutText}</p>
            <div className={`mt-3 flex flex-wrap gap-3 text-xs ${theme.muted}`}>
              {custom.about?.showLocation !== false && profile?.location && (
                <span>{profile.location}</span>
              )}
              {custom.about?.showEducation !== false &&
                (profile?.university || profile?.degree) && (
                  <span>
                    {[profile.degree, profile.university, profile.graduationYear]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                )}
            </div>
          </section>
        )}

        {visibility.skills !== false && (
          <section className={`mt-4 ${theme.panel} p-4 ${theme.radius}`}>
            <h3
              className="text-xs font-semibold tracking-[0.16em] uppercase"
              style={{ color: accent }}
            >
              {skillsTitle}
            </h3>
            {skills.length === 0 ? (
              <p className={`mt-2 text-sm ${theme.muted}`}>
                Add skills on your profile to show them here.
              </p>
            ) : custom.skills?.layout === 'list' ? (
              <ul className="mt-3 space-y-1.5 text-sm">
                {skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: accent }}
                    />
                    {skill}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full px-2.5 py-1 text-xs font-medium text-white"
                    style={{ background: accent }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </section>
        )}

        {visibility.projects !== false && (
          <section className="mt-4">
            <h3
              className="text-xs font-semibold tracking-[0.16em] uppercase"
              style={{ color: accent }}
            >
              {projectsTitle}
            </h3>
            {projects?.length ? (
              <div className="mt-3 space-y-3">
                {projects.map((project) => {
                  const cover = resolveMediaUrl(project.images?.[0]);
                  return (
                    <article
                      key={project._id}
                      className={`${theme.panel} overflow-hidden ${theme.radius}`}
                    >
                      {cover && (
                        <img
                          src={cover}
                          alt=""
                          className="h-28 w-full object-cover"
                        />
                      )}
                      <div className="p-3.5">
                        <h4 className="font-display text-sm font-semibold">
                          {project.title}
                        </h4>
                        <p
                          className={`mt-1 text-xs leading-relaxed ${theme.muted}`}
                        >
                          {project.shortDescription}
                        </p>
                        {custom.projects?.showTechnologies !== false &&
                          project.technologies?.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {project.technologies.slice(0, 5).map((tech) => (
                                <span
                                  key={tech}
                                  className={`rounded px-1.5 py-0.5 text-[10px] ${theme.muted} border border-current/20`}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className={`mt-2 text-sm ${theme.muted}`}>
                Add projects to feature them on your portfolio.
              </p>
            )}
          </section>
        )}

        {visibility.contact !== false && (
          <section className={`mt-4 ${theme.panel} p-4 ${theme.radius}`}>
            <h3
              className="text-xs font-semibold tracking-[0.16em] uppercase"
              style={{ color: accent }}
            >
              {contactTitle}
            </h3>
            <p className={`mt-2 text-sm leading-relaxed ${theme.muted}`}>
              {contactMessage}
            </p>
            <div className="mt-3 flex flex-col gap-1.5 text-sm">
              {custom.contact?.showEmail !== false && user?.email && (
                <span>{user.email}</span>
              )}
              {custom.contact?.showGithub !== false && profile?.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-2 hover:underline"
                  style={{ color: accent }}
                >
                  GitHub
                </a>
              )}
              {custom.contact?.showLinkedin !== false &&
                profile?.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline-offset-2 hover:underline"
                    style={{ color: accent }}
                  >
                    LinkedIn
                  </a>
                )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default PortfolioPreview;
