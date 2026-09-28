import type { ReactNode } from "react";
import { Figure, Sheet, SheetTitle, cx, monoLabel } from "@/components/playbooks/article/figure";
import { tileImages } from "@/components/playbooks/media";

// F3 (§03): two rows of a fictional LP's own DDQ spreadsheet. Row 41 is answered from the
// approved library, with the item's version, approver and review date and its one edit shown;
// row 42 has no approved answer, so nothing is drafted and it goes to compliance. The question
// and the answer sit side by side from a 560px main column, stacked below it. The similarity
// score keeps its qualifier: it measures retrieval, not accuracy.

const label = cx(monoLabel, "text-sec");
const meta = "mt-2 font-mono text-[10.5px] leading-[1.65] text-sec";

function Row({ question, qLabel, aLabel, children, first }: { question: string; qLabel: string; aLabel: string; children: ReactNode; first?: boolean }) {
  return (
    <div className={cx("grid grid-cols-[minmax(0,1fr)] @min-[559.5px]:grid-cols-[minmax(0,0.8fr)_minmax(0,1.3fr)]", !first && "border-t border-rule-2")}>
      <div className="min-w-0 px-4 py-3.5">
        <span className={label}>{qLabel}</span>
        <p className="mt-2 mb-0 text-[15px] leading-[1.45] tracking-[-0.01em] text-ink">{question}</p>
      </div>
      {/* below 560px a dashed rule above the answer, from it a solid one beside it */}
      <div className="min-w-0 border-t border-dashed border-rule-2 px-4 py-3.5 @min-[559.5px]:border-t-0 @min-[559.5px]:border-l @min-[559.5px]:border-solid">
        <span className={label}>{aLabel}</span>
        {children}
      </div>
    </div>
  );
}

export function DdqAnswers() {
  return (
    <Figure
      image={tileImages["side-letter-register"]}
      veil={0.72}
      metaRight={false}
      className="mt-8"
      label="Operational due diligence questionnaire · bespoke LP spreadsheet"
      meta="2026-09-10"
      evidence="DDQ-2026-09-10-row41 · library v2026.09 · OPS-114 v7 → 1 field edit (administrator name) → facts unchanged check → pass → CCO · 2026-09-12 09:05 UTC"
      moment="Only approved, in-date answers are used. The one edit is shown. With no approved answer, nothing is drafted."
      caption="Two questions from a fictional LP questionnaire: one answered from the approved library with its version and approver, one routed to compliance."
    >
      <Sheet>
        <SheetTitle>Larkspur Capital (fictional) · answers drafted from the approved library, library v2026.09</SheetTitle>
        <div className="mt-3 overflow-hidden rounded-[10px] border border-rule-2">
          <Row first qLabel="LP question · row 41" question="How do you oversee your fund administrator's NAV?" aLabel="Approved answer used">
            <div className={cx(meta, "[overflow-wrap:anywhere]")}>
              <span className="font-medium text-ink">OPS-114 v7</span> · Administrator oversight · approved 2026-05-02 by Chief
              Compliance Officer · review due 2027-05-02 · similarity 0.88 (retrieval, not accuracy)
            </div>
            <p className="mt-2.5 mb-0 text-[13.5px] leading-[1.6] text-ink">
              Each quarter the fund controller ties the administrator&apos;s NAV pack line by line to our own books before the CFO
              signs. Our administrator, <del className="text-faint-ink">[administrator]</del>{" "}
              <ins className="border-b-[1.5px] border-ink bg-wash px-0.5 no-underline">Northbay Fund Services</ins>, provides its SOC
              1 report annually.
            </p>
          </Row>
          <Row qLabel="LP question · row 42" question="Describe your AI model-risk framework." aLabel="Result">
            <div className={meta}>No approved, in-date library item above threshold · nothing drafted</div>
            <span className="mt-2.5 inline-flex rounded-full border-[1.5px] border-ink px-2.5 py-1 font-mono text-[10.5px] leading-[1.4] text-ink">
              Routed to Compliance · owner: Chief Compliance Officer
            </span>
          </Row>
        </div>
      </Sheet>
    </Figure>
  );
}
