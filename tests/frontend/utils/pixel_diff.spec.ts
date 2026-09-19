import { afterAll, describe, expect, it } from 'vitest'
import { PNG } from 'pngjs'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { comparePng, compareStructuralEdges } from '../../../tools/pixel_diff.mjs'

const TEMP_DIRECTORY = mkdtempSync(join(tmpdir(), 'home-pixel-diff-'))
const VISUAL_DIRECTORY = join(process.cwd(), 'tests/visual')

afterAll(() => {
  rmSync(TEMP_DIRECTORY, { recursive: true, force: true })
})

function writeRectangle(path: string, offsetX: number): void {
  const image = new PNG({ width: 100, height: 100 })
  image.data.fill(255)

  for (let y = 25; y < 75; y += 1) {
    for (let x = 20 + offsetX; x < 60 + offsetX; x += 1) {
      const pixel = (y * image.width + x) * 4
      image.data[pixel] = 26
      image.data[pixel + 1] = 35
      image.data[pixel + 2] = 50
      image.data[pixel + 3] = 255
    }
  }

  writeFileSync(path, PNG.sync.write(image))
}

function writeMobileRegressionShape(
  path: string,
  offsetX: number,
  width: number,
  height: number,
  color: readonly [number, number, number],
): void {
  const image = new PNG({ width: 390, height: 1139 })
  image.data.fill(255)

  for (let y = 100; y < 100 + height; y += 1) {
    for (let x = 40 + offsetX; x < 40 + offsetX + width; x += 1) {
      const pixel = (y * image.width + x) * 4
      image.data[pixel] = color[0]
      image.data[pixel + 1] = color[1]
      image.data[pixel + 2] = color[2]
      image.data[pixel + 3] = 255
    }
  }

  writeFileSync(path, PNG.sync.write(image))
}

describe('Figma pixel diff calibration', () => {
  it.each([
    ['desktop', 'home-desktop-chromium-desktop-linux.png', 'home-desktop-1440x889.png'],
    ['mobile', 'home-mobile-chromium-mobile-linux.png', 'home-mobile-390x1139.png'],
  ])('%s snapshot stays inside the common 0.35%% budget', (_name, actualName, expectedName) => {
    const actual = join(VISUAL_DIRECTORY, 'home/home.visual.spec.ts-snapshots', actualName)
    const expected = join(VISUAL_DIRECTORY, 'reference', expectedName)
    const diff = join(TEMP_DIRECTORY, `${actualName}.diff.png`)

    expect(comparePng(actual, expected, diff).ratio).toBeLessThanOrEqual(0.0035)
    expect(compareStructuralEdges(actual, expected).violations).toEqual([])
  })

  it.each([1, 2])('does not hide a %d px edge shift behind AA calibration', (offsetX) => {
    const expected = join(TEMP_DIRECTORY, 'rectangle-expected.png')
    const actual = join(TEMP_DIRECTORY, `rectangle-${offsetX}px.png`)
    const diff = join(TEMP_DIRECTORY, `rectangle-${offsetX}px.diff.png`)
    writeRectangle(expected, 0)
    writeRectangle(actual, offsetX)

    expect(comparePng(actual, expected, diff).ratio).toBeGreaterThan(0.0035)
  })

  it('reports a connected structural edge displaced by more than 2 px', () => {
    const expected = join(TEMP_DIRECTORY, 'structural-expected.png')
    const actual = join(TEMP_DIRECTORY, 'structural-3px.png')
    writeRectangle(expected, 0)
    writeRectangle(actual, 3)

    const result = compareStructuralEdges(actual, expected)

    expect(result.violations.length).toBeGreaterThan(0)
    expect(result.violations.every((violation) => violation.maxDisplacement > 2)).toBe(true)
  })

  it.each([
    ['muted 200x100 surface', 200, 100, [244, 244, 245] as const],
    ['high-contrast 16x16 control', 16, 16, [26, 35, 50] as const],
  ])('catches a 3 px shift of a %s on the full mobile canvas', (_name, width, height, color) => {
    const expected = join(TEMP_DIRECTORY, `full-canvas-${width}x${height}-expected.png`)
    const actual = join(TEMP_DIRECTORY, `full-canvas-${width}x${height}-actual.png`)
    const diff = join(TEMP_DIRECTORY, `full-canvas-${width}x${height}-diff.png`)
    writeMobileRegressionShape(expected, 0, width, height, color)
    writeMobileRegressionShape(actual, 3, width, height, color)

    expect(comparePng(actual, expected, diff).ratio).toBeLessThanOrEqual(0.0035)

    const structural = compareStructuralEdges(actual, expected)
    expect(structural.violations.length).toBeGreaterThan(0)
    expect(structural.violations.every((violation) => violation.maxDisplacement > 2)).toBe(true)
  })
})
