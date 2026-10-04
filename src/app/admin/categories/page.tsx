import AdminPageHeader from "@/components/admin/AdminPageHeader";
import CategoriesManager from "@/components/admin/managers/CategoriesManager";
import { adminRows } from "@/app/admin/data";
import type { GroupRow, SubRow } from "@/lib/db";

export const metadata = { title: "Categories" };

export default async function CategoriesAdminPage() {
  const [groups, subs] = await Promise.all([
    adminRows<GroupRow>("category_groups"),
    adminRows<SubRow>("subcategories"),
  ]);
  return (
    <>
      <AdminPageHeader
        title="Categories"
        description="Rename collections and change their pictures. Sub-categories can be added to the four subject groups; Art Style and Medium are fixed because prices and filters depend on them."
      />
      <CategoriesManager groups={groups} subs={subs} />
    </>
  );
}
