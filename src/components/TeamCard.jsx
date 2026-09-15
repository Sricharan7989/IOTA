/* IOTA - one person, at one of three ranks.
   Built on the shared <Card>, so a team member reacts to a pointer with
   exactly the same hand as a roadmap stage or a course (DESIGN.md 8). What
   this file adds is the person layout - monogram, name, role, bio, socials -
   and the SIZE step between tiers.

   Size is half the hierarchy. The other half is animation intensity, and that
   belongs to useTeamReveal, not here: this component renders a rank, it does
   not animate one. The only concession is the coordinator's sweep element,
   which has to exist in the markup for the hook to drive.

   `tier` is one of TIERS below - five sizes, largest to smallest. Anything
   unrecognised falls back to member, which is the baseline everywhere else in
   the section too.

   A person's photo is optional and so is each social. Everything degrades to
   the gradient monogram and a shorter link row - see socialsOf and the avatar
   below.

   `showRole` is kept for the case where a tier heading already says exactly
   what a card's role says. Nothing uses it now - the tier labels are group
   names ("COORDINATORS"), not any one person's title - but it costs a line
   and saves rediscovering the problem. */
import Card from './Card'
import styles from './TeamCard.module.css'

const TIERS = ['mentor', 'advisor', 'coordinator', 'executive', 'member']

/* The two tiers that get the glow sweep. Sweeping every tier would make it
   decoration; sweeping exactly the top two is what makes it rank. */
const TOP_TIERS = ['mentor', 'advisor', 'coordinator']

/* Initials, capped at two. A single-word name gives one letter, which is what
   the placeholder Greek names produce and what most handles produce too. */
function monogram(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

/* Only send a real destination to a new tab. */
const isExternal = (url) => /^https?:\/\//i.test(url)

/* The socials, in a fixed order, with the empty ones dropped. Named fields in
   the data become a list here rather than the other way round: filling in
   "github" is something anyone can do, and maintaining an array of
   { label, url } objects is not. Adding a third social is one line here and
   one field in data/team.js. */
function socialsOf(person) {
  return [
    { label: 'GitHub', url: person.github },
    { label: 'LinkedIn', url: person.linkedin },
  ].filter((social) => social.url)
}

export default function TeamCard({ person, tier = 'member', showRole = true }) {
  const rank = TIERS.includes(tier) ? tier : 'member'
  const socials = socialsOf(person)

  return (
    <Card className={`${styles.card} ${styles[rank]}`}>
      {/* Driven by useTeamReveal, and only ever present on the coordinator -
          the whole point of the sweep is that exactly one card gets it. It
          sits behind the text: Card's .content owns a stacking context, so a
          negative z-index here stays inside the card and under the copy. */}
      {TOP_TIERS.includes(rank) ? (
        <span className={styles.sweep} data-sweep aria-hidden="true" />
      ) : null}

      {/* The monogram is the BASE layer and the photo sits on top of it, which
          is what makes the fallback free: no photo and you see initials; a
          photo that 404s hides itself on error and you see initials again,
          rather than a broken-image icon inside a gradient circle.

          aria-hidden because the name is rendered right below it - a screen
          reader announcing the photo as well would just say it twice. */}
      <span className={styles.avatar} aria-hidden="true">
        {person.photo ? (
          <img
            className={styles.photo}
            src={person.photo}
            alt=""
            loading="lazy"
            decoding="async"
            // Inline style rather than the `hidden` attribute: .photo sets
            // `position`, and an author rule would win over the UA's
            // [hidden] display:none.
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        ) : monogram(person.name)}
      </span>

      {/* h4 because the tier heading above this card is the h3, under the
          section's h2. The outline has to stay walkable. */}
      <h4 className={styles.name}>{person.name}</h4>

      {showRole ? <p className={styles.role}>{person.role}</p> : null}

      <p className={styles.bio}>{person.bio}</p>

      {socials.length ? (
        <ul className={styles.links}>
          {socials.map((link) => (
            <li key={link.label}>
              <a
                className={styles.link}
                href={link.url}
                // The label alone is "GitHub" on thirteen cards; the
                // accessible name says whose.
                aria-label={`${person.name} on ${link.label}`}
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
  )
}
