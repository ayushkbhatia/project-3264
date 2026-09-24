import { capabilities } from "@/content/home";
import { CapabilitiesSequence } from "./CapabilitiesSequence";
import { ActCopy, CapabilitiesStatic } from "./CapabilitiesStatic";
import { SectionHeader } from "./primitives";

// 02 / Capabilities — the pinned three-act sequence (specs/04-capabilities.md).
//
// The section has no horizontal padding because the pin is full-bleed; the header column
// carries its own gutter. Child order matters to QA: header column, then the track
// (#capabilities > div:nth-child(2)), then the static fallback, then the no-JS rule.
//
// This file stays a server component: the header and the act copy are rendered here and handed
// to the client sequence as nodes, so none of the copy ships in the client bundle.
//
// NO JAVASCRIPT: nothing would ever step the pinned sequence, so a reader would get Assess and
// an empty stage for the whole track, with Build and Run at opacity 0. The <noscript> rule swaps
// in the static acts at every width instead. It never applies when scripts run, so a normal load
// never paints one layout and then swaps to the other.
const NO_JS = "<style>#capabilities [data-ph-track]{display:none!important}#capabilities [data-caps-static]{display:block!important}</style>";

export function Capabilities() {
  return (
    <section
      id="capabilities"
      data-screen-label="Capabilities"
      // The bottom padding belongs to the static fallback (CapabilitiesStatic), so it goes with it.
      className="border-b border-line2 pt-[88px] md:pt-[130px]"
    >
      <div className="mx-auto box-content max-w-[1280px] px-6 md:px-10">
        <SectionHeader
          eyebrow={capabilities.eyebrow}
          title={capabilities.title}
          standfirst={capabilities.standfirst}
        />
      </div>

      <CapabilitiesSequence
        rail={capabilities.acts.map((act) => act.rail)}
        panels={capabilities.acts.map((act) => (
          <ActCopy key={act.num} act={act} pinned />
        ))}
      />

      <CapabilitiesStatic />

      <noscript dangerouslySetInnerHTML={{ __html: NO_JS }} />
    </section>
  );
}
