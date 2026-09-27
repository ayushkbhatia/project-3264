# Handoff: AI Engineering hero — video under the colour-reveal veil

A change to the live AI Engineering page. It covers the hero only; nothing else on the page changes.

**Before:** a static illustration (`hero-plane.png`) under a greyscale canvas. Moving the pointer erases soft
watercolour blots in the canvas, so colour shows along the trail and refills over about 2.4s.

**After:** the same effect, over a looping video. The canvas redraws the current video frame in greyscale every
frame, so the colour trail reveals the moving footage. Layout, copy, the radial glow, blot shape, trail timing and
reduced-motion behaviour stay the same.

Start with `CLAUDE_CODE_PROMPT.md`.

## What changes in the code

This assumes the page was built from `/design_handoff_ai_engineering` (logic classes ported as React class
components). There are three edits:

1. **Hero markup:** `<img ref={heroImg} src="/img/hero-plane.png">` becomes a `<video>` with the **same ref name
   and the same inline style**.
2. **Logic:** in the ported `ai-engineering.logic.js`, replace `initVeil()` and `stepVeil()` with the versions in
   `motion/hero-veil.methods.js` (verbatim), and delete `buildGrey()`. `componentDidMount`, `tick` and
   `componentWillUnmount` need no changes: they already call `initVeil()`, `stepVeil(ms)` and `_veilOff()`.
3. **Assets:** self-host the video and add a poster (below). The page no longer requests `hero-plane.png`.

`CHANGES.diff` is the exact prototype diff (`AI Engineering.dc.html` → `AI Engineering v2.dc.html`). It has
3 hunks: the tag swap and the two veil methods.

### Video element

```tsx
<video
  ref={v.heroImg}
  src="/video/ai-engineering-hero.mp4"
  poster="/img/ai-engineering-hero-poster.jpg"
  muted
  autoPlay
  loop
  playsInline
  preload="auto"
  aria-hidden="true"
  style={{
    position: "absolute", inset: 0, width: "100%", height: "100%",
    objectFit: "cover", objectPosition: "center bottom",
    pointerEvents: "none", filter: "grayscale(1)",
  }}
/>
```

`poster` is the only addition beyond the reference. It avoids an empty hero before the first frame, and the
`grayscale(1)` filter keeps it monochrome. Keep the canvas and the glow `<div>` after the video, unchanged.

### How the new veil works

| Step | Detail |
| --- | --- |
| Mount (`initVeil`) | Sets `muted`, `loop`, `playsInline` as properties and plays on `canplay`. React does not render the `muted` attribute, so setting the property before `play()` is what makes autoplay work. With reduced motion or `motion=false` it pauses on the first frame instead. |
| Pointer | Unchanged: a point every ≥14px, at most 90, radius 53–84px, random phase. Ignored until the first frame has been drawn, and under reduced motion. |
| Each frame (`stepVeil`) | Skips if the video has no frame yet (`readyState < 2`) or the hero is off screen. Sizes the canvas to the section in CSS pixels, as before. Draws the video cover-fit and bottom-anchored (matching `object-position: center bottom`), then fills with `#000` in `"saturation"` mode to make it greyscale. Then erases the blots with `"destination-out"` (unchanged code). |
| First frame | Removes the video's CSS `grayscale(1)` so colour sits under the grey canvas. |
| Redraw guard | Redraws only if the canvas was resized, blots are live, the last blot just expired, or `currentTime` moved. |

The greyscale comes from compositing, not `getImageData`. It never reads pixels, so it works even when the canvas
is tainted by a cross-origin video. The `"saturation"` blend uses the same luminance weights as the old
`buildGrey` (0.3R + 0.59G + 0.11B), so the grey matches the illustration version.

## Video asset (production)

The source clip is at:

```
https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4
```

**Do not hotlink it.** It is a third-party URL from a template and could change or disappear. **Confirm the
licence for commercial use before launch.** Download it, re-encode it and serve it from the site:

```bash
curl -L -o /tmp/hero-src.mp4 "<url above>"
# H.264, no audio, ≤1920px wide, moov atom first so it starts before it finishes downloading
ffmpeg -i /tmp/hero-src.mp4 -an -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p \
  -vf "scale='min(1920,iw)':-2" -movflags +faststart public/video/ai-engineering-hero.mp4
# poster = first frame
ffmpeg -i public/video/ai-engineering-hero.mp4 -frames:v 1 -q:v 3 public/img/ai-engineering-hero-poster.jpg
```

Budget: aim for about 4 MB or less. If it is larger, raise `-crf` (26–28) before reducing the width. Convert the
poster to AVIF/WebP if the image pipeline does that. Don't add `crossOrigin` to the video unless the host sends
CORS headers; without them it blocks the video from loading.

## Behaviour to keep

* Monochrome on load. Colour only ever appears inside the pointer trail.
* Plain `loop`, with no crossfade at the loop point. That is how the reference behaves.
* Reduced motion / `motion=false`: the video stays paused on the first frame and there is no trail.
* Touch: `pointermove` fires during a drag, as before. No extra touch handling.

## Performance and loading

* The hero is now the LCP element through the poster. Preload it
  (`<link rel="preload" as="image" href="/img/ai-engineering-hero-poster.jpg">`) and drop any preload of
  `hero-plane.png`.
* The canvas work is one `drawImage` and one `fillRect` per video frame, at CSS-pixel size, only while the hero
  is on screen.
* Optional, not in the reference: pause the video while the hero is off screen (IntersectionObserver) and resume
  it on return. This saves decoding on long scrolls. Skip it under reduced motion, where the video is already
  paused.
* `hero-plane.png` is not used by any other designed page. Check the live site before deleting it.

## Files

```
design_handoff_ai_engineering_hero_video/
├── README.md                    this file
├── CLAUDE_CODE_PROMPT.md        the prompt to paste
├── CHANGES.diff                 prototype diff, before → after
├── SPEC_UPDATES.md              replacement text for the main AI Engineering handoff docs
├── motion/hero-veil.methods.js  the new initVeil() + stepVeil(), verbatim
├── qa/
│   ├── CHECKLIST.md
│   └── hero-video.spec.ts       Playwright checks (video plays, grey layer, trail reveal and refill)
└── reference/
    ├── hero-demo.html           the hero alone, framework-free; open it directly in a browser
    └── AI Engineering v2.dc.html  the full page after the change; drop it into
                                   /design_handoff_ai_engineering/reference/ to view it in context
```
