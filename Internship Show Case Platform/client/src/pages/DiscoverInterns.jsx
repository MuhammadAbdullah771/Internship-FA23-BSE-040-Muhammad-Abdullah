import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { searchInterns } from '../api/explore';
import InternCard from '../components/explore/InternCard';
import EmptyState from '../components/ui/EmptyState';
import ErrorMessage from '../components/ui/ErrorMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageShell from '../components/ui/PageShell';
import Pagination from '../components/ui/Pagination';

const fieldClass =
  'field-premium w-full rounded-xl px-3.5 py-2.5 text-sm text-ink disabled:opacity-60';

const DiscoverInterns = () => {
  const [q, setQ] = useState('');
  const [name, setName] = useState('');
  const [skill, setSkill] = useState('');
  const [technology, setTechnology] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [interns, setInterns] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 0,
    total: 0,
    limit: 12,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const params = useMemo(
    () => ({
      q: q || undefined,
      name: name || undefined,
      skill: skill || undefined,
      technology: technology || undefined,
      sort,
      page,
      limit: 12,
    }),
    [q, name, skill, technology, sort, page]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await searchInterns(params);
      const data = res.data?.data || {};
      setInterns(data.interns || []);
      setPagination(
        data.pagination || { page: 1, pages: 0, total: 0, limit: 12 }
      );
    } catch (err) {
      setInterns([]);
      setError(err.message || 'Unable to load interns');
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
    setName('');
    setSkill('');
    setTechnology('');
    setSort('newest');
    setPage(1);
  };

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="animate-fade-up max-w-2xl">
            <p className="font-display text-[11px] font-semibold tracking-[0.24em] text-brand-600 uppercase">
              Employer view
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Discover interns
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
              Browse published intern portfolios by name, skills, or the
              technologies they ship with.
            </p>
          </div>
          <Link
            to="/explore"
            className="btn-ghost animate-fade-up delay-2 rounded-xl px-4 py-2.5 text-sm font-medium text-ink"
          >
            Explore projects →
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
              placeholder="Search interns…"
              className={fieldClass}
              aria-label="Search interns"
            />
            <button
              type="submit"
              className="btn-premium rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
            >
              Search
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
            <input
              type="text"
              value={skill}
              onChange={(event) => {
                setSkill(event.target.value);
                setPage(1);
              }}
              placeholder="Skill (e.g. React)"
              className={fieldClass}
            />
            <input
              type="text"
              value={technology}
              onChange={(event) => {
                setTechnology(event.target.value);
                setPage(1);
              }}
              placeholder="Project technology"
              className={fieldClass}
            />
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
              <option value="name">Name A–Z</option>
            </select>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 text-sm font-medium text-muted hover:text-ink"
          >
            Clear filters
          </button>
        </form>

        {error && (
          <div className="mt-6">
            <ErrorMessage message={error} onRetry={load} />
          </div>
        )}

        {loading ? (
          <div className="mt-16 flex items-center gap-3 text-muted">
            <LoadingSpinner />
            Searching interns…
          </div>
        ) : interns.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="No interns found"
              message="No published portfolios match these filters yet."
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
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {interns.map((intern, index) => (
                <InternCard key={intern.username} intern={intern} index={index} />
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

export default DiscoverInterns;
