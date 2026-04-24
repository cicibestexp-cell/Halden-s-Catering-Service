// ===== GLOBAL EXPOSURE (Early) =====
window.openErrorModal = function(msg) {
  console.log('Opening Error Modal:', msg);
  const overlay = document.getElementById('error-overlay');
  const msgEl = document.getElementById('error-msg');
  if (overlay && msgEl) {
    msgEl.textContent = msg;
    overlay.classList.add('on');
    overlay.style.display = 'flex'; // Force display
  } else {
    console.error('Error modal elements not found!', { overlay, msgEl });
    alert(msg);
  }
};

window.closeErrorModal = function() {
  const overlay = document.getElementById('error-overlay');
  if (overlay) {
    overlay.classList.remove('on');
    overlay.style.display = 'none'; // Re-hide
  }
};

// ===== DATA =====
const CAT = [
  // FOOD
  { id: 'f1', name: 'Pork Belly Lechon', cat: 'food', image: 'https://images.unsplash.com/photo-1544333346-64e4fe1820af?auto=format&fit=crop&q=80&w=800', price: 2500, batchSize: 20, desc: 'Tender slow-cooked pork with crispy skin, serves 20 pax', rating: 4.8, reviews: 124, ingredients: ['Pork Belly', 'Lemongrass', 'Garlic', 'Star Anise', 'Salt', 'Black Pepper'] },
  { id: 'f2', name: 'Beef Caldereta', cat: 'food', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800', price: 3000, batchSize: 20, desc: 'Premium beef in rich tomato sauce, serves 20 pax', rating: 4.9, reviews: 89, ingredients: ['Beef Chunks', 'Tomato Sauce', 'Liver Spread', 'Bell Peppers', 'Potatoes', 'Carrots', 'Chili'] },
  { id: 'f3', name: 'Garlic Butter Chicken', cat: 'food', image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=800', price: 2200, batchSize: 20, desc: 'Roasted chicken in savory garlic butter, serves 20 pax', rating: 4.7, reviews: 56, ingredients: ['Whole Chicken', 'Unsalted Butter', 'Minced Garlic', 'Parsley', 'Lemon', 'Salt'] },
  { id: 'f4', name: 'Lumpia Shanghai', cat: 'food', image: 'https://images.unsplash.com/photo-1606331107770-576da738d013?auto=format&fit=crop&q=80&w=800', price: 1500, batchSize: 20, desc: 'Crispy spring rolls with sweet chili dip (50 pcs), serves 20 pax', rating: 4.6, reviews: 210, ingredients: ['Ground Pork', 'Carrots', 'Onions', 'Spring Roll Wrappers', 'Egg', 'Sesame Oil'] },
  { id: 'f5', name: 'Steamed Rice Station', cat: 'food', image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&q=80&w=800', price: 800, batchSize: 20, desc: 'Unlimited steamed rice with buffet serving station, serves 20 pax', rating: 4.5, reviews: 310, ingredients: ['Premium Jasmine Rice', 'Purified Water'] },
  { id: 'f6', name: 'Seafood Paella', cat: 'food', image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&q=80&w=800', price: 4500, batchSize: 20, desc: 'Spanish saffron rice with fresh seafood, serves 20 pax', rating: 4.9, reviews: 67, ingredients: ['Saffron Rice', 'Shrimp', 'Mussels', 'Squid', 'Green Peas', 'Bell Peppers', 'Lemon'] },
  { id: 'f7', name: 'Classic Chicken Adobo', cat: 'food', image: 'https://images.unsplash.com/photo-1541696490-8744a5db0223?auto=format&fit=crop&q=80&w=800', price: 1800, batchSize: 20, desc: 'Savory chicken braised in soy sauce, vinegar, and garlic', rating: 4.8, reviews: 156, ingredients: ['Chicken', 'Soy Sauce', 'Vinegar', 'Garlic', 'Bay Leaves', 'Peppercorns'] },
  { id: 'f8', name: 'Beef Kare-Kare', cat: 'food', image: 'https://images.unsplash.com/photo-1626509135521-e0066d40096d?auto=format&fit=crop&q=80&w=800', price: 3200, batchSize: 20, desc: 'Beef stew in rich peanut sauce with vegetables', rating: 4.9, reviews: 203, ingredients: ['Beef Chunks', 'Peanut Butter', 'Ground Peanuts', 'Eggplant', 'String Beans', 'Pechay', 'Bagoong Alamang'] },
  { id: 'f9', name: 'Pork Sinigang', cat: 'food', image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&q=80&w=800', price: 2400, batchSize: 20, desc: 'Filipino sour soup with pork and local vegetables', rating: 4.7, reviews: 112, ingredients: ['Pork Belly', 'Tamarind Base', 'Radish', 'Gabi', 'Kangkong', 'Long Green Chili', 'Tomatoes'] },
  { id: 'f10', name: 'Pancit Bihon Guisado', cat: 'food', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800', price: 1200, batchSize: 20, desc: 'Rice noodles stir-fried with meat and mixed vegetables', rating: 4.6, reviews: 289, ingredients: ['Rice Noodles', 'Chicken', 'Shrimp', 'Cabbage', 'Carrots', 'Beans', 'Soy Sauce'] },
  { id: 'f11', name: 'Filipino Style Spaghetti', cat: 'food', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800', price: 1500, batchSize: 20, desc: 'Sweet-style spaghetti with hotdogs and ground meat', rating: 4.5, reviews: 412, ingredients: ['Spaghetti Pasta', 'Sweet Tomato Sauce', 'Ground Beef', 'Sliced Hotdogs', 'Cheddar Cheese', 'Condensed Milk'] },
  { id: 'f12', name: 'Crispy Fried Chicken', cat: 'food', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=800', price: 2000, batchSize: 20, desc: 'Classic breaded crispy chicken (40 pieces)', rating: 4.8, reviews: 520, ingredients: ['Chicken Parts', 'Flour', 'Cornstarch', 'Garlic Powder', 'Onion Powder', 'Gravy Mix'] },
  { id: 'f13', name: 'Lechon Kawali', cat: 'food', image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&q=80&w=800', price: 2800, batchSize: 20, desc: 'Deep-fried crispy pork belly with liver sauce', rating: 4.9, reviews: 187, ingredients: ['Pork Belly', 'Peppercorns', 'Bay Leaves', 'Salt', 'Oil', 'Mang Tomas Sauce'] },
  { id: 'f14', name: 'Mixed Veggie Chopsuey', cat: 'food', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800', price: 1400, batchSize: 20, desc: 'Stir-fried mixed vegetables with quail eggs and meat', rating: 4.5, reviews: 98, ingredients: ['Broccoli', 'Cauliflower', 'Carrots', 'Cabbage', 'Quail Eggs', 'Chicken Liver', 'Cornstarch'] },
  { id: 'f15', name: 'Beef Pares (Catering)', cat: 'food', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800', price: 2600, batchSize: 20, desc: 'Braised beef in sweet soy ginger sauce with clear soup', rating: 4.7, reviews: 145, ingredients: ['Beef Flank', 'Star Anise', 'Ginger', 'Soy Sauce', 'Brown Sugar', 'Green Onions'] },
  { id: 'f16', name: 'Bicol Express', cat: 'food', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800', price: 2200, batchSize: 20, desc: 'Creamy and spicy pork stew in coconut milk and chili', rating: 4.8, reviews: 76, ingredients: ['Pork Strips', 'Coconut Cream', 'Bagoong Alamang', 'Green Siling Haba', 'Red Chili', 'Garlic'] },
  // DESSERT
  { id: 'd1', name: 'Mango Bravo Cake', cat: 'dessert', image: 'https://images.unsplash.com/photo-1535141123063-3bb4cada2f59?auto=format&fit=crop&q=80&w=800', price: 1800, batchSize: 20, desc: 'Halden\'s signature mango cream cake, serves 20 pax', rating: 5.0, reviews: 345, ingredients: ['Fresh Mangoes', 'Whipped Cream', 'Meringue Layers', 'Chocolate Mousse', 'Cashews'] },
  { id: 'd2', name: 'Ube Halaya Platter', cat: 'dessert', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800', price: 1200, batchSize: 20, desc: 'Sweet purple yam dessert, serves 20 pax', rating: 4.8, reviews: 67, ingredients: ['Purple Yam', 'Condensed Milk', 'Evaporated Milk', 'Butter', 'Cheese Topping'] },
  { id: 'd3', name: 'Leche Flan Tower', cat: 'dessert', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800', price: 1400, batchSize: 20, desc: 'Classic Filipino caramel custard, serves 20 pax', rating: 4.7, reviews: 88, ingredients: ['Egg Yolks', 'Condensed Milk', 'Vanilla Extract', 'Caramelized Sugar'] },
  { id: 'd5', name: 'Fresh Fruit Buffet', cat: 'dessert', image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&q=80&w=800', price: 1600, batchSize: 20, desc: 'Seasonal cut fruits artfully arranged, serves 20 pax', rating: 4.8, reviews: 95, ingredients: ['Watermelon', 'Pineapple', 'Melon', 'Grapes', 'Papaya'] },
  { id: 'd6', name: 'Buko Pandan Salad', cat: 'dessert', image: 'https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?auto=format&fit=crop&q=80&w=800', price: 1100, batchSize: 20, desc: 'Creamy coconut and pandan jelly dessert', rating: 4.7, reviews: 142, ingredients: ['Buko Strips', 'Pandan Jelly', 'All-purpose Cream', 'Condensed Milk', 'Cheese'] },
  { id: 'd7', name: 'Halo-Halo Station', cat: 'dessert', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800', price: 3500, batchSize: 20, desc: 'Interactive halo-halo station with all standard toppings', rating: 5.0, reviews: 520, ingredients: ['Crushed Ice', 'Leche Flan', 'Ube Halaya', 'Macapuno', 'Kaong', 'Nata de Coco', 'Evaporated Milk'] },
  { id: 'd8', name: 'Cassava Cake Tray', cat: 'dessert', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800', price: 1000, batchSize: 20, desc: 'Baked cassava cake with custard topping', rating: 4.6, reviews: 88, ingredients: ['Grated Cassava', 'Coconut Milk', 'Condensed Milk', 'Cheese', 'Butter'] },
  { id: 'd9', name: 'Puto & Kutsinta Platter', cat: 'dessert', image: 'https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?auto=format&fit=crop&q=80&w=800', price: 800, batchSize: 20, desc: 'Assorted steamed rice cakes with grated coconut', rating: 4.5, reviews: 210, ingredients: ['Rice Flour', 'Sugar', 'Lye Water', 'Grated Coconut', 'Cheese'] },
  // DRINK
  { id: 'dr1', name: 'Soft Drinks Bar', cat: 'drink', image: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?auto=format&fit=crop&q=80&w=800', price: 2000, batchSize: 20, desc: 'Unlimited assorted softdrinks and juice, serves 20 pax', rating: 4.6, reviews: 150, ingredients: ['Coke', 'Sprite', 'Royal', 'Orange Juice', 'Pineapple Juice', 'Ice'] },
  { id: 'dr2', name: 'Iced Tea & Lemonade', cat: 'drink', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800', price: 1500, batchSize: 20, desc: 'Freshly brewed iced tea and lemonade, serves 20 pax', rating: 4.7, reviews: 42, ingredients: ['Tea Leaves', 'Lemon', 'Honey', 'Water'] },
  { id: 'dr3', name: 'Sago\'t Gulaman', cat: 'drink', image: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?auto=format&fit=crop&q=80&w=800', price: 1200, batchSize: 20, desc: 'Classic Filipino sweet drink with sago and jelly', rating: 4.6, reviews: 89, ingredients: ['Brown Sugar', 'Tapioca Pearls', 'Gulaman Cubes', 'Vanilla Extract', 'Water'] },
  { id: 'dr4', name: 'Cucumber Lemonade', cat: 'drink', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800', price: 1400, batchSize: 20, desc: 'Refreshing cucumber and lemon infusion', rating: 4.8, reviews: 67, ingredients: ['Fresh Cucumber', 'Lemon Juice', 'Honey', 'Mint Leaves', 'Purified Water'] },
  { id: 'dr5', name: 'Brewed Coffee Station', cat: 'drink', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800', price: 2500, batchSize: 20, desc: 'Unlimited premium brewed coffee with milk and sugar', rating: 4.9, reviews: 120, ingredients: ['Premium Coffee Beans', 'Fresh Milk', 'Creamer', 'White/Brown Sugar'] },
  // EQUIPMENT
  { id: 'eq1', name: 'Premium Tiffany Chairs', cat: 'equipment', image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&q=80&w=800', price: 150, isIndividual: true, desc: 'Elegant white tiffany chairs with cushions (per pax)', rating: 4.9, reviews: 45 },
  { id: 'eq7', name: 'Round Banquet Tables', cat: 'equipment', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800', price: 500, batchSize: 20, desc: '60-inch round table seats 10-12 pax, serves 20 pax batch', rating: 4.8, reviews: 60 },
  { id: 'eq10', name: 'Premium Utensils Set', cat: 'equipment', image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800', price: 80, isIndividual: true, desc: 'Spoons, forks, and bowls (per pax)', rating: 4.7, reviews: 25 },
  { id: 'eq2', name: 'Full Sound System', cat: 'equipment', image: 'https://images.unsplash.com/photo-1558231580-994d580436a5?auto=format&fit=crop&q=80&w=800', price: 5000, desc: '2 active speakers, mixer, and wired microphones', rating: 4.7, reviews: 32 },
  { id: 'eq3', name: 'HD Projector & Screen', cat: 'equipment', image: 'https://images.unsplash.com/photo-1485846234645-ec686646738c?auto=format&fit=crop&q=80&w=800', price: 3500, desc: '4K projector + 80-inch tripod screen, full-day rental', rating: 4.6, reviews: 18 },
  { id: 'eq4', name: 'Cocktail Tables', cat: 'equipment', image: 'https://images.unsplash.com/photo-1466067531433-f5a401c17319?auto=format&fit=crop&q=80&w=800', price: 800, desc: 'High-top tables with elegant spandex covers (per table)', rating: 4.8, reviews: 29 },
  { id: 'eq5', name: 'Heavy Duty Marquee Tent', cat: 'equipment', image: 'https://images.unsplash.com/photo-1523413363574-c3c4e30467c0?auto=format&fit=crop&q=80&w=800', price: 12000, desc: '6x12m waterproof marquee tent for outdoor events', rating: 4.5, reviews: 12 },
  { id: 'eq6', name: 'LED Stage Lights', cat: 'equipment', image: 'https://images.unsplash.com/photo-1514300074170-efdfc066741d?auto=format&fit=crop&q=80&w=800', price: 4000, desc: 'Set of 8 RGB PAR lights for stage lighting effects', rating: 4.7, reviews: 22 },
  { id: 'eq8', name: 'Generator Set (15kva)', cat: 'equipment', image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800', price: 8000, desc: '15kva silent generator, ideal for outdoor events', rating: 4.5, reviews: 9 },
  { id: 'eq9', name: 'Wireless Microphone Set', cat: 'equipment', image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&q=80&w=800', price: 1500, desc: '2 wireless UHF handheld microphones with stands', rating: 4.8, reviews: 35 },
  // DECORATION
  { id: 'dc1', name: 'Rustic Floral Arch', cat: 'decoration', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800', price: 8500, desc: 'Garden-style floral arch with fresh blooms for entrances', rating: 4.9, reviews: 54 },
  { id: 'dc2', name: 'Balloon Ceiling Setup', cat: 'decoration', image: 'https://images.unsplash.com/photo-1530103043477-c7f44b4131de?auto=format&fit=crop&q=80&w=800', price: 3500, desc: 'Balloon ceiling arrangement in your chosen color scheme', rating: 4.7, reviews: 45 },
  { id: 'dc3', name: 'Floral Table Centerpieces', cat: 'decoration', image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc1b?auto=format&fit=crop&q=80&w=800', price: 2500, desc: 'Elegant floral centerpieces, set of 10 tables', rating: 4.8, reviews: 72 },
  { id: 'dc4', name: 'Themed Stage Backdrop', cat: 'decoration', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800', price: 5000, desc: 'Custom printed backdrop for stage or photo area', rating: 4.6, reviews: 38 },
  // ENTERTAINMENT
  { id: 'en1', name: 'Photo Booth Setup', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800', price: 6000, desc: 'Fun photo booth with props and 4-hour unlimited prints', rating: 4.9, reviews: 128 },
  { id: 'en2', name: 'Live Acoustic Band', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&q=80&w=800', price: 15000, desc: '3-piece live band, 4-hour set, covers all genres', rating: 4.8, reviews: 43 },
  { id: 'en3', name: 'Party Host / Emcee', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800', price: 5000, desc: 'Professional party host to run your event program', rating: 4.7, reviews: 67 },
  { id: 'en4', name: 'Kids Magician', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&q=80&w=800', price: 4000, desc: 'Interactive 1-hour magic show for children', rating: 5.0, reviews: 92 },
  // PHOTOGRAPHY
  { id: 'ph1', name: 'Event Photography', cat: 'photography', image: 'https://images.unsplash.com/photo-1452868977680-bd2b2b33af24?auto=format&fit=crop&q=80&w=800', price: 12000, desc: '8-hour photo coverage, 500+ edited shots on USB', rating: 4.9, reviews: 87 },
  { id: 'ph2', name: 'Photo & Video Bundle', cat: 'photography', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800', price: 22000, desc: 'Full event photo + cinematic video, 8hrs, highlight reel included', rating: 5.0, reviews: 62 },
  { id: 'ph3', name: 'Same-Day Edit Video', cat: 'photography', image: 'https://images.unsplash.com/photo-1601506521793-dc748fc80b67?auto=format&fit=crop&q=80&w=800', price: 8000, desc: '3-5 minute highlight video ready before the event ends', rating: 4.8, reviews: 31 },
];

const PKGS = [
  { 
    id: 'pkg-wedding', 
    name: 'Royal Wedding Package', 
    pricePerHead: 1200, 
    desc: 'A complete, worry-free luxury wedding experience with premium catering and full service.', 
    theme: 'Royal / Classic White',
    occasion: 'Wedding',
    itemIds: ['f1', 'f2', 'f6', 'f8', 'f15', 'd1', 'd7', 'dr4', 'dr5', 'dc1', 'dc3', 'eq1', 'eq7', 'eq10', 'eq2', 'ph2'],
    items: ['Pork Belly Lechon', 'Beef Caldereta', 'Seafood Paella', 'Beef Kare-Kare', 'Beef Pares', 'Mango Bravo Cake', 'Halo-Halo Station', 'Cucumber Lemonade', 'Brewed Coffee Station', 'Rustic Floral Arch', 'Floral Table Centerpieces', 'Tiffany Chairs', 'Round Banquet Tables', 'Premium Utensils', 'Full Sound System', 'Photo & Video Bundle'], 
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800', 
    badge: 'Most Popular', 
    rating: 5.0, 
    reviews: 42, 
    pax: '100 - 200 pax' 
  },
  { 
    id: 'pkg-debut', 
    name: 'Debut Grand Celebration', 
    pricePerHead: 950, 
    desc: 'Celebrate her 18th year with style, music, and an unforgettable buffet.', 
    theme: 'Enchanted / Modern',
    occasion: '18th Birthday (Debut)',
    itemIds: ['f3', 'f4', 'f9', 'f12', 'f13', 'd3', 'd6', 'dr2', 'dr3', 'dc1', 'dc4', 'eq1', 'eq7', 'en2', 'en1'],
    items: ['Garlic Butter Chicken', 'Lumpia Shanghai', 'Pork Sinigang', 'Crispy Fried Chicken', 'Lechon Kawali', 'Leche Flan Tower', 'Buko Pandan Salad', 'Iced Tea & Lemonade', 'Sago\'t Gulaman', 'Floral Arch', 'Themed Stage Backdrop', 'Tiffany Chairs', 'Round Banquet Tables', 'Live Acoustic Band', 'Photo Booth Setup'], 
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800', 
    badge: 'Best Seller', 
    rating: 4.9, 
    reviews: 61, 
    pax: '80 - 150 pax' 
  },
  { 
    id: 'pkg-kiddie', 
    name: 'Kiddie Wonderland', 
    pricePerHead: 650, 
    desc: 'Fun-filled party with magic, games, and kid-approved Filipino dishes.', 
    theme: 'Colorful Carnival',
    occasion: 'Birthday Party',
    itemIds: ['f11', 'f12', 'f4', 'f10', 'd9', 'dr1', 'dc2', 'en4', 'en3', 'en1'],
    items: ['Filipino Style Spaghetti', 'Crispy Fried Chicken', 'Lumpia Shanghai', 'Pancit Bihon', 'Puto & Kutsinta', 'Soft Drinks Bar', 'Balloon Ceiling Setup', 'Kids Magician', 'Party Host / Emcee', 'Photo Booth'], 
    image: 'https://images.unsplash.com/photo-1530103043477-c7f44b4131de?auto=format&fit=crop&q=80&w=800', 
    badge: 'Fan Favorite', 
    rating: 4.8, 
    reviews: 115, 
    pax: '30 - 80 pax' 
  },
  { 
    id: 'pkg-corp', 
    name: 'Corporate Elite', 
    pricePerHead: 850, 
    desc: 'Professional catering and full technical setup for conferences and seminars.', 
    theme: 'Professional / Sleek',
    occasion: 'Corporate Event',
    itemIds: ['f2', 'f14', 'f15', 'f12', 'd5', 'dr5', 'eq2', 'eq3', 'eq6', 'eq8', 'ph1'],
    items: ['Beef Caldereta', 'Mixed Veggie Chopsuey', 'Beef Pares', 'Fried Chicken', 'Fresh Fruit Buffet', 'Brewed Coffee Station', 'Full Sound System', 'HD Projector & Screen', 'LED Stage Lights', 'Generator Set', 'Event Photography'], 
    image: 'https://images.unsplash.com/photo-1505373676874-bc4831343753?auto=format&fit=crop&q=80&w=800', 
    badge: 'Corporate', 
    rating: 4.7, 
    reviews: 34, 
    pax: '50 - 150 pax' 
  },
  { 
    id: 'pkg-bday', 
    name: 'Grand Birthday Bash', 
    pricePerHead: 750, 
    desc: 'The ultimate birthday celebration for all ages with full decor and emcee.', 
    theme: 'Celebration / Festive',
    occasion: 'Birthday',
    itemIds: ['f7', 'f10', 'f4', 'f12', 'f16', 'd1', 'dr2', 'dc2', 'en3', 'ph1'],
    items: ['Classic Chicken Adobo', 'Pancit Bihon', 'Lumpia Shanghai', 'Crispy Fried Chicken', 'Bicol Express', 'Mango Bravo Cake', 'Iced Tea & Lemonade', 'Balloon Ceiling Setup', 'Party Host / Emcee', 'Event Photography'], 
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5ac?auto=format&fit=crop&q=80&w=800', 
    badge: 'Celebration', 
    rating: 4.8, 
    reviews: 78, 
    pax: '50 - 120 pax' 
  },
  { 
    id: 'pkg-dinner', 
    name: 'Intimate Soiree', 
    pricePerHead: 1100, 
    desc: 'Perfect for anniversaries, reunions, or high-end small gatherings.', 
    theme: 'Minimalist / Intimate',
    occasion: 'Private Dinner',
    itemIds: ['f6', 'f8', 'd1', 'dr4', 'dc3', 'en2'],
    items: ['Seafood Paella', 'Beef Kare-Kare', 'Mango Bravo Cake', 'Cucumber Lemonade', 'Floral Table Centerpieces', 'Live Acoustic Band'], 
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800', 
    badge: 'Intimate', 
    rating: 4.9, 
    reviews: 29, 
    pax: '20 - 50 pax' 
  }
];
let activePkg = null;
let cart = [];           // finalized packages only
let customPkgItems = []; // items being built in the sidebar
let curCat = 'all';
let curFullCat = 'all';  // for read-only full catalog filter
let curPkgOccasion = 'all'; // for pre-made package filtering

let pkgSearch = '';      // search term for pre-made packages
let fullSearch = '';     // search term for full read-only catalog
let customSearch = '';   // search term for custom package catalog

let aiPicks = null;
let currentUser = null;
let pendingCheckout = null;
let lastMapCoords = null;

// ===== HERO IMAGES (shared between desktop slideshow + mobile carousels) =====
const HERO_IMAGES = [
  { url: 'https://res.cloudinary.com/dg8ytmck5/image/upload/v1774321988/halden1_sdv4yf.png', label: 'Wedding Reception' },
  { url: 'https://res.cloudinary.com/dg8ytmck5/image/upload/v1774323082/halden_4_fwsgdo.png', label: 'Kiddie Party' },
  { url: 'https://res.cloudinary.com/dg8ytmck5/image/upload/v1774323083/halden5_itbx3u.png', label: 'Birthday Celebration' },
  { url: 'https://res.cloudinary.com/dg8ytmck5/image/upload/v1774323085/halden7_bqts0y.png', label: 'Corporate Dinner' },
  { url: 'https://res.cloudinary.com/dg8ytmck5/image/upload/v1774323086/halden8_xh2jgu.png', label: 'Grand Reception' },
  { url: 'https://res.cloudinary.com/dg8ytmck5/image/upload/v1774323089/halden3_selh2o.png', label: 'Family Gathering' },
  { url: 'https://res.cloudinary.com/dg8ytmck5/image/upload/v1774323085/halden6_gz1sfv.png', label: 'Debut Celebration' },
  { url: 'https://res.cloudinary.com/dg8ytmck5/image/upload/v1774323092/halden2_z1enpn.png', label: 'Wedding Banquet' },
];


// ===== PACKAGES =====
function renderPkgs() {
  const grid = document.getElementById('pkgs-grid');
  if (!grid) return;
  
  let items = PKGS;
  
  // Occasion Filter
  if (curPkgOccasion !== 'all') {
    items = items.filter(p => {
        const occ = p.occasion.toLowerCase();
        const cur = curPkgOccasion.toLowerCase();
        // Match simple keywords
        if (cur === 'birthday' && (occ.includes('birthday') || occ.includes('debut'))) return true;
        return occ.includes(cur);
    });
  }
  
  // Search Filter
  if (pkgSearch.trim()) {
    const q = pkgSearch.toLowerCase();
    items = items.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.desc.toLowerCase().includes(q) ||
      p.items.some(it => it.toLowerCase().includes(q))
    );
  }

  if (!items.length) {
    grid.innerHTML = '<div class="cat-empty" style="grid-column:1/-1; padding:60px;"><p>No packages found matching your criteria.</p></div>';
    return;
  }

  grid.innerHTML = items.map(p => {
    const rv = parseFloat(p.rating || 0);
    const fs = Math.floor(rv);
    const hh = rv % 1 >= 0.5;
    let sh = '';
    for (let i = 0; i < 5; i++) {
      if (i < fs) sh += '<span class="star full">&#9733;</span>';
      else if (i === fs && hh) sh += '<span class="star half">&#9733;</span>';
      else sh += '<span class="star">&#9733;</span>';
    }
    return `
      <div class="cat-card pkg-catalog-card">
        <div class="cat-thumb" style="background:url('${p.image}') center/cover;height:180px;">
          <div class="pkg-cat-badge">${p.badge}</div>
          <div class="pkg-pax-tag">${p.pax}</div>
        </div>
        <div class="cat-info">
          <div class="cat-n">${p.name}</div>
          <div class="cat-d">${p.desc}</div>
          <ul class="pkg-inc-list">${p.items.slice(0,6).map(it => `<li>${it}</li>`).join('')}${p.items.length > 6 ? `<li style="list-style:none; opacity:0.6; padding-left:0;">+ ${p.items.length - 6} more items...</li>` : ''}</ul>
          <div class="full-cat-rating" style="margin-top:10px;">
            <div class="stars-row">${sh}</div>
            <div class="rating-val">${p.rating}</div>
            <div class="review-count">(${p.reviews} reviews)</div>
          </div>
          <div class="pkg-footer-row">
            <div class="cat-p">&#8369;${p.pricePerHead.toLocaleString()} <span style="font-size:12px; font-weight:500; color:var(--text-dim);">/ pax</span></div>
            <button class="btn-add" onclick="openPkgModal('${p.id}')">View Details</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

function getDynamicPrice(item, pax) {
  if (item.isFree) return 0;
  const p = parseInt(pax) || 0;
  if (p <= 0) return item.price;
  if (item.isIndividual) return item.price * p;
  if (item.batchSize) return Math.ceil(p / item.batchSize) * item.price;
  return item.price;
}
window.getDynamicPrice = getDynamicPrice;

// ===== CATALOG =====
function renderCat() {
  const grid = document.getElementById('cat-grid');
  if (!grid) return;
  let items = curCat === 'all' ? CAT : CAT.filter(i => i.cat === curCat);

  // Search Filter
  if (customSearch.trim()) {
    const q = customSearch.toLowerCase();
    items = items.filter(i => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q));
  }

  if (!items.length) { grid.innerHTML = '<div class="cat-empty"><p>No items found.</p></div>'; return; }
  if (aiPicks) items = [...items].sort((a, b) => aiPicks.includes(b.id) - aiPicks.includes(a.id));
  const pickCount = aiPicks ? items.filter(i => aiPicks.includes(i.id)).length : items.length;
  const countEl = document.getElementById('cat-count');
  if (countEl) {
    countEl.innerHTML = aiPicks
        ? `<strong>${pickCount} AI picks</strong> &bull; ${items.length} shown`
        : `<strong>${items.length}</strong> items`;
  }
  grid.innerHTML = items.map(item => {
    const inPkg = customPkgItems.find(c => c.id === item.id);
    const isPick = aiPicks && aiPicks.includes(item.id);
    const isDim = aiPicks && !isPick;
    const pax = document.getElementById('cpkg-pax')?.value || 0;
    const p = parseInt(pax) || 0;
    const dp = getDynamicPrice(item, p);
    let batchInfo = '';
    if (item.isIndividual) {
      batchInfo = 'per pax';
    } else if (item.batchSize) {
      const count = Math.ceil(p / item.batchSize) || 1;
      const displayPax = p > 0 ? p : item.batchSize;
      const isDish = ['food','dessert','drink'].includes(item.cat);
      const unit = isDish ? 'tray' : (item.name.toLowerCase().includes('table') ? 'table' : 'unit');
      batchInfo = `serves ${displayPax} pax (${count} ${unit}${count > 1 ? 's' : ''})`;
    }
    return `
      <div class="cat-card ${isPick ? 'ai-pick' : ''} ${isDim ? 'dimmed' : ''}" onclick="openDishModal('${item.id}')" style="padding:16px;">
        <div class="cat-info">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div class="cat-cat-lbl" style="margin:0;">${item.cat.toUpperCase()}</div>
            ${isPick ? '<span style="font-size:10px; color:var(--gold); font-weight:700;">✨ AI RECOMMENDED</span>' : ''}
          </div>
          <div class="cat-n">${item.name}</div>
          <div class="cat-d">${item.desc}</div>
          <div class="cat-p" style="color:var(--primary); font-weight:700; margin-top:8px;">&#8369;${dp.toLocaleString()} <span style="font-size:10px; color:var(--text-dim); font-weight:400;">${batchInfo}</span></div>
          <button class="btn-add ${inPkg ? 'added' : ''}" onclick="event.stopPropagation(); toggleItem('${item.id}')" style="margin-top:12px;">
            ${inPkg ? '&#10003; Added' : '+ Add to Package'}
          </button>
        </div>
      </div>`;
  }).join('');
}
// ===== FULL CATALOG (READ ONLY) =====

function renderFullCatalog() {
  const grid = document.getElementById('full-grid');
  if (!grid) return;
  let items = curFullCat === 'all' ? CAT : CAT.filter(i => i.cat === curFullCat);

  // Search Filter
  if (fullSearch.trim()) {
    const q = fullSearch.toLowerCase();
    items = items.filter(i => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q));
  }
  grid.innerHTML = items.map(item => {
    const rv = parseFloat(item.rating) || 0;
    const fs = Math.floor(rv);
    const hh = rv % 1 >= 0.5;
    let sh = '';
    for (let i = 0; i < 5; i++) {
      if (i < fs) sh += '<span class="star full">&#9733;</span>';
      else if (i === fs && hh) sh += '<span class="star half">&#9733;</span>';
      else sh += '<span class="star">&#9733;</span>';
    }
    const pax = document.getElementById('cpkg-pax')?.value || 0;
    const p = parseInt(pax) || 0;
    const dp = getDynamicPrice(item, p);
    let batchInfo = '';
    if (item.isIndividual) {
      batchInfo = 'per pax';
    } else if (item.batchSize) {
      const count = Math.ceil(p / item.batchSize) || 1;
      const displayPax = p > 0 ? p : item.batchSize;
      const unit = (item.cat === 'food' || item.cat === 'dessert' || item.cat === 'drink') ? 'tray' : 'unit';
      batchInfo = `serves ${displayPax} pax (${count} ${unit}${count > 1 ? 's' : ''})`;
    }
    return `
      <div class="full-cat-card" onclick="openDishModal('${item.id}')" style="padding:20px;">
        <div class="full-cat-info">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <div class="full-cat-cat" style="margin:0; background:var(--cream2); padding:4px 10px; border-radius:6px; font-size:10px; font-weight:700;">${item.cat.toUpperCase()}</div>
          </div>
          <div class="full-cat-name">${item.name}</div>
          <div class="full-cat-price" style="color:var(--primary); font-weight:700; margin-bottom:8px;">&#8369;${dp.toLocaleString()} <span style="font-size:10px; color:var(--text-dim); font-weight:400;">${batchInfo}</span></div>
          <div class="full-cat-desc">${item.desc}</div>
          <div class="full-cat-rating" style="margin-top:12px;">
            <div class="stars-row">${sh}</div>
            <div class="rating-val">${item.rating}</div>
            <div class="review-count">(${item.reviews} reviews)</div>
          </div>
        </div>
      </div>`;
  }).join('');
}
window.renderFullCatalog = renderFullCatalog;

function setCat(cat, btn) {
  document.querySelectorAll('.fb').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  curCat = cat; renderCat();
}

function jumpCat(cat) {
  curCat = cat;
  document.querySelectorAll('.fb').forEach(b => {
    const matches = b.getAttribute('onclick')?.includes(`'${cat}'`) || (cat === 'all' && b.textContent.trim() === 'All');
    b.classList.toggle('active', !!matches);
  });
  renderCat(); go('#catalog');
}

// ===== SELECT PREMADE PACKAGE =====
function openPkgModal(id) {
  const p = PKGS.find(x => x.id === id);
  if (!p) return;
  
  document.getElementById('pm-header').style.background = `url('${p.image}') center/cover`;
  document.getElementById('pm-title').textContent = p.name;
  document.getElementById('pm-desc').textContent = p.desc;
  document.getElementById('pm-badge').textContent = p.badge;
  document.getElementById('pm-theme').textContent = p.theme;
  document.getElementById('pm-occasion').textContent = p.occasion;
  document.getElementById('pm-price').textContent = '\u20b1' + p.pricePerHead.toLocaleString() + ' / pax';
  
  const itemGrid = document.getElementById('pm-items');
  itemGrid.innerHTML = p.items.map(it => `<span class="ingredient-pill">${it}</span>`).join('');
  
  const btn = document.getElementById('pm-select-btn');
  btn.onclick = () => { applyPremadePkg(p.id); closePkgModal(); };
  
  document.getElementById('pkg-modal-overlay').classList.add('on');
  document.body.style.overflow = 'hidden';
}
function closePkgModal() {
  document.getElementById('pkg-modal-overlay').classList.remove('on');
  document.body.style.overflow = '';
}
window.openPkgModal = openPkgModal;
window.closePkgModal = closePkgModal;

function applyPremadePkg(id) {
  const p = PKGS.find(x => x.id === id);
  if (!p) return;
  
  activePkg = p;
  document.querySelector('.cpkg-title').textContent = p.name;
  
  // Fill text fields
  const themeEl = document.getElementById('cpkg-theme');
  const occEl = document.getElementById('cpkg-occasion');
  if (themeEl) themeEl.value = p.theme;
  if (occEl) occEl.value = p.occasion;
  
  // Add items to package
  customPkgItems = [];
  p.itemIds.forEach(iid => {
    const item = CAT.find(i => i.id === iid);
    if (item) {
      // Logic for free items: Rice, Desserts (except high-end ones like Paella)
      const newItem = {...item};
      if (item.name.toLowerCase().includes('rice') || 
         (item.cat === 'dessert' && item.price < 1500)) {
        newItem.isFree = true;
      }
      customPkgItems.push(newItem);
    }
  });
  
  renderCat();
  renderCustomPkg();
  updateDawContextBar();
  
  // Scroll to workspace
  go('#catalog');
  
  // Show a mini notification
  if (typeof openErrorModal === 'function') {
    // maybe reuse modal for info
    openErrorModal(`Successfully applied ${p.name}! You can now see the items in your workspace and modify them.`);
  }
}
window.applyPremadePkg = applyPremadePkg;

function selectPackage(id) {
  // Legacy function for checkout directly - redirected to modal now
  openPkgModal(id);
}

// ===== FULL CATALOG FILTER =====
function setFullCat(cat, btn) {
  curFullCat = cat;
  document.querySelectorAll('#fbtns-full .fb').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderFullCatalog();
}
window.setFullCat = setFullCat;

function setPkgOccasion(occ, btn) {
  curPkgOccasion = occ;
  document.querySelectorAll('#fbtns-pkgs .fb').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderPkgs();
}
window.setPkgOccasion = setPkgOccasion;

function onPkgSearch(val) { pkgSearch = val; renderPkgs(); }
function onFullSearch(val) { fullSearch = val; renderFullCatalog(); }
function onCustomSearch(val) { customSearch = val; renderCat(); }
window.onPkgSearch = onPkgSearch;
window.onFullSearch = onFullSearch;
window.onCustomSearch = onCustomSearch;

// ===== MOBILE AI DRAWER =====
function openMobAI() {
  document.getElementById('mob-ai-drawer').classList.add('open');
  document.getElementById('mob-overlay').classList.add('on');
  document.body.style.overflow = 'hidden';
  setTimeout(() => initAI('mob'), 50);
}
function closeMobAI() {
  document.getElementById('mob-ai-drawer').classList.remove('open');
  document.getElementById('mob-overlay').classList.remove('on');
  document.body.style.overflow = '';
}
function toggleMobAI() {
  const drawer = document.getElementById('mob-ai-drawer');
  if (drawer.classList.contains('open')) closeMobAI();
  else openMobAI();
}
window.openMobAI = openMobAI;
window.closeMobAI = closeMobAI;
window.toggleMobAI = toggleMobAI;

// ===== CUSTOM PACKAGE =====
function toggleItem(id) {
  const item = CAT.find(i => i.id === id);
  const idx = customPkgItems.findIndex(c => c.id === id);
  
  if (idx > -1) {
    customPkgItems.splice(idx, 1);
  } else {
    // Budget check
    const pax = document.getElementById('cpkg-pax')?.value || 0;
    const p = parseInt(pax) || 0;
    const budgetInput = document.getElementById('cpkg-budget');
    const budget = parseFloat(budgetInput?.value) || 0;
    
    const currentTotal = customPkgItems.reduce((s, i) => s + getDynamicPrice(i, p), 0);
    const itemPrice = getDynamicPrice(item, p);
    
    if (budget > 0 && (currentTotal + itemPrice) > budget) {
      const msg = `<strong>Over Budget!</strong> Adding "${item.name}" (₱${itemPrice.toLocaleString()}) will exceed your set budget of ₱${budget.toLocaleString()}.`;
      if (typeof openErrorModal === 'function') openErrorModal(msg);
      else alert('Over Budget!');
      return;
    }
    customPkgItems.push(item);
  }
  renderCat(); renderCustomPkg();
}

function removePkgItem(id) {
  customPkgItems = customPkgItems.filter(c => c.id !== id);
  renderCat(); renderCustomPkg();
}
window.toggleItem = toggleItem;
window.removePkgItem = removePkgItem;
let editingPkgName = "";

function openNamePkgModal() {
  const overlay = document.getElementById('name-pkg-modal-overlay');
  const input = document.getElementById('cpkg-name-input');
  if (!overlay || !input) return;
  
  const occasion = document.getElementById('cpkg-occasion')?.value || "";
  input.value = editingPkgName || occasion || "";
  // strip " Package" if exists for the input
  input.value = input.value.replace(/ Package$/i, '');
  
  overlay.classList.add('on');
  input.focus();
}

function closeNamePkgModal() {
  document.getElementById('name-pkg-modal-overlay')?.classList.remove('on');
}

function confirmPkgName() {
  const input = document.getElementById('cpkg-name-input');
  let name = input?.value.trim() || "My Custom";
  
  // Ensure it ends with " Package"
  if (!name.toLowerCase().endsWith(" package")) {
    name += " Package";
  }
  
  // Now finalize with this name
  finalizePackageInternal(name);
  closeNamePkgModal();
  editingPkgName = ""; // Reset after use
}

window.openNamePkgModal = openNamePkgModal;
window.closeNamePkgModal = closeNamePkgModal;
window.confirmPkgName = confirmPkgName;

function finalizePackage() {
  console.log('Finalize triggered');
  // Validate required fields safely
  const getV = (id) => (document.getElementById(id)?.value || '').trim();
  
  const desc = getV('cpkg-desc');
  const theme = getV('cpkg-theme');
  const pax = getV('cpkg-pax');
  const date = getV('cpkg-date');
  const occasion = getV('cpkg-occasion');
  const city = getV('cpkg-city');
  const venue = getV('cpkg-venue');

  if (!desc || !theme || !pax || !date || !occasion || !city || !venue) {
    const msg = 'Please fill in all event details including Date and City before finalizing your package.';
    console.warn(msg);
    if (typeof openErrorModal === 'function') openErrorModal(msg);
    else alert(msg);
    return;
  }

  // Strict category validation
  const hasFood = customPkgItems.some(i => i.cat === 'food' || i.cat === 'dessert');
  const hasEquip = customPkgItems.some(i => i.cat === 'equipment' || i.cat === 'decoration');

  if (!hasFood || !hasEquip) {
    const msg = 'Food and Equipment selections are absolutely required. Please select at least one item from each category before finalizing.';
    console.warn(msg);
    if (typeof openErrorModal === 'function') openErrorModal(msg);
    else alert(msg);
    return;
  }

  // Instead of prompt, open the modal
  openNamePkgModal();
}

function finalizePackageInternal(name) {
  const getV = (id) => (document.getElementById(id)?.value || '').trim();
  const desc = getV('cpkg-desc');
  const theme = getV('cpkg-theme');
  const pax = getV('cpkg-pax');
  const date = getV('cpkg-date');
  const occasion = getV('cpkg-occasion');
  const city = getV('cpkg-city');
  const venue = getV('cpkg-venue');

  const total = customPkgItems.reduce((s, i) => s + getDynamicPrice(i, pax), 0);
  const summary = {
    id: 'custom_' + Date.now(),
    isCustom: true,
    name: name.trim(),
    desc, theme, pax, date, occasion, venue, city,
    items: customPkgItems.map(i => ({...i, price: getDynamicPrice(i, pax)})),
    total,
    price: total,
    icon: '📋'
  };

  cart.push(summary);
  renderCart();
  const drawer = document.getElementById('cart-drawer');
  if (drawer) drawer.classList.add('open');

  customPkgItems = [];
  renderCustomPkg();
  ['cpkg-desc','cpkg-theme','cpkg-pax','cpkg-date','cpkg-occasion', 'cpkg-city', 'cpkg-venue'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.value = '';
  });
  
  renderCat();

  // Close items view if open
  const panel = document.getElementById('cpkg-panel');
  const view = document.getElementById('cpkg-selected-items-view');
  if (panel) panel.classList.remove('view-items-open');
  if (view) view.classList.remove('open');
  
  console.log('Finalize successful');
}

function renderCustomPkg() {
  const tot = document.getElementById('cpkg-total');
  const cnt = document.getElementById('cpkg-count');
  if (!tot || !cnt) return;

  const pax = document.getElementById('cpkg-pax')?.value || 0;
  const pCount = parseInt(pax) || 0;
  
  let totalAmt = 0;
  if (activePkg) {
    // Fixed per-head pricing for active package
    totalAmt = activePkg.pricePerHead * pCount;
    // Add cost for items that are NOT part of the original package template
    customPkgItems.forEach(item => {
      // Check if item is in the original package template
      const isOriginal = activePkg.itemIds.includes(item.id);
      if (!isOriginal && !item.isFree) {
        totalAmt += getDynamicPrice(item, pCount);
      }
    });
  } else {
    totalAmt = customPkgItems.reduce((s, i) => s + getDynamicPrice(i, pCount), 0);
  }

  const budgetInput = document.getElementById('cpkg-budget');
  const budget = parseFloat(budgetInput?.value) || 0;
  const priceSum = document.getElementById('cpkg-price-summary');
  if (priceSum) {
    priceSum.textContent = '\u20b1' + totalAmt.toLocaleString();
    if (budget > 0 && totalAmt > budget) priceSum.style.background = 'var(--red)';
    else priceSum.style.background = 'var(--primary)';
  }

  tot.textContent = '\u20b1' + totalAmt.toLocaleString();
  cnt.textContent = customPkgItems.length;

  const cats = {
    food: document.getElementById('cpkg-list-food'),
    equipment: document.getElementById('cpkg-list-equipment'),
    fun: document.getElementById('cpkg-list-fun'),
    addons: document.getElementById('cpkg-list-addons'),
    free: document.getElementById('cpkg-list-free')
  };

  // Group items by category rule
  const groups = { food: [], equipment: [], fun: [], addons: [], free: [] };
  customPkgItems.forEach(item => {
    if (item.isFree) groups.free.push(item);
    else if (item.cat === 'food' || item.cat === 'dessert' || item.cat === 'drink') groups.food.push(item);
    else if (item.cat === 'equipment' || item.cat === 'decoration') groups.equipment.push(item);
    else if (item.cat === 'entertainment') groups.fun.push(item);
    else if (item.cat === 'photography') groups.addons.push(item);
  });

  Object.keys(cats).forEach(key => {
    const el = cats[key];
    if (!el) return;
    if (!groups[key].length) {
      el.innerHTML = `<div class="cpkg-cat-empty">No items selected</div>`;
    } else {
      el.innerHTML = groups[key].map(item => {
        const pax = document.getElementById('cpkg-pax')?.value || 0;
        const p = parseInt(pax) || 0;
        const dp = getDynamicPrice(item, p);
        
        let priceDisplay = '&#8369;' + dp.toLocaleString();
        if (item.isFree) {
          priceDisplay = '<span style="color:var(--gold); font-weight:800;">FREE</span>';
        } else if (activePkg && activePkg.itemIds.includes(item.id)) {
          priceDisplay = '<span style="color:var(--primary); font-size:11px; font-weight:700; text-transform:uppercase;">Included in Package</span>';
        }

        return `
        <div class="cpkg-item-row">
          <div class="cpkg-item-inf">
            <div class="cpkg-item-name">${item.name}</div>
            <div class="cpkg-item-price">${priceDisplay}</div>
          </div>
          <button class="cpkg-item-rm" onclick="removePkgItem('${item.id}')">&times;</button>
        </div>`;
      }).join('');
    }
  });
}
window.renderCustomPkg = renderCustomPkg;

function toggleSelectedItemsView() {
  const panel = document.getElementById('cpkg-panel');
  const view = document.getElementById('cpkg-selected-items-view');
  if (!panel || !view) return;

  if (view.classList.contains('open')) {
    view.classList.remove('open');
    panel.classList.remove('view-items-open');
  } else {
    view.classList.add('open');
    panel.classList.add('view-items-open');
  }
}
window.toggleSelectedItemsView = toggleSelectedItemsView;

// ===== CART (finalized packages) =====
function renderCart() {
  const badge = document.getElementById('c-badge');
  if(badge) badge.textContent = cart.length;
  const el = document.getElementById('cart-items');
  const tot = document.getElementById('cart-tot');
  if (!el) return;
  if (!cart.length) {
    el.innerHTML = `<div class="cart-empty"><div>🛒</div><p>No finalized packages yet.<br>Build and finalize a package from the catalog.</p></div>`;
    if(tot) tot.textContent = '₱0'; return;
  }
  if(tot) tot.textContent = '₱' + cart.filter(c => typeof c.price === 'number').reduce((s, i) => s + i.price, 0).toLocaleString();
  el.innerHTML = cart.map((pkg, pi) => {
    if (pkg.isCustom) {
      return `<div class="c-item" style="flex-direction:column;align-items:flex-start;gap:6px;">
        <div style="display:flex;align-items:center;gap:8px;width:100%;">
          <div class="c-ico">${pkg.icon}</div>
          <div class="c-inf" style="flex:1">
            <div class="c-cat">${pkg.occasion} · ${pkg.pax} pax · ${pkg.venue}</div>
            <div class="c-n">${pkg.name}</div>
            <div class="c-p">₱${pkg.total.toLocaleString()}</div>
          </div>
        </div>
        <div style="font-size:11px;color:var(--text-light);padding:0 0 0 34px;">${pkg.items.map(i=>i.name).join(' · ')}</div>
        <div style="display:flex;gap:8px;padding-left:34px;margin-top:4px;width:calc(100% - 34px);">
          <button class="btn-modify-cpkg" onclick="modifyCartPkg(${pi})" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1" style="flex:1;background:var(--gold);color:#1a1612;border:none;padding:6px 10px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;transition:0.2s;">Modify</button>
          <button class="btn-remove-cpkg" onclick="removeCartPkg(${pi})" onmouseover="this.style.color='var(--red)'" onmouseout="this.style.color='var(--text-light)'" style="flex:1;background:transparent;color:var(--text-light);border:1px solid var(--border);padding:6px 10px;border-radius:6px;font-size:12px;cursor:pointer;transition:0.2s;">Remove</button>
        </div>
      </div>`;
    }
    return `<div class="c-item">
      <div class="c-ico">${pkg.icon||'📦'}</div>
      <div class="c-inf"><div class="c-cat">${pkg.tagline||''}</div><div class="c-n">${pkg.name}</div><div class="c-p">${pkg.price}</div></div>
      <button class="c-rm" onclick="removeCartPkg(${pi})">✖</button>
    </div>`;
  }).join('');
}
window.renderCart = renderCart;

function removeCartPkg(idx) {
  cart.splice(idx, 1);
  renderCart();
}
window.removeCartPkg = removeCartPkg;

function modifyCartPkg(idx) {
  const pkg = cart[idx];
  if (!pkg || !pkg.isCustom) return;

  const safeAssign = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  safeAssign('cpkg-desc', pkg.desc);
  safeAssign('cpkg-theme', pkg.theme);
  safeAssign('cpkg-pax', pkg.pax);
  safeAssign('cpkg-occasion', pkg.occasion);
  safeAssign('cpkg-city', pkg.city);
  safeAssign('cpkg-venue', pkg.venue);
  safeAssign('cpkg-date', pkg.date);
  safeAssign('map-search-input', pkg.venue); 
  
  editingPkgName = pkg.name;
  customPkgItems = [...pkg.items];

  cart.splice(idx, 1);
  renderCart();
  renderCustomPkg();
  renderCat();
  if (typeof updateDawContextBar === 'function') updateDawContextBar();

  document.getElementById('cart-drawer').classList.remove('open');
  go('#builder');
}
window.modifyCartPkg = modifyCartPkg;

function toggleCart() { document.getElementById('cart-drawer').classList.toggle('open'); }
window.toggleCart = toggleCart;

// ===== DATA INSIGHTS PANEL =====
let insightChart = null;
let dataPanelTimeout = null;

function openDataPanel(type) {
  clearTimeout(dataPanelTimeout);
  const workspace = document.querySelector('.catalog-workspace');
  if (workspace) workspace.classList.add('show-data');
  updateInsightChart(type);
}

function closeDataPanelDelay() {
  dataPanelTimeout = setTimeout(() => {
    const workspace = document.querySelector('.catalog-workspace');
    if (workspace) workspace.classList.remove('show-data');
  }, 100);
}

function updateInsightChart(type) {
  const ctx = document.getElementById('insight-chart').getContext('2d');
  const titleEl = document.getElementById('data-title');
  const txtEl = document.getElementById('data-insight-text');
  
  if (insightChart) insightChart.destroy();

  let chartConfig = {};
  let text = '';
  let title = 'Past Trends & Insights';

  // Using Halden's premium gold/brown colors
  const primary = 'rgba(196, 154, 60, 0.8)';
  const secondary = 'rgba(103, 73, 44, 0.8)';
  const tertiary = 'rgba(146, 110, 60, 0.8)';

  if (type === 'theme') {
    title = 'Popular Event Themes';
    text = 'Rustic and Modern Minimalist continue to dominate, making up 60% of all events this year.';
    chartConfig = {
      type: 'pie',
      data: {
        labels: ['Rustic', 'Modern Minimalist', 'Filipiniana', 'Classic Elegance', 'Other'],
        datasets: [{ data: [35, 25, 20, 15, 5], backgroundColor: [secondary, primary, tertiary, '#8f7b66', '#d6c6b4'] }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    };
  } else if (type === 'pax') {
    title = 'Average Guest Count';
    text = 'Most events hover between 50 to 100 guests. Pricing scales attractively within this range.';
    chartConfig = {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Guests (Pax)',
          data: [80, 95, 60, 120, 150, 90],
          backgroundColor: primary,
          borderColor: secondary,
          tension: 0.3,
          fill: true
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    };
  } else if (type === 'occasion') {
    title = 'Events We Catered';
    text = 'Weddings are our specialty, followed closely by Corporate Gatherings and milestone Birthdays.';
    chartConfig = {
      type: 'bar',
      data: {
        labels: ['Weddings', 'Birthdays', 'Corporate', 'Anniversaries', 'Other'],
        datasets: [{ label: 'Frequency', data: [42, 28, 15, 10, 5], backgroundColor: secondary, borderRadius: 4, indexAxis: 'y' }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    };
  } else if (type === 'city') {
    title = 'Specific Venue Insights';
    const cityInput = document.getElementById('cpkg-city').value.trim().toLowerCase();
    
    if (!cityInput) {
      text = 'Please input your chosen city within NCR (e.g. Quezon City, Makati, Malabon). We will display real-time data on the most frequently chosen venues in that area.';
      chartConfig = null;
    } else {
      const ncrVenues = {
        'quezon city': { labels: ['Elements at Centris', 'Fernwood Gardens', 'UP Diliman Halls', 'Veterans Center', 'Blue Gardens'], data: [40, 25, 15, 12, 8] },
        'makati': { labels: ['The Peninsula', 'Makati Shangri-La', 'Whitespace Manila', 'Greenbelt Venues', 'City Club'], data: [35, 30, 20, 10, 5] },
        'manila': { labels: ['Manila Hotel', 'Intramuros Gardens', 'Rizal Park', 'Palacio de Maynila', 'Casa Blanca'], data: [28, 26, 20, 15, 11] },
        'taguig': { labels: ['Blue Leaf Pavilion', 'Marquis Events', 'SMX Aura', 'Enderun Tent', 'Grand Canal Venues'], data: [45, 20, 15, 12, 8] },
        'pasig': { labels: ['Valle Verde Club', 'Glass Garden', 'Kapitolyo Halls', 'Astoria Plaza', 'The Tent'], data: [30, 25, 20, 15, 10] },
        'malabon': { labels: ['A.C. Santos Hall', 'Malabon Grand', 'City Square Events', 'Fishermen\'s Grill', 'Local Covered Court'], data: [50, 25, 15, 5, 5] },
        'caloocan': { labels: ['Grace Park Halls', 'Monument Circle Spaces', 'Luzvimin Resort', 'Caloocan Sports Complex', 'Notre Dame Hall'], data: [35, 25, 20, 10, 10] },
        'marikina': { labels: ['Marikina Convention Center', 'Kapitan Moy', 'Riverbanks Center', 'Loyola Grand Villas', 'Hacienda'], data: [40, 25, 15, 15, 5] }
      };

      const matchKey = Object.keys(ncrVenues).find(k => k === cityInput || cityInput.includes(k) || k.includes(cityInput));
      
      if (matchKey) {
        const d = ncrVenues[matchKey];
        const prettyCity = matchKey.split(' ').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
        text = `Here are the top venues favored by clients specifically within ${prettyCity}:`;
        chartConfig = {
          type: 'bar',
          data: {
            labels: d.labels,
            datasets: [{ label: 'Booking Frequency', data: d.data, backgroundColor: [primary, secondary, tertiary, '#8f7b66', '#d6c6b4'], borderRadius: 4 }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        };
      } else {
        text = 'The catering service does not have enough statistical data for this specific city yet, or it is outside NCR. Please try another common NCR city.';
        chartConfig = null;
      }
    }
  } else {
    title = 'General Insights';
    text = 'Our curated catalog is designed based on industry statistics to assure the finest execution for any event element you choose.';
    chartConfig = {
      type: 'doughnut',
      data: {
        labels: ['Food', 'Decor', 'Equipment', 'Entertainment'],
        datasets: [{ data: [50, 20, 15, 15], backgroundColor: [secondary, primary, tertiary, '#d6c6b4'] }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    };
  }

  titleEl.textContent = title;
  txtEl.textContent = text;
  
  const chartCanvas = document.getElementById('insight-chart');
  if (chartConfig) {
    chartCanvas.style.display = 'block';
    insightChart = new Chart(ctx, chartConfig);
  } else {
    chartCanvas.style.display = 'none';
  }
}
window.openDataPanel = openDataPanel;
window.closeDataPanelDelay = closeDataPanelDelay;

// ===== MOBILE NAV =====
function toggleMobileNav() {
  const nav = document.getElementById('mobile-nav');
  const ham = document.getElementById('hamburger');
  nav.classList.toggle('open');
  ham.classList.toggle('open');
}
function closeMobileNav() {
  document.getElementById('mobile-nav').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

// ===== MOBILE AI DRAWER =====
function openMobAI() {
  document.getElementById('mob-ai-drawer').classList.add('open');
  document.getElementById('mob-overlay').classList.add('on');
  document.body.style.overflow = 'hidden';
}
function closeMobAI() {
  document.getElementById('mob-ai-drawer').classList.remove('open');
  document.getElementById('mob-overlay').classList.remove('on');
  document.body.style.overflow = '';
}

// ===== DESKTOP FLOATING AI WINDOW =====
function getCustomPkgContext() {
  const desc = document.getElementById('cpkg-desc')?.value.trim();
  const theme = document.getElementById('cpkg-theme')?.value.trim();
  const pax = document.getElementById('cpkg-pax')?.value.trim();
  const date = document.getElementById('cpkg-date')?.value.trim();
  const occasion = document.getElementById('cpkg-occasion')?.value.trim();
  const venue = document.getElementById('cpkg-venue')?.value.trim();
  const hasForm = desc || theme || pax || date || occasion || venue;
  const hasItems = customPkgItems.length > 0;
  if (!hasForm && !hasItems) return null;
  let ctx = "[CURRENT CUSTOM PACKAGE]\n";
  if (occasion) ctx += `Occasion: ${occasion}\n`;
  if (date) ctx += `Date: ${date}\n`;
  if (desc) ctx += `Description: ${desc}\n`;
  if (theme) ctx += `Theme: ${theme}\n`;
  if (pax) ctx += `Guests: ${pax} pax\n`;
  if (venue) ctx += `Venue: ${venue}\n`;
  if (hasItems) {
    ctx += `Items selected (${customPkgItems.length}): ${customPkgItems.map(i => `${i.name} (₱${getDynamicPrice(i, pax).toLocaleString()})`).join(', ')}\n`;
    ctx += `Current total: ₱${customPkgItems.reduce((s,i) => s + getDynamicPrice(i, pax), 0).toLocaleString()}\n`;
  }
  return ctx;
}

function updateDawContextBar() {
  const bar = document.getElementById('daw-context-bar');
  if (!bar) return;
  const ctx = getCustomPkgContext();
  if (ctx) {
    const cnt = customPkgItems.length;
    const occasion = document.getElementById('cpkg-occasion')?.value.trim();
    bar.textContent = `Reading your package${occasion ? (' — ' + occasion) : ''}${cnt ? (' · ' + cnt + ' item' + (cnt!==1?'s':'')) : ''}`;
    bar.classList.add('on');
  } else {
    bar.classList.remove('on');
  }
}

function toggleDeskAI() {
  const win = document.getElementById('desk-ai-window');
  const overlay = document.getElementById('desk-ai-overlay');
  if (win.classList.contains('open')) {
    closeDeskAI();
  } else {
    win.classList.add('open');
    overlay.classList.add('on');
    initAI('desk');
    updateDawContextBar();
  }
}
function closeDeskAI() {
  document.getElementById('desk-ai-window').classList.remove('open');
  document.getElementById('desk-ai-overlay').classList.remove('on');
}
window.toggleDeskAI = toggleDeskAI;
window.closeDeskAI = closeDeskAI;

// ===== AI =====
const API_URL = 'https://halden-s-catering-service.vercel.app/api/chat';

const SYS = `You are Hal'Serve AI, the elite event planning assistant for Halden's Catering Services. You are warm, professional, and deeply knowledgeable about premium events in the Philippines. 

YOUR MISSION:
1. Help clients plan their dream events with Halden's premium catering and services.
2. Our system now uses DYNAMIC PRICING:
   - Food, Desserts, Drinks, and Tables are priced in batches (default serves 20 pax). 
   - Example: If a user needs 50 pax, the system automatically calculates 3 batches.
   - Individual items like Chairs and Utensils are priced PER PERSON.
   - Mention this dynamic pricing if the user asks about costs.
3. If the user provides a [CURRENT CUSTOM PACKAGE] block, ANALYZE it thoroughly:
   - Check if the selected items match the event's Theme and Occasion.
   - Verify if the items are sufficient for the number of Guests (pax).
   - Suggest missing essentials (e.g., if they have food but no drinks, or no equipment/waiters for a large group).
   - Give an honest, expert opinion on the overall "vibe" and completeness of their package.
4. Keep replies concise and professional. Use ₱ for prices.
5. After EVERY reply, output a JSON block of recommended catalog IDs for highlighting.

LIMITATION: Only answer catering/event planning questions. For unrelated topics, say: "I'm sorry, I am only able to provide assistance in regards to planning your events with Halden's. I cannot help with other topics."

CATALOG IDs:
food: f1, f2, f3, f4, f5, f6, f7, f8, f9, f10, f11, f12, f13, f14, f15, f16
dessert: d1, d2, d3, d5, d6, d7, d8, d9
drink: dr1, dr2, dr3, dr4, dr5
decoration: dc1, dc2, dc3, dc4
equipment: eq1, eq7, eq10, eq2, eq3, eq4, eq5, eq6, eq8, eq9
entertainment: en1, en2, en3, en4
photography: ph1, ph2, ph3

RULES:
- ALWAYS end every response with: {"recommended_ids":["id1","id2",...]}
- Include 5 to 12 relevant IDs.
- Support Tagalog/Taglish.
- For analysis requests, provide a structured 'Hal'Serve Expert Opinion'.`;

let hist = [{ role: 'system', content: SYS }];
let initialized = { desk: false, mob: false };

function initAI(panel) {
  if (initialized[panel]) return;
  initialized[panel] = true;
  const msgsId = panel === 'desk' ? 'ai-msgs-desk' : 'ai-msgs-mob';
  addBot("Hi there! 👋 I'm Halden's AI Event Planner.\n\nDescribe your event below — the occasion, number of guests, budget, and any theme ideas — and I'll instantly highlight the most suitable items from our catalog for you. ", msgsId);
}

function addBot(txt, msgsId) {
  const c = document.getElementById(msgsId);
  if (!c) return;
  const d = document.createElement('div');
  d.className = 'ai-msg bot';
  d.innerHTML = `<div class="ai-msg-ico"></div><div class="ai-bub">${txt.replace(/\n/g, '<br>')}</div>`;
  c.appendChild(d); c.scrollTop = c.scrollHeight;
}

function addUser(txt, msgsId) {
  const c = document.getElementById(msgsId);
  if (!c) return;
  const d = document.createElement('div');
  d.className = 'ai-msg user';
  d.innerHTML = `<div class="ai-msg-ico">👤</div><div class="ai-bub">${txt.replace(/\n/g, '<br>')}</div>`;
  c.appendChild(d); c.scrollTop = c.scrollHeight;
}

function showTyping(msgsId) {
  const c = document.getElementById(msgsId);
  if (!c) return;
  const d = document.createElement('div');
  d.className = 'ai-msg bot'; d.id = 'typin-' + msgsId;
  d.innerHTML = `<div class="ai-msg-ico"></div><div class="ai-bub typing-dots"><span></span><span></span><span></span></div>`;
  c.appendChild(d); c.scrollTop = c.scrollHeight;
}
function hideTyping(msgsId) { document.getElementById('typin-' + msgsId)?.remove(); }

async function sendMsg(panel) {
  const inpId = panel === 'desk' ? 'ai-inp-desk' : 'ai-inp-mob';
  const btnId = panel === 'desk' ? 'ai-send-desk' : 'ai-send-mob';
  const msgsId = panel === 'desk' ? 'ai-msgs-desk' : 'ai-msgs-mob';
  const chipsId = panel === 'desk' ? 'ai-chips-desk' : 'ai-chips-mob';

  const inp = document.getElementById(inpId);
  const btn = document.getElementById(btnId);
  const txt = inp.value.trim();
  if (!txt) return;

  inp.value = ''; inp.style.height = 'auto';
  document.getElementById(chipsId).style.display = 'none';
  addUser(txt, msgsId);
  btn.disabled = true; showTyping(msgsId);

  // For desktop, prepend the current package context to give the AI full awareness
  let userContent = txt;
  const ctx = getCustomPkgContext();
  if (ctx) userContent = ctx + '\nUser message: ' + txt;
  if (panel === 'desk') updateDawContextBar();
  hist.push({ role: 'user', content: userContent });

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'HTTP-Referer': location.href, 'X-Title': "Halden's AI Planner" },
      body: JSON.stringify({ model: 'openai/gpt-oss-120b:free', messages: hist, max_tokens: 900 })
    });
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't connect. Please try again.";
    hist.push({ role: 'assistant', content: reply });
    hideTyping(msgsId);

    const m = reply.match(/\{"recommended_ids"\s*:\s*\[.*?\]\}/s);
    let clean = reply;
    if (m) {
      try {
        const p = JSON.parse(m[0]);
        if (p.recommended_ids?.length) applyPicks(p.recommended_ids, txt);
        clean = reply.replace(m[0], '').trim();
      } catch (e) { }
    }
    addBot(clean, msgsId);

    if (aiPicks && panel === 'desk') {
      const notif = document.getElementById('ai-notif-desk');
      if(notif) { notif.textContent = aiPicks.length; notif.classList.add('on'); }
    }
  } catch (e) {
    hideTyping(msgsId);
    addBot("I'm having trouble connecting right now. Please try again in a moment.", msgsId);
  }
  btn.disabled = false;
}

function applyPicks(ids, query) {
  aiPicks = ids;
  const banner = document.getElementById('ai-banner');
  banner.classList.add('on');
  document.getElementById('aib-title').textContent = ` ${ids.length} items recommended for you`;
  document.getElementById('aib-desc').textContent = `Based on: "${query.substring(0, 55)}${query.length > 55 ? '...' : ''}"`;
  curCat = 'all';
  document.querySelectorAll('.fb').forEach(b => b.classList.remove('active'));
  document.querySelector('.fb').classList.add('active');
  renderCat();
  document.getElementById('cat-panel').scrollTop = 0;
  if (window.innerWidth <= 768) {
    closeMobAI();
    setTimeout(() => go('#catalog'), 350);
    const notif = document.getElementById('ai-notif');
    notif.textContent = ids.length;
    notif.classList.add('on');
  }
}

function clearFilter() {
  aiPicks = null;
  document.getElementById('ai-banner').classList.remove('on');
  document.getElementById('ai-notif').classList.remove('on');
  renderCat();
}
window.clearFilter = clearFilter;

function chipSend(el, panel) {
  const inpId = panel === 'desk' ? 'ai-inp-desk' : 'ai-inp-mob';
  document.getElementById(inpId).value = el.textContent;
  sendMsg(panel);
}

function ar(el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 96) + 'px'; }
function go(id) { document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

// ===== MAP MODAL =====
let leafletMap = null;
let mapMarker = null;

function initLeafletMap() {
  if (leafletMap) return;
  // Default to Manila or a relevant center
  leafletMap = L.map('leaflet-map').setView([14.5995, 120.9842], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(leafletMap);
  
  // Also add click event to map to easily drop pin
  leafletMap.on('click', function(e) {
    if(mapMarker) {
      leafletMap.removeLayer(mapMarker);
    }
    mapMarker = L.marker(e.latlng).addTo(leafletMap);
    
    // Reverse geocode
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
      .then(r => r.json())
      .then(data => {
        if(data && data.display_name) {
          const ncr = ['Manila', 'Quezon City', 'Caloocan', 'Las Piñas', 'Makati', 'Malabon', 'Mandaluyong', 'Marikina', 'Muntinlupa', 'Navotas', 'Parañaque', 'Pasay', 'Pasig', 'Pateros', 'San Juan', 'Taguig', 'Valenzuela', 'Metro Manila', 'National Capital Region', 'NCR'];
          const isNCR = ncr.some(k => data.display_name.includes(k));
          
          if (!isNCR) {
            if (mapMarker) leafletMap.removeLayer(mapMarker);
            document.getElementById('map-search-input').value = '';
            const msg = "<strong>Service Restriction</strong>: We currently only provide catering services within the <strong>National Capital Region (NCR)</strong>. Please select a venue within Metro Manila.";
            if (typeof openErrorModal === 'function') openErrorModal(msg);
            else alert("Service is only available within NCR.");
            return;
          }
          document.getElementById('map-search-input').value = data.display_name;
        }
      });
  });
}

function openMapModal() {
  document.getElementById('map-modal').classList.add('open');
  document.getElementById('map-overlay').classList.add('on');
  
  // If the auth drawer or cart isn't open, we add overflow hidden
  document.body.style.overflow = 'hidden';
  
  // Make sure Leaflet handles the resize properly after rendering when hidden
  setTimeout(() => {
    initLeafletMap();
    leafletMap.invalidateSize();
    // check if there's existing value
    const currentVal = document.getElementById('cpkg-venue').value;
    if (currentVal && !document.getElementById('map-search-input').value) {
      document.getElementById('map-search-input').value = currentVal;
    }
  }, 100);
}

function closeMapModal() {
  document.getElementById('map-modal').classList.remove('open');
  document.getElementById('map-overlay').classList.remove('on');
  if(!document.getElementById('auth-overlay').classList.contains('on') && !document.getElementById('checkout-overlay')?.classList.contains('on') && !document.getElementById('profile-overlay')?.classList.contains('on') && !document.getElementById('mob-overlay')?.classList.contains('on')) {
    document.body.style.overflow = '';
  }
}
window.openMapModal = openMapModal;
window.closeMapModal = closeMapModal;

async function searchLocation() {
  const q = document.getElementById('map-search-input').value.trim();
  if(!q) return;
  
  const btn = document.querySelector('.btn-map-search');
  btn.textContent = '...';
  btn.disabled = true;
  
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`);
    const data = await res.json();
    
    if(data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      const displayName = data[0].display_name;
      
      const ncr = ['Manila', 'Quezon City', 'Caloocan', 'Las Piñas', 'Makati', 'Malabon', 'Mandaluyong', 'Marikina', 'Muntinlupa', 'Navotas', 'Parañaque', 'Pasay', 'Pasig', 'Pateros', 'San Juan', 'Taguig', 'Valenzuela', 'Metro Manila', 'National Capital Region', 'NCR'];
      const isNCR = ncr.some(k => displayName.includes(k));
      
      if (!isNCR) {
        const msg = "<strong>Service Restriction</strong>: SmartServe currently only provides catering services within the <strong>National Capital Region (NCR)</strong>. Please search for a venue within Metro Manila.";
        if (typeof openErrorModal === 'function') openErrorModal(msg);
        else alert("Service restricted to NCR.");
        btn.textContent = 'Search';
        btn.disabled = false;
        return;
      }
      
      leafletMap.flyTo([lat, lon], 16);
      
      if(mapMarker) leafletMap.removeLayer(mapMarker);
      mapMarker = L.marker([lat, lon]).addTo(leafletMap);
      
      // Auto fill input with formatted display name
      document.getElementById('map-search-input').value = displayName;
    } else {
      alert("Location not found. Try a different search term or click on the map to drop a pin.");
    }
  } catch(e) {
    console.error(e);
    alert("Error searching for location.");
  }
  
  btn.textContent = 'Search';
  btn.disabled = false;
}
window.searchLocation = searchLocation;

function confirmLocation() {
  const val = document.getElementById('map-search-input').value.trim();
  if(!val) {
    alert("Please search and select a location first.");
    return;
  }
  document.getElementById('cpkg-venue').value = val;
  closeMapModal();
}
window.confirmLocation = confirmLocation;

// ===== CHECKOUT MAP MODAL =====
let chkLeafletMap = null;
let chkMapMarker = null;

function initCheckoutLeafletMap() {
  if (chkLeafletMap) return;
  chkLeafletMap = L.map('chk-leaflet-map', {
    zoomControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    touchZoom: false,
    boxZoom: false,
    keyboard: false,
    dragging: false
  }).setView([14.5995, 120.9842], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(chkLeafletMap);
}

function closeCheckoutMap() {
  document.getElementById('chk-map-modal').classList.remove('open');
  document.getElementById('chk-map-overlay').classList.remove('on');
}
window.closeCheckoutMap = closeCheckoutMap;

async function openCheckoutMap() {
  const venueStr = document.getElementById('chk-venue').value?.trim();
  if(!venueStr) {
    alert("No specific venue was selected for this package.");
    return;
  }
  
  document.getElementById('chk-map-modal').classList.add('open');
  document.getElementById('chk-map-overlay').classList.add('on');
  
  setTimeout(async () => {
    initCheckoutLeafletMap();
    chkLeafletMap.invalidateSize();
    
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(venueStr)}&limit=1`);
      const data = await res.json();
      
      if(data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        
        lastMapCoords = { lat, lon };
        
        chkLeafletMap.setView([lat, lon], 16);
        
        if(chkMapMarker) chkLeafletMap.removeLayer(chkMapMarker);
        chkMapMarker = L.marker([lat, lon]).addTo(chkLeafletMap);
      }
    } catch(e) { }
  }, 100);
}
window.openCheckoutMap = openCheckoutMap;

// ===== INIT =====
// (render calls moved to DOMContentLoaded below to ensure DOM is ready)

// ===== AUTH =====
function openAuth() {
  document.getElementById('auth-drawer').classList.add('open');
  document.getElementById('auth-overlay').classList.add('on');
  document.body.style.overflow = 'hidden';
}
function closeAuth() {
  document.getElementById('auth-drawer').classList.remove('open');
  document.getElementById('auth-overlay').classList.remove('on');
  document.body.style.overflow = '';
  if (typeof stopIDScanner === 'function') stopIDScanner();
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
  const tb = document.getElementById('tab-' + tab);
  if (tb) tb.classList.add('active');
  document.getElementById('panel-' + tab).classList.add('active');
}

async function doForgotPassword() {
  const email = document.getElementById('forgot-email').value.trim();
  if (!email) return showAuthMsg('forgot-msg', 'error', 'Please enter your email.');
  
  const btn = document.getElementById('forgot-btn');
  btn.disabled = true;
  btn.textContent = 'Sending...';
  
  try {
    await waitForFirebase();
    await window.firebaseFns.sendPasswordResetEmail(window.firebaseAuth, email);
    showAuthMsg('forgot-msg', 'success', 'Password reset link sent! Check your inbox.');
  } catch (err) {
    showAuthMsg('forgot-msg', 'error', 'Error: ' + err.message);
  }
  
  btn.disabled = false;
  btn.textContent = 'Send Recovery Email';
}
window.doForgotPassword = doForgotPassword;

function showAuthMsg(id, type, text) {
  const el = document.getElementById(id);
  el.className = 'auth-msg ' + type;
  el.textContent = text;
}
function clearAuthMsg(id) { const el = document.getElementById(id); el.className = 'auth-msg'; el.textContent = ''; }

function setLoggedIn(user) {
  currentUser = user;
  document.getElementById('auth-logged-in').classList.add('on');
  document.getElementById('panel-login').classList.remove('active');
  document.getElementById('panel-signup').classList.remove('active');
  document.getElementById('auth-display-name').textContent = user.displayName || 'Welcome back!';
  document.getElementById('auth-display-email').textContent = user.email;
  document.querySelector('.btn-auth').innerHTML = '👤 <span class="auth-label">' + (user.displayName?.split(' ')[0] || 'Account') + '</span>';

  if (pendingCheckout) {
    const intent = pendingCheckout;
    pendingCheckout = null;
    closeAuth();
    setTimeout(() => { openCheckout(intent); }, 400);
  }

  // Toggle Profile button
  const pBtn = document.getElementById('btn-profile');
  const mPBtn = document.getElementById('mob-profile-link');
  if (pBtn) pBtn.style.display = 'flex';
  if (mPBtn) mPBtn.style.display = 'block';
}

function setLoggedOut() {
  currentUser = null;
  document.getElementById('auth-logged-in').classList.remove('on');
  document.getElementById('panel-login').classList.add('active');
  document.querySelector('.btn-auth').innerHTML = '👤 <span class="auth-label">Login / Sign Up</span>';

  // Toggle Profile button
  const pBtn = document.getElementById('btn-profile');
  const mPBtn = document.getElementById('mob-profile-link');
  if (pBtn) pBtn.style.display = 'none';
  if (mPBtn) mPBtn.style.display = 'none';
}

// ===== FIREBASE READY HELPER =====
function waitForFirebase(timeout = 5000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (window.firebaseFns && window.firebaseDB) { resolve(); }
      else if (Date.now() - start > timeout) { reject(new Error('Firebase took too long to initialize.')); }
      else { setTimeout(check, 80); }
    };
    check();
  });
}

// ===== GOOGLE LOGIN =====
async function doGoogleLogin() {
  const btns = document.querySelectorAll('.btn-google');
  btns.forEach(b => { b.disabled = true; b.innerHTML = 'Logging in...'; });
  try {
    await waitForFirebase();
    const { GoogleAuthProvider, signInWithPopup, collection, getDocs, addDoc } = window.firebaseFns;
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(window.firebaseAuth, provider);
    const user = result.user;
    const snap = await getDocs(collection(window.firebaseDB, 'users'));
    let found = false;
    snap.forEach(doc => { const d = doc.data(); if (d.uid === user.uid || (d.email && d.email.toLowerCase() === user.email.toLowerCase())) found = true; });
    if (!found) {
      await addDoc(collection(window.firebaseDB, 'users'), { uid: user.uid, name: user.displayName, email: user.email, role: 'customer', createdAt: new Date() });
    }
    setLoggedIn({ displayName: user.displayName, email: user.email, uid: user.uid });
    closeAuth();
  } catch (err) {
    console.error(err);
    alert('Google connection failed. Please try again.');
  } finally {
    btns.forEach(b => { b.disabled = false; b.innerHTML = '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G"> Continue with Google'; });
  }
}
window.doGoogleLogin = doGoogleLogin;

// ===== LOGIN =====
async function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value.trim();
  if (!email || !pass) { showAuthMsg('login-msg', 'error', 'Please fill in all fields.'); return; }
  const btn = document.getElementById('login-btn');
  btn.disabled = true; btn.textContent = 'Logging in...';
  clearAuthMsg('login-msg');
  try {
    await waitForFirebase();
    const { collection, getDocs, query, where } = window.firebaseFns;
    
    // Use a specific query instead of fetching the entire collection
    const q = query(collection(window.firebaseDB, 'users'), where('email', '==', email.toLowerCase()));
    const snapshot = await getDocs(q);
    
    let foundUser = null;
    snapshot.forEach(doc => {
      const data = doc.data();
      // Case-insensitive email check and password match
      if (data.password?.trim() === pass) {
        foundUser = data;
      }
    });

    if (!foundUser) { 
      showAuthMsg('login-msg', 'error', 'Invalid email or password.'); 
      btn.disabled = false; 
      btn.textContent = 'Login to My Account'; 
      return; 
    }
    if (foundUser.role === 'admin') { sessionStorage.setItem('halden_admin', JSON.stringify(foundUser)); window.location.href = 'admin.html'; return; }
    if (foundUser.role === 'staff') { sessionStorage.setItem('halden_staff', JSON.stringify(foundUser)); window.location.href = 'staff.html'; return; }
    setLoggedIn({ displayName: foundUser.name, email: foundUser.email, uid: foundUser.uid });
    closeAuth();
  } catch (err) {
    console.error('Login error:', err);
    showAuthMsg('login-msg', 'error', 'Login failed. Please try again.');
    btn.disabled = false; btn.textContent = 'Login to My Account';
  }
}

// ===== SIGNUP =====
// ===== MULTI-STEP SIGNUP LOGIC =====
let signupData = {};
let signupStep = 1;

function togglePassVisibility(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.type = el.type === 'password' ? 'text' : 'password';
}
window.togglePassVisibility = togglePassVisibility;

function goToSignupStep(step) {
  signupStep = step;
  document.querySelectorAll('.signup-stage').forEach(s => s.classList.remove('active'));
  document.getElementById('signup-stage-' + step).classList.add('active');
  
  // Update dots
  document.querySelectorAll('.signup-step').forEach((dot, idx) => {
    dot.classList.remove('active', 'done');
    if (idx + 1 < step) dot.classList.add('done');
    if (idx + 1 === step) dot.classList.add('active');
  });

  if (step === 2) {
    startIDScanner();
  } else {
    stopIDScanner();
  }
}
window.goToSignupStep = goToSignupStep;

function validateSignupStep1() {
  const fname = document.getElementById('signup-fname').value.trim();
  const lname = document.getElementById('signup-lname').value.trim();
  const mname = document.getElementById('signup-mname').value.trim();
  const phone = document.getElementById('signup-phone').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const pass = document.getElementById('signup-password').value;
  const cpass = document.getElementById('signup-confirm-password').value;

  if (!fname || !lname || !phone || !email || !pass || !cpass) {
    showAuthMsg('signup-msg-1', 'error', 'Please fill in all required fields.');
    return;
  }
  if (phone.length < 10) {
    showAuthMsg('signup-msg-1', 'error', 'Please enter a valid phone number.');
    return;
  }
  if (!email.includes('@')) {
    showAuthMsg('signup-msg-1', 'error', 'Please enter a valid email.');
    return;
  }
  if (pass.length < 6) {
    showAuthMsg('signup-msg-1', 'error', 'Password must be at least 6 characters.');
    return;
  }
  if (pass !== cpass) {
    showAuthMsg('signup-msg-1', 'error', 'Passwords do not match.');
    return;
  }

  signupData = { fname, lname, mname, phone, email, pass };
  clearAuthMsg('signup-msg-1');
  goToSignupStep(2);
}
window.validateSignupStep1 = validateSignupStep1;



// ===== CHECKOUT & RESERVATION =====
function startCheckout(src, pkgName = '', pkgPrice = '') {
  let itemsList = [];
  if (src === 'pkg') {
    const p = PKGS.find(x => x.name === pkgName);
    if (p && p.inc) itemsList = p.inc;
  }
  const intent = { src, pkgName, pkgPrice, itemsList };
  if (src === 'cart' && cart.length === 0) { alert("Your cart is empty. Please add items from the catalog first."); return; }
  if (!currentUser) { pendingCheckout = intent; openAuth(); showAuthMsg('login-msg', 'success', 'Please log in or sign up to continue with your reservation.'); if (src === 'cart') toggleCart(); return; }
  if (src === 'cart') toggleCart();
  openCheckout(intent);
}
window.startCheckout = startCheckout;

function openCheckout(intent) {
  document.getElementById('checkout-drawer').classList.add('open');
  document.getElementById('checkout-overlay').classList.add('on');
  document.body.style.overflow = 'hidden';
  const msgEl = document.getElementById('chk-msg');
  msgEl.className = 'auth-msg'; msgEl.textContent = ''; msgEl.style.display = 'none';
  document.getElementById('btn-confirm-res').disabled = false;
  const sumEl = document.getElementById('chk-summary');
  let html = '', totalNum = 0, totalStr = '₱0';
  let allCheckoutItems = [];

  if (intent.src === 'pkg') {
    html += `<div class="chk-sum-title">Selected Package</div>`;
    html += `<div class="chk-sum-item" style="font-weight:600; color:var(--gold);"><span>${intent.pkgName}</span><span>${intent.pkgPrice}</span></div>`;
    html += `<div class="chk-sum-details" style="font-size:12px; color:var(--text-dim); margin-bottom:12px; padding:8px; background:var(--bg3); border-radius:8px;">`;
    if (intent.itemsList) {
      intent.itemsList.forEach(inc => {
         html += `<div style="margin-bottom:6px;">• ${inc}</div>`;
         allCheckoutItems.push(inc);
      });
    }
    html += `</div>`;
    html += `<div class="chk-sum-tot" style="margin-top:10px;"><span>Estimated Total</span><span id="chk-final-amt">${intent.pkgPrice}</span></div>`;
  } else {
    html += `<div class="chk-sum-title">Custom Package (Cart)</div>`;
    cart.forEach(c => { 
      html += `<div class="chk-sum-item" style="font-weight:600; color:var(--gold);"><span>${c.name}</span><span>₱${c.price.toLocaleString()}</span></div>`; 
      totalNum += c.price; 
      if (c.items && c.items.length) {
        html += `<div class="chk-sum-details" style="font-size:12px; color:var(--text-dim); margin-bottom:12px; padding:8px; background:var(--bg3); border-radius:8px;">`;
        c.items.forEach(inc => {
           html += `<div style="margin-bottom:6px;">• ${inc.name}</div>`;
           allCheckoutItems.push(inc.name);
        });
        html += `</div>`;
      }
    });
    totalStr = '₱' + totalNum.toLocaleString();
    html += `<div class="chk-sum-tot" style="margin-top:10px;"><span>Estimated Total</span><span id="chk-final-amt">${totalStr}</span></div>`;
  }
  
  let pkgTitle = intent.src === 'pkg' ? intent.pkgName : cart.map(c => c.name).join(' & ');
  window.pendingPackageName = pkgTitle;

  window.pendingPackageItems = allCheckoutItems;
  
  const venueInput = document.getElementById('chk-venue');
  const dateInput = document.getElementById('chk-date');
  const typeInput = document.getElementById('chk-type');
  const themeInput = document.getElementById('chk-theme');
  const paxInput = document.getElementById('chk-pax');

  if (intent.src === 'cart' && cart.length > 0) {
    // Fill from the first item in cart (usually the custom package being booked)
    const pkg = cart[0];
    if (venueInput) venueInput.value = pkg.venue || '';
    if (dateInput) dateInput.value = pkg.date || '';
    if (typeInput) typeInput.value = pkg.occasion || '';
    if (themeInput) themeInput.value = pkg.theme || '';
    if (paxInput) paxInput.value = pkg.pax || '';
  } else {
    // If it's a pre-made package or empty, we might need manual input or defaults
    // but per user request, it's mostly about carrying data from custom package area
    if (venueInput) venueInput.value = '';
    if (dateInput) dateInput.value = '';
    if (typeInput) typeInput.value = intent.pkgName || '';
    if (themeInput) themeInput.value = '';
    if (paxInput) paxInput.value = '50';
  }

  sumEl.innerHTML = html;
}

function closeCheckout() {
  document.getElementById('checkout-drawer').classList.remove('open');
  document.getElementById('checkout-overlay').classList.remove('on');
  document.body.style.overflow = '';
}
window.closeCheckout = closeCheckout;

async function submitReservation() {
  const dateObj = document.getElementById('chk-date').value;
  const type = document.getElementById('chk-type').value;
  const theme = document.getElementById('chk-theme').value;
  const pax = document.getElementById('chk-pax').value;
  const venueStr = document.getElementById('chk-venue').value.trim();
  const paymentMethod = document.getElementById('chk-payment-method').value;
  const amountStr = document.getElementById('chk-final-amt').textContent;
  const msgEl = document.getElementById('chk-msg');
  
  if (!dateObj || !pax) { 
    msgEl.className = 'auth-msg error'; 
    msgEl.textContent = 'Please select an event date and guest count.'; 
    msgEl.style.display = 'block'; 
    return; 
  }

  const btn = document.getElementById('btn-confirm-res');
  btn.disabled = true; 
  btn.textContent = 'Confirming Reservation...';

  try {
    await waitForFirebase();
    const { collection, addDoc } = window.firebaseFns;
    const d = new Date(dateObj);
    const fmtDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    const amount = parseFloat(amountStr.replace(/[^0-9.]/g, ''));

    // 1. Create a "Pending" reservation in Firestore
    const resRef = await addDoc(collection(window.firebaseDB, 'reservations'), { 
      client: currentUser.displayName || currentUser.name || 'Guest', 
      email: currentUser.email, 
      type, 
      theme,
      packageName: window.pendingPackageName || 'Custom Event',
      paymentMethod,
      packageItems: window.pendingPackageItems || [],
      date: fmtDate, 
      pax: parseInt(pax), 
      amount: amountStr.replace('Starting ', ''), 
      venue: venueStr || 'TBD',
      coords: lastMapCoords,
      status: 'pending', 
      createdAt: new Date().toISOString() 
    });

    // Reservation saved — payment happens later via the customer dashboard
    msgEl.className = 'auth-msg success';
    msgEl.textContent = 'Reservation submitted successfully! Awaiting admin approval.';
    msgEl.style.display = 'block';

    cart = [];
    lastMapCoords = null;
    renderCart();
    renderCat();

    setTimeout(() => {
      closeCheckout();
      openProfile();
    }, 1500);

  } catch (e) {
    console.error(e);
    msgEl.className = 'auth-msg error'; 
    msgEl.textContent = 'Failed to submit reservation: ' + e.message; 
    msgEl.style.display = 'block';
    btn.disabled = false; 
    btn.textContent = 'Confirm Reservation';
  }
}
window.submitReservation = submitReservation;

// ===== SIGN OUT =====
async function signOut() {
  try { await window.firebaseFns.signOut(window.firebaseAuth); } catch (e) { }
  setLoggedOut(); closeAuth();
}

// ===== DASHBOARD & PROFILE =====
function switchDashTab(tabId, btn) {
  document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.dash-nav-item').forEach(b => b.classList.remove('active'));
  
  document.getElementById(`dash-tab-${tabId}`).classList.add('active');
  btn.classList.add('active');
  
  if (tabId === 'chat') {
    scrollChatToBottom();
    listenToCustomerChat();
  }
  if (tabId === 'calendar') renderCustomerCalendar();
  if (tabId === 'meetings') renderCustomerMeetings();
  if (tabId === 'flags') renderCustomerFlags();
}
window.switchDashTab = switchDashTab;

function openProfile() {
  if (!currentUser) return;
  document.getElementById('dash-overlay').classList.add('on');
  document.body.style.overflow = 'hidden';

  document.getElementById('dash-user-name').textContent = currentUser.displayName || 'Customer';
  document.getElementById('dash-user-email').textContent = currentUser.email;

  renderProfileReservations();
  listenForDirectives();
}
window.openProfile = openProfile;

function closeProfile() {
  document.getElementById('dash-overlay').classList.remove('on');
  document.body.style.overflow = '';
}
window.closeProfile = closeProfile;

async function renderProfileReservations() {
  const lists = {
    processing: document.getElementById('list-processing'),
    approved: document.getElementById('list-approved'),
    rejected: document.getElementById('list-rejected')
  };
  const counts = {
    processing: document.getElementById('count-processing'),
    approved: document.getElementById('count-approved'),
    rejected: document.getElementById('count-rejected')
  };

  if (!lists.processing) return;
  Object.values(lists).forEach(l => l.innerHTML = '<div style="padding:10px; font-size:12px; color:var(--text-dim);">Loading...</div>');

  try {
    await waitForFirebase();
    const { collection, getDocs } = window.firebaseFns;
    const snap = await getDocs(collection(window.firebaseDB, 'reservations'));
    
    const groups = { processing: [], approved: [], rejected: [] };
    
    snap.forEach(doc => {
      const data = doc.data();
      if (data.email && data.email.toLowerCase() === currentUser.email.toLowerCase()) {
        const res = { id: doc.id, ...data };
        const status = (res.status || 'pending').toLowerCase();
        
        if (['pending', 'processing', 'preparing', 'on-going'].includes(status)) groups.processing.push(res);
        else if (['confirmed', 'approved', 'completed'].includes(status)) groups.approved.push(res);
        else if (['cancelled', 'rejected'].includes(status)) groups.rejected.push(res);
      }
    });

    Object.keys(groups).forEach(key => {
      const g = groups[key];
      counts[key].textContent = g.length;
      g.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      lists[key].innerHTML = g.map(res => {
        const isApproved = key === 'approved';
        if (isApproved) {
          const lat = res.coords?.lat || 14.5995;
          const lon = res.coords?.lon || 120.9842;
          const mapUrl = `https://static-maps.yandex.ru/1.x/?ll=${lon},${lat}&z=14&l=map&pt=${lon},${lat},pm2rdl&size=400,300`;
          const paid   = res.paymentStatus === 'paid';

          return `
            <div class="dash-res-card approved">
              <div class="drc-map-side">
                <img src="${mapUrl}" alt="Venue Location" onerror="this.src='https://placehold.co/400x300?text=Location+Map'">
              </div>
              <div class="drc-content">
                <div class="drc-hdr">
                  <div class="drc-type">${res.type} \u2726 Confirmed</div>
                </div>
                <div class="drc-date"><span>\ud83d\udcc5</span> ${res.date}</div>
                <div class="drc-meta">
                  <span>\ud83d\udc65 ${res.pax} pax</span>
                  <span>\ud83d\udcb0 ${res.amount}</span>
                </div>
                <div class="drc-venue"><i>\ud83d\udccd</i> <span>${res.venue || "Halden's Private Venue"}</span></div>
                <div style="margin-top:14px; display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
                  <div class="drc-status approved" style="display:inline-block;">${res.status}</div>
                  ${paid
                    ? `<span style="font-size:11px;background:rgba(45,138,78,0.15);color:var(--green);border:1px solid var(--green);padding:3px 10px;border-radius:20px;font-weight:700;">\u2705 Paid</span>`
                    : `<button onclick="payReservation('${res.id}','${res.amount}','${res.type}','${res.date}')" style="background:linear-gradient(135deg,#c49a3c,#e8bf6a);color:#0a0600;border:none;padding:7px 18px;border-radius:20px;font-weight:700;font-size:12px;cursor:pointer;letter-spacing:.5px;">\ud83d\udcb3 Pay Now</button>`
                  }
                </div>
              </div>
            </div>
          `;
        }

        return `
          <div class="dash-res-card">
            <div class="drc-hdr">
              <div class="drc-type">${res.type}</div>
              <div class="drc-status ${res.status.toLowerCase()}">${res.status}</div>
            </div>
            <div class="drc-date"><span>📅</span> ${res.date}</div>
            <div class="drc-meta">
              <span>👥 ${res.pax} pax</span>
              <span>💰 ${res.amount}</span>
            </div>
          </div>
        `;
      }).join('') || `<div style="padding:10px; font-size:12px; color:var(--text-dim);">No ${key} reservations.</div>`;
    });

  } catch (err) {
    console.error(err);
  }
}

// ===== PAYMONGO: PAY AN EXISTING CONFIRMED RESERVATION =====
async function payReservation(resId, amountStr, type, date) {
  const btn = window.event?.target || null;
  if (btn) { btn.disabled = true; btn.textContent = '\u23f3 Processing...'; }
  try {
    const amount = parseFloat((amountStr || '').replace(/[^0-9.]/g, '')) || 1;
    const apiRes = await fetch('/api/paymongo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items:        [{ name: `${type} - ${date}`, price: amount }],
        customerInfo: { name: currentUser?.displayName || 'Customer', email: currentUser?.email, type },
        reservationId: resId
      })
    });
    const data = await apiRes.json();
    if (data.checkout_url) {
      window.location.href = data.checkout_url;
    } else {
      throw new Error(data.error || 'Could not create payment session. Try again.');
    }
  } catch(e) {
    alert('\u26a0 Payment error: ' + e.message);
    if (btn) { btn.disabled = false; btn.textContent = '\ud83d\udcb3 Pay Now'; }
  }
}
window.payReservation = payReservation;

// Handle PayMongo redirect-back: ?payment=success&resId=xxx or ?payment=cancel
(async function handlePaymentReturn() {
  const params = new URLSearchParams(window.location.search);
  const payment = params.get('payment');
  const resId   = params.get('resId');
  if (!payment) return;

  // Clean URL without reload
  window.history.replaceState({}, '', window.location.pathname);

  if (payment === 'success' && resId) {
    // Mark reservation as paid in Firestore
    try {
      await new Promise(r => setTimeout(r, 1500));  // wait for Firebase to init
      const { doc, updateDoc } = window.firebaseFns || {};
      if (doc && updateDoc && window.firebaseDB) {
        await updateDoc(doc(window.firebaseDB, 'reservations', resId), { paymentStatus: 'paid', paidAt: new Date().toISOString() });
      }
    } catch(e) { console.warn('[PayMongo return] Could not mark paid:', e); }

    // Show a toast/banner notification
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:99999;background:linear-gradient(135deg,#2d8a4e,#3aaa60);color:#fff;padding:14px 28px;border-radius:14px;font-family:"DM Sans",sans-serif;font-size:14px;font-weight:700;box-shadow:0 8px 32px rgba(0,0,0,0.4);text-align:center;';
    toast.innerHTML = '\u2705 Payment successful! Thank you for booking with Halden\'s.';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 6000);

  } else if (payment === 'cancel') {
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:99999;background:#1a1007;border:1px solid #c49a3c;color:#e8dcc8;padding:14px 28px;border-radius:14px;font-family:"DM Sans",sans-serif;font-size:14px;font-weight:600;box-shadow:0 8px 32px rgba(0,0,0,0.4);text-align:center;';
    toast.innerHTML = '\u26a0\ufe0f Payment cancelled. Your reservation is saved \u2014 you can pay later from your bookings.';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 7000);
  }
})();

let chatUnsubscribe = null;

function scrollChatToBottom() {
  const box = document.getElementById('customer-chat-box');
  if (box) setTimeout(() => box.scrollTop = box.scrollHeight, 100);
}

async function sendCustomerMsg() {
  const input = document.getElementById('cust-chat-input');
  const text = input.value.trim();
  if (!text || !currentUser) return;

  try {
    const { collection, addDoc } = window.firebaseFns;
    if (!currentUser.uid) throw new Error("User ID is missing. Please log out and back in.");
    
    await addDoc(collection(window.firebaseDB, 'messages'), {
      uid: currentUser.uid,
      userName: currentUser.displayName || 'Customer',
      userEmail: currentUser.email,
      text: text,
      sender: 'customer',
      timestamp: Date.now()
    });
    input.value = '';
    scrollChatToBottom();
  } catch (err) {
    console.error('Chat error:', err);
    alert("Could not send message: " + err.message);
  }
}
window.sendCustomerMsg = sendCustomerMsg;

function toggleNotifPanel() {
  const p = document.getElementById('dash-notif-panel');
  if (!p) return;
  p.classList.toggle('on');
  if (p.classList.contains('on')) {
    const badge = document.getElementById('dash-notif-badge');
    if (badge) badge.style.display = 'none';
  }
}
window.toggleNotifPanel = toggleNotifPanel;

async function listenToCustomerChat() {
  if (chatUnsubscribe) return; // already listening
  
  const { collection, query, where, onSnapshot, orderBy } = window.firebaseFns;
  const q = query(
    collection(window.firebaseDB, 'messages'),
    where('uid', '==', currentUser.uid),
    orderBy('timestamp', 'asc')
  );

  chatUnsubscribe = onSnapshot(q, (snap) => {
    const box = document.getElementById('customer-chat-box');
    if (!box) return;

    // Reset box but keep welcome if needed
    box.innerHTML = `
      <div class="chat-welcome">
        <div class="chat-ava">H</div>
        <p>Hello! How can we help you with your event planning today? </p>
      </div>
    `;

    snap.forEach(doc => {
      const msg = doc.data();
      const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const wrap = document.createElement('div');
      wrap.className = `chat-bubble ${msg.sender}`;
      wrap.innerHTML = `
        <div class="chat-text">${msg.text}</div>
        <div class="chat-time">${time}</div>
      `;
      box.appendChild(wrap);
    });
    scrollChatToBottom();
  });
}

// ===== DESKTOP DRAGGABLE CAROUSEL =====
function initCarousel() {
  const container = document.getElementById('carousel-container');
  const track = document.getElementById('carousel-track');
  if (!container || !track) return;
  const items = Array.from(track.children);
  items.forEach(item => track.appendChild(item.cloneNode(true)));
  let isDown = false, startX, scrollLeft, animationId;
  const scrollSpeed = 0.8;
  const startDrag = (e) => { isDown = true; container.style.cursor = 'grabbing'; startX = (e.pageX || e.touches?.[0]?.pageX || 0) - container.offsetLeft; scrollLeft = container.scrollLeft; cancelAnimationFrame(animationId); };
  const stopDrag = () => { isDown = false; container.style.cursor = 'grab'; startAutoScroll(); };
  const moveDrag = (e) => { if (!isDown) return; e.preventDefault(); const x = (e.pageX || e.touches?.[0]?.pageX || 0) - container.offsetLeft; container.scrollLeft = scrollLeft - (x - startX) * 1.5; };
  container.addEventListener('mousedown', startDrag);
  container.addEventListener('mouseleave', stopDrag);
  container.addEventListener('mouseup', stopDrag);
  container.addEventListener('mousemove', moveDrag);
  container.addEventListener('touchstart', startDrag, { passive: true });
  container.addEventListener('touchend', stopDrag);
  container.addEventListener('touchmove', moveDrag, { passive: false });
  function startAutoScroll() {
    cancelAnimationFrame(animationId);
    function play() { container.scrollLeft += scrollSpeed; if (container.scrollLeft >= track.scrollWidth / 2) container.scrollLeft = 0; animationId = requestAnimationFrame(play); }
    animationId = requestAnimationFrame(play);
  }
  container.style.scrollBehavior = 'auto';
  startAutoScroll();
}

// ===== MOBILE HERO FIGMA-STYLE CAROUSEL =====
function initMobileHeroCarousel() {
  if (window.innerWidth > 768) return; // mobile only

  const track = document.getElementById('hmc-track');
  if (!track) return;

  // Build items
  HERO_IMAGES.forEach((img, i) => {
    const el = document.createElement('div');
    el.className = 'hmc-item' + (i === 0 ? ' active' : '');
    el.style.backgroundImage = `url('${img.url}')`;
    track.appendChild(el);
  });

  let current = 0;

  function goTo(idx) {
    const items = track.querySelectorAll('.hmc-item');
    if (!items.length) return;
    items[current].classList.remove('active');
    current = (idx + items.length) % items.length;
    items[current].classList.add('active');

    // Center the active card in the viewport
    const screenW = window.innerWidth;
    const itemW = items[current].offsetWidth;
    // Each item is 52vw wide + 16px gap
    const itemStep = itemW + 16;
    // Translate so active card is centered
    const offset = (screenW / 2) - (current * itemStep) - (itemW / 2) - 20; // 20 = padding
    track.style.transform = `translateX(${offset}px)`;
  }

  // Initial position
  goTo(0);

  // Auto-advance every 10 seconds
  setInterval(() => goTo(current + 1), 10000);
}

// ===== MOBILE FADING SQUARE CAROUSEL (Moments section) =====
function initMobileFadeCarousel() {
  if (window.innerWidth > 768) return; // mobile only

  const container = document.getElementById('mob-fade-carousel');
  if (!container) return;

  // Build slides + label
  HERO_IMAGES.forEach((img, i) => {
    const slide = document.createElement('div');
    slide.className = 'mfc-slide' + (i === 0 ? ' active' : '');
    slide.style.backgroundImage = `url('${img.url}')`;
    container.appendChild(slide);
  });

  // Single label element that updates
  const label = document.createElement('div');
  label.className = 'mfc-label';
  label.textContent = HERO_IMAGES[0].label;
  container.appendChild(label);

  let cur = 0;

  setInterval(() => {
    const slides = container.querySelectorAll('.mfc-slide');
    slides[cur].classList.remove('active');
    cur = (cur + 1) % slides.length;
    slides[cur].classList.add('active');
    label.textContent = HERO_IMAGES[cur].label;
  }, 3500);
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
      else entry.target.classList.remove('active');
    });
  }, { root: null, rootMargin: '0px', threshold: 0.02 });
  reveals.forEach(el => observer.observe(el));
}

// ===== CINEMATIC HERO SLIDER =====
const HERO_SLIDES_DATA = [
  { label: 'Grand Wedding Reception' },
  { label: 'Debut Celebrations' },
  { label: 'Elegant Dinner Setups' },
  { label: 'Milestone Birthdays' },
  { label: 'Corporate Events' }
];

let _heroIdx = 0;
let _heroTimer = null;
let _heroProgressTimer = null;
let _heroProgressStart = null;
const HERO_DURATION = 6000; // ms per slide

function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;

  // Assign alt Ken Burns to odd slides
  slides.forEach((s, i) => { if (i % 2 !== 0) s.classList.add('kb-alt'); });

  _heroGoToSlide(0);
}

function _heroGoToSlide(idx) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  const label  = document.getElementById('hero-hud-label');
  const counter = document.querySelector('.hero-counter-cur');

  // Remove active from all
  slides.forEach(s => {
    s.classList.remove('active');
    // Force restart Ken Burns by removing/re-adding
    s.style.animation = 'none';
  });
  dots.forEach(d => d.classList.remove('active'));

  _heroIdx = (idx + slides.length) % slides.length;

  // Activate chosen slide — force reflow to restart animation
  const active = slides[_heroIdx];
  void active.offsetWidth; // reflow
  active.style.animation = '';
  active.classList.add('active');

  if (dots[_heroIdx]) dots[_heroIdx].classList.add('active');
  if (label) label.textContent = HERO_SLIDES_DATA[_heroIdx]?.label || '';
  if (counter) counter.textContent = String(_heroIdx + 1).padStart(2, '0');

  _heroStartProgress();
  clearTimeout(_heroTimer);
  _heroTimer = setTimeout(() => _heroGoToSlide(_heroIdx + 1), HERO_DURATION);
}

function _heroStartProgress() {
  const bar = document.getElementById('hero-progress-fill');
  if (!bar) return;
  bar.style.transition = 'none';
  bar.style.width = '0%';
  void bar.offsetWidth;
  bar.style.transition = `width ${HERO_DURATION}ms linear`;
  bar.style.width = '100%';
}

function heroNav(dir) { _heroGoToSlide(_heroIdx + dir); }
function heroGoTo(idx) { _heroGoToSlide(idx); }
window.heroNav = heroNav;
window.heroGoTo = heroGoTo;

window.addEventListener('load', () => {
  setTimeout(initHeroSlider, 50);
  setTimeout(initMobileHeroCarousel, 80);   // mobile hero bg carousel
  setTimeout(initMobileFadeCarousel, 100);  // mobile moments square
  setTimeout(initCarousel, 100);            // desktop strip carousel
  setTimeout(initScrollReveal, 100);
});

// ===== RESTORE SESSION =====
window.addEventListener('load', () => {
  // Wait for Firebase module to finish loading before attaching auth listener
  waitForFirebase().then(() => {
    const { onAuthStateChanged } = window.firebaseFns || {};
    if (!onAuthStateChanged || !window.firebaseAuth) return;
    onAuthStateChanged(window.firebaseAuth, (user) => {
      if (user) {
        setLoggedIn({ displayName: user.displayName, email: user.email, uid: user.uid });
        listenToCustomerChat(); // start listening on login
      }
      else setLoggedOut();
    });
  }).catch(() => {});
});
function askAiAdviceDetail() {
  document.getElementById('ai-advice-modal').classList.add('on');
  document.body.style.overflow = 'hidden';
}
function closeAiAdviceModal() {
  document.getElementById('ai-advice-modal').classList.remove('on');
  document.body.style.overflow = '';
}
window.askAiAdviceDetail = askAiAdviceDetail;
window.closeAiAdviceModal = closeAiAdviceModal;

function submitAiQuestion() {
  const q = document.getElementById('ai-question-input').value.trim();
  if (!q) {
    alert('Please enter a question for the AI.');
    return;
  }
  closeAiAdviceModal();
  askAiAboutPackage(q);
}
window.submitAiQuestion = submitAiQuestion;

function askAiAboutPackage(specificQ = "") {
  const ctx = getCustomPkgContext();
  if (!ctx) {
    openErrorModal("Please add some event details or select items first so the AI can analyze your package.");
    return;
  }
  
  if (window.innerWidth > 768) {
    document.getElementById('desk-ai-window').classList.add('open');
    document.getElementById('desk-ai-overlay')?.classList.add('on');
    initAI('desk');
  } else {
    openMobAI();
  }
  
  const panel = window.innerWidth > 768 ? 'desk' : 'mob';
  const inpId = panel === 'desk' ? 'ai-inp-desk' : 'ai-inp-mob';
  
  let prompt = "";
  if (specificQ) {
    prompt = `The customer has a specific concern about their package: "${specificQ}"\n\nFull Package Context:\n${ctx}`;
  } else {
    prompt = `Based on my current event details and the items I've selected, what do you think? Any suggestions to make it better?\n\n${ctx}`;
  }
  
  document.getElementById(inpId).value = prompt;
  sendMsg(panel);
}
window.askAiAboutPackage = askAiAboutPackage;

// ===== GLOBAL EXPOSURE =====
window.finalizePackage = finalizePackage;
window.toggleItem = toggleItem;
window.removePkgItem = removePkgItem;
window.renderCart = renderCart;
window.removeCartPkg = removeCartPkg;
window.renderCustomPkg = renderCustomPkg;
window.toggleCart = toggleCart;
window.clearFilter = clearFilter;
window.openErrorModal = openErrorModal;
window.closeErrorModal = closeErrorModal;
window.toggleSelectedItemsView = toggleSelectedItemsView;
window.setCat = setCat;
window.jumpCat = jumpCat;
window.startCheckout = startCheckout;
window.openMapModal = openMapModal;
window.confirmLocation = confirmLocation;
window.closeMapModal = closeMapModal;
window.toggleMobAI = toggleMobAI;
window.closeMobAI = closeMobAI;
window.sendMsg = sendMsg;
window.chipSend = chipSend;

// ===== PUBLIC EVENT CALENDAR =====
let _publicCalendar = null;
let _publicCalInited = false;

function _normalizeDateKey(raw) {
  if (!raw) return null;
  if (typeof raw === 'object' && raw.seconds) {
    return new Date(raw.seconds * 1000).toISOString().split('T')[0];
  }
  const s = String(raw).trim();
  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  return null;
}

function _buildPublicCalendarEvents(reservations) {
  const events = [];
  const activeStatuses = ['confirmed', 'procurement', 'procuring', 'preparing', 'on-going'];

  reservations.forEach(function(ev) {
    const status = String(ev.status || '').toLowerCase();
    if (!activeStatuses.includes(status)) return;

    const eventDate = _normalizeDateKey(ev.date);
    if (!eventDate) return;

    // Prep period: up to 7 days before event day
    const eventObj = new Date(eventDate + 'T00:00:00');
    const prepObj = new Date(eventObj);
    prepObj.setDate(prepObj.getDate() - 7);

    // Determine prep start
    const submitted = _normalizeDateKey(ev.submittedDate || ev.createdAt || ev.requestedAt || ev.bookedAt);
    let prepStart = prepObj;
    if (submitted) {
      const subObj = new Date(submitted + 'T00:00:00');
      if (!isNaN(subObj.getTime()) && subObj < eventObj) {
        prepStart = subObj > prepObj ? subObj : prepObj;
      }
    }

    let cursor = new Date(prepStart);
    const end = new Date(eventDate + 'T00:00:00');
    while (cursor < end) {
      const day = cursor.toISOString().split('T')[0];
      events.push({
        id: ev.id + '-prep-' + day,
        title: 'Reserved',
        start: day,
        allDay: true,
        color: 'rgba(76,110,245,0.55)',
        textColor: '#dfe7ff',
        extendedProps: { type: 'prep' }
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    events.push({
      id: ev.id,
      title: '🎉 ' + (ev.type || 'Private Event'),
      start: eventDate,
      allDay: true,
      color: '#f1c40f',
      textColor: '#1e1200',
      extendedProps: { type: 'event', eventType: ev.type, pax: ev.pax, status: ev.status }
    });
  });
  return events;
}

function _renderPublicSidebar(reservations) {
  const container = document.getElementById('ev-cal-event-list');
  if (!container) return;

  const activeStatuses = ['confirmed', 'preparing', 'procurement', 'procuring', 'on-going'];
  const today = new Date().toISOString().split('T')[0];

  const upcoming = reservations
    .filter(r => activeStatuses.includes((r.status || '').toLowerCase()) && _normalizeDateKey(r.date) >= today)
    .sort((a, b) => (_normalizeDateKey(a.date) || '').localeCompare(_normalizeDateKey(b.date) || ''))
    .slice(0, 12);

  if (!upcoming.length) {
    container.innerHTML = '<div class="ev-cal-empty">No upcoming events scheduled yet.</div>';
    return;
  }

  container.innerHTML = upcoming.map(r => {
    const dateStr = _normalizeDateKey(r.date);
    const d = dateStr ? new Date(dateStr + 'T00:00:00') : null;
    const dayNum = d ? d.getDate() : '?';
    const monStr = d ? d.toLocaleString('en-US', { month: 'short' }).toUpperCase() : '';
    const statusClass = (r.status || '').toLowerCase().includes('confirm') ? 'confirmed' : 'preparing';
    const statusLabel = (r.status || '').charAt(0).toUpperCase() + (r.status || '').slice(1);

    return `
      <div class="ev-cal-event-card">
        <div class="ev-cal-event-date-box">
          <div class="ev-cal-date-day">${dayNum}</div>
          <div class="ev-cal-date-mon">${monStr}</div>
        </div>
        <div class="ev-cal-event-info">
          <div class="ev-cal-event-type">${r.type || 'Private Event'}</div>
          <div class="ev-cal-event-meta">👥 ${r.pax || '—'} pax</div>
          <div class="ev-cal-event-status ${statusClass}">${statusLabel}</div>
        </div>
      </div>`;
  }).join('');
}

async function initPublicCalendar() {
  if (_publicCalInited) {
    if (_publicCalendar) _publicCalendar.render();
    return;
  }
  _publicCalInited = true;

  const el = document.getElementById('public-calendar');
  const listEl = document.getElementById('ev-cal-event-list');
  if (!el) return;

  // Load reservations from Firestore
  let reservations = [];
  try {
    await waitForFirebase();
    const { collection, getDocs } = window.firebaseFns || {};
    const db = window.firebaseDB;
    if (collection && getDocs && db) {
      const snap = await getDocs(collection(db, 'reservations'));
      reservations = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (e) {
    console.warn('Public calendar: could not load reservations from Firestore', e);
  }

  const calEvents = _buildPublicCalendarEvents(reservations);
  _renderPublicSidebar(reservations);

  _publicCalendar = new FullCalendar.Calendar(el, {
    initialView: window.innerWidth < 768 ? 'listMonth' : 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,listMonth'
    },
    height: window.innerWidth < 768 ? 400 : 620,
    events: calEvents,
    eventDidMount: function(info) {
      // Tooltips
      if (info.event.extendedProps.type === 'event') {
        info.el.title = info.event.extendedProps.eventType + ' — ' + info.event.extendedProps.pax + ' pax';
      } else {
        info.el.title = 'Preparation in progress';
      }
    },
    // No click handler — this is public, read-only
    eventClick: function(info) { info.jsEvent.preventDefault(); }
  });
  _publicCalendar.render();
}

window.initPublicCalendar = initPublicCalendar;

// ===== INITIAL RENDER =====
window.addEventListener('DOMContentLoaded', () => {
  renderPkgs();
  renderFullCatalog();
  renderCat();
  renderCustomPkg();
  renderCart();
  initAI('desk');

  // Safe event listener — guard against element not existing
  const mobFab = document.getElementById('mob-ai-fab');
  if (mobFab) mobFab.addEventListener('click', () => { setTimeout(() => initAI('mob'), 50); });

  // Lazy-init the public calendar when it scrolls into view
  const calSection = document.getElementById('event-calendar');
  if (calSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          initPublicCalendar();
          observer.unobserve(calSection);
        }
      });
    }, { rootMargin: '200px' });
    observer.observe(calSection);
  }
});


// ===== CUSTOMER MEETING & PAYMENT LOGIC =====
let custCalendar = null;
let activePaymentResId = null;

function renderCustomerCalendar() {
  const el = document.getElementById('customer-calendar');
  if(!el || custCalendar) {
    if(custCalendar) setTimeout(() => custCalendar.render(), 10);
    return;
  }
  
  custCalendar = new FullCalendar.Calendar(el, {
    initialView: 'dayGridMonth',
    headerToolbar: { left: 'prev,next', center: 'title', right: 'today' },
    height: 'auto',
    events: async function(info, successCallback, failureCallback) {
      try {
        const { collection, getDocs, query, where } = window.firebaseFns;
        const db = window.firebaseDB;
        
        // Meetings
        const mtSnap = await getDocs(query(collection(db, 'meetings'), where('clientName', '==', currentUser.displayName || currentUser.name || 'Customer')));
        const mtEvents = mtSnap.docs.map(d => ({
          title: `?? Meeting: ${d.data().agenda}`,
          start: `${d.data().date}T${d.data().time}`,
          color: 'var(--gold)',
          textColor: '#000'
        }));
        
        // Reservations
        const resSnap = await getDocs(query(collection(db, 'reservations'), where('email', '==', currentUser.email)));
        const resEvents = resSnap.docs.map(d => ({
          title: `?? Event: ${d.data().type}`,
          start: d.data().date,
          color: 'var(--green)',
          textColor: '#fff'
        }));
        
        successCallback([...mtEvents, ...resEvents]);
      } catch(e) { failureCallback(e); }
    }
  });
  custCalendar.render();
}

async function renderCustomerMeetings() {
  const container = document.getElementById('customer-meetings-list');
  if(!container) return;
  container.innerHTML = '<div style="padding:20px; color:var(--text-dim);">Loading meetings...</div>';
  
  try {
    const { collection, getDocs, query, where } = window.firebaseFns;
    const snap = await getDocs(query(collection(window.firebaseDB, 'meetings'), where('clientName', '==', currentUser.displayName || currentUser.name || 'Customer')));
    
    if(snap.empty) {
      container.innerHTML = '<div style="padding:40px; text-align:center; color:var(--text-dim); font-size:13px;">No meetings scheduled yet.</div>';
      return;
    }
    
    container.innerHTML = snap.docs.map(d => {
      const m = d.data();
      const status = m.status || 'scheduled';
      return `
        <div class="dash-res-card" style="margin-bottom:10px; flex-direction:row; align-items:center; padding:15px; border-radius:12px; background:var(--bg2);">
          <div class="mt-date-box" style="background:var(--bg3); padding:10px; border-radius:10px; text-align:center; min-width:60px; margin-right:15px;">
            <div style="font-size:18px; font-weight:700; color:var(--gold);">${m.date.split("-")[2]}</div>
            <div style="font-size:9px; text-transform:uppercase; color:var(--text-dim);">${new Date(m.date).toLocaleString("en-us",{month:"short"})}</div>
          </div>
          <div style="flex:1;">
            <div style="font-weight:600; color:var(--text);">${m.agenda}</div>
            <div style="font-size:12px; color:var(--text-dim);">${m.time} â€¢ Office Consultation</div>
          </div>
          <div class="badge ${status === 'completed' ? 'confirmed' : 'pending'}">${status}</div>
        </div>
      `;
    }).join("");
  } catch(e) { container.innerHTML = 'Error loading meetings.'; }
}

async function renderCustomerFlags() {
  const container = document.getElementById('customer-flags-list');
  if(!container) return;
  
  const { collection, getDocs, query, where } = window.firebaseFns;
  const resSnap = await getDocs(query(collection(window.firebaseDB, 'reservations'), where('email', '==', currentUser.email)));
  
  let flags = [];
  resSnap.forEach(d => {
    const data = d.data();
    if(data.paymentRequested && data.paymentStatus !== 'paid') {
      flags.push({ id: d.id, type: 'payment', title: 'Payment Required', text: `Reservation for ${data.date} requires initial deposit.`, amount: data.amount });
    }
  });

  const badge = document.getElementById('flag-badge');
  if(flags.length > 0) {
    badge.textContent = flags.length;
    badge.style.display = 'inline-block';
    container.innerHTML = flags.map(f => `
      <div style="padding:20px; background:var(--red-bg); border:1px solid rgba(192,57,43,0.2); border-radius:16px; display:flex; gap:15px; margin-bottom:15px;">
        <div style="font-size:24px;">??</div>
        <div style="flex:1;">
          <div style="font-weight:700; color:var(--text);">${f.title}</div>
          <div style="font-size:13px; color:var(--text-mid); margin-bottom:12px;">${f.text}</div>
          <button class="btn-primary" style="background:var(--red); color:#fff;" onclick="openPaymentModal('${f.id}', '${f.amount}')">Pay Now</button>
        </div>
      </div>
    `).join("");
  } else {
    badge.style.display = 'none';
    container.innerHTML = '<div style="padding:40px; text-align:center; color:var(--text-dim);">No pending items! Everything is on track. ??</div>';
  }
}

// REAL-TIME LISTENER FOR DIRECTIVES (Like Payment Requests)
let directiveUnsub = null;
function listenForDirectives() {
  if(directiveUnsub) directiveUnsub();
  const { collection, query, where, onSnapshot } = window.firebaseFns;
  const q = query(collection(window.firebaseDB, 'reservations'), where('email', '==', currentUser.email));
  
  directiveUnsub = onSnapshot(q, (snap) => {
    snap.docChanges().forEach(change => {
      if (change.type === "modified") {
        const data = change.doc.data();
        if(data.paymentRequested && data.paymentStatus !== 'paid') {
           openPaymentModal(change.doc.id, data.amount);
        }
      }
    });
    renderCustomerFlags();
  });
}

function openPaymentModal(resId, amount) {
  activePaymentResId = resId;
  document.getElementById('pay-amt-display').textContent = amount;
  document.getElementById('payment-overlay').classList.add('on');
  document.getElementById('payment-modal').classList.add('open');
}

function closePaymentModal() {
  document.getElementById('payment-overlay').classList.remove('on');
  document.getElementById('payment-modal').classList.remove('open');
  activePaymentResId = null;
}

async function simulatePaySuccess() {
  if(!activePaymentResId) return;
  const btn = event.target;
  btn.disabled = true;
  btn.textContent = 'Processing Payment...';
  
  await new Promise(r => setTimeout(r, 2000));
  
  try {
    const { updateDoc, doc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'reservations', activePaymentResId), {
      paymentStatus: 'paid',
      paymentRequested: false
    });
    alert('Payment Successful! Thank you.');
    closePaymentModal();
    renderProfileReservations();
  } catch(e) { alert('Payment processing failed.'); btn.disabled = false; btn.textContent = 'Pay Now'; }
}

window.openPaymentModal = openPaymentModal;
window.closePaymentModal = closePaymentModal;
window.simulatePaySuccess = simulatePaySuccess;

// ===== ID SCANNER INTEGRATION =====
let scanStream = null;
let liveInterval = null;
let livenessScore = 0;
let livenessReady = false;
let scanStage = 'QR'; // QR, FRONT, FLIP, BACK, DONE
let frontSignature = null;
let referenceFingerprint = null;
const REFERENCE_URL = 'https://res.cloudinary.com/dg8ytmck5/image/upload/v1776865875/0eb81af3-578e-4344-85b0-d70c4a384103_dyfeun.jpg';

// Liveness state
let prevCardPos = null;
let prevTotalPos = null;
let cardMotionAcc = 0;
let stabilityFrames = 0;
let isAutoCapturing = false;
let frameCount = 0;
let cardAbsentFrames = 0;

const CARD_MOTION_NEEDED = 18;
const CARD_ABSENT_RESET = 5;
const LIVENESS_NEEDED = 100;

function _$(id) { return document.getElementById(id); }

async function startIDScanner() {
  resetScanUI();
  try {
    scanStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
    });
    const vid = _$('scan-video');
    vid.srcObject = scanStream;
    await new Promise(r => { vid.onloadedmetadata = r; });
    setScanUIStatus('info', 'Position your ID inside the frame. Slide it left and right once detected.');
    loadReferenceID();
    startLivenessLoop();
  } catch (e) {
    setScanUIStatus('error', 'Camera access denied. Please allow camera permissions.');
  }
}

function stopIDScanner() {
  if (liveInterval) { clearInterval(liveInterval); liveInterval = null; }
  if (scanStream) { scanStream.getTracks().forEach(t => t.stop()); scanStream = null; }
}

function resetScanUI() {
  livenessScore = 0;
  livenessReady = false;
  scanStage = 'QR';
  cardMotionAcc = 0;
  frameCount = 0;
  isAutoCapturing = false;
  stabilityFrames = 0;
  
  if (_$('scan-fill')) _$('scan-fill').style.width = '0%';
  if (_$('scan-pct')) _$('scan-pct').textContent = '0%';
  if (_$('scan-laser')) _$('scan-laser').classList.remove('active');
  if (_$('scan-id-frame')) _$('scan-id-frame').classList.remove('pass');
  
  document.querySelectorAll('.scan-pill').forEach(p => p.classList.remove('pass'));
}

function setScanUIStatus(type, msg) {
  const box = _$('scan-status-box');
  const text = _$('scan-status-text');
  if (!box || !text) return;
  text.innerHTML = msg;
  box.style.borderColor = type === 'error' ? '#ff4d6d' : 'var(--gold)';
}

function loadReferenceID() {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = REFERENCE_URL;
  img.onload = () => {
    const cvs = document.createElement('canvas');
    cvs.width = 16; cvs.height = 16;
    const ctx = cvs.getContext('2d');
    ctx.drawImage(img, 0, 0, 16, 16);
    const d = ctx.getImageData(0, 0, 16, 16).data;
    referenceFingerprint = [];
    for (let i = 0; i < d.length; i += 4) {
      referenceFingerprint.push(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
    }
  };
}

function detectCardPresence(d, W, H, CX0, CX1, CY0, CY1) {
  const getL = (px, py) => { const idx = (py * W + px) * 4; return 0.299 * d[idx] + 0.587 * d[idx + 1] + 0.114 * d[idx + 2]; };
  let cSum = 0, cCount = 0, cLums = [];
  for (let y = CY0; y < CY1; y += 2) for (let x = CX0; x < CX1; x += 2) {
    const i = (y * W + x) * 4;
    const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    cSum += lum; cCount++; cLums.push(lum);
  }
  const cardMean = cSum / cCount;
  let cVarSum = 0; for (const l of cLums) cVarSum += (l - cardMean) ** 2;
  const cardStdDev = Math.sqrt(cVarSum / cCount);

  let lapSum = 0, lapCount = 0;
  for (let y = CY0 + 1; y < CY1 - 1; y += 2) for (let x = CX0 + 1; x < CX1 - 1; x += 2) {
    const lap = getL(x, y - 1) + getL(x - 1, y) - 4 * getL(x, y) + getL(x + 1, y) + getL(x, y + 1);
    lapSum += lap * lap; lapCount++;
  }
  const textureScore = Math.sqrt(lapSum / lapCount);

  let axisAligned = 0, diagonal = 0;
  for (let y = CY0 + 1; y < CY1 - 1; y += 2) for (let x = CX0 + 1; x < CX1 - 1; x += 2) {
    const gx = Math.abs(getL(x + 1, y) - getL(x - 1, y));
    const gy = Math.abs(getL(x, y + 1) - getL(x, y - 1));
    if (gx > 6 || gy > 6) {
      if (Math.abs(gx - gy) > Math.max(gx, gy) * 0.2) axisAligned++;
      else diagonal++;
    }
  }
  const geoScore = axisAligned / (diagonal + 1);

  const present = cardMean > 20 && textureScore > 0.6 && cardStdDev > 3 && geoScore > 0.95;
  return { present, textureScore, cardMean };
}

function startLivenessLoop() {
  if (liveInterval) clearInterval(liveInterval);
  const video = _$('scan-video');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const W = 80, H = 60;
  canvas.width = W; canvas.height = H;

  const CX0 = Math.floor(W * 0.075), CX1 = Math.floor(W * 0.925);
  const CY0 = Math.floor(H * 0.20), CY1 = Math.floor(H * 0.80);

  liveInterval = setInterval(() => {
    if (!scanStream || video.readyState < 2) return;
    ctx.drawImage(video, 0, 0, W, H);
    const d = ctx.getImageData(0, 0, W, H).data;

    const presence = detectCardPresence(d, W, H, CX0, CX1, CY0, CY1);

    // Global Center of Mass
    let tSumX = 0, tSumY = 0, tBright = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4; const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      tSumX += x * lum; tSumY += y * lum; tBright += lum;
    }
    const totalPos = { x: tSumX / tBright, y: tSumY / tBright };

    // ID Center of Mass
    let cSumX = 0, cSumY = 0, cBright = 0;
    for (let y = CY0; y < CY1; y++) for (let x = CX0; x < CX1; x++) {
      const i = (y * W + x) * 4; const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      cSumX += x * lum; cSumY += y * lum; cBright += lum;
    }
    const cardPos = { x: cSumX / cBright, y: cSumY / cBright };

    if (!presence.present) {
      cardAbsentFrames++;
      if (cardAbsentFrames >= CARD_ABSENT_RESET) cardMotionAcc = Math.max(0, cardMotionAcc - 0.2);
      prevCardPos = null; prevTotalPos = null;
    } else {
      cardAbsentFrames = 0;
      if (prevCardPos && frameCount > 2) {
        const cardVec = { x: cardPos.x - prevCardPos.x, y: cardPos.y - prevCardPos.y };
        const totalVec = { x: totalPos.x - prevTotalPos.x, y: totalPos.y - prevTotalPos.y };
        const totalMag = Math.sqrt(totalVec.x ** 2 + totalVec.y ** 2);
        if (totalMag < 1.2) {
          const relX = cardVec.x - totalVec.x;
          const relY = cardVec.y - totalVec.y;
          const relMag = Math.sqrt((relX * 1.5) ** 2 + (relY * 0.5) ** 2);
          if (relMag > 0.45) cardMotionAcc += relMag;
        }
      }
    }

    prevCardPos = cardPos;
    prevTotalPos = totalPos;
    frameCount++;

    livenessScore = Math.min(100, (cardMotionAcc / CARD_MOTION_NEEDED) * 100);
    updateLivenessUI(livenessScore);

    // Multi-stage flow
    if (scanStage === 'QR') {
      setScanUIStatus('info', 'Step 1: Scan ID QR Code');
      const qrCanvas = document.createElement('canvas');
      qrCanvas.width = 300; qrCanvas.height = 300;
      qrCanvas.getContext('2d').drawImage(video, 0, 0, 300, 300);
      const qrData = qrCanvas.getContext('2d').getImageData(0, 0, 300, 300);
      const code = jsQR(qrData.data, 300, 300);
      if (code) {
        scanStage = 'FRONT';
        _$('pill-qr').classList.add('pass');
        setScanUIStatus('success', 'QR Verified! Now show the Front of your ID.');
        cardMotionAcc = 0;
      }
    } else if (scanStage === 'FRONT') {
      setScanUIStatus('info', 'Step 2: Scanning Front — slide ID left/right');
      if (livenessScore >= 100) {
        scanStage = 'FLIP';
        frontSignature = { mean: presence.cardMean, tex: presence.textureScore };
        setScanUIStatus('info', 'Front verified! Now FLIP your ID.');
        cardMotionAcc = 0;
      }
    } else if (scanStage === 'FLIP') {
      const meanDiff = Math.abs(presence.cardMean - (frontSignature?.mean || 0)) / (frontSignature?.mean || 1);
      if (meanDiff > 0.15) {
        scanStage = 'BACK';
        setScanUIStatus('info', 'Back detected! Slide it left and right.');
      }
    } else if (scanStage === 'BACK') {
      if (livenessScore >= 100) {
        scanStage = 'DONE';
        livenessReady = true;
        _$('pill-motion').classList.add('pass');
        _$('scan-laser').classList.add('active');
        _$('scan-id-frame').classList.add('pass');
        setScanUIStatus('success', 'Liveness verified! Hold perfectly still to capture.');
      }
    }

    if (scanStage === 'DONE' && !isAutoCapturing) {
      if (presence.present && stabilityFrames >= 10) {
        isAutoCapturing = true;
        captureAndScanID();
      } else if (presence.present) {
        stabilityFrames++;
      } else {
        stabilityFrames = 0;
      }
    }
  }, 100);
}

function updateLivenessUI(pct) {
  _$('scan-fill').style.width = pct + '%';
  _$('scan-pct').textContent = Math.round(pct) + '%';
}

async function captureAndScanID() {
  const video = _$('scan-video');
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  const imgData = canvas.toDataURL('image/jpeg');

  stopIDScanner();
  setScanUIStatus('info', 'Scanning details... Please wait.');
  _$('ocr-progress-wrap').style.display = 'block';

  try {
    const result = await Tesseract.recognize(imgData, 'eng', {
      logger: m => {
        if (m.status === 'recognizing text') {
          _$('ocr-progress-bar').style.width = Math.round(m.progress * 100) + '%';
        }
      }
    });
    processOCR(result.data.text);
  } catch (e) {
    setScanUIStatus('error', 'OCR Failed. Please try again.');
    goToSignupStep(1);
  }
}

function processOCR(text) {
  const norm = text.toLowerCase();
  const fnameMatch = norm.includes(signupData.fname.toLowerCase());
  const lnameMatch = norm.includes(signupData.lname.toLowerCase());

  if (fnameMatch || lnameMatch) {
    _$('pill-text').classList.add('pass');
    _$('verified-name-display').textContent = `${signupData.fname} ${signupData.lname}`;
    doFinalSignup();
  } else {
    setScanUIStatus('error', 'Name match failed. Please ensure the ID is clear.');
    setTimeout(() => goToSignupStep(1), 3000);
  }
}

async function doFinalSignup() {
  try {
    await waitForFirebase();
    const { createUserWithEmailAndPassword, updateProfile, collection, addDoc } = window.firebaseFns;
    const userCred = await createUserWithEmailAndPassword(window.firebaseAuth, signupData.email, signupData.pass);
    const fullName = `${signupData.fname} ${signupData.mname ? signupData.mname + ' ' : ''}${signupData.lname}`;
    await updateProfile(userCred.user, { displayName: fullName });
    
    await addDoc(collection(window.firebaseDB, 'users'), {
      uid: userCred.user.uid,
      name: fullName,
      fname: signupData.fname,
      mname: signupData.mname,
      lname: signupData.lname,
      phone: signupData.phone,
      email: signupData.email,
      role: 'customer',
      verified: true,
      createdAt: new Date()
    });

    goToSignupStep(3);
  } catch (err) {
    console.error(err);
    alert('Signup failed at final stage: ' + err.message);
  }
}

function finishSignup() {
  closeAuth();
  location.reload(); // Quick way to reset state and show logged in
}
window.finishSignup = finishSignup;
function openDishModal(id) {
  const item = CAT.find(i => i.id === id);
  if (!item) return;
  document.getElementById('dm-title').textContent = item.name;
  
  const pax = document.getElementById('cpkg-pax')?.value || 0;
  const p = parseInt(pax) || 0;
  const dp = getDynamicPrice(item, p);
  
  let batchInfo = '';
  if (item.isIndividual) {
    batchInfo = 'per pax';
  } else if (item.batchSize) {
    const count = Math.ceil(p / item.batchSize) || 1;
    const displayPax = p > 0 ? p : item.batchSize;
    const isDish = ['food','dessert','drink'].includes(item.cat);
    const unit = isDish ? 'tray' : (item.name.toLowerCase().includes('table') ? 'table' : 'unit');
    batchInfo = `serves ${displayPax} pax (${count} ${unit}${count > 1 ? 's' : ''})`;
  }
  
  const priceEl = document.getElementById('dm-price-info');
  if (priceEl) {
    priceEl.innerHTML = `&#8369;${dp.toLocaleString()} <span style="font-size:12px; color:var(--text-dim); font-weight:400;">${batchInfo}</span>`;
  }
  
  const isDish = ['food','dessert','drink'].includes(item.cat);
  const disclaimer = document.getElementById('dm-allergy-disclaimer');
  if (disclaimer) disclaimer.style.display = isDish ? 'flex' : 'none';

  const ingGrid = document.getElementById('dm-ingredients');
  if (ingGrid && item.ingredients) {
    ingGrid.innerHTML = item.ingredients.map(ing => `<span class="ingredient-pill">${ing}</span>`).join('');
  } else if (ingGrid) {
    ingGrid.innerHTML = '<p style="font-size:12px;color:#888;">Ingredients list not available for this item.</p>';
  }
  
  document.getElementById('dish-modal-overlay').classList.add('on');
  document.body.style.overflow = 'hidden';
}
function closeDishModal() {
  document.getElementById('dish-modal-overlay').classList.remove('on');
  document.body.style.overflow = '';
}
window.openDishModal = openDishModal;
window.closeDishModal = closeDishModal;
