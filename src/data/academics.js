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
const resources = (pyqUrl) => [
  { type: "PYQs", url: pyqUrl },
  { type: "Reference", url: "#" },
];

/** Create a course entry. */
const course = (name, credits, pyqUrl) => ({
  name,
  credits,
  resources: resources(pyqUrl),
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
