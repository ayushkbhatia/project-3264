# 02 · §01 Reality (`#reality`): "Run a bigger book without a bigger back office"

Pinned, **600vh**. The argument: today you run on disconnected tools, and 3264 builds one
platform. Four realistic "legacy" windows pile up, then give way to the platform, which walks
through seven screens.

## Markup

Use the PinnedStage shell (`specs/00`), with a stage backdrop, MenuBar and ScrollBlip.

* `section#reality[data-screen-label="Operating reality"]`
* Head h2: "Run a bigger book without a bigger back office"

### Inside `stage` (1200×780 stage px), in DOM order, which is also z-order

| ref | Left | Top | W×H | Content |
| --- | --- | --- | --- | --- |
| `titleA` | 44 | 62 | 572 wide | **empty** `<h2>`; the module fills it with word spans |
| `titleB` | 44 | 62 | 790 wide | **empty** `<h2>`, `opacity: 0` |
| `w0` | 44 | 260 | 430×296 | "Loan Servicing — Production": a 4-column table (Borrower, Drawn, Rate, Next) with 5 rows and the foot "24 positions · last export 09:14 · CSV" |
| `w1` | 720 | 460 | 444×238 | "Mail": subject "RE: Q3 compliance certificates (14 of 24)", meta "Fund Operations → Credit Analyst · 06:41", body paragraph, and 3 attachment pills |
| `w2` | 830 | 210 | 330×238 | "Ardyne_CompCert_Q3.pdf": "Compliance Certificate" eyebrow, "Ardyne Packaging Ltd", 3 grey text bars at 100/92/74%, and Total Net Leverage 4.10x / Interest Cover 2.80x |
| `w3` | 196 | 324 | 512×338 | "Covenants_MASTER_v14.xlsx": formula bar `=IF(D14/E14>4.5,"BREACH",IF(D14/E14>4.2,"WATCH",""))`, column heads B–F, rows 11–16, and sheet tabs Q3 / Q2 / Q1 / WORKING / old_DO_NOT_USE |
| `plat` | 70 | 180 | 1060×518 | platform window shell (below) |

Both titles share: `position: absolute; margin: 0; font-size: 31px; font-weight: 400; letter-spacing: -0.03em; line-height: 1.12; color: #1A1917; text-shadow: 0 1px 18px rgba(252,251,249,0.9); text-wrap: pretty`.

All four windows and `plat` start at `opacity: 0`. Every window uses `border-radius: 10px`
(plat: 11), a `#FCFBF9` background and a FauxWindow title bar. The borders and shadows differ
slightly per window:

| ref | border | box-shadow |
| --- | --- | --- |
| w0 | rgba(20,20,18,0.14) | 0 22px 54px rgba(20,20,18,0.20), 0 3px 9px rgba(20,20,18,0.12) |
| w1 | rgba(20,20,18,0.16) | 0 24px 58px rgba(20,20,18,0.22), 0 4px 10px rgba(20,20,18,0.13) |
| w2 | rgba(20,20,18,0.14) | 0 20px 50px rgba(20,20,18,0.19), 0 3px 8px rgba(20,20,18,0.11) |
| w3 | rgba(20,20,18,0.16) | 0 26px 64px rgba(20,20,18,0.23), 0 4px 12px rgba(20,20,18,0.14) |
| plat | rgba(20,20,18,0.14) | 0 30px 74px rgba(20,20,18,0.24), 0 3px 12px rgba(20,20,18,0.14) |

**Window interiors are static markup. Copy them cell for cell from reference lines 157–269.**
Details that must survive:
* w3 row 14 is highlighted: a darker row number, the D cell `52.1` with
  `outline: 1.5px solid var(--a); outline-offset: -1px; background: rgba(21,127,82,0.05)`, and F
  shows `#REF!` in `--bad`. Row 12 F is `WATCH` in `--warn`. Row 16 is all `—` in `--mut` with
  "cert not in" at 9px.
* w0 numerals are tabular and right-aligned, and "Next" is `--mut`.
* Mono (Plex) is used for the table heads, the w0 footer, w1 meta, the formula, column and row
  labels, and nowhere else.

### `plat` shell

Title bar (34px): "3264 · Private Credit Platform". Body: `flex: 1 1 auto; min-height: 0; display: flex` with three **empty** hosts:

| ref | Style |
| --- | --- |
| `pfSide` | `flex: 0 0 196px; border-right: 1px solid rgba(20,20,18,0.08); padding: 16px 0; background: rgba(20,20,18,0.015); display: flex; flex-direction: column` |
| `pfMain` | `flex: 1 1 auto; min-width: 0; padding: 18px 22px` |
| `pfRail` | `flex: 0 0 226px; border-left: 1px solid rgba(20,20,18,0.08); padding: 18px; background: rgba(20,20,18,0.012)` |

**Do not render `badgeA`.** The caption "Multiple systems and handoffs, slowing your fund down."
was removed from the design on 24 Sep 2026. The module still lists `badgeA` and skips it when
it is absent.

## Motion

`sync()`. See `ANIMATIONS.md` §3 for the beat table. The module builds:
* word spans in `titleA` / `titleB` (copy in `this.tA` / `this.tB`)
* the sidebar ("Meridian Credit II", 7 nav rows with counts, and a foot reading "one record" /
  "0 re-keys today"), the main table and the rail for each of the seven screens in `this.screens`

**DOM contract:** `track pin rHead rFit wrap stage titleA titleB w0 w1 w2 w3 plat pfSide pfMain pfRail`
(+ `badgeA`, intentionally absent).

## Verify at (from `qa/scrub-points.json`)

0.02 empty · 0.09 title A half-revealed · 0.20 w0 in, w1 arriving · 0.36 all four windows ·
0.47 hand-over · 0.57 title B done, platform rising · 0.628 / 0.683 / 0.738 / 0.793 / 0.848 / 0.903 / 0.958,
one screen each.

What must match at each point: which elements are visible and at what opacity, the word count
revealed, the active sidebar row, and the table contents with status colours.
