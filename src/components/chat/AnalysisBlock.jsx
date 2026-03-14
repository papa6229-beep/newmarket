import { formatAmount, formatPercent, formatNumber } from '../../utils/calculations.js';

// ── Mini bar chart (pure CSS/divs, no Chart.js) ─────────────────────────────
function MiniBarChart({ data, labelKey, valueKey, color = '#C96442' }) {
  if (!data || data.length === 0) return null;
  const vals = data.map(d => d[valueKey] ?? 0);
  const max = Math.max(...vals, 1);
  const last12 = data.slice(-12);
  return (
    <div className="mt-3">
      <div className="flex items-end gap-0.5 h-24">
        {last12.map((d, i) => {
          const h = Math.round(((d[valueKey] ?? 0) / max) * 100);
          return (
            <div key={i} className="flex-1 flex flex-col justify-end group relative">
              <div
                className="w-full rounded-t-sm transition-all opacity-70 group-hover:opacity-100"
                style={{ height: `${h}%`, background: color }}
              />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-warm-900 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap z-10">
                {formatAmount(d[valueKey])}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-1">
        {last12.map((d, i) => (
          <span key={i} className="flex-1 text-center text-[8px] text-warm-400 truncate">
            {(d[labelKey] ?? '').replace(/^\d{4}-/, '')}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── KPI block ────────────────────────────────────────────────────────────────
function KpiBlock({ kpis, dateRange }) {
  const items = [
    { label: '총 매출', value: formatAmount(kpis.totalSales), sub: kpis.totalSales != null ? kpis.totalSales.toLocaleString() + '원' : '-' },
    { label: '총 주문수', value: formatNumber(kpis.totalOrders) + '건', sub: '전체 기간 합산' },
    { label: '평균 객단가', value: kpis.atv != null ? formatAmount(Math.round(kpis.atv)) : '-', sub: '주문당 평균 금액' },
    { label: '전환율', value: formatPercent(kpis.convRate), sub: kpis.refundRate != null ? `환불률 ${formatPercent(kpis.refundRate)}` : '방문자 대비 주문' },
  ];
  return (
    <div className="mt-3 rounded-xl border border-warm-200 overflow-hidden">
      {dateRange && (
        <div className="bg-warm-50 px-4 py-2 text-xs text-warm-500 border-b border-warm-200 flex items-center gap-1.5">
          <span>📅</span> {dateRange}
        </div>
      )}
      <div className="grid grid-cols-2 divide-x divide-y divide-warm-100">
        {items.map((item, i) => (
          <div key={i} className="px-4 py-3 bg-white hover:bg-warm-50 transition-colors">
            <div className="text-xs text-warm-400 mb-0.5">{item.label}</div>
            <div className="text-lg font-bold text-warm-900">{item.value}</div>
            <div className="text-[10px] text-warm-400 mt-0.5">{item.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Monthly chart block ──────────────────────────────────────────────────────
function MonthlyChartBlock({ monthlySales }) {
  if (!monthlySales || monthlySales.length === 0) return null;
  return (
    <div className="mt-3 rounded-xl border border-warm-200 bg-white p-4">
      <div className="text-xs font-semibold text-warm-600 mb-1">월별 매출 추이</div>
      <MiniBarChart data={monthlySales} labelKey="ym" valueKey="totalSales" color="#C96442" />
    </div>
  );
}

// ── Event table block ────────────────────────────────────────────────────────
function EventTableBlock({ eventSummary }) {
  if (!eventSummary || eventSummary.length === 0) return null;
  return (
    <div className="mt-3 rounded-xl border border-warm-200 overflow-hidden">
      <div className="bg-warm-50 px-4 py-2.5 text-xs font-semibold text-warm-600 border-b border-warm-200">
        이벤트 성과 비교
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-warm-100 bg-white">
              <th className="text-left px-4 py-2.5 font-medium text-warm-500">이벤트명</th>
              <th className="text-right px-3 py-2.5 font-medium text-warm-500">쿠폰 매출</th>
              <th className="text-right px-3 py-2.5 font-medium text-warm-500">주문수</th>
              <th className="text-right px-3 py-2.5 font-medium text-warm-500">기존회원%</th>
            </tr>
          </thead>
          <tbody>
            {eventSummary.map((ev, i) => {
              const existRatio = ev.couponCustomers > 0 && ev.couponExistingMembers != null
                ? (ev.couponExistingMembers / ev.couponCustomers * 100).toFixed(0) + '%'
                : '-';
              return (
                <tr key={i} className={`border-b border-warm-50 hover:bg-warm-50 ${i % 2 === 0 ? 'bg-white' : 'bg-warm-50/30'}`}>
                  <td className="px-4 py-2.5 font-medium text-warm-800 max-w-[140px] truncate">{ev.eventName}</td>
                  <td className="px-3 py-2.5 text-right text-warm-700">{formatAmount(ev.couponSales)}</td>
                  <td className="px-3 py-2.5 text-right text-warm-600">{formatNumber(ev.couponOrders)}건</td>
                  <td className="px-3 py-2.5 text-right">
                    <span className="inline-block bg-accent-50 text-accent-600 px-2 py-0.5 rounded-full">{existRatio}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Ad table block ───────────────────────────────────────────────────────────
function AdTableBlock({ adSummary }) {
  if (!adSummary || adSummary.length === 0) return null;
  return (
    <div className="mt-3 rounded-xl border border-warm-200 overflow-hidden">
      <div className="bg-warm-50 px-4 py-2.5 text-xs font-semibold text-warm-600 border-b border-warm-200">
        광고 성과 현황
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-warm-100 bg-white">
              <th className="text-left px-4 py-2.5 font-medium text-warm-500">광고명</th>
              <th className="text-right px-3 py-2.5 font-medium text-warm-500">광고비</th>
              <th className="text-right px-3 py-2.5 font-medium text-warm-500">ROAS</th>
              <th className="text-right px-3 py-2.5 font-medium text-warm-500">전환수</th>
            </tr>
          </thead>
          <tbody>
            {adSummary.map((ad, i) => (
              <tr key={i} className={`border-b border-warm-50 hover:bg-warm-50 ${i % 2 === 0 ? 'bg-white' : 'bg-warm-50/30'}`}>
                <td className="px-4 py-2.5 font-medium text-warm-800 max-w-[130px] truncate">{ad.adName}</td>
                <td className="px-3 py-2.5 text-right text-warm-700">{formatAmount(ad.adCost)}</td>
                <td className="px-3 py-2.5 text-right">
                  <span className={`font-semibold ${ad.roas >= 3 ? 'text-green-600' : ad.roas >= 1 ? 'text-accent-500' : 'text-red-500'}`}>
                    {ad.roas != null ? ad.roas.toFixed(2) : '-'}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right text-warm-600">{formatNumber(ad.conversions)}건</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Insight list block ───────────────────────────────────────────────────────
function InsightBlock({ insights }) {
  if (!insights || insights.length === 0) return null;
  return (
    <div className="mt-3 space-y-2">
      {insights.map((item, i) => (
        <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-accent-50/60 border border-accent-100">
          <span className="text-base shrink-0 mt-0.5">{item.icon}</span>
          <p className="text-xs text-warm-700 leading-relaxed">{item.text}</p>
        </div>
      ))}
    </div>
  );
}

// ── Suggestion chips block ───────────────────────────────────────────────────
function ChipsBlock({ chips, onChipClick }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {chips.map((chip, i) => (
        <button key={i} className="chip" onClick={() => onChipClick(chip.label)}>
          {chip.label}
        </button>
      ))}
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────
export default function AnalysisBlock({ blocks, onChipClick }) {
  if (!blocks || blocks.length === 0) return null;
  return (
    <div className="space-y-1">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'kpi':
            return <KpiBlock key={i} kpis={block.kpis} dateRange={block.dateRange} />;
          case 'monthly_chart':
            return <MonthlyChartBlock key={i} monthlySales={block.data} />;
          case 'event_table':
            return <EventTableBlock key={i} eventSummary={block.data} />;
          case 'ad_table':
            return <AdTableBlock key={i} adSummary={block.data} />;
          case 'insight':
            return <InsightBlock key={i} insights={block.items} />;
          case 'chips':
            return <ChipsBlock key={i} chips={block.chips} onChipClick={onChipClick} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
