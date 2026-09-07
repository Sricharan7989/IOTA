/* IOTA — roadmap timeline.
   A spine that draws top-to-bottom as you scroll, with a leading dot riding
   its head, a node per stage that springs in as it activates, and a <Card>
   that reveals with a stagger.

   THE BLAZE. The one signature effect here: the track heats up as it descends.
   Beginner is a dim, cold blue; Intermediate is lit; Advanced blazes
   cyan-white. Everything that can carry that ramp does — the spine gradient,
   the card halos, the level tag, the node glow — so a reader knows how hard a
   stage is before reading a word of it. All of it keys off ONE attribute,
   data-level on the <li>, which is why the ramp cannot drift out of step
   between the four things expressing it.

   The spine is revealed by clipping a WRAPPER, not by scaling the gradient.
   Scaling would squash the whole ramp into whatever fraction had been drawn,
   so at 30% you would see all three tiers crammed into the top third instead
   of the cool end of a full-height gradient. One clip on the wrapper also
   means the blurred glow layers inside are rendered once and merely re-clipped
   as you scroll, rather than re-blurred every frame.

   Node activation is done by toggling a class straight on the DOM element
   rather than through React state. Three nodes of state would be survivable,
   but ScrollTrigger already owns the enter/leave events and routing them
   through a re-render buys nothing — see PROJECT.md's 60fps contract.

   The spine and its leading dot share ONE timeline rather than two triggers.
   They have to agree to the pixel about where the draw head is, and two
   scrubbed triggers with the same range would still be two clocks.

   Everything is rebuilt when `stages` changes, which is what makes track
   switching work: the old context is reverted, the new one measures the new
   height, and ScrollTrigger.refresh() recalculates the draw distance. */
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Card from './Card'
import { prefersReducedMotion } from '../lib/quality'
import styles from './RoadmapTimeline.module.css'

/* data/roadmaps.js writes levels as prose. The blaze needs a key, and this is
   the single place the two vocabularies meet — so a level the data invents
   later degrades to the coolest tier rather than to no styling at all. */
const LEVEL_KEYS = {
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Advanced: 'advanced',
}

const levelKey = (level) => LEVEL_KEYS[level] ?? 'beginner'

export default function RoadmapTimeline({ slug, stages }) {
  const root = useRef(null)
  const track = useRef(null)
  const fill = useRef(null)
  const head = useRef(null)

  useEffect(() => {
    const scope = root.current
    const trackEl = track.current
    const fillEl = fill.current
    const headEl = head.current
    if (!scope || !trackEl || !fillEl) return undefined

    const stageEls = Array.from(scope.querySelectorAll('[data-stage]'))
    const reduced = prefersReducedMotion()

    // How much of the spine is still hidden, as a percentage clipped off the
    // bottom. 100 = undrawn, 0 = fully drawn.
    const setFill = (percent) => {
      fillEl.style.setProperty('--fill', `${percent}%`)
    }

    // DESIGN.md §5: reduced motion shows the finished state, in place. The
    // spine is fully drawn and every node is lit, so the section reads exactly
    // the same — the whole blaze ramp included, since that is colour rather
    // than movement. It just does not animate getting there. The leading dot
    // has no finished state worth showing: it only means "drawing happens
    // here".
    if (reduced) {
      setFill(0)
      if (headEl) gsap.set(headEl, { opacity: 0 })
      stageEls.forEach((stage) => stage.classList.add(styles.active))
      return undefined
    }

    const context = gsap.context(() => {
      // Switching tracks: ease the whole new timeline in rather than snapping
      // it, so the swap reads as a transition instead of a flicker.
      gsap.fromTo(
        scope,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' },
      )

      // ---- The spine draw, and the dot that leads it ----
      const draw = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: 'top 68%',
          end: 'bottom 82%',
          // A little scrub lag is what makes the draw feel weighty rather
          // than nailed to the scrollbar.
          scrub: 0.6,
          // The dot's travel is measured in pixels, so it has to be
          // re-measured whenever the track's height changes.
          invalidateOnRefresh: true,
        },
      })

      // Tweening a plain object and writing the custom property in onUpdate,
      // rather than tweening the property itself: one style write per frame,
      // and no dependence on how a given GSAP build parses percentage units
      // out of a CSS variable.
      const progress = { hidden: 100 }
      draw.to(
        progress,
        {
          hidden: 0,
          ease: 'none',
          duration: 1,
          onUpdate: () => setFill(progress.hidden),
        },
        0,
      )

      if (headEl) {
        draw
          .fromTo(
            headEl,
            { y: 0 },
            { y: () => trackEl.offsetHeight, ease: 'none', duration: 1 },
            0,
          )
          // Struck at the start and gone once the line is complete: a dot
          // parked at the end would read as a bullet, not as a draw head.
          .fromTo(headEl, { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0)
          .to(headEl, { opacity: 0, duration: 0.1 }, 0.9)
      }

      // ---- Nodes and cards ----
      stageEls.forEach((stage) => {
        const node = stage.querySelector('[data-node]')
        const ring = stage.querySelector('[data-ring]')

        ScrollTrigger.create({
          trigger: stage,
          start: 'top 72%',
          onEnter: () => {
            stage.classList.add(styles.active)
            // Spring in, with one ring going out from under it. overwrite
            // kills any in-flight reset so fast scrubbing cannot strand a
            // node mid-tween.
            if (node) {
              gsap.fromTo(
                node,
                { scale: 0.55 },
                { scale: 1, duration: 0.85, ease: 'back.out(3.4)', overwrite: true },
              )
            }
            if (ring) {
              gsap.fromTo(
                ring,
                { scale: 0.85, opacity: 0.9 },
                { scale: 2.6, opacity: 0, duration: 0.95, ease: 'expo.out', overwrite: true },
              )
            }
          },
          // Scrolling back up un-lights them, so the sequence replays.
          onLeaveBack: () => {
            stage.classList.remove(styles.active)
            if (node) gsap.to(node, { scale: 1, duration: 0.3, ease: 'expo.out', overwrite: true })
            if (ring) gsap.set(ring, { opacity: 0 })
          },
        })

        // Only the children the caller rendered — Card's sheen is its own
        // business and must not be dragged into the stagger.
        const card = stage.querySelector('[data-card-content]')
        if (!card) return

        gsap.from(card.children, {
          y: 22,
          opacity: 0,
          duration: 0.7,
          ease: 'expo.out',
          stagger: 0.07,
          scrollTrigger: { trigger: stage, start: 'top 72%' },
        })
      })
    }, scope)

    // The new track has a different height, so every trigger below it has
    // moved. Refresh after layout settles, not during this commit.
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      cancelAnimationFrame(frame)
      context.revert()
    }
  }, [stages])

  return (
    <div
      ref={root}
      className={styles.timeline}
      id={`roadmap-panel-${slug}`}
      role="tabpanel"
      aria-label={`${slug} roadmap`}
    >
      <div ref={track} className={styles.spineTrack} aria-hidden="true">
        {/* One clip, on the wrapper, driven by --fill. The three layers inside
            are static, so they are painted once and only re-clipped. */}
        <div ref={fill} className={styles.spineFill}>
          <span className={styles.spineGlow} />
          <span className={styles.spine} />
          <span className={styles.spineHeat} />
        </div>
      </div>

      {/* Outside the track, which is 2px wide and clips: the dot is wider than
          the line it is drawing. */}
      <span ref={head} className={styles.head} aria-hidden="true" />

      <ol className={styles.stages}>
        {stages.map((stage, index) => (
          <li
            key={stage.title}
            className={styles.stage}
            data-stage
            // The one source of the blaze. Node, halo and level tag all read
            // it, so the three can never disagree about how hot a stage is.
            data-level={levelKey(stage.level)}
          >
            <span className={styles.node} data-node aria-hidden="true">
              <span className={styles.ring} data-ring />
            </span>

            {/* Card cannot host the halo itself — it clips its own overflow to
                contain its sheen — so the heat lives on a wrapper behind it. */}
            <div className={styles.cardWrap}>
              <Card>
                <p className={styles.meta}>
                  <span className={styles.stageIndex}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.level}>{stage.level}</span>
                </p>

                <h3 className={styles.title}>{stage.title}</h3>

                <p className={styles.desc}>{stage.desc}</p>

                <ul className={styles.items}>
                  {stage.items.map((item) => (
                    <li key={item} className={styles.item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
