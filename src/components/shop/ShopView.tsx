"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import ProductGrid from "@/components/product/ProductGrid";
import Drawer from "@/components/ui/Drawer";
import FilterDropdown, { CheckboxList, type Option } from "@/components/shop/FilterDropdown";
import { useCatalog } from "@/context/catalog";
import { MEDIUM_LABELS, ORIENTATION_LABELS, ROOM_LABELS, STYLE_LABELS, SUBJECT_GROUPS, TYPE_LABELS } from "@/lib/labels";
import {
  FILTER_KEYS,
  PRICE_BUCKETS,
  SIZE_FILTERS,
  SORTS,
  applyFilters,
  filterLabel,
  splitValues,
  type FilterKey,
  type Filters,
} from "@/lib/filters";

type ListKey = Exclude<FilterKey, "q">;
type Selection = Partial<Record<ListKey, string[]>>;
type Section = { key: ListKey; title: string; options: Option[] };

const LIST_KEYS = FILTER_KEYS.filter((k): k is ListKey => k !== "q");
/** Filters that also get a quick dropdown in the toolbar. */
const QUICK_KEYS: ListKey[] = ["medium", "style", "price", "size"];

const toOptions = (labels: Record<string, string>): Option[] =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

const toggleValue = (values: string[], value: string) =>
  values.includes(value) ? values.filter((v) => v !== value) : [...values, value];

const toFilters = (sel: Selection): Filters =>
  Object.fromEntries(Object.entries(sel).filter(([, v]) => v.length > 0).map(([k, v]) => [k, v.join(",")]));

/** Filters fixed by the page (e.g. a category page) and hidden from the filter UI. */
export type LockedFilters = Partial<Record<"group" | "sub" | "medium" | "style", string>>;

export default function ShopView({ locked = {} }: { locked?: LockedFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const catalog = useCatalog();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draft, setDraft] = useState<Selection>({});

  const selection: Selection = {};
  for (const key of LIST_KEYS) {
    if (key in locked) continue;
    const values = splitValues(params.get(key) ?? undefined);
    if (values.length > 0) selection[key] = values;
  }
  const query = params.get("q") ?? "";
  const sort = params.get("sort") ?? "featured";

  const filterProducts = (sel: Selection) =>
    applyFilters(catalog.products, { ...toFilters(sel), ...locked, q: query || undefined, sort }, catalog.subName);
  const products = filterProducts(selection);

  const subsFor = (groups: string[]) =>
    (locked.group ? [locked.group] : groups).flatMap((g) => catalog.getGroup(g)?.subs ?? []);

  /** Sets one filter's values, dropping sub-categories that no longer belong to the chosen categories. */
  function withValues(sel: Selection, key: ListKey, values: string[]): Selection {
    const next = { ...sel, [key]: values };
    if (key === "group") {
      const allowed = new Set(subsFor(values).map((s) => s.slug));
      next.sub = (next.sub ?? []).filter((s) => allowed.has(s));
    }
    return next;
  }

  function navigate(update: (next: URLSearchParams) => void) {
    const next = new URLSearchParams(params.toString());
    update(next);
    const qs = next.toString().replace(/%2C/g, ",");
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function commit(sel: Selection) {
    navigate((next) => {
      for (const key of LIST_KEYS) {
        const values = sel[key] ?? [];
        if (values.length > 0) next.set(key, values.join(","));
        else next.delete(key);
      }
    });
  }

  function clearAll() {
    setDraft({});
    navigate((next) => {
      for (const key of FILTER_KEYS) next.delete(key);
    });
  }

  function openDrawer() {
    setDraft(selection);
    setDrawerOpen(true);
  }

  function sectionsFor(sel: Selection): Section[] {
    const subs = subsFor(sel.group ?? []);
    return [
      ...(!locked.group
        ? [{ key: "group" as const, title: "Category", options: SUBJECT_GROUPS.map((slug) => ({ value: slug, label: catalog.groupName(slug) })) }]
        : []),
      ...(!locked.sub && subs.length > 0
        ? [{ key: "sub" as const, title: "Sub-category", options: subs.map((s) => ({ value: s.slug, label: s.name })) }]
        : []),
      ...(!locked.medium ? [{ key: "medium" as const, title: "Medium", options: toOptions(MEDIUM_LABELS) }] : []),
      ...(!locked.style ? [{ key: "style" as const, title: "Style", options: toOptions(STYLE_LABELS) }] : []),
      { key: "price", title: "Price", options: PRICE_BUCKETS.map((b) => ({ value: b.key, label: b.label })) },
      { key: "size", title: "Size", options: SIZE_FILTERS.map((s) => ({ value: s.key, label: s.label })) },
      { key: "type", title: "Availability", options: toOptions(TYPE_LABELS) },
      { key: "orientation", title: "Orientation", options: toOptions(ORIENTATION_LABELS) },
      { key: "room", title: "Room", options: toOptions(ROOM_LABELS) },
    ];
  }

  const quickSections = sectionsFor(selection).filter((s) => QUICK_KEYS.includes(s.key));
  const chips = (Object.entries(selection) as [ListKey, string[]][]).flatMap(([key, values]) => values.map((value) => ({ key, value })));
  const activeCount = chips.length + (query ? 1 : 0);
  const draftCount = drawerOpen ? filterProducts(draft).length : 0;

  return (
    <div className="container-page py-10">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={openDrawer}
            className="flex items-center gap-2 bg-gold px-5 py-2 text-sm text-paper transition-colors hover:bg-gold-dark"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
            {activeCount > 0 && <span>({activeCount})</span>}
          </button>
          <div className="hidden flex-wrap items-center gap-3 md:flex">
            {quickSections.map((s) => (
              <FilterDropdown
                key={s.key}
                label={s.title}
                options={s.options}
                values={selection[s.key] ?? []}
                onChange={(values) => commit(withValues(selection, s.key, values))}
              />
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <span className="hidden text-muted sm:inline">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => navigate((next) => (e.target.value === "featured" ? next.delete("sort") : next.set("sort", e.target.value)))}
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

      {/* Result count + active filters */}
      <div className="mt-5 mb-8 flex flex-wrap items-center gap-2">
        <p className="mr-2 text-sm text-muted">
          {products.length} artwork{products.length === 1 ? "" : "s"}
        </p>
        {query && (
          <button
            type="button"
            onClick={() => navigate((next) => next.delete("q"))}
            className="flex items-center gap-1.5 bg-line px-3 py-1.5 text-xs hover:bg-ink hover:text-paper"
          >
            {filterLabel("q", query, catalog.subName)} <X className="h-3 w-3" />
          </button>
        )}
        {chips.map(({ key, value }) => (
          <button
            key={`${key}-${value}`}
            type="button"
            onClick={() => commit(withValues(selection, key, (selection[key] ?? []).filter((v) => v !== value)))}
            className="flex items-center gap-1.5 bg-line px-3 py-1.5 text-xs hover:bg-ink hover:text-paper"
          >
            {key === "group" ? catalog.groupName(value) : filterLabel(key, value, catalog.subName)} <X className="h-3 w-3" />
          </button>
        ))}
        {activeCount > 0 && (
          <button type="button" onClick={clearAll} className="text-xs underline underline-offset-4">
            Clear all
          </button>
        )}
      </div>

      {products.length === 0 && activeCount === 0 ? (
        // Nothing in this collection yet (e.g. a newly added category page).
        <div className="border border-dashed border-line px-6 py-20 text-center">
          <p className="font-serif text-2xl">New pieces are on their way</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            We&apos;re adding artworks to this collection soon. Want one now? We&apos;ll paint it for you.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/custom-art" className="btn-primary">
              Commission a piece
            </Link>
            <Link href="/shop" className="btn-outline">
              Browse all artworks
            </Link>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="border border-dashed border-line py-20 text-center">
          <p className="font-serif text-xl">No artworks match these filters</p>
          <button type="button" onClick={clearAll} className="btn-outline mt-6">
            Clear filters
          </button>
        </div>
      ) : (
        <ProductGrid products={products} priorityCount={4} />
      )}

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        side="left"
        title="Filters"
        footer={
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={clearAll} className="btn-outline px-3">
              Clear All
            </button>
            <button
              type="button"
              onClick={() => {
                commit(draft);
                setDrawerOpen(false);
              }}
              className="btn-primary px-3"
            >
              Apply Filters ({draftCount})
            </button>
          </div>
        }
      >
        <div className="divide-y divide-line px-5">
          {sectionsFor(draft).map((s) => (
            <div key={s.key} role="group" aria-label={s.title} className="py-5">
              <h3 className="mb-3 text-sm font-semibold">{s.title}</h3>
              <CheckboxList
                options={s.options}
                values={draft[s.key] ?? []}
                onToggle={(value) => setDraft((d) => withValues(d, s.key, toggleValue(d[s.key] ?? [], value)))}
              />
            </div>
          ))}
        </div>
      </Drawer>
    </div>
  );
}
