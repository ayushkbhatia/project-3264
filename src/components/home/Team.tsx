import { team } from "@/content/home";
import { PlaceholderNote, Section, SectionHeader } from "./primitives";

// PLACEHOLDER: roles only. Names, portraits and biographies are to be supplied; the hatch
// marks where each portrait goes. Keep the note until the real content lands.
export function Team() {
  return (
    <Section id="company" label="Team">
      <SectionHeader {...team} />
      <ul className="m-0 mt-[60px] grid list-none grid-cols-2 min-[900px]:grid-cols-[repeat(auto-fit,minmax(168px,1fr))] gap-7 p-0">
        {team.people.map((person, i) => (
          <li key={i}>
            <div
              className="box-content flex aspect-[4/5] items-end border border-line p-4"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(20,20,18,0.06) 0 1px, transparent 1px 9px)",
              }}
            >
              <span className="text-[12.5px] tracking-[-0.005em] text-mut">{team.portraitLabel}</span>
            </div>
            <h3 className="mt-4 mb-0 text-[17px] font-normal tracking-[-0.02em]">{person.role}</h3>
            <div className="mt-[5px] text-[14px] text-mut">{person.discipline}</div>
          </li>
        ))}
      </ul>
      <PlaceholderNote className="mt-6">{team.note}</PlaceholderNote>
    </Section>
  );
}
