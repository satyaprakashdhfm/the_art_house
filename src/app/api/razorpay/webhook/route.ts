import { markOrderPaid } from "@/lib/orders";
import { paymentSettlesOrder, verifyWebhookSignature, type RazorpayPayment } from "@/lib/razorpay";
import { createSecretClient } from "@/lib/supabase/secret";

/**
 * Razorpay webhook (Dashboard → Webhooks, events: order.paid, payment.captured).
 * Marks orders paid even when the customer closes the tab before Checkout's handler runs.
 * Any verified delivery gets a 200 unless saving failed, so Razorpay only retries what can succeed.
 */
export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifyWebhookSignature(raw, request.headers.get("x-razorpay-signature") ?? "")) {
    return new Response("Invalid signature", { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    return new Response("Bad JSON", { status: 400 });
  }
  if (event.event !== "order.paid" && event.event !== "payment.captured") return new Response("Ignored");

  const payment = event.payload?.payment?.entity as RazorpayPayment | undefined;
  if (!payment?.order_id) return new Response("Ignored");

  const db = createSecretClient();
  const { data: row, error: readError } = await db
    .from("orders")
    .select("id, status, total")
    .eq("razorpay_order_id", payment.order_id)
    .maybeSingle();
  if (readError) return new Response(`Could not read order: ${readError.message}`, { status: 500 });
  if (!row || row.status === "paid") return new Response("OK");

  if (!paymentSettlesOrder(payment, payment.order_id, row.total)) {
    console.error(`webhook: ${row.id} not settled | status=${payment.status} amount=${payment.amount} expected=${row.total * 100}`);
    return new Response("Ignored");
  }

  // A non-2xx response makes Razorpay retry the delivery.
  if (!(await markOrderPaid(row.id, payment.id))) return new Response("Could not update order", { status: 500 });
  return new Response("OK");
}
