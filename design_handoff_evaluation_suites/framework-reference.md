# Framework reference (shared with the industry and service pages)

The Fund Management handoff spec, included unchanged because Evaluation Suites uses the **same components, timings and helpers**. Read it for mechanics; read `README.md` for every Evaluation Suites value.

---


## Overview
`/fund-management` is the industry page for fund managers' operations teams: the CFO, the COO, fund finance and investor relations. It tells one story, from a manual quarter-end to a measured, repeatable and traceable close:

1. **Premise:** the quarter-end is a project every time.
2. **Operations audit:** a two-week audit ranks processes by time returned and risk removed.
3. **First quarter-end:** a 100-day build log ending in an 8-day close.
4. **Traceability:** every figure carries its lineage.
5. **Across vehicles:** what is built once installs across funds.
6. **Playbooks:** the fund-operations playbooks, written up from delivery.
7. **Value:** a margin bridge.
8. **Related work:** two case studies.
9. **Engagement**, then the **Closing** band.

The page is built from the same framework as `/private-equity` (see `design_handoff_private_equity/`). **Build both from one shared set of components** (`StackedPremise`, `AuditMatrixLoop`, `BuildLogScrub`, `RolloutLoop`, `BridgeChart`, `EngagementCards`, `ClosingBand`) with page-specific content passed in as data.

## About the design files
The files in `reference/` are **design references built in HTML**. They are prototypes that show the intended look and behaviour, not production code to copy. Recreate them in the target codebase using its own patterns. If there is no codebase yet, use a static-first React framework, with each animation as a client component driven by a `requestAnimationFrame` loop or a scroll timeline.

**To open the prototype**, serve `reference/` as a static folder (for example `npx serve reference`) and open `Fund Management.dc.html`. `support.js` and `Site Header.dc.html` must sit beside it.
- Styles are inline, so exact values can be read from the markup.
- Behaviour lives in the `class Component` script at the bottom.
- Each animation is one method: `runIntro`, `initVeil`/`stepVeil`, `stepStack`, `stepDiag`, `stepPlan`, `stepTrace`, `stepPort`, `stepValue`, `stepEngage`.

## Fidelity
**High fidelity.** Colours, type, spacing, copy, timings and easing are final. Where this README and the HTML disagree, the HTML wins.

## Files in this bundle
| Path | What it is |
|---|---|
| `README.md` | This spec |
| `CHECKLIST.md` | Acceptance checklist |
| `copy-deck.md` | All visible copy, in page order |
| `screenshots/01–15` | Every section at 1526px, captured mid-animation where relevant |
| `reference/Fund Management.dc.html` | Page prototype (source of truth) |
| `reference/Site Header.dc.html` | Shared header with dropdown menus |
| `reference/support.js` | Prototype runtime |
| `reference/assets/…` | Every image used by the page and the header |

---

## Global tokens
| Token | Value |
|---|---|
| `--a` accent | `#157F52`. Used for "Live", the shortlist highlight, the selected trace row and evidence dots |
| `--bad` | `#C4341E`. Used for red status pills ("No register", "Overdue") and the "41" breaks total |
| ink / `--sec` / `--mut` | `#1A1917` / `#55544E` / `#6E6D67` |
| `--line` / `--line2` | `rgba(20,20,18,0.13)` / `rgba(20,20,18,0.075)` |
| page | `#F6F5F2` |
| window chrome | body `#FCFBF9`; title bar `rgba(20,20,18,0.045)`; traffic lights `#FF5F57`, `#FEBC2E`, `#28C840` |
| highlighter | `rgba(242,196,92,0.45)` |
| success tint | `#E3EFE7` background with `#157F52` text (the "Traced · 4 of 4 checks" pill) |
| iridescent gradient | `linear-gradient(96deg,#A8C8E8 0%,#E9E4CF 26–30%,#F3C9A8 52–62%,#D9C3E8 76–100%,#AEC9DE 100%)` |

**Type:** Instrument Sans (400, 500, 600) for text, IBM Plex Mono (400, 500) for eyebrows, axes, pills and counters. Sizes:
- h1: `clamp(36px, 4vw, 58px)`, −0.038em.
- Section h2: `clamp(30px, 3.1vw, 44px)`, −0.032em.
- Premise statements: `clamp(30px, 3.7vw, 56px)`.

**Layout:**
- Sections are `max-width: 1280px`, with `padding: 118px 40px` and a bottom border of `--line2`.
- **Radii:** frames 12px; cards 14–20px (the engagement cards are 20px); bands 20px.
- `html, body { overflow-x: clip }` is required. `hidden` breaks the sticky tracks.

### Shared animation helpers
These are identical to Private Equity. Implement them once.
- **`cl` / `sm`:** clamp to 0–1, and smoothstep.
- **`prog(track)`:** progress of a sticky track, 0 to 1. `m = (68 − rect.top) / (rect.height − (vh − 68))`.
- **`fit(box, stage, W, H, pad, max)`:** each diagram is authored on a fixed stage and uniformly scaled and centred into its responsive box. Keep this so the diagrams stay pixel-exact.
- **`clock(key, el, ms, top, bot)`:** a loop clock that starts when `el.top < top·vh` and `el.bottom > bot·vh`, and resets when the element leaves the viewport, so the loop replays on return.
- **`reveal(root, p)`:** `[data-r="x"]` children fade and rise 8px as `p` passes `x`.
- **`fill`:** word-by-word highlight from 0.16 to 1 opacity.
- **One rAF loop** (`tick`) writes styles straight to DOM refs, with values cached. Off-screen sections exit early. Don't re-render React per frame. The one exception is Traceability, which changes React state about every 5.6s.

---

## Header and menu linkage
- Render the shared **`SiteHeader`** (spec in `design_handoff_site_header/`) sticky at `top: 0`, `z-index: 100`. No page-specific header.
- **Current state:** Fund Management sits under **Industries**. Set `aria-current="page"` on Industries and on the Fund Management item in its dropdown and phone accordion.
- **Industries menu:** Private Credit → `/private-credit`, Private Equity → `/private-equity`, **Fund Management → `/fund-management`** (thumbnail `assets/playbooks/side-letter-register.png`), Asset Management → `/#industries` (no page yet).
- **Elsewhere on the site:**
  - **Footer, Industries column (every page):** Fund Management → `/fund-management`.
  - **Home page:** the Industries card "R3 Fund Management" links here, labelled "Explore →".
- **This page's footer:** Private Credit, Private Equity, Financial Services (`/#industries`), Fund Management (`#top`), Asset Management (`/#industries`); Case studies → `/work`; Playbooks → `/playbooks`; Field notes → `/essays`; Security → `/ai-engineering#platform`; Contact → `/contact`.
- **Outbound links from the page body:**
  - Playbook cards → `/playbooks/nav-pack-review`, `/playbooks/capital-call-flow`, `/playbooks/investor-reporting`, `/playbooks/side-letter-register`. "All nine playbooks" → `/playbooks`.
  - Related work cards → the case-study route (`/work/<slug>`). "All work" → `/work`.
- **In-page anchors:** `#top`, `#audit`, `#plan`, `#trace`, `#portfolio`, `#playbooks`, `#value`, `#work`, `#engagement`. Each needs `scroll-margin-top: 68px`. Every "Book…" CTA on the page jumps to `#engagement`.

---

## Sections

### 0 · Intro overlay (`runIntro`): about 4.3s, plays once
A full-screen `#F6F5F2` overlay (z-index 300) runs a four-row build log, then the wordmark.
- **Rows:** "audit the close", "rank by hours and risk", "ship the first process", "carry it to the next vehicle".
- **Row timing:** rows stagger 440ms apart; each fades and rises 7px over 440ms.
  - Each row's 68 × 3px track fills `scaleX` 0 → 1 over 560ms.
  - The last track is accent; the others are `#2C2B27`.
- **2.06s:** the footer "5 vehicles live · day 100" appears.
- **2.56s:** the box fades out.
- **3.02s:** the "3264.ai" wordmark scales from 0.972 to 1 (780ms, `cubic-bezier(.16,1,.3,1)`).
- **4.26s:** the overlay lifts (560ms).
- **Skipping:** a click or any key skips it (280ms fade).
- **Corner labels:** "Fund log" and "click to skip".
- **When it's skipped:** under reduced motion, or when `playIntro` is false. Recommendation: play it once per session.

### 1 · Hero (`#top`): pointer colour reveal. Screenshot 01
- **Height:** `clamp(560px, 44vw, calc(100vh − 68px))`.
- **Image:** `assets/hero-valley.png`, the same artwork and colours as the Home hero. Shown greyscale at rest via a canvas greyscale copy (luma 0.3R + 0.59G + 0.11B), cover-fitted and bottom-anchored.
- **Reveal:** pointer movement leaves soft circular holes that show the **original colours**.
  - A new point every ≥ 14px, up to 90 points.
  - Radius 53–84px; each hole lives 2.4s.
  - Off under reduced motion.
- **Glow:** a radial wash behind the copy keeps it legible.
- **Copy:**
  - Eyebrow: "Fund Management".
  - h1: "Quarter-end, closed in days. / Every figure traced to source."
  - Lede: up to 640px wide.
  - Buttons: "Book an operations audit" (→ `#engagement`) and "See the first quarter-end" (→ `#plan`).
- **Shared image:** Private Equity and Home use the same image. If marketing wants a distinct image here, the reveal must load *that* image's colour version, because the base and the colour layer must be the same artwork.

### 2 · 01 / Premise: stacked cards, scroll-scrubbed (`stepStack`). Screenshots 02–04
- **Head:** h2 "Every quarter-end is a project. / Very little of it is repeatable."
- **Track:** `760vh`, with a sticky frame at `top: 68px` (max 780px tall).
- **Card motion:** `t1 = sm(.28, .38, m)`, `t2 = sm(.64, .74, m)`.
  - Card 1: `translateX(−(3t1 + 2t2)%) scale(1 − .05t1 − .03t2)`.
  - Card 2: `translateX((1 − t1)·108 − 3t2 %) scale(1 − .05t2)`.
  - Card 3: `translateX((1 − t2)·108%)`.
- **Content progress:** P1 = `(m − .02)/.24`, P2 = `(m − .38)/.24`, P3 = `(m − .75)/.20`.
  - Words fill over the first 60% of each P.
  - Window rows reveal by their `data-r` value.

| Card | Background | Statement | Window (fixed stage) |
|---|---|---|---|
| What every fund team has | `ai-eng-wash.png` | "Every fund team closes the quarter. Most of it lives in spreadsheets and inboxes." | *Quarter-end tracker — Fund III · Q3* (620 × 470): six processes with team and status; "No register" and "Overdue" in red; footer "6 processes · 0 automated (highlighted) · 0 measured" |
| What the CFO sees | `cta-e.webp` | "Six vehicles, six close processes. Nobody can say what a quarter-end costs." | *Close calendar — all vehicles · Q3* (700 × 520): table of vehicle, days, manual steps, breaks open and evidence for six vehicles; total "19 avg · 265 · 41" with the 41 in red; auditor's management-letter quote highlighted |
| What did not change | `cta-a.jpeg` with a light veil | "LPs still expect the letter on time, and the auditor still tests every number in it." | *Fund calendar — Fund III* (660 × 500): a Q1 close → LP AGM timeline, then five auditor and LP requests; footer "5 of 5 open · audit fieldwork starts in February" |

### 3 · 02 / Operations audit (`#audit`): 19s loop (`stepDiag`). Screenshots 05–06
- **Frame:** `valley-pastel.png` with a light veil.
- **h2:** "In two weeks, we walk every fund operations process and rank where automation returns the most time and removes the most risk."
- **Stage:** 1120 × 600. Clock starts at `top < 62%vh`, `bottom > 25%vh`.
- **Matrix:**
  - Rows (vehicles): Fund III, Fund III Parallel, Fund II, Co-invest I, Credit Opps II, Cayman Feeder.
  - Columns (processes): NAV review, Capital activity, LP reporting, Side letters, Investor queries, Fees and carry.
  - Cells show **FTE released per quarter**, 0.1–1.2.

| t (s) | Beat |
|---|---|
| 0–0.9 | Stage, column headers and row headers fade in |
| 1.0–5.8 | A frosted scan band (126 × 450) sweeps the six columns, one every 0.75s. Each cell fills with a dark shade of `0.05 + 0.6·v/1.2` and shows its value |
| 6.2–7.0 | Other cells dim to 28%. Five shortlisted cells turn accent: Fund III × NAV review 1.2, Credit Opps II × side letters 0.8, Co-invest I × investor queries 0.7, Cayman Feeder × NAV review 0.6, Fund II × investor queries 0.9 |
| 7.4–8.1 | Grid chrome fades out |
| 7.8–9.2 | Shortlisted cells fly to bubbles on a plot: **capacity released ↑** (0.4–1.2 FTE) by **effort to ship →** (2–10 weeks) |
| 8.2–9.0 | Axes and the "Build first" quadrant appear |
| 9.0–10.1 | Bubble labels stagger in, 0.12s apart |
| 10.0–12.2 | The card "First builds · fund operations" rises in. Rows 01–05 stagger 0.35s apart. Footer: "4.2 FTE released across five builds · Build 04 reuses build 01" |
| 18.2–18.9 | Fade out, then loop |

- **Step strip:** "Days 1–6" → process map; "Days 7–9" → scored matrix; "Day 10" → first builds. The active step is at full opacity, the others at 42%; it switches at 6.2s and 9.8s.
- **Reduced motion:** frozen at t = 13s.
- **Data:** values and bubble targets are in `dgData()`.

### 4 · Audit CTA band. Screenshot 07
- **Background:** `cta-valley.png` behind a dark green gradient (`rgba(14,20,14,.84 → .28)`), 20px radius, 52px vertical padding.
- **Copy:** mono eyebrow "First step"; h2 "Start with a two-week operations audit."
- **Button:** white, square-cornered, "Book an audit →", to `#engagement`.
- **Note:** "The process map is yours, whether we build or not".

### 5 · 03 / First quarter-end (`#plan`): scroll-scrubbed (`stepPlan`). Screenshot 08
- **Track:** `520vh`. The frame shows `cta-valley.png` behind a 28% veil.
- **Stage:** 1120 × 620, fitted with 28px padding, up to 1.15× scale. Window: "Build log — Fund III · Q3 close".
- **Scrub:** `d = 100·(m − .04)/.88`, at 5.4px per day.
- **Gantt:** six rows, each bar growing as `d` passes it. A milestone diamond scales in at each bar's end, and a "Day N" playhead travels across.
  - Audit, days 0–14
  - Platform, 8–30
  - NAV pack tie-out, 14–42
  - Capital activity and notices, 36–64
  - LP quarterly reporting, 56–86
  - Evaluation and handover, 70–100
- **Log:** seven dated entries (D03 → D100) fade in as `d` passes each one. D100 is accent: "close measured at 8 days".
- **KPI panel:**
  - **Days to close the quarter:** counts down from 19 to **8**. It drops 6 days at D42, 3 at D64 and 2 at D86, each easing over 4 days.
  - **Hours back per quarter:** 0 → 820.
  - **Live:** "0 of 3" → "3 of 3".
  - **Checklist pills:** Planned → Building (highlighter) → Live (accent).
- **Reduced motion:** `d = 100`.

### 6 · Traceability (`#trace`): interactive and auto-playing (`stepTrace`). Screenshot 09
- **Head:** h2 "Click any figure. / See where it came from."
- **Frame:** `cta-b.avif` behind a light veil. Two panels in a responsive grid (`minmax(min(100%, 420px), 1fr)`).
- **Left panel:** window "Capital account statement — Fund III · Q3 2026", for Investor 0042, covering 1 Jul – 30 Sep.
  - **Six rows, as buttons:**
    - Opening £24,180,412
    - Contributions £1,250,000
    - Distributions (£820,000)
    - Management fee (£218,750)
    - Net investment gain £1,612,904
    - **Closing £26,004,566** (the five rows above sum to it)
  - **Selected row:** a 7% accent tint and a 3px accent left bar, at weight 500. The closing row has a dark rule above it.
- **Right panel, "Lineage":**
  - The selected label and amount (24–32px).
  - Four steps on a vertical rail: **Source → Matched to → Check → Reviewed**. Each step has a mono key, a description and a reference line.
  - Footer: the pill "Traced · 4 of 4 checks" and the note "Same trail in the auditor's view".
- **Behaviour:**
  - **Auto-advance** every **5.6s** while the frame is between 20% and 80% of the viewport. The 80px progress bar fills over each interval; the hint reads "Auto-playing · click any figure".
  - **Clicking a row** selects it and stops auto-play for the session. The bar shows full and the hint reads "Paused · click any figure".
  - **On every change,** the four steps re-enter staggered 110ms apart: opacity 0 → 1, translateY 6 → 0, over 420ms, `cubic-bezier(.16,1,.3,1)`.
  - **Reduced motion:** no auto-play and no stagger; clicking still works.
- **Data:** all trace data is in `trData()`.
- **Accessibility:** rows are `<button aria-pressed>`. Put `aria-live="polite"` on the lineage panel so a change is announced.

### 7 · 04 / Across vehicles (`#portfolio`): dark, 16s loop (`stepPort`). Screenshot 10
- **Frame:** `#0A0A0A` with `cta-c.webp` at 42%, a dark gradient and a 3px dot texture.
- **h2:** "Built once. Run across every vehicle." The second line, "Each fund goes live faster than the last.", is in iridescent text.
- **Stage:** 1120 × 520.
  - Five rows: Fund III (built here), then Fund III Parallel, Credit Opps II, Co-invest I and Cayman Feeder (installed).
  - Axis: 0–8 weeks at 80px per week. Bar lengths are 6, 3, 2, 1.5 and 1 weeks.
- **Timeline:**
  - **1.0–4.2s:** Fund III's bar builds.
  - **4.5–5.3s:** an iridescent chip, "NAV tie-out", arcs 30px up into the "Process library". The slot then shows "NAV pack tie-out · from Fund III · v1.4", and the count becomes 1.
  - **From 5.6s:** every 1.7s the chip arcs from the library to the next row (0.6s), and that bar grows over 0.35·W seconds.
  - **Each finished row:** a live dot, a week count and a delta (−50%, −67%, −75%, −83%).
  - **12.0s:** "Time to live: 6 weeks → 1 week".
  - **15.2–15.9s:** loop.
- **Reduced motion:** frozen at t = 14s.

### 8 · Playbooks (`#playbooks`). Screenshot 11
- **Head:** h2 "Four fund operations, / written up from delivery." plus a short lede and "All nine playbooks →".
- **Grid:** four cards, `minmax(min(100%, 260px), 1fr)`, with a 40px row gap and 22px column gap.
- **Card:** image at 4:3 with 16px radius, mono eyebrow "Playbook", a 20px title, a blurb, and "Read the playbook →". The whole card is the link, turning accent on hover.
- **Images:** `playbooks/nav-pack-review.png`, `capital-call-flow.png`, `investor-reporting.png`, `side-letter-register.png`.

### 9 · 05 / Value (`#value`): plays once on arrival (`stepValue`). Screenshot 12
- **h2:** "Margin you can bridge, / line by line."
- **Frame:** `audit-wash.png`. Window: "Management report — fund operations · Q3 update".
- **Chart:** *Operating margin on management fees*, in percent, axis 12–16 at 70px per point.
- **Bars, in sequence:**
  - Baseline 14.2% (0.4s)
  - +1.2 pts NAV pack tie-out, 4.6 → 1.2 FTE (1.35s)
  - +0.5 pts capital activity, notices same day (1.95s)
  - +0.2 pts LP reporting, cycle 12 → 4 days (2.55s)
  - +0.3 pts investor queries, response 5 → 1 day (3.15s)
  - Total 16.4%, measured at month 6 (3.75s)
- **Connectors:** dashed lines draw between bars.
- **Header counter:** ticks from 14.2% → 16.4%, with a "+x.x pts" pill.
- **4.8–6.4s:** "+2.2 pts of margin on £48m of management fees ≈ £1.06m a year" appears, and the £ figure counts up.
- **Reduced motion:** shown complete.

### 10 · Related work (`#work`). Screenshot 13
- **Head:** h2 "Measured against the quarter / before we arrived."
- **Grid:** two cards, `minmax(min(100%, 440px), 1fr)`.
- **Card:** a 16:9 image with 18px radius, an eyebrow, a 22–26px title, a summary, three metric rows (the third value in accent), and "Read the case study →".
- **Cards:**
  - **NAV pack tie-out for a multi-strategy manager** (`feat-nav-pack-review.png`): 6 days → 1 day · 3,400 lines · None.
  - **An operating model for AI across fund operations** (`side-letter-register.png`): 40% → 100% · 12 · None.
- **Button:** an outline "All work →" button.

### 11 · 06 / Engagement (`#engagement`): staggered entry (`stepEngage`). Screenshot 14
- **Cards:** three tall cards, minimum 560px high, **20px radius**, on `cta-d.avif`, `cta-b.avif` and `cta-valley.png`.
- **Veils:** the third card has a stronger white wash for legibility: `rgba(250,249,246,.88 → .78 → .66)`.
- **The three cards:**
  - **The operations audit:** 2 weeks, fixed fee.
  - **The first build:** 100 days, per process.
  - **The platform rollout:** ongoing, per vehicle.
- **Entry:** when the row reaches 85% of the viewport, the cards rise 24px and fade in, staggered 0.12s.
- **CTAs:** currently `mailto:`. Wire them to the booking flow.

### 12 · Closing. Screenshot 15
- **Image:** `footer-nocturne.png` at 1672:941, under a navy left-to-right gradient.
- **Copy:** h2 "Close the quarter in days."; white button "Book an operations audit" → `#engagement`.
- **Strapline:** "Fund operations rebuilt on one production platform, with every figure traced to source." plus "32 → 64".

---

## Imagery
All images are watercolour artwork. Serve them as AVIF or WebP at 1× and 2× with `alt=""`.

| Asset | Used in |
|---|---|
| `hero-valley.png` | Hero |
| `ai-eng-wash.png`, `cta-e.webp`, `cta-a.jpeg` | Premise cards |
| `valley-pastel.png` | Operations audit |
| `cta-valley.png` | Audit band, the build-log frame, engagement card 3 |
| `cta-b.avif` | Traceability frame, engagement card 2 |
| `cta-c.webp` | Across vehicles |
| `audit-wash.png` | Value |
| `cta-d.avif` | Engagement card 1 |
| `footer-nocturne.png` | Closing |
| `playbooks/*.png` | Playbook cards, case studies, header thumbnails |

## Performance
- One rAF loop; every step exits early when its section is off-screen.
- Prefer animating `transform` and `opacity`. The Gantt bars and bubbles animate `width` and `height` in the prototype; `scaleX` with a left transform origin is fine in production.
- The hero greyscale canvas is rebuilt only on resize; cap it at DPR 2.
- Lazy-load everything below the fold.

## Accessibility
- Diagram stages are `aria-hidden`. The h2, lede and the "Illustrative…" captions carry the meaning.
- Traceability is the only interactive diagram: rows are `<button aria-pressed>`, and the lineage panel is a polite live region.
- Under reduced motion: no intro, no hero reveal, no Traceability auto-play, and every diagram is static in its final state.
- Pinned tracks never trap focus.
- Contrast is ≥ 4.5:1, including over watercolours. That is why the veils exist.

## Content status
All fund and vehicle names, investor 0042, references (FIII-CC-14, J-3381 and so on), amounts, FTE figures and margins are **illustrative**. Each diagram carries an "Illustrative…" caption. The case-study cards use sample data from `/work`.
