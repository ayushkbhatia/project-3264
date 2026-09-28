# Motion: Playbooks page

Every moving part of the page is listed here. There are no scroll-triggered reveals, no parallax and no looping decoration apart from the hero video. All motion stops under `prefers-reduced-motion: reduce`.

| # | What | Trigger | Duration / easing | Reduced motion |
|---|---|---|---|---|
| M1 | Hero video fade-in | first `canplay` | opacity 0→1, 500ms, linear | poster shown at opacity 1, no fade |
| M2 | Hero video ping-pong loop | autoplay | 13.04s forward, 13.04s back, forever; eased turns (M3) | paused on first frame |
| M3 | Turn easing | continuous | playbackRate 1.0 → 0.3 within 0.7s of each turn (smoothstep) | n/a |
| M4 | Carousel slide change | autoplay (7s), arrows, segments, click on a peeking slide | track `transform` 700ms `cubic-bezier(0.2,0.7,0.2,1)`; slide opacity 500ms ease (1 ↔ 0.4) | no autoplay; changes still animate on user input (≤700ms, user-initiated) |
| M5 | Carousel progress fill | active slide dwell | width 0→100% linear over 7000ms, updated per frame | fill shows 100%, no dwell |
| M6 | Filter chip state | click | background + color 160ms ease | keep (colour only) |
| M7 | Link and button hovers | hover | instant colour or background change (no transition in the reference) | keep |

---

## M1–M3 · Hero video

### What the visitor sees
The video fades in over black, plays forward once (13s), then plays backward to the start, then forward again, forever. It never jumps or restarts. Near each end it slows into the turn and speeds back up after it, like a pendulum at the top of its swing.

### Production approach (use this)
Pre-render a **boomerang** file (forward + reversed) once at build time, loop it natively, and ease the playback rate near the turn points with a small rAF controller (`motion/hero-video.ts`).

```bash
# 1. Boomerang: forward + reversed, dropping the duplicate frame at each turn
ffmpeg -i hero.mp4 -filter_complex \
 "[0:v]split[f][b];[b]reverse,trim=start_frame=1,setpts=PTS-STARTPTS[r];[f][r]concat=n=2:v=1:a=0,trim=end_frame=624,setpts=PTS-STARTPTS[v]" \
 -map "[v]" -an -c:v libx264 -pix_fmt yuv420p -crf 20 -preset slow -g 24 -movflags +faststart \
 public/video/playbooks-hero-boomerang.mp4

# 2. Optional smaller WebM for Chromium/Firefox
ffmpeg -i public/video/playbooks-hero-boomerang.mp4 -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -an \
 public/video/playbooks-hero-boomerang.webm

# 3. Poster (first frame)
ffmpeg -i hero.mp4 -frames:v 1 -q:v 3 public/video/playbooks-hero-poster.jpg
```
- The source has 313 frames at 24fps (13.04s). The boomerang is 313 + 312 − 1 = 624 frames (26.0s). Frame 0 is the start, frame 312 is the forward end (the first turn), and frame 623 comes back to frame 0 (the second turn, at the loop point).
- `-g 24` puts a keyframe every second. The source has a single keyframe, which is why the prototype could not seek backward and had to decode every frame in a worker. Do not copy that approach.

### Turn easing (M3)
Each animation frame, set `playbackRate` from the distance, in seconds, to the nearest turn point:
```
D     = video.duration                 // ~26.0s boomerang
turns = [0, D/2, D]
edge  = min(|t − turn|) over turns     // t = video.currentTime
k     = clamp(edge / 0.7, 0, 1)
rate  = 0.3 + 0.7 × k²(3 − 2k)         // smoothstep; 1.0 away from turns, 0.3 at a turn
rate  = round(rate × 20) / 20          // quantise to 0.05 steps to avoid thrashing the decoder
```
This matches the prototype's `rate(edge)` exactly (`E = 0.7`, minimum 0.3).

### Markup
```html
<video class="hero-video" muted playsinline autoplay loop preload="auto"
       poster="/video/playbooks-hero-poster.jpg" aria-hidden="true">
  <source src="/video/playbooks-hero-boomerang.webm" type="video/webm">
  <source src="/video/playbooks-hero-boomerang.mp4"  type="video/mp4">
</video>
```
CSS: `position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:bottom; opacity:0`. The controller sets opacity to 1 with a 500ms linear transition on the first `canplay`. If `canplay` never fires, the poster stays hidden behind opacity 0. To avoid that, the controller also reveals the video after 1500ms if it has a poster.

### Power and visibility
Pause when the hero is off screen (IntersectionObserver, threshold 0) and when `document.visibilityState === "hidden"`. Resume from the same frame. The prototype does not do this; production should.

### Reduced motion
If `prefers-reduced-motion: reduce` matches (also listen for changes), do not play. Set opacity to 1 so the poster (first frame) shows. The prototype also has a `motion` toggle prop; production does not need it.

### Prototype note
`reference/Playbooks.dc.html` implements the ping-pong without a pre-rendered file. The first pass plays natively. A Web Worker fetches the MP4, demuxes it, decodes all 313 frames with WebCodecs, stores them as JPEG blobs (~40MB of memory), and then paints them backward and forward to a `<canvas>` with the same easing. It works, but it is heavy and needs WebCodecs support. **Do not port it.** The boomerang file gives the same result with native playback.

---

## M4–M5 · Featured carousel
Controller: `motion/carousel.ts`. The state lives outside React (rAF loop plus refs) so the 60fps progress updates never re-render the page.

### Timeline for one slide
```
t = 0        slide i becomes active: track transform animates to −i × (SW + 24) (700ms),
             slide i opacity 0.4 → 1 (500ms), the previous slide 1 → 0.4 (500ms)
0 → 7000ms   segment i fill grows 0 → 100% (linear; paused while held)
t = 7000ms   go(i + 1), wrapping 6 → 1
```
- **Hold** (freezes progress where it is and resumes from there): pointer inside the viewport (`mouseenter`/`mouseleave`), focus inside the carousel (`focusin`/`focusout`; production only), the pause toggle (production only), the tab hidden, or reduced motion.
- **User navigation** (segment click, arrow click, click on a peeking slide): `go(n)` resets progress to 0. Autoplay continues unless held.
- **Resize:** recompute `W` (viewport `clientWidth`), `SW = min(1200, W − 80)`, the track `padding-left = (W − SW)/2`, every slide `width = SW`, and the transform. Do this without a transition (set `transition:none` for that frame), so the carousel does not slide during a resize.
- **Reduced motion:** no autoplay. The active fill shows 100%. Transform and opacity changes on user input may still transition (they are user-initiated and short). You may also set the durations to 0.

### Easing reference
`cubic-bezier(0.2, 0.7, 0.2, 1)` is a fast start with a long, soft settle. Use it only for the track.

---

## M6–M7 · UI states
- Chips: `transition: background 160ms ease, color 160ms ease`.
- Links (`a:hover` → `#157F52`), buttons (dark → `#157F52`, light hero → `#FFFFFF`), the arrow border (→ `#1A1917`) and the subscribe button (→ `#0F6A43`) change instantly in the reference. You may add a 120ms colour transition site-wide if the codebase already does; do not animate size or position.
- Focus: every interactive element gets a visible `:focus-visible` ring: 2px `#157F52` outline, 2px offset. The search input uses the border colour change as well.

## Performance budget for motion
- Only `transform` and `opacity` animate (the track, the slides, the video fade). The progress fill updates `width` on a 2px bar, which is acceptable. `transform: scaleX()` on a full-width fill with `transform-origin:left` is better.
- One rAF loop for the carousel, plus one for the hero rate easing. Stop both when off screen or when the tab is hidden.
