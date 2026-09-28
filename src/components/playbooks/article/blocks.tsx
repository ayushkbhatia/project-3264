import Image from "next/image";
import { Fragment, type ReactNode } from "react";
import { SmartLink } from "@/components/home/primitives";
import { closingWash } from "@/components/playbooks/media";
import { PlaybookIcon } from "@/components/playbooks/PlaybookBadge";
import { Faq } from "./Faq";
import { cx, monoLabel } from "./figure";
import type { Block, Rich } from "./types";

// The article's building blocks, set with the reference's exact values
// (design_handoff_covenant_watch/Covenant Watch.dc.html; its README lists most of them under
// "Shared components", but where the two differ the prototype's markup is followed). The
// element structure mirrors the prototype's too, inline spans included: several blocks get
// their line heights from a span sitting in a 16px line box, as in the reference.

/** Section eyebrow: "01 / The work today". */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="font-mono text-[11.5px] text-mut">{children}</div>;
}

/** Section h2. After an eyebrow it sits 12px under it and balances its lines. */
export function SectionTitle({ children, afterEyebrow }: { children: ReactNode; afterEyebrow: boolean }) {
  return (
    <h2
      className={cx(
        "text-[clamp(24px,2.3vw,30px)] leading-[1.15] font-normal tracking-[-0.028em]",
        afterEyebrow ? "mt-3 mb-0 text-balance" : "m-0",
      )}
    >
      {children}
    </h2>
  );
}

function RichText({ item }: { item: Rich }) {
  if (typeof item === "string") return <>{item}</>;
  return (
    <>
      <strong className="font-medium text-ink">{item.lead}</strong>
      {item.text ? ` ${item.text}` : null}
    </>
  );
}

/** An underlined link line with a trailing arrow, hidden from screen readers. */
function Arrow() {
  return <span aria-hidden="true"> →</span>;
}

/** The page CTA as the dark band's light button. */
function MidCta({ title, text, cta, tracked }: { title: string; text: string; cta: { label: string; href: string }; tracked?: boolean }) {
  return (
    <div className="mt-11 box-border flex flex-wrap items-center justify-between gap-x-7 gap-y-4 rounded-[16px] bg-ink px-6 py-[22px] text-[#F4F3F0]">
      <div className="min-w-0 flex-[1_1_340px]">
        <div className="text-[18px] leading-[1.3] tracking-[-0.018em]">{title}</div>
        <p className="mt-1.5 mb-0 text-[13.5px] leading-[1.55] text-[rgba(244,243,240,0.8)]">{text}</p>
      </div>
      <SmartLink
        href={cta.href}
        className={cx(
          "box-border inline-flex h-10 flex-none items-center rounded-[6px] bg-[#F4F3F0] px-[18px] text-[13.5px] font-medium text-ink hover:bg-white hover:text-ink focus-visible:outline-[#F4F3F0] forced-colors:border",
          tracked && "tracking-[-0.005em]",
        )}
      >
        {cta.label}
      </SmartLink>
    </div>
  );
}

/** A related-page card: small label and title left, an underlined link right. */
export function LinkCard({
  label,
  title,
  link,
  className,
}: {
  label: string;
  title: string;
  link: { label: string; href: string };
  className?: string;
}) {
  return (
    <SmartLink
      href={link.href}
      className={cx(
        "box-border flex flex-wrap items-center justify-between gap-x-6 gap-y-2.5 rounded-[16px] border border-rule-2 bg-tile px-5 py-[18px] text-ink hover:border-[rgba(20,20,18,0.3)] hover:text-ink",
        className,
      )}
    >
      <span className="min-w-0 flex-[1_1_300px]">
        <span className="block text-[12px] text-mut">{label}</span>
        <span className="mt-1 block text-[16px] leading-[1.35] tracking-[-0.015em]">{title}</span>
      </span>
      <span className="flex-none border-b border-[rgba(20,20,18,0.3)] pb-px text-[13px]">
        {link.label}
        <Arrow />
      </span>
    </SmartLink>
  );
}

/** The platform card: a painted thumbnail carrying three playbook badges, then its text. */
function PlatformCard({ icons, title, text, link }: Extract<Block, { type: "platformCard" }>) {
  return (
    <SmartLink
      href={link.href}
      className="mt-10 box-border flex flex-wrap items-center gap-x-[22px] gap-y-4 rounded-[16px] border border-rule-2 bg-tile p-3.5 text-ink hover:border-[rgba(20,20,18,0.3)] hover:text-ink"
    >
      <span
        aria-hidden="true"
        className="relative box-border flex h-[88px] flex-[0_0_164px] items-center justify-center gap-2 overflow-hidden rounded-[11px] bg-[#E8E2D2]"
      >
        <Image src={closingWash} alt="" fill sizes="164px" className="object-cover" />
        {icons.map((slug) => (
          <span
            key={slug}
            className="relative box-border flex size-10 items-center justify-center rounded-[11px] border border-[rgba(255,255,255,0.72)] bg-[rgba(250,249,246,0.62)] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_12px_28px_-14px_rgba(20,20,18,0.38)] backdrop-blur-[18px] backdrop-saturate-[1.3]"
          >
            <PlaybookIcon slug={slug} strokeWidth={2.4} className="block size-5" />
          </span>
        ))}
      </span>
      <span className="min-w-0 flex-[1_1_260px]">
        <span className="block text-[16px] leading-[1.35] tracking-[-0.015em]">{title}</span>
        <span className="mt-1 block text-[13.5px] leading-[1.55] text-sec">{text}</span>
        <span className="mt-2.5 inline-block border-b border-[rgba(20,20,18,0.3)] pb-px text-[13px]">
          {link.label}
          <Arrow />
        </span>
      </span>
    </SmartLink>
  );
}

/** §03's step table: four columns from a 600px column, one stacked column (with lane labels
    on every cell) below it. Exposed as a table, its step names as row headers. */
function StepTable({ head, rows, empty = "—" }: Extract<Block, { type: "stepTable" }>) {
  const cols = "@min-[599.5px]:grid-cols-[minmax(0,0.62fr)_repeat(3,minmax(0,1fr))]";
  return (
    <div role="table" className="mt-7 border-t border-rule-2">
      <div
        role="row"
        className={cx(
          "hidden gap-x-[22px] border-b border-ink pt-3 pb-2 text-[11.5px] font-medium text-sec @min-[599.5px]:grid",
          cols,
        )}
      >
        {head.map((h) => (
          <span key={h} role="columnheader">
            {h}
          </span>
        ))}
      </div>
      {rows.map((row) => (
        <div
          key={row.step}
          role="row"
          className={cx(
            "grid grid-cols-[minmax(0,1fr)] items-start gap-2 border-b border-rule-2 py-[13px] @min-[599.5px]:gap-x-[22px] @min-[599.5px]:gap-y-1.5",
            cols,
          )}
        >
          <div role="rowheader" className="text-[13.5px] leading-[1.4] font-medium">
            {row.step}
          </div>
          {row.cells.map((cell, i) => (
            <div key={head[i + 1]} role="cell" className="text-[13.5px] leading-[1.55] text-ink-2">
              <span className="mb-0.5 block text-[11.5px] font-medium text-mut @min-[599.5px]:hidden">{head[i + 1]}</span>
              {/* an empty cell said in words is text, and must pass AA (see --faint-ink) */}
              {cell ?? <span className={empty === "—" ? "text-faint" : "text-faint-ink"}>{empty}</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export type BlockContext = {
  figures: Record<string, ReactNode>;
  cta: { label: string; href: string };
  /** See PlaybookArticle.blockLabels. */
  blockLabels?: boolean;
};

/** A mono label: inline (in the line box of its 16px parent) or a block of its own. */
function Label({ block, className, children }: { block?: boolean; className: string; children: ReactNode }) {
  return block ? <div className={className}>{children}</div> : <span className={className}>{children}</span>;
}

export function RenderBlock({ block, ctx }: { block: Block; ctx: BlockContext }) {
  switch (block.type) {
    case "p":
      return <p className="mt-4 mb-0 text-[15.5px] leading-[1.7] text-ink-2">{block.text}</p>;

    case "roles": {
      const list = (
        <ol className="mt-7 mb-0 list-none border-t border-ink p-0">
          {block.items.map((item, i) => (
            <li key={i} className="flex flex-wrap gap-x-5 gap-y-1 border-b border-rule-2 py-3.5">
              <span className="flex flex-[0_0_210px] items-baseline gap-3">
                <span className="font-mono text-[11px] text-mut">{i + 1}</span>
                <span className="text-[14.5px] leading-[1.45] font-medium tracking-[-0.01em]">{item.role}</span>
              </span>
              <span className="min-w-0 flex-[1_1_280px] text-[14.5px] leading-[1.6] text-pretty text-ink-2">{item.text}</span>
            </li>
          ))}
        </ol>
      );
      return block.note ? (
        <>
          {list}
          <p className="mt-2.5 mb-0 text-[12px] text-mut">{block.note}</p>
        </>
      ) : (
        list
      );
    }

    case "io":
      return (
        <div className="mt-8 flex flex-wrap gap-3">
          {block.cards.map((card) => (
            <div key={card.label} className="box-border min-w-0 flex-[1_1_280px] rounded-[14px] border border-rule-2 bg-tile px-[22px] py-5">
              <Label block={ctx.blockLabels} className={cx(monoLabel, "text-sec")}>
                {card.label}
              </Label>
              <ul className="mt-3 mb-0 grid list-disc gap-1.5 pl-4 text-[13.5px] leading-[1.5] text-ink-2">
                {card.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case "breaks":
      return (
        <ol className="mt-7 mb-0 list-none border-t border-ink p-0">
          {block.items.map((item, i) => (
            <li key={item.title} className="flex gap-4 border-b border-rule-2 py-[22px]">
              <span className="flex-[0_0_22px] pt-1 font-mono text-[11.5px] text-mut">{i + 1}</span>
              <div className="min-w-0 flex-auto">
                <h3 className="m-0 text-[17px] leading-[1.35] font-medium tracking-[-0.015em]">{item.title}</h3>
                <p className="mt-2 mb-0 text-[15px] leading-[1.7] text-ink-2">{item.text}</p>
                {item.figure ? ctx.figures[item.figure] : null}
              </div>
            </li>
          ))}
        </ol>
      );

    case "platformCard":
      return <PlatformCard {...block} />;

    case "stepTable":
      return <StepTable {...block} />;

    case "callout":
      return (
        <div className="mt-7 box-border rounded-[14px] border-[1.5px] border-ink bg-tile px-[22px] py-5">
          <Label block={ctx.blockLabels} className={cx(monoLabel, "text-ink")}>
            {block.label}
          </Label>
          <p className="mt-2 mb-0 text-[14.5px] leading-[1.65] text-ink-2">{block.text}</p>
        </div>
      );

    case "figure":
      return <>{ctx.figures[block.id] ?? null}</>;

    case "h3":
      return (
        <h3
          id={block.id}
          data-pb-anchor={block.id ? "" : undefined}
          className="mt-12 mb-0 text-[19px] leading-[1.3] font-medium tracking-[-0.018em]"
        >
          {block.text}
        </h3>
      );

    case "bullets":
      return (
        <ul className="mt-3.5 mb-0 grid list-disc gap-2.5 pl-[18px] text-[15px] leading-[1.65] text-ink-2">
          {block.items.map((item, i) => (
            <li key={i}>
              <RichText item={item} />
            </li>
          ))}
        </ul>
      );

    case "kept":
      return (
        <ul className="mt-3.5 mb-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-x-7 p-0">
          {block.items.map((item, i) => (
            <li key={item} className="flex gap-3 border-t border-rule-2 py-2.5 text-[14px] leading-[1.5] text-ink-2">
              <span className="flex-none pt-[3px] font-mono text-[10.5px] text-mut">{String(i + 1).padStart(2, "0")}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "hardWe":
      return (
        <div className="mt-4 border-t border-ink">
          {block.items.map((item) => (
            <div key={item.hard} className="flex flex-wrap gap-x-7 gap-y-2 border-b border-rule-2 py-4">
              {[item.hard, item.we].map((text, i) => (
                <div key={i} className="min-w-0 flex-[1_1_260px]">
                  <Label block={ctx.blockLabels} className={cx(monoLabel, i === 0 ? "text-mut" : "text-ink")}>
                    {block.labels[i]}
                  </Label>
                  <p className="mt-[5px] mb-0 text-[14px] leading-[1.6] text-ink-2">{text}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      );

    case "midCta":
      return <MidCta title={block.title} text={block.text} cta={ctx.cta} tracked={block.tracked} />;

    case "linkCard":
      return <LinkCard label={block.label} title={block.title} link={block.link} className="mt-11" />;

    case "rules": {
      const rows = (
        <ol className={cx("mb-0 list-none border-t border-ink p-0", block.status ? "mt-3" : "mt-[22px]")}>
          {block.items.map((item) => (
            <li key={item.date + item.title} className="flex flex-wrap gap-x-6 gap-y-1 border-b border-rule-2 py-3.5">
              <time dateTime={item.date} className="flex-[0_0_96px] pt-0.5 font-mono text-[11.5px]">
                {item.date}
              </time>
              <span className="min-w-0 flex-[1_1_320px]">
                <span className="block text-[14.5px] leading-[1.4] font-medium tracking-[-0.01em]">{item.title}</span>
                <span className="mt-[3px] block text-[14px] leading-[1.6] text-sec">{item.text}</span>
              </span>
            </li>
          ))}
        </ol>
      );
      return (
        <>
          {block.status ? (
            <div className="mt-[22px] flex items-center gap-[9px] font-mono text-[11px] text-sec">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-ink" />
              {block.status}
            </div>
          ) : null}
          {rows}
          {block.note ? (
            <p className={cx("mt-3.5 mb-0 text-[13px] leading-[1.6] text-sec", block.greedyNote && "[text-wrap:wrap]")}>{block.note}</p>
          ) : null}
        </>
      );
    }

    case "terms":
      return (
        <dl className="mt-[22px] mb-0 border-t border-ink">
          {block.items.map((item) => (
            <div key={item.term} className="flex flex-wrap gap-x-6 gap-y-[3px] border-b border-rule-2 py-[13px]">
              <dt className="m-0 flex-[0_0_200px] text-[14px] leading-[1.45] font-medium tracking-[-0.01em]">{item.term}</dt>
              <dd className="m-0 min-w-0 flex-[1_1_280px] text-[14px] leading-[1.6] text-sec">{item.def}</dd>
            </div>
          ))}
        </dl>
      );

    case "updates":
      return (
        <ul className="mt-[22px] mb-0 list-none border-t border-ink p-0">
          {block.items.map((item, i) => (
            <li key={i} className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1.5 border-b border-rule-2 py-[13px] text-[14.5px] leading-[1.55]">
              <span className="min-w-0 flex-[1_1_320px]">
                <RichText item={item} />
              </span>
            </li>
          ))}
        </ul>
      );

    case "faq":
      return <Faq items={block.items} />;
  }
}

export function Blocks({ blocks, ctx }: { blocks: Block[]; ctx: BlockContext }) {
  return (
    <>
      {blocks.map((block, i) => (
        <Fragment key={i}>
          <RenderBlock block={block} ctx={ctx} />
        </Fragment>
      ))}
    </>
  );
}
