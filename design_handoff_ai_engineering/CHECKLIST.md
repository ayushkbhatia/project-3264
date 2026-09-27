# Final checklist — AI Engineering

Mark each pass / fail / open.

## Foundation
- [ ] Fonts load as `Instrument Sans` and `IBM Plex Mono` (an SVG `<text>` in 04 renders in Instrument Sans)
- [ ] Body custom properties present; changing `accent` recolours active nav, hovers, Keep pills, live dots
- [ ] One global link rule; header nav `#55544E`, active item `#1A1917`, no green links anywhere by default
- [ ] `html, body` `overflow-x: clip`; no horizontal scrollbar
- [ ] Header sticky 68px with blur; "Book an audit" → `#engagement`
- [ ] Every heading weight 400; copy diff clean against `_inventory.json`

## Intro
- [ ] 4.8s sequence: rows, fills, footer line, wordmark, lift
- [ ] Click and any key skip (280ms); the first click afterwards reaches the page
- [ ] Skipped under reduced motion, `playIntro=false`, `?intro=off`; spec 01 decision applied

## Hero
- [ ] Greyscale plane; pointer trail reveals colour in soft blots that refill over ~2.4s; still under reduced motion

## 01 Premise
- [ ] 760vh; rolls at .28–.38 and .64–.74 with exact transforms; fills with a soft front
- [ ] Card 2 portal → inspector; card 3 obligations; stages scale at 1024–1920

## 02 Audit
- [ ] Starts on entering view, replays after leaving; every window in ANIMATIONS §5
- [ ] Findings every 1.3s with the pane fade; static frame under reduced motion

## 03–05 canvas
- [ ] Frame scales with width; backdrop and lattice match
- [ ] Hold engages; wheel / touch / keys scrub; auto-play resumes after 0.9s; releases on completion, upward scroll,
      anchor click, hashchange; jumping past does not pull back
- [ ] Flight follows scroll both ways; 04 plays from landing; captions on time; 05 plays on arrival
- [ ] Reduced motion: no hold, end states (open item, spec 08)
- [ ] One RebuildPlatform instance; all listeners removed on unmount

## 06 Engagement
- [ ] 400vh; stage max 600px tall; build card starts as a right spine, ends at the left spine width
- [ ] Content crossfade and fills per ANIMATIONS §8
- [ ] Mini calendar: 24 greyscale bars appear in order, today lifts, day 10 turns green with no glow
- [ ] Platform snippet: idle motion; stations ship one per fortnight (F1…F5 → live); still under reduced motion
- [ ] Spines are buttons and land on their cards; CTAs `mailto:hello@3264.ai` (confirm booking URL)

## Footer
- [ ] Five columns, bottom bar; links mapped to app routes; LinkedIn URL confirmed

## Responsive / a11y / perf
- [ ] 1024, 1280, 1440, 1920 match; < 900px interim rule applied
- [ ] Decorative hosts `aria-hidden`; spines focusable with visible focus
- [ ] LCP image preloaded; no page re-render on scroll; no console errors after a full scroll down and up
