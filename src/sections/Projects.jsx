/* IOTA - Projects section. Content lives in data/projects.js so publishing a
   new club project only means adding its details and links in one place. */
import Card from '../components/Card'
import Section from '../components/Section'
import { PROJECTS } from '../data/projects'
import { getSection } from './manifest'
import styles from './Projects.module.css'

const INTRO =
  'Ideas become real here. Explore what the club is building, inspect the code, and follow each project as it moves from experiment to release.'

function ProjectCard({ project, number }) {
  return (
    <Card
      className={styles.card}
      tabIndex={0}
      aria-label={`${project.name}: ${project.status}. View project details.`}
    >
      {/* Decorative coordinate mark: a small repeatable project-system signal
          rather than a new graphic language for this one section. */}
      <span className={styles.cornerMark} aria-hidden="true" />

      <div className={styles.cardTop}>
        <div className={styles.meta}>
          <p className={styles.projectNumber}>{number}</p>
          <p className={styles.status}>
            <span aria-hidden="true" />
            {project.status}
          </p>
        </div>
        <h3 className={styles.name}>{project.name}</h3>
      </div>

      <p className={styles.description}>{project.description}</p>

      <div className={styles.details}>
        <div className={styles.stackGroup}>
          <p className={styles.stackLabel}>Built with</p>
          <ul className={styles.stack} aria-label={`${project.name} technology stack`}>
            {project.stack.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.links}>
        {project.github ? (
          <a href={project.github} target="_blank" rel="noreferrer" aria-label={`View ${project.name} on GitHub`}>
            GitHub <span aria-hidden="true">↗</span>
          </a>
        ) : null}
        {project.live ? (
          <a href={project.live} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} live site`}>
            Live site <span aria-hidden="true">↗</span>
          </a>
        ) : null}
      </div>
    </Card>
  )
}

export default function Projects() {
  return (
    <Section {...getSection('projects')} eyebrow="Built by IOTA" blurb={INTRO}>
      <ul className={styles.grid}>
        {PROJECTS.map((project, index) => (
          <li key={project.id} className={styles.cell} data-reveal-item>
            <ProjectCard project={project} number={String(index + 1).padStart(2, '0')} />
          </li>
        ))}
      </ul>
    </Section>
  )
}
