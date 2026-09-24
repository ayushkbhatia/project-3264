"use client";

// React binding for PrivateCreditMotion. The only React-aware file in motion/private-credit.
//
// The page has ONE motion instance that reaches into every section, so instead of a hook per
// section there is a root provider. Sections are ordinary components that call useBind() to
// attach their refs by name. The provider constructs the instance after the whole page has
// committed (children's refs attach before the parent's effect runs), and the module resolves
// refs lazily on every sync anyway, so ordering between sections does not matter.
//
//   <PrivateCreditMotionRoot options={{ accent }}>
//     <Header /> <Hero /> <Reality /> ...
//   </PrivateCreditMotionRoot>
//
//   function Hero() {
//     const bind = useBind();
//     return <canvas ref={bind("heroCv")} aria-hidden />;
//   }
//
// QA FLAGS (read here, so the reference and the port accept the same URLs):
//   ?t=16        freeze the time-driven loops (hero ring, servicing, investors) at t = 16s
//   ?intro=off   skip the intro overlay
//   ?motion=off  stop the time-driven loops entirely (scroll sequences still respond)
//
// PORT CHANGES to the handoff's version of this file (the module itself is untouched):
//   * start() is deferred a microtask and skipped if the instance was destroyed first. Strict
//     Mode mounts, unmounts and remounts synchronously; the handoff started the first instance
//     immediately, and its boot() queues ensure() in a microtask that then ran on the
//     destroyed instance: a second intro, and every section built twice.
//   * No ref writes during render (the React Compiler lint rules): options are read in the
//     effect, and the ref factory is created once.
//   * Reduced motion and the pause control (spec 09). Both freeze the time-driven loops on a
//     frame through frozenT rather than motion:false, because motion:false stops drawing
//     altogether and would leave the hero ring blank. Reduced motion freezes at t = 16s, the
//     resolved state the QA flag also uses; pause freezes wherever the loops are and resumes
//     from the same point.

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { PrivateCreditMotion, ELEMENTS } from "./private-credit.js";

export { PrivateCreditMotion, ELEMENTS };

const Ctx = createContext(null);
const ControlCtx = createContext(null);

/** Set on <html> by the page's first-paint intro gate (IntroGate.ts in the components). */
const INTRO_GATE_ATTR = "data-pc-intro";

/** The resolved frame of the time loops: ring folded to its hub, servicing done. */
const REST_T = 16;

function qaFlags() {
  if (typeof window === "undefined") return {};
  const q = new URLSearchParams(window.location.search);
  const o = {};
  if (q.has("t")) o.frozenT = parseFloat(q.get("t")) || 0;
  if (q.get("intro") === "off") o.playIntro = false;
  if (q.get("motion") === "off") { o.motion = false; o.playIntro = false; }
  return o;
}

export function PrivateCreditMotionRoot({ options = {}, children }) {
  const nodes = useRef({});
  const inst = useRef(null);

  // One stable ref-factory per mount, with a stable callback per key, so React never
  // detaches/reattaches a ref on re-render.
  const [bind] = useState(() => {
    const cache = {};
    const b = (key) => {
      if (process.env.NODE_ENV !== "production" && !ELEMENTS.includes(key)) {
        console.warn(`[motion] "${key}" is not in the PrivateCreditMotion DOM contract`);
      }
      if (!cache[key]) {
        cache[key] = (el) => {
          if (el) nodes.current[key] = el;
          else delete nodes.current[key];
        };
      }
      return cache[key];
    };
    // Methods the module exposes to markup:  onClick={bind.handler("skipIntro")}
    b.handler = (method) => (e) => inst.current?.[method]?.(e);
    return b;
  });

  // Freeze / resume the time-driven loops. `held` is the reason they are frozen, if any:
  // "qa" (?t=), "reduced" (prefers-reduced-motion) or "paused" (the footer control).
  const held = useRef(null);
  const [controls] = useState(() => ({
    pause() {
      const s = inst.current;
      if (!s || held.current) return;
      held.current = "paused";
      s.setOptions({ frozenT: s._t ?? 0 });
    },
    resume() {
      const s = inst.current;
      if (!s || held.current !== "paused") return;
      held.current = null;
      // carry on from the frozen frame, not from wall-clock time
      s.t0 = performance.now() - (s.frozenT ?? 0) * 1000;
      s.setOptions({ frozenT: null });
    },
    isPaused: () => held.current === "paused",
    isFrozen: () => held.current !== null,
  }));

  useEffect(() => {
    const flags = qaFlags();
    // The page's first-paint gate (components/private-credit/IntroGate.ts) covers the page
    // with the overlay until the module starts. If it already let go ("released": the module
    // was too slow), or the tab is in the background, the intro must not start late.
    const root = document.documentElement;
    const gate = root.getAttribute(INTRO_GATE_ATTR);
    if (gate === "released" || document.visibilityState === "hidden") flags.playIntro = false;
    const system = new PrivateCreditMotion(nodes.current, { ...options, ...flags });
    inst.current = system;
    held.current = flags.frozenT != null ? "qa" : null;
    let alive = true;

    const reduced = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    const syncReduced = () => {
      if (held.current === "qa" || held.current === "paused") return;
      if (reduced && reduced.matches) {
        held.current = "reduced";
        system.setOptions({ frozenT: REST_T });
      } else if (held.current === "reduced") {
        held.current = null;
        system.t0 = performance.now() - REST_T * 1000;
        system.setOptions({ frozenT: null });
      }
    };

    Promise.resolve().then(() => {
      if (!alive) return;
      try { system.start(); } catch (err) { console.error("[motion] PrivateCreditMotion did not start", err); }
      // start() queued the module's first ensure() (which runs the intro and sets the
      // overlay's inline display); after it, hand the overlay back from the gate's CSS.
      Promise.resolve().then(() => {
        if (alive && root.getAttribute(INTRO_GATE_ATTR) === "pending") root.setAttribute(INTRO_GATE_ATTR, "run");
      });
      syncReduced();
      if (reduced) reduced.addEventListener("change", syncReduced);
    });
    return () => {
      alive = false;
      if (reduced) reduced.removeEventListener("change", syncReduced);
      // "done": the gate's decision is spent. A later mount (Strict Mode's second pass, or a
      // client-side visit back to the page) plays the intro normally, with Intro.tsx covering
      // its first paint. "released" stays: a load that timed out does not replay it late.
      if (root.getAttribute(INTRO_GATE_ATTR) !== "released") root.setAttribute(INTRO_GATE_ATTR, "done");
      system.destroy();
      if (inst.current === system) inst.current = null;
    };
    // Built once per mount; option changes go through setOptions below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Option changes (e.g. accent from a theme switch) update in place. Never rebuild. The
  // constructor already has the initial options, and setOptions() arms and syncs the module,
  // so it must not reach an instance that has not started (or that Strict Mode is discarding).
  const accent = options.accent, gridTexture = options.gridTexture, motion = options.motion;
  useEffect(() => {
    const s = inst.current;
    if (s && s._boot) s.setOptions({ accent, gridTexture, motion });
  }, [accent, gridTexture, motion]);

  return (
    <Ctx.Provider value={bind}>
      <ControlCtx.Provider value={controls}>{children}</ControlCtx.Provider>
    </Ctx.Provider>
  );
}

export function useBind() {
  const bind = useContext(Ctx);
  if (!bind) throw new Error("useBind() must be used inside <PrivateCreditMotionRoot>");
  return bind;
}

/** Pause / resume the time-driven loops (hero ring, servicing, investors). */
export function useMotionControls() {
  const c = useContext(ControlCtx);
  if (!c) throw new Error("useMotionControls() must be used inside <PrivateCreditMotionRoot>");
  return c;
}
