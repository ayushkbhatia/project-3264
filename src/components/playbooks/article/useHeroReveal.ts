import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import { REVEAL_ATTR } from "./reveal";

/** The reveal's last step: its final state, which is also what the server renders. */
export const REVEAL_DONE = 4;

/**
 * The hero figure's reveal (README, F1): once 30% of the figure is on screen, step 1 at 400ms,
 * 2 at 1050, 3 at 1700 and 4 (done) at 2350, each part easing in over its own transition; the
 * final state is forced after 4s whatever happens. It runs once. Reduced motion, ?motion=off,
 * `animate = false` or a missing IntersectionObserver keep the final state throughout.
 *
 * Returns the step, 0–4. Before hydration the figure is in its final state (the server
 * render) or, on a first load where the reveal will play, held at step 0 by the head gate
 * (reveal.ts), which this takes over.
 */
export function useHeroReveal(ref: RefObject<HTMLElement | null>, animate: boolean): number {
  const [step, setStep] = useState(REVEAL_DONE);

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
    setStep(0);
    const timers: number[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        [1, 2, 3, 4].forEach((s, i) => timers.push(window.setTimeout(() => setStep(s), 400 + i * 650)));
        timers.push(window.setTimeout(() => setStep(REVEAL_DONE), 4000));
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [animate, ref]);

  // The figure now holds its own start state, so the gate's style can let go.
  useEffect(() => {
    const html = document.documentElement;
    if (step === 0 && html.getAttribute(REVEAL_ATTR) === "pending") html.setAttribute(REVEAL_ATTR, "run");
  }, [step]);

  return step;
}
