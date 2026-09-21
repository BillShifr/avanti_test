import type { Page } from '@playwright/test'
import { readFileSync, writeFileSync } from 'node:fs'
import { PNG } from 'pngjs'

export interface ReferenceBox {
  readonly selector: string
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly isText?: boolean
  readonly tolerance?: number
}

/**
 * создает наложение двух снимков
 */
export function createHalfOpacityOverlay(
  actualPath: string,
  expectedPath: string,
  overlayPath: string,
): void {
  const actual = PNG.sync.read(readFileSync(actualPath))
  const expected = PNG.sync.read(readFileSync(expectedPath))

  if (actual.width !== expected.width || actual.height !== expected.height) {
    throw new Error(
      `Размеры overlay не совпадают: actual ${actual.width}×${actual.height}, expected ${expected.width}×${expected.height}`,
    )
  }

  const overlay = new PNG({ width: actual.width, height: actual.height })

  for (let index = 0; index < overlay.data.length; index += 1) {
    overlay.data[index] = Math.round(((actual.data[index] ?? 0) + (expected.data[index] ?? 0)) / 2)
  }

  writeFileSync(overlayPath, PNG.sync.write(overlay))
}

/**
 * подготавливает страницу к снимку
 */
export async function prepareForScreenshot(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `*, *::before, *::after {
      animation: none !important;
      transition: none !important;
      caret-color: transparent !important;
      scroll-behavior: auto !important;
    }`,
  })

  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all(
      Array.from(document.images)
        .filter((image) => !image.complete)
        .map(
          (image) =>
            new Promise((resolve) => {
              image.addEventListener('load', resolve, { once: true })
              image.addEventListener('error', resolve, { once: true })
            }),
        ),
    )
  })

  await page.waitForTimeout(120)
}

/**
 * хранит опорные прямоугольники макета
 */
export const REFERENCE_BOXES: Readonly<Record<string, readonly ReferenceBox[]>> = {
  desktop: [
    { selector: '.home-shell__top', x: 0, y: 0, width: 1440, height: 111 },
    {
      selector: '.home-logo--desktop',
      x: 72,
      y: 36,
      width: 152.01,
      height: 39,
      tolerance: 0.02,
    },
    {
      selector: '.home-primary-nav__list',
      x: 276.01,
      y: 36.5,
      width: 660,
      height: 38,
      tolerance: 0.02,
    },
    { selector: '.home-support', x: 1212, y: 36, width: 156, height: 39 },
    {
      selector: '.home-shell__meta .home-user--desktop',
      x: 72,
      y: 121,
      width: 163,
      height: 40,
      isText: true,
    },
    { selector: '.home-steps', x: 72, y: 191, width: 792, height: 130 },
    { selector: '.home-steps__row', x: 96, y: 243, width: 744, height: 58 },
    {
      selector: '.home-step:first-of-type .home-step__circle',
      x: 132,
      y: 243,
      width: 36,
      height: 36,
    },
    {
      selector: '.home-step:last-of-type .home-step__circle',
      x: 768,
      y: 243,
      width: 36,
      height: 36,
    },
    { selector: '.home-balance', x: 72, y: 353, width: 792, height: 340 },
    { selector: '.home-withdraw', x: 104, y: 558, width: 728, height: 64 },
    { selector: '.home-banner', x: 72, y: 725, width: 792, height: 124 },
    { selector: '.home-banner__lock', x: 92, y: 741, width: 44, height: 44 },
    { selector: '.home-banner__action', x: 808, y: 769, width: 36, height: 36 },
    { selector: '.home-personal', x: 904, y: 191, width: 464, height: 131 },
    { selector: '.home-checklist', x: 904, y: 354, width: 464, height: 483 },
    { selector: '.home-check:first-of-type', x: 904, y: 420, width: 464, height: 76 },
    { selector: '.home-check:last-of-type', x: 904, y: 727, width: 464, height: 77 },
  ],
  mobile: [
    { selector: '.home-shell__top', x: 0, y: 0, width: 390, height: 62 },
    { selector: '.home-logo--mobile', x: 16, y: 16.5, width: 104, height: 29 },
    { selector: '.home-notifications', x: 265, y: 12, width: 38, height: 38, isText: true },
    { selector: '.home-user--mobile', x: 315, y: 15, width: 59, height: 32, isText: true },
    { selector: '.home-steps', x: 16, y: 78, width: 358, height: 92 },
    { selector: '.home-balance', x: 16, y: 190, width: 358, height: 248 },
    { selector: '.home-banner', x: 16, y: 458, width: 358, height: 136 },
    { selector: '.home-checklist', x: 16, y: 614, width: 358, height: 443 },
    { selector: '.home-bottom-nav', x: 0, y: 1077, width: 390, height: 62 },
    {
      selector: '.home-chat',
      x: 314,
      y: 986.222,
      width: 56.889,
      height: 56.889,
      tolerance: 0.02,
    },
  ],
}
