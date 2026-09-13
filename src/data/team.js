/* IOTA - who runs it.
   Single source of truth for the Team section.

   FIVE tiers, exported separately rather than as one list with a `tier`
   field: each renders in a different layout, and no loop could usefully walk
   all five. Keeping them apart means the file reads top to bottom exactly as
   the section renders.

     MENTOR        one person, largest card
     ADVISOR       one person, largest card
     COORDINATORS  a centred row, large-medium
     EXECUTIVES    a centred row, medium
     MEMBERS       a responsive grid, standard

   Five tiers but only THREE animation intensities - see useTeamReveal. Size
   separates all five; motion separates them into groups, because five
   different entrances on one screen is noise rather than hierarchy.

   Schema, per person:
     { id, name, role, bio, photo, github, linkedin }

   Named fields rather than a `links` array, because these get filled in by
   whoever joins the committee: "put your GitHub URL here" is an instruction
   anyone can follow, and an array of { label, url } objects is not.

   Every one of photo / github / linkedin is OPTIONAL. Leave it an empty
   string and it simply does not render - no empty pill, no broken image, no
   placeholder.

   ---- Photos ----------------------------------------------------------
   Images live in `public/team/`. See the README in that folder. The path
   here is the SERVED path, so it starts with a slash:

       photo: '/team/member-ai-ml.jpg',

   No photo, or a path that 404s, falls back to the gradient monogram built
   from the person's initials. That fallback is a design, not a stopgap.
   ----------------------------------------------------------------------

   ============================== PLACEHOLDER ==============================
   EVERY PERSON BELOW IS A PLACEHOLDER. Names are Greek letters, which is
   both on-brand for a club called IOTA and impossible to mistake for a real
   student - deliberately, because plausible-looking invented names on a real
   club's page are very easy to leave there by accident. Iota is skipped
   throughout: that one is the club.

   To make this real: swap `name`, write one honest line of `bio`, drop a
   photo in public/team/, and paste real profile URLs. The ROLES are the real
   decision and should mostly survive as written; the domain roles at the
   bottom match the nine tracks in data/roadmaps.js.
   ========================================================================= */

/* PLACEHOLDER - tier 1. */
export const MENTOR = {
  id: 'mentor',
  name: 'Alpha',
  role: 'Club Mentor',
  bio: 'Faculty mentor. Opens the doors the committee cannot open on its own.',
  // EXAMPLE - swap example.jpg for a real photo in public/team/.
  photo: '/team/example.jpg',
  github: 'https://github.com/Sricharan7989',
  // Blank on purpose: an empty social is dropped, not rendered empty.
  linkedin: '',
}

/* PLACEHOLDER - tier 2. */
export const ADVISOR = {
  id: 'advisor',
  name: 'Beta',
  role: 'Club Advisor',
  bio: 'Keeps the long view. Where the club should be two years from now.',
  photo: '',
  github: '',
  linkedin: '',
}

/* PLACEHOLDER - tier 3. Roles are one word each: the tier heading above the
   row already says "Coordinators". */
export const COORDINATORS = [
  {
    id: 'coord-technical',
    name: 'Gamma',
    role: 'Technical',
    bio: 'Owns the roadmaps and every workshop that comes out of them.',
    photo: '',
    github: '',
    linkedin: '',
  },
  {
    id: 'coord-operations',
    name: 'Delta',
    role: 'Operations',
    bio: 'Keeps the calendar honest and the promises kept.',
    photo: '',
    github: '',
    linkedin: '',
  },
  {
    id: 'coord-outreach',
    name: 'Epsilon',
    role: 'Outreach',
    bio: 'Brings in speakers, keeps alumni close, holds the door open.',
    photo: '',
    github: '',
    linkedin: '',
  },
]

/* PLACEHOLDER - tier 4. */
export const EXECUTIVES = [
  {
    id: 'exec-events',
    name: 'Zeta',
    role: 'Events',
    bio: 'Rooms, dates, and the small things that decide whether a session happens.',
    photo: '',
    github: '',
    linkedin: '',
  },
  {
    id: 'exec-design',
    name: 'Eta',
    role: 'Design & Media',
    bio: 'Everything the club looks and sounds like, this page included.',
    photo: '',
    github: '',
    linkedin: '',
  },
  {
    id: 'exec-projects',
    name: 'Theta',
    role: 'Projects',
    bio: 'Matches members to club projects and keeps the repos alive.',
    photo: '',
    github: '',
    linkedin: '',
  },
  {
    id: 'exec-community',
    name: 'Kappa',
    role: 'Community',
    bio: 'Makes sure first-years know the door is open.',
    photo: '',
    github: '',
    linkedin: '',
  },
]

/* PLACEHOLDER - tier 5. One lead per domain. These roles mirror
   data/roadmaps.js, so a member reading a track knows who to ask about it. */
export const MEMBERS = [
  {
    id: 'member-ai-ml',
    name: 'Lambda',
    role: 'AI / ML',
    bio: 'Models, from first principles to production.',
    // EXAMPLE - the same file at the smallest tier, proving the crop scales.
    photo: '/team/example.jpg',
    github: '',
    linkedin: 'https://www.linkedin.com/',
  },
  {
    id: 'member-web',
    name: 'Mu',
    role: 'Web Dev',
    bio: 'Ships the things everyone else demos.',
    photo: '',
    github: '',
    linkedin: '',
  },
  {
    id: 'member-cv',
    name: 'Nu',
    role: 'Computer Vision',
    bio: 'Pixels in, understanding out.',
    photo: '',
    github: '',
    linkedin: '',
  },
  {
    id: 'member-nlp',
    name: 'Xi',
    role: 'NLP',
    bio: 'Language models, and the evals that keep them honest.',
    photo: '',
    github: '',
    linkedin: '',
  },
  {
    id: 'member-gen-ai',
    name: 'Omicron',
    role: 'Gen AI',
    bio: 'Retrieval, prompting, and apps built around both.',
    photo: '',
    github: '',
    linkedin: '',
  },
  {
    id: 'member-agentic',
    name: 'Pi',
    role: 'Agentic AI',
    bio: 'Agents that use tools without falling over.',
    photo: '',
    github: '',
    linkedin: '',
  },
  {
    id: 'member-game',
    name: 'Rho',
    role: 'Game Dev',
    bio: 'Prototypes on Friday, playtests on Monday.',
    photo: '',
    github: '',
    linkedin: '',
  },
  {
    id: 'member-app',
    name: 'Sigma',
    role: 'App Dev',
    bio: 'Everything that has to work on a phone in a lecture hall.',
    photo: '',
    github: '',
    linkedin: '',
  },
]
