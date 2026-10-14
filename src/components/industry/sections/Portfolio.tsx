/* eslint-disable react-hooks/refs -- `v` carries the page logic's createRef() objects, which
   these components only hand to ref={…}; nothing reads .current during render. */
import type { IndustryVals } from "@/motion/industry/industry.logic";
import { css } from "@/components/private-credit/css";
import type { IndustryCopy } from "../types";

// 04 Portfolio: a 16s loop (stepPort). The capability is built at Helix, carried into the
// library as a chip, then installed at four more companies, each live faster than the last.

export function Portfolio({ v, c, count = "0 capabilities" }: { v: IndustryVals; c: IndustryCopy["portfolio"]; count?: string }) {
  return (
    <section id="portfolio" data-screen-label={c.label} style={css("padding:118px 40px; border-bottom:1px solid var(--line2)")}>
      <div style={css("position:relative; overflow:hidden; max-width:1280px; margin:0 auto; box-sizing:border-box; border-radius:12px; box-shadow:0 30px 90px rgba(20,20,18,0.20); border:1px solid var(--line); background:#0A0A0A; padding:clamp(40px,6.25vw,80px) clamp(24px,6.25vw,80px)")}>
        {/* eslint-disable-next-line @next/next/no-img-element -- an 810px, 104KB WebP drawn at 42% under a dark wash: served as is */}
        <img src="/img/industry/cta-c.webp" alt="" loading="lazy" decoding="async" style={css("position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.42")} />
        <div style={css("position:absolute; inset:0; pointer-events:none; background:linear-gradient(180deg, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.78) 45%, rgba(10,10,10,0.9) 100%)")} />
        <div style={css("position:absolute; inset:0; pointer-events:none; background:radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px) 0 0 / 3px 3px; opacity:0.6")} />
        <div style={css("position:relative")}>
          <div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:11px; letter-spacing:0.16em; text-transform:uppercase; color:rgba(255,255,255,0.55)")}>{c.eyebrow}</div>
          <h2 style={css("margin:18px 0 0; font-size:clamp(28px, 3.1vw, 40px); font-weight:400; letter-spacing:-0.034em; line-height:1.12; color:#F4F3F0")}>{c.title}<br /><span style={css("background:linear-gradient(96deg,#A8C8E8 0%,#E9E4CF 26%,#F3C9A8 52%,#D9C3E8 76%,#AEC9DE 100%); -webkit-background-clip:text; background-clip:text; color:transparent")}>{c.glow}</span></h2>
          <p style={css("margin:18px 0 0; max-width:560px; font-size:15px; line-height:1.6; color:rgba(244,243,240,0.66); text-wrap:pretty")}>{c.lede}</p>
          <div ref={v.pfFit} style={css("position:relative; margin:48px 0 0; aspect-ratio:1120 / 520")}>
            <div ref={v.pfStage} aria-hidden="true" style={css("position:absolute; left:0; top:0; width:1120px; height:520px; transform-origin:0 0; opacity:0")}>
              <div style={css("position:absolute; left:330px; top:0; width:460px; height:92px; box-sizing:border-box; border-radius:12px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.16); backdrop-filter:blur(10px)")}>
                <div style={css("position:absolute; left:18px; top:13px; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:rgba(255,255,255,0.55)")}>{c.library}</div>
                <div data-pf-count="" style={css("position:absolute; right:18px; top:13px; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; letter-spacing:0.06em; color:rgba(255,255,255,0.55)")}>{count}</div>
                <div style={css("position:absolute; left:20px; right:20px; top:40px; height:34px; box-sizing:border-box; border-radius:8px; border:1px dashed rgba(255,255,255,0.22)")} />
                <div data-pf-slot="" style={css("position:absolute; left:20px; right:20px; top:40px; height:34px; box-sizing:border-box; padding:0 14px; border-radius:8px; background:linear-gradient(96deg,#A8C8E8 0%,#E9E4CF 30%,#F3C9A8 62%,#D9C3E8 100%); display:flex; align-items:center; justify-content:space-between; opacity:0")}><span style={css("font-size:13px; font-weight:500; color:#1A1917")}>{c.slot[0]}</span><span style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; color:#2C2B27")}>{c.slot[1]}</span></div>
              </div>
              <div data-pf-sum="" style={css("position:absolute; right:0; top:12px; width:280px; text-align:right; opacity:0")}>
                <div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:rgba(255,255,255,0.55)")}>{c.sum[0]}</div>
                <div style={css("margin:8px 0 0; font-size:22px; letter-spacing:-0.02em; color:#F4F3F0")}>{c.sum[1]}</div>
              </div>
              <div style={css("position:absolute; left:250px; top:122px; width:640px; height:14px; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; color:rgba(255,255,255,0.45)")}>
                <span style={css("position:absolute; left:0; transform:translateX(-50%)")}>0</span><span style={css("position:absolute; left:160px; transform:translateX(-50%)")}>2</span><span style={css("position:absolute; left:320px; transform:translateX(-50%)")}>4</span><span style={css("position:absolute; left:480px; transform:translateX(-50%)")}>6</span><span style={css("position:absolute; left:640px; transform:translateX(-50%); white-space:nowrap")}>8 wks</span>
              </div>
              <div style={css("position:absolute; left:0; top:150px; width:230px; height:56px; display:flex; flex-direction:column; justify-content:center")}><div style={css("font-size:15px; letter-spacing:-0.01em; color:#F4F3F0")}>{c.rows[0][0]}</div><div style={css("margin:4px 0 0; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; letter-spacing:0.05em; text-transform:uppercase; color:rgba(244,243,240,0.5)")}>{c.rows[0][1]}</div></div>
              <div style={css("position:absolute; left:0; top:222px; width:230px; height:56px; display:flex; flex-direction:column; justify-content:center")}><div style={css("font-size:15px; letter-spacing:-0.01em; color:#F4F3F0")}>{c.rows[1][0]}</div><div style={css("margin:4px 0 0; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; letter-spacing:0.05em; text-transform:uppercase; color:rgba(244,243,240,0.5)")}>{c.rows[1][1]}</div></div>
              <div style={css("position:absolute; left:0; top:294px; width:230px; height:56px; display:flex; flex-direction:column; justify-content:center")}><div style={css("font-size:15px; letter-spacing:-0.01em; color:#F4F3F0")}>{c.rows[2][0]}</div><div style={css("margin:4px 0 0; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; letter-spacing:0.05em; text-transform:uppercase; color:rgba(244,243,240,0.5)")}>{c.rows[2][1]}</div></div>
              <div style={css("position:absolute; left:0; top:366px; width:230px; height:56px; display:flex; flex-direction:column; justify-content:center")}><div style={css("font-size:15px; letter-spacing:-0.01em; color:#F4F3F0")}>{c.rows[3][0]}</div><div style={css("margin:4px 0 0; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; letter-spacing:0.05em; text-transform:uppercase; color:rgba(244,243,240,0.5)")}>{c.rows[3][1]}</div></div>
              <div style={css("position:absolute; left:0; top:438px; width:230px; height:56px; display:flex; flex-direction:column; justify-content:center")}><div style={css("font-size:15px; letter-spacing:-0.01em; color:#F4F3F0")}>{c.rows[4][0]}</div><div style={css("margin:4px 0 0; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; letter-spacing:0.05em; text-transform:uppercase; color:rgba(244,243,240,0.5)")}>{c.rows[4][1]}</div></div>
              <div style={css("position:absolute; left:250px; top:178px; width:640px; height:1px; background:rgba(255,255,255,0.12)")} />
              <div style={css("position:absolute; left:250px; top:250px; width:640px; height:1px; background:rgba(255,255,255,0.12)")} />
              <div style={css("position:absolute; left:250px; top:322px; width:640px; height:1px; background:rgba(255,255,255,0.12)")} />
              <div style={css("position:absolute; left:250px; top:394px; width:640px; height:1px; background:rgba(255,255,255,0.12)")} />
              <div style={css("position:absolute; left:250px; top:466px; width:640px; height:1px; background:rgba(255,255,255,0.12)")} />
              <div data-pf-bar="" style={css("position:absolute; left:250px; top:171px; width:0; height:14px; border-radius:7px; background:linear-gradient(96deg,#A8C8E8 0%,#E9E4CF 30%,#F3C9A8 62%,#D9C3E8 100%)")} />
              <div data-pf-bar="" style={css("position:absolute; left:250px; top:243px; width:0; height:14px; border-radius:7px; background:linear-gradient(96deg,#A8C8E8 0%,#E9E4CF 30%,#F3C9A8 62%,#D9C3E8 100%)")} />
              <div data-pf-bar="" style={css("position:absolute; left:250px; top:315px; width:0; height:14px; border-radius:7px; background:linear-gradient(96deg,#A8C8E8 0%,#E9E4CF 30%,#F3C9A8 62%,#D9C3E8 100%)")} />
              <div data-pf-bar="" style={css("position:absolute; left:250px; top:387px; width:0; height:14px; border-radius:7px; background:linear-gradient(96deg,#A8C8E8 0%,#E9E4CF 30%,#F3C9A8 62%,#D9C3E8 100%)")} />
              <div data-pf-bar="" style={css("position:absolute; left:250px; top:459px; width:0; height:14px; border-radius:7px; background:linear-gradient(96deg,#A8C8E8 0%,#E9E4CF 30%,#F3C9A8 62%,#D9C3E8 100%)")} />
              <div data-pf-dot="" style={css("position:absolute; left:244px; top:172px; width:12px; height:12px; border-radius:50%; background:#F4F3F0; box-shadow:0 0 0 4px rgba(255,255,255,0.12); opacity:0")} />
              <div data-pf-dot="" style={css("position:absolute; left:244px; top:244px; width:12px; height:12px; border-radius:50%; background:#F4F3F0; box-shadow:0 0 0 4px rgba(255,255,255,0.12); opacity:0")} />
              <div data-pf-dot="" style={css("position:absolute; left:244px; top:316px; width:12px; height:12px; border-radius:50%; background:#F4F3F0; box-shadow:0 0 0 4px rgba(255,255,255,0.12); opacity:0")} />
              <div data-pf-dot="" style={css("position:absolute; left:244px; top:388px; width:12px; height:12px; border-radius:50%; background:#F4F3F0; box-shadow:0 0 0 4px rgba(255,255,255,0.12); opacity:0")} />
              <div data-pf-dot="" style={css("position:absolute; left:244px; top:460px; width:12px; height:12px; border-radius:50%; background:#F4F3F0; box-shadow:0 0 0 4px rgba(255,255,255,0.12); opacity:0")} />
              <div style={css("position:absolute; left:930px; top:150px; width:190px; height:56px; display:flex; flex-direction:column; justify-content:center; align-items:flex-end")}><div data-pf-wk="" style={css("font-size:22px; letter-spacing:-0.02em; color:#F4F3F0; font-variant-numeric:tabular-nums")}>—</div><div data-pf-dl="" style={css("margin:4px 0 0; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; letter-spacing:0.05em; text-transform:uppercase; color:#F3C9A8; opacity:0")}>{c.deltas[0]}</div></div>
              <div style={css("position:absolute; left:930px; top:222px; width:190px; height:56px; display:flex; flex-direction:column; justify-content:center; align-items:flex-end")}><div data-pf-wk="" style={css("font-size:22px; letter-spacing:-0.02em; color:#F4F3F0; font-variant-numeric:tabular-nums")}>—</div><div data-pf-dl="" style={css("margin:4px 0 0; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; letter-spacing:0.05em; text-transform:uppercase; color:#F3C9A8; opacity:0")}>{c.deltas[1]}</div></div>
              <div style={css("position:absolute; left:930px; top:294px; width:190px; height:56px; display:flex; flex-direction:column; justify-content:center; align-items:flex-end")}><div data-pf-wk="" style={css("font-size:22px; letter-spacing:-0.02em; color:#F4F3F0; font-variant-numeric:tabular-nums")}>—</div><div data-pf-dl="" style={css("margin:4px 0 0; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; letter-spacing:0.05em; text-transform:uppercase; color:#F3C9A8; opacity:0")}>{c.deltas[2]}</div></div>
              <div style={css("position:absolute; left:930px; top:366px; width:190px; height:56px; display:flex; flex-direction:column; justify-content:center; align-items:flex-end")}><div data-pf-wk="" style={css("font-size:22px; letter-spacing:-0.02em; color:#F4F3F0; font-variant-numeric:tabular-nums")}>—</div><div data-pf-dl="" style={css("margin:4px 0 0; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; letter-spacing:0.05em; text-transform:uppercase; color:#F3C9A8; opacity:0")}>{c.deltas[3]}</div></div>
              <div style={css("position:absolute; left:930px; top:438px; width:190px; height:56px; display:flex; flex-direction:column; justify-content:center; align-items:flex-end")}><div data-pf-wk="" style={css("font-size:22px; letter-spacing:-0.02em; color:#F4F3F0; font-variant-numeric:tabular-nums")}>—</div><div data-pf-dl="" style={css("margin:4px 0 0; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; letter-spacing:0.05em; text-transform:uppercase; color:#F3C9A8; opacity:0")}>{c.deltas[4]}</div></div>
              <div ref={v.pfChip} style={css("position:absolute; left:0; top:0; width:180px; height:30px; border-radius:15px; background:linear-gradient(96deg,#A8C8E8 0%,#E9E4CF 30%,#F3C9A8 62%,#D9C3E8 100%); display:flex; align-items:center; justify-content:center; font-size:12.5px; font-weight:500; color:#1A1917; box-shadow:0 10px 30px rgba(0,0,0,0.35); opacity:0")}>{c.chip}</div>
            </div>
          </div>
        </div>
      </div>
      <p style={css("max-width:1280px; margin:16px auto 0; font-size:13.5px; line-height:1.5; color:var(--mut)")}>{c.caption}</p>
    </section>
  );
}
