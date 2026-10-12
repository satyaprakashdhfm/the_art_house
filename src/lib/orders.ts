import { revalidatePath } from "next/cache";
import type { OrderRow } from "@/lib/db";
import { sendOrderEmails } from "@/lib/email";
import { fetchOrderPayments, paymentSettlesOrder } from "@/lib/razorpay";
import { createSecretClient } from "@/lib/supabase/secret";

/** Server-only: what happens when an order's payment is confirmed. */

/**
 * Marks a pending order paid and the one-of-a-kind originals in it sold. The Checkout handler, the
 * webhook and a status check can all race to call this; only the one whose update moves the row
 * out of `pending_payment` does the follow-up. Returns false only if the order couldn't be saved.
 */
export async function markOrderPaid(orderId: string, paymentId: string) {
  const db = createSecretClient();
  const { data, error } = await db
    .from("orders")
    .update({ status: "paid", razorpay_payment_id: paymentId, paid_at: new Date().toISOString() })
    .eq("id", orderId)
    .eq("status", "pending_payment")
    .select("*");
  if (error) {
    console.error(`markOrderPaid: could not mark ${orderId} paid`, error.message);
    return false;
  }
  if (!data?.length) return true; // Already paid through another path.
  const order = data[0] as OrderRow;

  const productIds = order.lines.map((l) => l.productId);
  const { error: soldError } = await db
    .from("products")
    .update({ is_sold: true, updated_at: new Date().toISOString() })
    .in("id", productIds)
    .eq("type", "original");
  if (soldError) console.error(`markOrderPaid: could not mark products of ${orderId} sold`, soldError.message);

  // Sold pieces must disappear from sale on every cached page.
  revalidatePath("/", "layout");

  // Only the caller that marked it paid gets here, so each order is emailed once. Never throws.
  await sendOrderEmails(order);
  return true;
}

/**
 * The order's payment status, settling it from Razorpay if the money arrived but neither the
 * Checkout handler nor the webhook has recorded it yet (e.g. the phone switched to a UPI app).
 */
export async function syncOrderPayment(orderId: string): Promise<"paid" | "pending" | "unknown"> {
  const { data: row } = await createSecretClient()
    .from("orders")
    .select("status, razorpay_order_id, total")
    .eq("id", orderId)
    .maybeSingle();
  if (!row) return "unknown";
  if (row.status === "paid") return "paid";

  const payments = await fetchOrderPayments(row.razorpay_order_id);
  const settled = payments.find((p) => paymentSettlesOrder(p, row.razorpay_order_id, row.total));
  return settled && (await markOrderPaid(orderId, settled.id)) ? "paid" : "pending";
}
