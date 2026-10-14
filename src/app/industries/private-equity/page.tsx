import { preload } from "react-dom";
import { pageMetadata } from "@/app/shared-metadata";
import { Footer } from "@/components/home/Footer";
import { FooterImage } from "@/components/home/FooterImage";
import { HERO_SRC } from "@/components/private-equity/media";
import { PauseControl, PrivateEquity } from "@/components/private-equity/Motion";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { closing, footerColumns, meta } from "@/content/private-equity";

// Private Equity — the industry page for private equity sponsors, ported from
// design_handoff_private_equity (its reference prototype is the source of truth). The page is
// one client component that extends the prototype's logic class
// (components/private-equity/PrivateEquityPage.tsx), under a small wrapper that owns the
// footer's pause control (Motion.tsx); the header, the closing image and the footer are the
// site's shared ones, rendered here on the server and passed in.

export const metadata = pageMetadata({ title: meta.title, description: meta.description });

export default function Page() {
  // The hero painting is the LCP. Preloaded from here: a preload() inside the client tree
  // does not reach the server HTML's <head>.
  preload(HERO_SRC, { as: "image", fetchPriority: "high" });
  return (
    <PrivateEquity
      header={<SiteHeader />}
      closing={<FooterImage content={closing} flush />}
      footer={<Footer columns={footerColumns} extra={<PauseControl />} />}
    />
  );
}
