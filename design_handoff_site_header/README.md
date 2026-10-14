# Handoff: Site header and menus (desktop + mobile)

## Overview
The shared header for every 3264.ai page. It adds:
- **Desktop (≥ 1024px):** three dropdown mega-panels on the nav items **AI Engineering**, **AI Transformation** and **Industries**. Work, Playbooks, Essays and Contact remain plain links.
- **Phone and tablet (< 1024px):** the nav collapses into a **Menu** button that opens a full-height sheet. The three menus become accordions (one open at a time), the four plain pages sit below them, and a "Book a two-week audit" button is pinned to the bottom.

This replaces the current header on all pages, including the horizontally scrolling nav with the right-edge fade that was used on tablets.

## About the design files
The files in `reference/` are **design references created in HTML**: prototypes showing the intended look and behaviour, not production code to copy. Your task is to **recreate this design in the target codebase's existing environment** (React/Next.js, Astro, etc.) using its established patterns. If there is no environment yet, build it as one `SiteHeader` component in a static-first React framework and render it once in the root layout.

To open the prototypes, serve `reference/` as a static folder (for example `npx serve reference`) and open `Header Menus.dc.html`. It needs `support.js` beside it. `Site Header.dc.html` is the component itself, and all of its styles are inline, so you can read exact values from the markup. Its behaviour is in the `class Component` script at the bottom of the file.

## Fidelity
**High-fidelity.** Colours, type, spacing, radii, copy and interactions are final. Where this README and the HTML disagree, the HTML wins.

## Files in this bundle
| Path | What it is |
|---|---|
| `README.md` | This spec |
| `CHECKLIST.md` | Acceptance checklist for QA and PR review |
| `copy-deck.md` | Every visible string, by state |
| `menu-data.json` | All menu content as structured data (labels, descriptions, links, thumbnails) |
| `screenshots/01–04` | Desktop at 1280px: closed, then each panel open |
| `screenshots/05–08` | Phone at 390 × 844 (@2x): closed, menu open, AI Engineering expanded, Industries expanded |
| `screenshots/09` | Tablet at 834px: AI Transformation expanded, with "Book an audit" kept in the bar |
| `reference/Site Header.dc.html` | The header component prototype (source of truth) |
| `reference/Header Menus.dc.html` | Canvas showing every state; 1a and 2a are live |
| `reference/support.js` | Runtime needed to open the prototypes |
| `reference/assets/…` | Watercolour images used by thumbnails and feature cards |

---

## Design tokens
| Token | Value | Use |
|---|---|---|
| ink | `#1A1917` | Primary text, active trigger, dark buttons |
| secondary | `#55544E` | Nav links at rest, descriptions |
| muted | `#6E6D67` | Column labels, step numbers |
| accent | `#157F52` | Link hover (overview links, header CTA hover) |
| page | `#F6F5F2` | Phone sheet background |
| panel | `#FBFAF8` | Desktop dropdown panel |
| item hover | `#F0EEE9` | Desktop menu item hover fill |
| thumb fallback | `#E2DFD8` | Image placeholder colour |
| line | `rgba(20,20,18,0.13)` | Button borders |
| line-soft | `rgba(20,20,18,0.09)` | Panel and sheet dividers, row rules |
| line-faint | `rgba(20,20,18,0.06)` | Rules between accordion items |
| header bg | `rgba(246,245,242,0.86)` + `backdrop-filter: blur(14px)` | Header bar |
| header border | `1px solid rgba(20,20,18,0.075)` | Header bottom |

- **Type:** Instrument Sans (400, 500), with IBM Plex Mono (400, 500) for column labels and step numbers. Fallback: "Helvetica Neue", Helvetica, sans-serif.
- **Radii:** 6px (desktop CTA, card buttons), 7–10px (thumbnails, menu items), 14px (feature cards), 999px (phone pill buttons), 8px (pinned phone CTA).
- **Panel shadow:** `0 40px 60px -40px rgba(20,20,18,0.28)`.

---

## Desktop (≥ 1024px)

### Bar
- `position: sticky; top: 0; z-index: 100` on real pages. The prototype is `relative` because it sits inside artboards.
- Inner row: max-width 1280px, centred, padding `0 40px`, height 68px, flex, `align-items: center`, gap `clamp(20px, 3vw, 48px)`.
- **Logo** "3264.ai": 19px, weight 500, letter-spacing −0.03em. Links to Home.
- **Nav:** flex 1, gap `clamp(14px, 1.9vw, 30px)`, font-size `clamp(13px, 1.5vw, 14px)`, colour secondary.
  - Order: **AI Engineering ▾ · AI Transformation ▾ · Industries ▾ · Work · Playbooks · Essays · Contact**.
  - The three triggers are `<button>`s, the full 68px bar height, with gap 7px between label and chevron.
  - **Chevron:** a 5 × 5px box with 1.4px right and bottom borders in `currentColor`. Closed: `rotate(45deg)` and `margin-top: -3px` (points down). Open: `rotate(-135deg)` and `margin-top: 3px` (points up). Transition 200ms ease.
  - Trigger colour: secondary at rest, ink on hover or when open.
- **CTA** "Book an audit": height 36px, padding `0 16px`, 1px line border, radius 6px, white, 13.5px. On hover the border and text turn accent. Links to `/ai-engineering#engagement`.

### Dropdown panel (shared shell)
- Absolutely positioned `top: 100%` (plus 1px for the border), full header width, background panel colour, `border-bottom: 1px solid rgba(20,20,18,0.09)`, panel shadow.
- **Open:** opacity 0 → 1 (180ms ease), `translateY(-6px)` → `0` (220ms `cubic-bezier(0.2,0.7,0.2,1)`). Visibility switches immediately on open and after 220ms on close, so the panel can't be clicked while it fades out.
- Inner: max-width 1280px, padding `30px 40px 36px`.
- **Panel head row:** flex, `space-between`, wraps, padding-bottom 20px, with a bottom rule (`rgba(20,20,18,0.08)`).
  - Title: 21px, −0.026em.
  - Tagline (gap 18px): 14px, secondary.
  - Right link: "Overview →" or "All industries →", 13.5px, ink, accent on hover.
- **Body:** CSS grid, gap 32px, margin-top 22px.
- **Column label:** IBM Plex Mono 10.5px, letter-spacing 0.08em, uppercase, muted, padding `0 14px` so it lines up with item text.
- **Menu item (title + description):** padding `12px 14px`, radius 10px, hover background `#F0EEE9`. Title 15.5px, −0.012em. Description 13.5px, line-height 1.5, secondary, margin-top 5px.
- **Feature card:** min-height 236px (200px in Industries), radius 14px, `overflow: hidden`, padding 20px, content aligned to the bottom.
  - Background is a cover image with a veil: `linear-gradient(180deg, rgba(248,246,240,0.10–0.15) 0%, rgba(248,246,240,0.82–0.86) 70–72%)`.
  - Eyebrow 12.5px `#2C2B27`, then a title 20px, −0.024em, line-height 1.2, `text-wrap: balance`, then a CTA.

### AI Engineering panel (screenshot 02)
- Grid: `1.5fr | 1fr | 1.05fr`.
- **How it works** (2 × 2 grid of items, gap 4px): Two-week audit → `#audit` · Rebuild → `#rebuild` · Platform → `#platform` · Engagement → `#engagement`. All on `/ai-engineering`.
- **Built from playbooks:** four rows, each padding `9px 14px`, 14.5px, with a 28px thumbnail (radius 7px) of the playbook watercolour, gap 12px. Rows: Loan Ops Ledger, Covenant Watch, NAV Pack Review, Mandate Guardrails. Then "All nine playbooks →" (13.5px, secondary) to `/playbooks`.
- **Feature card:** image `valley-pastel.png` at `center 60%`. Eyebrow "Start here", title "Measure one workflow before anything is built.", then a dark button "Book a two-week audit" (36px, radius 6px, 13px, weight 500). The whole card links to `/ai-engineering#audit`.

### AI Transformation panel (screenshot 03)
- Same grid.
- **The programme** (2 × 2): numbered items with an IBM Plex Mono 11px muted number (01–04) at padding-top 3px, gap 12px. Discover · Rewire · Run · Optimise link to `#discover`, `#rewire`, `#run` and `#optimise` on `/ai-transformation`.
- **Foundations:** three compact items (padding `10px 14px`; title 14.5px; description 13px). Integration → `#integration`, Control → `#control`, Engagement → `#engagement`.
- **Feature card:** image `feat-nav-pack-review.png`. Eyebrow "Work", title "Engagements measured against the week before we arrived.", then the text link "See the work →". Links to `/work`.

### Industries panel (screenshot 04)
- Grid: `2.5fr | 1.05fr`.
- **Industry items** (2 × 2): each has a 52px thumbnail (radius 10px), gap 14px. Private Credit → `/private-credit` · Private Equity → `/private-equity` · Fund Management → `/#industries` · Asset Management → `/#industries`.
- **Feature card:** image `feat-covenant-watch.png`. Eyebrow "Playbooks", title "Nine workflows, filed by industry.", then "Browse playbooks →". Links to `/playbooks`.
- The head-row link is "All industries →" to `/#industries`.

### Desktop interaction
| Input | Behaviour |
|---|---|
| Mouse enters a trigger | Opens that panel after **90ms** (hover intent). If a panel is already open, switches **immediately**. |
| Mouse enters a plain nav link (Work, Playbooks, Essays, Contact) | Closes the open panel after 120ms. |
| Mouse leaves the header (bar and panel together) | Closes after **180ms**. Re-entering cancels the close. |
| Click a trigger | Toggles that panel. Clicking the open trigger closes it, and touch laptops rely on this. |
| Click outside the header | Closes. |
| `Escape` | Closes, and returns focus to the trigger that opened it. |
| Panel switch | Content swaps in place. The panel shell stays open with no re-animation. |

There is no gap between a trigger and its panel: the trigger fills the bar height and the panel starts at the bar's bottom edge, so the pointer never leaves the hover zone.

---

## Phone and tablet (< 1024px)

### Breakpoints
| Width | Layout |
|---|---|
| ≥ 1024px | Desktop bar and dropdowns |
| 600–1023px | Compact bar: logo, "Book an audit" pill, Menu button |
| < 600px | Compact bar: logo and Menu button only. "Book a two-week audit" lives in the sheet footer. |

The prototype measures the header's own width (ResizeObserver). In production, use CSS media queries at `1024px` and `600px`; JavaScript is only needed for open and close state.

### Compact bar (screenshot 05)
- Height 68px, padding `0 20px`, flex, gap 10px.
- Logo, a flexible spacer, the optional "Book an audit" pill, then the Menu button.
- **"Book an audit" pill (≥ 600px):** height 40px, padding `0 16px`, radius 999px, 1px line border, white, 14px.
- **Menu button:** height **44px** (minimum touch target), padding `0 16px 0 18px`, radius 999px, gap 10px, 14.5px.
  - Closed: white background, 1px line border, ink text, label **"Menu"**.
  - Open: `#1A1917` background and border, white text, label **"Close"**.
  - Background and colour transition 180ms.
  - **Icon:** a 14 × 10px box holding two 1.5px bars in `currentColor`, with rounded ends. Closed, the bars sit at top 1.5px and 7px. Open, both move to top 4.25px and rotate +45° and −45° to form an ×. Transition 220ms on `top` and `transform`.

### Sheet (screenshot 06)
- `#mobile-menu`, absolutely positioned under the bar (`top: 100%` plus 1px), full width, **height `calc(100dvh − 69px)`**, background page colour, flex column.
- **Open:** opacity 0 → 1 (200ms), `translateY(-8px)` → `0` (260ms `cubic-bezier(0.2,0.7,0.2,1)`). Visibility switches after 260ms on close.
- **Scroll area** (`<nav aria-label="Main">`): flex 1, `overflow-y: auto`, `overscroll-behavior: contain`, padding `4px 20px 28px`.
- **Accordion row (trigger):** full-width `<button>`, min-height 60px, 22px, −0.026em, ink, with a bottom rule `rgba(20,20,18,0.09)`.
  - **Plus/minus icon:** 14 × 14px in secondary colour, made of two 1.5px bars. The vertical bar rotates 90° to read as "−" when open (220ms).
- **Expanded group** (screenshots 07, 08): padding-bottom 20px.
  1. Tagline: 14px, line-height 1.5, secondary.
  2. Items: rows with padding `12px 0` and a top rule `rgba(20,20,18,0.06)`, gap 12px. Title 16px, −0.012em. Description 13.5px, line-height 1.45, secondary.
     - AI Transformation items 1–4 show the mono step number (01–04) in a 22px column. Items 5–6 (Integration, Control) have no number.
     - Industries items show a **40px** watercolour thumbnail (radius 9px).
  3. An overview pill link: height 40px, padding `0 16px`, radius 999px, 1px line border, white, 14px. "AI Engineering overview →" · "AI Transformation overview →" · "All industries →".
- **Only one group open at a time.** Opening a group closes the others. Tapping the open group closes it.
- **Plain links** below the groups: Work, Playbooks, Essays, Contact. Same row style as the accordion triggers (min-height 60px, 22px), with no icon.
- **Pinned footer:** flex none, `border-top: 1px solid rgba(20,20,18,0.09)`, padding `14px 20px calc(16px + env(safe-area-inset-bottom))`, grid gap 12px.
  - "Book a two-week audit": full width, height 50px, radius 8px, ink background, white, 15px, weight 500. Links to `/ai-engineering#engagement`.
  - `hello@3264.ai`: centred, 13.5px, secondary, `mailto:`.

### Compact interaction
| Input | Behaviour |
|---|---|
| Tap Menu | Opens the sheet and **locks page scroll** (`overflow: hidden` on `<html>`). The sheet itself still scrolls. |
| Tap Close | Closes the sheet and restores scroll. |
| Tap any link in the sheet (including the logo) | Navigates and closes the sheet. For in-page `#anchors`, close first, then scroll. |
| `Escape` | Closes the sheet. |
| Viewport grows to ≥ 1024px while the sheet is open | Sheet closes and scroll unlocks. |
| Accordion state | Resets to all-collapsed each time the sheet opens. The prototype keeps it, but resetting is preferred. |

---

## Accessibility (required)
- **Disclosure pattern, not ARIA `menu`.** Triggers are `<button aria-expanded aria-controls="menu-…">`. Panels are regions of links. Do not use `role="menu"` or `menuitem`, because these are navigation links, not application menus.
- Keep panel content out of the tab order when closed: `visibility: hidden`, or `inert`, with `aria-hidden="true"`.
- **Desktop keyboard:**
  - Tab reaches each trigger. `Enter` or `Space` toggles its panel.
  - When open, Tab moves into the panel's links in reading order: head link, then columns left to right, then the card.
  - Tab past the last link closes the panel and moves on to the next trigger.
  - `Escape` closes and returns focus to the trigger.
- **Phone keyboard and screen reader:**
  - Menu button: `aria-expanded` and `aria-controls="mobile-menu"`. Its label changes between "Menu" and "Close".
  - When the sheet opens, move focus to the first accordion button and **trap focus** in the bar plus sheet. When it closes, return focus to the Menu button.
  - Accordion buttons carry `aria-expanded` and `aria-controls` pointing at their group region.
- **Hover is never required.** Every panel also opens by click or tap.
- **Touch targets:** the Menu button is 44px; accordion rows and plain links are at least 60px.
- **Reduced motion:** under `prefers-reduced-motion: reduce`, drop the translate and keep only a short (≤ 120ms) opacity fade, or none.
- **Current page:** add `aria-current="page"` to the matching nav link or trigger, and render it in ink colour (desktop) or weight 500 (sheet).
- Thumbnails and feature-card images are decorative (`aria-hidden="true"`, or CSS backgrounds).

---

## State
| State | Type | Notes |
|---|---|---|
| `openPanel` | `'engineering' \| 'transformation' \| 'industries' \| null` | Desktop |
| `menuOpen` | boolean | Compact |
| `openGroup` | same union as `openPanel` | Compact accordion, one at a time |
| hover timers | refs | 90ms open intent, 120ms and 180ms close delays. Clear them on unmount. |

**Prototype-only props, which production should not ship:** `forceLayout`, `forceOpen`, `hoverOpen`, `forceMenu`, `forceGroup` and `frameHeight` exist so the canvas can show fixed states inside fixed-size frames.

## Content source
All labels, descriptions, links and thumbnails are in **`menu-data.json`**. Render both the desktop panels and the phone accordions from that single source so they can't drift apart. The phone list for AI Engineering intentionally omits the "Built from playbooks" column, because Playbooks is a top-level link in the sheet.

## Route map (prototype file → suggested route)
| Prototype | Route |
|---|---|
| `3264 Home.dc.html` | `/` |
| `AI Engineering.dc.html` | `/ai-engineering` |
| `AI Transformation.dc.html` | `/ai-transformation` |
| `Private Credit.dc.html` | `/private-credit` |
| `Private Equity.dc.html` | `/private-equity` |
| `Work.dc.html` | `/work` |
| `Playbooks.dc.html` | `/playbooks` |
| `<Playbook>.dc.html` | `/playbooks/<slug>` (e.g. `/playbooks/loan-ops-ledger`) |
| `Essays.dc.html` | `/essays` |
| `Contact.dc.html` | `/contact` |

Anchor targets that must exist: `/ai-engineering#audit`, `#rebuild`, `#platform`, `#engagement`; `/ai-transformation#discover`, `#rewire`, `#run`, `#optimise`, `#integration`, `#control`, `#engagement`; `/#industries`. Give each one `scroll-margin-top: 68px` so the sticky header doesn't cover it.

## Assets
| File | Used for |
|---|---|
| `assets/valley-pastel.png` | AI Engineering feature card |
| `assets/playbooks/feat-nav-pack-review.png` | AI Transformation feature card |
| `assets/playbooks/feat-covenant-watch.png` | Industries feature card |
| `assets/playbooks/{loan-ops-ledger, covenant-watch, nav-pack-review, mandate-guardrails}.png` | Playbook thumbnails (28px) |
| `assets/playbooks/{covenant-watch, capital-call-flow, side-letter-register, mandate-guardrails}.png` | Industry thumbnails (52px desktop, 40px phone) |

Thumbnails display at ≤ 52px, so serve resized WebP or AVIF versions (for example 112px square at 2x), not the full-size sources. Feature cards display at about 340 × 236px, so serve those at around 720px wide.

## Rollout
1. Build `SiteHeader` and render it in the root layout, replacing the header on every page (34 at last count).
2. Remove the old nav's horizontal scroll and right-edge fade.
3. Pass the current route in so the right item shows as current.

## Open items
- **Fund Management** and **Asset Management** link to `/#industries` until their own pages exist.
- **Analytics:** consider tracking panel opens and item clicks; event names are your choice.
- Footer item "Field notes" is due to be renamed "Essays". This is out of scope here, but it is part of the same chrome release.
