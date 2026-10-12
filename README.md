# Verona Arts

Online art store for paintings — pencil sketches, oil, acrylic and digital art. Built with Next.js; content, images
and admin sign-in are stored in Supabase. See [PLAN.md](PLAN.md) for the original plan.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the Supabase and Razorpay values
npm run dev
```

Open http://localhost:3000. The admin dashboard is at http://localhost:3000/admin.

## Supabase

- Project: `verona-arts` (region `ap-south-1`, Mumbai).
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` come from
  Dashboard → Project Settings → API Keys. Add the same two variables to your hosting provider (e.g. Vercel).
- Schema, security policies and the `media` image bucket: [`supabase/migrations/`](supabase/migrations/).
  Starting content: [`supabase/seed.sql`](supabase/seed.sql).
- Apply new migrations with `npm run db:migrate` (`-- --status` lists applied / pending). It needs
  `SUPABASE_DB_URL` in `.env.local`: Dashboard → **Connect** → Connection String → Method **Session pooler**.
  This is the database password, so it stays local and is never added to the hosting provider.

### Google sign-in (one-time setup)

1. In [Google Cloud Console → Clients](https://console.cloud.google.com/auth/clients/create), create an OAuth client
   of type **Web application**.
   - Authorized JavaScript origins: `http://localhost:3000` and `https://www.veronaarts.com`.
   - Authorized redirect URI: `https://wkvjoztjwturtlwbnwdh.supabase.co/auth/v1/callback`
2. In Supabase → Authentication → Sign In / Providers → **Google**: enable it and paste the Client ID and Client Secret.
3. In Supabase → Authentication → URL Configuration: set **Site URL** to `https://www.veronaarts.com`, and add these
   **Redirect URLs**: `https://www.veronaarts.com/**`, `http://localhost:3000/**` and
   `https://the-art-house-*-satyaprakashreddy6789-1469s-projects.vercel.app/**` (Vercel previews).
   A sign-in that returns to an address not on this list is sent to the Site URL instead.

### Admins

Anyone can sign in with Google as a customer. Admin access is limited to emails in the `admins` table, signed in
with Google. Manage the list at `/admin/admins`. Admin checks are enforced by row-level security in the
database, not only in the app.

## Payments (Razorpay) and orders

Checkout uses [Razorpay Standard Checkout](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/):

1. `placeOrder` (`src/app/(store)/checkout/actions.ts`) re-prices the cart from the database, creates a Razorpay
   order for that amount and saves an `orders` row as `pending_payment`.
2. The browser opens Checkout with that order. On success, `confirmPayment` verifies Razorpay's signature against
   the order ID stored in the database, then fetches the payment from Razorpay and marks the order `paid` only if it
   is `captured`, for that Razorpay order, for exactly the order total.
3. The webhook at `/api/razorpay/webhook` (signature-checked) does the same if the customer closes the tab before
   step 2 finishes. Either path only moves a `pending_payment` order to `paid`, so an order is never processed twice.

Setup:

- Add `SUPABASE_SECRET_KEY`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` to `.env.local`
  and to the hosting provider (see `.env.example`). Use Test Mode keys until you go live.
- Orders are created with `payment_capture: 1`, so payments are captured automatically whatever the Dashboard's
  capture setting is.
- Razorpay Dashboard → **Webhooks**: add `https://www.veronaarts.com/api/razorpay/webhook` with the events
  `order.paid` and `payment.captured`, using the same secret as `RAZORPAY_WEBHOOK_SECRET`.
- Test payments: card `4100 2800 0000 1007` (any future expiry, any CVV) or UPI ID `success@razorpay`.

Orders are listed at `/admin/orders`. They can only be written by the server, never through the browser.

When an order is paid, the customer gets a confirmation email and `info@veronaarts.com` gets a new-order alert
(`src/lib/email.ts`, sent through [Resend](https://resend.com) with `RESEND_KEY`). `veronaarts.com` must be verified in
Resend → Domains (its DNS records go in GoDaddy, next to the Zoho mail records); until then Resend refuses to send.
A failed email is logged and never affects the payment.

When an order is paid, every one-of-a-kind original in it is marked **Sold** (`products.is_sold`): it stays listed
with a Sold badge but can't be bought. Untick "Sold" in Admin → Products to put it back on sale.

On phones, UPI payments switch to the payment app and the browser may reload the tab. The order ID is kept in the
browser while payment is open; when the shopper returns, `checkOrderPayment` asks Razorpay whether it was paid and,
if so, shows the confirmation and empties the cart (`src/components/cart/PendingPaymentCheck.tsx`).

## Where things live

| What | Where |
|---|---|
| Products, hero slides, categories, coupons, offers, announcements, testimonials, FAQs | Supabase — edit at `/admin` |
| Prices, sizes, add-on and shipping rules | `src/data/pricing.ts` |
| Policy page text | `src/data/policies.ts` |
| Loading site content for the storefront | `src/lib/site-data.ts`, `src/lib/catalog.ts` |
| Admin save / delete / reorder actions | `src/app/admin/actions.ts` |
| Price and coupon calculation | `src/lib/price.ts`, `src/lib/cart.ts` |
| Cart, wishlist and UI state (saved in the browser) | `src/context/` |

Storefront pages are pre-rendered and refreshed automatically when an admin saves a change (and at least hourly).

## Still mocked

- No order emails are sent yet; check new orders at `/admin/orders`.
- Custom-art photos are only previewed in the browser; nothing is uploaded.
- The newsletter and contact forms only show a confirmation message.
- Cart and wishlist live in the browser's `localStorage`.

Test coupon codes: `WELCOME10`, `BUY2`, `BUY3`, `FESTIVE25`, `LOVE15`.
