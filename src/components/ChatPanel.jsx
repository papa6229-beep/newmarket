import { useState, useRef, useEffect } from 'react';
import { askChatQuestion } from '../utils/anthropicApi.js';

export default function ChatPanel({ analysisData, apiKey }) {
  const [history, setHistory] = useState([]); // [{role, content}]
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, streamingText]);

  const send = async () => {
    const question = input.trim();
    if (!question || isStreaming) return;

    setInput('');
    setIsStreaming(true);
    setStreamingText('');

    const newHistory = [...history, { role: 'user', content: question }];
    setHistory(newHistory);

    try {
      const answer = await askChatQuestion({
        question,
        analysisData,
        history,
        apiKey,
        onChunk: (text) => setStreamingText(text),
      });

      setHistory(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (err) {
      setHistory(prev => [
        ...prev,
        { role: 'assistant', content: `오류: ${err.message}` },
      ]);
    } finally {
      setIsStreaming(false);
      setStreamingText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm mt-8">
      <div className="px-5 py-4 border-b">
        <h2 className="font-semibold text-gray-700">💬 데이터 질문하기</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          분석 데이터를 기반으로 자유롭게 질문해보세요.
          {!apiKey && <span className="text-amber-500"> (API 키가 필요합니다)</span>}
        </p>
      </div>

      {/* Message list */}
      <div className="px-5 py-4 space-y-4 max-h-96 overflow-y-auto">
        {history.length === 0 && !isStreaming && (
          <div className="text-center py-8 text-gray-400 text-sm">
            <p className="text-2xl mb-2">🤔</p>
            <p>예시: &quot;2가지 이벤트 효율 비교해줘&quot;</p>
            <p>예시: &quot;2월 매출 상승 원인 분석해줘&quot;</p>
          </div>
        )}

        {history.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isStreaming && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-xl px-4 py-2.5 text-sm bg-gray-100 text-gray-800 whitespace-pre-wrap">
              {streamingText || <span className="animate-pulse text-gray-400">▋</span>}
              {streamingText && <span className="animate-pulse text-gray-400">▋</span>}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="px-5 py-4 border-t flex gap-2">
        <textarea
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
          rows={2}
          placeholder="분석 데이터에 대해 질문하세요..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isStreaming}
        />
        <button
          onClick={send}
          disabled={isStreaming || !input.trim()}
          className="self-end px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isStreaming ? '⏳' : '전송'}
        </button>
      </div>
    </div>
  );
}
