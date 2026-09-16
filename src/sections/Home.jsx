/* IOTA — Home / hero section.
   Corner-anchored composition: the type is pinned to the four corners of the
   frame and the entire centre belongs to the centerpiece. Bespoke rather than
   built on the shared <Section> shell — it owns the intro reveal, the parallax
   layers for the scroll move, and a different type scale.

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

   `descriptionAccent` is the italic, gradient-filled word; it and the three
   description fragments render as three lines. Nothing else in the file needs
   to change when this copy does.
   ======================================================================== */
const COPY = {
  eyebrow: 'IOTA CLUB',
  statementLead: 'We are',
  statementMain: 'IOTA',
  // The bottom-right tagline, set as three masked lines.
  // `descriptionAccent` is the italic, gradient-filled word and it leads.
  descriptionAccent: 'First',
  descriptionLead: 'Tech Club',
  descriptionMid: 'in IIIT Sri City',
  descriptionTail: '',
}
/* ===================== END PLACEHOLDER COPY ============================ */

export default function Home({ revealed = false }) {
  const root = useRef(null)

  useMaskedReveal(root, revealed)
  useHeroTimeline(root)

  return (
    <section id="home" ref={root} className={styles.section}>
      {/* ---- Top corners ---- */}
      <div className={styles.topRow} data-parallax="0.45">
        <p className={styles.eyebrow}>
          <span className={styles.mask}>
            <span className={styles.line} data-reveal>
              <span className={styles.diamond}>◇</span> {COPY.eyebrow}
            </span>
          </span>
        </p>

      </div>

      {/* ---- Bottom corners ---- */}
      <div className={styles.bottomRow} data-parallax="1.15">
        <h1 className={styles.statement}>
          <span className={styles.mask}>
            <span className={`${styles.line} ${styles.statementLead}`} data-reveal>
              {COPY.statementLead}
            </span>
          </span>
          <span className={styles.mask}>
            <span className={styles.line} data-reveal>
              {COPY.statementMain}
            </span>
          </span>
        </h1>

        <p className={styles.description}>
          <span className={styles.mask}>
            <span className={styles.line} data-reveal>
              <span className={styles.accent}>{COPY.descriptionAccent}</span>{' '}
              {COPY.descriptionLead}
            </span>
          </span>
          <span className={styles.mask}>
            <span className={styles.line} data-reveal>
              {COPY.descriptionMid}
            </span>
          </span>
          <span className={styles.mask}>
            <span className={styles.line} data-reveal>
              {COPY.descriptionTail}
            </span>
          </span>
        </p>
      </div>
    </section>
  )
}
