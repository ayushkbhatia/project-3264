# Animations — AI Engineering

Three clocks: the page class's rAF loop (`tick`), Rebuild Platform's rAF loop and Rebuild graphic's rAF
loop. Everything is a pure function of scroll position or elapsed time, recomputed each frame.

```js
cl(x)       = clamp(x, 0, 1)
sm(a, b, x) = smoothstep: u = cl((x - a) / (b - a)); u * u * (3 - 2 * u)
```

`m` is a pinned track's progress: `m = cl((68 - track.top) / (track.height - (innerHeight - 68)))`, 68 being
the header height.

## 0 · PORT SHIMS (the only permitted changes to method bodies)

1. `extends DCLogic` → `extends React.Component` in all three files.
2. Asset paths: every `url('assets/…')` and `src="assets/…"` in markup → `/img/…`. (The hero video's path
   lives in the markup only.)
3. Delete the dead code listed at the top of `ai-engineering.logic.js` (including the `three()` import of
   `https://esm.sh/three`).
4. QA flag: in `maybeIntro`, also skip when `location.search` contains `intro=off` (the reference copy does).
5. `window.__rbCtl`, `document.querySelector('[data-svg="…"]')` and `[data-grid="2a"]` are global lookups.
   Keep them and guarantee one instance of each component.

## 1 · Page clock

`componentDidMount`: `maybeIntro()`, `applyTheme()`, start rAF, `initVeil()`.
`tick(ms)`: `stepStack()`, `stepEngage()`, `enRenderBuild(ms)`, `stepAuditLoop(ms)`, `stepVeil(ms)`.
`componentDidUpdate`: `applyTheme()`; when `state.auJ` changes, fade the audit pane (`opacity .35 → 1`,
`translateY(4px) → 0`, 260ms, `cubic-bezier(.16,1,.3,1)`).

## 2 · Intro overlay (`runIntro`)

Refs `iWrap` (fixed overlay, `display:none` until it runs), `iStage` (empty), `iMark` (wordmark). Runs when
`playIntro` and not reduced motion.

* Box `min(540px, 82vw)` wide, centred. Rows `01 map the workflow`, `02 build the pipeline`,
  `03 evaluate accuracy`, `04 deploy to production`: 15px vertical padding, top hairline
  `rgba(20,20,18,0.12)`, number 13px `#6E6D67` in 24px, label 17.5px −0.022em, a 68×3 track
  `rgba(20,20,18,0.13)` with a fill (`#2C2B27`; the last one accent).
* Row i rises 7px and fades in over 440ms at `120 + 440i` ms (`cubic-bezier(.16,1,.3,1)`); its fill scales X
  over 560ms at `280 + 440i` ms (`cubic-bezier(.4,0,.2,1)`).
* Footer `4 capabilities live` · `week 06` (14px `#6E6D67`, tabular) fades in at 2060ms over 440ms.
* 2560ms: box fades and scales to .985 over 620ms. 3020ms: wordmark fades in from scale .972 over 780ms.
* 4260ms: overlay fades out over 560ms, then `display:none`. Total 4.8s.
* Click or any key: 280ms fade. Teardown sets `pointer-events:none` at once and always hides on a timer, so
  the page can never stay sealed.

## 3 · Hero veil (`initVeil`, `stepVeil`)

Refs `heroSec`, `heroImg` (the video), `heroVeil` (canvas). The video plays muted and looped; under reduced
motion or `motion=false` it holds on its first frame. Each frame, while the hero is on screen and a frame is
available, the canvas (CSS-pixel size) draws the video cover-fit and bottom-anchored, then fills with `#000` in
`"saturation"` mode to make it greyscale (luminance 0.3R + 0.59G + 0.11B). It redraws only when resized, when
blots are live, or when `currentTime` changes. The first drawn frame removes the video's CSS filter.
`pointermove` adds a point every ≥14px (max 90; radius 53–84px; random phase). Blots are erased at the points
(`destination-out`), bleeding outward and refilling over 2400ms. No pixel reads, so a tainted canvas is fine.
(From `/design_handoff_ai_engineering_hero_video`, which replaced the illustration and `buildGrey`.)

## 4 · 01 Premise (`stepStack` + step functions)

Refs `stackTrack` (760vh), `wcCard`, `wpCard`, `wnCard`, per card `*Text` (word `<p>`), `*Fit` (right column),
`*Stage` (fixed-size graphic scaled into the column); `wpPortal`, `wpInsp`.

```
t1 = sm(.28, .38, m)    t2 = sm(.64, .74, m)
wcCard: translateX(-(3·t1 + 2·t2)%)       scale(1 - .05·t1 - .03·t2)
wpCard: translateX((1 - t1)·108 - 3·t2 %) scale(1 - .05·t2)
wnCard: translateX((1 - t2)·108%)         scale(1)
```

Card progress (1 under reduced motion / `motion=false`): `p1 = cl((m - .02)/.24)`, `p2 = cl((m - .38)/.25)`,
`p3 = cl((m - .75)/.2)`. Word fill: `head = P·(N + 2.5)`, word i `base + (1 - base)·cl((head - i)/2.5)`;
card 1 base .16, P = p1; card 2 base .2, P = `cl(p2/.56)`; card 3 base .2, P = `cl(p3/.9)`.

Stage fit: card 1 600×470, `s = min(1.15, w/600, h/470)`; card 2 760×600, `min(w/760, h/600)`; card 3 700×560,
`min(1.1, w/700, h/560)`; centred by translate. Card 2: portal `inn = sm(.04,.18,p2)`, `out = sm(.42,.52,p2)`,
opacity `inn·(1-out)`, `translateY((1-inn)·16px) scale(1 - .06·out)`, hidden at out = 1; inspector
`v = sm(.46,.56,p2)`, opacity v, `translateY((1-v)·20px) scale(.96 + .04v)`.

## 5 · 02 Audit loop (`stepAuditLoop`, 21.6s)

Refs `auFit`, `auStage` (1120×620, scaled to fit), `auGrid`, `auBars`, `auPanel`, `auCal`, `auCells`, `auWin`,
`auPane`; state `auJ`. Starts when `auFit` top < 55% of the viewport and bottom > 30%; resets once fully off
screen. Reduced motion: static frame at t = 18.5.

| Window (s) | What |
| --- | --- |
| 0–0.5 in, 20.6–21.3 out | stage opacity |
| 0.3+0.4k → 0.9+0.4k | Gantt bar k draws (`clip-path: inset(0 X% 0 0 round 6px)`) |
| 0.2–0.8 | day grid in; dims to 20% as bars collapse |
| 1.8–2.4 in, 3.3–4.0 out | description panel (rise 10px / drop 24px) |
| 3.4–4.3 | bars collapse onto one line: bar k `translateY(-46k·col)` |
| 4.3–4.9 | glass calendar rises in 16px |
| 5.0+0.25n (0.2s each) | chip n appears (rise 5px), 24 chips; current day cell `rgba(255,255,255,0.4)`; bars later than today at 42% |
| 11.1–11.6 | day-10 chips go `#12A05C` with glow `0 0 0 3px rgba(18,160,92,0.22), 0 8px 22px rgba(18,160,92,0.4)`; cell `rgba(18,160,92,0.12)` |
| 12.0–12.7 | calendar fades, scale .97 |
| 12.4–13.2 | audit window rises in 24px |
| 13.2+1.3j | finding j (0–4): `setState({ auJ: j })` |

`auPack(i)`: list items (selected row `#FFFFFF`, `inset 2px 0 0 #1A1917`) and finding fields. Dispositions:
Rebuild `#C4341E` on `rgba(196,52,30,0.09)`; Keep `#157F52` on `rgba(21,127,82,0.1)`; else `#6E6D67` on
`rgba(20,20,18,0.06)`.

## 6 · 03–05 canvas (`rebuild-platform.logic.js`)

Refs `boxEl` (scaled height), `wrapEl` (1280×2980 frame, `scale(box.clientWidth/1280)` via ResizeObserver),
`latEl` (lattice), `flyEl` (flying platform), `frameEl` (04), `f5El` (05). SVG hosts `[data-svg="2a"]` (03,
RebuildGraphic), `[data-svg="1a"]` (04), `[data-svg="05"]` (05). Lattice lines every 40 units,
`matrix(0.779, 0.45, -0.779, 0.45, 640, 1000)`, stroke `rgba(255,255,255,0.055)`.

**03 hold.** The 03 frame is `wrapEl.children[3]`. When its top reaches 88px from below, the page locks
(`scrollTo(lockY)` each frame while `scrollY > lockY + 1`). While locked, downward input feeds 03 instead of
scrolling: wheel `deltaY/1400`, touch `dy/900`, ArrowDown / PageDown / End / Space `+0.12` (window listeners,
`passive:false`, `preventDefault` only while locked and only downward). The drawn timeline eases to the target
(`tc += (scrub - tc)·0.12`); 900ms after the last input it returns to auto-play from there. Released when the
build reports `shown ≥ 0.999`, when the reader scrolls up > 40px, on any `#anchor` click or `hashchange`, or
if 03 was jumped past (top already ≤ 88 − 50vh). Parent ↔ child: `window.__rbCtl = { t, shown }`.

**03 → 04 flight.** After completion `p = cl((88 - top03)/(0.6·innerHeight))`. The closed platform is drawn
once into `flyEl` and moved from 03's stack (`[data-svg="2a"]` + 360, 310) to 04's centre (`frameEl` + 601, 570):
`e = smoothstep(p)`, lerp by e, `y -= sin(eπ)·70`, scale `1 + .06·sin(eπ)`, opacity `cl(p/.08)`, hidden at
p ≤ .001 or ≥ .999. At p ≥ .999 the 04 clock `s4` starts.

**04 scene** (`scene`, every frame on screen): glow `sm(0,.9,s)`; pad fades `1 - sm(0,.5,s)`; tangle fades
`1 - sm(.15,.85,s)`; gates rise `sm(.8,1.5,s)` to 130 units; bundles `sm(1.3,1.8,s)`; lid lifts
`34·sm(.35,1.25,s)` + 2.2-unit bob; gears `0.5·(s - 1.2)`. Source wire i draws over 0.9s from `1.5 + .15i`, then
a dot per cycle (.32/.38). Station wire i from `2.9 + .15i`; tile activates, hours text → "auto" / "N min",
pulse `exp(-since/.45)`. Captions `[data-c4="1"]` `sm(.4,1.0,s4)`, `[data-c4="2"]` `sm(3.0,3.6,s4)`, with an 8px rise.

**05 scene** (`scene05`): starts when the 05 frame top passes 45% of the viewport; resets below the fold.
`[data-o5="k"]` labels `sm(3.3 + .18k, 4.0 + .18k, s5)` with a 10px rise. Duct dots flow indefinitely, uneven.

## 7 · 03 build (`rebuild-graphic.logic.js`)

Standalone: `T = 17`, `t = cl(((now - t0)/1000 % 17)/11)`. In `bare` mode: backdrop image, dot layer and CTA
hidden, floor grid drawn once into `[data-grid="2a"]`, `t` read from `window.__rbCtl.t`, `shown` written back.
Layers `A[k] = sm(.1 + .19k, .2 + .19k, t)` for L0 Interface, L1 Service, L2 Data, L3 Evidence base (each drops 26
units as it lands); assembly `asm = sm(.86,.98,t)` closes the exploded stack (Z 174/116/58/0 → 78/50/22/0);
output cards `sm(.9,1,t)`; output wire `sm(.96,1,t)` then a dot every 1.4s. Labels "Prototype app",
"Fee spreadsheet", "Shadow ledgers", "LPA + side letters" follow their layer; "LP portal · in production"
at `sm(.97,1,t)`.

## 8 · 06 Engagement (`stepEngage`, `enCalendar`, `enRenderBuild`, `enBuildSVG`, `enJump`)

Refs `enTrack` (400vh), `enStage` (max 1280 × max 600, `overflow:hidden`), `enA`/`enB` (cards), `enAi`/`enBi`
(content), `enAs`/`enBs` (spines), `enAx`/`enBx` (word `<p>`s), `enCal` (mini calendar), `enBld` (snippet host).

```
S = enB.offsetLeft   (clamp(56px, 7.2vw, 104px))      W = enStage.clientWidth
t = sm(.44, .60, m); a = sm(0, .45, t); b = sm(.55, 1, t)
enB translateX((1 - t)·(W - 2S) px)      enA scale(1 - .02t), origin left center
enAi 1 - a    enAs b    enBi b    enBs 1 - a
spine pointer-events: enAs when t > .5, enBs when t < .5
p1 = cl((m - .02)/.34)   p2 = cl((m - .62)/.30)      (both 1 under reduced motion / motion=false)
fills: base .18, soft 2.5; A uses cl(p1/.7), B uses cl(p2/.7)
```

**Mini calendar** (`enCalendar(enCal, p1)`): 24 bars (`[data-chip]`, `data-day`); bar n at `s0 = .08 + .028n`,
`v = sm(s0, s0 + .02, p1)`, opacity v, `translateY((1-v)·5px)`. Today = day of the last visible bar. Green:
`gv = sm(.8, .86, p1)` drives the day-10 overlays' opacity (no glow). Cells: today (before green)
`rgba(255,255,255,0.42)`, day 10 once green `rgba(18,160,92,0.12)`, else transparent.

**Platform snippet** (`enRenderBuild` → `enBuildSVG(p2, seconds, still)`): redrawn into `enBld.innerHTML` every
frame while the build card shows (`b > .02`) and the track is on screen. It is the 04 platform stack re-inked
for a light card (ink `rgba(26,25,23,0.55)`, white glass faces, dark base and lid, pastel accents), with the
release gate and a column of five stations: Intake, Capture, Check, Approve, File. viewBox `425 305 715 425`.
Idle motion: lid floats `12 + 2.2·sin(1.1g)`, gears turn `0.5g`, dots run the bundle. Station i ships at
`s = .16 + .14i` of p2: its wire draws over `sm(s - .1, s, p2)` (halo `#F3C9A8` 4px at .6, core
`rgba(26,25,23,0.6)` 1px), the tile lights `sm(s, s + .04, p2)` (pastel wash .42, icon `#1A1917`, tag
`F{i+1}` → `live` in `#157F52`) with a pulse `exp(-(g - shipTime)/.5)`; shipped stations then carry one dot per
cycle (speed .32/.38 alternating, offset .23i). `still` (reduced motion / `motion=false`): g = 0, no pulses.

**Spine click**: `enJump(.2)` / `enJump(.82)` smooth-scrolls to that m:
`scrollY = trackTop - 68 + m·(trackHeight - (innerHeight - 68))`.
