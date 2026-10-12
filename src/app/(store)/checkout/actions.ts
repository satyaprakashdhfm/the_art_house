"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import type { CartLine, PlacedOrder } from "@/types";
import { validateCheckoutForm, type CheckoutForm } from "@/lib/checkout";
import { computeTotals, priceLines } from "@/lib/cart";
import { isDigitalFile, sizeLabel } from "@/lib/price";
import { createRazorpayOrder, fetchPayment, paymentSettlesOrder, razorpayKeyId, verifyPaymentSignature } from "@/lib/razorpay";
import { getCatalog } from "@/lib/site-data";
import { createSecretClient } from "@/lib/supabase/secret";

export type PlaceOrderInput = {
  form: CheckoutForm;
  lines: CartLine[];
  coupon: string | null;
  /** Total the customer saw; the order is refused if the server's price differs. */
  expectedTotal: number;
};

export type PlaceOrderResult =
  | { ok: false; error: string }
  | { ok: true; order: PlacedOrder; razorpay: { keyId: string; orderId: string; amount: number } };

const GENERIC_ERROR = "We couldn't place your order. Please try again, or message us on WhatsApp.";

/**
 * Re-prices the cart from the database (never trusting browser prices), creates the Razorpay
 * order that Checkout opens with, and saves the order as awaiting payment.
 */
export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const form = Object.fromEntries(
    (["name", "phone", "email", "address", "city", "state", "pincode"] as const).map((k) => [k, String(input.form?.[k] ?? "").trim()]),
  ) as CheckoutForm;
  if (Object.keys(validateCheckoutForm(form)).length > 0) return { ok: false, error: "Please check your delivery details." };

  try {
    const catalog = await getCatalog();

    // Rebuild each line from the catalogue so sizes, add-ons and quantities are valid.
    const lines: CartLine[] = [];
    for (const l of Array.isArray(input.lines) ? input.lines : []) {
      const product = catalog.getProductById(String(l?.productId));
      if (!product || !product.sizes.includes(l.size)) {
        return { ok: false, error: "Some items in your cart are no longer available. Please review your cart." };
      }
      const digital = isDigitalFile(l.size);
      const max = product.type === "original" ? 1 : 10;
      lines.push({
        key: String(l.key),
        productId: product.id,
        size: l.size,
        addons: {
          frame: !digital && !!l.addons?.frame,
          giftWrap: !digital && !!l.addons?.giftWrap,
          express: !digital && !!l.addons?.express,
        },
        qty: Math.min(max, Math.max(1, Math.floor(Number(l.qty)) || 1)),
        max,
      });
    }
    const priced = priceLines(lines, catalog);
    if (priced.length === 0 || priced.some((l) => l.unitPrice <= 0)) return { ok: false, error: "Your cart is empty." };
    const originals = priced.filter((l) => l.product.type === "original");
    if (new Set(originals.map((l) => l.productId)).size !== originals.length) {
      return { ok: false, error: "Each original painting can only be bought once. Please review your cart." };
    }

    const totals = computeTotals(priced, input.coupon, catalog);
    if (totals.total !== input.expectedTotal) {
      // The page was built from older (cached) prices: rebuild it so a refresh shows the current ones.
      revalidatePath("/", "layout");
      return { ok: false, error: "Prices have been updated since you opened this page. Please refresh and check your order." };
    }

    const id = `TAH-${Date.now().toString(36).toUpperCase()}${randomBytes(2).toString("hex").toUpperCase()}`;
    const rzp = await createRazorpayOrder(totals.total * 100, id, { order: id, customer: form.name.slice(0, 200) });

    const { error } = await createSecretClient()
      .from("orders")
      .insert({
        id,
        status: "pending_payment",
        ...form,
        lines: priced.map((l) => ({
          productId: l.productId,
          title: l.product.title,
          size: l.size,
          sizeLabel: sizeLabel(l.product.medium, l.size),
          addons: l.addons,
          qty: l.qty,
          unitPrice: l.unitPrice,
          addonsPrice: l.addonsPrice,
          lineTotal: l.lineTotal,
        })),
        coupon: totals.couponDiscount > 0 ? input.coupon?.trim().toUpperCase() : null,
        subtotal: totals.subtotal,
        coupon_discount: totals.couponDiscount,
        shipping: totals.shipping,
        total: totals.total,
        razorpay_order_id: rzp.id,
      });
    if (error) throw new Error(`Could not save order: ${error.message}`);

    const order: PlacedOrder = {
      id,
      name: form.name,
      email: form.email,
      city: form.city,
      total: totals.total,
      items: totals.itemCount,
      placedAt: new Date().toISOString(),
    };
    return { ok: true, order, razorpay: { keyId: razorpayKeyId(), orderId: rzp.id, amount: rzp.amount } };
  } catch (err) {
    console.error("placeOrder failed", err);
    return { ok: false, error: GENERIC_ERROR };
  }
}

export type PaymentResponse = { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };

/**
 * Verifies the signature Checkout returned, confirms with Razorpay that the payment is captured for
 * the full amount, and marks the order paid. The webhook does the same if this never runs.
 */
export async function confirmPayment(orderId: string, response: PaymentResponse): Promise<{ ok: boolean }> {
  try {
    const db = createSecretClient();
    const { data: row } = await db.from("orders").select("razorpay_order_id, status, total").eq("id", String(orderId)).maybeSingle();
    if (!row?.razorpay_order_id) return { ok: false };
    if (row.status === "paid") return { ok: true };

    const paymentId = String(response?.razorpay_payment_id ?? "");
    if (!verifyPaymentSignature(row.razorpay_order_id, paymentId, String(response?.razorpay_signature ?? ""))) {
      console.error(`confirmPayment: signature mismatch for ${orderId}`);
      return { ok: false };
    }

    // Ask Razorpay itself. Capture follows authorisation almost instantly, so allow it a moment.
    let payment = await fetchPayment(paymentId);
    for (let i = 0; i < 3 && payment.status === "authorized"; i++) {
      await new Promise((r) => setTimeout(r, 1500));
      payment = await fetchPayment(paymentId);
    }
    if (!paymentSettlesOrder(payment, row.razorpay_order_id, row.total)) {
      console.error(
        `confirmPayment: ${orderId} not settled | status=${payment.status} order=${payment.order_id} amount=${payment.amount} expected=${row.total * 100}`,
      );
      return { ok: false };
    }

    // Only a pending order moves to paid, so this and the webhook can't both process it.
    const { error } = await db
      .from("orders")
      .update({ status: "paid", razorpay_payment_id: paymentId, paid_at: new Date().toISOString() })
      .eq("id", orderId)
      .eq("status", "pending_payment");
    // The payment is genuine either way; the order.paid webhook will retry the update.
    if (error) console.error(`confirmPayment: could not mark ${orderId} paid`, error.message);
    return { ok: true };
  } catch (err) {
    console.error("confirmPayment failed", err);
    return { ok: false };
  }
}
