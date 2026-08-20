/* IOTA — intro overlay.
   Counts 0 -> 100, then wipes upward to reveal the hero. Scroll is locked for
   the duration so the first thing anyone sees is the intended frame.

   The counter is written straight to the DOM node rather than held in React
   state: it ticks ~60 times a second and there is no reason to re-render the
   tree for each one. */
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { lockScroll, unlockScroll } from '../lib/scroll'
import styles from './Preloader.module.css'

export default function Preloader({ onComplete }) {
  const root = useRef(null)
  const counter = useRef(null)
  const bar = useRef(null)
  const inner = useRef(null)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Lock scrolling. lockScroll records the intent in the scroll module, so
    // it holds even though this child effect runs before App's effect has
    // created the Lenis instance.
    lockScroll()

    const release = () => {
      unlockScroll()
      setFinished(true)
      onComplete?.()
    }

    if (reduced) {
      // No theatre for reduced motion — hand the page over immediately.
      gsap.set(root.current, { autoAlpha: 0 })
      release()
      return undefined
    }

    const progress = { value: 0 }

    const timeline = gsap.timeline({ onComplete: release })

    timeline
      .to(progress, {
        value: 100,
        duration: 1.9,
        ease: 'power2.inOut',
        onUpdate: () => {
          const value = Math.round(progress.value)
          if (counter.current) {
            counter.current.textContent = String(value).padStart(3, '0')
          }
          if (bar.current) {
            gsap.set(bar.current, { scaleX: progress.value / 100 })
          }
        },
      })
      // A held beat at 100 before the wipe; without it the reveal feels rushed.
      .to(inner.current, {
        autoAlpha: 0,
        y: -12,
        duration: 0.45,
        ease: 'power2.in',
      })
      .to(root.current, {
        yPercent: -100,
        duration: 1.1,
        ease: 'expo.inOut',
      })

    return () => {
      timeline.kill()
      unlockScroll()
    }
  }, [onComplete])

  return (
    <div
      ref={root}
      className={`${styles.root} ${finished ? styles.done : ''}`}
      aria-hidden={finished ? 'true' : undefined}
      role="status"
      aria-label="Loading"
    >
      <div ref={inner} className={styles.inner}>
        <p className={styles.wordmark}>IOTA</p>
        <div className={styles.track}>
          <span ref={bar} className={styles.bar} />
        </div>
        <p ref={counter} className={styles.counter}>
          000
        </p>
      </div>
    </div>
  )
}
