/* IOTA — the scroll journey, as data.
   Single source of truth for section order, ids and labels. The navbar maps
   over this; each section component looks up its own entry. Adding a section
   means editing this list and adding one component — nothing else. */

export const SECTIONS = [
  { id: 'home', index: '01', label: 'Home', heading: 'IOTA' },
  { id: 'events', index: '02', label: 'Events', heading: 'Events' },
  { id: 'roadmap', index: '03', label: 'Roadmap', heading: 'Roadmap' },
  { id: 'academics', index: '04', label: 'Academics', heading: 'Academics' },
  { id: 'team', index: '05', label: 'Team', heading: 'Team' },
]

export function getSection(id) {
  return SECTIONS.find((section) => section.id === id)
}
