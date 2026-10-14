/* eslint-disable react-hooks/refs -- `v` carries the page logic's createRef() objects, which
   these components only hand to ref={…}; nothing reads .current during render. */
import type { PrivateEquityVals } from "@/motion/private-equity/private-equity.logic";
import { css } from "@/components/private-credit/css";
import { BG } from "../bg";

// 06 Engagement: three cards that rise in, 0.12s apart, as the row comes into view
// (stepEngage). Their CTAs are the studio's email until a booking URL exists.

export function Engagement({ v }: { v: PrivateEquityVals }) {
  return (
    <section id="engagement" data-screen-label="Engagement" style={css("padding:118px 40px; border-bottom:1px solid var(--line2)")}>
      <div style={css("max-width:1280px; margin:0 auto")}>
        <div style={css("font-size:13px; letter-spacing:-0.005em; color:var(--mut)")}>06 / Engagement</div>
        <h2 style={css("margin:22px 0 0; max-width:760px; font-size:clamp(30px, 3.1vw, 44px); font-weight:400; letter-spacing:-0.032em; line-height:1.06")}>Three ways in.<br />Each one earns the next.</h2>
        <div ref={v.enRow} style={css("display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:20px; margin:56px 0 0")}>
          <div data-en="" style={css(`position:relative; overflow:hidden; min-height:560px; box-sizing:border-box; border:1px solid rgba(20,20,18,0.13); background:#DCEAEE ${BG.ctaD} center / cover; display:flex; flex-direction:column`)}>
            <div style={css("position:absolute; inset:0; pointer-events:none; background:linear-gradient(180deg, rgba(246,245,242,0.8) 0%, rgba(246,245,242,0.62) 60%, rgba(246,245,242,0.44) 100%)")} />
            <div style={css("position:relative; flex:1; display:flex; flex-direction:column; gap:28px; padding:clamp(24px,2.6vw,36px)")}>
              <div style={css("display:flex; justify-content:space-between; gap:12px; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:11.5px; letter-spacing:0.04em; text-transform:uppercase; color:#1A1917")}><span>Engagement 01</span><span>2 weeks · fixed fee</span></div>
              <div style={css("flex:1; display:flex; flex-direction:column; justify-content:center")}>
                <div style={css("font-size:clamp(34px, 3.2vw, 46px); letter-spacing:-0.04em; line-height:1")}>The portfolio audit</div>
                <p style={css("margin:18px 0 0; font-size:16.5px; line-height:1.5; letter-spacing:-0.01em; color:#2C2B27; text-wrap:pretty")}>We walk the workflows in up to six portfolio companies, read the systems and interview the operators. You get a ranked, costed plan for each company and one for the fund.</p>
              </div>
              <div style={css("display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:16px; padding:16px 0 0; border-top:1px solid rgba(20,20,18,0.22)")}>
                <div><div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27")}>Covers</div><div style={css("margin:6px 0 0; font-size:15px; letter-spacing:-0.015em")}>Up to six companies</div></div>
                <div><div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27")}>Access</div><div style={css("margin:6px 0 0; font-size:15px; letter-spacing:-0.015em")}>Read-only</div></div>
                <div><div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27")}>Output</div><div style={css("margin:6px 0 0; font-size:15px; letter-spacing:-0.015em")}>Ranked, costed plan</div></div>
              </div>
              <a href="mailto:hello@3264.ai" style={css("align-self:flex-start; display:inline-flex; align-items:center; height:46px; padding:0 24px; background:#1A1917; color:#FFFFFF; border-radius:6px; font-size:15px; font-weight:500; letter-spacing:-0.01em")} className="hover:bg-a! hover:text-white!">Book an audit</a>
            </div>
          </div>
          <div data-en="" style={css(`position:relative; overflow:hidden; min-height:560px; box-sizing:border-box; border:1px solid rgba(20,20,18,0.13); background:#EAE6DE ${BG.ctaB} center / cover; display:flex; flex-direction:column`)}>
            <div style={css("position:absolute; inset:0; pointer-events:none; background:linear-gradient(180deg, rgba(248,246,240,0.74) 0%, rgba(248,246,240,0.54) 60%, rgba(248,246,240,0.36) 100%)")} />
            <div style={css("position:relative; flex:1; display:flex; flex-direction:column; gap:28px; padding:clamp(24px,2.6vw,36px)")}>
              <div style={css("display:flex; justify-content:space-between; gap:12px; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:11.5px; letter-spacing:0.04em; text-transform:uppercase; color:#1A1917")}><span>Engagement 02</span><span>100 days · per capability</span></div>
              <div style={css("flex:1; display:flex; flex-direction:column; justify-content:center")}>
                <div style={css("font-size:clamp(34px, 3.2vw, 46px); letter-spacing:-0.04em; line-height:1")}>The first build</div>
                <p style={css("margin:18px 0 0; font-size:16.5px; line-height:1.5; letter-spacing:-0.01em; color:#2C2B27; text-wrap:pretty")}>A senior squad ships the top-ranked capabilities in one company onto a production platform in its own cloud. Each one reports against a baseline the CFO signed.</p>
              </div>
              <div style={css("display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:16px; padding:16px 0 0; border-top:1px solid rgba(20,20,18,0.22)")}>
                <div><div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27")}>Runs in</div><div style={css("margin:6px 0 0; font-size:15px; letter-spacing:-0.015em")}>The company’s cloud</div></div>
                <div><div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27")}>Releases</div><div style={css("margin:6px 0 0; font-size:15px; letter-spacing:-0.015em")}>Fortnightly</div></div>
                <div><div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27")}>Measured</div><div style={css("margin:6px 0 0; font-size:15px; letter-spacing:-0.015em")}>Against baseline</div></div>
              </div>
              <a href="mailto:hello@3264.ai" style={css("align-self:flex-start; display:inline-flex; align-items:center; height:46px; padding:0 24px; background:#1A1917; color:#FFFFFF; border-radius:6px; font-size:15px; font-weight:500; letter-spacing:-0.01em")} className="hover:bg-a! hover:text-white!">Book a call</a>
            </div>
          </div>
          <div data-en="" style={css(`position:relative; overflow:hidden; min-height:560px; box-sizing:border-box; border:1px solid rgba(20,20,18,0.13); background:#E4E8DC ${BG.ctaValley} center / cover; display:flex; flex-direction:column`)}>
            <div style={css("position:absolute; inset:0; pointer-events:none; background:linear-gradient(180deg, rgba(248,246,240,0.76) 0%, rgba(248,246,240,0.56) 60%, rgba(248,246,240,0.38) 100%)")} />
            <div style={css("position:relative; flex:1; display:flex; flex-direction:column; gap:28px; padding:clamp(24px,2.6vw,36px)")}>
              <div style={css("display:flex; justify-content:space-between; gap:12px; font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:11.5px; letter-spacing:0.04em; text-transform:uppercase; color:#1A1917")}><span>Engagement 03</span><span>Ongoing · per company</span></div>
              <div style={css("flex:1; display:flex; flex-direction:column; justify-content:center")}>
                <div style={css("font-size:clamp(34px, 3.2vw, 46px); letter-spacing:-0.04em; line-height:1")}>The portfolio rollout</div>
                <p style={css("margin:18px 0 0; font-size:16.5px; line-height:1.5; letter-spacing:-0.01em; color:#2C2B27; text-wrap:pretty")}>What worked at the first company is installed at the next, adapted to its systems, with an evaluation suite and a named owner at each. The evidence is ready when the buyer asks for it.</p>
              </div>
              <div style={css("display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:16px; padding:16px 0 0; border-top:1px solid rgba(20,20,18,0.22)")}>
                <div><div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27")}>Reuses</div><div style={css("margin:6px 0 0; font-size:15px; letter-spacing:-0.015em")}>Platform and library</div></div>
                <div><div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27")}>Owner</div><div style={css("margin:6px 0 0; font-size:15px; letter-spacing:-0.015em")}>Named per company</div></div>
                <div><div style={css("font-family:'IBM Plex Mono', ui-monospace, monospace; font-size:10.5px; letter-spacing:0.06em; text-transform:uppercase; color:#2C2B27")}>At exit</div><div style={css("margin:6px 0 0; font-size:15px; letter-spacing:-0.015em")}>Evidence in the data room</div></div>
              </div>
              <a href="mailto:hello@3264.ai" style={css("align-self:flex-start; display:inline-flex; align-items:center; height:46px; padding:0 24px; background:#1A1917; color:#FFFFFF; border-radius:6px; font-size:15px; font-weight:500; letter-spacing:-0.01em")} className="hover:bg-a! hover:text-white!">Book a call</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
