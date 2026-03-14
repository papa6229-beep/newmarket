import KPICard from '../KPICard.jsx';
import MonthlySalesChart from '../charts/MonthlySalesChart.jsx';
import YoYChart from '../charts/YoYChart.jsx';
import WeekdayChart from '../charts/WeekdayChart.jsx';
import MemberTypeChart from '../charts/MemberTypeChart.jsx';
import {
  formatAmount,
  formatExact,
  formatNumber,
  formatPercent,
  calcKPIs,
  calcMonthlySales,
  calcYoYData,
  calcYoYGrowth,
  calcWeekdayAvg,
} from '../../utils/calculations.js';

export default function SalesTab({ salesData }) {
  if (!salesData || salesData.length === 0) {
    return <div className="p-8 text-center text-gray-400">기본매출 데이터가 없습니다.</div>;
  }

  const kpis = calcKPIs(salesData);
  const monthlySales = calcMonthlySales(salesData);
  const { byYear, years } = calcYoYData(monthlySales);
  const yoyGrowth = calcYoYGrowth(byYear, years);
  const weekdayData = calcWeekdayAvg(salesData);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          title="총 매출"
          value={formatAmount(kpis.totalSales)}
          icon="💰"
          color="blue"
          tooltip={formatExact(kpis.totalSales)}
        />
        <KPICard
          title="총 주문수"
          value={formatNumber(kpis.totalOrders) + '건'}
          icon="📦"
          color="green"
        />
        <KPICard
          title="객단가 (ATV)"
          value={formatAmount(kpis.atv)}
          icon="🧾"
          color="yellow"
          tooltip={formatExact(kpis.atv)}
        />
        <KPICard
          title="전환율"
          value={formatPercent(kpis.convRate, 2)}
          icon="🎯"
          color="purple"
          sub={`방문자 ${formatNumber(kpis.totalVisitors)}명`}
        />
      </div>

      {/* 추가 KPI */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <KPICard
          title="총 방문자"
          value={formatNumber(kpis.totalVisitors) + '명'}
          icon="👥"
          color="teal"
        />
        <KPICard
          title="환불금액"
          value={formatAmount(kpis.totalRefund)}
          icon="↩️"
          color="red"
          tooltip={formatExact(kpis.totalRefund)}
        />
        <KPICard
          title="환불률"
          value={formatPercent(kpis.refundRate, 2)}
          icon="📉"
          color="red"
          sub="환불금액 / 총매출"
        />
      </div>

      {/* Charts */}
      <MonthlySalesChart monthlySales={monthlySales} byYear={byYear} years={years} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <YoYChart yoyGrowth={yoyGrowth} />
        <WeekdayChart weekdayData={weekdayData} />
      </div>
      <MemberTypeChart monthlySales={monthlySales} />
    </div>
  );
}
