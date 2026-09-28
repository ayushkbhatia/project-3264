// The worked case the NAV Pack Review figures share. Fictional throughout: Larkspur Credit
// Opportunities Fund II, its administrator Northbay Fund Services, the Q2 2026 pack and every
// figure and identifier. The numbers reconcile; keep them exactly as given.

/** The management fee break's evidence line, part by part (F1 prints it whole; F3 splits it). */
export const evidenceLine = [
  { label: "Source", sep: "", value: "NAV pack Q2 2026" },
  { label: "Version", sep: " · ", value: "v3" },
  { label: "Locator", sep: " · ", value: "SAL row 14" },
  { label: "Value", sep: " → ", value: "(1,262,500.00)" },
  { label: "Test", sep: " → ", value: "fee recalc per LPA s.8.2: (1,187,500.00), diff (75,000.00) > 500.00" },
  { label: "Status", sep: " → ", value: "break · explained" },
  { label: "Approver", sep: " → ", value: "Fund controller" },
  { label: "Timestamp", sep: " · ", value: "2026-07-21 14:32" },
] as const;
