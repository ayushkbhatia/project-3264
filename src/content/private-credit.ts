// Copy for the Private Credit page MARKUP, set verbatim from the design handoff
// (design_handoff_private_credit/reference/Private Credit.dc.html). The copy inside the
// pinned stages, the servicing cards and the investor window is built by the motion module
// (src/motion/private-credit/private-credit.js) and lives there, as data, on purpose.
//
// All names, figures, funds and deals on this page are illustrative designed content.

import type { HeaderNavItem } from "@/components/home/Header";
import type { FooterColumn } from "@/components/home/Footer";
import { routes, type Link } from "./home";

export const route = "/industries/private-credit";

// Every "Book a platform review" / "Start with the audit" CTA. The prototype uses the
// studio's email; swap in the booking URL when there is one (one line).
export const booking = { href: "mailto:hello@3264.ai" } as const;

export const nav: HeaderNavItem[] = [
  { label: "AI Engineering", href: routes.aiEngineering },
  { label: "AI Transformation", href: routes.aiTransformation },
  { label: "Industries", href: "#top", current: true },
  { label: "Work", href: "/#work" },
  { label: "Playbooks", href: "/#playbooks" },
  { label: "Company", href: routes.company },
];

export const headerCta: Link = { label: "Book a platform review", href: booking.href };

export const hero = {
  crumb: { label: "Industries", href: "/#industries" },
  current: "Private Credit",
  title: "We build the platform your private credit fund runs on",
  standfirst:
    "Origination, KYC, credit, servicing, covenants and investor reporting on a single record — built to your process, in production inside eight weeks.",
  primary: { label: "Book a platform review", href: booking.href },
  secondary: { label: "How we add value", href: "#platform" },
  // the equation band: 3264.ai = ∫₀ᵀ (Loan Origination ⊕ … ⊕ Investor Reporting) / one record dt
  terms: ["Loan Origination", "Loan Management", "Covenant Engine", "Investor Reporting"],
  denominator: "one record",
} as const;

export const pinned = {
  reality: "Run a bigger book without a bigger back office",
  platform: { line: "Follow every deal in one system of record, ", emphasis: "fully trackable, auditable & traceable." },
  origination: "From sourced to funded, with the memo attached.",
} as const;

export const servicingTitle = "Interest, fees and resets read straight from the credit agreement.";
export const investorsTitle = "Every deal matched to the money that can hold it.";

export const ctaBands = {
  audit: {
    label: "CTA · audit (after 01)",
    eyebrow: "First step",
    title: "Start with a 2-week workflows & processes audit.",
    note: "The process map is yours, whether we build or not",
  },
  fit: {
    label: "CTA · fit (after 04)",
    eyebrow: "Think we’re a fit?",
    title: "Scale the book without scaling the back office.",
    note: "The process map is yours, whether we build or not",
  },
  cta: { label: "Book a platform review", href: booking.href },
} as const;

export const delivery = {
  title: { before: "From audit to ", grad: "live platform", after: " in eight weeks" },
  stages: [
    {
      ref: "dC1",
      num: "01",
      weeks: "Weeks 1–2",
      title: "Company-wide audit",
      body: "Every agreement, spreadsheet and handoff between origination, servicing, fund operations and IR, mapped.",
    },
    {
      ref: "dC2",
      num: "02",
      weeks: "Weeks 3–4",
      title: "Quick wins in automation",
      body: "The covenant tracker, the accrual schedule, the certificate intake. Automated and in production first.",
    },
    {
      ref: "dC3",
      num: "03",
      weeks: "Weeks 5–6",
      title: "Acceptance against your book",
      body: "Your live portfolio runs in parallel and ties out line by line. Nothing signs off until the numbers agree.",
    },
    {
      ref: "dC4",
      num: "04",
      weeks: "Weeks 7–8",
      title: "The platform, stitched together",
      body: "Pipeline, underwriting, servicing, monitoring and investor reporting on one record, your team trained on it.",
    },
  ],
  cta: {
    eyebrow: "Get started",
    title: "One platform, running your book.",
    body: "We start with a two-week audit of your desk. You keep the map whether or not we build the rest.",
    button: { label: "Start with the audit", href: booking.href },
  },
} as const;

// "Evaluation suites" and "Security" point at #servicing and LinkedIn is a mailto in the
// prototype: placeholders to confirm before launch.
export const footerColumns: FooterColumn[] = [
  {
    head: "Services",
    links: [
      { label: "AI Engineering", href: routes.aiEngineering },
      { label: "AI Transformation", href: routes.aiTransformation },
      { label: "Platform build", href: "#platform" },
      { label: "Evaluation suites", href: "#servicing" },
    ],
  },
  {
    head: "Industries",
    links: [
      { label: "Private Credit", href: "#top", current: true },
      { label: "Asset Management", href: "/#industries" },
      { label: "Fund Management", href: "/#industries" },
      { label: "Banking", href: "/#industries" },
    ],
  },
  {
    head: "Company",
    links: [
      { label: "Who we are", href: routes.companyWho },
      { label: "How we work", href: routes.companyHow },
      { label: "Case studies", href: "/#work" },
    ],
  },
  {
    head: "Resources",
    links: [
      { label: "Playbooks", href: "/#playbooks" },
      { label: "Field notes", href: "/#playbooks" },
      { label: "Security", href: "#servicing" },
    ],
  },
  {
    head: "Connect",
    links: [
      { label: "Book a review", href: booking.href },
      { label: "hello@3264.ai", href: "mailto:hello@3264.ai" },
      { label: "LinkedIn", href: "mailto:hello@3264.ai" },
    ],
  },
];
