# Handoff: Side-Letter Register playbook page

## Overview
Side-Letter Register is one of 3264.ai's nine playbook pages. It's a long-form article about one automation playbook for fund legal, compliance and operations teams. Every promise in a fund's LPA and side letters becomes a register row with its exact clause, an owner, a next due date and proof of delivery. MFN elections are tracked per investor, and nothing enters the register until a person confirms it.

The page does three things:
1. It explains the process today and where it breaks.
2. It shows how the playbook runs, with realistic document vignettes: the obligation register and the MFN election matrix.
3. It explains how the system is engineered and governed, then asks the reader to book a mapping session.

The page uses a template shared by all the playbook pages: Loan Ops Ledger, Covenant Watch, Capital Call Flow, NAV Pack Review, Investor Reporting, Mandate Guardrails and Client Reporting Flow. Build it as one reusable `PlaybookPage` template plus per-page content and figures. This README is self-contained; you don't need the other handoffs to build this page.

Route suggestion: `/playbooks/side-letter-register`. Industry: Fund Management.

## About the design files
The files in this bundle are **design references created in HTML**. They are prototypes that show the intended look and behaviour, not production code to copy. Your task is to **recreate this design in the target codebase's existing environment**, using its established framework, component patterns and styling approach. If there is no environment yet, pick the most suitable framework (a static-first React framework such as Next.js or Astro fits this content-heavy page) and implement it there.

`Side-Letter Register.dc.html` opens directly in a browser and needs `support.js` next to it. Every style is inline, so you can read exact values straight from the markup. Page logic (scroll-spy, hero reveal, accordion, hover links and so on) is the `class Component` script at the bottom of that file.

Some layout values in the logic (for example `ir…`, `ca…`, `dd…`, `g1Ring`, `g1Row`, `g2…`, `g3…`, `g4…`, `cw…`, `dt…`, `sCols`, `wCols`, `pCols`, `tCols`, `plCols`, `scCols`, `lnCols`, `notice…`) are left over from the shared template and aren't used on this page. The values that matter are listed under Behaviour.

## Fidelity
**High-fidelity.** Colours, typography, spacing, radii, copy and interactions are final. Recreate them pixel-accurately with the codebase's own primitives. Where these specs and the HTML disagree, the HTML wins.

## Files in this bundle
| File | What it is |
|---|---|
| `README.md` | This spec |
| `copy-deck.md` | Every visible string in page order, extracted from the prototype, including figure text. Table rows are joined with " · " |
| `Side-Letter Register.dc.html` | The page prototype: the source of truth for markup, styles, copy and logic |
| `support.js` | Runtime needed to open the prototype locally |
| `assets/` | Watercolour images used by figure bands, cards and the closing panel |

Open `Side-Letter Register.dc.html` in a browser, served from this folder so the relative `assets/` paths resolve.

---

## Page anatomy

```
┌ Header (sticky, 68px) ─────────────────────────────── progress bar (2px) ┐
│ [below 1048px] "On this page" bar (sticky under header, 44px)            │
├──────────────────────── max-width 1048px, centred ────────────────────────┤
│  Sidebar 200px (sticky)  │ gap 88px │  Main column, max-width 680px       │
│  ← All playbooks         │          │  Hero + F1 obligation register      │
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
  - Text: "Know which promise is due, and prove it was kept", 14.5px, line-height 1.4.
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
| Step table (§03) | 4 columns `minmax(0,.62fr) repeat(3,minmax(0,1fr))`, gap 6px 22px, when main width ≥ 600. Header row: 11.5px weight 500 `#55544E`, border-bottom 1px ink. Rows: padding 13px 0, border-bottom `#E8E5DF`, 13.5px/1.55. Below 600 the table stacks into one column (gap 8px) and each cell gets its lane label on top (11.5px weight 500 `#6E6D67`). Empty cells show "—" in `#8A887F` |
| Callout ("What is never automated") | margin-top 32px; padding 18px 20px; radius 14px; background `#FBFAF8`; border `#E8E5DF`; mono label; paragraph 14.5px/1.65 |
| Hard / We pairs (§05) | Container border-top 1px ink. Each pair: flex-wrap, gap 8px 28px, padding 16px 0, border-bottom `#E8E5DF`. Two columns `flex: 1 1 260px`, each a mono label ("Hard" in `#6E6D67`, "We" in ink) over 14px/1.6 text |
| "Kept for every run" grid (§04) | `repeat(auto-fit, minmax(min(100%,280px),1fr))`, column gap 28px. Each item: flex, gap 12px, padding 10px 0, border-top `#E8E5DF`; number "01"… in mono 10.5px `#6E6D67`; text 14px/1.5 |
| Rules strip (§06) | List with border-top 1px ink, margin-top 22px. Rows: flex-wrap, gap 4px 24px, padding 14px 0, border-bottom `#E8E5DF`. Date column 96px (mono 11.5px); title 14.5px/1.4 weight 500; description 14px/1.6 `#55544E`. A status line, "Status as of 28 September 2026", sits between the H2 and the list |
| Terms | `<dl>` with border-top 1px ink. Rows: flex-wrap, gap 3px 24px, padding 13px 0, border-bottom `#E8E5DF`. `dt` is `flex: 0 0 200px`, 14px weight 500; `dd` is 14px/1.6 `#55544E` |
| FAQ accordion | Border-top 1px ink. Question button: full width, padding 16px 0, 15.5px/1.4, letter-spacing -0.012em, "+" or "−" in mono 15px `#55544E`, hover colour `#157F52`. Answer: 14.5px/1.7, padding-bottom 18px |
| Related playbook card (end of §02) | "Related playbook · Private Credit", linking to Capital Call Flow. Same styling as the related-page card below |
| Mid-page CTA band (end of §04) | margin-top 44px; padding 22px 24px; radius 16px; background `#1A1917`; text `#F4F3F0`. Title "One fund, your side letters, thirty minutes" 18px/1.3; sub-line 13.5px/1.55 `rgba(244,243,240,0.8)`. Button 40px tall, padding 0 18px, `#F4F3F0` background, ink 13.5px weight 500 text, radius 6px, hover `#FFFFFF` |
| Related-page card (related playbook; "How we build" → AI Engineering) | Flex-wrap, gap 16px 22px, padding 14px, border `#E8E5DF`, radius 16px, background `#FBFAF8`, hover border `rgba(20,20,18,0.3)`. 164×88 thumbnail (radius 11px) with glass icon badge; small label 12px `#6E6D67`; title 16px; text 13.5px; trailing link 13px with 1px underline |
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
- **Eyebrow:** "Playbook · Fund Management", 13px `#55544E`. "Fund Management" links to the Playbooks index `#fund-management` (there's no Fund Management industry page yet), with a 1px underline `rgba(20,20,18,0.25)`.
- **H1:** "Side-Letter Register", margin-top 14px, `clamp(34px, 3.8vw, 48px)`, weight 400, letter-spacing -0.038em, line-height 1.02.
- **One-liner:** "Every promise in your LPAs and side letters, tracked to its clause, owner and proof of delivery." Margin-top 16px, `clamp(16.5px, 1.4vw, 18.5px)`, line-height 1.45, `#55544E`.
- **Meta row:** margin-top 22px, padding-top 12px, border-top `#E8E5DF`, 12.5px `#6E6D67`, flex-wrap, gap 6px 16px.
  - "Reviewed 28 September 2026"
  - "N min read" (computed; see Behaviour)
  - "Copy link" button, pushed right with `margin-left: auto`, ink text
- **Standfirst:** margin-top 26px, 16px/1.7 `#2C2B27`.
- **CTAs:** margin-top 24px, gap 10px. Primary "Book a mapping session"; secondary "See how it is built" (links to `#built`).
- **Hero figure:** F1, margin-top 44px.

### 01 The work today (`#today`)
Eyebrow, H2 "Side letters are signed at closing and kept for years", intro, the six-step list, then the Inputs (6) and Outputs (6) cards.

### 02 Where it breaks (`#breaks`)
Eyebrow, H2 "Where side-letter promises are missed", then the numbered breaks:
1. Letters archived after closing
2. The MFN snowball
3. Preferential terms not disclosed
4. Fee terms applied wrongly

Then the related playbook card: "Related playbook · Private Credit", Capital Call Flow. Both pages use the same fictional fund and Call 07.

### 03 How it runs (`#runs`)
Eyebrow, H2 "The model reads the letters; code keeps the calendar", intro, then:
- the step table: six rows (Read the documents, Build obligations, Resolve effective terms, Run the MFN round, Schedule, Prove delivery)
- **F2** the MFN election matrix
- the "What is never automated" callout

### 04 The evidence (`#evidence`)
Eyebrow, H2 "Proof of delivery, obligation by obligation", body, then:
- **F3** the evidence line breakdown
- H3 "Kept for every run" and its seven-item grid
- the dark mid-page CTA band: "One fund, your side letters, thirty minutes", with the sub-line "We will map where each obligation lives today and tell you whether a register is worth building."

### 05 How it is built (`#built`)
Eyebrow, H2 "A workflow with review gates, not an agent", intro, then **F4** the clause-to-register blueprint. Then five subsections with anchors:
- `#built-harness`: five bullets, then **F5** harness anatomy
- `#built-data`: seven bullets on sources and formats
- `#built-hard`: five Hard / We pairs
- `#built-evals`: five bullets, then **F6** review routing
- `#built-controls`: five bullets, then **F7** injection containment

The section ends with the "How we build → AI Engineering" card.

With `showBuilt = false`, the section shows only its eyebrow and the AI Engineering card, and the TOC hides the sub-items.

### 06 Rules (`#rules`)
Eyebrow, H2 "What the rules require, and what they no longer do", the line "Status as of 28 September 2026", then six dated rows:

| Date | Rule |
|---|---|
| 2024-06-05 | SEC Preferential Treatment Rule vacated (Fifth Circuit) |
| 2025-11 | SEC FY2026 examination priorities |
| 2026-09-28 | Advisers Act Rule 206(4)-8, in force |
| 2026-09-28 | AIFMD Art. 23(1)(j) and FUND 3.2.2R(10)–(11), in force |
| 2026-04-16 | AIFMD II transposition deadline |
| 2026-09-03 | SEC proposes rescinding pay-to-play Rule 206(4)-5 (comments due 9 Nov 2026) |

The rows keep the prototype's order, which isn't strictly by date.

### Terms (`#terms`), Recently updated (`#updated`), Questions (`#questions`)
- **Terms:** H2 "Terms used on this page", then twelve terms.
- **Recently updated:** H2, then three rows (14.5px/1.55, border-bottom `#E8E5DF`, padding 13px 0):
  - MFN elections tracked per investor
  - the rules strip check
  - the pay-to-play note
- **Questions:** H2, then a six-item accordion with the first item open:
  1. Does the register decide whether an LP can elect a term?
  2. Does this make us compliant with SEC side-letter rules?
  3. How does it connect to capital calls and reporting? (The answer links to Capital Call Flow.)
  4. What happens when the model misreads a clause?
  5. Where does the model run, and who sees our side letters?
  6. What does an engagement look like?
- **After the accordion:** **F8** the engagement lifecycle, margin-top 48px.

### More playbooks (after main)
- Container: max-width 1048px, padding `120px clamp(20px,4vw,40px) 0`.
- Heading row: H2 "More playbooks" (`clamp(22px, 2.2vw, 28px)`, weight 400) with "All nine playbooks →" on the right, then border-bottom `#E8E5DF`.
- Three cards in a `repeat(auto-fit, minmax(min(100%,280px),1fr))` grid:
  - 2:1 image tile, radius 14px, with a centred glass icon badge
  - category 12px `#6E6D67`
  - title 17.5px, letter-spacing -0.02em
  - one-liner 13.5px/1.55 `#55544E`
  - hover: text turns `#157F52`
- Current cards: NAV Pack Review, Investor Reporting and Capital Call Flow, each linking to its page.
- **Glass badge:** centred, height 34% of the tile, square, radius 28%. Background `rgba(250,249,246,0.62)`, `backdrop-filter: blur(18px) saturate(1.3)`, border `1px solid rgba(255,255,255,0.72)`, shadow `inset 0 1px 0 rgba(255,255,255,0.85), 0 18px 40px -16px rgba(20,20,18,0.38)`. The icon is a 48×48 viewBox monoline SVG at 48% of the badge, stroke `#1A1917`, width 2, round caps and joins.

### Closing
- Section padding `104px clamp(20px,4vw,40px)`, border-bottom `rgba(20,20,18,0.075)`.
- **Panel:** max-width 968px, border `1px solid rgba(20,20,18,0.13)`, radius 18px. Background `assets/valley-pastel.png` (centre 60%, cover) with a veil `linear-gradient(180deg, rgba(248,246,240,.7) 0%, rgba(248,246,240,.5) 60%, rgba(248,246,240,.35) 100%)`. Padding `clamp(40px,5vw,64px) clamp(24px,4vw,56px)`.
- **Layout:** flex-wrap, `align-items: flex-end`, `space-between`, gap 32px.
- **H2:** "Know which promise is due, and prove it was kept", `clamp(26px,2.8vw,38px)`, weight 400, letter-spacing -0.032em, line-height 1.08, max-width 620px.
- **Line:** "Thirty minutes, one fund, your side letters. We will map where each obligation lives today and tell you whether a register is worth building." 15px/1.6 `#2C2B27`, max-width 520px.
- **Button:** 42px tall, padding 0 20px, ink background, white 14px weight 500 text, radius 6px.

### Footer
Site-standard footer, the same as the Playbooks page.

---

## Figures
All data is fictional. The fund is Aldercove Growth Fund III, L.P., the same fund as Capital Call Flow, with the same limited partners:

| LP | Name | Commitment |
|---|---|---|
| LP-01 | Calder County Retirement System | 60,000,000 |
| LP-02 | Lanvik Sovereign Holdings | 75,000,000 |
| LP-03 | Northfield University Endowment | 40,000,000 |
| LP-04 | Tamsin Mutual Insurance | 25,000,000 |
| LP-05 | Harlow Foundation | 15,000,000 |

Business Days follow the New York banking calendar. Exact strings are in `copy-deck.md`; exact markup is in the prototype. The counts reconcile (118 provisions → 64 obligations → 105 rows): keep them exactly as given.

### F1 Hero: the obligation register
- **Band:** `side-letter-register.png`, veil 0.72.
- **Head:** "Aldercove Growth Fund III, L.P. · Side-letter obligation register". Right: "as of 2026-11-17 · register v14", "5 of 105 rows · 6 side letters + LPA" and "Business Days: New York banking calendar".
- **Sheet title:** "Five obligations, each with its clause, owner and proof".
- **Table:** Clause · Investor · obligation · Next due · Evidence.
  - Grid when main width ≥ 560: `minmax(0,0.8fr) minmax(0,1.7fr) minmax(0,0.62fr) minmax(0,1.2fr)`, with the header row visible.
  - Below 560: one column. The header is hidden and each cell gets an inline label (e.g. "Next due · ").
  - Clause cell: register id in mono 11.5px, with "side letter v# · §#" under it in mono 10px `#6E6D67`.
  - Obligation cell: the investor, then the obligation text, then a mono line with type · owner.
  - Evidence cell: the status (12.5px/1.35 with a 7px dot), then its proof in mono 10px `#55544E`, indented 13px.

  | Clause | Investor | Obligation | Next due | Status |
  |---|---|---|---|---|
  | SL-CCRS-4.1 | Calder | Quarterly ESG data within 60 days of quarter end | 2026-11-29 | Q2 delivered |
  | SL-LSH-3.1 | Lanvik | Excuse from restricted-sector investments | each call | Applied to Call 07 |
  | SL-TMI-5.1 | Tamsin | Solvency II look-through report within 30 Business Days of quarter end | 2026-11-13 | Overdue · 2 Business Days |
  | SL-NUE-2.3 | Northfield | Management fee discount of 15 bps from 1 Jan 2027 | 2027-01-01 | Scheduled |
  | SL-LSH-9.0 | Lanvik | Sovereign immunity reservation | — | No action |

- **Status styles:**
  - Delivered or applied: green `#157F52` text with a solid green dot.
  - Scheduled or no action: ink text with a hollow dot (`box-shadow: inset 0 0 0 1px #8A887F`).
  - Overdue, in its final state: red `#C4341E` text and a solid red dot. The row has a red wash `#F6E3DF` with `box-shadow: inset 2px 0 0 #C4341E`. This is the only red on the tile.
- **Under the table:** "Tamsin's Q3 look-through report has not reached an approved contact. The other four each carry their proof."
- **Below the band:**
  - Evidence line: "SL-TMI-5.1 · Tamsin side letter v1 · §5.1 p.4 l.12–18 → due 2026-11-13 (Q3 end + 30 Business Days) → delivery log: none to an approved contact → OVERDUE · 2 BD → escalated to fund controller · 2026-11-17 09:00 ET"
  - Due-date note: "Due 13 Nov: 30 Business Days after quarter end. No delivery to an approved contact is logged, so the row stays open."
  - Caption
- **Reveal animation:** runs once, when the figure's top has scrolled into the upper 65% of the viewport. Use IntersectionObserver with `threshold: 0` and `rootMargin: "0px 0px -35% 0px"`.
  - Steps 1–5 at 300, 450, 600, 750 and 900ms: rows 1–5 fade in one after another (opacity, 300ms ease).
  - Step 6 at 1050ms: Tamsin's row turns red, meaning the wash, the inset edge, the text and the dot (200ms transitions). Before this step the row is ink, with a hollow grey dot ring.
  - Safety: if the reveal hasn't started within 4s of mount, or hasn't finished 4s after starting, jump to the final state. Show the final state immediately under `prefers-reduced-motion`, when `animateHero = false` or when IntersectionObserver is unavailable.
  - The prototype starts with rows hidden (`g1 = 0`). In production, server-render the final state (`g1 = 6`) and only reset it on the client when the animation will actually run.

### F2 MFN election matrix (in §03, after the step table)
- **Band:** `capital-call-flow.png`, veil 0.74.
- **Head:** "Aldercove Growth Fund III, L.P. · MFN round after Final Closing (2026-02-13)". Right: "compendium v2 circulated 2026-03-02", "election window closes 2026-04-01 (30 days)" and "tier rule: originating ≤ electing commitment".
- **Sheet title:** "Six provisions, four MFN-entitled LPs, one election recorded".
- **Part 1, the compendium** (mono label "Compendium as circulated · investor anonymised"): Item · Provision · Originating commitment · Electable.
  - Grid when main width ≥ 560: `minmax(0,0.62fr) minmax(0,1.6fr) minmax(0,0.9fr) minmax(0,1.05fr)`, with commitments right-aligned.
  - Below 560: one column, left-aligned.
  - Six items:
    - C-01 fee discount: electable by tier.
    - C-02 ESG data: electable by tier.
    - C-03 key-person notice: electable by tier.
    - C-04 excuse right: carve-out.
    - C-05 investor-specific regulatory: carve-out.
    - C-06 LPAC seat: carve-out.
  - Each provision shows its internal register id in grey, with the note "grey ref = internal register id, not circulated" (mono 10px `#6E6D67`).
- **Part 2, the election grid** (mono label "Election grid · register view · identities kept"): columns for LP-01, LP-03, LP-04 and LP-05 (name, id and commitment in each header), and rows C-01 to C-06.
  - When main width ≥ 520 it's a grid.
  - Below 520 it becomes one card per LP, listing that LP's six cells.
- **Cell styles** (all padding 6px, centred):

  | Cell | Style |
  |---|---|
  | Elected (Calder, C-01) | 1.5px green `#157F52` border, radius 6px, background `#E4F0EA`. "✓ Elected" is 12px weight 500 green, over the rule "40m ≤ 60m" in mono 10px green. The only green cell |
  | Ineligible · tier / Eligible · not elected | 11.5px/1.35 ink, over the rule in mono (e.g. "40m > 25m", "15m ≤ 60m") |
  | own provision | 11.5px `#8A887F` |
  | carve-out | 11.5px `#8A887F`, radius 4px, hatched with `repeating-linear-gradient(135deg, transparent 0 6px, #E8E5DF 6px 7px)` |

- **Grid footer:** "cells computed by the tier rule and carve-out table · counsel confirms each determination".
- **Below the band:**
  - Moment sentence: "Calder's election of C-01 is recorded with the tier check that allowed it. Counsel confirmed eligibility; the discount starts with the Q1 2027 fee."
  - Evidence line: "Compendium v2 · C-01 (SL-NUE-2.3 §2.3) → Calder election form signed 2026-03-24 → tier 40,000,000 ≤ 60,000,000; not a carve-out → ELECTED · effective 2027-01-01 → counsel confirmed; GP acknowledgement sent 2026-03-27"
  - Sample-assumption note: "this fund's MFN clause makes fee discounts electable by tier…". Keep it; law-firm guidance often treats fee discounts as a carve-out.
  - Caption

### F3 Evidence line breakdown (in §04)
- **Band:** `feat-side-letter-register.png`, veil 0.76.
- **Head:** "Example evidence line", with the fund name as fictional on the right.
- **Content:** Calder's Q2 ESG delivery as a full evidence line (mono 11.5px/1.9), then eight labelled parts: Source, Version, Locator, Value, Test, Status, Approver, Timestamp.
  - Labels sit in an 88px column in mono uppercase 10.5px `#6E6D67`; values are mono 11.5px.
- **Hover (two-way link):** hovering a part row highlights its matching segment in the line (background `#F1E6CF`, radius 3px, 160ms) and turns that row's label ink.

### F4 Clause-to-register blueprint (opens §05)
- **Band:** `mandate-guardrails.png`, veil 0.66.
- **Head:** "Side-letter register · harness blueprint · Aldercove Growth Fund III, L.P."
- **Sheet title:** "From clause to register row: what the model, the code and a person each do".
- **Stage grid:** a header row, Stage · count | Model (reads, proposes; no write tools) | Code (computes, decides pass/fail) | Person (signs, owns).
  - Grid when main width ≥ 600: `minmax(0,0.85fr) repeat(3, minmax(0,1fr))`, column gap 8px.
  - Below 600: one column; the header is hidden and each cell gets an inline lane label.
  - "none" cells mark where a lane is deliberately empty.
- **Six stages with their counts:**

  | Stage | Count |
  |---|---|
  | 01 Read documents | 7 documents |
  | 02 Classify and extract | 118 provisions (77 operative · 41 interpretive) |
  | 03 Merge duplicates | 64 obligations (77 − 13 duplicates) |
  | 04 Confirm | 105 register rows (64 obligations, 57 as proposed and 7 edited, + 41 no-action) |
  | 05 Resolve and schedule | 64 scheduled |
  | 06 Prove delivery | 1 overdue on 2026-11-17 (SL-TMI-5.1) |

- **Typed record strip:** "Typed record, model → code", then the record for SL-TMI-5.1 in mono 10.5px (`overflow-wrap: anywhere`).
- **Lineage panel:** "Lineage of one obligation": §5.1 span → confirmed by compliance 2026-03-06 → scheduled: Q3 due 2026-11-13 → delivery log: none to an approved contact → overdue · 2 BD → escalated to fund controller 2026-11-17. "overdue · 2 BD" is the only red.
- **Below the band:** moment sentence "Nothing enters the register until a person confirms it. The code, not the model, decides what is due and whether it was delivered.", then the caption, which notes that the counts tie.

### F5 Harness anatomy (in `#built-harness`)
- **Band:** `feat-side-letter-register.png`, veil 0.64.
- **Head:** "Harness anatomy".
- **Wide layout** (main width ≥ 600): a rounded ink frame holding a 3×3 grid of component cards, with the dark "Model · 01 pinned snapshot" card in the centre. The other cards are 02 Instructions, 03 Tools, 04 Retrieval and context, 05 State, 06 Validators, 07 Deterministic engines, 08 Orchestration and 09 Human review. Edge labels: 10 Observability (top), 11 Eval suites (bottom), 13 Permissions (left, vertical) and 12 Cost and latency budgets (right, vertical).
- **Narrow layout:** a stacked list with the same numbers and text.
- **Caption:** "The harness is everything around the model."

### F6 Review routing (in `#built-evals`)
- **Band:** `feat-mandate-guardrails.png`, veil 0.7.
- **Head:** "Review routing · 1,000 extracted fields".
- **Funnel bars:** ink bars, radius 6px, with mono white counts: Fields extracted 1,000 → Passed validators 912 → Auto-accepted 861.
- **Queue and sample:**
  - Review queue: 139 (88 failed a validator, 51 low confidence).
  - Sample: a green dot and "60 checked · 0 errors → error rate below 5% at 95% confidence".

### F7 Injection containment (in `#built-controls`)
- **Band:** `mandate-guardrails.png`, veil 0.64.
- **Head:** "Injection containment".
- **Pipeline:** untrusted input → Quarantined reader (model, read-only), inside a dashed boundary labelled "no tools · no egress" → Typed record (fields only) → Validators → Engine, then review.
- **Red-team case:** the seeded example, with a red dot on the flagged instruction.
- **Caption:** "The same boundary applies to side letters: the reader has no tools and no network…". Keep this re-caption.

### F8 How an engagement runs (after the Questions accordion)
- **Band:** `capital-call-flow.png`, veil 0.62.
- **Wide layout** (main width ≥ 600):
  - Four columns (`minmax(0,1fr) minmax(0,1.1fr) minmax(0,1.1fr) minmax(0,1fr)`, column gap 36px), headed Assess · 2 weeks, Build · 6–12 weeks · release every fortnight (spans 2), and Run · ongoing.
  - Phase pills are 64px tall, 1.5px ink border, radius 20px: diagnostic, then a build pill whose inner "shadow run" block (38% width, `#EEEBE4`) sits on the right, then in production.
  - Release ticks R1–R6 hang under the build pill.
  - A 1.5px green `#157F52` "acceptance" rule sits before Run.
  - Steps 1–11 are listed underneath.
- **Narrow layout:** stacked phases, with a green "acceptance" divider line.

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
| ≥ 520 | F2 election grid (below this, one card per LP) |
| ≥ 560 | F1 register table; F2 compendium table |
| ≥ 600 | §03 step table grid; F4 stage grid; F5 and F8 wide layouts |

- **No horizontal scrolling at any width.** Long mono strings (evidence lines, register ids, the typed record) use `overflow-wrap: anywhere`.

## State
| State | Type | Purpose |
|---|---|---|
| `vw`, `mw` | number | Viewport width and main-column width |
| `act`, `sub` | string | Active section id and active `#built` sub-id |
| `g1` | 0–6 | Hero reveal step. The prototype starts at 0; server-render 6, the final state |
| `mini` | bool | Mobile TOC open |
| `fq[6]` | bool[] | FAQ open flags (`[true, false, false, false, false, false]`) |
| `ev` | −1…7 | Hovered evidence-line part |
| `copied` | bool | "Link copied" flash |
| `readMin` | number | Computed read time |

The prototype's state also has `notice`, `g1h` and `g3h`, left over from the shared template; they aren't used on this page. All content is static; there is no data fetching.

## Props / feature flags
| Prop | Values | Effect |
|---|---|---|
| `ctaLabel` | "Book a mapping session" (default) · "Book a two-week audit" | Label for every page CTA. Mapping session links to `mailto:hello@3264.ai?subject=Side-Letter%20Register`; two-week audit links to the AI Engineering page `#engagement`. Replace with a booking URL when one exists |
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
| faint | `#8A887F` | Hollow status dots, own-provision and carve-out cells |
| rule | `#D9D6CF` | Borders |
| rule-2 | `#E8E5DF` | Hairlines |
| tile | `#FBFAF8` | Cards, callouts |
| wash | `#EEEBE4` | Active TOC item, sidebar card, shadow-run block |
| highlight | `#F1E6CF` | Evidence hover |
| accent / green | `#157F52` | Delivered status, the elected MFN cell, links on hover, progress bar, acceptance rule |
| green-bg | `#E4F0EA` | Elected MFN cell |
| red | `#C4341E` | Status only (overdue, flagged instruction) |
| red-bg | `#F6E3DF` | Overdue row wash |
| hatch | `repeating-linear-gradient(135deg, transparent 0 6px, #E8E5DF 6px 7px)` | Carve-out cells |
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
| Sheet | 11px |
| Elected cell | 6px |
| Carve-out cells | 4px |
| Cards, callouts | 14–16px |
| Closing panel | 18px |
| Phase pills (F5) | 20px |
| TOC items | 7–8px |
| Buttons | 6px |
| Pills | 999px |

**Shadows**
- Sheet: `0 12px 32px -20px rgba(20,20,18,.3)`
- Dropdown: `0 24px 48px -20px rgba(20,20,18,.25)`
- Glass badge: `inset 0 1px 0 rgba(255,255,255,.85), 0 18px 40px -16px rgba(20,20,18,.38)`
- Overdue row edge: `inset 2px 0 0 #C4341E`

**Spacing:** section rhythm 96px; subsection 48px; figure top margin 28–44px; paragraph 16px; list gaps 6–10px.

## Assets
All images are watercolour washes created for 3264.ai and sit in `assets/`.
- `assets/playbooks/*.png`: figure band backgrounds, card thumbnails and More playbooks tiles.
- `assets/valley-pastel.png`: the closing panel.

Icons are inline monoline SVGs (48×48 viewBox, stroke 2, round caps and joins), copied from the Playbooks icon set. There are no icon fonts and no external images.

## Content rules
- Every name, identifier and figure in the graphics is fictional. Keep the "fictional" labels. The counts reconcile across F1 and F4; keep them exact.
- The register records and schedules; it doesn't decide. Counsel decides MFN eligibility and carve-outs, and nothing enters the register until a person confirms it. The code, not the model, decides what is due and whether it was delivered.
- Don't claim the playbook makes a fund compliant with SEC side-letter rules. The SEC Preferential Treatment Rule was vacated in 2024; the obligations come from the LPA, the side letters and anti-fraud duties.
- Keep F2's sample-assumption note (in this fund, fee discounts are electable by tier).
- Don't write "AI-powered", "real-time", "autonomous" or "100% accurate".
- The regulatory rows are stated as of 28 September 2026. The pay-to-play proposal's comment period closes 9 Nov 2026; re-check every row before publishing.
- Before launch, run a name check on Aldercove, Calder County Retirement System, Lanvik Sovereign Holdings, Northfield University Endowment, Tamsin Mutual Insurance and Harlow Foundation against Companies House, EDGAR/IAPD and trademarks.

## Open items for 3264
- A real booking URL to replace the mailto link.
- Confirm that MFN election tracking is shipped. "Recently updated" says it is, and the MFN register row, the first question and F2 all depend on it. If it isn't live, remove them or label them as the planned design.
- There's no Fund Management industry page yet; the eyebrow links to the Playbooks index `#fund-management`. Confirm the final routes for it and the other playbooks.
- Keep the fund, LPs and Call 07 consistent with the Capital Call Flow page.
