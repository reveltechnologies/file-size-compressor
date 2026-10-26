import { outputFileName, outputMimeType, SAFETY_FACTOR } from '@revel/core'
import type { CompressJob, CompressResult } from './types'

/**
 * Stand-in engine so the UI can be built before the real ones exist.
 * The output is the first bytes of the input, NOT a usable file.
 */
export async function compressSimulated(job: CompressJob): Promise<CompressResult> {
  job.onStatus('Simulating…')
  const steps = 20
  for (let i = 1; i <= steps; i++) {
    await new Promise((resolve) => setTimeout(resolve, 60))
    job.signal.throwIfAborted()
    job.onProgress(i / steps)
  }

  const size = Math.min(job.file.size, Math.floor(job.maxBytes * SAFETY_FACTOR))
  return {
    blob: job.file.slice(0, size, outputMimeType(job.category)),
    fileName: outputFileName(job.file.name, job.category),
  }
}
