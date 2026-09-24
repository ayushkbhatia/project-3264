"use client";

import { pinned } from "@/content/private-credit";
import { useBind } from "@/motion/private-credit/react";
import { css } from "./css";
import {
  MenuBar,
  PIN,
  PINNED_H2,
  PinnedFallback,
  PLATFORM_BAR,
  PLATFORM_TITLE,
  ScrollBlip,
  StageBackdrop,
  STAGE_TITLE,
  TitleBar,
} from "./primitives";

// §02 Platform (#platform), pinned 700vh. One platform window; five module screens pass
// through it (Pipeline, Underwriting, Credit memo, Committee, Monitoring). The title, the
// caption, the sidebar and the body are rebuilt by the motion module on every stage change
// (p2Sync / p2Show) — they are empty here, and must stay empty.
//
// The extra position:relative wrapper around the track is the reference's; keep it.

export function Platform() {
  const bind = useBind();
  return (
    <section
      id="platform"
      data-screen-label="One platform"
      className="max-md:pt-0!"
      style={css("padding:40px 0 0; border-bottom:1px solid var(--line2)")}
    >
      <PinnedFallback>
        {pinned.platform.line}
        <span style={css("font-style:italic")}>{pinned.platform.emphasis}</span>
      </PinnedFallback>
      <div className="max-md:hidden" style={css("position:relative")}>
        <div ref={bind("p2Track")} style={css("position:relative; min-height:700vh")}>
          <div ref={bind("p2Pin")} style={css(PIN)}>
            <div ref={bind("p2Head")} style={css("flex:0 0 auto; width:100%; max-width:1200px; text-align:center")}>
              <h2 style={css(`margin:0 auto; max-width:860px; ${PINNED_H2}; text-wrap:balance`)}>
                {pinned.platform.line}
                <span style={css("font-style:italic")}>{pinned.platform.emphasis}</span>
              </h2>
            </div>
            <div
              ref={bind("p2Fit")}
              style={css("flex:1 1 auto; min-height:0; width:100%; display:flex; align-items:center; justify-content:center")}
            >
              <div
                ref={bind("p2Wrap")}
                aria-hidden="true"
                style={css(
                  "position:relative; width:100%; max-width:1200px; aspect-ratio:1200 / 780; max-height:100%; border-radius:12px; overflow:hidden; box-shadow:0 30px 90px rgba(20,20,18,0.20)",
                )}
              >
                <div
                  ref={bind("p2Stage")}
                  style={css("position:absolute; left:0; top:0; width:1200px; height:780px; transform-origin:top left")}
                >
                  <StageBackdrop />
                  <MenuBar variant="platform" />
                  <ScrollBlip />
                  <h2 ref={bind("p2Title")} style={css(`${STAGE_TITLE}; width:800px`)} />

                  <div
                    ref={bind("p2Win")}
                    style={css(
                      "position:absolute; left:70px; top:180px; width:1060px; height:518px; border-radius:11px; background:#FCFBF9; border:1px solid rgba(20,20,18,0.14); box-shadow:0 30px 74px rgba(20,20,18,0.24), 0 3px 12px rgba(20,20,18,0.14); overflow:hidden; display:flex; flex-direction:column; opacity:0",
                    )}
                  >
                    <TitleBar bar={PLATFORM_BAR} title={"3264 · Private Credit Platform"} titleStyle={PLATFORM_TITLE} />
                    <div style={css("flex:1 1 auto; min-height:0; display:flex")}>
                      <div
                        ref={bind("p2Side")}
                        style={css(
                          "flex:0 0 186px; border-right:1px solid rgba(20,20,18,0.08); padding:16px 0; background:rgba(20,20,18,0.015); display:flex; flex-direction:column",
                        )}
                      />
                      <div ref={bind("p2Body")} style={css("flex:1 1 auto; min-width:0; display:flex; flex-direction:column")} />
                    </div>
                  </div>

                  {/* the module rewrites `bottom` so the caption survives a height-bound crop */}
                  <div
                    ref={bind("p2Cap")}
                    style={css(
                      "position:absolute; left:44px; bottom:36px; width:820px; font-size:20px; font-weight:400; letter-spacing:-0.024em; line-height:1.32; color:#1A1917; text-shadow:0 1px 18px rgba(252,251,249,0.9); opacity:0",
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
