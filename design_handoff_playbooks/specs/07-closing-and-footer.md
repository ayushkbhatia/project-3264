# 07 · Closing CTA and footer

Screenshots: `desktop-1440/09-closing.png`, `10-footer.png`. The footer spec is in `specs/00-foundation.md`.

## Closing tile (always visible, browsing and filtering)
```
section  padding:118px 40px; border-bottom:1px solid rgba(20,20,18,0.075)
└─ tile  position:relative; overflow:hidden; max-width:1280px; margin:0 auto;
         border:1px solid rgba(20,20,18,0.13); border-radius:20px;
         background:#E8E2D2 url('valley-pastel.png') center 60% / cover;
         padding:clamp(48px, 6vw, 88px) clamp(32px, 5vw, 72px);
         display:flex; gap:48px; flex-wrap:wrap; align-items:flex-end; justify-content:space-between
    ├─ veil  position:absolute; inset:0; pointer-events:none;
    │        background:linear-gradient(180deg, rgba(248,246,240,0.7) 0%, rgba(248,246,240,0.5) 60%, rgba(248,246,240,0.35) 100%)
    ├─ text  position:relative; flex:3 1 480px; min-width:0
    │   ├─ label  "Start": 13px; -0.005em; color:#2C2B27
    │   ├─ h2     margin-top:22px; max-width:760px; clamp(32px, 3.6vw, 52px); weight 400;
    │   │         -0.035em; line-height:1.04; text-wrap:balance
    │   │         "Pick the nearest playbook." <br/> "A two-week audit matches your process to one of the nine."
    │   └─ p      margin-top:20px; max-width:560px; 16.5px/1.6; color:#2C2B27; text-wrap:pretty
    │             "We price the build against the baseline the audit measures. If none of the nine fits,
    │              you leave with a ranked use-case ledger and no obligation to continue."
    └─ action  position:relative; display:flex; flex-direction:column; gap:12px; align-items:flex-start
        └─ "Book a two-week audit" → /ai-engineering#engagement
             inline-flex; align-items:center; height:46px; padding:0 24px; background:#1A1917;
             color:#FFFFFF; border-radius:6px; 15px/500/-0.01em;  hover: background #157F52
```
The button sits bottom-right beside the text on desktop (`align-items:flex-end`) and wraps below the text when the row is narrower than ~560px + button.
