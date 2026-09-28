import { headerCta, nav as homeNav, type Link as NavLink } from "@/content/home";
import { MobileMenu } from "./MobileMenu";
import { navCurrent, type HeaderNavItem } from "./nav";
import { Button, SmartLink, Wordmark } from "./primitives";

export type { HeaderNavItem };

// The nav is hidden (not removed: the invisible nav is the spacer that keeps the button
// right-aligned) once it no longer fits on one line. With `menu`, a menu button beside the CTA
// takes over below that width (MobileMenu.tsx, designed with the Playbooks page); without it,
// the nav is simply hidden there.
// - "940": the home page. Its nav needs ~921px (wordmark + 48 + 588 of links + 48 + button +
//   80 of padding); below that the reference wraps every two-word link and pushes "Book a
//   call" off the right edge. 940 is also where Capabilities goes single-column.
// - "1000": Playbooks (design_handoff_playbooks/specs/08), whose "Book an audit" nav fits to
//   ~950px.
// - "1024": Private Credit, whose longer "Book a platform review" button makes the nav wrap
//   below ~1000px (spec 09 asks for the collapse below 1024).
const COLLAPSE = {
  "940": "max-[940px]:invisible max-[940px]:w-0 max-[940px]:overflow-hidden",
  "1000": "max-[999.98px]:invisible max-[999.98px]:w-0 max-[999.98px]:overflow-hidden",
  "1024": "max-[1023.98px]:invisible max-[1023.98px]:w-0 max-[1023.98px]:overflow-hidden",
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
    <Button href={ctaLink.href} variant="header" className="max-md:h-[38px]">
      {ctaLink.label}
    </Button>
  );
  return (
    <header className="sticky top-0 z-[100] border-b border-line2 bg-[rgba(246,245,242,0.78)] backdrop-blur-[14px]">
      {/* Below 640px the nav is hidden but still a flex item, so both 48px gaps would stand
          either side of nothing; they shrink there, and the gutter too on the narrowest
          phones, so the longer "Book a platform review" fits at 320px. */}
      <div className="mx-auto box-content flex h-[68px] max-w-[1280px] items-center gap-12 px-6 max-sm:gap-3 max-[380px]:px-4 md:px-10">
        <SmartLink href={homeHref} className="text-[19px]">
          <Wordmark />
        </SmartLink>
        <nav aria-label="Primary" className={`flex flex-1 gap-[30px] text-[14px] text-sec ${COLLAPSE[collapseBelow]}`}>
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
