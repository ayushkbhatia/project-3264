// The playbook pages' hero reveal: its first-paint gate. Plain constants (no "use client"):
// app/layout.tsx inlines the script into <head>, globals.css holds the matching style, and
// useHeroReveal (HeroReveal.tsx) reads and moves the same attribute.
//
// WHY THIS EXISTS. The reference renders the hero figure in its final state, then, once 30% of
// it is on screen, resets it and plays a short reveal: a ring round the certificate's figure,
// the two headroom values, then the checklist card rising in. In Next the server HTML paints
// first and hydration comes later, so on a tall screen (where the figure is already in view)
// a visitor would see the final state, watch it vanish, then watch it come back. Instead, a
// script in <head> decides before first paint whether the reveal can play, and marks
// <html data-pb-reveal="pending">; the style then holds the revealed parts at their start
// state from the first frame, until the figure's own state takes over.
//
// States of <html data-pb-reveal>:
//   (absent)  not playing: another route, ?motion=off, reduced motion, no IntersectionObserver.
//             Client-side navigations land here too (or on the last page's state); the hook
//             then sets "pending" itself, in a layout effect, before the new page paints.
//   pending   decided in <head> (or by the hook, on a client-side navigation); the parts marked
//             [data-reveal] are held at their start state
//   run       the figure owns them (its start state is committed; the style lets go)
//   off       the figure declined at start (its animate flag is off)
//   released  hydration did not come within REVEAL_GRACE_MS, or an app script failed to load:
//             the parts show their final state, and the figure keeps it
//
// With JavaScript disabled nothing sets the attribute, so the final state shows.

export const REVEAL_ATTR = "data-pb-reveal";
/** How long the gate may hold the parts for the page's script before it lets go. */
export const REVEAL_GRACE_MS = 3000;

function gate(attr: string, graceMs: number) {
  const d = document.documentElement;
  try {
    if (
      !/^\/playbooks\/[^/]+\/?$/.test(location.pathname) ||
      /[?&]motion=off(&|$)/.test(location.search) ||
      !window.matchMedia ||
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
  } catch {
    return;
  }
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

export const PB_REVEAL_GATE_SCRIPT = `(${gate.toString()})(${JSON.stringify(REVEAL_ATTR)},${REVEAL_GRACE_MS})`;

// Parts are marked in the figure's markup: [data-reveal="ring" | "fade" | "rise" | "dot" | "draw" |
// "wait" | "tint" | "word"] inside a [data-reveal-root="on"] (the figure; "off" when its page
// turns the animation off, so nothing is held). !important: the parts' final state is an inline
// style. Printing shows the final state whatever the reveal is doing.
export const PB_REVEAL_GATE_STYLE =
  `html[${REVEAL_ATTR}=pending] [data-reveal-root=on] [data-reveal=ring]{box-shadow:0 0 0 1.5px rgba(26,25,23,0)!important}` +
  `html[${REVEAL_ATTR}=pending] [data-reveal-root=on] [data-reveal=fade]{opacity:0!important}` +
  `html[${REVEAL_ATTR}=pending] [data-reveal-root=on] [data-reveal=rise]{opacity:0!important;transform:translateY(6px)!important}` +
  // a status dot that turns from red to green as the reveal ends
  `html[${REVEAL_ATTR}=pending] [data-reveal-root=on] [data-reveal=dot]{background:#C4341E!important}` +
  // Investor Reporting: an underline drawn under a figure, and a status dot waiting in grey
  `html[${REVEAL_ATTR}=pending] [data-reveal-root=on] [data-reveal=draw]{background-size:0% 1.5px!important}` +
  `html[${REVEAL_ATTR}=pending] [data-reveal-root=on] [data-reveal=wait]{background:#D9D6CF!important}` +
  // Mandate Guardrails, with those two: a result bar waiting untinted, its status word faint,
  // until it turns green
  `html[${REVEAL_ATTR}=pending] [data-reveal-root=on] [data-reveal=tint]{background:#F1EEE8!important}` +
  `html[${REVEAL_ATTR}=pending] [data-reveal-root=on] [data-reveal=word]{color:#8A887F!important}` +
  `@media print{[data-reveal-root] [data-reveal]{opacity:1!important;transform:none!important}[data-reveal-root] [data-reveal=ring]{box-shadow:0 0 0 1.5px #1A1917!important}[data-reveal-root] [data-reveal=dot],[data-reveal-root] [data-reveal=wait]{background:#157F52!important}[data-reveal-root] [data-reveal=draw]{background-size:100% 1.5px!important}[data-reveal-root] [data-reveal=tint]{background:#E4F0EA!important}[data-reveal-root] [data-reveal=word]{color:#13784E!important}}`;
