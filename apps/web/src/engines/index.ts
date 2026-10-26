import { compressSimulated } from './simulated'
import type { CompressJob, CompressResult } from './types'
import { compressVideo } from './video'

export type { CompressJob, CompressResult } from './types'

/** Categories still on the stand-in engine (photos: step 5, PDFs: step 6). */
export const SIMULATED_CATEGORIES: ReadonlySet<CompressJob['category']> = new Set(['image', 'pdf'])

export function compress(job: CompressJob): Promise<CompressResult> {
  if (job.category === 'video') return compressVideo(job)
  return compressSimulated(job)
}
