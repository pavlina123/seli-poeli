import React, { useState } from 'react';
import DishForm from './DishForm';
import { formatPrice } from './theme';

export default function MobilografPanel({ user, dishes, onRefresh, onLogout }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editDish, setEditDish] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить блюдо?')) return;
    await fetch(`http://localhost:3001/api/dishes/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: user.code })
    });
    onRefresh();
  };

  return (
    <div className="min-h-screen bg-[#0a0805] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Шапка панели */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4 bg-white/5 p-4 md:p-6 rounded-3xl border border-white/10">
          <div>
            <h1 className="text-2xl md:text-3xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#dc2626]">
              Панель Мобилографа
            </h1>
            <p className="text-white/50 text-sm mt-1">Вы вошли как: <span className="text-[#fbbf24] font-bold">{user.name}</span></p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            <button onClick={onLogout} className="px-4 py-2.5 bg-red-500/20 text-red-400 rounded-xl font-bold hover:bg-red-500 hover:text-white transition flex items-center gap-2 text-sm">
              <i data-lucide="log-out" className="w-4 h-4"></i> Выйти
            </button>
            <button onClick={() => { setEditDish(null); setIsFormOpen(true); }} className="btn-primary px-5 py-2.5 text-sm">
              <i data-lucide="plus" className="w-4 h-4"></i> Добавить
            </button>
          </div>
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {dishes.map(dish => (
            <div key={dish.id} className="bg-white/5 rounded-3xl overflow-hidden border border-white/10 flex flex-col hover:border-[#fbbf24]/50 transition duration-300">
              {dish.photos && dish.photos.length > 0 ? (
                <img src={dish.photos[0]} alt="" className="w-full h-44 object-cover" />
              ) : (
                <div className="w-full h-44 bg-[#14100a] flex items-center justify-center text-5xl">🍽️</div>
              )}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-white font-display leading-tight">{dish.title}</h3>
                  <p className="text-white/50 text-xs line-clamp-2 mt-1">{dish.description}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[#fbbf24] font-black">{formatPrice(dish.price)}</span>
                    <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded-md">{dish.weight}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-5">
                  <button onClick={() => { setEditDish(dish); setIsFormOpen(true); }} className="py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[#fbbf24] rounded-xl text-xs font-bold transition flex items-center justify-center gap-1">
                    <i data-lucide="edit-3" className="w-3.5 h-3.5"></i> Изменить
                  </button>
                  <button onClick={() => handleDelete(dish.id)} className="py-2.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1">
                    <i data-lucide="trash-2" className="w-3.5 h-3.5"></i> Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DishForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={onRefresh} initialData={editDish} code={user.code} />
    </div>
  );
}