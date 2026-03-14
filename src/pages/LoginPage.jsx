import { useState } from 'react';

export default function LoginPage({ onLogin }) {
  const [id, setId] = useState('admin');
  const [pw, setPw] = useState('1111');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!id.trim() || !pw.trim()) { setError('아이디와 비밀번호를 입력해주세요.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    if (id === 'admin' && pw === '1111') {
      onLogin({ id, name: '관리자', role: 'System Admin' });
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-warm-100 via-warm-50 to-warm-100 px-4">
      <div className="card w-full max-w-sm p-10 flex flex-col items-center gap-1">
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-700 flex items-center justify-center mb-4 shadow-md">
          <span className="text-white text-2xl">📊</span>
        </div>

        <h1 className="text-xl font-bold text-warm-900 mb-1">인사이트 뱅크 관리자</h1>
        <p className="text-xs text-warm-400 mb-8">최고급 리테일 분석 AI 허브에 로그인하세요</p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="text-xs font-medium text-warm-700 mb-1.5 block">아이디</label>
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <input
                type="text"
                className="input pl-10"
                value={id}
                onChange={e => setId(e.target.value)}
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-warm-700 mb-1.5 block">비밀번호</label>
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <input
                type="password"
                className="input pl-10"
                value={pw}
                onChange={e => setPw(e.target.value)}
                placeholder="••••"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg border border-red-100">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3 mt-2 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                접속 중...
              </span>
            ) : (
              '워크스페이스 접속 →'
            )}
          </button>
        </form>

        <p className="text-[11px] text-warm-300 mt-6">© 2026 Marketing Insight Bank. All rights reserved.</p>
      </div>
    </div>
  );
}
