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
    <div className="min-h-screen bg-[#0a0805] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4 bg-white/5 p-4 md:p-6 rounded-3xl border border-white/10">
          <div>
            <h1 className="text-2xl md:text-3xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#dc2626]">Панель Админа</h1>
            <p className="text-white/50 text-sm mt-1">Вы вошли как: <span className="text-[#fbbf24] font-bold">{user.name}</span></p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            <button onClick={loadLogs} className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 hover:border-[#fbbf24] transition flex items-center gap-2 text-sm">
              <i data-lucide="history" className="w-4 h-4 text-[#fbbf24]"></i> История
            </button>
            <button onClick={onLogout} className="px-4 py-2.5 bg-red-500/20 text-red-400 rounded-xl font-bold hover:bg-red-500 hover:text-white transition flex items-center gap-2 text-sm">
              <i data-lucide="log-out" className="w-4 h-4"></i> Выйти
            </button>
            <button onClick={() => { setEditDish(null); setIsFormOpen(true); }} className="btn-primary px-5 py-2.5 text-sm">
              <i data-lucide="plus" className="w-4 h-4"></i> Добавить
            </button>
          </div>
        </div>

        {showLogs && (
          <div className="bg-[#14100a] p-4 md:p-6 rounded-3xl mb-8 border border-[#fbbf24]/30 shadow-[0_0_30px_rgba(251,191,36,0.1)] max-h-60 overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-[#14100a]">
              <h3 className="font-bold text-[#fbbf24] flex items-center gap-2"><i data-lucide="activity" className="w-4 h-4"></i> История действий</h3>
              <button onClick={() => setShowLogs(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-red-500 transition">✕</button>
            </div>
            {logs.length === 0 ? <p className="text-white/50 text-sm">Пока нет действий</p> : logs.map(log => (
              <div key={log.id} className="text-xs py-2 border-b border-white/5 flex flex-col md:flex-row md:justify-between gap-1">
                <span>
                  <b className={log.actor_role === 'admin' ? 'text-[#fbbf24]' : 'text-blue-400'}>
                    {log.actor_role === 'admin' ? 'Админ' : 'Мобилограф'}
                  </b> 
                  <span className="text-white/70 ml-1">
                    {log.action === 'create' ? 'добавил новое блюдо' : log.action === 'update' ? 'изменил блюдо' : 'удалил блюдо'} (ID: {log.dish_id})
                  </span>
                </span>
                <span className="text-white/40">{new Date(log.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

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
                  <div className="mt-3 text-[10px] text-white/40 flex items-center gap-1">
                    <i data-lucide={dish.created_by === 'admin' ? 'shield' : 'camera'} className="w-3 h-3"></i>
                    Добавил: {dish.created_by === 'admin' ? 'Админ' : 'Мобилограф'}
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