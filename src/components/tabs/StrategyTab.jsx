import { useState, useRef } from 'react';
import {
  calcKPIs,
  calcMonthlySales,
  calcYoYData,
  calcYoYGrowth,
  calcEventSummary,
  calcAdSummary,
  formatAmount,
  formatPercent,
} from '../../utils/calculations.js';
import { generateStrategyCommentary } from '../../utils/anthropicApi.js';

function MarkdownRenderer({ text }) {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-lg font-bold text-gray-800 mt-5 mb-2 pb-1 border-b border-gray-100">
          {line.replace('## ', '')}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-base font-semibold text-gray-700 mt-3 mb-1">
          {line.replace('### ', '')}
        </h3>
      );
    } else if (line.startsWith('- ')) {
      elements.push(
        <li key={i} className="text-sm text-gray-600 ml-4 list-disc mb-1">
          {renderInline(line.replace('- ', ''))}
        </li>
      );
    } else if (line.trim() !== '') {
      elements.push(
        <p key={i} className="text-sm text-gray-600 mb-2">{renderInline(line)}</p>
      );
    }
    i++;
  }
  return <div className="prose max-w-none">{elements}</div>;
}

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="font-semibold text-gray-800">{part.slice(2, -2)}</strong>
      : part
  );
}

function InsightCard({ title, items, color }) {
  const colorMap = {
    green: 'border-green-200 bg-green-50',
    red: 'border-red-200 bg-red-50',
    blue: 'border-blue-200 bg-blue-50',
  };
  const iconMap = { green: '✅', red: '⚠️', blue: '💡' };
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
      <p className="font-semibold text-sm text-gray-700 mb-2">{iconMap[color]} {title}</p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-gray-600">• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function StrategyCard({ priority, label, items, color }) {
  const colorMap = {
    red: 'border-red-200 bg-white',
    yellow: 'border-yellow-200 bg-white',
    blue: 'border-blue-200 bg-white',
  };
  const badgeMap = {
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    blue: 'bg-blue-100 text-blue-600',
  };
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${colorMap[color]}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeMap[color]}`}>
          {label}
        </span>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-gray-700">
            <span className="text-gray-300 shrink-0">→</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function buildInsights(kpis, yoyGrowth, eventSummary, adSummary) {
  const strengths = [];
  const risks = [];

  if (kpis.convRate > 3) strengths.push(`전환율 ${kpis.convRate.toFixed(2)}%로 업계 평균 이상 수준`);
  if (kpis.refundRate < 3) strengths.push(`환불률 ${kpis.refundRate?.toFixed(2)}%로 낮은 수준 유지`);

  const growthValues = Object.values(yoyGrowth);
  const latestGrowth = growthValues[growthValues.length - 1];
  if (latestGrowth > 10) strengths.push(`YoY ${latestGrowth.toFixed(1)}% 성장으로 강한 매출 모멘텀`);
  else if (latestGrowth < 0) risks.push(`YoY ${latestGrowth.toFixed(1)}% 역성장, 매출 회복 전략 필요`);

  if (adSummary?.length > 0) {
    const highRoas = adSummary.filter(a => a.roas >= 3);
    const lowRoas = adSummary.filter(a => a.roas < 1);
    if (highRoas.length > 0) strengths.push(`${highRoas.map(a => a.adName).join(', ')}: ROAS ${highRoas[0].roas?.toFixed(1)} 이상 우수 성과`);
    if (lowRoas.length > 0) risks.push(`${lowRoas.map(a => a.adName).join(', ')}: ROAS 1 미만, 광고 효율 점검 필요`);
  }

  if (eventSummary?.length > 0) {
    const totalCustomers = eventSummary.reduce((s, e) => s + (e.couponCustomers ?? 0), 0);
    const totalExisting = eventSummary.reduce((s, e) => s + (e.couponExistingMembers ?? 0), 0);
    const existingRatio = totalCustomers > 0 ? (totalExisting / totalCustomers) * 100 : null;
    if (existingRatio > 70) risks.push(`쿠폰 사용의 ${existingRatio.toFixed(0)}%가 기존회원 — 신규 유입 효과 제한적`);
    if (existingRatio < 50) strengths.push(`쿠폰 이벤트의 신규회원 유입 효과 우수 (기존회원 비중 ${existingRatio?.toFixed(0)}%)`);
  }

  if (kpis.convRate < 1) risks.push(`전환율 ${kpis.convRate?.toFixed(2)}%로 업계 평균 하회, UX 개선 검토 필요`);
  if (kpis.refundRate > 5) risks.push(`환불률 ${kpis.refundRate?.toFixed(2)}%로 높은 수준, 상품 품질·설명 점검 필요`);

  if (strengths.length === 0) strengths.push('데이터를 바탕으로 AI 분석을 통해 강점을 확인하세요.');
  if (risks.length === 0) risks.push('현재 데이터에서 주요 위험 신호가 감지되지 않습니다.');

  return { strengths, risks };
}

export default function StrategyTab({ salesData, couponData, adData, apiKey }) {
  const [commentary, setCommentary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef(false);

  const kpis = calcKPIs(salesData || []);
  const monthlySales = calcMonthlySales(salesData || []);
  const { byYear, years } = calcYoYData(monthlySales);
  const yoyGrowth = calcYoYGrowth(byYear, years);
  const eventSummary = couponData?.length ? calcEventSummary(couponData) : [];
  const adSummary = adData?.length ? calcAdSummary(adData) : [];

  const { strengths, risks } = buildInsights(kpis, yoyGrowth, eventSummary, adSummary);

  const handleGenerate = async () => {
    if (!apiKey) {
      setError('Anthropic API 키가 필요합니다. 파일 업로드 화면에서 입력해주세요.');
      return;
    }
    setLoading(true);
    setError('');
    setCommentary('');
    abortRef.current = false;

    try {
      const text = await generateStrategyCommentary(
        { kpis, monthlySales, eventSummary, adSummary, yoyGrowth },
        apiKey
      );
      if (!abortRef.current) setCommentary(text);
    } catch (err) {
      if (!abortRef.current) setError('분석 생성 오류: ' + err.message);
    } finally {
      if (!abortRef.current) setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 강점 / 위험 인사이트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InsightCard title="강점 인사이트" items={strengths} color="green" />
        <InsightCard title="위험 요인" items={risks} color="red" />
      </div>

      {/* 전략 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StrategyCard
          color="red"
          label="즉시 실행 (1개월)"
          items={[
            '성과 높은 광고 채널 예산 우선 배분',
            '환불률 높은 상품 원인 분석 및 상세페이지 개선',
            '전환율 낮은 랜딩페이지 A/B 테스트 시작',
            '이벤트 종료 후 재구매 유도 자동화 메시지 설정',
          ]}
        />
        <StrategyCard
          color="yellow"
          label="단기 전략 (1~3개월)"
          items={[
            '신규회원 온보딩 시퀀스 구축 (가입 후 30일 여정)',
            '요일별 매출 패턴 기반 광고 스케줄 최적화',
            '이벤트 전·중·후 매출 패턴 분석으로 최적 기간 도출',
            'ROAS 낮은 광고 소재·타겟 개편 테스트',
          ]}
        />
        <StrategyCard
          color="blue"
          label="중기 전략 (3~6개월)"
          items={[
            '기존회원 LTV 향상 로열티 프로그램 설계',
            '광고·이벤트 통합 성과 측정 체계 구축',
            '계절별·분기별 매출 예측 모델 수립',
            '신규회원 유입 채널 다각화 및 CPA 최적화',
          ]}
        />
      </div>

      {/* AI 분석 섹션 */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-800">🤖 AI 맞춤 전략 분석</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Anthropic Claude가 데이터를 기반으로 맞춤 전략을 생성합니다.
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !apiKey}
            className="px-4 py-2 rounded-lg font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow"
          >
            {loading ? '⏳ 분석 중...' : '✨ AI 분석 생성'}
          </button>
        </div>

        {!apiKey && (
          <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
            파일 업로드 화면에서 Anthropic API 키를 입력하면 AI 분석을 사용할 수 있습니다.
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        )}

        {loading && !commentary && (
          <div className="flex items-center gap-3 text-blue-600 p-4">
            <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" />
            <span className="text-sm">데이터 분석 중...</span>
          </div>
        )}

        {commentary && (
          <div className="mt-4 bg-white rounded-xl border p-5 shadow-sm">
            <MarkdownRenderer text={commentary} />
          </div>
        )}
      </div>
    </div>
  );
}
