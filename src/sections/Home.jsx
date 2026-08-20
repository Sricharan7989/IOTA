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
   PLACEHOLDER COPY — swap these four strings for the real thing.
   Nothing else in the file needs to change.
   ======================================================================== */
const COPY = {
  eyebrow: 'IOTA CLUB',
  wordmark: 'IOTA',
  headline: 'The signal in the noise.',
  sub: 'A collective building at the edge of intelligence.',
}
/* ===================== END PLACEHOLDER COPY ============================ */

export default function Home({ revealed = false }) {
  const root = useRef(null)

  useMaskedReveal(root, revealed)
  useHeroTimeline(root)

  return (
    <section id="home" ref={root} className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <div data-parallax="0.6">
            <p className={styles.eyebrow}>
              <span className={styles.mask}>
                <span className={styles.line} data-reveal>
                  <span className={styles.diamond}>◇</span> {COPY.eyebrow}
                </span>
              </span>
            </p>
          </div>

          <div data-parallax="1">
            <h1 className={styles.wordmark}>
              <span className={styles.mask}>
                <span className={styles.line} data-reveal>
                  {COPY.wordmark}
                </span>
              </span>
            </h1>
          </div>

          <div data-parallax="1.35">
            <p className={styles.headline}>
              <span className={styles.mask}>
                <span className={styles.line} data-reveal>
                  {COPY.headline}
                </span>
              </span>
            </p>
          </div>

          <div data-parallax="1.7">
            <p className={styles.sub}>
              <span className={styles.mask}>
                <span className={styles.line} data-reveal>
                  {COPY.sub}
                </span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
