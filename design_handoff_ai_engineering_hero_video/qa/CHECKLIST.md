# Checklist — AI Engineering hero video

Mark each pass / fail / open. Compare against `reference/hero-demo.html`.

## Look
- [ ] On load the hero is monochrome: the poster first, then the playing video. There is never a flash of colour.
- [ ] Headline, lead and CTAs unchanged; the radial glow still sits behind the headline.
- [ ] The video fills the hero and is anchored to the bottom edge at 1024, 1280, 1440 and 1920 wide.
- [ ] Resizing keeps the grey layer aligned with the video: no offset or double image at the edges.

## Interaction
- [ ] Moving the pointer reveals colour in soft blots, and the colour shows the moving footage.
- [ ] Blots bleed outward and refill to grey about 2.4s after the pointer stops.
- [ ] The video loops with a plain restart (no crossfade), as in the reference.

## Accessibility
- [ ] Reduced motion (OS setting or `emulateMedia`): the video is paused on the first frame and no trail appears.
- [ ] The video is `aria-hidden` and has no controls. It does not take focus.

## Devices
- [ ] Chrome, Safari and Firefox on desktop: autoplay works and the veil draws.
- [ ] iPhone Safari: plays inline (no fullscreen takeover). In Low Power Mode, where autoplay is blocked, the grey
      poster shows and nothing breaks.

## Loading and performance
- [ ] The video is served from the site's own domain; the CloudFront URL appears nowhere in the codebase.
- [ ] The MP4 is faststart and about 4 MB or less; playback starts before the download finishes.
- [ ] The poster is preloaded; `hero-plane.png` is no longer requested on this page.
- [ ] With the hero scrolled off screen, the Performance panel shows no canvas work from the veil.
- [ ] No console errors after loading, moving the pointer, scrolling to the footer and back.
- [ ] Lighthouse: LCP is the poster; CLS unchanged.
