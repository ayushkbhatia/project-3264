// The worked case the Covenant Watch figures share. Fictional throughout: Larkspur Credit
// Opportunities Fund II, its borrower Tallis Brook Components, and every figure and identifier.

/** One test's evidence line, part by part (F1 prints it whole; F3 splits it). */
export const evidenceLine = [
  { label: "Source", sep: "", value: "CC-2026Q2-TallisBrook.pdf" },
  { label: "Version", sep: " · ", value: "v1" },
  { label: "Locator", sep: " · ", value: "Sch. 1 l.V p.3" },
  { label: "Value", sep: " → ", value: "4.25x reported, 4.61x recomputed" },
  { label: "Test", sep: " → ", value: "max 4.50x §7.03(a); Shared Cap Amd. No. 2 §3(c)" },
  { label: "Status", sep: " → ", value: "fail, headroom −2.5%" },
  { label: "Approver", sep: " → ", value: "credit analyst" },
  { label: "Timestamp", sep: " · ", value: "2026-08-13T10:42Z" },
] as const;
