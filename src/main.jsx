/* IOTA — application entry point.
   Token variables must load before the reset that consumes them, so the import
   order below is significant. */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/tokens.css'
import './styles/global.css'

// A refresh should begin at the designed opening frame. Browser restoration can
// occur after the module first evaluates, so reset now, on the next frame, and
// once more at page-show. Explicit hash links remain available for deep links.
if ('scrollRestoration' in window.history) {
  // Allow browser to restore scroll on reload/back
  window.history.scrollRestoration = 'auto'
}

const resetInitialScroll = () => {
  // Only run if this is the very first load (no history state yet)
  if (!window.location.hash && !performance.getEntriesByType('navigation')[0]?.type.includes('reload')) {
    window.scrollTo(0, 0)
  }
}

// Run once at startup
resetInitialScroll()
requestAnimationFrame(resetInitialScroll)
window.addEventListener('pageshow', resetInitialScroll, { once: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
