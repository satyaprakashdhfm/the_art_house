"use client";

import { useSyncExternalStore } from "react";

type Updater<T> = T | ((prev: T) => T);

/**
 * Tiny external store, optionally persisted to localStorage.
 * Mock-phase replacement for a backend; server render always uses `initial`.
 */
export function createStore<T>(initial: T, storageKey?: string) {
  let state = initial;
  let loaded = !storageKey;
  const listeners = new Set<() => void>();

  function load() {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(storageKey!);
      if (raw) state = JSON.parse(raw) as T;
    } catch {
      // Storage unavailable or corrupt: keep defaults.
    }
  }

  const store = {
    get() {
      load();
      return state;
    },
    getServer() {
      return initial;
    },
    set(updater: Updater<T>) {
      load();
      state = typeof updater === "function" ? (updater as (p: T) => T)(state) : updater;
      if (storageKey) {
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(state));
        } catch {
          // Ignore quota / privacy-mode errors.
        }
      }
      listeners.forEach((l) => l());
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
  return store;
}

export function useStore<T>(store: ReturnType<typeof createStore<T>>) {
  return useSyncExternalStore(store.subscribe, store.get, store.getServer);
}
