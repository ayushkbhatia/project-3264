"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { SmartLink } from "@/components/home/primitives";
import { cx } from "./figure";
import type { TocEntry } from "./types";

type Link = { label: string; href: string };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * The article's frame: the phone "On this page" bar, then the 1048px row holding the sticky
 * sidebar (from 1048px: back link, contents with its coverage rail, CTA card) and <main>.
 * The main column is rendered on the server and passed in as children.
 *
 * Scroll-spy (README, "Behaviour"): the active entry is the last section whose top is at or
 * above a line min(170px, 30% of the viewport) from the top; inside a section with
 * subsections, the active subsection likewise. It also drives the header's reading-progress
 * bar and the rail's fill (the active entry's offsetTop plus the share of its section scrolled
 * past the line, times the entry's height). Recomputed once per frame on scroll, on resize and
 * when <main> changes size. Only a change of entry re-renders; the bar and rail are written
 * straight to the DOM.
 *
 * <main> is the size container every figure's layout responds to (figure.tsx).
 */
export function ArticleShell({
  toc,
  back,
  card,
  cta,
  children,
}: {
  toc: TocEntry[];
  back: Link;
  /** The sidebar card's line above its button. */
  card: string;
  cta: Link;
  children: ReactNode;
}) {
  const [act, setAct] = useState(toc[0].id);
  const [sub, setSub] = useState<string | null>(null);
  const [mini, setMini] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const miniButton = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const spy = useCallback(() => {
    const vh = window.innerHeight;
    const line = Math.min(170, vh * 0.3);
    const H = document.documentElement.scrollHeight - vh;
    const bar = document.querySelector<HTMLElement>("[data-reading-progress]");
    if (bar) bar.style.transform = `scaleX(${(H > 0 ? clamp01(window.scrollY / H) : 0).toFixed(4)})`;

    let a = toc[0].id;
    let el: HTMLElement | null = null;
    let s: string | null = null;
    for (const t of toc) {
      const e = document.getElementById(t.id);
      if (e && e.getBoundingClientRect().top <= line) {
        a = t.id;
        el = e;
      }
    }
    const entry = toc.find((t) => t.id === a);
    for (const u of entry?.subs ?? []) {
      const e = document.getElementById(u.id);
      if (e && e.getBoundingClientRect().top <= line) s = u.id;
    }

    const rail = railRef.current;
    const item = rail?.parentElement?.querySelector<HTMLElement>(`[data-toc="${a}"]`);
    if (rail && item) {
      let f = 0;
      if (el) {
        const r = el.getBoundingClientRect();
        f = clamp01((line - r.top) / Math.max(1, r.height));
      }
      rail.style.height = `${(item.offsetTop + f * item.offsetHeight).toFixed(1)}px`;
    }
    setAct(a);
    setSub(s);
  }, [toc]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          spy();
        });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const ro = new ResizeObserver(onScroll);
    if (mainRef.current) ro.observe(mainRef.current);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [spy]);

  // A new active entry changes the contents' layout (05's subsections open under it), so the
  // rail is measured again once that has rendered.
  useEffect(() => {
    const raf = requestAnimationFrame(spy);
    return () => cancelAnimationFrame(raf);
  }, [act, sub, spy]);

  // The phone bar's list closes on Escape (focus back to its button), on a click or focus
  // outside the bar, and on choosing an entry.
  useEffect(() => {
    if (!mini) return;
    const inBar = (t: EventTarget | null) => !!barRef.current && barRef.current.contains(t as Node);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMini(false);
      miniButton.current?.focus();
    };
    const onOutside = (e: Event) => {
      if (!inBar(e.target)) setMini(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onOutside);
    document.addEventListener("focusin", onOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onOutside);
      document.removeEventListener("focusin", onOutside);
    };
  }, [mini]);

  const idx = Math.max(0, toc.findIndex((t) => t.id === act));
  const cur = toc[idx];
  const curLabel = (cur.num ? cur.num + " " : "") + cur.label;

  return (
    <>
      {/* Phone and tablet: "On this page", sticky under the header. */}
      <nav
        aria-label="On this page"
        data-pb-tocbar=""
        className="sticky top-[68px] z-[90] border-b border-rule-2 bg-[rgba(246,245,242,0.94)] backdrop-blur-[12px] min-[1048px]:hidden"
      >
        <div ref={barRef} className="relative mx-auto box-border max-w-[760px] px-[clamp(20px,4vw,40px)]">
          <button
            ref={miniButton}
            type="button"
            aria-expanded={mini}
            aria-controls={panelId}
            onClick={() => setMini((m) => !m)}
            className="flex h-11 w-full cursor-pointer items-center gap-3.5 text-left text-ink"
          >
            <span className="flex-none font-mono text-[10.5px] tracking-[0.08em] text-mut uppercase">On this page</span>
            <span className="min-w-0 flex-auto truncate text-[13px]">{curLabel}</span>
            <span aria-hidden="true" className="flex-none font-mono text-[14px] text-sec">
              {mini ? "−" : "+"}
            </span>
          </button>
          <div
            id={panelId}
            hidden={!mini}
            className="absolute top-12 right-[clamp(12px,3vw,32px)] left-[clamp(12px,3vw,32px)] box-border grid max-h-[70vh] gap-0.5 overflow-auto rounded-[12px] border border-rule-2 bg-tile p-1.5 shadow-[0_24px_48px_-20px_rgba(20,20,18,0.25)]"
          >
            {toc.map((t, i) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                aria-current={i === idx ? "true" : undefined}
                onClick={() => setMini(false)}
                className={cx(
                  "flex items-baseline gap-2.5 rounded-[8px] px-2.5 py-2 text-[13.5px] hover:text-ink",
                  i === idx ? "bg-wash" : "bg-transparent",
                  i <= idx ? "text-ink" : "text-mut",
                )}
              >
                <span className="flex-[0_0_18px] font-mono text-[10.5px] text-mut">{t.num}</span>
                <span>{t.label}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="mx-auto box-border flex max-w-[1048px] items-start justify-center gap-[88px] px-[clamp(20px,4vw,40px)]">
        <aside className="sticky top-10 box-border hidden max-h-[calc(100vh-40px)] flex-[0_0_200px] overflow-y-auto pt-[60px] pb-8 min-[1048px]:block">
          <SmartLink href={back.href} className="relative inline-flex text-[13.5px] text-sec before:absolute before:-inset-1 before:content-['']">
            {/* one flex item, so the arrow keeps its space */}
            <span>
              <span aria-hidden="true">{"← "}</span>
              {back.label}
            </span>
          </SmartLink>
          <div className="mt-8 font-mono text-[10.5px] tracking-[0.08em] text-mut uppercase">On this page</div>
          <nav aria-label="On this page" className="relative mt-2.5 pl-3">
            <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[1.5px] bg-rule-2" />
            <span
              ref={railRef}
              aria-hidden="true"
              className="absolute top-0 left-0 h-0 w-[1.5px] bg-ink transition-[height] duration-200 ease-linear"
            />
            {toc.map((t, i) => (
              <div key={t.id} data-toc={t.id} className="py-px">
                <a
                  href={`#${t.id}`}
                  aria-current={i === idx ? "true" : undefined}
                  className={cx(
                    "flex items-baseline gap-2 rounded-[7px] px-2.5 py-1.5 text-[13px] leading-[1.3] tracking-[-0.005em] transition-[background,color] duration-[160ms] ease-[ease] hover:text-ink",
                    i === idx ? "bg-wash" : "bg-transparent",
                    i <= idx ? "text-ink" : "text-mut",
                  )}
                >
                  <span className="flex-[0_0_17px] font-mono text-[10.5px] text-mut">{t.num}</span>
                  <span>{t.label}</span>
                </a>
                {t.subs.length && i === idx ? (
                  <div className="mt-[3px] mb-1.5 ml-[35px] grid gap-px">
                    {t.subs.map((u) => (
                      <a
                        key={u.id}
                        href={`#${u.id}`}
                        aria-current={sub === u.id ? "true" : undefined}
                        className={cx(
                          "block border-l py-1 pl-2.5 text-[12px] leading-[1.35] hover:text-ink",
                          sub === u.id ? "border-ink text-ink" : "border-rule text-mut",
                        )}
                      >
                        {u.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>
          <div className="mt-8 rounded-[12px] bg-wash p-[18px]">
            <div className="text-[14.5px] leading-[1.4] tracking-[-0.012em]">{card}</div>
            <SmartLink
              href={cta.href}
              className="mt-3 flex h-9 items-center justify-center rounded-[6px] bg-ink px-3 text-[12.5px] font-medium tracking-[-0.005em] text-white hover:bg-a hover:text-white forced-colors:border"
            >
              {cta.label}
            </SmartLink>
          </div>
        </aside>

        <main ref={mainRef} className="@container min-w-0 max-w-[680px] flex-auto pt-[60px]">
          {children}
        </main>
      </div>
    </>
  );
}
