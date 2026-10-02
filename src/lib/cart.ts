import type { CartLine, PaymentMethod, Product } from "@/types";
import { getProductById } from "@/data/products";
import {
  COD_FEE,
  FREE_SHIPPING_THRESHOLD,
  PREPAID_DISCOUNT_RATE,
  SHIPPING_FEE,
} from "@/data/pricing";
import { addonsPrice, isDigitalFile, productPrice } from "@/lib/price";

export type PricedLine = CartLine & {
  product: Product;
  unitPrice: number;
  addonsPrice: number;
  lineTotal: number;
};

export function priceLines(lines: CartLine[]): PricedLine[] {
  return lines.flatMap((line) => {
    const product = getProductById(line.productId);
    if (!product) return [];
    const unitPrice = productPrice(product, line.size);
    const addons = addonsPrice(line.size, line.addons);
    return [{ ...line, product, unitPrice, addonsPrice: addons, lineTotal: (unitPrice + addons) * line.qty }];
  });
}

const PORTRAIT_SUBS = ["portraits", "pencil-portraits", "couple-art"];

/** Returns the coupon discount, or an error message explaining why it doesn't apply. */
export function couponDiscount(code: string, lines: PricedLine[]): { amount: number; error?: string } {
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const items = lines.reduce((s, l) => s + l.qty, 0);
  switch (code) {
    case "WELCOME10":
      return { amount: Math.min(500, subtotal * 0.1) };
    case "BUY2":
      return items >= 2 ? { amount: subtotal * 0.1 } : { amount: 0, error: "Add 2 or more items to use BUY2." };
    case "BUY3":
      return items >= 3 ? { amount: subtotal * 0.15 } : { amount: 0, error: "Add 3 or more items to use BUY3." };
    case "FESTIVE25": {
      const eligible = lines.filter((l) => l.product.group === "spiritual").reduce((s, l) => s + l.lineTotal, 0);
      return eligible > 0 ? { amount: eligible * 0.25 } : { amount: 0, error: "FESTIVE25 applies to Spiritual art only." };
    }
    case "LOVE15": {
      const eligible = lines
        .filter((l) => PORTRAIT_SUBS.includes(l.product.subCategory))
        .reduce((s, l) => s + l.lineTotal, 0);
      return eligible > 0
        ? { amount: eligible * 0.15 }
        : { amount: 0, error: "LOVE15 applies to Portraits & Couple Art only." };
    }
    default:
      return { amount: 0, error: "This coupon code is not valid." };
  }
}

export type Totals = {
  subtotal: number;
  couponDiscount: number;
  couponError?: string;
  prepaidDiscount: number;
  shipping: number;
  codFee: number;
  total: number;
  itemCount: number;
  amountToFreeShipping: number;
};

export function computeTotals(lines: PricedLine[], coupon: string | null, payment: PaymentMethod | null): Totals {
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const itemCount = lines.reduce((s, l) => s + l.qty, 0);
  const c = coupon ? couponDiscount(coupon, lines) : { amount: 0 };
  const afterCoupon = subtotal - c.amount;
  const prepaidDiscount = payment === "online" ? afterCoupon * PREPAID_DISCOUNT_RATE : 0;
  const physical = lines.some((l) => !isDigitalFile(l.size));
  const freeShip = afterCoupon >= FREE_SHIPPING_THRESHOLD;
  const shipping = lines.length === 0 || !physical || freeShip ? 0 : SHIPPING_FEE;
  const codFee = payment === "cod" ? COD_FEE : 0;
  return {
    subtotal,
    couponDiscount: Math.round(c.amount),
    couponError: c.error,
    prepaidDiscount: Math.round(prepaidDiscount),
    shipping,
    codFee,
    total: Math.round(afterCoupon - prepaidDiscount + shipping + codFee),
    itemCount,
    amountToFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - afterCoupon),
  };
}
