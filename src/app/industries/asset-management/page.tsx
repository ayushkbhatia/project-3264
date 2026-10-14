import { preload } from "react-dom";
import { pageMetadata } from "@/app/shared-metadata";
import { AssetManagement } from "@/components/asset-management/AssetManagement";
import { Footer } from "@/components/home/Footer";
import { FooterImage } from "@/components/home/FooterImage";
import { HERO_SRC } from "@/components/industry/media";
import { PauseControl } from "@/components/industry/Motion";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { closing, footerColumns, meta } from "@/content/asset-management";

// Asset Management — the industry page for asset managers, ported from
// design_handoff_asset_management (its reference prototype is the source of truth), on the
// shared industry components (components/industry) that Private Equity, Fund Management and
// Financial Services also use. The header, the closing image and the footer are the site's shared
// ones, rendered here on the server.

export const metadata = pageMetadata({ title: meta.title, description: meta.description });

export default function Page() {
  // The hero painting is the LCP. Preloaded from here: a preload() inside the client tree
  // does not reach the server HTML's <head>.
  preload(HERO_SRC, { as: "image", fetchPriority: "high" });
  return (
    <AssetManagement
      header={<SiteHeader />}
      closing={<FooterImage content={closing} flush />}
      footer={<Footer columns={footerColumns} extra={<PauseControl />} />}
    />
  );
}
