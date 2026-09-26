// Types for the ported 03 build logic (rebuild-graphic.logic.js). Only the surface the
// component that extends it touches is described.

import { Component, type RefObject } from "react";

export interface RebuildGraphicProps {
  /** Mounted inside the 03–05 canvas: no own backdrop or CTA; the timeline comes from window.__rbCtl. */
  bare?: boolean;
}

export interface RebuildGraphicVals {
  rgBox: RefObject<HTMLDivElement | null>;
  rgFrame: RefObject<HTMLDivElement | null>;
}

export declare class RebuildGraphicLogic<P extends RebuildGraphicProps = RebuildGraphicProps> extends Component<P> {
  raf: number;
  /** The rAF step; reassignable so a subclass can wrap it. */
  tick: (now: number) => void;
  componentDidMount(): void;
  componentWillUnmount(): void;
  /** The 03 stack as an SVG string: t = build progress 0–1, sec = idle clock. */
  scene(t: number, sec: number): string;
  renderVals(): RebuildGraphicVals;
}
