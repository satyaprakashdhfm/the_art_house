-- Take these offers off the Offers page. Switched off (not deleted) so they can be re-enabled from /admin/offers.
update public.coupons set is_active = false where code in ('BUY3', 'FESTIVE25', 'LOVE15');
update public.offers set is_active = false where title = 'Extra 5% off on prepaid';

-- The festive homepage slide advertised FESTIVE25, which no longer works.
update public.hero_slides
set text = 'Radha Krishna, Ganesha, Shiva and more — hand-painted for your home and pooja room.'
where text = 'Radha Krishna, Ganesha, Shiva and more — 25% off with FESTIVE25.';
