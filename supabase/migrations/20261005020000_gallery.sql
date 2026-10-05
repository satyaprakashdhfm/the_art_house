-- Gallery: finished and sold works shown on /gallery. No prices; kept out of the shop.
create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  medium text not null check (medium in ('pencil', 'oil', 'acrylic', 'digital')),
  size_label text not null default '',
  year int check (year between 1900 and 2100),
  note text not null default '',
  image text not null,
  is_sold boolean not null default true,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Same access rules as the other storefront tables: everyone reads active items, only admins write.
alter table public.gallery_items enable row level security;
grant select on public.gallery_items to anon, authenticated;
grant insert, update, delete on public.gallery_items to authenticated;
create policy "Public can read gallery_items" on public.gallery_items for select to anon, authenticated
  using (is_active or (select private.is_admin()));
create policy "Admins can insert gallery_items" on public.gallery_items for insert to authenticated
  with check ((select private.is_admin()));
create policy "Admins can update gallery_items" on public.gallery_items for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins can delete gallery_items" on public.gallery_items for delete to authenticated
  using ((select private.is_admin()));

-- Four sample pieces to replace from /admin/gallery.
insert into public.gallery_items (title, medium, size_label, year, note, image, sort_order) values
  ('Lighthouse Cove', 'pencil', 'A3', 2025, 'Graphite on paper', '/images/mediums/pencil.jpg', 0),
  ('Peonies in a Blue Vase', 'oil', '18 × 24"', 2025, 'Oil on canvas', '/images/mediums/oil.jpg', 1),
  ('The Coastal Path', 'acrylic', '24 × 36"', 2025, 'Acrylic on canvas', '/images/mediums/acrylic.jpg', 2),
  ('Golden Daydream', 'digital', 'A2', 2025, 'Digital painting, printed on fine-art paper', '/images/mediums/digital.jpg', 3);
