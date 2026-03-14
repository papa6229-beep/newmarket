import Anthropic from '@anthropic-ai/sdk';

// 분석 데이터 요약 텍스트 생성 (공통)
export function buildSummaryText({ kpis, monthlySales, eventSummary, adSummary, yoyGrowth }) {
  const lines = [];

  if (kpis) {
    lines.push('### 전체 KPI');
    if (kpis.totalSales !== null) lines.push(`- 총 매출: ${kpis.totalSales?.toLocaleString()}원`);
    if (kpis.totalOrders !== null) lines.push(`- 총 주문수: ${kpis.totalOrders?.toLocaleString()}건`);
    if (kpis.atv !== null) lines.push(`- 객단가(ATV): ${Math.round(kpis.atv)?.toLocaleString()}원`);
    if (kpis.convRate !== null) lines.push(`- 전환율: ${kpis.convRate?.toFixed(2)}%`);
    if (kpis.refundRate !== null) lines.push(`- 환불률: ${kpis.refundRate?.toFixed(2)}%`);
  }

  if (yoyGrowth && Object.keys(yoyGrowth).length > 0) {
    lines.push('\n### YoY 성장률');
    Object.entries(yoyGrowth).forEach(([period, rate]) => {
      lines.push(`- ${period}: ${rate.toFixed(1)}%`);
    });
  }

  if (monthlySales && monthlySales.length > 0) {
    lines.push('\n### 월별 매출 추이');
    monthlySales.slice(-12).forEach(m => {
      lines.push(`- ${m.ym}: ${m.totalSales?.toLocaleString()}원 (주문 ${m.orders?.toLocaleString()}건)`);
    });
  }

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

  if (adSummary && adSummary.length > 0) {
    lines.push('\n### 광고 성과');
    adSummary.forEach(ad => {
      lines.push(`- ${ad.adName}: 광고비 ${ad.adCost?.toLocaleString()}원, ROAS ${ad.roas?.toFixed(2) ?? '-'}, 전환 ${ad.conversions?.toLocaleString()}건`);
    });
  }

  return lines.join('\n');
}

// 전략 제안 탭 코멘터리 생성 (스트리밍, 전체 텍스트 반환)
export async function generateStrategyCommentary(analysisData, apiKey) {
  if (!apiKey) throw new Error('API 키가 필요합니다.');

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  const summaryText = buildSummaryText(analysisData);

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    system: `당신은 이커머스 쇼핑몰 전문 마케팅 전략가입니다.
주어진 매출 데이터를 분석하여 전략적 인사이트와 실행 가능한 제안을 제공합니다.

규칙:
- 숫자를 단순히 낭독하지 말 것 (예: "총 매출은 X원입니다" 금지)
- 수치 간의 관계, 패턴, 의미를 해석할 것
- 근거 있는 인사이트를 제공할 것
- 한국어로 작성할 것
- 마크다운 형식으로 작성할 것 (## 헤더, - 항목, **강조** 활용)`,
    messages: [{
      role: 'user',
      content: `다음 쇼핑몰 매출 데이터를 분석하고 전략적 제안을 작성해주세요:\n\n${summaryText}\n\n아래 구조로 분석해주세요:\n\n## 핵심 강점 분석\n## 주요 위험 요인\n## 즉시 실행 전략 (1개월 이내)\n## 단기 전략 (1~3개월)\n## 중기 전략 (3~6개월)`,
    }],
  });

  let fullText = '';
  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      fullText += chunk.delta.text;
    }
  }
  return fullText;
}

// 채팅 질문 — onChunk 콜백으로 스트리밍 토큰 전달, history는 이전 대화 [{role, content}]
export async function askChatQuestion({ question, analysisData, history, apiKey, onChunk }) {
  if (!apiKey) throw new Error('API 키가 필요합니다.');

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  const summaryText = buildSummaryText(analysisData);

  const systemPrompt = `당신은 이커머스 쇼핑몰 전문 마케팅 데이터 분석가입니다.
아래는 분석 중인 쇼핑몰의 실제 매출 데이터 요약입니다:

---
${summaryText}
---

이 데이터를 기반으로 사용자의 질문에 답변하세요.

규칙:
- 반드시 위 데이터에 근거하여 답변할 것
- 데이터에 없는 내용은 "데이터에 포함되지 않았습니다"라고 명시할 것
- 숫자를 단순 낭독하지 말고 맥락과 의미를 함께 설명할 것
- 한국어로 답변할 것
- 마크다운 활용 가능 (**강조**, - 목록 등)`;

  // 이전 대화 이력 + 현재 질문 구성
  const messages = [
    ...history.map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: question },
  ];

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    system: systemPrompt,
    messages,
  });

  let fullText = '';
  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      fullText += chunk.delta.text;
      onChunk?.(fullText);
    }
  }
  return fullText;
}
