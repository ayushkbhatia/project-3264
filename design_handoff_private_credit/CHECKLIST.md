# Checklist — Private Credit port

Mark every item pass or fail. A fail needs a written reason and an owner.

## Integrity
- [ ] `diff -r design_handoff_private_credit/motion src/motion` shows no changes (aside from an optional `.js`→`.jsx` rename of react.js)
- [ ] `window.__dcErrs` is undefined after scrolling top → bottom → top at 1440×900
- [ ] No console errors or warnings from `[motion]` or `[3264]`
- [ ] Every `ELEMENTS` name except `badgeA` is bound exactly once; `badgeA` is not rendered
- [ ] Hosts are empty in server HTML: pfSide, pfMain, pfRail, p2Side, p2Body, oCount, oField, oVig, servHost, lpHost, dStack, iStage, titleA, titleB, p2Title, p2Cap

## Foundation
- [ ] Body custom properties present: `--a --bad --warn --line --line2 --mut --sec --tex`
- [ ] `document.fonts.check('12px "IBM Plex Mono"')` and `('12px "Instrument Sans"')` are true
- [ ] Only one copy of each font file loads on the route
- [ ] `html, body { overflow-x: clip }`, not `hidden`; no `scroll-behavior: smooth`; no smooth-scroll library
- [ ] No heading heavier than 400
- [ ] Header 68px, sticky, blurred; "Industries" active
- [ ] Both CTA bands match (eyebrow, headline, button, note)
- [ ] Footer: five columns, Private Credit in ink, bottom bar with status dot

## Hero
- [ ] Two-layer wash with masks and scrims matches at 1280 / 1440 / 1920
- [ ] 32-column grid texture present and fading downward
- [ ] Equation band matches, including ∫ limits, the fraction rule, ⊕ in accent and `(1)` right
- [ ] Ring at `?t=1, 5, 10, 14, 26.7` matches the reference
- [ ] Ring stops drawing off-screen

## §01 Reality
- [ ] All 13 scrub points match at 1440×900, 1280×800, 1920×1080 and 1440×760
- [ ] Title words reveal and reverse; emphasis words italic and darker
- [ ] Windows z-order: xlsx on top; `#REF!` red; `52.1` outlined in accent
- [ ] The walk opens on Pipeline after scrolling back up
- [ ] Seven screens, each with the right sidebar row, table and rail

## §02 Platform
- [ ] All 14 scrub points match at all four viewports
- [ ] Stress numbers interpolate smoothly; rating flips once, at 72%
- [ ] Memo panels never overlap at full opacity
- [ ] Caption stays visible at 1440×760 (lifted by cropOf)

## §03 Origination
- [ ] All 6 scrub points match at all four viewports
- [ ] Counts are exact at the end of each stage: 248, 96, 61, 38, 24, 11
- [ ] Fail sweep runs left → right; pass pop visible
- [ ] Eleven survivors go live green in sequence
- [ ] Vignettes all the same height

## §04 Servicing
- [ ] `?t=16` matches at 1280 / 1440 / 1920
- [ ] Phase checks at `?t=0.2, 1.5, 3, 4.5, 5.8` match
- [ ] Out-of-phase cycling without `?t`; pauses off-screen

## §05 Investors
- [ ] `?t=` checks from spec 06 all match
- [ ] Headline + window fit one screen at 1440×900 and 1280×800
- [ ] Scale ≥ 0.62 at 1440×760

## §06 Delivery
- [ ] All 6 scrub points match at all four viewports
- [ ] Stage cells accumulate; stubs draw toward the stack
- [ ] Beat 5: plates close, CTA appears and is clickable only when visible
- [ ] `dInner` scale ≥ 0.94 at 1440×760; the stack pitch tightens instead
- [ ] "live platform" gradient text renders in Safari

## Intro
- [ ] Full sequence ≈ 5.3s; Variance ends at `0.00` in accent
- [ ] Click and any key skip it; nav link works on the first click afterwards
- [ ] Never shown with reduced motion or `?intro=off`
- [ ] Tears down under 6× CPU throttle

## Lifecycle
- [ ] React Strict Mode: exactly one rAF loop, one watchdog interval (`window.__pcWatch`), and one scroll listener after mount
- [ ] Navigate away → back: the same holds; no leaked intervals (check with the Performance monitor)
- [ ] Changing accent at runtime (if themed) updates `--a` and the live tile colour without a rebuild
- [ ] Background the tab for 30s, return: sequences resume at the correct scroll position

## Responsive
- [ ] ≥ 1280 matches the reference
- [ ] 1024: nothing overlaps; the stage scale is acceptable (screenshot attached for design)
- [ ] Header collapses below 1024 (pattern flagged for design review)
- [ ] CTA bands stack below 900 with no horizontal overflow
- [ ] Below 768: pinned sections gated to the fallback, ids preserved, listed as an open design item
- [ ] No horizontal page scroll at any width from 320 to 2560

## Accessibility
- [ ] One h1; section h2s in order; in-stage titles `aria-hidden`
- [ ] Stage hosts `aria-hidden`; §06 stage cells readable
- [ ] Reduced motion freezes the ring and the §04/§05 loops (`motion: false`)
- [ ] A pause control exists and works (or is listed as an open item)
- [ ] `dCta` link not focusable while hidden
- [ ] A visible focus ring on every link and button, on both light and dark grounds
- [ ] Intro overlay `aria-hidden`, not modal

## Performance
- [ ] LCP ≤ 2.5s, CLS ≤ 0.02, TBT ≤ 200ms (Lighthouse, desktop)
- [ ] Motion module not in any shared chunk
- [ ] No long tasks over 50ms while scrolling §03 at 4× CPU
- [ ] Idle at the footer: no per-frame work
- [ ] Images served as AVIF/WebP with responsive sizes

## Links to confirm before launch
- [ ] Every "Book a platform review" / "Start with the audit" target (currently `mailto:hello@3264.ai`)
- [ ] Footer: Evaluation suites, Security (→ `#servicing`), LinkedIn (currently `mailto:`)
- [ ] Footer industries other than Private Credit (→ Home `#industries`)
