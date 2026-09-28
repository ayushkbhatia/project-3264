# 04 · Library CTA cards (subscribe · platform)

Screenshots: `desktop-1440/04-ctas.png`, `states/s04-subscribed.png`, `tablet-924/03-ctas.png`.

Shown only while browsing, directly after the carousel controls.

```
section  padding:56px 40px 0
└─ max-width:1280px; margin:0 auto; display:flex; flex-wrap:wrap; gap:20px
   ├─ Card A: subscribe   flex:1 1 480px; min-width:0
   └─ Card B: platform    flex:1 1 480px; min-width:0
```
The cards sit side by side above ~1040px of content width and stack below that.

## Card A: "Get new playbooks as they ship"
```
position:relative; overflow:hidden; border-radius:20px; background:#B8321F; color:#FFFFFF;
padding:clamp(28px, 3vw, 40px)
├─ <img src="subscribe-wash.png" alt=""> position:absolute; inset:0; width:100%; height:100%;
│      object-fit:cover; object-position:center 30%
├─ scrim  position:absolute; inset:0;
│         background:linear-gradient(100deg, rgba(74,16,10,0.62) 0%, rgba(74,16,10,0.34) 55%, rgba(74,16,10,0.06) 100%)
└─ content  position:relative
    ├─ title  24px; letter-spacing:-0.025em; line-height:1.2; color:#FFFFFF;
    │         text-shadow:0 1px 14px rgba(74,16,10,0.35)
    │         "Get new playbooks as they ship"
    ├─ sub    margin-top:8px; 15px/1.5; color:rgba(255,255,255,0.92);
    │         text-shadow:0 1px 12px rgba(74,16,10,0.35)
    │         "One email when a playbook is published or revised. Nothing else."
    └─ form (idle)  display:flex; gap:6px; margin-top:24px; max-width:480px; padding:5px;
                    border-radius:10px; background:#FFFFFF
        ├─ <input type="email" required placeholder="Work email" aria-label="Work email">
        │     flex:1 1 auto; min-width:0; height:42px; padding:0 12px; border:0;
        │     background:transparent; font:inherit; font-size:15px; color:#1A1917; outline:none
        └─ <button type="submit">Subscribe</button>
              flex:none; height:42px; padding:0 20px; border:0; border-radius:7px;
              background:#157F52; color:#FFFFFF; font:inherit; font-size:14.5px; font-weight:500
              hover: background:#0F6A43
```
**Success state:** replaces the form in the same slot. `display:flex; align-items:center; gap:10px; height:52px; margin-top:24px; font-size:15px`, with an 8px round `#6FCF97` dot and the text "You are on the list."

**Production states to add** (not in the prototype, which only toggles to success):
| State | Treatment |
|---|---|
| submitting | Keep the button width; change its label to "Subscribing…" and set `aria-busy`; disable the input |
| success | As above; move focus to the success line or announce it through `aria-live="polite"` |
| invalid email | Use native `required` + `type=email` validation, or an inline 13px message under the form in `#FFFFFF` at 0.92 opacity: "Enter a work email address." |
| server error | Same slot as the invalid-email message: "Couldn't subscribe. Try again in a minute." Keep the form |

Wire it to the site's email provider (open item). The endpoint and double opt-in are 3264's call.

## Card B: "See three playbooks on one platform"
```
position:relative; overflow:hidden; border-radius:20px; background:#E9C9B8;
padding:clamp(28px, 3vw, 40px); display:flex; box-sizing:border-box
├─ <img src="platform-wash.png" alt=""> absolute; inset:0; object-fit:cover; object-position:center 40%
├─ scrim  absolute; inset:0;
│         background:linear-gradient(100deg, rgba(248,246,240,0.74) 0%, rgba(248,246,240,0.46) 55%, rgba(248,246,240,0.08) 100%)
└─ content  position:relative; flex:1 1 auto; min-width:0
    ├─ title  24px; -0.025em; line-height:1.2; color:#1A1917
    │         "See three playbooks on one platform"
    ├─ p      margin-top:10px; max-width:440px; 15px/1.55; color:#2C2B27; text-wrap:pretty
    │         "Covenant Watch, Capital Call Flow and Loan Ops Ledger, running on the same record for a private credit fund."
    └─ link   → /industries/private-credit
              inline-flex; align-items:center; gap:8px; margin-top:20px; 14.5px; -0.01em; color:#1A1917;
              border-bottom:1px solid rgba(20,20,18,0.3); padding-bottom:2px
              hover: color + border-color #157F52
              "See the Private Credit platform →"
```
Both cards keep their natural heights. They are equal in the screenshot because the content is similar; do not force equal height unless the flex row does it already (it does, through `align-items: stretch`).
