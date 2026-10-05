import AdminPageHeader from "@/components/admin/AdminPageHeader";
import GalleryManager from "@/components/admin/managers/GalleryManager";
import { adminRows } from "@/app/admin/data";
import type { GalleryItemRow } from "@/lib/db";

export const metadata = { title: "Gallery" };

export default async function GalleryAdminPage() {
  const rows = await adminRows<GalleryItemRow>("gallery_items");
  return (
    <>
      <AdminPageHeader
        title="Gallery"
        description="Finished and sold artworks shown on the Gallery page. They have no price and don't appear in the shop. Change the order with the arrows; hidden artworks stay saved but don't show."
      />
      <GalleryManager rows={rows} />
    </>
  );
}
