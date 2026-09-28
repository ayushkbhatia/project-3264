import type { Link } from "@/content/home";

// Shared by the Header (server) and its MobileMenu (client), so it lives in neither.

/**
 * `current: true` marks the page itself (aria-current="page"); `"section"` marks the section a
 * sub-page belongs to (Playbooks, on a playbook page): the same ink colour, announced as the
 * current item rather than as this page.
 */
export type HeaderNavItem = Link & { current?: boolean | "section" };

export function navCurrent(item: HeaderNavItem) {
  return item.current === "section" ? "true" : item.current ? "page" : undefined;
}
