import { capabilities } from "@/content/home";

type Act = (typeof capabilities.acts)[number];

/**
 * One act's left-column copy: meta row, h3, p, ul — in exactly that order. PlatformSequence's
 * phLayout() walks this structure (querySelector("p") / ("ul")) to narrow the column, so do not
 * wrap or reorder these four elements.
 *
 * `pinned`: rendered inside the pinned sequence, where phLayout() owns the p's font-size and
 * margin and the ul's display. Those three go in as inline initial values (the module rewrites
 * them inline), read from custom properties that CapabilitiesSequence sets per layout band;
 * everywhere else they are ordinary classes.
 */
export function ActCopy({ act, pinned = false }: { act: Act; pinned?: boolean }) {
  return (
    <>
      <div className="flex max-w-[440px] items-baseline justify-between text-[13px] tracking-[-0.005em] text-mut">
        <span className="text-a">{act.num}</span>
        <span>{act.duration}</span>
      </div>
      <h3 className="mt-6 mb-0 text-[clamp(28px,2.6vw,38px)] leading-[1.06] font-normal tracking-[-0.03em]">
        {act.title}
      </h3>
      <p
        className={`max-w-[460px] leading-[1.58] text-sec ${pinned ? "" : "mt-[18px] mb-0 text-[16.5px]"}`}
        style={pinned ? { margin: "var(--ph-p-m)", fontSize: "var(--ph-p-fs)" } : undefined}
      >
        {act.body}
      </p>
      <ul
        className={`mt-[30px] mb-0 list-none gap-[10px] p-0 max-w-[440px] text-[14.5px] text-list ${pinned ? "" : "grid"}`}
        style={pinned ? { display: "var(--ph-ul)" } : undefined}
      >
        {act.list.map((item) => (
          <li key={item} className="border-t border-line2 pt-[10px]">
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

/**
 * Wherever the pinned pane would not fit — below 768px, and on viewports too short for it
 * (phones held sideways, zoomed small laptops) — PlatformSequence is not mounted and the three
 * acts stack as plain blocks. It is also what shows with JavaScript off (Capabilities.tsx).
 *
 * DESIGN NOTE: this is the one layout on the page that is not taken from the reference
 * (specs/04-capabilities.md, "Mobile fallback"). It is built from the reference's own
 * vocabulary — the pinned panels' type, the --line rule — and should go to the designer for
 * review. From 768px it takes the section header's column (40px gutter, 1280px max), so its
 * copy lines up with the h2 above it.
 *
 * Both branches are server-rendered and switched with CSS, so there is no hydration mismatch
 * and nothing shifts when the client decides which one applies. The hide class is the same
 * media query as PINNED in CapabilitiesSequence.tsx; change them together. pb-12: the last
 * block ends on 40px, and 48px more restores the section's 88px rhythm.
 */
export function CapabilitiesStatic() {
  return (
    <div
      data-caps-static=""
      className="mx-auto mt-14 box-content max-w-[1280px] px-6 pb-12 md:px-10 [@media(min-width:940px)_and_(min-height:500px),(min-width:768px)_and_(min-height:540px)]:hidden"
    >
      {capabilities.acts.map((act) => (
        <div key={act.num} className="border-t border-line pt-8 pb-10">
          <ActCopy act={act} />
        </div>
      ))}
    </div>
  );
}
