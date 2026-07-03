import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#10B981', '#E5E7EB'];

export default function DonutChart({ value = 75, size = 200, label }) {
  const data = [
    { name: 'completed', value },
    { name: 'remaining', value: 100 - value },
  ];

  return (
    <div className="relative flex items-center justify-center" style={{ height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="90%"
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={COLORS[0]} />
            <Cell fill={COLORS[1]} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900">{value}%</span>
        {label && <span className="text-xs font-semibold text-emerald-600 uppercase mt-0.5">{label}</span>}
      </div>
    </div>
  );
}
