"use client";

import { useRef, useState, type DragEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const MAX_BYTES = 10 * 1024 * 1024;

/** Uploads straight from the browser to the public `media` bucket (admin-only by storage policy). */
async function uploadImage(file: File, folder: string) {
  if (!file.type.startsWith("image/")) throw new Error(`“${file.name}” is not an image.`);
  if (file.size > MAX_BYTES) throw new Error(`“${file.name}” is larger than 10 MB.`);
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const supabase = createClient();
  const { error } = await supabase.storage
    .from("media")
    .upload(path, file, { cacheControl: "31536000", contentType: file.type });
  if (error) throw new Error(error.message);
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

function useUploader(folder: string) {
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function upload(files: File[]) {
    setError(null);
    setBusy(files.length);
    const urls: string[] = [];
    for (const f of files) {
      try {
        urls.push(await uploadImage(f, folder));
      } catch (e) {
        setError((e as Error).message);
      }
      setBusy((n) => n - 1);
    }
    return urls;
  }
  return { busy: busy > 0, error, upload };
}

function dropFiles(e: DragEvent) {
  e.preventDefault();
  return Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
}

/** One image (hero slide, category). */
export function ImageUpload({
  value,
  onChange,
  folder,
  aspect = "aspect-[16/9]",
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  aspect?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const { busy, error, upload } = useUploader(folder);
  const [over, setOver] = useState(false);

  async function handle(files: File[]) {
    const [url] = await upload(files.slice(0, 1));
    if (url) onChange(url);
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          setOver(false);
          handle(dropFiles(e));
        }}
        className={`group relative ${aspect} w-full overflow-hidden border-2 border-dashed transition-colors ${
          over ? "border-gold bg-gold/5" : "border-line bg-card"
        }`}
      >
        {value ? (
          <>
            <Image src={value} alt="" fill sizes="600px" className="object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
              <button type="button" onClick={() => input.current?.click()} className="btn bg-white px-4 py-2 text-xs text-ink">
                <Upload className="h-4 w-4" /> Replace
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-sm text-muted hover:text-gold"
          >
            <ImagePlus className="h-8 w-8" />
            <span>Click to upload or drag an image here</span>
            <span className="text-xs">PNG, JPG or WebP · up to 10 MB</span>
          </button>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
          </div>
        )}
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          handle(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />
      {error && <p className="mt-2 text-xs text-sale">{error}</p>}
    </div>
  );
}

/** Ordered gallery (products). The first image is the cover shown in listings. */
export function ImageListUpload({
  value,
  onChange,
  folder,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  folder: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const { busy, error, upload } = useUploader(folder);

  async function handle(files: File[]) {
    const urls = await upload(files);
    if (urls.length) onChange([...value, ...urls]);
  }

  function move(i: number, dir: -1 | 1) {
    const next = [...value];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    onChange(next);
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((url, i) => (
          <div key={url} className="group relative aspect-[4/5] overflow-hidden border border-line bg-card">
            <Image src={url} alt="" fill sizes="160px" className="object-cover" />
            {i === 0 && (
              <span className="absolute top-1.5 left-1.5 bg-gold px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-white uppercase">
                Cover
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/55 p-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
              <button type="button" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move left" className="p-1 text-white disabled:opacity-30">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                aria-label="Remove image"
                className="p-1 text-white hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={i === value.length - 1}
                onClick={() => move(i, 1)}
                aria-label="Move right"
                className="p-1 text-white disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => input.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handle(dropFiles(e))}
          className="relative flex aspect-[4/5] flex-col items-center justify-center gap-1 border-2 border-dashed border-line bg-card text-xs text-muted transition-colors hover:border-gold hover:text-gold"
        >
          {busy ? <Loader2 className="h-6 w-6 animate-spin text-gold" /> : <ImagePlus className="h-6 w-6" />}
          <span>{busy ? "Uploading…" : "Add images"}</span>
        </button>
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          handle(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />
      {error && <p className="mt-2 text-xs text-sale">{error}</p>}
    </div>
  );
}
