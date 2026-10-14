# Acceptance checklist: Production Assurance page

## Chrome and links
- [ ] Shared `SiteHeader` sticky; (recommended) Production Assurance added to the AI Engineering dropdown
- [ ] The footer Services link reads "Production Assurance" → `/production-assurance` on every page; no "Deployment & Run" anywhere, including Work filters
- [ ] "Book a health review" → `#engagement`; "Book an audit" → `/ai-engineering#engagement`; hero secondary → `#trace`
- [ ] `html, body { overflow-x: clip }`

## Motion (mechanics per `framework-reference.md`)
- [ ] Intro: "review what is live … carry it to the next one" → "5 systems on watch · day 100"
- [ ] Premise card 2 Owner column: Vendor, Vendor, IT, —, —, Left the firm (red); card 3 dates run Apr → Jan in order
- [ ] Health review: systems × signals risk matrix; axis ticks Low/Medium/High; "Fix first" quadrant; five fixes
- [ ] Run log: open incidents 11 → 3; rework hours 0 → 820
- [ ] Incidents: six events, each Detected → Contained → Fixed → Signed off; hint says "click any incident"; auto-advance 5.6s; click pauses
- [ ] Across systems: "0 run packs" → "1 run pack"; first row "First setup"
- [ ] Value: 94.2% → 96.4%, +2.2 pts, ≈ 902 fewer cases reworked
- [ ] Engagement card 2 title on two lines; card heights align
- [ ] Closing strapline on one line on desktop
- [ ] Reduced motion: no intro, no reveal, no auto-play; diagrams static and complete

## Responsive and quality
- [ ] Stages scale from 375px to 1920px; the Incidents panels stack on narrow widths
- [ ] One rAF loop; no console errors; no layout shift
