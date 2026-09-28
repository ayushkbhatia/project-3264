import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import { REVEAL_ATTR } from "./reveal";

/** The four-step reveal's last step: its final state, which is also what the server renders. */
export const REVEAL_DONE = 4;

/** When each step lands, in ms after the reveal starts: the four of Covenant Watch, Loan Ops
    Ledger, Capital Call Flow and NAV Pack Review. A page may pass its own (Investor Reporting and
    Side-Letter Register: six, 150ms apart). */
export const FOUR_STEPS: readonly number[] = [400, 1050, 1700, 2350];

export type RevealTrigger = {
  /** IntersectionObserver options for the moment the reveal starts. */
  threshold: number;
  rootMargin?: string;
  /** Loan Ops Ledger: if the reveal has not started this many ms after mount, the figure
      settles on its final state and never plays. Covenant Watch waits for the reader. */
  startWithin?: number;
};

/** Covenant Watch: once 30% of the figure is on screen. */
export const ON_THIRD_VISIBLE: RevealTrigger = { threshold: 0.3 };

/** Loan Ops Ledger, Capital Call Flow, NAV Pack Review and Side-Letter Register: once the
    figure's top is in the upper 65% of the viewport (which works for figures taller than the
    screen), or the final state if that has not happened within 4s of mount. */
export const ON_TOP_IN_UPPER_65: RevealTrigger = { threshold: 0, rootMargin: "0px 0px -35% 0px", startWithin: 4000 };

/**
 * The hero figure's reveal (README, F1): once the trigger fires, the steps land on `schedule`
 * (by default step 1 at 400ms, 2 at 1050, 3 at 1700 and 4, the last, at 2350), each part
 * easing in over its own transition; the final state is forced 4s after the start whatever
 * happens. It runs once. Reduced motion, ?motion=off, `animate = false` or a missing
 * IntersectionObserver keep the final state throughout.
 *
 * Returns the step, from 0 to the schedule's length (the final state). Before hydration the
 * figure is in its final state (the server render) or, on a first load where the reveal will
 * play, held at step 0 by the head gate (reveal.ts), which this takes over.
 */
export function useHeroReveal(
  ref: RefObject<HTMLElement | null>,
  animate: boolean,
  trigger: RevealTrigger = ON_THIRD_VISIBLE,
  schedule: readonly number[] = FOUR_STEPS,
): number {
  const { threshold, rootMargin, startWithin } = trigger;
  // as a string, so a schedule written inline does not restart the reveal on every render
  const at = schedule.join(",");
  const [step, setStep] = useState(schedule.length);

  // Layout effect: on a client-side navigation there is no gate, and step 0 must be committed
  // before the new page's first paint.
  useLayoutEffect(() => {
    const html = document.documentElement;
    const gate = html.getAttribute(REVEAL_ATTR);
    const el = ref.current;
    const still =
      !animate ||
      !el ||
      gate === "released" ||
      html.getAttribute("data-motion") === "off" ||
      !("IntersectionObserver" in window) ||
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) {
      if (gate === "pending") html.setAttribute(REVEAL_ATTR, "off");
      return;
    }
    // Only the browser can say whether the reveal may play, and its start state has to be
    // committed before paint: hence state set in a layout effect.
    const times = at.split(",").map(Number);
    const done = times.length;
    // A client-side navigation arrives without the head gate (or with the last page's), and the
    // new page's style can be read before step 0 lands: Next's scroll handler measures the page
    // later in this same commit. Parts resolved at their final state would then transition out
    // to their start state, a visible flash. Holding them through the gate's style from here
    // means their first style is already the start state; the effect below lets go as usual.
    if (gate !== "pending") html.setAttribute(REVEAL_ATTR, "pending");
    setStep(0);
    const timers: number[] = [];
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        started = true;
        times.forEach((ms, i) => timers.push(window.setTimeout(() => setStep(i + 1), ms)));
        timers.push(window.setTimeout(() => setStep(done), 4000));
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    if (startWithin !== undefined)
      timers.push(
        window.setTimeout(() => {
          if (started) return;
          io.disconnect();
          setStep(done);
        }, startWithin),
      );
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [animate, ref, threshold, rootMargin, startWithin, at]);

  // The figure now holds its own start state, so the gate's style can let go.
  useEffect(() => {
    const html = document.documentElement;
    if (step === 0 && html.getAttribute(REVEAL_ATTR) === "pending") html.setAttribute(REVEAL_ATTR, "run");
  }, [step]);

  return step;
}
