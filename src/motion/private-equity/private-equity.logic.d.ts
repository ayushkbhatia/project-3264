// Types for the ported page logic (private-equity.logic.js, plain JS as the prototype wrote
// it). Only the surface the page component touches is described.

import { Component, type RefObject } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- refs land on many element types
type Ref = RefObject<any>;

export interface PrivateEquityProps {
  /** Writes --a on body. Default #157F52. */
  accent?: string;
  /** false: every diagram holds its final frame, the word fills complete, the veil stays grey. Default true. */
  motion?: boolean;
  /** false: the intro never shows. Default true. */
  playIntro?: boolean;
}

/** renderVals(): the refs by their DOM-contract names, the statements' words and the audit data. */
export interface PrivateEquityVals {
  iWrap: Ref; iStage: Ref; iMark: Ref;
  heroSec: Ref; heroImg: Ref; heroVeil: Ref;
  stackTrack: Ref;
  c1: Ref; c2: Ref; c3: Ref; c1x: Ref; c2x: Ref; c3x: Ref; c1f: Ref; c2f: Ref; c3f: Ref; c1s: Ref; c2s: Ref; c3s: Ref;
  dgFit: Ref; dgStage: Ref; dgScan: Ref; dgAxes: Ref; dgList: Ref;
  plTrack: Ref; plFit: Ref; plStage: Ref; plHead: Ref; plDay: Ref;
  pfFit: Ref; pfStage: Ref; pfChip: Ref;
  vlFit: Ref; vlStage: Ref;
  enRow: Ref;
  skipIntro: () => void;
  w1: string[];
  w2: string[];
  w3: string[];
  dgWf: string[];
  dgCos: Array<{ n: string; s: string }>;
  dgCells: Array<{ t: string }>;
}

export class PrivateEquityLogic<P extends PrivateEquityProps = PrivateEquityProps> extends Component<P> {
  heroImg: Ref;
  heroSec: Ref;
  stackTrack: Ref;
  componentDidMount(): void;
  componentDidUpdate(prev?: Readonly<P>): void;
  componentWillUnmount(): void;
  maybeIntro(): void;
  still(): boolean;
  stepStack(): void;
  renderVals(): PrivateEquityVals;
}
