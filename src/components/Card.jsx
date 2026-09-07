/* IOTA - the card surface for the whole content world.
   One component so that a roadmap stage, a course, a resource and a team
   member all react to a pointer with the same hand. Cohesion here is not a
   nicety: four sections that each invented their own hover would read as four
   different sites.

   It owns the surface (raised near-black, violet hairline, radius, padding),
   the pointer motion (tilt + sheen + lift, via useCardMotion) and the hover
   state. Callers own the layout around it and the content inside it.

   Two contracts callers rely on:
     [data-card]         - the element itself, for imperative lookups
     [data-card-content] - the inner wrapper, so a caller can stagger the
                           children it actually rendered without also
                           animating the sheen

   Pass `className` to add layout; do not restyle the surface from outside. */
import { useCardMotion } from '../hooks/useCardMotion'
import styles from './Card.module.css'

export default function Card({ children, className = '', ...rest }) {
  const { card, sheen } = useCardMotion()

  return (
    <article
      ref={card}
      className={`${styles.card} ${className}`}
      data-card
      {...rest}
    >
      {/* A fixed-size circle that gets translated, never re-gradiented - so
          following the pointer is a composite, not a repaint. */}
      <span ref={sheen} className={styles.sheen} aria-hidden="true" />

      <div className={styles.content} data-card-content>
        {children}
      </div>
    </article>
  )
}
