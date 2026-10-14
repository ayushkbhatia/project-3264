import type { ReactNode } from "react";
import type { IndustryLogicData } from "@/motion/industry/industry.logic";

// The content an industry page passes to the shared components (components/industry). The
// handoffs (Private Equity, Fund Management, Financial Services, Asset Management, and the
// Production Assurance service page) build their pages on one framework whose markup differs only
// in its words; everything that differs is here, and everything that does not (geometry, colours,
// timings) stays in the components. Optional fields default to the industry pages' wording.
//
// Titles given as string arrays break onto a new line between items (the prototypes' <br />).

export type Lines = string[];

export interface IndustryCopy {
  /** The intro overlay's bottom-left label ("Portfolio log"). */
  introLabel: string;
  hero: {
    eyebrow: string;
    title: Lines;
    lede: string;
    primary: string;
    secondary: string;
    /** Where the secondary CTA goes. Default "#plan". */
    secondaryHref?: string;
  };
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
    /** The x-axis title and the highlighted quadrant's label. Default "Effort to ship →" and
        "Build first". */
    xAxis?: string;
    quadrant?: string;
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
    /** The y-axis ticks, top to bottom. Default 16, 15, 14, 13, 12. */
    ticks?: [string, string, string, string, string];
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
      /** Lines, where a title breaks onto two (Production Assurance's "The handover / to production"). */
      title: string | Lines;
      body: string;
      facts: Array<[string, string]>;
      cta: string;
    }>;
  };
  /** The call-to-action band after the audit (Fund Management on). */
  band?: Band;
  /** A second band, after the related work: Production Assurance's offer to prospects who are not
      live yet, on the night painting. */
  offer?: Band;
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
    /** The lineage panel's title. Default "Lineage". */
    panel?: string;
    caption: string;
  };
  /** Fund Management's playbook cards. */
  playbooks?: {
    /** The section's data-screen-label. Default "Fund playbooks". */
    label?: string;
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

export interface Band {
  /** The section's data-screen-label. Default "CTA · operations audit". */
  label?: string;
  eyebrow: string;
  title: string;
  /** A line under the title. */
  line?: string;
  cta: string;
  /** Where the button goes. Default "#engagement". */
  href?: string;
  note: string;
  /** The painting and its wash: the valley under dark green (default), or the night sky under
      blue-black. */
  tone?: "valley" | "night";
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
