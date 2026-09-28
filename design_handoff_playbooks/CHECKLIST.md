# Acceptance checklist: Playbooks page

## Content
- [ ] Every string matches `CONTENT.md` and `data/playbooks.json` exactly (curly quotes, arrows, the line breaks in the H1 and closing H2).
- [ ] The nine playbooks appear in the data order, in three rows of three.
- [ ] Carousel order: Covenant Watch, NAV Pack Review, Mandate Guardrails, Capital Call Flow, Side-Letter Register, Research Intake.
- [ ] Recently updated is flagged as placeholder content until 3264 supplies real entries.

## Visual (1440)
- [ ] 1280px content container; 40px section side padding; section paddings as in specs/00.
- [ ] No heading heavier than weight 400. Letter-spacing and sizes exact (clamp values preserved).
- [ ] Glass badge: 34% on tiles, 30% in the carousel; 28% radius; blur 18 / saturate 1.3; exact border and shadow.
- [ ] Carousel slide 1200px, 22px radius, `#EEECE7`, 14px inner padding; neighbours at 0.4 opacity.
- [ ] CTA cards: washes, scrims and text-shadows exact; subscribe button `#157F52` → `#0F6A43`.
- [ ] Closing tile: valley wash at `center 60%`, veil gradient, 20px radius, 1px border.
- [ ] Section diff ≤ 0.5% against the baselines at 1440 and 1280.

## Interaction
- [ ] Chips are single-select with `aria-pressed`; search is a case-insensitive substring match over name, blurb and category; the two combine.
- [ ] Filtering hides Featured, CTAs, rows and Recent; shows Results; Clear restores browsing.
- [ ] Results label and pluralisation exact; a single result keeps its column width (`auto-fill`).
- [ ] Empty state shown for zero results.
- [ ] Subscribe: idle → submitting → success; invalid and error states; success announced.
- [ ] "Browse the library" jumps to `#library` with the chips visible below the sticky header.

## Motion
- [ ] Hero: 500ms fade-in; boomerang loop; eased turns (0.3× at a turn, 1.0× beyond 0.7s from a turn); no visible jump at either turn.
- [ ] Hero pauses off screen and in hidden tabs.
- [ ] Carousel: 7s dwell; 700ms `cubic-bezier(0.2,0.7,0.2,1)` track move; 500ms opacity; hover and focus hold; pause toggle; wrap-around; resize without animation.
- [ ] Reduced motion: no video playback (poster shown), no autoplay, full active segment.
- [ ] No per-frame React re-renders.

## Responsive
- [ ] Rows reflow 3 → 2 → 1; CTA cards stack; the carousel slide stacks under ~700px.
- [ ] Header collapses below 1000px (no wrapped nav).
- [ ] Recently updated uses the two-column layout below 520px.
- [ ] Side padding is 20px below 480px; the carousel keeps 40px margins.
- [ ] Swipe works on the carousel on touch devices.
- [ ] No horizontal scroll at 320px.

## Accessibility
- [ ] One h1; h2 per category and for Recently updated; `header`/`main`/`footer` landmarks.
- [ ] Visible `:focus-visible` rings (green on light, `#F4F3F0` on the hero).
- [ ] Carousel region and slide roles; inactive slides `inert`; arrow keys work.
- [ ] Hit areas ≥ 44px (chips and segments via `::before`).
- [ ] The results count is announced through `aria-live`.
- [ ] Decorative images use `alt=""`; the video is `aria-hidden`.

## Performance
- [ ] Poster ≤ 120KB AVIF and preloaded; video is WebM plus MP4, fetched after first paint.
- [ ] Images AVIF/WebP at 1x/2x; lazy below the fold.
- [ ] Fonts self-hosted with the 400/500 preloads.
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility 100.
