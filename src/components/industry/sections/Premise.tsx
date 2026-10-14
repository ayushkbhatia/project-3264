/* eslint-disable react-hooks/refs -- `v` carries the page logic's createRef() objects, which
   these components only hand to ref={…}; nothing reads .current during render. */
import type { ReactNode } from "react";
import type { IndustryVals } from "@/motion/industry/industry.logic";
import { css } from "@/components/private-credit/css";
import { BG } from "../bg";
import { Br } from "../Br";
import type { IndustryCopy } from "../types";

// 01 Premise: three cards pinned for 760vh roll over one another (stepStack). Each statement
// inks word by word and its window's rows reveal by their data-r thresholds.
//
// The cards' frames, paintings and statements are shared; each page passes its three windows'
// markup (`windows`), drawn on the fixed stages the logic fits (620×470, 700×520, 660×500).
//
// Below 768px each card stacks its statement over its window (globals.css, [data-ind-card]);
// the reference lays them side by side at every width, which crushes both on a phone.
//
// The grey status pills take --mut-ink-2 (globals.css), the nearest shade of the reference's
// #6E6D67 that reaches 4.5:1 on their 6% tint (#6E6D67 reads 4.43:1 there).

export function Premise({ v, c, windows }: { v: IndustryVals; c: IndustryCopy["premise"]; windows: [ReactNode, ReactNode, ReactNode] }) {
  return (
    <section data-screen-label="Premise" style={css("padding:118px 40px; border-bottom:1px solid var(--line2)")}>
      <div style={css("max-width:1280px; margin:0 auto; display:flex; gap:72px; flex-wrap:wrap; align-items:flex-end; justify-content:space-between")}>
        <div style={css("flex:3 1 480px")}>
          <div style={css("font-size:13px; letter-spacing:-0.005em; color:var(--mut)")}>{c.eyebrow}</div>
          <h2 style={css("margin:22px 0 0; font-size:clamp(30px, 3.1vw, 44px); font-weight:400; letter-spacing:-0.032em; line-height:1.06; text-wrap:balance")}><Br lines={c.title} /></h2>
        </div>
        <p style={css("flex:2 1 400px; max-width:520px; margin:0; font-size:16.5px; line-height:1.6; color:var(--sec); text-wrap:pretty")}>{c.lede}</p>
      </div>
      <div ref={v.stackTrack} style={css("position:relative; min-height:760vh; margin:62px 0 0")}>
        <div style={css("position:sticky; top:68px; height:calc(100vh - 68px); min-height:600px; display:flex; align-items:center; box-sizing:border-box; padding:24px 0")}>
          <div style={css("position:relative; width:100%; max-width:1280px; margin:0 auto; height:100%; max-height:780px")}>

            <div ref={v.c1} data-ind-card="" data-screen-label={`Premise: ${c.cards[0].label}`} style={css(`position:absolute; inset:0; overflow:hidden; box-sizing:border-box; border:1px solid var(--line); background:#DCE6DF ${BG.aiEngWash} center / cover; padding:clamp(32px,4.4vw,64px); display:flex; gap:clamp(24px,3.4vw,56px); align-items:stretch; transform-origin:left center; will-change:transform; box-shadow:-18px 0 48px rgba(20,20,18,0.16)`)}>
              <div data-ind-copy="" style={css("flex:1 1 300px; min-width:0; display:flex; flex-direction:column; justify-content:center; gap:32px")}>
                <div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:11.5px; letter-spacing:0.04em; text-transform:uppercase; color:#1A1917")}>{c.cards[0].eyebrow}</div>
                <p ref={v.c1x} style={css("margin:0; font-size:clamp(30px, 3.7vw, 56px); font-weight:400; letter-spacing:-0.034em; line-height:1.1")}>{v.w1.map((w, i) => (<span key={i} style={css("opacity:0.16")}>{w} </span>))}</p>
              </div>
              <div ref={v.c1f} data-ind-win="" style={css("flex:1.15 1 380px; min-width:0; position:relative")}>
                <div ref={v.c1s} aria-hidden="true" style={css("position:absolute; left:0; top:0; width:620px; height:470px; transform-origin:0 0")}>
                  {windows[0]}
                </div>
              </div>
            </div>

            <div ref={v.c2} data-ind-card="" data-screen-label={`Premise: ${c.cards[1].label}`} style={css(`position:absolute; inset:0; overflow:hidden; box-sizing:border-box; border:1px solid var(--line); background:#F4A27A ${BG.ctaE} center / cover; padding:clamp(32px,4.4vw,64px); display:flex; gap:clamp(24px,3.4vw,56px); align-items:stretch; transform-origin:left center; will-change:transform; transform:translateX(108%); box-shadow:-18px 0 48px rgba(20,20,18,0.16)`)}>
              <div data-ind-copy="" style={css("flex:1 1 300px; min-width:0; display:flex; flex-direction:column; justify-content:center; gap:32px")}>
                <div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:11.5px; letter-spacing:0.04em; text-transform:uppercase; color:#1A1917")}>{c.cards[1].eyebrow}</div>
                <p ref={v.c2x} style={css("margin:0; font-size:clamp(30px, 3.7vw, 56px); font-weight:400; letter-spacing:-0.034em; line-height:1.1")}>{v.w2.map((w, i) => (<span key={i} style={css("opacity:0.16")}>{w} </span>))}</p>
              </div>
              <div ref={v.c2f} data-ind-win="" style={css("flex:1.15 1 380px; min-width:0; position:relative")}>
                <div ref={v.c2s} aria-hidden="true" style={css("position:absolute; left:0; top:0; width:700px; height:520px; transform-origin:0 0")}>
                  {windows[1]}
                </div>
              </div>
            </div>

            <div ref={v.c3} data-ind-card="" data-screen-label={`Premise: ${c.cards[2].label}`} style={css(`position:absolute; inset:0; overflow:hidden; box-sizing:border-box; border:1px solid var(--line); background:#EFE3D6 ${BG.ctaA} center / cover; padding:clamp(32px,4.4vw,64px); display:flex; gap:clamp(24px,3.4vw,56px); align-items:stretch; transform-origin:left center; will-change:transform; transform:translateX(108%); box-shadow:-18px 0 48px rgba(20,20,18,0.16)`)}>
              <div style={css("position:absolute; inset:0; pointer-events:none; background:linear-gradient(180deg, rgba(248,246,240,0.62) 0%, rgba(248,246,240,0.44) 60%, rgba(248,246,240,0.3) 100%)")} />
              <div data-ind-copy="" style={css("position:relative; flex:1 1 300px; min-width:0; display:flex; flex-direction:column; justify-content:center; gap:32px")}>
                <div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:11.5px; letter-spacing:0.04em; text-transform:uppercase; color:#1A1917")}>{c.cards[2].eyebrow}</div>
                <p ref={v.c3x} style={css("margin:0; font-size:clamp(30px, 3.7vw, 56px); font-weight:400; letter-spacing:-0.034em; line-height:1.1")}>{v.w3.map((w, i) => (<span key={i} style={css("opacity:0.16")}>{w} </span>))}</p>
              </div>
              <div ref={v.c3f} data-ind-win="" style={css("flex:1.15 1 380px; min-width:0; position:relative")}>
                <div ref={v.c3s} aria-hidden="true" style={css("position:absolute; left:0; top:0; width:660px; height:500px; transform-origin:0 0")}>
                  {windows[2]}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
