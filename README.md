# IOTA

A 3D interactive landing page for the IOTA student club. One continuous scroll
journey over a single WebGL canvas: a 100k-particle warp field, an iridescent
shader centerpiece, and a scrubbed camera move — on a black, blue-violet palette.

- **`PROJECT.md`** — brief, stack, architecture, phase log
- **`DESIGN.md`** — the design system: palette, type, motion, 3D language

---

## Requirements

- **Node 20.19+ or 22.12+** (Vite 8 requirement)
- npm 10+

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173, opens automatically
```

| Script            | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Dev server with HMR                           |
| `npm run build`   | Production build into `dist/`                 |
| `npm run preview` | Serve the built output at :4173               |

Always check `npm run build` before pushing — dev is more forgiving than the
production bundler.

---

## Project structure

```
src/
├── main.jsx          entry — imports tokens.css then global.css, in that order
├── App.jsx           composition: canvas layer, navbar, sections, preloader
├── components/       DOM UI — navbar, preloader, placeholder
├── canvas/           everything inside <Canvas>
│   └── shaders/      .glsl, imported as strings by vite-plugin-glsl
│       └── lib/      shared chunks (noise)
├── sections/         one file per section + manifest.js (the source of truth)
├── hooks/            React behaviour — useQuality, usePointer, useMagnetic, …
├── lib/              singletons that outlive React — scroll, quality, maths
└── styles/           tokens.css + global.css
```

**Two layers, always.** A fixed transparent `<Canvas>` at `z-index: 0` that never
unmounts, and the scrolling DOM at `z-index: 1`. There is exactly one WebGL
context for the whole page.

**Colours live in `src/styles/tokens.css` and nowhere else.** The shaders read
them back out of CSS at runtime via `src/canvas/palette.js`, so there is no
second copy of the palette to drift.

---

## Dev tools

Both are stripped from production builds — they are gated behind
`import.meta.env.DEV`, which the bundler folds to `false` and dead-code
eliminates.

- **Leva panel** (top right) — live tuning for the warp and the blob.
  Dialled-in numbers belong back in `WARP_DEFAULTS` / `BLOB_DEFAULTS`; those are
  what ship.
- **r3f-perf** (bottom left) — live fps, draw calls, GPU time.

---

## Quality tiers

`src/lib/quality.js` probes the device once per session — pointer type, screen
size, `hardwareConcurrency`, `deviceMemory`, and the WebGL renderer string — and
picks a budget. Everything else reads the result.

| | Particles | Blob detail | Max DPR | Bloom | Chromatic | HDR env |
| --------- | ------- | -- | ---- | --- | --- | --- |
| **High**   | 100,000 | 32 | 2.0  | yes | yes | yes |
| **Medium** |  45,000 | 20 | 1.5–2 | yes | no  | no  |
| **Low**    |  18,000 | 12 | 1.5  | no  | no  | no  |

Low tier is chosen for phones that are also short on cores or memory, for
software renderers (SwiftShader/llvmpipe), and whenever WebGL is unavailable —
in which case the canvas never mounts and a CSS gradient backdrop stands in.

**`prefers-reduced-motion`** is handled separately and thoroughly: Lenis does not
initialise, the warp freezes to a still starfield, the blob holds one pose, the
camera does not dolly, text reveals become fades, magnetic hover is off, and the
canvas switches to `frameloop="demand"` so a static scene renders once instead of
sixty times a second.

---

## Deploying to Vercel

`vercel.json` is committed with the build settings and asset caching headers, so
the dashboard fields should already be correct.

### Option A — dashboard

1. Push the repo to GitHub.
2. [vercel.com/new](https://vercel.com/new) → **Import** the repository.
3. Confirm the settings (auto-detected from `vercel.json`):
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Install command:** `npm install`
4. **Deploy.**

### Option B — CLI

```bash
npm i -g vercel
vercel login
vercel          # preview deployment
vercel --prod   # production
```

### Node version

Vercel defaults to a current Node LTS, which satisfies Vite 8. To pin it, add to
`package.json`:

```json
"engines": { "node": ">=20.19" }
```

### No rewrites needed

This is a single HTML page — the nav uses in-page anchors, not client-side
routing — so the usual SPA catch-all rewrite is unnecessary. Add one only if
real routes appear later.

---

## Before launch

- **Self-host the environment HDR.** `EnvironmentProbe` currently pulls
  `dikhololo_night_1k.hdr` (~1.7 MB) from `raw.githack.com` via drei's preset
  list. It is wrapped in an error boundary and only fetched on the top tier, but
  a third-party CDN should not be on the critical path for the centerpiece.
  Download it into `public/hdri/` and pass `files` instead of `preset`.
- **Section content is still stubbed.** Roadmap, Resources and Team render an
  index label and a heading only. Hero copy is a clearly marked `COPY` block at
  the top of `src/sections/Home.jsx`.
- **`public/models/iota-neon.glb`** (4.6 MB) is unused. Delete it or compress it
  with Draco/meshopt before it ships.
