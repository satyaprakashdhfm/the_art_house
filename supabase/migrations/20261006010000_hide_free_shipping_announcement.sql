-- Take "Free shipping on orders above ₹1,999" off the announcement bar (kept, can be switched back on in the admin).
update public.announcements set is_active = false where message = 'Free shipping on orders above ₹1,999';
