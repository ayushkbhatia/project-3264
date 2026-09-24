import Image from "next/image";
import { footerImage } from "@/content/home";
import footerNocturne from "../../../public/img/footer-nocturne.png";
import { Button, Wordmark } from "./primitives";

export function FooterImage() {
  return (
    <section data-screen-label="Footer image" className="relative border-t border-line2 px-6 md:px-10">
      <div className="mx-auto max-w-[1280px] pt-[72px] md:pt-24">
        {/* DEVIATION (phones): the reference never considered widths under 580px, where the
            1672/941 frame drops below 300px tall and the centred copy runs into the wordmark.
            There the frame holds a fixed 300px instead (at 580px the ratio already gives ~298px,
            so there is no jump), and the crop that causes is shifted right so the figure stays
            in frame. The image is exactly 1672×941, so object-position does nothing wider up.
            Not min-height: through aspect-ratio it would transfer into a 533px min-width. */}
        <div className="relative box-content aspect-[1672/941] overflow-hidden border border-line2 max-[580px]:aspect-auto max-[580px]:h-[300px]">
          {/* sizes is the width the painting is drawn at: the frame's inner width (column minus
              its 1px borders), or the cover width once the frame is pinned to 300px tall.
              Lazy, so the CTAs' jump to #contact can land before it has loaded; the blur
              (generated from the static import) fills the frame until then, positioned like
              the image on phones, where Next's inline 50% would put the figure off-centre.
              Quality 90 is served as AVIF where supported (next.config.ts). */}
          <Image
            src={footerNocturne}
            alt=""
            sizes="(min-width: 1360px) 1278px, (min-width: 768px) calc(100vw - 82px), (min-width: 580px) calc(100vw - 50px), 533px"
            quality={90}
            placeholder="blur"
            className="block h-full w-full object-cover object-center max-sm:object-[85%_50%] max-sm:bg-position-[85%_50%]!"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-full"
            style={{
              background:
                "linear-gradient(to right, rgba(10,14,32,0.74) 0%, rgba(10,14,32,0.66) 62%, rgba(10,14,32,0.16) 88%, rgba(10,14,32,0) 100%)",
            }}
          />
          <div className="absolute top-0 left-0 px-[clamp(28px,5%,80px)] py-[clamp(22px,3.4%,38px)] text-[19px] text-white">
            <Wordmark />
          </div>
          {/* box-content: the reference caps the copy's content box at min(560px,62%) and adds
              the side padding outside it, which is what keeps the h2 on one line at 1440. */}
          <div className="absolute top-1/2 left-0 box-content max-w-[min(560px,62%)] -translate-y-1/2 px-[clamp(28px,5%,80px)]">
            <h2 className="m-0 text-[clamp(30px,3.6vw,54px)] leading-[1.04] font-normal tracking-[-0.034em] text-balance text-white">
              {footerImage.title}
            </h2>
            <Button href={footerImage.cta.href} variant="onImage" className="mt-7">
              {footerImage.cta.label}
            </Button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-6">
          <p className="m-0 max-w-[620px] text-[14.5px] leading-[1.55] text-mut">{footerImage.positioning}</p>
          <span className="text-[13px] tracking-[-0.005em] text-mut">{footerImage.sequence}</span>
        </div>
      </div>
    </section>
  );
}
