# Animations — 3264.ai Home

Four independent systems. Each is a class in `motion/`, framework-agnostic, with the same
shape:

```js
const system = new System(elementMap, options);
await system.start();   // may reject — that is a supported outcome
system.destroy();       // idempotent; cancels rAF, drops listeners, disposes GPU resources
```

`elementMap` keys are the `ref="{{ name }}"` names in the reference HTML. Every module
tolerates missing keys by bailing out rather than throwing, so a partial port degrades to a
static page instead of a blank one. Preserve that property.

In React, use `useMotionSystem` from `motion/react.js`; do not instantiate these in render.

---

## 1. Intro relief — `intro-relief.js`

**What the viewer sees.** On load, a full-viewport overlay in page colour. A 32-column grid
ghosts in. The wordmark `3264` rises; a relief of the wordmark builds in WebGL behind it; a
caption beneath counts `2 · 4 · 8 · 16 · 32 · 32 × 64`; `.ai` appears; the whole overlay
dissolves onto the page. About four seconds.

**Clock.** One normalised scalar `s`, in seconds since start divided by `introPace`. The rAF
loop calls `iStep(s)` and disposes once `s > 4.0`. `iStep` is a pure function of `s` — nothing
accumulates between frames. That is what makes pacing a single multiplier and the skip a
single jump.

**Timings** (all multiplied by `P = introPace`, default 1):

| Element | Value |
| --- | --- |
| Canvas fade in | `s` 1.10 → 1.75 |
| Relief rise | `s` 1.40 → 2.95, per-cell `lag` offset, eased `1 − 2^(−9x)` |
| Wordmark reveal | 620ms, per-glyph stagger |
| Caption steps | first at 560ms, then every 235ms, six values |
| Caption fade | 500ms at 2400ms delay |
| Overlay dissolve | driven from `iTeardown` |
| Hard stop | `s > 4.0` → `iDispose()` |

**Geometry.** The wordmark is rasterised once to an offscreen 1024×512 canvas
(`iTextCanvas`). That bitmap is sampled into a cell grid; each cell becomes an instance whose
depth is driven by its sampled luminance and its `lag`. Plane width is
`min(980, innerWidth × 0.78)`, height half of that (`iMeasure`). Resize re-measures.

**DOM contract.** `iWrap` (fixed, `inset: 0`, `z-index: 300`, `display: none` initially, click
handler), `iGrid` (absolute, `opacity: 0`), `iCv` (canvas, absolute, full size, `opacity: 0`),
`iMark` (relative, `opacity: 0`) containing `iLock` (the `3264` text) which contains `iSfx`
(the `.ai` span, `opacity: 0`), and `iCap` (bottom caption, initial text `1`).

**Reduced motion.** `maybeIntro()` checks the media query and skips the whole thing. The page
renders normally with no overlay.

**Safety behaviour you must keep.** `iTeardown(wrap, ms)` sets `pointer-events: none` the
moment the intro is logically over, and hides on whichever of the animation's `onfinish` or a
timeout fires first. A missed `onfinish` therefore cannot leave an invisible overlay swallowing
clicks on the page. This was a real bug once. Do not "clean it up" into a single callback.

**Port notes.** Skippable by click on `iWrap` and by any keypress. Self-disposing — you do not
need to unmount it. If you cut any system for scope, cut this one: it is the most visible and
the least load-bearing.

---

## 2. Platform sequence — `platform-sequence.js`

The set piece, ~790 lines, and the one place a careless port will show. Budget accordingly.

**What the viewer sees.** The capabilities section pins for `420vh`. As you scroll, three acts
play in the right-hand stage — Assess, Build, Run — each with a WebGL diagram and a dense data
panel, while the left column's text swaps and a three-tab rail tracks progress. Hovering the
stage raycasts and shows a tooltip. Clicking a rail tab tweens the page to that act.

**Clock: scroll, and only scroll.** `phStep(ms)` runs every frame and derives `p ∈ [0,1]` from
the track's position:

```js
const p = clamp((-rect.top - M.off) / M.span);   // M.span = track height − viewport height
```

There is no timeline and no autoplay, so the sequence scrubs in both directions for free and
nothing plays off screen. `ms` is used only for idle motion; under reduced motion `time` is
frozen at `6` so the idle drift stops but scrolling still works. Off-screen frames bail early
(`rect.bottom < -200 || rect.top > vh + 200`).

**Act mapping.** All ramps are smoothstep `t²(3 − 2t)` over a `[a,b]` window of `p`:

| Quantity | Expression |
| --- | --- |
| `wRun` | `smooth(0.62, 0.76, p)` |
| act weights `w` | `[1 − smooth(0.26, 0.40, p), smooth(0.28, 0.42, p) × (1 − wRun), wRun]` |
| diagram reveal `a` | `[smooth(0, 0.20, p), smooth(0.30, 0.52, p), smooth(0.64, 0.86, p)]` |
| Assess panel opacity | `1 − smooth(0.288, 0.334, p)` |
| Build panel opacity | `smooth(0.306, 0.371, p) × (1 − smooth(0.612, 0.658, p))` |
| Run panel opacity | `smooth(0.630, 0.690, p)` |
| Assess panel progress | `(p − 0.012) / 0.24` |
| Build panel progress | `(p − 0.306) / 0.26` |
| Run panel progress | `(p − 0.630) / 0.31` |

Groups are culled at `w[i] > 0.012`.

Note the panel opacity windows **overlap deliberately**: the incoming ramp starts where the
outgoing one has already fallen to about 0.15. The stage is never blank, and two dense panels
are never both legible at once. Sequencing them with a gap instead leaves a visible hole
between acts — the most common way to get this wrong.

**The stage.** `phCv` is a WebGL canvas with three `THREE.Group`s, one per act. `phLabels` is a
DOM layer above it: labels registered via `phLabel(...)` are real text nodes positioned each
frame from projected 3D coordinates. Type stays selectable, crisp and themeable; it is never
rendered into the canvas. Keep that split.

`phBuildScene(g)` and `phScene(g, ctx)` are intentionally empty hooks — geometry plugs in
there, and `ctx = { p, w:[3], a:[3], time, hover }`. The shipped diagrams are the three DOM
panels, not meshes; the WebGL layer currently carries the labels and hover targets. If you
later add meshes, add them in those two hooks and nowhere else.

**Hover.** `phPointer` writes NDC coordinates, `phHover()` raycasts against objects carrying
`userData.kind` in visible groups, and drives `phTip` (a dark tooltip, `transform:
translate(-50%,-124%)`, 160ms opacity transition). `phLeave` clears it.

**The three data panels — read this before rebuilding them as JSX.**
`phBuildAssess` / `phBuildCaps` / `phBuildRun` construct their own DOM. Then `phFit*` measures
and rescales to the stage, and `phStep*` interpolates against act progress. They are
imperative *because they are measured*: `phOverflows(flexChild)` compares `scrollHeight`
against `clientHeight` and the fit pass reacts to the result.

If you rebuild these three in JSX, React owns the nodes, the fit pass fights reconciliation,
and the panels paint over the section below. Mount three empty positioned `div`s
(`phAssess`, `phBuildP`, `phRun`) and let the module fill them.

One subtlety the comments in the source also flag: a flex column's own `clientHeight` never
exceeds itself, so overflow must be measured on **the child that actually overflows**, not the
container. Measuring the wrong node silently misfits the panel.

**Data is data.** Three tables drive everything shown:

* `phAudit()` — audit rows: function, cadence, name, hours, risk band, expected return
* `phCaps()` — capabilities: id, name, tag, price, wave
* `phNights()` — 30 nights of run telemetry, with `phRunNotes()` keyed to specific nights

Every figure in the panel prose is interpolated from these — release plan, fortnight count and
totals are derived from whatever is scoped at that moment, never hard-typed. Keep them as data
structures when you port; do not inline the rendered strings. If real client data replaces
these, only these functions change.

`phNightAt(u)` is deliberately **non-linear**: nights 0–21 map across the first 40% of the act,
then the two breach nights (22, 23) hold for roughly a third of it. Those two nights are the
argument of the act; an even map would give them 2/30ths and the point would be lost. Preserve
the curve.

**Rail and caption.** `phR0`–`phR2` are the clickable act tabs (`data-act="0|1|2"`,
`phJump` handler) — active tab gets a `2px solid accent` top border and ink text, inactive
`var(--line)` and muted. `phJump` tweens `scrollTop` with a cubic ease-out (`1 − (1−t)³`) via
its own rAF, cancellable. `phCap` and `phMetric` are the stage's caption and `01 / 03` counter.

**Layout.** `phLayout()` runs before start and on resize; it sets the grid, measures the track
(`this._phP = { off, span }`), and narrows the left panels below a threshold — hiding their
`ul`s and dropping prose from 16.5px to 15.5px.

**DOM contract.** `phTrack` (`420vh`, relative) → `phPin` (sticky, `100vh`) → `phGrid`
(two-column). Left: `phR0`–`phR2` in a 3-column grid, then `phP0`–`phP2` absolutely stacked in
a `min-height: 390px` relative box (P0 visible, P1/P2 `opacity: 0`). Right: `phStage` (relative,
white, bordered) containing `phCv`, `phLabels`, `phSlot` (+ `phBar`, the fallback progress
indicator, `display: none` once real panels exist), `phAssess`, `phBuildP`, `phRun` (each
absolute, `top: 0; bottom: 40px`, `opacity: 0`, `display: flex; flex-direction: column`),
`phTip`, and a bottom bar with `phCap` and `phMetric`.

**Mobile.** 768–940px: the module's own narrow layout (single column, stage first, 380vh).
Below 768px: do not mount; render the static stacked acts in `specs/04-capabilities.md`.

**Handlers.** Wire `phJump` with `bind.handler("phJump")` from `motion/react.js`.

---

## 3. Vignettes — `vignettes.js`

**What the viewer sees.** Each of the three hero cards holds a 150px-tall SVG micro-diagram
that loops: `scope` (a boundary being drawn and held), `clock` (a six-week cadence), `evals`
(a regression suite catching drift).

**Clock.** Per-vignette timers at **6200 / 6600 / 7000ms**. The periods are intentionally
coprime so the three never fall into sync — three cards beating together reads as a single
mechanism instead of three independent ideas.

**Gating.** An `IntersectionObserver` starts each vignette only once its card is on screen.
Each cycle rebuilds from scratch via `frame(box, h)`, which reads the box's live
`clientWidth` — so they are responsive by reconstruction, not by `viewBox` scaling.

**Reduced motion.** Built once in the resting state, never cycled.

**DOM contract.** `vigA`, `vigB`, `vigC` — three empty `div`s, `height: 150px`. The module
fills them.

**Port notes.** This is the one system here that could legitimately become static SVG plus CSS
keyframes if you need to cut scope. If you do: keep the coprime stagger, keep the
reduced-motion path, and keep them from starting off-screen.

---

## 4. Hero art — `hero-art.js`

**What the viewer sees.** The hero painting displaces gently against scroll — the image drifts
and warps as you move down the page, under a static scrim and static type.

**Clock.** Scroll position, **dirty-flagged**. Scroll events set `_artDirty`; the rAF loop only
re-renders when it is set. An unconditional render here costs a GPU frame on every idle tick
for a decorative effect. Keep the flag.

**Scope.** Runs on the image layer only. The scrim, headline, CTAs and cards are DOM siblings
painted above the canvas, so nothing but the painting's own pixels moves. Do not put type into
this canvas.

**Texture.** `assets/hero-valley.png`, loaded through three's loader. The same file is also the
CSS `background-image` on the canvas element itself, which is what shows if WebGL never comes
up. Keep one source for both.

**Degradation.** If three fails to load or WebGL is unavailable, `initArt()` returns early and
the CSS background is the hero. The hero must never depend on this module resolving.

**DOM contract.** `artCv` — a canvas, absolutely positioned across the top of the hero,
`aspect-ratio: 1376 / 768`, with the painting as its CSS background, masked top and bottom, and
`pointer-events: none`.

---

## three.js

All three WebGL systems call `loadThree()` from `motion/three-loader.js`, which currently
dynamic-imports `three@0.161.0` from a CDN — the prototype had no bundler. In the app:

```bash
npm i three@0.161.0
```

```js
let pending;
export function loadThree() { return (pending ||= import("three")); }
```

Keep it a **lazy dynamic import**. Every caller runs inside an effect, after mount, so three
stays out of the server bundle and out of the initial client chunk. A top-level
`import * as THREE from "three"` in a page component undoes that and costs you ~600KB on first
load for three decorative systems.

Pin the version. These modules were written against 0.161 and use `Group`, `Raycaster`,
instanced meshes and the standard projection helpers; the API surface is stable but not
guaranteed across majors.

## Teardown

Every module's `destroy()` cancels its rAF handles, removes window and element listeners,
disconnects observers, clears timers, and disposes geometries, materials, textures and the
renderer. `useMotionSystem` calls it on unmount.

In Next.js development, Strict Mode double-invokes effects — each system will be constructed,
destroyed and reconstructed on mount. That is the intended path and is exactly what shakes out
leaks, so do not disable Strict Mode to hide it. If you see a doubled intro or two rAF loops in
dev, something in `destroy()` is not doing its job; fix that rather than the effect.
