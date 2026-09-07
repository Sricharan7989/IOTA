/* IOTA - Academics section.
   Semester tabs over a grid of course cards, each card holding typed links to
   the notes, papers and lab material the club has collected for that course.

   Orchestration only, the same shape as Roadmap: the tabs are TrackSelector
   (reused outright, so the two selectors are the same control), the grid is
   CourseGrid, the content is data/academics.js, and the chrome is the shared
   <Section>. */
import { useState } from 'react'
import Section from '../components/Section'
import TrackSelector from '../components/TrackSelector'
import CourseGrid from '../components/CourseGrid'
import { SEMESTERS, DEFAULT_SEMESTER, getSemester } from '../data/academics'
import { getSection } from './manifest'
import styles from './Academics.module.css'

/* ============ PLACEHOLDER COPY - swap freely ============ */
const INTRO =
  'Everything the club has collected for the core papers, semester by semester. Notes, past papers, lab sheets - kept in one place so nobody has to ask for them the night before.'
/* ================= END PLACEHOLDER COPY ================= */

export default function Academics() {
  const [activeSlug, setActiveSlug] = useState(DEFAULT_SEMESTER)
  const semester = getSemester(activeSlug)

  return (
    <Section {...getSection('academics')} blurb={INTRO}>
      <TrackSelector
        tracks={SEMESTERS}
        activeSlug={activeSlug}
        onSelect={setActiveSlug}
        label="Semesters"
        panelPrefix="academics-panel"
      />

      {/* Keyed on the slug so React swaps the node outright when the semester
          changes - otherwise the old count lingers mid-transition. Prefixed
          because this and the grid below are siblings: two children of the
          same parent cannot share a key. */}
      <p key={`count-${semester.slug}`} className={styles.count}>
        <span className={styles.number}>
          {String(semester.courses.length).padStart(2, '0')}
        </span>
        <span className={styles.rule} aria-hidden="true" />
        <span>{semester.label} courses</span>
      </p>

      {/* Keyed so switching semesters remounts the grid: the reveal re-runs
          and the cards stagger back in. See CourseGrid. */}
      <CourseGrid
        key={`grid-${semester.slug}`}
        slug={semester.slug}
        label={semester.label}
        courses={semester.courses}
      />
    </Section>
  )
}
