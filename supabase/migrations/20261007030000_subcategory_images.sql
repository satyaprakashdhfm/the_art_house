-- Replace stock placeholder pictures on sub-categories: real Verona Arts paintings where one fits,
-- otherwise an original illustration made for the site (public/images/categories/).
update public.subcategories as s set image = v.image
from (values
  ('horses',           '/images/products/horses-in-the-shade.jpg'),
  ('dogs',             '/images/gallery/two-white-spitz.jpg'),
  ('wildlife',         '/images/products/tigers-in-combat.jpg'),
  ('flowers',          '/images/products/madhubani-lotus.jpg'),
  ('bouquets',         '/images/products/pink-blooms-in-a-silver-vase.jpg'),
  ('landscapes',       '/images/products/waterfall-in-the-valley.jpg'),
  ('scenery',          '/images/products/sailing-home-at-sunset.jpg'),
  ('portraits',        '/images/gallery/a-bright-smile.jpg'),
  ('pencil-portraits', '/images/gallery/woman-in-a-headscarf.jpg'),
  ('people',           '/images/gallery/woman-by-the-river.jpg'),
  ('radha-krishna',    '/images/gallery/little-krishna.jpg'),
  ('ganesha',          '/images/products/madhubani-ganesha.jpg'),
  ('buddha',           '/images/categories/buddha.jpg'),
  ('shiva',            '/images/categories/shiva.jpg'),
  ('other-gods',       '/images/categories/other-gods.jpg'),
  ('cats',             '/images/categories/cats.jpg'),
  ('couple-art',       '/images/categories/couple-art.jpg'),
  ('modern',           '/images/categories/modern.jpg'),
  ('traditional',      '/images/categories/traditional.jpg')
) as v(slug, image)
where s.slug = v.slug;

update public.category_groups set image = '/images/categories/madhubani.jpg' where slug = 'art-style';
update public.category_groups set image = '/images/mediums/oil.jpg' where slug = 'medium';
