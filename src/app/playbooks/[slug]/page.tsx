import { redirect } from "next/navigation";
import { categoryById, playbooks } from "@/content/playbooks";

// /playbooks/<slug> for a playbook whose detail page has not shipped: a temporary redirect to its
// category page (design_handoff_playbooks/specs/05), so every card can link to its final URL now.
//
// A detail page ships as its own folder (src/app/playbooks/loan-ops-ledger/page.tsx), which
// takes precedence over this dynamic segment; then mark it `live` in content/playbooks.ts.
// Unknown slugs 404.

export const dynamicParams = false;

export function generateStaticParams() {
  return playbooks.filter((p) => !p.live).map((p) => ({ slug: p.slug }));
}

export default async function PlaybookPlaceholder({ params }: PageProps<"/playbooks/[slug]">) {
  const { slug } = await params;
  const playbook = playbooks.find((p) => p.slug === slug)!;
  redirect(categoryById(playbook.category).href);
}
