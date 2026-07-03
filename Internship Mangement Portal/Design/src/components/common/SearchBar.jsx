import { Search } from 'lucide-react';
import { cn } from '../../utils';

export default function SearchBar({ placeholder = 'Search...', className, value, onChange, dark }) {
  return (
    <div className={cn('relative', className)}>
      <Search className={cn('absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4', dark ? 'text-slate-500' : 'text-gray-400')} />
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(
          'w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-colors focus:outline-none focus:ring-2',
          dark
            ? 'bg-slate-800 border border-slate-700 text-slate-200 placeholder:text-slate-500 focus:ring-emerald-500/20 focus:border-emerald-600/50'
            : 'bg-white border border-gray-100 text-gray-900 placeholder:text-gray-400 focus:ring-emerald-500/20 focus:border-emerald-400 shadow-sm'
        )}
        aria-label={placeholder}
      />
    </div>
  );
}
