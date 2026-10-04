import AdminPageHeader from "@/components/admin/AdminPageHeader";
import TestimonialManager from "@/components/admin/managers/TestimonialManager";
import { adminRows } from "@/app/admin/data";
import type { TestimonialRow } from "@/lib/db";

export const metadata = { title: "Testimonials" };

export default async function TestimonialsAdminPage() {
  const rows = await adminRows<TestimonialRow>("testimonials");
  return (
    <>
      <AdminPageHeader
        title="Testimonials"
        description="Customer reviews. Up to 4 marked “On homepage” appear on the homepage; all active reviews are shown on product pages."
      />
      <TestimonialManager rows={rows} />
    </>
  );
}
