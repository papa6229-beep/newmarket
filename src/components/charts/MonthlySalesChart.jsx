import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { formatAmount, formatExact, CHART_COLORS } from '../../utils/calculations.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function MonthlySalesChart({ monthlySales, byYear, years }) {
  if (!monthlySales || monthlySales.length === 0) return null;

  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const monthLabels = months.map(m => `${m}월`);

  const datasets = years.map((year, i) => ({
    label: `${year}년`,
    data: months.map(m => byYear[year]?.[m] ?? null),
    backgroundColor: CHART_COLORS[i % CHART_COLORS.length] + 'cc',
    borderColor: CHART_COLORS[i % CHART_COLORS.length],
    borderWidth: 1,
    borderRadius: 4,
  }));

  const data = { labels: monthLabels, datasets };

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
      y: {
        ticks: {
          callback: v => formatAmount(v),
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-4">월별 매출 추이 (연도별 비교)</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
