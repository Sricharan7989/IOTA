/* IOTA - workshops and meetups.
   Single source of truth for the Events section.

   Schema, per event:
     { id, title, date, location, status, blurb, image, images }

   `status` is 'upcoming' | 'past' and is the ONLY thing that decides which
   block an event lands in - the section filters on it rather than keeping two
   arrays, so moving an event from Upcoming to Past is a one-word edit and
   cannot leave it in both.

   `date` is a display string, not a Date. Nothing sorts or compares it, and a
   real date object would only invite timezone bugs into a list a human reads.
   Write it however it should appear.

   `image` is a single path under public/, exactly like team photos - `/events/x.jpg`
   with the leading slash. Set it to null and the card renders a blue-violet
   gradient with the event's initial instead, which is a designed state rather
   than a hole.

   `images` is an optional array of paths under public/. When present it takes
   priority over `image` and the card renders a cycling photo gallery. Leave it
   undefined or empty to fall back to the single `image` / gradient behaviour. */

export const EVENTS = [
  /* ── UPCOMING ─────────────────────────────────────────────────────────── */
  {
    id: 'bit-n-build-2026',
    title: 'BIT N BUILD',
    date: '26 September 2026',
    location: 'IIIT Sri City',
    status: 'upcoming',
    blurb:
      'An international hackathon — the first round is conducted by us. Bring your ideas, build fast, and compete on the global stage.',
    image: '/events/bit-n-build.png',
  },

  /* ── PAST ──────────────────────────────────────────────────────────────── */

  {
    id: 'inter-iiit-esports-qualifiers-2026',
    title: 'Inter IIIT Esports Qualifiers',
    date: '29 August 2026',
    location: 'IIIT Sri City',
    status: 'past',
    blurb:
      'We conducted qualifiers for the Inter IIIT Esports Tournament, featuring games like BGMI, Valorant, and Free Fire. Players competed on campus to secure their spot in the main tournament.',
    image: '/events/DSC_1537.JPG',
    images: [
      '/events/DSC_1537.JPG',
      '/events/DSC_1708.JPG',
      '/events/DSC_1772.JPG',
      '/events/DSC_1814.JPG',
      '/events/DSC_1874.JPG',
      '/events/DSC_1879.JPG',
    ],
  },

  {
    id: 'brumble-matiks',
    title: 'Brumble Matiks',
    location: 'IIIT Sri City',
    status: 'past',
    blurb:
      'A national inter-collegiate mind-sports league where college teams go head-to-head in competitive brain-training and strategy games.',
    image: '/events/brumble-matiks.jpeg',
  },
]

/** The two blocks the section renders, in the order it renders them. */
export const UPCOMING = EVENTS.filter((event) => event.status === 'upcoming')
export const PAST = EVENTS.filter((event) => event.status === 'past')
