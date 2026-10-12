-- Online payment (Razorpay) only: no Cash on Delivery and no "prepaid" 5% discount.
delete from public.announcements where message = 'Extra 5% off on prepaid orders';
delete from public.offers where title = 'Extra 5% off on prepaid';
update public.faqs
set answer = 'UPI, debit/credit cards, net banking and wallets, all processed securely by Razorpay. We do not offer Cash on Delivery.'
where question = 'Which payment methods do you accept?';
