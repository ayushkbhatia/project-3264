/* eslint-disable react-hooks/refs -- `v` carries the page logic's createRef() objects, which
   these components only hand to ref={…}; nothing reads .current during render. */
import type { IndustryVals } from "@/motion/industry/industry.logic";
import { css } from "@/components/private-credit/css";
import { BG } from "../bg";
import { Br } from "../Br";
import type { IndustryCopy } from "../types";

// 03 First 100 days: pinned for 520vh; scrolling scrubs day 0 → 100 across the Gantt, the
// milestones, the playhead, the log and the KPI panel (stepPlan).
//
// Below 768px the frame takes the stage's own proportions rather than the full pinned height
// (globals.css, [data-ind-plan-frame]), so the window is not lost in a tall empty painting.
//
// The D100 log row's threshold is 98.5, not the reference's 99: each row fades in over 1.5 days
// and the scrub stops at day 100, so at 99 it never got past 74% opacity (and 3.1:1 contrast).

export function Plan({ v, c }: { v: IndustryVals; c: IndustryCopy["plan"] }) {
  return (
    <section id="plan" data-screen-label={c.label} style={css("padding:118px 40px; border-bottom:1px solid var(--line2)")}>
      <div style={css("max-width:1280px; margin:0 auto; display:flex; gap:72px; flex-wrap:wrap; align-items:flex-end; justify-content:space-between")}>
        <div style={css("flex:3 1 480px")}>
          <div style={css("font-size:13px; letter-spacing:-0.005em; color:var(--mut)")}>{c.eyebrow}</div>
          <h2 style={css("margin:22px 0 0; font-size:clamp(30px, 3.1vw, 44px); font-weight:400; letter-spacing:-0.032em; line-height:1.06; text-wrap:balance")}><Br lines={c.title} /></h2>
        </div>
        <p style={css("flex:2 1 400px; max-width:520px; margin:0; font-size:16.5px; line-height:1.6; color:var(--sec); text-wrap:pretty")}>{c.lede}</p>
      </div>
      <div ref={v.plTrack} style={css("position:relative; min-height:520vh; margin:62px 0 0")}>
        <div style={css("position:sticky; top:68px; height:calc(100vh - 68px); min-height:600px; display:flex; align-items:center; box-sizing:border-box; padding:24px 0")}>
          <div ref={v.plFit} data-ind-plan-frame="" style={css(`position:relative; width:100%; max-width:1280px; margin:0 auto; height:100%; max-height:720px; box-sizing:border-box; overflow:hidden; border-radius:12px; border:1px solid var(--line); background:#E6E4DA ${BG.ctaValley} center / cover`)}>
            <div style={css("position:absolute; inset:0; pointer-events:none; background:rgba(248,246,240,0.28)")} />
            <div ref={v.plStage} aria-hidden="true" style={css("position:absolute; left:0; top:0; width:1120px; height:620px; transform-origin:0 0")}>
              <div style={css("position:absolute; inset:0; border-radius:11px; background:#FCFBF9; border:1px solid rgba(20,20,18,0.14); box-shadow:0 30px 74px rgba(20,20,18,0.22), 0 4px 12px rgba(20,20,18,0.12); overflow:hidden")}>
                <div style={css("position:relative; height:34px; display:flex; align-items:center; gap:7px; padding:0 13px; background:rgba(20,20,18,0.045); border-bottom:1px solid rgba(20,20,18,0.08)")}><span style={css("width:11px; height:11px; border-radius:50%; background:#FF5F57")} /><span style={css("width:11px; height:11px; border-radius:50%; background:#FEBC2E")} /><span style={css("width:11px; height:11px; border-radius:50%; background:#28C840")} /><div style={css("position:absolute; left:0; right:0; text-align:center; font-size:12.5px; color:#55544E")}>{c.window}</div></div>
                <div style={css("position:absolute; left:236px; top:56px; width:540px; height:14px; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; color:#6E6D67")}>
                  <span style={css("position:absolute; left:0; transform:translateX(-50%)")}>0</span><span style={css("position:absolute; left:108px; transform:translateX(-50%)")}>20</span><span style={css("position:absolute; left:216px; transform:translateX(-50%)")}>40</span><span style={css("position:absolute; left:324px; transform:translateX(-50%)")}>60</span><span style={css("position:absolute; left:432px; transform:translateX(-50%)")}>80</span><span style={css("position:absolute; left:540px; transform:translateX(-50%)")}>100</span>
                </div>
                <div style={css("position:absolute; left:20px; top:90px; width:200px; height:48px; display:flex; flex-direction:column; justify-content:center")}><div style={css("font-size:13.5px")}>{c.rows[0][0]}</div><div style={css("margin:2px 0 0; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; color:#6E6D67")}>{c.rows[0][1]}</div></div>
                <div style={css("position:absolute; left:20px; top:138px; width:200px; height:48px; display:flex; flex-direction:column; justify-content:center")}><div style={css("font-size:13.5px")}>{c.rows[1][0]}</div><div style={css("margin:2px 0 0; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; color:#6E6D67")}>{c.rows[1][1]}</div></div>
                <div style={css("position:absolute; left:20px; top:186px; width:200px; height:48px; display:flex; flex-direction:column; justify-content:center")}><div style={css("font-size:13.5px")}>{c.rows[2][0]}</div><div style={css("margin:2px 0 0; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; color:#6E6D67")}>{c.rows[2][1]}</div></div>
                <div style={css("position:absolute; left:20px; top:234px; width:200px; height:48px; display:flex; flex-direction:column; justify-content:center")}><div style={css("font-size:13.5px")}>{c.rows[3][0]}</div><div style={css("margin:2px 0 0; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; color:#6E6D67")}>{c.rows[3][1]}</div></div>
                <div style={css("position:absolute; left:20px; top:282px; width:200px; height:48px; display:flex; flex-direction:column; justify-content:center")}><div style={css("font-size:13.5px")}>{c.rows[4][0]}</div><div style={css("margin:2px 0 0; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; color:#6E6D67")}>{c.rows[4][1]}</div></div>
                <div style={css("position:absolute; left:20px; top:330px; width:200px; height:48px; display:flex; flex-direction:column; justify-content:center")}><div style={css("font-size:13.5px")}>{c.rows[5][0]}</div><div style={css("margin:2px 0 0; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; color:#6E6D67")}>{c.rows[5][1]}</div></div>
                <div style={css("position:absolute; left:236px; top:114px; width:540px; height:1px; background:rgba(20,20,18,0.07)")} />
                <div style={css("position:absolute; left:236px; top:162px; width:540px; height:1px; background:rgba(20,20,18,0.07)")} />
                <div style={css("position:absolute; left:236px; top:210px; width:540px; height:1px; background:rgba(20,20,18,0.07)")} />
                <div style={css("position:absolute; left:236px; top:258px; width:540px; height:1px; background:rgba(20,20,18,0.07)")} />
                <div style={css("position:absolute; left:236px; top:306px; width:540px; height:1px; background:rgba(20,20,18,0.07)")} />
                <div style={css("position:absolute; left:236px; top:354px; width:540px; height:1px; background:rgba(20,20,18,0.07)")} />
                <div data-bar="" data-s="0" data-e="14" style={css("position:absolute; left:236px; top:105px; width:0; height:18px; border-radius:5px; background:rgba(44,43,39,0.72)")} />
                <div data-bar="" data-s="8" data-e="30" style={css("position:absolute; left:279.2px; top:153px; width:0; height:18px; border-radius:5px; background:linear-gradient(96deg,#A8C8E8 0%,#E9E4CF 30%,#F3C9A8 62%,#D9C3E8 100%)")} />
                <div data-bar="" data-s="14" data-e="42" style={css("position:absolute; left:311.6px; top:201px; width:0; height:18px; border-radius:5px; background:var(--a)")} />
                <div data-bar="" data-s="36" data-e="64" style={css("position:absolute; left:430.4px; top:249px; width:0; height:18px; border-radius:5px; background:var(--a)")} />
                <div data-bar="" data-s="56" data-e="86" style={css("position:absolute; left:538.4px; top:297px; width:0; height:18px; border-radius:5px; background:var(--a)")} />
                <div data-bar="" data-s="70" data-e="100" style={css("position:absolute; left:614px; top:345px; width:0; height:18px; border-radius:5px; background:rgba(20,20,18,0.28)")} />
                <div data-ms="14" style={css("position:absolute; left:305.6px; top:108px; width:12px; height:12px; background:#1A1917; opacity:0")} />
                <div data-ms="30" style={css("position:absolute; left:392px; top:156px; width:12px; height:12px; background:#1A1917; opacity:0")} />
                <div data-ms="42" style={css("position:absolute; left:456.8px; top:204px; width:12px; height:12px; background:#1A1917; opacity:0")} />
                <div data-ms="64" style={css("position:absolute; left:575.6px; top:252px; width:12px; height:12px; background:#1A1917; opacity:0")} />
                <div data-ms="86" style={css("position:absolute; left:694.4px; top:300px; width:12px; height:12px; background:#1A1917; opacity:0")} />
                <div data-ms="100" style={css("position:absolute; left:770px; top:348px; width:12px; height:12px; background:#1A1917; opacity:0")} />
                <div ref={v.plHead} style={css("position:absolute; left:236px; top:50px; width:0; height:336px")}>
                  <div style={css("position:absolute; left:-0.75px; top:24px; bottom:0; width:1.5px; background:#1A1917")} />
                  <div ref={v.plDay} style={css("position:absolute; left:0; top:0; transform:translateX(-50%); padding:4px 8px; border-radius:4px; background:#1A1917; color:#FFFFFF; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; white-space:nowrap")}>Day 0</div>
                </div>
                <div style={css("position:absolute; left:20px; top:400px; width:760px; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; letter-spacing:0.06em; text-transform:uppercase; color:#6E6D67; padding:0 0 6px; border-bottom:1px solid rgba(20,20,18,0.08)")}>Log</div>
                <div style={css("position:absolute; left:20px; top:424px; width:760px; display:flex; flex-direction:column")}>
                  <div data-ev="3" style={css("display:grid; grid-template-columns:52px minmax(0,1fr); height:25px; align-items:center; font-size:13px; opacity:0")}><span style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; color:#6E6D67")}>{c.log[0][0]}</span><span>{c.log[0][1]}</span></div>
                  <div data-ev="14" style={css("display:grid; grid-template-columns:52px minmax(0,1fr); height:25px; align-items:center; font-size:13px; opacity:0")}><span style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; color:#6E6D67")}>{c.log[1][0]}</span><span>{c.log[1][1]}</span></div>
                  <div data-ev="30" style={css("display:grid; grid-template-columns:52px minmax(0,1fr); height:25px; align-items:center; font-size:13px; opacity:0")}><span style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; color:#6E6D67")}>{c.log[2][0]}</span><span>{c.log[2][1]}</span></div>
                  <div data-ev="42" style={css("display:grid; grid-template-columns:52px minmax(0,1fr); height:25px; align-items:center; font-size:13px; opacity:0")}><span style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; color:#6E6D67")}>{c.log[3][0]}</span><span>{c.log[3][1]}</span></div>
                  <div data-ev="64" style={css("display:grid; grid-template-columns:52px minmax(0,1fr); height:25px; align-items:center; font-size:13px; opacity:0")}><span style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; color:#6E6D67")}>{c.log[4][0]}</span><span>{c.log[4][1]}</span></div>
                  <div data-ev="86" style={css("display:grid; grid-template-columns:52px minmax(0,1fr); height:25px; align-items:center; font-size:13px; opacity:0")}><span style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; color:#6E6D67")}>{c.log[5][0]}</span><span>{c.log[5][1]}</span></div>
                  <div data-ev="98.5" style={css("display:grid; grid-template-columns:52px minmax(0,1fr); height:25px; align-items:center; font-size:13px; opacity:0")}><span style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; color:var(--a)")}>{c.log[6][0]}</span><span>{c.log[6][1]}</span></div>
                </div>
                <div style={css("position:absolute; left:812px; top:56px; width:288px; height:544px; box-sizing:border-box; padding:20px; border-radius:10px; background:rgba(20,20,18,0.028); border:1px solid rgba(20,20,18,0.08); display:flex; flex-direction:column")}>
                  <div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; letter-spacing:0.06em; text-transform:uppercase; color:#6E6D67")}>{c.kpi.label}</div>
                  <div data-kpi="e" style={css("margin:10px 0 0; font-size:44px; letter-spacing:-0.035em; line-height:1; font-variant-numeric:tabular-nums")}>{c.kpi.start}</div>
                  <div style={css("margin:8px 0 0; font-size:12px; color:#6E6D67")}>{c.kpi.sub}</div>
                  <div style={css("display:grid; grid-template-columns:1fr 1fr; gap:14px; margin:20px 0 0; padding:18px 0; border-top:1px solid rgba(20,20,18,0.08); border-bottom:1px solid rgba(20,20,18,0.08)")}>
                    <div><div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; letter-spacing:0.05em; text-transform:uppercase; color:#6E6D67")}>{c.kpi.hours}</div><div data-kpi="h" style={css("margin:8px 0 0; font-size:26px; letter-spacing:-0.03em; font-variant-numeric:tabular-nums")}>0</div></div>
                    <div><div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; letter-spacing:0.05em; text-transform:uppercase; color:#6E6D67")}>Live</div><div data-kpi="l" style={css("margin:8px 0 0; font-size:26px; letter-spacing:-0.03em; font-variant-numeric:tabular-nums")}>0 of 3</div></div>
                  </div>
                  <div style={css("margin:18px 0 6px; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; letter-spacing:0.06em; text-transform:uppercase; color:#6E6D67")}>{c.board.title}</div>
                  <div style={css("display:flex; justify-content:space-between; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid rgba(20,20,18,0.06); font-size:13px")}><span>{c.board.items[0]}</span><span data-st="" data-s="14" data-e="42" style={css("flex:none; padding:3px 7px; border-radius:4px; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:9.5px; letter-spacing:0.05em; text-transform:uppercase; color:#6E6D67; background:rgba(20,20,18,0.06)")}>Planned</span></div>
                  <div style={css("display:flex; justify-content:space-between; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid rgba(20,20,18,0.06); font-size:13px")}><span>{c.board.items[1]}</span><span data-st="" data-s="36" data-e="64" style={css("flex:none; padding:3px 7px; border-radius:4px; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:9.5px; letter-spacing:0.05em; text-transform:uppercase; color:#6E6D67; background:rgba(20,20,18,0.06)")}>Planned</span></div>
                  <div style={css("display:flex; justify-content:space-between; align-items:center; gap:10px; padding:10px 0; font-size:13px")}><span>{c.board.items[2]}</span><span data-st="" data-s="56" data-e="86" style={css("flex:none; padding:3px 7px; border-radius:4px; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:9.5px; letter-spacing:0.05em; text-transform:uppercase; color:#6E6D67; background:rgba(20,20,18,0.06)")}>Planned</span></div>
                  <div style={css("margin-top:auto; font-size:12px; line-height:1.45; color:#6E6D67")}>{c.note}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
