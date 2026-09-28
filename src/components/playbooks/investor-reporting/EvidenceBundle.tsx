import { Figure, Sheet } from "@/components/playbooks/article/figure";
import { tileImages } from "@/components/playbooks/media";

// F5 (§04): what is kept for one Investor Reporting run, as a file tree: the tree glyphs
// (faint, spacing kept), each name in a 140px column, a note, and the file size where there is
// one; a note wraps under its name when the column is narrow. Sizes, hashes and prompt names
// are made up, and the model id is a placeholder.

type Entry = { tree: string; name: string; note?: string; size?: string };

const TREE: Entry[] = [
  { tree: "├─", name: "run_manifest.json", size: "2.3 KB" },
  { tree: "├─", name: "inputs/" },
  { tree: "│  ├─", name: "CF-2026Q2.xlsx", note: "sha256 4b7e…91a0", size: "3.2 MB" },
  { tree: "│  └─", name: "FAC-STMT-Q2-26.xlsx", note: "sha256 c02d…5f18", size: "0.4 MB" },
  { tree: "├─", name: "prompts/", note: "letter_draft@v9 · ddq_match@v4" },
  { tree: "├─", name: "model.txt", note: "frontier-model-a@2026-07-snapshot (placeholder id)" },
  { tree: "├─", name: "drafts/", note: "v1 to v4, with the IR lead's edits" },
  { tree: "├─", name: "engine/", note: "number_binder@1.3.0 · trace.json" },
  { tree: "├─", name: "bindings.json", note: "4 of 4 figures bound · 0 unbound" },
  { tree: "├─", name: "approvals.json", note: "controller · CFO · CCO · release, each timestamped" },
  { tree: "└─", name: "released/", note: "letter v4 · distribution list" },
];

export function EvidenceBundle() {
  return (
    <Figure
      image={tileImages["research-intake"]}
      veil={0.74}
      className="mt-8"
      label="Evidence bundle · one run"
      caption="The record kept for one Investor Reporting run. Fictional data; the model id is a placeholder."
    >
      <Sheet>
        <div className="font-mono text-[11px] leading-[1.7] text-ink [overflow-wrap:anywhere]">
          snap_2026Q2_07 · investor_reporting · Larkspur Credit Opportunities Fund II (fictional) · as of 2026-06-30
        </div>
        <div className="mt-2">
          {TREE.map((e) => (
            <div key={e.name} className="flex flex-wrap items-baseline gap-x-3.5 font-mono text-[11px] leading-[1.85]">
              <span aria-hidden="true" className="flex-none whitespace-pre text-faint">
                {e.tree}
              </span>
              <span className="flex-[0_0_140px] text-ink">{e.name}</span>
              <span className="min-w-0 flex-[1_1_180px] text-sec">{e.note}</span>
              {e.size ? <span className="flex-none text-sec">{e.size}</span> : null}
            </div>
          ))}
        </div>
      </Sheet>
    </Figure>
  );
}
