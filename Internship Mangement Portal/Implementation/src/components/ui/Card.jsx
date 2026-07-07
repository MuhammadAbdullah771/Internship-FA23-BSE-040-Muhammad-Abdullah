import { cn } from '../../utils';

export default function Card({
  children,
  className,
  padding = true,
  hover = false,
  glass = false,
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border transition-all duration-300',
        glass
          ? 'glass-card'
          : 'bg-white border-slate-200/60 shadow-premium',
        hover && 'hover:shadow-premium-lg hover:-translate-y-0.5 hover:border-emerald-200/50 cursor-default',
        padding && 'p-6',
        className
      )}
    >
      {children}
    </div>
  );
}
