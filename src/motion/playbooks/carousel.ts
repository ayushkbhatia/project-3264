// Playbooks featured carousel controller. Framework-agnostic; the state lives here, not in React.
// It mirrors stepCarousel()/go() in reference/Playbooks.dc.html, plus the production
// a11y additions from specs/03 (focus hold, pause toggle, inert inactive slides).
//
// DOM contract:
//   viewport  the overflow:hidden wrapper (hover and focus hold)
//   track     flex row holding the slides (gap 24px)
//   slides    one element per slide, in order
//   fills     one progress-fill element per segment (inside the 2px track)
//
// React usage:
//   useEffect(() => {
//     const c = mountCarousel({ viewport, track, slides, fills }, { onChange: setActive });
//     return c.destroy;
//   }, []);
//   Wire the arrows to c.prev()/c.next(), the segments to c.go(i), and the pause toggle to c.togglePause().
//
// Lifted from design_handoff_playbooks/motion/carousel.ts. Changes made for the port are marked
// PORT FIX:
//   1. `inert` goes on an inactive slide's children, not the slide. An inert element is skipped
//      by hit testing, so a click on a peeking slide landed on the viewport and never reached
//      onSlideClick; click-to-activate did nothing. Its link is still out of the tab order.
//   2. `hold` option: an extra hold the host decides (keyboard focus in the controls row, which
//      sits outside the viewport).
//   3. suspend() / resume(): stop the rAF loop while the carousel is off screen (MOTION.md,
//      performance budget); progress resumes from where it stood.

export type CarouselEls = {
  viewport: HTMLElement;
  track: HTMLElement;
  slides: HTMLElement[];
  fills: HTMLElement[];
};

export type CarouselOptions = {
  dwellMs?: number;      // 7000
  gap?: number;          // 24
  maxSlide?: number;     // 1200
  sideInset?: number;    // 80 (total), i.e. slide width = min(maxSlide, W - sideInset)
  inactiveOpacity?: number; // 0.4
  onChange?: (index: number) => void;
  onPauseChange?: (paused: boolean) => void;
  /** PORT FIX 2: hold while this returns true. */
  hold?: () => boolean;
};

export function mountCarousel(els: CarouselEls, opts: CarouselOptions = {}) {
  const DWELL = opts.dwellMs ?? 7000;
  const GAP = opts.gap ?? 24;
  const MAX = opts.maxSlide ?? 1200;
  const INSET = opts.sideInset ?? 80;
  const DIM = String(opts.inactiveOpacity ?? 0.4);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const n = els.slides.length;

  let index = 0;
  let progress = 0;          // 0..1 for the active slide
  let hover = false;
  let focusIn = false;
  let userPaused = false;
  let width = -1;
  let slideW = 0;
  let last = -1;
  let raf = 0;
  let shown = -1;

  const held = () => hover || focusIn || userPaused || reduce.matches || document.visibilityState === "hidden" || !!opts.hold?.();

  const layout = (force = false) => {
    const W = els.viewport.clientWidth;
    if (!force && W === width) return;
    width = W;
    slideW = Math.min(MAX, W - INSET);
    const prev = els.track.style.transition;
    els.track.style.transition = "none";          // no slide during resize
    els.track.style.paddingLeft = ((W - slideW) / 2).toFixed(1) + "px";
    els.slides.forEach((s) => { s.style.width = slideW + "px"; });
    els.track.style.transform = `translateX(${(-index * (slideW + GAP)).toFixed(1)}px)`;
    void els.track.offsetWidth;                   // flush
    els.track.style.transition = prev;
  };

  const paint = () => {
    if (shown !== index) {
      shown = index;
      els.track.style.transform = `translateX(${(-index * (slideW + GAP)).toFixed(1)}px)`;
      els.slides.forEach((s, k) => {
        const on = k === index;
        s.style.opacity = on ? "1" : DIM;
        s.style.cursor = on ? "auto" : "pointer";
        // PORT FIX 1: was s.toggleAttribute("inert", !on)
        Array.from(s.children).forEach((c) => c.toggleAttribute("inert", !on));
        s.setAttribute("aria-hidden", on ? "false" : "true");
      });
      opts.onChange?.(index);
    }
    const p = reduce.matches ? 1 : progress;
    els.fills.forEach((f, k) => {
      f.style.width = (k < index ? 100 : k === index ? p * 100 : 0).toFixed(2) + "%";
    });
  };

  const go = (i: number) => {
    index = ((i % n) + n) % n;
    progress = 0;
    paint();
  };

  const frame = (ms: number) => {
    raf = requestAnimationFrame(frame);
    const dt = last < 0 ? 0 : ms - last;
    last = ms;
    layout();
    if (!held()) {
      progress += dt / DWELL;
      if (progress >= 1) go(index + 1);
    }
    paint();
  };

  // Clicking a peeking (inactive) slide activates it instead of following its link.
  const onSlideClick = (e: MouseEvent) => {
    const k = els.slides.indexOf(e.currentTarget as HTMLElement);
    if (k !== index) { e.preventDefault(); go(k); }
  };
  els.slides.forEach((s) => s.addEventListener("click", onSlideClick));

  const onEnter = () => { hover = true; };
  const onLeave = () => { hover = false; };
  const onFocusIn = () => { focusIn = true; };
  const onFocusOut = (e: FocusEvent) => {
    if (!els.viewport.contains(e.relatedTarget as Node)) focusIn = false;
  };
  els.viewport.addEventListener("mouseenter", onEnter);
  els.viewport.addEventListener("mouseleave", onLeave);
  els.viewport.addEventListener("focusin", onFocusIn);
  els.viewport.addEventListener("focusout", onFocusOut);

  layout(true);
  paint();
  raf = requestAnimationFrame(frame);

  return {
    go,
    next: () => go(index + 1),
    prev: () => go(index - 1),
    togglePause: () => { userPaused = !userPaused; opts.onPauseChange?.(userPaused); return userPaused; },
    // PORT FIX 3: `last = -1` so the first frame after resuming adds no time.
    suspend: () => { cancelAnimationFrame(raf); raf = 0; },
    resume: () => { if (!raf) { last = -1; raf = requestAnimationFrame(frame); } },
    get index() { return index; },
    destroy: () => {
      cancelAnimationFrame(raf);
      els.slides.forEach((s) => s.removeEventListener("click", onSlideClick));
      els.viewport.removeEventListener("mouseenter", onEnter);
      els.viewport.removeEventListener("mouseleave", onLeave);
      els.viewport.removeEventListener("focusin", onFocusIn);
      els.viewport.removeEventListener("focusout", onFocusOut);
    },
  };
}
