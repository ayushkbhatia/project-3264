# 06 · Recently updated

Screenshot: `desktop-1440/08-recently-updated.png`. Shown only while browsing, after the Asset Management row.

```
section  padding:96px 40px 0
└─ max-width:1280px; margin:0 auto
   ├─ h2  "Recently updated", same style as the category H2 (clamp(32px, 3.2vw, 46px), 400, -0.035em, 1.05)
   └─ list  margin-top:28px; border-top:1px solid #1A1917
       └─ row <a href="<playbook route>"> ×6
            display:grid; grid-template-columns:80px minmax(0,1fr) auto; gap:8px 24px;
            align-items:baseline; padding:20px 0; border-bottom:1px solid rgba(20,20,18,0.13);
            color:#1A1917;  hover: #157F52 (name and note)
            ├─ date     font-family:'IBM Plex Mono'; 12px; color:#6E6D67        e.g. "Sep 22"
            ├─ middle   min-width:0
            │   ├─ name 18px; -0.02em; line-height:1.25                      e.g. "NAV Pack Review"
            │   └─ note margin-top:4px; 14.5px/1.5; color:#55544E
            └─ category 13px; color:#6E6D67; white-space:nowrap            e.g. "Fund Management"
```

## Data (placeholder; replace before launch)
| Date | Playbook | Note | Category |
|---|---|---|---|
| Sep 22 | NAV Pack Review | Tolerance bands now set per asset class | Fund Management |
| Sep 18 | Covenant Watch | Equity-cure testing and cure-cap tracking | Private Credit |
| Sep 12 | Research Intake | Earnings-call transcripts added as a source | Asset Management |
| Sep 9 | Loan Ops Ledger | New break class for PIK toggles | Private Credit |
| Sep 2 | Side-Letter Register | MFN elections tracked per investor | Fund Management |
| Aug 29 | Capital Call Flow | Side-letter excuse rights applied when each call is computed | Private Credit |

These are illustrative. The research pack validated the need for each feature, not the build. Source them from a changelog or CMS. Render a real `<time datetime="2026-09-22">` around each date.

## Narrow screens
Below 520px, the 80px | 1fr | auto grid squeezes the category column. Change it to `grid-template-columns:64px minmax(0,1fr)` and move the category under the note (13px, `#6E6D67`, `margin-top:4px`). This is the only breakpoint this section needs.
