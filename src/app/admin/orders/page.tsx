import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getSession } from "@/lib/auth";
import type { OrderRow } from "@/lib/db";
import { formatINR } from "@/lib/format";

export const metadata = { title: "Orders" };

const STATUS: Record<OrderRow["status"], { label: string; className: string }> = {
  paid: { label: "Paid online", className: "bg-green-50 text-green-700" },
  pending_payment: { label: "Payment not completed", className: "bg-line text-muted" },
};

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });

export default async function OrdersAdminPage({ searchParams }: PageProps<"/admin/orders">) {
  const showAll = (await searchParams).all === "1";
  const { supabase } = await getSession();
  let query = supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(200);
  if (!showAll) query = query.neq("status", "pending_payment");
  const { data, error } = await query;
  if (error) throw new Error(`Could not load orders: ${error.message}`);
  const orders = data as OrderRow[];

  return (
    <>
      <AdminPageHeader
        title="Orders"
        description="Orders placed on the website, newest first. Payments can also be checked in the Razorpay Dashboard."
        actions={
          <Link href={showAll ? "/admin/orders" : "/admin/orders?all=1"} className="btn-outline px-4 py-2.5">
            {showAll ? "Hide unpaid attempts" : "Show unpaid attempts"}
          </Link>
        }
      />

      {orders.length === 0 ? (
        <p className="border border-line bg-paper p-10 text-center text-sm text-muted">No orders yet.</p>
      ) : (
        <ul className="divide-y divide-line border border-line bg-paper">
          {orders.map((o) => (
            <li key={o.id}>
              <details className="group">
                <summary className="flex cursor-pointer flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 hover:bg-card/60">
                  <span className="font-medium">{o.id}</span>
                  <span className="text-sm text-muted">{when(o.created_at)}</span>
                  <span className="min-w-0 flex-1 truncate text-sm">
                    {o.name} · {o.city}
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] ${STATUS[o.status].className}`}>{STATUS[o.status].label}</span>
                  <span className="w-24 text-right font-medium">{formatINR(o.total)}</span>
                </summary>

                <div className="grid gap-6 border-t border-line bg-card/40 px-5 py-5 text-sm md:grid-cols-2">
                  <div>
                    <p className="eyebrow">Deliver to</p>
                    <p className="mt-2 font-medium">{o.name}</p>
                    <p className="whitespace-pre-line">{o.address}</p>
                    <p>
                      {o.city}, {o.state} {o.pincode}
                    </p>
                    <p className="mt-2">
                      <a href={`tel:+91${o.phone}`} className="text-gold-dark hover:underline">
                        +91 {o.phone}
                      </a>{" "}
                      ·{" "}
                      <a href={`mailto:${o.email}`} className="text-gold-dark hover:underline">
                        {o.email}
                      </a>
                    </p>
                    {o.razorpay_payment_id && <p className="mt-2 text-xs text-muted">Razorpay payment {o.razorpay_payment_id}</p>}
                  </div>

                  <div>
                    <p className="eyebrow">Items</p>
                    <ul className="mt-2 space-y-2">
                      {o.lines.map((l, i) => (
                        <li key={i} className="flex justify-between gap-3">
                          <span>
                            {l.title} <span className="text-muted">× {l.qty}</span>
                            <span className="block text-xs text-muted">
                              {[l.sizeLabel, l.addons.frame && "Frame", l.addons.giftWrap && "Gift wrap", l.addons.express && "Express"]
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                          </span>
                          <span>{formatINR(l.lineTotal)}</span>
                        </li>
                      ))}
                    </ul>
                    <dl className="mt-4 space-y-1 border-t border-line pt-3 text-muted">
                      {(
                        [
                          ["Subtotal", o.subtotal],
                          [`Coupon${o.coupon ? ` (${o.coupon})` : ""}`, -o.coupon_discount],
                          ["Shipping", o.shipping],
                        ] as [string, number][]
                      )
                        .filter(([, v]) => v !== 0)
                        .map(([k, v]) => (
                          <div key={k} className="flex justify-between">
                            <dt>{k}</dt>
                            <dd>{v < 0 ? `− ${formatINR(-v)}` : formatINR(v)}</dd>
                          </div>
                        ))}
                      <div className="flex justify-between font-medium text-ink">
                        <dt>Total</dt>
                        <dd>{formatINR(o.total)}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
