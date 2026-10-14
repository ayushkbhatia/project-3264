"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { cta, links, menus, type MenuKey } from "@/content/site-header";
import { SmartLink, Wordmark } from "@/components/home/primitives";
import { localHref, sectionCurrent } from "./current";
import { GroupContent, PanelContent } from "./panels";

// The site header (design_handoff_site_header; its prototype, reference/Site Header.dc.html, is
// the source of truth). One component on every page, its content from content/site-header.ts.
//
// - Desktop (≥ 1024px): a 68px bar whose AI Engineering, AI Transformation and Industries
//   triggers open full-width mega-panels, by hover intent or by click.
// - Below 1024px: a compact bar (plus a "Book an audit" pill from 600px) whose Menu button opens
//   a full-height sheet: the three menus as accordions, the four plain pages, and a pinned CTA.
//
// Both bars are always rendered and CSS picks one, so the server HTML is right at every width
// and nothing shifts on hydration. Script only holds open/closed state.
//
// The header is sticky, blurred and exactly 68px plus its hairline: the panels and the sheet are
// absolutely positioned below it, so they never change its height. Motion modules depend on that
// (platform-sequence.js pins below `document.querySelector("header")`, Private Credit's pins sit
// at top: 68px), and so each page renders exactly one <header>.
//
// Disclosure pattern throughout, not ARIA menus: the triggers are buttons with aria-expanded and
// aria-controls, the panels are groups of plain links. Each panel follows its trigger in the
// DOM, so Tab runs trigger → its links → next trigger; leaving a panel by focus closes it.

const DESKTOP = "(min-width: 1024px)";

// Hover intent (README, "Desktop interaction").
const OPEN_DELAY = 90;
const LINK_CLOSE_DELAY = 120;
const LEAVE_CLOSE_DELAY = 180;
/** A click this soon after hover opened the panel is the same intent, not a request to close. */
const HOVER_CLICK_GRACE = 500;

type Panel = { open: MenuKey | null; instant: boolean };

const SHEET_THUMBS = [
  ...new Set(
    menus.flatMap((m) => m.columns.filter((c) => !c.desktopOnly).flatMap((c) => c.items.flatMap((i) => (i.thumb ? [i.thumb] : [])))),
  ),
];

const isMouse = (e: PointerEvent) => e.pointerType === "mouse";

/** What Tab can reach inside `root` right now: rendered, not inert, not visibility-hidden. */
function tabbables(root: HTMLElement) {
  return [...root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")].filter(
    (el) => el.getClientRects().length > 0 && !el.closest("[inert]") && getComputedStyle(el).visibility !== "hidden",
  );
}

export function SiteHeader({
  progress = false,
}: {
  /** A 2px reading-progress bar on the header's bottom edge, driven by the page (it sets
      `transform: scaleX(p)` on [data-reading-progress]; the article pages' ArticleShell). */
  progress?: boolean;
}) {
  const pathname = usePathname() ?? "/";

  /* ------------------------------------------------------------ desktop panels */

  // `instant`: switching straight from one panel to another swaps the content in place, with
  // no fade; only opening from closed and closing animate.
  const [panel, setPanel] = useState<Panel>({ open: null, instant: false });
  // Paintings load on the first hover, focus or open of a trigger rather than with the page.
  const [primed, setPrimed] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const hoverOpenedAt = useRef(0);
  const triggers = useRef<Partial<Record<MenuKey, HTMLButtonElement | null>>>({});

  const clearTimer = () => window.clearTimeout(timer.current);
  const setOpen = useCallback((next: MenuKey | null) => {
    window.clearTimeout(timer.current);
    if (next) setPrimed(true);
    setPanel((p) => (p.open === next ? p : { open: next, instant: p.open !== null && next !== null }));
  }, []);
  const later = (ms: number, fn: () => void) => {
    clearTimer();
    timer.current = window.setTimeout(fn, ms);
  };
  const open = panel.open;

  const onTriggerEnter = (key: MenuKey) => (e: PointerEvent) => {
    if (!isMouse(e)) return; // touch: the tap's click toggles
    setPrimed(true);
    if (open === key) return clearTimer(); // back onto the open trigger: a click now closes it
    const hover = () => {
      hoverOpenedAt.current = performance.now();
      setOpen(key);
    };
    if (open) hover();
    else later(OPEN_DELAY, hover);
  };
  const onTriggerClick = (key: MenuKey) => () => {
    if (open === key && performance.now() - hoverOpenedAt.current < HOVER_CLICK_GRACE) return;
    hoverOpenedAt.current = 0;
    setOpen(open === key ? null : key);
  };
  const onPlainLinkEnter = (e: PointerEvent) => {
    if (isMouse(e)) later(LINK_CLOSE_DELAY, () => setOpen(null));
  };
  const onHeaderEnter = (e: PointerEvent) => {
    if (isMouse(e) && open) clearTimer();
  };
  const onHeaderLeave = (e: PointerEvent) => {
    if (isMouse(e)) later(LEAVE_CLOSE_DELAY, () => setOpen(null));
  };
  // A link chosen in a panel closes it (an in-page anchor would otherwise leave it open).
  const onPanelClick = (e: MouseEvent) => {
    if ((e.target as Element).closest("a")) setOpen(null);
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Escape closes and returns focus to the trigger; a press outside the header closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const header = headerRef.current;
      const active = document.activeElement;
      setOpen(null);
      // Only pull focus back when it was in the header (or nowhere), not from the page under a
      // panel that opened on hover.
      if (!active || active === document.body || header?.contains(active)) triggers.current[open]?.focus();
    };
    const onPointer = (e: globalThis.PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, setOpen]);

  /* --------------------------------------------------------------- phone sheet */

  const [menuOpen, setMenuOpen] = useState(false);
  const [group, setGroup] = useState<MenuKey | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLElement>(null);
  const groupButtons = useRef<Partial<Record<MenuKey, HTMLButtonElement | null>>>({});
  const unlockRef = useRef<(() => void) | null>(null);

  const toggleMenu = () => {
    setGroup(null); // each opening starts collapsed
    setMenuOpen((o) => !o);
  };
  // A link in the sheet (or the logo) closes it. The scroll lock is released right here, before
  // the browser follows the link, so an in-page anchor can scroll the page.
  const closeForLink = () => {
    unlockRef.current?.();
    setMenuOpen(false);
  };
  const onGroupClick = (e: MouseEvent) => {
    if ((e.target as Element).closest("a")) closeForLink();
  };

  // While open: lock the page's scroll (the sheet scrolls on its own), keep Tab inside the bar
  // and sheet, close on Escape (focus back to Menu), and focus the first accordion row.
  useEffect(() => {
    if (!menuOpen) return;
    const html = document.documentElement;
    const header = headerRef.current;
    const prev = { overflow: html.style.overflow, paddingRight: html.style.paddingRight };
    const gutter = window.innerWidth - html.clientWidth; // a classic scrollbar's width, if any
    html.style.overflow = "hidden";
    if (gutter > 0) html.style.paddingRight = `${gutter}px`;
    let locked = true;
    const unlock = () => {
      if (!locked) return;
      locked = false;
      html.style.overflow = prev.overflow;
      html.style.paddingRight = prev.paddingRight;
    };
    unlockRef.current = unlock;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !header) return;
      const els = tabbables(header);
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      const at = document.activeElement as HTMLElement | null;
      if (!at || !header.contains(at)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && at === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && at === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    sheetRef.current?.querySelector<HTMLElement>("button")?.focus({ preventScroll: true });
    // The rows' thumbnails sit in collapsed groups (display: none), which load nothing; fetch
    // them now so a group opens with its paintings rather than grey tiles.
    for (const src of SHEET_THUMBS) new Image().src = src;
    return () => {
      document.removeEventListener("keydown", onKey);
      unlock();
      unlockRef.current = null;
    };
  }, [menuOpen]);

  // Opening a group collapses the one above it, which can pull the row just tapped up and out
  // of view; keep it in the sheet's viewport.
  useLayoutEffect(() => {
    const btn = group && groupButtons.current[group];
    const scroller = scrollerRef.current;
    if (!btn || !scroller) return;
    const over = scroller.getBoundingClientRect().top - btn.getBoundingClientRect().top;
    if (over > 0) scroller.scrollTop -= over;
  }, [group]);

  // Crossing the breakpoint closes whichever layout's menu was open: a sheet left open on a
  // rotated tablet would otherwise hold the scroll lock under the desktop bar.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const onChange = () => {
      setMenuOpen(false);
      setOpen(null);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [setOpen]);

  /* ----------------------------------------------------------------- rendering */

  const homeHref = localHref("/", pathname);
  const sheetOpen = menuOpen;

  return (
    <header
      ref={headerRef}
      data-site-header=""
      data-sh-instant={panel.instant ? "" : undefined}
      onPointerEnter={onHeaderEnter}
      onPointerLeave={onHeaderLeave}
      className="sticky top-0 z-[100] border-b border-line2 bg-[rgba(246,245,242,0.86)] text-ink backdrop-blur-[14px]"
    >
      {/* Desktop bar ----------------------------------------------------------- */}
      <div className="mx-auto flex h-[68px] max-w-[1360px] items-center gap-[clamp(20px,3vw,48px)] px-10 max-lg:hidden">
        <SmartLink href={homeHref} className="text-[19px] text-ink">
          <Wordmark />
        </SmartLink>
        <nav aria-label="Main" className="min-w-0 flex-1 text-[clamp(13px,1.5vw,14px)] whitespace-nowrap text-sec">
          <ul className="flex items-center gap-[clamp(14px,1.9vw,30px)]">
            {menus.map((menu) => {
              const on = open === menu.key;
              const current = sectionCurrent(menu.section, pathname);
              return (
                <li
                  key={menu.key}
                  onBlur={(e) => {
                    // Tab out of a trigger and its panel (past the last link) closes it.
                    const to = e.relatedTarget as Node | null;
                    if (on && to && !e.currentTarget.contains(to)) setOpen(null);
                  }}
                >
                  <button
                    ref={(el) => {
                      triggers.current[menu.key] = el;
                    }}
                    type="button"
                    aria-expanded={on}
                    aria-controls={`menu-${menu.key}`}
                    aria-current={current}
                    onClick={onTriggerClick(menu.key)}
                    onPointerEnter={onTriggerEnter(menu.key)}
                    onFocus={() => setPrimed(true)}
                    className={`flex h-[68px] cursor-pointer items-center gap-[7px] transition-colors duration-150 hover:text-ink focus-visible:-outline-offset-2 ${on || current ? "text-ink" : ""}`}
                  >
                    {menu.label}
                    <span
                      aria-hidden="true"
                      className="block size-[6.4px] border-r-[1.4px] border-b-[1.4px] border-current transition-[transform,margin] duration-200 ease-[ease] motion-reduce:transition-none"
                      style={{ transform: on ? "rotate(-135deg)" : "rotate(45deg)", marginTop: on ? 3 : -3 }}
                    />
                  </button>
                  <div
                    id={`menu-${menu.key}`}
                    data-sh-panel=""
                    data-open={on ? "" : undefined}
                    inert={!on}
                    aria-hidden={on ? undefined : true}
                    onClick={onPanelClick}
                    className="absolute inset-x-0 top-full mt-px border-b border-[rgba(20,20,18,0.09)] bg-[#FBFAF8] whitespace-normal shadow-[0_40px_60px_-40px_rgba(20,20,18,0.28)]"
                  >
                    <PanelContent menu={menu} pathname={pathname} primed={primed} />
                  </div>
                </li>
              );
            })}
            {links.map((link) => {
              const current = sectionCurrent(link.href, pathname);
              return (
                <li key={link.label}>
                  <SmartLink
                    href={localHref(link.href, pathname)}
                    aria-current={current}
                    onPointerEnter={onPlainLinkEnter}
                    className={`transition-colors duration-150 hover:text-ink ${current ? "text-ink" : ""}`}
                  >
                    {link.label}
                  </SmartLink>
                </li>
              );
            })}
          </ul>
        </nav>
        <SmartLink
          href={localHref(cta.bar.href, pathname)}
          className="flex h-[38px] flex-none items-center rounded-[6px] border border-line bg-white px-4 text-[13.5px] tracking-[-0.01em] whitespace-nowrap text-ink transition-colors duration-150 hover:border-a"
        >
          {cta.bar.label}
        </SmartLink>
      </div>

      {/* Compact bar ----------------------------------------------------------- */}
      <div className="flex h-[68px] items-center gap-2.5 px-5 lg:hidden">
        <SmartLink href={homeHref} onClick={closeForLink} className="text-[19px] text-ink">
          <Wordmark />
        </SmartLink>
        <span className="flex-auto" />
        <SmartLink
          href={localHref(cta.bar.href, pathname)}
          onClick={closeForLink}
          className="hidden h-[42px] flex-none items-center rounded-full border border-line bg-white px-4 text-[14px] tracking-[-0.01em] text-ink min-[600px]:flex"
        >
          {cta.bar.label}
        </SmartLink>
        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={sheetOpen}
          aria-controls="mobile-menu"
          onClick={toggleMenu}
          className={`flex h-11 flex-none cursor-pointer items-center gap-2.5 rounded-full border pr-4 pl-[18px] text-[14.5px] tracking-[-0.01em] transition-[background-color,border-color,color] duration-[180ms] ${
            sheetOpen ? "border-ink bg-ink text-white" : "border-line bg-white text-ink"
          }`}
        >
          <span>{sheetOpen ? "Close" : "Menu"}</span>
          <span aria-hidden="true" className="relative block h-2.5 w-3.5">
            {[0, 1].map((i) => (
              <span
                key={i}
                className="absolute inset-x-0 block h-[1.5px] rounded-[1px] bg-current transition-[top,transform] duration-[220ms] ease-[ease] motion-reduce:transition-none"
                style={{
                  top: sheetOpen ? 4.25 : i ? 7 : 1.5,
                  transform: sheetOpen ? `rotate(${i ? -45 : 45}deg)` : "none",
                }}
              />
            ))}
          </span>
        </button>
      </div>

      <div
        id="mobile-menu"
        ref={sheetRef}
        data-sh-sheet=""
        data-open={sheetOpen ? "" : undefined}
        inert={!sheetOpen}
        aria-hidden={sheetOpen ? undefined : true}
        className="absolute inset-x-0 top-full mt-px flex h-[calc(100vh-69px)] flex-col bg-page supports-[height:100dvh]:h-[calc(100dvh-69px)] lg:hidden"
      >
        <nav
          ref={scrollerRef}
          aria-label="Main"
          className="min-h-0 flex-auto overflow-y-auto overscroll-contain px-5 pt-1 pb-7"
        >
          <ul>
            {menus.map((menu) => {
              const on = group === menu.key;
              const current = sectionCurrent(menu.section, pathname);
              return (
                <li key={menu.key} className="border-b border-[rgba(20,20,18,0.09)]">
                  <button
                    ref={(el) => {
                      groupButtons.current[menu.key] = el;
                    }}
                    type="button"
                    aria-expanded={on}
                    aria-controls={`mobile-group-${menu.key}`}
                    aria-current={current}
                    onClick={() => setGroup((g) => (g === menu.key ? null : menu.key))}
                    className={`flex min-h-[60px] w-full cursor-pointer items-center justify-between gap-4 text-left text-[22px] tracking-[-0.026em] text-ink focus-visible:-outline-offset-2 ${current ? "font-medium" : ""}`}
                  >
                    <span>{menu.label}</span>
                    <span aria-hidden="true" className="relative block size-3.5 flex-none text-sec">
                      <span className="absolute inset-x-0 top-[6.25px] block h-[1.5px] bg-current" />
                      <span
                        className="absolute inset-y-0 left-[6.25px] block w-[1.5px] bg-current transition-transform duration-[220ms] ease-[ease] motion-reduce:transition-none"
                        style={{ transform: on ? "rotate(90deg)" : "none" }}
                      />
                    </span>
                  </button>
                  <div id={`mobile-group-${menu.key}`} hidden={!on} onClick={onGroupClick} className="pb-5">
                    <GroupContent menu={menu} pathname={pathname} />
                  </div>
                </li>
              );
            })}
            {links.map((link) => {
              const current = sectionCurrent(link.href, pathname);
              return (
                <li key={link.label} className="border-b border-[rgba(20,20,18,0.09)]">
                  <SmartLink
                    href={localHref(link.href, pathname)}
                    aria-current={current}
                    onClick={closeForLink}
                    className={`flex min-h-[60px] items-center text-[22px] tracking-[-0.026em] text-ink hover:text-ink focus-visible:-outline-offset-2 ${current ? "font-medium" : ""}`}
                  >
                    {link.label}
                  </SmartLink>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="grid flex-none gap-3 border-t border-[rgba(20,20,18,0.09)] bg-page px-5 pt-3.5 pb-[calc(16px+env(safe-area-inset-bottom))]">
          <SmartLink
            href={localHref(cta.sheet.href, pathname)}
            onClick={closeForLink}
            className="flex h-[50px] items-center justify-center rounded-[8px] bg-ink text-[15px] font-medium tracking-[-0.01em] text-white hover:text-white"
          >
            {cta.sheet.label}
          </SmartLink>
          <a href={`mailto:${cta.email}`} className="justify-self-center text-[13.5px] text-sec">
            {cta.email}
          </a>
        </div>
      </div>

      {progress ? (
        <div
          data-reading-progress=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -bottom-px h-0.5 origin-left bg-[#157F52]"
          style={{ transform: "scaleX(0)" }}
        />
      ) : null}
    </header>
  );
}
