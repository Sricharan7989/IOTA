/* IOTA - academic resources, one entry per semester.
   Single source of truth for the Academics section.

   Each course has:
     - PYQs      → course-specific Google Drive folder
     - Reference → placeholder until the reference links are available
*/

/** The closed vocabulary of resource types. */
export const RESOURCE_TYPES = ["PYQs", "Reference"];

/**
 * Create the resource list for a course.
 * Each PYQ URL should point directly to that course's Drive folder.
 */
const YOUTUBE_PLAYLIST_QUERIES = {
  'Computer Programming': 'C programming full course playlist Neso Academy',
  'Discrete Structures and Matrix Algebra': 'discrete mathematics linear algebra full course playlist',
  'Overview of Computers Workshop': 'computer fundamentals full course playlist',
  'Digital Logic Design': 'digital logic design full course playlist Neso Academy',
  'Essential English': 'English communication skills full course playlist',
  'Ethics in Daily Life': 'ethics in daily life full course playlist',
  'Foundations in Human Values and Ethics': 'universal human values ethics full course playlist',
  'Probability and Statistics': 'probability and statistics full course playlist',
  'Data Structures and Algorithms': 'data structures and algorithms full course playlist Abdul Bari',
  'Signals and Systems': 'signals and systems full course playlist Neso Academy',
  'Computer Architecture': 'computer architecture full course playlist Neso Academy',
  'Operational Communication': 'professional communication skills full course playlist',
  'Basic Electronics Circuits': 'basic electronics circuits full course playlist',
  'Real Analysis, Numerical Analysis and Calculus': 'real analysis numerical analysis calculus full course playlist',
  'Object Oriented Programming': 'object oriented programming Java full course playlist',
  'Advanced Data Structures and Algorithms': 'advanced data structures algorithms full course playlist',
  'Operating Systems': 'operating systems full course playlist Neso Academy',
  'Database Management Systems': 'database management systems full course playlist Neso Academy',
  'Machine Learning': 'machine learning full course playlist Andrew Ng',
  'Professional Communication': 'professional communication skills full course playlist',
  'Computer and Communication Networks': 'computer networks full course playlist Neso Academy',
  'Fundamentals of Full Stack Development': 'full stack web development full course playlist',
  'Theory of Computation': 'theory of computation full course playlist Neso Academy',
  'Electromagnetics and Transmission Lines': 'electromagnetics transmission lines full course playlist',
  'Artificial Intelligence': 'artificial intelligence full course playlist Neso Academy',
  'Quantum Information & Computing': 'quantum computing full course playlist',
  'Fundamentals of Communication': 'communication systems full course playlist Neso Academy',
}

/* Verified direct course resources for the major technical papers. The other
   papers intentionally fall back to their specific playlist search below. */
const YOUTUBE_REFERENCES = {
  'Computer Programming': 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRhX6r2uhhlubuF5QextdCSM',
  'Digital Logic Design': 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm',
  'Data Structures and Algorithms': 'https://www.youtube.com/watch?v=xLetJpcjHS0',
  'Signals and Systems': 'https://www.youtube.com/watch?v=s8rsR_TStaA',
  'Operating Systems': 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRiVhbXDGLXDk_OQAeuVcp2O',
  'Database Management Systems': 'https://www.youtube.com/watch?v=OMwgGL3lHlI',
  'Computer and Communication Networks': 'https://www.youtube.com/watch?v=0pMm_QxCg3I',
  'Theory of Computation': 'https://www.youtube.com/watch?v=58N2N7zJGrQ',
}

const youtubeReference = (courseName) =>
  YOUTUBE_REFERENCES[courseName] ??
  `https://www.youtube.com/results?search_query=${encodeURIComponent(
    YOUTUBE_PLAYLIST_QUERIES[courseName] ?? `${courseName} full course playlist`,
  )}`

const resources = (courseName, pyqUrl) => [
  { type: "PYQs", url: pyqUrl },
  { type: "Reference", url: youtubeReference(courseName) },
];

/** Create a course entry. */
const course = (name, credits, pyqUrl) => ({
  name,
  credits,
  resources: resources(name, pyqUrl),
});

export const SEMESTERS = [
  {
    slug: "sem-1",
    label: "Sem 1",
    courses: [
      course(
        "Computer Programming",
        4,
        "https://drive.google.com/drive/folders/1K8roYItr05gzrURMyiyThYDh2UVbNodn?usp=drive_link",
      ),
      course(
        "Discrete Structures and Matrix Algebra",
        4,
        "https://drive.google.com/drive/folders/1k9AfIiARZigOpiQAtSwLckIbZvejhuiG?usp=drive_link",
      ),
      course(
        "Overview of Computers Workshop",
        4,
        "https://drive.google.com/drive/folders/1MBmy8opt46UL4QKxJ9PtWolj4eOvXtXv?usp=drive_link",
      ),
      course(
        "Digital Logic Design",
        4,
        "https://drive.google.com/drive/folders/1gllOq2ODGHBYqhihS8mqrwJCcUayeXIQ?usp=drive_link",
      ),
      course(
        "Essential English",
        2,
        "https://drive.google.com/drive/folders/13WWh8BZMahmcIMmpkm9GM6-db20_xV1F?usp=drive_link",
      ),
      course(
        "Ethics in Daily Life",
        2,
        "#",
      ),
      course(
        "Foundations in Human Values and Ethics",
        2,
        "https://drive.google.com/drive/folders/1tiDteDtzg5VcS1olp-U0v2cr7mitm_Zx?usp=drive_link",
      ),
    ],
  },

  {
    slug: "sem-2",
    label: "Sem 2",
    courses: [
      course(
        "Probability and Statistics",
        4,
        "https://drive.google.com/drive/folders/1Iq-RbbBA7jbiuvPCClpDs4RfH79cXZKu?usp=drive_link",
      ),
      course(
        "Data Structures and Algorithms",
        4,
        "https://drive.google.com/drive/folders/1Ne_4fzzS5v_ewGmVZt6We17SXSOZLHlv?usp=drive_link",
      ),
      course(
        "Signals and Systems",
        4,
        "https://drive.google.com/drive/folders/1SC_TRtuafljGTU2YVcmoWlPnREU2iCei?usp=drive_link",
      ),
      course(
        "Computer Architecture",
        4,
        "https://drive.google.com/drive/folders/1pe31EEhVmofzRWe-Km3poauJ3-tcValK?usp=drive_link",
      ),
      course(
        "Operational Communication",
        2,
        "https://drive.google.com/drive/folders/1qZzCb94UhDetXvqglo3ahzIv-xHdQOc1?usp=drive_link",
      ),
      course(
        "Basic Electronics Circuits",
        4,
        "https://drive.google.com/drive/folders/1n1q6P_J2KG2N841Kko75OzqRD-BgCsJa?usp=drive_link",
      ),
    ],
  },

  {
    slug: "sem-3",
    label: "Sem 3",
    courses: [
      course(
        "Real Analysis, Numerical Analysis and Calculus",
        4,
        "https://drive.google.com/drive/folders/19nCnCcaNFSVa22WS4KGyeCCSRRXelV9F?usp=drive_link",
      ),
      course(
        "Object Oriented Programming",
        4,
        "https://drive.google.com/drive/folders/170PXNY4V05dg0sgM8cP0cNaAfdEr41qa?usp=drive_link",
      ),
      course(
        "Advanced Data Structures and Algorithms",
        4,
        "https://drive.google.com/drive/folders/14Wqz1wWRK3IM31WyTsBeAp2MbriGLtZo?usp=drive_link",
      ),
      course(
        "Operating Systems", 
        4, 
        "https://drive.google.com/drive/folders/1aj95DXG3TtI7t4qFzWXLNWKfhHew0M-E?usp=drive_link",
      ),
      course(
        "Database Management Systems",
        4,
        "https://drive.google.com/drive/folders/1UgpG8feDIJbz0GK2i-36LFhjA3JzW4OG?usp=drive_link",
      ),
      course(
        "Machine Learning", 
        4, 
        "#"
      ),
      course(
        "Professional Communication",
        2,
        "#",
      ),
    ],
  },

  {
    slug: "sem-4",
    label: "Sem 4",
    courses: [
      course(
        "Computer and Communication Networks",
        4,
        "https://drive.google.com/drive/folders/1dK_LY1HOAnbp5L94AUEYNWtDnLkTsB-s?usp=drive_link",
      ),
      course(
        "Fundamentals of Full Stack Development",
        4,
        "#",
      ),
      course(
        "Theory of Computation",
        4,
        "https://drive.google.com/drive/folders/1Iz0q72SPE61kRR1X9PDyqZsnyu4TvsZs?usp=drive_link",
      ),
      course(
        "Electromagnetics and Transmission Lines",
        4,
        "https://drive.google.com/drive/folders/1necvOhlAu4uYS--YuOPbTK-qEIMtNwce?usp=drive_link",
      ),
      course(
        "Artificial Intelligence",
        2,
        "https://drive.google.com/drive/folders/15RQ4Dt8NTWLtSK6OmdJfLxDeGmhgHuOi?usp=drive_link",
      ),
      course(
        "Quantum Information & Computing",
        2,
        "#",
      ),
      course(
        "Fundamentals of Communication",
        2,
        "https://drive.google.com/drive/folders/1VKoFpu0gSi5gzfbxzMSeNYQEQjSAm13o?usp=drive_link",
      ),
    ],
  },
];

export const DEFAULT_SEMESTER = SEMESTERS[0].slug;

export function getSemester(slug) {
  return SEMESTERS.find((semester) => semester.slug === slug) ?? SEMESTERS[0];
}
