"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Lock } from "lucide-react";
import type { PlacedOrder } from "@/types";
import PageHeader from "@/components/ui/PageHeader";
import CouponInput from "@/components/cart/CouponInput";
import OrderSummary from "@/components/cart/OrderSummary";
import { completeOrder, pendingPayment, useCart } from "@/context/cart";
import { useCatalog } from "@/context/catalog";
import { computeTotals, priceLines } from "@/lib/cart";
import { validateCheckoutForm, type CheckoutForm } from "@/lib/checkout";
import { formatINR } from "@/lib/format";
import { sizeLabel } from "@/lib/price";
import { checkoutWindow, createRazorpay } from "@/lib/razorpay-checkout";
import { checkOrderPayment, confirmPayment, placeOrder } from "./actions";

const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab",
  "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Other",
];

type Form = CheckoutForm;

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const [form, setForm] = useState<Form>({ name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "" });
  const [errors, setErrors] = useState<Partial<Form>>({});
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const catalog = useCatalog();
  const lines = priceLines(cart.lines, catalog);
  const totals = computeTotals(lines, cart.coupon, catalog);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate() {
    const e = validateCheckoutForm(form);
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function finish(order: PlacedOrder) {
    completeOrder(order);
    router.push("/order-success");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setOrderError(null);
    setPlacing(true);

    // Only the lines shown (and priced) on this page; the server prices them again.
    const shown = cart.lines.filter((l) => lines.some((p) => p.key === l.key));
    const res = await placeOrder({ form, lines: shown, coupon: cart.coupon, expectedTotal: totals.total }).catch(
      () => ({ ok: false as const, error: "We couldn't reach the server. Check your connection and try again." }),
    );
    if (!res.ok) {
      setOrderError(res.error);
      setPlacing(false);
      return;
    }
    const { order, razorpay } = res;

    let failure: string | null = null;
    try {
      const rzp = await createRazorpay({
        key: razorpay.keyId,
        amount: razorpay.amount,
        currency: "INR",
        name: "Verona Arts",
        description: `Order ${order.id}`,
        image: `${window.location.origin}/images/brand/emblem.png`,
        order_id: razorpay.orderId,
        prefill: { name: form.name, email: form.email, contact: `+91${form.phone}` },
        notes: { order: order.id },
        theme: { color: "#c27c38" },
        handler: async (response) => {
          checkoutWindow.open = false;
          const confirmed = await confirmPayment(order.id, response).catch(() => ({ ok: false }));
          if (confirmed.ok) return finish(order);
          setOrderError(
            `We couldn't confirm your payment. If money was deducted, contact us with order ID ${order.id} and we'll sort it out.`,
          );
          setPlacing(false);
        },
        modal: {
          ondismiss: async () => {
            checkoutWindow.open = false;
            // On a phone the window can close after paying in a UPI app, before Checkout reports success.
            const { status } = await checkOrderPayment(order.id).catch(() => ({ status: "pending" as const }));
            if (status === "paid") return finish(order);
            setOrderError(failure ?? "Payment was not completed, so your order hasn't been placed. You can try again.");
            setPlacing(false);
          },
        },
      });
      // Checkout shows the failure and lets the customer retry; remember it in case they close the window.
      rzp.on("payment.failed", (r) => {
        failure = `Payment failed: ${r.error.description} If any money was deducted, it will be refunded automatically.`;
      });
      // Remembered so the order can still be completed if this tab reloads while a UPI app is open.
      pendingPayment.start(order);
      checkoutWindow.open = true;
      rzp.open();
    } catch {
      setOrderError("We couldn't open the payment window. Check your connection and try again.");
      setPlacing(false);
    }
  }

  if (lines.length === 0 && !placing) {
    return (
      <>
        <PageHeader title="Checkout" crumbs={[{ href: "/cart", label: "Cart" }, { label: "Checkout" }]} />
        <div className="container-page py-20 text-center">
          <p className="font-serif text-2xl">Your cart is empty</p>
          <Link href="/shop" className="btn-primary mt-8">
            Shop paintings
          </Link>
        </div>
      </>
    );
  }

  const field = (k: keyof Form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={k} className="label">
        {label}
      </label>
      <input id={k} value={form[k]} onChange={set(k)} className="input" aria-invalid={!!errors[k]} {...props} />
      {errors[k] && <p className="mt-1 text-xs text-sale">{errors[k]}</p>}
    </div>
  );

  return (
    <>
      <PageHeader title="Checkout" crumbs={[{ href: "/cart", label: "Cart" }, { label: "Checkout" }]} />
      <form onSubmit={submit} noValidate className="container-page grid gap-12 py-12 lg:grid-cols-[1fr_400px]">
        <div className="space-y-10">
          <section>
            <h2 className="font-serif text-xl">Delivery address</h2>
            <p className="mt-1 text-xs text-muted">We currently deliver within India only.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">{field("name", "Full name", { autoComplete: "name" })}</div>
              {field("phone", "Mobile number", { inputMode: "numeric", maxLength: 10, autoComplete: "tel-national" })}
              {field("email", "Email", { type: "email", autoComplete: "email" })}
              <div className="sm:col-span-2">
                <label htmlFor="address" className="label">
                  Address
                </label>
                <textarea id="address" rows={3} value={form.address} onChange={set("address")} className="input" aria-invalid={!!errors.address} autoComplete="street-address" />
                {errors.address && <p className="mt-1 text-xs text-sale">{errors.address}</p>}
              </div>
              {field("city", "City", { autoComplete: "address-level2" })}
              <div>
                <label htmlFor="state" className="label">
                  State
                </label>
                <select id="state" value={form.state} onChange={set("state")} className="input" aria-invalid={!!errors.state}>
                  <option value="">Select state</option>
                  {STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                {errors.state && <p className="mt-1 text-xs text-sale">{errors.state}</p>}
              </div>
              {field("pincode", "Pincode", { inputMode: "numeric", maxLength: 6, autoComplete: "postal-code" })}
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl">Payment</h2>
            <div className="mt-5 flex items-start gap-3 border border-line bg-card p-4">
              <CreditCard className="mt-0.5 h-5 w-5 text-gold" />
              <span>
                <span className="block text-sm font-medium">Pay online with Razorpay</span>
                <span className="block text-xs text-muted">UPI, debit / credit cards, net banking and wallets — processed securely by Razorpay.</span>
              </span>
            </div>
          </section>
        </div>

        <aside className="h-fit space-y-6 border border-line bg-card p-6 lg:sticky lg:top-28">
          <h2 className="font-serif text-xl">Your order</h2>
          <ul className="space-y-3">
            {lines.map((l) => (
              <li key={l.key} className="flex justify-between gap-3 text-sm">
                <span>
                  {l.product.title} <span className="text-muted">× {l.qty}</span>
                  <span className="block text-xs text-muted">{sizeLabel(l.product.medium, l.size)}</span>
                </span>
                <span>{formatINR(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <CouponInput applied={cart.coupon} error={totals.couponError} />
          <OrderSummary totals={totals} coupon={cart.coupon} />
          <button type="submit" disabled={placing} className="btn-primary w-full">
            <Lock className="h-4 w-4" />
            {placing ? "Processing…" : `Pay ${formatINR(totals.total)}`}
          </button>
          {orderError && (
            <p role="alert" className="text-sm text-sale">
              {orderError}
            </p>
          )}
        </aside>
      </form>
    </>
  );
}
