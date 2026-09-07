/* IOTA - Roadmap section.
   A multi-track learning roadmap: nine domain chips select a track, and the
   active track renders as a timeline whose spine draws as you scroll.

   Orchestration only. The chips are TrackSelector, the timeline is
   RoadmapTimeline, the content is data/roadmaps.js, and the section chrome is
   the shared <Section>. */
import { useState } from 'react'
import Section from '../components/Section'
import TrackSelector from '../components/TrackSelector'
import RoadmapTimeline from '../components/RoadmapTimeline'
import { ROADMAPS, DEFAULT_TRACK, getTrack } from '../data/roadmaps'
import { getSection } from './manifest'
import styles from './Roadmap.module.css'

/* ============ PLACEHOLDER COPY - swap freely ============ */
const INTRO =
  'Nine tracks, one club. Pick a domain and follow it from first principles to something you have actually shipped.'
/* ================= END PLACEHOLDER COPY ================= */

export default function Roadmap() {
  const [activeSlug, setActiveSlug] = useState(DEFAULT_TRACK)
  const track = getTrack(activeSlug)

  return (
    <Section {...getSection('roadmap')} blurb={INTRO}>
      <TrackSelector
        tracks={ROADMAPS}
        activeSlug={activeSlug}
        onSelect={setActiveSlug}
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
