-- Orders placed at /checkout. Rows are written only by the server (Supabase secret key, which
-- bypasses RLS) after it has re-priced the cart and created the Razorpay order; it is marked paid
-- only once Razorpay's signature is verified. Admins can read them; nobody can write them through the Data API.

create table public.orders (
  id text primary key,
  -- pending_payment: Razorpay order created, payment not confirmed yet (may be abandoned)
  -- paid:            payment signature or webhook verified
  status text not null check (status in ('pending_payment', 'paid')),

  name text not null,
  phone text not null,
  email text not null,
  address text not null,
  city text not null,
  state text not null,
  pincode text not null,

  -- Snapshot of what was bought, priced on the server: [{ productId, title, size, sizeLabel, addons, qty, unitPrice, addonsPrice, lineTotal }]
  lines jsonb not null,
  coupon text,
  -- Amounts in whole rupees.
  subtotal int not null,
  coupon_discount int not null default 0,
  shipping int not null default 0,
  total int not null check (total > 0),

  razorpay_order_id text not null unique,
  razorpay_payment_id text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);
create index orders_created_at_idx on public.orders (created_at desc);

alter table public.orders enable row level security;
-- Supabase's default privileges grant everything to the API roles; orders only need admin reads.
revoke all on public.orders from anon, authenticated;
grant select on public.orders to authenticated;
create policy "Admins can view orders" on public.orders for select to authenticated using ((select private.is_admin()));
