export interface PixelDiffResult {
  differing: number
  total: number
  ratio: number
}

export declare function comparePng(
  actualPath: string,
  expectedPath: string,
  diffPath: string,
  threshold?: number,
): PixelDiffResult

export interface StructuralEdgeViolation {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly pixels: number
  readonly maxDisplacement: number
}

export interface StructuralEdgeOptions {
  readonly allowedDisplacement?: number
  readonly searchRadius?: number
  readonly minimumColorJump?: number
  readonly matchingColorJump?: number
  readonly minimumComponentPixels?: number
  readonly minimumComponentSpan?: number
}

export declare const FIGMA_ANTIALIAS_THRESHOLD: number

export declare function compareStructuralEdges(
  actualPath: string,
  expectedPath: string,
  options?: StructuralEdgeOptions,
): { readonly violations: readonly StructuralEdgeViolation[] }
