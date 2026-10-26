import type { CompressOptions, FileCategory } from '@revel/core'

export interface CompressJob {
  file: File
  category: FileCategory
  maxBytes: number
  options: CompressOptions
  /** Called with 0…1 as the current stage progresses. */
  onProgress: (ratio: number) => void
  /** Short description of the current stage, e.g. "Reading video…". */
  onStatus: (message: string) => void
  signal: AbortSignal
}

export interface CompressResult {
  blob: Blob
  fileName: string
}
