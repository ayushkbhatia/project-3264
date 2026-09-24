import { playbooks } from "@/content/home";
import { Eyebrow, Section, SmartLink, sectionTitle } from "./primitives";

export function Playbooks() {
  return (
    <Section id="playbooks" label="Playbooks" columnClassName="flex flex-wrap gap-x-[72px] gap-y-10 md:gap-y-[72px]">
      <div className="min-w-0 flex-[1_1_280px]">
        <Eyebrow>{playbooks.eyebrow}</Eyebrow>
        <h2 className={sectionTitle}>{playbooks.title}</h2>
      </div>
      <div className="min-w-0 flex-[2_1_540px]">
        {playbooks.items.map((item, i) => (
          <SmartLink
            key={item.title}
            href={item.href}
            className={`block border-t border-line py-[26px] hover:border-a ${i === playbooks.items.length - 1 ? "border-b" : ""}`}
          >
            <Eyebrow>{item.eyebrow}</Eyebrow>
            <h3 className="mt-3 mb-0 text-[20px] font-normal tracking-[-0.024em]">{item.title}</h3>
          </SmartLink>
        ))}
      </div>
    </Section>
  );
}
