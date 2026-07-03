import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const defaultData = [
  { name: 'Engineering', value: 45, color: '#3B82F6' },
  { name: 'Design', value: 30, color: '#8B5CF6' },
  { name: 'Marketing', value: 25, color: '#F97316' },
];

export default function DepartmentDonut({ data = defaultData, centerLabel = '15 Interns' }) {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-sm font-semibold text-gray-700">{centerLabel}</span>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
            <span className="text-gray-600">{item.name}</span>
            <span className="text-gray-400 ml-auto">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
