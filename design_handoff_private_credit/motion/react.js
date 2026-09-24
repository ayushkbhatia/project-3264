"use client";

// React binding for PrivateCreditMotion. The only React-aware file in motion/.
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

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { PrivateCreditMotion, ELEMENTS } from "./private-credit.js";

export { PrivateCreditMotion, ELEMENTS };

const Ctx = createContext(null);

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
  const latest = useRef(options);
  latest.current = options;
  const cache = useRef({});

  // Stable callback per key, so React never detaches/reattaches a ref on re-render.
  const bind = useCallback((key) => {
    if (process.env.NODE_ENV !== "production" && !ELEMENTS.includes(key)) {
      console.warn(`[motion] "${key}" is not in the PrivateCreditMotion DOM contract`);
    }
    if (!cache.current[key]) {
      cache.current[key] = (el) => {
        if (el) nodes.current[key] = el;
        else delete nodes.current[key];
      };
    }
    return cache.current[key];
  }, []);
  // Methods the module exposes to markup:  onClick={bind.handler("skipIntro")}
  bind.handler = (method) => (e) => inst.current?.[method]?.(e);

  useEffect(() => {
    const system = new PrivateCreditMotion(nodes.current, { ...latest.current, ...qaFlags() });
    inst.current = system;
    try { system.start(); } catch (err) { console.error("[motion] PrivateCreditMotion did not start", err); }
    return () => { system.destroy(); if (inst.current === system) inst.current = null; };
  }, []);

  // Option changes (e.g. accent from a theme switch) update in place. Never rebuild.
  const accent = options.accent, gridTexture = options.gridTexture, motion = options.motion;
  useEffect(() => {
    inst.current?.setOptions({ accent, gridTexture, motion });
  }, [accent, gridTexture, motion]);

  return <Ctx.Provider value={bind}>{children}</Ctx.Provider>;
}

export function useBind() {
  const bind = useContext(Ctx);
  if (!bind) throw new Error("useBind() must be used inside <PrivateCreditMotionRoot>");
  return bind;
}
