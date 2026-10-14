import { css } from "@/components/private-credit/css";
import { SmartLink } from "@/components/home/primitives";
import { bgImage } from "@/components/ai-engineering/bg";
import { Br } from "../Br";
import type { IndustryCopy } from "../types";

// Playbooks (Fund Management): four playbook cards, each a link to its playbook page. The whole
// card is the link and turns accent on hover. The paintings are the Playbooks library's own
// tiles (public/img/playbooks), served through the optimiser as CSS backgrounds.

const MONO = "font-family:'IBM Plex Mono', ui-monospace, monospace";

export function Playbooks({ c }: { c: NonNullable<IndustryCopy["playbooks"]> }) {
  return (
    <section id="playbooks" data-screen-label="Fund playbooks" style={css("padding:118px 40px; border-bottom:1px solid var(--line2)")}>
      <div style={css("max-width:1280px; margin:0 auto")}>
        <div style={css("display:flex; gap:28px 72px; flex-wrap:wrap; align-items:flex-end; justify-content:space-between")}>
          <div style={css("flex:3 1 480px; min-width:0")}>
            <div style={css("font-size:13px; letter-spacing:-0.005em; color:var(--mut)")}>{c.eyebrow}</div>
            <h2 style={css("margin:22px 0 0; font-size:clamp(30px, 3.1vw, 44px); font-weight:400; letter-spacing:-0.032em; line-height:1.06; text-wrap:balance")}><Br lines={c.title} /></h2>
          </div>
          <div style={css("flex:2 1 400px; max-width:520px; display:flex; flex-direction:column; align-items:flex-start; gap:18px")}>
            <p style={css("margin:0; font-size:16.5px; line-height:1.6; color:var(--sec); text-wrap:pretty")}>{c.lede}</p>
            <SmartLink href="/playbooks" style={css("font-size:14.5px; border-bottom:1px solid var(--line)")} className="hover:border-a! hover:text-a!">{c.all}</SmartLink>
          </div>
        </div>
        <div style={css("display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap:40px 22px; margin:56px 0 0")}>
          {c.cards.map((card) => (
            <SmartLink key={card.href} href={card.href} style={css("display:flex; flex-direction:column; min-width:0; color:#1A1917")} className="hover:text-a!">
              <span aria-hidden="true" style={css(`display:block; aspect-ratio:4 / 3; border-radius:16px; overflow:hidden; background:#E2DFD8 ${bgImage(card.image, 1376 / 768)} center / cover`)} />
              <span style={css(`margin:16px 0 0; ${MONO}; font-size:10.5px; letter-spacing:0.08em; text-transform:uppercase; color:var(--mut)`)}>Playbook</span>
              <span style={css("margin:8px 0 0; font-size:20px; letter-spacing:-0.022em; line-height:1.2")}>{card.title}</span>
              <span style={css("margin:8px 0 0; font-size:14.5px; line-height:1.55; color:var(--sec); text-wrap:pretty")}>{card.blurb}</span>
              <span style={css("margin:14px 0 0; font-size:14px")}>Read the playbook &rarr;</span>
            </SmartLink>
          ))}
        </div>
      </div>
    </section>
  );
}
