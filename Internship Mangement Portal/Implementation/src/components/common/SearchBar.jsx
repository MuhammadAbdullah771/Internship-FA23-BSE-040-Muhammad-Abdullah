import { Search } from 'lucide-react';
import { cn } from '../../utils';

export default function SearchBar({ placeholder = 'Search...', className, value, onChange, dark }) {
  return (
    <div className={cn('relative group', className)}>
      <Search className={cn(
        'absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors',
        dark ? 'text-slate-500 group-focus-within:text-emerald-400' : 'text-slate-400 group-focus-within:text-emerald-500'
      )} />
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(
          'w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 focus:outline-none',
          dark
            ? 'bg-slate-800/80 border border-slate-700 text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600/50'
            : 'bg-white/70 border border-slate-200/60 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/15 focus:border-emerald-400/60 focus:bg-white/90 focus:shadow-md focus:shadow-emerald-500/5 backdrop-blur-sm'
        )}
        aria-label={placeholder}
      />
    </div>
  );
}
