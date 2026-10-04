-- Verona Arts: storefront content managed from /admin.
-- Everyone can read published content; only admins (see public.admins) can write.

-- ─── Admins ────────────────────────────────────────────────────────────────
create schema if not exists private;
grant usage on schema private to anon, authenticated;

create table public.admins (
  email text primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);

-- True when the caller signed in with Google using an email listed in public.admins.
-- SECURITY DEFINER so it can read public.admins regardless of that table's RLS; it lives
-- in the unexposed `private` schema so it is not callable through the Data API.
create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    coalesce((auth.jwt() -> 'app_metadata' -> 'providers') ? 'google', false)
    and exists (
      select 1 from public.admins a
      where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
    );
$$;
revoke execute on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

-- ─── Catalogue ─────────────────────────────────────────────────────────────
create table public.category_groups (
  slug text primary key,
  name text not null,
  tagline text not null default '',
  image text not null default '',
  sort_order int not null default 0
);

create table public.subcategories (
  slug text primary key,
  group_slug text not null references public.category_groups (slug) on update cascade on delete cascade,
  name text not null,
  image text not null default '',
  sort_order int not null default 0
);
create index subcategories_group_slug_idx on public.subcategories (group_slug);

create table public.products (
  id text primary key default gen_random_uuid()::text,
  slug text not null unique,
  title text not null,
  description text not null default '',
  group_slug text not null check (group_slug in ('spiritual', 'portraits-people', 'animals', 'nature')),
  -- No ON DELETE: a sub-category that still has products cannot be deleted.
  sub_category text not null references public.subcategories (slug) on update cascade,
  medium text not null check (medium in ('pencil', 'oil', 'acrylic', 'digital')),
  style text not null check (style in ('abstract', 'modern', 'traditional', 'wall-art')),
  type text not null check (type in ('original', 'made-to-order', 'print')),
  orientation text not null check (orientation in ('portrait', 'landscape', 'square')),
  sizes text[] not null default '{}',
  images text[] not null default '{}',
  rooms text[] not null default '{}',
  subjects int not null default 1 check (subjects >= 1),
  panels int not null default 1 check (panels in (1, 2, 3)),
  is_bestseller boolean not null default false,
  is_new boolean not null default false,
  rating numeric(2, 1) not null default 4.5 check (rating between 0 and 5),
  review_count int not null default 0 check (review_count >= 0),
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_sub_category_idx on public.products (sub_category);

-- ─── Homepage & marketing ──────────────────────────────────────────────────
create table public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  eyebrow text not null default '',
  title text not null,
  text text not null default '',
  cta_label text not null default 'Shop now',
  cta_href text not null default '/shop',
  image text not null,
  tone text not null default 'dark' check (tone in ('light', 'dark')),
  is_active boolean not null default true,
  sort_order int not null default 0
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  is_active boolean not null default true,
  sort_order int not null default 0
);

create table public.coupons (
  code text primary key check (code = upper(code) and code ~ '^[A-Z0-9]+$'),
  title text not null,
  description text not null default '',
  terms text not null default '',
  percent numeric(5, 2) not null check (percent > 0 and percent <= 100),
  max_discount int check (max_discount is null or max_discount > 0),
  min_items int not null default 0 check (min_items >= 0),
  -- Empty arrays mean "applies to every product".
  group_slugs text[] not null default '{}',
  sub_slugs text[] not null default '{}',
  is_active boolean not null default true,
  sort_order int not null default 0
);

create table public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  text text not null default '',
  is_active boolean not null default true,
  sort_order int not null default 0
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null default '',
  rating int not null default 5 check (rating between 1 and 5),
  text text not null,
  date_label text not null default '',
  show_on_home boolean not null default true,
  is_active boolean not null default true,
  sort_order int not null default 0
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  section text not null default 'general' check (section in ('general', 'custom')),
  question text not null,
  answer text not null,
  is_active boolean not null default true,
  sort_order int not null default 0
);

-- ─── Row level security ────────────────────────────────────────────────────
alter table public.admins enable row level security;
grant select, insert, delete on public.admins to authenticated;
create policy "Admins can view admins" on public.admins for select to authenticated using ((select private.is_admin()));
create policy "Admins can add admins" on public.admins for insert to authenticated with check ((select private.is_admin()));
create policy "Admins can remove admins" on public.admins for delete to authenticated using ((select private.is_admin()));

do $$
declare
  t text;
  visible text;
begin
  foreach t in array array['category_groups', 'subcategories', 'products', 'hero_slides', 'announcements', 'coupons', 'offers', 'testimonials', 'faqs']
  loop
    visible := case
      when t in ('category_groups', 'subcategories') then 'true'
      when t = 'products' then 'is_published or (select private.is_admin())'
      else 'is_active or (select private.is_admin())'
    end;

    execute format('alter table public.%I enable row level security', t);
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant insert, update, delete on public.%I to authenticated', t);
    execute format('create policy "Public can read %1$s" on public.%1$I for select to anon, authenticated using (%2$s)', t, visible);
    execute format('create policy "Admins can insert %1$s" on public.%1$I for insert to authenticated with check ((select private.is_admin()))', t);
    execute format('create policy "Admins can update %1$s" on public.%1$I for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()))', t);
    execute format('create policy "Admins can delete %1$s" on public.%1$I for delete to authenticated using ((select private.is_admin()))', t);
  end loop;
end
$$;

-- ─── Image storage ─────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760, array['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif'])
on conflict (id) do nothing;

-- Public bucket: files are readable by URL without a policy. Writes are admin-only;
-- SELECT is included so admins can list and replace (upsert) files.
create policy "Admins can read media" on storage.objects for select to authenticated
  using (bucket_id = 'media' and (select private.is_admin()));
create policy "Admins can upload media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (select private.is_admin()));
create policy "Admins can update media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and (select private.is_admin()))
  with check (bucket_id = 'media' and (select private.is_admin()));
create policy "Admins can delete media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select private.is_admin()));
