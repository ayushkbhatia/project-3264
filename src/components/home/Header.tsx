import { headerCta, nav } from "@/content/home";
import { Button, SmartLink, Wordmark } from "./primitives";

// Sticky, blurred, 68px. PlatformSequence finds this element with
// document.querySelector("header") to pin below it, so the page must render exactly one
// <header> ahead of the capabilities section.
export function Header() {
  return (
    <header className="sticky top-0 z-[100] border-b border-line2 bg-[rgba(246,245,242,0.78)] backdrop-blur-[14px]">
      <div className="mx-auto box-content flex h-[68px] max-w-[1280px] items-center gap-12 px-6 md:px-10">
        <a href="#top" className="text-[19px]">
          <Wordmark />
        </a>
        {/* The nav needs ~921px on one line (wordmark + 48 + 588 of links + 48 + button + 80
            of padding). Below that the reference wraps every two-word link and pushes "Book a
            call" off the right edge, so the nav is hidden below 940px (the width at which
            Capabilities also goes single-column) rather than the spec's 768px; "Book a call"
            stays. A menu is not designed yet; the invisible nav is the spacer that keeps the
            button right-aligned. */}
        <nav
          aria-label="Primary"
          className="flex flex-1 gap-[30px] text-[14px] text-sec max-[940px]:invisible max-[940px]:w-0 max-[940px]:overflow-hidden"
        >
          {nav.map((item) => (
            <SmartLink key={item.label} href={item.href}>
              {item.label}
            </SmartLink>
          ))}
        </nav>
        {/* On phones this is the only header action, so it gets a 40px tap target there
            (38 + the border); from 768px up it is the reference's 38px. */}
        <Button href={headerCta.href} variant="header" className="max-md:h-[38px]">
          {headerCta.label}
        </Button>
      </div>
    </header>
  );
}
