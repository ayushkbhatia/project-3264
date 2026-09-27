/*
 * 03+04+05 dark canvas: scroll hold on 03, platform flight 03 -> 04, 04 scene, 05 scene.
 * VERBATIM logic class from the prototype (reference/). Port source, not a drop-in module.
 * It is a React class component minus render(): props, state, setState, lifecycle, refs via React.createRef(),
 * and renderVals(), whose keys feed the {{ holes }} in the template (reference/sections/*.html).
 * Drives the child Rebuild graphic through window.__rbCtl = { t, shown }: t is the timeline the parent wants (null = child auto-plays),
 * shown is what the child last drew. scene() writes 04 into [data-svg="1a"]; scene05() writes 05 into [data-svg="05"], every frame on screen.
 */

class Component extends DCLogic {
  wrapEl = React.createRef(); flyEl = React.createRef(); frameEl = React.createRef();
  latEl = React.createRef(); boxEl = React.createRef(); f5El = React.createRef();
  componentDidMount() {
    this.t0 = performance.now(); this.raf = requestAnimationFrame(this.tick);
    window.__rbCtl = { t: null, shown: 0 };
    this._release = () => { if (this.locked) { this.locked = false; this.completed = true; } };
    window.addEventListener("hashchange", this._release);
    this._onClick = (e) => { const a = e.target && e.target.closest && e.target.closest('a[href^="#"]'); if (a) this._release(); };
    document.addEventListener("click", this._onClick, true);
    // while 03 is still building, downward scroll input is held and fed into 03 instead
    const push = (d) => { const c = window.__rbCtl; this.scrub = this.cl((this.scrub != null ? this.scrub : (c && c.shown) || 0) + d); this.lastScrub = performance.now(); };
    this._onWheel = (e) => { if (this.locked && e.deltaY > 0) { e.preventDefault(); push(e.deltaY / 1400); } };
    this._onTouchStart = (e) => { this._ty = e.touches[0].clientY; };
    this._onTouchMove = (e) => { const y = e.touches[0].clientY, dy = (this._ty != null ? this._ty : y) - y; this._ty = y; if (this.locked && dy > 0) { e.preventDefault(); push(dy / 900); } };
    this._onKey = (e) => { if (this.locked && ["ArrowDown", "PageDown", "End", " "].indexOf(e.key) >= 0) { e.preventDefault(); push(0.12); } };
    window.addEventListener("wheel", this._onWheel, { passive: false });
    window.addEventListener("touchstart", this._onTouchStart, { passive: true });
    window.addEventListener("touchmove", this._onTouchMove, { passive: false });
    window.addEventListener("keydown", this._onKey);
    const fit = () => { const bx = this.boxEl.current, w = this.wrapEl.current; if (!bx || !w) return; const sc = bx.clientWidth / 1280; w.style.transform = "scale(" + sc + ")"; bx.style.height = (2980 * sc) + "px"; };
    this.ro = new ResizeObserver(fit); if (this.boxEl.current) this.ro.observe(this.boxEl.current); fit();
    const g = this.latEl.current;
    if (g) {
      const a = 0.779, b = 0.45; let s = "";
      for (let i = -100; i <= 100; i++) s += '<line x1="' + i * 40 + '" y1="-4000" x2="' + i * 40 + '" y2="4000"/><line x1="-4000" y1="' + i * 40 + '" x2="4000" y2="' + i * 40 + '"/>';
      g.setAttribute("transform", "matrix(" + a + "," + b + "," + (-a) + "," + b + ",640,1000)");
      g.innerHTML = s;
    }
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.raf); if (this.ro) this.ro.disconnect();
    window.removeEventListener("hashchange", this._release); document.removeEventListener("click", this._onClick, true);
    window.removeEventListener("wheel", this._onWheel); window.removeEventListener("touchstart", this._onTouchStart);
    window.removeEventListener("touchmove", this._onTouchMove); window.removeEventListener("keydown", this._onKey);
    window.__rbCtl = null;
  }
  // 03 progress from scroll: 0 as 03 enters, 1 once ~three quarters of it has scrolled past the lower screen
  scroll03() {
    const w = this.wrapEl.current, top = w && w.children[3];
    if (!top) return 0;
    const r = top.getBoundingClientRect(), vh = window.innerHeight || 800;
    return this.cl((vh * 0.85 - r.top) / (r.height * 0.75));
  }
  cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  sm(a, b, x) { const u = this.cl((x - a) / (b - a)); return u * u * (3 - 2 * u); }
  rows() {
    return [
      { s: "Intake",  ah: 0.5, bh: 0 },
      { s: "Capture", ah: 2.0, bh: 0 },
      { s: "Check",   ah: 1.5, bh: 0.2 },
      { s: "Approve", ah: 1.0, bh: 0.2 },
      { s: "File",    ah: 0.5, bh: 0 }
    ];
  }
  // scroll handoff: the platform lifts off 03 and travels into 1a as 1a comes into view
  scrollP() {
    const fr = this.frameEl.current;
    if (!fr) return 0;
    const r = fr.getBoundingClientRect(), vh = window.innerHeight || 800;
    return this.cl((vh * 0.95 - r.top) / (vh * 0.75));
  }
  fly(p) {
    const W = this.wrapEl.current, F = this.flyEl.current, fr = this.frameEl.current, src = document.querySelector('[data-svg="2a"]');
    if (!W || !F || !fr) return;
    if (p <= 0.001 || p >= 0.999 || !src) { F.style.display = "none"; return; }
    const wr = W.getBoundingClientRect(), z = wr.width / (W.offsetWidth || 1) || 1;
    const sr = src.getBoundingClientRect(), frr = fr.getBoundingClientRect();
    const sx = (sr.left - wr.left) / z + 360, sy = (sr.top - wr.top) / z + 310;
    const ex = (frr.left - wr.left) / z + 601, ey = (frr.top - wr.top) / z + 570;
    const e = p * p * (3 - 2 * p), x = sx + (ex - sx) * e, y = sy + (ey - sy) * e - Math.sin(e * Math.PI) * 70, sc = 1 + 0.06 * Math.sin(e * Math.PI);
    if (!this._fly4) this._fly4 = this.scene(0, { cx: 280, cy: 260 }).split("pf_").join("pv_");
    if (F._v !== 4) { F.innerHTML = this._fly4; F._v = 4; }
    F.style.display = "block";
    F.style.transform = "translate(" + (x - 280).toFixed(1) + "px," + (y - 260).toFixed(1) + "px) scale(" + sc.toFixed(3) + ")";
    F.style.opacity = String(this.cl(p / 0.08));
  }
  tick = (now) => {
    // scroll drives 03 while the user is scrolling; auto-play resumes from that point when they stop.
    // The handoff only begins once 03 has completed, and 03 holds its end state while the platform is away.
    const ctl = window.__rbCtl;
    // 03 starts when its middle reaches mid-screen. The page is then held there until 03 has fully
    // assembled: auto-play runs, and downward wheel/touch/keys scrub it forward instead of scrolling.
    // Once 03 closes the hold releases and the next ~0.6 screen of scroll flies the platform into 04.
    let p = 0;
    const w0 = this.wrapEl.current && this.wrapEl.current.children[3];
    if (w0 && ctl) {
      const r0 = w0.getBoundingClientRect(), vh = window.innerHeight || 800, H = r0.height || 1;
      const top0 = 88;
      if (r0.top > vh) { this.arrived = false; this.completed = false; this.locked = false; this.scrub = null; }
      // only hold when 03 is crossing the hold point from below; jumps well past it (anchors, hash loads,
      // scrollbar drags, flings) mark 03 as done instead of pulling the reader back
      if (!this.completed && !this.locked && r0.top <= top0 - vh * 0.5) { this.completed = true; this.arrived = true; }
      if (!this.completed && r0.top <= top0 + 1) {
        if (!this.locked) { this.locked = true; this.lockY = window.scrollY + (r0.top - top0); window.scrollTo(0, this.lockY); }
        this.arrived = true;
      }
      if (this.locked) {
        if (window.scrollY > this.lockY + 1) window.scrollTo(0, this.lockY);
        else if (window.scrollY < this.lockY - 40) this.locked = false;
      }
      if (!this.arrived) { this.tc = null; ctl.t = 0; }
      else if (this.completed) { ctl.t = 1; p = this.cl((top0 - r0.top) / (vh * 0.6)); }
      else if (this.scrub != null && now - this.lastScrub < 900) {
        if (this.tc == null) this.tc = ctl.shown || 0;
        this.tc += (this.scrub - this.tc) * 0.12;
        if (Math.abs(this.scrub - this.tc) < 0.002) this.tc = this.scrub;
        ctl.t = this.tc;
      } else { this.scrub = null; this.tc = null; ctl.t = null; }
      if (!this.completed && (ctl.shown || 0) >= 0.999) { this.completed = true; this.locked = false; this.scrub = null; this.tc = null; }
    }
    if (p >= 0.999) { if (this.land == null) this.land = now; } else this.land = null;
    const s4 = this.land == null ? -1 : (now - this.land) / 1000;
    this.fly(p);
    const host = document.querySelector('[data-svg="1a"]'), f4 = this.frameEl.current;
    if (host && f4) {
      const r4 = f4.getBoundingClientRect(), vh4 = window.innerHeight || 800;
      if ((r4.bottom > -50 && r4.top < vh4 + 50) || !this._d4) {
        host.innerHTML = this.scene(s4, null, p, now / 1000); this._d4 = true;
        f4.querySelectorAll("[data-c4]").forEach((el) => { const u = el.getAttribute("data-c4") === "1" ? this.sm(0.4, 1.0, s4) : this.sm(3.0, 3.6, s4); el.style.opacity = u.toFixed(3); el.style.transform = "translateY(" + ((1 - u) * 8).toFixed(1) + "px)"; });
      }
    }
    // 05 plays once the reader reaches it, then loops the trace with the letter left in place
    const f5 = this.f5El.current, h5 = document.querySelector('[data-svg="05"]');
    if (f5 && h5) {
      const r5 = f5.getBoundingClientRect(), vh = window.innerHeight || 800;
      if (r5.top < vh * 0.45) { if (this.on5 == null) this.on5 = now; } else if (r5.top > vh) this.on5 = null;
      if (r5.bottom > -50 && r5.top < vh + 50 || this._s5 == null) {
        const s5 = this.on5 == null ? 0 : ((now - this.on5) / 1000) % 100000;
        h5.innerHTML = this.scene05(s5); this._s5 = s5;
        f5.querySelectorAll("[data-o5]").forEach((el) => { const k = +el.getAttribute("data-o5"), u = this.sm(3.3 + k * 0.18, 4.0 + k * 0.18, s5); el.style.opacity = u.toFixed(3); el.style.transform = "translateY(" + ((1 - u) * 10).toFixed(1) + "px)"; });
      }
    }
    this.raf = requestAnimationFrame(this.tick);
  };
  gear(gx, gy, ro, ri, n, hole, rot) {
    const st = Math.PI * 2 / n, p = [];
    for (let i = 0; i < n; i++) {
      const a0 = i * st + (rot || 0);
      [[a0 - st * 0.28, ri], [a0 - st * 0.14, ro], [a0 + st * 0.14, ro], [a0 + st * 0.28, ri]].forEach((q) => p.push((gx + Math.cos(q[0]) * q[1]).toFixed(2) + " " + (gy + Math.sin(q[0]) * q[1]).toFixed(2)));
    }
    return "M" + p.join(" L") + " Z M" + (gx + hole) + " " + gy + " A" + hole + " " + hole + " 0 1 0 " + (gx - hole) + " " + gy + " A" + hole + " " + hole + " 0 1 0 " + (gx + hole) + " " + gy + " Z";
  }
  // ---------- 04 Platform: scattered sources in, the platform from 03 in the middle, one line of stations out ----------
  // s = seconds since the platform landed (<0 before), p = fly progress, g = wall clock for idle motion.
  // With eo only the closed platform is drawn, at eo.cx/eo.cy (the flyer).
  scene(s, eo, p, g) {
    const S = 0.9, a = 0.866 * S, b = 0.5 * S, cx = eo ? eo.cx : 601, cy = eo ? eo.cy : 570;
    if (p == null) p = 1;
    g = g || 0;
    const f = (n) => (Math.round(n * 100) / 100).toString();
    const o = [], late = [];
    const INK = "rgba(244,243,240,0.74)", NS = ' vector-effect="non-scaling-stroke"';
    const sm = (x0, x1, x) => this.sm(x0, x1, x), cl = (x) => this.cl(x);
    const P = (x, y, z) => [cx + (x - y) * a, cy + (x + y) * b - z * S];
    const pt = (q) => f(q[0]) + "," + f(q[1]);
    const mTop = (z) => "matrix(" + f(a) + "," + f(b) + "," + f(-a) + "," + f(b) + "," + f(cx) + "," + f(cy - z * S) + ")";
    const mY = (y0) => "matrix(" + f(a) + "," + f(b) + ",0," + f(-S) + "," + f(cx - a * y0) + "," + f(cy + b * y0) + ")";
    const mX = (x0) => "matrix(" + f(-a) + "," + f(b) + ",0," + f(-S) + "," + f(cx + a * x0) + "," + f(cy + b * x0) + ")";
    const pl = (X, Y) => "matrix(" + f(a) + "," + f(b) + ",0," + f(S) + "," + f(X) + "," + f(Y) + ")";
    const sp = (X, Y, u, v) => [X + u * a, Y + u * b + v * S];
    const G = (tr, inner, op, extra) => "<g" + (tr ? ' transform="' + tr + '"' : "") + (op != null && op < 0.999 ? ' opacity="' + f(Math.max(0, op)) + '"' : "") + (extra || "") + ">" + inner + "</g>";
    const R = (x, y, w, hh, fill, st, sw, rx) => '<rect x="' + f(x) + '" y="' + f(y) + '" width="' + f(Math.max(0, w)) + '" height="' + f(Math.max(0, hh)) + '"' + (rx ? ' rx="' + rx + '"' : "") + ' fill="' + (fill || "none") + '" stroke="' + (st || "none") + '" stroke-width="' + (sw || 0.8) + '"' + NS + "/>";
    const C = (x, y, r, fill, st, sw) => '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(r) + '" fill="' + (fill || "none") + '" stroke="' + (st || "none") + '" stroke-width="' + (sw || 0.8) + '"' + NS + "/>";
    const Ln = (x1, y1, x2, y2, sw, col) => '<line x1="' + f(x1) + '" y1="' + f(y1) + '" x2="' + f(x2) + '" y2="' + f(y2) + '" stroke="' + (col || INK) + '" stroke-width="' + (sw || 1) + '"' + NS + "/>";
    const Pa = (d, fill, st, sw, extra) => '<path d="' + d + '" fill="' + (fill || "none") + '" stroke="' + (st || "none") + '" stroke-width="' + (sw || 0.8) + '" stroke-linejoin="round" stroke-linecap="round"' + NS + (extra || "") + "/>";
    const WH = { top: "url(#pf_gt)", l: "rgba(255,255,255,0.07)", r: "rgba(255,255,255,0.14)" };
    const box = (x, y, z, w, d, hh, c, op) => {
      if (op != null && op < 0.01) return;
      c = c || WH;
      const st = c.st || INK;
      o.push(G("", G(mY(y + d), R(x, z, w, hh, c.l, st)) + G(mX(x + w), R(y, z, d, hh, c.r, st)) + G(mTop(z + hh), R(x, y, w, d, c.top, st)), op));
    };
    const ext = (z, th, d, side, top, st) => {
      const n = Math.max(2, Math.ceil(th * S / 1.1)), sh = '<path d="' + d + '"' + NS + "/>";
      let q = G(mTop(z), sh, null, ' fill="' + side + '" stroke="' + INK + '" stroke-width="0.8" fill-rule="evenodd"');
      for (let i = 1; i < n; i++) q += G(mTop(z + th * i / n), sh, null, ' fill="' + side + '" stroke="' + side + '" stroke-width="1.4" fill-rule="evenodd"');
      o.push(q + G(mTop(z + th), sh, null, ' fill="' + top + '" stroke="' + (st || INK) + '" stroke-width="0.8" stroke-linejoin="round" fill-rule="evenodd"'));
    };
    const cyl = (x, y, z, r, hh, side, top) => {
      const B = P(x, y, z), Tt = P(x, y, z + hh), rx = 1.2247 * r * S, ry = 0.7071 * r * S;
      o.push('<path d="M' + f(B[0] - rx) + " " + f(Tt[1]) + " L" + f(B[0] - rx) + " " + f(B[1]) + " A" + f(rx) + " " + f(ry) + " 0 0 0 " + f(B[0] + rx) + " " + f(B[1]) + " L" + f(B[0] + rx) + " " + f(Tt[1]) + ' Z" fill="' + side + '" stroke="' + INK + '" stroke-width="0.8"/>' + G(mTop(z + hh), C(x, y, r, top, INK)));
    };
    const text = (x, y, str, op, sz, col, mono, anchor) => late.push('<text x="' + f(x) + '" y="' + f(y) + '" fill="' + col + '" font-family="' + (mono ? "IBM Plex Mono, monospace" : "Instrument Sans, Helvetica Neue, Helvetica, sans-serif") + '" font-size="' + sz + '" font-weight="' + (mono ? 400 : 500) + '" letter-spacing="' + (mono ? "0.4" : "-0.1") + '" text-anchor="' + (anchor || "middle") + '" opacity="' + f(op) + '">' + str + "</text>");
    const bead = (x, y, op, col, r) => { r = r || 6.5; if (op > 0.01) o.push('<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + r + '" fill="' + (col || "#F3C9A8") + '" opacity="' + f(0.28 * op) + '"/><circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + (r > 5 ? 2.3 : 1.6) + '" fill="#FBF1E4" opacity="' + f(op) + '"/>'); };
    const bz = (W, t) => { const u = 1 - t, k0 = u * u * u, k1 = 3 * u * u * t, k2 = 3 * u * t * t, k3 = t * t * t; return [k0 * W[0][0] + k1 * W[1][0] + k2 * W[2][0] + k3 * W[3][0], k0 * W[0][1] + k1 * W[1][1] + k2 * W[2][1] + k3 * W[3][1]]; };
    const PG = '<stop offset="0" stop-color="#A8C8E8"/><stop offset="0.3" stop-color="#E9E4CF"/><stop offset="0.55" stop-color="#F3C9A8"/><stop offset="0.8" stop-color="#D9C3E8"/><stop offset="1" stop-color="#AEC9DE"/>';
    o.push("<defs>" +
      '<linearGradient id="pf_pg" x1="0" y1="0" x2="1" y2="1">' + PG + "</linearGradient>" +
      '<linearGradient id="pf_sg" gradientUnits="userSpaceOnUse" x1="' + f(cx - 160) + '" y1="0" x2="' + f(cx + 200) + '" y2="0">' + PG + "</linearGradient>" +
      '<linearGradient id="pf_gt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.36"/><stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.12"/><stop offset="1" stop-color="#E6EEF6" stop-opacity="0.22"/></linearGradient>' +
      '<linearGradient id="pf_gc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.22"/><stop offset="0.45" stop-color="#FFFFFF" stop-opacity="0.06"/><stop offset="1" stop-color="#F3E6DC" stop-opacity="0.12"/></linearGradient>' +
      '<linearGradient id="pf_dk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2E3036" stop-opacity="0.9"/><stop offset="1" stop-color="#0C0C0E" stop-opacity="0.88"/></linearGradient>' +
      '<radialGradient id="pf_glow"><stop offset="0" stop-color="#F3C9A8" stop-opacity="0.5"/><stop offset="0.4" stop-color="#D9C3E8" stop-opacity="0.22"/><stop offset="1" stop-color="#AEC9DE" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="pf_halo"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.15"/><stop offset="0.38" stop-color="#E6E1F0" stop-opacity="0.06"/><stop offset="1" stop-color="#A8C8E8" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="pf_fl"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.9"/><stop offset="0.25" stop-color="#F9E7D6" stop-opacity="0.32"/><stop offset="1" stop-color="#F9E7D6" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="pf_cd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.2"/><stop offset="0.55" stop-color="#FFFFFF" stop-opacity="0.05"/><stop offset="1" stop-color="#E6EEF6" stop-opacity="0.12"/></linearGradient>' +
      '<linearGradient id="pf_ic" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F9E7D6"/><stop offset="0.5" stop-color="#F3C9A8"/><stop offset="1" stop-color="#D9C3E8"/></linearGradient>' +
      '<linearGradient id="pf_gl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.05"/><stop offset="0.45" stop-color="#F3C9A8" stop-opacity="0.14"/><stop offset="0.75" stop-color="#D9C3E8" stop-opacity="0.3"/><stop offset="1" stop-color="#A8C8E8" stop-opacity="0.5"/></linearGradient>' +
      '<linearGradient id="pf_gr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.08"/><stop offset="0.3" stop-color="#FFFFFF" stop-opacity="0.04"/><stop offset="0.65" stop-color="#D9C3E8" stop-opacity="0.3"/><stop offset="1" stop-color="#A8C8E8" stop-opacity="0.55"/></linearGradient>' +
      "</defs>");

    // the 03 platform, assembled; the lid (L0) can lift off the glass layers
    const stack = (lift, rot) => {
      const CORN = [[-88, -88], [88, -88], [88, 88], [-88, 88]], POST = "rgba(255,255,255,0.2)", CAP = "rgba(255,255,255,0.6)";
      box(-100, -100, 0, 200, 200, 10, { top: "url(#pf_dk)", l: "rgba(22,23,26,0.82)", r: "rgba(36,37,42,0.82)", st: "rgba(244,243,240,0.4)" });
      let q = "";
      for (let i = 0; i < 7; i++) q += Ln(-80, -70 + i * 20, i % 2 ? 30 : 56, -70 + i * 20, 1, "rgba(233,228,207,0.28)");
      q += R(50, 40, 32, 32, "url(#pf_pg)", "rgba(0,0,0,0.6)", 0.8, 3) + Ln(58, 56, 64, 62, 1.6, INK) + Ln(64, 62, 75, 48, 1.6, INK);
      CORN.concat([[0, -88], [0, 88], [88, 0], [-88, 0]]).forEach((c) => { q += C(c[0], c[1], 3.4, "#0A0A0A", "rgba(244,243,240,0.6)"); });
      o.push(G(mTop(10), q));
      CORN.forEach((c) => cyl(c[0], c[1], 10, 3.2, 12, POST, CAP));
      box(-100, -100, 22, 200, 200, 6, WH);
      o.push(G(mTop(28), R(-84, -64, 58, 14, "rgba(255,255,255,0.16)", INK, 0.8, 7) + R(-84, -42, 58, 14, "rgba(255,255,255,0.16)", INK, 0.8, 7) + R(20, 84, 70, 8, "rgba(255,255,255,0.16)", INK, 0.8, 2) + C(-88, 88, 3, INK) + C(88, 88, 3, INK)));
      box(58, -92, 28, 34, 62, 18, WH);
      ext(28, 10, this.gear(-22, 34, 38, 31, 14, 10, rot), "rgba(255,255,255,0.16)", "url(#pf_pg)", INK);
      ext(38, 7, this.gear(-22, 34, 20, 16, 10, 5, rot), "rgba(255,255,255,0.18)", "url(#pf_gt)", INK);
      [22, 44, 66].forEach((x, i) => cyl(x, 64, 28, 8, 8 + i * 3, "rgba(255,255,255,0.16)", "url(#pf_pg)"));
      CORN.forEach((c) => cyl(c[0], c[1], 28, 3.2, 22, POST, CAP));
      ext(50, 6, "M-100 -100 H100 V100 H-100 Z M-10 5 H55 V70 H-10 Z", "rgba(255,255,255,0.14)", "url(#pf_gt)", INK);
      let c1 = R(-86, -86, 72, 60, "rgba(10,10,12,0.55)", INK);
      ["M-80 -78 H-60 V-66 H-38 V-80 H-22", "M-80 -64 H-68 V-50 H-46 V-58 H-20", "M-80 -38 H-56 V-32 H-30 V-46 H-18", "M-72 -54 V-36", "M-50 -80 V-72", "M-32 -74 H-24 V-62 H-34"].forEach((d) => { c1 += Pa(d, "none", "#E9E4CF", 1); });
      [[-60, -66], [-46, -58], [-30, -46], [-24, -62], [-72, -36]].forEach((c) => { c1 += C(c[0], c[1], 2, "#F3C9A8", "none"); });
      c1 += C(-88, -88, 2.4, INK) + C(88, 88, 2.4, INK) + C(88, -88, 2.4, INK) + C(-88, 88, 2.4, INK);
      o.push(G(mTop(56), c1));
      box(40, -92, 56, 50, 50, 14, WH);
      let fan = C(65, -67, 19, "url(#pf_pg)", INK);
      for (let i = 0; i < 20; i++) { const an = i * Math.PI / 10 + rot * 2.5; fan += Ln(65 + Math.cos(an) * 6, -67 + Math.sin(an) * 6, 65 + Math.cos(an + 0.35) * 18, -67 + Math.sin(an + 0.35) * 18, 0.8, INK); }
      fan += C(65, -67, 5, "rgba(255,255,255,0.85)", INK) + R(42, -90, 46, 46, "none", "rgba(26,25,23,0.35)");
      o.push(G(mTop(70), fan));
      [[-88, -88], [48, -88], [48, 88], [-88, 88]].forEach((c) => cyl(c[0], c[1], 56, 3.2, 22, POST, CAP));
      if (lift > 0.5) o.push(G(mTop(66), '<circle cx="-10" cy="0" r="150" fill="url(#pf_glow)"/>', cl(lift / 34) * 0.85));
      const z0 = 78 + lift, zt = z0 + 6;
      ext(z0, 6, "M-100 -100 H140 V-40 H60 V100 H-100 Z M-80 30 H-35 V75 H-80 Z M19 -45 A24 24 0 1 0 -29 -45 A24 24 0 1 0 19 -45 Z M75 -90 H130 V-80 H75 Z M75 -62 H130 V-52 H75 Z", "#0A0A0B", "url(#pf_dk)", "rgba(244,243,240,0.55)");
      o.push(G(mTop(zt), Pa("M-93 -93 H133 V-47 H53 V93 H-93 Z", "none", "rgba(244,243,240,0.22)", 1) + [[-88, -88], [-88, 88], [48, 88], [48, -88], [-5, 0]].map((c) => C(c[0], c[1], 2.6, "rgba(255,255,255,0.75)")).join("")));
      cyl(-5, -45, zt - 8, 22, 10, "#101012", "url(#pf_pg)");
      ext(z0, 6, "M140 -100 H190 V-60 H140 V-72 H178 V-88 H140 Z", "#0A0A0B", "url(#pf_pg)", INK);
      const e1 = [P(-100, 100, 0), P(100, 100, 0), P(100, -100, 0)].map(pt).join(" ");
      const e2 = [P(-100, 100, zt), P(60, 100, zt), P(60, -40, zt), P(140, -40, zt), P(140, -100, zt)].map(pt).join(" ");
      o.push('<polyline points="' + e1 + '" fill="none" stroke="url(#pf_sg)" stroke-width="2.4"/><polyline points="' + e2 + '" fill="none" stroke="url(#pf_sg)" stroke-width="2"/>');
    };
    if (eo) { stack(0, 0); return '<svg viewBox="0 0 600 420" width="600" height="420" style="position:absolute; inset:0; overflow:visible">' + o.join("") + "</svg>"; }

    // ---- timeline
    const on = s >= 0;
    const lift = on ? 34 * sm(0.35, 1.25, s) + 2.2 * Math.sin(g * 1.1) * sm(1.25, 2.4, s) : 0;
    const rot = on ? Math.max(0, s - 1.2) * 0.5 : 0;
    const glow = on ? sm(0, 0.9, s) : 0, tangle = on ? 1 - sm(0.15, 0.85, s) : 1;
    const gH = on ? sm(0.8, 1.5, s) : 0, bnd = on ? sm(1.3, 1.8, s) : 0;
    // outputs start once the inputs are wired, and run at the same pace as the inputs
    const WT = 2.9;
    // gates mirror each other about the platform
    const GL = [-162.2, 119.1, 64, 5], GR = [169.2, -212.2, 5, 64], hh = 130 * gH, gOp = cl(gH * 1.5);
    const PZ = (k) => 34 + 18 * k;
    const pinL = (k) => P(GL[0] + 10, GL[1] + GL[3], 34 + 24 * k);
    const pinR = (k) => P(GR[0] + GR[2], GR[1] + 10, PZ(k));
    const plR = (X, Y) => "matrix(" + f(a) + "," + f(-b) + ",0," + f(S) + "," + f(X) + "," + f(Y) + ")";
    const spR = (X, Y, u, v) => [X + u * a, Y - u * b + v * S];
    const DY = cy - 570;
    // sources: X, Y (top-left of the sheet), w, h, kind, wire exit on the right edge, gate pin, bob phase
    const DOCS = [
      [228.6, 318, 66, 70, "mail", 35, 3, 0.0, "Emails"],
      [228.6, 416.7, 66, 70, "drive", 35, 2, 1.9, "Shared Drives"],
      [228.6, 515.3, 66, 70, "sheet", 35, 1, 3.4, "Spreadsheets"],
      [228.6, 614, 66, 70, "tool", 35, 0, 4.6, "Siloed Tools"]
    ];
    const dpos = DOCS.map((d) => [d[0], d[1] + DY]);
    const exits = DOCS.map((d, i) => sp(dpos[i][0], dpos[i][1], d[2], d[5]));
    // stations: one orderly column on the far side, facing the other way
    const TW = 66, TH = 70, R0 = this.rows();
    const tiles = R0.map((r, i) => {
      const X = 1000, Y = 347.7 + DY + 74 * i, ring = spR(X, Y, 3, 31.5), pin = pinR(4 - i), dx = ring[0] - pin[0];
      return { X: X, Y: Y, ring: ring, pin: pin, W: [pin, [pin[0] + dx * 0.5, pin[1]], [ring[0] - dx * 0.5, ring[1]], ring] };
    });

    // ---- light under the platform
    if (glow > 0.01) {
      o.push('<ellipse cx="' + f(cx + 40) + '" cy="' + f(cy - 100) + '" rx="440" ry="300" fill="url(#pf_halo)" opacity="' + f(glow) + '"/>');
      o.push(G(mTop(0), '<circle cx="0" cy="0" r="250" fill="url(#pf_glow)"/>', glow * 0.6));
    }
    // ---- landing pad, waiting for the platform
    const pad = on ? 1 - sm(0, 0.5, s) : 0.3 + 0.6 * p;
    if (pad > 0.01) {
      let q = Pa("M-100 -100 H100 V100 H-100 Z", "none", "rgba(244,243,240,0.45)", 1, ' stroke-dasharray="4 5"');
      [[-100, -100, 1, 1], [100, -100, -1, 1], [100, 100, -1, -1], [-100, 100, 1, -1]].forEach((c) => { q += Pa("M" + (c[0] + c[2] * 18) + " " + c[1] + " H" + c[0] + " V" + (c[1] + c[3] * 18), "none", "rgba(244,243,240,0.85)", 1.2); });
      o.push(G(mTop(0), q, pad));
    }
    // ---- before: direct, criss-crossing handoffs from sources to stations
    if (tangle > 0.01) {
      [[0, 3, -110, 90], [1, 0, 120, -80], [2, 4, -90, 120], [3, 1, 130, -110], [0, 2, -140, 70]].forEach((tg) => {
        const E = exits[tg[0]], Tq = tiles[tg[1]].ring, dx = Tq[0] - E[0];
        o.push('<path d="M' + pt(E) + " C" + f(E[0] + dx * 0.4) + "," + f(E[1] + tg[2]) + " " + f(Tq[0] - dx * 0.4) + "," + f(Tq[1] + tg[3]) + " " + pt(Tq) + '" fill="none" stroke="rgba(244,243,240,0.42)" stroke-width="1" stroke-dasharray="2 5" stroke-dashoffset="' + f(-g * 14) + '" opacity="' + f(tangle) + '"/>');
      });
    }
    // ---- sources
    const docInner = (k, w, h) => {
      const L = "rgba(244,243,240,0.32)", Lh = "rgba(244,243,240,0.62)";
      let q = "";
      if (k === "mail") {
        q += R(4, 4, w - 8, 11, "rgba(255,255,255,0.07)", "none") + R(7, 6.5, 9, 6, "none", Lh, 0.7) + Pa("M7 6.5 L11.5 10 L16 6.5", "none", Lh, 0.7) + Ln(20, 9.5, w - 9, 9.5, 1.2, L);
        q += Ln(6, 23, w * 0.66, 23, 2.2, Lh);
        for (let r = 0, y = 31; y < h - 18; r++, y += 7) q += Ln(6, y, w - 6 - (r % 3) * 7, y, 0.9, L);
        q += R(6, h - 13, 20, 8, "rgba(243,201,168,0.3)", Lh, 0.6, 2);
      } else if (k === "sheet") {
        const cw = (w - 8) / 4, rows = Math.floor((h - 17) / 8);
        q += R(4, 4, w - 8, 9, "rgba(255,255,255,0.14)", "none");
        for (let r = 0; r <= rows; r++) q += Ln(4, 13 + r * 8, w - 4, 13 + r * 8, 0.7, L);
        for (let c = 0; c <= 4; c++) q += Ln(4 + c * cw, 4, 4 + c * cw, 13 + rows * 8, 0.7, L);
        q += G("", R(4 + 2 * cw, 37, cw, 8, "url(#pf_pg)", "none"), 0.7);
      } else if (k === "drive") {
        q += Pa("M6 7 H11 L13 9 H21 V17 H6 Z", "rgba(255,255,255,0.1)", Lh, 0.8) + Ln(26, 12, w - 8, 12, 1.8, Lh);
        for (let r = 0, y = 26; y < h - 10; r++, y += 11) q += R(6, y, 6, 8, "none", L, 0.7) + Ln(16, y + 4, w - 8 - (r % 3) * 8, y + 4, 0.9, L);
      } else {
        q += R(0, 0, w, 9, "rgba(10,10,12,0.5)", "none", 0.8, 2) + C(5, 4.5, 1.3, Lh) + C(10, 4.5, 1.3, Lh) + C(15, 4.5, 1.3, Lh);
        q += R(4, 13, 14, h - 17, "rgba(255,255,255,0.05)", L, 0.6);
        for (let r = 0; r < 4; r++) q += Ln(7, 19 + r * 7, 15, 19 + r * 7, 1, L);
        const bw = (w - 30) / 6;
        [0.45, 0.7, 0.55, 0.92, 0.62, 0.8].forEach((v, i) => { const bh = (h - 34) * v; q += R(23 + i * bw, h - 6 - bh, bw * 0.62, bh, i === 3 ? "url(#pf_pg)" : "rgba(255,255,255,0.16)", "none"); });
        if (w > 80) q += C(w - 17, 22, 8, "none", L, 0.9) + Pa("M" + (w - 17) + " 14 A8 8 0 0 1 " + (w - 9.4) + " 24.5", "none", "#F3C9A8", 1.4);
      }
      return q;
    };
    DOCS.forEach((d, i) => {
      const X = dpos[i][0], Y = dpos[i][1], w = d[2], h = d[3];
      o.push(G(pl(X + 3.1, Y - 1.8), R(0, 0, w, h, "rgba(255,255,255,0.025)", "rgba(255,255,255,0.2)", 0.8, 2)));
      o.push(G(pl(X, Y), R(0, 0, w, h, "url(#pf_gc)", "rgba(255,255,255,0.58)", 0.8, 3) + R(3.5, 3.5, w - 7, h - 7, "none", "rgba(255,255,255,0.1)", 0.8, 2) + docInner(d[4], w, h)));
      const lp = sp(X, Y, 0, h / 2);
      text(lp[0] - 14, lp[1] + 4, d[8], 1, 12, "#F4F3F0", false, "end");
    });
    // ---- intake gate, and the short bundles either side of the platform
    if (gH > 0.01) {
      box(GL[0], GL[1], 0, GL[2], GL[3], hh, { top: "rgba(255,255,255,0.28)", l: "url(#pf_gl)", r: "rgba(255,255,255,0.18)", st: "rgba(255,255,255,0.62)" }, gOp);
      o.push(G(mY(GL[1] + GL[3]), R(GL[0] + 3, 3, GL[2] - 6, hh - 6, "none", "rgba(255,255,255,0.14)"), gOp));
    }
    const LBx = cx - 169.3, RBx0 = cx + 143, RBx1 = cx + 247.3, LB = [cy - 44, cy - 36, cy - 28], RB = [cy - 44, cy - 36, cy - 28];
    if (bnd > 0.01) {
      LB.forEach((y, m) => {
        o.push(Ln(LBx, y, LBx + 36 * bnd, y, 1, "rgba(244,243,240,0.6)"));
        if (s > 2) { const tt = ((s - 2) * 1.1 + m * 0.37) % 1; bead(LBx + 36 * tt, y, sm(0, 0.15, tt) * (1 - sm(0.55, 1, tt)), "#F3C9A8", 4.5); }
      });
      RB.forEach((y) => o.push(Ln(RBx0, y, RBx0 + (RBx1 - RBx0) * bnd, y, 1, "rgba(244,243,240,0.6)")));
    }
    // ---- wires from every source into the gate
    const WC = ["#F3C9A8", "#E9E4CF", "#D9C3E8", "#EADFB8", "#F6D2C6"], pinGlow = [];
    DOCS.forEach((d, i) => {
      const E = exits[i], Tp = pinL(d[6]), dx = Tp[0] - E[0], W = [E, [E[0] + dx * 0.5, E[1]], [Tp[0] - dx * 0.5, Tp[1]], Tp];
      const t0 = 1.5 + 0.15 * i, u = on ? sm(t0, t0 + 0.9, s) : 0, col = WC[i], fl = 0.28 + 0.72 * u;
      o.push('<circle cx="' + f(E[0]) + '" cy="' + f(E[1]) + '" r="13" fill="url(#pf_fl)" opacity="' + f(fl * 0.85) + '"/>');
      if (u > 0.001) {
        const dd = "M" + pt(E) + " C" + pt(W[1]) + " " + pt(W[2]) + " " + pt(Tp), dash = ' pathLength="1" stroke-dasharray="1" stroke-dashoffset="' + f(1 - u) + '"';
        o.push('<path d="' + dd + '" fill="none" stroke="' + col + '" stroke-width="3" opacity="0.1"' + dash + "/>" + '<path d="' + dd + '" fill="none" stroke="' + col + '" stroke-width="1" opacity="0.78"' + dash + "/>");
        if (u < 0.999) { const q = bz(W, u); bead(q[0], q[1], 1, col); }
      }
      o.push(Ln(E[0] - 9 * fl, E[1], E[0] + 9 * fl, E[1], 0.6, "rgba(255,255,255," + f(0.55 * fl) + ")") + Ln(E[0], E[1] - 5 * fl, E[0], E[1] + 5 * fl, 0.6, "rgba(255,255,255," + f(0.45 * fl) + ")") + C(E[0], E[1], 1.6, "#FFFFFF"));
      const tb = s - (t0 + 0.9);
      if (on && tb > 0) {
        const tt = (tb * (0.32 + (i % 2) * 0.06)) % 1, q = bz(W, tt);
        bead(q[0], q[1], sm(0, 0.06, tt) * (1 - sm(0.94, 1, tt)), col);
        if (tt > 0.88) pinGlow[d[6]] = Math.max(pinGlow[d[6]] || 0, (tt - 0.88) / 0.12);
      }
    });
    for (let k = 0; k < 4; k++) {
      if (gH < 0.01 || 34 + 24 * k > hh - 5) continue;
      const q = pinL(k), gl = pinGlow[k] || 0;
      o.push('<circle cx="' + f(q[0]) + '" cy="' + f(q[1]) + '" r="' + f(4.5 + 3.5 * gl) + '" fill="#FFFFFF" opacity="' + f((0.1 + 0.3 * gl) * gOp) + '"/>' + G("", C(q[0], q[1], 2.3, "#F4F3F0"), gOp));
    }
    // ---- the platform
    if (on) stack(lift, rot);
    // releases leave the platform at the same pace the inputs go in
    if (on && bnd > 0.5 && s > 2) RB.forEach((y, m) => { const tt = ((s - 2) * 0.38 + m * 0.37) % 1; bead(RBx0 + (RBx1 - RBx0) * tt, y, sm(0.12, 0.3, tt) * (1 - sm(0.8, 1, tt)), "#F3C9A8", 4.5); });
    // ---- release gate
    if (gH > 0.01) {
      box(GR[0], GR[1], 0, GR[2], GR[3], hh, { top: "rgba(255,255,255,0.28)", l: "rgba(255,255,255,0.18)", r: "url(#pf_gr)", st: "rgba(255,255,255,0.62)" }, gOp);
      o.push(G(mX(GR[0] + GR[2]), R(GR[1] + 3, 3, GR[3] - 6, hh - 6, "none", "rgba(255,255,255,0.14)"), gOp));
    }
    // ---- one line out: wires draw and carry one dot each, mirroring the inputs
    const acts = [], pulses = [], flash = [], ttR = [];
    tiles.forEach((t, i) => {
      const t0 = WT + 0.15 * i, u = on ? sm(t0, t0 + 0.9, s) : 0, tb = s - (t0 + 0.9), spd = 0.32 + (i % 2) * 0.06;
      const tt = tb > 0 ? (tb * spd) % 1 : -1, since = tb > 0 ? tt / spd : 99;
      ttR[i] = u > 0.001 && u < 0.999 ? u : tt;
      acts[i] = tb > 0 ? sm(0, 0.3, tb) : 0;
      pulses[i] = tb > 0 ? Math.exp(-since / 0.45) : 0;
      flash[4 - i] = tb > 0 ? Math.exp(-since / 0.25) : 0;
      if (u > 0.001) {
        const dd = "M" + pt(t.W[0]) + " C" + pt(t.W[1]) + " " + pt(t.W[2]) + " " + pt(t.W[3]), dash = ' pathLength="1" stroke-dasharray="1" stroke-dashoffset="' + f(1 - u) + '"';
        o.push('<path d="' + dd + '" fill="none" stroke="#F1D9C4" stroke-width="3" opacity="0.1"' + dash + '/><path d="' + dd + '" fill="none" stroke="#F1D9C4" stroke-width="1" opacity="0.8"' + dash + "/>");
      }
    });
    for (let k = 0; k < 5; k++) {
      if (gH < 0.01 || PZ(k) > hh - 5) continue;
      const q = pinR(k), fk = flash[k] || 0;
      o.push('<circle cx="' + f(q[0]) + '" cy="' + f(q[1]) + '" r="' + f(4.5 + 3.5 * fk) + '" fill="#FFFFFF" opacity="' + f((0.1 + 0.3 * fk) * gOp) + '"/>' + G("", C(q[0], q[1], 2.3, "#F4F3F0"), gOp));
    }
    const ICON = [
      "M-13 1 L-9 -10 H9 L13 1 V11 H-13 Z M-13 1 H-5 L-3 5 H3 L5 1 H13",
      "M-12 -11 H12 V11 H-12 Z M-12 -4 H12 M-12 3 H12 M-4 -11 V11 M4 -11 V11",
      "M12 0 A12 12 0 1 1 -12 0 A12 12 0 1 1 12 0 Z M-5.5 0 L-1.5 4 L6 -4",
      "M0 -13 L11 -9 V-1 C11 6 6 10 0 13 C-6 10 -11 6 -11 -1 V-9 Z M-5 0 L-1 4 L6 -4",
      "M-13 -9 H-4 L-1 -5 H13 V10 H-13 Z M-13 -2 H13"
    ];
    tiles.forEach((t, i) => {
      const act = acts[i], pu = pulses[i], r = R0[i];
      if (pu > 0.01) { const m = spR(t.X, t.Y, TW / 2, TH / 2); o.push('<ellipse cx="' + f(m[0]) + '" cy="' + f(m[1]) + '" rx="46" ry="52" fill="url(#pf_fl)" opacity="' + f(0.3 * pu) + '"/>'); }
      o.push(G(plR(t.X - 3.1, t.Y - 1.8), R(0, 0, TW, TH, "rgba(255,255,255,0.025)", "rgba(255,255,255," + f(0.16 + 0.1 * act) + ")", 0.8, 3)));
      let q = R(0, 0, TW, TH, "url(#pf_cd)", "rgba(255,255,255," + f(0.36 + 0.28 * act + 0.3 * pu) + ")", 0.9, 3) + R(3.5, 3.5, TW - 7, TH - 7, "none", "rgba(255,255,255,0.1)", 0.8, 2);
      if (pu > 0.01) q += G("", R(0, 0, TW, TH, "url(#pf_pg)", "none", 0.8, 3), 0.18 * pu);
      const ic = '<path d="' + ICON[i] + '" fill="none" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"' + NS + ' transform="translate(33 30)"';
      if (act < 0.99) q += ic + ' stroke="rgba(244,243,240,0.42)" opacity="' + f(1 - act) + '"/>';
      if (act > 0.01) q += ic + ' stroke="url(#pf_ic)" opacity="' + f(act) + '"/>';
      const hr = act > 0.5 ? (r.bh ? Math.round(r.bh * 60) + " min" : "auto") : r.ah.toFixed(1) + " h";
      q += '<text x="33" y="60" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9" letter-spacing="0.5" fill="' + (act > 0.5 ? "#F3D9C4" : "rgba(244,243,240,0.6)") + '">' + hr + "</text>";
      o.push(G(plR(t.X, t.Y), q, 0.62 + 0.38 * act));
      o.push(C(t.ring[0], t.ring[1], 2.6, "#0A0A0A", "rgba(244,243,240," + f(0.5 + 0.4 * act) + ")", 1));
      const lp = spR(t.X, t.Y, TW, TH / 2);
      text(lp[0] + 14, lp[1] + 4, r.s, 0.66 + 0.34 * act, 12, "#F4F3F0", false, "start");
      const tr = ttR[i];
      if (tr >= 0 && tr < 1) { const q2 = bz(t.W, tr); bead(q2[0], q2[1], acts[i] <= 0 ? 1 : sm(0, 0.06, tr) * (1 - sm(0.94, 1, tr)), "#F3C9A8"); }
    });
    return '<svg viewBox="0 0 1280 900" width="1280" height="900" style="position:absolute; inset:0">' + o.join("") + late.join("") + "</svg>";
  }
  // ---------- 05 Outcome: the platform from 04 as the centrepiece, outcomes flowing down from it ----------
  scene05(s) {
    const S = 0.9, cx = 640, cy = 390, a = 0.866 * S, b = 0.5 * S;
    const f = (n) => (Math.round(n * 100) / 100).toString();
    const o = [], late = [];
    const INK = "rgba(244,243,240,0.74)", NS = ' vector-effect="non-scaling-stroke"';
    const P = (x, y, z) => [cx + (x - y) * a, cy + (x + y) * b - z * S];
    const mTop = (z) => "matrix(" + f(a) + "," + f(b) + "," + f(-a) + "," + f(b) + "," + f(cx) + "," + f(cy - z * S) + ")";
    const mY = (y0) => "matrix(" + f(a) + "," + f(b) + ",0," + f(-S) + "," + f(cx - a * y0) + "," + f(cy + b * y0) + ")";
    const mX = (x0) => "matrix(" + f(-a) + "," + f(b) + ",0," + f(-S) + "," + f(cx + a * x0) + "," + f(cy + b * x0) + ")";
    const G = (tr, inner, op, extra) => "<g" + (tr ? ' transform="' + tr + '"' : "") + (op != null && op < 0.999 ? ' opacity="' + f(Math.max(0, op)) + '"' : "") + (extra || "") + ">" + inner + "</g>";
    const R = (x, y, w, hh, fill, st, sw, rx) => '<rect x="' + f(x) + '" y="' + f(y) + '" width="' + f(w) + '" height="' + f(hh) + '"' + (rx ? ' rx="' + rx + '"' : "") + ' fill="' + (fill || "none") + '" stroke="' + (st || "none") + '" stroke-width="' + (sw || 0.8) + '"' + NS + "/>";
    const C = (x, y, r, fill, st, sw) => '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(r) + '" fill="' + (fill || "none") + '" stroke="' + (st || "none") + '" stroke-width="' + (sw || 0.8) + '"' + NS + "/>";
    const Ln = (x1, y1, x2, y2, sw, col) => '<line x1="' + f(x1) + '" y1="' + f(y1) + '" x2="' + f(x2) + '" y2="' + f(y2) + '" stroke="' + (col || INK) + '" stroke-width="' + (sw || 1) + '"' + NS + "/>";
    const Pa = (d, fill, st, sw, extra) => '<path d="' + d + '" fill="' + (fill || "none") + '" stroke="' + (st || "none") + '" stroke-width="' + (sw || 0.8) + '" stroke-linejoin="round" stroke-linecap="round"' + NS + (extra || "") + "/>";
    const WH = { top: "url(#pe_gt)", l: "rgba(255,255,255,0.07)", r: "rgba(255,255,255,0.14)" };
    const DK = { top: "url(#pe_dk)", l: "rgba(22,23,26,0.82)", r: "rgba(36,37,42,0.82)", st: "rgba(244,243,240,0.42)" };
    const box = (x, y, z, w, d, hh, c, op) => {
      if (op != null && op < 0.01) return;
      c = c || WH;
      const st = c.st || INK;
      o.push(G("", G(mY(y + d), R(x, z, w, hh, c.l, st)) + G(mX(x + w), R(y, z, d, hh, c.r, st)) + G(mTop(z + hh), R(x, y, w, d, c.top, st)), op));
    };
    const cyl = (x, y, z, r, hh, side, top, op) => {
      const B = P(x, y, z), Tt = P(x, y, z + hh), rx = 1.2247 * r * S, ry = 0.7071 * r * S;
      o.push(G("", '<path d="M' + f(B[0] - rx) + " " + f(Tt[1]) + " L" + f(B[0] - rx) + " " + f(B[1]) + " A" + f(rx) + " " + f(ry) + " 0 0 0 " + f(B[0] + rx) + " " + f(B[1]) + " L" + f(B[0] + rx) + " " + f(Tt[1]) + ' Z" fill="' + side + '" stroke="' + INK + '" stroke-width="0.8"/>' + G(mTop(z + hh), C(x, y, r, top, INK)), op));
    };
    const wire = (pts, u, op) => {
      if (u <= 0.001 || op <= 0.001) return;
      const s = pts.map((p) => { const q = P(p[0], p[1], p[2] || 0); return f(q[0]) + "," + f(q[1]); }).join(" ");
      o.push('<polyline points="' + s + '" fill="none" stroke="rgba(244,243,240,0.72)" stroke-width="1" pathLength="1" stroke-dasharray="1" stroke-dashoffset="' + f(1 - u) + '" opacity="' + f(op) + '"/>');
      const pin = (p) => { const q = P(p[0], p[1], p[2] || 0); o.push('<circle cx="' + f(q[0]) + '" cy="' + f(q[1]) + '" r="2.8" fill="#0A0A0A" stroke="rgba(244,243,240,0.85)" stroke-width="1" opacity="' + f(op) + '"/>'); };
      if (u > 0.02) pin(pts[0]);
      if (u > 0.98) pin(pts[pts.length - 1]);
    };
    const label = (x, y, str, op, sz, col, anchor, mono) => late.push('<text x="' + f(x) + '" y="' + f(y) + '" fill="' + (col || "#F4F3F0") + '" font-family="' + (mono ? "IBM Plex Mono, monospace" : "Instrument Sans, Helvetica Neue, Helvetica, sans-serif") + '" font-size="' + (sz || 14) + '" font-weight="500" letter-spacing="' + (mono ? "0.6" : "-0.1") + '" text-anchor="' + (anchor || "middle") + '" opacity="' + f(op) + '">' + str + "</text>");

    o.push('<defs>' +
      '<linearGradient id="pe_pg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A8C8E8"/><stop offset="0.3" stop-color="#E9E4CF"/><stop offset="0.55" stop-color="#F3C9A8"/><stop offset="0.8" stop-color="#D9C3E8"/><stop offset="1" stop-color="#AEC9DE"/></linearGradient>' +
      '<linearGradient id="pe_gt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.36"/><stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.12"/><stop offset="1" stop-color="#E6EEF6" stop-opacity="0.22"/></linearGradient>' +
      '<linearGradient id="pe_gc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.3"/><stop offset="0.45" stop-color="#FFFFFF" stop-opacity="0.1"/><stop offset="1" stop-color="#F3E6DC" stop-opacity="0.16"/></linearGradient>' +
      '<linearGradient id="pe_dk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2E3036" stop-opacity="0.9"/><stop offset="1" stop-color="#0C0C0E" stop-opacity="0.88"/></linearGradient>' +
      '<radialGradient id="pe_glow"><stop offset="0" stop-color="#F3C9A8" stop-opacity="0.5"/><stop offset="0.4" stop-color="#D9C3E8" stop-opacity="0.22"/><stop offset="1" stop-color="#AEC9DE" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="pe_glow2"><stop offset="0" stop-color="#A8C8E8" stop-opacity="0.38"/><stop offset="1" stop-color="#A8C8E8" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="pe_gp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.14"/><stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.04"/><stop offset="1" stop-color="#E6EEF6" stop-opacity="0.09"/></linearGradient>' +
      '<linearGradient id="pe_lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0.42"/></linearGradient>' +
      '<linearGradient id="pe_lgf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0.06"/></linearGradient>' +
      '<clipPath id="pe_pc"><rect x="-80" y="-170" width="1000" height="340"/></clipPath>' +
      '</defs>');



    o.push('<defs><linearGradient id="pe_cg" gradientUnits="userSpaceOnUse" x1="0" y1="390" x2="0" y2="660"><stop offset="0" stop-color="#F9E7D6"/><stop offset="0.5" stop-color="#D9C3E8"/><stop offset="1" stop-color="#A8C8E8"/></linearGradient>' +
      '<linearGradient id="pe_edge" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A8C8E8"/><stop offset="0.5" stop-color="#D9C3E8"/><stop offset="1" stop-color="#F3C9A8"/></linearGradient></defs>');
    const drop = this.sm(0, 1.3, s), eOn = this.sm(1.2, 2.0, s);
    const wrap = (i0, op, tr) => { const seg = o.splice(i0).join(""); if (op > 0.01) o.push('<g' + (tr ? ' transform="' + tr + '"' : "") + (op < 0.999 ? ' opacity="' + f(op) + '"' : "") + ">" + seg + "</g>"); };

    // glow pooled under the platform
    o.push('<ellipse cx="640" cy="412" rx="' + f(250 + 40 * eOn) + '" ry="' + f(118 + 18 * eOn) + '" fill="url(#pe_glow)" opacity="' + f(drop * (0.35 + 0.5 * eOn)) + '"/>');

    // ---- the platform: the closed stack from 04, arriving from above
    const i0 = o.length, B = 30, EZ = [0, 20, 40, 60].map((z) => B + z);
    const CN = [[-78, -78], [78, -78], [78, 78], [-78, 78]];
    box(-90, -90, EZ[0], 180, 180, 8, DK);
    let bd = ""; CN.forEach((c) => { bd += C(c[0], c[1], 3, "#0A0A0A", "rgba(244,243,240,0.6)"); });
    for (let k = 0; k < 6; k++) bd += Ln(-60, -50 + k * 16, k % 2 ? 10 : 40, -50 + k * 16, 1, "rgba(233,228,207,0.28)");
    o.push(G(mTop(EZ[0] + 8), bd));
    for (let k = 1; k < 4; k++) {
      const z0 = EZ[k - 1] + (k === 1 ? 8 : 6), hh = EZ[k] - z0;
      CN.forEach((p) => cyl(p[0], p[1], z0, 3.2, hh, "rgba(255,255,255,0.2)", "rgba(255,255,255,0.6)"));
      box(-90, -90, EZ[k], 180, 180, 6, k === 3 ? { top: "url(#pe_dk)", l: "#0A0A0B", r: "#121214", st: "rgba(244,243,240," + f(0.5 + 0.35 * eOn) + ")" } : WH);
      if (k === 2) o.push(G(mTop(EZ[k] + 6), R(-70, -70, 60, 50, "rgba(10,10,12,0.5)", INK) + R(20, 40, 56, 30, "rgba(255,255,255,0.12)", INK, 0.8, 2)));
    }
    const zt = EZ[3] + 6;
    box(90, 20, EZ[3], 30, 50, 6, { top: "url(#pe_pg)", l: "#0A0A0B", r: "#121214", st: INK });
    o.push(G(mTop(zt), R(-82, -82, 164, 164, "none", "rgba(244,243,240,0.22)") + C(-30, -20, 34, "rgba(0,0,0,0.55)", "rgba(244,243,240,0.4)") + R(-76, 22, 44, 34, "rgba(255,255,255,0.1)", INK, 0.8, 2) + R(40, -76, 36, 12, "rgba(255,255,255,0.16)", INK, 0.8, 2) + R(26, 60, 50, 8, "url(#pe_pg)", INK, 0.8, 2) + CN.map((c) => C(c[0], c[1], 2.6, "rgba(255,255,255,0.75)")).join("")));
    cyl(34, -30, zt, 22, 8, "#101012", "url(#pe_pg)");
    wrap(i0, drop, "translate(0," + f(-(1 - drop) * 180) + ")");
    if (drop > 0.5) {
      const lq = P(-90, 90, zt);
      o.push('<line x1="' + f(lq[0] - 110) + '" y1="' + f(lq[1]) + '" x2="' + f(lq[0] - 6) + '" y2="' + f(lq[1]) + '" stroke="rgba(244,243,240,0.5)" stroke-width="1" stroke-dasharray="2 3" opacity="' + f(eOn) + '"/><circle cx="' + f(lq[0] - 110) + '" cy="' + f(lq[1]) + '" r="2.6" fill="#0A0A0A" stroke="rgba(244,243,240,0.8)" opacity="' + f(eOn) + '"/>');
      label(lq[0] - 122, lq[1] + 5, "The platform", eOn, 14, "#F4F3F0", "end");
    }

    // ---- outcomes: three plates below, fed by glass ducts that run out of the platform and drop into each plate
    const PL = [[94, 595], [400, 400], [595, 94]];
    const rnd = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
    o.push('<defs><radialGradient id="pe_fl2"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.95"/><stop offset="0.3" stop-color="#F9E7D6" stop-opacity="0.38"/><stop offset="1" stop-color="#F3C9A8" stop-opacity="0"/></radialGradient></defs>');
    // centreline in screen space: a run out along the iso axis, a rounded elbow, then a straight drop onto the plate
    const duct = (A, C, dir) => {
      const pts = [];
      if (!dir) { for (let k = 0; k <= 24; k++) pts.push([A[0], A[1] + (C[1] + 6 - A[1]) * k / 24]); return pts; }
      const K = [C[0], A[1] + Math.abs(C[0] - A[0]) * (dir[1] / Math.abs(dir[0]))], Tt = 30 * 0.577;
      const S0 = [K[0] - dir[0] * Tt, K[1] - dir[1] * Tt], E0 = [K[0], K[1] + Tt];
      for (let k = 0; k <= 30; k++) pts.push([A[0] + (S0[0] - A[0]) * k / 30, A[1] + (S0[1] - A[1]) * k / 30]);
      for (let k = 1; k <= 12; k++) { const t = k / 12, u = 1 - t; pts.push([u * u * S0[0] + 2 * u * t * K[0] + t * t * E0[0], u * u * S0[1] + 2 * u * t * K[1] + t * t * E0[1]]); }
      for (let k = 1; k <= 10; k++) pts.push([C[0], E0[1] + (C[1] + 6 - E0[1]) * k / 10]);
      return pts;
    };
    const TUN = [[P(40, 90, 34), P(94, 495, 8), [-0.866, 0.5]], [P(90, 90, 30), P(300, 300, 8), null], [P(90, 40, 34), P(495, 94, 8), [0.866, 0.5]]];
    TUN.forEach((tn, i) => {
      const t0 = 2.0 + i * 0.18, u = this.sm(t0, t0 + 1.1, s);
      if (u <= 0.001) return;
      const pts = duct(tn[0], tn[1], tn[2]), L = [0];
      for (let k = 1; k < pts.length; k++) L.push(L[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
      const TL = L[L.length - 1], HW = 13;
      const at = (d) => { let k = 1; while (k < L.length - 1 && L[k] < d) k++; const seg = L[k] - L[k - 1] || 1, w = Math.min(1, Math.max(0, (d - L[k - 1]) / seg)), q0 = pts[k - 1], q1 = pts[k]; return [q0[0] + (q1[0] - q0[0]) * w, q0[1] + (q1[1] - q0[1]) * w, (q1[0] - q0[0]) / seg, (q1[1] - q0[1]) / seg]; };
      const vis = [];
      for (let k = 0; k < pts.length && L[k] < u * TL; k++) vis.push(at(Math.max(0.01, L[k])));
      vis.push(at(u * TL));
      const line = (d) => vis.map((q) => f(q[0] - q[3] * d) + "," + f(q[1] + q[2] * d)).join(" ");
      const band = (d0, d1) => line(d0) + " " + vis.slice().reverse().map((q) => f(q[0] - q[3] * d1) + "," + f(q[1] + q[2] * d1)).join(" ");
      // the glass duct: soft halo, clear body, a lighter top face, fine edges
      o.push('<polyline points="' + line(0) + '" fill="none" stroke="rgba(255,255,255,0.028)" stroke-width="' + (HW * 2 + 12) + '" stroke-linejoin="round" stroke-linecap="round"/>');
      o.push('<polygon points="' + band(-HW, HW) + '" fill="rgba(255,255,255,0.045)"/>');
      o.push('<polygon points="' + band(-HW, -HW * 0.25) + '" fill="rgba(255,255,255,0.04)"/>');
      o.push('<polyline points="' + line(-HW) + '" fill="none" stroke="rgba(255,255,255,0.42)" stroke-width="0.9" stroke-linejoin="round"/><polyline points="' + line(HW) + '" fill="none" stroke="rgba(255,255,255,0.34)" stroke-width="0.9" stroke-linejoin="round"/>');
      o.push('<polyline points="' + line(-HW * 0.25) + '" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.8" stroke-linejoin="round"/>');
      // electrons: many sizes, each at its own pace, drifting across the duct
      const op0 = this.sm(0.85, 1, u), tt = s - t0;
      if (op0 > 0.01) for (let k = 0; k < 48; k++) {
        const r1 = rnd(i * 97 + k), r2 = rnd(i * 97 + k + 0.37), r3 = rnd(i * 97 + k + 0.71), r4 = rnd(i * 97 + k + 1.13);
        const rad = 0.6 + r2 * r2 * r2 * 2.6, base = (26 + r3 * 46) / TL, amp = (6 + r4 * 22) / TL, w1 = 0.45 + r1 * 1.2;
        const pp = ((r1 + base * tt + amp * Math.sin(w1 * tt + r2 * 6.283)) % 1 + 1) % 1;
        const q = at(pp * TL), lat = (r4 * 2 - 1) * HW * 0.62 + Math.sin(tt * (0.7 + r3) + r1 * 9) * 1.8;
        const x = q[0] - q[3] * lat, y = q[1] + q[2] * lat;
        const op = op0 * this.sm(0, 0.05, pp) * (1 - this.sm(0.93, 1, pp)) * (0.6 + 0.4 * Math.sin(tt * (1.8 + r2 * 3) + r4 * 7));
        if (op < 0.02) continue;
        if (rad > 1.7) o.push('<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(rad * 3.2) + '" fill="#F3C9A8" opacity="' + f(op * 0.15) + '"/>');
        o.push('<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(rad) + '" fill="' + (rad > 1.5 ? "#FBF1E6" : "#E9E4CF") + '" opacity="' + f(op * (rad > 1.5 ? 1 : 0.72)) + '"/>');
      }
      // light where the duct leaves the platform, a chevron where it lands
      const A = tn[0], C = tn[1], gl = 0.8 + 0.2 * Math.sin(s * 2 + i);
      o.push('<circle cx="' + f(A[0]) + '" cy="' + f(A[1]) + '" r="16" fill="url(#pe_fl2)" opacity="' + f(gl * this.sm(0, 0.3, u)) + '"/><circle cx="' + f(A[0]) + '" cy="' + f(A[1]) + '" r="2.4" fill="#FFFFFF" opacity="' + f(this.sm(0, 0.3, u)) + '"/>');
      if (op0 > 0.01) o.push('<path d="M' + f(C[0] - 5) + " " + f(C[1] - 17) + " L" + f(C[0]) + " " + f(C[1] - 12) + " L" + f(C[0] + 5) + " " + f(C[1] - 17) + '" fill="none" stroke="#F4F3F0" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" opacity="' + f(op0 * (0.45 + 0.4 * Math.sin(s * 3 + i))) + '"/>');
    });
    const PLATE = { top: "url(#pe_dk)", l: "rgba(22,23,26,0.92)", r: "rgba(36,37,42,0.92)", st: "rgba(244,243,240,0.34)" };
    o.push('<defs><linearGradient id="pe_fr" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.12"/><stop offset="0.6" stop-color="#FFFFFF" stop-opacity="0.2"/><stop offset="1" stop-color="#F3E6DC" stop-opacity="0.28"/></linearGradient></defs>');
    const up = (i0, u) => { const seg = o.splice(i0).join(""); if (u > 0.01) o.push(G("", seg, u, ' transform="translate(0,' + f((1 - u) * 10) + ')"')); };
    const badge = (bx, by, inner, op) => { if (op > 0.01) o.push(G("", '<circle cx="' + f(bx) + '" cy="' + f(by + 3) + '" r="23" fill="rgba(28,28,32,0.92)" stroke="rgba(244,243,240,0.22)" stroke-width="0.8"/><circle cx="' + f(bx) + '" cy="' + f(by) + '" r="23" fill="rgba(12,12,14,0.94)" stroke="rgba(244,243,240,0.58)" stroke-width="0.9"/><circle cx="' + f(bx) + '" cy="' + f(by) + '" r="18.5" fill="none" stroke="rgba(244,243,240,0.16)" stroke-width="0.8"/><g transform="translate(' + f(bx) + "," + f(by) + ')">' + inner + "</g>", op)); };
    const order = [0, 2, 1];
    order.forEach((i) => {
      const t0 = 2.7 + i * 0.18, pIn = this.sm(t0, t0 + 0.6, s), vIn = this.sm(t0 + 0.35, t0 + 1.0, s);
      if (pIn <= 0.01) return;
      const X = PL[i][0], Y = PL[i][1], x0 = X - 100, y0 = Y - 100, j0 = o.length;
      box(x0, y0, 0, 200, 200, 8, PLATE);
      const e1 = P(x0, y0 + 200, 0), e2 = P(x0 + 200, y0 + 200, 0), e3 = P(x0 + 200, y0, 0);
      const edge = '<polyline points="' + f(e1[0]) + "," + f(e1[1]) + " " + f(e2[0]) + "," + f(e2[1]) + " " + f(e3[0]) + "," + f(e3[1]) + '" fill="none" stroke="url(#pe_edge)"';
      o.push(edge + ' stroke-width="7" opacity="0.18" stroke-linejoin="round"/>' + edge + ' stroke-width="1.6" opacity="0.9" stroke-linejoin="round"/>');
      o.push(G(mTop(8), R(x0 + 8, y0 + 8, 184, 184, "none", "rgba(244,243,240,0.14)")));
      wrap(j0, pIn, "translate(0," + f((1 - pIn) * 24) + ")");
      const v0 = o.length;
      if (i === 0) {
        // reporting: report and chart sheets in front of a folder, the sheet of figures, a packaged pack, and a clock that keeps ticking
        const U = (u) => x0 + u, V = (v) => y0 + v, T0 = t0;
        const cyc = s - (T0 + 2.2), tau = cyc > 0 ? cyc % 3.4 : -1;
        o.push(G(mTop(8), R(U(84), V(104), 78, 74, "rgba(8,8,10,0.4)", "rgba(244,243,240,0.22)", 0.8, 4) + R(U(105), V(53), 38, 38, "rgba(8,8,10,0.35)", "rgba(244,243,240,0.22)", 0.8, 3) + R(U(36), V(106), 18, 68, "rgba(8,8,10,0.35)", "rgba(244,243,240,0.18)", 0.8, 3)));
        let i1 = o.length;
        o.push(G(mX(U(14)), Pa("M" + V(196) + " 8 L" + V(196) + " 88 L" + V(76) + " 88 L" + V(70) + " 96 L" + V(38) + " 96 L" + V(38) + " 8 Z", "rgba(255,255,255,0.05)", "rgba(255,255,255,0.4)", 0.9)));
        up(i1, this.sm(T0 + 0.3, T0 + 0.9, s));
        // the report
        i1 = o.length;
        let rd = R(V(112), 10, 56, 90, "url(#pe_fr)", "rgba(255,255,255,0.7)", 0.8, 3) + R(V(114.5), 12.5, 51, 85, "none", "rgba(255,255,255,0.14)", 0.8, 2);
        rd += R(V(151), 84, 11, 9, "rgba(10,10,12,0.55)", "rgba(244,243,240,0.7)", 0.8, 1.5) + R(V(154), 86.5, 5, 4, "none", "rgba(244,243,240,0.7)", 0.7, 1);
        rd += Ln(V(146), 91, V(124), 91, 1.6, "rgba(244,243,240,0.8)") + Ln(V(146), 86, V(130), 86, 1.1, "rgba(244,243,240,0.5)");
        for (let r = 0; r < 6; r++) { const z = 74 - r * 8; rd += Ln(V(160), z, V(122 + (r % 3) * 5), z, 1.1, "rgba(244,243,240,0.55)"); }
        if (tau >= 0) { const zz = 76 - (tau / 3.4) * 42; rd += G("", Ln(V(162), zz, V(118), zz, 2.2, "#F3C9A8"), 0.55 * Math.sin(Math.PI * tau / 3.4)); }
        o.push(G(mX(U(46)), rd));
        up(i1, this.sm(T0 + 0.45, T0 + 1.05, s));
        // the chart: one slice eases out on every cycle
        i1 = o.length;
        const pc = V(70), pz = 46, pr = 17, ex = tau >= 0 ? 3.2 * Math.sin(Math.PI * Math.min(1, tau / 1.4)) : 0;
        let pd = R(V(44), 10, 52, 74, "url(#pe_fr)", "rgba(255,255,255,0.7)", 0.8, 3) + R(V(46.5), 12.5, 47, 69, "none", "rgba(255,255,255,0.14)", 0.8, 2);
        pd += Pa("M" + f(pc) + " " + pz + " L" + f(pc + pr) + " " + pz + " A" + pr + " " + pr + " 0 1 0 " + f(pc) + " " + (pz + pr) + " Z", "rgba(10,10,12,0.82)", "rgba(244,243,240,0.5)", 0.8);
        pd += '<g transform="translate(' + f(ex * 0.7) + "," + f(ex * 0.7) + ')">' + Pa("M" + f(pc) + " " + pz + " L" + f(pc) + " " + (pz + pr) + " A" + pr + " " + pr + " 0 0 0 " + f(pc + pr) + " " + pz + " Z", "url(#pe_pg)", "rgba(255,255,255,0.8)", 0.8) + "</g>";
        pd += Ln(V(86), 20, V(54), 20, 1.1, "rgba(244,243,240,0.5)") + Ln(V(86), 15, V(64), 15, 1.1, "rgba(244,243,240,0.35)");
        o.push(G(mX(U(68)), pd));
        up(i1, this.sm(T0 + 0.6, T0 + 1.2, s));
        // a packaged pack in a glass case
        const cIn = this.sm(T0 + 0.75, T0 + 1.3, s), cz = (1 - cIn) * 26;
        if (cIn > 0.01) {
          i1 = o.length;
          box(U(116), V(64), 8 + cz, 16, 16, 14, { top: "#F7DCC6", l: "rgba(243,201,168,0.9)", r: "rgba(226,172,140,0.85)", st: "rgba(255,240,228,0.9)" });
          o.push(G(mTop(22 + cz), Ln(U(124), V(64), U(124), V(80), 0.8, "rgba(160,110,80,0.7)")));
          box(U(110), V(58), 8 + cz, 28, 28, 28, { top: "rgba(255,255,255,0.1)", l: "rgba(255,255,255,0.06)", r: "rgba(255,255,255,0.1)", st: "rgba(255,255,255,0.62)" });
          const seg = o.splice(i1).join(""); o.push(G("", seg, cIn));
        }
        // the figures: a sheet of cells, one cell refreshing at a time
        const gh = 20 * this.sm(T0 + 0.55, T0 + 1.15, s);
        if (gh > 0.5) {
          box(U(88), V(108), 8, 70, 66, gh, { top: "rgba(18,18,22,0.72)", l: "rgba(255,255,255,0.05)", r: "rgba(255,255,255,0.09)", st: "rgba(255,255,255,0.6)" });
          let gg = "";
          if (tau >= 0) { const n = Math.floor(tau / 3.4 * 12), cc = n % 4, rr = Math.floor(n / 4); gg += G("", R(U(88 + cc * 17.5 + 2), V(108 + rr * 22 + 2), 13.5, 18, "url(#pe_pg)", "none"), 0.45); }
          for (let c = 1; c < 4; c++) gg += Ln(U(88 + c * 17.5), V(112), U(88 + c * 17.5), V(170), 0.8, "rgba(244,243,240,0.45)");
          for (let r = 1; r < 3; r++) gg += Ln(U(92), V(108 + r * 22), U(154), V(108 + r * 22), 0.8, "rgba(244,243,240,0.45)");
          [[0, 0], [2, 0], [1, 1], [3, 1], [0, 2], [2, 2]].forEach((q) => { gg += Ln(U(88 + q[0] * 17.5 + 5), V(108 + q[1] * 22 + 11), U(88 + q[0] * 17.5 + 12), V(108 + q[1] * 22 + 11), 1, "rgba(244,243,240,0.35)"); });
          o.push(G(mTop(8 + gh), gg));
        }
        const aIn = this.sm(T0 + 0.9, T0 + 1.6, s), bc = P(x0 + 200, y0 + 200, 8), ang = Math.PI / 2 + Math.max(0, s - (T0 + 1.6)) * 2 * Math.PI / 3.4;
        badge(bc[0], bc[1] - 10, '<circle cx="0" cy="0" r="9" fill="none" stroke="#F4F3F0" stroke-width="1.4"/><path d="M0 0 V-5.5 M0 0 L' + f(5.2 * Math.sin(ang)) + " " + f(-5.2 * Math.cos(ang)) + '" fill="none" stroke="#F4F3F0" stroke-width="1.4" stroke-linecap="round"/>', aIn);
      } else if (i === 1) {
        // compliance: a ticked checklist, every document captured on the stack, approvals filed alongside
        const U = (u) => x0 + u, V = (v) => y0 + v, T0 = t0;
        const cyc = s - (T0 + 2.2), tau = cyc > 0 ? cyc % 3.6 : -1;
        o.push(G(mTop(8), R(U(20), V(98), 24, 94, "rgba(8,8,10,0.35)", "rgba(244,243,240,0.18)", 0.8, 3) + R(U(76), V(76), 82, 72, "rgba(8,8,10,0.4)", "rgba(244,243,240,0.22)", 0.8, 4) + R(U(56), V(20), 124, 44, "rgba(8,8,10,0.3)", "rgba(244,243,240,0.16)", 0.8, 4)));
        let i1 = o.length;
        o.push(G(mX(U(12)), R(V(54), 8, 86, 114, "rgba(255,255,255,0.045)", "rgba(255,255,255,0.36)", 0.9, 4)));
        up(i1, this.sm(T0 + 0.3, T0 + 0.9, s));
        // the checklist, a thick glass slab
        i1 = o.length;
        box(U(26), V(102), 8, 8, 84, 110, { top: "rgba(255,255,255,0.22)", l: "rgba(255,255,255,0.1)", r: "url(#pe_fr)", st: "rgba(255,255,255,0.66)" });
        let ck = R(V(106), 14, 76, 100, "none", "rgba(255,255,255,0.16)", 0.8, 3);
        [96, 76, 56].forEach((z, k) => {
          const tk = this.sm(T0 + 1.0 + k * 0.25, T0 + 1.3 + k * 0.25, s), gl = tau >= k * 0.5 ? Math.exp(-(tau - k * 0.5) / 0.4) : 0;
          ck += R(V(176), z - 5, 11, 11, "rgba(10,10,12,0.6)", "rgba(244,243,240,0.8)", 0.9, 2);
          if (gl > 0.01) ck += G("", R(V(176), z - 5, 11, 11, "none", "#F3C9A8", 1.4, 2), gl);
          ck += '<path d="M' + f(V(184.5)) + " " + (z + 0.5) + " L" + f(V(182)) + " " + (z - 2.5) + " L" + f(V(177.5)) + " " + (z + 3.5) + '" fill="none" stroke="#F4F3F0" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="' + f(1 - tk) + '"' + NS + "/>";
          ck += Ln(V(170), z + 3, V(136), z + 3, 1.6, "rgba(244,243,240,0.75)") + Ln(V(170), z - 3, V(146), z - 3, 1.1, "rgba(244,243,240,0.45)");
        });
        ck += R(V(116), 26, 60, 11, "rgba(10,10,12,0.35)", "rgba(244,243,240,0.35)", 0.8, 5.5);
        o.push(G(mX(U(34)), ck));
        up(i1, this.sm(T0 + 0.4, T0 + 1.0, s));
        // approvals, filed on the right
        const card = (v, u0, w, z1, inner, t) => { const k0 = o.length; o.push(G(mY(V(v)), R(U(u0), 8, w, z1 - 8, "url(#pe_fr)", "rgba(255,255,255,0.66)", 0.8, 4) + R(U(u0 + 2.5), 10.5, w - 5, z1 - 13, "none", "rgba(255,255,255,0.13)", 0.8, 3) + inner)); const u = this.sm(t, t + 0.6, s), seg = o.splice(k0).join(""); if (u > 0.01) o.push(G("", seg, u, ' transform="translate(' + f((1 - u) * 14) + "," + f((1 - u) * 8) + ')"')); };
        const ok = this.sm(T0 + 1.4, T0 + 1.9, s), shine = tau >= 0.7 ? Math.exp(-(tau - 0.7) / 0.5) : 0;
        card(30, 60, 80, 100, G("", R(U(68), 66, 64, 22, "url(#pe_pg)", "rgba(255,255,255,0.75)", 0.8, 6), 0.25 + 0.65 * ok) + (shine > 0.01 ? G("", R(U(68), 66, 64, 22, "none", "#FFFFFF", 1.4, 6), shine) : "") +
          '<path d="M' + f(U(74)) + " 77 L" + f(U(77.5)) + " 73.5 L" + f(U(84)) + ' 81" fill="none" stroke="#1A1917" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="' + f(1 - ok) + '"' + NS + "/>" +
          Ln(U(90), 80, U(124), 80, 1.8, "rgba(26,25,23,0.55)") + Ln(U(90), 73, U(114), 73, 1.2, "rgba(26,25,23,0.4)") + Ln(U(68), 50, U(122), 50, 1.1, "rgba(244,243,240,0.4)") + Ln(U(68), 42, U(110), 42, 1.1, "rgba(244,243,240,0.3)"), T0 + 0.7);
        card(46, 66, 52, 64, [50, 38, 26].map((z) => C(U(74), z, 2.6, "rgba(244,243,240,0.7)", "none") + Ln(U(80), z, U(110), z, 1.4, "rgba(244,243,240,0.55)")).join(""), T0 + 0.85);
        let dl = Ln(U(136), 60, U(160), 60, 1.6, "rgba(244,243,240,0.8)");
        for (let r = 0; r < 5; r++) dl += Ln(U(136), 52 - r * 6, U(166 - (r % 2) * 8), 52 - r * 6, 1, "rgba(244,243,240,0.45)");
        card(58, 130, 42, 70, dl, T0 + 1.0);
        // every document captured on the stack; a new one lands each cycle and is stamped
        for (let k = 0; k < 5; k++) {
          const u = this.sm(T0 + 0.6 + k * 0.1, T0 + 0.9 + k * 0.1, s);
          if (u < 0.01) continue;
          const k0 = o.length;
          box(U(82 + k * 0.8), V(82 - k * 0.6), 8 + k * 4, 66, 58, 2.4, { top: "rgba(236,234,230,0.2)", l: "rgba(255,255,255,0.12)", r: "rgba(255,255,255,0.18)", st: "rgba(255,255,255,0.6)" });
          const seg = o.splice(k0).join(""); o.push(G("", seg, u, ' transform="translate(0,' + f(-(1 - u) * 14) + ')"'));
        }
        const sheetTop = (z, op, stamp) => {
          let q = "";
          for (let r = 0; r < 6; r++) q += Ln(U(92), V(92 + r * 8), U(140 - (r % 3) * 8), V(92 + r * 8), 0.9, "rgba(244,243,240,0.5)");
          if (stamp > 0.01) q += G("", C(U(142), V(128), 4.5, "url(#pe_pg)", "rgba(255,255,255,0.8)", 0.7), stamp);
          o.push(G(mTop(z), q, op));
          o.push(G(mY(V(82)), R(U(96), z, 12, 7, "rgba(255,255,255,0.14)", "rgba(255,255,255,0.55)", 0.8, 1.5) + R(U(114), z, 12, 7, "rgba(255,255,255,0.14)", "rgba(255,255,255,0.55)", 0.8, 1.5), op));
        };
        if (tau >= 0) {
          const dE = this.sm(0, 0.7, tau), op = dE * (1 - this.sm(3.1, 3.6, tau)), z = 28 + (1 - dE) * 30;
          box(U(86), V(79), z, 66, 58, 2.4, { top: "rgba(236,234,230,0.22)", l: "rgba(255,255,255,0.12)", r: "rgba(255,255,255,0.18)", st: "rgba(255,255,255,0.65)" }, op);
          sheetTop(z + 2.4, op, tau >= 0.7 ? 1 - this.sm(2.6, 3.1, tau) : 0);
        } else sheetTop(26.4, this.sm(T0 + 1.0, T0 + 1.3, s), 0);
        const aIn = this.sm(T0 + 0.9, T0 + 1.6, s), bc = P(x0 + 200, y0 + 200, 8);
        badge(bc[0], bc[1] - 10, '<path d="M0 -10 L8 -7 V-1 C8 5 4 8.5 0 10 Z" fill="url(#pe_pg)"/><path d="M0 -10 L8 -7 V-1 C8 5 4 8.5 0 10 C-4 8.5 -8 5 -8 -1 V-7 Z" fill="none" stroke="#F4F3F0" stroke-width="1.4" stroke-linejoin="round"/>', aIn);
      } else {
        // scale: a new product added on the left, capacity bars rising, investors joining on the same base
        const U = (u) => x0 + u, V = (v) => y0 + v, T0 = t0;
        o.push('<defs>' +
          '<linearGradient id="pe_bl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8C8E8" stop-opacity="0.78"/><stop offset="0.45" stop-color="#F3C9A8" stop-opacity="0.82"/><stop offset="1" stop-color="#E4CCEC" stop-opacity="0.9"/></linearGradient>' +
          '<linearGradient id="pe_br" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FB9E0" stop-opacity="0.62"/><stop offset="0.5" stop-color="#D9C3E8" stop-opacity="0.7"/><stop offset="1" stop-color="#EFE0F2" stop-opacity="0.78"/></linearGradient>' +
          '<linearGradient id="pe_bt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#DDEBF7" stop-opacity="0.95"/><stop offset="1" stop-color="#F2ECF6" stop-opacity="0.92"/></linearGradient>' +
          '</defs>');
        const cyc = s - (T0 + 2.2), tau = cyc > 0 ? cyc % 3.2 : -1;
        const hl = (k) => tau >= k * 0.4 ? Math.exp(-(tau - k * 0.4) / 0.35) : 0;
        const lift = (u, n) => G("", n, u, ' transform="translate(0,' + f((1 - u) * 10) + ')"');
        const BARS = [[118, 30], [74, 56], [30, 88]];
        // etched cells on the plate: one under the card, a pad under each bar, a seat for each investor
        let et = R(U(16), V(134), 44, 64, "rgba(8,8,10,0.4)", "rgba(244,243,240,0.22)", 0.8, 4);
        BARS.forEach((bq) => { et += R(U(91), V(bq[0] - 5), 40, 40, "rgba(8,8,10,0.35)", "rgba(244,243,240,0.22)", 0.8, 3); });
        BARS.forEach((bq, k) => { et += R(U(148), V(bq[0] - 2), 44, 36, "rgba(8,8,10,0.5)", "rgba(244,243,240,0.26)", 0.8, 4); if (hl(k) > 0.01) et += G("", R(U(148), V(bq[0] - 2), 44, 36, "none", "url(#pe_edge)", 1.2, 4), hl(k)); });
        et += Ln(U(131), V(47), U(148), V(47), 0.8, "rgba(244,243,240,0.18)") + Ln(U(131), V(91), U(148), V(91), 0.8, "rgba(244,243,240,0.18)") + Ln(U(131), V(135), U(148), V(135), 0.8, "rgba(244,243,240,0.18)");
        o.push(G(mTop(8), et));
        // the product folder behind, and the new-product card in front of it
        const fIn = this.sm(T0 + 0.3, T0 + 0.9, s), cIn = this.sm(T0 + 0.45, T0 + 1.05, s);
        const y1 = V(136), y2 = V(198);
        o.push(lift(fIn, G(mX(U(18)), Pa("M" + y1 + " 8 L" + y1 + " 98 L" + V(166) + " 98 L" + V(172) + " 106 L" + y2 + " 106 L" + y2 + " 8 Z", "rgba(255,255,255,0.06)", "rgba(255,255,255,0.42)", 0.9) + Ln(V(140), 93, V(162), 93, 0.8, "rgba(255,255,255,0.14)"))));
        const pc = V(186), pulse = hl(0);
        let cd = R(V(146), 8, 50, 60, "url(#pe_gc)", "rgba(255,255,255,0.72)", 0.8, 3) + R(V(148.5), 10.5, 45, 55, "none", "rgba(255,255,255,0.14)", 0.8, 2);
        cd += (pulse > 0.01 ? G("", C(pc, 52, 7 + 5 * pulse, "none", "#F3C9A8", 1), pulse * 0.8) : "") + C(pc, 52, 7, "url(#pe_pg)", "rgba(255,255,255,0.85)", 0.8) + Ln(pc - 3.5, 52, pc + 3.5, 52, 1.3, "#1A1917") + Ln(pc, 48.5, pc, 55.5, 1.3, "#1A1917");
        cd += Ln(V(176), 58, V(155), 58, 2.2, "rgba(244,243,240,0.85)") + Ln(V(176), 51, V(157), 51, 1.2, "rgba(244,243,240,0.5)") + Ln(V(176), 45, V(160), 45, 1.2, "rgba(244,243,240,0.5)") + Ln(V(176), 39, V(156), 39, 1.2, "rgba(244,243,240,0.5)");
        cd += C(pc, 30, 2.6, "none", "rgba(244,243,240,0.6)", 0.8) + R(V(151), 13, 40, 10, "rgba(10,10,12,0.4)", "rgba(244,243,240,0.3)", 0.7, 2);
        o.push(lift(cIn, G(mX(U(36)), cd)));
        // capacity bars, back to front, growing in turn
        [2, 1, 0].forEach((k) => {
          const bq = BARS[k], gIn = this.sm(T0 + 0.55 + k * 0.18, T0 + 1.25 + k * 0.18, s), hh = bq[1] * gIn;
          if (hh < 0.5) return;
          box(U(96), V(bq[0]), 8, 30, 30, hh, { top: "url(#pe_bt)", l: "url(#pe_bl)", r: "url(#pe_br)", st: "rgba(255,255,255,0.82)" });
          o.push(G(mTop(8 + hh), R(U(99), V(bq[0] + 3), 24, 24, "none", "rgba(255,255,255,0.55)", 0.8) + (hl(k) > 0.01 ? G("", R(U(96), V(bq[0]), 30, 30, "#FFFFFF", "none"), 0.4 * hl(k)) : "")));
        });
        // investors taking a seat, front first
        BARS.forEach((bq, k) => {
          const pk = this.sm(T0 + 0.7 + k * 0.18, T0 + 1.1 + k * 0.18, s);
          if (pk < 0.01) return;
          const yc = V(bq[0] + 16), fill = "rgba(236,232,228,0.86)";
          let fg = C(yc, 29, 5, fill, "none") + Pa("M" + f(yc + 10) + " 9 C" + f(yc + 10) + " 22 " + f(yc - 10) + " 22 " + f(yc - 10) + " 9 Z", fill, "none");
          if (hl(k) > 0.01) fg += G("", C(yc, 29, 5, "url(#pe_pg)", "none") + Pa("M" + f(yc + 10) + " 9 C" + f(yc + 10) + " 22 " + f(yc - 10) + " 22 " + f(yc - 10) + " 9 Z", "url(#pe_pg)", "none"), hl(k));
          o.push(lift(pk, G(mX(U(170)), fg)));
        });
        // growth badge on the front corner
        const aIn = this.sm(T0 + 0.9, T0 + 1.6, s), bc = P(x0 + 200, y0 + 200, 8), bx = bc[0], by = bc[1] - 10;
        o.push(G("", '<circle cx="' + f(bx) + '" cy="' + f(by + 3) + '" r="23" fill="rgba(28,28,32,0.92)" stroke="rgba(244,243,240,0.22)" stroke-width="0.8"/>' +
          '<circle cx="' + f(bx) + '" cy="' + f(by) + '" r="23" fill="rgba(12,12,14,0.94)" stroke="rgba(244,243,240,0.58)" stroke-width="0.9"/>' +
          '<circle cx="' + f(bx) + '" cy="' + f(by) + '" r="18.5" fill="none" stroke="rgba(244,243,240,0.16)" stroke-width="0.8"/>' +
          '<path d="M' + f(bx - 9) + " " + f(by + 5) + " L" + f(bx - 3) + " " + f(by - 1) + " L" + f(bx + 1) + " " + f(by + 3) + " L" + f(bx + 9) + " " + f(by - 5) + " M" + f(bx + 3) + " " + f(by - 5) + " H" + f(bx + 9) + " V" + f(by + 1) + '" fill="none" stroke="#F4F3F0" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="' + f(1 - aIn) + '"/>', aIn));
      }
      wrap(v0, vIn, "translate(0," + f((1 - vIn) * 14) + ")");
    });

    return '<svg viewBox="0 0 1280 1080" width="1280" height="1080" style="position:absolute; inset:0">' + o.join("") + late.join("") + "</svg>";
  }
  renderVals() { return { wrapEl: this.wrapEl, flyEl: this.flyEl, frameEl: this.frameEl, latEl: this.latEl, boxEl: this.boxEl, f5El: this.f5El }; }
}
