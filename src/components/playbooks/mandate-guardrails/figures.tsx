import type { ReactNode } from "react";
import { EngagementRuns } from "@/components/playbooks/article/figures/EngagementRuns";
import { EvidenceBreakdown } from "@/components/playbooks/article/figures/EvidenceBreakdown";
import { HarnessAnatomy } from "@/components/playbooks/article/figures/HarnessAnatomy";
import { PassK } from "@/components/playbooks/article/figures/PassK";
import { featureImages, tileImages } from "@/components/playbooks/media";
import { Blueprint } from "./Blueprint";
import { CheckSequence } from "./CheckSequence";
import { ClauseToRule } from "./ClauseToRule";
import { Denominators } from "./Denominators";

/**
 * Mandate Guardrails' eight figures, by the slot names its content uses
 * (content/mandate-guardrails.ts). F3, F5, F6 and F8 are house figures the playbook pages share;
 * this page sets their text, washes, veils and spacing. `animateHero` false shows F1 in its
 * final state. The page has no review-routing, evidence-bundle or injection figure.
 */
export function mandateGuardrailsFigures({ animateHero = true }: { animateHero?: boolean } = {}): Record<string, ReactNode> {
  return {
    clauseToRule: <ClauseToRule animate={animateHero} />, // F1
    checkSequence: <CheckSequence />, // F2
    evidenceLine: (
      <EvidenceBreakdown
        image={featureImages["mandate-guardrails"]}
        veil={0.76}
        className="mt-7"
        meta="Quillmere Global Credit Mandate · fictional"
        metaRight={false}
        parts={[
          { label: "Source", sep: "", value: "IMA-QGCM-2025 amdt 1" },
          { label: "Clause", sep: " · ", value: "Sch.2 §4.2(c) p.14" },
          { label: "Value", sep: " → ", value: "Brackwell Utilities group 4.62%" },
          { label: "Rule", sep: " → ", value: "MG-0412 v3 ≤ 5.00%" },
          { label: "Run", sep: " · ", value: "batch R-2026-09-27-0412" },
          { label: "Result", sep: " → ", value: "PASS · headroom 0.38 pp" },
          { label: "Approver", sep: " → approved: ", value: "head of investment compliance" },
          { label: "Timestamp", sep: " · ", value: "2026-09-14 10:22" },
        ].map((p) => ({ ...p, tall: true, wrap: true }))}
        caption="The batch result from the hero card, split into its parts. Fictional data."
      />
    ), // F3
    blueprint: <Blueprint />, // F4
    anatomy: (
      <HarnessAnatomy
        image={featureImages["side-letter-register"]}
        veil={0.64}
        className="mt-8"
        caption="The harness is everything around the model. In this playbook the model sits at encoding time only."
      />
    ), // F5
    passk: (
      <PassK
        image={featureImages["nav-pack-review"]}
        veil={0.66}
        className="mt-8"
        caption="Illustrative maths, not measured performance. At a 95% per-run success rate, all of ten runs agree only 60% of the time, which is why no model sits between an order and its result."
      />
    ), // F6
    denominators: <Denominators />, // F7
    engagement: <EngagementRuns image={tileImages["capital-call-flow"]} veil={0.62} className="mt-10" />, // F8
  };
}
