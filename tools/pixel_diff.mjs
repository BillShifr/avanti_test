import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

/**
 * сравнивает снимок с растровым эталоном
 */
export const FIGMA_ANTIALIAS_THRESHOLD = 0.25

export function comparePng(
  actualPath,
  expectedPath,
  diffPath,
  threshold = FIGMA_ANTIALIAS_THRESHOLD,
) {
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

function assertSameSize(actual, expected) {
  if (actual.width !== expected.width || actual.height !== expected.height) {
    throw new Error(
      `Size mismatch: actual ${actual.width}x${actual.height}, expected ${expected.width}x${expected.height}`,
    )
  }
}

function colorJump(data, first, second) {
  const red = data[first] - data[second]
  const green = data[first + 1] - data[second + 1]
  const blue = data[first + 2] - data[second + 2]

  return red * red + green * green + blue * blue
}

function createEdgeMask(image, minimumColorJump) {
  const { data, width, height } = image
  const mask = new Uint8Array(width * height)
  const thresholdSquared = minimumColorJump * minimumColorJump

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixel = y * width + x
      const offset = pixel * 4

      if (x + 1 < width) {
        const right = pixel + 1
        if (colorJump(data, offset, right * 4) >= thresholdSquared) {
          mask[pixel] = 1
          mask[right] = 1
        }
      }

      if (y + 1 < height) {
        const below = pixel + width
        if (colorJump(data, offset, below * 4) >= thresholdSquared) {
          mask[pixel] = 1
          mask[below] = 1
        }
      }
    }
  }

  return mask
}

function nearestEdgeDistance(mask, width, height, x, y, searchRadius) {
  for (let radius = 0; radius <= searchRadius; radius += 1) {
    const left = Math.max(0, x - radius)
    const right = Math.min(width - 1, x + radius)
    const top = Math.max(0, y - radius)
    const bottom = Math.min(height - 1, y + radius)

    for (let scanX = left; scanX <= right; scanX += 1) {
      if (mask[top * width + scanX] === 1 || mask[bottom * width + scanX] === 1) {
        return radius
      }
    }

    for (let scanY = top + 1; scanY < bottom; scanY += 1) {
      if (mask[scanY * width + left] === 1 || mask[scanY * width + right] === 1) {
        return radius
      }
    }
  }

  return searchRadius + 1
}

function markDisplacedEdges(
  source,
  target,
  width,
  height,
  allowedDisplacement,
  searchRadius,
  output,
) {
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixel = y * width + x
      if (source[pixel] === 0) continue

      const distance = nearestEdgeDistance(target, width, height, x, y, searchRadius)
      if (distance > allowedDisplacement) {
        output[pixel] = Math.max(output[pixel], distance)
      }
    }
  }
}

function findConnectedViolations(mask, width, height, minimumPixels, minimumSpan) {
  const visited = new Uint8Array(mask.length)
  const violations = []

  for (let start = 0; start < mask.length; start += 1) {
    if (mask[start] === 0 || visited[start] === 1) continue

    const queue = [start]
    visited[start] = 1
    let cursor = 0
    let pixels = 0
    let maxDisplacement = 0
    let minX = width
    let minY = height
    let maxX = 0
    let maxY = 0

    while (cursor < queue.length) {
      const pixel = queue[cursor]
      cursor += 1
      pixels += 1
      maxDisplacement = Math.max(maxDisplacement, mask[pixel])

      const x = pixel % width
      const y = Math.floor(pixel / width)
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)

      for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
        for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          if (offsetX === 0 && offsetY === 0) continue
          const nextX = x + offsetX
          const nextY = y + offsetY
          if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height) continue

          const next = nextY * width + nextX
          if (mask[next] === 0 || visited[next] === 1) continue
          visited[next] = 1
          queue.push(next)
        }
      }
    }

    const componentWidth = maxX - minX + 1
    const componentHeight = maxY - minY + 1
    if (pixels >= minimumPixels && Math.max(componentWidth, componentHeight) >= minimumSpan) {
      violations.push({
        x: minX,
        y: minY,
        width: componentWidth,
        height: componentHeight,
        pixels,
        maxDisplacement,
      })
    }
  }

  return violations
}

/**
 * находит связанные границы со смещением относительно эталона
 */
export function compareStructuralEdges(
  actualPath,
  expectedPath,
  {
    allowedDisplacement = 2,
    searchRadius = 5,
    minimumColorJump = 16,
    matchingColorJump = 6,
    minimumComponentPixels = 8,
    minimumComponentSpan = 12,
  } = {},
) {
  const actual = PNG.sync.read(readFileSync(actualPath))
  const expected = PNG.sync.read(readFileSync(expectedPath))
  assertSameSize(actual, expected)

  const actualEdges = createEdgeMask(actual, minimumColorJump)
  const expectedEdges = createEdgeMask(expected, minimumColorJump)
  const actualMatchingEdges = createEdgeMask(actual, matchingColorJump)
  const expectedMatchingEdges = createEdgeMask(expected, matchingColorJump)
  const displaced = new Uint8Array(actual.width * actual.height)

  markDisplacedEdges(
    actualEdges,
    expectedMatchingEdges,
    actual.width,
    actual.height,
    allowedDisplacement,
    searchRadius,
    displaced,
  )
  markDisplacedEdges(
    expectedEdges,
    actualMatchingEdges,
    actual.width,
    actual.height,
    allowedDisplacement,
    searchRadius,
    displaced,
  )

  return {
    violations: findConnectedViolations(
      displaced,
      actual.width,
      actual.height,
      minimumComponentPixels,
      minimumComponentSpan,
    ),
  }
}

const isCli = process.argv[1] !== undefined && process.argv[1].endsWith('pixel_diff.mjs')

if (isCli && process.argv[2] !== undefined) {
  const [, , a, e, d] = process.argv
  const r = comparePng(a, e, d ?? '/tmp/diff.png')
  console.log(`${(r.ratio * 100).toFixed(3)}%  (${r.differing}/${r.total})`)
}
