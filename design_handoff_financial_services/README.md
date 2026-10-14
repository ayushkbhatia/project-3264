# Handoff: Financial Services industry page

## Overview
`/financial-services` is the industry page for banks and lenders. It is written for COOs, CROs, heads of credit and onboarding, complaints and the second line. It tells one story, from files assembled by hand to files that are complete, measured and traceable:

1. **Premise**: every file is assembled by hand.
2. **Operations audit**: a two-week audit ranks workflows by time returned and risk removed.
3. **First 100 days**: a build log that ends with a 3-day credit memo.
4. **Traceability**: every figure in a credit memo carries its lineage.
5. **Across desks**: what is built once installs across lending desks.
6. **Playbooks**.
7. **Value**: a capacity bridge.
8. **Related work**.
9. **Engagement**, then **Closing**.

**Same framework as Fund Management and Private Equity.** This page uses the same components, layout, timings, easing curves, helpers and accessibility rules as `/fund-management`. That full mechanical spec is included as **`framework-reference.md`**. This README lists everything specific to Financial Services: copy, data, linkage and the few formula changes. Build all three industry pages from one shared component set, with page content passed in as data.

## About the design files
The files in `reference/` are **design references built in HTML**. They are prototypes that show the intended look and behaviour, not production code to copy. Recreate them in the target codebase using its established patterns. If there is no codebase yet, use a static-first React framework.

**To open the prototype:** serve `reference/` as a static folder (for example `npx serve reference`) and open `Financial Services.dc.html`. `support.js` and `Site Header.dc.html` must sit beside it.
- Styles are inline.
- Behaviour lives in the `class Component` script: `runIntro`, `initVeil`/`stepVeil`, `stepStack`, `stepDiag`, `stepPlan`, `stepTrace`, `stepPort`, `stepValue` and `stepEngage`.

## Fidelity
**High fidelity.** Where this README, `framework-reference.md` and the HTML disagree, the HTML wins.

## Files
| Path | What it is |
|---|---|
| `README.md` | Financial Services specifics (this file) |
| `framework-reference.md` | Shared component mechanics: tokens, helpers, every animation's timing |
| `CHECKLIST.md` | Acceptance checklist |
| `copy-deck.md` | All visible copy plus the Traceability data |
| `screenshots/01–15` | Every section at 1526px, captured mid-animation |
| `reference/…` | Page prototype, shared header, runtime and every image |

---

## Header and menu linkage
- Render the shared **`SiteHeader`** as a sticky bar. Set **Industries** and **Financial Services** to current with `aria-current="page"`.
- **Industries dropdown and phone accordion.** Financial Services was added between Private Equity and Fund Management. The menu order is now:
  - Private Credit → `/private-credit`
  - Private Equity → `/private-equity`
  - **Financial Services → `/financial-services`**
  - Fund Management → `/fund-management`
  - Asset Management → `/#industries` (no page yet)

  The Financial Services thumbnail is `assets/playbooks/research-intake.png`. Its description is "Credit memos, KYC files, complaints and regulatory requests."
- **Desktop panel layout.** The panel now holds five industries in a 2-column grid, so the last row has one item.
  - Option A: accept the lone item.
  - Option B: switch the industry grid to 3 columns.

  The design team prefers Option B if it fits at 1024px.
- **Footers sitewide.** In the Industries column, "Financial Services" now links to `/financial-services` on every page that lists it. On this page it is `#top`.
- **Home.** The Home v2 Industries section still shows four cards and has no Financial Services card. Adding one is a pending design decision.
- **Outbound links from this page:**
  - Playbook cards → `/playbooks/covenant-watch`, `/playbooks/loan-ops-ledger`, `/playbooks/mandate-guardrails` and `/playbooks/research-intake`.
  - "All nine playbooks" → `/playbooks`.
  - Case-study cards → `/work/<slug>`. "All work" → `/work`.
- **Anchors:** `#top`, `#audit`, `#plan`, `#trace`, `#portfolio`, `#playbooks`, `#value`, `#work` and `#engagement`. Each needs `scroll-margin-top: 68px`. Every "Book…" CTA jumps to `#engagement`.

---

## Section specifics
For mechanics and timing of each section, see the matching section in `framework-reference.md`.

### 0 · Intro overlay
- **Rows:** "map the files" · "rank by hours and risk" · "ship the first workflow" · "carry it to the next desk".
- **Footer:** "5 desks live · day 100".
- **Corner labels:** "Bank log" and "click to skip".

### 1 · Hero (`#top`). Screenshot 01
- **Eyebrow:** "Financial Services".
- **h1:** "Every file complete. / Every decision on record."
- **Lede:** about credit memos, KYC files, complaints and regulatory requests, ending with "…an audit trail your second line, internal audit and regulator can follow."
- **CTAs:** "Book an operations audit" → `#engagement`; "See the first 100 days" → `#plan`.
- **Image:** `hero-valley.png`, the same artwork as the Home hero. The base and the hover colour-reveal layer must be the same artwork.

### 2 · 01 / Premise. Screenshots 02–04
**h2:** "Every file is assembled by hand. / Very little of it is reusable."

| Card | Statement | Window |
|---|---|---|
| What every desk has (`ai-eng-wash.png`) | "Every desk assembles its files by hand. Most of the evidence lives in inboxes." | *Workload tracker — Commercial banking · Q3*. Rows: Credit memo drafting (Credit · Manual), KYC refresh (Onboarding · Manual), Covenant monitoring (Portfolio · Manual), Complaints triage (Customer ops · **Backlog**, red), Model documentation (Model risk · Copy-paste), Regulator requests (Compliance · **Overdue**, red). Footer: "6 workflows · 0 automated · 0 measured" |
| What the CRO sees (`cta-e.webp`) | "Six desks, six ways of working. Nobody can say what a credit file costs." | *Control dashboard — all desks · Q3*, "Turnaround by desk". Columns: Desk · Days · Manual steps · Exceptions · Evidence. Rows: Commercial credit 11/64/12, SME lending 6/41/7, Onboarding and KYC 14/58/9, Complaints 9/33/4, Model risk 23/47/6, Regulatory reporting 19/22/3. Total "All desks 14 avg · 265 · **41**". Quote: Internal audit finding "**inconsistent evidence of review** across desks." |
| What did not change (`cta-a.jpeg`) | "The regulator still samples the files, and every decision in them has to stand up." | *Supervisory calendar — 2026*. Timeline Q1 returns → Regulator visit, then five regulator and audit requests, the last highlighted ("Who reviewed each exception, and when"). Footer: "5 of 5 open · supervisory visit in March" |

### 3 · 02 / Operations audit (`#audit`), 19s loop. Screenshots 05–06
- **h2:** "In two weeks, we walk every document-heavy workflow and rank where automation returns the most time and removes the most risk."
- **Rows (desks):** Commercial credit, Regulatory reporting, Onboarding, Complaints, Model risk, SME lending.
- **Columns (workflows):** Credit memos, Covenant checks, Customer letters, Model docs, Case files, Regulatory returns.
- **Cell values:** FTE released per quarter, 0.1–1.2. The plot axes are **capacity released ↑** and **effort to ship →**.
- **Shortlist** (keyed by row-column, same plot positions as the framework):
  - 0-0 Commercial · credit memos, 1.2
  - 4-3 Model risk · model docs, 0.8
  - 3-4 Complaints · case files, 0.7
  - 5-0 SME · credit memos, 0.6. Labelled "from build 01" because it **reuses** the commercial build.
  - 2-4 Onboarding · KYC files, 0.9
- **Ranked list:** "First builds · commercial bank", total "4.2 FTE released across five builds · Build 04 reuses build 01".
- **Step strip:**
  - "Walk-throughs with credit, onboarding, complaints and the second line"
  - "Each workflow scored on hours, error risk, data readiness and control gaps"
  - "A ranked, costed plan for each desk and one for the platform"

### 4 · Audit CTA band. Screenshot 07
"Start with a two-week operations audit." with "Book an audit →" → `#engagement`.

### 5 · 03 / First 100 days (`#plan`). Screenshot 08
- **h2:** "The first hundred days, / as a build log."
- **Window:** "Build log — Commercial credit · Q3".
- **Gantt:** Audit 0–14, Platform 8–30, **Credit memo drafting 14–42**, **KYC case files 36–64**, **Complaint case files 56–86**, Evaluation and handover 70–100.
- **Log:**
  - D03: baseline signed by the COO, "11 days per credit memo, 6.2 FTE on drafting"
  - D14: audit closed
  - D30: platform live in the bank's Azure tenant
  - D42: credit memos live, "every figure cited to its source page"
  - D64: KYC files live, "refresh packs assembled in minutes"
  - D86: complaints live, "cases classified and drafted on arrival"
  - D100: "memo turnaround measured at 3 days"
- **KPI formula change.** "Days per credit memo" = `round(11 − e)`, where `e` adds **5 at D42, 2 at D64 and 1 at D86**, each eased over 4 days. It runs **11 → 3**. Hours back per quarter runs 0 → 820. "Live" ends at 3 of 3.
- **Checklist:** "Desk checklist · Q3".

### 6 · Traceability (`#trace`). Screenshot 09
- **h2:** "Click any figure. / See where it came from."
- **Window:** "Credit memo — Halden Logistics Ltd · Q3 2026", "Borrower 20931", "£ · FY2025 · at 30 Jun".
- **Six rows**, each with four lineage steps (Source → Matched to → Check → Reviewed). The full text is in `copy-deck.md` and `trData()`.

  | Figure | Value | Check |
  |---|---|---|
  | Revenue, FY2025 | £142.6m | Ties to the audited figure |
  | EBITDA, FY2025 | £21.4m | Add-backs within the 15% cap |
  | Net debt, 30 Jun | £58.9m | Agrees to the existing lenders' confirmations |
  | Leverage | 2.75x | Below the 3.50x policy limit. Net debt ÷ EBITDA = 2.752 |
  | Interest cover | 4.8x | Above the 3.0x floor |
  | **Recommended limit** | **£18,000,000** | Within the approver's delegated authority |

  The recommended limit is £12m term loan plus £6m revolving facility. It is the emphasised last row, with a dark rule above it.
- **Footer note:** "Same trail in the regulator's sample".
- **Behaviour:** identical to the framework. Auto-advance every 5.6s while in view. A click selects a row and pauses. Steps re-stagger on each change. Under reduced motion there is no auto-play.

### 7 · 04 / Across desks (`#portfolio`), dark 16s loop. Screenshot 10
- **h2:** "Built once. Run across every desk. / Each desk goes live faster than the last."
- **Library slot:** "Credit memo drafting · from Commercial credit · v1.4". The chip reads "Credit memos".
- **Rows:**
  - Commercial credit (Corporate lending · built here)
  - SME lending (Business banking)
  - Real estate (Property finance)
  - Asset finance (Equipment lending)
  - Leveraged finance (Sponsor lending)

  The last four are installed. Week counts and deltas follow the framework (6 → 3 → 2 → 1.5 → 1 weeks).

### 8 · Playbooks (`#playbooks`). Screenshot 11
- **h2:** "Four workflows, / written up from delivery."
- **Cards:** Covenant Watch, Loan Ops Ledger, Mandate Guardrails, Research Intake. Images are each playbook's watercolour.

### 9 · 05 / Value (`#value`). Screenshot 12
- **h2:** "Capacity you can bridge, / line by line."
- **Chart:** *Credit files completed per analyst, per month*. Axis 12–16, 70px per file.
- **Bars:**
  - Baseline 14.2
  - +1.2 credit memos (11 → 3 days)
  - +0.5 KYC case files (packs in minutes)
  - +0.2 complaint cases (drafted on arrival)
  - +0.3 model docs (3 weeks → 4 days)
  - Capacity 16.4 (measured at month 6)
- **Formula changes from the framework:**
  - The header counter shows a plain number, "14.2 → 16.4".
  - The pill shows the percentage increase, `+(add/14.2·100)%`. It ends at **+15.5%**.
  - The footer line is "+2.2 files per analyst a month × 120 analysts ≈ **3,168** more files a year". The number counts up and is formatted with an en-GB thousands separator.

### 10 · Related work (`#work`). Screenshot 13
- **h2:** "Measured against the week / before we arrived."
- **Card 1:** Credit memo preparation across a $6.4B book (`research-intake.png`, Financial Services · AI Engineering). Time per memo 6 hrs → 40 min · Memos prepared 1,240 · Field-level citations **100%**.
- **Card 2:** Covenant monitoring across a direct lending book (`feat-covenant-watch.png`, Lending · AI Engineering). Quarterly test cycle 15 days → 3 days · Facilities tested in full 30 → 140 · Ratios re-keyed by hand **None**.

### 11 · 06 / Engagement. Screenshot 14
- **The operations audit:** up to six desks, read-only access, ranked and costed plan.
- **The first build:** 100 days · per workflow, against a baseline the COO signed.
- **The platform rollout:** ongoing · per desk, owner named per desk, "Evidence on file". The copy ends: "The evidence is ready when the regulator asks for it."
- **Card style:** 20px radius. Card 3 has the stronger white wash.

### 12 · Closing. Screenshot 15
- **h2:** "Make every file stand up."
- **CTA:** "Book an operations audit".
- **Strapline:** "Credit, onboarding and compliance workflows rebuilt on one production platform, with every decision on record."

---

## Imagery
These are the same assets as Fund Management, plus `playbooks/research-intake.png` (header thumbnail, playbook card and case study 1). See `framework-reference.md` → Imagery for format guidance.

## Content status
Every bank, desk, borrower (Halden Logistics Ltd), reference number (CR-20931, policy and rule codes) and figure is **illustrative**. Each diagram carries an "Illustrative…" caption. The case studies use sample data. The $6.4B memo case comes from the original Home page and is flagged there as a placeholder.
