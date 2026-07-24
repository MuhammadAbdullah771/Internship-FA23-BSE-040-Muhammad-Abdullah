import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getExploreProject } from '../api/explore';
import ErrorMessage from '../components/ui/ErrorMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageShell from '../components/ui/PageShell';
import { resolveMediaUrl } from '../utils/mediaUrl';
import { categoryLabel } from '../utils/projectValidation';

const ExploreProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getExploreProject(id);
        if (!active) return;
        setProject(res.data?.data?.project || null);
      } catch (err) {
        if (!active) return;
        setProject(null);
        setError(err.message || 'Project not found');
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <PageShell>
        <div className="flex min-h-[50vh] items-center justify-center gap-3 text-muted">
          <LoadingSpinner />
          Loading project…
        </div>
      </PageShell>
    );
  }

  if (error || !project) {
    return (
      <PageShell>
        <div className="mx-auto max-w-lg px-4 py-20">
          <ErrorMessage message={error || 'Project not found'} />
          <div className="mt-6 text-center">
            <Link
              to="/explore"
              className="text-sm font-semibold text-brand-700 hover:underline"
            >
              ← Back to explore
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  const cover = resolveMediaUrl(project.images?.[0]);
  const avatar = resolveMediaUrl(project.intern?.profileImage);

  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
        <Link
          to="/explore"
          className="text-sm font-semibold text-brand-700 hover:underline"
        >
          ← Back to explore
        </Link>

        <article className="panel-premium mt-6 overflow-hidden rounded-[1.85rem] animate-scale-in">
          {cover ? (
            <img
              src={cover}
              alt=""
              className="aspect-[16/9] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-brand-700 to-brand-900">
              <span className="font-display text-sm font-semibold tracking-[0.2em] text-white/80 uppercase">
                {categoryLabel(project.category)}
              </span>
            </div>
          )}

          <div className="p-6 sm:p-8">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-brand-600 uppercase">
              {categoryLabel(project.category)}
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {project.title}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted">
              {project.shortDescription}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-line/70 bg-surface/60 p-4">
              {avatar ? (
                <img
                  src={avatar}
                  alt=""
                  className="h-11 w-11 rounded-xl object-cover"
                />
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-sm font-semibold text-brand-800">
                  {(project.intern?.fullName || 'I').charAt(0)}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink">
                  {project.intern?.fullName || 'Intern'}
                </p>
                <p className="truncate text-sm text-muted">
                  {project.intern?.professionalTitle || 'Published portfolio'}
                </p>
              </div>
              {project.intern?.username && (
                <Link
                  to={`/portfolio/${project.intern.username}`}
                  className="btn-premium rounded-xl px-4 py-2 text-sm font-semibold text-white"
                >
                  View portfolio
                </Link>
              )}
            </div>

            {project.fullDescription && (
              <div className="mt-8">
                <h2 className="font-display text-lg font-semibold text-ink">
                  About this project
                </h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink/90">
                  {project.fullDescription}
                </p>
              </div>
            )}

            {project.technologies?.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-lg font-semibold text-ink">
                  Technologies
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {project.liveDemoUrl && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-premium rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Live demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost rounded-xl px-4 py-2.5 text-sm font-medium text-ink"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        </article>
      </section>
    </PageShell>
  );
};

export default ExploreProjectDetails;
