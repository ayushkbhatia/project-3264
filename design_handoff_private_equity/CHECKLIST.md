# Acceptance checklist: Private Equity page

## Chrome and links
- [ ] Shared `SiteHeader` is sticky at the top; Industries and Private Equity are marked current
- [ ] The Industries dropdown and the phone accordion link Private Equity to `/private-equity` and Fund Management to `/fund-management`
- [ ] Footer links match the README; there are no links to the removed Company page
- [ ] Anchors `#audit`, `#plan`, `#portfolio`, `#value` and `#engagement` land below the header
- [ ] `html, body` use `overflow-x: clip`, so the sticky tracks pin

## Motion
- [ ] Intro: four rows stagger 440ms, wordmark at 3.02s, lifts at 4.26s; skips on click or keypress; not shown under reduced motion
- [ ] Hero: greyscale at rest; the pointer reveals the original colours in soft holes that fade over 2.4s
- [ ] Premise: three cards slide over each other at 28–38% and 64–74% of the track; words fill; window rows reveal
- [ ] Audit: 19s loop (scan → shortlist → fly to plot → ranked list); replays when scrolled back into view
- [ ] First 100 days: scroll scrubs day 0 → 100; bars, diamonds, playhead, log and KPIs stay in sync; KPI ends at £1.90m and 3 of 3
- [ ] Portfolio: 16s loop; the chip arcs into the library and then into each company; week counts and deltas are correct
- [ ] Value: the bridge builds once on arrival and ends at £16.4m, +15.5%, ≈ £19.8m
- [ ] Engagement cards stagger in
- [ ] Reduced motion: every diagram renders in its final state, with no movement

## Responsive
- [ ] Every diagram stage scales uniformly with no clipping from 375px to 1920px
- [ ] Cards and text stack cleanly below 768px; pinned tracks still work on mobile Safari
- [ ] Hero copy stays legible over the image at all widths

## Quality
- [ ] One rAF loop; off-screen sections do no work
- [ ] No layout shift on load; images are lazy below the fold
- [ ] "Illustrative" captions are present under the audit, portfolio and value diagrams
