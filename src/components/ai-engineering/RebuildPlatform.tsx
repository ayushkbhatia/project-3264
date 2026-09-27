"use client";

import Image from "next/image";
import { RebuildPlatformLogic } from "@/motion/ai-engineering/rebuild-platform.logic";
import { css } from "@/components/private-credit/css";
import deliveryBg from "../../../public/img/private-credit/delivery-bg.webp";
import { NARROW, REDUCED_MOTION } from "./media";
import { RebuildGraphic } from "./RebuildGraphic";

// 03 Rebuild, 04 Platform, 05 Outcome: one 1280×2980 dark canvas scaled to the column. The
// logic class (motion/ai-engineering/rebuild-platform.logic.js) holds the page at 03 until its
// build completes (downward wheel, touch and keys scrub it forward), flies the finished
// platform into 04 with the next ~0.6 screen of scroll, then plays 04 and, on arrival, 05.
// Both scenes are regenerated as SVG strings every frame they are on screen.
//
// The one instance of window.__rbCtl lives here: exactly one RebuildPlatform on the page, with
// one <RebuildGraphic bare/> inside it (the canvas's fourth child: the hold point is measured
// from wrapEl.children[3]).
//
// Behaviour the handoff asks the port to add, wrapped around the logic's frame step rather
// than written into it:
//   * Reduced motion (spec 08, open item), and the footer's pause control: never hold the
//     page. 03 is shown built, the flight is off, and 04 and 05 are drawn once in a settled
//     frame with their captions shown.
//   * Below 900px (spec 08's interim rule until mobile is designed): no hold. 03 is shown
//     built as soon as it is reached; the flight into 04 and the two scenes run as designed.

/** The settled frames under reduced motion, in seconds since 04 landed / 05 was reached. */
const S4_REST = 7;
const S5_REST = 8;

type Props = {
  /** false: settle as under reduced motion (the footer's pause control). */
  motion?: boolean;
};

export class RebuildPlatform extends RebuildPlatformLogic<Props> {
  private reduced: MediaQueryList | null = null;
  private narrow: MediaQueryList | null = null;
  private settled = false;

  constructor(props: Props) {
    super(props);
    const step = this.tick;
    this.tick = (now) => {
      if (this.reduced?.matches || this.props.motion === false) {
        this.settle();
        this.raf = requestAnimationFrame(this.tick);
        return;
      }
      this.settled = false;
      if (this.narrow?.matches) {
        // as if 03 had been reached and completed: no lock, the build shown finished
        this.completed = true;
        this.arrived = true;
        this.locked = false;
      }
      step(now);
    };
  }

  componentDidMount() {
    this.reduced = window.matchMedia(REDUCED_MOTION);
    this.narrow = window.matchMedia(NARROW);
    super.componentDidMount();
  }

  /** Reduced motion: no hold, no flight; 03 built, 04 and 05 settled, drawn once. */
  private settle() {
    const ctl = window.__rbCtl;
    if (ctl) ctl.t = 1;
    this.locked = false;
    this.completed = true;
    this.arrived = true;
    if (this.settled) return;
    this.settled = true;
    this.fly(0);
    const h4 = document.querySelector('[data-svg="1a"]'), f4 = this.frameEl.current;
    if (h4 && f4) {
      h4.innerHTML = this.scene(S4_REST, null, 1, 0);
      f4.querySelectorAll<HTMLElement>("[data-c4]").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    }
    const h5 = document.querySelector('[data-svg="05"]'), f5 = this.f5El.current;
    if (h5 && f5) {
      h5.innerHTML = this.scene05(S5_REST);
      f5.querySelectorAll<HTMLElement>("[data-o5]").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    }
  }

  render() {
    const v = this.renderVals();
    return (
      <div ref={v.boxEl} style={css("position:relative; width:100%; aspect-ratio:1280 / 2980; overflow:hidden")}>
        <div ref={v.wrapEl} data-screen-label="2a Rebuild + Platform" style={css("position:absolute; left:0; top:0; width:1280px; height:2980px; overflow:hidden; background:#0A0A0A; transform-origin:0 0")}>
          {/* The frame is drawn at most 1280px wide (it is scaled to the column, less its 40px gutters). */}
          <Image quality={90} src={deliveryBg} alt="" sizes="(min-width: 1360px) 1280px, calc(100vw - 80px)" style={css("position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center top")} />
          <div style={css("position:absolute; inset:0; background-image:radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px); background-size:3px 3px; opacity:0.6")} />
          <svg aria-hidden="true" width="1280" height="2980" style={css("position:absolute; inset:0; pointer-events:none")}><g ref={v.latEl} stroke="rgba(255,255,255,0.055)" strokeWidth="1" /></svg>
          <div style={css("position:relative; width:1280px")}><RebuildGraphic bare motion={this.props.motion} /></div>
          <div ref={v.frameEl} style={css("position:relative; width:1280px; height:900px; overflow:hidden")}>
            <div data-svg="1a" aria-hidden="true" style={css("position:absolute; inset:0")} />
            <div style={css("position:relative; padding:44px 40px 0; text-align:center")}>
              <div style={css("font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:11px; letter-spacing:0.16em; text-transform:uppercase; color:rgba(255,255,255,0.55)")}>04 / Platform</div>
              <h2 style={css("margin:14px auto 0; font-size:40px; font-weight:400; letter-spacing:-0.034em; line-height:1.12; color:#F4F3F0")}>
                <span style={css("display:block; white-space:nowrap")}>Your processes run station to station.</span>
                <span style={css("display:inline-block; background:linear-gradient(96deg,#A8C8E8 0%,#E9E4CF 26%,#F3C9A8 52%,#D9C3E8 76%,#AEC9DE 100%); -webkit-background-clip:text; background-clip:text; color:transparent")}>We platformise the line.</span>
              </h2>
            </div>
            <div style={css("position:absolute; left:100px; top:262px; width:280px; text-align:center")}>
              <div style={css("font-size:15px; font-weight:500; letter-spacing:-0.012em; color:#F4F3F0")}>From multiple places.</div>
              <div style={css("margin-top:3px; font-size:12.5px; color:rgba(244,243,240,0.62)")}>Multiple handoffs.</div>
            </div>
            <div data-c4="1" style={css("position:absolute; left:500px; top:262px; width:280px; text-align:center; opacity:0")}>
              <div style={css("font-size:15px; font-weight:500; letter-spacing:-0.012em; color:#F4F3F0")}>One platform.</div>
              <div style={css("margin-top:3px; font-size:12.5px; color:rgba(244,243,240,0.62)")}>End to end.</div>
            </div>
            <div data-c4="2" style={css("position:absolute; left:900px; top:262px; width:280px; text-align:center; opacity:0")}>
              <div style={css("font-size:15px; font-weight:500; letter-spacing:-0.012em; color:#F4F3F0")}>To a single flow.</div>
              <div style={css("margin-top:3px; font-size:12.5px; color:rgba(244,243,240,0.62)")}>Clear ownership.</div>
            </div>
          </div>
          <div ref={v.f5El} style={css("position:relative; width:1280px; height:1080px; overflow:hidden")}>
            <div data-svg="05" aria-hidden="true" style={css("position:absolute; inset:0")} />
            <div style={css("position:relative; padding:44px 40px 0; text-align:center")}>
              <div style={css("font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:11px; letter-spacing:0.16em; text-transform:uppercase; color:rgba(255,255,255,0.55)")}>05 / Outcome</div>
              <h2 style={css("margin:14px auto 0; font-size:40px; font-weight:400; letter-spacing:-0.034em; line-height:1.12; color:#F4F3F0")}>
                <span style={css("display:block; white-space:nowrap")}>One platform. Many outcomes.</span>
                <span style={css("display:inline-block; background:linear-gradient(96deg,#A8C8E8 0%,#E9E4CF 26%,#F3C9A8 52%,#D9C3E8 76%,#AEC9DE 100%); -webkit-background-clip:text; background-clip:text; color:transparent")}>Compounding impact across your firm.</span>
              </h2>
            </div>
            <div data-o5="0" style={css("position:absolute; left:50px; top:812px; width:400px; display:flex; flex-direction:column; align-items:center; gap:10px; text-align:center; opacity:0")}>
              <div style={css("display:flex; align-items:center; gap:12px")}>
                <span style={css("display:flex; align-items:center; justify-content:center; width:26px; height:26px; border-radius:50%; border:1px solid rgba(244,243,240,0.55); font-size:13px; color:#F4F3F0; flex:none")}>1</span>
                <span style={css("font-size:20px; letter-spacing:-0.02em; color:#F4F3F0; white-space:nowrap")}>Better reporting cadence</span>
              </div>
              <div style={css("font-size:14px; line-height:1.5; color:rgba(244,243,240,0.66); text-wrap:balance")}>Every stated number is trackable to source documents and input files.</div>
            </div>
            <div data-o5="1" style={css("position:absolute; left:440px; top:862px; width:400px; display:flex; flex-direction:column; align-items:center; gap:10px; text-align:center; opacity:0")}>
              <div style={css("display:flex; align-items:center; gap:12px")}>
                <span style={css("display:flex; align-items:center; justify-content:center; width:26px; height:26px; border-radius:50%; border:1px solid rgba(244,243,240,0.55); font-size:13px; color:#F4F3F0; flex:none")}>2</span>
                <span style={css("font-size:20px; letter-spacing:-0.02em; color:#F4F3F0; white-space:nowrap")}>Stronger compliance trackability</span>
              </div>
              <div style={css("font-size:14px; line-height:1.5; color:rgba(244,243,240,0.66); text-wrap:balance")}>Every document, analysis and approval is documented and audit-ready.</div>
            </div>
            <div data-o5="2" style={css("position:absolute; left:830px; top:812px; width:400px; display:flex; flex-direction:column; align-items:center; gap:10px; text-align:center; opacity:0")}>
              <div style={css("display:flex; align-items:center; gap:12px")}>
                <span style={css("display:flex; align-items:center; justify-content:center; width:26px; height:26px; border-radius:50%; border:1px solid rgba(244,243,240,0.55); font-size:13px; color:#F4F3F0; flex:none")}>3</span>
                <span style={css("font-size:20px; letter-spacing:-0.02em; color:#F4F3F0; white-space:nowrap")}>Higher scalability</span>
              </div>
              <div style={css("font-size:14px; line-height:1.5; color:rgba(244,243,240,0.66); text-wrap:balance")}>Add new products, investors or dealflow without adding complexity.</div>
            </div>
            <div style={css("position:absolute; left:0; right:0; bottom:34px; display:flex; justify-content:center")}>
              <a className="hover:bg-[#E9E4CF]! hover:text-[#0A0A0A]!" href="#engagement" style={css("display:inline-flex; align-items:center; gap:9px; padding:13px 22px; background:#FFFFFF; color:#0A0A0A; border-radius:7px; font-size:14px; font-weight:500; letter-spacing:-0.012em")}>{"Book an audit call "}<span aria-hidden="true">→</span></a>
            </div>
          </div>
          <div ref={v.flyEl} aria-hidden="true" style={css("position:absolute; left:0; top:0; width:600px; height:420px; pointer-events:none; z-index:5; display:none; transform-origin:280px 260px")} />
        </div>
      </div>
    );
  }
}
