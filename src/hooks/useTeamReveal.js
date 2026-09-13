/* IOTA - the Team section's tiered entrance.
   Rank is expressed twice: once in card size (TeamCard.module.css) and once
   here, in how much a card is allowed to move. The two have to agree, or the
   hierarchy reads as an accident.

   FIVE tiers, THREE intensities. That mismatch is the whole design. Five
   different entrances on one screen is noise; three groups read as an order.
   Size is what separates all five - motion only has to separate them into
   bands.

     TOP   [data-tier-top]   Mentor, Advisor.
                             Scale + rise from further, 1.4s, then a light
                             sweep across the face, then a gentle float that
                             never stops. Both get it: they are two people at
                             one rank, not a first and a second.

     MID   [data-mid-row]    Coordinators, Executives.
                             Rise and fade, 0.85s, staggered along each row.
                             Each row staggers independently, so the second
                             row is not still waiting on the first. No scale,
                             no sweep, no float.

     BASE  (not here)        Members. Marked [data-reveal-item], staggered by
                             the enclosing <Section> with the same baseline
                             every other section uses - which is the point.
                             The tier that gets nothing special has to
                             actually get nothing special.

   Why a TOP card needs three nested elements:
     [data-tier-top]   the entrance   (y, scale, opacity)
     [data-float]      the float      (y, forever)
     <Card>            tilt and lift  (rotationX/Y and y, from useCardMotion)
   All three write `transform`. On one element the float would erase the
   entrance's resting position and the tilt would fight both. Three elements,
   three transforms, no collisions - the same separation the reveal already
   uses between a grid cell and the card inside it.

   Under prefers-reduced-motion this hook returns before touching anything.
   Nothing is ever hidden, so there is no undo path: every tier renders in
   place, at its correct size, and the hierarchy still reads. */
import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../lib/quality'

export function useTeamReveal(scopeRef) {
  useEffect(() => {
    const scope = scopeRef.current
    if (!scope) return undefined

    // DESIGN.md 5. No scrub, no float, no sweep - and nothing was hidden, so
    // there is nothing to reverse.
    if (prefersReducedMotion()) return undefined

    const context = gsap.context(() => {
      // ---- TOP: every solo card at the head of the section ----
      gsap.utils.toArray('[data-tier-top]').forEach((top) => {
        // Scoped to THIS card, not the section: two top tiers each own a
        // float and a sweep, and a section-wide query would hand both to the
        // first one.
        const floatEl = top.querySelector('[data-float]')
        const sweep = top.querySelector('[data-sweep]')

        const entrance = gsap.timeline({
          scrollTrigger: { trigger: top, start: 'top 85%' },
        })

        // From further away and for longer than anything else on the page.
        entrance.fromTo(
          top,
          { y: 72, scale: 0.9, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 1.4, ease: 'expo.out' },
        )

        if (sweep) {
          // Starts before the card has finished settling, so the light reads
          // as arriving with it rather than as a second, separate event.
          entrance
            .fromTo(
              sweep,
              { xPercent: -60 },
              { xPercent: 420, duration: 1.7, ease: 'sine.inOut' },
              0.5,
            )
            // Faded in and out around the travel: a band that pops on at the
            // edge of the card looks like a seam.
            .fromTo(sweep, { opacity: 0 }, { opacity: 1, duration: 0.45 }, 0.5)
            .to(sweep, { opacity: 0, duration: 0.55 }, 1.65)
        }

        if (!floatEl) return

        // Paused until the entrance lands, and paused again whenever the card
        // is off screen - an infinite tween has no reason to tick for a
        // section nobody is looking at.
        const float = gsap.to(floatEl, {
          y: -10,
          duration: 3.6,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          paused: true,
        })

        let landed = false
        entrance.eventCallback('onComplete', () => {
          landed = true
          float.play()
        })

        ScrollTrigger.create({
          trigger: top,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => {
            if (self.isActive && landed) float.play()
            else float.pause()
          },
        })
      })

      // ---- MID: every centred row ----
      gsap.utils.toArray('[data-mid-row]').forEach((row) => {
        const cells = Array.from(row.querySelectorAll('[data-tier-mid]'))
        if (!cells.length) return

        gsap.set(cells, { y: 34, opacity: 0 })
        gsap.to(cells, {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'expo.out',
          // Along the row, so it reads left to right as one gesture rather
          // than every card arriving at once.
          stagger: 0.09,
          // The row, not its first card: they enter the viewport together and
          // the stagger should be the only thing separating them.
          scrollTrigger: { trigger: row, start: 'top 88%' },
        })
      })
    }, scope)

    // Reverting the context kills every tween and ScrollTrigger inside it,
    // the infinite floats included.
    return () => context.revert()
  }, [scopeRef])
}
