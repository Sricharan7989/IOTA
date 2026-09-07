/* IOTA - the custom cursor.
   A dot that tracks the pointer closely and a ring that lags behind it and
   swells over anything you can actually interact with. The lag is the whole
   effect: a ring pinned to the pointer is just a bigger cursor.

   It mounts only where it makes sense, and the fallbacks are the native
   cursor, which is never worse than fine:
     - coarse pointers   there is nothing to draw
     - reduced motion    a thing that chases the pointer is exactly what
                         prefers-reduced-motion is asking us not to do

   The native cursor is hidden only while this is mounted (global.css keys off
   [data-custom-cursor] on <html>), so when this bails out for either reason
   above, the real cursor is still there.

   What counts as interactive is asked of the DOM rather than maintained as a
   list: any <a>, <button>, or anything opting in with [data-cursor]. Sections
   get the behaviour by being built out of real controls, which they are. */
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { hasFinePointer } from '../hooks/useCardMotion'
import { prefersReducedMotion } from '../lib/quality'
import styles from './Cursor.module.css'

const INTERACTIVE = 'a, button, [role="tab"], [data-cursor]'

export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    const dotEl = dot.current
    const ringEl = ring.current
    if (!dotEl || !ringEl) return undefined
    if (prefersReducedMotion() || !hasFinePointer()) return undefined

    const root = document.documentElement
    root.dataset.customCursor = ''

    // Two speeds. The dot is near-instant, the ring is heavy - which is what
    // reads as weight rather than as lag.
    const dotX = gsap.quickTo(dotEl, 'x', { duration: 0.12, ease: 'power3.out' })
    const dotY = gsap.quickTo(dotEl, 'y', { duration: 0.12, ease: 'power3.out' })
    const ringX = gsap.quickTo(ringEl, 'x', { duration: 0.5, ease: 'expo.out' })
    const ringY = gsap.quickTo(ringEl, 'y', { duration: 0.5, ease: 'expo.out' })

    let visible = false

    const handleMove = (event) => {
      if (!visible) {
        visible = true
        gsap.to([dotEl, ringEl], { opacity: 1, duration: 0.3 })
        // Jump both to the pointer before the first damped move, or they
        // sweep in from the corner of the screen.
        gsap.set([dotEl, ringEl], { x: event.clientX, y: event.clientY })
      }
      dotX(event.clientX)
      dotY(event.clientY)
      ringX(event.clientX)
      ringY(event.clientY)
    }

    // One delegated pair of listeners on the document rather than listeners
    // per control: sections mount and unmount as tracks and semesters switch,
    // and nothing here should have to know that.
    const handleOver = (event) => {
      if (event.target.closest?.(INTERACTIVE)) ringEl.classList.add(styles.grown)
    }
    const handleOut = (event) => {
      if (event.target.closest?.(INTERACTIVE)) ringEl.classList.remove(styles.grown)
    }

    const handleLeave = () => {
      visible = false
      gsap.to([dotEl, ringEl], { opacity: 0, duration: 0.2 })
    }

    window.addEventListener('pointermove', handleMove, { passive: true })
    document.addEventListener('pointerover', handleOver, { passive: true })
    document.addEventListener('pointerout', handleOut, { passive: true })
    // pointerleave does not bubble, so it has to go on the element the
    // pointer actually leaves.
    root.addEventListener('pointerleave', handleLeave, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerover', handleOver)
      document.removeEventListener('pointerout', handleOut)
      root.removeEventListener('pointerleave', handleLeave)
      gsap.killTweensOf([dotEl, ringEl])
      delete root.dataset.customCursor
    }
  }, [])

  return (
    <>
      <span ref={ring} className={styles.ring} aria-hidden="true" />
      <span ref={dot} className={styles.dot} aria-hidden="true" />
    </>
  )
}
