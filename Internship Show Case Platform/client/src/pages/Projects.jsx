import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteProject, getMyProjects } from '../api/projects';
import ProjectCard from '../components/projects/ProjectCard';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ErrorMessage from '../components/ui/ErrorMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageShell from '../components/ui/PageShell';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getMyProjects();
      setProjects(res.data?.data?.projects || []);
    } catch (err) {
      setError(err.message || 'Unable to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    setError('');
    try {
      await deleteProject(pendingDelete._id);
      setProjects((prev) =>
        prev.filter((item) => item._id !== pendingDelete._id)
      );
      setPendingDelete(null);
    } catch (err) {
      setError(err.message || 'Failed to delete project');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="animate-fade-up max-w-2xl">
            <p className="font-display text-[11px] font-semibold tracking-[0.24em] text-brand-600 uppercase">
              Portfolio craft
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
              Projects that feel hired for.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted text-balance">
              Curate screenshots, stack, and story — the quiet polish recruiters
              notice first.
            </p>
          </div>

          <div className="animate-fade-up delay-2 flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-white/60 bg-white/50 px-4 py-3 backdrop-blur-md">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-muted uppercase">
                In library
              </p>
              <p className="mt-1 font-display text-2xl font-semibold text-ink">
                {loading ? '—' : projects.length}
              </p>
            </div>
            <Link
              to="/projects/new"
              className="btn-premium inline-flex items-center rounded-xl px-5 py-3 text-sm font-semibold text-white"
            >
              New project
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-8 animate-fade-in">
            <ErrorMessage message={error} onRetry={load} />
          </div>
        )}

        {loading ? (
          <div className="mt-20 flex items-center justify-center gap-3 text-muted">
            <LoadingSpinner />
            Composing your library...
          </div>
        ) : projects.length === 0 ? (
          <div className="panel-premium animate-scale-in relative mt-14 overflow-hidden rounded-[2rem] px-6 py-20 text-center sm:px-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(62,163,122,0.18),transparent_55%)]" />
            <div className="relative">
              <p className="font-display text-[11px] font-semibold tracking-[0.22em] text-brand-600 uppercase">
                Start here
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink">
                Your first showcase piece
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
                Add one strong project with a clear cover image, tech stack, and
                outcome — then build from there.
              </p>
              <Link
                to="/projects/new"
                className="btn-premium mt-8 inline-flex rounded-xl px-6 py-3 text-sm font-semibold text-white"
              >
                Create first project
              </Link>
            </div>
          </div>
        ) : (
          <div className="stagger mt-14 grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard
                key={project._id}
                project={project}
                index={index}
                onDelete={setPendingDelete}
              />
            ))}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this project?"
        message={`“${pendingDelete?.title || 'This project'}” will be permanently removed, including uploaded images.`}
        confirmLabel="Delete project"
        busy={deleting}
        onCancel={() => !deleting && setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </PageShell>
  );
};

export default Projects;
