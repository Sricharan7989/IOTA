/* IOTA — React binding for the quality tier.
   The tier itself is detected once (lib/quality.js); this hook adds the one
   piece that genuinely changes at runtime, prefers-reduced-motion, and hands
   back a single settings object for components to read. */
import { useEffect, useMemo, useState } from 'react'
import { getQuality, prefersReducedMotion } from '../lib/quality'

export function useQuality() {
  const base = getQuality()
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  return useMemo(
    () => ({
      ...base,
      reducedMotion,
      // Reduced motion means a genuinely static scene, so the HDR would buy
      // nothing but a 1.7 MB download.
      hdrEnvironment: base.hdrEnvironment && !reducedMotion,
    }),
    [base, reducedMotion],
  )
}
