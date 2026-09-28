import { articleMetadata } from "@/components/playbooks/article/metadata";
import { PlaybookPage } from "@/components/playbooks/article/PlaybookPage";
import { capitalCallFlowFigures } from "@/components/playbooks/capital-call-flow/figures";
import { capitalCallFlow } from "@/content/capital-call-flow";

// Capital Call Flow, ported from design_handoff_capital_call_flow (its prototype, Capital Call
// Flow.dc.html, is the source of truth) onto the shared PlaybookPage template, with this
// playbook's content and figures. This folder takes precedence over app/playbooks/[slug].

export const metadata = articleMetadata(capitalCallFlow);

export default function CapitalCallFlowPage() {
  return <PlaybookPage article={capitalCallFlow} figures={capitalCallFlowFigures()} />;
}
