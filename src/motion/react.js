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

import { useEffect, useRef, useState } from "react";

export { IntroRelief } from "./intro-relief.js";
export { PlatformSequence } from "./platform-sequence.js";
export { Vignettes } from "./vignettes.js";
export { HeroArt, HERO_SRC } from "./hero-art.js";

/** True when the page was loaded with `?motion=off`. */
export function motionOff() {
  return typeof document !== "undefined" && document.documentElement.getAttribute("data-motion") === "off";
}

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
 * @param {string}   [media] optional media query; the system is mounted only while it matches
 *                           and is built / destroyed as the viewport crosses it.
 */
export function useMotionSystem(System, opts = {}, deps = [], media = null) {
  const nodes = useRef({});
  const inst = useRef(null);

  // One stable ref-factory per mount. Ref callbacks are cached per key so their identity never
  // changes between renders (React would otherwise detach and re-attach them each time).
  const [bind] = useState(() => {
    const cache = new Map();
    const b = (key) => {
      let fn = cache.get(key);
      if (!fn) {
        fn = (el) => {
          if (el) nodes.current[key] = el;
          else delete nodes.current[key];
        };
        cache.set(key, fn);
      }
      return fn;
    };
    // Handler factory for methods the system exposes to markup (e.g. PlatformSequence.phJump):
    //   <button data-act="1" onClick={bind.handler("phJump")}>
    b.handler = (method) => (e) => inst.current?.[method]?.(e);
    return b;
  });

  useEffect(() => {
    // `?motion=off` (set on <html> by an inline script in app/layout.tsx) freezes the page for
    // visual QA: no system mounts, so every element keeps its server-rendered resting state.
    if (motionOff()) return;

    let system = null;
    const mount = () => {
      if (system) return;
      // opts are read once, here, with the element map: systems are built once per mount.
      const s = new System(nodes.current, opts);
      system = s;
      inst.current = s;
      // start() may reject if WebGL or three is unavailable; that is a supported outcome.
      // Deferred a microtask; if Strict Mode (or the media gate) destroyed this instance in the
      // meantime, never start it.
      Promise.resolve()
        .then(() => (system === s ? s.start() : undefined))
        .catch((err) => {
          if (process.env.NODE_ENV !== "production") console.warn(`[motion] ${System.name} did not start:`, err);
        });
    };
    const unmount = () => {
      if (!system) return;
      system.destroy();
      if (inst.current === system) inst.current = null;
      system = null;
    };

    // Optional media gate: mount only while the query matches, and follow it across resizes
    // (e.g. PlatformSequence and HeroArt are desktop-only below 768px).
    const mq = media && typeof window !== "undefined" && window.matchMedia ? window.matchMedia(media) : null;
    const sync = () => (!mq || mq.matches ? mount() : unmount());
    sync();
    if (mq) mq.addEventListener("change", sync);
    return () => {
      if (mq) mq.removeEventListener("change", sync);
      unmount();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return bind;
}
