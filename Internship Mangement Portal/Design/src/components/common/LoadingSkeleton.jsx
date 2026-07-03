import { cn } from '../../utils';

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse bg-gray-200 rounded-lg', className)} />;
}

export default function LoadingSkeleton({ rows = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}
