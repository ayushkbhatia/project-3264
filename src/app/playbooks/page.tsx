import type { Metadata } from "next";
import { preload } from "react-dom";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { CategoryRow } from "@/components/playbooks/CategoryRow";
import { ClosingCta } from "@/components/playbooks/ClosingCta";
import { FeaturedCarousel } from "@/components/playbooks/FeaturedCarousel";
import { Hero } from "@/components/playbooks/Hero";
import { Library } from "@/components/playbooks/Library";
import { LibraryCtas } from "@/components/playbooks/LibraryCtas";
import { HERO_POSTER } from "@/components/playbooks/media";
import { RecentList } from "@/components/playbooks/RecentList";
import { categories, footerColumns, headerCta, meta, nav } from "@/content/playbooks";

// Playbooks — the library of 3264's nine automation playbooks, ported from
// design_handoff_playbooks (its reference prototype, reference/Playbooks.dc.html, is the source
// of truth; copy and data in src/content/playbooks.ts).
//
// Static apart from four client islands: the hero video, the library's filter state (which
// swaps the browsing sections below for results), the carousel and the subscribe form. The
// browsing sections render here, on the server, and are handed to Library as `browse`.

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  openGraph: { title: meta.title, description: meta.description, url: "./" },
};

export default function PlaybooksPage() {
  // The poster shows the moment the video is revealed (or at once under reduced motion).
  // Preloaded from here: a preload() inside the client tree does not reach the server HTML.
  preload(HERO_POSTER, { as: "image" });
  return (
    <>
      <Header nav={nav} cta={headerCta} homeHref="/" collapseBelow="1000" menu />
      <main>
        <Hero />
        <Library
          browse={
            <>
              <FeaturedCarousel />
              <LibraryCtas />
              {categories.map((c) => (
                <CategoryRow key={c.id} category={c} />
              ))}
              <RecentList />
            </>
          }
        />
        <ClosingCta />
      </main>
      {/* 20px gutters below 480px, like every section above (specs/08) */}
      <Footer columns={footerColumns} className="max-[479.98px]:px-5" />
    </>
  );
}
