# 04 · §03 Origination (`#origination`): "From sourced to funded, with the memo attached."

Pinned, **600vh**. A field of 248 deal tiles is filtered, gate by gate, down to the 11 that fund.
A counter and a product vignette tell the story of each gate.

## Markup

PinnedStage shell with the **§03 variant** (`specs/00`): a left-aligned head, a 1240/700 wrap,
no radius or shadow, and no backdrop image or MenuBar.

* `section#origination[data-screen-label="Origination"]`
* Head (`oHead`): `width: 100%; max-width: 1240px`, h2 `margin: 0; max-width: 860px`, pinned
  scale, `text-wrap: pretty`: "From sourced to funded, with the memo attached."
* `oFit` → `oWrap` (`position: relative; width: 100%; max-width: 1240px; aspect-ratio: 1240 / 700; max-height: 100%; overflow: hidden`)
  → `oStage` (`absolute; 1240×700; transform-origin: top left`).

### Inside `oStage`: three **empty** hosts

| ref | Position |
| --- | --- |
| `oCount` | left 0, top 14, width 470 |
| `oField` | left 0, top 172, 490×480 |
| `oVig` | left 540, top 186, right 0, height 330 |

## Motion

`oBuild()` / `oSync()`. See `ANIMATIONS.md` §5.

The module builds:
* **The counter** in `oCount`: a stage name (mono 10px, 0.07em, uppercase, `--mut`), the count
  (66px / 0.95 / −0.042em, tabular), a label (14px `--sec`) and six 2px ticks with a 6px gap.
* **The field** in `oField`: a dotted ground (15px radial dots at `rgba(20,20,18,0.13)`)
  overhanging by 13px, and 248 absolutely positioned tiles.
* **Six vignettes** in `oVig`: 712px-wide white cards, radius 12, border rgba(20,20,18,0.13),
  shadow `0 26px 64px rgba(20,20,18,0.14)`. Stage 2 is the gates table, stage 3 the spreadsheet
  and the rest are key/value cards. Each has a chip line (`this.oStages[i].chip`).

The vignette is 712px wide but `oVig` starts at 540 in a 1240 stage, so it overhangs the stage's
right edge by 12px. That overhang is intended and is clipped by `oWrap`.

**DOM contract:** `oTrack oPin oHead oFit oWrap oStage oCount oField oVig`.

## Verify at

0.127 Sourced 248 · 0.280 Screened 96 · 0.433 Underwritten 61 · 0.587 To committee 38 ·
0.740 Approved 24 · 0.962 Funded 11 with the survivors live.

Also scrub 0.10 → 0.30 slowly. The fail sweep must travel left to right, with a slight diagonal,
and passing tiles must briefly pop (scale 1.16, saturate 1.5) as the wave crosses them.

## Pitfalls
* Tile count and colours are deterministic. If the field differs from the reference, the hash
  or the palette was changed, and it must not be.
* 248 elements with `filter: blur()` are expensive when all are animating. The module writes
  only on change, so do not add `will-change` to every tile; it costs more GPU memory than it
  saves.
