# The Art House

Online art store for paintings — pencil sketches, oil, acrylic and digital art. This is **Phase 1**: a frontend-only mock built with Next.js, using sample data. See [PLAN.md](PLAN.md) for the full plan.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Where things live

| What | Where |
|---|---|
| Prices, sizes, add-on and shipping rules | `src/data/pricing.ts` |
| Sample paintings | `src/data/products.ts` |
| Categories | `src/data/categories.ts` |
| Coupons and offers | `src/data/offers.ts` (rules in `src/lib/cart.ts`) |
| FAQ and policy text | `src/data/faqs.ts`, `src/data/policies.ts` |
| Price calculation | `src/lib/price.ts` |
| Cart, wishlist and UI state (saved in the browser) | `src/context/` |

## What is mocked

- Products, reviews and images are sample data. Images come from picsum.photos.
- The cart, wishlist and last order are saved in the browser's `localStorage`.
- Checkout makes up an order ID; no payment is taken.
- Custom-art photos are only previewed in the browser; nothing is uploaded.
- The newsletter and contact forms only show a confirmation message.

Test coupon codes: `WELCOME10`, `BUY2`, `BUY3`, `FESTIVE25`, `LOVE15`.
