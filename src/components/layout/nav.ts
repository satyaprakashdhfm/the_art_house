import type { GroupSlug } from "@/types";
import { SUBJECT_GROUPS } from "@/lib/labels";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories", mega: true },
  { href: "/custom-art", label: "Custom Art" },
  { href: "/offers", label: "Offers" },
  { href: "/about", label: "About" },
];

export function subHref(group: GroupSlug, sub: string) {
  return `/categories/${group}/${sub}`;
}

/** Every artwork in a group: subject groups filter the shop; style and medium groups span the whole shop. */
export function groupShopHref(group: GroupSlug) {
  return (SUBJECT_GROUPS as readonly string[]).includes(group) ? `/shop?group=${group}` : "/shop";
}
