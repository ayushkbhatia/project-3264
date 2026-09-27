import { css } from "@/components/private-credit/css";
import { RebuildPlatform } from "../RebuildPlatform";

// 03 Rebuild, 04 Platform, 05 Outcome: the host for the one dark canvas (RebuildPlatform).
// #rebuild is the section, #platform the rounded frame the canvas fills. `motion` false (the
// footer's pause control) settles the canvas.

export function Rebuild({ motion }: { motion?: boolean }) {
  return (
    <section id="rebuild" data-screen-label="Rebuild + Platform + Outcome" style={css("padding:118px 40px; border-bottom:1px solid var(--line2)")}>
      <div id="platform" style={css("position:relative; overflow:hidden; max-width:1280px; margin:0 auto; border-radius:12px; box-shadow:0 30px 90px rgba(20,20,18,0.20); border:1px solid var(--line); background:#0A0A0A")}>
        <RebuildPlatform motion={motion} />
      </div>
    </section>
  );
}
