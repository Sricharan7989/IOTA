/* IOTA — masked line reveal.
   DESIGN.md §5: text reveals are per-line masked slide-ups, never per-letter
   fades. Every element marked `data-reveal` inside the scope starts pushed
   below its mask and slides up in sequence once `revealed` flips true.

   The hidden state is applied from JS, not CSS, so the copy is still visible if
   the script never runs. */
import { useEffect } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../lib/quality'

export function useMaskedReveal(scopeRef, revealed, { stagger = 0.09 } = {}) {
  // Hide on mount so nothing flashes behind the preloader. Reduced motion
  // hides with opacity instead of displacement — DESIGN.md §5 says reveals
  // become fades, not that they disappear.
  useEffect(() => {
    const scope = scopeRef.current
    if (!scope) return
    const lines = scope.querySelectorAll('[data-reveal]')
    if (prefersReducedMotion()) {
      gsap.set(lines, { opacity: 0 })
    } else {
      gsap.set(lines, { yPercent: 110 })
    }
  }, [scopeRef])

  // Then play once the intro hands over.
  useEffect(() => {
    if (!revealed) return undefined
    const scope = scopeRef.current
    if (!scope) return undefined

    const lines = scope.querySelectorAll('[data-reveal]')
    const tween = prefersReducedMotion()
      ? gsap.to(lines, { opacity: 1, duration: 0.5, ease: 'none', stagger: 0.05 })
      : gsap.to(lines, {
          yPercent: 0,
          duration: 1.2,
          ease: 'expo.out',
          stagger,
        })

    // Only kill the tween — reverting the context here would snap the lines
    // back to their hidden state.
    return () => tween.kill()
  }, [scopeRef, revealed, stagger])
}
