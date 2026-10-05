import type { FAQ } from "@/types";

export default function FAQList({ faqs, variant = "lines" }: { faqs: FAQ[]; variant?: "lines" | "cards" }) {
  if (variant === "cards") {
    return (
      <div className="space-y-3">
        {faqs.map((f) => (
          <details key={f.id} className="group border border-line bg-paper transition-colors open:border-gold/60">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-medium">
              {f.q}
              <span className="text-2xl leading-none text-gold transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="px-6 pb-6 text-sm leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    );
  }

  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((f) => (
        <details key={f.id} className="group">
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
