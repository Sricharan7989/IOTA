/* IOTA — scroll-triggered reveal for sections below the hero.
   The counterpart to useMaskedReveal: that one is driven by the preloader
   handing over, this one by ScrollTrigger as a section enters view.

   Two opt-in markers, on deliberately separate elements so they never fight:
     [data-reveal-line] — a line inside an overflow-hidden mask; slides up
     [data-reveal-item] — anything else; drifts up and fades in, staggered

   The hidden state is applied from JS, never from CSS. That matters twice
   over: content stays visible if the script fails, and prefers-reduced-motion
   needs no undo path — it simply never hides anything, so everything renders
   in place.

   Reveal scopes nest. A section calls this on itself, and a component inside
   it (the Academics course grid) calls it again on its own subtree so the grid
   can re-reveal when its content is swapped. Each scope stamps itself
   [data-reveal-root] and only claims markers whose *nearest* root is itself —
   otherwise the outer section would animate the inner component's items too,
   with a different stagger, and the two tweens would fight over the same
   properties. React runs child effects before parent ones, so the inner root
   is always stamped by the time the outer scope looks. */
import { useEffect } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../lib/quality'

export function useReveal(
  scopeRef,
  { start = 'top 78%', stagger = 0.08, enabled = true } = {},
) {
  useEffect(() => {
    const scope = scopeRef.current
    if (!scope || !enabled) return undefined

    // DESIGN.md §5: reduced motion renders in place. Nothing was ever hidden,
    // so there is nothing to reverse.
    if (prefersReducedMotion()) return undefined

    scope.dataset.revealRoot = ''
    const owned = (el) => el.closest('[data-reveal-root]') === scope

    const context = gsap.context(() => {
      const lines = gsap.utils.toArray('[data-reveal-line]').filter(owned)
      const items = gsap.utils.toArray('[data-reveal-item]').filter(owned)

      if (lines.length) {
        gsap.set(lines, { yPercent: 110 })
        gsap.to(lines, {
          yPercent: 0,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: scope, start },
        })
      }

      if (items.length) {
        gsap.set(items, { y: 26, opacity: 0 })
        gsap.to(items, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'expo.out',
          stagger,
          scrollTrigger: { trigger: scope, start },
        })
      }
    }, scope)

    // Reverting the context also kills every ScrollTrigger created inside it.
    return () => context.revert()
  }, [scopeRef, start, stagger, enabled])
}
