"use client";

import type { ReactNode } from "react";
import { FS_INTRO_ATTR } from "@/components/industry/IntroGate";
import { IndustryMotion } from "@/components/industry/Motion";
import { page } from "@/content/financial-services";
import { windows } from "./windows";

// The page on the shared industry components, with its own words and data
// (content/financial-services.ts) and premise windows (windows.tsx). A client module: the data
// carries the logic's formatters and the windows are markup, neither of which a server route can
// hand across; the route passes the server-rendered chrome.
export function FinancialServices(props: { header: ReactNode; closing: ReactNode; footer: ReactNode }) {
  return <IndustryMotion data={page} windows={windows} introAttr={FS_INTRO_ATTR} {...props} />;
}
