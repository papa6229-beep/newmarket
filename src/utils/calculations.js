// 금액 포맷 (억/천만/만원 자동 변환)
export function formatAmount(value) {
  if (value === null || value === undefined) return '-';
  const abs = Math.abs(value);
  if (abs >= 100000000) return (value / 100000000).toFixed(1) + '억원';
  if (abs >= 10000000) return (value / 10000000).toFixed(1) + '천만원';
  if (abs >= 10000) return (value / 10000).toFixed(0) + '만원';
  return value.toLocaleString() + '원';
}

// 툴팁용 정확한 금액
export function formatExact(value) {
  if (value === null || value === undefined) return '-';
  return value.toLocaleString() + '원';
}

// 퍼센트 포맷
export function formatPercent(value, digits = 1) {
  if (value === null || value === undefined || isNaN(value)) return '-';
  return value.toFixed(digits) + '%';
}

// 숫자 포맷
export function formatNumber(value) {
  if (value === null || value === undefined) return '-';
  return value.toLocaleString();
}

// 날짜 → YYYY-MM
export function toYearMonth(date) {
  if (!date) return null;
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// 날짜 → YYYY
export function toYear(date) {
  if (!date) return null;
  return new Date(date).getFullYear().toString();
}

// null safe 덧셈
function safeAdd(a, b) {
  if (a === null && b === null) return null;
  return (a ?? 0) + (b ?? 0);
}

// KPI 계산
export function calcKPIs(salesData) {
  if (!salesData || salesData.length === 0) return {};

  const totalSales = salesData.reduce((s, r) => safeAdd(s, r.totalSales), null);
  const totalOrders = salesData.reduce((s, r) => safeAdd(s, r.orders), null);
  const totalVisitors = salesData.reduce((s, r) => safeAdd(s, r.visitors), null);
  const totalRefund = salesData.reduce((s, r) => safeAdd(s, r.refundAmount), null);

  const atv = totalOrders > 0 ? totalSales / totalOrders : null;
  const convRate = totalVisitors > 0 ? (totalOrders / totalVisitors) * 100 : null;
  const refundRate = totalSales > 0 ? (totalRefund / totalSales) * 100 : null;

  return { totalSales, totalOrders, totalVisitors, totalRefund, atv, convRate, refundRate };
}

// 월별 집계
export function calcMonthlySales(salesData) {
  const map = {};
  salesData.forEach(row => {
    const ym = toYearMonth(row.date);
    if (!ym) return;
    if (!map[ym]) map[ym] = { ym, totalSales: null, orders: null, newMemberSales: null, existingMemberSales: null };
    map[ym].totalSales = safeAdd(map[ym].totalSales, row.totalSales);
    map[ym].orders = safeAdd(map[ym].orders, row.orders);
    map[ym].newMemberSales = safeAdd(map[ym].newMemberSales, row.newMemberSales);
    map[ym].existingMemberSales = safeAdd(map[ym].existingMemberSales, row.existingMemberSales);
  });
  return Object.values(map).sort((a, b) => a.ym.localeCompare(b.ym));
}

// 연도별 월별 집계 (YoY 비교용)
export function calcYoYData(monthlySales) {
  const byYear = {};
  monthlySales.forEach(row => {
    const [year, month] = row.ym.split('-');
    if (!byYear[year]) byYear[year] = {};
    byYear[year][month] = row.totalSales;
  });
  const years = Object.keys(byYear).sort();
  return { byYear, years };
}

// YoY 성장률 계산
export function calcYoYGrowth(byYear, years) {
  const result = {};
  if (years.length < 2) return result;
  for (let i = 1; i < years.length; i++) {
    const prevYear = years[i - 1];
    const currYear = years[i];
    const prevTotal = Object.values(byYear[prevYear] || {}).reduce((s, v) => safeAdd(s, v), null);
    const currTotal = Object.values(byYear[currYear] || {}).reduce((s, v) => safeAdd(s, v), null);
    if (prevTotal && currTotal && prevTotal !== 0) {
      result[`${prevYear}→${currYear}`] = ((currTotal - prevTotal) / prevTotal) * 100;
    }
  }
  return result;
}

// 요일별 평균 매출 (0=일요일)
export function calcWeekdayAvg(salesData) {
  const map = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  const labels = ['일', '월', '화', '수', '목', '금', '토'];
  salesData.forEach(row => {
    if (!row.date || row.totalSales === null) return;
    const dow = new Date(row.date).getDay();
    map[dow].push(row.totalSales);
  });
  return labels.map((label, i) => ({
    label,
    avg: map[i].length > 0 ? map[i].reduce((s, v) => s + v, 0) / map[i].length : null,
    count: map[i].length,
  }));
}

// 이벤트별 집계
export function calcEventSummary(couponData) {
  const map = {};
  couponData.forEach(row => {
    const name = row.eventName;
    if (!map[name]) {
      map[name] = {
        eventName: name,
        dates: [],
        couponSales: null,
        couponOrders: null,
        couponCustomers: null,
        couponNewMembers: null,
        couponExistingMembers: null,
        couponNewMemberSales: null,
        couponExistingMemberSales: null,
      };
    }
    if (row.date) map[name].dates.push(new Date(row.date));
    map[name].couponSales = safeAdd(map[name].couponSales, row.couponSales);
    map[name].couponOrders = safeAdd(map[name].couponOrders, row.couponOrders);
    map[name].couponCustomers = safeAdd(map[name].couponCustomers, row.couponCustomers);
    map[name].couponNewMembers = safeAdd(map[name].couponNewMembers, row.couponNewMembers);
    map[name].couponExistingMembers = safeAdd(map[name].couponExistingMembers, row.couponExistingMembers);
    map[name].couponNewMemberSales = safeAdd(map[name].couponNewMemberSales, row.couponNewMemberSales);
    map[name].couponExistingMemberSales = safeAdd(map[name].couponExistingMemberSales, row.couponExistingMemberSales);
  });
  return Object.values(map).map(ev => ({
    ...ev,
    startDate: ev.dates.length > 0 ? new Date(Math.min(...ev.dates)) : null,
    endDate: ev.dates.length > 0 ? new Date(Math.max(...ev.dates)) : null,
    durationDays: ev.dates.length,
  }));
}

// 이벤트 기간 단계별 일평균 계산 (이벤트 전 7일 / 이벤트 기간 / 이벤트 후 7일)
export function calcEventPhases(salesData, couponEvent) {
  if (!couponEvent.startDate || !couponEvent.endDate) return null;
  const start = new Date(couponEvent.startDate);
  const end = new Date(couponEvent.endDate);
  end.setHours(23, 59, 59, 999);

  const preStart = new Date(start);
  preStart.setDate(preStart.getDate() - 7);
  const postEnd = new Date(end);
  postEnd.setDate(postEnd.getDate() + 7);

  const phases = { pre: [], during: [], post: [] };
  salesData.forEach(row => {
    if (!row.date || row.totalSales === null) return;
    const d = new Date(row.date);
    if (d >= preStart && d < start) phases.pre.push(row.totalSales);
    else if (d >= start && d <= end) phases.during.push(row.totalSales);
    else if (d > end && d <= postEnd) phases.post.push(row.totalSales);
  });

  const avg = arr => arr.length > 0 ? arr.reduce((s, v) => s + v, 0) / arr.length : null;
  return {
    pre: { avg: avg(phases.pre), days: phases.pre.length },
    during: { avg: avg(phases.during), days: phases.during.length },
    post: { avg: avg(phases.post), days: phases.post.length },
  };
}

// 광고별 집계
export function calcAdSummary(adData) {
  const map = {};
  adData.forEach(row => {
    const name = row.adName;
    if (!map[name]) {
      map[name] = {
        adName: name,
        adCost: null,
        adAttributedSales: null,
        conversions: null,
        newConversions: null,
        sends: null,
        reach: null,
        opens: null,
        inflows: null,
      };
    }
    map[name].adCost = safeAdd(map[name].adCost, row.adCost);
    map[name].adAttributedSales = safeAdd(map[name].adAttributedSales, row.adAttributedSales);
    map[name].conversions = safeAdd(map[name].conversions, row.conversions);
    map[name].newConversions = safeAdd(map[name].newConversions, row.newConversions);
    map[name].sends = safeAdd(map[name].sends, row.sends);
    map[name].reach = safeAdd(map[name].reach, row.reach);
    map[name].opens = safeAdd(map[name].opens, row.opens);
    map[name].inflows = safeAdd(map[name].inflows, row.inflows);
  });
  return Object.values(map).map(ad => ({
    ...ad,
    roas: ad.adCost > 0 ? ad.adAttributedSales / ad.adCost : null,
    existingConversions: (ad.conversions !== null && ad.newConversions !== null) ? ad.conversions - ad.newConversions : null,
  }));
}

// 일별 광고 집계
export function calcDailyAdData(adData) {
  const map = {};
  adData.forEach(row => {
    const ym = row.date ? new Date(row.date).toISOString().split('T')[0] : null;
    if (!ym) return;
    if (!map[ym]) map[ym] = { date: ym, adCost: null, adAttributedSales: null, conversions: null };
    map[ym].adCost = safeAdd(map[ym].adCost, row.adCost);
    map[ym].adAttributedSales = safeAdd(map[ym].adAttributedSales, row.adAttributedSales);
    map[ym].conversions = safeAdd(map[ym].conversions, row.conversions);
  });
  return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
}

// 퍼널 집계 (광고 유형별)
export function calcFunnelData(adSummary) {
  const totalSends = adSummary.reduce((s, a) => safeAdd(s, a.sends), null);
  const totalReach = adSummary.reduce((s, a) => safeAdd(s, a.reach), null);
  const totalOpens = adSummary.reduce((s, a) => safeAdd(s, a.opens), null);
  const totalInflows = adSummary.reduce((s, a) => safeAdd(s, a.inflows), null);
  const totalConversions = adSummary.reduce((s, a) => safeAdd(s, a.conversions), null);

  const steps = [];
  if (totalSends !== null) steps.push({ label: '발송', value: totalSends });
  if (totalReach !== null) steps.push({ label: '도달', value: totalReach });
  if (totalOpens !== null) steps.push({ label: '오픈', value: totalOpens });
  if (totalInflows !== null) steps.push({ label: '유입', value: totalInflows });
  if (totalConversions !== null) steps.push({ label: '전환', value: totalConversions });

  return steps;
}

// 차트용 색상 팔레트
export const CHART_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6b7280',
];
