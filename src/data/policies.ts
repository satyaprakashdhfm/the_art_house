export type Policy = { slug: string; title: string; sections: { heading: string; body: string[] }[] };

/** Placeholder policy text for the mock phase — have these reviewed before launch. */
export const POLICIES: Policy[] = [
  {
    slug: "shipping-returns",
    title: "Shipping & Returns",
    sections: [
      { heading: "Where we ship", body: ["We currently ship to all serviceable pincodes within India."] },
      {
        heading: "Delivery timelines",
        body: [
          "Ready originals and prints: dispatched in 2–3 days, delivered in 5–7 days.",
          "Made-to-order and custom paintings: 12–18 days, or 7–10 days with a rush order.",
          "Express delivery (₹299) shortens transit time after dispatch.",
        ],
      },
      { heading: "Shipping charges", body: ["Free on orders above ₹1,999. A flat ₹99 applies below that. Digital files are delivered by email at no charge."] },
      {
        heading: "Damaged in transit",
        body: [
          "Please record an unboxing video. If your artwork arrives damaged, contact us within 7 days with photos and we will replace it or issue a full refund.",
        ],
      },
    ],
  },
  {
    slug: "refund",
    title: "Refund Policy",
    sections: [
      { heading: "Ready artworks", body: ["Refunds are issued for items damaged in transit or significantly different from their description, reported within 7 days of delivery."] },
      { heading: "Custom orders", body: ["Custom artworks are made specially for you and cannot be refunded for change of mind once the preview is approved. The 50% advance is refundable only if we are unable to begin work."] },
      { heading: "Processing", body: ["Approved refunds are processed to the original payment method within 5–7 working days. COD orders are refunded by bank transfer or UPI."] },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    sections: [
      { heading: "What we collect", body: ["Your name, contact details and delivery address to fulfil orders, and photos you upload for custom art."] },
      { heading: "How we use it", body: ["Only to process orders, provide support and — if you opt in — send occasional offers. We never sell your data."] },
      { heading: "Your photos", body: ["Photos uploaded for custom art are used only to create your artwork and are deleted after delivery unless you allow us to feature the result."] },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    sections: [
      { heading: "Artwork", body: ["Hand-made artworks may vary slightly from photos in colour and texture — that is part of their character. Copyright in all artworks remains with the artist."] },
      { heading: "Pricing", body: ["Prices are in Indian Rupees and inclusive of taxes. We reserve the right to correct pricing errors."] },
      { heading: "Offers", body: ["Only one coupon can be used per order. Offers may be changed or withdrawn at any time."] },
    ],
  },
];

export function getPolicy(slug: string) {
  return POLICIES.find((p) => p.slug === slug);
}
