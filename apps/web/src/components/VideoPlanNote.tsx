import { formatBytes, pickOutputSize, type BitratePlan } from '@revel/core'
import type { VideoInfo } from '../lib/probeVideo'
import { WARNING } from './styles'

interface VideoPlanNoteProps {
  info: VideoInfo
  plan: BitratePlan
  maxBytes: number
  smartOptimize: boolean
}

export function VideoPlanNote({ info, plan, maxBytes, smartOptimize }: VideoPlanNoteProps) {
  if (!plan.feasible) {
    return (
      <p className={WARNING}>
        A {formatDuration(info.durationSec)} video would look too blurry under {formatBytes(maxBytes)}.{' '}
        {plan.audioKbps > 0 ? 'Try Mute audio or a bigger target.' : 'Try a bigger target.'}
      </p>
    )
  }

  const size = smartOptimize ? pickOutputSize(plan.videoKbps, info) : info
  return (
    <p className="text-sm text-slate-600 dark:text-slate-400">
      Plan: {formatDuration(info.durationSec)} at {plan.videoKbps} kbps video
      {plan.audioKbps > 0 ? ` + ${plan.audioKbps} kbps audio` : ', no audio'} · {size.width}×{size.height}
    </p>
  )
}

/** 75.4 → "1:15" */
function formatDuration(seconds: number): string {
  const total = Math.round(seconds)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}
