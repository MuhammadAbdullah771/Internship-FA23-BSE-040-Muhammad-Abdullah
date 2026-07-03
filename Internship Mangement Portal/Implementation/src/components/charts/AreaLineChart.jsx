import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const defaultData = [
  { name: 'Week 1', value: 65 },
  { name: 'Week 2', value: 72 },
  { name: 'Week 3', value: 68 },
  { name: 'Week 4', value: 78 },
  { name: 'Week 5', value: 82 },
  { name: 'Week 6', value: 85 },
  { name: 'Week 7', value: 88 },
  { name: 'Week 8', value: 92 },
];

export default function AreaLineChart({ data = defaultData, height = 280 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} fill="url(#colorValue)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
