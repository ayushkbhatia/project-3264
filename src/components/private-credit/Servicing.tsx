"use client";

import { servicingTitle } from "@/content/private-credit";
import { useBind } from "@/motion/private-credit/react";
import { css } from "./css";

// §04 Servicing (#servicing). Three looping product cards, each on its own 6.2s clock and a
// ninth of a cycle apart, built by the motion module (buildServ / loopServ) into servHost.
// Below 900px the host's grid goes to one column, set on the host by class: the module writes
// the host's children, never its grid.

export function Servicing() {
  const bind = useBind();
  return (
    <section
      id="servicing"
      data-screen-label="Servicing"
      className="max-md:px-6! max-md:py-[88px]!"
      style={css("padding:118px 40px; border-bottom:1px solid var(--line2)")}
    >
      <div style={css("max-width:1280px; margin:0 auto")}>
        <div style={css("max-width:760px; margin:0 auto; text-align:center")}>
          <h2
            style={css(
              "margin:0; font-size:clamp(30px,3.1vw,44px); font-weight:400; letter-spacing:-0.032em; line-height:1.06; text-wrap:pretty",
            )}
          >
            {servicingTitle}
          </h2>
        </div>
        <div
          ref={bind("servHost")}
          aria-hidden="true"
          className="max-[899.98px]:grid-cols-1! max-[899.98px]:mx-auto! max-[899.98px]:max-w-[440px]"
          style={css("display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:26px; margin:58px 0 0")}
        />
      </div>
    </section>
  );
}
