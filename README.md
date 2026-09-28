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

## Playbook pages (Covenant Watch, Loan Ops Ledger, Capital Call Flow, NAV Pack Review)

`/playbooks/covenant-watch`, `/playbooks/loan-ops-ledger`, `/playbooks/capital-call-flow` and
`/playbooks/nav-pack-review` are ports of
[`design_handoff_covenant_watch/`](design_handoff_covenant_watch/README.md),
[`design_handoff_loan_ops_ledger/`](design_handoff_loan_ops_ledger/README.md),
[`design_handoff_capital_call_flow/`](design_handoff_capital_call_flow/README.md) and
[`design_handoff_nav_pack_review/`](design_handoff_nav_pack_review/README.md); each prototype
(`<Name>.dc.html`) wins over its README and copy deck. All four are built on the template the
nine playbook pages share.

- The template is `src/components/playbooks/article/`: `PlaybookPage` (header with a reading
  progress bar, the phone "On this page" bar, the sticky sidebar with its coverage rail, the
  article, More playbooks, the closing panel, the footer, breadcrumb and Article JSON-LD) fed by
  a content module typed in `types.ts`. A page is its content (`src/content/<slug>.ts`: hero,
  sections as typed blocks, terms, FAQ, related playbooks) plus its figures
  (`src/components/playbooks/<slug>/`), named by slot in the content. House figures shared by
  the pages live in `article/figures/`: the evidence-line breakdown, harness anatomy, pass^k,
  review routing, injection containment and engagement timeline.
- The handoffs differ in small ways the template takes as options rather than forks: block-level
  or inline mono labels (`blockLabels`), a figure inside a break, a note under the roles or the
  rules (greedy-wrapped on Capital Call Flow: `greedyNote`), the rules' "Status as of" line and
  its spacing (`tight`), a step table's empty cell in words (`empty: "Nothing"`) or its top rule
  (`plain`), the Inputs / Outputs gap (`roomy`), the callout's border (`quiet`), the figure
  frame's radius, padding, caption gap, head alignment and a note under the caption (`footer`),
  and the hero reveal's trigger (`RevealTrigger`: Covenant Watch plays once 30% of the figure is
  in view; Loan Ops Ledger, Capital Call Flow and NAV Pack Review once its top is in the upper 65%
  of the viewport, or settle on the final state if the reader has not got there within 4s,
  `ON_TOP_IN_UPPER_65`). A related playbook gets its own card (`related`: the playbook's tile,
  badge and link).
- A new playbook page: a content module, its figures, and `src/app/playbooks/<slug>/page.tsx`
  (`articleMetadata` + `PlaybookPage`); then mark the playbook `live` in `content/playbooks.ts`
  so `[slug]` stops redirecting it, and add it to the sitemap, to `.claude/launch.json` (its
  reference) and to `qa/playbook-lib.mjs` (with its hero reveal's parts).
- Figures respond to the main column's width, not the viewport's: `<main>` is a size container
  and the figures switch layout with container queries at the prototypes' thresholds.
- Client islands only: the scroll-spy shell, the copy link, the FAQ (closed answers are
  `hidden="until-found"`, so find-in-page reaches them), the hero reveals and the figures' hover
  states and toggles. The read time is computed on the server. The hero reveal has a first-paint
  gate in `<head>` (`article/reveal.ts`), so a figure already in view is held at its start state
  rather than shown, hidden, then replayed.
- Deliberate departures, all for legibility and accessibility: status text on the green and red
  tints uses `--ok-ink` / `--bad-ink` (4.69:1 and 4.63:1; the design's colours read 4.28:1 and
  4.40:1), muted text on Capital Call Flow's #F1EEE8 row tint uses `--mut-ink` (4.55:1, against
  4.48:1) and its step table's "Nothing" `--faint-ink` (4.55:1, against 3.26:1), and NAV Pack
  Review's small muted text on the red wash and on the wash uses `--mut-ink-2` (4.52:1 and
  4.70:1, against 4.19:1 and 4.36:1); the small back links and toggles carry 24px hit areas, and
  "Copy link" falls back to a hidden textarea where the async clipboard is missing or refused.
  Capital Call Flow's hero table stacks each investor's line under a 448px main column (phones),
  where the reference's four columns overprint their amounts; from 448px up it is the reference's
  table. The header gets the Playbooks page's menu below 1000px, and the footer is the site's.
- QA: serve the page's reference (`.claude/launch.json`: :4104 Covenant Watch, :4105 Loan Ops
  Ledger, :4106 Capital Call Flow, :4107 NAV Pack Review), then with `BASE_URL` pointing at the
  site and `--page <slug>`:
  `node qa/playbook-sections.mjs --w 1440,1280,1024,768,390` (every section, pixel diff),
  `node qa/playbook-text.mjs` (the copy, verbatim against the reference),
  `node qa/playbook-behaviour.mjs` (scroll-spy, rail and progress parity, anchors, FAQ, copy
  link, phone bar, evidence hover, hero reveal, and each page's own toggles, hovers and fits) and
  `node qa/playbook-a11y.mjs` (axe, landmarks, Tab sweep, hit areas, overflow). Run them against
  `next start`: under `next dev` the first request for each new image size is optimised on
  demand and can stall a run at a new width.

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
