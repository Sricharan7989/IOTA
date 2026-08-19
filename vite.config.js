import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'

export default defineConfig({
  plugins: [
    react(),
    // Lets us author real .glsl files with #include support instead of
    // stuffing shaders into template literals. See DESIGN.md §7.
    glsl({ compress: false }),
  ],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    target: 'es2022',
    // three + R3F is ~950 kB raw before we've written a line of scene code.
    // That is the floor for this kind of site, so the default 500 kB warning
    // is just noise here.
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // three is the heaviest dependency by far; keeping it in its own chunk
        // means UI-only changes don't bust its cache entry.
        // Vite 8 runs on rolldown, whose chunking API is `codeSplitting` —
        // rollup's `manualChunks` is accepted but silently ignored.
        codeSplitting: {
          groups: [
            { name: 'three', test: /node_modules[\\/]three[\\/]/ },
            { name: 'r3f', test: /node_modules[\\/]@react-three[\\/]/ },
          ],
        },
      },
    },
  },
})
