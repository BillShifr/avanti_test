import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    laravel({
      input: [
        'resources/js/app.ts',
        // растровые файлы добавляются в карту сборки для загрузки через сервер
        'resources/images/home/shared/profile_avatar.jpg',
        'resources/images/home/mobile/chat_avatar.png',
      ],
      refresh: true,
    }),
    vue(),
  ],
  build: {
    assetsInlineLimit: 0,
  },
})
