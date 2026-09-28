import { Fragment, type ReactNode } from "react";
import { tileImages } from "@/components/playbooks/media";
import { Figure, Sheet, SheetTitle, cx, monoLabel } from "@/components/playbooks/article/figure";

// F6 (§05, "Controls and security"): the harness's tools, the tier each sits in, who may call
// it and what must be approved before it takes effect; then what happens when an email asks
// for new wire instructions. The model reads and proposes; engines compute; releasing a notice
// runs under a person's identity; changing bank details is not exposed at all. A table from a
// 600px main column, one labelled block per tool below it. Fictional example.

type Tier = "read" | "engine" | "propose" | "execute" | "not exposed";

type Tool = {
  name: string;
  tier: Tier;
  by: string;
  byNote: string;
  /** null: nothing to approve ("—"). */
  approval: string | null;
};

const TOOLS: Tool[] = [
  {
    name: "docs.read_lpa_side_letters",
    tier: "read",
    by: "Quarantined reader (model)",
    byNote: "no write tools, no network egress; returns typed parameters with clause spans",
    approval: "Fund controller approves the parameter set",
  },
  { name: "bank.read_statement", tier: "read", by: "Workflow code", byNote: "BAI2 or ISO 20022 statement file", approval: null },
  {
    name: "allocation.compute",
    tier: "engine",
    by: "Workflow code only",
    byNote: "decimal arithmetic; the model cannot call it or change its inputs",
    approval: "Controller or CFO signs the allocation trace",
  },
  {
    name: "notice.create_draft",
    tier: "propose",
    by: "Model drafts the letters; code fills every amount",
    byNote: "bank details come from the locked master record",
    approval: null,
  },
  {
    name: "cashmatch.propose",
    tier: "propose",
    by: "Model, for free-text payer references",
    byNote: "exact matches on amount and reference are made by code",
    approval: "Fund accountant confirms each proposal",
  },
  {
    name: "notice.release",
    tier: "execute",
    by: "A person, from the approval screen",
    byNote: "runs under the approver's identity, not the model's",
    approval: "Maker and checker; GP signatory releases",
  },
  {
    name: "ssi.change_bank_details",
    tier: "not exposed",
    by: "A person only, out of band",
    byNote: "no path from a document, email or model output",
    approval: "Call-back to a known number, then a second approver",
  },
];

/** Tier pills: read, engine and propose hairline; execute in ink; not exposed dashed. */
const PILL: Record<Tier, string> = {
  read: "border border-rule text-sec",
  engine: "border border-rule text-sec",
  propose: "border border-rule text-sec",
  execute: "border-[1.5px] border-ink text-ink",
  "not exposed": "border border-dashed border-ink text-sec",
};

/** The request's path: each stage a box, the untrusted one pale, the people in ink. */
const FLOW: Array<{ label: string; text: ReactNode; record?: ReactNode; box: string }> = [
  {
    label: "Untrusted input",
    text: (
      <>
        Email to IR, from a real LP address: <em>“Please use our new account for Call 07.”</em>
      </>
    ),
    box: "border border-rule bg-[#F8F7F4]",
  },
  {
    label: "Quarantined reader",
    text: "Reads it as data. No tools, no egress.",
    record: (
      <>
        intent: bank_detail_change
        <br />
        lp: LP-06 · src: msg 4471 · span l.3–4
      </>
    ),
    box: "border border-dashed border-ink bg-[#F8F7F4]",
  },
  {
    label: "Workflow code",
    text: "Opens a blocked case. The master record is not changed; notices keep the existing instructions.",
    box: "border border-rule bg-[#F8F7F4]",
  },
  {
    label: "Two named people",
    text: "Call-back to the number already on file, then a second approver. Only then is the record changed.",
    box: "border-[1.5px] border-ink bg-white",
  },
];

/** One column; four from a 600px main column. */
const TRACKS =
  "grid-cols-[minmax(0,1fr)] @min-[599.5px]:grid-cols-[minmax(0,1.15fr)_minmax(0,0.62fr)_minmax(0,1.55fr)_minmax(0,1.2fr)]";
/** A cell's lane label, shown only below 600px where the header is hidden. */
const LANE = "mb-0.5 block text-[10.5px] font-medium text-mut @min-[599.5px]:hidden";

export function ToolPermissions() {
  return (
    <Figure
      image={tileImages["mandate-guardrails"]}
      veil={0.66}
      className="mt-8"
      label="Capital Call Flow · harness · tool permissions"
      evidence="msg 4471 · inbound · l.3–4 → bank_detail_change (LP-06) → blocked; call-back task opened → open → treasury lead · 2026-10-13 10:05"
      moment="The model can read a request to change bank details. It has no tool that could make the change."
      caption="Tool names, tiers and approvals for this playbook. Fictional example."
    >
      <Sheet>
        <SheetTitle id="ccf-tools-title">What the model may touch, and what only a person can do</SheetTitle>
        <div role="table" aria-labelledby="ccf-tools-title" className="mt-3">
          <div role="row" className={cx("hidden @min-[599.5px]:grid", TRACKS, "gap-x-3 border-b border-ink pb-2 text-[10.5px] text-sec")}>
            <span role="columnheader">Tool</span>
            <span role="columnheader">Tier</span>
            <span role="columnheader">Called by</span>
            <span role="columnheader">Approval before effect</span>
          </div>
          {TOOLS.map((t) => (
            <div
              key={t.name}
              role="row"
              className={cx("grid", TRACKS, "items-baseline gap-1.5 border-b border-rule-2 py-2.5 @min-[599.5px]:gap-x-3 @min-[599.5px]:gap-y-1")}
            >
              <span role="rowheader" className="font-mono text-[10.5px] [overflow-wrap:anywhere]">
                {t.name}
              </span>
              <span role="cell">
                <span className={cx("inline-block rounded-full px-2 py-px font-mono text-[10px] whitespace-nowrap", PILL[t.tier])}>{t.tier}</span>
              </span>
              <span role="cell" className="min-w-0">
                <span className={LANE}>Called by</span>
                <span className="block text-[12.5px] leading-[1.4]">{t.by}</span>
                <span className="mt-0.5 block text-[11px] leading-[1.45] text-sec">{t.byNote}</span>
              </span>
              <span role="cell" className="min-w-0 text-[12.5px] leading-[1.4]">
                <span className={LANE}>Approval before effect</span>
                {t.approval ?? <span className="text-faint">—</span>}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-[18px]">
          <span className={cx(monoLabel, "text-sec")}>When an email asks for new wire instructions</span>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {FLOW.map((f, i) => (
            <Fragment key={f.label}>
              {i ? (
                <span aria-hidden="true" className="flex-none self-center font-mono text-[12px] text-sec">
                  →
                </span>
              ) : null}
              <div className={cx("box-border min-w-0 flex-[1_1_130px] rounded-[11px] p-3", f.box)}>
                <span className={cx(monoLabel, "text-sec")}>{f.label}</span>
                <div className="mt-2 text-[12.5px] leading-[1.45]">{f.text}</div>
                {f.record ? (
                  <div className="mt-2 font-mono text-[10px] leading-[1.6] text-ink-2 [overflow-wrap:anywhere]">{f.record}</div>
                ) : null}
              </div>
            </Fragment>
          ))}
        </div>
      </Sheet>
    </Figure>
  );
}
