# Content: every string on the Playbooks page (verbatim)

Do not rewrite, shorten or "improve" any text. Curly quotes (“ ”), arrows (→ ← →) and the middle dot are deliberate. Playbook names and one-liners are in `data/playbooks.json` and must match it exactly.

## Meta
- `<title>`: 3264.ai — Playbooks
- Suggested meta description (new, for review): "Nine automation playbooks for private credit, fund management and asset management teams, each drawn from a workflow we have shipped."

## Header
- 3264.ai · AI Engineering · AI Transformation · Industries · Work · Playbooks · Company · Book an audit

## Hero
- H1: Every workflow we have shipped,⏎drawn so you can start from it.  (⏎ = `<br/>`)
- Buttons: Browse the library · Book a two-week audit

## Library bar
- Chips: All · Private Credit · Fund Management · Asset Management
- Search placeholder and aria-label: Search playbooks

## Featured carousel
- Per slide: {category} · {playbook name} · {one-liner} · button "Read the playbook"
- Segment aria-label: Show {playbook name}
- Arrow aria-labels: Previous playbook · Next playbook
- Production additions: Pause carousel / Play carousel (aria-labels of the new toggle)

## CTA cards
- Subscribe title: Get new playbooks as they ship
- Subscribe body: One email when a playbook is published or revised. Nothing else.
- Input placeholder and aria-label: Work email
- Button: Subscribe
- Success: You are on the list.
- Production additions (new, for review): Subscribing… · Enter a work email address. · Couldn't subscribe. Try again in a minute.
- Platform title: See three playbooks on one platform
- Platform body: Covenant Watch, Capital Call Flow and Loan Ops Ledger, running on the same record for a private credit fund.
- Platform link: See the Private Credit platform →

## Category rows
- H2s: Private Credit · Fund Management · Asset Management
- Links: How we work in Private Credit → · How we work in Fund Management → · How we work in Asset Management →
- Cards: playbook name + one-liner (data file)

## Recently updated
- H2: Recently updated
- Rows: see `data/playbooks.json` → `recentlyUpdated` (placeholder)

## Results (filtering)
- Label pattern: "{n} playbook" / "{n} playbooks", + " in {Category}" if a chip is active, + " matching “{query}”" if the search is non-empty
- Button: Clear
- Empty state: No playbook matches that search. Try a process name, such as covenant, capital call or NAV.

## Closing
- Label: Start
- H2: Pick the nearest playbook.⏎A two-week audit matches your process to one of the nine.
- Body: We price the build against the baseline the audit measures. If none of the nine fits, you leave with a ranked use-case ledger and no obligation to continue.
- Button: Book a two-week audit

## Footer
- Services: AI Engineering · AI Transformation · Deployment & Run · Evaluation suites
- Industries: Private Credit · Private Equity · Fund Management · Asset Management
- Company: Who we are · How we work · Case studies
- Resources: Playbooks · Field notes · Security
- Connect: Book a call · hello@3264.ai · LinkedIn
- Bottom: 3264.ai · © 2026 Bearing Deployment Company Inc. All rights reserved. · All systems operational
