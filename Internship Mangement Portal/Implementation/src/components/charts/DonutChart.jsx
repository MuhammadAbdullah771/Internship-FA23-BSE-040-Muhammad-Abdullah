import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const GRADIENT_ID = 'donutGradient';

export default function DonutChart({ value = 75, size = 200, label }) {
  const data = [
    { name: 'completed', value },
    { name: 'remaining', value: 100 - value },
  ];

  return (
    <div className="relative flex items-center justify-center" style={{ height: size }}>
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id={GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="72%"
            outerRadius="88%"
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
            cornerRadius={6}
          >
            <Cell fill={`url(#${GRADIENT_ID})`} />
            <Cell fill="#f1f5f9" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold tracking-tight text-slate-900">{value}%</span>
        {label && (
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.15em] mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
