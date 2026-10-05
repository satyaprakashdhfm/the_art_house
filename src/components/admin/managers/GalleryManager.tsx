"use client";

import Image from "next/image";
import CollectionManager from "@/components/admin/CollectionManager";
import { MEDIUM_LABELS } from "@/lib/labels";
import type { GalleryItemRow } from "@/lib/db";

const DEFAULTS: GalleryItemRow = {
  id: "",
  title: "",
  medium: "oil",
  size_label: "",
  year: new Date().getFullYear(),
  note: "",
  image: "",
  is_sold: true,
  is_active: true,
  sort_order: 0,
};

export default function GalleryManager({ rows }: { rows: GalleryItemRow[] }) {
  return (
    <CollectionManager<GalleryItemRow>
      table="gallery_items"
      rows={rows}
      keyField="id"
      itemName="artwork"
      defaults={DEFAULTS}
      flags={[
        { field: "is_active", label: "Showing" },
        { field: "is_sold", label: "Sold label" },
      ]}
      searchable={(r) => `${r.title} ${r.note}`}
      validate={(r) => (r.image ? null : "Please upload a photo of the artwork.")}
      emptyText="No artworks in the gallery yet."
      fields={[
        { name: "image", label: "Photo", type: "image", folder: "gallery", aspect: "aspect-[4/5]", help: "Portrait photos work best (4:5, at least 1200 × 1500 px)." },
        { name: "title", label: "Title", type: "text", required: true, wide: true, placeholder: "e.g. Radha Krishna" },
        {
          name: "medium",
          label: "Medium",
          type: "select",
          options: Object.entries(MEDIUM_LABELS).map(([value, label]) => ({ value, label })),
        },
        { name: "size_label", label: "Size", type: "text", placeholder: 'e.g. 24 × 36" or A3' },
        { name: "year", label: "Year", type: "number", min: 1900, max: 2100, help: "Leave empty to hide." },
        {
          name: "note",
          label: "Short note",
          type: "text",
          wide: true,
          placeholder: "e.g. Oil on canvas · Commissioned for a family in Hyderabad",
          help: "One line shown under the details. Optional.",
        },
        { name: "is_sold", label: "Show “Sold” label", type: "toggle" },
      ]}
      renderItem={(r) => (
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-13 shrink-0 overflow-hidden bg-card">
            {r.image && <Image src={r.image} alt="" fill sizes="52px" className="object-cover" />}
          </div>
          <div className="min-w-0">
            <p className="truncate font-serif text-lg">{r.title}</p>
            <p className="truncate text-xs text-muted">
              {[MEDIUM_LABELS[r.medium], r.size_label, r.year].filter(Boolean).join(" · ")}
            </p>
            {r.note && <p className="truncate text-xs text-muted">{r.note}</p>}
          </div>
        </div>
      )}
    />
  );
}
