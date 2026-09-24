# 09 · Responsive, accessibility, performance

## Responsive: what is designed and what isn't

| Width | Status |
| --- | --- |
| ≥ 1280 | **Designed and verified.** Match the reference exactly. |
| 1024 – 1279 | **Works, not tuned.** Stages scale down (k ≈ 0.8 at 1024), and in-stage 9–11px text renders at 7–9px. Acceptable for launch, but confirm with design. |
| 768 – 1023 | **Known problems.** The header nav wraps onto two lines (seen at 924px). Stage text drops below legibility (k ≈ 0.6). The CTA band headline is `nowrap` and overflows. The §06 side columns get narrow. |
| < 768 | **Not designed.** |

### What to do in the port

1. **Header below 1024**: collapse the nav to a menu button. It is not designed, so use the
   app's existing mobile nav pattern and flag it for design review.
2. **CTA band below 900**: drop `white-space: nowrap` on the headline and note, and stack the
   grid to one column with the button below. This is the one responsive change you may make
   without design sign-off, because the nowrap is a desktop-only assumption.
3. **Pinned sections (§01, §02, §03, §06) below 768**: **do not improvise.** Gate them:

   ```tsx
   const isSmall = useMediaQuery("(max-width: 767px)");   // SSR: render desktop, swap on mount
   {isSmall ? <PinnedFallback id="reality" title="Run a bigger book…" /> : <Reality />}
   ```

   The fallback renders the section's h2 and an "Best viewed on a larger screen" note, and it
   keeps the section `id` for deep links. The module handles absent refs by skipping those
   sections, so no module change is needed. **List this as an open design item in your final
   report.**
4. **§04 servicing below 900**: switch `servHost` to one column by overriding
   `grid-template-columns` from a media query **on a wrapper class**. The module writes the
   host's children, not the host's grid, so this is safe.
5. **§05 investors below 900**: the window's grid has minimum widths summing to about 620px.
   Let `lpFitNow` scale it, which it does by height only, so add `overflow-x: auto` on `lpFit`'s
   parent as a stopgap and flag it.

## Accessibility

* **Reduced motion.** It already skips the intro and stops the blip. Also pass
  `motion: false` when `matchMedia("(prefers-reduced-motion: reduce)")` matches, so the hero
  ring and the §04/§05 loops freeze on their current frame. They are autoplay, which WCAG
  2.2.2 covers, so this is required. The scroll sequences stay, because they are user-driven.
  Wire this in `PrivateCreditMotionRoot` with an effect that watches the media query and calls
  `setOptions`.
* **Pause control.** The §04 and §05 loops run for more than 5s. Reduced motion covers most
  users, but add a small "Pause animations" toggle in the footer bar that calls
  `setOptions({ motion: false })`. The design for it is open: use a text button in the footer's
  13px `--mut` style.
* **Stage content is decorative.** Put `aria-hidden="true"` on `wrap`/`oWrap`, `servHost`
  children, `lpHost`, `dStack` and `heroCv`. The argument is carried by the real `h2`s and
  §06's stage cells, which stay exposed.
* **Hidden-but-focusable.** `dCta` holds a link while it sits at opacity 0. Toggle `inert` on it
  from a small `MutationObserver` or a scroll check matching `pointer-events`, or give the link
  `tabIndex={-1}` until `pointer-events` is `auto`.
* **Headings.** There is one h1 (hero). Every section title is an h2. The in-stage titles
  (`titleA`, `titleB`, `p2Title`) are also `<h2>` in the reference; set `aria-hidden` on them,
  since they are theatre and would duplicate the outline.
* **Focus ring.** The prototype has none, so add the app's standard ring on all links and
  buttons, dark-on-light and light-on-dark (CTA bands, §06).
* **Contrast.** `--mut` `#6E6D67` on `#F6F5F2` is about 4.6:1, which is fine at its sizes. On the
  dark section, `rgba(255,255,255,0.6)` body text on `#0A0A0A` is about 7:1. The CTA band note
  at `rgba(255,255,255,0.8)` sits over a photo with a 0.28–0.84 scrim; check it at the right
  edge, where the scrim is lightest.
* **Intro.** Not modal, dismissable by click and key, and `aria-hidden` (spec 08).

## Performance

Budgets at 1440, desktop, fast 3G + 4× CPU in Lighthouse:
* LCP ≤ 2.5s. The LCP element is the hero h1 or `hero-wash`, so preload that image and the
  Instrument Sans 400 face.
* CLS ≤ 0.02. Hosts have fixed sizes and the intro is `position: fixed`, so there is no shift.
  If you see CLS, it is fonts: check `font-display` and preloads.
* TBT ≤ 200ms. `motion/private-credit.js` is about 150KB unminified. Load it only on this route,
  either with a dynamic `import()` inside the Root's effect or by keeping the whole page client
  side. Do not import it from a shared layout.
* Idle at the top of the page: the only per-frame work is the hero ring. Scrolled to the
  footer: none (every system is in-view gated).
* Scrolling through §03: no long tasks over 50ms at 4× CPU. If there are, check that nothing
  added transitions or `will-change` to the 248 tiles.
* Images: serve AVIF/WebP at 1× and 2×. `delivery-bg.webp` is 1920×5748, so provide a
  1280-wide variant for narrower screens.

## Browser support

The module uses the Web Animations API (`el.animate`), `backdrop-filter`, `aspect-ratio`,
`text-wrap: pretty/balance` (a progressive enhancement), CSS `mask-image` (with `-webkit-`),
and `overflow-x: clip`. Target the last two versions of Chrome, Safari, Firefox and Edge.
On Safari, check that `backdrop-filter` on the header and MenuBar has its `-webkit-` prefix;
Tailwind's `backdrop-blur-*` adds it, but inline styles do not.
