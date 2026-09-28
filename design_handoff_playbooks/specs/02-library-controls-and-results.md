# 02 · Library controls, filtering and results

Screenshots: `desktop-1440/02-library-carousel-slide-1.png` (browsing), `states/s01-filter-private-credit.png`, `states/s02-search-one-result.png`, `states/s03-search-no-results.png`.

## Library bar (`section#library`)
```
section#library  padding:64px 40px 0; scroll-margin-top:68px
└─ bar  max-width:1280px; margin:0 auto; display:flex; gap:20px; flex-wrap:wrap;
        align-items:center; justify-content:space-between;
        padding-bottom:20px; border-bottom:1px solid rgba(20,20,18,0.13)
    ├─ chips  display:flex; gap:6px; flex-wrap:wrap
    └─ search label  position:relative; display:flex; align-items:center; width:min(100%, 320px)
```

### Filter chips
There are four `<button type="button">` chips: **All**, **Private Credit**, **Fund Management**, **Asset Management**. Exactly one is active. The default is All.

| | Inactive | Active |
|---|---|---|
| background | `#FFFFFF` | `#1A1917` |
| text | `#1A1917` | `#FFFFFF` |
| border | `1px solid rgba(20,20,18,0.13)` | `1px solid #1A1917` |

Common: `height:34px; padding:0 15px; border-radius:999px; font:inherit; font-size:13.5px; letter-spacing:-0.01em; cursor:pointer; transition:background 160ms ease, color 160ms ease`. Set `aria-pressed="true|false"`. Chip text never wraps (`white-space:nowrap`).

### Search
- `<input type="search" placeholder="Search playbooks" aria-label="Search playbooks">`
- `width:100%; height:40px; box-sizing:border-box; padding:0 14px 0 36px; border:1px solid rgba(20,20,18,0.13); border-radius:8px; background:#FFFFFF; font:inherit; font-size:14px; color:#1A1917; outline:none`. Focus: `border-color:#157F52`. Also give keyboard focus a visible ring (see specs/08).
- Magnifier icon, drawn in CSS in the prototype. Use an SVG in production, same size and position:
  - Ring: 11×11px, `border:1.5px solid #6E6D67`, round, at `left:14px`, vertically centred (`top:50%; margin-top:-7px`).
  - Handle: 5×1.5px, `#6E6D67`, at `left:23px; top:50%; margin-top:3px`, rotated 45° around its left centre.
- The search updates on every keystroke (no debounce needed for nine items).

## Filtering logic
```
filtering = category !== "All" || query.trim() !== ""
results   = playbooks.filter(p =>
              (category === "All" || p.category === category) &&
              (!q || (p.name + " " + p.blurb + " " + p.category).toLowerCase().includes(q)))
            // q = query.trim().toLowerCase()
```
- **Browsing** (`!filtering`): show Featured, CTA cards, the three category rows and Recently updated. Hide Results.
- **Filtering**: hide all four of those and show Results. The closing section and the footer always show.
- Chips and search combine: category AND query.
- Recommended in production: mirror the state in the URL (`?category=private-credit&q=nav`) with `router.replace` (no history spam), so filtered views can be shared.

## Results section (filtering only)
```
section  padding:32px 40px 0; min-height:44vh
└─ max-width:1280px; margin:0 auto
   ├─ header row  display:flex; gap:16px; align-items:baseline; justify-content:space-between
   │   ├─ label  font-size:14px; color:#55544E        ← resultLabel
   │   └─ "Clear" <button>  padding:0; background:none; border:0;
   │        border-bottom:1px solid rgba(20,20,18,0.13); font:inherit; font-size:14px;
   │        color:#1A1917; cursor:pointer;  hover: color + border-color #157F52
   ├─ grid  display:grid; grid-template-columns:repeat(auto-fill, minmax(min(100%, 300px), 1fr));
   │        gap:44px 28px; margin-top:24px     ← same card as the category rows (specs/05)
   └─ empty state (0 results)  <p> margin:0; padding:24px 0; border-top:1px solid #1A1917;
        font-size:16px; line-height:1.55; color:#55544E
        "No playbook matches that search. Try a process name, such as covenant, capital call or NAV."
```
- `resultLabel` = `n + (n === 1 ? " playbook" : " playbooks") + (category !== "All" ? " in " + category : "") + (q ? " matching “" + query.trim() + "”" : "")`. The quotes are curly (“ ”). Examples:
  - "3 playbooks in Private Credit"
  - "1 playbook matching “covenant”"
  - "0 playbooks matching “zzz”"
- **Clear** resets the category to All and the query to "", and returns to browsing.
- Use `auto-fill`, not `auto-fit`: a single result must keep its normal column width and not stretch across the row. This was fixed in the reference; the design-tool capture `s02` shows the correct behaviour.
