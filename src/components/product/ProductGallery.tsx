"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const labels = ["Artwork", "Close-up detail", "View in room"];

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      <div className="flex gap-3 sm:flex-col">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show ${labels[i] ?? `image ${i + 1}`}`}
            className={`relative aspect-square w-16 overflow-hidden border-2 sm:w-20 ${
              i === active ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <Image src={src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
      <div
        className="relative aspect-[4/5] flex-1 cursor-zoom-in overflow-hidden bg-line"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onMouseLeave={() => setZoom(null)}
      >
        <Image
          src={images[active]}
          alt={`${title} — ${labels[active] ?? ""}`}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-200"
          style={zoom ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
        />
        <span className="absolute bottom-3 left-3 bg-paper/90 px-2 py-1 text-[10px] tracking-widest uppercase">
          {labels[active]}
        </span>
      </div>
    </div>
  );
}
