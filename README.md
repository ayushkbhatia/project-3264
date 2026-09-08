# project-3264

Next.js 16 (App Router) + TypeScript + Tailwind 4. Deployed on Vercel.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

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
