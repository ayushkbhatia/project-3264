"use client";

import { RebuildGraphicLogic, type RebuildGraphicProps } from "@/motion/ai-engineering/rebuild-graphic.logic";
import { css } from "@/components/private-credit/css";
import deliveryBg from "../../../public/img/private-credit/delivery-bg.webp";
import { REDUCED_MOTION } from "./media";

// 03 Rebuild: four tiers assemble into the production platform. The logic class
// (motion/ai-engineering/rebuild-graphic.logic.js) regenerates the stack as an SVG string into
// [data-svg="2a"] every frame; this component adds its markup and one behaviour the handoff
// asks for (spec 08): under reduced motion (and while paused) the finished stack is drawn once
// and held.
//
// Always mounted `bare` here, inside the 03–05 canvas: the canvas draws the backdrop, and the
// build takes its timeline from the canvas through window.__rbCtl. The logic hides the frame's
// own backdrop and CTA on mount in bare mode; the markup below renders them hidden already,
// so the server HTML matches the mounted state.

const FRAME = "position:absolute; left:0; top:0; width:1280px; height:1000px; overflow:hidden; background:#0A0A0A; transform-origin:0 0";
const FRAME_BARE = { ...css(FRAME), background: "transparent" };
const HIDDEN = { display: "none" } as const;

/** The idle clock (seconds) of the held frame: the output wire's dot mid-way along it. */
const REST_SEC = 0.7;

type Props = RebuildGraphicProps & {
  /** false: hold the finished stack still (the footer's pause control). */
  motion?: boolean;
};

export class RebuildGraphic extends RebuildGraphicLogic<Props> {
  private reduced: MediaQueryList | null = null;
  private held = false;

  constructor(props: Props) {
    super(props);
    const step = this.tick;
    this.tick = (now) => {
      if (!this.reduced?.matches && this.props.motion !== false) {
        this.held = false;
        step(now);
        return;
      }
      const ctl = this.props.bare ? window.__rbCtl : null;
      if (ctl) ctl.shown = 1;
      const host = document.querySelector('[data-svg="2a"]');
      if (host && !this.held) {
        host.innerHTML = this.scene(1, REST_SEC);
        this.held = true;
      }
      this.raf = requestAnimationFrame(this.tick);
    };
  }

  componentDidMount() {
    this.reduced = window.matchMedia(REDUCED_MOTION);
    super.componentDidMount();
  }

  render() {
    const v = this.renderVals();
    const bare = !!this.props.bare;
    return (
      <div ref={v.rgBox} style={css("position:relative; width:100%; aspect-ratio:1280 / 1000; overflow:hidden")}>
        <div ref={v.rgFrame} style={bare ? FRAME_BARE : css(FRAME)}>
          {/* Standalone only: hidden (and so never fetched, being lazy) when bare. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={deliveryBg.src} alt="" loading="lazy" style={bare ? HIDDEN : css("position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center top")} />
          <div style={bare ? HIDDEN : css("position:absolute; inset:0; background-image:radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px); background-size:3px 3px; opacity:0.6")} />
          <div data-grid="2a" style={css("position:absolute; inset:0; pointer-events:none")} />
          <div style={css("position:relative; padding:44px 40px 0")}>
            <div style={css("text-align:center")}>
              <div style={css("font-family:'IBM Plex Mono',ui-monospace,monospace; font-size:11px; letter-spacing:0.16em; text-transform:uppercase; color:rgba(255,255,255,0.55)")}>03 / Rebuild</div>
              <h2 style={css("margin:14px auto 0; font-size:40px; font-weight:400; letter-spacing:-0.034em; line-height:1.12; color:#F4F3F0")}>
                <span style={css("display:block; white-space:nowrap")}>Your spreadsheets, prototypes and PDFs in.</span>
                <span style={css("display:inline-block; background:linear-gradient(96deg,#A8C8E8 0%,#E9E4CF 26%,#F3C9A8 52%,#D9C3E8 76%,#AEC9DE 100%); -webkit-background-clip:text; background-clip:text; color:transparent")}>One production platform out.</span>
              </h2>
            </div>
            <div data-calls="2a" style={css("position:relative; margin:18px 0 0; display:flex; justify-content:center")}>
              <div data-svg="2a" aria-hidden="true" style={css("position:relative; width:720px; height:600px")} />
            </div>
          </div>
          <div style={bare ? HIDDEN : css("position:absolute; left:0; right:0; bottom:44px; display:flex; justify-content:center")}>
            <a className="hover:bg-[#E9E4CF]! hover:text-[#0A0A0A]!" href="#engagement" style={css("display:inline-flex; align-items:center; gap:9px; padding:13px 22px; background:#FFFFFF; color:#0A0A0A; border-radius:7px; font-size:14px; font-weight:500; letter-spacing:-0.012em")}>{"Book an audit call "}<span>→</span></a>
          </div>
        </div>
      </div>
    );
  }
}
