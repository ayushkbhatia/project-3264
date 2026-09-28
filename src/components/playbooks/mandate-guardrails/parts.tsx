import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Dot, SheetTitle, cx, monoLabel } from "@/components/playbooks/article/figure";

// Pieces the Mandate Guardrails figures share, at the prototype's values (Mandate
// Guardrails.dc.html). Every name and identifier in them is fictional.

export const MANDATE = "Quillmere Global Credit Mandate";
export const CLIENT = "Client: Ashby Borough Pension Fund (fictional) · account ACCT-ASHBY-01";

/** "(fictional)" after a sheet title: regular weight, faint. The design's #8A887F reads 3.6:1 on
    the sheet, under AA for text this size, so it takes --faint-ink (see globals.css). */
export function Fictional() {
  return <span className="font-normal text-faint-ink">(fictional)</span>;
}

/** A sheet's title with its sub-line (12.5px / 1.45, secondary, 3px under it). */
export function SheetHead({ id, title, sub }: { id?: string; title: ReactNode; sub: ReactNode }) {
  return (
    <>
      <SheetTitle id={id}>{title}</SheetTitle>
      <div className="mt-[3px] text-[12.5px] leading-[1.45] text-sec">{sub}</div>
    </>
  );
}

/** A mono label heading a part of a sheet: an inline span in a block of its own (its line box
    is the 16px parent's, as in the reference), with the margins it is given. */
export function PartLabel({ id, className, children }: { id?: string; className: string; children: ReactNode }) {
  return (
    <div className={className}>
      <span id={id} className={cx(monoLabel, "text-sec")}>
        {children}
      </span>
    </div>
  );
}

/** The sentence a sheet ends on: 14.5px / 1.5, ink, 14px under what precedes it. */
export function SheetMoment({ children }: { children: ReactNode }) {
  return <p className="mt-3.5 mb-0 text-[14.5px] leading-[1.5] text-ink">{children}</p>;
}

/** A result in a table: a 7px dot and the word, mono 11px, green; red and weight 500 when bad.
    `onTint`: set on a status tint, where the word takes --ok-ink / --bad-ink (AA; the design's
    colours read 4.28:1 and 4.40:1 there). The dot keeps the design's colour. */
export function Status({
  tone,
  onTint,
  children,
  ...rest
}: { tone: "ok" | "bad"; onTint?: boolean } & Omit<ComponentPropsWithoutRef<"span">, "className">) {
  return (
    <span
      className={cx(
        "inline-flex items-baseline gap-1.5 font-mono text-[11px]",
        tone === "ok" ? (onTint ? "text-ok-ink" : "text-ok") : cx("font-medium", onTint ? "text-bad-ink" : "text-bad"),
      )}
      {...rest}
    >
      <Dot tone={tone} level />
      {children}
    </span>
  );
}
