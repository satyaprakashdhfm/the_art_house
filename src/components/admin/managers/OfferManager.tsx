"use client";

import CollectionManager from "@/components/admin/CollectionManager";
import type { OfferRow } from "@/lib/db";

export default function OfferManager({ rows }: { rows: OfferRow[] }) {
  return (
    <CollectionManager<OfferRow>
      table="offers"
      rows={rows}
      keyField="id"
      itemName="offer"
      defaults={{ id: "", title: "", text: "", is_active: true, sort_order: 0 }}
      flags={[{ field: "is_active", label: "Showing" }]}
      fields={[
        { name: "title", label: "Title", type: "text", required: true, wide: true, placeholder: "e.g. Free shipping" },
        { name: "text", label: "Details", type: "textarea" },
      ]}
      renderItem={(r) => (
        <div className="border-l-2 border-gold pl-3">
          <p className="text-sm font-medium">{r.title}</p>
          <p className="text-xs text-muted">{r.text}</p>
        </div>
      )}
    />
  );
}
