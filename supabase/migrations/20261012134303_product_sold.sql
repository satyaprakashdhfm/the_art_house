-- A one-of-a-kind original is marked sold as soon as its order is paid. Sold products stay listed
-- (badged "Sold") but can't be bought; an admin can switch it back in Admin → Products.
alter table public.products add column is_sold boolean not null default false;
