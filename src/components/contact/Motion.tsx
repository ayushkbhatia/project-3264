"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// The logo strip is the page's one moving part, and it runs indefinitely, which WCAG 2.2.2 asks to
// be pausable. The design pauses it under the pointer; the footer's pause control (as on Private
// Credit and AI Engineering, not in the design) pauses it for keyboard and touch too. Under
// reduced motion nothing moves, so the control is not shown.

const Ctx = createContext<{ paused: boolean; toggle: () => void } | null>(null);

export function ContactMotion({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  return <Ctx.Provider value={{ paused, toggle: () => setPaused((p) => !p) }}>{children}</Ctx.Provider>;
}

/**
 * The strip's track: two identical sets of marks, each with an 18px trailing gap, sliding left
 * by one set's width (50%) at the prototype's 32px a second: 9 × 160px marks + 9 × 18px gaps =
 * 1602px, so 50.0625s a loop. It holds under the pointer (the viewport is the `group`), while
 * paused, under reduced motion and under ?motion=off.
 */
export function LogoTrack({ children }: { children: ReactNode }) {
  const paused = useContext(Ctx)?.paused ?? false;
  return (
    <div
      data-paused={paused || undefined}
      className="flex w-max animate-[logo-marquee_50.0625s_linear_infinite] will-change-transform group-hover:[animation-play-state:paused] data-paused:[animation-play-state:paused] motion-reduce:animate-none [html[data-motion=off]_&]:animate-none"
    >
      {children}
    </div>
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
      className="cursor-pointer text-mut hover:text-a motion-reduce:hidden"
      style={{ font: "inherit", letterSpacing: "inherit", background: "none", border: 0, padding: 0 }}
    >
      {ctx.paused ? "Play animations" : "Pause animations"}
    </button>
  );
}
