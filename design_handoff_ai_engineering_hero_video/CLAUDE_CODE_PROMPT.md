# Prompt for Claude Code — AI Engineering hero video

Paste this into a fresh Claude Code session at the repo root, with this folder at
`/design_handoff_ai_engineering_hero_video`.

```
Apply a scoped change to the live AI Engineering page: the hero's static illustration becomes a looping video
under the existing greyscale colour-reveal veil. Nothing outside the hero changes.

Read first, in full:
  1. design_handoff_ai_engineering_hero_video/README.md
  2. design_handoff_ai_engineering_hero_video/motion/hero-veil.methods.js
  3. design_handoff_ai_engineering_hero_video/CHANGES.diff
Open design_handoff_ai_engineering_hero_video/reference/hero-demo.html in a browser and move the pointer over
the hero. That is the target behaviour.

Then:
1. Find the current implementation: search the codebase for heroVeil, initVeil, stepVeil, buildGrey and
   hero-plane. Report the files and lines before editing anything.
2. Assets: download the clip, re-encode it and write the poster exactly as in README → "Video asset". Put them at
   public/video/ai-engineering-hero.mp4 and public/img/ai-engineering-hero-poster.jpg (or the repo's
   equivalents). Do not hotlink the CloudFront URL. Report the output file sizes.
3. Markup: replace the hero <img> with the <video> in README → "Video element". Keep the same ref (heroImg), the
   same inline style and the same position before the canvas. Keep the canvas and the glow div unchanged.
4. Logic: replace initVeil() and stepVeil() with the verbatim versions in motion/hero-veil.methods.js and
   delete buildGrey(). Change nothing else in the class: componentDidMount, tick and componentWillUnmount
   already call initVeil(), stepVeil(ms) and _veilOff(). Do not rewrite the methods as hooks or add a
   motion library.
5. Head: preload the poster; remove any preload of hero-plane.png.
6. Verify with qa/hero-video.spec.ts (set PORT_URL) and walk qa/CHECKLIST.md. Report each item as pass or
   fail. Check in Chrome, Safari and Firefox, and on an iPhone if one is available.
7. Do not delete hero-plane.png until you have confirmed nothing else on the site uses it; list any usages you
   find.

Do not change copy, layout, the radial glow, blot timings or any other section. If something in the README
conflicts with the codebase, stop and ask.
```
