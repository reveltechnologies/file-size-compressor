import type { FileCategory } from './presets'

const CATEGORIES: readonly FileCategory[] = ['video', 'image', 'pdf']

const INPUT_EXTENSIONS: Record<FileCategory, readonly string[]> = {
  video: ['mp4', 'mov', 'webm', 'mkv', 'gif'],
  image: ['heic', 'heif', 'webp', 'png', 'jpg', 'jpeg'],
  pdf: ['pdf'],
}

const OUTPUT: Record<FileCategory, { extension: string; mimeType: string }> = {
  video: { extension: 'mp4', mimeType: 'video/mp4' },
  image: { extension: 'jpg', mimeType: 'image/jpeg' },
  pdf: { extension: 'pdf', mimeType: 'application/pdf' },
}

export const ACCEPTED_EXTENSIONS: readonly string[] = CATEGORIES.flatMap((c) => INPUT_EXTENSIONS[c])

/**
 * Detects by extension first: browsers and Android often report HEIC and MKV
 * with an empty or generic MIME type. Falls back to the MIME type for
 * Android content:// URIs that arrive without a file name.
 */
export function detectCategory(fileName: string, mimeType = ''): FileCategory | null {
  const extension = extensionOf(fileName)
  const byExtension = CATEGORIES.find((c) => INPUT_EXTENSIONS[c].includes(extension))
  if (byExtension) return byExtension

  if (mimeType.startsWith('video/') || mimeType === 'image/gif') return 'video'
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType === 'application/pdf') return 'pdf'
  return null
}

/** "IMG_1234.MOV" → "IMG_1234-fit.mp4" */
export function outputFileName(inputName: string, category: FileCategory): string {
  const dot = inputName.lastIndexOf('.')
  const base = dot > 0 ? inputName.slice(0, dot) : inputName || 'file'
  return `${base}-fit.${OUTPUT[category].extension}`
}

export function outputMimeType(category: FileCategory): string {
  return OUTPUT[category].mimeType
}

function extensionOf(fileName: string): string {
  const dot = fileName.lastIndexOf('.')
  return dot > 0 ? fileName.slice(dot + 1).toLowerCase() : ''
}
