import { formatBytes } from '@revel/core'
import { useMemo } from 'react'
import type { CompressResult } from '../engines'
import { canShareFile, downloadBlob, shareBlob } from '../lib/saveFile'
import { CARD, PRIMARY_BUTTON, SECONDARY_BUTTON } from './styles'

interface SavingsReceiptProps {
  originalBytes: number
  maxBytes: number
  result: CompressResult
  onReset: () => void
}

export function SavingsReceipt({ originalBytes, maxBytes, result, onReset }: SavingsReceiptProps) {
  const { blob, fileName } = result
  const savedPercent = Math.max(0, Math.round((1 - blob.size / originalBytes) * 100))
  const fits = blob.size <= maxBytes
  const shareable = useMemo(() => canShareFile(blob, fileName), [blob, fileName])

  return (
    <section className={`${CARD} text-center`}>
      <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">
        Savings receipt
      </p>
      <p className="mt-3 text-3xl font-bold tabular-nums">
        {formatBytes(originalBytes)} →{' '}
        <span className="text-green-600 dark:text-green-400">{formatBytes(blob.size)}</span>
      </p>
      <p className="mt-2 text-sm">
        {savedPercent}% smaller ·{' '}
        {fits ? `✓ Fits under ${formatBytes(maxBytes)}` : `⚠ Still over ${formatBytes(maxBytes)}`}
      </p>
      <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{fileName}</p>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <button type="button" onClick={() => downloadBlob(blob, fileName)} className={PRIMARY_BUTTON}>
          Download
        </button>
        {shareable && (
          <button
            type="button"
            onClick={() => void shareBlob(blob, fileName).catch(console.error)}
            className={SECONDARY_BUTTON}
          >
            Share…
          </button>
        )}
        <button type="button" onClick={onReset} className={SECONDARY_BUTTON}>
          Shrink another file
        </button>
      </div>
    </section>
  )
}
