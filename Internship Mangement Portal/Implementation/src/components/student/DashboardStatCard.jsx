import { cn } from '../../utils';

const palettes = {
  emerald: {
    icon: 'bg-gradient-to-br from-emerald-500/15 to-teal-500/10 text-emerald-600 ring-emerald-500/15',
    accent: 'text-emerald-600',
  },
  blue: {
    icon: 'bg-gradient-to-br from-blue-500/15 to-indigo-500/10 text-blue-600 ring-blue-500/15',
    accent: 'text-blue-600',
  },
  amber: {
    icon: 'bg-gradient-to-br from-amber-500/15 to-orange-500/10 text-amber-600 ring-amber-500/15',
    accent: 'text-amber-600',
  },
  purple: {
    icon: 'bg-gradient-to-br from-violet-500/15 to-purple-500/10 text-violet-600 ring-violet-500/15',
    accent: 'text-violet-600',
  },
};

export default function DashboardStatCard({
  label,
  value,
  change,
  icon: Icon,
  color = 'emerald',
}) {
  const palette = palettes[color] || palettes.emerald;

  return (
    <div className="stat-card-premium glass-card rounded-2xl p-5 group">
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1.5">{label}</p>
          <p className="text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
          {change && (
            <p className={cn('text-xs font-semibold mt-2', palette.accent)}>{change}</p>
          )}
        </div>
        {Icon && (
          <div className={cn(
            'w-11 h-11 rounded-2xl flex items-center justify-center ring-1 transition-transform duration-300 group-hover:scale-110',
            palette.icon
          )}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
