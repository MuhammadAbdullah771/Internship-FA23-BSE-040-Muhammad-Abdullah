import { cn } from '../../utils';

export default function DashboardCard({ label, value, change, subtext, icon: Icon, iconColor, children, className, dark }) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-6 transition-shadow hover:shadow-premium',
        dark
          ? 'bg-slate-800 border-slate-700 text-white'
          : 'bg-white border-gray-100/80 shadow-premium',
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className={cn('text-sm mb-1', dark ? 'text-slate-400' : 'text-gray-500')}>{label}</p>
          <p className={cn('text-3xl font-bold tracking-tight', dark ? 'text-white' : 'text-gray-900')}>{value}</p>
          {change && (
            <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              {change}
            </span>
          )}
          {subtext && (
            <p className={cn('text-sm mt-1', dark ? 'text-slate-400' : 'text-gray-500')}>{subtext}</p>
          )}
        </div>
        {Icon && (
          <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', iconColor)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
