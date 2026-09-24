# Visual QA — verifying the port against the design

You judge the port by comparing it with the reference, never by reading the spec from memory.
Every phase ends with the harness below.

## Serving both sides

```bash
npx serve design_handoff_private_credit/reference -l 4100    # reference
npm run dev                                                  # port on :3000
```

* Reference: `http://localhost:4100/Private%20Credit.dc.html`
* Port: `http://localhost:3000/industries/private-credit`

## Making captures deterministic

Both sides accept the same flags:

| Flag | Effect |
| --- | --- |
| `?t=16` | freezes the time-driven systems (hero ring, §04, §05) at t = 16s. At 16s the ring is resolved, all three servicing cards show "done", and investors is on Estree. |
| `?intro=off` | no intro overlay |
| `?motion=off` | (port only) stops the time loops at their initial frame. Use `?t=` instead for comparisons. |

Also launch Playwright with `reducedMotion: "reduce"`, which stops the `pcBlip` animation (mask
`[data-blip]` anyway), and wait ≥ 700ms after load and ≥ 900ms after each scroll. The module
syncs on a 400ms heartbeat, and screen changes fade in over 400ms.

Scroll-driven sequences are deterministic for a given scroll position and viewport. **Always
compare at identical viewport sizes.** The stages scale with the viewport, so a 1px difference
in viewport height moves everything.

## Viewports

| Viewport | Why |
| --- | --- |
| 1440 × 900 | primary; the threshold is strictest here |
| 1280 × 800 | smallest designed width |
| 1920 × 1080 | large; stages cap at 1200px and must centre |
| 1440 × 760 | short laptop; exercises `pinFit`, `cropOf`, `lpFitNow` and `dLayout` |
| 1024 × 768 | captured as a baseline for design review; not a pass/fail gate |

## Step 1: capture the design baseline (once)

```bash
npx tsx qa/capture-reference.ts
```

This writes `qa/reference-screens/<w>x<h>/`, with one PNG per static section and
`scrub/<section>-<p>.png` for every point in `qa/scrub-points.json`. Commit the output. Designers
review against these files, and the port is always diffed against the design, never against an
earlier port.

## Step 2: static sections

```bash
npx playwright test qa/visual.spec.ts
```

This covers the header, hero, both CTA bands, §04 servicing, §05 investors and the footer, at
1280, 1440 and 1920.

**Threshold:** `maxDiffPixelRatio` 0.01 at 1440, and 0.02 at 1280 and 1920, but inspect every
diff image by eye. Antialiasing noise is acceptable. A moved baseline, a changed colour or a
missing element is not.

## Step 3: pinned sequences

```bash
npx playwright test qa/scrub.spec.ts
```

For every point in `qa/scrub-points.json`, at all four gated viewports, this writes
`qa/__scrub__/<vp>/<section>-<p>.{ref,port,side}.png`. The `.side.png` shows reference on the
left and port on the right. It fails automatically only if the pin leaves `top: 68px`, so
**open every side-by-side and compare by eye.** For each point, the `expect` string in the JSON
says what must be on screen.

What must match at each point:
1. which elements are visible, and their opacity (a 0.5 vs 0.8 difference is a bug)
2. which screen, stage or beat is active: the sidebar row, counter value, ticks or lit plate
3. every number and string in the stage
4. position and size of the stage within the pin, including the crop at 1440×760
5. status colours (accent, warn, bad)

Also do a **manual slow scrub** through each pinned section, both down and up, watching for
jumps, two panels visible at once, flashes of empty hosts, and elements that fail to reverse.

## Step 4: time-driven loops

For §04, §05 and the hero ring, load both sides with each `?t=` value listed in specs 01, 05
and 06, and compare the section screenshots. Then load without `?t` and watch one full cycle
on each side next to each other (§05 is 28.2s). Phase offsets and pacing must match.

## Copy diff

The static markup and the module-built text must both match.

```ts
const text = (page) => page.evaluate(() => document.body.innerText.replace(/\s+/g, " ").trim());
```

Run it at each scrub point, because the module rebuilds text as you scroll. Assert port ===
reference. Because the port runs the same module, a difference in module-built text means the
module was edited or a ref points at the wrong host.

`_inventory.json → imperativeStrings` lists every string literal in the module that looks like
copy. Use it to search for a string you can't find in the markup.

## Computed-style spot checks

When a diff has no obvious cause, compare computed styles element by element:

```js
const pick = (el) => { const s = getComputedStyle(el);
  return { ff: s.fontFamily, fs: s.fontSize, fw: s.fontWeight, ls: s.letterSpacing, lh: s.lineHeight,
           c: s.color, bg: s.backgroundColor, m: s.margin, p: s.padding, b: s.borderTop,
           tr: s.transform, op: s.opacity }; };
```

Run the same selector on both sides and diff the objects. For module-built content, walk up
from the element to the host and compare each ancestor. The cause is almost always an inherited
property (font-family, font-size, line-height, letter-spacing) set on an ancestor in the port.

## Sign-off pack

At the end of Phase 5, produce `qa/SIGNOFF.md` with:
* the pass/fail table from `CHECKLIST.md`
* links to every `.side.png` at 1440×900
* any known deviation, with the reason and who accepted it
