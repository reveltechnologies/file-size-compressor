export type JpegRenderer = (scale: number, quality: number) => Promise<Blob>

/**
 * Draws a decoded image onto a canvas and encodes it as JPEG. Canvas output
 * carries no EXIF, GPS, ICC profile or alpha channel: that is the "unseen
 * data" wipe for photos.
 */
export function createJpegRenderer(bitmap: ImageBitmap): JpegRenderer {
  const canvas = document.createElement('canvas')
  let drawnScale = -1

  return (scale, quality) => {
    if (scale !== drawnScale) {
      canvas.width = Math.max(1, Math.round(bitmap.width * scale))
      canvas.height = Math.max(1, Math.round(bitmap.height * scale))
      const context = canvas.getContext('2d')
      if (!context) throw new Error('This browser blocked image processing (canvas unavailable).')
      // JPEG has no transparency: paint white so see-through areas don't turn black.
      context.fillStyle = '#fff'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.imageSmoothingQuality = 'high'
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
      drawnScale = scale
    }

    return new Promise((resolve, reject) =>
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Could not encode the image.'))),
        'image/jpeg',
        quality,
      ),
    )
  }
}
