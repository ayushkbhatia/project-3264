import { getImageProps, type StaticImageData } from "next/image";
import type { FeaturedSlug } from "@/content/playbooks";

import capitalCallFlow from "../../../public/img/playbooks/capital-call-flow.webp";
import clientReportingFlow from "../../../public/img/playbooks/client-reporting-flow.webp";
import covenantWatch from "../../../public/img/playbooks/covenant-watch.webp";
import investorReporting from "../../../public/img/playbooks/investor-reporting.webp";
import loanOpsLedger from "../../../public/img/playbooks/loan-ops-ledger.webp";
import mandateGuardrails from "../../../public/img/playbooks/mandate-guardrails.webp";
import navPackReview from "../../../public/img/playbooks/nav-pack-review.webp";
import researchIntake from "../../../public/img/playbooks/research-intake.webp";
import sideLetterRegister from "../../../public/img/playbooks/side-letter-register.webp";

import featCapitalCallFlow from "../../../public/img/playbooks/feat-capital-call-flow.webp";
import featCovenantWatch from "../../../public/img/playbooks/feat-covenant-watch.webp";
import featMandateGuardrails from "../../../public/img/playbooks/feat-mandate-guardrails.webp";
import featNavPackReview from "../../../public/img/playbooks/feat-nav-pack-review.webp";
import featResearchIntake from "../../../public/img/playbooks/feat-research-intake.webp";
import featSideLetterRegister from "../../../public/img/playbooks/feat-side-letter-register.webp";

import heroPoster from "../../../public/img/playbooks/hero-poster.jpg";
import valleyPastel from "../../../public/img/private-credit/valley-pastel.png";
import platformWash from "../../../public/img/playbooks/platform-wash.webp";
import subscribeWash from "../../../public/img/playbooks/subscribe-wash.webp";

// The Playbooks page's images and the hero video. Sources are the handoff's 1376×768 washes,
// re-encoded to WebP by scripts/playbooks-assets.mjs; next/image serves them as AVIF/WebP at
// the rendered size. All are decorative (alt=""): each card's title carries the meaning.

/** Category tiles and results tiles, by slug. */
export const tileImages: Record<string, StaticImageData> = {
  "covenant-watch": covenantWatch,
  "capital-call-flow": capitalCallFlow,
  "loan-ops-ledger": loanOpsLedger,
  "nav-pack-review": navPackReview,
  "investor-reporting": investorReporting,
  "side-letter-register": sideLetterRegister,
  "mandate-guardrails": mandateGuardrails,
  "client-reporting-flow": clientReportingFlow,
  "research-intake": researchIntake,
};

/** Carousel images (a different crop of each wash), by slug. */
export const featureImages: Record<FeaturedSlug, StaticImageData> = {
  "covenant-watch": featCovenantWatch,
  "nav-pack-review": featNavPackReview,
  "mandate-guardrails": featMandateGuardrails,
  "capital-call-flow": featCapitalCallFlow,
  "side-letter-register": featSideLetterRegister,
  "research-intake": featResearchIntake,
};

export { platformWash, subscribeWash };

/** The closing tile's painting: the same file as the Private Credit page's CTA band. */
export const closingWash = valleyPastel;

// Rendered widths, for `sizes`. Content column: 1280px, inside 40px side padding (20px below
// 480px, specs/08).
//   tiles:    repeat(auto-fit, minmax(300px, 1fr)), 28px gaps: 3 columns from a 956px column
//             (viewport 1036), 2 from 628px (708), else 1.
//   carousel: slide = min(1200, W − 80) with 14px padding; two image-and-text columns while the
//             slide is at least 694px wide, else one.
export const TILE_SIZES =
  "(min-width: 1360px) 408px, (min-width: 1036px) calc((100vw - 136px) / 3), (min-width: 708px) calc((100vw - 108px) / 2), (min-width: 480px) calc(100vw - 80px), calc(100vw - 40px)";
export const FEATURE_SIZES =
  "(min-width: 1280px) 579px, (min-width: 774px) calc(50vw - 61px), calc(100vw - 108px)";
/** The CTA cards: side by side (the subscribe card the wider, 670px at 1440) above ~1140px. */
export const CTA_SIZES = "(min-width: 1360px) 670px, (min-width: 1140px) 50vw, calc(100vw - 80px)";
/** The closing tile runs 40px either side of the column, to 1426px wide (see ClosingCta). */
export const CLOSING_SIZES = "(min-width: 1506px) 1426px, (min-width: 480px) calc(100vw - 80px), calc(100vw - 40px)";

/* ------------------------------------------------------------------ hero */

/**
 * The hero's boomerang loop (scripts/playbooks-video.sh): 1756×1176 for tablets and up, 960
 * wide for phones. H.264, no audio, faststart, a keyframe every second.
 */
export const HERO_VIDEO = [
  { src: "/video/playbooks-hero.mp4", media: "(min-width: 768px)" },
  { src: "/video/playbooks-hero-960.mp4", media: undefined },
] as const;

/** The video's first frame, through the image optimiser (AVIF / WebP by Accept header). */
export const HERO_POSTER = getImageProps({ src: heroPoster, alt: "", width: 1756, height: 1176 }).props.src;
