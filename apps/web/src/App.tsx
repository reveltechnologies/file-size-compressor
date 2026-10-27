import {
  calculateBitrate,
  compareFileNames,
  DEFAULT_AUDIO_KBPS,
  DEFAULT_OPTIONS,
  detectCategory,
  formatBytes,
  MAX_MERGE_PHOTOS,
  type CompressOptions,
  type FileCategory,
} from '@revel/core'
import { useRef, useState } from 'react'
import { DropZone } from './components/DropZone'
import { OptionToggles } from './components/OptionToggles'
import { ProgressBar } from './components/ProgressBar'
import { SavingsReceipt } from './components/SavingsReceipt'
import { CARD, PRIMARY_BUTTON, SECONDARY_BUTTON } from './components/styles'
import { TargetPicker } from './components/TargetPicker'
import { VideoPlanNote } from './components/VideoPlanNote'
import { compress, type CompressResult } from './engines'
import { defaultTarget, targetBytes, type Target } from './lib/target'
import { useVideoInfo } from './lib/useVideoInfo'

const CATEGORY_LABEL: Record<FileCategory, string> = {
  video: 'Video',
  image: 'Photo',
  pdf: 'PDF',
}

interface PickedFiles {
  /** Several files only when combining photos into one PDF. */
  files: File[]
  category: FileCategory
}

/** Validates a pick; returns an error message or what to process. */
function pickFiles(files: File[]): PickedFiles | string {
  const empty = files.find((file) => file.size === 0)
  if (empty) return `"${empty.name}" is empty.`

  if (files.length === 1) {
    const category = detectCategory(files[0].name, files[0].type)
    return category ? { files, category } : `"${files[0].name}" isn't supported. Try a video, photo or PDF.`
  }

  if (files.length > MAX_MERGE_PHOTOS) return `Pick up to ${MAX_MERGE_PHOTOS} photos at a time.`
  const notPhoto = files.find((file) => detectCategory(file.name, file.type) !== 'image')
  if (notPhoto) return `To combine files into one PDF, pick only photos. "${notPhoto.name}" isn't a photo.`
  return { files: [...files].sort((a, b) => compareFileNames(a.name, b.name)), category: 'pdf' }
}

function App() {
  const [picked, setPicked] = useState<PickedFiles | null>(null)
  const [target, setTarget] = useState<Target>(() => defaultTarget('video'))
  const [options, setOptions] = useState<CompressOptions>(DEFAULT_OPTIONS)
  const [progress, setProgress] = useState<number | null>(null)
  const [status, setStatus] = useState('')
  const [result, setResult] = useState<CompressResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const videoInfo = useVideoInfo(picked?.category === 'video' ? picked.files[0] : null)
  const isMerge = (picked?.files.length ?? 0) > 1
  const totalBytes = picked?.files.reduce((sum, file) => sum + file.size, 0) ?? 0
  const maxBytes = picked ? targetBytes(target, picked.category) : null
  const videoPlan =
    videoInfo && maxBytes !== null
      ? calculateBitrate({
          maxBytes,
          durationSec: videoInfo.durationSec,
          audioKbps: options.muteAudio ? 0 : DEFAULT_AUDIO_KBPS,
        })
      : null

  function handleFiles(files: File[]) {
    const pick = pickFiles(files)
    setResult(null)
    if (typeof pick === 'string') {
      setPicked(null)
      setError(pick)
      return
    }
    setError(null)
    setPicked(pick)
    setTarget(defaultTarget(pick.category))
  }

  async function handleShrink() {
    if (!picked || maxBytes === null) return
    const controller = new AbortController()
    abortRef.current = controller
    setError(null)
    setStatus('')
    setProgress(0)
    try {
      setResult(
        await compress({
          ...picked,
          maxBytes,
          options,
          onProgress: setProgress,
          onStatus: setStatus,
          signal: controller.signal,
        }),
      )
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err instanceof Error ? err.message : 'Something went wrong while shrinking.')
      }
    } finally {
      abortRef.current = null
      setProgress(null)
    }
  }

  function reset() {
    setPicked(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-svh bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="mx-auto flex max-w-xl flex-col gap-5 px-4 py-10">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Fit-to-Size File Shrinker</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Shrink videos, photos and PDFs under any upload limit. 100% on your device — nothing is
            uploaded.
          </p>
        </header>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200"
          >
            {error}
          </p>
        )}

        {picked && result && maxBytes !== null ? (
          <SavingsReceipt
            originalBytes={totalBytes}
            maxBytes={maxBytes}
            result={result}
            onReset={reset}
          />
        ) : picked && progress !== null ? (
          <section className={`${CARD} flex flex-col gap-3`}>
            <ProgressBar ratio={progress} label={status || 'Starting…'} />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Working on your device. Keep this tab open.
            </p>
            <button
              type="button"
              onClick={() => abortRef.current?.abort()}
              className={`${SECONDARY_BUTTON} self-center`}
            >
              Cancel
            </button>
          </section>
        ) : picked ? (
          <section className={`${CARD} flex flex-col gap-5`}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {isMerge ? `${picked.files.length} photos → 1 PDF` : picked.files[0].name}
                  </p>
                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                    {isMerge ? 'Photos' : CATEGORY_LABEL[picked.category]} · {formatBytes(totalBytes)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="shrink-0 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  {isMerge ? 'Change photos' : 'Change file'}
                </button>
              </div>
              {isMerge && (
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <p>Pages in this order (rename files to change it):</p>
                  {/* The height cuts a row in half, so a long list visibly scrolls on phones. */}
                  <ol className="mt-1 max-h-40 list-inside list-decimal overflow-y-auto rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
                    {picked.files.map((file, i) => (
                      <li key={i} className="truncate">
                        {file.name}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            <TargetPicker category={picked.category} target={target} onChange={setTarget} />
            {isMerge ? (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                GPS location and camera data are always removed when combining photos.
              </p>
            ) : (
              <OptionToggles category={picked.category} options={options} onChange={setOptions} />
            )}

            {videoInfo && videoPlan && maxBytes !== null && (
              <VideoPlanNote
                info={videoInfo}
                plan={videoPlan}
                maxBytes={maxBytes}
                smartOptimize={options.smartOptimize}
              />
            )}
            {!isMerge && maxBytes !== null && totalBytes <= maxBytes && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Already under {formatBytes(maxBytes)}. Shrinking will still strip hidden data.
              </p>
            )}

            <button
              type="button"
              disabled={maxBytes === null || videoPlan?.feasible === false}
              onClick={() => void handleShrink()}
              className={PRIMARY_BUTTON}
            >
              {maxBytes === null
                ? 'Enter a size limit'
                : `${isMerge ? 'Combine' : 'Shrink'} under ${formatBytes(maxBytes)}`}
            </button>
          </section>
        ) : (
          <DropZone onFiles={handleFiles} />
        )}
      </main>
    </div>
  )
}

export default App
