import { cn } from '../../utils';

export default function Input({
  label,
  icon: Icon,
  error,
  helper,
  className,
  containerClassName,
  ...props
}) {
  return (
    <div className={cn('space-y-1.5', containerClassName)}>
      {label && (
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        )}
        <input
          className={cn(
            'w-full rounded-xl border border-slate-200/80 bg-white/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 shadow-sm shadow-slate-100/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400/80 focus:shadow-md focus:shadow-emerald-500/5',
            Icon && 'pl-10',
            error && 'border-red-300 focus:ring-red-500/20 focus:border-red-400',
            props.disabled && 'bg-slate-50/80 cursor-not-allowed text-slate-500',
            className
          )}
          {...props}
        />
      </div>
      {helper && <p className="text-xs text-slate-400">{helper}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
