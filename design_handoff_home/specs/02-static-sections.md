# Spec 02 — Static sections

Server components, no JS. Put all copy in `src/content/home.ts` as data and map over it.
The copy below is final and must be set verbatim, except where marked placeholder.

---

## Engagement model — `#model`

Section standard. Column: flex, `gap: 72px`, wrap (no align-end).

**Left** `flex: 1 1 280px`: Eyebrow `01 / The model`; h2 `You pay for what reaches production.`;
p (16.5/1.6/--sec, `margin-top: 20px`, max-w 400):
`Consulting bills attention. We bill delivery. The commercial terms are written so that a feature nobody uses costs us, not you.`

**Right** `flex: 2 1 540px`: four rows. Each row `border-top: 1px solid var(--line); padding: 26px 0; display: flex; gap: 40px; flex-wrap: wrap`.
Last row also `border-bottom: 1px solid var(--line)`.
Label `flex: 1 1 180px; 15px; -0.01em; --mut`. Value `flex: 3 1 340px; 17px/1.5; --ink-2`.

| Label | Value |
| --- | --- |
| Scope | Defined in a two-week diagnostic and frozen. Change requests are priced, never absorbed silently. |
| Price | Per delivered capability, invoiced on acceptance. No timesheets, no rate cards, no bench. |
| Proof | Cycle time, error rate and cost per file are measured before build and reported monthly after. |
| Exit | Source, prompts, evaluation sets and runbooks are yours from day one. Nothing is held hostage. |

---

## Industries — `#industries`

SectionHeader: `03 / Industries` · `Four sectors. The same bottleneck.` ·
`Every mandate we take on runs on documents that people read, summarise and re-key. That is the work we remove first, because it is measurable and it is where the risk sits.`

List `margin-top: 64px`. Each row is an `<a>`: `display: flex; gap: 48px; flex-wrap: wrap; align-items: baseline; border-top: 1px solid var(--line); padding: 34px 0`. Last row adds a bottom border. Hover: `border-color: var(--a)`.
- Left `flex: 1 1 260px; display: flex; gap: 18px; align-items: baseline`: code (13px/--mut), h3 (industry h3).
- Middle `flex: 2 1 360px`: `16px/1.55/--sec`.
- Right `flex: 0 0 auto; margin-left: auto`: `→` 14px/--mut.

| Code | Name | Description | Link |
| --- | --- | --- | --- |
| R1 | Private Credit | Loan origination and management, covenant testing, borrower monitoring, investor reporting and fund facility compliance. | `/industries/private-credit` |
| R2 | Financial Services | Credit memos, KYC and onboarding files, model lifecycle documentation, complaints triage and regulatory response. | `#industries` |
| R3 | Fund Management | LP reporting cycles, capital calls and distributions, portfolio monitoring, side-letter obligations and data-room diligence. | `#industries` |
| R4 | Asset Management | Research synthesis, mandate and guideline compliance, RFP and DDQ response, client reporting and attribution commentary. | `#industries` |

Note: with `border-color` on hover, the *whole* row box's borders change. For rows 1–3 only the
top is drawn, so only the top turns accent. On R4 the bottom border also turns accent. That
matches the reference.

---

## Selected engagements — `#work`

SectionHeader: `04 / Selected engagements` · `Measured against the week before we arrived.` ·
`Client names are withheld under mandate. Each engagement below reports the baseline we instrumented at the diagnostic stage and the figure at the third monthly review.`

HairlineGrid `repeat(auto-fit, minmax(340px, 1fr))`, `margin-top: 60px`. Cards `#FFF`, `padding: 36px 32px 40px`.
Card: eyebrow · h3 (case h3, `margin-top: 24px`) · p (15.5/1.58/--sec, `margin-top: 16px`) ·
rows block `margin-top: 30px`. Row: flex space-between baseline, `gap: 20px`,
`border-top: 1px solid var(--line2); padding: 13px 0`. Label `14px/--list`; value `14.5px`, tabular, `--ink`,
**third value in `--a`**.

**Card 1** — `Fund management · Private markets` · `Quarterly LP reporting for a $500MM growth fund` ·
`Portfolio data arrived as 90-odd spreadsheets and PDF updates. We built extraction into the fund's own warehouse, with analyst review on every figure before it reaches an LP letter.`
Rows: Reporting cycle `11 days → 2 days` · Companies monitored `94, continuously` · Figures re-keyed by hand `None`

**Card 2** — `Financial services · Commercial bank` · `Credit memo preparation across a $6.4B book` ·
`Every figure extracted with a citation back to the page it came from. Credit officers review exceptions only; the audit trail satisfied the bank's internal model risk function without amendment.`
Rows: Time per memo `6 hrs → 40 min` · Memos prepared `1,240` · Field-level citations `100%`

Note under grid (placeholder note style, `margin-top: 22px`):
`Placeholder figures — structure is correct, numbers to be replaced with signed-off engagement data.`

---

## Stack (no id)

Section `padding: 74px 40px`. Label `Built on` (eyebrow style, no number).
Grid `repeat(5, minmax(0,1fr))`, `gap: 14px 20px`, `align-items: center`, `margin-top: 30px`.
Nine `<img>`, `width: 100%; height: 50px; object-fit: contain; opacity: 0.78`. Use `next/image`
with explicit dimensions and `unoptimized` if the PNGs are already small.

Order and alt text: Anthropic, OpenAI, Amazon Web Services, Vercel, Supabase, LangChain,
LangGraph, n8n, Cursor (`brand4.png`, so rename the file to `cursor.png` in the port).

---

## Team — `#company`

SectionHeader: `05 / Who we are` · `Engineers who have carried a pager.` ·
`The people who scope the work are the people who build it. No account layer, no offshore handoff, no partner you meet once at the pitch.`

Grid `repeat(auto-fit, minmax(168px, 1fr))`, `gap: 28px`, `margin-top: 60px`. Each:
- Portrait placeholder: `aspect-ratio: 4/5; border: 1px solid var(--line)`;
  `background-image: repeating-linear-gradient(45deg, rgba(20,20,18,0.06) 0 1px, transparent 1px 9px)`;
  flex, `align-items: flex-end; padding: 16px`; label `portrait` 12.5px/-0.005em/--mut.
- Role `17px/-0.02em`, `margin-top: 16px`. Discipline `14px/--mut`, `margin-top: 5px`.

| Role | Discipline |
| --- | --- |
| Managing Partner | AI & Engineering |
| Managing Partner | Delivery & Operations |
| Advisor | Product & Applied AI |
| Advisor | Capital Markets |

Note (`margin-top: 24px`): `Names, photographs and biographies to be supplied.` **All placeholder.**

---

## Playbooks — `#playbooks`

Column flex, `gap: 72px`, wrap. Left `flex: 1 1 280px`: `06 / Playbooks` · `What we have learned, written down.`
Right `flex: 2 1 540px`: three `<a>` rows, `display: block; border-top: 1px solid var(--line); padding: 26px 0`,
last also bottom border, hover `border-color: var(--a)`. Eyebrow then title (20px/-0.024em, `margin-top: 12px`).

| Eyebrow | Title |
| --- | --- |
| Playbook · 12 pages | Instrumenting a workflow before you automate it |
| Note | Why document extraction pilots stall at 80% accuracy |
| Note | A procurement checklist for AI vendors, from the build side |

All link to `#playbooks` for now.

---

## Closing CTA — `#contact`

Section `position: relative; padding: 150px 40px 160px; overflow: hidden`. GridTexture (closing variant) behind.
Column `position: relative`.
- h2 (closing) `The advantage compounds from the day it ships.`
- Row `display: flex; gap: 56px; flex-wrap: wrap; align-items: flex-end; margin-top: 44px`:
  p `flex: 1 1 420px; max-width: 480px` (closing standfirst):
  `Thirty minutes, one workflow, no deck. We will tell you whether it is worth building and what it would cost before you commit to anything.`
  and Primary large button `Book a mapping session`.
