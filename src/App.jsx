import { useState } from 'react';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ShopSelectPage from './pages/ShopSelectPage.jsx';
import AnalysisPage from './pages/AnalysisPage.jsx';

export default function App() {
  const [page, setPage] = useState('landing');  // landing | login | shop | analysis
  const [user, setUser] = useState(null);
  const [shops, setShops] = useState([]);
  const [currentShop, setCurrentShop] = useState(null);

  const handleLogin = (u) => {
    setUser(u);
    setPage('shop');
  };

  const handleAddShop = (shop) => {
    setShops(prev => [...prev, shop]);
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
