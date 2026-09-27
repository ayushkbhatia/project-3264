"use client";

import { Component, Fragment, type RefObject } from "react";
import type { AuditPack } from "@/motion/ai-engineering/ai-engineering.logic";
import { css } from "@/components/private-credit/css";

// The audit window's component list and finding pane (02 Audit). The one piece of React state
// on the page: the finding index, 0–4, which the audit loop steps every 1.3s. It lives here
// rather than on the page so a step re-renders this pane only (BUILD_PLAN.md, "Isolating the
// one piece of React state"); the loop calls show(j) through a ref. The pane's fade on each
// step is the one the page logic ran in componentDidUpdate, moved here with the state.

type Props = {
  /** The finding pane's ref (auPane), shared with the page logic. */
  pane: RefObject<HTMLDivElement | null>;
  /** The page logic's auPack(i): the list rows and the fields of finding i. */
  pack: (i: number) => AuditPack;
};

export class AuditFindings extends Component<Props, { j: number }> {
  state = { j: 0 };

  show(j: number) {
    if (j !== this.state.j) this.setState({ j });
  }

  componentDidUpdate(_: Props, prev: { j: number }) {
    const el = this.props.pane.current;
    if (prev.j !== this.state.j && el && el.animate)
      el.animate([{ opacity: 0.35, transform: "translateY(4px)" }, { opacity: 1, transform: "none" }], { duration: 260, easing: "cubic-bezier(.16,1,.3,1)" });
  }

  render() {
    const au = this.props.pack(this.state.j);
    return (
    <div style={css("display:flex; height:470px")}>
      <div style={css("flex:0 0 330px; border-right:1px solid rgba(20,20,18,0.08); background:rgba(20,20,18,0.015); padding:16px 0")}>
        <div style={css("display:flex; justify-content:space-between; padding:0 18px 12px; font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.05em; text-transform:uppercase; color:#6E6D67")}><span>Components</span><span>11</span></div>
        {au.items.map((it, i) => (
          <Fragment key={i}>
            <div style={css(`display:flex; justify-content:space-between; gap:10px; padding:9px 18px; font-size:12.5px; color:#1A1917; background:${it.bg}; box-shadow:${it.bar}; transition:background .2s ease`)}><span>{it.c}</span><span style={css(`font-size:10.5px; color:${it.dc}`)}>{it.d}</span></div>
          </Fragment>
        ))}
        <div style={css("padding:9px 18px; font-size:11.5px; color:#6E6D67")}>+ 6 more</div>
      </div>
      <div ref={this.props.pane} style={css("flex:1 1 auto; min-width:0; background:#FFFFFF; padding:28px 36px 30px; display:flex; flex-direction:column")}>
        <div style={css("display:flex; justify-content:space-between; align-items:flex-start; gap:24px")}>
          <div>
            <div style={css(`font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.06em; text-transform:uppercase; color:${au.f.dc}`)}>{au.f.sev}{" · finding "}{au.f.no}</div>
            <div style={css("margin:8px 0 0; font-size:26px; letter-spacing:-0.026em; line-height:1.15")}>{au.f.t}</div>
          </div>
          <span style={css(`flex:none; padding:6px 12px; border-radius:5px; background:${au.f.dt}; color:${au.f.dc}; font-size:13px`)}>{au.f.d}</span>
        </div>
        <div style={css("display:grid; grid-template-columns:repeat(3,1fr); gap:1px; margin:26px 0 0; background:rgba(20,20,18,0.08); border:1px solid rgba(20,20,18,0.08)")}>
          <div style={css("background:#FFFFFF; padding:14px 16px")}>
            <div style={css("font-family:'IBM Plex Mono',monospace; font-size:9.5px; letter-spacing:0.05em; text-transform:uppercase; color:#6E6D67")}>Where</div>
            <div style={css("margin:6px 0 0; font-family:'IBM Plex Mono',monospace; font-size:12px")}>{au.f.where}</div>
          </div>
          <div style={css("background:#FFFFFF; padding:14px 16px")}>
            <div style={css("font-family:'IBM Plex Mono',monospace; font-size:9.5px; letter-spacing:0.05em; text-transform:uppercase; color:#6E6D67")}>Exposure</div>
            <div style={css("margin:6px 0 0; font-size:13.5px")}>{au.f.exp}</div>
          </div>
          <div style={css("background:#FFFFFF; padding:14px 16px")}>
            <div style={css("font-family:'IBM Plex Mono',monospace; font-size:9.5px; letter-spacing:0.05em; text-transform:uppercase; color:#6E6D67")}>Obligation</div>
            <div style={css("margin:6px 0 0; font-size:13.5px")}>{au.f.obl}</div>
          </div>
        </div>
        <div style={css("margin:24px 0 0; font-family:'IBM Plex Mono',monospace; font-size:9.5px; letter-spacing:0.05em; text-transform:uppercase; color:#6E6D67")}>Evidence</div>
        <div style={css("margin:8px 0 0; padding:14px 16px; background:#F6F5F2; border:1px solid rgba(20,20,18,0.07); font-family:'IBM Plex Mono',monospace; font-size:12px; line-height:1.7; color:#2C2B27")}>
          {au.f.ev.map((l, i) => (
            <Fragment key={i}>
              <div style={css(`background:${l.bg}; white-space:pre`)}><span style={css("color:#6E6D67")}>{l.n}</span>{"  "}{l.code}</div>
            </Fragment>
          ))}
        </div>
        <div style={css("margin:24px 0 0; font-family:'IBM Plex Mono',monospace; font-size:9.5px; letter-spacing:0.05em; text-transform:uppercase; color:#6E6D67")}>Disposition</div>
        <p style={css("margin:8px 0 0; max-width:620px; font-size:15px; line-height:1.55; color:#2C2B27")}>{au.f.fix}</p>
        <div style={css("margin-top:auto; padding-top:22px; display:flex; gap:28px; font-family:'IBM Plex Mono',monospace; font-size:11px; color:#6E6D67")}>
          <span><span style={css("color:#157F52")}>1</span>{" keep"}</span>
          <span><span style={css("color:#C4341E")}>9</span>{" rebuild"}</span>
          <span>1 retire</span>
          <span style={css("margin-left:auto")}>Owned by you</span>
        </div>
      </div>
    </div>
    );
  }
}
