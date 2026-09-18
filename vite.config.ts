import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    laravel({
      input: [
        'resources/js/app.ts',
        // Растровые ассеты попадают в manifest, чтобы контроллер отдавал их через Vite::asset().
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
