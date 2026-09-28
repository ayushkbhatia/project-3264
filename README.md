# project-3264

Next.js 16 (App Router) + TypeScript + Tailwind 4. Deployed on Vercel.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Home page and the design handoff

The home page is a port of the Claude Design handoff in
[`design_handoff_home/`](design_handoff_home/README.md). Its reference prototype,
`design_handoff_home/reference/3264 Home.dc.html`, is the source of truth for layout, copy
and motion; where the specs and the reference differ, the reference wins.

- Copy lives in `src/content/home.ts`; sections in `src/components/home/`.
- The four motion systems are the handoff's own modules in `src/motion/`, mounted through
  `useMotionSystem` (`src/motion/react.js`). Changes made for the port are marked `PORT FIX`.
  three.js is loaded lazily under the npm alias `three-r161` (the version the modules target).
- `?motion=off` freezes every motion system, for deterministic screenshots.

### Visual QA against the reference

`.claude/launch.json` serves the reference on :4100 next to the dev server on :3000.

```bash
node qa/compare.mjs --sel "#model" --w 1280,1440,1920 --styles
```

`qa/compare.mjs` screenshots the same selector on both sides, writes ref / port / diff PNGs to
`qa/__screens__/`, and prints the diff ratio (plus a computed-style diff with `--styles`).
The `qa/hero-*`, `qa/capabilities-*` and `qa/intro-*` suites cover the motion systems.

## Private Credit page

`/industries/private-credit` is a port of
[`design_handoff_private_credit/`](design_handoff_private_credit/README.md), built the same
way: the reference prototype (`reference/Private Credit.dc.html`) wins over the specs.

- One motion instance drives the whole page: `src/motion/private-credit/private-credit.js`
  (the handoff's module, untouched) mounted by `PrivateCreditMotionRoot` in `react.js` there.
  Sections bind their elements by name with `useBind()`; the hosts the module fills stay empty
  in JSX.
- Markup lives in `src/components/private-credit/`, with the reference's inline CSS set
  verbatim through `css()`. The page root (`[data-pc]`) runs on content-box sizing, as the
  prototype did.
- Fonts are self-hosted in `public/fonts` under their literal family names (the module names
  them in inline styles and canvas fonts), for the whole site.
- QA: serve the reference on :4101 (`.claude/launch.json`), then
  `node qa/pc-scrub.mjs` (pinned sequences, every scrub point, four viewports),
  `node qa/pc-intro.mjs`, `node qa/pc-lifecycle.mjs`, `node qa/pc-responsive.mjs`,
  `node qa/pc-a11y.mjs`, and `qa/compare.mjs` with `REF_URL` / `PORT_URL` set for static
  sections (`?t=16&intro=off` on both sides freezes the time loops and skips the intro).

## AI Engineering page

`/ai-engineering` is a port of
[`design_handoff_ai_engineering/`](design_handoff_ai_engineering/README.md); again the
reference prototype (`reference/AI Engineering.dc.html`) wins over the specs.

- As that handoff prescribes, the motion is the prototype's own logic classes, ported as React
  class components: `src/motion/ai-engineering/*.logic.js` (method bodies verbatim apart from
  the handoff's port shims, listed at the top of each file). The page component
  (`src/components/ai-engineering/AIEngineeringPage.tsx`) extends the page logic and adds
  `render()`; `RebuildPlatform` and `RebuildGraphic` do the same for the 03–05 dark canvas.
- Section markup in `src/components/ai-engineering/sections/` was converted from the reference
  with every inline style kept verbatim through `css()`. The page root (`[data-ai]`) runs on
  content-box sizing.
- Behaviour the handoff asks the port to add, wrapped around the logic rather than written into
  it: the intro's first-paint gate, reduced motion for the 03 hold, the under-900px interim
  layout (spec 08), keyboard-reachable spine buttons, and a footer "Pause animations" control.
- The hero is a looping video under the greyscale colour-reveal veil
  ([`design_handoff_ai_engineering_hero_video/`](design_handoff_ai_engineering_hero_video/README.md)):
  self-hosted at `public/video/ai-engineering-hero.mp4` (H.264, faststart, ~3MB, re-encoded from
  the design's source clip) with its first frame as the preloaded poster. The video pauses while
  the hero is off screen, under the pause control and under reduced motion.
- The reference's embedded canvas prototypes leak their preview background
  (`body { background:#E9E7E2 }`) onto the whole page; the port keeps the page's specified
  `#F6F5F2`, and the QA scripts neutralise the leak on the reference side.
- QA: serve the reference on :4102 (`.claude/launch.json`), then
  `node qa/ai-scrub.mjs` (every scroll point, three viewports; `--reduced` for the static
  states), `node qa/ai-motion.mjs` (audit loop, 03 hold, flight into 04),
  `node qa/ai-intro.mjs`, `node qa/ai-interact.mjs`, `node qa/ai-lifecycle.mjs`,
  `node qa/ai-responsive.mjs`, `node qa/ai-a11y.mjs` and `node qa/ai-hero-video.mjs` (the hero
  video: playback, veil, trail, reduced motion, pause, reference vs port on the same frame).

## Playbooks page

`/playbooks` is a port of [`design_handoff_playbooks/`](design_handoff_playbooks/README.md); the
reference prototype (`reference/Playbooks.dc.html`) wins over the specs.

- Copy and data (the nine playbooks, the featured order, the placeholder "Recently updated"
  entries) live in `src/content/playbooks.ts`; sections in `src/components/playbooks/`, written in
  Tailwind with the reference's exact values. Where the reference relies on content-box sizing
  (the subscribe card's flex basis, the closing tile's max-width, the results' min-height) the
  element carries `box-content`, so the geometry matches it.
- The page is static apart from four client islands: the hero video, the library's filter state
  (`Library.tsx`, which swaps the server-rendered browsing sections for results and mirrors the
  filter in `?category=&q=`), the carousel and the subscribe form.
- Motion is the handoff's two modules in `src/motion/playbooks/`: `hero-video.ts` (verbatim) and
  `carousel.ts` (changes marked `PORT FIX`, among them `inert` moved off the slides so a click on
  a peeking slide activates it). Neither re-renders React per frame.
- The hero video is a pre-rendered boomerang, self-hosted: `scripts/playbooks-video.sh` builds
  it (1756 wide for tablets up, 960 for phones, H.264) and the poster. The page images are the
  handoff PNGs re-encoded to WebP by `scripts/playbooks-assets.mjs`.
- Every card links to `/playbooks/<slug>`; until a detail page ships, `app/playbooks/[slug]`
  redirects (307) to the playbook's category page. A detail page added as its own folder takes
  precedence; then mark the playbook `live`.
- The subscribe form posts through one seam, `components/playbooks/subscribe.ts`, which is a mock
  until an email provider is chosen (an address at `.invalid` exercises the error state).
- Additions the handoff asks for: a header menu below 1000px (the Header's `menu` prop,
  `components/home/MobileMenu.tsx`), a carousel pause control, keyboard and swipe, 20px gutters
  below 480px, and the two-column "Recently updated" rows below 520px.
- QA: serve the reference on :4103 (`.claude/launch.json`), then `node qa/pb-sections.mjs --w
  1440,1280,1024` (every section, pixel diff), `node qa/pb-states.mjs` (filter, search, empty,
  subscribe states), `node qa/pb-motion.mjs` (carousel, hero video, reduced motion),
  `node qa/pb-a11y.mjs` (axe, focus rings, hit areas, menu, overflow) and
  `node qa/pb-contrast.mjs` (text set over imagery).

## Environment

Copy `.env.example` to `.env.local` and fill in the values. `.env.local` is
gitignored and must stay that way.

## Deploys

Deploys are batched deliberately — see "Deploy policy" below.

- **Production**: merging to `main` builds and deploys.
- **Previews**: skipped by default. Put `[preview]` in a commit message to
  force a preview build for that push.

The gate lives in [`scripts/vercel-ignore-build.sh`](scripts/vercel-ignore-build.sh),
wired via `ignoreCommand` in [`vercel.json`](vercel.json).

### Deploy policy

Every deployment is billed build time, and each Vercel deployment gets its own
ISR cache rather than reusing the previous one — so every production deploy
leaves not-prerendered pages cold, and the next visitor or crawler pays a full
render. Land related changes as one batch instead of merging each PR the moment
it goes green. Exceptions that ship immediately: production is broken, a
security fix, or an explicit ask.

Also: don't run a local production build while a hosted build is in flight —
both hit the same database and can exhaust a pooled Postgres client limit.

## Database

No Supabase project is provisioned yet. When one is:

1. Create the project, then set `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in Vercel
   and in `.env.local`.
2. `npm install @supabase/supabase-js @supabase/ssr`.
3. Add server and browser clients under `src/lib/supabase/`.
