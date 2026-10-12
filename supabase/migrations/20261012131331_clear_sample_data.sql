-- Remove the starter sample data before launch:
--   the placeholder products (stock photos, hidden since 20261007020000_hide_sample_products),
--   the made-up testimonials from the seed, and the sample coupons already switched off.
delete from public.products where is_published = false and images[1] not like '/images/products/%';
delete from public.testimonials where name in ('Ananya R.', 'Rahul M.', 'Priya S.', 'Vikram K.', 'Meera J.', 'Sandeep T.');
delete from public.coupons where code in ('BUY3', 'FESTIVE25', 'LOVE15') and is_active = false;
