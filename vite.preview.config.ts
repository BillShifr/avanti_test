import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  root: fileURLToPath(new URL('./preview', import.meta.url)),
  // локальная сборка использует относительные пути
  // публикация передает путь репозитория через переменную окружения
  base: process.env.VITE_PAGES_BASE_PATH ?? './',
  plugins: [vue()],
  build: {
    outDir: fileURLToPath(new URL('./dist-preview', import.meta.url)),
    emptyOutDir: true,
    assetsInlineLimit: 0,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
  },
})
