# Handoff: Production Assurance service page

## Overview
`/production-assurance` is the service page for running AI systems after go-live. It replaces the old "Deployment & Run" footer item. The name was chosen deliberately: the page is about reliability and accountability, not ongoing billing.

**Audience:** COOs, CTOs, risk owners and internal audit. These are the people who have watched a pilot go live and then quietly decay.

**Story, in order:**
1. **Premise:** launch day looks fine, month three fails, and nobody is accountable.
2. **Health review:** a two-week review of every live system, including systems built by others, ranked by risk.
3. **Health review CTA band.**
4. **First 100 days in production:** a run log that ends with incidents falling from 11 to 3 and accuracy back above the floor.
5. **Incidents:** every event is detected, contained, fixed and signed off.
6. **Across systems:** a monitoring pack is set up once and reused.
7. **Playbooks.**
8. **Value:** an accuracy bridge.
9. **Related work.**
10. **Book an audit band:** for prospects who are not live yet.
11. **Engagement**, then **Closing**.

**Same framework as the industry pages.** The page reuses the components, layout, timings, helpers and accessibility rules from `/fund-management`. The full mechanical spec is in **`framework-reference.md`**. This README lists everything specific to Production Assurance: copy, data, label meanings and formula changes. Build it from the same shared component set as the industry pages, with content passed in as data.

## About the design files
The files in `reference/` are **design references built in HTML**. They are prototypes showing the intended look and behaviour, not production code to copy. Recreate them in the target codebase using its established patterns.

To open the prototype:
1. Serve `reference/` as a static folder (for example `npx serve reference`).
2. Open `Production Assurance.dc.html`. `support.js` and `Site Header.dc.html` must be in the same folder.

Styles are inline. Behaviour lives in the `class Component` script.

## Fidelity
**High fidelity.** Where this README, `framework-reference.md` and the HTML disagree, the HTML wins.

## Files
| Path | What it is |
|---|---|
| `README.md` | Production Assurance specifics (this file) |
| `framework-reference.md` | Shared mechanics: tokens, helpers, every animation's timing |
| `CHECKLIST.md` | Acceptance checklist |
| `copy-deck.md` | All visible copy plus the incident data |
| `screenshots/01–15` | Every section at 1526px, captured mid-animation |
| `reference/…` | Page prototype, shared header, runtime and every image |

---

## Linkage
- **Header.** Render the shared `SiteHeader`. The page is **not yet in the header menu**. Recommended: add it to the AI Engineering dropdown under "How it works" as "Production Assurance: held to an accuracy floor after go-live". Mark it current when on this page.
- **Footers, sitewide.** In the Services column, "Deployment & Run" has been renamed **Production Assurance** and links to `/production-assurance` on every page. On this page the link is `#top`.
  - "Evaluation suites" in the same column still links to an old Home section (`#capabilities`). Open decision: remove it, or point it to `/ai-engineering#rebuild`.
- **Work page.** The service-line filter value "Deployment & Run" is now **"Production Assurance"**, along with the case-study data that uses it.
- **CTAs:**
  - "Book a health review" (hero, health-review band, engagement card 1, closing) → `#engagement`.
  - "Book an audit" (Book-an-audit band) → `/ai-engineering#engagement`, because the audit is offered from AI Engineering.
  - "See how incidents are handled" (hero) → `#trace`.
- **Anchors:** `#top`, `#audit`, `#plan`, `#trace`, `#portfolio`, `#playbooks`, `#value`, `#work`, `#engagement`. Each needs `scroll-margin-top: 68px`.

---

## Section specifics
For mechanics, see the matching section in `framework-reference.md`.

### 0 · Intro overlay
- **Rows:** "review what is live" · "rank by risk" · "fix the first system" · "carry it to the next one".
- **Footer:** "5 systems on watch · day 100".
- **Corner label:** "Run log".

### 1 · Hero (`#top`). Screenshot 01
- **Eyebrow:** "Production Assurance".
- **h1:** "Go-live is day one. / We keep it right from there."
- **Lede:** systems drift, models change underneath them and the people who built them move on. We hold every live system to an agreed accuracy floor.
- **CTAs:** "Book a health review" → `#engagement`; "See how incidents are handled" → `#trace`.
- **Image:** `hero-valley.png`, with a colour reveal on the same artwork.

### 2 · 01 / Premise. Screenshots 02–04
**h2:** "Launch is the easy part. / Month three is where systems fail."

**Card 1: Launch day** (`ai-eng-wash.png`)
- Statement: "The pilot went live with a launch email and a demo that worked."
- Window: *Go-live checklist — Credit memo assistant*, with columns Check, Owner, Status.
- Checks: Demo to the credit committee, Pilot accuracy (91% on 200 memos), Launch email, **Monitoring (Not set, red)**, Evaluation suite (Partial), **Runbook and on-call (Not set, red)**.
- Footer: "6 checks · 0 owners after launch · live".

**Card 2: Month three** (`cta-e.webp`)
- Statement: "Three months later, the model changed, costs crept up and the engineer who built it left."
- Window: *Production health — Credit memo assistant*, "Health by week".
- Columns: Week, Accuracy, Cost / case, Incidents, Owner.

  | Week | Accuracy | Cost / case | Incidents | Owner |
  |---|---|---|---|---|
  | 1 | 91% | £0.42 | 0 | Vendor |
  | 4 | 90% | £0.44 | 0 | Vendor |
  | 7 | 88% | £0.51 | 1 | IT |
  | 9 | 86% | £0.58 | 2 | — |
  | 11 | 81% | £0.66 | 3 | — |
  | 13 | 79% | £0.71 | 4 | **Left the firm** (red) |

- Total row: "Since launch −12 pts · +69% · **10**".
- Callout: "First noticed by: **a client querying a figure** in their facility letter."

**Card 3: Accountability** (`cta-a.jpeg`)
- Statement: "The business still relies on it, and the auditor still asks who is accountable."
- Window: *Accountability — Credit memo assistant*, "System life · 2026".
- Timeline: Pilot Apr → Go-live Jun → Model update Aug → Internal audit Nov → Renewal Jan.
- Internal audit requests:
  - Who approved the model update on 14 Aug
  - Accuracy since launch, by memo type
  - Access granted and removed since go-live
  - The runbook for an outage
  - **The named owner today**
- Footer: "5 of 5 open · audit fieldwork in November".

### 3 · 02 / Health review (`#audit`), 19s loop. Screenshot 05
- **h2:** "In two weeks, we review every AI system already in production, ours or anyone's, and rank what to fix first by risk to the business."
- **Rows (live systems):** Credit memo assistant, Client report drafter, Research notes, Complaint drafter, Sanctions screener, KYC file builder.
- **Columns (signals):** Accuracy drift, Latency, Model version, Access, Cost per case, Ownership.
- **Cell values:** a **risk score from 0.1 to 1.2**.
- **Plot:**
  - Axes: **Risk to the business ↑** (ticks Low, Medium, High) and **Effort to fix →**.
  - The highlighted quadrant is labelled "Fix first".
- **Shortlist:**
  - Memo assistant · accuracy drift
  - Report drafter · access
  - Complaint drafter · cost per case
  - KYC builder · accuracy drift (reuses fix 01)
  - Research notes · cost per case
- **List:** "Fix first · live systems". Each item has a fix, for example "Re-baseline and add a nightly suite" or "Remove shared service account", and a High or Medium rating. Footer: "Five fixes, ranked by risk and effort · Fix 04 reuses fix 01".
- **Step strip:**
  - Logs, access lists and run costs read → system inventory
  - Each system scored on accuracy, drift, cost, access and ownership → scored matrix
  - A ranked fix list and a run plan → fix list

### 4 · Health review band. Screenshot 06
"Start with a two-week health review." with "Book an audit →" → `#engagement`. Note: "The fix list is yours, whether we run it or not".

### 5 · 03 / First 100 days in production (`#plan`). Screenshot 07
- **h2:** "The first hundred days, / as a run log."
- **Window:** "Run log — live systems · Q3".
- **Gantt:** Health review 0–14, Monitoring live 8–30, **Memo assistant re-baselined 14–42**, **Model migration 36–64**, **Cost tuning 56–86**, Evaluation and handover 70–100.
- **Log:**
  - D03: baseline of 11 open incidents, accuracy 79% against a 92% floor
  - D14: on-call rota live
  - D30: monitoring and nightly suites live in your own tenant
  - D42: memo assistant back above the floor at 93%
  - D64: model migrated, scored on the suite before release
  - D86: cost per case £0.71 → £0.38
  - D100: runbooks rehearsed, 3 incidents open
- **KPI changes:**
  - **Open incidents** = `round(11 − e)`, where `e` adds 5 at D42, 2 at D64 and 1 at D86. Runs **11 → 3**, shown as a plain number.
  - **Rework hours saved per quarter:** 0 → 820.
- **Checklist:** "Run checklist · Q3".

### 6 · Incidents (`#trace`), the signature interaction. Screenshot 08
- **h2:** "Click any incident. / See how it was handled."
- **Window:** "Run log — Credit memo assistant · September 2026", System CMA-01, 1–30 Sep.
- **Panel:** titled **"Handling"**. Each event has four steps: **Detected → Contained → Fixed → Signed off**.

  | Event | When | What happened |
  |---|---|---|
  | Model provider update | Day 4 | Held at the change gate, scored 93.8% on the suite, approved by the risk owner |
  | Accuracy below the floor | Day 11 | Nightly 91.6% < 92%; leverage section routed to analysts; parser fixed, 94.1% |
  | Cost spike | Day 15 | +38% in a day; retry loop capped; long documents split, £0.39 per case |
  | Access review | Day 20 | Two leavers removed within the hour; access tied to the HR leaver feed |
  | New document format | Day 26 | Affected memos sent to human review; template and 40 cases added to the suite |
  | **Monthly run report** | **Day 30** | 94.6% · £0.38 · 5 events, all closed; signed off by the risk committee |

- **Footer pill:** "Closed · 4 of 4 steps" with the note "Same log in the monthly run report".
- **Hint text:** "Auto-playing · click any incident" or "Paused · click any incident".
- **Behaviour:** the same as the framework's Traceability: auto-advance every 5.6s, a click pauses, and steps re-stagger.
- **Full step text:** in `copy-deck.md`.

### 7 · 04 / Across systems (`#portfolio`), dark 16s loop. Screenshot 09
- **h2:** "Set up once. Run across every system. / Each system comes under watch faster than the last."
- **Run library:**
  - The counter reads "0 run packs", then "1 run pack".
  - The slot reads "Monitoring pack · from Credit memo assistant · v1.4".
  - The moving chip reads "Monitoring pack".
- **Rows:**
  - Credit memo assistant (Credit · set up here)
  - KYC file builder (Onboarding)
  - Complaint drafter (Customer ops)
  - Client report drafter (Client service)
  - Research notes (Research)

  Every row after the first is marked "adopted". The first row's label is "First setup". Summary: "Time to watch: 6 weeks → 1 week".

### 8 · Playbooks (`#playbooks`). Screenshot 10
- **h2:** "Four systems we run, / written up from delivery."
- **Cards:** Mandate Guardrails, Client Reporting Flow, Research Intake, Investor Reporting.

### 9 · 05 / Value (`#value`). Screenshot 11
- **h2:** "Accuracy you can bridge, / line by line."
- **Window:** "Monthly run report — Credit memo assistant · month 6".
- **Chart:** *Cases right first time*, in percent. The axis is labelled 92–96: the framework's 12–16 scale offset by +80.
- **Bars:**
  - At handover 94.2%
  - +1.2 pts model migration (scored before release)
  - +0.5 drift alerts (caught within a day)
  - +0.2 new formats (added to the suite)
  - +0.3 reviewer feedback (fed back weekly)
  - Accuracy 96.4% (measured at month 6)
- **Formula changes:**
  - Header counter: `(94.2 + add)%`.
  - Pill: `+add pts`, ending at +2.2 pts.
  - Footer line: "+2.2 pts on 41,000 cases a quarter ≈ **902** fewer cases reworked a quarter".
- **Caption:** "…measured against the floor agreed at handover."

### 10 · Related work (`#work`). Screenshot 12
- **Daily agent-notice reconciliation for a loan operations team** (`loan-ops-ledger.png`, Private Credit · Production Assurance): Breaks open at month end 86 → 4 · Notices matched each day 1,900 · Breaks without an owner **None**.
- **Client reporting across an institutional book** (`client-reporting-flow.png`, Asset Management · Production Assurance): Report production 18 → 5 days · Reports per quarter 640 · Claims checked against attribution **100%**.

### 11 · Book an audit band. Screenshot 13
- **Background:** `cta-c.webp` under a dark blue-black gradient (`rgba(14,16,24,.86 → .30)`), 20px radius.
- **Copy:**
  - Eyebrow: "Not live yet?"
  - h2: "Start with a two-week workflows & processes audit."
  - Line: "We map what your teams do today, measure the baseline and rank what is worth building, before anything goes into production."
- **CTA:** white button "Book an audit →" → `/ai-engineering#engagement`. Note: "The process map is yours, whether we build or not".

### 12 · 06 / Engagement. Screenshot 14
| Card | Header | Facts | CTA |
|---|---|---|---|
| **The health review** | 2 weeks · fixed fee | Covers: every live system · Access: read-only · Output: fix list and run plan | Book a health review |
| **The handover / to production** (two-line title) | 30 days · per system | Runs in: your cloud · On-call: from day one · Floor: agreed per system | Book a call |
| **Ongoing assurance** | Monthly · per system | Report: monthly, one page · Notice: one month · Exit: rehearsed handover | Book a call |

The cards have a 20px radius, and card 3 has the stronger white wash. The third card's copy ends: "Your team can take it in-house at any point; the runbooks assume you will."

### 13 · Closing. Screenshot 15
- **h2:** "Keep it right after go-live."
- **CTA:** "Book a health review".
- **Strapline:** "Monitoring, evaluation and runbooks for AI systems in production, held to an agreed accuracy floor." Render it on **one line** on desktop: no max-width, `flex: 1 1 auto`. It wraps only on narrow screens.

---

## Content status
Every system, reference (CMA-01, CG-2, S-0904 and so on), date and figure is **illustrative**. Each diagram carries an "Illustrative…" caption. The case studies use sample data from `/work`.
