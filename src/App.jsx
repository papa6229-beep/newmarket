import { useState } from 'react';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ShopSelectPage from './pages/ShopSelectPage.jsx';
import AnalysisPage from './pages/AnalysisPage.jsx';

const LS_KEY = 'mib_shops';

function loadShops() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveShops(shops) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(shops));
  } catch {}
}

export default function App() {
  const [page, setPage] = useState('landing');  // landing | login | shop | analysis
  const [user, setUser] = useState(null);
  const [shops, setShops] = useState(loadShops);
  const [currentShop, setCurrentShop] = useState(null);

  const handleLogin = (u) => {
    setUser(u);
    setPage('shop');
  };

  const handleAddShop = (shop) => {
    setShops(prev => {
      const next = [...prev, shop];
      saveShops(next);
      return next;
    });
  };

  const handleDeleteShop = (id) => {
    setShops(prev => {
      const next = prev.filter(s => s.id !== id);
      saveShops(next);
      return next;
    });
  };

  const handleSelectShop = (shop) => {
    setCurrentShop(shop);
    setPage('analysis');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentShop(null);
    setPage('landing');
  };

  const handleChangeShop = () => {
    setCurrentShop(null);
    setPage('shop');
  };

  switch (page) {
    case 'login':
      return <LoginPage onLogin={handleLogin} />;
    case 'shop':
      return (
        <ShopSelectPage
          user={user}
          shops={shops}
          onSelectShop={handleSelectShop}
          onAddShop={handleAddShop}
          onDeleteShop={handleDeleteShop}
          onLogout={handleLogout}
        />
      );
    case 'analysis':
      return (
        <AnalysisPage
          shop={currentShop}
          user={user}
          onLogout={handleLogout}
          onChangeShop={handleChangeShop}
        />
      );
    default:
      return <LandingPage onStart={() => setPage('login')} />;
  }
}
