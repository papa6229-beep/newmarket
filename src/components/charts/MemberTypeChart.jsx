import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { formatAmount, formatExact } from '../../utils/calculations.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function MemberTypeChart({ monthlySales }) {
  const filtered = (monthlySales || []).filter(
    m => m.newMemberSales !== null || m.existingMemberSales !== null
  );
  if (filtered.length === 0) return null;

  const data = {
    labels: filtered.map(m => m.ym),
    datasets: [
      {
        label: '신규회원 매출',
        data: filtered.map(m => m.newMemberSales),
        backgroundColor: '#3b82f6cc',
        borderColor: '#3b82f6',
        borderWidth: 1,
        borderRadius: 4,
        stack: 'stack',
      },
      {
        label: '기존회원 매출',
        data: filtered.map(m => m.existingMemberSales),
        backgroundColor: '#10b981cc',
        borderColor: '#10b981',
        borderWidth: 1,
        borderRadius: 4,
        stack: 'stack',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${formatExact(ctx.raw)}`,
        },
      },
    },
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        ticks: { callback: v => formatAmount(v) },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-4">신규 vs 기존회원 매출 (월별 스택)</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
