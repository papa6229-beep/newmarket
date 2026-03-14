import { useRef } from 'react';

function UploadItem({ label, icon, files, onAdd, onRemove, multiple, accept, description }) {
  const ref = useRef();

  const handleFiles = (newFiles) => {
    const filtered = Array.from(newFiles).filter(
      f => f.name.endsWith('.xlsx') || f.name.endsWith('.xls')
    );
    if (!filtered.length) return;
    onAdd(multiple ? filtered : [filtered[0]]);
  };

  const hasFiles = files.length > 0;

  return (
    <div className="space-y-1.5">
      <button
        onClick={() => ref.current?.click()}
        className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all text-sm
          ${hasFiles
            ? 'border-accent-200 bg-accent-50 text-accent-700'
            : 'border-warm-200 bg-warm-50 text-warm-600 hover:border-warm-300 hover:bg-warm-100'}`}
      >
        <span className="text-lg shrink-0">{icon}</span>
        <div className="flex-1 text-left">
          <div className="text-xs font-semibold leading-tight">{label}</div>
          {description && !hasFiles && (
            <div className="text-[10px] text-warm-400 mt-0.5">{description}</div>
          )}
          {hasFiles && (
            <div className="text-[10px] text-accent-500 mt-0.5">{files.length}개 파일 업로드됨</div>
          )}
        </div>
        {hasFiles ? (
          <span className="w-5 h-5 rounded-full bg-accent-500 flex items-center justify-center shrink-0">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </span>
        ) : (
          <svg className="w-4 h-4 text-warm-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
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
      {hasFiles && (
        <div className="space-y-1 px-1">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-warm-500 py-0.5">
              <span className="text-green-500 shrink-0">✓</span>
              <span className="truncate flex-1 text-warm-600">{f.name}</span>
              <button onClick={() => onRemove(i)} className="text-warm-300 hover:text-red-400 shrink-0 transition-colors">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
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
  const totalFiles = salesFiles.length + couponFiles.length + adFiles.length;

  return (
    <aside className="w-72 h-full flex flex-col bg-white border-r border-warm-200 shrink-0">
      {/* Brand header */}
      <div className="px-4 pt-4 pb-3 border-b border-warm-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-accent-500 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
          <span className="font-bold text-warm-900 text-xs tracking-tight">마케팅 인사이트 뱅크</span>
        </div>

        {/* Shop selector */}
        <button
          onClick={onChangeShop}
          className="w-full flex items-center gap-2.5 hover:bg-warm-50 rounded-xl px-2.5 py-2.5 transition-colors group border border-warm-100 hover:border-warm-200"
        >
          <div className="w-8 h-8 rounded-lg bg-accent-50 border border-accent-100 flex items-center justify-center text-base shrink-0">
            {shop?.icon || '🏪'}
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="text-xs font-semibold text-warm-900 truncate">{shop?.name || '쇼핑몰'}</div>
            <div className="text-[10px] text-warm-400">{totalFiles > 0 ? `${totalFiles}개 파일 연결됨` : '데이터 없음'}</div>
          </div>
          <svg className="w-3.5 h-3.5 text-warm-400 group-hover:text-warm-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {/* New chat */}
        <button
          onClick={onNewChat}
          className="w-full btn-secondary justify-center py-2.5 rounded-xl text-xs gap-2"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          새 분석 채팅
        </button>

        {/* Data sources */}
        <div>
          <div className="section-label mb-2.5">데이터 업로드</div>
          <div className="space-y-2">
            <UploadItem
              label="기본 매출 데이터"
              description="필수 · Excel 파일"
              icon="📋"
              files={salesFiles}
              onAdd={onAddSales}
              onRemove={onRemoveSales}
              multiple={false}
              accept=".xlsx,.xls"
            />
            <UploadItem
              label="이벤트 상세 데이터"
              description="선택 · 복수 파일 가능"
              icon="🎯"
              files={couponFiles}
              onAdd={onAddCoupon}
              onRemove={onRemoveCoupon}
              multiple={true}
              accept=".xlsx,.xls"
            />
            <UploadItem
              label="광고 성과 데이터"
              description="선택 · 복수 파일 가능"
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
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                  </svg>
                  분석 시작
                </>
              )}
            </button>
          )}
        </div>

        {/* AI Settings */}
        <div>
          <div className="section-label mb-2.5">AI 설정</div>
          <div className="space-y-1.5">
            <input
              type="password"
              className="input text-xs py-2.5"
              placeholder="Anthropic API 키 입력 (sk-ant-...)"
              value={apiKey}
              onChange={e => onApiKeyChange(e.target.value)}
            />
            <p className="text-[10px] text-warm-400 px-1 leading-relaxed">
              자유 질문 AI 분석에 사용됩니다. 키는 브라우저에만 저장됩니다.
            </p>
          </div>
        </div>

        {/* Event list */}
        {eventSummary && eventSummary.length > 0 && (
          <div>
            <div className="section-label mb-2.5">연결된 이벤트</div>
            <div className="space-y-0.5">
              {eventSummary.slice(0, 6).map((ev, i) => (
                <div key={i} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-warm-50 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-400 shrink-0" />
                  <span className="text-xs text-warm-700 truncate">{ev.eventName}</span>
                </div>
              ))}
              {eventSummary.length > 6 && (
                <p className="text-[10px] text-warm-400 px-2.5 py-1">+{eventSummary.length - 6}개 더</p>
              )}
            </div>
          </div>
        )}
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
        <button
          onClick={onLogout}
          title="로그아웃"
          className="btn-ghost p-1.5 text-warm-400 hover:text-warm-700"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
