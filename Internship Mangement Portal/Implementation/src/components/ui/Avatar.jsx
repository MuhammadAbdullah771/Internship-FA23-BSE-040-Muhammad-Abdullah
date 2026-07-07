import { cn, getInitials } from '../../utils';

export default function Avatar({ src, name, size = 'md', className }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs rounded-xl',
    md: 'w-10 h-10 text-sm rounded-xl',
    lg: 'w-14 h-14 text-base rounded-2xl',
    xl: 'w-20 h-20 text-lg rounded-2xl',
  };

  const ringClass = size === 'lg' || size === 'xl'
    ? 'ring-4 ring-white shadow-lg shadow-emerald-500/10'
    : 'ring-2 ring-white shadow-sm';

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={cn('object-cover', sizes[size], ringClass, className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center font-bold text-emerald-700',
        sizes[size],
        ringClass,
        className
      )}
    >
      {getInitials(name || 'U')}
    </div>
  );
}
