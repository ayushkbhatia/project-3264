import Image from "next/image";
import { SmartLink } from "@/components/home/primitives";
import { platform, subscribe } from "@/content/playbooks";
import { CTA_SIZES, platformWash } from "./media";
import { SubscribeCard } from "./SubscribeCard";

// The two CTA cards under the carousel (specs/04): subscribe on a red wash, the Private Credit
// platform on a peach one. Side by side above ~1060px of column, stacked below.
//
// The subscribe card (SubscribeCard.tsx) runs on content-box sizing, as in the reference (its
// inline styles never ask for border-box, while the platform card's do): its 480px flex basis
// excludes its padding, so at 1440 it is 670px wide to the platform card's 590. Kept: that is
// the design as drawn.

export function LibraryCtas() {
  return (
    <section data-screen-label="Library CTAs" className="px-10 pt-14 max-[479.98px]:px-5">
      <div className="mx-auto flex max-w-[1280px] flex-wrap gap-5">
        <SubscribeCard title={subscribe.title} body={subscribe.body} list="playbooks" sizes={CTA_SIZES} />

        <div className="relative box-border flex min-w-0 flex-[1_1_480px] overflow-hidden rounded-[20px] bg-[#E9C9B8] p-[clamp(28px,3vw,40px)]">
          <Image src={platformWash} alt="" fill sizes={CTA_SIZES} className="object-cover object-[center_40%]" />
          <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(248,246,240,0.74)_0%,rgba(248,246,240,0.46)_55%,rgba(248,246,240,0.08)_100%)]" />
          <div className="relative min-w-0 flex-auto">
            <h3 className="m-0 text-[24px] leading-[1.2] font-normal tracking-[-0.025em]">{platform.title}</h3>
            <p className="mt-2.5 mb-0 max-w-[440px] text-[15px] leading-[1.55] text-[#2C2B27]">{platform.body}</p>
            <SmartLink
              href={platform.link.href}
              className="mt-5 inline-flex items-center gap-2 border-b border-[rgba(20,20,18,0.3)] pb-0.5 text-[14.5px] tracking-[-0.01em] text-ink hover:border-a hover:text-a"
            >
              {/* one flex item, so the arrow keeps its word space rather than the 8px gap */}
              <span>
                {platform.link.label} <span aria-hidden="true">→</span>
              </span>
            </SmartLink>
          </div>
        </div>
      </div>
    </section>
  );
}
