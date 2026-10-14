-- ============================================================
-- INSERT / UPDATE: HALDEN'S MOBILE BAR & HALDEN'S ICE CREAM
-- Container Items + 3 Sub-Products Each
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Halden's Mobile Bar (Container Item - Drinks Category)
INSERT INTO public.menu_items (id, name, category, identify, ingredients, description, price_per_pax, is_available)
VALUES (
  'f4facdb6-7fe0-4928-af31-494c4fa5ca7e',
  'Halden''s Mobile Bar',
  'Drinks',
  'mobile_bar',
  'per_5_pax',
  'A mobile bar service providing a dedicated bar setup with drinks for the entire event.',
  200,
  true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  identify = EXCLUDED.identify,
  ingredients = EXCLUDED.ingredients,
  description = EXCLUDED.description,
  price_per_pax = EXCLUDED.price_per_pax,
  is_available = EXCLUDED.is_available;

-- 3 Sub-Products for Halden's Mobile Bar
INSERT INTO public.menu_items (name, category, identify, ingredients, description, price_per_pax, is_available)
VALUES 
  ('Classic Cocktails Selection', 'Drinks', 'mobile_bar_option', 'per_5_pax', 'Selection of classic handcrafted cocktails including Mojitos, Margaritas, and Rum Drinks.', 0, true),
  ('Mocktail & Fresh Juices Bar', 'Drinks', 'mobile_bar_option', 'per_5_pax', 'Non-alcoholic refreshing mocktails and infused fruit sodas for all ages.', 0, true),
  ('Signature Shooters & Mixes', 'Drinks', 'mobile_bar_option', 'per_5_pax', 'Halden''s specialty shooter lineup and premium party spirit mixers.', 0, true)
ON CONFLICT DO NOTHING;


-- 2. Halden's Ice Cream (Container Item - Dessert Category)
INSERT INTO public.menu_items (id, name, category, identify, ingredients, description, price_per_pax, is_available)
VALUES (
  '175437f4-bfc7-4833-9a2d-d1cde19f8233',
  'Halden''s Ice Cream',
  'Dessert',
  'ice_cream',
  'per_5_pax',
  'Ice cream served as a refreshing dessert option for the entire event.',
  100,
  true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  identify = EXCLUDED.identify,
  ingredients = EXCLUDED.ingredients,
  description = EXCLUDED.description,
  price_per_pax = EXCLUDED.price_per_pax,
  is_available = EXCLUDED.is_available;

-- 3 Sub-Products for Halden's Ice Cream
INSERT INTO public.menu_items (name, category, identify, ingredients, description, price_per_pax, is_available)
VALUES 
  ('Creamy Vanilla Bean', 'Dessert', 'ice_cream_option', 'per_5_pax', 'Classic rich vanilla bean ice cream served with assorted sweet toppings.', 0, true),
  ('Rich Chocolate Fudge', 'Dessert', 'ice_cream_option', 'per_5_pax', 'Decadent dark chocolate fudge ice cream topped with chocolate shavings.', 0, true),
  ('Mango Graham Delight', 'Dessert', 'ice_cream_option', 'per_5_pax', 'Creamy mango ice cream layered with crushed graham crackers and caramel drizzle.', 0, true)
ON CONFLICT DO NOTHING;
