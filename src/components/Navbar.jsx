/* IOTA — fixed navbar.
   Wordmark left, magnetic links right. Two pieces of scroll-driven state, both
   of which change a handful of times across the whole page, so React state is
   the right tool here — unlike per-frame values, which live in scrollState. */
import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SECTIONS } from '../sections/manifest'
import { scrollToSection } from '../lib/scroll'
import NavLink from './NavLink'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id)
  const [pastHero, setPastHero] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    // gsap.context scopes every trigger created inside it so a single revert()
    // tears them all down — important under StrictMode's double-mount.
    const context = gsap.context(() => {
      SECTIONS.forEach(({ id }) => {
        ScrollTrigger.create({
          trigger: `#${id}`,
          // A section is active through the central viewing area. Starting
          // before the midpoint is important for the final sections: at the
          // bottom of the document they can be visible without ever reaching
          // a 50% top offset.
          start: 'top 80%',
          end: 'bottom 20%',
          // Use directional enter callbacks rather than onToggle. `onToggle`
          // can miss a very short active interval when Lenis eases through a
          // section; explicit callbacks keep every manifest section,
          // including Projects, in sync in both scroll directions.
          onEnter: () => setActiveId(id),
          onEnterBack: () => setActiveId(id),
        })
      })

      ScrollTrigger.create({
        trigger: `#${SECTIONS[0].id}`,
        start: 'bottom top+=64',
        onEnter: () => setPastHero(true),
        onLeaveBack: () => setPastHero(false),
      })
    })

    return () => context.revert()
  }, [])

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const handleBrandClick = (event) => {
    event.preventDefault()
    scrollToSection(SECTIONS[0].id)
  }

  return (
    <header className={`${styles.nav} ${pastHero ? styles.past : ''} ${menuOpen ? styles.open : ''}`}>
      <a href={`#${SECTIONS[0].id}`} onClick={handleBrandClick} className={styles.brand}>
        IOTA
        <span className={styles.dot} aria-hidden="true" />
      </a>

      <button
        type="button"
        className={styles.menuButton}
        aria-expanded={menuOpen}
        aria-controls="site-navigation"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        onClick={() => setMenuOpen((isOpen) => !isOpen)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      <nav id="site-navigation" className={styles.links} aria-label="Sections">
        {SECTIONS.map(({ id, label }) => (
          <NavLink
            key={id}
            id={id}
            label={label}
            active={activeId === id}
            onActivate={setActiveId}
            onNavigate={() => setMenuOpen(false)}
          />
        ))}
      </nav>
    </header>
  )
}
