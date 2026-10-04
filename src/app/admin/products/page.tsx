import Link from "next/link";
import { Plus } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ProductsTable from "@/components/admin/products/ProductsTable";
import { adminRows } from "@/app/admin/data";
import type { GroupRow, ProductRow, SubRow } from "@/lib/db";

export const metadata = { title: "Products" };

export default async function ProductsAdminPage() {
  const [products, groups, subs] = await Promise.all([
    adminRows<ProductRow>("products"),
    adminRows<GroupRow>("category_groups"),
    adminRows<SubRow>("subcategories"),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Products"
        description="Every painting in the shop. Hidden products stay saved but don't appear on the website."
        actions={
          <Link href="/admin/products/new" className="btn-primary px-4 py-2.5">
            <Plus className="h-4 w-4" /> Add product
          </Link>
        }
      />
      <ProductsTable rows={products} groups={groups} subs={subs} />
    </>
  );
}
