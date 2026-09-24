import Image from "next/image";
import { stack } from "@/content/home";
import { Eyebrow } from "./primitives";

// Nine vendor marks, 50px tall, contained: about 167×50 at desktop widths. The files are the
// handoff's 880×264 PNGs halved (scripts/resize-logos.mjs), still sharp on 2× and 3× screens,
// and are served as-is rather than through the image optimizer. Mark-usage rights to be
// confirmed before launch.
export function Stack() {
  return (
    <section data-screen-label="Stack" className="border-b border-line2 px-6 py-[74px] md:px-10">
      <div className="mx-auto max-w-[1280px]">
        <Eyebrow>{stack.label}</Eyebrow>
        <div className="mt-[30px] grid grid-cols-3 items-center gap-x-5 gap-y-3.5 md:grid-cols-5">
          {stack.logos.map((logo) => (
            <Image
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              width={440}
              height={132}
              unoptimized
              className="h-[50px] w-full object-contain opacity-[0.78]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
