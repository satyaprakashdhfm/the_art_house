"use client";

import CollectionManager from "@/components/admin/CollectionManager";
import type { FAQRow } from "@/lib/db";

export default function FAQManager({ rows, section }: { rows: FAQRow[]; section: FAQRow["section"] }) {
  return (
    <CollectionManager<FAQRow>
      table="faqs"
      rows={rows}
      keyField="id"
      itemName="question"
      defaults={{ id: "", section, question: "", answer: "", is_active: true, sort_order: 0 }}
      searchable={(r) => `${r.question} ${r.answer}`}
      flags={[{ field: "is_active", label: "Showing" }]}
      fields={[
        {
          name: "section",
          label: "Section",
          type: "select",
          options: [
            { value: "general", label: "Orders & delivery" },
            { value: "custom", label: "Custom art" },
          ],
        },
        { name: "question", label: "Question", type: "text", required: true, wide: true },
        { name: "answer", label: "Answer", type: "textarea", required: true },
      ]}
      renderItem={(r) => (
        <div>
          <p className="text-sm font-medium">{r.question}</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-muted">{r.answer}</p>
        </div>
      )}
    />
  );
}
