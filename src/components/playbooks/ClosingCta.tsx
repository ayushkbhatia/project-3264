import Image from "next/image";
import { SmartLink } from "@/components/home/primitives";
import { closing } from "@/content/playbooks";
import { CLOSING_SIZES, closingWash } from "./media";

// Closing tile (specs/07), shown while browsing and filtering: the valley wash under a pale
// veil, the pitch left and the button bottom right (under the text when the row is narrow).
//
// Content-box, as in the reference: the tile's 1280px max-width is its content width, and its
// padding and border sit outside it. So it spans the section's full inner width (1360px at
// 1440, 40px wider each side than the column above it) and tops out at 1426px. Kept: that
// breakout is the design as drawn (screenshots/desktop-1440/09-closing.png).

export function ClosingCta() {
  return (
    <section data-screen-label="Closing" className="border-b border-line2 px-10 py-[118px] max-[479.98px]:px-5">
      <div className="relative mx-auto box-content flex max-w-[1280px] flex-wrap items-end justify-between gap-12 overflow-hidden rounded-[20px] border border-line bg-[#E8E2D2] px-[clamp(32px,5vw,72px)] py-[clamp(48px,6vw,88px)]">
        <Image src={closingWash} alt="" fill sizes={CLOSING_SIZES} className="object-cover object-[center_60%]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(248,246,240,0.7)_0%,rgba(248,246,240,0.5)_60%,rgba(248,246,240,0.35)_100%)]" />
        <div className="relative min-w-0 flex-[3_1_480px]">
          <div className="text-[13px] tracking-[-0.005em] text-[#2C2B27]">{closing.label}</div>
          <h2 className="mt-[22px] mb-0 max-w-[760px] text-[clamp(32px,3.6vw,52px)] leading-[1.04] font-normal tracking-[-0.035em] text-balance">
            {closing.titleLines[0]}
            <br />
            {closing.titleLines[1]}
          </h2>
          <p className="mt-5 mb-0 max-w-[560px] text-[16.5px] leading-[1.6] text-[#2C2B27]">{closing.body}</p>
        </div>
        <div className="relative flex flex-col items-start gap-3">
          <SmartLink
            href={closing.cta.href}
            className="inline-flex h-[46px] items-center rounded-[6px] bg-ink px-6 text-[15px] font-medium tracking-[-0.01em] whitespace-nowrap text-white hover:bg-a hover:text-white forced-colors:border"
          >
            {closing.cta.label}
          </SmartLink>
        </div>
      </div>
    </section>
  );
}
