import { getImageProps } from "next/image";
import heroPoster from "../../../public/img/ai-engineering/hero-poster.jpg";

// The hero's video and its poster (design_handoff_ai_engineering_hero_video). Shared by the
// hero markup (client) and the page (server), which preloads the poster: it is the LCP.

/** Self-hosted: H.264, no audio, faststart, 1920 wide, ~3MB. */
export const HERO_VIDEO = "/video/ai-engineering-hero.mp4";

/** The video's first frame, through the image optimiser (AVIF / WebP by Accept header). */
export const HERO_POSTER = getImageProps({ src: heroPoster, alt: "", width: 1920, height: 1074 }).props.src;
