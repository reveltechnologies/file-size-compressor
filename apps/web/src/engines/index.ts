import { compressSimulated } from './simulated'
import type { CompressJob, CompressResult } from './types'

export type { CompressJob, CompressResult } from './types'

/** True until every category has a real engine (steps 4–6). */
export const IS_SIMULATED = true

export function compress(job: CompressJob): Promise<CompressResult> {
  // Steps 4–6 route each category to its real engine here.
  return compressSimulated(job)
}
