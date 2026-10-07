-- Take the two sunglasses portraits off the Gallery (kept, can be switched back on in Admin → Gallery).
update public.gallery_items set is_active = false where title in ('Portrait in Sunglasses', 'Portrait in Shades');
