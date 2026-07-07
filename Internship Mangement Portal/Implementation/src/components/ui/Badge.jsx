import { cn } from '../../utils';

export default function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-slate-100/90 text-slate-600 ring-1 ring-slate-200/60',
    primary: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60',
    success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70',
    warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/70',
    danger: 'bg-red-50 text-red-600 ring-1 ring-red-200/70',
    info: 'bg-blue-50 text-blue-600 ring-1 ring-blue-200/70',
    purple: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200/70',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-sm',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
