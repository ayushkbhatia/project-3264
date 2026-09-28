"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { HeaderNavItem } from "./Header";
import { SmartLink } from "./primitives";

// Static class names for Tailwind, keyed like Header's COLLAPSE.
const SHOW = {
  "940": "max-[940px]:flex",
  "1000": "max-[999.98px]:flex",
  "1024": "max-[1023.98px]:flex",
} as const;
const WIDE = {
  "940": "(min-width: 940.02px)",
  "1000": "(min-width: 1000px)",
  "1024": "(min-width: 1024px)",
} as const;

/**
 * The header's menu for when the nav no longer fits (design_handoff_playbooks/specs/08): a 44px
 * button beside the CTA that opens a full-width sheet under the header, listing the same links
 * at 16px on 48px rows, on the page colour with --line2 dividers.
 *
 * A disclosure, not a dialog: the page stays usable and scrollable behind it. It closes on
 * Escape (focus returns to the button), on a link, on a click outside the header, when focus
 * leaves the header, and when the window widens past the breakpoint. The button only displays
 * below the header's collapse width, where the inline nav is hidden.
 */
export function MobileMenu({ nav, breakpoint }: { nav: HeaderNavItem[]; breakpoint: keyof typeof SHOW }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sheetId = useId();

  useEffect(() => {
    if (!open) return;
    const header = buttonRef.current?.closest("header");
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (header && !header.contains(e.target as Node)) setOpen(false);
    };
    const onFocus = (e: FocusEvent) => {
      if (header && !header.contains(e.target as Node)) setOpen(false);
    };
    const wide = window.matchMedia(WIDE[breakpoint]);
    const onWide = () => { if (wide.matches) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("focusin", onFocus);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("focusin", onFocus);
      wide.removeEventListener("change", onWide);
    };
  }, [open, breakpoint]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={sheetId}
        aria-label="Menu"
        onClick={() => setOpen((o) => !o)}
        data-menu-button=""
        className={`relative box-content hidden size-9 cursor-pointer items-center justify-center rounded-[6px] border border-line bg-white text-ink before:absolute before:-inset-[3px] before:content-[''] hover:border-a hover:text-a ${SHOW[breakpoint]}`}
      >
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
          {open ? <path d="m3.5 3.5 9 9m0-9-9 9" /> : <path d="M2 5h12M2 11h12" />}
        </svg>
      </button>
      <div
        id={sheetId}
        hidden={!open}
        data-menu-sheet=""
        className="absolute inset-x-0 top-full border-b border-line2 bg-page"
      >
        <nav aria-label="Primary" className="mx-auto box-content max-w-[1280px] px-6 pb-2 max-[380px]:px-4 md:px-10">
          <ul className="m-0 list-none p-0">
            {nav.map((item) => (
              <li key={item.label} className="border-b border-line2 last:border-b-0">
                <SmartLink
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex h-12 items-center text-[16px] tracking-[-0.01em] ${item.current ? "text-ink" : "text-sec"}`}
                >
                  {item.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
