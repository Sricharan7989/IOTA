/* IOTA - Roadmap section.
   A multi-track learning roadmap: eight domain chips select a track, and the
   active track renders as a timeline whose spine draws as you scroll.

   Orchestration only. The chips are TrackSelector, the timeline is
   RoadmapTimeline, the content is data/roadmaps.js, and the section chrome is
   the shared <Section>. */
import { useRef, useState } from 'react'
import Section from '../components/Section'
import TrackSelector from '../components/TrackSelector'
import RoadmapTimeline from '../components/RoadmapTimeline'
import { ROADMAPS, DEFAULT_TRACK, getTrack } from '../data/roadmaps'
import { getSection } from './manifest'
import { scrollToElement } from '../lib/scroll'
import styles from './Roadmap.module.css'

/* ============ PLACEHOLDER COPY - swap freely ============ */
const INTRO =
  'Eight tracks, one club. Pick a domain and follow it from first principles to something you have actually shipped.'
/* ================= END PLACEHOLDER COPY ================= */

export default function Roadmap() {
  const [activeSlug, setActiveSlug] = useState(DEFAULT_TRACK)
  const track = getTrack(activeSlug)
  const trackMarkerRef = useRef(null)

  const handleSelectTrack = (newSlug) => {
    if (newSlug === activeSlug) return

    // Decide whether to scroll BEFORE React re-renders. The marker sits just
    // above the sticky chip bar; if it is above the viewport the user has
    // scrolled into the timeline and should be brought back up.
    const marker = trackMarkerRef.current
    const shouldScroll = marker && marker.getBoundingClientRect().top < 0

    setActiveSlug(newSlug)

    if (shouldScroll) {
      // Double rAF: first frame lets React commit the new timeline DOM,
      // second lets RoadmapTimeline's own rAF (ScrollTrigger.refresh) finish.
      // Only then is the page height stable enough for Lenis to scroll to.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToElement(marker, { offset: -8, duration: 1.0 })
        })
      })
    }
  }

  return (
    <Section {...getSection('roadmap')} blurb={INTRO}>
      <div ref={trackMarkerRef} />
      <TrackSelector
        tracks={ROADMAPS}
        activeSlug={activeSlug}
        onSelect={handleSelectTrack}
      />

      {/* key on the slug so React swaps the node outright when the track
          changes - otherwise the old blurb lingers mid-transition. */}
      <p key={track.slug} className={styles.trackBlurb}>
        {track.blurb}
      </p>

      <RoadmapTimeline slug={track.slug} stages={track.stages} />
    </Section>
  )
}
