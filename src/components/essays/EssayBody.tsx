import Image, { type StaticImageData } from "next/image";
import { Fragment, type ReactNode } from "react";
import { SmartLink } from "@/components/home/primitives";
import { Blocks } from "@/components/playbooks/article/blocks";
import { categoryById, playbookBySlug } from "@/content/playbooks";
import { page, relatedLines, type EssayFront } from "@/content/essays";
import { plainText, type EssayBlock, type EssayDocument, type EssayInline, type EssaySection } from "./markdown";
import { HERO_SIZES } from "./media";

// An essay's main column after the hero (design_handoff_essays, "Body blocks"): the
// introduction, the sections, and the sources, set with the essay prototypes' exact values. The
// dark "Talk to the team" band closes the middle section and the related-playbook card the
// last, both the playbook pages' own blocks (components/playbooks/article/blocks.tsx), which the
// essay prototypes share byte for byte.

const mono = "font-mono";

/* ----------------------------------------------------------------- inline */

function Refs({ n }: { n: number[] }) {
  return (
    <sup className={`${mono} ml-px text-[10px] leading-[0]`}>
      {n.map((k, i) => (
        <Fragment key={k}>
          {i ? "," : null}
          <a href={`#ref-${k}`} aria-label={`Source ${k}`} className="px-px text-a">
            {k}
          </a>
        </Fragment>
      ))}
    </sup>
  );
}

function Inline({ nodes }: { nodes: EssayInline[] }) {
  return (
    <>
      {nodes.map((node, i) => {
        switch (node.t) {
          case "text":
            return <Fragment key={i}>{node.v}</Fragment>;
          case "strong":
            return (
              <strong key={i} className="font-medium text-ink">
                <Inline nodes={node.c} />
              </strong>
            );
          case "em":
            return (
              <em key={i} className="italic">
                <Inline nodes={node.c} />
              </em>
            );
          case "code":
            return (
              <code key={i} className={`${mono} rounded-[4px] bg-[#EFEDE8] px-1 py-px text-[0.86em] text-ink`}>
                {node.v}
              </code>
            );
          case "refs":
            return <Refs key={i} n={node.n} />;
        }
      })}
    </>
  );
}

/* ----------------------------------------------------------------- blocks */

/**
 * The panel tables and code sit in: the essay's painting under a paper veil, a 12px frame, and
 * a white sheet on it.
 */
function Panel({ image, children }: { image: StaticImageData; children: ReactNode }) {
  return (
    <figure className="mt-8 mb-0">
      <div className="relative overflow-hidden rounded-[16px] border border-[rgba(20,20,18,0.06)] bg-wash p-3">
        <Image src={image} alt="" fill sizes={HERO_SIZES} className="object-cover" />
        <div aria-hidden="true" className="absolute inset-0 bg-[rgba(251,250,248,0.72)]" />
        <div className="relative rounded-[11px] bg-[rgba(255,255,255,0.93)] px-4 pt-3.5 pb-2 shadow-[0_12px_32px_-20px_rgba(20,20,18,0.3)]">
          {children}
        </div>
      </div>
    </figure>
  );
}

/** The sheet's content scrolls sideways when wider than the column, so the scrolling box takes
    focus, with a name, for keyboard readers. */
const scroller = "overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-a";

function Table({ block, image }: { block: Extract<EssayBlock, { t: "table" }>; image: StaticImageData }) {
  const cols = block.head.length;
  return (
    <Panel image={image}>
      <div className={scroller} tabIndex={0} role="region" aria-label={`Table: ${block.head.map(plainText).join(", ")}`}>
        <table className="w-full border-collapse text-left" style={{ minWidth: `min(680px, ${cols * 180}px)` }}>
          <thead>
            <tr>
              {block.head.map((cell, i) => (
                <th key={i} className="border-b border-ink pr-3.5 pb-2 align-bottom text-[11.5px] leading-[1.4] font-medium text-sec">
                  <Inline nodes={cell} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, i) => (
                  <td
                    key={i}
                    className={`border-b border-rule-2 py-[11px] pr-3.5 align-top text-[13.5px] leading-[1.5] ${i === 0 ? "font-medium text-ink" : "font-normal text-ink-2"}`}
                  >
                    <Inline nodes={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function Code({ block, image }: { block: Extract<EssayBlock, { t: "code" }>; image: StaticImageData }) {
  return (
    <Panel image={image}>
      <pre className={`${scroller} m-0 pt-0.5 pb-2 ${mono} text-[11.5px] leading-[1.7] text-ink`} tabIndex={0} aria-label={`${block.lang ? block.lang.toUpperCase() + " " : ""}example`}>
        <code>{block.lines.map((line) => line || " ").join("\n")}</code>
      </pre>
    </Panel>
  );
}

function Block({ block, image, lede }: { block: EssayBlock; image: StaticImageData; lede?: boolean }) {
  switch (block.t) {
    case "p":
      return lede ? (
        <p className="mt-[18px] mb-0 text-[19px] leading-[1.65] text-ink">
          <Inline nodes={block.c} />
        </p>
      ) : (
        <p className="mt-[18px] mb-0 text-[17px] leading-[1.75] text-ink-2">
          <Inline nodes={block.c} />
        </p>
      );
    case "ul":
      return (
        <ul className="mt-[18px] mb-0 grid list-disc gap-2.5 pl-5 text-[17px] leading-[1.7] text-ink-2">
          {block.items.map((item, i) => (
            <li key={i} className="pl-0.5 text-pretty">
              <Inline nodes={item} />
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="mt-5 mb-0 grid list-none gap-3 p-0">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-baseline gap-3.5">
              <span className={`min-w-6 flex-none ${mono} text-[12px] text-mut`}>{String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0 text-[17px] leading-[1.7] text-pretty text-ink-2">
                <Inline nodes={item} />
              </span>
            </li>
          ))}
        </ol>
      );
    case "table":
      return <Table block={block} image={image} />;
    case "code":
      return <Code block={block} image={image} />;
  }
}

/* ---------------------------------------------------------------- sections */

function Section({ section, image, children }: { section: EssaySection; image: StaticImageData; children?: ReactNode }) {
  return (
    <section id={section.id} data-pb-anchor="" data-screen-label={section.label} className="pt-16">
      {section.num ? <div className={`mb-2.5 ${mono} text-[11.5px] text-mut`}>{section.num}</div> : null}
      <h2 className="m-0 text-[clamp(24px,2.3vw,30px)] leading-[1.15] font-normal tracking-[-0.028em] text-balance">{section.label}</h2>
      {section.blocks.map((block, i) => (
        <Block key={i} block={block} image={image} />
      ))}
      {children}
    </section>
  );
}

function Sources({ sources }: { sources: EssayDocument["sources"] }) {
  return (
    <section id="sources" data-pb-anchor="" data-screen-label="Sources" className="pt-[72px]">
      <h2 className="m-0 text-[19px] leading-[1.3] font-medium tracking-[-0.018em]">{page.sourcesLabel}</h2>
      <ol className="mt-4 mb-0 list-none border-t border-ink p-0">
        {sources.map((s) => (
          <li key={s.n} id={`ref-${s.n}`} data-pb-anchor="" className="flex gap-3.5 border-b border-rule-2 py-3">
            <span className={`w-[22px] flex-none pt-0.5 ${mono} text-[11px] text-mut`}>{s.n}</span>
            <span className="min-w-0 text-[13.5px] leading-[1.6] [overflow-wrap:anywhere] text-sec">
              <Inline nodes={s.text} />
              {s.url ? (
                <>
                  {" "}
                  <SmartLink href={s.url} className="text-ink underline decoration-[rgba(20,20,18,0.3)] underline-offset-2 hover:text-a hover:decoration-a">
                    {s.host}
                  </SmartLink>
                </>
              ) : null}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function EssayBody({
  front,
  doc,
  image,
  cta,
}: {
  front: EssayFront;
  doc: EssayDocument;
  image: StaticImageData;
  cta: { label: string; href: string };
}) {
  const { sections } = doc;
  // The band closes the middle section (index ⌊n/2⌋ − 1), the related card the last.
  const band = Math.floor(sections.length / 2) - 1;
  const playbook = playbookBySlug(front.related)!;
  const ctx = { figures: {}, cta };
  return (
    <>
      <section id="intro" data-screen-label="Introduction" className="pt-10">
        {doc.intro.map((block, i) => (
          <Block key={i} block={block} image={image} lede={i === 0 && block.t === "p"} />
        ))}
      </section>
      {sections.map((section, k) => (
        <Section key={section.id} section={section} image={image}>
          {k === band ? <Blocks blocks={[{ type: "midCta", title: page.midBand.title, text: page.midBand.text }]} ctx={ctx} /> : null}
          {k === sections.length - 1 ? (
            <Blocks
              blocks={[
                {
                  type: "related",
                  slug: playbook.slug,
                  label: `${page.relatedLabel} · ${categoryById(playbook.category).label}`,
                  title: playbook.name,
                  text: relatedLines[playbook.slug],
                  cta: page.relatedCta,
                },
              ]}
              ctx={ctx}
            />
          ) : null}
        </Section>
      ))}
      <Sources sources={doc.sources} />
    </>
  );
}
