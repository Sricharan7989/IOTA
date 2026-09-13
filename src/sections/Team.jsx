/* IOTA - Team section.
   Five tiers, top to bottom, and rank is legible twice over: cards step down
   in SIZE (TeamCard) and entrances step down in INTENSITY (useTeamReveal).
   Either alone would be a weak signal; together they are unmistakable.

     1  Mentor          one centred card, largest        } TOP intensity
     2  Advisor         one centred card, largest        }
     3  Coordinators    a centred row, large-medium      } MID intensity
     4  Executives      a centred row, medium            }
     5  Domain members  a 4 -> 2 -> 1 grid, standard       BASE intensity

   Five sizes but three intensities on purpose - see the note in
   useTeamReveal. Five distinct entrances on one screen is noise; three bands
   read as an order.

   Each tier is introduced by a small mono label on the PAGE rather than by a
   label on every card.

   Orchestration only: the people are data/team.js, the card is TeamCard, the
   motion is useTeamReveal, and the chrome is the shared <Section>.

   Only the member cells and the tier headings carry [data-reveal-item]. The
   four senior tiers of CARDS are deliberately left out of the section's
   baseline reveal - useTeamReveal owns them, and two systems animating one
   element would fight over `transform`. The headings are chrome, so they take
   the baseline like everything else.

   Every person is a placeholder; see the banner in data/team.js. */
import { useRef } from 'react'
import Section from '../components/Section'
import TeamCard from '../components/TeamCard'
import { useTeamReveal } from '../hooks/useTeamReveal'
import {
  ADVISOR,
  COORDINATORS,
  EXECUTIVES,
  MEMBERS,
  MENTOR,
} from '../data/team'
import { getSection } from './manifest'
import styles from './Team.module.css'

/* ============ PLACEHOLDER COPY - swap freely ============ */
const INTRO =
  'A committee, not a hierarchy. Every name below belongs to a student who was sitting where you are a year ago.'
const LABELS = {
  mentor: 'Mentor',
  advisor: 'Advisor',
  coordinators: 'Coordinators',
  executives: 'Executives',
  members: 'Members',
}
/* ================= END PLACEHOLDER COPY ================= */

/* A rule, a mono label, a rule. Local to this file because it is a few lines
   of markup used five times in one section - the same call HeroPills makes
   about its Pill. Echoes ShiftMarker's treatment so the page marks a group
   the same way wherever it does it. */
function TierHeading({ children }) {
  return (
    <h3 className={styles.tierHeading} data-reveal-item>
      <span className={`${styles.tierRule} ${styles.left}`} aria-hidden="true" />
      <span className={styles.tierLabel}>{children}</span>
      <span className={`${styles.tierRule} ${styles.right}`} aria-hidden="true" />
    </h3>
  )
}

/* TOP tier: one person, centred, with the three nested elements the dramatic
   entrance needs. Entrance, float and tilt each write `transform`, so each
   gets its own node. */
function SoloTier({ label, person, tier }) {
  return (
    <div className={styles.tier}>
      <TierHeading>{label}</TierHeading>

      <div className={styles.solo} data-tier-top>
        <div className={styles.float} data-float>
          <TeamCard person={person} tier={tier} />
        </div>
      </div>
    </div>
  )
}

/* MID tier: a flex row rather than a grid, so a short row sits centred in the
   middle of the page instead of being stretched across fixed columns. */
function RowTier({ label, people, tier, cellClass }) {
  return (
    <div className={styles.tier}>
      <TierHeading>{label}</TierHeading>

      <ul className={styles.row} data-mid-row>
        {people.map((person) => (
          <li
            key={person.id}
            className={`${styles.cell} ${cellClass}`}
            data-tier-mid
          >
            <TeamCard person={person} tier={tier} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Team() {
  const root = useRef(null)
  useTeamReveal(root)

  return (
    <Section {...getSection('team')} blurb={INTRO}>
      <div ref={root} className={styles.tiers}>
        <SoloTier label={LABELS.mentor} person={MENTOR} tier="mentor" />
        <SoloTier label={LABELS.advisor} person={ADVISOR} tier="advisor" />

        <RowTier
          label={LABELS.coordinators}
          people={COORDINATORS}
          tier="coordinator"
          cellClass={styles.coordCell}
        />

        <RowTier
          label={LABELS.executives}
          people={EXECUTIVES}
          tier="executive"
          cellClass={styles.execCell}
        />

        {/* BASE tier: the section's own reveal handles these. */}
        <div className={styles.tier}>
          <TierHeading>{LABELS.members}</TierHeading>

          <ul className={styles.memberGrid}>
            {MEMBERS.map((person) => (
              <li
                key={person.id}
                className={styles.memberCell}
                data-reveal-item
              >
                <TeamCard person={person} tier="member" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
