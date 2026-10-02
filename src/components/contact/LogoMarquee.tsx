import Image from "next/image";
import { logos } from "@/content/contact";
import { LogoTrack } from "./Motion";

// "Built on": the nine platform marks rolling left, faded at both edges (design_handoff_contact,
// "Logo marquee"). A pure-CSS loop, as the handoff allows: the set is drawn twice and the track
// slides by one set (LogoTrack). The second set is decorative (alt="", aria-hidden), so a screen
// reader hears each mark once.
//
// The marks are the home page's files (the handoff's 880×264 PNGs halved, served as they are);
// at 48px tall each is 160px wide. Eager: the strip sits in the first screen, and as it moves the
// marks that start outside it come into view.

function LogoSet({ copy = false }: { copy?: boolean }) {
  return (
    <div aria-hidden={copy || undefined} className="flex flex-none items-center gap-[18px] pr-[18px]">
      {logos.map((logo) => (
        <Image
          key={logo.alt}
          src={logo.src}
          alt={copy ? "" : logo.alt}
          width={440}
          height={132}
          unoptimized
          loading="eager"
          className="block h-12 w-auto flex-none opacity-[0.78]"
        />
      ))}
    </div>
  );
}

export function LogoMarquee() {
  return (
    <div
      data-logo-strip=""
      className="group mt-4 overflow-hidden [mask-image:linear-gradient(90deg,transparent_0,#000_14%,#000_86%,transparent_100%)]"
    >
      <LogoTrack>
        <LogoSet />
        <LogoSet copy />
      </LogoTrack>
    </div>
  );
}
