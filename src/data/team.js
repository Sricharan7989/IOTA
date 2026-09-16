/* IOTA - who runs it.
   Single source of truth for the Team section.

   FIVE tiers, exported separately rather than as one list with a `tier`
   field: each renders in a different layout, and no loop could usefully walk
   all five. Keeping them apart means the file reads top to bottom exactly as
   the section renders.

     MENTOR        one person, largest card
     ADVISOR       two persons, medium card
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

import mentorPhoto from "../assets/team/mentor.jpg";
import bhanuPhoto from "../assets/team/bhanu.jpeg";
import pheelipPhoto from "../assets/team/pheelip.jpeg";
import coordinatorPhoto from "../assets/team/coordinator.jpeg";

import jyothikiranPhoto from "../assets/team/jyothikiran.jpeg";
import sujaiPhoto from "../assets/team/sujai.jpeg";
import sahasraPhoto from "../assets/team/sahasra.jpeg";
import sricharanPhoto from "../assets/team/sricharan.jpeg";

import ayushPhoto from "../assets/team/ayush bisht.jpeg";
import hrishikeshPhoto from "../assets/team/Hrishikesh.png";
import avinashPhoto from "../assets/team/avinash.jpeg";
import rushithPhoto from "../assets/team/rushith.jpeg";
import jahnaviPhoto from "../assets/team/jahnavi.png";
import KmedhaPhoto from "../assets/team/k medha.png";
import karthikPhoto from "../assets/team/karthik.PNG";
import krishPhoto from "../assets/team/krish.jpeg";
import kuraPhoto from "../assets/team/kura sainishant.png";
import madhusriPhoto from "../assets/team/madhusri.png";
import JagadarshPhoto from "../assets/team/meda jagadarsh.jpeg";
import sathyanarayananPhoto from "../assets/team/sathyanarayn.png";
import tejaswiniPhoto from "../assets/team/tejaswini.jpeg";
import vikhyatPhoto from "../assets/team/vikhyat.jpeg";
import sivaPhoto from "../assets/team/Siva_varaprasad.png";
import sriharshaPhoto from "../assets/team/sriharsha.jpeg";
import tholkappianPhoto from "../assets/team/tholkappian.jpeg";
import gauthamPhoto from "../assets/team/gautham.png";

/* PLACEHOLDER - tier 1. */
export const MENTOR = {
  id: "mentor",
  name: "Dr. Pavan Kumar",
  role: "Club Mentor",
  photo: mentorPhoto,
  linkedin: "",
};

/* PLACEHOLDER - tier 2. */
export const ADVISOR = [
  {
    id: "advisor-pheelip-raipure",
    name: "Pheelip Raipure",
    role: "Club Advisor",
    photo: pheelipPhoto,
    github: "",
    linkedin: "",
  },
  {
    id: "advisor-bhanu-panuganti",
    name: "Bhanu Panuganti",
    role: "Club Advisor",
    photo: bhanuPhoto,
    github: "",
    linkedin: "",
  },
];

/* PLACEHOLDER - tier 3. Roles are one word each: the tier heading above the
   row already says "Coordinators". */
export const COORDINATOR = {
  id: "coord-technical",
  name: "Siddharth",
  role: "Club Co-ordinator",
  photo: coordinatorPhoto,
  github: "https://github.com/Siddharth-k7",
  linkedin: "https://www.linkedin.com/in/siddharth-kancharla/",
};

/* PLACEHOLDER - tier 4. */
export const EXECUTIVES = [
  {
    id: "exec-events",
    name: "Jyothikiran",
    role: "Game Development",
    photo: jyothikiranPhoto,
    github: "https://github.com/jyothikiran25",
    linkedin: "https://www.linkedin.com/in/jyothikiran-pothula-729933322",
  },
  {
    id: "exec-design",
    name: "Sujai",
    role: "App Development",
    photo: sujaiPhoto,
    github: "https://github.com/Sujaicodes",
    linkedin: "https://www.linkedin.com/in/sujai-shukla-74a3413b6/",
  },
  {
    id: "exec-projects",
    name: "Sahasra",
    role: "AI / ML",
    photo: sahasraPhoto,
    github: "https://github.com/muttadisahasra-maker",
    linkedin: "https://www.linkedin.com/in/sahasra-muttadi-2091143ab/",
  },
  {
    id: "exec-community",
    name: "Sricharan",
    role: "AI Engineer",
    photo: sricharanPhoto,
    github: "https://github.com/Sricharan7989",
    linkedin: "https://www.linkedin.com/in/sricharan-k-777sk",
  },
];

/* PLACEHOLDER - tier 5. One lead per domain. These roles mirror
   data/roadmaps.js, so a member reading a track knows who to ask about it. */
export const MEMBERS = [
  // ============================================================
  // AI / ML
  // ============================================================

  {
    id: "member-sriharsha",
    name: "Baswa Sriharsha",
    role: "AI / ML",
    bio: "",
    photo: sriharshaPhoto,
    github: "https://github.com/sriharshabaswa-droid",
    linkedin: "https://www.linkedin.com/in/sriharsha-baswa-97073a370",
  },

  {
    id: "member-kura-sai-nishanth",
    name: "Kura Sai Nishanth",
    role: "AI / ML",
    bio: "",
    photo: kuraPhoto,
    github: "https://github.com/kurasainishanth-ai",
    linkedin: "https://www.linkedin.com/in/kura-sai-nishanth-45298137a",
  },

  {
    id: "member-gautham-sm",
    name: "Gautham",
    role: "AI / ML",
    bio: "",
    photo: gauthamPhoto,
    github: "https://github.com/GAUTHAM-SM",
    linkedin: "https://www.linkedin.com/in/gautham-sm-08a2a6382/",
  },

  {
    id: "member-pindi-sri-kanaka-mahalakshmi",
    name: "Mahalakshmi",
    role: "AI / ML",
    bio: "",
    photo: madhusriPhoto,
    github: "https://github.com/pindimadhusri11-gif",
    linkedin:
      "https://www.linkedin.com/in/pindi-sri-kanaka-mahalakshmi-durga-devi-953148384",
  },

  // ============================================================
  // AI ENGINEERING
  // ============================================================

  {
    id: "member-hrishikesh-chamarthy",
    name: "Hrishikesh Chamarthy",
    role: "AI Engineering",
    bio: "",
    photo: hrishikeshPhoto,
    github: "https://github.com/Hrishi-2008",
    linkedin: "https://www.linkedin.com/in/hrishikesh-chamarthy-021207380",
  },

  {
    id: "member-vikhyat-gupta",
    name: "Vikhyat Gupta",
    role: "AI Engineering",
    bio: "",
    photo: vikhyatPhoto,
    github: "https://github.com/vikky781",
    linkedin: "https://www.linkedin.com/in/vikhyat-gupta-iiits/",
  },

  {
    id: "member-siva-varaprasad",
    name: "Siva varaprasad",
    role: "AI Engineering",
    bio: "",
    photo: sivaPhoto,
    github: "https://github.com/balledasivavaraprasad-create",
    linkedin: "https://www.linkedin.com/in/siva-varaprasad/",
  },

  // ============================================================
  // WEB DEVELOPMENT
  // ============================================================

  {
    id: "lead-tholkappian",
    name: "Tholkappian",
    role: "Web Development-LEAD",
    bio: "",
    photo: tholkappianPhoto,
    github: "https://github.com/TitanThols",
    linkedin: "https://www.linkedin.com/in/tholkappian-murugesan-bb401a326/",
  },

  {
    id: "member-krish-gupta",
    name: "Krish gupta",
    role: "Web Development",
    bio: "",
    photo: krishPhoto,
    github: "https://github.com/guptakrish490",
    linkedin: "https://www.linkedin.com/in/krish--gupta/",
  },

  {
    id: "member-tejaswini-r",
    name: "Tejaswini",
    role: "Web Development",
    bio: "",
    photo: tejaswiniPhoto,
    github: "https://github.com/tejaswinir013",
    linkedin: "https://www.linkedin.com/in/tejaswini-r-989114391",
  },

  {
    id: "member-b-avinash",
    name: "Avinash",
    role: "Web Development",
    bio: "",
    photo: avinashPhoto,
    github: "https://github.com/Avinash130212",
    linkedin: "https://www.linkedin.com/in/avinash-bolisetty",
  },

  // ============================================================
  // GAME DEVELOPMENT
  // ============================================================

  {
    id: "member-dinesh-karthik-busi",
    name: "Dinesh Karthik Busi",
    role: "Game Development",
    bio: "",
    photo: karthikPhoto,
    github: "",
    linkedin: "",
  },

  {
    id: "member-k-sathyanarayanan",
    name: "Sathyanarayanan",
    role: "Game Development",
    bio: "",
    photo: sathyanarayananPhoto,
    github: "",
    linkedin: "",
  },

  // ============================================================
  // APP DEVELOPMENT
  // ============================================================

  {
    id: "member-meda-jagadarsh",
    name: "Meda Jagadarsh",
    role: "App Development",
    bio: "",
    photo: JagadarshPhoto,
    github: "https://github.com/jaymeda/",
    linkedin: "https://www.linkedin.com/in/jagadarsh-meda-81aa41205",
  },

  {
    id: "member-singireddy-rushith-reddy",
    name: "Rushith Reddy",
    role: "App Development",
    bio: "",
    photo: rushithPhoto,
    github: "",
    linkedin: "https://www.linkedin.com/in/rushith-reddy-5ab906287",
  },

  // ============================================================
  // DATA SCIENCE
  // ============================================================

  {
    id: "member-medha-kethari",
    name: "Medha Kethari",
    role: "Data Science",
    bio: "",
    photo: KmedhaPhoto,
    github: "https://github.com/medha7814",
    linkedin: "",
  },

  {
    id: "member-jahnavi-yerra",
    name: "Jahnavi Yerra",
    role: "Data Science",
    bio: "",
    photo: jahnaviPhoto,
    github: "https://github.com/jahnaviy25-alt",
    linkedin: "https://www.linkedin.com/in/jahnavi-yerra-4b7b61409",
  },

  // ============================================================
  // CYBER SECURITY
  // ============================================================

  {
    id: "member-ayush-bisht",
    name: "Ayush Bisht",
    role: "Cyber Security",
    bio: "",
    photo: ayushPhoto,
    github: "",
    linkedin: "",
  },
];
