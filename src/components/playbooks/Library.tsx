"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  categories,
  categoryById,
  library,
  playbooks,
  results as copy,
  type CategoryId,
} from "@/content/playbooks";
import { PlaybookCard } from "./PlaybookCard";

// The library bar (#library) and the switch between browsing and filtering (specs/02).
//
// Browsing (All, empty search): the server-rendered sections passed in as `browse` (the
// carousel, the CTA cards, the three category rows, Recently updated). Filtering (a chip, or
// any search text): those unmount and Results takes their place. The two combine: category AND
// a case-insensitive substring match over name, one-liner and category.
//
// The state is mirrored in the URL (?category=private-credit&q=nav) so a filtered view can be
// shared: read once on mount, written with history.replaceState (no history entry per
// keystroke, no server round trip). Writes are debounced: Safari throws after 100
// replaceState calls in 30s.

const SEARCH_ID = "playbook-search";

function matches(q: string) {
  return playbooks.filter(
    (p) => !q || `${p.name} ${p.blurb} ${categoryById(p.category).label}`.toLowerCase().includes(q),
  );
}

export function Library({ browse }: { browse: ReactNode }) {
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const filtering = category !== null || q !== "";
  const found = useMemo(
    () => matches(q).filter((p) => category === null || p.category === category),
    [q, category],
  );
  const label = copy.label(found.length, category && categoryById(category).label, query.trim());

  // Read a shared filtered view from the URL once, after hydration (the server renders the
  // browsing state; a filtered link swaps to its results on the first client frame).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get("category");
    const text = params.get("q") ?? "";
    const valid = categories.find((x) => x.id === c)?.id ?? null;
    /* eslint-disable react-hooks/set-state-in-effect -- one-time sync from the URL, which the
       server render cannot see */
    if (valid) setCategory(valid);
    if (text) setQuery(text);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // On mount this first schedules the empty state, but the URL read above re-renders at once,
  // and the cleanup cancels that write before it lands.
  useEffect(() => {
    const t = window.setTimeout(() => {
      const url = new URL(window.location.href);
      if (category) url.searchParams.set("category", category);
      else url.searchParams.delete("category");
      if (query.trim()) url.searchParams.set("q", query.trim());
      else url.searchParams.delete("q");
      if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url);
    }, 250);
    return () => window.clearTimeout(t);
  }, [category, query]);

  const clear = () => {
    setCategory(null);
    setQuery("");
    // Clear unmounts itself with the results; hand focus to the search rather than the body.
    searchRef.current?.focus();
  };

  const chips: Array<{ id: CategoryId | null; label: string }> = [
    { id: null, label: library.all },
    ...categories.map((c) => ({ id: c.id, label: c.label })),
  ];

  return (
    <>
      <section id="library" data-screen-label="Library" className="px-10 pt-16 max-[479.98px]:px-5">
        {/* The outline's h2 for what follows until the first category row: the carousel's and
            the CTA cards' titles, or the results' (all h3). Not in the design, so not shown. */}
        <h2 className="sr-only">{library.regionLabel}</h2>
        <div
          role="search"
          aria-label={library.regionLabel}
          className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-5 border-b border-line pb-5"
        >
          <div role="group" aria-label={library.filterLabel} className="flex flex-wrap gap-1.5">
            {chips.map((chip) => {
              const on = chip.id === category;
              return (
                <button
                  key={chip.label}
                  type="button"
                  data-cat={chip.label}
                  aria-pressed={on}
                  onClick={() => setCategory(chip.id)}
                  className={`relative h-[34px] cursor-pointer rounded-full border px-[15px] text-[13.5px] tracking-[-0.01em] whitespace-nowrap transition-[background,color] duration-[160ms] ease-[ease] before:absolute before:-inset-x-[3px] before:-inset-y-[5px] before:content-[''] ${
                    on ? "border-ink bg-ink text-white" : "border-line bg-white text-ink"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
          <label htmlFor={SEARCH_ID} className="relative flex w-[min(100%,320px)] items-center">
            {/* The prototype's CSS magnifier, redrawn: an 11px ring (1.5px stroke) at left 14px
                and a 5px handle at 45° from (23px, 50% + 3.75px). */}
            <svg
              aria-hidden="true"
              viewBox="0 0 14 15"
              className="pointer-events-none absolute top-1/2 left-[14px] -mt-[7px] h-[15px] w-[14px] text-mut"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <circle cx="5.5" cy="5.5" r="4.75" />
              <path d="M9 10.75 12.54 14.29" />
            </svg>
            <input
              ref={searchRef}
              id={SEARCH_ID}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={library.searchLabel}
              aria-label={library.searchLabel}
              autoComplete="off"
              spellCheck={false}
              className="box-border h-10 w-full rounded-[8px] border border-line bg-white pr-[14px] pl-9 text-[14px] text-ink outline-none focus:border-a focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-a"
            />
          </label>
        </div>
        {/* Always in the DOM, so the count is announced as the visitor types (a live region
            inserted along with its content is often not read). */}
        <p className="sr-only" aria-live="polite">
          {filtering ? label : ""}
        </p>
      </section>

      {filtering ? (
        // content-box, as in the reference: the 44vh minimum excludes the 32px top padding
        <section data-screen-label="Results" className="box-content min-h-[44vh] px-10 pt-8 max-[479.98px]:px-5">
          <div className="mx-auto max-w-[1280px]">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[14px] text-sec">{label}</span>
              <button
                type="button"
                onClick={clear}
                className="cursor-pointer border-b border-line bg-transparent p-0 text-[14px] text-ink hover:border-a hover:text-a"
              >
                {copy.clear}
              </button>
            </div>
            {/* auto-fill, not auto-fit: a single result keeps its column width. */}
            <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-x-7 gap-y-11">
              {found.map((p) => (
                <PlaybookCard key={p.slug} playbook={p} idPrefix="result" />
              ))}
            </div>
            {found.length === 0 ? (
              <p className="m-0 border-t border-ink py-6 text-[16px] leading-[1.55] text-sec">{copy.empty}</p>
            ) : null}
          </div>
        </section>
      ) : (
        browse
      )}
    </>
  );
}
