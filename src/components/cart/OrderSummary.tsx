import type { Totals } from "@/lib/cart";
import { formatINR } from "@/lib/format";

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`flex justify-between text-sm ${accent ? "text-gold-dark" : ""}`}>
      <span className={accent ? "" : "text-muted"}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export default function OrderSummary({ totals, coupon }: { totals: Totals; coupon: string | null }) {
  return (
    <div className="space-y-2.5">
      <Row label={`Subtotal (${totals.itemCount} item${totals.itemCount === 1 ? "" : "s"})`} value={formatINR(totals.subtotal)} />
      {totals.couponDiscount > 0 && (
        <Row label={`Coupon (${coupon})`} value={`− ${formatINR(totals.couponDiscount)}`} accent />
      )}
      {totals.prepaidDiscount > 0 && (
        <Row label="Prepaid discount (5%)" value={`− ${formatINR(totals.prepaidDiscount)}`} accent />
      )}
      <Row label="Shipping" value={totals.shipping === 0 ? "Free" : formatINR(totals.shipping)} />
      {totals.codFee > 0 && <Row label="COD fee" value={formatINR(totals.codFee)} />}
      <div className="flex justify-between border-t border-line pt-3 font-medium">
        <span>Total</span>
        <span>{formatINR(totals.total)}</span>
      </div>
      <p className="text-xs text-muted">Inclusive of all taxes.</p>
    </div>
  );
}
