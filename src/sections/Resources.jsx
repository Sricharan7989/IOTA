/* IOTA - Resources section.
   What the club actually gives you, as a grid of cards.

   Orchestration only: the content is data/resources.js, the grid is CardGrid,
   the surface and its pointer behaviour are Card's, and the section chrome is
   the shared <Section>. The copy in the data file is still placeholder. */
import Section from '../components/Section'
import CardGrid from '../components/CardGrid'
import { RESOURCES } from '../data/resources'
import { getSection } from './manifest'

/* ============ PLACEHOLDER COPY - swap freely ============ */
const INTRO =
  'Membership is not a mailing list. This is what you get on day one, and what stays available for as long as you are here.'
/* ================= END PLACEHOLDER COPY ================= */

export default function Resources() {
  return (
    <Section {...getSection('resources')} blurb={INTRO}>
      <CardGrid items={RESOURCES} />
    </Section>
  )
}
