import Image, { type StaticImageData } from "next/image";
import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";

// The frame every playbook-page figure is drawn in (design_handoff_covenant_watch/README.md,
// "Figure frame"): a watercolour band under a paper veil, a mono head, one or more white sheets
// on it, then an evidence line, a "moment" sentence and the caption below the band.
//
// Figures respond to the MAIN COLUMN's width, not the viewport's: <main> is a size container
// (ArticleShell), and the figures switch layout with container queries at the reference's
// thresholds. The reference measures the column with Math.round(width) >= N, so each query is
// set half a pixel below N: @min-[519.5px] is "mw >= 520".

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** The band's rendered width: the main column, 680px at most (see ArticleShell). */
const BAND_SIZES = "(min-width: 740px) 680px, (min-width: 500px) 92vw, calc(100vw - 40px)";

/** IBM Plex Mono label: 10.5px, 0.07em, uppercase. */
export const monoLabel = "font-mono text-[10.5px] tracking-[0.07em] uppercase";

export function Figure({
  image,
  veil,
  label,
  meta,
  eager = false,
  className,
  band,
  evidence,
  moment,
  caption,
  children,
  ref,
  ...rest
}: {
  /** The band's wash (public/img/playbooks). */
  image: StaticImageData;
  /** Opacity of the paper veil over the wash, 0.62–0.76 per figure. */
  veil: number;
  /** Mono head, top left. */
  label: string;
  /** Mono head, top right: entity, document, version. */
  meta?: ReactNode;
  /** The hero figure: its wash loads at once, at high priority. */
  eager?: boolean;
  /** Margin above (28–44px per figure). */
  className?: string;
  /** Extra classes for the band (none in the reference). */
  band?: string;
  evidence?: ReactNode;
  moment?: ReactNode;
  caption: ReactNode;
  /** The sheets. */
  children: ReactNode;
  ref?: Ref<HTMLElement>;
} & Omit<ComponentPropsWithoutRef<"figure">, "children" | "className">) {
  return (
    <figure ref={ref} data-fig="" className={cx("m-0", className)} {...rest}>
      {/* In the reference the wash and its veil are the band's CSS background, so they run
          under its 1px border too. Here they fill the border box from a layer of their own,
          and the border is drawn over them; the band itself keeps a transparent border for
          its geometry. */}
      <div className={cx("relative rounded-[16px] border border-transparent p-3", band)}>
        <div aria-hidden="true" className="absolute -inset-px overflow-hidden rounded-[16px] bg-wash">
          <Image
            src={image}
            alt=""
            fill
            sizes={BAND_SIZES}
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : undefined}
            className="object-cover"
          />
          <div className="absolute inset-0" style={{ background: `rgba(251,250,248,${veil})` }} />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute -inset-px rounded-[16px] border border-[rgba(20,20,18,0.06)]" />
        <div className="relative">
          <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1 px-1.5 pt-1 pb-2.5">
            <span className={cx(monoLabel, "text-ink")}>{label}</span>
            {meta ? <span className="text-right font-mono text-[11px] leading-[1.6] text-ink-2">{meta}</span> : null}
          </div>
          {children}
        </div>
      </div>
      {evidence ? (
        <div className="mt-4 border-t border-ink pt-3 font-mono text-[11.5px] leading-[1.7] text-ink [overflow-wrap:anywhere]">
          {evidence}
        </div>
      ) : null}
      {moment ? <p className="mt-2 mb-0 text-[15px] leading-[1.5] text-sec">{moment}</p> : null}
      <figcaption className="mt-2 text-[12px] leading-[1.5] text-mut">{caption}</figcaption>
    </figure>
  );
}

/** A white sheet on the band: 11px radius, the sheet shadow, 16px padding unless `pad` says. */
export function Sheet({ pad = "p-4", className, children, ...rest }: ComponentPropsWithoutRef<"div"> & { pad?: string }) {
  return (
    <div
      className={cx("rounded-[11px] bg-[rgba(255,255,255,0.93)] shadow-[0_12px_32px_-20px_rgba(20,20,18,0.3)]", pad, className)}
      {...rest}
    >
      {children}
    </div>
  );
}

/** A sheet's title: 16.5px / 500. */
export function SheetTitle({ children }: { children: ReactNode }) {
  return <div className="text-[16.5px] leading-[1.3] font-medium tracking-[-0.016em]">{children}</div>;
}

/** 7px status dot, green or red. Decorative: the text beside it carries the status. */
export function Dot({ tone, className }: { tone: "ok" | "bad"; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx("size-[7px] flex-none -translate-y-px rounded-full", tone === "ok" ? "bg-ok" : "bg-bad", className)}
    />
  );
}
