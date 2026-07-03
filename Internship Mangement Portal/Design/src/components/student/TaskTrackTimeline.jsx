import { Check, Lock, Circle, ChevronRight } from 'lucide-react';
import { cn } from '../../utils';

const statusStyles = {
  completed: {
    dot: 'bg-emerald-600',
    ring: 'ring-emerald-100',
    line: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700',
    label: 'Completed',
  },
  active: {
    dot: 'bg-emerald-600 ring-4 ring-emerald-100',
    ring: 'ring-emerald-200',
    line: 'bg-emerald-300',
    badge: 'bg-emerald-100 text-emerald-800',
    label: 'In Progress',
  },
  locked: {
    dot: 'bg-gray-200',
    ring: '',
    line: 'bg-gray-200',
    badge: 'bg-gray-100 text-gray-500',
    label: 'Locked',
  },
};

export default function TaskTrackTimeline({ tracks }) {
  return (
    <div className="relative">
      <div className="hidden lg:block absolute top-8 left-8 right-8 h-1 bg-gray-100 rounded-full" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-3">
        {tracks.map((track, i) => {
          const style = statusStyles[track.status];
          const isLast = i === tracks.length - 1;

          return (
            <div key={track.id} className="relative">
              <div className="flex lg:flex-col items-start lg:items-center gap-4 lg:gap-3">
                <div className="relative z-10 shrink-0">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      style.dot,
                      track.status === 'active' && 'animate-pulse'
                    )}
                  >
                    {track.status === 'completed' ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : track.status === 'locked' ? (
                      <Lock className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Circle className="w-3 h-3 text-white fill-white" />
                    )}
                  </div>
                </div>

                <div
                  className={cn(
                    'flex-1 lg:text-center p-4 rounded-2xl border transition-all',
                    track.status === 'active'
                      ? 'bg-emerald-50/80 border-emerald-200 shadow-md shadow-emerald-500/10'
                      : 'bg-white border-gray-100'
                  )}
                >
                  <div className="flex lg:flex-col lg:items-center justify-between gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">{track.phase}</h3>
                    <span className={cn('text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full', style.badge)}>
                      {style.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{track.description}</p>
                  <div className="flex lg:flex-col items-center justify-between gap-2">
                    <span className="text-[10px] text-gray-400 font-medium">{track.duration}</span>
                    <span className="text-xs text-gray-600">
                      {track.completedTasks}/{track.tasks} tasks
                    </span>
                  </div>
                  {track.status !== 'locked' && (
                    <div className="mt-3">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${track.progress}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 lg:text-center">{track.progress}%</p>
                    </div>
                  )}
                </div>
              </div>

              {!isLast && (
                <div className="lg:hidden flex justify-center py-1">
                  <ChevronRight className="w-4 h-4 text-gray-300 rotate-90" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
