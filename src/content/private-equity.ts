// Copy for the Private Equity page's shared chrome (metadata, closing image, footer), set
// verbatim from the design handoff (design_handoff_private_equity: copy-deck.md and the
// prototype, reference/Private Equity.dc.html, which wins where the two disagree). The section
// copy lives in the section markup, as the prototype has it; the copy the logic builds (intro
// rows, the statements, the audit grid) lives in src/motion/private-equity.
//
// All company names (Helix Logistics, Ardent Dental Group, Northfield Foods, Corvid Software,
// Beacon Claims, Tallis Engineering), "Fund III" and every £ figure are illustrative; each
// diagram carries its "Illustrative…" caption until signed-off engagement data replaces them.

import type { FooterColumn } from "@/components/home/Footer";
import { routes } from "./home";

export const route = routes.privateEquity;

export const meta = {
  title: "3264.ai — Private Equity",
  // The hero's lede, as the other industry and service pages use theirs.
  description:
    "We find the workflows in each portfolio company where AI moves EBITDA, ship them onto one production platform, and carry what works to the next company. Every capability has an owner, a measured baseline and the evidence a buyer will ask for at exit.",
} as const;

// The closing image (components/home/FooterImage.tsx): the night sky, with this page's copy.
export const closing = {
  title: "Bring the evidence to exit.",
  cta: { label: "Book a portfolio audit", href: "#engagement" },
  positioning: "AI value creation for private equity portfolios, measured from the baseline to exit.",
  sequence: "32 → 64",
} as const;

// The prototype's footer, with this site's routes for its links (README, "Header and menu
// linkage"): Private Equity is this page; Fund Management has no page yet, so it goes to the
// home page's industries as the other pages' footers and the header menu do (the handoff's
// /fund-management would 404); Case studies is the home page's selected engagements until a
// /work page exists; Essays stands in for "Field notes", as on every other page. "Book a call"
// and LinkedIn (no URL yet) are this page's engagement cards.
export const footerColumns: FooterColumn[] = [
  {
    head: "Services",
    links: [
      { label: "AI Engineering", href: routes.aiEngineering },
      { label: "AI Transformation", href: routes.aiTransformation },
      { label: "Deployment & Run", href: "/#capabilities" },
      { label: "Evaluation suites", href: "/#capabilities" },
    ],
  },
  {
    head: "Industries",
    links: [
      { label: "Private Credit", href: routes.privateCredit },
      // not marked current: the reference sets it in the ordinary link colour
      { label: "Private Equity", href: "#top" },
      { label: "Financial Services", href: "/#industries" },
      { label: "Fund Management", href: "/#industries" },
      { label: "Asset Management", href: "/#industries" },
    ],
  },
  {
    head: "Company",
    links: [
      { label: "Who we are", href: routes.whoWeAre },
      { label: "How we work", href: routes.howWeWork },
      { label: "Case studies", href: routes.caseStudies },
      { label: "Contact", href: routes.contact },
    ],
  },
  {
    head: "Resources",
    links: [
      { label: "Playbooks", href: routes.playbooks },
      { label: "Essays", href: routes.essays },
      { label: "Security", href: routes.security },
    ],
  },
  {
    head: "Connect",
    links: [
      { label: "Book a call", href: "#engagement" },
      { label: "hello@3264.ai", href: "mailto:hello@3264.ai" },
      { label: "LinkedIn", href: "#engagement" },
    ],
  },
];
