import { articleMetadata } from "@/components/playbooks/article/metadata";
import { PlaybookPage } from "@/components/playbooks/article/PlaybookPage";
import { sideLetterRegisterFigures } from "@/components/playbooks/side-letter-register/figures";
import { sideLetterRegister } from "@/content/side-letter-register";

// Side-Letter Register, ported from design_handoff_side_letter_register (its prototype,
// Side-Letter Register.dc.html, is the source of truth) onto the shared PlaybookPage template,
// with this playbook's content and figures. This folder takes precedence over
// app/playbooks/[slug].

export const metadata = articleMetadata(sideLetterRegister);

export default function SideLetterRegisterPage() {
  return <PlaybookPage article={sideLetterRegister} figures={sideLetterRegisterFigures()} />;
}
