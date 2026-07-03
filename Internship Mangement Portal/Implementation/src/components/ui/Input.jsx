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
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        )}
        <input
          className={cn(
            'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
            Icon && 'pl-10',
            error && 'border-red-300 focus:ring-red-500/20 focus:border-red-500',
            props.disabled && 'bg-primary-50/50 cursor-not-allowed',
            className
          )}
          {...props}
        />
      </div>
      {helper && <p className="text-xs text-gray-400">{helper}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
