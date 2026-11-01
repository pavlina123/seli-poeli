import React, { useEffect, useState } from 'react'
import { waLink } from './theme'

export default function Header({ cartCount, onCartClick, onLoginClick }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

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
          
          <a href="#" className="flex items-center space-x-3 group">
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

          <nav className="hidden lg:flex items-center space-x-7 text-sm font-semibold text-[#fffbf0]/80">
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

          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Кнопка ЗАКАЗАТЬ (Яркая) */}
            <a href={waLink()} target="_blank" rel="noreferrer" className="hidden sm:inline-flex items-center space-x-2 bg-gradient-to-r from-[#fbbf24] to-[#dc2626] text-black px-5 py-2.5 rounded-xl font-black text-xs md:text-sm shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:scale-105 transition-transform duration-300">
              <i data-lucide="message-circle" className="w-4 h-4"></i>
              <span>Заказать</span>
            </a>
            
            {/* Кнопка ВХОД (Замочек) - Белая иконка на светлой подложке */}
            <button onClick={onLoginClick} className="p-2.5 md:p-3 rounded-xl bg-white/10 border border-white/20 hover:border-[#fbbf24] hover:bg-[#fbbf24]/20 transition-all duration-300 group" title="Вход для персонала">
              <i data-lucide="lock" className="w-5 h-5 text-white group-hover:text-[#fbbf24] transition-colors"></i>
            </button>

            {/* Кнопка КОРЗИНА - Белая иконка на светлой подложке */}
            <button onClick={onCartClick} className="relative p-2.5 md:p-3 rounded-xl bg-white/10 border border-white/20 hover:border-[#fbbf24] hover:bg-[#fbbf24]/20 transition-all duration-300 group">
              <i data-lucide="shopping-bag" className="w-5 h-5 text-white group-hover:text-[#fbbf24] transition-colors"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#dc2626] text-white text-[10px] md:text-xs w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-[#0a0805] animate-pulse">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>
      
      {/* HERO (Оставил без изменений, чтобы не ломать) */}
      <section className="relative overflow-hidden pt-6 md:pt-12 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="lg:col-span-6 space-y-5 md:space-y-8 text-center lg:text-left">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] font-display">
                Доставка<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#fb923c]">вкусной еды</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fb923c] to-[#dc2626]">за 60 минут</span>
              </h1>
              <p className="text-sm md:text-lg text-[#fffbf0]/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Пицца, салаты, горячие блюда, закуски, напитки и полуфабрикаты.
                Готовим как в лучших ресторанах, доставляем горячим!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <a href="#menu" className="btn-primary w-full sm:w-auto text-lg px-8 py-4">
                  Смотреть меню 🔥
                </a>
                <a href={waLink()} target="_blank" rel="noreferrer" className="w-full sm:w-auto bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition flex items-center justify-center space-x-2 text-lg">
                  <i data-lucide="message-circle" className="w-5 h-5 text-[#25D366]"></i>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
            <div className="lg:col-span-6 relative hidden md:block">
              <div className="relative mx-auto max-w-lg lg:max-w-none animate-float">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-[#fbbf24]/30 aspect-square max-w-[500px] mx-auto">
                  <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800" alt="Вкусная еда" className="w-full h-full object-cover" loading="eager" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}