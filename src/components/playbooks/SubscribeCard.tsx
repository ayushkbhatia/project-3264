import Image from "next/image";
import { subscribeWash } from "./media";
import { SubscribeForm } from "./SubscribeForm";
import type { SubscribeList } from "./subscribe";

/**
 * The sign-up card on the red wash (Playbooks specs/04; the Essays index has the same card with
 * its own copy). Content-box, as in both references: its 480px flex basis excludes its padding,
 * so beside the platform card on Playbooks it is the wider of the two, and alone on Essays it
 * fills its row.
 *
 * `heading` is the title's level in the page's outline: h3 under the Playbooks library's h2, h2
 * on the Essays index.
 */
export function SubscribeCard({
  title,
  body,
  list,
  sizes,
  heading: Heading = "h3",
}: {
  title: string;
  body: string;
  list: SubscribeList;
  /** The painting's rendered width, for next/image. */
  sizes: string;
  heading?: "h2" | "h3";
}) {
  return (
    <div className="relative box-content min-w-0 flex-[1_1_480px] overflow-hidden rounded-[20px] bg-[#B8321F] p-[clamp(28px,3vw,40px)] text-white">
      <Image src={subscribeWash} alt="" fill sizes={sizes} className="object-cover object-[center_30%]" />
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(74,16,10,0.62)_0%,rgba(74,16,10,0.34)_55%,rgba(74,16,10,0.06)_100%)]" />
      <div className="relative">
        <Heading className="m-0 text-[24px] leading-[1.2] font-normal tracking-[-0.025em] text-white [text-shadow:0_1px_14px_rgba(74,16,10,0.35)]">
          {title}
        </Heading>
        <p className="mt-2 mb-0 text-[15px] leading-[1.5] text-wrap text-white/92 [text-shadow:0_1px_12px_rgba(74,16,10,0.35)]">
          {body}
        </p>
        <SubscribeForm list={list} />
      </div>
    </div>
  );
}
