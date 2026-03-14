import { useRef, useEffect } from 'react';
import AnalysisBlock from './chat/AnalysisBlock.jsx';

// ── Markdown-ish prose renderer ──────────────────────────────────────────────
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

// ── AI Avatar ─────────────────────────────────────────────────────────────────
function AIAvatar() {
  return (
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shrink-0 shadow-sm">
      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    </div>
  );
}

// ── Message bubble ────────────────────────────────────────────────────────────
function MessageBubble({ msg, onChipClick }) {
  const isUser = msg.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] bg-accent-500 text-white text-sm rounded-2xl rounded-br-sm px-4 py-3 shadow-sm leading-relaxed">
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 max-w-full">
      <AIAvatar />
      <div className="flex-1 min-w-0">
        <div className="bg-white border border-warm-200 rounded-2xl rounded-tl-sm px-4 py-3.5 shadow-soft">
          {msg.content && <ProseRenderer text={msg.content} />}
          {msg.blocks && (
            <AnalysisBlock blocks={msg.blocks} onChipClick={onChipClick} />
          )}
          {msg.streaming && !msg.content && (
            <div className="flex items-center gap-1.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-warm-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-warm-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-warm-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main ChatInterface ────────────────────────────────────────────────────────
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
    <div className="flex flex-col h-full bg-warm-50/30">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-warm-200 shrink-0">
        <div className="flex items-center gap-3">
          <AIAvatar />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-warm-900 text-sm">
                {shopName ? `${shopName} · 마케팅 성과분석` : '마케팅 성과분석 AI'}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-600 text-[10px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                온라인
              </span>
            </div>
            <p className="text-xs text-warm-400 mt-0.5">
              매출·이벤트·광고 데이터를 업로드하고 자유롭게 분석을 요청하세요
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="btn-ghost text-xs gap-1.5 px-3 py-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            리포트 저장
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} onChipClick={handleChipClick} />
        ))}

        {/* Streaming dots (separate from message) */}
        {isStreaming && messages[messages.length - 1]?.streaming === false && (
          <div className="flex items-start gap-3">
            <AIAvatar />
            <div className="bg-white border border-warm-200 rounded-2xl rounded-tl-sm px-4 py-3.5 shadow-soft">
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
      <div className="px-6 pb-6 pt-2 shrink-0">
        <div className="flex items-end gap-2 bg-white border border-warm-200 rounded-2xl px-4 py-3 shadow-soft focus-within:border-accent-300 focus-within:ring-2 focus-within:ring-accent-100 transition-all">
          <textarea
            ref={inputRef}
            className="flex-1 resize-none text-sm text-warm-900 placeholder-warm-400 bg-transparent outline-none max-h-36 min-h-[24px] leading-relaxed"
            rows={1}
            placeholder="예: '추석 명절 전후 객단가를 비교해줘'"
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
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all
              ${inputValue.trim() && !isStreaming
                ? 'bg-accent-500 hover:bg-accent-600 text-white shadow-sm'
                : 'bg-warm-100 text-warm-300 cursor-not-allowed'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-warm-400 text-center mt-2">
          Enter로 전송 · Shift+Enter로 줄바꿈
        </p>
      </div>
    </div>
  );
}
