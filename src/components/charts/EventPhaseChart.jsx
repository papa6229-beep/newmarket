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

export default function EventPhaseChart({ phases, eventName }) {
  if (!phases) return null;
  const { pre, during, post } = phases;
  if (pre.avg === null && during.avg === null && post.avg === null) return null;

  const data = {
    labels: [
      `이벤트 전 (${pre.days}일)`,
      `이벤트 기간 (${during.days}일)`,
      `이벤트 후 (${post.days}일)`,
    ],
    datasets: [
      {
        label: '일평균 매출',
        data: [pre.avg, during.avg, post.avg],
        backgroundColor: ['#93c5fdcc', '#3b82f6cc', '#1d4ed8cc'],
        borderColor: ['#93c5fd', '#3b82f6', '#1d4ed8'],
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
        단계별 일평균 매출 비교{eventName ? ` — ${eventName}` : ''}
      </h3>
      <Bar data={data} options={options} />
    </div>
  );
}
