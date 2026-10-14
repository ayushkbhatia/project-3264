import { preload } from "react-dom";
import { pageMetadata } from "@/app/shared-metadata";
import { EvaluationSuites } from "@/components/evaluation-suites/EvaluationSuites";
import { Footer } from "@/components/home/Footer";
import { FooterImage } from "@/components/home/FooterImage";
import { HERO_SRC } from "@/components/industry/media";
import { PauseControl } from "@/components/industry/Motion";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { closing, footerColumns, meta } from "@/content/evaluation-suites";

// Evaluation Suites — the service page about proving AI accuracy, ported from
// design_handoff_evaluation_suites (its reference prototype is the source of truth). Like
// Production Assurance, it is built on the industry pages' framework (components/industry), as
// the handoff asks, with its own words and data. The header, the closing image and the footer are
// the site's shared ones, rendered here on the server.

export const metadata = pageMetadata({ title: meta.title, description: meta.description });

export default function Page() {
  // The hero painting is the LCP. Preloaded from here: a preload() inside the client tree
  // does not reach the server HTML's <head>.
  preload(HERO_SRC, { as: "image", fetchPriority: "high" });
  return (
    <EvaluationSuites
      header={<SiteHeader />}
      closing={<FooterImage content={closing} flush />}
      footer={<Footer columns={footerColumns} extra={<PauseControl />} />}
    />
  );
}
