# 08 · Responsive, accessibility, performance

## Responsive

Designed and checked at 1280, 1440, 1920; works at 1024. Below 1024 is **not designed**.

Known issues under ~1000px: header nav wraps; Premise statements squeeze against their graphic
(`flex-wrap:nowrap`); the dark canvas scales toward illegibility (×0.29 at 375px); the Engagement cards' middle
row gets tight (the mini calendar and snippet shrink to `100%` of a narrow column).

Interim rule until mobile is designed: under 900px render the pinned sections unpinned (cards stacked in
document order, fills complete, the calendar complete, the snippet at its final state), render 03–05 at their
end states with no scroll hold, and ask design for mobile layouts.

## Accessibility

* Already in the logic under reduced motion: intro skipped; hero veil still; Premise and Engagement fills
  complete; 02 static frame (t = 18.5); 06 calendar complete; 06 snippet still (no idle motion, no pulses).
* **Open, must add:** the 03 scroll hold ignores reduced motion. Under reduced motion never lock, set
  `__rbCtl.t = 1`, and show 04/05 settled.
* The hold only takes downward input and releases on upward scroll, anchor clicks, hash changes and completion.
  Keep all of those. Space / PageDown / ArrowDown / End advance it for keyboard users.
* Decorative hosts `aria-hidden="true"`: Premise stages, `auStage`, every `[data-svg]`, `flyEl`, the intro stage,
  `enCal`, `enBld`.
* Word spans: keep the text in the DOM (opacity only); no per-word roles.
* Engagement spines are clickable `div`s in the reference: make them `button`s ("Show the audit" / "Show the
  build") with a visible focus state.
* The intro dismisses on click and any key, never traps focus, and hides itself on a timer if a callback is missed.

## Performance

* Three rAF loops. Keep their off-screen guards: 04/05 regenerate SVG only within 50px of the viewport; the 06
  snippet only while the build card shows and the section is on screen; the audit loop only once in view.
* `hero-plane.png` is the LCP: preload, AVIF/WebP at 1x/2x.
* The veil calls `getImageData` once per size change; the image must be same-origin.
* No page re-render on scroll. The only React state is the audit finding index.
