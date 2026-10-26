import type { CompressOptions, FileCategory } from '@revel/core'

export interface CompressJob {
  file: File
  category: FileCategory
  maxBytes: number
  options: CompressOptions
  /** Called with 0…1 as work progresses. */
  onProgress: (ratio: number) => void
}

export interface CompressResult {
  blob: Blob
  fileName: string
}
