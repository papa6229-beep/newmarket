import { useState } from 'react';
import SalesTab from './tabs/SalesTab.jsx';
import EventTab from './tabs/EventTab.jsx';
import AdTab from './tabs/AdTab.jsx';
import StrategyTab from './tabs/StrategyTab.jsx';

const TABS = [
  { id: 'sales', label: '전체매출', icon: '📊' },
  { id: 'event', label: '이벤트 분석', icon: '🎉' },
  { id: 'ad', label: '광고 분석', icon: '📣' },
  { id: 'strategy', label: '전략 제안', icon: '🧭' },
];

export default function Dashboard({ data, onReset }) {
  const [activeTab, setActiveTab] = useState('sales');
  const { salesData, couponData, adData, apiKey } = data;

  const dateSummary = () => {
    if (!salesData?.length) return '';
    const dates = salesData.map(r => new Date(r.date)).filter(d => !isNaN(d));
    if (!dates.length) return '';
    const min = new Date(Math.min(...dates));
    const max = new Date(Math.max(...dates));
    return `${min.toLocaleDateString('ko-KR')} ~ ${max.toLocaleDateString('ko-KR')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">📊 마케팅 매출 분석</h1>
            {dateSummary() && (
              <p className="text-xs text-gray-400">{dateSummary()} · {salesData.length}일 데이터</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex gap-2 text-xs text-gray-500">
              {couponData?.length > 0 && (
                <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-200">
                  쿠폰 {couponData.length}건
                </span>
              )}
              {adData?.length > 0 && (
                <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full border border-purple-200">
                  광고 {adData.length}건
                </span>
              )}
            </div>
            <button
              onClick={onReset}
              className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              ↑ 파일 재업로드
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map(tab => {
              const isDisabled =
                (tab.id === 'event' && !couponData?.length) ||
                (tab.id === 'ad' && !adData?.length);
              return (
                <button
                  key={tab.id}
                  onClick={() => !isDisabled && setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : isDisabled
                      ? 'border-transparent text-gray-300 cursor-not-allowed'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {isDisabled && <span className="text-xs text-gray-300">(데이터 없음)</span>}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'sales' && <SalesTab salesData={salesData} />}
        {activeTab === 'event' && (
          <EventTab salesData={salesData} couponData={couponData} />
        )}
        {activeTab === 'ad' && (
          <AdTab adData={adData} couponData={couponData} />
        )}
        {activeTab === 'strategy' && (
          <StrategyTab
            salesData={salesData}
            couponData={couponData}
            adData={adData}
            apiKey={apiKey}
          />
        )}
      </main>
    </div>
  );
}
