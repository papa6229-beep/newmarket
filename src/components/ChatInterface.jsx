import { useRef, useEffect } from 'react';
import AnalysisBlock from './chat/AnalysisBlock.jsx';

// ── Markdown-ish prose renderer (for Claude API text) ───────────────────────
function ProseRenderer({ text }) {
  if (!text) return null;
  const lines = text.split('\n');
  const els = [];
  lines.forEach((line, i) => {
    if (line.startsWith('## ')) {
      els.push(<h2 key={i}>{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      els.push(<h3 key={i}>{line.slice(4)}</h3>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      els.push(<li key={i}>{renderInline(line.slice(2))}</li>);
    } else if (line.trim() === '') {
      els.push(<br key={i} />);
    } else {
      els.push(<p key={i}>{renderInline(line)}</p>);
    }
  });
  return <div className="chat-prose text-sm">{els}</div>;
}

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i}>{p.slice(2, -2)}</strong>
      : p
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function AIAvatar() {
  return (
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-400 to-accent-700 flex items-center justify-center shrink-0 shadow-sm">
      <span className="text-white text-sm">📊</span>
    </div>
  );
}

// ── Single message bubble ─────────────────────────────────────────────────────
function MessageBubble({ msg, onChipClick }) {
  const isUser = msg.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] bg-accent-500 text-white text-sm rounded-2xl rounded-br-sm px-4 py-3 shadow-sm">
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 max-w-full">
      <AIAvatar />
      <div className="flex-1 min-w-0">
        <div className="bg-white border border-warm-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-soft text-sm text-warm-800">
          {msg.content && <ProseRenderer text={msg.content} />}
          {msg.blocks && (
            <AnalysisBlock blocks={msg.blocks} onChipClick={onChipClick} />
          )}
          {msg.streaming && !msg.content && (
            <span className="inline-block w-1.5 h-4 bg-warm-400 animate-pulse rounded-sm" />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main ChatInterface ─────────────────────────────────────────────────────────
export default function ChatInterface({
  shopName,
  messages,
  isStreaming,
  onSend,
  inputValue,
  onInputChange,
  onNewChat,
}) {
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isStreaming) onSend(inputValue.trim());
    }
  };

  const handleChipClick = (label) => {
    if (!isStreaming) onSend(label);
  };

  return (
    <div className="flex flex-col h-full bg-warm-50/50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-warm-200 shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-warm-900 text-sm">마케팅 성과분석 Lab</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-600 text-[10px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                활성 세션
              </span>
            </div>
            <p className="text-xs text-warm-400 mt-0.5">
              업로드된 매출·이벤트 데이터를 기반으로 성과 비교와 원인 분석을 수행합니다
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost text-xs gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            전체 리포트 저장
          </button>
          <button className="btn-ghost p-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} onChipClick={handleChipClick} />
        ))}

        {/* Streaming indicator */}
        {isStreaming && (
          <div className="flex items-start gap-3">
            <AIAvatar />
            <div className="bg-white border border-warm-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-soft">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-warm-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-warm-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-warm-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 pb-6 pt-3 shrink-0">
        <div className="flex items-end gap-2 bg-white border border-warm-200 rounded-2xl px-4 py-3 shadow-soft focus-within:border-accent-300 focus-within:ring-2 focus-within:ring-accent-100 transition-all">
          <button className="btn-ghost p-1 mb-0.5 shrink-0 text-warm-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
            </svg>
          </button>
          <textarea
            ref={inputRef}
            className="flex-1 resize-none text-sm text-warm-900 placeholder-warm-400 bg-transparent outline-none max-h-36 min-h-[24px]"
            rows={1}
            placeholder="'추석 명절 전후 객단가 비교해줘' 와 같이 질문해보세요..."
            value={inputValue}
            onChange={e => {
              onInputChange(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 144) + 'px';
            }}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
          />
          <button
            onClick={() => { if (inputValue.trim() && !isStreaming) onSend(inputValue.trim()); }}
            disabled={!inputValue.trim() || isStreaming}
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mb-0.5 transition-all
              ${inputValue.trim() && !isStreaming
                ? 'bg-accent-500 hover:bg-accent-600 text-white shadow-sm'
                : 'bg-warm-100 text-warm-300 cursor-not-allowed'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
