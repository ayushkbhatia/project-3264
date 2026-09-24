"use client";

import { pinned } from "@/content/private-credit";
import { useBind } from "@/motion/private-credit/react";
import { css } from "./css";
import { PIN, PINNED_H2, PinnedFallback } from "./primitives";

// §03 Origination (#origination), pinned 600vh. 248 deal tiles filtered gate by gate down to
// the 11 that fund, with a counter and a product vignette per stage. The counter, the tile
// field and the vignettes are built by the motion module (oBuild / oSync) into the three
// empty hosts. Left-aligned head, a 1240/700 stage, no radius, no shadow, no backdrop.

export function Origination() {
  const bind = useBind();
  return (
    <section
      id="origination"
      data-screen-label="Origination"
      className="max-md:pt-0!"
      style={css("padding:40px 0 0; border-bottom:1px solid var(--line2)")}
    >
      <PinnedFallback>{pinned.origination}</PinnedFallback>
      <div ref={bind("oTrack")} className="max-md:hidden" style={css("position:relative; min-height:600vh")}>
        <div ref={bind("oPin")} style={css(PIN)}>
          <div ref={bind("oHead")} style={css("flex:0 0 auto; width:100%; max-width:1240px")}>
            <h2 style={css(`margin:0; max-width:860px; ${PINNED_H2}; text-wrap:pretty`)}>{pinned.origination}</h2>
          </div>
          <div
            ref={bind("oFit")}
            style={css("flex:1 1 auto; min-height:0; width:100%; display:flex; align-items:center; justify-content:center")}
          >
            <div
              ref={bind("oWrap")}
              aria-hidden="true"
              style={css("position:relative; width:100%; max-width:1240px; aspect-ratio:1240 / 700; max-height:100%; overflow:hidden")}
            >
              <div
                ref={bind("oStage")}
                style={css("position:absolute; left:0; top:0; width:1240px; height:700px; transform-origin:top left")}
              >
                <div ref={bind("oCount")} style={css("position:absolute; left:0; top:14px; width:470px")} />
                <div ref={bind("oField")} style={css("position:absolute; left:0; top:172px; width:490px; height:480px")} />
                <div ref={bind("oVig")} style={css("position:absolute; left:540px; top:186px; right:0; height:330px")} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
