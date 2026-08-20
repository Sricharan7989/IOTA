/* IOTA — Team section.
   Stub. Content arrives in Phase 4. */
import Section from './Section'
import { getSection } from './manifest'

export default function Team() {
  return <Section {...getSection('team')} />
}
