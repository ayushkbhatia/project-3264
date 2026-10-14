# Handoff: Evaluation Suites service page

## Overview
`/evaluation-suites` is the service page about proving AI accuracy. It is written for model risk, compliance, internal audit and the COO, the people who decide whether a system may stay in production.

**Argument:** a vendor's headline accuracy is measured on examples the vendor chose. 3264 builds a test suite from the client's own cases, has their experts label it, weights errors by severity, and scores every system every night and before every change.

**Story, in order:**
1. Premise: the demo, then production, then model risk.
2. Evaluation review: ranks systems by where the evidence is thinnest.
3. Evaluation review band.
4. Building the suite.
5. A nightly run, where you can click any score.
6. Across systems.
7. Playbooks.
8. Value: an errors-caught bridge.
9. Related work.
10. "Not built yet?" audit band.
11. Engagement, then Closing.

**Built on the shared framework.** This page uses the same components, timings, helpers and accessibility rules as the industry pages and `/production-assurance`, so build it from that shared component set with its content passed in as data.
- **`framework-reference.md`** holds the full mechanics.
- **This README** lists everything specific to Evaluation Suites.

## About the design files
The files in `reference/` are **design references built in HTML**: prototypes of the intended look and behaviour, not production code to copy. Recreate them in the target codebase using its established patterns.

To open the prototype, serve `reference/` as a static folder (for example `npx serve reference`) and open `Evaluation Suites.dc.html`. Keep `support.js` and `Site Header.dc.html` beside it. Styles are inline, and behaviour lives in the `class Component` script.

## Fidelity
**High fidelity.** Where this README, `framework-reference.md` and the HTML disagree, the HTML wins.

## Files
| Path | What it is |
|---|---|
| `README.md` | Evaluation Suites specifics (this file) |
| `framework-reference.md` | Shared mechanics: tokens, helpers, every animation's timing |
| `CHECKLIST.md` | Acceptance checklist |
| `copy-deck.md` | All visible copy plus the nightly-run data |
| `screenshots/01–12` | Every section at 1526px, captured mid-animation |
| `reference/…` | Page prototype, shared header, runtime and every image |

---

## Linkage
- **Header.** Render the shared `SiteHeader`. This page is **not yet in the header menu**. Recommendation: add Evaluation Suites and Production Assurance to the AI Engineering dropdown.
- **Footers sitewide.**
  - In the Services column, "Evaluation suites" is now **Evaluation Suites** and links to `/evaluation-suites` on every page.
  - "Production Assurance" in the same column links to `/production-assurance`.
  - On this page the Evaluation Suites link is `#top`.
- **CTAs:**
  - "Book an evaluation review" appears in the hero, the review band, engagement card 1 and the closing band. It links to `#engagement`.
  - "Book an audit", in the "Not built yet?" band, links to `/ai-engineering#engagement`.
  - "See a nightly run" (hero) links to `#trace`.
- **Anchors:** `#top`, `#audit`, `#plan`, `#trace`, `#portfolio`, `#playbooks`, `#value`, `#work`, `#engagement`. Give each one `scroll-margin-top: 68px`.

---

## Section specifics
For mechanics, see the matching section in `framework-reference.md`.

### 0 · Intro overlay
- **Rows:** "sample your cases" · "label with your experts" · "score every night" · "gate every change".
- **Footer:** "5 systems scored · day 100".
- **Corner label:** "Eval log".

### 1 · Hero (`#top`) · screenshot 01
- **Eyebrow:** "Evaluation Suites".
- **h1:** "Accuracy is a number. / We measure it every night."
- **Lede:** contrasts demo scores with a suite built from the client's own cases, and ends "Your risk team gets evidence, not an opinion."
- **Image:** `hero-valley.png`, with a colour reveal that uses the same artwork.

### 2 · 01 / Premise · screenshots 02–04
**h2:** "“91% accurate” means nothing. / Which 9% fails, and does it matter?"

**Card 1: The demo** (`ai-eng-wash.png`)
- Statement: "The vendor quoted one number, measured on examples they chose."
- Window: *Vendor scorecard — Document extraction*, with columns Claim, Source, Status.
- Claims: Headline accuracy (91% on the vendor's sample), Test set (200 documents the vendor chose), Case mix, Error severity (every error counted the same), Your own cases (**none tested**), Re-test after changes (not offered).
- Status pills: "Claimed" and "Unseen", with red pills where nothing exists.
- Footer: "1 number · **0 of your cases** · signed".

**Card 2: In production** (`cta-e.webp`)
- Statement: "In production, the errors clustered in the cases that matter most."
- Window: *Errors by case type — month two*, titled "Where the 9% went".

  | Case type | Share | Accuracy | Severe | Caught by |
  |---|---|---|---|---|
  | Standard invoices | 62% | 98% | 0 | Reviewer |
  | Credit notes | 11% | 90% | 0 | Reviewer |
  | Multi-currency | 9% | 81% | 1 | Reviewer |
  | Handwritten | 7% | 64% | 2 | Client |
  | Amended terms | 6% | 58% | 3 | Auditor |
  | Side agreements | 5% | 49% | 4 | **Nobody** (red) |

- Total row: "All cases 100% · 91% · **10**".
- Callout: "“91%” was true. **Most severe errors sat in 18% of cases**."

**Card 3: Model risk review** (`cta-a.jpeg`)
- Statement: "Model risk still asks how you know it works, and a headline number is not an answer."
- Timeline: Vendor demo → Go-live → Model update → Validation → Renewal.
- Requests:
  - Accuracy on our own cases, by case type
  - Error severity, not just error rate
  - Evidence the model update was re-tested
  - The agreed accuracy floor and who set it
  - **What happens when the score drops**
- Footer: "5 of 5 open · validation due in November".

### 3 · 02 / Evaluation review (`#audit`), 19s loop · screenshot 05
- **h2:** "In two weeks, we test every AI system you run or are buying against your own cases, and rank where the evidence is thinnest."
- **Matrix rows (systems):** Credit memo assistant, Client report drafter, Research notes, Complaint drafter, Sanctions screener, KYC file builder.
- **Matrix columns:** Severity, Refusals, Drift, Citations, Edge cases, Change gate.
- **Cells:** evidence gap, 0.1–1.2.
- **Plot:** **Gap in evidence ↑** (Low / Medium / High) against **Effort to test →**. The highlighted quadrant is labelled "Test first".
- **Shortlist and suites:**
  - Memo assistant · severity: "Severity-weighted suite, 1,200 cases"
  - Report drafter · citations: "Citation check on every figure"
  - Complaint drafter · edge cases: "Add 300 edge cases from history"
  - KYC builder · severity: "Severity suite, from test 01"
  - Research notes · edge cases: "Add unsupported-claim cases"
- **List footer:** "Five suites, ranked by evidence gap · Suite 04 reuses suite 01".
- **Step strip:** case sample → scored matrix → suite plan.

### 4 · Evaluation review band
- **h2:** "Start with a two-week evaluation review."
- **Note:** "The scored report is yours, whatever you decide".

### 5 · 03 / Building the suite (`#plan`) · screenshot 06
- **h2:** "From your history / to a nightly score."
- **Window:** "Suite log — Credit memo assistant · Q3".
- **Gantt:** Case sampling 0–14, Expert labelling 8–30, **Severity scoring 14–42**, **Citation checks 36–64**, **Nightly runs and floor 56–86**, Evaluation and handover 70–100.
- **Log:**
  - D03: 11 case types untested, one headline score of 91%
  - D14: 1,200 cases drawn from 18 months
  - D30: labelling complete with four credit analysts
  - D42: severity weights agreed
  - D64: every figure checked for a citation
  - D86: nightly runs live, floor set at 92%
  - D100: change gate live, suite handed to your team
- **KPI:** **Case types untested** = `round(11 − e)`, running 11 → 3. **Cases labelled** runs 0 → 820.
- **Checklist label:** "Suite checklist · Q3".

### 6 · Nightly run (`#trace`), the signature interaction · screenshot 07
- **h2:** "Click any score. / See what is behind it."
- **Window:** "Evaluation run — Credit memo assistant · night 22", Suite v2.7 · 1,240 cases, 22 Sep · 02:00.
- **Panel:** "Behind the score". Each row has four steps: **Measured → Compared with → Evidence → Reviewed**.

  | Score | Value | Key detail |
  |---|---|---|
  | Overall accuracy | 94.6% | 1,173 of 1,240, severity-weighted; floor 92% |
  | Leverage section | 91.2% | Below its own 92% floor; six failing cases; routed to people until fixed |
  | Citation coverage | 99.4% | Floor 99%; seven uncited figures flagged |
  | Severe errors | 0.1% | Weighted 10×; limit 0.5%; one case corrected |
  | Refusals | 1.8% | Target under 3%; each refusal logged with its reason |
  | **Release gate** | **Passed** | Release R-0923 must not lower any case type by more than 0.5 pts |

- **Footer pill:** "Evidenced · 4 of 4", with the note "Same run in the model risk file".
- **Hint text:** "Auto-playing · click any score" / "Paused · click any score".
- **Behaviour:** the same as the framework's Traceability section: auto-advance every 5.6s, a click pauses, and steps re-stagger.
- The full step text is in `copy-deck.md`.

### 7 · 04 / Across systems (`#portfolio`), dark 16s loop · screenshot 08
- **h2:** "Built once. Scored across every system. / Each system gets its first score faster than the last."
- **Evaluation library:** the count reads "0 evaluation packs" and then "1 evaluation pack". The slot and chip read "Evaluation pack".
- **Rows:** Credit memo assistant (built here), then KYC file builder, Complaint drafter, Client report drafter and Research notes (each adopted).
- **Summary:** "Time to first score: 6 weeks → 1 week".

### 8 · Playbooks (`#playbooks`)
Four cards, as on Production Assurance: Mandate Guardrails, Client Reporting Flow, Research Intake, Investor Reporting.

### 9 · 05 / Value (`#value`) · screenshot 09
- **h2:** "Errors caught you can bridge, / line by line."
- **Window:** "Suite report — Credit memo assistant · month 6".
- **Chart:** *Errors caught before a person sees them*, in %. The axis reads 92–96, using the same +80 offset as Production Assurance.
- **Bars:** Headline suite 94.2% · +1.2 pts severity weights · +0.5 edge cases (300 from history) · +0.2 citation checks · +0.3 change gate · Caught 96.4%.
- **Pill:** "+2.2 pts".
- **Footer line:** "+2.2 pts on 41,000 cases a quarter ≈ **902** fewer errors reaching reviewers a quarter".
- **Caption:** "…measured on the same 1,240-case suite."

### 10 · Related work (`#work`) · screenshot 10
- **Credit memo preparation across a $6.4B book** (`feat-covenant-watch.png`, Financial Services · Evaluation suites): Time per memo 6 hrs → 40 min · Memos prepared 1,240 · Field-level citations **100%**.
- **Overnight research intake for an equity team** (`research-intake.png`, Asset Management · Evaluation suites): Morning reading 2 hrs → 25 min · Sources read each night 300+ · Unsourced statements published **None**.

### 11 · "Not built yet?" audit band
- **Look:** the same as the Production Assurance band (`cta-c.webp` with a dark gradient).
- **Copy:** eyebrow "Not built yet?", then "Start with a two-week workflows & processes audit."
- **CTA:** "Book an audit →" links to `/ai-engineering#engagement`.

### 12 · 06 / Engagement · screenshot 11
| Card | Header | Facts |
|---|---|---|
| **The evaluation review** | 2 weeks · fixed fee | Covers: any system, any vendor · Access: read-only · Output: scored report |
| **The suite build / for production** (two-line title) | 6 weeks · per system | Runs in: your cloud · Cases: your history · Floor: agreed per system |
| **Nightly evaluation** | Monthly · per system | Report: monthly, one page · Notice: one month · Exit: suite handed over |

The third card's copy ends: "The suite is yours from day one, and your team can run it without us."

### 13 · Closing · screenshot 12
- **h2:** "Know it works. Every night."
- **CTA:** "Book an evaluation review".
- **Strapline:** "Evaluation suites built from your own cases, run every night and before every change." Keep it on one line on desktop.

---

## Content status
Every system, case count, run reference (S-0922, G-0923 and so on), policy code and figure is **illustrative**. Each diagram carries an "Illustrative…" caption. The case studies use sample data from `/work`.
