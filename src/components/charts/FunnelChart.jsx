import { formatNumber } from '../../utils/calculations.js';

export default function FunnelChart({ funnelData }) {
  if (!funnelData || funnelData.length === 0) return null;

  const maxVal = Math.max(...funnelData.map(d => d.value ?? 0));

  const colors = [
    'bg-blue-500',
    'bg-blue-400',
    'bg-blue-300',
    'bg-blue-200',
    'bg-blue-100',
  ];

  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-4">광고 퍼널 분석</h3>
      <div className="flex flex-col items-center gap-1">
        {funnelData.map((step, i) => {
          const pct = maxVal > 0 ? (step.value / maxVal) * 100 : 0;
          const prevVal = i > 0 ? funnelData[i - 1].value : null;
          const dropRate = prevVal && prevVal > 0 ? ((1 - step.value / prevVal) * 100).toFixed(1) : null;

          return (
            <div key={step.label} className="w-full flex flex-col items-center">
              {dropRate !== null && (
                <div className="text-xs text-red-400 mb-0.5">▼ {dropRate}% 이탈</div>
              )}
              <div
                className={`${colors[i % colors.length]} rounded-lg flex items-center justify-between px-4 py-2 text-white font-medium transition-all`}
                style={{ width: `${Math.max(pct, 20)}%`, minWidth: 120 }}
              >
                <span className="text-sm">{step.label}</span>
                <span className="text-sm font-bold">{formatNumber(step.value)}</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">
        * 발송형 광고: 발송→도달→오픈→유입→전환 / 노출형·검색형: 도달→유입→전환
      </p>
    </div>
  );
}
