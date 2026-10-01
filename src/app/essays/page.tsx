import type { Metadata } from "next";
import { EssaysIndex } from "@/components/essays/EssaysIndex";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { ClosingCta } from "@/components/playbooks/ClosingCta";
import { SubscribeCard } from "@/components/playbooks/SubscribeCard";
import { footerColumns, headerCta, indexClosing, meta, nav, signUp } from "@/content/essays";
import { getEssays, summarize } from "@/content/essays-source";

// Essays — 3264's field notes, ported from design_handoff_essays (its prototype, Essays.dc.html,
// is the source of truth; fixed copy in src/content/essays.ts, the essays themselves in
// src/content/essays/*.md).
//
// Static apart from two client islands: the index (category filter, lead, Start here and the
// list, EssaysIndex) and the sign-up form. The sign-up card and the closing tile are the
// Playbooks page's, with the Essays copy.

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  openGraph: {
    type: "website",
    siteName: "3264.ai",
    locale: "en_US",
    title: meta.title,
    description: meta.description,
    url: "./",
    // Setting openGraph replaces the root layout's, share image included: name it again.
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "3264.ai — Deployment is the deliverable." }],
  },
};

/** The sign-up card spans the 1280px column (less 40px gutters, 20px on phones). */
const SIGN_UP_SIZES = "(min-width: 1360px) 1280px, (min-width: 480px) calc(100vw - 80px), calc(100vw - 40px)";

export default function EssaysPage() {
  const essays = getEssays().map(summarize);
  return (
    <>
      <Header nav={nav} cta={headerCta} homeHref="/" collapseBelow="1000" menu />
      <main>
        <EssaysIndex essays={essays} />
        <section data-screen-label="Subscribe" className="px-10 pt-24 max-[479.98px]:px-5">
          <div className="mx-auto flex max-w-[1280px]">
            <SubscribeCard title={signUp.title} body={signUp.body} list="essays" sizes={SIGN_UP_SIZES} heading="h2" />
          </div>
        </section>
        <ClosingCta closing={indexClosing} />
      </main>
      {/* 20px gutters below 480px, as on the Playbooks pages */}
      <Footer columns={footerColumns} className="max-[479.98px]:px-5" />
    </>
  );
}
