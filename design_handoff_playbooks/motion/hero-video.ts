// Playbooks hero video controller: boomerang loop with eased turns.
// Framework-agnostic. In React: const ref = useRef<HTMLVideoElement>(null);
// useEffect(() => ref.current ? mountHeroVideo(ref.current) : undefined, []);
//
// Expects a pre-rendered boomerang file (forward + reversed, see MOTION.md), so the
// ping-pong itself is native `loop`. This module only fades the video in, eases the
// playback rate near each turn, and pauses when off screen, hidden, or reduced-motion.

export type HeroVideoOptions = {
  /** Seconds either side of a turn over which the rate eases. Default 0.7 (matches the reference). */
  turnWindow?: number;
  /** Playback rate at a turn. Default 0.3 (matches the reference). */
  minRate?: number;
  /** Fade-in duration on first canplay, in ms. Default 500. */
  fadeMs?: number;
  /** Reveal the poster after this long if canplay never fires, in ms. Default 1500. */
  revealFallbackMs?: number;
};

export function mountHeroVideo(video: HTMLVideoElement, opts: HeroVideoOptions = {}): () => void {
  const E = opts.turnWindow ?? 0.7;
  const MIN = opts.minRate ?? 0.3;
  const FADE = opts.fadeMs ?? 500;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  video.muted = true;
  video.playsInline = true;
  video.loop = true;

  let raf = 0;
  let revealed = false;
  let onScreen = true;

  const smooth = (k: number) => k * k * (3 - 2 * k);
  const rateAt = (edge: number) => MIN + (1 - MIN) * smooth(Math.max(0, Math.min(1, edge / E)));

  const reveal = (animate: boolean) => {
    if (revealed) return;
    revealed = true;
    video.style.transition = animate ? `opacity ${FADE}ms linear` : "none";
    video.style.opacity = "1";
  };

  const tick = () => {
    raf = requestAnimationFrame(tick);
    const D = video.duration;
    if (!D || !isFinite(D)) return;
    const t = video.currentTime;
    const edge = Math.min(t, Math.abs(D / 2 - t), D - t);
    const r = Math.round(rateAt(edge) * 20) / 20;
    if (video.playbackRate !== r) video.playbackRate = r;
  };

  const stopLoop = () => { cancelAnimationFrame(raf); raf = 0; };
  const shouldPlay = () => !reduce.matches && onScreen && document.visibilityState === "visible";

  const sync = () => {
    if (reduce.matches) {
      stopLoop();
      video.pause();
      reveal(false);
      return;
    }
    if (shouldPlay()) {
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => { /* autoplay blocked: poster stays */ });
      if (!raf) raf = requestAnimationFrame(tick);
    } else {
      stopLoop();
      video.pause();
    }
  };

  const onCanPlay = () => { reveal(!reduce.matches); sync(); };
  video.addEventListener("canplay", onCanPlay);
  if (video.readyState >= 3) onCanPlay();

  const fallback = window.setTimeout(() => { if (video.poster) reveal(true); }, opts.revealFallbackMs ?? 1500);

  const io = new IntersectionObserver((entries) => {
    onScreen = entries.some((e) => e.isIntersecting);
    sync();
  }, { threshold: 0 });
  io.observe(video);

  const onVis = () => sync();
  document.addEventListener("visibilitychange", onVis);
  const onReduce = () => sync();
  reduce.addEventListener("change", onReduce);

  sync();

  return () => {
    stopLoop();
    window.clearTimeout(fallback);
    io.disconnect();
    video.removeEventListener("canplay", onCanPlay);
    document.removeEventListener("visibilitychange", onVis);
    reduce.removeEventListener("change", onReduce);
  };
}
