// The intro's first-paint gate. Plain constants (no "use client"): app/layout.tsx inlines the
// script and style into <head>, and Intro.tsx reads the same attribute and storage key.
//
// WHY THIS EXISTS. In the prototype the page and the overlay rendered together, client-side.
// In Next the server HTML paints first and the overlay could only appear after hydration, so a
// visitor would see the page, then watch it get covered. Instead, a script in <head> decides
// before first paint whether the intro will play and marks <html data-intro="pending">; the
// style below then shows the (server-rendered, display:none) overlay from the very first frame.
// IntroRelief takes the same element over when it starts, and Intro.tsx moves the attribute on
// to "run" (or "off") in the same task, so no frame is ever painted without a cover or an owner.
//
// States of <html data-intro>:
//   (absent)  not playing: another route, ?motion=off, reduced motion, hidden tab, already
//             played this session, or storage unavailable
//   pending   decided in <head>; the style below covers the page until the module starts
//   run       IntroRelief owns the overlay (its own teardown hides it)
//   off       the module declined at start (e.g. the reduced-motion setting changed)
//   released  the module did not start within INTRO_GRACE_MS (slow network, hydration error), or
//             an app script failed to load: the cover lets go of the page and the session counts
//             as played, so it cannot come back later
//
// With JavaScript disabled nothing sets the attribute, so the overlay stays display:none.

export const INTRO_ATTR = "data-intro";
export const INTRO_PLAYED_KEY = "3264:intro-played";
/** How long the first-paint cover may wait for IntroRelief before it lets go of the page. */
export const INTRO_GRACE_MS = 1500;

function gate(attr: string, key: string, graceMs: number) {
  const d = document.documentElement;
  try {
    if (
      location.pathname !== "/" ||
      /[?&]motion=off(&|$)/.test(location.search) ||
      document.visibilityState === "hidden" || // background tab: nobody would see it
      !window.matchMedia ||
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      sessionStorage.getItem(key)
    )
      return;
  } catch {
    return; // storage blocked: cannot keep it to once per session, so do not play
  }
  d.setAttribute(attr, "pending");
  const release = () => {
    removeEventListener("error", onError, true);
    if (d.getAttribute(attr) !== "pending") return;
    d.setAttribute(attr, "released");
    try {
      sessionStorage.setItem(key, "1");
    } catch {}
  };
  // An app chunk that fails to load means the intro will never start: let go at once rather
  // than holding a blank cover for the whole grace period.
  const onError = (e: Event) => {
    const t = e.target as HTMLScriptElement | null;
    if (t && t.tagName === "SCRIPT" && /\/_next\//.test(t.src || "")) release();
  };
  addEventListener("error", onError, true);
  setTimeout(release, graceMs);
}

// Serialised from the function above so the inline copy cannot drift from the typed source.
// (Only ES2017 syntax is used, which every browser this site supports parses.)
export const INTRO_GATE_SCRIPT = `(${gate.toString()})(${JSON.stringify(INTRO_ATTR)},${JSON.stringify(INTRO_PLAYED_KEY)},${INTRO_GRACE_MS})`;

// `!important` because the overlay's server-rendered `display:none` is an inline style (the
// module drives display inline). Position and colour are repeated so the cover holds even before
// the main stylesheet has applied. The caption stays hidden until the module owns the overlay: in
// the reference the "1" appears together with the intro, and a cover that is released without
// playing then reads as nothing more than the page background before its content paints.
export const INTRO_GATE_STYLE = `html[${INTRO_ATTR}=pending] [data-intro-wrap]{display:flex!important;position:fixed;inset:0;z-index:300;background:#F6F5F2}html[${INTRO_ATTR}=pending] [data-intro-cap]{visibility:hidden}`;
