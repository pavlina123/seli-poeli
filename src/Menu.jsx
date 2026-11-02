import React from 'react';
import { categories, waLink, formatPrice } from './theme';

export default function Menu({ products = [], currentFilter, setCurrentFilter, isInCart, onAdd, onOpen, onGoCart }) {
  const filtered = currentFilter === 'all' 
    ? products 
    : products.filter(p => p.category === currentFilter);

  const sideFiltered = products; 

  return (
    <section id="menu" className="py-8 md:py-20 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      
      {/* Заголовок */}
      <div className="text-center space-y-3 md:space-y-4 mb-6 md:mb-12">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass border border-[#fbbf24]/30 text-[#fbbf24] text-[10px] md:text-xs font-bold uppercase tracking-wider">
          <i data-lucide="flame" className="w-3.5 h-3.5"></i>
          <span>Наше меню</span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-display">
          Что <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#dc2626]">готовим</span> 🔥
        </h2>
        <p className="text-[#fffbf0]/50 text-xs md:text-base px-4">Выберите категорию и добавьте блюда в корзину</p>
      </div>

      {/* Категории (Табы) */}
      <div className="mb-6 md:mb-12 -mx-2 md:mx-0">
        <div className="flex md:flex-wrap md:justify-center gap-2 md:gap-3 px-2 md:px-0 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setCurrentFilter(c.id)}
              className={`whitespace-nowrap px-4 py-2 md:px-5 md:py-3 rounded-xl font-bold text-xs md:text-sm transition-all duration-300 ${
                currentFilter === c.id 
                  ? 'bg-gradient-to-r from-[#fbbf24] to-[#dc2626] text-black shadow-[0_5px_20px_rgba(251,191,36,0.4)] scale-105' 
                  : 'bg-white/5 text-white/70 border border-white/10 hover:border-[#fbbf24] hover:text-white'
              }`}
            >
              {c.emoji} {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Сетка с карточками блюд */}
        <div className="lg:col-span-8 xl:col-span-9">
          {/* ГЛАВНОЕ ИЗМЕНЕНИЕ: grid-cols-2 для мобилки, sm:grid-cols-2 md:grid-cols-3 */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4 animate-bounce">🍽️</div>
                <p className="text-[#fffbf0]/50 font-bold text-lg">В этой категории пока пусто...</p>
              </div>
            ) : filtered.map((p, index) => {
              const emoji = categories.find(c => c.id === p.category)?.emoji || '🍽️';
              const inCart = isInCart ? isInCart(p.id) : false;
              const image = p.photos && p.photos.length > 0 ? p.photos[0] : null;

              return (
                <div 
                  key={p.id} 
                  className="glass rounded-2xl md:rounded-3xl overflow-hidden group flex flex-col justify-between border border-white/10 hover:border-[#fbbf24]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(251,191,36,0.2)]"
                  style={{ animation: `slideUp 0.5s ease-out ${index * 0.05}s forwards`, opacity: 0 }}
                >
                  <div>
                    {/* Фото */}
                    <div className="relative overflow-hidden aspect-[4/3] cursor-pointer" onClick={() => onOpen(p, 'product')}>
                      {image ? (
                        <img src={image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#14100a] to-[#0a0805] flex items-center justify-center text-4xl md:text-5xl">
                          {emoji}
                        </div>
                      )}
                      
                      {/* Бейджики на фото */}
                      <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-black/60 backdrop-blur-md rounded-full w-7 h-7 md:w-10 md:h-10 flex items-center justify-center text-sm md:text-xl border border-white/10 shadow-lg">
                        {emoji}
                      </div>
                      <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-gradient-to-r from-[#fbbf24] to-[#fb923c] text-black font-black px-2 py-1 md:px-4 md:py-1.5 rounded-lg md:rounded-full text-xs md:text-sm shadow-lg transform group-hover:scale-110 transition">
                        {formatPrice(p.price)}
                      </div>
                      <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 bg-black/70 backdrop-blur-md text-white font-bold px-1.5 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-full text-[9px] md:text-xs flex items-center gap-1 border border-white/10">
                        <i data-lucide="scale" className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-[#fbbf24]"></i>
                        <span>{p.weight}</span>
                      </div>
                    </div>
                    
                    {/* Описание */}
                    <div className="p-2 md:p-5 space-y-1 md:space-y-2">
                      <h3 className="text-xs md:text-lg font-black text-white leading-tight font-display group-hover:text-[#fbbf24] transition-colors line-clamp-2">{p.title}</h3>
                      <p className="text-[10px] md:text-sm text-[#fffbf0]/60 line-clamp-2 hidden md:block">{p.description}</p>
                    </div>
                  </div>
                  
                  {/* Кнопки */}
                  <div className="p-2 md:p-5 pt-0 space-y-1.5 md:space-y-2">
                    {inCart ? (
                      <button onClick={onGoCart} className="w-full py-2 md:py-3.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-extrabold rounded-lg md:rounded-xl transition-all duration-300 flex items-center justify-center gap-1 md:gap-2 shadow-[0_10px_20px_rgba(34,197,94,0.3)] hover:scale-105 text-[10px] md:text-base">
                        <i data-lucide="shopping-bag" className="w-3 h-3 md:w-5 md:h-5"></i>
                        <span>В корзине</span>
                      </button>
                    ) : (
                      <button onClick={() => onAdd(p.id, 'product')} className="btn-primary w-full py-2 md:py-3.5 text-[10px] md:text-base">
                        <i data-lucide="plus" className="w-3 h-3 md:w-5 md:h-5"></i>
                        <span>В корзину</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Сайдбар (Справа) - только на ПК */}
        <aside className="lg:col-span-4 xl:col-span-3 hidden lg:block">
          <div className="glass-strong rounded-3xl border border-[#fbbf24]/20 overflow-hidden sticky top-24">
            <div className="p-4 border-b border-[#fbbf24]/20 bg-gradient-to-r from-[#fbbf24]/10 to-[#dc2626]/10">
              <h3 className="font-black text-base font-display text-[#fbbf24]">Также в наличии</h3>
            </div>
            <div className="p-4 space-y-2 max-h-[55vh] overflow-y-auto">
              {sideFiltered.slice(0, 10).map(p => {
                const emoji = categories.find(c => c.id === p.category)?.emoji || '🍽️';
                return (
                  <div key={p.id} className="bg-white/5 rounded-xl p-2.5 border border-white/5 hover:border-[#fbbf24]/40 transition cursor-pointer" onClick={() => onOpen(p, 'sidebar')}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#fbbf24]/10 flex items-center justify-center text-sm border border-[#fbbf24]/20 flex-shrink-0">
                        {emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-white truncate">{p.title}</h4>
                        <p className="text-[10px] text-[#fffbf0]/50 truncate">{p.weight}</p>
                      </div>
                      <div className="text-[#fbbf24] font-black text-xs flex-shrink-0">{formatPrice(p.price)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

      </div>
    </section>
  );
}