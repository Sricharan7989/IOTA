/* IOTA - the chip tablist.
   Written for the roadmap's nine domains and reused verbatim by the Academics
   semester tabs, which is the whole point: two selectors that look and behave
   differently would read as two different sites.

   A real tablist: arrow keys move between items, Home/End jump to the ends,
   and a roving tabindex keeps exactly one chip in the tab order. Without that
   a nine-item row is nine extra tab stops between the user and the content.

   The active state is ONE element that slides and morphs between chips, not a
   fill that switches off here and on over there. That single moving pill is
   what ties the selection to the content swap underneath it - you watch the
   thing you picked travel to where you picked it.

   `tracks` is anything with { slug, label }. `panelPrefix` must match the id
   the consumer puts on its tabpanel, so aria-controls actually resolves.

   Selection is React state and belongs there - it changes on click, not on
   every frame, so the 60fps contract does not apply. */
import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../lib/quality'
import styles from './TrackSelector.module.css'

export default function TrackSelector({
  tracks,
  activeSlug,
  onSelect,
  label = 'Roadmap domains',
  panelPrefix = 'roadmap-panel',
}) {
  const listRef = useRef(null)
  const indicator = useRef(null)
  // First placement must not animate in from x:0 - the pill would fly across
  // the row on mount.
  const placed = useRef(false)

  // Layout effect, not effect: the indicator has to be measured and positioned
  // in the same frame the chips are laid out, or it flashes at the origin.
  useLayoutEffect(() => {
    const list = listRef.current
    const pill = indicator.current
    if (!list || !pill) return undefined

    const place = (animate) => {
      const chip = list.querySelector(`[data-slug="${activeSlug}"]`)
      if (!chip) return

      // offsetLeft is relative to .list, which is the pill's positioned
      // ancestor - so this stays correct however far the row is scrolled.
      const to = { x: chip.offsetLeft, width: chip.offsetWidth }

      if (!animate) {
        gsap.set(pill, { ...to, opacity: 1 })
        return
      }

      // Width, not scaleX. A pill this round distorts visibly when scaled,
      // and DESIGN.md 5's transform-only rule is about not dirtying document
      // layout - this element is absolutely positioned and `contain: layout`,
      // so its width can only ever re-lay-out itself, on click, never per
      // frame. See TrackSelector.module.css.
      gsap.to(pill, { ...to, duration: 0.55, ease: 'expo.out', overwrite: true })
    }

    place(placed.current && !prefersReducedMotion())
    placed.current = true

    // Two ways a chip's width can change under us. The viewport resizing is
    // the obvious one; the mono face swapping in is the one that bites, since
    // it changes every chip's width without changing the full-width row's.
    const observer = new ResizeObserver(() => place(false))
    observer.observe(list)

    let stale = false
    document.fonts?.ready.then(() => {
      if (!stale) place(false)
    })

    return () => {
      stale = true
      observer.disconnect()
    }
  }, [activeSlug, tracks])

  // Keep the selected chip in view in the horizontally scrolling row, however
  // the selection was made.
  useEffect(() => {
    const chip = listRef.current?.querySelector(`[data-slug="${activeSlug}"]`)
    chip?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [activeSlug])

  const handleKeyDown = (event) => {
    const currentIndex = tracks.findIndex((track) => track.slug === activeSlug)
    let nextIndex = null

    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tracks.length
    if (event.key === 'ArrowLeft')
      nextIndex = (currentIndex - 1 + tracks.length) % tracks.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = tracks.length - 1

    if (nextIndex === null) return

    event.preventDefault()
    const next = tracks[nextIndex]
    onSelect(next.slug)

    // Move focus with selection; the effect above handles bringing it on
    // screen.
    listRef.current?.querySelector(`[data-slug="${next.slug}"]`)?.focus()
  }

  return (
    <div className={styles.wrap}>
      <div
        ref={listRef}
        className={styles.list}
        role="tablist"
        aria-label={label}
        onKeyDown={handleKeyDown}
      >
        {/* The one active state, shared by every chip. Decorative: the real
            state is on the buttons, in aria-selected. */}
        <span ref={indicator} className={styles.indicator} aria-hidden="true" />

        {tracks.map((track) => {
          const isActive = track.slug === activeSlug
          return (
            <button
              key={track.slug}
              type="button"
              role="tab"
              data-slug={track.slug}
              aria-selected={isActive}
              aria-controls={`${panelPrefix}-${track.slug}`}
              tabIndex={isActive ? 0 : -1}
              className={`${styles.chip} ${isActive ? styles.active : ''}`}
              onClick={() => onSelect(track.slug)}
            >
              {track.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
