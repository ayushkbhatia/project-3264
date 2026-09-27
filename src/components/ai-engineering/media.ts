// Media queries the AI Engineering page reads in script. NARROW must match the breakpoint of
// the interim narrow layout in globals.css ([data-ai] rules).

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** Below 900px: spec 08's interim rule (pinned sections unpinned, no 03 hold). */
export const NARROW = "(max-width: 899.98px)";
