// ── Intro: wordmark relief ────────────────────────────────────────────────────
// A full-viewport overlay that plays once on load, then removes itself.
//
// The wordmark is rasterised to an offscreen 1024x512 canvas, that bitmap is sampled into a
// grid of cells, and the cells are driven as a displacement relief in WebGL. The whole thing
// runs off ONE normalised clock `s` (0 -> ~4.0); iStep(s) is a pure function of s, so scrubbing,
// pacing (introPace) and the skip are all just changes to what s is when iStep is called.
//
// Entry point: start() / maybeIntro().  Honours prefers-reduced-motion (skips outright).
// The overlay is dismissable — click, or any keypress, calls skipIntro().
//
// WHY IT MUST NOT BECOME A CSS TRANSITION: the relief samples a bitmap per cell per frame.
// There is no declarative equivalent. Port it as-is.
import { loadThree } from "./three-loader.js";

const ELEMENTS = [
  "iWrap",
  "iGrid",
  "iMark",
  "iCap",
  "iCv",
  "iLock",
  "iSfx"
];

const DEFAULTS = {
  "playIntro": true,
  "introPace": 1,
  "accent": "#157F52"
};

export class IntroRelief {
  /**
   * @param {Object} els  one DOM node per key in ELEMENTS (missing keys are tolerated)
   * @param {Object} opts overrides for DEFAULTS
   */
  constructor(els = {}, opts = {}) {
    this.props = { ...DEFAULTS, ...opts };
    this.timers = [];
    this.done = false;
    // PORT FIX: set by destroy(). start() and iSetupGL() are asynchronous relative to it (see
    // start() and runIntro()), so both check it before building anything.
    this._destroyed = false;
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

  maybeIntro() {
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if ((this.props.playIntro ?? true) && !reduced) this.runIntro();
  }

  // Teardown never depends on a single animation callback: the overlay stops swallowing
  // clicks the moment the intro is logically over, and hiding runs once from whichever
  // of onfinish / timeout arrives first. A missed onfinish can no longer kill the page.
  iTeardown(wrap, ms) {
    if (!wrap) return;
    wrap.style.pointerEvents = "none";
    const finish = () => {
      if (this._iGone) return;
      this._iGone = true;
      wrap.style.display = "none";
      wrap.style.opacity = "0";
      this.iDispose();
      this.iRelease();
    };
    this.timers.push(setTimeout(finish, ms + 120));
    return finish;
  }

  skipIntro = () => {
    const w = this.iWrap.current;
    if (!w || this.done) return;
    this.done = true;
    this.timers.forEach(clearTimeout);
    this.timers = [];
    const finish = this.iTeardown(w, 260);
    w.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, fill: "forwards" }).onfinish = finish;
  };

  get iPace() { return this.props.introPace ?? 1; }
  iEase(x) { return 1 - Math.pow(2, -9 * x); }
  iClamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  iSeg(s, a, b) { return this.iClamp((s - a) / (b - a)); }

  // the wordmark rasterised once — the source for the relief's cell bitmap
  iTextCanvas() {
    const W = 1024, H = 512, c = document.createElement("canvas");
    c.width = W; c.height = H;
    const x = c.getContext("2d");
    x.fillStyle = "#14140F";
    x.textAlign = "center";
    x.textBaseline = "middle";
    const fs = H * 0.62;
    if ("letterSpacing" in x) x.letterSpacing = (-fs * 0.05).toFixed(2) + "px";
    // PORT NOTE: next/font self-hosts Instrument Sans and pairs it with a metric-matched
    // "Instrument Sans Fallback" (older versions also renamed the family), so rasterise with the
    // stack <body> actually resolves to rather than naming the family literally.
    const fam = (typeof getComputedStyle === "function" && getComputedStyle(document.body).fontFamily) ||
      "'Instrument Sans','Helvetica Neue',Helvetica,sans-serif";
    x.font = "400 " + fs + "px " + fam;
    x.fillText("3264", W / 2, H * 0.52);
    return c;
  }

  iMeasure() {
    const pw = Math.min(980, window.innerWidth * 0.78);
    this.iPlaneH = pw / 2;
    const g = this.iGL;
    if (g) {
      const cw = g.cv.clientWidth, ch = g.cv.clientHeight;
      if (!cw || !ch) { g.w = cw; g.h = ch; return; }
      g.cam.aspect = cw / ch;
      g.camZ = (5.8 * ch / this.iPlaneH) / (2 * Math.tan(Math.PI * 15 / 180));
      g.cam.updateProjectionMatrix();
      g.r.setSize(cw, ch, false);
      g.w = cw; g.h = ch;
    }
  }

  async iSetupGL() {
    const cv = this.iCv.current;
    if (!cv) return false;
    let T;
    try {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      T = await loadThree();
    } catch (e) { return false; }
    // PORT FIX: fonts and three resolve later. If the intro was destroyed, skipped or already
    // dissolving by then, build nothing: the prototype created a renderer (a WebGL context)
    // here that no dispose path would ever reach.
    if (this._destroyed || this.done) return false;

    const scene = new T.Scene();
    const cam = new T.PerspectiveCamera(30, 1, 0.1, 400);
    // PORT FIX: with WebGL unavailable the constructor throws; the relief is optional (the
    // overlay's DOM timeline and teardown run without it), so bail instead of rejecting.
    let r;
    try { r = new T.WebGLRenderer({ canvas: cv, alpha: true, antialias: true }); } catch (e) { return false; }
    r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    // physical light units: front-face diffuse = albedo x (amb + dir.NdotL)/pi, scaled so white reads white
    scene.add(new T.AmbientLight(0xffffff, 1.29));
    const dl = new T.DirectionalLight(0xffffff, 3.11);
    dl.position.set(-5, 6, 9);
    scene.add(dl);

    const WD = 11.6, HT = 5.8, COLS = 64, ROWS = 32;
    const cw = WD / COLS, chh = HT / ROWS;
    const tc = this.iTextCanvas();
    const px = tc.getContext("2d").getImageData(0, 0, 1024, 512).data;
    const alphaAt = (x, y) => px[((y | 0) * 1024 + (x | 0)) * 4 + 3];

    const cells = [];
    for (let j = 0; j < ROWS; j++) for (let i = 0; i < COLS; i++) {
      const cx = (i + 0.5) * 16, cy = (j + 0.5) * 16;
      const mean = (alphaAt(cx - 4, cy - 4) + alphaAt(cx + 4, cy - 4) + alphaAt(cx - 4, cy + 4) + alphaAt(cx + 4, cy + 4)) / 4;
      cells.push({ x: (i + 0.5) / COLS * WD - WD / 2, y: HT / 2 - (j + 0.5) / ROWS * HT, inside: mean > 100, lag: (i / COLS) * 0.5 });
    }
    // only the cells the wordmark actually covers get built — no surrounding tile field
    const inked = cells.filter((c) => c.inside);

    const mesh = new T.InstancedMesh(
      new T.BoxGeometry(cw * 0.86, chh * 0.86, 1),
      new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, metalness: 0.02, transparent: true }),
      inked.length
    );
    mesh.frustumCulled = false;
    scene.add(mesh);

    const planes = [];

    this.iGL = { T: T, scene: scene, cam: cam, r: r, cv: cv, mesh: mesh, cells: inked, planes: planes,
      dummy: new T.Object3D(), cIn: new T.Color(0x2c2b27), cOut: new T.Color(0xe4e2dc),
      tmp: new T.Color(), camZ: 20, w: 0, h: 0 };
    this.iMeasure();
    return true;
  }

  iStep(s) {
    const g = this.iGL;
    if (!g) return;
    if (g.cv.clientWidth !== g.w || g.cv.clientHeight !== g.h) this.iMeasure();
    g.cv.style.opacity = this.iSeg(s, 1.1, 1.75).toFixed(3);

    // relief holds at full depth and the whole overlay dissolves onto the page
    const rise = 0.5;
    for (let k = 0; k < g.cells.length; k++) {
      const c = g.cells[k];
      const e = this.iEase(this.iClamp((this.iSeg(s, 1.4, 2.95) - c.lag) / (1 - c.lag * 0.7)));
      const d = 0.02 + (rise - 0.02) * e;
      g.dummy.position.set(c.x, c.y, d / 2);
      g.dummy.scale.set(1, 1, Math.max(0.001, d));
      g.dummy.updateMatrix();
      g.mesh.setMatrixAt(k, g.dummy.matrix);
      g.tmp.copy(g.cOut).lerp(g.cIn, e);
      g.mesh.setColorAt(k, g.tmp);
    }
    g.mesh.instanceMatrix.needsUpdate = true;
    if (g.mesh.instanceColor) g.mesh.instanceColor.needsUpdate = true;

    g.cam.position.set(0, 0, g.camZ);
    g.cam.lookAt(0, 0, 0);
    g.r.render(g.scene, g.cam);
  }

  iDispose() {
    if (this.iRaf) { cancelAnimationFrame(this.iRaf); this.iRaf = null; }
    const g = this.iGL;
    if (!g) return;
    g.mesh.geometry.dispose(); g.mesh.material.dispose();
    g.planes.forEach((p) => { p.geometry.dispose(); p.material.dispose(); });
    g.r.dispose();
    this.iGL = null;
  }

  // PORT FIX: iDispose frees three's objects, but the canvas stays in the DOM for the life of
  // the page and keeps its full-viewport, antialiased drawing buffer (2880x1800 at 1440x900 on a
  // 2x display — on the order of 100MB of GPU memory once multisampled). Shrink it once the
  // overlay is hidden; that frees the buffer without a context loss/restore cycle.
  iRelease() {
    const cv = this.iCv.current;
    if (cv && (cv.width > 1 || cv.height > 1)) { cv.width = 1; cv.height = 1; }
    // Stop any grid / caption / dissolve animation still ticking under display:none (a skip at
    // 500ms would otherwise leave ~100 grid-line animations running to ~2.9s).
    const w = this.iWrap.current;
    if (w && w.getAnimations) w.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    // The skip key and the resize re-measure have nothing left to act on.
    if (this._key) window.removeEventListener("keydown", this._key);
    if (this._iro) window.removeEventListener("resize", this._iro);
  }

  runIntro() {
    const wrap = this.iWrap.current, grid = this.iGrid.current, mark = this.iMark.current;
    if (!wrap || !grid || !mark) return;
    const accent = this.props.accent ?? "#157F52", P = this.iPace;
    wrap.style.display = "flex";
    grid.textContent = "";

    const E = "cubic-bezier(.16,1,.3,1)";
    const v2 = (n) => { let k = 0; while (n % 2 === 0) { n /= 2; k++; } return k; };
    const frag = document.createDocumentFragment(), cols = [], rows = [];
    for (let m = 0; m <= 32; m++) {
      const gen = (m === 0 || m === 32) ? 0 : 5 - v2(m);
      const hi = gen <= 1;
      const d = document.createElement("div");
      d.style.cssText = "position:absolute;top:0;bottom:0;width:1px;transform:scaleY(0);left:" + (m / 32 * 100) +
        "%;background:" + (hi ? accent : "#14140F") + ";opacity:" + (hi ? 0.44 : gen <= 3 ? 0.26 : 0.15);
      frag.appendChild(d); cols.push([d, 90 + gen * 235]);
    }
    for (let m = 0; m <= 64; m++) {
      const gen = (m === 0 || m === 64) ? 0 : 6 - v2(m);
      const d = document.createElement("div");
      d.style.cssText = "position:absolute;left:0;right:0;height:1px;transform:scaleX(0);top:" + (m / 64 * 100) +
        "%;background:#14140F;opacity:" + (gen <= 1 ? 0.34 : gen <= 3 ? 0.2 : 0.12);
      frag.appendChild(d); rows.push([d, 260 + gen * 200]);
    }
    grid.appendChild(frag);
    grid.style.opacity = "1";

    cols.forEach((r) => r[0].animate([{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }],
      { duration: 660 * P, delay: r[1] * P, easing: E, fill: "forwards" }));
    rows.forEach((r) => r[0].animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
      { duration: 620 * P, delay: r[1] * P, easing: E, fill: "forwards" }));
    ["2", "4", "8", "16", "32", "32 \u00d7 64"].forEach((t, i) => {
      this.timers.push(setTimeout(() => { if (this.iCap.current) this.iCap.current.textContent = t; }, (560 + i * 235) * P));
    });
    if (this.iCap.current) this.iCap.current.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500 * P, delay: 2400 * P, fill: "forwards" });

    grid.animate([{ opacity: 1 }, { opacity: 0 }],
      { duration: 700 * P, delay: 2200 * P, easing: "cubic-bezier(.4,0,.7,1)", fill: "forwards" });

    this.timers.push(setTimeout(() => {
      if (this.done) return;
      this.done = true;
      const finish = this.iTeardown(wrap, 820);
      wrap.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 820, easing: "cubic-bezier(.4,0,.6,1)", fill: "forwards" })
        .onfinish = finish;
    }, 3050 * P));

    this.iMeasure();
    this._iro = () => this.iMeasure();
    window.addEventListener("resize", this._iro);
    this.iSetupGL().then((ok) => {
      if (!ok) return;
      // PORT FIX: destroy() or the dissolve can land between iSetupGL resolving and this
      // callback; dispose what it built instead of leaving it orphaned.
      if (this.done || this._destroyed) { this.iDispose(); return; }
      const t0 = performance.now();
      const loop = (ms) => {
        const s = (ms - t0) / 1000 / this.iPace;
        this.iStep(Math.min(9, s));
        if (s > 4.0) { this.iDispose(); return; }
        this.iRaf = requestAnimationFrame(loop);
      };
      this.iRaf = requestAnimationFrame(loop);
    });

    this._key = () => this.skipIntro();
    window.addEventListener("keydown", this._key, { once: true });
  }

  // ================= Assess / Build / Run : scroll engine =================
  // Infrastructure only \u2014 no diagram content. To plug a diagram in:
  //   1. build meshes in phBuildScene(g), adding them to g.acts[0..2]
  //   2. give anything hoverable userData = { kind:"hit", id, t:"Title", m:"detail" }
  //   3. register overlay type with this.phLabel(act, text, [x,y,z], size)
  //   4. animate per frame in phScene(g, ctx) \u2014 ctx = { p, w, a, time, hover }
  // The engine owns scroll mapping, pinning, act cross-fades, the rail, labels,
  // hover raycasting, the tooltip, and resize. Diagrams own geometry only.

  start() {
    // PORT FIX (React Strict Mode): useMotionSystem calls start() in a microtask, and in dev the
    // first instance is destroyed before that microtask runs. Starting it anyway plays a second
    // intro on the same DOM whose timers, listeners and WebGL context no destroy() will reach.
    if (this._destroyed) return;
    return this.maybeIntro();
  }

  destroy() {
    this._destroyed = true;
    this.iDispose();
    this.timers.forEach(clearTimeout);
    this.timers = [];
    if (this._key) window.removeEventListener("keydown", this._key);
    if (this._iro) window.removeEventListener("resize", this._iro);
    // PORT FIX: in the prototype destroy (componentWillUnmount) only ran as React removed the
    // overlay's DOM. Here a system can be destroyed while its DOM stays mounted (dev remount,
    // Fast Refresh, a media-gated rebuild). An overlay still up at that point has lost the timers
    // that would hide it, so hide it now rather than leave it over the page.
    const w = this.iWrap.current;
    if (w && w.style.display !== "none" && !this._iGone) {
      this._iGone = true;
      w.style.pointerEvents = "none";
      w.style.display = "none";
    }
    this.iRelease();
  }
}
