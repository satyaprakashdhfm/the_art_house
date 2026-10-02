# The Art House — Project Plan (Phase 1: Frontend Mock App)

> Status: **Plan only.** Phase 1 is a minimal, frontend-only mock app with sample data.
> The backend (database, auth, payments, admin) will be added later.

---

## 1. Decisions (confirmed)

| # | Topic | Decision |
|---|---|---|
| 1 | Tech stack | **Next.js only** (App Router + TypeScript) |
| 2 | Products | **Mix** — ready originals, made-to-order, and prints |
| 3 | Payments | Razorpay + Cash on Delivery (**mocked in Phase 1**) |
| 4 | Shipping | **India only** |
| 5 | Artists | Single artist (default — not yet confirmed) |
| 6 | Brand | **"The Art House"** (text logo for now; may change) |
| 7 | Prices | **Reduced** draft prices (see §6) |
| 8 | Images | **Placeholder images** for now |
| 9 | Design | **Minimal gallery style** (Gallerist-inspired) |
| — | Backend | **Not in Phase 1.** All data is mock; no server, DB, auth, or real payments |

---

## 2. Phase 1 scope — keep it simple

**In scope**
- All customer-facing pages, using mock data from local TypeScript files
- Cart and wishlist kept in the browser (React Context + `localStorage`)
- Coupon codes checked against a mock offers list
- A live price calculator (size + category + add-ons)
- A mock checkout: a form, then a fake order ID on a confirmation page (no real payment)
- A mock custom-art form: shows the photo preview locally and a success message (nothing uploaded)
- Search and filtering done in the browser

**Out of scope (later)**
- Database, user login/accounts, real payments, emails, admin dashboard, image uploads, order tracking, reviews submission

---

## 3. Tech setup

| Item | Choice |
|---|---|
| Framework | Next.js (App Router), TypeScript |
| Styling | Tailwind CSS (no UI library — keep it minimal) |
| Icons | `lucide-react` |
| State | React Context (`CartContext`, `WishlistContext`) persisted to `localStorage` |
| Images | `next/image` with placeholder images from `picsum.photos` (seeded so they stay the same) |
| Fonts | `next/font` — serif for headings (e.g. Playfair Display), sans for body (e.g. Inter) |
| Hosting | Vercel (optional preview deploy) |

---

## 4. Folder structure

```
src/
  app/
    layout.tsx                 # Header, Footer, AnnouncementBar, providers
    page.tsx                   # Home
    shop/page.tsx              # All paintings + filters
    product/[slug]/page.tsx    # Product detail
    categories/page.tsx        # All category groups
    categories/[group]/[sub]/page.tsx   # Sub-category listing
    custom-art/page.tsx        # Custom art calculator + request form
    offers/page.tsx
    about/page.tsx
    wishlist/page.tsx
    cart/page.tsx
    checkout/page.tsx          # Mock checkout
    order-success/page.tsx     # Fake order confirmation
    contact/page.tsx
    faq/page.tsx
    policies/[slug]/page.tsx   # shipping-returns, privacy, terms, refund
    not-found.tsx
  components/
    layout/   Header, MegaMenu, MobileMenu, SearchOverlay, Footer, AnnouncementBar
    product/  ProductCard, ProductGrid, ProductGallery, SizeSelector, AddonPicker, PriceTag
    shop/     FilterSidebar, SortSelect, FilterChips
    home/     Hero, CategoryTiles, MediumCards, ProductRow, CustomArtBanner, ShopByPrice, ShopByRoom, WhyUs, Testimonials, Newsletter
    cart/     CartDrawer, CartLine, CouponInput, FreeShippingBar, OrderSummary
    ui/       Button, Badge, Input, Select, Accordion, Tabs, Modal
  context/    CartContext.tsx, WishlistContext.tsx
  data/       categories.ts, products.ts, pricing.ts, offers.ts, testimonials.ts, faqs.ts
  lib/        price.ts (price calculator), filters.ts, format.ts (₹ formatting)
  types/      index.ts
```

---

## 5. Pages and what they contain

**Header (all pages):**
`LOGO   Home   Shop   Categories ▾   Custom Art   Offers   About        🔍  ♡  🛒`
- Hovering "Categories" opens a mega-menu showing all 6 groups
- The header stays fixed at the top. On mobile it collapses into a hamburger menu
- The ♡ and 🛒 icons show item counts
- Above the header, an announcement bar shows: "Free shipping above ₹1,999 · Use WELCOME10 for 10% off"

### Home
1. Hero — a carousel of 3 banners: Festive Collection, Custom Portraits, New Arrivals
2. Shop by Category — 6 round tiles
3. Shop by Medium — Pencil / Oil / Acrylic / Digital
4. Bestsellers — a row of products
5. Custom Art banner — Upload → Preview → Delivered
6. New Arrivals — a grid
7. Shop by Price — Under ₹999 · ₹1,000–2,999 · ₹3,000–6,999 · ₹7,000+
8. Shop by Room — Living Room, Pooja Room, Bedroom, Office
9. Why Us — Hand-made, Certificate of Authenticity, Safe Packaging, Easy Returns
10. Testimonials (mock)
11. Newsletter signup (mock — shows a toast message only)
12. Footer — links, policies, social icons, contact details

### Shop
- Filters:
  - Category / sub-category
  - Medium
  - Style
  - Size
  - Price range
  - Orientation
  - Ready-to-ship vs Made-to-order
- Sort by: Featured, Newest, Price ↑, Price ↓
- Grid of products: 2 columns on mobile, 4 on desktop. Active filters appear as chips, with a result count
- Filters are saved in the URL query string, so a filtered page can be shared

### Product Detail
- Image gallery with thumbnails and a "view in room" placeholder image
- Title, medium, style and category tags
- **Size selector** — the price updates live
- Add-ons: Frame, Gift wrap, Express delivery
- Add to Cart, Buy Now, Wishlist
- Badges for offers that apply to this product
- Tabs: Description, Specifications, Shipping & Returns, Care
- Mock reviews; a "You may also like" row

### Categories
- `/categories`: 6 group sections, each showing its sub-category tiles
- `/categories/[group]/[sub]`: a banner and intro, then the same grid and filters as Shop with the category already selected

| SPIRITUAL | PORTRAITS & PEOPLE | ANIMALS | NATURE | ART STYLE | MEDIUM |
|---|---|---|---|---|---|
| Radha Krishna | Portraits | Horses | Flowers | Abstract | Pencil |
| Buddha | Pencil Portraits | Dogs | Bouquets | Modern | Oil |
| Ganesha | People | Cats | Landscapes | Traditional | Acrylic |
| Shiva | Couple Art | Wildlife | Scenery | Wall Art | Digital |
| Other Gods | | | | | |

### Custom Art
- How it works: Upload photo → Choose medium & size → Pay 50% advance → Approve preview → Delivered
- **Live price calculator**: medium, size, number of people/pets, background (simple/detailed), frame, rush delivery
- Request form: photo (previewed locally only), name, phone, email, occasion, deadline, notes. Submitting shows a mock success message
- Gallery of sample custom work; FAQ

### Offers
- Cards for each active coupon (with a copy-code button) and banners for festive collections

### About
- Artist story and photo (placeholder), studio photos, values, milestones, and buttons linking to Shop and Custom Art

### Search (overlay)
- Instant results as you type, filtered in the browser by title, category and medium; shows trending search suggestions

### Wishlist
- A grid of saved items with "Move to cart" and "Remove" buttons

### Cart (drawer + page)
- Items with their size and add-ons; quantity controls
- Coupon input; free-shipping progress bar
- Summary: subtotal, discount, shipping, COD fee, total

### Checkout (mock)
- Address form (India only, with a 6-digit pincode check)
- Payment choice: Online (Razorpay — mock) or COD
- "Place order" creates a fake order ID and goes to `/order-success`, then empties the cart

### Other pages
- Contact (form + WhatsApp link)
- FAQ
- Policies: Shipping & Returns, Privacy, Terms, Refund
- 404 page

---

## 6. Pricing (reduced)

**Price = base (medium × size) × category adjustment + add-ons**

### Pencil sketch
| A5 | A4 | A3 | A2 | A1 |
|---|---|---|---|---|
| ₹699 | ₹999 | ₹1,699 | ₹2,799 | ₹4,499 |

### Digital painting (premium print)
| File only | A4 | A3 | A2 | A1 |
|---|---|---|---|---|
| ₹499 | ₹899 | ₹1,399 | ₹1,999 | ₹2,999 |

### Acrylic on canvas
| 12×12″ | 12×16″ | 18×24″ | 24×36″ | 36×48″ |
|---|---|---|---|---|
| ₹2,499 | ₹3,499 | ₹5,999 | ₹10,999 | ₹18,999 |

### Oil on canvas
| 12×12″ | 12×16″ | 18×24″ | 24×36″ | 36×48″ |
|---|---|---|---|---|
| ₹3,499 | ₹4,799 | ₹8,999 | ₹14,999 | ₹25,999 |

### Category adjustments
| Category | Adjustment |
|---|---|
| Spiritual, Pets, Nature, Traditional, Modern | Base price |
| Portraits | 1 person included; **+40%** for each extra person |
| Couple Art | 2 people included; **+25%** |
| Wildlife, Horses (detailed) | **+15%** |
| Abstract | **−10%** |
| Wall Art sets | 2 panels **×2.2**, 3 panels **×3** |
| Detailed background (custom) | **+20%** |

### Add-ons
| Add-on | Price |
|---|---|
| Frame | A4 ₹349 · A3 ₹549 · A2 ₹899 · A1 ₹1,399 · Canvas 24×36″+ ₹1,999 |
| Gift wrap | ₹99 |
| Express delivery | ₹299 |
| Rush custom order | +25% |
| Cash on Delivery fee | ₹49 |
| Shipping | Free above ₹1,999; otherwise ₹99 |

All prices are kept in `src/data/pricing.ts`, so changing them is a one-file edit.

---

## 7. Offers (mock coupons)

| Code / Offer | Rule |
|---|---|
| `WELCOME10` | 10% off first order (max ₹500 discount) |
| Free shipping | Orders above ₹1,999 |
| `BUY2` / `BUY3` | 10% off 2 items · 15% off 3+ items |
| Prepaid bonus | Extra 5% off when paying online instead of COD |
| `FESTIVE25` | Up to 25% off Spiritual (Janmashtami, Ganesh Chaturthi, Shivratri, Diwali) |
| Free frame | On A2+ / 24×36″+ paintings |
| `LOVE15` | 15% off Couple Art & Portraits |
| Custom portrait | Free digital preview + 2 free revisions (shown as info) |

Rule: only one coupon at a time. The prepaid bonus and free shipping can be combined with a coupon.

---

## 8. Mock data

- **Categories**: the 6 groups and 22 sub-categories from §5
- **Products**: about 30–40 sample paintings spread across all categories and mediums. Each product has:

```ts
type Product = {
  id: string; slug: string; title: string; description: string;
  group: CategoryGroup; subCategory: string;
  medium: 'pencil' | 'oil' | 'acrylic' | 'digital';
  style: 'abstract' | 'modern' | 'traditional' | 'wall-art';
  type: 'original' | 'made-to-order' | 'print';
  orientation: 'portrait' | 'landscape' | 'square';
  sizes: string[];          // valid sizes for its medium
  images: string[];         // placeholder URLs
  rooms: string[];          // living, pooja, bedroom, office
  isBestseller?: boolean; isNew?: boolean; rating: number; reviewCount: number;
};
```

- The price is calculated by `lib/price.ts` from the pricing tables; product records don't store a price
- Offers, testimonials and FAQs are also kept as static arrays

---

## 9. Design guidelines (minimal gallery)

- **Colors**:
  - Off-white background `#FAF8F5`
  - Charcoal text `#1F1F1F`
  - Muted gold accent `#B08D57`
  - Light borders `#E8E4DE`
- **Typography**: serif headings, clean sans-serif body text, generous line height
- **Layout**: lots of white space, thin borders, square image crops, very few shadows, subtle hover zoom on images
- **Mobile first**: product grid of 2 columns on mobile, 3 on tablet, 4 on desktop; filters and cart open as slide-out drawers
- **Accessibility**: alt text on images, keyboard-friendly menus, good color contrast

---

## 10. Build steps (Phase 1)

1. Set up Next.js + Tailwind + fonts + color theme
2. Write the types, mock data, pricing and price calculator
3. Build the layout: announcement bar, header with mega-menu, mobile menu, search overlay, footer
4. Build shared components: product card, product grid, filters
5. Build pages: Home → Shop → Product Detail → Categories
6. Add cart and wishlist contexts, cart drawer, coupons, free-shipping bar
7. Build Cart page → mock Checkout → Order Success
8. Build Custom Art: calculator + mock form
9. Build Offers, About, Contact, FAQ, Policies, 404
10. Polish: responsive checks, empty states, check `npm run build` passes

---

## 11. Later phases (not now)

- **Phase 2 — Backend**: database (e.g. Supabase/Postgres) for products, orders and custom requests; image storage
- **Phase 3 — Accounts & payments**: login, saved addresses, order history; Razorpay + COD; email notifications
- **Phase 4 — Admin dashboard**: manage products, prices, offers, orders and custom requests
- **Phase 5 — Growth**: reviews, SEO (sitemap, structured data), analytics, blog, final logo and branding

---

## 12. Open questions

- Artist setup: single artist assumed — confirm or switch to multiple artists
- Final brand name and logo
- Real painting photos, and the artist bio for the About page
- Contact details: WhatsApp number, email, studio city
