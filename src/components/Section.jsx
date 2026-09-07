/* IOTA - shared section shell.
   Mono index label, masked display heading, and a slot for whatever the
   section actually is. Every section below the hero uses this; the hero is
   deliberately bespoke because it owns the intro reveal and a different
   type scale.

   Reveal is opt-in via data attributes on children - see useReveal.js. The
   shell marks up its own label and heading; children add
   [data-reveal-item] to join the stagger.

   The masthead's moves - the connector rule drawing out, the top divider
   drawing in, and the big heading drifting against the scroll - are
   useSectionMotion's, keyed off [data-connector], [data-divider] and
   [data-parallax-heading] below.

   The heading is the loudest thing in the content world by design: it is the
   first thing you should see on landing in a section. Solid text with a
   blue-violet glow, and deliberately NOT a gradient fill - see the warning in
   Section.module.css about what that cost. */
import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useSectionMotion } from '../hooks/useSectionMotion'
import styles from './Section.module.css'

export default function Section({
  id,
  index,
  label,
  heading,
  blurb,
  children,
}) {
  const root = useRef(null)
  useReveal(root)
  useSectionMotion(root)

  return (
    <section id={id} ref={root} className={styles.section}>
      {/* Drawn in on scroll by useSectionMotion. An element rather than a
          border so it can be scaled; CSS decides which sections show one. */}
      <span className={styles.divider} data-divider aria-hidden="true" />

      <div className={styles.inner}>
        <p className={styles.index} data-reveal-item>
          <span className={styles.number}>{index}</span>
          <span className={styles.rule} data-connector aria-hidden="true" />
          <span className={styles.name}>{label}</span>
        </p>

        {heading ? (
          <h2 className={styles.heading} data-parallax-heading>
            <span className={styles.mask}>
              <span className={styles.line} data-reveal-line>
                {heading}
              </span>
            </span>
          </h2>
        ) : null}

        {blurb ? (
          <p className={styles.blurb} data-reveal-item>
            {blurb}
          </p>
        ) : null}

        {children}
      </div>
    </section>
  )
}
