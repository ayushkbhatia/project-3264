"use client";

import { useState } from "react";
import { useMotionControls } from "@/motion/private-credit/react";

// Pause / play for the looping animations (the hero ring, the servicing cards and the
// investor window run for more than five seconds, which WCAG 2.2.2 asks to be pausable).
// Scroll-driven sequences are unaffected: they only move when the visitor scrolls.
// Not in the design; set in the footer bar's own 13px muted style (spec 09).
export function PauseControl() {
  const controls = useMotionControls();
  const [paused, setPaused] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={paused}
      onClick={() => {
        if (paused) controls.resume();
        else controls.pause();
        setPaused(controls.isPaused());
      }}
      className="cursor-pointer text-mut hover:text-a"
      style={{ font: "inherit", letterSpacing: "inherit", background: "none", border: 0, padding: 0 }}
    >
      {paused ? "Play animations" : "Pause animations"}
    </button>
  );
}
