# Build plan — 3264.ai Home

Six phases plus a kickoff. Each phase ends at a **gate**. Do not start the next phase until
the gate passes. The prompts for each phase are in `CLAUDE_CODE_PROMPT.md`.

The order goes from static to animated and from low risk to high risk, so the page's rhythm,
type and colour are settled before any motion is added on top of them.

| Phase | Scope | Spec | Relative effort |
| --- | --- | --- | --- |
| 0 | Project skeleton + QA harness | `VISUAL_QA.md` | S |
| 1 | Tokens, primitives, header, footer image, footer | `specs/00-foundation.md` | S |
| 2 | Model, Industries, Work, Stack, Team, Playbooks, Closing CTA | `specs/02-static-sections.md` | M |
| 3 | Hero + HeroArt + Vignettes | `specs/03-hero.md`, `ANIMATIONS.md` §3–4 | M |
| 4 | Capabilities + PlatformSequence | `specs/04-capabilities.md`, `ANIMATIONS.md` §2 | L |
| 5 | Intro relief | `specs/05-intro.md`, `ANIMATIONS.md` §1 | S |
| 6 | Responsive, a11y, perf, full checklist | `specs/06-responsive-a11y-perf.md`, `CHECKLIST.md` | M |

---

## Target file structure

```
src/
├── app/
│   ├── layout.tsx              font, <body> tokens, metadata
│   ├── globals.css             tokens, resets, @keyframes m3264-mark
│   └── page.tsx                composes sections in order
├── components/home/
│   ├── primitives.tsx          Eyebrow, SectionHeader, HairlineGrid, GridTexture, Button
│   ├── Header.tsx
│   ├── Hero.tsx                "use client" (HeroArt, Vignettes)
│   ├── Model.tsx
│   ├── Capabilities.tsx        "use client" (PlatformSequence) + CapabilitiesStatic.tsx
│   ├── Industries.tsx
│   ├── Work.tsx
│   ├── Stack.tsx
│   ├── Team.tsx
│   ├── Playbooks.tsx
│   ├── ClosingCta.tsx
│   ├── FooterImage.tsx
│   ├── Footer.tsx
│   └── Intro.tsx               "use client" (IntroRelief)
├── motion/                     copied verbatim from design_handoff_home/motion
└── content/home.ts             all copy as data (industries, cases, team, playbooks, footer)
public/
├── img/hero-valley.png
├── img/footer-nocturne.png
└── logos/*.png
qa/
├── visual.spec.ts              Playwright harness
└── __screens__/                reference + port captures
```

Only `Hero`, `Capabilities` and `Intro` are client components. Everything else is a server
component with no JS.

---

## Phase 0 · Skeleton

- Next.js App Router + TS + Tailwind. Tailwind theme extended with the exact tokens (below).
- `npm i three@0.161.0`. Copy `motion/` to `src/motion/`. Replace the body of
  `three-loader.js` with the npm lazy import shown in `ANIMATIONS.md`.
- Copy assets to `public/` and update the one hard-coded path in `hero-art.js` line 48
  (`"assets/hero-valley.png"` → `"/img/hero-valley.png"`).
- Add `?motion=off` support: a small client flag read in `layout.tsx` that sets
  `data-motion="off"` on `<html>`. Every `useMotionSystem` call checks it and skips mounting.
  The reference supports the same thing through its `playIntro` prop (see `VISUAL_QA.md`).
- Set up Playwright per `VISUAL_QA.md`.

**Gate:** `npm run build` passes; QA harness captures the reference at 1440 without errors.

## Phase 1 · Foundation

- Tokens, font, resets, primitives, Header, FooterImage, Footer.
- Empty `<section>`s for every other block, with correct `id`, padding and bottom hairline, so
  scroll length and anchor positions are roughly right from the start.

**Gate:**
- [ ] Header, FooterImage and Footer within diff threshold at 1280 / 1440 / 1920
- [ ] Header is sticky and blurs, 68px tall, bottom hairline visible
- [ ] Instrument Sans renders with no FOUT on hard reload
- [ ] All text weights 400 except wordmark, buttons and footer column heads (500)

## Phase 2 · Static sections

Build in order and screenshot each before moving on: Model → Industries → Work → Stack → Team
→ Playbooks → Closing CTA.

**Gate:**
- [ ] Each section within diff threshold at 1440, and visually correct at 1280 and 1920
- [ ] Hairline grids have no doubled borders at the outer edge
- [ ] Both placeholder notes present; nine logos; copy verbatim (run the copy diff in `VISUAL_QA.md`)
- [ ] Row hover moves the top border to accent (Industries, Playbooks); buttons hover to accent

## Phase 3 · Hero

1. Static markup, compared with `?motion=off`.
2. Mount `HeroArt` (key `artCv`) and `Vignettes` (keys `vigA`, `vigB`, `vigC`).

**Gate:**
- [ ] Static hero within threshold at 1440 with motion off
- [ ] H1 breaks after "Deployment is" at every width
- [ ] Painting displaces on scroll; type, CTAs and cards do not move
- [ ] Vignettes loop, visibly out of phase, and do not start off-screen
- [ ] Blocking `three` in DevTools → static painting, no console errors that break the page
- [ ] Idle at top of page: no continuous rAF work in a performance profile

## Phase 4 · Capabilities

1. Section header (static).
2. Track, pin, grid, rail, left panels, stage shell: every ref from the contract.
3. Mount `PlatformSequence`.
4. Scrub captures (see `VISUAL_QA.md` → "Scroll-linked captures").
5. Static fallback below 900px.

**Gate:**
- [ ] Scrub captures match the reference at p = 0.10, 0.30, 0.36, 0.50, 0.64, 0.70, 0.90
- [ ] Stage never blank at p ≈ 0.30 and p ≈ 0.64; two panels never both legible
- [ ] Rail tracks act; clicking each tab tweens and lands on that act
- [ ] Hover tooltip appears and clears
- [ ] No panel overflows or paints into Industries at 1280 / 1440 / 1920
- [ ] Resize mid-sequence keeps the current act
- [ ] Change one price in `phCaps()` → totals and release plan update (then revert)
- [ ] 768–940px: module's own single-column layout works; below 768px: module not mounted, static stacked acts render
- [ ] Strict Mode: one rAF loop, no WebGL context warnings after navigate-away-and-back

## Phase 5 · Intro

**Gate:**
- [ ] Plays once, ~4s, caption `2 · 4 · 8 · 16 · 32 · 32 × 64`, `.ai` after `3264`
- [ ] Click and any keypress dismiss it
- [ ] Nav link fires on the first click after dismissal
- [ ] No overlay with `prefers-reduced-motion: reduce`
- [ ] Hero is usable on slow 3G before the relief resolves

## Phase 6 · Hardening

Walk `CHECKLIST.md` end to end. Everything must pass or have a written reason.

---

## Things that commonly go wrong in this kind of port

1. **Rounding values to Tailwind steps.** `text-[16.5px]`, not `text-base`. `tracking-[-0.032em]`,
   not `tracking-tight`. This single habit accounts for most of the "close but not quite" feel.
2. **Bold headings.** Tailwind preflight doesn't bold h1–h3, but component libraries do. Force 400.
3. **`divide-*` for hairline grids.** Gives the wrong outer edge. Use gap-1px over a line-colour background.
4. **Rebuilding the capability panels in JSX.** They are measured and fitted imperatively.
   JSX ownership breaks the fit pass. Mount empty divs.
5. **Gapless act transitions.** Changing the panel opacity windows so acts don't overlap
   leaves a blank stage. Keep the windows as written.
6. **Top-level `import * as THREE`.** Adds ~600KB to first load. Lazy only.
7. **"Cleaning up" the intro teardown** into one callback. It reintroduces the invisible
   overlay bug.
8. **Fighting `phLayout()`.** It writes the pin's top/height (below the header), grid columns,
   gaps, track and stage height inline. CSS or Tailwind classes that set the same properties
   lose or flicker. Leave those properties unset in markup beyond the initial values.
