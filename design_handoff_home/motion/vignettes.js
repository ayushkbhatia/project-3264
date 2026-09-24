// ── Capability vignettes: three looping SVG micro-diagrams ────────────────────
// Small inline SVGs (scope / clock / evals) built imperatively and cycled on a stagger
// (6200 / 6600 / 7000ms — intentionally coprime, so the three never beat in sync).
//
// Each is gated by IntersectionObserver: a vignette only starts once its card is on screen,
// and each rebuild reads the box's live clientWidth (frame()), so they are responsive by
// reconstruction rather than by viewBox scaling.
//
// Honours prefers-reduced-motion: with it set, the vignette is built once in its resting
// state and never cycles.
//
// This is the ONE system here that could plausibly be redrawn as static SVG + CSS keyframes
// if you need to cut scope. If you do, keep the stagger and keep the reduced-motion path.
import { loadThree } from "./three-loader.js";

const ELEMENTS = [
  "vigA",
  "vigB",
  "vigC"
];

const DEFAULTS = {};

export class Vignettes {
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

  svgNode(tag, attrs) {
    const n = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  frame(box, h) {
    box.textContent = '';
    const w = Math.max(200, box.clientWidth);
    const s = this.svgNode('svg', { width: w, height: h });
    s.style.display = 'block';
    s.style.overflow = 'visible';
    box.appendChild(s);
    return { s: s, w: w, h: h };
  }

  startVignettes() {
    const set = [[this.vigA, 'scope', 6200], [this.vigB, 'clock', 6600], [this.vigC, 'evals', 7000]];
    const build = (kind, box) => { if (kind === 'scope') this.vigScope(box); else if (kind === 'clock') this.vigClock(box); else this.vigEvals(box); };
    const paintStill = () => { this._still = true; set.forEach(([ref, kind]) => { if (ref.current) build(kind, ref.current); }); this._still = false; };
    paintStill();
    if (this.reduced) return;
    const started = [false, false, false];
    const start = (i) => {
      const box = set[i][0].current;
      if (!box || started[i]) return;
      started[i] = true;
      const cycle = () => { build(set[i][1], box); this.timers.push(setTimeout(cycle, set[i][2])); };
      this.timers.push(setTimeout(cycle, 240));
    };
    if ('IntersectionObserver' in window) {
      this._io = new IntersectionObserver((es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        const i = set.findIndex((row) => row[0].current === e.target);
        if (i < 0) return;
        this._io.unobserve(e.target);
        start(i);
      }), { rootMargin: '140px' });
      set.forEach((row) => { if (row[0].current) this._io.observe(row[0].current); });
    } else set.forEach((row, i) => start(i));
    if ('ResizeObserver' in window && this.vigA.current) {
      let t = null;
      this._ro = new ResizeObserver(() => { clearTimeout(t); t = setTimeout(paintStill, 280); });
      this._ro.observe(this.vigA.current);
    }
  }

  vigScope(box) {
    if (!box) return;
    const f = this.frame(box, 150), s = f.s, w = f.w;
    const N = 5, rowH = 7, gap = 17, top = 24, wid = [0.86, 0.62, 0.95, 0.54, 0.75];
    const E = 'cubic-bezier(.16,1,.3,1)', still = this.reduced || this._still;
    for (let i = 0; i < N; i++) {
      const y = top + i * (rowH + gap), x = 30, len = (w - 46) * wid[i];
      s.appendChild(this.svgNode('rect', { x: x, y: y, width: len, height: rowH, fill: 'rgba(20,20,18,0.08)' }));
      const fill = this.svgNode('rect', { x: x, y: y, width: len, height: rowH, fill: '#2C2B27' });
      fill.style.transformOrigin = x + 'px ' + (y + rowH / 2) + 'px';
      s.appendChild(fill);
      const tick = this.svgNode('rect', { x: 8, y: y, width: 7, height: rowH, fill: '#2C2B27' });
      s.appendChild(tick);
      if (still) continue;
      fill.style.transform = 'scaleX(0)';
      fill.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 620, delay: i * 240, easing: E, fill: 'forwards' });
      tick.style.opacity = '0';
      tick.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, delay: i * 240 + 520, fill: 'forwards' });
    }
    const bh = N * (rowH + gap) + 10;
    const fr = this.svgNode('rect', { x: 1, y: top - 12, width: w - 2, height: bh, fill: 'none', stroke: '#2C2B27', 'stroke-width': 1 });
    s.appendChild(fr);
    const per = 2 * ((w - 2) + bh);
    if (!still) {
      fr.style.strokeDasharray = per;
      fr.animate([{ strokeDashoffset: per }, { strokeDashoffset: 0 }], { duration: 980, delay: N * 240 + 420, easing: E, fill: 'forwards' });
      s.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 540, delay: 5300, easing: 'ease', fill: 'forwards' });
    }
  }

  vigClock(box) {
    if (!box) return;
    const f = this.frame(box, 150), s = f.s, w = f.w;
    const x0 = 10, x1 = w - 10, span = x1 - x0, y = 104, barY = 62, barH = 9;
    const E = 'cubic-bezier(.16,1,.3,1)', still = this.reduced || this._still, ship = 5 / 11;
    s.appendChild(this.svgNode('line', { x1: x0, y1: y, x2: x1, y2: y, stroke: 'rgba(20,20,18,0.14)', 'stroke-width': 1 }));
    for (let j = 0; j < 12; j++) {
      const tx = x0 + span * (j / 11);
      s.appendChild(this.svgNode('line', { x1: tx, y1: y, x2: tx, y2: y + (j === 0 || j === 11 ? 7 : 4), stroke: 'rgba(20,20,18,0.20)', 'stroke-width': 1 }));
    }
    const lab = (tx, anchor, t) => { const n = this.svgNode('text', { x: tx, y: y + 24, 'text-anchor': anchor, fill: '#6E6D67', 'font-size': 11, 'font-family': 'inherit' }); n.textContent = t; s.appendChild(n); return n; };
    lab(x0, 'start', 'week 1'); lab(x1, 'end', 'week 12');
    const ghost = this.svgNode('rect', { x: x0, y: barY, width: span, height: barH, fill: 'rgba(20,20,18,0.09)' });
    ghost.style.transformOrigin = x0 + 'px ' + (barY + barH / 2) + 'px';
    s.appendChild(ghost);
    const bar = this.svgNode('rect', { x: x0, y: barY, width: span * ship, height: barH, fill: '#2C2B27' });
    bar.style.transformOrigin = x0 + 'px ' + (barY + barH / 2) + 'px';
    s.appendChild(bar);
    const mx = x0 + span * ship;
    const drop = this.svgNode('line', { x1: mx, y1: 34, x2: mx, y2: y, stroke: '#2C2B27', 'stroke-width': 1 });
    s.appendChild(drop);
    const dia = this.svgNode('rect', { x: mx - 5, y: 24, width: 10, height: 10, fill: '#2C2B27', transform: 'rotate(45 ' + mx + ' 29)' });
    s.appendChild(dia);
    const cap = this.svgNode('text', { x: mx + 13, y: 33, fill: '#1A1917', 'font-size': 12, 'font-family': 'inherit' });
    cap.textContent = 'first release'; s.appendChild(cap);
    const gcap = this.svgNode('text', { x: x1, y: 52, 'text-anchor': 'end', fill: '#8A8983', 'font-size': 11, 'font-family': 'inherit' });
    gcap.textContent = 'industry norm'; s.appendChild(gcap);
    if (still) return;
    ghost.style.transform = 'scaleX(0)';
    ghost.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 3400, delay: 200, easing: 'linear', fill: 'forwards' });
    bar.style.transform = 'scaleX(0)';
    bar.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 1500, delay: 200, easing: 'linear', fill: 'forwards' });
    [drop, dia, cap].forEach((n, i) => { n.style.opacity = '0'; n.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 380, delay: 1760 + i * 90, easing: E, fill: 'forwards' }); });
    gcap.style.opacity = '0';
    gcap.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, delay: 3400, fill: 'forwards' });
    s.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 560, delay: 5700, easing: 'ease', fill: 'forwards' });
  }

  vigEvals(box) {
    if (!box) return;
    const f = this.frame(box, 150), s = f.s, w = f.w;
    const x0 = 10, x1 = w - 10, span = x1 - x0, hi = 26, lo = 116;
    const still = this.reduced || this._still, N = 64, evs = [22, 44];
    const thr = hi + (lo - hi) * 0.42;
    s.appendChild(this.svgNode('line', { x1: x0, y1: thr, x2: x1, y2: thr, stroke: 'rgba(20,20,18,0.22)', 'stroke-width': 1, 'stroke-dasharray': '3 4' }));
    const tl = this.svgNode('text', { x: x0, y: thr - 8, fill: '#8A8983', 'font-size': 11, 'font-family': 'inherit' });
    tl.textContent = 'review threshold'; s.appendChild(tl);
    let seed = 7, v = 0.94, pts = [];
    const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return (seed / 0x7fffffff) - 0.5; };
    for (let i = 0; i < N; i++) {
      if (evs.indexOf(i) > -1) v = 0.955; else v -= 0.0042 + rnd() * 0.004;
      pts.push([x0 + span * (i / (N - 1)), lo - (lo - hi) * ((v - 0.86) / 0.12)]);
    }
    const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const path = this.svgNode('path', { d: d, fill: 'none', stroke: '#2C2B27', 'stroke-width': 1.5, 'stroke-linejoin': 'round' });
    s.appendChild(path);
    const marks = evs.map((i) => {
      const mx = x0 + span * (i / (N - 1));
      const g = this.svgNode('g', {});
      g.appendChild(this.svgNode('line', { x1: mx, y1: hi - 12, x2: mx, y2: lo + 8, stroke: 'var(--a)', 'stroke-width': 1 }));
      const t = this.svgNode('text', { x: mx + 6, y: hi - 4, fill: 'var(--a)', 'font-size': 11, 'font-family': 'inherit' });
      t.textContent = 'eval'; g.appendChild(t);
      s.appendChild(g); return g;
    });
    if (still) return;
    const len = path.getTotalLength ? path.getTotalLength() : span;
    path.style.strokeDasharray = len;
    path.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 3600, delay: 260, easing: 'linear', fill: 'forwards' });
    marks.forEach((g, k) => { g.style.opacity = '0'; g.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 260 + 3600 * (evs[k] / N), fill: 'forwards' }); });
    s.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 560, delay: 6100, easing: 'ease', fill: 'forwards' });
  }

  start() { return this.startVignettes(); }

  destroy() {
    this.timers.forEach(clearTimeout);
    this.timers = [];
    if (this._io) this._io.disconnect();
    if (this.raf) cancelAnimationFrame(this.raf);
  }
}
