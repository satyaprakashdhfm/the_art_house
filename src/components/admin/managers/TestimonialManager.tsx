"use client";

import { Star } from "lucide-react";
import CollectionManager from "@/components/admin/CollectionManager";
import type { TestimonialRow } from "@/lib/db";

const DEFAULTS: TestimonialRow = {
  id: "",
  name: "",
  city: "",
  rating: 5,
  text: "",
  date_label: "",
  show_on_home: false,
  is_active: true,
  sort_order: 0,
};

const RATINGS = [5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} star${n === 1 ? "" : "s"}` }));

export default function TestimonialManager({ rows }: { rows: TestimonialRow[] }) {
  return (
    <CollectionManager<TestimonialRow>
      table="testimonials"
      rows={rows}
      keyField="id"
      itemName="testimonial"
      defaults={DEFAULTS}
      searchable={(r) => `${r.name} ${r.city} ${r.text}`}
      flags={[
        { field: "show_on_home", label: "On homepage" },
        { field: "is_active", label: "Active" },
      ]}
      fields={[
        { name: "name", label: "Customer name", type: "text", required: true, placeholder: "e.g. Ananya R." },
        { name: "city", label: "City", type: "text", placeholder: "e.g. Bengaluru" },
        { name: "rating", label: "Rating", type: "select", options: RATINGS },
        { name: "date_label", label: "Date", type: "text", placeholder: "e.g. Aug 2026" },
        { name: "text", label: "Review", type: "textarea", required: true },
        { name: "show_on_home", label: "Show on homepage", type: "toggle" },
      ]}
      validate={(r) => {
        // Select inputs give strings; the column is a number.
        r.rating = Number(r.rating);
        return null;
      }}
      renderItem={(r) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="flex">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < Number(r.rating) ? "fill-gold text-gold" : "text-line"}`} />
              ))}
            </span>
            <span className="text-sm font-medium">{r.name}</span>
            {r.city && <span className="text-xs text-muted">· {r.city}</span>}
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted">“{r.text}”</p>
        </div>
      )}
    />
  );
}
