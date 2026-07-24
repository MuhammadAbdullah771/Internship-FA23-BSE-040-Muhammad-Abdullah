const Pagination = ({ page, pages, total, onChange, disabled = false }) => {
  if (!pages || pages <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < pages;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/70 pt-6">
      <p className="text-sm text-muted">
        Page {page} of {pages}
        {typeof total === 'number' ? ` · ${total} results` : ''}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled || !canPrev}
          onClick={() => onChange(page - 1)}
          className="rounded-xl border border-line bg-white px-3.5 py-2 text-sm font-medium text-ink transition hover:bg-surface disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={disabled || !canNext}
          onClick={() => onChange(page + 1)}
          className="rounded-xl border border-line bg-white px-3.5 py-2 text-sm font-medium text-ink transition hover:bg-surface disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
