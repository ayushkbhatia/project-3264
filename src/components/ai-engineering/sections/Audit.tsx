/* eslint-disable react-hooks/refs -- `v` carries the page logic's createRef() objects, which
   these components only hand to ref={…}; nothing reads .current during render. */
import type { AIEngineeringVals } from "@/motion/ai-engineering/ai-engineering.logic";
import { css } from "@/components/private-credit/css";
import valleyPastel from "../../../../public/img/private-credit/valley-pastel.png";
import { bgImage } from "../bg";
import { AuditFindings } from "./AuditFindings";

// 02 Audit: a 21.6s loop that starts once the graphic is well in view (stepAuditLoop). A Gantt
// of the two-week audit draws and collapses onto one line, a glass calendar fills session by
// session, day 10 goes green, and the audit window steps through five findings.

// The tile's painting: a CSS background, as in the reference, through the optimiser (bg.ts).
const TILE_BG = bgImage(valleyPastel);

export function Audit({ v }: { v: AIEngineeringVals }) {
  return (
    <section id="audit" data-screen-label="Audit" style={css("padding:118px 40px; border-bottom:1px solid var(--line2)")}>
      <div style={css("position:relative; overflow:hidden; max-width:1280px; margin:0 auto; box-sizing:border-box; border-radius:12px; box-shadow:0 30px 90px rgba(20,20,18,0.20); border:1px solid var(--line); padding:calc(28px + clamp(36px,5.5vw,72px)) clamp(24px,6.25vw,80px) clamp(48px,7.5vw,96px)")}>
        <div style={css(`position:absolute; inset:0; background:#E8E2D2 ${TILE_BG} center 60% / cover no-repeat; pointer-events:none`)} />
        <div style={css("position:absolute; inset:0; background:linear-gradient(180deg, rgba(248,246,240,0.55) 0%, rgba(248,246,240,0.15) 50%, rgba(248,246,240,0.05) 100%); pointer-events:none")} />
        <div style={css("position:absolute; left:0; top:0; right:0; height:28px; z-index:50; display:flex; align-items:center; gap:18px; padding:0 14px; background:rgba(252,251,249,0.62); backdrop-filter:blur(18px); border-bottom:1px solid rgba(20,20,18,0.10); font-size:12.5px; color:#1A1917")}>
          <span style={css("display:block; width:9px; height:9px; background:#1A1917; transform:rotate(45deg)")} />
          <span style={css("font-weight:600; letter-spacing:-0.01em")}>3264</span>
          <span style={css("color:rgba(20,20,18,0.66)")}>File</span>
          <span style={css("color:rgba(20,20,18,0.66)")}>Edit</span>
          <span style={css("color:rgba(20,20,18,0.66)")}>View</span>
          <span style={css("color:rgba(20,20,18,0.66)")}>Window</span>
          <span style={css("color:rgba(20,20,18,0.66)")}>Help</span>
          <span style={css("flex:1 1 auto")} />
          <span style={css("display:flex; align-items:center; justify-content:center; width:19px; height:15px; border-radius:3px; background:#1A1917; color:#FCFBF9; font-size:10.5px; font-weight:600")}>A</span>
          <span style={css("display:flex; align-items:flex-end; gap:1.5px; height:11px")}>
            <span style={css("display:block; width:2px; height:3px; background:rgba(20,20,18,0.8)")} />
            <span style={css("display:block; width:2px; height:5px; background:rgba(20,20,18,0.8)")} />
            <span style={css("display:block; width:2px; height:8px; background:rgba(20,20,18,0.8)")} />
            <span style={css("display:block; width:2px; height:11px; background:rgba(20,20,18,0.8)")} />
          </span>
          <span style={css("position:relative; display:block; width:23px; height:12px; border:1.2px solid rgba(20,20,18,0.6); border-radius:3px")}>
            <span style={css("position:absolute; left:1.5px; top:1.5px; bottom:1.5px; width:13px; background:rgba(20,20,18,0.8); border-radius:1.5px")} />
            <span style={css("position:absolute; left:24px; top:3.5px; width:1.5px; height:5px; background:rgba(20,20,18,0.5); border-radius:0 1px 1px 0")} />
          </span>
          <span style={css("position:relative; display:block; width:13px; height:13px")}>
            <span style={css("position:absolute; left:0; top:0; width:9px; height:9px; border:1.3px solid rgba(20,20,18,0.78); border-radius:50%; box-sizing:border-box")} />
            <span style={css("position:absolute; left:7.5px; top:8px; width:5px; height:1.4px; background:rgba(20,20,18,0.78); transform:rotate(45deg); transform-origin:left center")} />
          </span>
          <span style={css("display:grid; gap:3px; width:14px")}>
            <span style={css("display:block; height:1.6px; background:rgba(20,20,18,0.78); border-radius:1px")} />
            <span style={css("display:block; height:1.6px; background:rgba(20,20,18,0.78); border-radius:1px; width:9px")} />
          </span>
          <span style={css("letter-spacing:-0.005em; color:#1A1917")}>{"Tue 9 Jan\u00a0\u00a09:41 AM"}</span>
        </div>
        <div style={css("position:relative; text-align:center")}>
          <div style={css("font-size:13px; letter-spacing:-0.005em; color:#2C2B27")}>02 / Audit</div>
          <h2 style={css("margin:18px auto 0; font-size:clamp(22px,2.65vw,34px); font-weight:400; letter-spacing:-0.028em; line-height:1.18; text-wrap:balance")}>In two weeks, we assess your systems and processes and give you a written foundation for what to rebuild.</h2>
        </div>
        <div ref={v.auFit} style={css("position:relative; margin:48px 0 0; height:620px")}>
          <div ref={v.auStage} aria-hidden="true" style={css("position:absolute; left:0; top:0; width:1120px; height:620px; transform-origin:top left; opacity:0")}>
            <div style={css("position:absolute; left:0; right:0; top:0; display:grid; grid-template-columns:repeat(10,1fr); font-family:'IBM Plex Mono',monospace; font-size:11.5px; font-weight:500; color:#1A1917")}>
              <span>Day 1</span>
              <span>Day 2</span>
              <span>Day 3</span>
              <span>Day 4</span>
              <span>Day 5</span>
              <span>Day 6</span>
              <span>Day 7</span>
              <span>Day 8</span>
              <span>Day 9</span>
              <span>Day 10</span>
            </div>
            <div ref={v.auGrid} style={css("position:absolute; left:0; right:0; top:26px; height:242px; display:grid; grid-template-columns:repeat(10,1fr)")}>
              <span style={css("border-left:1px dashed rgba(20,20,18,0.16)")} />
              <span style={css("border-left:1px dashed rgba(20,20,18,0.16)")} />
              <span style={css("border-left:1px dashed rgba(20,20,18,0.16)")} />
              <span style={css("border-left:1px dashed rgba(20,20,18,0.16)")} />
              <span style={css("border-left:1px dashed rgba(20,20,18,0.16)")} />
              <span style={css("border-left:1px dashed rgba(20,20,18,0.16)")} />
              <span style={css("border-left:1px dashed rgba(20,20,18,0.16)")} />
              <span style={css("border-left:1px dashed rgba(20,20,18,0.16)")} />
              <span style={css("border-left:1px dashed rgba(20,20,18,0.16)")} />
              <span style={css("border-left:1px dashed rgba(20,20,18,0.16)")} />
            </div>
            <div ref={v.auBars} style={css("position:absolute; inset:0")}>
              <div data-start="1" style={css("position:absolute; left:0px; width:106px; top:34px; height:40px; box-sizing:border-box; display:flex; align-items:center; justify-content:space-between; gap:10px; padding:0 14px; border-radius:6px; background:rgba(252,251,249,0.8); border:1px solid rgba(20,20,18,0.12); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); box-shadow:0 8px 20px -12px rgba(20,20,18,0.3); clip-path:inset(0 100% 0 0 round 6px); transition:opacity .35s ease; will-change:transform")}>
                <span style={css("font-size:14.5px; font-weight:500; letter-spacing:-0.012em; color:#1A1917; white-space:nowrap")}>Access</span>
              </div>
              <div data-start="2" style={css("position:absolute; left:112px; width:330px; top:80px; height:40px; box-sizing:border-box; display:flex; align-items:center; justify-content:space-between; gap:10px; padding:0 14px; border-radius:6px; background:rgba(252,251,249,0.8); border:1px solid rgba(20,20,18,0.12); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); box-shadow:0 8px 20px -12px rgba(20,20,18,0.3); clip-path:inset(0 100% 0 0 round 6px); transition:opacity .35s ease; will-change:transform")}>
                <span style={css("font-size:14.5px; font-weight:500; letter-spacing:-0.012em; color:#1A1917; white-space:nowrap")}>Read the code</span>
                <span style={css("font-family:'IBM Plex Mono',monospace; font-size:9.5px; letter-spacing:0.04em; text-transform:uppercase; color:#55544E; white-space:nowrap")}>Code map</span>
              </div>
              <div data-start="5" style={css("position:absolute; left:448px; width:218px; top:126px; height:40px; box-sizing:border-box; display:flex; align-items:center; justify-content:space-between; gap:10px; padding:0 14px; border-radius:6px; background:rgba(252,251,249,0.8); border:1px solid rgba(20,20,18,0.12); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); box-shadow:0 8px 20px -12px rgba(20,20,18,0.3); clip-path:inset(0 100% 0 0 round 6px); transition:opacity .35s ease; will-change:transform")}>
                <span style={css("font-size:14.5px; font-weight:500; letter-spacing:-0.012em; color:#1A1917; white-space:nowrap")}>Interview</span>
              </div>
              <div data-start="7" style={css("position:absolute; left:672px; width:218px; top:172px; height:40px; box-sizing:border-box; display:flex; align-items:center; justify-content:space-between; gap:10px; padding:0 14px; border-radius:6px; background:rgba(252,251,249,0.8); border:1px solid rgba(20,20,18,0.12); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); box-shadow:0 8px 20px -12px rgba(20,20,18,0.3); clip-path:inset(0 100% 0 0 round 6px); transition:opacity .35s ease; will-change:transform")}>
                <span style={css("font-size:14.5px; font-weight:500; letter-spacing:-0.012em; color:#1A1917; white-space:nowrap")}>Map obligations</span>
              </div>
              <div data-start="9" style={css("position:absolute; left:896px; width:218px; top:218px; height:40px; box-sizing:border-box; display:flex; align-items:center; justify-content:space-between; gap:10px; padding:0 14px; border-radius:6px; background:#157F52; border:1px solid #157F52; backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); box-shadow:0 8px 20px -12px rgba(20,20,18,0.3); clip-path:inset(0 100% 0 0 round 6px); transition:opacity .35s ease; will-change:transform")}>
                <span style={css("font-size:14.5px; font-weight:500; letter-spacing:-0.012em; color:#FFFFFF; white-space:nowrap")}>Disposition</span>
              </div>
            </div>
            <div ref={v.auPanel} style={css("position:absolute; left:0; right:0; top:290px; display:grid; grid-template-columns:repeat(5,1fr); gap:32px; padding:20px 24px 22px; border-radius:10px; background:rgba(252,251,249,0.62); border:1px solid rgba(255,255,255,0.7); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); opacity:0")}>
              <div>
                <div style={css("font-family:'IBM Plex Mono',monospace; font-size:10.5px; font-weight:500; color:#1A1917")}>Day 1</div>
                <div style={css("margin:6px 0 0; font-size:14px; font-weight:500; line-height:1.45; color:#1A1917")}>Read-only, nothing changes</div>
                <div style={css("margin:8px 0 0; font-family:'IBM Plex Mono',monospace; font-size:10px; font-weight:500; letter-spacing:0.04em; text-transform:uppercase; color:#2C2B27")}>→ Access letter</div>
              </div>
              <div>
                <div style={css("font-family:'IBM Plex Mono',monospace; font-size:10.5px; font-weight:500; color:#1A1917")}>Days 2–4</div>
                <div style={css("margin:6px 0 0; font-size:14px; font-weight:500; line-height:1.45; color:#1A1917")}>Every component, every data path, every secret</div>
                <div style={css("margin:8px 0 0; font-family:'IBM Plex Mono',monospace; font-size:10px; font-weight:500; letter-spacing:0.04em; text-transform:uppercase; color:#2C2B27")}>→ Code map</div>
              </div>
              <div>
                <div style={css("font-family:'IBM Plex Mono',monospace; font-size:10.5px; font-weight:500; color:#1A1917")}>Days 5–6</div>
                <div style={css("margin:6px 0 0; font-size:14px; font-weight:500; line-height:1.45; color:#1A1917")}>The people who built it and use it daily</div>
                <div style={css("margin:8px 0 0; font-family:'IBM Plex Mono',monospace; font-size:10px; font-weight:500; letter-spacing:0.04em; text-transform:uppercase; color:#2C2B27")}>→ Interview notes</div>
              </div>
              <div>
                <div style={css("font-family:'IBM Plex Mono',monospace; font-size:10.5px; font-weight:500; color:#1A1917")}>Days 7–8</div>
                <div style={css("margin:6px 0 0; font-size:14px; font-weight:500; line-height:1.45; color:#1A1917")}>LPA, regulator and audit scope against each finding</div>
                <div style={css("margin:8px 0 0; font-family:'IBM Plex Mono',monospace; font-size:10px; font-weight:500; letter-spacing:0.04em; text-transform:uppercase; color:#2C2B27")}>→ Obligation matrix</div>
              </div>
              <div>
                <div style={css("font-family:'IBM Plex Mono',monospace; font-size:10.5px; font-weight:500; color:#1A1917")}>Days 9–10</div>
                <div style={css("margin:6px 0 0; font-size:14px; font-weight:500; line-height:1.45; color:#1A1917")}>Written, costed and handed over</div>
                <div style={css("margin:8px 0 0; font-family:'IBM Plex Mono',monospace; font-size:10px; font-weight:500; letter-spacing:0.04em; text-transform:uppercase; color:#2C2B27")}>→ Disposition report</div>
              </div>
            </div>
            <div ref={v.auCal} style={css("position:absolute; left:0; right:0; top:102px; border-radius:16px; background:rgba(255,255,255,0.3); border:1px solid rgba(255,255,255,0.72); backdrop-filter:blur(18px) saturate(1.1); -webkit-backdrop-filter:blur(18px) saturate(1.1); box-shadow:0 30px 80px -20px rgba(60,40,40,0.28); overflow:hidden; opacity:0")}>
              <div style={css("display:flex; align-items:center; gap:16px; padding:16px 22px; border-bottom:1px solid rgba(255,255,255,0.55)")}>
                <div style={css("flex:none; width:48px; border:1px solid rgba(255,255,255,0.7); border-radius:8px; overflow:hidden; text-align:center; background:rgba(255,255,255,0.5)")}>
                  <div style={css("padding:3px 0; font-size:9.5px; letter-spacing:0.04em; color:#55544E; background:rgba(255,255,255,0.4)")}>OCT</div>
                  <div style={css("padding:3px 0 5px; font-size:17px; letter-spacing:-0.02em")}>6</div>
                </div>
                <div style={css("min-width:0")}>
                  <div style={css("font-size:18px; letter-spacing:-0.022em")}>Audit — Northgate Capital</div>
                  <div style={css("margin:3px 0 0; font-size:12.5px; color:#2C2B27")}>6 Oct – 17 Oct 2026 · 10 working days · fixed fee</div>
                </div>
                <div style={css("margin-left:auto; display:flex; gap:6px")}>
                  <span style={css("display:flex; align-items:center; gap:7px; padding:6px 11px; background:rgba(255,255,255,0.5); border:1px solid rgba(255,255,255,0.7); border-radius:7px; font-size:12px; white-space:nowrap")}><span style={css("width:7px; height:7px; border-radius:50%; background:#6E6D67")} />Access</span>
                  <span style={css("display:flex; align-items:center; gap:7px; padding:6px 11px; background:rgba(255,255,255,0.5); border:1px solid rgba(255,255,255,0.7); border-radius:7px; font-size:12px; white-space:nowrap")}><span style={css("width:7px; height:7px; border-radius:50%; background:#3E63D8")} />Read the code</span>
                  <span style={css("display:flex; align-items:center; gap:7px; padding:6px 11px; background:rgba(255,255,255,0.5); border:1px solid rgba(255,255,255,0.7); border-radius:7px; font-size:12px; white-space:nowrap")}><span style={css("width:7px; height:7px; border-radius:50%; background:#7C5CE0")} />Interview</span>
                  <span style={css("display:flex; align-items:center; gap:7px; padding:6px 11px; background:rgba(255,255,255,0.5); border:1px solid rgba(255,255,255,0.7); border-radius:7px; font-size:12px; white-space:nowrap")}><span style={css("width:7px; height:7px; border-radius:50%; background:#D98E1F")} />Map obligations</span>
                  <span style={css("display:flex; align-items:center; gap:7px; padding:6px 11px; background:rgba(255,255,255,0.5); border:1px solid rgba(255,255,255,0.7); border-radius:7px; font-size:12px; white-space:nowrap")}><span style={css("width:7px; height:7px; border-radius:50%; background:#157F52")} />Disposition</span>
                </div>
              </div>
              <div style={css("display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); margin-left:-1px")}>
                <div style={css("padding:8px 0; text-align:center; font-size:11.5px; color:#2C2B27; border-left:1px solid rgba(255,255,255,0.5)")}>Mon</div>
                <div style={css("padding:8px 0; text-align:center; font-size:11.5px; color:#2C2B27; border-left:1px solid rgba(255,255,255,0.5)")}>Tue</div>
                <div style={css("padding:8px 0; text-align:center; font-size:11.5px; color:#2C2B27; border-left:1px solid rgba(255,255,255,0.5)")}>Wed</div>
                <div style={css("padding:8px 0; text-align:center; font-size:11.5px; color:#2C2B27; border-left:1px solid rgba(255,255,255,0.5)")}>Thu</div>
                <div style={css("padding:8px 0; text-align:center; font-size:11.5px; color:#2C2B27; border-left:1px solid rgba(255,255,255,0.5)")}>Fri</div>
              </div>
              <div ref={v.auCells} style={css("display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); margin-left:-1px")}>
                <div style={css("min-width:0; height:142px; box-sizing:border-box; padding:8px; border-left:1px solid rgba(255,255,255,0.5); border-top:1px solid rgba(255,255,255,0.5); display:flex; flex-direction:column; gap:5px; transition:background .25s ease")}>
                  <div style={css("display:flex; align-items:center; justify-content:space-between; padding:0 2px 2px")}>
                    <span style={css("display:inline-flex; align-items:center; height:22px; font-size:11.5px; font-weight:500")}>6</span>
                    <span style={css("font-family:'IBM Plex Mono',monospace; font-size:9.5px; font-weight:500; color:#2C2B27")}>Day 1</span>
                  </div>
                  <div data-chip="1" data-day="1" style={css("position:relative; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.78); font-size:11.5px; color:#1A1917; opacity:0")}>
                    <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#6E6D67")} />
                    <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500")}>Kickoff</span>
                    <span style={css("flex:none; font-size:10.5px; color:#55544E")}>9:00</span>
                  </div>
                  <div data-chip="1" data-day="1" style={css("position:relative; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.78); font-size:11.5px; color:#1A1917; opacity:0")}>
                    <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#6E6D67")} />
                    <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500")}>Read-only access</span>
                    <span style={css("flex:none; font-size:10.5px; color:#55544E")}>11:00</span>
                  </div>
                  <div data-chip="1" data-day="1" style={css("position:relative; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.78); font-size:11.5px; color:#1A1917; opacity:0")}>
                    <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#6E6D67")} />
                    <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500")}>System inventory</span>
                    <span style={css("flex:none; font-size:10.5px; color:#55544E")}>14:00</span>
                  </div>
                </div>
                <div style={css("min-width:0; height:142px; box-sizing:border-box; padding:8px; border-left:1px solid rgba(255,255,255,0.5); border-top:1px solid rgba(255,255,255,0.5); display:flex; flex-direction:column; gap:5px; transition:background .25s ease")}>
                  <div style={css("display:flex; align-items:center; justify-content:space-between; padding:0 2px 2px")}>
                    <span style={css("display:inline-flex; align-items:center; height:22px; font-size:11.5px; font-weight:500")}>7</span>
                    <span style={css("font-family:'IBM Plex Mono',monospace; font-size:9.5px; font-weight:500; color:#2C2B27")}>Day 2</span>
                  </div>
                  <div data-chip="1" data-day="2" style={css("position:relative; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.78); font-size:11.5px; color:#1A1917; opacity:0")}>
                    <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#3E63D8")} />
                    <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500")}>Data paths</span>
                    <span style={css("flex:none; font-size:10.5px; color:#55544E")}>9:30</span>
                  </div>
                  <div data-chip="1" data-day="2" style={css("position:relative; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.78); font-size:11.5px; color:#1A1917; opacity:0")}>
                    <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#3E63D8")} />
                    <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500")}>Secrets sweep</span>
                    <span style={css("flex:none; font-size:10.5px; color:#55544E")}>13:00</span>
                  </div>
                </div>
                <div style={css("min-width:0; height:142px; box-sizing:border-box; padding:8px; border-left:1px solid rgba(255,255,255,0.5); border-top:1px solid rgba(255,255,255,0.5); display:flex; flex-direction:column; gap:5px; transition:background .25s ease")}>
                  <div style={css("display:flex; align-items:center; justify-content:space-between; padding:0 2px 2px")}>
                    <span style={css("display:inline-flex; align-items:center; height:22px; font-size:11.5px; font-weight:500")}>8</span>
                    <span style={css("font-family:'IBM Plex Mono',monospace; font-size:9.5px; font-weight:500; color:#2C2B27")}>Day 3</span>
                  </div>
                  <div data-chip="1" data-day="3" style={css("position:relative; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.78); font-size:11.5px; color:#1A1917; opacity:0")}>
                    <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#3E63D8")} />
                    <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500")}>Fund access rules</span>
                    <span style={css("flex:none; font-size:10.5px; color:#55544E")}>9:30</span>
                  </div>
                  <div data-chip="1" data-day="3" style={css("position:relative; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.78); font-size:11.5px; color:#1A1917; opacity:0")}>
                    <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#3E63D8")} />
                    <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500")}>Dependencies</span>
                    <span style={css("flex:none; font-size:10.5px; color:#55544E")}>14:00</span>
                  </div>
                </div>
                <div style={css("min-width:0; height:142px; box-sizing:border-box; padding:8px; border-left:1px solid rgba(255,255,255,0.5); border-top:1px solid rgba(255,255,255,0.5); display:flex; flex-direction:column; gap:5px; transition:background .25s ease")}>
                  <div style={css("display:flex; align-items:center; justify-content:space-between; padding:0 2px 2px")}>
                    <span style={css("display:inline-flex; align-items:center; height:22px; font-size:11.5px; font-weight:500")}>9</span>
                    <span style={css("font-family:'IBM Plex Mono',monospace; font-size:9.5px; font-weight:500; color:#2C2B27")}>Day 4</span>
                  </div>
                  <div data-chip="1" data-day="4" style={css("position:relative; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.78); font-size:11.5px; color:#1A1917; opacity:0")}>
                    <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#3E63D8")} />
                    <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500")}>Fee and NAV logic</span>
                    <span style={css("flex:none; font-size:10.5px; color:#55544E")}>9:30</span>
                  </div>
                  <div data-chip="1" data-day="4" style={css("position:relative; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.78); font-size:11.5px; color:#1A1917; opacity:0")}>
                    <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#3E63D8")} />
                    <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500")}>Prompt logs</span>
                    <span style={css("flex:none; font-size:10.5px; color:#55544E")}>13:30</span>
                  </div>
                  <div data-chip="1" data-day="4" style={css("position:relative; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.78); font-size:11.5px; color:#1A1917; opacity:0")}>
                    <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#3E63D8")} />
                    <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500")}>Browser data path</span>
                    <span style={css("flex:none; font-size:10.5px; color:#55544E")}>15:30</span>
                  </div>
                </div>
                <div style={css("min-width:0; height:142px; box-sizing:border-box; padding:8px; border-left:1px solid rgba(255,255,255,0.5); border-top:1px solid rgba(255,255,255,0.5); display:flex; flex-direction:column; gap:5px; transition:background .25s ease")}>
                  <div style={css("display:flex; align-items:center; justify-content:space-between; padding:0 2px 2px")}>
                    <span style={css("display:inline-flex; align-items:center; height:22px; font-size:11.5px; font-weight:500")}>10</span>
                    <span style={css("font-family:'IBM Plex Mono',monospace; font-size:9.5px; font-weight:500; color:#2C2B27")}>Day 5</span>
                  </div>
                  <div data-chip="1" data-day="5" style={css("position:relative; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.78); font-size:11.5px; color:#1A1917; opacity:0")}>
                    <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#7C5CE0")} />
                    <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500")}>Builder interview</span>
                    <span style={css("flex:none; font-size:10.5px; color:#55544E")}>10:00</span>
                  </div>
                  <div data-chip="1" data-day="5" style={css("position:relative; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.78); font-size:11.5px; color:#1A1917; opacity:0")}>
                    <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#7C5CE0")} />
                    <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500")}>IR team</span>
                    <span style={css("flex:none; font-size:10.5px; color:#55544E")}>14:00</span>
                  </div>
                  <div data-chip="1" data-day="5" style={css("position:relative; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.78); font-size:11.5px; color:#1A1917; opacity:0")}>
                    <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#6E6D67")} />
                    <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500")}>Week 1 readout</span>
                    <span style={css("flex:none; font-size:10.5px; color:#55544E")}>16:00</span>
                  </div>
                </div>
                <div style={css("min-width:0; height:142px; box-sizing:border-box; padding:8px; border-left:1px solid rgba(255,255,255,0.5); border-top:1px solid rgba(255,255,255,0.5); display:flex; flex-direction:column; gap:5px; transition:background .25s ease")}>
                  <div style={css("display:flex; align-items:center; justify-content:space-between; padding:0 2px 2px")}>
                    <span style={css("display:inline-flex; align-items:center; height:22px; font-size:11.5px; font-weight:500")}>13</span>
                    <span style={css("font-family:'IBM Plex Mono',monospace; font-size:9.5px; font-weight:500; color:#2C2B27")}>Day 6</span>
                  </div>
                  <div data-chip="1" data-day="6" style={css("position:relative; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.78); font-size:11.5px; color:#1A1917; opacity:0")}>
                    <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#7C5CE0")} />
                    <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500")}>Finance ops</span>
                    <span style={css("flex:none; font-size:10.5px; color:#55544E")}>10:00</span>
                  </div>
                  <div data-chip="1" data-day="6" style={css("position:relative; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.78); font-size:11.5px; color:#1A1917; opacity:0")}>
                    <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#7C5CE0")} />
                    <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500")}>Fund administrator</span>
                    <span style={css("flex:none; font-size:10.5px; color:#55544E")}>13:00</span>
                  </div>
                </div>
                <div style={css("min-width:0; height:142px; box-sizing:border-box; padding:8px; border-left:1px solid rgba(255,255,255,0.5); border-top:1px solid rgba(255,255,255,0.5); display:flex; flex-direction:column; gap:5px; transition:background .25s ease")}>
                  <div style={css("display:flex; align-items:center; justify-content:space-between; padding:0 2px 2px")}>
                    <span style={css("display:inline-flex; align-items:center; height:22px; font-size:11.5px; font-weight:500")}>14</span>
                    <span style={css("font-family:'IBM Plex Mono',monospace; font-size:9.5px; font-weight:500; color:#2C2B27")}>Day 7</span>
                  </div>
                  <div data-chip="1" data-day="7" style={css("position:relative; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.78); font-size:11.5px; color:#1A1917; opacity:0")}>
                    <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#7C5CE0")} />
                    <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500")}>Daily users</span>
                    <span style={css("flex:none; font-size:10.5px; color:#55544E")}>10:00</span>
                  </div>
                  <div data-chip="1" data-day="7" style={css("position:relative; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.78); font-size:11.5px; color:#1A1917; opacity:0")}>
                    <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#D98E1F")} />
                    <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500")}>LPA clause map</span>
                    <span style={css("flex:none; font-size:10.5px; color:#55544E")}>14:00</span>
                  </div>
                </div>
                <div style={css("min-width:0; height:142px; box-sizing:border-box; padding:8px; border-left:1px solid rgba(255,255,255,0.5); border-top:1px solid rgba(255,255,255,0.5); display:flex; flex-direction:column; gap:5px; transition:background .25s ease")}>
                  <div style={css("display:flex; align-items:center; justify-content:space-between; padding:0 2px 2px")}>
                    <span style={css("display:inline-flex; align-items:center; height:22px; font-size:11.5px; font-weight:500")}>15</span>
                    <span style={css("font-family:'IBM Plex Mono',monospace; font-size:9.5px; font-weight:500; color:#2C2B27")}>Day 8</span>
                  </div>
                  <div data-chip="1" data-day="8" style={css("position:relative; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.78); font-size:11.5px; color:#1A1917; opacity:0")}>
                    <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#D98E1F")} />
                    <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500")}>Regulator guidance</span>
                    <span style={css("flex:none; font-size:10.5px; color:#55544E")}>9:30</span>
                  </div>
                  <div data-chip="1" data-day="8" style={css("position:relative; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.78); font-size:11.5px; color:#1A1917; opacity:0")}>
                    <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#D98E1F")} />
                    <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500")}>Audit scope match</span>
                    <span style={css("flex:none; font-size:10.5px; color:#55544E")}>13:00</span>
                  </div>
                </div>
                <div style={css("min-width:0; height:142px; box-sizing:border-box; padding:8px; border-left:1px solid rgba(255,255,255,0.5); border-top:1px solid rgba(255,255,255,0.5); display:flex; flex-direction:column; gap:5px; transition:background .25s ease")}>
                  <div style={css("display:flex; align-items:center; justify-content:space-between; padding:0 2px 2px")}>
                    <span style={css("display:inline-flex; align-items:center; height:22px; font-size:11.5px; font-weight:500")}>16</span>
                    <span style={css("font-family:'IBM Plex Mono',monospace; font-size:9.5px; font-weight:500; color:#2C2B27")}>Day 9</span>
                  </div>
                  <div data-chip="1" data-day="9" style={css("position:relative; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.78); font-size:11.5px; color:#1A1917; opacity:0")}>
                    <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#D98E1F")} />
                    <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500")}>Cost each finding</span>
                    <span style={css("flex:none; font-size:10.5px; color:#55544E")}>9:30</span>
                  </div>
                  <div data-chip="1" data-day="9" style={css("position:relative; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.78); font-size:11.5px; color:#1A1917; opacity:0")}>
                    <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#157F52")} />
                    <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500")}>Draft disposition</span>
                    <span style={css("flex:none; font-size:10.5px; color:#55544E")}>13:00</span>
                  </div>
                  <div data-chip="1" data-day="9" style={css("position:relative; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.78); font-size:11.5px; color:#1A1917; opacity:0")}>
                    <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#157F52")} />
                    <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500")}>Review with CFO</span>
                    <span style={css("flex:none; font-size:10.5px; color:#55544E")}>16:00</span>
                  </div>
                </div>
                <div style={css("min-width:0; height:142px; box-sizing:border-box; padding:8px; border-left:1px solid rgba(255,255,255,0.5); border-top:1px solid rgba(255,255,255,0.5); display:flex; flex-direction:column; gap:5px; transition:background .25s ease")}>
                  <div style={css("display:flex; align-items:center; justify-content:space-between; padding:0 2px 2px")}>
                    <span style={css("display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px; border-radius:50%; background:#157F52; color:#FFFFFF; font-size:11px")}>17</span>
                    <span style={css("font-family:'IBM Plex Mono',monospace; font-size:9.5px; font-weight:500; color:#2C2B27")}>Day 10</span>
                  </div>
                  <div data-chip="1" data-day="10" data-green="1" style={css("position:relative; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.78); font-size:11.5px; color:#1A1917; opacity:0")}>
                    <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#157F52")} />
                    <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500")}>Disposition handed over</span>
                    <span style={css("flex:none; font-size:10.5px; color:#55544E")}>11:00</span>
                    <span style={css("position:absolute; inset:-1px; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:#12A05C; color:#FFFFFF; opacity:0")}>
                      <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#FFFFFF")} />
                      <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:600")}>Disposition handed over</span>
                      <span style={css("flex:none; font-size:10.5px")}>11:00</span>
                    </span>
                  </div>
                  <div data-chip="1" data-day="10" data-green="1" style={css("position:relative; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.78); font-size:11.5px; color:#1A1917; opacity:0")}>
                    <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#157F52")} />
                    <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500")}>Walkthrough</span>
                    <span style={css("flex:none; font-size:10.5px; color:#55544E")}>14:00</span>
                    <span style={css("position:absolute; inset:-1px; display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:6px; background:#12A05C; color:#FFFFFF; opacity:0")}>
                      <span style={css("flex:none; width:6px; height:6px; border-radius:50%; background:#FFFFFF")} />
                      <span style={css("flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:600")}>Walkthrough</span>
                      <span style={css("flex:none; font-size:10.5px")}>14:00</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div ref={v.auWin} style={css("position:absolute; left:0; right:0; top:102px; border-radius:11px; background:#FCFBF9; border:1px solid rgba(20,20,18,0.14); box-shadow:0 30px 74px rgba(20,20,18,0.22), 0 4px 12px rgba(20,20,18,0.12); overflow:hidden; opacity:0; will-change:transform")}>
              <div style={css("position:relative; display:flex; align-items:center; gap:8px; height:34px; padding:0 14px; background:rgba(20,20,18,0.045); border-bottom:1px solid rgba(20,20,18,0.08)")}>
                <span style={css("width:12px; height:12px; border-radius:50%; background:#FF5F57")} />
                <span style={css("width:12px; height:12px; border-radius:50%; background:#FEBC2E")} />
                <span style={css("width:12px; height:12px; border-radius:50%; background:#28C840")} />
                <span style={css("position:absolute; left:0; right:0; text-align:center; font-size:12.5px")}>Audit — LP Portal · day 10 of 10</span>
              </div>
              <AuditFindings ref={v.auFindings} pane={v.auPane} pack={v.auPack} />
            </div>
          </div>
        </div>
      </div>
      <p style={css("max-width:1280px; margin:20px auto 0; font-size:13.5px; color:var(--mut); line-height:1.6")}>
        Illustrative findings from a fund operations tool. Real audits are reported per component, with evidence attached to each line.
      </p>
    </section>
  );
}
