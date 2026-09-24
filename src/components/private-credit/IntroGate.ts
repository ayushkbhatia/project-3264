// The Private Credit intro's first-paint gate: plain constants, inlined by the page.
//
// In the prototype the overlay and the page rendered together, client-side. In Next the
// server HTML paints first and the overlay would only appear once the motion module starts,
// so a visitor would see the page and then watch it be covered. This script runs before the
// page paints (from <head>, on this route only), decides whether the intro will play, and marks <html data-pc-intro="pending">;
// globals.css then shows the (server-rendered, display:none) overlay from the first frame.
// The motion root moves the attribute to "run" once the module has started, which hands the
// element back to the module's own inline display and teardown.
//
// States of <html data-pc-intro>: pending (covering, set here) → run (the module owns the
// overlay) → done (unmounted); or pending → released (timed out; the intro is skipped).
//
// Unlike Home's intro this one plays on every load of the page (spec 08: no "seen" flag unless
// product asks for one).
//
// SAFETY: if the module has not started within the grace period (slow network, hydration
// error, failed chunk) the cover lets go — "released" — and the root then starts the module
// with the intro off, so it can never appear late over a page the visitor is already reading.

export const PC_INTRO_ATTR = "data-pc-intro";
export const PC_INTRO_GRACE_MS = 1500;
/** The route this gate serves; app/layout.tsx inlines the script on every page. */
export const PC_INTRO_PATH = "/industries/private-credit";

function gate(attr: string, graceMs: number, path: string) {
  const d = document.documentElement;
  if (
    location.pathname.replace(/\/$/, "") !== path ||
    /[?&](intro|motion)=off(&|$)/.test(location.search) ||
    document.visibilityState === "hidden" ||
    !window.matchMedia ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;
  d.setAttribute(attr, "pending");
  const release = () => {
    removeEventListener("error", onError, true);
    if (d.getAttribute(attr) === "pending") d.setAttribute(attr, "released");
  };
  const onError = (e: Event) => {
    const t = e.target as HTMLScriptElement | null;
    if (t && t.tagName === "SCRIPT" && /\/_next\//.test(t.src || "")) release();
  };
  addEventListener("error", onError, true);
  setTimeout(release, graceMs);
}

// Inlined into <head> by app/layout.tsx (a <script> rendered by a page would run on a hard
// load but not on a client-side visit, where React refuses to execute it).
export const PC_INTRO_GATE_SCRIPT = `(${gate.toString()})(${JSON.stringify(PC_INTRO_ATTR)},${PC_INTRO_GRACE_MS},${JSON.stringify(PC_INTRO_PATH)})`;
