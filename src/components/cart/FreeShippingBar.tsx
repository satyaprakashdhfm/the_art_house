import { FREE_SHIPPING_THRESHOLD } from "@/data/pricing";
import { formatINR } from "@/lib/format";

export default function FreeShippingBar({ remaining }: { remaining: number }) {
  const pct = Math.min(100, ((FREE_SHIPPING_THRESHOLD - remaining) / FREE_SHIPPING_THRESHOLD) * 100);
  return (
    <div>
      <p className="text-xs text-muted">
        {remaining > 0 ? (
          <>
            You&apos;re <span className="font-medium text-ink">{formatINR(remaining)}</span> away from free shipping
          </>
        ) : (
          <span className="font-medium text-gold-dark">You&apos;ve unlocked free shipping!</span>
        )}
      </p>
      <div className="mt-2 h-1 w-full bg-line">
        <div className="h-full bg-gold transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
