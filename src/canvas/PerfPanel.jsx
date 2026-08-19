/* IOTA — r3f-perf overlay.
   Isolated in its own module so it can be code-split out of the production
   bundle entirely (see SceneCanvas.jsx). r3f-perf is a devDependency, so it
   must never be reachable from a production import graph. */
import { Perf } from 'r3f-perf'

export default function PerfPanel() {
  return <Perf position="bottom-left" />
}
