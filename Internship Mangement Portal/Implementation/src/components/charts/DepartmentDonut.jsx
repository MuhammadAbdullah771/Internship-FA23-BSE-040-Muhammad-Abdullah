import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

export default function DepartmentDonut({ data, centerLabel, emptyMessage }) {
  if (!data?.length) {
    return <ChartEmpty message={emptyMessage || 'No breakdown data yet'} />;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

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
              <Cell key={`cell-${index}`} fill={entry.color || '#10B981'} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-sm font-semibold text-gray-700">{centerLabel || `${total} Total`}</span>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color || '#10B981' }} />
            <span className="text-gray-600">{item.name}</span>
            <span className="text-gray-400 ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
