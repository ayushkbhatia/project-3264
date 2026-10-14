// The Private Equity intro's first-paint gate. Same mechanism as the Private Credit and AI
// Engineering pages' (components/private-credit/IntroGate.ts documents it): an inline <head>
// script decides before the server HTML paints whether the "Portfolio log" intro will play and,
// if so, marks <html data-pe-intro="pending">, which shows the server-rendered (display:none)
// overlay from the first frame (globals.css). The page moves the attribute to "run" once its
// logic has started the intro, handing the overlay back to the logic's inline display and
// teardown.
//
// States: pending → run → done (unmounted), or pending → released (the page did not start
// within the grace period; the intro is then skipped rather than shown late).
//
// The handoff suggests once per session ("Prototype-only props: playIntro"); like the other
// industry and service pages it plays on every load until product decides otherwise.

import { introGateScript } from "@/components/private-credit/IntroGate";

export const PE_INTRO_ATTR = "data-pe-intro";
export const PE_INTRO_GRACE_MS = 1500;
/** The route this gate serves; app/layout.tsx inlines the script on every page. */
export const PE_INTRO_PATH = "/industries/private-equity";

export const PE_INTRO_GATE_SCRIPT = introGateScript(PE_INTRO_ATTR, PE_INTRO_GRACE_MS, PE_INTRO_PATH);
