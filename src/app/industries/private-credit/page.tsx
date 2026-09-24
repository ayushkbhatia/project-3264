import type { Metadata } from "next";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { CtaBand } from "@/components/private-credit/primitives";
import { Delivery } from "@/components/private-credit/Delivery";
import { Hero } from "@/components/private-credit/Hero";
import { Intro } from "@/components/private-credit/Intro";
import { Investors } from "@/components/private-credit/Investors";
import { Origination } from "@/components/private-credit/Origination";
import { PauseControl } from "@/components/private-credit/PauseControl";
import { Platform } from "@/components/private-credit/Platform";
import { Reality } from "@/components/private-credit/Reality";
import { Servicing } from "@/components/private-credit/Servicing";
import { footerColumns, headerCta, hero, nav } from "@/content/private-credit";
import { PrivateCreditMotionRoot } from "@/motion/private-credit/react";

// Private Credit — the industry page for private credit funds, ported from
// design_handoff_private_credit (its reference prototype is the source of truth).
//
// One motion instance (src/motion/private-credit) drives the whole page: the intro, the hero
// ring, the four pinned sequences and the two looping sections. Every section binds its
// elements to it by name through useBind(); see src/motion/private-credit/react.js.

const title = "3264.ai — Private Credit";

export const metadata: Metadata = {
  title,
  description: hero.standfirst,
  openGraph: { title, description: hero.standfirst, url: "./" },
};

export default function PrivateCreditPage() {
  return (
    // data-pc: the page runs on the prototype's content-box sizing (globals.css).
    <div data-pc="">
      <PrivateCreditMotionRoot options={{ accent: "#157F52" }}>
        <Intro />
        <div style={{ position: "relative" }}>
          <Header nav={nav} cta={headerCta} homeHref="/" collapseBelow="1024" />
          <main>
            <Hero />
            <Reality />
            <CtaBand variant="audit" />
            <Platform />
            <Origination />
            <Servicing />
            <CtaBand variant="fit" />
            <Investors />
            <Delivery />
          </main>
          <Footer columns={footerColumns} extra={<PauseControl />} />
        </div>
      </PrivateCreditMotionRoot>
    </div>
  );
}
