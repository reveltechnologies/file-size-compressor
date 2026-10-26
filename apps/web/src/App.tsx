import {
  calculateBitrate,
  DEFAULT_AUDIO_KBPS,
  DEFAULT_OPTIONS,
  detectCategory,
  formatBytes,
  type CompressOptions,
  type FileCategory,
} from '@revel/core'
import { useState } from 'react'
import { DropZone } from './components/DropZone'
import { OptionToggles } from './components/OptionToggles'
import { ProgressBar } from './components/ProgressBar'
import { SavingsReceipt } from './components/SavingsReceipt'
import { CARD, PRIMARY_BUTTON, WARNING } from './components/styles'
import { TargetPicker } from './components/TargetPicker'
import { VideoPlanNote } from './components/VideoPlanNote'
import { compress, IS_SIMULATED, type CompressResult } from './engines'
import { defaultTarget, targetBytes, type Target } from './lib/target'
import { useVideoInfo } from './lib/useVideoInfo'

const CATEGORY_LABEL: Record<FileCategory, string> = {
  video: 'Video',
  image: 'Photo',
  pdf: 'PDF',
}

interface PickedFile {
  file: File
  category: FileCategory
}

function App() {
  const [picked, setPicked] = useState<PickedFile | null>(null)
  const [target, setTarget] = useState<Target>(() => defaultTarget('video'))
  const [options, setOptions] = useState<CompressOptions>(DEFAULT_OPTIONS)
  const [progress, setProgress] = useState<number | null>(null)
  const [result, setResult] = useState<CompressResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const videoInfo = useVideoInfo(picked?.category === 'video' ? picked.file : null)
  const maxBytes = picked ? targetBytes(target, picked.category) : null
  const videoPlan =
    videoInfo && maxBytes !== null
      ? calculateBitrate({
          maxBytes,
          durationSec: videoInfo.durationSec,
          audioKbps: options.muteAudio ? 0 : DEFAULT_AUDIO_KBPS,
        })
      : null

  function handleFile(file: File) {
    const category = detectCategory(file.name, file.type)
    setResult(null)
    if (!category || file.size === 0) {
      setPicked(null)
      setError(
        file.size === 0
          ? `"${file.name}" is empty.`
          : `"${file.name}" isn't supported. Try a video, photo or PDF.`,
      )
      return
    }
    setError(null)
    setPicked({ file, category })
    setTarget(defaultTarget(category))
  }

  async function handleShrink() {
    if (!picked || maxBytes === null) return
    setError(null)
    setProgress(0)
    try {
      setResult(
        await compress({ ...picked, maxBytes, options, onProgress: setProgress }),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while shrinking.')
    } finally {
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

        {IS_SIMULATED && (
          <p className={WARNING}>
            Preview build: shrinking is simulated and downloaded files won't open yet.
          </p>
        )}

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
            originalBytes={picked.file.size}
            maxBytes={maxBytes}
            result={result}
            onReset={reset}
          />
        ) : picked && progress !== null ? (
          <section className={`${CARD} flex flex-col gap-3`}>
            <ProgressBar ratio={progress} label={`Shrinking ${picked.file.name}…`} />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Working on your device. Keep this tab open.
            </p>
          </section>
        ) : picked ? (
          <section className={`${CARD} flex flex-col gap-5`}>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{picked.file.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {CATEGORY_LABEL[picked.category]} · {formatBytes(picked.file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={reset}
                className="shrink-0 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Change file
              </button>
            </div>

            <TargetPicker category={picked.category} target={target} onChange={setTarget} />
            <OptionToggles category={picked.category} options={options} onChange={setOptions} />

            {videoInfo && videoPlan && maxBytes !== null && (
              <VideoPlanNote
                info={videoInfo}
                plan={videoPlan}
                maxBytes={maxBytes}
                smartOptimize={options.smartOptimize}
              />
            )}
            {maxBytes !== null && picked.file.size <= maxBytes && (
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
              {maxBytes === null ? 'Enter a size limit' : `Shrink under ${formatBytes(maxBytes)}`}
            </button>
          </section>
        ) : (
          <DropZone onFile={handleFile} />
        )}
      </main>
    </div>
  )
}

export default App
