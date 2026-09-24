"use client";

import { pinned } from "@/content/private-credit";
import { useBind } from "@/motion/private-credit/react";
import { css } from "./css";
import {
  LEGACY_BAR,
  MenuBar,
  MONO,
  PIN,
  PINNED_H2,
  PinnedFallback,
  PLATFORM_BAR,
  PLATFORM_TITLE,
  ScrollBlip,
  StageBackdrop,
  STAGE_TITLE,
  TitleBar,
} from "./primitives";

// §01 Reality (#reality), pinned 600vh. Four "legacy" windows pile up, then give way to the
// platform window, which walks through seven screens. Everything inside the four windows is
// static markup (reference lines 176–269); the titles and the platform's sidebar, table and
// rail are built by the motion module (sync / buildPlatform / showScreen).
//
// There is deliberately no badgeA: that caption was removed from the design on 24 Sep 2026
// and the module skips it when absent.

const WIN = "position:absolute; border-radius:10px; background:#FCFBF9; overflow:hidden; opacity:0";
const TITLE_SEC = "position:absolute; left:0; right:0; text-align:center; font-size:11.5px; color:var(--sec)";
const TITLE_INK = "position:absolute; left:0; right:0; text-align:center; font-size:11.5px; color:#1A1917";

// w0 — "Loan Servicing — Production"
const W0_COLS = "display:grid; grid-template-columns:1.5fr 0.8fr 0.8fr 0.9fr; gap:8px";
const W0_ROWS = [
  ["Ardyne Packaging", "42.000", "10.10%"],
  ["Brightmoor Health", "28.500", "9.85%"],
  ["Calder Logistics", "19.200", "10.35%"],
  ["Denholm Foods", "31.800", "9.95%"],
  ["Estree Dental", "12.400", "10.60%"],
];
const NUM = "text-align:right; font-variant-numeric:tabular-nums";

// w3 — "Covenants_MASTER_v14.xlsx"
const W3_COLS = "display:grid; grid-template-columns:34px repeat(5,1fr)";
const W3_ROWNUM =
  `padding:6px 0; text-align:center; ${MONO}; font-size:9px; color:var(--mut); background:rgba(20,20,18,0.035); border-right:1px solid rgba(20,20,18,0.08)`;
const CELL = "padding:6px 7px";
const CELL_NUM = "padding:6px 7px; font-variant-numeric:tabular-nums";

export function Reality() {
  const bind = useBind();
  return (
    <section
      id="reality"
      data-screen-label="Operating reality"
      style={css("padding:40px 0 0; border-bottom:1px solid var(--line2)")}
      className="max-md:pt-0!"
    >
      <PinnedFallback>{pinned.reality}</PinnedFallback>
      <div ref={bind("track")} className="max-md:hidden" style={css("position:relative; min-height:600vh")}>
        <div ref={bind("pin")} style={css(PIN)}>
          <div ref={bind("rHead")} style={css("flex:0 0 auto; width:100%; max-width:1200px; text-align:center")}>
            <h2 style={css(`margin:0 auto; max-width:860px; ${PINNED_H2}; text-wrap:balance`)}>{pinned.reality}</h2>
          </div>
          <div
            ref={bind("rFit")}
            style={css("flex:1 1 auto; min-height:0; width:100%; display:flex; align-items:center; justify-content:center")}
          >
            <div
              ref={bind("wrap")}
              aria-hidden="true"
              style={css(
                "position:relative; width:100%; max-width:1200px; aspect-ratio:1200 / 780; max-height:100%; border-radius:12px; overflow:hidden; box-shadow:0 30px 90px rgba(20,20,18,0.20)",
              )}
            >
              <div
                ref={bind("stage")}
                style={css("position:absolute; left:0; top:0; width:1200px; height:780px; transform-origin:top left")}
              >
                <StageBackdrop />
                <MenuBar variant="reality" />
                <ScrollBlip />

                <h2 ref={bind("titleA")} style={css(`${STAGE_TITLE}; width:572px`)} />
                <h2 ref={bind("titleB")} style={css(`${STAGE_TITLE}; width:790px; opacity:0`)} />

                {/* w0 — the servicing system's export */}
                <div
                  ref={bind("w0")}
                  data-win="0"
                  style={css(
                    `${WIN}; left:44px; top:260px; width:430px; height:296px; border:1px solid rgba(20,20,18,0.14); box-shadow:0 22px 54px rgba(20,20,18,0.20), 0 3px 9px rgba(20,20,18,0.12)`,
                  )}
                >
                  <TitleBar bar={LEGACY_BAR} title={"Loan Servicing — Production"} titleStyle={TITLE_SEC} />
                  <div style={css("padding:12px 14px")}>
                    <div
                      style={css(
                        `${W0_COLS}; padding-bottom:8px; border-bottom:1px solid rgba(20,20,18,0.09); ${MONO}; font-size:9px; letter-spacing:0.05em; text-transform:uppercase; color:var(--mut)`,
                      )}
                    >
                      <span>Borrower</span>
                      <span style={css("text-align:right")}>Drawn</span>
                      <span style={css("text-align:right")}>Rate</span>
                      <span style={css("text-align:right")}>Next</span>
                    </div>
                    {W0_ROWS.map(([name, drawn, rate], i) => (
                      <div
                        key={name}
                        style={css(
                          `${W0_COLS}; padding:9px 0; ${i < W0_ROWS.length - 1 ? "border-bottom:1px solid rgba(20,20,18,0.05); " : ""}font-size:11px; color:#2C2B27`,
                        )}
                      >
                        <span>{name}</span>
                        <span style={css(NUM)}>{drawn}</span>
                        <span style={css(NUM)}>{rate}</span>
                        <span style={css("text-align:right; color:var(--mut)")}>30 Jun</span>
                      </div>
                    ))}
                    <div
                      style={css(
                        `margin:12px 0 0; padding-top:10px; border-top:1px solid rgba(20,20,18,0.09); ${MONO}; font-size:9.5px; color:var(--mut)`,
                      )}
                    >
                      24 positions &middot; last export 09:14 &middot; CSV
                    </div>
                  </div>
                </div>

                {/* w1 — the email that asks for the re-keying */}
                <div
                  ref={bind("w1")}
                  data-win="1"
                  style={css(
                    `${WIN}; left:720px; top:460px; width:444px; height:238px; border:1px solid rgba(20,20,18,0.16); box-shadow:0 24px 58px rgba(20,20,18,0.22), 0 4px 10px rgba(20,20,18,0.13)`,
                  )}
                >
                  <TitleBar bar={LEGACY_BAR} title="Mail" titleStyle={TITLE_SEC} />
                  <div style={css("padding:14px 16px; background:#FFFFFF; height:calc(100% - 32px); box-sizing:border-box; overflow:hidden")}>
                    <div style={css("font-size:12.5px; letter-spacing:-0.012em; color:#1A1917")}>
                      RE: Q3 compliance certificates (14 of 24)
                    </div>
                    <div style={css(`margin:6px 0 0; ${MONO}; font-size:9.5px; color:var(--mut)`)}>
                      Fund Operations &rarr; Credit Analyst &middot; 06:41
                    </div>
                    <p style={css("margin:12px 0 0; font-size:11.5px; line-height:1.5; color:#2C2B27")}>
                      Attached are the certs that came in overnight. Can you re-key leverage and ICR into the tracker
                      before IC on Thursday? Three are missing the liquidity line so chase the sponsors. Also v13 had the
                      wrong margin for Estree, I&apos;ve started v14.
                    </p>
                    <div style={css("display:flex; gap:7px; flex-wrap:wrap; margin:13px 0 0")}>
                      {["Ardyne_CompCert_Q3.pdf", "Brightmoor_Q3.pdf", "+12 more"].map((f) => (
                        <span
                          key={f}
                          style={css("padding:4px 9px; border:1px solid rgba(20,20,18,0.12); border-radius:4px; font-size:9.5px; color:var(--sec)")}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* w2 — a borrower's compliance certificate */}
                <div
                  ref={bind("w2")}
                  data-win="2"
                  style={css(
                    `${WIN}; left:830px; top:210px; width:330px; height:238px; border:1px solid rgba(20,20,18,0.14); box-shadow:0 20px 50px rgba(20,20,18,0.19), 0 3px 8px rgba(20,20,18,0.11)`,
                  )}
                >
                  <TitleBar bar={LEGACY_BAR} title="Ardyne_CompCert_Q3.pdf" titleStyle={TITLE_SEC} />
                  <div style={css("padding:18px 22px; background:#FFFFFF; height:calc(100% - 32px); box-sizing:border-box; overflow:hidden")}>
                    <div style={css("font-size:9.5px; letter-spacing:0.09em; text-transform:uppercase; color:var(--mut)")}>
                      Compliance Certificate
                    </div>
                    <div style={css("margin:9px 0 0; font-size:13px; letter-spacing:-0.015em; color:#1A1917")}>
                      Ardyne Packaging Ltd
                    </div>
                    <div style={css("display:grid; gap:6px; margin:16px 0 0")}>
                      <span style={css("height:5px; width:100%; background:rgba(20,20,18,0.07)")} />
                      <span style={css("height:5px; width:92%; background:rgba(20,20,18,0.07)")} />
                      <span style={css("height:5px; width:74%; background:rgba(20,20,18,0.07)")} />
                    </div>
                    <div
                      style={css(
                        "display:flex; justify-content:space-between; margin:16px 0 0; padding-top:9px; border-top:1px solid rgba(20,20,18,0.08); font-size:11px; color:#2C2B27",
                      )}
                    >
                      <span>Total Net Leverage</span>
                      <span style={css("font-variant-numeric:tabular-nums")}>4.10x</span>
                    </div>
                    <div style={css("display:flex; justify-content:space-between; padding-top:7px; font-size:11px; color:#2C2B27")}>
                      <span>Interest Cover</span>
                      <span style={css("font-variant-numeric:tabular-nums")}>2.80x</span>
                    </div>
                  </div>
                </div>

                {/* w3 — the covenant tracker spreadsheet, on top */}
                <div
                  ref={bind("w3")}
                  data-win="3"
                  style={css(
                    `${WIN}; left:196px; top:324px; width:512px; height:338px; border:1px solid rgba(20,20,18,0.16); box-shadow:0 26px 64px rgba(20,20,18,0.23), 0 4px 12px rgba(20,20,18,0.14)`,
                  )}
                >
                  <TitleBar bar={LEGACY_BAR} title="Covenants_MASTER_v14.xlsx" titleStyle={TITLE_INK} />
                  <div
                    style={css(
                      "display:flex; align-items:center; gap:10px; padding:7px 12px; border-bottom:1px solid rgba(20,20,18,0.08); background:#FFFFFF",
                    )}
                  >
                    <span style={css("font-style:italic; font-size:11px; color:var(--mut)")}>fx</span>
                    <span
                      style={css(
                        `flex:1 1 auto; min-width:0; ${MONO}; font-size:10.5px; color:#2C2B27; white-space:nowrap; overflow:hidden`,
                      )}
                    >
                      {'=IF(D14/E14>4.5,"BREACH",IF(D14/E14>4.2,"WATCH",""))'}
                    </span>
                  </div>
                  <div style={css("background:#FFFFFF")}>
                    <div
                      style={css(
                        `${W3_COLS}; ${MONO}; font-size:9px; color:var(--mut); background:rgba(20,20,18,0.035); border-bottom:1px solid rgba(20,20,18,0.1)`,
                      )}
                    >
                      <span style={css("padding:5px 0; text-align:center; border-right:1px solid rgba(20,20,18,0.08)")} />
                      {["B", "C", "D", "E"].map((c) => (
                        <span key={c} style={css("padding:5px 0; text-align:center; border-right:1px solid rgba(20,20,18,0.06)")}>
                          {c}
                        </span>
                      ))}
                      <span style={css("padding:5px 0; text-align:center")}>F</span>
                    </div>
                    <div style={css(`${W3_COLS}; font-size:10px; color:#2C2B27; border-bottom:1px solid rgba(20,20,18,0.06)`)}>
                      <span style={css(W3_ROWNUM)}>11</span>
                      <span style={css(CELL)}>Brightmoor</span>
                      <span style={css(CELL_NUM)}>28.50</span>
                      <span style={css(CELL_NUM)}>102.6</span>
                      <span style={css(CELL_NUM)}>28.5</span>
                      <span style={css(CELL)} />
                    </div>
                    <div style={css(`${W3_COLS}; font-size:10px; color:#2C2B27; border-bottom:1px solid rgba(20,20,18,0.06)`)}>
                      <span style={css(W3_ROWNUM)}>12</span>
                      <span style={css(CELL)}>Calder Log.</span>
                      <span style={css(CELL_NUM)}>19.20</span>
                      <span style={css(CELL_NUM)}>92.2</span>
                      <span style={css(CELL_NUM)}>19.2</span>
                      <span style={css(`${CELL}; color:var(--warn)`)}>WATCH</span>
                    </div>
                    <div style={css(`${W3_COLS}; font-size:10px; color:#2C2B27; border-bottom:1px solid rgba(20,20,18,0.06)`)}>
                      <span style={css(W3_ROWNUM)}>13</span>
                      <span style={css(CELL)}>Denholm</span>
                      <span style={css(CELL_NUM)}>31.80</span>
                      <span style={css(CELL_NUM)}>124.0</span>
                      <span style={css(CELL_NUM)}>31.8</span>
                      <span style={css(CELL)} />
                    </div>
                    {/* row 14: the selected cell and the broken reference */}
                    <div style={css(`${W3_COLS}; font-size:10px; color:#2C2B27; border-bottom:1px solid rgba(20,20,18,0.06)`)}>
                      <span
                        style={css(
                          `padding:6px 0; text-align:center; ${MONO}; font-size:9px; color:#1A1917; background:rgba(20,20,18,0.07); border-right:1px solid rgba(20,20,18,0.08)`,
                        )}
                      >
                        14
                      </span>
                      <span style={css(CELL)}>Estree Dental</span>
                      <span style={css(CELL_NUM)}>12.40</span>
                      <span
                        style={css(
                          "padding:5px 6px; font-variant-numeric:tabular-nums; outline:1.5px solid var(--a); outline-offset:-1px; background:rgba(21,127,82,0.05)",
                        )}
                      >
                        52.1
                      </span>
                      <span style={css(CELL_NUM)}>12.4</span>
                      <span style={css(`${CELL}; color:var(--bad)`)}>#REF!</span>
                    </div>
                    <div style={css(`${W3_COLS}; font-size:10px; color:#2C2B27; border-bottom:1px solid rgba(20,20,18,0.06)`)}>
                      <span style={css(W3_ROWNUM)}>15</span>
                      <span style={css(CELL)}>Fenwick Mar.</span>
                      <span style={css(CELL_NUM)}>24.10</span>
                      <span style={css(CELL_NUM)}>106.0</span>
                      <span style={css(CELL_NUM)}>24.1</span>
                      <span style={css(CELL)} />
                    </div>
                    <div style={css(`${W3_COLS}; font-size:10px; color:#2C2B27; border-bottom:1px solid rgba(20,20,18,0.06)`)}>
                      <span style={css(W3_ROWNUM)}>16</span>
                      <span style={css(`${CELL}; color:var(--mut)`)}>Garrow Sw.</span>
                      <span style={css(`${CELL}; color:var(--mut)`)}>&mdash;</span>
                      <span style={css(`${CELL}; color:var(--mut)`)}>&mdash;</span>
                      <span style={css(`${CELL}; color:var(--mut)`)}>&mdash;</span>
                      <span style={css(`${CELL}; color:var(--mut); font-size:9px`)}>cert not in</span>
                    </div>
                  </div>
                  <div
                    style={css(
                      "display:flex; align-items:center; gap:2px; padding:6px 10px; border-top:1px solid rgba(20,20,18,0.1); background:rgba(20,20,18,0.025); font-size:9.5px; color:var(--mut)",
                    )}
                  >
                    <span style={css("padding:3px 8px; background:#FFFFFF; border:1px solid rgba(20,20,18,0.12); color:#1A1917")}>Q3</span>
                    {["Q2", "Q1", "WORKING", "old_DO_NOT_USE"].map((t) => (
                      <span key={t} style={css("padding:3px 8px")}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* the platform: sidebar, table and rail are built per screen by the module */}
                <div
                  ref={bind("plat")}
                  style={css(
                    "position:absolute; left:70px; top:180px; width:1060px; height:518px; border-radius:11px; background:#FCFBF9; border:1px solid rgba(20,20,18,0.14); box-shadow:0 30px 74px rgba(20,20,18,0.24), 0 3px 12px rgba(20,20,18,0.14); overflow:hidden; display:flex; flex-direction:column; opacity:0",
                  )}
                >
                  <TitleBar bar={PLATFORM_BAR} title={"3264 · Private Credit Platform"} titleStyle={PLATFORM_TITLE} />
                  <div style={css("flex:1 1 auto; min-height:0; display:flex")}>
                    <div
                      ref={bind("pfSide")}
                      style={css(
                        "flex:0 0 196px; border-right:1px solid rgba(20,20,18,0.08); padding:16px 0; background:rgba(20,20,18,0.015); display:flex; flex-direction:column",
                      )}
                    />
                    <div ref={bind("pfMain")} style={css("flex:1 1 auto; min-width:0; padding:18px 22px")} />
                    <div
                      ref={bind("pfRail")}
                      style={css(
                        "flex:0 0 226px; border-left:1px solid rgba(20,20,18,0.08); padding:18px 18px; background:rgba(20,20,18,0.012)",
                      )}
                    />
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
