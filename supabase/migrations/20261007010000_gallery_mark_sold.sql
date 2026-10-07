-- Show the Sold label on every piece in the Gallery.
update public.gallery_items set is_sold = true where is_active;
