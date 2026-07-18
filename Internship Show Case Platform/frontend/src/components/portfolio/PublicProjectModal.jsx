import { useEffect } from 'react';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import LoadingSpinner from '../ui/LoadingSpinner';

const PublicProjectModal = ({
  open,
  project,
  loading,
  accent = '#1d6f52',
  onClose,
}) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  const cover = resolveMediaUrl(project?.images?.[0]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/55 px-3 py-4 backdrop-blur-[6px] sm:items-center sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="public-project-title"
      onClick={onClose}
    >
      <div
        className="panel-premium max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[1.6rem] animate-scale-in"
        onClick={(event) => event.stopPropagation()}
      >
        {loading || !project ? (
          <div className="flex items-center justify-center gap-3 px-6 py-16 text-muted">
            <LoadingSpinner />
            Loading project…
          </div>
        ) : (
          <>
            {cover && (
              <img
                src={cover}
                alt=""
                className="h-48 w-full object-cover sm:h-56"
              />
            )}
            <div className="p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className="text-[10px] font-semibold tracking-[0.2em] uppercase"
                    style={{ color: accent }}
                  >
                    {project.category || 'Project'}
                  </p>
                  <h2
                    id="public-project-title"
                    className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink"
                  >
                    {project.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-line px-3 py-1.5 text-sm text-muted hover:text-ink"
                >
                  Close
                </button>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted">
                {project.shortDescription}
              </p>

              {project.fullDescription && (
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink">
                  {project.fullDescription}
                </p>
              )}

              {project.technologies?.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full px-2.5 py-1 text-xs font-medium text-white"
                      style={{ background: accent }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
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
          </>
        )}
      </div>
    </div>
  );
};

export default PublicProjectModal;
