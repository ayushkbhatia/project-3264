import { featureImages } from "@/components/playbooks/media";
import { Figure, Sheet } from "@/components/playbooks/article/figure";

// F4 (§04): what is kept for one covenant test run, as a file tree. Fictional; the model id is
// a placeholder. Tree glyphs keep their spacing (white-space: pre); each note wraps under its
// name when the column is narrow.

const TREE: Array<[string, string]> = [
  ["├─ run_manifest.json", "2.1 KB"],
  ["├─ inputs/", ""],
  ["│  ├─ CC-2026Q2-TallisBrook.pdf", "sha256 9f1c…04e2 · 1.8 MB"],
  ["│  └─ CreditAgreement+Amdt2.pdf", "sha256 51ab…c7d0 · 4.6 MB"],
  ["├─ prompts/", "extract_fin@v16 · support_check@v7"],
  ["├─ model.txt", "frontier-model-a@2026-07-snapshot (placeholder id)"],
  ["├─ outputs/raw/", "3 files"],
  ["├─ validators.json", "41 checks · 40 pass · 1 flagged"],
  ["├─ citations.json", "18 spans, each with page and line range"],
  ["├─ engine/", "ratio_engine@2.4.1 · trace.json"],
  ["├─ review.json", "approver: credit analyst · 2026-08-13T10:42:11Z · accepted with one edit"],
  ["└─ retention", "set per client · write-once storage"],
];

export function EvidenceBundle() {
  return (
    <Figure
      image={featureImages["capital-call-flow"]}
      veil={0.72}
      className="mt-7"
      label="Evidence bundle · one run"
      caption="The record kept for one covenant test run. Fictional data; the model id is a placeholder."
    >
      <Sheet>
        <div className="font-mono text-[11px] leading-[1.9] text-ink">
          <div className="pb-1.5 [overflow-wrap:anywhere]">
            run_7Q2KXH4M · covenant_test · Tallis Brook Components (fictional) · test date 2026-06-30
          </div>
          {TREE.map(([name, note]) => (
            <div key={name} className="flex flex-wrap gap-x-3.5">
              <span className="flex-[0_0_230px] whitespace-pre">{name}</span>
              <span className="min-w-0 flex-[1_1_200px] text-sec [overflow-wrap:anywhere]">{note}</span>
            </div>
          ))}
        </div>
      </Sheet>
    </Figure>
  );
}
