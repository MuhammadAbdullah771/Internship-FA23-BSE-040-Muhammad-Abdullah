import { cn } from '../../utils';

export default function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-gray-100 text-gray-600',
    primary: 'bg-primary-50 text-primary-700',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-orange-50 text-orange-700',
    danger: 'bg-red-50 text-red-600',
    info: 'bg-blue-50 text-blue-600',
    purple: 'bg-primary-100 text-primary-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
