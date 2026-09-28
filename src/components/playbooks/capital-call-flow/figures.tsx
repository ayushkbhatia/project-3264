import type { ReactNode } from "react";
import { EngagementRuns } from "@/components/playbooks/article/figures/EngagementRuns";
import { EvidenceBreakdown } from "@/components/playbooks/article/figures/EvidenceBreakdown";
import { HarnessAnatomy } from "@/components/playbooks/article/figures/HarnessAnatomy";
import { featureImages, tileImages } from "@/components/playbooks/media";
import { CallSplit } from "./CallSplit";
import { ToolPermissions } from "./ToolPermissions";
import { WireMatch } from "./WireMatch";

/**
 * Capital Call Flow's six figures, by the slot names its content uses
 * (content/capital-call-flow.ts). F3, F4 and F5 are house figures the playbook pages share; this
 * page sets their text, washes, veils and spacing. `animateHero` false shows F1 in its final
 * state.
 */
export function capitalCallFlowFigures({ animateHero = true }: { animateHero?: boolean } = {}): Record<string, ReactNode> {
  return {
    callSplit: <CallSplit animate={animateHero} />, // F1
    wireMatch: <WireMatch />, // F2
    evidenceLine: (
      <EvidenceBreakdown
        image={tileImages["covenant-watch"]}
        veil={0.76}
        className="mt-7"
        meta="Aldercove Growth Fund III · fictional"
        metaRight={false}
        parts={[
          { label: "Source", sep: "", value: "call07_alloc" },
          { label: "Version", sep: " ", value: "v1" },
          { label: "Locator", sep: " · ", value: "LPA s.6.2.4.1 + SL §3.1 · Northfield" },
          { label: "Value", sep: " → ", value: "4,906,666.67" },
          { label: "Test", sep: " → ", value: "recompute = engine; Σ lines = 18,984,375.00" },
          { label: "Status", sep: " → ", value: "tied" },
          { label: "Approver", sep: " → ", value: "fund controller" },
          { label: "Timestamp", sep: " · ", value: "2026-09-29 16:42 ET" },
        ].map((p) => ({ ...p, tall: true, wrap: true }))}
        caption="One investor line's evidence, split into its parts. Fictional data."
      />
    ), // F3
    anatomy: <HarnessAnatomy image={featureImages["side-letter-register"]} veil={0.64} className="mt-8" />, // F4
    engagement: <EngagementRuns image={tileImages["capital-call-flow"]} veil={0.62} className="mt-10" />, // F5
    permissions: <ToolPermissions />, // F6
  };
}
