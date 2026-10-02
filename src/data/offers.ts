import type { Coupon } from "@/types";
import { FREE_SHIPPING_THRESHOLD } from "@/data/pricing";

export const COUPONS: Coupon[] = [
  {
    code: "WELCOME10",
    title: "10% off your first order",
    description: "New here? Take 10% off anything in the store.",
    terms: "Max discount ₹500. One use per customer.",
  },
  {
    code: "BUY2",
    title: "Buy 2, save 10%",
    description: "Pick any two artworks and save 10% on the lot.",
    terms: "Cart must contain 2 or more items.",
  },
  {
    code: "BUY3",
    title: "Buy 3+, save 15%",
    description: "Building a gallery wall? Save 15% on 3 or more pieces.",
    terms: "Cart must contain 3 or more items.",
  },
  {
    code: "FESTIVE25",
    title: "Festive 25% off Spiritual art",
    description: "Celebrate Janmashtami, Ganesh Chaturthi, Shivratri and Diwali.",
    terms: "Applies to Spiritual category items only.",
  },
  {
    code: "LOVE15",
    title: "15% off Couple Art & Portraits",
    description: "For anniversaries, Valentine's, Mother's and Father's Day.",
    terms: "Applies to Portraits, Pencil Portraits and Couple Art.",
  },
];

export const STANDING_OFFERS = [
  { title: "Free shipping", text: `On all orders above ₹${FREE_SHIPPING_THRESHOLD.toLocaleString("en-IN")}.` },
  { title: "Extra 5% off on prepaid", text: "Pay online with UPI, card or net banking and save 5% more." },
  { title: "Free frame", text: 'On every A2, A1, 24×36" and 36×48" artwork.' },
  { title: "Custom portrait promise", text: "Free digital preview and 2 free revisions on every custom order." },
];

export function findCoupon(code: string) {
  return COUPONS.find((c) => c.code === code.trim().toUpperCase());
}
