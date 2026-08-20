/* IOTA — global pointer tracking for the canvas.
   Returns a ref, never state. Pointer position changes on every mouse move; if
   that were React state it would re-render the tree hundreds of times a second
   and the 60fps contract in PROJECT.md would be gone immediately.

   Why not R3F's built-in `state.pointer`: the canvas layer is
   `pointer-events: none` so that the DOM above it stays clickable, which means
   R3F never receives pointer events at all. Listening on window is the only
   way to see them. */
import { useEffect, useRef } from 'react'

export function usePointer() {
  // target = raw input, current = damped value read by the render loop.
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0, down: false })

  useEffect(() => {
    const onMove = (event) => {
      pointer.current.tx = (event.clientX / window.innerWidth) * 2 - 1
      // Flip to NDC: CSS pixels grow downward, clip space grows upward.
      pointer.current.ty = -((event.clientY / window.innerHeight) * 2 - 1)
    }
    const onDown = () => {
      pointer.current.down = true
    }
    const onUp = () => {
      pointer.current.down = false
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    // Without these the warp can stick at full boost if the pointer is
    // released outside the window or the tab loses focus mid-hold.
    window.addEventListener('pointercancel', onUp, { passive: true })
    window.addEventListener('blur', onUp)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      window.removeEventListener('blur', onUp)
    }
  }, [])

  return pointer
}
