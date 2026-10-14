/* eslint-disable react-hooks/refs -- `v` carries the page logic's createRef() objects, which
   these components only hand to ref={…}; nothing reads .current during render. */
import type { IndustryVals } from "@/motion/industry/industry.logic";
import { css } from "@/components/private-credit/css";
import { BG } from "../bg";
import { Br } from "../Br";
import type { IndustryCopy } from "../types";

// 06 Engagement: three cards that rise in, 0.12s apart, as the row comes into view
// (stepEngage). Their CTAs are the studio's email until a booking URL exists. Fund Management's
// cards are rounded (20px) and its third card takes a stronger wash (`rounded`, `strongLastVeil`).

// Fund Management's third card sits on a stronger wash so its text stays legible over the valley.
const STRONG_VEIL = "linear-gradient(180deg, rgba(250,249,246,0.88) 0%, rgba(250,249,246,0.78) 60%, rgba(250,249,246,0.66) 100%)";

export function Engagement({ v, c }: { v: IndustryVals; c: IndustryCopy["engagement"] }) {
  return (
    <section id="engagement" data-screen-label="Engagement" style={css("padding:118px 40px; border-bottom:1px solid var(--line2)")}>
      <div style={css("max-width:1280px; margin:0 auto")}>
        <div style={css("font-size:13px; letter-spacing:-0.005em; color:var(--mut)")}>{c.eyebrow}</div>
        <h2 style={css("margin:22px 0 0; max-width:760px; font-size:clamp(30px, 3.1vw, 44px); font-weight:400; letter-spacing:-0.032em; line-height:1.06; text-wrap:balance")}><Br lines={c.title} /></h2>
        <div ref={v.enRow} style={css("display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:20px; margin:56px 0 0")}>
          <div data-en="" style={css(`position:relative; overflow:hidden; ${c.rounded ? "border-radius:20px; " : ""}min-height:560px; box-sizing:border-box; border:1px solid rgba(20,20,18,0.13); background:#DCEAEE ${BG.ctaD} center / cover; display:flex; flex-direction:column`)}>
            <div style={css("position:absolute; inset:0; pointer-events:none; background:linear-gradient(180deg, rgba(246,245,242,0.8) 0%, rgba(246,245,242,0.62) 60%, rgba(246,245,242,0.44) 100%)")} />
            <div style={css("position:relative; flex:1; display:flex; flex-direction:column; gap:28px; padding:clamp(24px,2.6vw,36px)")}>
              <div style={css("display:flex; justify-content:space-between; gap:12px; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:11.5px; letter-spacing:0.04em; text-transform:uppercase; color:#1A1917")}><span>{c.cards[0].head[0]}</span><span>{c.cards[0].head[1]}</span></div>
              <div style={css("flex:1; display:flex; flex-direction:column; justify-content:center")}>
                <div style={css("font-size:clamp(34px, 3.2vw, 46px); letter-spacing:-0.04em; line-height:1")}>{typeof c.cards[0].title === "string" ? c.cards[0].title : <Br lines={c.cards[0].title} />}</div>
                <p style={css("margin:18px 0 0; font-size:16.5px; line-height:1.5; letter-spacing:-0.01em; color:#2C2B27; text-wrap:pretty")}>{c.cards[0].body}</p>
              </div>
              <div style={css("display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:16px; padding:16px 0 0; border-top:1px solid rgba(20,20,18,0.22)")}>
                <div><div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27")}>{c.cards[0].facts[0][0]}</div><div style={css("margin:6px 0 0; font-size:15px; letter-spacing:-0.015em")}>{c.cards[0].facts[0][1]}</div></div>
                <div><div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27")}>{c.cards[0].facts[1][0]}</div><div style={css("margin:6px 0 0; font-size:15px; letter-spacing:-0.015em")}>{c.cards[0].facts[1][1]}</div></div>
                <div><div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27")}>{c.cards[0].facts[2][0]}</div><div style={css("margin:6px 0 0; font-size:15px; letter-spacing:-0.015em")}>{c.cards[0].facts[2][1]}</div></div>
              </div>
              <a href="mailto:hello@3264.ai" style={css("align-self:flex-start; display:inline-flex; align-items:center; height:46px; padding:0 24px; background:#1A1917; color:#FFFFFF; border-radius:6px; font-size:15px; font-weight:500; letter-spacing:-0.01em")} className="hover:bg-a! hover:text-white!">{c.cards[0].cta}</a>
            </div>
          </div>
          <div data-en="" style={css(`position:relative; overflow:hidden; ${c.rounded ? "border-radius:20px; " : ""}min-height:560px; box-sizing:border-box; border:1px solid rgba(20,20,18,0.13); background:#EAE6DE ${BG.ctaB} center / cover; display:flex; flex-direction:column`)}>
            <div style={css("position:absolute; inset:0; pointer-events:none; background:linear-gradient(180deg, rgba(248,246,240,0.74) 0%, rgba(248,246,240,0.54) 60%, rgba(248,246,240,0.36) 100%)")} />
            <div style={css("position:relative; flex:1; display:flex; flex-direction:column; gap:28px; padding:clamp(24px,2.6vw,36px)")}>
              <div style={css("display:flex; justify-content:space-between; gap:12px; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:11.5px; letter-spacing:0.04em; text-transform:uppercase; color:#1A1917")}><span>{c.cards[1].head[0]}</span><span>{c.cards[1].head[1]}</span></div>
              <div style={css("flex:1; display:flex; flex-direction:column; justify-content:center")}>
                <div style={css("font-size:clamp(34px, 3.2vw, 46px); letter-spacing:-0.04em; line-height:1")}>{typeof c.cards[1].title === "string" ? c.cards[1].title : <Br lines={c.cards[1].title} />}</div>
                <p style={css("margin:18px 0 0; font-size:16.5px; line-height:1.5; letter-spacing:-0.01em; color:#2C2B27; text-wrap:pretty")}>{c.cards[1].body}</p>
              </div>
              <div style={css("display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:16px; padding:16px 0 0; border-top:1px solid rgba(20,20,18,0.22)")}>
                <div><div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27")}>{c.cards[1].facts[0][0]}</div><div style={css("margin:6px 0 0; font-size:15px; letter-spacing:-0.015em")}>{c.cards[1].facts[0][1]}</div></div>
                <div><div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27")}>{c.cards[1].facts[1][0]}</div><div style={css("margin:6px 0 0; font-size:15px; letter-spacing:-0.015em")}>{c.cards[1].facts[1][1]}</div></div>
                <div><div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27")}>{c.cards[1].facts[2][0]}</div><div style={css("margin:6px 0 0; font-size:15px; letter-spacing:-0.015em")}>{c.cards[1].facts[2][1]}</div></div>
              </div>
              <a href="mailto:hello@3264.ai" style={css("align-self:flex-start; display:inline-flex; align-items:center; height:46px; padding:0 24px; background:#1A1917; color:#FFFFFF; border-radius:6px; font-size:15px; font-weight:500; letter-spacing:-0.01em")} className="hover:bg-a! hover:text-white!">{c.cards[1].cta}</a>
            </div>
          </div>
          <div data-en="" style={css(`position:relative; overflow:hidden; ${c.rounded ? "border-radius:20px; " : ""}min-height:560px; box-sizing:border-box; border:1px solid rgba(20,20,18,0.13); background:#E4E8DC ${BG.ctaValley} center / cover; display:flex; flex-direction:column`)}>
            <div style={css(`position:absolute; inset:0; pointer-events:none; background:${c.strongLastVeil ? STRONG_VEIL : "linear-gradient(180deg, rgba(248,246,240,0.76) 0%, rgba(248,246,240,0.56) 60%, rgba(248,246,240,0.38) 100%)"}`)} />
            <div style={css("position:relative; flex:1; display:flex; flex-direction:column; gap:28px; padding:clamp(24px,2.6vw,36px)")}>
              <div style={css("display:flex; justify-content:space-between; gap:12px; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:11.5px; letter-spacing:0.04em; text-transform:uppercase; color:#1A1917")}><span>{c.cards[2].head[0]}</span><span>{c.cards[2].head[1]}</span></div>
              <div style={css("flex:1; display:flex; flex-direction:column; justify-content:center")}>
                <div style={css("font-size:clamp(34px, 3.2vw, 46px); letter-spacing:-0.04em; line-height:1")}>{typeof c.cards[2].title === "string" ? c.cards[2].title : <Br lines={c.cards[2].title} />}</div>
                <p style={css("margin:18px 0 0; font-size:16.5px; line-height:1.5; letter-spacing:-0.01em; color:#2C2B27; text-wrap:pretty")}>{c.cards[2].body}</p>
              </div>
              <div style={css("display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:16px; padding:16px 0 0; border-top:1px solid rgba(20,20,18,0.22)")}>
                <div><div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27")}>{c.cards[2].facts[0][0]}</div><div style={css("margin:6px 0 0; font-size:15px; letter-spacing:-0.015em")}>{c.cards[2].facts[0][1]}</div></div>
                <div><div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27")}>{c.cards[2].facts[1][0]}</div><div style={css("margin:6px 0 0; font-size:15px; letter-spacing:-0.015em")}>{c.cards[2].facts[1][1]}</div></div>
                <div><div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27")}>{c.cards[2].facts[2][0]}</div><div style={css("margin:6px 0 0; font-size:15px; letter-spacing:-0.015em")}>{c.cards[2].facts[2][1]}</div></div>
              </div>
              <a href="mailto:hello@3264.ai" style={css("align-self:flex-start; display:inline-flex; align-items:center; height:46px; padding:0 24px; background:#1A1917; color:#FFFFFF; border-radius:6px; font-size:15px; font-weight:500; letter-spacing:-0.01em")} className="hover:bg-a! hover:text-white!">{c.cards[2].cta}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
