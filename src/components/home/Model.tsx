import { model } from "@/content/home";
import { Eyebrow, Section, sectionTitle, standfirst } from "./primitives";

export function Model() {
  return (
    <Section id="model" label="Engagement model" columnClassName="flex flex-wrap gap-x-[72px] gap-y-10 md:gap-y-[72px]">
      <div className="min-w-0 flex-[1_1_280px]">
        <Eyebrow>{model.eyebrow}</Eyebrow>
        <h2 className={sectionTitle}>{model.title}</h2>
        <p className={`${standfirst} mt-5 max-w-[400px]`}>{model.standfirst}</p>
      </div>
      <dl className="m-0 min-w-0 flex-[2_1_540px]">
        {model.rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex flex-wrap gap-x-10 gap-y-2 md:gap-y-10 border-t border-line py-[26px] ${i === model.rows.length - 1 ? "border-b" : ""}`}
          >
            <dt className="flex-[1_1_180px] text-[15px] tracking-[-0.01em] text-mut">{row.label}</dt>
            <dd className="m-0 flex-[3_1_340px] text-[17px] leading-[1.5] text-ink-2">{row.value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
