import { headerCta, nav as homeNav, type Link as NavLink } from "@/content/home";
import { MobileMenu } from "./MobileMenu";
import { navCurrent, type HeaderNavItem } from "./nav";
import { Button, SmartLink, Wordmark } from "./primitives";

export type { HeaderNavItem };

// The nav is hidden (not removed: the invisible nav is the spacer that keeps the button
// right-aligned) below the page's collapse width. With `menu`, a menu button beside the CTA takes
// over below that width (MobileMenu.tsx, designed with the Playbooks page); without it, the nav is
// simply hidden there. Since Essays joined the nav (design_handoff_essays) its seven links ease
// their gaps and type with the viewport, and each collapse width sits above the narrowest width
// at which that page's links still fit (qa/es-a11y.mjs's nav check; re-measured when Contact
// took Company's place, design_handoff_contact), so the nav's sideways-scroll fallback never shows:
// - "940": the home page, whose short "Book a call" leaves the links fitting down to 850px. 940
//   is also where Capabilities goes single-column.
// - "1000": Playbooks, Essays and Contact, and the article pages (design_handoff_playbooks/specs/08),
//   "Book an audit": fits down to 879px.
// - "1024": Private Credit (spec 09), whose longer "Book a platform review" fits down to 980px;
//   and AI Engineering.
const COLLAPSE = {
  "940": "max-[940px]:invisible max-[940px]:m-0 max-[940px]:w-0 max-[940px]:overflow-hidden max-[940px]:p-0",
  "1000": "max-[999.98px]:invisible max-[999.98px]:m-0 max-[999.98px]:w-0 max-[999.98px]:overflow-hidden max-[999.98px]:p-0",
  "1024": "max-[1023.98px]:invisible max-[1023.98px]:m-0 max-[1023.98px]:w-0 max-[1023.98px]:overflow-hidden max-[1023.98px]:p-0",
} as const;

// Sticky, blurred, 68px. Both pages' motion modules pin below it (PlatformSequence finds it
// with document.querySelector("header"); the Private Credit pins sit at top: 68px), so a page
// renders exactly one <header>, and its height is load-bearing.
export function Header({
  nav = homeNav,
  cta: ctaLink = headerCta,
  homeHref = "#top",
  collapseBelow = "940",
  menu = false,
  progress = false,
}: {
  nav?: HeaderNavItem[];
  cta?: NavLink;
  /** Where the wordmark goes: the top of the page on Home, Home everywhere else. */
  homeHref?: string;
  collapseBelow?: keyof typeof COLLAPSE;
  /** Show a menu button (and its sheet of the same links) where the nav is collapsed. */
  menu?: boolean;
  /** A 2px reading-progress bar on the header's bottom edge, driven by the page (it sets
      `transform: scaleX(p)` on [data-reading-progress]; the playbook pages' ArticleShell). */
  progress?: boolean;
}) {
  // On phones this is the only header action, so it gets a 40px tap target there (38 + the
  // border); from 768px up it is the reference's 38px.
  const cta = (
    <Button href={ctaLink.href} variant="header" className="flex-none max-md:h-[38px]">
      {ctaLink.label}
    </Button>
  );
  return (
    <header className="sticky top-0 z-[100] border-b border-line2 bg-[rgba(246,245,242,0.78)] backdrop-blur-[14px]">
      {/* Below 640px the nav is hidden but still a flex item, so both 48px gaps would stand
          either side of nothing; they shrink there, and the gutter too on the narrowest
          phones, so the longer "Book a platform review" fits at 320px. */}
      <div className="mx-auto box-content flex h-[68px] max-w-[1280px] items-center gap-[clamp(20px,3vw,48px)] px-6 max-sm:gap-3 max-[380px]:px-4 md:px-10">
        <SmartLink href={homeHref} className="text-[19px]">
          <Wordmark />
        </SmartLink>
        {/* Seven links (Essays joined the six, design_handoff_essays): the gaps and type ease down
            with the viewport, and if the links still do not fit before the page's collapse width
            they scroll sideways inside the nav, faded at its right edge. The 6px of padding above
            and below (and 4px left, given back by the margin) keep the links' focus rings inside
            the scrolling box, which would otherwise clip them. */}
        <nav
          aria-label="Primary"
          className={`-my-1.5 -ml-1 flex min-w-0 flex-1 gap-[clamp(14px,1.9vw,30px)] overflow-x-auto py-1.5 pr-7 pl-1 text-[clamp(13px,1.5vw,14px)] whitespace-nowrap text-sec [mask-image:linear-gradient(90deg,#000_calc(100%-28px),transparent)] [scrollbar-width:none] ${COLLAPSE[collapseBelow]}`}
        >
          {nav.map((item) => (
            <SmartLink
              key={item.label}
              href={item.href}
              aria-current={navCurrent(item)}
              className={item.current ? "text-ink" : undefined}
            >
              {item.label}
            </SmartLink>
          ))}
        </nav>
        {menu ? (
          <div className="flex items-center gap-2">
            {cta}
            <MobileMenu nav={nav} breakpoint={collapseBelow} />
          </div>
        ) : (
          cta
        )}
      </div>
      {progress ? (
        <div
          data-reading-progress=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -bottom-px h-0.5 origin-left bg-[#157F52]"
          style={{ transform: "scaleX(0)" }}
        />
      ) : null}
    </header>
  );
}
