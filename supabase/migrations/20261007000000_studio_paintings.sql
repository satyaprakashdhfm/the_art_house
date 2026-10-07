-- Real Verona Arts work from the studio photo shoot (7 Oct 2026).
-- Products: the seven pieces to be sold. Sizes are provisional until the exact measurements arrive.
-- The watercolour elephant is listed under acrylic for now: the site has no watercolour medium yet.
with next_order as (select coalesce(max(sort_order), -1) as n from public.products)
insert into public.products
  (slug, title, description, group_slug, sub_category, medium, style, type, orientation,
   sizes, images, rooms, subjects, panels, is_bestseller, is_new, rating, review_count, is_published, sort_order)
select v.slug, v.title, v.description, v.grp, v.sub, v.medium, v.style, 'original', v.orientation,
       v.sizes, array['/images/products/' || v.slug || '.jpg'], v.rooms, 1, 1, false, true, 0, 0, true, next_order.n + v.ord
from next_order, (values
  ('golden-savanna-sunset', 'Golden Savanna Sunset',
   'A lone acacia tree and a giraffe stand in silhouette against a blazing African sky, where gold and orange clouds give way to a patch of soft blue. Painted in oil on canvas with loose, energetic brushwork, it brings warmth and quiet drama to a living room or study.',
   'animals', 'wildlife', 'oil', 'modern', 'landscape', '{18x24}'::text[], '{living,office}'::text[], 1),
  ('pink-blooms-in-a-silver-vase', 'Pink Blooms in a Silver Vase',
   'Full, ruffled pink blooms and deep green leaves rise from a silver vase, with a few fallen flowers resting on the table below. Rich oil colour on canvas gives the petals real depth — a cheerful still life for a dining area, entrance or bedroom.',
   'nature', 'bouquets', 'oil', 'traditional', 'portrait', '{12x16}'::text[], '{living,bedroom}'::text[], 2),
  ('waterfall-in-the-valley', 'Waterfall in the Valley',
   'A waterfall tumbles from rocky cliffs into a clear blue river, framed by tall pines, distant mountains and a winding path through a meadow of wildflowers. Painted in oil on canvas in fine detail, it is a calming landscape for a living room or office; flowing water is also considered auspicious in vastu.',
   'nature', 'landscapes', 'oil', 'traditional', 'landscape', '{24x36}'::text[], '{living,office}'::text[], 3),
  ('horses-in-the-shade', 'Horses in the Shade',
   'A herd of horses — chestnut, bay and one bright white mare with her foal — gathers beneath shady trees on a quiet afternoon. A classic oil on canvas, full of movement and gentle light. Horses are a traditional symbol of strength and progress, making it a fine choice for a living room or workplace.',
   'animals', 'horses', 'oil', 'traditional', 'landscape', '{18x24}'::text[], '{living,office}'::text[], 4),
  ('sailing-home-at-sunset', 'Sailing Home at Sunset',
   'A tall ship in full sail cuts through rolling turquoise waves as the sun sets in a glow of gold and peach behind it. Painted in oil on canvas, it captures the sense of a voyage and fair winds — an inspiring piece for a study, office or living room.',
   'nature', 'scenery', 'oil', 'traditional', 'landscape', '{18x24}'::text[], '{office,living}'::text[], 5),
  ('tigers-in-combat', 'Tigers in Combat',
   'Two tigers clash in a moment of raw power, every stripe, whisker and muscle drawn by hand in graphite pencil. Fine shading brings out the fur and the tension of the fight. A striking monochrome piece for a study, office or a wildlife lover''s wall.',
   'animals', 'wildlife', 'pencil', 'traditional', 'landscape', '{A3}'::text[], '{office,living}'::text[], 6),
  ('elephant-at-play', 'Elephant at Play',
   'A playful elephant splashes water from its trunk in a sunlit river lined with palms. Painted in watercolour on paper, with soft washes for the sky and water and crisp detail on the elephant. A happy, lively piece for a living room or a child''s room.',
   'animals', 'wildlife', 'acrylic', 'traditional', 'landscape', '{12x16}'::text[], '{living,bedroom}'::text[], 7)
) as v(slug, title, description, grp, sub, medium, style, orientation, sizes, rooms, ord)
on conflict (slug) do nothing;

-- Gallery: the rest of the studio's work, shown without prices.
update public.gallery_items set is_active = false
where title in ('Lighthouse Cove', 'Peonies in a Blue Vase', 'The Coastal Path', 'Golden Daydream');

insert into public.gallery_items (title, medium, size_label, year, note, image, is_sold, is_active, sort_order)
select v.title, v.medium, '', null, v.note, '/images/gallery/' || v.file || '.jpg', false, true, v.ord
from (values
  ('The Stag', 'oil', 'Oil on canvas — a red deer in the highlands', 'the-stag', 0),
  ('Woman by the River', 'oil', 'Oil on canvas — a classical Indian scene', 'woman-by-the-river', 1),
  ('Two White Spitz', 'oil', 'Oil on canvas — a pet portrait', 'two-white-spitz', 2),
  ('Portrait in Sunglasses', 'oil', 'Oil on canvas — a portrait', 'portrait-in-sunglasses-oil', 3),
  ('Lake at Sunset', 'acrylic', 'Watercolour on paper', 'lake-at-sunset', 4),
  ('Waves at Sunset', 'acrylic', 'Watercolour on paper', 'waves-at-sunset', 5),
  ('Little Krishna', 'pencil', 'Graphite pencil on paper', 'little-krishna', 6),
  ('Woman in a Headscarf', 'pencil', 'Graphite pencil on paper — a portrait', 'woman-in-a-headscarf', 7),
  ('Curious Little One', 'pencil', 'Graphite pencil on paper — a child portrait', 'curious-little-one', 8),
  ('A Bright Smile', 'pencil', 'Graphite pencil on paper — a portrait', 'a-bright-smile', 9),
  ('Girl in a Hat', 'pencil', 'Graphite pencil on paper — a portrait', 'girl-in-a-hat', 10),
  ('Portrait of a Gentleman', 'pencil', 'Graphite pencil on paper — a portrait', 'portrait-of-a-gentleman', 11),
  ('Portrait in Shades', 'pencil', 'Graphite pencil on paper — a portrait', 'portrait-in-shades-pencil', 12)
) as v(title, medium, note, file, ord)
where not exists (select 1 from public.gallery_items g where g.title = v.title);
