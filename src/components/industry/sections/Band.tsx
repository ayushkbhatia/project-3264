import { css } from "@/components/private-credit/css";
import { BG } from "../bg";
import type { IndustryCopy } from "../types";

// A call-to-action band (Fund Management, after the audit): the valley painting under a dark
// green wash, the audit's offer and a square white button to the engagement cards. The
// reference draws the painting as an <img> at `object-position: center 64%`; it is the same
// cover-fitted painting here as a CSS background, through the optimiser like the page's others.

export function Band({ c }: { c: NonNullable<IndustryCopy["band"]> }) {
  return (
    <section data-screen-label="CTA · operations audit" style={css("padding:56px 40px")}>
      <div style={css("max-width:1280px; margin:0 auto")}>
        <div style={css("position:relative; overflow:hidden; border-radius:20px; border:1px solid rgba(20,20,18,0.2)")}>
          <div aria-hidden="true" style={css(`position:absolute; inset:0; background:#2E3A2C ${BG.ctaValley} center 64% / cover`)} />
          <div style={css("position:absolute; inset:0; background:linear-gradient(92deg, rgba(14,20,14,0.84) 0%, rgba(14,20,14,0.66) 44%, rgba(14,20,14,0.4) 74%, rgba(14,20,14,0.28) 100%)")} />
          <div style={css("position:relative; display:flex; flex-wrap:wrap; gap:28px 40px; align-items:flex-end; justify-content:space-between; padding:52px clamp(28px,3.6vw,48px)")}>
            <div style={css("flex:1 1 460px; min-width:0")}>
              <div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; letter-spacing:0.14em; text-transform:uppercase; color:rgba(255,255,255,0.72)")}>{c.eyebrow}</div>
              <h2 style={css("margin:14px 0 0; font-size:clamp(24px,2.4vw,35px); font-weight:400; letter-spacing:-0.032em; line-height:1.14; color:#F7F5F0; text-wrap:balance")}>{c.title}</h2>
            </div>
            <div style={css("display:flex; flex-direction:column; align-items:flex-start; gap:13px")}>
              <a href="#engagement" style={css("display:inline-flex; align-items:center; gap:9px; padding:15px 24px; background:#FFFFFF; color:#0A0A0A; font-size:14.5px; letter-spacing:-0.01em")} className="hover:bg-[#E9E4CF]! hover:text-[#0A0A0A]!">{c.cta} <span aria-hidden="true">&rarr;</span></a>
              <div style={css("font-size:13.5px; letter-spacing:-0.008em; color:rgba(255,255,255,0.8)")}>{c.note}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
