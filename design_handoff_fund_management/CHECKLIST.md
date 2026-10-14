# Acceptance checklist: Fund Management page

## Chrome and links
- [ ] Shared `SiteHeader` is sticky; Industries and Fund Management are marked current (desktop dropdown and phone accordion)
- [ ] Fund Management → `/fund-management` from the header menu, every footer and the Home Industries card
- [ ] Playbook cards → the four playbook routes; case-study cards → `/work/<slug>`; "All work" → `/work`
- [ ] Every "Book…" CTA → `#engagement`; anchors land below the header
- [ ] `html, body { overflow-x: clip }` so the tracks pin

## Motion
- [ ] Intro: rows "audit the close … carry it to the next vehicle", then "5 vehicles live · day 100", wordmark, lift; skippable
- [ ] Hero reveal shows the original colours of the same artwork (no mismatched image)
- [ ] Premise: three cards slide in at 28–38% and 64–74%; words fill; rows reveal
- [ ] Operations audit loop: vehicles × processes, FTE values, five shortlisted, plot and ranked list; total 4.2 FTE
- [ ] Build log: day scrub 0 → 100; days-to-close KPI 19 → 8; hours 0 → 820; 3 of 3 live
- [ ] Traceability: auto-advances every 5.6s with a progress bar; clicking selects and pauses; steps re-stagger on every change; closing £26,004,566 equals the sum of the rows
- [ ] Across vehicles: chip arcs into the library and on to four vehicles; deltas −50/−67/−75/−83%
- [ ] Value: 14.2% → 16.4%, +2.2 pts, ≈ £1.06m a year
- [ ] Engagement cards: 20px radius, staggered entry; card 3 text legible over its wash
- [ ] Reduced motion: no intro, no reveal, no auto-play; diagrams static and complete

## Responsive
- [ ] Stages scale uniformly from 375px to 1920px with no clipping
- [ ] The two Traceability panels stack below about 880px
- [ ] Playbook and case-study grids reflow; pinned tracks work on mobile Safari

## Quality
- [ ] One rAF loop; idle work off-screen is ≈ 0
- [ ] "Illustrative" captions are present under the audit, traceability, vehicles and value diagrams
- [ ] No console errors; no layout shift on load
