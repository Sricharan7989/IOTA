/* IOTA — a single magnetic nav link.
   Kept separate from Navbar because the magnetic behaviour needs its own ref
   per link, and hooks can't be called in a loop inside the parent. */
import { useMagnetic } from '../hooks/useMagnetic'
import { scrollToSection } from '../lib/scroll'
import styles from './Navbar.module.css'

export default function NavLink({ id, label, active, onActivate, onNavigate }) {
  const ref = useMagnetic()

  const handleClick = (event) => {
    // Stay a real anchor for keyboard and middle-click, but hand the scroll to
    // Lenis so it matches the rest of the page's motion.
    event.preventDefault()
    // The navbar should acknowledge the chosen destination immediately.
    // ScrollTrigger then owns the state again while the page is moving.
    onActivate?.(id)
    onNavigate?.()
    scrollToSection(id)
  }

  return (
    <a
      ref={ref}
      href={`#${id}`}
      onClick={handleClick}
      className={`${styles.link} ${active ? styles.active : ''}`}
      aria-current={active ? 'true' : undefined}
    >
      {label}
    </a>
  )
}
