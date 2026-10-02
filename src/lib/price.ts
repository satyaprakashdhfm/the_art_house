import type { Addons, Medium, Product } from "@/types";
import {
  BASE_PRICES,
  DETAILED_BACKGROUND_RATE,
  EXPRESS_PRICE,
  EXTRA_SUBJECT_RATE,
  FRAME_PRICES,
  FREE_FRAME_SIZES,
  GIFT_WRAP_PRICE,
  PANEL_MULTIPLIER,
  RUSH_RATE,
  SIZES,
  STYLE_MULTIPLIER,
  SUBCATEGORY_MULTIPLIER,
} from "@/data/pricing";

/** Round to a friendly "…99" price, e.g. 803 → 799. */
export function friendly(n: number) {
  return Math.max(99, Math.round(n / 100) * 100 - 1);
}

export function productPrice(product: Product, size: string) {
  const base = BASE_PRICES[product.medium][size];
  if (base === undefined) return 0;
  const sub = SUBCATEGORY_MULTIPLIER[product.subCategory] ?? 1;
  const style = STYLE_MULTIPLIER[product.style] ?? 1;
  const panels = PANEL_MULTIPLIER[product.panels ?? 1] ?? 1;
  const subjects = 1 + EXTRA_SUBJECT_RATE * Math.max(0, (product.subjects ?? 1) - 1);
  const raw = base * sub * style * panels * subjects;
  return raw === base ? base : friendly(raw);
}

export function startingPrice(product: Product) {
  return Math.min(...product.sizes.map((s) => productPrice(product, s)));
}

export function isDigitalFile(size: string) {
  return size === "FILE";
}

export function framePrice(size: string) {
  if (isDigitalFile(size)) return 0;
  return FREE_FRAME_SIZES.includes(size) ? 0 : (FRAME_PRICES[size] ?? 0);
}

export function addonsPrice(size: string, addons: Addons) {
  if (isDigitalFile(size)) return 0;
  return (
    (addons.frame ? framePrice(size) : 0) +
    (addons.giftWrap ? GIFT_WRAP_PRICE : 0) +
    (addons.express ? EXPRESS_PRICE : 0)
  );
}

export function sizeLabel(medium: Medium, size: string) {
  return SIZES[medium].find((s) => s.key === size)?.label ?? size;
}

export type CustomQuote = {
  medium: Medium;
  size: string;
  subjects: number;
  detailedBackground: boolean;
  frame: boolean;
  rush: boolean;
};

export function customArtPrice(q: CustomQuote) {
  const base = BASE_PRICES[q.medium][q.size] ?? 0;
  let price = base * (1 + EXTRA_SUBJECT_RATE * Math.max(0, q.subjects - 1));
  if (q.detailedBackground) price *= 1 + DETAILED_BACKGROUND_RATE;
  if (q.rush) price *= 1 + RUSH_RATE;
  const painting = price === base ? base : friendly(price);
  const frame = q.frame ? framePrice(q.size) : 0;
  return { painting, frame, total: painting + frame, advance: Math.round((painting + frame) / 2) };
}
