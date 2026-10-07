-- Gallery pieces can belong to a sub-category, so sold work also shows (as Sold) on its category page.
alter table public.gallery_items
  add column sub_category text references public.subcategories (slug) on update cascade on delete set null;
create index gallery_items_sub_category_idx on public.gallery_items (sub_category);

update public.gallery_items as g set sub_category = v.sub
from (values
  ('The Stag', 'wildlife'),
  ('Two White Spitz', 'dogs'),
  ('Woman by the River', 'people'),
  ('Lake at Sunset', 'scenery'),
  ('Waves at Sunset', 'scenery'),
  ('Little Krishna', 'radha-krishna'),
  ('Woman in a Headscarf', 'pencil-portraits'),
  ('Curious Little One', 'pencil-portraits'),
  ('A Bright Smile', 'pencil-portraits'),
  ('Girl in a Hat', 'pencil-portraits'),
  ('Portrait of a Gentleman', 'pencil-portraits'),
  ('Portrait in Sunglasses', 'portraits'),
  ('Portrait in Shades', 'pencil-portraits')
) as v(title, sub)
where g.title = v.title;
