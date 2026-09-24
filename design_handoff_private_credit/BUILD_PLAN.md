# Build plan — 3264.ai Private Credit

There is a kickoff and five phases. Each phase ends at a **gate**, and you do not start the next
phase until that gate passes. The prompts are in `CLAUDE_CODE_PROMPT.md`.

The order goes from static to animated. Rhythm, type, colour and stage geometry are settled
before the motion module starts writing into the page. The module builds most of what you see
inside the stages, so if the shell around it is wrong, the module will look wrong and the
temptation will be to "fix" the module. Don't.

| Phase | Scope | Read | Effort |
| --- | --- | --- | --- |
| 0 | Skeleton, fonts, tokens, QA harness, reference baselines | README, `VISUAL_QA.md` | S |
| 1 | Header, Footer, CtaBand, PinnedStage shell, empty sections | `specs/00` | S |
| 2 | Static markup of every section, all refs bound, module not started | `specs/01`–`07` (Markup) | M |
| 3 | Mount PrivateCreditMotion, verify all seven systems | `ANIMATIONS.md`, `specs/01`–`07` (Motion) | **L** |
| 4 | Intro overlay | `specs/08`, `ANIMATIONS.md` §9 | S |
| 5 | Responsive gating, a11y, perf, full checklist | `specs/09`, `CHECKLIST.md` | M |

---

## Target file structure

```
src/
├── app/
│   ├── layout.tsx                          fonts, <body> class carrying the tokens
│   ├── globals.css                         body custom properties, resets, @keyframes pcBlip
│   └── industries/private-credit/page.tsx  <PrivateCreditMotionRoot> + sections in order
├── components/private-credit/
│   ├── primitives.tsx      CtaBand, PinnedStage, FauxWindow (title bar + traffic lights),
│   │                       MenuBar (the 28px faux OS bar), ScrollBlip, GridTexture
│   ├── Intro.tsx           "use client"
│   ├── Hero.tsx            "use client" (heroCv)
│   ├── Reality.tsx         "use client"   §01
│   ├── Platform.tsx        "use client"   §02
│   ├── Origination.tsx     "use client"   §03
│   ├── Servicing.tsx       "use client"   §04
│   ├── Investors.tsx       "use client"   §05
│   └── Delivery.tsx        "use client"   §06
├── components/site/Header.tsx, Footer.tsx  shared with Home if it exists
├── motion/
│   ├── private-credit.js   verbatim from the handoff
│   └── react.js            verbatim from the handoff
└── content/private-credit.ts   copy for the MARKUP only (hero, CTA bands, footer, §06 stages).
                                The module's own copy stays in the module.
public/img/                 hero-wash, valley-pastel, cta-valley, routing-band, delivery-bg
qa/                         copied from the handoff
```

Every section that binds a ref must be a client component, because `useBind` is a context
hook. Header and Footer can stay server components.

---

## Phase 0 · Skeleton

- Next.js App Router + TS + Tailwind.
- Load the fonts with **Fontsource** (not `next/font`) so the CSS family names are exactly
  `Instrument Sans` and `IBM Plex Mono`. See `specs/00-foundation.md` → Fonts.
  The module's inline styles and canvas `ctx.font` strings name these families literally.
- Put the body custom properties in `globals.css` (`--a --bad --warn --line --line2 --mut --sec --tex`).
- Add the global `@keyframes pcBlip` and the reduced-motion rule for `[data-blip]`.
- Copy `motion/` → `src/motion/` byte for byte. Copy `assets/` → `public/img/`.
- `motion/react.js` contains JSX, so either keep it as `.js` (Next compiles JSX in `.js`) or
  rename it to `.jsx`. Do not convert it to TS.
- Install Playwright, copy `qa/`, serve the reference on :4100 and run `qa/capture-reference.ts`.

**Gate**
- [ ] `npm run build` passes with `src/motion/*` untouched (`diff -r` against the handoff is empty)
- [ ] `qa/reference-screens/{1024x768,1280x800,1440x900,1440x760,1920x1080}/` all written
- [ ] In the browser console on the empty route, `getComputedStyle(document.body).getPropertyValue('--warn')` is `#8A5A16`

## Phase 1 · Foundation

**Gate**
- [ ] Header, both CTA bands and Footer are within threshold at 1280 / 1440 / 1920
- [ ] Header is sticky, 68px tall, blurs content beneath, and "Industries" is the active nav item (ink, not sec)
- [ ] CTA band headline stays on one line at 1280 (it is `nowrap`; the band grows instead)
- [ ] The empty pinned sections have the right heights: `#reality` track is 6× viewport, `#platform` 7×, `#origination` 6×, `#delivery` 6.08×
- [ ] No FOUT on hard reload; Instrument Sans and Plex Mono both render

## Phase 2 · Static markup

**Gate**
- [ ] Hero within threshold at 1440 (mask the canvas), and the equation band is centred with `(1)` pinned right
- [ ] §01: all four faux windows and the platform shell are present at their exact stage coordinates (check with `opacity:1` forced in DevTools; they start at 0)
- [ ] §01 has no `badgeA` element (that caption was removed from the design on 24 Sep 2026; the module tolerates its absence)
- [ ] Every name in `ELEMENTS` except `badgeA` is bound exactly once. Check with `document.querySelectorAll('[data-ref]')` if you add a dev-only `data-ref` attribute in `bind()`, or with a console log of `Object.keys(nodes.current)`
- [ ] Host elements are empty in the server HTML (view source)
- [ ] Copy diff of static markup text passes (`VISUAL_QA.md` → Copy diff, markup only)

## Phase 3 · Motion

Run these in order and check each system before moving to the next.

**Gate: core**
- [ ] `window.__dcErrs` is `undefined` after scrolling top → bottom → top
- [ ] Exactly one instance: `window.__pcLive` is set, and after Strict Mode double-mount there is one rAF loop (Performance panel)
- [ ] Navigate away and back: no duplicate scroll listeners and no second watchdog interval (`window.__pcWatch` is a single id)

**Gate: hero ring** (`ANIMATIONS.md` §2)
- [ ] At `?t=1`, `?t=5`, `?t=10`, `?t=14` and `?t=26.7` the ring matches the reference: nodes appearing, mesh drawing, fold to hub, clean spokes with pulses, fading out
- [ ] Ring labels use Instrument Sans (not Helvetica) and node codes use Plex Mono
- [ ] Ring stops drawing when scrolled out of view (no canvas work in the profile)

**Gate: §01 reality** (`ANIMATIONS.md` §3). Every point in `qa/scrub-points.json → reality` matches the reference at 1440×900, 1280×800, 1920×1080 and 1440×760, and:
- [ ] Title words reveal one by one and reverse on scroll-up
- [ ] Windows stack in DOM order (the xlsx is on top)
- [ ] The platform walk always opens on Pipeline, even after scrolling back up past it
- [ ] At 1440×760 the stage crops at the bottom rather than shrinking the headline away

**Gate: §02 platform** (`ANIMATIONS.md` §4). Every scrub point matches, and:
- [ ] Each of the five stages rebuilds its title, caption and body when the index changes (a 400ms fade-in)
- [ ] Underwriting stress numbers interpolate continuously (scrub slowly: 4.19x → 4.41x, headroom 0.56x → 0.34x, rating flips B+ → B past 72%)
- [ ] Memo sub-beats swap without two panels overlapping at full opacity

**Gate: §03 origination** (`ANIMATIONS.md` §5). Every scrub point matches, and:
- [ ] Count reads 248 → 96 → 61 → 38 → 24 → 11 exactly at the end of each stage
- [ ] Failing tiles blur and sink in a left-to-right sweep; the 11 survivors turn live green one after another in the last stage
- [ ] All six vignettes share one height (no jump between stages)

**Gate: §04 servicing** (`ANIMATIONS.md` §6)
- [ ] With `?t=0, 1, 2, 4, 5.8`, all three cards match the reference
- [ ] Without `?t`, the three cards cycle visibly out of phase (offset 0.11 of a cycle each)

**Gate: §05 investors** (`ANIMATIONS.md` §7)
- [ ] With `?t=` at the phases in the spec, the allocation matches for all three deals
- [ ] The whole block (headline + window) fits one screen at 1440×900 and 1280×800 (lpFitNow scale ≥ 0.62)

**Gate: §06 delivery** (`ANIMATIONS.md` §8). Every scrub point matches, and:
- [ ] Stage cells accumulate (earlier ones stay at ≥ 0.62 opacity)
- [ ] In beat 5 the plates close into one unit, stage text and rails fade, and the CTA becomes clickable only once it is mostly visible
- [ ] Short viewport (1440×760): the stack shrinks its pitch rather than the whole section scaling below 0.94

## Phase 4 · Intro

**Gate**
- [ ] Plays once on load: header row, six reconciling rows, "Variance" counting down to `0.00` in accent, table out, `3264.ai` in, then the overlay lifts. About 5.3s in total.
- [ ] Click anywhere or press any key → it fades in 280ms and is gone
- [ ] A nav link fires on the first click after dismissal
- [ ] Never shown with `prefers-reduced-motion: reduce` or `?intro=off`
- [ ] Hard-throttle the CPU 6×: the overlay still tears down (timeout fallback)

## Phase 5 · Hardening

Walk `CHECKLIST.md`. Everything must pass or have a written reason.

---

## Things that commonly go wrong in this port

1. **Rewriting the module.** "It's 3,400 lines of imperative DOM, let's make it React" is the
   most expensive mistake available here. The sequences are measured and fitted against live
   layout and styled per frame. React ownership of those nodes breaks the fit passes, and
   re-rendering on scroll breaks performance. Leave it alone.
2. **Font family names.** `next/font` generates names like `__Instrument_Sans_a1b2c3`, which is why this page uses Fontsource. The
   module writes `'IBM Plex Mono'` and `"Instrument Sans"` literally, so everything it builds
   falls back to system fonts, and the canvas ring measures its labels in the wrong font and
   lays the ring out wrongly. Fix it with the pattern in `specs/00-foundation.md`.
3. **Missing CSS variables.** The module's inline styles use `var(--mut)`, `var(--sec)`,
   `var(--a)`, `var(--warn)` and `var(--bad)`. Defining these only in the Tailwind theme leaves
   every label black.
4. **Tailwind preflight inside hosts.** Preflight resets `img`, `h*` and `p`, which is fine. But
   a Tailwind class on a host or ancestor that sets `font-size`, `line-height`, `gap`,
   `display` or `transform` leaks into module-built content. Hosts should carry only the
   styles in the spec.
5. **Breaking `position: sticky`.** Any ancestor of a pin with `overflow: hidden|auto|scroll`
   or a `transform` disables sticking. The body uses `overflow-x: clip`, **not** `hidden`, for
   this reason. Keep it.
6. **Tweening scroll.** Do not add smooth-scroll libraries (Lenis and similar) or CSS
   `scroll-behavior: smooth` on `html`. The sequences read `getBoundingClientRect()` every
   frame, and a virtual scroller desynchronises them.
7. **Rounding values to Tailwind steps.** `text-[13.5px]`, not `text-sm`, and
   `tracking-[-0.032em]`, not `tracking-tight`.
8. **Bold headings.** Force weight 400 everywhere, and watch component libraries that bold `h2`.
9. **Rendering the removed caption.** `badgeA` ("Multiple systems and handoffs…") is gone from
   the design. Do not resurrect it from an older screenshot.
10. **"Simplifying" the clock.** The rAF loop, the 34ms fallback interval, the 400ms scroll
    heartbeat and the window-level watchdog look redundant together. Each one covers a real
    stall (throttled rAF, frozen timers, hot reload, embedded preview). Keep all four.
