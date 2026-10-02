"use client";

import Link from "next/link";
import Drawer from "@/components/ui/Drawer";
import CartLineItem from "@/components/cart/CartLineItem";
import FreeShippingBar from "@/components/cart/FreeShippingBar";
import { ui, useUI } from "@/context/ui";
import { useCart } from "@/context/cart";
import { computeTotals, priceLines } from "@/lib/cart";
import { formatINR } from "@/lib/format";

export default function CartDrawer() {
  const { cartOpen } = useUI();
  const cart = useCart();
  const lines = priceLines(cart.lines);
  const totals = computeTotals(lines, cart.coupon, null);

  return (
    <Drawer
      open={cartOpen}
      onClose={ui.closeCart}
      title={`Your Cart (${totals.itemCount})`}
      footer={
        lines.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-medium">{formatINR(totals.subtotal)}</span>
            </div>
            <p className="text-xs text-muted">Coupons, shipping and prepaid discount are applied at checkout.</p>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/cart" onClick={ui.closeCart} className="btn-outline px-3">
                View cart
              </Link>
              <Link href="/checkout" onClick={ui.closeCart} className="btn-primary px-3">
                Checkout
              </Link>
            </div>
          </div>
        )
      }
    >
      {lines.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
          <p className="font-serif text-xl">Your cart is empty</p>
          <p className="text-sm text-muted">Find something beautiful for your walls.</p>
          <Link href="/shop" onClick={ui.closeCart} className="btn-primary">
            Shop paintings
          </Link>
        </div>
      ) : (
        <div className="px-5">
          <div className="py-4">
            <FreeShippingBar remaining={totals.amountToFreeShipping} />
          </div>
          <div className="divide-y divide-line">
            {lines.map((line) => (
              <CartLineItem key={line.key} line={line} onNavigate={ui.closeCart} />
            ))}
          </div>
        </div>
      )}
    </Drawer>
  );
}
