import type { CSSProperties } from "react";
import type { Menu, MenuColumn, MenuItem } from "@/content/site-header";
import { SmartLink } from "@/components/home/primitives";
import { linkCurrent, localHref } from "./current";

// The content of the three desktop mega-panels and of the phone sheet's accordion groups, both
// rendered from content/site-header.ts. Values are the prototype's
// (design_handoff_site_header/reference/Site Header.dc.html), unrounded.
//
// Every link sets its hover colour explicitly: the site's base `a:hover` turns links accent,
// which the menus keep for their "→" links only. Item rows show hover as the #F0EEE9 fill.

const ITEM = "rounded-[10px] text-ink hover:bg-[#F0EEE9] hover:text-ink";
const MONO = "font-mono text-mut";

/** A painting behind a thumbnail or card, once `primed` (the first hover, focus or open):
    closed panels are only hidden, and their backgrounds would otherwise load with the page. */
const bg = (src: string | undefined, primed: boolean, position = "center"): CSSProperties | undefined =>
  src && primed ? { backgroundImage: `url(${src})`, backgroundPosition: position } : undefined;

function Thumb({ src, size, radius, primed }: { src?: string; size: number; radius: number; primed: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="block flex-none bg-[#E2DFD8] bg-cover"
      style={{ width: size, height: size, borderRadius: radius, ...bg(src, primed) }}
    />
  );
}

type LinkProps = { item: MenuItem; pathname: string; primed: boolean };

function itemLink(item: MenuItem, pathname: string) {
  return { href: localHref(item.href, pathname), "aria-current": linkCurrent(item.href, pathname) };
}

/** Title over description: "How it works", and The programme with its step numbers. */
function DescItem({ item, pathname }: LinkProps) {
  const body = (
    <>
      <span className="block text-[15.5px] tracking-[-0.012em]">{item.title}</span>
      <span className="mt-[5px] block text-[13.5px] leading-[1.5] text-pretty text-sec">{item.desc}</span>
    </>
  );
  return item.num ? (
    <SmartLink {...itemLink(item, pathname)} className={`flex gap-3 px-3.5 py-3 ${ITEM}`}>
      <span className={`flex-none pt-[3px] text-[11px] ${MONO}`}>{item.num}</span>
      <span className="min-w-0">{body}</span>
    </SmartLink>
  ) : (
    <SmartLink {...itemLink(item, pathname)} className={`block px-3.5 py-3 ${ITEM}`}>
      {body}
    </SmartLink>
  );
}

/** Foundations: a smaller title over a one-line description. */
function CompactItem({ item, pathname }: LinkProps) {
  return (
    <SmartLink {...itemLink(item, pathname)} className={`block px-3.5 py-2.5 ${ITEM}`}>
      <span className="block text-[14.5px]">{item.title}</span>
      <span className="mt-[3px] block text-[13px] text-sec">{item.desc}</span>
    </SmartLink>
  );
}

/** Built from playbooks: a 28px painting beside the name. */
function ThumbRow({ item, pathname, primed }: LinkProps) {
  return (
    <SmartLink {...itemLink(item, pathname)} className={`flex items-center gap-3 px-3.5 py-[9px] text-[14.5px] ${ITEM}`}>
      <Thumb src={item.thumb} size={28} radius={7} primed={primed} />
      {item.title}
    </SmartLink>
  );
}

/** Industries: a 52px painting beside title and description. */
function ThumbItem({ item, pathname, primed }: LinkProps) {
  return (
    <SmartLink {...itemLink(item, pathname)} className={`flex items-start gap-3.5 px-3.5 py-3 ${ITEM}`}>
      <Thumb src={item.thumb} size={52} radius={10} primed={primed} />
      <span className="min-w-0">
        <span className="block text-[15.5px] tracking-[-0.012em]">{item.title}</span>
        <span className="mt-[5px] block text-[13.5px] leading-[1.5] text-pretty text-sec">{item.desc}</span>
      </span>
    </SmartLink>
  );
}

const LAYOUT = {
  "grid-2": { list: "grid grid-cols-2 gap-1", Item: DescItem },
  "grid-2-numbered": { list: "grid grid-cols-2 gap-1", Item: DescItem },
  // Five industries (Financial Services joined): three columns where the items still read well,
  // from 1200px; below that two, leaving the fifth on its own row (design_handoff_financial_services,
  // "Desktop panel layout": three columns preferred if they fit, and at 1024px they would not,
  // squeezing each description into a ~117px column).
  "grid-2-thumb": { list: "grid grid-cols-2 content-start gap-1 min-[1200px]:grid-cols-3", Item: ThumbItem },
  "compact-list": { list: "grid gap-0.5", Item: CompactItem },
  "thumb-list": { list: "grid gap-0.5", Item: ThumbRow },
} as const;

function Column({ column, pathname, primed }: { column: MenuColumn; pathname: string; primed: boolean }) {
  const { list, Item } = LAYOUT[column.layout];
  const items = (
    <ul className={list}>
      {column.items.map((item) => (
        <li key={item.title} className="min-w-0">
          <Item item={item} pathname={pathname} primed={primed} />
        </li>
      ))}
      {column.more ? (
        <li>
          <SmartLink href={localHref(column.more.href, pathname)} className="block px-3.5 py-[9px] text-[13.5px] text-sec">
            {column.more.label}
          </SmartLink>
        </li>
      ) : null}
    </ul>
  );
  if (!column.label) return items;
  return (
    <div className="min-w-0">
      <p className={`m-0 px-3.5 text-[10.5px] tracking-[0.08em] uppercase ${MONO}`}>{column.label}</p>
      <div className="mt-2.5">{items}</div>
    </div>
  );
}

/** The card's min-height is the prototype's content-box one: its padding comes on top. */
function FeatureCard({ menu, pathname, primed }: { menu: Menu; pathname: string; primed: boolean }) {
  const f = menu.feature;
  const [top, bottom, stop] = f.veil;
  return (
    <SmartLink
      href={localHref(f.href, pathname)}
      className="group relative box-content flex min-w-0 flex-col justify-end overflow-hidden rounded-[14px] bg-[#E2DFD8] bg-cover p-5 text-ink hover:text-ink"
      style={{ minHeight: f.minHeight, ...bg(f.image, primed, f.imagePosition) }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, rgba(248,246,240,${top}) 0%, rgba(248,246,240,${bottom}) ${stop})` }}
      />
      <span className="relative text-[12.5px] text-ink-2">{f.eyebrow}</span>
      <span className="relative mt-1.5 text-[20px] leading-[1.2] tracking-[-0.024em] text-balance">{f.title}</span>
      {f.ctaStyle === "button" ? (
        <span className="relative mt-3.5 inline-flex h-9 items-center self-start rounded-[6px] bg-ink px-3.5 text-[13px] font-medium text-white transition-colors duration-150 group-hover:bg-black">
          {f.cta}
        </span>
      ) : (
        <span className="relative mt-3.5 text-[13.5px] transition-colors duration-150 group-hover:text-a">{f.cta}</span>
      )}
    </SmartLink>
  );
}

/** One desktop panel's content: the head row, then the columns and the feature card. */
export function PanelContent({ menu, pathname, primed }: { menu: Menu; pathname: string; primed: boolean }) {
  return (
    <div className="mx-auto max-w-[1360px] px-10 pt-[30px] pb-9">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-[rgba(20,20,18,0.08)] pb-5">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-[18px] gap-y-1.5">
          <span className="text-[21px] tracking-[-0.026em] text-ink">{menu.label}</span>
          <span className="text-[14px] text-sec">{menu.tagline}</span>
        </div>
        <SmartLink
          href={localHref(menu.overview.href, pathname)}
          aria-current={linkCurrent(menu.overview.href, pathname)}
          className="text-[13.5px] text-ink"
        >
          {menu.overview.desktopLabel}
        </SmartLink>
      </div>
      <div className="mt-[22px] grid gap-8" style={{ gridTemplateColumns: menu.grid }}>
        {menu.columns.map((column, i) => (
          <Column key={column.label ?? i} column={column} pathname={pathname} primed={primed} />
        ))}
        <FeatureCard menu={menu} pathname={pathname} primed={primed} />
      </div>
    </div>
  );
}

/** One phone accordion group's content: the tagline, the rows, then the overview pill. */
export function GroupContent({ menu, pathname }: { menu: Menu; pathname: string }) {
  const items = menu.columns.filter((c) => !c.desktopOnly).flatMap((c) => c.items.filter((i) => !i.desktopOnly));
  return (
    <>
      <p className="m-0 text-[14px] leading-[1.5] text-pretty text-sec">{menu.tagline}</p>
      <ul className="mt-3 grid">
        {items.map((item) => {
          const current = linkCurrent(item.href, pathname);
          return (
            <li key={item.title}>
              <SmartLink
                href={localHref(item.href, pathname)}
                aria-current={current}
                className="flex items-start gap-3 border-t border-[rgba(20,20,18,0.06)] py-3 text-ink hover:text-ink focus-visible:-outline-offset-2"
              >
                {item.num ? <span className={`w-[22px] flex-none pt-[3px] text-[11px] ${MONO}`}>{item.num}</span> : null}
                {item.thumb ? (
                  // Hidden with its group until opened, so it loads on first open.
                  <span
                    aria-hidden="true"
                    className="block size-10 flex-none rounded-[9px] bg-[#E2DFD8] bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.thumb})` }}
                  />
                ) : null}
                <span className="min-w-0">
                  <span className={`block text-[16px] leading-[1.3] tracking-[-0.012em] ${current ? "font-medium" : ""}`}>{item.title}</span>
                  <span className="mt-[3px] block text-[13.5px] leading-[1.45] text-pretty text-sec">{item.desc}</span>
                </span>
              </SmartLink>
            </li>
          );
        })}
      </ul>
      <SmartLink
        href={localHref(menu.overview.href, pathname)}
        aria-current={linkCurrent(menu.overview.href, pathname)}
        className="mt-2 inline-flex h-[42px] items-center rounded-full border border-line bg-white px-4 text-[14px] text-ink hover:border-a"
      >
        {menu.overview.mobileLabel}
      </SmartLink>
    </>
  );
}
