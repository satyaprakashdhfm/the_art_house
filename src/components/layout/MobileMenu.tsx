"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import Drawer from "@/components/ui/Drawer";
import { ui, useUI } from "@/context/ui";
import { CATEGORY_GROUPS } from "@/data/categories";
import { NAV_LINKS, subHref } from "@/components/layout/nav";

export default function MobileMenu() {
  const { menuOpen } = useUI();

  return (
    <Drawer open={menuOpen} onClose={ui.closeMenu} side="left" title="Menu">
      <nav className="px-5 py-4" aria-label="Mobile">
        {NAV_LINKS.map((link) =>
          link.mega ? (
            <details key={link.href} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between py-3">
                {link.label}
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="space-y-4 pb-4">
                {CATEGORY_GROUPS.map((g) => (
                  <div key={g.slug}>
                    <p className="eyebrow">{g.name}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                      {g.subs.map((s) => (
                        <Link
                          key={s.slug}
                          href={subHref(g.slug, s.slug)}
                          onClick={ui.closeMenu}
                          className="text-sm text-muted"
                        >
                          {s.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              onClick={ui.closeMenu}
              className="block border-b border-line py-3"
            >
              {link.label}
            </Link>
          ),
        )}
        <Link href="/wishlist" onClick={ui.closeMenu} className="block border-b border-line py-3">
          Wishlist
        </Link>
        <Link href="/contact" onClick={ui.closeMenu} className="block border-b border-line py-3">
          Contact
        </Link>
      </nav>
    </Drawer>
  );
}
