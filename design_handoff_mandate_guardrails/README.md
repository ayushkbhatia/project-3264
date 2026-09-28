# Handoff: Mandate Guardrails playbook page

## Overview
Mandate Guardrails is one of 3264.ai's nine playbook pages. It's a long-form article about one automation playbook for asset managers' investment compliance teams. Each clause of an investment management agreement (IMA) becomes an approved, versioned rule. Every order is then tested before and after the trade by a deterministic rule engine, and every breach and override is kept on record. The model works only at encoding time, drafting rule specs for compliance to approve; no model sits between an order and its pass, warn or block.

The page does three things:
1. It explains the process today and where it breaks.
2. It shows how the playbook runs, with realistic document vignettes: the clause-to-rule card and the pre-trade check sequence.
3. It explains how the system is engineered and governed, then asks the reader to book a mapping session.

The page uses a template shared by all the playbook pages: Loan Ops Ledger, Covenant Watch, Capital Call Flow, NAV Pack Review, Investor Reporting, Side-Letter Register and Client Reporting Flow. Build it as one reusable `PlaybookPage` template plus per-page content and figures. This README is self-contained; you don't need the other handoffs to build this page.

Route suggestion: `/playbooks/mandate-guardrails`. Industry: Asset Management.

## About the design files
The files in this bundle are **design references created in HTML**. They are prototypes that show the intended look and behaviour, not production code to copy. Your task is to **recreate this design in the target codebase's existing environment**, using its established framework, component patterns and styling approach. If there is no environment yet, pick the most suitable framework (a static-first React framework such as Next.js or Astro fits this content-heavy page) and implement it there.

`Mandate Guardrails.dc.html` opens directly in a browser and needs `support.js` next to it. Every style is inline, so you can read exact values straight from the markup. Page logic (scroll-spy, hero reveal, accordion, hover links and so on) is the `class Component` script at the bottom of that file.

Some layout values in the logic (for example `sl…`, `cm…`, `mfn…`, `ir…`, `ca…`, `dd…`, `g1Ring`, `g1Row`, `g2…`, `g3…`, `g4…`, `cw…`, `dt…`, `sCols`, `wCols`, `pCols`, `tCols`, `plCols`, `scCols`, `lnCols`, `notice…`) are left over from the shared template and aren't used on this page. The values that matter are listed under Behaviour.

## Fidelity
**High-fidelity.** Colours, typography, spacing, radii, copy and interactions are final. Recreate them pixel-accurately with the codebase's own primitives. Where these specs and the HTML disagree, the HTML wins.

## Files in this bundle
| File | What it is |
|---|---|
| `README.md` | This spec |
| `copy-deck.md` | Every visible string in page order, extracted from the prototype, including figure text. Table rows are joined with " · " |
| `Mandate Guardrails.dc.html` | The page prototype: the source of truth for markup, styles, copy and logic |
| `support.js` | Runtime needed to open the prototype locally |
| `assets/` | Watercolour images used by figure bands, cards and the closing panel |

Open `Mandate Guardrails.dc.html` in a browser, served from this folder so the relative `assets/` paths resolve.

---

## Page anatomy

```
┌ Header (sticky, 68px) ─────────────────────────────── progress bar (2px) ┐
│ [below 1048px] "On this page" bar (sticky under header, 44px)            │
├──────────────────────── max-width 1048px, centred ────────────────────────┤
│  Sidebar 200px (sticky)  │ gap 88px │  Main column, max-width 680px       │
│  ← All playbooks         │          │  Hero + F1 clause-to-rule card      │
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
  - Text: "Start with one mandate", 14.5px, line-height 1.4.
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
| Rules strip (§06) | List with border-top 1px ink, margin-top 22px. Rows: flex-wrap, gap 4px 24px, padding 14px 0, border-bottom `#E8E5DF`. Date column 96px (mono 11.5px); title 14.5px/1.4 weight 500; description 14px/1.6 `#55544E`. The date is in the H2 ("The rules, as of 28 September 2026"), so there is no separate status line |
| Terms | `<dl>` with border-top 1px ink. Rows: flex-wrap, gap 3px 24px, padding 13px 0, border-bottom `#E8E5DF`. `dt` is `flex: 0 0 200px`, 14px weight 500; `dd` is 14px/1.6 `#55544E` |
| FAQ accordion | Border-top 1px ink. Question button: full width, padding 16px 0, 15.5px/1.4, letter-spacing -0.012em, "+" or "−" in mono 15px `#55544E`, hover colour `#157F52`. Answer: 14.5px/1.7, padding-bottom 18px |
| Related playbook card (end of §02) | "Related playbook · Private Credit", linking to Covenant Watch. Same styling as the related-page card below |
| Mid-page CTA band (end of §04) | margin-top 44px; padding 22px 24px; radius 16px; background `#1A1917`; text `#F4F3F0`. Title "Bring one IMA" 18px/1.3; sub-line 13.5px/1.55 `rgba(244,243,240,0.8)`. Button 40px tall, padding 0 18px, `#F4F3F0` background, ink 13.5px weight 500 text, radius 6px, hover `#FFFFFF` |
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
- **Eyebrow:** "Playbook · Asset Management", 13px `#55544E`. "Asset Management" links to the Playbooks index `#asset-management` (there's no Asset Management industry page yet), with a 1px underline `rgba(20,20,18,0.25)`.
- **H1:** "Mandate Guardrails", margin-top 14px, `clamp(34px, 3.8vw, 48px)`, weight 400, letter-spacing -0.038em, line-height 1.02.
- **One-liner:** "Investment guidelines turned into approved, versioned rules, tested before and after each trade, with every breach and override on record." Margin-top 16px, `clamp(16.5px, 1.4vw, 18.5px)`, line-height 1.45, `#55544E`.
- **Meta row:** margin-top 22px, padding-top 12px, border-top `#E8E5DF`, 12.5px `#6E6D67`, flex-wrap, gap 6px 16px.
  - "Reviewed 28 September 2026"
  - "N min read" (computed; see Behaviour)
  - "Copy link" button, pushed right with `margin-left: auto`, ink text
- **Standfirst:** margin-top 26px, 16px/1.7 `#2C2B27`.
- **CTAs:** margin-top 24px, gap 10px. Primary "Book a mapping session"; secondary "See how it is built" (links to `#built`).
- **Hero figure:** F1, margin-top 44px.

### 01 The work today (`#today`)
Eyebrow, H2 "Guidelines live in a PDF; limits live in the OMS", intro, the six-step list, then the Inputs (7) and Outputs (6) cards.

### 02 Where it breaks (`#breaks`)
Eyebrow, H2 "Where mandate compliance goes wrong", four numbered breaks:
1. Limits breached, and missed
2. One clause, two codings
3. Passive breaches left to age
4. A review without its evidence

Then the related playbook card: "Related playbook · Private Credit", Covenant Watch ("The same problem in private credit: a ratio passes or fails on the agreement's own definitions…").

### 03 How it runs (`#runs`)
Eyebrow, H2 "The model drafts rules. Code tests every order.", intro, then:
- **F2** the pre-trade check sequence
- the step table: seven rows (Mandate intake, Rule drafting, Pre-trade and in-trade, Daily batch, Breach record and notices, IMA amendment, Annual review)
- the "Never automated" callout

### 04 The evidence (`#evidence`)
Eyebrow, H2 "Every result traces back to a clause and an approver", body, then:
- **F3** the evidence line breakdown
- H3 "Kept for every run" and its eight-item grid
- the dark mid-page CTA band: "Bring one IMA", with the sub-line "We will walk through how its clauses become versioned rules, where the interpretation calls sit, and who signs each one."

### 05 How it is built (`#built`)
Eyebrow, H2 "Rule engine at run time; model at encoding time", intro, then **F4** the clause → rule → test blueprint. Then five subsections with anchors:
- `#built-harness`: **F5** harness anatomy directly under the H3, then five bullets, then **F6** consistency across repeated runs
- `#built-data`: seven bullets on sources and formats
- `#built-hard`: five Hard / We pairs, with **F7** the denominator table after the second pair
- `#built-evals`: seven bullets, then **F8** the engagement lifecycle
- `#built-controls`: six bullets

The section ends with the "How we build → AI Engineering" card. This page has no review-routing, evidence-bundle or injection figure.

With `showBuilt = false`, the section shows only its eyebrow and the AI Engineering card, and the TOC hides the sub-items.

### 06 Rules (`#rules`)
Eyebrow, H2 "The rules, as of 28 September 2026", then five dated rows:

| Date | Rule |
|---|---|
| 2025-05-21 | ESMA fund-names guidelines apply to existing funds |
| 2025-11-17 | SEC FY2026 exam priorities |
| 2026-06-11 | Names Rule compliance, fund groups of $1bn or more |
| 2026-09-14 | SEC risk alert on annual compliance reviews |
| 2026-12-11 | Names Rule compliance, fund groups under $1bn (a future date) |

### Terms (`#terms`), Recently updated (`#updated`), Questions (`#questions`)
- **Terms:** H2, then twelve terms.
- **Recently updated:** H2, then two rows dated 2026-09-28 (14.5px/1.55, border-bottom `#E8E5DF`, padding 13px 0):
  - the rules strip update
  - the evidence list naming the annual-review testing records
- **Questions:** H2, then a six-item accordion with the first item open:
  1. Does the model decide whether a trade is allowed?
  2. Can it stop every breach?
  3. What happens when the IMA is amended?
  4. Do we have to replace our order management system?
  5. Where does the model run, and what data does it see?
  6. What does this give the annual compliance review?

### More playbooks (after main)
- Container: max-width 1048px, padding `120px clamp(20px,4vw,40px) 0`.
- Heading row: H2 "More playbooks" (`clamp(22px, 2.2vw, 28px)`, weight 400) with "All nine playbooks →" on the right, then border-bottom `#E8E5DF`.
- Three cards in a `repeat(auto-fit, minmax(min(100%,280px),1fr))` grid:
  - 2:1 image tile, radius 14px, with a centred glass icon badge
  - category 12px `#6E6D67`
  - title 17.5px, letter-spacing -0.02em
  - one-liner 13.5px/1.55 `#55544E`
  - hover: text turns `#157F52`
- Current cards: Client Reporting Flow, Investor Reporting and Covenant Watch, each linking to its page.
- **Glass badge:** centred, height 34% of the tile, square, radius 28%. Background `rgba(250,249,246,0.62)`, `backdrop-filter: blur(18px) saturate(1.3)`, border `1px solid rgba(255,255,255,0.72)`, shadow `inset 0 1px 0 rgba(255,255,255,0.85), 0 18px 40px -16px rgba(20,20,18,0.38)`. The icon is a 48×48 viewBox monoline SVG at 48% of the badge, stroke `#1A1917`, width 2, round caps and joins.

### Closing
- Section padding `104px clamp(20px,4vw,40px)`, border-bottom `rgba(20,20,18,0.075)`.
- **Panel:** max-width 968px, border `1px solid rgba(20,20,18,0.13)`, radius 18px. Background `assets/valley-pastel.png` (centre 60%, cover) with a veil `linear-gradient(180deg, rgba(248,246,240,.7) 0%, rgba(248,246,240,.5) 60%, rgba(248,246,240,.35) 100%)`. Padding `clamp(40px,5vw,64px) clamp(24px,4vw,56px)`.
- **Layout:** flex-wrap, `align-items: flex-end`, `space-between`, gap 32px.
- **H2:** "Start with one mandate", `clamp(26px,2.8vw,38px)`, weight 400, letter-spacing -0.032em, line-height 1.08, max-width 620px.
- **Line:** "Bring one IMA. We will walk through how its clauses become versioned rules, where the interpretation calls sit, and who signs each one." 15px/1.6 `#2C2B27`, max-width 520px.
- **Button:** 42px tall, padding 0 20px, ink background, white 14px weight 500 text, radius 6px.

### Footer
Site-standard footer, the same as the Playbooks page.

---

## Figures
All data is fictional. The mandate is the Quillmere Global Credit Mandate (IMA-QGCM-2025, amendment 1 dated 2026-03-02), run for the Ashby Borough Pension Fund, account ACCT-ASHBY-01, with a £500.00m portfolio including cash. The issuer group in F1 and F2 is Brackwell Utilities. Exact strings are in `copy-deck.md`; exact markup is in the prototype. The numbers reconcile (for example 23.10 / 500.00 = 4.62%): keep them exactly as given.

### F1 Hero: one clause, its rule and today's result
- **Band:** `mandate-guardrails.png`, veil 0.7.
- **Head:** "Clause-to-rule lineage · batch test". Right: "IMA-QGCM-2025 · amendment 1 (2026-03-02)" and "run R-2026-09-27-0412 · snapshot SNAP-ABOR-20260926".
- **Sheet title:** "Quillmere Global Credit Mandate (fictional)", with the sub-line "Client: Ashby Borough Pension Fund (fictional) · account ACCT-ASHBY-01".
- **Layout:** the card is stacked top to bottom. The reading column is too narrow to set the clause and its rule side by side. It has seven parts:
  1. **Source clause:** mono label "Source · investment guidelines schedule", then "Schedule 2 · Investment restrictions · p.14", then clause 4.2 (b) and (c) at 14.5px/1.6 ink. The words "investment grade" carry a drawn underline: `background-image: linear-gradient(#1A1917, #1A1917)`, `left bottom`, `background-size` 0% → 100% × 1.5px, 300ms.
  2. **Interpretation note:** "Interpretation note IN-4.2(c)-02 · approved", margin-top 12px, padding 2px 0 2px 12px, `border-left: 2px solid #1A1917`. Label in mono 10.5px `#55544E`, then the definition of investment grade.
  3. **Rule settings:** "Rule MG-0412 v3 · approved, read-only", listing:
     - Numerator: market value, all issuers in parent group
     - Denominator: total portfolio market value incl. cash
     - Limit: ≤ 5.00%, tested pre-trade and daily batch
     - Warning: 4.50%, pre-trade and in-trade only
     - Rating: ≥ BBB− at purchase, middle of 3, lower of 2
     - Approved: head of investment compliance, 2026-09-14 10:22
  4. **Holdings table:** "Brackwell Utilities group (fictional) · 26 Sep 2026", with Holding · Market value £m · % of portfolio.
     - Rows: four holdings (11.25 / 2.25, 7.25 / 1.45, 2.60 / 0.52, and the 5.00% 2034 bought 22 Sep at 2.00 / 0.40), the issuer group total 23.10 / 4.62, and the portfolio incl. cash 500.00 / 100.00.
     - When main width ≥ 540 it's the full table. Below that, the header is hidden and the figures sit on a sub-line.
  5. **Split-rating line:** "Rating at purchase · 5.00% 2034: Baa3 · BB+ · BBB− → middle BBB− · investment grade".
  6. **Result bar:** "4.62%" in mono 20px weight 500, letter-spacing -0.02em. Beside it, "vs 5.00% limit · headroom 0.38 pp (£1.90m)" in mono 11px `#55544E`, then a 7px dot and "PASS" in mono 12px weight 500.
     - Final state: the bar background is `#E4F0EA`, and PASS and its dot are green `#157F52`.
     - Before the reveal: the background is `#F1EEE8`, PASS is `#8A887F` and the dot is `#D9D6CF`.
  7. **Version history:** "Rule MG-0412 · version history", three versions:
     - v1 · 2025-11-03: onboarding, single issuer ≤ 5%
     - v2 · 2026-03-02: amendment 1, issuer group
     - v3 · 2026-09-14: rating rule defined
- **Under the card:** "“Investment grade” read as the middle of three ratings, as compliance approved on 14 September."
- **Below the band:**
  - Evidence line: "IMA-QGCM-2025 amdt 1 · Sch.2 §4.2(c) p.14 → Brackwell Utilities group 23.10 / 500.00 = 4.62% → MG-0412 v3 ≤ 5.00% · R-2026-09-27-0412 → PASS · headroom 0.38 pp → approved: head of investment compliance · 2026-09-14 10:22"
  - Note: "Split ratings: middle of three says investment grade; the lowest says high yield. Compliance chose the rule, and it is written into v3."
  - Caption
- **Reveal animation:** runs once, when the figure's top has scrolled into the upper 65% of the viewport. Use IntersectionObserver with `threshold: 0` and `rootMargin: "0px 0px -35% 0px"`; this card is taller than a phone screen, so a percentage threshold would never fire.
  - The six steps are at 300, 650, 1000, 1350, 1700 and 2050ms. Only the first three change anything:
    - Step 1: the "investment grade" underline draws (300ms).
    - Step 2: the interpretation note fades in (opacity, 350ms).
    - Step 3: PASS turns green, meaning the bar background, the text and the dot (200ms).
  - Safety: if the reveal hasn't started within 4s of mount, or hasn't finished 4s after starting, jump to the final state. Show the final state immediately under `prefers-reduced-motion`, when `animateHero = false` or when IntersectionObserver is unavailable.
  - The prototype starts at `g1 = 0`. In production, server-render the final state (`g1 = 6`) and only reset it on the client when the animation will actually run.

### F2 Pre-trade check sequence (in §03)
- **Band:** `client-reporting-flow.png`, veil 0.74.
- **Head:** "Pre-trade compliance · check sequence". Right: "order QGC-26-0917-031 · 2026-09-17" and "book IBOR · portfolio £500.00m incl. cash".
- **Sheet title:** the mandate and client lines, then the order in mono: "side BUY · nominal 2,500,000 · security Brackwell Utilities plc 4.25% 2031 · price 98.00 · value £2.45m".
- **Table:** # · Rule · Test (IMA clause) · Projected · Limit · Result.
  - Grid when main width ≥ 560: `18px minmax(0,.72fr) minmax(0,1.55fr) minmax(0,.95fr) minmax(0,.95fr) minmax(0,.66fr)`.
  - Below 560: `18px minmax(0,1fr)`. Each check becomes a two-line row: the rule and test, then a mono line with the timestamp · projected · limit · result.

  | # | Rule | Test | Result |
  |---|---|---|---|
  | 1 | MG-0401 v2 | Permitted instruments (§3.1) | PASS |
  | 2 | MG-0412 v3 | Investment grade at purchase (§4.2(c)) | PASS |
  | 3 | MG-0412 v3 | Issuer group 4.71%, from 4.22%, warn 4.50%, max 5.00% | WARN |
  | 4 | MG-0415 v1 | Utilities sector ≤ 20% | PASS |
  | 5 | MG-0430 v1 | Duration within ±1.50 yrs | PASS |
  | 6 | RL-FIRM | Firm restricted list (issuer listed 2026-09-16) | BLOCK |

- **Result styles:**
  - WARN: an outlined badge (inline-block, padding 0 5px, 1px ink border, radius 4px, mono 10.5px weight 500).
  - BLOCK: red `#C4341E` text (mono 11px weight 500) with a red dot. It's the only red row.
- **HELD bar:** outlined in red, with a red dot, "HELD" (weight 600, red) and "6 checks · 4 pass · 1 warning · 1 block → not released · no FIX 35=D sent · 09:14:03.006".
- **Below the band:**
  - Moment sentence: "The order stops in the OMS. Nothing reaches the broker until the block is cleared."
  - Evidence line: "QGC-26-0917-031 · ACCT-ASHBY-01 · pre-trade · IBOR 2026-09-17 09:14:02 → 6 checks → MG-0412 v3 WARN 4.71% (warn 4.50%) · RL-FIRM BLOCK → order held, no 35=D → routed to portfolio manager and compliance · 09:14:03"
  - Note: "…A warning can be overridden with a reason; a block cannot."
  - Caption

### F3 Evidence line breakdown (in §04)
- **Band:** `feat-mandate-guardrails.png`, veil 0.76.
- **Head:** "Example evidence line", with the mandate named as fictional on the right.
- **Content:** F1's evidence line in full (mono 11.5px/1.9), then eight labelled parts: Source, Version, Locator, Value, Test, Status, Approver, Timestamp.
  - Labels sit in an 88px column in mono uppercase 10.5px `#6E6D67`; values are mono 11.5px.
- **Hover (two-way link):** hovering a part row highlights its matching segment in the line (background `#F1E6CF`, radius 3px, 160ms) and turns that row's label ink.

### F4 Clause → rule → test blueprint (opens §05)
- **Band:** `mandate-guardrails.png`, veil 0.66.
- **Head:** "How it is built · clause → rule → test".
- **Sheet title:** "The model drafts rules. It never tests an order.", with the sub-line "Mandate Guardrails harness · rule MG-0412 v3 · Quillmere Global Credit Mandate (fictional)".
- **Two lanes:** side by side when main width ≥ 600 (`repeat(2, minmax(0,1fr))`), stacked below. Steps are joined by ↓.
  - **Encoding time** (each new IMA, amendment or interpretation): IMA clause ↓ Model drafts (MODEL) ↓ Code checks (CODE) ↓ Compliance approves (PERSON) ↓ Rule library ("approved versions → loaded into the rule engine").
  - **Run time** (every order, every execution, every night): Orders, positions ↓ Rule engine (CODE ONLY) ↓ People decide (PERSON) ↓ Model drafts (MODEL), the breach narrative, after the decision.
  - Under the rule engine, in mono 10.5px ink: "no model between the order and pass / warn / block".
  - Legend: model · code · person · data or store.
- **Rule spec:** "Rule spec · approved · MG-0412 v3", a mono YAML-like block covering source, note, part 1 (issuer group) and part 2 (credit quality), with the approver and timestamp.
  - This block scrolls sideways inside its own box. It's the only horizontal scrolling on the page, and it's contained: the page itself never scrolls sideways.
- **Boundary tests:** "Boundary tests · synthetic portfolios · run before approval", with Test · Setup · Expected · Engine.
  - Grid when main width ≥ 540: `minmax(0,.85fr) minmax(0,1.9fr) minmax(0,.7fr) minmax(0,.8fr)`. Below 540: `minmax(0,.9fr) minmax(0,1.6fr) minmax(0,.8fr)`.
  - Seven tests, SYN-0412-01 to 07. They cover the 5.00% "no more than" edge, aggregation across the group, split and two-rating cases, and a downgrade after purchase (no breach).
  - Footer: a green dot, "7 / 7 as expected" (green, weight 500) and "· suite must pass 100% before approval".
- **Caption:** "The model drafts rule specs at encoding time. Approved rules run as deterministic code…"

### F5 Harness anatomy (directly under the `#built-harness` H3)
- **Band:** `feat-side-letter-register.png`, veil 0.64.
- **Head:** "Harness anatomy".
- **Wide layout** (main width ≥ 600): a rounded ink frame holding a 3×3 grid of component cards, with the dark "Model · 01 pinned snapshot" card in the centre. The other cards are 02 Instructions, 03 Tools, 04 Retrieval and context, 05 State, 06 Validators, 07 Deterministic engines, 08 Orchestration and 09 Human review. Edge labels: 10 Observability (top), 11 Eval suites (bottom), 13 Permissions (left, vertical) and 12 Cost and latency budgets (right, vertical).
- **Narrow layout:** a stacked list with the same numbers and text.
- **Caption:** "The harness is everything around the model. In this playbook the model sits at encoding time…"

### F6 Consistency across repeated runs (in `#built-harness`, after the bullets)
- **Band:** `feat-nav-pack-review.png`, veil 0.66.
- **Head:** "Consistency across repeated runs".
- **Chart:** an inline SVG line chart for k = 1–10 at a 0.95 per-run success rate. pass^k (all k runs correct) is a solid ink line falling to 0.60; pass@k (at least one) is a dashed grey line reaching about 1.00. Axis and end labels are mono.
- **Caption:** "Illustrative maths, not measured performance…". On this page the chart explains why no model is used at run time.

### F7 Which denominator? (in `#built-hard`, after the second pair)
- **Band:** `feat-nav-pack-review.png`, veil 0.72.
- **Head:** "Why it is hard · which denominator?"
- **Sheet title:** "One holding, one “5%” limit, four readings", with the sub-line "A fictional portfolio · holding in one issuer: £4.9m · limit: no more than 5.00%".
- **Table:** Denominator · Denominator £m · Holding % · Result.
  - Grid when main width ≥ 540: `minmax(0,2fr) minmax(0,.8fr) minmax(0,.7fr) minmax(0,.6fr)`. Below 540: `minmax(0,1fr) auto auto`, with the £m amount shown under the denominator name.
  - Rows: Total assets 98.0 / 5.00 / pass; Net assets 95.1 / 5.15 / fail; Net assets + £2.3m borrowings for investment purposes 97.4 / 5.03 / fail; Invested assets, excluding cash 91.3 / 5.37 / fail.
  - "fail" is red, in mono 11px weight 500, with a red dot.
- **Below the band:** moment sentence "The same words pass under one denominator and fail under three. The rule has to name which.", then the caption, which contrasts the Names Rule and s.5(b)(1) denominators.

### F8 How an engagement runs (in `#built-evals`)
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
| ≥ 540 | F1 holdings table; F4 boundary-test columns; F7 denominator table |
| ≥ 560 | F2 check table |
| ≥ 600 | §03 step table grid; F4 lanes side by side; F5 and F8 wide layouts |

- **No horizontal scrolling at any width.** Long mono strings (evidence lines, rule ids, order ids) use `overflow-wrap: anywhere`. The one exception is the F4 rule spec, which scrolls sideways inside its own box.

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
| `ctaLabel` | "Book a mapping session" (default) · "Book a two-week audit" | Label for every page CTA. Mapping session links to `mailto:hello@3264.ai?subject=Mandate%20Guardrails`; two-week audit links to the AI Engineering page `#engagement`. Replace with a booking URL when one exists |
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
| faint | `#8A887F` | PASS before the reveal, empty cells |
| rule | `#D9D6CF` | Borders, the unrevealed PASS dot |
| rule-2 | `#E8E5DF` | Hairlines |
| tile | `#FBFAF8` | Cards, callouts |
| wash | `#EEEBE4` | Active TOC item, sidebar card, shadow-run block |
| highlight | `#F1E6CF` | Evidence hover |
| accent / green | `#157F52` | PASS, the 7 / 7 test line, links on hover, progress bar, acceptance rule |
| green-bg | `#E4F0EA` | F1 result bar |
| row-hi | `#F1EEE8` | F1 result bar before the reveal |
| red | `#C4341E` | Status only (BLOCK, HELD, fail) |
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
| WARN badge | 4px |
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

**Spacing:** section rhythm 96px; subsection 48px; figure top margin 28–44px; paragraph 16px; list gaps 6–10px.

## Assets
All images are watercolour washes created for 3264.ai and sit in `assets/`.
- `assets/playbooks/*.png`: figure band backgrounds, card thumbnails and More playbooks tiles.
- `assets/valley-pastel.png`: the closing panel.

Icons are inline monoline SVGs (48×48 viewBox, stroke 2, round caps and joins), copied from the Playbooks icon set. There are no icon fonts and no external images.

## Content rules
- Every name, identifier and figure in the graphics is fictional. Keep the "fictional" labels. The numbers reconcile; keep them exact.
- No model sits between an order and its pass, warn or block. The model drafts rule specs at encoding time and breach narratives after a person has decided. Compliance approves every rule version, and the approver and timestamp are recorded.
- A warning can be overridden with a reason; a block cannot. Keep that distinction wherever results are described.
- Don't claim the playbook stops every breach; the page's own answer says it can't.
- The "middle of three" rating rule is this mandate's approved interpretation, not a market standard. Keep "as compliance approved".
- F6 is illustrative maths, not measured performance. Keep that label.
- Don't write "AI-powered", "real-time", "autonomous" or "100% accurate".
- The regulatory rows are stated as of 28 September 2026, and the 2026-12-11 row is a future date. Re-check every row before publishing.
- Before launch, run a name check on Quillmere, Ashby Borough Pension Fund and Brackwell Utilities against Companies House, EDGAR/IAPD and trademarks.

## Open items for 3264
- A real booking URL to replace the mailto link.
- The answer to "Do we have to replace our order management system?" uses suggested "No…" wording from the research handoff. Confirm it's 3264's position before publishing.
- There's no Asset Management industry page yet; the eyebrow links to the Playbooks index `#asset-management`. Confirm the final routes for it and the other playbooks.
