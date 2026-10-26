import { formatBytes, PRESETS } from '@revel/core'

function App() {
  return (
    <main className="min-h-svh flex items-center justify-center bg-slate-50 p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold">Fit-to-Size File Shrinker</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Shrink videos, photos and PDFs to an exact MB limit — 100% on your
          device, nothing uploaded.
        </p>
        <ul className="mt-6 flex flex-wrap justify-center gap-2">
          {PRESETS.map((preset) => (
            <li
              key={preset.id}
              className="rounded-full border border-slate-300 px-3 py-1 text-sm dark:border-slate-700"
            >
              {preset.label} · {formatBytes(preset.maxBytes)}
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}

export default App
