import { cn } from '../../utils';

export default function DashboardStatCard({ label, value, change, icon: Icon, color = 'bg-emerald-50 text-emerald-600' }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100/80 shadow-premium p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && <p className="text-xs text-emerald-600 font-medium mt-1">{change}</p>}
        </div>
        {Icon && (
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', color)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
