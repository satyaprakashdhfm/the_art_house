import type { Product } from "@/types";
import { MEDIUM_LABELS, ORIENTATION_LABELS, ROOM_LABELS, STYLE_LABELS, TYPE_LABELS } from "@/lib/labels";
import { startingPrice } from "@/lib/price";

export const PRICE_BUCKETS = [
  { key: "under-999", label: "Under ₹999", min: 0, max: 999 },
  { key: "1000-2999", label: "₹1,000 – ₹2,999", min: 1000, max: 2999 },
  { key: "3000-6999", label: "₹3,000 – ₹6,999", min: 3000, max: 6999 },
  { key: "7000-plus", label: "₹7,000 & above", min: 7000, max: Infinity },
];

export const SIZE_FILTERS = [
  { key: "A4", label: "A4" },
  { key: "A3", label: "A3" },
  { key: "A2", label: "A2" },
  { key: "A1", label: "A1" },
  { key: "12x16", label: '12 × 16"' },
  { key: "18x24", label: '18 × 24"' },
  { key: "24x36", label: '24 × 36"' },
  { key: "36x48", label: '36 × 48"' },
];

export const SORTS = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
] as const;

export type FilterKey = "group" | "sub" | "medium" | "style" | "size" | "price" | "orientation" | "type" | "room" | "q";
export type Filters = Partial<Record<FilterKey, string>> & { sort?: string };

export const FILTER_KEYS: FilterKey[] = ["group", "sub", "medium", "style", "size", "price", "orientation", "type", "room", "q"];

/** Multi-select filters are stored comma-separated in the URL, e.g. ?medium=oil,acrylic. */
export function splitValues(value?: string) {
  return value ? value.split(",").filter(Boolean) : [];
}

/** Values within one filter are OR-ed; different filters are AND-ed. */
export function applyFilters(products: Product[], f: Filters, subName: (slug: string) => string) {
  const list = (key: FilterKey) => splitValues(f[key]);
  const matches = (allowed: string[], value: string) => allowed.length === 0 || allowed.includes(value);
  const overlaps = (allowed: string[], values: string[]) => allowed.length === 0 || values.some((v) => allowed.includes(v));

  const [groups, subs, mediums, styles, sizes, orientations, types, rooms] = (
    ["group", "sub", "medium", "style", "size", "orientation", "type", "room"] as const
  ).map(list);
  const prices = list("price");
  const buckets = PRICE_BUCKETS.filter((b) => prices.includes(b.key));
  const q = f.q?.trim().toLowerCase();
  const result = products.filter((p) => {
    if (!matches(groups, p.group)) return false;
    if (!matches(subs, p.subCategory)) return false;
    if (!matches(mediums, p.medium)) return false;
    if (!matches(styles, p.style)) return false;
    if (!overlaps(sizes, p.sizes)) return false;
    if (!matches(orientations, p.orientation)) return false;
    if (!matches(types, p.type)) return false;
    if (!overlaps(rooms, p.rooms)) return false;
    if (buckets.length > 0) {
      const from = startingPrice(p);
      if (!buckets.some((b) => from >= b.min && from <= b.max)) return false;
    }
    if (q) {
      const hay = [p.title, subName(p.subCategory), MEDIUM_LABELS[p.medium], STYLE_LABELS[p.style]].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  switch (f.sort) {
    case "newest":
      return result.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew) || b.id.localeCompare(a.id));
    case "price-asc":
      return result.sort((a, b) => startingPrice(a) - startingPrice(b));
    case "price-desc":
      return result.sort((a, b) => startingPrice(b) - startingPrice(a));
    default:
      return result.sort((a, b) => Number(!!b.isBestseller) - Number(!!a.isBestseller));
  }
}

/** Human label for an active filter chip. */
export function filterLabel(key: FilterKey, value: string, subName: (slug: string) => string) {
  switch (key) {
    case "sub":
      return subName(value);
    case "medium":
      return MEDIUM_LABELS[value as keyof typeof MEDIUM_LABELS] ?? value;
    case "style":
      return STYLE_LABELS[value as keyof typeof STYLE_LABELS] ?? value;
    case "type":
      return TYPE_LABELS[value as keyof typeof TYPE_LABELS] ?? value;
    case "room":
      return ROOM_LABELS[value as keyof typeof ROOM_LABELS] ?? value;
    case "orientation":
      return ORIENTATION_LABELS[value as keyof typeof ORIENTATION_LABELS] ?? value;
    case "price":
      return PRICE_BUCKETS.find((b) => b.key === value)?.label ?? value;
    case "size":
      return SIZE_FILTERS.find((s) => s.key === value)?.label ?? value;
    case "q":
      return `“${value}”`;
    default:
      return value;
  }
}
