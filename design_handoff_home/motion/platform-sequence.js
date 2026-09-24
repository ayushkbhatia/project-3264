// ── Platform sequence: three-act pinned scroll narrative ──────────────────────
// The largest system on the page (~790 lines) and the one most likely to be mis-ported.
//
// SHAPE: a tall `phTrack` scroll track containing a sticky `phPin`. Scroll progress through
// the track is mapped to p ∈ [0,1], split into three acts (Assess / Build / Run) with per-act
// progress w[0..2]. A WebGL stage (phCv) renders the diagram; DOM labels (phLabels) ride
// projected 3D positions so the type stays real text, not texture. Hover raycasts against the
// stage and drives a tooltip (phTip).
//
// SCROLL IS THE CLOCK. There is no autoplay and no timeline. phStep(ms) reads scroll position
// every frame and derives everything from it, which is why nothing plays off-screen and why
// the sequence is scrubbable both directions for free.
//
// THREE DOM PANELS, BUILT IMPERATIVELY: phBuildAssess / phBuildCaps / phBuildRun construct
// their own nodes, then phFit* measures and rescales to the stage, and phStep* interpolates
// them against act progress. They are imperative because they are measured — phOverflows()
// reads scrollHeight against clientHeight and the fit functions react to it. Rebuilding these
// three as JSX is the one change that will break this module: React owns the nodes, the fit
// pass fights it, and panels paint over the block beneath. Mount an empty div per panel and
// let this module fill it.
//
// DERIVED, NOT HARD-CODED: the audit rows (phAudit), capability prices and waves (phCaps) and
// the 30 nights of run data (phNights) are data; every figure shown in the prose is
// interpolated from them. Keep them as data when you port — do not inline the rendered strings.
//
// phNightAt(u) is deliberately non-linear: the two breach nights get a third of the act,
// instead of the 2/30ths an even map would give them. That asymmetry is the argument of the
// act, so preserve the curve.
//
// Entry point: start() / initPhases().  Requires a layout pass first (phLayout).
import { loadThree } from "./three-loader.js";

const ELEMENTS = [
  "phTrack",
  "phGrid",
  "phPin",
  "phStage",
  "phCv",
  "phLabels",
  "phTip",
  "phSlot",
  "phBar",
  "phAssess",
  "phBuildP",
  "phRun",
  "phCap",
  "phMetric",
  "phP0",
  "phP1",
  "phP2",
  "phR0",
  "phR1",
  "phR2"
];

const DEFAULTS = {
  "accent": "#157F52"
};

export class PlatformSequence {
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

  phSmooth(a, b, x) { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
  phClamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }

  phLayout() {
    const grid = this.phGrid.current, track = this.phTrack.current;
    const pin = this.phPin.current, stage = this.phStage.current;
    if (!grid || !track || !pin || !stage) return;
    const vh = window.innerHeight, narrow = window.innerWidth < 940;
    const hdr = document.querySelector("header");
    const hh = hdr ? hdr.offsetHeight : 0;
    const avail = vh - hh;

    // One pinned element on every width, held BELOW the sticky header rather than under it,
    // with both the canvas and the copy inside it so neither can slide behind the other.
    pin.style.position = "sticky";
    pin.style.top = hh + "px";
    pin.style.height = avail + "px";
    pin.style.overflow = "hidden";
    stage.style.aspectRatio = "auto";
    stage.style.order = narrow ? "-1" : "0";
    track.style.height = narrow ? "380vh" : "420vh";
    grid.style.gridTemplateColumns = narrow ? "minmax(0,1fr)" : "minmax(0,0.86fr) minmax(0,1.14fr)";
    grid.style.gap = narrow ? "26px" : "56px";
    grid.style.alignItems = narrow ? "start" : "center";

    const panels = [this.phP0.current, this.phP1.current, this.phP2.current].filter(Boolean);
    const wrap = panels[0] && panels[0].parentElement;
    panels.forEach((n, i) => {
      n.style.position = "absolute";
      n.style.inset = "0";
      n.style.opacity = i === (this._phActive || 0) ? "1" : "0";
      const ul = n.querySelector("ul");
      if (ul) ul.style.display = narrow ? "none" : "grid";
      const p = n.querySelector("p");
      if (p) { p.style.fontSize = narrow ? "15.5px" : "16.5px"; p.style.margin = narrow ? "14px 0 0" : "18px 0 0"; }
    });
    if (wrap) {
      wrap.style.margin = narrow ? "20px 0 0" : "40px 0 0";
      wrap.style.minHeight = "0px";
      wrap.style.minHeight = Math.ceil(Math.max.apply(null, panels.map((p) => p.scrollHeight))) + "px";
    }

    const sw = stage.clientWidth || 600;
    const copyH = grid.firstElementChild ? grid.firstElementChild.offsetHeight : 0;
    const room = narrow ? avail - copyH - 58 : avail - 56;
    stage.style.height = Math.max(narrow ? 190 : 260, Math.round(Math.min(sw / (narrow ? 1.15 : 1.3), room))) + "px";

    // the single scroll mapping \u2014 phStep and phJump both read it, so they cannot disagree
    this._phP = { off: 0, span: Math.max(320, track.offsetHeight - avail) };
    this.phFitAssess();
    this.phFitBuild();
    this.phFitRun();
  }

  phScroller() {
    if (this._phSc) return this._phSc;
    let n = this.phTrack.current && this.phTrack.current.parentElement;
    while (n && n !== document.body) {
      const o = getComputedStyle(n).overflowY;
      if ((o === "auto" || o === "scroll") && n.scrollHeight > n.clientHeight + 8) { this._phSc = n; return n; }
      n = n.parentElement;
    }
    const cands = [document.scrollingElement, document.body, document.documentElement];
    this._phSc = cands.find((c) => c && c.scrollHeight > c.clientHeight + 8) || document.documentElement;
    return this._phSc;
  }

  phJump = (e) => {
    const track = this.phTrack.current, M = this._phP;
    if (!track || !M) return;
    const act = e && e.currentTarget ? +e.currentTarget.getAttribute("data-act") : 0;
    const sc = this.phScroller();
    const scRect = sc === document.documentElement || sc === document.body ? { top: 0 } : sc.getBoundingClientRect();
    const trackTop = track.getBoundingClientRect().top - scRect.top + sc.scrollTop;
    const to = trackTop + M.off + M.span * [0.06, 0.5, 0.9][act];
    const from = sc.scrollTop, dist = to - from;
    if (Math.abs(dist) < 2) return;
    if (this._phTween) cancelAnimationFrame(this._phTween);
    if (this.reduced) { sc.scrollTop = to; return; }
    // smooth scrollTo is unreliable on the resolved scroller, so drive scrollTop directly
    const dur = Math.min(900, 260 + Math.abs(dist) * 0.42), t0 = performance.now();
    const tick = (ms) => {
      const t = Math.min(1, (ms - t0) / dur), k = 1 - Math.pow(1 - t, 3);
      sc.scrollTop = from + dist * k;
      if (t < 1) this._phTween = requestAnimationFrame(tick); else this._phTween = null;
    };
    this._phTween = requestAnimationFrame(tick);
  };

  // ---- label overlay: real DOM type riding projected 3D positions ----
  phLabel(act, text, pos, size, weight, color) {
    const host = this.phLabels.current, g = this.phGL;
    if (!host || !g) return null;
    const d = document.createElement("div");
    d.style.cssText = "position:absolute; left:0; top:0; opacity:0; white-space:nowrap; transform:translate(-50%,-50%);" +
      "font-size:" + (size || 12.5) + "px; font-weight:" + (weight || 500) +
      "; letter-spacing:-0.012em; color:" + (color || "#1A1917") + "; text-shadow:0 1px 0 #FFFFFF";
    d.textContent = text;
    host.appendChild(d);
    const L = { el: d, act: act, pos: pos };
    g.labels.push(L);
    return L;
  }

  async phSetupGL() {
    const cv = this.phCv.current;
    if (!cv) return false;
    let T;
    try { T = await loadThree(); } catch (e) { return false; }

    const scene = new T.Scene();
    const cam = new T.PerspectiveCamera(30, 1, 0.1, 400);
    const r = new T.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
    r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    // physical light units, scaled so a white material reads white
    scene.add(new T.AmbientLight(0xffffff, 1.3));
    const dl = new T.DirectionalLight(0xffffff, 2.75);
    dl.position.set(-6, 9, 7);
    scene.add(dl);

    const acts = [new T.Group(), new T.Group(), new T.Group()];
    acts.forEach((a) => scene.add(a));

    this.phGL = { T: T, scene: scene, cam: cam, r: r, cv: cv, acts: acts, labels: [],
      dummy: new T.Object3D(), tmp: new T.Color(),
      ray: new T.Raycaster(), ndc: new T.Vector2(), proj: new T.Vector3(),
      w: 0, h: 0, hover: null, pointer: false, px: 0, py: 0 };

    if (this.phBuildScene) this.phBuildScene(this.phGL);
    return true;
  }

  // ---- diagram hooks. Empty until a diagram is plugged in. ----
  phBuildScene(g) { /* add meshes to g.acts[0..2]; register labels with this.phLabel(...) */ }
  phScene(g, ctx) { /* per-frame: ctx = { p, w:[3], a:[3], time, hover } */ }

  phPointer = (e) => {
    const g = this.phGL, stage = this.phStage.current;
    if (!g || !stage) return;
    const r = stage.getBoundingClientRect();
    g.px = e.clientX - r.left; g.py = e.clientY - r.top;
    g.ndc.set((g.px / r.width) * 2 - 1, -(g.py / r.height) * 2 + 1);
    g.pointer = true;
  };
  phLeave = () => {
    const g = this.phGL;
    if (g) { g.pointer = false; g.hover = null; }
    if (this.phTip.current) this.phTip.current.style.opacity = "0";
  };

  phHover() {
    const g = this.phGL, tip = this.phTip.current;
    if (!g || !tip) return;
    if (!g.pointer) { g.hover = null; tip.style.opacity = "0"; return; }
    const pool = [];
    g.acts.forEach((grp) => { if (grp.visible) grp.traverse((o) => { if (o.userData && o.userData.kind) pool.push(o); }); });
    if (!pool.length) { g.hover = null; tip.style.opacity = "0"; return; }
    g.ray.setFromCamera(g.ndc, g.cam);
    const hit = g.ray.intersectObjects(pool, false)[0];
    if (!hit) { g.hover = null; tip.style.opacity = "0"; return; }
    const u = hit.object.userData;
    g.hover = u.id;
    tip.innerHTML = '<div style="font-size:13px; font-weight:500; letter-spacing:-0.015em">' + (u.t || "") +
      '</div>' + (u.m ? '<div style="margin-top:3px; font-size:12px; color:#B9B7B0">' + u.m + "</div>" : "");
    tip.style.left = g.px + "px";
    tip.style.top = g.py + "px";
    tip.style.opacity = "1";
  }

  phStep(ms) {
    const g = this.phGL, track = this.phTrack.current;
    if (!g || !track) return;
    const cw = g.cv.clientWidth, ch = g.cv.clientHeight;
    if (!cw || !ch) return;
    if (cw !== g.w || ch !== g.h) {
      g.w = cw; g.h = ch;
      g.cam.aspect = cw / ch;
      g.cam.updateProjectionMatrix();
      g.r.setSize(cw, ch, false);
    }

    const rect = track.getBoundingClientRect(), vh = window.innerHeight;
    if (rect.bottom < -200 || rect.top > vh + 200) return;
    const M = this._phP || { off: 0, span: Math.max(1, rect.height - vh) };
    const p = this.phClamp((-rect.top - M.off) / M.span);
    const time = this.reduced ? 6 : ms / 1000;

    // act weights (which diagram is on screen) and build progress (how far into it)
    const wRun = this.phSmooth(0.62, 0.76, p);
    const w = [1 - this.phSmooth(0.26, 0.40, p), this.phSmooth(0.28, 0.42, p) * (1 - wRun), wRun];
    const a = [this.phSmooth(0.0, 0.20, p), this.phSmooth(0.30, 0.52, p), this.phSmooth(0.64, 0.86, p)];
    g.acts.forEach((grp, i) => { grp.visible = w[i] > 0.012; });

    // Each panel hands off directly to the next: the incoming ramp starts where the
    // outgoing one has already fallen to ~0.15, so the stage is never blank and two dense
    // panels are never both legible. Sequenced gaps would leave a hole between acts.
    const aOp = 1 - this.phSmooth(0.288, 0.334, p);
    const bOp = this.phSmooth(0.306, 0.371, p) * (1 - this.phSmooth(0.612, 0.658, p));
    this.phStepAssess(aOp, (p - 0.012) / 0.24);
    const cOp = this.phSmooth(0.630, 0.690, p);
    this.phStepBuild(bOp, (p - 0.306) / 0.26);
    this.phStepRun(cOp, (p - 0.630) / 0.31);
    this.phScene(g, { p: p, w: w, a: a, time: time, hover: g.hover });
    this.phHover();
    g.cam.position.set(0, 6.6, 9.2);
    g.cam.lookAt(0, 0.2, 0);
    g.r.render(g.scene, g.cam);

    // labels ride the projected geometry, lit with their own act
    if (g.labels.length) {
      const hw = cw / 2, hh2 = ch / 2;
      g.labels.forEach((L) => {
        g.proj.set(L.pos[0], L.pos[1], L.pos[2]).project(g.cam);
        L.el.style.left = ((g.proj.x + 1) * hw).toFixed(1) + "px";
        L.el.style.top = ((-g.proj.y + 1) * hh2).toFixed(1) + "px";
        const vis = w[L.act] * this.phClamp((a[L.act] - 0.42) / 0.3);
        L.el.style.opacity = vis < 0.02 ? "0" : vis.toFixed(2);
      });
    }

    if (this.phBar.current) this.phBar.current.style.width = (p * 100).toFixed(1) + "%";

    const active = w[2] > 0.5 ? 2 : w[1] > 0.5 ? 1 : 0;
    if (active !== this._phActive) {
      this._phActive = active;
      [this.phP0, this.phP1, this.phP2].forEach((ref, i) => {
        const n = ref.current;
        if (n) { n.style.transition = "opacity .42s cubic-bezier(.16,1,.3,1)"; n.style.opacity = i === active ? "1" : "0"; n.style.pointerEvents = i === active ? "auto" : "none"; }
      });
      [this.phR0, this.phR1, this.phR2].forEach((ref, i) => {
        const n = ref.current;
        if (!n) return;
        n.style.borderTopColor = i <= active ? (this.props.accent ?? "#157F52") : "rgba(20,20,18,0.13)";
        n.style.color = i === active ? "#1A1917" : "#6E6D67";
      });
      const caps = ["Workflow and data map", "Document and decision pipelines", "Evaluation in production"];
      if (this.phCap.current) this.phCap.current.textContent = caps[active];
      if (this.phMetric.current) this.phMetric.current.textContent = "0" + (active + 1) + " / 03";
    }
  }

  // ---------- act 1 \u2014 Assess: the audit log resolving into a ranked ledger ----------
  // Scroll IS the clock here: the audit narrates and the ledger fills as the reader
  // moves through the act, so nothing plays off-screen and nothing needs a timer.
  phAudit() {
    const C = [
      { fn: "fund accounting",    seen: "daily \u00b7 4 custodian formats", name: "Custodian file reconciliation", hrs: 52, risk: "High", ret: 640 },
      { fn: "fund accounting",    seen: "240 notices a quarter",           name: "Capital call notice intake",    hrs: 34, risk: "High", ret: 412 },
      { fn: "investor relations", seen: "90 packets a quarter",            name: "Subscription document review",  hrs: 26, risk: "Med",  ret: 214 },
      { fn: "compliance",         seen: "quarterly \u00b7 hard deadline",   name: "Form PF filing preparation",     hrs: 22, risk: "High", ret: 150 }
    ];
    const lines = [];
    C.forEach((c) => {
      lines.push({ text: "mapping " + c.fn + " \u2014 " + c.seen, tone: "var(--mut)" });
      lines.push({ text: c.name.toLowerCase() + ": " + c.hrs + " hrs/month, " + c.risk.toLowerCase() + " risk", tone: "#2C2B27", row: c });
    });
    return { cases: C, lines: lines.map((l, i) => Object.assign({ t: ((i + 1) * 0.42).toFixed(1) + "s" }, l)) };
  }

  phBuildAssess() {
    const host = this.phAssess.current;
    if (!host) return;
    host.textContent = "";
    const A = this.phAudit();
    const el = (tag, css, txt) => { const n = document.createElement(tag); n.style.cssText = css; if (txt !== undefined) n.textContent = txt; return n; };

    const head = el("div", "flex:none; display:flex; align-items:baseline; justify-content:space-between; gap:16px; padding:18px 20px 14px; border-bottom:1px solid var(--line2)");
    const headL = el("div", "min-width:0");
    const headLabel = el("div", "font-size:11.5px; letter-spacing:0.05em; text-transform:uppercase; color:var(--mut)", "Function-by-function audit");
    headL.appendChild(headLabel);
    const headline = el("div", "margin:6px 0 0; font-size:16.5px; letter-spacing:-0.022em", "Sampling functions\u2026");
    headL.appendChild(headline);
    head.appendChild(headL);
    const counter = el("div", "flex:none; font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:11.5px; color:var(--mut); font-variant-numeric:tabular-nums", "0 / 4");
    head.appendChild(counter);
    host.appendChild(head);

    // log pane: every line exists, hidden ones are display:none so the stack grows upward
    const pane = el("div", "flex:none; display:flex; flex-direction:column; justify-content:flex-end; overflow:hidden; padding:10px 20px; background:#FBFAF8; border-bottom:1px solid var(--line2)");
    const lineEls = A.lines.map((l) => {
      const row = el("div", "display:none; gap:12px; padding:2px 0; font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:11px; line-height:1.55");
      row.appendChild(el("span", "flex:none; color:var(--mut); font-variant-numeric:tabular-nums", l.t));
      row.appendChild(el("span", "color:" + l.tone + "; overflow:hidden; text-overflow:ellipsis; white-space:nowrap", l.text));
      pane.appendChild(row);
      return row;
    });
    host.appendChild(pane);

    const led = el("div", "flex:1 1 auto; min-height:0; overflow:hidden; display:flex; flex-direction:column; padding:4px 20px 0");
    const lhead = el("div", "flex:none; display:flex; padding:9px 0 7px; font-size:10.5px; letter-spacing:0.04em; text-transform:uppercase; color:var(--mut)");
    [["Ranked use case", "flex:1"], ["Hrs/mo", "width:58px; text-align:right"], ["Risk", "width:46px; text-align:right"], ["Return/yr", "width:80px; text-align:right"]]
      .forEach((c) => lhead.appendChild(el("span", c[1], c[0])));
    led.appendChild(lhead);

    const rowEls = A.cases.map((c) => {
      const row = el("div", "display:none; align-items:baseline; padding:8px 0; border-top:1px solid var(--line2); font-size:13px; transition:background .18s ease");
      row.appendChild(el("span", "flex:1; letter-spacing:-0.012em; overflow:hidden; text-overflow:ellipsis; white-space:nowrap", c.name));
      row.appendChild(el("span", "width:58px; text-align:right; font-variant-numeric:tabular-nums; color:var(--sec)", String(c.hrs)));
      row.appendChild(el("span", "width:46px; text-align:right; font-size:11px; color:var(--sec)", c.risk));
      row.appendChild(el("span", "width:80px; text-align:right; font-variant-numeric:tabular-nums; color:var(--a)", "$" + c.ret + "k"));
      row.addEventListener("pointerenter", () => { row.style.background = "rgba(21,127,82,0.06)"; });
      row.addEventListener("pointerleave", () => { row.style.background = "transparent"; });
      led.appendChild(row);
      return row;
    });

    const foot = el("div", "flex:none; margin-top:auto; display:flex; justify-content:space-between; padding:10px 0 12px; border-top:1px solid var(--line); font-size:11.5px; color:var(--mut)");
    const footL = el("span", "", "\u2014");
    const footR = el("span", "font-variant-numeric:tabular-nums", "");
    foot.appendChild(footL); foot.appendChild(footR);
    led.appendChild(foot);
    host.appendChild(led);

    this._as = { A: A, host: host, head: head, headLabel: headLabel, headline: headline, counter: counter,
      pane: pane, lhead: lhead, led: led, foot: foot, lines: lineEls, rows: rowEls,
      footL: footL, footR: footR, step: -1, rowLimit: rowEls.length };
    this.phFitAssess();
    this.phFitBuild();
    this.phFitRun();
  }

  phFitAssess() {
    const as = this._as, stage = this.phStage.current;
    if (!as || !stage) return;
    const h = stage.offsetHeight;
    // Progressive density: apply the richest tier that fits the stage, measuring rather
    // than guessing. The log goes before the ledger — the ledger is the deliverable.
    const tiers = [
      { log: 1, pad: "8px 0",   fs: "13px",   lbl: 1, foot: 1, rows: 4 },
      { log: 0, pad: "7px 0",   fs: "12.5px", lbl: 1, foot: 1, rows: 4 },
      { log: 0, pad: "5px 0",   fs: "12.5px", lbl: 1, foot: 0, rows: 4 },
      { log: 0, pad: "3.5px 0", fs: "12px",   lbl: 0, foot: 0, rows: 4 },
      { log: 0, pad: "3.5px 0", fs: "12px",   lbl: 0, foot: 0, rows: 3 }
    ];
    for (let i = 0; i < tiers.length; i++) {
      const t = tiers[i];
      as.pane.style.display = t.log ? "flex" : "none";
      as.pane.style.height = t.log ? Math.min(132, Math.round(h * 0.3)) + "px" : "0px";
      as.headLabel.style.display = t.lbl ? "block" : "none";
      as.head.style.padding = t.lbl ? "18px 20px 14px" : "14px 20px 11px";
      as.foot.style.display = t.foot ? "flex" : "none";
      as.rowLimit = t.rows;
      // measure the FULL state: every allowed row visible, or the fit test is meaningless
      as.rows.forEach((n, k) => {
        n.style.padding = t.pad;
        n.style.fontSize = t.fs;
        n.style.display = k < t.rows ? "flex" : "none";
      });
      if (!this.phOverflows(as.led) || i === tiers.length - 1) break;
    }
    as.step = -1;
  }

  phStepAssess(w0, prog) {
    const as = this._as;
    if (!as) return;
    as.host.style.opacity = w0 < 0.02 ? "0" : w0.toFixed(2);
    as.host.style.pointerEvents = w0 > 0.6 ? "auto" : "none";
    const total = as.lines.length;
    const step = Math.min(total, Math.round(this.phClamp(prog) * total));
    if (step === as.step) return;
    as.step = step;
    as.lines.forEach((n, i) => { n.style.display = i < step ? "flex" : "none"; });
    let posted = 0, ret = 0;
    as.A.lines.forEach((l, i) => {
      if (!l.row) return;
      const on = i < step;
      const ri = as.A.cases.indexOf(l.row);
      const allowed = ri < (as.rowLimit || as.rows.length);
      as.rows[ri].style.display = on && allowed ? "flex" : "none";
      if (on && allowed) { posted++; ret += l.row.ret; }
    });
    // One denominator for the whole panel: the ledger's own row limit. Deriving the
    // headline from the log lines let it claim 4 while three rows were on screen.
    const limit = as.rowLimit || as.rows.length;
    as.headline.textContent = posted >= limit && limit > 0
      ? posted + (posted === 1 ? " candidate ranked" : " candidates ranked")
      : "Sampling functions\u2026";
    as.footL.textContent = posted ? "ranked by expected return" : "\u2014";
    as.counter.textContent = posted + " / " + (as.rowLimit || as.rows.length);
    as.footR.textContent = posted ? "$" + ret + "k a year" : "";
  }

  // ---------- act 2 \u2014 Build: scope scoped by scroll, plan and price computed from it ----------
  // Same contract as Assess: scroll is the clock. Capabilities are taken into scope in
  // wave order as the reader moves through the act, and the release plan, fortnight count
  // and total are derived from whatever is scoped at that moment \u2014 never hard-coded.
  phCaps() {
    return [
      { id: "ret", name: "Retrieval over the document store", tag: "3 sources",        price: 48, wave: 1 },
      { id: "exc", name: "Extraction: capital call notices",  tag: "240 a quarter",    price: 62, wave: 1 },
      { id: "exf", name: "Extraction: custodian files",       tag: "4 formats",        price: 74, wave: 2 },
      { id: "val", name: "Validation against trial balance",  tag: "tie-out rules",    price: 56, wave: 2 },
      { id: "rev", name: "Review interface",                  tag: "exceptions only",  price: 68, wave: 2 },
      { id: "aud", name: "Audit trail and lineage",           tag: "per field",        price: 42, wave: 3 },
      { id: "wbk", name: "Write-back to fund accounting",     tag: "journal entries",  price: 58, wave: 3 }
    ];
  }

  // The host is a flex column with overflow:hidden, so ITS scrollHeight can never exceed
  // its clientHeight — flex shrinks the middle child instead. Measure the child that
  // actually overflows, or a misfit paints straight over the block below it.
  phOverflows(flexChild) { return !!flexChild && flexChild.scrollHeight > flexChild.clientHeight + 1; }

  phEl(tag, css, txt) { const n = document.createElement(tag); n.style.cssText = css; if (txt !== undefined) n.textContent = txt; return n; }

  phBuildCaps() {
    const host = this.phBuildP.current;
    if (!host) return;
    host.textContent = "";
    const el = (t, c, x) => this.phEl(t, c, x);
    const CAPS = this.phCaps();

    const head = el("div", "flex:none; display:flex; align-items:baseline; justify-content:space-between; gap:16px; padding:18px 20px 13px; border-bottom:1px solid var(--line2)");
    const headL = el("div", "min-width:0");
    const headLabel = el("div", "font-size:11.5px; letter-spacing:0.05em; text-transform:uppercase; color:var(--mut)", "Scope and release plan");
    headL.appendChild(headLabel);
    const headline = el("div", "margin:6px 0 0; font-size:16.5px; letter-spacing:-0.022em", "Scoping capabilities\u2026");
    headL.appendChild(headline);
    head.appendChild(headL);
    const counter = el("div", "flex:none; font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:11.5px; color:var(--mut); font-variant-numeric:tabular-nums", "0 / 7");
    head.appendChild(counter);
    host.appendChild(head);

    const list = el("div", "flex:1 1 auto; min-height:0; overflow:hidden; display:flex; flex-direction:column; padding:2px 20px 0");
    const capEls = CAPS.map((c) => {
      const row = el("div", "display:none; align-items:center; gap:11px; padding:7px 0; border-top:1px solid var(--line2); cursor:pointer; transition:opacity .3s ease");
      const box = el("div", "flex:none; width:14px; height:14px; border:1px solid rgba(20,20,18,0.24); border-radius:3px; display:flex; align-items:center; justify-content:center; font-size:10px; color:#FFFFFF; transition:background .25s ease, border-color .25s ease");
      const mid = el("div", "flex:1; min-width:0");
      const nm = el("div", "font-size:12.5px; letter-spacing:-0.012em; overflow:hidden; text-overflow:ellipsis; white-space:nowrap", c.name);
      const tg = el("div", "margin:2px 0 0; font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10px; color:var(--mut)", "wave " + c.wave + " \u00b7 " + c.tag);
      mid.appendChild(nm); mid.appendChild(tg);
      const pr = el("div", "flex:none; font-size:12.5px; font-variant-numeric:tabular-nums", "$" + c.price + "k");
      row.appendChild(box); row.appendChild(mid); row.appendChild(pr);
      row.addEventListener("click", () => {
        if (!this._bd || !this._bd.open) return;
        const m = this._bd.manual;
        m[c.id] = m[c.id] === undefined ? 0 : (m[c.id] ? 0 : 1);
        this._bd.step = -1;
        this.phStepBuild(this._bd.lastW, this._bd.lastP);
      });
      list.appendChild(row);
      return { row: row, box: box, nm: nm, tg: tg, pr: pr, c: c };
    });
    host.appendChild(list);

    const plan = el("div", "flex:none; padding:12px 20px 12px; background:#FBFAF8; border-top:1px solid var(--line2)");
    const bars = el("div", "display:flex; gap:4px");
    const waveEls = [1, 2, 3].map((w) => {
      const col = el("div", "flex:1; min-width:0");
      const fill = el("div", "height:4px; background:rgba(20,20,18,0.13); transition:background .3s ease");
      const lab = el("div", "margin:6px 0 0; font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10.5px; color:var(--mut)", "Wave " + w + " \u00b7 wk " + ((w - 1) * 4 + 2));
      const body = el("div", "margin:2px 0 0; font-size:11px; color:var(--mut)", "nothing scoped");
      col.appendChild(fill); col.appendChild(lab); col.appendChild(body);
      bars.appendChild(col);
      return { fill: fill, body: body, w: w };
    });
    plan.appendChild(bars);
    const foot = el("div", "display:flex; justify-content:space-between; align-items:baseline; margin:12px 0 0; padding:10px 0 0; border-top:1px solid var(--line)");
    const footL = el("span", "font-size:12px; color:var(--sec)", "Nothing scoped yet");
    const footR = el("span", "font-size:15px; font-variant-numeric:tabular-nums", "\u2014");
    foot.appendChild(footL); foot.appendChild(footR);
    plan.appendChild(foot);
    host.appendChild(plan);

    this._bd = { host: host, head: head, headLabel: headLabel, headline: headline, counter: counter,
      list: list, caps: capEls, plan: plan, waves: waveEls, foot: foot, footL: footL, footR: footR,
      step: -1, capLimit: capEls.length, manual: {}, open: false, lastW: 0, lastP: 0 };
    this.phFitBuild();
  }

  phFitBuild() {
    const bd = this._bd, stage = this.phStage.current;
    if (!bd || !stage) return;
    // richest tier that measures as fitting; the capability list sheds rows before the plan does,
    // because the plan IS the point of the module
    // Tiers never drop capabilities — a price that changes with window height is not a price.
    // The whole list goes before any of it is misreported; the plan always covers all seven.
    const tiers = [
      { pad: "7px 0",   fs: "12.5px", tag: 1, lbl: 1, list: 1 },
      { pad: "5px 0",   fs: "12.5px", tag: 1, lbl: 1, list: 1 },
      { pad: "4px 0",   fs: "12px",   tag: 0, lbl: 1, list: 1 },
      { pad: "3px 0",   fs: "11.5px", tag: 0, lbl: 0, list: 1 },
      { pad: "3px 0",   fs: "11.5px", tag: 0, lbl: 0, list: 0 }
    ];
    for (let i = 0; i < tiers.length; i++) {
      const t = tiers[i];
      bd.headLabel.style.display = t.lbl ? "block" : "none";
      bd.head.style.padding = t.lbl ? "18px 20px 13px" : "13px 20px 10px";
      bd.capLimit = bd.caps.length;
      bd.list.style.display = t.list ? "flex" : "none";
      bd.caps.forEach((c) => {
        c.row.style.padding = t.pad;
        c.nm.style.fontSize = t.fs;
        c.tg.style.display = t.tag ? "block" : "none";
        c.row.style.display = "flex";
      });
      if (!t.list || !this.phOverflows(bd.list) || i === tiers.length - 1) break;
    }
    bd.step = -1;
  }

  phStepBuild(w1, prog) {
    const bd = this._bd;
    if (!bd) return;
    bd.lastW = w1; bd.lastP = prog;
    bd.host.style.opacity = w1 < 0.02 ? "0" : w1.toFixed(2);
    bd.host.style.pointerEvents = w1 > 0.6 ? "auto" : "none";
    const limit = bd.capLimit;
    const step = Math.min(limit, Math.round(this.phClamp(prog) * limit));
    bd.open = step >= limit;
    if (step === bd.step) return;
    bd.step = step;

    const scoped = [];
    bd.caps.forEach((c, i) => {
      if (i >= limit) return;
      const auto = i < step;
      const man = bd.manual[c.c.id];
      const on = man === undefined ? auto : !!man;
      c.row.style.opacity = auto || man !== undefined ? "1" : "0.32";
      c.box.style.background = on ? "var(--a)" : "#FFFFFF";
      c.box.style.borderColor = on ? "var(--a)" : "rgba(20,20,18,0.24)";
      c.box.textContent = on ? "\u2713" : "";
      c.nm.style.color = on ? "#1A1917" : "var(--mut)";
      c.pr.style.color = on ? "#1A1917" : "var(--mut)";
      if (on) scoped.push(c.c);
    });

    const plural = (n, one, many) => n + " " + (n === 1 ? one : many);
    bd.waves.forEach((wv) => {
      const items = scoped.filter((c) => c.wave === wv.w);
      wv.fill.style.background = items.length ? "var(--a)" : "rgba(20,20,18,0.13)";
      wv.body.style.color = items.length ? "#2C2B27" : "var(--mut)";
      wv.body.textContent = items.length ? plural(items.length, "capability", "capabilities") : "nothing scoped";
    });

    const total = scoped.reduce((a, c) => a + c.price, 0);
    const releases = Math.ceil(scoped.length / 2);
    bd.counter.textContent = scoped.length + " / " + limit;
    bd.headline.textContent = bd.open ? "Priced per capability" : "Scoping capabilities\u2026";
    bd.footL.textContent = scoped.length
      ? plural(scoped.length, "capability", "capabilities") + " \u00b7 " + plural(releases, "fortnightly release", "fortnightly releases") + " \u00b7 " + plural(releases * 2, "week", "weeks")
      : "Nothing scoped yet";
    bd.footR.textContent = scoped.length ? "$" + total + "k" : "\u2014";
  }

  // ---------- act 3 \u2014 Run: 30 nights of evaluation, drift caught mid-sweep ----------
  // Scroll walks the cursor across the nights, so the reader arrives at the breach rather
  // than being shown it. Every figure in the prose is interpolated from the night's own
  // data \u2014 nothing about this panel is hand-typed.
  phNights() {
    if (this._phN) return this._phN;
    const out = [];
    for (let i = 0; i < 30; i++) {
      let v;
      if (i < 18) v = 0.968 + Math.sin(i * 1.7) * 0.006;
      else if (i < 22) v = 0.966 - (i - 17) * 0.006;
      else if (i === 22) v = 0.921;
      else if (i === 23) v = 0.918;
      else v = 0.949 + (i - 23) * 0.0045;
      v = Math.min(0.979, v);
      out.push({ score: v, cases: 412, failed: Math.round(412 * (1 - v)) });
    }
    this._phN = out;
    return out;
  }

  phRunNotes() {
    return {
      21: { head: "Slide detected across three nights",
            body: "Accuracy fell 2.4 points without a release. The suite flagged the trend before any breach, and the cause was traced to a provider-side model update." },
      22: { head: "Threshold breached \u2014 write-back held",
            body: "The suite's aggregate fell to {score}, with amended custodian files carrying almost all of it. The {failed} failing documents went to the review queue rather than posting." },
      23: { head: "Second night below threshold",
            body: "Root cause confirmed: the provider had changed tokenisation on tabular input. Retraining set assembled from the {cum} failures across both nights." },
      24: { head: "Retrained and released",
            body: "Recovered to {score} the night after retraining. Not yet at the prior baseline, and the suite keeps it visible until it is." }
    };
  }

  phBuildRun() {
    const host = this.phRun.current;
    if (!host) return;
    host.textContent = "";
    const el = (t, c, x) => this.phEl(t, c, x);
    const N = this.phNights(), PASS = "#157F52", FAIL = "#C4341E";

    const head = el("div", "flex:none; display:flex; align-items:baseline; justify-content:space-between; gap:16px; padding:18px 20px 13px; border-bottom:1px solid var(--line2)");
    const headL = el("div", "min-width:0");
    const headLabel = el("div", "font-size:11.5px; letter-spacing:0.05em; text-transform:uppercase; color:var(--mut)", "Evaluation suite \u00b7 412 cases, nightly");
    headL.appendChild(headLabel);
    const headline = el("div", "margin:6px 0 0; font-size:16.5px; letter-spacing:-0.022em", "Within tolerance");
    headL.appendChild(headline);
    head.appendChild(headL);
    const state = el("div", "flex:none; font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:11.5px; color:" + PASS, "passing");
    head.appendChild(state);
    host.appendChild(head);

    const plotWrap = el("div", "flex:1 1 auto; min-height:0; overflow:hidden; display:flex; flex-direction:column; padding:16px 20px 0");
    const lo = 0.89, hi = 0.985;
    const plot = el("div", "position:relative; flex:none");
    const line = el("div", "position:absolute; z-index:1; left:0; right:0; height:1px; background:rgba(196,52,30,0.5)");
    const chip = el("div", "position:absolute; z-index:2; right:0; padding:1px 4px; background:#FFFFFF; font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10px; color:" + FAIL, "threshold 0.94");
    const barRow = el("div", "position:absolute; inset:0; display:flex; align-items:flex-end; gap:2px");
    const bars = N.map((n) => {
      const cell = el("div", "flex:1; min-width:0; height:100%; position:relative; display:flex; align-items:flex-end");
      const fillEl = el("div", "width:100%; background:" + (n.score < 0.94 ? FAIL : PASS) + "; transition:opacity .25s ease");
      const cursor = el("div", "position:absolute; inset:0; border-left:1px solid transparent; transition:border-color .25s ease");
      cell.appendChild(fillEl); cell.appendChild(cursor);
      barRow.appendChild(cell);
      return { fill: fillEl, cursor: cursor, n: n };
    });
    plot.appendChild(line); plot.appendChild(chip); plot.appendChild(barRow);
    plotWrap.appendChild(plot);
    const axis = el("div", "flex:none; display:flex; justify-content:space-between; margin:7px 0 0; font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10px; color:var(--mut)");
    const axL = el("span", "", "30 nights ago");
    const axM = el("span", "", "");
    const axR = el("span", "", "last night");
    axis.appendChild(axL); axis.appendChild(axM); axis.appendChild(axR);
    plotWrap.appendChild(axis);

    const panel = el("div", "flex:none; margin:13px 0 0; padding:11px 13px; background:rgba(21,127,82,0.05); border:1px solid rgba(21,127,82,0.2); transition:background .3s ease, border-color .3s ease");
    const pTop = el("div", "display:flex; justify-content:space-between; align-items:baseline; gap:12px");
    const pHead = el("span", "font-size:12.5px; letter-spacing:-0.01em", "No regression");
    const pScore = el("span", "flex:none; font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:11px; color:var(--mut)", "");
    pTop.appendChild(pHead); pTop.appendChild(pScore);
    panel.appendChild(pTop);
    const pBody = el("div", "margin:4px 0 0; font-size:12px; line-height:1.5; color:var(--sec)", "");
    panel.appendChild(pBody);
    plotWrap.appendChild(panel);

    const sliceRow = el("div", "flex:none; display:flex; margin:12px 0 14px; padding:11px 0 0; border-top:1px solid var(--line)");
    const SL = [["Capital calls", 0.981, 0.15], ["Custodian files", 0.972, 0.55], ["Subscriptions", 0.964, 0.12], ["Statements", 0.977, 0.18]];
    const slices = SL.map((sl) => {
      const col = el("div", "flex:1; min-width:0");
      const nm = el("div", "font-size:10.5px; letter-spacing:0.03em; text-transform:uppercase; color:var(--mut)", sl[0]);
      const val = el("div", "margin:3px 0 0; font-size:14px; font-variant-numeric:tabular-nums", "");
      const dl = el("div", "margin:2px 0 0; font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10px", "");
      col.appendChild(nm); col.appendChild(val); col.appendChild(dl);
      sliceRow.appendChild(col);
      return { nm: nm, val: val, dl: dl, base: sl[1], w: sl[2] };
    });
    plotWrap.appendChild(sliceRow);
    host.appendChild(plotWrap);

    this._rn = { host: host, head: head, headLabel: headLabel, headline: headline, state: state,
      plotWrap: plotWrap, plot: plot, line: line, chip: chip, bars: bars, axis: axis, axM: axM,
      panel: panel, pHead: pHead, pScore: pScore, pBody: pBody, sliceRow: sliceRow, slices: slices,
      lo: lo, hi: hi, H: 120, night: -1, notes: this.phRunNotes(),
      cum: N.reduce((a, n) => a + (n.score < 0.94 ? n.failed : 0), 0) };
    this.phFitRun();
  }

  phFitRun() {
    const rn = this._rn, stage = this.phStage.current;
    if (!rn || !stage) return;
    const N = this.phNights();
    let longest = "";
    Object.keys(rn.notes).forEach((k) => { const b = rn.notes[k].body; if (b.length > longest.length) longest = b; });
    N.forEach((n) => {
      const t = n.score < 0.94
        ? n.failed + " of " + n.cases + " cases failed, below the 0.940 threshold. Write-back is held until the suite clears."
        : (n.cases - n.failed) + " of " + n.cases + " cases pass. Slice-level scores stay within a point of baseline, so nothing is held.";
      if (t.length > longest.length) longest = t;
    });
    const restore = rn.pBody.textContent;
    rn.pBody.textContent = longest;
    // the chart is the argument, so it is the last thing to shrink: slices go, then the
    // axis, then the label, then the chart compresses
    const tiers = [
      { H: 120, slices: 1, axis: 1, lbl: 1, pad: "16px 20px 0", pPad: "11px 13px", pmt: 13, clamp: 0 },
      { H: 104, slices: 1, axis: 1, lbl: 1, pad: "14px 20px 0", pPad: "11px 13px", pmt: 12, clamp: 0 },
      { H: 96,  slices: 0, axis: 1, lbl: 1, pad: "14px 20px 0", pPad: "10px 12px", pmt: 11, clamp: 0 },
      { H: 88,  slices: 0, axis: 1, lbl: 1, pad: "12px 20px 0", pPad: "10px 12px", pmt: 10, clamp: 2 },
      { H: 76,  slices: 0, axis: 0, lbl: 1, pad: "11px 20px 0", pPad: "9px 11px",  pmt: 9,  clamp: 2 },
      { H: 62,  slices: 0, axis: 0, lbl: 0, pad: "9px 20px 0",  pPad: "8px 10px",  pmt: 7,  clamp: 2 },
      { H: 52,  slices: 0, axis: 0, lbl: 0, pad: "7px 20px 0",  pPad: "7px 10px",  pmt: 5,  clamp: 1 },
      { H: 44,  slices: 0, axis: 0, lbl: 0, pad: "6px 20px 0",  pPad: "6px 9px",   pmt: 4,  clamp: 1 }
    ];
    for (let i = 0; i < tiers.length; i++) {
      const t = tiers[i];
      rn.H = t.H;
      rn.plot.style.height = t.H + "px";
      rn.sliceRow.style.display = t.slices ? "flex" : "none";
      rn.axis.style.display = t.axis ? "flex" : "none";
      rn.headLabel.style.display = t.lbl ? "block" : "none";
      rn.head.style.padding = t.lbl ? "18px 20px 13px" : "13px 20px 10px";
      rn.plotWrap.style.padding = t.pad;
      rn.panel.style.padding = t.pPad;
      rn.panel.style.marginTop = t.pmt + "px";
      if (t.clamp) {
        rn.pBody.style.display = "-webkit-box";
        rn.pBody.style.webkitLineClamp = String(t.clamp);
        rn.pBody.style.webkitBoxOrient = "vertical";
        rn.pBody.style.overflow = "hidden";
      } else {
        rn.pBody.style.display = "block";
        rn.pBody.style.overflow = "visible";
      }
      const yT = (1 - (0.94 - rn.lo) / (rn.hi - rn.lo)) * t.H;
      rn.line.style.top = yT + "px";
      rn.chip.style.top = (yT + 3) + "px";
      rn.bars.forEach((b) => {
        b.fill.style.height = Math.max(2, t.H - (1 - (b.n.score - rn.lo) / (rn.hi - rn.lo)) * t.H) + "px";
      });
      if (!this.phOverflows(rn.plotWrap) || i === tiers.length - 1) break;
    }
    rn.pBody.textContent = restore;
    rn.night = -1;
  }

  // The two breach nights are the argument, so they get a third of the act to themselves
  // instead of the 2/30ths a linear map would give them.
  phNightAt(u) {
    if (u < 0.40) return Math.round((u / 0.40) * 21);
    if (u < 0.56) return 22;
    if (u < 0.70) return 23;
    if (u < 0.84) return 24;
    return 25 + Math.min(4, Math.round(((u - 0.84) / 0.16) * 4));
  }

  phStepRun(w2, prog) {
    const rn = this._rn;
    if (!rn) return;
    rn.host.style.opacity = w2 < 0.02 ? "0" : w2.toFixed(2);
    rn.host.style.pointerEvents = "none";
    const N = this.phNights();
    const night = this.phNightAt(this.phClamp(prog));
    if (night === rn.night) return;
    rn.night = night;
    const cur = N[night], breach = cur.score < 0.94;
    const PASS = "#157F52", FAIL = "#C4341E";

    rn.bars.forEach((b, i) => {
      const bad = b.n.score < 0.94;
      b.fill.style.opacity = i === night ? "1" : bad ? "0.88" : "0.32";
      b.cursor.style.borderLeftColor = i === night ? "rgba(20,20,18,0.32)" : "transparent";
    });

    const raw = rn.notes[night];
    const fill = (t) => t.split("{failed}").join(cur.failed).split("{cum}").join(rn.cum).split("{score}").join(cur.score.toFixed(3));
    rn.headline.textContent = raw ? raw.head : breach ? "Below threshold" : "Within tolerance";
    rn.state.textContent = breach ? "write-back paused" : "passing";
    rn.state.style.color = breach ? FAIL : PASS;
    rn.pHead.textContent = raw ? raw.head : breach ? "Below threshold" : "No regression";
    rn.pScore.textContent = cur.score.toFixed(3);
    rn.pBody.textContent = raw ? fill(raw.body)
      : breach
        ? cur.failed + " of " + cur.cases + " cases failed, below the 0.940 threshold. Write-back is held until the suite clears."
        : (cur.cases - cur.failed) + " of " + cur.cases + " cases pass. Slice-level scores stay within a point of baseline, so nothing is held.";
    rn.panel.style.background = breach ? "rgba(196,52,30,0.06)" : "rgba(21,127,82,0.05)";
    rn.panel.style.borderColor = breach ? "rgba(196,52,30,0.28)" : "rgba(21,127,82,0.2)";
    rn.axM.textContent = "night " + (N.length - night) + " \u00b7 " + cur.failed + " of " + cur.cases + " failed";

    // slices carry the shortfall in proportion \u2014 weights sum to 1, so they average to the night
    const D = cur.score - 0.9735;
    rn.slices.forEach((sl) => {
      const now = Math.min(sl.base + 0.004, sl.base + D * sl.w * 4);
      const d = now - sl.base;
      const off = d < -0.01;
      sl.val.textContent = (now * 100).toFixed(1) + "%";
      sl.val.style.color = off ? FAIL : "#1A1917";
      sl.dl.textContent = (d >= 0 ? "+" : "") + (d * 100).toFixed(1) + " pts";
      sl.dl.style.color = off ? FAIL : PASS;
    });
  }

  async initPhases() {
    if (!this.phTrack.current) return;
    this.phLayout();
    this._phro = () => this.phLayout();
    window.addEventListener("resize", this._phro);
    this.phBuildAssess();
    this.phBuildCaps();
    this.phBuildRun();
    const ok = await this.phSetupGL();
    if (!ok) { this.phLayout(); this.phStepAssess(1, 1); this.phStepBuild(0, 0); this.phStepRun(0, 0); return; }
    this.phLayout();
    const stage = this.phStage.current;
    if (stage) {
      stage.addEventListener("pointermove", this.phPointer);
      stage.addEventListener("pointerleave", this.phLeave);
    }
    const loop = (ms) => { this.phStep(ms); this.phRaf = requestAnimationFrame(loop); };
    this.phRaf = requestAnimationFrame(loop);
  }


  start() { return this.initPhases(); }

  destroy() {
    if (this._key) window.removeEventListener("keydown", this._key);
    if (this._phro) window.removeEventListener("resize", this._phro);
    if (this.phRaf) cancelAnimationFrame(this.phRaf);
    if (this._phTween) cancelAnimationFrame(this._phTween);
    const st = this.phStage.current;
    if (st) {
      st.removeEventListener("pointermove", this.phPointer);
      st.removeEventListener("pointerleave", this.phLeave);
    }
    if (this.phGL) {
      this.phGL.scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
      });
      this.phGL.r.dispose();
      this.phGL = null;
    }
    if (this._ro) this._ro.disconnect();
  }
}
