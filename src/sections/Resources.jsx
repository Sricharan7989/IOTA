/* IOTA — Resources section.
   Stub. Content arrives in Phase 4. */
import Section from './Section'
import { getSection } from './manifest'

export default function Resources() {
  return <Section {...getSection('resources')} />
}
