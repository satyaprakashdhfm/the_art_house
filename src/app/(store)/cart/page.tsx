"use client";

import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import CartLineItem from "@/components/cart/CartLineItem";
import CouponInput from "@/components/cart/CouponInput";
import FreeShippingBar from "@/components/cart/FreeShippingBar";
import OrderSummary from "@/components/cart/OrderSummary";
import { useCart } from "@/context/cart";
import { useCatalog } from "@/context/catalog";
import { computeTotals, priceLines } from "@/lib/cart";

export default function CartPage() {
  const cart = useCart();
  const catalog = useCatalog();
  const lines = priceLines(cart.lines, catalog);
  const totals = computeTotals(lines, cart.coupon, null, catalog);

  return (
    <>
      <PageHeader title="Your Cart" crumbs={[{ label: "Cart" }]} />
      <div className="container-page py-12">
        {lines.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-serif text-2xl">Your cart is empty</p>
            <p className="mt-2 text-sm text-muted">Looks like you haven&apos;t added anything yet.</p>
            <Link href="/shop" className="btn-primary mt-8">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            <div>
              <FreeShippingBar remaining={totals.amountToFreeShipping} />
              <div className="mt-4 divide-y divide-line border-y border-line">
                {lines.map((line) => (
                  <CartLineItem key={line.key} line={line} />
                ))}
              </div>
              <Link href="/shop" className="mt-6 inline-block text-sm underline underline-offset-4 hover:text-gold">
                ← Continue shopping
              </Link>
            </div>
            <aside className="h-fit space-y-6 border border-line bg-card p-6 lg:sticky lg:top-28">
              <h2 className="font-serif text-xl">Order Summary</h2>
              <CouponInput applied={cart.coupon} error={totals.couponError} />
              <OrderSummary totals={totals} coupon={cart.coupon} />
              <p className="text-xs text-muted">Pay online at checkout for an extra 5% off.</p>
              <Link href="/checkout" className="btn-primary w-full">
                Proceed to checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
