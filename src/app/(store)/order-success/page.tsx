"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useLastOrder } from "@/context/cart";
import { formatINR } from "@/lib/format";

export default function OrderSuccessPage() {
  const order = useLastOrder();

  if (!order) {
    return (
      <div className="container-page py-24 text-center">
        <p className="font-serif text-2xl">No recent order found</p>
        <Link href="/shop" className="btn-primary mt-8">
          Shop paintings
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page max-w-xl py-20 text-center">
      <CheckCircle2 className="mx-auto h-14 w-14 text-gold" strokeWidth={1.25} />
      <h1 className="heading mt-6">Thank you, {order.name.split(" ")[0]}!</h1>
      <p className="mt-3 text-muted">Your order has been placed. A confirmation will be sent to {order.email}.</p>

      <dl className="mt-10 grid grid-cols-2 gap-y-3 border border-line bg-card p-6 text-left text-sm">
        <dt className="text-muted">Order ID</dt>
        <dd className="font-medium">{order.id}</dd>
        <dt className="text-muted">Items</dt>
        <dd>{order.items}</dd>
        <dt className="text-muted">Payment</dt>
        <dd>{order.payment === "online" ? "Paid online" : "Cash on Delivery"}</dd>
        <dt className="text-muted">Total</dt>
        <dd className="font-medium">{formatINR(order.total)}</dd>
        <dt className="text-muted">Delivering to</dt>
        <dd>{order.city}</dd>
      </dl>

      <div className="mt-10 text-left">
        <p className="eyebrow">What happens next</p>
        <ol className="mt-4 space-y-3 text-sm text-muted">
          <li>1. We confirm your order on WhatsApp / email within 24 hours.</li>
          <li>2. Ready artworks ship in 5–7 days; made-to-order pieces in 12–18 days.</li>
          <li>3. You&apos;ll receive a tracking link once your artwork is dispatched.</li>
        </ol>
      </div>

      <Link href="/shop" className="btn-primary mt-10">
        Continue shopping
      </Link>
      <p className="mt-6 text-xs text-muted">This is a demo store — no real order or payment was made.</p>
    </div>
  );
}
