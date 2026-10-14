// The industry pages' (and Production Assurance's) intro first-paint gates. Same mechanism as the Private Credit and AI
// Engineering pages' (components/private-credit/IntroGate.ts documents it): an inline <head>
// script decides before the server HTML paints whether the build-log intro will play and, if so,
// marks <html data-…-intro="pending">, which shows the server-rendered (display:none) overlay,
// [data-ind-intro-wrap], from the first frame (globals.css). The page moves the attribute to
// "run" once its logic has started the intro, handing the overlay back to the logic's inline
// display and teardown.
//
// States: pending → run → done (unmounted), or pending → released (the page did not start
// within the grace period; the intro is then skipped rather than shown late).
//
// One attribute per page, each gate serving its own route. The handoffs suggest once per
// session ("playIntro"); like the other industry and service pages they play on every load
// until product decides otherwise.

import { introGateScript } from "@/components/private-credit/IntroGate";
import { routes } from "@/content/home";

const GRACE_MS = 1500;

export const PE_INTRO_ATTR = "data-pe-intro";
export const FS_INTRO_ATTR = "data-fs-intro";
export const FM_INTRO_ATTR = "data-fm-intro";
export const AM_INTRO_ATTR = "data-am-intro";
export const PA_INTRO_ATTR = "data-pa-intro";

/** Inlined by app/layout.tsx (each runs on every page and acts on its route only). */
export const PE_INTRO_GATE_SCRIPT = introGateScript(PE_INTRO_ATTR, GRACE_MS, routes.privateEquity);
export const FS_INTRO_GATE_SCRIPT = introGateScript(FS_INTRO_ATTR, GRACE_MS, routes.financialServices);
export const FM_INTRO_GATE_SCRIPT = introGateScript(FM_INTRO_ATTR, GRACE_MS, routes.fundManagement);
export const AM_INTRO_GATE_SCRIPT = introGateScript(AM_INTRO_ATTR, GRACE_MS, routes.assetManagement);
export const PA_INTRO_GATE_SCRIPT = introGateScript(PA_INTRO_ATTR, GRACE_MS, routes.productionAssurance);
