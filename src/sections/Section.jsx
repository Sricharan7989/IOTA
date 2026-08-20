/* IOTA — shared section shell.
   The layout primitive every section is built on: mono index label, display
   heading, and a lot of deliberate empty space. Real content arrives in
   Phase 4; the structure exists now because the scroll choreography needs
   something to measure. */
import styles from './Section.module.css'

export default function Section({ id, index, label, heading, hero = false, children }) {
  const Heading = hero ? 'h1' : 'h2'

  return (
    <section id={id} className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.index}>
          <span className={styles.number}>{index}</span>
          <span className={styles.rule} aria-hidden="true" />
          <span className={styles.name}>{label}</span>
        </p>

        <Heading className={`${styles.heading} ${hero ? styles.h1 : styles.h2}`}>
          {heading}
        </Heading>

        {children}
      </div>
    </section>
  )
}
