import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils';

export default function Pagination({
  current = 1,
  total = 0,
  perPage = 10,
  onPageChange,
  dark,
}) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = total === 0 ? 0 : (current - 1) * perPage + 1;
  const end = Math.min(current * perPage, total);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <p className={cn('text-sm', dark ? 'text-slate-500' : 'text-gray-500')}>
        Showing {start}-{end} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange?.(current - 1)}
          className={cn(
            'p-2 rounded-lg transition-colors disabled:opacity-40',
            dark ? 'hover:bg-slate-800' : 'hover:bg-gray-100',
          )}
          disabled={current <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className={cn('w-4 h-4', dark ? 'text-slate-400' : 'text-gray-600')} />
        </button>
        <span className={cn('text-sm px-2', dark ? 'text-slate-500' : 'text-gray-500')}>
          {current} / {pages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange?.(current + 1)}
          className={cn(
            'p-2 rounded-lg transition-colors disabled:opacity-40',
            dark ? 'hover:bg-slate-800' : 'hover:bg-gray-100',
          )}
          disabled={current >= pages}
          aria-label="Next page"
        >
          <ChevronRight className={cn('w-4 h-4', dark ? 'text-slate-400' : 'text-gray-600')} />
        </button>
      </div>
    </div>
  );
}
