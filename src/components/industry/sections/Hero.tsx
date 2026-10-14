/* eslint-disable react-hooks/refs -- `v` carries the page logic's createRef() objects, which
   these components only hand to ref={…}; nothing reads .current during render. */
import type { IndustryVals } from "@/motion/industry/industry.logic";
import { HERO_SRC } from "../media";
import { Br } from "../Br";
import type { IndustryCopy } from "../types";
import { css } from "@/components/private-credit/css";

// Hero (#top). The painting sits in greyscale under a canvas copy of itself (initVeil /
// stepVeil); the pointer erases soft holes from the grey layer that refill over 2.4s, showing
// the original colours. Until the canvas has drawn, the <img> carries its own grayscale filter.
//
// A plain <img> of the same file the veil draws (HERO_SRC, the home page's painting): the
// canvas copy is cover-fitted and bottom-anchored to match it pixel for pixel, which an
// optimiser-resized source would not. It is the LCP; the page preloads it.
//
// The h1 balances its lines (not in the reference): on phones each half of the title wraps, and
// unbalanced it left "plan," and "100." on lines of their own. Wider, each half is one line.

export function Hero({ v, c }: { v: IndustryVals; c: IndustryCopy["hero"] }) {
  return (
    <section ref={v.heroSec} id="top" data-screen-label="Hero" style={css("position:relative; padding:0 40px; overflow:hidden; height:clamp(560px, 44vw, calc(100vh - 68px)); border-bottom:1px solid var(--line2)")}>
      {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
      <img ref={v.heroImg} src={HERO_SRC} alt="" fetchPriority="high" decoding="async" style={css("position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center bottom; filter:grayscale(1)")} />
      <canvas ref={v.heroVeil} aria-hidden="true" style={css("position:absolute; inset:0; width:100%; height:100%; pointer-events:none")} />
      <div style={css("position:absolute; inset:0; pointer-events:none; background:radial-gradient(ellipse 60% 52% at 50% 18%, rgba(250,248,240,0.62) 0%, rgba(250,248,240,0.28) 55%, rgba(250,248,240,0) 100%)")} />
      <div style={css("position:relative; max-width:1280px; margin:0 auto; padding:clamp(48px,5.2vw,76px) 0 0; display:flex; flex-direction:column; align-items:center; text-align:center")}>
        <div style={css("font-size:13px; letter-spacing:-0.005em; color:#2C2B27")}>{c.eyebrow}</div>
        <h1 style={css("margin:20px 0 0; font-size:clamp(36px, 4vw, 58px); font-weight:400; letter-spacing:-0.038em; line-height:1; text-wrap:balance")}><Br lines={c.title} /></h1>
        <p style={css("margin:22px 0 0; max-width:640px; font-size:clamp(15.5px, 1.2vw, 17px); line-height:1.55; color:#2C2B27; text-wrap:pretty")}>{c.lede}</p>
        <div style={css("display:flex; gap:12px; margin:28px 0 0; flex-wrap:wrap; justify-content:center")}>
          <a href="#engagement" style={css("display:inline-flex; align-items:center; height:46px; padding:0 24px; background:#1A1917; color:#FFFFFF; border-radius:6px; font-size:15px; font-weight:500; letter-spacing:-0.01em")} className="hover:bg-a! hover:text-white!">{c.primary}</a>
          <a href={c.secondaryHref ?? "#plan"} style={css("display:inline-flex; align-items:center; height:46px; padding:0 24px; box-sizing:border-box; border:1px solid var(--line); background:rgba(255,255,255,0.85); color:#1A1917; border-radius:6px; font-size:15px; font-weight:500; letter-spacing:-0.01em")} className="hover:border-a! hover:text-a!">{c.secondary}</a>
        </div>
      </div>
    </section>
  );
}
