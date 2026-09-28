import { articleMetadata } from "@/components/playbooks/article/metadata";
import { PlaybookPage } from "@/components/playbooks/article/PlaybookPage";
import { navPackReviewFigures } from "@/components/playbooks/nav-pack-review/figures";
import { navPackReview } from "@/content/nav-pack-review";

// NAV Pack Review, ported from design_handoff_nav_pack_review (its prototype, NAV Pack
// Review.dc.html, is the source of truth) onto the shared PlaybookPage template, with this
// playbook's content and figures. This folder takes precedence over app/playbooks/[slug].

export const metadata = articleMetadata(navPackReview);

export default function NavPackReviewPage() {
  return <PlaybookPage article={navPackReview} figures={navPackReviewFigures()} />;
}
