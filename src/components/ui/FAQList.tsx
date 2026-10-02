import type { FAQ } from "@/data/faqs";

export default function FAQList({ faqs }: { faqs: FAQ[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium">
            {f.q}
            <span className="text-lg text-muted transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="pb-5 text-sm leading-relaxed text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
