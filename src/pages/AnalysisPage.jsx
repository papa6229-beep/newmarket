import { useState, useCallback } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import ChatInterface from '../components/ChatInterface.jsx';
import {
  calcKPIs, calcMonthlySales, calcYoYData, calcYoYGrowth,
  calcEventSummary, calcAdSummary, formatAmount, formatPercent,
} from '../utils/calculations.js';
import { askChatQuestion, buildSummaryText } from '../utils/anthropicApi.js';

let msgId = 0;
const uid = () => String(++msgId);

// ── Greeting message (shown before data is loaded) ────────────────────────────
function makeGreeting() {
  return {
    id: uid(),
    role: 'assistant',
    content: '안녕하세요! 인사이트 뱅크 AI 데이터 분석실입니다.\n\n좌측 \'데이터 업로드\' 버튼을 통해 매출 데이터나 이벤트 통계 등을 업로드해주세요.\n이후 아래 예시처럼 자유롭게 분석을 요청하시면 됩니다.',
    blocks: [
      {
        type: 'chips',
        chips: [
          { label: '지난 3주간의 주차별 매출 추이 비교해줘' },
          { label: '전반적인 매출 동향 분석해줘' },
          { label: '이벤트 효율 비교해줘' },
        ],
      },
    ],
  };
}

// ── Build full analysis message after data load ───────────────────────────────
function buildAnalysisMessage(salesData, couponData, adData) {
  const kpis = calcKPIs(salesData);
  const monthlySales = calcMonthlySales(salesData);
  const eventSummary = couponData?.length ? calcEventSummary(couponData) : [];
  const adSummary = adData?.length ? calcAdSummary(adData) : [];

  const dates = salesData.map(r => new Date(r.date)).filter(d => !isNaN(d));
  const min = dates.length ? new Date(Math.min(...dates)).toLocaleDateString('ko-KR') : '';
  const max = dates.length ? new Date(Math.max(...dates)).toLocaleDateString('ko-KR') : '';
  const dateRange = min && max ? `${min} ~ ${max} (${salesData.length}일)` : '';

  const yoyData = calcYoYData(monthlySales);
  const yoyGrowth = yoyData.years?.length >= 2 ? calcYoYGrowth(yoyData.byYear, yoyData.years) : {};
  const yoyLine = Object.entries(yoyGrowth).map(([p, r]) => `${p}: ${r > 0 ? '+' : ''}${r.toFixed(1)}%`).join(' / ');

  const insights = [];
  if (kpis.convRate != null) {
    insights.push({
      icon: kpis.convRate >= 3 ? '✅' : kpis.convRate >= 1.5 ? '💡' : '⚠️',
      text: `전환율 ${formatPercent(kpis.convRate)} — ${kpis.convRate >= 3 ? '업계 평균(2.5%) 이상의 양호한 수준입니다.' : '업계 평균(2.5%) 대비 개선 여지가 있습니다.'}`,
    });
  }
  if (yoyLine) {
    insights.push({ icon: '📈', text: `YoY 성장률: ${yoyLine}` });
  }
  if (adSummary.length > 0) {
    const avgRoas = adSummary.reduce((s, a) => s + (a.roas ?? 0), 0) / adSummary.length;
    insights.push({ icon: avgRoas >= 3 ? '🟢' : '🟡', text: `광고 평균 ROAS ${avgRoas.toFixed(2)} — ${adSummary.length}개 채널 운영 중` });
  }
  if (eventSummary.length > 0) {
    insights.push({ icon: '🎯', text: `${eventSummary.length}개 이벤트 데이터 연동 완료. 이벤트 효율 분석이 가능합니다.` });
  }

  const blocks = [
    { type: 'kpi', kpis, dateRange },
    { type: 'monthly_chart', data: monthlySales },
  ];
  if (insights.length > 0) blocks.push({ type: 'insight', items: insights });

  const chips = [{ label: '이벤트 효율 분석해줘' }];
  if (adSummary.length > 0) chips.push({ label: '광고 ROAS 비교해줘' });
  chips.push({ label: '핵심 개선 전략 제안해줘' });
  blocks.push({ type: 'chips', chips });

  return {
    id: uid(),
    role: 'assistant',
    content: `📊 데이터 분석이 완료되었습니다!\n\n${dateRange} 기간의 데이터를 분석했습니다. 주요 KPI와 월별 트렌드를 확인하세요.`,
    blocks,
    _analysisData: { kpis, monthlySales, yoyGrowth, eventSummary, adSummary },
  };
}

// ── Predefined analysis triggers ─────────────────────────────────────────────
function buildPredefinedResponse(label, analysisData) {
  const { kpis, monthlySales, eventSummary, adSummary } = analysisData;
  const lower = label.toLowerCase();

  if (lower.includes('이벤트') || lower.includes('쿠폰')) {
    if (!eventSummary?.length) {
      return { content: '이벤트 데이터가 없습니다. 좌측 사이드바에서 이벤트 파일을 업로드해주세요.' };
    }
    const best = [...eventSummary].sort((a, b) => (b.couponSales ?? 0) - (a.couponSales ?? 0))[0];
    const insights = [
      { icon: '🏆', text: `가장 높은 매출 이벤트: "${best.eventName}" (${formatAmount(best.couponSales)})` },
    ];
    const avgExist = eventSummary.filter(e => e.couponCustomers > 0 && e.couponExistingMembers != null)
      .map(e => e.couponExistingMembers / e.couponCustomers * 100);
    if (avgExist.length > 0) {
      const avg = avgExist.reduce((s, v) => s + v, 0) / avgExist.length;
      insights.push({ icon: '👥', text: `쿠폰 사용 고객 중 기존회원 평균 비중: ${avg.toFixed(1)}%` });
    }
    return {
      content: `이벤트 ${eventSummary.length}건의 성과를 분석했습니다.`,
      blocks: [
        { type: 'event_table', data: eventSummary },
        { type: 'insight', items: insights },
        { type: 'chips', chips: [{ label: '광고 ROAS 비교해줘' }, { label: '핵심 개선 전략 제안해줘' }] },
      ],
    };
  }

  if (lower.includes('광고') || lower.includes('roas')) {
    if (!adSummary?.length) {
      return { content: '광고 데이터가 없습니다. 좌측 사이드바에서 광고 파일을 업로드해주세요.' };
    }
    const top = [...adSummary].sort((a, b) => (b.roas ?? 0) - (a.roas ?? 0))[0];
    const insights = [
      { icon: '🥇', text: `ROAS 최상위 광고: "${top.adName}" (ROAS ${top.roas?.toFixed(2) ?? '-'})` },
    ];
    const underperform = adSummary.filter(a => a.roas != null && a.roas < 1);
    if (underperform.length > 0) {
      insights.push({ icon: '⚠️', text: `ROAS 1 미만 광고 ${underperform.length}건 — 예산 재배분이 필요합니다.` });
    }
    return {
      content: `광고 ${adSummary.length}개 채널의 성과를 분석했습니다.`,
      blocks: [
        { type: 'ad_table', data: adSummary },
        { type: 'insight', items: insights },
        { type: 'chips', chips: [{ label: '이벤트 효율 분석해줘' }, { label: '핵심 개선 전략 제안해줘' }] },
      ],
    };
  }

  if (lower.includes('매출') || lower.includes('전체') || lower.includes('동향') || lower.includes('추이')) {
    return {
      content: '월별 매출 추이 및 전체 성과를 분석했습니다.',
      blocks: [
        { type: 'kpi', kpis },
        { type: 'monthly_chart', data: monthlySales },
        { type: 'chips', chips: [{ label: '이벤트 효율 분석해줘' }, { label: '핵심 개선 전략 제안해줘' }] },
      ],
    };
  }

  return null; // fall through to Claude API
}

export default function AnalysisPage({ shop, user, onLogout, onChangeShop }) {
  const [salesFiles, setSalesFiles] = useState([]);
  const [couponFiles, setCouponFiles] = useState([]);
  const [adFiles, setAdFiles] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState([makeGreeting()]);
  const [inputValue, setInputValue] = useState('');
  const [analysisData, setAnalysisData] = useState(null);

  // File adders/removers
  const makeAdder = (setter) => (newFiles) =>
    setter(prev => {
      const names = new Set(prev.map(f => f.name));
      return [...prev, ...newFiles.filter(f => !names.has(f.name))];
    });
  const makeRemover = (setter) => (i) => setter(prev => prev.filter((_, idx) => idx !== i));

  // Trigger data parse + analysis
  const handleAnalyze = async () => {
    if (!salesFiles.length) return;
    setIsLoading(true);
    try {
      const { parseSalesData, parseCouponData, parseAdData } = await import('../utils/excelParser.js');
      const salesData = await parseSalesData(salesFiles[0]);
      const couponData = (await Promise.all(couponFiles.map(f => parseCouponData(f)))).flat();
      const adData = (await Promise.all(adFiles.map(f => parseAdData(f)))).flat();

      const eventSummary = couponData.length ? calcEventSummary(couponData) : [];
      const adSummary = adData.length ? calcAdSummary(adData) : [];
      const monthlySales = calcMonthlySales(salesData);
      const kpis = calcKPIs(salesData);
      const yoyData = calcYoYData(monthlySales);
      const yoyGrowth = yoyData.years?.length >= 2 ? calcYoYGrowth(yoyData.byYear, yoyData.years) : {};

      const data = { salesData, couponData, adData, kpis, monthlySales, yoyGrowth, eventSummary, adSummary };
      setAnalysisData(data);

      const analysisMsg = buildAnalysisMessage(salesData, couponData, adData);
      setMessages(prev => [...prev, analysisMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { id: uid(), role: 'assistant', content: `분석 중 오류가 발생했습니다: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Send a message (predefined or via Claude)
  const handleSend = useCallback(async (text) => {
    if (!text.trim() || isStreaming) return;
    setInputValue('');

    const userMsg = { id: uid(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);

    // Check for predefined response first
    if (analysisData) {
      const predef = buildPredefinedResponse(text, analysisData);
      if (predef) {
        await new Promise(r => setTimeout(r, 300)); // brief delay for feel
        setMessages(prev => [...prev, { id: uid(), role: 'assistant', ...predef }]);
        return;
      }
    }

    // Claude API call
    if (!apiKey) {
      setMessages(prev => [...prev, {
        id: uid(), role: 'assistant',
        content: '자유 질문 분석에는 Anthropic API 키가 필요합니다. 좌측 사이드바에서 API 키를 입력해주세요.',
      }]);
      return;
    }

    setIsStreaming(true);
    const streamMsgId = uid();

    try {
      const summaryForChat = analysisData
        ? { kpis: analysisData.kpis, monthlySales: analysisData.monthlySales, yoyGrowth: analysisData.yoyGrowth, eventSummary: analysisData.eventSummary, adSummary: analysisData.adSummary }
        : { kpis: null, monthlySales: [], yoyGrowth: {}, eventSummary: [], adSummary: [] };

      const history = messages
        .filter(m => m.role === 'user' || (m.role === 'assistant' && m.content && !m.blocks))
        .slice(-6)
        .map(m => ({ role: m.role, content: m.content }));

      let accumulated = '';
      // Add streaming placeholder
      setMessages(prev => [...prev, { id: streamMsgId, role: 'assistant', content: '', streaming: true }]);

      const answer = await askChatQuestion({
        question: text,
        analysisData: summaryForChat,
        history,
        apiKey,
        onChunk: (text) => {
          accumulated = text;
          setMessages(prev => prev.map(m => m.id === streamMsgId ? { ...m, content: text, streaming: true } : m));
        },
      });
      setMessages(prev => prev.map(m => m.id === streamMsgId ? { ...m, content: answer, streaming: false } : m));
    } catch (err) {
      setMessages(prev => prev.map(m => m.id === streamMsgId
        ? { ...m, content: `오류: ${err.message}`, streaming: false }
        : m
      ));
    } finally {
      setIsStreaming(false);
    }
  }, [messages, analysisData, apiKey, isStreaming]);

  const handleNewChat = () => {
    setMessages([makeGreeting()]);
    setAnalysisData(null);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-warm-50">
      <Sidebar
        shop={shop}
        user={user}
        salesFiles={salesFiles}
        couponFiles={couponFiles}
        adFiles={adFiles}
        onAddSales={makeAdder(setSalesFiles)}
        onAddCoupon={makeAdder(setCouponFiles)}
        onAddAd={makeAdder(setAdFiles)}
        onRemoveSales={makeRemover(setSalesFiles)}
        onRemoveCoupon={makeRemover(setCouponFiles)}
        onRemoveAd={makeRemover(setAdFiles)}
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
        onAnalyze={handleAnalyze}
        isLoading={isLoading}
        eventSummary={analysisData?.eventSummary || []}
        onNewChat={handleNewChat}
        onLogout={onLogout}
        onChangeShop={onChangeShop}
      />
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          shopName={shop?.name}
          messages={messages}
          isStreaming={isStreaming}
          onSend={handleSend}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onNewChat={handleNewChat}
        />
      </div>
    </div>
  );
}
