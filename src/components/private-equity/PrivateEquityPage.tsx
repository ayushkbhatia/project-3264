"use client";

import type { ReactNode } from "react";
import { PrivateEquityLogic, type PrivateEquityProps } from "@/motion/private-equity/private-equity.logic";
import { PE_INTRO_ATTR } from "./IntroGate";
import { Audit } from "./sections/Audit";
import { Engagement } from "./sections/Engagement";
import { Hero } from "./sections/Hero";
import { IntroOverlay } from "./sections/IntroOverlay";
import { Plan } from "./sections/Plan";
import { Portfolio } from "./sections/Portfolio";
import { Premise } from "./sections/Premise";
import { Value } from "./sections/Value";

// The Private Equity page, ported from design_handoff_private_equity (its reference prototype
// is the source of truth). As on AI Engineering, the page IS its logic class: this component
// extends the prototype's PrivateEquityLogic (motion/private-equity) and adds the render(). The
// logic runs the intro, the hero veil and all six sections from one rAF loop, writing styles to
// the DOM through refs; React renders the page once, and again only when the footer's pause
// control flips `motion` (Motion.tsx).
//
// Sections are plain functions of `v`, the logic's renderVals(): refs by their DOM-contract
// names, the statements' words and the audit grid's data.
//
// What this class adds to the logic, without editing its method bodies: the intro's first-paint
// gate (IntroGate.ts). The intro does not start late if the gate already let go, and the gate
// hands the overlay to the logic once it has started.

type Props = PrivateEquityProps & {
  /** Server-rendered site chrome and the closing image, placed where the reference has them. */
  header: ReactNode;
  closing: ReactNode;
  footer: ReactNode;
};

export default class PrivateEquityPage extends PrivateEquityLogic<Props> {
  componentDidMount() {
    super.componentDidMount();
    // The logic has now started the intro (or decided not to): the overlay's display is its own.
    const root = document.documentElement;
    if (root.getAttribute(PE_INTRO_ATTR) === "pending") root.setAttribute(PE_INTRO_ATTR, "run");
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    // A later mount (Strict Mode's second pass, a client-side visit back) plays the intro as
    // usual; a load whose gate timed out ("released") does not play it late.
    const root = document.documentElement;
    if (root.getAttribute(PE_INTRO_ATTR) !== "released") root.setAttribute(PE_INTRO_ATTR, "done");
  }

  maybeIntro() {
    const gate = document.documentElement.getAttribute(PE_INTRO_ATTR);
    if (gate === "released" || document.visibilityState === "hidden") return;
    super.maybeIntro();
  }

  render() {
    const v = this.renderVals();
    return (
      // data-pe: the page runs on the prototype's UA defaults, content-box sizing (globals.css).
      <div data-pe="">
        <IntroOverlay v={v} />
        <div>
          {this.props.header}
          <main>
            <Hero v={v} />
            <Premise v={v} />
            <Audit v={v} />
            <Plan v={v} />
            <Portfolio v={v} />
            <Value v={v} />
            <Engagement v={v} />
            {this.props.closing}
          </main>
          {this.props.footer}
        </div>
      </div>
    );
  }
}
