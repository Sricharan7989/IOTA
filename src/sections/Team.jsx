/* IOTA - Team section.
   How the club is organised, as a grid of cards.

   Roles rather than people, for now - see the note in data/team.js on why
   there are no names here yet. Orchestration only: the content is
   data/team.js, the grid is CardGrid, and the chrome is the shared
   <Section>. */
import Section from '../components/Section'
import CardGrid from '../components/CardGrid'
import { TEAM } from '../data/team'
import { getSection } from './manifest'

/* ============ PLACEHOLDER COPY - swap freely ============ */
const INTRO =
  'A committee, not a hierarchy. Every role below is held by a student who was sitting where you are a year ago.'
/* ================= END PLACEHOLDER COPY ================= */

export default function Team() {
  return (
    <Section {...getSection('team')} blurb={INTRO}>
      <CardGrid items={TEAM} />
    </Section>
  )
}
