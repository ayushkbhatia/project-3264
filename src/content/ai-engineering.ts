// Copy for the AI Engineering page's shared chrome (header, footer, metadata), set verbatim
// from the design handoff (design_handoff_ai_engineering/reference/AI Engineering.dc.html).
// The section copy lives in the section markup, and the copy the motion builds (intro rows,
// audit findings, the SVG scenes) lives in src/motion/ai-engineering, as the reference has it.
//
// All names, funds, figures and code on this page are illustrative designed content.

import type { HeaderNavItem } from "@/components/home/Header";
import type { FooterColumn } from "@/components/home/Footer";
import { routes, type Link } from "./home";

export const route = routes.aiEngineering;

export const meta = {
  title: "3264.ai — AI Engineering",
  description:
    "Executives and analysts build working software in an afternoon now. We audit what they built, rebuild what has to be rebuilt, and run it in production with the controls a regulated firm is required to hold.",
} as const;

// The two CTAs inside the Engagement cards ("Book an audit", "Book a call") are the studio's
// email in the prototype; swap in the booking URL when there is one. The header, hero and
// footer CTAs go to #engagement, where those two cards are.
export const booking = { href: "mailto:hello@3264.ai" } as const;

export const nav: HeaderNavItem[] = [
  { label: "AI Engineering", href: "#top", current: true },
  { label: "AI Transformation", href: routes.aiTransformation },
  { label: "Industries", href: "/#industries" },
  { label: "Work", href: "/#work" },
  { label: "Playbooks", href: routes.playbooks },
  { label: "Essays", href: routes.essays },
  { label: "Contact", href: routes.contact },
];

export const headerCta: Link = { label: "Book an audit", href: "#engagement" };

// "Deployment & Run" and "Evaluation suites" point at the home page's capabilities, and
// LinkedIn at #engagement, in the prototype: placeholders to confirm before launch.
export const footerColumns: FooterColumn[] = [
  {
    head: "Services",
    links: [
      // not marked current: the reference sets it in the ordinary link colour
      { label: "AI Engineering", href: "#top" },
      { label: "AI Transformation", href: routes.aiTransformation },
      { label: "Deployment & Run", href: "/#capabilities" },
      { label: "Evaluation suites", href: "/#capabilities" },
    ],
  },
  {
    head: "Industries",
    links: [
      { label: "Private Credit", href: routes.privateCredit },
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
      // this page's own platform section (design_handoff_contact, "Site-wide changes")
      { label: "Security", href: "#platform" },
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
