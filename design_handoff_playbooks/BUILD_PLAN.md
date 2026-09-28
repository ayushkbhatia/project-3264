# Build plan: Playbooks page

Stack: Next.js App Router, React, TypeScript, Tailwind (the same as the Private Credit build). No motion libraries. Route: `/playbooks`.

Work in phases. Do not start a phase until the previous gate passes.

## Phase 0 · Skeleton
- Route `app/playbooks/page.tsx`. Page metadata from `CONTENT.md`.
- Fonts via Fontsource with the exact family names (specs/00). Body CSS variables and global rules (specs/00).
- Copy `reference/assets/*` to `public/img/playbooks-page/` (or the codebase's asset convention), and `icons/*.svg` to the icon folder.
- Load `data/playbooks.json` as typed data (`Playbook`, `Category`, `RecentItem`).
- Produce the video assets with the ffmpeg commands in `MOTION.md` (boomerang MP4, WebM, poster) into `public/video/`.
- Set up Playwright and run `qa/capture-reference.ts` against the served reference.

**Gate:** baselines exist for all 5 viewports; the route renders a blank page with the header and footer.

## Phase 1 · Static page (browsing state, motion off)
Build in page order: header (reuse the site component) → hero (poster only) → library bar (static) → carousel (slide 1, no controller) → CTA cards → three category rows (`PlaybookCard`, `PlaybookBadge`) → Recently updated → closing → footer.

Components to create:
- `PlaybookBadge`: the glass badge (specs/00).
- `PlaybookCard`: tile plus text (specs/05); also used by Results.
- `CategoryRow`
- `FeaturedCarousel` (static markup in this phase)
- `SubscribeCard`
- `PlatformCard`
- `RecentList`
- `ClosingCta`

**Gate:** visual diff ≤ 0.5% per section against the 1440 and 1280 baselines (reduced motion). Copy matches `CONTENT.md`.

## Phase 2 · Interaction
- Filter chips + search → derived `filtering` and `results` (specs/02); Results section; Clear; empty state; `aria-live` count; optional URL sync with `router.replace`.
- Subscribe form states: idle, submitting, success, invalid, error (specs/04). Mock the endpoint behind one function so 3264 can wire the provider.

**Gate:** states s01–s04 match the baselines. Keyboard-only use works.

## Phase 3 · Motion
- Mount `motion/hero-video.ts` on the hero `<video>` (boomerang sources + poster).
- Mount `motion/carousel.ts`: arrows, segments, click on peeking slides, hover and focus hold, pause toggle (the only visual addition, specs/03), resize without animation, reduced motion.
- Chip transitions, hover colours and focus rings (MOTION.md M6–M7).

**Gate:** the manual checks 1–3 in `VISUAL_QA.md` pass. No React re-render on each animation frame (verify with the React profiler).

## Phase 4 · Responsive, a11y, performance
- The four **Add** items in specs/08 (header collapse, recent-row layout, 20px side padding under 480, swipe).
- The a11y list in specs/08 and specs/03.
- Performance: AVIF/WebP images, lazy loading, font preload, poster preload, off-screen pause.

**Gate:** everything in `CHECKLIST.md` is ticked. Lighthouse on mobile scores ≥ 90 for Performance and 100 for Accessibility. The visual diff passes at 1024, 768 and 390.
