export default function KPICard({ title, value, sub, icon, color = 'blue', tooltip }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    teal: 'bg-teal-50 text-teal-600 border-teal-100',
  };
  const cls = colorMap[color] || colorMap.blue;

  return (
    <div className={`rounded-xl border p-5 bg-white shadow-sm flex flex-col gap-2 ${cls.split(' ').pop()}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        {icon && (
          <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-xl ${cls}`}>
            {icon}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-800 truncate" title={tooltip}>
        {value ?? '-'}
      </div>
      {sub && <div className="text-xs text-gray-400">{sub}</div>}
    </div>
  );
}
