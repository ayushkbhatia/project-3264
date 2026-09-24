import { industries } from "@/content/home";
import { Section, SectionHeader, SmartLink } from "./primitives";

// Four whole-row links. Hover turns the row's border colour to accent: rows 1–3 draw only a
// top rule, so only that turns; row 4 also draws the bottom rule, so both do.
export function Industries() {
  return (
    <Section id="industries" label="Industries">
      <SectionHeader {...industries} />
      <div className="mt-16">
        {industries.rows.map((row, i) => (
          <SmartLink
            key={row.code}
            href={row.href}
            className={`flex flex-wrap items-baseline gap-x-12 gap-y-3 md:gap-y-12 border-t border-line py-[34px] hover:border-a ${i === industries.rows.length - 1 ? "border-b" : ""}`}
          >
            <div className="flex min-w-0 flex-[1_1_260px] items-baseline gap-[18px]">
              <span className="text-[13px] tracking-[-0.005em] text-mut">{row.code}</span>
              <h3 className="m-0 text-[clamp(24px,2.4vw,34px)] font-normal tracking-[-0.03em]">{row.name}</h3>
            </div>
            <div className="min-w-0 flex-[2_1_360px] text-[16px] leading-[1.55] text-sec">{row.body}</div>
            <div aria-hidden="true" className="ml-auto flex-[0_0_auto] text-[14px] text-mut max-md:hidden">
              &rarr;
            </div>
          </SmartLink>
        ))}
      </div>
    </Section>
  );
}
