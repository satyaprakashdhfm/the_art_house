export type FAQ = { q: string; a: string };

export const GENERAL_FAQS: FAQ[] = [
  { q: "Are the paintings hand-made?", a: "Yes. Pencil, oil and acrylic artworks are created entirely by hand. Digital paintings are drawn digitally by the artist and printed on archival fine-art paper." },
  { q: "What is the difference between Original, Made-to-order and Print?", a: "Originals are one-of-a-kind finished pieces, ready to ship. Made-to-order paintings are painted fresh in the size you choose. Prints are high-quality reproductions of digital artworks." },
  { q: "How long does delivery take?", a: "Ready originals and prints ship in 5–7 days. Made-to-order paintings take 12–18 days. Express delivery is available at checkout." },
  { q: "Do you ship outside India?", a: "Not yet — we currently deliver across India only." },
  { q: "Is shipping free?", a: "Shipping is free on orders above ₹1,999. Below that, a flat ₹99 applies." },
  { q: "Which payment methods do you accept?", a: "UPI, debit/credit cards, net banking and wallets via Razorpay, plus Cash on Delivery (₹49 fee). Prepaid orders get an extra 5% off." },
  { q: "Can I return a painting?", a: "If your artwork arrives damaged, tell us within 7 days with an unboxing photo and we will replace or refund it. Custom orders cannot be returned for change of mind." },
  { q: "Do paintings come framed?", a: "Frames are an optional add-on. Every A2, A1, 24×36\" and 36×48\" artwork gets a free frame." },
];

export const CUSTOM_FAQS: FAQ[] = [
  { q: "What kind of photo should I upload?", a: "A clear, well-lit photo where faces are sharp and not too small. Multiple photos are fine — we can combine people from different pictures." },
  { q: "How many revisions do I get?", a: "We send a free digital preview before painting, and include 2 free revisions." },
  { q: "How much do I pay upfront?", a: "A 50% advance to start, and the balance before dispatch." },
  { q: "How long does a custom painting take?", a: "Usually 12–18 days depending on size and medium. A rush option (7–10 days) is available for +25%." },
];
