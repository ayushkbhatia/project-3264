import Image from "next/image";
import { SmartLink } from "@/components/home/primitives";
import { playbookHref, type Playbook } from "@/content/playbooks";
import { TILE_SIZES, tileImages } from "./media";
import { PlaybookBadge } from "./PlaybookBadge";

/**
 * A playbook tile and its text (specs/05), shared by the category rows and the results.
 *
 * The prototype links only the text; here the whole card is one link (the handoff's
 * "production improvement"), named by its title and described by its one-liner. On hover the
 * title turns accent through the link colour; the one-liner keeps its own grey, as in the
 * reference, and the image is not animated.
 */
export function PlaybookCard({ playbook, idPrefix }: { playbook: Playbook; idPrefix: string }) {
  const id = `${idPrefix}-${playbook.slug}`;
  return (
    <SmartLink
      href={playbookHref(playbook.slug)}
      aria-labelledby={`${id}-name`}
      aria-describedby={`${id}-blurb`}
      className="flex min-w-0 flex-col text-ink hover:text-a"
    >
      <div className="relative aspect-[2/1] overflow-hidden rounded-[14px] bg-[#ECEAE5]">
        <Image
          src={tileImages[playbook.slug]}
          alt=""
          fill
          sizes={TILE_SIZES}
          className="rounded-[14px] object-cover"
        />
        <PlaybookBadge slug={playbook.slug} size="34%" />
      </div>
      <div className="flex flex-col gap-2.5 pt-5">
        <h3 id={`${id}-name`} className="m-0 text-[20px] leading-[1.2] font-normal tracking-[-0.022em]">
          {playbook.name}
        </h3>
        <p id={`${id}-blurb`} className="m-0 text-[15px] leading-[1.55] text-sec">
          {playbook.blurb}
        </p>
      </div>
    </SmartLink>
  );
}
