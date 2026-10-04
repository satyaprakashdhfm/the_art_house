import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/products/ProductForm";
import { adminRows } from "@/app/admin/data";
import { getSession } from "@/lib/auth";
import type { GroupRow, ProductRow, SubRow } from "@/lib/db";

export const metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  const { supabase } = await getSession();
  const [{ data: product }, groups, subs] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    adminRows<GroupRow>("category_groups"),
    adminRows<SubRow>("subcategories"),
  ]);
  if (!product) notFound();
  return <ProductForm initial={product as ProductRow} groups={groups} subs={subs} />;
}
