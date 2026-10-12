import { createHmac, timingSafeEqual } from "node:crypto";

/** Server-only Razorpay helpers (Orders API + signature checks). The key secret never leaves the server. */

function keys() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error("RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set.");
  return { keyId, keySecret };
}

/** The public Key ID passed to Checkout in the browser. */
export const razorpayKeyId = () => keys().keyId;

/** Creates a Razorpay order. `amount` is in paise. */
export async function createRazorpayOrder(amount: number, receipt: string, notes: Record<string, string>) {
  const { keyId, keySecret } = keys();
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    // payment_capture: 1 captures automatically, whatever the Dashboard's capture setting says.
    body: JSON.stringify({ amount, currency: "INR", receipt, notes, payment_capture: 1 }),
    cache: "no-store",
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Razorpay order failed: ${body?.error?.description ?? res.status}`);
  return body as { id: string; amount: number; currency: string };
}

export type RazorpayPayment = { id: string; order_id: string; amount: number; currency: string; status: string };

/** A payment's real status and amount, straight from Razorpay. */
export async function fetchPayment(paymentId: string) {
  const { keyId, keySecret } = keys();
  const res = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}` },
    cache: "no-store",
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Razorpay payment fetch failed: ${body?.error?.description ?? res.status}`);
  return body as RazorpayPayment;
}

/** Every payment attempt on a Razorpay order (failed ones included). */
export async function fetchOrderPayments(razorpayOrderId: string) {
  const { keyId, keySecret } = keys();
  const res = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(razorpayOrderId)}/payments`, {
    headers: { Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}` },
    cache: "no-store",
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Razorpay order payments fetch failed: ${body?.error?.description ?? res.status}`);
  return (body.items ?? []) as RazorpayPayment[];
}

/**
 * A signature only proves the fields weren't tampered with. Before an order counts as paid, the
 * payment itself must be captured, for this Razorpay order, for exactly the order's total.
 */
export function paymentSettlesOrder(payment: RazorpayPayment, razorpayOrderId: string, totalRupees: number) {
  return (
    payment.status === "captured" &&
    payment.order_id === razorpayOrderId &&
    payment.currency === "INR" &&
    Number(payment.amount) === totalRupees * 100
  );
}

function hmacMatches(payload: string, secret: string, signature: string) {
  const expected = Buffer.from(createHmac("sha256", secret).update(payload).digest("hex"));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/** Checks the signature Checkout returns. `orderId` must come from our database, not the browser. */
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  return hmacMatches(`${orderId}|${paymentId}`, keys().keySecret, signature);
}

/** Checks the X-Razorpay-Signature header of a webhook against the raw request body. */
export function verifyWebhookSignature(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  return !!secret && hmacMatches(rawBody, secret, signature);
}
