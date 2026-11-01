import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header'; 
import Menu from './Menu';     
import Cart from './Cart';     
import Login from './Login';
import AdminPanel from './AdminPanel';
import MobilografPanel from './MobilografPanel';

// ============================================================
// СТИЛИ, КНОПКИ И АНИМАЦИИ
// ============================================================
function GlobalStyles() {
  return (
    <style>{`
      .glass { background: rgba(20,16,10,.7); backdrop-filter: blur(20px); border: 1px solid rgba(251,191,36,.15); }
      .glass-strong { background: rgba(20,16,10,.95); backdrop-filter: blur(30px); border: 1px solid rgba(251,191,36,.25); }
      .text-gradient-sp { background: linear-gradient(135deg,#fbbf24 0%,#fb923c 50%,#dc2626 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
      
      /* Супер-кнопка */
      .btn-primary {
        background: linear-gradient(135deg, #fbbf24 0%, #fb923c 50%, #dc2626 100%);
        color: #000 !important; /* Черный текст на ярком фоне */
        font-weight: 900;
        border-radius: 1rem;
        transition: all 0.3s ease;
        box-shadow: 0 10px 30px rgba(251, 191, 36, 0.4);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        position: relative;
        overflow: hidden;
        padding: 12px 24px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      /* Блик при наведении */
      .btn-primary::after {
        content: '';
        position: absolute;
        top: 0; left: -100%; width: 50%; height: 100%;
        background: linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent);
        transform: skewX(-20deg);
        transition: left 0.5s ease;
      }
      .btn-primary:hover::after { left: 150%; }
      .btn-primary:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 15px 40px rgba(251, 191, 36, 0.7);
      }
      .btn-primary:active {
        transform: translateY(1px) scale(0.98);
      }

      /* Анимация появления */
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-slide-up {
        animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
      }

      /* Пульсация для плавающей кнопки */
      @keyframes pulse-ring {
        0% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.7); }
        70% { box-shadow: 0 0 0 15px rgba(251, 191, 36, 0); }
        100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0); }
      }
      .pulse-btn {
        animation: pulse-ring 2s infinite;
      }
    `}</style>
  )
}

export default function App() {
  const [user, setUser] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [cart, setCart] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  
  const [currentFilter, setCurrentFilter] = useState('all');
  const [modal, setModal] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCode = localStorage.getItem('sp_code');
    const savedRole = localStorage.getItem('sp_role');
    const savedName = localStorage.getItem('sp_name');
    if (savedCode && savedRole) {
      setUser({ code: savedCode, role: savedRole, name: savedName });
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      if (window.lucide) window.lucide.createIcons()
    }, 100)
    return () => clearTimeout(t)
  }, [cart, currentFilter, modal, showCart, showLogin, dishes]);

  const loadDishes = useCallback(() => {
    setLoading(true);
    fetch('http://localhost:3001/api/dishes')
      .then(res => res.json())
      .then(data => {
        setDishes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка загрузки блюд:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadDishes();
  }, [loadDishes]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('sp_code', userData.code);
    localStorage.setItem('sp_role', userData.role);
    localStorage.setItem('sp_name', userData.name);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sp_code');
    localStorage.removeItem('sp_role');
    localStorage.removeItem('sp_name');
    window.location.reload(); 
  };

  const isInCart = (id) => cart.some(i => i.id === id);
  const onAdd = (id) => {
    const p = dishes.find(d => d.id === id);
    if (!p) return;
    setCart(prev => {
      const ex = prev.find(i => i.id === id);
      if (ex) return prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...p, qty: 1 }];
    });
  };
  const changeQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  };
  const clearCart = () => {
    if (window.confirm('Очистить корзину?')) setCart([]);
  };

  const cartTotal = cart.reduce((s, i) => s + Number(i.price) * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  if (user?.role === 'admin') {
    return <AdminPanel user={user} dishes={dishes} onRefresh={loadDishes} onLogout={handleLogout} />;
  }

  if (user?.role === 'mobilograf') {
    return <MobilografPanel user={user} dishes={dishes} onRefresh={loadDishes} onLogout={handleLogout} />;
  }

  return (
    <div className="bg-[#0a0805] min-h-screen text-[#fffbf0] overflow-hidden relative">
      <GlobalStyles />
      
      <Header 
        cartCount={cartCount} 
        onCartClick={() => setShowCart(true)} 
        onLoginClick={() => setShowLogin(true)} 
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="w-16 h-16 border-4 border-[#fbbf24] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#fbbf24] font-bold text-lg animate-pulse">Загружаем меню...</p>
        </div>
      ) : (
        <div className="animate-slide-up">
          <Menu
            products={dishes}
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            isInCart={isInCart}
            onAdd={onAdd}
            onOpen={(p, src) => setModal({ product: p, source: src })}
            onGoCart={() => setShowCart(true)}
          />
        </div>
      )}

      <Cart
        open={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        total={cartTotal}
        count={cartCount}
        onChangeQty={changeQty}
        onClear={clearCart}
        modal={modal}
        onCloseModal={() => setModal(null)}
      />

      <Login 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onLogin={handleLogin} 
      />

      {/* Плавающая кнопка входа с пульсацией */}
      {!showLogin && (
        <button 
          onClick={() => setShowLogin(true)}
          className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#fbbf24] to-[#dc2626] hover:scale-110 active:scale-95 transition-all duration-300 pulse-btn"
          title="Вход для персонала"
        >
          <i data-lucide="lock" className="w-6 h-6 text-black"></i>
        </button>
      )}
    </div>
  );
}