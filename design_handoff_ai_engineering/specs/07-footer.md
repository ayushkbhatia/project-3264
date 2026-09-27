# 07 · Footer

Markup `reference/sections/07-footer.html`. Static. It follows the Engagement section directly.

`padding:70px 40px 40px`, content column 1280. Grid `repeat(auto-fit, minmax(168px, 1fr))`; the first column
`padding:0 28px 0 0`, the rest `border-left:1px solid var(--line2); padding:0 28px`. Heading then links
(gap 13px, margin-top 22px), styles per the type scale.

* Services: AI Engineering (`#top`), AI Transformation, Deployment & Run, Evaluation suites
* Industries: Private Credit, Financial Services, Fund Management, Asset Management
* Company: Who we are, How we work, Case studies
* Resources: Playbooks, Field notes, Security
* Connect: Book a call (`#engagement`), hello@3264.ai (`mailto:`), LinkedIn (placeholder; real URL needed)

Bottom bar (margin-top 64px, padding-top 22px, top rule `var(--line2)`, 13px −0.005em `var(--mut)`, space-between,
wraps): wordmark 15px 500 −0.03em `#1A1917` + "© 2026 Bearing Deployment Company Inc. All rights reserved.";
right, "All systems operational" with a 6px `var(--a)` dot.

Cross-page links in the reference point to `.dc.html` files. Map them to the app's routes.
