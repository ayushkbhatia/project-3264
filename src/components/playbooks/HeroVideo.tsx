"use client";

import { useEffect, useRef } from "react";
import { mountHeroVideo } from "@/motion/playbooks/hero-video";
import { HERO_POSTER, HERO_VIDEO } from "./media";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * The hero's looping video (MOTION.md M1–M3), driven by the handoff's controller
 * (src/motion/playbooks/hero-video.ts): fade in on first `canplay`, native loop over the
 * pre-rendered boomerang, eased playback rate into each turn, paused off screen, in hidden tabs
 * and under reduced motion (where the poster, the first frame, shows instead).
 *
 * The file is attached after hydration, not in the server HTML, so it never competes with the
 * first paint (specs/08), and never at all under reduced motion, where it would not play. No
 * `autoPlay` for the same reason: the controller starts playback itself when motion is allowed.
 * Decorative: aria-hidden, no controls, no audio track.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = window.matchMedia(REDUCED_MOTION);
    let attached = false;
    const attach = () => {
      if (attached || reduce.matches) return;
      attached = true;
      for (const { src, media } of HERO_VIDEO) {
        const source = document.createElement("source");
        source.src = src;
        source.type = "video/mp4";
        if (media) source.media = media;
        video.appendChild(source);
      }
      video.load();
    };
    attach();
    const unmount = mountHeroVideo(video);
    // Reduced motion switched off mid-visit: fetch the file now. The controller's own listener
    // (registered first) has already asked it to play; it starts on `canplay`.
    reduce.addEventListener("change", attach);
    return () => {
      unmount();
      reduce.removeEventListener("change", attach);
    };
  }, []);

  return (
    <video
      ref={ref}
      data-hero-video=""
      poster={HERO_POSTER}
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      className="absolute inset-0 h-full w-full object-cover object-bottom opacity-0"
    />
  );
}
