"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import ProductGrid from "@/components/product/ProductGrid";
import Drawer from "@/components/ui/Drawer";
import { useCatalog } from "@/context/catalog";
import { MEDIUM_LABELS, ORIENTATION_LABELS, ROOM_LABELS, STYLE_LABELS, SUBJECT_GROUPS, TYPE_LABELS } from "@/lib/labels";
import {
  FILTER_KEYS,
  PRICE_BUCKETS,
  SIZE_FILTERS,
  SORTS,
  applyFilters,
  filterLabel,
  type FilterKey,
  type Filters,
} from "@/lib/filters";

type Option = { value: string; label: string };
type Section = { key: FilterKey; title: string; options: Option[] };

const toOptions = (labels: Record<string, string>): Option[] =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

/** Filters fixed by the page (e.g. a category page) and hidden from the sidebar. */
export type LockedFilters = Partial<Record<"group" | "sub" | "medium" | "style", string>>;

export default function ShopView({ locked = {} }: { locked?: LockedFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const catalog = useCatalog();

  const active: Filters = {};
  for (const key of FILTER_KEYS) {
    const v = params.get(key);
    if (v) active[key] = v;
  }
  const sort = params.get("sort") ?? "featured";

  const products = applyFilters(catalog.products, { ...active, ...locked, sort }, catalog.subName);

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    // Changing the group clears a sub-category that no longer belongs to it.
    if (key === "group") next.delete("sub");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function clearAll() {
    router.replace(pathname, { scroll: false });
  }

  const groupSubs = catalog.getGroup(locked.group ?? active.group ?? "")?.subs ?? [];

  const sections: Section[] = [
    ...(!locked.group
      ? [{ key: "group" as const, title: "Category", options: SUBJECT_GROUPS.map((slug) => ({ value: slug, label: catalog.groupName(slug) })) }]
      : []),
    ...(!locked.sub && groupSubs.length > 0
      ? [{ key: "sub" as const, title: "Sub-category", options: groupSubs.map((s) => ({ value: s.slug, label: s.name })) }]
      : []),
    ...(!locked.medium ? [{ key: "medium" as const, title: "Medium", options: toOptions(MEDIUM_LABELS) }] : []),
    ...(!locked.style ? [{ key: "style" as const, title: "Style", options: toOptions(STYLE_LABELS) }] : []),
    { key: "price", title: "Price", options: PRICE_BUCKETS.map((b) => ({ value: b.key, label: b.label })) },
    { key: "size", title: "Size", options: SIZE_FILTERS.map((s) => ({ value: s.key, label: s.label })) },
    { key: "type", title: "Availability", options: toOptions(TYPE_LABELS) },
    { key: "orientation", title: "Orientation", options: toOptions(ORIENTATION_LABELS) },
    { key: "room", title: "Room", options: toOptions(ROOM_LABELS) },
  ];

  const chips = (Object.entries(active) as [FilterKey, string][]).filter(([k]) => !(k in locked));

  const filterPanel = (
    <div className="space-y-6">
      {sections.map((s) => (
        <fieldset key={s.key}>
          <legend className="label">{s.title}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {s.options.map((o) => {
              const on = active[s.key] === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setParam(s.key, on ? null : o.value)}
                  className={`border px-3 py-1.5 text-xs transition-colors ${
                    on ? "border-ink bg-ink text-paper" : "border-line bg-card hover:border-ink"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );

  return (
    <div className="container-page py-10">
      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28">{filterPanel}</div>
        </aside>

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 border border-line bg-card px-4 py-2 text-sm lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
              {chips.length > 0 && <span className="text-gold">({chips.length})</span>}
            </button>
            <p className="text-sm text-muted">
              {products.length} artwork{products.length === 1 ? "" : "s"}
            </p>
            <label className="flex items-center gap-2 text-sm">
              <span className="hidden text-muted sm:inline">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setParam("sort", e.target.value === "featured" ? null : e.target.value)}
                className="border border-line bg-card px-3 py-2 text-sm outline-none focus:border-ink"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {chips.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {chips.map(([k, v]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setParam(k, null)}
                  className="flex items-center gap-1.5 bg-line px-3 py-1.5 text-xs hover:bg-ink hover:text-paper"
                >
                  {filterLabel(k, v, catalog.subName)} <X className="h-3 w-3" />
                </button>
              ))}
              <button type="button" onClick={clearAll} className="text-xs underline underline-offset-4">
                Clear all
              </button>
            </div>
          )}

          {products.length === 0 ? (
            <div className="border border-dashed border-line py-20 text-center">
              <p className="font-serif text-xl">No artworks match these filters</p>
              <button type="button" onClick={clearAll} className="btn-outline mt-6">
                Clear filters
              </button>
            </div>
          ) : (
            <ProductGrid products={products} priorityCount={4} />
          )}
        </div>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        side="left"
        title="Filters"
        footer={
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={clearAll} className="btn-outline px-3">
              Clear
            </button>
            <button type="button" onClick={() => setDrawerOpen(false)} className="btn-primary px-3">
              Show {products.length}
            </button>
          </div>
        }
      >
        <div className="p-5">{filterPanel}</div>
      </Drawer>
    </div>
  );
}
