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

## Playbook pages (Covenant Watch, Loan Ops Ledger, Capital Call Flow, NAV Pack Review, Investor Reporting, Side-Letter Register, Mandate Guardrails)

`/playbooks/covenant-watch`, `/playbooks/loan-ops-ledger`, `/playbooks/capital-call-flow`,
`/playbooks/nav-pack-review`, `/playbooks/investor-reporting`, `/playbooks/side-letter-register`
and `/playbooks/mandate-guardrails` are ports of
[`design_handoff_covenant_watch/`](design_handoff_covenant_watch/README.md),
[`design_handoff_loan_ops_ledger/`](design_handoff_loan_ops_ledger/README.md),
[`design_handoff_capital_call_flow/`](design_handoff_capital_call_flow/README.md),
[`design_handoff_nav_pack_review/`](design_handoff_nav_pack_review/README.md),
[`design_handoff_investor_reporting/`](design_handoff_investor_reporting/README.md),
[`design_handoff_side_letter_register/`](design_handoff_side_letter_register/README.md) and
[`design_handoff_mandate_guardrails/`](design_handoff_mandate_guardrails/README.md); each
prototype (`<Name>.dc.html`) wins over its README and copy deck. All seven are built on the
template the nine playbook pages share.

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
  in view; Loan Ops Ledger, Capital Call Flow, NAV Pack Review, Side-Letter Register and Mandate
  Guardrails once its top is in the upper 65% of the viewport, or settle on the final state if
  the reader has not got there within 4s, `ON_TOP_IN_UPPER_65`). A related playbook gets its own
  card (`related`: the playbook's tile, badge and link). Investor Reporting adds a step-table lane
  said in its own words (`{ faint }`), dated "Recently updated" rows, a figure head with its own
  right-hand content (`aside`), and a reveal on its own schedule (`useHeroReveal`'s `schedule`:
  six steps 150ms apart, each a dot turning from grey to green and, under the sentence's figures,
  an underline drawing: the `wait` and `draw` parts). Side-Letter Register's reveal is on a
  schedule too (its five rows 150ms apart, then the overdue row turns red), and it adds a note
  between the evidence line and the caption (Figure's `note`), several bold lead-ins in one list
  item (`Rich` as an array) and a link inside a FAQ answer (`Inline`). Mandate Guardrails plays
  six steps 350ms apart (an underline, a note fading in, then a result bar turning green: `draw`,
  `fade`, and `wait` with its `tint` and `word`), and adds italic regional notes on terms
  (`note`), small print under a list (a `note` block), and the space above a step table or Hard
  / We pairs that follow a figure (`spaceAbove`); the house harness-anatomy and pass^k figures
  take the page's own caption.
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
  rather than shown, hidden, then replayed; after a client-side navigation (a card on
  /playbooks, More playbooks, a related card) the hook sets the same gate itself, since Next
  measures the new page before the start state lands and the parts would otherwise fade out.
- Deliberate departures, all for legibility and accessibility: status text on the green and red
  tints uses `--ok-ink` / `--bad-ink` (4.69:1 and 4.63:1; the design's colours read 4.28:1 and
  4.40:1), muted text on Capital Call Flow's #F1EEE8 row tint uses `--mut-ink` (4.55:1, against
  4.48:1) and its step table's "Nothing" `--faint-ink` (4.55:1, against 3.26:1), and NAV Pack
  Review's small muted text on the red wash and on the wash uses `--mut-ink-2` (4.52:1 and
  4.70:1, against 4.19:1 and 4.36:1), as do Investor Reporting's on the wash and the hover
  highlight (4.51:1 there), whose faint words ("No model step", a struck-out edit) take
  `--faint-ink`, and the muted text in Side-Letter Register's overdue row. Text Side-Letter
  Register sets in its faint grey #8A887F (the MFN grid's "own provision" and "carve-out", the
  internal register ids, F4's "none") also takes `--faint-ink` (about 4.9:1 on the sheet, against
  3.5:1), as does Mandate Guardrails' (the "(fictional)" after its sheet titles, the check
  timestamps), whose red row and rule-spec comments on the wash take `--mut-ink-2` (the design's
  grey reads 2.9–3.0:1 there). The small back links and toggles carry 24px hit areas, and
  "Copy link" falls back to a hidden textarea where the async clipboard is missing or refused.
  Capital Call Flow's hero table stacks each investor's line under a 448px main column (phones),
  where the reference's four columns overprint their amounts; from 448px up it is the reference's
  table. Mandate Guardrails' pre-trade check table switches its cells and its columns together at
  a 560px column (the reference switches the cells at 540 and the columns at 560, which folds the
  table into a broken two-column grid in between), and under a 334px column its order line's
  security wraps, where the reference's runs past the card. Its rule spec keeps its columns and
  scrolls sideways inside its own box, focusable so the keyboard can scroll it. The header gets
  the Playbooks page's menu below 1000px, and the footer is the site's.
- QA: serve the page's reference (`.claude/launch.json`: :4104 Covenant Watch, :4105 Loan Ops
  Ledger, :4106 Capital Call Flow, :4107 NAV Pack Review, :4108 Investor Reporting, :4109
  Side-Letter Register, :4110 Mandate Guardrails), then with `BASE_URL` pointing at the site and
  `--page <slug>`:
  `node qa/playbook-sections.mjs --w 1440,1280,1024,768,390` (every section, pixel diff),
  `node qa/playbook-text.mjs` (the copy, verbatim against the reference),
  `node qa/playbook-behaviour.mjs` (scroll-spy, rail and progress parity, anchors, FAQ, copy
  link, phone bar, evidence hover, hero reveal, and each page's own toggles, hovers and fits) and
  `node qa/playbook-a11y.mjs` (axe, landmarks, Tab sweep, hit areas, overflow). Run them against
  `next start`: under `next dev` the first request for each new image size is optimised on
  demand and can stall a run at a new width.

## Essays

`/essays` and the fifteen essays under it (`/essays/<slug>`) are a port of
[`design_handoff_essays/`](design_handoff_essays/README.md): the index prototype
(`Essays.dc.html`) and one prototype per essay, all from one template. The prototypes win over
the README.

- The essays are Markdown, one file each in `src/content/essays/` (`NN-<slug>.md`): a short
  frontmatter (`key: <JSON>` per line: number, slug, title, summary, category, date, painting,
  related playbook, featured slots), then the article. `scripts/essays-content.mjs` split them out
  of the handoff's drafts (`content/field-notes-drafts.md`); edit the files directly from here on.
  To add an essay, add a file: the index, the routes, "More essays" and the sitemap follow.
- `src/content/essays-source.ts` reads them on the server at build time and checks them (unknown
  category, painting or playbook, a second lead, or Markdown outside the template's subset fails
  the build). `src/components/essays/markdown.ts` is the parser: paragraphs, `###` sections
  (`### 1. Ownership` is numbered "01"), lists, tables, a code fence, bold, italic, code and
  references (`[1]`, `[3, 4]`). The fixed copy is in `src/content/essays.ts`.
- The essay page is the playbook pages' article shell: `ArticleShell` (contents, scroll-spy, the
  phone bar), the header's progress bar, `CopyLink`, the dark band and the related-playbook card
  (`Blocks`) and `ArticleClosing`. The hero, body, sources and More essays are its own
  (`src/components/essays/`). The index's sign-up card and closing tile are the Playbooks page's
  (`SubscribeCard`, `ClosingCta`), with the Essays copy; sign-ups name their list.
- The read time is computed from each essay's body on the server, the prototypes' rule (main
  column words / 230, rounded), and the index shows the same figure. The index prototype's
  "6 min read" is the drafts' estimate, which the handoff asks production to recompute.
- The paintings are the playbook washes, byte for byte, so they come from the same WebP sources
  (`src/components/essays/media.ts`).
- Site-wide, as the handoff asks: Essays joins the header nav (seven links, with the design's
  fluid gaps, falling back to a sideways scroll that each page's collapse width keeps out of
  sight), the footer's "Field notes" becomes Essays, and the home page's three field notes link
  to their essays.
- Departures, all deliberate: 20px gutters on phones on the index too (the essay pages have them
  by design; the index prototype keeps 40px at 390); the header's menu below 1000px, as on
  Playbooks; the hero's category opens the index filtered to it; sources open in a new tab;
  tables and the code block scroll inside a focusable box.
- QA: serve the reference on :4111 (`.claude/launch.json`), build and `next start`, then
  `node qa/es-index.mjs --w 1440,1280,1024,768,390` (every section, and each filter),
  `node qa/es-essays.mjs --w 1440,1024,390 [--only 01,13] [--quiet]` (each essay against its
  prototype: page height, read time, every section's pixels and text) and
  `node qa/es-a11y.mjs` (axe, outline, Tab sweep, filter and URL, anchors, copy link, scroll-spy,
  phone bar, overflow, and every page's nav fit at its collapse width).

## Contact page

`/contact` is a port of [`design_handoff_contact/`](design_handoff_contact/README.md) (the
prototype, `Contact.dc.html`, wins over the README). It replaced the Company page, which was never
built: the last nav link on every page is now Contact, `/company` redirects to it, and every
footer's Company column links to the home page's sections plus Contact, with Security on AI
Engineering's platform section (the handoff's "Site-wide changes").

- Copy in `src/content/contact.ts`; the page in `src/app/contact/page.tsx`; the form, the "Built
  on" strip and its pause control in `src/components/contact/`. The strip is a CSS loop at the
  prototype's 32px a second; it holds under the pointer, under the footer's "Pause animations"
  (WCAG 2.2.2, as on Private Credit and AI Engineering) and under reduced motion.
- The form posts to `/api/contact` (`src/app/api/contact/route.ts`), a route handler rather than a
  Server Action so a form left open across a deploy still sends. It checks the origin, size, a
  hidden honeypot field (bots get a success answer and nothing is sent), a per-address rate limit
  (5 per 10 minutes per instance) and the form's own rules (`src/components/contact/enquiry.ts`,
  shared with the form), then delivers. Without script the form still works: the endpoint
  redirects to `/contact#enquiry-sent` or `#enquiry-failed`, which the card shows from CSS.
- **Delivery has to be configured before the form can send in production** (the handoff leaves the
  endpoint, notification address and CRM open). Set, in Vercel's environment variables:
  - `CONTACT_WEBHOOK_URL`: each enquiry POSTed as JSON (a Slack incoming webhook, or Zapier, Make,
    n8n or a CRM's inbound webhook); and/or
  - `RESEND_API_KEY` and `CONTACT_TO` (and `CONTACT_FROM` once a sending domain is verified in
    Resend): each enquiry emailed, Reply-To the sender.

  With neither set, production answers every enquiry with the failure line ("That didn't send.
  Write to hello@3264.ai…"), and development only logs it. See `.env.example` and
  `src/app/api/contact/deliver.ts`.
- QA: serve the reference on :4112 (`.claude/launch.json`), build and `next start` with
  `CONTACT_WEBHOOK_URL` pointing at a stand-in receiver, then `node qa/ct-compare.mjs` (the page
  against the prototype at ten widths: heights, every part's box, text, pixels),
  `node qa/ct-form.mjs --hook-log <file> [--fail-flag <file>]` (the form's states, also against
  the prototype; the endpoint's checks and delivery; without script; `/company`) and
  `node qa/ct-a11y.mjs` (axe in every state, outline, Tab sweep, the direct line's contrast over
  the painting, the strip's speed and pauses, the header, overflow).

## Share metadata

A page that sets `openGraph` replaces the root layout's, and with it the share image that
`src/app/opengraph-image.png` supplies. So pages build their metadata with `pageMetadata` from
`src/app/shared-metadata.ts`, which names the image again with the site name and locale; the X
card follows og:image. `node qa/share-meta.mjs` checks every sitemap page's share card against
the production build on :3100.

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
