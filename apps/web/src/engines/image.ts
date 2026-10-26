import {
  extractExif,
  fitImageToSize,
  formatBytes,
  imageScaleRange,
  insertExif,
  isJpeg,
  outputFileName,
  outputMimeType,
  stripJpegMetadata,
} from '@revel/core'
import { createJpegRenderer } from './canvas'
import type { CompressJob, CompressResult } from './types'

export async function compressImage(job: CompressJob): Promise<CompressResult> {
  const { file, maxBytes, options, onProgress, onStatus, signal } = job
  const fileName = outputFileName(file.name, 'image')
  const toResult = (bytes: Uint8Array<ArrayBuffer>): CompressResult => ({
    blob: new Blob([bytes], { type: outputMimeType('image') }),
    fileName,
  })

  onStatus('Opening photo…')
  const original = new Uint8Array(await file.arrayBuffer())

  // A JPEG that already fits keeps every pixel; only its metadata is touched.
  if (isJpeg(original) && original.length <= maxBytes) {
    const result = options.stripHiddenData ? stripJpegMetadata(original) : original
    if (result) return toResult(result)
  }

  // EXIF only survives re-encoding for JPEG sources; reserve room for it.
  const exif = !options.stripHiddenData && isJpeg(original) ? extractExif(original) : null
  const budget = maxBytes - (exif?.length ?? 0)

  const bitmap = await decode(file, onStatus)
  try {
    signal.throwIfAborted()
    onStatus('Shrinking photo…')
    const render = createJpegRenderer(bitmap)
    let attempts = 0
    const fitted = await fitImageToSize(
      async ({ scale, quality }) => {
        signal.throwIfAborted()
        const blob = await render(scale, quality)
        onProgress(Math.min(0.95, ++attempts / 10))
        return { output: blob, bytes: blob.size }
      },
      budget,
      imageScaleRange(bitmap.width, bitmap.height),
    )
    if (!fitted) {
      throw new Error(`Couldn't get this photo under ${formatBytes(maxBytes)} without making it too small to use.`)
    }

    onProgress(1)
    if (!exif) return { blob: fitted.output, fileName }
    return toResult(insertExif(new Uint8Array(await fitted.output.arrayBuffer()), exif))
  } finally {
    bitmap.close()
  }
}

/**
 * Uses the browser's own decoder first (Safari reads HEIC natively), then
 * falls back to heic-to, which is only downloaded when actually needed.
 */
async function decode(file: File, onStatus: (message: string) => void): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file)
  } catch {
    onStatus('Opening iPhone photo…')
    try {
      const { heicTo } = await import('heic-to')
      return await heicTo({ blob: file, type: 'bitmap' })
    } catch {
      throw new Error("Couldn't open this photo. It may be damaged or in an unsupported format.")
    }
  }
}
