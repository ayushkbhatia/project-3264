"use client";

import { IntroRelief, useMotionSystem, type MotionSystem } from "@/motion/react";
import { INTRO_ATTR, INTRO_PLAYED_KEY } from "./IntroGate";

// Load-time wordmark relief (ANIMATIONS.md §1, specs/05-intro.md). The behaviour lives in
// src/motion/intro-relief.js; this file owns the markup contract and the once-per-session policy.
//
// Whether it plays is decided before first paint by the gate script in <head> (see IntroGate.ts):
// only on a fresh load of "/", once per browser session, never under prefers-reduced-motion or
// ?motion=off. Client-side navigation back to "/" finds the attribute already moved on and does
// not replay it.

type IntroOptions = { accent?: string; introPace?: number; playIntro?: boolean };

// The slice of IntroRelief this component touches (react.d.ts only describes start/destroy).
interface IntroReliefInstance extends MotionSystem {
  props: IntroOptions;
  iWrap: { current: HTMLElement | null };
}

const IntroReliefBase = IntroRelief as unknown as new (
  els: Record<string, HTMLElement>,
  opts?: IntroOptions,
) => IntroReliefInstance;

class SessionIntro extends IntroReliefBase {
  private destroyed = false;

  start() {
    // Strict Mode destroys the first instance before useMotionSystem's deferred start() runs;
    // it must not touch the shared gate state on its way out.
    if (this.destroyed) return;
    const root = document.documentElement;
    const pending = root.getAttribute(INTRO_ATTR) === "pending";
    this.props.playIntro = this.props.playIntro !== false && pending;
    if (!this.props.playIntro) return;

    try {
      sessionStorage.setItem(INTRO_PLAYED_KEY, "1");
    } catch {
      // Storage blocked: the gate script would not have marked the page pending in the first place.
    }

    let running = false;
    try {
      super.start(); // runIntro() sets the overlay's inline display:flex synchronously
      running = this.iWrap.current?.style.display === "flex";
    } finally {
      // Same task as runIntro(): the first-paint cover hands over to the module without a frame
      // in between. If it did not start, release the page instead of leaving a cover up.
      root.setAttribute(INTRO_ATTR, running ? "run" : "off");
      if (!running) this.destroy();
    }
  }

  destroy() {
    this.destroyed = true;
    super.destroy();
  }
}

const OPTIONS: IntroOptions = { accent: "#157F52", introPace: 1, playIntro: true };

export function Intro() {
  const bind = useMotionSystem(SessionIntro, OPTIONS);

  // Markup mirrors the reference overlay one-to-one. display:none stays inline: the module drives
  // display inline, and with no JavaScript there must be no overlay. Decorative, so aria-hidden;
  // it is dismissed by click or any key and never traps focus.
  return (
    <div
      ref={bind("iWrap")}
      data-intro-wrap=""
      aria-hidden="true"
      onClick={bind.handler("skipIntro")}
      className="fixed inset-0 z-[300] cursor-pointer items-center justify-center overflow-hidden bg-[#F6F5F2]"
      style={{ display: "none" }}
    >
      <div ref={bind("iGrid")} className="absolute inset-0 opacity-0" />
      <canvas ref={bind("iCv")} className="absolute inset-0 h-full w-full opacity-0" />
      <div ref={bind("iMark")} className="relative text-center opacity-0">
        <div
          ref={bind("iLock")}
          className="whitespace-nowrap text-[length:clamp(48px,8vw,116px)] leading-none font-normal tracking-[-0.05em]"
        >
          3264<span ref={bind("iSfx")} className="opacity-0">.ai</span>
        </div>
      </div>
      <div
        ref={bind("iCap")}
        data-intro-cap=""
        className="absolute right-0 bottom-[36px] left-0 text-center text-[13px] tracking-[-0.005em] text-mut"
      >
        1
      </div>
    </div>
  );
}
