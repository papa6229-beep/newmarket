import KPICard from '../KPICard.jsx';
import AdRevenueChart from '../charts/AdRevenueChart.jsx';
import FunnelChart from '../charts/FunnelChart.jsx';
import {
  formatAmount,
  formatExact,
  formatNumber,
  formatPercent,
  calcAdSummary,
  calcDailyAdData,
  calcFunnelData,
} from '../../utils/calculations.js';

function AdDetailCard({ ad }) {
  const existingRatio =
    ad.conversions > 0 && ad.newConversions !== null
      ? ((1 - ad.newConversions / ad.conversions) * 100)
      : null;

  return (
    <div className="bg-white rounded-xl border p-4 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-800 text-sm">{ad.adName}</h4>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            ad.roas >= 2
              ? 'bg-green-100 text-green-600'
              : ad.roas >= 1
              ? 'bg-yellow-100 text-yellow-600'
              : 'bg-red-100 text-red-600'
          }`}
        >
          ROAS {ad.roas?.toFixed(2) ?? '-'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
        <div>
          <span className="text-gray-400">광고비: </span>
          <span className="font-medium" title={formatExact(ad.adCost)}>{formatAmount(ad.adCost)}</span>
        </div>
        <div>
          <span className="text-gray-400">귀속 매출: </span>
          <span className="font-medium" title={formatExact(ad.adAttributedSales)}>{formatAmount(ad.adAttributedSales)}</span>
        </div>
        <div>
          <span className="text-gray-400">전환수: </span>
          <span className="font-medium">{formatNumber(ad.conversions)}건</span>
        </div>
        <div>
          <span className="text-gray-400">신규전환: </span>
          <span className="font-medium">{formatNumber(ad.newConversions)}건</span>
        </div>
        {ad.sends !== null && (
          <div>
            <span className="text-gray-400">발송수: </span>
            <span className="font-medium">{formatNumber(ad.sends)}</span>
          </div>
        )}
        {ad.reach !== null && (
          <div>
            <span className="text-gray-400">도달수: </span>
            <span className="font-medium">{formatNumber(ad.reach)}</span>
          </div>
        )}
        {ad.opens !== null && (
          <div>
            <span className="text-gray-400">오픈수: </span>
            <span className="font-medium">{formatNumber(ad.opens)}</span>
          </div>
        )}
        {ad.inflows !== null && (
          <div>
            <span className="text-gray-400">유입수: </span>
            <span className="font-medium">{formatNumber(ad.inflows)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdTab({ adData, couponData }) {
  if (!adData || adData.length === 0) {
    return <div className="p-8 text-center text-gray-400">광고 데이터가 없습니다.</div>;
  }

  const adSummary = calcAdSummary(adData);
  const dailyAdData = calcDailyAdData(adData);
  const funnelData = calcFunnelData(adSummary);

  const totalAdCost = adSummary.reduce((s, a) => s + (a.adCost ?? 0), 0);
  const totalAdSales = adSummary.reduce((s, a) => s + (a.adAttributedSales ?? 0), 0);
  const totalConversions = adSummary.reduce((s, a) => s + (a.conversions ?? 0), 0);
  const overallRoas = totalAdCost > 0 ? totalAdSales / totalAdCost : null;

  // 광고-이벤트 중첩 가능성 체크
  const hasOverlapRisk = couponData && couponData.length > 0 && adData.length > 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          title="광고 귀속 매출"
          value={formatAmount(totalAdSales)}
          icon="📈"
          color="blue"
          tooltip={formatExact(totalAdSales)}
        />
        <KPICard
          title="광고비"
          value={formatAmount(totalAdCost)}
          icon="💸"
          color="red"
          tooltip={formatExact(totalAdCost)}
        />
        <KPICard
          title="ROAS"
          value={overallRoas !== null ? overallRoas.toFixed(2) : '-'}
          icon="📊"
          color={overallRoas >= 2 ? 'green' : overallRoas >= 1 ? 'yellow' : 'red'}
          sub="귀속매출 / 광고비"
        />
        <KPICard
          title="전환수"
          value={formatNumber(totalConversions) + '건'}
          icon="✅"
          color="green"
        />
      </div>

      {/* 광고-이벤트 중첩 경고 */}
      {hasOverlapRisk && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="text-sm font-semibold text-amber-700">광고-이벤트 중첩 가능성 안내</p>
            <p className="text-xs text-amber-600 mt-1">
              쿠폰이벤트 데이터와 광고 데이터가 모두 존재합니다. 같은 기간 내 이벤트와 광고가 동시에 운영된 경우,
              매출이 중복 귀속될 수 있습니다. 광고 귀속 매출과 쿠폰 귀속 매출의 합이 총 매출을 초과할 수 있으므로,
              해석 시 주의가 필요합니다.
            </p>
          </div>
        </div>
      )}

      <AdRevenueChart dailyAdData={dailyAdData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FunnelChart funnelData={funnelData} />
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">광고별 성과 요약</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {adSummary.map(ad => (
              <div key={ad.adName} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-700">{ad.adName}</p>
                  <p className="text-xs text-gray-400">
                    전환 {formatNumber(ad.conversions)}건 · 신규 {formatNumber(ad.newConversions)}건
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800" title={formatExact(ad.adAttributedSales)}>
                    {formatAmount(ad.adAttributedSales)}
                  </p>
                  <p className={`text-xs font-medium ${
                    ad.roas >= 2 ? 'text-green-500' : ad.roas >= 1 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    ROAS {ad.roas?.toFixed(2) ?? '-'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 광고별 상세 카드 */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">광고별 상세</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adSummary.map(ad => (
            <AdDetailCard key={ad.adName} ad={ad} />
          ))}
        </div>
      </div>
    </div>
  );
}
