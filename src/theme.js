export const colors = {
  dark:   '#0a0805',
  card:   '#14100a',
  amber:  '#f59e0b',
  orange: '#fb923c',
  red:    '#dc2626',
  warm:   '#fef3c7',
  cream:  '#fffbf0',
  gold:   '#fbbf24',
  brown:  '#78350f',
}

export const WHATSAPP = '77784643169'
export const PHONE_DISPLAY = '+7 778 464 3169'

export const waLink = (text = 'Здравствуйте! Хочу заказать вкусную еду.') =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`

export const formatPrice = (n) => Number(n).toLocaleString('ru-RU') + ' ₸'

export const categories = [
  { id: 'all',    name: 'Всё меню',       emoji: '🍽️' },
  { id: 'pizza',  name: 'Пицца',          emoji: '🍕' },
  { id: 'salads', name: 'Салаты',         emoji: '🥗' },
  { id: 'hot',    name: 'Горячие блюда',  emoji: '🔥' },
  { id: 'snacks', name: 'Закуски',        emoji: '🍟' },
  { id: 'drinks', name: 'Напитки',        emoji: '🥤' },
  { id: 'semi',   name: 'Полуфабрикаты',  emoji: '🥟' },
]