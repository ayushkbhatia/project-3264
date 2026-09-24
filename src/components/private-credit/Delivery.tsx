"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { SmartLink } from "@/components/home/primitives";
import { delivery } from "@/content/private-credit";
import { useBind } from "@/motion/private-credit/react";
import deliveryBg from "../../../public/img/private-credit/delivery-bg.webp";
import { css } from "./css";
import { MONO } from "./primitives";

// §06 Delivery (#delivery), pinned 608vh on a dark ground. Four isometric plates (built by the
// motion module into dStack) light one at a time as the four two-week stages accumulate beside
// them; in the last beat the plates close into one unit and the CTA takes over. The module
// writes transform on dInner, opacity/transform on dC1–dC4 and dCta, the stub widths, and
// pointer-events on dCta.

const GRAD = "linear-gradient(96deg,#A8C8E8 0%,#E9E4CF 26%,#F3C9A8 52%,#D9C3E8 76%,#AEC9DE 100%)";

const CELL_POS = [
  "grid-row:1; grid-column:1; text-align:right",
  "grid-row:2; grid-column:3; text-align:left",
  "grid-row:3; grid-column:1; text-align:right",
  "grid-row:4; grid-column:3; text-align:left",
];

function Stage({ i, onDark = true }: { i: number; onDark?: boolean }) {
  const s = delivery.stages[i];
  const left = i % 2 === 0; // 01 and 03 sit left of the stack, 02 and 04 right
  return (
    <>
      <div style={css(`display:flex; align-items:baseline; gap:10px; justify-content:${left && onDark ? "flex-end" : "flex-start"}`)}>
        <div style={css(`${MONO}; font-size:11px; letter-spacing:0.16em; color:rgba(255,255,255,0.9)`)}>{s.num}</div>
        <div style={css(`${MONO}; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:rgba(255,255,255,0.66)`)}>
          {s.weeks}
        </div>
      </div>
      <h3
        style={css(
          "margin:9px 0 0; font-size:clamp(13.5px,1.1vw,15.5px); font-weight:400; letter-spacing:0.08em; text-transform:uppercase; color:#F4F3F0",
        )}
      >
        {s.title}
      </h3>
      <p
        style={css(
          `margin:7px 0 0; ${onDark ? (left ? "margin-left:auto; " : "margin-right:auto; ") : ""}max-width:34ch; font-size:clamp(12px,0.95vw,13.5px); line-height:1.5; color:rgba(255,255,255,0.6); text-wrap:pretty`,
        )}
      >
        {s.body}
      </p>
    </>
  );
}

function Cta() {
  const c = delivery.cta;
  return (
    <>
      <div style={css(`${MONO}; font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:rgba(255,255,255,0.5)`)}>{c.eyebrow}</div>
      <div style={css("margin:12px 0 0; font-size:clamp(19px,1.7vw,25px); letter-spacing:-0.024em; line-height:1.18; color:#F4F3F0")}>{c.title}</div>
      <p style={css("margin:10px 0 0; max-width:36ch; font-size:clamp(12.5px,1vw,13.5px); line-height:1.55; color:rgba(255,255,255,0.62); text-wrap:pretty")}>
        {c.body}
      </p>
      <SmartLink
        href={c.button.href}
        className="bg-white text-[#0A0A0A] hover:bg-[#E9E4CF] hover:text-[#0A0A0A] focus-visible:outline-white"
        style={css("display:inline-flex; align-items:center; gap:9px; margin:18px 0 0; padding:12px 20px; border-radius:7px; font-size:13.5px; letter-spacing:-0.012em")}
      >
        {c.button.label} <span aria-hidden="true">&rarr;</span>
      </SmartLink>
      <div aria-hidden="true" style={css(`margin:16px 0 0; height:2px; width:120px; background:${GRAD}; opacity:0.85`)} />
    </>
  );
}

export function Delivery() {
  const bind = useBind();
  const cta = useRef<HTMLDivElement | null>(null);

  // The CTA sits at opacity 0 (pointer-events: none) until the last beat. Keep its link out
  // of the tab order and the accessibility tree until the module makes it clickable.
  useEffect(() => {
    const el = cta.current;
    if (!el) return;
    const sync = () => {
      el.inert = getComputedStyle(el).pointerEvents === "none";
    };
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(el, { attributes: true, attributeFilter: ["style"] });
    return () => mo.disconnect();
  }, []);
  const bindCta = bind("dCta");

  return (
    <section
      id="delivery"
      data-screen-label="Delivery"
      style={css(
        "position:relative; background:#0A0A0A; border-top:1px solid rgba(255,255,255,0.07); border-bottom:1px solid rgba(255,255,255,0.07)",
      )}
    >
      <div aria-hidden="true" style={css("position:absolute; left:0; top:0; right:0; bottom:0; overflow:hidden")}>
        {/* 1920×5748, cover, top: the pinned view shows a slowly changing slice as you scroll.
            Drawn about twice the viewport height wide, hence the sizes. */}
        <Image
          src={deliveryBg}
          alt=""
          sizes="max(100vw, 205vh)"
          style={css("position:absolute; left:0; top:0; width:100%; height:100%; object-fit:cover; object-position:center top")}
        />
        <div
          style={css(
            "position:absolute; left:0; top:0; right:0; bottom:0; background-image:radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px); background-size:3px 3px; opacity:0.6",
          )}
        />
      </div>

      {/* Below 768px: the heading, the four stages and the CTA as a plain list (the pinned
          sequence is not designed for phones). */}
      <div className="md:hidden" style={css("position:relative; padding:56px 24px 64px")}>
        <h2
          style={css("margin:0; font-size:26px; font-weight:400; letter-spacing:-0.034em; line-height:1.08; color:#F4F3F0; text-wrap:balance")}
        >
          {delivery.title.before}
          <span style={css(`background:${GRAD}; -webkit-background-clip:text; background-clip:text; color:transparent`)}>
            {delivery.title.grad}
          </span>
          {delivery.title.after}
        </h2>
        <ol style={css("margin:32px 0 0; padding:0; list-style:none; display:grid; gap:26px")}>
          {delivery.stages.map((s, i) => (
            <li key={s.num} style={css("padding-top:18px; border-top:1px solid rgba(255,255,255,0.12)")}>
              <Stage i={i} onDark={false} />
            </li>
          ))}
        </ol>
        <div style={css("margin:40px 0 0")}>
          <Cta />
        </div>
      </div>

      <div ref={bind("dTrack")} className="max-md:hidden" style={css("position:relative; min-height:608vh")}>
        <div
          ref={bind("dPin")}
          style={css(
            "position:sticky; top:68px; height:calc(100vh - 68px); min-height:min(760px, calc(100vh - 68px)); display:flex; align-items:center; justify-content:center; padding:clamp(10px,2vh,26px) 40px; box-sizing:border-box; overflow:hidden",
          )}
        >
          <div ref={bind("dInner")} style={css("width:100%; max-width:1280px; margin:0 auto; transform-origin:center center")}>
            <div style={css("max-width:880px; margin:0 auto; text-align:center")}>
              <h2
                style={css(
                  "margin:0; font-size:clamp(26px,2.7vw,42px); font-weight:400; letter-spacing:-0.034em; line-height:1.08; color:#F4F3F0; text-wrap:balance",
                )}
              >
                {delivery.title.before}
                <span style={css(`background:${GRAD}; -webkit-background-clip:text; background-clip:text; color:transparent`)}>
                  {delivery.title.grad}
                </span>
                {delivery.title.after}
              </h2>
            </div>

            <div
              style={css(
                "position:relative; margin:clamp(14px,3vh,40px) 0 0; display:grid; grid-template-columns:minmax(0,1fr) clamp(300px,30vw,400px) minmax(0,1fr); grid-template-rows:repeat(4, minmax(clamp(82px,17vh,138px), auto))",
              )}
            >
              {delivery.stages.map((s, i) => (
                <div
                  key={s.ref}
                  ref={bind(s.ref)}
                  style={css(
                    `position:relative; ${CELL_POS[i]}; align-self:center; padding:0 clamp(18px,2vw,30px); box-sizing:border-box; opacity:0`,
                  )}
                >
                  <Stage i={i} />
                  {/* the module finds the stub as lastElementChild[data-stub]: keep it last */}
                  <div
                    data-stub=""
                    style={css(
                      `position:absolute; top:50%; ${i % 2 === 0 ? "right" : "left"}:0; width:0; height:1px; background:rgba(255,255,255,0.28)`,
                    )}
                  />
                </div>
              ))}
              <div
                ref={(el) => {
                  cta.current = el;
                  bindCta(el);
                }}
                style={css(
                  "position:relative; z-index:3; grid-row:1 / span 4; grid-column:3; align-self:center; padding:0 clamp(18px,2vw,34px); box-sizing:border-box; opacity:0; pointer-events:none",
                )}
              >
                <Cta />
              </div>
              <div
                ref={bind("dStack")}
                aria-hidden="true"
                style={css("position:relative; grid-row:1 / span 4; grid-column:2; perspective:1600px; perspective-origin:50% 50%; overflow:visible")}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
