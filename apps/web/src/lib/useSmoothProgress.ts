import { useEffect, useRef, useState } from 'react'
import type { ProgressStep } from '../engines'

/** How far the bar may go in each step. It stays short of 100% until the file is really ready. */
const STEP_END: Record<ProgressStep, number> = { prepare: 0.15, shrink: 0.97, done: 1 }
/**
 * The first shrink pass stops here, keeping room for retries. When none is
 * needed the bar jumps to 100%, which feels like finishing early.
 */
const FIRST_SHRINK_END = 0.85
const TICK_MS = 100
/** Share of the gap to the real progress closed each tick, so jumps glide instead of snapping. */
const CATCH_UP = 0.3
/** While the work is quiet the bar creeps toward this far ahead of the real progress… */
const CREEP_LEAD = 0.15
/** …closing this share of the remaining gap each tick, so it slows down the nearer it gets. */
const CREEP = 0.004

interface Pass {
  step: ProgressStep
  start: number
  end: number
  ratio: number
}

/**
 * Turns the engines' raw 0…1 progress into a bar that only moves forward.
 * A new pass (a retry restarts at 0) gets half of what's left instead of
 * jumping back, and when nothing is reported the bar keeps creeping, ever
 * more slowly, so it never looks stuck.
 */
export function useSmoothProgress(step: ProgressStep, ratio: number): number {
  const [shown, setShown] = useState(0)
  const shownRef = useRef(0)
  const targetRef = useRef(0)
  const passRef = useRef<Pass>({ step, start: 0, end: STEP_END[step], ratio: 0 })

  useEffect(() => {
    const pass = passRef.current
    if (step !== pass.step || ratio < pass.ratio - 0.2) {
      const start = Math.max(shownRef.current, targetRef.current)
      const end =
        step === pass.step
          ? start + (STEP_END[step] - start) / 2
          : step === 'shrink'
            ? FIRST_SHRINK_END
            : STEP_END[step]
      passRef.current = { step, start, end: Math.max(start, end), ratio }
    } else {
      passRef.current = { ...pass, ratio }
    }
    const { start, end } = passRef.current
    // Ease out: quick at first, slowing toward the end of each pass.
    const eased = 1 - (1 - ratio) ** 2
    targetRef.current = Math.max(targetRef.current, start + (end - start) * eased)
  }, [step, ratio])

  useEffect(() => {
    const id = setInterval(() => {
      const prev = shownRef.current
      const target = targetRef.current
      const creepTo = Math.min(STEP_END[passRef.current.step], target + CREEP_LEAD)
      const next = Math.max(prev, prev + (target - prev) * CATCH_UP, prev + (creepTo - prev) * CREEP)
      shownRef.current = next
      setShown(next)
    }, TICK_MS)
    return () => clearInterval(id)
  }, [])

  return step === 'done' ? 1 : shown
}
