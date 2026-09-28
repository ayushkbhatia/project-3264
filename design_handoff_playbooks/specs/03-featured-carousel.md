# 03 · Featured carousel

Screenshots: `desktop-1440/02-library-carousel-slide-1.png` (slide 1 active), `03-carousel-slide-2.png` (slide 2 active, neighbours peeking), `tablet-924/02-library-carousel.png`. Motion: `MOTION.md` § Carousel. Controller: `motion/carousel.ts`.

Shown only while browsing.

## Slides (fixed order)
| # | Playbook | Category | Image |
|---|---|---|---|
| 1 | Covenant Watch | Private Credit | `playbooks/feat-covenant-watch.png` |
| 2 | NAV Pack Review | Fund Management | `playbooks/feat-nav-pack-review.png` |
| 3 | Mandate Guardrails | Asset Management | `playbooks/feat-mandate-guardrails.png` |
| 4 | Capital Call Flow | Private Credit | `playbooks/feat-capital-call-flow.png` |
| 5 | Side-Letter Register | Fund Management | `playbooks/feat-side-letter-register.png` |
| 6 | Research Intake | Asset Management | `playbooks/feat-research-intake.png` |

Blurbs are the same one-liners used in the category rows (`CONTENT.md`).

## Geometry
```
section            padding:40px 0 0          (full-bleed: no side padding)
└─ viewport        position:relative; overflow:hidden      ← hover here pauses autoplay
   └─ track        display:flex; gap:24px;
                   padding-left: (W − SW) / 2              ← JS, centres the active slide
                   transform: translateX(−index × (SW + 24)px)
                   transition: transform 700ms cubic-bezier(0.2, 0.7, 0.2, 1); will-change:transform
      └─ slide ×6  flex:0 0 auto; width:SW; box-sizing:border-box;
                   display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 340px), 1fr));
                   gap:14px; padding:14px; border-radius:22px; background:#EEECE7;
                   transition:opacity 500ms ease
```
- `W` = the viewport element's `clientWidth`; `SW = min(1200, W − 80)`. Recompute both on resize.
- At 1440: SW = 1200, left inset 120, and the neighbours peek 96px on each side at 40% opacity.
- Active slide: `opacity:1; cursor:auto`. Inactive: `opacity:0.4; cursor:pointer`. Clicking an inactive slide makes it active and does **not** follow the link inside it (`preventDefault`).

### Slide content
- **Text column:** `display:flex; flex-direction:column; justify-content:center; padding:clamp(20px, 3.4vw, 44px)`
  - Category: 13px, -0.005em, `#6E6D67`
  - Title: `margin-top:16px`; `clamp(28px, 2.8vw, 40px)`, -0.034em, line-height 1.06, `#1A1917`, `text-wrap:balance`
  - Blurb: `margin-top:16px; max-width:440px`; 16px/1.55, `#55544E`, `text-wrap:pretty`
  - "Read the playbook": `<a>`, `align-self:flex-start; margin-top:28px; inline-flex; height:42px; padding:0 18px; background:#1A1917; color:#FFFFFF; border-radius:8px; 14px/500/-0.01em`. Hover: background `#157F52`. Links to the playbook page.
- **Image column:** `position:relative; min-height:clamp(240px, 30vw, 400px); border-radius:14px; overflow:hidden; background:#E2DFD8`
  - Image: `object-fit:cover`, fills the box.
  - Glass badge centred, **30%** of the box height (specs/00).
- When the slide is narrower than 2 × 340px + 14px, the grid falls to one column: text on top, image below.

## Controls row
```
max-width:1280px; margin:0 auto; padding:24px 40px 0; box-sizing:border-box;
display:flex; align-items:center; gap:24px
├─ segments  flex:1 1 auto; min-width:0; display:flex; gap:12px
│   └─ <button aria-label="Show {name}"> ×6   flex:1 1 0; height:20px (hit area); background:none; border:0
│        └─ track  position:relative; display:block; width:100%; height:2px;
│                  background:rgba(20,20,18,0.14); overflow:hidden
│             └─ fill  position:absolute; left:0; top:0; bottom:0; background:#1A1917; width:<progress>%
└─ arrows  display:flex; gap:10px
    ├─ <button aria-label="Previous playbook">←</button>
    └─ <button aria-label="Next playbook">→</button>
        width:44px; height:44px; border-radius:50%; border:1px solid rgba(20,20,18,0.13);
        background:#FFFFFF; color:#1A1917; font-size:17px; line-height:1
        hover: border-color:#1A1917
```
- Fill widths: slides before the active one are 100%. The active slide fills 0 → 100% over its 7s dwell. Slides after it are 0%. With reduced motion, the active fill is 100% (no dwell).
- Clicking a segment goes to that slide. The arrows wrap (from 6, → goes to 1; from 1, ← goes to 6).

## Accessibility additions (required in production)
- Wrap the viewport in `role="region" aria-roledescription="carousel" aria-label="Featured playbooks"`. Each slide gets `role="group" aria-roledescription="slide" aria-label="n of 6: {name}"`, and inactive slides get `aria-hidden` plus `inert`, so their links are not tabbable.
- Pause autoplay while the pointer is over the viewport (as in the prototype) **and** while focus is inside it (`focusin`/`focusout`).
- WCAG 2.2.2 (Pause, Stop, Hide): add a pause/play toggle. Use the arrow style (44px circle, 1px `line` border, white) placed left of ←, with the label "Pause carousel" / "Play carousel" and glyphs ❙❙ / ▶ at 13px. This is the only addition to the visual design.
- Left/Right arrow keys move between slides when focus is on the segments or arrows.
