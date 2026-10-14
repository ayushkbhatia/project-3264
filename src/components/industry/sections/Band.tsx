import { css } from "@/components/private-credit/css";
import { SmartLink } from "@/components/home/primitives";
import { BG } from "../bg";
import type { Band as BandCopy } from "../types";

// A call-to-action band: a painting under a dark wash, an offer and a square white button. Two
// tones from the references:
// - valley (Fund Management on, after the audit): the valley painting under dark green, to the
//   engagement cards. The reference draws it as an <img> at `object-position: center 64%`;
// - night (Production Assurance, after the related work): the night painting (cta-c) under
//   blue-black, with a line under the title, to AI Engineering's engagement cards, where the
//   audit is offered. Its <img> sits at `center 55%`.
// Both are the same cover-fitted paintings here as CSS backgrounds, through the optimiser like
// the page's others.

const TONES = {
  valley: {
    paint: `#2E3A2C ${BG.ctaValley} center 64% / cover`,
    wash: "linear-gradient(92deg, rgba(14,20,14,0.84) 0%, rgba(14,20,14,0.66) 44%, rgba(14,20,14,0.4) 74%, rgba(14,20,14,0.28) 100%)",
  },
  night: {
    paint: `#1B2130 ${BG.ctaC} center 55% / cover`,
    wash: "linear-gradient(92deg, rgba(14,16,24,0.86) 0%, rgba(14,16,24,0.7) 44%, rgba(14,16,24,0.44) 74%, rgba(14,16,24,0.3) 100%)",
  },
};

export function Band({ c }: { c: BandCopy }) {
  const tone = TONES[c.tone ?? "valley"];
  return (
    <section data-screen-label={c.label ?? "CTA · operations audit"} style={css("padding:56px 40px")}>
      <div style={css("max-width:1280px; margin:0 auto")}>
        <div style={css("position:relative; overflow:hidden; border-radius:20px; border:1px solid rgba(20,20,18,0.2)")}>
          <div aria-hidden="true" style={css(`position:absolute; inset:0; background:${tone.paint}`)} />
          <div style={css(`position:absolute; inset:0; background:${tone.wash}`)} />
          <div style={css("position:relative; display:flex; flex-wrap:wrap; gap:28px 40px; align-items:flex-end; justify-content:space-between; padding:52px clamp(28px,3.6vw,48px)")}>
            <div style={css("flex:1 1 460px; min-width:0")}>
              <div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; letter-spacing:0.14em; text-transform:uppercase; color:rgba(255,255,255,0.72)")}>{c.eyebrow}</div>
              <h2 style={css("margin:14px 0 0; font-size:clamp(24px,2.4vw,35px); font-weight:400; letter-spacing:-0.032em; line-height:1.14; color:#F7F5F0; text-wrap:balance")}>{c.title}</h2>
              {c.line ? <p style={css("margin:12px 0 0; max-width:520px; font-size:15px; line-height:1.55; color:rgba(255,255,255,0.78); text-wrap:pretty")}>{c.line}</p> : null}
            </div>
            <div style={css("display:flex; flex-direction:column; align-items:flex-start; gap:13px")}>
              <SmartLink href={c.href ?? "#engagement"} style={css("display:inline-flex; align-items:center; gap:9px; padding:15px 24px; background:#FFFFFF; color:#0A0A0A; font-size:14.5px; letter-spacing:-0.01em")} className="hover:bg-[#E9E4CF]! hover:text-[#0A0A0A]!">{c.cta} <span aria-hidden="true">&rarr;</span></SmartLink>
              <div style={css("font-size:13.5px; letter-spacing:-0.008em; color:rgba(255,255,255,0.8)")}>{c.note}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
