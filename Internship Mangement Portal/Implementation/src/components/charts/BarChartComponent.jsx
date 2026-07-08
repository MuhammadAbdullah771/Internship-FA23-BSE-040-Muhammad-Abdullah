import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

function ChartEmpty({ message = 'No data yet', height = 220 }) {
  return (
    <div
      className="flex items-center justify-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl"
      style={{ height }}
    >
      {message}
    </div>
  );
}

export default function BarChartComponent({ data, height = 220, colors, emptyMessage, dark }) {
  if (!data?.length) {
    return <ChartEmpty message={emptyMessage || 'No data yet'} height={height} />;
  }

  const barColors = colors || ['#A7F3D0', '#6EE7B7', '#34D399', '#10B981', '#059669', '#047857', '#065F46', '#064E3B'];
  const gridColor = dark ? '#334155' : '#F3F4F6';
  const tickColor = dark ? '#94A3B8' : '#9CA3AF';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={50} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} />
        <Tooltip />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
