import React, { useState } from 'react';
import DishForm from './DishForm';
import { formatPrice } from './theme';
import { supabase } from './supabaseClient';

export default function MobilografPanel({ user, dishes, onRefresh, onLogout }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editDish, setEditDish] = useState(null);
  const [tab, setTab] = useState('all'); // 'all' или 'drafts'
  
  // Берем только блюда, созданные мобилографом
  const myDishes = dishes.filter(d => d.created_by === 'mobilograf'); 
  
  // Фильтруем по вкладке
  const displayDishes = tab === 'all' 
    ? myDishes 
    : myDishes.filter(d => d.is_published === false);

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить блюдо?')) return;
    await supabase.from('dishes').delete().eq('id', id);
    await supabase.from('activity_log').insert([{ dish_id: id, action: 'delete', actor_role: user.role, actor_code: user.code }]);
    onRefresh();
  };

  const publishDish = async (id) => {
    await supabase.from('dishes').update({ is_published: true }).eq('id', id);
    onRefresh();
  };

  return (
    <div className="min-h-screen bg-[#0a0805] text-white p-3 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Профиль Мобилографа */}
        <div className="flex items-center justify-between mb-6 bg-gradient-to-r from-purple-900/40 to-[#14100a] p-5 md:p-8 rounded-3xl border border-purple-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)] border-2 border-white/20">
              <i data-lucide="camera" className="w-7 h-7 md:w-10 md:h-10 text-white"></i>
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black font-display text-white">Твоя мастерская</h1>
              <p className="text-purple-300 text-xs md:text-sm mt-1 flex items-center gap-1">
                <i data-lucide="sparkles" className="w-3 h-3"></i> Мобилограф: {user.name}
              </p>
            </div>
          </div>

          <button onClick={onLogout} className="relative z-10 p-2.5 md:p-3 bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 rounded-full transition border border-white/10">
            <i data-lucide="log-out" className="w-5 h-5"></i>
          </button>
        </div>

        {/* Кнопка создания */}
        <button 
          onClick={() => { setEditDish(null); setIsFormOpen(true); }}
          className="w-full mb-6 py-4 rounded-2xl border-2 border-dashed border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/10 transition flex flex-col items-center justify-center gap-2 group"
        >
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition">
            <i data-lucide="plus" className="w-6 h-6 text-purple-400"></i>
          </div>
          <span className="font-bold text-purple-300">Снять и добавить блюдо</span>
        </button>

        {/* Вкладки */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab('all')} className={`flex-1 py-2 rounded-xl text-xs md:text-sm font-bold transition ${tab === 'all' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
            Мои блюда ({myDishes.length})
          </button>
          <button onClick={() => setTab('drafts')} className={`flex-1 py-2 rounded-xl text-xs md:text-sm font-bold transition ${tab === 'drafts' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
            Черновики ({myDishes.filter(d => d.is_published === false).length})
          </button>
        </div>

        {/* СЕТКА БЛЮД (ПО 2 В РЯД НА ТЕЛЕФОНЕ) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {displayDishes.map(dish => (
            <div key={dish.id} className={`relative group rounded-2xl overflow-hidden bg-[#14100a] border ${dish.is_published === false ? 'border-orange-500/50' : 'border-white/10'} flex flex-col`}>
              
              {dish.is_published === false && (
                <div className="absolute top-0 left-0 w-full bg-orange-500 text-black text-[9px] md:text-[10px] font-bold text-center py-0.5 z-10">ЧЕРНОВИК</div>
              )}

              {/* Фото */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                {dish.photos && dish.photos.length > 0 ? (
                  <img src={dish.photos[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center text-3xl md:text-4xl">🍽️</div>
                )}
                
                {/* Градиент для текста */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                
                <div className="absolute bottom-2 left-2 right-2">
                  <h3 className="font-bold text-xs md:text-sm text-white leading-tight line-clamp-2">{dish.title}</h3>
                  <p className="text-purple-400 font-black text-[10px] md:text-xs mt-0.5">{formatPrice(dish.price)}</p>
                </div>
              </div>
              
              {/* Кнопки управления */}
              <div className="p-2 flex flex-col gap-1.5 mt-auto bg-[#14100a]">
                {dish.is_published === false && (
                  <button onClick={() => publishDish(dish.id)} className="w-full py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded-lg text-[10px] md:text-xs font-bold flex items-center justify-center gap-1 transition">
                    <i data-lucide="check-circle" className="w-3 h-3"></i> Опубликовать
                  </button>
                )}
                <div className="grid grid-cols-2 gap-1.5">
                  <button onClick={() => { setEditDish(dish); setIsFormOpen(true); }} className="py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[10px] md:text-xs font-bold flex items-center justify-center gap-1 transition">
                    <i data-lucide="edit-2" className="w-3 h-3"></i> Ред.
                  </button>
                  <button onClick={() => handleDelete(dish.id)} className="py-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg text-[10px] md:text-xs font-bold flex items-center justify-center gap-1 transition">
                    <i data-lucide="trash" className="w-3 h-3"></i> Удал.
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayDishes.length === 0 && (
          <div className="text-center py-20">
            <i data-lucide="image-off" className="w-16 h-16 text-white/20 mx-auto mb-4"></i>
            <p className="text-white/50">{tab === 'drafts' ? 'У тебя нет черновиков.' : 'Ты пока не добавил ни одного блюда.'}</p>
          </div>
        )}

      </div>
      <DishForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={onRefresh} initialData={editDish} code={user.code} />
    </div>
  );
}