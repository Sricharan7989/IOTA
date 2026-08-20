/* IOTA — loads the HDR environment and hands the texture to the Blob.
   Isolated in its own component because useEnvironment suspends: keeping it
   here means the rest of the scene renders immediately and only this probe
   waits on the network.

   NOTE: drei's presets stream from a third-party CDN
   (raw.githack.com/pmndrs/drei-assets). It is wrapped in a Suspense +
   error boundary by Scene.jsx so a slow or failed fetch degrades to the
   shader's analytic environment instead of taking the page down. To remove the
   dependency entirely, download the .hdr into public/ and pass `files`
   instead of `preset`. */
import { useEffect } from 'react'
import { useEnvironment } from '@react-three/drei'

export default function EnvironmentProbe({ preset = 'night', onReady }) {
  const texture = useEnvironment({ preset })

  useEffect(() => {
    if (texture) onReady(texture)
    return () => onReady(null)
  }, [texture, onReady])

  return null
}
