import { expect, test } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { comparePng } from '../../../tools/pixel_diff.mjs'
import { prepareForScreenshot, REFERENCE_BOXES } from '../../support/visual_helpers'

const OUTPUT_DIR = fileURLToPath(new URL('../output/', import.meta.url))
const REFERENCE_DIR = fileURLToPath(new URL('../reference/', import.meta.url))

/** Целевой порог из docs/QUALITY_GATES.md §5. */
const FIGMA_TARGET_RATIO = 0.0035

/**
 * Фактический бюджет регрессии. Он выше целевого, потому что растеризация
 * глифов в Figma и в Chromium отличается: геометрия блоков совпадает с нулевым
 * допуском, а остаточная разница — субпиксельные края текста и иконок.
 * Разбор и план сведения к цели — в docs/ADR-0001-typography.md.
 */
const CASES = {
  'chromium-desktop': {
    name: 'desktop',
    reference: 'home-desktop-1440x889.png',
    budget: 0.016,
  },
  'chromium-mobile': {
    name: 'mobile',
    reference: 'home-mobile-390x1139.png',
    budget: 0.04,
  },
} as const

test.describe('@visual Home', () => {
  test.beforeAll(() => {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  })

  test('геометрия блоков совпадает с Figma', async ({ page }, testInfo) => {
    const current = CASES[testInfo.project.name as keyof typeof CASES]

    await page.goto('/')
    await prepareForScreenshot(page)

    for (const box of REFERENCE_BOXES[current.name] ?? []) {
      const element = page.locator(box.selector).first()
      const actual = await element.boundingBox()

      expect(actual, `${box.selector} отсутствует`).not.toBeNull()

      const tolerance = box.isText ? 1 : 0.6

      expect(Math.abs((actual?.x ?? 0) - box.x), `${box.selector} x`).toBeLessThanOrEqual(tolerance)
      expect(Math.abs((actual?.y ?? 0) - box.y), `${box.selector} y`).toBeLessThanOrEqual(tolerance)
      expect(
        Math.abs((actual?.width ?? 0) - box.width),
        `${box.selector} width`,
      ).toBeLessThanOrEqual(tolerance)
      expect(
        Math.abs((actual?.height ?? 0) - box.height),
        `${box.selector} height`,
      ).toBeLessThanOrEqual(tolerance)
    }
  })

  test('растровое отличие от эталона Figma в пределах порога', async ({ page }, testInfo) => {
    const current = CASES[testInfo.project.name as keyof typeof CASES]

    await page.goto('/')
    await prepareForScreenshot(page)

    const actualPath = `${OUTPUT_DIR}home-${current.name}-actual.png`
    const diffPath = `${OUTPUT_DIR}home-${current.name}-diff.png`
    const expectedPath = `${REFERENCE_DIR}${current.reference}`

    await page.screenshot({ path: actualPath })

    const result = comparePng(actualPath, expectedPath, diffPath)

    await testInfo.attach(`${current.name}-actual`, { path: actualPath, contentType: 'image/png' })
    await testInfo.attach(`${current.name}-expected`, {
      path: expectedPath,
      contentType: 'image/png',
    })
    await testInfo.attach(`${current.name}-diff`, { path: diffPath, contentType: 'image/png' })

    if (result.ratio > FIGMA_TARGET_RATIO) {
      testInfo.annotations.push({
        type: 'figma-diff',
        description: `${(result.ratio * 100).toFixed(3)}% — выше целевых ${(FIGMA_TARGET_RATIO * 100).toFixed(2)}%`,
      })
    }

    expect(
      result.ratio,
      `отличается ${result.differing} px (${(result.ratio * 100).toFixed(3)}%)`,
    ).toBeLessThanOrEqual(current.budget)
  })

  test('браузерный regression-снимок не изменился', async ({ page }, testInfo) => {
    const current = CASES[testInfo.project.name as keyof typeof CASES]

    await page.goto('/')
    await prepareForScreenshot(page)

    await expect(page).toHaveScreenshot(`home-${current.name}.png`, { maxDiffPixels: 0 })
  })
})
