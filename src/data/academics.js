/* IOTA - academic resources, one entry per semester.
   Single source of truth for the Academics section: the semester tabs map over
   SEMESTERS, and the grid renders the active semester's courses.

   Schema, per semester:
     { slug, label, courses: [ { name, credits, resources: [...] } ] }

   Schema, per resource:
     { type, url }

   `type` is what the pill reads and MUST be one of RESOURCE_TYPES. Every
   course carries the same two - the club collects past papers and one
   reference per subject, and nothing else pretends to exist yet. Every url is
   "#" until the real Drive links land.

   Courses are ordered 4-credit first, then 2-credit, and the grid renders them
   in exactly this order. Keep that when you add a semester: the badge is the
   first thing on the card, so an unsorted list reads as a mistake. */

/** The closed vocabulary of resource types. The pill label is the type itself. */
export const RESOURCE_TYPES = ['PYQs', 'Reference']

/** Every course carries the same pair, so build it rather than retyping it. */
const resources = () => [
  { type: 'PYQs', url: '#' },
  { type: 'Reference', url: '#' },
]

const course = (name, credits) => ({ name, credits, resources: resources() })

export const SEMESTERS = [
  {
    slug: 'sem-1',
    label: 'Sem 1',
    courses: [
      course('Computer Programming', 4),
      course('Discrete Structures and Matrix Algebra', 4),
      course('Overview of Computers Workshop', 4),
      course('Digital Logic Design', 4),
      course('Essential English / Ethics in Everyday Life', 2),
      course('Foundations in Human Values and Ethics', 2),
    ],
  },

  {
    slug: 'sem-2',
    label: 'Sem 2',
    courses: [
      course('Probability and Statistics', 4),
      course('Data Structures and Algorithms', 4),
      course('Signals and Systems', 4),
      course('Computer Architecture', 4),
      course('Operational Communication', 2),
      course('Ethics in Everyday Life / AIV', 2),
    ],
  },

  {
    slug: 'sem-3',
    label: 'Sem 3',
    courses: [
      course('Real Analysis, Numerical Analysis and Calculus', 4),
      course('Object Oriented Programming', 4),
      course('Advanced Data Structures and Algorithms', 4),
      course('Operating Systems', 4),
      course('Database Management Systems', 4),
      course('ML', 4),
      course('Professional Communication', 2),
    ],
  },

  {
    slug: 'sem-4',
    label: 'Sem 4',
    courses: [
      course('Computer and Communication Networks', 4),
      course('Fundamentals of Full Stack Development', 4),
      course('Theory of Computation', 4),
      course('Artificial Intelligence', 2),
      course('Quantum Information & Computing', 2),
    ],
  },
]

/** Semester shown when the section first renders. */
export const DEFAULT_SEMESTER = SEMESTERS[0].slug

export function getSemester(slug) {
  return SEMESTERS.find((semester) => semester.slug === slug) ?? SEMESTERS[0]
}
