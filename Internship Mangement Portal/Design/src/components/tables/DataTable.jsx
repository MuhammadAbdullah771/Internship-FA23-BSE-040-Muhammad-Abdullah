import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { cn } from '../../utils';

export default function DataTable({ columns, data, renderCell }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id || idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="py-4 px-4 text-sm">
                  {renderCell ? renderCell(col.key, row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function InternTableRow({ intern }) {
  const statusVariant = {
    Active: 'success',
    Onboarding: 'warning',
    Completed: 'default',
  };

  return (
    <>
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <Avatar src={intern.avatar} name={intern.name} size="sm" />
          <span className="font-medium text-gray-900">{intern.name}</span>
        </div>
      </td>
      <td className="py-4 px-4 text-gray-500">{intern.email}</td>
      <td className="py-4 px-4 text-gray-700">{intern.role}</td>
      <td className="py-4 px-4">
        <Badge variant={statusVariant[intern.status]}>{intern.status}</Badge>
      </td>
      <td className="py-4 px-4" />
    </>
  );
}
