import { cn, getInitials } from '../../utils';

export default function Avatar({ src, name, size = 'md', className }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-lg',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={cn('rounded-full object-cover', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600',
        sizes[size],
        className
      )}
    >
      {getInitials(name || 'U')}
    </div>
  );
}
