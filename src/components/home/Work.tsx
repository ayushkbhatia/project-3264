import { work } from "@/content/home";
import { Eyebrow, HairlineGrid, PlaceholderNote, Section, SectionHeader } from "./primitives";

export function Work() {
  return (
    <Section id="work" label="Selected engagements">
      <SectionHeader {...work} />
      <HairlineGrid className="mt-[60px] grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))]">
        {work.cases.map((c) => (
          <article key={c.title} className="bg-white px-8 pt-9 pb-10 max-sm:px-6">
            <Eyebrow>{c.sector}</Eyebrow>
            <h3 className="mt-6 mb-0 text-[26px] leading-[1.2] font-normal tracking-[-0.028em]">{c.title}</h3>
            <p className="mt-4 mb-0 text-[15.5px] leading-[1.58] text-sec">{c.body}</p>
            {/* A figure never breaks mid-value ("94, / continuously"): on a narrow phone card the
                label wraps instead, and a value too long to share even a wrapped label's line
                drops beneath it, right-aligned, rather than running out of the card. (From
                1024px the cards are over 400px wide; there the row is the reference's exactly.) */}
            <dl className="mt-[30px] mb-0 grid">
              {c.rows.map((row, i) => (
                <div
                  key={row.label}
                  className="flex flex-wrap items-baseline justify-between gap-x-5 border-t border-line2 py-[13px]"
                >
                  <dt className="text-[14px] text-list max-sm:flex-[1_1_7rem]">{row.label}</dt>
                  <dd
                    className={`m-0 text-right text-[14.5px] whitespace-nowrap tabular-nums max-lg:ml-auto ${i === 2 ? "text-a" : "text-ink"}`}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </HairlineGrid>
      <PlaceholderNote className="mt-[22px] leading-[1.6]">{work.note}</PlaceholderNote>
    </Section>
  );
}
