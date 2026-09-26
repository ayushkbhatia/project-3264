/* eslint-disable react-hooks/refs -- `v` carries the page logic's createRef() objects, which
   these components only hand to ref={…}; nothing reads .current during render. */
import Image from "next/image";
import type { AIEngineeringVals } from "@/motion/ai-engineering/ai-engineering.logic";
import { css } from "@/components/private-credit/css";
import heroPlane from "../../../../public/img/ai-engineering/hero-plane.png";

// Hero (#top). The plane is drawn in colour under a greyscale canvas copy (the veil); the
// pointer erases soft blots from the grey copy, which refill over ~2.4s (initVeil / stepVeil).
// Until the veil is ready the image itself is greyscale.

export function Hero({ v }: { v: AIEngineeringVals }) {
  return (
    <section ref={v.heroSec} id="top" data-screen-label="Hero" style={css("position:relative; padding:0 40px; border-bottom:1px solid var(--line2); overflow:hidden; width:100%; height:clamp(720px, 60vw, calc(100vh + 96px)); box-sizing:border-box")}>
      {/* The LCP. `sizes` 100vw: the section is full-bleed. */}
      <Image ref={v.heroImg} quality={90} src={heroPlane} alt="" fill preload sizes="100vw" style={css("position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center bottom; pointer-events:none; filter:grayscale(1)")} />
      <canvas ref={v.heroVeil} aria-hidden="true" style={css("position:absolute; inset:0; width:100%; height:100%; pointer-events:none")} />
      <div style={css("position:absolute; inset:0; background:radial-gradient(ellipse 60% 52% at 50% 18%, rgba(250,248,240,0.62) 0%, rgba(250,248,240,0.28) 55%, rgba(250,248,240,0) 100%); pointer-events:none")} />
      <div style={css("position:relative; max-width:1280px; margin:0 auto; padding:clamp(48px,5.2vw,76px) 0 0; display:flex; flex-direction:column; align-items:center; text-align:center")}>
        <div style={css("font-size:13px; letter-spacing:-0.005em; color:#2C2B27")}>AI Engineering</div>
        <h1 style={css("margin:20px 0 0; font-size:clamp(36px,4vw,58px); font-weight:400; letter-spacing:-0.038em; line-height:1.0; text-wrap:balance")}>The prototype works.<br />Now it has to hold.</h1>
        <p style={css("margin:22px 0 0; max-width:640px; font-size:clamp(15.5px,1.2vw,17px); line-height:1.55; color:#2C2B27; text-wrap:pretty")}>
          Executives and analysts build working software in an afternoon now. We audit what they built, rebuild what has to be rebuilt, and run it in production with the controls a regulated firm is required to hold.
        </p>
        <div style={css("display:flex; gap:12px; flex-wrap:wrap; justify-content:center; margin:28px 0 0")}>
          <a className="hover:bg-a!" href="#engagement" style={css("display:flex; align-items:center; height:46px; padding:0 24px; background:#1A1917; color:#FFFFFF; border-radius:6px; font-size:15px; font-weight:500; letter-spacing:-0.01em")}>Book an audit</a>
          <a className="hover:border-a! hover:text-a!" href="#rebuild" style={css("display:flex; align-items:center; height:46px; padding:0 24px; border:1px solid var(--line); background:rgba(255,255,255,0.85); border-radius:6px; font-size:15px; letter-spacing:-0.01em")}>See the process</a>
        </div>
      </div>
    </section>
  );
}
