import type { ReactNode } from "react";
import { EngagementRuns } from "@/components/playbooks/article/figures/EngagementRuns";
import { HarnessAnatomy } from "@/components/playbooks/article/figures/HarnessAnatomy";
import { PassK } from "@/components/playbooks/article/figures/PassK";
import { featureImages, tileImages } from "@/components/playbooks/media";
import { CureEligibility } from "./CureEligibility";
import { DefinitionTrace } from "./DefinitionTrace";
import { EvidenceBundle } from "./EvidenceBundle";
import { EvidenceLine } from "./EvidenceLine";
import { Injection } from "./Injection";
import { Recompute } from "./Recompute";
import { ReviewRouting } from "./ReviewRouting";

/**
 * Covenant Watch's ten figures, by the slot names its content uses (content/covenant-watch.ts).
 * F6, F8 and F9 are the house figures every playbook's "How it is built" shares; this page
 * sets their washes, veils and spacing. `animateHero` false shows F1 in its final state.
 */
export function covenantWatchFigures({ animateHero = true }: { animateHero?: boolean } = {}): Record<string, ReactNode> {
  return {
    recompute: <Recompute animate={animateHero} />, // F1
    cure: <CureEligibility />, // F2
    evidenceLine: <EvidenceLine />, // F3
    bundle: <EvidenceBundle />, // F4
    trace: <DefinitionTrace />, // F5
    anatomy: <HarnessAnatomy image={featureImages["side-letter-register"]} veil={0.64} className="mt-8" />, // F6
    routing: <ReviewRouting />, // F7
    passk: <PassK image={featureImages["nav-pack-review"]} veil={0.66} className="mt-8" />, // F8
    engagement: <EngagementRuns image={tileImages["capital-call-flow"]} veil={0.62} className="mt-10" />, // F9
    injection: <Injection />, // F10
  };
}
