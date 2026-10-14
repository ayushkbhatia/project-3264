# Acceptance checklist: Evaluation Suites page

## Chrome and links
- [ ] Shared `SiteHeader` is sticky; (recommended) Evaluation Suites and Production Assurance appear in the AI Engineering dropdown
- [ ] Footer Services column on every page reads "Production Assurance" and "Evaluation Suites", linking to their pages
- [ ] "Book an evaluation review" → `#engagement`; "Book an audit" → `/ai-engineering#engagement`; "See a nightly run" → `#trace`
- [ ] `html, body { overflow-x: clip }`

## Motion (mechanics per `framework-reference.md`)
- [ ] Intro rows: "sample your cases … gate every change", then "5 systems scored · day 100"
- [ ] Premise card 2: six case types; "Nobody" in red; the 18% callout highlighted
- [ ] Evaluation review: systems × evaluation signals; "Test first" quadrant; five suites; "Suite 04 reuses suite 01"
- [ ] Suite log: case types untested 11 → 3; cases labelled 0 → 820
- [ ] Nightly run: six scores, each Measured → Compared with → Evidence → Reviewed; the leverage row shows the below-floor case; hint reads "click any score"
- [ ] Across systems: "0 evaluation packs" → "1 evaluation pack"
- [ ] Value: 94.2% → 96.4%, +2.2 pts, ≈ 902 fewer errors
- [ ] Engagement card 2 title on two lines; cards align
- [ ] Reduced motion: no intro, no reveal, no auto-play

## Responsive and quality
- [ ] Stages scale from 375px to 1920px; the nightly-run panels stack on narrow widths
- [ ] One rAF loop; no console errors; no layout shift
- [ ] "Illustrative" captions present under every diagram
