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

export default function EventContributionChart({ eventSummary }) {
  if (!eventSummary || eventSummary.length === 0) return null;

  const sorted = [...eventSummary].sort((a, b) => (b.couponSales ?? 0) - (a.couponSales ?? 0));

  const data = {
    labels: sorted.map(ev => ev.eventName),
    datasets: [
      {
        label: '쿠폰 신규회원 매출',
        data: sorted.map(ev => ev.couponNewMemberSales),
        backgroundColor: '#3b82f6cc',
        borderColor: '#3b82f6',
        borderWidth: 1,
        borderRadius: 4,
        stack: 'stack',
      },
      {
        label: '쿠폰 기존회원 매출',
        data: sorted.map(ev => ev.couponExistingMemberSales),
        backgroundColor: '#10b981cc',
        borderColor: '#10b981',
        borderWidth: 1,
        borderRadius: 4,
        stack: 'stack',
      },
    ],
  };

  const options = {
    indexAxis: 'y',
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
      x: {
        stacked: true,
        ticks: { callback: v => formatAmount(v) },
      },
      y: { stacked: true },
    },
  };

  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-4">이벤트별 쿠폰 기여 매출</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
