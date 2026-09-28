import type { ReactNode } from "react";

// The nine playbook icons (design_handoff_playbooks/icons/<slug>.svg, identical to the
// prototype's ICONS map): 48×48, 2px round stroke on currentColor.
const ICONS: Record<string, ReactNode> = {
  "covenant-watch": (
    <>
      <path d="M19 41H11a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h13l7 7v10" />
      <path d="M24 5v7h7" />
      <path d="M14 18h10M14 24h6" />
      <path d="M22 33c2.8-4.4 6.7-6.5 11-6.5s8.2 2.1 11 6.5c-2.8 4.4-6.7 6.5-11 6.5s-8.2-2.1-11-6.5Z" />
      <circle cx="33" cy="33" r="3" />
    </>
  ),
  "capital-call-flow": (
    <>
      <circle cx="7" cy="12" r="2.5" />
      <circle cx="7" cy="24" r="2.5" />
      <circle cx="7" cy="36" r="2.5" />
      <path d="M9.5 12c5 0 5 12 10 12M9.5 36c5 0 5-12 10-12M9.5 24H25" />
      <path d="m21.5 20.5 3.5 3.5-3.5 3.5" />
      <ellipse cx="37" cy="14" rx="7" ry="3" />
      <path d="M30 14v20c0 1.66 3.13 3 7 3s7-1.34 7-3V14" />
      <path d="M30 20.7c0 1.66 3.13 3 7 3s7-1.34 7-3M30 27.3c0 1.66 3.13 3 7 3s7-1.34 7-3" />
    </>
  ),
  "loan-ops-ledger": (
    <>
      <rect x="10" y="5" width="28" height="38" rx="2" />
      <path d="M16 5v38" />
      <path d="M29 5v9l2.5-2 2.5 2V5" />
      <path d="M21 22h5M29.5 22H33M21 28h5M29.5 28H33M21 34h5M29.5 34H33" />
    </>
  ),
  "nav-pack-review": (
    <>
      <path d="M15 9.5V8a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v26a2 2 0 0 1-2 2h-1.5" />
      <rect x="9" y="12" width="24" height="30" rx="2" />
      <path d="m15 27.5 4.5 4.5 8-9" />
    </>
  ),
  "investor-reporting": (
    <>
      <path d="M13 22V9a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v13" />
      <path d="M19 13h10M19 18h6" />
      <path d="M6 20.5V39a2 2 0 0 0 2 2h32a2 2 0 0 0 2-2V20.5" />
      <path d="m6 20.5 18 11.5 18-11.5M6 20.5l7-4.5M42 20.5l-7-4.5" />
    </>
  ),
  "side-letter-register": (
    <>
      <path d="M17 8h-4a3 3 0 0 0-3 3v29a3 3 0 0 0 3 3h22a3 3 0 0 0 3-3V11a3 3 0 0 0-3-3h-4" />
      <rect x="17" y="5" width="14" height="6" rx="2" />
      <path d="M16.5 21h.01M16.5 28h.01M16.5 35h.01" />
      <path d="M21 21h11M21 28h11M21 35h7" />
    </>
  ),
  "mandate-guardrails": (
    <>
      <path d="M24 5 39 10.5V22c0 9.5-6.4 16.8-15 21-8.6-4.2-15-11.5-15-21V10.5Z" />
      <path d="m17.5 23.5 4.5 4.5 8.5-8.5" />
    </>
  ),
  "client-reporting-flow": (
    <>
      <path d="M22 10.5A15.5 15.5 0 1 0 37.5 26H22Z" />
      <path d="M26 6.5A15.5 15.5 0 0 1 41.5 22H26Z" />
    </>
  ),
  "research-intake": (
    <>
      <path d="M24 6v19" />
      <path d="m17.5 18.5 6.5 6.5 6.5-6.5" />
      <path d="M16 15h-3.2a2 2 0 0 0-1.86 1.26L6 28M32 15h3.2a2 2 0 0 1 1.86 1.26L42 28" />
      <path d="M6 28h10l3 4h10l3-4h10v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2Z" />
    </>
  ),
};

/** One playbook's icon, drawn in ink. Decorative: size it with `className`. */
export function PlaybookIcon({ slug, className, strokeWidth = 2 }: { slug: string; className?: string; strokeWidth?: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      fill="none"
      stroke="#1A1917"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {ICONS[slug]}
    </svg>
  );
}

/**
 * The glass icon badge centred on every playbook image (specs/00): a frosted rounded square,
 * `size` of the image box's height (34% on tiles, 30% in the carousel, 52% on a playbook
 * page's related-playbook card), the icon at 48% of the badge. Decorative. The image box must
 * be position:relative.
 */
export function PlaybookBadge({ slug, size }: { slug: string; size: "34%" | "30%" | "52%" }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-1/2 box-border flex aspect-square -translate-1/2 items-center justify-center rounded-[28%] border border-[rgba(255,255,255,0.72)] bg-[rgba(250,249,246,0.62)] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_18px_40px_-16px_rgba(20,20,18,0.38)] backdrop-blur-[18px] backdrop-saturate-[1.3]"
      style={{ height: size }}
    >
      <PlaybookIcon slug={slug} className="block h-[48%] w-[48%]" />
    </div>
  );
}
