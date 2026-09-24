# Animations — PrivateCreditMotion

`motion/private-credit.js` exports one class, `PrivateCreditMotion`, that drives the whole page.
This document explains what it does so you can mount it correctly and diagnose problems
**without editing it**. Where this document and the code disagree, the code wins, because it is
what the reference runs.

Notation: `seg(p, a, b)` = clamp((p − a) / (b − a), 0, 1). `ease(x)` = 1 − (1 − x)³ (ease-out
cubic). `eio(x)` = ease-in-out quad. Every window below is exactly as written in the code.

---

## 1 · Core: lifecycle, clock, isolation

```
new PrivateCreditMotion(nodes, options)   nodes: { [ELEMENT]: HTMLElement }, read lazily
  .start()        boot(): scroll/resize listeners, arm() clock, watch() watchdog, ensure()
  .setOptions(o)  accent / gridTexture / motion / frozenT, in place
  .destroy()      clears every timer, interval, rAF, listener and the watchdog
  .skipIntro()    bound; use as the overlay's onClick
```

**Refs are lazy.** Each `this.x.current` is a getter that reads `nodes[x]` at call time. An
element that mounts late (for example after a Suspense boundary resolves) is picked up on the
next sync. `ensure()` runs on every scroll and resize, and it builds any section whose hosts
have appeared but have not yet been built.

**The clock has four parts. Keep all four:**

| Part | Interval | Why |
| --- | --- | --- |
| rAF loop | per frame | `frame()`: time-driven drawing (ring, §04, §05) |
| fallback interval | 34ms | calls `frame()` only if rAF did not tick since last time (throttled or embedded contexts) |
| heartbeat | 400ms | `syncScroll()` (all scroll sequences) + stamps `_hbAt` |
| watchdog | 900ms, on `window` | if `_hbAt` is older than 1.4s, `arm()` again |

Scroll and resize events also call `syncScroll()` via `ensure()`, and they re-arm the clock if
it has gone stale.

`syncScroll()` runs `sync` (§01), `oSync` (§03), `stepServ` (§04), `stepLp` (§05), `dSync`
(§06) and `p2Sync` (§02), then `frame()`.

**Isolation.** Every build and sync runs through `step(name)` in a try/catch. A broken section
logs once (`console.error("[3264]", name, e)` + `window.__dcErrs`) and the rest of the page
carries on. **`window.__dcErrs` must be undefined in a correct port.** An entry there almost
always means a ref is missing or bound to the wrong element.

**Scroll progress** for a pinned section:

```
span = track.offsetHeight − pin.offsetHeight
p    = clamp(−track.getBoundingClientRect().top / span, 0, 1)
```

This is why the pin must be the track's first child, sticky at `top: 68px`, with a height of
`calc(100vh − 68px)`.

**Stage scaling.** §01 and §02 author their stage at 1200×780 and §03 at 1240×700 (it scales
against 1200×720; see §5). `pinFit()` caps the wrap's `max-width` to what the remaining pin
height allows. The stage is then `transform: scale(min(1, wrapWidth / 1200))` from the top left.
When the wrap is height-bound, `cropOf()` gives the stage pixels lost off the bottom, and the
§02 caption is lifted by that much so it never disappears. **Do not size stages with CSS**, and
do not set `transform`, `max-width` or `bottom` on the refs the module writes.

---

## 2 · Hero ring — `drawHeroRing(t)` on `heroCv`

A 2D canvas. It draws only while in view (200px margin) and only when `motion !== false`.
DPR is capped at 2 and the backing store is resized only when the CSS box changes.

It shows nine systems on a ring (PIPE, CRED, KYC, SERV, PORT, COVT, FUND, INVR, DATA with full
labels) and 36 dashed bridges between every pair. These fold into a single `3264` hub.

**Cycle T = 27s**, `c = t mod 27`:

| c (s) | Beat |
| --- | --- |
| 0 – 2.2 | nodes appear clockwise from 12 o'clock (`appear`, ease). Code shows at k > 0.7 and the label fades in over k 0.55–0.9. |
| 2.4 – 6.6 | mesh: 36 bridges drawn in sequence as dashed quad curves (`[3,4]`, marching at 14px/s, ink α 0.24). A dot travels along each finished bridge. |
| 6.6 – 8.2 | hold: bridges wobble ±1.6px |
| 8.2 – 11.4 | fold (ease-in-out): accent spokes grow from each node to the centre; the white hub grows to r = 29 with a 1.8px accent ring; `3264` fades in at 500 16px, −0.4px tracking, once fold > 0.55. Node strokes turn accent once fold > 0.6. |
| 11.4 – 13.2 | clean: accent pulses (r 2.6) travel node → hub on each spoke |
| 13.2 – 26.4 | holds the resolved state (the bridges stay underneath) |
| 26.4 – 27 | everything fades out, then the cycle repeats |

Layout: the radius is solved per angle from the measured label widths, so only near-horizontal
nodes reserve full label width. A slight ellipse is allowed (radY ≤ 1.16 × radX). The ring sits
hard against the top of its box, and all spare space goes below. **This is why the canvas font
must be real Instrument Sans:** the measurement uses `ctx.measureText` in that font.

---

## 3 · §01 Reality — `sync()` on `track`/`pin`

Stage 1200×780. Six beats as windows of p:

| p window | What |
| --- | --- |
| 0.04 – 0.13 | **Title A** reveals word by word: "You currently operate on disconnected systems that never speak to each other", with *disconnected* emphasised |
| 0.14 – 0.34 | **Four windows** arrive, staggered: `arrive_i = ease(clamp(pWin × 4 − i))`, so each takes a quarter of the window |
| 0.40 – 0.47 | Title A fades out |
| 0.42 – 0.52 | windows fade out together (`fade = 1 − ease(pWinOut)`) |
| 0.46 – 0.56 | **Title B** reveals: "3264 builds operational platforms that centralize everything in one system of record.", with *one system of record.* emphasised |
| 0.54 – 0.60 | **Platform window** (`plat`) rises (26px) |
| 0.60 – 0.985 | **the walk**: seven screens, `idx = floor(pWalk × 7)`: Pipeline, Underwriting, Documentation, Servicing, Covenants, Investors, Reporting |

Word reveal (both titles and §02): `k_i = ease(clamp(prog × (n + 3) − i))`, opacity k,
translateY (1 − k) × 14px (13px in §02). Emphasised words are `#141412` italic and the others
`rgba(20,20,18,0.74)`. The spans are built once, and scroll changes only their opacity and
transform.

Window entrance `win(ref, k, rise)`: opacity k, `translateY((1 − k) × rise) scale(0.982 + 0.018k)`,
with rise 22 for the four windows and 26 for the platform.

Screen change (`showScreen`) rebuilds the sidebar highlight, main table and right rail from
`this.screens[i]`, then plays a 400ms fade-in (`cubic-bezier(.16,1,.3,1)`, 6px rise) with the
Web Animations API. While `pPlat ≤ 0.2` the walk is rewound to screen 0, so it always opens on
Pipeline.

Status colouring (`tone`): pass, satisfied, complete, received and balance → accent; outstanding,
in review and watch → warn; breach → bad.

---

## 4 · §02 Platform — `p2Sync()` on `p2Track`/`p2Pin`

Stage 1200×780. The window (`p2Win`) enters over p 0.04–0.11 (26px rise). Then there are **five
equal stages** over p 0.10–0.99, each 0.178 of p:

```
walk = seg(p, 0.10, 0.99) × 5;  idx = floor(walk);  local = walk − idx
```

On an index change, `p2Show(idx)` rebuilds the title (`p2Title`), caption (`p2Cap`) and body
(`p2Body`) for that stage, and it moves the sidebar highlight. Within each stage:

| local | Common to every stage |
| --- | --- |
| 0 – 0.30 | title words reveal |
| 0.16 – 0.46 | caption words reveal |

| Stage | kind | Sub-beats (local) |
| --- | --- | --- |
| 0 Pipeline | kanban | 0.36–0.68: the Northgate deal panel opens over the board (opacity, scale 0.972→1), and the board columns dim to 0.28 |
| 1 Underwriting | score | 0.34–0.78 (eased): stress s = 0→1. Leverage bars go base → downside, peak 4.19x→4.41x, headroom = 4.75 − peak (turns ink below 0.4x). Rating B+ → B once s > 0.72. Label: base case / EBITDA −10% (s < 0.55) / EBITDA −20% · rate +200bps. Toast "Building stress scenario" → "Stress scenario applied · done" once s > 0.97. |
| 2 Credit memo | memo | six panels S, A–E, cross-fading over 0.03 each at 0.155, 0.325, 0.525, 0.695 and 0.855. The bridge (0.36–0.47) and the figure drop (0.475–0.51) are inside B. The outline rail highlights rows 0 → 3 → 5 → 8 → 11 → 12. |
| 3 Committee | ic | static body; only the title and caption reveal |
| 4 Monitoring | watch | 0.28–0.58: certificates land one by one and each position re-tests. 0.62–0.90 (eased): the dossier for the followed deal opens. |

Stage copy (line, emphasis, caption) is data in `this.p2Stages`, and the tables are in
`p2Kanban`, `p2Factors`, `p2Cases`, `p2MemoOutline`, `p2Votes`, `p2Cps` and `p2Watch`.

p2 tone: pass, satisfied, approve, drafted and improving → accent; watch, outstanding,
conditions, writing and hold → warn; breach, worsening and pending → bad.

---

## 5 · §03 Origination — `oSync()` on `oTrack`/`oPin`

Stage 1240×700, scaled by `k = min(1, wrapW / 1200, wrapH / 720)` and centred horizontally with
`translateX`. It scales on both axes because the tile field is content and must never clip.

**Six stages** over p 0.05–0.97: `prog = seg(p, 0.05, 0.97) × 6`.

| Stage | Count | Label | Vignette |
| --- | --- | --- | --- |
| Sourced | 248 | deals seen this vintage | intake card |
| Screened | 96 | through the policy gates | `oGates`: five gates, gate 03 fails at 5.40x |
| Underwritten | 61 | spread and modelled | `oSheet`: a spreadsheet with a formula bar |
| To committee | 38 | papers written | memo card |
| Approved | 24 | approved by committee | conditions card |
| Funded | 11 | positions live | closing card |

**The tile field** has 248 tiles, 16 columns, a 30px pitch and sizes 12, 16 or 21px. The colour
comes from a nine-step cream→teal palette by distance from centre, plus a rare olive. Everything
is deterministic (`h2` hash), so the field is identical on every load. The exit gate per tile is
152 at gate 1, then 35, 23, 14 and 13, and 11 survive. For tile t:

```
hit  = t.exit + 0.06 + t.wave × 0.30          (wave: left→right with a 14% diagonal)
bell = max(0, 1 − |prog − (idx + 0.06 + t.wave × 0.30)| / 0.085)   pass-through pop
d    = ease((prog − hit) / 0.24)              fail progress
fail: opacity 1 − 0.94d, blur(7d px), saturate(1 + 0.5·bell − 0.7d), scale(1 + 0.16·bell − 0.3d)
```

In the last stage (local 0.42–0.88) the 11 survivors turn **live**: staggered
`gk = ease(g × 14 − si × 0.85)`, background `shade(accent, +0.10)`, scale up to 1.24, and a
green glow once gk > 0.4. Styles are written only when their computed key changes, which keeps
248 tiles cheap. Don't "optimise" this with CSS transitions.

**Counter**: it tweens from the previous stage's n to this one's over local 0.05–0.45. The ticks
are ink (current), 0.42 (done) or 0.12 (to come).

**Vignettes**: each fades in over prog i → i + 0.14 (16px rise) and out over i + 0.92 → i + 1.0,
except the last. Rows reveal over i + 0.10 → i + 0.55 and the chip over i + 0.58 → i + 0.78.
`oEqualize()` gives every vignette the tallest one's height, and it re-measures when the wrap
width changes.

---

## 6 · §04 Servicing — `buildServ()` / `loopServ()` on `servHost`

This section is not pinned. There are three cards in a 3-column grid (26px gap). Each is a
336px `#F2EFE8` stage with 22px radius and a 19px title beneath. It runs on time, **CY = 6.2s**,
and card i is offset by 0.11 of a cycle:

```
u = (t / 6.2 + 0.11 i) mod 1
in    0.00 – 0.07   surface arrives
work  0.12 – 0.52   progress drives the card's own animation (c.set)
chip  u < 0.17 hidden · < 0.56 processing (three pulsing dots) · < 0.88 done (accent ✓) · else hidden
out   0.90 – 1.00   surface leaves
```

| Card | Title | Chip: processing → done |
| --- | --- | --- |
| 1 | Interest that reprices itself. | Recomputing rate → Reset applied · 5.41% |
| 2 | Payments applied down the waterfall. | Applying waterfall → Applied · 3 ledgers |
| 3 | Notices drafted, sent and logged. | Drafting notice → Sent · 3 parties |

Chips use a CSS `transition: opacity .35s, transform .35s`. That transition is inside the module
and is correct, so leave it there.

---

## 7 · §05 Investors — `buildLp()` / `loopLp()` / `lpFitNow()` on `lpHost`

This section is not pinned. It is a faux app window ("3264 · Private Credit Platform", tag
"Allocation") with four columns: the queue, the deal, a 40px connector and four vehicles.
**CY = 9.4s per deal**, and three deals loop (28.2s):

| Deal | Size | Allocated to | Fails |
| --- | --- | --- | --- |
| Northgate Cold Chain · Unitranche · B+ | 62.5 | Meridian 40.0, Insurance SMA 12.5, Credit Opps 10.0 | Nordea SMA: senior secured only |
| Estree Dental · Second lien · B− | 18.0 | Credit Opps 13.0, Meridian 5.0 | Nordea: senior secured only; Insurance: rating below B+ |
| Garrow Software · ARR facility · A− | 40.0 | Nordea 24.0, Meridian 16.0 | Credit Opps: below the sleeve hurdle; Insurance: asset class not permitted |

Phase u within a deal: in 0–0.07 · mandate tests 0.12–0.38 · allocation 0.42–0.72 (eased) ·
settled 0.74–0.93 · out 0.93–1.0.

`lpFitNow()` scales the window so the headline and the window fit one screen:
`k = clamp((innerHeight − 68 − head − marginTop − 28) / natural, 0.62, 1)`. It sets `lpFit`'s
height to the scaled height. It is keyed on viewport height, head height and natural height, so
it runs only when one of those changes.

---

## 8 · §06 Delivery — `dSync()` on `dTrack`/`dPin`

Dark section, track 608vh. The layout is a 3-column grid: stages on the left and right, and a
stack column of `clamp(300px, 30vw, 400px)` with 4 rows of at least `clamp(82px, 17vh, 138px)`.
The stage cells alternate: 01 left, 02 right, 03 left, 04 right.

**The stack** (`dBuild`/`dPuck`) is four isometric "pucks": a dark top plate, two extruded
walls with vents, a rim, sheen, glow, an icon and pins on three dashed rails. `dLayout()`
derives the pitch from the column height the grid actually gave it:
`S = 70`, `P = max(30, (H − S − 62) / 3)`. On a short viewport the stack gets tighter rather
than the section shrinking. `dInner` is additionally scaled to fit the pin, with a **floor of
0.94**.

**Five beats** over p 0.05–0.97: `prog = seg(p, 0.05, 0.97) × 5`, `enter = ease(local / 0.24)`.

| Beat | What |
| --- | --- |
| 1–4 | Plate i lifts 12px and lights up: walls gradient, rim, sheen, bloom behind it, icon glow, pins enlarge. Stage cell i fades in (9px rise) and draws a 26px stub toward the stack. Earlier cells stay at ≥ 0.62 opacity, so the list accumulates. |
| 5 | assemble = `ease(local / 0.58)`: the four plates close to 15px spacing around the middle, rails and cells fade out, the bottom plate glows, and the **CTA** (`dCta`) fades in with a 16px rise. It becomes clickable once assemble > 0.6. |

---

## 9 · Intro — `runIntro()` on `iWrap`/`iStage`/`iMark`

This runs once on first `ensure()`, unless `playIntro === false`, reduced motion is on, or
`?intro=off`. Easing is `cubic-bezier(.16,1,.3,1)` unless noted.

| ms | Beat |
| --- | --- |
| 0 | overlay shown (`#F6F5F2`). The table box is centred, `min(620px, 84vw)` wide. |
| 80 | header row "line item / reported / reconciled" fades in (340ms) |
| 200 + 150i | row i rises in (400ms, 6px): Net asset value 428,914,000 · Management fee 2,145,600 · Carried interest 8,930,400 · FX translation 671,250 · Accrued expenses 1,284,700 · Distributions 15,400,000. "reported" shows the value; "reconciled" scrambles every 70ms. |
| 1100 | "Variance" footer fades in and counts down in 22 steps × 78ms to `0.00`, which turns accent |
| 1180 + 175i | row i's reconciled value settles to the exact figure (a 260ms flash) |
| 2900 | table fades out (620ms, ease) |
| 3480 | `3264.ai` fades in (780ms, scale 0.972→1) |
| 4700 | overlay fades (560ms, ease), then `display:none`. A **timeout teardown at ms + 140** guarantees removal even if `onfinish` never fires. |

Skip: a click on the overlay or **any keydown** (a once listener) → 280ms fade, same dual
teardown. `pointer-events` goes to none as soon as teardown starts, so the page is clickable
immediately.

---

## 10 · Failure modes and what they look like

| Symptom | Cause |
| --- | --- |
| A section is blank, and `__dcErrs` has `oSync: Cannot read … of null` | ref missing or misnamed |
| Labels inside stages are black, not grey | `--mut` / `--sec` not defined on body |
| Mono captions render in a proportional font | `IBM Plex Mono` family name mismatch (next/font) |
| Ring labels overlap or are clipped at the top | canvas font is not Instrument Sans, so measureText is wrong |
| Sequence runs, but the pin scrolls away | an ancestor has overflow hidden/auto or a transform |
| Sequence lags or jitters behind scroll | smooth-scroll library or `scroll-behavior: smooth` |
| Stage too small at 1440×900 | a CSS `max-width` or `transform` on `wrap`/`stage` fighting pinFit |
| §02 caption hidden on short screens | `bottom` set in CSS on `p2Cap`; the module writes it |
| Everything freezes after hot reload | two instances: Strict Mode cleanup not calling `destroy()` |
| Intro stuck on screen | the timeout teardown was removed or `iWrap` has a CSS `display` override |
| Tiles flash on first paint | `oField` has children from React, or a transition class |
