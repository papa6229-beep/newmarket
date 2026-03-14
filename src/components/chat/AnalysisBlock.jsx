import KPICard from '../KPICard.jsx';
import MonthlySalesChart from '../charts/MonthlySalesChart.jsx';
import EventContributionChart from '../charts/EventContributionChart.jsx';
import {
  formatAmount,
  formatPercent,
  formatNumber,
  calcYoYData,
} from '../../utils/calculations.js';

function buildInsights(kpis, yoyGrowth, eventSummary, adSummary) {
  const insights = [];
  const growthValues = Object.values(yoyGrowth || {});
  const latestGrowth = growthValues[growthValues.length - 1];

  if (latestGrowth > 10)
    insights.push({ text: `YoY ${latestGrowth.toFixed(1)}% 성장`, color: 'green' });
  else if (latestGrowth < 0)
    insights.push({ text: `YoY ${latestGrowth.toFixed(1)}% 역성장`, color: 'red' });

  if (kpis?.convRate != null) {
    if (kpis.convRate > 3)
      insights.push({ text: `전환율 ${kpis.convRate.toFixed(2)}% (양호)`, color: 'green' });
    else if (kpis.convRate < 1)
      insights.push({ text: `전환율 ${kpis.convRate.toFixed(2)}% (개선 필요)`, color: 'red' });
  }

  if (kpis?.refundRate > 5)
    insights.push({ text: `환불률 ${kpis.refundRate.toFixed(2)}% 높음`, color: 'red' });
  else if (kpis?.refundRate != null && kpis.refundRate < 3)
    insights.push({ text: `환불률 ${kpis.refundRate.toFixed(2)}% (양호)`, color: 'green' });

  if (adSummary?.length > 0) {
    const highRoas = adSummary.filter(a => a.roas >= 3);
    const lowRoas = adSummary.filter(a => a.roas != null && a.roas < 1);
    if (highRoas.length > 0)
      insights.push({ text: `${highRoas[0].adName} ROAS ${highRoas[0].roas?.toFixed(1)} 우수`, color: 'green' });
    if (lowRoas.length > 0)
      insights.push({ text: `${lowRoas[0].adName} ROAS 낮음 (점검 필요)`, color: 'red' });
  }

  if (eventSummary?.length > 0) {
    const totalCustomers = eventSummary.reduce((s, e) => s + (e.couponCustomers ?? 0), 0);
    const totalExisting = eventSummary.reduce((s, e) => s + (e.couponExistingMembers ?? 0), 0);
    if (totalCustomers > 0) {
      const existingRatio = (totalExisting / totalCustomers) * 100;
      if (existingRatio > 70)
        insights.push({ text: `쿠폰 기존회원 비중 ${existingRatio.toFixed(0)}% (신규 유입 제한적)`, color: 'red' });
      else if (existingRatio < 50)
        insights.push({ text: `쿠폰 신규 유입 효과 우수 (기존회원 ${existingRatio.toFixed(0)}%)`, color: 'green' });
    }
  }

  return insights;
}

export default function AnalysisBlock({ analysisData }) {
  if (!analysisData) return null;
  const { kpis, monthlySales, eventSummary, adSummary, yoyGrowth } = analysisData;

  const { byYear, years } =
    monthlySales?.length ? calcYoYData(monthlySales) : { byYear: {}, years: [] };

  const insights = buildInsights(kpis, yoyGrowth, eventSummary, adSummary);

  const hasData = kpis || monthlySales?.length > 0;
  if (!hasData) return null;

  return (
    <div className="mt-3 space-y-3 w-full">
      {/* KPI Cards */}
      {kpis && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <KPICard
            title="총 매출"
            value={formatAmount(kpis.totalSales)}
            icon="💰"
            color="blue"
            tooltip={kpis.totalSales?.toLocaleString() + '원'}
          />
          <KPICard
            title="총 주문수"
            value={kpis.totalOrders != null ? formatNumber(kpis.totalOrders) + '건' : '-'}
            icon="📦"
            color="green"
          />
          <KPICard
            title="객단가(ATV)"
            value={formatAmount(kpis.atv)}
            icon="🛒"
            color="purple"
            tooltip={kpis.atv != null ? Math.round(kpis.atv).toLocaleString() + '원' : undefined}
          />
          <KPICard
            title="전환율"
            value={formatPercent(kpis.convRate)}
            icon="📈"
            color="teal"
          />
        </div>
      )}

      {/* Monthly Sales Chart */}
      {monthlySales?.length > 0 && years.length > 0 && (
        <MonthlySalesChart monthlySales={monthlySales} byYear={byYear} years={years} />
      )}

      {/* Event Contribution Chart */}
      {eventSummary?.length > 0 && (
        <EventContributionChart eventSummary={eventSummary} />
      )}

      {/* Insight Badges */}
      {insights.length > 0 && (
        <div className="bg-gray-50 rounded-xl border p-3">
          <p className="text-xs font-semibold text-gray-500 mb-2">💡 주요 인사이트</p>
          <div className="flex flex-wrap gap-2">
            {insights.map((ins, i) => (
              <span
                key={i}
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  ins.color === 'green'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {ins.text}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
