"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, CloudUpload, X } from "lucide-react";

export type Photo = { file: File; url: string };

export const MAX_PHOTOS = 5;
const MAX_BYTES = 10 * 1024 * 1024;

const GOOD = ["Good lighting", "Clear face", "Front-facing", "Natural expression"];
const AVOID = ["Blurry photos", "Dark lighting", "Side or covered face", "Very distant photos"];

/** Drag-and-drop photo picker with previews and limits (images only, 10 MB each, up to 5). */
export default function PhotoDropzone({ photos, onChange }: { photos: Photo[]; onChange: (photos: Photo[]) => void }) {
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const full = photos.length >= MAX_PHOTOS;

  function add(files: FileList | null) {
    if (!files) return;
    const all = Array.from(files);
    const images = all.filter((f) => f.type.startsWith("image/"));
    const small = images.filter((f) => f.size <= MAX_BYTES);
    const accepted = small.slice(0, MAX_PHOTOS - photos.length);

    const skipped = [
      all.length - images.length && `${all.length - images.length} not an image`,
      images.length - small.length && `${images.length - small.length} over 10 MB`,
      small.length - accepted.length && `${small.length - accepted.length} over the ${MAX_PHOTOS}-photo limit`,
    ].filter(Boolean);
    setNotice(skipped.length ? `Skipped: ${skipped.join(", ")}.` : null);

    onChange([...photos, ...accepted.map((file) => ({ file, url: URL.createObjectURL(file) }))]);
  }

  function remove(url: string) {
    URL.revokeObjectURL(url);
    onChange(photos.filter((p) => p.url !== url));
    setNotice(null);
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_260px]">
      <div>
        <label
          onDragOver={(e) => {
            e.preventDefault();
            if (!full) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (!full) add(e.dataTransfer.files);
          }}
          className={`flex min-h-64 flex-col items-center justify-center gap-3 border-2 border-dashed px-6 py-12 text-center transition-colors ${
            full ? "cursor-not-allowed border-line bg-card/50 opacity-60" : "cursor-pointer hover:border-gold"
          } ${dragging ? "border-gold bg-gold/5" : "border-gold/40 bg-card"}`}
        >
          <CloudUpload className="h-11 w-11 text-gold" strokeWidth={1.25} />
          <span className="font-serif text-xl">
            {full ? "Photo limit reached" : (
              <>
                Drag &amp; drop your photos here
                <span className="block text-base text-muted">
                  or <span className="text-gold underline underline-offset-4">click to browse</span>
                </span>
              </>
            )}
          </span>
          <span className="text-xs text-muted">
            JPG or PNG (max 10 MB each) · Up to {MAX_PHOTOS} photos
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            disabled={full}
            onChange={(e) => {
              add(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
        {notice && <p className="mt-2 text-xs text-sale">{notice}</p>}

        {photos.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-muted">
              {photos.length} of {MAX_PHOTOS} photos added
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              {photos.map((p) => (
                <div key={p.url} className="relative h-24 w-24 overflow-hidden border border-line bg-line">
                  <Image src={p.url} alt={p.file.name} fill unoptimized className="object-cover" />
                  <button
                    type="button"
                    onClick={() => remove(p.url)}
                    aria-label={`Remove ${p.file.name}`}
                    className="absolute top-1 right-1 rounded-full bg-paper p-1 shadow hover:text-sale"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border border-line bg-card p-5">
        <p className="font-serif text-lg">Photo guidelines</p>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-1">
          <div>
            <p className="text-xs font-medium tracking-wide text-ink uppercase">Good examples</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {GOOD.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-green-700" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium tracking-wide text-sale uppercase">Avoid these</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {AVOID.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <X className="h-4 w-4 shrink-0 text-sale" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
