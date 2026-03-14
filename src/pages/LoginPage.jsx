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
    <div className="min-h-screen flex items-center justify-center bg-warm-50 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent-100/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-warm-200/40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent-500 flex items-center justify-center mx-auto mb-4 shadow-md">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-warm-900">마케팅 인사이트 뱅크</h1>
          <p className="text-sm text-warm-400 mt-1">관리자 계정으로 로그인하세요</p>
        </div>

        {/* Card */}
        <div className="card px-8 py-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-warm-700 mb-1.5 block">아이디</label>
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
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-warm-700 mb-1.5 block">비밀번호</label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <input
                  type="password"
                  className="input pl-10"
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  placeholder="••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2.5 rounded-xl border border-red-100">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  로그인 중...
                </span>
              ) : '로그인'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-warm-100">
            <p className="text-[11px] text-warm-400 text-center">
              테스트 계정: <span className="font-mono text-warm-600">admin</span> / <span className="font-mono text-warm-600">1111</span>
            </p>
          </div>
        </div>

        <p className="text-[11px] text-warm-300 text-center mt-6">
          © 2026 Marketing Insight Bank. All rights reserved.
        </p>
      </div>
    </div>
  );
}
