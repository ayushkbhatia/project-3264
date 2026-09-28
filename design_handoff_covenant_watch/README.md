# Handoff: Covenant Watch playbook page

## Overview
Covenant Watch is one of 3264.ai's nine playbook pages. It's a long-form article about one automation playbook for private credit teams: borrower compliance certificates are recomputed from the credit agreement's own definitions, and headroom, add-back caps and cure rights are tracked every test date.

The page does three things:
1. It explains the process today and where it breaks.
2. It shows how the playbook runs, with realistic document vignettes.
3. It explains how the system is engineered and governed, then asks the reader to book a mapping session.

The page uses a template shared by all the playbook pages: Loan Ops Ledger, Capital Call Flow, NAV Pack Review, Investor Reporting and Side-Letter Register. Build it as one reusable `PlaybookPage` template plus per-page content and figures.

Route suggestion: `/playbooks/covenant-watch`. Industry: Private Credit.

## About the design files
The files in this bundle are **design references created in HTML**. They are prototypes that show the intended look and behaviour, not production code to copy. Your task is to **recreate this design in the target codebase's existing environment**, using its established framework, component patterns and styling approach. If there is no environment yet, pick the most suitable framework (a static-first React framework such as Next.js or Astro fits this content-heavy page) and implement it there.

`Covenant Watch.dc.html` opens directly in a browser and needs `support.js` next to it. Every style is inline, so you can read exact values straight from the markup. Page logic (scroll-spy, hero reveal, accordion and so on) is the `class Component` script at the bottom of that file.

## Fidelity
**High-fidelity.** Colours, typography, spacing, radii, copy and interactions are final. Recreate them pixel-accurately with the codebase's own primitives. Where these specs and the HTML disagree, the HTML wins.

## Files in this bundle
| File | What it is |
|---|---|
| `Covenant Watch.dc.html` | The page prototype: the source of truth for markup, styles, copy and logic |
| `support.js` | Runtime needed to open the prototype locally |
| `copy-deck.md` | Every visible string in page order, extracted from the prototype, including figure text |
| `assets/` | Watercolour tile images used by figure bands, cards and the closing panel |

Open `Covenant Watch.dc.html` in a browser, served from this folder so the relative `assets/` paths resolve.

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
  - Text: "Bring one agreement and its latest certificate", 14.5px, line-height 1.4.
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
- **H1:** "Covenant Watch", margin-top 14px, `clamp(34px, 3.8vw, 48px)`, weight 400, letter-spacing -0.038em, line-height 1.02.
- **One-liner:** margin-top 16px, `clamp(16.5px, 1.4vw, 18.5px)`, line-height 1.45, `#55544E`.
- **Meta row:** margin-top 22px, padding-top 12px, border-top `#E8E5DF`, 12.5px `#6E6D67`, flex-wrap, gap 6px 16px.
  - "Reviewed 28 September 2026"
  - "N min read" (computed; see Behaviour)
  - "Copy link" button, pushed right with `margin-left: auto`, ink text
- **Standfirst:** margin-top 26px, 16px/1.7 `#2C2B27`.
- **CTAs:** margin-top 24px, gap 10px. Primary "Book a mapping session"; secondary "See how it is built" (links to `#built`).
- **Hero figure:** see F1.

### 01 The work today (`#today`)
Eyebrow, H2, intro, six-step list, then the Inputs and Outputs cards.

### 02 Where it breaks (`#breaks`)
Eyebrow, H2, four numbered breaks, then a related-page card linking to the Private Credit platform page.

### 03 How it runs (`#runs`)
Eyebrow, H2, intro, then:
- the step table (Step · The model reads or drafts · Code computes or decides · A person signs)
- **F2** cure eligibility
- the "What is never automated" callout

### 04 The evidence (`#evidence`)
Eyebrow, H2, body, then:
- **F3** evidence line breakdown
- "Kept for every run" grid
- **F4** evidence bundle
- dark mid-page CTA band

### 05 How it is built (`#built`)
Eyebrow, H2 and intro, then **F5** definition trace. Then five subsections with anchors:
- `#built-harness`: bullets, then **F6** harness anatomy
- `#built-data`: bullets
- `#built-hard`: Hard / We pairs
- `#built-evals`: bullets, then **F7** review routing, **F8** pass^k and **F9** engagement lifecycle
- `#built-controls`: bullets, then **F10** injection containment

The section ends with the "How we build → AI Engineering" card.

With `showBuilt = false`, the section shows only its eyebrow and the AI Engineering card, and the TOC hides the sub-items.

### 06 Rules (`#rules`)
Eyebrow, H2, "Status as of 28 September 2026" line, then dated rule rows.

### Terms (`#terms`), Recently updated (`#updated`), Questions (`#questions`)
- Terms: H2, then the `<dl>` described above.
- Recently updated: H2, then rows (14.5px/1.55, border-bottom `#E8E5DF`, padding 13px 0).
- Questions: H2, then a six-item accordion with the first item open.

### More playbooks (after main)
- Container: max-width 1048px, padding `120px clamp(20px,4vw,40px) 0`.
- Heading row: H2 "More playbooks" (`clamp(22px, 2.2vw, 28px)`, weight 400) with "All nine playbooks →" on the right, then border-bottom `#E8E5DF`.
- Three cards in a `repeat(auto-fit, minmax(min(100%,280px),1fr))` grid:
  - 2:1 image tile, radius 14px, with a centred glass icon badge
  - category 12px `#6E6D67`
  - title 17.5px, letter-spacing -0.02em
  - one-liner 13.5px/1.55 `#55544E`
  - hover: text turns `#157F52`
- Current cards: Loan Ops Ledger, Capital Call Flow, NAV Pack Review, each linking to its page.
- **Glass badge:** centred, height 34% of the tile, square, radius 28%. Background `rgba(250,249,246,0.62)`, `backdrop-filter: blur(18px) saturate(1.3)`, border `1px solid rgba(255,255,255,0.72)`, shadow `inset 0 1px 0 rgba(255,255,255,0.85), 0 18px 40px -16px rgba(20,20,18,0.38)`. The icon is a 48×48 viewBox monoline SVG at 48% of the badge, stroke `#1A1917`, width 2, round caps and joins.

### Closing
- Section padding `104px clamp(20px,4vw,40px)`, border-bottom `rgba(20,20,18,0.075)`.
- **Panel:** max-width 968px, border `1px solid rgba(20,20,18,0.13)`, radius 18px. Background `assets/valley-pastel.png` (centre 60%, cover) with a veil `linear-gradient(180deg, rgba(248,246,240,.7) 0%, rgba(248,246,240,.5) 60%, rgba(248,246,240,.35) 100%)`. Padding `clamp(40px,5vw,64px) clamp(24px,4vw,56px)`.
- **Layout:** flex-wrap, `align-items: flex-end`, `space-between`, gap 32px.
- **H2:** "Bring one agreement and its latest certificate", `clamp(26px,2.8vw,38px)`, weight 400, letter-spacing -0.032em, line-height 1.08, max-width 620px.
- **Line:** 15px/1.6 `#2C2B27`, max-width 520px.
- **Button:** 42px tall, padding 0 20px, ink background, white 14px weight 500 text, radius 6px.

### Footer
Site-standard footer, the same as the Playbooks page (see `design_handoff_playbooks`).

---

## Figures
All data is fictional. The fund is Larkspur Credit Opportunities Fund II and the borrower is Tallis Brook Components. Exact strings are in `copy-deck.md`; exact markup is in the prototype.

### F1 Hero: the recompute that beats the certificate
- **Band:** `covenant-watch.png`.
- **Head:** "Covenant Watch · recompute · total net leverage". Right: "Larkspur Credit Opportunities Fund II · CC-2026Q2-TallisBrook.pdf · v1 · $m".
- **Sheet title:** "Tallis Brook Components · test period ended 30 Jun 2026".
- **Table:** Roman-numeral line refs (I–VI) with columns # · Schedule 1 line · Certificate · Recompute · Source.
  - Grid when main width ≥ 520: `26px minmax(0,1.7fr) minmax(0,.75fr) minmax(0,.75fr) minmax(0,.8fr)`.
  - Below 520: `22px minmax(0,1fr) auto auto`, with the Source column hidden.
  - Rows: Funded debt 182.40 / 182.40; Qualified cash (reported 9.80, capped at 7.50) 7.50 / 7.50; Net debt 174.90 / 174.90; Consolidated EBITDA LTM (31.60 before add-backs) 41.20 / 37.92; **Total net leverage 4.25x / 4.61x**; Maximum from 30 Jun 2026 4.50x / 4.50x.
  - Last row "Headroom on EBITDA": "● +5.7%" for the certificate, "● −2.5%" in red for the recompute.
- **Process checklist:** package received, hashes recorded, 18 figures extracted with spans, Schedule 4 cross-foot.
- **Shared Cap panel:** the calculation 5.10 + 3.20 + 1.30 = 9.60, capped at the greater of 5.00 and 20% × 31.60 = 6.32, so 3.28 is disallowed. This leads to Cure Amount 0.95, the cure window closing 29 Aug 2026, and routing to the credit analyst.
- **Below the band:** evidence line, then the moment sentence ("The certificate applies the $12.00m fixed cap, which ended with the 31 Mar 2026 test period."), then the caption.
- **Reveal animation:** runs once when 30% of the figure is visible.
  - Step 1 at 400ms: a 1.5px ink ring (`box-shadow`) fades in around the certificate's 4.25x (500ms ease).
  - Step 2 at 1050ms: both headroom values fade in (450ms).
  - Step 3 at 1700ms: the Shared Cap panel fades in and rises 6px to 0 (450ms, opacity and transform).
  - Step 4 at 2350ms: done.
  - Safety: force the final state after 4s, and show it immediately under `prefers-reduced-motion` or when `animateHero = false`. Render the final state by default before JS runs.

### F2 Cure eligibility (in §03)
- **Band:** `feat-covenant-watch.png`.
- **Head:** "Covenant Watch · cure eligibility · per this agreement". Right: fund name / "Credit agreement §8.04 Cure Right · as amended by Amd. No. 2".
- **Eight-quarter strip:** Q3 FY24 → Q2 FY26, tokens radius 9px. "cured" quarters are ink-filled, "pass" quarters are outlined, and Q2 FY26 is "cure proposed".
  - Grid: 8 columns when main width ≥ 560, 4 columns below.
  - A bracket labelled "any 4 consecutive quarters: 1 cure" spans the last four quarters (`grid-column: 5 / span 4`; full width on narrow screens).
- **Checks table:** "Check, per this agreement" · "Result". Seven rows, each with a green dot: not consecutive; ≤ 2 in any 4 quarters; ≤ 5 over life (3 of 5); amount ≤ Cure Amount ($0.95m); funded within 15 days (fund by 29 Aug 2026); no pro forma debt reduction; pro forma leverage 4.50x ≤ 4.50x.
  - Grid: `14px minmax(0,1.25fr) minmax(0,1fr)` when main width ≥ 560; below that, the result wraps under the check.
- **Result line:** "Cure eligible · 2 lifetime uses remain", then the evidence line, two notes and the caption.

### F3 Evidence line breakdown (in §04)
- **Band:** `loan-ops-ledger.png`.
- **Content:** the full evidence line in mono 11.5px/1.9, then eight labelled rows below it: Source, Version, Locator, Value, Test, Status, Approver, Timestamp. Labels are in an 88px mono uppercase 10.5px column.
- **Hover:** hovering a row highlights its matching segment in the line (background `#F1E6CF`, radius 3px, 160ms) and turns that row's label ink.

### F4 Evidence bundle (in §04)
- **Band:** `feat-capital-call-flow.png`.
- **Content:** a mono file tree for run `run_7Q2KXH4M`: manifest, two hashed inputs, prompts, model id (a placeholder), outputs, validators (41 checks, 40 pass, 1 flagged), citations, engine, review, and retention ("set per client · write-once storage").

### F5 Definition trace (in §05)
- **Band:** `client-reporting-flow.png`.
- **Title:** "One ratio, unfolded: who reads, who computes, who signs".
- **Lanes:** three lane headers (The model reads / Code computes / A person signs) above numbered steps: 1 Encode the agreement, 2 Extract the certificate, 3 Recompute, then the decision.
  - Grid: 3 columns `repeat(3, minmax(0,1fr))` when main width ≥ 560; below that, one column with inline lane labels.

### F6 Harness anatomy (in `#built-harness`)
- **Band:** `feat-side-letter-register.png`.
- **Wide layout** (main width ≥ 600): a rounded ink frame holding a 3×3 grid of component cards, with the dark "Model · 01 pinned snapshot" card in the centre. Edge labels: 10 Observability (top), 11 Eval suites (bottom), 13 Permissions (left, vertical) and 12 Cost and latency budgets (right, vertical).
- **Narrow layout:** a stacked list.

### F7 Review routing (in `#built-evals`)
- **Band:** `feat-mandate-guardrails.png`.
- **Content:** funnel bars: 1,000 fields extracted, 912 passed validators, 861 auto-accepted. Then the 139-item review queue (88 failed a validator, 51 low confidence) and a sample line: "60 checked · 0 errors → error rate below 5% at 95% confidence", with a green dot.

### F8 Consistency across repeated runs (in `#built-evals`)
- **Band:** `feat-nav-pack-review.png`.
- **Chart:** an inline SVG line chart for k = 1–10 at a 0.95 per-run success rate. pass^k is a solid ink line falling to 0.60; pass@k is a dashed grey line reaching about 1.00. The caption notes the figures are illustrative maths.

### F9 How an engagement runs (in `#built-evals`)
- **Band:** `capital-call-flow.png`.
- **Wide layout** (main width ≥ 600): Assess (diagnostic) · Build (release ticks R1–R6, shadow run) · Run (in production), with a green "acceptance" rule between Build and Run and steps 1–11 underneath.
- **Narrow layout:** stacked phases.

### F10 Injection containment (in `#built-controls`)
- **Band:** `mandate-guardrails.png`.
- **Pipeline:** Borrower package → quarantined reader (dashed boundary "no tools · no egress") → typed record → validators → engine, then review.
- **Red-team case:** a hidden instruction is flagged (red dot) and EBITDA is read from the table as 48.6.

---

## Interactions & behaviour
- **Scroll-spy:**
  - The activation line is `min(170px, 30% of viewport height)` from the top of the viewport. The active section is the last one in the list whose top is at or above the line.
  - Inside `#built`, the active sub-item is found the same way.
  - Recompute on scroll (throttled with requestAnimationFrame), on resize, and when the main column resizes (ResizeObserver).
- **Coverage rail:** fill height = active TOC item's `offsetTop` + (share of the active section scrolled past the line × item height).
- **Anchor scrolling:** CSS `scroll-behavior: smooth`, turned off under `prefers-reduced-motion`. Targets use `scroll-margin-top: 120px`.
- **Copy link:** writes `location.href` to the clipboard and shows "Link copied" for 1.8s, then reverts to "Copy link".
- **Read time:** word count of the main column, excluding every `<figure>`, divided by 230 and rounded, minimum 1. Computed about 900ms after mount and shown as "N min read"; hidden until computed.
- **Hero reveal:** see F1. Use IntersectionObserver with a threshold of 0.3, run it once, and disconnect afterwards.
- **FAQ:** each item toggles independently; the first starts open. Expose `aria-expanded` on the button.
- **Mobile TOC:** toggles open and closed; choosing a link closes it.
- **Hover:** links and cards turn `#157F52`. Related cards darken their border to `rgba(20,20,18,0.3)`. The dark CTA button lightens to `#FFFFFF`.
- **Responsive thresholds:** viewport ≥ 1048px shows the sidebar. Figures respond to the **main column width** (not the viewport), measured with ResizeObserver:

| Main width | Effect |
|---|---|
| ≥ 500 | F1 extra columns |
| ≥ 520 | F1 Source column |
| ≥ 560 | F2 8-quarter strip and checks grid; F5 three columns |
| ≥ 600 | Step table grid; F6 and F9 wide layouts |

- **No horizontal scrolling at any width.** Long mono strings use `overflow-wrap: anywhere`.

## State
| State | Type | Purpose |
|---|---|---|
| `vw`, `mw` | number | Viewport width and main-column width |
| `act`, `sub` | string | Active section id and active `#built` sub-id |
| `g1` | 0–4 | Hero reveal step (default 4, the final state) |
| `mini` | bool | Mobile TOC open |
| `fq[6]` | bool[] | FAQ open flags (`[true, false, false, false, false, false]`) |
| `ev` | −1…7 | Hovered evidence-line part |
| `copied` | bool | "Link copied" flash |
| `readMin` | number | Computed read time |

All content is static; there is no data fetching.

## Props / feature flags
| Prop | Values | Effect |
|---|---|---|
| `ctaLabel` | "Book a mapping session" (default) · "Book a two-week audit" | Label for every page CTA. Mapping session links to `mailto:hello@3264.ai?subject=Covenant%20Watch`; two-week audit links to the AI Engineering page `#engagement`. Replace with a booking URL when one exists |
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
- Every name, identifier and figure in the graphics is fictional. Keep "Fictional data" in captions. Cure limits are this agreement's own, not a market standard.
- The model never decides a breach: "a named person signs every breach." Don't write "AI-powered", "real-time", "autonomous" or "100% accurate".
- Don't reuse the old one-liner "breaches flagged before quarter close"; it is inaccurate.
- Before launch, run a name check on Larkspur, Tallis Brook and the other fictional names against Companies House, EDGAR/IAPD and trademarks.

## Open items for 3264
- A real booking URL to replace the mailto link.
- Confirm that cure-count tracking is shipped, since "Recently updated" says it is.
- The Private Credit links point to the Private Credit industry page; confirm the final routes for it and the other playbooks.
