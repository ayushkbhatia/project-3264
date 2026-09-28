# Visual QA

## The PNGs in `screenshots/`
These are design-tool captures, taken to orient you. They are **not** the pixel source of truth; the reference HTML is. Two kinds:

- **`desktop-1440/`**: the page laid out at a 1440px viewport and captured at 924px wide (0.64× scale). Proportions and composition are exact. Small text looks soft, and a few wraps can differ by a word because of font rasterisation in the capture. Trust the spec values over the pixels.
- **`tablet-924/`**: the page at a real 924px viewport, 1:1. Use it to see how the layout reflows. It also shows the header wrap bug (open item 4).
- **`states/`**: interaction states at the 1440 layout.
- **`hero-frames/`**: stills from the hero video (start, middle, end) at 1440 wide. The design tool cannot capture `<video>`, so the hero captures show the video area as it appears before playback starts.
- **`icon-set.png`**: the nine icons at 2× (96px) on white. The SVGs are in `icons/`.

| File | Shows |
|---|---|
| `desktop-1440/01-hero.png` | Header, hero H1 and buttons, top of the library bar |
| `desktop-1440/02-library-carousel-slide-1.png` | Library bar (All active); carousel on Covenant Watch; controls row with segment 1 |
| `desktop-1440/03-carousel-slide-2.png` | Carousel on NAV Pack Review; both neighbours peeking at 40% opacity; CTA cards |
| `desktop-1440/04-ctas.png` | Both CTA cards; Private Credit row header |
| `desktop-1440/05-private-credit.png` | Private Credit row (3 tiles, glass badges) and the start of Fund Management |
| `desktop-1440/06-fund-management.png` | Fund Management row, then Asset Management |
| `desktop-1440/07-asset-management.png` | Asset Management row, then Recently updated |
| `desktop-1440/08-recently-updated.png` | Recently updated list |
| `desktop-1440/09-closing.png` | Closing tile (valley wash + veil), start of footer |
| `desktop-1440/10-footer.png` | Footer columns and bottom bar |
| `states/s01-filter-private-credit.png` | "Private Credit" chip active; results "3 playbooks in Private Credit"; Clear |
| `states/s02-search-one-result.png` | Query "covenant"; "1 playbook matching “covenant”"; a single tile at normal column width |
| `states/s03-search-no-results.png` | Query "zzz"; "0 playbooks matching “zzz”"; empty-state line with the ink rule |
| `states/s04-subscribed.png` | Subscribe card success line "You are on the list." |
| `tablet-924/01…04` | Hero (header wrap visible), library + carousel, CTAs, Private Credit row at 924px |
| `hero-frames/00-start.jpg`, `01-mid.jpg`, `02-end.jpg` | Video stills for composition and contrast checks |

## Baselines you should generate
Run `qa/capture-reference.ts` against the served reference (instructions in the file). It writes full-resolution (2× DPR) baselines at 1440, 1280, 1024, 768 and 390 for every section and state, with motion frozen by reduced motion. Compare your build against those with the same script pointed at your route (`REF_URL=http://localhost:3000/playbooks`, and adjust the selectors if your markup differs). Aim for ≤ 0.5% pixel difference per section at 1440, excluding the hero video area.

## Manual checks (not covered by the screenshots)
1. The hero video fades in, plays forward, slows into the end, reverses, slows into the start and repeats with no jump. Watch at least two full cycles (~52s).
2. With reduced motion (OS setting): no video playback, the poster is shown, the carousel does not advance, and the active segment is full.
3. Carousel: hover pauses the fill and leaving resumes it from the same point. Clicking a peeking slide activates it without navigating. The arrows wrap. Resizing the window does not animate the track.
4. Filtering: chips and search combine. Clear restores browsing. The results count updates as you type.
5. Tab through the page. Every control shows a visible focus ring. Inactive carousel slides are skipped.
