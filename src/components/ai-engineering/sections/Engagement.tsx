/* eslint-disable react-hooks/refs -- `v` carries the page logic's createRef() objects, which
   these components only hand to ref={…}; nothing reads .current during render. */
import { Fragment } from "react";
import type { AIEngineeringVals } from "@/motion/ai-engineering/ai-engineering.logic";
import { css } from "@/components/private-credit/css";
import { bgImage } from "../bg";

// 06 Engagement: two cards pinned for 400vh. The build card waits as a spine on the right and
// rolls over the audit card, which folds into a spine on the left (stepEngage). The audit card
// fills a mini calendar; the build card redraws a platform snippet (enRenderBuild) that ships
// one station per fortnight.

// The cards' paintings: CSS backgrounds, as in the reference, through the optimiser (bg.ts).
// By path, not import: Turbopack does not read AVIF for a static import (the optimiser does).
const BG = {
  ctaAudit: bgImage("/img/ai-engineering/cta-d.avif", 3420 / 2317),
  ctaBuild: bgImage("/img/ai-engineering/cta-b.avif", 2048 / 1570),
};

export function Engagement({ v }: { v: AIEngineeringVals }) {
  return (
    <section id="engagement" data-screen-label="Engagement" style={css("padding:118px 40px; border-bottom:1px solid var(--line2)")}>
      <div style={css("max-width:1280px; margin:0 auto")}>
        <div style={css("font-size:13px; letter-spacing:-0.005em; color:var(--mut)")}>06 / Engagement</div>
        <h2 style={css("margin:22px 0 0; max-width:760px; font-size:clamp(30px,3.1vw,44px); font-weight:400; letter-spacing:-0.032em; line-height:1.06")}>Two ways in. Neither of them starts with a platform licence.</h2>
      </div>
      <div ref={v.enTrack} data-track="engagement" style={css("position:relative; min-height:400vh; margin:62px 0 0")}>
        <div style={css("position:sticky; top:68px; height:calc(100vh - 68px); min-height:600px; display:flex; align-items:center; box-sizing:border-box; padding:24px 0")}>
          <div ref={v.enStage} data-ai-stage="engagement" style={css("position:relative; width:100%; max-width:1280px; margin:0 auto; height:100%; max-height:600px; overflow:hidden")}>
            <div ref={v.enA} data-ai-card="" data-screen-label="Engagement: The audit" style={css(`position:absolute; left:0; top:0; bottom:0; width:calc(100% - clamp(56px, 7.2vw, 104px)); overflow:hidden; box-sizing:border-box; transform-origin:left center; will-change:transform; background:#DCEAEE ${BG.ctaAudit} center / cover no-repeat; border:1px solid rgba(20,20,18,0.13)`)}>
              <div style={css("position:absolute; inset:0; background:linear-gradient(90deg, rgba(246,245,242,0.74) 0%, rgba(246,245,242,0.56) 55%, rgba(246,245,242,0.3) 100%); pointer-events:none")} />
              <div ref={v.enAi} data-ai-content="" style={css("position:relative; height:100%; box-sizing:border-box; padding:clamp(24px, 3.6vh, 40px) clamp(28px, 4vw, 56px) clamp(22px, 3.4vh, 36px); display:flex; flex-direction:column; gap:22px")}>
                <div style={css("display:flex; justify-content:space-between; gap:24px; font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:11.5px; letter-spacing:0.04em; text-transform:uppercase; color:#1A1917")}><span>Engagement 01</span><span>2 weeks · fixed fee</span></div>
                <div data-ai-row="" style={css("flex:1 1 auto; min-height:0; display:flex; gap:clamp(24px, 3.4vw, 48px); align-items:stretch")}>
                  <div data-ai-col="" style={css("flex:0 0 clamp(300px, 34%, 372px); min-width:0; display:flex; flex-direction:column; justify-content:center")}>
                    <h3 style={css("margin:0; font-size:clamp(44px, min(4.6vw, 7.4vh), 64px); font-weight:400; letter-spacing:-0.045em; line-height:0.96")}>The audit</h3>
                    <p ref={v.enAx} style={css("margin:clamp(14px, 2.6vh, 24px) 0 0; font-size:clamp(17px, min(1.55vw, 2.6vh), 22px); letter-spacing:-0.015em; line-height:1.4; color:#1A1917; text-wrap:pretty")}>
                      {v.enAWords.map((w, i) => (
                        <Fragment key={i}>
                          <span style={css("opacity:0.18")}>{w}{" "}</span>
                        </Fragment>
                      ))}
                    </p>
                    <div style={css("display:flex; margin:clamp(18px, 3vh, 30px) 0 0")}>
                      <a className="hover:bg-[#157F52]! hover:text-white!" href="mailto:hello@3264.ai" style={css("display:inline-flex; align-items:center; height:46px; padding:0 24px; background:#1A1917; color:#FFFFFF; border-radius:6px; font-size:15px; font-weight:500; letter-spacing:-0.01em")}>Book an audit</a>
                    </div>
                  </div>
                  <div style={css("flex:1 1 auto; min-width:0; display:flex; align-items:center; justify-content:center")}>
                    <div ref={v.enCal} aria-hidden="true" style={css("flex:none; width:min(460px, 100%); border-radius:14px; background:rgba(255,255,255,0.3); border:1px solid rgba(255,255,255,0.72); backdrop-filter:blur(18px) saturate(1.1); -webkit-backdrop-filter:blur(18px) saturate(1.1); box-shadow:0 26px 70px -20px rgba(30,60,70,0.3); overflow:hidden")}>
                      <div style={css("display:flex; align-items:center; gap:12px; padding:14px 16px; border-bottom:1px solid rgba(255,255,255,0.55)")}>
                        <div style={css("flex:none; width:36px; border:1px solid rgba(255,255,255,0.7); border-radius:7px; overflow:hidden; text-align:center; background:rgba(255,255,255,0.5)")}>
                          <div style={css("padding:2px 0; font-size:8px; letter-spacing:0.04em; color:#55544E; background:rgba(255,255,255,0.4)")}>OCT</div>
                          <div style={css("padding:1px 0 3px; font-size:13px; letter-spacing:-0.02em")}>6</div>
                        </div>
                        <div style={css("min-width:0")}>
                          <div style={css("font-size:13.5px; letter-spacing:-0.015em")}>Audit — Northgate Capital</div>
                          <div style={css("margin:2px 0 0; font-size:11px; color:#2C2B27")}>10 working days · fixed fee</div>
                        </div>
                      </div>
                      <div style={css("display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); margin-left:-1px")}>
                        <div style={css("padding:5px 0; text-align:center; font-size:10px; color:#2C2B27; border-left:1px solid rgba(255,255,255,0.5)")}>Mon</div>
                        <div style={css("padding:5px 0; text-align:center; font-size:10px; color:#2C2B27; border-left:1px solid rgba(255,255,255,0.5)")}>Tue</div>
                        <div style={css("padding:5px 0; text-align:center; font-size:10px; color:#2C2B27; border-left:1px solid rgba(255,255,255,0.5)")}>Wed</div>
                        <div style={css("padding:5px 0; text-align:center; font-size:10px; color:#2C2B27; border-left:1px solid rgba(255,255,255,0.5)")}>Thu</div>
                        <div style={css("padding:5px 0; text-align:center; font-size:10px; color:#2C2B27; border-left:1px solid rgba(255,255,255,0.5)")}>Fri</div>
                      </div>
                      <div style={css("display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); margin-left:-1px")}>
                        <div data-cell="1" style={css("min-width:0; height:100px; box-sizing:border-box; padding:9px 9px; border-left:1px solid rgba(255,255,255,0.5); border-top:1px solid rgba(255,255,255,0.5); display:flex; flex-direction:column; gap:9px")}>
                          <div style={css("display:flex; align-items:center; height:16px")}><span style={css("font-size:10.5px; font-weight:500; color:#1A1917")}>6</span></div>
                          <div data-chip="1" data-day="1" style={css("width:100%; height:8px; border-radius:4px; background:rgba(20,20,18,0.2); opacity:0")} />
                          <div data-chip="1" data-day="1" style={css("width:68%; height:8px; border-radius:4px; background:rgba(20,20,18,0.2); opacity:0")} />
                          <div data-chip="1" data-day="1" style={css("width:84%; height:8px; border-radius:4px; background:rgba(20,20,18,0.2); opacity:0")} />
                        </div>
                        <div data-cell="1" style={css("min-width:0; height:100px; box-sizing:border-box; padding:9px 9px; border-left:1px solid rgba(255,255,255,0.5); border-top:1px solid rgba(255,255,255,0.5); display:flex; flex-direction:column; gap:9px")}>
                          <div style={css("display:flex; align-items:center; height:16px")}><span style={css("font-size:10.5px; font-weight:500; color:#1A1917")}>7</span></div>
                          <div data-chip="1" data-day="2" style={css("width:68%; height:8px; border-radius:4px; background:rgba(20,20,18,0.4); opacity:0")} />
                          <div data-chip="1" data-day="2" style={css("width:84%; height:8px; border-radius:4px; background:rgba(20,20,18,0.4); opacity:0")} />
                        </div>
                        <div data-cell="1" style={css("min-width:0; height:100px; box-sizing:border-box; padding:9px 9px; border-left:1px solid rgba(255,255,255,0.5); border-top:1px solid rgba(255,255,255,0.5); display:flex; flex-direction:column; gap:9px")}>
                          <div style={css("display:flex; align-items:center; height:16px")}><span style={css("font-size:10.5px; font-weight:500; color:#1A1917")}>8</span></div>
                          <div data-chip="1" data-day="3" style={css("width:84%; height:8px; border-radius:4px; background:rgba(20,20,18,0.4); opacity:0")} />
                          <div data-chip="1" data-day="3" style={css("width:100%; height:8px; border-radius:4px; background:rgba(20,20,18,0.4); opacity:0")} />
                        </div>
                        <div data-cell="1" style={css("min-width:0; height:100px; box-sizing:border-box; padding:9px 9px; border-left:1px solid rgba(255,255,255,0.5); border-top:1px solid rgba(255,255,255,0.5); display:flex; flex-direction:column; gap:9px")}>
                          <div style={css("display:flex; align-items:center; height:16px")}><span style={css("font-size:10.5px; font-weight:500; color:#1A1917")}>9</span></div>
                          <div data-chip="1" data-day="4" style={css("width:100%; height:8px; border-radius:4px; background:rgba(20,20,18,0.4); opacity:0")} />
                          <div data-chip="1" data-day="4" style={css("width:68%; height:8px; border-radius:4px; background:rgba(20,20,18,0.4); opacity:0")} />
                          <div data-chip="1" data-day="4" style={css("width:84%; height:8px; border-radius:4px; background:rgba(20,20,18,0.4); opacity:0")} />
                        </div>
                        <div data-cell="1" style={css("min-width:0; height:100px; box-sizing:border-box; padding:9px 9px; border-left:1px solid rgba(255,255,255,0.5); border-top:1px solid rgba(255,255,255,0.5); display:flex; flex-direction:column; gap:9px")}>
                          <div style={css("display:flex; align-items:center; height:16px")}><span style={css("font-size:10.5px; font-weight:500; color:#1A1917")}>10</span></div>
                          <div data-chip="1" data-day="5" style={css("width:68%; height:8px; border-radius:4px; background:rgba(20,20,18,0.58); opacity:0")} />
                          <div data-chip="1" data-day="5" style={css("width:84%; height:8px; border-radius:4px; background:rgba(20,20,18,0.58); opacity:0")} />
                          <div data-chip="1" data-day="5" style={css("width:100%; height:8px; border-radius:4px; background:rgba(20,20,18,0.2); opacity:0")} />
                        </div>
                        <div data-cell="1" style={css("min-width:0; height:100px; box-sizing:border-box; padding:9px 9px; border-left:1px solid rgba(255,255,255,0.5); border-top:1px solid rgba(255,255,255,0.5); display:flex; flex-direction:column; gap:9px")}>
                          <div style={css("display:flex; align-items:center; height:16px")}><span style={css("font-size:10.5px; font-weight:500; color:#1A1917")}>13</span></div>
                          <div data-chip="1" data-day="6" style={css("width:84%; height:8px; border-radius:4px; background:rgba(20,20,18,0.58); opacity:0")} />
                          <div data-chip="1" data-day="6" style={css("width:100%; height:8px; border-radius:4px; background:rgba(20,20,18,0.58); opacity:0")} />
                        </div>
                        <div data-cell="1" style={css("min-width:0; height:100px; box-sizing:border-box; padding:9px 9px; border-left:1px solid rgba(255,255,255,0.5); border-top:1px solid rgba(255,255,255,0.5); display:flex; flex-direction:column; gap:9px")}>
                          <div style={css("display:flex; align-items:center; height:16px")}><span style={css("font-size:10.5px; font-weight:500; color:#1A1917")}>14</span></div>
                          <div data-chip="1" data-day="7" style={css("width:100%; height:8px; border-radius:4px; background:rgba(20,20,18,0.58); opacity:0")} />
                          <div data-chip="1" data-day="7" style={css("width:68%; height:8px; border-radius:4px; background:rgba(20,20,18,0.76); opacity:0")} />
                        </div>
                        <div data-cell="1" style={css("min-width:0; height:100px; box-sizing:border-box; padding:9px 9px; border-left:1px solid rgba(255,255,255,0.5); border-top:1px solid rgba(255,255,255,0.5); display:flex; flex-direction:column; gap:9px")}>
                          <div style={css("display:flex; align-items:center; height:16px")}><span style={css("font-size:10.5px; font-weight:500; color:#1A1917")}>15</span></div>
                          <div data-chip="1" data-day="8" style={css("width:68%; height:8px; border-radius:4px; background:rgba(20,20,18,0.76); opacity:0")} />
                          <div data-chip="1" data-day="8" style={css("width:84%; height:8px; border-radius:4px; background:rgba(20,20,18,0.76); opacity:0")} />
                        </div>
                        <div data-cell="1" style={css("min-width:0; height:100px; box-sizing:border-box; padding:9px 9px; border-left:1px solid rgba(255,255,255,0.5); border-top:1px solid rgba(255,255,255,0.5); display:flex; flex-direction:column; gap:9px")}>
                          <div style={css("display:flex; align-items:center; height:16px")}><span style={css("font-size:10.5px; font-weight:500; color:#1A1917")}>16</span></div>
                          <div data-chip="1" data-day="9" style={css("width:84%; height:8px; border-radius:4px; background:rgba(20,20,18,0.76); opacity:0")} />
                          <div data-chip="1" data-day="9" style={css("width:100%; height:8px; border-radius:4px; background:rgba(20,20,18,0.9); opacity:0")} />
                          <div data-chip="1" data-day="9" style={css("width:68%; height:8px; border-radius:4px; background:rgba(20,20,18,0.9); opacity:0")} />
                        </div>
                        <div data-cell="1" style={css("min-width:0; height:100px; box-sizing:border-box; padding:9px 9px; border-left:1px solid rgba(255,255,255,0.5); border-top:1px solid rgba(255,255,255,0.5); display:flex; flex-direction:column; gap:9px")}>
                          <div style={css("display:flex; align-items:center; height:16px")}>
                            <span style={css("display:inline-flex; align-items:center; justify-content:center; width:16px; height:16px; border-radius:50%; background:#157F52; color:#FFFFFF; font-size:9.5px")}>17</span>
                          </div>
                          <div data-chip="1" data-day="10" data-green="1" style={css("position:relative; width:100%; height:8px; border-radius:4px; background:rgba(21,127,82,0.35); opacity:0")}><span style={css("position:absolute; inset:0; border-radius:4px; background:#12A05C; opacity:0")} /></div>
                          <div data-chip="1" data-day="10" data-green="1" style={css("position:relative; width:68%; height:8px; border-radius:4px; background:rgba(21,127,82,0.35); opacity:0")}><span style={css("position:absolute; inset:0; border-radius:4px; background:#12A05C; opacity:0")} /></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div data-ai-facts="" style={css("display:grid; grid-template-columns:repeat(3,1fr); gap:32px; border-top:1px solid rgba(20,20,18,0.22); padding:16px 0 0")}>
                  <div>
                    <div style={css("font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27")}>Deliverable</div>
                    <div style={css("margin:8px 0 0; font-size:clamp(15px, 1.4vw, 20px); letter-spacing:-0.02em; color:#1A1917")}>Disposition and plan</div>
                  </div>
                  <div>
                    <div style={css("font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27")}>Access needed</div>
                    <div style={css("margin:8px 0 0; font-size:clamp(15px, 1.4vw, 20px); letter-spacing:-0.02em; color:#1A1917")}>Read-only</div>
                  </div>
                  <div>
                    <div style={css("font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27")}>Ends in a build</div>
                    <div style={css("margin:8px 0 0; font-size:clamp(15px, 1.4vw, 20px); letter-spacing:-0.02em; color:#46453F")}>Not necessarily</div>
                  </div>
                </div>
              </div>
              <button type="button" aria-label="Show the audit" tabIndex={-1} aria-hidden="true" data-ai-spine="" className="hover:bg-[rgba(255,255,255,0.3)]! focus-visible:outline-offset-[-4px]" ref={v.enAs} onClick={v.enJumpA} style={css("position:absolute; left:0; top:0; bottom:0; width:clamp(56px, 7.2vw, 104px); box-sizing:border-box; padding:30px 0 28px; display:flex; flex-direction:column; align-items:center; justify-content:space-between; opacity:0; pointer-events:none; cursor:pointer")}>
                <span style={css("font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:12px; color:#1A1917")}>01</span>
                <span style={css("writing-mode:vertical-rl; transform:rotate(180deg); font-size:32px; letter-spacing:-0.03em; color:#1A1917; white-space:nowrap")}>The audit</span>
                <span style={css("writing-mode:vertical-rl; transform:rotate(180deg); font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27; white-space:nowrap")}>2 weeks · fixed fee</span>
              </button>
            </div>
            <div ref={v.enB} data-ai-card="" data-screen-label="Engagement: The build" style={css(`position:absolute; left:clamp(56px, 7.2vw, 104px); right:0; top:0; bottom:0; overflow:hidden; box-sizing:border-box; will-change:transform; transform:translateX(calc(100% - clamp(56px, 7.2vw, 104px))); box-shadow:-18px 0 48px rgba(20,20,18,0.16); background:#EAE6DE ${BG.ctaBuild} center / cover no-repeat; border:1px solid rgba(20,20,18,0.13)`)}>
              <div style={css("position:absolute; inset:0; background:linear-gradient(90deg, rgba(248,246,240,0.5) 0%, rgba(248,246,240,0.3) 50%, rgba(248,246,240,0.1) 100%); pointer-events:none")} />
              <div ref={v.enBi} data-ai-content="" style={css("position:relative; height:100%; box-sizing:border-box; padding:clamp(24px, 3.6vh, 40px) clamp(28px, 4vw, 56px) clamp(22px, 3.4vh, 36px); display:flex; flex-direction:column; gap:22px; opacity:0")}>
                <div style={css("display:flex; justify-content:space-between; gap:24px; font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:11.5px; letter-spacing:0.04em; text-transform:uppercase; color:#1A1917")}><span>Engagement 02</span><span>per capability · fortnightly</span></div>
                <div data-ai-row="" style={css("flex:1 1 auto; min-height:0; display:flex; gap:clamp(24px, 3.4vw, 48px); align-items:stretch")}>
                  <div data-ai-col="" style={css("flex:0 0 clamp(300px, 34%, 372px); min-width:0; display:flex; flex-direction:column; justify-content:center")}>
                    <h3 style={css("margin:0; font-size:clamp(44px, min(4.6vw, 7.4vh), 64px); font-weight:400; letter-spacing:-0.045em; line-height:0.96")}>The build</h3>
                    <p ref={v.enBx} style={css("margin:clamp(14px, 2.6vh, 24px) 0 0; font-size:clamp(17px, min(1.55vw, 2.6vh), 22px); letter-spacing:-0.015em; line-height:1.4; color:#1A1917; text-wrap:pretty")}>
                      {v.enBWords.map((w, i) => (
                        <Fragment key={i}>
                          <span style={css("opacity:0.18")}>{w}{" "}</span>
                        </Fragment>
                      ))}
                    </p>
                    <div style={css("display:flex; margin:clamp(18px, 3vh, 30px) 0 0")}>
                      <a className="hover:bg-[#157F52]! hover:text-white!" href="mailto:hello@3264.ai" style={css("display:inline-flex; align-items:center; height:46px; padding:0 24px; background:#1A1917; color:#FFFFFF; border-radius:6px; font-size:15px; font-weight:500; letter-spacing:-0.01em")}>Book a call</a>
                    </div>
                  </div>
                  <div style={css("flex:1 1 auto; min-width:0; display:flex; align-items:center; justify-content:center")}>
                    <div ref={v.enBld} aria-hidden="true" style={css("position:relative; flex:none; width:min(540px, 100%); aspect-ratio:715 / 425")} />
                  </div>
                </div>
                <div data-ai-facts="" style={css("display:grid; grid-template-columns:repeat(3,1fr); gap:32px; border-top:1px solid rgba(20,20,18,0.22); padding:16px 0 0")}>
                  <div>
                    <div style={css("font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27")}>Runs in</div>
                    <div style={css("margin:8px 0 0; font-size:clamp(15px, 1.4vw, 20px); letter-spacing:-0.02em; color:#1A1917")}>Your environment</div>
                  </div>
                  <div>
                    <div style={css("font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27")}>Interface</div>
                    <div style={css("margin:8px 0 0; font-size:clamp(15px, 1.4vw, 20px); letter-spacing:-0.02em; color:#1A1917")}>Kept where sound</div>
                  </div>
                  <div>
                    <div style={css("font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27")}>Handover</div>
                    <div style={css("margin:8px 0 0; font-size:clamp(15px, 1.4vw, 20px); letter-spacing:-0.02em; color:#1A1917")}>Suite and documentation</div>
                  </div>
                </div>
              </div>
              <button type="button" aria-label="Show the build" data-ai-spine="" className="hover:bg-[rgba(255,255,255,0.3)]! focus-visible:outline-offset-[-4px]" ref={v.enBs} onClick={v.enJumpB} style={css("position:absolute; left:0; top:0; bottom:0; width:clamp(56px, 7.2vw, 104px); box-sizing:border-box; padding:30px 0 28px; display:flex; flex-direction:column; align-items:center; justify-content:space-between; cursor:pointer")}>
                <span style={css("font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:12px; color:#1A1917")}>02</span>
                <span style={css("writing-mode:vertical-rl; transform:rotate(180deg); font-size:32px; letter-spacing:-0.03em; color:#1A1917; white-space:nowrap")}>The build</span>
                <span style={css("writing-mode:vertical-rl; transform:rotate(180deg); font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27; white-space:nowrap")}>per capability · fortnightly</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
