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
    id: "bit-n-build-2026",
    title: "BIT N BUILD '26",
    date: "26 September 2026",
    location: "IIIT Sri City",
    status: "past",
    blurb:
      "An international hackathon — the first round is conducted by us. Bring your ideas, build fast, and compete on the global stage.",
    image: '/events/bit-n-build-26/DSC_6890.jpg',
    images: [
      '/events/bit-n-build-26/DSC_6890.jpg',
      '/events/bit-n-build-26/DSC_6858.jpg',
      '/events/bit-n-build-26/DSC_6840.jpg',
      '/events/bit-n-build-26/DSC_6805.jpg',
      '/events/bit-n-build-26/DSC_7017.jpg',
      '/events/bit-n-build-26/DSC_7198.jpg',
    ],
    details: {
      kicker: 'Andhra Pradesh internal round',
      summary:
        'IOTA IIIT Sri City hosted the Andhra Pradesh internal round of BIT N BUILD 26, an international hackathon organised by Fr. CRCE, Mumbai. Across one intense day, teams turned ideas into working solutions while competing for a place at the International Grand Finale in Mumbai.',
      highlights: [['60+', 'teams'], ['220+', 'participants'], ['2', 'teams advanced']],
      judges: ['Amodini A P', 'Mohan Sai Krishna Mopada'],
      acknowledgements:
        'Judging was coordinated by Alumni Secretary Chamala Abhiram Reddy, with continued support from Gymkhana. The event was made possible through a smooth collaboration with Neyomi Abygail Martis and Google Developer Groups FR.CRCE.',
      crew:
        'Behind the scenes, Sricharan K, Sahasra Muttadi, Sujai Shukla, Jyothikiran Pothula, Tholkappian Murugesan, Gautham SM, Medha, Rushith, Jahnavi Yerra, Jagadarsh Meda, Vikhyat Gupta, Pindi Sri Kanaka Mahalakshmi Durga Devi, Kura Sai Nishanth, Tejaswini R, Hamsini Uppalapati, and the volunteer team kept registrations, venue operations, participant support, and on-ground coordination moving.',
      summary:
        'Hosted by IOTA IIIT Sri City, BIT N BUILD 26 brought together 60+ teams and 220+ participants for a high-energy day of ideation, building, and demos. From the first round of discussions to the final project showcases, participants worked against the clock to turn ambitious ideas into usable prototypes. Teams iterated quickly, debugged together, and refined how they communicated the value of their solutions.',
      featureTitle: 'Tracks and building',
      featureText:
        'The Web Development and AI tracks encouraged teams to turn early ideas into useful projects with thoughtful interfaces, automation, and intelligent features. Teams explored how a clear user journey, a reliable technical foundation, and a focused problem statement can turn a prototype into something meaningful. The hackathon moved from planning into focused building, testing, pitch preparation, and final presentations.',
      secondaryTitle: 'Winners and judges',
      secondaryText:
        'Build N Pray and Bumblebees were selected as the winning teams and advanced to the International Grand Finale in Mumbai. Amodini A P and Mohan Sai Krishna Mopada evaluated submissions for problem understanding, implementation, clarity of the solution, and overall impact. The final round gave every team a chance to explain not only what they built, but why it mattered and how it could grow beyond the hackathon.',
      acknowledgements: null,
      crew: null,
    },
  },

  /* ── PAST ──────────────────────────────────────────────────────────────── */

  {
    id: "inter-iiit-esports-qualifiers-2026",
    title: "Inter IIIT Esports Qualifiers",
    date: "29 August 2026",
    location: "IIIT Sri City",
    status: "past",
    blurb:
      "We conducted qualifiers for the Inter IIIT Esports Tournament, featuring games like BGMI, Valorant, and Free Fire. Players competed on campus to secure their spot in the main tournament.",
    image: "/events/DSC_1537.JPG",
    images: [
      "/events/DSC_1954.JPG.jpeg",
      "/events/DSC_1537.JPG",
      "/events/DSC_1708.JPG",
      "/events/DSC_1772.JPG",
      "/events/DSC_1814.JPG",
      "/events/DSC_1874.JPG",
      "/events/DSC_1879.JPG",
    ],
  },

  {
    id: 'git-github-bootcamp-2026',
    title: 'Git & GitHub Bootcamp',
    date: '9–10 October 2026',
    location: 'IIIT Sri City',
    status: 'past',
    blurb:
      'A two-day bootcamp for freshers covering everyday Git, GitHub, and Linux essentials with GDG × IOTA IIIT Sri City.',
    image: '/events/git-github-bootcamp-26/DSC_8443.jpg',
    images: [
      '/events/git-github-bootcamp-26/DSC_8443.jpg',
      '/events/git-github-bootcamp-26/DSC_8445.jpg',
      '/events/git-github-bootcamp-26/DSC_8461.jpg',
      '/events/git-github-bootcamp-26/DSC_8592.jpg',
      '/events/git-github-bootcamp-26/DSC_8622.jpg',
      '/events/git-github-bootcamp-26/DSC_8712.jpg',
      '/events/git-github-bootcamp-26/DSC_8838.jpg',
      '/events/git-github-bootcamp-26/DSC_8859.jpg',
      '/events/git-github-bootcamp-26/DSC_8868.jpg',
      '/events/git-github-bootcamp-26/DSC_8877.jpg',
      '/events/git-github-bootcamp-26/DSC_8921.jpg',
      '/events/git-github-bootcamp-26/DSC_8935.jpg',
      '/events/git-github-bootcamp-26/DSC_8940.jpg',
      '/events/git-github-bootcamp-26/DSC_8944.jpg',
      '/events/git-github-bootcamp-26/DSC_8950.jpg',
    ],
    details: {
      kicker: 'Freshers bootcamp · GDG × IOTA',
      summary:
        'Over two hands-on days, freshers built confidence with the tools behind everyday software collaboration. The bootcamp moved from navigating a Linux terminal to tracking work locally with Git and sharing it through GitHub. It was designed as a practical starting point: enough structure to make the command line feel approachable, and enough hands-on work to show how these tools fit into real project work.',
      highlights: [['2', 'days'], ['Git', 'fundamentals'], ['Linux', 'basics']],
      featureTitle: 'What we covered',
      featureText:
        'Participants worked through core Git commands including init, status, add, commit, log, branch, and merge, then connected local repositories to GitHub. Linux sessions covered the command-line basics needed to move around, manage files, and work comfortably in a development environment. Each concept was placed in context, so a command became part of a workflow for keeping work safe, understandable, and ready to share.',
      secondaryTitle: 'Learning by doing',
      secondaryText:
        'The sessions used practical workflows: making changes, checking what changed, committing meaningful progress, and understanding how teams keep a shared project organised. Participants saw how small habits—writing useful commit messages, checking status before acting, and separating changes into logical steps—make collaboration calmer and easier as a project grows.',
      acknowledgementsTitle: 'A shared session',
      acknowledgements:
        'Hosted under the GDG × IOTA IIIT Sri City collaboration, the bootcamp gave new students a friendly first step into tools they will keep using throughout college projects, hackathons, and open-source work.',
      crewTitle: 'What came next',
      crew:
        'By the end of the two days, attendees had a foundation for starting repositories with confidence, contributing without losing work, and continuing their learning through real projects with peers. More importantly, they left with a clearer sense of how modern development happens: one careful change at a time, documented well, and shared with others.',
    },
  },

  {
    id: "brumble-matiks",
    title: "Brumble Matiks",
    location: "IIIT Sri City",
    status: "past",
    blurb:
      "A national inter-collegiate mind-sports league where college teams go head-to-head in competitive brain-training and strategy games.",
    image: "/events/brumble-matiks.jpeg",
  },
];

/** The two blocks the section renders, in the order it renders them. */
export const UPCOMING = EVENTS.filter((event) => event.status === "upcoming");
const PAST_ORDER = [
  'bit-n-build-2026',
  'git-github-bootcamp-2026',
]

export const PAST = EVENTS
  .filter((event) => event.status === 'past')
  .sort((a, b) => {
    const aOrder = PAST_ORDER.indexOf(a.id)
    const bOrder = PAST_ORDER.indexOf(b.id)
    return (aOrder < 0 ? PAST_ORDER.length : aOrder) - (bOrder < 0 ? PAST_ORDER.length : bOrder)
  })
