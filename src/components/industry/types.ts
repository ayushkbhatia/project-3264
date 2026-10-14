import type { ReactNode } from "react";
import type { IndustryLogicData } from "@/motion/industry/industry.logic";

// The content an industry page passes to the shared components (components/industry). The two
// handoffs (design_handoff_private_equity, design_handoff_fund_management) build their pages on
// one framework whose markup differs only in its words; everything that differs is here, and
// everything that does not (geometry, colours, timings) stays in the components.
//
// Titles given as string arrays break onto a new line between items (the prototypes' <br />).

export type Lines = string[];

export interface IndustryCopy {
  /** The intro overlay's bottom-left label ("Portfolio log"). */
  introLabel: string;
  hero: { eyebrow: string; title: Lines; lede: string; primary: string; secondary: string };
  premise: {
    eyebrow: string;
    title: Lines;
    lede: string;
    /** The three cards: their screen label and mono eyebrow. The windows are the page's own
        markup (see IndustryPageProps.windows). */
    cards: Array<{ label: string; eyebrow: string }>;
  };
  audit: {
    /** The section's data-screen-label. */
    label: string;
    eyebrow: string;
    title: string;
    /** The plot's y-axis: the 0.4, 0.8 and 1.2 ticks and the axis title. */
    yTicks: [string, string, string];
    yAxis: string;
    /** The grid's legend title. */
    legend: string;
    /** The five shortlisted bubbles' labels, in the logic's top-map order. */
    bubbles: string[];
    list: {
      title: string;
      /** name, what is built, value, weeks. */
      rows: Array<[string, string, string, string]>;
      total: string;
      note: string;
    };
    /** The step strip: when, what, output. */
    steps: Array<[string, string, string]>;
    caption: string;
  };
  plan: {
    label: string;
    eyebrow: string;
    title: Lines;
    lede: string;
    window: string;
    /** The six Gantt rows: name and "Days s–e" (their spans are the prototype's, in Plan). */
    rows: Array<[string, string]>;
    /** The seven log entries: "Dnn" and text. */
    log: Array<[string, string]>;
    kpi: { label: string; start: string; sub: string; hours: string };
    board: { title: string; items: [string, string, string] };
    note: string;
  };
  portfolio: {
    label: string;
    eyebrow: string;
    title: string;
    /** The title's iridescent second line. */
    glow: string;
    lede: string;
    library: string;
    slot: [name: string, from: string];
    sum: [label: string, value: string];
    /** The five rows: name and sector line. */
    rows: Array<[string, string]>;
    deltas: string[];
    chip: string;
    caption: string;
  };
  value: {
    eyebrow: string;
    title: Lines;
    lede: string;
    window: string;
    chart: string;
    axis: string;
    /** The header counter's "from" label and its starting figure and pill. */
    from: string;
    run: string;
    pct: string;
    /** The six bars' value labels. */
    labels: string[];
    /** The six bars' names and sub-lines. */
    names: Array<[string, string]>;
    /** The footer line: its text, the starting figure, and the words after the figure. */
    ev: [string, string, string];
    caption: string;
  };
  engagement: {
    eyebrow: string;
    title: Lines;
    /** Fund Management's cards are rounded (20px) and its third card takes a stronger wash. */
    rounded?: boolean;
    strongLastVeil?: boolean;
    cards: Array<{
      head: [string, string];
      title: string;
      body: string;
      facts: Array<[string, string]>;
      cta: string;
    }>;
  };
  /** Fund Management's band after the audit. */
  band?: { eyebrow: string; title: string; cta: string; note: string };
  /** Fund Management's interactive capital account (its rows live in the logic data, `trace`). */
  trace?: {
    eyebrow: string;
    title: Lines;
    lede: string;
    window: string;
    investor: string;
    period: string;
    pill: string;
    pillNote: string;
    caption: string;
  };
  /** Fund Management's playbook cards. */
  playbooks?: {
    eyebrow: string;
    title: Lines;
    lede: string;
    all: string;
    cards: Array<{ href: string; image: string; title: string; blurb: string }>;
  };
  /** Fund Management's case studies. */
  work?: {
    eyebrow: string;
    title: Lines;
    lede: string;
    cards: Array<{ href: string; image: string; eyebrow: string; title: string; summary: string; metrics: Array<[string, string]> }>;
    all: string;
  };
}

export interface IndustryPageData extends IndustryLogicData {
  copy: IndustryCopy;
}

export interface IndustryPageProps {
  data: IndustryPageData;
  /** The three premise windows, the page's own markup (fixed 620×470, 700×520, 660×500 stages). */
  windows: [ReactNode, ReactNode, ReactNode];
  /** The <html> attribute the page's intro first-paint gate uses (IntroGate.ts). */
  introAttr: string;
  /** Server-rendered site chrome and the closing image, placed where the reference has them. */
  header: ReactNode;
  closing: ReactNode;
  footer: ReactNode;
}
