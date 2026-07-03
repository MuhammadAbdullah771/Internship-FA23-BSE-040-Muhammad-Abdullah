import { cn } from '../../utils';

export default function Card({ children, className, padding = true }) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-gray-100/80 shadow-premium',
        padding && 'p-6',
        className
      )}
    >
      {children}
    </div>
  );
}
