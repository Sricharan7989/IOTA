/* IOTA — hero corner pills.
   Two magnetic pills in the hero's top-right, Lusion-style.

   Both are real controls, not decoration:
     JOIN — scrolls to the last section, which is where joining lives.
     MENU — scrolls to the first content section after the hero.
   The full section list already lives in the fixed navbar directly above
   these, so MENU deliberately does not duplicate it as a dropdown; there is
   no separate menu system to open, and a pill that opens nothing would be
   fake UI. */
import { useMagnetic } from '../hooks/useMagnetic'
import { scrollToSection } from '../lib/scroll'
import { SECTIONS } from '../sections/manifest'
import styles from './HeroPills.module.css'

/* ============ PLACEHOLDER COPY — swap freely ============ */
const COPY = {
  join: 'Join',
  menu: 'Menu',
}
/* ================= END PLACEHOLDER COPY ================= */

function Pill({ label, targetId, primary = false }) {
  const ref = useMagnetic({ strength: 0.28 })

  const handleClick = (event) => {
    // Stays a real anchor for keyboard and middle-click; Lenis takes the scroll
    // so it matches the rest of the page's motion.
    event.preventDefault()
    scrollToSection(targetId)
  }

  return (
    <a
      ref={ref}
      href={`#${targetId}`}
      onClick={handleClick}
      className={`${styles.pill} ${primary ? styles.primary : ''}`}
    >
      {label}
    </a>
  )
}

export default function HeroPills() {
  const first = SECTIONS[1] ?? SECTIONS[0]
  const last = SECTIONS[SECTIONS.length - 1]

  return (
    <div className={styles.pills}>
      <Pill label={COPY.join} targetId={last.id} primary />
      <Pill label={COPY.menu} targetId={first.id} />
    </div>
  )
}
