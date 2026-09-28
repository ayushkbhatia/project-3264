import { articleMetadata } from "@/components/playbooks/article/metadata";
import { PlaybookPage } from "@/components/playbooks/article/PlaybookPage";
import { covenantWatchFigures } from "@/components/playbooks/covenant-watch/figures";
import { covenantWatch } from "@/content/covenant-watch";

// Covenant Watch, the first playbook page, ported from design_handoff_covenant_watch (its
// prototype, Covenant Watch.dc.html, is the source of truth). The page is the shared
// PlaybookPage template with this playbook's content and figures; this folder takes precedence
// over app/playbooks/[slug], which redirects the playbooks whose pages have not shipped.

export const metadata = articleMetadata(covenantWatch);

export default function CovenantWatchPage() {
  return <PlaybookPage article={covenantWatch} figures={covenantWatchFigures()} />;
}
