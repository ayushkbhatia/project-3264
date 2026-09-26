# 02 · Header and Hero

Markup `reference/sections/01-header.html`, `02-hero.html`. Motion `ANIMATIONS.md` §3.

## Header

* `position:sticky; top:0; z-index:100; backdrop-filter:blur(14px); background:rgba(246,245,242,0.78);
  border-bottom:1px solid var(--line2)`. Inner `max-width:1280px; margin:0 auto; padding:0 40px; height:68px;
  display:flex; align-items:center; gap:48px`.
* Wordmark `3264<span>.ai</span>` 19px 500 −0.03em → Home.
* Nav (`flex:1; gap:30px; 14px; color:var(--sec)`): **AI Engineering** (active `#1A1917`, → `#top`),
  AI Transformation, Industries, Work, Playbooks, Company.
* Header button "Book an audit" → `#engagement`.

## Hero `#top`

* Section (`heroSec`): `position:relative; padding:0 40px; overflow:hidden; height:clamp(720px, 60vw,
  calc(100vh + 96px)); border-bottom:1px solid var(--line2)`.
* `heroImg`: `hero-plane.png`, `absolute; inset:0; 100%×100%; object-fit:cover; object-position:center bottom;
  filter:grayscale(1)` (the veil removes the filter once ready).
* `heroVeil`: canvas, `absolute; inset:0; 100%×100%; pointer-events:none`.
* Glow: `radial-gradient(ellipse 60% 52% at 50% 18%, rgba(250,248,240,0.62) 0%, rgba(250,248,240,0.28) 55%,
  rgba(250,248,240,0) 100%)`.
* Content centred, `padding:clamp(48px,5.2vw,76px) 0 0`:
  * "AI Engineering" 13px `#2C2B27`
  * h1 "The prototype works.<br>Now it has to hold." (margin-top 20px)
  * Lead, max-width 640px, margin-top 22px, `#2C2B27`: "Executives and analysts build working software in an
    afternoon now. We audit what they built, rebuild what has to be rebuilt, and run it in production with the
    controls a regulated firm is required to hold."
  * CTAs (gap 12px, margin-top 28px): primary "Book an audit" → `#engagement`; secondary "See the process" → `#rebuild`.
