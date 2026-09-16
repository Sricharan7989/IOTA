/* IOTA — application entry point.
   Token variables must load before the reset that consumes them, so the import
   order below is significant. */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/tokens.css'
import './styles/global.css'

// Force manual scroll restoration so the browser does not jump to previous scroll coordinates on reload
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

const resetInitialScroll = () => {
  // Always start at the top (Home section) on every page load/reload.
  window.scrollTo(0, 0)
}

// Strip any URL hash so the browser doesn't jump to a mid-page anchor
// before React mounts and the preloader takes over.
if (window.location.hash) {
  history.replaceState(null, '', window.location.pathname + window.location.search)
}

// Run reset on initialization
resetInitialScroll()
requestAnimationFrame(resetInitialScroll)
window.addEventListener('pageshow', resetInitialScroll)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)