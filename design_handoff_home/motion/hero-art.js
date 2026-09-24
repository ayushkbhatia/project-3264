// ── Hero art: scroll-displaced painting ───────────────────────────────────────
// Loads assets/hero-valley.png as a texture onto a full-bleed plane and displaces it against
// scroll position. Runs on the IMAGE LAYER ONLY — the scrim, headline, CTAs and cards are DOM
// siblings painted above this canvas, so nothing but the painting's own pixels moves.
//
// The rAF loop is dirty-flagged (_artDirty): scroll events mark it, the loop only re-renders
// when marked. Keep that. An unconditional render here costs a GPU frame on every idle tick.
//
// Degrades silently: if three fails to load or WebGL is unavailable, initArt() returns and the
// underlying <img> is what the user sees. Preserve that fallback — do not make the hero depend
// on this module resolving.
import { loadThree } from "./three-loader.js";

const ELEMENTS = [
  "artCv"
];

const DEFAULTS = {};

export class HeroArt {
  /**
   * @param {Object} els  one DOM node per key in ELEMENTS (missing keys are tolerated)
   * @param {Object} opts overrides for DEFAULTS
   */
  constructor(els = {}, opts = {}) {
    this.props = { ...DEFAULTS, ...opts };
    this.timers = [];
    this.done = false;
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
    if (!cv) return;
    let T;
    try { T = await import("https://esm.sh/three@0.161.0"); } catch (e) { return; }

    const tex = await new Promise((res) => {
      new T.TextureLoader().load("assets/hero-valley.png", (t) => {
        t.flipY = false;
        t.wrapS = t.wrapT = T.ClampToEdgeWrapping;
        t.minFilter = t.magFilter = T.LinearFilter;
        res(t);
      }, undefined, () => res(null));
    });
    if (!tex) return;

    const iw = tex.image.width, ih = tex.image.height;
    const scene = new T.Scene();
    const cam = new T.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1);
    const r = new T.WebGLRenderer({ canvas: cv, alpha: true, antialias: false });
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
    fit();
    this._artFit = () => { fit(); this._artDirty = true; };
    this._artDirty = true;
    window.addEventListener("resize", this._artFit);

    // scroll velocity feeds the ripple; it decays back to a near-still baseline
    const sc = this.phScroller ? this.phScroller() : document.scrollingElement || document.body;
    let last = sc.scrollTop, energy = 0;
    this._artScroll = () => {
      const now = sc.scrollTop;
      energy = Math.min(1, energy + Math.min(0.42, Math.abs(now - last) * 0.011));
      last = now;
    };
    sc.addEventListener("scroll", this._artScroll, { passive: true });

    const hero = cv.parentElement;
    const t0 = performance.now();
    const loop = (ms) => {
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
      }
      this.artRaf = requestAnimationFrame(loop);
    };
    this.artRaf = requestAnimationFrame(loop);
    this._artGL = { r: r, mesh: mesh, tex: tex, sc: sc };
  }


  start() { return this.initArt(); }

  destroy() {
    if (this.artRaf) cancelAnimationFrame(this.artRaf);
    if (this._artFit) window.removeEventListener("resize", this._artFit);
    if (this._artGL) {
      if (this._artScroll && this._artGL.sc) this._artGL.sc.removeEventListener("scroll", this._artScroll);
      this._artGL.mesh.geometry.dispose();
      this._artGL.mesh.material.dispose();
      this._artGL.tex.dispose();
      this._artGL.r.dispose();
      this._artGL = null;
    }
  }
}
