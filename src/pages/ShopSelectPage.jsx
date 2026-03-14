import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SHOP_ICONS = ['🏪', '👗', '💄', '🍕', '📱', '🏋️', '☕', '🎮', '🌸', '🎁'];
const SHOP_COLORS = [
  'bg-orange-50 border-orange-200',
  'bg-pink-50 border-pink-200',
  'bg-purple-50 border-purple-200',
  'bg-blue-50 border-blue-200',
  'bg-green-50 border-green-200',
  'bg-yellow-50 border-yellow-200',
  'bg-accent-50 border-accent-200',
  'bg-teal-50 border-teal-200',
];

export default function ShopSelectPage({ user, shops, onSelectShop, onAddShop, onDeleteShop, onLogout }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    const idx = shops.length % SHOP_ICONS.length;
    const shop = {
      id: Date.now(),
      name,
      icon: SHOP_ICONS[idx],
      colorClass: SHOP_COLORS[idx % SHOP_COLORS.length],
      createdAt: new Date().toLocaleDateString('ko-KR'),
    };
    onAddShop(shop);
    onSelectShop(shop);
    setShowModal(false);
    setNewName('');
    navigate('/analysis');
  };

  const handleSelectShop = (shop) => {
    onSelectShop(shop);
    navigate('/analysis');
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onDeleteShop(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-warm-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent-500 flex items-center justify-center shadow-sm shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <span className="font-bold text-warm-900 text-sm tracking-tight">마케팅 인사이트 뱅크</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warm-50 border border-warm-200">
              <div className="w-5 h-5 rounded-full bg-accent-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                {user?.name?.[0] || 'A'}
              </div>
              <span className="text-xs font-medium text-warm-700">{user?.name || '관리자'}</span>
            </div>
            <button onClick={handleLogout} className="btn-ghost text-xs px-3 py-1.5">
              로그아웃
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center px-6 py-16">
        <div className="w-full max-w-4xl">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-warm-900 mb-2">
              어떤 쇼핑몰 데이터를 분석할까요?
            </h1>
            <p className="text-warm-400 text-sm">
              분석할 워크스페이스를 선택하거나 새 쇼핑몰을 추가하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {shops.map(shop => (
              <div key={shop.id} className="relative group">
                <button
                  onClick={() => handleSelectShop(shop)}
                  className="w-full card p-7 flex flex-col items-start gap-4 hover:border-accent-300 hover:shadow-md transition-all text-left"
                >
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl shrink-0 ${shop.colorClass || 'bg-accent-50 border-accent-200'}`}>
                    {shop.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-warm-900 text-sm truncate mb-0.5">{shop.name}</div>
                    <div className="text-xs text-warm-400">생성: {shop.createdAt}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-accent-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    분석 시작
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteTarget(shop); }}
                  className="absolute top-3 right-3 w-6 h-6 rounded-md bg-white border border-warm-200 text-warm-400 hover:text-red-400 hover:border-red-200 hover:bg-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {/* Add new */}
            <button
              onClick={() => setShowModal(true)}
              className="p-7 rounded-2xl border-2 border-dashed border-warm-200 flex flex-col items-start gap-4
                         hover:border-accent-400 hover:bg-accent-50/50 transition-all group min-h-[156px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-warm-100 group-hover:bg-accent-100 flex items-center justify-center transition-colors shrink-0">
                <svg className="w-5 h-5 text-warm-400 group-hover:text-accent-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-warm-500 group-hover:text-accent-600 text-sm transition-colors">새 쇼핑몰 추가</div>
                <div className="text-xs text-warm-400 mt-0.5">클릭하여 워크스페이스 생성</div>
              </div>
            </button>
          </div>

          {shops.length === 0 && (
            <p className="text-center text-sm text-warm-400 mt-8">
              등록된 쇼핑몰이 없습니다. 새 쇼핑몰을 추가해 분석을 시작하세요.
            </p>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={() => { setShowModal(false); setNewName(''); }}>
          <div className="card p-8 w-full max-w-sm shadow-modal" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-warm-900 text-base mb-1">새 쇼핑몰 추가</h3>
            <p className="text-xs text-warm-400 mb-5">쇼핑몰 이름을 입력하세요.</p>
            <input
              type="text"
              className="input mb-4"
              placeholder="예: 우리 온라인 쇼핑몰"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') { setShowModal(false); setNewName(''); } }}
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={handleAdd} disabled={!newName.trim()} className="btn-primary flex-1 justify-center py-2.5 disabled:opacity-50 disabled:cursor-not-allowed">
                추가 및 시작
              </button>
              <button onClick={() => { setShowModal(false); setNewName(''); }} className="btn-secondary px-5 py-2.5">
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={() => setDeleteTarget(null)}>
          <div className="card p-8 w-full max-w-sm shadow-modal" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-warm-900 text-base mb-2">쇼핑몰 삭제</h3>
            <p className="text-sm text-warm-500 mb-6">
              <strong className="text-warm-800">"{deleteTarget.name}"</strong>을 삭제하시겠습니까?<br />
              <span className="text-xs text-warm-400">이 작업은 되돌릴 수 없습니다.</span>
            </p>
            <div className="flex gap-2">
              <button onClick={handleDeleteConfirm} className="flex-1 justify-center py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors flex items-center">
                삭제
              </button>
              <button onClick={() => setDeleteTarget(null)} className="btn-secondary px-5 py-2.5 flex-1 justify-center">
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
