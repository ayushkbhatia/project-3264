"use client";

import { createContext, useContext, useState, type ComponentProps } from "react";
import IndustryPage from "./IndustryPage";

// Pause / play for an industry page's looping animations. The audit (19s) and rollout (16s)
// loops run indefinitely, and Traceability auto-advances, which WCAG 2.2.2 asks to be pausable
// (the AI Engineering and Private Credit pages carry the same control). Pausing sets the logic's
// own `motion` prop to false, the prototype's "hold still" switch: each diagram holds its most
// informative frame, the statements are fully inked, the hero veil stops taking new holes and
// Traceability stops advancing. Not in the design; it sits in the footer bar.

const Ctx = createContext<{ paused: boolean; toggle: () => void } | null>(null);

export function IndustryMotion(props: Omit<ComponentProps<typeof IndustryPage>, "motion">) {
  const [paused, setPaused] = useState(false);
  return (
    <Ctx.Provider value={{ paused, toggle: () => setPaused((p) => !p) }}>
      <IndustryPage {...props} motion={!paused} />
    </Ctx.Provider>
  );
}

export function PauseControl() {
  const ctx = useContext(Ctx);
  if (!ctx) return null;
  return (
    <button
      type="button"
      aria-pressed={ctx.paused}
      onClick={ctx.toggle}
      className="cursor-pointer text-mut hover:text-a"
      style={{ font: "inherit", letterSpacing: "inherit", background: "none", border: 0, padding: 0 }}
    >
      {ctx.paused ? "Play animations" : "Pause animations"}
    </button>
  );
}
