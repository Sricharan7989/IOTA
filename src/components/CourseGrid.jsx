/* IOTA - the Academics course grid.
   One <Card> per course in the active semester: a credits badge, the course
   name, and the two resource pills. The surface and all of its pointer
   behaviour belong to Card; this file owns the grid and the contents.

   It is its own reveal scope rather than leaning on the section's: the section
   reveals once, on the way in, but this grid has to re-reveal every time the
   semester changes. Academics keys this component on the slug, so a switch is
   a remount - the reveal effect runs again from scratch and the cards stagger
   back in. useReveal's nested-root rule is what keeps the section's stagger
   from also claiming these cards on first mount.

   The new semester is a different height, so every trigger below the grid has
   moved; ScrollTrigger.refresh() after layout settles puts them back. */
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReveal } from '../hooks/useReveal'
import Card from './Card'
import { prefersReducedMotion } from '../lib/quality'
import styles from './CourseGrid.module.css'

/* Placeholder urls are "#" until the real links land - only send a genuine
   destination to a new tab. */
const isExternal = (url) => /^https?:\/\//i.test(url)

export default function CourseGrid({ slug, label, courses }) {
  const root = useRef(null)

  // Slightly tighter than the section default: a grid reads as one group, so
  // the last card should not arrive a beat after the eye has moved on.
  useReveal(root, { start: 'top 82%', stagger: 0.06 })

  useEffect(() => {
    const scope = root.current
    if (!scope) return undefined

    // DESIGN.md 5: reduced motion renders in place. Nothing was hidden, so
    // there is nothing to fade - but the layout still changed, so the refresh
    // below still has to happen.
    const context = prefersReducedMotion()
      ? null
      : gsap.context(() => {
          // Switching semesters: ease the whole new grid in rather than
          // snapping it, so the swap reads as a transition, not a flicker.
          gsap.fromTo(
            scope,
            { opacity: 0 },
            { opacity: 1, duration: 0.5, ease: 'expo.out' },
          )
        }, scope)

    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      cancelAnimationFrame(frame)
      context?.revert()
    }
  }, [courses])

  return (
    <div
      ref={root}
      id={`academics-panel-${slug}`}
      role="tabpanel"
      aria-label={`${label} courses`}
    >
      <ul className={styles.grid}>
        {courses.map((course) => (
          <li key={course.name} className={styles.cell} data-reveal-item>
            <Card>
              {/* Weight first: what a course costs you is the thing you sort
                  a semester by, so it opens the card. */}
              <p className={styles.credits}>{course.credits} Credits</p>

              <h3 className={styles.name}>{course.name}</h3>

              <ul className={styles.links}>
                {course.resources.map((resource) => (
                  <li key={resource.type}>
                    <a
                      className={styles.pill}
                      href={resource.url}
                      // The pill reads as its type; the accessible name adds
                      // the course, so a screen reader does not hear "PYQs" a
                      // dozen times with no idea which one it is on.
                      aria-label={`${resource.type} for ${course.name}`}
                      {...(isExternal(resource.url)
                        ? { target: '_blank', rel: 'noreferrer' }
                        : null)}
                    >
                      {resource.type}
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
