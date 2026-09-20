/* IOTA - one event.
   Built on the shared <Card>, so an event reacts to a pointer with the same
   hand as a roadmap stage, a course or a team member (DESIGN.md 8). What this
   file adds is the event layout: a media area, a date and status row, the
   copy, and a footer of metadata.

   The media area is full-bleed to the card's edges, which means cancelling
   Card's padding with a negative margin. `--card-pad` below has to stay in
   step with Card's own padding - it is declared once here and overridden once
   at the same breakpoint Card uses, so there is exactly one pair of numbers
   to keep honest.

   No image is a designed state, not a gap: the card falls back to a
   blue-violet gradient carrying the event's initial.

   When `event.images` is an array with 2+ entries the media area becomes a
   cycling gallery: photos crossfade every 3 s automatically, and the user can
   also navigate with prev/next arrows or the dot strip at the bottom. */
import { useState, useEffect, useCallback, useRef } from 'react'
import Card from './Card'
import styles from './EventCard.module.css'

/* 14px, currentColor, no dependency. Two glyphs do not justify an icon set,
   and an icon font would be a fourth family (DESIGN.md 3 caps it at three). */
function CalendarIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 16 16" aria-hidden="true">
      <rect x="2" y="3.5" width="12" height="10.5" rx="1.5" />
      <path d="M2 6.75h12M5.5 2v3M10.5 2v3" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 14.5s5-4.36 5-7.5a5 5 0 0 0-10 0c0 3.14 5 7.5 5 7.5Z" />
      <circle cx="8" cy="7" r="1.9" />
    </svg>
  )
}

function ChevronIcon({ dir }) {
  return (
    <svg className={styles.chevron} viewBox="0 0 16 16" aria-hidden="true">
      {dir === 'prev' ? (
        <path d="M10 3 5 8l5 5" />
      ) : (
        <path d="M6 3l5 5-5 5" />
      )}
    </svg>
  )
}

/* ---- Photo gallery ---- */
const CYCLE_MS = 3000

function Gallery({ images }) {
  const [active, setActive] = useState(0)
  const timerRef = useRef(null)

  const go = useCallback(
    (idx) => {
      setActive(((idx % images.length) + images.length) % images.length)
    },
    [images.length],
  )

  /* Auto-cycle */
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length)
    }, CYCLE_MS)
  }, [images.length])

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [startTimer])

  const handlePrev = () => {
    go(active - 1)
    startTimer()
  }
  const handleNext = () => {
    go(active + 1)
    startTimer()
  }
  const handleDot = (i) => {
    go(i)
    startTimer()
  }

  return (
    <div className={styles.gallery} aria-label="Event photo gallery">
      {/* Stack all images; only the active one is visible */}
      {images.map((src, i) => (
        <img
          key={src}
          className={styles.galleryImg}
          data-active={i === active ? 'true' : undefined}
          src={src}
          alt={`Event photo ${i + 1}`}
          loading="lazy"
          decoding="async"
        />
      ))}

      {/* Prev / Next */}
      <button
        className={`${styles.galleryBtn} ${styles.galleryBtnPrev}`}
        onClick={handlePrev}
        aria-label="Previous photo"
      >
        <ChevronIcon dir="prev" />
      </button>
      <button
        className={`${styles.galleryBtn} ${styles.galleryBtnNext}`}
        onClick={handleNext}
        aria-label="Next photo"
      >
        <ChevronIcon dir="next" />
      </button>

      {/* Dot strip */}
      <div className={styles.dots} role="tablist" aria-label="Photo navigation">
        {images.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === active}
            aria-label={`Photo ${i + 1}`}
            className={styles.dot}
            data-active={i === active ? 'true' : undefined}
            onClick={() => handleDot(i)}
          />
        ))}
      </div>

      {/* Counter badge */}
      <span className={styles.counter} aria-hidden="true">
        {active + 1} / {images.length}
      </span>
    </div>
  )
}

/* ---- Card ---- */

export default function EventCard({ event }) {
  const upcoming = event.status === 'upcoming'
  const hasGallery = Array.isArray(event.images) && event.images.length > 1

  return (
    <Card className={styles.card}>
      <div className={styles.media}>
        {hasGallery ? (
          <Gallery images={event.images} />
        ) : event.image ? (
          <img
            className={styles.image}
            src={event.image}
            alt=""
            loading="lazy"
            decoding="async"
          />
        ) : (
          /* aria-hidden: the initial is decoration derived from the title,
             and the title itself is right below it. */
          <span className={styles.fallback} aria-hidden="true">
            {event.title.charAt(0)}
          </span>
        )}
      </div>

      <p className={styles.meta}>
        {event.date && (
          <span className={styles.date}>{event.date}</span>
        )}
        <span className={styles.status} data-status={event.status}>
          {upcoming ? 'Upcoming' : 'Past'}
        </span>
      </p>

      <h4 className={styles.title}>{event.title}</h4>

      <p className={styles.blurb}>{event.blurb}</p>

      <ul className={styles.footer}>
        {event.date && (
          <li className={styles.footerRow}>
            <CalendarIcon />
            <span>{event.date}</span>
          </li>
        )}
        <li className={styles.footerRow}>
          <PinIcon />
          <span>{event.location}</span>
        </li>
      </ul>
    </Card>
  )
}
