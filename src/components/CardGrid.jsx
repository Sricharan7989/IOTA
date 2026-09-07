/* IOTA - a grid of <Card>s over a flat list.
   Resources and Team are the same shape - an eyebrow, a title, a paragraph,
   maybe a link - so they share one grid rather than growing two that drift
   apart. Academics keeps its own (CourseGrid): its cards carry a credits badge
   and typed resource pills, and its content swaps under a tab, which is a
   different problem.

   No reveal scope of its own. The cells are marked [data-reveal-item] and the
   enclosing <Section> already staggers those; a nested scope only earns its
   keep when the content can change without the section remounting. */
import Card from './Card'
import styles from './CardGrid.module.css'

/* Placeholder urls are "#" and in-page ones are "#section" - neither should
   open a new tab. */
const isExternal = (url) => /^https?:\/\//i.test(url)

export default function CardGrid({ items }) {
  return (
    <ul className={styles.grid}>
      {items.map((item) => (
        <li key={item.id} className={styles.cell} data-reveal-item>
          <Card>
            <p className={styles.eyebrow}>{item.eyebrow}</p>

            <h3 className={styles.title}>{item.title}</h3>

            <p className={styles.body}>{item.body}</p>

            {item.links.length ? (
              <ul className={styles.links}>
                {item.links.map((link) => (
                  <li key={link.label}>
                    <a
                      className={styles.link}
                      href={link.url}
                      {...(isExternal(link.url)
                        ? { target: '_blank', rel: 'noreferrer' }
                        : null)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </Card>
        </li>
      ))}
    </ul>
  )
}
