import { articleMetadata } from "@/components/playbooks/article/metadata";
import { PlaybookPage } from "@/components/playbooks/article/PlaybookPage";
import { investorReportingFigures } from "@/components/playbooks/investor-reporting/figures";
import { investorReporting } from "@/content/investor-reporting";

// Investor Reporting, ported from design_handoff_investor_reporting (its prototype, Investor
// Reporting.dc.html, is the source of truth) onto the shared PlaybookPage template, with this
// playbook's content and figures. This folder takes precedence over app/playbooks/[slug].

export const metadata = articleMetadata(investorReporting);

export default function InvestorReportingPage() {
  return <PlaybookPage article={investorReporting} figures={investorReportingFigures()} />;
}
