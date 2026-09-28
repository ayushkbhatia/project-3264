# Handoff: Loan Ops Ledger playbook page

## Overview
Loan Ops Ledger is one of 3264.ai's nine playbook pages. It's a long-form article about one automation playbook for private credit loan operations: agent notices are matched daily to the loan system, and each break is classed and explained from the credit agreement before month end.

The page does three things:
1. It explains the process today and where it breaks.
2. It shows how the playbook runs, with realistic document vignettes.
3. It explains how the system is engineered and governed, then asks the reader to book a mapping session.

It was the first page built on the template shared by all the playbook pages. The Covenant Watch handoff documents the same template on another page. Build one reusable `PlaybookPage` template plus per-page content and figures.

Route suggestion: `/playbooks/loan-ops-ledger`. Industry: Private Credit.

## About the design files
The files in this bundle are **design references created in HTML**. They are prototypes that show the intended look and behaviour, not production code to copy. Your task is to **recreate this design in the target codebase's existing environment**, using its established framework, component patterns and styling approach. If there is no environment yet, pick the most suitable framework (a static-first React framework such as Next.js or Astro fits this content-heavy page) and implement it there.

`Loan Ops Ledger.dc.html` opens directly in a browser and needs `support.js` next to it. Every style is inline, so you can read exact values straight from the markup. Page logic (scroll-spy, hero reveal, accordion and so on) is the `class Component` script at the bottom of that file.

## Fidelity
**High-fidelity.** Colours, typography, spacing, radii, copy and interactions are final. Recreate them pixel-accurately with the codebase's own primitives. Where these specs and the HTML disagree, the HTML wins.

## Files in this bundle
| File | What it is |
|---|---|
| `Loan Ops Ledger.dc.html` | The page prototype: the source of truth for markup, styles, copy and logic |
| `support.js` | Runtime needed to open the prototype locally |
| `copy-deck.md` | Every visible string in page order, extracted from the prototype, including figure text |
| `assets/` | Watercolour tile images used by figure bands, cards and the closing panel |

Open `Loan Ops Ledger.dc.html` in a browser, served from this folder so the relative `assets/` paths resolve.

---

## Page anatomy

```
┌ Header (sticky, 68px) ─────────────────────────────── progress bar (2px) ┐
│ [mobile only] "On this page" bar (sticky under header, 44px)             │
├──────────────────────── max-width 1048px, centred ────────────────────────┤
│  Sidebar 200px (sticky)  │ gap 88px │  Main column, max-width 680px       │
│  ← All playbooks         │          │  Hero + hero figure                 │
│  On this page (TOC+rail) │          │  01 … 06, Terms, Recently updated,  │
│  CTA card                │          │  Questions                          │
├───────────────────────────────────────────────────────────────────────────┤
│ More playbooks (max-width 1048px)                                         │
│ Closing panel (max-width 968px)                                           │
│ Footer (max-width 1280px, site standard)                                  │
└───────────────────────────────────────────────────────────────────────────┘
```

### Header (site chrome, shared)
- `position: sticky; top: 0; z-index: 100`. Background `rgba(246,245,242,0.78)` with `backdrop-filter: blur(14px)` and a bottom border `1px solid rgba(20,20,18,0.075)`.
- Inner row: max-width 1280px, padding 0 40px, height 68px, flex, `align-items: center`, gap 48px.
- **Logo:** "3264.ai", 19px, weight 500, letter-spacing -0.03em.
- **Nav:** 14px, colour `#55544E`, gap 30px, flex 1. Items: AI Engineering, AI Transformation, Industries, Work, Playbooks (current: `#1A1917`), Company.
- **Header CTA:** "Book an audit", 36px tall, padding 0 16px, `1px solid rgba(20,20,18,0.13)`, radius 6px, white background, 13.5px.
- **Reading progress bar:** absolutely positioned at the header's bottom edge (`bottom: -1px`), full width, 2px tall, `#157F52`. Driven by `transform: scaleX(p)` with `transform-origin: 0 50%`, where `p = scrollY / (documentHeight − viewportHeight)`.

### Layout wrapper
- max-width 1048px, `margin: 0 auto`, padding `0 clamp(20px, 4vw, 40px)`, `box-sizing: border-box`.
- `display: flex; justify-content: center; gap: 88px; align-items: flex-start`.

### Sidebar (viewport ≥ 1048px only)
- `flex: 0 0 200px`, `position: sticky; top: 40px`, `max-height: calc(100vh − 40px)`, `overflow-y: auto`, padding 60px 0 32px.
- **Back link:** "← All playbooks", 13.5px, `#55544E`. Links to the Playbooks index.
- **Label:** "On this page" at margin-top 32px. IBM Plex Mono 10.5px, letter-spacing 0.08em, uppercase, `#6E6D67`.
- **TOC nav:** margin-top 10px, padding-left 12px.
  - **Coverage rail:** a 1.5px track (`#E8E5DF`) runs down the left edge. A 1.5px ink (`#1A1917`) fill grows down it, with `height` transitioning 200ms linear.
- **TOC item:** flex, gap 8px, padding 6px 10px, radius 7px, 13px, line-height 1.3, letter-spacing -0.005em.
  - Number: mono 10.5px, `#6E6D67`, in a 17px column.
  - Active item: background `#EEEBE4`. Items up to and including the active one are ink `#1A1917`; later items are `#6E6D67`.
  - Background and colour transition over 160ms.
- **Sub-items** (only under "05 How it is built", only while it is active, and only when `showBuilt` is on): margin 3px 0 6px 35px, 12px text, padding 4px 0 4px 10px, left border 1px. The active sub is ink with border `#1A1917`; the others are `#6E6D67` with border `#D9D6CF`.
- **Sidebar CTA card:** margin-top 32px, padding 18px, radius 12px, background `#EEEBE4`.
  - Text: "Start with one month of agent notices", 14.5px, line-height 1.4.
  - Button: margin-top 12px, full width, 36px tall, radius 6px, `#1A1917` background, white 12.5px weight 500 text. Label and link come from the `ctaLabel` prop (see Props).

### Mobile "On this page" bar (viewport < 1048px)
- Sticky under the header (`top: 68px; z-index: 90`). Background `rgba(246,245,242,0.94)` with blur(12px) and bottom border `#E8E5DF`. Inner max-width 760px.
- Full-width 44px button containing:
  - "On this page" in mono 10.5px uppercase `#6E6D67`
  - the current section label (13px, ellipsised)
  - "+" or "−" in mono 14px
- Open state: a dropdown panel 48px below the button, inset `clamp(12px, 3vw, 32px)` left and right. Padding 6px, border `#E8E5DF`, radius 12px, background `#FBFAF8`, shadow `0 24px 48px -20px rgba(20,20,18,0.25)`, `max-height: 70vh`, scrollable.
  - Items: 13.5px, padding 8px 10px, radius 8px, same active colours as the sidebar.
  - Clicking an item closes the panel.
- In this mode the "← All playbooks" link moves into the top of the hero (margin-bottom 24px).

### Main column
- `flex: 1 1 auto; min-width: 0; max-width: 680px; padding-top: 60px`.
- Every section: `padding-top: 96px; scroll-margin-top: 120px`. Subsection headings also use `scroll-margin-top: 120px`.

---

## Shared components (exact styles)
These recur throughout the main column and on every playbook page.

| Component | Spec |
|---|---|
| Section eyebrow | IBM Plex Mono 11.5px, `#6E6D67`, e.g. "01 / The work today" |
| Section H2 | margin-top 12px; `clamp(24px, 2.3vw, 30px)`; weight 400; letter-spacing -0.028em; line-height 1.15; `text-wrap: balance`. Terms, Recently updated and Questions have no eyebrow, and their H2 has margin 0 |
| Body paragraph | margin-top 16px; 15.5px / 1.7; `#2C2B27`; `text-wrap: pretty` |
| Subsection H3 | margin-top 48px; 19px / 1.3; weight 500; letter-spacing -0.018em |
| Bullet list | margin-top 14px; padding-left 18px; grid gap 10px; 15px / 1.65; `#2C2B27`. The bold lead-in is weight 500, ink |
| Mono label | IBM Plex Mono 10.5px, letter-spacing 0.07em, uppercase |
| Steps list (§01) | `<ol>` with border-top 1px `#1A1917`. Each row: flex-wrap, gap 4px 20px, padding 14px 0, border-bottom `#E8E5DF`. Left block `flex: 0 0 210px` holds the number (mono 11px `#6E6D67`) and the role (14.5px/1.45 weight 500). Right block: 14.5px/1.6 `#2C2B27` |
| Inputs / Outputs cards | Flex-wrap, gap 16px, margin-top 28px. Each card: `flex: 1 1 280px`, padding 20px 22px, background `#FBFAF8`, border 1px `#E8E5DF`, radius 14px. Mono label, then a list: 13.5px/1.5, gap 6px, padding-left 16px |
| Numbered breaks (§02) | `<ol>` with border-top 1px `#1A1917`. Each row: flex, gap 16px, padding 22px 0, border-bottom `#E8E5DF`. Number column 22px (mono 11.5px `#6E6D67`); H3 17px/1.35 weight 500; paragraph 15px/1.7 margin-top 8px |
| Step table (§03) | 4 columns `minmax(0,.62fr) repeat(3,minmax(0,1fr))`, column gap 22px, when main width ≥ 600. Header row: 11.5px weight 500 `#55544E`, border-bottom 1px ink. Rows: padding 13px 0, border-bottom `#E8E5DF`, 13.5px/1.55. Below 600 the table stacks into one column and each cell gets its lane label on top (11.5px weight 500 `#6E6D67`). Empty cells show "—" in `#8A887F` |
| Callout ("What is never automated") | margin-top 32px; padding 18px 20px; radius 14px; background `#FBFAF8`; border `#E8E5DF`; mono label; paragraph 14.5px/1.65 |
| Hard / We pairs (§05) | Container border-top 1px ink. Each pair: flex-wrap, gap 8px 28px, padding 16px 0, border-bottom `#E8E5DF`. Two columns `flex: 1 1 260px`, each a mono label ("Hard" in `#6E6D67`, "We" in ink) over 14px/1.6 text |
| "Kept for every run" grid | `repeat(auto-fit, minmax(min(100%,280px),1fr))`, column gap 28px. Each item: flex, gap 12px, padding 10px 0, border-top `#E8E5DF`; number "01"… in mono 10.5px; text 14px/1.5 |
| Rules strip (§06) | Status line: 6px ink dot plus "Status as of 28 September 2026", mono 11px `#55544E`. List with border-top 1px ink. Rows: flex-wrap, gap 4px 24px, padding 14px 0. Date column 96px (mono 11.5px); title 14.5px/1.4 weight 500; description 14px/1.6 `#55544E` |
| Terms | `<dl>` with border-top 1px ink. Rows: flex-wrap, gap 3px 24px, padding 13px 0, border-bottom `#E8E5DF`. `dt` is `flex: 0 0 200px`, 14px weight 500; `dd` is 14px/1.6 `#55544E` |
| FAQ accordion | Border-top 1px ink. Question button: full width, padding 16px 0, 15.5px/1.4, letter-spacing -0.012em, "+" or "−" in mono 15px `#55544E`, hover colour `#157F52`. Answer: 14.5px/1.7, padding-bottom 18px |
| Mid-page CTA band (end of §04) | margin-top 44px; padding 22px 24px; radius 16px; background `#1A1917`; text `#F4F3F0`. Title 18px/1.3; sub-line 13.5px/1.55 `rgba(244,243,240,0.8)`. Button 40px tall, padding 0 18px, `#F4F3F0` background, ink 13.5px weight 500 text, radius 6px, hover `#FFFFFF` |
| Related-page card ("How we build" → AI Engineering) | Flex-wrap, gap 16px 22px, padding 14px, border `#E8E5DF`, radius 16px, background `#FBFAF8`, hover border `rgba(20,20,18,0.3)`. 164×88 thumbnail (radius 11px) with glass icon badge; small label 12px `#6E6D67`; title 16px; text 13.5px; trailing link 13px with 1px underline |
| Primary button | 40px tall, padding 0 18px, `#1A1917` background, white 13.5px weight 500 text, letter-spacing -0.005em, radius 6px |
| Secondary button | Same size, white background, border `1px solid rgba(20,20,18,0.13)`, ink text |

### Figure frame (used by every infographic)
Each figure is a `<figure>` with margin-top 28–36px, built in these layers:
1. **Band:** radius 16px, padding 12px, border `1px solid rgba(20,20,18,0.06)`. Background is a watercolour tile (`assets/playbooks/*.png`, cover, centre) under a paper veil `linear-gradient(rgba(251,250,248,v), rgba(251,250,248,v))`, with v between 0.66 and 0.76 (per figure, see below).
2. **Band head:** flex-wrap, `justify-content: space-between`, gap 4px 20px, padding 4px 6px 10px.
   - Left: mono label in ink.
   - Right (optional): mono 11px/1.6 `#2C2B27` (entity, document, version).
3. **Sheet:** padding 16px, radius 11px, background `rgba(255,255,255,0.93)`, shadow `0 12px 32px -20px rgba(20,20,18,0.3)`.
   - Optional sheet title: 16.5px weight 500, letter-spacing -0.016em.
4. **Evidence line** (below the band): margin-top 16px, padding-top 12px, border-top 1px `#1A1917`, mono 11.5px/1.7 ink, `overflow-wrap: anywhere`.
5. **Moment sentence:** 15px/1.5 `#55544E`, margin-top 8px.
6. **Caption:** `<figcaption>`, 12px/1.5 `#6E6D67`, margin-top 8px.

Table conventions inside sheets:
- Header row: grid, column gap 12px, padding 0 8px 7px, border-bottom 1px ink, 10.5px `#55544E`. Numeric headers are right-aligned.
- Body rows: padding 9px 8px, hairline `#E8E5DF`.
- Figures and identifiers: IBM Plex Mono 11.5px, right-aligned for numbers.
- Status dots: 7px circles, green `#157F52` or red `#C4341E`.
- The single "moment" row gets the red wash `#F6E3DF`.
- Red and green are used for status only.

---

## Sections (top to bottom)
Verbatim copy for every section is in `copy-deck.md`.

### Hero (`#top`)
- **Eyebrow:** "Playbook · Private Credit", 13px `#55544E`. "Private Credit" links to the Private Credit industry page, with a 1px underline `rgba(20,20,18,0.25)`.
- **H1:** "Loan Ops Ledger", margin-top 14px, `clamp(34px, 3.8vw, 48px)`, weight 400, letter-spacing -0.038em, line-height 1.02.
- **One-liner:** "Agent notices matched daily to the loan system, each break classed and explained from the credit agreement before month end." Margin-top 16px, `clamp(16.5px, 1.4vw, 18.5px)`, line-height 1.45, `#55544E`.
- **Meta row:** margin-top 22px, padding-top 12px, border-top `#E8E5DF`, 12.5px `#6E6D67`, flex-wrap, gap 6px 16px.
  - "Reviewed 28 September 2026"
  - "N min read" (computed; see Behaviour)
  - "Copy link" button, pushed right with `margin-left: auto`, ink text
- **Standfirst:** margin-top 26px, 16px/1.7 `#2C2B27`.
- **CTAs:** margin-top 24px, gap 10px. Primary "Book a mapping session"; secondary "See how it is built" (links to `#built`).
- **Hero figure:** see F1.

### 01 The work today (`#today`)
Eyebrow, H2, intro, numbered steps, then the Inputs and Outputs cards.

### 02 Where it breaks (`#breaks`)
Eyebrow, H2, numbered breaks, then **F2** "Same loan, two day counts", then a related-page card linking to the Private Credit platform page.

### 03 How it runs (`#runs`)
Eyebrow, H2, intro, then:
- the step table (Step · The model reads or drafts · Code computes or decides · A person signs)
- **F3** daily match
- the "What is never automated" callout

### 04 The evidence (`#evidence`)
Eyebrow, H2, body, **F4** evidence line breakdown, then the "Kept for every run" grid and the dark mid-page CTA band.

### 05 How it is built (`#built`)
Eyebrow, H2 and intro, then **F5** model / code / person. Then five subsections with anchors:
- `#built-harness`: bullets, then **F6** harness anatomy
- `#built-data`: bullets
- `#built-hard`: Hard / We pairs
- `#built-evals`: bullets, then **F7** pass^k
- `#built-controls`: bullets, then **F8** injection containment

The section ends with the "How we build → AI Engineering" card.

With `showBuilt = false`, the section shows only its eyebrow and the AI Engineering card, and the TOC hides the sub-items.

### 06 Rules (`#rules`)
Eyebrow, H2, "Status as of 28 September 2026" line, then dated rule rows.

### Terms (`#terms`), Recently updated (`#updated`), Questions (`#questions`)
- Terms: H2, then the `<dl>`.
- Recently updated: H2, then rows.
- Questions: H2, then a six-item accordion with the first item open, then **F9** engagement lifecycle.

### More playbooks (after main)
- Container: max-width 1048px, padding `120px clamp(20px,4vw,40px) 0`.
- Heading row: H2 "More playbooks" with "All nine playbooks →" on the right.
- Cards: Covenant Watch, Capital Call Flow and NAV Pack Review, each linking to its page. Card and glass-badge specs are the same as in the Covenant Watch handoff.

### Closing
Same panel spec as the Covenant Watch handoff:
- H2: "Start with one month of agent notices"
- Line: "Bring a month of notices and the breaks you already know about. We will show you where the time goes and whether this is worth building."
- Button: "Book a mapping session"

### Footer
Site-standard footer, the same as the Playbooks page.

---

## Figures
All data is fictional: Larkspur Credit Opportunities Fund II, with borrowers including Penrose Vale Software. Rates marked * are illustrative, not published fixings. Every figure uses the figure frame above. Exact strings are in `copy-deck.md`.

### F1 Hero: a break explained (PIK toggle)
- **Band:** `loan-ops-ledger.png`.
- **Head:** "A break explained · PIK toggle". Right: "Larkspur Credit Opportunities Fund II · Penrose Vale Software TL · IPD 30 Jun 2026".
- **Agent notice panel:** "Interest payment notice"; from, ref and received lines in mono; then the fields, with mono values:

  | Field | Value |
  |---|---|
  | Borrower | Penrose Vale Software |
  | Facility | Term Loan · PVS-TL1 |
  | Interest period | 31 Mar – 30 Jun 2026 |
  | Days · basis | 91 · ACT/360 |
  | Term SOFR 3M* | 4.3125% |
  | Margin | 5.2500% |
  | All-in rate | 9.5625% |
  | Principal | 24,750,000.00 |
  | Interest Amount | 598,253.91 |
  | Paid in cash | 299,126.96 |
  | PIK capitalised (50%) | 299,126.95 |
  | New principal | 25,049,126.95 |

  - Fields are in a 4-column grid when main width ≥ 560, and 2 columns below that.
  - Below 500 the full notice collapses behind a "Show full notice" / "Hide full notice" toggle.
- **Ledger panel:** "Two breaks, one cause" · Line · Loan system · Agent notice · Difference.
  - Rows: Cash due 30 Jun 2026: 598,253.91 / 299,126.96 / **−299,126.95** (red). Principal after 30 Jun 2026: 24,750,000.00 / 25,049,126.95 / **+299,126.95** (red). Net across the two legs: 0.00.
  - Table when main width ≥ 500; stacked cards (System / Agent / Difference) below.
- **Break class chip:** "Break class · PIK toggle", pill with 1px ink outline, mono. Next to it: "PIK Election dated 12 Jun 2026, at least 10 business days before the 30 Jun payment date; 50% elected, within the 75% cap. Clause §3.02(ii)."
- **Calculation box:** `#EEEBE4`, radius 10–12px, mono.
  - 24,750,000.00 × 9.5625% × 91/360 = 598,253.90625 → 598,253.91
  - PIK 50% = 299,126.953… → 299,126.95
  - Cash = 598,253.91 − 299,126.95 = 299,126.96
- **Status lines:**
  - "Fund facility: Partial PIK concentration 7.8% → 9.9% of the 10.0% limit · flagged to fund controller"
  - A status dot plus "Explained · agent figure accepted · PIK capitalisation booked by loan operations analyst"
- **Below the band:** evidence line, moment sentence ("The borrower elected to pay half the interest in kind; the loan system still expected cash."), caption.
- **Reveal animation:** runs once, triggered when the figure's top enters the upper two-thirds of the viewport.
  - Step 1 at 400ms: a 1.5px ink ring fades in around the notice's Interest Amount 598,253.91 (`box-shadow`, 500ms).
  - Step 2 at 1050ms: the two red differences fade in (450ms).
  - Step 3 at 1700ms: the break-class chip and calculation fade in and rise 6px (450ms).
  - Step 4 at 2350ms: the status dot turns from red `#C4341E` to green `#157F52`.
  - Safety: force the final state if the reveal hasn't started within 4s of mount, and show it immediately under `prefers-reduced-motion` or when `animateHero = false`.

### F2 Same loan, two day counts (in §02)
- **Band:** `capital-call-flow.png`.
- **Head:** "Same loan, two day counts · Penrose Vale Software TL · 31 Mar – 30 Jun 2026".
- **Table:** Check · Inputs · Result.
  - Interest at ACT/360: 24,750,000.00 × 9.5625% × 91/360 = 598,253.91
  - Interest at ACT/365: 24,750,000.00 × 9.5625% × 91/365 = 590,058.65
  - Difference: **8,195.26** (red)
  - Agreement basis, §1.01 "Interest computations" (fictional): "360-day year, actual days", giving **ACT/360 applies** (green)
- **Grid:** 3 columns when main width ≥ 520; below that, Inputs moves under the check.
- **Moment:** "Same loan, same rate, same days. The basis changes the number."

### F3 Daily match (in §03)
- **Band:** `feat-capital-call-flow.png`.
- **Head:** "Daily match · agent notices vs loan system". Right: "Larkspur Credit Opportunities Fund II · 23 Jun 2026 · 6 of 42 notices".
- **Rows:** six rows from `G2` (see `copy-deck.md`): borrower · facility · received time; event and detail; agent notice; loan system; difference; status with break class and owner.
  - Three rows match (green).
  - Three are breaks with red differences: an Oakmere Dental ticking-fee day-count break (+222.22, query to agent), a Norland Aero paydown timing break (−1,200,000.00, awaiting cash) and a Penrose Vale PIK toggle break (−299,126.95, booked).
- **Layout:** table when main width ≥ 600, one card per notice below.
- **Footer:** "42 received · 39 matched · 3 breaks, each classed and owned", then the day-count evidence line.
- **Moment:** "Three breaks, three different causes; the agent's figure stands until the agent answers the query."

### F4 Evidence line breakdown (in §04)
- **Band:** `covenant-watch.png`.
- **Content:** the full line (AGT-PVS-TL1-20260623.pdf · v1 · p.1 "Interest Amount" → 598,253.91 → recompute … → explained · PIK toggle → loan operations analyst · 2026-06-23 11:42 ET), then eight labelled rows: Source, Version, Locator, Value, Test, Status, Approver, Timestamp.
- **Hover:** hovering a row highlights its segment in the line (`#F1E6CF`) and turns that row's label ink.

### F5 How it is built: model / code / person (in §05)
- **Band:** `client-reporting-flow.png`.
- **Head:** "How it is built · model / code / person". Right: "loan_ops_ledger · one notice, seven steps".
- **Grid:** seven steps as rows (Intake, Read, Match, Recompute, Class, Investigate, Book) and three lane columns: Model (reads, drafts, proposes) · Code (computes, compares, routes) · Person (signs, books, pays).
  - Lane cells are rounded boxes. A dashed border means a model proposal; "—" means the lane is empty.
  - Hovering a row tints it `#F1EEE8` and darkens its label.
  - Grid when main width ≥ 540; stacked step cards below.
- **Below the grid:**
  - "In (untrusted until checked)" and "Out" panels.
  - The tool-tier note: "Model tools: read · propose. Execute tier … is not exposed to the model."
  - The day's run strip: "23 Jun 2026 · received 42 → parsed 42 → matched 39 · break 3 → explained 3 → booked 1 · query to agent 1 · awaiting cash 1 → run records 42".
- **Moment:** "The model never decides what is booked or paid; it proposes, and code and people check."

### F6 Harness anatomy (in `#built-harness`)
- **Band:** `feat-side-letter-register.png`.
- **Layout:** shared figure; wide layout when main width ≥ 600, stacked list below.

### F7 Consistency across repeated runs (in `#built-evals`)
- **Band:** `feat-nav-pack-review.png`.
- **Chart:** an inline SVG. pass^k falls to 0.60 and pass@k reaches about 1.00, at a 0.95 per-run success rate. The caption says the maths is illustrative.

### F8 Injection containment (in `#built-controls`)
- **Band:** `mandate-guardrails.png`.
- **Pipeline:** Agent notice → quarantined reader (no tools · no egress) → typed record → validators → engine, then review.
- **Red-team case:** white text on page 2 tries to redirect a payment. The instruction is flagged and the bank details are unchanged.

### F9 How an engagement runs (in `#questions`)
- **Band:** `loan-ops-ledger.png`.
- **Layout:** Assess · Build (R1–R6, shadow run) · Run, with the green acceptance rule. Wide layout when main width ≥ 600, stacked below.

---

## Interactions & behaviour
- **Scroll-spy, coverage rail, progress bar, anchor scrolling, "Copy link", read time, mobile TOC, FAQ accordion and hover states:** identical to the Covenant Watch handoff (see its "Interactions & behaviour").
  - Activation line: `min(170px, 30% of viewport)`.
  - Read time: words excluding figures ÷ 230.
  - "Link copied" shows for 1.8s.
- **Hero reveal:** see F1. Use IntersectionObserver with `threshold: 0` and `rootMargin: "0px 0px -35% 0px"`, run it once, and apply the 4s safety.
- **Notice toggle (F1):** below 500px main width the agent notice's full field list is hidden behind "Show full notice" / "Hide full notice".
- **F5 row hover:** mouseenter on a step row sets `g3h`, which tints that row `#F1EEE8`; mouseleave clears it.
- **Evidence hover (F4):** described above.
- **Responsive thresholds:** the sidebar needs viewport ≥ 1048px. Figures respond to the **main column width**, measured with ResizeObserver:

| Main width | Effect |
|---|---|
| ≥ 500 | F1 ledger table, full notice |
| ≥ 520 | F2 three columns |
| ≥ 540 | F5 grid |
| ≥ 560 | F1 notice in 4 columns |
| ≥ 600 | Step table grid, F3 table, F6 and F9 wide layouts |

- **No horizontal scrolling at any width.** Mono strings use `overflow-wrap: anywhere`.

## State
| State | Type | Purpose |
|---|---|---|
| `vw`, `mw` | number | Viewport width and main-column width |
| `act`, `sub` | string | Active section id and active `#built` sub-id |
| `g1` | 0–4 | Hero reveal step (default 4, the final state) |
| `notice` | bool | Full agent notice shown on narrow screens |
| `mini` | bool | Mobile TOC open |
| `fq[6]` | bool[] | FAQ open flags (first open) |
| `g3h` | −1…6 | Hovered F5 row |
| `ev` | −1…7 | Hovered evidence part |
| `copied` | bool | "Link copied" flash |
| `readMin` | number | Computed read time |

All content is static; there is no data fetching.

## Props / feature flags
| Prop | Values | Effect |
|---|---|---|
| `ctaLabel` | "Book a mapping session" (default) · "Book a two-week audit" | Label for every page CTA. Mapping session links to `mailto:hello@3264.ai?subject=Loan%20Ops%20Ledger`; two-week audit links to the AI Engineering page `#engagement`. Replace with a booking URL when one exists |
| `showBuilt` | true (default) | false collapses §05 to a link card and hides its TOC sub-items |
| `animateHero` | true (default) | false shows F1 in its final state |

## Design tokens
**Colour**

| Token | Hex | Use |
|---|---|---|
| paper | `#F6F5F2` | Page background |
| ink | `#1A1917` | Text, rules, primary buttons |
| ink-2 | `#2C2B27` | Body text |
| secondary | `#55544E` | Secondary text |
| muted | `#6E6D67` | Labels, captions |
| faint | `#8A887F` | Empty cells, carve-outs |
| rule | `#D9D6CF` | Borders |
| rule-2 | `#E8E5DF` | Hairlines |
| tile | `#FBFAF8` | Cards, callouts |
| wash | `#EEEBE4` | Active TOC item, sidebar card |
| highlight | `#F1E6CF` | Evidence hover |
| accent / green | `#157F52` | Status dots, links on hover, progress bar |
| green-bg | `#E4F0EA` | Green status background |
| red | `#C4341E` | Status only |
| red-bg | `#F6E3DF` | Moment row wash |
| line | `rgba(20,20,18,0.13)` | Borders |
| line-2 | `rgba(20,20,18,0.075)` | Borders |

**Type**
- Instrument Sans at 400, 500 and 600, plus 400 italic. Fallback "Helvetica Neue", Helvetica, sans-serif.
- IBM Plex Mono at 400 and 500 for every figure, identifier, date and label.
- Antialiased, `text-rendering: optimizeLegibility`.
- Scale:
  - H1 34–48px
  - H2 24–30px
  - H3 19px
  - Body 15.5px
  - UI 13–14.5px
  - Figure text 11–13px
  - Labels 10.5–11.5px

**Radii**

| Element | Radius |
|---|---|
| Figure band | 16px |
| Sheet | 11px |
| Cards, callouts | 14–16px |
| Closing panel | 18px |
| TOC items | 7–8px |
| Buttons | 6px |
| Pills | 999px |

**Shadows**
- Sheet: `0 12px 32px -20px rgba(20,20,18,.3)`
- Dropdown: `0 24px 48px -20px rgba(20,20,18,.25)`
- Glass badge: `inset 0 1px 0 rgba(255,255,255,.85), 0 18px 40px -16px rgba(20,20,18,.38)`

**Spacing:** section rhythm 96px; subsection 48px; figure top margin 28–36px; paragraph 16px; list gaps 6–10px.

## Assets
All images are watercolour washes created for 3264.ai and sit in `assets/`.
- `assets/playbooks/*.png`: figure band backgrounds and More playbooks tiles.
- `assets/valley-pastel.png`: the closing panel.

Icons are inline monoline SVGs (48×48 viewBox, stroke 2, round caps and joins), copied from the Playbooks icon set. There are no icon fonts and no external images.

## Content rules
- Every name, identifier and figure in the graphics is fictional. Rates marked * are illustrative, not published fixings. Keep "Fictional data" in captions.
- The agent's register stays the record of ownership, and analysts decide what is booked. The model proposes; code and people check.
- Don't write "AI-powered", "real-time", "autonomous" or "100% accurate".
- Before launch, run a name check on Larkspur, Penrose Vale, Oakmere Dental, Norland Aero, Tallis Brook, Brisbane Lane and Pellam against Companies House, EDGAR/IAPD and trademarks.

## Open items for 3264
- A real booking URL to replace the mailto link.
- Confirm that PIK elections as their own break class are shipped, since "Recently updated" says they are.
- Confirm the final routes for the Private Credit page and the other playbooks.
