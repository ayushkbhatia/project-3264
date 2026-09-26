/*
 * AI Engineering page: intro, hero veil, 01 Premise stack, 02 Audit loop, 06 Engagement (spines, mini calendar, platform snippet).
 * VERBATIM logic class from the prototype (reference/). Port source, not a drop-in module.
 * It is a React class component minus render(): props, state, setState, lifecycle, refs via React.createRef(),
 * and renderVals(), whose keys feed the {{ holes }} in the template (reference/sections/*.html).
 * DEAD CODE (legacy; targets refs that are not in the template; delete when porting):
 *   iFmt, trackProg, findings, buildAudit, stepAudit, buildTiers, stepTiers, flowRows, buildFlow, stepFlow, three, hash, initHero, drawHero, initTopo, drawTopo, drawWash, rbBuild, stepRebuild,
 *   every rb*, topo*, tier*, flow*, hw*, auditHost, heroCv ref, the esm.sh three.js import, and the calls to them in
 *   componentDidMount (buildAudit, buildTiers, buildFlow), tick (drawWash, stepFlow, stepRebuild) and componentWillUnmount (GL cleanup).
 * LIVE: intro (maybeIntro, runIntro, iTeardown, skipIntro, iLift, iMarkIn, iClear, iEl), applyTheme, cl, sm, el, revealProg,
 *   hero veil (initVeil, buildGrey, stepVeil), Premise (stepWhatChanged, stepProduced, stepUnchanged, stepStack),
 *   Audit (auData, auPack, stepAuditLoop), Engagement (stepEngage, enJump, enQ, enRenderBuild, enCalendar, enGear, enBuildSVG),
 *   tick, renderVals, lifecycle.
 */

class Component extends DCLogic {
  constructor(p) {
    super(p);
    ["heroImg", "heroVeil", "rbTrack", "rbPin", "rbInner", "rbBox", "rbStage", "rbLines", "rbNodes", "rbHub", "rbTag", "rbData", "rbEv", "rbCap", "rbCnt", "rbC1", "rbC2", "rbC3", "rbC4", "auFit", "auStage", "auGrid", "auBars", "auPanel", "auCal", "auCells", "auWin", "auPane", "stackTrack", "wcCard", "wpCard", "wnCard", "heroCv", "auditHost", "topoTrack", "topoPin", "topoCv", "topoLabels", "topoCap", "topoCount",
     "tierList", "flowHost", "iWrap", "iStage", "iMark",
     "heroSec", "hwSharp", "hwSoft", "hwBloom", "hwVeil", "wcTrack", "wcText", "wcBar", "wcFit", "wcStage", "wnTrack", "wnText", "wnTiles", "wnFit", "wnStage", "wpTrack", "wpText", "wpFit", "wpStage", "wpPortal", "wpInsp", "enTrack", "enStage", "enA", "enB", "enAi", "enBi", "enAs", "enBs", "enAx", "enBx", "enCal", "enBld"].forEach((k) => { this[k] = React.createRef(); });
    this.iTimers = [];
    this.iIvals = [];
    this.skipIntro = this.skipIntro.bind(this);
  }

  componentDidMount() {
    this.maybeIntro();
    this.applyTheme();
    this.buildAudit();
    this.buildTiers();
    this.buildFlow();
    this.raf = requestAnimationFrame(this.tick);
    this.initVeil();
  }
  componentDidUpdate(pp, ps) {
    this.applyTheme();
    const el = this.auPane.current;
    if (ps && this.state && ps.auJ !== this.state.auJ && el && el.animate)
      el.animate([{ opacity: 0.35, transform: "translateY(4px)" }, { opacity: 1, transform: "none" }], { duration: 260, easing: "cubic-bezier(.16,1,.3,1)" });
  }
  componentWillUnmount() {
    if (this._veilOff) this._veilOff();
    if (this.raf) cancelAnimationFrame(this.raf);
    [this.heroGL, this.topoGL].forEach((g) => { if (g && g.r) g.r.dispose(); });
    this.iClear();
    if (this._iKey) window.removeEventListener("keydown", this._iKey);
  }

  iClear() {
    this.iTimers.forEach(clearTimeout); this.iTimers = [];
    this.iIvals.forEach(clearInterval); this.iIvals = [];
  }

  maybeIntro() {
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if ((this.props.playIntro ?? true) && !reduced) this.runIntro();
  }

  iEl(css, text) {
    const n = document.createElement("div");
    n.style.cssText = css;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  iFmt(n) { return n.toLocaleString("en-US"); }

  // The overlay stops swallowing clicks the moment the intro is logically over, and
  // hiding runs once from whichever of onfinish / timeout arrives first, so a missed
  // onfinish can never leave the page sealed behind the intro.
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

    const steps = ["map the workflow", "build the pipeline", "evaluate accuracy", "deploy to production"];
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
    foot.appendChild(this.iEl("", "4 capabilities live"));
    foot.appendChild(this.iEl("font-variant-numeric:tabular-nums", "week 06"));
    box.appendChild(foot);
    foot.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 440, delay: 2060, fill: "forwards" });

    this.iTimers.push(setTimeout(() => {
      box.animate([{ opacity: 1, transform: "translate(-50%,-50%) scale(1)" }, { opacity: 0, transform: "translate(-50%,-50%) scale(.985)" }],
        { duration: 620, easing: "ease", fill: "forwards" });
    }, 2560));

    this.iMarkIn(mark, 3020);
    this.iLift(wrap, 4260);
  }

  applyTheme() {
    const s = document.body.style;
    s.setProperty("--a", this.props.accent ?? "#157F52");
    s.setProperty("--tex", (this.props.gridTexture ?? true) ? "1" : "0");
  }

  cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  sm(a, b, x) { const t = this.cl((x - a) / (b - a)); return t * t * (3 - 2 * t); }
  el(tag, css, txt) { const n = document.createElement(tag); n.style.cssText = css; if (txt !== undefined) n.textContent = txt; return n; }

  // A section's own reveal window: its top edge travelling from 82% to 28% of the viewport.
  // Height-independent, so a tall module and a short one read at the same pace.
  revealProg(node) {
    if (!node) return 0;
    const r = node.getBoundingClientRect(), vh = window.innerHeight || 800;
    return this.cl((vh * 0.82 - r.top) / (vh * 0.54));
  }
  trackProg(track, pin) {
    if (!track || !pin) return 0;
    const r = track.getBoundingClientRect();
    const span = r.height - pin.offsetHeight;
    return span > 0 ? this.cl(-r.top / span) : 0;
  }

  // ---------- 02 Audit: findings resolving into a disposition ----------
  findings() {
    return [
      { n: "Database credentials committed to source", sev: "Critical", d: "Rebuild" },
      { n: "Any signed-in user can read any fund's records", sev: "Critical", d: "Rebuild" },
      { n: "Investor PII written to model prompt logs", sev: "Critical", d: "Rebuild" },
      { n: "Browser connects directly to the database", sev: "High", d: "Rebuild" },
      { n: "No audit log; actions cannot be attributed", sev: "High", d: "Rebuild" },
      { n: "Fee logic duplicated across three screens", sev: "High", d: "Rebuild" },
      { n: "No isolation between funds", sev: "High", d: "Rebuild" },
      { n: "NAV calculation has no tests", sev: "Medium", d: "Rebuild" },
      { n: "Dependencies unpinned", sev: "Medium", d: "Rebuild" },
      { n: "Screen layout, field names and workflow model", sev: "Sound", d: "Keep" },
      { n: "Parallel spreadsheet kept alongside the app", sev: "Redundant", d: "Retire" }
    ];
  }

  buildAudit() {
    const host = this.auditHost.current;
    if (!host) return;
    host.textContent = "";
    const F = this.findings();
    const head = this.el("div", "display:flex; align-items:baseline; justify-content:space-between; gap:16px; padding:22px 24px 18px; border-bottom:1px solid var(--line2)");
    const hl = this.el("div", "min-width:0");
    hl.appendChild(this.el("div", "font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:11.5px; letter-spacing:0.04em; text-transform:uppercase; color:var(--mut)", "Component audit \u00b7 fund operations tool"));
    const headline = this.el("div", "margin:8px 0 0; font-size:18px; letter-spacing:-0.022em", "Reading the codebase\u2026");
    hl.appendChild(headline);
    head.appendChild(hl);
    const counter = this.el("div", "flex:none; font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:11.5px; color:var(--mut); font-variant-numeric:tabular-nums", "0 / " + F.length);
    head.appendChild(counter);
    host.appendChild(head);

    const list = this.el("div", "padding:4px 24px 0");
    const rows = F.map((f) => {
      const sevFg = f.sev === "Critical" ? "var(--bad)" : f.sev === "High" ? "#1A1917" : f.sev === "Sound" ? "var(--a)" : "var(--mut)";
      const row = this.el("div", "display:flex; align-items:center; gap:16px; padding:11px 0; border-top:1px solid var(--line2); opacity:0; transform:translateY(6px); transition:opacity .34s ease, transform .34s ease");
      const sev = this.el("div", "flex:none; width:76px; font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10.5px; letter-spacing:0.04em; text-transform:uppercase; color:" + sevFg, f.sev);
      const nm = this.el("div", "flex:1; min-width:0; font-size:14.5px; letter-spacing:-0.012em; overflow:hidden; text-overflow:ellipsis; white-space:nowrap", f.n);
      const dTint = f.d === "Rebuild" ? "rgba(196,52,30,0.08)" : f.d === "Keep" ? "rgba(21,127,82,0.09)" : "rgba(20,20,18,0.06)";
      const dFg = f.d === "Rebuild" ? "var(--bad)" : f.d === "Keep" ? "var(--a)" : "var(--mut)";
      const disp = this.el("div", "flex:none; padding:3px 9px 4px; background:" + dTint + "; color:" + dFg + "; font-size:11.5px; letter-spacing:0.01em", f.d);
      row.appendChild(sev); row.appendChild(nm); row.appendChild(disp);
      list.appendChild(row);
      return { row: row, f: f };
    });
    host.appendChild(list);

    const foot = this.el("div", "display:flex; align-items:baseline; justify-content:space-between; gap:20px; flex-wrap:wrap; margin:16px 0 0; padding:18px 24px 22px; background:#FBFAF8; border-top:1px solid var(--line2)");
    const buckets = ["Keep", "Rebuild", "Retire"].map((k) => {
      const col = this.el("div", "min-width:120px");
      const fg = k === "Rebuild" ? "var(--bad)" : k === "Keep" ? "var(--a)" : "var(--mut)";
      col.appendChild(this.el("div", "font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10.5px; letter-spacing:0.04em; text-transform:uppercase; color:var(--mut)", k));
      const val = this.el("div", "margin:5px 0 0; font-size:22px; font-variant-numeric:tabular-nums; letter-spacing:-0.02em; color:" + fg, "0");
      col.appendChild(val);
      foot.appendChild(col);
      return { k: k, val: val };
    });
    const note = this.el("div", "flex:1 1 260px; min-width:0; font-size:13.5px; line-height:1.55; color:var(--sec); text-wrap:pretty", "");
    foot.appendChild(note);
    host.appendChild(foot);

    this._au = { rows: rows, headline: headline, counter: counter, buckets: buckets, note: note, step: -1 };
  }

  stepAudit(p) {
    const a = this._au;
    if (!a) return;
    const total = a.rows.length;
    const step = Math.round(this.cl(p) * total);
    if (step === a.step) return;
    a.step = step;
    const tally = { Keep: 0, Rebuild: 0, Retire: 0 };
    a.rows.forEach((r, i) => {
      const on = i < step;
      r.row.style.opacity = on ? "1" : "0";
      r.row.style.transform = on ? "none" : "translateY(6px)";
      if (on) tally[r.f.d]++;
    });
    a.counter.textContent = step + " / " + total;
    a.headline.textContent = step >= total ? "Disposition complete" : "Reading the codebase\u2026";
    a.buckets.forEach((b) => { b.val.textContent = String(tally[b.k]); });
    a.note.textContent = step >= total
      ? "The interface survives. Everything that touches data, identity or money is rebuilt, and the shadow spreadsheet goes."
      : step > 0 ? "Findings are written up per component as they are confirmed." : "";
  }

  // ---------- 03 tier list beside the topology ----------
  buildTiers() {
    const host = this.tierList.current;
    if (!host) return;
    host.textContent = "";
    host.style.cssText = "margin:32px 0 0; position:relative; padding-left:30px";
    const T = [
      ["Interface", "the screens your team already knows, unchanged"],
      ["Service", "logic moved out of the browser, versioned and tested"],
      ["Data", "one schema, one access path, row-level rules per fund"],
      ["Evidence", "every read and write recorded, with the actor attached"]
    ];
    host.appendChild(this.el("div", "position:absolute; left:6px; top:14px; bottom:16px; width:1px; background:var(--line)"));
    const railFill = this.el("div", "position:absolute; left:6px; top:14px; width:1px; height:0%; background:var(--a)");
    host.appendChild(railFill);

    this._tiers = T.map((t, i) => {
      const row = this.el("div", "position:relative; padding:11px 0; border-top:1px solid var(--line2)");
      const dot = this.el("div", "position:absolute; left:-30px; top:14px; width:13px; height:13px; border-radius:50%; border:1px solid var(--line); background:#F6F5F2; transition:border-color .35s ease");
      const core = this.el("div", "position:absolute; inset:2px; border-radius:50%; background:var(--a); transform:scale(0); transition:transform .35s ease");
      dot.appendChild(core);
      const top = this.el("div", "display:flex; align-items:baseline; gap:12px");
      const idx = this.el("span", "flex:none; font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10.5px; color:var(--mut)", "T" + (i + 1));
      const nm = this.el("div", "flex:1 1 auto; min-width:0; font-size:15px; letter-spacing:-0.015em; color:var(--mut); transition:color .35s ease", t[0]);
      const st = this.el("div", "flex:none; font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10px; letter-spacing:0.04em; text-transform:uppercase; color:var(--mut); transition:color .35s ease", "pending");
      top.appendChild(idx); top.appendChild(nm); top.appendChild(st);
      const de = this.el("div", "margin:4px 0 0; font-size:13.5px; line-height:1.45; color:var(--mut); opacity:0.55; transition:opacity .35s ease", t[1]);
      row.appendChild(dot); row.appendChild(top); row.appendChild(de);
      host.appendChild(row);
      return { row: row, dot: dot, core: core, nm: nm, st: st, de: de, last: -1 };
    });
    this._railFill = railFill;
    this._railHost = host;
  }

  // Walks T1 to T4 off the same arrival values that move the nodes, so the list and the
  // object can never disagree about which tier is landing.
  stepTiers(arrive) {
    const rows = this._tiers;
    if (!rows) return;
    let sum = 0;
    rows.forEach((r, i) => {
      const e = arrive[i];
      sum += e;
      const state = e < 0.02 ? 0 : e < 0.97 ? 1 : 2;
      r.core.style.transform = "scale(" + e.toFixed(3) + ")";
      if (state === r.last) return;
      r.last = state;
      r.dot.style.borderColor = state ? "var(--a)" : "var(--line)";
      r.nm.style.color = state ? "#1A1917" : "var(--mut)";
      r.de.style.opacity = state === 2 ? "1" : state === 1 ? "0.8" : "0.55";
      r.st.textContent = state === 2 ? "in place" : state === 1 ? "laying" : "pending";
      r.st.style.color = state === 2 ? "var(--a)" : state === 1 ? "#1A1917" : "var(--mut)";
    });
    // sized in px against the rail's own span: a percentage would overshoot by its 14px inset
    if (this._railFill && this._railHost) {
      const span = Math.max(0, this._railHost.clientHeight - 30);
      this._railFill.style.height = (span * sum / rows.length).toFixed(1) + "px";
    }
  }

  // ---------- 04 Platform: the operation as it runs, then platformed ----------
  flowRows() {
    return [
      { s: "Intake",   a: "Notice received by email",              ah: 0.5, an: 1, ar: "no record",    b: "Ingested and deduplicated",        bh: 0,   bn: 0 },
      { s: "Capture",  a: "Amounts keyed into the spreadsheet",    ah: 2.0, an: 2, ar: "re-key risk",  b: "Extracted with citations",         bh: 0,   bn: 0 },
      { s: "Check",    a: "Allocation checked against commitments", ah: 1.5, an: 1, ar: "in someone's head", b: "Tied to the commitment schedule", bh: 0.2, bn: 1 },
      { s: "Assemble", a: "Investor letters assembled by hand",    ah: 3.0, an: 2, ar: "version drift", b: "Generated from one template",     bh: 0,   bn: 0 },
      { s: "Approve",  a: "Approval over email",                   ah: 1.0, an: 3, ar: "no record",    b: "Approved in-app",                  bh: 0.2, bn: 1 },
      { s: "File",     a: "Filed to the shared drive",             ah: 0.5, an: 1, ar: "no trail",     b: "Written to fund accounting",       bh: 0,   bn: 0 }
    ];
  }

  buildFlow() {
    const host = this.flowHost.current;
    if (!host) return;
    host.textContent = "";
    const R = this.flowRows(), MAXH = 3.0;
    const head = this.el("div", "display:flex; align-items:baseline; justify-content:space-between; gap:16px; padding:22px 24px 18px; border-bottom:1px solid var(--line2)");
    const hl = this.el("div", "min-width:0");
    hl.appendChild(this.el("div", "font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:11.5px; letter-spacing:0.04em; text-transform:uppercase; color:var(--mut)", "Capital call processing \u00b7 one cycle"));
    const headline = this.el("div", "margin:8px 0 0; font-size:18px; letter-spacing:-0.022em", "As it runs today");
    hl.appendChild(headline);
    head.appendChild(hl);
    const stat = this.el("div", "flex:none; text-align:right");
    const hrs = this.el("div", "font-size:22px; font-variant-numeric:tabular-nums; letter-spacing:-0.02em", "8.5 hrs");
    const sub = this.el("div", "margin:3px 0 0; font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10.5px; color:var(--mut)", "of human time");
    stat.appendChild(hrs); stat.appendChild(sub);
    head.appendChild(stat);
    host.appendChild(head);

    const list = this.el("div", "padding:6px 24px 0");
    const rows = R.map((r) => {
      const row = this.el("div", "display:flex; align-items:center; gap:16px; padding:12px 0; border-top:1px solid var(--line2)");
      const st = this.el("div", "flex:none; width:70px; font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:10.5px; letter-spacing:0.04em; text-transform:uppercase; color:var(--mut)", r.s);
      const lbl = this.el("div", "flex:1 1 auto; min-width:0; font-size:14.5px; letter-spacing:-0.012em; overflow:hidden; text-overflow:ellipsis; white-space:nowrap", r.a);
      const track = this.el("div", "flex:0 0 132px; height:6px; background:rgba(20,20,18,0.07)");
      const fill = this.el("div", "height:6px; width:" + (r.ah / MAXH * 100) + "%; background:var(--bad); transition:background .4s ease");
      track.appendChild(fill);
      const hands = this.el("div", "flex:none; width:64px; text-align:right; font-size:13px; font-variant-numeric:tabular-nums; color:var(--sec)", r.an + (r.an === 1 ? " hand" : " hands"));
      const rec = this.el("div", "flex:none; width:118px; text-align:right; font-size:12px; color:var(--bad)", r.ar);
      row.appendChild(st); row.appendChild(lbl); row.appendChild(track); row.appendChild(hands); row.appendChild(rec);
      list.appendChild(row);
      return { row: row, lbl: lbl, fill: fill, hands: hands, rec: rec, r: r, on: false };
    });
    host.appendChild(list);

    const foot = this.el("div", "display:flex; align-items:baseline; justify-content:space-between; gap:20px; flex-wrap:wrap; margin:16px 0 0; padding:18px 24px 22px; background:#FBFAF8; border-top:1px solid var(--line2)");
    // left empty on purpose \u2014 stepFlow derives both from the rows on the first frame
    const fl = this.el("div", "flex:1 1 300px; min-width:0; font-size:13.5px; line-height:1.55; color:var(--sec); text-wrap:pretty", "");
    const fr = this.el("div", "flex:none; font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:11.5px; color:var(--mut); font-variant-numeric:tabular-nums", "");
    foot.appendChild(fl); foot.appendChild(fr);
    host.appendChild(foot);

    this._fl = { rows: rows, headline: headline, hrs: hrs, sub: sub, fl: fl, fr: fr, maxh: MAXH, last: -1 };
  }

  stepFlow(p) {
    const f = this._fl;
    if (!f) return;
    const t = this.cl(p);
    if (Math.abs(t - f.last) < 0.004) return;
    f.last = t;
    let hours = 0, hands = 0, gaps = 0, done = 0;
    f.rows.forEach((row, i) => {
      // staggered crossover so the operation converts top-down rather than all at once
      const u = this.sm(0.22 + i * 0.085, 0.42 + i * 0.085, t);
      const r = row.r;
      const h = r.ah + (r.bh - r.ah) * u;
      const n = r.an + (r.bn - r.an) * u;
      hours += h;
      hands += n;
      const flipped = u > 0.5;
      if (flipped) done++; else gaps++;
      if (flipped !== row.on) {
        row.on = flipped;
        row.lbl.textContent = flipped ? r.b : r.a;
        row.rec.textContent = flipped ? "recorded" : r.ar;
        row.rec.style.color = flipped ? "var(--a)" : "var(--bad)";
        row.fill.style.background = flipped ? "var(--a)" : "var(--bad)";
      }
      row.fill.style.width = Math.max(1.5, h / f.maxh * 100) + "%";
      const nr = Math.round(n);
      row.hands.textContent = nr === 0 ? "automatic" : nr + (nr === 1 ? " hand" : " hands");
    });
    f.hrs.textContent = hours.toFixed(1) + " hrs";
    f.headline.textContent = t > 0.94 ? "Platformed" : t < 0.06 ? "As it runs today" : "Platformising\u2026";
    f.fr.textContent = Math.round(hands) + " handoffs \u00b7 " + gaps + (gaps === 1 ? " gap" : " gaps");
    f.fl.textContent = gaps === 0
      ? "Two recorded approvals, no gaps. Everything else runs without a person and leaves a trail."
      : Math.round(hands) + " handoffs, " + gaps + (gaps === 1 ? " point" : " points") + " where the record stops existing.";
  }

  // ---------- GL ----------
  async three() {
    if (!this._T) { try { this._T = await import("https://esm.sh/three@0.161.0"); } catch (e) { return null; } }
    return this._T;
  }
  hash(i) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }

  async initHero() {
    const T = await this.three(), cv = this.heroCv.current;
    if (!T || !cv) return;
    const scene = new T.Scene();
    const cam = new T.PerspectiveCamera(38, 1, 0.1, 100);
    const r = new T.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
    r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    const N = 42, base = [];
    for (let i = 0; i < N; i++) {
      const a = this.hash(i) * Math.PI * 2, b = Math.acos(2 * this.hash(i + 90) - 1);
      const rad = 1.1 + this.hash(i + 300) * 0.95;
      base.push(rad * Math.sin(b) * Math.cos(a), rad * Math.sin(b) * Math.sin(a), rad * Math.cos(b));
    }
    const pg = new T.BufferGeometry();
    pg.setAttribute("position", new T.Float32BufferAttribute(base.slice(), 3));
    scene.add(new T.Points(pg, new T.PointsMaterial({ color: 0x1a1917, size: 0.055, sizeAttenuation: true, transparent: true, opacity: 0.62 })));
    const pairs = [];
    for (let i = 0; i < N; i++) {
      const j = Math.floor(this.hash(i + 700) * N), k = Math.floor(this.hash(i + 1400) * N);
      if (j !== i) pairs.push(i, j);
      if (k !== i && this.hash(i + 2100) > 0.55) pairs.push(i, k);
    }
    const lg = new T.BufferGeometry();
    lg.setAttribute("position", new T.Float32BufferAttribute(new Float32Array(pairs.length * 3), 3));
    scene.add(new T.LineSegments(lg, new T.LineBasicMaterial({ color: 0x1a1917, transparent: true, opacity: 0.17 })));
    this.heroGL = { T: T, scene: scene, cam: cam, r: r, pg: pg, lg: lg, base: base, pairs: pairs, cv: cv };
  }

  drawHero(time) {
    const g = this.heroGL;
    if (!g) return;
    const w = g.cv.clientWidth, h = g.cv.clientHeight;
    if (!w || !h) return;
    if (w !== g.w || h !== g.h) { g.w = w; g.h = h; g.cam.aspect = w / h; g.cam.updateProjectionMatrix(); g.r.setSize(w, h, false); }
    const pa = g.pg.attributes.position.array, b = g.base;
    for (let i = 0; i < pa.length; i += 3) {
      const s = i * 0.37;
      pa[i] = b[i] + Math.sin(time * 0.36 + s) * 0.075;
      pa[i + 1] = b[i + 1] + Math.sin(time * 0.29 + s * 1.4) * 0.075;
      pa[i + 2] = b[i + 2] + Math.cos(time * 0.33 + s * 0.8) * 0.075;
    }
    g.pg.attributes.position.needsUpdate = true;
    const la = g.lg.attributes.position.array;
    for (let e = 0; e < g.pairs.length; e += 2) {
      const A = g.pairs[e] * 3, B = g.pairs[e + 1] * 3, o = (e / 2) * 6;
      la[o] = pa[A]; la[o + 1] = pa[A + 1]; la[o + 2] = pa[A + 2];
      la[o + 3] = pa[B]; la[o + 4] = pa[B + 1]; la[o + 5] = pa[B + 2];
    }
    g.lg.attributes.position.needsUpdate = true;
    const az = time * 0.075;
    g.cam.position.set(Math.sin(az) * 5.6, 1.05 + Math.sin(time * 0.14) * 0.3, Math.cos(az) * 5.6);
    g.cam.lookAt(0, 0, 0);
    g.r.render(g.scene, g.cam);
  }

  async initTopo() {
    const T = await this.three(), cv = this.topoCv.current;
    if (!T || !cv) return;
    const TIER = 4, PER = 6, N = TIER * PER;
    const proto = [], prod = [];
    for (let i = 0; i < TIER; i++) {
      for (let j = 0; j < PER; j++) {
        const k = i * PER + j;
        prod.push((j - (PER - 1) / 2) * 0.86, 1.55 - i * 1.02, ((j % 2) - 0.5) * 0.28);
        const a = this.hash(k) * Math.PI * 2, b = Math.acos(2 * this.hash(k + 55) - 1), rad = 0.6 + this.hash(k + 210) * 1.5;
        proto.push(rad * Math.sin(b) * Math.cos(a), rad * Math.sin(b) * Math.sin(a) * 0.8, rad * Math.cos(b));
      }
    }
    const legal = [];
    for (let i = 0; i < TIER - 1; i++) {
      for (let j = 0; j < PER; j++) legal.push(i * PER + j, (i + 1) * PER + j);
      if (i < 2) for (let j = 0; j < PER - 1; j += 2) legal.push(i * PER + j, (i + 1) * PER + j + 1);
    }
    const illegal = [];
    [[0, 2, 5], [0, 3, 4], [1, 3, 4]].forEach((spec) => {
      for (let m = 0; m < spec[2]; m++) {
        const j = Math.floor(this.hash(spec[0] * 31 + spec[1] * 7 + m) * PER);
        const j2 = Math.floor(this.hash(spec[0] * 91 + spec[1] * 13 + m + 5) * PER);
        illegal.push(spec[0] * PER + j, spec[1] * PER + j2);
      }
    });

    const scene = new T.Scene();
    const cam = new T.PerspectiveCamera(40, 1.5, 0.1, 200);
    const r = new T.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
    r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    const pg = new T.BufferGeometry();
    pg.setAttribute("position", new T.Float32BufferAttribute(proto.slice(), 3));
    const pm = new T.PointsMaterial({ color: 0x1a1917, size: 0.075, sizeAttenuation: true, transparent: true, opacity: 0.82 });
    scene.add(new T.Points(pg, pm));
    const mk = (pairs, col, op) => {
      const g2 = new T.BufferGeometry();
      g2.setAttribute("position", new T.Float32BufferAttribute(new Float32Array(pairs.length * 3), 3));
      const m = new T.LineBasicMaterial({ color: col, transparent: true, opacity: op });
      scene.add(new T.LineSegments(g2, m));
      return { g: g2, m: m, pairs: pairs };
    };
    const okL = mk(legal, 0x1a1917, 0.22);
    const badL = mk(illegal, 0xc4341e, 0.3);

    const labels = this.topoLabels.current;
    let labEls = [];
    if (labels) {
      labels.textContent = "";
      labEls = ["Interface", "Service", "Data", "Evidence"].map((t) => {
        const n = this.el("div", "position:absolute; left:0; top:0; opacity:0; transform:translateY(-50%); font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:11px; letter-spacing:0.06em; text-transform:uppercase; color:var(--mut); white-space:nowrap; transition:opacity .45s ease", t);
        labels.appendChild(n);
        return n;
      });
    }
    this.topoGL = { T: T, scene: scene, cam: cam, r: r, pg: pg, pm: pm, okL: okL, badL: badL,
      proto: proto, prod: prod, TIER: TIER, PER: PER, labEls: labEls, cv: cv, illegalCount: illegal.length / 2 };
  }

  drawTopo(t, time) {
    const g = this.topoGL;
    if (!g) return;
    const w = g.cv.clientWidth, h = g.cv.clientHeight;
    if (!w || !h) return;
    if (w !== g.w || h !== g.h) { g.w = w; g.h = h; g.cam.aspect = w / h; g.cam.updateProjectionMatrix(); g.r.setSize(w, h, false); }
    const pa = g.pg.attributes.position.array;
    const arrive = [];
    for (let i = 0; i < g.TIER; i++) arrive.push(this.sm(0.20 + i * 0.14, 0.48 + i * 0.14, t));
    const wob = (1 - t) * 0.1;
    for (let i = 0; i < g.TIER; i++) {
      const e = arrive[i];
      for (let j = 0; j < g.PER; j++) {
        const k = (i * g.PER + j) * 3;
        for (let c = 0; c < 3; c++) {
          const from = g.proto[k + c], to = g.prod[k + c];
          pa[k + c] = from + (to - from) * e + Math.sin(time * 0.5 + k + c * 2.1) * wob;
        }
      }
    }
    g.pg.attributes.position.needsUpdate = true;
    [g.okL, g.badL].forEach((L) => {
      const la = L.g.attributes.position.array;
      for (let e = 0; e < L.pairs.length; e += 2) {
        const A = L.pairs[e] * 3, B = L.pairs[e + 1] * 3, o = (e / 2) * 6;
        la[o] = pa[A]; la[o + 1] = pa[A + 1]; la[o + 2] = pa[A + 2];
        la[o + 3] = pa[B]; la[o + 4] = pa[B + 1]; la[o + 5] = pa[B + 2];
      }
      L.g.attributes.position.needsUpdate = true;
    });
    // the illegal paths flare, then are removed \u2014 the moment the argument lands
    const flare = this.sm(0.30, 0.44, t), gone = this.sm(0.46, 0.62, t);
    g.badL.m.opacity = (0.22 + flare * 0.5) * (1 - gone);
    g.okL.m.opacity = 0.18 + this.sm(0.3, 0.9, t) * 0.16;

    const az = (1 - t) * 0.72 + Math.sin(time * 0.1) * 0.12 * (1 - t);
    const el = 0.5 - t * 0.42;
    // Frame on BOTH extents: a portrait stage pulls the camera back instead of cropping
    // the outer columns off the tiers. halfW covers the node span plus the label anchor.
    // Frames the NODES only (labels are placed in DOM, so they cost no world margin):
    // a portrait stage pulls back rather than cropping, and fills rather than over-padding.
    const half = Math.tan((g.cam.fov * Math.PI / 180) / 2);
    const rad = Math.max(1.85 / half, 2.25 / (half * (w / h))) * (1.03 - t * 0.02);
    g.cam.position.set(Math.sin(az) * rad, el * 2.1, Math.cos(az) * rad);
    g.cam.lookAt(0, 0, 0);
    g.r.render(g.scene, g.cam);

    if (g.labEls.length) {
      const v = new g.T.Vector3();
      g.labEls.forEach((n, i) => {
        // right-anchored in DOM: only the tier's Y is projected, so labels stay beside
        // their rows at every aspect instead of all pinning to one clamped x
        v.set(0, g.prod[(i * g.PER) * 3 + 1], 0).project(g.cam);
        n.style.right = "14px";
        n.style.top = (-v.y * 0.5 + 0.5) * h + "px";
        n.style.opacity = String(arrive[i] > 0.6 ? 1 : 0);
      });
    }
    this.stepTiers(arrive);
    const cap = this.topoCap.current, cnt = this.topoCount.current;
    if (cap) cap.textContent = t > 0.72 ? "Production topology" : t > 0.34 ? "Re-laying the paths" : "Prototype topology";
    if (cnt) {
      const removed = Math.round(gone * g.illegalCount);
      const paths = g.okL.pairs.length / 2 + (g.illegalCount - removed);
      cnt.textContent = "24 nodes \u00b7 " + paths + " paths" + (removed ? " \u00b7 " + removed + " removed" : "");
    }
  }

  // The wash is three copies of one painting at different blur radii. Scrolling
  // pulls them apart at different rates and lets the pigment spread, so the
  // colour keeps bleeding while the cream veil reclaims the page underneath.
  drawWash(time) {
    const sec = this.heroSec.current;
    if (!sec) return;
    const r = sec.getBoundingClientRect();
    if (!r.height) return;
    const p = Math.max(0, Math.min(1, -r.top / r.height));
    const still = (this.props.motion ?? true) ? 1 : 0;
    const drift = Math.sin(time * 0.11) * still;
    const swell = Math.sin(time * 0.074 + 1.3) * still;

    const sharp = this.hwSharp.current;
    if (sharp) {
      sharp.style.transform = "translate3d(" + (drift * 9 - p * 26).toFixed(2) + "px," +
        (-p * 46).toFixed(2) + "px,0) scale(" + (1.02 + p * 0.07 + swell * 0.006).toFixed(4) + ")";
      sharp.style.opacity = (1 - p * 0.42).toFixed(3);
    }
    const soft = this.hwSoft.current;
    if (soft) {
      soft.style.transform = "translate3d(" + (p * 44 - drift * 13).toFixed(2) + "px," +
        (p * 30).toFixed(2) + "px,0) scale(" + (1.04 + p * 0.13).toFixed(4) + ")";
      soft.style.filter = "blur(" + (28 + p * 30 + swell * 4).toFixed(1) + "px) saturate(" + (1 + p * 0.24).toFixed(3) + ")";
      soft.style.opacity = (0.64 + p * 0.26).toFixed(3);
    }
    const bloom = this.hwBloom.current;
    if (bloom) {
      bloom.style.transform = "translate3d(" + (drift * 26 + p * 74).toFixed(2) + "px," +
        (swell * 20 - p * 16).toFixed(2) + "px,0) scale(" + (1 + p * 0.3).toFixed(4) + ") rotate(" + (drift * 2.2 - p * 4).toFixed(2) + "deg)";
      bloom.style.filter = "blur(" + (70 + p * 46).toFixed(1) + "px) saturate(" + (1.16 + p * 0.3).toFixed(3) + ")";
      bloom.style.opacity = (0.52 + p * 0.24).toFixed(3);
    }
    const veil = this.hwVeil.current;
    if (veil) {
      const a = 0.48 + p * 0.2;
      veil.style.background = "linear-gradient(" + (100 - p * 7).toFixed(1) + "deg, rgba(246,245,242," + a.toFixed(3) +
        ") 0%, rgba(246,245,242," + (a + 0.04).toFixed(3) + ") 38%, rgba(246,245,242," + Math.min(0.9, a + 0.22).toFixed(3) +
        ") 64%, rgba(246,245,242," + Math.min(0.95, a + 0.36).toFixed(3) + ") 100%)";
    }
  }

  // What changed: words go from 16% to full ink as the pinned stage scrolls through.
  // Each word takes ~2.5 word-slots to fill so the edge reads as a soft front.
  stepWhatChanged(p) {
    const fit = this.wcFit.current, stage = this.wcStage.current;
    if (fit && stage) {
      const w = fit.clientWidth, hh = fit.clientHeight;
      if (w !== this._wcW || hh !== this._wcH) {
        this._wcW = w; this._wcH = hh;
        const s = Math.min(1.15, w / 600, hh / 470);
        stage.style.transform = "translate(" + ((w - 600 * s) / 2).toFixed(1) + "px," + ((hh - 470 * s) / 2).toFixed(1) + "px) scale(" + s.toFixed(4) + ")";
      }
    }
    const txt = this.wcText.current;
    if (!txt) return;
    if (p === this._wcP) return;
    this._wcP = p;
    const ws = txt.children, N = ws.length, soft = 2.5, head = p * (N + soft);
    for (let i = 0; i < N; i++) {
      const u = this.cl((head - i) / soft);
      ws[i].style.opacity = (0.16 + 0.84 * u).toFixed(3);
    }
    const bar = this.wcBar.current;
    if (bar && bar.firstElementChild) bar.firstElementChild.style.transform = "scaleX(" + p.toFixed(4) + ")";
  }

  // What that produced: the portal lands (.04-.18) and holds, then gives way (.42-.56) to the
  // network finding, which arrives complete and static. The headline finishes as the finding lands.
  stepProduced(p) {
    const fit = this.wpFit.current, stage = this.wpStage.current;
    if (fit && stage) {
      const w = fit.clientWidth, hh = fit.clientHeight;
      if (w !== this._wpW || hh !== this._wpH) {
        this._wpW = w; this._wpH = hh;
        const s = Math.min(w / 760, hh / 600);
        stage.style.transform = "translate(" + ((w - 760 * s) / 2).toFixed(1) + "px," + ((hh - 600 * s) / 2).toFixed(1) + "px) scale(" + s.toFixed(4) + ")";
      }
    }
    if (p === this._wpP) return;
    this._wpP = p;
    const END = 0.56;
    const txt = this.wpText.current;
    if (txt) {
      const ws = txt.children, N = ws.length, soft = 2.5, head = this.cl(p / END) * (N + soft);
      for (let i = 0; i < N; i++) ws[i].style.opacity = (0.2 + 0.8 * this.cl((head - i) / soft)).toFixed(3);
    }
    const portal = this.wpPortal.current;
    if (portal) {
      const inn = this.sm(0.04, 0.18, p), out = this.sm(0.42, 0.52, p);
      portal.style.opacity = (inn * (1 - out)).toFixed(3);
      portal.style.transform = "translateY(" + ((1 - inn) * 16).toFixed(1) + "px) scale(" + (1 - out * 0.06).toFixed(4) + ")";
      portal.style.visibility = out >= 1 ? "hidden" : "visible";
    }
    const insp = this.wpInsp.current;
    if (insp) {
      const v = this.sm(0.46, 0.56, p);
      insp.style.opacity = v.toFixed(3);
      insp.style.transform = "translateY(" + ((1 - v) * 20).toFixed(1) + "px) scale(" + (0.96 + v * 0.04).toFixed(4) + ")";
    }
  }

  // What did not change: headline inks in; the three tiles are static.
  stepUnchanged(p) {
    const fit = this.wnFit.current, stage = this.wnStage.current;
    if (fit && stage) {
      const w = fit.clientWidth, hh = fit.clientHeight;
      if (w !== this._wnW || hh !== this._wnH) {
        this._wnW = w; this._wnH = hh;
        const s = Math.min(1.1, w / 700, hh / 560);
        stage.style.transform = "translate(" + ((w - 700 * s) / 2).toFixed(1) + "px," + ((hh - 560 * s) / 2).toFixed(1) + "px) scale(" + s.toFixed(4) + ")";
      }
    }
    if (p === this._wnP) return;
    this._wnP = p;
    const txt = this.wnText.current;
    if (txt) {
      const ws = txt.children, N = ws.length, soft = 2.5, head = this.cl(p / 0.9) * (N + soft);
      for (let i = 0; i < N; i++) ws[i].style.opacity = (0.2 + 0.8 * this.cl((head - i) / soft)).toFixed(3);
    }
  }

  // Premise stack: three pinned cards; each later card rolls in from the right over the one before.
  // Card 1 plays .02-.26, rolls .28-.38; card 2 plays .38-.63, rolls .64-.74; card 3 plays .75-.95.
  stepStack() {
    const track = this.stackTrack.current;
    if (!track) return;
    const r = track.getBoundingClientRect(), vh = window.innerHeight || 800;
    const span = r.height - (vh - 68);
    const m = span > 0 ? this.cl((68 - r.top) / span) : 1;
    const reduced = !(this.props.motion ?? true) || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const t1 = this.sm(0.28, 0.38, m), t2 = this.sm(0.64, 0.74, m);
    const set = (el, x, s) => { if (el) el.style.transform = "translateX(" + x.toFixed(2) + "%) scale(" + s.toFixed(4) + ")"; };
    set(this.wcCard.current, -(3 * t1 + 2 * t2), 1 - 0.05 * t1 - 0.03 * t2);
    set(this.wpCard.current, (1 - t1) * 108 - 3 * t2, 1 - 0.05 * t2);
    set(this.wnCard.current, (1 - t2) * 108, 1);
    this.stepWhatChanged(reduced ? 1 : this.cl((m - 0.02) / 0.24));
    this.stepProduced(reduced ? 1 : this.cl((m - 0.38) / 0.25));
    this.stepUnchanged(reduced ? 1 : this.cl((m - 0.75) / 0.2));
  }

  // Engagement: two pinned cards. The build card waits as a spine on the right, rolls over the audit card (.44-.60),
  // which folds into a spine on the left. Each paragraph inks in while its card is open.
  stepEngage() {
    const track = this.enTrack.current, stage = this.enStage.current, B = this.enB.current;
    if (!track || !stage || !B) return;
    const r = track.getBoundingClientRect(), vh = window.innerHeight || 800;
    if (r.bottom < -200 || r.top > vh + 200) return;
    const span = r.height - (vh - 68), m = span > 0 ? this.cl((68 - r.top) / span) : 1;
    const W = stage.clientWidth, S = B.offsetLeft;
    if (m === this._enM && W === this._enW) return;
    this._enM = m; this._enW = W;
    const reduced = !(this.props.motion ?? true) || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const t = this.sm(0.44, 0.6, m), a = this.sm(0, 0.45, t), b = this.sm(0.55, 1, t);
    const op = (el, v) => { if (el) el.style.opacity = v.toFixed(3); };
    B.style.transform = "translateX(" + ((1 - t) * (W - 2 * S)).toFixed(1) + "px)";
    if (this.enA.current) this.enA.current.style.transform = "scale(" + (1 - 0.02 * t).toFixed(4) + ")";
    op(this.enAi.current, 1 - a); op(this.enAs.current, b);
    op(this.enBi.current, b); op(this.enBs.current, 1 - a);
    if (this.enAs.current) this.enAs.current.style.pointerEvents = t > 0.5 ? "auto" : "none";
    if (this.enBs.current) this.enBs.current.style.pointerEvents = t < 0.5 ? "auto" : "none";
    const fill = (el, p) => {
      if (!el) return;
      const ws = el.children, N = ws.length, soft = 2.5, head = p * (N + soft);
      for (let i = 0; i < N; i++) ws[i].style.opacity = (0.18 + 0.82 * this.cl((head - i) / soft)).toFixed(3);
    };
    const p1 = reduced ? 1 : this.cl((m - 0.02) / 0.34), p2 = reduced ? 1 : this.cl((m - 0.62) / 0.3);
    fill(this.enAx.current, this.cl(p1 / 0.7));
    fill(this.enBx.current, this.cl(p2 / 0.7));
    this.enCalendar(this.enCal.current, p1);
    this._enP2 = p2; this._enVB = b;
  }
  enQ(el, sel) {
    if (!el) return [];
    el._q = el._q || {};
    return el._q[sel] || (el._q[sel] = Array.from(el.querySelectorAll(sel)));
  }
  // The build card's platform snippet redraws every frame while the card is open and on screen.
  enRenderBuild(ms) {
    const host = this.enBld.current, track = this.enTrack.current;
    if (!host || !track || !(this._enVB > 0.02)) return;
    const r = track.getBoundingClientRect(), vh = window.innerHeight || 800;
    if (r.bottom < 0 || r.top > vh) return;
    const still = !(this.props.motion ?? true) || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (!this._enShip) this._enShip = [];
    host.innerHTML = this.enBuildSVG(this._enP2 || 0, still ? 0 : ms / 1000, still);
  }
  enCalendar(cal, p) {
    if (!cal) return;
    const chips = this.enQ(cal, "[data-chip]"), cells = this.enQ(cal, "[data-cell]"), gv = this.sm(0.8, 0.86, p);
    let cur = 0;
    chips.forEach((c, n) => {
      const s0 = 0.08 + n * 0.028, v = this.sm(s0, s0 + 0.02, p);
      c.style.opacity = v.toFixed(3);
      c.style.transform = "translateY(" + ((1 - v) * 5).toFixed(1) + "px)";
      if (v > 0.5) cur = +c.getAttribute("data-day");
      if (c.hasAttribute("data-green")) {
        c.lastElementChild.style.opacity = gv.toFixed(3);
      }
    });
    cells.forEach((cell, k) => {
      const bg = gv <= 0 && cur === k + 1 ? "rgba(255,255,255,0.42)" : k === 9 && gv > 0 ? "rgba(18,160,92,0.12)" : "transparent";
      if (cell._bg !== bg) { cell._bg = bg; cell.style.background = bg; }
    });
  }

  enGear(gx, gy, ro, ri, n, hole, rot) {
    const st = Math.PI * 2 / n, p = [];
    for (let i = 0; i < n; i++) {
      const a0 = i * st + (rot || 0);
      [[a0 - st * 0.28, ri], [a0 - st * 0.14, ro], [a0 + st * 0.14, ro], [a0 + st * 0.28, ri]].forEach((q) => p.push((gx + Math.cos(q[0]) * q[1]).toFixed(2) + " " + (gy + Math.sin(q[0]) * q[1]).toFixed(2)));
    }
    return "M" + p.join(" L") + " Z M" + (gx + hole) + " " + gy + " A" + hole + " " + hole + " 0 1 0 " + (gx - hole) + " " + gy + " A" + hole + " " + hole + " 0 1 0 " + (gx + hole) + " " + gy + " Z";
  }

  // The 04 platform and its line of stations, re-inked for a light card. p = build-card progress, g = seconds for idle motion.
  // One station ships per fortnight: its wire draws out of the gate, the tile lights, then it carries a dot each cycle.
  enBuildSVG(p, g, still) {
    const S = 0.9, a = 0.866 * S, b = 0.5 * S, cx = 601, cy = 570;
    const f = (n) => (Math.round(n * 100) / 100).toString();
    const sm = (x0, x1, x) => this.sm(x0, x1, x), cl = (x) => this.cl(x);
    const o = [], late = [];
    const INK = "rgba(26,25,23,0.55)", NS = ' vector-effect="non-scaling-stroke"';
    const P = (x, y, z) => [cx + (x - y) * a, cy + (x + y) * b - z * S];
    const pt = (q) => f(q[0]) + "," + f(q[1]);
    const mTop = (z) => "matrix(" + f(a) + "," + f(b) + "," + f(-a) + "," + f(b) + "," + f(cx) + "," + f(cy - z * S) + ")";
    const mY = (y0) => "matrix(" + f(a) + "," + f(b) + ",0," + f(-S) + "," + f(cx - a * y0) + "," + f(cy + b * y0) + ")";
    const mX = (x0) => "matrix(" + f(-a) + "," + f(b) + ",0," + f(-S) + "," + f(cx + a * x0) + "," + f(cy + b * x0) + ")";
    const plR = (X, Y) => "matrix(" + f(a) + "," + f(-b) + ",0," + f(S) + "," + f(X) + "," + f(Y) + ")";
    const spR = (X, Y, u, v) => [X + u * a, Y - u * b + v * S];
    const G = (tr, inner, op, extra) => "<g" + (tr ? ' transform="' + tr + '"' : "") + (op != null && op < 0.999 ? ' opacity="' + f(Math.max(0, op)) + '"' : "") + (extra || "") + ">" + inner + "</g>";
    const R = (x, y, w, hh, fill, st, sw, rx) => '<rect x="' + f(x) + '" y="' + f(y) + '" width="' + f(Math.max(0, w)) + '" height="' + f(Math.max(0, hh)) + '"' + (rx ? ' rx="' + rx + '"' : "") + ' fill="' + (fill || "none") + '" stroke="' + (st || "none") + '" stroke-width="' + (sw || 0.8) + '"' + NS + "/>";
    const C = (x, y, r, fill, st, sw) => '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(r) + '" fill="' + (fill || "none") + '" stroke="' + (st || "none") + '" stroke-width="' + (sw || 0.8) + '"' + NS + "/>";
    const Ln = (x1, y1, x2, y2, sw, col) => '<line x1="' + f(x1) + '" y1="' + f(y1) + '" x2="' + f(x2) + '" y2="' + f(y2) + '" stroke="' + (col || INK) + '" stroke-width="' + (sw || 1) + '"' + NS + "/>";
    const Pa = (d, fill, st, sw) => '<path d="' + d + '" fill="' + (fill || "none") + '" stroke="' + (st || "none") + '" stroke-width="' + (sw || 0.8) + '" stroke-linejoin="round" stroke-linecap="round"' + NS + "/>";
    const WH = { top: "url(#bl_gt)", l: "rgba(255,255,255,0.34)", r: "rgba(255,255,255,0.58)" };
    const box = (x, y, z, w, d, hh, c) => {
      c = c || WH;
      const st = c.st || INK;
      o.push(G(mY(y + d), R(x, z, w, hh, c.l, st)) + G(mX(x + w), R(y, z, d, hh, c.r, st)) + G(mTop(z + hh), R(x, y, w, d, c.top, st)));
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
    const text = (x, y, str, op, sz, col) => late.push('<text x="' + f(x) + '" y="' + f(y) + '" fill="' + col + '" font-family="Instrument Sans, Helvetica Neue, Helvetica, sans-serif" font-size="' + sz + '" font-weight="500" letter-spacing="-0.1" opacity="' + f(op) + '">' + str + "</text>");
    const bead = (x, y, op, r) => { r = r || 6.5; if (op > 0.01) o.push('<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + r + '" fill="#F09A6E" opacity="' + f(0.32 * op) + '"/><circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + (r > 5 ? 2.5 : 1.8) + '" fill="#FFFFFF" stroke="rgba(26,25,23,0.7)" stroke-width="0.8" opacity="' + f(op) + '"/>'); };
    const bz = (W, t) => { const u = 1 - t, k0 = u * u * u, k1 = 3 * u * u * t, k2 = 3 * u * t * t, k3 = t * t * t; return [k0 * W[0][0] + k1 * W[1][0] + k2 * W[2][0] + k3 * W[3][0], k0 * W[0][1] + k1 * W[1][1] + k2 * W[2][1] + k3 * W[3][1]]; };
    const PG = '<stop offset="0" stop-color="#A8C8E8"/><stop offset="0.3" stop-color="#E9E4CF"/><stop offset="0.55" stop-color="#F3C9A8"/><stop offset="0.8" stop-color="#D9C3E8"/><stop offset="1" stop-color="#AEC9DE"/>';
    o.push("<defs>" +
      '<linearGradient id="bl_pg" x1="0" y1="0" x2="1" y2="1">' + PG + "</linearGradient>" +
      '<linearGradient id="bl_sg" gradientUnits="userSpaceOnUse" x1="' + f(cx - 160) + '" y1="0" x2="' + f(cx + 200) + '" y2="0">' + PG + "</linearGradient>" +
      '<linearGradient id="bl_gt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.9"/><stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.5"/><stop offset="1" stop-color="#E6EEF6" stop-opacity="0.7"/></linearGradient>' +
      '<linearGradient id="bl_dk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2E3036"/><stop offset="1" stop-color="#0C0C0E"/></linearGradient>' +
      '<radialGradient id="bl_glow"><stop offset="0" stop-color="#F3C9A8" stop-opacity="0.75"/><stop offset="0.45" stop-color="#D9C3E8" stop-opacity="0.3"/><stop offset="1" stop-color="#AEC9DE" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="bl_fl"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.95"/><stop offset="0.3" stop-color="#FBE9DA" stop-opacity="0.45"/><stop offset="1" stop-color="#FBE9DA" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="bl_cd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.9"/><stop offset="0.55" stop-color="#FFFFFF" stop-opacity="0.6"/><stop offset="1" stop-color="#E6EEF6" stop-opacity="0.72"/></linearGradient>' +
      '<linearGradient id="bl_gr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.5"/><stop offset="0.35" stop-color="#FFFFFF" stop-opacity="0.35"/><stop offset="0.7" stop-color="#D9C3E8" stop-opacity="0.55"/><stop offset="1" stop-color="#A8C8E8" stop-opacity="0.75"/></linearGradient>' +
      "</defs>");

    const stack = (lift, rot) => {
      const CORN = [[-88, -88], [88, -88], [88, 88], [-88, 88]], POST = "rgba(255,255,255,0.55)", CAP = "rgba(255,255,255,0.95)", GS = "rgba(255,255,255,0.5)";
      box(-100, -100, 0, 200, 200, 10, { top: "url(#bl_dk)", l: "rgba(22,23,26,0.9)", r: "rgba(36,37,42,0.9)", st: "rgba(26,25,23,0.7)" });
      let q = "";
      for (let i = 0; i < 7; i++) q += Ln(-80, -70 + i * 20, i % 2 ? 30 : 56, -70 + i * 20, 1, "rgba(233,228,207,0.3)");
      q += R(50, 40, 32, 32, "url(#bl_pg)", "rgba(0,0,0,0.6)", 0.8, 3) + Ln(58, 56, 64, 62, 1.6, "#1A1917") + Ln(64, 62, 75, 48, 1.6, "#1A1917");
      CORN.concat([[0, -88], [0, 88], [88, 0], [-88, 0]]).forEach((c) => { q += C(c[0], c[1], 3.4, "#0A0A0A", "rgba(244,243,240,0.6)"); });
      o.push(G(mTop(10), q));
      CORN.forEach((c) => cyl(c[0], c[1], 10, 3.2, 12, POST, CAP));
      box(-100, -100, 22, 200, 200, 6, WH);
      o.push(G(mTop(28), R(-84, -64, 58, 14, "rgba(255,255,255,0.55)", INK, 0.8, 7) + R(-84, -42, 58, 14, "rgba(255,255,255,0.55)", INK, 0.8, 7) + R(20, 84, 70, 8, "rgba(255,255,255,0.55)", INK, 0.8, 2) + C(-88, 88, 3, INK) + C(88, 88, 3, INK)));
      box(58, -92, 28, 34, 62, 18, WH);
      ext(28, 10, this.enGear(-22, 34, 38, 31, 14, 10, rot), GS, "url(#bl_pg)", INK);
      ext(38, 7, this.enGear(-22, 34, 20, 16, 10, 5, rot), GS, "url(#bl_gt)", INK);
      [22, 44, 66].forEach((x, i) => cyl(x, 64, 28, 8, 8 + i * 3, GS, "url(#bl_pg)"));
      CORN.forEach((c) => cyl(c[0], c[1], 28, 3.2, 22, POST, CAP));
      ext(50, 6, "M-100 -100 H100 V100 H-100 Z M-10 5 H55 V70 H-10 Z", "rgba(255,255,255,0.45)", "url(#bl_gt)", INK);
      let c1 = R(-86, -86, 72, 60, "rgba(10,10,12,0.72)", INK);
      ["M-80 -78 H-60 V-66 H-38 V-80 H-22", "M-80 -64 H-68 V-50 H-46 V-58 H-20", "M-80 -38 H-56 V-32 H-30 V-46 H-18", "M-72 -54 V-36", "M-50 -80 V-72", "M-32 -74 H-24 V-62 H-34"].forEach((d) => { c1 += Pa(d, "none", "#E9E4CF", 1); });
      [[-60, -66], [-46, -58], [-30, -46], [-24, -62], [-72, -36]].forEach((c) => { c1 += C(c[0], c[1], 2, "#F3C9A8", "none"); });
      c1 += C(-88, -88, 2.4, INK) + C(88, 88, 2.4, INK) + C(88, -88, 2.4, INK) + C(-88, 88, 2.4, INK);
      o.push(G(mTop(56), c1));
      box(40, -92, 56, 50, 50, 14, WH);
      let fan = C(65, -67, 19, "url(#bl_pg)", INK);
      for (let i = 0; i < 20; i++) { const an = i * Math.PI / 10 + rot * 2.5; fan += Ln(65 + Math.cos(an) * 6, -67 + Math.sin(an) * 6, 65 + Math.cos(an + 0.35) * 18, -67 + Math.sin(an + 0.35) * 18, 0.8, INK); }
      fan += C(65, -67, 5, "#FFFFFF", INK) + R(42, -90, 46, 46, "none", "rgba(26,25,23,0.35)");
      o.push(G(mTop(70), fan));
      [[-88, -88], [48, -88], [48, 88], [-88, 88]].forEach((c) => cyl(c[0], c[1], 56, 3.2, 22, POST, CAP));
      o.push(G(mTop(66), '<circle cx="-10" cy="0" r="150" fill="url(#bl_glow)"/>', cl(lift / 34) * 0.85));
      const z0 = 78 + lift, zt = z0 + 6;
      ext(z0, 6, "M-100 -100 H140 V-40 H60 V100 H-100 Z M-80 30 H-35 V75 H-80 Z M19 -45 A24 24 0 1 0 -29 -45 A24 24 0 1 0 19 -45 Z M75 -90 H130 V-80 H75 Z M75 -62 H130 V-52 H75 Z", "#0A0A0B", "url(#bl_dk)", "rgba(244,243,240,0.55)");
      o.push(G(mTop(zt), Pa("M-93 -93 H133 V-47 H53 V93 H-93 Z", "none", "rgba(244,243,240,0.22)", 1) + [[-88, -88], [-88, 88], [48, 88], [48, -88], [-5, 0]].map((c) => C(c[0], c[1], 2.6, "rgba(255,255,255,0.75)")).join("")));
      cyl(-5, -45, zt - 8, 22, 10, "#101012", "url(#bl_pg)");
      ext(z0, 6, "M140 -100 H190 V-60 H140 V-72 H178 V-88 H140 Z", "#0A0A0B", "url(#bl_pg)", INK);
      const e1 = [P(-100, 100, 0), P(100, 100, 0), P(100, -100, 0)].map(pt).join(" ");
      const e2 = [P(-100, 100, zt), P(60, 100, zt), P(60, -40, zt), P(140, -40, zt), P(140, -100, zt)].map(pt).join(" ");
      o.push('<polyline points="' + e1 + '" fill="none" stroke="url(#bl_sg)" stroke-width="2.4"/><polyline points="' + e2 + '" fill="none" stroke="url(#bl_sg)" stroke-width="2"/>');
    };

    const lift = 12 + 2.2 * Math.sin(g * 1.1), rot = g * 0.5;
    const GR = [169.2, -212.2, 5, 64], hh = 130, PZ = (k) => 34 + 18 * k;
    const pinR = (k) => P(GR[0] + GR[2], GR[1] + 10, PZ(k));
    const RBx0 = cx + 143, RBx1 = cx + 247.3, RB = [cy - 44, cy - 36, cy - 28];
    const TW = 66, TH = 70;
    const tiles = ["Intake", "Capture", "Check", "Approve", "File"].map((nm, i) => {
      const X = 1000, Y = 347.7 + 74 * i, ring = spR(X, Y, 3, 31.5), pin = pinR(4 - i), dx = ring[0] - pin[0];
      return { nm: nm, X: X, Y: Y, ring: ring, W: [pin, [pin[0] + dx * 0.5, pin[1]], [ring[0] - dx * 0.5, ring[1]], ring] };
    });
    o.push(G(mTop(0), '<circle cx="0" cy="0" r="180" fill="url(#bl_glow)"/>', 0.6));
    RB.forEach((y) => o.push(Ln(RBx0, y, RBx1, y, 1, "rgba(26,25,23,0.42)")));
    stack(lift, rot);
    RB.forEach((y, m) => { const tt = (g * 0.38 + m * 0.37) % 1; bead(RBx0 + (RBx1 - RBx0) * tt, y, sm(0.12, 0.3, tt) * (1 - sm(0.8, 1, tt)), 4.5); });
    box(GR[0], GR[1], 0, GR[2], GR[3], hh, { top: "rgba(255,255,255,0.75)", l: "rgba(255,255,255,0.5)", r: "url(#bl_gr)", st: "rgba(26,25,23,0.45)" });
    o.push(G(mX(GR[0] + GR[2]), R(GR[1] + 3, 3, GR[3] - 6, hh - 6, "none", "rgba(255,255,255,0.8)")));
    const ICON = [
      "M-13 1 L-9 -10 H9 L13 1 V11 H-13 Z M-13 1 H-5 L-3 5 H3 L5 1 H13",
      "M-12 -11 H12 V11 H-12 Z M-12 -4 H12 M-12 3 H12 M-4 -11 V11 M4 -11 V11",
      "M12 0 A12 12 0 1 1 -12 0 A12 12 0 1 1 12 0 Z M-5.5 0 L-1.5 4 L6 -4",
      "M0 -13 L11 -9 V-1 C11 6 6 10 0 13 C-6 10 -11 6 -11 -1 V-9 Z M-5 0 L-1 4 L6 -4",
      "M-13 -9 H-4 L-1 -5 H13 V10 H-13 Z M-13 -2 H13"
    ];
    const st = tiles.map((t, i) => {
      const s = 0.16 + i * 0.14, u = sm(s - 0.1, s, p), act = sm(s, s + 0.04, p);
      if (act > 0.5) { if (this._enShip[i] == null) this._enShip[i] = g; } else this._enShip[i] = null;
      const pu = still || this._enShip[i] == null ? 0 : Math.exp(-(g - this._enShip[i]) / 0.5);
      if (u > 0.001) {
        const dd = "M" + pt(t.W[0]) + " C" + pt(t.W[1]) + " " + pt(t.W[2]) + " " + pt(t.W[3]), dash = ' pathLength="1" stroke-dasharray="1" stroke-dashoffset="' + f(1 - u) + '"';
        o.push('<path d="' + dd + '" fill="none" stroke="#F3C9A8" stroke-width="4" opacity="0.6"' + dash + '/><path d="' + dd + '" fill="none" stroke="rgba(26,25,23,0.6)" stroke-width="1"' + dash + "/>");
      }
      return { u: u, act: act, pu: pu };
    });
    for (let k = 0; k < 5; k++) { const q = pinR(k); o.push(C(q[0], q[1], 2.4, "#FFFFFF", INK)); }
    tiles.forEach((t, i) => {
      const u = st[i].u, act = st[i].act, pu = st[i].pu;
      if (pu > 0.01) { const mc = spR(t.X, t.Y, TW / 2, TH / 2); o.push('<ellipse cx="' + f(mc[0]) + '" cy="' + f(mc[1]) + '" rx="50" ry="56" fill="url(#bl_fl)" opacity="' + f(0.9 * pu) + '"/>'); }
      o.push(G(plR(t.X - 3.1, t.Y - 1.8), R(0, 0, TW, TH, "rgba(255,255,255,0.3)", "rgba(26,25,23,0.16)", 0.8, 3)));
      let q = R(0, 0, TW, TH, "url(#bl_cd)", "rgba(26,25,23," + f(0.24 + 0.22 * act + 0.2 * pu) + ")", 0.9, 3) + R(3.5, 3.5, TW - 7, TH - 7, "none", "rgba(255,255,255,0.9)", 0.8, 2);
      if (act > 0.01) q += G("", R(0, 0, TW, TH, "url(#bl_pg)", "none", 0.8, 3), 0.42 * act + 0.3 * pu);
      const ic = '<path d="' + ICON[i] + '" fill="none" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"' + NS + ' transform="translate(33 30)"';
      if (act < 0.99) q += ic + ' stroke="rgba(26,25,23,0.4)" opacity="' + f(1 - act) + '"/>';
      if (act > 0.01) q += ic + ' stroke="#1A1917" opacity="' + f(act) + '"/>';
      q += '<text x="33" y="60" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9" letter-spacing="0.5" fill="' + (act > 0.5 ? "#157F52" : "rgba(26,25,23,0.55)") + '">' + (act > 0.5 ? "live" : "F" + (i + 1)) + "</text>";
      o.push(G(plR(t.X, t.Y), q, 0.72 + 0.28 * act));
      o.push(C(t.ring[0], t.ring[1], 2.6, "#FFFFFF", "rgba(26,25,23," + f(0.45 + 0.4 * act) + ")", 1));
      const lp = spR(t.X, t.Y, TW, TH / 2);
      text(lp[0] + 14, lp[1] + 4, t.nm, 0.55 + 0.45 * act, 12, "#1A1917");
      if (u > 0.001 && u < 0.999) { const hd = bz(t.W, u); bead(hd[0], hd[1], 1); }
      else if (act >= 0.999) { const tt = (g * (0.32 + (i % 2) * 0.06) + i * 0.23) % 1, hd = bz(t.W, tt); bead(hd[0], hd[1], sm(0, 0.06, tt) * (1 - sm(0.94, 1, tt))); }
    });
    return '<svg viewBox="425 305 715 425" width="100%" height="100%" style="display:block">' + o.join("") + late.join("") + "</svg>";
  }

  enJump(m) {
    const track = this.enTrack.current;
    if (!track) return;
    const vh = window.innerHeight || 800, top = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top - 68 + m * (track.offsetHeight - (vh - 68)), behavior: "smooth" });
  }

  auData() {
    const R = "Rebuild";
    return [
      { c: "Database credentials", d: R, sev: "Critical", t: "Database password committed to source", where: "config/db.ts:3", exp: "Full admin on prod-ledger", obl: "Audit scope: access", ev: [["2", "import { createClient } from 'pg'"], ["3", "const url = 'postgres://admin:Nrthg8te!@prod'", 1], ["4", "export const db = createClient(url)"]], fix: "Move secrets into a managed vault, rotate the password, and give the app a least-privilege role of its own." },
      { c: "Fund access rules", d: R, sev: "Critical", t: "Any signed-in user can read any fund's records", where: "api/investors.ts:42", exp: "2,418 LP records, 9 funds", obl: "LPA \u00a7 14.2 confidentiality", ev: [["41", "export async function list(req) {"], ["42", "  return db.from('investors').select('*')", 1], ["43", "}"]], fix: "Move reads behind a service that checks the caller's fund on every request, with row-level rules in the database as a second line." },
      { c: "Model prompt logs", d: R, sev: "Critical", t: "Investor PII written to model prompt logs", where: "lib/assistant.ts:88", exp: "Names and commitments in vendor logs", obl: "Data protection", ev: [["87", "const prompt = buildPrompt(investor)"], ["88", "logger.info({ prompt })", 1], ["89", "return model.complete(prompt)"]], fix: "Redact personal data before a prompt is built, and keep every log inside your own environment." },
      { c: "Browser data path", d: R, sev: "High", t: "Browser connects directly to the database", where: "app/portal.tsx:15", exp: "Schema visible to every visitor", obl: "Audit scope: IT controls", ev: [["14", "'use client'"], ["15", "const rows = await db.from('capital_calls')", 1], ["16", "render(rows)"]], fix: "Put a versioned service between the screens and the data. The browser never holds a connection." },
      { c: "Audit log", d: R, sev: "High", t: "No audit log; actions cannot be attributed", where: "not present", exp: "Every change since launch", obl: "Books and records", ev: [["$", "grep -ri 'audit' src/"], ["", "0 results", 1], ["", ""]], fix: "Record every read and write with the actor, the time and the values before and after, retained for seven years." }
    ];
  }
  auPack(i) {
    const F = this.auData();
    const col = (d) => d === "Rebuild" ? "#C4341E" : d === "Keep" ? "#157F52" : "#6E6D67";
    const tint = (d) => d === "Rebuild" ? "rgba(196,52,30,0.09)" : d === "Keep" ? "rgba(21,127,82,0.1)" : "rgba(20,20,18,0.06)";
    const f = F[i];
    return {
      items: F.map((x, k) => ({ c: x.c, d: x.d, dc: col(x.d), bg: k === i ? "#FFFFFF" : "transparent", bar: k === i ? "inset 2px 0 0 #1A1917" : "none" })),
      f: { sev: f.sev, t: f.t, d: f.d, dc: col(f.d), dt: tint(f.d), no: String(i + 1).padStart(2, "0"), where: f.where, exp: f.exp, obl: f.obl, fix: f.fix,
        ev: f.ev.map((l) => ({ n: l[0], code: l[1], bg: l[2] ? "rgba(242,196,92,0.42)" : "transparent" })) }
    };
  }

  // Audit loop (auto, starts when first in view): Gantt draws 0.3-2.2, collapses 3.4-4.3, calendar 4.3-4.9,
  // 24 sessions day by day 5.0-10.95, handover green 11.1-11.6, screen 12.4-13.2, five findings 13.2-19.7, loop 21.6.
  stepAuditLoop(ms) {
    const fit = this.auFit.current, st = this.auStage.current;
    if (!fit || !st) return;
    const w = fit.clientWidth;
    if (w !== this._auW) {
      this._auW = w;
      const s = Math.min(1, w / 1120);
      st.style.transform = "scale(" + s.toFixed(4) + ")";
      fit.style.height = (620 * s).toFixed(1) + "px";
    }
    const sm = (a, b, x) => { const u = this.cl((x - a) / (b - a)); return u * u * (3 - 2 * u); };
    const reduced = !(this.props.motion ?? true) || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    // starts once the reader has scrolled the audit graphic well into view; replays from the top after it leaves the screen
    const ar = fit.getBoundingClientRect(), avh = window.innerHeight || 800;
    if (this._au0 != null && !reduced && (ar.bottom < 0 || ar.top > avh)) this._au0 = null;
    if (this._au0 == null) {
      if (reduced || (ar.top < avh * 0.55 && ar.bottom > avh * 0.3)) this._au0 = ms;
      else { st.style.opacity = "0"; return; }
    }
    const LOOP = 21.6, t = reduced ? 18.5 : ((ms - this._au0) / 1000) % LOOP;
    st.style.opacity = (sm(0, 0.5, t) * (1 - sm(20.6, 21.3, t))).toFixed(3);
    const col = sm(3.4, 4.3, t);
    if (!this._auChips && this.auCal.current) this._auChips = this.auCal.current.querySelectorAll("[data-chip]");
    const chips = this._auChips || [], C0 = 5.0, CS = 0.25;
    const shown = t < C0 ? -1 : Math.min(chips.length - 1, Math.floor((t - C0) / CS));
    const curDay = shown >= 0 && chips[shown] ? +chips[shown].getAttribute("data-day") : 0;
    const calOut = sm(12.0, 12.7, t);
    const bars = this.auBars.current;
    if (bars) for (let k = 0; k < bars.children.length; k++) {
      const b = bars.children[k], g = sm(0.3 + k * 0.4, 0.9 + k * 0.4, t);
      b.style.clipPath = "inset(0 " + ((1 - g) * 100).toFixed(1) + "% 0 0 round 6px)";
      b.style.transform = "translateY(" + (-k * 46 * col).toFixed(1) + "px)";
      b.style.opacity = (col < 1 || calOut > 0 || curDay >= +b.getAttribute("data-start")) ? "1" : "0.42";
    }
    const grid = this.auGrid.current;
    if (grid) grid.style.opacity = (sm(0.2, 0.8, t) * (1 - col * 0.8)).toFixed(3);
    const panel = this.auPanel.current;
    if (panel) {
      const o = sm(3.3, 4.0, t), pi = sm(1.8, 2.4, t);
      panel.style.opacity = (pi * (1 - o)).toFixed(3);
      panel.style.transform = "translateY(" + (o * 24 + (1 - pi) * 10).toFixed(1) + "px)";
    }
    const cal = this.auCal.current;
    if (cal) {
      const ci = sm(4.3, 4.9, t);
      cal.style.opacity = (ci * (1 - calOut)).toFixed(3);
      cal.style.transform = "translateY(" + ((1 - ci) * 16).toFixed(1) + "px) scale(" + (1 - calOut * 0.03).toFixed(4) + ")";
      cal.style.visibility = calOut >= 1 ? "hidden" : "visible";
    }
    const gv = sm(11.1, 11.6, t);
    for (let n = 0; n < chips.length; n++) {
      const c = chips[n], s0 = C0 + n * CS, v = sm(s0, s0 + 0.2, t);
      c.style.opacity = v.toFixed(3);
      c.style.transform = "translateY(" + ((1 - v) * 5).toFixed(1) + "px)";
      if (c.getAttribute("data-green")) {
        c.lastElementChild.style.opacity = gv.toFixed(3);
        c.style.boxShadow = gv > 0 ? "0 0 0 " + (3 * gv).toFixed(1) + "px rgba(18,160,92,0.22), 0 8px 22px rgba(18,160,92," + (0.4 * gv).toFixed(2) + ")" : "none";
      }
    }
    const cells = this.auCells.current;
    if (cells) for (let k = 0; k < cells.children.length; k++) {
      const on = t < 11.1 && curDay === k + 1, done = k === 9 && gv > 0;
      cells.children[k].style.background = on ? "rgba(255,255,255,0.4)" : done ? "rgba(18,160,92,0.12)" : "transparent";
    }
    const win = this.auWin.current;
    if (win) {
      const v = sm(12.4, 13.2, t);
      win.style.opacity = v.toFixed(3);
      win.style.transform = "translateY(" + ((1 - v) * 24).toFixed(1) + "px)";
    }
    const j = t < 13.2 ? 0 : Math.min(4, Math.floor((t - 13.2) / 1.3));
    if (!this.state || j !== this.state.auJ) this.setState({ auJ: j });
  }

  // 03 Rebuild, scroll-pinned. g runs 0-6 across the track:
  // 0-.6 prototype tangle, .6-1.9 illegal paths drop and nodes re-lay, 1.6 Interface, 2.4 Service hub,
  // 3.3 Data panel, 4.3 Evidence panel, 5.1 everything settles as the production topology.
  rbBuild() {
    const host = this.rbLines.current, nodes = this.rbNodes.current;
    if (!host || !nodes) return;
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 560 680"); svg.setAttribute("width", "560"); svg.setAttribute("height", "680");
    svg.style.cssText = "position:absolute; left:0; top:0; overflow:visible";
    host.textContent = ""; host.appendChild(svg);
    const mk = (d, at) => { const p = document.createElementNS(NS, "path"); if (d) p.setAttribute("d", d); p.setAttribute("fill", "none"); Object.keys(at).forEach((k) => p.setAttribute(k, at[k])); svg.appendChild(p); return p; };
    const E = [[0,4],[0,5],[0,6],[1,4],[1,7],[2,4],[2,6],[2,5],[3,4],[3,5],[3,7],[6,4],[7,4],[5,1],[6,7],[0,3],[2,1]];
    const PROD = ["M145 98 V150 H272 V170", "M415 98 V150 H288 V170", "M200 201 H248", "M340 201 H312", "M274 234 V300", "M286 234 V300", "M280 446 V478"];
    const tangle = E.map(() => mk("", { stroke: "#C4341E", "stroke-width": "1.3", "stroke-dasharray": "4 3", "stroke-opacity": "0.75" }));
    const prod = PROD.map((d) => mk(d, { stroke: "rgba(20,20,18,0.6)", "stroke-width": "1.2", pathLength: "1", "stroke-dasharray": "1", "stroke-dashoffset": "1" }));
    this._rb = { N: [{"w":150,"px":40,"py":60,"qx":70,"qy":60,"tier":1,"db":0,"ret":0},{"w":150,"px":360,"py":120,"qx":340,"qy":60,"tier":1,"db":0,"ret":0},{"w":170,"px":200,"py":330,"qx":30,"qy":182,"tier":1,"db":0,"ret":0},{"w":190,"px":40,"py":470,"qx":340,"qy":182,"tier":1,"db":0,"ret":0},{"w":160,"px":330,"py":560,"qx":200,"qy":350,"tier":0,"db":1,"ret":0},{"w":170,"px":330,"py":400,"qx":330,"qy":400,"tier":0,"db":0,"ret":1},{"w":120,"px":60,"py":250,"qx":60,"qy":250,"tier":0,"db":0,"ret":1},{"w":150,"px":350,"py":250,"qx":350,"qy":250,"tier":0,"db":0,"ret":1}], E: E, nodes: Array.prototype.slice.call(nodes.children), tangle: tangle, prod: prod,
      dRows: this.rbData.current ? this.rbData.current.querySelectorAll("[data-row]") : [], eRows: this.rbEv.current ? this.rbEv.current.querySelectorAll("[data-row]") : [] };
  }

  stepRebuild() {
    const track = this.rbTrack.current, pin = this.rbPin.current;
    if (!track || !pin) return;
    const sm = (a, b, x) => { const u = this.cl((x - a) / (b - a)); return u * u * (3 - 2 * u); };
    const box = this.rbBox.current, st = this.rbStage.current;
    if (box && st) {
      const w = box.clientWidth;
      if (w && w !== this._rbW) { this._rbW = w; const s = w / 560; st.style.transform = "scale(" + s.toFixed(4) + ")"; box.style.height = (680 * s).toFixed(1) + "px"; }
    }
    const inner = this.rbInner.current;
    if (inner) {
      const cs = getComputedStyle(pin);
      const avail = pin.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom), need = inner.offsetHeight;
      const k = need > 0 ? Math.max(0.78, Math.min(1, avail / need)) : 1, key = k.toFixed(3);
      if (inner.dataset.k !== key) { inner.dataset.k = key; inner.style.transform = k < 0.999 ? "scale(" + key + ")" : "none"; }
    }
    const reduced = !(this.props.motion ?? true) || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const span = track.offsetHeight - pin.offsetHeight;
    const p = reduced ? 1 : span > 0 ? this.cl((68 - track.getBoundingClientRect().top) / span) : 0;
    const g = this.cl((p - 0.04) / 0.9) * 6;
    if (g === this._rbG) return;
    this._rbG = g;
    if (!this._rb) this.rbBuild();
    const R = this._rb;
    if (!R) return;
    const mv = sm(0.9, 1.9, g), lit = sm(1.6, 2.0, g);
    R.nodes.forEach((el, i) => {
      const n = R.N[i]; if (!n) return;
      const x = n.px + (n.qx - n.px) * mv, y = n.py + (n.qy - n.py) * mv;
      n.cx = x + n.w / 2; n.cy = y + 19;
      el.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
      let o = 1;
      if (n.ret) o = 1 - sm(0.6 + i * 0.1, 1.1 + i * 0.1, g);
      if (n.db) o = 1 - sm(3.2, 3.6, g);
      el.style.opacity = o.toFixed(3);
      el.style.visibility = o <= 0.001 ? "hidden" : "visible";
      if (n.tier) {
        el.style.background = "rgba(255," + Math.round(246 + 9 * lit) + "," + Math.round(238 + 17 * lit) + "," + (0.7 + 0.25 * lit).toFixed(2) + ")";
        el.style.boxShadow = lit > 0 ? "0 10px 26px -12px rgba(20,20,18," + (0.4 * lit).toFixed(2) + ")" : "none";
      }
    });
    let removed = 0;
    R.tangle.forEach((ln, k) => {
      const a = R.N[R.E[k][0]], b = R.N[R.E[k][1]], s0 = 0.6 + k * 0.07;
      ln.setAttribute("d", "M" + a.cx.toFixed(1) + " " + a.cy.toFixed(1) + "L" + b.cx.toFixed(1) + " " + b.cy.toFixed(1));
      ln.style.opacity = (1 - sm(s0, s0 + 0.2, g)).toFixed(3);
      if (g > s0 + 0.1) removed++;
    });
    const draw = (i, a, b) => { if (R.prod[i]) R.prod[i].setAttribute("stroke-dashoffset", (1 - sm(a, b, g)).toFixed(3)); };
    for (let i = 0; i < 4; i++) draw(i, 2.45 + i * 0.1, 2.85 + i * 0.1);
    draw(4, 3.1, 3.4); draw(5, 3.15, 3.45); draw(6, 4.1, 4.35);
    const hub = this.rbHub.current;
    if (hub) { const v = sm(2.2, 2.6, g); hub.style.opacity = v.toFixed(3); hub.style.transform = "scale(" + (0.82 + 0.18 * v).toFixed(3) + ")"; }
    const tag = this.rbTag.current;
    if (tag) tag.style.opacity = sm(2.7, 3.0, g).toFixed(3);
    const panel = (el, rows, a) => {
      if (!el) return;
      const v = sm(a, a + 0.4, g);
      el.style.opacity = v.toFixed(3);
      el.style.transform = "translateY(" + ((1 - v) * 14).toFixed(1) + "px)";
      for (let i = 0; i < rows.length; i++) rows[i].style.opacity = sm(a + 0.2 + i * 0.14, a + 0.45 + i * 0.14, g).toFixed(3);
    };
    panel(this.rbData.current, R.dRows, 3.3);
    panel(this.rbEv.current, R.eRows, 4.3);
    const S = [1.6, 2.4, 3.3, 4.3], fin = sm(5.1, 5.5, g);
    [this.rbC1, this.rbC2, this.rbC3, this.rbC4].forEach((ref, k) => {
      const el = ref.current; if (!el) return;
      const on = sm(S[k], S[k] + 0.3, g), nxt = k < 3 ? sm(S[k + 1], S[k + 1] + 0.3, g) : 0;
      el.style.opacity = (on * (1 - 0.45 * nxt * (1 - fin))).toFixed(3);
      el.style.transform = "translateY(" + ((1 - on) * 10).toFixed(1) + "px)";
      const stub = el.querySelector("[data-stub]");
      if (stub) stub.style.width = (40 * on).toFixed(1) + "px";
    });
    const cap = g < 0.6 ? "Prototype topology" : g < 2.9 ? "Re-laying the paths" : "Production topology";
    const cnt = g < 0.6 ? "8 nodes \u00b7 17 paths" : g < 2.9 ? removed + " of 17 paths removed" : "4 tiers \u00b7 1 path";
    const ce = this.rbCap.current, ne = this.rbCnt.current;
    if (ce && ce.textContent !== cap) ce.textContent = cap;
    if (ne && ne.textContent !== cnt) ne.textContent = cnt;
  }

  // Hero veil: a canvas holds a greyscale copy of the illustration over the colour image; the pointer
  // erases soft watercolour blots that bleed outward and refill over ~2.4s, so colour shows along the trail.
  initVeil() {
    const sec = this.heroSec.current, cv = this.heroVeil.current;
    if (!sec || !cv) return;
    this._vPts = [];
    const src = new Image();
    src.onload = () => { this._vImg = src; this._vGrey = null; this._vDirty = true; };
    src.src = "assets/hero-plane.png";
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

  tick = (ms) => {
    const time = ms / 1000;
    this.stepStack();
    this.stepEngage();
    this.enRenderBuild(ms);
    this.drawWash(time);
    this.stepAuditLoop(ms);
    this.stepFlow(this.revealProg(this.flowHost.current));
    this.stepRebuild();
    this.stepVeil(ms);
    this.raf = requestAnimationFrame(this.tick);
  };

  renderVals() {
    const au = this.auPack((this.state && this.state.auJ) || 0);
    return {
      heroImg: this.heroImg, heroVeil: this.heroVeil, rbTrack: this.rbTrack, rbPin: this.rbPin, rbInner: this.rbInner, rbBox: this.rbBox, rbStage: this.rbStage, rbLines: this.rbLines, rbNodes: this.rbNodes,
      rbHub: this.rbHub, rbTag: this.rbTag, rbData: this.rbData, rbEv: this.rbEv, rbCap: this.rbCap, rbCnt: this.rbCnt, rbC1: this.rbC1, rbC2: this.rbC2, rbC3: this.rbC3, rbC4: this.rbC4,
      auFit: this.auFit, auStage: this.auStage, auGrid: this.auGrid, auBars: this.auBars, auPanel: this.auPanel, auCal: this.auCal, auCells: this.auCells, auWin: this.auWin, auPane: this.auPane,
      auItems: au.items, auF: au.f,
      heroSec: this.heroSec, hwSharp: this.hwSharp, hwSoft: this.hwSoft,
      hwBloom: this.hwBloom, hwVeil: this.hwVeil,
      heroCv: this.heroCv, auditHost: this.auditHost, topoTrack: this.topoTrack, topoPin: this.topoPin,
      topoCv: this.topoCv, topoLabels: this.topoLabels, topoCap: this.topoCap, topoCount: this.topoCount,
      tierList: this.tierList, flowHost: this.flowHost,
      wcTrack: this.wcTrack, wcText: this.wcText, wcBar: this.wcBar, wcFit: this.wcFit, wcStage: this.wcStage,
      stackTrack: this.stackTrack, wcCard: this.wcCard, wpCard: this.wpCard, wnCard: this.wnCard,
      enTrack: this.enTrack, enStage: this.enStage, enA: this.enA, enB: this.enB, enAi: this.enAi, enBi: this.enBi, enAs: this.enAs, enBs: this.enBs, enAx: this.enAx, enBx: this.enBx, enCal: this.enCal, enBld: this.enBld,
      enAWords: "We read the code, the data path and the access model, then interview the people who use it. You get a written disposition per component and a costed build plan. No obligation to continue.".split(" "),
      enBWords: "A small senior squad builds onto the four tiers and ships into your environment. Priced per capability, released fortnightly, with the evaluation suite handed over at the end.".split(" "),
      enJumpA: () => this.enJump(0.2), enJumpB: () => this.enJump(0.82),
      wnTrack: this.wnTrack, wnText: this.wnText, wnTiles: this.wnTiles, wnFit: this.wnFit, wnStage: this.wnStage,
      wnWords: "Your LPs, regulator and auditor expect the same controls as before. We bring software up to that standard.".split(" "),
      wpTrack: this.wpTrack, wpText: this.wpText, wpFit: this.wpFit, wpStage: this.wpStage, wpPortal: this.wpPortal,
      wpInsp: this.wpInsp,
      wpWords: "Those tools hold LP data. None of them were secured, tested or handed over.".split(" "),
      wpData: [
        { n: "Harrow County Retirement", f: "III", c: "40,000,000", e: "j.okafor@harrowcrs.gov" },
        { n: "Castellano Family Office", f: "II", c: "7,500,000", e: "rc@castellano-fo.com" },
        { n: "Northmere Endowment", f: "IV", c: "15,000,000", e: "invest@northmere.edu" },
        { n: "D. Whitcombe", f: "III", c: "2,000,000", e: "dwhitcombe@gmail.com" },
        { n: "Kestrel Insurance Group", f: "Credit I", c: "30,000,000", e: "alts@kestrelgroup.com" },
        { n: "L. Adeyemi Trust", f: "IV", c: "3,250,000", e: "l.adeyemi@protonmail.com" }
      ],
      wcWords: "Building software now takes an afternoon. Your analysts already have.".split(" "),
      iWrap: this.iWrap, iStage: this.iStage, iMark: this.iMark, skipIntro: this.skipIntro
    };
  }
}
