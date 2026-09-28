"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import { SmartLink } from "@/components/home/primitives";
import { mountCarousel } from "@/motion/playbooks/carousel";
import { carousel, categoryById, featured, playbookBySlug, playbookHref } from "@/content/playbooks";
import { FEATURE_SIZES, featureImages } from "./media";
import { PlaybookBadge } from "./PlaybookBadge";

// Featured carousel (specs/03, MOTION.md M4–M5). Six slides, one centred, its neighbours peeking
// at 40%; it advances every 7s and holds while the pointer is over the slides, while keyboard
// focus is in the carousel, while paused, in hidden tabs and under reduced motion.
//
// The state lives in the handoff's controller (src/motion/playbooks/carousel.ts), not in React:
// the 60fps progress fill never re-renders anything. React renders the first frame (slide 1
// active) and hands the elements over; the controller then owns the track transform, the slide
// widths, opacities, cursors, aria-hidden and inert, and the fill widths. None of those props
// change between renders, so React never writes them again.
//
// Geometry before the controller runs: the viewport is a size container, so the slide width
// min(1200px, 100cqw − 80px) and the track's left inset are exactly what the controller will
// compute from clientWidth. Nothing moves when it takes over.
//
// Added to the design (specs/03, specs/08): a pause/play toggle left of the arrows (WCAG 2.2.2),
// region and slide roles, Left/Right on the segments and arrows, horizontal swipe on touch, and
// the loop suspended while the carousel is off screen.

const slides = featured.map((slug) => {
  const p = playbookBySlug(slug)!;
  return { ...p, image: featureImages[slug], categoryLabel: categoryById(p.category).label };
});

const SWIPE_PX = 40;

export function FeaturedCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<HTMLDivElement[]>([]);
  const fillRefs = useRef<HTMLSpanElement[]>([]);
  const segRefs = useRef<HTMLButtonElement[]>([]);
  const controller = useRef<ReturnType<typeof mountCarousel> | null>(null);
  const controlsFocused = useRef(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const section = sectionRef.current!;
    const viewport = viewportRef.current!;
    const c = mountCarousel(
      { viewport, track: trackRef.current!, slides: slideRefs.current, fills: fillRefs.current },
      {
        onChange: (index) =>
          segRefs.current.forEach((b, k) => b.setAttribute("aria-current", k === index ? "true" : "false")),
        onPauseChange: setPaused,
        hold: () => controlsFocused.current,
      },
    );
    controller.current = c;

    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) c.resume();
      else c.suspend();
    });
    io.observe(section);

    // Swipe (touch and pen only; the mouse has the arrows). touch-action: pan-y leaves vertical
    // scrolling to the browser, which cancels the pointer when it takes a pan over.
    let start: { id: number; x: number; y: number } | null = null;
    let swiped = false;
    const down = (e: PointerEvent) => {
      swiped = false;
      start = e.pointerType === "mouse" ? null : { id: e.pointerId, x: e.clientX, y: e.clientY };
    };
    const up = (e: PointerEvent) => {
      if (!start || e.pointerId !== start.id) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      start = null;
      if (Math.abs(dx) >= SWIPE_PX && Math.abs(dx) > Math.abs(dy)) {
        swiped = true;
        if (dx < 0) c.next();
        else c.prev();
      }
    };
    const cancel = () => { start = null; };
    // A swipe that ends over a peeking slide must not also activate it, or follow a link.
    const click = (e: MouseEvent) => {
      if (!swiped) return;
      swiped = false;
      e.preventDefault();
      e.stopPropagation();
    };
    viewport.addEventListener("pointerdown", down);
    viewport.addEventListener("pointerup", up);
    viewport.addEventListener("pointercancel", cancel);
    viewport.addEventListener("click", click, true);

    return () => {
      io.disconnect();
      viewport.removeEventListener("pointerdown", down);
      viewport.removeEventListener("pointerup", up);
      viewport.removeEventListener("pointercancel", cancel);
      viewport.removeEventListener("click", click, true);
      c.destroy();
      controller.current = null;
    };
  }, []);

  // Left/Right step the carousel from the segments and the arrows. On a segment, focus follows
  // the active slide's segment, so the key keeps working from where the visitor is.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const c = controller.current;
    if (!c || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
    if (!(e.target instanceof HTMLButtonElement)) return;
    e.preventDefault();
    if (e.key === "ArrowLeft") c.prev();
    else c.next();
    if (segRefs.current.includes(e.target)) segRefs.current[c.index]?.focus();
  };

  // The controls row sits outside the viewport, so the controller's own focus hold does not see
  // it. Hold for keyboard focus only: a mouse click on an arrow leaves focus on it, and holding
  // then would stop the rotation until the visitor clicked somewhere else.
  const onFocus = (e: FocusEvent<HTMLDivElement>) => {
    controlsFocused.current = e.target.matches(":focus-visible");
  };
  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) controlsFocused.current = false;
  };

  const arrow =
    "flex size-11 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-[17px] leading-none text-ink hover:border-ink";

  return (
    <section
      ref={sectionRef}
      data-screen-label="Featured"
      role="region"
      aria-roledescription="carousel"
      aria-label={carousel.regionLabel}
      className="pt-10"
    >
      <div
        ref={viewportRef}
        className="relative touch-pan-y touch-pinch-zoom overflow-hidden [container-type:inline-size]"
      >
        <div
          ref={trackRef}
          className="flex gap-6"
          style={{
            paddingLeft: "calc((100cqw - min(1200px, 100cqw - 80px)) / 2)",
            transition: "transform 700ms cubic-bezier(0.2,0.7,0.2,1)",
            willChange: "transform",
          }}
        >
          {slides.map((s, i) => (
            <div
              key={s.slug}
              ref={(el) => { if (el) slideRefs.current[i] = el; }}
              data-slide={i}
              role="group"
              aria-roledescription="slide"
              aria-label={carousel.slideLabel(i + 1, slides.length, s.name)}
              aria-hidden={i !== 0}
              className="box-border grid flex-none grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-3.5 rounded-[22px] bg-[#EEECE7] p-3.5 transition-opacity duration-500 ease-[ease]"
              style={{
                width: "min(1200px, calc(100cqw - 80px))",
                opacity: i === 0 ? 1 : 0.4,
                cursor: i === 0 ? "auto" : "pointer",
              }}
            >
              <div inert={i !== 0} className="flex flex-col justify-center p-[clamp(20px,3.4vw,44px)]">
                {/* #6B6A64, not the design's --mut #6E6D67: on the slide's #EEECE7 that is 4.40:1,
                    under AA's 4.5 for 13px text; this is 4.6:1 and reads the same. */}
                <span className="text-[13px] tracking-[-0.005em] text-[#6B6A64]">{s.categoryLabel}</span>
                <h3 className="mt-4 mb-0 text-[clamp(28px,2.8vw,40px)] leading-[1.06] font-normal tracking-[-0.034em] text-balance text-ink">
                  {s.name}
                </h3>
                <p className="mt-4 mb-0 max-w-[440px] text-[16px] leading-[1.55] text-sec">{s.blurb}</p>
                <SmartLink
                  href={playbookHref(s.slug)}
                  className="mt-7 inline-flex h-[42px] items-center self-start rounded-[8px] bg-ink px-[18px] text-[14px] font-medium tracking-[-0.01em] text-white hover:bg-a hover:text-white forced-colors:border"
                >
                  {carousel.cta}
                  <span className="sr-only">: {s.name}</span>
                </SmartLink>
              </div>
              <div
                inert={i !== 0}
                className="relative min-h-[clamp(240px,30vw,400px)] overflow-hidden rounded-[14px] bg-[#E2DFD8]"
              >
                <Image src={s.image} alt="" fill sizes={FEATURE_SIZES} className="rounded-[14px] object-cover" />
                <PlaybookBadge slug={s.slug} size="30%" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        className="mx-auto flex max-w-[1280px] items-center gap-6 px-10 pt-6 max-[479.98px]:px-5"
      >
        <div className="flex min-w-0 flex-auto gap-3">
          {slides.map((s, i) => (
            <button
              key={s.slug}
              ref={(el) => { if (el) segRefs.current[i] = el; }}
              type="button"
              aria-label={carousel.show(s.name)}
              aria-current={i === 0 ? "true" : "false"}
              onClick={() => controller.current?.go(i)}
              className="relative flex h-5 min-w-0 flex-[1_1_0] cursor-pointer items-center p-0 before:absolute before:inset-x-0 before:-inset-y-3 before:content-['']"
            >
              <span className="relative block h-[2px] w-full overflow-hidden bg-[rgba(20,20,18,0.14)]">
                <span
                  ref={(el) => { if (el) fillRefs.current[i] = el; }}
                  data-seg-fill=""
                  className="absolute top-0 bottom-0 left-0 w-0 bg-ink forced-colors:bg-[CanvasText]"
                />
              </span>
            </button>
          ))}
        </div>
        <div className="flex gap-2.5">
          {/* Nothing rotates under reduced motion, so there is nothing to pause. */}
          <button
            type="button"
            aria-label={paused ? carousel.play : carousel.pause}
            onClick={() => controller.current?.togglePause()}
            className={`${arrow} motion-reduce:hidden`}
          >
            {paused ? (
              <svg aria-hidden="true" viewBox="0 0 10 11" className="ml-0.5 h-[11px] w-[10px]" fill="currentColor">
                <path d="M0 0 10 5.5 0 11Z" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 9 11" className="h-[11px] w-[9px]" fill="currentColor">
                <path d="M0 0h3v11H0zM6 0h3v11H6z" />
              </svg>
            )}
          </button>
          <button type="button" aria-label={carousel.prev} onClick={() => controller.current?.prev()} className={arrow}>
            ←
          </button>
          <button type="button" aria-label={carousel.next} onClick={() => controller.current?.next()} className={arrow}>
            →
          </button>
        </div>
      </div>
    </section>
  );
}
