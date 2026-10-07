import AdminPageHeader from "@/components/admin/AdminPageHeader";
import GalleryManager from "@/components/admin/managers/GalleryManager";
import { adminRows } from "@/app/admin/data";
import type { GalleryItemRow, GroupRow, SubRow } from "@/lib/db";

export const metadata = { title: "Gallery" };

export default async function GalleryAdminPage() {
  const [rows, groups, subs] = await Promise.all([
    adminRows<GalleryItemRow>("gallery_items"),
    adminRows<GroupRow>("category_groups"),
    adminRows<SubRow>("subcategories"),
  ]);
  // Subject categories only: Art Style and Medium pages pick sold work up by its medium.
  const categories = subs
    .filter((s) => s.group_slug !== "art-style" && s.group_slug !== "medium")
    .map((s) => ({ value: s.slug, label: `${groups.find((g) => g.slug === s.group_slug)?.name ?? s.group_slug} → ${s.name}` }));
  return (
    <>
      <AdminPageHeader
        title="Gallery"
        description="Finished and sold artworks shown on the Gallery page. Pick a category to also show a piece, marked Sold, on that category's page. They have no price and can't be bought. Change the order with the arrows; hidden artworks stay saved but don't show."
      />
      <GalleryManager rows={rows} categories={categories} />
    </>
  );
}
