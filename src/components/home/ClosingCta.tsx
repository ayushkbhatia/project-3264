import { closing } from "@/content/home";
import { Button, GridTexture } from "./primitives";

// DEVIATION: the reference also gives this section a bottom border, which stacks on the footer
// image's top border into a 2px rule, the only doubled hairline on the page. The footer image's
// border alone divides the two, so everything below sits 1px higher than in the reference.
export function ClosingCta() {
  return (
    <section
      id="contact"
      data-screen-label="Closing CTA"
      className="relative overflow-hidden px-6 pt-[104px] pb-[112px] md:px-10 md:pt-[150px] md:pb-[160px]"
    >
      <GridTexture variant="closing" />
      <div className="relative mx-auto max-w-[1280px]">
        <h2 className="m-0 max-w-[900px] text-[clamp(34px,4.6vw,68px)] leading-[1.02] font-normal tracking-[-0.038em] text-balance">
          {closing.title}
        </h2>
        <div className="mt-11 flex flex-wrap items-end gap-x-14 gap-y-8 md:gap-y-14">
          <p className="m-0 max-w-[480px] flex-[1_1_420px] text-[17px] leading-[1.6] text-sec">{closing.standfirst}</p>
          <Button href={closing.cta.href} variant="primaryLarge">
            {closing.cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
