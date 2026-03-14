import { useRef } from 'react';

function UploadItem({ label, icon, files, onAdd, onRemove, multiple, accept }) {
  const ref = useRef();

  const handleFiles = (newFiles) => {
    const filtered = Array.from(newFiles).filter(
      f => f.name.endsWith('.xlsx') || f.name.endsWith('.xls')
    );
    if (!filtered.length) return;
    onAdd(multiple ? filtered : [filtered[0]]);
  };

  return (
    <div>
      <button
        onClick={() => ref.current?.click()}
        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-sm
          ${files.length > 0
            ? 'border-accent-200 bg-accent-50 text-accent-700'
            : 'border-warm-200 bg-white text-warm-600 hover:border-warm-300 hover:bg-warm-50'}`}
      >
        <span className="text-base shrink-0">{icon}</span>
        <span className="flex-1 text-left text-xs font-medium">{label}</span>
        {files.length > 0 ? (
          <span className="text-[10px] bg-accent-100 text-accent-600 px-1.5 py-0.5 rounded-full font-medium">{files.length}</span>
        ) : (
          <svg className="w-3.5 h-3.5 text-warm-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        )}
      </button>
      <input
        ref={ref}
        type="file"
        accept={accept}
        {...(multiple ? { multiple: true } : {})}
        style={{ display: 'none' }}
        onChange={e => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ''; }}
      />
      {files.length > 0 && (
        <div className="mt-1.5 space-y-1 pl-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11px] text-warm-500">
              <span className="text-green-500">✓</span>
              <span className="truncate flex-1">{f.name}</span>
              <button onClick={() => onRemove(i)} className="text-warm-300 hover:text-red-400 shrink-0 font-bold text-xs">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({
  shop, user,
  salesFiles, couponFiles, adFiles,
  onAddSales, onAddCoupon, onAddAd,
  onRemoveSales, onRemoveCoupon, onRemoveAd,
  apiKey, onApiKeyChange,
  onAnalyze, isLoading,
  eventSummary,
  onNewChat, onLogout, onChangeShop,
}) {
  const hasFiles = salesFiles.length > 0;

  return (
    <aside className="w-72 h-full flex flex-col bg-white border-r border-warm-200 shrink-0">
      {/* Shop header */}
      <div className="px-4 py-4 border-b border-warm-100">
        <button
          onClick={onChangeShop}
          className="w-full flex items-center gap-2.5 hover:bg-warm-50 rounded-xl px-2 py-2 transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-accent-100 flex items-center justify-center text-base shrink-0">
            {shop?.icon || '🏪'}
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="text-sm font-semibold text-warm-900 truncate">{shop?.name || '쇼핑몰'}</div>
            <div className="text-[10px] text-warm-400">0 Data Sources</div>
          </div>
          <svg className="w-3.5 h-3.5 text-warm-400 group-hover:text-warm-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>

      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {/* New chat button */}
        <button
          onClick={onNewChat}
          className="w-full btn-primary justify-center py-2.5 rounded-xl text-xs"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          새 분석 채팅 시작
        </button>

        {/* Data sources */}
        <div>
          <div className="section-label mb-2">연결된 데이터 소스</div>
          {!hasFiles && (
            <p className="text-xs text-warm-400 px-1 mb-2">업로드된 데이터가 없습니다.</p>
          )}
          <div className="space-y-2">
            <UploadItem
              label="기본 매출 데이터 업로드"
              icon="📋"
              files={salesFiles}
              onAdd={onAddSales}
              onRemove={onRemoveSales}
              multiple={false}
              accept=".xlsx,.xls"
            />
            <UploadItem
              label="이벤트 상세 데이터 업로드"
              icon="🎯"
              files={couponFiles}
              onAdd={onAddCoupon}
              onRemove={onRemoveCoupon}
              multiple={true}
              accept=".xlsx,.xls"
            />
            <UploadItem
              label="광고 성과 데이터 업로드"
              icon="📢"
              files={adFiles}
              onAdd={onAddAd}
              onRemove={onRemoveAd}
              multiple={true}
              accept=".xlsx,.xls"
            />
          </div>

          {hasFiles && (
            <button
              onClick={onAnalyze}
              disabled={isLoading}
              className="w-full mt-3 btn-primary justify-center py-2.5 rounded-xl text-xs disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  분석 중...
                </span>
              ) : '🚀 분석 시작'}
            </button>
          )}
        </div>

        {/* AI settings */}
        <div>
          <div className="section-label mb-2">AI 설정</div>
          <input
            type="password"
            className="input text-xs py-2"
            placeholder="Anthropic API 키 (sk-ant-...)"
            value={apiKey}
            onChange={e => onApiKeyChange(e.target.value)}
          />
          <p className="text-[10px] text-warm-400 mt-1 px-1">자유 질문 AI 분석에 사용됩니다</p>
        </div>

        {/* Event management */}
        {eventSummary && eventSummary.length > 0 && (
          <div>
            <div className="section-label mb-2 flex items-center justify-between">
              <span>마케팅 이벤트 관리</span>
              <svg className="w-3.5 h-3.5 text-warm-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div className="space-y-1">
              {eventSummary.slice(0, 5).map((ev, i) => (
                <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-warm-50 cursor-pointer">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-400 shrink-0" />
                  <span className="text-xs text-warm-700 truncate">{ev.eventName}</span>
                </div>
              ))}
              {eventSummary.length > 5 && (
                <p className="text-[10px] text-warm-400 px-2">+{eventSummary.length - 5}개 더</p>
              )}
            </div>
          </div>
        )}

        {/* Analysis guide */}
        <div>
          <div className="section-label mb-2 flex items-center gap-1">
            분석 가이드
            <span className="inline-block px-1.5 py-0.5 rounded-full bg-accent-100 text-accent-600 text-[9px] font-semibold">PREVIEW</span>
          </div>
          <p className="text-xs text-warm-400 leading-relaxed">
            {hasFiles
              ? '데이터가 로드되었습니다. 채팅창에서 분석을 요청하세요.'
              : '먼저 매출 또는 이벤트 데이터를 업로드해 주세요.'}
          </p>
        </div>
      </div>

      {/* User profile */}
      <div className="px-4 py-3 border-t border-warm-100 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-accent-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {user?.name?.[0] || 'A'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-warm-800 truncate">{user?.name || '관리자'}</div>
          <div className="text-[10px] text-warm-400">{user?.role || 'System Admin'}</div>
        </div>
        <button onClick={onLogout} title="로그아웃" className="btn-ghost p-1.5 text-warm-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
