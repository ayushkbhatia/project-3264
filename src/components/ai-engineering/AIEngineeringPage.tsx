"use client";

import type { ReactNode } from "react";
import { AIEngineeringLogic, type AIEngineeringProps } from "@/motion/ai-engineering/ai-engineering.logic";
import { AI_INTRO_ATTR } from "./IntroGate";
import { NARROW } from "./media";
import { Audit } from "./sections/Audit";
import { Engagement } from "./sections/Engagement";
import { Hero } from "./sections/Hero";
import { IntroOverlay } from "./sections/IntroOverlay";
import { Premise } from "./sections/Premise";
import { Rebuild } from "./sections/Rebuild";

// The AI Engineering page, ported from design_handoff_ai_engineering (its reference prototype
// is the source of truth). As the handoff prescribes, the page IS its logic class: this
// component extends the prototype's AIEngineeringLogic (motion/ai-engineering) and adds the
// render(). The logic runs the intro, the hero veil, 01 Premise, 02 Audit and 06 Engagement
// from one rAF loop; 03–05 is its own component with its own loop (RebuildPlatform).
//
// Sections are plain functions of `v`, the logic's renderVals(): refs by their DOM-contract
// names, word arrays, handlers. The page renders once, and again only when the footer's pause
// control flips `motion` (Motion.tsx). The one piece of React state inside it is the audit
// finding index, which lives in <AuditFindings> so its 1.3s step re-renders that pane only.
//
// What this class adds to the logic, without editing its method bodies:
//   * the intro's first-paint gate (IntroGate.ts): the intro does not start late if the gate
//     already let go, and the gate hands the overlay to the logic once it has started;
//   * spec 08's interim rule below 900px: the pinned sections stack (globals.css), with every
//     statement inked, the calendar complete and the snippet at its final state;
//   * the Engagement spines are buttons, reachable by keyboard only while they are showing.

type Props = AIEngineeringProps & {
  /** Server-rendered site chrome, placed where the reference has them. */
  header: ReactNode;
  footer: ReactNode;
};

export default class AIEngineeringPage extends AIEngineeringLogic<Props> {
  private narrow: MediaQueryList | null = null;
  private engageStacked = false;

  componentDidMount() {
    this.narrow = window.matchMedia(NARROW);
    super.componentDidMount();
    // The logic has now started the intro (or decided not to): the overlay's display is its own.
    const root = document.documentElement;
    if (root.getAttribute(AI_INTRO_ATTR) === "pending") root.setAttribute(AI_INTRO_ATTR, "run");
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    // A later mount (Strict Mode's second pass, a client-side visit back) plays the intro as
    // usual; a load whose gate timed out ("released") does not play it late.
    const root = document.documentElement;
    if (root.getAttribute(AI_INTRO_ATTR) !== "released") root.setAttribute(AI_INTRO_ATTR, "done");
  }

  maybeIntro() {
    const gate = document.documentElement.getAttribute(AI_INTRO_ATTR);
    if (gate === "released" || document.visibilityState === "hidden") return;
    super.maybeIntro();
  }

  stepStack() {
    if (!this.narrow?.matches) {
      super.stepStack();
      return;
    }
    // Stacked cards: each statement inked, each stage fitted to its column at its end state.
    this.stepWhatChanged(1);
    this.stepProduced(1);
    this.stepUnchanged(1);
  }

  stepEngage() {
    if (!this.narrow?.matches) {
      if (this.engageStacked) {
        this.engageStacked = false;
        this._enM = null; // rewrite every card style on the way back to the pinned layout
      }
      super.stepEngage();
      this.syncSpines();
      return;
    }
    // Stacked cards: both paragraphs inked, the calendar complete, the snippet at its end
    // state (enRenderBuild draws it from these two values while the section is on screen).
    if (!this.engageStacked) {
      this.engageStacked = true;
      for (const p of [this.enAx.current, this.enBx.current]) {
        if (p) for (const w of p.children as HTMLCollectionOf<HTMLElement>) w.style.opacity = "1";
      }
      this.enCalendar(this.enCal.current, 1);
    }
    this._enP2 = 1;
    this._enVB = 1;
  }

  /** A spine takes clicks only while it shows (the logic sets pointer-events); so does Tab. */
  private syncSpines() {
    for (const el of [this.enAs.current, this.enBs.current] as Array<HTMLButtonElement | null>) {
      if (!el) continue;
      const on = el.style.pointerEvents !== "none";
      if (el.tabIndex !== (on ? 0 : -1)) {
        el.tabIndex = on ? 0 : -1;
        if (on) el.removeAttribute("aria-hidden");
        else el.setAttribute("aria-hidden", "true");
      }
    }
  }

  render() {
    const v = this.renderVals();
    return (
      // data-ai: the page runs on the prototype's UA defaults, content-box sizing (globals.css).
      <div data-ai="">
        <IntroOverlay v={v} />
        <div>
          {this.props.header}
          <main>
            <Hero v={v} />
            <Premise v={v} />
            <Audit v={v} />
            <Rebuild motion={this.props.motion} />
            <Engagement v={v} />
          </main>
          {this.props.footer}
        </div>
      </div>
    );
  }
}
