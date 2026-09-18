import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

/**
 * Сравнение скриншота с растровым эталоном Figma.
 * Возвращает долю различающихся пикселей после порога антиалиасинга.
 */
export function comparePng(actualPath, expectedPath, diffPath, threshold = 0.12) {
  const actual = PNG.sync.read(readFileSync(actualPath))
  const expected = PNG.sync.read(readFileSync(expectedPath))

  if (actual.width !== expected.width || actual.height !== expected.height) {
    throw new Error(
      `Size mismatch: actual ${actual.width}x${actual.height}, expected ${expected.width}x${expected.height}`,
    )
  }

  const diff = new PNG({ width: actual.width, height: actual.height })
  const differing = pixelmatch(actual.data, expected.data, diff.data, actual.width, actual.height, {
    threshold,
    includeAA: false,
    alpha: 0.2,
  })

  mkdirSync(dirname(diffPath), { recursive: true })
  writeFileSync(diffPath, PNG.sync.write(diff))

  return {
    differing,
    total: actual.width * actual.height,
    ratio: differing / (actual.width * actual.height),
  }
}

const isCli = process.argv[1] !== undefined && process.argv[1].endsWith('pixel_diff.mjs')

if (isCli && process.argv[2] !== undefined) {
  const [, , a, e, d] = process.argv
  const r = comparePng(a, e, d ?? '/tmp/diff.png')
  console.log(`${(r.ratio * 100).toFixed(3)}%  (${r.differing}/${r.total})`)
}
