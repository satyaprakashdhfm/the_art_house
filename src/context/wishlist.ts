"use client";

import { createStore, useStore } from "@/lib/store";

const wishlistStore = createStore<string[]>([], "tah-wishlist");

export const wishlistActions = {
  toggle(productId: string) {
    let added = false;
    wishlistStore.set((ids) => {
      added = !ids.includes(productId);
      return added ? [...ids, productId] : ids.filter((id) => id !== productId);
    });
    return added;
  },
  remove(productId: string) {
    wishlistStore.set((ids) => ids.filter((id) => id !== productId));
  },
};

export function useWishlist() {
  return useStore(wishlistStore);
}
