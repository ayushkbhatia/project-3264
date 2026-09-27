// Types for the ported 03–05 canvas logic (rebuild-platform.logic.js). Only the surface the
// component that extends it touches is described.

import { Component, type RefObject } from "react";

export interface RebuildPlatformVals {
  boxEl: RefObject<HTMLDivElement | null>;
  wrapEl: RefObject<HTMLDivElement | null>;
  latEl: RefObject<SVGGElement | null>;
  frameEl: RefObject<HTMLDivElement | null>;
  f5El: RefObject<HTMLDivElement | null>;
  flyEl: RefObject<HTMLDivElement | null>;
}

export declare class RebuildPlatformLogic<P = object> extends Component<P> {
  frameEl: RefObject<HTMLDivElement | null>;
  f5El: RefObject<HTMLDivElement | null>;
  raf: number;
  /** The rAF step; reassignable so a subclass can wrap it. */
  tick: (now: number) => void;
  locked: boolean | undefined;
  completed: boolean | undefined;
  arrived: boolean | undefined;
  componentDidMount(): void;
  componentWillUnmount(): void;
  fly(p: number): void;
  /** 04 as an SVG string: s = seconds since landing, p = flight progress, g = idle clock. */
  scene(s: number, eo: null, p: number, g: number): string;
  /** 05 as an SVG string, s = seconds since arrival. */
  scene05(s: number): string;
  sm(a: number, b: number, x: number): number;
  renderVals(): RebuildPlatformVals;
}
