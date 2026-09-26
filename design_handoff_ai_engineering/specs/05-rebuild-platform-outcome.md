# 05 · 03 Rebuild, 04 Platform, 05 Outcome (dark canvas)

Markup `reference/sections/05-rebuild-platform-outcome-host.html`, `05b-rebuild-platform.html`,
`05a-rebuild-graphic.html`. Motion `ANIMATIONS.md` §6–7.

## Host (page)

Section `#rebuild` (`padding:118px 40px`), inner `#platform`: `position:relative; overflow:hidden;
max-width:1280px; margin:0 auto; border-radius:12px; box-shadow:0 30px 90px rgba(20,20,18,0.20);
border:1px solid var(--line); background:#0A0A0A`, containing `<RebuildPlatform />`.

## RebuildPlatform

* `boxEl`: `position:relative; width:100%; aspect-ratio:1280 / 2980; overflow:hidden`.
* `wrapEl`: `absolute; left:0; top:0; 1280×2980; background:#0A0A0A; transform-origin:0 0`, scaled to the box.
  Children in this order (index 3 is load-bearing):
  1. `delivery-bg.webp` cover, `object-position:center top`.
  2. Dots `radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)` at 3px, opacity .6.
  3. SVG 1280×2980 with the lattice group `latEl`.
  4. 03 frame: `<RebuildGraphic bare />` (1280×1000).
  5. 04 frame `frameEl` (1280×900): `[data-svg="1a"]`; "04 / Platform" (mono 11px 0.16em `rgba(255,255,255,0.55)`);
     h2 "Your processes run station to station." + gradient-text "We platformise the line."; captions at top
     262px: "From multiple places." / "Multiple handoffs." (left 100px), `[data-c4="1"]` "One platform." / "End to
     end." (left 500px), `[data-c4="2"]` "To a single flow." / "Clear ownership." (left 900px). Titles 15px 500
     `#F4F3F0`, sublines 12.5px `rgba(244,243,240,0.62)`.
  6. 05 frame `f5El` (1280×1080): `[data-svg="05"]`; "05 / Outcome"; h2 "One platform. Many outcomes." +
     gradient "Compounding impact across your firm."; three `[data-o5]` blocks: 1 Better reporting cadence,
     2 Stronger compliance trackability, 3 Higher scalability (descriptions verbatim in 05b).
  7. `flyEl`, `display:none` until the handoff.

## RebuildGraphic (03)

1280×1000: "03 / Rebuild", h2 "Your spreadsheets, prototypes and PDFs in." + gradient "One production
platform out."; `[data-svg="2a"]` 720×600; `[data-grid="2a"]`; a "Book an audit call →" button that `bare` hides.

## Behaviour

03 holds the page until its four tiers assemble (auto-play, or scrubbed forward by input); the next 0.6 screen
of scroll flies the platform into 04, which plays from the landing; 05 plays on arrival. All SVG is regenerated
each frame as a string (`scene`, `scene05`, graphic `scene`). Keep that approach; the timings were tuned on it.

## Gate

Hold engages at the hold point; input advances the build; auto-play resumes after 0.9s idle; the page releases
on completion, on upward scroll and on any anchor click; the flight follows scroll both ways; 04 and 05 play.
