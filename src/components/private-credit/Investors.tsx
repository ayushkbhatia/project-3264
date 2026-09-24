"use client";

import Image from "next/image";
import { investorsTitle } from "@/content/private-credit";
import { useBind } from "@/motion/private-credit/react";
import routingBand from "../../../public/img/private-credit/routing-band.png";
import { css } from "./css";

// §05 Investors (#investors). One faux-app window where each deal is tested against four
// mandates and split across the vehicles that can hold it, looping through three deals
// (buildLp / loopLp). lpFitNow() scales the window so the headline and the window share one
// screen: it writes transform on lpHost and height/overflow on lpFit, so those stay unstyled.
//
// Below 900px the window's grid (min widths ~620px) no longer fits; the wrapper scrolls
// sideways as a stopgap until a narrow layout is designed (spec 09).

export function Investors() {
  const bind = useBind();
  return (
    <section
      id="investors"
      data-screen-label="Investor routing"
      className="max-md:px-6!"
      style={css("position:relative; padding:clamp(40px,6vh,92px) 40px; border-bottom:1px solid var(--line2)")}
    >
      <div aria-hidden="true" style={css("position:absolute; left:0; top:0; right:0; bottom:0; overflow:hidden")}>
        {/* stretched on purpose: the band is an abstract wash */}
        <Image
          src={routingBand}
          alt=""
          sizes="100vw"
          style={css("position:absolute; left:0; top:0; width:100%; height:100%; object-fit:fill")}
        />
        <div
          style={css(
            "position:absolute; left:0; top:0; right:0; bottom:0; background:linear-gradient(180deg, rgba(252,251,249,0.5), rgba(252,251,249,0.3) 50%, rgba(252,251,249,0.52))",
          )}
        />
      </div>
      <div style={css("position:relative; max-width:1280px; margin:0 auto; display:flex; flex-direction:column; justify-content:center")}>
        <div ref={bind("lpHead")} style={css("flex:0 0 auto; max-width:820px; margin:0 auto; text-align:center")}>
          <h2
            style={css(
              "margin:0; font-size:clamp(21px,2.3vw,34px); font-weight:400; letter-spacing:-0.032em; line-height:1.1; text-wrap:pretty",
            )}
          >
            {investorsTitle}
          </h2>
        </div>
        <div className="max-[899.98px]:overflow-x-auto">
          <div ref={bind("lpFit")} className="max-[899.98px]:min-w-[640px]" style={css("flex:0 0 auto; margin:clamp(18px,3.2vh,48px) 0 0")}>
            <div ref={bind("lpHost")} aria-hidden="true" style={css("transform-origin:top center")} />
          </div>
        </div>
      </div>
    </section>
  );
}
