-- Real artwork for the homepage "Shop by Category" tiles (files in public/images/categories/).
update public.category_groups set image = '/images/categories/spiritual.jpg' where slug = 'spiritual';
update public.category_groups set image = '/images/categories/portraits-people.jpg' where slug = 'portraits-people';
update public.category_groups set image = '/images/categories/animals.jpg' where slug = 'animals';
update public.category_groups set image = '/images/categories/nature.jpg' where slug = 'nature';
update public.subcategories set image = '/images/categories/abstract.jpg' where slug = 'abstract';
update public.subcategories set image = '/images/categories/wall-art.jpg' where slug = 'wall-art';
