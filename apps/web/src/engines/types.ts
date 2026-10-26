import type { CompressOptions, FileCategory } from '@revel/core'

export interface CompressJob {
  /** One file, except when several photos are combined into one PDF. */
  files: File[]
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
