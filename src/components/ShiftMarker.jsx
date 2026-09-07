/* IOTA - the threshold.
   A hairline rule with one mono word on it, sitting in flow exactly where the
   hero ends and the content world begins. It names the moment the two rooms
   swap - and it doubles as the divider for that boundary, which is why
   Roadmap is the one content section without a top rule of its own.

   Decorative, so it is aria-hidden: "SHIFT" is a note about the art direction,
   not a heading, and announcing it would put a meaningless word between the
   hero and the first real section.

   It animates off its own position rather than off the hero's, because that is
   what it is reacting to: itself arriving. Scrubbed, so scrolling back up
   un-draws it exactly the way it drew. */
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../lib/quality'
import { SHIFT_SCRUB } from '../lib/shift'
import styles from './ShiftMarker.module.css'

export default function ShiftMarker() {
  const root = useRef(null)

  useEffect(() => {
    const scope = root.current
    if (!scope) return undefined

    // DESIGN.md 5: reduced motion renders it in place. Nothing was hidden from
    // CSS, so there is nothing to undo.
    if (prefersReducedMotion()) return undefined

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          // From the moment it appears at the bottom edge until it has risen
          // into the upper third - it is fully drawn well before it reaches
          // the top of the frame.
          start: 'top bottom',
          end: 'top 62%',
          scrub: SHIFT_SCRUB,
        },
      })

      timeline
        .fromTo(scope, { opacity: 0 }, { opacity: 1, ease: 'none' }, 0)
        // The rules draw outward from the label, so the line reads as being
        // struck at the moment you cross it.
        .fromTo(
          scope.querySelectorAll('[data-rule]'),
          { scaleX: 0 },
          { scaleX: 1, ease: 'none' },
          0,
        )
    }, scope)

    return () => context.revert()
  }, [])

  return (
    <div ref={root} className={styles.marker} aria-hidden="true">
      <span className={`${styles.rule} ${styles.left}`} data-rule />
      <span className={styles.label}>
        <span className={styles.diamond}>&#9671;</span> Shift
      </span>
      <span className={`${styles.rule} ${styles.right}`} data-rule />
    </div>
  )
}
