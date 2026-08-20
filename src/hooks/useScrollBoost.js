/* IOTA — TEMPORARY scroll energy source for the warp.
   ---------------------------------------------------------------------------
   PHASE 2 REPLACES THIS. Lenis will own scroll, and this hook should be swapped
   for a read of Lenis's own velocity. The seam is deliberately narrow: it
   returns a ref holding a 0..1 "energy" value, and WarpField only ever reads
   that. Swapping the source should not require touching the shader or the
   component.
   ---------------------------------------------------------------------------

   There is nothing to scroll yet (the page is a single 100svh screen), so this
   listens to raw wheel deltas rather than scroll position. It only accumulates;
   the consumer decays it inside useFrame, where the frame delta is available
   and the decay can be made frame-rate independent per DESIGN.md §5. */
import { useEffect, useRef } from 'react'

export function useScrollBoost({ sensitivity = 0.0016 } = {}) {
  const energy = useRef(0)

  useEffect(() => {
    const onWheel = (event) => {
      energy.current = Math.min(
        1,
        energy.current + Math.abs(event.deltaY) * sensitivity,
      )
    }
    // Also catch real scrolling, so this keeps working the moment Phase 2 adds
    // scrollable sections.
    let lastY = window.scrollY
    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastY)
      lastY = window.scrollY
      energy.current = Math.min(1, energy.current + delta * sensitivity)
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
    }
  }, [sensitivity])

  return energy
}
