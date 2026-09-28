import { articleMetadata } from "@/components/playbooks/article/metadata";
import { PlaybookPage } from "@/components/playbooks/article/PlaybookPage";
import { mandateGuardrailsFigures } from "@/components/playbooks/mandate-guardrails/figures";
import { mandateGuardrails } from "@/content/mandate-guardrails";

// Mandate Guardrails, ported from design_handoff_mandate_guardrails (its prototype, Mandate
// Guardrails.dc.html, is the source of truth) onto the shared PlaybookPage template, with this
// playbook's content and figures. This folder takes precedence over app/playbooks/[slug].

export const metadata = articleMetadata(mandateGuardrails);

export default function MandateGuardrailsPage() {
  return <PlaybookPage article={mandateGuardrails} figures={mandateGuardrailsFigures()} />;
}
