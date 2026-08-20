/* IOTA — Home section.
   The hero. Heading is the wordmark for now; Phase 4 gives it a tagline and
   the Phase 3 centerpiece lands beside it. */
import Section from './Section'
import { getSection } from './manifest'

export default function Home() {
  return <Section {...getSection('home')} hero />
}
