import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils';

export default function Filter({ label, options = [], value, onChange, className }) {
  return (
    <div className={cn('relative', className)}>
      <select
        value={value}
        onChange={onChange}
        className="appearance-none w-full pl-3 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer"
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
