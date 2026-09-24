"use client";

import { useLayoutEffect, useRef } from "react";
import { useBind } from "@/motion/private-credit/react";
import { css } from "./css";
import { PC_INTRO_ATTR } from "./IntroGate";

// The load-time "Reconciliation" overlay (~5.3s): a six-line fund reconciliation scrambles and
// settles, the variance counts down to 0.00, the wordmark resolves, the overlay lifts. The
// motion module drives it (runIntro) into iStage; skip on click (below) or any key.
//
// display:none in the server HTML: nothing shows if JS never runs, and a reduced-motion
// visitor never sees it. Two things cover the first paint when it will play:
//   * a hard load: the inline gate in IntroGate.ts, before the page paints;
//   * a client-side navigation here (no inline script runs then): the layout effect below,
//     which runs before the browser paints the new page.
// The module then owns the element; its dual teardown (onfinish OR timeout) hides it.

function willPlay() {
  const q = window.location.search;
  return !(
    /[?&](intro|motion)=off(&|$)/.test(q) ||
    document.visibilityState === "hidden" ||
    (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  );
}

export function Intro() {
  const bind = useBind();
  const wrap = useRef<HTMLDivElement | null>(null);
  const bindWrap = bind("iWrap");

  useLayoutEffect(() => {
    const el = wrap.current;
    // pending / run: this load's gate owns the cover; released: it timed out, no intro.
    // Absent or "done": a client-side mount, which the gate never saw.
    const gate = document.documentElement.getAttribute(PC_INTRO_ATTR);
    if (!el || (gate && gate !== "done")) return;
    if (willPlay()) el.style.display = "flex";
  }, []);

  return (
    <div
      ref={(el) => {
        wrap.current = el;
        bindWrap(el);
      }}
      data-pc-intro-wrap=""
      aria-hidden="true"
      onClick={bind.handler("skipIntro")}
      style={css(
        "position:fixed; inset:0; z-index:300; background:#F6F5F2; display:none; align-items:center; justify-content:center; overflow:hidden; cursor:pointer",
      )}
    >
      <div ref={bind("iStage")} style={css("position:absolute; inset:0")} />
      <div
        ref={bind("iMark")}
        style={css(
          "position:relative; opacity:0; font-size:clamp(48px,8vw,116px); font-weight:400; letter-spacing:-0.05em; line-height:1; white-space:nowrap",
        )}
      >
        3264<span>.ai</span>
      </div>
      <div style={css("position:absolute; left:32px; bottom:28px; font-size:13px; letter-spacing:-0.005em; color:var(--mut)")}>
        Reconciliation
      </div>
      <div style={css("position:absolute; right:32px; bottom:28px; font-size:13px; letter-spacing:-0.005em; color:var(--mut)")}>
        click to skip
      </div>
    </div>
  );
}
