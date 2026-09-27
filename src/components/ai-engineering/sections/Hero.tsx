/* eslint-disable react-hooks/refs -- `v` carries the page logic's createRef() objects, which
   these components only hand to ref={…}; nothing reads .current during render. */
import type { AIEngineeringVals } from "@/motion/ai-engineering/ai-engineering.logic";
import { css } from "@/components/private-credit/css";
import { HERO_POSTER, HERO_VIDEO } from "../hero-media";

// Hero (#top). A looping video plays in colour under a greyscale canvas (the veil), which
// redraws the current frame in grey every video frame; the pointer erases soft blots from the
// grey layer, which refill over ~2.4s, so the trail reveals the moving footage in colour
// (initVeil / stepVeil, design_handoff_ai_engineering_hero_video). Until the veil has drawn
// its first frame the video itself is greyscale (its inline filter), so colour only ever
// appears inside the trail.
//
// The video is self-hosted (hero-media.ts). Its poster is the first frame, preloaded by the page:
// it is the LCP, and it keeps the hero from standing empty before the first frame decodes.
//
// No `autoPlay`, unlike the handoff's element: React renders `muted` into the server HTML, so
// the browser would start the video before hydration, including for a reduced-motion visitor,
// until the logic paused it. initVeil starts playback itself on `canplay` when motion is
// allowed, so under reduced motion the video never leaves its first frame.

export function Hero({ v }: { v: AIEngineeringVals }) {
  return (
    <section ref={v.heroSec} id="top" data-screen-label="Hero" style={css("position:relative; padding:0 40px; border-bottom:1px solid var(--line2); overflow:hidden; width:100%; height:clamp(720px, 60vw, calc(100vh + 96px)); box-sizing:border-box")}>
      <video ref={v.heroImg} src={HERO_VIDEO} poster={HERO_POSTER} muted loop playsInline preload="auto" aria-hidden="true" style={css("position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center bottom; pointer-events:none; filter:grayscale(1)")} />
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
