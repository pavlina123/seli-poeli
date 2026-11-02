import React, { useEffect, useState } from 'react'
import { waLink } from './theme'

export default function Header({ cartCount, onCartClick, onLoginClick }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Анимация цифр (3000+, 80, 60)
  useEffect(() => {
    const counters = document.querySelectorAll('[data-count]')
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        const el = e.target
        const target = +el.dataset.count
        let cur = 0
        const inc = target / 60
        const t = setInterval(() => {
          cur += inc
          if (cur >= target) {
            el.innerText = target.toLocaleString() + (target >= 1000 ? '+' : '')
            clearInterval(t)
          } else el.innerText = Math.floor(cur).toLocaleString()
        }, 20)
        io.unobserve(el)
      })
    }, { threshold: 0.5 })
    counters.forEach(c => io.observe(c))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0a0805]/95 backdrop-blur-xl border-b border-[#fbbf24]/30 shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          
          <a href="#" className="flex items-center space-x-2 md:space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-tr from-[#fbbf24] via-[#fb923c] to-[#dc2626] flex items-center justify-center shadow-lg shadow-[#fbbf24]/40 group-hover:scale-110 transition duration-300">
                <i data-lucide="chef-hat" className="w-5 h-5 md:w-6 md:h-6 text-black"></i>
              </div>
            </div>
            <div>
              <span className="text-base md:text-xl font-black tracking-tight font-display text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#dc2626] block leading-none">Seli_poeli_live</span>
              <span className="text-[8px] md:text-[10px] text-[#fbbf24] font-semibold tracking-[0.2em] uppercase">Доставка вкусной еды</span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center space-x-7 text-sm font-semibold text-[#fffbf0]/70">
            {[
              { href: '#menu', label: 'Меню' },
              { href: '#delivery', label: 'Доставка' },
              { href: '#contacts', label: 'Контакты' },
            ].map(l => (
              <a key={l.href} href={l.href} className="hover:text-[#fbbf24] transition relative group">
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#fbbf24] transition-all group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-2 md:space-x-3">
            <a href={waLink()} target="_blank" rel="noreferrer" className="hidden sm:inline-flex items-center space-x-2 bg-gradient-to-r from-[#fbbf24] to-[#dc2626] text-black px-4 py-2.5 rounded-xl font-black text-xs md:text-sm shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:scale-105 transition-transform duration-300">
              <i data-lucide="message-circle" className="w-4 h-4"></i>
              <span>Заказать</span>
            </a>
            
            <button onClick={onLoginClick} className="p-2.5 md:p-3 rounded-xl bg-white/10 border border-white/20 hover:border-[#fbbf24] hover:bg-[#fbbf24]/20 transition-all duration-300 group" title="Вход для персонала">
              <i data-lucide="lock" className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-[#fbbf24] transition-colors"></i>
            </button>

            <button onClick={onCartClick} className="relative p-2.5 md:p-3 rounded-xl bg-white/10 border border-white/20 hover:border-[#fbbf24] hover:bg-[#fbbf24]/20 transition-all duration-300 group">
              <i data-lucide="shopping-bag" className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-[#fbbf24] transition-colors"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#dc2626] text-white text-[10px] md:text-xs w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center font-black border-2 border-[#0a0805] animate-pulse">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION С КРАСИВЫМ ФОТО */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 pattern-bg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center">
            
            {/* Текстовая часть */}
            <div className="space-y-5 md:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full glass border border-[#fbbf24]/30 text-[#fbbf24] text-[10px] md:text-xs font-bold uppercase tracking-wider animate-pulse-glow">
                <span className="flame-icon">🔥</span>
                <span>Готовим как в ресторане, доставляем горячим</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] font-display">
                Доставка<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#fb923c]">вкусной еды</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fb923c] to-[#dc2626]">за 60 минут</span>
              </h1>
              
              <p className="text-sm md:text-lg text-[#fffbf0]/60 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Пицца, салаты, горячие блюда, закуски, напитки и полуфабрикаты.
                Готовим как в лучших ресторанах, доставляем горячим!
              </p>

              {/* Статистика */}
              <div className="flex items-center justify-center lg:justify-start space-x-5 md:space-x-8 pt-2">
                {[
                  { n: 3000, l: 'Клиентов' },
                  { n: 80, l: 'Блюд' },
                  { n: 60, l: 'Минут' },
                ].map((s, i) => (
                  <React.Fragment key={s.l}>
                    {i > 0 && <div className="w-px h-8 md:h-12 bg-gradient-to-b from-transparent via-[#fbbf24]/30 to-transparent"></div>}
                    <div className="text-center">
                      <div className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#dc2626] font-display" data-count={s.n}>0</div>
                      <div className="text-[9px] md:text-xs text-[#fffbf0]/40 uppercase tracking-wider mt-1">{s.l}</div>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {/* Кнопки */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-4">
                <a href="#menu" className="btn-primary w-full sm:w-auto text-lg px-8 py-4">
                  Смотреть меню 🔥
                </a>
                <a href={waLink()} target="_blank" rel="noreferrer" className="w-full sm:w-auto bg-white/5 border border-white/10 hover:border-[#25D366] hover:bg-[#25D366]/10 text-white font-bold px-8 py-4 rounded-xl transition flex items-center justify-center space-x-2 text-lg">
                  <i data-lucide="message-circle" className="w-5 h-5 text-[#25D366]"></i>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* ФОТО БЛЮДА (Красиво на ПК и на телефоне) */}
            <div className="relative mx-auto w-full max-w-sm lg:max-w-none mt-6 lg:mt-0">
              <div className="relative animate-float">
                {/* Свечение сзади */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#fbbf24] to-[#dc2626] rounded-full blur-3xl opacity-20 transform scale-110"></div>
                
                {/* Пунктирные круги */}
                <div className="absolute -top-6 -left-6 w-24 h-24 md:w-40 md:h-40 border-2 border-dashed border-[#fbbf24]/30 rounded-full animate-spin-slow"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 md:w-48 md:h-48 border-2 border-dashed border-[#dc2626]/30 rounded-full animate-spin-slower"></div>

                {/* Само фото */}
                <div className="relative rounded-[2rem] overflow-hidden shadow-[0_30px_80px_rgba(251,191,36,0.2)] border-4 border-[#fbbf24]/20 aspect-square">
                  <img 
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800" 
                    alt="Вкусная еда" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                  
                  {/* Плашка снизу */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex justify-between items-center">
                    <div>
                      <div className="text-white font-black text-sm md:text-base">Готовим с любовью</div>
                      <div className="text-[#fbbf24] text-[10px] md:text-xs flex items-center space-x-1 mt-0.5">
                        <i data-lucide="map-pin" className="w-3 h-3"></i>
                        <span>Шортандинский район • Астана</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#fbbf24] to-[#dc2626] flex items-center justify-center shadow-lg">
                      <i data-lucide="flame" className="w-5 h-5 text-black"></i>
                    </div>
                  </div>
                </div>

                {/* Плавающий бейдж (Рейтинг) */}
                <div className="absolute -top-4 -right-2 md:-top-6 md:-right-6 glass-strong rounded-2xl px-3 py-2 md:px-4 md:py-3 shadow-2xl animate-bounce-soft border border-[#fbbf24]/30 z-20">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#fbbf24]/20 flex items-center justify-center">
                      <i data-lucide="star" className="w-4 h-4 md:w-5 md:h-5 text-[#fbbf24] fill-current"></i>
                    </div>
                    <div>
                      <div className="text-xs md:text-sm font-black text-[#fbbf24]">4.9 ★</div>
                      <div className="text-[8px] md:text-[10px] text-white/50">Рейтинг</div>
                    </div>
                  </div>
                </div>

                {/* Плавающий бейдж (Время) */}
                <div className="absolute -bottom-4 -left-2 md:-bottom-6 md:-left-6 glass-strong rounded-2xl px-3 py-2 md:px-4 md:py-3 shadow-2xl animate-bounce-soft border border-[#dc2626]/30 z-20" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#dc2626]/20 flex items-center justify-center">
                      <i data-lucide="clock" className="w-4 h-4 md:w-5 md:h-5 text-[#dc2626]"></i>
                    </div>
                    <div>
                      <div className="text-xs md:text-sm font-black text-[#dc2626]">~60 мин</div>
                      <div className="text-[8px] md:text-[10px] text-white/50">Доставка</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}