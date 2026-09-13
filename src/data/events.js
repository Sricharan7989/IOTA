/* IOTA - workshops and meetups.
   Single source of truth for the Events section.

   Schema, per event:
     { id, title, date, location, status, blurb, image }

   `status` is 'upcoming' | 'past' and is the ONLY thing that decides which
   block an event lands in - the section filters on it rather than keeping two
   arrays, so moving an event from Upcoming to Past is a one-word edit and
   cannot leave it in both.

   `date` is a display string, not a Date. Nothing sorts or compares it, and a
   real date object would only invite timezone bugs into a list a human reads.
   Write it however it should appear.

   `image` is a path under public/, exactly like team photos - `/events/x.jpg`
   with the leading slash. Set it to null and the card renders a blue-violet
   gradient with the event's initial instead, which is a designed state rather
   than a hole.

   ============================== PLACEHOLDER ==============================
   Every event below is a PLACEHOLDER. Upcoming is deliberately EMPTY so the
   empty state is visible in development - add a real event with
   status: 'upcoming' and it disappears on its own.
   ========================================================================= */

export const EVENTS = [
  /* PLACEHOLDER - nothing upcoming yet. Add entries with
     status: 'upcoming' here and the empty state stands down. */

  /* PLACEHOLDER */
  {
    id: 'intro-to-ml',
    title: 'Intro to Machine Learning',
    date: '12 February 2026',
    location: 'Seminar Hall 2, IIIT Sri City',
    status: 'past',
    blurb:
      'Two hours, one laptop, a working classifier by the end. No slides about what a neural network is - you train one on a real dataset and find out why it is wrong.',
    image: null,
  },

  /* PLACEHOLDER */
  {
    id: 'ship-a-site',
    title: 'Ship a Site in an Evening',
    date: '28 January 2026',
    location: 'Lab 4, Academic Block',
    status: 'past',
    blurb:
      'From an empty folder to a live URL before anyone went home. HTML, a little CSS, and a deploy that everyone in the room could open on their phone.',
    image: null,
  },

  /* PLACEHOLDER */
  {
    id: 'open-source-night',
    title: 'Open Source Night',
    date: '9 December 2025',
    location: 'Student Activity Centre',
    status: 'past',
    blurb:
      'Everyone brought one repository they had been meaning to contribute to. Eleven pull requests opened, four merged before the night was out.',
    image: null,
  },
]

/** The two blocks the section renders, in the order it renders them. */
export const UPCOMING = EVENTS.filter((event) => event.status === 'upcoming')
export const PAST = EVENTS.filter((event) => event.status === 'past')
