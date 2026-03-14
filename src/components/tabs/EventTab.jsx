import { useState } from 'react';
import KPICard from '../KPICard.jsx';
import EventContributionChart from '../charts/EventContributionChart.jsx';
import EventDailyChart from '../charts/EventDailyChart.jsx';
import EventPhaseChart from '../charts/EventPhaseChart.jsx';
import {
  formatAmount,
  formatExact,
  formatNumber,
  formatPercent,
  calcEventSummary,
  calcEventPhases,
} from '../../utils/calculations.js';

function EventCard({ ev, salesData }) {
  const phases = calcEventPhases(salesData, ev);
  const existingRatio = ev.couponCustomers > 0 && ev.couponExistingMembers !== null
    ? (ev.couponExistingMembers / ev.couponCustomers) * 100
    : null;

  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-800">{ev.eventName}</h4>
          <p className="text-xs text-gray-400 mt-0.5">
            {ev.startDate?.toLocaleDateString('ko-KR')} ~ {ev.endDate?.toLocaleDateString('ko-KR')} ({ev.durationDays}일)
          </p>
        </div>
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
          {ev.durationDays}일간
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div>
          <p className="text-gray-400 text-xs">쿠폰 매출</p>
          <p className="font-semibold text-gray-800" title={formatExact(ev.couponSales)}>
            {formatAmount(ev.couponSales)}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">쿠폰 주문수</p>
          <p className="font-semibold text-gray-800">{formatNumber(ev.couponOrders)}건</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">쿠폰 고객수</p>
          <p className="font-semibold text-gray-800">{formatNumber(ev.couponCustomers)}명</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">기존회원 비중</p>
          <p className="font-semibold text-gray-800">{formatPercent(existingRatio)}</p>
        </div>
      </div>
      {phases && (
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-center">
          <div className="bg-blue-50 rounded-lg p-2">
            <p className="text-blue-400">이벤트 전</p>
            <p className="font-semibold text-blue-700">{formatAmount(phases.pre.avg)}/일</p>
          </div>
          <div className="bg-blue-100 rounded-lg p-2">
            <p className="text-blue-600">이벤트 중</p>
            <p className="font-semibold text-blue-800">{formatAmount(phases.during.avg)}/일</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-2">
            <p className="text-blue-400">이벤트 후</p>
            <p className="font-semibold text-blue-700">{formatAmount(phases.post.avg)}/일</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EventTab({ salesData, couponData }) {
  const [selectedEvent, setSelectedEvent] = useState('');

  if (!couponData || couponData.length === 0) {
    return <div className="p-8 text-center text-gray-400">쿠폰이벤트 데이터가 없습니다.</div>;
  }

  const eventSummary = calcEventSummary(couponData);
  const totalCouponSales = eventSummary.reduce((s, ev) => s + (ev.couponSales ?? 0), 0);
  const totalCouponOrders = eventSummary.reduce((s, ev) => s + (ev.couponOrders ?? 0), 0);
  const totalExistingMembers = eventSummary.reduce((s, ev) => s + (ev.couponExistingMembers ?? 0), 0);
  const totalCustomers = eventSummary.reduce((s, ev) => s + (ev.couponCustomers ?? 0), 0);
  const overallExistingRatio = totalCustomers > 0 ? (totalExistingMembers / totalCustomers) * 100 : null;

  const salesTotal = salesData?.reduce((s, r) => s + (r.totalSales ?? 0), 0) ?? 0;
  const couponAttributionRate = salesTotal > 0 ? (totalCouponSales / salesTotal) * 100 : null;

  const activeEvent = selectedEvent
    ? eventSummary.find(ev => ev.eventName === selectedEvent)
    : eventSummary[0];

  const phases = activeEvent ? calcEventPhases(salesData, activeEvent) : null;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          title="이벤트 종류"
          value={`${eventSummary.length}개`}
          icon="🎉"
          color="purple"
        />
        <KPICard
          title="쿠폰 귀속 매출"
          value={formatAmount(totalCouponSales)}
          icon="🎫"
          color="blue"
          tooltip={formatExact(totalCouponSales)}
          sub={couponAttributionRate !== null ? `전체의 ${formatPercent(couponAttributionRate)}` : ''}
        />
        <KPICard
          title="쿠폰 주문수"
          value={formatNumber(totalCouponOrders) + '건'}
          icon="📋"
          color="green"
        />
        <KPICard
          title="기존회원 비중"
          value={formatPercent(overallExistingRatio)}
          icon="👤"
          color="yellow"
        />
      </div>

      {/* 이벤트 선택 */}
      {eventSummary.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedEvent('')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !selectedEvent ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            전체
          </button>
          {eventSummary.map(ev => (
            <button
              key={ev.eventName}
              onClick={() => setSelectedEvent(ev.eventName)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedEvent === ev.eventName
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {ev.eventName}
            </button>
          ))}
        </div>
      )}

      <EventContributionChart eventSummary={eventSummary} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EventDailyChart
          salesData={salesData}
          couponData={couponData}
          eventName={selectedEvent || null}
        />
        <EventPhaseChart phases={phases} eventName={activeEvent?.eventName} />
      </div>

      {/* 이벤트 상세 카드 */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">이벤트별 상세</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {eventSummary.map(ev => (
            <EventCard key={ev.eventName} ev={ev} salesData={salesData} />
          ))}
        </div>
      </div>
    </div>
  );
}
