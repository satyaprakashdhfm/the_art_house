-- First two real paintings in the Madhubani collection. Sizes are the nearest standard canvas sizes
-- to each painting's proportions; confirm or change them in Admin → Products.
insert into public.products
  (slug, title, description, group_slug, sub_category, medium, style, type, orientation,
   sizes, images, rooms, subjects, panels, is_bestseller, is_new, rating, review_count, is_published, sort_order)
values
  ('ganesha-with-modak', 'Ganesha with Modak',
   'A joyful Ganesha in shades of green, holding a modak in one hand and raising the other in blessing. A gold and red crown, swirling vines in gold, purple and red, and a burst of orange light fill the background. Hand-painted in acrylic on canvas board — a bright, auspicious piece for a pooja room, entrance or living room.',
   'spiritual', 'ganesha', 'acrylic', 'madhubani', 'original', 'portrait',
   '{12x16}', '{/images/products/madhubani-ganesha.jpg}', '{pooja,living}', 1, 1, false, true, 0, 0, true,
   (select coalesce(max(sort_order), -1) + 1 from public.products)),
  ('lotus-garden', 'Lotus Garden',
   'Red lotuses and buds drift across an ivory ground, linked by fine golden vines and green leaves, inside a hand-painted cobalt border of smaller lotus motifs. Every outline is traced by hand in gold. The lotus, a symbol of purity and new beginnings, makes this a calm, elegant piece for a living room, bedroom or pooja space.',
   'nature', 'flowers', 'acrylic', 'madhubani', 'original', 'landscape',
   '{18x24}', '{/images/products/madhubani-lotus.jpg}', '{living,bedroom,pooja}', 1, 1, false, true, 0, 0, true,
   (select coalesce(max(sort_order), -1) + 2 from public.products))
on conflict (slug) do nothing;
