# Handoff: Contact page

## Overview
The Contact page is 3264.ai's single place for new enquiries. It replaces the old Company page, which has been removed from the site. It is a split screen with two halves:

- **Left:** the headline "Get in touch", a one-paragraph brief on what to bring, and a rolling strip of the platform logos 3264 builds on.
- **Right:** a watercolour image panel with a white form card (Name, Work email, How can we help?) and a direct email line beneath it.

Below the split is the standard site footer. There is no closing CTA band on this page.

Route suggestion: `/contact`.

## About the design files
The files in this bundle are **design references created in HTML**. They are prototypes that show the intended look and behaviour, not production code to copy. Your task is to **recreate this design in the target codebase's existing environment**, using its established framework, component patterns and styling approach. If there is no environment yet, pick the most suitable framework (a static-first React framework such as Next.js or Astro suits this site) and implement it there.

`Contact.dc.html` opens directly in a browser and needs `support.js` next to it. Serve it from this folder so the relative `assets/` and `logos/` paths resolve. Every style is inline, so you can read exact values from the markup. Page logic (logo marquee, form validation, submit states) is the `class Component` script at the bottom of the file.

## Fidelity
**High-fidelity.** Colours, typography, spacing, radii, copy and interactions are final. Recreate them pixel-accurately with the codebase's own primitives. Where this README and the HTML disagree, the HTML wins.

## Files in this bundle
| File | What it is |
|---|---|
| `README.md` | This spec |
| `copy-deck.md` | Every visible string on the page, in order |
| `Contact.dc.html` | The page prototype and source of truth |
| `support.js` | Runtime needed to open the prototype locally |
| `assets/cta-d.avif` | Right-panel image (production default, "Ink"), 3420×2317 |
| `assets/cta-a.jpeg`, `assets/footer-nocturne.png` | Alternate panel images ("Grain", "Nocturne"), prototype-only options |
| `logos/*.png` | Nine platform logos, each 880×264 with transparent padding |

---

## Page anatomy

```
┌ Header (sticky, 68px, site standard) ────────────────────────────────────┐
├──────────────────────────────┬───────────────────────────────────────────┤
│ LEFT 50%                     │ RIGHT 50%                                  │
│ grid texture (faint)         │ full-bleed image (object-fit: cover)       │
│                              │                                            │
│       Get in touch           │   ┌ Form card, max 480px ──────────┐       │
│   lede, max 440px            │   │ Name                           │       │
│                              │   │ Work email                     │       │
│       Built on               │   │ How can we help?               │       │
│  ◁ rolling logo strip ▷      │   │ [Submit]  We reply inside…     │       │
│                              │   └────────────────────────────────┘       │
│                              │   Reach us any time at hello@3264.ai       │
├──────────────────────────────┴───────────────────────────────────────────┤
│ Footer (max-width 1280px, site standard)                                  │
└───────────────────────────────────────────────────────────────────────────┘
```
Both halves centre their content vertically and horizontally. The split fills at least the viewport below the header: `min-height: calc(100vh − 69px)`, which is the 68px header plus its 1px border.

---

## Design tokens
| Token | Value | Use |
|---|---|---|
| `--a` accent | `#157F52` | Current nav state, focus ring, hover colour, success eyebrow, status dot |
| ink | `#1A1917` | Body text, headline, submit button |
| `--sec` | `#55544E` | Lede, labels, nav links, footer links |
| `--mut` | `#6E6D67` | "Built on", button note, footer headings, legal line |
| placeholder | `#8C8A83` | Input placeholders (`opacity: 1`) |
| error | `#B3261E` | Field error text |
| `--line` | `rgba(20,20,18,0.13)` | Input borders, header CTA border |
| `--line2` | `rgba(20,20,18,0.075)` | Header, section and footer dividers |
| page | `#F6F5F2` | Body background (left half sits on this) |
| card | `#FFFFFF` | Form card and inputs |
| panel fallback | `#DDE9EC` | Right-panel colour while the image loads |

- **Type:** Instrument Sans (Google Fonts: 400, 500, 600, italic 400), falling back to "Helvetica Neue", Helvetica, sans-serif. `-webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility`.
- **Radii:** 6px (inputs, buttons, header CTA), 10px (form card).
- **Card shadow:** `0 1px 0 rgba(20,20,18,0.04), 0 28px 80px rgba(20,20,18,0.18)`.
- **Focus ring:** `border-color: #157F52; box-shadow: 0 0 0 3px color-mix(in srgb, #157F52 16%, transparent)`.
- **Global:** links inherit colour with no underline and turn `#157F52` on hover. `::selection` is `#157F52` with white text.

---

## Components

### Header (site chrome, shared with every page)
- `position: sticky; top: 0; z-index: 100`. Background `rgba(246,245,242,0.78)` with `backdrop-filter: blur(14px)`, bottom border `1px solid --line2`.
- Inner row: max-width 1280px, padding `0 40px`, height 68px, flex, `align-items: center`, gap `clamp(20px, 3vw, 48px)`.
- **Logo:** "3264.ai", 19px, weight 500, letter-spacing −0.03em. Links to Home.
- **Nav:** flex 1, gap `clamp(14px, 1.9vw, 30px)`, font-size `clamp(13px, 1.5vw, 14px)`, colour `--sec`, `white-space: nowrap`. On narrow screens it scrolls sideways (`overflow-x: auto`, scrollbar hidden) with a 28px fade on the right edge (`mask-image: linear-gradient(90deg, #000 calc(100% − 28px), transparent)`, `padding-right: 28px`).
  Items: AI Engineering · AI Transformation · Industries (Home `#industries`) · Work (Home `#work`) · Playbooks (index) · Essays (index) · **Contact** (current page, colour `#1A1917`).
- **Header CTA:** "Book an audit", height 36px, padding `0 16px`, `1px solid --line`, radius 6px, white, 13.5px, letter-spacing −0.01em. On hover the border and text turn accent. Links to AI Engineering `#engagement`.

### Split section (`id="top"`)
- `display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 440px), 1fr))`, no gap. This gives two equal columns when the viewport is at least 880px wide, and one stacked column below that.
- Bottom border `1px solid --line2`.

### Left half
- Flex, centred on both axes. Padding `clamp(72px, 9vw, 120px) clamp(20px, 5vw, 64px)`, `overflow: hidden`, `position: relative`.
- **Grid texture** (decorative, absolute, `inset: 0`, `pointer-events: none`):
  - opacity 0.34
  - `background-image: linear-gradient(to right, rgba(20,20,18,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,20,18,0.05) 1px, transparent 1px)`
  - `background-size: calc(100% / 16) 68px` (16 columns across the half; rows match the header height)
  - `mask-image: linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.35) 60%, transparent 100%)`
- **Content block:** max-width 520px, `text-align: center`.
  - **H1** "Get in touch": `clamp(44px, 5.4vw, 76px)`, weight 400, letter-spacing −0.04em, line-height 1.0.
  - **Lede:** margin-top 26px, max-width 440px, centred, 18px, line-height 1.55, `--sec`, `text-wrap: pretty`.
  - **Logo block:** margin-top 64px.
    - Label "Built on": 13px, letter-spacing −0.005em, `--mut`.
    - Marquee viewport: margin-top 16px, `overflow: hidden`, edge fade `mask-image: linear-gradient(90deg, transparent 0, #000 14%, #000 86%, transparent 100%)`.
    - Track: flex, `align-items: center`, gap 18px, `width: max-content`.
    - Logos: each `height: 48px; width: auto` (160px wide, since the PNGs are 10:3), opacity 0.78. Order: Anthropic, OpenAI, Amazon Web Services, Vercel, Supabase, LangChain, LangGraph, n8n, Cursor (`brand4.png`). The set is rendered twice for a seamless loop. The second set has `alt=""` and `aria-hidden="true"`.

### Right half
- Flex column, centred on both axes. Padding `clamp(56px, 7vw, 88px) clamp(20px, 4vw, 48px)`, `overflow: hidden`, `position: relative`, background `#DDE9EC`.
- **Background image:** absolute, `inset: 0`, 100% × 100%, `object-fit: cover; object-position: center 45%`, `alt=""` (decorative). Use `assets/cta-d.avif` in production.
- **Form card:** width 100%, max-width 480px, padding `clamp(26px, 3vw, 36px) clamp(22px, 3vw, 34px)`, white, radius 10px, card shadow.
  - Form: flex column, gap 22px.
  - **Field:** a `<label>` wrapping its text and control: flex column, gap 9px. Label text 14px, letter-spacing −0.005em, `--sec`.
  - **Text inputs** (Name, Work email): width 100%, height 46px, padding `0 14px`, `1px solid --line`, radius 6px, white, 15.5px, `#1A1917`, no outline. Focus uses the focus ring above. Work email has the placeholder "you@firm.com".
  - **Textarea** (How can we help?): same styling, but `min-height: 112px`, `rows=4`, padding `12px 14px`, line-height 1.5, `resize: vertical`. Placeholder: "Tell us about your firm and the workflow you have in mind".
  - **Error text** (under the field, inside its label): 13px, `#B3261E`.
  - **Submit row:** flex, `align-items: center`, gap 18px, wraps, margin-top 4px.
    - **Submit button:** height 48px, padding `0 26px`, no border, radius 6px, background `#1A1917`, white, 15px, weight 500, letter-spacing −0.01em. Hover background `#157F52`. The label reads "Submit", or "Sending…" while busy.
    - **Note:** "We reply inside one business day.", 13.5px, `--mut`.
  - **Success view** replaces the form inside the same card. Flex column, padding `6px 0 2px`:
    - Eyebrow "Message sent": 13px, accent.
    - H2 "Thanks, {first name}.": margin-top 14px, 30px, weight 400, letter-spacing −0.03em, line-height 1.1.
    - Body "We will reply to {email} inside one business day.": margin-top 14px, 15.5px, line-height 1.58, `--sec`.
    - Text button "Send another message": margin-top 26px, no background, `padding: 0 0 2px`, `border-bottom: 1px solid --line`, 14.5px, `#1A1917`. On hover the border and text turn accent.
- **Direct line** (below the card): margin-top 24px, 14.5px, letter-spacing −0.005em, `#1A1917`, centred. Text: "Reach us any time at hello@3264.ai". The address is a `mailto:` link, underlined with a 3px offset.

### Footer (site standard)
- Padding `70px 40px 40px`, inner max-width 1280px.
- Columns: `grid-template-columns: repeat(auto-fit, minmax(168px, 1fr))`. Each column after the first has `border-left: 1px solid --line2` and padding `0 28px`; the first has padding `0 28px 0 0`.
- Column heading: 11px, weight 500, letter-spacing 0.11em, uppercase, `--mut`. Links: grid, gap 13px, margin-top 22px, 14.5px, letter-spacing −0.008em, `--sec`, accent on hover.

| Column | Links (target) |
|---|---|
| Services | AI Engineering (page) · AI Transformation (page) · Deployment & Run (Home `#capabilities`) · Evaluation suites (Home `#capabilities`) |
| Industries | Private Credit (page) · Financial Services · Fund Management · Asset Management (all Home `#industries`) |
| Company | Who we are (Home `#company`) · How we work (Home `#model`) · Case studies (Home `#work`) · Contact (this page) |
| Resources | Playbooks (index) · Field notes (Home `#playbooks`) · Security (AI Engineering `#platform`) |
| Connect | Book a call (this page) · hello@3264.ai (`mailto:`) · LinkedIn (no URL yet) |

- Bottom bar: margin-top 64px, padding-top 22px, `border-top: 1px solid --line2`, 13px, `--mut`, flex with `space-between`, wraps with a 20px gap.
  - Left (gap 11px): "3264.ai" (15px, weight 500, −0.03em, `#1A1917`) and "© 2026 Bearing Deployment Company Inc. All rights reserved."
  - Right: a 6px accent dot (gap 7px) and "All systems operational".

---

## Interactions & behaviour

### Logo marquee
- Moves left continuously at **32px per second**. One loop is the width of one logo set plus one gap: about 1,602px, or about 50s.
- The prototype uses a `requestAnimationFrame` loop. It advances `offset += dt × 0.032` (with `dt` capped at 64ms), wraps `offset` modulo the loop width (measured as the first duplicate's `offsetLeft` minus the first logo's `offsetLeft`), and applies `translate3d(−offset, 0, 0)` to the track.
- A pure-CSS version is fine. Wrap each set in its own flex row with `padding-right: 18px`, then animate the track from `translateX(0)` to `translateX(−50%)`, linear, infinite, about 50s.
- **Pause on hover:** the strip pauses on `mouseenter` of the viewport and resumes on `mouseleave`.
- **Reduced motion:** if `prefers-reduced-motion: reduce`, don't animate. The strip shows as a static row clipped by the edge fade.

### Form
- Native browser validation is off (`form.noValidate = true`) so the custom messages show. Name and email still carry `required` for semantics.
- **Rules, checked on submit:**
  - Name: required after trimming. Error: "Add your name so we know who to reply to."
  - Work email: required, and must match `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` after trimming. Error: "Enter a work email, like you@firm.com."
  - How can we help?: optional.
- Errors appear only after the first failed submit. After that, every `input` event re-validates, so each error clears as soon as its field is valid.
- **On a valid submit:** the button shows "Sending…" and further submits are ignored. When the request resolves, the card swaps to the success view. The prototype fakes the request with a 650ms timeout; replace that with the real call.
- **First name** in the success heading is the first whitespace-separated word of Name.
- **"Send another message"** brings back an empty form with no errors.
- **Request failure:** not designed. Suggestion: keep the form and its values, and show one line in the error red under the submit row: "That didn't send. Write to hello@3264.ai and we'll pick it up."

### Responsive
- **880px and wider:** two equal columns.
- **Below 880px:** the halves stack, with the headline and logos first, then the image panel with the form. All paddings and the headline size scale with the `clamp()` values above. At 375px wide the side padding is 20px and the card padding is 26px × 22px.
- The header and footer follow the site-wide responsive rules.

---

## State
| State | Type | Notes |
|---|---|---|
| `tried` | boolean | True after the first failed submit; turns on live re-validation |
| `errName`, `errEmail` | boolean | Drive the error lines |
| `busy` | boolean | Request in flight: shows "Sending…" and blocks repeat submits |
| `sent` | boolean | Shows the success view in place of the form |
| `firstName`, `sentEmail` | string | Copy for the success view |

Inputs are uncontrolled in the prototype (read with `FormData` on submit and input). Controlled inputs are fine too.

**Data:** submit `{ name, email, message }` to whatever service the site uses for enquiries. The endpoint, notification address and CRM are still to be chosen. Add spam protection (a honeypot field or a provider-side check) without adding visible UI.

---

## Accessibility
- Every control is wrapped by its `<label>`. In production, link each error to its field with `aria-describedby` and set `aria-invalid` while it shows.
- Announce the success view: put `aria-live="polite"` on the card or move focus to the "Thanks" heading.
- Decorative images (panel background, duplicate logos) have `alt=""`. The first logo set has real alt text.
- Reduced motion is respected for the marquee.
- Contrast: the direct line is `#1A1917` on the light centre of the Ink image. If the panel image changes to something dark, make that line white (the prototype's "Nocturne" option does this).

---

## Meta
- `<title>`: "Contact — 3264.ai"
- Description: "Thirty minutes, one workflow, no deck. Tell 3264 about your firm, or write to hello@3264.ai."

## Site-wide changes in this release
The Company page has been removed. Every page in the project now carries these changes, and they override any earlier handoff README that lists "Company" in the nav:
- The last header nav item is **Contact** and links to `/contact`. The full nav is: AI Engineering, AI Transformation, Industries, Work, Playbooks, Essays, Contact.
- Footer, Company column: Who we are goes to Home `#company`, How we work goes to Home `#model`, Case studies goes to Home `#work`, and there is a new **Contact** link to `/contact`.
- Footer, Resources column: Security goes to AI Engineering `#platform`.
- The founder bios that were on the Company page are not on the site right now.

## Prototype-only controls
The prototype exposes four tweaks. Ship the defaults and don't build these controls:
- Accent colour: `#157F52`
- Grid texture: on
- Panel image: Ink (`cta-d.avif`)
- Logo motion: on

## Open items before launch
- **Form backend:** endpoint, notification routing and CRM.
- **Logo strip:** these are platforms 3264 builds on, so the label reads "Built on", not "Partners". Check each vendor's trademark guidelines before shipping, and swap in actual partner logos if formal partnerships exist.
- **LinkedIn:** the company page URL for the footer link.
- **Footer label:** "Field notes" is due to be renamed "Essays" and pointed at the Essays index.
- **Offices:** office locations (San Francisco, Dubai) appeared only on the old Company page. Confirm whether the Contact page should list them.
