export type Review = { name: string; city: string; rating: number; text: string; date: string };

const POOL: Review[] = [
  { name: "Ananya R.", city: "Bengaluru", rating: 5, text: "Even more beautiful in person. The colours are rich and the packaging was excellent.", date: "Aug 2026" },
  { name: "Rahul M.", city: "Pune", rating: 5, text: "Ordered as an anniversary gift — my wife loved it. Delivered before the promised date.", date: "Jul 2026" },
  { name: "Priya S.", city: "Hyderabad", rating: 4, text: "Lovely detailing. The frame is sturdy and looks premium. Would buy again.", date: "Jun 2026" },
  { name: "Vikram K.", city: "Delhi", rating: 5, text: "Exactly like the photos. The artist even shared progress pictures on WhatsApp.", date: "Jun 2026" },
  { name: "Meera J.", city: "Chennai", rating: 5, text: "It has become the centrepiece of our living room. Thank you!", date: "May 2026" },
  { name: "Sandeep T.", city: "Kolkata", rating: 4, text: "Great quality canvas and very well packed. Took a few extra days but worth it.", date: "Apr 2026" },
];

/** Deterministic mock reviews for a product. */
export function reviewsFor(productId: string, count = 3) {
  const offset = Number(productId.replace(/\D/g, "")) % POOL.length;
  return Array.from({ length: count }, (_, i) => POOL[(offset + i) % POOL.length]);
}

export const TESTIMONIALS = POOL.slice(0, 4);
