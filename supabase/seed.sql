insert into public.admins (email) values ('satyaprakashreddy6789@gmail.com'), ('greeshmasappidi33@gmail.com');

insert into public.category_groups (slug,name,tagline,image,sort_order) values
('spiritual','Spiritual','Divine art for your home and pooja room','https://picsum.photos/seed/group-spiritual/1200/800',0),
('portraits-people','Portraits & People','Faces, moments and the people you love','https://picsum.photos/seed/group-portraits/1200/800',1),
('animals','Animals','From loyal companions to the wild','https://picsum.photos/seed/group-animals/1200/800',2),
('nature','Nature','Blooms, horizons and quiet places','https://picsum.photos/seed/group-nature/1200/800',3),
('art-style','Art Style','Find the look that fits your space','https://picsum.photos/seed/group-style/1200/800',4),
('medium','Medium','Graphite, oils, acrylics and pixels','https://picsum.photos/seed/group-medium/1200/800',5);

insert into public.subcategories (slug,group_slug,name,image,sort_order) select s,g,n,'https://picsum.photos/seed/sub-'||s||'/600/600',o from (values
('radha-krishna','spiritual','Radha Krishna',0),
('buddha','spiritual','Buddha',1),
('ganesha','spiritual','Ganesha',2),
('shiva','spiritual','Shiva',3),
('other-gods','spiritual','Other Gods',4),
('portraits','portraits-people','Portraits',0),
('pencil-portraits','portraits-people','Pencil Portraits',1),
('people','portraits-people','People',2),
('couple-art','portraits-people','Couple Art',3),
('horses','animals','Horses',0),
('dogs','animals','Dogs',1),
('cats','animals','Cats',2),
('wildlife','animals','Wildlife',3),
('flowers','nature','Flowers',0),
('bouquets','nature','Bouquets',1),
('landscapes','nature','Landscapes',2),
('scenery','nature','Scenery',3),
('abstract','art-style','Abstract',0),
('modern','art-style','Modern',1),
('traditional','art-style','Traditional',2),
('wall-art','art-style','Wall Art',3),
('pencil','medium','Pencil',0),
('oil','medium','Oil',1),
('acrylic','medium','Acrylic',2),
('digital','medium','Digital',3)) v(s,g,n,o);

with v(id,title,grp,sub,medium,style,type,orientation,fixed_size,rooms,subjects,panels,best,isnew,rating,reviews,ord) as (values
('p001','Radha Krishna in Vrindavan','spiritual','radha-krishna','oil','traditional','made-to-order','portrait',null,'{pooja,living}',1,1,true,false,4.3,8,0),
('p002','Flute of Krishna','spiritual','radha-krishna','acrylic','modern','original','portrait','18x24','{living}',1,1,false,true,4.3,21,1),
('p003','Radha Krishna Line Sketch','spiritual','radha-krishna','pencil','traditional','made-to-order','portrait',null,'{pooja,bedroom}',1,1,false,false,4.3,34,2),
('p004','Serene Buddha','spiritual','buddha','acrylic','modern','made-to-order','square',null,'{living,office}',1,1,true,false,4.3,47,3),
('p005','Golden Buddha Meditation','spiritual','buddha','oil','traditional','original','portrait','24x36','{living}',1,1,false,false,4.3,60,4),
('p006','Buddha Abstract Triptych','spiritual','buddha','acrylic','wall-art','made-to-order','landscape',null,'{living}',1,3,false,false,4.3,73,5),
('p007','Vighnaharta Ganesha','spiritual','ganesha','oil','traditional','made-to-order','portrait',null,'{pooja,living}',1,1,true,false,4.3,86,6),
('p008','Ganesha in Colour','spiritual','ganesha','digital','modern','print','square',null,'{office,living}',1,1,false,true,4.3,9,7),
('p009','Mahadev in Meditation','spiritual','shiva','acrylic','traditional','made-to-order','portrait',null,'{pooja,living}',1,1,false,false,4.3,22,8),
('p010','Shiva Tandava','spiritual','shiva','digital','modern','print','portrait',null,'{living,office}',1,1,false,false,4.3,35,9),
('p011','Lakshmi Blessings','spiritual','other-gods','oil','traditional','made-to-order','portrait',null,'{pooja}',1,1,false,false,4.3,48,10),
('p012','Hanuman Devotion','spiritual','other-gods','pencil','traditional','made-to-order','portrait',null,'{pooja,bedroom}',1,1,false,false,4.3,61,11),
('p013','Classic Oil Portrait','portraits-people','portraits','oil','traditional','made-to-order','portrait',null,'{living,bedroom}',1,1,true,false,4.3,74,12),
('p014','Family Portrait (3 People)','portraits-people','portraits','acrylic','modern','made-to-order','landscape',null,'{living}',3,1,false,false,4.3,87,13),
('p015','Graphite Pencil Portrait','portraits-people','pencil-portraits','pencil','traditional','made-to-order','portrait',null,'{bedroom,office}',1,1,true,false,4.3,10,14),
('p016','Grandparents Pencil Sketch','portraits-people','pencil-portraits','pencil','traditional','made-to-order','landscape',null,'{living}',2,1,false,false,4.3,23,15),
('p017','Village Woman at Dusk','portraits-people','people','oil','traditional','original','portrait','18x24','{living}',1,1,false,false,4.3,36,16),
('p018','Street Musicians','portraits-people','people','digital','modern','print','landscape',null,'{office,living}',1,1,false,true,4.3,49,17),
('p019','Couple Under the Stars','portraits-people','couple-art','acrylic','modern','made-to-order','portrait',null,'{bedroom}',1,1,true,false,4.3,62,18),
('p020','Wedding Day Sketch','portraits-people','couple-art','pencil','traditional','made-to-order','portrait',null,'{bedroom,living}',1,1,false,false,4.3,75,19),
('p021','Seven Running Horses','animals','horses','oil','traditional','made-to-order','landscape',null,'{living,office}',1,1,true,false,4.3,88,20),
('p022','White Stallion','animals','horses','acrylic','modern','original','portrait','24x36','{office}',1,1,false,false,4.3,11,21),
('p023','Golden Retriever Portrait','animals','dogs','oil','traditional','made-to-order','square',null,'{living,bedroom}',1,1,false,false,4.3,24,22),
('p024','Playful Pup Sketch','animals','dogs','pencil','traditional','made-to-order','square',null,'{bedroom}',1,1,false,true,4.3,37,23),
('p025','Curious Cat','animals','cats','digital','modern','print','portrait',null,'{bedroom,office}',1,1,false,false,4.3,50,24),
('p026','Royal Bengal Tiger','animals','wildlife','acrylic','traditional','made-to-order','landscape',null,'{living,office}',1,1,false,false,4.3,63,25),
('p027','Elephant Family','animals','wildlife','pencil','traditional','made-to-order','landscape',null,'{living}',1,1,false,false,4.3,76,26),
('p028','Lotus Pond','nature','flowers','oil','traditional','original','landscape','18x24','{living,pooja}',1,1,true,false,4.3,89,27),
('p029','Wild Poppies','nature','flowers','acrylic','abstract','made-to-order','square',null,'{bedroom,living}',1,1,false,false,4.3,12,28),
('p030','Spring Bouquet','nature','bouquets','oil','modern','made-to-order','portrait',null,'{bedroom,living}',1,1,false,true,4.3,25,29),
('p031','Roses in a Vase','nature','bouquets','digital','traditional','print','portrait',null,'{bedroom}',1,1,false,false,4.3,38,30),
('p032','Himalayan Morning','nature','landscapes','oil','traditional','made-to-order','landscape',null,'{living,office}',1,1,false,false,4.3,51,31),
('p033','Kerala Backwaters','nature','landscapes','acrylic','modern','made-to-order','landscape',null,'{living}',1,1,false,false,4.3,64,32),
('p034','Golden Hour Fields','nature','scenery','acrylic','abstract','original','landscape','24x36','{office,living}',1,1,false,true,4.3,77,33),
('p035','Monsoon Scenery Diptych','nature','scenery','digital','wall-art','print','landscape',null,'{living,office}',1,2,false,false,4.3,90,34),
('p036','Misty Forest Path','nature','scenery','pencil','traditional','made-to-order','portrait',null,'{bedroom,office}',1,1,false,false,4.3,13,35)),
s as (select v.*, trim(both '-' from regexp_replace(lower(title),'[^a-z0-9]+','-','g')) as slug,
  case orientation when 'landscape' then '1000/750' when 'square' then '900/900' else '800/1000' end as dims from v)
insert into public.products (id,slug,title,description,group_slug,sub_category,medium,style,type,orientation,sizes,images,rooms,subjects,panels,is_bestseller,is_new,rating,review_count,sort_order)
select s.id, s.slug, s.title,
  '“'||s.title||'” is a '||s.medium||' artwork from our '||sc.name||' collection — '||
  case s.type when 'original' then 'a one-of-a-kind original, ready to ship' when 'print' then 'a digital artwork, available as a high-resolution file or a premium archival print' else 'hand-painted to order in our studio' end||
  '. Every piece is finished with care, signed by the artist and shipped with a Certificate of Authenticity.',
  s.grp, s.sub, s.medium, s.style, s.type, s.orientation,
  case when s.fixed_size is not null then array[s.fixed_size]
       when s.medium='pencil' then array['A5','A4','A3','A2','A1'] when s.medium='digital' then array['FILE','A4','A3','A2','A1']
       else array['12x12','12x16','18x24','24x36','36x48'] end,
  array(select 'https://picsum.photos/seed/'||s.slug||'-'||n||'/'||s.dims from generate_series(1,3) n),
  s.rooms::text[], s.subjects, s.panels, s.best, s.isnew, s.rating, s.reviews, s.ord
from s join public.subcategories sc on sc.slug = s.sub;

insert into public.hero_slides (eyebrow,title,text,cta_label,cta_href,image,tone,sort_order) values
('Art for meaningful spaces','Transform Your Space','Discover original paintings and curated collections that bring warmth, emotion and character into your home.','Explore Collection','/shop','/images/hero_transform.png','light',0),
('Festive Collection','Divine art for every celebration','Radha Krishna, Ganesha, Shiva and more — 25% off with FESTIVE25.','Shop Spiritual Art','/categories#spiritual','/images/hero_divine.png','dark',1);

insert into public.announcements (message,sort_order) values
('Free shipping on orders above ₹1,999',0),
('Use code WELCOME10 for 10% off your first order',1),
('Extra 5% off on prepaid orders',2),
('Custom portraits — free digital preview before we paint',3);

insert into public.coupons (code,title,description,terms,percent,max_discount,min_items,group_slugs,sub_slugs,sort_order) values
('WELCOME10','10% off your first order','New here? Take 10% off anything in the store.','Max discount ₹500. One use per customer.',10,500,0,'{}','{}',0),
('BUY2','Buy 2, save 10%','Pick any two artworks and save 10% on the lot.','Cart must contain 2 or more items.',10,null,2,'{}','{}',1),
('BUY3','Buy 3+, save 15%','Building a gallery wall? Save 15% on 3 or more pieces.','Cart must contain 3 or more items.',15,null,3,'{}','{}',2),
('FESTIVE25','Festive 25% off Spiritual art','Celebrate Janmashtami, Ganesh Chaturthi, Shivratri and Diwali.','Applies to Spiritual category items only.',25,null,0,'{spiritual}','{}',3),
('LOVE15','15% off Couple Art & Portraits','For anniversaries, Valentine''s, Mother''s and Father''s Day.','Applies to Portraits, Pencil Portraits and Couple Art.',15,null,0,'{}','{portraits,pencil-portraits,couple-art}',4);

insert into public.offers (title,text,sort_order) values
('Free shipping','On all orders above ₹1,999.',0),
('Extra 5% off on prepaid','Pay online with UPI, card or net banking and save 5% more.',1),
('Free frame','On every A2, A1, 24×36" and 36×48" artwork.',2),
('Custom portrait promise','Free digital preview and 2 free revisions on every custom order.',3);

insert into public.testimonials (name,city,rating,text,date_label,show_on_home,sort_order) values
('Ananya R.','Bengaluru',5,'Even more beautiful in person. The colours are rich and the packaging was excellent.','Aug 2026',true,0),
('Rahul M.','Pune',5,'Ordered as an anniversary gift — my wife loved it. Delivered before the promised date.','Jul 2026',true,1),
('Priya S.','Hyderabad',4,'Lovely detailing. The frame is sturdy and looks premium. Would buy again.','Jun 2026',true,2),
('Vikram K.','Delhi',5,'Exactly like the photos. The artist even shared progress pictures on WhatsApp.','Jun 2026',true,3),
('Meera J.','Chennai',5,'It has become the centrepiece of our living room. Thank you!','May 2026',false,4),
('Sandeep T.','Kolkata',4,'Great quality canvas and very well packed. Took a few extra days but worth it.','Apr 2026',false,5);

insert into public.faqs (section,question,answer,sort_order) values
('general','Are the paintings hand-made?','Yes. Pencil, oil and acrylic artworks are created entirely by hand. Digital paintings are drawn digitally by the artist and printed on archival fine-art paper.',0),
('general','What is the difference between Original, Made-to-order and Print?','Originals are one-of-a-kind finished pieces, ready to ship. Made-to-order paintings are painted fresh in the size you choose. Prints are high-quality reproductions of digital artworks.',1),
('general','How long does delivery take?','Ready originals and prints ship in 5–7 days. Made-to-order paintings take 12–18 days. Express delivery is available at checkout.',2),
('general','Do you ship outside India?','Not yet — we currently deliver across India only.',3),
('general','Is shipping free?','Shipping is free on orders above ₹1,999. Below that, a flat ₹99 applies.',4),
('general','Which payment methods do you accept?','UPI, debit/credit cards, net banking and wallets via Razorpay, plus Cash on Delivery (₹49 fee). Prepaid orders get an extra 5% off.',5),
('general','Can I return a painting?','If your artwork arrives damaged, tell us within 7 days with an unboxing photo and we will replace or refund it. Custom orders cannot be returned for change of mind.',6),
('general','Do paintings come framed?','Frames are an optional add-on. Every A2, A1, 24×36" and 36×48" artwork gets a free frame.',7),
('custom','What kind of photo should I upload?','A clear, well-lit photo where faces are sharp and not too small. Multiple photos are fine — we can combine people from different pictures.',0),
('custom','How many revisions do I get?','We send a free digital preview before painting, and include 2 free revisions.',1),
('custom','How much do I pay upfront?','A 50% advance to start, and the balance before dispatch.',2),
('custom','How long does a custom painting take?','Usually 12–18 days depending on size and medium. A rush option (7–10 days) is available for +25%.',3);
