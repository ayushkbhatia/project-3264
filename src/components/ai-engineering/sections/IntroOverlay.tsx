/* eslint-disable react-hooks/refs -- `v` carries the page logic's createRef() objects, which
   these components only hand to ref={…}; nothing reads .current during render. */
import type { AIEngineeringVals } from "@/motion/ai-engineering/ai-engineering.logic";
import { css } from "@/components/private-credit/css";

// The load-time "Deploy log" overlay (4.8s): four deploy steps fill in turn, the wordmark
// resolves, the overlay lifts. The page logic builds it into iStage (runIntro); a click or any
// key skips it (280ms). display:none in the server HTML; the first-paint gate (IntroGate.ts)
// shows it from the first frame on the loads where it will play.

export function IntroOverlay({ v }: { v: AIEngineeringVals }) {
  return (
    <div ref={v.iWrap} data-ai-intro-wrap="" aria-hidden="true" onClick={v.skipIntro} style={css("position:fixed; inset:0; z-index:300; background:#F6F5F2; display:none; align-items:center; justify-content:center; overflow:hidden; cursor:pointer")}>
      <div ref={v.iStage} style={css("position:absolute; inset:0")} />
      <div ref={v.iMark} style={css("position:relative; opacity:0; font-size:clamp(48px,8vw,116px); font-weight:400; letter-spacing:-0.05em; line-height:1; white-space:nowrap")}>3264<span>.ai</span></div>
      <div style={css("position:absolute; left:32px; bottom:28px; font-size:13px; letter-spacing:-0.005em; color:var(--mut)")}>Deploy log</div>
      <div style={css("position:absolute; right:32px; bottom:28px; font-size:13px; letter-spacing:-0.005em; color:var(--mut)")}>click to skip</div>
    </div>
  );
}
