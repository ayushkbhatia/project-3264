// Types for the React binding in react.js. The motion module stays plain JS; this describes
// only the surface the page's components touch.

import type { MouseEvent, ReactNode } from "react";

export interface PrivateCreditOptions {
  accent?: string;
  gridTexture?: boolean;
  motion?: boolean;
  playIntro?: boolean;
  currency?: string;
  frozenT?: number | null;
}

export interface Bind {
  (key: string): (el: Element | null) => void;
  /** Handler for a method the module exposes to markup, e.g. `bind.handler("skipIntro")`. */
  handler(method: string): (e: MouseEvent<Element>) => void;
}

export interface MotionControls {
  pause(): void;
  resume(): void;
  isPaused(): boolean;
  isFrozen(): boolean;
}

export declare const ELEMENTS: string[];
export declare class PrivateCreditMotion {
  constructor(nodes: Record<string, Element>, opts?: PrivateCreditOptions);
  start(): void;
  setOptions(opts: PrivateCreditOptions): void;
  destroy(): void;
  skipIntro(): void;
}

export declare function PrivateCreditMotionRoot(props: {
  options?: PrivateCreditOptions;
  children?: ReactNode;
}): ReactNode;

export declare function useBind(): Bind;
export declare function useMotionControls(): MotionControls;
