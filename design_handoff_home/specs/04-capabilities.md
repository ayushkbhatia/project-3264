# Spec 04 — Capabilities `#capabilities`

The set piece. The behaviour is fully owned by `src/motion/platform-sequence.js`; this spec
covers only the markup contract and the mobile fallback. Read `ANIMATIONS.md` §2 before this.

## Section

`padding: 130px 0 0; border-bottom: 1px solid var(--line2)`. Note: no horizontal padding on
the section, because the pin is full-bleed. The header column adds `padding: 0 40px` itself.

SectionHeader: `02 / Capabilities` · `Three ways in. One accountable team.` ·
`Most firms arrive with a shortlist of ideas and no way to judge them. We start where the evidence is thinnest and stay until the system is in production and monitored.`

## DOM contract (≥ 768px)

Every name is a key passed to `bind()` from `useMotionSystem(PlatformSequence, { accent })`.

```
phTrack   div   position:relative; height:420vh; margin-top:56px
└ phPin   div   position:sticky; top:0; height:100vh; display:flex; align-items:center; overflow:hidden
                (initial values only; phLayout() rewrites top/height to sit BELOW the sticky header)
  └ phGrid div  width:100%; max-width:1280px; margin:0 auto; padding:0 40px;
                display:grid; grid-template-columns:minmax(0,0.86fr) minmax(0,1.14fr); gap:56px; align-items:center
    ├ LEFT div min-width:0
    │ ├ rail   display:grid; grid-template-columns:repeat(3,1fr)
    │ │ ├ phR0 data-act="0" onClick=phJump  "Assess"   (active)
    │ │ ├ phR1 data-act="1" onClick=phJump  "Build"
    │ │ └ phR2 data-act="2" onClick=phJump  "Run"
    │ └ panels  position:relative; min-height:390px; margin-top:40px
    │   ├ phP0 absolute inset-0                (visible)
    │   ├ phP1 absolute inset-0; opacity:0
    │   └ phP2 absolute inset-0; opacity:0
    └ phStage div  position:relative; width:100%; background:#FFF; border:1px solid var(--line)
      ├ phCv      canvas absolute inset-0 w/h 100%
      ├ phLabels  absolute inset-0; pointer-events:none; overflow:hidden
      ├ phSlot    display:none; absolute inset-0; flex column centred; gap 14; pointer-events:none
      │ ├ "Diagram slot" 12px/0.06em/uppercase/--mut
      │ └ track 180×2 rgba(20,20,18,0.10) └ phBar absolute left 0, width 0%, bg accent
      ├ phAssess  absolute; left:0; right:0; top:0; bottom:40px; opacity:0; display:flex; flex-direction:column; overflow:hidden   (EMPTY)
      ├ phBuildP  same                                                                                                            (EMPTY)
      ├ phRun     same                                                                                                            (EMPTY)
      ├ phTip     absolute left 0 top 0; opacity 0; pointer-events none; transform translate(-50%,-124%);
      │           bg #1A1917; color #F6F5F2; padding 9px 12px 10px; radius 5; nowrap;
      │           box-shadow 0 6px 22px rgba(20,20,18,0.18); transition opacity .16s ease
      └ footer  absolute bottom 0; flex space-between baseline; padding 0 20px 16px; 12px/0.05em/uppercase/--mut
        ├ phCap     "Workflow and data map"
        └ phMetric  "01 / 03"
```

`phStage` has no height in the markup. `phLayout()` sets it. Don't give it one.

`phLayout()` owns responsive layout for this section. Below 940px it switches the grid to a
single column with the stage first, shrinks gaps, and shortens the track to 380vh. It finds
the header with `document.querySelector("header")` to pin below it, so the port must render
exactly one `<header>` element before this section. Don't add CSS that competes with the
inline styles it writes (grid columns, gap, pin top/height, track height, stage height).

`phJump` is a method on the system instance. Wire the rail with
`onClick={bind.handler("phJump")}` (added to `motion/react.js`). It reads `data-act` from
`e.currentTarget`, so the attribute must be on the element carrying the handler.

## Rail tab styles

Base: `padding: 12px 14px 0 0; font-size: 12.5px; letter-spacing: 0.05em; text-transform: uppercase; cursor: pointer`.
Active: `border-top: 2px solid var(--a); color: #1A1917`. Inactive: `border-top: 2px solid var(--line); color: var(--mut)`; hover `color: #1A1917`.
The module switches these at runtime by writing inline styles. Render the initial state as
shown (Assess active) and **do not** control them from React state.
Make them `<button type="button">` with `aria-controls` for accessibility, with the reset
styles so they look identical.

## Left panels (static content, the module fades them)

Each panel: meta row (`display: flex; justify-content: space-between; align-items: baseline; max-width: 440px; 13px/-0.005em/--mut`;
number in `--a`) · h3 (act h3, `margin-top: 24px`) · p (`margin-top: 18px; max-width: 460px; 16.5px/1.58/--sec`) ·
ul (`margin-top: 30px; list-style: none; padding: 0; display: grid; gap: 10px; max-width: 440px; 14.5px; --list`),
each li `border-top: 1px solid var(--line2); padding-top: 10px`.

| # | Duration | Title | Body | List |
| --- | --- | --- | --- | --- |
| 01 | 2 weeks | Assess | A function-by-function audit of where documents, handoffs and exceptions consume time. Ends in a ranked use-case ledger with cost, risk and expected return per item. | Workflow and data mapping · Baseline instrumentation · Build / buy recommendation |
| 02 | 6–12 weeks | Build | A small senior squad ships the system into your environment: retrieval, extraction, review interface, audit trail. Priced per capability, released fortnightly. | Document and decision pipelines · Human-in-the-loop interfaces · Integration into systems of record |
| 03 | Ongoing | Run | Deployed systems drift. We hold the evaluation suite, watch accuracy and cost per run, and retrain as models and regulation move underneath them. | Evaluation and regression suites · Accuracy and spend monitoring · Model migration as the frontier moves |

`phLayout()` hides the `ul`s and drops the p to 15.5px when the left column is narrow.
Because it does this by walking the DOM, keep the structure exactly: meta div, h3, p, ul.

## The three stage panels

Built entirely by `phBuildAssess` / `phBuildCaps` / `phBuildRun` from the data functions
`phAudit()`, `phCaps()`, `phNights()`, `phRunNotes()`. To change content, edit those
functions. Never type rendered strings into JSX. Their visual design (type, rules, row
anatomy) is in the module source. The reference is the visual target; compare with scrub
captures.

## Mobile fallback (< 768px)

Between 768 and 940px the module's own narrow layout applies; keep it mounted. Below 768px
gate the mount with `matchMedia("(min-width: 768px)")` evaluated on the client (render nothing
for the track on the server, then pick after mount to avoid a hydration mismatch, or render
both and hide one with CSS `@media`, mounting the module only when the desktop branch is
visible).

Fallback markup (not in the reference, designed to its vocabulary):
- Three stacked blocks, `margin-top: 56px`, each `border-top: 1px solid var(--line); padding: 32px 0 40px`, inside the 40px (24px on phones) column.
- Each block contains the left-panel content above (meta row, h3, p, ul) at the same type
  styles, and nothing else. No stage, no canvas.
- Section keeps its bottom hairline.

Flag this to the designer for review; it is the one layout on the page not taken from the reference.
