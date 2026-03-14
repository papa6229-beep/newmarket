import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

function AppRoutes() {
  const [user, setUser] = useState(null);
  const [shops, setShops] = useState(loadShops);
  const [currentShop, setCurrentShop] = useState(null);

  const handleLogin = (u) => setUser(u);

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

  const handleSelectShop = (shop) => setCurrentShop(shop);

  const handleLogout = () => {
    setUser(null);
    setCurrentShop(null);
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route
        path="/shops"
        element={
          user
            ? <ShopSelectPage
                user={user}
                shops={shops}
                onSelectShop={handleSelectShop}
                onAddShop={handleAddShop}
                onDeleteShop={handleDeleteShop}
                onLogout={handleLogout}
              />
            : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/analysis"
        element={
          user && currentShop
            ? <AnalysisPage
                shop={currentShop}
                user={user}
                onLogout={handleLogout}
              />
            : <Navigate to={user ? '/shops' : '/login'} replace />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
