// Types for the ported page logic (ai-engineering.logic.js, plain JS as the prototype wrote
// it). Only the surface the page component touches is described.

import { Component, type RefObject } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- refs land on many element types
type Ref = RefObject<any>;

export interface AIEngineeringProps {
  /** Writes --a on body. Default #157F52. */
  accent?: string;
  /** Writes --tex on body. Default true. */
  gridTexture?: boolean;
  /** false: word fills complete, hero veil and the 06 snippet hold still. Default true. */
  motion?: boolean;
  /** false: the intro never shows. Default true. */
  playIntro?: boolean;
  /** PORT: the optimised hero image URL, for the veil's greyscale copy (see initVeil). */
  veilSrc?: string;
}

export interface AuditItem {
  c: string;
  d: string;
  dc: string;
  bg: string;
  bar: string;
}

export interface AuditFinding {
  sev: string;
  t: string;
  d: string;
  dc: string;
  dt: string;
  no: string;
  where: string;
  exp: string;
  obl: string;
  fix: string;
  ev: Array<{ n: string; code: string; bg: string }>;
}

export interface AuditPack {
  items: AuditItem[];
  f: AuditFinding;
}

/** The renderVals() result: refs by their DOM-contract names, word arrays and handlers. */
export interface AIEngineeringVals {
  heroSec: Ref;
  heroImg: Ref;
  heroVeil: Ref;
  iWrap: Ref;
  iStage: Ref;
  iMark: Ref;
  skipIntro: () => void;
  stackTrack: Ref;
  wcCard: Ref;
  wpCard: Ref;
  wnCard: Ref;
  wcText: Ref;
  wcFit: Ref;
  wcStage: Ref;
  wpText: Ref;
  wpFit: Ref;
  wpStage: Ref;
  wpPortal: Ref;
  wpInsp: Ref;
  wnText: Ref;
  wnFit: Ref;
  wnStage: Ref;
  wcWords: string[];
  wpWords: string[];
  wnWords: string[];
  auFit: Ref;
  auStage: Ref;
  auGrid: Ref;
  auBars: Ref;
  auPanel: Ref;
  auCal: Ref;
  auCells: Ref;
  auWin: Ref;
  auPane: Ref;
  auFindings: Ref;
  auPack: (i: number) => AuditPack;
  enTrack: Ref;
  enStage: Ref;
  enA: Ref;
  enB: Ref;
  enAi: Ref;
  enBi: Ref;
  enAs: Ref;
  enBs: Ref;
  enAx: Ref;
  enBx: Ref;
  enCal: Ref;
  enBld: Ref;
  enAWords: string[];
  enBWords: string[];
  enJumpA: () => void;
  enJumpB: () => void;
}

export declare class AIEngineeringLogic<P extends AIEngineeringProps = AIEngineeringProps> extends Component<P> {
  heroImg: Ref;
  iWrap: Ref;
  enAs: Ref;
  enBs: Ref;
  enAx: Ref;
  enBx: Ref;
  enCal: Ref;
  _enM: number | null | undefined;
  _enP2: number | undefined;
  _enVB: number | undefined;
  componentDidMount(): void;
  componentDidUpdate(): void;
  componentWillUnmount(): void;
  maybeIntro(): void;
  stepStack(): void;
  stepWhatChanged(p: number): void;
  stepProduced(p: number): void;
  stepUnchanged(p: number): void;
  stepEngage(): void;
  enCalendar(cal: Element | null, p: number): void;
  auPack(i: number): AuditPack;
  renderVals(): AIEngineeringVals;
}
