import React, { useState, useEffect } from 'react';
import DishForm from './DishForm';
import { formatPrice, categories } from './theme';
import { supabase } from './supabaseClient';

export default function AdminPanel({ user, dishes, onRefresh, onLogout }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editDish, setEditDish] = useState(null);
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [filter, setFilter] = useState('all'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [quickEditId, setQuickEditId] = useState(null);
  const [quickPrice, setQuickPrice] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const { data } = await supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(50);
    setLogs(data || []);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить блюдо навсегда?')) return;
    await supabase.from('dishes').delete().eq('id', id);
    await supabase.from('activity_log').insert([{ dish_id: id, action: 'delete', actor_role: user.role, actor_code: user.code }]);
    loadLogs();
    onRefresh();
  };

  // Скрыть/Показать блюдо
  const toggleVisibility = async (id, currentStatus) => {
    await supabase.from('dishes').update({ is_hidden: !currentStatus }).eq('id', id);
    onRefresh();
  };

  // Быстрое сохранение цены
  const saveQuickPrice = async (id) => {
    if (!quickPrice) return;
    await supabase.from('dishes').update({ price: Number(quickPrice) }).eq('id', id);
    setQuickEditId(null);
    onRefresh();
  };

  // Экспорт в CSV
  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Название,Цена,Вес,Категория,Автор\n"
      + dishes.map(d => `"${d.title}",${d.price},"${d.weight}","${d.category}","${d.created_by}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "menu_export.csv");
    document.body.appendChild(link);
    link.click();
  };

  // Статистика
  const totalDishes = dishes.length;
  const mobDishes = dishes.filter(d => d.created_by === 'mobilograf').length;
  const totalValue = dishes.reduce((sum, d) => sum + Number(d.price), 0);

  // Фильтрация и Поиск
  const filteredDishes = dishes.filter(d => {
    const matchesFilter = filter === 'all' ? true : d.created_by === filter;
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a0805] text-white p-3 md:p-8 pattern-bg">
      <div className="max-w-7xl mx-auto">
        
        {/* Шапка */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 bg-[#14100a]/80 backdrop-blur-xl p-4 md:p-6 rounded-3xl border border-[#fbbf24]/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-tr from-[#fbbf24] to-[#dc2626] flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.4)]">
              <i data-lucide="shield-check" className="w-6 h-6 md:w-8 md:h-8 text-black"></i>
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#dc2626]">Command Center</h1>
              <p className="text-white/50 text-xs md:text-sm mt-1">Админ: <span className="text-[#fbbf24] font-bold">{user.name}</span></p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            <button onClick={exportToCSV} className="px-3 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl font-bold hover:bg-blue-500 hover:text-white transition flex items-center gap-2 text-xs md:text-sm">
              <i data-lucide="download" className="w-4 h-4"></i> Экспорт
            </button>
            <button onClick={() => setShowLogs(!showLogs)} className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-2 text-xs md:text-sm border ${showLogs ? 'bg-[#fbbf24] text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}>
              <i data-lucide="history" className="w-4 h-4"></i> История
            </button>
            <button onClick={onLogout} className="px-3 py-2 bg-red-500/20 text-red-400 rounded-xl font-bold hover:bg-red-500 hover:text-white transition flex items-center gap-2 text-xs md:text-sm">
              <i data-lucide="log-out" className="w-4 h-4"></i> Выйти
            </button>
          </div>
        </div>

        {/* Дашборд со статистикой */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="bg-gradient-to-br from-[#14100a] to-[#0a0805] p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Всего блюд</span>
            <div className="text-2xl md:text-4xl font-black text-[#fbbf24] mt-1">{totalDishes}</div>
          </div>
          <div className="bg-gradient-to-br from-[#14100a] to-[#0a0805] p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Сумма меню</span>
            <div className="text-2xl md:text-3xl font-black text-green-400 mt-1 truncate">{formatPrice(totalValue)}</div>
          </div>
          <div className="bg-gradient-to-br from-[#14100a] to-[#0a0805] p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Мобилограф</span>
            <div className="text-2xl md:text-4xl font-black text-purple-400 mt-1">{mobDishes}</div>
          </div>
          
          {/* Мини-аналитика по категориям */}
          <div className="bg-gradient-to-br from-[#14100a] to-[#0a0805] p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Категории</span>
            <div className="flex gap-1 mt-2 flex-wrap">
              {categories.filter(c => c.id !== 'all').map(c => {
                const count = dishes.filter(d => d.category === c.id).length;
                if (count === 0) return null;
                return (
                  <span key={c.id} className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/70" title={c.name}>
                    {c.emoji} {count}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Логи */}
        {showLogs && (
          <div className="bg-[#14100a] p-4 rounded-2xl mb-6 border border-[#fbbf24]/30 shadow-2xl">
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {logs.map(log => (
                <div key={log.id} className="flex items-center gap-3 text-xs bg-white/5 p-2 rounded-lg">
                  <i data-lucide={log.actor_role === 'admin' ? 'shield' : 'camera'} className={`w-4 h-4 ${log.actor_role === 'admin' ? 'text-[#fbbf24]' : 'text-purple-400'}`}></i>
                  <span className="text-white/70"><b>{log.actor_role === 'admin' ? 'Админ' : 'Мобилограф'}</b> {log.action} (ID: {log.dish_id})</span>
                  <span className="text-white/30 ml-auto">{new Date(log.created_at).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Панель поиска и фильтров */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/3">
            <i data-lucide="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"></i>
            <input 
              type="text" 
              placeholder="Поиск по названию..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#fbbf24] transition"
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filter === 'all' ? 'bg-white/20 text-white' : 'bg-transparent text-white/50 hover:bg-white/5'}`}>Все</button>
            <button onClick={() => setFilter('admin')} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filter === 'admin' ? 'bg-[#fbbf24]/20 text-[#fbbf24] border border-[#fbbf24]/30' : 'bg-transparent text-white/50 hover:bg-white/5'}`}>Мои</button>
            <button onClick={() => setFilter('mobilograf')} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filter === 'mobilograf' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-transparent text-white/50 hover:bg-white/5'}`}>Мобилограф</button>
          </div>

          <button onClick={() => { setEditDish(null); setIsFormOpen(true); }} className="btn-primary w-full md:w-auto px-6 py-2.5 text-sm">
            <i data-lucide="plus" className="w-5 h-5"></i> Добавить
          </button>
        </div>

        {/* Сетка блюд */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {filteredDishes.map(dish => (
            <div key={dish.id} className={`bg-[#14100a] rounded-2xl overflow-hidden border ${dish.is_hidden ? 'border-red-500/50 opacity-60' : 'border-white/10'} flex flex-col hover:border-[#fbbf24]/50 transition duration-300 group relative`}>
              
              {dish.is_hidden && (
                <div className="absolute top-0 left-0 w-full bg-red-500 text-white text-[10px] font-bold text-center py-0.5 z-10">СКРЫТО</div>
              )}

              <div className="relative h-32 md:h-44 overflow-hidden">
                {dish.photos && dish.photos.length > 0 ? (
                  <img src={dish.photos[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center text-3xl">🍽️</div>
                )}
                
                {/* Кнопки быстрого управления (появляются при наведении) */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => toggleVisibility(dish.id, dish.is_hidden)} className="w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-[#fbbf24] hover:text-black transition" title={dish.is_hidden ? 'Показать' : 'Скрыть'}>
                    <i data-lucide={dish.is_hidden ? 'eye-off' : 'eye'} className="w-3.5 h-3.5"></i>
                  </button>
                </div>
              </div>

              <div className="p-2.5 md:p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xs md:text-base text-white line-clamp-1">{dish.title}</h3>
                  
                  {/* Быстрое редактирование цены */}
                  <div className="flex items-center gap-1 mt-1">
                    {quickEditId === dish.id ? (
                      <>
                        <input type="number" value={quickPrice} onChange={e => setQuickPrice(e.target.value)} className="w-16 bg-black border border-[#fbbf24] rounded text-xs px-1 py-0.5 text-white" autoFocus />
                        <button onClick={() => saveQuickPrice(dish.id)} className="text-green-400 hover:text-green-300"><i data-lucide="check" className="w-3 h-3"></i></button>
                      </>
                    ) : (
                      <p onClick={() => { setQuickEditId(dish.id); setQuickPrice(dish.price); }} className="text-[#fbbf24] font-black text-xs md:text-sm cursor-pointer hover:underline decoration-dotted" title="Кликни, чтобы изменить цену">
                        {formatPrice(dish.price)}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-1.5 md:gap-2 mt-3">
                  <button onClick={() => { setEditDish(dish); setIsFormOpen(true); }} className="py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[10px] md:text-xs font-bold transition flex items-center justify-center gap-1">
                    <i data-lucide="edit-2" className="w-3 h-3"></i> Изм.
                  </button>
                  <button onClick={() => handleDelete(dish.id)} className="py-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg text-[10px] md:text-xs font-bold transition flex items-center justify-center gap-1">
                    <i data-lucide="trash" className="w-3 h-3"></i> Удал.
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredDishes.length === 0 && (
          <div className="text-center py-20">
            <i data-lucide="search-x" className="w-16 h-16 text-white/20 mx-auto mb-4"></i>
            <p className="text-white/50">Ничего не найдено по вашему запросу.</p>
          </div>
        )}

      </div>
      <DishForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={() => { onRefresh(); loadLogs(); }} initialData={editDish} code={user.code} />
    </div>
  );
}