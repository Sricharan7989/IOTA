# IOTA — Project Brief

> Read this and `DESIGN.md` before starting any phase.

---

## What this is

A landing page for **IOTA**, a student club. Not a product, not a startup, not a
token. Copy, tone and CTAs must read like an organisation people **join**, never
something people **buy**.

## Goal

A premium, Lusion-inspired, 3D, heavily interactive site. **One flawless scroll
journey.** Depth over breadth — a few moments executed perfectly beat many
moments executed adequately.

---

## Stack

| Concern         | Choice                                       | Version   |
| --------------- | -------------------------------------------- | --------- |
| Build           | Vite (rolldown)                               | 8.2       |
| UI              | React (JavaScript, **no TypeScript**)         | 19.2      |
| 3D              | three + @react-three/fiber + @react-three/drei| 0.185 / 9 / 10 |
| Post-processing | @react-three/postprocessing                   | 3.0       |
| Animation       | GSAP (+ ScrollTrigger)                        | 3.15      |
| Smooth scroll   | Lenis                                         | 1.3       |
| Debug controls  | leva                                          | 0.10      |
| Perf HUD        | r3f-perf (**dev dependency**)                 | 7.2       |
| Styling         | CSS Modules per component + global tokens     | —         |

JavaScript, not TypeScript, on purpose — this is a club project and new members
have to be able to open a file and contribute to it.

### The HDR core and the bloom threshold are one system

Three settings are coupled. Change any one alone and the centerpiece stops
reading as light:

1. `uCoreHdr` in `EnergyMass` pushes the core colour above 1.0.
2. `EffectComposer` renders to a **HalfFloatType** buffer, so values above 1.0
   survive instead of clamping. It is passed explicitly in `Effects.jsx` for
   exactly this reason.
3. `Bloom`'s `luminanceThreshold` sits at **1.0**, so only genuinely HDR pixels
   bloom.

That combination is what makes the core glow like a source while the dark 90%
of the frame stays untouched. Drop the threshold instead and bloom lifts the
whole frame, which is what DESIGN.md 6 warns against; drop the HDR and a 1.0
threshold catches nothing at all.

### Depth of field is in the shaders, not the composer

Every material in the scene is additive with `depthWrite: false`, so the depth
buffer is never written. `<DepthOfField>` reads that buffer to decide what to
blur — given a uniform buffer it blurs everything or nothing. Enabling depth
writes is not an option either: additive particles depend on stacking, and
depth-testing them against each other is what destroys the white-hot core.

So the circle of confusion is computed per particle in the vertex shaders
(`uFocusDistance` / `uFocusRange` / `uBokehScale` in `EnergyMass` and
`Debris`). A defocused sprite grows, dims, and widens its falloff — which is
what a lens does to a point of light — for a few instructions instead of a
full-screen blur. Controls live in those two Leva panels, not in `Grade`.

### Two build notes worth knowing

- Vite 8 runs on **rolldown**. Rollup's `output.manualChunks` is accepted but
  **silently ignored**; the working API is `output.codeSplitting.groups`. That's
  what `vite.config.js` uses to split `three` into its own cacheable chunk.
- **React must be its own chunk group, declared first.** Without an explicit
  `react` group, the bundler folds `react-dom` into the `r3f` chunk (they share
  it) — and since the entry needs `createRoot` on first paint, that drags all of
  fiber + three onto the critical path and silently defeats the lazy `<Canvas>`.
  Costed ~240 kB gzip of first-paint weight until it was caught in Phase 5.
- `r3f-perf` is a devDependency, so it must never be reachable from a production
  import graph. `src/canvas/SceneCanvas.jsx` gates it behind
  `import.meta.env.DEV`, which the bundler statically folds to `false` in
  production and drops the dynamic import entirely.

---

## Folder structure

```
IOTA/
├── DESIGN.md            design system — palette, type, motion, 3D language
├── PROJECT.md           this file
├── index.html           document shell, Google Fonts <link>
├── vite.config.js
├── public/
│   └── models/          static 3D assets
└── src/
    ├── main.jsx         entry — mounts React, imports tokens then global css
    ├── App.jsx          composition only: canvas layer + DOM layer
    ├── components/      DOM UI — navbar, cursor, layout chrome
    ├── canvas/          everything inside <Canvas> (R3F / three)
    │   └── shaders/     .glsl files, imported as strings by vite-plugin-glsl
    ├── sections/        the scroll journey, one file per section
    ├── hooks/           shared behaviour — useScroll, useMouse, …
    └── styles/          tokens.css + global.css
```

**The layer model.** Three stacked layers, and this never changes:

| Layer     | z-index | What                                                  |
| --------- | ------- | ----------------------------------------------------- |
| Backdrops | -1      | `Backdrop` (hero) then `ContentAtmosphere` (below it)  |
| Canvas    | 0       | One fixed, transparent `<Canvas>` that never unmounts  |
| DOM       | 1       | Everything scrollable                                  |
| Cursor    | 200     | `Cursor`, standing in for the native pointer           |

There is one WebGL context for the whole page. Sections scroll _over_ the
canvas; they never own canvases of their own.

The two backdrops share a z-index and are ordered so the content one paints
over the hero one; the SHIFT (below) fades between them. Both sit under the
canvas, which is what lets the composed room rise up *underneath* the 3D
instead of sliding across it.

---

## Site structure

Single scroll page. Navbar: **Home · Roadmap · Resources · Academics · Team**.

| #   | Section   | Role in the journey                          |
| --- | --------- | -------------------------------------------- |
| 1   | Home      | Wordmark, tagline, centerpiece at full presence |
| 2   | Roadmap   | Where the club is going                      |
| 3   | Resources | What the club gives you                      |
| 4   | Academics | Semester-wise course material                |
| 5   | Team      | Who runs it                                  |
| 6   | Join      | CTA + footer                                 |

---

## The two hero pieces

**Centerpiece — the energy mass.** `EnergyMass.jsx`: ~120k particles seeded
through an ellipsoid volume and advected by a curl-noise field in the vertex
shader, so the mass churns like a living cloud of light. Additive blending
stacks the dense core into a white-hot centre that ramps out to blue then
violet.

> **Two earlier centerpieces are retained, unmounted, for instant revert.**
> Both tree-shake out of the bundle while unreferenced, so they cost nothing
> shipped:
>
> 1. **Model hero** — `HeroModel.jsx` + `HeroLighting.jsx`. A neon-visor mesh
>    lit dramatically, with an emissive-mapped visor glow and drag-to-orbit.
>    Reverting needs the lighting rig **and** the `<Environment>` block back:
>    it uses MeshStandardMaterial, unlike the unlit particle mass.
> 2. **Shader blob** — `Blob.jsx`, `BlobTuner.jsx`, `shaders/blob.*.glsl`,
>    `EnvironmentProbe.jsx`. A noise-displaced icosahedron with a custom
>    iridescent glass shader.
>
> `Scene.jsx` carries the revert instructions in its header comment.

**Atmosphere.** The mass sits in a built environment, not on bare black:
`GlowHalo.jsx` (a large additive quad behind it, reading as the light source it
is silhouetted against, breathing off the shared `choreo.heroPulse`),
`Debris.jsx` (~420 slow-drifting specks in front of and around it, for parallax
and scale), a shader depth-fade in both the mass and the debris, and
`components/Backdrop.jsx` — a pure-CSS vignette painted *behind* the canvas at
`--z-backdrop`.

**Background — GPU particle warp.** Blue/violet streaks behind the hero,
reacting to scroll velocity (streaks stretch) and cursor (flow bends). Behind
the hero content, and — since the SHIFT — nowhere else.

**The SHIFT — two worlds.** The page is two rooms joined by one scrubbed
boundary, written down once in `src/lib/shift.js`. Above: the cinematic room,
the whole 3D stack. Below: the content room, static, `--content-bg` with one
soft top light and a faint dot matrix (DESIGN.md §7). Across the hero's exit
the canvas dims and pulls back while the content room comes up underneath it.

Once the hero is off screen the canvas switches to `frameloop="never"` — not a
single frame is rendered for the whole content world. It is **not** unmounted:
that would throw away the WebGL context and the ~160k-particle buffers, and
make every scroll back up to the hero pay to re-upload them. Culling the loop
buys the same idle GPU without the hitch.

---

## Non-negotiables

1. **60fps** on a mid-range laptop at 1440p with everything on screen.
2. **Modular components.** One concern per file, each with a comment header.
   No 500-line `Scene.jsx`.
3. **Read `PROJECT.md` + `DESIGN.md` before each phase.**
4. **Stop at the end of each phase** so the work can be tested before moving on.
5. **No hardcoded hex values** outside `src/styles/tokens.css`.

### The 60fps contract

Written down because it shapes the architecture, starting in Phase 1:

- **Scroll and pointer state must not live in React state.** They change every
  frame; routing them through `useState` re-renders the tree 60 times a second
  and no amount of memoisation saves it once a shader-heavy canvas is mounted.
  They belong in mutable module-level objects that `useFrame` reads directly.
- DPR stays clamped (`[1, 2]` today, device-tiered later). Never render at raw
  `devicePixelRatio`.
- Animate `transform` and `opacity` only.
- Damping is frame-rate independent — see DESIGN.md §5.

---

## Phases

- [x] **Phase 0 — Foundation** _(complete)_
      Scaffold, dependencies, folder structure, fonts, design tokens, global
      reset, docs, and the two-layer base layout: a fixed transparent canvas
      with the perf HUD, and a DOM layer holding `IOTA // BOOT`.
- [x] **Phase 1 — Particle warp background** _(complete)_
      100k-particle GPU warp in one draw call, cursor repulsion, hold-to-boost,
      a temporary wheel-driven scroll hook, and a dev-only Leva tuner.
- [x] **Phase 2 — Scroll system & shell** _(complete)_
      Lenis bridged to GSAP/ScrollTrigger, Lenis velocity driving the warp,
      magnetic navbar with scroll-spy, four section stubs.
- [x] **Phase 3 — The centerpiece** _(complete; three iterations)_
      (This entry used to claim a custom cursor. There was none in the tree -
      it landed in Phase 7, not here.)
      First pass: noise-displaced icosahedron with a custom iridescent shader.
      Then the neon figure model (`HeroModel.jsx`) with a dramatic light rig,
      emissive-mapped visor glow and drag-to-orbit. Now the curl-noise energy
      mass (`EnergyMass.jsx`), which is what is mounted. Also: preloader intro,
      masked hero reveal, and one scrubbed ScrollTrigger timeline for the
      Home -> Roadmap move.
- [~] **Phase 4 - Scroll storytelling** _(in progress)_
      Shared section system (`components/Section.jsx` + `hooks/useReveal.js`)
      and the Roadmap: nine selectable domain tracks with a scroll-drawn
      timeline. Then Academics, which reuses the same chip tablist
      (`TrackSelector`) for four semester tabs over a grid of course cards.
      Resources and Team still stubs.
      The hero centerpiece is now hero-only - EnergyMass fades out over the
      tail of the push-in and the warp dims below the hero, so section copy
      reads on near-black.
- [x] **Phase 5 — Polish & performance** _(complete)_
      Lazy-loaded canvas, device quality tiers, tier-gated post-processing,
      thorough reduced-motion path, chunking fix, README + Vercel config.
- [x] **Phase 6 — Two worlds & the SHIFT** _(complete)_
      The page split into a cinematic hero and a composed content room, joined
      by one scrubbed boundary (`lib/shift.js`). New `ContentAtmosphere` and
      `ShiftMarker`; content-world tokens; full-bleed section dividers; the
      canvas fades, pulls back, and then stops rendering entirely below the
      hero.
- [x] **Phase 7 — The content world comes alive** _(complete)_
      One shared `components/Card.jsx` - tilt, pointer sheen, lift - behind
      every card in the content world, plus `hooks/useCardMotion.js`. A sliding
      indicator in `TrackSelector`; a leading draw-head, spring nodes and a
      ring pulse on the roadmap spine; `hooks/useSectionMotion.js` for the
      connector draw and heading parallax; a pointer glow and a drifting grid
      on the content backdrop; and `components/Cursor.jsx`, which is where the
      custom cursor actually arrived. DESIGN.md §8 is the contract.
- [x] **Phase 8 — Real roadmap content and the blaze** _(complete)_
      All nine tracks filled in with real Beginner/Intermediate/Advanced
      stages. The timeline now heats up as it descends: a spine whose gradient
      ramps cool blue to white-hot, level-graded node and card halos, colour-
      coded level tags, and blue fire at the Advanced end. Domain chips
      brightened to read as live controls. DESIGN.md §2, "The blaze ramp".
- [x] **Phase 9 — Vivid content world** _(complete)_
      Section titles to 56-120px, gradient-filled with a letterform-shaped
      glow. Text contrast lifted across the content world. Top dividers and
      the mono connector draw in on scroll and now glow. Resources and Team
      finally have content: `data/resources.js`, `data/team.js` and the shared
      `components/CardGrid.jsx`, so every content section runs on <Card> and
      gets the tilt, sheen and hover treatment.

Phases 1–9 are the proposed shape based on the brief — adjust freely at each
kickoff. Phase 0 is the only one that is settled.

---

## Open questions

- **`public/models/iota-neon.glb`** (4.6 MB, Meshy AI export) is in the repo but
  **not wired into the scene** — the brief says the centerpiece is an abstract
  shader blob, not a mesh. Decide whether it becomes a secondary object (a logo
  token, a Team-section prop) or gets deleted. At 4.6 MB it needs Draco or
  meshopt compression before it ships either way.
- ~~`vite-plugin-glsl` is installed ahead of the shader work.~~ **Resolved** —
  in active use as of Phase 1 (`src/canvas/shaders/*.glsl`).
- Real copy: the hero tagline and all nine roadmap tracks are written.
  **Still outstanding**, all currently marked PLACEHOLDER in their data files:
  - `data/resources.js` — the six categories are the real decision; the copy
    and every url are stand-ins.
  - `data/team.js` — deliberately roles rather than people. Inventing
    plausible names and handles for a real club would put fake people on a
    real page, and they would be easy to leave there by accident. Add a
    `name` per entry once the committee is confirmed.
  - `data/academics.js` — every resource url is still `#`.
