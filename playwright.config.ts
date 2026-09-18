import { defineConfig, devices } from '@playwright/test'

const PREVIEW_URL = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4173'

export default defineConfig({
  testDir: './tests',
  testMatch: ['e2e/**/*.spec.ts', 'visual/**/*.spec.ts'],
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : '50%',
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  outputDir: './test-results',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
    toHaveScreenshot: {
      maxDiffPixels: 0,
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
    },
  },
  use: {
    baseURL: PREVIEW_URL,
    locale: 'it-IT',
    timezoneId: 'Europe/Rome',
    colorScheme: 'light',
    deviceScaleFactor: 1,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    /*
     * Figma экспортирует PNG с серым сглаживанием текста, Chromium по умолчанию
     * использует субпиксельное (LCD). Без этого флага каждый край глифа даёт
     * цветную бахрому и растровое сравнение шумит на ~0.4 п.п.
     */
    launchOptions: {
      args: ['--disable-lcd-text'],
      ...(process.env.CHROMIUM_PATH === undefined
        ? {}
        : { executablePath: process.env.CHROMIUM_PATH }),
    },
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 889 } },
    },
    {
      name: 'chromium-mobile',
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 1139 } },
    },
  ],
  webServer: {
    command: 'pnpm run build:preview && pnpm run preview:serve',
    url: PREVIEW_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
