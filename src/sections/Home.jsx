/* IOTA — Home / hero section.
   Bespoke rather than built on the shared <Section> shell: it owns the intro
   reveal, the parallax layers for the scroll move, and a different type scale.
   Roadmap / Resources / Team still use the shared shell.

   Two systems act on this markup, on deliberately separate elements so they
   never fight:
     [data-reveal]   — inner lines, slid up out of their masks by the intro
     [data-parallax] — outer layers, parallaxed and faded by the scroll move */
import { useRef } from 'react'
import { useMaskedReveal } from '../hooks/useMaskedReveal'
import { useHeroTimeline } from '../hooks/useHeroTimeline'
import styles from './Home.module.css'

/* ========================================================================
   PLACEHOLDER COPY — swap these strings for the real thing.
   `headingLead` / `headingAccent` render as two lines; the accent word is the
   italic gradient one. Nothing else in the file needs to change.
   ======================================================================== */
const COPY = {
  eyebrow: 'IOTA CLUB',
  headingLead: 'Building the',
  headingAccent: 'Signal.',
  cornerLeft: 'IIIT · IST',
  cornerRight: 'AI · INTERACTIVE',
  scrollCue: 'Scroll to explore',
}
/* ===================== END PLACEHOLDER COPY ============================ */

export default function Home({ revealed = false }) {
  const root = useRef(null)

  useMaskedReveal(root, revealed)
  useHeroTimeline(root)

  return (
    <section id="home" ref={root} className={styles.section}>
      <div className={styles.inner}>
        {/* ---- Top corners ---- */}
        <div className={styles.topRow} data-parallax="0.5">
          <p className={`${styles.label} ${styles.eyebrow}`}>
            <span className={styles.mask}>
              <span className={styles.line} data-reveal>
                <span className={styles.diamond}>◇</span> {COPY.eyebrow}
              </span>
            </span>
          </p>

          <p className={`${styles.label} ${styles.cornerLabel}`}>
            <span className={styles.mask}>
              <span className={styles.line} data-reveal>
                {COPY.cornerLeft}
              </span>
            </span>
          </p>
        </div>

        {/* ---- Headline ---- */}
        <div className={styles.headingBlock} data-parallax="1">
          <h1 className={styles.heading}>
            <span className={styles.mask}>
              <span className={styles.line} data-reveal>
                {COPY.headingLead}
              </span>
            </span>
            <span className={styles.mask}>
              <span className={`${styles.line} ${styles.accent}`} data-reveal>
                {COPY.headingAccent}
              </span>
            </span>
          </h1>
        </div>

        {/* ---- Bottom corners ---- */}
        <div className={styles.bottomRow} data-parallax="1.5">
          <p className={`${styles.label} ${styles.cornerLabel}`}>
            <span className={styles.mask}>
              <span className={styles.line} data-reveal>
                {COPY.cornerRight}
              </span>
            </span>
          </p>

          <p className={`${styles.label} ${styles.scrollCue}`}>
            <span className={styles.mask}>
              <span className={styles.line} data-reveal>
                {COPY.scrollCue} <span className={styles.arrow}>↓</span>
              </span>
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
