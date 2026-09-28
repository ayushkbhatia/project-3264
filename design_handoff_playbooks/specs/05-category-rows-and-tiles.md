# 05 · Category rows and playbook tiles

Screenshots: `desktop-1440/05-private-credit.png`, `06-fund-management.png`, `07-asset-management.png`, `tablet-924/04-private-credit.png`, and `icon-set.png` for the nine icons.

Three sections, rendered from data (`data/playbooks.json`), shown only while browsing.

| Section id | H2 | Right link text | Link target |
|---|---|---|---|
| `private-credit` | Private Credit | How we work in Private Credit → | `/industries/private-credit` |
| `fund-management` | Fund Management | How we work in Fund Management → | `/#industries` (placeholder) |
| `asset-management` | Asset Management | How we work in Asset Management → | `/#industries` (placeholder) |

## Section layout
```
section#<id>  padding:96px 40px 0
└─ max-width:1280px; margin:0 auto
   ├─ header  display:flex; gap:12px 24px; flex-wrap:wrap; align-items:baseline; justify-content:space-between
   │   ├─ h2  margin:0; clamp(32px, 3.2vw, 46px); weight 400; -0.035em; line-height:1.05
   │   └─ a   14px; -0.01em; color:#55544E; hover #157F52; white-space:nowrap
   └─ grid    display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 300px), 1fr));
              gap:44px 28px; margin-top:36px
```
At 1440 this gives 3 columns of 408px. It wraps to 2 columns around ≤ 1030px of content width and to 1 column below ~630px.

## Playbook card (shared with Results)
```
card  display:flex; flex-direction:column; min-width:0
├─ tile  position:relative; aspect-ratio:2 / 1; border-radius:14px; overflow:hidden; background:#ECEAE5
│   ├─ <img src="playbooks/<slug>.png" alt="">  absolute; inset:0; width:100%; height:100%; object-fit:cover
│   └─ glass badge  height:34% (specs/00) with icons/<slug>.svg
└─ <a href="<playbook route>">  display:flex; flex-direction:column; gap:10px; padding-top:20px;
       color:#1A1917;  hover: color #157F52 (title and blurb both turn green)
    ├─ title  20px; -0.022em; line-height:1.2
    └─ blurb  15px/1.55; color:#55544E; text-wrap:pretty
```
- **Production improvement (no visual change):** make the whole card a single link (image included) with one accessible name, the playbook title. On hover the text turns green; add a subtle image treatment only if the codebase already has one. The prototype does not scale or zoom the image.
- Tile images are decorative (`alt=""`), since the title carries the meaning.

## Playbook data (order matters)
| Category | Playbook | Slug | Route |
|---|---|---|---|
| Private Credit | Covenant Watch | `covenant-watch` | `/playbooks/covenant-watch` (placeholder → category page) |
| Private Credit | Capital Call Flow | `capital-call-flow` | placeholder |
| Private Credit | Loan Ops Ledger | `loan-ops-ledger` | **`/playbooks/loan-ops-ledger` (live)** |
| Fund Management | NAV Pack Review | `nav-pack-review` | placeholder |
| Fund Management | Investor Reporting | `investor-reporting` | placeholder |
| Fund Management | Side-Letter Register | `side-letter-register` | placeholder |
| Asset Management | Mandate Guardrails | `mandate-guardrails` | placeholder |
| Asset Management | Client Reporting Flow | `client-reporting-flow` | placeholder |
| Asset Management | Research Intake | `research-intake` | placeholder |

In the prototype, a placeholder links to the playbook's category page (Private Credit → `/industries/private-credit`; the other two → `/#industries`). In production, use `/playbooks/<slug>` for every card. Until a detail page ships, redirect `/playbooks/<slug>` to the category page, so the link targets never need to change.

Blurbs are verbatim in `CONTENT.md`.
