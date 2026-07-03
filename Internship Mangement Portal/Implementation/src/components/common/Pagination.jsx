import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  current = 1,
  total = 0,
  perPage = 10,
  onPageChange,
}) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = total === 0 ? 0 : (current - 1) * perPage + 1;
  const end = Math.min(current * perPage, total);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <p className="text-sm text-gray-500">
        Showing {start}-{end} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange?.(current - 1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40"
          disabled={current <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <span className="text-sm text-gray-500 px-2">
          {current} / {pages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange?.(current + 1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40"
          disabled={current >= pages}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
