import { preload } from "react-dom";
import { pageMetadata } from "@/app/shared-metadata";
import { ProductionAssurance } from "@/components/production-assurance/ProductionAssurance";
import { Footer } from "@/components/home/Footer";
import { FooterImage } from "@/components/home/FooterImage";
import { HERO_SRC } from "@/components/industry/media";
import { PauseControl } from "@/components/industry/Motion";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { closing, footerColumns, meta } from "@/content/production-assurance";

// Production Assurance — the service page for running AI systems after go-live, ported from
// design_handoff_production_assurance (its reference prototype is the source of truth). It is
// built on the industry pages' framework (components/industry), as the handoff asks, with its own
// words and data. The header, the closing image and the footer are the site's shared ones,
// rendered here on the server.

export const metadata = pageMetadata({ title: meta.title, description: meta.description });

export default function Page() {
  // The hero painting is the LCP. Preloaded from here: a preload() inside the client tree
  // does not reach the server HTML's <head>.
  preload(HERO_SRC, { as: "image", fetchPriority: "high" });
  return (
    <ProductionAssurance
      header={<SiteHeader />}
      closing={<FooterImage content={closing} flush />}
      footer={<Footer columns={footerColumns} extra={<PauseControl />} />}
    />
  );
}
