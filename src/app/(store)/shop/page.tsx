import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/ui/PageHeader";
import ShopView from "@/components/shop/ShopView";

export const metadata: Metadata = {
  title: "Shop All Paintings",
  description: "Browse handmade pencil sketches, oil, acrylic and digital paintings.",
};

export default function ShopPage() {
  return (
    <>
      <PageHeader
        title="Shop All Paintings"
        description="Originals, made-to-order paintings and premium prints — filter by subject, medium, size and price."
        crumbs={[{ label: "Shop" }]}
      />
      <Suspense fallback={<div className="container-page py-20 text-center text-muted">Loading…</div>}>
        <ShopView />
      </Suspense>
    </>
  );
}
