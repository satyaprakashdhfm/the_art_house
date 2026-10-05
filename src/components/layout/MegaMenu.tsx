"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCatalog } from "@/context/catalog";
import { groupShopHref, subHref } from "@/components/layout/nav";

/** Desktop dropdown shown when hovering "Categories" (parent needs the `group` class). */
export default function MegaMenu() {
  const { groups } = useCatalog();

  return (
    <div className="invisible absolute inset-x-0 top-full opacity-0 transition-opacity duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
      <div className="container-page">
        <div className="grid grid-cols-6 divide-x divide-line rounded-xl border border-line bg-paper py-7 shadow-xl">
          {groups.map((g) => (
            <div key={g.slug} className="flex flex-col px-6">
              <Link href={`/categories#${g.slug}`} className="text-base font-semibold text-ink hover:text-gold">
                {g.name}
              </Link>
              <ul className="mt-3 mb-5 space-y-2.5">
                {g.subs.map((s) => (
                  <li key={s.slug}>
                    <Link href={subHref(g.slug, s.slug)} className="text-sm text-muted transition-colors hover:text-gold">
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={groupShopHref(g.slug)}
                className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-gold hover:text-gold-dark"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
