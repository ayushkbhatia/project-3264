# Verification checklist — 3264.ai Home

Walk this against the finished port, at 1440px wide unless stated. Compare to
`screenshots/` and to `reference/3264 Home.dc.html` open in a browser.

## Typography and colour

- [ ] Instrument Sans loaded and self-hosted; no flash of fallback on reload
- [ ] No heading anywhere is bolder than 400 — check h1, h2, h3 in every section
- [ ] Hero h1 breaks after "Deployment is" at every width
- [ ] Negative tracking present on all display type (h1 `-0.038em`, section h2 `-0.032em`)
- [ ] All numeric figures are tabular — the case-study values and the run panel do not jitter
- [ ] Accent `#157F52` appears only on: link hover, active act marker, the third case-study
      value in each card, the footer status dot, and act eyebrow numerals
- [ ] Page background is `#F6F5F2`, not white

## Layout

- [ ] Content column caps at 1280px with 40px gutters, centred
- [ ] Section rhythm: 130px vertical padding, hairline `--line2` bottom borders
- [ ] Card grids read as single hairlines — no doubled borders at the outer edge, no visible
      gutter colour
- [ ] Grid texture is 32 columns wide (count them), fades out downward, in hero and closing CTA
- [ ] Sticky header blurs content behind it and sits above everything except the intro overlay
- [ ] Footer image holds `1672/941` with the navy scrim left-to-right, CTA vertically centred

## Content

- [ ] All copy verbatim against the reference — no rewrites, no reordered lists
- [ ] Placeholder note still present under the case-study cards
- [ ] Placeholder note still present under the team grid
- [ ] Nine stack logos, no empty cells
- [ ] Footer copyright reads `© 2026 Bearing Deployment Company Inc. All rights reserved.`
- [ ] Anchors resolve: `#top #model #capabilities #industries #work #company #playbooks #contact`

## Intro relief

- [ ] Plays once on load, roughly four seconds, then removes itself
- [ ] Caption counts `2 · 4 · 8 · 16 · 32 · 32 × 64`
- [ ] `.ai` appears after `3264`
- [ ] Click anywhere dismisses it; any keypress dismisses it
- [ ] After dismissal the page is immediately interactive — click a nav link straight away and
      confirm it fires (this is the overlay-swallowing-clicks regression)
- [ ] With `prefers-reduced-motion: reduce`, no overlay appears at all
- [ ] Reload with DevTools throttled to slow 3G: page is usable before the relief resolves

## Platform sequence

- [ ] Track is 420vh; the pane pins for its full length and releases cleanly at both ends
- [ ] Scrubbing up is as smooth as scrubbing down, at any speed
- [ ] The stage is **never blank** between acts — scroll slowly through p ≈ 0.30 and p ≈ 0.64
- [ ] Two data panels are never both legible at the same moment
- [ ] Rail tabs track the active act; the active one has an accent top border
- [ ] Clicking each rail tab tweens to that act and lands on it
- [ ] `01 / 03` counter and stage caption update per act
- [ ] Hovering the stage shows the tooltip; leaving hides it
- [ ] Labels are real selectable text, crisp on a 2× display — not rendered into the canvas
- [ ] No panel overflows its box or paints over the Industries section below, at 1280px,
      1440px and 1920px
- [ ] Resize mid-sequence: the pane re-measures and the current act stays put
- [ ] Run panel holds on the breach nights — nights 22–23 occupy about a third of the act
- [ ] Panel figures are derived, not hard-coded: change one price in `phCaps()` and confirm the
      totals and release plan move
- [ ] Below 900px the module is not mounted, and the fallback stacked cards render

## Vignettes and hero art

- [ ] All three vignettes animate, and the three are visibly out of sync with each other
- [ ] None start until their card is on screen
- [ ] Resize the window: each rebuilds to the new card width without clipping
- [ ] With reduced motion, all three sit still in a sensible resting state
- [ ] Hero painting displaces on scroll; the headline, CTAs and cards above it do not move
- [ ] Force WebGL off (or block the three import): hero still shows the painting as a static
      background, page is otherwise unaffected

## Performance

- [ ] Scroll the full page at 4× CPU throttle: no long tasks over ~100ms, no dropped frames
      through the pinned sequence
- [ ] Idle at the top of the page: no continuous rAF work in a performance profile (the hero
      dirty flag should keep it quiet)
- [ ] three.js is in a lazy chunk, not the initial JS payload — check the build output
- [ ] No three.js in the server bundle; no hydration warnings in the console
- [ ] Strict Mode dev double-mount produces exactly one intro, one rAF loop per system
- [ ] Navigate away mid-sequence and back: no leaked listeners, no doubled loops, no WebGL
      context warnings

## Accessibility

- [ ] Full pass with `prefers-reduced-motion: reduce` — nothing autoplays, scroll-linked
      systems still respond to scroll
- [ ] Keyboard: every nav item, CTA, industry row and playbook row is reachable with a visible
      focus ring
- [ ] Decorative canvases and texture overlays are `aria-hidden` and `pointer-events: none`
- [ ] Headings form a sensible outline (one h1, section h2s, card h3s)
- [ ] The intro overlay does not trap focus
- [ ] Muted text passes contrast at the sizes it is used

## Cross-browser

- [ ] Safari: `backdrop-filter` on the header, `-webkit-mask-image` on the hero canvas and
      texture overlays, sticky behaviour in the pinned sequence
- [ ] Firefox: WebGL systems, and the pinned sequence's scroll measurement
- [ ] Mobile Safari: no horizontal overflow, 100vh handling in the pinned section, hero image
      weight acceptable on cellular
