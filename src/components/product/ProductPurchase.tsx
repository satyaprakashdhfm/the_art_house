"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Truck } from "lucide-react";
import type { Addons, Product } from "@/types";
import WishlistButton from "@/components/product/WishlistButton";
import { SIZES, EXPRESS_PRICE, GIFT_WRAP_PRICE, FRAME_PRICES, FREE_FRAME_SIZES } from "@/data/pricing";
import { addonsPrice, framePrice, isDigitalFile, productPrice } from "@/lib/price";
import { formatINR } from "@/lib/format";
import { cartActions } from "@/context/cart";
import { ui } from "@/context/ui";

export default function ProductPurchase({ product }: { product: Product }) {
  const router = useRouter();
  const sizeOptions = SIZES[product.medium].filter((s) => product.sizes.includes(s.key));
  const defaultSize = sizeOptions.find((s) => s.key === "A3" || s.key === "18x24")?.key ?? sizeOptions[0].key;
  const [size, setSize] = useState(defaultSize);
  const [addons, setAddons] = useState<Addons>({ frame: false, giftWrap: false, express: false });
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState("");
  const [delivery, setDelivery] = useState<string | null>(null);

  const isOriginal = product.type === "original";
  const digital = isDigitalFile(size);
  const unit = productPrice(product, size) + addonsPrice(size, addons);
  const freeFrame = FREE_FRAME_SIZES.includes(size);

  const toggle = (k: keyof Addons) => setAddons((a) => ({ ...a, [k]: !a[k] }));

  function add(buyNow: boolean) {
    cartActions.add(product, size, addons, qty);
    if (buyNow) router.push("/checkout");
    else {
      ui.toast(`Added “${product.title}” to cart`);
      ui.openCart();
    }
  }

  function checkPincode(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[1-9]\d{5}$/.test(pincode)) return setDelivery("Please enter a valid 6-digit pincode.");
    const days = product.type === "made-to-order" ? "12–18" : addons.express ? "2–4" : "5–7";
    setDelivery(`Delivers to ${pincode} in ${days} days.`);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-serif text-3xl">{formatINR(unit * qty)}</p>
        <p className="mt-1 text-xs text-muted">Inclusive of all taxes · Extra 5% off on prepaid orders</p>
      </div>

      <div>
        <p className="label">Size</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {sizeOptions.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSize(s.key)}
              aria-pressed={size === s.key}
              className={`border px-3 py-2 text-left transition-colors ${
                size === s.key ? "border-ink bg-ink text-paper" : "border-line bg-card hover:border-ink"
              }`}
            >
              <span className="block text-sm">{s.label}</span>
              <span className={`block text-[11px] ${size === s.key ? "text-paper/70" : "text-muted"}`}>
                {s.detail} · {formatINR(productPrice(product, s.key))}
              </span>
            </button>
          ))}
        </div>
      </div>

      {!digital && (
        <div>
          <p className="label">Add-ons</p>
          <div className="space-y-2">
            <label className="flex cursor-pointer items-center justify-between border border-line bg-card px-3 py-2.5 text-sm">
              <span className="flex items-center gap-2">
                <input type="checkbox" checked={addons.frame} onChange={() => toggle("frame")} className="accent-ink" />
                Wooden frame
              </span>
              <span>
                {freeFrame ? (
                  <>
                    <s className="mr-1.5 text-muted">{formatINR(FRAME_PRICES[size])}</s>
                    <span className="text-gold-dark">Free</span>
                  </>
                ) : (
                  `+ ${formatINR(framePrice(size))}`
                )}
              </span>
            </label>
            <label className="flex cursor-pointer items-center justify-between border border-line bg-card px-3 py-2.5 text-sm">
              <span className="flex items-center gap-2">
                <input type="checkbox" checked={addons.giftWrap} onChange={() => toggle("giftWrap")} className="accent-ink" />
                Gift wrap with note
              </span>
              <span>+ {formatINR(GIFT_WRAP_PRICE)}</span>
            </label>
            <label className="flex cursor-pointer items-center justify-between border border-line bg-card px-3 py-2.5 text-sm">
              <span className="flex items-center gap-2">
                <input type="checkbox" checked={addons.express} onChange={() => toggle("express")} className="accent-ink" />
                Express delivery
              </span>
              <span>+ {formatINR(EXPRESS_PRICE)}</span>
            </label>
          </div>
        </div>
      )}

      <div className="flex items-stretch gap-3">
        <div className="flex items-center border border-line bg-card">
          <button
            type="button"
            className="px-3 py-3 disabled:opacity-30"
            aria-label="Decrease quantity"
            disabled={qty <= 1}
            onClick={() => setQty((q) => q - 1)}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm">{qty}</span>
          <button
            type="button"
            className="px-3 py-3 disabled:opacity-30"
            aria-label="Increase quantity"
            disabled={isOriginal || qty >= 10}
            onClick={() => setQty((q) => q + 1)}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button type="button" onClick={() => add(false)} className="btn-outline flex-1">
          Add to cart
        </button>
        <WishlistButton
          productId={product.id}
          className="flex w-12 items-center justify-center border border-line bg-card hover:border-ink"
        />
      </div>
      <button type="button" onClick={() => add(true)} className="btn-primary w-full">
        Buy now
      </button>
      {isOriginal && <p className="text-xs text-muted">One-of-a-kind original — only 1 available.</p>}

      <form onSubmit={checkPincode} className="border-t border-line pt-5">
        <p className="label flex items-center gap-2">
          <Truck className="h-4 w-4" /> Check delivery
        </p>
        <div className="flex">
          <input
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            placeholder="Enter pincode"
            className="input"
            aria-label="Pincode"
          />
          <button type="submit" className="btn-outline px-4 py-2">
            Check
          </button>
        </div>
        {delivery && <p className="mt-2 text-xs text-muted">{delivery}</p>}
      </form>
    </div>
  );
}
