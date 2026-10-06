-- New art style: Madhubani (Mithila folk painting). Shown under Categories → Art Style and as a Style filter.
alter table public.products drop constraint products_style_check;
alter table public.products add constraint products_style_check
  check (style in ('abstract', 'modern', 'traditional', 'wall-art', 'madhubani'));

insert into public.subcategories (slug, group_slug, name, image, sort_order)
values ('madhubani', 'art-style', 'Madhubani', '/images/categories/madhubani.jpg', 4)
on conflict (slug) do nothing;
