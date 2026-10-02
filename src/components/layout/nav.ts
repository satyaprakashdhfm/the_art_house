import type { GroupSlug } from "@/types";

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
