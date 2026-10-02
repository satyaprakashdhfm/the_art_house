"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cartActions } from "@/context/cart";
import { findCoupon } from "@/data/offers";

export default function CouponInput({ applied, error }: { applied: string | null; error?: string }) {
  const [code, setCode] = useState("");
  const [invalid, setInvalid] = useState(false);

  if (applied) {
    return (
      <div>
        <div className="flex items-center justify-between border border-dashed border-gold px-3 py-2 text-sm">
          <span>
            Coupon <span className="font-semibold">{applied}</span> applied
          </span>
          <button type="button" onClick={() => cartActions.setCoupon(null)} aria-label="Remove coupon">
            <X className="h-4 w-4" />
          </button>
        </div>
        {error && <p className="mt-1.5 text-xs text-sale">{error}</p>}
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const coupon = findCoupon(code);
        if (!coupon) return setInvalid(true);
        cartActions.setCoupon(coupon.code);
        setCode("");
        setInvalid(false);
      }}
    >
      <div className="flex">
        <input
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setInvalid(false);
          }}
          placeholder="Coupon code"
          className="input uppercase"
          aria-label="Coupon code"
        />
        <button type="submit" className="btn-outline px-4 py-2" disabled={!code.trim()}>
          Apply
        </button>
      </div>
      {invalid && <p className="mt-1.5 text-xs text-sale">This coupon code is not valid.</p>}
    </form>
  );
}
