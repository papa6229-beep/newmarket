import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { formatAmount, formatExact } from '../../utils/calculations.js';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend
);

export default function EventDailyChart({ salesData, couponData, eventName }) {
  if (!salesData || !couponData || couponData.length === 0) return null;

  const eventRows = couponData.filter(r => !eventName || r.eventName === eventName);
  if (eventRows.length === 0) return null;

  const dateSet = new Set(eventRows.map(r => new Date(r.date).toISOString().split('T')[0]));
  const dates = Array.from(dateSet).sort();

  const salesMap = {};
  salesData.forEach(r => {
    if (!r.date) return;
    const d = new Date(r.date).toISOString().split('T')[0];
    salesMap[d] = (salesMap[d] ?? 0) + (r.totalSales ?? 0);
  });

  const couponMap = {};
  eventRows.forEach(r => {
    if (!r.date) return;
    const d = new Date(r.date).toISOString().split('T')[0];
    couponMap[d] = (couponMap[d] ?? 0) + (r.couponSales ?? 0);
  });

  const data = {
    labels: dates,
    datasets: [
      {
        type: 'bar',
        label: '전체 매출',
        data: dates.map(d => salesMap[d] ?? null),
        backgroundColor: '#3b82f644',
        borderColor: '#3b82f6',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        type: 'line',
        label: '쿠폰 매출',
        data: dates.map(d => couponMap[d] ?? null),
        borderColor: '#ef4444',
        backgroundColor: '#ef444422',
        borderWidth: 2,
        pointRadius: 3,
        tension: 0.3,
        yAxisID: 'y',
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
      y: { ticks: { callback: v => formatAmount(v) } },
    },
  };

  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-4">
        이벤트 기간 일별 매출 vs 쿠폰 매출{eventName ? ` — ${eventName}` : ''}
      </h3>
      <Bar data={data} options={options} />
    </div>
  );
}
