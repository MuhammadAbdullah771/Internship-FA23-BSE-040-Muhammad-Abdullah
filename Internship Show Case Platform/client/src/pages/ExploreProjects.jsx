import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getExploreMeta, searchProjects } from '../api/explore';
import DiscoveryProjectCard from '../components/explore/DiscoveryProjectCard';
import EmptyState from '../components/ui/EmptyState';
import ErrorMessage from '../components/ui/ErrorMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageShell from '../components/ui/PageShell';
import Pagination from '../components/ui/Pagination';
import { PROJECT_CATEGORIES } from '../utils/projectValidation';

const fieldClass =
  'field-premium w-full rounded-xl px-3.5 py-2.5 text-sm text-ink disabled:opacity-60';

const ExploreProjects = () => {
  const [q, setQ] = useState('');
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [technology, setTechnology] = useState('');
  const [skill, setSkill] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 0,
    total: 0,
    limit: 12,
  });
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getExploreMeta()
      .then((res) => setMeta(res.data?.data || null))
      .catch(() => setMeta(null));
  }, []);

  const params = useMemo(
    () => ({
      q: q || undefined,
      title: title || undefined,
      name: name || undefined,
      category: category || undefined,
      technology: technology || undefined,
      skill: skill || undefined,
      sort,
      page,
      limit: 12,
    }),
    [q, title, name, category, technology, skill, sort, page]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await searchProjects(params);
      const data = res.data?.data || {};
      setProjects(data.projects || []);
      setPagination(
        data.pagination || { page: 1, pages: 0, total: 0, limit: 12 }
      );
    } catch (err) {
      setProjects([]);
      setError(err.message || 'Unable to load projects');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    load();
  }, [load]);

  const onSubmit = (event) => {
    event.preventDefault();
    setPage(1);
  };

  const clearFilters = () => {
    setQ('');
    setTitle('');
    setName('');
    setCategory('');
    setTechnology('');
    setSkill('');
    setSort('newest');
    setPage(1);
  };

  const techOptions = meta?.technologies?.map((item) => item.value) || [];
  const skillOptions = meta?.skills?.map((item) => item.value) || [];

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="animate-fade-up max-w-2xl">
            <p className="font-display text-[11px] font-semibold tracking-[0.24em] text-brand-600 uppercase">
              Employer view
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Explore projects
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
              Discover published intern work by title, technology, category, or
              intern name.
            </p>
          </div>
          <Link
            to="/interns"
            className="btn-ghost animate-fade-up delay-2 rounded-xl px-4 py-2.5 text-sm font-medium text-ink"
          >
            Discover interns →
          </Link>
        </div>

        <form
          onSubmit={onSubmit}
          className="panel-premium mt-8 animate-scale-in rounded-[1.75rem] p-5 sm:p-6"
        >
          <div className="grid gap-3 lg:grid-cols-[1.4fr_auto]">
            <input
              type="search"
              value={q}
              onChange={(event) => {
                setQ(event.target.value);
                setPage(1);
              }}
              placeholder="Search projects…"
              className={fieldClass}
              aria-label="Search projects"
            />
            <button
              type="submit"
              className="btn-premium rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
            >
              Search
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <input
              type="text"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setPage(1);
              }}
              placeholder="Project title"
              className={fieldClass}
            />
            <input
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setPage(1);
              }}
              placeholder="Intern name"
              className={fieldClass}
            />
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setPage(1);
              }}
              className={fieldClass}
            >
              <option value="">All categories</option>
              {PROJECT_CATEGORIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              list="explore-tech"
              value={technology}
              onChange={(event) => {
                setTechnology(event.target.value);
                setPage(1);
              }}
              placeholder="Technology"
              className={fieldClass}
            />
            <datalist id="explore-tech">
              {techOptions.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
            <input
              type="text"
              list="explore-skills"
              value={skill}
              onChange={(event) => {
                setSkill(event.target.value);
                setPage(1);
              }}
              placeholder="Intern skill"
              className={fieldClass}
            />
            <datalist id="explore-skills">
              {skillOptions.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                setPage(1);
              }}
              className={fieldClass}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title A–Z</option>
              <option value="relevance">Relevance</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-muted hover:text-ink"
            >
              Clear filters
            </button>
            {typeof meta?.publishedPortfolios === 'number' && (
              <span className="text-xs text-muted">
                {meta.publishedPortfolios} published portfolio
                {meta.publishedPortfolios === 1 ? '' : 's'}
              </span>
            )}
          </div>
        </form>

        {error && (
          <div className="mt-6">
            <ErrorMessage message={error} onRetry={load} />
          </div>
        )}

        {loading ? (
          <div className="mt-16 flex items-center gap-3 text-muted">
            <LoadingSpinner />
            Searching projects…
          </div>
        ) : projects.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="No projects found"
              message="No published projects match these filters. Try a broader search, or ask interns to publish their portfolios."
              action={
                <button
                  type="button"
                  onClick={clearFilters}
                  className="btn-premium rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Reset filters
                </button>
              }
            />
          </div>
        ) : (
          <div className="mt-10 space-y-8">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((project, index) => (
                <DiscoveryProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                />
              ))}
            </div>
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              total={pagination.total}
              onChange={setPage}
              disabled={loading}
            />
          </div>
        )}
      </section>
    </PageShell>
  );
};

export default ExploreProjects;
