"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Lock, Wallet } from "lucide-react";
import type { PaymentMethod } from "@/types";
import PageHeader from "@/components/ui/PageHeader";
import CouponInput from "@/components/cart/CouponInput";
import OrderSummary from "@/components/cart/OrderSummary";
import { cartActions, setLastOrder, useCart } from "@/context/cart";
import { useCatalog } from "@/context/catalog";
import { computeTotals, priceLines } from "@/lib/cart";
import { formatINR } from "@/lib/format";
import { sizeLabel } from "@/lib/price";

const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab",
  "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Other",
];

type Form = Record<"name" | "phone" | "email" | "address" | "city" | "state" | "pincode", string>;

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const [payment, setPayment] = useState<PaymentMethod>("online");
  const [form, setForm] = useState<Form>({ name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "" });
  const [errors, setErrors] = useState<Partial<Form>>({});
  const [placing, setPlacing] = useState(false);

  const catalog = useCatalog();
  const lines = priceLines(cart.lines, catalog);
  const totals = computeTotals(lines, cart.coupon, payment, catalog);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate() {
    const e: Partial<Form> = {};
    if (!form.name.trim()) e.name = "Enter your full name";
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Enter a valid 10-digit mobile number";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.address.trim()) e.address = "Enter your address";
    if (!form.city.trim()) e.city = "Enter your city";
    if (!form.state) e.state = "Select your state";
    if (!/^[1-9]\d{5}$/.test(form.pincode)) e.pincode = "Enter a valid 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setPlacing(true);
    // Mock: no payment gateway yet. Simulate a short processing delay.
    setTimeout(() => {
      setLastOrder({
        id: `TAH-${Date.now().toString(36).toUpperCase()}`,
        name: form.name,
        email: form.email,
        city: form.city,
        payment,
        total: totals.total,
        items: totals.itemCount,
        placedAt: new Date().toISOString(),
      });
      cartActions.clear();
      router.push("/order-success");
    }, 800);
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
      <form onSubmit={placeOrder} noValidate className="container-page grid gap-12 py-12 lg:grid-cols-[1fr_400px]">
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
            <div className="mt-5 grid gap-3">
              {[
                { key: "online" as const, icon: CreditCard, title: "Pay online (Razorpay)", text: "UPI, cards, net banking, wallets — extra 5% off" },
                { key: "cod" as const, icon: Wallet, title: "Cash on Delivery", text: "₹49 COD handling fee applies" },
              ].map((m) => (
                <label
                  key={m.key}
                  className={`flex cursor-pointer items-start gap-3 border p-4 ${payment === m.key ? "border-ink bg-card" : "border-line"}`}
                >
                  <input type="radio" name="payment" checked={payment === m.key} onChange={() => setPayment(m.key)} className="mt-1 accent-ink" />
                  <m.icon className="mt-0.5 h-5 w-5 text-gold" />
                  <span>
                    <span className="block text-sm font-medium">{m.title}</span>
                    <span className="block text-xs text-muted">{m.text}</span>
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted">Demo store: no real payment is taken.</p>
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
            {placing ? "Placing order…" : payment === "online" ? `Pay ${formatINR(totals.total)}` : "Place order"}
          </button>
        </aside>
      </form>
    </>
  );
}
