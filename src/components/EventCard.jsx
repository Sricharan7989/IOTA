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
   blue-violet gradient carrying the event's initial. */
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

export default function EventCard({ event }) {
  const upcoming = event.status === 'upcoming'

  return (
    <Card className={styles.card}>
      <div className={styles.media}>
        {event.image ? (
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
        <span className={styles.date}>{event.date}</span>
        <span className={styles.status} data-status={event.status}>
          {upcoming ? 'Upcoming' : 'Past'}
        </span>
      </p>

      <h4 className={styles.title}>{event.title}</h4>

      <p className={styles.blurb}>{event.blurb}</p>

      <ul className={styles.footer}>
        <li className={styles.footerRow}>
          <CalendarIcon />
          <span>{event.date}</span>
        </li>
        <li className={styles.footerRow}>
          <PinIcon />
          <span>{event.location}</span>
        </li>
      </ul>
    </Card>
  )
}
