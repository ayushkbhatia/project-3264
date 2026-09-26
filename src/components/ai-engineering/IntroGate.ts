// The AI Engineering intro's first-paint gate. Same mechanism as the Private Credit page's
// (components/private-credit/IntroGate.ts, which documents it): an inline <head> script decides
// before the server HTML paints whether the "Deploy log" intro will play and, if so, marks
// <html data-ai-intro="pending">, which shows the server-rendered (display:none) overlay from
// the first frame (globals.css). The page moves the attribute to "run" once its logic has
// started the intro, handing the overlay back to the logic's inline display and teardown.
//
// States: pending → run → done (unmounted), or pending → released (the page did not start
// within the grace period; the intro is then skipped rather than shown late).
//
// Spec 01 left open whether the intro plays on every load or once per session. It plays on
// every load, as the spec's behaviour section says and as the Private Credit intro does.

import { introGateScript } from "@/components/private-credit/IntroGate";

export const AI_INTRO_ATTR = "data-ai-intro";
export const AI_INTRO_GRACE_MS = 1500;
/** The route this gate serves; app/layout.tsx inlines the script on every page. */
export const AI_INTRO_PATH = "/ai-engineering";

export const AI_INTRO_GATE_SCRIPT = introGateScript(AI_INTRO_ATTR, AI_INTRO_GRACE_MS, AI_INTRO_PATH);
