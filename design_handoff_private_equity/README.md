# Handoff: Private Equity industry page

## Overview
`/private-equity` is the industry page aimed at private equity sponsors: operating partners, portfolio CFOs and the fund's value creation team. It argues one thing in six acts: *AI pilots in portfolio companies rarely reach EBITDA; 3264 audits the portfolio, ships the top builds in 100 days, carries them across companies, and leaves evidence a buyer can diligence at exit.*

The page has four kinds of motion:
- **Intro overlay:** a scripted sequence that runs once on load.
- **Hero colour reveal:** follows the pointer.
- **Three scroll-scrubbed sections:** sticky "pinned" tracks.
- **Three time-based loops:** these start when the section comes into view.

All of them respect `prefers-reduced-motion`.

## About the design files
The files in `reference/` are **design references built in HTML**. They are prototypes that show the intended look and behaviour, not production code to copy. Recreate the page in the target codebase (Next.js, Astro or similar) using its own component and animation patterns. If there is no codebase yet, use a static-first React framework. Each animation should be one client component driven by a `requestAnimationFrame` loop or a scroll timeline.

**To open the prototype**, serve `reference/` as a static folder (for example `npx serve reference`) and open `Private Equity.dc.html`. `support.js` must sit beside it, and so must `Site Header.dc.html`, which provides the shared header.
- All styles are inline, so exact values can be read from the markup.
- The behaviour lives in the `class Component` script at the bottom of the file.
- Each animation is one method, named in this README: `stepStack`, `stepDiag`, `stepPlan`, `stepPort`, `stepValue`, `stepEngage`, `runIntro` and `initVeil`/`stepVeil`.

## Fidelity
**High fidelity.** Colours, type, spacing, copy, timings and easing curves are final. Where this README and the HTML disagree, the HTML wins.

## Files in this bundle
| Path | What it is |
|---|---|
| `README.md` | This spec |
| `CHECKLIST.md` | Acceptance checklist for QA and PR review |
| `copy-deck.md` | All visible copy, in page order |
| `screenshots/01–11` | Each section at 1526px, captured mid-animation where relevant |
| `reference/Private Equity.dc.html` | The page prototype (source of truth) |
| `reference/Site Header.dc.html` | The shared header with dropdown menus, rendered at the top of the page |
| `reference/support.js` | Runtime needed to open the prototypes |
| `reference/assets/…` | Every image the page and the header use |

---

## Global tokens
| Token | Value |
|---|---|
| `--a` accent | `#157F52` (also the colour for success, "Live" and the shortlist highlight) |
| `--bad` | `#C4341E` (red status pills) |
| ink | `#1A1917` |
| `--sec` | `#55544E` |
| `--mut` | `#6E6D67` |
| `--line` / `--line2` | `rgba(20,20,18,0.13)` / `rgba(20,20,18,0.075)` |
| page | `#F6F5F2` |
| window chrome | `#FCFBF9` body, `rgba(20,20,18,0.045)` title bar, traffic lights `#FF5F57`, `#FEBC2E`, `#28C840` |
| highlighter | `rgba(242,196,92,0.45)` (the "marker" behind key figures) |
| iridescent gradient | `linear-gradient(96deg,#A8C8E8 0%,#E9E4CF 26–30%,#F3C9A8 52–62%,#D9C3E8 76–100%,#AEC9DE 100%)` |

**Type**
- Instrument Sans (400, 500, 600) for everything.
- IBM Plex Mono (400, 500) for eyebrows, axis labels, status pills and day counters.
- Display sizes: h1 `clamp(36px, 4vw, 58px)` / −0.038em; section h2 `clamp(30px, 3.1vw, 44px)` / −0.032em; premise statements `clamp(30px, 3.7vw, 56px)` / −0.034em.

**Layout**
- Sections are `max-width: 1280px` with `padding: 118px 40px` and a bottom border of `--line2`.
- The page must use `overflow-x: clip` on `html, body`. Using `hidden` breaks every sticky track.

### Shared animation helpers (reuse these)
- `cl(x)` clamps to 0–1. `sm(a,b,x)` is smoothstep: 0 at `a`, 1 at `b`.
- **`prog(track)`** returns a sticky track's progress `m`, from 0 to 1: `(68 − rect.top) / (rect.height − (vh − 68))`. 68px is the header height.
- **`fit(box, stage, W, H, pad, max)`**: every diagram is authored on a **fixed-size stage** (for example 1120 × 600) and uniformly scaled and centred into its responsive box. Scale is `min(max, (w − 2·pad)/W, (h − 2·pad)/H)`. Keep this approach so the diagrams stay pixel-exact at every width.
- **`clock(key, el, ms, top, bot)`**: a loop clock starts when the element's top passes `top × vh` while its bottom is still below `bot × vh`. It resets when the element leaves the viewport, so the loop replays from zero on return.
- **`reveal(root, p)`**: children with `data-r="0.2"` fade and rise 8px into place as `p` passes that value (over 0.08 of progress).
- **`fill(p, P, base)`**: word-by-word highlight. Each word span runs from opacity `base` (0.16) to 1 as `P` sweeps across, with a soft 2.5-word leading edge.
- Write styles directly to the DOM through refs (cached so unchanged values aren't re-set). There is one rAF loop for the whole page (`tick`). Don't re-render React per frame.

---

## Header and menu linkage
The page renders the shared **`SiteHeader`**, the same component documented in `design_handoff_site_header/`, sticky at the top (`position: sticky; top: 0; z-index: 100`). Do not build a page-specific header.
- **Current section:** Private Equity sits under **Industries**. Set `aria-current="page"` on Industries and on the Private Equity item inside its dropdown.
- **Industries dropdown** (desktop panel and phone accordion): Private Credit → `/private-credit`, **Private Equity → `/private-equity`**, Fund Management → `/fund-management`, Asset Management → `/#industries` (no page yet). The thumbnail for Private Equity is `assets/playbooks/capital-call-flow.png`.
- **Header CTA "Book an audit"** → `/ai-engineering#engagement`. On this page, a page-level override to `#engagement` is acceptable if the router supports it.
- **Footer, Industries column:** Private Credit, Private Equity (current page, `#top`), Financial Services (`/#industries`), Fund Management (`/fund-management`), Asset Management (`/#industries`).
- **Footer, other columns:** Case studies → `/work`, Playbooks → `/playbooks`, Field notes → `/essays`, Security → `/ai-engineering#platform`, Contact → `/contact`.
- **In-page anchors:** `#top`, `#audit`, `#plan`, `#portfolio`, `#value`, `#engagement`. Give each `scroll-margin-top: 68px`.

---

## Sections

### 0 · Intro overlay (`runIntro`), about 4.3s, once per load
A fixed full-screen overlay (`#F6F5F2`, z-index 300) shows a four-row "build log" while the page loads beneath it.
- **Rows:** "audit the portfolio", "rank by EBITDA impact", "ship the first build", "carry it to the next company".
- **Each row:** number (13px, muted), label (17.5px), and a 68 × 3px progress track.
- **Timing per row** (`i × 440ms`): the row fades and rises 7px (440ms, delay 120ms + i·440), then its track fills `scaleX(0 → 1)` (560ms, `cubic-bezier(.4,0,.2,1)`, delay 280ms + i·440).
  - The last fill is accent green; the others are `#2C2B27`.
- **2.06s:** a footer fades in: "5 companies live" on the left, "day 100" on the right.
- **2.56s:** the box fades to `scale(.985)` (620ms).
- **3.02s:** the "3264.ai" wordmark scales in from 0.972 (780ms, `cubic-bezier(.16,1,.3,1)`).
- **4.26s:** the overlay fades out (560ms) and is removed.
- **Skipping:** a click or any key skips it with a 280ms fade. Corner labels: "Portfolio log" (bottom-left) and "click to skip" (bottom-right).
- **Skipped entirely** under reduced motion or when `playIntro` is false.
- Production recommendation: play it only on a visitor's first page view per session.

### 1 · Hero (`#top`), pointer colour reveal (`initVeil` / `stepVeil`). Screenshot 01
- **Layout:** height `clamp(560px, 44vw, calc(100vh − 68px))`, centred copy, padding-top `clamp(48px, 5.2vw, 76px)`.
- **Image:** `assets/hero-valley.png` (the same artwork as the Home hero), `object-fit: cover`, `object-position: center bottom`.
  - On load it is shown in greyscale: CSS `grayscale(1)` until the canvas is ready, then a canvas greyscale copy (luma 0.3R + 0.59G + 0.11B), cover-fitted and bottom-anchored to match the `<img>`.
- **Reveal:** moving the pointer over the hero leaves soft circular "holes" in the grey layer that show the **original colours** underneath.
  - A point is recorded every 14px or more of travel, up to 90 points.
  - Each hole has a radius of 53–84px (random) and a random phase.
  - Holes live for **2,400ms**, fading as they age.
  - The canvas is cleared and redrawn each frame while any point is alive.
- **Disabled** under reduced motion or `motion: false`: the image stays greyscale.
- **Glow:** `radial-gradient(ellipse 60% 52% at 50% 18%, rgba(250,248,240,0.62), rgba(250,248,240,0.28) 55%, transparent)` keeps the copy legible.
- **Copy:** eyebrow "Private Equity"; h1 "The value creation plan, / in production by day 100."; lede (max 640px).
- **Buttons:** "Book a portfolio audit" (dark, → `#engagement`) and "See the first 100 days" (outline, → `#plan`).

### 2 · Premise: three stacked cards, scroll-scrubbed (`stepStack`). Screenshots 02–04
- **Head row:** eyebrow "01 / Premise", h2 "Every portfolio company is experimenting. / Very little of it reaches EBITDA.", lede.
- **Track:** `min-height: 760vh`. Inside it, a sticky frame at `top: 68px`, height `calc(100vh − 68px)`, max 780px.
- **Cards:** three absolutely positioned cards fill the frame, each with a watercolour background, a 1px border and the shadow `-18px 0 48px rgba(20,20,18,0.16)`.
  - Left half: mono eyebrow plus a large statement.
  - Right half: an app-window mock, authored at a fixed size and scaled with `fit`.

| Card | Background | Statement (word-highlight) | Window |
|---|---|---|---|
| 1 What every company has | `ai-eng-wash.png` | "Every portfolio company has AI pilots. Most of them live on one person’s laptop." | *AI initiatives — Helix Logistics* (620 × 470): 6 initiatives with status pills, ending "0 in production" highlighted |
| 2 What the fund sees | `cta-e.webp` | "Six companies, six approaches. None of it rolls up into the board pack." | *Value creation tracker — Fund III · Q3 board* (700 × 520): table of 6 companies, total "Not reported" in red, LP quote with "progressing" highlighted |
| 3 What did not change | `cta-a.jpeg` + light veil | "The hold is still five years, and every number in the plan gets diligenced at exit." | *Hold plan — Helix Logistics* (660 × 500): Entry → Exit timeline, then the buyer’s request list (5 items) |

- **Transitions** (`m` = track progress):
  - `t1 = sm(.28, .38, m)`; `t2 = sm(.64, .74, m)`.
  - Card 1: `translateX(−(3·t1 + 2·t2)%) scale(1 − .05·t1 − .03·t2)`.
  - Card 2 enters from `translateX(108%)`, then `translateX((1 − t1)·108 − 3·t2 %) scale(1 − .05·t2)`.
  - Card 3: `translateX((1 − t2)·108%)`.
  - The result is that each new card slides over the last, which recedes slightly.
- **Content progress per card:** P1 = `(m − .02)/.24`, P2 = `(m − .38)/.24`, P3 = `(m − .75)/.20`.
  - The statement words fill over the first 60% of P (`fill`).
  - Window rows reveal by their `data-r` thresholds (`reveal`).
- **Reduced motion:** every P is 1, so the card text and window rows render fully revealed. The card slides are positions, not effects, so they stay.

### 3 · Portfolio audit (`#audit`), 19s loop (`stepDiag`). Screenshots 05–06
- **Frame:** a rounded card (12px) on `valley-pastel.png` with a top-down light veil. Eyebrow "02 / Portfolio audit"; h2 "In two weeks, we walk the workflows in each portfolio company and rank where AI moves EBITDA."
- **Stage:** authored at **1120 × 600** inside `aspect-ratio: 1120/600`.
- **Clock:** starts at `top < 62% vh` and `bottom > 25% vh`; restarts on re-entry.

| Time (s) | Beat |
|---|---|
| 0–0.5 | Stage fades in. Column heads (6 workflows) and row heads (6 companies with sectors) fade in by 0.9 |
| 1.0–5.8 | A frosted **scan band** (126 × 450) sweeps across the 6 columns, one every 0.75s. Each column's 36 cells fill with a dark shade proportional to value (`0.05 + 0.6·v/1.2`) and show the £m figure (white text on dark cells) |
| 6.2–7.0 | Non-shortlisted cells dim to 28%. The 5 shortlisted cells turn accent green |
| 7.4–8.1 | Grid chrome and the remaining cells fade out |
| 7.8–9.2 | The 5 green cells **fly** to bubbles on an impact (↑ £0.4m–£1.2m) × effort (→ 2–10 wks) plot. Size and radius morph from 118 × 56 to a circle of diameter `d` |
| 8.2–9.0 | Axes, gridlines and the "Build first" quadrant fade in |
| 9.0–10.1 | Bubble labels fade in, 0.12s apart |
| 10.0–12.2 | The **"First builds · Fund III"** list card rises in (12px), then rows 01–05 stagger every 0.35s, then the total "£4.2m run-rate EBITDA across five builds / Build 04 reuses build 01" |
| 18.2–18.9 | Stage fades out, then the loop restarts |

- **Step strip:** a frosted bar at the bottom of the stage has three steps: "Days 1–6", "Days 7–9" and "Day 10". The active step is at full opacity and the others at 42%. It switches at 6.2s and 9.8s.
- **Data:** in `dgData()`, the 6 × 6 value matrix `v` and the bubble targets `top["row-col"] = [cx, cy, diameter]`.
- **Reduced motion:** frozen at t = 13s, the plot and ranked list.
- **Note under the frame:** "Illustrative portfolio…".

### 4 · First 100 days (`#plan`), scroll-scrubbed (`stepPlan`). Screenshot 07
- **Track:** `min-height: 520vh`, sticky frame max 720px. The frame shows `cta-valley.png` with a 28% light veil.
- **Stage:** 1120 × 620, fitted with 28px padding and up to 1.15× scale. Contents:
  - **Gantt (left):** 6 rows (Audit, Platform, three capabilities, Evaluation and handover) on a 0–100-day axis at **5.4px per day**.
  - **Scrub:** `d = 100 · (m − .04)/.88`.
    - **Bars:** each `[data-bar]` grows to `5.4·(e − s)·progress`.
    - **Milestone diamonds:** at each bar end, `rotate(45deg)` scaling from 0.4 to 1.
    - **Playhead:** a 1.5px line with a dark "Day N" chip that rides at `5.4·d`.
  - **Log (below):** 7 dated entries (D03 → D100). Each fades in as `d` passes its day; D100 is in accent green.
  - **KPI panel (right):**
    - Run-rate EBITDA counts up to **£1.90m** (+1.2 at D42, +0.5 at D64, +0.2 at D86, each easing over 4 days).
    - Hours back per week: 0 → 540.
    - Live: "0 of 3" → "3 of 3".
    - Board-pack status pills step through Planned (grey) → Building (highlighter) → Live (accent, white text).
- **Reduced motion:** `d = 100`.

### 5 · Portfolio (`#portfolio`), dark, 16s loop (`stepPort`). Screenshot 08
- **Frame:** `#0A0A0A` card with `cta-c.webp` at 42% under a dark gradient and a 3px dot texture.
- **Copy:** eyebrow "04 / Portfolio"; h2 "Built once. Carried across the portfolio." with the second line in iridescent gradient text.
- **Stage:** 1120 × 520.
  - **Gantt:** 5 company rows on a 0–8-week axis at **80px per week**.
  - **Durations:** W = [6, 3, 2, 1.5, 1] weeks.
- **Timeline:**
  - Row 1 (Helix) builds over 1.0–4.2s.
  - 4.5–5.3s: an iridescent **chip** "Invoice matching" arcs (30px lift) from Helix's bar into the **Capability library** card. The library slot fills and its count becomes "1 capability".
  - Rows 2–5 each start 1.7s apart from 5.6s. The chip arcs from the library to the row (0.6s), then the bar grows over `0.35·W` seconds.
  - Each row ends with a live dot, a week count ("3 wks", "2 wks"…) and a delta (−50%, −67%, −75%, −83%).
  - 12.0s: summary "Time to live: 6 weeks → 1 week".
  - 15.2–15.9s: fade out and loop.
- **Reduced motion:** frozen at t = 14s.

### 6 · Value (`#value`), plays once on arrival (`stepValue`). Screenshot 09
- **Frame:** a card on `audit-wash.png` holding a "Board pack" window (1120 × 600): an **EBITDA bridge** (£m, axis 12–16, 70px per £1m).
- **Bars** draw upward in sequence:
  - Entry £14.2m (0.4s)
  - +£1.2m invoice matching (1.35s)
  - +£0.5m carrier rate checks (1.95s)
  - +£0.2m month-end accruals (2.55s)
  - +£0.3m service triage (3.15s)
  - Total £16.4m (3.75s)
- Dashed connectors draw between bars, and labels fade in near the end of each bar.
- **Header counter:** ticks "£14.2m → £16.4m" with a green "+x.x%" pill.
- **4.8–6.4s:** the footer line "+£2.2m run-rate EBITDA × 9.0× exit multiple ≈ £19.8m of enterprise value" fades in, and the £ figure counts up.
- **Reduced motion:** shown complete at t = 10s.

### 7 · Engagement (`#engagement`), staggered entry (`stepEngage`). Screenshot 10
- **Layout:** three tall cards (min-height 560px) on watercolours (`cta-d.avif`, `cta-b.avif`, `cta-valley.png`) with light veils.
- **Each card:** mono header (number · duration), a 34–46px title, body copy, a three-cell facts row and a CTA.
- **Entry:** when the row top reaches 85% vh, the cards rise 24px and fade in, staggered 0.12s.
- **CTAs:** "Book an audit" and "Book a call". These are currently `mailto:hello@3264.ai`; wire them to the booking flow.

### 8 · Closing (night sky). Screenshot 11
- **Image:** `footer-nocturne.png`, aspect 1672 / 941, under a navy gradient running left to right.
- **Copy:** "3264.ai" in the top-left; h2 "Bring the evidence to exit."; white button "Book a portfolio audit" → `#engagement`.
- **Below:** the strapline "AI value creation for private equity portfolios, measured from the baseline to exit." and "32 → 64".

### 9 · Footer
This is the site-standard footer; its links are listed under Header and menu linkage.

---

## Imagery
All images are watercolour artwork. Serve each one responsively as AVIF or WebP at 1× and 2×, with `alt=""` because they are decorative.

| Asset | Used in |
|---|---|
| `hero-valley.png` | Hero (greyscale plus colour reveal) |
| `ai-eng-wash.png`, `cta-e.webp`, `cta-a.jpeg` | Premise cards 1–3 |
| `valley-pastel.png` | Audit frame |
| `cta-valley.png` | 100-day frame, Engagement card 3 |
| `cta-c.webp` | Portfolio (dark) |
| `audit-wash.png` | Value frame |
| `cta-d.avif`, `cta-b.avif` | Engagement cards 1–2 |
| `footer-nocturne.png` | Closing |
| `playbooks/*.png` | Header dropdown thumbnails and feature cards |

## Performance
- **One rAF loop.** Each `step*` exits early when its section is off-screen (`prog().on`, or `clock` returning −1).
- **Animate only cheap properties.** Use `transform` and `opacity` wherever possible. The prototype also animates `width` and `height` on Gantt bars and bubbles; `scaleX` with `transform-origin: left` is an acceptable production substitute.
- **Hero canvas.** Rebuild the greyscale copy only on resize, and cap the canvas at device-pixel-ratio 2.
- **Lazy-load** everything below the fold.

## Accessibility
- Every diagram stage is `aria-hidden="true"`. The section h2 and lede carry the meaning, and the "Illustrative…" notes sit as real text below each diagram.
- Reduced motion behaves as described per section: no intro, no hero reveal, and each diagram frozen in its final or most informative state.
- Pinned tracks must not trap keyboard users. All links stay in normal tab order.
- Text contrast is at least 4.5:1, including text over watercolours (the veils exist for this).

## Prototype-only props
- `accent`: keep `#157F52`.
- `motion`: replaced by the user's reduced-motion setting.
- `playIntro`: product decision; suggested once per session.

## Content status
All company names (Helix Logistics, Ardent Dental Group, Northfield Foods, Corvid Software, Beacon Claims, Tallis Engineering), the "Fund III" label and every £ figure are **illustrative**. Each diagram has an "Illustrative…" caption. Keep the captions until signed-off engagement data replaces the figures.
