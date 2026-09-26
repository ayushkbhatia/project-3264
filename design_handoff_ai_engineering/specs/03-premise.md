# 03 · 01 Premise (pinned, 760vh)

Markup `reference/sections/03-premise.html`. Motion `ANIMATIONS.md` §4.

## Markup

Header row (`display:flex; gap:72px; flex-wrap:wrap; align-items:flex-end`): "01 / Premise" + h2 "Two things
changed.<br>One thing did not." (margin-top 22px); lead right (`flex:2 1 460px; max-width:560px; 16.5px;
line-height:1.6; color:var(--sec)`): "We do not tell executives to stop building. The instinct is right and the
artefacts are useful. They are drafts, and drafts need an engineer before they hold client money."

Pinned-stage pattern (`stackTrack` 760vh, stage max-height 780px), three cards `position:absolute; inset:0`
stacked in DOM order, each: `overflow:hidden; border:1px solid var(--line); padding:clamp(32px,4.4vw,64px);
display:flex; gap:clamp(24px,3.4vw,56px); align-items:stretch; flex-wrap:nowrap; transform-origin:left center;
will-change:transform; box-shadow:-18px 0 48px rgba(20,20,18,0.16)`. Left column (`flex:1 1 300px;
justify-content:center; gap:32px`): mono label + statement `<p>` of word spans. Right column (`*Fit`,
`flex:1.1–1.15 1 380px; position:relative`) with a fixed-size `*Stage`.

| Card | Background | Statement | Stage |
| --- | --- | --- | --- |
| What changed | `#EEF0E6 url(what-changed-wash.png) center / cover` | "Building software now takes an afternoon. Your analysts already have." | 600×470 "AI app builder — recon-tool" chat |
| What that produced | `#F4A27A url(what-produced-wash.webp) center / cover` | "Those tools hold LP data. None of them were secured, tested or handed over." | 760×600 "LP Portal — Northgate Capital", then "Network — LP Portal" (5 issues) |
| What did not change | `#E8E2D2 url(valley-pastel.png) center 70% / cover` + veil `linear-gradient(180deg, rgba(248,246,240,0.7), rgba(248,246,240,0.42) 60%, rgba(248,246,240,0.2))` | "Your LPs, regulator and auditor expect the same controls as before. We bring software up to that standard." | 700×560 "Obligations — LP Portal", "3 of 3 apply" |

Word spans `<span style="opacity:0.16 | 0.2">{word} </span>` with the trailing space inside. All window
content (chat, the credential string, LP table, inspector rows, obligations, yellow marks) is verbatim in the
section file.

## Gate

At m = .10, .33, .50, .60, .69, .90 the port matches (see `qa/scrub-points.json`).
