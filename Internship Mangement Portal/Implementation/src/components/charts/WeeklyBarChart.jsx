import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid } from 'recharts';

const defaultData = [
  { name: 'W1', value: 20 },
  { name: 'W2', value: 35 },
  { name: 'W3', value: 50 },
  { name: 'W4', value: 60 },
  { name: 'W5', value: 70 },
  { name: 'W6', value: 80 },
  { name: 'W7', value: 95 },
];

const barColors = ['#D1FAE5', '#A7F3D0', '#6EE7B7', '#34D399', '#10B981', '#059669', '#047857'];

export default function WeeklyBarChart({ data = defaultData, height = 200 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={barColors[index]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
