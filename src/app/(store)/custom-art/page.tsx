import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import FAQList from "@/components/ui/FAQList";
import CustomArtForm from "@/components/custom/CustomArtForm";
import { getCatalog } from "@/lib/site-data";
import { placeholder } from "@/lib/images";

export const metadata: Metadata = {
  title: "Custom Art from Your Photo",
  description: "Get a hand-painted pencil, oil, acrylic or digital portrait from your photo. Free preview, 2 free revisions.",
};

const STEPS = [
  { title: "Upload photo", text: "Share one or more clear photos." },
  { title: "Choose medium & size", text: "See your price instantly." },
  { title: "Pay 50% advance", text: "We confirm details on WhatsApp." },
  { title: "Approve preview", text: "Free digital preview + 2 revisions." },
  { title: "Delivered", text: "Painted, framed and shipped to you." },
];

export default async function CustomArtPage() {
  const { faqs } = await getCatalog();

  return (
    <>
      <PageHeader
        title="Your photo, hand-painted"
        description="Portraits, couples, families, pets and places — turned into art you'll keep forever."
        crumbs={[{ label: "Custom Art" }]}
      />

      <section className="container-page py-14">
        <ol className="grid grid-cols-2 gap-6 sm:grid-cols-5">
          {STEPS.map((s, i) => (
            <li key={s.title} className="text-center">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-gold font-serif text-gold">
                {i + 1}
              </span>
              <p className="mt-3 text-sm font-medium">{s.title}</p>
              <p className="mt-1 text-xs text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-page">
        <CustomArtForm />
      </section>

      <section className="container-page py-20">
        <SectionHeading eyebrow="Past commissions" title="Custom work we've loved creating" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {["Family portrait", "Couple sketch", "Pet portrait", "Home painting"].map((t) => (
            <figure key={t}>
              <div className="relative aspect-[4/5] overflow-hidden bg-line">
                <Image src={placeholder(`custom-${t}`, 700, 900)} alt={t} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              </div>
              <figcaption className="mt-2 text-sm text-muted">{t}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="container-page max-w-3xl">
        <SectionHeading eyebrow="Questions" title="Custom art FAQ" />
        <FAQList faqs={faqs.filter((f) => f.section === "custom")} />
      </section>
    </>
  );
}
