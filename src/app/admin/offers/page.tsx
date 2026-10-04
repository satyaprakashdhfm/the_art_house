import AdminPageHeader from "@/components/admin/AdminPageHeader";
import CouponManager from "@/components/admin/managers/CouponManager";
import OfferManager from "@/components/admin/managers/OfferManager";
import { adminRows } from "@/app/admin/data";
import { SUBJECT_GROUPS } from "@/lib/labels";
import type { CouponRow, GroupRow, OfferRow, SubRow } from "@/lib/db";

export const metadata = { title: "Offers & coupons" };

export default async function OffersAdminPage() {
  const [coupons, offers, groups, subs] = await Promise.all([
    adminRows<CouponRow>("coupons"),
    adminRows<OfferRow>("offers"),
    adminRows<GroupRow>("category_groups"),
    adminRows<SubRow>("subcategories"),
  ]);
  const isSubject = (slug: string) => (SUBJECT_GROUPS as readonly string[]).includes(slug);

  return (
    <>
      <AdminPageHeader
        title="Offers & coupons"
        description="Coupon codes customers type at checkout, plus the always-on perks listed on the Offers page."
      />
      <section>
        <h2 className="mb-3 font-serif text-xl">Coupon codes</h2>
        <CouponManager
          rows={coupons}
          groups={groups.filter((g) => isSubject(g.slug)).map((g) => ({ value: g.slug, label: g.name }))}
          subs={subs.filter((s) => isSubject(s.group_slug)).map((s) => ({ value: s.slug, label: s.name }))}
        />
      </section>
      <section className="mt-14">
        <h2 className="mb-3 font-serif text-xl">Always-on offers</h2>
        <OfferManager rows={offers} />
      </section>
    </>
  );
}
