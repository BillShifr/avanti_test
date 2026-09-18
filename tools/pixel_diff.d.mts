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
