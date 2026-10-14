# Handoff: Asset Management industry page

## Overview
`/asset-management` is the industry page for asset managers. It is written for COOs, heads of investment operations, compliance, client service and performance.

The page tells one story: client reports, guideline checks and RFP answers are assembled by hand today, and the page shows them becoming measured, owned and traceable. It moves through nine stages:

1. Premise
2. Operations audit
3. First 100 days, a build log that ends with a 3-day client report
4. Traceability, where every figure and claim in a client report carries its lineage
5. Across strategies
6. Playbooks
7. Value, a capacity bridge
8. Related work
9. Engagement, followed by the closing band

**This page uses the same framework as the other industry pages.** Fund Management, Financial Services and Private Equity share its components, layout, timings, easing curves, helpers and accessibility rules. The full mechanical spec is in **`framework-reference.md`**.

This README lists only what is specific to Asset Management: copy, data, linkage and formula values. **Build all four industry pages from one shared component set** and pass each page's content in as data.

## About the design files
The files in `reference/` are **design references built in HTML**. They are prototypes showing the intended look and behaviour, not production code to copy. Recreate them in the target codebase using its established patterns. If there is no codebase yet, use a static-first React framework.

To open the prototype, serve `reference/` as a static folder (for example `npx serve reference`) and open `Asset Management.dc.html`. `support.js` and `Site Header.dc.html` must sit beside it. Styles are inline. Behaviour lives in the `class Component` script, in the methods `runIntro`, `initVeil`/`stepVeil`, `stepStack`, `stepDiag`, `stepPlan`, `stepTrace`, `stepPort`, `stepValue` and `stepEngage`.

## Fidelity
**High fidelity.** Where this README, `framework-reference.md` and the HTML disagree, the HTML wins.

## Files
| Path | What it is |
|---|---|
| `README.md` | Asset Management specifics (this file) |
| `framework-reference.md` | Shared component mechanics: tokens, helpers, every animation's timing |
| `CHECKLIST.md` | Acceptance checklist |
| `copy-deck.md` | All visible copy plus the Traceability data |
| `screenshots/01–15` | Every section at 1526px, mid-animation |
| `reference/…` | Page prototype, shared header, runtime, every image |

---

## Header and menu linkage
- **Header.** Render the shared **`SiteHeader`**, sticky. Mark **Industries** and **Asset Management** as current with `aria-current="page"`.
- **Industries dropdown and phone accordion.** Asset Management now links to **`/asset-management`**, with thumbnail `assets/playbooks/mandate-guardrails.png` and the description "Research synthesis, mandate compliance and client reporting." The full menu now links all five industries to their own pages: Private Credit, Private Equity, Financial Services, Fund Management and Asset Management.
- **Footers sitewide.** "Asset Management" in the Industries column now links to `/asset-management` on every page. On this page it links to `#top`.
- **Home.** The Industries card "R4 Asset Management" links to this page, labelled "Explore →".
- **Outbound links from this page:**
  - Playbook cards go to `/playbooks/mandate-guardrails`, `/playbooks/client-reporting-flow`, `/playbooks/research-intake` and `/playbooks/investor-reporting`. "All nine playbooks" goes to `/playbooks`.
  - Case-study cards go to `/work/<slug>`. "All work" goes to `/work`.
- **Anchors.** `#top`, `#audit`, `#plan`, `#trace`, `#portfolio`, `#playbooks`, `#value`, `#work` and `#engagement`, each with `scroll-margin-top: 68px`. Every "Book…" CTA jumps to `#engagement`.

---

## Section specifics
For each section's mechanics and timing, see the matching section in `framework-reference.md`.

### 0 · Intro overlay
- **Rows:** "map the mandates" · "rank by hours and risk" · "ship the first workflow" · "carry it to the next strategy".
- **Footer:** "5 strategies live · day 100".
- **Corner labels:** "Mandate log" and "click to skip".

### 1 · Hero (`#top`). Screenshot 01
- **Eyebrow:** "Asset Management".
- **h1:** "Every mandate checked. / Every claim sourced."
- **Lede:** covers guideline checks, client reporting, research intake and RFP responses, and ends "…an audit trail your compliance team, clients and consultants can follow."
- **CTAs:** "Book an operations audit" and "See the first 100 days".
- **Image:** `hero-valley.png`, the same artwork as the Home page hero, with a colour reveal that follows the cursor. The greyscale base and the colour layer must be the same artwork.

### 2 · 01 / Premise. Screenshots 02–04
h2: "Every client report is a project. / Very little of it is reusable."

**Card 1 — What every team has** (background `ai-eng-wash.png`)
- **Statement:** "Every team assembles its reports by hand. Most of the evidence lives in inboxes."
- **Window:** *Workload tracker — Global equity · Q3*.
- **Rows:**
  - Guideline checks: rules held in mandate PDFs · Compliance · Manual
  - Client reports: rebuilt in slides each quarter · Client service · Manual
  - Attribution commentary: drafted from a spreadsheet · Investment · Manual
  - RFP and DDQ answers: last year's answers, edited · Sales · **Backlog** (red)
  - Research notes: read overnight, summarised by hand · Research · Copy-paste
  - Consultant requests: collated by email · Client service · **Overdue** (red)
- **Footer:** "6 workflows · 0 automated · 0 measured".

**Card 2 — What the COO sees** (background `cta-e.webp`)
- **Statement:** "Six strategies, six ways of working. Nobody can say what a client report costs."
- **Window:** *Control dashboard — all strategies · Q3*, titled "Turnaround by strategy".
- **Rows:** Global equity, UK equity income, Multi-asset, Fixed income, Emerging markets and Liquid alternatives.
- **Total row:** "All strategies · 14 avg · 265 · **41**".
- **Quote:** consultant review, "**inconsistent evidence of review** across strategies."

**Card 3 — What did not change** (background `cta-a.jpeg`)
- **Statement:** "Clients still expect the report on time, and every claim in it has to stand up."
- **Window:** *Client calendar — 2026*.
- **Timeline:** Q1 reports (Apr) → Q2 reports → Q3 reports → Consultant review (Feb) → Mandate review (Mar).
- **Client and consultant requests:**
  - Evidence of every guideline check, by mandate
  - Support for every performance figure in the report
  - Controls over trade overrides
  - Attribution behind each commentary claim
  - Who reviewed each exception, and when (highlighted)
- **Footer:** "5 of 5 open · consultant review in February".

### 3 · 02 / Operations audit (`#audit`), 19s loop. Screenshots 05–06
- **h2:** "In two weeks, we walk every document-heavy workflow and rank where automation returns the most time and removes the most risk."
- **Rows (strategies):** Global equity (Long-only), Liquid alternatives (Absolute return), Multi-asset (Solutions), Fixed income (Credit and rates), Emerging markets (EM equity), UK equity income (Income).
- **Columns (workflows):** Guideline checks, Trade allocation, Research intake, Attribution, Client reports, RFP and DDQ.
- **Cells:** FTE released per quarter.
- **Shortlist** (the bubble plot positions are the same as the framework's):
  - 0-0 Global equity · guideline checks, 1.2
  - 4-3 EM · attribution, 0.8
  - 3-4 Fixed income · client reports, 0.7
  - 5-0 UK income · guideline checks, 0.6. Shown as "from build 01" because it reuses the Global equity build.
  - 2-4 Multi-asset · client reports, 0.9
- **Ranked list:** titled "First builds · asset manager". Its total reads "4.2 FTE released across five builds · Build 04 reuses build 01".
- **Step strip:**
  - "Walk-throughs with investment, compliance and client service"
  - "Each workflow scored on hours, error risk, data readiness and control gaps"
  - "A ranked, costed plan for each strategy and one for the platform"

### 4 · Audit CTA band. Screenshot 07
"Start with a two-week operations audit." with the button "Book an audit →", which goes to `#engagement`.

### 5 · 03 / First 100 days (`#plan`). Screenshot 08
- **Window:** "Build log — Global equity · Q3".
- **Gantt rows:** Audit 0–14, Platform 8–30, **Pre-trade guideline checks 14–42**, **Client report drafting 36–64**, **Attribution commentary 56–86**, Evaluation 70–100.
- **Log:**
  - D03: baseline of "11 days per client report, 6.2 FTE on drafting"
  - D30: platform live in the manager's own Azure tenant
  - D42: "420 rules tested before every trade"
  - D64: client reports live, "every figure tied to the books"
  - D86: commentary live, "each claim checked against attribution"
  - D100: "report turnaround measured at 3 days"
- **KPI:** "Days per client report" = `round(11 − e)`, where `e` adds 5 at D42, 2 at D64 and 1 at D86. It runs **11 → 3**.
- **Other counters:** hours back per quarter, 0 → 820. "Quarter checklist · Q3".

### 6 · Traceability (`#trace`). Screenshot 09
- **h2:** "Click any figure. / See where it came from."
- **Window:** "Client report — Global Equity Fund · Q3 2026", mandate GE-07, quarter to 30 Sep.
- **Six rows,** each with four lineage steps (Source → Matched to → Check → Reviewed):

  | Figure | Value | Key check |
  |---|---|---|
  | Fund return, Q3 | +3.4% | Agrees to the published NAV for every day |
  | Benchmark return | +2.1% | Same index, currency and return type as the mandate |
  | Active return | +1.3 pts | Attribution effects (selection +1.0, allocation +0.3) sum to it |
  | Largest overweight | Technology +4.2 pts | Within the ±5 pt sector limit |
  | Commentary: "selection in technology led" | +0.8 pts | Largest positive selection effect, so the claim is checked against attribution |
  | **Guideline breaches** | **None** | No breach or unrecorded override across 1,240 orders |

- **Long labels.** Row 5 is a sentence. Allow it to wrap inside the row button; the value stays right-aligned.
- **Footer note:** "Same trail in the consultant's review".
- **Behaviour:** the same as the framework. The rows auto-advance every 5.6s, clicking a row pauses the auto-advance, and the steps re-stagger each time the selected row changes.

### 7 · 04 / Across strategies (`#portfolio`), dark 16s loop. Screenshot 10
- **Library slot:** "Guideline checks · from Global equity · v1.4". The animated chip reads "Guideline checks".
- **Rows:**
  - Global equity (Long-only · built here)
  - UK equity income (Income)
  - Fixed income (Credit and rates)
  - Multi-asset (Solutions)
  - Emerging markets (EM equity)

  Every row after the first is marked "installed".

### 8 · Playbooks (`#playbooks`). Screenshot 11
Four cards: Mandate Guardrails, Client Reporting Flow, Research Intake and Investor Reporting.

### 9 · 05 / Value (`#value`). Screenshot 12
- **Chart:** *Client reports completed per analyst, per quarter*. Axis 12–16.
- **Bars:**
  - Baseline 14.2
  - +1.2 client reports (11 → 3 days)
  - +0.5 guideline checks (before every trade)
  - +0.2 commentary (checked on drafting)
  - +0.3 RFP and DDQ (answers in a day)
  - Capacity 16.4
- **Pill:** shows the percentage increase, +15.5%.
- **Footer line:** "+2.2 reports per analyst a quarter × 40 analysts ≈ **352** more reports a year". The figure counts up and uses en-GB formatting.

### 10 · Related work (`#work`). Screenshot 13
- **Card 1: "Pre-trade mandate checks for a multi-asset manager"** (`feat-mandate-guardrails.png`, Asset Management · AI Engineering)
  - Post-trade breach review: 2 days → Same day
  - Rules under version control: 420
  - Overrides without a record: **None**
- **Card 2: "Client reporting across an institutional book"** (`client-reporting-flow.png`, Asset Management · Deployment & Run)
  - Report production: 18 days → 5 days
  - Reports per quarter: 640
  - Claims checked against attribution: **100%**

### 11 · 06 / Engagement. Screenshot 14
- **Card text:** each card is scoped "per strategy" and covers up to six strategies.
- **Rollout card:** ends "The evidence is ready when the client or consultant asks for it."
- **Styling:** cards have a 20px radius, and card 3 has a stronger white wash.

### 12 · Closing. Screenshot 15
- **h2:** "Put every claim on record."
- **CTA:** "Book an operations audit".
- **Strapline:** "Guideline checks, client reporting and research workflows rebuilt on one production platform, with every claim sourced."

---

## Imagery
The images are the framework set plus four playbook images: `playbooks/mandate-guardrails.png`, `client-reporting-flow.png`, `research-intake.png`, `investor-reporting.png`. `feat-mandate-guardrails.png` is also used, for case study 1. For format guidance, see Imagery in `framework-reference.md`.

## Content status
Every strategy, mandate (GE-07), fund name, reference (P-0930, A-0930, rule and guideline codes) and figure is **illustrative**. Each diagram carries an "Illustrative…" caption, and the case studies use sample data from `/work`. Benchmark naming is deliberately generic: "Benchmark index". Confirm any real index name against licensing before publishing.
