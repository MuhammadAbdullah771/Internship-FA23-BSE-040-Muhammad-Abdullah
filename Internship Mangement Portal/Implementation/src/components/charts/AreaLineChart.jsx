import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

function ChartEmpty({ message = 'No data yet', height = 280 }) {
  return (
    <div
      className="flex items-center justify-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl"
      style={{ height }}
    >
      {message}
    </div>
  );
}

export default function AreaLineChart({ data, height = 280, emptyMessage, dark }) {
  if (!data?.length) {
    return <ChartEmpty message={emptyMessage || 'No signup data yet'} height={height} />;
  }

  const gridColor = dark ? '#334155' : '#F3F4F6';
  const tickColor = dark ? '#94A3B8' : '#9CA3AF';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} fill="url(#colorValue)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
