/* IOTA - what the club gives you.
   Single source of truth for the Resources section.

   Schema, per entry:
     { id, eyebrow, title, body, links: [ { label, url } ] }

   The shape is shared with data/team.js so both render through <CardGrid>.

   ============================ PLACEHOLDER ============================
   Every entry below is a plausible stand-in, not a commitment. The
   CATEGORIES are the real decision - they are what the club actually
   offers - but the copy and every url are placeholders. Swap the strings;
   nothing else needs to change.
   ===================================================================== */

export const RESOURCES = [
  {
    id: 'workshops',
    eyebrow: 'Every fortnight',
    title: 'Hands-on workshops',
    body: 'Two hours, one laptop, something working by the end. No slide decks about what a neural network is - you build one.',
    links: [{ label: 'Past sessions', url: '#' }],
  },
  {
    id: 'roadmaps',
    eyebrow: 'Nine domains',
    title: 'Guided roadmaps',
    body: 'The path from first principles to something shipped, for whichever domain you picked. Written by people who took it.',
    links: [{ label: 'Open the roadmap', url: '#roadmap' }],
  },
  {
    id: 'archive',
    eyebrow: 'Semester-wise',
    title: 'The academic archive',
    body: 'Past papers and references for the core courses, collected so nobody has to ask for them the night before.',
    links: [{ label: 'Browse by semester', url: '#academics' }],
  },
  {
    id: 'mentorship',
    eyebrow: 'One to one',
    title: 'Mentorship',
    body: 'Seniors who have already been stuck where you are stuck. Pair up for a project, an internship hunt, or a hard week.',
    links: [{ label: 'Request a mentor', url: '#' }],
  },
  {
    id: 'projects',
    eyebrow: 'In the open',
    title: 'Club projects',
    body: 'Real repositories with real users, maintained by members. The fastest way to learn how software is actually built.',
    links: [{ label: 'GitHub', url: '#' }],
  },
  {
    id: 'compute',
    eyebrow: 'Shared',
    title: 'Compute and credits',
    body: 'GPU time, API credits and cloud access pooled across the club, so a good idea is never blocked on a billing page.',
    links: [{ label: 'How to request', url: '#' }],
  },
]
