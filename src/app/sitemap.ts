import type { MetadataRoute } from "next";
import { essayHref } from "@/content/essays";
import { getEssays } from "@/content/essays-source";

// Pages that exist. The nav's other routes (content/home.ts `routes`) 404 until those pages
// ship; add each one here when it does.
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://3264.ai";
  return [
    { url: new URL("/", origin).href, changeFrequency: "monthly", priority: 1 },
    { url: new URL("/ai-engineering", origin).href, changeFrequency: "monthly", priority: 0.8 },
    { url: new URL("/industries/private-credit", origin).href, changeFrequency: "monthly", priority: 0.8 },
    { url: new URL("/playbooks", origin).href, changeFrequency: "weekly", priority: 0.8 },
    { url: new URL("/playbooks/covenant-watch", origin).href, lastModified: "2026-09-28", changeFrequency: "monthly", priority: 0.7 },
    { url: new URL("/playbooks/loan-ops-ledger", origin).href, lastModified: "2026-09-28", changeFrequency: "monthly", priority: 0.7 },
    { url: new URL("/playbooks/capital-call-flow", origin).href, lastModified: "2026-09-28", changeFrequency: "monthly", priority: 0.7 },
    { url: new URL("/playbooks/nav-pack-review", origin).href, lastModified: "2026-09-28", changeFrequency: "monthly", priority: 0.7 },
    { url: new URL("/playbooks/investor-reporting", origin).href, lastModified: "2026-09-28", changeFrequency: "monthly", priority: 0.7 },
    { url: new URL("/playbooks/side-letter-register", origin).href, lastModified: "2026-09-28", changeFrequency: "monthly", priority: 0.7 },
    { url: new URL("/playbooks/mandate-guardrails", origin).href, lastModified: "2026-09-28", changeFrequency: "monthly", priority: 0.7 },
    { url: new URL("/essays", origin).href, changeFrequency: "weekly", priority: 0.8 },
    { url: new URL("/contact", origin).href, changeFrequency: "yearly", priority: 0.6 },
    ...getEssays().map(({ front }) => ({
      url: new URL(essayHref(front.slug), origin).href,
      lastModified: front.date,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
