/* eslint-disable react-hooks/refs -- `v` carries the page logic's createRef() objects, which
   these components only hand to ref={…}; nothing reads .current during render. */
import type { PrivateEquityVals } from "@/motion/private-equity/private-equity.logic";
import { css } from "@/components/private-credit/css";
import { BG } from "../bg";

// 05 Value: the EBITDA bridge builds once as the frame arrives (stepValue), then the exit
// value line counts up.

export function Value({ v }: { v: PrivateEquityVals }) {
  return (
    <section id="value" data-screen-label="Value" style={css("padding:118px 40px; border-bottom:1px solid var(--line2)")}>
      <div style={css("max-width:1280px; margin:0 auto")}>
        <div style={css("display:flex; gap:72px; flex-wrap:wrap; align-items:flex-end; justify-content:space-between")}>
          <div style={css("flex:3 1 480px")}>
            <div style={css("font-size:13px; letter-spacing:-0.005em; color:var(--mut)")}>05 / Value</div>
            <h2 style={css("margin:22px 0 0; font-size:clamp(30px, 3.1vw, 44px); font-weight:400; letter-spacing:-0.032em; line-height:1.06")}>Value you can bridge,<br />line by line.</h2>
          </div>
          <p style={css("flex:2 1 400px; max-width:520px; margin:0; font-size:16.5px; line-height:1.6; color:var(--sec); text-wrap:pretty")}>Every capability reports against a baseline the portfolio company signed before the build. The value creation plan carries measured numbers, and the same evidence goes into the data room at exit.</p>
        </div>
        <div style={css(`position:relative; overflow:hidden; margin:56px 0 0; box-sizing:border-box; border-radius:12px; border:1px solid var(--line); box-shadow:0 30px 90px rgba(20,20,18,0.16); background:#E4E6DC ${BG.auditWash} center 70% / cover; padding:clamp(24px,5vw,64px)`)}>
          <div style={css("position:absolute; inset:0; pointer-events:none; background:rgba(248,246,240,0.18)")} />
          <div ref={v.vlFit} style={css("position:relative; max-width:1120px; margin:0 auto; aspect-ratio:1120 / 600")}>
            <div ref={v.vlStage} aria-hidden="true" style={css("position:absolute; left:0; top:0; width:1120px; height:600px; transform-origin:0 0; opacity:0")}>
              <div style={css("position:absolute; inset:0; border-radius:11px; background:#FCFBF9; border:1px solid rgba(20,20,18,0.14); box-shadow:0 30px 74px rgba(20,20,18,0.22), 0 4px 12px rgba(20,20,18,0.12); overflow:hidden")}>
                <div style={css("position:relative; height:34px; display:flex; align-items:center; gap:7px; padding:0 13px; background:rgba(20,20,18,0.045); border-bottom:1px solid rgba(20,20,18,0.08)")}><span style={css("width:11px; height:11px; border-radius:50%; background:#FF5F57")} /><span style={css("width:11px; height:11px; border-radius:50%; background:#FEBC2E")} /><span style={css("width:11px; height:11px; border-radius:50%; background:#28C840")} /><div style={css("position:absolute; left:0; right:0; text-align:center; font-size:12.5px; color:#55544E")}>Board pack — Helix Logistics · Q3 value creation update</div></div>
                <div style={css("position:absolute; left:40px; top:54px; font-size:18px; letter-spacing:-0.02em")}>EBITDA bridge, run-rate</div>
                <div style={css("position:absolute; left:40px; top:80px; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; letter-spacing:0.05em; text-transform:uppercase; color:#6E6D67")}>£m · axis starts at 12.0</div>
                <div style={css("position:absolute; right:40px; top:52px; display:flex; align-items:baseline; gap:10px")}><span style={css("font-size:13px; color:#55544E")}>£14.2m →</span><span data-vl-run="" style={css("font-size:24px; letter-spacing:-0.025em; font-variant-numeric:tabular-nums")}>£14.2m</span><span data-vl-pct="" style={css("padding:3px 7px; border-radius:4px; background:var(--a); color:#FFFFFF; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:11px; font-variant-numeric:tabular-nums")}>+0.0%</span></div>
                <div data-vl-axis="" style={css("position:absolute; inset:0; opacity:0")}>
                  <div style={css("position:absolute; left:80px; top:150px; width:1000px; border-top:1px dashed rgba(20,20,18,0.12)")} />
                  <div style={css("position:absolute; left:80px; top:220px; width:1000px; border-top:1px dashed rgba(20,20,18,0.12)")} />
                  <div style={css("position:absolute; left:80px; top:290px; width:1000px; border-top:1px dashed rgba(20,20,18,0.12)")} />
                  <div style={css("position:absolute; left:80px; top:360px; width:1000px; border-top:1px dashed rgba(20,20,18,0.12)")} />
                  <div style={css("position:absolute; left:80px; top:430px; width:1000px; height:1px; background:rgba(20,20,18,0.45)")} />
                  <div style={css("position:absolute; left:36px; top:143px; width:34px; text-align:right; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; color:#6E6D67")}>16</div>
                  <div style={css("position:absolute; left:36px; top:213px; width:34px; text-align:right; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; color:#6E6D67")}>15</div>
                  <div style={css("position:absolute; left:36px; top:283px; width:34px; text-align:right; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; color:#6E6D67")}>14</div>
                  <div style={css("position:absolute; left:36px; top:353px; width:34px; text-align:right; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; color:#6E6D67")}>13</div>
                  <div style={css("position:absolute; left:36px; top:423px; width:34px; text-align:right; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; color:#6E6D67")}>12</div>
                </div>
                <div data-vl-con="" style={css("position:absolute; left:214px; top:276px; width:54px; border-top:1px dashed rgba(20,20,18,0.4); transform-origin:left center; transform:scaleX(0)")} />
                <div data-vl-con="" style={css("position:absolute; left:372px; top:192px; width:54px; border-top:1px dashed rgba(20,20,18,0.4); transform-origin:left center; transform:scaleX(0)")} />
                <div data-vl-con="" style={css("position:absolute; left:530px; top:157px; width:54px; border-top:1px dashed rgba(20,20,18,0.4); transform-origin:left center; transform:scaleX(0)")} />
                <div data-vl-con="" style={css("position:absolute; left:688px; top:143px; width:54px; border-top:1px dashed rgba(20,20,18,0.4); transform-origin:left center; transform:scaleX(0)")} />
                <div data-vl-con="" style={css("position:absolute; left:846px; top:122px; width:54px; border-top:1px dashed rgba(20,20,18,0.4); transform-origin:left center; transform:scaleX(0)")} />
                <div data-vl-bar="" style={css("position:absolute; left:110px; top:430px; width:104px; height:0; border-radius:3px 3px 0 0; background:rgba(20,20,18,0.72)")} />
                <div data-vl-bar="" style={css("position:absolute; left:268px; top:276px; width:104px; height:0; border-radius:3px; background:var(--a)")} />
                <div data-vl-bar="" style={css("position:absolute; left:426px; top:192px; width:104px; height:0; border-radius:3px; background:var(--a)")} />
                <div data-vl-bar="" style={css("position:absolute; left:584px; top:157px; width:104px; height:0; border-radius:3px; background:var(--a)")} />
                <div data-vl-bar="" style={css("position:absolute; left:742px; top:143px; width:104px; height:0; border-radius:3px; background:var(--a)")} />
                <div data-vl-bar="" style={css("position:absolute; left:900px; top:430px; width:104px; height:0; border-radius:3px 3px 0 0; background:#1A1917")} />
                <div data-vl-lab="" style={css("position:absolute; left:110px; top:250px; width:104px; text-align:center; font-size:15px; letter-spacing:-0.015em; font-variant-numeric:tabular-nums; opacity:0")}>£14.2m</div>
                <div data-vl-lab="" style={css("position:absolute; left:268px; top:166px; width:104px; text-align:center; font-size:15px; letter-spacing:-0.015em; font-variant-numeric:tabular-nums; color:var(--a); opacity:0")}>+£1.2m</div>
                <div data-vl-lab="" style={css("position:absolute; left:426px; top:131px; width:104px; text-align:center; font-size:15px; letter-spacing:-0.015em; font-variant-numeric:tabular-nums; color:var(--a); opacity:0")}>+£0.5m</div>
                <div data-vl-lab="" style={css("position:absolute; left:584px; top:117px; width:104px; text-align:center; font-size:15px; letter-spacing:-0.015em; font-variant-numeric:tabular-nums; color:var(--a); opacity:0")}>+£0.2m</div>
                <div data-vl-lab="" style={css("position:absolute; left:742px; top:96px; width:104px; text-align:center; font-size:15px; letter-spacing:-0.015em; font-variant-numeric:tabular-nums; color:var(--a); opacity:0")}>+£0.3m</div>
                <div data-vl-lab="" style={css("position:absolute; left:900px; top:96px; width:104px; text-align:center; font-size:15px; letter-spacing:-0.015em; font-variant-numeric:tabular-nums; opacity:0")}>£16.4m</div>
                <div data-vl-nm="" style={css("position:absolute; left:92px; top:444px; width:140px; text-align:center; opacity:0")}><div style={css("font-size:13px")}>Entry EBITDA</div><div style={css("margin:4px 0 0; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; color:#6E6D67")}>at acquisition</div></div>
                <div data-vl-nm="" style={css("position:absolute; left:250px; top:444px; width:140px; text-align:center; opacity:0")}><div style={css("font-size:13px")}>Invoice matching</div><div style={css("margin:4px 0 0; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; color:#6E6D67")}>11.4 → 3.1 FTE</div></div>
                <div data-vl-nm="" style={css("position:absolute; left:408px; top:444px; width:140px; text-align:center; opacity:0")}><div style={css("font-size:13px")}>Carrier rate checks</div><div style={css("margin:4px 0 0; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; color:#6E6D67")}>£38k a month recovered</div></div>
                <div data-vl-nm="" style={css("position:absolute; left:566px; top:444px; width:140px; text-align:center; opacity:0")}><div style={css("font-size:13px")}>Month-end accruals</div><div style={css("margin:4px 0 0; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; color:#6E6D67")}>close 9 → 6 days</div></div>
                <div data-vl-nm="" style={css("position:absolute; left:724px; top:444px; width:140px; text-align:center; opacity:0")}><div style={css("font-size:13px")}>Service triage</div><div style={css("margin:4px 0 0; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; color:#6E6D67")}>response 14h → 2h</div></div>
                <div data-vl-nm="" style={css("position:absolute; left:882px; top:444px; width:140px; text-align:center; opacity:0")}><div style={css("font-size:13px")}>Run-rate EBITDA</div><div style={css("margin:4px 0 0; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10px; color:#6E6D67")}>measured at day 180</div></div>
                <div data-vl-ev="" style={css("position:absolute; left:40px; right:40px; top:516px; height:60px; box-sizing:border-box; border-top:1px solid rgba(20,20,18,0.1); display:flex; align-items:center; justify-content:space-between; gap:24px; opacity:0")}><span style={css("font-size:14.5px; letter-spacing:-0.01em; color:#2C2B27")}>+£2.2m run-rate EBITDA × 9.0× exit multiple</span><span style={css("display:flex; align-items:baseline; gap:8px")}><span style={css("font-size:13px; color:#55544E")}>≈</span><span data-vl-evn="" style={css("font-size:26px; letter-spacing:-0.03em; color:var(--a); font-variant-numeric:tabular-nums")}>£0.0m</span><span style={css("font-size:13px; color:#55544E")}>of enterprise value</span></span></div>
              </div>
            </div>
          </div>
        </div>
        <p style={css("margin:16px 0 0; font-size:13.5px; line-height:1.5; color:var(--mut)")}>Illustrative bridge for one portfolio company. Each line is measured against a baseline signed before the build. The multiple is the fund’s own exit assumption.</p>
      </div>
    </section>
  );
}
