import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 1. Добавили импорт

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 2. Добавили плагин
  ],
})