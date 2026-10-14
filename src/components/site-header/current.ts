// Which header item is the current page, and where its links go from here. Pure helpers for
// SiteHeader, which reads the pathname once and passes it down.

/** aria-current: "page" for the page itself; "true" for the section a sub-page belongs to. */
export type Current = "page" | "true" | undefined;

const pathOf = (href: string) => {
  const i = href.indexOf("#");
  return i < 0 ? href : href.slice(0, i) || "/";
};

/** A link to this very page (no anchor): the page itself. Anchors into it are not. */
export function linkCurrent(href: string, pathname: string): Current {
  return !href.includes("#") && pathOf(href) === pathname ? "page" : undefined;
}

/** A top-level link or menu: the page itself, or the section the page sits under. */
export function sectionCurrent(section: string, pathname: string): Current {
  if (section.includes("#")) return undefined;
  if (pathname === section) return "page";
  return pathname.startsWith(`${section}/`) ? "true" : undefined;
}

/**
 * Links into the page already open become in-page anchors, so they scroll rather than
 * navigate (and close the sheet before the scroll, its scroll lock released). A link to the
 * page itself goes to its top: "#top" scrolls there even with no element of that id.
 */
export function localHref(href: string, pathname: string) {
  if (pathOf(href) !== pathname) return href;
  const i = href.indexOf("#");
  return i < 0 ? "#top" : href.slice(i);
}
