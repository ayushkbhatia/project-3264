"use client";

import type { ReactNode } from "react";
import { PA_INTRO_ATTR } from "@/components/industry/IntroGate";
import { IndustryMotion } from "@/components/industry/Motion";
import { page } from "@/content/production-assurance";
import { windows } from "./windows";

// The service page on the industry pages' shared components, with its own words and data
// (content/production-assurance.ts) and premise windows (windows.tsx). A client module: the data
// carries the logic's formatters and the windows are markup, neither of which a server route can
// hand across; the route passes the server-rendered chrome.
export function ProductionAssurance(props: { header: ReactNode; closing: ReactNode; footer: ReactNode }) {
  return <IndustryMotion data={page} windows={windows} introAttr={PA_INTRO_ATTR} {...props} />;
}
