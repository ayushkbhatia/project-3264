"use client";

import { createContext, useContext, useState, type ComponentProps } from "react";
import PrivateEquityPage from "./PrivateEquityPage";

// Pause / play for the page's looping animations. The audit (19s) and portfolio (16s) loops run
// indefinitely, which WCAG 2.2.2 asks to be pausable (the AI Engineering and Private Credit
// pages carry the same control). Pausing sets the logic's own `motion` prop to false, the
// prototype's "hold still" switch: each diagram holds its most informative frame (the ranked
// list, the five companies live, the finished bridge), the statements are fully inked and the
// hero veil stops taking new holes. Not in the design; it sits in the footer bar.

const Ctx = createContext<{ paused: boolean; toggle: () => void } | null>(null);

export function PrivateEquity(props: Omit<ComponentProps<typeof PrivateEquityPage>, "motion">) {
  const [paused, setPaused] = useState(false);
  return (
    <Ctx.Provider value={{ paused, toggle: () => setPaused((p) => !p) }}>
      <PrivateEquityPage {...props} motion={!paused} />
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
