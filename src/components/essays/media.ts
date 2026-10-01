import type { StaticImageData } from "next/image";
import { featureImages, tileImages } from "@/components/playbooks/media";

// The essays' paintings are the playbook washes, byte for byte (design_handoff_essays/assets is
// a copy of the Playbooks handoff's), so they come from the same WebP sources: a tile wash by
// its slug, or a carousel wash as "feat-<slug>". Every essay has a distinct one.
export function essayImage(name: string): StaticImageData | undefined {
  return name.startsWith("feat-") ? featureImages[name.slice(5) as keyof typeof featureImages] : tileImages[name];
}

// Rendered widths, for `sizes`. The index column is 1280px inside 40px padding (20px below
// 480px). Lead: flex 1.25 1 520px beside the text (gap 56) until the row wraps; Start here:
// two cards side by side above ~920px; list rows: clamp(150px, 20vw, 232px).
export const LEAD_SIZES = "(min-width: 1360px) 672px, (min-width: 1040px) 52vw, calc(100vw - 80px)";
export const START_SIZES = "(min-width: 1360px) 620px, (min-width: 960px) 46vw, calc(100vw - 80px)";
export const ROW_SIZES = "(min-width: 1160px) 232px, (min-width: 750px) 20vw, 150px";
/** The essay hero (16:9) fills the main column: at most 680px. */
export const HERO_SIZES = "(min-width: 760px) 680px, calc(100vw - 40px)";
/** More essays: auto-fit columns of at least 250px in a 1048px row. */
export const MORE_SIZES = "(min-width: 1048px) 310px, (min-width: 859px) 31vw, (min-width: 566px) 46vw, 92vw";
