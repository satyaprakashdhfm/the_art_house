"use client";

import type { Addons, CartLine, Product } from "@/types";
import { createStore, useStore } from "@/lib/store";
import { isDigitalFile } from "@/lib/price";

type CartState = { lines: CartLine[]; coupon: string | null };

const cartStore = createStore<CartState>({ lines: [], coupon: null }, "tah-cart");

function lineKey(productId: string, size: string, addons: Addons) {
  return [productId, size, addons.frame ? "f" : "", addons.giftWrap ? "g" : "", addons.express ? "e" : ""].join("|");
}

function maxQty(product: Product) {
  // One-of-a-kind originals can only be bought once.
  return product.type === "original" ? 1 : 10;
}

export const cartActions = {
  add(product: Product, size: string, addons: Addons, qty = 1) {
    const clean = isDigitalFile(size) ? { frame: false, giftWrap: false, express: false } : addons;
    const key = lineKey(product.id, size, clean);
    const max = maxQty(product);
    cartStore.set((s) => {
      const existing = s.lines.find((l) => l.key === key);
      const lines = existing
        ? s.lines.map((l) => (l.key === key ? { ...l, max, qty: Math.min(max, l.qty + qty) } : l))
        : [...s.lines, { key, productId: product.id, size, addons: clean, qty: Math.min(max, qty), max }];
      return { ...s, lines };
    });
  },
  setQty(key: string, qty: number) {
    cartStore.set((s) => ({
      ...s,
      lines: s.lines
        .map((l) => (l.key === key ? { ...l, qty: Math.min(l.max ?? 10, qty) } : l))
        .filter((l) => l.qty > 0),
    }));
  },
  remove(key: string) {
    cartStore.set((s) => ({ ...s, lines: s.lines.filter((l) => l.key !== key) }));
  },
  setCoupon(code: string | null) {
    cartStore.set((s) => ({ ...s, coupon: code }));
  },
  clear() {
    cartStore.set({ lines: [], coupon: null });
  },
};

export function useCart() {
  return useStore(cartStore);
}

export function useCartCount() {
  return useCart().lines.reduce((n, l) => n + l.qty, 0);
}

/** Last placed (mock) order, shown on the confirmation page. */
export type MockOrder = {
  id: string;
  name: string;
  email: string;
  city: string;
  payment: "online" | "cod";
  total: number;
  items: number;
  placedAt: string;
};

const orderStore = createStore<MockOrder | null>(null, "tah-last-order");

export const setLastOrder = (o: MockOrder) => orderStore.set(o);
export const useLastOrder = () => useStore(orderStore);
