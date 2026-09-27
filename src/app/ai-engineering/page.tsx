import type { Metadata } from "next";
import { getImageProps } from "next/image";
import { AIEngineering, PauseControl } from "@/components/ai-engineering/Motion";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { footerColumns, headerCta, meta, nav } from "@/content/ai-engineering";
import heroPlane from "../../../public/img/ai-engineering/hero-plane.png";

// AI Engineering — the service page, ported from design_handoff_ai_engineering (its reference
// prototype is the source of truth). The page itself is one client component that extends the
// prototype's logic class (components/ai-engineering/AIEngineeringPage.tsx), under a small
// wrapper that owns the footer's pause control (Motion.tsx); the header and footer are the
// site's shared ones, rendered here on the server and passed in.

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  openGraph: { title: meta.title, description: meta.description, url: "./" },
};

export default function Page() {
  // The hero veil paints a greyscale copy of the hero image from pixels, so it loads the image
  // itself (same origin): the optimised URL, not the 1.8MB source (see initVeil). The <img>
  // normally hands it its own current source first, which is then a cache hit.
  const veilSrc = getImageProps({ src: heroPlane, alt: "", fill: true, sizes: "100vw", quality: 90 }).props.src;
  return (
    <AIEngineering
      veilSrc={veilSrc}
      header={<Header nav={nav} cta={headerCta} homeHref="/" collapseBelow="1024" />}
      footer={<Footer columns={footerColumns} extra={<PauseControl />} />}
    />
  );
}
