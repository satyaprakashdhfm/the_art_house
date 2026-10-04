import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import FAQList from "@/components/ui/FAQList";
import { getCatalog } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about our paintings, delivery, payments, returns and custom art.",
};

export default async function FAQPage() {
  const { faqs } = await getCatalog();

  return (
    <>
      <PageHeader title="Frequently asked questions" crumbs={[{ label: "FAQ" }]} />
      <div className="container-page max-w-3xl space-y-14 py-14">
        <section>
          <h2 className="mb-4 font-serif text-2xl">Orders & delivery</h2>
          <FAQList faqs={faqs.filter((f) => f.section === "general")} />
        </section>
        <section>
          <h2 className="mb-4 font-serif text-2xl">Custom art</h2>
          <FAQList faqs={faqs.filter((f) => f.section === "custom")} />
        </section>
      </div>
    </>
  );
}
