# Spec 06 — Responsive, accessibility, performance

## Responsive

The reference is desktop-first with intrinsic breakpoints (`flex-wrap` + `flex-basis`,
`auto-fit` grids). Most sections collapse correctly with no media queries. Keep them intrinsic.
Only add the rules below.

| Width | Change |
| --- | --- |
| < 940px | Capabilities: PlatformSequence switches itself to single column (no port work) |
| < 768px | Capabilities: static fallback, PlatformSequence not mounted (spec 04) |
| < 768px | Section horizontal padding 40 → 24px. Section vertical padding 130 → 88px. Hero top padding 150 → 96px, cards margin 112 → 72px |
| < 768px | Header: nav hidden, "Book a call" stays. Menu not designed, so **ask the designer** before building one |
| < 768px | Stack grid 5 → 3 columns |
| < 768px | HeroArt: skip mount; CSS background only |
| < 560px | Footer: columns reflow to 2 (auto-fit does this); drop `border-left` on the first column of each row |

Test at 375, 768, 1024, 1280, 1440, 1920. No horizontal scroll at any width.

## Accessibility

- One `h1` (hero). Section titles `h2`. Card and row titles `h3`. The hero card titles and
  playbook titles are `div`s in the reference; make them `h3` in the port with no visual change.
- `:focus-visible` ring on every link and button: `outline: 2px solid var(--a); outline-offset: 2px`.
  On whole-row links (Industries, Playbooks) put the outline on the row.
- Decorative: `artCv`, scrim, textures, `phCv`, `phLabels`, intro overlay → `aria-hidden="true"`.
- Rail tabs: `<button>`, `aria-pressed` on the active one (the module writes styles; add a
  small observer or have the module's act-change callback set the attribute).
- Footer image `alt=""` (decorative; the text over it carries the meaning).
- Logos: alt text as listed in spec 02.
- Reduced motion: see `ANIMATIONS.md`. Nothing autoplays; scroll-linked systems still track scroll.

## Performance budget

- Initial JS (home route, excluding three): < 120KB gzip.
- three.js in a separate lazy chunk, fetched after hydration.
- LCP element is the hero h1. Target < 1.8s on fast 4G. Preload the font; do **not** preload
  `hero-valley.png` at a priority above the font.
- `hero-valley.png` and `footer-nocturne.png`: convert to AVIF/WebP with a PNG fallback, and
  serve ~1600w and ~900w variants. Keep the hero canvas's CSS background and HeroArt's texture
  pointed at the **same** URL so it downloads once.
- Footer image: `loading="lazy"`.
- No layout shift: all images carry dimensions or aspect-ratio; vignette boxes are fixed 150px.
- Idle page: zero continuous rAF work (HeroArt is dirty-flagged; PlatformSequence bails off-screen).
