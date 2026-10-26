interface ProgressBarProps {
  ratio: number
  label: string
}

export function ProgressBar({ ratio, label }: ProgressBarProps) {
  const percent = Math.round(ratio * 100)

  return (
    <div>
      <div className="mb-2 flex justify-between gap-3 text-sm">
        <span className="truncate">{label}</span>
        <span className="tabular-nums">{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
      >
        <div className="h-full rounded-full bg-blue-600 transition-[width]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
