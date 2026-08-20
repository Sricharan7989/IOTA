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

### Two build notes worth knowing

- Vite 8 runs on **rolldown**. Rollup's `output.manualChunks` is accepted but
  **silently ignored**; the working API is `output.codeSplitting.groups`. That's
  what `vite.config.js` uses to split `three` into its own cacheable chunk.
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

**The layer model.** Exactly two stacked layers, and this never changes:

| Layer      | z-index | What                                                 |
| ---------- | ------- | ---------------------------------------------------- |
| Canvas     | 0       | One fixed, transparent `<Canvas>` that never unmounts |
| DOM        | 1       | Everything scrollable                                 |

There is one WebGL context for the whole page. Sections scroll _over_ the
canvas; they never own canvases of their own. That is what makes a single
continuous camera journey across the whole page possible in later phases.

---

## Site structure

Single scroll page. Navbar: **Home · Roadmap · Resources · Team**.

| #   | Section   | Role in the journey                          |
| --- | --------- | -------------------------------------------- |
| 1   | Home      | Wordmark, tagline, centerpiece at full presence |
| 2   | Roadmap   | Where the club is going                      |
| 3   | Resources | What the club gives you                      |
| 4   | Team      | Who runs it                                  |
| 5   | Join      | CTA + footer                                 |

---

## The two hero pieces

**Centerpiece — abstract shader blob.** Glass/chrome with iridescent blue-violet
refraction. **Not a character model.** It is the emotional anchor of the page and
it deforms and travels across the entire scroll.

**Background — GPU particle warp.** Blue/violet streaks behind everything,
reacting to scroll velocity (streaks stretch) and cursor (flow bends). Behind
all content, always.

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
- [ ] **Phase 2 — Scroll system & shell**
      Lenis + GSAP ScrollTrigger, navbar with scroll-spy, custom cursor,
      section stubs. **Also: replace `useScrollBoost` with Lenis velocity** —
      see the note in that file.
- [ ] **Phase 3 — The shader blob**
      Custom glass/iridescent centerpiece and its scroll choreography.
- [ ] **Phase 4 — Scroll storytelling**
      Real section content, text reveals, pinning, section transitions.
- [ ] **Phase 5 — Polish & performance**
      Post-processing stack, preloader, reduced-motion and mobile fallbacks,
      final perf pass.

Phases 1–5 are the proposed shape based on the brief — adjust freely at each
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
- All real copy — tagline, roadmap milestones, resource links, team members — is
  still to be written.
