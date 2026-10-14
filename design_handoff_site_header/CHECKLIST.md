# Acceptance checklist: Site header and menus

## Desktop (≥ 1024px)
- [ ] Bar is 68px, sticky, blurred translucent background, 1px bottom border
- [ ] Nav order: AI Engineering ▾, AI Transformation ▾, Industries ▾, Work, Playbooks, Essays, Contact
- [ ] Chevrons point down when closed and up when open, with a 200ms rotation
- [ ] Hover opens after about 90ms; moving between triggers switches panels instantly with no flicker
- [ ] Moving the pointer from a trigger down into its panel never closes it
- [ ] Leaving the header closes the panel after about 180ms; re-entering cancels the close
- [ ] Hovering Work, Playbooks, Essays or Contact closes an open panel
- [ ] Clicking a trigger toggles it; clicking outside closes it
- [ ] Escape closes the panel and returns focus to its trigger
- [ ] Panel fades and slides in (6px), with no layout shift beneath it
- [ ] Each panel matches screenshots 02, 03 and 04 (grid ratios, column labels, item hover fill `#F0EEE9`)
- [ ] Feature cards are fully clickable and the veil keeps their text legible
- [ ] Every link resolves; anchors land below the sticky header (`scroll-margin-top: 68px`)

## Phone and tablet (< 1024px)
- [ ] Bar shows the logo and Menu button; "Book an audit" pill appears only from 600px
- [ ] Menu button is 44px tall, and morphs to a dark "Close" with an ×
- [ ] Sheet fills `100dvh − 69px`, scrolls internally, and doesn't scroll-chain to the page
- [ ] Page behind the sheet can't scroll while it's open; scroll is restored on close
- [ ] Only one accordion is open at a time; the + becomes − when open
- [ ] AI Transformation shows 01–04 numbers on the four programme steps only
- [ ] Industries rows show 40px thumbnails
- [ ] Each group ends with its overview pill
- [ ] Footer CTA is pinned, full width, 50px, and clears the iOS home indicator (`safe-area-inset-bottom`)
- [ ] Tapping any link closes the sheet
- [ ] Rotating or resizing to ≥ 1024px with the sheet open closes it and unlocks scroll
- [ ] Matches screenshots 05–09

## Accessibility
- [ ] Triggers use `aria-expanded` and `aria-controls`; no `role="menu"`
- [ ] Closed panels and the closed sheet are not focusable (`inert` or `visibility: hidden`)
- [ ] Focus is trapped in the open sheet and returns to Menu on close
- [ ] Keyboard-only users can reach every link
- [ ] `aria-current="page"` is set on the active section
- [ ] Reduced-motion users get no slide, only a short fade or none
- [ ] Text contrast is at least 4.5:1 throughout, including feature-card text over images

## Performance
- [ ] Thumbnails are served resized (about 112px at 2x); feature images at about 720px wide
- [ ] Panel images load lazily on first open, or are preloaded on first trigger hover
- [ ] No layout shift (CLS) on load from the header

## Rollout
- [ ] One shared `SiteHeader` component, rendered from `menu-data.json`
- [ ] Replaces the header on all pages; the old horizontal-scroll nav and fade are removed
