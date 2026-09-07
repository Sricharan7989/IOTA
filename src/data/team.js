/* IOTA - who runs it.
   Single source of truth for the Team section.

   Schema, per entry:
     { id, eyebrow, title, body, links: [ { label, url } ] }

   The shape is shared with data/resources.js so both render through
   <CardGrid>.

   ============================== PLACEHOLDER ==============================
   This section describes ROLES, not people, and that is deliberate rather
   than a shortcut: inventing plausible-looking names and handles for a real
   student club would put fake people on a real page, and they would be very
   easy to leave there by accident.

   When the committee is confirmed, add a `name` to each entry and render it
   above `title` in CardGrid - the roles and their remits below should mostly
   survive as written.
   ========================================================================= */

export const TEAM = [
  {
    id: 'president',
    eyebrow: 'Core',
    title: 'President',
    body: 'Sets the direction for the year, runs the committee, and is the club’s face to the institute.',
    links: [],
  },
  {
    id: 'vice-president',
    eyebrow: 'Core',
    title: 'Vice President',
    body: 'Keeps the calendar honest. Owns delivery on everything the club has promised its members.',
    links: [],
  },
  {
    id: 'technical',
    eyebrow: 'Domains',
    title: 'Technical Leads',
    body: 'One per domain. They write the roadmaps, run the workshops, and answer the questions nobody else will.',
    links: [],
  },
  {
    id: 'projects',
    eyebrow: 'Domains',
    title: 'Projects Lead',
    body: 'Matches members to club projects and keeps the repositories alive between semesters.',
    links: [],
  },
  {
    id: 'academics',
    eyebrow: 'Members',
    title: 'Academics Lead',
    body: 'Collects, checks and files the course material so the archive is trustworthy rather than merely large.',
    links: [],
  },
  {
    id: 'design',
    eyebrow: 'Outreach',
    title: 'Design and Media',
    body: 'Everything the club looks and sounds like, this page included.',
    links: [],
  },
  {
    id: 'events',
    eyebrow: 'Outreach',
    title: 'Events',
    body: 'Rooms, dates, food and the hundred small things that decide whether a session actually happens.',
    links: [],
  },
  {
    id: 'outreach',
    eyebrow: 'Outreach',
    title: 'Community',
    body: 'Brings in speakers, keeps alumni close, and makes sure first-years know the door is open.',
    links: [],
  },
]
