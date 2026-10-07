-- Hide the sample products from the mock phase (stock photos). Real paintings use photos in
-- /images/products/. Hidden products stay saved and can be switched back on in Admin → Products.
update public.products set is_published = false where images[1] not like '/images/products/%';
