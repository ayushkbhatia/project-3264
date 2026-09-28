import { SmartLink } from "@/components/home/primitives";
import { hero } from "@/content/playbooks";
import { HeroVideo } from "./HeroVideo";

// Video hero (#top), specs/01. The video fades in over #0A0A0A under a four-stop scrim; the
// title and buttons sit centred near the top, the figure in the footage low in the frame
// (object-position: bottom keeps it there on wide and short viewports).
//
// Height: the reference's calc(100vh - 68px) fills the first screen under the sticky header.
// svh instead of vh so that on phones it fills the screen the visitor actually sees, with the
// address bar showing; on desktop the two are the same.
//
// Focus rings are #F4F3F0 here, not the accent (specs/08).

const ring = "focus-visible:outline-[#F4F3F0]";

export function Hero() {
  return (
    <section
      id="top"
      data-screen-label="Hero"
      className="relative flex min-h-[calc(100svh-68px)] flex-col overflow-hidden bg-[#0A0A0A] text-[#F4F3F0]"
    >
      <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden">
        <HeroVideo />
        {/* Without script the controller never reveals the video: show its poster. */}
        <noscript>
          <style>{"[data-hero-video]{opacity:1!important}"}</style>
        </noscript>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.55)_0%,rgba(10,10,10,0.15)_40%,rgba(10,10,10,0.35)_75%,rgba(10,10,10,0.92)_100%)]" />
      <div className="relative mx-auto box-border flex w-full max-w-[1280px] flex-1 flex-col items-center justify-start px-10 pt-[clamp(56px,9vh,112px)] pb-14 text-center max-[479.98px]:px-5">
        <h1 className="m-0 max-w-[1000px] text-[clamp(34px,4.2vw,60px)] leading-[0.98] font-normal tracking-[-0.04em] text-balance">
          {hero.titleLines[0]}
          <br />
          {hero.titleLines[1]}
        </h1>
        <div className="mt-[34px] flex flex-wrap justify-center gap-3">
          <a
            href={hero.primary.href}
            className={`inline-flex h-[46px] items-center rounded-[6px] bg-[#F4F3F0] px-6 text-[15px] font-medium tracking-[-0.01em] text-ink hover:bg-white hover:text-ink forced-colors:border ${ring}`}
          >
            {hero.primary.label}
          </a>
          <SmartLink
            href={hero.secondary.href}
            className={`box-border inline-flex h-[46px] items-center rounded-[6px] border border-[rgba(255,255,255,0.28)] bg-[rgba(255,255,255,0.06)] px-6 text-[15px] font-medium tracking-[-0.01em] text-[#F4F3F0] backdrop-blur-[6px] hover:border-[#F4F3F0] hover:text-[#F4F3F0] ${ring}`}
          >
            {hero.secondary.label}
          </SmartLink>
        </div>
      </div>
    </section>
  );
}
