/* IOTA — framing layer behind the canvas.
   A vignette that closes the composition down at the edges, keeping the eye on
   the centre of frame where the mass lives.

   It sits at --z-backdrop (-1), behind the WebGL layer. That is deliberate: it
   frames the *void* the particles live in rather than dimming the particles
   themselves. Darkening the particles is the post-processing Vignette's job,
   and it runs on the top tier only — this one is always there. */
import styles from './Backdrop.module.css'

export default function Backdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <span className={styles.horizon} />
    </div>
  )
}
