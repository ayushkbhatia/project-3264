// Copy for the Contact page (/contact), set verbatim from the design handoff
// (design_handoff_contact: copy-deck.md and the prototype, Contact.dc.html, which wins where the
// two disagree). Do not rewrite, shorten or reorder.
//
// The page replaced the Company page in the nav. Its form posts to /api/contact, which hands the
// enquiry to whichever delivery is configured (src/app/api/contact/deliver.ts); the handoff
// leaves the endpoint, notification address and CRM open.

import type { HeaderNavItem } from "@/components/home/Header";
import type { FooterColumn } from "@/components/home/Footer";
import { routes, stack, type Link } from "./home";

export const route = routes.contact;

export const meta = {
  title: "Contact — 3264.ai",
  description: "Thirty minutes, one workflow, no deck. Tell 3264 about your firm, or write to hello@3264.ai.",
} as const;

export const email = "hello@3264.ai";

export const nav: HeaderNavItem[] = [
  { label: "AI Engineering", href: routes.aiEngineering },
  { label: "AI Transformation", href: routes.aiTransformation },
  { label: "Industries", href: "/#industries" },
  { label: "Work", href: "/#work" },
  { label: "Playbooks", href: routes.playbooks },
  { label: "Essays", href: routes.essays },
  { label: "Contact", href: "#top", current: true },
];

export const headerCta: Link = { label: "Book an audit", href: `${routes.aiEngineering}#engagement` };

export const intro = {
  title: "Get in touch",
  lede: "Bring the workflow that costs you the most. We will tell you whether it is worth building, what it would cost, and what we would need from your side to start.",
  logosLabel: "Built on",
} as const;

/** The home page's nine platform marks, in the same order and with the same alt text. */
export const logos = stack.logos;

export const form = {
  name: "Name",
  email: "Work email",
  emailPlaceholder: "you@firm.com",
  message: "How can we help?",
  messagePlaceholder: "Tell us about your firm and the workflow you have in mind",
  submit: "Submit",
  sending: "Sending…",
  note: "We reply inside one business day.",
  errors: {
    name: "Add your name so we know who to reply to.",
    email: "Enter a work email, like you@firm.com.",
  },
  // Not designed; the handoff's suggestion ("Request failure"), set in the error red.
  failed: { before: "That didn't send. Write to ", after: " and we'll pick it up." },
  sent: {
    eyebrow: "Message sent",
    title: (firstName: string) => `Thanks, ${firstName}.`,
    body: (address: string) => `We will reply to ${address} inside one business day.`,
    again: "Send another message",
  },
  // A submission made before the page's script has run (or without it) is answered by a
  // redirect to /contact#enquiry-sent, which knows neither the name nor the address.
  sentWithoutScript: {
    title: "Thanks.",
    body: "We will reply inside one business day.",
  },
} as const;

export const directLine = { before: "Reach us any time at " } as const;

// The prototype's footer: the home page's columns, linking back to the home page, with the Company
// column and Security as design_handoff_contact's site-wide changes set them, and Essays in place
// of "Field notes" (its open item, done site-wide). Contact, "Book a call" and LinkedIn (no URL
// yet) are this page.
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
      // the reference sets it in the ordinary link colour, not as the current page
      { label: "Contact", href: "#top" },
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
      { label: "Book a call", href: "#top" },
      { label: "hello@3264.ai", href: `mailto:${email}` },
      { label: "LinkedIn", href: "#top" },
    ],
  },
];
