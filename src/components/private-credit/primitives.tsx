import Image from "next/image";
import type { ReactNode } from "react";
import { SmartLink } from "@/components/home/primitives";
import { ctaBands } from "@/content/private-credit";
import ctaValley from "../../../public/img/private-credit/cta-valley.png";
import valleyPastel from "../../../public/img/private-credit/valley-pastel.png";
import { css } from "./css";

// Building blocks shared by the Private Credit sections. Styles are the reference's inline
// CSS, verbatim (see css.ts); the page root sets content-box sizing, as the prototype had.

/* ------------------------------------------------------------ faux windows */

export function TrafficLights() {
  return (
    <>
      <span style={css("width:11px; height:11px; border-radius:50%; background:#FF5F57")} />
      <span style={css("width:11px; height:11px; border-radius:50%; background:#FEBC2E")} />
      <span style={css("width:11px; height:11px; border-radius:50%; background:#28C840")} />
    </>
  );
}

/** A faux window's title bar: three lights and a centred title. */
export function TitleBar({ bar, title, titleStyle }: { bar: string; title: string; titleStyle: string }) {
  return (
    <div style={css(bar)}>
      <TrafficLights />
      <span style={css(titleStyle)}>{title}</span>
    </div>
  );
}

/** The 32px bar on the four legacy windows. */
export const LEGACY_BAR =
  "position:relative; display:flex; align-items:center; gap:8px; height:32px; padding:0 12px; background:rgba(20,20,18,0.045); border-bottom:1px solid rgba(20,20,18,0.08)";
/** The 34px bar on the platform windows. */
export const PLATFORM_BAR =
  "position:relative; display:flex; align-items:center; gap:8px; height:34px; padding:0 13px; background:rgba(20,20,18,0.04); border-bottom:1px solid rgba(20,20,18,0.08)";
export const PLATFORM_TITLE =
  "position:absolute; left:0; right:0; text-align:center; font-size:11.5px; letter-spacing:-0.005em; color:#1A1917";

export const MONO = "font-family:'IBM Plex Mono',ui-monospace,monospace";

/* ------------------------------------------------------- stage furniture */

/** The painted valley and its wash behind the §01 and §02 stages. */
export function StageBackdrop() {
  return (
    <>
      {/* The stage is 1200 stage-px wide, scaled down to fit; never drawn wider than 1200px. */}
      <Image
        src={valleyPastel}
        alt=""
        sizes="1200px"
        style={css("position:absolute; inset:0; width:100%; height:100%; object-fit:cover")}
      />
      <div
        style={css(
          "position:absolute; inset:0; background:linear-gradient(118deg, rgba(252,251,249,0.72), rgba(252,251,249,0.52) 52%, rgba(252,251,249,0.44) 100%), linear-gradient(180deg, rgba(255,255,255,0.34), rgba(20,20,18,0.05))",
        )}
      />
    </>
  );
}

const MENU_ITEM = "color:rgba(20,20,18,0.66)";
const BAR = "display:block; width:2px; background:rgba(20,20,18,0.8)";

/**
 * The faux OS menu bar across the top of the §01 and §02 stages. The two differ, as in the
 * reference: §01 has the search and menu glyphs and the battery nub; §02 has neither.
 */
export function MenuBar({ variant }: { variant: "reality" | "platform" }) {
  const reality = variant === "reality";
  return (
    <div
      style={css(
        "position:absolute; left:0; top:0; right:0; height:28px; z-index:50; display:flex; align-items:center; gap:18px; padding:0 14px; background:rgba(252,251,249,0.62); backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px); border-bottom:1px solid rgba(20,20,18,0.10); font-size:12.5px; color:#1A1917",
      )}
    >
      <span style={css("display:block; width:9px; height:9px; background:#1A1917; transform:rotate(45deg)")} />
      <span style={css("font-weight:600; letter-spacing:-0.01em")}>3264</span>
      {["File", "Edit", "View", "Window", "Help"].map((m) => (
        <span key={m} style={css(MENU_ITEM)}>
          {m}
        </span>
      ))}
      <span style={css("flex:1 1 auto")} />
      <span
        style={css(
          "display:flex; align-items:center; justify-content:center; width:19px; height:15px; border-radius:3px; background:#1A1917; color:#FCFBF9; font-size:10.5px; font-weight:600",
        )}
      >
        A
      </span>
      <span style={css("display:flex; align-items:flex-end; gap:1.5px; height:11px")}>
        <span style={css(`${BAR}; height:3px`)} />
        <span style={css(`${BAR}; height:5px`)} />
        <span style={css(`${BAR}; height:8px`)} />
        <span style={css(`${BAR}; height:11px`)} />
      </span>
      <span
        style={css(
          "position:relative; display:block; width:23px; height:12px; border:1.2px solid rgba(20,20,18,0.6); border-radius:3px",
        )}
      >
        <span
          style={css(
            "position:absolute; left:1.5px; top:1.5px; bottom:1.5px; width:13px; background:rgba(20,20,18,0.8); border-radius:1.5px",
          )}
        />
        {reality && (
          <span
            style={css(
              "position:absolute; left:24px; top:3.5px; width:1.5px; height:5px; background:rgba(20,20,18,0.5); border-radius:0 1px 1px 0",
            )}
          />
        )}
      </span>
      {reality && (
        <>
          <span style={css("position:relative; display:block; width:13px; height:13px")}>
            <span
              style={css(
                "position:absolute; left:0; top:0; width:9px; height:9px; border:1.3px solid rgba(20,20,18,0.78); border-radius:50%; box-sizing:border-box",
              )}
            />
            <span
              style={css(
                "position:absolute; left:7.5px; top:8px; width:5px; height:1.4px; background:rgba(20,20,18,0.78); transform:rotate(45deg); transform-origin:left center",
              )}
            />
          </span>
          <span style={css("display:grid; gap:3px; width:14px")}>
            <span style={css("display:block; height:1.6px; background:rgba(20,20,18,0.78); border-radius:1px")} />
            <span
              style={css("display:block; height:1.6px; background:rgba(20,20,18,0.78); border-radius:1px; width:9px")}
            />
          </span>
        </>
      )}
      <span style={css(reality ? "letter-spacing:-0.005em; color:#1A1917" : "letter-spacing:-0.005em")}>
        {"Tue 9 Jan\u00a0\u00a09:41 AM"}
      </span>
    </div>
  );
}

/** "Continue scrolling", blinking; still under reduced motion (globals.css). */
export function ScrollBlip() {
  return (
    <div
      data-blip="1"
      style={css(
        "position:absolute; right:44px; top:62px; height:35px; display:flex; align-items:center; gap:10px; animation:pcBlip 1.15s ease-in-out infinite",
      )}
    >
      <div
        style={css(
          "position:relative; flex:0 0 auto; width:19px; height:28px; border:1.6px solid rgba(20,20,18,0.78); border-radius:10px; background:rgba(255,255,255,0.6)",
        )}
      >
        <span
          style={css(
            "position:absolute; left:50%; top:5px; width:2px; height:8px; margin-left:-1px; border-radius:1.4px; background:#1A1917",
          )}
        />
        <span
          style={css(
            "position:absolute; left:50%; bottom:5.5px; width:6px; height:6px; margin-left:-3px; border-right:1.6px solid #1A1917; border-bottom:1.6px solid #1A1917; transform:rotate(45deg)",
          )}
        />
      </div>
      <div style={css("font-size:14px; letter-spacing:-0.012em; color:#1A1917; white-space:nowrap")}>
        Continue scrolling
      </div>
    </div>
  );
}

/** Pinned h2 above the §01–§03 stages. */
export const PINNED_H2 =
  "font-size:clamp(19px,2.05vw,30px); font-weight:400; letter-spacing:-0.032em; line-height:1.1";

/** The in-stage titles the module fills word by word (§01, §02). */
export const STAGE_TITLE =
  "position:absolute; left:44px; top:62px; margin:0; font-size:31px; font-weight:400; letter-spacing:-0.03em; line-height:1.12; color:#1A1917; text-shadow:0 1px 18px rgba(252,251,249,0.9); text-wrap:pretty";

/* -------------------------------------------------------------- pin shell */

/** The sticky pin's CSS, shared by §01–§03 (§06 has its own). Header height is load-bearing. */
export const PIN =
  "position:sticky; top:68px; height:calc(100vh - 68px); min-height:min(680px, calc(100vh - 68px)); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:clamp(12px,2.2vh,26px); padding:clamp(14px,2.6vh,30px) 40px; box-sizing:border-box";

/**
 * What a pinned section shows below 768px. The pinned sequences are not designed for phones
 * (spec 09: gate, do not improvise), so the section keeps its id and its argument — the h2 —
 * and says where to see the rest. Shown and hidden by CSS alongside the pinned markup, so
 * the server HTML is the same at every width.
 */
export function PinnedFallback({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className="md:hidden" style={css("padding:48px 24px 56px")}>
      <h2
        style={css(
          `margin:0; max-width:560px; font-size:24px; font-weight:400; letter-spacing:-0.032em; line-height:1.14; text-wrap:balance; color:${dark ? "#F4F3F0" : "#1A1917"}`,
        )}
      >
        {children}
      </h2>
      <p
        style={css(
          `margin:14px 0 0; font-size:13.5px; line-height:1.55; color:${dark ? "rgba(255,255,255,0.62)" : "var(--mut)"}`,
        )}
      >
        This part of the page is an interactive walkthrough. It is best viewed on a larger screen.
      </p>
    </div>
  );
}

/* --------------------------------------------------------------- CTA band */

/**
 * The two dark CTA bands (after §01 and after §04). Desktop is the reference exactly. Below
 * 900px the headline's nowrap would overflow, so the grid stacks into one column and the text
 * wraps (the one responsive change spec 09 allows without design sign-off).
 */
export function CtaBand({ variant }: { variant: keyof Omit<typeof ctaBands, "cta"> }) {
  const b = ctaBands[variant];
  return (
    <section data-screen-label={b.label} className="max-md:px-6!" style={css("padding:56px 40px")}>
      <div style={css("max-width:1280px; margin:0 auto")}>
        <div style={css("position:relative; overflow:hidden; border-radius:20px; border:1px solid rgba(20,20,18,0.2)")}>
          <Image
            src={ctaValley}
            alt=""
            sizes="(min-width: 1360px) 1280px, 100vw"
            style={css(
              "position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center 64%",
            )}
          />
          <div
            style={css(
              "position:absolute; inset:0; background:linear-gradient(92deg, rgba(14,20,14,0.84) 0%, rgba(14,20,14,0.66) 44%, rgba(14,20,14,0.4) 74%, rgba(14,20,14,0.28) 100%)",
            )}
          />
          <div
            className="grid grid-cols-1 min-[900px]:grid-cols-[minmax(0,1fr)_auto]"
            style={css("position:relative; column-gap:40px; align-items:center; padding:52px clamp(28px,3.6vw,48px)")}
          >
            <div
              className="min-[900px]:col-start-1 min-[900px]:row-start-1"
              style={css(
                `${MONO}; font-size:10.5px; letter-spacing:0.14em; text-transform:uppercase; color:rgba(255,255,255,0.72)`,
              )}
            >
              {b.eyebrow}
            </div>
            <h2
              className="text-balance min-[900px]:col-start-1 min-[900px]:row-start-2 min-[900px]:whitespace-nowrap"
              style={css(
                "margin:14px 0 0; font-size:clamp(21px,2.4vw,35px); font-weight:400; letter-spacing:-0.032em; line-height:1.14; color:#F7F5F0",
              )}
            >
              {b.title}
            </h2>
            <SmartLink
              href={ctaBands.cta.href}
              className="bg-white text-[#0A0A0A] hover:bg-[#E9E4CF] hover:text-[#0A0A0A] focus-visible:outline-white max-[899.98px]:mt-6! max-[899.98px]:justify-self-start min-[900px]:col-start-2 min-[900px]:row-start-2"
              style={css(
                "margin:14px 0 0; display:inline-flex; align-items:center; gap:9px; padding:15px 24px; font-size:14.5px; letter-spacing:-0.01em; white-space:nowrap",
              )}
            >
              {ctaBands.cta.label} <span aria-hidden="true">&rarr;</span>
            </SmartLink>
            <div
              className="min-[900px]:col-start-2 min-[900px]:row-start-3 min-[900px]:whitespace-nowrap min-[900px]:text-right"
              style={css("margin:13px 0 0; font-size:13.5px; letter-spacing:-0.008em; color:rgba(255,255,255,0.8)")}
            >
              {b.note}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
