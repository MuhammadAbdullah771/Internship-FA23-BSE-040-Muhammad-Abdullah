import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils';

export default function Filter({ label, options = [], value, onChange, className, dark }) {
  return (
    <div className={cn('relative', className)}>
      <select
        value={value}
        onChange={onChange}
        className={cn(
          'appearance-none w-full pl-3 pr-8 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 cursor-pointer',
          dark
            ? 'bg-slate-900/80 border-slate-700 text-slate-200 focus:ring-emerald-500/20 focus:border-emerald-600/50'
            : 'bg-white border-gray-200 text-gray-700 focus:ring-primary-500/20 focus:border-primary-500',
        )}
        aria-label={label}
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}
