import { useState } from 'react';

const SHOP_ICONS = ['🏪', '👗', '💄', '🍕', '📱', '🏋️', '☕', '🎮'];

export default function ShopSelectPage({ user, shops, onSelectShop, onAddShop, onLogout }) {
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    const shop = {
      id: Date.now(),
      name,
      icon: SHOP_ICONS[Math.floor(Math.random() * SHOP_ICONS.length)],
      createdAt: new Date().toLocaleDateString('ko-KR'),
    };
    onAddShop(shop);
    onSelectShop(shop);
    setShowModal(false);
    setNewName('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-100 via-warm-50 to-warm-100 flex flex-col">
      {/* Nav */}
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent-500 flex items-center justify-center text-white text-xs font-bold">M</div>
          <span className="font-semibold text-warm-900 text-sm">마케팅 인사이트 뱅크</span>
        </div>
        <button onClick={onLogout} className="btn-ghost text-xs">
          로그아웃
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <h1 className="text-4xl font-bold text-warm-900 mb-3 text-center">
          어떤 쇼핑몰 데이터를 분석할까요?
        </h1>
        <p className="text-warm-400 text-sm mb-12 text-center">
          접속할 워크스페이스를 선택하거나 새 쇼핑몰을 등록하세요.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl">
          {/* Existing shops */}
          {shops.map(shop => (
            <button
              key={shop.id}
              onClick={() => onSelectShop(shop)}
              className="card p-8 flex flex-col items-center gap-3 hover:border-accent-300 hover:shadow-md transition-all text-center group cursor-pointer"
            >
              <div className="text-3xl">{shop.icon}</div>
              <div>
                <div className="font-semibold text-warm-900 group-hover:text-accent-600 transition-colors">{shop.name}</div>
                <div className="text-xs text-warm-400 mt-0.5">생성일: {shop.createdAt}</div>
              </div>
            </button>
          ))}

          {/* Add new */}
          <button
            onClick={() => setShowModal(true)}
            className="p-8 rounded-2xl border-2 border-dashed border-warm-300 flex flex-col items-center gap-3
                       hover:border-accent-400 hover:bg-accent-50 transition-all text-center cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-warm-100 group-hover:bg-accent-100 flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-warm-400 group-hover:text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-accent-500 text-sm">새 쇼핑몰 추가</div>
              <div className="text-xs text-warm-400 mt-0.5">클릭하여 생성</div>
            </div>
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="card p-8 w-full max-w-sm">
            <h3 className="font-semibold text-warm-900 mb-4">새로운 쇼핑몰(워크스페이스) 이름을 입력하세요:</h3>
            <input
              type="text"
              className="input mb-5"
              placeholder="예: 우리 쇼핑몰"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button onClick={handleAdd} className="btn-primary px-6">확인</button>
              <button onClick={() => { setShowModal(false); setNewName(''); }} className="btn-secondary px-5">취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
