"use client";

import { createContext, useContext, useState, type ComponentProps } from "react";
import AIEngineeringPage from "./AIEngineeringPage";

// Pause / play for the page's looping animations. The audit loop, the 04 and 05 scenes and
// the build card's platform snippet run indefinitely, which WCAG 2.2.2 asks to be pausable
// (the Private Credit page has the same control). Pausing sets the logic's own `motion` prop
// to false, the prototype's "hold still" switch: fills complete, the veil and snippet hold
// still, the audit shows its static frame; and the 03–05 canvas settles as under reduced
// motion (RebuildPlatform.tsx). Not in the design; it sits in the footer bar.

const Ctx = createContext<{ paused: boolean; toggle: () => void } | null>(null);

export function AIEngineering(props: Omit<ComponentProps<typeof AIEngineeringPage>, "motion">) {
  const [paused, setPaused] = useState(false);
  return (
    <Ctx.Provider value={{ paused, toggle: () => setPaused((p) => !p) }}>
      <AIEngineeringPage {...props} motion={!paused} />
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
