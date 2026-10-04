"use client";

import CollectionManager from "@/components/admin/CollectionManager";
import type { AnnouncementRow } from "@/lib/db";

export default function AnnouncementManager({ rows }: { rows: AnnouncementRow[] }) {
  return (
    <CollectionManager<AnnouncementRow>
      table="announcements"
      rows={rows}
      keyField="id"
      itemName="message"
      defaults={{ id: "", message: "", is_active: true, sort_order: 0 }}
      flags={[{ field: "is_active", label: "Showing" }]}
      fields={[
        {
          name: "message",
          label: "Message",
          type: "text",
          required: true,
          wide: true,
          placeholder: "e.g. Free shipping on orders above ₹1,999",
          help: "Keep it short — about 60 characters fits on phones.",
        },
      ]}
      renderItem={(r) => <p className="text-sm">{r.message}</p>}
    />
  );
}
