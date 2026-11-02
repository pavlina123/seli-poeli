import React, { useState } from 'react';
import DishForm from './DishForm';
import { formatPrice } from './theme';
import { supabase } from './supabaseClient';

export default function AdminPanel({ user, dishes, onRefresh, onLogout }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editDish, setEditDish] = useState(null);
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  const loadLogs = async () => {
    const { data } = await supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(50);
    setLogs(data || []);
    setShowLogs(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить блюдо?')) return;
    await supabase.from('dishes').delete().eq('id', id);
    await supabase.from('activity_log').insert([{ dish_id: id, action: 'delete', actor_role: user.role, actor_code: user.code }]);
    onRefresh();
  };

  return (
    <div className="min-h-screen bg-[#0a0805] text-white p-3 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Шапка панели */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 bg-white/5 p-4 rounded-2xl md:rounded-3xl border border-white/10">
          <div>
            <h1 className="text-xl md:text-3xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#dc2626]">Панель Админа</h1>
            <p className="text-white/50 text-xs md:text-sm mt-1">Вы: <span className="text-[#fbbf24] font-bold">{user.name}</span></p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={loadLogs} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-white font-bold hover:bg-white/10 hover:border-[#fbbf24] transition flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm flex-1 md:flex-none">
              <i data-lucide="history" className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#fbbf24]"></i> История
            </button>
            <button onClick={onLogout} className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg md:rounded-xl font-bold hover:bg-red-500 hover:text-white transition flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm flex-1 md:flex-none">
              <i data-lucide="log-out" className="w-3.5 h-3.5 md:w-4 md:h-4"></i> Выйти
            </button>
            <button onClick={() => { setEditDish(null); setIsFormOpen(true); }} className="btn-primary px-3 py-2 md:px-5 md:py-2.5 text-xs md:text-sm flex-1 md:flex-none">
              <i data-lucide="plus" className="w-3.5 h-3.5 md:w-4 md:h-4"></i> Добавить
            </button>
          </div>
        </div>

        {/* История */}
        {showLogs && (
          <div className="bg-[#14100a] p-4 rounded-2xl md:rounded-3xl mb-6 border border-[#fbbf24]/30 shadow-lg max-h-60 overflow-y-auto">
            <div className="flex justify-between items-center mb-3 sticky top-0 bg-[#14100a]">
              <h3 className="font-bold text-[#fbbf24] text-sm md:text-base flex items-center gap-2"><i data-lucide="activity" className="w-4 h-4"></i> История действий</h3>
              <button onClick={() => setShowLogs(false)} className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-red-500 transition text-xs">✕</button>
            </div>
            {logs.length === 0 ? <p className="text-white/50 text-sm">Пока нет действий</p> : logs.map(log => (
              <div key={log.id} className="text-[10px] md:text-xs py-2 border-b border-white/5 flex flex-col md:flex-row md:justify-between gap-1">
                <span>
                  <b className={log.actor_role === 'admin' ? 'text-[#fbbf24]' : 'text-blue-400'}>
                    {log.actor_role === 'admin' ? 'Админ' : 'Мобилограф'}
                  </b> 
                  <span className="text-white/70 ml-1">
                    {log.action === 'create' ? 'добавил' : log.action === 'update' ? 'изменил' : 'удалил'} (ID: {log.dish_id})
                  </span>
                </span>
                <span className="text-white/40">{new Date(log.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        {/* Сетка карточек - 2 колонки на мобилке */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          {dishes.map(dish => (
            <div key={dish.id} className="bg-white/5 rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 flex flex-col hover:border-[#fbbf24]/50 transition duration-300">
              {dish.photos && dish.photos.length > 0 ? (
                <img src={dish.photos[0]} alt="" className="w-full h-28 md:h-44 object-cover" />
              ) : (
                <div className="w-full h-28 md:h-44 bg-[#14100a] flex items-center justify-center text-3xl md:text-5xl">🍽️</div>
              )}
              <div className="p-2.5 md:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xs md:text-lg text-white font-display leading-tight line-clamp-2">{dish.title}</h3>
                  <p className="text-white/50 text-[10px] md:text-xs line-clamp-2 mt-1 hidden md:block">{dish.description}</p>
                  <div className="flex justify-between items-center mt-1 md:mt-3">
                    <span className="text-[#fbbf24] font-black text-xs md:text-base">{formatPrice(dish.price)}</span>
                    <span className="text-[9px] md:text-xs text-white/40 bg-white/5 px-1.5 py-0.5 md:px-2 md:py-1 rounded md:rounded-md">{dish.weight}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5 md:gap-2 mt-3 md:mt-5">
                  <button onClick={() => { setEditDish(dish); setIsFormOpen(true); }} className="py-1.5 md:py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[#fbbf24] rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold transition flex items-center justify-center gap-1">
                    <i data-lucide="edit-3" className="w-3 h-3 md:w-3.5 md:h-3.5"></i> Ред.
                  </button>
                  <button onClick={() => handleDelete(dish.id)} className="py-1.5 md:py-2.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold transition flex items-center justify-center gap-1">
                    <i data-lucide="trash-2" className="w-3 h-3 md:w-3.5 md:h-3.5"></i> Удал.
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