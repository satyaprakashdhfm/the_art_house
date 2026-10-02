import Link from "next/link";
import { CATEGORY_GROUPS } from "@/data/categories";
import { subHref } from "@/components/layout/nav";

/** Desktop dropdown shown when hovering "Categories" (parent needs the `group` class). */
export default function MegaMenu() {
  return (
    <div className="invisible absolute inset-x-0 top-full border-y border-line bg-paper opacity-0 shadow-sm transition-opacity duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
      <div className="container-page grid grid-cols-6 gap-6 py-8">
        {CATEGORY_GROUPS.map((g) => (
          <div key={g.slug}>
            <Link href={`/categories#${g.slug}`} className="eyebrow hover:text-gold-dark">
              {g.name}
            </Link>
            <ul className="mt-3 space-y-2">
              {g.subs.map((s) => (
                <li key={s.slug}>
                  <Link href={subHref(g.slug, s.slug)} className="text-sm text-muted hover:text-ink">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
