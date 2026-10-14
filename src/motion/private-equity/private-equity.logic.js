/*
 * Private Equity page: intro, hero veil, 01 Premise stack, 02 Audit loop, 03 First 100 days, 04 Portfolio loop,
 * 05 Value bridge, 06 Engagement entry. Ported from design_handoff_private_equity/reference/Private Equity.dc.html,
 * the prototype's logic class, VERBATIM apart from these PORT SHIMS:
 *   * `extends DCLogic` -> `extends React.Component`, exported.
 *   * maybeIntro also skips on ?intro=off (the QA flag the AI Engineering and Private Credit ports carry).
 *   * initVeil reads the hero painting from public/ (HERO_SRC, components/private-equity/media.ts, the same file as the <img>) instead of
 *     "assets/hero-valley.png".
 * Method bodies are otherwise untouched: every window, easing, colour, number and string runs as the reference does.
 * The page component (components/private-equity/PrivateEquityPage.tsx) extends this class and adds render().
 */

import React from "react";
import { HERO_SRC } from "@/components/private-equity/media";

export class PrivateEquityLogic extends React.Component {
  constructor(props) {
    super(props);
    this.R = ["iWrap", "iStage", "iMark", "heroSec", "heroImg", "heroVeil", "stackTrack", "c1", "c2", "c3", "c1x", "c2x", "c3x", "c1f", "c2f", "c3f", "c1s", "c2s", "c3s", "dgFit", "dgStage", "dgScan", "dgAxes", "dgList", "plTrack", "plFit", "plStage", "plHead", "plDay", "pfFit", "pfStage", "pfChip", "vlFit", "vlStage", "enRow"];
    this.R.forEach(k => { this[k] = React.createRef(); });
    this.iTimers = [];
    this.iIvals = [];
  }
  cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  sm(a, b, x) { const u = this.cl((x - a) / (b - a)); return u * u * (3 - 2 * u); }
  still() { return !(this.props.motion ?? true) || !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
  q(root, sel) { if (!root) return []; root._q = root._q || {}; return root._q[sel] || (root._q[sel] = Array.from(root.querySelectorAll(sel))); }
  css(el, k, v) { if (el && el["_c" + k] !== v) { el.style[k] = v; el["_c" + k] = v; } }
  txt(el, v) { if (el && el._t !== v) { el.textContent = v; el._t = v; } }
  prog(track) { const r = track.getBoundingClientRect(), vh = window.innerHeight; return { m: this.cl((68 - r.top) / (r.height - (vh - 68))), on: r.bottom > -40 && r.top < vh + 40 }; }
  fit(box, stage, W, H, pad, max) {
    if (!box || !stage) return;
    const w = box.clientWidth, h = box.clientHeight, k = w + "x" + h;
    if (stage._fk === k) return;
    stage._fk = k;
    const p = pad || 0, s = Math.max(0.1, Math.min(max || 1, (w - 2 * p) / W, h ? (h - 2 * p) / H : 9));
    stage.style.transform = "translate(" + ((w - W * s) / 2).toFixed(1) + "px," + ((h - H * s) / 2).toFixed(1) + "px) scale(" + s.toFixed(4) + ")";
  }
  fill(p, P, base) {
    if (!p) return;
    const sp = p.children, N = sp.length, head = P * (N + 2.5);
    for (let i = 0; i < N; i++) this.css(sp[i], "opacity", (base + (1 - base) * this.cl((head - i) / 2.5)).toFixed(3));
  }
  reveal(root, p) {
    for (const el of this.q(root, "[data-r]")) {
      const a = +el.getAttribute("data-r"), v = this.sm(a, a + 0.08, p);
      this.css(el, "opacity", v.toFixed(3));
      this.css(el, "transform", "translateY(" + ((1 - v) * 8).toFixed(2) + "px)");
    }
  }
  clock(key, el, ms, top, bot) {
    const r = el.getBoundingClientRect(), vh = window.innerHeight, k = "_t0" + key;
    if (r.bottom < 0 || r.top > vh) { this[k] = null; return -1; }
    if (this[k] == null) { if (!(r.top < vh * top && r.bottom > vh * bot)) return -1; this[k] = ms; }
    return (ms - this[k]) / 1000;
  }
  // 01 · three cards roll over each other as the track scrolls.
  stepStack() {
    const tr = this.stackTrack.current;
    if (!tr) return;
    const { m, on } = this.prog(tr);
    if (!on) return;
    const t1 = this.sm(0.28, 0.38, m), t2 = this.sm(0.64, 0.74, m);
    this.css(this.c1.current, "transform", "translateX(" + (-(3 * t1 + 2 * t2)).toFixed(3) + "%) scale(" + (1 - 0.05 * t1 - 0.03 * t2).toFixed(4) + ")");
    this.css(this.c2.current, "transform", "translateX(" + ((1 - t1) * 108 - 3 * t2).toFixed(3) + "%) scale(" + (1 - 0.05 * t2).toFixed(4) + ")");
    this.css(this.c3.current, "transform", "translateX(" + ((1 - t2) * 108).toFixed(3) + "%)");
    const P = this.still() ? [1, 1, 1] : [this.cl((m - 0.02) / 0.24), this.cl((m - 0.38) / 0.24), this.cl((m - 0.75) / 0.2)];
    [[this.c1x, this.c1f, this.c1s, 620, 470], [this.c2x, this.c2f, this.c2s, 700, 520], [this.c3x, this.c3f, this.c3s, 660, 500]].forEach(([x, f, s, W, H], i) => {
      this.fill(x.current, this.cl(P[i] / 0.6), 0.16);
      this.fit(f.current, s.current, W, H, 0, 1.1);
      this.reveal(s.current, P[i]);
    });
  }
  dgData() {
    return {
      cos: [["Helix Logistics", "Logistics"], ["Ardent Dental Group", "Healthcare"], ["Northfield Foods", "Food distribution"], ["Corvid Software", "Vertical software"], ["Beacon Claims", "Insurance services"], ["Tallis Engineering", "Industrial services"]],
      wf: ["Order to cash", "Procure to pay", "Month-end close", "Customer service", "Pricing and renewals", "Reporting"],
      v: [[1.2, 0.5, 0.2, 0.3, 0.4, 0.1], [0.2, 0.1, 0.1, 0.5, 0.2, 0.1], [0.4, 0.3, 0.2, 0.1, 0.9, 0.2], [0.3, 0.1, 0.1, 0.5, 0.7, 0.2], [0.2, 0.2, 0.3, 0.8, 0.1, 0.3], [0.6, 0.4, 0.2, 0.1, 0.3, 0.1]],
      top: { "0-0": [380, 82, 46], "2-4": [530, 209, 40], "4-3": [305, 251, 38], "3-4": [230, 293, 36], "5-0": [155, 336, 34] }
    };
  }
  // 02 · 19s loop: scan the grid, shortlist, fly the shortlist onto an impact/effort plot, rank.
  stepDiag(ms) {
    const fitEl = this.dgFit.current, stg = this.dgStage.current;
    if (!fitEl || !stg) return;
    this.fit(fitEl, stg, 1120, 600, 0, 1);
    let t = this.clock("dg", fitEl, ms, 0.62, 0.25);
    if (t < 0) { this.css(stg, "opacity", "0"); return; }
    t = this.still() ? 13 : t % 19;
    const D = this._dg || (this._dg = this.dgData());
    this.css(stg, "opacity", (this.sm(0, 0.5, t) * (1 - this.sm(18.2, 18.9, t))).toFixed(3));
    const chrome = this.sm(0.2, 0.9, t) * (1 - this.sm(7.4, 8.1, t));
    this.q(stg, "[data-dg-chrome]").forEach(el => this.css(el, "opacity", chrome.toFixed(3)));
    const band = this.dgScan.current;
    if (band) {
      const x = Math.min(5, Math.max(0, (t - 1.0) / 0.75 - 0.3));
      this.css(band, "transform", "translateX(" + (126 * x).toFixed(1) + "px)");
      this.css(band, "opacity", (this.sm(0.8, 1.2, t) * (1 - this.sm(5.8, 6.3, t))).toFixed(3));
    }
    const dim = this.sm(6.2, 7.0, t), fly = this.sm(7.8, 9.2, t), gone = this.sm(7.4, 8.1, t), numOut = 1 - this.sm(7.8, 8.3, t);
    this.q(stg, "[data-cell]").forEach((el, i) => {
      const r = Math.floor(i / 6), c = i % 6, v = D.v[r][c], tp = D.top[r + "-" + c];
      const f = this.sm(1.0 + 0.75 * c + 0.05 * r, 1.4 + 0.75 * c + 0.05 * r, t);
      const sh = el.children[0], hi = el.children[1], num = el.children[2], shade = (0.05 + 0.6 * v / 1.2) * f;
      this.css(sh, "opacity", shade.toFixed(3));
      this.css(num, "opacity", (f * numOut).toFixed(3));
      this.css(num, "color", shade > 0.32 || (tp && dim > 0.4) ? "#FFFFFF" : "#1A1917");
      if (!tp) { this.css(el, "opacity", ((1 - 0.72 * dim) * (1 - gone)).toFixed(3)); return; }
      this.css(hi, "opacity", dim.toFixed(3));
      const gx = 186 + 126 * c, gy = 64 + 64 * r, d = tp[2];
      const w = 118 + (d - 118) * fly, h = 56 + (d - 56) * fly;
      const cx = gx + 59 + (tp[0] - gx - 59) * fly, cy = gy + 28 + (tp[1] - gy - 28) * fly;
      this.css(el, "transform", "translate(" + (cx - w / 2 - gx).toFixed(1) + "px," + (cy - h / 2 - gy).toFixed(1) + "px)");
      this.css(el, "width", w.toFixed(1) + "px");
      this.css(el, "height", h.toFixed(1) + "px");
      this.css(el, "borderRadius", (6 + (d / 2 - 6) * fly).toFixed(1) + "px");
      this.css(el, "opacity", "1");
    });
    this.css(this.dgAxes.current, "opacity", this.sm(8.2, 9.0, t).toFixed(3));
    this.q(stg, "[data-dl]").forEach((el, i) => this.css(el, "opacity", this.sm(9.0 + 0.12 * i, 9.5 + 0.12 * i, t).toFixed(3)));
    const L = this.dgList.current;
    if (L) {
      const v = this.sm(10.0, 10.6, t);
      this.css(L, "opacity", v.toFixed(3));
      this.css(L, "transform", "translateY(" + ((1 - v) * 12).toFixed(1) + "px)");
      this.q(L, "[data-li]").forEach((el, i) => {
        const u = this.sm(10.4 + 0.35 * i, 10.8 + 0.35 * i, t);
        this.css(el, "opacity", u.toFixed(3));
        this.css(el, "transform", "translateY(" + ((1 - u) * 6).toFixed(1) + "px)");
      });
    }
    const step = t < 6.2 ? 0 : t < 9.8 ? 1 : 2;
    this.q(stg, "[data-step]").forEach((el, i) => this.css(el, "opacity", i === step ? "1" : "0.42"));
  }
  // 03 · scroll scrubs day 0 → 100.
  stepPlan() {
    const tr = this.plTrack.current, stg = this.plStage.current;
    if (!tr || !stg) return;
    const { m, on } = this.prog(tr);
    if (!on) return;
    this.fit(this.plFit.current, stg, 1120, 620, 28, 1.15);
    const d = this.still() ? 100 : 100 * this.cl((m - 0.04) / 0.88);
    this.q(stg, "[data-bar]").forEach(el => {
      const s = +el.getAttribute("data-s"), e = +el.getAttribute("data-e"), p = this.cl((d - s) / (e - s));
      this.css(el, "width", (5.4 * (e - s) * p).toFixed(1) + "px");
    });
    this.q(stg, "[data-ms]").forEach(el => {
      const e = +el.getAttribute("data-ms"), v = this.sm(e - 0.5, e + 0.8, d);
      this.css(el, "opacity", v.toFixed(3));
      this.css(el, "transform", "rotate(45deg) scale(" + (0.4 + 0.6 * v).toFixed(3) + ")");
    });
    this.q(stg, "[data-ev]").forEach(el => {
      const e = +el.getAttribute("data-ev"), v = this.sm(e, e + 1.5, d);
      this.css(el, "opacity", v.toFixed(3));
      this.css(el, "transform", "translateY(" + ((1 - v) * 6).toFixed(1) + "px)");
    });
    this.css(this.plHead.current, "transform", "translateX(" + (5.4 * d).toFixed(1) + "px)");
    this.txt(this.plDay.current, "Day " + Math.round(d));
    let e = 0, h = 0, n = 0;
    [[42, 1.2, 310], [64, 0.5, 90], [86, 0.2, 140]].forEach(([dd, a, hh]) => { const u = this.sm(dd, dd + 4, d); e += a * u; h += hh * u; if (d >= dd) n++; });
    this.q(stg, "[data-kpi]").forEach(el => {
      const k = el.getAttribute("data-kpi");
      this.txt(el, k === "e" ? "£" + e.toFixed(2) + "m" : k === "h" ? String(Math.round(h)) : n + " of 3");
    });
    this.q(stg, "[data-st]").forEach(el => {
      const s = +el.getAttribute("data-s"), en = +el.getAttribute("data-e"), st = d >= en ? 2 : d >= s ? 1 : 0;
      if (el._st === st) return;
      el._st = st;
      el.textContent = ["Planned", "Building", "Live"][st];
      el.style.color = ["#6E6D67", "#1A1917", "#FFFFFF"][st];
      el.style.background = ["rgba(20,20,18,0.06)", "rgba(242,196,92,0.45)", "var(--a)"][st];
    });
  }
  // 04 · 16s loop: built at Helix, into the library, installed at four more companies.
  stepPort(ms) {
    const fitEl = this.pfFit.current, stg = this.pfStage.current;
    if (!fitEl || !stg) return;
    this.fit(fitEl, stg, 1120, 520, 0, 1);
    let t = this.clock("pf", fitEl, ms, 0.62, 0.25);
    if (t < 0) { this.css(stg, "opacity", "0"); return; }
    t = this.still() ? 14 : t % 16;
    this.css(stg, "opacity", (this.sm(0, 0.6, t) * (1 - this.sm(15.2, 15.9, t))).toFixed(3));
    const W = [6, 3, 2, 1.5, 1];
    const start = k => (k === 0 ? 1.0 : 5.6 + 1.7 * (k - 1) + 0.55), dur = k => (k === 0 ? 3.2 : 0.35 * W[k]);
    const bars = this.q(stg, "[data-pf-bar]"), dots = this.q(stg, "[data-pf-dot]"), wks = this.q(stg, "[data-pf-wk]"), dls = this.q(stg, "[data-pf-dl]");
    W.forEach((w, k) => {
      const p = this.cl((t - start(k)) / dur(k)), e = 1 - (1 - p) * (1 - p), px = 80 * w * e;
      this.css(bars[k], "width", px.toFixed(1) + "px");
      const live = this.sm(start(k) + dur(k), start(k) + dur(k) + 0.3, t);
      this.css(dots[k], "opacity", live.toFixed(3));
      this.css(dots[k], "transform", "translateX(" + px.toFixed(1) + "px) scale(" + (0.5 + 0.5 * live).toFixed(3) + ")");
      const val = Math.max(0.5, Math.round(w * e * 2) / 2);
      this.txt(wks[k], p > 0 ? (val % 1 ? val.toFixed(1) : String(val)) + (val === 1 ? " wk" : " wks") : "—");
      this.css(dls[k], "opacity", live.toFixed(3));
    });
    this.css(this.q(stg, "[data-pf-slot]")[0], "opacity", this.sm(5.2, 5.5, t).toFixed(3));
    this.txt(this.q(stg, "[data-pf-count]")[0], t >= 5.3 ? "1 capability" : "0 capabilities");
    this.css(this.q(stg, "[data-pf-sum]")[0], "opacity", this.sm(12.0, 12.6, t).toFixed(3));
    const chip = this.pfChip.current;
    if (!chip) return;
    const lib = [560, 57];
    let from = null, to = null, u = 0;
    if (t >= 4.5 && t < 5.3) { from = [800, 178]; to = lib; u = (t - 4.5) / 0.8; }
    for (let k = 1; k < 5; k++) { const s = 5.6 + 1.7 * (k - 1); if (t >= s && t < s + 0.6) { from = lib; to = [340, 178 + 72 * k]; u = (t - s) / 0.6; } }
    if (!from) { this.css(chip, "opacity", "0"); return; }
    const e = this.sm(0, 1, u), x = from[0] + (to[0] - from[0]) * e, y = from[1] + (to[1] - from[1]) * e - Math.sin(e * Math.PI) * 30;
    this.css(chip, "opacity", Math.min(1, u * 6, (1 - u) * 6 + 0.2).toFixed(3));
    this.css(chip, "transform", "translate(" + (x - 90).toFixed(1) + "px," + (y - 15).toFixed(1) + "px)");
  }
  // 05 · plays once on arrival: the bridge builds bar by bar, then the exit value.
  stepValue(ms) {
    const fitEl = this.vlFit.current, stg = this.vlStage.current;
    if (!fitEl || !stg) return;
    this.fit(fitEl, stg, 1120, 600, 0, 1);
    let t = this.clock("vl", fitEl, ms, 0.66, 0.2);
    if (t < 0) { this.css(stg, "opacity", "0"); return; }
    if (this.still()) t = 10;
    this.css(stg, "opacity", this.sm(0, 0.5, t).toFixed(3));
    this.css(this.q(stg, "[data-vl-axis]")[0], "opacity", this.sm(0.2, 0.8, t).toFixed(3));
    const B = [[12, 14.2], [14.2, 15.4], [15.4, 15.9], [15.9, 16.1], [16.1, 16.4], [12, 16.4]];
    const T = [0.4, 1.35, 1.95, 2.55, 3.15, 3.75], Dd = [0.8, 0.45, 0.45, 0.45, 0.45, 0.85];
    const Y = v => 430 - (v - 12) * 70;
    const bars = this.q(stg, "[data-vl-bar]"), labs = this.q(stg, "[data-vl-lab]"), nms = this.q(stg, "[data-vl-nm]"), cons = this.q(stg, "[data-vl-con]");
    B.forEach(([a, b], i) => {
      const p = this.sm(T[i], T[i] + Dd[i], t), base = Y(a), hh = (Y(a) - Y(b)) * p;
      this.css(bars[i], "height", hh.toFixed(1) + "px");
      this.css(bars[i], "top", (base - hh).toFixed(1) + "px");
      this.css(labs[i], "opacity", this.sm(T[i] + Dd[i] * 0.6, T[i] + Dd[i] + 0.25, t).toFixed(3));
      this.css(nms[i], "opacity", this.sm(T[i], T[i] + 0.4, t).toFixed(3));
      if (i > 0) this.css(cons[i - 1], "transform", "scaleX(" + this.sm(T[i] - 0.25, T[i], t).toFixed(3) + ")");
    });
    const add = [1.2, 0.5, 0.2, 0.3].reduce((s, v, i) => s + v * this.sm(T[i + 1], T[i + 1] + Dd[i + 1], t), 0);
    this.txt(this.q(stg, "[data-vl-run]")[0], "£" + (14.2 + add).toFixed(1) + "m");
    this.txt(this.q(stg, "[data-vl-pct]")[0], "+" + (add / 14.2 * 100).toFixed(1) + "%");
    const bn = this.q(stg, "[data-vl-ev]")[0], bv = this.sm(4.8, 5.3, t);
    this.css(bn, "opacity", bv.toFixed(3));
    this.css(bn, "transform", "translateY(" + ((1 - bv) * 8).toFixed(1) + "px)");
    this.txt(this.q(stg, "[data-vl-evn]")[0], "£" + (19.8 * this.sm(5.0, 6.4, t)).toFixed(1) + "m");
  }
  stepEngage(ms) {
    const row = this.enRow.current;
    if (!row) return;
    let t = this.clock("en", row, ms, 0.85, 0);
    if (this.still()) t = 5;
    this.q(row, "[data-en]").forEach((el, i) => {
      const v = t < 0 ? 0 : this.sm(0.12 * i, 0.12 * i + 0.6, t);
      this.css(el, "opacity", v.toFixed(3));
      this.css(el, "transform", "translateY(" + ((1 - v) * 24).toFixed(1) + "px)");
    });
  }
  tick(ms) {
    this.stepStack();
    this.stepDiag(ms);
    this.stepPlan();
    this.stepPort(ms);
    this.stepValue(ms);
    this.stepEngage(ms);
    if (this.stepVeil) this.stepVeil(ms);
  }
  applyTheme() { document.body.style.setProperty("--a", this.props.accent ?? "#157F52"); }
  componentDidMount() {
    if (this.maybeIntro) this.maybeIntro();
    this.applyTheme();
    const loop = ms => {
      this._raf = requestAnimationFrame(loop);
      try { this.tick(ms); } catch (e) { if (!this._err) { this._err = 1; console.error("PE tick: " + String((e && e.stack) || e)); } }
    };
    this._raf = requestAnimationFrame(loop);
    if (this.initVeil) this.initVeil();
  }
  componentDidUpdate() { this.applyTheme(); }
  componentWillUnmount() {
    cancelAnimationFrame(this._raf);
    if (this._veilOff) this._veilOff();
    if (this._iKey) window.removeEventListener("keydown", this._iKey);
  }
  maybeIntro() {
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if ((this.props.playIntro ?? true) && !reduced && !/[?&]intro=off/.test(location.search)) this.runIntro(); // QA flag
  }

  runIntro() {
    const wrap = this.iWrap.current, st = this.iStage.current, mark = this.iMark.current;
    if (!wrap || !st || !mark) return;
    wrap.style.display = "flex";
    st.textContent = "";
    const E = "cubic-bezier(.16,1,.3,1)";
    const accent = this.props.accent ?? "#157F52";
    const W = Math.min(540, window.innerWidth * 0.82);
    const box = this.iEl("position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:" + W + "px");
    st.appendChild(box);

    const steps = ["audit the portfolio", "rank by EBITDA impact", "ship the first build", "carry it to the next company"];
    steps.forEach((label, i) => {
      const row = this.iEl("display:flex; align-items:center; gap:18px; padding:15px 0; border-top:1px solid rgba(20,20,18,0.12); opacity:0");
      row.appendChild(this.iEl("width:24px; font-size:13px; color:#6E6D67", "0" + (i + 1)));
      row.appendChild(this.iEl("flex:1; font-size:17.5px; letter-spacing:-0.022em", label));
      const track = this.iEl("position:relative; width:68px; height:3px; background:rgba(20,20,18,0.13)");
      const fill = this.iEl("position:absolute; inset:0; background:" + (i === steps.length - 1 ? accent : "#2C2B27") + "; transform:scaleX(0); transform-origin:0 50%");
      track.appendChild(fill);
      row.appendChild(track);
      box.appendChild(row);
      const t = i * 440;
      row.animate([{ opacity: 0, transform: "translateY(7px)" }, { opacity: 1, transform: "none" }],
        { duration: 440, delay: 120 + t, easing: E, fill: "forwards" });
      fill.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
        { duration: 560, delay: 280 + t, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" });
    });

    const foot = this.iEl("margin-top:24px; padding-top:16px; border-top:1px solid rgba(20,20,18,0.12); display:flex; justify-content:space-between; font-size:14px; color:#6E6D67; opacity:0");
    foot.appendChild(this.iEl("", "5 companies live"));
    foot.appendChild(this.iEl("font-variant-numeric:tabular-nums", "day 100"));
    box.appendChild(foot);
    foot.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 440, delay: 2060, fill: "forwards" });

    this.iTimers.push(setTimeout(() => {
      box.animate([{ opacity: 1, transform: "translate(-50%,-50%) scale(1)" }, { opacity: 0, transform: "translate(-50%,-50%) scale(.985)" }],
        { duration: 620, easing: "ease", fill: "forwards" });
    }, 2560));

    this.iMarkIn(mark, 3020);
    this.iLift(wrap, 4260);
  }

  iTeardown(ms) {
    const wrap = this.iWrap.current;
    if (!wrap) return function () {};
    wrap.style.pointerEvents = "none";
    const finish = () => {
      if (this._iGone) return;
      this._iGone = true;
      wrap.style.display = "none";
      this.iClear();
    };
    this.iTimers.push(setTimeout(finish, ms + 140));
    return finish;
  }

  skipIntro() {
    const w = this.iWrap.current;
    if (!w || this._iDone) return;
    this._iDone = true;
    this.iClear();
    const finish = this.iTeardown(280);
    w.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 280, fill: "forwards" }).onfinish = finish;
  }

  iLift(wrap, at) {
    this.iTimers.push(setTimeout(() => {
      if (this._iDone) return;
      this._iDone = true;
      const finish = this.iTeardown(560);
      wrap.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 560, easing: "ease", fill: "forwards" }).onfinish = finish;
    }, at));
    this._iKey = () => this.skipIntro();
    window.addEventListener("keydown", this._iKey, { once: true });
  }

  iMarkIn(mark, at) {
    mark.style.opacity = "0";
    mark.animate([{ opacity: 0, transform: "scale(.972)" }, { opacity: 1, transform: "none" }],
      { duration: 780, delay: at, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" });
  }

  iClear() {
    this.iTimers.forEach(clearTimeout); this.iTimers = [];
    this.iIvals.forEach(clearInterval); this.iIvals = [];
  }

  iEl(css, text) {
    const n = document.createElement("div");
    n.style.cssText = css;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  el(tag, css, txt) { const n = document.createElement(tag); n.style.cssText = css; if (txt !== undefined) n.textContent = txt; return n; }

  // A section's own reveal window: its top edge travelling from 82% to 28% of the viewport.
  // Height-independent, so a tall module and a short one read at the same pace.

  initVeil() {
    const sec = this.heroSec.current, cv = this.heroVeil.current;
    if (!sec || !cv) return;
    this._vPts = [];
    const src = new Image();
    src.onload = () => { this._vImg = src; this._vGrey = null; this._vDirty = true; };
    src.src = HERO_SRC;
    const onMove = (e) => {
      if (!this._vGrey) return;
      if (!(this.props.motion ?? true)) return;
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const r = sec.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      const last = this._vPts[this._vPts.length - 1];
      if (last && Math.hypot(x - last.x, y - last.y) < 14) return;
      this._vPts.push({ x: x, y: y, t: performance.now(), s: Math.random() * 6.28, r: 53 + Math.random() * 31 });
      if (this._vPts.length > 90) this._vPts.shift();
    };
    sec.addEventListener("pointermove", onMove);
    this._veilOff = () => sec.removeEventListener("pointermove", onMove);
  }

  // greyscale copy, cover-fit and bottom-anchored to match the img beneath

  buildGrey(cw, ch) {
    const im = this._vImg;
    const s = Math.max(cw / im.naturalWidth, ch / im.naturalHeight);
    const dw = im.naturalWidth * s, dh = im.naturalHeight * s;
    const c = document.createElement("canvas");
    c.width = cw; c.height = ch;
    const x = c.getContext("2d");
    x.drawImage(im, (cw - dw) / 2, ch - dh, dw, dh);
    const d = x.getImageData(0, 0, cw, ch), p = d.data;
    for (let i = 0; i < p.length; i += 4) { const l = 0.3 * p[i] + 0.59 * p[i + 1] + 0.11 * p[i + 2]; p[i] = p[i + 1] = p[i + 2] = l; }
    x.putImageData(d, 0, 0);
    return c;
  }

  stepVeil(ms) {
    const sec = this.heroSec.current, cv = this.heroVeil.current;
    if (!sec || !cv || !this._vPts || !this._vImg) return;
    const cw = Math.max(1, sec.clientWidth), ch = Math.max(1, sec.clientHeight);
    if (cv.width !== cw || cv.height !== ch || !this._vGrey) {
      cv.width = cw; cv.height = ch;
      this._vGrey = this.buildGrey(cw, ch);
      this._vDirty = true;
      const img = this.heroImg.current;
      if (img) img.style.filter = "none";
    }
    const LIFE = 2400;
    this._vPts = this._vPts.filter((p) => ms - p.t < LIFE);
    if (!this._vPts.length && !this._vDirty) return;
    this._vDirty = this._vPts.length > 0;
    const x = cv.getContext("2d");
    x.globalCompositeOperation = "source-over";
    x.clearRect(0, 0, cw, ch);
    x.drawImage(this._vGrey, 0, 0);
    if (!this._vPts.length) return;
    x.globalCompositeOperation = "destination-out";
    for (const p of this._vPts) {
      const age = (ms - p.t) / LIFE, fin = Math.min(1, (ms - p.t) / 140);
      const a = 0.95 * fin * Math.pow(1 - age, 1.6);
      const R = p.r * (1 + 0.55 * age);
      for (let k = 0; k < 3; k++) {
        const ang = p.s + k * 2.1, cx = p.x + Math.cos(ang) * R * 0.34, cy = p.y + Math.sin(ang * 1.3) * R * 0.28;
        const rr = R * (0.72 + 0.14 * k);
        const rg = x.createRadialGradient(cx, cy, 0, cx, cy, rr);
        rg.addColorStop(0, "rgba(0,0,0," + (a * 0.7).toFixed(3) + ")");
        rg.addColorStop(0.55, "rgba(0,0,0," + (a * 0.5).toFixed(3) + ")");
        rg.addColorStop(1, "rgba(0,0,0,0)");
        x.fillStyle = rg;
        x.beginPath(); x.arc(cx, cy, rr, 0, 6.2832); x.fill();
      }
    }
  }
  renderVals() {
    const D = this._dg || (this._dg = this.dgData()), v = {};
    this.R.forEach(k => { v[k] = this[k]; });
    return Object.assign(v, {
      skipIntro: () => { if (this.skipIntro) this.skipIntro(); },
      w1: "Every portfolio company has AI pilots. Most of them live on one person’s laptop.".split(" "),
      w2: "Six companies, six approaches. None of it rolls up into the board pack.".split(" "),
      w3: "The hold is still five years, and every number in the plan gets diligenced at exit.".split(" "),
      dgWf: D.wf,
      dgCos: D.cos.map(([n, s]) => ({ n, s })),
      dgCells: D.v.flat().map(x => ({ t: x.toFixed(1) }))
    });
  }
}
