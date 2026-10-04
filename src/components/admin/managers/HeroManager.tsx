"use client";

import Image from "next/image";
import CollectionManager from "@/components/admin/CollectionManager";
import type { HeroSlideRow } from "@/lib/db";

const DEFAULTS: HeroSlideRow = {
  id: "",
  eyebrow: "",
  title: "",
  text: "",
  cta_label: "Shop now",
  cta_href: "/shop",
  image: "",
  tone: "dark",
  is_active: true,
  sort_order: 0,
};

export default function HeroManager({ rows }: { rows: HeroSlideRow[] }) {
  return (
    <CollectionManager<HeroSlideRow>
      table="hero_slides"
      rows={rows}
      keyField="id"
      itemName="slide"
      defaults={DEFAULTS}
      flags={[{ field: "is_active", label: "Showing" }]}
      validate={(r) => (r.image ? null : "Please upload a background image.")}
      fields={[
        { name: "image", label: "Background image", type: "image", folder: "hero", aspect: "aspect-[16/7]" },
        {
          name: "tone",
          label: "Text colour",
          type: "select",
          help: "Pick dark text for bright photos, white text for dark photos.",
          options: [
            { value: "light", label: "Dark text (for bright images)" },
            { value: "dark", label: "White text (for dark images)" },
          ],
        },
        { name: "eyebrow", label: "Small heading", type: "text", placeholder: "e.g. Festive Collection" },
        { name: "title", label: "Main heading", type: "text", required: true, wide: true, placeholder: "e.g. Transform Your Space" },
        { name: "text", label: "Description", type: "textarea" },
        { name: "cta_label", label: "Button text", type: "text", required: true },
        { name: "cta_href", label: "Button link", type: "text", required: true, help: "A page on this site, e.g. /shop or /categories#spiritual" },
      ]}
      renderItem={(r) => (
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-28 shrink-0 overflow-hidden bg-card">
            {r.image && <Image src={r.image} alt="" fill sizes="112px" className="object-cover" />}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] tracking-wider text-gold uppercase">{r.eyebrow}</p>
            <p className="truncate font-serif text-lg">{r.title}</p>
            <p className="truncate text-xs text-muted">
              Button: {r.cta_label} → {r.cta_href}
            </p>
          </div>
        </div>
      )}
    />
  );
}
