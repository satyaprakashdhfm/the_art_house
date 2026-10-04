"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import type { PricedLine } from "@/lib/cart";
import { cartActions } from "@/context/cart";
import { formatINR } from "@/lib/format";
import { sizeLabel } from "@/lib/price";
import { MEDIUM_LABELS } from "@/lib/labels";

export default function CartLineItem({ line, onNavigate }: { line: PricedLine; onNavigate?: () => void }) {
  const { product, addons } = line;
  const extras = [addons.frame && "Frame", addons.giftWrap && "Gift wrap", addons.express && "Express"].filter(Boolean);
  const isOriginal = product.type === "original";

  return (
    <div className="flex gap-4 py-4">
      <Link
        href={`/product/${product.slug}`}
        onClick={onNavigate}
        className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden bg-line"
      >
        <Image src={product.images[0]} alt={product.title} fill sizes="80px" className="object-cover" />
      </Link>
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between gap-2">
          <Link href={`/product/${product.slug}`} onClick={onNavigate} className="text-sm hover:text-gold">
            {product.title}
          </Link>
          <button
            type="button"
            onClick={() => cartActions.remove(line.key)}
            aria-label={`Remove ${product.title}`}
            className="text-muted hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-xs text-muted">
          {MEDIUM_LABELS[product.medium]} · {sizeLabel(product.medium, line.size)}
          {extras.length > 0 && ` · ${extras.join(", ")}`}
        </p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center border border-line">
            <button
              type="button"
              className="p-1.5 hover:bg-line"
              aria-label="Decrease quantity"
              onClick={() => cartActions.setQty(line.key, line.qty - 1)}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-sm">{line.qty}</span>
            <button
              type="button"
              className="p-1.5 hover:bg-line disabled:opacity-30"
              aria-label="Increase quantity"
              disabled={isOriginal}
              title={isOriginal ? "One-of-a-kind original" : undefined}
              onClick={() => cartActions.setQty(line.key, line.qty + 1)}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <p className="text-sm font-medium">{formatINR(line.lineTotal)}</p>
        </div>
      </div>
    </div>
  );
}
