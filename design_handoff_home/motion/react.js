"use client";

// React binding for the four motion modules.
//
// The modules themselves are framework-agnostic: each is a class that takes a map of DOM
// nodes, exposes start() and destroy(), and owns its own rAF loop and listeners. This file
// is the only React-aware code in the folder, and it is deliberately thin — if you need
// different lifecycle behaviour, change this file and leave the modules alone.
//
// NEXT.JS NOTES
//   * Every component that calls useMotionSystem must be a client component ("use client").
//   * three.js is imported lazily inside the modules (see three-loader.js), so it never
//     enters the server bundle. Do not hoist a top-level `import * as THREE from "three"`
//     into a page — it will be evaluated during SSR and blow the first-load JS budget.
//   * start() is async in three of the four modules. It resolves after three and (for the
//     hero) the texture have loaded. Nothing in the layout depends on that resolving, which
//     is what keeps the page usable if WebGL is unavailable.

import { useCallback, useEffect, useRef } from "react";

export { IntroRelief } from "./intro-relief.js";
export { PlatformSequence } from "./platform-sequence.js";
export { Vignettes } from "./vignettes.js";
export { HeroArt } from "./hero-art.js";

/**
 * Mounts a motion system and returns a ref-factory to attach its elements.
 *
 *   const bind = useMotionSystem(PlatformSequence, { accent });
 *   <div ref={bind("phTrack")}>
 *     <div ref={bind("phPin")}>…</div>
 *   </div>
 *
 * The element map is read once, when the effect runs — so every element the system needs
 * must be in the same committed render. Do not conditionally render part of a system's
 * element set; mount it all and let the system control visibility.
 *
 * @param {Function} System  one of IntroRelief | PlatformSequence | Vignettes | HeroArt
 * @param {Object}   opts    options forwarded to the system (e.g. { accent, introPace })
 * @param {Array}    deps    re-create the system when these change. Keep it EMPTY unless
 *                           you genuinely want a teardown + rebuild; these systems are
 *                           expensive to construct and hold GPU resources.
 */
export function useMotionSystem(System, opts = {}, deps = []) {
  const nodes = useRef({});
  const inst = useRef(null);
  const latest = useRef(opts);
  latest.current = opts;

  const bind = useCallback((key) => (el) => {
    if (el) nodes.current[key] = el;
    else delete nodes.current[key];
  }, []);
  // Handler factory for methods the system exposes to markup (e.g. PlatformSequence.phJump):
  //   <button data-act="1" onClick={bind.handler("phJump")}>
  bind.handler = (method) => (e) => inst.current?.[method]?.(e);

  useEffect(() => {
    const system = new System(nodes.current, latest.current);
    inst.current = system;
    // start() may reject if WebGL or three is unavailable; that is a supported outcome.
    Promise.resolve()
      .then(() => system.start())
      .catch((err) => {
        if (process.env.NODE_ENV !== "production") console.warn(`[motion] ${System.name} did not start:`, err);
      });
    return () => { system.destroy(); if (inst.current === system) inst.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return bind;
}
