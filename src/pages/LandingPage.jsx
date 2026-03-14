export default function LandingPage({ onStart }) {
  const BARS = [38, 52, 45, 68, 57, 72, 64, 88, 78, 95, 83, 100];
  const MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-warm-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent-500 flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <span className="font-bold text-warm-900 text-sm tracking-tight">마케팅 인사이트 뱅크</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-warm-500">
            <span className="hover:text-warm-900 cursor-pointer transition-colors">기능 소개</span>
            <span className="hover:text-warm-900 cursor-pointer transition-colors">사용 사례</span>
            <span className="hover:text-warm-900 cursor-pointer transition-colors">가격 안내</span>
          </div>
          <button onClick={onStart} className="btn-primary text-xs px-5 py-2.5 rounded-xl">
            무료로 시작하기
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 bg-gradient-to-b from-warm-50 to-white">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent-50 border border-accent-200 text-accent-600 text-xs font-semibold mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse inline-block" />
          AI 기반 마케팅 성과 분석 플랫폼
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-warm-900 leading-[1.15] mb-6 max-w-2xl tracking-tight">
          단순한 데이터에서<br />
          <span className="text-accent-500">혁신적인 성장 전략</span>으로
        </h1>

        <p className="text-warm-500 text-base max-w-md leading-relaxed mb-10">
          매출, 이벤트, 광고 데이터를 업로드하면 AI가 즉시 분석하여
          가장 수익성 높은 마케팅 전략을 도출합니다.
        </p>

        <div className="flex items-center gap-3 mb-20">
          <button onClick={onStart} className="btn-primary px-8 py-3.5 text-sm rounded-2xl shadow-sm">
            지금 무료로 시작하기
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
          <button className="btn-secondary px-8 py-3.5 text-sm rounded-2xl">
            데모 영상 보기
          </button>
        </div>

        {/* Dashboard preview */}
        <div className="w-full max-w-2xl card p-6 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs text-warm-400 mb-0.5">총 매출 (YTD)</p>
              <p className="text-2xl font-bold text-warm-900">₩ 2,847,390,000</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-600 text-xs font-semibold">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
              전년 대비 +23.8%
            </div>
          </div>

          <div className="flex items-end gap-1.5 h-32 mb-3">
            {BARS.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end">
                {i === 9 && (
                  <div className="text-[8px] text-accent-500 font-bold text-center mb-1 whitespace-nowrap">▲ 최고</div>
                )}
                <div
                  className={`w-full rounded-t transition-all ${
                    i === 9 ? 'bg-accent-500' : i === BARS.length - 1 || i === BARS.length - 2 ? 'bg-accent-200' : 'bg-warm-200'
                  }`}
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            {MONTHS.map(m => (
              <span key={m} className="text-[9px] text-warm-400 flex-1 text-center">{m}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 px-6 border-y border-warm-100">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { val: '3분', label: '평균 분석 소요 시간' },
            { val: '98%', label: '데이터 처리 정확도' },
            { val: '2,400+', label: '분석 완료 쇼핑몰' },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-bold text-accent-500 mb-1">{s.val}</div>
              <div className="text-xs text-warm-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-warm-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-accent-500 uppercase tracking-widest mb-3">핵심 기능</p>
            <h2 className="text-3xl font-bold text-warm-900 leading-tight">
              쇼핑몰 데이터 분석의 모든 것
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                emoji: '📊',
                title: '매출 KPI 분석',
                desc: '총 매출, 전환율, 객단가, 방문자 수 등 핵심 지표를 자동 계산하고 전년 대비 성장률을 시각화합니다.',
                badge: '자동화',
              },
              {
                emoji: '🎯',
                title: '이벤트 효율 비교',
                desc: '쿠폰 이벤트별 매출 기여도, 신규/기존 회원 비율, ROI를 한눈에 비교하여 최적 전략을 도출합니다.',
                badge: '핵심',
              },
              {
                emoji: '📢',
                title: '광고 ROAS 분석',
                desc: '채널별 광고 비용 대비 수익(ROAS)을 분석하고, 예산 재배분을 위한 구체적 가이드를 제공합니다.',
                badge: 'AI 기반',
              },
            ].map((f, i) => (
              <div key={i} className="card p-7 hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="w-12 h-12 rounded-2xl bg-accent-50 border border-accent-100 flex items-center justify-center text-2xl mb-5">
                  {f.emoji}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-warm-900 text-sm">{f.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-50 text-accent-600 font-medium border border-accent-100">{f.badge}</span>
                </div>
                <p className="text-warm-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upload CTA */}
      <section className="py-24 px-6">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl font-bold text-warm-900 mb-4">엑셀 파일만 있으면 시작 완료</h2>
          <p className="text-warm-400 text-sm mb-10 leading-relaxed">
            복잡한 세팅 없이 매출 데이터 엑셀 파일을 업로드하는 것만으로<br />
            AI가 즉시 분석을 시작합니다.
          </p>
          <div className="card p-8 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-warm-50 border-2 border-dashed border-warm-300 flex items-center justify-center">
              <svg className="w-7 h-7 text-warm-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div className="text-sm text-warm-600 font-medium">파일을 드래그하거나 클릭하여 업로드</div>
            <div className="text-xs text-warm-400">Excel (.xlsx, .xls) 파일 지원</div>
            <button onClick={onStart} className="btn-primary w-full justify-center py-3 rounded-xl">
              분석 시작하기
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-warm-100 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-accent-500 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <span className="font-semibold text-warm-700 text-sm">마케팅 인사이트 뱅크</span>
          </div>
          <div className="flex gap-6 text-xs text-warm-400">
            <span className="cursor-pointer hover:text-warm-600 transition-colors">이용약관</span>
            <span className="cursor-pointer hover:text-warm-600 transition-colors">개인정보처리방침</span>
            <span className="cursor-pointer hover:text-warm-600 transition-colors">고객센터</span>
          </div>
          <p className="text-xs text-warm-300">© 2026 Marketing Insight Bank.</p>
        </div>
      </footer>
    </div>
  );
}
