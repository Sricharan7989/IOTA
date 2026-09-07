# IOTA — Design System

> Read this and `PROJECT.md` before starting any phase.
> `src/styles/tokens.css` is the machine-readable half of this document. If the
> two disagree, fix one of them immediately — don't work around the gap.

---

## 1. Feel

Deep space, not "dark mode". Almost the entire screen is near-black, and light
is **spent deliberately**: on the centerpiece, on one accent line, on the
particle streaks. The page should read as a lit object floating in a void.

Reference mood: Lusion, Active Theory, Basement Studio. Restrained typography,
extreme motion quality, one impossible object carrying the whole page.

It is a **club**, not a product. Copy and CTAs describe something people
**join**, never something people **buy**.

**Rules of thumb**

- If a surface can be black, make it black.
- Colour is an event, not a background.
- Never more than one glowing thing competing for attention at a time.
- Borders are hairlines. Never a solid grey box.

---

## 2. Colour

### Base

| Token           | Value     | Use                                    |
| --------------- | --------- | -------------------------------------- |
| `--c-black`     | `#05060C` | Page base. The default for everything. |
| `--c-surface`   | `#0A0C16` | Raised panels, nav pill, cards.        |
| `--c-surface-2` | `#11141F` | Nested or pressed surface.             |

### Accent

| Token             | Value     | Use                                      |
| ----------------- | --------- | ---------------------------------------- |
| `--c-blue`        | `#5D86FF` | Primary accent. Links, focus, active.    |
| `--c-violet`      | `#9D7BFF` | Secondary accent. Gradient partner.      |
| `--c-blue-deep`   | `#3A5FD9` | Receding blue — shadow side in 3D.       |
| `--c-violet-deep` | `#7A57E0` | Receding violet — shadow side in 3D.     |
| `--c-glow`        | `#C7D4FF` | Specular highlight. The brightest pixel. |

### Text

| Token            | Value     | Use                                   |
| ---------------- | --------- | ------------------------------------- |
| `--c-text`       | `#EDF0FF` | Headings and body. Never pure white.  |
| `--c-text-mute`  | `#B6BFDA` | Secondary copy, inactive nav.         |
| `--c-text-faint` | `#7B83A6` | Labels, counters. **Decorative only** — do not let it carry meaning alone. |

### Lines & glows

| Token                 | Value                            | Use                   |
| --------------------- | -------------------------------- | --------------------- |
| `--c-hairline`        | `rgba(157, 123, 255, 0.16)`      | **Every border.**     |
| `--c-hairline-strong` | `rgba(157, 123, 255, 0.32)`      | Hover / focus border. |
| `--glow-blue`         | `0 0 24px rgba(93, 134, 255, .35)`  | Blue bloom on DOM.   |
| `--glow-violet`       | `0 0 24px rgba(157, 123, 255, .35)` | Violet bloom on DOM. |

Borders are violet-tinted, not grey. That single choice is most of why the
chrome reads as designed rather than defaulted.

### Signature gradient

`--g-iota` = `linear-gradient(120deg, #5D86FF 0%, #9D7BFF 100%)`

For: the active nav indicator, the scroll progress line, one highlighted phrase
per section, and the ramp the centerpiece's iridescence samples. **Never** as a
large background fill.

### `background-clip: text` — the rule

**Never combine a `background-clip: text` fill with a `filter` on any
ancestor.** A filtered element gets its own render surface, and a text-clipped
background inside one is not captured: the text paints as nothing while still
taking its full height in layout. It looks like a missing element, not like a
styling bug, which is why it survived two rounds of review here.

Section titles used to do exactly this and rendered as a blank gap. They are
now solid `--c-text` with a layered `text-shadow` glow, which reads as the same
blue-violet accent and has no such failure mode. If you want gradient text
anywhere, keep every ancestor filter-free and `will-change`-free, and prove it
renders before shipping it.

### The blaze ramp

The roadmap's signature effect, and the only place in the system where colour
carries *meaning* rather than emphasis. A track heats up as it descends, so a
reader knows how hard a stage is before reading a word of it.

| Tier         | Token             | Reads as                        |
| ------------ | ----------------- | ------------------------------- |
| Beginner     | `--c-blaze-cool`  | Dim, receding, cold.            |
| Intermediate | `--c-blaze-mid`   | Lit. The accent blue.           |
| Advanced     | `--c-blaze-hot`   | Cyan, on the edge of white.     |
| —            | `--c-blaze-white` | The hottest pixel on the page.  |

- **Never retune one tier alone.** Each only means anything next to the other
  two; changing one flattens the ramp, which is the entire effect.
- The ramp is weighted late (`--g-blaze` holds cool through 46%) so arriving at
  Advanced genuinely reads as arriving somewhere.
- Four things express it — spine, node, card halo, level tag — all keyed off
  **one** `data-level` attribute, so they cannot drift apart.
- Fire is built from **two halo layers on periods that do not divide into each
  other**. Two soft glows that never line up read as flame; one reads as a
  throb. Both animate `opacity` and `transform` only — an animated
  `box-shadow` or `filter` would be a repaint every frame, and §5 does not
  allow it.
- This is the exception §1 permits to "never more than one glowing thing at a
  time": there is still only one *blazing* thing: the rest of the ramp is
  deliberately quieter than it.
- `prefers-reduced-motion` keeps the entire ramp — gradients, halos, tag
  colours, node glows — and drops only the flicker. Heat is colour, not
  movement.

### 3D colour notes

The centerpiece is a **lit object, not a coloured one**. The mesh carries a baked
base-colour texture; everything that makes it read blue-violet comes from the
light rig — a strong `--c-blue` rim from behind, a softer `--c-violet` fill from
the opposite side, and near-zero ambient so a large part of it stays genuinely
dark. Contrast is the whole effect: an evenly-lit model looks like an asset
preview.

The visor self-illuminates by reusing the base-colour texture as an emissive map
with a white emissive colour, so only the bright neon texels glow and the dark
body stays dark.

Particles sample the `--g-iota` ramp, biased blue at depth and violet near
camera.

---

## 3. Typography

| Role    | Family        | Weights | Use                                     |
| ------- | ------------- | ------- | --------------------------------------- |
| Display | Chakra Petch  | 600 700 | Wordmark, headings, section titles.     |
| Body    | Space Grotesk | 400 500 | Paragraphs, nav, buttons, UI.           |
| Label   | Space Mono    | 400     | Eyebrows, indices, metadata. Uppercase. |

### Scale (fluid, `clamp()`)

| Token       | Range             | Use                     |
| ----------- | ----------------- | ----------------------- |
| `--t-hero`  | 4rem → 11rem      | Hero display heading + preloader wordmark. |
| `--t-h1`    | 2.5rem → 5rem     | Sub-headings that are not section titles. |
| `--t-section` | 3.5rem → 7.5rem | Content section titles. |
| `--t-h2`    | 1.75rem → 2.75rem | Sub-headings.           |
| `--t-body`  | 1rem → 1.125rem   | Paragraphs.             |
| `--t-label` | 0.75rem           | Mono eyebrows.          |

### Rules

- Chakra Petch is a wide face — always pull it in with `--tr-display` (`-0.02em`);
  the giant hero heading goes further, to `-0.03em`.
- The hero heading is **uppercase**, with one accent word in **italic** filled by
  `--g-iota`. A gradient fill cannot carry a `text-shadow`, so the legibility
  scrim behind it does that job instead.
- Mono labels always get `--tr-label` (`0.22em`) **and** uppercase. No exceptions.
- Body copy caps at **62ch**. Never full-bleed paragraphs.
- Line height: 0.92 hero, 0.95 section titles, 1.05 headings, 1.6 body.
- Three families is the ceiling. Do not introduce a fourth.

---

## 4. Space & layout

8px base grid — `--s-1` (4px) through `--s-32` (128px).

- Page gutter: `--gutter`, `clamp(1.25rem, 5vw, 5rem)`.
- Max content width: `--max-w`, `1440px`.
- Sections are `min-height: 100svh` — `svh`, never `vh`, because of mobile URL
  bars.
- Minimum `--s-24` of vertical rhythm between sections. Empty space is what
  makes the 3D read as premium; crowding it is the fastest way to look cheap.

---

## 5. Motion

Motion is the product. Everything moves; nothing is fast.

### Durations

| Token      | Value | Use                            |
| ---------- | ----- | ------------------------------ |
| `--d-fast` | 0.25s | Hovers, micro-feedback.        |
| `--d-base` | 0.6s  | Most transitions.              |
| `--d-slow` | 1.2s  | Entrances, reveals.            |
| `--d-epic` | 2.4s  | Hero intro, scene transitions. |

### Easing

| Token        | Curve                            | GSAP equivalent |
| ------------ | -------------------------------- | --------------- |
| `--e-out`    | `cubic-bezier(0.16, 1, 0.3, 1)`  | `expo.out`      |
| `--e-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | `power3.inOut`  |
| `--e-soft`   | `cubic-bezier(0.33, 1, 0.68, 1)` | `power2.out`    |

### Principles

- **Nothing snaps.** No `linear`, no browser-default `ease`.
- **Stagger groups** — 0.06s to 0.1s apart.
- **Text reveals** are per-line masked slide-ups, never per-letter fades.
- **Lenis owns all vertical smoothing.** Do not stack extra scroll easing on it.
- **Scroll-linked 3D is damped, not driven.** Read a target from scroll state
  and ease toward it every frame. Binding a transform 1:1 to scroll position is
  exactly what makes a site feel twitchy and cheap.
- Damping must be frame-rate independent: `1 - exp(-λ · dt)`, not
  `a += (b - a) * 0.1`. The latter moves at different speeds on 60Hz and 144Hz
  displays.
- Animate `transform` and `opacity` only. Nothing that triggers layout.
- `prefers-reduced-motion` → Lenis off, particles frozen, reveals become fades.

---

## 6. Depth & 3D language

- Camera: `fov={35}`, always. A long lens keeps the centerpiece reading as a
  large object rather than a small toy.
- The centerpiece owns the centre of frame. Section content sits **beside** it,
  alternating left/right down the page.
- Particles are always behind the centerpiece, and always behind text.
- Bloom threshold stays high (~0.9). Only the specular highlight blooms; a bloom
  that lifts the whole frame destroys the black.
- Nothing casts a real shadow. Depth comes from scale, blur and parallax.
- The canvas is transparent — the black comes from CSS `body`, so the DOM layer
  and the WebGL layer can never disagree about the background colour.

---

## 7. Two worlds, and the SHIFT between them

The page is two rooms, and the split is the strongest art-direction decision in
it. Above the fold is the **cinematic** room: one WebGL layer, particles, bloom,
a mass of light. Below it is the **content** room: static, composed, no
particles at all. Crossing between them is a deliberate moment, not a scroll
artifact.

### The content room

| Token                | Value                            | Use                        |
| -------------------- | -------------------------------- | -------------------------- |
| `--content-bg`       | `#07080F`                        | Base below the hero.       |
| `--content-glow`     | radial, violet -> blue -> clear  | One soft top light.        |
| `--grid-op`          | `0.04`                           | Dot-matrix intensity.      |
| `--grid-size`        | `34px`                           | Dot pitch.                 |
| `--grid-dot`         | `rgba(157, 123, 255, .85)`       | Dot colour, before op.     |
| `--content-divider`  | `rgba(157, 123, 255, .14)`       | Full-bleed section rules.  |

- `--content-bg` is **deeper than `--c-black`**, not lighter. The composed room
  is the darker of the two, which is why arriving in it feels like the noise
  stopping.
- The glow is anchored just above the top of the frame and is **fixed**, so
  every content screen gets the same wash rather than one lit screen and then
  nothing. Atmosphere, not a spotlight - if you can point at it, turn it down.
- The dot matrix is the only texture in the system. It is **behind all text**,
  never over it, so it cannot touch contrast. `--grid-op` is the single dial;
  above `0.05` it starts reading as noise.
- Cards do not change across the boundary: `--c-card` with `--c-hairline`, and
  the blue-violet glow on hover. Same components, different room.

### The SHIFT

One boundary, written once in `lib/shift.js` and read by all three parties -
the canvas layer, the content backdrop, and the marker on the threshold.

- Driven by scroll, scrubbed, and therefore **reversible by construction**:
  scrolling up un-plays it exactly as it played.
- The two ranges intentionally differ. The composed room starts arriving at
  35% of the hero's exit; the cinematic room only starts leaving at 45%. The
  overlap in the middle is the dissolve. Matching ranges would read as a
  crossfade between two flat images.
- The 3D **recedes** rather than switching off: it dims and pulls back to
  `0.94` at the same time, because a room you are leaving gets smaller.
- Below the hero the canvas stops rendering entirely. The 3D is the hero's and
  nothing else's - which is an art-direction rule first and a performance win
  second.
- `prefers-reduced-motion` gets no dissolve at all. The rooms swap at one
  point, `bottom center`, and the composed room is simply present from there
  on. Same two states, one step instead of a scrub.

---

## 8. Interaction

Motion on entry is choreography; motion under a pointer is **feedback**. The
content world has four sections and they must all react with the same hand, or
the page reads as four sites wearing one palette. Everything below resolves to
a token, and every token is shared.

### The card is the unit

`components/Card.jsx` is the one surface: roadmap stage, course, resource, team
member. It owns the raised ground, the violet hairline, and all three pointer
responses, so no section can invent its own.

| Response | Token          | Note                                          |
| -------- | -------------- | --------------------------------------------- |
| Tilt     | `--tilt-max`   | 7deg at the corner. Past ~8 it becomes a toy.  |
| Lift     | `--lift`       | Paired with `--shadow-lift`; never alone.      |
| Sheen    | `--sheen-size` | Follows the pointer across the surface.        |

- **Damped, never driven.** The card eases toward the pointer. Binding tilt 1:1
  to cursor position is the single fastest way to make an expensive effect feel
  cheap (§5).
- The sheen and the backdrop's pointer glow are **fixed-size circles that get
  translated**, never gradients that get repositioned. One is a composite, the
  other is a repaint every frame.
- `:focus-within` lights a card exactly as hover does. There is no tilt on the
  keyboard path — there is no pointer to tilt toward — but there is everything
  else.

### The room

Fainter than a card by an order of magnitude: `--c-pointer-glow` follows the
cursor, and the dot matrix drifts and parallaxes. **The test for both is that
you should not be able to point at them — only notice if they stop.**

### Selection

One indicator slides and morphs between chips; chips do not switch their own
fill on and off. Watching the thing you picked travel to where you picked it is
what ties a selector to the content swapping underneath it.

### The floor

- `prefers-reduced-motion` removes tilt, parallax, drift, the pointer glow and
  the custom cursor. **Static hover states stay.** Reduced motion means less
  movement, not less feedback.
- Coarse pointers get the same treatment, for a different reason: there is no
  hover, so a sheen would sit frozen wherever the last tap landed.
- The custom cursor hides the native one **only while it is actually mounted**.
  When it bails out, the real cursor is still there.
- Entrances stay `transform` + `opacity` (§5). Blur-to-sharp is a repaint of
  every card on every frame of the reveal, which is not affordable at these
  card counts.

---

## 9. Component conventions

```
src/components/   DOM UI — navbar, cursor, layout chrome
src/canvas/       everything inside <Canvas> (R3F / three)
  └ shaders/      .glsl files, imported as strings
src/sections/     the scroll journey, one file per section
src/data/         static content the sections render - roadmaps, team, links
src/hooks/        shared behaviour — useMagnetic, usePointer, …
src/lib/          framework glue and singletons that outlive React —
                  currently the Lenis/GSAP scroll core
src/styles/       tokens.css + global.css only
```

`hooks/` vs `lib/`: if it calls a React hook it goes in `hooks/`; if it's a
module-level singleton or plain function that React merely starts and stops, it
goes in `lib/`.

- One component per file, with a short comment header saying what it is.
- Co-locate styles as `Component.module.css` beside the component.
- No component reaches into another's CSS module. Share through tokens only.
- No hardcoded hex values outside `tokens.css`.

---

## 10. Accessibility floor

Art direction is not an excuse to skip these.

- Nav links are real focusable anchors with a visible `:focus-visible` ring.
- Body text holds ≥ 4.5:1 against `--c-black` AND against `--content-bg` at
  its brightest — top of frame, top-glow plus pointer glow plus grid. Measure
  against that composite, not against the flat base.
- `--c-text-faint` is decorative only and must never carry meaning on its own.
- The canvas layer is `aria-hidden` and `pointer-events: none`.
- `prefers-reduced-motion` is honoured, not ignored.
