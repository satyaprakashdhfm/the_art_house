"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

const LABELS = ["Artwork", "Close-up detail", "View in room"];

/** Full-screen viewer: the whole painting, arrows / ← → to browse, Esc or click outside to close. */
function Lightbox({ images, index, title, onClose, onMove }: { images: string[]; index: number; title: string; onClose: () => void; onMove: (dir: -1 | 1) => void }) {
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
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[70] bg-black/90" onClick={onClose}>
      <button type="button" onClick={onClose} aria-label="Close" className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white">
        <X className="h-6 w-6" />
      </button>
      <div className="absolute inset-4 sm:inset-12" onClick={(e) => e.stopPropagation()}>
        <Image src={images[index]} alt={title} fill sizes="100vw" quality={90} className="object-contain" />
      </div>
      {images.length > 1 && (
        <>
          <button type="button" onClick={(e) => (e.stopPropagation(), onMove(-1))} aria-label="Previous image" className={`${arrow} left-3 sm:left-6`}>
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button type="button" onClick={(e) => (e.stopPropagation(), onMove(1))} aria-label="Next image" className={`${arrow} right-3 sm:right-6`}>
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
    </div>
  );
}

export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [full, setFull] = useState(false);
  // Width / height of each image once loaded, so the frame matches the painting's real shape.
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const ratio = ratios[images[active]] ?? 4 / 5;

  const count = images.length;
  const move = useCallback((dir: -1 | 1) => setActive((i) => (i + dir + count) % count), [count]);
  const close = useCallback(() => setFull(false), []);

  return (
    // self-start: don't stretch to the height of the details column beside it.
    <div className="flex flex-col-reverse gap-3 self-start sm:flex-row sm:items-start lg:sticky lg:top-28">
      {images.length > 1 && (
        <div className="flex gap-3 sm:flex-col">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${LABELS[i] ?? `image ${i + 1}`}`}
              className={`relative aspect-square w-16 overflow-hidden border-2 bg-card sm:w-20 ${
                i === active ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="relative min-w-0 flex-1">
        <div
          className="relative mx-auto max-h-[78vh] w-full cursor-zoom-in overflow-hidden bg-card"
          style={{ aspectRatio: ratio }}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
          }}
          onMouseLeave={() => setZoom(null)}
          onClick={() => setFull(true)}
        >
          <Image
            src={images[active]}
            alt={`${title} — ${LABELS[active] ?? ""}`}
            fill
            priority
            quality={90}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain transition-transform duration-200"
            style={zoom ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            onLoad={(e) => {
              const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
              if (w && h) setRatios((r) => (r[images[active]] ? r : { ...r, [images[active]]: w / h }));
            }}
          />
          <span className="absolute bottom-3 left-3 bg-paper/90 px-2 py-1 text-[10px] tracking-widest uppercase">{LABELS[active]}</span>
        </div>
        <button
          type="button"
          onClick={() => setFull(true)}
          aria-label="View full screen"
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-ink shadow transition-colors hover:bg-paper hover:text-gold"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {full && <Lightbox images={images} index={active} title={title} onClose={close} onMove={move} />}
    </div>
  );
}
