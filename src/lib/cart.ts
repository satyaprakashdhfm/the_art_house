import type { CartLine, Coupon, PaymentMethod, Product } from "@/types";
import type { Catalog } from "@/lib/catalog";
import { couponIsScoped } from "@/lib/catalog";
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

export function priceLines(lines: CartLine[], catalog: Catalog): PricedLine[] {
  return lines.flatMap((line) => {
    const product = catalog.getProductById(line.productId);
    if (!product) return [];
    const unitPrice = productPrice(product, line.size);
    const addons = addonsPrice(line.size, line.addons);
    return [{ ...line, product, unitPrice, addonsPrice: addons, lineTotal: (unitPrice + addons) * line.qty }];
  });
}

/** Returns the coupon discount, or an error message explaining why it doesn't apply. */
export function couponDiscount(coupon: Coupon | undefined, lines: PricedLine[]): { amount: number; error?: string } {
  if (!coupon) return { amount: 0, error: "This coupon code is not valid." };
  const items = lines.reduce((s, l) => s + l.qty, 0);
  if (items < coupon.minItems) {
    return { amount: 0, error: `Add ${coupon.minItems} or more items to use ${coupon.code}.` };
  }
  const eligible = lines
    .filter(
      (l) =>
        !couponIsScoped(coupon) ||
        coupon.groups.includes(l.product.group) ||
        coupon.subs.includes(l.product.subCategory),
    )
    .reduce((s, l) => s + l.lineTotal, 0);
  if (eligible === 0) {
    return { amount: 0, error: `${coupon.code} doesn't apply to the items in your cart. ${coupon.terms}`.trim() };
  }
  const amount = (eligible * coupon.percent) / 100;
  return { amount: coupon.maxDiscount ? Math.min(coupon.maxDiscount, amount) : amount };
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

export function computeTotals(
  lines: PricedLine[],
  coupon: string | null,
  payment: PaymentMethod | null,
  catalog: Catalog,
): Totals {
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const itemCount = lines.reduce((s, l) => s + l.qty, 0);
  const c = coupon ? couponDiscount(catalog.findCoupon(coupon), lines) : { amount: 0 };
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
