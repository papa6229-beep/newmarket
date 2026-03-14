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

export default function WeekdayChart({ weekdayData }) {
  if (!weekdayData || weekdayData.every(d => d.avg === null)) return null;

  const maxVal = Math.max(...weekdayData.map(d => d.avg ?? 0));

  const data = {
    labels: weekdayData.map(d => d.label + '요일'),
    datasets: [
      {
        label: '일평균 매출',
        data: weekdayData.map(d => d.avg),
        backgroundColor: weekdayData.map(d =>
          d.avg === maxVal ? '#3b82f6cc' : '#93c5fdcc'
        ),
        borderColor: weekdayData.map(d =>
          d.avg === maxVal ? '#3b82f6' : '#93c5fd'
        ),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => `일평균: ${formatExact(ctx.raw)}`,
          afterLabel: ctx => `(${weekdayData[ctx.dataIndex].count}일 기준)`,
        },
      },
    },
    scales: {
      y: { ticks: { callback: v => formatAmount(v) } },
    },
  };

  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-4">요일별 평균 매출</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
