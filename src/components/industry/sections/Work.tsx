import { css } from "@/components/private-credit/css";
import { SmartLink } from "@/components/home/primitives";
import { bgImage } from "@/components/ai-engineering/bg";
import { Br } from "../Br";
import type { IndustryCopy } from "../types";

// Related work (Fund Management): two case-study cards, each the whole link, with three metric
// rows (the last value in accent), and an "All work" button.

export function Work({ c }: { c: NonNullable<IndustryCopy["work"]> }) {
  return (
    <section id="work" data-screen-label="Related work" style={css("padding:118px 40px; border-bottom:1px solid var(--line2)")}>
      <div style={css("max-width:1280px; margin:0 auto")}>
        <div style={css("display:flex; gap:28px 72px; flex-wrap:wrap; align-items:flex-end; justify-content:space-between")}>
          <div style={css("flex:3 1 480px; min-width:0")}>
            <div style={css("font-size:13px; letter-spacing:-0.005em; color:var(--mut)")}>{c.eyebrow}</div>
            <h2 style={css("margin:22px 0 0; font-size:clamp(30px, 3.1vw, 44px); font-weight:400; letter-spacing:-0.032em; line-height:1.06; text-wrap:balance")}><Br lines={c.title} /></h2>
          </div>
          <p style={css("flex:2 1 400px; max-width:520px; margin:0; font-size:16.5px; line-height:1.6; color:var(--sec); text-wrap:pretty")}>{c.lede}</p>
        </div>
        <div style={css("display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 440px), 1fr)); gap:44px 28px; margin:56px 0 0")}>
          {c.cards.map((card) => (
            <SmartLink key={card.title} href={card.href} style={css("display:flex; flex-direction:column; min-width:0; color:#1A1917")} className="hover:text-a!">
              <span aria-hidden="true" style={css(`display:block; aspect-ratio:16 / 9; border-radius:18px; overflow:hidden; background:#E2DFD8 ${bgImage(card.image, 1376 / 768)} center / cover`)} />
              <span style={css("margin:22px 0 0; font-size:13px; color:var(--mut)")}>{card.eyebrow}</span>
              <span style={css("margin:10px 0 0; font-size:clamp(22px,2vw,26px); letter-spacing:-0.026em; line-height:1.18; text-wrap:balance")}>{card.title}</span>
              <span style={css("margin:12px 0 0; max-width:560px; font-size:15px; line-height:1.58; color:var(--sec); text-wrap:pretty")}>{card.summary}</span>
              <span style={css("display:grid; margin:22px 0 0")}>
                {card.metrics.map(([k, val], i) => (
                  <span key={k} style={css("display:flex; justify-content:space-between; align-items:baseline; gap:20px; border-top:1px solid var(--line2); padding:12px 0")}>
                    <span style={css("min-width:0; font-size:14px; color:#46453F")}>{k}</span>
                    <span style={css(`font-size:14.5px; font-variant-numeric:tabular-nums; white-space:nowrap; color:${i === card.metrics.length - 1 ? "var(--a)" : "#1A1917"}`)}>{val}</span>
                  </span>
                ))}
              </span>
              <span style={css("margin:16px 0 0; font-size:14px")}>Read the case study &rarr;</span>
            </SmartLink>
          ))}
        </div>
        <div style={css("display:flex; justify-content:flex-end; margin:36px 0 0")}>
          <SmartLink href="/#work" style={css("display:inline-flex; align-items:center; height:44px; padding:0 20px; border:1px solid var(--line); border-radius:6px; background:#FFFFFF; font-size:14.5px")} className="hover:border-a! hover:text-a!">{c.all}</SmartLink>
        </div>
      </div>
    </section>
  );
}
