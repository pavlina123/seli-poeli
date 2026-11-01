import React, { useState, useEffect } from 'react'
import { categories, waLink, formatPrice, PHONE_DISPLAY, WHATSAPP } from './theme'

export default function Cart({ open, onClose, cart, total, count, onChangeQty, onClear, modal, onCloseModal }) {
  return (
    <>
      <ProductModal modal={modal} onClose={onCloseModal} onAdd={onChangeQty} />
      <CartPanel open={open} onClose={onClose} cart={cart} total={total} count={count} onChangeQty={onChangeQty} onClear={onClear} />
      <Footer />
      <FloatingWA />
    </>
  )
}

// ===== МОДАЛКА ТОВАРА =====
function ProductModal({ modal, onClose }) {
  const [qty, setQty] = useState(1)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')

  useEffect(() => {
    if (modal) { setQty(1); setName(''); setAddress('') }
  }, [modal])

  useEffect(() => {
    if (modal) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [modal])

  if (!modal) return null
  const { product: p, source } = modal
  const emoji = categories.find(c => c.id === p.category)?.emoji || '🍽️'
  const categoryName = categories.find(c => c.id === p.category)?.name || 'Блюдо'
  
  // Берем данные из базы (title и photos)
  const hasImage = p.photos && p.photos.length > 0
  const imageUrl = hasImage ? p.photos[0] : null
  const rating = 4.9 // Заглушка, так как в базе рейтинга нет
  const sum = p.price * qty

  const order = () => {
    let text = `Здравствуйте! Хочу заказать в Seli_poeli_live:\n\n`
    text += `🍽️ Блюдо: ${p.title}\n`
    text += `📦 Количество: ${qty} шт.\n`
    text += `💰 Цена за 1: ${formatPrice(p.price)}\n`
    text += `💵 Общая сумма: ${formatPrice(sum)}\n`
    text += `⚖️ Грамовка: ${p.weight}\n\n`
    text += `━━━━━━━━━━━━━━━\n`
    text += `👤 Имя: ${name || '—'}\n`
    text += `📍 Адрес: ${address || '—'}\n\n`
    text += `Жду подтверждения заказа!`
    window.open(waLink(text), '_blank')
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#14100a] border border-[#fbbf24]/30 max-w-md w-full rounded-3xl relative overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-red-500 transition">
          <i data-lucide="x" className="w-5 h-5"></i>
        </button>
        
        <div className="relative h-48 w-full overflow-hidden rounded-t-3xl">
          {hasImage ? (
            <img src={imageUrl} alt={p.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a140c] to-[#0a0805] flex items-center justify-center">
               <div className="text-center space-y-1">
                <div className="text-6xl">{emoji}</div>
                <p className="text-[10px] text-white/40">Фото скоро появится</p>
              </div>
            </div>
          )}
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md rounded-xl px-3 py-1.5 text-xs font-bold text-[#fbbf24] flex items-center gap-1 border border-white/10">
            <span>{emoji}</span>
            <span>{categoryName}</span>
          </div>
          {hasImage && <div className="absolute bottom-3 right-3 bg-gradient-to-r from-[#fbbf24] to-[#dc2626] text-black font-black px-4 py-1.5 rounded-xl text-sm shadow-lg">{formatPrice(p.price)}</div>}
        </div>

        <div className="p-5 space-y-4 relative z-10">
          <div>
            <h3 className="text-xl font-black text-white font-display leading-tight">{p.title}</h3>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <div className="flex text-[#fbbf24]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <i key={i} data-lucide="star" className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'fill-current' : ''}`}></i>
                ))}
              </div>
              <span className="text-[11px] text-white/50">{rating}</span>
              <span className="text-[11px] text-[#fbbf24] bg-[#fbbf24]/10 px-2 py-0.5 rounded-full border border-[#fbbf24]/20 flex items-center gap-1">
                <i data-lucide="scale" className="w-3 h-3"></i>
                <span>{p.weight}</span>
              </span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-[10px] font-bold text-[#fbbf24] uppercase mb-1 flex items-center gap-1">
              <i data-lucide="list" className="w-3.5 h-3.5"></i> Состав / Описание
            </div>
            <p className="text-xs text-white/70 leading-relaxed">{p.description || 'Описание пока не добавлено'}</p>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center justify-between">
            <div className="text-[10px] font-bold text-[#fbbf24] uppercase flex items-center gap-1">
              <i data-lucide="hash" className="w-3.5 h-3.5"></i> Количество
            </div>
            <div className="flex items-center gap-3 bg-black/50 rounded-xl p-1 border border-white/10">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition">−</button>
              <span className="text-sm font-black text-[#fbbf24] w-6 text-center">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="w-8 h-8 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition">+</button>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-[10px] font-bold text-[#fbbf24] uppercase mb-1 flex items-center gap-1">
              <i data-lucide="user" className="w-3.5 h-3.5"></i> Ваше имя
            </div>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Введите имя" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#fbbf24] transition" />
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-[10px] font-bold text-[#fbbf24] uppercase mb-1 flex items-center gap-1">
              <i data-lucide="map-pin" className="w-3.5 h-3.5"></i> Адрес доставки
            </div>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Шортандинский район / Астана" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#fbbf24] transition" />
          </div>

          <div className="bg-gradient-to-r from-[#fbbf24]/10 to-[#dc2626]/10 border border-[#fbbf24]/40 rounded-xl p-4 flex justify-between items-center">
            <span className="text-xs font-bold text-white/60 uppercase">Итого</span>
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#dc2626]">{formatPrice(sum)}</span>
          </div>

          <button onClick={order} className="btn-primary w-full py-4 text-sm">
            <i data-lucide="message-circle" className="w-5 h-5"></i>
            <span>Заказать в WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ===== КОРЗИНА =====
function CartPanel({ open, onClose, cart, total, count, onChangeQty, onClear }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const checkout = () => {
    if (!cart.length) return
    let text = 'Здравствуйте! Хочу заказать в Seli_poeli_live:\n\n'
    cart.forEach(i => {
      text += `• ${i.title} (${i.qty} шт.) — ${formatPrice(i.price * i.qty)}\n`
    })
    text += `\n━━━━━━━━━━━━━━━\nОбщая сумма: ${formatPrice(total)}\n\n📍 Доставка: Шортандинский район / Астана`
    window.open(waLink(text), '_blank')
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex justify-end" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md bg-[#14100a] h-full p-5 md:p-6 flex flex-col justify-between border-l border-[#fbbf24]/30 shadow-2xl">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <h3 className="text-lg md:text-xl font-black flex items-center gap-2 font-display text-white">
              <i data-lucide="shopping-bag" className="w-5 h-5 text-[#fbbf24]"></i>
              <span>Корзина</span>
              <span className="text-xs font-normal text-white/40">({count})</span>
            </h3>
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500 hover:text-white text-white/60 transition">
              <i data-lucide="x" className="w-5 h-5"></i>
            </button>
          </div>
          
          <div className="py-4 space-y-3 overflow-y-auto flex-1">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <div className="w-20 h-20 rounded-full bg-[#fbbf24]/10 flex items-center justify-center">
                  <i data-lucide="shopping-bag" className="w-10 h-10 text-[#fbbf24]/40"></i>
                </div>
                <p className="text-white/50 text-center text-sm">Ваша корзина пуста</p>
                <button onClick={onClose} className="text-[#fbbf24] text-sm font-bold hover:underline">Перейти в меню</button>
              </div>
            ) : cart.map(item => {
              const emoji = categories.find(c => c.id === item.category)?.emoji || '🍽️'
              const hasImage = item.photos && item.photos.length > 0
              const imageUrl = hasImage ? item.photos[0] : null
              
              return (
                <div key={item.id} className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/10">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {hasImage ? (
                      <img src={imageUrl} alt={item.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#fbbf24]/10 flex items-center justify-center text-xl flex-shrink-0 border border-[#fbbf24]/20">{emoji}</div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs md:text-sm text-white truncate">{item.title}</h4>
                      <p className="text-xs text-[#fbbf24] font-bold">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    <button onClick={() => onChangeQty(item.id, -1)} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 hover:border-[#fbbf24] transition font-bold">−</button>
                    <span className="text-xs font-bold w-4 text-center text-white">{item.qty}</span>
                    <button onClick={() => onChangeQty(item.id, 1)} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 hover:border-[#fbbf24] transition font-bold">+</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-4 space-y-3">
          <div className="flex justify-between items-center text-base font-bold text-white">
            <span>Итого:</span>
            <span className="text-[#fbbf24] font-black font-display text-xl">{formatPrice(total)}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center gap-2">
            <i data-lucide="truck" className="w-4 h-4 text-[#fbbf24] flex-shrink-0"></i>
            <span className="text-xs text-white/70">Доставка: <span className="text-[#fbbf24] font-bold">Шортандинский район • Астана</span></span>
          </div>
          
          <button onClick={checkout} className="btn-primary w-full py-4 text-sm">
            <i data-lucide="message-circle" className="w-5 h-5"></i>
            <span>Заказать в WhatsApp</span>
          </button>
          
          <a href={`tel:+${WHATSAPP}`} className="w-full py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl transition hover:bg-white/10 flex items-center justify-center gap-2 text-sm">
            <i data-lucide="phone" className="w-4 h-4 text-[#fbbf24]"></i>
            <span>Позвонить: {PHONE_DISPLAY}</span>
          </a>
          
          <button onClick={onClear} className="w-full py-2.5 text-red-400 font-bold rounded-xl transition hover:bg-red-400/10 text-xs">
            Очистить корзину
          </button>
        </div>
      </div>
    </div>
  )
}

// ===== FOOTER (Оставил твой красивый) =====
function Footer() {
  return (
    <footer id="contacts" className="border-t border-[#fbbf24]/20 bg-[#14100a]/60 py-10 md:py-16 mt-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        <div className="space-y-3 md:space-y-4 md:col-span-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-tr from-[#fbbf24] via-[#fb923c] to-[#dc2626] flex items-center justify-center shadow-lg shadow-[#fbbf24]/20">
              <i data-lucide="chef-hat" className="w-5 h-5 md:w-6 md:h-6 text-black"></i>
            </div>
            <div>
              <span className="text-lg md:text-xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#dc2626] block leading-none">Seli_poeli_live</span>
              <span className="text-[9px] md:text-[10px] text-[#fbbf24] font-semibold tracking-[0.2em] uppercase">Доставка вкусной еды</span>
            </div>
          </div>
          <p className="text-xs md:text-sm text-white/50 max-w-md mx-auto md:mx-0 leading-relaxed">
            Доставка вкусной еды. Готовим как в лучших ресторанах, доставляем горячим. Шортандинский район, Астана.
          </p>
        </div>

        <div className="space-y-3 md:space-y-4 text-center md:text-left">
          <h4 className="font-bold text-base md:text-lg text-[#fbbf24] font-display">Контакты</h4>
          <p className="text-xs md:text-sm text-white/60 flex items-center justify-center md:justify-start space-x-2">
            <i data-lucide="phone" className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#fb923c]"></i>
            <span>{PHONE_DISPLAY}</span>
          </p>
          <p className="text-xs md:text-sm text-white/60 flex items-center justify-center md:justify-start space-x-2">
            <i data-lucide="clock" className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#fb923c]"></i>
            <span>08:00 — 23:00</span>
          </p>
        </div>

        <div className="space-y-3 md:space-y-4 text-center md:text-left">
          <h4 className="font-bold text-base md:text-lg text-[#fbbf24] font-display">Заказать</h4>
          <a href={waLink()} target="_blank" rel="noreferrer" className="btn-primary w-full px-5 py-3 text-xs md:text-sm">
            <i data-lucide="message-circle" className="w-4 h-4 md:w-5 md:h-5"></i>
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-white/10 text-center text-[10px] md:text-xs text-white/40">
        © 2026 Seli_poeli_live. Доставка вкусной еды. Шортандинский район • Астана. Готовим с 🔥 для вас.
      </div>
    </footer>
  )
}

// ===== FLOATING WHATSAPP (мобилка) =====
function FloatingWA() {
  return (
    <a href={waLink()} target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-40 md:hidden w-14 h-14 rounded-full bg-gradient-to-tr from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.5)] animate-bounce">
      <i data-lucide="message-circle" className="w-7 h-7 text-white"></i>
    </a>
  )
}