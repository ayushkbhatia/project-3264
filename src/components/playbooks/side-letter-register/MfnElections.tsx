import { Fragment } from "react";
import { tileImages } from "@/components/playbooks/media";
import { Figure, Sheet, SheetTitle, cx, monoLabel } from "@/components/playbooks/article/figure";

// F2 (§03): the MFN round after the Final Closing. The compendium goes out anonymised, each
// provision once with the commitment of the LP that negotiated it; the register keeps who holds
// what, and every election cell carries the rule behind it: the tier test (originating
// commitment ≤ electing LP's) or the carve-out table. One election is recorded: Calder takes
// Northfield's fee discount (40m ≤ 60m). Counsel confirms each determination. All data fictional.
//
// Layout by main-column width, at the reference's thresholds (Math.round(width) >= N, so each
// query sits half a pixel below N): the compendium is a four-column table from 560px, and stacks
// with an inline "Originating ·" label below it; the election grid is a grid from 520px, and one
// card per LP below it.
//
// Text the design sets in its faint grey (#8A887F: the internal register ids, "own provision",
// "carve-out" and the carve-out rows' labels) takes --faint-ink, the nearest shade that passes
// AA (the grey reads about 3.5:1 on the sheet); the elected cell's green text takes --ok-ink on
// its green tint (4.69:1, where the design's green reads 4.28:1).

type Provision = {
  item: string;
  /** The internal register id: kept in the register, not circulated. */
  ref: string;
  provision: string;
  originating: string;
  electable: string;
  /** Excluded from MFN: set in grey, hatched in the grid. */
  carveOut?: boolean;
};

const COMPENDIUM: Provision[] = [
  { item: "C-01", ref: "SL-NUE-2.3", provision: "Management fee discount of 15 bps from 1 Jan 2027", originating: "40,000,000", electable: "Yes, by tier" },
  { item: "C-02", ref: "SL-CCRS-4.1", provision: "Quarterly ESG data within 60 days of quarter end", originating: "60,000,000", electable: "Yes, by tier" },
  { item: "C-03", ref: "SL-HF-3.2", provision: "Key-person event notice within 5 Business Days", originating: "15,000,000", electable: "Yes, by tier" },
  {
    item: "C-04",
    ref: "SL-LSH-3.1",
    provision: "Excuse from restricted-sector investments",
    originating: "75,000,000",
    electable: "No · carve-out: excuse right",
    carveOut: true,
  },
  {
    item: "C-05",
    ref: "SL-CCRS-6.2",
    provision: "Public-records disclosure accommodation",
    originating: "60,000,000",
    electable: "No · carve-out: investor-specific regulatory",
    carveOut: true,
  },
  { item: "C-06", ref: "SL-LSH-7.1", provision: "LPAC seat", originating: "75,000,000", electable: "No · carve-out: LPAC seat", carveOut: true },
];

/** The four MFN-entitled LPs (Lanvik, LP-02, holds no MFN right). */
const LPS = [
  { name: "Calder County RS", id: "LP-01 · 60,000,000" },
  { name: "Northfield Univ. End.", id: "LP-03 · 40,000,000" },
  { name: "Tamsin Mutual", id: "LP-04 · 25,000,000" },
  { name: "Harlow Foundation", id: "LP-05 · 15,000,000" },
];

type Cell =
  | { kind: "elected"; rule: string }
  /** A determination and the tier test behind it. */
  | { kind: "tier"; text: string; rule: string }
  /** The LP negotiated this provision itself. */
  | { kind: "own" }
  | { kind: "carve" };

const own: Cell = { kind: "own" };
const carve: Cell = { kind: "carve" };
const tier = (text: string, rule: string): Cell => ({ kind: "tier", text, rule });

/** GRID[provision][LP], in COMPENDIUM and LPS order. */
const GRID: Cell[][] = [
  [{ kind: "elected", rule: "40m ≤ 60m" }, own, tier("Ineligible · tier", "40m > 25m"), tier("Ineligible · tier", "40m > 15m")],
  [own, tier("Ineligible · tier", "60m > 40m"), tier("Ineligible · tier", "60m > 25m"), tier("Ineligible · tier", "60m > 15m")],
  [tier("Eligible · not elected", "15m ≤ 60m"), tier("Eligible · not elected", "15m ≤ 40m"), tier("Eligible · not elected", "15m ≤ 25m"), own],
  [carve, carve, carve, carve],
  [own, carve, carve, carve],
  [carve, carve, carve, carve],
];

const HATCH = "rounded-[4px] bg-[repeating-linear-gradient(135deg,transparent_0_6px,#E8E5DF_6px_7px)]";

/** One election cell: centred in the grid, left-aligned on the cards. */
function ElectionCell({ cell, align, role }: { cell: Cell; align: "text-center" | "text-left"; role?: "cell" }) {
  switch (cell.kind) {
    case "elected":
      return (
        <div role={role} className={cx("box-border rounded-[6px] border-[1.5px] border-ok bg-ok-bg p-1.5", align)}>
          <div className="text-[12px] font-medium text-ok-ink">✓ Elected</div>
          <div className="mt-0.5 font-mono text-[10px] text-ok-ink">{cell.rule}</div>
        </div>
      );
    case "tier":
      return (
        <div role={role} className={cx("p-1.5", align)}>
          <div className="text-[11.5px] leading-[1.35] text-ink">{cell.text}</div>
          <div className="mt-0.5 font-mono text-[10px] text-mut">{cell.rule}</div>
        </div>
      );
    case "own":
      return (
        <div role={role} className={cx("p-1.5 text-[11.5px] text-faint-ink", align)}>
          own provision
        </div>
      );
    case "carve":
      return (
        <div role={role} className={cx("p-1.5 text-[11.5px] text-faint-ink", HATCH, align)}>
          carve-out
        </div>
      );
  }
}

/** A provision's row label, mono 11px: ink, or grey for the carve-outs. */
const itemLabel = (p: Provision) => cx("font-mono text-[11px]", p.carveOut ? "text-faint-ink" : "text-ink");

/** Four columns from a 560px main column. */
const CM = "grid-cols-[minmax(0,1fr)] @min-[559.5px]:grid-cols-[minmax(0,0.62fr)_minmax(0,1.6fr)_minmax(0,0.9fr)_minmax(0,1.05fr)]";
/** The election grid's tracks: the provision, then the four LPs. */
const EG = "grid-cols-[40px_repeat(4,minmax(0,1fr))]";

export function MfnElections() {
  return (
    <Figure
      image={tileImages["capital-call-flow"]}
      veil={0.74}
      metaRight={false}
      className="mt-8"
      label="Aldercove Growth Fund III, L.P. · MFN round after Final Closing (2026-02-13)"
      meta={
        <>
          compendium v2 circulated 2026-03-02
          <br />
          election window closes 2026-04-01 (30 days)
          <br />
          tier rule: originating ≤ electing commitment
        </>
      }
      evidence="Compendium v2 · C-01 (SL-NUE-2.3 §2.3) → Calder election form signed 2026-03-24 → tier 40,000,000 ≤ 60,000,000; not a carve-out → ELECTED · effective 2027-01-01 → counsel confirmed; GP acknowledgement sent 2026-03-27"
      note="Sample assumption: this fund's MFN clause makes fee discounts electable by tier. Law-firm guidance lists fee discounts among common carve-outs."
      caption="The compendium goes out anonymised; the register keeps who holds what. Each cell shows the rule behind it, and counsel confirms each decision."
    >
      <Sheet>
        <SheetTitle>Six provisions, four MFN-entitled LPs, one election recorded</SheetTitle>

        {/* Part 1: the compendium as circulated */}
        <div className="mt-4 mb-2">
          <span id="slr-compendium" className={cx(monoLabel, "text-sec")}>
            Compendium as circulated · investor anonymised
          </span>
        </div>
        <div role="table" aria-labelledby="slr-compendium">
          <div role="row" className={cx("hidden @min-[559.5px]:grid", CM, "gap-x-3 border-b border-ink px-2 pb-[7px] text-[10.5px] text-sec")}>
            <span role="columnheader">Item</span>
            <span role="columnheader">Provision</span>
            <span role="columnheader" className="text-right">
              Originating commitment
            </span>
            <span role="columnheader">Electable</span>
          </div>
          {COMPENDIUM.map((p, i) => {
            const tone = p.carveOut ? "text-mut" : "text-ink";
            return (
              <div
                key={p.item}
                role="row"
                className={cx("grid", CM, "items-baseline gap-x-3 gap-y-[3px] px-2 py-[9px]", i < COMPENDIUM.length - 1 && "border-b border-rule-2")}
              >
                <span role="rowheader" className="min-w-0">
                  <span className={cx("mr-2 inline-block font-mono text-[11.5px]", tone)}>{p.item}</span>
                  <span className="inline-block font-mono text-[10px] text-faint-ink">{p.ref}</span>
                </span>
                <span role="cell" className={cx("min-w-0 text-[12.5px] leading-[1.45]", tone)}>
                  {p.provision}
                </span>
                <span role="cell" className={cx("min-w-0 text-left font-mono text-[11.5px] @min-[559.5px]:text-right", tone)}>
                  <span className="font-sans text-[11px] text-mut @min-[559.5px]:hidden">Originating · </span>
                  {p.originating}
                </span>
                <span role="cell" className={cx("min-w-0 text-[12px] leading-[1.4]", tone)}>
                  {p.electable}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-2 font-mono text-[10px] leading-[1.55] text-mut">grey ref = internal register id, not circulated</div>

        {/* Part 2: the election grid, in the register, identities kept */}
        <div className="mt-[22px] mb-2">
          <span id="slr-elections" className={cx(monoLabel, "text-sec")}>
            Election grid · register view · identities kept
          </span>
        </div>

        {/* from a 520px column: provisions down, LPs across */}
        <div role="table" aria-labelledby="slr-elections" className="hidden @min-[519.5px]:block">
          <div role="row" className={cx("grid", EG, "gap-x-1.5 border-b border-ink pb-2")}>
            <span role="cell" />
            {LPS.map((lp) => (
              <span key={lp.id} role="columnheader" className="min-w-0 text-center">
                <span className="block text-[11.5px] leading-[1.3] font-medium">{lp.name}</span>
                <span className="mt-0.5 block font-mono text-[9.5px] text-mut">{lp.id}</span>
              </span>
            ))}
          </div>
          {COMPENDIUM.map((p, i) => (
            <div
              key={p.item}
              role="row"
              className={cx("grid", EG, "items-center gap-1.5 py-[5px]", i < COMPENDIUM.length - 1 && "border-b border-rule-2")}
            >
              <span role="rowheader" className={itemLabel(p)}>
                {p.item}
              </span>
              {GRID[i].map((cell, j) => (
                <ElectionCell key={LPS[j].id} role="cell" cell={cell} align="text-center" />
              ))}
            </div>
          ))}
        </div>

        {/* below it: one card per LP */}
        <div className="grid gap-2.5 @min-[519.5px]:hidden">
          {LPS.map((lp, j) => (
            <div key={lp.id} className="rounded-[10px] border border-rule-2 px-3 py-2.5">
              <div className="text-[12.5px] font-medium">{lp.name}</div>
              <div className="font-mono text-[10px] text-mut">{lp.id}</div>
              <dl className="mt-2 mb-0 grid grid-cols-[40px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                {COMPENDIUM.map((p, i) => (
                  <Fragment key={p.item}>
                    <dt className={itemLabel(p)}>{p.item}</dt>
                    <dd className="m-0">
                      <ElectionCell cell={GRID[i][j]} align="text-left" />
                    </dd>
                  </Fragment>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <div className="mt-2 font-mono text-[10px] leading-[1.55] text-mut">
          cells computed by the tier rule and carve-out table · counsel confirms each determination
        </div>
        <p className="mt-3.5 mb-0 text-[14.5px] leading-[1.5] text-ink">
          Calder&apos;s election of C-01 is recorded with the tier check that allowed it. Counsel confirmed eligibility; the discount starts
          with the Q1 2027 fee.
        </p>
      </Sheet>
    </Figure>
  );
}
