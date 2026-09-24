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
