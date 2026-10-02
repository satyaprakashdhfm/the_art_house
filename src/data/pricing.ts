import type { Medium, Style } from "@/types";

/** All prices in INR. Edit this file to change pricing across the site. */

export type SizeOption = { key: string; label: string; detail: string };

export const SIZES: Record<Medium, SizeOption[]> = {
  pencil: [
    { key: "A5", label: "A5", detail: '5.8 × 8.3"' },
    { key: "A4", label: "A4", detail: '8.3 × 11.7"' },
    { key: "A3", label: "A3", detail: '11.7 × 16.5"' },
    { key: "A2", label: "A2", detail: '16.5 × 23.4"' },
    { key: "A1", label: "A1", detail: '23.4 × 33.1"' },
  ],
  digital: [
    { key: "FILE", label: "Digital file", detail: "High-res download" },
    { key: "A4", label: "A4 print", detail: '8.3 × 11.7"' },
    { key: "A3", label: "A3 print", detail: '11.7 × 16.5"' },
    { key: "A2", label: "A2 print", detail: '16.5 × 23.4"' },
    { key: "A1", label: "A1 print", detail: '23.4 × 33.1"' },
  ],
  acrylic: [
    { key: "12x12", label: '12 × 12"', detail: "Canvas" },
    { key: "12x16", label: '12 × 16"', detail: "Canvas" },
    { key: "18x24", label: '18 × 24"', detail: "Canvas" },
    { key: "24x36", label: '24 × 36"', detail: "Canvas" },
    { key: "36x48", label: '36 × 48"', detail: "Canvas" },
  ],
  oil: [
    { key: "12x12", label: '12 × 12"', detail: "Canvas" },
    { key: "12x16", label: '12 × 16"', detail: "Canvas" },
    { key: "18x24", label: '18 × 24"', detail: "Canvas" },
    { key: "24x36", label: '24 × 36"', detail: "Canvas" },
    { key: "36x48", label: '36 × 48"', detail: "Canvas" },
  ],
};

export const BASE_PRICES: Record<Medium, Record<string, number>> = {
  pencil: { A5: 699, A4: 999, A3: 1699, A2: 2799, A1: 4499 },
  digital: { FILE: 499, A4: 899, A3: 1399, A2: 1999, A1: 2999 },
  acrylic: { "12x12": 2499, "12x16": 3499, "18x24": 5999, "24x36": 10999, "36x48": 18999 },
  oil: { "12x12": 3499, "12x16": 4799, "18x24": 8999, "24x36": 14999, "36x48": 25999 },
};

/** Multipliers by sub-category (subject). Missing = 1. */
export const SUBCATEGORY_MULTIPLIER: Record<string, number> = {
  "couple-art": 1.25,
  horses: 1.15,
  wildlife: 1.15,
};

/** Multipliers by art style. Missing = 1. */
export const STYLE_MULTIPLIER: Partial<Record<Style, number>> = {
  abstract: 0.9,
};

/** Wall-art set multipliers by number of panels. */
export const PANEL_MULTIPLIER: Record<number, number> = { 1: 1, 2: 2.2, 3: 3 };

/** Each extra person / pet in a portrait adds 40%. */
export const EXTRA_SUBJECT_RATE = 0.4;
export const DETAILED_BACKGROUND_RATE = 0.2;
export const RUSH_RATE = 0.25;

/** Frame price by size. Large sizes get a free frame (see FREE_FRAME_SIZES). */
export const FRAME_PRICES: Record<string, number> = {
  A5: 299,
  A4: 349,
  A3: 549,
  A2: 899,
  A1: 1399,
  "12x12": 549,
  "12x16": 549,
  "18x24": 899,
  "24x36": 1999,
  "36x48": 1999,
};

export const FREE_FRAME_SIZES = ["A2", "A1", "24x36", "36x48"];

export const GIFT_WRAP_PRICE = 99;
export const EXPRESS_PRICE = 299;
export const COD_FEE = 49;
export const SHIPPING_FEE = 99;
export const FREE_SHIPPING_THRESHOLD = 1999;
export const PREPAID_DISCOUNT_RATE = 0.05;
