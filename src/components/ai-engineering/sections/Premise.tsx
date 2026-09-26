/* eslint-disable react-hooks/refs -- `v` carries the page logic's createRef() objects, which
   these components only hand to ref={…}; nothing reads .current during render. */
import { Fragment } from "react";
import type { AIEngineeringVals } from "@/motion/ai-engineering/ai-engineering.logic";
import { css } from "@/components/private-credit/css";
import { bgImage } from "../bg";
import whatChanged from "../../../../public/img/ai-engineering/what-changed-wash.png";
import whatProduced from "../../../../public/img/ai-engineering/what-produced-wash.webp";
// The same painting as the Private Credit stages: one file, one cached URL.
import valleyPastel from "../../../../public/img/private-credit/valley-pastel.png";

// 01 Premise: three statement cards pinned for 760vh. Each later card rolls in from the
// right over the one before (stepStack), each statement inks in word by word, and each card's
// app window is a fixed-size stage scaled to fit its column. All window copy is designed
// illustrative content, verbatim from the reference.

// The cards' paintings: CSS backgrounds, as in the reference, through the optimiser (bg.ts).
const BG = {
  whatChanged: bgImage(whatChanged),
  whatProduced: bgImage(whatProduced),
  valleyPastel: bgImage(valleyPastel),
};

// Cards 2 and 3 are rendered where stepStack puts them at the top of the track, rolled off to
// the right, so the server HTML shows card 1 (not card 3, last in the DOM) before the logic
// runs. It also matches the reference's first paint, which Chrome's raster of these
// will-change layers depends on: rasterised untransformed first, their text sits a fraction
// of a pixel off the reference's for as long as the layer lives.
export function Premise({ v }: { v: AIEngineeringVals }) {
  return (
    <section data-screen-label="Premise" style={css("padding:118px 40px; border-bottom:1px solid var(--line2)")}>
      <div style={css("max-width:1280px; margin:0 auto")}>
        <div style={css("display:flex; gap:72px; flex-wrap:wrap; align-items:flex-end")}>
          <div style={css("flex:1 1 300px; min-width:0")}>
            <div style={css("font-size:13px; letter-spacing:-0.005em; color:var(--mut)")}>01 / Premise</div>
            <h2 style={css("margin:22px 0 0; font-size:clamp(30px,3.1vw,44px); font-weight:400; letter-spacing:-0.032em; line-height:1.06")}>Two things changed.<br />One thing did not.</h2>
          </div>
          <p style={css("flex:2 1 460px; min-width:0; margin:0; max-width:560px; font-size:16.5px; line-height:1.6; color:var(--sec); text-wrap:pretty")}>
            We do not tell executives to stop building. The instinct is right and the artefacts are useful. They are drafts, and drafts need an engineer before they hold client money.
          </p>
        </div>
      </div>
      <div ref={v.stackTrack} data-track="premise" style={css("position:relative; min-height:760vh; margin:62px 0 0")}>
        <div style={css("position:sticky; top:68px; height:calc(100vh - 68px); min-height:600px; display:flex; align-items:center; box-sizing:border-box; padding:24px 0")}>
          <div style={css("position:relative; width:100%; max-width:1280px; margin:0 auto; height:100%; max-height:780px")}>
            <div ref={v.wcCard} data-ai-card="" data-screen-label="What changed" style={css(`transform-origin:left center; will-change:transform; box-shadow:-18px 0 48px rgba(20,20,18,0.16); position:absolute; inset:0; overflow:hidden; box-sizing:border-box; background:#EEF0E6 ${BG.whatChanged} center / cover no-repeat; border:1px solid var(--line); padding:clamp(32px,4.4vw,64px); display:flex; gap:clamp(24px,3.4vw,56px); align-items:stretch; flex-wrap:nowrap`)}>
              <div style={css("flex:1 1 300px; min-width:0; display:flex; flex-direction:column; justify-content:center; gap:32px")}>
                <div style={css("font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:11.5px; letter-spacing:0.04em; text-transform:uppercase; color:#2C2B27")}>What changed</div>
                <p ref={v.wcText} style={css("margin:0; font-size:clamp(30px,3.9vw,58px); font-weight:400; letter-spacing:-0.034em; line-height:1.1; color:#1A1917; text-wrap:pretty")}>
                  {v.wcWords.map((w, i) => (
                    <Fragment key={i}>
                      <span style={css("opacity:0.16; transition:opacity .18s linear")}>{w}{" "}</span>
                    </Fragment>
                  ))}
                </p>
              </div>
              <div ref={v.wcFit} aria-hidden="true" data-ai-fit="600 / 470" style={css("flex:1.1 1 380px; min-width:0; min-height:0; position:relative")}>
                <div ref={v.wcStage} style={css("position:absolute; left:0; top:0; width:600px; height:470px; transform-origin:top left; display:flex; align-items:center")}>
                  <div style={css("width:100%; border-radius:11px; background:#FCFBF9; border:1px solid rgba(20,20,18,0.14); box-shadow:0 30px 74px rgba(20,20,18,0.22), 0 4px 12px rgba(20,20,18,0.12); overflow:hidden")}>
                    <div style={css("position:relative; display:flex; align-items:center; gap:8px; height:32px; padding:0 13px; background:rgba(20,20,18,0.045); border-bottom:1px solid rgba(20,20,18,0.08)")}>
                      <span style={css("width:11px; height:11px; border-radius:50%; background:#FF5F57")} />
                      <span style={css("width:11px; height:11px; border-radius:50%; background:#FEBC2E")} />
                      <span style={css("width:11px; height:11px; border-radius:50%; background:#28C840")} />
                      <span style={css("position:absolute; left:0; right:0; text-align:center; font-size:12px")}>AI app builder — recon-tool</span>
                    </div>
                    <div style={css("padding:22px 22px 18px; background:#FFFFFF; display:flex; flex-direction:column; gap:18px")}>
                      <div style={css("display:flex; gap:12px")}>
                        <span style={css("flex:none; width:28px; height:28px; border-radius:50%; background:#1A1917; color:#FFFFFF; font-size:11px; display:flex; align-items:center; justify-content:center")}>MO</span>
                        <div style={css("min-width:0")}>
                          <div style={css("font-size:11px; color:#6E6D67")}>M. Oyelaran · COO · 12:41</div>
                          <div style={css("margin:5px 0 0; font-size:14px; line-height:1.5; color:#2C2B27")}>
                            {"Build a tool that reconciles the custodian file against our fund ledger. "}
                            <span style={css("background:rgba(242,196,92,0.45)")}>Skip the login for now, it slows me down.</span>
                            {" Here's the database: "}
                            <span style={css("background:rgba(242,196,92,0.45); font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:12px")}>postgres://admin:Nrthg8te!@prod-ledger</span>
                          </div>
                        </div>
                      </div>
                      <div style={css("display:flex; gap:12px")}>
                        <span style={css("flex:none; width:28px; height:28px; border-radius:50%; background:rgba(20,20,18,0.08); display:flex; align-items:center; justify-content:center")}><span style={css("width:9px; height:9px; background:#1A1917; transform:rotate(45deg)")} /></span>
                        <div style={css("min-width:0; flex:1 1 auto")}>
                          <div style={css("font-size:11px; color:#6E6D67")}>Builder · 12:43</div>
                          <div style={css("margin:5px 0 0; font-size:14px; line-height:1.5; color:#2C2B27")}>
                            {"Done. Your reconciliation tool is live and connected to "}
                            <span style={css("background:rgba(242,196,92,0.45)")}>prod-ledger with full admin access</span>
                            . I removed authentication as requested.
                          </div>
                          <div style={css("margin:12px 0 0; border:1px solid rgba(20,20,18,0.1); border-radius:8px; overflow:hidden")}>
                            <div style={css("display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 12px; background:rgba(20,20,18,0.025)")}>
                              <span style={css("font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:11.5px")}>recon-tool.app</span>
                              <span style={css("padding:3px 8px; border-radius:4px; background:rgba(242,196,92,0.45); font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:9.5px; letter-spacing:0.05em; text-transform:uppercase")}>Public link</span>
                            </div>
                            <div style={css("display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:rgba(20,20,18,0.08); border-top:1px solid rgba(20,20,18,0.08)")}>
                              <div style={css("background:#FFFFFF; padding:9px 12px")}>
                                <div style={css("font-size:10px; color:#6E6D67")}>Matched</div>
                                <div style={css("margin:2px 0 0; font-size:15px; font-variant-numeric:tabular-nums")}>4,812</div>
                              </div>
                              <div style={css("background:#FFFFFF; padding:9px 12px")}>
                                <div style={css("font-size:10px; color:#6E6D67")}>Breaks</div>
                                <div style={css("margin:2px 0 0; font-size:15px; font-variant-numeric:tabular-nums")}>37</div>
                              </div>
                              <div style={css("background:#FFFFFF; padding:9px 12px")}>
                                <div style={css("font-size:10px; color:#6E6D67")}>Built in</div>
                                <div style={css("margin:2px 0 0; font-size:15px; font-variant-numeric:tabular-nums")}>2 min</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={css("display:flex; align-items:center; gap:10px; padding:12px 16px; border-top:1px solid rgba(20,20,18,0.08); background:#FCFBF9")}>
                      <span style={css("flex:1 1 auto; padding:9px 12px; border:1px solid rgba(20,20,18,0.12); border-radius:7px; background:#FFFFFF; font-size:12.5px; color:#6E6D67")}>Now share it with the fund admin…</span>
                      <span style={css("padding:9px 14px; border-radius:7px; background:#1A1917; color:#FFFFFF; font-size:12px")}>Send</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div ref={v.wpCard} data-ai-card="" data-screen-label="What that produced" style={css(`transform:translateX(108.00%) scale(1.0000); transform-origin:left center; will-change:transform; box-shadow:-18px 0 48px rgba(20,20,18,0.16); position:absolute; inset:0; overflow:hidden; box-sizing:border-box; background:#F4A27A ${BG.whatProduced} center / cover no-repeat; border:1px solid var(--line); padding:clamp(32px,4.4vw,64px); display:flex; gap:clamp(24px,3.4vw,56px); align-items:stretch; flex-wrap:nowrap`)}>
              <div style={css("flex:1 1 300px; min-width:0; display:flex; flex-direction:column; justify-content:center; gap:32px")}>
                <div style={css("font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:11.5px; letter-spacing:0.04em; text-transform:uppercase; color:#1A1917")}>What that produced</div>
                <p ref={v.wpText} style={css("margin:0; font-size:clamp(30px,3.7vw,56px); font-weight:400; letter-spacing:-0.034em; line-height:1.12; color:#1A1917; text-wrap:pretty")}>
                  {v.wpWords.map((w, i) => (
                    <Fragment key={i}>
                      <span style={css("opacity:0.2; transition:opacity .18s linear")}>{w}{" "}</span>
                    </Fragment>
                  ))}
                </p>
              </div>
              <div ref={v.wpFit} aria-hidden="true" data-ai-fit="760 / 600" style={css("flex:1.15 1 380px; min-width:0; min-height:0; position:relative")}>
                <div ref={v.wpStage} style={css("position:absolute; left:0; top:0; width:760px; height:600px; transform-origin:top left")}>
                  <div ref={v.wpPortal} style={css("position:absolute; left:20px; top:60px; width:720px; height:480px; border-radius:11px; background:#FCFBF9; border:1px solid rgba(20,20,18,0.14); box-shadow:0 26px 64px rgba(20,20,18,0.22), 0 4px 12px rgba(20,20,18,0.13); overflow:hidden; display:flex; flex-direction:column; opacity:0")}>
                    <div style={css("position:relative; display:flex; align-items:center; gap:8px; height:32px; padding:0 14px; background:rgba(20,20,18,0.045); border-bottom:1px solid rgba(20,20,18,0.08)")}>
                      <span style={css("width:12px; height:12px; border-radius:50%; background:#FF5F57")} />
                      <span style={css("width:12px; height:12px; border-radius:50%; background:#FEBC2E")} />
                      <span style={css("width:12px; height:12px; border-radius:50%; background:#28C840")} />
                      <span style={css("position:absolute; left:0; right:0; text-align:center; font-size:12.5px; color:#1A1917; pointer-events:none")}>LP Portal — Northgate Capital</span>
                    </div>
                    <div style={css("flex:1 1 auto; min-height:0; display:flex")}>
                      <div style={css("flex:0 0 164px; border-right:1px solid rgba(20,20,18,0.08); padding:18px 0; background:rgba(20,20,18,0.015); display:flex; flex-direction:column; gap:2px; font-size:12.5px; color:var(--sec)")}>
                        <div style={css("display:flex; align-items:center; gap:9px; padding:0 16px 14px; font-size:13.5px; font-weight:600; letter-spacing:-0.01em; color:#1A1917")}><span style={css("width:9px; height:9px; background:#1A1917; transform:rotate(45deg)")} />Northgate</div>
                        <div style={css("padding:7px 16px; background:rgba(20,20,18,0.06); color:#1A1917")}>Overview</div>
                        <div style={css("padding:7px 16px")}>Commitments</div>
                        <div style={css("padding:7px 16px")}>Capital calls</div>
                        <div style={css("padding:7px 16px")}>Distributions</div>
                        <div style={css("padding:7px 16px")}>Documents</div>
                        <div style={css("margin-top:auto; padding:0 16px; font-size:11px; line-height:1.45; color:var(--mut)")}>Signed in as<br /><span style={css("color:#1A1917")}>Ashfield Pension Trust</span></div>
                      </div>
                      <div style={css("flex:1 1 auto; min-width:0; padding:20px 24px")}>
                        <div style={css("display:flex; align-items:baseline; justify-content:space-between; gap:12px")}>
                          <div style={css("font-size:17px; letter-spacing:-0.022em; color:#1A1917")}>Ashfield Pension Trust</div>
                          <div style={css("font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10.5px; color:var(--mut)")}>Fund III · Q3</div>
                        </div>
                        <div style={css("display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin:16px 0 0")}>
                          <div style={css("padding:12px 14px; border:1px solid rgba(20,20,18,0.09); border-radius:7px; background:#FFFFFF")}>
                            <div style={css("font-size:11px; color:var(--mut)")}>Commitment</div>
                            <div style={css("margin:4px 0 0; font-size:20px; letter-spacing:-0.025em; font-variant-numeric:tabular-nums")}>25.0m</div>
                          </div>
                          <div style={css("padding:12px 14px; border:1px solid rgba(20,20,18,0.09); border-radius:7px; background:#FFFFFF")}>
                            <div style={css("font-size:11px; color:var(--mut)")}>Called</div>
                            <div style={css("margin:4px 0 0; font-size:20px; letter-spacing:-0.025em; font-variant-numeric:tabular-nums")}>14.2m</div>
                          </div>
                          <div style={css("padding:12px 14px; border:1px solid rgba(20,20,18,0.09); border-radius:7px; background:#FFFFFF")}>
                            <div style={css("font-size:11px; color:var(--mut)")}>NAV</div>
                            <div style={css("margin:4px 0 0; font-size:20px; letter-spacing:-0.025em; font-variant-numeric:tabular-nums")}>16.9m</div>
                          </div>
                        </div>
                        <div style={css("margin:22px 0 0; font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10px; letter-spacing:0.05em; text-transform:uppercase; color:var(--mut)")}>Capital calls</div>
                        <div style={css("margin:8px 0 0; font-size:12px; color:#2C2B27")}>
                          <div style={css("display:grid; grid-template-columns:1fr 1fr 1fr 0.7fr; gap:10px; padding:10px 0; border-top:1px solid rgba(20,20,18,0.07)")}>
                            <span>Call 07</span>
                            <span style={css("color:var(--mut)")}>12 Sep</span>
                            <span style={css("font-variant-numeric:tabular-nums")}>2,500,000</span>
                            <span style={css("color:var(--a)")}>Paid</span>
                          </div>
                          <div style={css("display:grid; grid-template-columns:1fr 1fr 1fr 0.7fr; gap:10px; padding:10px 0; border-top:1px solid rgba(20,20,18,0.07)")}>
                            <span>Call 06</span>
                            <span style={css("color:var(--mut)")}>14 Jun</span>
                            <span style={css("font-variant-numeric:tabular-nums")}>1,875,000</span>
                            <span style={css("color:var(--a)")}>Paid</span>
                          </div>
                          <div style={css("display:grid; grid-template-columns:1fr 1fr 1fr 0.7fr; gap:10px; padding:10px 0; border-top:1px solid rgba(20,20,18,0.07)")}>
                            <span>Call 05</span>
                            <span style={css("color:var(--mut)")}>11 Mar</span>
                            <span style={css("font-variant-numeric:tabular-nums")}>3,125,000</span>
                            <span style={css("color:var(--a)")}>Paid</span>
                          </div>
                          <div style={css("display:grid; grid-template-columns:1fr 1fr 1fr 0.7fr; gap:10px; padding:10px 0; border-top:1px solid rgba(20,20,18,0.07)")}>
                            <span>Call 04</span>
                            <span style={css("color:var(--mut)")}>06 Dec</span>
                            <span style={css("font-variant-numeric:tabular-nums")}>2,250,000</span>
                            <span style={css("color:var(--a)")}>Paid</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div ref={v.wpInsp} style={css("position:absolute; left:0; top:0; width:760px; height:600px; border-radius:11px; background:#FCFBF9; border:1px solid rgba(20,20,18,0.16); box-shadow:0 30px 74px rgba(20,20,18,0.26), 0 4px 12px rgba(20,20,18,0.14); overflow:hidden; display:flex; flex-direction:column; opacity:0")}>
                    <div style={css("position:relative; display:flex; align-items:center; gap:8px; height:34px; padding:0 14px; background:rgba(20,20,18,0.045); border-bottom:1px solid rgba(20,20,18,0.08)")}>
                      <span style={css("width:12px; height:12px; border-radius:50%; background:#FF5F57")} />
                      <span style={css("width:12px; height:12px; border-radius:50%; background:#FEBC2E")} />
                      <span style={css("width:12px; height:12px; border-radius:50%; background:#28C840")} />
                      <span style={css("position:absolute; left:0; right:0; text-align:center; font-size:12.5px; color:#1A1917; pointer-events:none")}>Network — LP Portal</span>
                      <span style={css("margin-left:auto; display:flex; align-items:center; padding:4px 9px; border-radius:4px; background:var(--bad); color:#FFFFFF; font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10px; letter-spacing:0.05em; text-transform:uppercase")}>5 issues</span>
                    </div>
                    <div style={css("display:flex; align-items:center; gap:12px; padding:10px 16px; border-bottom:1px solid rgba(20,20,18,0.08); background:#FFFFFF; font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:12px; color:#2C2B27")}>
                      <span style={css("padding:3px 7px; border-radius:3px; background:rgba(20,20,18,0.06); font-size:10.5px")}>GET</span>
                      <span style={css("flex:1 1 auto; min-width:0; white-space:nowrap; overflow:hidden")}>/rest/v1/investors<span style={css("color:var(--bad)")}>?select=*</span></span>
                      <span style={css("flex:none; color:var(--mut)")}>200</span>
                      <span style={css("flex:none; color:var(--bad); font-variant-numeric:tabular-nums")}>2,418 rows</span>
                    </div>
                    <div style={css("flex:1 1 auto; min-height:0; display:flex")}>
                      <div style={css("flex:1 1 auto; min-width:0; background:#FFFFFF; padding:0 16px; display:flex; flex-direction:column")}>
                        <div style={css("display:grid; grid-template-columns:1.5fr 0.45fr 0.95fr 1.45fr; gap:10px; padding:10px 0; border-bottom:1px solid rgba(20,20,18,0.1); font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:9.5px; letter-spacing:0.05em; text-transform:uppercase; color:var(--mut)")}>
                          <span>Investor</span>
                          <span>Fund</span>
                          <span style={css("text-align:right")}>Commitment</span>
                          <span>Contact</span>
                        </div>
                        <div style={css("display:grid; grid-template-columns:1.5fr 0.45fr 0.95fr 1.45fr; gap:10px; padding:9px 0; border-bottom:1px solid rgba(20,20,18,0.06); font-size:12px; color:#2C2B27")}>
                          <span style={css("white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>Ashfield Pension Trust</span>
                          <span>III</span>
                          <span style={css("text-align:right; font-variant-numeric:tabular-nums")}>25,000,000</span>
                          <span style={css("white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>treasury@ashfieldpt.org</span>
                        </div>
                        <div style={css("display:grid; grid-template-columns:1.5fr 0.45fr 0.95fr 1.45fr; gap:10px; padding:9px 0; border-bottom:1px solid rgba(20,20,18,0.06); font-size:12px; color:#2C2B27; background:rgba(196,52,30,0.05)")}>
                          <span style={css("white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>Harrow County Retirement</span>
                          <span>III</span>
                          <span style={css("text-align:right; font-variant-numeric:tabular-nums; color:var(--bad)")}>40,000,000</span>
                          <span style={css("white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:var(--bad)")}>j.okafor@harrowcrs.gov</span>
                        </div>
                        <div style={css("display:grid; grid-template-columns:1.5fr 0.45fr 0.95fr 1.45fr; gap:10px; padding:9px 0; border-bottom:1px solid rgba(20,20,18,0.06); font-size:12px; color:#2C2B27; background:rgba(196,52,30,0.05)")}>
                          <span style={css("white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>Castellano Family Office</span>
                          <span>II</span>
                          <span style={css("text-align:right; font-variant-numeric:tabular-nums; color:var(--bad)")}>7,500,000</span>
                          <span style={css("white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:var(--bad)")}>rc@castellano-fo.com</span>
                        </div>
                        <div style={css("display:grid; grid-template-columns:1.5fr 0.45fr 0.95fr 1.45fr; gap:10px; padding:9px 0; border-bottom:1px solid rgba(20,20,18,0.06); font-size:12px; color:#2C2B27; background:rgba(196,52,30,0.05)")}>
                          <span style={css("white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>Northmere Endowment</span>
                          <span>IV</span>
                          <span style={css("text-align:right; font-variant-numeric:tabular-nums; color:var(--bad)")}>15,000,000</span>
                          <span style={css("white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:var(--bad)")}>invest@northmere.edu</span>
                        </div>
                        <div style={css("display:grid; grid-template-columns:1.5fr 0.45fr 0.95fr 1.45fr; gap:10px; padding:9px 0; border-bottom:1px solid rgba(20,20,18,0.06); font-size:12px; color:#2C2B27; background:rgba(196,52,30,0.05)")}>
                          <span style={css("white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>D. Whitcombe</span>
                          <span>III</span>
                          <span style={css("text-align:right; font-variant-numeric:tabular-nums; color:var(--bad)")}>2,000,000</span>
                          <span style={css("white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:var(--bad)")}>dwhitcombe@gmail.com</span>
                        </div>
                        <div style={css("display:grid; grid-template-columns:1.5fr 0.45fr 0.95fr 1.45fr; gap:10px; padding:9px 0; border-bottom:1px solid rgba(20,20,18,0.06); font-size:12px; color:#2C2B27; background:rgba(196,52,30,0.05)")}>
                          <span style={css("white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>Kestrel Insurance Group</span>
                          <span>Cr. I</span>
                          <span style={css("text-align:right; font-variant-numeric:tabular-nums; color:var(--bad)")}>30,000,000</span>
                          <span style={css("white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:var(--bad)")}>alts@kestrelgroup.com</span>
                        </div>
                        <div style={css("display:grid; grid-template-columns:1.5fr 0.45fr 0.95fr 1.45fr; gap:10px; padding:9px 0; border-bottom:1px solid rgba(20,20,18,0.06); font-size:12px; color:#2C2B27; background:rgba(196,52,30,0.05)")}>
                          <span style={css("white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>L. Adeyemi Trust</span>
                          <span>IV</span>
                          <span style={css("text-align:right; font-variant-numeric:tabular-nums; color:var(--bad)")}>3,250,000</span>
                          <span style={css("white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:var(--bad)")}>l.adeyemi@protonmail.com</span>
                        </div>
                        <div style={css("display:grid; grid-template-columns:1.5fr 0.45fr 0.95fr 1.45fr; gap:10px; padding:9px 0; border-bottom:1px solid rgba(20,20,18,0.06); font-size:12px; color:#2C2B27; background:rgba(196,52,30,0.05)")}>
                          <span style={css("white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>Vantor Sovereign Fund</span>
                          <span>IV</span>
                          <span style={css("text-align:right; font-variant-numeric:tabular-nums; color:var(--bad)")}>60,000,000</span>
                          <span style={css("white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:var(--bad)")}>pm@vantorsf.com</span>
                        </div>
                        <div style={css("display:grid; grid-template-columns:1.5fr 0.45fr 0.95fr 1.45fr; gap:10px; padding:9px 0; border-bottom:1px solid rgba(20,20,18,0.06); font-size:12px; color:#2C2B27; background:rgba(196,52,30,0.05)")}>
                          <span style={css("white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>Brennan Family Trust</span>
                          <span>II</span>
                          <span style={css("text-align:right; font-variant-numeric:tabular-nums; color:var(--bad)")}>4,000,000</span>
                          <span style={css("white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:var(--bad)")}>k.brennan@icloud.com</span>
                        </div>
                        <div style={css("margin-top:auto; padding:10px 0 12px; font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:11px; color:var(--bad)")}>+ 2,409 more rows · 9 funds · no sign-in required</div>
                      </div>
                      <div style={css("flex:0 0 250px; border-left:1px solid rgba(196,52,30,0.22); background:rgba(196,52,30,0.05); padding:14px 18px 0; display:flex; flex-direction:column")}>
                        <div style={css("font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10px; letter-spacing:0.06em; text-transform:uppercase; color:var(--bad); padding-bottom:8px")}>Issues found</div>
                        <div style={css("display:flex; gap:12px; padding:12px 0; border-top:1px solid rgba(196,52,30,0.16)")}>
                          <span style={css("flex:none; width:8px; height:8px; margin-top:5px; border-radius:50%; background:var(--bad); box-shadow:0 0 0 3px rgba(196,52,30,0.16)")} />
                          <div style={css("min-width:0")}>
                            <div style={css("font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:9.5px; letter-spacing:0.06em; text-transform:uppercase; color:var(--bad)")}>Network</div>
                            <div style={css("margin:3px 0 0; font-size:13.5px; letter-spacing:-0.012em; color:#1A1917")}>Unauthenticated access</div>
                            <div style={css("margin:2px 0 0; font-size:11px; line-height:1.4; color:var(--sec)")}>The database answers anyone holding the public key.</div>
                          </div>
                        </div>
                        <div style={css("display:flex; gap:12px; padding:12px 0; border-top:1px solid rgba(196,52,30,0.16)")}>
                          <span style={css("flex:none; width:8px; height:8px; margin-top:5px; border-radius:50%; background:var(--bad); box-shadow:0 0 0 3px rgba(196,52,30,0.16)")} />
                          <div style={css("min-width:0")}>
                            <div style={css("font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:9.5px; letter-spacing:0.06em; text-transform:uppercase; color:var(--bad)")}>Data leak</div>
                            <div style={css("margin:3px 0 0; font-size:13.5px; letter-spacing:-0.012em; color:#1A1917")}>Investor PII exposed</div>
                            <div style={css("margin:2px 0 0; font-size:11px; line-height:1.4; color:var(--sec)")}>Names, commitments and contacts for every LP.</div>
                          </div>
                        </div>
                        <div style={css("display:flex; gap:12px; padding:12px 0; border-top:1px solid rgba(196,52,30,0.16)")}>
                          <span style={css("flex:none; width:8px; height:8px; margin-top:5px; border-radius:50%; background:var(--bad); box-shadow:0 0 0 3px rgba(196,52,30,0.16)")} />
                          <div style={css("min-width:0")}>
                            <div style={css("font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:9.5px; letter-spacing:0.06em; text-transform:uppercase; color:var(--bad)")}>Data</div>
                            <div style={css("margin:3px 0 0; font-size:13.5px; letter-spacing:-0.012em; color:#1A1917")}>No fund isolation</div>
                            <div style={css("margin:2px 0 0; font-size:11px; line-height:1.4; color:var(--sec)")}>Row-level rules were never switched on.</div>
                          </div>
                        </div>
                        <div style={css("display:flex; gap:12px; padding:12px 0; border-top:1px solid rgba(196,52,30,0.16)")}>
                          <span style={css("flex:none; width:8px; height:8px; margin-top:5px; border-radius:50%; background:var(--bad); box-shadow:0 0 0 3px rgba(196,52,30,0.16)")} />
                          <div style={css("min-width:0")}>
                            <div style={css("font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:9.5px; letter-spacing:0.06em; text-transform:uppercase; color:var(--bad)")}>Compliance</div>
                            <div style={css("margin:3px 0 0; font-size:13.5px; letter-spacing:-0.012em; color:#1A1917")}>No audit trail</div>
                            <div style={css("margin:2px 0 0; font-size:11px; line-height:1.4; color:var(--sec)")}>Access cannot be evidenced to an auditor.</div>
                          </div>
                        </div>
                        <div style={css("display:flex; gap:12px; padding:12px 0; border-top:1px solid rgba(196,52,30,0.16)")}>
                          <span style={css("flex:none; width:8px; height:8px; margin-top:5px; border-radius:50%; background:var(--bad); box-shadow:0 0 0 3px rgba(196,52,30,0.16)")} />
                          <div style={css("min-width:0")}>
                            <div style={css("font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:9.5px; letter-spacing:0.06em; text-transform:uppercase; color:var(--bad)")}>Testing</div>
                            <div style={css("margin:3px 0 0; font-size:13.5px; letter-spacing:-0.012em; color:#1A1917")}>Zero tests</div>
                            <div style={css("margin:2px 0 0; font-size:11px; line-height:1.4; color:var(--sec)")}>Nothing checks this before release.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div ref={v.wnCard} data-ai-card="" data-screen-label="What did not change" style={css(`transform:translateX(108.00%) scale(1.0000); transform-origin:left center; will-change:transform; box-shadow:-18px 0 48px rgba(20,20,18,0.16); position:absolute; inset:0; overflow:hidden; box-sizing:border-box; background:#E8E2D2 ${BG.valleyPastel} center 70% / cover no-repeat; border:1px solid var(--line); padding:clamp(32px,4.4vw,64px); display:flex; gap:clamp(24px,3.4vw,56px); align-items:stretch; flex-wrap:nowrap`)}>
              <div style={css("position:absolute; inset:0; background:linear-gradient(180deg, rgba(248,246,240,0.7) 0%, rgba(248,246,240,0.42) 60%, rgba(248,246,240,0.2) 100%); pointer-events:none")} />
              <div style={css("position:relative; flex:1 1 300px; min-width:0; display:flex; flex-direction:column; justify-content:center; gap:32px")}>
                <div style={css("font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:11.5px; letter-spacing:0.04em; text-transform:uppercase; color:#1A1917")}>What did not change</div>
                <p ref={v.wnText} style={css("margin:0; font-size:clamp(30px,3.7vw,56px); font-weight:400; letter-spacing:-0.034em; line-height:1.12; color:#1A1917; text-wrap:pretty")}>
                  {v.wnWords.map((w, i) => (
                    <Fragment key={i}>
                      <span style={css("opacity:0.2; transition:opacity .18s linear")}>{w}{" "}</span>
                    </Fragment>
                  ))}
                </p>
              </div>
              <div ref={v.wnFit} aria-hidden="true" data-ai-fit="700 / 560" style={css("position:relative; flex:1.15 1 380px; min-width:0; min-height:0")}>
                <div ref={v.wnStage} style={css("position:absolute; left:0; top:0; width:700px; height:560px; transform-origin:top left; display:flex; align-items:center")}>
                  <div style={css("width:100%; border-radius:11px; background:#FCFBF9; border:1px solid rgba(20,20,18,0.14); box-shadow:0 30px 74px rgba(20,20,18,0.22), 0 4px 12px rgba(20,20,18,0.12); overflow:hidden")}>
                    <div style={css("position:relative; display:flex; align-items:center; gap:8px; height:34px; padding:0 14px; background:rgba(20,20,18,0.045); border-bottom:1px solid rgba(20,20,18,0.08)")}>
                      <span style={css("width:12px; height:12px; border-radius:50%; background:#FF5F57")} />
                      <span style={css("width:12px; height:12px; border-radius:50%; background:#FEBC2E")} />
                      <span style={css("width:12px; height:12px; border-radius:50%; background:#28C840")} />
                      <span style={css("position:absolute; left:0; right:0; text-align:center; font-size:12.5px; color:#1A1917; pointer-events:none")}>Obligations — LP Portal</span>
                      <span style={css("margin-left:auto; display:flex; align-items:center; padding:4px 9px; border-radius:4px; background:var(--a); color:#FFFFFF; font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10px; letter-spacing:0.05em; text-transform:uppercase")}>3 of 3 apply</span>
                    </div>
                    <div style={css("display:flex; align-items:center; gap:12px; padding:10px 20px; border-bottom:1px solid rgba(20,20,18,0.08); background:#FFFFFF; font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:12px; color:#2C2B27")}>
                      <span style={css("padding:3px 7px; border-radius:3px; background:rgba(20,20,18,0.06); font-size:10.5px")}>System</span>
                      <span style={css("flex:1 1 auto; min-width:0; white-space:nowrap; overflow:hidden")}>LP Portal · built in an afternoon</span>
                      <span style={css("flex:none; color:var(--mut)")}>0 exemptions</span>
                    </div>
                    <div style={css("padding:2px 20px 4px; background:#FFFFFF")}>
                      <div style={css("display:flex; gap:18px; align-items:flex-start; padding:18px 0; border-bottom:1px solid rgba(20,20,18,0.07);")}>
                        <span style={css("flex:none; width:8px; height:8px; margin-top:5px; border-radius:50%; background:var(--a); box-shadow:0 0 0 3px rgba(21,127,82,0.16)")} />
                        <div style={css("flex:1 1 auto; min-width:0")}>
                          <div style={css("font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10px; letter-spacing:0.06em; text-transform:uppercase; color:var(--mut)")}>LP agreement · § 14.2</div>
                          <div style={css("margin:4px 0 0; font-size:15px; letter-spacing:-0.014em; color:#1A1917")}>Confidentiality</div>
                          <div style={css("margin:6px 0 0; font-size:13px; line-height:1.5; color:#2C2B27")}>
                            <span style={css("background:rgba(242,196,92,0.42)")}>The General Partner shall hold all information concerning the Limited Partners in confidence</span>
                            {" and disclose it only as this Agreement permits."}
                          </div>
                        </div>
                        <span style={css("flex:none; padding:4px 9px; border-radius:4px; background:rgba(21,127,82,0.1); color:var(--a); font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:9.5px; letter-spacing:0.05em; text-transform:uppercase; white-space:nowrap")}>Applies in full</span>
                      </div>
                      <div style={css("display:flex; gap:18px; align-items:flex-start; padding:18px 0; border-bottom:1px solid rgba(20,20,18,0.07);")}>
                        <span style={css("flex:none; width:8px; height:8px; margin-top:5px; border-radius:50%; background:var(--a); box-shadow:0 0 0 3px rgba(21,127,82,0.16)")} />
                        <div style={css("flex:1 1 auto; min-width:0")}>
                          <div style={css("font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10px; letter-spacing:0.06em; text-transform:uppercase; color:var(--mut)")}>Regulator · guidance</div>
                          <div style={css("margin:4px 0 0; font-size:15px; letter-spacing:-0.014em; color:#1A1917")}>Books and records</div>
                          <div style={css("margin:6px 0 0; font-size:13px; line-height:1.5; color:#2C2B27")}>
                            {"Firms must keep records that allow "}
                            <span style={css("background:rgba(242,196,92,0.42)")}>each transaction to be reconstructed</span>
                            , whatever system produced them.
                          </div>
                        </div>
                        <span style={css("flex:none; padding:4px 9px; border-radius:4px; background:rgba(21,127,82,0.1); color:var(--a); font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:9.5px; letter-spacing:0.05em; text-transform:uppercase; white-space:nowrap")}>Applies in full</span>
                      </div>
                      <div style={css("display:flex; gap:18px; align-items:flex-start; padding:18px 0;")}>
                        <span style={css("flex:none; width:8px; height:8px; margin-top:5px; border-radius:50%; background:var(--a); box-shadow:0 0 0 3px rgba(21,127,82,0.16)")} />
                        <div style={css("flex:1 1 auto; min-width:0")}>
                          <div style={css("font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10px; letter-spacing:0.06em; text-transform:uppercase; color:var(--mut)")}>Audit scope · FY2026</div>
                          <div style={css("margin:4px 0 0; font-size:15px; letter-spacing:-0.014em; color:#1A1917")}>IT general controls</div>
                          <div style={css("margin:6px 0 0; font-size:13px; line-height:1.5; color:#2C2B27")}>
                            {"Access, change management and operations for "}
                            <span style={css("background:rgba(242,196,92,0.42)")}>every system that feeds the financial statements</span>
                            .
                          </div>
                        </div>
                        <span style={css("flex:none; padding:4px 9px; border-radius:4px; background:rgba(21,127,82,0.1); color:var(--a); font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:9.5px; letter-spacing:0.05em; text-transform:uppercase; white-space:nowrap")}>Applies in full</span>
                      </div>
                    </div>
                    <div style={css("display:flex; justify-content:space-between; gap:12px; padding:11px 20px 13px; border-top:1px solid rgba(20,20,18,0.1); background:rgba(20,20,18,0.025); font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:11px; color:var(--mut)")}>
                      <span>Speed of build: not a factor</span>
                      <span style={css("color:var(--a)")}>Same standard as every system</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
