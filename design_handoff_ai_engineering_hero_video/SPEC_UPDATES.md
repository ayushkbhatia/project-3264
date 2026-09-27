# Updates to the main AI Engineering handoff

If `/design_handoff_ai_engineering` is kept in the repo as documentation, replace these passages so it matches
the shipped hero.

## specs/02-header-hero.md → Hero

Replace the `heroImg` bullet with:

> * `heroImg`: a `<video>` of `/video/ai-engineering-hero.mp4` (poster `/img/ai-engineering-hero-poster.jpg`),
>   `muted autoPlay loop playsInline preload="auto" aria-hidden="true"`, `absolute; inset:0; 100%×100%;
>   object-fit:cover; object-position:center bottom; pointer-events:none; filter:grayscale(1)` (the veil removes
>   the filter once the first frame is drawn).

## ANIMATIONS.md → §3 Hero veil

Replace the section with:

> ## 3 · Hero veil (`initVeil`, `stepVeil`)
>
> Refs `heroSec`, `heroImg` (the video), `heroVeil` (canvas). The video plays muted and looped; under reduced
> motion or `motion=false` it holds on its first frame. Each frame, while the hero is on screen and a frame is
> available, the canvas (CSS-pixel size) draws the video cover-fit and bottom-anchored, then fills with `#000` in
> `"saturation"` mode to make it greyscale (luminance 0.3R + 0.59G + 0.11B). It redraws only when resized, when
> blots are live, or when `currentTime` changes. The first drawn frame removes the video's CSS filter.
> `pointermove` adds a point every ≥14px (max 90; radius 53–84px; random phase). Blots are erased at the points
> (`destination-out`), bleeding outward and refilling over 2400ms. No pixel reads, so a tainted canvas is fine.

In §0 PORT SHIMS, item 2: drop the `hero-plane.png` path; the video path lives in the markup only.

## README.md → Assets

Replace the `hero-plane.png` row with `ai-engineering-hero.mp4` + `ai-engineering-hero-poster.jpg` (hero video
and its first frame; the poster is the LCP). Change "`hero-plane.png` is the LCP" to "the hero poster is the LCP".

## specs/08-responsive-a11y-perf.md → Performance

Replace the two hero lines with:

> * The hero poster is the LCP: preload it. The video is H.264, faststart, about 4 MB or less, self-hosted.
> * The veil redraws once per video frame while the hero is on screen; it never calls `getImageData`.

## BUILD_PLAN.md → Common failures

Replace "Hero stays grey" with:

> * **Hero stays grey or blank.** The video never reached `readyState ≥ 2`: check the path, that `muted` is set
>   as a property before `play()`, and that `playsInline` is present for iOS. Don't add `crossOrigin` unless the
>   host sends CORS headers.
