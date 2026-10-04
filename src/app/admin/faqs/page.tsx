import AdminPageHeader from "@/components/admin/AdminPageHeader";
import FAQManager from "@/components/admin/managers/FAQManager";
import { adminRows } from "@/app/admin/data";
import type { FAQRow } from "@/lib/db";

export const metadata = { title: "FAQs" };

export default async function FAQsAdminPage() {
  const rows = await adminRows<FAQRow>("faqs");
  return (
    <>
      <AdminPageHeader
        title="FAQs"
        description="Questions shown on the FAQ page. “Custom art” questions also appear on the Custom Art page."
      />
      <section>
        <h2 className="mb-3 font-serif text-xl">Orders &amp; delivery</h2>
        <FAQManager rows={rows.filter((r) => r.section === "general")} section="general" />
      </section>
      <section className="mt-14">
        <h2 className="mb-3 font-serif text-xl">Custom art</h2>
        <FAQManager rows={rows.filter((r) => r.section === "custom")} section="custom" />
      </section>
    </>
  );
}
