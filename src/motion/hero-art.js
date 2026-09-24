// ── Hero art: scroll-displaced painting ───────────────────────────────────────
// Loads assets/hero-valley.png as a texture onto a full-bleed plane and displaces it against
// scroll position. Runs on the IMAGE LAYER ONLY — the scrim, headline, CTAs and cards are DOM
// siblings painted above this canvas, so nothing but the painting's own pixels moves.
//
// The rAF loop is dirty-flagged (_artDirty): scroll events mark it, the loop only re-renders
// when marked. Keep that. An unconditional render here costs a GPU frame on every idle tick.
//
// Degrades silently: if three fails to load or WebGL is unavailable, initArt() returns and the
// canvas's own CSS background (the same painting) is what the user sees. Preserve that fallback — do not make the hero depend
// on this module resolving.
import { loadThree } from "./three-loader.js";

const ELEMENTS = [
  "artCv"
];

// PORT NOTE: the canvas's CSS background-image points at the same URL (see Hero.tsx), so the
// painting downloads once and doubles as the no-WebGL fallback. Hero.tsx also preloads it.
// The extraction template's unused `timers` / `done` fields and the prototype's phScroller()
// lookup (a PlatformSequence method this class never has) have been dropped.
export const HERO_SRC = "/img/hero-valley.webp";

const DEFAULTS = {};

export class HeroArt {
  /**
   * @param {Object} els  one DOM node per key in ELEMENTS (missing keys are tolerated)
   * @param {Object} opts overrides for DEFAULTS
   */
  constructor(els = {}, opts = {}) {
    this.props = { ...DEFAULTS, ...opts };
    // The method bodies below are lifted verbatim from the prototype, where these were
    // React refs. Wrapping each node as { current } keeps them working untouched — do not
    // "simplify" this away, or every line below has to be rewritten.
    for (const k of ELEMENTS) this[k] = { current: els[k] ?? null };
  }

  get reduced() {
    return typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;
  }

  async initArt() {
    const cv = this.artCv.current;
    if (!cv || this._destroyed) return;
    let T;
    try { T = await loadThree(); } catch (e) { return; }
    // PORT FIX (Strict Mode): destroy() can run while three is loading. Every await below is
    // followed by this check, so a system destroyed mid-init never builds a renderer, a loop or
    // a listener.
    if (this._destroyed) return;

    const tex = await new Promise((res) => {
      new T.TextureLoader().load(HERO_SRC, (t) => {
        t.flipY = false;
        t.wrapS = t.wrapT = T.ClampToEdgeWrapping;
        t.minFilter = t.magFilter = T.LinearFilter;
        res(t);
      }, undefined, () => res(null));
    });
    if (!tex) return;
    if (this._destroyed) { tex.dispose(); return; }

    const iw = tex.image.width, ih = tex.image.height;
    const scene = new T.Scene();
    const cam = new T.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1);
    // PORT FIX: no WebGL (or a context the GPU refuses) is a supported outcome, not an error for
    // the page: the canvas keeps its CSS background, which is the same painting.
    let r;
    try { r = new T.WebGLRenderer({ canvas: cv, alpha: true, antialias: false }); } catch (e) { tex.dispose(); return; }
    r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));

    const uni = {
      uTex: { value: tex },
      uScale: { value: new T.Vector2(1, 1) },
      uOff: { value: new T.Vector2(0, 0) },
      uTime: { value: 0 },
      uEnergy: { value: 0 }
    };
    const mesh = new T.Mesh(new T.PlaneGeometry(1, 1), new T.ShaderMaterial({
      uniforms: uni,
      transparent: true,
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy * 2.0, 0.0, 1.0); }",
      fragmentShader: [
        "precision highp float;",
        "varying vec2 vUv;",
        "uniform sampler2D uTex;",
        "uniform vec2 uScale, uOff;",
        "uniform float uTime, uEnergy;",
        "float wv(vec2 p, float t){",
        "  return sin(p.x * 3.1 + t * 0.7) * sin(p.y * 2.3 - t * 0.55)",
        "       + 0.5 * sin(p.x * 6.7 - t * 1.1) * sin(p.y * 5.3 + t * 0.9);",
        "}",
        "void main(){",
        "  vec2 base = vec2(vUv.x, 1.0 - vUv.y);",
        "  float e = uEnergy;",
        // two-octave domain warp, vertically biased so it reads as water settling rather than heat
        "  vec2 q = base * vec2(1.0, 1.6);",
        "  vec2 warp = vec2(wv(q * 3.0, uTime), wv(q * 6.3 + 4.7, uTime * 1.3));",
        "  warp *= (0.0016 + 0.0092 * e);",
        "  warp.y *= 1.45;",
        "  vec2 uv = (base + warp) * uScale + uOff;",
        // watercolour bleed: three taps spread along the warp direction, pigment pulling outward
        "  vec2 sp = warp * (0.6 + 2.4 * e);",
        "  vec4 c0 = texture2D(uTex, clamp(uv, 0.0, 1.0));",
        "  vec3 c = c0.rgb * 0.5",
        "        + texture2D(uTex, clamp(uv + sp, 0.0, 1.0)).rgb * 0.25",
        "        + texture2D(uTex, clamp(uv - sp, 0.0, 1.0)).rgb * 0.25;",
        // faint per-channel separation, the way wet pigment splits on paper
        "  c.r = mix(c.r, texture2D(uTex, clamp(uv + sp * 1.7, 0.0, 1.0)).r, 0.38 * e);",
        "  c.b = mix(c.b, texture2D(uTex, clamp(uv - sp * 1.7, 0.0, 1.0)).b, 0.38 * e);",
        "  gl_FragColor = vec4(c, c0.a);",
        "}"
      ].join("\n")
    }));
    scene.add(mesh);

    const fit = () => {
      const cw = cv.clientWidth || 1200, ch = cv.clientHeight || 660;
      r.setSize(cw, ch, false);
      // reproduce background-size:cover / background-position:center top exactly
      const sc = Math.max(cw / iw, ch / ih);
      const dw = iw * sc, dh = ih * sc;
      uni.uScale.value.set(cw / dw, ch / dh);
      uni.uOff.value.set(-((cw - dw) / 2) / dw, 0);
    };
    // PORT FIX (idle cost): the prototype re-queued this loop on every frame forever and only
    // skipped the render when clean. Here the loop runs only while there is something to draw
    // (dirty, or ripple energy above the rest threshold) and parks otherwise; scroll and resize
    // wake it. The frames it renders, and the energy / uTime they render with, are the same.
    const wake = () => { if (!this.artRaf && !this._destroyed) this.artRaf = requestAnimationFrame(loop); };

    fit();
    this._artFit = () => { fit(); this._artDirty = true; wake(); };
    this._artDirty = true;
    window.addEventListener("resize", this._artFit);

    // scroll velocity feeds the ripple; it decays back to a near-still baseline
    const sc = document.scrollingElement || document.body;
    let last = sc.scrollTop, energy = 0;
    const hero = cv.parentElement;
    // PORT FIX (off-screen cost): scrolling anywhere on the page woke the loop once per scroll
    // event, only for it to find the hero off screen and park. An IntersectionObserver with the
    // loop's own 100px margin now says whether the hero is near: away from it, scroll still feeds
    // the energy (held until the hero returns, as in the prototype) but requests no frame, and
    // the hero coming back into the margin wakes the loop.
    let near = true;
    if ("IntersectionObserver" in window) {
      this._artIO = new IntersectionObserver((es) => {
        near = es[es.length - 1].isIntersecting;
        if (near) wake();
      }, { rootMargin: "100px 0px" });
      this._artIO.observe(hero);
    }
    this._artScroll = () => {
      const now = sc.scrollTop;
      energy = Math.min(1, energy + Math.min(0.42, Math.abs(now - last) * 0.011));
      last = now;
      if (near) wake();
    };
    // PORT FIX: the prototype scrolled inside <body>, so its scroller received the scroll events.
    // In the app the window scrolls: document.scrollingElement (<html>) reports scrollTop but
    // never fires "scroll" itself — the event goes to document/window. Listen there.
    const scTarget = sc === document.scrollingElement || sc === document.documentElement ? window : sc;
    scTarget.addEventListener("scroll", this._artScroll, { passive: true });

    const t0 = performance.now();
    const loop = (ms) => {
      this.artRaf = 0;
      const rect = hero.getBoundingClientRect();
      const onScreen = rect.bottom > -100 && rect.top < window.innerHeight + 100;
      // at rest the painting is simply still — only a scroll wakes the ripple
      if (onScreen && (this._artDirty || (!this.reduced && energy > 0.0025))) {
        if (!this.reduced) {
          energy *= 0.945;
          uni.uTime.value = (ms - t0) / 1000;
        }
        uni.uEnergy.value = this.reduced ? 0 : energy;
        r.render(scene, cam);
        this._artDirty = false;
        // still settling: keep going. Off screen, energy is held (as in the prototype) and the
        // hero's return wakes the loop.
        if (!this.reduced && energy > 0.0025) this.artRaf = requestAnimationFrame(loop);
      }
    };
    this._artGL = { r: r, mesh: mesh, tex: tex, sc: scTarget };
    wake();
  }


  start() { return this.initArt(); }

  destroy() {
    this._destroyed = true;
    if (this.artRaf) cancelAnimationFrame(this.artRaf);
    this.artRaf = 0;
    if (this._artFit) window.removeEventListener("resize", this._artFit);
    this._artFit = null;
    if (this._artIO) this._artIO.disconnect();
    this._artIO = null;
    if (this._artGL) {
      if (this._artScroll && this._artGL.sc) this._artGL.sc.removeEventListener("scroll", this._artScroll);
      // PORT FIX: the canvas outlives the system (e.g. the viewport crosses 768px, or Strict
      // Mode rebuilds it). Clear the last WebGL frame so the CSS background shows through
      // instead of a stale, stretched bitmap.
      this._artGL.r.setClearColor(0x000000, 0);
      this._artGL.r.clear();
      this._artGL.mesh.geometry.dispose();
      this._artGL.mesh.material.dispose();
      this._artGL.tex.dispose();
      this._artGL.r.dispose();
      this._artGL = null;
    }
  }
}
