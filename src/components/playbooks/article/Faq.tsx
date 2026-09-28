"use client";

import { useEffect, useId, useRef, useState } from "react";
import { SmartLink } from "@/components/home/primitives";
import type { Inline } from "./types";

/**
 * Questions: an accordion whose items open and close independently, the first one open
 * (README, "Behaviour"). Each question is an h3 wrapping its button, the APG accordion pattern.
 *
 * Closed answers stay in the page as hidden="until-found", so find-in-page still reaches them
 * and opens the item it lands in (beforematch). React renders `hidden` as a plain boolean, so
 * the attribute's value is written after each render; browsers without until-found treat it as
 * ordinary `hidden`.
 *
 * An answer may link to another page inline (underlined in ink, accent on hover).
 */
export function Faq({ items }: { items: Array<{ q: string; a: Inline }> }) {
  const [open, setOpen] = useState(() => items.map((_, i) => i === 0));
  const id = useId();
  const answers = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    answers.current.forEach((el, i) => {
      if (el && !open[i]) el.setAttribute("hidden", "until-found");
    });
  });

  useEffect(() => {
    const els = answers.current.slice();
    const onMatch = (e: Event) => {
      const i = els.indexOf(e.target as HTMLDivElement);
      if (i >= 0) setOpen((o) => o.map((v, j) => (j === i ? true : v)));
    };
    els.forEach((el) => el?.addEventListener("beforematch", onMatch));
    return () => els.forEach((el) => el?.removeEventListener("beforematch", onMatch));
  }, []);

  const toggle = (i: number) => setOpen((o) => o.map((v, j) => (j === i ? !v : v)));

  return (
    <div className="mt-[22px] border-t border-ink">
      {items.map((item, i) => (
        <div key={item.q} className="border-b border-rule-2">
          <h3 className="m-0">
            <button
              type="button"
              id={`${id}-q${i}`}
              aria-expanded={open[i]}
              aria-controls={`${id}-a${i}`}
              onClick={() => toggle(i)}
              className="flex w-full cursor-pointer items-baseline justify-between gap-[18px] py-4 text-left text-ink hover:text-a"
            >
              <span className="text-[15.5px] leading-[1.4] tracking-[-0.012em]">{item.q}</span>
              <span aria-hidden="true" className="flex-none font-mono text-[15px] text-sec">
                {open[i] ? "−" : "+"}
              </span>
            </button>
          </h3>
          {/* The wrapper is what hides: an until-found element keeps its box (only its content
              is skipped), so it must carry no padding of its own. */}
          <div
            id={`${id}-a${i}`}
            ref={(el) => {
              answers.current[i] = el;
            }}
            hidden={!open[i]}
          >
            <p className="m-0 pb-[18px] text-[14.5px] leading-[1.7] text-ink-2">
              {typeof item.a === "string"
                ? item.a
                : item.a.map((part, j) =>
                    typeof part === "string" ? (
                      part
                    ) : (
                      <SmartLink
                        key={j}
                        href={part.href}
                        className="border-b border-[rgba(20,20,18,0.3)] text-ink hover:border-a hover:text-a"
                      >
                        {part.label}
                      </SmartLink>
                    ),
                  )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
