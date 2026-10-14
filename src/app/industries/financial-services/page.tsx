import { preload } from "react-dom";
import { pageMetadata } from "@/app/shared-metadata";
import { FinancialServices } from "@/components/financial-services/FinancialServices";
import { Footer } from "@/components/home/Footer";
import { FooterImage } from "@/components/home/FooterImage";
import { HERO_SRC } from "@/components/industry/media";
import { PauseControl } from "@/components/industry/Motion";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { closing, footerColumns, meta } from "@/content/financial-services";

// Financial Services — the industry page for banks and lenders, ported from
// design_handoff_financial_services (its reference prototype is the source of truth), on the
// shared industry components (components/industry) that Private Equity and Fund Management also
// use. The header, the closing image and the footer are the site's shared ones, rendered here on
// the server.

export const metadata = pageMetadata({ title: meta.title, description: meta.description });

export default function Page() {
  // The hero painting is the LCP. Preloaded from here: a preload() inside the client tree
  // does not reach the server HTML's <head>.
  preload(HERO_SRC, { as: "image", fetchPriority: "high" });
  return (
    <FinancialServices
      header={<SiteHeader />}
      closing={<FooterImage content={closing} flush />}
      footer={<Footer columns={footerColumns} extra={<PauseControl />} />}
    />
  );
}
