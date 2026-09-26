# 04 · 02 Audit (loop, 21.6s)

Markup `reference/sections/04-audit.html`. Motion `ANIMATIONS.md` §5.

## Markup

* Tile: `max-width:1280px; margin:0 auto; border-radius:12px; overflow:hidden; box-shadow:0 30px 90px
  rgba(20,20,18,0.20); border:1px solid var(--line); padding:calc(28px + clamp(36px,5.5vw,72px))
  clamp(24px,6.25vw,80px) clamp(48px,7.5vw,96px)`; background `#E8E2D2 url(valley-pastel.png) center 60% / cover`
  + veil `linear-gradient(180deg, rgba(248,246,240,0.55) 0%, rgba(248,246,240,0.15) 50%, rgba(248,246,240,0.05) 100%)`.
* Faux macOS menu bar, 28px, glass `rgba(252,251,249,0.62)` + blur 18px, 12.5px: diamond, "3264", File, Edit,
  View, Window, Help … status icons … "Tue 9 Jan  9:41 AM".
* Centred "02 / Audit" (13px `#2C2B27`) and h2 "In two weeks, we assess your systems and processes and give
  you a written foundation for what to rebuild." (margin-top 18px).
* `auFit` (`margin:48px 0 0; height:620px`) with `auStage` 1120×620 (`transform-origin:top left; opacity:0`):
  * Day header Day 1–Day 10 (mono 11.5px 500), 10 columns; `auGrid` dashed lines `rgba(20,20,18,0.16)`.
  * `auBars`: five glass Gantt bars (`rgba(252,251,249,0.8)`, blur 8px, radius 6px, 40px, `data-start`):
    Access, Read the code (Code map), Interview, Map obligations, Disposition (solid `#157F52`, white text).
  * `auPanel`: glass description panel, five columns (Day 1 … Days 9–10): range, 14px line, mono "→ deliverable".
  * `auCal`: glass calendar (radius 16): badge OCT 6, "Audit — Northgate Capital", "6 Oct – 17 Oct 2026 · 10
    working days · fixed fee", legend (Access `#6E6D67`, Read the code `#3E63D8`, Interview `#7C5CE0`, Map
    obligations `#D98E1F`, Disposition `#157F52`), Mon–Fri, `auCells` 2×5 cells 142px with 24 chips
    (`data-chip`, `data-day`; day-10 chips `data-green` with a `#12A05C` overlay).
  * `auWin`: window "Audit — LP Portal · day 10 of 10": list (`auItems`, "Components 11", "+ 6 more"); pane
    `auPane` from `auF` (severity · finding n, title, disposition pill, Where / Exposure / Obligation, Evidence
    block with the flagged line tinted, Disposition text, footer "1 keep · 9 rebuild · 1 retire · Owned by you").
* Caption under the tile (13.5px `var(--mut)`): "Illustrative findings from a fund operations tool. Real audits
  are reported per component, with evidence attached to each line."

Findings (`auData()`, verbatim): Database credentials, Fund access rules, Model prompt logs, Browser data path, Audit log.

## Gate

Time captures after the stage enters view: 2.4s, 7.5s, 11.8s, 14.0s, 18.0s (see `qa/scrub-points.json`).
