# Handoff: Essays (index + 15 essay pages)

## Overview
Essays is 3264.ai's library of field notes: articles that aren't playbooks, written for the executives, operators and engineers building AI systems at banks, fund managers and asset managers. This bundle covers two templates:

1. **Essays index** (`/essays`): the master page, with a title, category filters, a lead essay, a "start here" pair and the full numbered list of fifteen essays.
2. **Essay page** (`/essays/[slug]`): one long-form article with a sticky contents sidebar, a reading-progress bar, numbered references and a sources list.

The content is final: fifteen drafts dated 29 September 2026, in `content/field-notes-drafts.md`. Build both templates from that content, not from hard-coded markup.

## About the design files
The files in this bundle are **design references created in HTML**. They're prototypes that show the intended look and behaviour, not production code to copy. Your task is to **recreate these designs in the target codebase's existing environment**, using its established framework, component patterns and styling approach. If there's no environment yet, use a static-first React framework such as Next.js or Astro, with essays as an MDX/Markdown content collection.

Every `.dc.html` file opens directly in a browser when `support.js` sits next to it. Serve the folder locally so the relative `assets/` paths resolve. All styles are inline, so you can read exact values straight from the markup. Page logic is the `class Component` script at the bottom of each file.

## Fidelity
**High-fidelity.** Colours, typography, spacing, radii, copy and interactions are final. Recreate them pixel-accurately with the codebase's own primitives. Where this README and the HTML disagree, the HTML wins.

## Files in this bundle
| Path | What it is |
|---|---|
| `README.md` | This spec |
| `copy-deck.md` | Every fixed UI string on both templates (essay titles and summaries live in `data/essays.json`) |
| `data/essays.json` | Metadata for all fifteen essays: number, slug, title, summary, category, read time, image, related playbook, featured slots |
| `content/field-notes-drafts.md` | The source content: all fifteen articles with their sections, tables, code and numbered sources. Part 1 is editorial notes; don't publish it |
| `Essays.dc.html` | Index prototype |
| `Essay 01 - … .dc.html` to `Essay 15 - … .dc.html` | All fifteen essay pages, generated from the same template. 01 (a table), 03 (numbered sections) and 13 (a table and JSON code) cover every block type |
| `support.js` | Runtime for opening the prototypes |
| `assets/playbooks/*.png` | The fifteen watercolour images, one per essay |
| `assets/subscribe-wash.png`, `assets/valley-pastel.png` | Sign-up card and closing panel backgrounds |

Links to playbook pages, Home and AI Engineering point to files outside this bundle, so they'll 404 when you browse it locally.

---

## Shared foundations

### Tokens
| Token | Value | Use |
|---|---|---|
| paper | `#F6F5F2` | Page background |
| ink | `#1A1917` | Headings, links, selected chip, dark band |
| ink-2 | `#2C2B27` | Body text |
| secondary | `#55544E` | Summaries, secondary text |
| muted | `#6E6D67` | Meta rows, numbers, labels |
| faint | `#8A887F` | Empty states |
| hairline | `#E8E5DF` | Rules inside articles |
| line | `rgba(20,20,18,0.13)` | Index hairlines, chip borders, buttons |
| line-2 | `rgba(20,20,18,0.075)` | Header border, closing border |
| tile | `#FBFAF8` | Cards |
| wash | `#EEEBE4` | Active contents item, sidebar card |
| code-bg | `#EFEDE8` | Inline code |
| accent | `#157F52` | Hover, reference links, progress bar, Subscribe |
| accent-hover | `#0F6A43` | Subscribe hover |
| success | `#6FCF97` | Sign-up confirmation dot |
| image placeholder | `#E2DFD8` | Shown under images while they load |

On `body`: `--a:#157F52; --bad:#C4341E; --line:rgba(20,20,18,0.13); --line2:rgba(20,20,18,0.075); --mut:#6E6D67; --sec:#55544E`.

- **Links:** inherit their colour with no underline, and turn `var(--a)` on hover.
- **Selection:** `var(--a)` background with white text.
- **Page:** `html, body { overflow-x: clip }`.

### Type
- **Fonts:** Instrument Sans (400, 500, 600 and 400 italic), falling back to "Helvetica Neue", Helvetica, sans-serif. IBM Plex Mono (400 and 500) for numbers, essay numbers, dates and reference marks.
- **Rendering:** antialiased, with `text-rendering: optimizeLegibility`.
- **Wrapping:** headings use `text-wrap: balance`; paragraphs use `text-wrap: pretty`.

### Header (shared site chrome)
- **Container:** sticky (`top: 0; z-index: 100`), background `rgba(246,245,242,0.78)`, `backdrop-filter: blur(14px)`, bottom border `1px solid var(--line2)`.
- **Row:** max-width 1280px, padding 0 40px, height 68px, flex, gap `clamp(20px, 3vw, 48px)`.
- **Logo:** "3264.ai", 19px, weight 500, letter-spacing -0.03em.
- **Nav:** AI Engineering · AI Transformation · Industries · Work · Playbooks · **Essays** · Company.
  - Styles: `flex: 1`, gap `clamp(14px, 1.9vw, 30px)`, font-size `clamp(13px, 1.5vw, 14px)`, colour `var(--sec)`, `white-space: nowrap`, `min-width: 0`.
  - When the links don't fit, the nav scrolls sideways inside its own box: `overflow-x: auto; scrollbar-width: none`, a 28px right padding, and `mask-image: linear-gradient(90deg, #000 calc(100% - 28px), transparent)`.
  - The current item is ink. Essays is current on both templates.
  - Recommendation: in production, replace the nav with a compact "Menu" control below about 900px.
- **Header button:** "Book an audit", `flex: none; white-space: nowrap`, 36px tall, padding 0 16px, border `1px solid var(--line)`, radius 6px, white background, 13.5px. Hover turns the border and text `var(--a)`. Links to AI Engineering `#engagement`.

### Footer
Site-standard footer, the same as the Playbooks page. Its spec is in `design_handoff_playbooks`.

The Resources column still says "Field notes". Point it at `/essays`.

---

## Template 1: Essays index (`Essays.dc.html`)
```
Header
Essays header ── H1 · description · filter chips with counts · hairline
Lead essay ───── No. 11 (image 16:10 │ meta · title · summary · "Read the essay →")
Start here ───── hairline · No. 03 │ No. 12 (two cards)
All essays ───── sticky label + count │ numbered list 01–15
Sign-up card · Closing panel · Footer
```

### 1. Essays header (`#top`)
- **Section:** padding 88px 40px 0, inner max-width 1280px.
- **H1:** "Essays", `clamp(44px, 5.4vw, 76px)`, weight 400, letter-spacing -0.04em, line-height 1.
- **Description:** margin-top 18px, max-width 640px, `clamp(16.5px, 1.4vw, 19px)`/1.5, `#55544E`.
- **Filter chips:** margin-top 36px, flex-wrap, gap 6px, padding-bottom 20px, with a bottom border `1px solid var(--line)`.
  - Order: All 15 · Engineering 8 · Strategy 4 · Governance 1 · Product 1 · Operations 1.
  - Each chip is a `<button>` with `aria-pressed`: inline-flex, gap 7px, 34px tall, padding 0 14px 0 15px, radius 999px, 13.5px, letter-spacing -0.01em. Background and colour transition over 160ms.
  - The count is mono 11px.
  - Selected: `#1A1917` background and border, white text, count `rgba(255,255,255,0.7)`.
  - Unselected: white background, border `rgba(20,20,18,0.13)`, ink text, count `#6E6D67`.
  - Derive the counts from the collection.

### 2. Lead essay (shown only when the filter is "All")
- **Section:** padding 40px 40px 0.
- **Link:** the whole block is one link, max-width 1280px, flex-wrap, gap 28px 56px, `align-items: center`, hover colour `var(--a)`.
- **Image:** `flex: 1.25 1 520px`, `aspect-ratio: 16/10`, radius 20px, cover.
- **Text block** (`flex: 1 1 380px`):
  - Meta row (see "Meta row" below).
  - Title: margin-top 16px, `clamp(30px, 3.2vw, 46px)`, letter-spacing -0.036em, line-height 1.04.
  - Summary: margin-top 16px, 17px/1.55, `#55544E`.
  - "Read the essay →": margin-top 24px, 14px, 1px bottom border `rgba(20,20,18,0.35)`, padding-bottom 2px.
- **Current lead:** No. 11, "Why document extraction pilots stall at 80% accuracy" (`lead: true` in the data).

### 3. Start here (shown only when the filter is "All")
- **Section:** padding 64px 40px 0. The inner row has a top border `1px solid var(--line)`, padding-top 40px, flex-wrap and gap 40px.
- **Cards:** two, each a link (`flex: 1 1 420px`).
  - Image: `aspect-ratio: 16/9`, radius 16px.
  - Meta row at margin-top 18px.
  - Title: margin-top 10px, `clamp(22px, 2.1vw, 28px)`, letter-spacing -0.028em, line-height 1.15.
  - Summary: margin-top 10px, max-width 560px, 15.5px/1.55, `#55544E`.
- **Current pair:** No. 03 and No. 12 (`startHere: true`). The drafts mark them, together with No. 11, as planned home-page field notes.

### 4. All essays
- **Section:** padding 88px 40px 0, inner max-width 1280px, flex-wrap, gap 4px 48px.
- **Label column** (`flex: 0 0 200px`): sticky (`top: 96px`, padding-top 20px).
  - H2: "All essays", or the selected category's name. `clamp(26px, 2.4vw, 34px)`, weight 400, letter-spacing -0.03em.
  - Count: "15 essays" or "1 essay", mono 11.5px `#6E6D67`, margin-top 8px.
- **List** (`flex: 1 1 560px`): bottom border `1px solid var(--line)`. All fifteen essays in number order, including the three featured above, because this is the complete index.
- **Row:** each row is a link with flex-wrap, gap 16px 28px, padding 24px 0, top border `1px solid var(--line)` and hover colour `var(--a)`.
  - Image: `flex: 0 0 clamp(150px, 20vw, 232px)`, `aspect-ratio: 16/10`, radius 14px.
  - Text (`flex: 1 1 320px`): the meta row, then the title, then the summary.
  - Title: margin-top 10px, `clamp(20px, 1.9vw, 24px)`, letter-spacing -0.024em, line-height 1.2.
  - Summary: margin-top 8px, max-width 620px, 15px/1.55, `#55544E`.
- **Narrow screens:** the text wraps under the image without media queries, and the label column stacks above the list.

### Meta row (index)
- **Layout:** flex-wrap, gap 6px 12px, 12.5px `#6E6D67`.
- **Items:**
  - "No. 11" in mono 11.5px ink
  - the category
  - "6 min read"
- **No dates on the index.** All fifteen drafts share one date, so the essay number takes its place.

### 5. Sign-up card
- **Section:** padding 96px 40px 0, max-width 1280px.
- **Card:** radius 20px, overflow hidden, padding `clamp(28px,3vw,40px)`, white text, fallback colour `#B8321F`.
  - Background: `assets/subscribe-wash.png` (cover, centre 30%).
  - Veil: `linear-gradient(100deg, rgba(74,16,10,.62) 0%, rgba(74,16,10,.34) 55%, rgba(74,16,10,.06) 100%)`.
- **Title:** "Get new essays by email", 24px, letter-spacing -0.025em, `text-shadow: 0 1px 14px rgba(74,16,10,.35)`.
- **Line:** 15px, `rgba(255,255,255,.92)`.
- **Form:** margin-top 24px, max-width 480px, padding 5px, radius 10px, white.
  - Email input: 42px tall, no border, 15px, required.
  - Subscribe button: 42px tall, padding 0 20px, radius 7px, `#157F52` (hover `#0F6A43`), white 14.5px weight 500.
- **On submit:** the form is replaced by an 8px `#6FCF97` dot and "You are on the list." The prototype sends nothing; wire it to your newsletter provider and add an error state.

### 6. Closing
- **Section:** padding 118px 40px, bottom border `var(--line2)`.
- **Panel:** max-width 1280px, border `1px solid var(--line)`, radius 20px, padding `clamp(48px,6vw,88px) clamp(32px,5vw,72px)`, flex-wrap, gap 48px, `align-items: flex-end`.
  - Background: `assets/valley-pastel.png` (centre 60%, cover).
  - Veil: `linear-gradient(180deg, rgba(248,246,240,.7) 0%, rgba(248,246,240,.5) 60%, rgba(248,246,240,.35) 100%)`.
- **Text:**
  - Label "Start": 13px `#2C2B27`.
  - H2: margin-top 22px, max-width 760px, `clamp(32px,3.6vw,52px)`, weight 400, letter-spacing -0.035em, line-height 1.04.
  - Paragraph: margin-top 20px, max-width 560px, 16.5px/1.6.
- **Button:** "Book a two-week audit", 46px tall, padding 0 24px, ink background, white 15px weight 500, radius 6px. Links to AI Engineering `#engagement`.

### Index behaviour
- **Filtering:** a chip sets the category. "All" shows the lead, Start here and all fifteen rows. Any other category hides the lead and Start here and shows only matching rows, with the label and count updated. Syncing to `?category=` is optional.
- **Hover:** links and cards turn their text `var(--a)`. Images don't change.
- **Responsive:** layout is flex-basis only. Check at 390, 768, 1024 and 1440px. **Nothing may scroll sideways at any width.**
- **Accessibility:** each row and card is one link named by its title. Images are decorative on the index (`aria-hidden`). Chips expose `aria-pressed`.

---

## Template 2: Essay page (`Essay NN - … .dc.html`)
It's built on the playbook article shell.
```
Header (+ 2px reading-progress bar)
┌ max-width 1048px ───────────────────────────────────────────────┐
│ Sidebar 200px (sticky) │ gap 88px │ Main, max-width 680px        │
│ ← All essays           │          │ Hero · image · intro         │
│ On this page (contents)│          │ Sections (H2) · mid band     │
│ CTA card               │          │ Related playbook · Sources   │
└──────────────────────────────────────────────────────────────────┘
More essays (3 cards) · Closing panel · Footer
```

### Shell (same as the playbook pages)
- **Wrapper:** max-width 1048px, padding `0 clamp(20px,4vw,40px)`, flex, gap 88px. Main column: `max-width: 680px; padding-top: 60px`.
- **Reading-progress bar:** 2px, `#157F52`, on the header's bottom edge. `transform: scaleX(scrollY / (docHeight − viewportHeight))`.
- **Sidebar** (viewport ≥ 1048px):
  - Layout: `flex: 0 0 200px`, sticky (`top: 40px`), `max-height: calc(100vh − 40px)`, scrollable, padding 60px 0 32px.
  - "← All essays": 13.5px `#55544E`, links to `/essays`.
  - "On this page" label: mono 10.5px uppercase, letter-spacing 0.08em, `#6E6D67`.
  - Contents: Overview, then one item per section (numbered sections show their mono number), then Sources.
    - Items: 13px, padding 6px 10px, radius 7px. The active item has background `#EEEBE4`. Items up to the active one are ink; later items are `#6E6D67`.
    - A 1.5px coverage rail runs down the left edge: track `#E8E5DF`, ink fill that grows with reading.
  - CTA card: `#EEEBE4`, radius 12px, padding 18px. Text "Questions about this essay? Talk to the team." 14.5px, then a full-width ink button, 36px tall.
- **Below 1048px:** a sticky "On this page" bar sits under the header (44px), with a dropdown panel. "← All essays" moves to the top of the hero.
- **Scroll-spy:** the activation line is `min(170px, 30% of viewport height)` from the top. Recompute on scroll (via requestAnimationFrame), on resize and when the main column resizes.
- **Anchors:** smooth scrolling, turned off under `prefers-reduced-motion`. Sections and sources use `scroll-margin-top: 120px`.

### Hero
- **Eyebrow:** "Essay · {Category}", 13px `#55544E`. The category links to `/essays` and has a 1px underline.
- **H1:** margin-top 14px, `clamp(34px, 3.8vw, 48px)`, weight 400, letter-spacing -0.038em, line-height 1.02.
- **Summary:** the italic summary line from the drafts, shown upright. Margin-top 16px, `clamp(16.5px,1.4vw,18.5px)`/1.45, `#55544E`.
- **Meta row:**
  - Layout: margin-top 22px, padding-top 12px, top border `#E8E5DF`, 12.5px `#6E6D67`.
  - Items: "29 September 2026" · "N min read" · "Copy link".
  - Read time is the main column's word count without figures, divided by 230 and rounded up to at least 1.
  - "Copy link" sits on the right, copies the URL and shows "Link copied" for 1.8s.
- **Byline:** margin-top 26px.
  - A 36px ink circle containing "3264" in mono 10px, `#F4F3F0`.
  - Beside it, "3264.ai" (14px) over "Field notes · No. NN" (12.5px `#6E6D67`).
- **Hero image:** margin-top 32px, `aspect-ratio: 16/9`, radius 16px, border `1px solid rgba(20,20,18,.06)`. Use the same image as the index.

### Body blocks (Markdown → components)
| Markdown | Render |
|---|---|
| Text before the first `###` | Intro section (padding-top 40px). The first paragraph is the lede: 19px/1.65 ink |
| `### Heading` | A section: padding-top 64px, `<h2>` `clamp(24px,2.3vw,30px)`, weight 400, letter-spacing -0.028em, line-height 1.15. For `### 1. Ownership`, show "01" above the heading (mono 11.5px `#6E6D67`, margin-bottom 10px) and drop the number from the heading |
| Paragraph | margin-top 18px, 17px/1.75, `#2C2B27` |
| `- item` | `<ul>`: margin-top 18px, padding-left 20px, gap 10px, 17px/1.7. Nested items: 16px, gap 6px |
| `1. item` | `<ol>` without native markers: each `<li>` is flex, gap 14px, with a zero-padded number ("01") in mono 12px `#6E6D67` in a 24px column, then the text at 17px/1.7 |
| `**bold**` / `*italic*` | weight 500 ink / italic |
| `` `code` `` | mono 0.86em, padding 1px 4px, radius 4px, background `#EFEDE8` |
| `[n]`, `[n, m]` | Superscript reference links: mono 10px, `#157F52`, comma-separated, linking to `#ref-n`. Remove the space before the bracket |
| Table | A figure panel (below): header cells 11.5px weight 500 `#55544E` with a 1px ink bottom border; cells 13.5px/1.5 with a hairline `#E8E5DF` under each row; the first column is weight 500 ink. Inside the panel, the table scrolls sideways with `min-width: min(680px, columns × 180px)` |
| Code fence | A figure panel holding the code in mono 11.5px/1.7 with `white-space: pre` and its own sideways scroll |
| `---` | Not rendered |

**Figure panel:**
- Outer: margin-top 32px, radius 16px, padding 12px, border `1px solid rgba(20,20,18,.06)`. Background: the essay's image under a paper veil, `linear-gradient(rgba(251,250,248,.72), rgba(251,250,248,.72))`.
- Inner sheet: padding 14px 16px 8px, radius 11px, `rgba(255,255,255,.93)`, shadow `0 12px 32px -20px rgba(20,20,18,.3)`.

### Inline calls to action
- **Mid-article band:** appended to the end of the middle section (section index `floor(n/2) − 1`).
  - Box: margin-top 44px, padding 22px 24px, radius 16px, ink background, text `#F4F3F0`.
  - Title "Talk to the team", 18px. Sub-line 13.5px at 80% white.
  - Button: 40px tall, `#F4F3F0` background, ink text, label from `ctaLabel` (default "Book a mapping session"). The prototype links to a `mailto:`; replace it with the booking URL.
- **Related playbook card:** at the end of the last section.
  - Link card: margin-top 40px, flex-wrap, gap 16px 22px, padding 14px, border `#E8E5DF`, radius 16px, background `#FBFAF8`. Hover darkens the border to `rgba(20,20,18,.3)`.
  - Thumbnail: 164×88, radius 11px, using the playbook's own image, with a frosted-glass badge holding the playbook's icon.
    - Badge: `rgba(250,249,246,.62)` with `backdrop-filter: blur(18px) saturate(1.3)`, a white 72% border and radius 28%.
    - Icon: a 48×48 monoline SVG, stroke 2.
  - Text: "Related playbook · {Industry}" 12px, the playbook name 16px, its one-liner 13.5px, then "Read the playbook →".
  - The mapping is in `data/essays.json` (`related`). The nine icons are in `design_handoff_playbooks/icons/`.

### Sources (`#sources`)
- **Section:** padding-top 72px. H2 "Sources": 19px, weight 500.
- **List:** `<ol>` with a top border `1px solid #1A1917`.
- **Items:** each `<li id="ref-n">` is flex, gap 14px, padding 12px 0, with a hairline bottom border.
  - Number: mono 11px `#6E6D67`, 22px column.
  - Text: 13.5px/1.6 `#55544E`, `overflow-wrap: anywhere`.
  - Links: the `<url>` at the end of each source becomes a link that shows only the host name (e.g. "arxiv.org"), underlined at 30% ink.

### After the article
- **More essays:**
  - Container: max-width 1048px, padding-top 120px.
  - Heading row: H2 "More essays", `clamp(22px,2.2vw,28px)`, with "All essays →" on the right.
  - Cards: three, in an `auto-fit minmax(min(100%,280px),1fr)` grid.
    - Image: 16:10, radius 14px.
    - "No. NN · Category": 12px `#6E6D67`.
    - Title: 17.5px.
    - Summary: 13.5px `#55544E`.
  - Selection: other essays in the same category first, then the following numbers, wrapping round to the start.
- **Closing panel:** the same as the index, but the H2 reads "Bring one process. We will measure it.", the line reads "Thirty minutes on one workflow: where its errors come from today, and what a harness would check.", and the button is ink, 42px tall.
- **Footer:** site standard.

---

## Content model
`data/essays.json` holds one object per essay:

| Field | Example | Notes |
|---|---|---|
| `num` | "11" | Two digits. Shown as "No. 11" |
| `slug` | "why-document-extraction-pilots-stall-at-80-accuracy" | Route `/essays/[slug]` |
| `title` | "Why document extraction pilots stall at 80% accuracy" | Sentence case, verbatim from the drafts |
| `dek` | one sentence | The italic summary line under each heading in the drafts |
| `category` | "Strategy" | Engineering · Strategy · Governance · Product · Operations |
| `readMinutes` | 6 | Taken from the drafts' meta line; recompute from the body in production |
| `date` | "2026-09-29" | The drafting date. Replace with real publish dates when scheduled |
| `image` | "assets/playbooks/feat-capital-call-flow.png" | 16:10 on the index and 16:9 on the page. Every essay has a distinct image |
| `related` | "Covenant Watch" | The related playbook card |
| `lead` / `startHere` | boolean | Index featured slots |
| `prototypeFile` | "Essay 11 - Why extraction pilots stall.dc.html" | The reference page in this bundle |

**Parsing the drafts.** Each article in `content/field-notes-drafts.md` follows this pattern:

```
## NN. Title
*Summary*
Category · N min read · N words
…body with ### sections…
#### Sources
1. Reference text. <url>
```

Convert each article to one MDX file whose frontmatter matches the fields above, or parse the file at build time.

## Content rules
- Use the text verbatim; it has been through editorial review. Don't add claims, figures, client names or results.
- **Before publishing**, work through the drafts' own checklist (Part 1, "Before publishing"):
  - Run the name check on the fictional entities.
  - Confirm each "we recommend" and "our approach" line.
  - Verify the uncited Anthropic text-editor claim in No. 10.
  - Re-check regulatory dates.
  - Route the EU AI Act and DORA wording through legal review.
- Part 1 of the drafts file is internal notes; don't publish it.
- Avoid "AI-powered", "real-time", "hallucination-free" and "autonomous agents".

## Open items for 3264
- Publish dates. All essays currently share 29 September 2026. With real dates, consider grouping the list by year or month.
- A newsletter provider for the sign-up.
- A booking URL to replace the `mailto:` links.
- Footer: rename "Field notes" to "Essays" and link it to `/essays`.
- A compact header "Menu" below about 900px (see Header).
