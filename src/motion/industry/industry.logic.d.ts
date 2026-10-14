// Types for the ported industry-page logic (industry.logic.js, plain JS as the prototypes wrote
// it). Only the surface the page component touches is described.

import { Component, type RefObject } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- refs land on many element types
type Ref = RefObject<any>;

/** One trace row: label, amount, then four [key, description, reference] lineage steps. */
export type TraceRow = [label: string, amount: string, steps: Array<[string, string, string]>];

/**
 * What the logic reads from a page (each field replaces a line the two prototypes wrote with
 * their own data; see the PORT SHIMS in industry.logic.js).
 */
export interface IndustryLogicData {
  intro: {
    /** The four build-log rows. */
    steps: [string, string, string, string];
    /** The footer's left line ("5 companies live"); the right reads "day 100". */
    live: string;
  };
  /** The three premise statements, filled word by word. */
  statements: [string, string, string];
  /** The audit loop: six rows by six columns, values 0.1–1.2, and the five shortlisted cells'
      bubble targets, "row-col" → [cx, cy, diameter] on the 1120×600 stage. */
  audit: {
    cos: Array<[name: string, sector: string]>;
    wf: string[];
    v: number[][];
    top: Record<string, [number, number, number]>;
  };
  plan: {
    /** [day, headline step, hours step] for each capability going live. */
    kpi: Array<[number, number, number]>;
    /** The headline figure, from the sum of the steps eased in so far. */
    kpiText: (e: number) => string;
  };
  value: {
    /** The header's running total and its pill, from the uplift added so far. */
    run: (add: number) => string;
    pct: (add: number) => string;
    /** The footer's counted-up figure, from 0 to 1. */
    ev: (p: number) => string;
  };
  /** Traceability rows (Fund Management only). */
  trace?: TraceRow[];
}

export interface IndustryLogicProps {
  data: IndustryLogicData;
  /** Writes --a on body. Default #157F52. */
  accent?: string;
  /** false: every diagram holds its final frame, the word fills complete, the veil stays grey,
      Traceability does not auto-advance. Default true. */
  motion?: boolean;
  /** false: the intro never shows. Default true. */
  playIntro?: boolean;
}

/** renderVals(): the refs by their DOM-contract names, the statements' words, the audit grid's
    and Traceability's render data. */
export interface IndustryVals {
  iWrap: Ref; iStage: Ref; iMark: Ref;
  heroSec: Ref; heroImg: Ref; heroVeil: Ref;
  stackTrack: Ref;
  c1: Ref; c2: Ref; c3: Ref; c1x: Ref; c2x: Ref; c3x: Ref; c1f: Ref; c2f: Ref; c3f: Ref; c1s: Ref; c2s: Ref; c3s: Ref;
  dgFit: Ref; dgStage: Ref; dgScan: Ref; dgAxes: Ref; dgList: Ref;
  plTrack: Ref; plFit: Ref; plStage: Ref; plHead: Ref; plDay: Ref;
  pfFit: Ref; pfStage: Ref; pfChip: Ref;
  vlFit: Ref; vlStage: Ref;
  enRow: Ref;
  trWrap: Ref; trBar: Ref; trList: Ref;
  skipIntro: () => void;
  w1: string[];
  w2: string[];
  w3: string[];
  dgWf: string[];
  dgCos: Array<{ n: string; s: string }>;
  dgCells: Array<{ t: string }>;
  trPick: (e: { currentTarget: Element }) => void;
  trRows: Array<{ i: string; label: string; amt: string; on: string; bg: string; barOp: string; fw: string; rule: string }>;
  trSel: { label: string; amt: string };
  trSteps: Array<{ k: string; v: string; m: string }>;
  trHint: string;
}

export class IndustryLogic<P extends IndustryLogicProps = IndustryLogicProps> extends Component<P, { tr: number }> {
  heroImg: Ref;
  heroSec: Ref;
  componentDidMount(): void;
  componentDidUpdate(prev?: Readonly<P>, prevState?: Readonly<{ tr: number }>): void;
  componentWillUnmount(): void;
  maybeIntro(): void;
  still(): boolean;
  renderVals(): IndustryVals;
}
