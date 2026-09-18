import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    setupFiles: ['tests/frontend/setup.ts'],
    include: ['tests/frontend/**/*.spec.ts'],
    globals: false,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      include: ['resources/js/**/*.{ts,vue}'],
      reporter: ['text-summary'],
    },
  },
})
