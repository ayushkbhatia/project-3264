/*
 * 03 Rebuild graphic: four tiers assemble into the production platform.
 * VERBATIM logic class from the prototype (reference/). Port source, not a drop-in module.
 * It is a React class component minus render(): props, state, setState, lifecycle, refs via React.createRef(),
 * and renderVals(), whose keys feed the {{ holes }} in the template (reference/sections/*.html).
 * Standalone it auto-loops (T = 17s: builds over 11s, holds 6s). With props.bare (as mounted here) it hides its backdrop and CTA,
 * draws the floor grid once into [data-grid="2a"], and reads its timeline from window.__rbCtl.t, writing .shown back.
 */

class Component extends DCLogic {
  rgBox = React.createRef(); rgFrame = React.createRef();
  componentDidMount() {
    this.t0 = performance.now(); this.raf = requestAnimationFrame(this.tick);
    // bare: drop the frame's own backdrop so a parent can run one continuous canvas behind 03 and 04
    if (this.props.bare && this.rgFrame.current) {
      const fr = this.rgFrame.current;
      fr.style.background = "transparent";
      [0, 1].forEach((i) => { if (fr.children[i]) fr.children[i].style.display = "none"; });
      this._grid = true;
      const cta = fr.querySelector('a[href="#engagement"]');
      if (cta && cta.parentElement) cta.parentElement.style.display = "none";
    }
    const fit = () => { const b = this.rgBox.current, f = this.rgFrame.current; if (!b || !f) return; const s = b.clientWidth / 1280; f.style.transform = "scale(" + s + ")"; b.style.height = (1000 * s) + "px"; };
    this.ro = new ResizeObserver(fit); if (this.rgBox.current) this.ro.observe(this.rgBox.current); fit();
  }
  componentWillUnmount() { cancelAnimationFrame(this.raf); if (this.ro) this.ro.disconnect(); }
  cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  sm(a, b, x) { const u = this.cl((x - a) / (b - a)); return u * u * (3 - 2 * u); }
  mix(a, b, u) { return a + (b - a) * u; }
  tick = (now) => {
    // auto loop; a parent (bare mode) can take over the timeline through window.__rbCtl
    const T = 17, ctl = this.props.bare ? window.__rbCtl : null;
    let t;
    if (ctl && ctl.t != null) { t = this.cl(ctl.t); this._held = t; }
    else {
      if (this._held != null) { this.t0 = now - this._held * 11000; this._held = null; }
      t = this.cl((((now - this.t0) / 1000) % T) / 11);
    }
    if (ctl) ctl.shown = t;
    const host = document.querySelector('[data-svg="2a"]');
    if (host && !this._grid) this.drawGrid(host);
    if (host) host.innerHTML = this.scene(t, (now - this.t0) / 1000);
    const beat = t < 0.1 ? -1 : t >= 0.86 ? 4 : Math.min(3, Math.floor((t - 0.1) / 0.19));
    this.raf = requestAnimationFrame(this.tick);
  };
  // floor grid across the whole frame, on the same isometric origin as the stack
  drawGrid(host) {
    const layer = document.querySelector('[data-grid="2a"]');
    if (!layer) return;
    const frame = layer.parentElement;
    let ox = 0, oy = 0, el = host;
    while (el && el !== frame) { ox += el.offsetLeft; oy += el.offsetTop; el = el.offsetParent; }
    if (el !== frame) return;
    const S = 0.9, a = 0.866 * S, b = 0.5 * S, X = ox + 360, Y = oy + 310;
    let s = "";
    for (let i = -40; i <= 40; i++) {
      s += '<line x1="' + i * 40 + '" y1="-1600" x2="' + i * 40 + '" y2="1600"/><line x1="-1600" y1="' + i * 40 + '" x2="1600" y2="' + i * 40 + '"/>';
    }
    layer.innerHTML = '<svg width="100%" height="100%" style="position:absolute; inset:0"><g transform="matrix(' + a + "," + b + "," + (-a) + "," + b + "," + X + "," + Y + ')" stroke="rgba(255,255,255,0.055)" stroke-width="1" vector-effect="non-scaling-stroke" style="vector-effect:non-scaling-stroke">' + s + "</g></svg>";
    this._grid = true;
  }
  gear(gx, gy, ro, ri, n, hole) {
    const st = Math.PI * 2 / n, p = [];
    for (let i = 0; i < n; i++) {
      const a0 = i * st;
      [[a0 - st * 0.28, ri], [a0 - st * 0.14, ro], [a0 + st * 0.14, ro], [a0 + st * 0.28, ri]].forEach((q) => p.push((gx + Math.cos(q[0]) * q[1]).toFixed(2) + " " + (gy + Math.sin(q[0]) * q[1]).toFixed(2)));
    }
    return "M" + p.join(" L") + " Z M" + (gx + hole) + " " + gy + " A" + hole + " " + hole + " 0 1 0 " + (gx - hole) + " " + gy + " A" + hole + " " + hole + " 0 1 0 " + (gx + hole) + " " + gy + " Z";
  }
  scene(t, sec) {
    const S = 0.9, cx = 360, cy = 310, a = 0.866 * S, b = 0.5 * S;
    const f = (n) => (Math.round(n * 100) / 100).toString();
    const o = [];
    const INK = "rgba(244,243,240,0.74)", NS = ' vector-effect="non-scaling-stroke"';
    const P = (x, y, z) => [cx + (x - y) * a, cy + (x + y) * b - z * S];
    const mTop = (z) => "matrix(" + f(a) + "," + f(b) + "," + f(-a) + "," + f(b) + "," + f(cx) + "," + f(cy - z * S) + ")";
    const mY = (y0) => "matrix(" + f(a) + "," + f(b) + ",0," + f(-S) + "," + f(cx - a * y0) + "," + f(cy + b * y0) + ")";
    const mX = (x0) => "matrix(" + f(-a) + "," + f(b) + ",0," + f(-S) + "," + f(cx + a * x0) + "," + f(cy + b * x0) + ")";
    const mCard = (ox, oy, z) => "matrix(" + f(a) + "," + f(-b) + "," + f(a) + "," + f(b) + "," + f(cx + (ox - oy) * a) + "," + f(cy + (ox + oy) * b - z * S) + ")";
    const G = (tr, inner, op, extra) => "<g" + (tr ? ' transform="' + tr + '"' : "") + (op != null && op < 0.999 ? ' opacity="' + f(Math.max(0, op)) + '"' : "") + (extra || "") + ">" + inner + "</g>";
    const R = (x, y, w, hh, fill, st, sw, rx) => '<rect x="' + f(x) + '" y="' + f(y) + '" width="' + f(w) + '" height="' + f(hh) + '"' + (rx ? ' rx="' + rx + '"' : "") + ' fill="' + (fill || "none") + '" stroke="' + (st || "none") + '" stroke-width="' + (sw || 0.8) + '"' + NS + "/>";
    const C = (x, y, r, fill, st, sw) => '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(r) + '" fill="' + (fill || "none") + '" stroke="' + (st || "none") + '" stroke-width="' + (sw || 0.8) + '"' + NS + "/>";
    const Ln = (x1, y1, x2, y2, sw, col) => '<line x1="' + f(x1) + '" y1="' + f(y1) + '" x2="' + f(x2) + '" y2="' + f(y2) + '" stroke="' + (col || INK) + '" stroke-width="' + (sw || 1) + '" stroke-linecap="butt"' + NS + "/>";
    const Pa = (d, fill, st, sw, extra) => '<path d="' + d + '"' + (fill === null ? "" : ' fill="' + (fill || "none") + '"') + (st === null ? "" : ' stroke="' + (st || "none") + '" stroke-width="' + (sw || 0.8) + '"') + NS + (extra || "") + "/>";
    const WH = { top: "url(#gt)", l: "rgba(255,255,255,0.07)", r: "rgba(255,255,255,0.14)" };
    const box = (x, y, z, w, d, hh, c, op) => {
      c = c || WH;
      const st = c.st || INK;
      o.push(G("", G(mY(y + d), R(x, z, w, hh, c.l, st)) + G(mX(x + w), R(y, z, d, hh, c.r, st)) + G(mTop(z + hh), R(x, y, w, d, c.top, st)) + (c.extra ? c.extra(z + hh) : ""), op));
    };
    const ext = (z, th, inner, side, top, st, op) => {
      const n = Math.max(2, Math.ceil(th * S / 1.1));
      let s = G(mTop(z), inner, null, ' fill="' + side + '" stroke="' + INK + '" stroke-width="0.8" fill-rule="evenodd"');
      for (let i = 1; i < n; i++) s += G(mTop(z + th * i / n), inner, null, ' fill="' + side + '" stroke="' + side + '" stroke-width="1.4" fill-rule="evenodd"');
      s += G(mTop(z + th), inner, null, ' fill="' + top + '" stroke="' + (st || INK) + '" stroke-width="0.8" stroke-linejoin="round" fill-rule="evenodd"');
      o.push(G("", s, op));
    };
    const cyl = (x, y, z, r, hh, side, top, op) => {
      const B = P(x, y, z), Tt = P(x, y, z + hh), rx = 1.2247 * r * S, ry = 0.7071 * r * S;
      o.push(G("", '<path d="M' + f(B[0] - rx) + " " + f(Tt[1]) + " L" + f(B[0] - rx) + " " + f(B[1]) + " A" + f(rx) + " " + f(ry) + " 0 0 0 " + f(B[0] + rx) + " " + f(B[1]) + " L" + f(B[0] + rx) + " " + f(Tt[1]) + ' Z" fill="' + side + '" stroke="' + INK + '" stroke-width="0.8"/>' + G(mTop(z + hh), C(x, y, r, top, INK)), op));
    };
    const card = (ox, oy, z, W, H, inner, op, th) => {
      if (op != null && op < 0.01) return;
      th = th == null ? 3 : th;
      box(ox, oy - W, z - th, H, W, th, { top: "url(#gt)", l: "rgba(255,255,255,0.06)", r: "rgba(255,255,255,0.12)" }, op);
      o.push(G(mCard(ox, oy, z), R(0, 0, W, H, "url(#gc)", "rgba(255,255,255,0.62)") + R(1.5, 1.5, W - 3, H - 3, "none", "rgba(255,255,255,0.18)") + inner, op));
    };
    const wire = (pts, u, op) => {
      const s = pts.map((p) => { const q = P(p[0], p[1], p[2] || 0); return f(q[0]) + "," + f(q[1]); }).join(" ");
      o.push('<polyline points="' + s + '" fill="none" stroke="rgba(244,243,240,0.72)" stroke-width="1" pathLength="1" stroke-dasharray="1" stroke-dashoffset="' + f(1 - u) + '" opacity="' + f(op) + '"/>');
      const pin = (p) => { const q = P(p[0], p[1], p[2] || 0); o.push('<circle cx="' + f(q[0]) + '" cy="' + f(q[1]) + '" r="2.8" fill="#0A0A0A" stroke="rgba(244,243,240,0.85)" stroke-width="1" opacity="' + f(op) + '"/>'); };
      if (u > 0.02) pin(pts[0]);
      if (u > 0.98) pin(pts[pts.length - 1]);
    };
    const label = (x, y, s, op, anchor) => o.push('<text x="' + f(x) + '" y="' + f(y) + '" fill="#F4F3F0" font-family="Instrument Sans, Helvetica Neue, Helvetica, sans-serif" font-size="14" font-weight="500" letter-spacing="-0.1" text-anchor="' + (anchor || "middle") + '" opacity="' + f(op) + '">' + s + "</text>");

    const A = [0, 1, 2, 3].map((k) => this.sm(0.1 + 0.19 * k, 0.2 + 0.19 * k, t)), asm = this.sm(0.86, 0.98, t);
    const EX = [174, 116, 58, 0], AS = [78, 50, 22, 0], TH = [6, 6, 6, 10];
    const Z = [0, 1, 2, 3].map((L) => this.mix(EX[L], AS[L], asm) + (1 - A[L]) * 26);
    const vis = (x) => x;

    o.push('<defs>' +
      '<linearGradient id="pg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A8C8E8"/><stop offset="0.3" stop-color="#E9E4CF"/><stop offset="0.55" stop-color="#F3C9A8"/><stop offset="0.8" stop-color="#D9C3E8"/><stop offset="1" stop-color="#AEC9DE"/></linearGradient>' +
      '<linearGradient id="gt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.36"/><stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.12"/><stop offset="1" stop-color="#E6EEF6" stop-opacity="0.22"/></linearGradient>' +
      '<linearGradient id="gc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.3"/><stop offset="0.45" stop-color="#FFFFFF" stop-opacity="0.1"/><stop offset="1" stop-color="#F3E6DC" stop-opacity="0.16"/></linearGradient>' +
      '<linearGradient id="dk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2E3036" stop-opacity="0.9"/><stop offset="1" stop-color="#0C0C0E" stop-opacity="0.88"/></linearGradient>' +
      '<radialGradient id="glow"><stop offset="0" stop-color="#F3C9A8" stop-opacity="0.5"/><stop offset="0.4" stop-color="#D9C3E8" stop-opacity="0.22"/><stop offset="1" stop-color="#AEC9DE" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="gp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.14"/><stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.04"/><stop offset="1" stop-color="#E6EEF6" stop-opacity="0.09"/></linearGradient>' +
      '<linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0.42"/></linearGradient>' +
      '<linearGradient id="lgf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0.06"/></linearGradient>' +
      '<clipPath id="pc"><rect x="-330" y="-270" width="720" height="570"/></clipPath>' +
      '<radialGradient id="glow2"><stop offset="0" stop-color="#A8C8E8" stop-opacity="0.38"/><stop offset="1" stop-color="#A8C8E8" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="sg" gradientUnits="userSpaceOnUse" x1="200" y1="0" x2="560" y2="0"><stop offset="0" stop-color="#A8C8E8"/><stop offset="0.3" stop-color="#E9E4CF"/><stop offset="0.55" stop-color="#F3C9A8"/><stop offset="0.8" stop-color="#D9C3E8"/><stop offset="1" stop-color="#AEC9DE"/></linearGradient>' +
      '</defs>');
    [[-312, -252], [358, -252], [358, 282], [-312, 282]].forEach((p) => box(p[0], p[1], -100, 14, 14, 90, { top: "none", l: "url(#lgf)", r: "url(#lgf)", st: "url(#lg)" }));
    box(-330, -270, -10, 720, 570, 10, { top: "url(#gp)", l: "rgba(255,255,255,0.05)", r: "rgba(255,255,255,0.1)", st: "rgba(255,255,255,0.42)" });
    o.push(G(mTop(0), R(-322, -262, 704, 554, "none", "rgba(255,255,255,0.16)") + Ln(-330, -270, 390, -270, 1.4, "rgba(255,255,255,0.55)") + Ln(-330, -270, -330, 300, 1.4, "rgba(255,255,255,0.4)")));
    o.push(G(mTop(0), '<circle cx="0" cy="0" r="420" fill="url(#glow)"/><circle cx="120" cy="150" r="320" fill="url(#glow2)"/><circle cx="-200" cy="60" r="300" fill="url(#glow2)"/>', 0.7 + 0.3 * asm, ' clip-path="url(#pc)"'));

    // ---- back satellites
    const sv = vis(A[2]);
    if (sv > 0.01) for (let i = 0; i < 4; i++) {
      const top = i === 3 ? "url(#pg)" : "url(#pt)";
      box(-300, -30, i * 22, 60, 60, 22, { top: top, l: "rgba(255,255,255,0.07)", r: "rgba(255,255,255,0.14)", extra: null }, sv);
      o.push(G(mX(-240), Ln(-22, i * 22 + 11, 22, i * 22 + 11, 1, INK) + C(-20, i * 22 + 11, 2.2, i === 3 ? "#F3C9A8" : "#1A1917"), sv));
    }
    const shp = vis(A[0]);
    card(-230, 170, 0, 110, 90,
      C(26, 58, 17, INK) + R(52, 12, 26, 26, INK) + R(56, 50, 26, 26, "url(#pg)", INK) + Ln(86, 20, 102, 20, 4) + Ln(86, 30, 102, 30, 4) + Ln(86, 40, 102, 40, 4), shp);
    const dv = vis(A[3]);
    card(140, -120, 0, 110, 80,
      Ln(14, 16, 80, 16, 2.6) + Ln(14, 26, 70, 26, 2.6) + Ln(14, 36, 84, 36, 2.6) + Ln(14, 46, 60, 46, 2.6) + Ln(14, 56, 74, 56, 2.6) + Ln(84, 66, 96, 66, 2.6) + R(76, 8, 24, 10, "url(#pg)", INK, 0.8, 2), dv);
    wire([[-240, 0], [-170, 0], [-170, -50], [-100, -50]], A[2], 1);
    wire([[-140, 115], [-120, 115], [-120, 50], [-100, 50]], A[0], 1);
    wire([[140, -175], [122, -175], [122, -50], [100, -50]], A[3], 1);
    wire([[20, 140], [20, 122], [-50, 122], [-50, 100]], A[1], 1);
    wire([[100, 30], [124, 30], [124, 80], [150, 80]], this.sm(0.96, 1.0, t), 1);
    if (t >= 1) {
      const path = [[100, 30], [124, 30], [124, 80], [150, 80]], L = [24, 50, 26], tot = 100, u = ((sec || 0) % 1.4) / 1.4 * tot;
      let acc = 0, px = 100, py = 30;
      for (let i = 0; i < 3; i++) { if (u <= acc + L[i]) { const k = (u - acc) / L[i]; px = path[i][0] + (path[i + 1][0] - path[i][0]) * k; py = path[i][1] + (path[i + 1][1] - path[i][1]) * k; break; } acc += L[i]; }
      const q = P(px, py, 0);
      o.push('<circle cx="' + f(q[0]) + '" cy="' + f(q[1]) + '" r="7" fill="#F3C9A8" opacity="0.28"/><circle cx="' + f(q[0]) + '" cy="' + f(q[1]) + '" r="3" fill="#F9E7D6"/>');
    }

    // ---- the stack, bottom first
    const ghost = (L) => {
      const z = Z[L] + TH[L];
      const d = L === 0 ? "M-100 -100 H140 V-40 H60 V100 H-100 Z" : "M-100 -100 H100 V100 H-100 Z";
      o.push(G(mTop(z), Pa(d, "none", "rgba(255,255,255,0.4)", 1, ' stroke-dasharray="4 4"'), 0.8));
    };
    const posts = (lo, hi, pts) => {
      if (A[lo] < 0.02 || A[hi] < 0.02) return;
      const z0 = Z[lo] + TH[lo], hh = Z[hi] - z0;
      if (hh < 1) return;
      pts.forEach((p) => cyl(p[0], p[1], z0, 3.2, hh, "rgba(255,255,255,0.2)", "rgba(255,255,255,0.6)", Math.min(A[lo], A[hi])));
    };
    const CORN = [[-88, -88], [88, -88], [88, 88], [-88, 88]];
    // L3 Evidence base
    if (A[3] < 0.02) ghost(3); else {
      const z = Z[3], op = A[3];
      box(-100, -100, z, 200, 200, 10, { top: "url(#dk)", l: "rgba(22,23,26,0.82)", r: "rgba(36,37,42,0.82)", st: "rgba(244,243,240,0.4)" }, op);
      let s = "";
      for (let i = 0; i < 7; i++) s += Ln(-80, -70 + i * 20, i % 2 ? 30 : 56, -70 + i * 20, 1, "rgba(233,228,207,0.28)");
      s += R(50, 40, 32, 32, "url(#pg)", "rgba(0,0,0,0.6)", 0.8, 3) + Ln(58, 56, 64, 62, 1.6, INK) + Ln(64, 62, 75, 48, 1.6, INK);
      CORN.concat([[0, -88], [0, 88], [88, 0], [-88, 0]]).forEach((c) => { s += C(c[0], c[1], 3.4, "#0A0A0A", "rgba(244,243,240,0.6)"); });
      o.push(G(mTop(z + 10), s, op));
    }
    const step = (L, s) => { if (A[L] < 0.02) return; o.push(G(mTop(Z[L] + TH[L] + 0.5), '<text x="-88" y="94" fill="' + (L === 0 || L === 3 ? "rgba(244,243,240,0.85)" : "rgba(244,243,240,0.9)") + '" font-family="IBM Plex Mono, monospace" font-size="10" letter-spacing="1.6">' + s + "</text>", A[L])); };
    posts(3, 2, CORN);
    // L2 Data
    if (A[2] < 0.02) ghost(2); else {
      const z = Z[2], op = A[2], zt = z + 6;
      box(-100, -100, z, 200, 200, 6, WH, op);
      o.push(G(mTop(zt), R(-84, -64, 58, 14, "rgba(255,255,255,0.16)", INK, 0.8, 7) + R(-84, -42, 58, 14, "rgba(255,255,255,0.16)", INK, 0.8, 7) + R(20, 84, 70, 8, "rgba(255,255,255,0.16)", INK, 0.8, 2) + C(-88, 88, 3, INK) + C(88, 88, 3, INK), op));
      box(58, -92, zt, 34, 62, 18, WH, op);
      ext(zt, 10, Pa(this.gear(-22, 34, 38, 31, 14, 10), null, null, 0.8, NS), "rgba(255,255,255,0.16)", "url(#pg)", INK, op);
      ext(zt + 10, 7, Pa(this.gear(-22, 34, 20, 16, 10, 5), null, null, 0.8, NS), "rgba(255,255,255,0.18)", "url(#gt)", INK, op);
      [22, 44, 66].forEach((x, i) => cyl(x, 64, zt, 8, 8 + i * 3, "rgba(255,255,255,0.16)", "url(#pg)", op));
    }
    posts(2, 1, CORN);
    // L1 Service
    if (A[1] < 0.02) ghost(1); else {
      const z = Z[1], op = A[1], zt = z + 6;
      ext(z, 6, Pa("M-100 -100 H100 V100 H-100 Z M-10 5 H55 V70 H-10 Z", null, null, 0.8, NS), "rgba(255,255,255,0.14)", "url(#gt)", INK, op);
      let c = R(-86, -86, 72, 60, "rgba(10,10,12,0.55)", INK) ;
      ["M-80 -78 H-60 V-66 H-38 V-80 H-22", "M-80 -64 H-68 V-50 H-46 V-58 H-20", "M-80 -38 H-56 V-32 H-30 V-46 H-18", "M-72 -54 V-36", "M-50 -80 V-72", "M-32 -74 H-24 V-62 H-34"].forEach((d) => { c += Pa(d, "none", "#E9E4CF", 1); });
      [[-60, -66], [-46, -58], [-30, -46], [-24, -62], [-72, -36]].forEach((p) => { c += C(p[0], p[1], 2, "#F3C9A8", "none"); });
      c += C(-88, -88, 2.4, INK) + C(88, 88, 2.4, INK) + C(88, -88, 2.4, INK) + C(-88, 88, 2.4, INK);
      o.push(G(mTop(zt), c, op));
      box(40, -92, zt, 50, 50, 14, WH, op);
      let fan = C(65, -67, 19, "url(#pg)", INK);
      for (let i = 0; i < 20; i++) { const an = i * Math.PI / 10; fan += Ln(65 + Math.cos(an) * 6, -67 + Math.sin(an) * 6, 65 + Math.cos(an + 0.35) * 18, -67 + Math.sin(an + 0.35) * 18, 0.8, INK); }
      fan += C(65, -67, 5, "rgba(255,255,255,0.85)", INK) + R(42, -90, 46, 46, "none", "rgba(26,25,23,0.35)");
      o.push(G(mTop(zt + 14), fan, op));
    }
    posts(1, 0, [[-88, -88], [48, -88], [48, 88], [-88, 88]]);
    // L0 Interface
    if (A[0] < 0.02) ghost(0); else {
      const z = Z[0], op = A[0], zt = z + 6;
      const d = "M-100 -100 H140 V-40 H60 V100 H-100 Z M-80 30 H-35 V75 H-80 Z M19 -45 A24 24 0 1 0 -29 -45 A24 24 0 1 0 19 -45 Z M75 -90 H130 V-80 H75 Z M75 -62 H130 V-52 H75 Z";
      ext(z, 6, Pa(d, null, null, 0.8, NS), "#0A0A0B", "url(#dk)", "rgba(244,243,240,0.55)", op);
      o.push(G(mTop(zt), Pa("M-93 -93 H133 V-47 H53 V93 H-93 Z", "none", "rgba(244,243,240,0.22)", 1) + C(-88, -88, 2.6, "rgba(255,255,255,0.75)") + C(-88, 88, 2.6, "rgba(255,255,255,0.75)") + C(48, 88, 2.6, "rgba(255,255,255,0.75)") + C(48, -88, 2.6, "rgba(255,255,255,0.75)") + C(-5, 0, 2.6, "rgba(255,255,255,0.75)"), op));
      const dz = zt + this.mix(44, -8, asm);
      const B1 = P(-5, -45, dz), B2 = P(-5, -45, zt), rx = 1.2247 * 22 * S;
      if (asm < 0.98) o.push('<g opacity="' + f(op * (1 - asm) * 0.8) + '" stroke="rgba(244,243,240,0.5)" stroke-dasharray="2 3"><line x1="' + f(B1[0] - rx) + '" y1="' + f(B1[1]) + '" x2="' + f(B2[0] - rx) + '" y2="' + f(B2[1]) + '"/><line x1="' + f(B1[0] + rx) + '" y1="' + f(B1[1]) + '" x2="' + f(B2[0] + rx) + '" y2="' + f(B2[1]) + '"/></g>');
      cyl(-5, -45, dz, 22, 10, "#101012", "url(#pg)", op);
      const sl = this.mix(26, -10, asm);
      ext(z, 6, Pa("M" + (150 + sl) + " -100 H" + (200 + sl) + " V-60 H" + (150 + sl) + " V-72 H" + (188 + sl) + " V-88 H" + (150 + sl) + " Z", null, null, 0.8, NS), "#0A0A0B", "url(#pg)", INK, op);
    }
    if (asm > 0) {
      const e1 = [P(-100, 100, 0), P(100, 100, 0), P(100, -100, 0)].map((q) => f(q[0]) + "," + f(q[1])).join(" ");
      const zt = Z[0] + 6;
      const e2 = [P(-100, 100, zt), P(60, 100, zt), P(60, -40, zt), P(140, -40, zt), P(140, -100, zt)].map((q) => f(q[0]) + "," + f(q[1])).join(" ");
      o.push('<polyline points="' + e1 + '" fill="none" stroke="url(#sg)" stroke-width="2.4" opacity="' + f(asm) + '"/><polyline points="' + e2 + '" fill="none" stroke="url(#sg)" stroke-width="2" opacity="' + f(asm) + '"/>');
    }

    // ---- front satellites
    const fv = vis(A[1]);
    card(-40, 290, 0, 150, 130,
      Ln(66, 16, 136, 16, 3.2) + Ln(66, 26, 120, 26, 3.2) + Ln(66, 36, 140, 36, 3.2) + Ln(66, 46, 128, 46, 3.2) + Ln(66, 56, 110, 56, 3.2) + Ln(66, 66, 134, 66, 3.2) +
      R(14, 22, 16, 16, "none", INK, 1) + R(14, 48, 16, 16, "url(#pg)", INK, 1) + '<polyline points="17,55 21,60 28,51" fill="none" stroke="' + INK + '" stroke-width="1.6"' + NS + '/>' + R(14, 74, 16, 16, "none", INK, 1) + R(14, 100, 16, 16, "none", INK, 1) +
      Ln(104, 110, 128, 110, 3.2) + Ln(40, 82, 56, 82, 3.2), fv);
    const em = this.sm(0.9, 1.0, t), iv = em, ex = -(1 - em) * 150, ey = -(1 - em) * 110;
    if (iv > 0.01) card(250 + ex, 40 + ey, -1, 130, 120, "", iv);
    if (iv > 0.01) card(150 + ex, 230 + ey, 0, 250, 170,
      R(0, 0, 250, 16, "rgba(10,10,12,0.6)", INK) + C(12, 8, 3.2, "rgba(255,255,255,0.85)") + C(23, 8, 3.2, "rgba(255,255,255,0.85)") + C(34, 8, 3.2, "rgba(255,255,255,0.85)") + R(172, 4, 66, 8, "rgba(255,255,255,0.85)", "none", 0.8, 4) +
      R(12, 94, 70, 60, "none", INK) + Ln(20, 104, 60, 104, 2) + Ln(20, 112, 70, 112, 2) + Ln(20, 120, 56, 120, 2) + Ln(20, 128, 66, 128, 2) + Ln(20, 136, 48, 136, 2) + R(92, 150, 60, 10, "none", INK) +
      R(92, 28, 52, 48, "none", INK) + '<text x="118" y="69" text-anchor="middle" font-family="Instrument Sans, Helvetica, sans-serif" font-size="42" font-weight="500" fill="' + INK + '">A</text>' +
      R(154, 28, 66, 66, "none", INK) + Ln(176, 28, 176, 94, 0.8) + Ln(198, 28, 198, 94, 0.8) + Ln(154, 50, 220, 50, 0.8) + Ln(154, 72, 220, 72, 0.8) +
      '<polyline points="182,36 187,42 192,36" fill="none" stroke="' + INK + '" stroke-width="1.6"' + NS + '/><polyline points="182,58 187,64 192,58" fill="none" stroke="' + INK + '" stroke-width="1.6"' + NS + '/>' +
      C(118, 122, 24, "rgba(255,255,255,0.85)", INK) + Pa("M118 122 L118 98 A24 24 0 0 1 138.8 110 Z", "url(#pg)", INK, 0.8) +
      R(160, 104, 74, 52, "none", INK) + Ln(160, 117, 234, 117, 0.8) + Ln(160, 130, 234, 130, 0.8) + Ln(160, 143, 234, 143, 0.8) + Ln(197, 104, 197, 156, 0.8) +
      Pa("M226 60 L226 82 L231 77 L235 86 L238 84 L234 76 L241 76 Z", INK, "rgba(255,255,255,0.85)", 1), iv);
    if (iv > 0.01) card(290 + ex, 250 + ey, 2, 90, 70, R(0, 0, 90, 14, "rgba(10,10,12,0.6)", INK) + C(10, 7, 2.8, "rgba(255,255,255,0.85)") + C(20, 7, 2.8, "rgba(255,255,255,0.85)") + C(30, 7, 2.8, "rgba(255,255,255,0.85)") + Ln(12, 30, 60, 30, 2) + Ln(12, 40, 48, 40, 2), iv);

    // ---- labels
    const lb = (w, s, op, anc, dx, dy) => { const q = P(w[0], w[1], w[2] || 0); label(q[0] + (dx || 0), q[1] + (dy || 0), s, op, anc); };
    lb([370, -90], "LP portal \u00b7 in production", this.sm(0.97, 1.0, t), "start", 16, 6);
    lb([-140, 170], "Prototype app", A[0], "middle", 0, 34);
    lb([-40, 290], "Fee spreadsheet", A[1], "end", -20, 20);
    lb([-270, 0, 88], "Shadow ledgers", A[2], "middle", 0, -44);
    lb([220, -230], "LPA + side letters", A[3], "start", 16, 6);
    return '<svg viewBox="0 0 720 600" width="720" height="600" style="position:absolute; inset:0; overflow:visible">' + o.join("") + "</svg>";
  }
  renderVals() { return { rgBox: this.rgBox, rgFrame: this.rgFrame }; }
}
