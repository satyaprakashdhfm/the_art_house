import type { Orientation } from "@/types";

/** Seeded placeholder image (stable across reloads). Swap for real artwork later. */
export function placeholder(seed: string, width = 800, height = 1000) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}

export function imageFor(seed: string, orientation: Orientation) {
  if (orientation === "landscape") return placeholder(seed, 1000, 750);
  if (orientation === "square") return placeholder(seed, 900, 900);
  return placeholder(seed, 800, 1000);
}
