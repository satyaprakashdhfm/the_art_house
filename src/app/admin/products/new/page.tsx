import ProductForm from "@/components/admin/products/ProductForm";
import { adminRows } from "@/app/admin/data";
import type { GroupRow, SubRow } from "@/lib/db";

export const metadata = { title: "Add product" };

export default async function NewProductPage() {
  const [groups, subs] = await Promise.all([adminRows<GroupRow>("category_groups"), adminRows<SubRow>("subcategories")]);
  return <ProductForm initial={null} groups={groups} subs={subs} />;
}
