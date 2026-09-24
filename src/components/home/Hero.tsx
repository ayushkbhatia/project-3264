"use client";

import type { CSSProperties } from "react";
import { preload } from "react-dom";
import { hero } from "@/content/home";
import { HERO_SRC, HeroArt, Vignettes, useMotionSystem } from "@/motion/react";
import { Button, Eyebrow, GridTexture, HairlineGrid } from "./primitives";

// Hero `#top` — design_handoff_home/specs/03-hero.md, ANIMATIONS.md §3 and §4.
//
// Layer stack, back to front: the painting (artCv), the page-colour scrim, the grid texture,
// then the content column. HeroArt only ever repaints the canvas's own pixels, so the type and
// the cards above it never move.

// Top and bottom fade on the painting. The cards' top edge sits near the 82% stop at 1440.
const ART_MASK =
  "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.55) 9%, #000 26%, #000 82%, transparent 100%)";

// Below 768px HeroArt is not mounted and the canvas shows this 900w cut of the painting instead.
const HERO_SRC_SM = "/img/hero-valley-900.webp";

// A 32x18 thumbnail of the painting, blurred (under 0.7KB inline), layered under it from 768px
// up. On a slow link the hero shows the painting's colours from first paint instead of a blank
// field, and the painting sharpens in over it. The painting is opaque and covers the canvas
// exactly, so once it has loaded none of this shows. Not on phones: the 900w cut is small and
// arrives quickly once preloaded, and at phone size Chrome would count this placeholder as the
// LCP image in place of the painting. Regenerate with `node qa/fix-herovig-placeholder.mjs`.
const HERO_PLACEHOLDER = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1376 768' preserveAspectRatio='none'><filter id='b' color-interpolation-filters='sRGB' x='0' y='0' width='100%25' height='100%25'><feGaussianBlur stdDeviation='43' edgeMode='duplicate'/><feComponentTransfer><feFuncA type='discrete' tableValues='1 1'/></feComponentTransfer></filter><image width='100%25' height='100%25' preserveAspectRatio='none' filter='url(%23b)' href='data:image/webp;base64,UklGRowAAABXRUJQVlA4IIAAAACQBQCdASogABIAPrVOn0onJCKhsAgA4BaJQBbfXor/AYD9LuyskUtub7sAXIs+Kdu5TEGeAAD+9wcyeNf16A/rBBQiMLdAQtWKGbHmL+sU5J9yWoBjYoElLnOv0nq2eZd0U4ZxS3ypdHIxi6Kg8OWvgWZZTF4toSfKmNRgTAAAAA=='/></svg>")`;

const artStyle = {
  // One URL for the CSS background and the HeroArt texture, so the painting downloads once and
  // doubles as the no-WebGL fallback. Below 768px the class list swaps in the 900w cut.
  "--hero-art": `url(${HERO_SRC}), ${HERO_PLACEHOLDER}`,
  "--hero-art-sm": `url(${HERO_SRC_SM})`,
  opacity: "calc(var(--art) * 0.95)",
  maskImage: ART_MASK,
  WebkitMaskImage: ART_MASK,
} as CSSProperties;

const scrimStyle: CSSProperties = {
  background:
    "linear-gradient(to bottom, rgba(246,245,242,0.86) 0%, rgba(246,245,242,0.30) 15%, rgba(246,245,242,0.10) 34%, rgba(246,245,242,0.06) 56%, rgba(246,245,242,0.34) 78%, rgba(246,245,242,0.86) 100%)",
};

export function Hero() {
  // The painting is the LCP element, but its URL only reaches the page inside the inline custom
  // property above, which the preload scanner cannot see: unhinted, it is requested only once the
  // CSS has been applied. The media queries are exact complements of the md breakpoint, so each
  // viewport fetches only the cut its CSS will use. React emits these after the viewport meta
  // (or as a Link header), so a phone evaluates them against its real width.
  preload(HERO_SRC, { as: "image", fetchPriority: "high", media: "(min-width: 768px)" });
  preload(HERO_SRC_SM, { as: "image", fetchPriority: "high", media: "(max-width: 767.98px)" });

  // The painting is desktop-only: below 768px the canvas keeps its CSS background and the
  // WebGL system is never built (and is torn down if the viewport shrinks across the line).
  const art = useMotionSystem(HeroArt, {}, [], "(min-width: 768px)");
  const vig = useMotionSystem(Vignettes, {});

  return (
    <section
      id="top"
      data-screen-label="Hero"
      className="relative overflow-hidden border-b border-line2 px-6 pb-[118px] md:px-10"
    >
      <canvas
        ref={art("artCv")}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 left-0 aspect-[1376/768] w-full bg-cover bg-top bg-no-repeat max-md:bg-[image:var(--hero-art-sm)] md:bg-[image:var(--hero-art)]"
        style={artStyle}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={scrimStyle} />
      <GridTexture variant="hero" />

      <div className="relative mx-auto max-w-[1280px] pt-24 md:pt-[150px]">
        <div className="mx-auto max-w-[880px] text-center">
          {/* Hard break: the headline is always these two lines. */}
          <h1 className="m-0 text-[clamp(38px,4.9vw,76px)] leading-none font-normal tracking-[-0.038em] text-balance">
            {hero.titleLines[0]}
            <br />
            {hero.titleLines[1]}
          </h1>
          <p className="mx-auto mt-[30px] mb-0 max-w-[620px] text-[19px] leading-[1.55] text-pretty text-ink-2">
            {hero.standfirst}
          </p>
          <div className="mt-[38px] flex flex-wrap justify-center gap-3">
            <Button href={hero.primary.href} variant="primary">
              {hero.primary.label}
            </Button>
            <Button href={hero.secondary.href} variant="secondary">
              {hero.secondary.label}
            </Button>
          </div>
        </div>

        {/* min(272px,100%) is the reference's 272px everywhere it fits; it only differs below
            ~320px, where a bare 272px track would overflow the column. */}
        <HairlineGrid className="mt-[72px] grid-cols-1 min-[900px]:grid-cols-[repeat(auto-fit,minmax(272px,1fr))] md:mt-[112px]">
          {hero.cards.map((card) => (
            <div
              key={card.vig}
              className="bg-[rgba(255,255,255,0.93)] px-[26px] pt-6 pb-[30px] backdrop-blur-[3px]"
            >
              {/* Empty on purpose: Vignettes builds its SVG in here. Fixed 150px, no shift.
                  Decorative, so hidden from assistive tech: the eyebrow, title and body below
                  say what it shows, and its SVG text is only chart labels. */}
              <div ref={vig(card.vig)} data-vig={card.vig} aria-hidden="true" className="mb-[26px] h-[150px]" />
              <Eyebrow>{card.eyebrow}</Eyebrow>
              <h3 className="mt-[9px] mb-0 text-[18px] font-normal tracking-[-0.022em]">{card.title}</h3>
              <p className="mt-[11px] mb-0 text-[14.5px] leading-[1.5] text-pretty text-sec">{card.body}</p>
            </div>
          ))}
        </HairlineGrid>
      </div>
    </section>
  );
}
