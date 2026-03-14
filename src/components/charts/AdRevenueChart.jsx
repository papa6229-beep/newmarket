import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { formatAmount, formatExact } from '../../utils/calculations.js';

ChartJS.register(
  CategoryScale, LinearScale,
  BarController, BarElement,
  LineController, LineElement, PointElement,
  Tooltip, Legend
);

export default function AdRevenueChart({ dailyAdData }) {
  if (!dailyAdData || dailyAdData.length === 0) return null;

  const data = {
    labels: dailyAdData.map(d => d.date),
    datasets: [
      {
        type: 'bar',
        label: '광고 귀속 매출',
        data: dailyAdData.map(d => d.adAttributedSales),
        backgroundColor: '#3b82f644',
        borderColor: '#3b82f6',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        type: 'line',
        label: '광고비',
        data: dailyAdData.map(d => d.adCost),
        borderColor: '#ef4444',
        backgroundColor: 'transparent',
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
      <h3 className="font-semibold text-gray-700 mb-4">일별 광고 귀속 매출 vs 광고비</h3>
      <Chart type="bar" data={data} options={options} />
    </div>
  );
}
