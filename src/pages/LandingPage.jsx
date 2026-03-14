export default function LandingPage({ onStart }) {
  const BAR_HEIGHTS = [30, 45, 62, 38, 55, 78, 52, 70, 95, 68, 83, 100];
  const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-warm-50/90 backdrop-blur border-b border-warm-200">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent-500 flex items-center justify-center text-white text-xs font-bold">M</div>
            <span className="font-semibold text-warm-900 text-sm">마케팅 인사이트 뱅크</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-warm-600">
            <span className="hover:text-warm-900 cursor-pointer transition-colors">주요 기능</span>
            <span className="hover:text-warm-900 cursor-pointer transition-colors">데모 보기</span>
            <span className="hover:text-warm-900 cursor-pointer transition-colors">요금제</span>
          </div>
          <button onClick={onStart} className="btn-primary text-xs px-4 py-2">
            데이터 바로 접속 →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-20 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-50 border border-accent-200 text-accent-600 text-xs font-medium mb-8">
          AI 기반 최고급 리테일 분석 솔루션
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-warm-900 leading-tight mb-4 max-w-2xl">
          단순한 데이터에서<br />
          <span className="text-accent-500">혁신적인 성장 전략</span>으로
        </h1>
        <p className="text-warm-500 text-base max-w-lg leading-relaxed mb-10">
          마케팅 인사이트 뱅크는 글로벌 수준의 강력한 AI를 통해 분산된 매출 데이터를
          하나로 통합하고, 가장 수익성 높은 마케팅 전략을 실시간으로 도출합니다.
        </p>
        <div className="flex items-center gap-3 mb-16">
          <button onClick={onStart} className="btn-primary px-7 py-3 text-sm rounded-2xl">
            지금 무료로 시작하기 →
          </button>
          <button className="btn-secondary px-7 py-3 text-sm rounded-2xl">
            데모 영상 시청
          </button>
        </div>

        {/* Chart mockup */}
        <div className="card p-8 w-full max-w-xl">
          <div className="flex items-end gap-1.5 h-36 mb-3">
            {BAR_HEIGHTS.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                {i === 8 && (
                  <div className="text-[9px] text-accent-500 font-bold whitespace-nowrap bg-accent-50 px-1.5 py-0.5 rounded-full border border-accent-200">
                    +418% 달성
                  </div>
                )}
                <div
                  className={`w-full rounded-t-md transition-all ${i === 8 ? 'bg-accent-400' : i < 8 ? 'bg-warm-200' : 'bg-warm-300'}`}
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-[10px] text-warm-400">
            {MONTHS.map(m => <span key={m}>{m}</span>)}
          </div>
        </div>
      </section>

      {/* Feature: 즉시 분석 */}
      <section className="bg-white border-t border-warm-100 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-warm-900 mb-4">복잡한 연동 없이 즉시 분석</h2>
          <p className="text-warm-500 text-sm leading-relaxed mb-12">
            최신 POS 시스템 동기화부터 기존 엑셀 리포트 등록까지,<br />
            마베터의 업무 환경에 맞는 유연한 데이터 통합을 지원합니다.
          </p>
          <div className="card p-10 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-accent-50 border border-accent-200 flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <h3 className="font-semibold text-warm-900 mb-2">분석할 데이터를 드래그 앤 드롭 하세요</h3>
            <p className="text-xs text-warm-400 leading-relaxed mb-5">
              Excel (.xlsx) 또는 CSV 파일을 지원합니다. 모든 텍스트 및 매출 항목은<br />256-bit AES 암호화되어 안전하게 저장됩니다.
            </p>
            <button onClick={onStart} className="btn-primary w-full justify-center py-3">
              파일 찾아보기
            </button>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="py-24 px-6 bg-warm-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-50 border border-accent-100 text-accent-500 text-[11px] font-semibold uppercase tracking-wider mb-4">
              Core Intelligence
            </div>
            <h2 className="text-3xl font-bold text-warm-900">리테일 최적화를 위한 핵심 모듈</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: '📈',
                title: '다차원 실적 대시보드',
                desc: '고객 마구좌성, 요일별 매출 효율, 카테고리별 성과 등 방대한 데이터를 직관적인 시각화 그래프로 즉시 분석합니다. 복잡한 수치가 단순하고 명확한 인사이트로 변환됩니다.',
              },
              {
                icon: '🎯',
                title: '캠페인 기여도 및 ROI',
                desc: '단순한 쿠폰 발급을 넘어 구체 전환율(CVR)과 마진 기여도를 추적합니다. 어떤 채널의 마케팅이 단기적 캠페인 창출에 기여했는지 확인하세요.',
              },
              {
                icon: '🤖',
                title: '머신러닝 수요 예측',
                desc: '날씨, 요일, 과거 3개년이 한때 매달 패턴을 종합하여 다음 달의 재고 수요와 가격 탄력성을 일별로 다각화합니다. 한 발 빠른 마사경이 가능합니다.',
              },
            ].map((f, i) => (
              <div key={i} className="card p-7 hover:shadow-md transition-shadow">
                <div className="text-2xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-warm-900 mb-2 text-base">{f.title}</h3>
                <p className="text-warm-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-warm-100 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-accent-500 flex items-center justify-center text-white text-xs font-bold">M</div>
            <span className="font-semibold text-warm-800 text-sm">마케팅 인사이트 뱅크</span>
          </div>
          <div className="flex gap-6 text-xs text-warm-400">
            <span className="cursor-pointer hover:text-warm-600">이용약관</span>
            <span className="cursor-pointer hover:text-warm-600">개인정보처리방침</span>
            <span className="cursor-pointer hover:text-warm-600">고객센터</span>
          </div>
          <p className="text-xs text-warm-300">© 2026 Marketing Insight Bank. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
