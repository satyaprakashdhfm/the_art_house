# Verona Arts

Online art store for paintings — pencil sketches, oil, acrylic and digital art. Built with Next.js; content, images
and admin sign-in are stored in Supabase. See [PLAN.md](PLAN.md) for the original plan.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the two Supabase values
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
   - Authorized JavaScript origins: `http://localhost:3000` and your live site URL.
   - Authorized redirect URI: `https://wkvjoztjwturtlwbnwdh.supabase.co/auth/v1/callback`
2. In Supabase → Authentication → Sign In / Providers → **Google**: enable it and paste the Client ID and Client Secret.
3. In Supabase → Authentication → URL Configuration: set **Site URL** to your live site, and add
   `http://localhost:3000/auth/callback` and `https://<your-site>/auth/callback` to **Redirect URLs**.

### Admins

Anyone can sign in with Google as a customer. Admin access is limited to emails in the `admins` table, signed in
with Google. Manage the list at `/admin/admins`. Admin checks are enforced by row-level security in the
database, not only in the app.

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

- Checkout makes up an order ID; no payment is taken.
- Custom-art photos are only previewed in the browser; nothing is uploaded.
- The newsletter and contact forms only show a confirmation message.
- Cart and wishlist live in the browser's `localStorage`.

Test coupon codes: `WELCOME10`, `BUY2`, `BUY3`, `FESTIVE25`, `LOVE15`.
