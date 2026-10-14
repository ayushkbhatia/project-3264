"use client";

import { IndustryLogic } from "@/motion/industry/industry.logic";
import { Audit } from "./sections/Audit";
import { Band } from "./sections/Band";
import { Engagement } from "./sections/Engagement";
import { Hero } from "./sections/Hero";
import { IntroOverlay } from "./sections/IntroOverlay";
import { Plan } from "./sections/Plan";
import { Playbooks } from "./sections/Playbooks";
import { Portfolio } from "./sections/Portfolio";
import { Premise } from "./sections/Premise";
import { Trace } from "./sections/Trace";
import { Value } from "./sections/Value";
import { Work } from "./sections/Work";
import type { IndustryPageProps } from "./types";

// An industry page (Private Equity, Fund Management, Financial Services, Asset Management) or
// Production Assurance, the service page built on the same framework, ported from their design
// handoffs, which ask for one set of components with each page's content passed in as data. As on AI Engineering, the page IS its logic class: this component extends
// the shared IndustryLogic (motion/industry) and adds the render(). The logic runs the intro, the
// hero veil and every animated section from one rAF loop, writing styles to the DOM through refs;
// React renders the page once, again when the footer's pause control flips `motion`
// (Motion.tsx), and on Fund Management when Traceability's selection changes.
//
// Sections are plain functions of `v`, the logic's renderVals() (refs by their DOM-contract
// names, the statements' words, the audit grid, the trace rows), and of the page's copy. The
// sections a page has no copy for (the bands, Traceability, playbooks, related work) are left out.
//
// Departures from the references, each noted where it is made: the section titles balance their
// lines (on phones they otherwise strand a word, as the hero did), the premise cards and the build
// log reflow below 768px (globals.css), the grey pills and the "Traced" pill take the nearest
// colours that pass AA contrast, and the D100 log row completes on day 100.
//
// What this class adds to the logic, without editing its method bodies: the intro's first-paint
// gate (IntroGate.ts). The intro does not start late if the gate already let go, and the gate
// hands the overlay to the logic once it has started.

type Props = IndustryPageProps & { motion?: boolean };

export default class IndustryPage extends IndustryLogic<Props> {
  componentDidMount() {
    super.componentDidMount();
    // The logic has now started the intro (or decided not to): the overlay's display is its own.
    const root = document.documentElement, attr = this.props.introAttr;
    if (root.getAttribute(attr) === "pending") root.setAttribute(attr, "run");
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    // A later mount (Strict Mode's second pass, a client-side visit back) plays the intro as
    // usual; a load whose gate timed out ("released") does not play it late.
    const root = document.documentElement, attr = this.props.introAttr;
    if (root.getAttribute(attr) !== "released") root.setAttribute(attr, "done");
  }

  maybeIntro() {
    const gate = document.documentElement.getAttribute(this.props.introAttr);
    if (gate === "released" || document.visibilityState === "hidden") return;
    super.maybeIntro();
  }

  render() {
    const v = this.renderVals();
    const c = this.props.data.copy;
    return (
      // data-ind: the page runs on the prototype's UA defaults, content-box sizing (globals.css).
      <div data-ind="">
        <IntroOverlay v={v} label={c.introLabel} />
        <div>
          {this.props.header}
          <main>
            <Hero v={v} c={c.hero} />
            <Premise v={v} c={c.premise} windows={this.props.windows} />
            <Audit v={v} c={c.audit} />
            {c.band ? <Band c={c.band} /> : null}
            <Plan v={v} c={c.plan} />
            {c.trace ? <Trace v={v} c={c.trace} /> : null}
            <Portfolio v={v} c={c.portfolio} count={this.props.data.pfCount?.[0]} />
            {c.playbooks ? <Playbooks c={c.playbooks} /> : null}
            <Value v={v} c={c.value} />
            {c.work ? <Work c={c.work} /> : null}
            {c.offer ? <Band c={c.offer} /> : null}
            <Engagement v={v} c={c.engagement} />
            {this.props.closing}
          </main>
          {this.props.footer}
        </div>
      </div>
    );
  }
}
