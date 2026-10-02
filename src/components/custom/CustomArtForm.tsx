"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Upload, X } from "lucide-react";
import type { Medium } from "@/types";
import { SIZES, FREE_FRAME_SIZES } from "@/data/pricing";
import { MEDIUM_LABELS } from "@/data/categories";
import { customArtPrice, framePrice } from "@/lib/price";
import { formatINR } from "@/lib/format";

const MAX_PHOTOS = 5;

export default function CustomArtForm() {
  const [medium, setMedium] = useState<Medium>("pencil");
  const [size, setSize] = useState("A3");
  const [subjects, setSubjects] = useState(1);
  const [detailedBackground, setDetailedBackground] = useState(false);
  const [frame, setFrame] = useState(false);
  const [rush, setRush] = useState(false);
  const [photos, setPhotos] = useState<{ file: File; url: string }[]>([]);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const sizes = SIZES[medium].filter((s) => s.key !== "FILE");
  const quote = customArtPrice({ medium, size, subjects, detailedBackground, frame, rush });

  // Release preview object URLs when the component unmounts.
  const photosRef = useRef(photos);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.url)), []);

  function changeMedium(m: Medium) {
    setMedium(m);
    const keys = SIZES[m].map((s) => s.key);
    if (!keys.includes(size) || size === "FILE") setSize(m === "pencil" || m === "digital" ? "A3" : "18x24");
  }

  function addPhotos(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, MAX_PHOTOS - photos.length)
      .map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPhotos((p) => [...p, ...next]);
  }

  function removePhoto(url: string) {
    URL.revokeObjectURL(url);
    setPhotos((p) => p.filter((x) => x.url !== url));
  }

  if (submittedId) {
    return (
      <div className="border border-line bg-card p-10 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-gold" strokeWidth={1.25} />
        <h3 className="mt-4 font-serif text-2xl">Request received!</h3>
        <p className="mt-2 text-sm text-muted">
          Request ID <span className="font-medium text-ink">{submittedId}</span>. Our artist will contact you on WhatsApp
          within 24 hours with a confirmed quote and timeline.
        </p>
        <p className="mt-4 text-xs text-muted">Demo store — nothing was uploaded or charged.</p>
        <button type="button" className="btn-outline mt-8" onClick={() => setSubmittedId(null)}>
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form
      className="grid gap-10 lg:grid-cols-[1fr_360px]"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmittedId(`CUS-${Date.now().toString(36).toUpperCase()}`);
        photos.forEach((p) => URL.revokeObjectURL(p.url));
        setPhotos([]);
      }}
    >
      <div className="space-y-8">
        {/* Step 1: calculator */}
        <fieldset>
          <legend className="font-serif text-xl">1. Choose your artwork</legend>
          <div className="mt-5 space-y-5">
            <div>
              <p className="label">Medium</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(Object.keys(MEDIUM_LABELS) as Medium[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => changeMedium(m)}
                    aria-pressed={medium === m}
                    className={`border px-3 py-2.5 text-sm ${medium === m ? "border-ink bg-ink text-paper" : "border-line bg-card hover:border-ink"}`}
                  >
                    {MEDIUM_LABELS[m]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="label">Size</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {sizes.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setSize(s.key)}
                    aria-pressed={size === s.key}
                    className={`border px-3 py-2 text-left ${size === s.key ? "border-ink bg-ink text-paper" : "border-line bg-card hover:border-ink"}`}
                  >
                    <span className="block text-sm">{s.label}</span>
                    <span className={`block text-[11px] ${size === s.key ? "text-paper/70" : "text-muted"}`}>{s.detail}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="subjects" className="label">
                  Number of people / pets
                </label>
                <select id="subjects" value={subjects} onChange={(e) => setSubjects(Number(e.target.value))} className="input">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} {n > 1 ? `(+${(n - 1) * 40}%)` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="background" className="label">
                  Background
                </label>
                <select
                  id="background"
                  value={detailedBackground ? "detailed" : "simple"}
                  onChange={(e) => setDetailedBackground(e.target.value === "detailed")}
                  className="input"
                >
                  <option value="simple">Simple / plain</option>
                  <option value="detailed">Detailed scene (+20%)</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={frame} onChange={(e) => setFrame(e.target.checked)} className="accent-ink" />
                Add frame {FREE_FRAME_SIZES.includes(size) ? "(free on this size)" : `(+${formatINR(framePrice(size))})`}
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={rush} onChange={(e) => setRush(e.target.checked)} className="accent-ink" />
                Rush order — 7 days (+25%)
              </label>
            </div>
          </div>
        </fieldset>

        {/* Step 2: photos */}
        <fieldset>
          <legend className="font-serif text-xl">2. Upload your photos</legend>
          <p className="mt-1 text-xs text-muted">Clear, well-lit photos work best. Up to {MAX_PHOTOS} images.</p>
          <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-muted/50 bg-card px-6 py-10 text-center hover:border-ink">
            <Upload className="h-6 w-6 text-gold" />
            <span className="text-sm">Click to choose photos</span>
            <span className="text-xs text-muted">JPG or PNG</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              disabled={photos.length >= MAX_PHOTOS}
              onChange={(e) => {
                addPhotos(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
          {photos.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {photos.map((p) => (
                <div key={p.url} className="relative h-24 w-24 overflow-hidden bg-line">
                  <Image src={p.url} alt={p.file.name} fill unoptimized className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(p.url)}
                    aria-label="Remove photo"
                    className="absolute top-1 right-1 rounded-full bg-paper p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </fieldset>

        {/* Step 3: details */}
        <fieldset>
          <legend className="font-serif text-xl">3. Your details</legend>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="c-name" className="label">Name</label>
              <input id="c-name" required className="input" autoComplete="name" />
            </div>
            <div>
              <label htmlFor="c-phone" className="label">WhatsApp number</label>
              <input id="c-phone" required pattern="[6-9][0-9]{9}" inputMode="numeric" maxLength={10} className="input" title="10-digit mobile number" />
            </div>
            <div>
              <label htmlFor="c-email" className="label">Email</label>
              <input id="c-email" type="email" required className="input" autoComplete="email" />
            </div>
            <div>
              <label htmlFor="c-occasion" className="label">Occasion</label>
              <select id="c-occasion" className="input" defaultValue="">
                <option value="">Select (optional)</option>
                {["Birthday", "Anniversary", "Wedding", "Housewarming", "Memorial", "Festival", "Just because"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="c-deadline" className="label">Needed by</label>
              <input id="c-deadline" type="date" className="input" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="c-notes" className="label">Notes for the artist</label>
              <textarea id="c-notes" rows={3} className="input" placeholder="Background ideas, colours, text to include…" />
            </div>
          </div>
        </fieldset>
      </div>

      {/* Live quote */}
      <aside className="h-fit space-y-4 border border-line bg-card p-6 lg:sticky lg:top-28">
        <p className="eyebrow">Your estimate</p>
        <p className="font-serif text-4xl">{formatINR(quote.total)}</p>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">{MEDIUM_LABELS[medium]} · {sizes.find((s) => s.key === size)?.label}</dt>
            <dd>{formatINR(quote.painting)}</dd>
          </div>
          {frame && (
            <div className="flex justify-between">
              <dt className="text-muted">Frame</dt>
              <dd>{quote.frame === 0 ? "Free" : formatINR(quote.frame)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-line pt-2 font-medium">
            <dt>Advance to start (50%)</dt>
            <dd>{formatINR(quote.advance)}</dd>
          </div>
        </dl>
        <ul className="space-y-1 text-xs text-muted">
          <li>✓ Free digital preview before painting</li>
          <li>✓ 2 free revisions</li>
          <li>✓ Delivery in {rush ? "7–10" : "12–18"} days</li>
        </ul>
        <button type="submit" className="btn-primary w-full" disabled={photos.length === 0}>
          Submit request
        </button>
        {photos.length === 0 && <p className="text-center text-xs text-muted">Upload at least one photo to continue.</p>}
      </aside>
    </form>
  );
}
