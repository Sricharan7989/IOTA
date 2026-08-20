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

  useEffect(() => {
    // gsap.context scopes every trigger created inside it so a single revert()
    // tears them all down — important under StrictMode's double-mount.
    const context = gsap.context(() => {
      SECTIONS.forEach(({ id }) => {
        ScrollTrigger.create({
          trigger: `#${id}`,
          // A section counts as active once it crosses the middle of the
          // viewport, which is where the eye actually is.
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => {
            if (self.isActive) setActiveId(id)
          },
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

  const handleBrandClick = (event) => {
    event.preventDefault()
    scrollToSection(SECTIONS[0].id)
  }

  return (
    <header className={`${styles.nav} ${pastHero ? styles.past : ''}`}>
      <a href={`#${SECTIONS[0].id}`} onClick={handleBrandClick} className={styles.brand}>
        IOTA
        <span className={styles.dot} aria-hidden="true" />
      </a>

      <nav className={styles.links} aria-label="Sections">
        {SECTIONS.map(({ id, label }) => (
          <NavLink key={id} id={id} label={label} active={activeId === id} />
        ))}
      </nav>
    </header>
  )
}
