# Prompts for Claude Code: 3264.ai Playbooks page

Paste these in order, one prompt per session. Start a fresh session for each phase, so the context holds only that phase's spec. Do not start a phase until the previous one has passed its gate in `BUILD_PLAN.md`.

---

## 0 · Kickoff (run once)
```
You are implementing the 3264.ai Playbooks library page (/playbooks) from a high-fidelity
design handoff in /design_handoff_playbooks. The goal is a faithful port. Side by side with the
reference at 1440px, with motion frozen, a designer should not be able to tell them apart.

Read, in this order, before writing code:
  1. design_handoff_playbooks/README.md
  2. design_handoff_playbooks/BUILD_PLAN.md
  3. design_handoff_playbooks/specs/00-foundation.md
  4. design_handoff_playbooks/MOTION.md (skim now; read it fully in Phase 3)
  5. design_handoff_playbooks/VISUAL_QA.md
Look at every PNG in design_handoff_playbooks/screenshots/.

Serve the reference: npx serve design_handoff_playbooks/reference -l 4200 and open
http://localhost:4200/Playbooks.dc.html. It runs on a prototype runtime (support.js). Do not port
the runtime. Read the markup between <x-dc> and </x-dc> as plain HTML with inline styles, and the
class Component script as the behaviour reference. <sc-for>/<sc-if> are loops/conditionals;
<x-import … image-slot> is just an <img>; {{ pb.mark }} is the glass icon badge.

Rules for the whole project:
- Stack: Next.js App Router, React, TypeScript, Tailwind. No motion libraries.
- Copy is verbatim (CONTENT.md, data/playbooks.json). Do not rewrite any text.
- Values are exact: 13.5px is not 14px, -0.035em is not tracking-tight, rgba(20,20,18,0.13) is
  not a Tailwind grey. Use arbitrary values or theme tokens that hold the exact value.
- No heading heavier than weight 400.
- motion/hero-video.ts and motion/carousel.ts are production modules. Mount them; do not replace
  them with Framer Motion or GSAP, and do not move their per-frame state into React.
- Do NOT port the prototype's WebCodecs ping-pong (startDecode/stepPP). Use the boomerang video
  from MOTION.md.

First task: Phase 0 only (BUILD_PLAN.md). Report what you set up and stop.
```

## 1 · Static page
```
Phase 1 of design_handoff_playbooks/BUILD_PLAN.md. Read specs/00 to specs/07 and CONTENT.md.
Build the browsing state of /playbooks with motion off: header (reuse the site header, Playbooks
active), hero with poster only, library bar (static), featured carousel showing slide 1 (static
markup matching specs/03 geometry, including the CSS fallback width min(1200px, calc(100vw - 80px))),
CTA cards, the three category rows from data/playbooks.json, Recently updated, closing, footer.
Create PlaybookBadge and PlaybookCard as shared components.
Then run the visual comparison against the 1440 and 1280 baselines and fix differences until
each section is ≤ 0.5%. Report the per-section diff numbers and stop.
```

## 2 · Interaction
```
Phase 2 of BUILD_PLAN.md. Read specs/02 and specs/04.
Implement the chips + search filtering, the Results section (auto-fill grid, label pattern, Clear,
empty state, aria-live count) and optional URL sync with router.replace. Implement the subscribe
form states (idle, submitting, success, invalid, error) behind a single subscribe(email) function
that currently resolves after 600ms. Compare states s01–s04 against the baselines. Report and stop.
```

## 3 · Motion
```
Phase 3 of BUILD_PLAN.md. Read MOTION.md fully, and specs/01 and specs/03.
Mount motion/hero-video.ts on the hero <video> (WebM + MP4 boomerang sources, poster, muted,
playsinline, autoplay, loop, aria-hidden). Mount motion/carousel.ts with the DOM contract in its
header comment. Wire the arrows, segments, click-to-activate on peeking slides, hover and focus
hold, and the new pause/play toggle (specs/03), plus reduced motion. Add the chip transitions and
the focus rings. Verify: two full hero cycles with no jump at either turn; the carousel dwell is
7s; the track moves in 700ms with cubic-bezier(0.2,0.7,0.2,1); no React re-render per frame
(profile it). Report and stop.
```

## 4 · Responsive, a11y, performance
```
Phase 4 of BUILD_PLAN.md. Read specs/08. Implement the four "Add" items (header collapse below
1000px, Recently updated two-column layout below 520px, 20px side padding below 480px, carousel
swipe), the full a11y list, and the performance items (AVIF/WebP, lazy loading, font and poster
preload, off-screen video pause). Run the visual comparison at 1024, 768 and 390 and Lighthouse
on mobile. Tick CHECKLIST.md item by item and report anything that does not pass.
```
