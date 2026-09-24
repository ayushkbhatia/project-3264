"use client";

import Image from "next/image";
import { preload } from "react-dom";
import { Fragment } from "react";
import { SmartLink } from "@/components/home/primitives";
import { hero } from "@/content/private-credit";
import { useBind } from "@/motion/private-credit/react";
import heroWash from "../../../public/img/private-credit/hero-wash.png";
import { css } from "./css";
import { MONO } from "./primitives";

// Hero (#top). The wash is one image drawn twice — sharp on the left, blurred on the right —
// under two scrims and the 32-column grid. The ring on the right is a canvas the motion
// module draws (heroCv). Markup is the reference's, line for line.

const WASH_SIZES = "100vw";

export function Hero() {
  const bind = useBind();
  // The italic face sets the equation band above the fold.
  preload("/fonts/instrument-sans-latin-400-italic.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  return (
    <section
      id="top"
      data-screen-label="Hero"
      className="max-md:px-6!"
      style={css("position:relative; padding:0 40px 38px; border-bottom:1px solid var(--line2); overflow:hidden")}
    >
      <div aria-hidden="true" style={css("position:absolute; inset:0; overflow:hidden; pointer-events:none")}>
        {/* Both layers share one source and one `sizes`, so the browser fetches it once. */}
        <Image
          src={heroWash}
          alt=""
          priority
          sizes={WASH_SIZES}
          style={css(
            "position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:left center; mask-image:linear-gradient(101deg, #000 0%, rgba(0,0,0,0.92) 32%, rgba(0,0,0,0.4) 56%, rgba(0,0,0,0) 76%); -webkit-mask-image:linear-gradient(101deg, #000 0%, rgba(0,0,0,0.92) 32%, rgba(0,0,0,0.4) 56%, rgba(0,0,0,0) 76%)",
          )}
        />
        <Image
          src={heroWash}
          alt=""
          loading="eager"
          sizes={WASH_SIZES}
          style={css(
            "position:absolute; inset:-30px; width:calc(100% + 60px); height:calc(100% + 60px); object-fit:cover; object-position:left center; filter:blur(26px); opacity:0.62; mask-image:linear-gradient(101deg, rgba(0,0,0,0) 34%, rgba(0,0,0,0.75) 62%, rgba(0,0,0,0.4) 86%, rgba(0,0,0,0.2) 100%); -webkit-mask-image:linear-gradient(101deg, rgba(0,0,0,0) 34%, rgba(0,0,0,0.75) 62%, rgba(0,0,0,0.4) 86%, rgba(0,0,0,0.2) 100%)",
          )}
        />
        <div
          style={css(
            "position:absolute; inset:0; background:linear-gradient(101deg, rgba(252,251,249,0.56) 0%, rgba(252,251,249,0.62) 40%, rgba(252,251,249,0.8) 66%, rgba(252,251,249,0.9) 100%)",
          )}
        />
        <div
          style={css(
            "position:absolute; inset:0; background:linear-gradient(180deg, rgba(252,251,249,0.28) 0%, rgba(252,251,249,0) 34%, rgba(252,251,249,0.52) 84%, rgba(252,251,249,0.92) 100%)",
          )}
        />
      </div>
      <div
        aria-hidden="true"
        style={css(
          "position:absolute; inset:0; opacity:calc(var(--tex) * 0.34); background-image:linear-gradient(to right, rgba(20,20,18,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,20,18,0.05) 1px, transparent 1px); background-size:calc(100% / 32) 68px; mask-image:linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.4) 52%, transparent 92%); -webkit-mask-image:linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.4) 52%, transparent 92%); pointer-events:none",
        )}
      />
      <div style={css("position:relative; max-width:1280px; margin:0 auto; padding:34px 0 0; box-sizing:border-box; width:100%")}>
        <nav
          aria-label="Breadcrumb"
          style={css(
            "display:flex; gap:14px; flex-wrap:wrap; align-items:center; font-size:13px; letter-spacing:-0.005em; color:var(--sec)",
          )}
        >
          <SmartLink href={hero.crumb.href} className="text-sec hover:text-a">
            {hero.crumb.label}
          </SmartLink>
          <span aria-hidden="true" style={css("color:rgba(20,20,18,0.45)")}>
            /
          </span>
          <span aria-current="page" style={css("color:#1A1917")}>
            {hero.current}
          </span>
        </nav>
        <div style={css("display:flex; gap:clamp(28px,3.6vw,56px); align-items:center; flex-wrap:wrap; margin:12px 0 0")}>
          <div style={css("flex:1 1 410px; min-width:0; max-width:560px")}>
            <h1
              style={css(
                "margin:0; font-size:clamp(30px,3.4vw,50px); font-weight:400; letter-spacing:-0.036em; line-height:1.04; text-wrap:pretty",
              )}
            >
              {hero.title}
            </h1>
            <p style={css("margin:22px 0 0; max-width:470px; font-size:15.5px; line-height:1.55; color:var(--sec); text-wrap:pretty")}>
              {hero.standfirst}
            </p>
            <div style={css("display:flex; gap:10px; flex-wrap:wrap; margin:26px 0 0")}>
              <SmartLink
                href={hero.primary.href}
                className="bg-ink text-white hover:bg-a hover:text-white"
                style={css(
                  "display:flex; align-items:center; height:38px; padding:0 17px; border-radius:5px; font-size:13.5px; font-weight:500; letter-spacing:-0.008em",
                )}
              >
                {hero.primary.label}
              </SmartLink>
              <SmartLink
                href={hero.secondary.href}
                className="border-line text-sec hover:border-a hover:text-a"
                style={css(
                  "display:flex; align-items:center; height:38px; box-sizing:border-box; padding:0 17px; border-width:1px; border-style:solid; background:transparent; border-radius:5px; font-size:13.5px; letter-spacing:-0.008em",
                )}
              >
                {hero.secondary.label}
              </SmartLink>
            </div>
          </div>
          {/* The ring sits hard against the top of this box with the spare room below it. On
              phones its labels, not the box height, limit the radius, so the box is shorter
              there (4 / 3) to leave less empty space above the equation. */}
          <div
            className="max-[639.98px]:aspect-[4/3]! max-[639.98px]:mt-2!"
            style={css("flex:1 1 620px; min-width:0; position:relative; aspect-ratio:6 / 5; max-width:680px; overflow:visible; margin-top:-26px")}
          >
            <canvas
              ref={bind("heroCv")}
              aria-hidden="true"
              style={css("position:absolute; inset:0; width:100%; height:100%; display:block")}
            />
          </div>
        </div>

        {/* The equation band: 3264.ai = ∫₀ᵀ (Loan Origination ⊕ … ⊕ Investor Reporting) / one record dt */}
        <div style={css("margin:44px 0 0; padding:30px 0 0; border-top:1px solid var(--line)")}>
          <div style={css("position:relative; display:flex; justify-content:center; align-items:center")}>
            <div
              style={css(
                "flex:0 1 auto; min-width:0; display:flex; align-items:center; justify-content:center; flex-wrap:wrap; row-gap:16px; font-size:clamp(19px,1.9vw,27px); letter-spacing:-0.018em; line-height:1; color:#1A1917",
              )}
            >
              <span style={css("flex:0 0 auto; line-height:1; font-weight:500")}>3264.ai</span>
              <span style={css("flex:0 0 auto; line-height:1; margin:0 0.4em; color:var(--mut)")}>=</span>
              <span style={css("flex:0 0 auto; display:flex; align-items:stretch; gap:0.16em; margin-right:0.2em; align-self:stretch")}>
                <span style={css("display:flex; align-items:center; font-size:2.5em; line-height:0.62; font-weight:300")}>&#8747;</span>
                <span
                  style={css(
                    `display:flex; flex-direction:column; justify-content:space-between; ${MONO}; font-size:10px; letter-spacing:0.04em; color:var(--mut); padding:3px 0`,
                  )}
                >
                  <span>T</span>
                  <span>0</span>
                </span>
              </span>
              <span
                className="max-[639.98px]:max-w-[calc(100%-0.56em)]"
                style={css("flex:0 0 auto; display:flex; flex-direction:column; align-items:stretch; gap:5px; margin:0 0.28em")}
              >
                {/* One line on desktop, as designed; on phones the four terms would be clipped,
                    so the numerator wraps there instead. */}
                <span
                  className="max-[639.98px]:flex-wrap max-[639.98px]:whitespace-normal! max-[639.98px]:gap-y-1.5!"
                  style={css(
                    "display:flex; align-items:baseline; justify-content:center; gap:0.62em; padding:0 8px; font-size:14.5px; letter-spacing:-0.008em; white-space:nowrap; color:#1A1917",
                  )}
                >
                  {hero.terms.map((term, i) => (
                    <Fragment key={term}>
                      {i > 0 && <span style={css("color:var(--a)")}>&#8853;</span>}
                      <span style={css("font-style:italic")}>{term}</span>
                    </Fragment>
                  ))}
                </span>
                <span style={css("height:1px; background:rgba(20,20,18,0.5)")} />
                <span style={css("display:flex; justify-content:center; font-size:14.5px; font-style:italic; letter-spacing:-0.008em; color:var(--sec)")}>
                  {hero.denominator}
                </span>
              </span>
              <span style={css("flex:0 0 auto; line-height:1; margin-left:0.12em; font-style:italic")}>dt</span>
            </div>
            <span
              className="max-[639.98px]:hidden"
              style={css(
                `position:absolute; right:0; top:50%; transform:translateY(-50%); ${MONO}; font-size:11px; letter-spacing:0.05em; color:var(--mut)`,
              )}
            >
              (1)
            </span>
          </div>
          <div
            style={css(
              "display:flex; gap:clamp(16px,2.2vw,34px); flex-wrap:wrap; align-items:baseline; justify-content:center; margin:26px 0 0; padding-top:18px; border-top:1px solid var(--line2); font-size:14.5px; letter-spacing:-0.008em; color:var(--sec)",
            )}
          >
            <span style={css("flex:0 0 auto; font-style:italic; font-size:14px; color:var(--mut)")}>subject to</span>
            <span style={css("flex:0 0 auto")}>
              |<span style={css("font-style:italic")}>S</span>| = 9 &nbsp;&rarr;&nbsp; 1
            </span>
            <span style={css("flex:0 0 auto")}>&part;(handoff) = 0</span>
            <span style={css("flex:0 0 auto")}>
              <span style={css("font-style:italic")}>T</span> &le; 8 weeks
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
