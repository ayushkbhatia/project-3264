// Types for the React binding in react.js. The motion modules are plain JS and stay that way;
// this file only describes the surface the app's components touch.

import type { MouseEvent } from "react";

export interface MotionSystem {
  start(): unknown;
  destroy(): void;
}

export type MotionSystemClass<O = Record<string, unknown>> = new (
  els: Record<string, HTMLElement>,
  opts?: O,
) => MotionSystem;

export interface Bind {
  (key: string): (el: HTMLElement | null) => void;
  /** Handler for a method the system exposes to markup, e.g. `bind.handler("phJump")`. */
  handler(method: string): (e: MouseEvent<HTMLElement>) => void;
}

export declare function motionOff(): boolean;

export declare function useMotionSystem<O = Record<string, unknown>>(
  System: MotionSystemClass<O>,
  opts?: O,
  deps?: ReadonlyArray<unknown>,
  /** Mount only while this media query matches, e.g. "(min-width: 768px)". */
  media?: string | null,
): Bind;

export declare const IntroRelief: MotionSystemClass<{
  accent?: string;
  introPace?: number;
  playIntro?: boolean;
}>;
export declare const PlatformSequence: MotionSystemClass<{ accent?: string }>;
export declare const Vignettes: MotionSystemClass<Record<string, never>>;
export declare const HeroArt: MotionSystemClass<Record<string, never>>;
export declare const HERO_SRC: string;
