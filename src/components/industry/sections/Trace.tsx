/* eslint-disable react-hooks/refs -- `v` carries the page logic's createRef() objects, which
   these components only hand to ref={…}; nothing reads .current during render. */
import type { IndustryVals } from "@/motion/industry/industry.logic";
import { css } from "@/components/private-credit/css";
import { BG } from "../bg";
import { Br } from "../Br";
import type { IndustryCopy } from "../types";

// Traceability (Fund Management): one investor's capital account. Each row is a button; the
// selected row's lineage (source, match, check, review) shows on the right. The logic
// (stepTrace) advances the selection every 5.6s while the frame is in view, with the progress
// bar filling; a click selects a row and stops the auto-play for the visit. On every change the
// four steps re-enter, 110ms apart (componentDidUpdate). This is the one section that renders
// from React state: the selection, `tr`, in the logic's renderVals.
//
// The rows are <button aria-pressed>, and the lineage panel is a polite live region, so a change
// is announced (handoff, "Accessibility"). The two panels stack below ~880px (auto-fit, 420px).
//
// The rows are border-box, as buttons are by the browser's default the reference relied on: the
// page's content-box rule ([data-ind], globals.css) would otherwise push them 28px past the card.
//
// A long label wraps beside its value (Asset Management's commentary claim, README). Where even
// its longest word cannot sit beside the value (Asset Management's "Largest overweight" next to
// "Technology +4.2 pts", in rows under ~240px wide), the row wraps instead and the value takes a
// second line, still right-aligned: the label's flex basis is its min-content width, so that is
// the only case that wraps, and the reference's layout holds everywhere else.
//
// Two departures from the reference: the "Traced" pill's green is --ok-ink (#157F52 reads 4.28:1
// on its #E3EFE7 tint, under AA's 4.5:1), and the section has no scroll-margin of its own (the
// reference's 68px would double the site-wide scroll-padding that already clears the header;
// the same goes for Playbooks and Related work).

const MONO = "font-family:'IBM Plex Mono', ui-monospace, monospace";

export function Trace({ v, c }: { v: IndustryVals; c: NonNullable<IndustryCopy["trace"]> }) {
  return (
    <section id="trace" data-screen-label="Traceability" style={css("padding:118px 40px; border-bottom:1px solid var(--line2)")}>
      <div style={css("max-width:1280px; margin:0 auto")}>
        <div style={css("display:flex; gap:28px 72px; flex-wrap:wrap; align-items:flex-end; justify-content:space-between")}>
          <div style={css("flex:3 1 480px; min-width:0")}>
            <div style={css("font-size:13px; letter-spacing:-0.005em; color:var(--mut)")}>{c.eyebrow}</div>
            <h2 style={css("margin:22px 0 0; font-size:clamp(30px, 3.1vw, 44px); font-weight:400; letter-spacing:-0.032em; line-height:1.06; text-wrap:balance")}><Br lines={c.title} /></h2>
          </div>
          <p style={css("flex:2 1 400px; max-width:520px; margin:0; font-size:16.5px; line-height:1.6; color:var(--sec); text-wrap:pretty")}>{c.lede}</p>
        </div>
        <div ref={v.trWrap} style={css(`position:relative; overflow:hidden; margin:56px 0 0; box-sizing:border-box; border-radius:12px; border:1px solid var(--line); box-shadow:0 30px 90px rgba(20,20,18,0.16); background:#EAE6DE ${BG.ctaB} center / cover; padding:clamp(18px,4vw,56px)`)}>
          <div style={css("position:absolute; inset:0; pointer-events:none; background:linear-gradient(180deg, rgba(248,246,240,0.5) 0%, rgba(248,246,240,0.3) 100%)")} />
          <div style={css("position:relative; display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 420px), 1fr)); gap:20px; align-items:stretch")}>
            <div style={css("min-width:0; border-radius:11px; background:#FCFBF9; border:1px solid rgba(20,20,18,0.14); box-shadow:0 30px 74px rgba(20,20,18,0.22), 0 4px 12px rgba(20,20,18,0.12); overflow:hidden; display:flex; flex-direction:column")}>
              <div style={css("position:relative; height:34px; flex:none; display:flex; align-items:center; gap:7px; padding:0 13px; background:rgba(20,20,18,0.045); border-bottom:1px solid rgba(20,20,18,0.08)")}>
                <span style={css("width:11px; height:11px; border-radius:50%; background:#FF5F57")} />
                <span style={css("width:11px; height:11px; border-radius:50%; background:#FEBC2E")} />
                <span style={css("width:11px; height:11px; border-radius:50%; background:#28C840")} />
                <div style={css("position:absolute; left:64px; right:12px; text-align:center; font-size:12.5px; color:#55544E; white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>{c.window}</div>
              </div>
              <div style={css("padding:20px 22px 18px; display:flex; flex-direction:column; flex:1")}>
                <div style={css("display:flex; justify-content:space-between; gap:16px; align-items:baseline")}>
                  <span style={css("font-size:16px; letter-spacing:-0.015em")}>{c.investor}</span>
                  <span style={css(`${MONO}; font-size:10px; letter-spacing:0.05em; text-transform:uppercase; color:#6E6D67`)}>{c.period}</span>
                </div>
                <div style={css("display:grid; margin:14px 0 0")}>
                  {v.trRows.map((r) => (
                    <button
                      key={r.i}
                      type="button"
                      data-i={r.i}
                      onClick={v.trPick}
                      aria-pressed={r.on === "true"}
                      className="hover:bg-[rgba(20,20,18,0.035)]!"
                      style={css(`position:relative; display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:4px 16px; width:100%; box-sizing:border-box; padding:13px 12px 13px 16px; border:0; border-top:1px solid ${r.rule}; border-radius:8px; background:${r.bg}; font:inherit; text-align:left; cursor:pointer; color:#1A1917; transition:background 200ms ease`)}
                    >
                      <span aria-hidden="true" style={css(`position:absolute; left:0; top:8px; bottom:8px; width:3px; border-radius:2px; background:var(--a); opacity:${r.barOp}; transition:opacity 200ms ease`)} />
                      <span style={css(`flex:1 1 auto; width:min-content; min-width:0; font-size:14.5px; letter-spacing:-0.01em; font-weight:${r.fw}`)}>{r.label}</span>
                      <span style={css("display:flex; align-items:center; gap:10px; flex:none; margin-left:auto")}>
                        <span style={css(`font-size:14.5px; font-variant-numeric:tabular-nums; font-weight:${r.fw}`)}>{r.amt}</span>
                        <span aria-hidden="true" style={css("width:7px; height:7px; border-radius:50%; background:var(--a); opacity:0.8")} />
                      </span>
                    </button>
                  ))}
                </div>
                <div style={css("margin-top:auto; padding:16px 0 0; display:flex; align-items:center; gap:12px")}>
                  <div aria-hidden="true" style={css("position:relative; flex:0 0 80px; height:2px; background:rgba(20,20,18,0.1); overflow:hidden")}>
                    <div ref={v.trBar} style={css("position:absolute; inset:0; background:#1A1917; transform:scaleX(0); transform-origin:0 50%")} />
                  </div>
                  <span style={css("font-size:12.5px; color:#6E6D67")}>{v.trHint}</span>
                </div>
              </div>
            </div>
            <div aria-live="polite" style={css("min-width:0; border-radius:11px; background:rgba(252,251,249,0.94); border:1px solid rgba(255,255,255,0.9); box-shadow:0 24px 60px -18px rgba(20,20,18,0.28); padding:22px 24px 20px; display:flex; flex-direction:column")}>
              <div style={css(`${MONO}; font-size:10.5px; letter-spacing:0.08em; text-transform:uppercase; color:#6E6D67`)}>Lineage</div>
              <div style={css("display:flex; justify-content:space-between; align-items:baseline; gap:16px; flex-wrap:wrap; margin:10px 0 0")}>
                <span style={css("font-size:18px; letter-spacing:-0.02em")}>{v.trSel.label}</span>
                <span style={css("font-size:clamp(24px,2.4vw,32px); letter-spacing:-0.03em; font-variant-numeric:tabular-nums")}>{v.trSel.amt}</span>
              </div>
              <div ref={v.trList} style={css("position:relative; display:grid; margin:20px 0 0")}>
                <span aria-hidden="true" style={css("position:absolute; left:7px; top:10px; bottom:24px; width:1.5px; background:rgba(20,20,18,0.12)")} />
                {v.trSteps.map((s) => (
                  <div key={s.k} data-trs="" style={css("position:relative; display:flex; gap:16px; padding:0 0 18px")}>
                    <span aria-hidden="true" style={css("position:relative; flex:none; width:16px; height:16px; margin:2px 0 0; box-sizing:border-box; border-radius:50%; background:#FCFBF9; border:1.5px solid var(--a); display:flex; align-items:center; justify-content:center")}>
                      <span style={css("width:6px; height:6px; border-radius:50%; background:var(--a)")} />
                    </span>
                    <span style={css("min-width:0; display:flex; flex-direction:column; gap:4px")}>
                      <span style={css(`${MONO}; font-size:10px; letter-spacing:0.07em; text-transform:uppercase; color:#6E6D67`)}>{s.k}</span>
                      <span style={css("font-size:14.5px; line-height:1.45; color:#1A1917; text-wrap:pretty")}>{s.v}</span>
                      <span style={css("font-size:12.5px; line-height:1.45; color:#6E6D67")}>{s.m}</span>
                    </span>
                  </div>
                ))}
              </div>
              <div style={css("margin-top:auto; padding:14px 0 0; border-top:1px solid rgba(20,20,18,0.08); display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap")}>
                <span style={css("display:inline-flex; align-items:center; height:24px; padding:0 9px; border-radius:999px; background:#E3EFE7; color:var(--ok-ink); font-size:12px")}>{c.pill}</span>
                <span style={css("font-size:12.5px; color:#6E6D67")}>{c.pillNote}</span>
              </div>
            </div>
          </div>
        </div>
        <p style={css("margin:16px 0 0; font-size:13.5px; line-height:1.5; color:var(--mut)")}>{c.caption}</p>
      </div>
    </section>
  );
}
