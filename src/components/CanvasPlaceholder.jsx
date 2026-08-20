/* IOTA — stand-in for the WebGL layer.
   Two jobs: hold the visual ground while the lazy canvas chunk downloads, and
   act as the permanent backdrop on devices where WebGL is unavailable. Costs
   one CSS gradient, so first paint never waits on three.js. */
import styles from './CanvasPlaceholder.module.css'

export default function CanvasPlaceholder() {
  return (
    <div className={styles.layer} aria-hidden="true">
      <p className={styles.wordmark}>IOTA</p>
    </div>
  )
}
