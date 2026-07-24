import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteProject, getProject } from '../api/projects';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ErrorMessage from '../components/ui/ErrorMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageShell from '../components/ui/PageShell';
import { resolveMediaUrl } from '../utils/mediaUrl';
import { categoryLabel } from '../utils/projectValidation';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getProject(id);
        if (!active) return;
        setProject(res.data?.data?.project || null);
        setActiveImage(0);
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to load project');
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [id]);

  const images = useMemo(
    () => (project?.images || []).map((item) => resolveMediaUrl(item)),
    [project]
  );

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProject(id);
      navigate('/projects');
    } catch (err) {
      setError(err.message || 'Failed to delete project');
      setConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <PageShell>
        <div className="flex min-h-[50vh] items-center justify-center gap-3 text-muted">
          <LoadingSpinner />
          Loading project...
        </div>
      </PageShell>
    );
  }

  if (error && !project) {
    return (
      <PageShell>
        <div className="mx-auto max-w-3xl px-4 py-16">
          <ErrorMessage
            message={error}
            onRetry={() => window.location.reload()}
          />
          <Link
            to="/projects"
            className="mt-6 inline-flex text-sm font-semibold text-brand-700 hover:underline"
          >
            ← Back to projects
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="animate-fade-up flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/projects"
            className="btn-ghost inline-flex rounded-xl px-3.5 py-2 text-sm font-medium text-ink"
          >
            ← Library
          </Link>
          <div className="flex flex-wrap gap-2">
            <Link
              to={`/projects/${id}/edit`}
              className="btn-ghost inline-flex rounded-xl px-4 py-2 text-sm font-medium text-ink"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="rounded-xl border border-red-200/80 bg-red-50/80 px-4 py-2 text-sm font-medium text-red-700 backdrop-blur transition hover:bg-red-100"
            >
              Delete
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6">
            <ErrorMessage message={error} />
          </div>
        )}

        <div className="animate-scale-in mt-8 overflow-hidden rounded-[2rem] panel-premium">
          <div className="relative aspect-[16/9] bg-brand-900">
            {images[activeImage] ? (
              <img
                src={images[activeImage]}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#3ea37a,transparent_50%),linear-gradient(145deg,#144635,#0a1411)]">
                <span className="font-display text-sm font-semibold tracking-[0.2em] text-white/80 uppercase">
                  No gallery yet
                </span>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-white uppercase backdrop-blur">
                  {categoryLabel(project.category)}
                </span>
                <span className="text-xs text-white/70">
                  Updated{' '}
                  {project.updatedAt
                    ? new Date(project.updatedAt).toLocaleDateString()
                    : '—'}
                </span>
              </div>
              <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {project.title}
              </h1>
              <p className="mt-3 max-w-2xl text-base text-white/80">
                {project.shortDescription}
              </p>
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto border-t border-line/60 bg-surface/40 px-4 py-4 sm:px-6">
              {images.map((src, index) => (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`h-[4.25rem] w-28 shrink-0 overflow-hidden rounded-xl border transition ${
                    index === activeImage
                      ? 'border-brand-500 ring-2 ring-brand-400/35'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="animate-fade-up delay-1 panel-premium rounded-[1.75rem] p-6 sm:p-8">
            <p className="font-display text-[11px] font-semibold tracking-[0.2em] text-brand-600 uppercase">
              Narrative
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-ink">
              About this project
            </h2>
            <p className="mt-5 whitespace-pre-wrap text-[15px] leading-8 text-muted">
              {project.fullDescription}
            </p>
          </div>

          <aside className="animate-fade-up delay-2 space-y-5">
            <div className="panel-premium rounded-[1.75rem] p-6">
              <p className="font-display text-[11px] font-semibold tracking-[0.2em] text-brand-600 uppercase">
                Links
              </p>
              <div className="mt-4 flex flex-col gap-2.5">
                {project.liveDemoUrl ? (
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-premium inline-flex justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Live demo
                  </a>
                ) : null}
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost inline-flex justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-ink"
                  >
                    GitHub repository
                  </a>
                ) : null}
                {!project.liveDemoUrl && !project.githubUrl && (
                  <p className="text-sm text-muted">No links added yet.</p>
                )}
              </div>
            </div>

            {project.technologies?.length > 0 && (
              <div className="panel-premium rounded-[1.75rem] p-6">
                <p className="font-display text-[11px] font-semibold tracking-[0.2em] text-brand-600 uppercase">
                  Stack
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-line/70 bg-white/70 px-3 py-1.5 text-sm text-ink"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.tags?.length > 0 && (
              <div className="panel-premium rounded-[1.75rem] p-6">
                <p className="font-display text-[11px] font-semibold tracking-[0.2em] text-brand-600 uppercase">
                  Tags
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this project?"
        message="This cannot be undone. Images linked to the project will also be removed."
        confirmLabel="Delete project"
        busy={deleting}
        onCancel={() => !deleting && setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </PageShell>
  );
};

export default ProjectDetails;
