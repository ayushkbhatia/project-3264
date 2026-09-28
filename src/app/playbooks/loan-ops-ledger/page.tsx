import { articleMetadata } from "@/components/playbooks/article/metadata";
import { PlaybookPage } from "@/components/playbooks/article/PlaybookPage";
import { loanOpsLedgerFigures } from "@/components/playbooks/loan-ops-ledger/figures";
import { loanOpsLedger } from "@/content/loan-ops-ledger";

// Loan Ops Ledger, ported from design_handoff_loan_ops_ledger (its prototype, Loan Ops
// Ledger.dc.html, is the source of truth) onto the shared PlaybookPage template, with this
// playbook's content and figures. This folder takes precedence over app/playbooks/[slug].

export const metadata = articleMetadata(loanOpsLedger);

export default function LoanOpsLedgerPage() {
  return <PlaybookPage article={loanOpsLedger} figures={loanOpsLedgerFigures()} />;
}
