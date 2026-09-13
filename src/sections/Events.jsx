/* IOTA - Events section.
   Two blocks, Upcoming then Past, both fed from one array in data/events.js
   filtered on `status`. Upcoming comes first even when it is empty: an empty
   "nothing scheduled" is information, and burying it under the archive would
   read as the club having stopped.

   Orchestration only: the content is data/events.js, the card is EventCard,
   the surface and its pointer behaviour are Card's, and the chrome is the
   shared <Section>.

   Every cell is [data-reveal-item], so the enclosing <Section> staggers them
   with the same baseline every other section uses. Events has no tiering to
   express, so it gets no bespoke motion. */
import Section from '../components/Section'
import EventCard from '../components/EventCard'
import { PAST, UPCOMING } from '../data/events'
import { getSection } from './manifest'
import styles from './Events.module.css'

/* ============ PLACEHOLDER COPY - swap freely ============ */
const EYEBROW = 'Workshops & Meetups'
const INTRO =
  'Everything the club runs in public. Turn up to one, bring a laptop, and leave having built something you did not walk in knowing how to build.'
const UPCOMING_HEADING = 'Upcoming Events'
const PAST_HEADING = 'Past Events'
const EMPTY = 'No upcoming events scheduled.'
/* ================= END PLACEHOLDER COPY ================= */

/* A rule, a mono label, a rule - the same marker Team uses for its tiers and
   ShiftMarker uses for the hero boundary, so the page marks a group the same
   way wherever it does it. */
function BlockHeading({ children }) {
  return (
    <h3 className={styles.blockHeading}>
      <span className={`${styles.rule} ${styles.left}`} aria-hidden="true" />
      <span className={styles.label}>{children}</span>
      <span className={`${styles.rule} ${styles.right}`} aria-hidden="true" />
    </h3>
  )
}

export default function Events() {
  return (
    <Section {...getSection('events')} eyebrow={EYEBROW} blurb={INTRO}>
      <div className={styles.blocks}>
        {/* ---- Upcoming ---- */}
        <div className={styles.block}>
          <BlockHeading>{UPCOMING_HEADING}</BlockHeading>

          {UPCOMING.length ? (
            <ul className={styles.grid}>
              {UPCOMING.map((event) => (
                <li key={event.id} className={styles.cell} data-reveal-item>
                  <EventCard event={event} />
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty} data-reveal-item>
              {EMPTY}
            </p>
          )}
        </div>

        {/* ---- Past ---- */}
        <div className={styles.block}>
          <BlockHeading>{PAST_HEADING}</BlockHeading>

          <ul className={styles.grid}>
            {PAST.map((event) => (
              <li key={event.id} className={styles.cell} data-reveal-item>
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
