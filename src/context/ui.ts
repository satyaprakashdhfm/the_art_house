"use client";

import { createStore, useStore } from "@/lib/store";

type UIState = {
  cartOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  toast: { id: number; message: string } | null;
};

const uiStore = createStore<UIState>({ cartOpen: false, searchOpen: false, menuOpen: false, toast: null });

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export const ui = {
  openCart: () => uiStore.set((s) => ({ ...s, cartOpen: true, searchOpen: false, menuOpen: false })),
  closeCart: () => uiStore.set((s) => ({ ...s, cartOpen: false })),
  openSearch: () => uiStore.set((s) => ({ ...s, searchOpen: true, cartOpen: false, menuOpen: false })),
  closeSearch: () => uiStore.set((s) => ({ ...s, searchOpen: false })),
  openMenu: () => uiStore.set((s) => ({ ...s, menuOpen: true })),
  closeMenu: () => uiStore.set((s) => ({ ...s, menuOpen: false })),
  toast(message: string) {
    clearTimeout(toastTimer);
    uiStore.set((s) => ({ ...s, toast: { id: Date.now(), message } }));
    toastTimer = setTimeout(() => uiStore.set((s) => ({ ...s, toast: null })), 2500);
  },
};

export function useUI() {
  return useStore(uiStore);
}
