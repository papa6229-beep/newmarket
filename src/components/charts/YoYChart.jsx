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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function YoYChart({ yoyGrowth }) {
  if (!yoyGrowth || Object.keys(yoyGrowth).length === 0) return null;

  const labels = Object.keys(yoyGrowth);
  const values = Object.values(yoyGrowth);

  const data = {
    labels,
    datasets: [
      {
        label: 'YoY 성장률 (%)',
        data: values,
        backgroundColor: values.map(v => v >= 0 ? '#10b98144' : '#ef444444'),
        borderColor: values.map(v => v >= 0 ? '#10b981' : '#ef4444'),
        borderWidth: 2,
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
          label: ctx => `${ctx.raw?.toFixed(1)}%`,
        },
      },
    },
    scales: {
      y: {
        ticks: { callback: v => `${v}%` },
        grid: { color: '#f0f0f0' },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-4">YoY 성장률</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
