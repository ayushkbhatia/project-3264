# Handoff: Capital Call Flow playbook page

## Overview
Capital Call Flow is one of 3264.ai's nine playbook pages. It's a long-form article about one automation playbook for private credit and private equity fund teams. A drawdown is computed from the fund's own documents (the LPA and side letters), released per investor by a named approver, and matched to the wires that arrive. Every figure traces to the clause that produced it.

The page does three things:
1. It explains the process today and where it breaks.
2. It shows how the playbook runs, with realistic document vignettes: the per-investor split and the wire match board.
3. It explains how the system is engineered and governed, then asks the reader to book a mapping session.

The page uses a template shared by all the playbook pages: Loan Ops Ledger, Covenant Watch, NAV Pack Review, Investor Reporting, Side-Letter Register, Mandate Guardrails and Client Reporting Flow. Build it as one reusable `PlaybookPage` template plus per-page content and figures. This README is self-contained; you don't need the other handoffs to build this page.

Route suggestion: `/playbooks/capital-call-flow`. Industry: Private Credit.

## About the design files
The files in this bundle are **design references created in HTML**. They are prototypes that show the intended look and behaviour, not production code to copy. Your task is to **recreate this design in the target codebase's existing environment**, using its established framework, component patterns and styling approach. If there is no environment yet, pick the most suitable framework (a static-first React framework such as Next.js or Astro fits this content-heavy page) and implement it there.

`Capital Call Flow.dc.html` opens directly in a browser and needs `support.js` next to it. Every style is inline, so you can read exact values straight from the markup. Page logic (scroll-spy, hero reveal, accordion, hover links and so on) is the `class Component` script at the bottom of that file.

Some layout values in the logic (`g2…`, `g3…`, `g4…`, `cw…`, `dt…`) are left over from the shared template and aren't used on this page. The values that matter are listed under Behaviour.

## Fidelity
**High-fidelity.** Colours, typography, spacing, radii, copy and interactions are final. Recreate them pixel-accurately with the codebase's own primitives. Where these specs and the HTML disagree, the HTML wins.

## Files in this bundle
| File | What it is |
|---|---|
| `README.md` | This spec |
| `copy-deck.md` | Every visible string in page order, extracted from the prototype, including figure text. Table rows are joined with " · " |
| `Capital Call Flow.dc.html` | The page prototype: the source of truth for markup, styles, copy and logic |
| `support.js` | Runtime needed to open the prototype locally |
| `assets/` | Watercolour images used by figure bands, cards and the closing panel |

Open `Capital Call Flow.dc.html` in a browser, served from this folder so the relative `assets/` paths resolve.

---

## Page anatomy

```
┌ Header (sticky, 68px) ─────────────────────────────── progress bar (2px) ┐
│ [below 1048px] "On this page" bar (sticky under header, 44px)            │
├──────────────────────── max-width 1048px, centred ────────────────────────┤
│  Sidebar 200px (sticky)  │ gap 88px │  Main column, max-width 680px       │
│  ← All playbooks         │          │  Hero + F1 per-investor split       │
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
- **Logo:** "3264.ai", 19px, weight 500, letter-spacing -0.03em. Links to Home.
- **Nav:** 14px, colour `#55544E`, gap 30px, flex 1. Items: AI Engineering, AI Transformation, Industries, Work, Playbooks (current: `#1A1917`), Company.
- **Header CTA:** "Book an audit", 36px tall, padding 0 16px, `1px solid rgba(20,20,18,0.13)`, radius 6px, white background, 13.5px. Links to AI Engineering `#engagement`.
- **Reading progress bar:** absolutely positioned at the header's bottom edge (`bottom: -1px`), full width, 2px tall, `#157F52`. Driven by `transform: scaleX(p)` with `transform-origin: 0 50%`, where `p = scrollY / (documentHeight − viewportHeight)`.

### Layout wrapper
- max-width 1048px, `margin: 0 auto`, padding `0 clamp(20px, 4vw, 40px)`, `box-sizing: border-box`.
- `display: flex; justify-content: center; gap: 88px; align-items: flex-start`.

### Sidebar (viewport ≥ 1048px only)
- `flex: 0 0 200px`, `position: sticky; top: 40px`, `max-height: calc(100vh − 40px)`, `overflow-y: auto`, padding 60px 0 32px.
- **Back link:** "← All playbooks", 13.5px, `#55544E`. Links to the Playbooks index.
- **Label:** "On this page" at margin-top 32px. IBM Plex Mono 10.5px, letter-spacing 0.08em, uppercase, `#6E6D67`.
- **TOC entries**, in order (id · number · label):

  | id | Number | Label |
  |---|---|---|
  | `top` | — | Overview |
  | `today` | 01 | The work today |
  | `breaks` | 02 | Where it breaks |
  | `runs` | 03 | How it runs |
  | `evidence` | 04 | The evidence |
  | `built` | 05 | How it is built |
  | `rules` | 06 | Rules |
  | `terms` | — | Terms |
  | `updated` | — | Recently updated |
  | `questions` | — | Questions |

  Sub-items under `built`: Harness (`#built-harness`), Data and integrations (`#built-data`), What is hard for machines (`#built-hard`), How we know it works (`#built-evals`), Controls and security (`#built-controls`).
- **TOC nav:** margin-top 10px, padding-left 12px.
  - **Coverage rail:** a 1.5px track (`#E8E5DF`) runs down the left edge. A 1.5px ink (`#1A1917`) fill grows down it, with `height` transitioning 200ms linear.
- **TOC item:** flex, gap 8px, padding 6px 10px, radius 7px, 13px, line-height 1.3, letter-spacing -0.005em.
  - Number: mono 10.5px, `#6E6D67`, in a 17px column.
  - Active item: background `#EEEBE4`. Items up to and including the active one are ink `#1A1917`; later items are `#6E6D67`.
  - Background and colour transition over 160ms.
- **Sub-items** (only while "05 How it is built" is active, and only when `showBuilt` is on): margin 3px 0 6px 35px, 12px text, padding 4px 0 4px 10px, left border 1px. The active sub is ink with border `#1A1917`; the others are `#6E6D67` with border `#D9D6CF`.
- **Sidebar CTA card:** margin-top 32px, padding 18px, radius 12px, background `#EEEBE4`.
  - Text: "Bring one past call. We will trace it.", 14.5px, line-height 1.4.
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
| Step table (§03) | 4 columns `minmax(0,.62fr) repeat(3,minmax(0,1fr))`, gap 6px 22px, when main width ≥ 600. Header row: 11.5px weight 500 `#55544E`, border-bottom 1px ink. Rows: padding 13px 0, border-bottom `#E8E5DF`, 13.5px/1.55. Below 600 the table stacks into one column (gap 8px) and each cell gets its lane label on top (11.5px weight 500 `#6E6D67`). "Nothing" or empty cells are `#8A887F` |
| Callout ("Never automated") | margin-top 32px; padding 18px 20px; radius 14px; background `#FBFAF8`; border `#E8E5DF`; mono label; paragraph 14.5px/1.65 |
| Hard / We pairs (§05) | Container border-top 1px ink. Each pair: flex-wrap, gap 8px 28px, padding 16px 0, border-bottom `#E8E5DF`. Two columns `flex: 1 1 260px`, each a mono label ("Hard" in `#6E6D67`, "We" in ink) over 14px/1.6 text |
| "Kept for every run" grid (§04) | `repeat(auto-fit, minmax(min(100%,280px),1fr))`, column gap 28px. Each item: flex, gap 12px, padding 10px 0, border-top `#E8E5DF`; number "01"… in mono 10.5px `#6E6D67`; text 14px/1.5 |
| Rules strip (§06) | List with border-top 1px ink, margin-top 22px. Rows: flex-wrap, gap 4px 24px, padding 14px 0, border-bottom `#E8E5DF`. Date column 96px (mono 11.5px); title 14.5px/1.4 weight 500; description 14px/1.6 `#55544E`. Closing note 13px/1.6 `#55544E` |
| Terms | `<dl>` with border-top 1px ink. Rows: flex-wrap, gap 3px 24px, padding 13px 0, border-bottom `#E8E5DF`. `dt` is `flex: 0 0 200px`, 14px weight 500; `dd` is 14px/1.6 `#55544E` |
| FAQ accordion | Border-top 1px ink. Question button: full width, padding 16px 0, 15.5px/1.4, letter-spacing -0.012em, "+" or "−" in mono 15px `#55544E`, hover colour `#157F52`. Answer: 14.5px/1.7, padding-bottom 18px |
| Platform card (end of §02) | Links to the Private Credit page. Same styling as the related-page card below |
| Mid-page CTA band (end of §04) | margin-top 44px; padding 22px 24px; radius 16px; background `#1A1917`; text `#F4F3F0`. Title "Thirty minutes with your controller" 18px/1.3; sub-line 13.5px/1.55 `rgba(244,243,240,0.8)`. Button 40px tall, padding 0 18px, `#F4F3F0` background, ink 13.5px weight 500 text, radius 6px, hover `#FFFFFF` |
| Related-page card (platform card; "How we build" → AI Engineering) | Flex-wrap, gap 16px 22px, padding 14px, border `#E8E5DF`, radius 16px, background `#FBFAF8`, hover border `rgba(20,20,18,0.3)`. 164×88 thumbnail (radius 11px) with glass icon badge; small label 12px `#6E6D67`; title 16px; text 13.5px; trailing link 13px with 1px underline |
| Primary button | 40px tall, padding 0 18px, `#1A1917` background, white 13.5px weight 500 text, letter-spacing -0.005em, radius 6px |
| Secondary button | Same size, white background, border `1px solid rgba(20,20,18,0.13)`, ink text |

### Figure frame (used by every infographic)
Each figure is a `<figure>` with margin-top 28–44px, built in these layers:
1. **Band:** radius 16px, padding 12px, border `1px solid rgba(20,20,18,0.06)`. Background is a watercolour image (`assets/playbooks/*.png`, cover, centre) under a paper veil `linear-gradient(rgba(251,250,248,v), rgba(251,250,248,v))`. Each figure has its own v, between 0.62 and 0.76 (listed under Figures).
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
- Red and green are used for status only.

---

## Sections (top to bottom)
Verbatim copy for every section is in `copy-deck.md`.

### Hero (`#top`)
- **Eyebrow:** "Playbook · Private Credit", 13px `#55544E`. "Private Credit" links to the Private Credit industry page, with a 1px underline `rgba(20,20,18,0.25)`.
- **H1:** "Capital Call Flow", margin-top 14px, `clamp(34px, 3.8vw, 48px)`, weight 400, letter-spacing -0.038em, line-height 1.02.
- **One-liner:** "Calls computed from the LPA and side letters, sent per investor, and matched to the wires that arrive." Margin-top 16px, `clamp(16.5px, 1.4vw, 18.5px)`, line-height 1.45, `#55544E`.
- **Meta row:** margin-top 22px, padding-top 12px, border-top `#E8E5DF`, 12.5px `#6E6D67`, flex-wrap, gap 6px 16px.
  - "Reviewed 28 September 2026"
  - "N min read" (computed; see Behaviour)
  - "Copy link" button, pushed right with `margin-left: auto`, ink text
- **Standfirst:** margin-top 26px, 16px/1.7 `#2C2B27`.
- **CTAs:** margin-top 24px, gap 10px. Primary "Book a mapping session"; secondary "See how it is built" (links to `#built`).
- **Hero figure:** F1, margin-top 44px.

### 01 The work today (`#today`)
Eyebrow, H2 "One call, several desks, one due date", intro, the six-step list (CFO or controller → treasury or fund accountant), then the Inputs (7) and Outputs (6) cards.

### 02 Where it breaks (`#breaks`)
Eyebrow, H2 "Four places a call goes wrong", four numbered breaks:
1. One base for every purpose
2. Fee offsets applied wrongly (SEC v. TZP, August 2025)
3. Wire instructions changed by email (IC3 2025 BEC figures)
4. Cash that cannot be placed

Then the platform card: "See three playbooks on one platform", linking to the Private Credit page.

### 03 How it runs (`#runs`)
Eyebrow, H2 "The model reads and drafts. Code computes. People sign.", intro, then:
- the step table: seven rows (Step · The model reads or drafts · Code computes or decides · A person signs)
- the "Never automated" callout
- **F2** the wire match board

### 04 The evidence (`#evidence`)
Eyebrow, H2 "Each line traced from clause to wire", body, then:
- **F3** the evidence line breakdown
- H3 "Kept for every run" and its eight-item grid
- the dark mid-page CTA band ("Thirty minutes with your controller")

### 05 How it is built (`#built`)
Eyebrow, H2 "A fixed workflow with the model at the edges" and intro, then **F4** harness anatomy. Then five subsections with anchors:
- `#built-harness`: four bullets (Workflow, not agent; Deterministic allocation engine; Drafting chain; Human gates)
- `#built-data`: six bullets on sources and formats
- `#built-hard`: five Hard / We pairs
- `#built-evals`: five bullets, then **F5** the engagement lifecycle
- `#built-controls`: four bullets, then **F6** tool permissions

The section ends with the "How we build → AI Engineering" card.

With `showBuilt = false`, the section shows only its eyebrow and the AI Engineering card, and the TOC hides the sub-items.

### 06 Rules (`#rules`)
Eyebrow, H2 "The rules around a call, as of 28 September 2026", six dated rule rows (2024-06-05 to 2026-04-16), then the note: "Notice periods, excuse rights and default remedies are contractual. They come from your LPA and side letters, not from a regulation."

### Terms (`#terms`), Recently updated (`#updated`), Questions (`#questions`)
- Terms: H2, then twelve terms. US and UK/EU differences are written into the definitions.
- Recently updated: H2, then two rows (14.5px/1.55, border-bottom `#E8E5DF`, padding 13px 0).
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
- Current cards: Side-Letter Register, Covenant Watch and NAV Pack Review, each linking to its page.
- **Glass badge:** centred, height 34% of the tile, square, radius 28%. Background `rgba(250,249,246,0.62)`, `backdrop-filter: blur(18px) saturate(1.3)`, border `1px solid rgba(255,255,255,0.72)`, shadow `inset 0 1px 0 rgba(255,255,255,0.85), 0 18px 40px -16px rgba(20,20,18,0.38)`. The icon is a 48×48 viewBox monoline SVG at 48% of the badge, stroke `#1A1917`, width 2, round caps and joins.

### Closing
- Section padding `104px clamp(20px,4vw,40px)`, border-bottom `rgba(20,20,18,0.075)`.
- **Panel:** max-width 968px, border `1px solid rgba(20,20,18,0.13)`, radius 18px. Background `assets/valley-pastel.png` (centre 60%, cover) with a veil `linear-gradient(180deg, rgba(248,246,240,.7) 0%, rgba(248,246,240,.5) 60%, rgba(248,246,240,.35) 100%)`. Padding `clamp(40px,5vw,64px) clamp(24px,4vw,56px)`.
- **Layout:** flex-wrap, `align-items: flex-end`, `space-between`, gap 32px.
- **H2:** "Bring one past call. We will trace it.", `clamp(26px,2.8vw,38px)`, weight 400, letter-spacing -0.032em, line-height 1.08, max-width 620px.
- **Line:** "Thirty minutes with your controller: we take one call from LPA clause to matched wire, and tell you what it would take to build." 15px/1.6 `#2C2B27`, max-width 520px.
- **Button:** 42px tall, padding 0 20px, ink background, white 14px weight 500 text, radius 6px.

### Footer
Site-standard footer, the same as the Playbooks page.

---

## Figures
All data is fictional. The fund is Aldercove Growth Fund III, L.P.; the call is Capital Call No. 07 (notice 2026-09-30, due 2026-10-15); the investment is Halden Instruments; the currency is USD. Six limited partners appear throughout:

| LP | Name | Commitment |
|---|---|---|
| LP-01 | Calder County Retirement System | 60,000,000.00 |
| LP-02 | Lanvik Sovereign Holdings (excused from the investment) | 75,000,000.00 |
| LP-03 | Northfield University Endowment | 40,000,000.00 |
| LP-04 | Tamsin Mutual Insurance | 25,000,000.00 |
| LP-05 | Harlow Foundation | 15,000,000.00 |
| LP-06 | Ashgrove Family Office | 10,000,000.00 |

Exact strings are in `copy-deck.md`; exact markup is in the prototype. The numbers reconcile: keep them exactly as given.

### F1 Hero: per-investor split, one LP excused
- **Band:** `capital-call-flow.png`, veil 0.62.
- **Head:** "Aldercove Growth Fund III, L.P. · Capital Call No. 07 (drawdown notice)". Right: "notice 2026-09-30 · due 2026-10-15", then "investment: Halden Instruments · Q4 management fee", then "allocation v1 · USD".
- **Sheet title:** "Per-investor split, one LP excused".
- **Table:** Limited partner · Commitment · Remaining before · Investment · Mgmt fee, net · Total due.
  - Grid when main width ≥ 640: `minmax(0,1.45fr) repeat(5, minmax(0,1fr))`.
  - Below 640: `minmax(0,1.3fr) repeat(3, minmax(0,1fr))`, with Commitment and Remaining before hidden.
  - Each LP cell has the name (12.5px) over its LP id (mono 9.5px `#6E6D67`).
  - Lanvik's Investment cell reads "excused · side letter §3.1" in mono 10.5px `#55544E`.
  - **Rounding marks:** "+0.01" pills (inline-block, padding 0 4px, border `1px solid #D9D6CF`, radius 4px, mono 9.5px `#55544E`) sit before each amount that received a residual cent: investment +0.02, fee +0.03 in total.
  - The Total row has a 1px ink top border. Total due 18,984,375.00.
- **Tie-out check:** right-aligned under the table, mono 11px green `#157F52`, with a 7px green dot: "Σ LP lines = call total · variance 0.00".
- **Calculation trace:** three mono lines covering the investment base (LPA s.6.2.4.1), the fee (LPA s.8.3–8.4) and the rounding rule (floor to the cent, residual by largest remainder, ties to the larger base).
- **Below the band:**
  - Evidence line: "call07_alloc v1 · rules v3.2 · LPA s.6.2.4.1 + SL §3.1 → 18,984,375.00 → recompute 6/6 → tied → fund controller · 2026-09-29 16:42"
  - Moment sentence: "Lanvik is excused from the Halden Instruments investment under its side letter. It still pays its management fee."
  - Caption
  - A terminology note: "US documents say capital call; UK and EU documents, and the ILPA Model LPA, say drawdown notice."
- **Reveal animation:** runs once, when the figure's top has scrolled into the upper 65% of the viewport. Use IntersectionObserver with `threshold: 0` and `rootMargin: "0px 0px -35% 0px"`; this works for figures taller than the screen.
  - Step 1 at 400ms: a 1.5px ink ring (`box-shadow: 0 0 0 1.5px #1A1917`, from transparent) fades in around the Total due cell 18,984,375.00 (500ms ease).
  - Step 2 at 1050ms: the tie-out check fades in (450ms).
  - Step 3 at 1700ms: Lanvik's "excused · side letter §3.1" chip and the calculation trace fade in (450ms).
  - Step 4 at 2350ms: done.
  - Safety: if the reveal hasn't started within 4s of mount, or hasn't finished 4s after starting, jump to the final state. Show the final state immediately under `prefers-reduced-motion`, when `animateHero = false` or when IntersectionObserver is unavailable. Server-render the final state.

### F2 Wires matched to investors (in §03)
- **Band:** `feat-capital-call-flow.png`, veil 0.72.
- **Head:** "Aldercove Growth Fund III, L.P. · Capital Call No. 07 · Receipts". Right: "due 2026-10-15 · as of 2026-10-16 09:00 ET" and "source: BAI2 prior-day file, type 195 credits · USD".
- **Sheet title:** "Wires matched to investors".
- **Table:** Limited partner · payer text · bank ref · value date | Due | Received | Variance | Status.
  - Grid when main width ≥ 600: `minmax(0,1.65fr) repeat(3, minmax(0,0.95fr)) minmax(0,1.3fr)`, with the header row visible.
  - Below 600: `minmax(0,1fr) minmax(0,0.9fr)`. The header and the Due, Received and Variance columns are hidden, and a mono 9.5px "due … · received … · variance" sub-line appears under the LP instead.
  - LP cell: name 12.5px/1.35, then payer text and bank reference · value date in mono 9.5px/1.6 `#55544E`, `overflow-wrap: anywhere`.
- **Status cell:** 12px/1.35 with a 7px dot, then "match: exact / proposed / —" (mono 9.5px `#6E6D67`, indented 13px), then an optional note.

  | Status | Dot | Text colour |
  |---|---|---|
  | Funded | solid green `#157F52` | green |
  | Short, explained | outline ring 1.5px ink | ink |
  | Awaiting confirmation | outline ring 1.5px ink | ink |
  | Late | solid red `#C4341E` | red |

- **Rows:**
  - Calder, Lanvik and Harlow: funded, exact.
  - Northfield: 25.00 short, explained as an intermediary charge (legacy 71F).
  - Tamsin: payer text "INV 88213 TMI" names no LP, so the match is proposed and awaits confirmation.
  - Ashgrove: no credit by the due date, and a reminder is drafted for IR.
- **Totals strip:** five totals, each a label (10.5px `#55544E`) over a value (mono 12px weight 500): Due 18,984,375.00 · Confirmed 14,600,113.89 · Awaiting confirmation 3,131,597.23 · Not received 1,252,638.88 · Short 25.00.
- **Below the band:**
  - Evidence line: the raw BAI2 type-16 record for Calder, then "→ 7,515,833.33 → exact → funded → fund accountant · 2026-10-09"
  - Moment sentence: "Northfield is 25.00 short because a bank on the route took its charge. The shortfall is explained, not chased."
  - Caption: "Nothing here puts an LP in default…"

### F3 Evidence line breakdown (in §04)
- **Band:** `covenant-watch.png`, veil 0.76.
- **Head:** "Example evidence line". Right: "Aldercove Growth Fund III · fictional".
- **Content:** the full line in mono 11.5px/1.9: "call07_alloc · v1 · LPA s.6.2.4.1 + SL §3.1 · Northfield → 4,906,666.67 → recompute = engine; Σ lines = 18,984,375.00 → tied → fund controller · 2026-09-29 16:42 ET".
- **Parts:** below the line, eight labelled rows: Source, Version, Locator, Value, Test, Status, Approver, Timestamp. Labels sit in an 88px column in mono uppercase 10.5px `#6E6D67`; values are mono 11.5px.
- **Hover (two-way link):** hovering a row highlights its matching segment in the line (background `#F1E6CF`, radius 3px, 160ms) and turns that row's label ink. On leave, both reset.

### F4 Harness anatomy (opens §05)
- **Band:** `feat-side-letter-register.png`, veil 0.64.
- **Head:** "Harness anatomy".
- **Wide layout** (main width ≥ 600): a rounded ink frame holding a 3×3 grid of component cards, with the dark "Model · 01 pinned snapshot" card in the centre. The cards are 02 Instructions, 03 Tools, 04 Retrieval and context, 05 State, 06 Validators, 07 Deterministic engines, 08 Orchestration and 09 Human review. Edge labels: 10 Observability (top), 11 Eval suites (bottom), 13 Permissions (left, vertical) and 12 Cost and latency budgets (right, vertical).
- **Narrow layout:** a stacked list with the same numbers and text.
- **Caption:** "The pinned model sits inside twelve layers that instruct, constrain, check and record it."

### F5 How an engagement runs (in `#built-evals`)
- **Band:** `capital-call-flow.png`, veil 0.62.
- **Wide layout** (main width ≥ 600):
  - Four columns (`minmax(0,1fr) minmax(0,1.1fr) minmax(0,1.1fr) minmax(0,1fr)`, column gap 36px), headed Assess · 2 weeks, Build · 6–12 weeks · release every fortnight (spans 2), and Run · ongoing.
  - Phase pills are 64px tall, 1.5px ink border, radius 20px: diagnostic, then a build pill whose inner "shadow run" block (38% width, `#EEEBE4`) sits on the right, then in production.
  - Release ticks R1–R6 hang under the build pill.
  - A 1.5px green `#157F52` "acceptance" rule sits before Run.
  - Steps 1–11 are listed under the phases: title 15.5px weight 500, description 14px `#55544E`.
- **Narrow layout:** stacked phases, with a green "acceptance" divider line.
- **Caption:** "A two-week assessment, a build released every fortnight with a shadow run, then production."

### F6 Tool permissions (in `#built-controls`)
- **Band:** `mandate-guardrails.png`, veil 0.66.
- **Head:** "Capital Call Flow · harness · tool permissions".
- **Sheet title:** "What the model may touch, and what only a person can do".
- **Table:** Tool · Tier · Called by · Approval before effect. Seven rows:

  | Tool | Tier |
  |---|---|
  | `docs.read_lpa_side_letters` | read |
  | `bank.read_statement` | read |
  | `allocation.compute` | engine |
  | `notice.create_draft` | propose |
  | `cashmatch.propose` | propose |
  | `notice.release` | execute |
  | `ssi.change_bank_details` | not exposed |

  - Grid when main width ≥ 600: `minmax(0,1.15fr) minmax(0,0.62fr) minmax(0,1.55fr) minmax(0,1.2fr)`, gap 4px 12px.
  - Below 600: a single column (gap 6px); the header is hidden and each cell gets an inline label.
  - Tool names are mono 10.5px. "Called by" is 12.5px, with an 11px `#55544E` sub-line. "—" is `#8A887F`.
- **Tier pills:** radius 999px, padding 1px 8px, mono 10px.
  - read, engine and propose: 1px `#D9D6CF` border, `#55544E` text.
  - execute: 1.5px ink border, ink text.
  - not exposed: 1px dashed ink border.
- **Containment flow:** "When an email asks for new wire instructions" (mono label), then four boxes joined by "→" arrows. Each box is `flex: 1 1 130px`, padding 12px, radius 11px.
  1. Untrusted input: 1px `#D9D6CF` border, `#F8F7F4` background.
  2. Quarantined reader: 1px dashed ink border, `#F8F7F4` background, with a mono 10px typed record ("intent: bank_detail_change…").
  3. Workflow code: 1px `#D9D6CF` border, `#F8F7F4` background.
  4. Two named people: 1.5px ink border, white background.
- **Below the band:**
  - Evidence line: "msg 4471 · inbound · l.3–4 → bank_detail_change (LP-06) → blocked; call-back task opened → open → treasury lead · 2026-10-13 10:05"
  - Moment sentence: "The model can read a request to change bank details. It has no tool that could make the change."
  - Caption

---

## Interactions & behaviour
- **Scroll-spy:**
  - The activation line is `min(170px, 30% of viewport height)` from the top of the viewport. The active section is the last one in the TOC order whose top is at or above the line.
  - Inside `#built`, the active sub-item is found the same way, but only when `showBuilt` is on.
  - Recompute on scroll (throttled with requestAnimationFrame), on resize, and when the main column resizes (ResizeObserver).
- **Coverage rail:** fill height = active TOC item's `offsetTop` + (share of the active section scrolled past the line, clamped 0–1, × item height).
- **Reading progress bar:** `scaleX(scrollY / (documentHeight − viewportHeight))`, updated in the same scroll handler.
- **Anchor scrolling:** CSS `scroll-behavior: smooth`, turned off under `prefers-reduced-motion`. Targets use `scroll-margin-top: 120px`.
- **Copy link:** writes `location.href` to the clipboard (with a textarea fallback) and shows "Link copied" for 1.8s, then reverts to "Copy link".
- **Read time:** word count of the main column, excluding every `<figure>`, divided by 230 and rounded, minimum 1. Computed about 900ms after mount and shown as "N min read"; hidden until computed.
- **Hero reveal:** see F1. Run it once and disconnect the observer afterwards; clear all timers on unmount.
- **Evidence hover (F3):** `mouseenter` on a part row sets the hovered index (0–7); `mouseleave` resets it to −1.
- **FAQ:** each item toggles independently; the first starts open. Expose `aria-expanded` on the button and use "+" or "−" as the icon.
- **Mobile TOC:** toggles open and closed; choosing a link closes it.
- **Hover:**
  - Links and cards turn `#157F52`.
  - Related cards darken their border to `rgba(20,20,18,0.3)`.
  - The dark CTA band's button lightens to `#FFFFFF`.
- **Responsive thresholds:** viewport ≥ 1048px shows the sidebar. Figures respond to the **main column width** (not the viewport), measured with ResizeObserver:

| Main width | Effect |
|---|---|
| ≥ 600 | §03 step table grid; F2 full table; F4 and F5 wide layouts; F6 permissions grid |
| ≥ 640 | F1 Commitment and Remaining before columns |

- **No horizontal scrolling at any width.** Long mono strings (payer text, evidence lines, BAI2 records) use `overflow-wrap: anywhere`.

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

The prototype's state also has `notice` and `g3h`, left over from the shared template; they aren't used on this page. All content is static; there is no data fetching.

## Props / feature flags
| Prop | Values | Effect |
|---|---|---|
| `ctaLabel` | "Book a mapping session" (default) · "Book a two-week audit" | Label for every page CTA. Mapping session links to `mailto:hello@3264.ai?subject=Capital%20Call%20Flow`; two-week audit links to the AI Engineering page `#engagement`. Replace with a booking URL when one exists |
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
| faint | `#8A887F` | Empty cells, "Nothing" |
| rule | `#D9D6CF` | Borders, rounding pills |
| rule-2 | `#E8E5DF` | Hairlines |
| tile | `#FBFAF8` | Cards, callouts |
| wash | `#EEEBE4` | Active TOC item, sidebar card, shadow-run block |
| box | `#F8F7F4` | F6 flow boxes |
| highlight | `#F1E6CF` | Evidence hover |
| accent / green | `#157F52` | Status dots, tie-out check, links on hover, progress bar, acceptance rule |
| red | `#C4341E` | Status only (Late) |
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
  - Labels and sub-lines 9.5–11.5px

**Radii**

| Element | Radius |
|---|---|
| Figure band | 16px |
| Sheet, flow boxes | 11px |
| Cards, callouts | 14–16px |
| Closing panel | 18px |
| Phase pills (F5) | 20px |
| TOC items | 7–8px |
| Buttons | 6px |
| Rounding pills | 4px |
| Tier pills | 999px |

**Shadows**
- Sheet: `0 12px 32px -20px rgba(20,20,18,.3)`
- Dropdown: `0 24px 48px -20px rgba(20,20,18,.25)`
- Glass badge: `inset 0 1px 0 rgba(255,255,255,.85), 0 18px 40px -16px rgba(20,20,18,.38)`
- Hero ring: `0 0 0 1.5px #1A1917`

**Spacing:** section rhythm 96px; subsection 48px; figure top margin 28–44px; paragraph 16px; list gaps 6–10px.

## Assets
All images are watercolour washes created for 3264.ai and sit in `assets/`.
- `assets/playbooks/*.png`: figure band backgrounds, card thumbnails and More playbooks tiles.
- `assets/valley-pastel.png`: the closing panel.

Icons are inline monoline SVGs (48×48 viewBox, stroke 2, round caps and joins), copied from the Playbooks icon set. There are no icon fonts and no external images.

## Content rules
- Every name, identifier and figure in the graphics is fictional. Keep "Fictional" in captions.
- The model never computes an amount, releases a notice or changes bank details. Every amount comes from the engine, and people approve and release.
- Don't claim the playbook stops wire fraud. The page says no control can promise that; keep it that way.
- Don't write "AI-powered", "real-time", "autonomous" or "100% accurate".
- Terminology: US documents say capital call; UK and EU documents, and the ILPA Model LPA, say drawdown notice. Keep both.
- The regulatory rows are stated as of 28 September 2026. Re-check them, along with the SEC (TZP) and FBI IC3 figures in §02, before publishing.
- The five-year records statement is qualified with "subject to your counsel"; keep the qualifier.
- Before launch, run a name check on Aldercove, Halden Instruments, Calder County Retirement System, Lanvik Sovereign Holdings, Northfield University Endowment, Tamsin Mutual Insurance, Harlow Foundation and Ashgrove Family Office against Companies House, EDGAR/IAPD and trademarks.

## Open items for 3264
- A real booking URL to replace the mailto link.
- Confirm that applying excuse rights at calculation, and re-applying them after the notice, is shipped, since "Recently updated" says it is.
- The Private Credit links point to the Private Credit industry page; confirm the final routes for it and the other playbooks.
