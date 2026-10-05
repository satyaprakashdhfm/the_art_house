"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import { NAV_LINKS } from "@/components/layout/nav";
import MegaMenu from "@/components/layout/MegaMenu";
import UserMenu from "@/components/auth/UserMenu";
import { ui } from "@/context/ui";
import { useCartCount } from "@/context/cart";
import { useWishlist } from "@/context/wishlist";

function CountBadge({ n }: { n: number }) {
  if (n === 0) return null;
  return (
    <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-white">
      {n}
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const cartCount = useCartCount();
  const wishCount = useWishlist().length;

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  // Gold underline on the active link and on hover (also while the Categories mega menu is open).
  const navLinkClass = (href: string) =>
    `relative py-2 text-sm tracking-wide transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-gold after:transition-transform hover:text-gold hover:after:scale-x-100 group-hover:text-gold group-hover:after:scale-x-100 ${
      isActive(href) ? "text-gold after:scale-x-100" : "after:scale-x-0"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 text-ink backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between gap-4 lg:h-24">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="-ml-2 p-2 lg:hidden"
            aria-label="Open menu"
            onClick={ui.openMenu}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="flex shrink-0 items-center" aria-label="Verona Arts — home">
            <Image
              src="/images/logo.png"
              alt="Verona Arts"
              width={1241}
              height={581}
              preload
              sizes="(min-width: 1024px) 164px, 128px"
              className="h-[60px] w-auto lg:h-[76px]"
            />
          </Link>
        </div>

        <nav className="hidden h-full items-center gap-8 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) =>
            link.mega ? (
              <div key={link.href} className="group flex h-full items-center">
                <Link
                  href={link.href}
                  className={navLinkClass(link.href)}
                >
                  {link.label}
                </Link>
                <MegaMenu />
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={navLinkClass(link.href)}
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-4 sm:gap-5">
          <button type="button" aria-label="Search" onClick={ui.openSearch} className="transition-colors hover:text-gold">
            <Search className="h-5 w-5" />
          </button>
          <Link href="/wishlist" aria-label="Wishlist" className="relative transition-colors hover:text-gold">
            <Heart className="h-5 w-5" />
            <CountBadge n={wishCount} />
          </Link>
          <button type="button" aria-label="Open cart" onClick={ui.openCart} className="relative transition-colors hover:text-gold">
            <ShoppingBag className="h-5 w-5" />
            <CountBadge n={cartCount} />
          </button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
