import { bgImage } from "@/components/ai-engineering/bg";

// The industry pages' painted backgrounds: CSS backgrounds as in the reference, served through
// the image optimiser at 1x and 2x of the drawn width (components/ai-engineering/bg.ts). By path,
// not import: Turbopack does not read AVIF for a static import. Keys are the reference's file
// names (cta-valley.png -> ctaValley), as the converted markup names them. Aspect ratios are the
// sources' own. Both pages use the same set.
export const BG = {
  aiEngWash: bgImage("/img/industry/ai-eng-wash.webp", 1344 / 752),
  ctaE: bgImage("/img/industry/cta-e.webp", 2160 / 1200),
  ctaA: bgImage("/img/industry/cta-a.jpeg", 1200 / 1500),
  valleyPastel: bgImage("/img/private-credit/valley-pastel.png", 1376 / 768),
  ctaValley: bgImage("/img/private-credit/cta-valley.png", 1376 / 768),
  auditWash: bgImage("/img/industry/audit-wash.webp", 1344 / 752),
  ctaD: bgImage("/img/ai-engineering/cta-d.avif", 3420 / 2317),
  ctaB: bgImage("/img/ai-engineering/cta-b.avif", 2048 / 1570),
};
