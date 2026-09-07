/* IOTA - the section's own entrance moves.
   useReveal handles the general case: anything marked [data-reveal-item] or
   [data-reveal-line] drifts or slides in. This hook adds the two moves that
   are specific to a section's masthead and would be wrong as generic markers:

     [data-connector] - the mono index's rule, drawn out from its start rather
                        than faded in, so the label reads as being struck
     [data-divider]   - the full-bleed rule at the top of the section, drawn
                        the same way and for the same reason
     [data-parallax-heading] - the big title, drifting against the scroll for
                        the whole time the section is on screen

   The parallax deliberately lives on the heading's OUTER element while the
   masked slide-up lives on the inner line. Two transforms on one node would
   overwrite each other, and the one that lost would be whichever GSAP wrote
   second - which is not a thing worth debugging later.

   Under prefers-reduced-motion neither runs: the rule is simply drawn and the
   heading simply sits there, which is the finished state either way. */
import { useEffect } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../lib/quality'

export function useSectionMotion(scopeRef, { parallax = 8 } = {}) {
  useEffect(() => {
    const scope = scopeRef.current
    if (!scope) return undefined
    if (prefersReducedMotion()) return undefined

    const context = gsap.context(() => {
      const connector = scope.querySelector('[data-connector]')
      const divider = scope.querySelector('[data-divider]')
      const heading = scope.querySelector('[data-parallax-heading]')

      if (connector) {
        gsap.fromTo(
          connector,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.9,
            ease: 'expo.out',
            scrollTrigger: { trigger: scope, start: 'top 78%' },
          },
        )
      }

      // Earlier and slower than the connector: the divider is the section's
      // top edge, so it should already be drawing as the section arrives
      // rather than waiting for the masthead to be in view.
      if (divider) {
        gsap.fromTo(
          divider,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.4,
            ease: 'expo.out',
            scrollTrigger: { trigger: scope, start: 'top 96%' },
          },
        )
      }

      if (heading) {
        // Percent of its own height, so the drift scales with the type rather
        // than being a fixed pixel amount that reads huge on a phone.
        gsap.fromTo(
          heading,
          { yPercent: parallax },
          {
            yPercent: -parallax,
            ease: 'none',
            scrollTrigger: {
              trigger: scope,
              start: 'top bottom',
              end: 'bottom top',
              // Enough catch-up that it drifts rather than tracks.
              scrub: 1,
            },
          },
        )
      }
    }, scope)

    return () => context.revert()
  }, [scopeRef, parallax])
}
