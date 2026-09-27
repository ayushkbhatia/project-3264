/*
 * AI Engineering hero: video veil. VERBATIM from reference/AI Engineering v2.dc.html.
 *
 * In the ported logic class (ai-engineering.logic.js):
 *   1. Replace the old initVeil() and stepVeil() with the two methods below.
 *   2. Delete buildGrey(). Nothing else calls it.
 *   3. Leave everything else as is: componentDidMount still calls this.initVeil(), tick() still calls
 *      this.stepVeil(ms), componentWillUnmount still calls this._veilOff().
 *
 * Refs (unchanged names): heroSec = the <section>, heroVeil = the <canvas>, heroImg = now the <video>.
 * State fields used: _vPts, _vReady, _vDirty, _vT, _veilOff.
 */

  // Hero veil: each frame the canvas redraws the current video frame in greyscale over the colour video; the pointer
  // erases soft watercolour blots that bleed outward and refill over ~2.4s, so colour shows along the trail.
  initVeil() {
    const sec = this.heroSec.current, cv = this.heroVeil.current, vid = this.heroImg.current;
    if (!sec || !cv || !vid) return;
    this._vPts = [];
    const still = () => !(this.props.motion ?? true) || !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    vid.muted = true; vid.loop = true; vid.playsInline = true;
    const go = () => { if (still()) { vid.pause(); return; } const p = vid.play(); if (p && p.catch) p.catch(() => {}); };
    vid.addEventListener("canplay", go);
    if (vid.readyState >= 3) go();
    const onMove = (e) => {
      if (!this._vReady || still()) return;
      const r = sec.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      const last = this._vPts[this._vPts.length - 1];
      if (last && Math.hypot(x - last.x, y - last.y) < 14) return;
      this._vPts.push({ x: x, y: y, t: performance.now(), s: Math.random() * 6.28, r: 53 + Math.random() * 31 });
      if (this._vPts.length > 90) this._vPts.shift();
    };
    sec.addEventListener("pointermove", onMove);
    this._veilOff = () => { sec.removeEventListener("pointermove", onMove); vid.removeEventListener("canplay", go); };
  }

  stepVeil(ms) {
    const sec = this.heroSec.current, cv = this.heroVeil.current, vid = this.heroImg.current;
    if (!sec || !cv || !vid || !this._vPts || vid.readyState < 2 || !vid.videoWidth) return;
    const box = sec.getBoundingClientRect();
    if (box.bottom < 0 || box.top > window.innerHeight) return;
    const cw = Math.max(1, sec.clientWidth), ch = Math.max(1, sec.clientHeight);
    let fresh = false;
    if (cv.width !== cw || cv.height !== ch) { cv.width = cw; cv.height = ch; fresh = true; }
    if (!this._vReady) { this._vReady = true; fresh = true; vid.style.filter = "none"; }
    const LIFE = 2400;
    this._vPts = this._vPts.filter((p) => ms - p.t < LIFE);
    const vt = vid.currentTime;
    if (!fresh && !this._vPts.length && !this._vDirty && vt === this._vT) return;
    this._vT = vt;
    this._vDirty = this._vPts.length > 0;
    const x = cv.getContext("2d");
    const k = Math.max(cw / vid.videoWidth, ch / vid.videoHeight), dw = vid.videoWidth * k, dh = vid.videoHeight * k;
    x.globalCompositeOperation = "source-over";
    x.clearRect(0, 0, cw, ch);
    x.drawImage(vid, (cw - dw) / 2, ch - dh, dw, dh);
    // desaturate in place: a zero-saturation fill in "saturation" mode keeps each pixel's luminosity (0.3R + 0.59G + 0.11B)
    x.globalCompositeOperation = "saturation";
    x.fillStyle = "#000";
    x.fillRect(0, 0, cw, ch);
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
