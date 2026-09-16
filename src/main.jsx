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
  window.history.scrollRestoration = 'manual'
}

const resetInitialScroll = () => {
  if (!window.location.hash) {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }
}

resetInitialScroll()
requestAnimationFrame(resetInitialScroll)
window.addEventListener('pageshow', resetInitialScroll, { once: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
