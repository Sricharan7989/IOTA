/* IOTA — boot label.
   The only DOM content in Phase 0. Exists to prove the layer stack: it must
   render crisply above a transparent, live WebGL canvas. */
import styles from './BootLabel.module.css'

export default function BootLabel() {
  return (
    <p className={styles.label}>
      IOTA <span className={styles.slash}>//</span> BOOT
    </p>
  )
}
