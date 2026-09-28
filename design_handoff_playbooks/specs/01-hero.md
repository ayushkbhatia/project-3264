# 01 · Video hero (`#top`)

Screenshots: `screenshots/desktop-1440/01-hero.png`; video stills in `screenshots/hero-frames/00-start.jpg`, `01-mid.jpg`, `02-end.jpg`. The design tool cannot capture video frames, so use the stills to judge the composition.

## Structure
```
section#top  position:relative; overflow:hidden; background:#0A0A0A; color:#F4F3F0;
             min-height:calc(100vh - 68px); display:flex; flex-direction:column
├─ layer (aria-hidden)  position:absolute; inset:0; z-index:0; overflow:hidden
│   └─ <video> position:absolute; inset:0; width:100%; height:100%;
│              object-fit:cover; object-position:bottom; opacity:0 (→1, see MOTION.md)
├─ scrim   position:absolute; inset:0; pointer-events:none;
│          background:linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.15) 40%,
│                                              rgba(10,10,10,0.35) 75%, rgba(10,10,10,0.92) 100%)
└─ content position:relative; flex:1; max-width:1280px; width:100%; box-sizing:border-box;
           margin:0 auto; padding:clamp(56px, 9vh, 112px) 40px 56px;
           display:flex; flex-direction:column; align-items:center; justify-content:flex-start;
           text-align:center
    ├─ h1  margin:0; max-width:1000px; font-size:clamp(34px, 4.2vw, 60px); font-weight:400;
    │      letter-spacing:-0.04em; line-height:0.98; text-wrap:balance
    │      "Every workflow we have shipped," <br/> "drawn so you can start from it."
    └─ buttons  display:flex; gap:12px; margin-top:34px; flex-wrap:wrap; justify-content:center
        ├─ "Browse the library" → #library (in-page)
        │   inline-flex; align-items:center; height:46px; padding:0 24px; background:#F4F3F0;
        │   color:#1A1917; border-radius:6px; font-size:15px; font-weight:500; letter-spacing:-0.01em
        │   hover: background:#FFFFFF
        └─ "Book a two-week audit" → /ai-engineering#engagement
            inline-flex; height:46px; padding:0 24px; box-sizing:border-box;
            border:1px solid rgba(255,255,255,0.28); background:rgba(255,255,255,0.06);
            backdrop-filter:blur(6px); color:#F4F3F0; border-radius:6px; 15px/500/-0.01em
            hover: border-color:#F4F3F0
```
- The H1 has a hard line break after the comma. Keep the `<br/>`.
- `#library` needs `scroll-margin-top:68px` so the sticky header does not cover the chips after the jump.
- The subject in the video (a figure against a starfield) sits in the lower centre. `object-position:bottom` keeps it in frame on wide and short viewports. Keep it.

## Video
- Source: see README. Self-host it and serve the **boomerang** render with a poster. `MOTION.md` has the ffmpeg command and the controller in `motion/hero-video.ts`.
- `muted`, `playsInline`, `autoPlay`, `preload="auto"`. Use `poster` = the first frame (`hero-frames/00-start.jpg`, served as AVIF/WebP), so the hero is never empty on slow connections or when autoplay is blocked.
- No audio track in production (`-an`).

## Behaviour
- The video fades from opacity 0 to 1 over 500ms (linear) on the first `canplay`. Until then the `#0A0A0A` background and the scrim show.
- It plays forward, then backward, forever, with an eased slow-down at each turn. See `MOTION.md` § Hero.
- Reduced motion: no playback. Show the poster (first frame) at opacity 1.
