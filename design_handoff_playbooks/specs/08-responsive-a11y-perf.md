# 08 · Responsive, accessibility and performance

## Responsive behaviour
The reference has **no media queries**; it reflows with flex-wrap, auto-fit grids, `clamp()` and `min()`. Reproduce that first, then add the four fixes marked **Add**.

| Width | Behaviour |
|---|---|
| ≥ 1440 | Content fixed at 1280px, centred. Carousel slide 1200px with 96px peeks. Rows have 3 columns of 408px. |
| 1100–1440 | Content = viewport − 80. Carousel slide = viewport − 80, so the peeks shrink to 16px of the neighbours. Rows keep 3 columns. |
| ~1030 | Rows drop to 2 columns (the third tile wraps; `auto-fit` keeps the columns equal). The CTA cards stack (480px basis). |
| 924 (tablet capture) | See `screenshots/tablet-924/*`. The chips and search sit on one row. The carousel slide keeps text beside the image while the slide is ≥ 694px. **Header nav wraps onto two lines here: needs fixing.** |
| ≤ 700 | The carousel slide stacks (text above, image below, image min-height 240px). The library bar wraps: chips on one line, search full width below (`min(100%, 320px)`). |
| ≤ 630 | Rows have 1 column. The closing tile stacks (the button moves under the text). The footer has 2–3 columns (168px min). |
| 390 | H1 34px. The hero buttons wrap to two lines, centred. The carousel slide is 310px with 16px peeks. |

**Add:**
1. **Header** below 1000px: collapse the nav into the site's existing mobile menu (logo left; "Book an audit" and a menu button right). If there is none, use a 44px menu button that opens a full-width sheet listing the same six links at 16px, 48px row height, with the paper background and a `line2` divider.
2. **Recently updated** below 520px: two columns (64px | 1fr), with the category moved under the note (specs/06).
3. **Side padding** below 480px: reduce the 40px section side padding to 20px (hero, library bar, carousel controls, CTAs, rows, recent, results, closing, footer). Keep the carousel inset rule `SW = W − 80`, which gives 40px margins on each side at that width.
4. **Carousel arrows** on touch devices: keep them, and add horizontal swipe on the viewport (pointer events; 40px threshold; `go(index ± 1)`; do not scroll-jack vertical pans).

## Accessibility
- **Landmarks:** `header`, `main` (hero to closing), `footer`. One `h1` (the hero). Each category row and Recently updated has an `h2`. The CTA card titles and carousel titles are headings (`h3`) in production, visually unchanged.
- **Hero video:** decorative, so `aria-hidden="true"`, no controls, no audio. It must stop under reduced motion.
- **Contrast:**
  - The hero text sits on the scrim, which is ≥ 0.55 black at the top and ≥ 0.92 black at the bottom. Check the H1 and buttons at the brightest video frame (`hero-frames/01-mid.jpg`).
  - The white text on the subscribe card relies on the dark scrim and text-shadow; keep both.
  - Inactive carousel slides are at 0.4 opacity and are decorative: make them `inert` and `aria-hidden`.
- **Chips:** `aria-pressed`. Group them in `role="group" aria-label="Filter by industry"`.
- **Search:** `role="search"` on the wrapper. The results label is `aria-live="polite"`, so the count is announced as the visitor types.
- **Carousel:** see specs/03 (region, slide groups, focus hold, pause toggle, arrow keys).
- **Focus:** `:focus-visible` with a 2px `#157F52` outline and 2px offset on every link, button and input. On the dark hero, use a `#F4F3F0` outline.
- **Hit targets:** chips are 34px tall. Give them a 44px hit area with an invisible `::before` (−5px inset). Segment buttons are 20px tall; make the hit area 44px tall the same way. The arrows are already 44px.
- **Subscribe:** label via `aria-label="Work email"`, with errors and success announced (specs/04).

## Performance
- **LCP** is the hero H1 text, or the poster if you use one, so the poster must be small: AVIF ≤ 120KB at 1920 wide. `preload` the poster, not the video.
- **Video:** `preload="auto"` is fine, but start fetching only after the first paint (set `src` in an effect if needed). Serve WebM first, MP4 fallback. The boomerang MP4 at CRF 20 should be ≤ 20MB; if it is larger, try CRF 23 and a 1440-wide scale (`-vf scale=1440:-2`).
- **Images:** convert all PNG washes (1376×768) to AVIF/WebP at 1x and 2x of the rendered size (tile ~408×204, carousel ~570×400). Lazy-load everything below the first viewport. The first carousel image can be eager.
- **Fonts:** self-host; `font-display:swap`; preload Instrument Sans 400 and 500 (latin subset).
- **JS:** the page is static apart from the filter/search state, the subscribe form, the carousel controller and the hero controller. Render the category rows and Recently updated on the server; hydrate only the interactive islands.
- **CLS:** every image box has a fixed aspect (tiles 2:1) or a min-height (carousel image `clamp(240px, 30vw, 400px)`). The carousel track width is set before first paint. Render SSR with `SW` computed from a CSS fallback (`width:min(1200px, calc(100vw - 80px))`), exactly like the reference does.
