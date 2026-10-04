import AdminPageHeader from "@/components/admin/AdminPageHeader";
import HeroManager from "@/components/admin/managers/HeroManager";
import { adminRows } from "@/app/admin/data";
import type { HeroSlideRow } from "@/lib/db";

export const metadata = { title: "Homepage slides" };

export default async function HeroAdminPage() {
  const rows = await adminRows<HeroSlideRow>("hero_slides");
  return (
    <>
      <AdminPageHeader
        title="Homepage slides"
        description="The large banners at the top of the homepage. Use wide landscape images (at least 1600 px wide). Drag order with the arrows; hidden slides stay saved but don't show."
      />
      <HeroManager rows={rows} />
    </>
  );
}
