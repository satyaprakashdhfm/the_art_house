"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { MEDIUM_LABELS } from "@/lib/labels";
import type { GalleryItem, Medium } from "@/types";

const details = (item: GalleryItem) => [MEDIUM_LABELS[item.medium], item.size, item.year].filter(Boolean).join(" · ");

function Lightbox({ items, index, onClose, onMove }: { items: GalleryItem[]; index: number; onClose: () => void; onMove: (dir: -1 | 1) => void }) {
  const item = items[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onMove(-1);
      if (e.key === "ArrowRight") onMove(1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onMove]);

  const arrow = "absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/25";

  return (
    <div role="dialog" aria-modal="true" aria-label={item.title} className="fixed inset-0 z-50 flex flex-col bg-black/90" onClick={onClose}>
      <button type="button" onClick={onClose} aria-label="Close" className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white">
        <X className="h-6 w-6" />
      </button>
      <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
        <Image src={item.image} alt={item.title} fill sizes="100vw" quality={90} className="object-contain p-4 sm:p-12" />
        {items.length > 1 && (
          <>
            <button type="button" onClick={() => onMove(-1)} aria-label="Previous artwork" className={`${arrow} left-3 sm:left-6`}>
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button type="button" onClick={() => onMove(1)} aria-label="Next artwork" className={`${arrow} right-3 sm:right-6`}>
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
      <div className="px-4 pb-6 text-center text-white" onClick={(e) => e.stopPropagation()}>
        <p className="font-serif text-xl">{item.title}</p>
        <p className="mt-1 text-sm text-white/75">{details(item)}</p>
        {item.note && <p className="mt-1 text-sm text-white/60">{item.note}</p>}
        <p className="mt-2 text-xs text-white/40">
          {index + 1} / {items.length}
        </p>
      </div>
    </div>
  );
}

export default function GalleryView({ items }: { items: GalleryItem[] }) {
  const [medium, setMedium] = useState<Medium | "all">("all");
  const [open, setOpen] = useState<number | null>(null);

  // Only offer tabs for mediums that have artworks.
  const tabs = (Object.keys(MEDIUM_LABELS) as Medium[]).filter((m) => items.some((i) => i.medium === m));
  const shown = medium === "all" ? items : items.filter((i) => i.medium === medium);
  const count = shown.length;
  const close = useCallback(() => setOpen(null), []);
  const move = useCallback((dir: -1 | 1) => setOpen((i) => ((i ?? 0) + dir + count) % count), [count]);

  if (items.length === 0) {
    return <p className="py-20 text-center text-muted">New works are on their way — check back soon.</p>;
  }

  const tab = (value: Medium | "all", label: string) => (
    <button
      key={value}
      type="button"
      aria-pressed={medium === value}
      onClick={() => setMedium(value)}
      className={`border px-4 py-2 text-sm transition-colors ${medium === value ? "border-ink bg-ink text-paper" : "border-line bg-card hover:border-ink"}`}
    >
      {label}
    </button>
  );

  return (
    <>
      {tabs.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {tab("all", "All")}
          {tabs.map((m) => tab(m, MEDIUM_LABELS[m]))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {shown.map((item, i) => (
          <figure key={item.id}>
            <button type="button" onClick={() => setOpen(i)} className="group relative block aspect-[4/5] w-full overflow-hidden bg-line" aria-label={`View ${item.title}`}>
              <Image
                src={item.image}
                alt={item.title}
                fill
                priority={i < 4}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {item.isSold && (
                <span className="absolute top-3 left-3 bg-paper/95 px-2 py-1 text-[10px] font-medium tracking-widest uppercase">Sold</span>
              )}
            </button>
            <figcaption className="mt-3 space-y-1">
              <p className="font-serif text-lg leading-snug">{item.title}</p>
              <p className="text-xs text-muted">{details(item)}</p>
              {item.note && <p className="text-xs text-muted">{item.note}</p>}
            </figcaption>
          </figure>
        ))}
      </div>

      {open !== null && shown[open] && (
        <Lightbox
          items={shown}
          index={open}
          onClose={close}
          onMove={move}
        />
      )}
    </>
  );
}
