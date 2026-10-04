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

export function applyFilters(products: Product[], f: Filters, subName: (slug: string) => string) {
  const bucket = PRICE_BUCKETS.find((b) => b.key === f.price);
  const q = f.q?.trim().toLowerCase();
  const result = products.filter((p) => {
    if (f.group && p.group !== f.group) return false;
    if (f.sub && p.subCategory !== f.sub) return false;
    if (f.medium && p.medium !== f.medium) return false;
    if (f.style && p.style !== f.style) return false;
    if (f.size && !p.sizes.includes(f.size)) return false;
    if (f.orientation && p.orientation !== f.orientation) return false;
    if (f.type && p.type !== f.type) return false;
    if (f.room && !p.rooms.includes(f.room as Product["rooms"][number])) return false;
    if (bucket) {
      const from = startingPrice(p);
      if (from < bucket.min || from > bucket.max) return false;
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
