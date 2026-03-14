import Anthropic from '@anthropic-ai/sdk';

export async function generateStrategyCommentary(analysisData, apiKey) {
  if (!apiKey) throw new Error('API 키가 필요합니다.');

  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  const { kpis, monthlySales, eventSummary, adSummary, yoyGrowth } = analysisData;

  const summaryText = buildSummaryText({ kpis, monthlySales, eventSummary, adSummary, yoyGrowth });

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system: `당신은 이커머스 쇼핑몰 전문 마케팅 전략가입니다.
주어진 매출 데이터를 분석하여 전략적 인사이트와 실행 가능한 제안을 제공합니다.

규칙:
- 숫자를 단순히 낭독하지 말 것 (예: "총 매출은 X원입니다" 금지)
- 수치 간의 관계, 패턴, 의미를 해석할 것
- 근거 있는 인사이트를 제공할 것
- 우선순위별로 즉시/단기/중기 전략을 구분할 것
- 한국어로 작성할 것
- 마크다운 형식으로 작성할 것 (## 헤더, - 항목, **강조** 활용)`,
    messages: [
      {
        role: 'user',
        content: `다음 쇼핑몰 매출 데이터를 분석하고 전략적 제안을 작성해주세요:\n\n${summaryText}

아래 구조로 분석해주세요:

## 핵심 강점 분석
(데이터에서 보이는 긍정적 신호와 그 의미)

## 주요 위험 요인
(주의가 필요한 지표와 잠재적 리스크)

## 즉시 실행 전략 (1개월 이내)
(높은 ROI, 빠른 실행 가능한 액션)

## 단기 전략 (1~3개월)
(구조적 개선, 테스트 및 최적화)

## 중기 전략 (3~6개월)
(성장 기반 구축, 장기 경쟁력 강화)`,
      },
    ],
  });

  let fullText = '';
  for await (const chunk of stream) {
    if (
      chunk.type === 'content_block_delta' &&
      chunk.delta.type === 'text_delta'
    ) {
      fullText += chunk.delta.text;
    }
  }
  return fullText;
}

function buildSummaryText({ kpis, monthlySales, eventSummary, adSummary, yoyGrowth }) {
  const lines = [];

  // KPI 요약
  if (kpis) {
    lines.push('### 전체 KPI');
    if (kpis.totalSales !== null) lines.push(`- 총 매출: ${kpis.totalSales?.toLocaleString()}원`);
    if (kpis.totalOrders !== null) lines.push(`- 총 주문수: ${kpis.totalOrders?.toLocaleString()}건`);
    if (kpis.atv !== null) lines.push(`- 객단가(ATV): ${Math.round(kpis.atv)?.toLocaleString()}원`);
    if (kpis.convRate !== null) lines.push(`- 전환율: ${kpis.convRate?.toFixed(2)}%`);
    if (kpis.refundRate !== null) lines.push(`- 환불률: ${kpis.refundRate?.toFixed(2)}%`);
  }

  // YoY 성장률
  if (yoyGrowth && Object.keys(yoyGrowth).length > 0) {
    lines.push('\n### YoY 성장률');
    Object.entries(yoyGrowth).forEach(([period, rate]) => {
      lines.push(`- ${period}: ${rate.toFixed(1)}%`);
    });
  }

  // 월별 매출 추이
  if (monthlySales && monthlySales.length > 0) {
    lines.push('\n### 월별 매출 추이');
    monthlySales.slice(-12).forEach(m => {
      lines.push(`- ${m.ym}: ${m.totalSales?.toLocaleString()}원 (주문 ${m.orders?.toLocaleString()}건)`);
    });
  }

  // 이벤트 요약
  if (eventSummary && eventSummary.length > 0) {
    lines.push('\n### 이벤트 성과');
    eventSummary.forEach(ev => {
      lines.push(`- ${ev.eventName}: 쿠폰 매출 ${ev.couponSales?.toLocaleString()}원, 주문 ${ev.couponOrders?.toLocaleString()}건`);
      if (ev.couponExistingMembers !== null && ev.couponCustomers > 0) {
        const existingRatio = (ev.couponExistingMembers / ev.couponCustomers * 100).toFixed(1);
        lines.push(`  기존회원 비중: ${existingRatio}%`);
      }
    });
  }

  // 광고 요약
  if (adSummary && adSummary.length > 0) {
    lines.push('\n### 광고 성과');
    adSummary.forEach(ad => {
      lines.push(`- ${ad.adName}: 광고비 ${ad.adCost?.toLocaleString()}원, ROAS ${ad.roas?.toFixed(2) ?? '-'}, 전환 ${ad.conversions?.toLocaleString()}건`);
    });
  }

  return lines.join('\n');
}
