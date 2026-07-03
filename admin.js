let activeMeetingReservation = null;
const PERSONNEL_CONTACTS = [
  { name: 'Maria Cruz',    email: 'maria.c@eventpros.com',   phone: '0918-765-4321', role: 'Event Coordinator', rate: 8500,  timesBooked: 47 },
  { name: 'John Santos',  email: 'john.s@eventpros.com',    phone: '0917-123-4567', role: 'Emcee / Party Host',   rate: 5000,  timesBooked: 38 },
  { name: 'Elena Reyes',  email: 'elena.r@staff.com',       phone: '0920-555-4444', role: 'Photo & Video Lead',   rate: 12000, timesBooked: 29 },
  { name: 'Antonio Luna', email: 'antonio.l@eventpros.com', phone: '0919-000-1111', role: 'Sound & Lighting Tech', rate: 4500,  timesBooked: 22 },
  { name: 'Bea Villanueva', email: 'bea.v@eventpros.com',   phone: '0921-333-7890', role: 'Decorator / Stylist',   rate: 6000,  timesBooked: 15 },
  { name: 'Carlo Mendez', email: 'carlo.m@staff.com',       phone: '0922-100-2020', role: 'Logistics Staff',      rate: 2500,  timesBooked: 8  }
];

const DESIGN_CATALOG = {
  'Rustic Floral Arch': [
    'https://images.unsplash.com/photo-1522673607200-16484837dec5?q=80&w=400',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=400',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=400',
    'https://images.unsplash.com/photo-1517457373958-b7bdd458ad20?q=80&w=400',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=400'
  ],
  'Balloon Ceiling Setup': [
    'https://images.unsplash.com/photo-1530103043477-c7f44b4131de?q=80&w=400',
    'https://images.unsplash.com/photo-1525268771113-32d9e9021a97?q=80&w=400',
    'https://images.unsplash.com/photo-1464349153735-7db51edc3944?q=80&w=400',
    'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=400',
    'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=400'
  ],
  'Entrance Stylist Setup': [
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=400',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=400',
    'https://images.unsplash.com/photo-1517457373958-b7bdd458ad20?q=80&w=400',
    'https://images.unsplash.com/photo-1502633016834-049038ad72b2?q=80&w=400',
    'https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=400'
  ],
  'Balloon Setup': [
    'https://images.unsplash.com/photo-1525268771113-32d9e9021a97?q=80&w=400',
    'https://images.unsplash.com/photo-1530103043477-c7f44b4131de?q=80&w=400',
    'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=400',
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=400',
    'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=400'
  ],
  'Balloon Drops Ceiling': [
    'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=400',
    'https://images.unsplash.com/photo-1530103043477-c7f44b4131de?q=80&w=400',
    'https://images.unsplash.com/photo-1525268771113-32d9e9021a97?q=80&w=400',
    'https://images.unsplash.com/photo-1464349153735-7db51edc3944?q=80&w=400',
    'https://images.unsplash.com/photo-1502633016834-049038ad72b2?q=80&w=400'
  ],
  'Table Centerpiece': [
    'https://images.unsplash.com/photo-1490750967868-88df5691cc1b?q=80&w=400',
    'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400',
    'https://images.unsplash.com/photo-1507089947368-19c1da977535?q=80&w=400',
    'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=400',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=400'
  ],
  'Letter Standee': [
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=400',
    'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=400',
    'https://images.unsplash.com/photo-1502633016834-049038ad72b2?q=80&w=400',
    'https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=400',
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=400'
  ],
  '2x4 Photo Standee': [
    'https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=400',
    'https://images.unsplash.com/photo-1517457373958-b7bdd458ad20?q=80&w=400',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=400',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=400',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=400'
  ],
  'Lights and Sound System': [
    'https://images.unsplash.com/photo-1558231580-994d580436a5?q=80&w=400',
    'https://images.unsplash.com/photo-1485846234645-ec686646738c?q=80&w=400',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400',
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=400',
    'https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=400'
  ],
  'Default Decoration': [
     'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=400',
     'https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=400',
     'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=400',
     'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=400',
     'https://images.unsplash.com/photo-1502633016834-049038ad72b2?q=80&w=400'
  ]
};

const DECOR_COMPONENTS = {
  'Entrance Stylist Setup': [
    { name: 'Entrance Arch Structure', cost: 5000, supplier: 'EventStyle Co.' },
    { name: 'Fabric Drapes (100m)', cost: 3500, supplier: 'EventStyle Co.' },
    { name: 'Floral Accents (Premium)', cost: 4000, supplier: 'Blossom Florists' },
    { name: 'Spotlight / Pinlight Set', cost: 2500, supplier: 'ProSound Rentals' }
  ],
  'Balloon Setup': [
    { name: 'Latex Balloons (Bulk 500pcs)', cost: 1500, supplier: 'Balloon Arts Studio' },
    { name: 'Balloon Ribbons & Sticks', cost: 800, supplier: 'Balloon Arts Studio' },
    { name: 'Balloon Weights', cost: 500, supplier: 'Balloon Arts Studio' },
    { name: 'Balloon Inflator Rental', cost: 2200, supplier: 'Balloon Arts Studio' }
  ],
  'Balloon Drops Ceiling': [
    { name: 'Balloon Release Net (Giant)', cost: 2500, supplier: 'Balloon Arts Studio' },
    { name: 'Balloon Mix (500pcs)', cost: 1500, supplier: 'Balloon Arts Studio' },
    { name: 'Pull Cord & Rigging', cost: 1000, supplier: 'EventStyle Co.' },
    { name: 'Ceiling Hooks / Clips', cost: 3000, supplier: 'EventStyle Co.' }
  ],
  'Table Centerpiece': [
    { name: 'Crystal Vase Rental', cost: 300, supplier: 'EventStyle Co.' },
    { name: 'Mirror Base', cost: 200, supplier: 'EventStyle Co.' },
    { name: 'Fresh Flower Arrangement', cost: 500, supplier: 'Blossom Florists' },
    { name: 'Votive Candles (Set of 3)', cost: 200, supplier: 'EventStyle Co.' }
  ],
  '2x4 Photo Standee': [
    { name: 'Large Format Printing', cost: 1500, supplier: 'Print&Cut Media' },
    { name: 'Foamboard Backing', cost: 500, supplier: 'Print&Cut Media' },
    { name: 'Collapsible Stand', cost: 500, supplier: 'Print&Cut Media' }
  ],
  'Lights and Sound System': [
    { name: 'Amplifier & Mixer Combo', cost: 3500, supplier: 'ProSound Rentals' },
    { name: 'Passive Speakers (Pair)', cost: 3000, supplier: 'ProSound Rentals' },
    { name: 'Microphone Set (2 Wireless)', cost: 2000, supplier: 'ProSound Rentals' }
  ]
};

function safeNum(val) {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const clean = String(val).replace(/[₱$,]/g, '');
  const n = parseFloat(clean);
  return isNaN(n) ? 0 : n;
}

function getDynamicPrice(item, pax) {
  if (item.isFree) return 0;
  const p = parseInt(pax) || 0;
  if (p <= 0) return item.price;
  if (item.isIndividual) return item.price * p;
  if (item.batchSize) return Math.ceil(p / item.batchSize) * item.price;
  return item.price;
}

const LOGISTICS_MILESTONE_DEFS = [
  {
    id: 'planning',
    label: 'Reservation Detailing & Planning',
    color: '#3b82f6', // blue
    activities: [
      'Equipment inventory checking', 'Rental identification',
      'Design discussion', 'Food tasting', 'Personnel assessment',
      'Guest list finalization', 'Seating layout planning',
      'Additional client requirements', 'Follow-up meetings'
    ],
    durationWeight: 0.4,
    overlap: 0
  },
  {
    id: 'resources',
    label: 'Resource Planning',
    color: '#06b6d4', // cyan
    activities: [
      'Final equipment list', 'Rental planning', 'Staff allocation', 'Grouping of staff'
    ],
    durationWeight: 0.25,
    overlap: 0.3
  },
  {
    id: 'payment',
    label: 'Payment Fulfillment',
    color: '#f59e0b', // amber
    activities: [
      'Down payment completion', 'Payment verification'
    ],
    durationWeight: 0.15,
    overlap: 0.2
  },
  {
    id: 'procurement',
    label: 'Procurement & External Confirmation',
    color: '#8b5cf6', // violet
    activities: [
      'Ingredient procurement', 'Rental confirmation', 'Supplier coordination'
    ],
    durationWeight: 0.25,
    overlap: 0
  },
  {
    id: 'finalization',
    label: 'Finalization',
    color: '#c49a3c', // gold
    activities: [
      'Final confirmation of Staff', 'Final confirmation of Rentals',
      'Final confirmation of Equipment', 'Final confirmation of Event design'
    ],
    durationWeight: 0.1,
    overlap: 0.1
  },
  {
    id: 'preprep',
    label: 'Pre-Preparation (Pre-Prep)',
    color: '#10b981', // emerald
    activities: [
      'Food pre-preparation', 'Equipment packing', 'Task assignment per staff',
      'Load planning', 'Final briefing'
    ],
    durationWeight: 0.1,
    overlap: 0
  }
];

let mtVenueSurcharge = 0;

function calculateMtPrice() {
  const pax = parseInt(mtPax) || 0;
  const base = mtCustomPkgItems.reduce((sum, item) => sum + getDynamicPrice(item, pax), 0);
  return base + (mtVenueSurcharge || 0);
}

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
  { id: 'eq2', name: 'Lights and Sound System', cat: 'equipment', image: 'https://images.unsplash.com/photo-1558231580-994d580436a5?auto=format&fit=crop&q=80&w=800', price: 8500, desc: 'Professional audio setup with lights, mixer, and speakers', rating: 4.8, reviews: 45 },
  { id: 'eq3', name: 'HD Projector & Screen', cat: 'equipment', image: 'https://images.unsplash.com/photo-1485846234645-ec686646738c?auto=format&fit=crop&q=80&w=800', price: 3500, desc: '4K projector + 80-inch tripod screen, full-day rental', rating: 4.6, reviews: 18 },
  // DECORATION
  { id: 'dc1', name: 'Entrance Stylist Setup', cat: 'decoration', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800', price: 15000, desc: 'Grand entrance styling with drapes and lighting', rating: 5.0, reviews: 22 },
  { id: 'dc2', name: 'Balloon Setup', cat: 'decoration', image: 'https://images.unsplash.com/photo-1525268771113-32d9e9021a97?auto=format&fit=crop&q=80&w=800', price: 5000, desc: 'Assorted balloon decor for pillars and walls', rating: 4.8, reviews: 34 },
  { id: 'dc3', name: 'Balloon Drops Ceiling', cat: 'decoration', image: 'https://images.unsplash.com/photo-1530103043477-c7f44b4131de?auto=format&fit=crop&q=80&w=800', price: 8000, desc: 'Ceiling net with balloon release mechanism', rating: 4.9, reviews: 15 },
  { id: 'dc4', name: 'Table Centerpiece', cat: 'decoration', image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc1b?auto=format&fit=crop&q=80&w=800', price: 1200, batchSize: 10, desc: 'Elegant floral and candle arrangement per table', rating: 4.7, reviews: 56 },
  { id: 'dc5', name: 'Letter Standee', cat: 'decoration', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800', price: 500, isIndividual: true, desc: 'Large 4ft lighted letter standee (per character)', rating: 4.9, reviews: 120 },
  { id: 'dc6', name: '2x4 Photo Standee', cat: 'decoration', image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&q=80&w=800', price: 2500, desc: 'Life-size photo standee on high-quality foamboard', rating: 4.6, reviews: 28 },
  { id: 'eq4', name: 'Cocktail Tables', cat: 'equipment', image: 'https://images.unsplash.com/photo-1466067531433-f5a401c17319?auto=format&fit=crop&q=80&w=800', price: 800, desc: 'High-top tables with elegant spandex covers (per table)', rating: 4.8, reviews: 29 },
  { id: 'eq5', name: 'Heavy Duty Marquee Tent', cat: 'equipment', image: 'https://images.unsplash.com/photo-1523413363574-c3c4e30467c0?auto=format&fit=crop&q=80&w=800', price: 12000, desc: '6x12m waterproof marquee tent for outdoor events', rating: 4.5, reviews: 12 },
  { id: 'eq6', name: 'LED Stage Lights', cat: 'equipment', image: 'https://images.unsplash.com/photo-1514300074170-efdfc066741d?auto=format&fit=crop&q=80&w=800', price: 4000, desc: 'Set of 8 RGB PAR lights for stage lighting effects', rating: 4.7, reviews: 22 },
  { id: 'eq8', name: 'Generator Set (15kva)', cat: 'equipment', image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800', price: 8000, desc: '15kva silent generator, ideal for outdoor events', rating: 4.5, reviews: 9 },
  { id: 'eq9', name: 'Wireless Microphone Set', cat: 'equipment', image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&q=80&w=800', price: 1500, desc: '2 wireless UHF handheld microphones with stands', rating: 4.8, reviews: 35 },
  // ENTERTAINMENT
  { id: 'en1', name: 'Photo Booth Setup', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800', price: 6000, desc: 'Fun photo booth with props and 4-hour unlimited prints', rating: 4.9, reviews: 128 },
  { id: 'en2', name: 'Event Coordinator', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800', price: 15000, desc: 'Professional event coordinator, on-the-day management', rating: 4.8, reviews: 43 },
  { id: 'en3', name: 'Party Host / Emcee', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800', price: 5000, desc: 'Professional party host to run your event program', rating: 4.7, reviews: 67 },
  { id: 'en4', name: 'Kids Magician', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&q=80&w=800', price: 4000, desc: 'Interactive 1-hour magic show for children', rating: 5.0, reviews: 92 },
  // PHOTOGRAPHY
  { id: 'ph1', name: 'Event Photography', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1452868977680-bd2b2b33af24?auto=format&fit=crop&q=80&w=800', price: 12000, desc: '8-hour photo coverage, 500+ edited shots on USB', rating: 4.9, reviews: 87 },
  { id: 'ph2', name: 'Photo & Video Bundle', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800', price: 22000, desc: 'Full event photo + cinematic video, 8hrs, highlight reel included', rating: 5.0, reviews: 62 },
  { id: 'ph3', name: 'Same-Day Edit Video', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1601506521793-dc748fc80b67?auto=format&fit=crop&q=80&w=800', price: 8000, desc: '3-5 minute highlight video ready before the event ends', rating: 4.8, reviews: 31 },
];

const RECIPE_DATA = {
  'Pork Belly Lechon': [
    { name: 'Whole Pork Belly', qty20: 5, unit: 'kg', cost: 1750, supplier: 'MeatMasters Inc.' },
    { name: 'Lemongrass & Spices', qty20: 0.5, unit: 'kg', cost: 150, supplier: 'Green Valley' },
    { name: 'Charcoal / Firewood', qty20: 1, unit: 'sack', cost: 350, supplier: '' }
  ],
  'Beef Caldereta': [
    { name: 'Beef Brisket Chunks', qty20: 4, unit: 'kg', cost: 1800, supplier: 'MeatMasters Inc.' },
    { name: 'Tomato Sauce & Liver Spread', qty20: 2, unit: 'kg', cost: 450, supplier: 'General Wholesale' },
    { name: 'Mixed Vegetables', qty20: 2, unit: 'kg', cost: 300, supplier: 'Green Valley' }
  ],
  'Garlic Butter Chicken': [
    { name: 'Whole Chicken Parts', qty20: 5, unit: 'kg', cost: 1250, supplier: 'Poultry Palace' },
    { name: 'Unsalted Butter', qty20: 1, unit: 'kg', cost: 450, supplier: 'General Wholesale' },
    { name: 'Garlic & Herbs', qty20: 0.5, unit: 'kg', cost: 200, supplier: '' }
  ],
  'Lumpia Shanghai': [
    { name: 'Ground Pork', qty20: 2.5, unit: 'kg', cost: 750, supplier: 'MeatMasters Inc.' },
    { name: 'Spring Roll Wrappers', qty20: 100, unit: 'pcs', cost: 150, supplier: '' },
    { name: 'Carrots/Onions/Eggs', qty20: 1, unit: 'set', cost: 200, supplier: 'Green Valley' }
  ],
  'Seafood Paella': [
    { name: 'Saffron Rice', qty20: 3, unit: 'kg', cost: 900, supplier: 'Gourmet Grains' },
    { name: 'Mixed Seafood', qty20: 3, unit: 'kg', cost: 1800, supplier: 'Bayfront Fresh' },
    { name: 'Saffron & Spices', qty20: 1, unit: 'set', cost: 600, supplier: '' }
  ],
  'Mango Bravo Cake': [
    { name: 'Fresh Mangoes', qty20: 2, unit: 'kg', cost: 400, supplier: 'Green Valley' },
    { name: 'Cake Base & Cream', qty20: 1, unit: 'set', cost: 800, supplier: 'Baker\'s Hub' }
  ],
  'Halo-Halo Station': [
    { name: 'Ice & Milk Base', qty20: 5, unit: 'kg', cost: 400, supplier: '' },
    { name: 'Assorted Preserves', qty20: 2, unit: 'kg', cost: 800, supplier: 'General Wholesale' },
    { name: 'Leche Flan / Ube', qty20: 1, unit: 'kg', cost: 600, supplier: 'Baker\'s Hub' }
  ],
  'Classic Chicken Adobo': [
    { name: 'Chicken Whole', qty20: 5, unit: 'kg', cost: 1200, supplier: 'Poultry Palace' },
    { name: 'Soy Sauce & Vinegar', qty20: 1, unit: 'set', cost: 150, supplier: '' }
  ],
  'Beef Kare-Kare': [
    { name: 'Beef Chunks', qty20: 4, unit: 'kg', cost: 1800, supplier: 'MeatMasters Inc.' },
    { name: 'Peanut Sauce Mix', qty20: 1, unit: 'kg', cost: 400, supplier: 'General Wholesale' },
    { name: 'Native Vegetables', qty20: 2, unit: 'kg', cost: 300, supplier: 'Green Valley' }
  ],
  'Pork Sinigang': [
    { name: 'Pork Belly', qty20: 4, unit: 'kg', cost: 1400, supplier: 'MeatMasters Inc.' },
    { name: 'Sinigang Veggies', qty20: 2, unit: 'kg', cost: 300, supplier: 'Green Valley' }
  ]
};

function getIngredientsForDish(dishName, pax) {
  const recipe = RECIPE_DATA[dishName] || [
    { name: 'Standard Ingredients (Generic)', qty20: 1, unit: 'set', cost: 500, supplier: '' }
  ];
  const ratio = (parseInt(pax) || 20) / 20;
  return recipe.map(ing => ({
    ...ing,
    totalQty: (ing.qty20 * ratio).toFixed(2),
    totalCost: (ing.cost * ratio)
  }));
}

const PKGS = [
  {
    id: 'pkg-fiesta',
    name: "Halden's Grand Fiesta",
    pricingMode: 'tiered',
    priceTiers: [
      { pax: 50,  label: '50 Guests',  price: 50000  },
      { pax: 80,  label: '80 Guests',  price: 72000  },
      { pax: 100, label: '100 Guests', price: 88000  },
      { pax: 150, label: '150 Guests', price: 120000 },
      { pax: 200, label: '200 Guests', price: 150000 }
    ],
    desc: "A curated all-in Fiesta package — choose your pax tier for a fixed, all-inclusive price with no surprises. Ideal for birthdays and family celebrations.",
    theme: 'Festive / Filipino',
    occasion: 'Birthday',
    itemIds: ['f1','f4','f7','f10','f12','d1','d7','dr1','dr3','dc1','dc2','eq1','eq7','eq10','eq2','en3','en1'],
    items: ["Pork Belly Lechon","Lumpia Shanghai","Chicken Adobo","Pancit Bihon","Crispy Fried Chicken","Mango Bravo Cake","Halo-Halo Station","Soft Drinks Bar","Sago't Gulaman","Entrance Stylist Setup","Balloon Setup","Tiffany Chairs","Round Banquet Tables","Premium Utensils Set","Lights and Sound System","Party Host / Emcee","Photo Booth Setup"],
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5ac?auto=format&fit=crop&q=80&w=800',
    badge: 'Majorly Set',
    rating: 4.9,
    reviews: 38,
    pax: '50 - 200 pax'
  },
  {
    id: 'pkg-wedding',
    name: 'Royal Wedding Package',
    pricePerHead: 1200,
    desc: 'A complete, worry-free luxury wedding experience with premium catering and full service.',
    theme: 'Royal / Classic White',
    occasion: 'Wedding',
    itemIds: ['f1', 'f2', 'f6', 'f8', 'f15', 'd1', 'd7', 'dr4', 'dr5', 'dc1', 'dc3', 'eq1', 'eq7', 'eq10', 'eq2', 'ph2'],
    items: ['Pork Belly Lechon', 'Beef Caldereta', 'Seafood Paella', 'Beef Kare-Kare', 'Beef Pares', 'Mango Bravo Cake', 'Halo-Halo Station', 'Cucumber Lemonade', 'Brewed Coffee Station', 'Entrance Stylist Setup', 'Balloon Drops Ceiling', 'Tiffany Chairs', 'Round Banquet Tables', 'Premium Utensils', 'Lights and Sound System', 'Photo & Video Bundle'],
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
    items: ['Garlic Butter Chicken', 'Lumpia Shanghai', 'Pork Sinigang', 'Crispy Fried Chicken', 'Lechon Kawali', 'Leche Flan Tower', 'Buko Pandan Salad', 'Iced Tea & Lemonade', 'Sago\'t Gulaman', 'Entrance Stylist Setup', 'Table Centerpiece', 'Tiffany Chairs', 'Round Banquet Tables', 'Event Coordinator', 'Photo Booth Setup'],
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
    items: ['Filipino Style Spaghetti', 'Crispy Fried Chicken', 'Lumpia Shanghai', 'Pancit Bihon', 'Puto & Kutsinta', 'Soft Drinks Bar', 'Balloon Setup', 'Kids Magician', 'Party Host / Emcee', 'Photo Booth'],
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
    items: ['Beef Caldereta', 'Mixed Veggie Chopsuey', 'Beef Pares', 'Fried Chicken', 'Fresh Fruit Buffet', 'Brewed Coffee Station', 'Lights and Sound System', 'HD Projector & Screen', 'LED Stage Lights', 'Generator Set', 'Event Photography'],
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
    items: ['Classic Chicken Adobo', 'Pancit Bihon', 'Lumpia Shanghai', 'Crispy Fried Chicken', 'Bicol Express', 'Mango Bravo Cake', 'Iced Tea & Lemonade', 'Balloon Setup', 'Party Host / Emcee', 'Event Photography'],
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
    items: ['Seafood Paella', 'Beef Kare-Kare', 'Mango Bravo Cake', 'Cucumber Lemonade', 'Balloon Drops Ceiling', 'Event Coordinator'],
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800',
    badge: 'Intimate',
    rating: 4.9,
    reviews: 29,
    pax: '20 - 50 pax'
  }
];

// ===== AUTH GUARD =====
function checkAuth() {
  const logged = sessionStorage.getItem('halden_admin');
  if (!logged) { window.location.href = 'index.html'; return; }
  try {
    const u = JSON.parse(logged);
    document.getElementById('admin-name').textContent = u.name || 'Administrator';
  } catch (e) { }
}
function adminLogout() {
  sessionStorage.removeItem('halden_admin');
  window.location.href = 'index.html';
}
checkAuth();

// Set dashboard greeting and date
(function () {
  const h = new Date().getHours();
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const el = document.getElementById('dash-greeting');
  if (el) el.textContent = greeting + ', Admin ';
  document.getElementById('dash-date').textContent =
    "Here's what's happening with Halden's today — " +
    new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
})();

// ===== NAVIGATION =====
const SG_GROUPS = ['reservations', 'event-handling', 'equipment-inv', 'users', 'analytics', 'support'];
const SG_MAP = {
  dashboard: 'reservations', reservations: 'reservations', 'res-details': 'reservations',
  'activity-logs': 'reservations',
  events: 'event-handling', 'event-details': 'event-handling', seating: 'event-handling',
  equipment: 'equipment-inv', rentals: 'equipment-inv',
  availability: 'equipment-inv', 'routine-check': 'equipment-inv',
  allocation: 'equipment-inv', scheduling: 'equipment-inv',
  maintenance: 'equipment-inv', resupply: 'equipment-inv',
  disposed: 'equipment-inv',
  users: 'users',
  insights: 'analytics', chat: 'support', meetings: 'reservations'
};

function toggleSidebarGroup(group) {
  const content = document.getElementById('sg-' + group);
  const toggle = document.getElementById('sgt-' + group);
  if (!content) return;
  const isOpen = content.classList.contains('open');
  SG_GROUPS.forEach(g => {
    document.getElementById('sg-' + g)?.classList.remove('open');
    document.getElementById('sgt-' + g)?.classList.remove('open');
  });
  if (!isOpen) {
    content.classList.add('open');
    toggle?.classList.add('open');
  }
}

function openGroupFor(name) {
  const group = SG_MAP[name];
  if (!group) return;
  SG_GROUPS.forEach(g => {
    document.getElementById('sg-' + g)?.classList.remove('open');
    document.getElementById('sgt-' + g)?.classList.remove('open');
  });
  document.getElementById('sg-' + group)?.classList.add('open');
  document.getElementById('sgt-' + group)?.classList.add('open');
}

function showSection(name, el) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById('section-' + name);
  if (sec) sec.classList.add('active');
  if (el) el.classList.add('active');
  openGroupFor(name);

  if (name === 'dashboard') {
    setTimeout(() => { if (window.dashCalendar) window.dashCalendar.render(); }, 10);
  }
  if (name === 'events' && window.calendar) {
    setTimeout(() => window.calendar.render(), 10);
  }
  if (name === 'chat') initAdminChat();
  if (name === 'reservations') {
    renderReservations(currentFilter);
    renderReservationDetailsHandling();
  }
  if (name === 'res-details') renderReservationDetailsHandling();
  if (name === 'execution-day') renderExecutionDayReservations();
  if (name === 'activity-logs') renderActivityLogsSection();
  if (name === 'seating') renderSeating();
  if (name === 'equipment') renderEIMTable();
  if (name === 'rentals') renderRentalCards();
  if (name === 'allocation') renderAllocationSection();
  if (name === 'scheduling') renderSchedulingSection();
  if (name === 'availability') renderAvailabilitySection();
  if (name === 'routine-check') renderRoutineCheckSection();
  if (name === 'lifecycle') renderLifecycleSection();
  if (name === 'equip-cycle') {
    if (typeof populateEqcDropdown === 'function') populateEqcDropdown();
    if (!currentEqcReservationId) {
      const sel = document.getElementById('eqc-reservation-select');
      if (sel && sel.options.length > 1) {
        sel.selectedIndex = 1;
        if (typeof onEqcReservationChange === 'function') onEqcReservationChange();
      }
    } else {
      if (typeof onEqcReservationChange === 'function') onEqcReservationChange();
    }
  }
  if (name === 'equip-issues') renderEquipIssues();
  if (name === 'resupply') renderResupplySection();
  if (name === 'maintenance') renderMaintenanceSection();
  if (name === 'disposed') renderDisposedSection();
  if (name === 'meetings') renderMeetingsSection();
  if (name === 'insights') renderInsights();
  if (name === 'users') renderUsersSection();
}
window.toggleSidebarGroup = toggleSidebarGroup;

// ===== LIVE DATA =====
let RESERVATIONS = [];
let activeResDetailId = null;
let resDetailMode = 'view';
let reservationExtraDetails = {};
let resDetailsActiveTab = 'details';
let resTimelineCalendar = null;
let resExecMap = null;
let resExecAdminMarker = null;
let resExecVenueMarker = null;
let resExecRouteLayer = null;
let resExecWatchId = null;
let resExecLastFix = null;
let resExecLastRouteAt = 0;
window.executionDayOverrides = window.executionDayOverrides || {};
window.reservationLifecycleLogs = window.reservationLifecycleLogs || {};
let activeActivityLogResId = null;

// ===== USER MANAGEMENT DATA =====
let USERS = [];
let CUSTOMERS = [];
let currentUserTab = 'staff';
let selectedUserId = null;

const ACTIVITY = [
  { dot: 'green', title: 'Santos reservation confirmed', sub: 'Payment received — ₱85,000', time: '2h ago' },
  { dot: 'amber', title: 'Rental equipment arrived', sub: '3× Crystal Chandeliers from Lumina', time: '5h ago' },
  { dot: 'gold', title: 'New reservation submitted', sub: 'Cruz Corporate — awaiting approval', time: 'Yesterday' },
  { dot: 'green', title: 'Equipment returned on time', sub: 'Photo booth set — fully intact', time: '2 days ago' },
];

// ===== LOAD FROM FIRESTORE =====
async function loadData() {
  document.getElementById('res-tbody').innerHTML = `
    <tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-dim);">Loading reservations...</td></tr>`;
  try {
    const { collection, getDocs } = window.firebaseFns;
    const db = window.firebaseDB;
    const resSnap = await getDocs(collection(db, 'reservations'));
    RESERVATIONS = resSnap.docs.map(d => {
      const data = d.id === 'demo-res-123' ? d.data() : { ...d.data(), id: d.id };
      // Ensure date is a string
      if (data.date && typeof data.date !== 'string') {
        if (data.date.toDate) data.date = data.date.toDate().toISOString().split('T')[0];
        else data.date = new Date(data.date).toISOString().split('T')[0];
      }
      return data;
    });

    RESERVATIONS.forEach(r => {
      let amt = r.amount;
      if (typeof amt === 'string') amt = parseFloat(amt.replace(/[^\d.]/g, '')) || 0;
      if (typeof amt === 'number' && !isNaN(amt)) {
        r.displayAmount = '₱' + amt.toLocaleString();
      } else {
        r.displayAmount = r.amount || '₱0';
      }
    });
    RESERVATIONS.sort((a, b) => {
      const order = { pending: 0, confirmed: 1, cancelled: 2 };
      return (order[a.status] ?? 3) - (order[b.status] ?? 3);
    });
    renderDashboard();
    renderReservations();
    renderEvents();
    renderInsights();
    renderSeasonForecastBanner();
    renderMeetingsSection();
    renderReservationDetailsHandling();
    renderActivityLogsSection();
    fetchStaff();
  } catch (err) {
    console.error('Firestore load error:', err);
    document.getElementById('res-tbody').innerHTML = `
      <tr><td colspan="7" style="text-align:center;padding:24px;color:var(--red);"> Failed to load. Check Firebase connection.</td></tr>`;
  }
}

// ===== FETCH STAFF FROM FIRESTORE =====
async function fetchStaff() {
  const { collection, getDocs, query, where } = window.firebaseFns;
  const db = window.firebaseDB;
  if (!db) return;

  try {
    // Fetch all users who are NOT customers
    const q = query(collection(db, 'users'), where('role', '!=', 'customer'));
    const snap = await getDocs(q);
    USERS = [];
    snap.forEach(doc => {
      const data = doc.data();
      let lastLoginStr = 'Never';
      if (data.lastLogin) {
        const d = data.lastLogin.toDate ? data.lastLogin.toDate() : new Date(data.lastLogin);
        lastLoginStr = d.toLocaleString();
      }

      USERS.push({
        id: doc.id,
        name: data.name || 'No Name',
        email: data.email || 'No Email',
        role: data.role || 'Staff',
        status: data.status || 'Active',
        lastLogin: lastLoginStr
      });
    });
    // Filter specifically for staff if needed, or show all system accounts
    // The user said: "if the role is labeled as 'staff' then it will show up there"
    // So we'll keep all non-customers in USERS, but we can filter in render if necessary.
    if (currentUserTab === 'staff') renderUsersSection();
  } catch (err) {
    console.error('Error fetching staff:', err);
  }
}

// Helper to count reservations on a date (confirmed/pending)
function getOverbookingCount(dateStr) {
  if (!dateStr) return 0;
  return RESERVATIONS.filter(r => r.date === dateStr && (r.status === 'confirmed' || r.status === 'pending')).length;
}

// ===== UPDATE RESERVATION STATUS =====
async function updateReservationStatus(id, newStatus, reason = null) {
  try {
    const { doc, updateDoc } = window.firebaseFns;
    const upd = { status: newStatus };
    if (reason) upd.rejectionReason = reason;

    await updateDoc(doc(window.firebaseDB, 'reservations', id), upd);
    const res = RESERVATIONS.find(r => r.id === id);
    if (res) {
      res.status = newStatus;
      if (reason) res.rejectionReason = reason;
    }
    renderReservations(currentFilter);
    renderReservationDetailsHandling();
    renderDashboard();
    renderEvents();
    
    // Auto-redirect to meeting hub on approval
    if (newStatus === 'confirmed') {
      setTimeout(() => {
        closeEventDetails();
        const mtNavBtn = document.getElementById('nav-meetings');
        if (mtNavBtn && typeof showSection === 'function') {
          showSection('meetings', mtNavBtn);
        }
        openMtModal(id);
      }, 300);
    }
  } catch (err) {
    alert('Failed to update reservation. Please try again.');
    console.error('Update Error:', err);
    console.error('Failed ID:', id);
    console.error('Failed Data:', upd);
  }
}

// Rejection Flow
let activeRejectId = null;
function initiateRejection(id, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const modal = document.getElementById('reject-modal');
  const overlay = document.getElementById('reject-overlay');
  const textarea = document.getElementById('reject-reason-text');

  if (!modal || !overlay) {
    console.error('Rejection modal elements missing from DOM');
    return;
  }

  activeRejectId = id;
  if (textarea) textarea.value = '';
  overlay.classList.add('on');
  modal.classList.add('open');
}
function closeRejectModal() {
  const modal = document.getElementById('reject-modal');
  const overlay = document.getElementById('reject-overlay');
  if (overlay) overlay.classList.remove('on');
  if (modal) modal.classList.remove('open');
  activeRejectId = null;
}
function confirmRejection() {
  const textarea = document.getElementById('reject-reason-text');
  if (!textarea) return;
  const reason = textarea.value.trim();
  if (!reason) { alert('Please enter a reason for rejection.'); return; }
  updateReservationStatus(activeRejectId, 'cancelled', reason);
  closeRejectModal();
}

// Approval Flow
let activeApproveId = null;
function initiateApproval(id, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const res = RESERVATIONS.find(r => r.id === id);
  if (!res) return;

  activeApproveId = id;
  const obCount = getOverbookingCount(res.date);

  if (obCount >= 3) {
    document.getElementById('approve-warn-msg').textContent = `Warning: There are already ${obCount} reservations for ${res.date}. Approving this will exceed the recommended daily limit of 3.`;
    document.getElementById('approve-warn-overlay').classList.add('on');
    document.getElementById('approve-warn-modal').classList.add('open');
  } else {
    updateReservationStatus(id, 'confirmed');
  }
}
function closeApproveModal() {
  document.getElementById('approve-warn-overlay').classList.remove('on');
  document.getElementById('approve-warn-modal').classList.remove('open');
  activeApproveId = null;
}
function confirmApproval() {
  if (!activeApproveId) return;
  updateReservationStatus(activeApproveId, 'confirmed');
  closeApproveModal();
}

window.initiateRejection = initiateRejection;
window.closeRejectModal = closeRejectModal;
window.initiateApproval = initiateApproval;
window.closeApproveModal = closeApproveModal;
window.confirmApproval = confirmApproval;
// ===== MEETINGS SYSTEM =====
let MEETINGS = [];
let mtCalendar = null;
let activeMtId = null;
let activeMtResId = null;
let mtFileToUpload = null;
let selectedMtFilters = ['All'];

const MANDATORY_TOPICS = [
  'Contract finalization',
  'Food tasting',
  'Additional reservation discussion',

  'Final program rundown',
  'Design and decorations to be selected'
];

function toggleMtFilter(topic, btn) {
  if (topic === 'All') {
    selectedMtFilters = ['All'];
  } else {
    // Remove 'All' if it exists
    selectedMtFilters = selectedMtFilters.filter(f => f !== 'All');

    if (selectedMtFilters.includes(topic)) {
      selectedMtFilters = selectedMtFilters.filter(f => f !== topic);
    } else {
      selectedMtFilters.push(topic);
    }

    if (selectedMtFilters.length === 0) selectedMtFilters = ['All'];
  }

  // Update UI chips
  const container = document.getElementById('mt-filter-container');
  if (container) {
    const chips = container.querySelectorAll('.chip');
    chips.forEach(chip => {
      const chipTopic = chip.getAttribute('onclick').match(/'([^']+)'/)[1];
      if (selectedMtFilters.includes(chipTopic)) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  renderPendingMeetings();
}

async function renderMeetingsSection() {
  if (document.getElementById('section-meetings')?.classList.contains('active')) {
    renderPendingMeetings();
    renderWeeklyMeetings();
    initMtCalendar();
  }
}

function renderPendingMeetings() {
  const container = document.getElementById('mt-pending-list');
  if (!container) return;

  const eligible = RESERVATIONS.filter(r => {
    // Must be confirmed or preparing
    if (r.status !== 'confirmed' && r.status !== 'preparing') return false;

    const concludedRaw = String(r['mandatory-meeting concluded'] || 'none').toLowerCase();
    if (concludedRaw === 'done') return false;

    // Filter logic: Show if reservation lacks ALL selected topics
    // If "All" is selected, show if it lacks ANY of the mandatory topics (which we already know because it's not 'done')
    if (selectedMtFilters.includes('All')) {
      return true; // It's eligible if it's not 'done'
    }

    // Check if it's missing EVERY topic in selectedMtFilters
    const missingAllSelected = selectedMtFilters.every(filterTopic => {
      return !concludedRaw.includes(filterTopic.toLowerCase());
    });

    return missingAllSelected;
  });

  if (eligible.length === 0) {
    container.innerHTML = '<div style="padding:40px; text-align:center; color:var(--text-dim); font-size:13px;">No reservations found matching the selected missing topics.</div>';
    return;
  }

  container.innerHTML = eligible.map(r => {
    const concludedStr = String(r['mandatory-meeting concluded'] || 'none').toLowerCase();
    const missing = MANDATORY_TOPICS.filter(t => !concludedStr.includes(t.toLowerCase()));

    return `
      <div class="mt-pending-item">
        <div class="mt-res-info-mini">
          <div class="mt-cl-name">${r.client || 'Unnamed Client'}</div>
          <div class="mt-ev-type">${r.type || 'Event'} — ${r.date || 'No Date'}</div>
          <div style="font-size:9px; color:var(--text-dim); margin-top:4px;">
            Missing: ${missing.length > 3 ? missing.length + ' topics' : missing.join(', ')}
          </div>
        </div>
        <button class="btn-primary" style="padding:6px 14px; font-size:11px;" onclick="openMtModal('${r.id}')">Schedule</button>
      </div>`;
  }).join('');
}

async function renderWeeklyMeetings() {
  const container = document.getElementById('mt-weekly-list');
  if (!container) return;

  try {
    const { collection, getDocs } = window.firebaseFns;
    const snap = await getDocs(collection(window.firebaseDB, 'meetings'));

    // Get current week boundaries
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    endOfWeek.setHours(23, 59, 59, 999);

    const weeklyMeetings = [];
    snap.docs.forEach(doc => {
      const data = doc.data();
      const mtDate = new Date(data.date);
      if (mtDate >= startOfWeek && mtDate <= endOfWeek) {
        weeklyMeetings.push({ id: doc.id, ...data });
      }
    });

    // Sort by date/time
    weeklyMeetings.sort((a, b) => new Date(a.date + 'T' + (a.time || '00:00')) - new Date(b.date + 'T' + (b.time || '00:00')));

    if (weeklyMeetings.length === 0) {
      container.innerHTML = '<div style="padding:40px; text-align:center; color:var(--text-dim); font-size:13px;">No meetings scheduled for this week.</div>';
      return;
    }

    container.innerHTML = weeklyMeetings.map(mt => `
      <div class="mt-pending-item" style="border-left: 3px solid ${mt.status === 'approved' ? 'var(--green)' : (mt.status === 'cancelled' ? 'var(--red)' : 'var(--gold)')};">
        <div class="mt-res-info-mini">
          <div class="mt-cl-name">${mt.clientName} <span style="font-size:10px; color:var(--text-dim);">(${mt.status || 'pending'})</span></div>
          <div class="mt-ev-type">${mt.date} @ ${mt.time || ''}</div>
        </div>
      </div>
    `).join('');

  } catch (e) {
    console.error("Failed to load weekly meetings", e);
  }
}

function initMtCalendar() {
  const el = document.getElementById('mt-calendar');
  if (!el || mtCalendar) {
    if (mtCalendar) mtCalendar.render();
    return;
  }

  mtCalendar = new FullCalendar.Calendar(el, {
    initialView: 'dayGridMonth',
    headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' },
    themeSystem: 'standard',
    events: async function (info, successCallback, failureCallback) {
      try {
        const { collection, getDocs, query, where } = window.firebaseFns;
        const snap = await getDocs(collection(window.firebaseDB, 'meetings'));
        const events = snap.docs.map(doc => {
          const data = doc.data();
          const isToday = data.date === new Date().toISOString().split('T')[0];
          return {
            id: doc.id,
            title: `${data.agenda} - ${data.clientName}`,
            start: `${data.date}T${data.time || '10:00:00'}`,
            extendedProps: data,
            color: isToday ? 'var(--gold)' : 'rgba(196,154,60,0.3)',
            textColor: '#fff'
          };
        });
        successCallback(events);
      } catch (e) { failureCallback(e); }
    },
    eventClick: function (info) {
      const data = info.event.extendedProps;
      const eventDate = data.date;
      const today = new Date().toISOString().split('T')[0];

      if (data.status === 'approved' && eventDate === today) {
        initiateMeetingMode(info.event.id);
      } else {
        openMtDetailsModal(info.event.id);
      }
    }
  });
  mtCalendar.render();
}

function toggleCustomTimeFields() {
  const isCustom = document.getElementById('mt-custom-time-radio')?.checked;
  const fields = document.getElementById('mt-custom-time-fields');
  if (fields) fields.style.display = isCustom ? 'block' : 'none';
}
window.toggleCustomTimeFields = toggleCustomTimeFields;

function toggleVideoCallCb() {
  const cfCb = document.querySelector('input[value="Contract finalization"]');
  const ftCb = document.querySelector('input[value="Food tasting"]');
  const isContractFinalization = cfCb ? cfCb.checked : false;
  const isFoodTasting = ftCb ? ftCb.checked : false;
  const videoCb = document.getElementById('mt-video-call-cb');
  const videoGroup = document.getElementById('mt-video-conf-group');
  
  if (videoCb && videoGroup) {
    if (isContractFinalization || isFoodTasting) {
      videoCb.checked = false;
      videoCb.disabled = true;
      videoGroup.style.opacity = '0.5';
      videoGroup.style.pointerEvents = 'none';
      videoGroup.title = "Not available for face-to-face agendas (Contract Finalization / Food Tasting)";
    } else {
      videoCb.disabled = false;
      videoGroup.style.opacity = '1';
      videoGroup.style.pointerEvents = 'auto';
      videoGroup.title = "";
    }
  }
}
window.toggleVideoCallCb = toggleVideoCallCb;

function openMtModal(resId, mtId = null) {
  activeMtResId = resId;
  activeMtId = mtId;
  const res = RESERVATIONS.find(r => r.id === resId);
  if (!res && !mtId) return;

  document.getElementById('mt-chat-title').textContent = `Chat with ${(res && res.client) ? res.client : 'Client'}`;
  document.getElementById('mt-overlay').classList.add('on');
  document.getElementById('mt-modal').classList.add('open');

  // Clear modal inputs
  const dateEl = document.getElementById('mt-input-date');
  if (dateEl) dateEl.value = '';
  const startEl = document.getElementById('mt-input-time-start');
  if (startEl) startEl.value = '';
  const endEl = document.getElementById('mt-input-time-end');
  if (endEl) endEl.value = '';
  const reasonEl = document.getElementById('mt-input-reasoning');
  if (reasonEl) reasonEl.value = '';
  const otherAgendaEl = document.getElementById('mt-input-agenda-other');
  if (otherAgendaEl) otherAgendaEl.value = '';

  document.querySelectorAll('.mt-agenda-cb').forEach(cb => {
    cb.checked = false;
    cb.addEventListener('change', toggleVideoCallCb);
  });
  
  const videoCb = document.getElementById('mt-video-call-cb');
  if (videoCb) videoCb.checked = false;

  // Auto-check contract finalization if new meeting
  if (!mtId) {
    const cfCb = document.querySelector('input[value="Contract finalization"]');
    if (cfCb) cfCb.checked = true;
  }
  toggleVideoCallCb();

  // Render proposed times if reservation exists
  const proposedContainer = document.getElementById('mt-proposed-times');
  if (proposedContainer && res) {
    if (res.proposedMeetingTimes && res.proposedMeetingTimes.length > 0) {
      proposedContainer.innerHTML = res.proposedMeetingTimes.map((mt, idx) => `
        <label style="display:flex; align-items:center; gap:8px; font-size:12px; margin-bottom:5px; cursor:pointer;">
          <input type="radio" name="mt_time_selection" value='${idx}' onchange="toggleCustomTimeFields()"/>
          ${mt.date} (${mt.start} - ${mt.end})
        </label>
      `).join('');
    } else {
      proposedContainer.innerHTML = `<div style="font-size:11px; color:var(--text-dim); font-style:italic; margin-bottom:10px;">No proposed times from customer.</div>`;
    }
  }

  // Select custom by default if no proposed times
  if (!res || !res.proposedMeetingTimes || res.proposedMeetingTimes.length === 0) {
    const customRadio = document.getElementById('mt-custom-time-radio');
    if (customRadio) customRadio.checked = true;
  } else {
    // Auto-select nearest time if new meeting
    if (!mtId) {
      let nearestIdx = 0;
      let minDiff = Infinity;
      const now = Date.now();
      res.proposedMeetingTimes.forEach((mt, idx) => {
        const mtDateObj = new Date(mt.date + 'T' + mt.start);
        if (!isNaN(mtDateObj.getTime())) {
          const diff = Math.abs(mtDateObj.getTime() - now);
          if (diff < minDiff) { minDiff = diff; nearestIdx = idx; }
        }
      });
      const radioToSelect = document.querySelector(`input[name="mt_time_selection"][value="${nearestIdx}"]`);
      if (radioToSelect) radioToSelect.checked = true;
    } else {
      const firstRadio = document.querySelector('input[name="mt_time_selection"]');
      if (firstRadio) firstRadio.checked = true;
    }
  }
  toggleCustomTimeFields();

  clearMtFile();

  if (mtId) {
    loadMeetingToForm(mtId);
  }

  if (res) initMtChat(res.id, res.client);
}

function closeMtModal() {
  document.getElementById('mt-overlay').classList.remove('on');
  document.getElementById('mt-modal').classList.remove('open');
  if (window.activeMtChatUnsub) {
    window.activeMtChatUnsub();
    window.activeMtChatUnsub = null;
  }
  activeMtResId = null;
  activeMtId = null;
}

let activeDetailsMtId = null;

function openMtDetailsModal(meetingId) {
  activeDetailsMtId = meetingId;
  const { doc, getDoc } = window.firebaseFns;
  getDoc(doc(window.firebaseDB, 'meetings', meetingId)).then(snap => {
    if (!snap.exists()) return;
    const mt = snap.data();
    const idEl = document.getElementById('mtd-id');
    if (idEl) idEl.value = meetingId;
    const infoEl = document.getElementById('mtd-info-text');
    if (infoEl) {
      infoEl.innerHTML = `
        <strong>Client:</strong> ${mt.clientName}<br/>
        <strong>Status:</strong> <span style="text-transform:uppercase; font-weight:bold;">${mt.status}</span><br/>
        <strong>Time Type:</strong> ${mt.timeType === 'custom' ? 'Custom Admin Schedule' : 'Customer Proposed'} <br/>
        ${mt.reasoning ? `<em>Note: ${mt.reasoning}</em>` : ''}
      `;
    }
    const dateEl = document.getElementById('mtd-date');
    if (dateEl) dateEl.value = mt.date || '';
    const startEl = document.getElementById('mtd-time-start');
    if (startEl) startEl.value = mt.time || '';
    const endEl = document.getElementById('mtd-time-end');
    if (endEl) endEl.value = mt.timeEnd || '';
    const agendasEl = document.getElementById('mtd-agendas');
    if (agendasEl) agendasEl.value = mt.agenda || '';
    
    const videoBtnContainer = document.getElementById('mtd-video-btn-container');
    const roomIdEl = document.getElementById('mtd-video-room-id');
    if (videoBtnContainer && roomIdEl) {
      if (mt.roomId) {
        roomIdEl.textContent = mt.roomId;
        videoBtnContainer.style.display = 'block';
        videoBtnContainer.dataset.roomId = mt.roomId;
      } else {
        videoBtnContainer.style.display = 'none';
        videoBtnContainer.dataset.roomId = '';
      }
    }

    document.getElementById('mt-overlay').classList.add('on');
    document.getElementById('mt-details-modal').classList.add('open');
  });
}
window.openMtDetailsModal = openMtDetailsModal;

function closeMtDetailsModal() {
  document.getElementById('mt-overlay').classList.remove('on');
  document.getElementById('mt-details-modal').classList.remove('open');
  activeDetailsMtId = null;
}
window.closeMtDetailsModal = closeMtDetailsModal;

async function modifyMeeting() {
  if (!activeDetailsMtId) return;
  const date = document.getElementById('mtd-date').value;
  const time = document.getElementById('mtd-time-start').value;
  const timeEnd = document.getElementById('mtd-time-end').value;
  const agenda = document.getElementById('mtd-agendas').value;

  if (!date || !time) { alert("Date and start time required."); return; }

  try {
    const { updateDoc, doc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'meetings', activeDetailsMtId), {
      date, time, timeEnd, agenda, updatedAt: new Date().toISOString()
    });
    alert('Meeting modified successfully.');
    closeMtDetailsModal();
    if (mtCalendar) mtCalendar.refetchEvents();
    renderWeeklyMeetings();
  } catch (e) {
    console.error(e);
    alert('Modification failed.');
  }
}
window.modifyMeeting = modifyMeeting;

async function cancelMeeting() {
  if (!activeDetailsMtId) return;
  if (!confirm("Are you sure you want to cancel this meeting?")) return;

  try {
    const { updateDoc, doc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'meetings', activeDetailsMtId), {
      status: 'cancelled', updatedAt: new Date().toISOString()
    });
    alert('Meeting cancelled.');
    closeMtDetailsModal();
    if (mtCalendar) mtCalendar.refetchEvents();
    renderWeeklyMeetings();
  } catch (e) {
    console.error(e);
    alert('Cancellation failed.');
  }
}
window.cancelMeeting = cancelMeeting;

// Simulated Cloudinary Upload
const CLOUDINARY_CLOUD_NAME = 'dg8ytmck5';
const CLOUDINARY_UPLOAD_PRESET = 'test_default';
let mtUploadedUrls = []; // Refactored to support multiple uploads

async function handleMtFileUpload(e) {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  // We'll upload each file immediately
  for (const file of files) {
    await uploadMtFile(file);
  }
  
  // Clear input so same file can be uploaded again if removed
  e.target.value = '';
}

async function uploadMtFile(file) {
  const progressWrap = document.getElementById('mt-cl-progress-wrap');
  const progressBar = document.getElementById('mt-cl-progress-bar');
  const progressPct = document.getElementById('mt-cl-progress-pct');
  const progressText = document.getElementById('mt-cl-progress-text');
  const dropZone = document.getElementById('mt-cl-drop-zone');

  dropZone.style.display = 'none';
  progressWrap.classList.add('on');
  progressBar.style.width = '0%';
  progressPct.textContent = '0%';
  progressText.textContent = 'Uploading ' + file.name + '...';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;

  try {
    const data = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);

      xhr.upload.addEventListener('progress', event => {
        if (event.lengthComputable) {
          const pct = Math.round((event.loaded / event.total) * 100);
          progressBar.style.width = pct + '%';
          progressPct.textContent = pct + '%';
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error('Upload failed'));
        }
      });
      xhr.addEventListener('error', () => reject(new Error('Network error')));
      xhr.send(formData);
    });

    mtUploadedUrls.push({
      url: data.secure_url,
      name: file.name,
      type: file.type
    });

    // Persist all uploaded docs to Firestore so customer can view in real-time
    if (activeMeeting && activeMeeting.id && activeMeeting.id !== 'demo') {
      try {
        const { doc: _fd, updateDoc: _fu } = window.firebaseFns;
        const syncDocs = mtUploadedUrls.map(f => ({ url: f.url, name: f.name, type: f.type }));
        _fu(_fd(window.firebaseDB, 'meetings', activeMeeting.id), { sharedDocuments: syncDocs }).catch(e => console.warn('Doc sync failed:', e));
      } catch(syncErr) { console.warn('Doc sync error:', syncErr); }
    }
    
    progressWrap.classList.remove('on');
    dropZone.style.display = 'block';
    renderMtUploadList();
  } catch (err) {
    alert('Upload failed: ' + err.message);
    dropZone.style.display = 'block';
    progressWrap.classList.remove('on');
  }
}

function renderMtUploadList() {
  const list = document.getElementById('mt-upload-list');
  if (!list) return;

  if (mtUploadedUrls.length === 0) {
    list.innerHTML = '';
    return;
  }

  list.innerHTML = mtUploadedUrls.map((file, idx) => {
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImg = file.type && file.type.startsWith('image/');
    let previewHtml = '';

    if (isImg || isPDF) {
      const displayUrl = isPDF ? file.url.replace('/upload/', '/upload/pg_1,f_jpg,w_400,c_limit/') : file.url;
      previewHtml = `<img src="${displayUrl}" style="width:60px; height:60px; object-fit:cover; border-radius:4px; border:1px solid var(--border);" />`;
    } else {
      previewHtml = `<div style="width:60px; height:60px; background:var(--bg3); display:flex; align-items:center; justify-content:center; font-size:24px; border-radius:4px;"></div>`;
    }

    return `
      <div class="cl-viewer-wrap on" style="margin-bottom:0; border:1px solid var(--border); background:var(--bg3);">
        <div class="cl-viewer-header" style="padding:8px 12px;">
          <span class="cl-viewer-title" style="font-size:12px;">${file.name}</span>
          <button class="btn-outline" style="font-size:10px; padding:2px 6px; color:var(--red); border-color:rgba(192,57,43,0.2);" onclick="removeMtFile(${idx})">✕ Remove</button>
        </div>
        <div style="padding:10px; display:flex; align-items:center; gap:12px;">
          ${previewHtml}
          <div style="flex:1;">
             <a href="${file.url}" target="_blank" style="font-size:11px; color:var(--gold); text-decoration:none;">View Full Document </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function removeMtFile(idx) {
  mtUploadedUrls.splice(idx, 1);
  renderMtUploadList();
}

function clearMtFile() {
  mtUploadedUrls = [];
  renderMtUploadList();
}

async function saveMeeting() {
  let selectedTime = null;
  const customRadio = document.getElementById('mt-custom-time-radio');

  if (customRadio && customRadio.checked) {
    const date = document.getElementById('mt-input-date').value;
    const start = document.getElementById('mt-input-time-start').value;
    const end = document.getElementById('mt-input-time-end').value;
    const reasoning = document.getElementById('mt-input-reasoning').value;
    if (!date || !start) { alert("Please select a date and start time for the custom schedule."); return; }
    selectedTime = { date, start, end, reasoning, type: 'custom' };
  } else {
    const selectedRadio = document.querySelector('input[name="mt_time_selection"]:checked');
    if (!selectedRadio) { alert("Please select a proposed time or schedule your own."); return; }
    const idx = parseInt(selectedRadio.value);
    const res = RESERVATIONS.find(r => r.id === activeMtResId);
    selectedTime = Object.assign({}, res.proposedMeetingTimes[idx]);
    selectedTime.type = 'proposed';
  }

  const agendas = Array.from(document.querySelectorAll('.mt-agenda-cb:checked')).map(cb => cb.value);
  const otherAgenda = document.getElementById('mt-input-agenda-other').value.trim();
  if (otherAgenda) agendas.push(otherAgenda);

  if (agendas.length === 0) { alert("Please select at least one agenda."); return; }

  const res = RESERVATIONS.find(r => r.id === activeMtResId);

  try {
    const { collection, addDoc, updateDoc, doc } = window.firebaseFns;
    const db = window.firebaseDB;

    const mtData = {
      reservationId: activeMtResId,
      clientId: res.clientId || 'unknown',
      clientName: res.client,
      date: selectedTime.date,
      time: selectedTime.start,
      timeEnd: selectedTime.end || '',
      reasoning: selectedTime.reasoning || '',
      timeType: selectedTime.type,
      agenda: agendas.join(', '),
      status: 'pending_customer_approval',
      roomId: null,
      updatedAt: new Date().toISOString()
    };

    const videoCb = document.getElementById('mt-video-call-cb');
    if (videoCb && videoCb.checked && !videoCb.disabled) {
      mtData.roomId = 'VC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    if (activeMtId) {
      await updateDoc(doc(db, 'meetings', activeMtId), mtData);
    } else {
      await addDoc(collection(db, 'meetings'), {
        ...mtData,
        createdAt: new Date().toISOString()
      });
      // also mark the reservation as meeting scheduled (in terms of mandatory tracking)
      // For now we just create the meeting.
    }

    alert('Meeting details saved! Customer will be notified to approve within 24 hours.');
    closeMtModal();
    if (mtCalendar) mtCalendar.refetchEvents();
    renderPendingMeetings();
    renderWeeklyMeetings();
  } catch (e) {
    console.error(e);
    alert('Saving failed.');
  }
}

async function forceMeetingMode() {
  // Demo Mode: Bypassing Firestore requirement to ensure it "always works" for the user.
  // We simulate a robust meeting session with mock details.
  console.log("Demo Mode: Launching simulated meeting session...");
  initiateMeetingMode('demo');
}

async function loadMeetingToForm(mtId) {
  try {
    const { doc, getDoc } = window.firebaseFns;
    const snap = await getDoc(doc(window.firebaseDB, 'meetings', mtId));
    if (!snap.exists()) return;
    const mt = snap.data();
    activeMtId = mtId;
    activeMtResId = mt.reservationId || activeMtResId;

    const dateEl = document.getElementById('mt-input-date');
    const timeEl = document.getElementById('mt-input-time');
    const agendaEl = document.getElementById('mt-input-agenda');
    if (dateEl) dateEl.value = mt.date || '';
    if (timeEl) timeEl.value = mt.time || '';
    if (agendaEl) agendaEl.value = mt.agenda || 'Initial Consultation';

    const linkedRes = RESERVATIONS.find(r => r.id === activeMtResId);
    if (linkedRes) {
      document.getElementById('mt-chat-title').textContent = `Chat with ${linkedRes.client}`;
      initMtChat(linkedRes.id, linkedRes.client);
    } else if (mt.clientName) {
      document.getElementById('mt-chat-title').textContent = `Chat with ${mt.clientName}`;
    }
  } catch (e) {
    console.error('Failed to load meeting details:', e);
  }
}

// MEETING MODE LOGIC
let activeMeeting = null;

async function initiateMeetingMode(mtId) {
  clearMtFile();
  mtModifyMode = false;
  try {
    let res;
    if (mtId === 'demo') {
      activeMeeting = {
        id: 'demo',
        reservationId: 'demo-res-123',
        clientName: 'Julianne Cruz (VIP Demo)',
        agenda: 'Contract Finalization, Food Tasting, Venue Layout',
        date: new Date().toISOString().split('T')[0],
        time: '02:30 PM',
        status: 'scheduled'
      };
      res = {
        id: 'demo-res-123',
        client: 'Julianne Cruz',
        type: 'Grand Wedding Reception',
        date: '2026-06-15',
        pax: 250,
        packageName: 'Diamond Royale Package',
        packageItems: ['Prime Rib Buffet', 'Open Bar (Premium)', 'Floor-to-Ceiling Floral Decor', '8-piece String Ensemble', 'Multi-tier Custom Cake']
      };
    } else {
      const { doc, getDoc } = window.firebaseFns;
      const snap = await getDoc(doc(window.firebaseDB, 'meetings', mtId));
      if (!snap.exists()) return;
      
      activeMeeting = { id: snap.id, ...snap.data() };
      const resId = activeMeeting.reservationId;
      res = RESERVATIONS.find(r => r.id === resId);
      if (!res && resId) {
        const rSnap = await getDoc(doc(window.firebaseDB, 'reservations', resId));
        if (rSnap.exists()) { res = { id: rSnap.id, ...rSnap.data() }; RESERVATIONS.push(res); }
      }

      // Force status to 'live' and ensure identification fields are present for customer sync
      const { updateDoc } = window.firebaseFns;
      const syncData = { status: 'live' };
      
      // Ensure the meeting has both name and email for the customer listener to pick up
      if (res) {
        if (res.customerEmail || res.email) syncData.customerEmail = res.customerEmail || res.email;
        if (res.customerName || res.client) syncData.customerName = res.customerName || res.client;
      }
      
      console.log("Broadcasting Live Meeting Status for MT:", mtId, syncData);
      updateDoc(doc(window.firebaseDB, 'meetings', mtId), syncData).catch(e => console.error("Live sync failed:", e));
    }

    if (!res) {
      alert("Linked reservation not found.");
      return;
    }

    activeResDetailId = res.id;
    activeMeetingResCache = res;
    mtPax = parseInt(res.pax) || 0;
    // mtDate needs to be YYYY-MM-DD for <input type="date">
    mtDate = normalizeDateKey(res.date) || '';

    // Handle time range
    if (res.time && res.time.includes('-')) {
      const parts = res.time.split('-').map(p => p.trim());
      mtTimeStart = parts[0];
      mtTimeEnd = parts[1];
    } else {
      mtTimeStart = res.time || '';
      mtTimeEnd = '';
    }

    mtType = res.type || '';
    mtTheme = res.theme || '';
    mtVip = parseInt(res.vipCount || res.vip) || 0;
    mtVenue = res.venue || '';
    mtVenueAddr = res.venueAddr || res.venue || '';
    mtNotes = res.notes || '';
    mtCustomPkgItems = [];
    (res.packageItems || []).forEach(name => {
      const found = CAT.find(c => c.name === name);
      if (found) mtCustomPkgItems.push(Object.assign({}, found));
      else mtCustomPkgItems.push({ id: 'custom-' + Math.random(), name: name, cat: 'other', price: 0 });
    });

    document.getElementById('mt-mode-subtitle').textContent = `${activeMeeting.agenda || 'Meeting'} with ${res.client}`;

    // ===== MEETING ROOM ID (MTG-) — SmartServe Hub Join =====
    if (mtId === 'demo') {
      activeMeeting.meetingRoomId = activeMeeting.meetingRoomId || 'MTG-DEMO0001';
    } else if (!activeMeeting.meetingRoomId) {
      activeMeeting.meetingRoomId = 'MTG-' + Math.random().toString(36).substr(2, 8).toUpperCase();
      const { doc: _d, updateDoc: _u } = window.firebaseFns;
      _u(_d(window.firebaseDB, 'meetings', mtId), { meetingRoomId: activeMeeting.meetingRoomId }).catch(e => console.error('MTG ID sync err:', e));
    }
    const mtgChip = document.getElementById('mt-meeting-room-id-chip');
    if (mtgChip) {
      mtgChip.textContent = ' ' + activeMeeting.meetingRoomId;
      mtgChip.style.display = 'inline-flex';
    }

    const videoBtn = document.getElementById('mt-mode-video-btn');
    if (videoBtn) {
      const agendasStr = (activeMeeting.agenda || '').toLowerCase();
      const isF2F = agendasStr.includes('contract finalization') || agendasStr.includes('food tasting');
      
      if (!isF2F) {
        if (!activeMeeting.roomId) {
          activeMeeting.roomId = 'VC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
          if (mtId !== 'demo') {
            const { doc, updateDoc } = window.firebaseFns;
            updateDoc(doc(window.firebaseDB, 'meetings', mtId), { roomId: activeMeeting.roomId }).catch(e => console.error(e));
          }
        }
        videoBtn.style.display = 'block';
        videoBtn.dataset.roomId = activeMeeting.roomId;
        const roomIdDisplay = document.getElementById('mt-mode-room-id-display');
        if (roomIdDisplay) {
          roomIdDisplay.textContent = activeMeeting.roomId;
          roomIdDisplay.style.display = 'flex';
        }
      } else {
        videoBtn.style.display = 'none';
        videoBtn.dataset.roomId = '';
        const roomIdDisplay = document.getElementById('mt-mode-room-id-display');
        if (roomIdDisplay) {
          roomIdDisplay.style.display = 'none';
        }
      }
    }

    // Render Agenda as Checklist
    const agendaContainer = document.getElementById('mt-mode-agenda');
    const topics = (activeMeeting.agenda || "").split(',').map(t => t.trim()).filter(t => t);
    agendaContainer.innerHTML = topics.map((t, idx) => `
      <label style="display:flex; align-items:center; gap:12px; padding:12px; background:rgba(255,255,255,0.03); border-radius:10px; cursor:pointer; border:1px solid rgba(255,255,255,0.05);">
        <input type="checkbox" class="agenda-chk" value="${t}" style="width:18px; height:18px; accent-color:var(--gold);">
        <span style="font-size:14px; color:var(--text);">${t}</span>
      </label>
    `).join('') || '<div style="color:var(--text-dim); font-size:13px;">No specific agenda items listed.</div>';

    // Live Notes Sync
    const notesArea = document.getElementById('mt-mode-notes');
    if (notesArea) {
      notesArea.value = activeMeeting.notes || '';
      notesArea.oninput = () => {
        if (activeMeeting && activeMeeting.id !== 'demo') {
           const { updateDoc, doc } = window.firebaseFns;
           // Simple debounce could be added here, but direct sync is more "live"
           updateDoc(doc(window.firebaseDB, 'meetings', activeMeeting.id), { notes: notesArea.value }).catch(e => {});
        }
      };
    }

    // Auto-populate the Review area immediately
    renderMtModeResDetails(res);

    document.getElementById('mt-mode-overlay').classList.add('open');

    const isInitial = (activeMeeting.agenda || "").toUpperCase().includes('INITIAL RESERVATION');
    const _initPayEl = document.getElementById('mt-mode-initial-res-payment');
    if (_initPayEl) _initPayEl.style.display = isInitial ? 'block' : 'none';


    const agendaStr = (activeMeeting.agenda || "").toUpperCase();
    const isFinal = agendaStr.includes('CONTRACT');
    const isDesign = agendaStr.includes('DESIGN');

    const isFood = agendaStr.includes('FOOD TASTING');
    const isRundown = agendaStr.includes('FINAL PROGRAM RUNDOWN');
    const isPayment = agendaStr.includes('PAYMENT ASSESSMENT');
    const isLogistics = agendaStr.includes('ADDITIONAL RESERVATION DISCUSSION');

    document.getElementById('mt-mode-contract-btn-container').style.display = isFinal ? 'block' : 'none';
    document.getElementById('mt-mode-design-btn-container').style.display = isDesign ? 'block' : 'none';

    // Show/Hide Meeting Mode Navigation Buttons

    document.getElementById('btn-mt-nav-food').style.display = isFood ? 'block' : 'none';
    document.getElementById('btn-mt-nav-design').style.display = isDesign ? 'block' : 'none';
    document.getElementById('btn-mt-nav-rundown').style.display = isRundown ? 'block' : 'none';
    document.getElementById('btn-mt-nav-payment').style.display = isPayment ? 'block' : 'none';
    document.getElementById('btn-mt-nav-logistics').style.display = isLogistics ? 'block' : 'none';

    // Reset to Reservation panel
    toggleMtModePanel('res');

    const uploadLabel = document.getElementById('mt-mode-upload-label');
    if (uploadLabel) {
      if (isDesign) uploadLabel.textContent = "Upload reference photos for the design of the reservation";
      else if (isFood) uploadLabel.textContent = "Upload food presentation or feedback documents";
      else uploadLabel.textContent = "Finalize Contract / Document / Photos";
    }

    if (isFood) renderMtModeFoodPanel(res);

    if (isDesign) renderMtModeDesignPanel(res);
    if (isRundown) renderMtModeRundownPanel(res);
    if (isPayment) renderPaymentAssessmentPanel(res);

    function updateBillingUI(resData) {
      const initialSection = document.getElementById('mt-mode-billing-section');
      const dpSection = document.getElementById('mt-mode-downpayment-section');

      const agendaStr = (activeMeeting.agenda || "").toUpperCase();
      const isFinal = agendaStr.includes('CONTRACT');
      const isInitial = agendaStr.includes('INITIAL RESERVATION');

      // Billing/Downpayment should only show for Contract Finalization or Initial Reservation
      if (isFinal || isInitial) {
        initialSection.style.display = 'block';
        dpSection.style.display = 'block';
      } else {
        initialSection.style.display = 'none';
        dpSection.style.display = 'none';
      }

      // 1. Downpayment Section (SCHEDULING - Metadata)
      const res = RESERVATIONS.find(r => r.id === activeMeeting.reservationId);
      let total = calculateMtPrice();
      // Ensure surcharge is saved if present
      if (res && mtVenueSurcharge > 0) res.venueSurcharge = mtVenueSurcharge;
      
      const downpayment = Math.round(total / 2);

      const dpAmtInput = document.getElementById('mt-downpayment-amount');
      const dpDueInput = document.getElementById('mt-downpayment-due');
      const dpBtn = document.getElementById('btn-save-downpayment');

      // Only auto-update if user is not currently typing in it
      if (document.activeElement !== dpAmtInput) {
        dpAmtInput.value = resData.downpaymentAmount || downpayment;
      }
      if (document.activeElement !== dpDueInput) {
        dpDueInput.value = resData.downpaymentDueDate || '';
      }
      dpDueInput.disabled = false;
      dpAmtInput.disabled = false; // Allow override if needed
      dpBtn.disabled = false;
      dpBtn.textContent = 'Save Downpayment Schedule';

      // 2. Initial Fee Section (BILLING - Gateway)
      const initialAmtInput = document.getElementById('mt-billing-amount-initial');
      const initialBtn = document.getElementById('btn-pay-initial');

      const isPaid = resData.paymentStatus === 'paid';
      const isRequested = resData.paymentRequested;

      if (!isPaid) {
        // Only auto-update if not focused
        if (document.activeElement !== initialAmtInput) {
          initialAmtInput.value = resData.paymentAmount || '';
        }
        initialAmtInput.disabled = false;
        initialBtn.disabled = false;
        initialBtn.textContent = isRequested ? 'Resend Payment Request' : 'Commence Initial Fee Payment';
      } else {
        initialAmtInput.value = resData.paymentAmount || '';
        initialAmtInput.disabled = true;
        initialBtn.disabled = true;
        initialBtn.textContent = 'Initial Fee Paid';
      }

      // Cash Confirm Visibility (Only for Billing)
      const cashConfirm = document.getElementById('mt-billing-cash-confirm');
      if (cashConfirm) {
        if (resData.paymentRequested && resData.cashPaymentStatus === 'waiting_for_admin') {
          cashConfirm.style.display = 'block';
        } else {
          cashConfirm.style.display = 'none';
        }
      }
    }

    if (window.activeMtResUnsub) {
      window.activeMtResUnsub();
      window.activeMtResUnsub = null;
    }

    if (res && res.id !== 'demo-res-123') {
      const { doc, onSnapshot } = window.firebaseFns;
      window.activeMtResUnsub = onSnapshot(doc(window.firebaseDB, 'reservations', res.id), (snap) => {
        if (snap.exists()) {
          activeMeetingResCache = { id: snap.id, ...snap.data() };
          updateBillingUI(activeMeetingResCache);
        }
      });
    } else {
      updateBillingUI(res);
    }

    renderMtModeResDetails(res);
  } catch (e) { console.error(e); }
}


let mtModifyMode = false;
let mtCustomPkgItems = [];
let mtCurCat = 'all';
let mtSearch = '';
let mtPax = 0;
let mtDate, mtTime, mtType, mtTheme, mtVip, mtVenue, mtVenueAddr, mtNotes;
let activeMeetingResCache = null;

window.toggleMtModifyMode = function () {
  mtModifyMode = !mtModifyMode;
  const btn = document.getElementById('mt-mode-modify-btn');
  const rightStd = document.getElementById('mt-mode-standard-right');
  const rightCat = document.getElementById('mt-mode-catalog-right');

  if (mtModifyMode) {
    btn.textContent = 'Cancel Modification';
    btn.style.color = 'var(--red)';
    btn.style.borderColor = 'var(--red)';
    rightStd.style.display = 'none';
    rightCat.style.display = 'flex';
    renderMtModeCats();
    renderMtModeCatalog();
  } else {
    btn.textContent = 'Modify Package';
    btn.style.color = '';
    btn.style.borderColor = '';
    rightCat.style.display = 'none';
    rightStd.style.display = 'flex';
  }
  renderMtModeResDetails(activeMeetingResCache);
  renderMtModeDesignDetails();
};

window.toggleMtModePanel = function (panel) {
  // Hide all panels and deactivate all buttons
  document.querySelectorAll('.mt-mode-panel').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.mt-mode-nav .btn-outline').forEach(b => b.classList.remove('active'));

  // Show target panel
  const p = document.getElementById('mt-panel-' + panel);
  if (p) {
    p.style.display = 'block';
    // Fix Leaflet map sizing if the panel contains a map

  }

  // Activate target button
  const btn = document.getElementById('btn-mt-nav-' + panel);
  if (btn) btn.classList.add('active');

  // Update title
  const titles = {
    'res': 'Reservation Review',

    'food': 'Food Tasting',
    'design': 'Design & Decoration',
    'rundown': 'Final Program Rundown',
    'payment': 'Payment Assessment',
    'logistics': 'Additional Reservation Details'
  };
  const titleEl = document.getElementById('mt-panel-title');
  if (titleEl) titleEl.textContent = titles[panel] || 'Reservation Review';

  // DOM Teleportation for Logistics Panel
  const extraPane = document.getElementById('resd-pane-extra');
  const logisticsPanel = document.getElementById('mt-panel-logistics');
  if (extraPane && logisticsPanel) {
    const extraBody = extraPane.querySelector('.panel-body');
    if (extraBody) {
      if (panel === 'logistics') {
        while (extraBody.firstChild) logisticsPanel.appendChild(extraBody.firstChild);
        if (typeof renderExtraReservationDetails === 'function') renderExtraReservationDetails();
        // Meeting-mode only: show Execution Agenda & Customer Provided Equipment
        if (typeof renderResdAgenda === 'function') {
          const activeRes = RESERVATIONS.find(r => r.id === activeResDetailId);
          renderResdAgenda(activeRes);
        }
        const cpeSection = document.getElementById('resd-customer-equip-section');
        if (cpeSection) {
          cpeSection.style.display = 'block';
          const activeRes = RESERVATIONS.find(r => r.id === activeResDetailId);
          const cpe = (activeRes && activeRes.customerProvidedEquip) || {};
          const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
          setVal('cpe-tables', cpe.tables);
          setVal('cpe-chairs', cpe.chairs);
          setVal('cpe-plates', cpe.plates);
          setVal('cpe-forks', cpe.forks);
          setVal('cpe-spoons', cpe.spoons);
          setVal('cpe-knives', cpe.knives);
          setVal('cpe-glasses', cpe.glasses);
          setVal('cpe-chafing', cpe.chafing);
          setVal('cpe-dispensers', cpe.dispensers);
          setVal('cpe-other', cpe.other);
        }
      } else {
        while (logisticsPanel.firstChild) extraBody.appendChild(logisticsPanel.firstChild);
        // Returning from meeting mode: hide meeting-only sections
        const agendaSec = document.getElementById('resd-execution-agenda-section');
        const cpeSec = document.getElementById('resd-customer-equip-section');
        if (agendaSec) agendaSec.style.display = 'none';
        if (cpeSec) cpeSec.style.display = 'none';
      }

    }
  }

  // REAL-TIME SYNC: Inform customer which tab we are looking at
  if (typeof activeMeeting !== 'undefined' && activeMeeting && activeMeeting.id && activeMeeting.id !== 'demo') {
     const { updateDoc, doc } = window.firebaseFns;
     updateDoc(doc(window.firebaseDB, 'meetings', activeMeeting.id), { activeTab: panel }).catch(e => {});
  }
};

function renderMtModeFoodPanel(res) {
  const container = document.getElementById('mt-food-tasting-list');
  if (!container) return;

  const dishes = res.packageItems || [];
  container.innerHTML = dishes.map((dish, idx) => `
    <div style="display:grid; grid-template-columns: 1.5fr 0.8fr 1fr 2fr; gap:15px; align-items:center; background:rgba(255,255,255,0.03); padding:15px; border-radius:10px; border:1px solid var(--border);">
      <div style="font-weight:600; color:var(--cream);">${dish}</div>
      <label style="display:flex; align-items:center; gap:8px; font-size:12px; cursor:pointer;">
        <input type="checkbox" class="food-tried" data-dish="${dish}" style="width:16px; height:16px; accent-color:var(--gold);"> Tried
      </label>
      <select class="food-decision input-field" style="height:35px; font-size:12px;">
        <option value="approved">Approved</option>
        <option value="pending">Pending Adjust.</option>
        <option value="rejected">Rejected</option>
      </select>
      <input type="text" class="food-remarks input-field" placeholder="Remarks/Adjustments..." style="height:35px; font-size:12px;">
    </div>
  `).join('') || '<div style="color:var(--text-dim); padding:20px;">No dishes found in package.</div>';
}

let mtVenueMap = null;
let resdVenueMap = null;

async function initVenueAssessmentMap(mapId, distId, etdId, venueAddress) {
  if (!venueAddress) return;
  const container = document.getElementById(mapId);
  if (!container) return;
  
  // Clean up existing map instance
  if (mapId === 'mt-venue-map' && mtVenueMap) { mtVenueMap.remove(); mtVenueMap = null; }
  if (mapId === 'resd-venue-map' && resdVenueMap) { resdVenueMap.remove(); resdVenueMap = null; }

  const adminAddress = "18 Basilio St, Manila, Metro Manila";
  const startCoords = [14.6138, 120.9948]; // 18 Basilio St, Manila coords

  try {
    const geocode = async (addr) => {
      try {
        const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}`);
        const data = await resp.json();
        if (data && data.length > 0) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      } catch (e) { console.error("Geocode error", e); }
      return null;
    };

    const endCoords = await geocode(venueAddress);
    if (!endCoords) {
      container.innerHTML = `<div style="padding:40px; color:var(--text-dim); font-size:12px; text-align:center;">Could not locate venue on map: <br><strong style="color:var(--gold);">${venueAddress}</strong></div>`;
      return;
    }

    const map = L.map(mapId).setView(startCoords, 13);
    if (mapId === 'mt-venue-map') mtVenueMap = map; else resdVenueMap = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ' OpenStreetMap'
    }).addTo(map);

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(startCoords[0], startCoords[1]), L.latLng(endCoords[0], endCoords[1])],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      createMarker: function(i, wp) {
        const icon = L.icon({
          iconUrl: i === 0 ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png' : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        return L.marker(wp.latLng, { icon: icon }).bindPopup(i === 0 ? "Admin Office (18 Basilio St)" : "Venue: " + venueAddress);
      }
    }).addTo(map);

    routingControl.on('routesfound', function(e) {
      const summary = e.routes[0].summary;
      const dist = (summary.totalDistance / 1000).toFixed(2) + " km";
      const time = (Math.round(summary.totalTime / 60) + 10) + " mins";
      const dEl = document.getElementById(distId);
      const tEl = document.getElementById(etdId);
      if (dEl) dEl.textContent = dist;
      if (tEl) tEl.textContent = time;

      // Handle Surcharge Logic
      if (mapId === 'mt-venue-map') {
        const isOutsideManila = !venueAddress.toLowerCase().includes('manila');
        const surchargeEl = document.getElementById('mt-venue-surcharge-info');
        const surchargeAmtEl = document.getElementById('mt-venue-surcharge-amt');
        
        if (isOutsideManila && surchargeEl && surchargeAmtEl) {
          const res = RESERVATIONS.find(r => r.id === activeMeeting.reservationId);
          if (res) {
            let baseTotal = 0;
            const items = mtCustomPkgItems.length > 0 ? mtCustomPkgItems : (res.packageItems || []);
            const pax = mtPax || res.pax || 0;
            items.forEach(i => { baseTotal += getDynamicPrice(i, pax); });
            mtVenueSurcharge = Math.round(baseTotal * 0.05);
            
            surchargeEl.style.display = 'block';
            surchargeAmtEl.textContent = "₱" + mtVenueSurcharge.toLocaleString(undefined, {minimumFractionDigits:2});
            
            // Trigger price refresh
            const totalEl = document.getElementById('mt-mode-total-price');
            if (totalEl) totalEl.textContent = "₱" + calculateMtPrice().toLocaleString(undefined, {minimumFractionDigits:2});
          }
        } else if (surchargeEl) {
          surchargeEl.style.display = 'none';
          mtVenueSurcharge = 0;
        }
      }
    });

    setTimeout(() => map.invalidateSize(), 500);
  } catch (err) {
    console.error("Map setup failed", err);
    container.innerHTML = `<div style="padding:40px; color:var(--red); font-size:12px; text-align:center;">Failed to load map tracking.</div>`;
  }
}



window.onMtModeCatalogSearch = function (val) {
  mtSearch = val;
  renderMtModeCatalog();
};

window.setMtModeCat = function (cat, btn) {
  mtCurCat = cat;
  document.querySelectorAll('#mt-mode-catalog-cats .chip').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderMtModeCatalog();
};

function renderMtModeCats() {
  const container = document.getElementById('mt-mode-catalog-cats');
  if (!container) return;
  const cats = ['all', ...new Set(CAT.map(i => i.cat))];
  container.innerHTML = `<div class="fbtns" style="display:flex; flex-wrap:wrap; gap:8px;">
    ${cats.map(c => `
      <button class="fb ${c === mtCurCat ? 'active' : ''}" style="padding: 6px 12px; border: 1px solid rgba(255,255,255,0.1); background: ${c === mtCurCat ? 'var(--gold)' : 'transparent'}; color: ${c === mtCurCat ? '#000' : 'var(--text-dim)'}; border-radius: 20px; cursor: pointer; text-transform:capitalize; font-size:12px; transition:0.2s;" onclick="setMtModeCat('${c}', this)">${c}</button>
    `).join('')}
  </div>`;
}

function renderMtModeCatalog() {
  const grid = document.getElementById('mt-mode-catalog-grid');
  if (!grid) return;
  let items = CAT;
  if (mtCurCat !== 'all') items = items.filter(i => i.cat === mtCurCat);
  if (mtSearch.trim()) {
    const q = mtSearch.toLowerCase();
    items = items.filter(i => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q));
  }

  if (!items.length) {
    grid.innerHTML = '<div style="grid-column:1/-1; padding:40px; text-align:center; color:var(--text-dim);">No items found.</div>';
    return;
  }

  grid.innerHTML = items.map(it => {
    const pax = mtPax || 0;
    const dp = getDynamicPrice(it, pax);
    let batchInfo = '';
    if (it.isIndividual) batchInfo = 'per pax';
    else if (it.batchSize) {
      const count = Math.ceil(pax / it.batchSize) || 1;
      const displayPax = pax > 0 ? pax : it.batchSize;
      const isDish = ['food', 'dessert', 'drink'].includes(it.cat);
      const unit = isDish ? 'tray' : (it.name.toLowerCase().includes('table') ? 'table' : 'unit');
      batchInfo = `serves ${displayPax} pax (${count} ${unit}${count > 1 ? 's' : ''})`;
    }

    // Check if added
    const inPkg = mtCustomPkgItems.find(c => c.id === it.id);

    return `
      <div class="cat-card" style="padding:16px; border:1px solid rgba(255,255,255,0.05); background:var(--bg3); border-radius:12px; display:flex; flex-direction:column; gap:8px;">
        <div class="cat-info" style="flex:1;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div class="cat-cat-lbl" style="margin:0; font-size:10px; color:var(--text-dim); text-transform:uppercase; font-weight:700; letter-spacing:1px;">${it.cat}</div>
          </div>
          <div class="cat-n" style="font-size:14px; font-weight:700; color:var(--cream);">${it.name}</div>
          <div class="cat-d" style="font-size:11px; color:var(--text-dim); margin-top:4px;">${it.desc}</div>
          <div class="cat-p" style="color:var(--primary); font-weight:700; margin-top:8px;">₱${dp.toLocaleString()} <span style="font-size:10px; color:var(--text-dim); font-weight:400;">${batchInfo}</span></div>
        </div>
        <button class="btn-add ${inPkg ? 'added' : ''}" onclick="addMtModeItem('${it.id}')" style="margin-top:auto; width:100%; padding:8px 0; background:${inPkg ? 'transparent' : 'rgba(217,119,6,0.1)'}; border:1px solid ${inPkg ? 'var(--green)' : 'var(--gold)'}; color:${inPkg ? 'var(--green)' : 'var(--gold)'}; border-radius:6px; cursor:pointer; font-weight:600; font-size:12px; transition:0.2s;">
          ${inPkg ? '&#10003; Added' : '+ Add to Package'}
        </button>
      </div>
    `;
  }).join('');
}

window.saveMtModePackage = async function () {
  if (!activeMeetingResCache) return;
  const btn = event.target;
  const originalText = btn.textContent;
  btn.textContent = 'Saving...';
  btn.disabled = true;

  try {
    const newTotal = calculateMtPrice();
    const itemNames = mtCustomPkgItems.map(i => i.name);
    const { doc, updateDoc } = window.firebaseFns;

    const timeRange = (mtTimeStart && mtTimeEnd) ? `${mtTimeStart} - ${mtTimeEnd}` : (mtTimeStart || mtTimeEnd || '');

    await updateDoc(doc(window.firebaseDB, 'reservations', activeMeetingResCache.id), {
      date: mtDate,
      time: timeRange,
      type: mtType,
      pax: mtPax,
      theme: mtTheme,
      vip: mtVip,
      venue: mtVenue,
      venueAddr: mtVenueAddr,
      notes: mtNotes,
      packageItems: itemNames,
      amount: newTotal,
      packageName: 'Custom Mod: ' + (activeMeetingResCache.packageName || 'Package')
    });

    activeMeetingResCache.date = mtDate;
    activeMeetingResCache.time = timeRange;
    activeMeetingResCache.type = mtType;
    activeMeetingResCache.pax = mtPax;
    activeMeetingResCache.theme = mtTheme;
    activeMeetingResCache.vip = mtVip;
    activeMeetingResCache.venue = mtVenue;
    activeMeetingResCache.venueAddr = mtVenueAddr;
    activeMeetingResCache.notes = mtNotes;
    activeMeetingResCache.packageItems = itemNames;
    activeMeetingResCache.amount = newTotal;
    activeMeetingResCache.packageName = 'Custom Mod: ' + (activeMeetingResCache.packageName || 'Package');

    alert('Package modifications saved directly to reservation.');
    toggleMtModifyMode(); // switch back to normal view
  } catch (e) {
    alert('Failed to finalize contract: ' + e.message);
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

function renderMtModeDesignDetails() {
  const container = document.getElementById('mt-mode-decor-items-list');
  const section = document.getElementById('mt-mode-design-details');
  if (!container || !section) return;

  const isDesign = activeMeeting && (activeMeeting.agenda || "").toUpperCase().includes('DESIGN');
  if (!isDesign) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';

  // Filter items in decoration category (case-insensitive check just in case)
  const decorItems = mtCustomPkgItems.filter(it => it.cat && it.cat.toLowerCase() === 'decoration');

  if (decorItems.length === 0) {
    container.innerHTML = '<div style="color:var(--text-dim); font-size:13px; padding:15px; text-align:center; background:rgba(255,255,255,0.02); border-radius:10px; border:1px solid rgba(255,255,255,0.05);">No decoration items in the current package. Add items via "Modify Package" to begin design notes.</div>';
    return;
  }

  container.innerHTML = decorItems.map((it) => {
    // We must find the index in the original mtCustomPkgItems to stay consistent with concludeDesignMeeting IDs
    const mainIdx = mtCustomPkgItems.findIndex(m => m === it);
    return `
      <div style="display:flex; flex-direction:column; background:rgba(255,255,255,0.03); padding:15px; border-radius:12px; border:1px solid rgba(255,255,255,0.06);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <div style="font-size:14px; color:var(--cream); font-weight:700;">${it.name}</div>
          <div class="badge confirmed" style="font-size:9px; letter-spacing:0.5px;">DECORATION</div>
        </div>
        <textarea id="design-note-${mainIdx}" class="input-field" 
          style="min-height:80px; font-size:13px; padding:12px; background:var(--bg); border-color:rgba(196,154,60,0.15);" 
          placeholder="Discuss and input design specifics for ${it.name} here...">${it.designNote || ''}</textarea>
      </div>
    `;
  }).join('');
}

window.concludeDesignMeeting = async function() {
  if (!activeMeetingResCache || !activeMeeting) return;
  const btn = document.getElementById('btn-mt-conclude-design');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Saving Design...';
  }

  try {
    const { collection, addDoc, doc, updateDoc } = window.firebaseFns;
    const db = window.firebaseDB;
    
    // Gather design selections from the new UI
    const designItems = [];
    document.querySelectorAll('#mt-design-items-list > div[data-item-name]').forEach(row => {
      const itemName = row.dataset.itemName;
      const note = row.querySelector('.design-note').value;
      const selectedImg = row.querySelector('.catalog-img.selected')?.src || null;
      designItems.push({ itemName, note, selectedImg });
    });

    const designData = {
      reservationId: activeMeetingResCache.id,
      meetingId: activeMeeting.id,
      items: designItems,
      uploadedPhotos: mtUploadedUrls || [], // Fixed: use plural name from refactor
      createdAt: new Date().toISOString()
    };

    await addDoc(collection(db, 'designs'), designData);
    
    await updateDoc(doc(db, 'meetings', activeMeeting.id), {
      status: 'completed',
      completedAt: new Date().toISOString()
    });

    alert('Design meeting concluded successfully. Data saved to designs collection.');
    exitMeetingMode();
    // Refresh admin dashboard if available
    if (typeof loadAdminData === 'function') loadAdminData();

  } catch (e) {
    console.error("Failed to conclude design meeting:", e);
    alert("Error: " + e.message);
    if (btn) {
      btn.disabled = false;
      btn.textContent = '✓ Conclude Design Meeting';
    }
  }
};


function renderMtModeResDetails(res) {
  const container = document.getElementById('mt-mode-res-details');
  if (!container) return;

  if (!mtModifyMode) {
    const displayDate = mtDate ? new Date(mtDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Date Set';

    const format12h = (t) => {
      if (!t) return '—';
      const [h, m] = t.split(':');
      let hh = parseInt(h);
      const ampm = hh >= 12 ? 'PM' : 'AM';
      hh = hh % 12 || 12;
      return `${hh}:${m} ${ampm}`;
    };

    container.innerHTML = `
      <div class="two-col" style="gap:40px; margin-bottom:20px; padding-bottom:20px; border-bottom:1px solid rgba(255,255,255,0.05);">
        <div>
          <div class="form-group"><label>Event Time Range</label><div class="input-field" style="background:transparent; border:none; padding:0; font-size:16px; font-weight:600;">${format12h(mtTimeStart)} – ${format12h(mtTimeEnd)}</div></div>
          <div class="form-group"><label>Guest Count</label><div class="input-field" style="background:transparent; border:none; padding:0; font-size:16px; font-weight:600;">${mtPax} pax (VIP: ${mtVip})</div></div>
          <div class="form-group"><label>Event Type</label><div class="input-field" style="background:transparent; border:none; padding:0; font-size:16px; font-weight:600;">${mtType || '—'}</div></div>
          <div class="form-group"><label>Theme / Motif</label><div class="input-field" style="background:transparent; border:none; padding:0; font-size:16px; font-weight:600;">${mtTheme || '—'}</div></div>
        </div>
        <div>
          <div class="form-group"><label>Venue Name/Type</label><div class="input-field" style="background:transparent; border:none; padding:0; font-size:16px; font-weight:600;">${mtVenue || '—'}</div></div>
          <div class="form-group"><label>Venue Address</label><div class="input-field" style="background:transparent; border:none; padding:0; font-size:16px; font-weight:600; white-space:pre-wrap;">${mtVenueAddr || '—'}</div></div>
          <div class="form-group"><label>Additional Notes</label><div class="input-field" style="background:transparent; border:none; padding:0; font-size:14px; font-weight:500; color:var(--text-dim); white-space:pre-wrap;">${mtNotes || '—'}</div></div>
          <div class="form-group"><label>Package</label><div style="font-size:16px; font-weight:700; color:var(--cream);">${res.packageName || 'Custom Package'}</div></div>
        </div>
      </div>
      <div style="margin-top:20px;">
        <label style="font-size:11px; color:var(--text-dim); display:block; margin-bottom:10px;">INCLUDED ITEMS BY CATEGORY</label>
        <div id="mt-mode-items-list">
          ${renderMtModeReadOnlyItems()}
        </div>
      </div>
      <div style="margin-top:20px; padding-top:20px; border-top:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center;">
        <div style="font-size:12px; color:var(--text-dim); text-transform:uppercase; letter-spacing:1px;">Total Price</div>
        <div id="mt-mode-total-price" style="font-size:24px; font-weight:700; color:var(--gold);">₱${calculateMtPrice().toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="two-col" style="gap:20px; margin-bottom:20px;">
        <div>
          <div class="form-group"><label>Event Date</label><input type="date" class="input-field" value="${mtDate}" oninput="mtDate=this.value"/></div>
          <div class="form-group">
            <label>Event Time Range</label>
            <div style="display:flex; align-items:center; gap:10px;">
              <input type="time" class="input-field" value="${mtTimeStart}" oninput="mtTimeStart=this.value"/>
              <span style="color:var(--text-dim); font-size:12px;">to</span>
              <input type="time" class="input-field" value="${mtTimeEnd}" oninput="mtTimeEnd=this.value"/>
            </div>
          </div>
          <div class="form-group"><label>Guest Count (Pax)</label><input type="number" class="input-field" value="${mtPax}" oninput="updateMtModePax(this.value)"/></div>
          <div class="form-group"><label>VIP Count</label><input type="number" class="input-field" value="${mtVip}" oninput="mtVip=parseInt(this.value)||0"/></div>
          <div class="form-group"><label>Event Type</label><input type="text" class="input-field" value="${mtType}" oninput="mtType=this.value"/></div>
        </div>
        <div>
          <div class="form-group"><label>Theme / Motif</label><input type="text" class="input-field" value="${mtTheme}" oninput="mtTheme=this.value"/></div>
          <div class="form-group"><label>Venue Name/Type</label><input type="text" class="input-field" value="${mtVenue}" oninput="mtVenue=this.value"/></div>
          <div class="form-group"><label>Venue Address</label><textarea class="input-field" style="min-height:50px; resize:vertical;" oninput="mtVenueAddr=this.value">${mtVenueAddr}</textarea></div>
          <div class="form-group"><label>Additional Notes</label><textarea class="input-field" style="min-height:75px; resize:vertical;" oninput="mtNotes=this.value">${mtNotes}</textarea></div>
        </div>
      </div>
      <div style="margin-bottom:20px; padding-bottom:20px; border-bottom:1px solid rgba(255,255,255,0.05);">
          <div class="form-group"><label>Package</label><div style="font-size:16px; font-weight:700; color:var(--cream);">${res.packageName}</div></div>
      </div>
      <div style="margin-top:20px;">
        <label style="font-size:11px; color:var(--text-dim); display:block; margin-bottom:10px;">CURRENT ITEMS (<span id="mt-mode-items-count">${mtCustomPkgItems.length}</span>)</label>
        <div id="mt-mode-items-list" style="display:flex; flex-direction:column; gap:8px; max-height: 400px; overflow-y:auto; padding-right:10px;">
          ${renderMtModeEditableItems()}
        </div>
      </div>
      <div style="margin-top:20px; padding-top:20px; border-top:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center;">
        <div style="font-size:12px; color:var(--text-dim); text-transform:uppercase; letter-spacing:1px;">New Total Price</div>
        <div id="mt-mode-total-price" style="font-size:24px; font-weight:700; color:var(--gold);">₱${calculateMtPrice().toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
      </div>
      <button class="btn-primary" style="width:100%; margin-top:20px; justify-content:center;" onclick="saveMtModePackage()">Save Package Modifications</button>
    `;
  }
  renderMtModeDesignDetails();
}

function renderMtModeEditableItems() {
  if (mtCustomPkgItems.length === 0) return '<div style="color:var(--text-dim); font-size:13px; text-align:center; padding:20px;">No items in package.</div>';
  return mtCustomPkgItems.map((it, idx) => `
    <div style="display:flex; flex-direction:column; background:rgba(255,255,255,0.03); padding:10px 15px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:14px; color:var(--text); font-weight:600;">${it.name}</div>
          <div style="font-size:12px; color:var(--text-dim);">${it.cat ? it.cat.toUpperCase() : 'OTHER'}</div>
        </div>
        <div style="display:flex; align-items:center; gap:15px;">
          <div style="font-size:14px; color:var(--gold); font-weight:600;">₱${getDynamicPrice(it, mtPax).toLocaleString()}</div>
          <button style="background:none; border:none; color:var(--red); font-size:16px; cursor:pointer;" onclick="removeMtModeItem(${idx})">&times;</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderMtModeReadOnlyItems() {
  if (mtCustomPkgItems.length === 0) return '<div style="color:var(--text-dim); font-size:13px; text-align:center; padding:20px;">No items in package.</div>';
  return mtCustomPkgItems.map((it) => `
    <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02); padding:8px 15px; border-radius:8px; margin-bottom:6px;">
      <div>
        <div style="font-size:13px; color:var(--text); font-weight:600;">${it.name}</div>
        <div style="font-size:11px; color:var(--text-dim);">${it.cat ? it.cat.toUpperCase() : 'OTHER'}</div>
      </div>
      <div style="font-size:13px; color:var(--gold); font-weight:600;">₱${getDynamicPrice(it, mtPax).toLocaleString()}</div>
    </div>
  `).join('');
}

window.updateMtModePax = function (val) {
  mtPax = parseInt(val) || 0;

  // Only update dependent parts to prevent focus loss on input
  const itemsList = document.getElementById('mt-mode-items-list');
  if (itemsList) itemsList.innerHTML = mtModifyMode ? renderMtModeEditableItems() : renderMtModeReadOnlyItems();

  const priceEl = document.getElementById('mt-mode-total-price');
  if (priceEl) priceEl.innerHTML = '₱' + calculateMtPrice().toLocaleString(undefined, { minimumFractionDigits: 2 });

  renderMtModeCatalog(); // update prices in catalog
  renderMtModeDesignDetails(); // update design panel if needed
};

window.removeMtModeItem = function (idx) {
  mtCustomPkgItems.splice(idx, 1);
  const itemsList = document.getElementById('mt-mode-items-list');
  if (itemsList) itemsList.innerHTML = mtModifyMode ? renderMtModeEditableItems() : renderMtModeReadOnlyItems();

  const countEl = document.getElementById('mt-mode-items-count');
  if (countEl) countEl.textContent = mtCustomPkgItems.length;

  const priceEl = document.getElementById('mt-mode-total-price');
  if (priceEl) priceEl.innerHTML = '₱' + calculateMtPrice().toLocaleString(undefined, { minimumFractionDigits: 2 });
  renderMtModeCatalog(); // update "Added" state in catalog
  renderMtModeDesignDetails();
};

window.addMtModeItem = function (id) {
  const item = CAT.find(i => i.id === id);
  if (!item) return;
  mtCustomPkgItems.push(Object.assign({}, item));
  const itemsList = document.getElementById('mt-mode-items-list');
  if (itemsList) itemsList.innerHTML = mtModifyMode ? renderMtModeEditableItems() : renderMtModeReadOnlyItems();

  const countEl = document.getElementById('mt-mode-items-count');
  if (countEl) countEl.textContent = mtCustomPkgItems.length;

  const priceEl = document.getElementById('mt-mode-total-price');
  if (priceEl) priceEl.innerHTML = '₱' + mtCustomPkgItems.reduce((s, i) => s + getDynamicPrice(i, mtPax), 0).toLocaleString(undefined, { minimumFractionDigits: 2 });
  renderMtModeCatalog(); // update "Added" state in catalog
  renderMtModeDesignDetails();
};

function exitMeetingMode() {
  // Ensure logistics DOM is teleported back safely before closing
  const extraPane = document.getElementById('resd-pane-extra');
  const logisticsPanel = document.getElementById('mt-panel-logistics');
  if (extraPane && logisticsPanel && logisticsPanel.hasChildNodes()) {
    const extraBody = extraPane.querySelector('.panel-body');
    if (extraBody) {
      while (logisticsPanel.firstChild) extraBody.appendChild(logisticsPanel.firstChild);
    }
  }

  document.getElementById('mt-mode-overlay').classList.remove('open');
  activeMeeting = null;
  const mtgChip = document.getElementById('mt-meeting-room-id-chip');
  if (mtgChip) mtgChip.style.display = 'none';
  if (typeof leaveVideoRoom === 'function') {
    leaveVideoRoom();
  }
}

// Integrated Chat Mini for Modal
function initMtChat(resId, clientName) {
  const box = document.getElementById('mt-chat-box');
  box.innerHTML = '<div style="text-align:center; color:var(--text-dim);">Loading conversation...</div>';

  if (window.activeMtChatUnsub) {
    window.activeMtChatUnsub();
  }

  const { query, collection, where, onSnapshot } = window.firebaseFns;
  const q = query(
    collection(window.firebaseDB, "chats"),
    where("reservationId", "==", resId)
  );

  window.activeMtChatUnsub = onSnapshot(q, (snap) => {
    let docs = snap.docs.map(d => d.data());
    // Sort in JS to avoid needing a composite index for where+orderBy
    docs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    if (docs.length === 0) {
      box.innerHTML = '<div style="text-align:center; color:var(--text-dim); margin-top:20px;">No messages yet. Say hi!</div>';
      return;
    }

    box.innerHTML = docs.map(m => {
      const isMe = m.sender === 'Admin';
      return `<div style="margin-bottom:10px; text-align:${isMe ? 'right' : 'left'};">
        <div style="display:inline-block; padding:6px 10px; border-radius:8px; background:${isMe ? 'var(--gold)' : 'var(--bg3)'}; color:${isMe ? '#000' : 'var(--text)'}; max-width:80%; font-size:12px; text-align:left;">
          ${m.text}
        </div>
      </div>`;
    }).join('');
    box.scrollTop = box.scrollHeight;
  });
}


async function markContractFinalized() {
  if (!activeMeeting) return;
  const btn = event.target || { textContent: 'Finalize', disabled: false };
  const originalText = btn.textContent;

  if (activeMeeting.id === 'demo') {
    alert('Demo Meeting Completed Successfully!');
    exitMeetingMode();
    return;
  }

  try {
    const { updateDoc, doc, collection, addDoc } = window.firebaseFns;
    const db = window.firebaseDB;

    // Use the first upload as primary contract if it's a contract meeting
    let contractUrl = mtUploadedUrls.length > 0 ? mtUploadedUrls[0].url : (activeMeeting.contractUrl || null);
    const notesEl = document.getElementById('mt-mode-notes');
    const notes = notesEl ? notesEl.value : '';

    btn.textContent = 'Finalizing...';
    btn.disabled = true;

    const agendaStr = (activeMeeting.agenda || "").toUpperCase();

    // 2. Save Food Taste if applicable
    if (agendaStr.includes('FOOD TASTING')) {
      const foodItems = [];
      document.querySelectorAll('#mt-food-tasting-list > div').forEach(row => {
        foodItems.push({
          dish: row.querySelector('.food-tried').dataset.dish,
          tried: row.querySelector('.food-tried').checked,
          decision: row.querySelector('.food-decision').value,
          remarks: row.querySelector('.food-remarks').value
        });
      });
      const foodTasteData = {
        reservationId: activeMeeting.reservationId,
        meetingId: activeMeeting.id,
        dishes: foodItems,
        documents: mtUploadedUrls,
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, 'FoodTaste'), foodTasteData);
    }

    // 3. Save Design if applicable
    if (agendaStr.includes('DESIGN')) {
      const designItems = [];
      document.querySelectorAll('#mt-design-items-list > div[data-item-name]').forEach(row => {
        const itemName = row.dataset.itemName;
        const note = row.querySelector('.design-note').value;
        const selectedImg = row.querySelector('.catalog-img.selected')?.src || null;
        designItems.push({ itemName, note, selectedImg });
      });
      const designData = {
        reservationId: activeMeeting.reservationId,
        meetingId: activeMeeting.id,
        items: designItems,
        uploadedPhotos: mtUploadedUrls || [],
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, 'designs'), designData);
    }

    // 4. Save Final Rundown if applicable
    if (agendaStr.includes('FINAL PROGRAM RUNDOWN')) {
      const res = activeMeetingResCache;
      const approvals = activeMeeting.rundownApprovals || {};
      
      // Fetch latest designs
      const { collection: coll, query: qry, where: whr, getDocs: gds, orderBy: ord, limit: lim } = window.firebaseFns;
      const dq = qry(coll(window.firebaseDB, 'designs'), whr('reservationId', '==', res.id), ord('createdAt', 'desc'), lim(1));
      const designSnap = await gds(dq);
      const latestDesign = designSnap.empty ? {} : designSnap.docs[0].data();



      // Fetch latest food tasting if not in cache
      let foodSum = res.foodTaste;
      if (!foodSum) {
        const fq = qry(coll(window.firebaseDB, 'FoodTaste'), whr('reservationId', '==', res.id), ord('createdAt', 'desc'), lim(1));
        const fSnap = await gds(fq);
        if (!fSnap.empty) foodSum = fSnap.docs[0].data();
      }

      const finalRundown = {
        venue: {
            name: res.venue,
            type: 'As specified in reservation',
            capacity: res.pax
        },
        designs: approvals.design ? (latestDesign.items || []) : null,
        food: approvals.food ? (foodSum?.dishes || []).filter(f => f.decision === 'approved') : null,
        personnel: approvals.personnel ? (res.hiredPersonnel || {}) : null,
        timeline: approvals.timeline ? (res.executionPlan?.phases || []) : null,
        generatedAt: new Date().toISOString(),
        meetingId: activeMeeting.id
      };

      await updateDoc(doc(window.firebaseDB, 'reservations', res.id), { finalRundown });
      res.finalRundown = finalRundown;
    }

    // 3. Update meeting status
    await updateDoc(doc(db, 'meetings', activeMeeting.id), {
      status: 'completed',
      contractUrl: contractUrl,
      uploadedFiles: mtUploadedUrls,
      notes: notes,
      completedAt: new Date().toISOString()
    });

    // 4. Sync to reservation
    const reservationPatch = { 
      contractFinalizedAt: new Date().toISOString(),
      amount: calculateMtPrice()
    };
    if (contractUrl) reservationPatch.contractUrl = contractUrl;
    
    // Auto-capture Downpayment data from Meeting UI
    const dpAmtInput = document.getElementById('mt-downpayment-amount');
    const dpDueInput = document.getElementById('mt-downpayment-due');
    if (dpAmtInput && dpDueInput && dpDueInput.value) {
      reservationPatch.downpaymentAmount = dpAmtInput.value;
      reservationPatch.downpaymentDueDate = dpDueInput.value;
    }

    if (mtVenueSurcharge > 0) {
      reservationPatch.venueSurcharge = mtVenueSurcharge;
    }



    await updateDoc(doc(db, 'reservations', activeMeeting.reservationId), reservationPatch);

    // 5. Generate and Save Logistics Milestones
    const resForLogistics = { ...RESERVATIONS.find(r => r.id === activeMeeting.reservationId), ...reservationPatch };
    const logisticsData = generateAutoLogisticsMilestones(resForLogistics);
    
    // Save to Firebase (merging with extra details)
    const extra = getActiveReservationExtra(activeMeeting.reservationId);
    if (extra) {
      extra.logisticsMilestones = logisticsData.milestones;
      extra.timelineTasks = (extra.timelineTasks || []).filter(t => t.type !== 'auto' && !t.id.startsWith('auto-')).concat(logisticsData.tasks);
      
      await updateDoc(doc(db, 'reservations', activeMeeting.reservationId), {
        logisticsMilestones: extra.logisticsMilestones,
        timelineTasks: extra.timelineTasks
      });
    }

    // Update local state for instant UI update
    const resIdx = RESERVATIONS.findIndex(r => r.id === activeMeeting.reservationId);
    if (resIdx !== -1) {
      RESERVATIONS[resIdx] = { ...RESERVATIONS[resIdx], ...reservationPatch, logisticsMilestones: extra.logisticsMilestones, timelineTasks: extra.timelineTasks };
    }

    alert('Meeting marked as completed. All assessment data and files saved.');
    exitMeetingMode();
    if (mtCalendar) mtCalendar.refetchEvents();
  } catch (e) {
    console.error(e);
    alert('Error completing meeting: ' + e.message);
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

window.renderMeetingsSection = renderMeetingsSection;
window.openMtModal = openMtModal;
window.closeMtModal = closeMtModal;
window.saveMeeting = saveMeeting;
window.loadMeetingToForm = loadMeetingToForm;
window.handleMtFileUpload = handleMtFileUpload;
window.clearMtFile = clearMtFile;
window.initiateMeetingMode = initiateMeetingMode;
window.exitMeetingMode = exitMeetingMode;
window.completeMeeting = markContractFinalized;
window.markContractFinalized = markContractFinalized;
window.forceMeetingMode = forceMeetingMode;
window.sendMtChatMsg = async function () {
  const input = document.getElementById('mt-chat-input');
  const text = input.value.trim();
  if (!text || !activeMtResId) return;

  try {
    const { collection, addDoc } = window.firebaseFns;
    await addDoc(collection(window.firebaseDB, "chats"), {
      reservationId: activeMtResId,
      text: text,
      sender: 'Admin',
      timestamp: new Date().toISOString()
    });
    input.value = '';
  } catch (e) {
    console.error("Chat send failed", e);
  }
};

// ===== EVENT DETAILS =====
let currentEditingEventId = null;

function openEventDetails(id) {
  const ev = RESERVATIONS.find(r => r.id === id);
  if (!ev) return;
  currentEditingEventId = id;
  document.getElementById('ed-title').textContent = ev.client + ' — ' + (ev.packageName || ev.type);
  document.getElementById('ed-date').textContent = ev.date;
  document.getElementById('ed-amount').textContent = ev.displayAmount;
  document.getElementById('ed-pax').textContent = ev.pax + ' pax';
  document.getElementById('ed-status').value = ev.status;

  // Render Asset Requirements ("What it needs")
  renderEventRequirements(ev);

  document.getElementById('ed-overlay').classList.add('on');
  document.getElementById('section-event-details').classList.add('open');

  const stocksList = document.getElementById('ed-stocks-list');
  let html = '';
  if (ev.packageItems && ev.packageItems.length) {
    const itemsByCategory = {};
    ev.packageItems.forEach(item => {
      const name = typeof item === 'string' ? item : (item.name || 'Unknown');
      const catItem = typeof CAT !== 'undefined' ? CAT.find(c => c.name === name) : null;
      const cat = catItem && catItem.cat ? catItem.cat : 'OTHER';
      if (!itemsByCategory[cat]) itemsByCategory[cat] = [];
      itemsByCategory[cat].push(name);
    });
    
    for (const cat in itemsByCategory) {
      html += `<div style="margin-bottom:16px;">`;
      html += `<div style="font-size:12px; color:var(--gold); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; font-weight:700; border-bottom: 1px solid rgba(196,154,60,0.3); padding-bottom:4px;">${cat}</div>`;
      itemsByCategory[cat].forEach(name => {
        html += `<div style="background:var(--bg2); border:1px solid var(--border); padding:10px 14px; border-radius:8px; margin-bottom:6px;">
          <div style="font-size:13px; font-weight:600; color:var(--text);">• ${name}</div>
        </div>`;
      });
      html += `</div>`;
    }
  } else {
    html = `<div style="font-size:13px; color:var(--text-dim); padding:10px;">Standard package — no specific items mapped.</div>`;
  }
  stocksList.innerHTML = html;
}

function closeEventDetails() {
  document.getElementById('ed-overlay').classList.remove('on');
  document.getElementById('section-event-details').classList.remove('open');
  currentEditingEventId = null;
}

function backToCalendar() {
  closeEventDetails();
}

function changeEventStatus() {
  if (!currentEditingEventId) return;
  updateReservationStatus(currentEditingEventId, document.getElementById('ed-status').value);
}

window.openEventDetails = openEventDetails;
window.closeEventDetails = closeEventDetails;
window.backToCalendar = backToCalendar;
window.changeEventStatus = changeEventStatus;

// ===== RENDER DASHBOARD =====
function renderDashboard() {
  const confirmed = RESERVATIONS.filter(r => r.status === 'confirmed');
  const pending = RESERVATIONS.filter(r => r.status === 'pending');

  document.getElementById('dash-stat-upcoming').textContent = confirmed.length;
  document.getElementById('dash-stat-pending').textContent = pending.length;

  // Equipment stat
  const underRepair = EIM_ASSETS.filter(a => a.status === 'Under Repair').length;
  document.getElementById('dash-stat-equip').textContent = underRepair > 0 ? underRepair : '✓ OK';
  document.getElementById('dash-stat-equip-sub').textContent = underRepair > 0 ? 'items under repair' : 'All assets operational';

  // Revenue — safely handle amount as number, string, or undefined
  const rev = confirmed.reduce((sum, r) => {
    const raw = r.amount != null ? String(r.amount).replace(/[^\d.]/g, '') : '0';
    return sum + (parseFloat(raw) || 0);
  }, 0);
  document.getElementById('dash-stat-revenue').textContent = '₱' + Math.round(rev).toLocaleString();

  const resBadge = document.getElementById('res-sidebar-badge');
  if (resBadge) {
    resBadge.textContent = pending.length;
    resBadge.style.display = pending.length > 0 ? 'inline-flex' : 'none';
  }

  // Upcoming reservations panel
  const upcoming = confirmed.slice(0, 4);
  document.getElementById('dash-reservations').innerHTML = upcoming.length ? upcoming.map(r => {
    const dateVal = String(r.date || '');
    const parts = dateVal.includes(' ') ? dateVal.split(' ') : [dateVal, ''];
    const day = (parts[1] || '').replace(',', '') || dateVal.split('-')[2] || '';
    const mon = parts[0] || '';

    return `
      <div class="res-item">
        <div class="res-date-box">
          <div class="res-date-day">${day}</div>
          <div class="res-date-mon">${mon}</div>
        </div>
        <div class="res-info">
          <div class="res-name">${r.client || 'Unnamed Client'}</div>
          <div style="font-size:11px;color:var(--gold);margin-top:2px;">${r.packageName || r.type || 'Custom Event'}</div>
          <div class="res-details"><span> ${r.pax || 0} pax</span><span> ${r.type || 'Event'}</span></div>
        </div>
        <div class="res-right">
          <div class="res-price">${r.displayAmount || '₱0'}</div>
          <span class="badge ${r.status || 'pending'}">${(r.status || 'pending').charAt(0).toUpperCase() + (r.status || 'pending').slice(1)}</span>
        </div>
      </div>`;
  }).join('') : `<div style="text-align:center;padding:24px;color:var(--text-dim);font-size:13px;">No upcoming confirmed events.</div>`;

  // Activity log
  const logEl = document.getElementById('activity-log');
  if (logEl) {
    logEl.innerHTML = (ACTIVITY || []).map(a => `
      <div class="timeline-item">
        <div class="timeline-dot ${a.dot || 'amber'}"></div>
        <div class="timeline-content">
          <div class="timeline-title">${a.title || 'System Update'}</div>
          <div class="timeline-sub">${a.sub || 'No details available'}</div>
        </div>
        <div class="timeline-time">${a.time || 'now'}</div>
      </div>`).join('') || '<div style="text-align:center;padding:24px;color:var(--text-dim);font-size:13px;">No recent activity.</div>';
  }

  // Dashboard Calendar
  const calEl = document.getElementById('dash-calendar');
  if (!calEl) return;

  if (typeof FullCalendar === 'undefined') {
    calEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-dim);">Calendar library loading...</div>';
    return;
  }

  const eventsData = buildReservationCalendarEvents(confirmed);
  try {
    if (!window.dashCalendar) {
      window.dashCalendar = new FullCalendar.Calendar(calEl, {
        initialView: 'dayGridMonth',
        headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,listWeek' },
        height: 580,
        events: eventsData,
        eventClick: function (info) { openEventDetails(info.event.extendedProps?.reservationId || info.event.id); }
      });
      if (document.getElementById('section-dashboard').classList.contains('active')) {
        window.dashCalendar.render();
      }
    } else {
      window.dashCalendar.removeAllEvents();
      window.dashCalendar.addEventSource(eventsData);
    }
  } catch (e) {
    console.error('FullCalendar Error:', e);
    calEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--red);">Error loading calendar.</div>';
  }
  updateRoutineAlertBanner();
}

function getReservationPrepStartDate(res) {
  const eventDate = normalizeDateKey(res.date);
  if (!eventDate) return eventDate;
  const eventObj = new Date(eventDate + 'T00:00:00');
  if (isNaN(eventObj.getTime())) return eventDate;

  // Safety cap: never render more than 7 prep days.
  const minPrepObj = new Date(eventObj);
  minPrepObj.setDate(minPrepObj.getDate() - 7);

  const submitted = normalizeDateKey(res.submittedDate || res.createdAt || res.requestedAt || res.bookedAt);
  if (submitted) {
    const submittedObj = new Date(submitted + 'T00:00:00');
    if (!isNaN(submittedObj.getTime()) && submittedObj < eventObj) {
      return (submittedObj > minPrepObj ? submittedObj : minPrepObj).toISOString().split('T')[0];
    }
  }
  return minPrepObj.toISOString().split('T')[0];
}

function getColorForId(id) {
  const colors = [
    '#e74c3c', '#8e44ad', '#2980b9', '#27ae60', '#d35400',
    '#c0392b', '#34495e', '#16a085', '#2c3e50', '#f39c12',
    '#1abc9c', '#3498db', '#9b59b6', '#e67e22', '#e84393'
  ];
  let hash = 0;
  if (!id) return colors[0];
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function buildReservationCalendarEvents(resList, opts) {
  const options = opts || {};
  const events = [];
  (resList || []).forEach(function (ev) {
    const status = String(ev.status || '').toLowerCase();
    if (!['confirmed', 'procurement', 'procuring', 'preparing', 'on-going'].includes(status)) return;
    const eventDate = normalizeDateKey(ev.date);
    const prepStart = getReservationPrepStartDate(ev);
    const resColor = getColorForId(ev.id);

    // Push single multi-day event for prep period (covers up to the day before natively via exclusive end)
    if (prepStart !== eventDate) {
      events.push({
        id: ev.id + '-prep',
        title: '', // Removed 'Reserved'
        start: prepStart,
        end: eventDate, 
        allDay: true,
        color: resColor,
        textColor: '#fff',
        sortOrder: 3,
        className: 'prep-event',
        extendedProps: { reservationId: ev.id, type: 'prep' }
      });
    }

    // Push main event
    events.push({
      id: ev.id,
      title: options.includeMainEventLabel === false ? 'Event Day' : (ev.client + ' — ' + (ev.packageName || ev.type)),
      start: eventDate,
      allDay: true,
      color: resColor,
      textColor: '#fff',
      sortOrder: 0,
      extendedProps: { reservationId: ev.id, type: 'event' }
    });
  });
  return events;
}

// ===== RENDER RESERVATIONS =====
let currentFilter = 'all';

function renderReservations(filter = 'all') {
  currentFilter = filter;
  const filtered = filter === 'all' ? RESERVATIONS : RESERVATIONS.filter(r => r.status === filter);
  if (!filtered.length) {
    document.getElementById('res-tbody').innerHTML = `
      <tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-dim);">
        No ${filter === 'all' ? '' : filter} reservations found.
      </td></tr>`;
    return;
  }
  document.getElementById('res-tbody').innerHTML = filtered.map(r => {
    const obCount = getOverbookingCount(r.date);
    const isOverbooked = obCount >= 3;

    return `
      <tr class="res-row-clickable" onclick="openEventDetails('${r.id}')">
        <td>
          <div class="item-name">${r.client}</div>
          <div style="font-size:11px;color:var(--gold);margin-top:2px;">${r.packageName || r.type}</div>
          ${isOverbooked ? '<span class="badge overbooked" style="font-size:9px; margin-top:4px;"> DATE OVERBOOKED (' + obCount + ')</span>' : ''}
        </td>
        <td style="font-size:12px;color:var(--text-mid);">${r.type}</td>
        <td style="font-size:12px;color:var(--text-mid);">${r.date}</td>
        <td style="font-size:13px;">${r.pax}</td>
        <td><div style="font-family:'Arial',serif;font-size:14px;font-weight:600;color:var(--cream);">${r.displayAmount}</div></td>
        <td>
           <span class="badge ${r.status}">${r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>
           ${r.rejectionReason ? `<div style="font-size:9px; color:var(--red); margin-top:4px; max-width:100px; overflow:hidden; text-overflow:ellipsis;">Reason: ${r.rejectionReason}</div>` : ''}
        </td>
        <td>
          <div style="display:flex; gap:6px;">
            ${r.status === 'pending'
        ? `<button class="btn-approve" onclick="initiateApproval('${r.id}', event)">Approve</button>
                 <button class="btn-reject"  onclick="initiateRejection('${r.id}', event)">Reject</button>`
        : `<button class="btn-view" onclick="openEventDetails('${r.id}')">Details</button>`}
          </div>
        </td>
      </tr>`;
  }).join('');
}

function filterRes(filter, btn) {
  document.querySelectorAll('#section-reservations .tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderReservations(filter);
  renderReservationDetailsHandling();
}

function reservationEligibleForActivityLogs(r) {
  const s = String(r.status || '').toLowerCase();
  return ['confirmed', 'preparing', 'preparation', 'procurement', 'procuring', 'on-going', 'ongoing', 'completed'].includes(s);
}

function activityLogBadgeClass(cat) {
  const c = String(cat || '').toLowerCase();
  if (c === 'approval' || c === 'customer') return 'confirmed';
  if (c === 'finance') return 'pending';
  if (c === 'meeting') return 'warning';
  if (c === 'inventory' || c === 'allocation') return 'pending';
  if (c === 'execution' || c === 'tracking') return 'confirmed';
  if (c === 'bashout' || c === 'payment') return 'warning';
  return 'pending';
}

function lifecycleAnchorDate(res) {
  const dk = normalizeDateKey(res.date) || new Date().toISOString().split('T')[0];
  const x = new Date(dk + 'T12:00:00');
  return isNaN(x.getTime()) ? new Date() : x;
}

function isoShiftDays(base, dayDelta, hh, mm) {
  const d = new Date(base.getTime());
  d.setDate(d.getDate() + dayDelta);
  d.setHours(hh != null ? hh : 10, mm != null ? mm : 0, 0, 0);
  return d.toISOString();
}

function buildPlaceholderLifecycleLogs(res) {
  const anchor = lifecycleAnchorDate(res);
  const client = res.client || 'Customer';
  const pkg = res.packageName || res.type || 'Package';
  const amt = res.displayAmount || '';
  const venue = res.venue || res.venueAddress || 'Venue TBD';
  const pid = res.id || 'res';

  const rows = [
    { day: -52, hh: 9, mm: 14, cat: 'customer', title: 'Online inquiry submitted', detail: client + ' submitted an inquiry via the customer portal — preferred date noted.' },
    { day: -48, hh: 14, mm: 32, cat: 'approval', title: 'Quote package assembled', detail: 'Ops drafted ' + pkg + ' quote with tiered linen and glassware options.' },
    { day: -44, hh: 11, mm: 5, cat: 'meeting', title: 'Discovery call completed', detail: 'Customer goals captured; dietary notes flagged for chef briefing.' },
    { day: -40, hh: 16, mm: 40, cat: 'finance', title: 'Hold fee authorized', detail: 'Card authorization recorded pending contract execution.' },
    { day: -36, hh: 10, mm: 22, cat: 'approval', title: 'Reservation moved to pending approval queue', detail: 'Inventory snapshot attached for date ' + (res.date || '—') + '.' },
    { day: -34, hh: 13, mm: 55, cat: 'approval', title: 'Admin approved reservation', detail: 'Booking approved — capacity check passed for venue footprint.' },
    { day: -33, hh: 9, mm: 18, cat: 'customer', title: 'Customer acknowledged approval email', detail: 'Automated read receipt logged on proposal thread.' },
    { day: -31, hh: 15, mm: 7, cat: 'meeting', title: 'Contract meeting scheduled', detail: 'Meeting Hub — agenda: menu lock, staffing ratios, overtime window.' },
    { day: -29, hh: 11, mm: 50, cat: 'meeting', title: 'Meeting completed — menu locked', detail: 'Chef specials confirmed; vegetarian cluster noted as Table 12–14.' },
    { day: -27, hh: 17, mm: 12, cat: 'finance', title: 'Contract PDF generated', detail: 'Digital contract issued with PayMongo deposit link embedded.' },
    { day: -26, hh: 10, mm: 5, cat: 'finance', title: 'Deposit payment confirmed', detail: 'Gateway webhook received — reservation_payment bucket cleared.' },
    { day: -24, hh: 11, mm: 33, cat: 'allocation', title: 'Allocation manifest draft generated', detail: 'Equipment rules applied for ' + (res.pax || '—') + ' pax baseline.' },
    { day: -22, hh: 9, mm: 41, cat: 'inventory', title: 'Venue deduction sheet loaded', detail: 'Venue-provided tables/chairs deducted from deploy quantities.' },
    { day: -19, hh: 14, mm: 28, cat: 'inventory', title: 'Shortfall flagged on water goblets', detail: 'Scheduling shows deficit vs. requirement — rental workflow notified.' },
    { day: -17, hh: 16, mm: 55, cat: 'inventory', title: 'Rental PO grouped by supplier', detail: 'Placeholder Lumina chandelier batch merged with linens supplier route.' },
    { day: -14, hh: 8, mm: 50, cat: 'approval', title: 'Operational status → procurement', detail: 'Procurement lane opened for cold-chain disposables batch.' },
    { day: -12, hh: 13, mm: 10, cat: 'inventory', title: 'Cold-chain crates sealed for outbound', detail: 'Temperature start log 2°C — photo checksum attached.' },
    { day: -10, hh: 10, mm: 0, cat: 'customer', title: 'Guest list template emailed', detail: 'Customer asked to return CSV before seating lock.' },
    { day: -8, hh: 15, mm: 44, cat: 'meeting', title: 'Seating layout draft uploaded', detail: 'Admin SVG layout linked to reservation extra details.' },
    { day: -6, hh: 11, mm: 20, cat: 'customer', title: 'Named seating returned', detail: 'Guest CSV merged — duplicate surname flagged for verification.' },
    { day: -5, hh: 9, mm: 30, cat: 'finance', title: 'Final payment reminder sent', detail: 'Due date aligned to contract milestone +14 days placeholder.' },
    { day: -4, hh: 18, mm: 12, cat: 'finance', title: 'Final payment confirmed', detail: 'PayMongo settlement id logged — balance ' + amt + '.' },
    { day: -3, hh: 10, mm: 15, cat: 'approval', title: 'Operational status → preparing', detail: 'Prep timeline seeded; staffing roster placeholder assigned.' },
    { day: -2, hh: 14, mm: 0, cat: 'execution', title: 'Prep-week tasks logged', detail: 'Linens steam schedule + glass polish rotation stored on timeline.' },
    { day: -1, hh: 8, mm: 45, cat: 'tracking', title: 'Execution day simulation armed', detail: 'GPS tracker preset to venue geocode — customer dashboard mirroring enabled.' },
    { day: 0, hh: 5, mm: 35, cat: 'execution', title: 'Departure checklist opened', detail: 'Vehicle manifest printed — cargo bay seals photographed.' },
    { day: 0, hh: 7, mm: 12, cat: 'tracking', title: 'Live GPS tracker started', detail: 'Route ETA publishing to customer UI — status: On the way.' },
    { day: 0, hh: 8, mm: 50, cat: 'tracking', title: 'Venue dock check-in', detail: 'Security badge issued — unload lane B confirmed at ' + venue + '.' },
    { day: 0, hh: 11, mm: 30, cat: 'execution', title: 'Service execution window active', detail: 'Buffet temps logged every 20 min placeholder cadence.' },
    { day: 0, hh: 17, mm: 10, cat: 'bashout', title: 'Bash-out sweep initiated', detail: 'Damage walk started — photo pass to lifecycle queue.' },
    { day: 0, hh: 19, mm: 40, cat: 'bashout', title: 'Lifecycle bash-out scan', detail: 'Placeholder damages: 2× salad forks — customer liability flag OFF.' },
    { day: 0, hh: 21, mm: 5, cat: 'payment', title: 'Post-event PayMongo adjustment', detail: 'Placeholder ancillary charges reviewed — none applied.' },
    { day: 1, hh: 10, mm: 30, cat: 'approval', title: 'Reservation marked completed', detail: 'Final QA sign-off — warehouse restorage checklist closed.' },
    { day: 1, hh: 14, mm: 50, cat: 'customer', title: 'Feedback survey triggered', detail: 'NPS prompt dispatched to primary contact on file.' },
    { day: 3, hh: 11, mm: 0, cat: 'system', title: 'Audit trail archived', detail: 'Reservation ' + pid + ' logs frozen for reporting export.' }
  ];

  return rows.map(function (row, idx) {
    return {
      id: 'LL-' + pid + '-' + idx,
      at: isoShiftDays(anchor, row.day, row.hh, row.mm),
      category: row.cat,
      title: row.title,
      detail: row.detail,
      actor: row.cat === 'customer' ? 'Customer' : (row.cat === 'system' ? 'System' : 'Admin')
    };
  });
}

function ensureReservationLifecycleLogs(res) {
  if (!res || !res.id) return [];
  if (!window.reservationLifecycleLogs[res.id]) {
    window.reservationLifecycleLogs[res.id] = buildPlaceholderLifecycleLogs(res);
  }
  return window.reservationLifecycleLogs[res.id];
}

function selectActivityLogReservation(resId) {
  activeActivityLogResId = resId;
  renderActivityLogsSection();
}

function renderActivityLogsSection() {
  const listEl = document.getElementById('activity-logs-res-list');
  const detailEl = document.getElementById('activity-logs-detail');
  const titleEl = document.getElementById('activity-logs-title');
  const subEl = document.getElementById('activity-logs-subtitle');
  if (!listEl || !detailEl || !titleEl || !subEl) return;

  const eligible = RESERVATIONS.filter(reservationEligibleForActivityLogs);
  eligible.sort(function (a, b) {
    const da = String(a.date || '');
    const db = String(b.date || '');
    if (da !== db) return db.localeCompare(da);
    return String(a.client || '').localeCompare(String(b.client || ''));
  });

  if (!eligible.length) {
    listEl.innerHTML = '<div style="padding:18px;color:var(--text-dim);font-size:12px;">No approved or completed reservations yet.</div>';
    detailEl.innerHTML = '<div style="text-align:center;padding:40px 16px;color:var(--text-dim);font-size:13px;">Nothing to show.</div>';
    return;
  }

  if (!activeActivityLogResId || !eligible.some(function (r) { return r.id === activeActivityLogResId; })) {
    activeActivityLogResId = eligible[0].id;
  }

  const active = RESERVATIONS.find(function (r) { return r.id === activeActivityLogResId; });
  listEl.innerHTML = eligible.map(function (r) {
    const on = activeActivityLogResId === r.id;
    return `<div onclick="selectActivityLogReservation('${escAttr(r.id)}')" style="padding:12px 14px;border-bottom:1px solid var(--border);cursor:pointer;background:${on ? 'rgba(196,154,60,0.12)' : 'transparent'};">
      <div style="font-size:13px;font-weight:700;color:var(--cream);">${escHtml(r.client || 'Client')}</div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:2px;">${escHtml(r.type || 'Event')} · ${escHtml(r.date || '—')}</div>
      <div style="margin-top:6px;"><span class="badge ${escAttr(r.status)}">${escHtml(r.status || '')}</span></div>
    </div>`;
  }).join('');

  if (!active) {
    detailEl.innerHTML = '<div style="color:var(--text-dim);font-size:13px;">Reservation not found.</div>';
    return;
  }

  titleEl.textContent = (active.client || 'Client') + ' — activity';
  subEl.textContent = (active.date || '—') + ' · ' + (active.packageName || active.type || 'Reservation') + ' · ' + (active.displayAmount || '');

  const logs = ensureReservationLifecycleLogs(active).slice().sort(function (a, b) {
    return String(b.at).localeCompare(String(a.at));
  });

  detailEl.innerHTML = logs.map(function (log) {
    const dt = new Date(log.at);
    const when = isNaN(dt.getTime()) ? '—' : dt.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    const badgeCls = activityLogBadgeClass(log.category);
    return `<div style="border:1px solid var(--border);border-radius:10px;padding:12px 14px;margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;flex-wrap:wrap;">
        <div style="font-size:13px;font-weight:700;color:var(--cream);max-width:72%;">${escHtml(log.title)}</div>
        <span class="badge ${badgeCls}" style="font-size:10px;">${escHtml(log.category || 'log')}</span>
      </div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:6px;line-height:1.45;">${escHtml(log.detail || '')}</div>
      <div style="display:flex;justify-content:space-between;margin-top:10px;font-size:10px;color:var(--text-dim);flex-wrap:wrap;gap:6px;">
        <span>${escHtml(when)}</span>
        <span>${escHtml(log.actor || 'System')}</span>
      </div>
    </div>`;
  }).join('');
}

function renderReservationDetailsHandling() {
  const selector = document.getElementById('resd-approved-selector');
  const contentEl = document.getElementById('resd-content');
  if (!selector || !contentEl) return;

  const approved = RESERVATIONS.filter(function (r) {
    return ['confirmed', 'preparing', 'procurement', 'procuring', 'on-going', 'completed'].includes(String(r.status || '').toLowerCase());
  });

  if (!approved.length) {
    selector.innerHTML = '<option value="">No approved reservations found.</option>';
    contentEl.innerHTML = '<div style="text-align:center;padding:100px 20px;color:var(--text-dim);font-size:13px;">Approve a reservation first to use Reservation Details Handling.</div>';
    toggleResDetailButtons(false);
    return;
  }

  const currentOptions = approved.map(r => `<option value="${r.id}" ${activeResDetailId === r.id ? 'selected' : ''}>${escHtml(r.client)} — ${escHtml(r.type)} (${escHtml(r.date)})</option>`).join('');
  selector.innerHTML = '<option value="">Choose a confirmed reservation...</option>' + currentOptions;

  if (!activeResDetailId || !approved.find(r => r.id === activeResDetailId)) {
    // Don't auto-select if we just entered the hub, let the user pick
    toggleResDetailButtons(false);
  } else {
    toggleResDetailButtons(true);
    renderReservationDetailContent();
    renderExtraReservationDetails();
    switchResDetailsTab(resDetailsActiveTab);
  }
}

function toggleResDetailButtons(enabled) {
  ['resd-btn-edit', 'resd-btn-status'].forEach(function (id) {
    const b = document.getElementById(id);
    if (b) b.disabled = !enabled;
  });
}

function selectReservationDetail(resId) {
  if (!resId) {
    activeResDetailId = null;
    renderReservationDetailsHandling();
    return;
  }
  activeResDetailId = resId;
  resDetailMode = 'view';
  resdModifyMode = false;
  document.getElementById('resd-catalog-side').style.display = 'none';
  renderReservationDetailsHandling();
}

let resdModifyMode = false;
function toggleResdModifyMode() {
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  if (!res) return;

  resdModifyMode = !resdModifyMode;
  const side = document.getElementById('resd-catalog-side');
  const btn = document.getElementById('resd-btn-edit');

  if (resdModifyMode) {
    side.style.display = 'flex';
    btn.textContent = '✕ Stop Modifying';
    btn.style.background = 'var(--red)';
    btn.style.color = '#fff';

    // Prep catalog - hydrate names to objects if necessary
    const rawItems = Array.isArray(res.packageItems) ? res.packageItems : [];
    mtCustomPkgItems = rawItems.map(ri => {
      if (typeof ri === 'string') return CAT.find(c => c.name === ri);
      if (ri && ri.name) return CAT.find(c => c.name === ri.name);
      return null;
    }).filter(Boolean);
    
    mtPax = parseInt(res.pax) || 0;
    renderResdCatalog();
  } else {
    side.style.display = 'none';
    btn.textContent = 'Modify Reservation Details';
    btn.style.background = 'var(--gold)';
    btn.style.color = '#000';
  }
  renderReservationDetailContent();
}

function toggleResDetailButtons(enabled) {
  ['resd-btn-view', 'resd-btn-edit', 'resd-btn-status'].forEach(function (id) {
    const b = document.getElementById(id);
    if (b) b.disabled = !enabled;
  });
}

function selectReservationDetail(resId) {
  activeResDetailId = resId;
  resDetailMode = 'view';
  renderReservationDetailsHandling();
}

function setReservationDetailMode(mode) {
  resDetailMode = mode;
  renderReservationDetailContent();
}

function switchResDetailsTab(tab, btn) {
  resDetailsActiveTab = tab || 'details';
  document.querySelectorAll('#section-res-details .tab-btn').forEach(function (b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  else {
    const d = document.getElementById('resd-tab-' + resDetailsActiveTab);
    if (d) d.classList.add('active');
  }
  const panes = {
    details: document.getElementById('resd-pane-details'),
    procurement: document.getElementById('resd-pane-procurement'),
    extra: document.getElementById('resd-pane-extra'),
    timeline: document.getElementById('resd-pane-timeline'),
    design: document.getElementById('resd-pane-design'),

    food: document.getElementById('resd-pane-food'),
    staff: document.getElementById('resd-pane-staff'),
    personnel: document.getElementById('resd-pane-personnel'),
    rundown: document.getElementById('resd-pane-rundown'), summary: document.getElementById('resd-pane-summary')
  };
  Object.keys(panes).forEach(function (k) {
    if (panes[k]) panes[k].style.display = (k === resDetailsActiveTab) ? '' : 'none';
  });
  if (resDetailsActiveTab === 'procurement') renderProcurementTab();
  if (resDetailsActiveTab === 'extra') renderExtraReservationDetails();
  if (resDetailsActiveTab === 'design') renderDesignTab();

  if (resDetailsActiveTab === 'food') renderFoodTastedTab();
  if (resDetailsActiveTab === 'staff') renderStaffAllocationTab();
  if (resDetailsActiveTab === 'personnel') renderPersonnelTab();
  if (resDetailsActiveTab === 'rundown') renderFinalRundownTab();
  if (resDetailsActiveTab === 'summary') {
    const _sRes = RESERVATIONS.find(r => r.id === activeResDetailId);
    if (_sRes && typeof window.renderReservationSummary === 'function') window.renderReservationSummary(_sRes);
  }
  if (resDetailsActiveTab === 'timeline') {
    renderReservationTimelineView();
    // If the execution map was initialized while hidden, force Leaflet relayout.
    if (resExecMap && typeof resExecMap.invalidateSize === 'function') {
      setTimeout(function () { resExecMap.invalidateSize(); }, 80);
    }
  }
}

function getReservationNeedsMarkup(res) {
  const pax = parseInt(res.pax) || 0;
  const tables = Math.ceil(pax * 0.125);
  const lines = [];
  (ALLOC_RULES || []).forEach(function (rule) {
    let qty = 0;
    if (rule.ruleType === 'per_pax') qty = Math.ceil(pax * rule.ratio);
    else if (rule.ruleType === 'per_table') qty = Math.ceil(tables * rule.ratio);
    else if (rule.ruleType === 'flat') qty = rule.ratio;
    if (rule.isFragile) qty = Math.ceil(qty * 1.1);
    if (qty > 0) lines.push(`<div class="req-item"><div class="req-info"><span class="req-name">${escHtml(rule.name)}</span><span class="req-cat">${escHtml(rule.category)} · ${escHtml(rule.note || '')}</span></div><span class="req-val">${qty}</span></div>`);
  });
  return lines.length ? lines.join('') : '<div style="font-size:12px;color:var(--text-dim);">No computed requirements available.</div>';
}

async function renderReservationDetailContent() {
  const res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  const titleEl = document.getElementById('resd-title');
  const subtitleEl = document.getElementById('resd-subtitle');
  const contentEl = document.getElementById('resd-content');
  if (!res || !titleEl || !subtitleEl || !contentEl) return;

  titleEl.textContent = (res.client || 'Client') + ' — ' + (res.packageName || res.type || 'Reservation');
  subtitleEl.textContent = (res.date || '—') + ' · ' + (res.pax || '—') + ' pax';

  if (resDetailMode === 'status') {
    renderResdStatusEditor(res, contentEl);
    return;
  }

  // Media Header (Side-by-Side: Contract | GPS Map)
  let mediaHeader = '';
  const venueTitle = res.venueName || res.venue || 'Venue Location';
  const venueAddr = res.venueAddress || res.venueAddr || res.venueName || res.venue || '';

  mediaHeader = `
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:30px;">
      <!-- LEFT: Contract Document -->
      <div class="panel" style="margin:0; padding:0; overflow:hidden; border:1px solid var(--border); background:var(--bg3); display:flex; flex-direction:column;">
        <div class="panel-hdr" style="background:rgba(255,255,255,0.02); padding:10px 15px;">
           <div class="panel-title" style="font-size:12px;"> Signed Contract</div>
           ${res.contractUrl ? `<a href="${res.contractUrl}" target="_blank" class="btn-primary" style="font-size:10px; padding:4px 10px; background:var(--gold); color:#000; text-decoration:none; font-weight:700;">View </a>` : ''}
        </div>
        <div class="doc-zoom-container" style="flex:1; min-height:320px; padding:15px;">
           ${res.contractUrl ? 
             `
             <img src="${res.contractUrl.toLowerCase().includes('.pdf') ? res.contractUrl.replace('/upload/', '/upload/pg_1,f_jpg,w_800,c_limit/') : res.contractUrl}" class="doc-zoom-img" style="max-width:100%; max-height:300px; border-radius:4px; box-shadow:0 10px 25px rgba(0,0,0,0.5);" />
             <div class="doc-zoom-controls">
                <button class="btn-zoom" onclick="zoomDoc(this, 0.2)">+</button>
                <button class="btn-zoom" onclick="zoomDoc(this, -0.2)">-</button>
             </div>
             ` :
             `<div style="color:var(--text-dim); font-size:13px; text-align:center;">No signed contract<br/>uploaded yet.</div>`
           }
        </div>
      </div>

      <!-- RIGHT: GPS Map -->
      <div class="panel" style="margin:0; padding:0; overflow:hidden; border:1px solid var(--border); background:var(--bg3); display:flex; flex-direction:column;">
        <div class="panel-hdr" style="background:rgba(255,255,255,0.02); padding:10px 15px;">
           <div class="panel-title" style="font-size:12px;"> GPS Venue Location</div>
        </div>
        <div id="resd-map" style="flex:1; background:var(--bg); min-height:320px; position:relative;">
           <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; color:var(--text-dim); font-size:12px; z-index:10;">Loading Map...</div>
        </div>
        <div style="padding:15px; background:rgba(0,0,0,0.2); border-top:1px solid var(--border);">
            <div style="margin-bottom:10px;">
                <div style="font-size:11px; font-weight:700; color:var(--gold);">${escHtml(venueTitle)}</div>
                <div style="font-size:10px; color:var(--text-mid); line-height:1.3; margin-top:2px;">${escHtml(venueAddr || 'Address not specified')}</div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; padding-top:10px; border-top:1px solid rgba(255,255,255,0.05);">
                <div style="font-size:11px; color:var(--text-dim);">Est. Travel (with 10m buffer)</div>
                <div style="font-size:12px; color:var(--cream); font-weight:700;" id="resd-map-eta">Calculating...</div>
            </div>
            ${res.venueSurcharge ? `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; color:var(--red);">
                <div style="font-size:11px;">Out-of-Manila Surcharge (5%)</div>
                <div style="font-size:12px; font-weight:700;">₱${res.venueSurcharge.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
            </div>
            ` : ''}
        </div>
      </div>
    </div>
  `;

  // Detailed Metadata Grid
  let detailGrid = '';
  if (resdModifyMode) {
    // Parse time range
    let tStart = '08:00';
    let tEnd = '17:00';
    if (res.time && res.time.includes('-')) {
      const parts = res.time.split('-');
      if (parts.length === 2) {
        // Simple heuristic for parsing if they are standard format, but HTML time input expects HH:mm
        // Let's try to extract numbers
        const extractTime = (str) => {
          const match = str.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?/i);
          if (!match) return '12:00';
          let h = parseInt(match[1]);
          let m = match[2] || '00';
          const ampm = (match[3] || '').toUpperCase();
          if (ampm === 'PM' && h < 12) h += 12;
          if (ampm === 'AM' && h === 12) h = 0;
          return `${h.toString().padStart(2, '0')}:${m}`;
        };
        tStart = extractTime(parts[0]);
        tEnd = extractTime(parts[1]);
      }
    }

    detailGrid = `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:25px; margin-bottom:40px;">
         <div class="panel" style="margin:0; background:rgba(255,255,255,0.02); border:1px solid var(--gold);">
            <div class="panel-hdr" style="padding:12px 18px; background:rgba(255,255,255,0.03);"><div class="panel-title" style="font-size:11px; color:var(--gold);">Editing Event Profile</div></div>
            <div style="padding:18px; display:grid; grid-template-columns:120px 1fr; gap:12px; font-size:13px; align-items:center;">
               <div style="color:var(--text-dim);">Event Type</div><input type="text" id="edit-ev-type" class="input-field" value="${escAttr(res.type || '')}">
               <div style="color:var(--text-dim);">Theme</div><input type="text" id="edit-ev-theme" class="input-field" value="${escAttr(res.theme || '')}">
               <div style="color:var(--text-dim);">Motif / Colors</div><input type="text" id="edit-ev-motif" class="input-field" value="${escAttr(res.motif || '')}">
               <div style="color:var(--text-dim);">Guest Count</div>
               <div style="display:flex; gap:10px;">
                 <input type="number" id="edit-ev-pax" class="input-field" value="${escAttr(String(res.pax || '0'))}" style="width:70px;" placeholder="Pax">
                 <input type="number" id="edit-ev-vip" class="input-field" value="${escAttr(String(res.vipCount || '0'))}" style="width:70px;" placeholder="VIP">
               </div>
            </div>
         </div>
         <div class="panel" style="margin:0; background:rgba(255,255,255,0.02); border:1px solid var(--gold);">
            <div class="panel-hdr" style="padding:12px 18px; background:rgba(255,255,255,0.03);"><div class="panel-title" style="font-size:11px; color:var(--gold);">Editing Venue & Timing</div></div>
            <div style="padding:18px; display:grid; grid-template-columns:120px 1fr; gap:12px; font-size:13px; align-items:center;">
               <div style="color:var(--text-dim);">Venue Name</div><input type="text" id="edit-vn-name" class="input-field" value="${escAttr(res.venueName || res.venue || '')}">
               <div style="color:var(--text-dim);">Location</div><input type="text" id="edit-vn-loc" class="input-field" value="${escAttr(venueAddr || '')}">
               <div style="color:var(--text-dim);">Date</div><input type="date" id="edit-vn-date" class="input-field" value="${escAttr(res.date || '')}">
               <div style="color:var(--text-dim);">Time Range</div>
               <div style="display:flex; gap:5px; align-items:center;">
                  <input type="time" id="edit-vn-tstart" class="input-field" value="${tStart}" style="padding:6px; font-size:12px;">
                  <span style="color:var(--text-dim);">to</span>
                  <input type="time" id="edit-vn-tend" class="input-field" value="${tEnd}" style="padding:6px; font-size:12px;">
               </div>
            </div>
         </div>
         <div class="panel" style="margin:0; background:rgba(255,255,255,0.02); border:1px solid var(--gold);">
            <div class="panel-hdr" style="padding:12px 18px; background:rgba(255,255,255,0.03);"><div class="panel-title" style="font-size:11px; color:var(--gold);">Editing Financial Snapshot</div></div>
            <div style="padding:18px; display:grid; grid-template-columns:120px 1fr; gap:12px; font-size:13px; align-items:center;">
               <div style="color:var(--text-dim);">Total Amount</div>
               <div style="display:flex; align-items:center; gap:5px;"><span style="color:var(--text-dim);">₱</span><input type="number" id="edit-fin-amount" class="input-field" value="${safeNum(res.amount)}" style="flex:1;"></div>
               <div style="color:var(--text-dim);">Payment Status</div>
               <select id="edit-fin-status" class="input-field">
                  <option value="pending" ${res.paymentStatus === 'pending' ? 'selected' : ''}>Pending</option>
                  <option value="partial" ${res.paymentStatus === 'partial' ? 'selected' : ''}>Partial</option>
                  <option value="paid" ${res.paymentStatus === 'paid' ? 'selected' : ''}>Paid</option>
               </select>
               <div style="color:var(--text-dim);">Initial Fee</div>
               <div style="display:flex; align-items:center; gap:5px;"><span style="color:var(--text-dim);">₱</span><input type="number" id="edit-fin-init" class="input-field" value="${safeNum(res.paymentAmount)}" style="flex:1;"></div>
               <div style="color:var(--text-dim);">Downpayment</div>
               <div style="display:flex; align-items:center; gap:5px;"><span style="color:var(--text-dim);">₱</span><input type="number" id="edit-fin-dp" class="input-field" value="${safeNum(res.downpaymentAmount)}" style="flex:1;"></div>
            </div>
         </div>
      </div>
    `;
  } else {
    detailGrid = `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:25px; margin-bottom:40px;">
         <div class="panel" style="margin:0; background:rgba(255,255,255,0.02);">
            <div class="panel-hdr" style="padding:12px 18px; background:rgba(255,255,255,0.03);"><div class="panel-title" style="font-size:11px; color:var(--gold);">Event Profile</div></div>
            <div style="padding:18px; display:grid; grid-template-columns:120px 1fr; gap:12px; font-size:13px;">
               <div style="color:var(--text-dim);">Event Type</div><div>${escHtml(res.type || '—')}</div>
               <div style="color:var(--text-dim);">Theme</div><div>${escHtml(res.theme || '—')}</div>
               <div style="color:var(--text-dim);">Motif / Colors</div><div>${escHtml(res.motif || '—')}</div>
               <div style="color:var(--text-dim);">Guest Count</div><div>${escHtml(String(res.pax || '0'))} pax (VIP: ${escHtml(String(res.vipCount || '0'))})</div>
            </div>
         </div>
         <div class="panel" style="margin:0; background:rgba(255,255,255,0.02);">
            <div class="panel-hdr" style="padding:12px 18px; background:rgba(255,255,255,0.03);"><div class="panel-title" style="font-size:11px; color:var(--gold);">Venue & Timing</div></div>
            <div style="padding:18px; display:grid; grid-template-columns:120px 1fr; gap:12px; font-size:13px;">
               <div style="color:var(--text-dim);">Venue Name</div><div>${escHtml(res.venueName || res.venue || '—')}</div>
               <div style="color:var(--text-dim);">Location</div><div style="font-size:11px; line-height:1.4;">${escHtml(venueAddr || '—')}</div>
               <div style="color:var(--text-dim);">Date</div><div>${escHtml(res.date || '—')}</div>
               <div style="color:var(--text-dim);">Time Range</div><div>${escHtml(res.time || '—')}</div>
            </div>
         </div>
         <div class="panel" style="margin:0; background:rgba(255,255,255,0.02);">
            <div class="panel-hdr" style="padding:12px 18px; background:rgba(255,255,255,0.03);"><div class="panel-title" style="font-size:11px; color:var(--gold);">Financial Snapshot</div></div>
            <div style="padding:18px; display:grid; grid-template-columns:120px 1fr; gap:12px; font-size:13px;">
               <div style="color:var(--text-dim);">Total Amount</div><div style="font-weight:700; color:var(--cream);">₱${safeNum(res.amount).toLocaleString()}</div>
               <div style="color:var(--text-dim);">Payment Status</div><div><span class="badge ${escAttr(res.paymentStatus || 'pending')}">${escHtml(res.paymentStatus || 'pending')}</span></div>
               <div style="color:var(--text-dim);">Initial Fee</div><div>₱${safeNum(res.paymentAmount).toLocaleString()}</div>
               <div style="color:var(--text-dim);">Downpayment</div><div>₱${safeNum(res.downpaymentAmount).toLocaleString()} (Due: ${escHtml(res.downpaymentDueDate || '—')})</div>
            </div>
         </div>
      </div>
    `;
  }


  // Package Items & Modification Mode
  let packageContent = '';
  if (resdModifyMode) {
    packageContent = `
      <div class="panel" style="border:1px solid var(--gold); background:rgba(196,154,60,0.03);">
        <div class="panel-hdr" style="background:rgba(196,154,60,0.05);">
           <div class="panel-title"> Modifying Package Items</div>
           <div style="font-size:18px; font-weight:700; color:var(--gold);">Total: ₱${calculateMtPrice().toLocaleString()}</div>
        </div>
        <div style="padding:20px;">
           <div id="resd-modify-items-list" style="display:flex; flex-direction:column; gap:8px;">
              ${mtCustomPkgItems.map(item => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 15px; background:var(--bg3); border-radius:8px;">
                   <div style="font-size:13px;">${escHtml(item.name)}</div>
                   <button onclick="removeResdItem('${escHtml(item.name)}')" style="background:none; border:none; color:var(--red); cursor:pointer; font-size:18px;">✕</button>
                </div>
              `).join('')}
           </div>
           <div style="margin-top:20px; display:flex; justify-content:flex-end;">
              <button class="btn-primary" onclick="saveResdPackageChanges()" style="background:var(--green); color:#fff; padding:10px 30px;">✓ Save Updated Package & Price</button>
           </div>
        </div>
      </div>
    `;
  } else {
    packageContent = `
      <div style="margin-bottom:40px;">
        <div style="font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">
           <span>Included Items by Category</span>
           <span style="color:var(--gold); font-weight:700;">Package: ${escHtml(res.packageName || 'Custom Mod')}</span>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; align-items:start;">
           <div class="panel" style="margin:0;">
              <div class="panel-hdr" style="background:var(--bg3);"><div class="panel-title" style="font-size:11px;">Current Package Contents</div></div>
              <div id="resd-needs-list" style="padding:15px;">
                 ${(res.packageItems || []).map(item => `
                   <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border);">
                      <div style="font-size:13px; color:var(--cream);">${escHtml(item)}</div>
                      <div style="font-size:11px; color:var(--text-dim);">Included</div>
                   </div>
                 `).join('')}
              </div>
           </div>
           <div class="panel" style="margin:0;">
              <div class="panel-hdr" style="background:var(--bg3);"><div class="panel-title" style="font-size:11px;">Operational Requirements</div></div>
              <div style="padding:15px;">${getReservationNeedsMarkup(res)}</div>
           </div>
        </div>
      </div>
    `;
  }

  // Meetings History
  const meetingsSection = `
    <div style="margin-top:40px;">
       <div style="font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:15px;">Meetings Concluded History</div>
       <div id="resd-meetings-history">
          <div style="text-align:center; padding:20px; color:var(--text-dim); font-style:italic;">Loading history...</div>
       </div>
    </div>
  `;

  contentEl.innerHTML = mediaHeader + detailGrid + packageContent + meetingsSection;

  // Trigger Map Init
  if (venueAddr) {
    setTimeout(() => initResdMap(venueAddr), 80);
  }

  // Fetch meetings history in background
  fetchResdMeetingsHistory(res.id);
}


async function renderFoodTastedTab() {
  const container = document.getElementById('resd-food-content');
  if (!container || !activeResDetailId) return;

  container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-dim);">Loading food tasting data...</div>';

  try {
    const { collection, query, where, getDocs, orderBy, limit } = window.firebaseFns;
    const q = query(collection(window.firebaseDB, 'FoodTaste'),
      where('reservationId', '==', activeResDetailId),
      orderBy('createdAt', 'desc'),
      limit(1));
    const snap = await getDocs(q);

    if (snap.empty) {
      container.innerHTML = '<div style="text-align:center; padding:100px 20px; color:var(--text-dim);">No Food Tasting records found for this reservation.</div>';
      return;
    }

    const data = snap.docs[0].data();
    container.innerHTML = `
      <div class="panel" style="background:var(--bg3); padding:25px; border:1px solid var(--border); border-radius:12px;">
        <h3 style="color:var(--gold); font-size:14px; margin-bottom:20px; text-transform:uppercase;">Food Tasting Results</h3>
        <table class="inv-table">
          <thead>
            <tr>
              <th>Dish Name</th>
              <th>Status</th>
              <th>Decision</th>
              <th>Remarks / Adjustments</th>
            </tr>
          </thead>
          <tbody>
            ${(data.dishes || []).map(item => `
              <tr>
                <td style="font-weight:600; color:var(--cream);">${item.dish}</td>
                <td><span class="badge ${item.tried ? 'confirmed' : 'pending'}">${item.tried ? 'Tried' : 'Not Tried'}</span></td>
                <td><span class="badge ${item.decision === 'approved' ? 'confirmed' : (item.decision === 'rejected' ? 'red' : 'warning')}">${item.decision || '—'}</span></td>
                <td style="font-size:12px; color:var(--text-mid);">${item.remarks || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="margin-top:30px;">
           <h3 style="color:var(--gold); font-size:14px; margin-bottom:15px; text-transform:uppercase;">Tasting Documents / Photos</h3>
           <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap:15px;">
              ${(data.documents || []).map(file => {
                const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
                const displayUrl = isPDF ? file.url.replace('/upload/', '/upload/pg_1,f_jpg,w_400,c_limit/') : file.url;
                return `
                  <div style="border:1px solid var(--border); border-radius:8px; overflow:hidden; background:var(--bg);">
                    <a href="${file.url}" target="_blank">
                      <img src="${displayUrl}" style="width:100%; height:120px; object-fit:cover;" />
                    </a>
                    <div style="padding:6px; font-size:10px; color:var(--text-dim); text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${file.name}</div>
                  </div>
                `;
              }).join('') || '<div style="color:var(--text-dim); font-size:12px;">No documents uploaded.</div>'}
           </div>
        </div>
      </div>
    `;
  } catch (e) {
    console.error(e);
    container.innerHTML = '<div style="color:var(--red); padding:20px;">Error loading food tasting data.</div>';
  }
}

function renderMtModeDesignPanel(res) {
  const container = document.getElementById('mt-design-items-list');
  if (!container) return;

  const items = res.packageItems || [];
  // Filter for items that are likely decoration or equipment
  const decorItems = items.filter(item => {
    const entry = CAT.find(c => c.name === item);
    return entry && (entry.cat === 'decoration' || entry.cat === 'equipment');
  });

  container.innerHTML = decorItems.map(item => {
    const catalog = DESIGN_CATALOG[item] || DESIGN_CATALOG['Default Decoration'];
    const components = DECOR_COMPONENTS[item] || [];
    
    return `
      <div class="design-row" data-item-name="${item}" style="background:rgba(255,255,255,0.03); padding:20px; border-radius:12px; border:1px solid var(--border);">
        <div style="display:grid; grid-template-columns: 1fr 1.5fr; gap:20px; margin-bottom:20px;">
          <div>
            <div style="font-weight:700; color:var(--gold); font-size:15px; margin-bottom:10px;">${item}</div>
            
            ${item !== 'Letter Standee' && components.length > 0 ? `
              <div style="margin-bottom:15px;">
                <div style="font-size:11px; color:var(--text-dim); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">Included Components:</div>
                <div style="display:flex; flex-wrap:wrap; gap:8px;">
                  ${components.map(c => `
                    <div style="background:rgba(255,255,255,0.05); padding:4px 10px; border-radius:6px; font-size:11px; color:var(--cream); border:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center; gap:10px;">
                      <span>${c.name}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <textarea class="design-note input-field" placeholder="Notes for ${item}..." style="height:100px; font-size:13px;"></textarea>
          </div>
          <div>
            <div style="font-size:11px; color:var(--text-dim); text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">Catalog Options (Select One)</div>
            <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:10px;">
              ${catalog.map(img => `
                <img src="${img}" class="catalog-img" onclick="selectDesignImg(this)" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:6px; cursor:pointer; border:2px solid transparent; transition:all 0.2s;" />
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('') || '<div style="color:var(--text-dim); padding:20px; text-align:center;">No decoration items found in this package.</div>';
}

window.selectDesignImg = function(el) {
  const row = el.closest('div');
  row.querySelectorAll('.catalog-img').forEach(img => {
    img.style.borderColor = 'transparent';
    img.classList.remove('selected');
  });
  el.style.borderColor = 'var(--gold)';
  el.classList.add('selected');
};

async function renderDesignTab() {
  const container = document.getElementById('resd-pane-design'); // Assuming this exists or using resd-content
  if (!container || !activeResDetailId) return;

  container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-dim);">Loading design data...</div>';

  try {
    const { collection, query, where, getDocs, orderBy, limit } = window.firebaseFns;
    const q = query(collection(window.firebaseDB, 'designs'),
      where('reservationId', '==', activeResDetailId),
      orderBy('createdAt', 'desc'),
      limit(1));
    const snap = await getDocs(q);

    if (snap.empty) {
      container.innerHTML = '<div style="text-align:center; padding:100px 20px; color:var(--text-dim);">No Design Assessment records found.</div>';
      return;
    }

    const data = snap.docs[0].data();
    let html = `
      <div class="panel" style="background:var(--bg3); padding:25px; border:1px solid var(--border); border-radius:12px; margin-bottom:25px;">
        <h3 style="color:var(--gold); font-size:14px; margin-bottom:20px; text-transform:uppercase;">Final Design Selection</h3>
        <div style="display:flex; flex-direction:column; gap:20px;">
          ${(data.items || []).map(item => `
            <div style="display:grid; grid-template-columns: 150px 1fr 2fr; gap:20px; align-items:start; padding-bottom:20px; border-bottom:1px solid var(--border);">
               ${item.selectedImg ? `<img src="${item.selectedImg}" style="width:100%; border-radius:8px;" />` : `<div style="width:100%; aspect-ratio:1; background:var(--bg2); border-radius:8px; display:flex; align-items:center; justify-content:center; color:var(--text-dim); font-size:10px;">No image</div>`}
               <div>
                  <div style="font-weight:700; color:var(--cream);">${item.itemName}</div>
               </div>
               <div style="font-size:13px; color:var(--text-mid); font-style:italic;">"${item.note || 'No specific notes.'}"</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    if (data.uploadedPhotos && data.uploadedPhotos.length > 0) {
      html += `
        <div class="panel" style="background:var(--bg3); padding:25px; border:1px solid var(--border); border-radius:12px;">
          <h3 style="color:var(--gold); font-size:14px; margin-bottom:20px; text-transform:uppercase;"> Reference Photos & Documents</h3>
          <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap:15px;">
            ${data.uploadedPhotos.map(file => {
              const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
              const displayUrl = isPDF ? file.url.replace('/upload/', '/upload/pg_1,f_jpg,w_400,c_limit/') : file.url;
              return `
                <div style="border:1px solid var(--border); border-radius:10px; overflow:hidden; background:var(--bg);">
                  <a href="${file.url}" target="_blank">
                    <img src="${displayUrl}" style="width:100%; height:140px; object-fit:cover;" />
                  </a>
                  <div style="padding:8px; font-size:11px; color:var(--text-dim); text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${file.name}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }
    container.innerHTML = html;
  } catch (e) {
    console.error(e);
    container.innerHTML = '<div style="color:var(--red); padding:20px;">Error loading design data.</div>';
  }
}

async function renderStaffAllocationTab() {
  const container = document.getElementById('resd-staff-content');
  if (!container || !activeResDetailId) return;

  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  if (!res) return;

  container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-dim);">Loading staff data...</div>';

  try {
    const { collection, getDocs, query, where } = window.firebaseFns || {};
    const db = window.firebaseDB;

    // Fetch all staff
    const staffQuery = query(collection(db, 'users'), where('role', '==', 'staff'));
    const staffSnap = await getDocs(staffQuery);
    const allStaff = [];
    staffSnap.forEach(d => {
      allStaff.push({ id: d.id, ...d.data() });
    });

    const otherRes = RESERVATIONS.filter(d => d.date === res.date && d.id !== res.id);
    const busyStaffIds = new Set();
    otherRes.forEach(r => {
      if (r.executionPlan && r.executionPlan.phases) {
        r.executionPlan.phases.forEach(p => {
          p.tasks.forEach(t => (t.staffIds || []).forEach(id => busyStaffIds.add(id)));
        });
      }
    });

    if (!res.executionPlan) {
        // Initialize default plan if missing
        const tStart = '10:00';
        const tEnd = '15:00';
        const subH = (t, h) => { let [H, M] = t.split(':'); H = Math.max(0, parseInt(H) - h); return `${H.toString().padStart(2, '0')}:${M}`; };
        const addH = (t, h) => { let [H, M] = t.split(':'); H = Math.min(23, parseInt(H) + h); return `${H.toString().padStart(2, '0')}:${M}`; };
        res.executionPlan = {
            phases: [
                { id: 'departure', name: 'Departure', start: subH(tStart, 3), end: subH(tStart, 2), tasks: [{ text: 'Count equipment', staffIds: [] }] },
                { id: 'deployment', name: 'Deployment', start: subH(tStart, 2), end: tStart, tasks: [{ text: 'Count equipment', staffIds: [] }, { text: 'Set up venue', staffIds: [] }] },
                { id: 'execution', name: 'Execution', start: tStart, end: tEnd, tasks: [{ text: 'Count equipment', staffIds: [] }, { text: 'Serve guests', staffIds: [] }] },
                { id: 'bashout', name: 'Bashout', start: tEnd, end: addH(tEnd, 1), tasks: [{ text: 'Count equipment', staffIds: [] }, { text: 'Pack equipment', staffIds: [] }] },
                { id: 'restorage', name: 'Restorage', start: addH(tEnd, 1), end: addH(tEnd, 2), tasks: [{ text: 'Count equipment', staffIds: [] }, { text: 'Unload transport', staffIds: [] }] }
            ]
        };
    }

    // --- ANALYTICS ---
    const phases = res.executionPlan.phases;
    const startStr = phases[0].start;
    const endStr = phases[phases.length - 1].end;
    const toMins = (t) => { let [h, m] = t.split(':'); return (parseInt(h) * 60) + parseInt(m); };
    let diff = toMins(endStr) - toMins(startStr);
    if (diff < 0) diff += 1440;
    const totalHours = diff / 60;

    const assignedStaffIds = new Set();
    phases.forEach(p => p.tasks.forEach(t => (t.staffIds || []).forEach(id => assignedStaffIds.add(id))));
    const staffCount = assignedStaffIds.size;
    const hourlyRate = 150;
    const totalStaffCost = totalHours * staffCount * hourlyRate;

    const formatTimePart = (t) => {
        let [h, m] = t.split(':');
        const hh = parseInt(h);
        return `${hh % 12 || 12}:${m} ${hh >= 12 ? 'PM' : 'AM'}`;
    };

    container.innerHTML = `
      <div class="talent-analytics-banner" style="margin-bottom:25px; background:rgba(196,154,60,0.02);">
        <div class="t-stat-block">
            <div class="t-stat-lbl">Staff Deployment Window</div>
            <div class="t-stat-val">${formatTimePart(startStr)} - ${formatTimePart(endStr)}</div>
        </div>
        <div class="t-stat-block">
            <div class="t-stat-lbl">Total Work Hours</div>
            <div class="t-stat-val">${totalHours.toFixed(1)} Hours</div>
        </div>
        <div class="t-stat-block">
            <div class="t-stat-lbl">Estimated Staff Cost (₱${hourlyRate}/hr)</div>
            <div class="t-stat-val">₱${totalStaffCost.toLocaleString()}</div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: 280px 1fr; gap:30px;">
        <!-- LEFT: All Staff List -->
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <h3 style="color:var(--gold); font-size:12px; margin:0; text-transform:uppercase;">Available Staff Pool</h3>
          </div>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${allStaff.map(s => {
              const isBusy = busyStaffIds.has(s.id);
              const isAssignedToThis = assignedStaffIds.has(s.id);
              return `
                <div style="padding:12px; background:var(--bg3); border-radius:10px; border:1px solid ${isAssignedToThis ? 'var(--gold)' : 'var(--border)'}; opacity:${isBusy && !isAssignedToThis ? '0.6' : '1'};">
                    <div style="font-size:13px; font-weight:700; color:${isAssignedToThis ? 'var(--gold)' : 'var(--cream)'};">${s.name}</div>
                    <div style="font-size:10px; color:var(--text-dim); margin-top:2px;">
                        ${isAssignedToThis ? '✓ Assigned to activities' : (isBusy ? ' Busy on this date' : 'Available')}
                    </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- RIGHT: Task-Based Allocation -->
        <div style="display:flex; flex-direction:column; gap:24px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:1px solid var(--border); padding-bottom:12px;">
            <div>
              <h3 style="color:var(--gold); font-size:16px; margin:0; text-transform:uppercase; letter-spacing:1px;">Activity Task Allocation</h3>
              <p style="margin:4px 0 0; color:var(--text-dim); font-size:11px;">Assign specific personnel to operational phases and service tasks</p>
            </div>
            <div style="font-size:11px; color:var(--gold); font-weight:700; background:rgba(196,154,60,0.1); padding:4px 12px; border-radius:20px; border:1px solid rgba(196,154,60,0.2);">
              ${assignedStaffIds.size} Staff Assigned
            </div>
          </div>
          
          <div style="display:grid; grid-template-columns: 1fr; gap:20px;">
            ${phases.map((p, pIdx) => `
              <div style="background:var(--bg2); border:1px solid var(--border); border-radius:16px; overflow:hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
                <div style="padding:16px 20px; background:linear-gradient(90deg, rgba(196,154,60,0.15), transparent); border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
                  <div style="display:flex; align-items:center; gap:12px;">
                    <div style="width:36px; height:36px; background:var(--gold); color:#000; border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:16px;">${p.name[0]}</div>
                    <div>
                      <div style="font-weight:800; font-size:15px; color:var(--cream);">${p.name}</div>
                      <div style="font-size:11px; color:var(--gold); font-weight:700;">${formatTimePart(p.start)} — ${formatTimePart(p.end)}</div>
                    </div>
                  </div>
                </div>
                <div style="padding:20px; display:flex; flex-direction:column; gap:20px;">
                  ${p.tasks.map((t, tIdx) => `
                    <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:16px;">
                      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <div style="font-size:13px; font-weight:700; color:var(--gold); display:flex; align-items:center; gap:8px;">
                          <span style="width:6px; height:6px; background:var(--gold); border-radius:50%;"></span>
                          ${t.text}
                        </div>
                        <div style="font-size:10px; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.5px;">${(t.staffIds || []).length} assigned</div>
                      </div>
                      <div style="display:flex; flex-wrap:wrap; gap:6px;">
                        ${allStaff.map(s => {
                          const isAssigned = (t.staffIds || []).includes(s.id);
                          return `
                            <div onclick="toggleStaffInAllocationTask(${pIdx}, ${tIdx}, '${s.id}')" 
                                 style="padding:6px 14px; border-radius:8px; font-size:11px; font-weight:600; cursor:pointer; 
                                        background:${isAssigned ? 'var(--gold)' : 'rgba(255,255,255,0.03)'}; 
                                        color:${isAssigned ? '#000' : 'var(--text-mid)'}; 
                                        border:1px solid ${isAssigned ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}; 
                                        transition:all 0.2s ease;
                                        display:flex; align-items:center; gap:6px;">
                              <span style="font-size:14px; line-height:1;">${isAssigned ? '✓' : '+'}</span>
                              ${s.name}
                            </div>
                          `;
                        }).join('')}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  } catch (e) {
    console.error(e);
    container.innerHTML = '<div style="color:var(--red); padding:20px;">Error loading staff allocation.</div>';
  }
}

window.toggleStaffInAllocationTask = async function(pIdx, tIdx, staffId) {
    const res = RESERVATIONS.find(r => r.id === activeResDetailId);
    if (!res || !res.executionPlan) return;
    const task = res.executionPlan.phases[pIdx].tasks[tIdx];
    if (!task.staffIds) task.staffIds = [];
    const idx = task.staffIds.indexOf(staffId);
    if (idx === -1) task.staffIds.push(staffId);
    else task.staffIds.splice(idx, 1);
    
    try {
        const { updateDoc, doc } = window.firebaseFns;
        await updateDoc(doc(window.firebaseDB, 'reservations', res.id), { executionPlan: res.executionPlan });
        renderStaffAllocationTab();
    } catch(e) { console.error(e); }
};

async function fetchResdMeetingsHistory(resId) {
  const historyEl = document.getElementById('resd-meetings-history');
  if (!historyEl) return;

  try {
    const { collection, query, where, getDocs, orderBy } = window.firebaseFns;
    const q = query(collection(window.firebaseDB, 'meetings'), where('reservationId', '==', resId), where('status', '==', 'completed'), orderBy('date', 'desc'));
    const snap = await getDocs(q);

    if (snap.empty) {
      historyEl.innerHTML = '<div style="padding:20px; text-align:center; background:rgba(255,255,255,0.02); border-radius:12px; color:var(--text-dim); font-size:13px;">No completed meetings found for this reservation.</div>';
      return;
    }

    historyEl.innerHTML = snap.docs.map(doc => {
      const mt = doc.data();
      return `
        <div class="panel" style="margin-bottom:12px; background:rgba(255,255,255,0.03);">
          <div style="padding:15px 20px; display:flex; justify-content:space-between; align-items:center;">
             <div style="display:flex; align-items:center; gap:15px;">
                <div style="width:40px; height:40px; border-radius:50%; background:var(--gold); color:#000; display:flex; justify-content:center; align-items:center; font-weight:700;">MT</div>
                <div>
                   <div style="font-size:14px; font-weight:700; color:var(--cream);">${escHtml(mt.agenda || 'Meeting')}</div>
                   <div style="font-size:11px; color:var(--text-dim);">${escHtml(mt.date)} · ${escHtml(mt.time || '')}</div>
                </div>
             </div>
             ${mt.contractUrl ? `<a href="${mt.contractUrl}" target="_blank" class="btn-outline" style="font-size:10px; padding:5px 12px;">View Snapshot Document</a>` : ''}
          </div>
          ${mt.notes ? `<div style="padding:0 20px 15px 75px; font-size:12px; color:var(--text-mid); line-height:1.5;"><strong>Notes:</strong> ${escHtml(mt.notes)}</div>` : ''}
        </div>
      `;
    }).join('');

  } catch (e) {
    console.error(e);
    historyEl.innerHTML = '<div style="color:var(--red);">Error loading meeting history.</div>';
  }
}

function renderResdStatusEditor(res, contentEl) {
  contentEl.innerHTML = `
    <div style="max-width:500px; padding:20px; background:var(--bg3); border-radius:12px; border:1px solid var(--border);">
      <div style="font-size:14px; font-weight:700; color:var(--cream); margin-bottom:15px;">Update Operational Status</div>
      <div class="form-group">
        <label>Current Stage</label>
        <select id="resd-status-select" class="input-field" style="height:45px;">
          <option value="confirmed" ${res.status === 'confirmed' ? 'selected' : ''}>Confirmed (Planning)</option>
          <option value="procuring" ${res.status === 'procuring' ? 'selected' : ''}>Procurement (Buying Items)</option>
          <option value="preparing" ${res.status === 'preparing' ? 'selected' : ''}>Preparation (Readying Venue/Food)</option>
          <option value="on-going" ${res.status === 'on-going' ? 'selected' : ''}>On-going (Day of Event)</option>
          <option value="completed" ${res.status === 'completed' ? 'selected' : ''}>Completed (Success)</option>
          <option value="cancelled" ${res.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </div>
      <div style="font-size:11px; color:var(--text-dim); line-height:1.6; margin-bottom:20px;">
         Moving the status will update the customer's portal and internal tracking. Ensure all prerequisites (like procurement) are done before moving to Preparation.
      </div>
      <div style="display:flex; gap:10px; justify-content:flex-end;">
        <button class="btn-outline" onclick="setReservationDetailMode('view')">Cancel</button>
        <button class="btn-primary" onclick="saveReservationDetailStatus()" style="background:var(--green); color:#fff;">Update Status →</button>
      </div>
    </div>`;
}

let resdActiveCatFilter = null;
function renderResdCatalog() {
  const grid = document.getElementById('resd-catalog-grid');
  const catWrap = document.getElementById('resd-catalog-cats');
  if (!grid || !catWrap) return;

  const searchVal = (document.getElementById('resd-catalog-search').value || '').toLowerCase();

  const filtered = CAT.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchVal) || (item.cat || item.category || '').toLowerCase().includes(searchVal);
    const itemCat = item.cat || item.category || '';
    const matchCat = !resdActiveCatFilter || itemCat === resdActiveCatFilter;
    return matchSearch && matchCat;
  });

  const categories = [...new Set(CAT.map(i => i.cat || i.category))];
  catWrap.innerHTML = `<div class="chip ${!resdActiveCatFilter ? 'active' : ''}" onclick="filterResdCat(null)">All</div>` +
    categories.map(c => `<div class="chip ${resdActiveCatFilter === c ? 'active' : ''}" onclick="filterResdCat('${c}')">${c}</div>`).join('');

  grid.innerHTML = filtered.map(item => {
    const isAdded = mtCustomPkgItems.includes(item.name);
    return `
      <div class="menu-card ${isAdded ? 'active' : ''}" style="padding:12px; border:1px solid ${isAdded ? 'var(--gold)' : 'var(--border)'}; background:${isAdded ? 'rgba(196,154,60,0.05)' : 'var(--bg3)'};">
        <div style="font-size:13px; font-weight:700; color:var(--cream); margin-bottom:4px;">${escHtml(item.name)}</div>
        <div style="font-size:10px; color:var(--text-dim); margin-bottom:8px;">${escHtml(item.cat || item.category)}</div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="font-size:11px; color:var(--gold); font-weight:700;">₱${item.price.toLocaleString()} ${item.isIndividual ? '/pax' : ''}</div>
          <button class="btn-primary" onclick="${isAdded ? `removeResdItem('${escHtml(item.name)}')` : `addResdItem('${escHtml(item.name)}')`}" style="font-size:10px; padding:4px 8px; background:${isAdded ? 'var(--red)' : 'var(--gold)'}; color:${isAdded ? '#fff' : '#000'}; border:none;">
            ${isAdded ? 'Remove' : 'Add +'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function filterResdCat(cat) { resdActiveCatFilter = cat; renderResdCatalog(); }
function onResdCatalogSearch(val) { renderResdCatalog(); }

function addResdItem(name) {
  const item = CAT.find(it => it.name === name);
  if (!item) return;
  if (!mtCustomPkgItems.find(i => i.name === name)) {
    mtCustomPkgItems.push(item);
    renderResdCatalog();
    renderReservationDetailContent();
  }
}

function removeResdItem(name) {
  mtCustomPkgItems = mtCustomPkgItems.filter(i => i.name !== name);
  renderResdCatalog();
  renderReservationDetailContent();
}

async function renderProcurementTab() {
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  if (!res) return;

  // Initialize UI loading
  ['food', 'equipment', 'decoration', 'personnel'].forEach(cat => {
    const list = document.getElementById(`proc-${cat}-list`);
    if (list) list.innerHTML = '<div style="font-size:12px; color:var(--text-dim); padding:20px; text-align:center;">Loading items...</div>';
  });

  // 1. Fetch procurement status from Firebase
  const procData = await fetchProcurementData(res.id);

  // 2. Map items from res.packageItems using CAT
  const itemNames = (res.packageItems || []).map(ri => (typeof ri === 'string' ? ri : (ri && ri.name ? ri.name : '')));
  const items = itemNames.map(name => CAT.find(c => c.name === name)).filter(Boolean);
  const pax = parseInt(res.pax) || 0;

  // Render all columns, capturing costs
  const foodResult = renderProcFood(items, pax, procData);
  renderProcEquip(items, procData);
  const decorResult = renderProcDecor(items, procData) || { decorCost: 0 };
  const personnelResult = renderProcPersonnel(items, procData) || { personnelCost: 0 };

  // Consolidate analytics — ingredientCost set by renderProcFood internally via renderProcAnalytics
  // We re-call now with all data
  const supplierGroups = {};
  let ingredientCost = 0;
  let nonSupplierCount = 0;
  items.filter(i => i.cat === 'food').forEach(dish => {
    const ings = getIngredientsForDish(dish.name, pax);
    ings.forEach(ing => {
      ingredientCost += ing.totalCost;
      if (ing.supplier) {
        if (!supplierGroups[ing.supplier]) supplierGroups[ing.supplier] = true;
      } else {
        nonSupplierCount++;
      }
    });
  });

  renderProcAnalytics(
    ingredientCost,
    Object.keys(supplierGroups).length,
    nonSupplierCount,
    decorResult.decorCost,
    personnelResult.personnelCost
  );

  // Update Column Colors (Sorted Status)
  updateProcColumnStatus(procData);
}

async function fetchProcurementData(resId) {
  try {
    const { doc, getDoc, setDoc } = window.firebaseFns;
    const db = window.firebaseDB;
    const procRef = doc(db, 'procurement', resId);
    const snap = await getDoc(procRef);

    if (snap.exists()) return snap.data();

    // Create default if not exists
    const defaultData = {
      id: resId,
      sorted: { food: false, equipment: false, decoration: false, personnel: false },
      assignments: {}, // Store personnel role assignments
      poStatuses: {}   // supplierName -> status
    };
    await setDoc(procRef, defaultData);
    return defaultData;
  } catch (e) {
    console.error(e);
    return { sorted: {} };
  }
}

function renderProcFood(items, pax, procData) {
  const list = document.getElementById('proc-food-list');
  const foodItems = items.filter(i => i.cat === 'food');

  if (!foodItems.length) {
    list.innerHTML = '<div style="font-size:11px; color:var(--text-dim); font-style:italic;">No dishes in package.</div>';
    return;
  }

  let totalIngredientCost = 0;
  let supplierCount = 0;
  let nonSupplierCount = 0;
  let html = '';

  const supplierGroups = {};
  const nonSupplierItems = [];

  foodItems.forEach(dish => {
    const ings = getIngredientsForDish(dish.name, pax);
    ings.forEach(ing => {
      totalIngredientCost += ing.totalCost;
      if (ing.supplier) {
        if (!supplierGroups[ing.supplier]) {
          supplierGroups[ing.supplier] = [];
          supplierCount++;
        }
        supplierGroups[ing.supplier].push({ dish: dish.name, ...ing });
      } else {
        nonSupplierCount++;
        nonSupplierItems.push({ dish: dish.name, ...ing });
      }
    });
  });

  if (Object.keys(supplierGroups).length > 0) {
    html += `<div class="proc-section-header"><div class="proc-section-title">Supplier Purchase Orders</div></div>`;
    Object.keys(supplierGroups).forEach(supplier => {
      const currentStatus = (procData.poStatuses || {})[supplier] || 'Draft';
      const statusCls = currentStatus.toLowerCase().replace(/[^a-z]/g,'');
      const supplierTotal = supplierGroups[supplier].reduce((s, i) => s + (i.totalCost || 0), 0);
      const isPending   = currentStatus === 'Pending';
      const isCompleted = currentStatus === 'Completed';
      const isCancelled = currentStatus === 'Cancelled';

      let actionArea = '';
      if (isPending) {
        actionArea = `
          <div style="display:flex;gap:6px;margin-top:10px;">
            <button class="proc-po-btn-received" onclick="handlePOReceived('${escAttr(supplier)}')">✓ Order Received</button>
            <button class="proc-po-btn-cancelled" onclick="handlePOCancelled('${escAttr(supplier)}')">✕ Order Cancelled</button>
          </div>`;
      } else if (isCompleted) {
        actionArea = `<div class="po-cost-finalized">✓ Order Complete — Cost Finalized at ₱${Math.round(supplierTotal).toLocaleString()}</div>`;
      } else if (isCancelled) {
        actionArea = `
          <div class="po-cost-cancelled">✕ Cancelled — Items added to Shopping List</div>
          <button class="proc-po-btn" onclick="exportPurchaseOrder('${escAttr(supplier)}')" style="margin-top:8px;">Re-Generate &amp; Export PO</button>`;
      } else {
        actionArea = `
          <div style="margin-top:12px;border-top:1px solid rgba(255,255,255,0.05);padding-top:10px;">
            <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;margin-bottom:3px;">Update PO Status</div>
            <select class="po-status-select" onchange="updatePoStatus('${escAttr(supplier)}', this.value)">
              <option value="Draft"                  ${currentStatus==='Draft'                  ?'selected':''}>Draft</option>
              <option value="Exported / Sent"         ${currentStatus==='Exported / Sent'         ?'selected':''}>Exported / Sent</option>
              <option value="Supplier Contacted"      ${currentStatus==='Supplier Contacted'      ?'selected':''}>Supplier Contacted</option>
              <option value="Confirmed by Supplier"   ${currentStatus==='Confirmed by Supplier'   ?'selected':''}>Confirmed by Supplier</option>
              <option value="Items Received"          ${currentStatus==='Items Received'          ?'selected':''}>Items Received</option>
              <option value="Completed"               ${currentStatus==='Completed'               ?'selected':''}>Completed</option>
            </select>
          </div>
          <button class="proc-po-btn" onclick="exportPurchaseOrder('${escAttr(supplier)}')">Generate &amp; Export PO</button>`;
      }

      html += `
        <div class="proc-item-card with-supplier">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
            <div class="po-status-badge ${statusCls}">${escHtml(currentStatus)}</div>
            <div style="text-align:right;">
              <div class="proc-item-title" style="color:var(--gold);font-size:12px;margin:0 0 3px 0;">${escHtml(supplier)}</div>
              <div class="po-cost-chip">₱${Math.round(supplierTotal).toLocaleString()}</div>
            </div>
          </div>
          <div class="proc-ing-list">
            ${supplierGroups[supplier].map(i => `• <strong>${i.totalQty} ${i.unit}</strong> ${escHtml(i.name)} <span style="opacity:0.5">(${escHtml(i.dish)})</span> <span style="color:var(--gold);font-size:10px;">₱${Math.round(i.totalCost).toLocaleString()}</span>`).join('<br/>')}
          </div>
          ${actionArea}
        </div>`;
    });
  }

  // Build shopping list — includes non-supplier items + items from cancelled POs
  const cancelledItems = [];
  Object.keys(supplierGroups).forEach(supplier => {
    if ((procData.poStatuses || {})[supplier] === 'Cancelled') {
      supplierGroups[supplier].forEach(i => cancelledItems.push({ ...i, _fromCancelledPO: supplier }));
    }
  });

  const allShoppingItems = [...nonSupplierItems, ...cancelledItems];

  if (allShoppingItems.length > 0) {
    html += `<div class="proc-section-header" style="margin-top:20px;"><div class="proc-section-title">General Shopping List</div></div>`;
    html += `
      <div class="proc-item-card">
        <div class="proc-item-title">Market &amp; Stock Items</div>
        <div class="proc-ing-list">
          ${nonSupplierItems.map(i => `• <strong>${i.totalQty} ${i.unit}</strong> ${escHtml(i.name)} <span style="opacity:0.5">(${escHtml(i.dish)})</span> <span style="color:var(--gold);font-size:10px;">₱${Math.round(i.totalCost).toLocaleString()}</span>`).join('<br/>')}
          ${cancelledItems.map(i => `• <strong>${i.totalQty} ${i.unit}</strong> ${escHtml(i.name)} <span style="color:#f87171;font-size:10px;">[Cancelled: ${escHtml(i._fromCancelledPO)}]</span>`).join('<br/>')}
        </div>
      </div>`;
  }

  list.innerHTML = html;
}


async function updatePoStatus(supplier, newStatus) {
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  if (!res) return;

  try {
    const { updateDoc, doc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'procurement', res.id), {
      [`poStatuses.${supplier}`]: newStatus
    });
    // Optional: Log action
    console.log(`PO status updated for ${supplier}: ${newStatus}`);
  } catch (e) {
    console.error(e);
    alert('Failed to update PO status.');
  }
}

function renderProcAnalytics(ingredientCost, suppliers, nonSuppliers, decorCost, personnelCost) {
  const container = document.getElementById('proc-analytics-container');
  if (!container) return;
  const grandTotal = (ingredientCost || 0) + (decorCost || 0) + (personnelCost || 0);

  container.innerHTML = `
    <div class="proc-analytics-bar" style="grid-template-columns: repeat(6, 1fr);">
      <div class="proc-stat-box">
        <div class="proc-stat-val">₱${Math.round(ingredientCost || 0).toLocaleString()}</div>
        <div class="proc-stat-lbl">Ingredient Cost</div>
      </div>
      <div class="proc-stat-box">
        <div class="proc-stat-val">${suppliers}</div>
        <div class="proc-stat-lbl">Suppliers</div>
      </div>
      <div class="proc-stat-box">
        <div class="proc-stat-val">${nonSuppliers}</div>
        <div class="proc-stat-lbl">Shopping Items</div>
      </div>
      <div class="proc-stat-box">
        <div class="proc-stat-val">₱${Math.round(decorCost || 0).toLocaleString()}</div>
        <div class="proc-stat-lbl">Decor Cost</div>
      </div>
      <div class="proc-stat-box">
        <div class="proc-stat-val">₱${Math.round(personnelCost || 0).toLocaleString()}</div>
        <div class="proc-stat-lbl">Personnel Cost</div>
      </div>
      <div class="proc-stat-box" style="border-color: var(--gold); background: rgba(196,154,60,0.08);">
        <div class="proc-stat-val" style="font-size:17px;">₱${Math.round(grandTotal).toLocaleString()}</div>
        <div class="proc-stat-lbl">Grand Total</div>
      </div>
    </div>
  `;
}

function renderProcEquip(items, procData) {
  const list = document.getElementById('proc-equip-list');
  const equipItems = items.filter(i => i.cat === 'equipment');

  // Show green badge if assignment already saved
  const activeRes = RESERVATIONS.find(r => r.id === activeResDetailId);
  const badge = document.getElementById('proc-equip-assigned-badge');
  if (badge && activeRes) {
    badge.style.display = (activeRes.equipmentManifest && activeRes.equipmentManifest.length > 0) ? 'inline' : 'none';
  }

  if (!equipItems.length) {
    list.innerHTML = '<div style="font-size:11px; color:var(--text-dim); font-style:italic;">No equipment in package.</div>';
    return;
  }

  list.innerHTML = equipItems.map(item => {
    let extra = '';
    // Special handling for Letter Standee assets as requested
    if (item.name === 'Letter Standee') {
      extra = `
        <div style="margin-top:10px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.05);">
          <div style="font-size:10px; color:var(--text-dim); text-transform:uppercase; margin-bottom:8px; letter-spacing:0.5px;">Alphabet Asset Breakdown:</div>
          <div style="display:grid; grid-template-columns: repeat(13, 1fr); gap:4px;">
            ${"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(char => `
              <div title="LETTER-STANDEE-${char}1" style="aspect-ratio:1; background:rgba(255,255,255,0.05); border:1px solid var(--border); border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; color:var(--cream); cursor:help;">${char}</div>
            `).join('')}
          </div>
        </div>
      `;
    }

    return `
      <div class="proc-item-card">
        <div class="proc-item-title">${escHtml(item.name)}</div>
        <div style="font-size:11px; color:var(--text-mid);">${escHtml(item.desc || 'Event asset')}</div>
        ${extra}
      </div>
    `;
  }).join('');
}

function renderProcDecor(items, procData) {
  const list = document.getElementById('proc-decor-list');
  // Handle Letter Standee being equipment in procurement as requested
  const decorItems = items.filter(i => i.cat === 'decoration' && i.name !== 'Letter Standee').sort((a, b) => a.name.localeCompare(b.name));
  
  // If Letter Standee is in package, ensure it shows up in Equipment column instead
  const standee = items.find(i => i.name === 'Letter Standee');
  if (standee) {
     // This is handled because renderProcEquip filters by i.cat === 'equipment' OR we can manually push it if needed
     // But since I added it as 'decoration' in CAT to show in design details, I'll let renderProcEquip also pick it up
     const eqList = document.getElementById('proc-equip-list');
     if (eqList && !eqList.innerHTML.includes('Letter Standee')) {
        // Manually prepend to equipment list if not already there
        const standeeHtml = `
           <div class="proc-item-card">
              <div class="proc-item-title">Letter Standee</div>
              <div style="font-size:11px; color:var(--text-mid);">Large lighted letters (A-Z assets)</div>
              <div style="margin-top:10px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.05);">
                <div style="font-size:10px; color:var(--text-dim); text-transform:uppercase; margin-bottom:8px;">Alphabet Asset Breakdown:</div>
                <div style="display:grid; grid-template-columns: repeat(13, 1fr); gap:4px;">
                  ${"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(char => `<div style="aspect-ratio:1; background:rgba(255,255,255,0.05); border:1px solid var(--border); border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; color:var(--cream);">${char}</div>`).join('')}
                </div>
              </div>
           </div>
        `;
        eqList.innerHTML = standeeHtml + eqList.innerHTML;
     }
  }

  if (!decorItems.length) {
    if (!standee) list.innerHTML = '<div style="font-size:11px; color:var(--text-dim); font-style:italic;">No decor items in package.</div>';
    else list.innerHTML = '<div style="font-size:11px; color:var(--text-dim); font-style:italic;">Decor items moved to Equipment.</div>';
    return { decorCost: 0 };
  }

  let totalDecorCost = 0;
  const shoppingList = [];

  const html = decorItems.map(item => {
    const components = DECOR_COMPONENTS[item.name] || [];
    let itemCompCost = 0;
    
    if (components.length > 0) {
      components.forEach(c => {
        itemCompCost += c.cost;
        shoppingList.push({ itemName: item.name, ...c });
      });
    } else {
      itemCompCost = item.price || 0;
    }
    
    totalDecorCost += itemCompCost;

    return `
      <div class="proc-item-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
          <div class="proc-item-title" style="margin:0;">${escHtml(item.name)}</div>
          <div style="font-size:12px; font-weight:700; color:var(--gold); white-space:nowrap; margin-left:8px;">₱${itemCompCost.toLocaleString()}</div>
        </div>
        ${components.length > 0 ? `
          <div class="proc-ing-list">
            ${components.map(c => `• <strong>${escHtml(c.name)}</strong>: <span style="color:var(--cream);">₱${c.cost.toLocaleString()}</span>`).join('<br/>')}
          </div>
        ` : `<div style="font-size:10px; color:var(--text-dim);">${escHtml(item.desc || '')}</div>`}
      </div>
    `;
  }).join('');

  if (shoppingList.length > 0) {
    list.innerHTML = `
      <div class="proc-section-header">
        <div class="proc-section-title">Aesthetic Shopping List</div>
        <button class="btn-primary" style="font-size:10px; padding:4px 10px;" onclick="exportDecorShoppingList()">Export List</button>
      </div>
      ${html}
    `;
  } else {
    list.innerHTML = html;
  }

  return { decorCost: totalDecorCost };
}

window.exportDecorShoppingList = function() {
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  if (!res) return;
  
  const items = (res.packageItems || []).map(name => CAT.find(c => c.name === name)).filter(Boolean);
  const decorItems = items.filter(i => i.cat === 'decoration' && i.name !== 'Letter Standee');
  
  let csv = "Item,Component,Estimated Cost\n";
  decorItems.forEach(item => {
    const components = DECOR_COMPONENTS[item.name] || [];
    components.forEach(c => {
      csv += `"${item.name}","${c.name}","${c.cost}"\n`;
    });
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `Decor_Shopping_List_${res.id}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

function renderProcPersonnel(items, procData) {
  const list = document.getElementById('proc-pers-list');
  const personnelItems = items.filter(i => i.cat === 'entertainment' || i.cat === 'photography');

  if (!personnelItems.length) {
    list.innerHTML = '<div style="font-size:11px; color:var(--text-dim); font-style:italic;">No personnel/fun items in package.</div>';
    return { personnelCost: 0 };
  }

  let personnelCost = 0;
  const assignments = procData.assignments || {};

  list.innerHTML = personnelItems.map(item => {
    const assignedEmail = assignments[item.id] || '';
    const pool = PERSONNEL_POOL[item.name] || [];
    const sortedPool = [...pool].sort((a, b) => b.hires - a.hires);
    
    let assignedContact = pool.find(c => c.email === assignedEmail);
    if (!assignedContact && assignedEmail) {
        // Search all pools for fallback
        for (const k in PERSONNEL_POOL) {
            const found = PERSONNEL_POOL[k].find(p => p.email === assignedEmail);
            if (found) { assignedContact = found; break; }
        }
        if (!assignedContact) assignedContact = PERSONNEL_CONTACTS.find(c => c.email === assignedEmail);
    }
    
    if (assignedContact) personnelCost += (assignedContact.rate || 0);
    const isFilled = !!assignedContact;

    return `
      <div class="proc-item-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
          <div class="proc-item-title" style="margin:0;">${escHtml(item.name)}</div>
          ${assignedContact ? `<div style="font-size:12px; font-weight:700; color:var(--gold); white-space:nowrap; margin-left:8px;">₱${assignedContact.rate.toLocaleString()}</div>` : ''}
        </div>
        <div class="proc-pers-contact">
          <select class="proc-pers-select" onchange="assignPersonnel('${item.id}', this.value)">
            <option value="">— Hire Staff —</option>
            ${sortedPool.map(c => `
              <option value="${escHtml(c.email)}" ${assignedEmail === c.email ? 'selected' : ''}>
                ${escHtml(c.name)} · ${escHtml(c.role)} · ₱${c.rate.toLocaleString()} (${c.hires}× booked)
              </option>`).join('')}
          </select>
          <button class="btn-role-fill ${isFilled ? 'filled' : ''}" onclick="markRoleFilled('${item.id}')">
            ${isFilled ? '✓ Hired' : 'Mark Hired'}
          </button>
        </div>
        ${assignedContact ? `<div style="font-size:10px; color:var(--text-dim); margin-top:6px;"> ${escHtml(assignedContact.phone)} · ${escHtml(assignedContact.role)}</div>` : ''}
      </div>
    `;
  }).join('');

  return { personnelCost };
}

function updateProcColumnStatus(procData) {
  const sorted = procData.sorted || {};
  ['food', 'equipment', 'decoration', 'personnel'].forEach(cat => {
    const col = document.getElementById(`proc-col-${cat}`);
    const btn = document.getElementById(`btn-sort-${cat}`);
    if (col) {
      if (sorted[cat]) {
        col.classList.add('sorted');
        if (btn) btn.textContent = '✓ Column Sorted';
      } else {
        col.classList.remove('sorted');
        if (btn) btn.textContent = 'Mark Column Sorted';
      }
    }
  });
}

async function toggleProcSorted(cat) {
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  if (!res) return;

  try {
    const { updateDoc, doc } = window.firebaseFns;
    const db = window.firebaseDB;
    const col = document.getElementById(`proc-col-${cat}`);
    const isSorted = !col.classList.contains('sorted');

    await updateDoc(doc(db, 'procurement', res.id), {
      [`sorted.${cat}`]: isSorted
    });

    renderProcurementTab(); // Refresh UI
  } catch (e) {
    console.error(e);
    alert('Error updating status.');
  }
}

async function assignPersonnel(itemId, email) {
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  if (!res) return;

  const item = CAT.find(i => i.id === itemId);
  if (item && (item.cat === 'entertainment' || item.cat === 'photography')) {
    if (!res.hiredPersonnel) res.hiredPersonnel = {};
    const pool = PERSONNEL_POOL[item.name] || [];
    const idx = pool.findIndex(p => p.email === email);
    if (idx !== -1) {
        res.hiredPersonnel[itemId] = {
            index: idx,
            followedUp: false,
            hiredAt: new Date().toISOString()
        };
    } else if (!email) {
        delete res.hiredPersonnel[itemId];
    }
  }

  try {
    const { updateDoc, doc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'procurement', res.id), {
      [`assignments.${itemId}`]: email
    });
    await updateDoc(doc(window.firebaseDB, "reservations", res.id), {
      hiredPersonnel: res.hiredPersonnel || {}
    });
  } catch (e) { console.error("Failed to assign personnel:", e); }

  renderProcurementTab();
  if (resDetailsActiveTab === 'personnel') renderPersonnelTab();
  updatePersonnelNotif();
}

async function markRoleFilled(itemId) {
  // Just a visual toggle for now or we can save it to assignments
  const btn = event.target;
  btn.classList.toggle('filled');
  btn.textContent = btn.classList.contains('filled') ? '✓ Role Filled' : 'Mark Role Filled';
}

function jumpToScheduling() {
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  if (!res) { alert('No reservation selected. Please select a reservation in Reservation Details first.'); return; }
  if (typeof openEquipmentCycleScheduling === 'function') {
    openEquipmentCycleScheduling(res.id);
  }
}

function exportIngredientsPDF() {
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  if (!res) return;

  const items = (res.packageItems || []).map(name => CAT.find(c => c.name === name)).filter(i => i && i.cat === 'food');
  const pax = parseInt(res.pax) || 0;

  let totalCost = 0;
  let content = `<div style="max-width:800px; margin:0 auto; font-family:'Inter', sans-serif;">
    <h1 style="color:#c49a3c; margin-bottom:5px;">SHOPPING LIST</h1>
    <p style="color:#666; margin-bottom:20px;">Event: ${escHtml(res.client)} | Guests: ${pax} pax | Date: ${res.date}</p>
    <hr style="border:none; border-top:2px solid #eee; margin-bottom:30px;"/>
  `;

  items.forEach(dish => {
    const ings = getIngredientsForDish(dish.name, pax);
    content += `<div style="margin-bottom:25px;">
      <h3 style="margin-bottom:10px; border-left:4px solid #c49a3c; padding-left:15px;">${escHtml(dish.name)}</h3>
      <table style="width:100%; border-collapse:collapse;">
        <tr style="background:#f8f8f8; font-size:11px; text-transform:uppercase; color:#999;">
          <th style="padding:10px; text-align:left;">Ingredient</th>
          <th style="padding:10px; text-align:center;">Required Qty</th>
          <th style="padding:10px; text-align:right;">Est. Cost</th>
        </tr>
    `;
    ings.forEach(ing => {
      totalCost += ing.totalCost;
      content += `
        <tr style="border-bottom:1px solid #eee; font-size:14px;">
          <td style="padding:10px;">${escHtml(ing.name)}</td>
          <td style="padding:10px; text-align:center;">${ing.totalQty} ${ing.unit}</td>
          <td style="padding:10px; text-align:right;">₱${Math.round(ing.totalCost).toLocaleString()}</td>
        </tr>
      `;
    });
    content += `</table></div>`;
  });

  content += `
    <div style="margin-top:40px; padding:20px; background:#fffbf0; border:1px solid #f0e0b0; text-align:right; font-size:18px; font-weight:700;">
      TOTAL ESTIMATED SHOPPING COST: <span style="color:#c49a3c;">₱${Math.round(totalCost).toLocaleString()}</span>
    </div>
  </div>`;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`<html><head><title>Shopping List - ${res.client}</title><style>body{padding:40px; background:#fff; color:#333;}</style></head><body>${content}</body></html>`);
  printWindow.document.close();
}

async function exportPurchaseOrder(supplierName) {
    const res = RESERVATIONS.find(r => r.id === activeResDetailId);
    if (!res) return;

    const foodItems = (res.packageItems || []).map(name => CAT.find(c => c.name === name)).filter(i => i && i.cat === 'food');
    const pax = parseInt(res.pax) || 0;
    const poItems = [];
    foodItems.forEach(dish => {
        const ings = getIngredientsForDish(dish.name, pax);
        ings.forEach(ing => {
            if (ing.supplier === supplierName) poItems.push(ing);
        });
    });

    const poNumber = 'PO-' + Math.floor(1000 + Math.random() * 9000);
    const date = new Date().toLocaleDateString();

    const poHtml = `
      <div class="po-modal-body">
        <div class="po-header">
          <div>
            <div class="po-title">PURCHASE ORDER</div>
            <div style="font-size:12px; color:#666; margin-top:5px;">Halden's Catering Services - HQ</div>
          </div>
          <div class="po-meta">
            <strong>PO #:</strong> ${poNumber}<br/>
            <strong>Date:</strong> ${date}
          </div>
        </div>

        <div class="po-grid">
          <div class="po-info-box">
            <h4>Supplier</h4>
            <p>${supplierName}</p>
            <div style="font-size:12px; color:#666; margin-top:4px;">Registered Vendor Network</div>
          </div>
          <div class="po-info-box">
            <h4>Ship To</h4>
            <p>${escHtml(res.venueName || res.venue || 'Halden Main Kitchen')}</p>
            <div style="font-size:12px; color:#666; margin-top:4px;">Event: ${escHtml(res.client)} (${res.date})</div>
          </div>
        </div>

        <table class="po-table">
          <thead>
            <tr>
              <th style="width:50%;">Item Description</th>
              <th style="text-align:center;">Quantity</th>
              <th style="text-align:right;">Unit Price</th>
              <th style="text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${poItems.map(item => `
              <tr>
                <td style="font-weight:600;">${escHtml(item.name)}</td>
                <td style="text-align:center;">${item.totalQty} ${item.unit}</td>
                <td style="text-align:right; color:#666;">₱${item.cost.toLocaleString()}</td>
                <td style="text-align:right; font-weight:700;">₱${Math.round(item.totalCost).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="text-align:right; font-weight:700; padding:20px 10px; font-size:14px;">GRAND TOTAL</td>
              <td style="text-align:right; font-weight:900; color:#000; font-size:22px; padding:20px 10px; border-bottom:4px double #000;">
                ₱${Math.round(poItems.reduce((s, i) => s + i.totalCost, 0)).toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>

        <div style="margin-top:60px; display:grid; grid-template-columns:1fr 1fr; gap:60px;">
          <div style="border-top:1px solid #333; padding-top:10px; font-size:11px; text-transform:uppercase; color:#999; text-align:center;">
             <strong>Halden's Authorized Signature</strong><br/>Procurement Department
          </div>
          <div style="border-top:1px solid #333; padding-top:10px; font-size:11px; text-transform:uppercase; color:#999; text-align:center;">
             <strong>Supplier Acknowledgement</strong><br/>Confirming Delivery Date
          </div>
        </div>

        <div class="po-footer">
          Halden's Catering Services &copy; ${new Date().getFullYear()} • 123 Event Street, Manila • support@haldens.com<br/>
          This is an official procurement document generated via SmartServe Admin.
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>PO - ${supplierName} - ${res.client}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">
          <style>
            body { background: #f4f4f4; padding: 40px; margin: 0; }
            .po-modal-body { background: #fff; color: #333; padding: 50px; font-family: 'Inter', sans-serif; max-width: 850px; margin: 0 auto; box-shadow: 0 10px 40px rgba(0,0,0,0.1); border-radius: 12px; }
            .po-header { display: flex; justify-content: space-between; border-bottom: 3px solid #000; padding-bottom: 25px; margin-bottom: 40px; }
            .po-title { font-size: 32px; font-weight: 900; color: #000; letter-spacing: -1.5px; }
            .po-meta { text-align: right; font-size: 14px; color: #444; line-height: 1.8; }
            .po-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; margin-bottom: 40px; }
            .po-info-box h4 { font-size: 10px; text-transform: uppercase; color: #aaa; margin-bottom: 10px; letter-spacing: 2px; font-weight: 700; }
            .po-info-box p { font-size: 15px; margin: 0; line-height: 1.6; font-weight: 700; color: #000; }
            .po-table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            .po-table th { background: #fbfbfb; padding: 15px; text-align: left; font-size: 10px; text-transform: uppercase; border-bottom: 2px solid #333; color: #000; font-weight: 800; letter-spacing: 1px; }
            .po-table td { padding: 15px; font-size: 15px; border-bottom: 1px solid #eee; vertical-align: middle; }
            .po-footer { margin-top: 60px; border-top: 1px solid #eee; padding-top: 25px; font-size: 10px; color: #bbb; text-align: center; letter-spacing: 0.5px; line-height: 1.8; }
            @media print { body { background: #fff; padding: 0; } .po-modal-body { box-shadow: none; border: none; padding: 0; } }
          </style>
        </head>
        <body>${poHtml}</body>
      </html>
    `);
    printWindow.document.close();

    // Immediately set PO status to Pending after generating/exporting
    try {
      const { updateDoc, doc } = window.firebaseFns;
      await updateDoc(doc(window.firebaseDB, 'procurement', res.id), {
        [`poStatuses.${supplierName}`]: 'Pending'
      });
    } catch(e) { console.error('Failed to set PO status to Pending:', e); }
    renderProcurementTab();
    if (document.getElementById('proc-food-detail-panel').style.display === 'flex') {
      openDishesPanel(activeResDetailId);
    }
    if (document.getElementById('proc-decor-detail-panel').style.display === 'flex') {
      openDecorPanel(activeResDetailId);
    }
}

// =====================================================================
// PO WORKFLOW: handlePOReceived / handlePOCancelled
// =====================================================================
async function handlePOReceived(supplier) {
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  if (!res) return;
  if (!confirm(`Mark the order from "${supplier}" as RECEIVED and finalize its cost?`)) return;

  // Calculate cost for this supplier
  const pax = parseInt(res.pax) || 0;
  const foodItems = (res.packageItems || []).map(n => CAT.find(c => c.name === (typeof n === 'string' ? n : n.name))).filter(i => i && i.cat === 'food');
  let supplierTotal = 0;
  foodItems.forEach(dish => {
    getIngredientsForDish(dish.name, pax).forEach(ing => {
      if (ing.supplier === supplier) supplierTotal += ing.totalCost;
    });
  });

  try {
    const { updateDoc, doc } = window.firebaseFns;
    const db = window.firebaseDB;
    // Mark PO as completed
    await updateDoc(doc(db, 'procurement', res.id), {
      [`poStatuses.${supplier}`]: 'Completed',
      [`finalizedCosts.${supplier}`]: Math.round(supplierTotal)
    });
    // Track finalized ingredient cost on reservation
    const curFinalized = res.finalizedIngredientCost || 0;
    const curCosts = res.finalizedPOCosts || {};
    const prevCost = curCosts[supplier] || 0;
    const newTotal = curFinalized - prevCost + Math.round(supplierTotal);
    curCosts[supplier] = Math.round(supplierTotal);
    await updateDoc(doc(db, 'reservations', res.id), {
      finalizedIngredientCost: newTotal,
      finalizedPOCosts: curCosts
    });
    // Update local cache
    const localRes = RESERVATIONS.find(r => r.id === res.id);
    if (localRes) {
      localRes.finalizedIngredientCost = newTotal;
      localRes.finalizedPOCosts = curCosts;
    }
  } catch(e) {
    console.error('handlePOReceived error:', e);
    alert('Failed to finalize order.');
    return;
  }
  renderProcurementTab();
  if (document.getElementById('proc-food-detail-panel')?.classList.contains('open')) renderDishesPanel();
}

async function handlePOCancelled(supplier) {
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  if (!res) return;
  if (!confirm(`Cancel the order from "${supplier}"? Its items will be moved to the Shopping List.`)) return;

  try {
    const { updateDoc, doc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'procurement', res.id), {
      [`poStatuses.${supplier}`]: 'Cancelled'
    });
  } catch(e) {
    console.error('handlePOCancelled error:', e);
    alert('Failed to cancel order.');
    return;
  }
  renderProcurementTab();
  if (document.getElementById('proc-food-detail-panel')?.classList.contains('open')) renderDishesPanel();
}

// =====================================================================
// DISHES & INGREDIENTS FULLSCREEN PANEL
// =====================================================================
function openDishesPanel() {
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  if (!res) { alert('Please select a reservation first.'); return; }
  const panel = document.getElementById('proc-food-detail-panel');
  if (panel) panel.classList.add('open');
  renderDishesPanel();
}

function closeDishesPanel() {
  const panel = document.getElementById('proc-food-detail-panel');
  if (panel) panel.classList.remove('open');
}

async function renderDishesPanel() {
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  const subEl = document.getElementById('pfd-sub');
  const bodyEl = document.getElementById('pfd-body');
  if (!res || !subEl || !bodyEl) return;

  subEl.textContent = `${res.client} — ${res.type || 'Event'} (${res.date}) · ${res.pax} pax`;
  bodyEl.innerHTML = '<div style="text-align:center;padding:80px;color:var(--text-dim);">Loading...</div>';

  const procData = await fetchProcurementData(res.id);
  const itemNames = (res.packageItems || []).map(ri => typeof ri === 'string' ? ri : (ri && ri.name ? ri.name : ''));
  const items = itemNames.map(n => CAT.find(c => c.name === n)).filter(Boolean);
  const foodItems = items.filter(i => i.cat === 'food');
  const pax = parseInt(res.pax) || 0;

  if (!foodItems.length) {
    bodyEl.innerHTML = '<div style="text-align:center;padding:100px;color:var(--text-dim);">No dishes in this package.</div>';
    return;
  }

  const supplierGroups = {};
  const nonSupplierItems = [];
  let totalCost = 0;

  foodItems.forEach(dish => {
    const ings = getIngredientsForDish(dish.name, pax);
    ings.forEach(ing => {
      totalCost += ing.totalCost;
      if (ing.supplier) {
        if (!supplierGroups[ing.supplier]) supplierGroups[ing.supplier] = [];
        supplierGroups[ing.supplier].push({ dish: dish.name, ...ing });
      } else {
        nonSupplierItems.push({ dish: dish.name, ...ing });
      }
    });
  });

  const cancelledItems = [];
  Object.keys(supplierGroups).forEach(s => {
    if ((procData.poStatuses || {})[s] === 'Cancelled') {
      supplierGroups[s].forEach(i => cancelledItems.push({ ...i, _fromCancelledPO: s }));
    }
  });

  const finalizedCosts = procData.finalizedCosts || {};
  const finalizedTotal = Object.values(finalizedCosts).reduce((s, v) => s + v, 0);

  // Analytics bar
  let html = `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin-bottom:28px;">
      <div class="proc-stat-box">
        <div class="proc-stat-val">₱${Math.round(totalCost).toLocaleString()}</div>
        <div class="proc-stat-lbl">Est. Total Cost</div>
      </div>
      <div class="proc-stat-box" style="border-color:rgba(39,174,96,0.4);">
        <div class="proc-stat-val" style="color:#4ade80;">₱${finalizedTotal.toLocaleString()}</div>
        <div class="proc-stat-lbl">Finalized Cost</div>
      </div>
      <div class="proc-stat-box">
        <div class="proc-stat-val">${Object.keys(supplierGroups).length}</div>
        <div class="proc-stat-lbl">Suppliers</div>
      </div>
      <div class="proc-stat-box">
        <div class="proc-stat-val">${nonSupplierItems.length + cancelledItems.length}</div>
        <div class="proc-stat-lbl">Shopping Items</div>
      </div>
      <div class="proc-stat-box">
        <div class="proc-stat-val">${foodItems.length}</div>
        <div class="proc-stat-lbl">Dishes</div>
      </div>
    </div>
  `;

  // Dish breakdown
  html += `<div class="pfd-section-title" style="margin-bottom:16px;"> All Dishes — Full Ingredient Breakdown</div>`;
  html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:18px;margin-bottom:36px;">`;
  foodItems.forEach(dish => {
    const ings = getIngredientsForDish(dish.name, pax);
    const dishCost = ings.reduce((s, i) => s + i.totalCost, 0);
    html += `
      <div class="pfd-dish-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
          <div style="font-size:15px;font-weight:700;color:var(--cream);">${escHtml(dish.name)}</div>
          <div style="font-size:13px;font-weight:800;color:var(--gold);">₱${Math.round(dishCost).toLocaleString()}</div>
        </div>
        <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">For ${pax} pax</div>
        <table class="pfd-ing-table">
          <thead><tr>
            <th>Ingredient</th><th>Qty</th><th style="text-align:right;">Cost</th><th>Supplier</th>
          </tr></thead>
          <tbody>
            ${ings.map(ing => `
              <tr>
                <td style="color:var(--cream);font-weight:500;">${escHtml(ing.name)}</td>
                <td style="color:var(--text-mid);">${ing.totalQty} ${ing.unit}</td>
                <td style="text-align:right;color:var(--gold);font-weight:700;">₱${Math.round(ing.totalCost).toLocaleString()}</td>
                <td style="font-size:10px;color:var(--text-dim);">${escHtml(ing.supplier || '— market')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
  });
  html += `</div>`;

  // Supplier POs
  if (Object.keys(supplierGroups).length > 0) {
    html += `<div class="pfd-section-title"> Supplier Purchase Orders</div>`;
    html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:18px;margin-bottom:36px;">`;
    Object.keys(supplierGroups).forEach(supplier => {
      const currentStatus = (procData.poStatuses || {})[supplier] || 'Draft';
      const statusCls = currentStatus.toLowerCase().replace(/[^a-z]/g,'');
      const supplierTotal = supplierGroups[supplier].reduce((s, i) => s + (i.totalCost || 0), 0);
      const isPending   = currentStatus === 'Pending';
      const isCompleted = currentStatus === 'Completed';
      const isCancelled = currentStatus === 'Cancelled';

      let actionArea = '';
      if (isPending) {
        actionArea = `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px;">
            <button class="proc-po-btn-received" onclick="handlePOReceived('${escAttr(supplier)}')">✓ Order Received</button>
            <button class="proc-po-btn-cancelled" onclick="handlePOCancelled('${escAttr(supplier)}')">✕ Order Cancelled</button>
          </div>`;
      } else if (isCompleted) {
        actionArea = `<div class="po-cost-finalized" style="margin-top:14px;">✓ Order Complete — Cost Finalized at ₱${Math.round(supplierTotal).toLocaleString()}</div>`;
      } else if (isCancelled) {
        actionArea = `
          <div class="po-cost-cancelled" style="margin-top:14px;">✕ Cancelled — Items moved to Shopping List</div>
          <button class="proc-po-btn" onclick="exportPurchaseOrder('${escAttr(supplier)}')" style="margin-top:8px;width:100%;">Re-Generate &amp; Export PO</button>`;
      } else {
        actionArea = `
          <div style="margin-top:14px;border-top:1px solid rgba(255,255,255,0.06);padding-top:12px;display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end;">
            <select class="po-status-select" onchange="updatePoStatus('${escAttr(supplier)}', this.value)" style="height:36px;">
              <option value="Draft" ${currentStatus==='Draft'?'selected':''}>Draft</option>
              <option value="Exported / Sent" ${currentStatus==='Exported / Sent'?'selected':''}>Exported / Sent</option>
              <option value="Supplier Contacted" ${currentStatus==='Supplier Contacted'?'selected':''}>Supplier Contacted</option>
              <option value="Confirmed by Supplier" ${currentStatus==='Confirmed by Supplier'?'selected':''}>Confirmed by Supplier</option>
              <option value="Items Received" ${currentStatus==='Items Received'?'selected':''}>Items Received</option>
            </select>
            <button class="proc-po-btn" onclick="exportPurchaseOrder('${escAttr(supplier)}')" style="white-space:nowrap;margin:0;"> Generate &amp; Export PO</button>
          </div>`;
      }

      html += `
        <div class="pfd-po-card status-${statusCls}">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
            <div>
              <div class="po-status-badge ${statusCls}" style="margin-bottom:6px;">${escHtml(currentStatus)}</div>
              <div style="font-size:16px;font-weight:700;color:var(--cream);">${escHtml(supplier)}</div>
            </div>
            <div class="po-cost-chip" style="font-size:16px;">₱${Math.round(supplierTotal).toLocaleString()}</div>
          </div>
          <table class="pfd-ing-table">
            <thead><tr>
              <th>Ingredient</th><th>Qty</th><th style="text-align:right;">Cost</th><th>Dish</th>
            </tr></thead>
            <tbody>
              ${supplierGroups[supplier].map(i => `
                <tr>
                  <td style="color:var(--cream);font-weight:500;">${escHtml(i.name)}</td>
                  <td>${i.totalQty} ${i.unit}</td>
                  <td style="text-align:right;color:var(--gold);font-weight:700;">₱${Math.round(i.totalCost).toLocaleString()}</td>
                  <td style="font-size:10px;color:var(--text-dim);">${escHtml(i.dish)}</td>
                </tr>`).join('')}
            </tbody>
          </table>
          ${actionArea}
        </div>`;
    });
    html += `</div>`;
  }

  // Shopping list (non-supplier + cancelled)
  const allShop = [...nonSupplierItems, ...cancelledItems];
  if (allShop.length > 0) {
    html += `<div class="pfd-section-title"> Shopping List</div>`;
    html += `<div style="display:flex;flex-direction:column;gap:8px;">`;
    nonSupplierItems.forEach(i => {
      html += `<div class="pfd-shop-item"><span><strong>${i.totalQty} ${i.unit}</strong> ${escHtml(i.name)} <span style="color:var(--text-dim);font-size:11px;">(${escHtml(i.dish)})</span></span><span style="color:var(--gold);font-weight:700;">₱${Math.round(i.totalCost).toLocaleString()}</span></div>`;
    });
    cancelledItems.forEach(i => {
      html += `<div class="pfd-shop-item" style="border-color:rgba(248,113,113,0.3);"><span><strong>${i.totalQty} ${i.unit}</strong> ${escHtml(i.name)} <span style="color:#f87171;font-size:10px;">[Cancelled PO: ${escHtml(i._fromCancelledPO)}]</span></span><span style="color:var(--text-dim);">₱${Math.round(i.totalCost).toLocaleString()}</span></div>`;
    });
    html += `</div>`;
  }

  bodyEl.innerHTML = html;
}

window.openDishesPanel  = openDishesPanel;
window.closeDishesPanel = closeDishesPanel;
window.handlePOReceived  = handlePOReceived;
window.handlePOCancelled = handlePOCancelled;
window.exportPurchaseOrder = exportPurchaseOrder;

async function saveResdPackageChanges() {
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  if (!res) return;

  const newPrice = calculateMtPrice();

  // Extract new values from inputs
  const payload = {
    packageItems: mtCustomPkgItems.map(i => i.name),
    amount: newPrice
  };

  const el = (id) => document.getElementById(id);
  
  if (el('edit-ev-type')) payload.type = el('edit-ev-type').value;
  if (el('edit-ev-theme')) payload.theme = el('edit-ev-theme').value;
  if (el('edit-ev-motif')) payload.motif = el('edit-ev-motif').value;
  if (el('edit-ev-pax')) payload.pax = parseInt(el('edit-ev-pax').value) || 0;
  if (el('edit-ev-vip')) payload.vipCount = parseInt(el('edit-ev-vip').value) || 0;
  
  if (el('edit-vn-name')) payload.venueName = el('edit-vn-name').value;
  if (el('edit-vn-loc')) payload.venueAddr = el('edit-vn-loc').value;
  if (el('edit-vn-date')) payload.date = el('edit-vn-date').value;
  
  if (el('edit-vn-tstart') && el('edit-vn-tend')) {
    const startStr = el('edit-vn-tstart').value;
    const endStr = el('edit-vn-tend').value;
    
    // Format to 12-hour AM/PM
    const formatTime = (timeStr) => {
      if (!timeStr) return '';
      let [h, m] = timeStr.split(':');
      h = parseInt(h);
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      return `${h}:${m} ${ampm}`;
    };
    payload.time = `${formatTime(startStr)} to ${formatTime(endStr)}`;
  }

  if (el('edit-fin-amount')) payload.amount = parseInt(el('edit-fin-amount').value) || newPrice;
  if (el('edit-fin-status')) payload.paymentStatus = el('edit-fin-status').value;
  if (el('edit-fin-init')) payload.paymentAmount = parseInt(el('edit-fin-init').value) || 0;
  if (el('edit-fin-dp')) payload.downpaymentAmount = parseInt(el('edit-fin-dp').value) || 0;

  try {
    const { updateDoc, doc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'reservations', res.id), payload);

    // Update local
    const idx = RESERVATIONS.findIndex(r => r.id === res.id);
    if (idx !== -1) {
      Object.assign(RESERVATIONS[idx], payload);
    }

    alert('Package updated successfully!');
    resdModifyMode = false;
    document.getElementById('resd-catalog-side').style.display = 'none';
    const btn = document.getElementById('resd-btn-edit');
    btn.textContent = 'Modify Reservation Details';
    btn.style.background = 'var(--gold)';
    btn.style.color = '#000';
    renderReservationDetailContent();
  } catch (e) {
    console.error(e);
    alert('Error saving changes.');
  }
}


function formatToDateInput(val) {
  if (!val) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  const d = new Date(val);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

function sanitizeAmount(val) {
  if (val === null || val === undefined) return '';
  const num = Number(String(val).replace(/[^\d.]/g, ''));
  return isNaN(num) ? '' : String(num);
}

async function saveReservationDetailEdits() {
  const res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  if (!res) return;
  const payload = {
    client: (document.getElementById('resd-edit-client').value || '').trim(),
    type: (document.getElementById('resd-edit-type').value || '').trim(),
    date: document.getElementById('resd-edit-date').value || res.date,
    pax: Number(document.getElementById('resd-edit-pax').value || res.pax || 0),
    packageName: (document.getElementById('resd-edit-package').value || '').trim(),
    amount: Number(document.getElementById('resd-edit-amount').value || sanitizeAmount(res.amount) || 0),
    packageItems: (document.getElementById('resd-edit-items').value || '')
      .split(',')
      .map(function (s) { return s.trim(); })
      .filter(Boolean)
  };
  try {
    const { doc, updateDoc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'reservations', res.id), payload);
    Object.assign(res, payload);
    res.displayAmount = '₱' + Number(res.amount || 0).toLocaleString();
    setReservationDetailMode('view');
    renderReservations(currentFilter);
    renderDashboard();
    renderEvents();
    renderMeetingsSection();
    renderReservationDetailsHandling();
    showToast('Reservation details updated.');
  } catch (e) {
    console.error(e);
    alert('Failed to save reservation details.');
  }
}

async function saveReservationDetailStatus() {
  const res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  if (!res) return;
  const newStatus = document.getElementById('resd-status-select').value;
  await updateReservationStatus(res.id, newStatus);
  setReservationDetailMode('view');
}

function getActiveReservationExtra(resId) {
  const targetId = resId || activeResDetailId;
  if (!targetId) return null;
  if (!reservationExtraDetails[targetId]) {
    const res = RESERVATIONS.find(function (r) { return r.id === targetId; }) || {};
    reservationExtraDetails[targetId] = {
      guests: Array.isArray(res.guestList) ? res.guestList.map(function (g) {
        if (typeof g === 'string') return { name: g, table: '', note: '' };
        return { name: g.name || '', table: g.table || '', note: g.note || '' };
      }) : [],
      layoutSent: !!res.layoutSentToCustomer,
      layoutReceived: !!res.layoutWithNamesReceived,
      seatingElements: Array.isArray(res.seatingLayout) ? JSON.parse(JSON.stringify(res.seatingLayout)) : [],
      logisticsMilestones: Array.isArray(res.logisticsMilestones) ? res.logisticsMilestones : [],
      timelineTasks: Array.isArray(res.timelineTasks) ? res.timelineTasks : []
    };
  }
  return reservationExtraDetails[targetId];
}

function renderExtraReservationDetails() {
  const guestWrap = document.getElementById('resd-guest-list');
  const statusEl = document.getElementById('resd-layout-status');
  if (!guestWrap || !statusEl) return;
  const extra = getActiveReservationExtra();
  if (!extra) {
    guestWrap.innerHTML = '<div style="font-size:12px;color:var(--text-dim);">Select a reservation to manage guest list.</div>';
    statusEl.textContent = 'Layout workflow status: Not yet sent to customer.';
    return;
  }

  // Migration fallback
  if (!extra.guests.length) extra.guests.push({ name: '', role: 'Ordinary', remarks: '', relatedTo: '' });
  
  if (typeof updateGlobalResdAnalytics === 'function') updateGlobalResdAnalytics();


  // Get available names for Related To dropdown
  const availableNames = extra.guests.map(g => (g.name || '').trim()).filter(n => n.length > 0);

  // Show QR button if there are valid named guests
  const listedPax = extra.guests.filter(g => (g.name || '').trim().length > 0).length;
  const qrBtn = document.getElementById('btn-guest-qr');
  if (qrBtn) {
    qrBtn.style.display = listedPax > 0 ? 'block' : 'none';
  }


  guestWrap.innerHTML = extra.guests.map(function (g, idx) {
    const roleOpts = ['Ordinary', 'VIP'].map(r => `<option value="${r}" ${g.role === r ? 'selected' : ''}>${r}</option>`).join('');
    
    // Filter out self from related to options
    const relationOpts = ['<option value="">None (Self)</option>'].concat(
      availableNames.filter(n => n !== g.name).map(n => `<option value="${escHtml(n)}" ${g.relatedTo === n ? 'selected' : ''}>${escHtml(n)}</option>`)
    ).join('');

    return `<div style="display:grid;grid-template-columns:1.5fr 100px 1.5fr 1.5fr auto;gap:8px;margin-bottom:8px;align-items:center;background:rgba(255,255,255,0.02);padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.05);">
      <input class="input-field" placeholder="Guest name / +1" value="${escHtml(g.name || '')}" oninput="updateGuestRow(${idx},'name',this.value)"/>
      <select class="input-field" onchange="updateGuestRow(${idx},'role',this.value)">${roleOpts}</select>
      <input class="input-field" placeholder="Remarks / Diet" value="${escHtml(g.remarks || g.note || '')}" oninput="updateGuestRow(${idx},'remarks',this.value)"/>
      <div style="display:flex;align-items:center;gap:6px;">
        <span style="font-size:10px;color:var(--text-dim);white-space:nowrap;">Related To:</span>
        <select class="input-field" style="padding:6px;" onchange="updateGuestRow(${idx},'relatedTo',this.value)">${relationOpts}</select>
      </div>
      <button class="btn-reject" style="font-size:11px;padding:6px 10px;" onclick="removeGuestRow(${idx})">✕</button>
    </div>`;
  }).join('');

  statusEl.textContent = extra.layoutReceived
    ? 'Layout workflow status: Layout with seating names received from customer.'
    : (extra.layoutSent ? 'Layout workflow status: Layout sent to customer for seating assignment.' : 'Layout workflow status: Not yet sent to customer.');

  seatingElements = Array.isArray(extra.seatingElements) ? JSON.parse(JSON.stringify(extra.seatingElements)) : seatingElements;
  renderSeating();
}

function addGuestRow() {
  const extra = getActiveReservationExtra();
  if (!extra) return;
  extra.guests.push({ name: '', role: 'Ordinary', remarks: '', relatedTo: '' });
  renderExtraReservationDetails();
}

function removeGuestRow(idx) {
  const extra = getActiveReservationExtra();
  if (!extra) return;
  extra.guests.splice(idx, 1);
  if (!extra.guests.length) extra.guests.push({ name: '', role: 'Ordinary', remarks: '', relatedTo: '' });
  renderExtraReservationDetails();
}

function updateGuestRow(idx, key, value) {
  const extra = getActiveReservationExtra();
  if (!extra || !extra.guests[idx]) return;
  extra.guests[idx][key] = value;
}

function markLayoutSentToCustomer() {
  const extra = getActiveReservationExtra();
  if (!extra) return;
  extra.layoutSent = true;
  extra.layoutReceived = false;
  renderExtraReservationDetails();
}

function markLayoutReceived() {
  const extra = getActiveReservationExtra();
  if (!extra) return;
  extra.layoutSent = true;
  extra.layoutReceived = true;
  renderExtraReservationDetails();
}

async function saveGuestList() {
  const res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  const extra = getActiveReservationExtra();
  if (!res || !extra) return;
  try {
    const { doc, updateDoc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'reservations', res.id), {
      guestList: extra.guests.filter(function (g) { return (g.name || '').trim(); }).map(g => ({
        name: g.name, role: g.role || 'Ordinary', remarks: g.remarks || g.note || '', relatedTo: g.relatedTo || ''
      })),
      layoutSentToCustomer: !!extra.layoutSent,
      layoutWithNamesReceived: !!extra.layoutReceived,
      seatingLayout: Array.isArray(extra.seatingElements) ? extra.seatingElements : []
    });
    showToast('Guest list and extra details saved.');
  } catch (e) {
    console.error(e);
    alert('Failed to save guest list.');
  }
}

function getTimelineTasks() {
  const extra = getActiveReservationExtra();
  if (!extra) return [];
  if (!Array.isArray(extra.timelineTasks)) extra.timelineTasks = [];
  return extra.timelineTasks;
}

function getContractBaseDate(res) {
  if (res && res.contractFinalizedAt) return normalizeDateKey(res.contractFinalizedAt);
  if (res && res.contractUrl && res.updatedAt) return normalizeDateKey(res.updatedAt);
  return null;
}

function computePaymentMilestones(res) {
  const base = getContractBaseDate(res);
  if (!base) return [];
  const extra = getActiveReservationExtra();
  if (!extra.paymentRecords) extra.paymentRecords = {};
  const labels = [
    { key: 'reservation_payment', label: 'Pending Reservation Payment Due', offset: 1 },
    { key: 'down_payment', label: 'Down Payment Due', offset: 7 },
    { key: 'final_payment', label: 'Final Payment Due', offset: 14 },
    { key: 'damages_fee', label: 'Pending Damages Fees Due', offset: 21 }
  ];
  return labels.map(function (p) {
    const d = new Date(base + 'T00:00:00');
    d.setDate(d.getDate() + p.offset);
    const dueDate = d.toISOString().split('T')[0];
    if (!extra.paymentRecords[p.key]) extra.paymentRecords[p.key] = { status: 'pending' };
    return {
      key: p.key,
      label: p.label,
      dueDate: dueDate,
      record: extra.paymentRecords[p.key]
    };
  });
}

async function autoHandlePendingPayments(res, milestones) {
  if (!res || !milestones.length) return;
  const today = new Date().toISOString().split('T')[0];
  const extra = getActiveReservationExtra();
  if (!extra) return;
  if (!extra.autoPaymentTriggered) extra.autoPaymentTriggered = {};
  let requiresSave = false;

  milestones.forEach(function (m) {
    const rec = m.record || {};
    if (rec.status === 'paid' || rec.status === 'cancelled') return;
    if (today >= m.dueDate && !rec.gatewayTriggeredAt) {
      rec.status = 'gateway_triggered';
      rec.gatewayTriggeredAt = new Date().toISOString();
      extra.autoPaymentTriggered[m.key] = true;
      requiresSave = true;
    }
    if (today > m.dueDate && rec.status !== 'paid' && !extra.cancelledForNonPayment) {
      extra.cancelledForNonPayment = true;
      rec.status = 'cancelled';
      requiresSave = true;
      updateReservationStatus(res.id, 'cancelled', 'Auto-cancelled due to missed scheduled payment.');
    }
  });

  if (requiresSave) {
    try {
      const { doc, updateDoc } = window.firebaseFns;
      await updateDoc(doc(window.firebaseDB, 'reservations', res.id), {
        paymentTimeline: extra.paymentRecords,
        paymentRequested: true,
        paymentStatus: 'pending'
      });
    } catch (e) { }
  }
}

async function runReservationPaymentAutomation() {
  const res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  if (!res) return;
  const milestones = computePaymentMilestones(res);
  await autoHandlePendingPayments(res, milestones);
  renderReservationTimelineView();
}

function renderTimelineTaskList() {
  const listEl = document.getElementById('resd-task-list');
  if (!listEl) return;
  const tasks = getTimelineTasks().slice().sort(function (a, b) { return String(a.date).localeCompare(String(b.date)); });
  if (!tasks.length) {
    listEl.innerHTML = '<div style="font-size:12px;color:var(--text-dim);padding:8px 0;">No activities logged yet.</div>';
    return;
  }
  listEl.innerHTML = tasks.map(function (t) {
    const b = t.status === 'done' ? 'confirmed' : (t.status === 'in-progress' ? 'pending' : 'warning');
    return `<div style="border:1px solid var(--border);border-radius:8px;padding:8px 10px;margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;gap:8px;align-items:center;">
        <div style="font-size:12px;font-weight:700;color:var(--cream);">${escHtml(t.title || 'Untitled Activity')}</div>
        <span class="badge ${b}" style="font-size:10px;">${escHtml(t.status || 'pending')}</span>
      </div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:3px;">${escHtml(t.date || '—')} ${t.note ? '· ' + escHtml(t.note) : ''}</div>
      <div style="margin-top:8px;display:flex;gap:6px;justify-content:flex-end;">
        <button class="btn-outline" style="font-size:10px;padding:3px 8px;" onclick="updateTimelineTaskStatus('${t.id}','pending')">Pending</button>
        <button class="btn-outline" style="font-size:10px;padding:3px 8px;" onclick="updateTimelineTaskStatus('${t.id}','in-progress')">In Progress</button>
        <button class="btn-outline" style="font-size:10px;padding:3px 8px;" onclick="updateTimelineTaskStatus('${t.id}','done')">Done</button>
      </div>
    </div>`;
  }).join('');
}

function renderPaymentTimeline(res, milestones) {
  const el = document.getElementById('resd-payment-list');
  if (!el) return;
  if (!milestones.length) {
    el.innerHTML = '<div style="font-size:12px;color:var(--text-dim);">Payment dates will auto-generate after contract finalization in Meeting Mode.</div>';
    return;
  }
  el.innerHTML = milestones.map(function (m) {
    const st = m.record.status || 'pending';
    const cls = st === 'paid' ? 'confirmed' : (st === 'gateway_triggered' ? 'pending' : (st === 'cancelled' ? 'cancelled' : 'warning'));
    return `<div style="border:1px solid var(--border);border-radius:8px;padding:10px;margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;gap:8px;align-items:center;">
        <div style="font-size:12px;font-weight:700;color:var(--cream);">${escHtml(m.label)}</div>
        <span class="badge ${cls}" style="font-size:10px;">${escHtml(st)}</span>
      </div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:4px;">Due: ${escHtml(m.dueDate)}</div>
      <div style="display:flex;justify-content:flex-end;margin-top:8px;">
        <button class="btn-outline" style="font-size:10px;padding:4px 10px;" onclick="markTimelinePaymentPaid('${m.key}')">Mark Paid</button>
      </div>
    </div>`;
  }).join('');
}

let activeLogisticsMilestoneId = null;

function setActiveLogisticsMilestone(id) {
  activeLogisticsMilestoneId = id;
  const res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  if (res) {
    renderLogisticsMilestones(res);
    renderLogisticsActivities(res);
  }
}

function renderLogisticsMilestones(res) {
  const el = document.getElementById('resd-timeline-milestones');
  if (!el) return;
  const extra = getActiveReservationExtra();
  if (!extra || !extra.logisticsMilestones || !extra.logisticsMilestones.length) {
    el.innerHTML = '<div style="font-size:12px;color:var(--text-dim);padding:20px;text-align:center;background:rgba(255,255,255,0.02);border-radius:12px;">No milestones generated. Milestones will appear after contract finalization.</div>';
    return;
  }

  el.innerHTML = extra.logisticsMilestones.map(function (m) {
    const status = m.status || 'upcoming';
    const tasks = (extra.timelineTasks || []).filter(t => t.milestoneId === m.id);
    const doneTasks = tasks.filter(t => t.status === 'done').length;
    const progress = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0;
    const color = m.color || 'var(--gold)';
    const isActive = m.id === activeLogisticsMilestoneId;
    const borderStyle = isActive ? `border:1px solid ${color};` : `border:1px solid var(--border);`;
    const bgStyle = isActive ? `background:rgba(255,255,255,0.05);` : `background:var(--bg3);`;

    let content = '';
    if (isEditingLogistics) {
      content = `
        <div style="display:flex;gap:10px;margin-bottom:12px;align-items:center;">
          <div style="font-size:12px;font-weight:700;color:var(--cream);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHtml(m.label)}</div>
          <select class="btn-outline" style="font-size:10px;padding:2px 4px;background:transparent;color:var(--text-mid);" onchange="updateLogisticsMilestoneStatus('${m.id}', this.value)">
             <option value="upcoming" ${status === 'upcoming' ? 'selected' : ''}>Upcoming</option>
             <option value="in-progress" ${status === 'in-progress' ? 'selected' : ''}>In Progress</option>
             <option value="completed" ${status === 'completed' ? 'selected' : ''}>Completed</option>
          </select>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;">
          <div style="display:flex;align-items:center;gap:4px;">
            <span style="font-size:10px;color:var(--text-dim);width:30px;">Start:</span>
            <input type="date" class="input-field" style="width:110px;padding:2px 4px;font-size:10px;" value="${m.startDate}" onchange="updateMilestoneDate('${m.id}', 'startDate', this.value)" />
          </div>
          <div style="display:flex;align-items:center;gap:4px;">
            <span style="font-size:10px;color:var(--text-dim);width:30px;">End:</span>
            <input type="date" class="input-field" style="width:110px;padding:2px 4px;font-size:10px;" value="${m.endDate}" onchange="updateMilestoneDate('${m.id}', 'endDate', this.value)" />
          </div>
        </div>
      `;
    } else {
      content = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
          <div style="overflow:hidden;flex:1;margin-right:10px;">
            <div style="font-size:13px;font-weight:700;color:var(--cream);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${escHtml(m.label)}">${escHtml(m.label)}</div>
            <div style="font-size:10px;color:var(--text-dim);margin-top:2px;">${m.startDate} - ${m.endDate}</div>
          </div>
          <div class="badge" style="font-size:9px; background:${color}20; color:${color}; border:1px solid ${color}40; padding:2px 4px;">${escHtml(status.toUpperCase())}</div>
        </div>
        
        <div style="height:4px;background:rgba(255,255,255,0.05);border-radius:2px;overflow:hidden;margin-bottom:6px;">
          <div style="height:100%;width:${progress}%;background:${color};transition:width 0.3s ease;"></div>
        </div>
        <div style="font-size:9px;color:var(--text-dim);">
          ${doneTasks}/${tasks.length} Activities (${progress}%)
        </div>
      `;
    }

    return `<div onclick="setActiveLogisticsMilestone('${m.id}')" style="${borderStyle}border-left:4px solid ${color};border-radius:8px;padding:12px;cursor:pointer;min-width:240px;flex:0 0 240px;${bgStyle}transition:all 0.2s;">
      ${content}
    </div>`;
  }).join('');
}

function renderLogisticsActivities() {
  const el = document.getElementById('resd-timeline-activities');
  if (!el) return;
  
  if (!activeLogisticsMilestoneId) {
    el.innerHTML = '<div style="font-size:12px;color:var(--text-dim);padding:20px;text-align:center;background:rgba(255,255,255,0.02);border-radius:12px;border:1px dashed var(--border);">Select a milestone phase above to view its activities.</div>';
    return;
  }

  const extra = getActiveReservationExtra();
  if (!extra) return;
  
  const m = extra.logisticsMilestones.find(x => x.id === activeLogisticsMilestoneId);
  if (!m) {
    el.innerHTML = '<div style="font-size:12px;color:var(--text-dim);padding:20px;text-align:center;background:rgba(255,255,255,0.02);border-radius:12px;border:1px dashed var(--border);">Select a milestone phase above to view its activities.</div>';
    return;
  }
  
  const tasks = (extra.timelineTasks || []).filter(t => t.milestoneId === m.id);
  const color = m.color || 'var(--gold)';
  
  let content = `<div style="font-size:14px;font-weight:700;color:var(--cream);margin-bottom:12px;">Activities for ${escHtml(m.label)}</div>`;
  
  if (tasks.length === 0) {
    content += `<div style="font-size:12px;color:var(--text-dim);">No activities planned for this phase.</div>`;
  } else if (isEditingLogistics) {
     content += `<div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));gap:10px;">
       ${tasks.map(t => `
         <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.02);padding:10px 12px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);border-left:3px solid ${color};">
           <div style="font-size:12px;color:var(--text-mid);flex:1;margin-right:10px;">${escHtml(t.title)}</div>
           <input type="date" class="input-field" style="width:130px;padding:4px 8px;font-size:11px;" value="${t.date}" min="${m.startDate}" max="${m.endDate}" onchange="updateActivityDate('${t.id}', this.value, '${m.startDate}', '${m.endDate}')" />
         </div>
       `).join('')}
     </div>`;
  } else {
     content += `<div style="display:flex;flex-wrap:wrap;gap:8px;">
       ${tasks.map(t => `<div class="timeline-activity-chip ${t.status}" style="border-left-color:${color};" onclick="toggleTimelineTaskStatus('${t.id}')">${escHtml(t.title)}</div>`).join('')}
     </div>`;
  }

  el.innerHTML = `<div class="panel" style="margin:0;"><div class="panel-body" style="padding:18px;">${content}</div></div>`;
}

let isEditingLogistics = false;
function toggleLogisticsEditMode() {
  isEditingLogistics = !isEditingLogistics;
  const btn = document.getElementById('btn-edit-logistics');
  if (btn) {
    btn.textContent = isEditingLogistics ? 'Finish Editing' : 'Modify Timeline';
    btn.style.background = isEditingLogistics ? 'var(--green)' : 'var(--gold)';
  }
  renderReservationTimelineView();
}

async function updateMilestoneDate(mId, field, value) {
  const extra = getActiveReservationExtra();
  if (!extra) return;
  const m = extra.logisticsMilestones.find(x => x.id === mId);
  if (m) {
    m[field] = value;
    await saveLogisticsData();
    // We don't re-render immediately to avoid focus loss on input, 
    // unless user wants strict validation feedback.
    // However, FullCalendar might need update.
    if (resTimelineCalendar) renderReservationTimelineView();
  }
}

async function updateActivityDate(taskId, value, minDate, maxDate) {
  if (value < minDate || value > maxDate) {
    alert(`Activity date must be within milestone range: ${minDate} to ${maxDate}`);
    renderReservationTimelineView();
    return;
  }
  const extra = getActiveReservationExtra();
  if (!extra) return;
  const t = extra.timelineTasks.find(x => x.id === taskId);
  if (t) {
    t.date = value;
    await saveLogisticsData();
    renderReservationTimelineView();
  }
}

async function updateLogisticsMilestoneStatus(id, newStatus) {
  const extra = getActiveReservationExtra();
  if (!extra) return;
  const m = extra.logisticsMilestones.find(x => x.id === id);
  if (m) {
    m.status = newStatus;
    await saveLogisticsData();
    renderReservationTimelineView();
  }
}

async function toggleTimelineTaskStatus(taskId) {
  const extra = getActiveReservationExtra();
  if (!extra) return;
  const t = extra.timelineTasks.find(x => x.id === taskId);
  if (t) {
    const cycle = { pending: 'in-progress', 'in-progress': 'done', done: 'pending' };
    t.status = cycle[t.status] || 'pending';
    await saveLogisticsData();
    renderReservationTimelineView();
  }
}

async function saveLogisticsData() {
  if (!activeResDetailId) return;
  try {
    const extra = getActiveReservationExtra();
    const { updateDoc, doc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'reservations', activeResDetailId), {
      logisticsMilestones: extra.logisticsMilestones,
      timelineTasks: extra.timelineTasks
    });
  } catch (e) { console.error(e); }
}

function renderTimelineAnalytics(res, tasks) {
  const container = document.getElementById('resd-timeline-analytics');
  if (!container) return;

  if (!res) {
    container.style.display = 'none';
    return;
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const eventDateStr = res.date;
  
  // 1. Days left
  let daysLeftText = 'Event Passed';
  let daysLeftColor = 'var(--text-dim)';
  if (eventDateStr) {
    const today = new Date(todayStr + 'T00:00:00');
    const evDate = new Date(eventDateStr + 'T00:00:00');
    const diff = Math.ceil((evDate - today) / (1000 * 60 * 60 * 24));
    if (diff > 0) {
      daysLeftText = `${diff} Days Left`;
      daysLeftColor = diff <= 3 ? 'var(--red)' : (diff <= 7 ? 'var(--amber)' : 'var(--green)');
    } else if (diff === 0) {
      daysLeftText = 'Today is the Event';
      daysLeftColor = 'var(--gold)';
    }
  }

  // 2. Today's Load
  const todayTasks = tasks.filter(t => t.date === todayStr);
  const pendingToday = todayTasks.filter(t => t.status === 'pending' || t.status === 'in-progress');
  const todayColor = pendingToday.length > 0 ? 'var(--amber)' : 'var(--text-dim)';
  
  // 3. Delayed/Overdue
  const overdueTasks = tasks.filter(t => t.date < todayStr && t.status !== 'done');
  const overdueColor = overdueTasks.length > 0 ? 'var(--red)' : 'var(--green)';

  container.innerHTML = `
    <div style="background:var(--bg3); border:1px solid var(--border); border-radius:10px; padding:15px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
      <div style="font-size:11px; color:var(--text-dim); text-transform:uppercase; letter-spacing:1px; margin-bottom:5px;">Countdown</div>
      <div style="font-size:24px; font-weight:700; color:${daysLeftColor};">${daysLeftText}</div>
    </div>
    <div style="background:var(--bg3); border:1px solid var(--border); border-radius:10px; padding:15px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
      <div style="font-size:11px; color:var(--text-dim); text-transform:uppercase; letter-spacing:1px; margin-bottom:5px;">Today's Load</div>
      <div style="font-size:24px; font-weight:700; color:${todayColor};">${pendingToday.length} Pending</div>
      <div style="font-size:10px; color:var(--text-dim); margin-top:2px;">out of ${todayTasks.length} scheduled today</div>
    </div>
    <div style="background:var(--bg3); border:1px solid var(--border); border-radius:10px; padding:15px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
      <div style="font-size:11px; color:var(--text-dim); text-transform:uppercase; letter-spacing:1px; margin-bottom:5px;">Delayed Activities</div>
      <div style="font-size:24px; font-weight:700; color:${overdueColor};">${overdueTasks.length}</div>
      <div style="font-size:10px; color:var(--text-dim); margin-top:2px;">past due deadline</div>
    </div>
  `;
  container.style.display = 'grid';
}

function renderReservationTimelineView() {
  const summary = document.getElementById('resd-timeline-summary');
  const calEl = document.getElementById('resd-timeline-calendar');
  if (!summary || !calEl) return;
  const res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  if (!res) {
    summary.textContent = 'Select a reservation first.';
    return;
  }

  const startDate = getReservationPrepStartDate(res);
  const eventDate = normalizeDateKey(res.date);
  summary.textContent = `Coverage: ${startDate} to ${eventDate}. Assign tasks per day and monitor payment milestones.`;

  const tasks = getTimelineTasks();
  renderTimelineAnalytics(res, tasks);

  const extra = getActiveReservationExtra();
  const milestones = (extra && extra.logisticsMilestones) || [];

  const taskEvents = tasks.map(function (t) {
    const m = milestones.find(x => x.id === t.milestoneId);
    const mColor = m ? m.color : '#8a7a5a';
    
    // Status color logic: if done, use green. if in-progress, use amber. if pending, use milestone color or default.
    let color = mColor;
    if (t.status === 'done') color = '#2d8a4e';
    else if (t.status === 'in-progress') color = '#d97706';

    return {
      id: t.id,
      title: t.title || 'Activity',
      start: t.date,
      allDay: true,
      color: color,
      textColor: '#fff',
      sortOrder: 2,
      editable: true, // Allow dragging activities
      extendedProps: { status: t.status, milestoneId: t.milestoneId }
    };
  });
  
  const milestoneEvents = milestones.map(m => {
    // Add 1 day to endDate because FullCalendar 'end' is exclusive for all-day events
    let endPlusOne = m.endDate;
    try {
      const d = new Date(m.endDate + 'T00:00:00');
      d.setDate(d.getDate() + 1);
      endPlusOne = d.toISOString().split('T')[0];
    } catch(e){}

    return {
      id: 'm-' + m.id,
      title: m.label,
      start: m.startDate,
      end: endPlusOne,
      allDay: true,
      color: m.color || 'var(--gold)',
      display: 'block',
      opacity: 0.9,
      sortOrder: 1,
      editable: false, // Don't drag milestones as they are ranges
      className: 'milestone-event-block'
    };
  });

  const coverageEvents = buildReservationCalendarEvents([res], { includeMainEventLabel: false });
  const allEvents = coverageEvents.concat(taskEvents).concat(milestoneEvents);

  if (!resTimelineCalendar) {
    resTimelineCalendar = new FullCalendar.Calendar(calEl, {
      initialView: 'dayGridMonth',
      headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,listWeek' },
      height: 520,
      editable: true,
      events: allEvents,
      eventOrder: 'sortOrder,start', // Milestones (1) first, then Tasks (2)
      eventClick: function(info) {
        // 1. Check if Event Day is clicked (Execution Planner)
        if (info.event.extendedProps.type === 'event') {
          openExecutionPlanner(info.event.startStr);
          return;
        }

        // 2. Smart Activity Redirect
        if (String(info.event.id).startsWith('auto-')) {
          const t = info.event.title.toLowerCase();
          
          if (t.includes('food tast') || t.includes('menu')) {
            switchResDetailsTab('food');
          } else if (t.includes('venue assess') || t.includes('ocular')) {
            switchResDetailsTab('venue');
          } else if (t.includes('equipment') || t.includes('procure') || t.includes('inventory')) {
            switchResDetailsTab('procurement');
          } else if (t.includes('design') || t.includes('theme') || t.includes('decor')) {
            switchResDetailsTab('design');
          } else if (t.includes('personnel') || t.includes('staff')) {
            switchResDetailsTab('staff');
          } else {
            // General task without specific tab
            toggleTimelineTaskStatus(info.event.id);
          }
        }
      },
      eventDrop: async function(info) {
        const taskId = info.event.id;
        if (!taskId.startsWith('auto-')) {
          info.revert();
          return;
        }
        const newDate = info.event.startStr;
        const milestoneId = info.event.extendedProps.milestoneId;
        const m = milestones.find(x => x.id === milestoneId);
        
        if (m && (newDate < m.startDate || newDate > m.endDate)) {
          alert(`Cannot move activity outside milestone range (${m.startDate} to ${m.endDate})`);
          info.revert();
          return;
        }
        
        // Update database
        await updateActivityDate(taskId, newDate, m ? m.startDate : '1900-01-01', m ? m.endDate : '2100-01-01');
      },
      eventDidMount: function(info) {
        if (info.event.id.startsWith('m-')) {
          info.el.style.borderLeft = '4px solid rgba(255,255,255,0.3)';
          info.el.style.fontWeight = 'bold';
        }
      }
    });
    resTimelineCalendar.render();
  } else {
    resTimelineCalendar.removeAllEvents();
    resTimelineCalendar.addEventSource(allEvents);
  }

  renderLogisticsMilestones(res);
  renderLogisticsActivities();
  renderTimelineTaskList();
  const payMilestones = computePaymentMilestones(res);
  renderPaymentTimeline(res, payMilestones);
  renderReschedulePanel(res);
  renderExecutionPanelState();
}

function renderReschedulePanel(res) {
  document.getElementById('resd-resched-date').value = res.date || '';
  document.getElementById('resd-resched-time').value = res.time || '';
  document.getElementById('resd-resched-dp').value = res.downpaymentDueDate || '';
  document.getElementById('resd-resched-reason').value = '';
}

async function executeReschedule() {
  const res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  if (!res) return;

  const newDateStr = document.getElementById('resd-resched-date').value;
  const newTimeStr = document.getElementById('resd-resched-time').value.trim();
  const newDpStr = document.getElementById('resd-resched-dp').value;
  const reason = document.getElementById('resd-resched-reason').value.trim();

  if (!newDateStr) return alert("Please select a new event date.");
  if (!reason) return alert("Please provide a reason for the rescheduling.");

  const oldDateStr = res.date;
  const extra = getActiveReservationExtra();

  // 1. Preserve existing task statuses
  const statusMap = {};
  if (extra && extra.timelineTasks) {
    extra.timelineTasks.forEach(t => {
      if (t.status !== 'pending') {
        statusMap[t.title] = t.status;
      }
    });
  }

  // 2. Temporarily update res properties for the generation
  const oldResPayload = { date: res.date, time: res.time, downpaymentDueDate: res.downpaymentDueDate };
  res.date = newDateStr;
  res.time = newTimeStr;
  res.downpaymentDueDate = newDpStr;

  // 3. Re-run automatic milestone generation
  const genResult = generateAutoLogisticsMilestones(res);
  
  if (extra) {
    extra.logisticsMilestones = genResult.milestones;
    extra.timelineTasks = genResult.tasks;

    // 4. Restore preserved statuses & check for weekends
    let weekendAlertShown = false;
    let weekendCount = 0;
    
    extra.timelineTasks.forEach(t => {
      // Restore status
      if (statusMap[t.title]) {
        t.status = statusMap[t.title];
      }
      
      // Check for weekends
      const d = new Date(t.date);
      const dayOfWeek = d.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendCount++;
      }
    });

    if (weekendCount > 0) {
      alert(`Warning: The new even spread placed ${weekendCount} rescheduled tasks on weekends (Saturday/Sunday). Please review the calendar.`);
    }

    await saveLogisticsData();
  }

  // 5. Build payload and update main document
  const payload = {
    date: newDateStr,
    time: newTimeStr,
    downpaymentDueDate: newDpStr
  };
  
  try {
    const { doc, updateDoc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'reservations', res.id), payload);
    Object.assign(res, payload);
    
    // 6. Log the change
    const logs = ensureReservationLifecycleLogs(res);
    logs.push({
      id: 'log-' + Date.now() + '-' + Math.random().toString(16).slice(2, 6),
      category: 'system',
      message: `Reservation rescheduled from ${oldDateStr} to ${newDateStr}. Reason: ${reason}`,
      at: new Date().toISOString()
    });
    await updateDoc(doc(window.firebaseDB, 'reservations', res.id), { activityLogs: logs });

    showToast('Reservation successfully rescheduled.');
    renderReservationTimelineView();
  } catch (e) {
    console.error(e);
    alert('Failed to save reschedule changes. Check console.');
    // Revert temporary changes
    Object.assign(res, oldResPayload);
  }
}

function setExecText(id, txt) {
  const el = document.getElementById(id);
  if (el) el.textContent = txt;
}

function setExecStatus(msg) {
  setExecText('res-exec-status', msg);
}

function initExecutionMap() {
  const el = document.getElementById('res-exec-map');
  if (!el || typeof L === 'undefined') return false;
  if (!resExecMap) {
    resExecMap = L.map(el, { zoomControl: true, attributionControl: false }).setView([14.5995, 120.9842], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(resExecMap);
  }
  return true;
}

async function geocodeVenueAddress(query) {
  const url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query) + '&limit=1&countrycodes=ph';
  const r = await fetch(url);
  const data = await r.json();
  if (!data || !data.length) return null;
  return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
}

async function fetchRouteLL(fromLL, toLL) {
  const url = 'https://router.project-osrm.org/route/v1/driving/' + fromLL[1] + ',' + fromLL[0] + ';' + toLL[1] + ',' + toLL[0] + '?overview=full&geometries=geojson';
  const r = await fetch(url);
  if (!r.ok) return null;
  const data = await r.json();
  if (!data.routes || !data.routes.length) return null;
  const route = data.routes[0];
  return {
    coords: route.geometry.coordinates.map(function (c) { return [c[1], c[0]]; }),
    distanceKm: (route.distance || 0) / 1000,
    etaMin: (route.duration || 0) / 60
  };
}

function getActiveReservationVenue() {
  const res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  if (!res) return null;
  return res.venue || res.venueAddress || res.eventVenue || null;
}

function getActiveExecutionState() {
  const extra = getActiveReservationExtra();
  if (!extra) return null;
  if (!extra.execution) {
    extra.execution = {
      liveStatus: 'idle',
      delayReason: '',
      activityLogs: [],
      lastLocationLogAt: null,
      selectedPhaseId: 'departure',
      phasedPlan: null
    };
  }
  if (!Array.isArray(extra.execution.activityLogs)) extra.execution.activityLogs = [];
  if (!extra.execution.selectedPhaseId) extra.execution.selectedPhaseId = 'departure';
  return extra.execution;
}

function getExecutionDateKey() {
  const override = (window.executionDayOverrides || {})[activeResDetailId];
  if (override && override.forcedDate) return override.forcedDate;
  const res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  return normalizeDateKey((res && res.date) || new Date().toISOString().split('T')[0]);
}

function buildPlaceholderExecutionPhasedPlan() {
  function mk(phaseId, titles) {
    return titles.map(function (title, i) {
      return {
        id: phaseId + '-t' + i,
        title: title,
        detail: 'Placeholder — customer dashboard will mirror logged progress when wired.',
        done: false
      };
    });
  }
  return [
    {
      id: 'departure',
      label: 'Departure',
      timeLabel: '05:30 – 08:00',
      startTime: '05:30',
      endTime: '08:00',
      tasks: mk('departure', [
        'Print outbound manifest and verify reservation ID on all crates',
        'Vehicle safety walkaround — tires, brakes, lights, lift gate',
        'Load temperature-controlled holding racks (hot / cold separation)',
        'Seal glassware crates with tamper tags and photograph seals',
        'Cross-check linen roll counts vs allocation manifest',
        'Stage disposable backups (gloves, trash liners, spill kits)',
        'Confirm fuel level and backup generator key on chain',
        'Assign radio channel / shared phone hotspot for convoy',
        'Load staging dolly set and stair-climber if venue has steps',
        'Verify cake / dessert cart tie-downs and leveling wedges',
        'Sign cold-chain departure log (start temps recorded)',
        'Brief team on route, venue dock rules, and parking passes',
        'Dispatch “departure confirmed” ping to ops dashboard',
        'Final lock of cargo doors — photo timestamp for customer feed'
      ])
    },
    {
      id: 'deployment',
      label: 'Deployment',
      timeLabel: '08:00 – 11:30',
      startTime: '08:00',
      endTime: '11:30',
      tasks: mk('deployment', [
        'Dock check-in with venue security — unload sequence plan',
        'Lay floor protection from service entry to kitchen corridor',
        'Mark fire-lane keep-clear zones with cones / tape',
        'Build buffet backbone — skirting, risers, chafing layout',
        'Deploy bar back — ice wells, speed rails, garnish mise',
        'Set head table / VIP focal — linens, chargers, place cards',
        'Rig uplights / pin-spots per floor plan (placeholder power drops)',
        'Sound check — wireless mic scan, feedback guard, playlist handoff',
        'Glass polish pass — steam station for high-touch pieces',
        'Restroom amenity tray placement and candle safety check',
        'Service line dry-run — tongs, ladles, label cards for allergens',
        'Photo pass to customer success (wide + detail shots)',
        'Hold staff huddle — timeline, toast cue, cake wheel path',
        'Mark “deployment ready” on execution board'
      ])
    },
    {
      id: 'execution',
      label: 'Execution',
      timeLabel: '11:30 – 17:00',
      startTime: '11:30',
      endTime: '17:00',
      tasks: mk('execution', [
        'Guest arrival — coat / gift table staffing and signage',
        'Cocktail hour float — tray restock cadence every 12 min',
        'Ice top-off rotation — log melt rate vs ambient temp',
        'Buffet open — monitor holding temps each 20 min',
        'VIP table touch-up — water, bread, crumb between courses',
        'Carving station — knife exchange and cutting board swap',
        'Coffee / tea service — urn levels and decaf flag visibility',
        'Toast / speech cue — dim lights, mic handoff, backup mic ready',
        'Cake cutting — knife, server, plates, photo lane clear',
        'Dance floor transition — chair stack plan, DJ liaison',
        'Late-night snack station — heat lamp check, allergen cards',
        'Incident watch — glass break kit location confirmed',
        'Manager floor walk every 45 min — log notes',
        'Customer pulse check — quick thumbs-up message to dashboard'
      ])
    },
    {
      id: 'bashout',
      label: 'Bash-out',
      timeLabel: '17:00 – 20:30',
      startTime: '17:00',
      endTime: '20:30',
      tasks: mk('bashout', [
        'Announce soft-close of buffet — consolidate chafing fuel safely',
        'Breakdown head table — pack heirlooms into labeled hard case',
        'Collect centerpieces / rentals — damage sticker pass',
        'Glassware consolidation by crate type — bubble counts',
        'Linens shake-out and damp-separate for laundry routing',
        'Lost & found sweep — under tables, lounge, restrooms',
        'Trash consolidation — tie, label, stage for venue pickup',
        'Floor spot-clean — high-traffic paths and bar mat lift',
        'Equipment damage photo log — customer signature placeholder',
        'Final venue walk with duty manager — checklist sign-off',
        'Load-out sequence — heavy first, fragile last on air ride',
        'Vehicle pack photo — door seal numbers recorded',
        'Send “bash-out complete” status to customer dashboard',
        'Quick team debrief — incidents, compliments, overtime notes'
      ])
    },
    {
      id: 'restorage',
      label: 'Restorage',
      timeLabel: '20:30 – 23:00',
      startTime: '20:30',
      endTime: '23:00',
      tasks: mk('restorage', [
        'Return to warehouse — bay assignment and unload order',
        'Dirty linen drop at dock scale — weight ticket scan',
        'Glassware crate intake — wash queue priority by soil level',
        'Chafing / smallware soak tanks — degrease timer set',
        'Inventory spot-count — flag shortages vs outbound manifest',
        'Rental segregation cage — Lumina / other supplier tags',
        'Battery recharge rack — uplights and wireless gear',
        'Restock disposables par levels for next event bin',
        'Update lifecycle notes for any flagged damaged SKUs',
        'Archive photos and temp logs to reservation record',
        'Reset vehicle — sweep, sanitize handles, restock tie-downs',
        'Lock warehouse — alarm test and key log entry',
        'Mark restorage closed — execution day fully logged'
      ])
    }
  ];
}

function ensureExecutionPhasedPlan() {
  const exec = getActiveExecutionState();
  if (!exec) return;
  const dk = getExecutionDateKey();
  if (!exec.phasedPlan || exec.phasedPlan.dateKey !== dk) {
    exec.phasedPlan = { dateKey: dk, phases: buildPlaceholderExecutionPhasedPlan() };
    if (!exec.selectedPhaseId || !exec.phasedPlan.phases.some(function (p) { return p.id === exec.selectedPhaseId; })) {
      exec.selectedPhaseId = 'departure';
    }
  }
}

function selectExecutionPhase(phaseId) {
  const exec = getActiveExecutionState();
  if (!exec || !exec.phasedPlan) return;
  if (!exec.phasedPlan.phases.some(function (p) { return p.id === phaseId; })) return;
  exec.selectedPhaseId = phaseId;
  renderExecutionPanelState();
}

function toggleExecutionPhaseTask(phaseId, taskId, done) {
  const exec = getActiveExecutionState();
  if (!exec || !exec.phasedPlan) return;
  const phase = exec.phasedPlan.phases.find(function (p) { return p.id === phaseId; });
  if (!phase) return;
  const task = phase.tasks.find(function (t) { return t.id === taskId; });
  if (!task) return;
  task.done = !!done;
  pushExecutionLog('phase-task', (done ? 'Completed' : 'Reopened') + ': ' + task.title, 'Phase: ' + phase.label);
  renderExecutionPanelState();
}

function renderExecutionPhaseBoard(exec) {
  const phasesEl = document.getElementById('res-exec-phases');
  const headerEl = document.getElementById('res-exec-phase-header');
  const tasksEl = document.getElementById('res-exec-phase-tasks');
  if (!phasesEl || !headerEl || !tasksEl) return;
  if (!exec || !exec.phasedPlan || !exec.phasedPlan.phases.length) {
    phasesEl.innerHTML = '';
    headerEl.innerHTML = '';
    tasksEl.innerHTML = '<div style="font-size:12px;color:var(--text-dim);">No phased plan loaded.</div>';
    return;
  }
  const sel = exec.selectedPhaseId || 'departure';
  phasesEl.innerHTML = exec.phasedPlan.phases.map(function (p) {
    const active = p.id === sel;
    return `<button type="button" class="btn-outline" style="font-size:11px;text-align:left;line-height:1.35;${active ? 'border-color:var(--gold);color:var(--gold);background:rgba(196,154,60,0.12);' : ''}" onclick="selectExecutionPhase('${escAttr(p.id)}')">
      <span style="font-weight:700;">${escHtml(p.label)}</span><br>
      <span style="font-size:9px;color:var(--text-dim);">${escHtml(p.timeLabel)}</span>
    </button>`;
  }).join('');

  const phase = exec.phasedPlan.phases.find(function (p) { return p.id === sel; }) || exec.phasedPlan.phases[0];
  const doneCount = phase.tasks.filter(function (t) { return t.done; }).length;
  const total = phase.tasks.length;
  headerEl.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;">
      <div>
        <div style="font-size:14px;font-weight:700;color:var(--cream);">${escHtml(phase.label)}</div>
        <div style="font-size:11px;color:var(--text-dim);margin-top:4px;">Window: ${escHtml(phase.timeLabel)} · ${escHtml(phase.startTime)}–${escHtml(phase.endTime)}</div>
      </div>
      <span class="badge pending" style="font-size:10px;">${doneCount}/${total} done</span>
    </div>`;

  tasksEl.innerHTML = phase.tasks.map(function (t) {
    return `<div style="border:1px solid var(--border);border-radius:8px;padding:10px 12px;margin-bottom:8px;display:flex;gap:10px;align-items:flex-start;">
      <input type="checkbox" style="margin-top:3px;" ${t.done ? 'checked' : ''} onchange="toggleExecutionPhaseTask('${escAttr(phase.id)}','${escAttr(t.id)}', this.checked)"/>
      <div style="flex:1;min-width:0;">
        <div style="font-size:12px;font-weight:600;color:var(--cream);">${escHtml(t.title)}</div>
        <div style="font-size:11px;color:var(--text-dim);margin-top:4px;line-height:1.45;">${escHtml(t.detail || '')}</div>
      </div>
    </div>`;
  }).join('');
}

function pushExecutionLog(type, title, note) {
  const exec = getActiveExecutionState();
  if (!exec) return;
  exec.activityLogs.unshift({
    id: 'exec-' + Date.now() + '-' + Math.random().toString(16).slice(2, 6),
    type: type || 'activity',
    date: getExecutionDateKey(),
    title: title || 'Execution update',
    note: note || '',
    createdAt: new Date().toISOString()
  });
  if (exec.activityLogs.length > 120) exec.activityLogs.length = 120;
}

function renderExecutionPanelState() {
  const listEl = document.getElementById('res-exec-activity-list');
  const delayWrap = document.getElementById('res-exec-delay-wrap');
  const delayInput = document.getElementById('res-exec-delay-reason');
  const statusEl = document.getElementById('res-exec-live-status');
  const exec = getActiveExecutionState();
  if (!listEl || !statusEl || !delayWrap || !delayInput) return;
  if (!exec) {
    listEl.innerHTML = '<div style="font-size:12px;color:var(--text-dim);">Select a reservation to load execution mode.</div>';
    return;
  }

  statusEl.textContent = exec.liveStatus || 'idle';
  delayInput.value = exec.delayReason || '';
  delayWrap.style.display = (exec.liveStatus === 'delayed') ? '' : 'none';

  ensureExecutionPhasedPlan();
  renderExecutionPhaseBoard(exec);

  const dayKey = getExecutionDateKey();
  const timelineLogs = getTimelineTasks()
    .filter(function (t) { return normalizeDateKey(t.date) === dayKey; })
    .map(function (t) {
      return {
        id: t.id,
        createdAt: t.createdAt || (t.date + 'T09:00:00'),
        title: t.title || 'Timeline Activity',
        note: t.note || '',
        type: 'timeline'
      };
    });

  const execLogs = (exec.activityLogs || []).filter(function (l) { return normalizeDateKey(l.date) === dayKey; });
  const allLogs = timelineLogs.concat(execLogs).sort(function (a, b) {
    return String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
  });
  if (!allLogs.length) {
    listEl.innerHTML = '<div style="font-size:12px;color:var(--text-dim);">No execution-day activities logged yet.</div>';
    return;
  }

  listEl.innerHTML = allLogs.map(function (l) {
    const at = new Date(l.createdAt || Date.now());
    const time = isNaN(at.getTime()) ? '—' : at.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const badge = l.type === 'timeline' ? 'warning' : 'pending';
    return `<div style="border:1px solid var(--border);border-radius:8px;padding:8px 10px;margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
        <div style="font-size:12px;font-weight:700;color:var(--cream);">${escHtml(l.title || 'Activity')}</div>
        <span class="badge ${badge}" style="font-size:10px;">${escHtml(l.type || 'activity')}</span>
      </div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:3px;">${escHtml(l.note || 'No note')}</div>
      <div style="font-size:10px;color:var(--text-dim);margin-top:3px;">${escHtml(dayKey)} · ${escHtml(time)}</div>
    </div>`;
  }).join('');
}

function setExecutionLiveStatus(status) {
  const exec = getActiveExecutionState();
  if (!exec) {
    alert('Select a reservation first.');
    return;
  }
  exec.liveStatus = status;
  if (status === 'delayed') {
    setExecStatus('Marked delayed. Delay reason is required.');
    renderExecutionPanelState();
    return;
  }
  pushExecutionLog('status', 'Status updated: ' + status, 'Execution status changed by admin.');
  setExecStatus('Execution status updated to ' + status + '.');
  renderExecutionPanelState();
}

function saveExecutionDelayReason() {
  const exec = getActiveExecutionState();
  const input = document.getElementById('res-exec-delay-reason');
  if (!exec || !input) return;
  const reason = (input.value || '').trim();
  if (!reason) {
    alert('Delay reason is required.');
    return;
  }
  exec.delayReason = reason;
  pushExecutionLog('delay', 'Delayed', reason);
  setExecStatus('Delay reason saved and logged.');
  renderExecutionPanelState();
}

function addExecutionActivityLog() {
  const exec = getActiveExecutionState();
  const titleEl = document.getElementById('res-exec-activity-title');
  const noteEl = document.getElementById('res-exec-activity-note');
  if (!exec || !titleEl || !noteEl) return;
  const title = (titleEl.value || '').trim();
  const note = (noteEl.value || '').trim();
  if (!title) {
    alert('Please enter an activity title.');
    return;
  }
  pushExecutionLog('activity', title, note);
  titleEl.value = '';
  noteEl.value = '';
  renderExecutionPanelState();
}

function updateExecSpeed(newLL) {
  if (!resExecLastFix) {
    resExecLastFix = { ll: newLL, ts: Date.now() };
    setExecText('res-exec-speed', '0 km/h');
    return;
  }
  const now = Date.now();
  const dtHrs = (now - resExecLastFix.ts) / 3600000;
  const dKm = haversineKm(resExecLastFix.ll, newLL);
  const spd = dtHrs > 0 ? Math.min(180, dKm / dtHrs) : 0;
  setExecText('res-exec-speed', Math.round(spd) + ' km/h');
  resExecLastFix = { ll: newLL, ts: now };
}

function haversineKm(a, b) {
  const R = 6371;
  const dLat = (b[0] - a[0]) * Math.PI / 180;
  const dLon = (b[1] - a[1]) * Math.PI / 180;
  const x = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(a[0] * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

async function updateExecutionRoute(adminLL, venueLL) {
  const now = Date.now();
  if (now - resExecLastRouteAt < 6000) return;
  resExecLastRouteAt = now;

  let route = null;
  try {
    route = await fetchRouteLL(adminLL, venueLL);
  } catch (e) {
    route = null;
  }

  if (resExecRouteLayer) resExecMap.removeLayer(resExecRouteLayer);
  if (route && route.coords && route.coords.length > 1) {
    resExecRouteLayer = L.polyline(route.coords, { color: '#3b82f6', weight: 5, opacity: 0.9 }).addTo(resExecMap);
    setExecText('res-exec-eta', (route.etaMin < 1 ? '<1' : Math.round(route.etaMin)) + ' min');
    setExecText('res-exec-distance', route.distanceKm.toFixed(2) + ' km');
  } else {
    // Fallback: always render a visible direct line when routing API is unavailable.
    const directKm = haversineKm(adminLL, venueLL);
    const etaMin = (directKm / 30) * 60;
    resExecRouteLayer = L.polyline([adminLL, venueLL], { color: '#5b9bd5', weight: 4, opacity: 0.85, dashArray: '8,8' }).addTo(resExecMap);
    setExecText('res-exec-eta', (etaMin < 1 ? '<1' : Math.round(etaMin)) + ' min');
    setExecText('res-exec-distance', directKm.toFixed(2) + ' km');
    setExecStatus('Routing API unavailable, showing direct path.');
  }
}

async function startExecutionTrackerAuto() {
  if (!initExecutionMap()) {
    alert('Map library unavailable.');
    return;
  }
  const venue = getActiveReservationVenue();
  if (!venue) {
    alert('Selected reservation has no venue address yet.');
    return;
  }
  setExecStatus('Resolving venue and requesting device location...');
  let venueLL;
  try {
    venueLL = await geocodeVenueAddress(venue);
  } catch (e) {
    venueLL = null;
  }
  if (!venueLL) {
    alert('Unable to geocode venue address for this reservation.');
    setExecStatus('Unable to locate venue coordinates.');
    return;
  }

  if (resExecVenueMarker) resExecMap.removeLayer(resExecVenueMarker);
  resExecVenueMarker = L.marker(venueLL).addTo(resExecMap).bindPopup('Venue').openPopup();
  if (typeof resExecMap.invalidateSize === 'function') {
    setTimeout(function () { resExecMap.invalidateSize(); }, 100);
  }

  if (!navigator.geolocation) {
    alert('Geolocation is not supported on this device/browser.');
    return;
  }

  if (resExecWatchId !== null) navigator.geolocation.clearWatch(resExecWatchId);
  resExecLastRouteAt = 0;
  resExecLastFix = null;
  pushExecutionLog('tracker', 'Tracker started', 'Live GPS tracking started for execution day.');
  const exec = getActiveExecutionState();
  if (exec && (!exec.liveStatus || exec.liveStatus === 'idle')) exec.liveStatus = 'on-the-way';
  renderExecutionPanelState();
  resExecWatchId = navigator.geolocation.watchPosition(async function (pos) {
    const adminLL = [pos.coords.latitude, pos.coords.longitude];
    updateExecSpeed(adminLL);
    if (resExecAdminMarker) resExecAdminMarker.setLatLng(adminLL);
    else resExecAdminMarker = L.marker(adminLL).addTo(resExecMap).bindPopup('Admin');
    await updateExecutionRoute(adminLL, venueLL);
    const bounds = L.latLngBounds([adminLL, venueLL]).pad(0.2);
    resExecMap.fitBounds(bounds);
    setExecStatus('Live tracking active for reservation execution.');

    const now = Date.now();
    const e = getActiveExecutionState();
    if (e && (!e.lastLocationLogAt || (now - e.lastLocationLogAt) > 60000)) {
      e.lastLocationLogAt = now;
      pushExecutionLog('location', 'GPS check-in', 'Admin at ' + adminLL[0].toFixed(5) + ', ' + adminLL[1].toFixed(5));
      renderExecutionPanelState();
    }
  }, function (err) {
    setExecStatus('Location error: ' + err.message);
  }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 2000 });
}

function stopExecutionTracker() {
  if (resExecWatchId !== null) {
    navigator.geolocation.clearWatch(resExecWatchId);
    resExecWatchId = null;
  }
  pushExecutionLog('tracker', 'Tracker stopped', 'Live GPS tracking stopped.');
  const exec = getActiveExecutionState();
  if (exec && exec.liveStatus !== 'arrived') exec.liveStatus = 'stopped';
  renderExecutionPanelState();
  setExecStatus('Tracker stopped.');
}

function getTodayDateKey() {
  return new Date().toISOString().split('T')[0];
}

function forceExecutionDayForReservation(resId) {
  const res = RESERVATIONS.find(function (r) { return r.id === resId; });
  if (!res) {
    alert('Reservation not found.');
    return;
  }
  window.executionDayOverrides[resId] = {
    forcedDate: getTodayDateKey(),
    forcedAt: new Date().toISOString()
  };
  activeResDetailId = resId;
  resDetailMode = 'view';
  showSection('res-details', document.getElementById('nav-res-details'));
  switchResDetailsTab('timeline', document.getElementById('resd-tab-timeline'));
  renderReservationDetailsHandling();
  const panel = document.getElementById('res-exec-panel');
  if (panel && typeof panel.scrollIntoView === 'function') {
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  setExecStatus('Execution day forced for ' + (res.client || 'reservation') + '. Starting tracker...');
  pushExecutionLog('execution-day', 'Execution day forced', 'Simulation was started by admin.');
  renderExecutionPanelState();
  setTimeout(function () { startExecutionTrackerAuto(); }, 220);
}

async function addTimelineTask() {
  const res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  if (!res) return;
  const date = document.getElementById('resd-task-date').value || normalizeDateKey(res.date);
  const title = (document.getElementById('resd-task-title').value || '').trim() || 'Preparation Activity';
  const status = document.getElementById('resd-task-status').value || 'pending';
  const note = (document.getElementById('resd-task-note').value || '').trim();
  const tasks = getTimelineTasks();
  tasks.push({ id: 'RT-' + Date.now(), date: date, title: title, status: status, note: note, logAt: new Date().toISOString() });
  document.getElementById('resd-task-title').value = '';
  document.getElementById('resd-task-note').value = '';
  await saveLogisticsData();
  renderReservationTimelineView();
}

async function updateTimelineTaskStatus(taskId, status) {
  const tasks = getTimelineTasks();
  const t = tasks.find(function (x) { return x.id === taskId; });
  if (!t) return;
  t.status = status;
  t.logAt = new Date().toISOString();
  await saveLogisticsData();
  renderReservationTimelineView();
}

async function markTimelinePaymentPaid(key) {
  const extra = getActiveReservationExtra();
  if (!extra || !extra.paymentRecords || !extra.paymentRecords[key]) return;
  extra.paymentRecords[key].status = 'paid';
  extra.paymentRecords[key].paidAt = new Date().toISOString();
  const res = RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  if (res) {
    try {
      const { doc, updateDoc } = window.firebaseFns;
      await updateDoc(doc(window.firebaseDB, 'reservations', res.id), {
        paymentTimeline: extra.paymentRecords,
        paymentStatus: 'paid'
      });
    } catch (e) { }
  }
  renderReservationTimelineView();
}

window.renderReservationDetailsHandling = renderReservationDetailsHandling;
window.selectReservationDetail = selectReservationDetail;
window.setReservationDetailMode = setReservationDetailMode;
window.saveReservationDetailEdits = saveReservationDetailEdits;
window.saveReservationDetailStatus = saveReservationDetailStatus;
window.renderExtraReservationDetails = renderExtraReservationDetails;
window.addGuestRow = addGuestRow;
window.removeGuestRow = removeGuestRow;
window.updateGuestRow = updateGuestRow;
window.saveGuestList = saveGuestList;
window.markLayoutSentToCustomer = markLayoutSentToCustomer;
window.markLayoutReceived = markLayoutReceived;
window.switchResDetailsTab = switchResDetailsTab;
window.renderReservationTimelineView = renderReservationTimelineView;
window.addTimelineTask = addTimelineTask;
window.updateTimelineTaskStatus = updateTimelineTaskStatus;
window.markTimelinePaymentPaid = markTimelinePaymentPaid;
window.runReservationPaymentAutomation = runReservationPaymentAutomation;
window.startExecutionTrackerAuto = startExecutionTrackerAuto;
window.stopExecutionTracker = stopExecutionTracker;
window.forceExecutionDayForReservation = forceExecutionDayForReservation;
window.setExecutionLiveStatus = setExecutionLiveStatus;
window.saveExecutionDelayReason = saveExecutionDelayReason;
window.addExecutionActivityLog = addExecutionActivityLog;
window.selectExecutionPhase = selectExecutionPhase;
window.toggleExecutionPhaseTask = toggleExecutionPhaseTask;
window.renderActivityLogsSection = renderActivityLogsSection;
window.selectActivityLogReservation = selectActivityLogReservation;
window.switchInsightsPane = switchInsightsPane;

// ===== RENDER EVENTS CALENDAR =====
window.calendar = null;
function renderEvents() {
  const approved = RESERVATIONS.filter(r => ['confirmed', 'procurement', 'procuring', 'preparing', 'on-going'].includes(String(r.status || '').toLowerCase()));
  const calEl = document.getElementById('calendar');
  if (!calEl) return;

  if (typeof FullCalendar === 'undefined') {
    calEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-dim);">Calendar library loading...</div>';
    return;
  }

  const eventsData = buildReservationCalendarEvents(approved);
  try {
    if (!window.calendar) {
      window.calendar = new FullCalendar.Calendar(calEl, {
        initialView: 'dayGridMonth',
        headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,listWeek' },
        height: 650,
        events: eventsData,
        eventClick: function (info) { openEventDetails(info.event.extendedProps?.reservationId || info.event.id); }
      });
      if (document.getElementById('section-events').classList.contains('active')) {
        window.calendar.render();
      }
    } else {
      window.calendar.removeAllEvents();
      window.calendar.addEventSource(eventsData);
    }
  } catch (e) {
    console.error('FullCalendar Error (Main):', e);
    calEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--red);">Error loading calendar.</div>';
  }
}

// ===== RENDER INSIGHTS =====
let insightsActivePane = 'core';

function switchInsightsPane(mode, btn) {
  insightsActivePane = mode === 'forecast' ? 'forecast' : 'core';
  document.querySelectorAll('#insights-tab-bar .tab-btn').forEach(function (b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  else {
    const id = insightsActivePane === 'forecast' ? 'insights-tab-forecast' : 'insights-tab-core';
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  }
  const core = document.getElementById('insights-pane-core');
  const fc = document.getElementById('insights-pane-forecast');
  if (core) core.style.display = insightsActivePane === 'core' ? '' : 'none';
  if (fc) fc.style.display = insightsActivePane === 'forecast' ? '' : 'none';
  if (insightsActivePane === 'forecast') renderForecastingDashboard();
}

function getForecastSeasonProfile(forecasts, isBusy) {
  const now = new Date();
  const m = now.getMonth();
  const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // If model data is available, use it — otherwise fall back to date-based logic
  var currentForecast = forecasts ? forecasts[m] : null;
  var currentIsBusy = isBusy ? isBusy[m] : (m >= 7 && m <= 11);
  var nextIsBusy = isBusy ? isBusy[(m + 1) % 12] : ((m + 1) >= 7 && (m + 1) <= 11);
  var showAnticipationFlags = currentIsBusy || nextIsBusy;

  var busyMonths = isBusy ? MONTH_LABELS.filter(function (_, i) { return isBusy[i]; }) : ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var calmMonths = isBusy ? MONTH_LABELS.filter(function (_, i) { return !isBusy[i]; }) : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

  var title = '', copy = '', badge = '', badgeClass = 'pending';
  if (currentIsBusy) {
    title = 'Busy season active — ' + MONTH_LABELS[m] + ' is a high-demand month';
    copy = 'The Seasonal Weighted Average model forecasts ' + (currentForecast || '6+') + ' bookings for ' + MONTH_LABELS[m]
      + ', classifying it as a busy month. Busy months in this model: ' + busyMonths.join(', ')
      + '. Maintain elevated equipment readiness, full staffing, and early resupply triggers.';
    badge = 'Busy Season';
    badgeClass = 'confirmed';
  } else if (nextIsBusy) {
    title = 'Approaching a busy month — prepare now';
    copy = MONTH_LABELS[m] + ' is a calm month (forecast: ' + (currentForecast || '3–4') + ' bookings), but ' + MONTH_LABELS[(m + 1) % 12]
      + ' enters the busy window. Use this runway for equipment readiness, roster alignment, and resupply review.';
    badge = 'Anticipation Mode';
    badgeClass = 'pending';
  } else {
    title = 'Calm season — ' + MONTH_LABELS[m] + ' is a low-demand month';
    copy = 'Forecast indicates ' + (currentForecast || '2–4') + ' bookings for ' + MONTH_LABELS[m]
      + '. Calm months this year: ' + calmMonths.join(', ')
      + '. Use this window for maintenance, staff training, and supplier negotiations.';
    badge = 'Calm Season';
    badgeClass = 'low';
  }
  return { showAnticipationFlags, title, copy, badge, badgeClass };
}



// ─── SEASON FORECAST BANNER ──────────────────────────────────────────────────
// Shown on the main dashboard to warn about the NEXT month's demand level
function renderSeasonForecastBanner() {
  var banner = document.getElementById('season-forecast-banner');
  if (!banner) return;

  // Same 7-year model as the forecasting dashboard
  var WEIGHTS = {
    2019: 0.04, 2020: 0.06, 2021: 0.09,
    2022: 0.12, 2023: 0.17, 2024: 0.22, 2025: 0.30
  };
  var HISTORICAL = {
    2019: [2, 2, 2, 2, 2, 3, 3, 5, 5, 6, 6, 5],
    2020: [1, 1, 0, 0, 0, 0, 1, 2, 2, 3, 3, 2],
    2021: [1, 2, 2, 2, 2, 3, 3, 5, 5, 6, 6, 5],
    2022: [2, 2, 3, 2, 2, 3, 3, 5, 5, 6, 6, 5],
    2023: [2, 3, 3, 2, 3, 3, 4, 6, 6, 7, 7, 6],
    2024: [3, 3, 3, 3, 3, 4, 4, 6, 7, 7, 8, 6],
    2025: [3, 3, 4, 3, 4, 4, 5, 7, 7, 8, 8, 7],
  };
  var YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
  var MONTH_LABELS = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
  var MONTH_SHORT  = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var BUSY_THRESHOLD = 5.5;

  // Compute forecast for every month
  var forecasts = MONTH_SHORT.map(function (_, mIdx) {
    var w = 0;
    YEARS.forEach(function (yr) { w += HISTORICAL[yr][mIdx] * WEIGHTS[yr]; });
    return Math.round(w * 10) / 10;
  });

  var now = new Date();
  var currentMonth = now.getMonth();             // 0-indexed
  var nextMonth    = (currentMonth + 1) % 12;
  var nextForecast = forecasts[nextMonth];
  var nextIsBusy   = nextForecast >= BUSY_THRESHOLD;
  var nextMonthName = MONTH_LABELS[nextMonth];

  if (nextIsBusy) {
    // ─── BUSY SEASON WARNING ──────────────────────────────────────────
    banner.innerHTML =
      '<div id="sfb-busy-panel" style="'
      + 'background: linear-gradient(135deg, rgba(185,28,28,0.92) 0%, rgba(127,29,29,0.88) 100%);'
      + 'border: 1.5px solid rgba(255,80,80,0.55);'
      + 'border-radius: 14px;'
      + 'padding: 20px 24px;'
      + 'display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;'
      + 'box-shadow: 0 4px 32px rgba(185,28,28,0.35);'
      + '">'
      + '<div style="display:flex;align-items:center;gap:16px;flex:1;min-width:260px;">'
      +   '<div style="font-size:38px;line-height:1;flex-shrink:0;"></div>'
      +   '<div>'
      +     '<div style="font-size:13px;color:rgba(255,200,200,0.8);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Demand Forecast · Seasonal Weighted Average (7yr)</div>'
      +     '<div style="font-size:17px;font-weight:800;color:#fff;margin-bottom:5px;">Entering Busy Season in ' + nextMonthName + '</div>'
      +     '<div style="font-size:12px;color:rgba(255,220,220,0.85);line-height:1.5;">'
      +       'Model forecasts <strong style="color:#ffd4d4;">' + nextForecast + ' bookings</strong> for ' + nextMonthName + ' — classified as a <strong style="color:#ffd4d4;">Busy Month</strong>. '
      +       'Ensure all equipment has passed routine checks and all staff are confirmed available before the surge begins.'
      +     '</div>'
      +   '</div>'
      + '</div>'
      + '<div style="display:flex;gap:10px;flex-shrink:0;flex-wrap:wrap;">'
      +   '<button onclick="showSection(\'routine-check\', document.getElementById(\'nav-routine-check\'))" style="'
      +     'background:rgba(255,255,255,0.15);border:1.5px solid rgba(255,255,255,0.4);color:#fff;'
      +     'padding:9px 18px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;'
      +     'display:flex;align-items:center;gap:7px;transition:background 0.2s;white-space:nowrap;'
      +     '" onmouseover="this.style.background=\'rgba(255,255,255,0.25)\'" onmouseout="this.style.background=\'rgba(255,255,255,0.15)\'">'
      +     ' Check Equipment'
      +   '</button>'
      +   '<button onclick="showSection(\'users\', document.getElementById(\'nav-users\'))" style="'
      +     'background:rgba(255,255,255,0.15);border:1.5px solid rgba(255,255,255,0.4);color:#fff;'
      +     'padding:9px 18px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;'
      +     'display:flex;align-items:center;gap:7px;transition:background 0.2s;white-space:nowrap;'
      +     '" onmouseover="this.style.background=\'rgba(255,255,255,0.25)\'" onmouseout="this.style.background=\'rgba(255,255,255,0.15)\'">'
      +     ' View Staff'
      +   '</button>'
      + '</div>'
      + '</div>';

  } else {
    // ─── CALM SEASON NOTICE ───────────────────────────────────────────
    banner.innerHTML =
      '<div id="sfb-calm-panel" style="'
      + 'background: rgba(45,138,78,0.10);'
      + 'border: 1px solid rgba(45,138,78,0.35);'
      + 'border-radius: 12px;'
      + 'padding: 14px 20px;'
      + 'display: flex; align-items: center; gap: 14px;'
      + '">'
      + '<div style="font-size:28px;line-height:1;flex-shrink:0;"></div>'
      + '<div style="flex:1;">'
      +   '<div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:3px;">Demand Forecast — Seasonal Weighted Average (7yr)</div>'
      +   '<div style="font-size:14px;font-weight:700;color:var(--cream);margin-bottom:3px;">'
      +     'Upcoming Calm Season: ' + nextMonthName
      +   '</div>'
      +   '<div style="font-size:12px;color:var(--text-dim);line-height:1.5;">'
      +     'Forecast: <strong style="color:var(--cream);">' + nextForecast + ' bookings</strong> in ' + nextMonthName + ' — minimal demand expected. '
      +     'Good window for maintenance, staff training, and supplier negotiations.'
      +   '</div>'
      + '</div>'
      + '<span class="badge low" style="font-size:10px;flex-shrink:0;align-self:center;">Calm Season</span>'
      + '</div>';
  }
}
window.renderSeasonForecastBanner = renderSeasonForecastBanner;

function renderForecastingDashboard() {

  // ─── MODEL: Seasonal Weighted Average Forecasting ───────────────────
  // Weights: 7-year baseline — recent years carry more influence
  // 2019=4%, 2020=6%, 2021=9%, 2022=12%, 2023=17%, 2024=22%, 2025=30%  → total 100%
  const WEIGHTS = {
    2019: 0.04, 2020: 0.06, 2021: 0.09,
    2022: 0.12, 2023: 0.17, 2024: 0.22, 2025: 0.30
  };

  // Placeholder historical bookings per month (Jan=0 … Dec=11)
  // ~1–3 in calm months, 5–9 in busy months; 2020 depressed by COVID
  const HISTORICAL = {
    2019: [2, 2, 2, 2, 2, 3, 3, 5, 5, 6, 6, 5],
    2020: [1, 1, 0, 0, 0, 0, 1, 2, 2, 3, 3, 2],  // COVID impact
    2021: [1, 2, 2, 2, 2, 3, 3, 5, 5, 6, 6, 5],
    2022: [2, 2, 3, 2, 2, 3, 3, 5, 5, 6, 6, 5],
    2023: [2, 3, 3, 2, 3, 3, 4, 6, 6, 7, 7, 6],
    2024: [3, 3, 3, 3, 3, 4, 4, 6, 7, 7, 8, 6],
    2025: [3, 3, 4, 3, 4, 4, 5, 7, 7, 8, 8, 7],
  };

  const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025];

  // Compute weighted forecast for each month
  const forecasts = MONTH_LABELS.map(function (_, mIdx) {
    var weighted = 0;
    YEARS.forEach(function (yr) {
      weighted += HISTORICAL[yr][mIdx] * WEIGHTS[yr];
    });
    return Math.round(weighted * 10) / 10; // 1 decimal
  });

  // Determine direction vs last year (2025)
  const directions = forecasts.map(function (fc, mIdx) {
    return fc - HISTORICAL[2025][mIdx];
  });

  // Season classification: months with forecast >= 5.5 are "busy"
  const BUSY_THRESHOLD = 5.5;
  const isBusy = forecasts.map(function (fc) { return fc >= BUSY_THRESHOLD; });

  // ─── SEASON BANNER ───────────────────────────────────────────────────
  const prof = getForecastSeasonProfile(forecasts, isBusy);
  const titleEl = document.getElementById('forecast-season-title');
  const copyEl = document.getElementById('forecast-season-copy');
  const badgeEl = document.getElementById('forecast-season-badge');
  const flagsWrap = document.getElementById('forecast-anticipation-flags');
  if (titleEl) titleEl.textContent = prof.title;
  if (copyEl) copyEl.textContent = prof.copy;
  if (badgeEl) {
    badgeEl.textContent = prof.badge;
    badgeEl.className = 'badge ' + prof.badgeClass;
    badgeEl.style.fontSize = '11px';
    badgeEl.style.alignSelf = 'center';
  }
  if (flagsWrap) flagsWrap.style.display = prof.showAnticipationFlags ? '' : 'none';

  // ─── STAT CARDS ──────────────────────────────────────────────────────
  var busyCount = isBusy.filter(Boolean).length;
  var calmCount = 12 - busyCount;
  var avgBusy = 0, avgCalm = 0, busyN = 0, calmN = 0;
  forecasts.forEach(function (fc, i) {
    if (isBusy[i]) { avgBusy += fc; busyN++; }
    else { avgCalm += fc; calmN++; }
  });
  if (busyN) avgBusy = Math.round((avgBusy / busyN) * 10) / 10;
  if (calmN) avgCalm = Math.round((avgCalm / calmN) * 10) / 10;
  var uplift = calmN && avgCalm ? (avgBusy / avgCalm).toFixed(1) + '×' : '—';
  var nextQtrTotal = forecasts.slice(0, 3).reduce(function (s, v) { return s + v; }, 0);

  var el = document.getElementById('fc-stat-confidence');
  if (el) el.textContent = '7 yrs';
  el = document.getElementById('fc-stat-confidence-sub');
  if (el) el.textContent = 'Seasonal Weighted Avg · 2019–2025 baseline (incl. COVID adj.)';

  el = document.getElementById('fc-stat-peak-share');
  if (el) el.textContent = busyCount + ' / 12 mo.';
  el = document.getElementById('fc-stat-peak-sub');
  if (el) el.textContent = 'Busy months ≥ ' + BUSY_THRESHOLD + ' bookings forecast';

  el = document.getElementById('fc-stat-n90');
  if (el) el.textContent = Math.round(nextQtrTotal);
  el = document.getElementById('fc-stat-n90-sub');
  if (el) el.textContent = 'Projected bookings next quarter (Jan–Mar 2026)';

  el = document.getElementById('fc-stat-uplift');
  if (el) el.textContent = uplift;
  el = document.getElementById('fc-stat-uplift-sub');
  if (el) el.textContent = 'Busy avg (' + avgBusy + ') ÷ Calm avg (' + avgCalm + ')';

  // ─── CHART 1: Monthly Weighted Forecast vs Last Year ─────────────────
  var ctxLine = document.getElementById('forecast-demand-chart');
  if (ctxLine) {
    if (window.forecastDemandChartInst) window.forecastDemandChartInst.destroy();
    window.forecastDemandChartInst = new Chart(ctxLine, {
      type: 'line',
      data: {
        labels: MONTH_LABELS,
        datasets: [
          {
            label: '2026 Weighted Forecast',
            data: forecasts,
            borderColor: '#c49a3c',
            backgroundColor: 'rgba(196,154,60,0.15)',
            fill: true,
            tension: 0.35,
            borderWidth: 2.5,
            pointBackgroundColor: forecasts.map(function (fc) { return fc >= BUSY_THRESHOLD ? '#c49a3c' : '#7c6fcd'; }),
            pointRadius: 5,
          },
          {
            label: '2025 Actual',
            data: HISTORICAL[2025],
            borderColor: 'rgba(255,255,255,0.25)',
            borderDash: [4, 4],
            fill: false,
            tension: 0.35,
            borderWidth: 1.5,
            pointRadius: 3,
            pointBackgroundColor: 'rgba(255,255,255,0.3)',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#a89070', font: { family: "'DM Sans',sans-serif", size: 11 } } },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                var dir = directions[ctx.dataIndex];
                if (ctx.datasetIndex === 0) {
                  var arrow = dir > 0 ? '▲' : (dir < 0 ? '▼' : '→');
                  return ' Forecast: ' + ctx.raw + ' bookings  ' + arrow + ' ' + (dir > 0 ? '+' : '') + dir.toFixed(1) + ' vs 2025';
                }
                return ' 2025 Actual: ' + ctx.raw + ' bookings';
              }
            }
          }
        },
        scales: {
          x: { ticks: { color: '#a89070' }, grid: { display: false } },
          y: {
            ticks: { color: '#a89070', stepSize: 1 },
            grid: { color: 'rgba(255,255,255,0.06)' },
            min: 0, max: 10,
            title: { display: true, text: 'Bookings / month', color: '#a89070', font: { size: 10 } }
          }
        }
      }
    });
  }

  // ─── CHART 2: Busy vs Calm Split (donut) ─────────────────────────────
  var ctxSplit = document.getElementById('forecast-season-split-chart');
  if (ctxSplit) {
    if (window.forecastSeasonSplitChartInst) window.forecastSeasonSplitChartInst.destroy();
    var busyTotal = 0, calmTotal = 0;
    forecasts.forEach(function (fc, i) { if (isBusy[i]) busyTotal += fc; else calmTotal += fc; });
    window.forecastSeasonSplitChartInst = new Chart(ctxSplit, {
      type: 'doughnut',
      data: {
        labels: ['Busy Months (' + busyCount + ')', 'Calm Months (' + calmCount + ')'],
        datasets: [{
          data: [Math.round(busyTotal * 10) / 10, Math.round(calmTotal * 10) / 10],
          backgroundColor: ['#c49a3c', '#7c6fcd'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { position: 'bottom', labels: { color: '#a89070', font: { family: "'DM Sans',sans-serif", size: 11 } } },
          tooltip: { callbacks: { label: function (c) { return ' ' + c.raw + ' total projected bookings'; } } }
        }
      }
    });
  }

  // ─── CHART 3: Year-over-Year Comparison (grouped bar) ────────────────
  var ctxWeekly = document.getElementById('forecast-weekly-pace-chart');
  if (ctxWeekly) {
    if (window.forecastWeeklyPaceChartInst) window.forecastWeeklyPaceChartInst.destroy();
    window.forecastWeeklyPaceChartInst = new Chart(ctxWeekly, {
      type: 'bar',
      data: {
        labels: MONTH_LABELS,
        datasets: YEARS.map(function (yr, yIdx) {
          var colors = ['rgba(100,100,200,0.45)', 'rgba(100,160,200,0.55)', 'rgba(150,180,80,0.65)', 'rgba(196,154,60,0.85)'];
          return {
            label: String(yr),
            data: HISTORICAL[yr],
            backgroundColor: colors[yIdx],
            borderRadius: 3,
          };
        })
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#a89070', font: { family: "'DM Sans',sans-serif", size: 11 } } },
          tooltip: { callbacks: { label: function (c) { return ' ' + c.dataset.label + ': ' + c.raw + ' bookings'; } } }
        },
        scales: {
          x: { ticks: { color: '#a89070' }, grid: { display: false } },
          y: { ticks: { color: '#a89070', stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.06)' }, min: 0, max: 10 }
        }
      }
    });
  }

  // ─── CHART 4: Weight Distribution Bar ────────────────────────────────
  var ctxLead = document.getElementById('forecast-leadtime-chart');
  if (ctxLead) {
    if (window.forecastLeadtimeChartInst) window.forecastLeadtimeChartInst.destroy();
    window.forecastLeadtimeChartInst = new Chart(ctxLead, {
      type: 'bar',
      data: {
        labels: YEARS.map(String),
        datasets: [{
          label: 'Model Weight',
          data: YEARS.map(function (yr) { return WEIGHTS[yr] * 100; }),
          backgroundColor: ['rgba(100,100,200,0.5)', 'rgba(100,160,200,0.65)', 'rgba(150,180,80,0.75)', 'rgba(196,154,60,0.9)'],
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return ' Weight: ' + c.raw + '%'; } } }
        },
        scales: {
          x: { ticks: { color: '#a89070' }, grid: { display: false } },
          y: {
            ticks: { color: '#a89070', callback: function (v) { return v + '%'; } },
            grid: { color: 'rgba(255,255,255,0.06)' },
            max: 50,
            title: { display: true, text: 'Model weight (%)', color: '#a89070', font: { size: 10 } }
          }
        }
      }
    });
  }

  // ─── TABLE: Monthly Projections ───────────────────────────────────────
  var tbody = document.getElementById('forecast-monthly-table-body');
  if (tbody) {
    tbody.innerHTML = forecasts.map(function (fc, i) {
      var dir = directions[i];
      var arrow = dir > 0 ? '▲' : (dir < 0 ? '▼' : '→');
      var arrowColor = dir > 0 ? 'var(--green)' : (dir < 0 ? 'var(--red)' : 'var(--text-dim)');
      var busy = isBusy[i];
      var risk = fc >= 7 ? 'High' : (fc >= 5.5 ? 'Medium' : 'Low');
      var riskColor = risk === 'High' ? 'var(--red)' : (risk === 'Medium' ? 'var(--amber)' : 'var(--green)');
      var note = busy ? 'Busy season window · elevated demand' : 'Calm season · steady pacing';
      return '<tr style="' + (busy ? 'background:rgba(196,154,60,0.06);' : '') + '">'
        + '<td><strong>' + MONTH_LABELS[i] + ' 2026</strong>' + (busy ? ' <span class="badge confirmed" style="font-size:9px;">Busy</span>' : '') + '</td>'
        + '<td style="font-weight:800;color:var(--gold);">' + fc + '</td>'
        + '<td><span style="color:' + arrowColor + ';font-weight:700;">' + arrow + ' ' + (dir > 0 ? '+' : '') + dir.toFixed(1) + '</span> vs 2025</td>'
        + '<td>' + HISTORICAL[2025][i] + '</td>'
        + '<td style="font-weight:700;color:' + riskColor + ';">' + risk + '</td>'
        + '<td style="font-size:11px;color:var(--text-dim);">' + note + '</td>'
        + '</tr>';
    }).join('');
  }

  // ─── NARRATIVE ───────────────────────────────────────────────────────
  var narr = document.getElementById('forecast-narrative-block');
  if (narr) {
    var busyMonthNames = MONTH_LABELS.filter(function (_, i) { return isBusy[i]; }).join(', ');
    var calmMonthNames = MONTH_LABELS.filter(function (_, i) { return !isBusy[i]; }).join(', ');
    narr.innerHTML = '<p style="margin-bottom:12px;"><strong>Model: Seasonal Weighted Average Forecasting</strong><br>'
      + 'This model forecasts each month by looking at the same month across 4 years of history (2022–2025), '
      + 'applying decreasing weights to older data: 2022 → 10%, 2023 → 20%, 2024 → 30%, 2025 → 40%. '
      + 'Weather, holidays, and seasonal effects are captured <em>indirectly</em> through historical patterns — no explicit modeling needed.</p>'
      + '<ul style="margin:0;padding-left:18px;">'
      + '<li style="margin-bottom:6px;"><strong>Busy months (forecast ≥ ' + BUSY_THRESHOLD + '):</strong> ' + busyMonthNames + ' — expect 6–8 bookings. Prioritize equipment readiness, full roster cover, and early resupply triggers.</li>'
      + '<li style="margin-bottom:6px;"><strong>Calm months:</strong> ' + calmMonthNames + ' — expect 2–4 bookings. Ideal window for routine maintenance, staff training, and equipment deep-cleaning.</li>'
      + '<li style="margin-bottom:6px;"><strong>Direction signal:</strong> Months marked ▲ (forecast above 2025 actual) suggest growing demand — plan buffer capacity. Months marked ▼ suggest softening.</li>'
      + '<li style="margin-bottom:6px;"><strong>Model integrity:</strong> As more yearly data accumulates, older years will receive lower weights and newer patterns dominate — the model self-corrects over time.</li>'
      + '<li><strong>Disclaimer:</strong> All figures are based on placeholder historical data. Replace with live Firestore booking records for production-grade forecasts.</li>'
      + '</ul>';
  }
}



function renderInsights() {
  const topItems = [
    { name: 'Chicken Dish', count: 38 },
    { name: 'Steamed Rice', count: 36 },
    { name: 'Unlimited Drinks', count: 34 },
    { name: 'Pork Dish', count: 28 },
    { name: 'Pasta', count: 22 },
  ];
  const ctxTop = document.getElementById('top-items-chart');
  if (ctxTop) {
    if (window.topItemsChartInst) window.topItemsChartInst.destroy();
    window.topItemsChartInst = new Chart(ctxTop, {
      type: 'bar',
      data: {
        labels: topItems.map(i => i.name),
        datasets: [{ data: topItems.map(i => i.count), backgroundColor: '#c49a3c', borderRadius: 4 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: 'y',
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ctx.raw + ' orders' } } },
        scales: { x: { display: false }, y: { grid: { display: false }, ticks: { color: '#a89070', font: { family: "'DM Sans',sans-serif" } } } }
      }
    });
  }
  const types = [
    { name: 'Birthday Party', pct: 38, color: '#c49a3c' },
    { name: 'Wedding', pct: 28, color: '#7c6fcd' },
    { name: 'Corporate', pct: 20, color: '#2d8a4e' },
    { name: 'Family Gathering', pct: 14, color: '#d97706' },
  ];
  const ctxTypes = document.getElementById('event-types-chart');
  if (ctxTypes) {
    if (window.eventTypesChartInst) window.eventTypesChartInst.destroy();
    window.eventTypesChartInst = new Chart(ctxTypes, {
      type: 'doughnut',
      data: {
        labels: types.map(t => t.name),
        datasets: [{ data: types.map(t => t.pct), backgroundColor: types.map(t => t.color), borderWidth: 0 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { color: '#e8dcc8', font: { family: "'DM Sans',sans-serif", size: 12 } } },
          tooltip: { callbacks: { label: (ctx) => ' ' + ctx.raw + '%' } }
        },
        cutout: '70%'
      }
    });
  }
  if (insightsActivePane === 'forecast') renderForecastingDashboard();
}

// ===== INIT =====
function waitForFirebase(attempts = 0) {
  if (window.firebaseFns && window.firebaseDB) {
    loadData();
    initAdminChat();
  } else if (attempts < 20) {
    setTimeout(() => waitForFirebase(attempts + 1), 150);
  } else {
    console.error('Firebase did not initialize in time.');
    renderInsights();
    renderSeasonForecastBanner();
    renderEIMStats();
    renderEIMTable();
    renderRentalCards();
  }
}
waitForFirebase();

// ====================================================================
// ==================== EQUIPMENT INVENTORY MANAGEMENT ================
// ====================================================================

// ----- MASTER ASSET DATA -----
// Structure is Firebase-ready: each object maps directly to a Firestore document.
// Fields: id (doc ID), name, category, type, quantity, unitType,
//         condition, status, unitCost, supplier, sourceLocation,
//         trackingMode ('individual'|'batch'), batchTrackingId, notes, addedDate

const EIM_ASSETS = [
  // ── FURNITURE ──────────────────────────────────────────────────────
  {
    id: 'EQ-F001', name: 'Round Banquet Table 5ft', category: 'Furniture', type: 'Table',
    quantity: 20, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 3500, supplier: 'Manila Event Supply Co.', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: '5ft diameter; seats 8–10 guests. Powder-coated foldable steel legs. Water-resistant plywood top.',
    addedDate: '2024-01-15'
  },
  {
    id: 'EQ-F002', name: 'Rectangular Banquet Table 6ft', category: 'Furniture', type: 'Table',
    quantity: 10, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 2800, supplier: 'Manila Event Supply Co.', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: '6ft × 2.5ft; seats 6–8. Primarily used for buffet lines and serving stations.',
    addedDate: '2024-01-15'
  },
  {
    id: 'EQ-F003', name: 'Tiffany Crossback Chair (White)', category: 'Furniture', type: 'Chair',
    quantity: 150, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 450, supplier: 'PhilChair Manufacturing', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-CHR-001',
    notes: 'White resin event chairs. UV-resistant. Events typically use 100–150 pcs. Clean with damp cloth.',
    addedDate: '2024-02-01'
  },
  {
    id: 'EQ-F004', name: 'Monoblock Chair (White)', category: 'Furniture', type: 'Chair',
    quantity: 80, unitType: 'pcs', condition: 'Fair', status: 'Active',
    unitCost: 180, supplier: null, sourceLocation: 'Divisoria Market, Manila',
    trackingMode: 'batch', batchTrackingId: 'BATCH-CHR-002',
    notes: 'Standard white plastic monoblock. Used for staff, overflow, and outdoor setups.',
    addedDate: '2023-06-10'
  },
  {
    id: 'EQ-F005', name: 'Cocktail High Table (Bar Height)', category: 'Furniture', type: 'Table',
    quantity: 8, unitType: 'pcs', condition: 'Excellent', status: 'Active',
    unitCost: 2200, supplier: 'Manila Event Supply Co.', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: 'Bar-height cocktail tables; 36" diameter top. Ideal for cocktail hour reception areas.',
    addedDate: '2024-03-20'
  },
  {
    id: 'EQ-F006', name: 'Banquet Server Trolley 3-Tier', category: 'Furniture', type: 'Trolley',
    quantity: 4, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 4800, supplier: 'CateringPro PH', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: 'Stainless steel 3-tier service trolley with rubber wheels. For transporting food and tableware.',
    addedDate: '2024-04-05'
  },
  {
    id: 'EQ-F007', name: 'Folding Service Table 4ft', category: 'Furniture', type: 'Service Table',
    quantity: 6, unitType: 'pcs', condition: 'Fair', status: 'Active',
    unitCost: 1200, supplier: null, sourceLocation: 'Divisoria Market, Manila',
    trackingMode: 'individual', batchTrackingId: null,
    notes: 'Lightweight folding tables for bar stations, carving stations, and cake tables.',
    addedDate: '2023-08-20'
  },

  // ── TABLEWARE ──────────────────────────────────────────────────────
  {
    id: 'EQ-T001', name: 'Dinner Plate 10.5" (White Porcelain)', category: 'Tableware', type: 'Plate',
    quantity: 350, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 180, supplier: 'Royal Porcelain PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-PLT-001',
    notes: 'White porcelain dinner plates; dishwasher-safe. Standard for all events. Replace broken units quarterly.',
    addedDate: '2024-01-20'
  },
  {
    id: 'EQ-T002', name: 'Salad / Dessert Plate 7"', category: 'Tableware', type: 'Plate',
    quantity: 300, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 120, supplier: 'Royal Porcelain PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-PLT-002',
    notes: 'White porcelain side plates for salad course and dessert service.',
    addedDate: '2024-01-20'
  },
  {
    id: 'EQ-T003', name: 'Soup Bowl 16oz with Underplate', category: 'Tableware', type: 'Bowl',
    quantity: 200, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 95, supplier: 'Royal Porcelain PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-BWL-001',
    notes: 'Porcelain soup bowls sold with matching underplate. Handle with care — chips easily.',
    addedDate: '2024-01-20'
  },
  {
    id: 'EQ-T004', name: 'Dinner Fork 18/10 Stainless', category: 'Tableware', type: 'Cutlery',
    quantity: 400, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 45, supplier: 'KitchenAid Supply PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-CTL-001',
    notes: '18/10 stainless steel heavyweight dinner forks. Polished mirror finish.',
    addedDate: '2024-02-10'
  },
  {
    id: 'EQ-T005', name: 'Dinner Knife 18/10 Stainless', category: 'Tableware', type: 'Cutlery',
    quantity: 400, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 55, supplier: 'KitchenAid Supply PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-CTL-002',
    notes: '18/10 stainless steel dinner knives with serrated edge.',
    addedDate: '2024-02-10'
  },
  {
    id: 'EQ-T006', name: 'Dinner Spoon / Tablespoon 18/10', category: 'Tableware', type: 'Cutlery',
    quantity: 400, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 40, supplier: 'KitchenAid Supply PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-CTL-003',
    notes: '18/10 stainless steel. Used for main course and dessert.',
    addedDate: '2024-02-10'
  },
  {
    id: 'EQ-T007', name: 'Soup Spoon (Round Bowl) 18/10', category: 'Tableware', type: 'Cutlery',
    quantity: 250, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 38, supplier: 'KitchenAid Supply PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-CTL-004',
    notes: 'Round-bowl stainless steel soup spoon for soup course plating.',
    addedDate: '2024-02-10'
  },
  {
    id: 'EQ-T008', name: 'Teaspoon 18/10 Stainless', category: 'Tableware', type: 'Cutlery',
    quantity: 300, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 32, supplier: 'KitchenAid Supply PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-CTL-005',
    notes: 'For coffee/tea service and dessert accompaniments.',
    addedDate: '2024-02-10'
  },
  {
    id: 'EQ-T009', name: 'Serving Platter Oval 18" Stainless', category: 'Tableware', type: 'Serving Ware',
    quantity: 30, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 280, supplier: 'CateringPro PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-SRV-001',
    notes: 'Oval stainless steel serving platters for buffet and family-style service.',
    addedDate: '2024-02-15'
  },
  {
    id: 'EQ-T010', name: 'Serving Tong 12" Stainless', category: 'Tableware', type: 'Serving Ware',
    quantity: 40, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 85, supplier: 'CateringPro PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-SRV-002',
    notes: 'Stainless steel serving tongs with silicone-coated tips for non-stick use.',
    addedDate: '2024-02-15'
  },
  {
    id: 'EQ-T011', name: 'Bread Basket (Natural Wicker)', category: 'Tableware', type: 'Basket',
    quantity: 30, unitType: 'pcs', condition: 'Fair', status: 'Active',
    unitCost: 120, supplier: null, sourceLocation: 'Quiapo Market, Manila',
    trackingMode: 'batch', batchTrackingId: 'BATCH-BSK-001',
    notes: 'Natural rattan wicker baskets with white linen liner. For bread rolls at table.',
    addedDate: '2023-09-01'
  },
  {
    id: 'EQ-T012', name: 'Sauce / Gravy Ladle Stainless', category: 'Tableware', type: 'Serving Ware',
    quantity: 25, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 65, supplier: 'CateringPro PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-SRV-003',
    notes: '4oz stainless ladles for sauces, gravies, and soups at buffet line.',
    addedDate: '2024-02-15'
  },

  // ── GLASSWARE ──────────────────────────────────────────────────────
  {
    id: 'EQ-G001', name: 'Water Goblet 14oz (Crystal-Clear)', category: 'Glassware', type: 'Glass',
    quantity: 350, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 75, supplier: 'GlassCraft PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-GLS-001',
    notes: 'Crystal-clear stemmed water goblet. Standard for all seated events.',
    addedDate: '2024-01-25'
  },
  {
    id: 'EQ-G002', name: 'Red Wine Glass 15oz (Tulip)', category: 'Glassware', type: 'Glass',
    quantity: 200, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 95, supplier: 'GlassCraft PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-GLS-002',
    notes: 'Large-bowl tulip wine glasses for red wine service.',
    addedDate: '2024-01-25'
  },
  {
    id: 'EQ-G003', name: 'Champagne Flute 7oz', category: 'Glassware', type: 'Glass',
    quantity: 150, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 90, supplier: 'GlassCraft PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-GLS-003',
    notes: 'Classic tall champagne flutes. Used for toasting ceremonies and welcome drinks.',
    addedDate: '2024-01-25'
  },
  {
    id: 'EQ-G004', name: 'Juice / Rocks Glass 10oz', category: 'Glassware', type: 'Glass',
    quantity: 200, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 60, supplier: 'GlassCraft PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-GLS-004',
    notes: 'Multipurpose rocks glass for juice, iced tea, and mocktails.',
    addedDate: '2024-01-25'
  },
  {
    id: 'EQ-G005', name: 'Shot / Cordial Glass 2oz', category: 'Glassware', type: 'Glass',
    quantity: 100, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 45, supplier: 'GlassCraft PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-GLS-005',
    notes: 'Small cordial glasses for liqueur service and amuse-bouche presentations.',
    addedDate: '2024-01-25'
  },

  // ── LINENS ─────────────────────────────────────────────────────────
  {
    id: 'EQ-L001', name: 'Round Tablecloth 120" — White', category: 'Linens', type: 'Tablecloth',
    quantity: 40, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 480, supplier: 'LiXia Textile Supply', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-LNN-001',
    notes: 'Full drop round tablecloth for 5ft tables. Dry-clean only. Pressed before each event.',
    addedDate: '2024-02-20'
  },
  {
    id: 'EQ-L002', name: 'Round Tablecloth 120" — Ivory/Cream', category: 'Linens', type: 'Tablecloth',
    quantity: 40, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 480, supplier: 'LiXia Textile Supply', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-LNN-002',
    notes: 'Ivory cream tablecloth. Popular for weddings and corporate events.',
    addedDate: '2024-02-20'
  },
  {
    id: 'EQ-L003', name: 'Rectangular Tablecloth 90"×132" — White', category: 'Linens', type: 'Tablecloth',
    quantity: 30, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 380, supplier: 'LiXia Textile Supply', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-LNN-003',
    notes: 'For 6ft rectangular banquet tables. Overlaps 18" on each side.',
    addedDate: '2024-02-20'
  },
  {
    id: 'EQ-L004', name: 'Cloth Napkin 20"×20" — White Linen', category: 'Linens', type: 'Napkin',
    quantity: 500, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 45, supplier: 'LiXia Textile Supply', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-LNN-004',
    notes: 'White linen napkins. Laundered and pressed after every event. Check for stains before each use.',
    addedDate: '2024-02-20'
  },
  {
    id: 'EQ-L005', name: 'Chair Sash / Ribbon — Satin Gold', category: 'Linens', type: 'Chair Sash',
    quantity: 200, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 35, supplier: 'LiXia Textile Supply', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-LNN-005',
    notes: 'Satin gold chair sashes for Tiffany crossback chairs. Tied in bow or knot.',
    addedDate: '2024-03-01'
  },
  {
    id: 'EQ-L006', name: 'Chair Sash / Ribbon — Ivory White', category: 'Linens', type: 'Chair Sash',
    quantity: 150, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 35, supplier: 'LiXia Textile Supply', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-LNN-006',
    notes: 'White organza chair sashes for classic and minimalist wedding themes.',
    addedDate: '2024-03-01'
  },
  {
    id: 'EQ-L007', name: 'Table Runner 12"×108" — Satin Gold', category: 'Linens', type: 'Table Runner',
    quantity: 50, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 180, supplier: 'LiXia Textile Supply', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-LNN-007',
    notes: 'Satin gold runners for 5ft round and 6ft rect tables.',
    addedDate: '2024-03-01'
  },
  {
    id: 'EQ-L008', name: 'Buffet Skirt 17ft — Royal Blue Polyester', category: 'Linens', type: 'Buffet Skirt',
    quantity: 10, unitType: 'pcs', condition: 'Fair', status: 'Active',
    unitCost: 650, supplier: null, sourceLocation: 'SM Fabric Center, Manila',
    trackingMode: 'batch', batchTrackingId: 'BATCH-LNN-008',
    notes: 'Clip-on fitted table skirts for buffet tables. Covers full-drop on 6ft rect tables.',
    addedDate: '2023-07-15'
  },

  // ── CATERING EQUIPMENT ─────────────────────────────────────────────
  {
    id: 'EQ-C001', name: 'Chafing Dish Full-Size 8qt (Stainless)', category: 'Catering Equipment', type: 'Chafing Dish',
    quantity: 15, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 1800, supplier: 'CateringPro PH', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: 'Full-size roll-top stainless chafing dish. Comes with water pan, food pan, lid, and fuel holder. Uses 2 Sterno cans per event.',
    addedDate: '2024-01-10'
  },
  {
    id: 'EQ-C002', name: 'Beverage Dispenser 3-Gallon (Glass)', category: 'Catering Equipment', type: 'Dispenser',
    quantity: 8, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 2500, supplier: 'CateringPro PH', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: 'Glass beverage dispenser on wooden frame stand with ice chamber. For juice, iced tea, and infused water.',
    addedDate: '2024-01-10'
  },
  {
    id: 'EQ-C003', name: 'Portable Buffet Line 6-Station Set', category: 'Catering Equipment', type: 'Buffet Setup',
    quantity: 2, unitType: 'sets', condition: 'Good', status: 'Active',
    unitCost: 15000, supplier: 'CateringPro PH', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: 'Complete modular buffet line: 6 chafing dish stations, sneeze guards, sign holders, and LED-lit base frame.',
    addedDate: '2024-01-10'
  },
  {
    id: 'EQ-C004', name: 'Ice Bucket 4L Stainless with Tong', category: 'Catering Equipment', type: 'Ice Bucket',
    quantity: 20, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 280, supplier: 'CateringPro PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-ICE-001',
    notes: '4-liter double-walled stainless ice buckets with matching stainless tong.',
    addedDate: '2024-02-05'
  },
  {
    id: 'EQ-C005', name: 'Coffee Urn 30-Cup Electric', category: 'Catering Equipment', type: 'Beverage Equipment',
    quantity: 4, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 3200, supplier: 'Kingsmart Appliances', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: 'Stainless 30-cup electric percolator urn. Used for AM receptions, corporate breakfasts. 120V.',
    addedDate: '2024-03-10'
  },
  {
    id: 'EQ-C006', name: 'Sterno / Fuel Can (Case of 24)', category: 'Catering Equipment', type: 'Consumable',
    quantity: 12, unitType: 'pcs', condition: 'Excellent', status: 'Active',
    unitCost: 380, supplier: 'CateringPro PH', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-FUEL-001',
    notes: '2-hour methanol gel fuel cans. Each chafing dish uses 2 per event. Replenish after each event.',
    addedDate: '2024-04-01'
  },
  {
    id: 'EQ-C007', name: 'Carving Station Board (Maple 24"×16")', category: 'Catering Equipment', type: 'Serving Ware',
    quantity: 3, unitType: 'pcs', condition: 'Excellent', status: 'Active',
    unitCost: 1500, supplier: 'Restaurant Depot PH', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: 'Thick maple wood carving boards with juice groove. For roast and lechon carving stations.',
    addedDate: '2024-03-25'
  },

  // ── AV & LIGHTING ──────────────────────────────────────────────────
  {
    id: 'EQ-A001', name: 'LED Uplight RGB (Battery)', category: 'AV & Lighting', type: 'Lighting',
    quantity: 20, unitType: 'pcs', condition: 'Excellent', status: 'Active',
    unitCost: 3200, supplier: 'EventTech Philippines', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: 'Battery-powered RGB LED uplights. 8-hour battery life. App-controlled via Bluetooth. Typically deployed in groups of 8–12.',
    addedDate: '2024-04-01'
  },
  {
    id: 'EQ-A002', name: 'Powered Speaker 10" (JBL EON710)', category: 'AV & Lighting', type: 'Audio',
    quantity: 4, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 8500, supplier: 'EventTech Philippines', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: 'JBL EON710 10" active loudspeakers. 650W peak. Bluetooth + XLR input. Used for ceremonies and cocktail receptions.',
    addedDate: '2024-02-28'
  },
  {
    id: 'EQ-A003', name: 'Wireless Microphone Set (2-Channel)', category: 'AV & Lighting', type: 'Audio',
    quantity: 2, unitType: 'sets', condition: 'Good', status: 'Active',
    unitCost: 6500, supplier: 'EventTech Philippines', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: '2-channel wireless system: 1 handheld + 1 lapel transmitter. 100m range. UHF band.',
    addedDate: '2024-02-28'
  },
  {
    id: 'EQ-A004', name: 'Photo Booth Setup (Complete)', category: 'AV & Lighting', type: 'Event Prop',
    quantity: 1, unitType: 'set', condition: 'Good', status: 'Active',
    unitCost: 25000, supplier: 'EventTech Philippines', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: 'Complete photo booth: adjustable ring light (18"), 8ft backdrop stand, printed prop basket. Add-on service.',
    addedDate: '2024-03-15'
  },
  {
    id: 'EQ-A005', name: 'Table Number Holder Set (1–30)', category: 'AV & Lighting', type: 'Table Decor',
    quantity: 3, unitType: 'sets', condition: 'Good', status: 'Active',
    unitCost: 1800, supplier: 'Manila Event Supply Co.', sourceLocation: null,
    trackingMode: 'individual', batchTrackingId: null,
    notes: 'Acrylic gold-framed table number holders, numbers 1–30 per set. Matching gold base.',
    addedDate: '2024-03-18'
  },
  // ── DESIGN ─────────────────────────────────────────────────────────
  {
    id: 'EQ-D001', name: 'White Table Cloth (Round 5ft)', category: 'Design', type: 'Cloth',
    quantity: 20, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 150, supplier: 'Manila Event Supply Co.', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-DSG-001',
    notes: 'Standard white round cloths.',
    addedDate: '2024-05-01'
  },
  {
    id: 'EQ-D002', name: 'Princess Cutout Prop (Large)', category: 'Design', type: 'Prop',
    quantity: 3, unitType: 'pcs', condition: 'Good', status: 'Active',
    unitCost: 500, supplier: 'Custom Props', sourceLocation: null,
    trackingMode: 'batch', batchTrackingId: 'BATCH-DSG-002',
    notes: 'Kiddie party props.',
    addedDate: '2024-05-01'
  }
];

// Initialize Batches dynamically for existing objects
EIM_ASSETS.forEach(a => {
  if (a.name.toLowerCase().includes('photo booth')) {
    a.trackingMode = 'individual';
  } else {
    a.trackingMode = 'batch';
    if (!a.batchTrackingId) {
      const pfx = a.category.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
      a.batchTrackingId = `BAT-${pfx || 'EQ'}-${a.id.substring(3)}`;
    }
  }

  // Cap quantity at 100 maximum
  if (a.quantity > 100) a.quantity = 100;

  if (a.trackingMode === 'batch' && (!a.items || a.items.length === 0)) {
    a.items = [];
    for (let i = 0; i < a.quantity; i++) {
      const itemCond = Array.isArray(a.condition) ? a.condition[i] : a.condition;
      a.items.push({
        subId: `${a.id}-${String(i + 1).padStart(2, '0')}`,
        condition: itemCond || 'Good',
        status: a.status || 'Active'
      });
    }
  }
});

// ----- RENTAL DATA -----
// Fields: id, name, type, quantity, unitType, condition, status,
//         initialPrice, supplier, arrivalDate, deploymentDate, returnDate,
//         linkedEvent, notes

const RENTED_EQUIPMENT = [
  {
    id: 'RNT-001',
    name: 'Crystal Chandelier Drop Pendant',
    type: 'Lighting / Decor',
    quantity: 3, unitType: 'pcs',
    condition: 'Excellent', status: 'Deployed',
    initialPrice: 8500, supplier: 'Lumina Events Rental',
    arrivalDate: '2026-04-10', deploymentDate: '2026-04-12', returnDate: '2026-04-14',
    linkedEvent: 'Reyes Wedding — April 12',
    notes: 'Crystal chandeliers for ceiling installation. Requires professional rigging. Handle with extreme care. Return in original foam cases.'
  },
  {
    id: 'RNT-002',
    name: 'Gold Chiavari Chairs',
    type: 'Furniture',
    quantity: 80, unitType: 'pcs',
    condition: 'Good', status: 'Returned',
    initialPrice: 12000, supplier: 'PremiChair Rentals PH',
    arrivalDate: '2026-04-02', deploymentDate: '2026-04-05', returnDate: '2026-04-06',
    linkedEvent: 'Santos Birthday Gala — April 5',
    notes: 'Premium gold resin Chiavari chairs with cushioned seat pads. All 80 pcs returned in good condition.'
  },
  {
    id: 'RNT-003',
    name: 'Floral Arch Frame (8ft×8ft)',
    type: 'Decor Structure',
    quantity: 1, unitType: 'pcs',
    condition: 'Good', status: 'Deployed',
    initialPrice: 3500, supplier: 'Bloom & Event Co.',
    arrivalDate: '2026-04-11', deploymentDate: '2026-04-12', returnDate: '2026-04-13',
    linkedEvent: 'Reyes Wedding — April 12',
    notes: 'Geometric gold metal arch frame for ceremony backdrop. 8ft × 8ft. Dismantles into 4 sections. Return with all bolts and caps.'
  },
  {
    id: 'RNT-004',
    name: 'Neon Sign "Mr & Mrs" (LED)',
    type: 'Decor / Lighting',
    quantity: 1, unitType: 'pcs',
    condition: 'Excellent', status: 'Awaiting',
    initialPrice: 2800, supplier: 'GlowSign PH Rentals',
    arrivalDate: '2026-04-18', deploymentDate: '2026-04-19', returnDate: '2026-04-20',
    linkedEvent: 'Dela Cruz Wedding — April 19',
    notes: 'Custom warm-white LED neon "Mr & Mrs" sign on acrylic backing. Comes with wall-mount and tabletop stand.'
  },
  {
    id: 'RNT-005',
    name: 'Chocolate Fountain Machine (4-Tier)',
    type: 'Dessert Equipment',
    quantity: 1, unitType: 'pcs',
    condition: 'Good', status: 'In Transit',
    initialPrice: 4500, supplier: 'SweetFlow Rentals',
    arrivalDate: '2026-04-14', deploymentDate: '2026-04-15', returnDate: '2026-04-16',
    linkedEvent: 'Villanueva Kiddie Party — April 15',
    notes: '4-tier stainless chocolate fountain (requires 5kg dark compound chocolate — not included). Clean before return.'
  },
  {
    id: 'RNT-006',
    name: 'Stage Platform 4ft×8ft Sections',
    type: 'Stage / Riser',
    quantity: 6, unitType: 'pcs',
    condition: 'Good', status: 'Returned',
    initialPrice: 9000, supplier: 'ProStage Equipment PH',
    arrivalDate: '2026-03-28', deploymentDate: '2026-03-30', returnDate: '2026-03-31',
    linkedEvent: 'Cruz Corporate Event — March 30',
    notes: 'Modular stage platforms 4ft×8ft each. 6 sections assemble into 8ft×12ft raised platform. All sections returned on time.'
  },
  {
    id: 'RNT-007',
    name: 'Overhead Canopy / Stretch Tent 10m×15m',
    type: 'Tent / Marquee',
    quantity: 1, unitType: 'pcs',
    condition: 'Excellent', status: 'Awaiting',
    initialPrice: 18000, supplier: 'AlphaTents PH',
    arrivalDate: '2026-04-20', deploymentDate: '2026-04-21', returnDate: '2026-04-23',
    linkedEvent: 'Mendoza Garden Wedding — April 21',
    notes: 'White stretch canopy tent, 10m × 15m. Covers up to 150 pax outdoor. Requires 6 anchor points on the ground. Permit may be required from venue.'
  },
];
window.RENTED_EQUIPMENT = RENTED_EQUIPMENT;
window.rentalOrders = window.rentalOrders || [];

function ensureRentalSuppliers() {
  EIM_ASSETS.forEach(function (a) {
    if (!a.rentalSupplier || !String(a.rentalSupplier).trim()) {
      a.rentalSupplier = a.supplier || 'General Rental Partner';
    }
  });
}
ensureRentalSuppliers();

// ===== EIM Active Category Filter =====
let eimCurrentCat = 'All';

// ===== RENDER EIM STATS =====
function renderEIMStats() {
  const total = EIM_ASSETS.length;
  const active = EIM_ASSETS.filter(a => a.status === 'Active').length;
  const repair = EIM_ASSETS.filter(a => a.status === 'Under Repair').length;
  const value = EIM_ASSETS.reduce((sum, a) => sum + (a.unitCost * a.quantity), 0);

  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('eim-stat-total', total);
  set('eim-stat-active', active);
  set('eim-stat-repair', repair);
  set('eim-stat-value', '₱' + value.toLocaleString());
}

// ===== QR CODE HELPER FUNCTIONS =====
function shouldHaveIndividualQR(category) {
  const individualQRCategories = ['Furniture', 'AV & Lighting', 'Catering Equipment'];
  return individualQRCategories.includes(category);
}

// Store current QR data globally
let currentQRData = null;

function showEquipmentQR(assetId, subId) {
  const a = EIM_ASSETS.find(x => x.id === assetId);
  if (!a) { alert('Equipment not found.'); return; }

  const isIndividual = !!subId;
  const displayId = subId || assetId;

  // Slim payload — just the unique ID
  const payload = `HALDENS-EQ:${displayId}`;

  const title = isIndividual ? 'Individual Equipment QR Code' : 'Batch Equipment QR Code';
  const subtitle = isIndividual ? 'Scan to identify this individual unit' : 'Scan to identify this equipment batch';

  document.getElementById('qrModalTitle').textContent = title;
  document.getElementById('qrModalSubtitle').textContent = subtitle;
  document.getElementById('qrLabelId').textContent = displayId;
  document.getElementById('qrLabelName').textContent = a.name + (isIndividual ? ' — Individual Unit' : ' — Batch');

  const rows = isIndividual ? [
    ['Asset ID', displayId, true],
    ['Batch ID', assetId, false],
    ['Equipment', a.name, false],
    ['Category', a.category, false],
    ['Type', a.type, false],
    ['Tracking Mode', 'Individual', false]
  ] : [
    ['Batch ID', assetId, true],
    ['Equipment', a.name, false],
    ['Category', a.category, false],
    ['Type', a.type, false],
    ['Tracking Mode', 'Batch', false]
  ];

  document.getElementById('qrModalMeta').innerHTML = rows.map(([k, v, accent]) =>
    `<div style="display:flex; justify-content:space-between; font-size:11px;"><span style="color:var(--text-dim);">${k}</span><span style="color:${accent ? 'var(--gold)' : 'var(--text)'}; font-weight:500;">${v}</span></div>`
  ).join('');

  const qrContainer = document.getElementById('qrcode');
  qrContainer.innerHTML = '';

  const showModal = () => {
    const modal = document.getElementById('qrModal');
    const modalContent = document.getElementById('qrModalContent');
    if (modal) { modal.style.display = 'flex'; modal.classList.add('on'); }
    if (modalContent) modalContent.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  if (typeof QRCode !== 'undefined') {
    try {
      new QRCode(qrContainer, {
        text: payload,
        width: 200,
        height: 200,
        colorDark: '#111111',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.L
      });
      showModal();
    } catch (error) {
      console.error('QR generation error:', error);
      drawFallbackCanvas(qrContainer, payload);
      showModal();
    }
  } else {
    drawFallbackCanvas(qrContainer, payload);
    showModal();
  }
}

function drawFallbackCanvas(container, text) {
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, 200, 200);
  ctx.fillStyle = '#111';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('QR (Library Unavailable)', 100, 95);
  ctx.font = '10px monospace';
  ctx.fillText(text, 100, 115);
  container.appendChild(canvas);
}


function closeQRModal() {
  const modal = document.getElementById('qrModal');
  const modalContent = document.getElementById('qrModalContent');
  if (!modal || !modalContent) return;
  modal.classList.remove('on');
  modalContent.classList.remove('open');
  setTimeout(() => {
    const m = document.getElementById('qrModal');
    if (m) m.style.display = 'none';
  }, 300);
  document.body.style.overflow = '';
}

function closeQRModalOutside(e) {
  if (e.target === document.getElementById('qrModal')) closeQRModal();
}

// Fallback QR Code Generator
function generateFallbackQR(assetId, assetName, category, type, trackingMode, batchId = null, subId = null, isIndividual = false) {
  console.log('Fallback QR generator called with:', {
    assetId, assetName, category, type, trackingMode, batchId, subId, isIndividual
  });
  
  // Check if modal elements exist
  const modal = document.getElementById('qrModal');
  const modalContent = document.getElementById('qrModalContent');
  console.log('Modal elements:', { modal: !!modal, modalContent: !!modalContent });
  
  if (!modal || !modalContent) {
    console.error('Modal elements not found!');
    alert('QR modal not found. Please refresh the page.');
    return;
  }
  
  currentQRData = {
    id: subId || assetId,
    name: assetName,
    category: category,
    type: type,
    trackingMode: trackingMode,
    batchId: batchId,
    subId: subId,
    isIndividual: isIndividual
  };

  const payload = JSON.stringify({
    system: 'Haldens-Equipment',
    id: subId || assetId,
    name: assetName,
    category: category,
    type: type,
    trackingMode: trackingMode,
    batchId: batchId,
    isIndividual: isIndividual
  });

  const title = isIndividual ? 'Individual Equipment QR Code' : 'Batch Equipment QR Code';
  const subtitle = isIndividual ? 'Scan to identify this individual equipment item' : 'Scan to identify this equipment batch';
  
  document.getElementById('qrModalTitle').textContent = title;
  document.getElementById('qrModalSubtitle').textContent = subtitle;
  document.getElementById('qrLabelId').textContent = subId || assetId;
  document.getElementById('qrLabelName').textContent = assetName + (isIndividual ? ' — Individual Unit' : ' — Batch');

  // Meta information
  const rows = isIndividual ? [
    ['Asset ID', subId, true],
    ['Batch ID', batchId || '—', false],
    ['Equipment', assetName, false],
    ['Category', category, false],
    ['Type', type, false],
    ['Tracking Mode', 'Individual', false]
  ] : [
    ['Batch ID', assetId, true],
    ['Equipment', assetName, false],
    ['Category', category, false],
    ['Type', type, false],
    ['Tracking Mode', 'Batch', false]
  ];

  document.getElementById('qrModalMeta').innerHTML = rows.map(([k, v, accent]) =>
    `<div style="display:flex; justify-content:space-between; font-size:11px;"><span style="color:var(--text-dim);">${k}</span><span style="color:var(--text); font-weight:500; ${accent ? 'color:var(--gold);' : ''}">${v}</span></div>`
  ).join('');

  // Generate fallback QR code using canvas
  const qrContainer = document.getElementById('qrcode');
  qrContainer.innerHTML = '';
  
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  
  // Draw a simple placeholder QR code pattern
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 200, 200);
  
  ctx.fillStyle = '#000000';
  
  // Create a simple pattern that looks like a QR code
  const cellSize = 4;
  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 50; j++) {
      if (Math.random() > 0.5 || (i < 7 && j < 7) || (i >= 43 && j < 7) || (i < 7 && j >= 43)) {
        ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
      }
    }
  }
  
  // Add corner squares (QR code pattern)
  drawCornerSquare(ctx, 0, 0, cellSize);
  drawCornerSquare(ctx, 43 * cellSize, 0, cellSize);
  drawCornerSquare(ctx, 0, 43 * cellSize, cellSize);
  
  qrContainer.appendChild(canvas);
  
  const qrModal = document.getElementById('qrModal');
  const qrModalContent = document.getElementById('qrModalContent');
  if (qrModal) {
    qrModal.style.display = 'flex';
    qrModal.classList.add('on');
  }
  if (qrModalContent) qrModalContent.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function drawCornerSquare(ctx, x, y, cellSize) {
  // Outer square
  ctx.fillStyle = '#000000';
  ctx.fillRect(x, y, 7 * cellSize, 7 * cellSize);
  
  // Inner white square
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + cellSize, y + cellSize, 5 * cellSize, 5 * cellSize);
  
  // Inner black square
  ctx.fillStyle = '#000000';
  ctx.fillRect(x + 2 * cellSize, y + 2 * cellSize, 3 * cellSize, 3 * cellSize);
}

function downloadQR() {
  if (!currentQRData) {
    alert('No QR data available');
    return;
  }

  // Build printable canvas
  const canvas = document.createElement('canvas');
  const W = 320, H = 380;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  // Header bar
  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 0, W, 44);
  ctx.fillStyle = '#c4c43c';
  ctx.font = 'bold 13px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Halden\'s · Equipment ID', W/2, 28);

  // QR image
  const qrImg = document.querySelector('#qrcode img') || document.querySelector('#qrcode canvas');
  if (qrImg) {
    if (qrImg.tagName === 'CANVAS') {
      ctx.drawImage(qrImg, 60, 60, 200, 200);
    } else {
      const img = new Image();
      img.src = qrImg.src;
      img.onload = () => {
        ctx.drawImage(img, 60, 60, 200, 200);
        finishCanvas(canvas, ctx, currentQRData, W, H);
      };
      return;
    }
  }

  finishCanvas(canvas, ctx, currentQRData, W, H);
}

function finishCanvas(canvas, ctx, d, W, H) {
  ctx.fillStyle = '#111';
  ctx.font = 'bold 15px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(d.id, W/2, 282);

  ctx.fillStyle = '#555';
  ctx.font = '12px sans-serif';
  ctx.fillText(d.name + (d.isIndividual ? ' — Individual Unit' : ' — Batch'), W/2, 304);

  ctx.fillStyle = '#999';
  ctx.font = '10px monospace';
  ctx.fillText(d.category, W/2, 324);

  // Border
  ctx.strokeStyle = '#eee';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, W-2, H-2);

  // Download
  const link = document.createElement('a');
  link.download = `QR_${d.id}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function printQR() {
  if (!currentQRData) {
    alert('No QR data available');
    return;
  }

  const qrImg = document.querySelector('#qrcode img') || document.querySelector('#qrcode canvas');
  let imgSrc = '';
  if (qrImg) imgSrc = qrImg.tagName === 'CANVAS' ? qrImg.toDataURL() : qrImg.src;

  const win = window.open('', '_blank');
  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>QR Code - ${currentQRData.id}</title>
      <style>
        body { margin:0; padding:20px; font-family:monospace; text-align:center; }
        .qr-container { display:inline-block; padding:20px; border:2px solid #333; background:white; }
        .header { background:#111; color:#c4c43c; padding:10px; font-weight:bold; margin:-20px -20px 20px -20px; }
        .id { font-size:18px; font-weight:bold; margin:10px 0; }
        .name { font-size:14px; color:#555; margin:5px 0; }
        .category { font-size:12px; color:#999; }
      </style>
    </head>
    <body>
      <div class="qr-container">
        <div class="header">Halden's · Equipment ID</div>
        ${imgSrc ? `<img src="${imgSrc}" style="width:200px; height:200px;">` : '<p>QR Code not available</p>'}
        <div class="id">${currentQRData.id}</div>
        <div class="name">${currentQRData.name} ${currentQRData.isIndividual ? '— Individual Unit' : '— Batch'}</div>
        <div class="category">${currentQRData.category}</div>
      </div>
      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() {
            window.close();
          };
        };
      </script>
    </body>
    </html>
  `);
}

// ===== RENDER EIM TABLE =====
function renderEIMTable() {
  renderEIMStats();
  const search = (document.getElementById('eim-search') || {}).value || '';
  const filtered = EIM_ASSETS.filter(a => {
    const matchCat = eimCurrentCat === 'All' || a.category === eimCurrentCat;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      a.name.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q) ||
      a.type.toLowerCase().includes(q) ||
      (a.supplier || '').toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const condColors = { Excellent: 'var(--green)', Good: 'var(--gold)', Fair: 'var(--amber)', Poor: 'var(--red)', Damaged: 'var(--red)' };
  const statColors = { Active: 'confirmed', 'Available': 'confirmed', 'In Use': 'pending', 'Under Repair': 'critical', 'Maintenance': 'critical', 'Retired': 'cancelled', 'Review': 'warning' };

  const tbody = document.getElementById('eim-tbody');
  if (!tbody) return;

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:32px;color:var(--text-dim);">No equipment found.</td></tr>`;
    return;
  }

  let html = '';
  filtered.forEach((a) => {
    const origIdx = EIM_ASSETS.indexOf(a);

    let displayCond = a.condition;
    let displayStat = a.status;
    let activeQty = a.quantity;

    if (a.trackingMode === 'batch' && a.items) {
      const poorCount = a.items.filter(i => i.condition === 'Damaged' || i.condition === 'Poor').length;
      if (poorCount > 0) displayCond = 'Damaged';
      else if (a.items.some(i => i.condition === 'Fair')) displayCond = 'Fair';
      else if (a.items.every(i => i.condition === 'Excellent')) displayCond = 'Excellent';
      else displayCond = 'Good';

      if (a.items.some(i => i.status === 'Retired')) displayStat = 'Review';
      else if (a.items.some(i => i.status === 'Under Repair')) displayStat = 'Maintenance';
      else displayStat = 'Available';

      activeQty = a.items.length;
    } else {
      displayCond = a.condition;
      displayStat = a.status === 'Active' ? 'Available' : a.status;
    }

    const totalVal = (a.unitCost * activeQty).toLocaleString();
    const trackBadge = a.trackingMode === 'individual'
      ? `<span class="eim-track-badge individual">️ Individual</span>`
      : `<span class="eim-track-badge batch" style="cursor:pointer;" onclick="toggleEimSubRow('${a.id}')"> Batch ▽<br><small style="opacity:0.7;">${a.batchTrackingId}</small></span>`;

    const supplierTxt = a.supplier
      ? `<div style="font-size:12px;color:var(--text);">${a.supplier}</div>`
      : `<div style="font-size:11px;color:var(--text-dim);"> ${a.sourceLocation || '—'}</div>`;

    let mainRowIdDisplay = a.id;
    if (a.trackingMode === 'batch' && a.batchTrackingId) {
      mainRowIdDisplay = a.batchTrackingId;
    }

    html += `
      <tr class="eim-main-row" id="eim-row-${a.id}">
        <td><code style="font-size:11px; color:var(--gold); background:rgba(196,154,60,0.08); padding:2px 6px; border-radius:4px;">${mainRowIdDisplay}</code></td>
        <td>
          <div class="item-name">${a.name}</div>
          <div class="item-cat">${a.type}</div>
        </td>
        <td><span class="badge pending" style="font-size:10px;">${a.category}</span></td>
        <td style="font-size:13px; font-weight:600;">${activeQty} <span style="color:var(--text-dim);font-size:11px;">${a.unitType}</span></td>
        <td><span style="font-size:12px; font-weight:600; color:${condColors[displayCond] || 'var(--text)'};">● ${displayCond}</span></td>
        <td><span class="badge ${statColors[displayStat] || 'warning'}">${displayStat}</span></td>
        <td>
          <div style="font-size:13px;font-weight:600;font-family:'Arial',serif;">₱${a.unitCost.toLocaleString()}</div>
          <div style="font-size:10px;color:var(--text-dim);">Total ₱${totalVal}</div>
        </td>
        <td>${supplierTxt}</td>
        <td>${trackBadge}</td>
        <td style="text-align:right; white-space:nowrap;">
          <button class="btn-primary" style="margin-right:4px; font-size:10px; padding:4px 8px;" onclick="showEquipmentQR('${a.id}', null)"> Batch QR</button>
          <button class="btn-view" style="margin-right:4px;" onclick="openEditEquipmentModal(${origIdx})">️ Edit</button>
          <button class="btn-reject" onclick="confirmDeleteEquipment(${origIdx})"></button>
        </td>
      </tr>`;

    // Render Sub-rows if batch natively embedded
    if (a.trackingMode === 'batch' && a.items) {
      a.items.forEach((sub, sIdx) => {
        const iStat = sub.status === 'Active' ? 'Available' : sub.status;
        html += `
          <tr class="eim-sub-row eim-sub-${a.id}" style="display:none; background:var(--bg2);">
            <td style="padding-left:16px;"><code style="font-size:10px;">${sub.subId}</code></td>
            <td style="color:var(--text-dim); font-size:12px;">↳ ${a.name} (Unit)</td>
            <td></td>
            <td style="font-size:12px;color:var(--text-dim);">1 ${a.unitType}</td>
            <td><span style="font-size:11px; color:${condColors[sub.condition]}">● ${sub.condition}</span></td>
            <td><span class="badge ${statColors[iStat] || 'pending'}" style="font-size:10px;">${iStat}</span></td>
            <td style="font-size:12px;">₱${a.unitCost.toLocaleString()}</td>
            <td>${supplierTxt}</td>
            <td><span style="font-size:10px; color:var(--text-dim);">Unit Level</span></td>
            <td style="text-align:right;">
              ${shouldHaveIndividualQR(a.category) 
                ? `<button class="btn-primary" style="margin-right:4px; font-size:9px; padding:2px 6px;" onclick="showEquipmentQR('${a.id}', '${sub.subId}')"> QR</button>`
                : ''
              }
              <button class="btn-outline" style="font-size:10px; padding:2px 8px;" onclick="openEditIndividualModal(${origIdx}, ${sIdx})">Edit Unit</button>
            </td>
          </tr>`;
      });
    }
  });

  tbody.innerHTML = html;
}

function toggleEimSubRow(id) {
  const rows = document.querySelectorAll('.eim-sub-' + id);
  let isHidden = false;
  if (rows.length > 0 && rows[0].style.display === 'none') isHidden = true;
  rows.forEach(tr => { tr.style.display = isHidden ? 'table-row' : 'none'; });
}

function openEditIndividualModal(bIdx, sIdx) {
  const asset = EIM_ASSETS[bIdx];
  const item = asset.items[sIdx];
  document.getElementById('eim-edit-indiv-batch-idx').value = bIdx;
  document.getElementById('eim-edit-indiv-item-idx').value = sIdx;
  document.getElementById('eim-edit-indiv-id').value = item.subId;
  document.getElementById('eim-edit-indiv-condition').value = item.condition;
  document.getElementById('eim-edit-indiv-status').value = item.status;
  document.getElementById('eim-edit-indiv-modal').classList.add('open');
  document.getElementById('eim-edit-indiv-overlay').classList.add('on');
}

function closeEditIndividualModal() {
  document.getElementById('eim-edit-indiv-modal').classList.remove('open');
  document.getElementById('eim-edit-indiv-overlay').classList.remove('on');
}

const EIM_LOGS = [];
function recordEIMLog(action, details) {
  const userStr = sessionStorage.getItem('halden_admin');
  let user = 'Staff';
  if (userStr) {
    const u = JSON.parse(userStr);
    if (u.role === 'admin') user = 'Admin';
    else if (u.name) user = u.name;
  }

  EIM_LOGS.unshift({ time: new Date().toLocaleString(), user: user, action: action, details: details });
  renderEIMLogs();
}

function renderEIMLogs() {
  const tbody = document.getElementById('eim-logs-tbody');
  if (!tbody) return;
  if (EIM_LOGS.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:24px;color:var(--text-dim);">No activity logs available.</td></tr>';
    return;
  }
  tbody.innerHTML = EIM_LOGS.map(l => `
    <tr>
      <td style="font-size:12px;color:var(--text-dim);">${l.time}</td>
      <td><span class="badge pending" style="font-size:11px;">${l.user}</span></td>
      <td>
        <div style="font-weight:600;font-size:13px;">${l.action}</div>
        <div style="font-size:11px;color:var(--text-dim);margin-top:2px;">${l.details}</div>
      </td>
    </tr>
  `).join('');
}

function submitEditIndividual() {
  const bIdx = document.getElementById('eim-edit-indiv-batch-idx').value;
  const sIdx = document.getElementById('eim-edit-indiv-item-idx').value;
  const asset = EIM_ASSETS[bIdx];
  const item = asset.items[sIdx];

  const oldCond = item.condition;
  const oldStat = item.status;
  const newCond = document.getElementById('eim-edit-indiv-condition').value;
  const newStat = document.getElementById('eim-edit-indiv-status').value;

  if (oldCond !== newCond || oldStat !== newStat) {
    item.condition = newCond;
    item.status = newStat;
    recordEIMLog('Item Status Updated', `${item.subId} updated: Cond (${oldCond} -> ${newCond}), Status (${oldStat} -> ${newStat})`);
    renderEIMTable();
  }

  closeEditIndividualModal();
}

// Bind to window for HTML onclick handlers
window.toggleEimSubRow = toggleEimSubRow;
window.openEditIndividualModal = openEditIndividualModal;
window.closeEditIndividualModal = closeEditIndividualModal;
window.submitEditIndividual = submitEditIndividual;

function filterEIMCat(cat, btn) {
  eimCurrentCat = cat;
  document.querySelectorAll('.eim-cat-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderEIMTable();
}
window.filterEIMCat = filterEIMCat;

function switchEIMPnl(val) {
  const pnlList = document.getElementById('eim-pnl-list');
  const pnlLogs = document.getElementById('eim-pnl-logs');
  if (pnlList) pnlList.style.display = (val === 'list') ? 'block' : 'none';
  if (pnlLogs) pnlLogs.style.display = (val === 'logs') ? 'block' : 'none';

  const tList = document.getElementById('tab-eim-list');
  const tLogs = document.getElementById('tab-eim-logs');
  if (tList) tList.classList.toggle('active', val === 'list');
  if (tLogs) tLogs.classList.toggle('active', val === 'logs');
}
window.switchEIMPnl = switchEIMPnl;

// ===== ADD EQUIPMENT MODAL =====
let eimAddIdCounter = { F: 0, T: 0, G: 0, L: 0, C: 0, A: 0 };

function updateEIMAddId() {
  const cat = document.getElementById('eim-add-category').value;
  const prefixMap = { Furniture: 'F', Tableware: 'T', Glassware: 'G', Linens: 'L', 'Catering Equipment': 'C', 'AV & Lighting': 'A' };
  const p = prefixMap[cat] || 'X';
  const count = EIM_ASSETS.filter(a => a.id.startsWith('EQ-' + p)).length + 1;
  document.getElementById('eim-add-id').value = `EQ-${p}${String(count).padStart(3, '0')}`;
}

function toggleBatchField() {
  const mode = document.querySelector('input[name="eim-tracking"]:checked').value;
  document.getElementById('batch-id-field').style.display = mode === 'batch' ? 'block' : 'none';
}

function openAddEquipmentModal() {
  document.getElementById('eim-add-id').value = '';
  document.getElementById('eim-add-name').value = '';
  document.getElementById('eim-add-category').value = '';
  document.getElementById('eim-add-type').value = '';
  document.getElementById('eim-add-qty').value = '';
  document.getElementById('eim-add-unit').value = 'pcs';
  document.getElementById('eim-add-condition').value = 'Good';
  document.getElementById('eim-add-status').value = 'Active';
  document.getElementById('eim-add-cost').value = '';
  document.getElementById('eim-add-supplier').value = '';
  document.getElementById('eim-add-source').value = '';
  document.getElementById('eim-add-notes').value = '';
  document.getElementById('eim-add-batch-id').value = '';
  document.querySelector('input[name="eim-tracking"][value="individual"]').checked = true;
  toggleBatchField();
  document.getElementById('eim-add-overlay').classList.add('on');
  document.getElementById('eim-add-modal').classList.add('open');
}

function closeAddEquipmentModal() {
  document.getElementById('eim-add-overlay').classList.remove('on');
  document.getElementById('eim-add-modal').classList.remove('open');
}

function submitAddEquipment() {
  const name = document.getElementById('eim-add-name').value.trim();
  const cat = document.getElementById('eim-add-category').value;
  const type = document.getElementById('eim-add-type').value.trim();
  let qty = parseInt(document.getElementById('eim-add-qty').value) || 0;

  if (!name || !cat || !type || qty <= 0) {
    alert('Please fill in Name, Category, Type, and Quantity.');
    return;
  }

  const idInput = document.getElementById('eim-add-id').value.trim() || updateEIMAddId();
  const mode = document.querySelector('input[name="eim-tracking"]:checked').value;

  let itemsArray = null;
  let batchTrackId = null;

  if (mode === 'batch') {
    const match = idInput.match(/^(.*?)(\d+)$/);
    if (!match) {
      alert('For Batch items, the Asset ID must end with a number (e.g. ZA-F001) to act as the base counter prefix.');
      return;
    }

    if (qty > 100) qty = 100; // Cap quantity at 100

    const prefix = match[1];
    const startNum = parseInt(match[2], 10);
    const padding = match[2].length;

    const uBatchId = document.getElementById('eim-add-batch-id').value.trim();
    if (uBatchId) {
      batchTrackId = uBatchId;
    } else {
      const pfx = cat.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
      batchTrackId = `BAT-${pfx || 'EQ'}-${idInput.replace(/[^0-9]/g, '').slice(-3)}`;
    }

    itemsArray = [];
    const conditionVal = document.getElementById('eim-add-condition').value;
    const statusVal = document.getElementById('eim-add-status').value;

    for (let i = 0; i < qty; i++) {
      const currentNumStr = String(startNum + i).padStart(padding, '0');
      itemsArray.push({
        subId: `${prefix}${currentNumStr}`,
        condition: conditionVal || 'Good',
        status: statusVal || 'Active'
      });
    }
  }

  const newAsset = {
    id: idInput || `EQ-X${Date.now()}`,
    name, category: cat, type,
    quantity: qty,
    unitType: document.getElementById('eim-add-unit').value,
    condition: document.getElementById('eim-add-condition').value,
    status: document.getElementById('eim-add-status').value,
    unitCost: parseFloat(document.getElementById('eim-add-cost').value) || 0,
    supplier: document.getElementById('eim-add-supplier').value.trim() || null,
    rentalSupplier: document.getElementById('eim-add-supplier').value.trim() || 'General Rental Partner',
    sourceLocation: document.getElementById('eim-add-source').value.trim() || null,
    trackingMode: mode,
    batchTrackingId: batchTrackId,
    items: itemsArray,
    notes: document.getElementById('eim-add-notes').value.trim(),
    addedDate: new Date().toISOString().split('T')[0]
  };
  EIM_ASSETS.push(newAsset);

  if (typeof recordEIMLog === 'function') {
    recordEIMLog('New Equipment Added', `Added ${qty} of ${newAsset.id} (${newAsset.name}) into inventory.`);
  }

  closeAddEquipmentModal();
  renderEIMTable();
  // TODO: persist to Firestore: addDoc(collection(db, 'equipment_assets'), newAsset)
}

window.openAddEquipmentModal = openAddEquipmentModal;
window.closeAddEquipmentModal = closeAddEquipmentModal;
window.submitAddEquipment = submitAddEquipment;
window.updateEIMAddId = updateEIMAddId;
window.toggleBatchField = toggleBatchField;

// ===== EDIT EQUIPMENT =====
function openEditEquipmentModal(idx) {
  const a = EIM_ASSETS[idx];
  if (!a) return;
  document.getElementById('eim-edit-idx').value = idx;
  document.getElementById('eim-edit-id').value = a.id;
  document.getElementById('eim-edit-name').value = a.name;
  document.getElementById('eim-edit-category').value = a.category;
  document.getElementById('eim-edit-type').value = a.type;
  document.getElementById('eim-edit-qty').value = a.quantity;
  document.getElementById('eim-edit-unit').value = a.unitType;
  document.getElementById('eim-edit-condition').value = a.condition;
  document.getElementById('eim-edit-status').value = a.status;
  document.getElementById('eim-edit-cost').value = a.unitCost;
  document.getElementById('eim-edit-supplier').value = a.supplier || '';
  document.getElementById('eim-edit-source').value = a.sourceLocation || '';
  document.getElementById('eim-edit-notes').value = a.notes || '';

  const isBatch = a.trackingMode === 'batch';
  document.getElementById('eim-edit-condition').disabled = isBatch;
  document.getElementById('eim-edit-status').disabled = isBatch;
  document.getElementById('eim-edit-condition').style.opacity = isBatch ? '0.5' : '1';
  document.getElementById('eim-edit-status').style.opacity = isBatch ? '0.5' : '1';

  if (isBatch) {
    document.getElementById('eim-edit-condition').title = 'Condition is locked for batches. Edit individual units.';
    document.getElementById('eim-edit-status').title = 'Status is locked for batches. Edit individual units.';
  } else {
    document.getElementById('eim-edit-condition').title = '';
    document.getElementById('eim-edit-status').title = '';
  }

  document.getElementById('eim-edit-overlay').classList.add('on');
  document.getElementById('eim-edit-modal').classList.add('open');
}

function closeEditEquipmentModal() {
  document.getElementById('eim-edit-overlay').classList.remove('on');
  document.getElementById('eim-edit-modal').classList.remove('open');
}

function submitEditEquipment() {
  const idx = parseInt(document.getElementById('eim-edit-idx').value);
  if (isNaN(idx) || !EIM_ASSETS[idx]) return;
  const a = EIM_ASSETS[idx];
  a.name = document.getElementById('eim-edit-name').value.trim();
  a.category = document.getElementById('eim-edit-category').value;
  a.type = document.getElementById('eim-edit-type').value.trim();
  a.quantity = parseInt(document.getElementById('eim-edit-qty').value) || a.quantity;
  a.unitType = document.getElementById('eim-edit-unit').value;
  a.condition = document.getElementById('eim-edit-condition').value;
  a.status = document.getElementById('eim-edit-status').value;
  a.unitCost = parseFloat(document.getElementById('eim-edit-cost').value) || 0;
  a.supplier = document.getElementById('eim-edit-supplier').value.trim() || null;
  a.rentalSupplier = a.supplier || a.rentalSupplier || 'General Rental Partner';
  a.sourceLocation = document.getElementById('eim-edit-source').value.trim() || null;
  a.notes = document.getElementById('eim-edit-notes').value.trim();
  a.notes = document.getElementById('eim-edit-notes').value.trim();

  if (typeof recordEIMLog === 'function') {
    recordEIMLog('Equipment Altered', `Global details updated for ${a.id} (${a.name}).`);
  }
  closeEditEquipmentModal();
  renderEIMTable();
  renderDashboard(); // refresh equipment stat
  // TODO: persist to Firestore: updateDoc(doc(db, 'equipment_assets', a.firestoreId), {...})
}

window.openEditEquipmentModal = openEditEquipmentModal;
window.closeEditEquipmentModal = closeEditEquipmentModal;
window.submitEditEquipment = submitEditEquipment;

// ===== DELETE EQUIPMENT =====
let _pendingDelete = null;

function confirmDeleteEquipment(idx) {
  const a = EIM_ASSETS[idx];
  if (!a) return;
  _pendingDelete = { type: 'equipment', idx };
  document.getElementById('del-message').textContent =
    `Are you sure you want to remove "${a.name}" (${a.id}) from the inventory? This action cannot be undone.`;
  document.getElementById('del-confirm-btn').onclick = () => {
    EIM_ASSETS.splice(idx, 1);
    closeDeleteModal();
    renderEIMTable();
  };
  document.getElementById('del-overlay').classList.add('on');
  document.getElementById('del-modal').classList.add('open');
}

function closeDeleteModal() {
  document.getElementById('del-overlay').classList.remove('on');
  document.getElementById('del-modal').classList.remove('open');
  _pendingDelete = null;
}

window.confirmDeleteEquipment = confirmDeleteEquipment;
window.closeDeleteModal = closeDeleteModal;

// ===== RENDER RENTAL CARDS =====
function renderRentalCards() {
  ensureRentalSuppliers();
  seedDemoRentalFlagIfNeeded();
  renderRentalNeedsPanel();
  renderRentalOrders();
  renderTrackedRentalAssets();
  updateRentalStats();
}

function seedDemoRentalFlagIfNeeded() {
  var hasNeeds = collectRentalNeeds().length > 0;
  var hasOrders = (window.rentalOrders || []).length > 0;
  if (hasNeeds || hasOrders) return;

  var asset = EIM_ASSETS.find(function (a) {
    return a.status !== 'Retired' && a.status !== 'Under Repair' && (a.quantity || 0) >= 1;
  }) || EIM_ASSETS[0];
  if (!asset) return;

  var demoEventId = 'DEMO-RENTAL-FLAG';
  if (!RESERVATIONS.find(function (r) { return r.id === demoEventId; })) {
    RESERVATIONS.push({
      id: demoEventId,
      client: 'Demo Rental Flag Event',
      type: 'Corporate',
      date: new Date().toISOString().split('T')[0],
      pax: 120,
      amount: '₱0',
      status: 'confirmed',
      venue: 'Demo Function Hall'
    });
  }

  if (!EIM_SCHEDULES.find(function (s) { return s.eventId === demoEventId; })) {
    EIM_SCHEDULES.push({
      id: 'SCH-DEMO-RENT',
      eventId: demoEventId,
      eventName: 'Demo Rental Flag Event',
      eventDate: new Date().toISOString().split('T')[0],
      eventPax: 120,
      eventType: 'Corporate',
      timePeriod: { id: 'custom', label: 'Custom (10:00–18:00)', start: '10:00', end: '18:00' },
      items: [{
        assetId: asset.id,
        name: asset.name,
        category: asset.category,
        requiredQty: Math.max(3, (asset.quantity || 1) + 2),
        assignedQty: Math.max(1, asset.quantity || 1),
        sufficient: false
      }],
      status: 'Insufficient',
      assignedBy: 'System Demo',
      assignedAt: new Date().toISOString(),
      notes: 'Auto-seeded demo rental flag.'
    });
  }
}

function collectRentalNeeds() {
  const needs = [];
  EIM_SCHEDULES.forEach(function (sch) {
    const missing = (sch.items || []).filter(function (it) { return (it.requiredQty || 0) > (it.assignedQty || 0); });
    missing.forEach(function (it) {
      const asset = EIM_ASSETS.find(function (a) { return a.id === it.assetId; }) || {};
      needs.push({
        key: sch.eventId + '__' + it.assetId,
        eventId: sch.eventId,
        eventName: sch.eventName,
        eventDate: sch.eventDate,
        eventPax: sch.eventPax,
        eventType: sch.eventType,
        venue: (RESERVATIONS.find(function (r) { return r.id === sch.eventId; }) || {}).venue || 'Venue TBD',
        timePeriod: sch.timePeriod,
        assetId: it.assetId,
        name: it.name,
        category: it.category,
        requiredQty: it.requiredQty || 0,
        assignedQty: it.assignedQty || 0,
        shortQty: Math.max(0, (it.requiredQty || 0) - (it.assignedQty || 0)),
        unitType: asset.unitType || 'pcs',
        rentalSupplier: asset.rentalSupplier || asset.supplier || 'General Rental Partner',
        estPrice: parseFloat(asset.unitCost || 0) || 0
      });
    });
  });
  return needs.filter(function (n) { return n.shortQty > 0; });
}

function reviewRentalNeeds(eventId) {
  const needs = collectRentalNeeds().filter(function (n) { return n.eventId === eventId; });
  const review = document.getElementById('rnt-review-container');
  if (!review) return;
  if (!needs.length) {
    review.style.display = 'none';
    return;
  }
  const event = needs[0];
  review.style.display = 'block';
  review.innerHTML = `<div class="panel" style="border:1px solid var(--gold);">
    <div class="panel-hdr">
      <div><div class="panel-title"> Rental Needs Review — ${escHtml(event.eventName)}</div>
      <div class="panel-sub">${escHtml(event.eventDate)} · ${escHtml(event.timePeriod?.label || 'Time TBD')} · ${escHtml(event.venue)}</div></div>
      <button class="btn-primary" onclick="generateRentalOrdersForEvent('${eventId}')">Generate Rental Order(s)</button>
    </div>
    <div class="panel-body" style="padding:0;overflow-x:auto;">
      <table class="inv-table">
        <thead><tr><th>Equipment</th><th>Supplier</th><th>Required</th><th>Assigned</th><th>To Rent</th></tr></thead>
        <tbody>${needs.map(function (n) {
    return `<tr>
          <td><div class="item-name">${escHtml(n.name)}</div><div class="item-cat">${escHtml(n.category)} · ${escHtml(n.assetId)}</div></td>
          <td>${escHtml(n.rentalSupplier)}</td>
          <td>${n.requiredQty}</td><td>${n.assignedQty}</td>
          <td style="color:var(--red);font-weight:700;">${n.shortQty} ${escHtml(n.unitType)}</td>
        </tr>`;
  }).join('')}</tbody>
      </table>
    </div>
  </div>`;
}

function generateRentalOrdersForEvent(eventId) {
  const needs = collectRentalNeeds().filter(function (n) { return n.eventId === eventId; });
  if (!needs.length) { alert('No active shortages found for this event.'); return; }
  const grouped = {};
  needs.forEach(function (n) {
    const key = n.eventId + '__' + n.rentalSupplier;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(n);
  });

  Object.keys(grouped).forEach(function (key) {
    const items = grouped[key];
    const first = items[0];
    const existing = window.rentalOrders.find(function (o) {
      return o.eventId === first.eventId && o.supplier === first.rentalSupplier && o.status !== 'cancelled' && o.status !== 'arrived';
    });
    if (existing) {
      existing.items = items;
      existing.updatedAt = new Date().toISOString();
      return;
    }
    window.rentalOrders.push({
      id: 'RNO-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      eventId: first.eventId,
      eventName: first.eventName,
      eventDate: first.eventDate,
      venue: first.venue,
      timePeriod: first.timePeriod,
      supplier: first.rentalSupplier,
      items: items,
      status: 'draft',
      createdAt: new Date().toISOString(),
      sentAt: null,
      arrivedAt: null,
      cancelledAt: null
    });
  });
  showToast('Rental order drafts generated by supplier.');
  renderRentalCards();
}

function renderRentalOrders() {
  const container = document.getElementById('rnt-orders-container');
  if (!container) return;
  if (!window.rentalOrders.length) {
    container.innerHTML = `<div class="panel"><div class="panel-body" style="text-align:center;padding:28px;color:var(--text-dim);">No rental orders generated yet. Review shortage cards above and generate orders.</div></div>`;
    return;
  }
  container.innerHTML = window.rentalOrders.map(function (o, idx) {
    const totalQty = o.items.reduce(function (s, i) { return s + (i.shortQty || 0); }, 0);
    const totalEst = o.items.reduce(function (s, i) { return s + ((i.shortQty || 0) * (i.estPrice || 0)); }, 0);
    const badge = o.status === 'arrived' ? 'confirmed' : (o.status === 'cancelled' ? 'cancelled' : (o.status === 'pending' ? 'pending' : 'warning'));
    return `<div class="panel" style="margin-bottom:14px;">
      <div class="panel-hdr">
        <div>
          <div class="panel-title"> ${escHtml(o.id)} · ${escHtml(o.supplier)}</div>
          <div class="panel-sub">${escHtml(o.eventName)} · ${escHtml(o.eventDate)} · ${escHtml(o.venue)} · ${escHtml(o.timePeriod?.label || 'Time TBD')}</div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
          <span class="badge ${badge}" style="font-size:11px;text-transform:capitalize;">${escHtml(o.status)}</span>
          <button class="btn-view" onclick="toggleRentalOrderDetails(${idx})">Expand</button>
        </div>
      </div>
      <div id="rnt-order-detail-${idx}" style="display:none;border-top:1px solid var(--border);">
        <div class="panel-body" style="padding:12px 18px;">
          <div style="font-size:12px;color:var(--text-dim);margin-bottom:10px;">${o.items.length} line item(s) · ${totalQty} unit(s) total · Est. ₱${totalEst.toLocaleString()}</div>
          <div style="overflow-x:auto;">
            <table class="inv-table" style="font-size:12px;">
              <thead><tr><th>Equipment</th><th>Asset ID</th><th>Needed Qty</th><th>Est. Unit</th><th>Est. Total</th></tr></thead>
              <tbody>${o.items.map(function (it) {
      return `<tr>
                <td>${escHtml(it.name)}</td><td>${escHtml(it.assetId)}</td><td>${it.shortQty} ${escHtml(it.unitType)}</td>
                <td>₱${(it.estPrice || 0).toLocaleString()}</td><td>₱${((it.shortQty || 0) * (it.estPrice || 0)).toLocaleString()}</td>
              </tr>`;
    }).join('')}</tbody>
            </table>
          </div>
          <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn-outline" onclick="exportRentalOrderPdf('${o.id}')">️ Export PDF</button>
            ${o.status === 'draft' ? `<button class="btn-primary" onclick="markRentalOrderSent('${o.id}')"> Order Sent</button>` : ''}
            ${o.status === 'pending' ? `<button class="btn-approve" onclick="markRentalOrderArrived('${o.id}')"> Arrived</button><button class="btn-reject" onclick="cancelRentalOrder('${o.id}')">✕ Cancelled</button>` : ''}
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

function toggleRentalOrderDetails(idx) {
  var el = document.getElementById('rnt-order-detail-' + idx);
  if (!el) return;
  el.style.display = el.style.display === 'none' ? '' : 'none';
}

function exportRentalOrderPdf(orderId) {
  const o = window.rentalOrders.find(function (x) { return x.id === orderId; });
  if (!o) return;
  const w = window.open('', '_blank');
  const rows = o.items.map(function (it) {
    return '<tr><td>' + escHtml(it.name) + '</td><td>' + escHtml(it.assetId) + '</td><td>' + it.shortQty + ' ' + escHtml(it.unitType) + '</td><td>₱' + (it.estPrice || 0).toLocaleString() + '</td></tr>';
  }).join('');
  w.document.write('<html><head><title>Rental Order ' + escHtml(o.id) + '</title><style>body{font-family:sans-serif;padding:28px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:8px;text-align:left}th{background:#f4f4f4}</style></head><body>');
  w.document.write('<h2>Rental Order ' + escHtml(o.id) + '</h2>');
  w.document.write('<p><strong>Supplier:</strong> ' + escHtml(o.supplier) + '</p>');
  w.document.write('<p><strong>Event:</strong> ' + escHtml(o.eventName) + ' · ' + escHtml(o.eventDate) + '</p>');
  w.document.write('<p><strong>Venue / Required Time:</strong> ' + escHtml(o.venue) + ' · ' + escHtml(o.timePeriod?.label || 'Time TBD') + '</p>');
  w.document.write('<table><thead><tr><th>Equipment</th><th>Asset ID</th><th>Needed Qty</th><th>Est. Unit Price</th></tr></thead><tbody>' + rows + '</tbody></table>');
  w.document.write('</body></html>');
  w.document.close();
  w.print();
}

function markRentalOrderSent(orderId) {
  const o = window.rentalOrders.find(function (x) { return x.id === orderId; });
  if (!o) return;
  o.status = 'pending';
  o.sentAt = new Date().toISOString();
  showToast('Purchase order email queued for ' + o.supplier + '.');
  renderRentalCards();
}

function markRentalOrderArrived(orderId) {
  const o = window.rentalOrders.find(function (x) { return x.id === orderId; });
  if (!o) return;
  o.status = 'arrived';
  o.arrivedAt = new Date().toISOString();
  o.items.forEach(function (it) {
    const rid = 'RNT-' + String(RENTED_EQUIPMENT.length + 1).padStart(3, '0');
    RENTED_EQUIPMENT.push({
      id: rid,
      name: it.name,
      type: it.category,
      category: it.category,
      quantity: it.shortQty,
      unitType: it.unitType || 'pcs',
      condition: 'Good',
      status: 'Awaiting',
      initialPrice: it.estPrice || 0,
      supplier: o.supplier,
      arrivalDate: o.eventDate,
      deploymentDate: o.eventDate,
      returnDate: o.eventDate,
      reservationId: o.eventId,
      forEvent: o.eventId,
      forEventName: o.eventName,
      linkedEvent: o.eventName + ' — ' + o.eventDate,
      notes: 'Auto-added from rental order ' + o.id + '.',
      trackingType: 'rental'
    });
  });
  showToast('Order marked arrived. Rental assets are now tracked.');
  renderRentalCards();
}

function cancelRentalOrder(orderId) {
  const o = window.rentalOrders.find(function (x) { return x.id === orderId; });
  if (!o) return;
  o.status = 'cancelled';
  o.cancelledAt = new Date().toISOString();
  showToast('Rental order cancelled. Needs remain in shortage review.');
  renderRentalCards();
}

function updateRentalStats() {
  const needsCount = collectRentalNeeds().length;
  const pendingCount = window.rentalOrders.filter(function (o) { return o.status === 'pending'; }).length;
  const arrivedCount = window.rentalOrders.filter(function (o) { return o.status === 'arrived'; }).length;
  var s = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };
  s('rnt-stat-total', window.rentalOrders.length);
  s('rnt-stat-deployed', pendingCount);
  s('rnt-stat-due', needsCount);
  s('rnt-stat-returned', arrivedCount);
}

function renderTrackedRentalAssets() {
  const container = document.getElementById('rnt-cards-container');
  if (!container) return;
  const active = RENTED_EQUIPMENT.filter(function (r) { return r.trackingType === 'rental' || r.reservationId || r.forEvent; });
  if (!active.length) {
    container.innerHTML = '<div class="panel"><div class="panel-body" style="text-align:center;padding:22px;color:var(--text-dim);">No arrived rental assets yet.</div></div>';
    return;
  }
  container.innerHTML = '<div class="panel"><div class="panel-hdr"><div><div class="panel-title"> Arrived Rental Assets (Tracked)</div><div class="panel-sub">These are now visible to lifecycle and routine check flows.</div></div></div><div class="panel-body" style="padding:0;overflow-x:auto;"><table class="inv-table"><thead><tr><th>ID</th><th>Equipment</th><th>Supplier</th><th>Qty</th><th>Event</th><th>Status</th></tr></thead><tbody>' +
    active.map(function (r) { return '<tr><td>' + escHtml(r.id) + '</td><td>' + escHtml(r.name) + '</td><td>' + escHtml(r.supplier || '—') + '</td><td>' + (r.quantity || 0) + ' ' + escHtml(r.unitType || 'pcs') + '</td><td>' + escHtml(r.linkedEvent || r.forEventName || '—') + '</td><td><span class="badge pending">Tracked Rental</span></td></tr>'; }).join('') +
    '</tbody></table></div></div>';
}

// compatibility stubs for old entry points
function openAddRentalModal() {
  showSection('rentals', document.getElementById('nav-rentals'));
  showToast('Rental orders are now auto-generated from scheduling shortages.');
}
function closeAddRentalModal() { }
function submitAddRental() { }
function openEditRentalModal() { showToast('Manual rental editing is disabled in the new flow.'); }
function closeEditRentalModal() { }
function submitEditRental() { }
function confirmDeleteRental() { showToast('Remove via order cancellation if needed.'); }

window.openAddRentalModal = openAddRentalModal;
window.closeAddRentalModal = closeAddRentalModal;
window.submitAddRental = submitAddRental;
window.openEditRentalModal = openEditRentalModal;
window.closeEditRentalModal = closeEditRentalModal;
window.submitEditRental = submitEditRental;
window.confirmDeleteRental = confirmDeleteRental;
window.reviewRentalNeeds = reviewRentalNeeds;
window.generateRentalOrdersForEvent = generateRentalOrdersForEvent;
window.toggleRentalOrderDetails = toggleRentalOrderDetails;
window.exportRentalOrderPdf = exportRentalOrderPdf;
window.markRentalOrderSent = markRentalOrderSent;
window.markRentalOrderArrived = markRentalOrderArrived;
window.cancelRentalOrder = cancelRentalOrder;

// ===== Initial EIM render =====
renderEIMStats();

// ====================================================================
// ==================== AI INTELLIGENCE ENGINE ========================
// ====================================================================
const AI_API_URL = 'https://halden-s-catering-service.vercel.app/api/chat';
const AI_SYS_INSIGHTS = `You are the Senior Business Intelligence Consultant for Halden's Event Management and Catering Service.
Your goal is to analyze the provided business data and provide 4 high-value strategic insights.
Format: Use HTML tags for structure. Each insight should start with a gold bullet <span style='color:var(--gold);'>●</span> and a strong title.
Tone: Premium, data-driven, and encouraging. Focus on maximizing profit and operational efficiency.`;

async function generateAIReport() {
  const btn = document.getElementById('btn-ai-report');
  const container = document.getElementById('ai-insights-container');
  const body = document.getElementById('ai-insights-body');
  if (!btn || !container || !body) return;
  btn.disabled = true;
  btn.textContent = ' Analyzing Live Data...';
  const confirmed = RESERVATIONS.filter(r => r.status === 'confirmed');
  const pending = RESERVATIONS.filter(r => r.status === 'pending');
  const revTotal = confirmed.reduce((sum, r) => sum + (parseFloat(r.amount != null ? String(r.amount).replace(/[^\d.]/g, '') : '0') || 0), 0);
  const context = `
    CURRENT BUSINESS SNAPSHOT:
    - Confirmed Reservations: ${confirmed.length}
    - Pending Inquiries: ${pending.length}
    - Total Confirmed Revenue: ₱${revTotal.toLocaleString()}
    - Total Equipment Assets: ${EIM_ASSETS.length} types (${EIM_ASSETS.reduce((s, a) => s + a.quantity, 0)} total units)
    - Active Rentals: ${RENTED_EQUIPMENT.filter(r => r.status !== 'Returned').length}
    - Top Event Types: ${[...new Set(confirmed.map(r => r.type))].join(', ')}
  `;
  try {
    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b:free',
        messages: [
          { role: 'system', content: AI_SYS_INSIGHTS },
          { role: 'user', content: `Generate a business intelligence report: ${context}` }
        ]
      })
    });
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Unable to synthesize data. Please try again.";
    container.style.display = 'block';
    body.innerHTML = reply.replace(/\n/g, '<br>');
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (err) {
    console.error('AI Error:', err);
    body.innerHTML = `<p style="color:var(--red);"> Error connecting to Intelligence Engine.</p>`;
    container.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = ' Re-Generate Intelligence';
  }
}
window.generateAIReport = generateAIReport;

// ====================================================================
// ==================== ADMIN CHAT ====================================
// ====================================================================
let activeCustomerId = null;
let activeChatUnsub = null;
let conversationsUnsub = null;

function initAdminChat() {
  if (conversationsUnsub) return;
  const { collection, onSnapshot, query, orderBy } = window.firebaseFns;
  const q = query(collection(window.firebaseDB, 'messages'), orderBy('timestamp', 'desc'));
  conversationsUnsub = onSnapshot(q, (snap) => {
    const convoMap = new Map();
    snap.forEach(doc => {
      const msg = doc.data();
      if (!convoMap.has(msg.uid)) {
        convoMap.set(msg.uid, {
          uid: msg.uid, name: msg.userName, email: msg.userEmail,
          lastMsg: msg.text, time: msg.timestamp, hasNew: msg.sender === 'customer'
        });
      }
    });
    renderChatInbox(Array.from(convoMap.values()));
    const anyNew = Array.from(convoMap.values()).some(c => c.hasNew);
    const notif = document.getElementById('chat-notif');
    if (notif) notif.style.display = anyNew ? 'inline-block' : 'none';
  });
}

function renderChatInbox(convos) {
  const list = document.getElementById('chat-inbox-list');
  if (!list) return;
  if (convos.length === 0) {
    list.innerHTML = `<div style="padding:20px; text-align:center; color:var(--text-dim); font-size:12px;">No active chats yet.</div>`;
    return;
  }
  list.innerHTML = convos.map(c => {
    const timeStr = new Date(c.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `
      <div class="inbox-item ${activeCustomerId === c.uid ? 'active' : ''} ${c.hasNew ? 'unread' : ''}" onclick="openConversation('${c.uid}', '${c.name.replace(/'/g, "\\'")}')">
        <div class="ii-name">${c.name} ${c.hasNew ? '<span class="ii-dot"></span>' : ''}</div>
        <div class="ii-msg">${c.lastMsg}</div>
        <div class="ii-time">${timeStr}</div>
      </div>`;
  }).join('');
}

async function openConversation(uid, name) {
  activeCustomerId = uid;
  document.querySelector('.ach-name').textContent = name;
  document.querySelector('.ach-status').textContent = 'Direct Support Channel';
  document.getElementById('admin-chat-input-row').style.display = 'flex';
  renderChatInbox([]);
  if (activeChatUnsub) activeChatUnsub();
  const { collection, query, where, orderBy, onSnapshot } = window.firebaseFns;
  const q = query(collection(window.firebaseDB, 'messages'), where('uid', '==', uid), orderBy('timestamp', 'asc'));
  activeChatUnsub = onSnapshot(q, (snap) => {
    const box = document.getElementById('admin-chat-box');
    box.innerHTML = '';
    snap.forEach(doc => {
      const msg = doc.data();
      const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${msg.sender}`;
      bubble.innerHTML = `<div class="chat-text">${msg.text}</div><div class="chat-time">${time}</div>`;
      box.appendChild(bubble);
    });
    box.scrollTop = box.scrollHeight;
  });
}
window.openConversation = openConversation;

async function sendAdminMsg() {
  const input = document.getElementById('admin-chat-input');
  const text = input.value.trim();
  if (!text || !activeCustomerId) return;
  try {
    const { collection, addDoc } = window.firebaseFns;
    await addDoc(collection(window.firebaseDB, 'messages'), {
      uid: activeCustomerId,
      userName: document.querySelector('.ach-name').textContent,
      text, sender: 'staff', timestamp: Date.now()
    });
    input.value = '';
  } catch (err) { console.error('Send error:', err); }
}
window.sendAdminMsg = sendAdminMsg;

// ====================================================================
// ==================== SEATING LAYOUT ================================
// ====================================================================
let seatingMode = 'admin';
let seatingElements = [];
let selectedSeatingIds = [];
let seatingDragBox = null;
let seatingViewBox = { x: 0, y: 0, w: 1200, h: 800 };
let seatingPanState = null;
let seatingHistory = [];
let isDraggingStateSaved = false;
let draggingSeatingEl = null;
let seatingOffset = { x: 0, y: 0 };
const SEATING_SNAP_DIST = 90;


function saveSeatingHistoryState() {
  seatingHistory.push(JSON.stringify(seatingElements));
  if (seatingHistory.length > 20) seatingHistory.shift();
  const btn = document.getElementById('resd-seating-undo');
  if (btn) { btn.disabled = false; btn.style.opacity = 1; btn.style.cursor = 'pointer'; }
}

function undoSeating() {
  if (seatingHistory.length === 0) return;
  const stateStr = seatingHistory.pop();
  seatingElements = JSON.parse(stateStr);
  selectedSeatingIds = [];
  renderSeating();
  showToast('Undo successful');
  const btn = document.getElementById('resd-seating-undo');
  if (btn && seatingHistory.length === 0) { btn.disabled = true; btn.style.opacity = 0.5; btn.style.cursor = 'not-allowed'; }
}

function getSeatingDomRefs() {
  const useResDetails = !!document.getElementById('resd-seating-canvas');
  if (useResDetails) {
    return {
      canvas: document.getElementById('resd-seating-canvas'),
      modeTag: document.getElementById('resdSeatingModeTag'),
      modeBtn: document.getElementById('resdSeatingModeBtn'),
      sumTables: 'resd-seat-sum-tables',
      sumChairs: 'resd-seat-sum-chairs',
      sumPax: 'resd-seat-sum-pax',
      selectionInfo: document.getElementById('resd-seating-selection-info'),
      unlockBtn: null
    };
  }
  return {
    canvas: document.getElementById('seating-canvas'),
    modeTag: document.getElementById('seatingModeTag'),
    modeBtn: document.getElementById('seatingModeBtn'),
    sumTables: 'seat-sum-tables',
    sumChairs: 'seat-sum-chairs',
    sumPax: 'seat-sum-pax',
    selectionInfo: document.getElementById('seating-selection-info'),
    unlockBtn: document.getElementById('seatUnlockBtn')
  };
}

function addSeatingElement(type) {
  saveSeatingHistoryState();
  seatingElements.push({ id: 'el_' + Date.now(), type, x: 450, y: 350, parentId: null, guest: type === 'chair' ? "" : null });
  renderSeating();
}

function toggleSeatingMode() {
  seatingMode = seatingMode === 'admin' ? 'customer' : 'admin';
  selectedSeatingIds = [];
  const refs = getSeatingDomRefs();
  const tag = refs.modeTag;
  const btn = refs.modeBtn;
  if (tag) {
    tag.innerText = seatingMode.toUpperCase() + " MODE";
    tag.className = `badge ${seatingMode === 'admin' ? 'pending' : 'confirmed'}`;
  }
  if (btn) btn.innerText = seatingMode === 'admin' ? "Switch to Customer View" : "Switch to Admin View";
  renderSeating();
}

function unlockAttachedChairs() {
  saveSeatingHistoryState();
  seatingElements.forEach(el => { if (selectedSeatingIds.includes(el.parentId)) el.parentId = null; });
  renderSeating();
}

function deleteSeatingEl(id) {
  saveSeatingHistoryState();
  seatingElements.forEach(e => { if (e.parentId === id) e.parentId = null; });
  seatingElements = seatingElements.filter(e => e.id !== id);
  selectedSeatingIds = selectedSeatingIds.filter(sid => sid !== id);
  renderSeating();
}

function renderSeating() {
  const refs = getSeatingDomRefs();
  const canvas = refs.canvas;
  if (!canvas) return;
  canvas.innerHTML = '';
  let tCount = 0, cCount = 0;
  const sorted = [...seatingElements].sort((a, b) => {
    if (a.type.includes('table') && b.type === 'chair') return -1;
    if (a.type === 'chair' && b.type.includes('table')) return 1;
    return 0;
  });
  
  // Draw drag box if active
  if (seatingDragBox) {
    const box = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    const x = Math.min(seatingDragBox.startX, seatingDragBox.currentX);
    const y = Math.min(seatingDragBox.startY, seatingDragBox.currentY);
    const w = Math.abs(seatingDragBox.currentX - seatingDragBox.startX);
    const h = Math.abs(seatingDragBox.currentY - seatingDragBox.startY);
    box.setAttribute("x", x);
    box.setAttribute("y", y);
    box.setAttribute("width", w);
    box.setAttribute("height", h);
    box.setAttribute("class", "seating-selection-box");
    canvas.appendChild(box);
  }

  sorted.forEach(el => {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("transform", `translate(${el.x}, ${el.y})`);
    
    if (el.type.includes('table')) {
      tCount++;
      const shape = (el.type === 'table-round')
        ? document.createElementNS("http://www.w3.org/2000/svg", "circle")
        : document.createElementNS("http://www.w3.org/2000/svg", "rect");
      if (el.type === 'table-round') { shape.setAttribute("r", "45"); }
      else { shape.setAttribute("width", "130"); shape.setAttribute("height", "80"); shape.setAttribute("x", "-65"); shape.setAttribute("y", "-40"); }
      
      const isSelected = selectedSeatingIds.includes(el.id);
      shape.setAttribute("class", `table ${isSelected ? 'selected multi-selected' : ''} ${el.isVip ? 'table-vip' : ''}`);
      if (seatingMode === 'admin') {
        shape.onmousedown = (e) => { e.stopPropagation(); startSeatingDrag(e, el); };
        shape.onclick = (e) => { 
          e.stopPropagation(); 
          if (e.shiftKey) {
            if (isSelected) selectedSeatingIds = selectedSeatingIds.filter(id => id !== el.id);
            else selectedSeatingIds.push(el.id);
          } else {
            selectedSeatingIds = [el.id]; 
          }
          renderSeating(); 
        };
        shape.oncontextmenu = (e) => { e.preventDefault(); if(selectedSeatingIds.includes(el.id)) { deleteSelectedSeatingElements(); } else { deleteSeatingEl(el.id); } };
      }
      group.appendChild(shape);
    } else {
      cCount++;
      const chair = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      chair.setAttribute("r", "16");
      const isLocked = el.parentId !== null;
      chair.setAttribute("class", `chair ${isLocked ? 'chair-locked' : ''} ${el.guest ? 'chair-taken' : ''}`);
      if (seatingMode === 'customer') {
        group.style.cursor = 'pointer';
        group.addEventListener('click', function (e) {
          e.preventDefault(); e.stopPropagation();
          const name = prompt("Assign guest name to this chair:", el.guest || "");
          if (name !== null) { el.guest = name.trim(); renderSeating(); }
        });
      } else {
        chair.onmousedown = (e) => { e.stopPropagation(); startSeatingDrag(e, el); };
        chair.oncontextmenu = (e) => { e.preventDefault(); if(selectedSeatingIds.includes(el.id)) { deleteSelectedSeatingElements(); } else { deleteSeatingEl(el.id); } };
      }
      group.appendChild(chair);
      if (el.guest) {
        const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
        txt.setAttribute("y", "5"); txt.setAttribute("class", "label");
        txt.textContent = el.guest.charAt(0).toUpperCase();
        group.appendChild(txt);
        const fullTxt = document.createElementNS("http://www.w3.org/2000/svg", "text");
        fullTxt.setAttribute("y", "32"); fullTxt.setAttribute("class", "label");
        fullTxt.style.fill = "var(--gold)";
        fullTxt.textContent = el.guest;
        group.appendChild(fullTxt);
      }
    }
    canvas.appendChild(group);
  });
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.innerText = v; };
  set(refs.sumTables, tCount);
  set(refs.sumChairs, cCount);
  set(refs.sumPax, cCount);
  const hasChildren = seatingElements.some(e => selectedSeatingIds.includes(e.parentId));
  const unlockBtn = refs.unlockBtn;
  const infoTxt = refs.selectionInfo;
  if (unlockBtn) unlockBtn.style.display = (selectedSeatingIds.length > 0 && hasChildren) ? 'block' : 'none';
  if (infoTxt) {
    if (selectedSeatingIds.length > 1) infoTxt.innerText = `${selectedSeatingIds.length} tables selected.`;
    else if (selectedSeatingIds.length === 1) infoTxt.innerText = 'Table selected.';
    else infoTxt.innerText = 'Shift+Drag to box select. Click+Drag empty space to pan. Right-click selected items to bulk delete. Select a table to unlock chairs.';
  }
  
  if (typeof updateGlobalResdAnalytics === 'function') updateGlobalResdAnalytics();
}

function startSeatingDrag(e, el) {
  if (seatingMode !== 'admin') return;
  if (!selectedSeatingIds.includes(el.id)) {
    selectedSeatingIds = [el.id];
    renderSeating();
  }
  draggingSeatingEl = el;
  isDraggingStateSaved = false;
  const canvas = getSeatingDomRefs().canvas;
  const CTM = canvas.getScreenCTM();
  seatingOffset.x = (e.clientX - CTM.e) / CTM.a - el.x;
  seatingOffset.y = (e.clientY - CTM.f) / CTM.d - el.y;
}

window.addEventListener('mousemove', (e) => {
  if (!draggingSeatingEl || seatingMode !== 'admin') return;
  const canvas = getSeatingDomRefs().canvas;
  if (!canvas) return;
  const CTM = canvas.getScreenCTM();
  const mx = (e.clientX - CTM.e) / CTM.a;
  const my = (e.clientY - CTM.f) / CTM.d;
  if (!isDraggingStateSaved) { saveSeatingHistoryState(); isDraggingStateSaved = true; }
  const dx = (mx - seatingOffset.x) - draggingSeatingEl.x;
  const dy = (my - seatingOffset.y) - draggingSeatingEl.y;
  
  selectedSeatingIds.forEach(sid => {
    const sEl = seatingElements.find(e => e.id === sid);
    if (sEl) {
      sEl.x += dx;
      sEl.y += dy;
      if (sEl.type.includes('table')) {
        seatingElements.forEach(child => { if (child.parentId === sEl.id) { child.x += dx; child.y += dy; } });
      }
    }
  });
  renderSeating();
});

window.addEventListener('mouseup', () => {
  if (!draggingSeatingEl) return;
  if (draggingSeatingEl.type === 'chair') {
    let closest = null, minDist = SEATING_SNAP_DIST;
    seatingElements.forEach(target => {
      if (target.type.includes('table')) {
        const d = Math.sqrt((draggingSeatingEl.x - target.x) ** 2 + (draggingSeatingEl.y - target.y) ** 2);
        if (d < minDist) { minDist = d; closest = target.id; }
      }
    });
    draggingSeatingEl.parentId = closest;
  }
  draggingSeatingEl = null;
  renderSeating();
});

async function saveSeatingLayout() {
  if (!activeResDetailId) {
    alert('Select a reservation first before saving seating layout.');
    return;
  }
  
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  const extra = getActiveReservationExtra();
  if (!res || !extra) return;

  const totalPax = res.pax || 0;
  const guests = extra.guests || [];
  const targetVipPax = guests.filter(g => g.role === 'VIP' && (g.name || '').trim().length > 0).length;

  let cCount = 0;
  let vipChairCount = 0;
  seatingElements.forEach(el => {
    if (el.type === 'chair') {
      cCount++;
      if (el.parentId) {
        const parent = seatingElements.find(p => p.id === el.parentId);
        if (parent && parent.isVip) vipChairCount++;
      }
    }
  });

  if (cCount < totalPax) {
    alert(`Validation Failed: You only have ${cCount} chairs on the layout, but the reservation requires ${totalPax} pax. Please add more chairs.`);
    return;
  }

  if (vipChairCount < targetVipPax) {
    alert(`Validation Failed: You only have ${vipChairCount} VIP chairs, but there are ${targetVipPax} VIP guests listed. Please set more tables as VIP.`);
    return;
  }

  extra.seatingElements = JSON.parse(JSON.stringify(seatingElements));
  
  try {
    const { doc, setDoc, updateDoc } = window.firebaseFns;
    
    // Save to dedicated layout collection
    await setDoc(doc(window.firebaseDB, 'layout', res.id), {
      resId: res.id,
      clientName: res.client || 'Unknown',
      eventDate: res.date || '',
      pax: res.pax || 0,
      seatingElements: extra.seatingElements,
      updatedAt: new Date().toISOString()
    });

    // Also update the reservation doc so existing logic doesn't break
    await updateDoc(doc(window.firebaseDB, 'reservations', res.id), {
      seatingLayout: extra.seatingElements
    });
    
    showToast('Venue seating layout saved to database.');
  } catch (err) {
    console.error('Error saving layout:', err);
    alert('Failed to save layout to database.');
  }
}

// Global exposure
window.addSeatingElement = addSeatingElement;
window.toggleSeatingMode = toggleSeatingMode;
window.unlockAttachedChairs = unlockAttachedChairs;
window.saveSeatingLayout = saveSeatingLayout;
window.filterRes = filterRes;
window.renderEIMTable = renderEIMTable;
window.renderRentalCards = renderRentalCards;

// QR Code function bindings
window.showEquipmentQR = showEquipmentQR;
window.closeQRModal = closeQRModal;
window.closeQRModalOutside = closeQRModalOutside;
window.downloadQR = downloadQR;
window.printQR = printQR;
window.generateFallbackQR = generateFallbackQR;

// ====================================================================
// ==================== EIM 3: AVAILABILITY & STATUS ==================
// ====================================================================

// ----- EQUIPMENT FLAGS DATA -----
const EQUIPMENT_FLAGS = [
  {
    id: 'FLAG-001', assetId: 'EQ-C001',
    assetName: 'Chafing Dish Full-Size 8qt (Stainless)',
    issue: 'Bent lid on unit #7 — does not seal properly, steam escapes.',
    flagType: 'damage', severity: 'Medium',
    reportedDate: '2026-04-11', reportedBy: 'Staff — Maria Santos',
    status: 'Flagged' // Flagged | Under Repair | Resolved
  },
  {
    id: 'FLAG-002', assetId: 'EQ-G001',
    assetName: 'Water Goblet 14oz (Crystal-Clear)',
    issue: '12 units found chipped after post-event dishwasher cycle. Unsafe for service.',
    flagType: 'damage', severity: 'High',
    reportedDate: '2026-04-10', reportedBy: 'Admin',
    status: 'Flagged'
  },
  {
    id: 'FLAG-003', assetId: 'EQ-C006',
    assetName: 'Sterno / Fuel Can (Case of 24)',
    issue: 'Only 3 cases left. Needs immediate resupply before the April 19 event.',
    flagType: 'resupply', severity: 'High',
    reportedDate: '2026-04-12', reportedBy: 'Admin',
    status: 'Flagged'
  }
];

// ----- ROUTINE CHECK DATA -----
const ROUTINE_CHECK_LOGS = [
  {
    id: 'CHK-001',
    date: '2026-04-06',
    checkedBy: 'Admin',
    totalItems: 44,
    issuesFound: 2,
    flagsCreated: 2,
    notes: '2 chipped wine glasses found. Chafing dish #3 has a loose handle — flagged for repair.',
    status: 'Completed'
  }
];

let lastRoutineCheckDate = '2026-04-06';
let activeRoutineCheck = null; // stores current in-progress check

// ----- HELPERS -----
function daysSinceLastCheck() {
  if (!lastRoutineCheckDate) return 9999;
  const diff = Date.now() - new Date(lastRoutineCheckDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
function isRoutineCheckOverdue() { return daysSinceLastCheck() >= 7; }

function getAssetAvailStatus(asset) {
  const hasFlag = EQUIPMENT_FLAGS.find(f => f.assetId === asset.id && f.status !== 'Resolved');
  if (hasFlag) return { label: 'Flagged', cls: 'critical', icon: '' };
  switch (asset.status) {
    case 'Active': return { label: 'Available', cls: 'confirmed', icon: '' };
    case 'In Use': return { label: 'Deployed', cls: 'pending', icon: '' };
    case 'Under Repair': return { label: 'Under Repair', cls: 'critical', icon: '' };
    case 'Retired': return { label: 'Retired', cls: 'cancelled', icon: '' };
    default: return { label: asset.status, cls: 'pending', icon: '' };
  }
}

// ----- DASHBOARD ALERT BANNER -----
function updateRoutineAlertBanner() {
  const alertEl = document.getElementById('dash-routine-alert');
  const badge = document.getElementById('routine-sidebar-badge');
  if (!alertEl) return;
  const overdue = isRoutineCheckOverdue();
  alertEl.style.display = overdue ? 'block' : 'none';
  if (badge) badge.style.display = overdue ? 'inline-flex' : 'none';
  if (overdue) {
    const days = daysSinceLastCheck();
    const sub = document.getElementById('routine-alert-sub');
    if (sub) sub.textContent =
      `Last inspection was ${days} day${days !== 1 ? 's' : ''} ago — weekly check required. Click here to begin. →`;
  }
}

// ----- RENDER AVAILABILITY SECTION -----
function renderAvailabilitySection() {
  // Stats
  const avail = EIM_ASSETS.filter(a => {
    const fl = EQUIPMENT_FLAGS.find(f => f.assetId === a.id && f.status !== 'Resolved');
    return !fl && a.status === 'Active';
  }).length;
  const inUse = EIM_ASSETS.filter(a => a.status === 'In Use').length;
  const repair = EIM_ASSETS.filter(a => a.status === 'Under Repair').length;
  const flags = EQUIPMENT_FLAGS.filter(f => f.status !== 'Resolved').length;

  const s = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  s('avail-stat-avail', avail);
  s('avail-stat-inuse', inUse);
  s('avail-stat-repair', repair);
  s('avail-stat-flags', flags);

  // Flags panel
  const flagsEl = document.getElementById('avail-flags-container');
  if (flagsEl) {
    const active = EQUIPMENT_FLAGS.filter(f => f.status !== 'Resolved');
    if (!active.length) {
      flagsEl.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-dim); font-size:13px;">No active flags. All equipment accounted for. ✓</div>`;
    } else {
      const sevColors = { High: 'var(--red)', Medium: 'var(--amber)', Low: 'var(--gold)' };
      flagsEl.innerHTML = active.map((f, i) => `
        <div style="display:flex; align-items:flex-start; gap:14px; padding:14px 20px; border-bottom:1px solid var(--border);">
          <div style="width:8px; height:8px; border-radius:50%; background:${sevColors[f.severity] || 'var(--gold)'}; margin-top:5px; flex-shrink:0;"></div>
          <div style="flex:1; min-width:0;">
            <div style="font-size:13px; font-weight:700; color:var(--cream); margin-bottom:2px;">${f.assetName}</div>
            <div style="font-size:12px; color:var(--text); margin-bottom:4px;">${f.issue}</div>
            <div style="font-size:11px; color:var(--text-dim);">
              Reported ${f.reportedDate} by ${f.reportedBy} ·
              <span style="color:${sevColors[f.severity]}">${f.severity} severity</span> ·
              <code style="font-size:10px; background:rgba(255,255,255,0.05); padding:1px 5px; border-radius:4px;">${f.id}</code>
            </div>
          </div>
          <div style="display:flex; gap:6px; flex-shrink:0;">
            <button class="btn-view" style="font-size:11px;" onclick="updateFlagStatus(${EQUIPMENT_FLAGS.indexOf(f)}, 'Under Repair')">Mark Repairing</button>
            <button class="btn-approve" style="font-size:11px;" onclick="updateFlagStatus(${EQUIPMENT_FLAGS.indexOf(f)}, 'Resolved')">✓ Resolve</button>
          </div>
        </div>`).join('');
    }
  }

  // Availability table
  const q = (document.getElementById('avail-search') || {}).value || '';
  const filtered = EIM_ASSETS.filter(a => {
    if (!q) return true;
    const ql = q.toLowerCase();
    return a.name.toLowerCase().includes(ql) || a.id.toLowerCase().includes(ql) || a.category.toLowerCase().includes(ql);
  });

  const tbody = document.getElementById('avail-tbody');
  if (!tbody) return;
  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-dim);">No items found.</td></tr>`;
    return;
  }

  const condColors = { Excellent: 'var(--green)', Good: 'var(--gold)', Fair: 'var(--amber)', Poor: 'var(--red)' };

  tbody.innerHTML = filtered.map(a => {
    const idx = EIM_ASSETS.indexOf(a);
    const avs = getAssetAvailStatus(a);
    return `
      <tr>
        <td><code style="font-size:11px; color:var(--gold); background:rgba(196,154,60,0.08); padding:2px 6px; border-radius:4px;">${a.id}</code></td>
        <td>
          <div class="item-name">${a.name}</div>
          <div class="item-cat">${a.type}</div>
        </td>
        <td><span class="badge pending" style="font-size:10px;">${a.category}</span></td>
        <td style="font-size:13px;font-weight:600;">${a.quantity} <span style="color:var(--text-dim);font-size:11px;">${a.unitType}</span></td>
        <td>
          <select class="avail-status-select" onchange="quickUpdateAssetStatus(${idx}, this.value)"
            style="background:transparent; border:1px solid var(--border); border-radius:6px; color:var(--text); padding:4px 8px; font-size:12px; font-family:'DM Sans',sans-serif; cursor:pointer;">
            <option value="Active"      ${a.status === 'Active' ? 'selected' : ''}> Available</option>
            <option value="In Use"      ${a.status === 'In Use' ? 'selected' : ''}> In Use</option>
            <option value="Under Repair"${a.status === 'Under Repair' ? 'selected' : ''}> Under Repair</option>
            <option value="Retired"     ${a.status === 'Retired' ? 'selected' : ''}> Retired</option>
          </select>
          ${avs.label === 'Flagged' ? `<div style="font-size:10px;color:var(--red);margin-top:3px;"> Flagged</div>` : ''}
        </td>
        <td><span style="font-size:12px;font-weight:600;color:${condColors[a.condition] || 'var(--text)'};">● ${a.condition}</span></td>
        <td style="text-align:right;">
          <button class="btn-view" style="font-size:11px;" onclick="openFlagModalFor('${a.id}')"> Flag</button>
        </td>
      </tr>`;
  }).join('');
}

function quickUpdateAssetStatus(idx, newStatus) {
  if (!EIM_ASSETS[idx]) return;
  EIM_ASSETS[idx].status = newStatus;
  renderAvailabilitySection();
  renderEIMStats();
  updateRoutineAlertBanner();
}
window.quickUpdateAssetStatus = quickUpdateAssetStatus;

function updateFlagStatus(idx, newStatus) {
  if (!EQUIPMENT_FLAGS[idx]) return;
  EQUIPMENT_FLAGS[idx].status = newStatus;
  renderAvailabilitySection();
  updateRoutineAlertBanner();
}
window.updateFlagStatus = updateFlagStatus;
window.renderAvailabilitySection = renderAvailabilitySection;

// ----- FLAG MODAL -----
function populateFlagSelect(preselect) {
  const sel = document.getElementById('flag-asset-select');
  if (!sel) return;
  sel.innerHTML = `<option value="">Select equipment...</option>` +
    EIM_ASSETS.map(a => `<option value="${a.id}" ${a.id === preselect ? 'selected' : ''}>${a.id} — ${a.name}</option>`).join('');
}

function openFlagModal() {
  populateFlagSelect(null);
  document.getElementById('flag-description').value = '';
  document.getElementById('flag-reporter').value = '';
  document.getElementById('flag-type').value = 'damage';
  document.getElementById('flag-severity').value = 'Medium';
  document.getElementById('flag-overlay').classList.add('on');
  document.getElementById('flag-modal').classList.add('open');
}

function openFlagModalFor(assetId) {
  openFlagModal();
  populateFlagSelect(assetId);
}

function closeFlagModal() {
  document.getElementById('flag-overlay').classList.remove('on');
  document.getElementById('flag-modal').classList.remove('open');
}

function submitFlag() {
  const assetId = document.getElementById('flag-asset-select').value;
  const desc = document.getElementById('flag-description').value.trim();
  const reporter = document.getElementById('flag-reporter').value.trim();
  if (!assetId || !desc) { alert('Please select an asset and describe the issue.'); return; }
  const asset = EIM_ASSETS.find(a => a.id === assetId);
  const newFlag = {
    id: 'FLAG-' + String(EQUIPMENT_FLAGS.length + 1).padStart(3, '0'),
    assetId,
    assetName: asset ? asset.name : assetId,
    issue: desc,
    flagType: document.getElementById('flag-type').value,
    severity: document.getElementById('flag-severity').value,
    reportedDate: new Date().toISOString().split('T')[0],
    reportedBy: reporter || 'Admin',
    status: 'Flagged'
  };
  EQUIPMENT_FLAGS.push(newFlag);
  closeFlagModal();
  renderAvailabilitySection();
  updateRoutineAlertBanner();
  // TODO: persist to Firestore: addDoc(collection(db, 'equipment_flags'), newFlag)
}

window.openFlagModal = openFlagModal;
window.openFlagModalFor = openFlagModalFor;
window.closeFlagModal = closeFlagModal;
window.submitFlag = submitFlag;

// ====================================================================
// ==================== EIM 3.5: ROUTINE CHECKS =======================
// ====================================================================

function renderRoutineCheckSection() {
  const days = lastRoutineCheckDate ? daysSinceLastCheck() : null;
  const overdue = isRoutineCheckOverdue();

  const lastDateEl = document.getElementById('routine-last-date');
  const daysSinceEl = document.getElementById('routine-days-since');
  const badgeEl = document.getElementById('routine-due-badge');
  const itemCountEl = document.getElementById('routine-item-count');

  if (lastDateEl) lastDateEl.textContent = lastRoutineCheckDate
    ? new Date(lastRoutineCheckDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })
    : 'Never';

  if (daysSinceEl) {
    daysSinceEl.textContent = days !== null ? days : '—';
    daysSinceEl.style.color = overdue ? 'var(--red)' : 'var(--green)';
  }

  if (badgeEl) {
    badgeEl.innerHTML = overdue
      ? `<span class="badge critical" style="font-size:12px; padding:5px 14px;"> OVERDUE</span>`
      : `<span class="badge confirmed" style="font-size:12px; padding:5px 14px;">✓ On Schedule</span>`;
  }

  if (itemCountEl) {
    const trackedRentals = RENTED_EQUIPMENT.filter(function (r) { return r.trackingType === 'rental' || r.reservationId || r.forEvent; }).length;
    itemCountEl.textContent = EIM_ASSETS.length + trackedRentals;
  }

  // Show/hide active checklist container
  const container = document.getElementById('routine-checklist-container');
  if (container) container.style.display = activeRoutineCheck ? 'block' : 'none';

  // Start button label
  const startBtn = document.getElementById('btn-start-check');
  if (startBtn) startBtn.textContent = activeRoutineCheck ? '↻ Reset Check' : '+ Start New Check';

  renderRoutineHistory();
  if (activeRoutineCheck) renderActiveChecklist();
}

function renderRoutineHistory() {
  const container = document.getElementById('routine-history-container');
  if (!container) return;
  if (!ROUTINE_CHECK_LOGS.length) {
    container.innerHTML = `<div style="text-align:center; padding:24px; color:var(--text-dim); font-size:13px;">No inspection history yet.</div>`;
    return;
  }
  const sorted = [...ROUTINE_CHECK_LOGS].reverse();
  container.innerHTML = sorted.map(log => {
    const dateStr = new Date(log.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return `
      <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px; padding:16px 22px; border-bottom:1px solid var(--border);">
        <div>
          <div style="font-size:13px; font-weight:700; color:var(--cream);">${log.id} <span style="color:var(--text-dim); font-weight:400; font-size:12px;">— ${dateStr}</span></div>
          <div style="font-size:12px; color:var(--text-mid); margin-top:3px;">Checked by: ${log.checkedBy} · ${log.totalItems} items · ${log.issuesFound} issue${log.issuesFound !== 1 ? 's' : ''} found · ${log.flagsCreated} flag${log.flagsCreated !== 1 ? 's' : ''} created</div>
          ${log.notes ? `<div style="font-size:11px; color:var(--text-dim); margin-top:4px; font-style:italic;">"${log.notes}"</div>` : ''}
        </div>
        <span class="badge confirmed">✓ Completed</span>
      </div>`;
  }).join('');
}

function startNewRoutineCheck() {
  var rentalChecklistItems = RENTED_EQUIPMENT
    .filter(function (r) { return r.trackingType === 'rental' || r.reservationId || r.forEvent; })
    .map(function (r, i) {
      return {
        idx: EIM_ASSETS.length + i,
        assetId: r.id,
        assetName: r.name,
        category: (r.category || r.type || 'Rented') + ' (Rental)',
        quantity: r.quantity || 1,
        unitType: r.unitType || 'pcs',
        expectedCondition: r.condition || 'Good',
        foundCondition: 'OK',
        checked: false,
        notes: ''
      };
    });
  activeRoutineCheck = {
    id: 'CHK-' + String(ROUTINE_CHECK_LOGS.length + 1).padStart(3, '0'),
    date: new Date().toISOString().split('T')[0],
    checkedBy: 'Admin',
    items: EIM_ASSETS.map((a, i) => ({
      idx: i,
      assetId: a.id,
      assetName: a.name,
      category: a.category,
      quantity: a.quantity,
      unitType: a.unitType,
      expectedCondition: a.condition,
      foundCondition: 'OK',
      checked: false,
      notes: ''
    })).concat(rentalChecklistItems)
  };
  renderRoutineCheckSection();
  document.getElementById('routine-checklist-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderActiveChecklist() {
  const container = document.getElementById('routine-checklist-items');
  if (!container || !activeRoutineCheck) return;

  const checked = activeRoutineCheck.items.filter(i => i.checked).length;
  const total = activeRoutineCheck.items.length;
  const progEl = document.getElementById('routine-check-progress');
  if (progEl) progEl.textContent = `${checked} / ${total} items marked`;

  const condColors = { OK: 'var(--green)', 'Minor Issue': 'var(--amber)', Damaged: 'var(--red)', Missing: 'var(--red)' };

  container.innerHTML = activeRoutineCheck.items.map((item, i) => `
    <div class="ri-row ${item.checked ? 'ri-checked' : ''}" id="ri-row-${i}">
      <label class="ri-chk-wrap">
        <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleRICheck(${i})" />
        <span class="ri-chk-box"></span>
      </label>
      <div class="ri-info">
        <code style="font-size:10px; color:var(--gold); background:rgba(196,154,60,0.08); padding:1px 6px; border-radius:4px;">${item.assetId}</code>
        <div style="font-size:13px; font-weight:600; color:var(--cream); margin-top:2px;">${item.assetName}</div>
        <div style="font-size:11px; color:var(--text-dim);">${item.category} · ${item.quantity} ${item.unitType} · Expected: ${item.expectedCondition}</div>
      </div>
      <div class="ri-controls">
        <select class="input-field ri-cond" id="ri-cond-${i}" onchange="updateRICondition(${i}, this.value)"
          style="width:140px; font-size:12px; padding:6px 10px; ${item.foundCondition !== 'OK' ? 'border-color:var(--amber);' : ''}">
          <option value="OK"           ${item.foundCondition === 'OK' ? 'selected' : ''}> OK</option>
          <option value="Minor Issue"  ${item.foundCondition === 'Minor Issue' ? 'selected' : ''}>️ Minor Issue</option>
          <option value="Damaged"      ${item.foundCondition === 'Damaged' ? 'selected' : ''}> Damaged</option>
          <option value="Missing"      ${item.foundCondition === 'Missing' ? 'selected' : ''}> Missing Units</option>
        </select>
        <input type="text" class="input-field ri-note" id="ri-note-${i}" onchange="updateRINotes(${i}, this.value)"
          placeholder="Notes..." style="flex:1; font-size:12px; padding:6px 10px;" value="${item.notes}" />
      </div>
    </div>`).join('');
}

function toggleRICheck(i) {
  if (!activeRoutineCheck) return;
  activeRoutineCheck.items[i].checked = !activeRoutineCheck.items[i].checked;
  if (activeRoutineCheck.items[i].checked) {
    document.getElementById('ri-row-' + i)?.classList.add('ri-checked');
  } else {
    document.getElementById('ri-row-' + i)?.classList.remove('ri-checked');
  }
  const checked = activeRoutineCheck.items.filter(x => x.checked).length;
  const progEl = document.getElementById('routine-check-progress');
  if (progEl) progEl.textContent = `${checked} / ${activeRoutineCheck.items.length} items marked`;
}

function updateRICondition(i, val) {
  if (!activeRoutineCheck) return;
  activeRoutineCheck.items[i].foundCondition = val;
  activeRoutineCheck.items[i].checked = true;
  document.getElementById('ri-row-' + i)?.classList.add('ri-checked');
  const checked = activeRoutineCheck.items.filter(x => x.checked).length;
  const progEl = document.getElementById('routine-check-progress');
  if (progEl) progEl.textContent = `${checked} / ${activeRoutineCheck.items.length} items marked`;
}

function updateRINotes(i, val) {
  if (!activeRoutineCheck) return;
  activeRoutineCheck.items[i].notes = val;
}

function cancelRoutineCheck() {
  if (!confirm('Cancel this inspection? All progress will be lost.')) return;
  activeRoutineCheck = null;
  renderRoutineCheckSection();
}

function submitRoutineCheck() {
  if (!activeRoutineCheck) return;
  const unchecked = activeRoutineCheck.items.filter(i => !i.checked).length;
  if (unchecked > 0) {
    if (!confirm(`${unchecked} item${unchecked > 1 ? 's' : ''} not yet marked. Submit anyway?`)) return;
  }

  // Auto-create flags for damaged/missing items
  let flagsCreated = 0;
  let issuesFound = 0;
  activeRoutineCheck.items.forEach(item => {
    if (item.foundCondition === 'Damaged' || item.foundCondition === 'Missing') {
      issuesFound++;
      // Check not already flagged
      const alreadyFlagged = EQUIPMENT_FLAGS.find(f => f.assetId === item.assetId && f.status === 'Flagged');
      if (!alreadyFlagged) {
        EQUIPMENT_FLAGS.push({
          id: 'FLAG-' + String(EQUIPMENT_FLAGS.length + 1).padStart(3, '0'),
          assetId: item.assetId,
          assetName: item.assetName,
          issue: `Routine check (${activeRoutineCheck.id}): ${item.foundCondition}${item.notes ? ' — ' + item.notes : ''}`,
          flagType: item.foundCondition === 'Missing' ? 'missing' : 'damage',
          severity: 'High',
          reportedDate: activeRoutineCheck.date,
          reportedBy: activeRoutineCheck.checkedBy + ' (Routine Check)',
          status: 'Flagged'
        });
        flagsCreated++;
      }
      // Update asset condition if Damaged
      if (item.foundCondition === 'Damaged' && EIM_ASSETS[item.idx]) {
        EIM_ASSETS[item.idx].condition = 'Poor';
        EIM_ASSETS[item.idx].status = 'Under Repair';
      }
    } else if (item.foundCondition === 'Minor Issue' && EIM_ASSETS[item.idx]) {
      if (EIM_ASSETS[item.idx].condition === 'Excellent') EIM_ASSETS[item.idx].condition = 'Good';
      issuesFound++;
    }
  });

  // Log the check
  const notes = document.getElementById('routine-overall-notes')?.value?.trim() || '';
  const logEntry = {
    id: activeRoutineCheck.id,
    date: activeRoutineCheck.date,
    checkedBy: activeRoutineCheck.checkedBy,
    totalItems: activeRoutineCheck.items.length,
    issuesFound,
    flagsCreated,
    notes: notes || (flagsCreated > 0 ? `${flagsCreated} flag${flagsCreated > 1 ? 's' : ''} auto-created.` : 'No issues found.'),
    status: 'Completed'
  };
  ROUTINE_CHECK_LOGS.push(logEntry);
  lastRoutineCheckDate = activeRoutineCheck.date;
  activeRoutineCheck = null;

  updateRoutineAlertBanner();
  renderEIMStats();
  renderRoutineCheckSection();

  if (flagsCreated > 0) {
    alert(` Routine check submitted!\n\n${flagsCreated} new issue flag${flagsCreated > 1 ? 's' : ''} were created. Check "Availability & Status" for details.`);
  } else {
    alert(` Routine check completed — no critical issues found.`);
  }
  // TODO: persist to Firestore: addDoc(collection(db, 'routine_checks'), logEntry)
}

function forceRoutineCheck() {
  showSection('routine-check', document.getElementById('nav-routine-check'));
  setTimeout(() => {
    if (!activeRoutineCheck) startNewRoutineCheck();
    document.getElementById('routine-checklist-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);
}

window.startNewRoutineCheck = startNewRoutineCheck;
window.cancelRoutineCheck = cancelRoutineCheck;
window.submitRoutineCheck = submitRoutineCheck;
window.forceRoutineCheck = forceRoutineCheck;
window.toggleRICheck = toggleRICheck;
window.updateRICondition = updateRICondition;
window.updateRINotes = updateRINotes;
window.renderRoutineCheckSection = renderRoutineCheckSection;
window.updateRoutineAlertBanner = updateRoutineAlertBanner;

// ====================================================================
// ==================== EIM 4: EVENT-BASED ALLOCATION =================
// ====================================================================

// Each rule defines how much of an asset is needed for one event.
// ruleType: 'per_pax' | 'per_table' | 'flat'
// ratio: multiplier. isFragile: true = higher buffer (plates/glasses)
// venueDeductField: DOM id whose integer value is deducted from requirement

const ALLOC_RULES = [
  // Furniture
  { assetId: 'EQ-F001', name: 'Round Banquet Table 5ft', category: 'Furniture', isFragile: false, ruleType: 'per_pax', ratio: 0.125, venueDeductField: 'venue-tables', note: '1 per 8 pax' },
  { assetId: 'EQ-F002', name: 'Rectangular Banquet Table 6ft', category: 'Furniture', isFragile: false, ruleType: 'flat', ratio: 4, venueDeductField: null, note: '4 for buffet/serving lines' },
  { assetId: 'EQ-F003', name: 'Tiffany Crossback Chair (White)', category: 'Furniture', isFragile: false, ruleType: 'per_pax', ratio: 1.0, venueDeductField: 'venue-chairs', note: '1 per pax' },
  { assetId: 'EQ-F004', name: 'Monoblock Chair (White)', category: 'Furniture', isFragile: false, ruleType: 'flat', ratio: 10, venueDeductField: null, note: '10 spare/staff chairs' },
  { assetId: 'EQ-F005', name: 'Cocktail High Table', category: 'Furniture', isFragile: false, ruleType: 'flat', ratio: 4, venueDeductField: null, note: '4 cocktail-hour tables' },
  { assetId: 'EQ-F006', name: 'Banquet Server Trolley 3-Tier', category: 'Furniture', isFragile: false, ruleType: 'flat', ratio: 2, venueDeductField: null, note: '2 for service logistics' },
  { assetId: 'EQ-F007', name: 'Folding Service Table 4ft', category: 'Furniture', isFragile: false, ruleType: 'flat', ratio: 3, venueDeductField: null, note: '3 for bar/cake/carving' },
  // Tableware
  { assetId: 'EQ-T001', name: 'Dinner Plate 10.5"', category: 'Tableware', isFragile: true, ruleType: 'per_pax', ratio: 1.0, venueDeductField: 'venue-plates', note: '1 per pax' },
  { assetId: 'EQ-T002', name: 'Salad / Dessert Plate 7"', category: 'Tableware', isFragile: true, ruleType: 'per_pax', ratio: 1.0, venueDeductField: null, note: '1 per pax' },
  { assetId: 'EQ-T003', name: 'Soup Bowl 16oz', category: 'Tableware', isFragile: true, ruleType: 'per_pax', ratio: 1.0, venueDeductField: null, note: '1 per pax' },
  { assetId: 'EQ-T004', name: 'Dinner Fork', category: 'Tableware', isFragile: false, ruleType: 'per_pax', ratio: 1.0, venueDeductField: 'venue-forks', note: '1 per pax' },
  { assetId: 'EQ-T005', name: 'Dinner Knife', category: 'Tableware', isFragile: false, ruleType: 'per_pax', ratio: 1.0, venueDeductField: 'venue-knives', note: '1 per pax' },
  { assetId: 'EQ-T006', name: 'Dinner Spoon', category: 'Tableware', isFragile: false, ruleType: 'per_pax', ratio: 1.0, venueDeductField: 'venue-spoons', note: '1 per pax' },
  { assetId: 'EQ-T007', name: 'Soup Spoon', category: 'Tableware', isFragile: false, ruleType: 'per_pax', ratio: 1.0, venueDeductField: 'venue-spoons', note: '1 per pax' },
  { assetId: 'EQ-T008', name: 'Teaspoon', category: 'Tableware', isFragile: false, ruleType: 'per_pax', ratio: 1.0, venueDeductField: null, note: '1 per pax' },
  { assetId: 'EQ-T009', name: 'Serving Platter Oval 18"', category: 'Tableware', isFragile: false, ruleType: 'per_table', ratio: 1.5, venueDeductField: null, note: '~1.5 per table' },
  { assetId: 'EQ-T010', name: 'Serving Tong 12"', category: 'Tableware', isFragile: false, ruleType: 'flat', ratio: 8, venueDeductField: null, note: '8 for buffet line' },
  { assetId: 'EQ-T011', name: 'Bread Basket (Wicker)', category: 'Tableware', isFragile: false, ruleType: 'per_table', ratio: 1.0, venueDeductField: null, note: '1 per table' },
  { assetId: 'EQ-T012', name: 'Sauce / Gravy Ladle', category: 'Tableware', isFragile: false, ruleType: 'flat', ratio: 6, venueDeductField: null, note: '6 for sauces/gravies' },
  // Glassware
  { assetId: 'EQ-G001', name: 'Water Goblet 14oz', category: 'Glassware', isFragile: true, ruleType: 'per_pax', ratio: 1.0, venueDeductField: 'venue-glasses', note: '1 per pax' },
  { assetId: 'EQ-G002', name: 'Red Wine Glass 15oz', category: 'Glassware', isFragile: true, ruleType: 'per_pax', ratio: 0.5, venueDeductField: null, note: '1 per 2 pax' },
  { assetId: 'EQ-G003', name: 'Champagne Flute 7oz', category: 'Glassware', isFragile: true, ruleType: 'per_pax', ratio: 1.0, venueDeductField: null, note: '1 per pax (toasting)' },
  { assetId: 'EQ-G004', name: 'Juice / Rocks Glass 10oz', category: 'Glassware', isFragile: true, ruleType: 'per_pax', ratio: 1.0, venueDeductField: null, note: '1 per pax' },
  { assetId: 'EQ-G005', name: 'Shot / Cordial Glass 2oz', category: 'Glassware', isFragile: true, ruleType: 'per_pax', ratio: 0.5, venueDeductField: null, note: '1 per 2 pax' },
  // Linens
  { assetId: 'EQ-L001', name: 'Round Tablecloth 120" (White)', category: 'Linens', isFragile: false, ruleType: 'per_table', ratio: 1.0, venueDeductField: null, note: '1 per round table' },
  { assetId: 'EQ-L003', name: 'Rect Tablecloth 90"x132"', category: 'Linens', isFragile: false, ruleType: 'flat', ratio: 4, venueDeductField: null, note: '4 for buffet/serving tables' },
  { assetId: 'EQ-L004', name: 'Cloth Napkin 20"x20"', category: 'Linens', isFragile: false, ruleType: 'per_pax', ratio: 1.0, venueDeductField: null, note: '1 per pax' },
  { assetId: 'EQ-L005', name: 'Chair Sash - Satin Gold', category: 'Linens', isFragile: false, ruleType: 'per_pax', ratio: 1.0, venueDeductField: null, note: '1 per chair' },
  { assetId: 'EQ-L007', name: 'Table Runner - Satin Gold', category: 'Linens', isFragile: false, ruleType: 'per_table', ratio: 1.0, venueDeductField: null, note: '1 per round table' },
  { assetId: 'EQ-L008', name: 'Buffet Skirt 17ft', category: 'Linens', isFragile: false, ruleType: 'flat', ratio: 2, venueDeductField: null, note: '2 for buffet tables' },
  // Catering Equipment
  { assetId: 'EQ-C001', name: 'Chafing Dish Full-Size 8qt', category: 'Catering Equipment', isFragile: false, ruleType: 'flat', ratio: 8, venueDeductField: 'venue-chafing', note: '8 stations per buffet' },
  { assetId: 'EQ-C002', name: 'Beverage Dispenser 3-Gallon', category: 'Catering Equipment', isFragile: false, ruleType: 'per_pax', ratio: 0.04, venueDeductField: 'venue-dispensers', note: '1 per 25 pax' },
  { assetId: 'EQ-C003', name: 'Portable Buffet Line 6-Station', category: 'Catering Equipment', isFragile: false, ruleType: 'flat', ratio: 1, venueDeductField: null, note: '1 set per event' },
  { assetId: 'EQ-C004', name: 'Ice Bucket 4L Stainless', category: 'Catering Equipment', isFragile: false, ruleType: 'per_pax', ratio: 0.1, venueDeductField: null, note: '1 per 10 pax' },
  { assetId: 'EQ-C005', name: 'Coffee Urn 30-Cup Electric', category: 'Catering Equipment', isFragile: false, ruleType: 'flat', ratio: 2, venueDeductField: null, note: '2 urns per event' },
  { assetId: 'EQ-C006', name: 'Sterno / Fuel Can', category: 'Catering Equipment', isFragile: false, ruleType: 'flat', ratio: 6, venueDeductField: null, note: '2 per chafing x 3 backup packs' },
  { assetId: 'EQ-C007', name: 'Carving Station Board', category: 'Catering Equipment', isFragile: false, ruleType: 'flat', ratio: 1, venueDeductField: null, note: '1 carving station' },
  // AV & Lighting
  { assetId: 'EQ-A001', name: 'LED Uplight RGB (Battery)', category: 'AV & Lighting', isFragile: false, ruleType: 'flat', ratio: 8, venueDeductField: null, note: '8 uplights per event' },
  { assetId: 'EQ-A002', name: 'Powered Speaker 10"', category: 'AV & Lighting', isFragile: false, ruleType: 'flat', ratio: 2, venueDeductField: null, note: '2 speakers per event' },
  { assetId: 'EQ-A003', name: 'Wireless Microphone Set', category: 'AV & Lighting', isFragile: false, ruleType: 'flat', ratio: 1, venueDeductField: null, note: '1 mic set per event' },
  { assetId: 'EQ-A005', name: 'Table Number Holder Set (1-30)', category: 'AV & Lighting', isFragile: false, ruleType: 'per_table', ratio: 0.033, venueDeductField: null, note: '1 set covers 30 tables' },
];

// State
// =====================================================================
// EQUIPMENT CYCLE - GLOBAL STATE & DROPDOWN
// =====================================================================
let currentEqcReservationId = null;
let currentAllocEvent = null;

window.onEqcReservationChange = function() {
  const sel = document.getElementById('eqc-reservation-select');
  currentEqcReservationId = sel ? sel.value : null;

  // Re-render the active eq-cycle tab
  const activeTab = document.querySelector('.eq-cycle-tab.active');
  if (activeTab) {
    if (activeTab.id === 'eqc-tab-allocation' && typeof renderAllocationSection === 'function') renderAllocationSection();
    if (activeTab.id === 'eqc-tab-scheduling' && typeof renderSchedulingSection === 'function') renderSchedulingSection();
    if (activeTab.id === 'eqc-tab-lifecycle' && typeof renderLifecycleSection === 'function') renderLifecycleSection();
    if (activeTab.id === 'eqc-tab-issues' && typeof renderEquipIssues === 'function') renderEquipIssues();
    if (activeTab.id === 'eqc-tab-rentals' && typeof renderRentalCards === 'function') {
      if(typeof renderRentalNeeds === 'function') renderRentalNeeds();
      renderRentalCards();
    }
  }
};

window.populateEqcDropdown = function() {
  const sel = document.getElementById('eqc-reservation-select');
  if (!sel) return;
  const confirmed = RESERVATIONS.filter(r => r.status === 'confirmed');
  
  sel.innerHTML = '<option value="">Choose a confirmed reservation...</option>' + 
    confirmed.map(r => `<option value="${r.id}">${r.client} — ${r.date} (${r.pax} pax)</option>`).join('');
    
  if (currentEqcReservationId && confirmed.find(r => r.id === currentEqcReservationId)) {
    sel.value = currentEqcReservationId;
  } else {
    currentEqcReservationId = null;
    sel.value = "";
  }
};

// Populate dropdown & restore state
function renderAllocationSection() {
  if (typeof populateEqcDropdown === 'function') populateEqcDropdown();
  
  if (currentEqcReservationId) {
    const still = RESERVATIONS.find(r => r.id === currentEqcReservationId);
    if (still) { 
      currentAllocEvent = still; 
      _showEquipmentNeededList(still); 
      _hideAllocResults();
      // Reset venue fields to 0 first, then auto-fill from Firestore if a saved EN record exists
      ['venue-tables', 'venue-chairs', 'venue-chafing', 'venue-dispensers',
        'venue-plates', 'venue-forks', 'venue-spoons', 'venue-knives', 'venue-glasses'].forEach(id => {
          const el = document.getElementById(id); if (el) el.value = 0;
        });
      const otherEl = document.getElementById('venue-other'); if (otherEl) otherEl.value = '';
      const si = document.getElementById('venue-save-status'); if (si) si.style.display = 'none';
      const ai = document.getElementById('venue-autofill-status'); if (ai) { ai.textContent = ''; ai.style.display = 'none'; }
      loadENRecord(still.id);
    } else { 
      currentAllocEvent = null; 
      _hideAllocResults(); 
      _clearEquipmentNeededList();
    }
  } else { 
    currentAllocEvent = null; 
    _hideAllocResults(); 
    _clearEquipmentNeededList();
  }
}

function _showEquipmentNeededList(ev) {
  const container = document.getElementById('alloc-equipment-needed-list');
  if (!container) return;

  const pax = parseInt(ev.pax) || 0;
  const tablesNeeded = Math.ceil(pax / 8);

  const needed = [];
  ALLOC_RULES.forEach(rule => {
    let exact = 0;
    if (rule.ruleType === 'per_pax') exact = pax * rule.ratio;
    else if (rule.ruleType === 'per_table') exact = tablesNeeded * rule.ratio;
    else if (rule.ruleType === 'flat') exact = rule.ratio;
    exact = Math.ceil(exact);

    if (exact > 0) {
      const asset = EIM_ASSETS.find(a => a.id === rule.assetId);
      needed.push({
        name: asset ? asset.name : rule.assetId,
        qty: exact
      });
    }
  });

  if (needed.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-dim); font-size:12px;">No equipment mapped for this event type.</div>';
    return;
  }

  container.innerHTML = needed.map(item => `
    <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:8px;">
      <div style="font-size:12px; font-weight:600; color:var(--cream);">${escHtml(item.name)}</div>
      <div style="font-size:14px; font-weight:800; color:var(--gold);">${item.qty}</div>
    </div>
  `).join('');
}

function _clearEquipmentNeededList() {
  const container = document.getElementById('alloc-equipment-needed-list');
  if (container) {
    container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-dim); font-size:12px;">Select an active reservation from the top dropdown to view required equipment.</div>';
  }
}

function _hideAllocResults() {
  ['alloc-manifest-panel', 'alloc-shortage-panel', 'alloc-status-banner'].forEach(id => {
    const el = document.getElementById(id); if (el) el.style.display = 'none';
  });
  const empty = document.getElementById('alloc-empty-state');
  if (empty) empty.style.display = currentAllocEvent ? 'none' : 'block';
}

// Main engine — compute and render manifest
function generateAllocationManifest() {
  if (!currentAllocEvent) { alert('Please select an event first.'); return; }
  const ev = currentAllocEvent;
  const pax = parseInt(ev.pax) || 0;

  // Read venue deduction inputs (9 categories)
  const gv = id => Math.max(0, parseInt((document.getElementById(id) || {}).value || '0') || 0);
  const vdMap = {
    'venue-tables': gv('venue-tables'),
    'venue-chairs': gv('venue-chairs'),
    'venue-chafing': gv('venue-chafing'),
    'venue-dispensers': gv('venue-dispensers'),
    'venue-plates': gv('venue-plates'),
    'venue-forks': gv('venue-forks'),
    'venue-spoons': gv('venue-spoons'),
    'venue-knives': gv('venue-knives'),
    'venue-glasses': gv('venue-glasses'),
  };

  // Customer Provided Equipment Map
  const cpe = ev.customerProvidedEquip || {};
  const cpeMap = {
    'venue-tables': cpe.tables || 0,
    'venue-chairs': cpe.chairs || 0,
    'venue-chafing': cpe.chafing || 0,
    'venue-dispensers': cpe.dispensers || 0,
    'venue-plates': cpe.plates || 0,
    'venue-forks': cpe.forks || 0,
    'venue-spoons': cpe.spoons || 0,
    'venue-knives': cpe.knives || 0,
    'venue-glasses': cpe.glasses || 0,
  };

  // Buffer rates
  const bufF = (parseFloat((document.getElementById('alloc-buffer-fragile') || {}).value || '15') || 15) / 100;
  const bufS = (parseFloat((document.getElementById('alloc-buffer-sturdy') || {}).value || '10') || 10) / 100;

  // Tables needed
  const tablesNeeded = Math.ceil(pax / 8);

  const manifest = [];
  const shortages = [];

  ALLOC_RULES.forEach(rule => {
    const asset = EIM_ASSETS.find(a => a.id === rule.assetId);
    const stockQty = asset ? asset.quantity : 0;
    const unavail = asset && (asset.status === 'Under Repair' || asset.status === 'Retired');

    // Base requirement
    let exact = 0;
    if (rule.ruleType === 'per_pax') exact = pax * rule.ratio;
    else if (rule.ruleType === 'per_table') exact = tablesNeeded * rule.ratio;
    else if (rule.ruleType === 'flat') exact = rule.ratio;
    exact = Math.ceil(exact);

    // Deductions (Venue + Customer Provided)
    const venueVal = rule.venueDeductField ? (vdMap[rule.venueDeductField] || 0) : 0;
    const cpeVal = rule.venueDeductField ? (cpeMap[rule.venueDeductField] || 0) : 0;
    const venueProv = Math.min(venueVal + cpeVal, exact);
    const afterVenue = Math.max(0, exact - venueProv);

    // Apply buffer
    const bufRate = rule.isFragile ? bufF : bufS;
    const bufAmt = Math.ceil(afterVenue * bufRate);
    const deployQty = afterVenue + bufAmt;

    // Stock check
    const inStock = unavail ? 0 : stockQty;
    const shortfall = Math.max(0, deployQty - inStock);
    const sufficient = shortfall === 0 && !unavail;

    const line = {
      assetId: rule.assetId, name: rule.name, category: rule.category,
      isFragile: rule.isFragile, note: rule.note,
      exact, venueProv, bufAmt, deployQty, inStock, sufficient, shortfall, unavail
    };
    manifest.push(line);
    if (!sufficient) shortages.push(line);
  });

  // Manifest table
  const tbody = document.getElementById('alloc-manifest-tbody');
  if (tbody) {
    tbody.innerHTML = manifest.map(line => {
      const okCls = line.unavail ? 'critical' : (line.sufficient ? 'confirmed' : 'critical');
      const okLbl = line.unavail ? 'Unavailable' : (line.sufficient ? 'Covered' : `Short ${line.shortfall}`);
      const dqClr = line.sufficient ? 'var(--cream)' : 'var(--red)';
      return `<tr>
        <td><code style="font-size:11px;color:var(--gold);background:rgba(196,154,60,0.08);padding:2px 6px;border-radius:4px;">${line.assetId}</code></td>
        <td><div class="item-name">${line.name}</div><div class="item-cat">${line.isFragile ? 'Fragile' : 'Sturdy'} \u00b7 ${line.note}</div></td>
        <td><span class="badge pending" style="font-size:10px;">${line.category}</span></td>
        <td style="font-size:13px;font-weight:600;">${line.exact}</td>
        <td style="font-size:12px;color:var(--amber);">+${line.bufAmt}</td>
        <td style="font-size:14px;font-weight:700;color:${dqClr};">${line.deployQty}</td>
        <td style="font-size:13px;color:${line.inStock < line.deployQty ? 'var(--red)' : 'var(--text)'};">${line.inStock}</td>
        <td style="font-size:13px;color:var(--amber);">${line.venueProv > 0 ? line.venueProv : '\u2014'}</td>
        <td style="font-size:14px;font-weight:700;color:${dqClr};">${line.deployQty}</td>
        <td><span class="badge ${okCls}" style="font-size:10px;white-space:nowrap;">${okLbl}</span></td>
      </tr>`;
    }).join('');
  }

  // Summary stats
  const okCount = manifest.filter(l => l.sufficient).length;
  const shortCount = shortages.length;
  const venueCount = manifest.filter(l => l.venueProv > 0).length;
  const st = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  st('alloc-sum-items', manifest.length);
  st('alloc-sum-ok', okCount);
  st('alloc-sum-short', shortCount);
  st('alloc-sum-venue', venueCount);

  // Badge
  const badge = document.getElementById('alloc-manifest-badge');
  if (badge) {
    badge.textContent = shortCount > 0
      ? `${shortCount} Shortage${shortCount > 1 ? 's' : ''}`
      : 'Fully Covered';
    badge.className = shortCount > 0 ? 'badge critical' : 'badge confirmed';
  }
  const sub = document.getElementById('alloc-manifest-sub');
  if (sub) sub.textContent = `${ev.client} \u2014 ${ev.date} \u00b7 ${pax} pax \u00b7 ${manifest.length} equipment lines`;

  // Shortage table
  const stbody = document.getElementById('alloc-shortage-tbody');
  if (stbody) {
    stbody.innerHTML = shortages.map(line => `<tr>
      <td><div class="item-name">${line.name}</div><div class="item-cat">${line.note}</div></td>
      <td><span class="badge pending" style="font-size:10px;">${line.category}</span></td>
      <td style="font-size:13px;font-weight:700;">${line.deployQty}${line.unavail ? ' <span style="color:var(--red);font-size:10px;">(unavailable)</span>' : ''}</td>
      <td style="font-size:13px;color:var(--red);">${line.inStock}</td>
      <td style="font-size:14px;font-weight:700;color:var(--red);">${line.unavail ? 'All' : line.shortfall}</td>
      <td><button class="btn-reject" style="font-size:11px;" onclick="showSection('rentals',document.getElementById('nav-rentals'));setTimeout(openAddRentalModal,60);">+ Rent Now</button></td>
    </tr>`).join('');
  }

  // Status banner
  const banner = document.getElementById('alloc-status-banner');
  if (banner) {
    if (shortCount === 0) {
      banner.innerHTML = `<div style="padding:14px 20px;background:rgba(45,138,78,0.12);border:1px solid var(--green);border-radius:12px;display:flex;align-items:center;gap:14px;margin-bottom:4px;">
        <div style="font-size:28px;">\u2705</div>
        <div><div style="font-size:14px;font-weight:700;color:var(--green);">All Equipment Fully Covered</div>
        <div style="font-size:12px;color:var(--text-dim);">Inventory satisfies all requirements including the safety buffer. Ready to deploy.</div></div></div>`;
    } else {
      banner.innerHTML = `<div style="padding:14px 20px;background:rgba(220,38,38,0.10);border:1px solid var(--red);border-radius:12px;display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:4px;">
        <div style="display:flex;align-items:center;gap:14px;">
          <div style="font-size:28px;">\u26a0\ufe0f</div>
          <div><div style="font-size:14px;font-weight:700;color:var(--red);">${shortCount} Equipment Line${shortCount > 1 ? 's' : ''} Cannot Be Fully Covered</div>
          <div style="font-size:12px;color:var(--text-dim);">Rent the missing items to ensure full deployment for ${pax} guests.</div></div>
        </div>
        <button class="btn-reject" style="white-space:nowrap;flex-shrink:0;" onclick="showSection('rentals',document.getElementById('nav-rentals'));setTimeout(openAddRentalModal,60);">Rent Missing Items \u2192</button>
      </div>`;
    }
    banner.style.display = 'block';
  }

  // Show/hide panels
  const show = (id, v) => { const el = document.getElementById(id); if (el) el.style.display = v ? 'block' : 'none'; };
  show('alloc-empty-state', false);
  show('alloc-manifest-panel', true);
  show('alloc-shortage-panel', shortCount > 0);

  // Persist to Firestore EN collection (async — non-blocking)
  saveENRecord(ev, manifest, vdMap, bufF, bufS);
}

// Print / export manifest
function printAllocationManifest() {
  if (!currentAllocEvent) return;
  const ev = currentAllocEvent;
  const tbl = document.getElementById('alloc-manifest-table');
  if (!tbl) return;
  const html = `<!DOCTYPE html><html><head><title>Deployment Manifest \u2014 ${ev.client}</title>
  <style>body{font-family:Arial,sans-serif;font-size:12px;color:#111;padding:20px;}h1{font-size:18px;margin-bottom:4px;}p{color:#555;margin-bottom:16px;}
  table{border-collapse:collapse;width:100%;}th{background:#1a1007;color:#c49a3c;padding:8px 10px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.5px;}
  td{padding:7px 10px;border-bottom:1px solid #ddd;font-size:12px;}</style></head><body>
  <h1>Deployment Manifest \u2014 ${ev.client}</h1>
  <p>${ev.date} \u00b7 ${ev.pax} pax \u00b7 ${ev.type} \u00b7 Generated: ${new Date().toLocaleString()}</p>
  ${tbl.outerHTML}
  <script>window.print();<\/script></body></html>`;
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
}

// Global exposure
window.renderAllocationSection = renderAllocationSection;

window.generateAllocationManifest = generateAllocationManifest;
window.printAllocationManifest = printAllocationManifest;

// ====================================================================
// EN COLLECTION — Equipment Needs per Reservation
// Firestore path: EN/{reservationId}
// Schema: { eventId, eventName, eventDate, eventPax, savedAt,
//           venueEquipment: {tables,chairs,chafing,dispensers,
//                            plates,forks,spoons,knives,glasses,other},
//           buffersUsed: {fragile, sturdy},
//           manifest: [{ assetId, name, category, source, requiredExact,
//                         venueQty, bufferAdded, deployQty, inStock,
//                         shortfall, sufficient }] }
// ====================================================================

async function saveENRecord(ev, manifest, vdMap, bufF, bufS) {
  if (!window.firebaseFns || !window.firebaseDB) return;
  const si = document.getElementById('venue-save-status');
  try {
    const { doc, setDoc } = window.firebaseFns;
    const db = window.firebaseDB;
    const gvStr = id => parseInt((document.getElementById(id) || {}).value || '0') || 0;
    const record = {
      eventId: ev.id,
      eventName: ev.client,
      eventDate: ev.date,
      eventPax: ev.pax,
      savedAt: new Date().toISOString(),
      venueEquipment: {
        tables: gvStr('venue-tables'),
        chairs: gvStr('venue-chairs'),
        chafing: gvStr('venue-chafing'),
        dispensers: gvStr('venue-dispensers'),
        plates: gvStr('venue-plates'),
        forks: gvStr('venue-forks'),
        spoons: gvStr('venue-spoons'),
        knives: gvStr('venue-knives'),
        glasses: gvStr('venue-glasses'),
        other: (document.getElementById('venue-other') || {}).value || ''
      },
      buffersUsed: { fragile: Math.round((bufF || 0.15) * 100), sturdy: Math.round((bufS || 0.10) * 100) },
      manifest: manifest.map(l => ({
        assetId: l.assetId,
        name: l.name,
        category: l.category,
        // source tells downstream (scheduling/EN) which pool covers this item
        source: l.venueProv > 0 ? 'venue'
          : l.sufficient ? 'inventory'
            : 'rented',
        requiredExact: l.exact,
        venueQty: l.venueProv,
        bufferAdded: l.bufAmt,
        deployQty: l.deployQty,
        inStock: l.inStock,
        shortfall: l.shortfall,
        sufficient: l.sufficient
      }))
    };
    await setDoc(doc(db, 'EN', ev.id), record);
    if (si) { si.textContent = '\u2705 Saved to Firebase'; si.style.color = 'var(--green)'; si.style.display = 'inline'; }
  } catch (err) {
    console.error('[EN] Save failed:', err);
    if (si) { si.textContent = '\u26a0 Save failed: ' + err.message; si.style.color = 'var(--red)'; si.style.display = 'inline'; }
  }
}

async function loadENRecord(eventId) {
  if (!window.firebaseFns || !window.firebaseDB) return;
  const ai = document.getElementById('venue-autofill-status');
  if (ai) { ai.textContent = '\u23f3 Loading saved venue data...'; ai.style.color = 'var(--text-dim)'; ai.style.display = 'inline'; }
  try {
    const { doc, getDoc } = window.firebaseFns;
    const db = window.firebaseDB;
    const snap = await getDoc(doc(db, 'EN', eventId));
    if (!snap.exists()) {
      if (ai) { ai.textContent = 'No saved venue data yet — fill in and generate to save.'; ai.style.color = 'var(--text-dim)'; ai.style.display = 'inline'; }
      return;
    }
    const data = snap.data();
    const ve = data.venueEquipment || {};
    const fields = {
      'venue-tables': ve.tables || 0,
      'venue-chairs': ve.chairs || 0,
      'venue-chafing': ve.chafing || 0,
      'venue-dispensers': ve.dispensers || 0,
      'venue-plates': ve.plates || 0,
      'venue-forks': ve.forks || 0,
      'venue-spoons': ve.spoons || 0,
      'venue-knives': ve.knives || 0,
      'venue-glasses': ve.glasses || 0,
    };
    Object.entries(fields).forEach(([id, val]) => { const el = document.getElementById(id); if (el) el.value = val; });
    const otherEl = document.getElementById('venue-other'); if (otherEl) otherEl.value = ve.other || '';
    if (data.buffersUsed) {
      const bf = document.getElementById('alloc-buffer-fragile'); if (bf) bf.value = data.buffersUsed.fragile || 15;
      const bs = document.getElementById('alloc-buffer-sturdy'); if (bs) bs.value = data.buffersUsed.sturdy || 10;
    }
    if (ai) {
      const d = new Date(data.savedAt);
      ai.textContent = '\u2705 Auto-filled from ' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      ai.style.color = 'var(--green)';
    }
  } catch (err) {
    console.error('[EN] Load failed:', err);
    if (ai) { ai.textContent = '\u26a0 Could not load saved data.'; ai.style.color = 'var(--red)'; }
  }
}

// Standalone save without needing to generate manifest
async function saveVenueEquipmentOnly() {
  if (!currentAllocEvent) { alert('Please select an event first.'); return; }
  await saveENRecord(currentAllocEvent, [], {}, 0.15, 0.10);
}

window.saveENRecord = saveENRecord;
window.loadENRecord = loadENRecord;
window.saveVenueEquipmentOnly = saveVenueEquipmentOnly;

// ====================================================================
// ==================== EIM 5: SCHEDULING & CONFLICT HANDLING ==========
// ====================================================================
// Data model is Firebase-scalable — each entry maps directly to a
// Firestore 'schedules' collection document.
// TODO (Firebase): replace EIM_SCHEDULES array with Firestore CRUD:
//   addDoc, getDoc, updateDoc, deleteDoc on collection 'schedules'
// ====================================================================

const EIM_SCHEDULES = [];
// Schema per entry:
// {
//   id: 'SCH-001',
//   eventId, eventName, eventDate (YYYY-MM-DD), eventPax, eventType,
//   timePeriod: { id, label, start, end },
//   items: [{ assetId, name, category, requiredQty, assignedQty, sufficient }],
//   status: 'Fully Assigned' | 'Partially Assigned' | 'Insufficient' | 'Unassigned',
//   assignedBy, assignedAt (ISO), notes
// }

const SCHED_TIME_PERIODS = [
  { id: 'early-setup', label: 'Early Setup (5AM\u20137AM)', start: '05:00', end: '07:00' },
  { id: 'morning', label: 'Morning (7AM\u201311AM)', start: '07:00', end: '11:00' },
  { id: 'lunch', label: 'Lunch / Midday (11AM\u20132PM)', start: '11:00', end: '14:00' },
  { id: 'afternoon', label: 'Afternoon (2PM\u20136PM)', start: '14:00', end: '18:00' },
  { id: 'evening', label: 'Evening (6PM\u201310PM)', start: '18:00', end: '22:00' },
  { id: 'fullday', label: 'Full Day (7AM\u201310PM)', start: '07:00', end: '22:00' },
];

const STAFF_GROUPS_DEF = [
  { id: 'setup', label: 'Group A \u2014 Setup & Heavy Items', icon: '\ud83c\udfd7\ufe0f', categories: ['Furniture'], color: '#c49a3c' },
  { id: 'tableware', label: 'Group B \u2014 Tableware & Linens', icon: '\ud83c\udf7d\ufe0f', categories: ['Tableware', 'Glassware', 'Linens'], color: '#7c6fcd' },
  { id: 'catering', label: 'Group C \u2014 Catering Equipment', icon: '\ud83c�', categories: ['Catering Equipment'], color: '#2d8a4e' },
  { id: 'av', label: 'Group D \u2014 AV & Lighting', icon: '\ud83d\udca1', categories: ['AV & Lighting'], color: '#d97706' },
];

// State
let currentSchEvent = null;
let currentSchTimePeriod = null;
let schAssignMode = null;        // null | 'manual'
let schManualAssignments = {};          // { assetId: qty }
window._schSufficiencyLines = null;     // cached lines from last sufficiency check

// ---- Helpers ----
function normalizeDateKey(dateStr) {
  if (!dateStr) return dateStr;
  // If it's already YYYY-MM-DD string, just return it to avoid TZ shifts
  if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  
  // Always use local components to avoid -1 day shifts from UTC
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getSchStatusClass(status) {
  return {
    'Fully Assigned': 'confirmed', 'Partially Assigned': 'pending',
    'Insufficient': 'critical', 'Unassigned': 'cancelled'
  }[status] || 'pending';
}

function generateAutoLogisticsMilestones(res) {
  const eventDate = normalizeDateKey(res.date);
  const now = new Date();
  const todayStr = normalizeDateKey(now);
  const eventObj = new Date(eventDate + 'T00:00:00');
  const todayObj = new Date(todayStr + 'T00:00:00');
  
  // Total available prep days (Today up to Day Before Event)
  const totalDays = Math.max(1, Math.ceil((eventObj - todayObj) / (1000 * 60 * 60 * 24)));
  
  // Final deadline: Day Before Event
  const deadlineObj = new Date(eventObj);
  deadlineObj.setDate(deadlineObj.getDate() - 1);

  let currentCursor = new Date(todayObj);
  const milestones = [];
  const tasks = [];

  LOGISTICS_MILESTONE_DEFS.forEach((def, idx) => {
    let weight = def.durationWeight;
    let days = Math.max(1, Math.floor(totalDays * weight));
    
    // Calculate start date with overlap
    if (idx > 0 && def.overlap > 0) {
      const prevWeight = LOGISTICS_MILESTONE_DEFS[idx-1].durationWeight;
      const prevDays = Math.max(1, Math.floor(totalDays * prevWeight));
      const overlapDays = Math.floor(prevDays * def.overlap);
      currentCursor.setDate(currentCursor.getDate() - overlapDays);
    }

    if (currentCursor < todayObj) currentCursor = new Date(todayObj);
    // Hard check: start date cannot be on or after event date
    if (currentCursor >= eventObj) {
      currentCursor = new Date(deadlineObj);
    }
    
    const startStr = normalizeDateKey(currentCursor);
    const endCursor = new Date(currentCursor);
    endCursor.setDate(endCursor.getDate() + days - 1);
    
    // Hard check: end date cannot be on or after event date
    if (endCursor >= eventObj) {
      endCursor.setTime(deadlineObj.getTime());
    }
    // Final sanity: end cannot be before start
    if (endCursor < currentCursor) endCursor.setTime(currentCursor.getTime());

    const endStr = normalizeDateKey(endCursor);
    
    milestones.push({
      id: def.id,
      label: def.label,
      startDate: startStr,
      endDate: endStr,
      status: 'upcoming',
      color: def.color
    });

    const mDays = Math.max(1, Math.ceil((endCursor - currentCursor) / (1000 * 60 * 60 * 24)) + 1);
    def.activities.forEach((act, actIdx) => {
      const dayOffset = actIdx % mDays;
      const taskDate = new Date(currentCursor);
      taskDate.setDate(taskDate.getDate() + dayOffset);
      
      // Strict task date clamping: never on or after eventObj
      if (taskDate >= eventObj) {
        taskDate.setTime(deadlineObj.getTime());
      }

      tasks.push({
        id: 'auto-' + def.id + '-' + actIdx + '-' + Math.random().toString(36).substr(2, 5),
        milestoneId: def.id,
        title: act,
        date: normalizeDateKey(taskDate),
        status: 'pending',
        type: 'auto',
        color: def.color // Store color in task for calendar
      });
    });

    currentCursor = new Date(endCursor);
    currentCursor.setDate(currentCursor.getDate() + 1);
  });

  // Override Payment Fulfillment with actual Downpayment Schedule if exists
  if (res.downpaymentDueDate) {
    const paymentMs = milestones.find(m => m.id === 'payment');
    if (paymentMs) {
      paymentMs.endDate = res.downpaymentDueDate;
      // Set start date to 3 days before due date, or today if 3 days ago is in the past
      const dDate = new Date(res.downpaymentDueDate + 'T00:00:00');
      const sDate = new Date(dDate);
      sDate.setDate(sDate.getDate() - 3);
      const today = new Date();
      today.setHours(0,0,0,0);
      if (sDate < today) sDate.setTime(today.getTime());
      paymentMs.startDate = normalizeDateKey(sDate);

      // Update tasks for this milestone to include the due date
      tasks.forEach(t => {
        if (t.milestoneId === 'payment') {
          if (t.title.toLowerCase().includes('down payment')) {
            t.title = `Downpayment Due: ₱${safeNum(res.downpaymentAmount).toLocaleString()}`;
            t.date = res.downpaymentDueDate;
          } else {
            t.date = paymentMs.startDate; // Move other tasks to the start of the period
          }
        }
      });
    }
  }

  return { milestones, tasks };
}

// ====================================================================
// MAIN RENDER
// ====================================================================
// ============================================================
// EIM 5: SCHEDULING (Timeline-driven Equipment Assignment)
// ============================================================

let schedCalendar = null;
let _schedManualMode = false;
let _schedAssignRows = []; // { assetId, name, category, required, available, assignQty }

function renderSchedulingSection() {
  const container = document.getElementById('sched-timeline-content');
  const emptyState = document.getElementById('sched-timeline-empty');

  if (!currentEqcReservationId) {
    if (emptyState) emptyState.style.display = 'block';
    if (container) container.style.display = 'none';
    return;
  }

  const res = RESERVATIONS.find(r => r.id === currentEqcReservationId);
  if (!res) return;

  if (!res.executionPlan || !res.executionPlan.phases || res.executionPlan.phases.length === 0) {
    if (emptyState) {
      emptyState.innerHTML = `
        <div style="font-size:40px; margin-bottom:16px;"></div>
        <div style="margin-bottom:10px; color:var(--red); font-weight:700; font-size:15px;">No Execution Day Strategy found</div>
        <div style="font-size:12px; margin-bottom:20px; color:var(--text-mid);">Equipment scheduling requires a timeline. Initialize one in the Logistics tab first.</div>
        <button class="btn-primary" onclick="switchTab('meeting-hub'); setTimeout(() => loadReservationDetails('${res.id}'), 100); setTimeout(() => switchResDetailTab('logistics', document.getElementById('res-tab-logistics')), 200);">
          Go to Logistics Timeline to Initialize
        </button>`;
      emptyState.style.display = 'block';
    }
    if (container) container.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (container) container.style.display = 'flex';

  _schedManualMode = false;

  renderSchedCalendar(res);
  renderSchedTimelinePhases(res);
  renderSchedSufficiency(res);
  renderSchedAssignTable(res);
}

// --- 1. CALENDAR ---
function renderSchedCalendar(res) {
  const calEl = document.getElementById('sched-fullcalendar');
  if (!calEl) return;

  // Analytics row
  const analyticsEl = document.getElementById('sched-cal-analytics');
  if (analyticsEl) {
    const eventDate = res.date ? new Date(res.date + 'T00:00:00') : null;
    const today = new Date();
    const daysLeft = eventDate ? Math.ceil((eventDate - today) / 86400000) : '?';
    const daysLeftLabel = daysLeft > 0 ? `${daysLeft} Days Left` : daysLeft === 0 ? 'Today!' : 'Past Event';
    const daysLeftColor = daysLeft <= 0 ? 'var(--red)' : daysLeft <= 7 ? 'var(--gold)' : 'var(--green)';
    const tasks = res.timelineTasks || [];
    const pendingToday = tasks.filter(t => t.date === new Date().toISOString().split('T')[0] && t.status !== 'done').length;
    const delayed = tasks.filter(t => t.status === 'pending' && t.date < new Date().toISOString().split('T')[0]).length;

    analyticsEl.innerHTML = `
      <div style="background:var(--bg3); border:1px solid var(--border); border-radius:10px; padding:16px; text-align:center;">
        <div style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:var(--text-dim); margin-bottom:6px;">Countdown</div>
        <div style="font-size:22px; font-weight:800; color:${daysLeftColor};">${daysLeftLabel}</div>
      </div>
      <div style="background:var(--bg3); border:1px solid var(--border); border-radius:10px; padding:16px; text-align:center;">
        <div style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:var(--text-dim); margin-bottom:6px;">Today's Load</div>
        <div style="font-size:22px; font-weight:800; color:var(--gold);">${pendingToday > 0 ? pendingToday + ' Pending' : 'Clear'}</div>
      </div>
      <div style="background:var(--bg3); border:1px solid var(--border); border-radius:10px; padding:16px; text-align:center;">
        <div style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:var(--text-dim); margin-bottom:6px;">Delayed Activities</div>
        <div style="font-size:22px; font-weight:800; color:${delayed > 0 ? 'var(--red)' : 'var(--green)'};">${delayed}</div>
      </div>`;
  }

  // Build events
  const tasks = res.timelineTasks || [];
  const milestones = (res.logisticsMilestones) || [];
  const taskEvents = tasks.map(t => ({
    id: t.id, title: t.title || 'Activity', start: t.date, allDay: true,
    color: t.status === 'done' ? '#2d8a4e' : t.status === 'in-progress' ? '#d97706' : '#8a7a5a',
    textColor: '#fff'
  }));

  // Milestone range events
  const msEvents = milestones.map(m => {
    let endPlusOne = m.endDate;
    try { const d = new Date(m.endDate + 'T00:00:00'); d.setDate(d.getDate() + 1); endPlusOne = d.toISOString().split('T')[0]; } catch(e){}
    return { id: 'm-' + m.id, title: m.label, start: m.startDate, end: endPlusOne, allDay: true, color: m.color || 'var(--gold)', display: 'block', className: 'milestone-event-block' };
  });

  // Event day
  const eventDayEvent = res.date ? [{ id: 'event-day', title: ' Event Day', start: res.date, allDay: true, color: '#ef4444', textColor: '#fff' }] : [];

  // Milestone phase strips
  const msEl = document.getElementById('sched-cal-milestones');
  if (msEl && milestones.length) {
    msEl.innerHTML = milestones.map(m => `
      <div style="display:flex; align-items:center; gap:6px; padding:4px 10px; border-radius:20px; background:${m.color || 'var(--gold)'}22; border:1px solid ${m.color || 'var(--gold)'}44; font-size:11px;">
        <span style="width:8px; height:8px; border-radius:50%; background:${m.color || 'var(--gold)'}; display:inline-block;"></span>
        <span style="color:var(--text-mid);">${escHtml(m.label)}</span>
        <span style="color:var(--text-dim);">${escHtml(m.startDate)} – ${escHtml(m.endDate)}</span>
      </div>`).join('');
  } else if (msEl) msEl.innerHTML = '';

  const allEvents = eventDayEvent.concat(msEvents).concat(taskEvents);

  if (!schedCalendar) {
    schedCalendar = new FullCalendar.Calendar(calEl, {
      initialView: 'dayGridMonth',
      headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,listWeek' },
      height: 480,
      events: allEvents,
      initialDate: res.date || new Date().toISOString().split('T')[0],
      eventDidMount(info) {
        if (info.event.id.startsWith('m-')) {
          info.el.style.borderLeft = '4px solid rgba(255,255,255,0.3)';
          info.el.style.fontWeight = 'bold';
        }
      }
    });
    schedCalendar.render();
  } else {
    schedCalendar.removeAllEvents();
    allEvents.forEach(e => schedCalendar.addEvent(e));
    if (res.date) schedCalendar.gotoDate(res.date);
  }
}

// --- 2. EXECUTION DAY TIMELINE PHASES ---
function renderSchedTimelinePhases(res) {
  const blocksEl = document.getElementById('sched-visual-blocks');
  const phasesEl = document.getElementById('sched-timeline-phases');
  const rangeEl = document.getElementById('sched-exec-range-label');
  if (!blocksEl || !phasesEl) return;

  const phases = res.executionPlan.phases;
  const colors = {
    departure: 'rgba(234,179,8,0.8)',
    deployment: 'rgba(59,130,246,0.8)',
    execution: 'rgba(34,197,94,0.9)',
    bashout: 'rgba(239,68,68,0.8)',
    restorage: 'rgba(168,85,247,0.8)'
  };
  const cardColors = {
    departure: 'var(--gold)',
    deployment: '#5b9bd5',
    execution: 'var(--green)',
    bashout: 'var(--red)',
    restorage: '#a855f7'
  };

  const timeToPercent = t => { const [h,m] = t.split(':'); return ((parseInt(h)*60+parseInt(m))/1440)*100; };

  // Visual bar blocks
  blocksEl.innerHTML = phases.map(p => {
    const left = timeToPercent(p.start);
    let width = timeToPercent(p.end) - left;
    if (width < 0) width = 100 - left;
    const color = colors[p.id] || 'rgba(255,255,255,0.4)';
    return `<div style="position:absolute;left:${left}%;width:${width}%;height:100%;background:${color};border-right:1px solid rgba(255,255,255,0.1);" title="${p.name}: ${p.start}–${p.end}"></div>`;
  }).join('');

  // Range label
  if (rangeEl && phases.length) {
    const first = phases[0], last = phases[phases.length-1];
    rangeEl.textContent = `Time Range: ${first.start} – ${last.end}`;
  }

  // Phase cards matching Execution Day Strategy style
  phasesEl.innerHTML = phases.map(p => {
    const c = cardColors[p.id] || 'var(--text-mid)';
    const tasks = (p.tasks || []).length;
    const agenda = (p.agenda || []).length;
    const total = tasks + agenda;
    const done = (p.tasks || []).filter(t => t.done).length;
    const pct = total > 0 ? Math.round((done/total)*100) : 0;
    const isDeployWindow = ['deployment','execution','bashout'].includes(p.id);
    return `
      <div style="flex:1; min-width:140px; border:${isDeployWindow ? `2px solid ${c}` : '1px solid var(--border)'}; background:${isDeployWindow ? `${c}10` : 'var(--bg3)'}; border-radius:12px; padding:14px; display:flex; flex-direction:column; gap:6px; position:relative;">
        <div style="font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:1px; color:${c};">${p.name}</div>
        <div style="display:inline-block; font-size:9px; font-weight:700; text-transform:uppercase; padding:2px 8px; border-radius:10px; background:${c}20; color:${c}; width:fit-content;">${res.date && res.date > new Date().toISOString().split('T')[0] ? 'UPCOMING' : 'PAST'}</div>
        <div style="font-size:12px; color:var(--text-mid); font-weight:600;">${p.start} – ${p.end}</div>
        <div style="font-size:11px; color:var(--text-dim);">${total}/0 Activities (${pct}%)</div>
      </div>`;
  }).join('');
}

// --- 3. INVENTORY SUFFICIENCY ---
function renderSchedSufficiency(res) {
  const statusEl = document.getElementById('sched-sufficiency-status');
  const badgeEl = document.getElementById('sched-suff-badge');
  if (!statusEl) return;

  const pax = parseInt(res.pax) || 0;
  const tablesNeeded = Math.ceil(pax / 8);
  const vdMap = { 'venue-tables': parseInt((res.venueEquipment||{}).tables)||0, 'venue-chairs': parseInt((res.venueEquipment||{}).chairs)||0 };
  const cpe = res.customerProvidedEquip || {};

  let totalLines = 0, sufficientLines = 0;
  let insuffList = [];

  (ALLOC_RULES || []).forEach(rule => {
    let exact = 0;
    if (rule.ruleType === 'per_pax') exact = pax * rule.ratio;
    else if (rule.ruleType === 'per_table') exact = tablesNeeded * rule.ratio;
    else if (rule.ruleType === 'flat') exact = rule.ratio;
    exact = Math.ceil(exact);

    if (exact === 0) return;

    const asset = EIM_ASSETS.find(a => a.id === rule.assetId);
    if (!asset || asset.status === 'Retired') return;

    // Safety buffer
    let required = Math.ceil(exact * 1.1);

    // Deductions
    let deduct = 0;
    if (asset.name.toLowerCase().includes('table')) deduct += vdMap['venue-tables'];
    if (asset.name.toLowerCase().includes('chair')) deduct += vdMap['venue-chairs'];
    Object.keys(cpe).forEach(k => { if (asset.name.toLowerCase().includes(k.toLowerCase())) deduct += parseInt(cpe[k])||0; });
    required = Math.max(0, required - deduct);
    if (required === 0) return;

    const available = asset.quantity || 0;
    totalLines++;
    if (available >= required) sufficientLines++;
    else insuffList.push({ name: asset.name, required, available });
  });

  const allSufficient = totalLines > 0 && sufficientLines === totalLines;
  const paxLabel = `All ${pax} pax fully covered`;

  if (badgeEl) {
    if (allSufficient) {
      badgeEl.textContent = ' Sufficient';
      badgeEl.style.cssText = 'font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;border:1px solid var(--green);color:var(--green);background:rgba(34,197,94,0.08);';
    } else {
      badgeEl.textContent = '️ Insufficient';
      badgeEl.style.cssText = 'font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;border:1px solid var(--red);color:var(--red);background:rgba(239,68,68,0.08);';
    }
  }

  if (totalLines === 0) {
    statusEl.innerHTML = '<div style="color:var(--text-dim);font-size:13px;">No equipment allocation rules found. Add items to inventory.</div>';
    return;
  }

  if (allSufficient) {
    statusEl.innerHTML = `
      <div style="padding:14px; background:rgba(34,197,94,0.08); border-radius:10px; border:1px solid rgba(34,197,94,0.2);">
        <div style="font-size:14px; font-weight:700; color:var(--green); margin-bottom:4px;"> Inventory Sufficient</div>
        <div style="font-size:12px; color:var(--text-mid);">${paxLabel} — ready to assign</div>
        <div style="font-size:12px; color:var(--text-dim); margin-top:6px;">All ${totalLines} equipment lines are covered including safety buffers. You may now auto-assign or manually assign below.</div>
      </div>`;
  } else {
    const insuffHtml = insuffList.map(i => `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);font-size:12px;"><span style="color:var(--text);">${escHtml(i.name)}</span><span style="color:var(--red);">Need ${i.required}, have ${i.available}</span></div>`).join('');
    statusEl.innerHTML = `
      <div style="padding:14px; background:rgba(239,68,68,0.08); border-radius:10px; border:1px solid rgba(239,68,68,0.2);">
        <div style="font-size:14px; font-weight:700; color:var(--red); margin-bottom:4px;">️ Inventory Insufficient</div>
        <div style="font-size:12px; color:var(--text-mid); margin-bottom:10px;">${insuffList.length} item(s) below required quantity. Consider replenishment or rental before assigning.</div>
        <div style="max-height:180px; overflow-y:auto;">${insuffHtml}</div>
      </div>`;
  }
}

// --- 4. ASSIGN EQUIPMENT TABLE ---
function renderSchedAssignTable(res) {
  const tbody = document.getElementById('sched-assign-tbody');
  if (!tbody) return;

  const pax = parseInt(res.pax) || 0;
  const tablesNeeded = Math.ceil(pax / 8);
  const vdMap = { 'venue-tables': parseInt((res.venueEquipment||{}).tables)||0, 'venue-chairs': parseInt((res.venueEquipment||{}).chairs)||0 };
  const cpe = res.customerProvidedEquip || {};

  _schedAssignRows = [];

  (ALLOC_RULES || []).forEach(rule => {
    let exact = 0;
    if (rule.ruleType === 'per_pax') exact = pax * rule.ratio;
    else if (rule.ruleType === 'per_table') exact = tablesNeeded * rule.ratio;
    else if (rule.ruleType === 'flat') exact = rule.ratio;
    exact = Math.ceil(exact);

    if (exact === 0) return;

    const asset = EIM_ASSETS.find(a => a.id === rule.assetId);
    if (!asset || asset.status === 'Retired') return;

    let required = Math.ceil(exact * 1.1);

    let deduct = 0;
    if (asset.name.toLowerCase().includes('table')) deduct += vdMap['venue-tables'];
    if (asset.name.toLowerCase().includes('chair')) deduct += vdMap['venue-chairs'];
    Object.keys(cpe).forEach(k => { if (asset.name.toLowerCase().includes(k.toLowerCase())) deduct += parseInt(cpe[k])||0; });
    required = Math.max(0, required - deduct);
    if (required === 0) return;

    const available = asset.quantity || 0;
    // Check if already saved
    const existing = (EIM_SCHEDULES.find(s => s.eventId === res.id)?.items||[]).find(it => it.assetId === asset.id);
    const assignQty = existing ? existing.assignedQty : Math.min(required, available);

    _schedAssignRows.push({ assetId: asset.id, name: asset.name, category: asset.category || 'General', required, available, assignQty });
  });

  if (_schedAssignRows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--text-dim);">No equipment required for this reservation based on current allocation rules.</td></tr>';
    return;
  }

  tbody.innerHTML = _schedAssignRows.map((row, idx) => {
    const sufficient = row.available >= row.required;
    const statusHtml = row.assignQty >= row.required
      ? `<span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;color:var(--green);background:rgba(34,197,94,0.1);padding:3px 8px;border-radius:6px;"> OK</span>`
      : `<span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;color:var(--red);background:rgba(239,68,68,0.1);padding:3px 8px;border-radius:6px;">️ Short</span>`;
    const availColor = sufficient ? 'var(--green)' : 'var(--red)';

    return `
      <tr style="border-bottom:1px solid var(--border);" data-sched-row="${idx}">
        <td style="padding:14px 16px;">
          <div style="font-weight:600; color:var(--text); font-size:13px;">${escHtml(row.name)}</div>
          <div style="font-size:11px; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.5px;">${escHtml(row.category)}</div>
        </td>
        <td style="padding:14px 16px;">
          <span style="padding:3px 10px; border-radius:10px; background:var(--bg3); border:1px solid var(--border); font-size:11px; font-weight:700; color:var(--gold);">${escHtml(row.category)}</span>
        </td>
        <td style="padding:14px 16px; text-align:center; font-weight:700; color:var(--text);">${row.required}</td>
        <td style="padding:14px 16px; text-align:center; font-weight:700; color:${availColor};">${row.available}</td>
        <td style="padding:14px 16px; text-align:center;">
          <input type="number" id="sched-qty-${idx}" value="${row.assignQty}" min="0" max="${row.available}"
            style="width:70px; text-align:center; padding:6px; border:1px solid var(--border); border-radius:6px; background:var(--bg3); color:var(--text); font-size:13px; font-weight:700;"
            oninput="schedUpdateRowStatus(${idx})"
            ${!_schedManualMode ? 'disabled' : ''} />
        </td>
        <td style="padding:14px 16px; text-align:center;" id="sched-status-${idx}">${statusHtml}</td>
      </tr>`;
  }).join('');
}

function schedUpdateRowStatus(idx) {
  const input = document.getElementById(`sched-qty-${idx}`);
  const statusEl = document.getElementById(`sched-status-${idx}`);
  if (!input || !statusEl || !_schedAssignRows[idx]) return;
  const val = parseInt(input.value) || 0;
  _schedAssignRows[idx].assignQty = val;
  const ok = val >= _schedAssignRows[idx].required;
  statusEl.innerHTML = ok
    ? `<span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;color:var(--green);background:rgba(34,197,94,0.1);padding:3px 8px;border-radius:6px;"> OK</span>`
    : `<span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;color:var(--red);background:rgba(239,68,68,0.1);padding:3px 8px;border-radius:6px;">️ Short</span>`;
}

function schedSetManualMode() {
  _schedManualMode = true;
  const res = RESERVATIONS.find(r => r.id === currentEqcReservationId);
  if (res) renderSchedAssignTable(res);
  const btn = document.getElementById('btn-manual-assign');
  if (btn) { btn.style.background = 'var(--gold)'; btn.style.color = '#000'; }
}

function schedAutoAssignAll() {
  _schedAssignRows.forEach((row, idx) => {
    row.assignQty = Math.min(row.required, row.available);
    const input = document.getElementById(`sched-qty-${idx}`);
    if (input) input.value = row.assignQty;
    schedUpdateRowStatus(idx);
  });
  showToast('All quantities auto-filled based on availability.');
}

async function saveSchedAssignment() {
  const res = RESERVATIONS.find(r => r.id === currentEqcReservationId);
  if (!res || !_schedAssignRows.length) return;

  const pDep = (res.executionPlan && res.executionPlan.phases) ? res.executionPlan.phases.find(p => p.id === 'deployment') : null;
  const pRes = (res.executionPlan && res.executionPlan.phases) ? res.executionPlan.phases.find(p => p.id === 'restorage') : null;
  const period = pDep && pRes ? `${res.date} ${pDep.start} to ${res.date} ${pRes.end}` : res.date;

  // Build the items manifest from the current assign rows
  const items = _schedAssignRows.map(row => ({
    assetId: row.assetId, name: row.name, category: row.category,
    requiredQty: row.required, assignedQty: row.assignQty,
    sufficient: row.assignQty >= row.required
  }));

  // Update local EIM_SCHEDULES store
  const existingIdx = EIM_SCHEDULES.findIndex(s => s.eventId === res.id);
  const record = {
    id: existingIdx >= 0 ? EIM_SCHEDULES[existingIdx].id : 'SCH-' + Date.now(),
    eventId: res.id, eventName: res.client || res.name,
    eventDate: res.date, eventPax: res.pax, eventType: res.type,
    timePeriod: { label: period },
    period, status: items.every(i => i.sufficient) ? 'Fully Assigned' : 'Partially Assigned',
    timestamp: new Date().toISOString(), items
  };
  if (existingIdx >= 0) EIM_SCHEDULES[existingIdx] = record;
  else EIM_SCHEDULES.push(record);

  // Update local reservation state immediately
  res.equipmentManifest = items;

  // Persist to Firebase
  try {
    const { doc, updateDoc } = window.firebaseFns;
    const db = window.firebaseDB;
    await updateDoc(doc(db, 'reservations', res.id), { equipmentManifest: items });
    showToast('Equipment assignment saved successfully!');
  } catch(e) {
    console.error('Failed to save equipment manifest to firebase:', e);
    showToast('Saved locally — sync to server failed.', 'error');
  }

  // Show QR button and refresh table
  const qrBtn = document.getElementById('btn-sched-qr');
  if (qrBtn) qrBtn.style.display = 'inline-flex';
  renderSchedAssignTable(res);
}

// Legacy stub kept for compatibility
function assignEquipmentToTimeline() { saveSchedAssignment(); }

// Global exposure
window.renderSchedulingSection = renderSchedulingSection;
window.assignEquipmentToTimeline = assignEquipmentToTimeline;
window.schedSetManualMode = schedSetManualMode;
window.schedAutoAssignAll = schedAutoAssignAll;
window.saveSchedAssignment = saveSchedAssignment;
window.schedUpdateRowStatus = schedUpdateRowStatus;

// ====================================================================
// EIM 6: EQUIPMENT LIFECYCLE
// Departure - Deployment - Execution - Bash-Out - Restorage
// ====================================================================

function renderRentalNeedsPanel() {
  const container = document.getElementById('rnt-needs-container');
  if (!container) return;
  const needs = collectRentalNeeds();
  
  if (needs.length === 0) {
    container.style.display = 'none';
    container.innerHTML = '';
    return;
  }
  
  // Group by event
  const events = {};
  needs.forEach(n => {
    if (!events[n.eventId]) events[n.eventId] = { name: n.eventName, date: n.eventDate, pax: n.eventPax, time: n.timePeriod?.label, items: [] };
    events[n.eventId].items.push(n);
  });
  
  let html = `
    <div class="panel" style="border-color:var(--red);">
      <div class="panel-hdr" style="background:rgba(239, 68, 68, 0.05); padding-bottom:12px;">
        <div class="panel-title" style="color:var(--red);">️ Equipment Still Needed — Based on Scheduling Shortages</div>
      </div>
      <div class="panel-body" style="padding:0;">
  `;
  
  Object.keys(events).forEach(evId => {
    const ev = events[evId];
    html += `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:15px; border-bottom:1px solid var(--border);">
          <div>
            <div style="font-weight:700; color:var(--text); font-size:14px;">${escHtml(ev.name)}</div>
            <div style="font-size:12px; color:var(--text-dim);">${escHtml(ev.date)} - ${ev.pax} pax - ${escHtml(ev.time || 'Time TBD')}</div>
            <div style="font-size:11px; color:var(--red); margin-top:4px;">${ev.items.length} shortage line item(s) awaiting review.</div>
          </div>
          <button class="btn-primary" style="background:var(--gold); border-color:var(--gold); font-size:12px;" onclick="reviewRentalNeeds('${evId}')">Review Rental Needs</button>
        </div>
    `;
  });
  
  html += `
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  container.style.display = 'block';
}
window.renderRentalNeedsPanel = renderRentalNeedsPanel;
window.renderStaffGroups = function() {};


var lifecycleSelectedEvent = null;
var lifecycleCurrentStage = null;
var lifecycleEquipmentItems = [];
var lifecycleStageLogs = {};
var lifecycleModalTimestamp = null;

var LIFECYCLE_STAGES = [
  { id: 'departure', label: 'Departure', icon: '', desc: 'Equipment leaving storage' },
  { id: 'deployment', label: 'Deployment', icon: '', desc: 'Equipment set up at venue' },
  { id: 'execution', label: 'Execution', icon: '', desc: 'Event in progress (damage check)' },
  { id: 'bashout', label: 'Bash-Out', icon: '', desc: 'Equipment gathered after event' },
  { id: 'restorage', label: 'Restorage', icon: '', desc: 'Equipment returned to storage' }
];

function renderLifecycleSection() {
  var today = new Date();
  var todayFmt = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  var subEl = document.getElementById('lifecycle-date-sub');
  var badgeEl = document.getElementById('lifecycle-today-badge');
  if (subEl) subEl.textContent = todayFmt;
  if (badgeEl) badgeEl.textContent = 'Execution Day: ' + todayFmt;
  renderTodayEvents();
}
window.renderLifecycleSection = renderLifecycleSection;

function renderTodayEvents() {
  var container = document.getElementById('lifecycle-today-events');
  if (!container) return;
  var validStatuses = ['confirmed', 'approved', 'preparing', 'on-going'];
  var todayEvents = RESERVATIONS.filter(function (r) {
    return validStatuses.indexOf((r.status || '').toLowerCase()) !== -1;
  });

  // Sort by date closest to today
  todayEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

  if (!todayEvents.length) {
    container.innerHTML = '<div style="text-align:center;padding:36px 16px;color:var(--text-dim)"><div style="font-size:32px;margin-bottom:10px"></div><div style="font-size:13px;font-weight:600;color:var(--text-mid)">No active events</div><div style="font-size:11px;margin-top:4px">Lifecycle tracking is empty.</div></div>';
    return;
  }
  var html = '';
  todayEvents.forEach(function (ev) {
    var timeLabel = 'Time TBD';
    if (ev.executionPlan && ev.executionPlan.phases) {
      var pDep = ev.executionPlan.phases.find(p => p.id === 'deployment');
      var pRes = ev.executionPlan.phases.find(p => p.id === 'restorage');
      if (pDep && pRes) timeLabel = pDep.start + ' – ' + pRes.end;
    }
    
    var isActive = lifecycleSelectedEvent && lifecycleSelectedEvent.id === ev.id;
    html += '<div class="lifecycle-event-card' + (isActive ? ' lec-active' : '') + '" id="lec-' + ev.id + '" data-evid="' + ev.id + '" onclick="selectLifecycleEventByEl(this)">';
    html += '<div class="lec-time">' + timeLabel + '</div>';
    html += '<div class="lec-name">' + ev.client + '</div>';
    html += '<div class="lec-meta">' + ev.type + ' · ' + ev.pax + ' pax · ' + (ev.venue || 'TBD') + '</div>';
    html += '<div style="margin-top:6px"><span class="badge preparing" style="font-size:10px">' + ev.status + '</span></div>';
    html += '</div>';
  });
  container.innerHTML = html;

  // Auto-select the global Eqc context if not currently viewing anything, or force sync
  if (typeof currentEqcReservationId !== 'undefined' && currentEqcReservationId) {
    if (!lifecycleSelectedEvent || lifecycleSelectedEvent.id !== currentEqcReservationId) {
      setTimeout(() => { selectLifecycleEvent(currentEqcReservationId); }, 50);
    }
  }
}

function selectLifecycleEventByEl(el) {
  selectLifecycleEvent(el.dataset.evid);
}
window.selectLifecycleEventByEl = selectLifecycleEventByEl;

async function selectLifecycleEvent(eventId) {
  var ev = RESERVATIONS.find(function (r) { return r.id === eventId; });
  if (!ev) return;
  lifecycleSelectedEvent = ev;
  document.querySelectorAll('.lifecycle-event-card').forEach(function (c) { c.classList.remove('lec-active'); });
  var card = document.getElementById('lec-' + eventId);
  if (card) card.classList.add('lec-active');
  var detail = document.getElementById('lifecycle-detail-panel');
  var noEv = document.getElementById('lifecycle-no-event');
  if (detail) detail.style.display = 'block';
  if (noEv) noEv.style.display = 'none';
  await loadLifecycleStageLogs(eventId);
  buildLifecycleEquipmentList(ev);
  renderLifecycleStageButtons(eventId);
  renderLifecycleLogs(eventId);
}
window.selectLifecycleEvent = selectLifecycleEvent;

function buildLifecycleEquipmentList(ev) {
  var items = [];
  if (ev.equipmentManifest && ev.equipmentManifest.length) {
    ev.equipmentManifest.forEach(function (it) {
      items.push({ assetId: it.assetId || 'EQ-???', name: it.name, category: it.category || 'Equipment', source: 'inventory', qty: parseInt(it.assignedQty || it.requiredQty) || 1 });
    });
  }
  
  // Note: Rented equipment is now embedded inside the cycle, but if there's external RENTED_EQUIPMENT, keep reading it.
  (window.RENTED_EQUIPMENT || []).filter(function (r) {
    return r.reservationId === ev.id || r.forEvent === ev.id || r.forEventName === ev.client;
  }).forEach(function (r) {
    items.push({ assetId: 'RENT-' + (r.id || r.name), name: r.name, category: r.category || 'Rented', source: 'rented', qty: parseInt(r.quantity) || 1 });
  });
  lifecycleEquipmentItems = items;

  var infoEl = document.getElementById('lifecycle-event-info');
  if (infoEl) {
    var timeLabel = 'Time TBD';
    if (ev.executionPlan && ev.executionPlan.phases) {
      var pDep = ev.executionPlan.phases.find(p => p.id === 'deployment');
      var pRes = ev.executionPlan.phases.find(p => p.id === 'restorage');
      if (pDep && pRes) timeLabel = pDep.start + ' – ' + pRes.end;
    }
    
    var infoHtml = '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">';
    infoHtml += '<div><div style="font-size:19px;font-weight:800;color:var(--cream)">' + ev.client + '</div>';
    infoHtml += '<div style="font-size:12px;color:var(--text-dim);margin-top:3px">' + ev.type + ' &middot; ' + ev.date + ' &middot; ' + ev.pax + ' pax';
    if (timeLabel !== 'Time TBD') infoHtml += ' &middot; <strong style="color:var(--gold)">' + timeLabel + '</strong>';
    if (ev.venue) infoHtml += ' &middot; ' + ev.venue;
    infoHtml += '</div></div><span class="badge preparing" style="font-size:11px">' + ev.status + '</span></div>';
    infoEl.innerHTML = infoHtml;
  }

  var listEl = document.getElementById('lifecycle-equip-list');
  if (!listEl) return;
  if (!items.length) {
    listEl.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-dim);font-size:12px">No equipment assigned. Use Scheduling to assign equipment first.</div>';
    return;
  }
  var totalPieces = items.reduce(function (s, i) { return s + i.qty; }, 0);
  var invCount = items.filter(function (i) { return i.source === 'inventory'; }).length;
  var rentCount = items.filter(function (i) { return i.source === 'rented'; }).length;
  var listHtml = '<div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:14px;padding:10px 14px;background:var(--bg3);border-radius:8px;border:1px solid var(--border)">';
  listHtml += '<span style="font-size:12px;color:var(--text-mid)"><strong>' + invCount + '</strong> inventory line' + (invCount !== 1 ? 's' : '') + '</span>';
  if (rentCount) listHtml += '<span style="font-size:12px;color:var(--amber)"><strong>' + rentCount + '</strong> rented</span>';
  listHtml += '<span style="font-size:12px;color:var(--cream);margin-left:auto"><strong>' + totalPieces + '</strong> total pieces</span></div>';
  items.forEach(function (it) {
    listHtml += '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);gap:10px">';
    listHtml += '<div><div style="font-size:13px;font-weight:600;color:var(--cream)">' + it.name + '</div>';
    listHtml += '<div style="font-size:11px;color:var(--text-dim)">' + it.category + ' &middot; <span style="color:' + (it.source === 'rented' ? 'var(--amber)' : 'var(--gold)') + '">' + it.source + '</span></div></div>';
    listHtml += '<div style="font-size:15px;font-weight:700;color:var(--cream);flex-shrink:0">&times;' + it.qty + '</div></div>';
  });
  listEl.innerHTML = listHtml;
}

async function loadLifecycleStageLogs(eventId) {
  if (!lifecycleStageLogs[eventId]) lifecycleStageLogs[eventId] = {};
  if (!window.firebaseFns || !window.firebaseDB) return;
  try {
    var fns = window.firebaseFns;
    var snap = await fns.getDocs(fns.query(fns.collection(window.firebaseDB, 'deploymentLogs'), fns.where('reservationId', '==', eventId)));
    snap.forEach(function (doc) { var d = doc.data(); lifecycleStageLogs[eventId][d.stage] = { ...d, _docId: doc.id }; });
  } catch (e) { console.warn('[Lifecycle] Load:', e.message); }
}

function renderLifecycleStageButtons(eventId) {
  var container = document.getElementById('lifecycle-stage-btns');
  if (!container) return;
  var logs = lifecycleStageLogs[eventId] || {};
  var html = '';
  LIFECYCLE_STAGES.forEach(function (stage, idx) {
    var done = !!logs[stage.id];
    var prevDone = idx === 0 || !!(logs[LIFECYCLE_STAGES[idx - 1].id]);
    var canStart = prevDone && !done;
    var timeStr = done ? new Date(logs[stage.id].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    var cls = done ? 'lsb-done' : (canStart ? 'lsb-ready' : 'lsb-locked');
    var title = done ? ('Completed at ' + timeStr + ' - Click to view') : (canStart ? 'Click to begin' : 'Complete previous stage first');
    var isClickable = canStart || done;
    html += '<button class="lifecycle-stage-btn ' + cls + '" data-stage="' + stage.id + '" onclick="' + (isClickable ? 'toggleInlineLifecycleChecklistByEl(this)' : '') + '" title="' + title + '">';
    html += '<div style="font-size:22px">' + stage.icon + '</div>';
    html += '<div style="font-size:11px;font-weight:800">' + stage.label + '</div>';
    if (done) html += '<div style="font-size:10px;color:#6ee7b7">&check; ' + timeStr + '</div>';
    if (!done && !canStart) html += '<div style="font-size:9px;opacity:.5">Locked</div>';
    html += '</button>';
  });
  container.innerHTML = html;
}
window.renderLifecycleStageButtons = renderLifecycleStageButtons;

function toggleInlineLifecycleChecklistByEl(el) {
  toggleInlineLifecycleChecklist(el.dataset.stage);
}
window.toggleInlineLifecycleChecklistByEl = toggleInlineLifecycleChecklistByEl;

function toggleInlineLifecycleChecklist(stage) {
  var container = document.getElementById('lifecycle-inline-checklist');
  if (!container) return;

  // Toggle logic: if clicking the same stage that's open, close it.
  if (lifecycleCurrentStage === stage && container.style.display === 'block') {
    container.style.display = 'none';
    lifecycleCurrentStage = null;
    return;
  }

  lifecycleCurrentStage = stage;
  container.style.display = 'block';

  var stageObj = LIFECYCLE_STAGES.find(function (s) { return s.id === stage; });
  var logs = lifecycleStageLogs[lifecycleSelectedEvent.id] || {};
  var logRecord = logs[stage];

  if (!logRecord) {
    container.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-dim);background:var(--bg3);border-radius:8px;">' +
      '<div style="font-size:32px;margin-bottom:10px"></div>' +
      '<div style="font-size:14px;font-weight:600;color:var(--cream)">Awaiting Staff Submission</div>' +
      '<div style="font-size:12px;margin-top:6px">The checklist for ' + stageObj.label + ' has not been finalized yet. It will appear here automatically once staff completes the task.</div>' +
      '</div>';
    return;
  }

  var html = '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">';
  html += '<div style="font-size:24px;">' + stageObj.icon + '</div>';
  html += '<div><div style="font-size:15px;font-weight:800;color:var(--cream)">' + stageObj.label + ' Checklist</div>';
  html += '<div style="font-size:11px;color:var(--text-dim)">Logged by ' + (logRecord.loggedBy || 'System') + ' at ' + new Date(logRecord.timestamp).toLocaleString() + '</div></div>';
  html += '</div>';

  html += '<table style="width:100%;border-collapse:collapse;font-size:12px;background:var(--bg3);border-radius:8px;overflow:hidden;">';
  html += '<thead><tr style="border-bottom:1px solid var(--border);background:var(--bg2)">';
  html += '<th style="text-align:left;padding:10px 12px;color:var(--text-dim);font-size:10px;text-transform:uppercase;letter-spacing:.8px">Equipment</th>';
  html += '<th style="padding:10px 12px;color:var(--text-dim);font-size:10px;text-transform:uppercase;text-align:center">Total</th>';
  html += '<th style="padding:10px 12px;color:var(--text-dim);font-size:10px;text-transform:uppercase;text-align:center">Present</th>';
  html += '<th style="padding:10px 12px;color:var(--text-dim);font-size:10px;text-transform:uppercase;text-align:center">Missing</th>';
  html += '<th style="padding:10px 12px;color:var(--text-dim);font-size:10px;text-transform:uppercase;text-align:center">Condition</th>';
  html += '</tr></thead><tbody>';

  var clist = logRecord.checklist || [];
  if (!clist.length) {
    html += '<tr><td colspan="5" style="text-align:center;padding:20px;color:var(--text-dim)">No items recorded in this checklist.</td></tr>';
  } else {
    clist.forEach(function (it) {
      html += '<tr style="border-bottom:1px solid var(--border)">';
      html += '<td style="padding:12px"><div style="font-weight:600;color:var(--cream)">' + it.name + '</div>';
      html += '<div style="font-size:10px;color:var(--text-dim)">' + it.category + ' &middot; <span style="color:' + (it.source === 'rented' ? 'var(--amber)' : 'var(--gold)') + '">' + it.source + '</span></div></td>';
      html += '<td style="padding:12px;text-align:center;font-weight:700;color:var(--cream)">' + it.totalQty + '</td>';
      html += '<td style="padding:12px;text-align:center;font-weight:700;color:var(--green)">' + it.presentQty + '</td>';
      var missing = parseInt(it.missingQty) || 0;
      html += '<td style="padding:12px;text-align:center;font-weight:700"><span style="color:' + (missing > 0 ? 'var(--red)' : 'var(--text-dim)') + '">' + missing + '</span></td>';
      
      var condColor = 'var(--green)';
      if(it.condition === 'broken' || it.condition === 'damaged') condColor = 'var(--red)';
      else if(it.condition === 'good') condColor = 'var(--amber)';
      html += '<td style="padding:12px;text-align:center;font-weight:700;text-transform:capitalize;color:' + condColor + '">' + it.condition + '</td>';
      html += '</tr>';
    });
  }
  html += '</tbody></table>';

  // Summary
  if (logRecord.summary) {
    var sum = logRecord.summary;
    html += '<div style="margin-top:16px;padding:14px 20px;background:var(--bg2);border-radius:8px;border:1px solid var(--border);display:flex;flex-wrap:wrap;gap:24px;">';
    html += '<div style="text-align:center"><div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px">Total Pcs</div><div style="font-size:18px;font-weight:800;color:var(--cream)">' + sum.totalPcs + '</div></div>';
    html += '<div style="text-align:center"><div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px">Present</div><div style="font-size:18px;font-weight:800;color:var(--green)">' + sum.presentPcs + '</div></div>';
    html += '<div style="text-align:center"><div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px">Missing</div><div style="font-size:18px;font-weight:800;color:' + (sum.missingPcs > 0 ? 'var(--red)' : 'var(--green)') + '">' + sum.missingPcs + '</div></div>';
    if (sum.damaged) html += '<div style="text-align:center"><div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px">Damaged</div><div style="font-size:18px;font-weight:800;color:var(--amber)">' + sum.damaged + '</div></div>';
    if (sum.broken) html += '<div style="text-align:center"><div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px">Broken</div><div style="font-size:18px;font-weight:800;color:var(--red)">' + sum.broken + '</div></div>';
    html += '</div>';
  }

  container.innerHTML = html;
}
// Old modal logic and finalization functions completely removed as part of inline checklist transition

function renderLifecycleLogs(eventId) {
  var panel = document.getElementById('lifecycle-logs-panel');
  if (!panel) return;
  var logs = lifecycleStageLogs[eventId] || {};
  var completed = LIFECYCLE_STAGES.filter(function (s) { return !!logs[s.id]; });
  if (!completed.length) {
    panel.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-dim);font-size:12px">No stages completed yet.</div>';
    return;
  }
  var html = '';
  completed.forEach(function (stage) {
    var log = logs[stage.id];
    var ts = log.timestamp ? new Date(log.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '';
    var sum = log.summary || {};
    html += '<div style="margin-bottom:16px;border:1px solid var(--border);border-radius:12px;overflow:hidden">';
    // Stage header
    html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--bg3);cursor:pointer" onclick="toggleLifecycleLog(this)">';
    html += '<div style="display:flex;align-items:center;gap:10px">';
    html += '<span style="font-size:18px">' + stage.icon + '</span>';
    html += '<div><div style="font-size:13px;font-weight:700;color:var(--cream)">' + stage.label + '</div>';
    html += '<div style="font-size:11px;color:var(--text-dim)">' + ts + ' &middot; Logged by ' + (log.loggedBy || 'Admin') + '</div></div></div>';
    // Summary chips
    html += '<div style="display:flex;gap:10px;align-items:center">';
    html += '<span style="font-size:11px;color:var(--green);font-weight:700">' + (sum.presentPcs || 0) + ' present</span>';
    if (sum.missingPcs) html += '<span style="font-size:11px;color:var(--red);font-weight:700">' + sum.missingPcs + ' missing</span>';
    if (sum.damaged) html += '<span style="font-size:11px;color:var(--amber);font-weight:700">' + sum.damaged + ' damaged</span>';
    if (sum.broken) html += '<span style="font-size:11px;color:var(--red);font-weight:700">' + sum.broken + ' broken</span>';
    html += '<span style="font-size:11px;color:var(--text-dim)">&#9660;</span>';
    html += '</div></div>';
    // Checklist detail (collapsed by default)
    html += '<div class="lifecycle-log-detail" style="display:none;padding:12px 16px">';
    if (log.checklist && log.checklist.length) {
      html += '<table style="width:100%;border-collapse:collapse;font-size:11px">';
      html += '<thead><tr style="border-bottom:1px solid var(--border)">';
      html += '<th style="text-align:left;padding:6px 4px;color:var(--text-dim)">Equipment</th>';
      html += '<th style="text-align:center;padding:6px 4px;color:var(--text-dim)">Total</th>';
      html += '<th style="text-align:center;padding:6px 4px;color:var(--text-dim)">Present</th>';
      html += '<th style="text-align:center;padding:6px 4px;color:var(--text-dim)">Missing</th>';
      html += '<th style="text-align:center;padding:6px 4px;color:var(--text-dim)">Condition</th>';
      var hasLiable = log.checklist.some(function (it) { return it.liableParty && it.liableParty !== 'none'; });
      if (hasLiable) html += '<th style="text-align:center;padding:6px 4px;color:var(--red)">Liable</th>';
      html += '</tr></thead><tbody>';
      log.checklist.forEach(function (it) {
        var condColor = it.condition === 'excellent' ? 'var(--green)' : it.condition === 'good' ? 'var(--text-mid)' : it.condition === 'damaged' ? 'var(--amber)' : 'var(--red)';
        html += '<tr style="border-bottom:1px solid var(--border)">';
        html += '<td style="padding:6px 4px"><div style="font-weight:600;color:var(--cream)">' + it.name + '</div><div style="font-size:10px;color:var(--text-dim)">' + (it.source || '') + '</div></td>';
        html += '<td style="text-align:center;padding:6px 4px;color:var(--cream)">' + (it.totalQty || 0) + '</td>';
        html += '<td style="text-align:center;padding:6px 4px;color:var(--green);font-weight:700">' + (it.presentQty || 0) + '</td>';
        html += '<td style="text-align:center;padding:6px 4px;color:' + (it.missingQty ? 'var(--red)' : 'var(--green)') + ';font-weight:700">' + (it.missingQty || 0) + '</td>';
        html += '<td style="text-align:center;padding:6px 4px;color:' + condColor + ';font-weight:600;text-transform:capitalize">' + (it.condition || '') + '</td>';
        if (hasLiable) {
          var liableLabel = (!it.liableParty || it.liableParty === 'none') ? '<span style="color:var(--text-dim)">—</span>' : '<span style="color:var(--red);font-weight:700;text-transform:capitalize">' + it.liableParty + '</span>';
          html += '<td style="text-align:center;padding:6px 4px">' + liableLabel + '</td>';
        }
        html += '</tr>';
      });
      html += '</tbody></table>';
    } else {
      html += '<div style="color:var(--text-dim);font-size:12px">No checklist data.</div>';
    }
    html += '</div></div>';
  });
  panel.innerHTML = html;
}
window.renderLifecycleLogs = renderLifecycleLogs;

function toggleLifecycleLog(headerEl) {
  var detail = headerEl.nextElementSibling;
  var arrow = headerEl.querySelector('span:last-child');
  if (!detail) return;
  var isOpen = detail.style.display !== 'none';
  detail.style.display = isOpen ? 'none' : 'block';
  if (arrow) arrow.textContent = isOpen ? '\u25BC' : '\u25B2';
}
window.toggleLifecycleLog = toggleLifecycleLog;


// ====================================================================
// EIM 7: EQUIPMENT ISSUES HANDLING
// Source: deploymentLogs collection (lifecycle checklists)
// Resolution: issueResolutions collection
// ====================================================================

var issueSelectedEvent = null;
var allDeploymentLogs = {};    // { [reservationId]: { [stage]: logDoc } }
var issueResolutionLogs = {};    // { [reservationId]: [resolutionDocs] }

var ISSUE_STAGE_ORDER = ['departure', 'deployment', 'execution', 'bashout', 'restorage'];
var ISSUE_STAGE_LABELS = { departure: 'Departure', deployment: 'Deployment', execution: 'Execution', bashout: 'Bash-Out', restorage: 'Restorage' };
var ISSUE_STAGE_ICONS = { departure: '', deployment: '', execution: '', bashout: '', restorage: '' };
var ISSUE_STAGE_WHEN = {
  departure: 'during travel to venue',
  deployment: 'during venue setup',
  execution: 'during the event',
  bashout: 'during equipment gathering (bash-out)',
  restorage: 'during return to storage'
};

// ── Entry point ───────────────────────────────────────────────────────
function renderEquipIssues() {
  var listEl = document.getElementById('issues-event-list');
  var cntEl = document.getElementById('issues-event-count');
  if (listEl) listEl.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-dim);font-size:12px;">Loading logs...</div>';
  if (cntEl) cntEl.textContent = 'Loading...';
  loadAllDeploymentLogs().then(function () { renderIssueEventList(); });
}
window.renderEquipIssues = renderEquipIssues;

// ── Load all logs from Firestore ───────────────────────────────────────
async function loadAllDeploymentLogs() {
  allDeploymentLogs = {};
  issueResolutionLogs = {};

  // Also pull from local lifecycle cache (for offline/just-logged items)
  Object.keys(lifecycleStageLogs).forEach(function (rid) {
    if (!allDeploymentLogs[rid]) allDeploymentLogs[rid] = {};
    Object.assign(allDeploymentLogs[rid], lifecycleStageLogs[rid]);
  });

  if (!window.firebaseFns || !window.firebaseDB) return;
  try {
    var fns = window.firebaseFns;
    var snap = await fns.getDocs(fns.collection(window.firebaseDB, 'deploymentLogs'));
    snap.forEach(function (docSnap) {
      var d = docSnap.data();
      if (!allDeploymentLogs[d.reservationId]) allDeploymentLogs[d.reservationId] = {};
      allDeploymentLogs[d.reservationId][d.stage] = Object.assign({}, d, { _docId: docSnap.id });
    });
    var rSnap = await fns.getDocs(fns.collection(window.firebaseDB, 'issueResolutions'));
    rSnap.forEach(function (docSnap) {
      var d = docSnap.data();
      if (!issueResolutionLogs[d.reservationId]) issueResolutionLogs[d.reservationId] = [];
      issueResolutionLogs[d.reservationId].push(Object.assign({}, d, { _docId: docSnap.id }));
    });
  } catch (e) { console.warn('[Issues] Load:', e.message); }
}

// ── Get all flagged items for an event ────────────────────────────────
window.renderEquipIssues = renderEquipIssues;

function getEventFlags(reservationId) {
  var logs = allDeploymentLogs[reservationId] || {};
  var flags = [];
  ISSUE_STAGE_ORDER.forEach(function (stage) {
    var log = logs[stage];
    if (!log || !log.checklist) return;
    log.checklist.forEach(function (item) {
      var missing = parseInt(item.missingQty) || 0;
      var hasMissing = missing > 0;
      var hasDamage = item.condition === 'damaged' || item.condition === 'broken';
      if (!hasMissing && !hasDamage) return;
      var flagType = hasMissing ? 'missing' : item.condition;
      var flagObj = {};
      Object.assign(flagObj, item, {
        stage: stage,
        stageLabel: ISSUE_STAGE_LABELS[stage],
        stageIcon: ISSUE_STAGE_ICONS[stage],
        stageWhen: ISSUE_STAGE_WHEN[stage],
        timestamp: log.timestamp,
        loggedAt: log.loggedAt,
        reservationId: reservationId,
        eventName: log.eventName,
        eventDate: log.eventDate,
        flagType: flagType,
        flagKey: stage + '_' + (item.assetId || item.name)
      });
      flags.push(flagObj);
    });
  });
  return flags;
}

// ── Render event list ─────────────────────────────────────────────────
function renderIssueEventList() {
  var listEl = document.getElementById('issues-event-list');
  var cntEl = document.getElementById('issues-event-count');
  if (!listEl) return;

  var reservationIds = Object.keys(allDeploymentLogs);
  if (!reservationIds.length) {
    listEl.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-dim);font-size:12px;">No lifecycle logs found. Complete stages in Equipment Lifecycle first.</div>';
    if (cntEl) cntEl.textContent = '0 events tracked';
    return;
  }

  var eventData = reservationIds.map(function (rid) {
    var logs = allDeploymentLogs[rid];
    var firstLog = Object.values(logs)[0] || {};
    var flags = getEventFlags(rid);
    var resolutions = issueResolutionLogs[rid] || [];
    var resolvedKeys = resolutions.map(function (r) { return r.flagKey; });
    var openFlags = flags.filter(function (f) { return resolvedKeys.indexOf(f.flagKey) === -1; });
    return { rid: rid, eventName: firstLog.eventName || rid, eventDate: firstLog.eventDate || '', flags: flags, openFlags: openFlags, resolutions: resolutions };
  }).sort(function (a, b) { return b.openFlags.length - a.openFlags.length; });

  var flaggedCount = eventData.filter(function (e) { return e.openFlags.length > 0; }).length;
  if (cntEl) cntEl.textContent = flaggedCount + ' event' + (flaggedCount !== 1 ? 's' : '') + ' with open flags &middot; ' + reservationIds.length + ' total logged';

  var html = '';
  eventData.forEach(function (ev) {
    var hasFlagged = ev.openFlags.length > 0;
    var isSelected = issueSelectedEvent === ev.rid;
    var missingCnt = ev.openFlags.filter(function (f) { return f.flagType === 'missing'; }).length;
    var damagedCnt = ev.openFlags.filter(function (f) { return f.flagType === 'damaged'; }).length;
    var brokenCnt = ev.openFlags.filter(function (f) { return f.flagType === 'broken'; }).length;
    var resCnt = ev.resolutions.length;
    html += '<div class="issue-event-card' + (hasFlagged ? ' iec-flagged' : '') + (isSelected ? ' iec-active' : '') + '" data-rid="' + ev.rid + '" onclick="selectIssueEventByEl(this)">';
    html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:5px">';
    html += '<div style="font-size:14px;font-weight:700;color:var(--cream)">' + ev.eventName + '</div>';
    if (hasFlagged) html += '<span class="issue-flag-badge">' + ev.openFlags.length + ' open</span>';
    html += '</div>';
    html += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px">' + (ev.eventDate || 'Date TBD') + '</div>';
    html += '<div style="display:flex;gap:8px;flex-wrap:wrap">';
    if (missingCnt) html += '<span style="font-size:10px;color:var(--red);font-weight:700">' + missingCnt + ' missing</span>';
    if (damagedCnt) html += '<span style="font-size:10px;color:var(--amber);font-weight:700">' + damagedCnt + ' damaged</span>';
    if (brokenCnt) html += '<span style="font-size:10px;color:var(--red);font-weight:700">' + brokenCnt + ' broken</span>';
    if (resCnt) html += '<span style="font-size:10px;color:var(--green);font-weight:700">' + resCnt + ' resolved</span>';
    if (!hasFlagged && !resCnt) html += '<span style="font-size:10px;color:var(--green)">No issues</span>';
    html += '</div></div>';
  });
  listEl.innerHTML = html;
}

function selectIssueEventByEl(el) { selectIssueEvent(el.dataset.rid); }
window.selectIssueEventByEl = selectIssueEventByEl;

function selectIssueEvent(reservationId) {
  issueSelectedEvent = reservationId;
  document.querySelectorAll('.issue-event-card').forEach(function (c) { c.classList.remove('iec-active'); });
  var card = document.querySelector('.issue-event-card[data-rid="' + reservationId + '"]');
  if (card) card.classList.add('iec-active');
  var detail = document.getElementById('issues-detail-panel');
  var noEv = document.getElementById('issues-no-event');
  if (detail) detail.style.display = 'block';
  if (noEv) noEv.style.display = 'none';
  renderIssueDetail(reservationId);
}
window.selectIssueEvent = selectIssueEvent;

// ── Render the full issue detail view ─────────────────────────────────

function renderIssueDetail(reservationId) {
  var logs = allDeploymentLogs[reservationId] || {};
  var logValues = Object.values(logs);
  var firstLog = logValues.length > 0 ? logValues[0] : {};
  
  var totalBroken = 0;
  var totalMissing = 0;
  var totalCost = 0;

  logValues.forEach(function(log) {
    var clist = log.checklist || [];
    clist.forEach(function(item) {
      var missing = parseInt(item.missingQty) || 0;
      var broken = 0;
      if (item.condition === 'broken' || item.condition === 'damaged') {
        broken = parseInt(item.presentQty) || 0; 
      }
      if (missing > 0 || broken > 0) {
        var cost = getAssetCost(item.assetId, item.name);
        totalMissing += missing;
        totalBroken += broken;
        totalCost += (missing * cost) + (broken * cost);
      }
    });
  });

  var hdrEl = document.getElementById('issues-event-header');
  if (hdrEl) {
    var stagesDone = logValues.length;
    var hasIssues = (totalBroken + totalMissing) > 0;
    var statusColor = hasIssues ? 'var(--red)' : 'var(--green)';
    var statusBg = hasIssues ? 'rgba(220,38,38,0.1)' : 'rgba(45,138,78,0.1)';
    var statusBorder = hasIssues ? 'rgba(220,38,38,0.3)' : 'rgba(45,138,78,0.3)';
    var statusLabel = hasIssues ? 'FLAGGED FOR REVIEW' : 'ALL CLEAR';
    
    hdrEl.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">' +
      '<div><div style="font-size:19px;font-weight:800;color:var(--cream)">' + (firstLog.eventName || reservationId) + '</div>' +
      '<div style="font-size:12px;color:var(--text-dim);margin-top:3px">' + (firstLog.eventDate || '') +
      ' &middot; ' + stagesDone + ' stage' + (stagesDone !== 1 ? 's' : '') + ' logged</div></div>' +
      '<span style="font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;background:' + statusBg + ';color:' + statusColor + ';border:1px solid ' + statusBorder + '">' + statusLabel + '</span></div>';
  }

  var analyticsEl = document.getElementById('issues-analytics');
  if (analyticsEl) {
    var html = '';
    html += '<div style="flex:1;min-width:140px;text-align:center;background:var(--bg3);padding:20px;border-radius:12px;border:1px solid var(--border)">';
    html += '<div style="font-size:32px;margin-bottom:8px"></div><div style="font-size:11px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Total Broken</div><div style="font-size:24px;font-weight:800;color:var(--amber)">' + totalBroken + ' <span style="font-size:14px;color:var(--text-dim);font-weight:500">pcs</span></div></div>';
    
    html += '<div style="flex:1;min-width:140px;text-align:center;background:var(--bg3);padding:20px;border-radius:12px;border:1px solid var(--border)">';
    html += '<div style="font-size:32px;margin-bottom:8px"></div><div style="font-size:11px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Total Missing</div><div style="font-size:24px;font-weight:800;color:var(--red)">' + totalMissing + ' <span style="font-size:14px;color:var(--text-dim);font-weight:500">pcs</span></div></div>';

    html += '<div style="flex:1;min-width:140px;text-align:center;background:var(--bg3);padding:20px;border-radius:12px;border:1px solid rgba(220,38,38,0.3)">';
    html += '<div style="font-size:32px;margin-bottom:8px"></div><div style="font-size:11px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Est. Financial Impact</div><div style="font-size:24px;font-weight:800;color:var(--red)">&#8369;' + totalCost.toLocaleString() + '</div></div>';
    
    analyticsEl.innerHTML = html;
  }

  renderIssueStageButtons(reservationId);
  var inline = document.getElementById('issues-inline-checklist');
  if(inline) {
    inline.style.display = 'none';
    issueCurrentStage = null;
  }
}

function getAssetCost(assetId, name) {
  var inventory = window.CAT || [];
  var invItem = inventory.find(function(it) { return (it.id && it.id === assetId) || (it.name && it.name === name); });
  if (invItem && invItem.price) return parseInt(invItem.price) || 0;
  
  var rentals = window.RENTED_EQUIPMENT || [];
  var rEq = rentals.find(function(it){ return (it.id && it.id === assetId) || (it.name && it.name === name); });
  if (rEq && rEq.price) return parseInt(rEq.price) || 0;
  if (rEq && rEq.cost) return parseInt(rEq.cost) || 0;

  return 15;
}

var issueCurrentStage = null;

function renderIssueStageButtons(reservationId) {
  var container = document.getElementById('issues-stage-btns');
  if (!container) return;
  var logs = allDeploymentLogs[reservationId] || {};
  var html = '';
  LIFECYCLE_STAGES.forEach(function (stage) {
    var done = !!logs[stage.id];
    var timeStr = done ? new Date(logs[stage.id].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    
    var clist = done ? (logs[stage.id].checklist || []) : [];
    var hasIssues = clist.some(function(item) {
       return (parseInt(item.missingQty) || 0) > 0 || item.condition === 'broken' || item.condition === 'damaged';
    });
    
    var cls = done ? (hasIssues ? 'lsb-issue' : 'lsb-done') : 'lsb-locked';
    var title = done ? ('Completed at ' + timeStr + ' - Click to view issues') : 'Awaiting staff submission';
    var extraStyle = hasIssues ? 'border-color:var(--red) !important; background:rgba(220,38,38,0.1) !important;' : '';

    html += '<button class="lifecycle-stage-btn ' + cls + '" data-stage="' + stage.id + '" onclick="toggleInlineIssueChecklistByEl(this)" title="' + title + '" style="' + extraStyle + (done ? '' : 'cursor:default;opacity:0.5') + '">';
    html += '<div style="font-size:22px">' + stage.icon + '</div>';
    html += '<div style="font-size:11px;font-weight:800;margin-top:4px">' + stage.label + '</div>';
    if (done) {
        if(hasIssues) html += '<div style="font-size:10px;color:var(--red);margin-top:2px;font-weight:700">FLAGGED</div>';
        else html += '<div style="font-size:10px;color:var(--green);margin-top:2px">&check; OK</div>';
    } else {
        html += '<div style="font-size:9px;opacity:.5">LOCKED</div>';
    }
    html += '</button>';
  });
  container.innerHTML = html;
}

function toggleInlineIssueChecklistByEl(el) {
  if (typeof toggleInlineIssueChecklist === 'function') toggleInlineIssueChecklist(el.dataset.stage);
}
window.toggleInlineIssueChecklistByEl = toggleInlineIssueChecklistByEl;

function toggleInlineIssueChecklist(stage) {
  var container = document.getElementById('issues-inline-checklist');
  if (!container) return;

  if (issueCurrentStage === stage && container.style.display === 'block') {
    container.style.display = 'none';
    issueCurrentStage = null;
    return;
  }

  issueCurrentStage = stage;
  container.style.display = 'block';

  var stageObj = LIFECYCLE_STAGES.find(function (s) { return s.id === stage; });
  var logs = allDeploymentLogs[issueSelectedEvent] || {};
  var logRecord = logs[stage];

  if (!logRecord) return; 

  var html = '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">';
  html += '<div style="font-size:24px;">' + stageObj.icon + '</div>';
  html += '<div><div style="font-size:15px;font-weight:800;color:var(--cream)">' + stageObj.label + ' Damaged & Missing Log</div>';
  html += '<div style="font-size:11px;color:var(--text-dim)">Issues flagged by ' + (logRecord.loggedBy || 'System') + ' at ' + new Date(logRecord.timestamp).toLocaleString() + '</div></div>';
  html += '</div>';

  html += '<table style="width:100%;border-collapse:collapse;font-size:12px;background:var(--bg3);border-radius:8px;overflow:hidden;">';
  html += '<thead><tr style="border-bottom:1px solid var(--border);background:var(--bg2)">';
  html += '<th style="text-align:left;padding:10px 12px;color:var(--text-dim);font-size:10px;text-transform:uppercase;letter-spacing:.8px">Equipment</th>';
  html += '<th style="padding:10px 12px;color:var(--text-dim);font-size:10px;text-transform:uppercase;text-align:center">Issue</th>';
  html += '<th style="padding:10px 12px;color:var(--text-dim);font-size:10px;text-transform:uppercase;text-align:center">Qty Affected</th>';
  html += '<th style="padding:10px 12px;color:var(--text-dim);font-size:10px;text-transform:uppercase;text-align:center">Unit Cost</th>';
  html += '<th style="padding:10px 12px;color:var(--text-dim);font-size:10px;text-transform:uppercase;text-align:right">Total Impact</th>';
  html += '</tr></thead><tbody>';

  var clist = logRecord.checklist || [];
  var issuesFound = false;

  clist.forEach(function (it) {
    var missing = parseInt(it.missingQty) || 0;
    var broken = 0;
    if (it.condition === 'broken' || it.condition === 'damaged') broken = parseInt(it.presentQty) || 0;
    
    if (missing > 0 || broken > 0) {
      issuesFound = true;
      var issueType = '';
      if(missing > 0 && broken > 0) issueType = '<span style="color:var(--red)">Missing</span> & <span style="color:var(--amber)">Broken</span>';
      else if (missing > 0) issueType = '<span style="color:var(--red)">Missing</span>';
      else issueType = '<span style="color:var(--amber)">Broken/Damaged</span>';

      var totalAffected = missing + broken;
      var cost = getAssetCost(it.assetId, it.name);
      var totalCost = totalAffected * cost;

      html += '<tr style="border-bottom:1px solid var(--border)">';
      html += '<td style="padding:12px"><div style="font-weight:600;color:var(--cream)">' + it.name + '</div>';
      html += '<div style="font-size:10px;color:var(--text-dim)">' + it.category + '</div></td>';
      html += '<td style="padding:12px;text-align:center;font-weight:700">' + issueType + '</td>';
      html += '<td style="padding:12px;text-align:center;font-weight:700;color:var(--cream)">' + totalAffected + '</td>';
      html += '<td style="padding:12px;text-align:center;font-weight:700;color:var(--text-dim)">&#8369;' + cost.toLocaleString() + '</td>';
      html += '<td style="padding:12px;text-align:right;font-weight:700;color:var(--red)">&#8369;' + totalCost.toLocaleString() + '</td>';
      html += '</tr>';
    }
  });

  if (!issuesFound) {
    html += '<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--green);font-size:13px;font-weight:600">No equipment issues reported for this stage.</td></tr>';
  }
  html += '</tbody></table>';

  container.innerHTML = html;
}


/* ============================================================
   EQUIPMENT RESUPPLY MODULE (EIM 8)
   Functions: renderResupplySection, switchResupplyTab,
   refreshResupplyNeeds, renderPurchaseOrders, renderShoppingLists,
   renderRentalDamageTab, generatePurchaseOrder, generateShoppingList,
   markSlItemBought, logSlArrival, logPoStep, confirmAllArrived,
   redirectToAddEquipment
   Data stored in window.resupplyData = { purchaseOrders, shoppingLists }
============================================================ */

/* ── In-memory store ──────────────────────────────────────── */
window.resupplyData = window.resupplyData || {
  purchaseOrders: [],   // { id, supplierName, supplierEmail, items:[{name,qty,unit,ip,assetId,issueStatus,sourceLogId}], status:'draft'|'sent'|'paid'|'received', timeSent, timePaid, timeReceived, sourceEvent, createdAt }
  shoppingLists: [],    // { id, items:[{name,qty,unit,ip,assetId,issueStatus,sourceLogId,bought,boughtAt,location,arrived,arrivedAt}], createdAt, timeShoppingStarted, allArrived, allArrivedAt, sourceEvent }
  rentalPayments: {}    // { [rentalDamageKey]: { paid, paidAt, amount, sortedOut, sortedAt } }
};

// Placeholder data for Flowchart verification (Branch I & II)
window.lifecycleLogs = window.lifecycleLogs || {
  "res_mock_1": [
    {
      stage: 'bashout',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      eventName: "Sample Wedding Bash",
      items: [
        { name: "White Tablecloth", assetId: "EQ-L001", qty: 2, status: "broken", isRented: false, supplier: "LiXia Textile Supply", initialPrice: 320 },
        { name: "Water Goblet", assetId: "EQ-G001", qty: 5, status: "missing", isRented: false, supplier: "", initialPrice: 95 }, // No supplier -> Shopping List
        { name: "Crystal Chandelier", assetId: "RNT-CHAND-1", qty: 1, status: "broken", isRented: true, rentalSupplier: "Lumina", initialPrice: 1500 }
      ]
    }
  ]
};

function seedResupplyPlaceholderData() {
  var d = window.resupplyData;
  if (!d.purchaseOrders.length) {
    d.purchaseOrders = [
      {
        id: 'PO-SAMPLE-001',
        supplierName: 'LiXia Textile Supply',
        supplierEmail: 'orders@lixia-demo.com',
        items: [
          { name: 'White Tablecloth', qty: 8, unit: 'pcs', ip: 320, assetId: 'EQ-L001', issueStatus: 'broken', sourceLogId: 'res_mock_1_0_0' },
          { name: 'Chair Cover', qty: 20, unit: 'pcs', ip: 65, assetId: 'EQ-C004', issueStatus: 'missing', sourceLogId: 'mock_po_1' }
        ],
        status: 'sent',
        timeSent: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        timePaid: null,
        timeReceived: null,
        sourceEvent: 'Sample Wedding Bash',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
      },
      {
        id: 'PO-SAMPLE-002',
        supplierName: 'Grand Banquet Fixtures',
        supplierEmail: 'ap@grandfixtures-demo.com',
        items: [
          { name: 'Foldable Cocktail Table', qty: 2, unit: 'pcs', ip: 2450, assetId: 'EQ-T011', issueStatus: 'broken', sourceLogId: 'mock_po_2' }
        ],
        status: 'received',
        timeSent: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
        timePaid: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        timeReceived: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        sourceEvent: 'Corporate Dinner Mock Event',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString()
      }
    ];
  }

  if (!d.shoppingLists.length) {
    d.shoppingLists = [
      {
        id: 'SL-SAMPLE-001',
        items: [
          { name: 'Water Goblet', qty: 12, unit: 'pcs', ip: 95, assetId: 'EQ-G001', issueStatus: 'missing', sourceLogId: 'res_mock_1_0_1', bought: true, boughtAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), location: 'Dapitan Arcade', arrived: false, arrivedAt: null },
          { name: 'Tealight Candle Holder', qty: 18, unit: 'pcs', ip: 40, assetId: 'EQ-D014', issueStatus: 'broken', sourceLogId: 'mock_sl_1', bought: false, boughtAt: null, location: '', arrived: false, arrivedAt: null }
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
        timeShoppingStarted: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        allArrived: false,
        allArrivedAt: null,
        sourceEvent: 'Sample Wedding Bash'
      }
    ];
  }

  if (!Object.keys(d.rentalPayments || {}).length) {
    d.rentalPayments = {
      'res_mock_1_0_2': {
        paid: true,
        paidAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        amount: 1500,
        sortedOut: false,
        sortedAt: null
      }
    };
  }
}
seedResupplyPlaceholderData();


/* ── Entry point ──────────────────────────────────────────── */
function renderResupplySection() {
  refreshResupplyStats();
  refreshResupplyNeeds();
  renderPurchaseOrders();
  renderShoppingLists();
  renderRentalDamageTab();
}
window.renderResupplySection = renderResupplySection;

/* ── Tab switcher ─────────────────────────────────────────── */
function switchResupplyTab(tab, btn) {
  document.querySelectorAll('.resupply-tab').forEach(function (t) { t.classList.remove('active'); });
  btn.classList.add('active');
  document.getElementById('resupply-pane-owned').style.display = (tab === 'owned') ? '' : 'none';
  document.getElementById('resupply-pane-rental').style.display = (tab === 'rental') ? '' : 'none';
}
window.switchResupplyTab = switchResupplyTab;

/* ── Stats row ────────────────────────────────────────────── */
function refreshResupplyStats() {
  var d = window.resupplyData;
  var pendingPO = d.purchaseOrders.filter(function (p) { return p.status !== 'received'; }).length;
  var activeSL = d.shoppingLists.filter(function (s) { return !s.allArrived; }).length;
  var awaitArr = d.purchaseOrders.filter(function (p) { return p.status === 'paid'; }).length
    + d.shoppingLists.filter(function (s) { return !s.allArrived && s.items.every(function (i) { return i.bought; }) }).length;
  var done = d.purchaseOrders.filter(function (p) { return p.status === 'received'; }).length
    + d.shoppingLists.filter(function (s) { return s.allArrived; }).length;

  var el;
  el = document.getElementById('rs-stat-po'); if (el) el.textContent = pendingPO;
  el = document.getElementById('rs-stat-sl'); if (el) el.textContent = activeSL;
  el = document.getElementById('rs-stat-arrive'); if (el) el.textContent = awaitArr;
  el = document.getElementById('rs-stat-done'); if (el) el.textContent = done;

  el = document.getElementById('rs-po-count-badge'); if (el) el.textContent = pendingPO + ' Active';
  el = document.getElementById('rs-sl-count-badge'); if (el) el.textContent = activeSL + ' Active';

  // rental stats
  var allFlags = [];
  Object.values(window.lifecycleLogs || {}).forEach(function (logs) {
    logs.forEach(function (log) {
      (log.items || []).forEach(function (item) {
        if (item.isRented && (item.status === 'broken' || item.status === 'missing')) allFlags.push(item);
      });
    });
  });
  var rPaid = Object.values(d.rentalPayments).filter(function (p) { return p.paid; }).length;
  var rPending = allFlags.length - rPaid;
  el = document.getElementById('rs-rent-broken'); if (el) el.textContent = allFlags.length;
  el = document.getElementById('rs-rent-pending'); if (el) el.textContent = Math.max(0, rPending);
  el = document.getElementById('rs-rent-paid'); if (el) el.textContent = rPaid;

  var badge = document.getElementById('resupply-sidebar-badge');
  if (badge) { badge.style.display = (pendingPO + activeSL + rPending > 0) ? '' : 'none'; }
}

/* ── Needs panel: scan resolved issues for broken/missing owned items ─ */
function refreshResupplyNeeds() {
  var el = document.getElementById('rs-needs-container');
  if (!el) return;

  var allItems = [];
  // Walk every lifecycle log for broken/missing owned equipment
  Object.entries(window.lifecycleLogs || {}).forEach(function (entry) {
    var resId = entry[0];
    var logs = entry[1];
    var resLabel = resId;
    var allRes = window.reservations || [];
    var found = allRes.find(function (r) { return r.id === resId; });
    if (found) resLabel = (found.clientName || found.name || resId) + ' — ' + (found.eventDate || found.date || '');

    logs.forEach(function (log, lIdx) {
      if (!log.items) return;
      log.items.forEach(function (item, iIdx) {
        // FLOWCHART: Only show items that are NOT yet resolved/resupplied (Flagged)
        if (!item.isRented && (item.status === 'broken' || item.status === 'missing') && !item.resupplyResolved) {
          allItems.push({
            resId: resId,
            logIdx: lIdx,
            itemIdx: iIdx,
            sourceLogId: resId + '_' + lIdx + '_' + iIdx,
            resLabel: resLabel,
            stage: log.stage || '—',
            stageTime: log.timestamp || '',
            name: item.name || item.assetName || '—',
            assetId: item.assetId || '',
            qty: item.qty || item.quantity || 1,
            unit: item.unit || 'pcs',
            status: item.status,
            ip: item.ip || item.initialPrice || 0,
            supplier: item.supplier || '',
            hasSupplier: !!(item.supplier && item.supplier.trim())
          });
        }
      });
    });
  });


  // Also pull from manual flags
  Object.values(window.issueFlags || {}).forEach(function (flags) {
    flags.forEach(function (f) {
      if (f.flagType === 'damage' || f.flagType === 'missing') {
        // find asset
        var assets = window.equipmentAssets || [];
        var asset = assets.find(function (a) { return a.id === f.assetId || a.name === f.assetName; });
        allItems.push({
          resId: f.reservationId || '',
          resLabel: f.reservationLabel || f.reservationId || 'Manual Flag',
          stage: 'Manual Report',
          stageTime: f.timestamp || f.flaggedAt || '',
          name: f.assetName || f.flagName || '—',
          assetId: f.assetId || '',
          qty: f.qty || 1,
          unit: 'pcs',
          status: f.flagType === 'missing' ? 'missing' : 'broken',
          ip: asset ? (asset.ip || asset.initialPrice || 0) : 0,
          supplier: asset ? (asset.supplier || '') : '',
          hasSupplier: !!(asset && asset.supplier && asset.supplier.trim())
        });
      }
    });
  });

  if (!allItems.length) {
    el.innerHTML = '<div style="text-align:center;padding:36px;color:var(--text-dim);font-size:13px;"> No items currently require resupply. Broken or missing equipment from lifecycle logs will appear here once issues are recorded.</div>';
    return;
  }

  var html = '';
  allItems.forEach(function (item, idx) {
    var statusColor = item.status === 'missing' ? 'var(--red)' : 'var(--amber)';
    var statusLabel = item.status === 'missing' ? ' Missing' : ' Broken';
    var stageTs = item.stageTime ? new Date(item.stageTime).toLocaleString() : '—';
    html += '<div class="rs-need-row">';
    html += '<div style="flex:1;min-width:0;">';
    html += '<div style="font-size:13px;font-weight:600;color:var(--cream);">' + escHtml(item.name) + ' <span style="font-size:11px;color:var(--text-dim);">(' + escHtml(item.assetId) + ')</span></div>';
    html += '<div style="font-size:11px;color:var(--text-dim);margin-top:2px;">Qty: <strong style="color:var(--text-mid);">' + item.qty + ' ' + item.unit + '</strong> &middot; Event: ' + escHtml(item.resLabel) + ' &middot; Stage: ' + escHtml(item.stage) + '</div>';
    html += '<div style="font-size:11px;color:var(--text-dim);">Acknowledged: ' + stageTs + (item.supplier ? ' &middot; Supplier: <strong style="color:var(--text-mid);">' + escHtml(item.supplier) + '</strong>' : ' &middot; <span style="color:var(--amber);">No supplier — will go to shopping list</span>') + '</div>';
    html += '</div>';
    html += '<div style="display:flex;gap:8px;align-items:center;flex-shrink:0;">';
    html += '<span style="font-size:11px;font-weight:700;color:' + statusColor + ';background:rgba(0,0,0,0.18);padding:3px 10px;border-radius:20px;">' + statusLabel + '</span>';
    if (item.hasSupplier) {
      html += '<button class="btn-outline" style="padding:5px 12px;font-size:11px;white-space:nowrap;" onclick="generatePurchaseOrderFromItem(' + idx + ')"> Generate PO</button>';
    } else {
      html += '<button class="btn-outline" style="padding:5px 12px;font-size:11px;white-space:nowrap;" onclick="generateShoppingListFromItem(' + idx + ')"> Add to Shopping List</button>';
    }
    html += '</div></div>';
  });

  // Batch buttons
  var withSupplier = allItems.filter(function (i) { return i.hasSupplier; });
  var withoutSupplier = allItems.filter(function (i) { return !i.hasSupplier; });
  var batchHtml = '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;padding-top:14px;border-top:1px solid var(--border);">';
  if (withSupplier.length) batchHtml += '<button class="btn-primary" style="font-size:12px;" onclick="generateAllPurchaseOrders()"> Generate All POs (' + withSupplier.length + ' items)</button>';
  if (withoutSupplier.length) batchHtml += '<button class="btn-outline" style="font-size:12px;" onclick="generateAllShoppingLists()"> Generate Shopping Lists (' + withoutSupplier.length + ' items)</button>';
  batchHtml += '</div>';

  el.innerHTML = html + batchHtml;
  // store for batch use
  window._resupplyNeedItems = allItems;
}
window.refreshResupplyNeeds = refreshResupplyNeeds;

/* ── Generate PO for a single item ─────────────────────────── */
function generatePurchaseOrderFromItem(idx) {
  var item = (window._resupplyNeedItems || [])[idx];
  if (!item) return;
  _createOrAppendPO([item]);
}
window.generatePurchaseOrderFromItem = generatePurchaseOrderFromItem;

function generateShoppingListFromItem(idx) {
  var item = (window._resupplyNeedItems || [])[idx];
  if (!item) return;
  _createOrAppendSL([item]);
}
window.generateShoppingListFromItem = generateShoppingListFromItem;

function generateAllPurchaseOrders() {
  var items = (window._resupplyNeedItems || []).filter(function (i) { return i.hasSupplier; });
  if (!items.length) return;
  // group by supplier
  var bySupplier = {};
  items.forEach(function (item) {
    var key = item.supplier;
    if (!bySupplier[key]) bySupplier[key] = [];
    bySupplier[key].push(item);
  });
  Object.keys(bySupplier).forEach(function (sup) { _createOrAppendPO(bySupplier[sup]); });
}
window.generateAllPurchaseOrders = generateAllPurchaseOrders;

function generateAllShoppingLists() {
  var items = (window._resupplyNeedItems || []).filter(function (i) { return !i.hasSupplier; });
  if (!items.length) return;
  _createOrAppendSL(items);
}
window.generateAllShoppingLists = generateAllShoppingLists;

function _createOrAppendPO(items) {
  var d = window.resupplyData;
  var supplier = items[0].supplier;
  // check if an open draft PO for this supplier already exists
  var existing = d.purchaseOrders.find(function (p) { return p.supplierName === supplier && p.status === 'draft'; });
  if (existing) {
    items.forEach(function (item) {
      existing.items.push({ name: item.name, qty: item.qty, unit: item.unit, ip: item.ip, assetId: item.assetId, issueStatus: item.status });
    });
  } else {
    var poId = 'PO-' + Date.now();
    d.purchaseOrders.push({
      id: poId,
      supplierName: supplier,
      supplierEmail: '',
      items: items.map(function (i) { return { name: i.name, qty: i.qty, unit: i.unit, ip: i.ip, assetId: i.assetId, issueStatus: i.status, sourceLogId: i.sourceLogId }; }),
      status: 'draft',
      timeSent: null,
      timePaid: null,
      timeReceived: null,
      sourceEvent: items.map(function (i) { return i.resLabel; }).join(', '),
      createdAt: new Date().toISOString()
    });
  }
  refreshResupplyStats();
  renderPurchaseOrders();
  showToast(' Purchase Order created for ' + supplier);
}

function _createOrAppendSL(items) {
  var d = window.resupplyData;
  var existing = d.shoppingLists.find(function (s) { return !s.allArrived; });
  var slItems = items.map(function (i) { return { name: i.name, qty: i.qty, unit: i.unit, ip: i.ip, assetId: i.assetId, issueStatus: i.status, sourceLogId: i.sourceLogId, bought: false, boughtAt: null, location: '', arrived: false, arrivedAt: null }; });
  if (existing) {
    slItems.forEach(function (si) { existing.items.push(si); });
  } else {
    var slId = 'SL-' + Date.now();
    d.shoppingLists.push({
      id: slId,
      items: slItems,
      createdAt: new Date().toISOString(),
      allArrived: false,
      allArrivedAt: null,
      sourceEvent: items.map(function (i) { return i.resLabel; }).join(', ')
    });
  }
  refreshResupplyStats();
  renderShoppingLists();
  showToast(' Shopping list updated');
}

/* ── Purchase Orders renderer ────────────────────────────────── */
function renderPurchaseOrders() {
  var el = document.getElementById('rs-po-container');
  if (!el) return;
  var orders = window.resupplyData.purchaseOrders;
  if (!orders.length) {
    el.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-dim);font-size:13px;">No purchase orders yet. Generate one from the items above.</div>';
    return;
  }
  var html = '';
  orders.forEach(function (po) {
    var statusClass = 'rs-status-' + po.status;
    var statusLabel = { draft: 'Draft', sent: 'Sent to Supplier', paid: 'Payment Sent', received: 'Items Received' }[po.status] || po.status;
    var itemsText = po.items.map(function (i) { return i.qty + ' ' + i.unit + ' ' + i.name; }).join(' | ');
    // timeline steps
    var steps = [
      { label: 'PO Created', time: po.createdAt, done: !!po.createdAt },
      { label: 'Sent to Supplier', time: po.timeSent, done: !!po.timeSent },
      { label: 'Payment Sent', time: po.timePaid, done: !!po.timePaid },
      { label: 'Items Received', time: po.timeReceived, done: !!po.timeReceived }
    ];
    html += '<div class="rs-po-card rs-status-' + po.status + '">';
    // head
    html += '<div class="rs-po-head"><div>';
    html += '<div class="rs-po-number">' + escHtml(po.id) + '</div>';
    html += '<div class="rs-po-supplier">Supplier: <strong>' + escHtml(po.supplierName) + '</strong>' + (po.supplierEmail ? ' &lt;' + escHtml(po.supplierEmail) + '&gt;' : '') + '</div>';
    html += '</div><span class="rs-status-badge ' + po.status + '">' + statusLabel + '</span></div>';
    // items
    html += '<div class="rs-po-items-list">' + escHtml(itemsText) + '</div>';
    html += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:10px;">Source: ' + escHtml(po.sourceEvent || '—') + '</div>';
    // timeline
    html += '<div class="rs-po-timeline">';
    steps.forEach(function (step, i) {
      var dotClass = step.done ? 'rs-step-done' : (i > 0 && steps[i - 1].done ? 'rs-step-active' : '');
      html += '<div class="rs-po-step">';
      html += '<div class="rs-po-step-dot ' + dotClass + '">' + (step.done ? '✓' : '') + '</div>';
      html += '<div class="rs-po-step-label">' + step.label + '</div>';
      html += '<div class="rs-po-step-time">' + (step.time ? new Date(step.time).toLocaleString() : '—') + '</div>';
      html += '</div>';
      if (i < steps.length - 1) {
        html += '<div class="rs-po-step-line ' + (step.done ? 'rs-line-done' : '') + '"></div>';
      }
    });
    html += '</div>';
    // email field (if draft)
    if (po.status === 'draft') {
      html += '<div style="margin:10px 0 6px;display:flex;gap:8px;align-items:center;">';
      html += '<input type="email" id="po-email-' + po.id + '" class="input-field" style="flex:1;font-size:12px;" placeholder="Supplier email address..." value="' + escHtml(po.supplierEmail || '') + '"/>';
      html += '<button class="btn-primary" style="font-size:12px;white-space:nowrap;" onclick="sendPurchaseOrder(\'' + po.id + '\')"> Send PO</button>';
      html += '</div>';
    }
    // actions
    html += '<div class="rs-po-actions">';
    if (po.status === 'sent') {
      html += '<button class="btn-outline" style="font-size:12px;" onclick="logPoStep(\'' + po.id + '\',\'paid\')"> Log Payment Sent</button>';
    }
    if (po.status === 'paid') {
      html += '<button class="btn-outline" style="font-size:12px;" onclick="logPoStep(\'' + po.id + '\',\'received\')"> Log Items Received</button>';
    }
    if (po.status === 'received') {
      var sourceIds = po.items.map(function (i) { return i.sourceLogId; });
      html += '<div style="display:flex;flex-direction:column;gap:8px;">';
      html += '<button class="btn-primary" style="font-size:12px;" onclick="redirectToAddEquipmentFromPO(\'' + po.id + '\')"> Add to Equipment Assets →</button>';
      html += '<button class="btn-outline" style="font-size:12px;border-color:var(--green);color:var(--green);" onclick="clearResupplyFlags([' + sourceIds.map(function (id) { return '\'' + id + '\''; }).join(',') + '])">System Clear the Flags (Owned)</button>';
      html += '</div>';
    }
    html += '<button class="btn-outline" style="font-size:12px;" onclick="printPO(\'' + po.id + '\')">️ Print / Export</button>';
    html += '</div>';
    html += '</div>';
  });
  el.innerHTML = html;
}
window.renderPurchaseOrders = renderPurchaseOrders;

/* Send PO (logs timeSent, updates status) */
function sendPurchaseOrder(poId) {
  var d = window.resupplyData;
  var po = d.purchaseOrders.find(function (p) { return p.id === poId; });
  if (!po) return;
  var emailEl = document.getElementById('po-email-' + poId);
  var email = emailEl ? emailEl.value.trim() : '';
  if (!email) { alert('Please enter the supplier\'s email address before sending.'); return; }
  po.supplierEmail = email;
  po.status = 'sent';
  po.timeSent = new Date().toISOString();
  // Simulate email send
  showToast(' Purchase Order ' + poId + ' sent to ' + email);
  _savePOToFirebase(po);
  refreshResupplyStats();
  renderPurchaseOrders();
}
window.sendPurchaseOrder = sendPurchaseOrder;

/* Log a PO step (paid / received) */
function logPoStep(poId, step) {
  var d = window.resupplyData;
  var po = d.purchaseOrders.find(function (p) { return p.id === poId; });
  if (!po) return;
  var now = new Date().toISOString();
  if (step === 'paid') { po.timePaid = now; po.status = 'paid'; }
  if (step === 'received') { po.timeReceived = now; po.status = 'received'; }
  _savePOToFirebase(po);
  refreshResupplyStats();
  renderPurchaseOrders();
  showToast(step === 'paid' ? ' Payment logged' : ' Items received — ready to add to inventory');
}
window.logPoStep = logPoStep;

/* FLOWCHART: Log Time of Shopping */
function logStartShopping(slId) {
  var sl = window.resupplyData.shoppingLists.find(function (s) { return s.id === slId; });
  if (!sl) return;
  sl.timeShoppingStarted = new Date().toISOString();
  showToast(' Shopping trip started — Logged time.');
  renderShoppingLists();
  refreshResupplyStats();
}
window.logStartShopping = logStartShopping;

/* FLOWCHART: System Clears the Flags */
function clearResupplyFlags(sourceIds) {
  if (!sourceIds || !sourceIds.length) return;
  sourceIds.forEach(function (sid) {
    if (!sid) return;
    var parts = sid.split('_'); // [resId, logIdx, itemIdx]
    var rid = parts[0], lIdx = parseInt(parts[1]), iIdx = parseInt(parts[2]);
    if (window.lifecycleLogs[rid] && window.lifecycleLogs[rid][lIdx]) {
      var log = window.lifecycleLogs[rid][lIdx];
      if (log.items && log.items[iIdx]) {
        // Flag cleared!
        log.items[iIdx].resupplyResolved = true;
        log.items[iIdx].resupplyResolvedAt = new Date().toISOString();
      }
    }
  });
  showToast(' Resupply complete — System cleared the flags.');
  refreshResupplyNeeds();
  refreshResupplyStats();
}
window.clearResupplyFlags = clearResupplyFlags;

function printPO(poId) {
  var d = window.resupplyData;
  var po = d.purchaseOrders.find(function (p) { return p.id === poId; });
  if (!po) return;
  var win = window.open('', '_blank');
  var rows = po.items.map(function (i) { return '<tr><td>' + escHtml(i.name) + '</td><td>' + i.qty + ' ' + i.unit + '</td><td>₱' + (i.ip || 0) + '</td><td>₱' + (i.qty * (i.ip || 0)) + '</td></tr>'; }).join('');
  var total = po.items.reduce(function (s, i) { return s + i.qty * (i.ip || 0); }, 0);
  win.document.write('<html><head><title>Purchase Order ' + po.id + '</title><style>body{font-family:sans-serif;padding:32px;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ccc;padding:8px;text-align:left;}th{background:#f5f5f5;}</style></head><body>');
  win.document.write('<h2>PURCHASE ORDER — ' + po.id + '</h2>');
  win.document.write('<p><strong>Supplier:</strong> ' + escHtml(po.supplierName) + (po.supplierEmail ? ' &lt;' + escHtml(po.supplierEmail) + '&gt;' : '') + '</p>');
  win.document.write('<p><strong>Date Sent:</strong> ' + (po.timeSent ? new Date(po.timeSent).toLocaleString() : 'Not yet sent') + '</p>');
  win.document.write('<p><strong>Source:</strong> ' + escHtml(po.sourceEvent || '—') + '</p>');
  win.document.write('<table><thead><tr><th>Item</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead><tbody>' + rows + '</tbody></table>');
  win.document.write('<p style="margin-top:16px;"><strong>Total: ₱' + total + '</strong></p>');
  win.document.write('</body></html>');
  win.document.close();
  win.print();
}
window.printPO = printPO;

async function _savePOToFirebase(po) {
  try {
    if (!window.firebaseDB || !window.firebaseFns) return;
    var fns = window.firebaseFns;
    var ref = fns.doc(window.firebaseDB, 'purchaseOrders', po.id);
    await fns.setDoc(ref, po);
  } catch (e) { }
}

/* ── Shopping Lists renderer ─────────────────────────────────── */
function renderShoppingLists() {
  var el = document.getElementById('rs-sl-container');
  if (!el) return;
  var lists = window.resupplyData.shoppingLists;
  if (!lists.length) {
    el.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-dim);font-size:13px;">No shopping lists yet. Items without a supplier will be added here automatically.</div>';
    return;
  }
  var html = '';
  lists.forEach(function (sl) {
    var boughtCount = sl.items.filter(function (i) { return i.bought; }).length;
    var arrivedCount = sl.items.filter(function (i) { return i.arrived; }).length;
    var allBought = boughtCount === sl.items.length;
    var cardClass = sl.allArrived ? 'rs-sl-card rs-sl-arrived' : 'rs-sl-card';
    // FLOWCHART: Log the time of shopping
    if (!sl.timeShoppingStarted && !sl.allArrived) {
      html += '<div style="margin-bottom:12px;padding:12px;background:rgba(196,154,60,0.1);border-radius:10px;text-align:center;">';
      html += '<div style="font-size:12px;color:var(--text-dim);margin-bottom:8px;">Ready to go shopping? Log the start time below.</div>';
      html += '<button class="btn-primary" style="font-size:12px;padding:6px 16px;" onclick="logStartShopping(\'' + sl.id + '\')"> Start Shopping Trip</button>';
      html += '</div>';
    } else if (sl.timeShoppingStarted) {
      html += '<div style="font-size:11px;color:var(--gold);margin-bottom:10px;font-style:italic;">Shopping started at: ' + new Date(sl.timeShoppingStarted).toLocaleString() + '</div>';
    }

    // items
    sl.items.forEach(function (item, iIdx) {
      var itemClass = item.arrived ? 'rs-sl-item rs-item-arrived' : (item.bought ? 'rs-sl-item rs-item-bought' : 'rs-sl-item');
      html += '<div class="' + itemClass + '" id="sl-item-' + sl.id + '-' + iIdx + '">';
      html += '<div>';
      html += '<div class="rs-sl-item-name">' + escHtml(item.name) + '</div>';
      html += '<div class="rs-sl-item-sub">Qty: ' + item.qty + ' ' + item.unit + (item.ip ? ' &middot; Est. ₱' + item.ip + ' each' : '') + ' &middot; Issue: <span style="color:var(--red);">' + item.issueStatus + '</span>';
      if (item.bought) html += ' &middot; <span style="color:var(--green);">✓ Bought</span> at ' + escHtml(item.location || '—') + ' on ' + new Date(item.boughtAt).toLocaleString();
      if (item.arrived) html += ' &middot; <span style="color:var(--green);">✓ Arrived ' + new Date(item.arrivedAt).toLocaleString() + '</span>';
      html += '</div>';
      // location input row (only if not yet bought)
      if (!item.bought) {
        html += '<div class="rs-sl-location-row">';
        html += '<input type="text" class="rs-sl-location-input" id="sl-loc-' + sl.id + '-' + iIdx + '" placeholder="Where is this being bought? (required before marking bought)" value="' + escHtml(item.location || '') + '" oninput="cacheSlLocation(\'' + sl.id + '\',' + iIdx + ',this.value)"/>';
        html += '</div>';
      }
      html += '</div>';
      // action buttons
      html += '<div class="rs-sl-actions">';
      if (!item.bought) {
        // Only allow marking bought if shopping has started
        var disabled = !sl.timeShoppingStarted ? 'disabled title="Click Start Shopping first"' : '';
        html += '<button class="btn-primary" style="font-size:11px;padding:5px 12px;white-space:nowrap;" ' + disabled + ' onclick="markSlItemBought(\'' + sl.id + '\',' + iIdx + ')">✓ Mark Bought</button>';
      } else if (!item.arrived) {
        html += '<button class="btn-outline" style="font-size:11px;padding:5px 12px;white-space:nowrap;color:var(--green);border-color:rgba(45,138,78,0.4);" onclick="markSlItemArrived(\'' + sl.id + '\',' + iIdx + ')"> Log Arrived</button>';
      } else {
        html += '<span style="font-size:11px;color:var(--green);font-weight:600;">✓ Arrived</span>';
      }
      html += '</div>';
      html += '</div>';
    });

    // Arrival banner: shown when all items bought but not all arrived
    if (allBought && !sl.allArrived) {
      var allArrivedNow = sl.items.every(function (i) { return i.arrived; });
      if (!allArrivedNow) {
        html += '<div class="rs-arrival-banner">';
        html += '<div><div style="font-size:13px;font-weight:700;color:var(--cream);">All items purchased — log arrivals above</div><div style="font-size:11px;color:var(--text-dim);margin-top:3px;">Mark each item as arrived once it is received. Once all items arrive, you\'ll be redirected to add them to inventory.</div></div>';
        html += '</div>';
      } else {
        html += '<div class="rs-arrival-banner">';
        html += '<div><div style="font-size:13px;font-weight:700;color:var(--cream);"> All items purchased and arrived</div><div style="font-size:11px;color:var(--text-dim);margin-top:3px;">Ready to add to equipment inventory.</div></div>';
        html += '<button class="rs-btn-arrive" onclick="confirmAllArrivedSL(\'' + sl.id + '\')"> Add to Equipment Assets →</button>';
        html += '</div>';
      }
    }
    if (sl.allArrived) {
      var sourceIds = sl.items.map(function (i) { return i.sourceLogId; });
      html += '<div style="margin-top:10px;padding:12px 14px;background:rgba(45,138,78,0.1);border:1px solid rgba(45,138,78,0.3);border-radius:9px;">';
      html += '<div style="font-size:12px;color:var(--green);margin-bottom:8px;"> All items arrived ' + new Date(sl.allArrivedAt).toLocaleString() + ' — Added to inventory.</div>';
      html += '<button class="btn-primary" style="font-size:12px;width:100%;" onclick="clearResupplyFlags([' + sourceIds.map(function (id) { return '\'' + id + '\''; }).join(',') + '])">System Clear the Flags (Owned)</button>';
      html += '</div>';
    }
    html += '</div>';
  });
  el.innerHTML = html;
}
window.renderShoppingLists = renderShoppingLists;

/* Cache location input while user types */
function cacheSlLocation(slId, iIdx, val) {
  var sl = window.resupplyData.shoppingLists.find(function (s) { return s.id === slId; });
  if (!sl) return;
  sl.items[iIdx].location = val;
}
window.cacheSlLocation = cacheSlLocation;

/* Mark item as bought — requires location */
function markSlItemBought(slId, iIdx) {
  var sl = window.resupplyData.shoppingLists.find(function (s) { return s.id === slId; });
  if (!sl) return;
  var item = sl.items[iIdx];
  var locEl = document.getElementById('sl-loc-' + slId + '-' + iIdx);
  var location = (locEl ? locEl.value.trim() : item.location || '').trim();
  if (!location) {
    alert('Please enter where this item is being purchased before marking it as bought.');
    if (locEl) { locEl.focus(); locEl.style.borderColor = 'var(--red)'; setTimeout(function () { locEl.style.borderColor = ''; }, 2000); }
    return;
  }
  item.bought = true;
  item.boughtAt = new Date().toISOString();
  item.location = location;
  _saveSLToFirebase(sl);
  renderShoppingLists();
  showToast('✓ ' + item.name + ' marked as bought at ' + location);
}
window.markSlItemBought = markSlItemBought;

/* Mark item as arrived */
function markSlItemArrived(slId, iIdx) {
  var sl = window.resupplyData.shoppingLists.find(function (s) { return s.id === slId; });
  if (!sl) return;
  var item = sl.items[iIdx];
  item.arrived = true;
  item.arrivedAt = new Date().toISOString();
  // check if all arrived
  if (sl.items.every(function (i) { return i.arrived; })) {
    sl.allArrived = true;
    sl.allArrivedAt = new Date().toISOString();
    showToast(' All items arrived! Redirecting to add to equipment assets...');
    _saveSLToFirebase(sl);
    renderShoppingLists();
    refreshResupplyStats();
    setTimeout(function () { redirectToAddEquipmentFromSL(slId); }, 1800);
    return;
  }
  _saveSLToFirebase(sl);
  renderShoppingLists();
  refreshResupplyStats();
  showToast(' ' + item.name + ' arrival logged');
}
window.markSlItemArrived = markSlItemArrived;

/* Confirm all arrived (batch button) */
function confirmAllArrivedSL(slId) {
  var sl = window.resupplyData.shoppingLists.find(function (s) { return s.id === slId; });
  if (!sl) return;
  var now = new Date().toISOString();
  sl.items.forEach(function (i) { if (!i.arrived) { i.arrived = true; i.arrivedAt = now; } });
  sl.allArrived = true;
  sl.allArrivedAt = now;
  _saveSLToFirebase(sl);
  renderShoppingLists();
  refreshResupplyStats();
  setTimeout(function () { redirectToAddEquipmentFromSL(slId); }, 800);
}
window.confirmAllArrivedSL = confirmAllArrivedSL;

/* Redirect to Equipment Assets with pre-filled items */
function redirectToAddEquipmentFromSL(slId) {
  var sl = window.resupplyData.shoppingLists.find(function (s) { return s.id === slId; });
  if (!sl) return;
  _openBulkAddEquipmentModal(sl.items, 'shopping list ' + slId);
}
window.redirectToAddEquipmentFromSL = redirectToAddEquipmentFromSL;

function redirectToAddEquipmentFromPO(poId) {
  var d = window.resupplyData;
  var po = d.purchaseOrders.find(function (p) { return p.id === poId; });
  if (!po) return;
  _openBulkAddEquipmentModal(po.items, 'purchase order ' + poId + ' from ' + po.supplierName);
}
window.redirectToAddEquipmentFromPO = redirectToAddEquipmentFromPO;

/* Bulk add modal — generated list of newly arrived items */
function _openBulkAddEquipmentModal(items, source) {
  var existing = document.getElementById('bulk-add-overlay');
  if (existing) existing.remove();
  var existingM = document.getElementById('bulk-add-modal');
  if (existingM) existingM.remove();

  var overlay = document.createElement('div');
  overlay.id = 'bulk-add-overlay';
  overlay.className = 'modal-overlay';
  overlay.style.display = 'flex';
  document.body.appendChild(overlay);

  var modal = document.createElement('div');
  modal.id = 'bulk-add-modal';
  modal.className = 'modal eim-modal';
  modal.style.maxWidth = '720px';

  var rows = items.map(function (item, idx) {
    return '<tr id="bulk-row-' + idx + '">' +
      '<td><input type="text" class="input-field" style="font-size:12px;" id="bulk-name-' + idx + '" value="' + escHtml(item.name || '') + '"/></td>' +
      '<td><input type="number" class="input-field" style="font-size:12px;width:70px;" id="bulk-qty-' + idx + '" value="' + (item.qty || 1) + '"/></td>' +
      '<td><select class="input-field" style="font-size:12px;" id="bulk-unit-' + idx + '"><option value="pcs" ' + (item.unit === 'pcs' ? 'selected' : '') + '>pcs</option><option value="sets" ' + (item.unit === 'sets' ? 'selected' : '') + '>sets</option><option value="units">units</option></select></td>' +
      '<td><input type="number" class="input-field" style="font-size:12px;width:80px;" id="bulk-ip-' + idx + '" value="' + (item.ip || 0) + '" placeholder="₱"/></td>' +
      '<td><input type="text" class="input-field" style="font-size:12px;" id="bulk-sup-' + idx + '" value="' + escHtml(item.supplier || item.supplierName || source || '') + '"/></td>' +
      '<td><input type="datetime-local" class="input-field" style="font-size:11px;" id="bulk-date-' + idx + '" value="' + new Date().toISOString().slice(0, 16) + '"/></td>' +
      '</tr>';
  }).join('');

  modal.innerHTML = '<div class="modal-hdr"><div><div class="modal-title"> Add Resupplied Equipment to Inventory</div><div style="font-size:12px;color:var(--text-dim);margin-top:3px;">From: ' + escHtml(source) + ' — verify details and confirm addition</div></div><button class="modal-close" onclick="document.getElementById(\'bulk-add-modal\').remove();document.getElementById(\'bulk-add-overlay\').remove();">✕</button></div>' +
    '<div class="modal-body" style="max-height:65vh;overflow-y:auto;">' +
    '<div style="font-size:12px;color:var(--text-dim);margin-bottom:12px;padding:10px 14px;background:rgba(196,154,60,0.06);border-radius:8px;border:1px solid var(--border);"> Review each item below. Edit any details as needed, then click <strong style="color:var(--cream);">Confirm &amp; Add All to Inventory</strong>. Each item will be registered as a new asset with the time of resupply logged.</div>' +
    '<div style="overflow-x:auto;"><table class="inv-table"><thead><tr><th>Item Name</th><th>Qty</th><th>Unit</th><th>Price (₱)</th><th>Supplier / Source</th><th>Resupplied At</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '</div>' +
    '<div style="display:flex;justify-content:flex-end;gap:10px;padding:16px 20px;border-top:1px solid var(--border);">' +
    '<button class="btn-outline" onclick="document.getElementById(\'bulk-add-modal\').remove();document.getElementById(\'bulk-add-overlay\').remove();">Cancel</button>' +
    '<button class="btn-primary" onclick="submitBulkAddEquipment(' + items.length + ',\'' + escHtml(source) + '\')"> Confirm &amp; Add All to Inventory</button>' +
    '</div>';

  document.body.appendChild(modal);
}
window._openBulkAddEquipmentModal = _openBulkAddEquipmentModal;

function submitBulkAddEquipment(count, source) {
  var added = [];
  for (var i = 0; i < count; i++) {
    var name = (document.getElementById('bulk-name-' + i) || {}).value || '—';
    var qty = parseInt((document.getElementById('bulk-qty-' + i) || {}).value || 1);
    var unit = (document.getElementById('bulk-unit-' + i) || {}).value || 'pcs';
    var ip = parseFloat((document.getElementById('bulk-ip-' + i) || {}).value || 0);
    var sup = (document.getElementById('bulk-sup-' + i) || {}).value || '';
    var dateVal = (document.getElementById('bulk-date-' + i) || {}).value || new Date().toISOString();
    var newAsset = {
      id: 'EQ-RS-' + Date.now() + '-' + i,
      name: name,
      quantity: qty,
      unit: unit,
      ip: ip,
      initialPrice: ip,
      supplier: sup,
      category: 'Resupplied',
      condition: 'Good',
      status: 'Available',
      resuppliedAt: dateVal,
      resupplySource: source,
      addedAt: new Date().toISOString()
    };
    if (!window.equipmentAssets) window.equipmentAssets = [];
    window.equipmentAssets.push(newAsset);
    added.push(newAsset);
    _saveAssetToFirebase(newAsset);
  }
  document.getElementById('bulk-add-modal').remove();
  document.getElementById('bulk-add-overlay').remove();
  showToast(' ' + added.length + ' item(s) added to Equipment Assets');
  // redirect to equipment section
  showSection('equipment', document.getElementById('nav-equipment'));
  if (typeof renderEIMTable === 'function') renderEIMTable();
}
window.submitBulkAddEquipment = submitBulkAddEquipment;

async function _saveAssetToFirebase(asset) {
  try {
    if (!window.firebaseDB || !window.firebaseFns) return;
    var fns = window.firebaseFns;
    var ref = fns.doc(window.firebaseDB, 'equipmentAssets', asset.id);
    await fns.setDoc(ref, asset);
  } catch (e) { }
}

async function _saveSLToFirebase(sl) {
  try {
    if (!window.firebaseDB || !window.firebaseFns) return;
    var fns = window.firebaseFns;
    var ref = fns.doc(window.firebaseDB, 'shoppingLists', sl.id);
    await fns.setDoc(ref, sl);
  } catch (e) { }
}

/* ── Rental Damage Tab (Branch II) ────────────────────────── */
function renderRentalDamageTab() {
  var el = document.getElementById('rs-rental-container');
  if (!el) return;

  var damagedRentals = [];
  Object.entries(window.lifecycleLogs || {}).forEach(function (entry) {
    var resId = entry[0];
    var logs = entry[1];
    var allRes = window.reservations || [];
    var found = allRes.find(function (r) { return r.id === resId; });
    var resLabel = found ? ((found.clientName || found.name || resId) + ' — ' + (found.eventDate || found.date || '')) : resId;

    logs.forEach(function (log, lIdx) {
      if (!log.items) return;
      log.items.forEach(function (item, iIdx) {
        if (item.isRented && (item.status === 'broken' || item.status === 'missing')) {
          var key = resId + '_' + lIdx + '_' + iIdx;
          var payRec = window.resupplyData.rentalPayments[key] || { paid: false, sortedOut: false };

          // FLOWCHART: Only show if NOT yet sorted out
          if (!payRec.sortedOut) {
            damagedRentals.push({
              key: key,
              resId: resId,
              resLabel: resLabel,
              stage: log.stage || '—',
              stageTime: log.timestamp || '',
              name: item.name || item.assetName || '—',
              assetId: item.assetId || '',
              qty: item.qty || item.quantity || 1,
              unit: item.unit || 'pcs',
              status: item.status,
              ip: item.ip || item.initialPrice || 0,
              supplier: item.supplier || item.rentalSupplier || '—',
              paid: payRec.paid || false,
              paidAt: payRec.paidAt || null,
              amount: payRec.amount || item.ip || 0,
              sortedOut: payRec.sortedOut
            });
          }
        }
      });
    });
  });

  if (!damagedRentals.length) {
    el.innerHTML = '<div style="text-align:center;padding:36px;color:var(--text-dim);font-size:13px;"> No rental damage records found. Broken or missing rental items from lifecycle logs will appear here.</div>';
    return;
  }

  // FLOWCHART: Export list of all items that broke + cost
  var totalCost = damagedRentals.reduce(function (s, f) { return s + (f.amount * f.qty); }, 0);
  var html = '<div style="margin-bottom:20px;padding:18px;background:var(--bg3);border-radius:12px;border:1px solid var(--border);">';
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:15px;">';
  html += '<div><div style="font-size:15px;font-weight:800;color:var(--cream);">Post-Event Rental Damage Report</div><div style="font-size:12px;color:var(--text-dim);margin-top:2px;">' + damagedRentals.length + ' issues flagged &middot; Estimated Liability: <strong style="color:var(--red);">₱' + totalCost.toLocaleString() + '</strong></div></div>';
  html += '<button class="btn-outline" style="font-size:12px;padding:8px 16px;" onclick="exportRentalDamageList()"> Export List + Cost</button>';
  html += '</div>';
  html += '<div style="font-size:11px;color:var(--amber);background:rgba(217,119,6,0.08);padding:10px 14px;border-radius:8px;border-left:4px solid var(--amber);line-height:1.5;"> FLAG SYSTEM: The items below are currently flagged as needing repayment. This flag persists until the issue is "Sorted Out" (Case Closed).</div>';
  html += '</div>';

  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(340px, 1fr));gap:16px;">';
  damagedRentals.forEach(function (dm) {
    var border = dm.status === 'missing' ? 'var(--red)' : 'var(--amber)';
    html += '<div class="rs-rental-card" style="background:var(--bg3);border:1px solid var(--border);border-left:4px solid ' + border + ';border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:12px;">';
    html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;">';
    html += '<div><div style="font-size:14px;font-weight:700;color:var(--cream);">' + escHtml(dm.name) + '</div><div style="font-size:11px;color:var(--text-dim);">' + escHtml(dm.resLabel) + '</div></div>';
    html += '<span style="font-size:10px;font-weight:800;background:rgba(0,0,0,0.25);padding:3px 8px;border-radius:4px;color:' + border + ';">' + dm.status.toUpperCase() + '</span>';
    html += '</div>';
    html += '<div style="font-size:11px;color:var(--text-dim);">Supplier: <strong style="color:var(--text-mid);">' + escHtml(dm.supplier) + '</strong> &middot; Stage: ' + dm.stage + '</div>';
    html += '<div style="font-size:12px;color:var(--cream);font-weight:600;">Liable Amount: ₱' + (dm.amount * dm.qty).toLocaleString() + ' <span style="font-size:11px;color:var(--text-dim);font-weight:400;">(' + dm.qty + ' × ₱' + dm.amount.toLocaleString() + ')</span></div>';

    // FLOWCHART: Decision "Sort Out?"
    html += '<div style="margin-top:auto;padding-top:12px;border-top:1px solid var(--border);display:flex;gap:8px;">';
    if (!dm.paid) {
      html += '<button class="btn-reject" style="font-size:11px;flex:1;padding:7px;" onclick="markRentalPaid(\'' + dm.key + '\')">Log Damage Repayment</button>';
    } else {
      html += '<div style="flex:1;display:flex;align-items:center;color:var(--green);font-size:11px;font-weight:700;">✓ Repayment Logged (' + new Date(dm.paidAt).toLocaleDateString() + ')</div>';
    }
    html += '<button class="btn-primary" style="font-size:11px;padding:7px 12px;" onclick="sortOutRentalIssue(\'' + dm.key + '\')">Sort Out? (C1)</button>';
    html += '</div>';
    html += '</div>';
  });
  html += '</div>';
  el.innerHTML = html;
}
window.renderRentalDamageTab = renderRentalDamageTab;

function markRentalPaid(key) {
  if (!window.resupplyData.rentalPayments[key]) window.resupplyData.rentalPayments[key] = { paid: false, sortedOut: false };
  var pay = window.resupplyData.rentalPayments[key];
  pay.paid = true;
  pay.paidAt = new Date().toISOString();
  _saveRentalPaymentToFirebase(key, pay);
  showToast('✓ Rental damage repayment logged.');
  renderRentalDamageTab();
  refreshResupplyStats();
}
window.markRentalPaid = markRentalPaid;

/* FLOWCHART: Decision "Sort Out?" -> C1 (Resolved) */
function sortOutRentalIssue(key) {
  if (!window.resupplyData.rentalPayments[key]) window.resupplyData.rentalPayments[key] = { paid: false, sortedOut: false };
  var pay = window.resupplyData.rentalPayments[key];
  pay.sortedOut = true;
  pay.sortedAt = new Date().toISOString();

  // Also clear the flag in the original log if possible
  var parts = key.split('_');
  var rid = parts[0], lIdx = parseInt(parts[1]), iIdx = parseInt(parts[2]);
  if (window.lifecycleLogs[rid] && window.lifecycleLogs[rid][lIdx]) {
    var item = window.lifecycleLogs[rid][lIdx].items[iIdx];
    item.resupplyResolved = true; // reusing same flag logic for clearing
    item.resupplyResolvedAt = pay.sortedAt;
  }

  _saveRentalPaymentToFirebase(key, pay);
  showToast(' Rental issue sorted out — Case Closed (C1).');
  renderRentalDamageTab();
  refreshResupplyStats();
}
window.sortOutRentalIssue = sortOutRentalIssue;

function exportRentalDamageList() {
  window.print(); // Simplest way to "Export" for now
}
window.exportRentalDamageList = exportRentalDamageList;

async function _saveRentalPaymentToFirebase(key, data) {
  try {
    if (!window.firebaseDB || !window.firebaseFns) return;
    var fns = window.firebaseFns;
    var ref = fns.doc(window.firebaseDB, 'rentalDamagePayments', key.replace(/[^a-zA-Z0-9_-]/g, '_'));
    await fns.setDoc(ref, data);
  } catch (e) { }
}


/* ── Utility: HTML escape ─────────────────────────────────── */
function escHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function escAttr(str) {
  if (!str) return '';
  return String(str).replace(/[^a-zA-Z0-9_\-]/g, '_');
}
if (!window.escHtml) window.escHtml = escHtml;

/* ── Toast helper (if not already defined) ────────────────── */
if (!window.showToast) {
  window.showToast = function (msg) {
    var t = document.createElement('div');
    t.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;background:var(--bg2);border:1px solid var(--gold);color:var(--cream);padding:12px 20px;border-radius:12px;font-size:13px;font-weight:600;box-shadow:0 8px 32px rgba(0,0,0,.4);max-width:380px;';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 3500);
  };
}

/* ── Load persisted data from Firebase on init ────────────── */
async function loadResupplyDataFromFirebase() {
  try {
    if (!window.firebaseDB || !window.firebaseFns) return;
    var fns = window.firebaseFns;
    var poSnap = await fns.getDocs(fns.collection(window.firebaseDB, 'purchaseOrders'));
    poSnap.forEach(function (d) {
      var data = d.data();
      if (!window.resupplyData.purchaseOrders.find(function (p) { return p.id === data.id; }))
        window.resupplyData.purchaseOrders.push(data);
    });
    var slSnap = await fns.getDocs(fns.collection(window.firebaseDB, 'shoppingLists'));
    slSnap.forEach(function (d) {
      var data = d.data();
      if (!window.resupplyData.shoppingLists.find(function (s) { return s.id === data.id; }))
        window.resupplyData.shoppingLists.push(data);
    });
    var rpSnap = await fns.getDocs(fns.collection(window.firebaseDB, 'rentalDamagePayments'));
    rpSnap.forEach(function (d) { window.resupplyData.rentalPayments[d.id] = d.data(); });
  } catch (e) { }
}

/* Call load on page ready */
document.addEventListener('DOMContentLoaded', function () {
  setTimeout(loadResupplyDataFromFirebase, 2000);
});
/* ====================================================================
   EQUIPMENT MAINTENANCE PIPELINE (EIM 9)
   Functions: renderMaintenanceSection, switchMaintenanceTab,
   refreshMaintenancePipeline, openMaintenanceModal, decideMaintenance,
   submitMaintenanceLog, autoFlagForResupply
   Data stored in window.maintenanceTasks = []
   ==================================================================== */

window.maintenanceTasks = window.maintenanceTasks || [];

function renderMaintenanceSection() {
  refreshMaintenancePipeline();
  updateMaintenanceStats();
  renderMaintenanceGrid();
  renderMaintenanceHistory();
}
window.renderMaintenanceSection = renderMaintenanceSection;

function updateMaintenanceStats() {
  var t = window.maintenanceTasks;
  var counts = {
    review: t.filter(function (x) { return x.status === 'review_pending'; }).length,
    repair: t.filter(function (x) { return x.status === 'under_maintenance'; }).length,
    fixed: t.filter(function (x) { return x.status === 'fixed' && isCurrentMonth(x.resolvedAt); }).length,
    retired: t.filter(function (x) { return x.status === 'retired'; }).length
  };

  var el;
  el = document.getElementById('mnt-stat-review'); if (el) el.textContent = counts.review;
  el = document.getElementById('mnt-stat-repair'); if (el) el.textContent = counts.repair;
  el = document.getElementById('mnt-stat-fixed'); if (el) el.textContent = counts.fixed;
  el = document.getElementById('mnt-stat-retired'); if (el) el.textContent = counts.retired;

  var badge = document.getElementById('mnt-sidebar-badge');
  if (badge) {
    var totalActive = counts.review + counts.repair;
    badge.style.display = totalActive > 0 ? '' : 'none';
    badge.textContent = totalActive;
  }
}

function isCurrentMonth(dateStr) {
  if (!dateStr) return false;
  var d = new Date(dateStr);
  var now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function refreshMaintenancePipeline() {
  var tasks = window.maintenanceTasks;

  // 1. Scan EIM_ASSETS for "Under Repair" or "Poor" condition
  (EIM_ASSETS || []).forEach(function (asset) {
    if (asset.status === 'Under Repair' || asset.condition === 'Fair' || asset.condition === 'Poor') {
      var existing = tasks.find(function (t) { return t.assetId === asset.id && t.status !== 'fixed' && t.status !== 'retired'; });
      if (!existing) {
        tasks.push({
          id: 'MT-' + Date.now() + '-' + asset.id,
          assetId: asset.id,
          name: asset.name,
          category: asset.category || 'General',
          reportedAt: new Date().toISOString(),
          status: 'review_pending',
          priority: 'medium',
          issue: 'Damaged',
          logs: [{ date: new Date().toISOString(), action: 'Detected by Scanner', note: 'Asset flagged in inventory as ' + (asset.status === 'Under Repair' ? 'In Repair' : asset.condition) + '.' }]
        });
      }
    }
  });

  // 2. Scan lifecycle logs for "broken" or "damaged" items
  Object.entries(window.allDeploymentLogs || {}).forEach(function (entry) {
    var rid = entry[0];
    var stages = entry[1];
    Object.values(stages).forEach(function (log) {
      (log.checklist || []).forEach(function (item) {
        if (item.condition === 'broken' || item.condition === 'damaged') {
          var existing = tasks.find(function (t) { return t.sourceRef === (rid + '_' + log.stage + '_' + item.assetId) && t.status !== 'fixed' && t.status !== 'retired'; });
          if (!existing) {
            tasks.push({
              id: 'MT-' + Date.now() + '-' + (item.assetId || 'UNK'),
              assetId: item.assetId || '',
              name: item.name,
              category: item.category || '',
              reportedAt: log.timestamp || new Date().toISOString(),
              status: 'review_pending',
              priority: 'high',
              issue: 'Damaged',
              sourceRef: rid + '_' + log.stage + '_' + item.assetId,
              logs: [{ date: new Date().toISOString(), action: 'Pipeline Entry', note: 'Flagged from lifecycle log: item reported as ' + item.condition + ' during ' + log.stage + '.' }]
            });
          }
        }
      });
    });
  });
}

function renderMaintenanceGrid() {
  var grid = document.getElementById('mnt-pipeline-grid');
  if (!grid) return;

  var activeTasks = window.maintenanceTasks.filter(function (t) { return t.status !== 'fixed' && t.status !== 'retired'; });
  if (!activeTasks.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-dim);"><div style="font-size:48px;margin-bottom:12px;">️</div><div style="font-size:15px;font-weight:600;">Pipeline is clear.</div><div style="font-size:12px;margin-top:4px;">No equipment currently requires maintenance review.</div></div>';
    return;
  }

  var html = '';
  activeTasks.forEach(function (t) {
    var statusClass = 'mnt-status-' + (t.status === 'review_pending' ? 'review' : 'repair');
    var statusLabel = t.status === 'review_pending' ? 'Review' : 'Repairing';
    var pClass = 'mnt-p-' + t.priority;
    var lastLog = t.logs[t.logs.length - 1] || {};

    html += '<div class="mnt-task-card" style="display:flex; flex-direction:column; background:var(--bg2); border:1px solid var(--border); border-radius:16px; overflow:hidden;">';
    html += '  <div class="mnt-card-hdr" style="padding:15px 20px; background:rgba(255,255,255,0.02); border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">';
    html += '    <div class="mnt-status-badge ' + statusClass + '">' + statusLabel + '</div>';
    html += '    <div class="mnt-priority ' + pClass + '">' + t.priority.toUpperCase() + '</div>';
    html += '  </div>';
    
    html += '  <div class="mnt-card-body" style="padding:20px; flex:1; display:flex; flex-direction:column;">';
    html += '    <div class="mnt-asset-info" style="display:flex; align-items:center; gap:15px; margin-bottom:15px;">';
    html += '      <div class="mnt-asset-icon">' + getCategoryIcon(t.category) + '</div>';
    html += '      <div>';
    html += '        <div style="font-size:16px; font-weight:800; color:var(--cream);">' + escHtml(t.name) + '</div>';
    html += '        <div style="font-size:11px; color:var(--text-dim);">' + escHtml(t.assetId) + ' &middot; ' + t.category + '</div>';
    html += '      </div>';
    html += '    </div>';

    html += '    <div class="mnt-issue-box" style="background:rgba(0,0,0,0.15); border-radius:10px; padding:12px; margin-bottom:15px; border-left:3px solid var(--gold);">';
    html += '      <div style="font-size:10px; font-weight:800; color:var(--gold); text-transform:uppercase; margin-bottom:4px;">Reported Issue</div>';
    html += '      <div style="font-size:13px; color:var(--text-mid);">' + escHtml(t.issue) + '</div>';
    html += '    </div>';

    html += '    <div class="mnt-log-container" style="margin-top:auto; padding-top:15px; border-top:1px dashed var(--border);">';
    html += '      <div class="mnt-log-item">';
    html += '        <div class="mnt-log-dot"></div>';
    html += '        <div class="mnt-log-content">';
    html += '          <div class="mnt-log-action" style="font-size:11px; font-weight:700; color:var(--cream);">' + escHtml(lastLog.action || 'Logged') + '</div>';
    html += '          <div class="mnt-log-meta" style="font-size:10px; color:var(--text-dim);">' + new Date(lastLog.date || t.reportedAt).toLocaleString() + (lastLog.note ? ' &middot; ' + escHtml(lastLog.note) : '') + '</div>';
    html += '        </div>';
    html += '      </div>';
    html += '    </div>';

    html += '    <button class="btn-primary mnt-action-btn" onclick="openMaintenanceModal(\'' + t.id + '\')" style="width:100%; margin-top:15px; padding:12px; border-radius:10px; font-weight:700;">';
    html += '      ' + (t.status === 'review_pending' ? 'Review Task' : 'Manage Repair');
    html += '    </button>';
    html += '  </div>';
    html += '</div>';
  });
  grid.innerHTML = html;
}

function getCategoryIcon(cat) {
  if (cat.indexOf('Furniture') > -1) return '';
  if (cat.indexOf('Tableware') > -1) return '️';
  if (cat.indexOf('Catering') > -1) return '';
  if (cat.indexOf('AV') > -1) return '';
  return '';
}

function switchMaintenanceTab(tab, btn) {
  document.querySelectorAll('#section-maintenance .tab-btn').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');
  document.getElementById('mnt-pane-active').style.display = (tab === 'active' ? '' : 'none');
  document.getElementById('mnt-pane-history').style.display = (tab === 'history' ? '' : 'none');
}
window.switchMaintenanceTab = switchMaintenanceTab;

function openMaintenanceModal(id) {
  var t = window.maintenanceTasks.find(function (x) { return x.id === id; });
  if (!t) return;

  document.getElementById('mnt-modal-task-id').value = id;
  document.getElementById('mnt-modal-asset').textContent = t.name + ' (' + t.assetId + ')';

  var reviewSec = document.getElementById('mnt-review-actions');
  var logForm = document.getElementById('mnt-log-form');

  if (t.status === 'review_pending') {
    reviewSec.style.display = 'block';
    logForm.style.display = 'none';
  } else {
    reviewSec.style.display = 'none';
    logForm.style.display = 'block';
    document.getElementById('mnt-priority').value = t.priority;
    document.getElementById('mnt-action-note').value = '';
  }

  document.getElementById('mnt-action-overlay').classList.add('on');
  document.getElementById('mnt-action-modal').classList.add('open');
}
window.openMaintenanceModal = openMaintenanceModal;

function closeMaintenanceModal() {
  document.getElementById('mnt-action-overlay').classList.remove('on');
  document.getElementById('mnt-action-modal').classList.remove('open');
}
window.closeMaintenanceModal = closeMaintenanceModal;

function decideMaintenance(decision) {
  var id = document.getElementById('mnt-modal-task-id').value;
  var t = window.maintenanceTasks.find(function (x) { return x.id === id; });
  if (!t) return;

  var now = new Date().toISOString();
  if (decision === 'repair') {
    t.status = 'under_maintenance';
    t.logs.push({ date: now, action: 'Move to Maintenance', note: 'Admin determined item is fixable.' });
    openMaintenanceModal(id); // Refresh modal view
  } else if (decision === 'retire') {
    t.status = 'retired';
    t.resolvedAt = now;
    t.logs.push({ date: now, action: 'Item Retired', note: 'Admin determined item not fixable. Moving to resupply.' });
    autoFlagForResupply(t);
    closeMaintenanceModal();
    showToast('️ Item retired. Flagged for resupply.');
  }

  _saveMaintenanceTaskToFirebase(t);
  renderMaintenanceSection();
}
window.decideMaintenance = decideMaintenance;

function submitMaintenanceLog(mode) {
  var id = document.getElementById('mnt-modal-task-id').value;
  var t = window.maintenanceTasks.find(function (x) { return x.id === id; });
  if (!t) return;

  var priority = document.getElementById('mnt-priority').value;
  var note = document.getElementById('mnt-action-note').value.trim();
  var now = new Date().toISOString();

  t.priority = priority;

  if (mode === 'fixed') {
    t.status = 'fixed';
    t.resolvedAt = now;
    t.logs.push({ date: now, action: 'Fixed & Returned', note: note || 'Item repaired and returned to inventory in Good condition.' });

    // Update main asset condition
    var asset = (EIM_ASSETS || []).find(function (a) { return a.id === t.assetId; });
    if (asset) {
      asset.condition = 'Good';
      asset.status = 'Active';
    }

    closeMaintenanceModal();
    showToast(' Maintenance complete. Asset restored to Good condition.');
  } else {
    t.logs.push({ date: now, action: 'Update Log', note: note });
    closeMaintenanceModal();
    showToast(' Maintenance log updated.');
  }

  _saveMaintenanceTaskToFirebase(t);
  renderMaintenanceSection();
}
window.submitMaintenanceLog = submitMaintenanceLog;

function autoFlagForResupply(t) {
  // Integrate with Resupply module by adding a virtual "missing" flag
  window.issueFlags = window.issueFlags || {};
  var rid = 'RETIRED_MNT';
  if (!window.issueFlags[rid]) window.issueFlags[rid] = [];

  window.issueFlags[rid].push({
    assetId: t.assetId,
    assetName: t.name,
    flagType: 'missing',
    qty: 1,
    priority: 'High',
    description: 'Retired from Maintenance Pipeline: ' + t.issue,
    flaggedAt: new Date().toISOString(),
    reservationId: rid,
    reservationLabel: 'Retirement Replacement'
  });

  // Update main asset status to Retired
  var asset = (EIM_ASSETS || []).find(function (a) { return a.id === t.assetId; });
  if (asset) {
    asset.status = 'Retired';
    asset.condition = 'Poor';
  }
}

function renderMaintenanceHistory() {
  var tbody = document.getElementById('mnt-history-tbody');
  if (!tbody) return;

  var historyTasks = window.maintenanceTasks.filter(function (t) { return t.status === 'fixed' || t.status === 'retired'; });
  if (!historyTasks.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--text-dim);">No closed maintenance tasks.</td></tr>';
    return;
  }

  var html = '';
  historyTasks.sort(function (a, b) { return new Date(b.resolvedAt) - new Date(a.resolvedAt); }).forEach(function (t) {
    var resColor = t.status === 'fixed' ? 'var(--green)' : 'var(--text-dim)';
    var resLabel = t.status === 'fixed' ? 'FIXED' : 'RETIRED';
    var date = new Date(t.resolvedAt).toLocaleDateString();

    html += '<tr>';
    html += '<td style="color:var(--text-dim);">' + date + '</td>';
    html += '<td><div style="font-weight:600;">' + escHtml(t.name) + '</div><div style="font-size:10px;opacity:0.6;">' + t.assetId + '</div></td>';
    html += '<td style="font-weight:700;color:' + resColor + ';">' + resLabel + '</td>';
    html += '<td style="font-size:11px;color:var(--text-mid);">' + escHtml(t.issue) + '</td>';
    html += '<td style="font-size:11px;color:var(--text-mid);">Internal Repair</td>';
    html += '</tr>';
  });
  tbody.innerHTML = html;
}

async function _saveMaintenanceTaskToFirebase(task) {
  try {
    if (!window.firebaseDB || !window.firebaseFns) return;
    var fns = window.firebaseFns;
    var ref = fns.doc(window.firebaseDB, 'maintenanceTasks', task.id.replace(/[^a-zA-Z0-9_-]/g, '_'));
    await fns.setDoc(ref, task);
  } catch (e) { }
}

async function loadMaintenanceDataFromFirebase() {
  try {
    if (!window.firebaseDB || !window.firebaseFns) return;
    var fns = window.firebaseFns;
    var snap = await fns.getDocs(fns.collection(window.firebaseDB, 'maintenanceTasks'));
    snap.forEach(function (d) {
      var data = d.data();
      if (!window.maintenanceTasks.find(function (x) { return x.id === data.id; })) {
        window.maintenanceTasks.push(data);
      }
    });
    if (document.getElementById('section-maintenance')?.classList.contains('active')) {
      renderMaintenanceSection();
    }
  } catch (e) { }
}

// Add to init
document.addEventListener('DOMContentLoaded', function () {
  setTimeout(loadMaintenanceDataFromFirebase, 2500);

  // Inject placeholders if empty for demo purposes
  setTimeout(function () {
    if (window.maintenanceTasks.length === 0) {
      window.maintenanceTasks.push({
        id: 'MT-DEMO-1',
        assetId: 'EQ-CH-001',
        name: 'Tiffany Chair (Gold)',
        category: 'Furniture',
        reportedAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'review_pending',
        priority: 'medium',
        issue: 'Damaged',
        logs: [{ date: new Date(Date.now() - 86400000).toISOString(), action: 'Logged', note: 'Flagged for internal review.' }]
      });
      window.maintenanceTasks.push({
        id: 'MT-DEMO-2',
        assetId: 'EQ-AV-012',
        name: 'Sound System Speaker',
        category: 'AV & Lighting',
        reportedAt: new Date(Date.now() - 172800000).toISOString(),
        status: 'under_maintenance',
        priority: 'high',
        issue: 'Damaged',
        logs: [
          { date: new Date(Date.now() - 172800000).toISOString(), action: 'Logged', note: 'Detected by routine check.' },
          { date: new Date(Date.now() - 86400000).toISOString(), action: 'Review Complete', note: 'Owner initiating internal repair.' }
        ]
      });
    }

    // Seed dummy disposal data for analytics if maintenanceTasks is lonely
    if (window.maintenanceTasks.length <= 2) {
      const demoFailures = [
        { id: 'MT-OLD-1', assetId: 'EQ-T-005', name: 'Tiffany Chair (Gold)', category: 'Furniture', reportedAt: '2026-01-10T10:00:00Z', resolvedAt: '2026-01-12T10:00:00Z', status: 'retired', priority: 'high', issue: 'Leg snapped during transport', logs: [] },
        { id: 'MT-OLD-2', assetId: 'EQ-T-006', name: 'Tiffany Chair (Gold)', category: 'Furniture', reportedAt: '2026-02-05T10:00:00Z', resolvedAt: '2026-02-06T10:00:00Z', status: 'retired', priority: 'medium', issue: 'Backrest cracked', logs: [] },
        { id: 'MT-OLD-3', assetId: 'EQ-V-022', name: 'Crystal Vase (Large)', category: 'Tableware', reportedAt: '2026-03-15T10:00:00Z', resolvedAt: '2026-03-16T10:00:00Z', status: 'retired', priority: 'high', issue: 'Shattered', logs: [] },
        { id: 'MT-OLD-4', assetId: 'EQ-L-001', name: 'Stage Spotlight', category: 'AV & Lighting', reportedAt: '2026-03-20T10:00:00Z', resolvedAt: '2026-03-22T10:00:00Z', status: 'retired', priority: 'low', issue: 'Circuit burnout', logs: [] },
        // These are just "maintenance incidents" to show who breaks the most
        { id: 'MT-OLD-5', assetId: 'EQ-T-007', name: 'Tiffany Chair (Gold)', category: 'Furniture', reportedAt: '2026-04-01T10:00:00Z', resolvedAt: '2026-04-02T10:00:00Z', status: 'fixed', priority: 'low', issue: 'Loose screw', logs: [] }
      ];
      demoFailures.forEach(f => window.maintenanceTasks.push(f));

      // Ensure specific assets exist for cost lookup
      const dummyAssets = [
        { id: 'EQ-T-005', name: 'Tiffany Chair (Gold)', unitCost: 1200, category: 'Furniture', status: 'Retired' },
        { id: 'EQ-V-022', name: 'Crystal Vase (Large)', unitCost: 850, category: 'Tableware', status: 'Retired' },
        { id: 'EQ-L-001', name: 'Stage Spotlight', unitCost: 4500, category: 'AV & Lighting', status: 'Retired' }
      ];
      dummyAssets.forEach(da => {
        if (!EIM_ASSETS.find(a => a.id === da.id)) EIM_ASSETS.push(da);
      });

      // Force refresh if the user is already looking at these sections
      if (document.getElementById('section-disposed')?.classList.contains('active')) {
        renderDisposedSection();
      }
      if (document.getElementById('section-maintenance')?.classList.contains('active')) {
        renderMaintenanceSection();
      }
    }
  }, 3000);
});
/* ====================================================================
   EQUIPMENT DISPOSED RECORDS (EIM 10)
   Functions: renderDisposedSection, getDisposedRecords, 
   calculateDisposalAnalytics
   ==================================================================== */

window.disposedRecords = window.disposedRecords || [];

function renderDisposedSection() {
  const records = getDisposedRecords();
  const analytics = calculateDisposalAnalytics(records);

  updateDisposedStats(analytics);
  renderFailureAnalytics(analytics.failureFrequencies);
  renderMonthlyLossTrends(analytics.monthlyTrends);
  renderDisposalHistory(records);
}
window.renderDisposedSection = renderDisposedSection;

function switchDisposedTab(tab, btn) {
  document.querySelectorAll('#section-disposed .tab-btn').forEach(function (b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  var analyticsPane = document.getElementById('dsp-pane-analytics');
  var historyPane = document.getElementById('dsp-pane-history');
  if (analyticsPane) analyticsPane.style.display = (tab === 'analytics') ? '' : 'none';
  if (historyPane) historyPane.style.display = (tab === 'history') ? '' : 'none';
}
window.switchDisposedTab = switchDisposedTab;

function getDisposedRecords() {
  // 1. Items from Maintenance Pipeline marked "Retired"
  let records = (window.maintenanceTasks || [])
    .filter(t => t.status === 'retired')
    .map(t => {
      const asset = (EIM_ASSETS || []).find(a => a.id === t.assetId);
      const val = asset ? (parseFloat(asset.unitCost || asset.cost || asset.ip) || 0) : 0;
      return {
        date: t.resolvedAt || t.reportedAt,
        name: t.name,
        assetId: t.assetId,
        reason: 'Beyond Repair (Maintenance)',
        valueLoss: val,
        category: t.category
      };
    });

  // 2. Items manually marked "Retired" in EIM that aren't in maintenance records
  (EIM_ASSETS || []).forEach(asset => {
    if (asset.status === 'Retired') {
      const alreadyInMnt = records.find(r => r.assetId === asset.id);
      if (!alreadyInMnt) {
        records.push({
          date: asset.retiredAt || new Date().toISOString(), // Fallback
          name: asset.name,
          assetId: asset.id,
          reason: asset.notes || 'End of Lifecycle',
          valueLoss: parseFloat(asset.unitCost || asset.cost || asset.ip) || 0,
          category: asset.category
        });
      }
    }
  });

  return records.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function calculateDisposalAnalytics(records) {
  let totalLoss = 0;
  let monthlyLossMap = {};
  let failureMap = {};

  const now = new Date();
  const currentMonthKey = now.toLocaleString('default', { month: 'short', year: 'numeric' });

  records.forEach(r => {
    const val = r.valueLoss || 0;
    totalLoss += val;

    // Monthly Trends
    const d = new Date(r.date);
    const mKey = d.toLocaleString('default', { month: 'short', year: 'numeric' });
    monthlyLossMap[mKey] = (monthlyLossMap[mKey] || 0) + val;
  });

  // Failure Frequency (Count ALL incidents in maintenanceTasks even if fixed)
  (window.maintenanceTasks || []).forEach(t => {
    failureMap[t.name] = (failureMap[t.name] || 0) + 1;
  });

  const frequencies = Object.entries(failureMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const activeCount = (EIM_ASSETS || []).filter(a => a.status === 'Active' || a.status === 'In Use').length;
  const disposalRate = records.length > 0 ? ((records.length / (records.length + activeCount)) * 100).toFixed(1) : 0;

  return {
    totalValueLoss: totalLoss,
    currentMonthLoss: monthlyLossMap[currentMonthKey] || 0,
    currentMonthName: currentMonthKey,
    failureFrequencies: frequencies,
    monthlyTrends: monthlyLossMap,
    disposalRate: disposalRate
  };
}

function updateDisposedStats(analytics) {
  setElText('dsp-stat-total', '₱' + analytics.totalValueLoss.toLocaleString());
  setElText('dsp-stat-month', '₱' + analytics.currentMonthLoss.toLocaleString());
  setElText('dsp-stat-month-lbl', 'Loss in ' + analytics.currentMonthName);
  setElText('dsp-stat-rate', analytics.disposalRate + '%');

  const topFailure = analytics.failureFrequencies[0];
  setElText('dsp-stat-bad-asset', topFailure ? topFailure[0] : 'None');
}

function renderFailureAnalytics(frequencies) {
  const canvas = document.getElementById('dsp-chart-broken');
  const empty = document.getElementById('dsp-chart-broken-empty');
  if (!canvas) return;

  if (window.disposedBrokenChartInst) {
    window.disposedBrokenChartInst.destroy();
    window.disposedBrokenChartInst = null;
  }

  if (!frequencies.length) {
    canvas.style.display = 'none';
    if (empty) empty.style.display = '';
    return;
  }
  canvas.style.display = '';
  if (empty) empty.style.display = 'none';

  const labels = frequencies.map(function (f) { return f[0]; });
  const data = frequencies.map(function (f) { return f[1]; });

  window.disposedBrokenChartInst = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Incidents',
        data: data,
        backgroundColor: 'rgba(196, 154, 60, 0.65)',
        borderColor: '#c49a3c',
        borderWidth: 1.5,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0, color: '#b7b2a7' },
          grid: { color: 'rgba(255,255,255,0.08)' }
        },
        x: {
          ticks: { color: '#e7e0d0', maxRotation: 25, minRotation: 0 },
          grid: { display: false }
        }
      }
    }
  });
}

function renderMonthlyLossTrends(trends) {
  const canvas = document.getElementById('dsp-chart-monthly');
  const empty = document.getElementById('dsp-chart-monthly-empty');
  if (!canvas) return;

  if (window.disposedMonthlyLossChartInst) {
    window.disposedMonthlyLossChartInst.destroy();
    window.disposedMonthlyLossChartInst = null;
  }

  const entries = Object.entries(trends)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .slice(0, 6);

  if (!entries.length) {
    canvas.style.display = 'none';
    if (empty) empty.style.display = '';
    return;
  }
  canvas.style.display = '';
  if (empty) empty.style.display = 'none';

  const labels = entries.map(function (e) { return e[0]; });
  const data = entries.map(function (e) { return e[1]; });

  window.disposedMonthlyLossChartInst = new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Value Loss (PHP)',
        data: data,
        borderColor: '#2d8a4e',
        backgroundColor: 'rgba(45, 138, 78, 0.22)',
        borderWidth: 2,
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              return ' Loss: ₱' + (ctx.parsed.y || 0).toLocaleString();
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#b7b2a7',
            callback: function (value) { return '₱' + Number(value).toLocaleString(); }
          },
          grid: { color: 'rgba(255,255,255,0.08)' }
        },
        x: {
          ticks: { color: '#e7e0d0' },
          grid: { display: false }
        }
      }
    }
  });
}

function renderDisposalHistory(records) {
  const tbody = document.getElementById('dsp-history-tbody');
  if (!tbody) return;

  if (!records.length) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:24px;color:var(--text-dim);">No disposal history recorded.</td></tr>';
    return;
  }

  let html = '';
  records.forEach(r => {
    html += `<tr>
      <td style="color:var(--text-dim);">${new Date(r.date).toLocaleDateString()}</td>
      <td>
        <div style="font-weight:600;color:var(--cream);">${escHtml(r.name)}</div>
        <div style="font-size:10px;opacity:0.6;">${r.assetId} &middot; ${r.category}</div>
      </td>
      <td style="font-size:12px;color:var(--text-mid);">${escHtml(r.reason)}</td>
      <td style="text-align:right; font-weight:700; color:var(--red);">₱${(r.valueLoss || 0).toLocaleString()}</td>
    </tr>`;
  });
  tbody.innerHTML = html;
}

function setElText(id, txt) {
  const el = document.getElementById(id);
  if (el) el.textContent = txt;
}

/* ====================================================================
   RESERVATION OVERHAUL LOGIC
   ==================================================================== */

function renderEventRequirements(ev) {
  const container = document.getElementById('ed-requirements-list');
  if (!container) return;

  const pax = ev.pax || 0;
  const tables = Math.ceil(pax * 0.125); // Rule of 1 per 8 pax

  let html = '';
  // Use ALLOC_RULES to calculate
  (ALLOC_RULES || []).forEach(rule => {
    let qty = 0;
    if (rule.ruleType === 'per_pax') {
      qty = Math.ceil(pax * rule.ratio);
    } else if (rule.ruleType === 'per_table') {
      qty = Math.ceil(tables * rule.ratio);
    } else if (rule.ruleType === 'flat') {
      qty = rule.ratio;
    }

    // Add Fragile Buffer (e.g., 10%)
    if (rule.isFragile) qty = Math.ceil(qty * 1.1);

    if (qty > 0) {
      html += `
        <div class="req-item">
          <div class="req-info">
            <span class="req-name">${escHtml(rule.name)}</span>
            <span class="req-cat">${rule.category} &middot; ${rule.note || ''}</span>
          </div>
          <span class="req-val">${qty}</span>
        </div>`;
    }
  });

  if (!html) {
    container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-dim); font-size:12px;">No automated requirements defined for this event type.</div>';
  } else {
    container.innerHTML = html;
  }
}
window.renderEventRequirements = renderEventRequirements;

/* ====================================================================
   USER MANAGEMENT LOGIC
   ==================================================================== */

async function fetchCustomers() {
  const { collection, getDocs, query, where } = window.firebaseFns;
  const db = window.firebaseDB;
  if (!db) return;

  try {
    const q = query(collection(db, 'users'), where('role', '==', 'customer'));
    const snap = await getDocs(q);
    CUSTOMERS = [];
    snap.forEach(doc => {
      const data = doc.data();
      // Format the data to match our USERS structure
      let lastLoginStr = 'Never';
      if (data.lastLogin) {
        const d = data.lastLogin.toDate ? data.lastLogin.toDate() : new Date(data.lastLogin);
        lastLoginStr = d.toLocaleString();
      }

      CUSTOMERS.push({
        id: doc.id,
        name: data.name || 'No Name',
        email: data.email || 'No Email',
        role: data.role || 'customer',
        status: data.status || 'Active',
        lastLogin: lastLoginStr
      });
    });
    if (currentUserTab === 'customers') renderUsersSection();
  } catch (err) {
    console.error('Error fetching customers:', err);
  }
}

function switchUserTab(tab) {
  currentUserTab = tab;
  selectedUserId = null;

  // Update UI tabs
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  if (tab === 'staff') {
    document.getElementById('btn-tab-staff').classList.add('active');
    fetchStaff();
  } else {
    document.getElementById('btn-tab-customers').classList.add('active');
    fetchCustomers();
  }

  renderUsersSection();
}
window.switchUserTab = switchUserTab;

function renderUsersSection() {
  const tbody = document.getElementById('users-tbody');
  if (!tbody) return;

  const list = currentUserTab === 'staff' ? USERS : CUSTOMERS;

  const activeCount = list.filter(u => u.status === 'Active').length;
  const inactiveCount = list.length - activeCount;

  setElText('user-stat-total', list.length);
  setElText('user-stat-active', activeCount);
  setElText('user-stat-inactive', inactiveCount);

  // Update panel title
  const panelTitle = document.querySelector('#user-management .panel-title');
  if (panelTitle) {
    panelTitle.textContent = currentUserTab === 'staff' ? 'System Accounts' : 'Customer Database';
  }

  tbody.innerHTML = list.map(u => `
    <tr onclick="selectUserRow(this, '${u.id}')" class="${selectedUserId === u.id ? 'selected' : ''}">
      <td class="item-name">${escHtml(u.name)}</td>
      <td>${escHtml(u.email)}</td>
      <td style="text-transform: capitalize;">${u.role}</td>
      <td><span class="badge ${u.status ? u.status.toLowerCase() : 'active'}">${u.status || 'Active'}</span></td>
      <td style="color:var(--text-dim); font-size:12px;">${u.lastLogin || 'Never'}</td>
    </tr>
  `).join('');

  updateUserActionButtons();
}

function selectUserRow(el, userId) {
  selectedUserId = userId;
  document.querySelectorAll('#users-tbody tr').forEach(tr => tr.classList.remove('selected'));
  el.classList.add('selected');
  updateUserActionButtons();
}

function updateUserActionButtons() {
  const editBtn = document.getElementById('user-edit-btn');
  const statusBtn = document.getElementById('user-status-btn');
  if (!editBtn || !statusBtn) return;

  if (selectedUserId) {
    const list = currentUserTab === 'staff' ? USERS : CUSTOMERS;
    const user = list.find(u => u.id === selectedUserId);

    editBtn.disabled = false;
    statusBtn.disabled = false;

    // Hide edit for customers for now
    editBtn.style.display = currentUserTab === 'staff' ? 'inline-block' : 'none';

    statusBtn.innerHTML = user && user.status === 'Inactive' ? ' Activate Account' : ' Deactivate Account';
  } else {
    editBtn.disabled = true;
    statusBtn.disabled = true;
    editBtn.style.display = 'inline-block';
  }
}

function openAddUserModal() {
  selectedUserId = null;
  document.querySelectorAll('#users-tbody tr').forEach(tr => tr.classList.remove('selected'));
  updateUserActionButtons();

  document.getElementById('user-modal-title').textContent = ' Add New User';
  document.getElementById('user-modal-id').value = '';
  document.getElementById('user-name').value = '';
  document.getElementById('user-email').value = '';
  document.getElementById('user-role').value = 'Staff';

  document.getElementById('user-modal-overlay').classList.add('on');
  document.getElementById('user-modal').classList.add('open');
}

function openEditUserModal() {
  if (!selectedUserId) return;
  const list = currentUserTab === 'staff' ? USERS : CUSTOMERS;
  const user = list.find(u => u.id === selectedUserId);
  if (!user) return;

  document.getElementById('user-modal-title').textContent = '️ Edit User Details';
  document.getElementById('user-modal-id').value = user.id;
  document.getElementById('user-name').value = user.name;
  document.getElementById('user-email').value = user.email;
  document.getElementById('user-role').value = user.role;

  document.getElementById('user-modal-overlay').classList.add('on');
  document.getElementById('user-modal').classList.add('open');
}

function closeUserModal() {
  document.getElementById('user-modal-overlay').classList.remove('on');
  document.getElementById('user-modal').classList.remove('open');
}

function saveUser() {
  const id = document.getElementById('user-modal-id').value;
  const name = document.getElementById('user-name').value.trim();
  const email = document.getElementById('user-email').value.trim();
  const role = document.getElementById('user-role').value;

  if (!name || !email) {
    alert('Please fill in all required fields.');
    return;
  }

  if (id) {
    // Edit existing
    const list = currentUserTab === 'staff' ? USERS : CUSTOMERS;
    const user = list.find(u => u.id === id);
    if (user) {
      user.name = name;
      user.email = email;
      user.role = role;
    }
  } else {
    // Add new
    const newUser = {
      id: 'u' + Date.now(),
      name,
      email,
      role,
      status: 'Active',
      lastLogin: 'Never'
    };
    USERS.push(newUser);
  }

  closeUserModal();
  renderUsersSection();
}

async function toggleUserStatus() {
  if (!selectedUserId) return;

  const list = currentUserTab === 'staff' ? USERS : CUSTOMERS;
  const user = list.find(u => u.id === selectedUserId);
  if (!user) return;

  const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';

  if (currentUserTab === 'staff') {
    user.status = newStatus;
    renderUsersSection();
  } else {
    // Update Firebase for customers
    const { doc, updateDoc } = window.firebaseFns;
    const db = window.firebaseDB;
    try {
      showToast('Updating customer status...', 'info');
      await updateDoc(doc(db, 'users', user.id), {
        status: newStatus
      });
      user.status = newStatus;
      showToast('Customer status updated!', 'success');
      renderUsersSection();
    } catch (err) {
      console.error('Error updating customer status:', err);
      showToast('Failed to update status', 'error');
    }
  }
}

window.renderUsersSection = renderUsersSection;
window.selectUserRow = selectUserRow;
window.openAddUserModal = openAddUserModal;
window.openEditUserModal = openEditUserModal;
window.closeUserModal = closeUserModal;
window.saveUser = saveUser;
window.toggleUserStatus = toggleUserStatus;

// ===== EXECUTION DAY & SETTLEMENT =====
let activeExecutionResId = null;
let adhocCharges = [];

// ---- Month-grouped reservation list ----
const EXEC_APPROVED_STATUSES = ['confirmed', 'preparing', 'procurement', 'procuring', 'on-going', 'completed'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function renderExecutionDayReservations() {
  const container = document.getElementById('execution-res-list');
  if (!container) return;

  // All approved reservations (same set as Reservation Details Handling)
  const approved = RESERVATIONS.filter(r => EXEC_APPROVED_STATUSES.includes(String(r.status || '').toLowerCase()));

  if (approved.length === 0) {
    container.innerHTML = '<div style="padding:20px;color:var(--text-dim);font-size:12px;text-align:center;line-height:1.6;">No approved reservations found.<br>Approve a reservation first.</div>';
    return;
  }

  // Group by year-month of event date
  const groups = {};
  approved.forEach(r => {
    const d = r.date ? new Date(r.date + 'T00:00:00') : null;
    const key = d && !isNaN(d) ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}` : 'undated';
    if (!groups[key]) groups[key] = { label: d && !isNaN(d) ? MONTH_NAMES[d.getMonth()] + ' ' + d.getFullYear() : 'No Date', items: [] };
    groups[key].items.push(r);
  });

  // Sort groups chronologically
  const sortedKeys = Object.keys(groups).sort();

  let html = '';
  sortedKeys.forEach(key => {
    const grp = groups[key];
    // Determine if group contains the active selection
    const hasActive = grp.items.some(r => r.id === activeExecutionResId);
    html += `
      <div class="exec-month-group" style="border-bottom:1px solid var(--border);">
        <div class="exec-month-header" onclick="toggleExecMonthGroup(this)"
          style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;cursor:pointer;background:var(--bg3);user-select:none;gap:6px;">
          <span style="font-size:11px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:1.2px;">${grp.label}</span>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:10px;background:rgba(212,175,55,0.12);color:var(--gold);padding:2px 8px;border-radius:20px;">${grp.items.length}</span>
            <span class="exec-month-arrow" style="font-size:11px;color:var(--text-dim);transition:transform 0.2s;">${hasActive ? '▾' : '▸'}</span>
          </div>
        </div>
        <div class="exec-month-items" style="display:${hasActive ? 'block' : 'none'};">
          ${grp.items.map(ev => {
            const isActive = activeExecutionResId === ev.id;
            const statusBadge = ev.status === 'on-going' ? '<span style="font-size:9px;background:rgba(34,197,94,0.15);color:var(--green);padding:1px 6px;border-radius:8px;font-weight:700;margin-left:4px;">LIVE</span>'
              : ev.status === 'completed' ? '<span style="font-size:9px;background:rgba(34,197,94,0.1);color:var(--green);padding:1px 6px;border-radius:8px;">done</span>'
              : '';
            return `<div onclick="selectExecutionEvent('${ev.id}')"
              style="padding:11px 14px;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.04);transition:background 0.15s;${isActive ? 'background:rgba(212,175,55,0.1);border-left:3px solid var(--gold);' : 'border-left:3px solid transparent;'}">
              <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:6px;">
                <div style="min-width:0;">
                  <div style="font-weight:600;color:${isActive ? 'var(--gold)' : 'var(--cream)'};font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHtml(ev.client || '—')}${statusBadge}</div>
                  <div style="font-size:11px;color:var(--text-dim);margin-top:2px;">${escHtml(ev.type || '—')}</div>
                  <div style="font-size:11px;color:var(--text-dim);">${escHtml(ev.date || '—')}</div>
                </div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>`;
  });

  container.innerHTML = html;
}

function toggleExecMonthGroup(headerEl) {
  const items = headerEl.nextElementSibling;
  const arrow = headerEl.querySelector('.exec-month-arrow');
  const isOpen = items.style.display !== 'none';
  items.style.display = isOpen ? 'none' : 'block';
  if (arrow) arrow.textContent = isOpen ? '▸' : '▾';
}
window.toggleExecMonthGroup = toggleExecMonthGroup;

function selectExecutionEvent(id) {
  activeExecutionResId = id;
  renderExecutionDayReservations(); // Refresh list to highlight active

  const res = RESERVATIONS.find(r => r.id === id);
  if (!res) return;

  const todayStr = new Date().toISOString().split('T')[0];
  const eventDate = res.date || '';

  // Determine if today IS the execution day
  const isExecutionDay = (eventDate === todayStr) || (res.status === 'on-going');

  // Always hide all states first
  document.getElementById('execution-empty-state').style.display = 'none';
  document.getElementById('execution-upcoming-state').style.display = 'none';
  document.getElementById('execution-active-content').style.display = 'none';

  document.getElementById('execution-res-title').textContent = res.client + '\u2019s Event';
  document.getElementById('execution-res-subtitle').textContent = (res.type || res.packageName || 'Reservation') + ' \u00b7 ' + (eventDate || '\u2014');

  if (isExecutionDay) {
    // Show upcoming state with Start button (same card, just with "Today" countdown)
    document.getElementById('execution-upcoming-state').style.display = 'block';
    renderExecUpcomingCard(res, document.getElementById('execution-upcoming-state'));
    return;
    // (original GPS/settlement panel kept below for direct invocation)
    document.getElementById('execution-active-content').style.display = 'block';

    const rawAmt = typeof res.amount === 'string' ? parseFloat(res.amount.replace(/[^0-9.]/g, '')) || 0 : (res.amount || 0);
    document.getElementById('settle-base-total').textContent = '\u20b1' + rawAmt.toLocaleString(undefined, { minimumFractionDigits: 2 });

    adhocCharges = res.adhocCharges || [];
    renderSettlementPanel();

    document.getElementById('res-exec-status').textContent = 'Tracker idle.';
    document.getElementById('res-exec-eta').textContent = '\u2014';
    document.getElementById('res-exec-distance').textContent = '\u2014';
    document.getElementById('res-exec-speed').textContent = '\u2014';
    document.getElementById('res-exec-live-status').textContent = 'idle';
  } else {
    // Show upcoming execution day card
    const upcomingEl = document.getElementById('execution-upcoming-state');
    upcomingEl.style.display = 'block';
    renderExecUpcomingCard(res, upcomingEl);
  }
}

function renderExecUpcomingCard(res, container) {
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  let daysLeft = null;
  let formattedDate = res.date || '\u2014';
  let eventDateObj = null;

  if (res.date) {
    eventDateObj = new Date(res.date + 'T00:00:00');
    if (!isNaN(eventDateObj)) {
      daysLeft = Math.ceil((eventDateObj - todayMidnight) / (1000 * 60 * 60 * 24));
      formattedDate = eventDateObj.toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
  }

  let countdownHtml = '';
  if (daysLeft !== null) {
    if (daysLeft < 0) {
      countdownHtml = `<div style="margin:20px 0;padding:14px 20px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:10px;text-align:center;">
        <div style="font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Event Has Passed</div>
        <div style="font-size:22px;font-weight:700;color:var(--red);">${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? 's' : ''} ago</div>
      </div>`;
    } else if (daysLeft === 0) {
      countdownHtml = `<div style="margin:20px 0;padding:14px 20px;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.25);border-radius:10px;text-align:center;">
        <div style="font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Execution Day Status</div>
        <div style="font-size:22px;font-weight:700;color:var(--green);">\ud83d\udfe2 TODAY</div>
      </div>`;
    } else {
      const urgencyColor = daysLeft <= 7 ? 'var(--amber)' : daysLeft <= 30 ? 'var(--gold)' : 'var(--cream)';
      const urgencyBg = daysLeft <= 7 ? 'rgba(217,119,6,0.08)' : daysLeft <= 30 ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.04)';
      const urgencyBorder = daysLeft <= 7 ? 'rgba(217,119,6,0.25)' : daysLeft <= 30 ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.08)';
      countdownHtml = `<div style="margin:20px 0;padding:20px;background:${urgencyBg};border:1px solid ${urgencyBorder};border-radius:12px;text-align:center;">
        <div style="font-size:11px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1.2px;margin-bottom:8px;">Days Until Execution</div>
        <div style="font-size:52px;font-weight:800;color:${urgencyColor};line-height:1;">${daysLeft}</div>
        <div style="font-size:12px;color:var(--text-dim);margin-top:6px;">day${daysLeft !== 1 ? 's' : ''} remaining</div>
      </div>`;
    }
  }

  const statusMap = { confirmed: { label: 'Confirmed', cls: 'confirmed' }, preparing: { label: 'Preparing', cls: 'warning' }, procuring: { label: 'Procuring', cls: 'warning' }, procurement: { label: 'Procurement', cls: 'warning' }, 'on-going': { label: 'On-Going', cls: 'ok' }, completed: { label: 'Completed', cls: 'confirmed' } };
  const statusInfo = statusMap[String(res.status).toLowerCase()] || { label: res.status || 'Unknown', cls: 'pending' };

  const rawAmt = typeof res.amount === 'string' ? parseFloat(res.amount.replace(/[^0-9.]/g, '')) || 0 : (res.amount || 0);
  const amtStr = rawAmt > 0 ? '\u20b1' + rawAmt.toLocaleString() : '\u2014';

  container.innerHTML = `
    <div style="padding:4px 0;">
      ${countdownHtml}

      <!-- Event summary card -->
      <div style="background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:16px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
          <div style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;">Event Details</div>
          <span class="badge ${statusInfo.cls}">${statusInfo.label}</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div>
            <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:3px;">Client</div>
            <div style="font-size:13px;font-weight:600;color:var(--cream);">${escHtml(res.client || '\u2014')}</div>
          </div>
          <div>
            <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:3px;">Event Type</div>
            <div style="font-size:13px;font-weight:600;color:var(--cream);">${escHtml(res.type || '\u2014')}</div>
          </div>
          <div>
            <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:3px;">Execution Date</div>
            <div style="font-size:12px;font-weight:600;color:var(--gold);">${formattedDate}</div>
          </div>
          <div>
            <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:3px;">Time</div>
            <div style="font-size:12px;font-weight:600;color:var(--cream);">${escHtml(res.time || '\u2014')}</div>
          </div>
          <div>
            <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:3px;">Package</div>
            <div style="font-size:12px;color:var(--cream);">${escHtml(res.packageName || res.package || '\u2014')}</div>
          </div>
          <div>
            <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:3px;">Total Amount</div>
            <div style="font-size:13px;font-weight:700;color:var(--gold);">${amtStr}</div>
          </div>
        </div>
        ${res.venue ? `<div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border);">
          <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:3px;">Venue</div>
          <div style="font-size:12px;color:var(--cream);">${escHtml(res.venue)}</div>
        </div>` : ''}
      </div>

      <!-- Start Execution Day button -->
      <button onclick="startExecDay('${res.id}')"
        style="width:100%;padding:14px 20px;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-weight:700;font-size:14px;border:none;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:opacity 0.15s;letter-spacing:0.3px;margin-bottom:10px;box-shadow:0 4px 20px rgba(34,197,94,0.25);"
        onmouseover="this.style.opacity='0.88'" onmouseout="this.style.opacity='1'">
        <span style="font-size:18px;"></span>
        Start Execution Day
      </button>

      <!-- CTA button to logistics timeline -->
      <button onclick="goToExecLogisticsTimeline('${res.id}')"
        style="width:100%;padding:14px 20px;background:linear-gradient(135deg,var(--gold),#c9983a);color:#000;font-weight:700;font-size:13px;border:none;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:opacity 0.15s;letter-spacing:0.3px;"
        onmouseover="this.style.opacity='0.88'" onmouseout="this.style.opacity='1'">
        <span style="font-size:16px;">\ud83d\udcc5</span>
        View Logistics &amp; Timeline
      </button>
      <div style="font-size:11px;color:var(--text-dim);text-align:center;margin-top:8px;">Opens this reservation\u2019s timeline in Reservation Details Handling</div>
    </div>`;
}

function goToExecLogisticsTimeline(resId) {
  // Set the active reservation in the details module
  activeResDetailId = resId;
  resDetailMode = 'view';
  resDetailsActiveTab = 'timeline';

  // Navigate to the reservation details section
  const navBtn = document.getElementById('nav-res-details');
  showSection('res-details', navBtn);
}
window.goToExecLogisticsTimeline = goToExecLogisticsTimeline;

function startExecutionTrackerAuto() {
  if (!activeExecutionResId) return alert('Select an event first.');
  document.getElementById('res-exec-status').textContent = 'Tracking active (Demo mode).';
  document.getElementById('res-exec-eta').textContent = '25 mins';
  document.getElementById('res-exec-distance').textContent = '12.5 km';
  document.getElementById('res-exec-speed').textContent = '40 km/h';
  document.getElementById('res-exec-live-status').textContent = 'On The Way';
  document.getElementById('res-exec-map').innerHTML = '<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#1a1a1a; color:var(--text-dim);">[ GPS Map Placeholder ]</div>';
}

function stopExecutionTracker() {
  document.getElementById('res-exec-status').textContent = 'Tracker stopped.';
}

function setExecutionLiveStatus(status) {
  document.getElementById('res-exec-live-status').textContent = status;
  if (status === 'delayed') {
    document.getElementById('res-exec-delay-wrap').style.display = 'block';
  } else {
    document.getElementById('res-exec-delay-wrap').style.display = 'none';
  }
}

function saveExecutionDelayReason() {
  alert('Delay reason logged.');
  document.getElementById('res-exec-delay-wrap').style.display = 'none';
}

function addExecutionActivityLog() {
  const title = document.getElementById('res-exec-activity-title').value;
  if (!title) return alert('Enter an activity title');
  const list = document.getElementById('res-exec-activity-list');
  const now = new Date().toLocaleTimeString();
  list.innerHTML = `<div style="font-size:11px; margin-bottom:4px;"><strong style="color:var(--gold);">${now}</strong>: ${title}</div>` + list.innerHTML;
  document.getElementById('res-exec-activity-title').value = '';
}

// Settlement Logic
function addAdhocCharge() {
  if (!activeExecutionResId) return alert('Select an event first.');

  const name = document.getElementById('settle-item-name').value;
  const qty = parseInt(document.getElementById('settle-item-qty').value) || 1;
  const price = parseFloat(document.getElementById('settle-item-price').value) || 0;

  if (!name || price <= 0) return alert('Please enter a valid item name and unit price.');

  adhocCharges.push({ name, qty, price, total: qty * price });

  // Clear inputs
  document.getElementById('settle-item-name').value = '';
  document.getElementById('settle-item-qty').value = '1';
  document.getElementById('settle-item-price').value = '';

  renderSettlementPanel();
}

function renderSettlementPanel() {
  const tbody = document.getElementById('settle-charges-list');

  if (adhocCharges.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:12px; color:var(--text-dim);">No ad-hoc charges added yet.</td></tr>';
  } else {
    tbody.innerHTML = adhocCharges.map((charge, idx) => `
      <tr>
        <td>${charge.name}</td>
        <td>${charge.qty}</td>
        <td>₱${charge.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
        <td style="text-align:right;">₱${charge.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
        <td style="text-align:center;"><button style="background:transparent; border:none; color:var(--red); cursor:pointer;" onclick="removeAdhocCharge(${idx})">✕</button></td>
      </tr>
    `).join('');
  }

  // Calculate Grand Total
  const res = RESERVATIONS.find(r => r.id === activeExecutionResId);
  const rawAmt = res ? (typeof res.amount === 'string' ? parseFloat(res.amount.replace(/[^0-9.]/g, '')) || 0 : (res.amount || 0)) : 0;
  const adhocTotal = adhocCharges.reduce((sum, c) => sum + c.total, 0);
  const grandTotal = rawAmt + adhocTotal;

  document.getElementById('settle-final-total').textContent = `₱${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

function removeAdhocCharge(index) {
  adhocCharges.splice(index, 1);
  renderSettlementPanel();
}

async function markEventSettled() {
  if (!activeExecutionResId) return;
  try {
    const { doc, updateDoc } = window.firebaseFns;
    const grandTotalStr = document.getElementById('settle-final-total').textContent;

    await updateDoc(doc(window.firebaseDB, 'reservations', activeExecutionResId), {
      status: 'completed',
      adhocCharges: adhocCharges,
      finalSettledAmount: grandTotalStr
    });

    // Update local state
    const res = RESERVATIONS.find(r => r.id === activeExecutionResId);
    if (res) {
      res.status = 'completed';
      res.adhocCharges = adhocCharges;
    }

    alert('Event successfully settled and marked as completed!');
    activeExecutionResId = null;
    document.getElementById('execution-empty-state').style.display = 'block';
    document.getElementById('execution-active-content').style.display = 'none';
    renderExecutionDayReservations();
  } catch (e) {
    console.error(e);
    alert('Error settling event.');
  }
}

function generateFinalInvoice() {
  if (!activeExecutionResId) return;
  alert('Simulating PDF Generation...\\n\\nInvoice generated and saved to records.');
}
window.selectExecutionEvent = selectExecutionEvent;
window.startExecutionTrackerAuto = startExecutionTrackerAuto;
window.stopExecutionTracker = stopExecutionTracker;
window.setExecutionLiveStatus = setExecutionLiveStatus;
window.saveExecutionDelayReason = saveExecutionDelayReason;
window.addExecutionActivityLog = addExecutionActivityLog;
window.addAdhocCharge = addAdhocCharge;
window.removeAdhocCharge = removeAdhocCharge;
window.markEventSettled = markEventSettled;
window.generateFinalInvoice = generateFinalInvoice;


window.triggerMeetingMode = async function () {
  if (typeof activeDetailsMtId === 'undefined' || !activeDetailsMtId) return;
  const mtId = activeDetailsMtId;

  // Signal live meeting for customer sync
  try {
    const { doc, updateDoc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'meetings', mtId), { status: 'live' });
  } catch(e) { console.error("Sync Error:", e); }

  closeMtDetailsModal();
  initiateMeetingMode(mtId);
};

window.markPaymentConfirmed = async function () {
  if (!activeMeetingResCache) return;
  const btn = event.target;
  btn.disabled = true;
  try {
    const { doc, updateDoc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'reservations', activeMeetingResCache.id), {
      paymentStatus: 'paid',
      paymentRequested: false
    });
    alert('Payment confirmed for reservation.');
  } catch (e) { alert('Update failed'); }
  finally { btn.disabled = false; }
};

window.requestPaymongoPayment = async function () {
  if (!activeMeetingResCache) return;

  const amountStr = document.getElementById('mt-billing-amount-initial').value;
  if (!amountStr) return alert('Please enter the initial fee amount.');

  const btn = document.getElementById('btn-pay-initial');
  if (!btn) return;
  btn.disabled = true;
  btn.textContent = 'Sending...';

  try {
    const { doc, updateDoc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'reservations', activeMeetingResCache.id), {
      paymentRequested: true,
      paymentAmount: amountStr,
      paymentType: 'initial_fee'
    });
    alert('Payment prompt sent to customer dashboard.');
  } catch (e) {
    alert('Update failed');
    btn.disabled = false;
    btn.textContent = 'Commence Initial Fee Payment';
  }
};

window.saveDownpaymentSchedule = async function () {
  if (!activeMeetingResCache) return;
  const amount = document.getElementById('mt-downpayment-amount').value;
  const dueDate = document.getElementById('mt-downpayment-due').value;

  if (!dueDate) return alert('Please select a due date for the downpayment schedule.');

  const btn = document.getElementById('btn-save-downpayment');
  btn.disabled = true;
  btn.textContent = 'Saving Schedule...';

  try {
    const { doc, updateDoc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'reservations', activeMeetingResCache.id), {
      downpaymentAmount: amount,
      downpaymentDueDate: dueDate
    });
    alert('Downpayment schedule saved.');
  } catch (e) {
    alert('Failed to save schedule');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Save Downpayment Schedule';
  }
};

window.confirmCashPayment = async function () {
  if (!activeMeetingResCache) return;
  const btn = event.target;
  btn.disabled = true;

  try {
    const { doc, updateDoc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'reservations', activeMeetingResCache.id), {
      paymentStatus: 'paid',
      paymentRequested: false,
      cashPaymentStatus: 'confirmed'
    });
    alert('Cash payment successfully confirmed.');
    document.getElementById('mt-billing-cash-confirm').style.display = 'none';
  } catch (e) {
    alert('Failed to confirm cash payment.');
    btn.disabled = false;
  }
};

// ====================================================================
// ==================== RESERVATION DETAILS GPS MAP ===================
// ====================================================================
let resdMap = null;
let resdMarker = null;

async function initResdMap(address) {
  if (!address) return;
  const container = document.getElementById('resd-map');
  if (!container) return;

  // Cleanup old map if exists
  if (resdMap) {
    resdMap.remove();
    resdMap = null;
  }

  try {
    const coords = await geocodeAddress(address);
    if (!coords) throw new Error("Could not geocode address");

    resdMap = L.map('resd-map').setView([coords.lat, coords.lon], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(resdMap);

    resdMarker = L.marker([coords.lat, coords.lon]).addTo(resdMap)
      .bindPopup(address)
      .openPopup();

    // Remove loading text
    const loadingText = container.querySelector('div');
    if (loadingText && loadingText.textContent.includes('Loading')) {
      loadingText.remove();
    }
  } catch (err) {
    console.warn("Map Geocoding Error:", err);
    container.innerHTML = `<div style="display:flex; align-items:center; justify-content:center; height:100%; color:var(--text-dim); font-size:12px; padding:20px; text-align:center;">
       Map unavailable.<br/><span style="opacity:0.6; margin-top:4px;">OSM could not locate: "${address}"</span>
    </div>`;
  }
}

async function geocodeAddress(address) {
  if (!address) return null;
  
  const tryFetch = async (query) => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
      const response = await fetch(url, {
        headers: { 
          'Accept-Language': 'en-US,en;q=0.5',
          'User-Agent': 'SmartServe-Admin-Dashboard/1.0' 
        }
      });
      if (!response.ok) return null;
      const data = await response.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
      }
      return null;
    } catch (err) {
      return null;
    }
  };

  // 1. Try full address
  let coords = await tryFetch(address);
  if (coords) return coords;

  // 2. Try stripping the first part (often venue name or building name)
  if (address.includes(',')) {
    const parts = address.split(',');
    if (parts.length > 1) {
      const fallback = parts.slice(1).join(',').trim();
      coords = await tryFetch(fallback);
      if (coords) return coords;
    }
  }

  // 3. Try removing common noise (Floor, Rm, Unit, Bldg)
  const cleaned = address.replace(/(Floor|Rm|Unit|Suite|Bldg|Phase|Level)\s*[\w\d-]*/gi, '').replace(/\s+/g, ' ').trim();
  if (cleaned !== address && cleaned.length > 5) {
    coords = await tryFetch(cleaned);
    if (coords) return coords;
  }

  return null;
}

window.initResdMap = initResdMap;

window.zoomDoc = function(btn, delta) {
  const container = btn.closest('.doc-zoom-container');
  const img = container.querySelector('.doc-zoom-img');
  if (!img) return;
  
  let scale = parseFloat(img.getAttribute('data-zoom') || '1');
  scale += delta;
  if (scale < 0.5) scale = 0.5;
  if (scale > 4.0) scale = 4.0;
  
  img.style.transform = `scale(${scale})`;
  img.setAttribute('data-zoom', scale);
};


// ====================================================================
// EXECUTION DAY PLANNING PANEL
// ====================================================================

let activeExecutionPlannerDate = null;
let activeExecPhaseIdx = 0;

function openExecutionPlanner(dateStr) {
  activeExecutionPlannerDate = dateStr;
  const res = RESERVATIONS.find(function(r) { return r.id === activeResDetailId; });
  if (!res) return;

  const panel = document.getElementById('resd-execution-planner');
  if (panel) panel.style.display = 'block';

  document.getElementById('exec-planner-subtitle').textContent = `Plan strict timeframes and staff deployment for ${dateStr}`;

  // Parse time
  const extractTime = (str) => {
    const match = str.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?/i);
    if (!match) return null;
    let h = parseInt(match[1]);
    let m = match[2] || '00';
    const ampm = (match[3] || '').toUpperCase();
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${m}`;
  };

  let tStart = '10:00';
  let tEnd = '15:00';
  if (res.time && res.time.includes('-')) {
    const parts = res.time.split('-');
    if (parts.length === 2) {
      tStart = extractTime(parts[0]) || tStart;
      tEnd = extractTime(parts[1]) || tEnd;
    }
  } else if (res.time && res.time.includes('to')) {
    const parts = res.time.split('to');
    if (parts.length === 2) {
      tStart = extractTime(parts[0]) || tStart;
      tEnd = extractTime(parts[1]) || tEnd;
    }
  }

  document.getElementById('exec-planner-range').textContent = `Time Range: ${res.time || tStart + ' to ' + tEnd}`;

  // Calculate phases based on tStart and tEnd
  const subtractHours = (tStr, hrs) => {
    let [h, m] = tStr.split(':');
    h = parseInt(h) - hrs;
    if (h < 0) h = 0;
    return `${h.toString().padStart(2, '0')}:${m}`;
  };
  const addHours = (tStr, hrs) => {
    let [h, m] = tStr.split(':');
    h = parseInt(h) + hrs;
    if (h > 23) h = 23;
    return `${h.toString().padStart(2, '0')}:${m}`;
  };

  // Initialize or load plan
  if (!res.executionPlan) {
    res.executionPlan = {
      flexibility: 'strict',
      phases: [
        { id: 'departure', name: 'Departure', start: subtractHours(tStart, 3), end: subtractHours(tStart, 2), tasks: [{ text: 'Count equipment', staffIds: [] }, { text: 'Load transport', staffIds: [] }] },
        { id: 'deployment', name: 'Deployment', start: subtractHours(tStart, 2), end: tStart, tasks: [{ text: 'Count equipment', staffIds: [] }, { text: 'Set up venue', staffIds: [] }, { text: 'Set up dishes', staffIds: [] }, { text: 'Final briefing', staffIds: [] }] },
        { id: 'execution', name: 'Execution', start: tStart, end: tEnd, tasks: [{ text: 'Count equipment', staffIds: [] }, { text: 'Serve guests', staffIds: [] }, { text: 'Monitor stations', staffIds: [] }] },
        { id: 'bashout', name: 'Bashout', start: tEnd, end: addHours(tEnd, 1), tasks: [{ text: 'Count equipment', staffIds: [] }, { text: 'Pack equipment', staffIds: [] }, { text: 'Clear venue', staffIds: [] }] },
        { id: 'restorage', name: 'Restorage', start: addHours(tEnd, 1), end: addHours(tEnd, 2), tasks: [{ text: 'Count equipment', staffIds: [] }, { text: 'Unload transport', staffIds: [] }, { text: 'Inventory check', staffIds: [] }] }
      ]
    };
  } else if (res.executionPlan.phases) {
    // Migration: Convert string tasks to object tasks if needed
    res.executionPlan.phases.forEach(p => {
      if (Array.isArray(p.tasks) && p.tasks.length > 0 && typeof p.tasks[0] === 'string') {
        p.tasks = p.tasks.map(t => ({ text: t, staffIds: [] }));
      }
      // Ensure "Count equipment" is first
      const hasCount = p.tasks.some(t => t.text.toLowerCase() === 'count equipment');
      if (!hasCount) {
        p.tasks.unshift({ text: 'Count equipment', staffIds: [] });
      }
    });
  }

  document.getElementById('exec-planner-flexibility').value = res.executionPlan.flexibility || 'strict';
  activeExecPhaseIdx = 0; // Reset to first phase
  renderExecutionPlannerStaff();
  renderExecutionPlannerPhases();
  renderExecutionTimelineVisual();
  
  // Scroll to panel
  setTimeout(() => { panel.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, 100);
}

function closeExecutionPlanner() {
  const panel = document.getElementById('resd-execution-planner');
  if (panel) panel.style.display = 'none';
  activeExecutionPlannerDate = null;
}

function renderExecutionPlannerStaff() {
  const container = document.getElementById('exec-planner-staff');
  if (!container) return;

  const res = RESERVATIONS.find(function(r) { return r.id === activeResDetailId; });
  const assignments = (res && res.staffing && res.staffing.assignments) || [];

  if (assignments.length === 0) {
    container.innerHTML = `<div style="font-size:11px; color:var(--text-dim); font-style:italic;">No staff assigned yet. Go to Staff Allocation tab first.</div>`;
    return;
  }

  container.innerHTML = assignments.map(a => `
    <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg); border:1px solid var(--border); padding:8px 12px; border-radius:6px;">
      <div style="font-size:11px; font-weight:700; color:var(--cream);">${a.staffName}</div>
      <div style="font-size:10px; color:var(--text-dim); background:rgba(255,255,255,0.05); padding:2px 6px; border-radius:4px;">${a.group}</div>
    </div>
  `).join('');
}

function renderExecutionPlannerPhases() {
  const container = document.getElementById('exec-planner-phases');
  if (!container) return;

  const res = RESERVATIONS.find(function(r) { return r.id === activeResDetailId; });
  if (!res || !res.executionPlan || !res.executionPlan.phases) return;

  const assignments = (res.staffing && res.staffing.assignments) || [];
  const staffMap = {};
  assignments.forEach(a => { staffMap[a.staffId] = a.staffName; });

  const phases = res.executionPlan.phases;
  
  // 1. Render Phase Selector (Cards in a row)
  let html = `
    <div style="display:flex; gap:15px; overflow-x:auto; padding-bottom:15px; margin-bottom:20px; border-bottom:1px solid var(--border);">
  `;
  
  phases.forEach((p, idx) => {
    const isActive = idx === activeExecPhaseIdx;
    const totalTasks = p.tasks.length;
    const assignedTasks = p.tasks.filter(t => t.staffIds && t.staffIds.length > 0).length;
    const pcnt = totalTasks > 0 ? Math.round((assignedTasks / totalTasks) * 100) : 0;
    
    // Status color based on phase ID
    const colors = {
      'departure': 'var(--gold)',
      'deployment': 'var(--blue)',
      'execution': 'var(--green)',
      'bashout': 'var(--red)',
      'restorage': 'var(--purple)'
    };
    const accent = colors[p.id] || 'var(--gold)';

    html += `
      <div onclick="selectExecPhase(${idx})" 
           style="min-width:180px; flex-shrink:0; background:${isActive ? 'rgba(255,255,255,0.05)' : 'var(--bg2)'}; 
                  border:1px solid ${isActive ? accent : 'var(--border)'}; border-radius:12px; padding:15px; 
                  cursor:pointer; transition:all 0.3s; position:relative; overflow:hidden;">
        <div style="position:absolute; left:0; top:0; bottom:0; width:4px; background:${accent};"></div>
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
          <div style="font-size:12px; font-weight:800; color:${isActive ? accent : 'var(--cream)'}; text-transform:uppercase; line-height:1.2;">${p.name}</div>
          <div style="font-size:9px; background:rgba(255,255,255,0.05); padding:2px 6px; border-radius:10px; color:var(--text-dim);">UPCOMING</div>
        </div>
        <div style="font-size:10px; color:var(--text-dim); margin-bottom:10px;">${p.start} - ${p.end}</div>
        <div style="font-size:10px; color:var(--text-mid);">${assignedTasks}/${totalTasks} Activities (${pcnt}%)</div>
      </div>
    `;
  });
  html += `</div>`;

  // 2. Render Detail View for Active Phase
  const p = phases[activeExecPhaseIdx];
  if (p) {
    html += `
      <div style="background:var(--bg3); border:1px solid var(--border); border-radius:12px; padding:25px; animation: fadeIn 0.3s ease-out;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid var(--border); padding-bottom:15px;">
          <div>
             <div style="font-size:11px; color:var(--gold); text-transform:uppercase; font-weight:800; letter-spacing:1px; margin-bottom:4px;">Current Phase Details</div>
             <div style="font-size:18px; font-weight:800; color:var(--cream); text-transform:uppercase;">${p.name}</div>
          </div>
          <div style="display:flex; gap:10px; align-items:center;">
             <div class="form-group" style="margin:0;">
               <label style="font-size:10px; margin-bottom:2px;">Start</label>
               <input type="time" value="${p.start}" oninput="updateExecPhaseField(${activeExecPhaseIdx}, 'start', this.value)" class="input-field" style="padding:6px 10px; font-size:13px; width:110px;">
             </div>
             <div class="form-group" style="margin:0;">
               <label style="font-size:10px; margin-bottom:2px;">End</label>
               <input type="time" value="${p.end}" oninput="updateExecPhaseField(${activeExecPhaseIdx}, 'end', this.value)" class="input-field" style="padding:6px 10px; font-size:13px; width:110px;">
             </div>
          </div>
        </div>

        <div>
          <div style="font-size:11px; color:var(--text-dim); margin-bottom:15px; text-transform:uppercase; font-weight:700; letter-spacing:0.5px;">Activities & Dedicated Staffing</div>
          <div style="display:flex; flex-direction:column; gap:15px;">
            ${p.tasks.map((t, tIdx) => `
              <div style="background:rgba(255,255,255,0.02); border-radius:10px; padding:15px; border:1px solid rgba(255,255,255,0.05); position:relative;">
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                  <div style="width:10px; height:10px; border-radius:50%; background:var(--gold); box-shadow: 0 0 10px var(--gold-bg);"></div>
                  <input type="text" value="${escHtml(t.text || '')}" oninput="updateExecTaskField(${activeExecPhaseIdx}, ${tIdx}, this.value)" class="input-field" 
                         style="padding:6px; font-size:13px; flex:1; font-weight:700; background:transparent; border:none; border-bottom:1px solid var(--border); border-radius:0;" placeholder="Activity name...">
                  <button onclick="removeTaskFromPhase(${activeExecPhaseIdx}, ${tIdx})" style="background:none; border:none; color:var(--red); cursor:pointer; font-size:16px; opacity:0.6; transition:opacity 0.2s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.6">✕</button>
                </div>
                
                <div style="display:flex; flex-wrap:wrap; gap:8px; padding-left:22px;">
                  ${assignments.map(a => {
                    const isActive = (t.staffIds || []).includes(a.staffId);
                    return `
                      <div onclick="toggleStaffInTask(${activeExecPhaseIdx}, ${tIdx}, '${a.staffId}')" 
                           style="cursor:pointer; padding:6px 14px; border-radius:20px; font-size:11px; 
                                  background:${isActive ? 'var(--gold)' : 'rgba(255,255,255,0.04)'}; 
                                  color:${isActive ? '#000' : 'var(--text-dim)'}; 
                                  border:1px solid ${isActive ? 'var(--gold)' : 'var(--border)'}; 
                                  font-weight:${isActive ? '700' : '500'}; transition:all 0.2s;">
                        ${isActive ? '✓' : '+'} ${a.staffName}
                      </div>
                    `;
                  }).join('') || '<div style="font-size:11px; color:var(--red); font-style:italic;">No staff available in allocation.</div>'}
                </div>
              </div>
            `).join('')}
            
            <button onclick="addTaskToPhase(${activeExecPhaseIdx})" 
                    style="background:rgba(255,255,255,0.02); border:1px dashed var(--border); color:var(--gold); border-radius:10px; padding:15px; font-size:12px; cursor:pointer; margin-top:5px; transition:all 0.2s; font-weight:600;" 
                    onmouseover="this.style.background='rgba(196,154,60,0.05)'; this.style.borderColor='var(--gold)';" onmouseout="this.style.background='rgba(255,255,255,0.02)'; this.style.borderColor='var(--border)';">
              + Add New Activity to ${p.name}
            </button>
          </div>
        </div>
        
        ${p.id === 'execution' ? `
        <div style="margin-top:40px; border-top:1px solid rgba(255,255,255,0.1); padding-top:30px;">
          <div style="font-size:11px; color:var(--text-dim); margin-bottom:15px; text-transform:uppercase; font-weight:700; letter-spacing:0.5px;">Execution Agenda (Event Flow)</div>
          <div style="display:flex; flex-direction:column; gap:15px;">
            ${(p.agenda || []).map((a, aIdx) => `
              <div style="background:rgba(255,255,255,0.02); border-radius:10px; padding:15px; border:1px solid rgba(255,255,255,0.05); position:relative;">
                <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
                  <div style="width:10px; height:10px; border-radius:50%; background:var(--gold); box-shadow: 0 0 10px var(--gold-bg);"></div>
                  
                  <input type="time" value="${a.time || p.start}" min="${p.start}" max="${p.end}" 
                         onchange="updateExecAgendaTime(${activeExecPhaseIdx}, ${aIdx}, this.value)" 
                         style="background:rgba(0,0,0,0.2); border:1px solid var(--border); color:var(--gold); padding:6px 10px; border-radius:6px; font-size:12px; font-weight:700; width:auto;">
                  
                  <select onchange="updateExecAgendaType(${activeExecPhaseIdx}, ${aIdx}, this.value)" 
                          style="background:rgba(0,0,0,0.2); border:1px solid var(--border); color:var(--cream); padding:6px 10px; border-radius:6px; font-size:12px; width:110px;">
                    <option value="Arrival" ${a.type==='Arrival'?'selected':''}>Arrival</option>
                    <option value="Program" ${a.type==='Program'?'selected':''}>Program</option>
                    <option value="Catering" ${a.type==='Catering'?'selected':''}>Catering</option>
                    <option value="Buffer" ${a.type==='Buffer'?'selected':''}>Buffer</option>
                    <option value="Custom" ${a.type==='Custom'||!a.type?'selected':''}>Custom</option>
                  </select>

                  <input type="text" value="${escHtml(a.text || '')}" oninput="updateExecAgendaField(${activeExecPhaseIdx}, ${aIdx}, this.value)" class="input-field" 
                         style="padding:6px; font-size:13px; flex:1; min-width:200px; font-weight:700; background:transparent; border:none; border-bottom:1px solid var(--border); border-radius:0;" placeholder="Agenda Item Name...">
                  
                  <button onclick="removeAgendaFromPhase(${activeExecPhaseIdx}, ${aIdx})" style="background:none; border:none; color:var(--red); cursor:pointer; font-size:16px; opacity:0.6; transition:opacity 0.2s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.6">✕</button>
                </div>
              </div>
            `).join('')}
            <button onclick="addAgendaToPhase(${activeExecPhaseIdx})" 
                    style="background:rgba(255,255,255,0.02); border:1px dashed var(--border); color:var(--gold); border-radius:10px; padding:15px; font-size:12px; cursor:pointer; margin-top:5px; transition:all 0.2s; font-weight:600;" 
                    onmouseover="this.style.background='rgba(196,154,60,0.05)'; this.style.borderColor='var(--gold)';" onmouseout="this.style.background='rgba(255,255,255,0.02)'; this.style.borderColor='var(--border)';">
              + Add Agenda Item
            </button>
          </div>
        </div>
        ` : ''}
      </div>
    `;
  }

  container.innerHTML = html;
}

window.selectExecPhase = function(idx) {
  activeExecPhaseIdx = idx;
  renderExecutionPlannerPhases();
};

window.updateExecPhaseField = function(pIdx, field, val) {
  const res = RESERVATIONS.find(function(r) { return r.id === activeResDetailId; });
  if (res && res.executionPlan && res.executionPlan.phases[pIdx]) {
    const plan = res.executionPlan;
    plan.phases[pIdx][field] = val;

    // CASCADING LOGIC: If flexibility is flexible and we change END of a phase
    if (plan.flexibility === 'flexible' && field === 'end') {
      let currentEnd = val;
      for (let i = pIdx + 1; i < plan.phases.length; i++) {
        const p = plan.phases[i];
        const duration = window.getTimeDiffMins(p.start, p.end);
        p.start = currentEnd;
        p.end = window.addMinutesToTime(p.start, duration);
        currentEnd = p.end;
      }
    }
    renderExecutionTimelineVisual();
    // Refresh the planner if open
    if (typeof renderExecutionPlannerPhases === 'function') renderExecutionPlannerPhases();
  }
};

window.updateExecFlexibility = function(val) {
  const res = RESERVATIONS.find(function(r) { return r.id === activeResDetailId; });
  if (res && res.executionPlan) {
    res.executionPlan.flexibility = val;
    renderExecutionPlannerPhases();
  }
};

window.updateExecTaskField = function(pIdx, tIdx, val) {
  const res = RESERVATIONS.find(function(r) { return r.id === activeResDetailId; });
  if (res && res.executionPlan && res.executionPlan.phases[pIdx]) {
    const task = res.executionPlan.phases[pIdx].tasks[tIdx];
    if (task) task.text = val;
  }
};

function renderExecutionTimelineVisual() {
  const container = document.getElementById('exec-planner-visual-blocks');
  if (!container) return;

  const res = RESERVATIONS.find(function(r) { return r.id === activeResDetailId; });
  if (!res || !res.executionPlan || !res.executionPlan.phases) return;

  const timeToPercent = (timeStr) => {
    let [h, m] = timeStr.split(':');
    h = parseInt(h);
    m = parseInt(m);
    const totalMins = (h * 60) + m;
    return (totalMins / 1440) * 100; // 1440 mins in 24 hours
  };

  const colors = {
    'departure': 'rgba(234, 179, 8, 0.7)',  // amber
    'deployment': 'rgba(59, 130, 246, 0.7)', // blue
    'execution': 'rgba(34, 197, 94, 0.9)',   // green (main event)
    'bashout': 'rgba(239, 68, 68, 0.7)',    // red
    'restorage': 'rgba(168, 85, 247, 0.7)'  // purple
  };

  container.innerHTML = res.executionPlan.phases.map(p => {
    const leftPcnt = timeToPercent(p.start);
    const rightPcnt = timeToPercent(p.end);
    let widthPcnt = rightPcnt - leftPcnt;
    // Handle midnight wrap (e.g., 23:00 to 01:00 next day)
    if (widthPcnt < 0) {
      widthPcnt = (100 - leftPcnt) + rightPcnt;
      // Note: for simplicity in a 1-day view, we'll just cap it to the end of the day
      widthPcnt = 100 - leftPcnt;
    }
    
    const color = colors[p.id] || 'rgba(255,255,255,0.5)';
    
    return `
      <div style="position:absolute; left:${leftPcnt}%; width:${widthPcnt}%; height:100%; background:${color}; border-right:1px solid rgba(255,255,255,0.1); cursor:pointer;" title="${p.name}: ${p.start} - ${p.end}"></div>
    `;
  }).join('');
}

function toggleStaffInTask(pIdx, tIdx, staffId) {
  const res = RESERVATIONS.find(function(r) { return r.id === activeResDetailId; });
  if (!res || !res.executionPlan || !res.executionPlan.phases) return;

  const phase = res.executionPlan.phases[pIdx];
  if (!phase) return;
  const task = phase.tasks[tIdx];
  if (!task) return;

  if (!task.staffIds) task.staffIds = [];
  
  const idx = task.staffIds.indexOf(staffId);
  if (idx === -1) {
    task.staffIds.push(staffId);
  } else {
    task.staffIds.splice(idx, 1);
  }

  renderExecutionPlannerPhases();
}

function addTaskToPhase(pIdx) {
  const res = RESERVATIONS.find(function(r) { return r.id === activeResDetailId; });
  if (!res || !res.executionPlan || !res.executionPlan.phases) return;
  res.executionPlan.phases[pIdx].tasks.push({ text: 'New Activity', staffIds: [] });
  renderExecutionPlannerPhases();
}

function removeTaskFromPhase(pIdx, tIdx) {
  const res = RESERVATIONS.find(function(r) { return r.id === activeResDetailId; });
  if (!res || !res.executionPlan || !res.executionPlan.phases) return;
  res.executionPlan.phases[pIdx].tasks.splice(tIdx, 1);
  renderExecutionPlannerPhases();
}

window.toggleStaffInTask = toggleStaffInTask;
window.addTaskToPhase = addTaskToPhase;
window.removeTaskFromPhase = removeTaskFromPhase;

function autoAllocateStaffToPhases() {
  const res = RESERVATIONS.find(function(r) { return r.id === activeResDetailId; });
  if (!res || !res.executionPlan) return;

  const assignments = (res.staffing && res.staffing.assignments) || [];
  if (assignments.length === 0) {
    alert("No staff assigned to this event in 'Staff Allocation'.");
    return;
  }

  // Clear existing task-level staff
  res.executionPlan.phases.forEach(p => {
    p.tasks.forEach(t => t.staffIds = []);
  });

  // Smart & Even Distribution
  res.executionPlan.phases.forEach(p => {
    const tasks = p.tasks;
    if (tasks.length === 0) return;

    // Distribute staff across tasks
    assignments.forEach((a, aIdx) => {
      const name = a.staffName.toLowerCase();
      
      // Specific priority logic for Bolesa and Transport team
      let assignedToSpecific = false;
      tasks.forEach(t => {
        const txt = (t.text || '').toLowerCase();
        if (txt.includes('count equipment') && name.includes('bolesa')) {
           t.staffIds.push(a.staffId);
           assignedToSpecific = true;
        }
        if (txt.includes('load transport') && (name.includes('jake') || name.includes('comedia') || name.includes('martin') || name.includes('ecoy'))) {
           t.staffIds.push(a.staffId);
           assignedToSpecific = true;
        }
      });

      if (!assignedToSpecific) {
        // Round robin distribution for others
        const tIdx = aIdx % tasks.length;
        if (!tasks[tIdx].staffIds.includes(a.staffId)) {
          tasks[tIdx].staffIds.push(a.staffId);
        }
      }
    });

    // Ensure no task is left empty if staff exist
    tasks.forEach(t => {
      if (t.staffIds.length === 0 && assignments.length > 0) {
         // Pick the least busy staff or just first one
         t.staffIds.push(assignments[0].staffId);
      }
    });
  });

  renderExecutionPlannerPhases();
  showToast("Staff distributed evenly across all activities.");
}

async function saveExecutionPlan() {
  const res = RESERVATIONS.find(function(r) { return r.id === activeResDetailId; });
  if (!res || !res.executionPlan) return;

  res.executionPlan.flexibility = document.getElementById('exec-planner-flexibility').value;
  
  // All phase data is already updated in the res.executionPlan object via oninput handlers

  try {
    const { updateDoc, doc } = window.firebaseFns;
    const db = window.firebaseDB;

    // Collect all unique staff identifiers assigned in this plan
    const allStaff = new Set();
    if (res.executionPlan && res.executionPlan.phases) {
        res.executionPlan.phases.forEach(p => {
            p.tasks.forEach(t => {
                if (t.staffIds) {
                    t.staffIds.forEach(sid => allStaff.add(sid));
                }
            });
        });
    }
    const staffIdsArray = Array.from(allStaff);

    await updateDoc(doc(db, 'reservations', res.id), { 
        executionPlan: res.executionPlan,
        staffIds: staffIdsArray // Flat array for easy staff dashboard filtering
    });
    
    showToast('Execution Plan saved successfully.');
    closeExecutionPlanner();
  } catch (e) {
    console.error("Failed to save Execution Plan", e);
    alert("Error saving Execution Plan.");
  }
}

async function autoAssignStaffToRes() {
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  if (!res) return;

  try {
    const { updateDoc, doc, collection, getDocs, query, where } = window.firebaseFns;
    const db = window.firebaseDB;

    // Fetch all staff
    const staffQuery = query(collection(db, 'users'), where('role', '==', 'staff'));
    const staffSnap = await getDocs(staffQuery);
    const allStaff = [];
    staffSnap.forEach(d => {
      allStaff.push({ id: d.id, ...d.data() });
    });

    // Busy staff
    const otherRes = RESERVATIONS.filter(d => d.date === res.date && d.id !== res.id);
    const busyStaffIds = new Set();
    otherRes.forEach(r => {
      if (r.staffing && r.staffing.assignments) {
        r.staffing.assignments.forEach(a => busyStaffIds.add(a.staffId));
      }
    });

    const available = allStaff.filter(s => !busyStaffIds.has(s.id));
    const autoPick = available.slice(0, 6);
    
    if (autoPick.length === 0) {
      alert("No available staff found for this date.");
      return;
    }

    const currentStaffing = res.staffing || { assignments: [], groups: [] };
    const newAssignments = autoPick.map(s => ({ staffId: s.id, staffName: s.name || s.email, task: 'General Support', group: 'Floor' }));
    
    // Replace current assignments to start fresh
    currentStaffing.assignments = newAssignments;

    await updateDoc(doc(db, 'reservations', res.id), { staffing: currentStaffing });
    res.staffing = currentStaffing;
    renderStaffAllocationTab();
  } catch (e) {
    console.error(e);
    alert("Error auto-assigning staff.");
  }
}

async function clearAllStaffAssignments() {
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  if (!res) return;
  if (!confirm("Are you sure you want to clear all staff assignments for this reservation?")) return;

  try {
    const { updateDoc, doc } = window.firebaseFns;
    const staffing = { assignments: [], groups: [] };
    await updateDoc(doc(window.firebaseDB, 'reservations', res.id), { staffing: staffing });
    res.staffing = staffing;
    renderStaffAllocationTab();
  } catch (e) {
    console.error(e);
    alert("Error clearing assignments.");
  }
}

window.autoAssignStaffToRes = autoAssignStaffToRes;
window.clearAllStaffAssignments = clearAllStaffAssignments;
window.toggleStaffInPhase = toggleStaffInTask; // Providing alias for UI backward compatibility
window.autoAllocateStaffToPhases = autoAllocateStaffToPhases;


// ── LiveKit Video Call ───────────────────────────────────────────────────
const LIVEKIT_URL   = 'wss://hal-serve-jf3vak9k.livekit.cloud';
const LIVEKIT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzgwOTMxODYsImlkZW50aXR5IjoicmluIiwiaXNzIjoiQVBJRmZGdXJUU25aY1o1IiwibmJmIjoxNzc4MDkyMjg2LCJzdWIiOiJyaW4iLCJ2aWRlbyI6eyJjYW5QdWJsaXNoIjp0cnVlLCJjYW5QdWJsaXNoRGF0YSI6dHJ1ZSwiY2FuU3Vic2NyaWJlIjp0cnVlLCJyb29tIjoibG9sIiwicm9vbUpvaW4iOnRydWV9fQ.dANR75tH_pfJ4MMAgQyAYbQ7SZxBB_3WP95RBKEM2Ho';

let _lkRoom        = null;
let _lkMicEnabled  = true;
let _lkCamEnabled  = true;
let _lkScreenShare = false;

window.enterVideoRoom = function() {
  const overlay = document.getElementById('vcall-overlay');
  if (!overlay) return;
  overlay.classList.add('visible');
  overlay.classList.remove('vcall-minimized');

  // Load LiveKit UMD bundle once, then connect
  if (window.LivekitClient) {
    _lkConnect();
  } else {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/livekit-client/dist/livekit-client.umd.min.js';
    s.onload  = _lkConnect;
    s.onerror = () => {
      const rd = document.getElementById('vcall-room-display');
      if (rd) rd.textContent = 'Failed to load LiveKit SDK';
    };
    document.head.appendChild(s);
  }
};

async function _lkConnect() {
  // Reset state
  if (_lkRoom) {
    try { await _lkRoom.disconnect(); } catch(e) {}
    _lkRoom = null;
  }
  _lkMicEnabled  = true;
  _lkCamEnabled  = true;
  _lkScreenShare = false;

  const grid = document.getElementById('vcall-video-grid');
  const rd   = document.getElementById('vcall-room-display');

  if (grid) grid.innerHTML = '<div id="vcall-empty-msg" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;color:#4a6070;"><div style="font-size:48px;">📡</div><p style="font-size:13px;letter-spacing:1px;">Connecting to room…</p></div>';
  if (rd)   rd.textContent = 'Connecting...';

  try {
    _lkRoom = new window.LivekitClient.Room({ adaptiveStream: true, dynacast: true });
    _lkSetupEvents(_lkRoom);
    await _lkRoom.connect(LIVEKIT_URL, LIVEKIT_TOKEN);
    await _lkRoom.localParticipant.enableCameraAndMicrophone();

    if (rd) rd.textContent = 'Room: ' + (_lkRoom.name || 'live');
    _lkRenderAll();
    _lkUpdateCount();

    // Reset button states
    const bm = document.getElementById('vcall-btn-mic');
    const bc = document.getElementById('vcall-btn-cam');
    const bs = document.getElementById('vcall-btn-screen');
    if (bm) { bm.textContent = '🎙️'; bm.style.borderColor = '#1e2a35'; bm.style.color = '#e8edf2'; }
    if (bc) { bc.textContent = '📷'; bc.style.borderColor = '#1e2a35'; bc.style.color = '#e8edf2'; }
    if (bs) { bs.textContent = '🖥️'; bs.style.borderColor = '#1e2a35'; bs.style.color = '#e8edf2'; }

  } catch(err) {
    console.error('LiveKit connect error:', err);
    if (rd) rd.textContent = 'Connection failed: ' + (err.message || err);
  }
}

function _lkSetupEvents(room) {
  const LK = window.LivekitClient;
  room.on(LK.RoomEvent.ParticipantConnected, (p) => {
    _lkRenderParticipant(p);
    _lkUpdateCount();
  });
  room.on(LK.RoomEvent.ParticipantDisconnected, (p) => {
    document.getElementById('lk-tile-' + p.sid)?.remove();
    _lkUpdateGrid();
    _lkUpdateCount();
  });
  room.on(LK.RoomEvent.TrackSubscribed, (track, pub, p) => {
    _lkAttachTrack(track, p);
  });
  room.on(LK.RoomEvent.TrackUnsubscribed, (track, pub, p) => {
    track.detach();
    if (track.kind === LK.Track.Kind.Video) {
      const tile = document.getElementById('lk-tile-' + p.sid);
      if (tile) { tile.querySelector('video')?.remove(); _lkEnsureAvatar(tile, p); }
    }
  });
  room.on(LK.RoomEvent.LocalTrackPublished, () => _lkRefreshLocalTile());
  room.on(LK.RoomEvent.LocalTrackUnpublished, () => _lkRefreshLocalTile());
  room.on(LK.RoomEvent.TrackMuted, (pub, p) => {
    if (pub.kind === LK.Track.Kind.Audio) _lkSetMuteIcon(p.sid, true);
  });
  room.on(LK.RoomEvent.TrackUnmuted, (pub, p) => {
    if (pub.kind === LK.Track.Kind.Audio) _lkSetMuteIcon(p.sid, false);
  });
  room.on(LK.RoomEvent.Disconnected, () => { leaveVideoRoom(true); });
}

function _lkRenderAll() {
  const grid = document.getElementById('vcall-video-grid');
  if (grid) grid.innerHTML = '';
  _lkRenderLocal();
  for (const [, p] of _lkRoom.remoteParticipants) _lkRenderParticipant(p);
  _lkUpdateGrid();
}

function _lkRenderLocal() {
  const p    = _lkRoom.localParticipant;
  const tile = _lkCreateTile(p.sid, (p.identity || 'Admin') + ' (you)');
  document.getElementById('vcall-video-grid').appendChild(tile);
  const LK = window.LivekitClient;
  const camPub = p.getTrackPublication(LK.Track.Source.Camera);
  if (camPub && camPub.track) {
    const v = camPub.track.attach();
    v.muted = true;
    v.style.cssText = 'width:100%;height:100%;object-fit:cover;position:absolute;inset:0;';
    tile.querySelector('.lk-avatar')?.remove();
    tile.insertBefore(v, tile.querySelector('.lk-overlay'));
  }
  document.getElementById('vcall-empty-msg')?.remove();
}

function _lkRenderParticipant(p) {
  if (document.getElementById('lk-tile-' + p.sid)) return;
  const tile = _lkCreateTile(p.sid, p.identity);
  document.getElementById('vcall-video-grid').appendChild(tile);
  document.getElementById('vcall-empty-msg')?.remove();
  for (const [, pub] of p.trackPublications) {
    if (pub.track && pub.isSubscribed) _lkAttachTrack(pub.track, p);
  }
  _lkUpdateGrid();
}

function _lkCreateTile(sid, name) {
  const tile = document.createElement('div');
  tile.id = 'lk-tile-' + sid;
  tile.style.cssText = 'position:relative;background:#0f1419;border:1px solid #1e2a35;border-radius:14px;overflow:hidden;aspect-ratio:16/9;min-width:0;display:flex;align-items:center;justify-content:center;';
  const init = (name || '?').charAt(0).toUpperCase();
  tile.innerHTML = `
    <div class="lk-avatar" style="display:flex;flex-direction:column;align-items:center;gap:12px;">
      <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#7b61ff,#00e5ff);display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;color:#fff;">${init}</div>
      <div style="font-size:13px;color:#4a6070;">${name}</div>
    </div>
    <div class="lk-overlay" style="position:absolute;bottom:0;left:0;right:0;padding:10px 14px;background:linear-gradient(transparent,rgba(0,0,0,0.7));display:flex;align-items:center;justify-content:space-between;">
      <div style="font-size:13px;font-weight:600;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,0.8);">${name}</div>
      <div id="lk-muted-${sid}" style="width:24px;height:24px;background:#ff3b5c;border-radius:50%;display:none;align-items:center;justify-content:center;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/></svg>
      </div>
    </div>`;
  return tile;
}

function _lkAttachTrack(track, p) {
  const tile = document.getElementById('lk-tile-' + p.sid);
  if (!tile) return;
  const LK = window.LivekitClient;
  if (track.kind === LK.Track.Kind.Video) {
    tile.querySelector('video')?.remove();
    const v = track.attach();
    v.style.cssText = 'width:100%;height:100%;object-fit:cover;position:absolute;inset:0;';
    tile.querySelector('.lk-avatar') && (tile.querySelector('.lk-avatar').style.display = 'none');
    tile.insertBefore(v, tile.querySelector('.lk-overlay'));
  } else if (track.kind === LK.Track.Kind.Audio) {
    const a = track.attach();
    a.style.display = 'none';
    document.body.appendChild(a);
  }
}

function _lkEnsureAvatar(tile, p) {
  const av = tile.querySelector('.lk-avatar');
  if (av) av.style.display = 'flex'; 
}

function _lkRefreshLocalTile() {
  if (!_lkRoom) return;
  const LK = window.LivekitClient;
  const p  = _lkRoom.localParticipant;
  const tile = document.getElementById('lk-tile-' + p.sid);
  if (!tile) return;
  tile.querySelector('video')?.remove();
  const camPub    = p.getTrackPublication(LK.Track.Source.Camera);
  const screenPub = p.getTrackPublication(LK.Track.Source.ScreenShare);
  const active    = screenPub || camPub;
  if (active && active.track) {
    const v = active.track.attach();
    v.muted = true;
    v.style.cssText = 'width:100%;height:100%;object-fit:cover;position:absolute;inset:0;';
    tile.querySelector('.lk-avatar') && (tile.querySelector('.lk-avatar').style.display = 'none');
    tile.insertBefore(v, tile.querySelector('.lk-overlay'));
  } else {
    const av = tile.querySelector('.lk-avatar');
    if (av) av.style.display = 'flex';
  }
}

function _lkUpdateGrid() {
  const grid  = document.getElementById('vcall-video-grid');
  const count = grid?.querySelectorAll('[id^="lk-tile-"]').length || 0;
  let cols = 1;
  if (count === 2) cols = 2;
  else if (count <= 4) cols = 2;
  else if (count <= 6) cols = 3;
  else cols = 4;
  if (grid) {
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.style.width  = '100%';
    grid.style.height = '100%';
  }
}

function _lkUpdateCount() {
  const el = document.getElementById('vcall-participant-count');
  if (el) el.textContent = '👥 ' + (1 + (_lkRoom?.remoteParticipants?.size || 0)) + ' participant(s)';
}

function _lkSetMuteIcon(sid, muted) {
  const el = document.getElementById('lk-muted-' + sid);
  if (el) el.style.display = muted ? 'flex' : 'none';
}

// ── Controls ─────────────────────────────────────────────────────────────
window.vcallToggleMic = async function() {
  if (!_lkRoom) return;
  _lkMicEnabled = !_lkMicEnabled;
  await _lkRoom.localParticipant.setMicrophoneEnabled(_lkMicEnabled);
  const btn = document.getElementById('vcall-btn-mic');
  if (btn) {
    btn.textContent  = _lkMicEnabled ? '🎙️' : '🔇';
    btn.style.borderColor = _lkMicEnabled ? '#1e2a35' : '#ff3b5c';
    btn.style.color       = _lkMicEnabled ? '#e8edf2' : '#ff3b5c';
  }
};

window.vcallToggleCam = async function() {
  if (!_lkRoom) return;
  _lkCamEnabled = !_lkCamEnabled;
  await _lkRoom.localParticipant.setCameraEnabled(_lkCamEnabled);
  const btn = document.getElementById('vcall-btn-cam');
  if (btn) {
    btn.style.borderColor = _lkCamEnabled ? '#1e2a35' : '#ff3b5c';
    btn.style.color       = _lkCamEnabled ? '#e8edf2' : '#ff3b5c';
  }
  _lkRefreshLocalTile();
};

window.vcallToggleScreen = async function() {
  if (!_lkRoom) return;
  const btn = document.getElementById('vcall-btn-screen');
  if (!_lkScreenShare) {
    try {
      await _lkRoom.localParticipant.setScreenShareEnabled(true);
      _lkScreenShare = true;
      if (btn) { btn.style.borderColor = '#00e5ff'; btn.style.color = '#00e5ff'; }
      _lkRefreshLocalTile();
    } catch(e) { /* user cancelled */ }
  } else {
    await _lkRoom.localParticipant.setScreenShareEnabled(false);
    _lkScreenShare = false;
    if (btn) { btn.style.borderColor = '#1e2a35'; btn.style.color = '#e8edf2'; }
    _lkRefreshLocalTile();
  }
};

// ── Overlay controls ──────────────────────────────────────────────────────
window.minimizeVideoCall = function() {
  const overlay = document.getElementById('vcall-overlay');
  const miniBar = document.getElementById('vcall-minimized-bar');
  const mainArea = document.getElementById('vcall-active-room');
  if (overlay) overlay.classList.add('vcall-minimized');
  if (miniBar)  miniBar.style.display  = 'flex';
  if (mainArea) mainArea.style.display = 'none';
};

window.maximizeVideoCall = function() {
  const overlay  = document.getElementById('vcall-overlay');
  const miniBar  = document.getElementById('vcall-minimized-bar');
  const mainArea = document.getElementById('vcall-active-room');
  if (overlay)  overlay.classList.remove('vcall-minimized');
  if (miniBar)  miniBar.style.display  = 'none';
  if (mainArea) mainArea.style.display = 'flex';
};

window.leaveVideoRoom = async function(alreadyDisconnected = false) {
  if (_lkRoom && !alreadyDisconnected) {
    try { await _lkRoom.disconnect(); } catch(e) {}
  }
  _lkRoom = null;
  document.querySelectorAll('audio').forEach(a => a.remove());

  const overlay  = document.getElementById('vcall-overlay');
  const miniBar  = document.getElementById('vcall-minimized-bar');
  const mainArea = document.getElementById('vcall-active-room');
  const grid     = document.getElementById('vcall-video-grid');
  const rd       = document.getElementById('vcall-room-display');
  if (overlay)  { overlay.classList.remove('visible'); overlay.classList.remove('vcall-minimized'); }
  if (miniBar)  miniBar.style.display  = 'none';
  if (mainArea) mainArea.style.display = 'flex';
  if (grid)     grid.innerHTML = '<div id="vcall-empty-msg" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;color:#4a6070;"><div style="font-size:48px;">📡</div><p style="font-size:13px;letter-spacing:1px;">Connecting to room…</p></div>';
  if (rd)       rd.textContent = 'Room: ...';
};


// ==================== PERSONNEL & TALENT HANDLING ====================
const PERSONNEL_POOL = {
  'Photo Booth Setup': [
    { name: 'Ricardo "Flash" Gomez', phone: '0917-555-1021', email: 'ricardo.flash@eventpro.ph', hires: 142, rate: 6000, role: 'Photo & Video Lead' },
    { name: 'Liza Santiago', phone: '0918-444-2032', email: 'liza.s@boothworks.com', hires: 98, rate: 5500, role: 'Photo & Video Lead' },
    { name: 'Marco Polo', phone: '0919-333-3043', email: 'marco.p@snaps.ph', hires: 76, rate: 5000, role: 'Photo & Video Lead' },
    { name: 'Elena Reyes', phone: '0920-222-4054', email: 'elena.r@memories.ph', hires: 54, rate: 4500, role: 'Photo & Video Lead' },
    { name: 'Berto Silva', phone: '0921-111-5065', email: 'berto.s@funclick.ph', hires: 31, rate: 4000, role: 'Photo & Video Lead' }
  ],
  'Event Coordinator': [
    { name: 'Maria Clara', phone: '0917-888-9001', email: 'maria.clara@coord.ph', hires: 210, rate: 15000, role: 'Event Coordinator' },
    { name: 'Jose Rizal Jr.', phone: '0918-777-8002', email: 'jose.rizal@events.ph', hires: 185, rate: 12000, role: 'Event Coordinator' },
    { name: 'Ana Kalang', phone: '0919-666-7003', email: 'ana.k@perfectday.ph', hires: 145, rate: 10000, role: 'Event Coordinator' },
    { name: 'Juan Luna', phone: '0920-555-6004', email: 'juan.l@masterpiece.ph', hires: 112, rate: 9000, role: 'Event Coordinator' },
    { name: 'Gabriela Silang', phone: '0921-444-5005', email: 'gabriela.s@vanguard.ph', hires: 89, rate: 8000, role: 'Event Coordinator' }
  ],
  'Party Host / Emcee': [
    { name: 'DJ Boom', phone: '0917-123-4567', email: 'dj.boom@party.ph', hires: 320, rate: 5000, role: 'Emcee / Party Host' },
    { name: 'MC Shine', phone: '0918-234-5678', email: 'mc.shine@glam.ph', hires: 280, rate: 4500, role: 'Emcee / Party Host' },
    { name: 'Bubbly Beth', phone: '0919-345-6789', email: 'beth.joy@host.ph', hires: 215, rate: 4000, role: 'Emcee / Party Host' },
    { name: 'Wacky Wally', phone: '0920-456-7890', email: 'wally.w@comedy.ph', hires: 190, rate: 3500, role: 'Emcee / Party Host' },
    { name: 'Elegant Eric', phone: '0921-567-8901', email: 'eric.v@formal.ph', hires: 145, rate: 3000, role: 'Emcee / Party Host' }
  ],
  'Kids Magician': [
    { name: 'Master Merlin', phone: '0917-999-0001', email: 'merlin@magic.ph', hires: 156, rate: 4000, role: 'Magician' },
    { name: 'Magic Mike (Kids Edition)', phone: '0918-888-0002', email: 'mike.m@illusions.ph', hires: 134, rate: 3500, role: 'Magician' },
    { name: 'Wonder Wendy', phone: '0919-777-0003', email: 'wendy.w@tricks.ph', hires: 112, rate: 3000, role: 'Magician' },
    { name: 'Professor Pocus', phone: '0920-666-0004', email: 'pocus@academy.ph', hires: 87, rate: 2500, role: 'Magician' },
    { name: 'Sly Sylvester', phone: '0921-555-0005', email: 'sylvester@magic.ph', hires: 65, rate: 2000, role: 'Magician' }
  ],
  'Event Photography': [
    { name: 'Crisostomo Ibarra', phone: '0917-000-1111', email: 'ibarra.pics@visuals.ph', hires: 245, rate: 12000, role: 'Photo & Video Lead' },
    { name: 'Leonor Rivera', phone: '0918-000-2222', email: 'leonor.r@captures.ph', hires: 198, rate: 10000, role: 'Photo & Video Lead' },
    { name: 'Basilio Santos', phone: '0919-000-3333', email: 'basilio@lens.ph', hires: 167, rate: 9000, role: 'Photo & Video Lead' },
    { name: 'Sisa Garcia', phone: '0920-000-4444', email: 'sisa.g@frames.ph', hires: 134, rate: 8000, role: 'Photo & Video Lead' },
    { name: 'Elias Cruz', phone: '0921-000-5555', email: 'elias@shutter.ph', hires: 98, rate: 7000, role: 'Photo & Video Lead' }
  ],
  'Photo & Video Bundle': [
    { name: 'Cinematic Dream Team', phone: '0917-555-9999', email: 'dreams@studio.ph', hires: 189, rate: 22000, role: 'Photo & Video Lead' },
    { name: 'Gold Frame Media', phone: '0918-444-8888', email: 'gold@media.ph', hires: 156, rate: 20000, role: 'Photo & Video Lead' },
    { name: 'Memories in Motion', phone: '0919-333-7777', email: 'motion@memories.ph', hires: 123, rate: 18000, role: 'Photo & Video Lead' },
    { name: 'Eternal Visuals', phone: '0920-222-6666', email: 'eternal@visuals.ph', hires: 98, rate: 16000, role: 'Photo & Video Lead' },
    { name: 'Pixel Perfect Crew', phone: '0921-111-5555', email: 'pixel@perfect.ph', hires: 76, rate: 14000, role: 'Photo & Video Lead' }
  ],
  'Same-Day Edit Video': [
    { name: 'SDE Master J', phone: '0917-111-2222', email: 'j.sde@master.ph', hires: 145, rate: 8000, role: 'Photo & Video Lead' },
    { name: 'QuickCut Studios', phone: '0918-222-3333', email: 'quick@cut.ph', hires: 123, rate: 7000, role: 'Photo & Video Lead' },
    { name: 'LiveStream Pros', phone: '0919-333-4444', email: 'live@pros.ph', hires: 98, rate: 6000, role: 'Photo & Video Lead' },
    { name: 'Instant Highlight Co.', phone: '0920-444-5555', email: 'instant@highlights.ph', hires: 76, rate: 5000, role: 'Photo & Video Lead' },
    { name: 'Rapid Reel Media', phone: '0921-555-6666', email: 'rapid@reel.ph', hires: 54, rate: 4000, role: 'Photo & Video Lead' }
  ]
};

let activeFollowupRoleId = null;

async function renderPersonnelTab() {
  const container = document.getElementById('resd-personnel-container');
  if (!container) return;

  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  if (!res) {
    container.innerHTML = '<div style="text-align:center; padding:100px 20px; color:var(--text-dim); grid-column: 1 / -1;">' +
      '<div style="font-size:40px; margin-bottom:20px;"></div>' +
      '<div style="font-size:16px; font-weight:600; color:var(--cream);">No Reservation Selected</div>' +
      '<div style="font-size:13px; margin-top:5px;">Hiring management is available once a reservation is selected.</div></div>';
    return;
  }

  const packageItems = (res.packageItems || []).map(name => CAT.find(c => c.name === name)).filter(i => i && (i.cat === "entertainment" || i.cat === "photography"));

  if (packageItems.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:100px 20px; color:var(--text-dim); grid-column: 1 / -1;">' +
      '<div style="font-size:40px; margin-bottom:20px;"></div>' +
      '<div style="font-size:16px; font-weight:600; color:var(--cream);">No Talent/Personnel Roles</div>' +
      '<div style="font-size:13px; margin-top:5px;">This package does not include any entertainment or photography items.</div></div>';
    updatePersonnelNotif();
    return;
  }

  const hiredData = res.hiredPersonnel || {};

  // --- ANALYTICS CALCULATION ---
  let totalCost = 0;
  packageItems.forEach(item => {
    const hired = hiredData[item.id];
    if (hired) {
        const pool = PERSONNEL_POOL[item.name] || [];
        const person = pool[hired.index];
        if (person) totalCost += (person.rate || 0);
    }
  });

  let timeRangeStr = "Not defined";
  let totalHours = 0;
  if (res.executionPlan && res.executionPlan.phases && res.executionPlan.phases.length > 0) {
    const phases = res.executionPlan.phases;
    const startStr = phases[0].start;
    const endStr = phases[phases.length - 1].end;
    
    // Helper to format HH:mm strings
    const formatTimePart = (t) => {
        if (!t || !t.includes(':')) return '00:00';
        let [h, m] = t.split(':');
        const hh = parseInt(h);
        const ampm = hh >= 12 ? 'PM' : 'AM';
        const h12 = hh % 12 || 12;
        return `${h12}:${m} ${ampm}`;
    };

    timeRangeStr = `${formatTimePart(startStr)} - ${formatTimePart(endStr)}`;
    
    // Calculate total hours from HH:mm strings
    const toMins = (t) => {
        let [h, m] = t.split(':');
        return (parseInt(h) * 60) + parseInt(m);
    };
    const startMins = toMins(startStr);
    const endMins = toMins(endStr);
    let diff = endMins - startMins;
    if (diff < 0) diff += 1440; // Next day
    totalHours = diff / 60;
  }

  const analyticsHtml = `
    <div class="talent-analytics-banner" style="grid-column: 1 / -1;">
        <div class="t-stat-block">
            <div class="t-stat-lbl">Total Personnel Cost</div>
            <div class="t-stat-val">₱${totalCost.toLocaleString()}</div>
        </div>
        <div class="t-stat-block">
            <div class="t-stat-lbl">Deployment Window</div>
            <div class="t-stat-val">${timeRangeStr}</div>
        </div>
        <div class="t-stat-block">
            <div class="t-stat-lbl">Total Work Hours</div>
            <div class="t-stat-val">${totalHours.toFixed(1)} Hours</div>
        </div>
    </div>
  `;

  container.innerHTML = analyticsHtml + packageItems.map(item => {
    const pool = PERSONNEL_POOL[item.name] || [];
    const sortedPool = [...pool].sort((a, b) => b.hires - a.hires);
    
    const hired = hiredData[item.id];
    let selectedIdx = hired ? hired.index : -1;
    let followUpDone = hired ? hired.followedUp : false;

    const optionsHtml = sortedPool.map((p, idx) => {
        const originalIdx = pool.indexOf(p);
        return `<option value="${originalIdx}" ${originalIdx === selectedIdx ? "selected" : ""}>${p.name} (${p.hires} hires)</option>`;
    }).join("");

    let contactHtml = "";
    if (selectedIdx !== -1) {
        const person = pool[selectedIdx];
        contactHtml = `
            <div class="talent-contact-box">
                <div class="talent-contact-line"><span></span> <strong>${person.phone}</strong></div>
                <div class="talent-contact-line"><span></span> <strong>${person.email}</strong></div>
                <div class="talent-contact-line" style="margin-top:4px; font-size:11px; opacity:0.7;">Rate: ₱${person.rate.toLocaleString()}</div>
            </div>`;
    } else {
        contactHtml = `<div class="talent-contact-box" style="display:flex; align-items:center; justify-content:center; min-height:80px; opacity:0.5; border-style:dashed;">
            <div style="font-size:12px; font-style:italic;">Assign staff to view contact info</div>
        </div>`;
    }

    return `
      <div class="talent-card">
        <div class="talent-role-tag">${item.cat}</div>
        <div class="talent-name-hdr">${item.name}</div>
        
        ${selectedIdx !== -1 && !followUpDone ? '<div class="talent-badge" title="Follow up required">!</div>' : ""}
        
        <div class="talent-select-wrap">
            <label style="font-size:11px; color:var(--text-dim); text-transform:uppercase; letter-spacing:1px; font-weight:700;">Hiring Selection</label>
            <select class="input-field" onchange="hirePerson('${item.id}', this.value)" style="margin-top:8px;">
                <option value="-1">Select person to hire...</option>
                ${optionsHtml}
            </select>
        </div>

        ${contactHtml}

        <div style="margin-top:10px;">
            ${selectedIdx === -1 ? 
                '<button class="btn-primary" style="width:100%; justify-content:center; opacity:0.4; pointer-events:none; filter:grayscale(1);">Pending Selection</button>' : 
                `<button class="btn-primary" style="width:100%; justify-content:center; background:${followUpDone ? "var(--green)" : "var(--gold)"}; color:${followUpDone ? "#fff" : "#000"}; box-shadow:0 4px 15px ${followUpDone ? "rgba(45,138,78,0.2)" : "rgba(196,154,60,0.2)"};" onclick="openFollowupModal('${item.id}')">
                    ${followUpDone ? '✓ Follow-up Complete' : ' Contact & Follow Up'}
                </button>`}
        </div>
      </div>`;
  }).join("");

  updatePersonnelNotif();
}

window.renderPersonnelTab = renderPersonnelTab;

async function hirePerson(roleId, personIndex) {
    const res = RESERVATIONS.find(r => r.id === activeResDetailId);
    if (!res) return;

    if (!res.hiredPersonnel) res.hiredPersonnel = {};
    
    const idx = parseInt(personIndex);
    const item = CAT.find(i => i.id === roleId);
    const pool = PERSONNEL_POOL[item.name] || [];
    const person = pool[idx];

    if (idx === -1) {
        delete res.hiredPersonnel[roleId];
    } else {
        res.hiredPersonnel[roleId] = {
            index: idx,
            followedUp: false,
            hiredAt: new Date().toISOString()
        };
    }

    // Sync with Procurement Hub
    const procData = res.procurementData || {};
    if (!procData.assignments) procData.assignments = {};
    procData.assignments[roleId] = person ? person.email : "";

    try {
        const { updateDoc, doc } = window.firebaseFns;
        await updateDoc(doc(window.firebaseDB, "reservations", res.id), {
            hiredPersonnel: res.hiredPersonnel,
            procurementData: procData
        });
    } catch (e) { console.error("Failed to save hiring data:", e); }

    renderPersonnelTab();
    if (resDetailsActiveTab === 'procurement') renderProcurementTab();
}

window.hirePerson = hirePerson;

function openFollowupModal(roleId) {
    const res = RESERVATIONS.find(r => r.id === activeResDetailId);
    if (!res || !res.hiredPersonnel || !res.hiredPersonnel[roleId]) return;

    activeFollowupRoleId = roleId;
    const item = CAT.find(i => i.id === roleId);
    const hired = res.hiredPersonnel[roleId];
    const pool = PERSONNEL_POOL[item.name];
    const person = pool[hired.index];

    document.getElementById("followup-msg").innerHTML = 'Please contact <strong>' + person.name + '</strong> to confirm their availability for the <strong>' + item.name + '</strong> role on <strong>' + res.date + '</strong>.';
    document.getElementById("followup-contact-info").innerHTML = 'Name: ' + person.name + '<br/>Phone: ' + person.phone + '<br/>Email: ' + person.email;

    document.getElementById("followup-overlay").classList.add("on");
    document.getElementById("followup-modal").classList.add("open");
}

window.openFollowupModal = openFollowupModal;

function closeFollowupModal() {
    document.getElementById("followup-overlay").classList.remove("on");
    document.getElementById("followup-modal").classList.remove("open");
    activeFollowupRoleId = null;
}

window.closeFollowupModal = closeFollowupModal;

async function markFollowupDone() {
    if (!activeFollowupRoleId) return;
    const res = RESERVATIONS.find(r => r.id === activeResDetailId);
    if (!res || !res.hiredPersonnel || !res.hiredPersonnel[activeFollowupRoleId]) return;

    res.hiredPersonnel[activeFollowupRoleId].followedUp = true;
    res.hiredPersonnel[activeFollowupRoleId].followedUpAt = new Date().toISOString();

    try {
        const { updateDoc, doc } = window.firebaseFns;
        await updateDoc(doc(window.firebaseDB, "reservations", res.id), {
            hiredPersonnel: res.hiredPersonnel
        });
    } catch (e) { console.error("Failed to save follow-up data:", e); }

    closeFollowupModal();
    renderPersonnelTab();
}

window.markFollowupDone = markFollowupDone;

function updatePersonnelNotif() {
    const res = RESERVATIONS.find(r => r.id === activeResDetailId);
    const notif = document.getElementById("resd-personnel-notif");
    if (!notif) return;

    if (!res || !res.hiredPersonnel) {
        notif.style.display = "none";
        return;
    }

    const needsFollowup = Object.values(res.hiredPersonnel).some(h => !h.followedUp);
    notif.style.display = needsFollowup ? "inline" : "none";
}
window.updatePersonnelNotif = updatePersonnelNotif;

async function renderMtModeRundownPanel(res) {
    const container = document.getElementById('mt-rundown-sections-container');
    if (!container) return;

    const approvals = activeMeeting.rundownApprovals || {};
    let html = '';

    // Fetch dependencies if not in cache
    const { collection: coll, query: qry, where: whr, getDocs: gds, orderBy: ord, limit: lim } = window.firebaseFns;
    




    // 2. Designs
    html += `
        <div class="panel" style="background:rgba(255,255,255,0.02); padding:25px; border:1px solid var(--border); border-radius:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h3 style="color:var(--gold); font-size:14px; margin:0; text-transform:uppercase;">2. Decoration & Design Rundown</h3>
                <button class="btn-primary" 
                        onclick="approveRundownSection('design')" 
                        style="font-size:11px; padding:6px 15px; background:${approvals.design ? 'var(--green)' : 'var(--blue)'};">
                    ${approvals.design ? '✓ Designs Approved' : 'Approve Design Selections'}
                </button>
            </div>
            <div id="rundown-design-items" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap:15px;">
               <div style="color:var(--text-dim); font-size:12px; padding:20px; text-align:center; grid-column:1/-1;">Loading designs...</div>
            </div>
        </div>
    `;

    // 3. Food
    let foodSum = res.foodTaste;
    if (!foodSum) {
        const fq = qry(coll(window.firebaseDB, 'FoodTaste'), whr('reservationId', '==', res.id), ord('createdAt', 'desc'), lim(1));
        const fSnap = await gds(fq);
        if (!fSnap.empty) {
            foodSum = fSnap.docs[0].data();
            res.foodTaste = foodSum;
        }
    }

    html += `
        <div class="panel" style="background:rgba(255,255,255,0.02); padding:25px; border:1px solid var(--border); border-radius:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h3 style="color:var(--gold); font-size:14px; margin:0; text-transform:uppercase;">3. Food Tasting & Menu Finalization</h3>
                <button class="btn-primary" 
                        onclick="approveRundownSection('food')" 
                        style="font-size:11px; padding:6px 15px; background:${approvals.food ? 'var(--green)' : 'var(--blue)'};">
                    ${approvals.food ? '✓ Menu Approved' : 'Approve Final Menu'}
                </button>
            </div>
            <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:15px;">
                ${(foodSum?.dishes || []).map(f => `
                    <div style="padding:10px; background:rgba(255,255,255,0.03); border-radius:8px; border:1px solid var(--border); font-size:12px;">
                        <div style="font-weight:700; color:var(--cream);">${f.dish}</div>
                        <div style="color:${f.decision === 'approved' ? 'var(--green)' : 'var(--red)'}; font-weight:600; text-transform:uppercase; font-size:10px; margin-top:4px;">${f.decision}</div>
                    </div>
                `).join('') || '<div style="color:var(--text-dim); font-size:12px; grid-column:1/-1; text-align:center;">No food tasting data found.</div>'}
            </div>
        </div>
    `;

    // 4. Personnel
    html += `
        <div class="panel" style="background:rgba(255,255,255,0.02); padding:25px; border:1px solid var(--border); border-radius:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h3 style="color:var(--gold); font-size:14px; margin:0; text-transform:uppercase;">4. Involved Personnel & Talent</h3>
                <button class="btn-primary" 
                        onclick="approveRundownSection('personnel')" 
                        style="font-size:11px; padding:6px 15px; background:${approvals.personnel ? 'var(--green)' : 'var(--blue)'};">
                    ${approvals.personnel ? '✓ Personnel Approved' : 'Approve Hired Talent'}
                </button>
            </div>
            <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:15px;">
                ${Object.entries(res.hiredPersonnel || {}).map(([role, p]) => `
                    <div style="padding:12px; background:rgba(255,255,255,0.03); border-radius:10px; border:1px solid var(--border);">
                        <div style="font-size:10px; color:var(--gold); text-transform:uppercase; font-weight:700;">${role}</div>
                        <div style="font-size:14px; font-weight:600; color:var(--cream); margin-top:4px;">${p.name}</div>
                        <div style="font-size:11px; color:var(--text-dim); margin-top:2px;">${p.email}</div>
                    </div>
                `).join('') || '<div style="color:var(--text-dim); font-size:12px; grid-column:1/-1; text-align:center;">No personnel hired yet.</div>'}
            </div>
        </div>
    `;

    // 5. Execution Timeline
    html += `
        <div class="panel" style="background:rgba(255,255,255,0.02); padding:25px; border:1px solid var(--border); border-radius:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h3 style="color:var(--gold); font-size:14px; margin:0; text-transform:uppercase;">5. Execution Day Timeline Rundown</h3>
                <button class="btn-primary" 
                        onclick="approveRundownSection('timeline')" 
                        style="font-size:11px; padding:6px 15px; background:${approvals.timeline ? 'var(--green)' : 'var(--blue)'};">
                    ${approvals.timeline ? '✓ Timeline Approved' : 'Approve Execution Plan'}
                </button>
            </div>
            <div style="display:flex; flex-direction:column; gap:10px;">
                ${(res.executionPlan?.phases || []).map(p => `
                    <div style="display:flex; gap:15px; font-size:13px; padding:12px; background:rgba(255,255,255,0.02); border-radius:8px;">
                        <div style="width:120px; color:var(--gold); font-weight:700;">${p.start} - ${p.end}</div>
                        <div style="flex:1;">
                            <div style="font-weight:700; color:var(--cream);">${p.name}</div>
                            <div style="color:var(--text-mid); font-size:12px; margin-top:4px;">Activities: ${p.tasks.map(t => t.text).join(', ')}</div>
                        </div>
                    </div>
                `).join('') || '<div style="color:var(--text-dim); font-size:12px; text-align:center; padding:20px;">No execution plan found.</div>'}
            </div>
        </div>
    `;

    container.innerHTML = html;
    fetchRundownDesigns(res.id);
}

async function fetchRundownDesigns(resId) {
    const box = document.getElementById('rundown-design-items');
    if (!box) return;

    try {
        const { collection, query, where, getDocs, orderBy, limit } = window.firebaseFns;
        const q = query(collection(window.firebaseDB, 'designs'), where('reservationId', '==', resId), orderBy('createdAt', 'desc'), limit(1));
        const snap = await getDocs(q);

        if (snap.empty) {
            box.innerHTML = '<div style="color:var(--text-dim); font-size:12px; grid-column:1/-1; text-align:center;">No design records found.</div>';
            return;
        }

        const data = snap.docs[0].data();
        box.innerHTML = (data.items || []).map(item => `
            <div style="border:1px solid var(--border); border-radius:10px; overflow:hidden; background:rgba(255,255,255,0.03);">
                ${item.selectedImg ? `<img src="${item.selectedImg}" style="width:100%; height:120px; object-fit:cover;" />` : '<div style="height:120px; background:var(--bg2); display:flex; align-items:center; justify-content:center; color:var(--text-dim); font-size:10px;">No image</div>'}
                <div style="padding:10px;">
                    <div style="font-weight:700; color:var(--gold); font-size:12px;">${item.itemName}</div>
                    <div style="font-size:11px; color:var(--text-dim); margin-top:4px; font-style:italic;">"${item.note || 'No notes'}"</div>
                </div>
            </div>
        `).join('');
    } catch (e) { console.error(e); box.innerHTML = 'Error loading designs.'; }
}

window.approveRundownSection = async function(section) {
    if (!activeMeeting) return;
    const approvals = activeMeeting.rundownApprovals || {};
    approvals[section] = !approvals[section]; // toggle
    
    try {
        const { updateDoc, doc } = window.firebaseFns;
        await updateDoc(doc(window.firebaseDB, 'meetings', activeMeeting.id), { rundownApprovals: approvals });
        activeMeeting.rundownApprovals = approvals;
        renderMtModeRundownPanel(activeMeetingResCache);
    } catch (e) { console.error("Approval failed:", e); }
}

async function renderFinalRundownTab() {
    const container = document.getElementById('resd-rundown-content');
    if (!container || !activeResDetailId) return;

    const res = RESERVATIONS.find(r => r.id === activeResDetailId);
    if (!res) return;

    if (!res.finalRundown) {
        container.innerHTML = `
            <div style="text-align:center; padding:100px 20px; color:var(--text-dim);">
               <div style="font-size:40px; margin-bottom:15px;"></div>
               <div style="font-size:14px; font-weight:600; color:var(--cream);">No Final Rundown Generated Yet</div>
               <div style="font-size:12px; margin-top:8px; opacity:0.6;">Complete a "Final Program Rundown" meeting to generate this summary.</div>
            </div>
        `;
        return;
    }

    const rundown = res.finalRundown;

    container.innerHTML = `
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px;">
            <!-- Left Side -->
            <div style="display:flex; flex-direction:column; gap:25px;">
                <!-- Venue -->
                <div class="panel" style="background:rgba(255,255,255,0.02); padding:25px; border:1px solid var(--border);">
                    <h3 style="color:var(--gold); font-size:13px; text-transform:uppercase; margin-bottom:15px;">Venue Details</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; font-size:13px; color:var(--text-mid);">
                        <div><strong>Venue:</strong> ${res.venue}</div>
                        <div><strong>Type:</strong> ${rundown.venue?.type || '—'}</div>
                        <div><strong>Decision:</strong> ${rundown.venue?.finalDecision || '—'}</div>
                        <div><strong>Capacity:</strong> ${rundown.venue?.capacity || '—'}</div>
                    </div>
                </div>

                <!-- Food -->
                <div class="panel" style="background:rgba(255,255,255,0.02); padding:25px; border:1px solid var(--border);">
                    <h3 style="color:var(--gold); font-size:13px; text-transform:uppercase; margin-bottom:15px;">Approved Menu</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        ${(rundown.food || []).map(f => `
                            <div style="padding:8px 12px; background:rgba(255,255,255,0.03); border-radius:6px; font-size:12px; color:var(--cream); border:1px solid rgba(255,255,255,0.05);">
                                ${f.dish} <span style="color:var(--green); font-size:10px; margin-left:8px;">✓</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Personnel -->
                <div class="panel" style="background:rgba(255,255,255,0.02); padding:25px; border:1px solid var(--border);">
                    <h3 style="color:var(--gold); font-size:13px; text-transform:uppercase; margin-bottom:15px;">Talent & Personnel</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                        ${Object.entries(rundown.personnel || {}).map(([role, p]) => `
                            <div style="padding:10px; background:rgba(255,255,255,0.03); border-radius:8px; border:1px solid var(--border);">
                                <div style="font-size:10px; color:var(--gold); font-weight:700;">${role}</div>
                                <div style="font-size:13px; font-weight:600; color:var(--cream);">${p.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- Right Side -->
            <div style="display:flex; flex-direction:column; gap:25px;">
                <!-- Timeline -->
                <div class="panel" style="background:rgba(255,255,255,0.02); padding:25px; border:1px solid var(--border);">
                    <h3 style="color:var(--gold); font-size:13px; text-transform:uppercase; margin-bottom:15px;">Program Rundown</h3>
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        ${(rundown.timeline || []).map(p => `
                            <div style="display:flex; gap:12px; font-size:12px; padding:10px; background:rgba(255,255,255,0.01); border-radius:6px;">
                                <div style="width:85px; color:var(--gold); font-weight:700;">${p.start}</div>
                                <div style="flex:1; color:var(--cream); font-weight:600;">${p.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Designs -->
                <div class="panel" style="background:rgba(255,255,255,0.02); padding:25px; border:1px solid var(--border);">
                    <h3 style="color:var(--gold); font-size:13px; text-transform:uppercase; margin-bottom:15px;">Final Design Aesthetic</h3>
                    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap:12px;">
                        ${(rundown.designs || []).map(item => `
                            <div style="border:1px solid var(--border); border-radius:8px; overflow:hidden;">
                                ${item.selectedImg ? `<img src="${item.selectedImg}" style="width:100%; height:100px; object-fit:cover;" />` : '<div style="height:100px; background:var(--bg2);"></div>'}
                                <div style="padding:8px; font-size:11px; font-weight:600; color:var(--cream);">${item.itemName}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

window.renderFinalRundownTab = renderFinalRundownTab;

window.showResdVenueMap = function(name, addr) {
    const container = document.getElementById('resd-venue-map-container');
    if (!container) return;
    container.style.display = 'block';
    initVenueAssessmentMap('resd-venue-map', 'resd-venue-dist', 'resd-venue-etd', addr);
    container.scrollIntoView({ behavior: 'smooth' });
};

async function scheduleNextMeetingInMeetingMode() {
  if (!activeMeeting) return;
  const date = document.getElementById('mt-next-date').value;
  const time = document.getElementById('mt-next-time').value;
  const agendas = [];
  document.querySelectorAll('.mt-next-agenda:checked').forEach(cb => agendas.push(cb.value));

  if (!date || !time || agendas.length === 0) {
    alert("Please provide a date, time, and at least one agenda item for the next meeting.");
    return;
  }

  const btn = event.target;
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scheduling...';
  btn.disabled = true;

  try {
    const { collection, addDoc } = window.firebaseFns;
    const db = window.firebaseDB;

    const res = RESERVATIONS.find(r => r.id === activeMeeting.reservationId);
    
    const mtData = {
      reservationId: activeMeeting.reservationId,
      customerName: res ? res.customerName : 'Client',
      customerEmail: res ? res.customerEmail : '',
      date: date,
      time: time,
      agenda: agendas.join(', '),
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    await addDoc(collection(db, 'meetings'), mtData);
    
    alert("Next meeting scheduled successfully for " + date + " at " + time);
    
    // Clear fields
    document.getElementById('mt-next-date').value = '';
    document.getElementById('mt-next-time').value = '';
    document.querySelectorAll('.mt-next-agenda').forEach(cb => cb.checked = false);

    if (mtCalendar) mtCalendar.refetchEvents();
  } catch (e) {
    console.error("Failed to schedule next meeting:", e);
    alert("Error scheduling meeting: " + e.message);
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

window.scheduleNextMeetingInMeetingMode = scheduleNextMeetingInMeetingMode;
// ==================== PAYMENT ASSESSMENT LOGIC ====================
window.calculatePaymentAssessment = function() {
    const pkgPrice = parseFloat(document.getElementById('pa-package-price').dataset.value || 0);
    // No surcharge yet — will be added when venue surcharge feature is implemented
    const subtotal = pkgPrice;

    const overtimeHrs = parseFloat(document.getElementById('pa-overtime-hrs').value || 0);
    const overtimeTotal = overtimeHrs * 1000;
    document.getElementById('pa-overtime-total').textContent = '₱' + overtimeTotal.toLocaleString();

    const extraPax = parseInt(document.getElementById('pa-extra-pax').value || 0);
    const extraPaxTotal = extraPax * 450;
    document.getElementById('pa-extra-pax-total').textContent = '₱' + extraPaxTotal.toLocaleString();

    const additionalTotal = overtimeTotal + extraPaxTotal;
    const grandTotal = subtotal + additionalTotal;
    
    document.getElementById('pa-additional-charges').textContent = '₱' + additionalTotal.toLocaleString();
    document.getElementById('pa-grand-total').textContent = '₱' + grandTotal.toLocaleString();
    if (document.getElementById('pa-subtotal-2')) document.getElementById('pa-subtotal-2').textContent = '₱' + subtotal.toLocaleString();

    const amountPaid = parseFloat(document.getElementById('pa-amount-paid').dataset.value || 0);
    const balanceDue = Math.max(0, grandTotal - amountPaid);
    document.getElementById('pa-balance-due').textContent = '₱' + balanceDue.toLocaleString();
};

async function renderPaymentAssessmentPanel(res) {
    if (!res) return;

    // Set Agreed Pax
    const agreedPaxEl = document.getElementById('pa-agreed-pax');
    if (agreedPaxEl) agreedPaxEl.textContent = res.pax || 0;

    // Package price — uses res.amount (the actual Firestore field)
    const rawAmt = res.amount || res.totalPrice || 0;
    const pkgPrice = typeof rawAmt === 'string' ? parseFloat(rawAmt.replace(/[^0-9.]/g, '')) || 0 : Number(rawAmt);
    // No surcharge yet
    const subtotal = pkgPrice;

    document.getElementById('pa-package-price').textContent = '₱' + pkgPrice.toLocaleString();
    document.getElementById('pa-package-price').dataset.value = pkgPrice;
    document.getElementById('pa-subtotal').textContent = '₱' + subtotal.toLocaleString();
    if (document.getElementById('pa-subtotal-2')) document.getElementById('pa-subtotal-2').textContent = '₱' + subtotal.toLocaleString();

    // Initial Fee Status
    const initialAmount = res.initialFeeAmount || 0;
    const initialPaid = res.initialFeeStatus === 'paid';
    document.getElementById('pa-initial-amount').textContent = '₱' + initialAmount.toLocaleString();
    document.getElementById('pa-initial-status').textContent = initialPaid ? '✓ Paid' : 'Pending';
    document.getElementById('pa-initial-status').style.color = initialPaid ? 'var(--green)' : 'var(--text-dim)';

    // Downpayment Status
    const dpAmount = res.downpaymentAmount || (subtotal * 0.5);
    const dpPaid = res.paymentStatus === 'paid' || res.downpaymentStatus === 'paid';
    document.getElementById('pa-dp-amount').textContent = '₱' + dpAmount.toLocaleString();
    document.getElementById('pa-dp-status').textContent = dpPaid ? '✓ Paid' : 'Pending';
    document.getElementById('pa-dp-status').style.color = dpPaid ? 'var(--green)' : 'var(--text-dim)';
    document.getElementById('pa-dp-due').textContent = res.downpaymentDueDate ? `Due: ${res.downpaymentDueDate}` : 'Due: —';

    // Final Payment Amount
    const finalAmount = subtotal * 0.5;
    document.getElementById('pa-final-amount').textContent = '₱' + finalAmount.toLocaleString();

    // Amount Paid So Far
    let paidSoFar = 0;
    if (initialPaid) paidSoFar += initialAmount;
    if (dpPaid) paidSoFar += dpAmount;
    if (res.payments) {
        res.payments.forEach(p => { if (p.status === 'paid' && p.type !== 'initial' && p.type !== 'downpayment') paidSoFar += p.amount; });
    }
    document.getElementById('pa-amount-paid').textContent = '₱' + paidSoFar.toLocaleString();
    document.getElementById('pa-amount-paid').dataset.value = paidSoFar;

    // Load saved assessment data into hidden fields + read-only display spans
    const assess = res.paymentAssessment || {};
    const overtimeHrs = assess.overtimeHrs || 0;
    const extraPax = assess.extraPax || 0;
    const notes = assess.notes || '';

    // Hidden fields (used by calculatePaymentAssessment)
    document.getElementById('pa-overtime-hrs').value = overtimeHrs;
    document.getElementById('pa-extra-pax').value = extraPax;
    document.getElementById('pa-assessment-notes').value = notes;

    // Read-only display spans
    const oDisp = document.getElementById('pa-overtime-hrs-display');
    const eDisp = document.getElementById('pa-extra-pax-display');
    const nWrap = document.getElementById('pa-notes-display-wrap');
    const nDisp = document.getElementById('pa-assessment-notes-display');
    if (oDisp) oDisp.textContent = overtimeHrs;
    if (eDisp) eDisp.textContent = extraPax;
    if (nWrap && nDisp) {
        if (notes) { nDisp.textContent = notes; nWrap.style.display = 'block'; }
        else { nWrap.style.display = 'none'; }
    }

    calculatePaymentAssessment();
}

window.savePAassessment = async function() {
    if (!activeMeeting || !activeMeeting.reservationId) return;
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Saving...';
    btn.disabled = true;

    try {
        const overtimeHrs = parseFloat(document.getElementById('pa-overtime-hrs').value || 0);
        const extraPax = parseInt(document.getElementById('pa-extra-pax').value || 0);
        const notes = document.getElementById('pa-assessment-notes').value;

        const assessmentData = {
            overtimeHrs,
            extraPax,
            notes,
            lastUpdated: new Date().toISOString(),
            updatedBy: 'Admin'
        };

        const { doc, updateDoc } = window.firebaseFns;
        await updateDoc(doc(window.firebaseDB, 'reservations', activeMeeting.reservationId), {
            paymentAssessment: assessmentData
        });

        showToast('Payment assessment saved successfully!');
    } catch (e) {
        console.error('Save PA Error:', e);
        showToast('Error saving assessment', 'error');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
};

// ====================================================================
// EXECUTION DAY — PREFLIGHT & LIVE PANEL
// ====================================================================
let activeExecDayResId = null;
let execLiveMap = null;
let execLiveAdminMarker = null;
let execLiveVenueMarker = null;
let execLiveRouteLayer = null;
let execLiveWatchId = null;
let execLivePrevLL = null;
let execLiveLastFetchLL = null;
let execLiveLastUpdate = null;
let execLiveSpeedKmh = 0;
let execLiveLogEntries = [];
let execLiveActivities = [];
let execLiveActivePhaseIdx = 0;
let execPreflightChatUnsub = null;
let execWeatherTimer = null;
let execPreflightResId = null;

// ── Open Pre-Flight Panel ──────────────────────────────────────────
function startExecDay(resId) {
  const res = RESERVATIONS.find(r => r.id === resId);
  if (!res) return;
  execPreflightResId = resId;

  const overlay = document.getElementById('exec-preflight-overlay');
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Set header info
  document.getElementById('exec-pf-title').textContent = (res.client || 'Client') + "'s Event — Pre-Flight";
  document.getElementById('exec-pf-subtitle').textContent =
    (res.type || 'Reservation') + ' · ' + (res.date || '—') + ' · ' + (res.time || '—');

  // Prefill reschedule inputs
  const pfDate = document.getElementById('exec-pf-resched-date');
  const pfTime = document.getElementById('exec-pf-resched-time');
  const pfDp   = document.getElementById('exec-pf-resched-dp');
  const pfReason = document.getElementById('exec-pf-resched-reason');
  if (pfDate) pfDate.value = res.date || '';
  if (pfTime) pfTime.value = res.time || '';
  if (pfDp)   pfDp.value   = res.downpaymentDueDate || '';
  if (pfReason) pfReason.value = '';

  // Load all sections
  renderExecPreflightCustomer(res);
  renderExecPreflightChat(res);
  switchExecReviewTab('details', document.getElementById('exec-rev-tab-details'));
  renderExecReviewDetails(res);
  renderExecPlanPreview(res);

  // Weather — geocode venue then fetch
  fetchExecPreflightWeather(res.venue || '');

  // Scroll top
  overlay.scrollTop = 0;
}

async function saveExecLiveNote() {
  const res = RESERVATIONS.find(r => r.id === activeExecDayResId);
  if (!res) return;
  const note = document.getElementById('exec-live-status-note').value.trim();
  try {
    const { doc, updateDoc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'reservations', res.id), { statusNote: note });
    res.statusNote = note;
    showToast('Status note saved.');
  } catch(e) {
    console.error(e);
    alert('Failed to save status note.');
  }
}
window.saveExecLiveNote = saveExecLiveNote;

// ── View Switching & Map Relocation ───────────────────────────────
let currentExecView = 'departure';

function switchExecLiveView(view) {
  currentExecView = view;
  const depView = document.getElementById('exec-live-view-departure');
  const boardView = document.getElementById('exec-live-view-deployment');
  const mapEl = document.getElementById('exec-live-map');
  const res = RESERVATIONS.find(r => r.id === activeExecDayResId);
  
  if (view === 'departure') {
    depView.style.display = 'flex';
    boardView.style.display = 'none';
    depView.style.opacity = 1;
    document.getElementById('exec-live-map-wrapper').insertBefore(mapEl, document.getElementById('exec-live-speed-badge'));
    if (execLiveMap) { setTimeout(() => execLiveMap.invalidateSize(), 100); }
  } else if (view === 'deployment') {
    depView.style.display = 'none';
    boardView.style.display = 'flex';
    boardView.style.opacity = 1;
    document.getElementById('exec-live-minimap-container').appendChild(mapEl);
    if (execLiveMap) { setTimeout(() => execLiveMap.invalidateSize(), 100); }
    if (res) renderExecLiveDeploymentBoard(res);
  }
}
window.switchExecLiveView = switchExecLiveView;

// ── Live Chat Panel ───────────────────────────────────────────────
let execLiveChatOpen = false;
let execLiveChatUnsub = null;

function toggleExecLiveChat() {
  execLiveChatOpen = !execLiveChatOpen;
  const drawer = document.getElementById('exec-live-chat-drawer');
  drawer.style.right = execLiveChatOpen ? '0' : '-420px';
}
window.toggleExecLiveChat = toggleExecLiveChat;

function initExecLiveChat(res) {
  const chatBox = document.getElementById('exec-live-chat-box');
  const nameEl = document.getElementById('exec-live-chat-name');
  if (!chatBox) return;

  const uid = res.uid || res.userId || res.customerId || null;
  nameEl.textContent = res.client || 'Customer';
  if (!uid) {
    chatBox.innerHTML = '<div style="color:var(--text-dim);font-size:12px;text-align:center;padding:20px;">No customer UID linked.</div>';
    return;
  }

  if (execLiveChatUnsub) execLiveChatUnsub();
  chatBox.innerHTML = '<div style="color:var(--text-dim);font-size:12px;text-align:center;padding:20px;">Loading...</div>';

  try {
    const { collection, query, where, orderBy, onSnapshot } = window.firebaseFns;
    const q = query(collection(window.firebaseDB, 'messages'), where('uid', '==', uid), orderBy('timestamp', 'asc'));
    execLiveChatUnsub = onSnapshot(q, snap => {
      chatBox.innerHTML = '';
      if (snap.empty) {
        chatBox.innerHTML = '<div style="color:var(--text-dim);font-size:12px;text-align:center;padding:20px;">No messages yet.</div>';
        return;
      }
      snap.forEach(doc => {
        const msg = doc.data();
        const time = new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
        const isAdmin = msg.sender === 'staff' || msg.sender === 'admin';
        const bubble = document.createElement('div');
        bubble.style.cssText = `display:flex;flex-direction:column;align-items:${isAdmin?'flex-end':'flex-start'};gap:2px;`;
        bubble.innerHTML = `
          <div style="max-width:85%;padding:10px 14px;border-radius:${isAdmin?'12px 12px 2px 12px':'12px 12px 12px 2px'};background:${isAdmin?'var(--gold)':'var(--bg)'};color:${isAdmin?'#000':'var(--cream)'};font-size:12px;line-height:1.4;box-shadow:0 2px 5px rgba(0,0,0,0.2);">${escHtml(msg.text)}</div>
          <div style="font-size:9px;color:var(--text-dim);">${time}</div>`;
        chatBox.appendChild(bubble);
      });
      chatBox.scrollTop = chatBox.scrollHeight;
    });
    chatBox.dataset.uid = uid;
    chatBox.dataset.name = res.client || 'Customer';
  } catch(e) { chatBox.innerHTML = '<div style="color:var(--red);font-size:12px;padding:10px;">Chat unavailable.</div>'; }
}

async function sendExecLiveChat() {
  const input = document.getElementById('exec-live-chat-input');
  const chatBox = document.getElementById('exec-live-chat-box');
  if (!input || !chatBox) return;
  const text = input.value.trim();
  const uid  = chatBox.dataset.uid;
  const name = chatBox.dataset.name || 'Customer';
  if (!text || !uid) return;
  try {
    const { collection, addDoc } = window.firebaseFns;
    await addDoc(collection(window.firebaseDB, 'messages'), { uid, userName: name, text, sender: 'staff', timestamp: Date.now() });
    input.value = '';
  } catch(e) { console.error('Chat error', e); }
}
window.sendExecLiveChat = sendExecLiveChat;

// ── Deployment Board / Kanban View ────────────────────────────────
function renderExecLiveDeploymentBoard(res) {
  if (!res.executionPlan || !res.executionPlan.phases) return;
  const p = res.executionPlan.phases[execLiveActivePhaseIdx];
  if (!p) return;
  
  document.getElementById('exec-board-title').textContent = p.name;
    document.getElementById('exec-board-time').textContent = p.start + ' - ' + p.end;
  
  // Update Countdown
  if (typeof startExecLiveCountdownTimer === 'function') startExecLiveCountdownTimer();
  if (typeof renderExecLiveBashoutUI === 'function') renderExecLiveBashoutUI(res);
  if (typeof renderExecLiveRestorageUI === 'function') renderExecLiveRestorageUI(res);
  const extensionContainer = document.getElementById('exec-board-extension-ui');
  if (extensionContainer) {
    if (res.executionPlan.flexibility === 'flexible' && p.id === 'execution') {
       extensionContainer.style.display = 'block';
       extensionContainer.innerHTML = `
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px; background:rgba(196,154,60,0.05); border:1px solid rgba(196,154,60,0.15); border-radius:10px; padding:12px 18px;">
             <div style="font-size:11px; font-weight:800; color:var(--gold); text-transform:uppercase; letter-spacing:1px; margin-right:5px;">Quick Extend Event (${Math.floor((res.executionPlan.totalExtensionsAdded||0)/60)}h ${ (res.executionPlan.totalExtensionsAdded||0)%60 }m added)</div>
             <button onclick="extendCurrentPhase(15)" style="background:rgba(255,255,255,0.05); border:1px solid var(--border); color:var(--cream); padding:5px 12px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer;">+15m</button>
             <button onclick="extendCurrentPhase(30)" style="background:rgba(255,255,255,0.05); border:1px solid var(--border); color:var(--cream); padding:5px 12px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer;">+30m</button>
             <button onclick="extendCurrentPhase(60)" style="background:rgba(255,255,255,0.05); border:1px solid var(--border); color:var(--cream); padding:5px 12px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer;">+1h</button>
          </div>
       `;
    } else {
       extensionContainer.style.display = 'none';
    }
  }

  const tasksGrid = document.getElementById('exec-board-tasks');
  const assignments = (res.staffing && res.staffing.assignments) || [];
  const staffMap = {}; assignments.forEach(a => staffMap[a.staffId] = a.staffName);

  let totalTasks = 0;
  let doneTasks = 0;

  tasksGrid.innerHTML = (p.tasks || []).map((t, tIdx) => {
    totalTasks++;
    const isDone = t.status === 'done';
    if (isDone) doneTasks++;
    
    const staffNames = (t.staffIds||[]).map(id => staffMap[id]||id);
    
    return `<div onclick="toggleExecTaskStatus(${execLiveActivePhaseIdx}, ${tIdx})" style="background:${isDone ? 'rgba(34,197,94,0.05)' : 'var(--bg3)'}; border:1px solid ${isDone ? 'var(--green)' : 'var(--border)'}; border-radius:12px; padding:20px; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 10px rgba(0,0,0,0.2); display:flex; flex-direction:column; justify-content:space-between; position:relative; overflow:hidden;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
      ${isDone ? `<div style="position:absolute;top:-10px;right:-10px;background:var(--green);color:#000;font-size:10px;font-weight:800;padding:12px 20px 6px 12px;transform:rotate(45deg);">DONE</div>` : ''}
      <div>
        <div style="display:flex; align-items:flex-start; gap:12px; margin-bottom:14px;">
          <div style="width:24px; height:24px; border-radius:6px; border:2px solid ${isDone ? 'var(--green)' : 'var(--text-dim)'}; background:${isDone ? 'var(--green)' : 'transparent'}; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all 0.2s;">
            ${isDone ? '<span style="color:#000;font-size:14px;font-weight:800;">✓</span>' : ''}
          </div>
          <div style="font-size:15px; font-weight:700; color:${isDone ? 'var(--text-dim)' : 'var(--cream)'}; text-decoration:${isDone ? 'line-through' : 'none'}; transition:all 0.2s;">${escHtml(t.text)}</div>
        </div>
      </div>
      <div style="display:flex; gap:6px; flex-wrap:wrap; border-top:1px solid rgba(255,255,255,0.05); padding-top:12px;">
        ${staffNames.length ? staffNames.map(n => `<div style="font-size:10px; background:rgba(255,255,255,0.05); color:var(--text-dim); padding:4px 10px; border-radius:12px; border:1px solid var(--border);">${escHtml(n)}</div>`).join('') : '<div style="font-size:10px;color:var(--red);">Unassigned</div>'}
      </div>
    </div>`;
  }).join('');

  // Update Progress
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  document.getElementById('exec-board-progress-text').textContent = pct + '%';
  document.getElementById('exec-board-progress-bar').style.width = pct + '%';
  document.getElementById('exec-board-progress-bar').style.background = pct === 100 ? 'var(--green)' : 'linear-gradient(90deg,var(--gold),#fde047)';

  // Render Execution Agenda if Execution phase
  const agendaContainer = document.getElementById('exec-board-agenda-container');
  const agendaList = document.getElementById('exec-board-agenda-list');
  if (agendaContainer && agendaList) {
    if (p.id === 'execution' && p.agenda && p.agenda.length > 0) {
      agendaContainer.style.display = 'block';
      const typeColors = {
        'Arrival': { bg: 'rgba(34,197,94,0.15)', text: '#4ade80', border: 'rgba(34,197,94,0.3)' },
        'Program': { bg: 'rgba(168,85,247,0.15)', text: '#c084fc', border: 'rgba(168,85,247,0.3)' },
        'Catering': { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
        'Buffer': { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
        'Custom': { bg: 'rgba(255,255,255,0.05)', text: 'var(--text-dim)', border: 'rgba(255,255,255,0.1)' }
      };
      
      agendaList.innerHTML = p.agenda.map((a, i) => {
        const c = typeColors[a.type || 'Custom'] || typeColors['Custom'];
        return `<div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:10px; padding:16px 20px; display:flex; align-items:center; justify-content:space-between; gap:20px; transition:all 0.2s; box-shadow:0 4px 10px rgba(0,0,0,0.1);" onmouseover="this.style.background='rgba(255,255,255,0.04)'" onmouseout="this.style.background='rgba(255,255,255,0.02)'">
          <div style="display:flex; align-items:center; gap:16px;">
            <div style="font-size:14px; font-weight:800; color:var(--gold); font-variant-numeric: tabular-nums;">${a.time || '--:--'}</div>
            <div style="width:2px; height:20px; background:rgba(255,255,255,0.1);"></div>
            <div style="font-size:16px; font-weight:700; color:var(--cream);">${escHtml(a.text || '')}</div>
          </div>
          <div style="font-size:10px; font-weight:800; color:${c.text}; background:${c.bg}; border:1px solid ${c.border}; padding:6px 14px; border-radius:20px; text-transform:uppercase; letter-spacing:1px;">${a.type || 'Custom'}</div>
        </div>`;
      }).join('');
    } else {
      agendaContainer.style.display = 'none';
    }
  }

  // Render Guest Attendance List
  const guestsContainer = document.getElementById('exec-board-guests-container');
  const guestsListEl = document.getElementById('exec-board-guests-list');
  if (guestsContainer && guestsListEl) {
    if (p.id === 'execution' && Array.isArray(res.guestList) && res.guestList.length > 0) {
      guestsContainer.style.display = 'block';
      
      const guests = res.guestList.map(g => {
        if (typeof g === 'string') return { name: g, table: '', note: '' };
        return { name: g.name || '', table: g.table || '', note: g.note || '' };
      });
      
      guestsListEl.innerHTML = guests.map(g => `
        <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:12px; display:flex; align-items:center; justify-content:space-between; gap:10px;">
          <div>
            <div style="font-size:14px; font-weight:700; color:var(--cream);">${escHtml(g.name)}</div>
            ${g.table ? `<div style="font-size:10px; color:var(--text-dim); margin-top:2px;">Table: ${escHtml(g.table)}</div>` : ''}
          </div>
          <div style="display:flex; align-items:center; gap:6px;">
            <div style="width:8px; height:8px; border-radius:50%; background:#4ade80; box-shadow:0 0 8px rgba(74,222,128,0.4);"></div>
            <span style="font-size:10px; font-weight:800; color:#4ade80; text-transform:uppercase; letter-spacing:1px;">Present</span>
          </div>
        </div>
      `).join('');
    } else {
      guestsContainer.style.display = 'none';
    }
  }

  // Show layout if deployment phase
  const layoutContainer = document.getElementById('exec-board-layout-container');
  if (layoutContainer) {
    if (p.id === 'deployment') {
      layoutContainer.style.display = 'block';
      setTimeout(async () => {
        try {
          const { getDoc, doc } = window.firebaseFns;
          const layoutSnap = await getDoc(doc(window.firebaseDB, 'layout', res.id));
          if (layoutSnap.exists()) {
            const layoutData = layoutSnap.data();
            if (layoutData && layoutData.seatingElements) {
               if (window.renderExecReadOnlySeatingCanvas) {
                 window.renderExecReadOnlySeatingCanvas('exec-board-layout-canvas', layoutData.seatingElements);
               }
            }
          } else {
            // Fallback
            const resDoc = await getDoc(doc(window.firebaseDB, 'reservations', res.id));
            if (resDoc.exists() && resDoc.data().seatingLayout) {
               if (window.renderExecReadOnlySeatingCanvas) {
                 window.renderExecReadOnlySeatingCanvas('exec-board-layout-canvas', resDoc.data().seatingLayout);
               }
            }
          }
        } catch (e) { console.error('Failed to load layout:', e); }
      }, 50);
    } else {
      layoutContainer.style.display = 'none';
    }
  }

  // Render bottom phases strip
  const colors = {departure:'var(--gold)',deployment:'#5b9bd5',execution:'var(--green)',bashout:'var(--red)',restorage:'#a855f7'};
  document.getElementById('exec-board-phases-timeline').innerHTML = res.executionPlan.phases.map((ph, idx) => {
    const isActive = idx === execLiveActivePhaseIdx;
    const accent = colors[ph.id] || 'var(--gold)';
    return `<div onclick="selectExecLivePhase(${idx})" style="min-width:140px; padding:12px 16px; border-radius:10px; background:${isActive?'var(--bg3)':'transparent'}; border:1px solid ${isActive?accent:'var(--border)'}; cursor:pointer; opacity:${isActive?1:0.6}; transition:all 0.2s;">
      <div style="font-size:10px;font-weight:800;color:${isActive?accent:'var(--cream)'};text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">${escHtml(ph.name)}</div>
      <div style="font-size:10px;color:var(--text-dim);">${ph.start} - ${ph.end}</div>
    </div>`;
  }).join('');
}

async function toggleExecTaskStatus(pIdx, tIdx) {
  const res = RESERVATIONS.find(r => r.id === activeExecDayResId);
  if (!res || !res.executionPlan) return;
  const t = res.executionPlan.phases[pIdx].tasks[tIdx];
  if (!t) return;
  
  t.status = t.status === 'done' ? 'pending' : 'done';
  renderExecLiveDeploymentBoard(res); // update UI instantly

  // Save to Firebase silently
  try {
    const { doc, updateDoc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'reservations', res.id), { executionPlan: res.executionPlan });
  } catch(e) { console.error("Failed to save task status", e); }
}
window.toggleExecTaskStatus = toggleExecTaskStatus;

// ── Command Log (Deployment View) ─────────────────────────────────
function addExecLiveCommand() {
  const input = document.getElementById('exec-live-command-input');
  if (!input || !input.value.trim()) return;
  const text = input.value.trim();
  const now = new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
  execLiveActivities.unshift({ text, time: now, type: 'command' });
  input.value = '';
  renderExecLiveCommandLog();
  
  // Keep original activity log synced just in case
  renderExecLiveActivityList();
}
window.addExecLiveCommand = addExecLiveCommand;

function renderExecLiveCommandLog() {
  const el = document.getElementById('exec-live-command-log-list');
  if (!el) return;
  if (!execLiveActivities.length) { el.innerHTML = '<div style="color:var(--text-dim);font-size:11px;">No commands logged yet.</div>'; return; }
  el.innerHTML = execLiveActivities.map(a =>
    `<div style="display:flex;gap:12px;align-items:flex-start;padding:12px;background:var(--bg3);border-radius:10px;border-left:2px solid var(--gold);">
      <div style="flex:1;font-size:12px;color:var(--cream);line-height:1.4;">${escHtml(a.text)}</div>
      <div style="font-size:10px;color:var(--text-dim);white-space:nowrap;font-family:monospace;">[${a.time}]</div>
    </div>`
  ).join('');
}

window.startExecDay = startExecDay;

function closeExecPreflight() {
  document.getElementById('exec-preflight-overlay').style.display = 'none';
  document.body.style.overflow = '';
  if (execPreflightChatUnsub) { execPreflightChatUnsub(); execPreflightChatUnsub = null; }
  if (execWeatherTimer) { clearInterval(execWeatherTimer); execWeatherTimer = null; }
}
window.closeExecPreflight = closeExecPreflight;

// ── Customer Contacts ──────────────────────────────────────────────
function renderExecPreflightCustomer(res) {
  const el = document.getElementById('exec-pf-customer-contacts');
  const profileEl = document.getElementById('exec-pf-customer-profile');
  if (!el) return;

  const email = res.customerEmail || res.email || '—';
  const phone = res.phone || res.contactNumber || '—';
  const name  = res.client || '—';

  el.innerHTML = `
    <div style="display:flex;gap:12px;flex-wrap:wrap;">
      <div style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:14px 18px;flex:1;min-width:160px;">
        <div style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Client</div>
        <div style="font-size:15px;font-weight:700;color:var(--cream);">${escHtml(name)}</div>
      </div>
      <div style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:14px 18px;flex:1;min-width:160px;">
        <div style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;"> Email</div>
        <div style="font-size:13px;color:var(--cream);font-weight:600;">${escHtml(email)}</div>
      </div>
      <div style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:14px 18px;flex:1;min-width:160px;">
        <div style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;"> Phone</div>
        <div style="font-size:13px;color:var(--cream);font-weight:600;">${escHtml(phone)}</div>
      </div>
    </div>`;

  if (profileEl) {
    profileEl.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div><div style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:3px;">Full Name</div><div style="font-size:13px;color:var(--cream);font-weight:600;">${escHtml(name)}</div></div>
        <div><div style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:3px;">Email Address</div><div style="font-size:12px;color:var(--cream);">${escHtml(email)}</div></div>
        <div><div style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:3px;">Contact Number</div><div style="font-size:12px;color:var(--cream);">${escHtml(phone)}</div></div>
        <div><div style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:3px;">Event Type</div><div style="font-size:12px;color:var(--cream);">${escHtml(res.type||'—')}</div></div>
        <div><div style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:3px;">Package</div><div style="font-size:12px;color:var(--cream);">${escHtml(res.packageName||res.package||'—')}</div></div>
      </div>`;
  }
}

// ── Pre-Flight Chat ────────────────────────────────────────────────
function renderExecPreflightChat(res) {
  const chatBox = document.getElementById('exec-pf-chat-box');
  if (!chatBox) return;

  const uid = res.uid || res.userId || res.customerId || null;
  if (!uid) {
    chatBox.innerHTML = '<div style="color:var(--text-dim);font-size:12px;text-align:center;padding:20px;">No customer UID linked to this reservation.</div>';
    return;
  }

  if (execPreflightChatUnsub) execPreflightChatUnsub();
  chatBox.innerHTML = '<div style="color:var(--text-dim);font-size:12px;text-align:center;padding:20px;">Loading...</div>';

  try {
    const { collection, query, where, orderBy, onSnapshot } = window.firebaseFns;
    const q = query(
      collection(window.firebaseDB, 'messages'),
      where('uid', '==', uid),
      orderBy('timestamp', 'asc')
    );
    execPreflightChatUnsub = onSnapshot(q, snap => {
      chatBox.innerHTML = '';
      if (snap.empty) {
        chatBox.innerHTML = '<div style="color:var(--text-dim);font-size:12px;text-align:center;padding:20px;">No messages yet.</div>';
        return;
      }
      snap.forEach(doc => {
        const msg = doc.data();
        const time = new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
        const isAdmin = msg.sender === 'staff' || msg.sender === 'admin';
        const bubble = document.createElement('div');
        bubble.style.cssText = `display:flex;flex-direction:column;align-items:${isAdmin?'flex-end':'flex-start'};gap:2px;`;
        bubble.innerHTML = `
          <div style="max-width:80%;padding:8px 12px;border-radius:${isAdmin?'12px 12px 2px 12px':'12px 12px 12px 2px'};background:${isAdmin?'var(--gold)':'var(--bg3)'};color:${isAdmin?'#000':'var(--cream)'};font-size:12px;line-height:1.4;">${escHtml(msg.text)}</div>
          <div style="font-size:9px;color:var(--text-dim);">${time}</div>`;
        chatBox.appendChild(bubble);
      });
      chatBox.scrollTop = chatBox.scrollHeight;
    });
    // Store uid for sending
    chatBox.dataset.uid = uid;
    chatBox.dataset.name = res.client || 'Customer';
  } catch(e) {
    chatBox.innerHTML = '<div style="color:var(--red);font-size:12px;padding:10px;">Chat unavailable.</div>';
  }
}

async function sendExecPreflightChat() {
  const input = document.getElementById('exec-pf-chat-input');
  const chatBox = document.getElementById('exec-pf-chat-box');
  if (!input || !chatBox) return;
  const text = input.value.trim();
  const uid  = chatBox.dataset.uid;
  const name = chatBox.dataset.name || 'Customer';
  if (!text || !uid) return;
  try {
    const { collection, addDoc } = window.firebaseFns;
    await addDoc(collection(window.firebaseDB, 'messages'), {
      uid, userName: name, text, sender: 'staff', timestamp: Date.now()
    });
    input.value = '';
  } catch(e) { console.error('Chat send error', e); }
}
window.sendExecPreflightChat = sendExecPreflightChat;

// ── Weather ────────────────────────────────────────────────────────
async function fetchExecPreflightWeather(venueAddress) {
  const weatherEl = document.getElementById('exec-pf-weather-body');
  const refreshEl = document.getElementById('exec-pf-weather-refresh');
  if (!weatherEl) return;

  weatherEl.innerHTML = '<div style="color:var(--text-dim);font-size:12px;padding:10px;">Locating venue...</div>';

  let coords = null;
  if (venueAddress) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(venueAddress)}&limit=1&countrycodes=ph`;
      const res = await fetch(url, {headers:{'Accept-Language':'en','User-Agent':'SmartServe/1.0'}});
      const data = await res.json();
      if (data && data.length > 0) coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    } catch(e) {}
  }

  if (!coords) {
    weatherEl.innerHTML = '<div style="color:var(--text-dim);font-size:12px;padding:10px;"> Could not locate venue address for weather data.</div>';
    return;
  }

  const doFetch = async () => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Asia%2FManila`;
      const res = await fetch(url);
      const data = await res.json();
      const c = data.current;
      const code = c.weather_code;
      const temp = c.temperature_2m;
      const humidity = c.relative_humidity_2m;
      const wind = c.wind_speed_10m;

      // WMO code → label + emoji + status
      let weatherLabel, weatherEmoji, statusClass, statusLabel;
      if (code === 0) { weatherLabel='Clear Sky'; weatherEmoji='️'; statusClass='green'; statusLabel='Excellent'; }
      else if (code <= 3) { weatherLabel='Partly Cloudy'; weatherEmoji=''; statusClass='gold'; statusLabel='Good'; }
      else if (code <= 48) { weatherLabel='Foggy/Overcast'; weatherEmoji='️'; statusClass='amber'; statusLabel='Caution'; }
      else if (code <= 67) { weatherLabel='Rainy'; weatherEmoji='️'; statusClass='red'; statusLabel='Poor — Rain'; }
      else if (code <= 77) { weatherLabel='Snowing'; weatherEmoji='️'; statusClass='blue'; statusLabel='Snow'; }
      else if (code <= 82) { weatherLabel='Rain Showers'; weatherEmoji='️'; statusClass='red'; statusLabel='Poor — Showers'; }
      else { weatherLabel='Thunderstorm'; weatherEmoji='️'; statusClass='red'; statusLabel='Danger — Storm'; }

      const statusColors = { green:'var(--green)', gold:'var(--gold)', amber:'var(--amber)', red:'var(--red)', blue:'var(--blue)' };
      const color = statusColors[statusClass] || 'var(--text-dim)';

      weatherEl.innerHTML = `
        <div style="display:grid;grid-template-columns:auto 1fr;gap:20px;align-items:center;">
          <div style="font-size:64px;line-height:1;">${weatherEmoji}</div>
          <div>
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
              <div style="font-family:'Arial';font-size:28px;font-weight:600;color:${color};">${temp}°C</div>
              <span style="padding:4px 12px;background:${color}22;color:${color};border-radius:20px;font-size:11px;font-weight:700;">${statusLabel}</span>
            </div>
            <div style="font-size:14px;color:var(--cream);font-weight:600;margin-bottom:10px;">${weatherLabel}</div>
            <div style="display:flex;gap:20px;flex-wrap:wrap;">
              <div><div style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;">Humidity</div><div style="font-size:13px;color:var(--cream);font-weight:600;">${humidity}%</div></div>
              <div><div style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;">Wind Speed</div><div style="font-size:13px;color:var(--cream);font-weight:600;">${wind} km/h</div></div>
              <div><div style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;">Venue Coords</div><div style="font-size:11px;color:var(--text-dim);">${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}</div></div>
            </div>
          </div>
        </div>`;
      if (refreshEl) refreshEl.textContent = 'Updated ' + new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    } catch(e) {
      weatherEl.innerHTML = '<div style="color:var(--text-dim);font-size:12px;padding:10px;"> Weather data unavailable.</div>';
    }
  };

  await doFetch();
  if (execWeatherTimer) clearInterval(execWeatherTimer);
  execWeatherTimer = setInterval(doFetch, 300000); // refresh every 5 min
}

// ── Preflight Reschedule ────────────────────────────────────────────
async function execPreflightReschedule() {
  const res = RESERVATIONS.find(r => r.id === execPreflightResId);
  if (!res) return;

  const newDate = document.getElementById('exec-pf-resched-date').value;
  const newTime = document.getElementById('exec-pf-resched-time').value.trim();
  const newDp   = document.getElementById('exec-pf-resched-dp').value;
  const reason  = document.getElementById('exec-pf-resched-reason').value.trim();

  if (!newDate) return alert('Please enter a new event date.');
  if (!reason)  return alert('Please provide a reason for rescheduling.');
  if (!confirm(`Reschedule to ${newDate}?`)) return;

  try {
    const { doc, updateDoc } = window.firebaseFns;
    const payload = { date: newDate };
    if (newTime) payload.time = newTime;
    if (newDp)   payload.downpaymentDueDate = newDp;
    await updateDoc(doc(window.firebaseDB, 'reservations', res.id), payload);
    Object.assign(res, payload);
    showToast('Reservation rescheduled successfully.');
    closeExecPreflight();
    renderExecutionDayReservations();
  } catch(e) {
    console.error(e);
    alert('Reschedule failed. Check console.');
  }
}
window.execPreflightReschedule = execPreflightReschedule;


// ── Review Tabs ─────────────────────────────────────────────────────
function switchExecReviewTab(tab, btnEl) {
  const tabs = ['details','dishes','equipment','staff','venue','design','personnel'];
  tabs.forEach(t => {
    const el = document.getElementById('exec-pf-review-' + t);
    const btn = document.getElementById('exec-rev-tab-' + t);
    if (el) el.style.display = t === tab ? '' : 'none';
    if (btn) { btn.classList.toggle('active', t === tab); }
  });
  const res = RESERVATIONS.find(r => r.id === execPreflightResId);
  if (!res) return;
  if (tab === 'details')   renderExecReviewDetails(res);
  if (tab === 'dishes')    renderExecReviewDishes(res);
  if (tab === 'equipment') renderExecReviewEquipment(res);
  if (tab === 'staff')     renderExecReviewStaff(res);
  if (tab === 'venue')     renderExecReviewVenue(res);
  if (tab === 'design')    renderExecReviewDesign(res);
  if (tab === 'personnel') renderExecReviewPersonnel(res);
}
window.switchExecReviewTab = switchExecReviewTab;

function execReviewRow(label, value) {
  return `<div style="display:flex;justify-content:space-between;align-items:flex-start;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
    <span style="font-size:11px;color:var(--text-dim);min-width:160px;">${label}</span>
    <span style="font-size:12px;color:var(--cream);font-weight:600;text-align:right;">${value || '—'}</span>
  </div>`;
}

function renderExecReviewDetails(res) {
  const el = document.getElementById('exec-pf-review-details');
  if (!el) return;
  const rawAmt = typeof res.amount === 'string' ? parseFloat(res.amount.replace(/[^0-9.]/g,''))||0 : (res.amount||0);
  el.innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 40px;">
    <div>
      ${execReviewRow('Client Name', escHtml(res.client))}
      ${execReviewRow('Event Type', escHtml(res.type))}
      ${execReviewRow('Event Date', escHtml(res.date))}
      ${execReviewRow('Time Range', escHtml(res.time))}
      ${execReviewRow('Venue', escHtml(res.venue))}
      ${execReviewRow('Package', escHtml(res.packageName || res.package))}
    </div>
    <div>
      ${execReviewRow('Guest Count', (res.pax||'0') + ' pax')}
      ${execReviewRow('VIP Guests', (res.vipCount||'0') + ' pax')}
      ${execReviewRow('Total Amount', rawAmt > 0 ? '₱' + rawAmt.toLocaleString() : '—')}
      ${execReviewRow('Status', '<span class="badge ' + (res.status==='confirmed'?'confirmed':'pending') + '">' + (res.status||'—') + '</span>')}
      ${execReviewRow('Contact Email', escHtml(res.customerEmail||res.email))}
      ${execReviewRow('Contact Phone', escHtml(res.phone||res.contactNumber))}
    </div>
  </div>
  ${res.notes ? `<div style="margin-top:16px;padding:14px;background:var(--bg3);border-radius:8px;border-left:3px solid var(--gold);"><div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;">NOTES</div><div style="font-size:12px;color:var(--cream);line-height:1.6;">${escHtml(res.notes)}</div></div>` : ''}`;
}

function renderExecReviewDishes(res) {
  const el = document.getElementById('exec-pf-review-dishes');
  if (!el) return;
  const tasting = res.foodTasting || res.food || {};
  const dishes = tasting.dishes || tasting || [];
  const arr = Array.isArray(dishes) ? dishes : [];
  if (!arr.length) { el.innerHTML = '<div style="color:var(--text-dim);font-size:12px;padding:20px;text-align:center;">No dish data on file.</div>'; return; }
  el.innerHTML = `<table class="inv-table"><thead><tr><th>Dish</th><th>Category</th><th>Status</th><th>Notes</th></tr></thead><tbody>
    ${arr.map(d => `<tr>
      <td style="font-weight:600;">${escHtml(d.name||d.dish||'—')}</td>
      <td>${escHtml(d.category||'—')}</td>
      <td><span class="badge ${d.decision==='approved'?'confirmed':'pending'}">${escHtml(d.decision||d.status||'pending')}</span></td>
      <td style="color:var(--text-dim);font-size:11px;">${escHtml(d.note||d.notes||'—')}</td>
    </tr>`).join('')}
  </tbody></table>`;
}

function renderExecReviewEquipment(res) {
  const el = document.getElementById('exec-pf-review-equipment');
  if (!el) return;
  const items = res.equipment || res.equipmentList || (res.procurement && res.procurement.equipment) || [];
  const arr = Array.isArray(items) ? items : [];
  if (!arr.length) { el.innerHTML = '<div style="color:var(--text-dim);font-size:12px;padding:20px;text-align:center;">No equipment data on file.</div>'; return; }
  el.innerHTML = `<table class="inv-table"><thead><tr><th>Item</th><th>Qty</th><th>Status</th><th>Notes</th></tr></thead><tbody>
    ${arr.map(e => `<tr>
      <td style="font-weight:600;">${escHtml(e.name||e.item||'—')}</td>
      <td>${e.qty||e.quantity||'—'}</td>
      <td><span class="badge ${e.status==='confirmed'||e.status==='available'?'confirmed':'pending'}">${escHtml(e.status||'—')}</span></td>
      <td style="color:var(--text-dim);font-size:11px;">${escHtml(e.note||e.notes||'—')}</td>
    </tr>`).join('')}
  </tbody></table>`;
}

function renderExecReviewStaff(res) {
  const el = document.getElementById('exec-pf-review-staff');
  if (!el) return;
  const assignments = (res.staffing && res.staffing.assignments) || [];
  if (!assignments.length) { el.innerHTML = '<div style="color:var(--text-dim);font-size:12px;padding:20px;text-align:center;">No staff assigned.</div>'; return; }
  el.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;">
    ${assignments.map(a => `<div style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px 14px;">
      <div style="font-size:12px;font-weight:700;color:var(--cream);">${escHtml(a.staffName||'—')}</div>
      <div style="font-size:10px;color:var(--gold);margin-top:3px;">${escHtml(a.group||a.task||'—')}</div>
    </div>`).join('')}
  </div>`;
}

function renderExecReviewVenue(res) {
  const el = document.getElementById('exec-pf-review-venue');
  if (!el) return;
  el.innerHTML = `<div>
    <div style="margin-bottom:16px;">
      ${execReviewRow('Venue Address', escHtml(res.venue))}
      ${execReviewRow('Venue Type', escHtml(res.venueType||res.venueCategory||'—'))}
      ${execReviewRow('Venue Notes', escHtml(res.venueNotes||'—'))}
    </div>
    ${res.venue ? `<div id="exec-pf-venue-map" style="height:220px;border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-top:12px;background:var(--bg3);display:flex;align-items:center;justify-content:center;"><div style="color:var(--text-dim);font-size:12px;">Loading map...</div></div>` : ''}
  </div>`;
  if (res.venue) {
    setTimeout(() => initExecPreflightVenueMap(res.venue), 300);
  }
}

async function initExecPreflightVenueMap(address) {
  const container = document.getElementById('exec-pf-venue-map');
  if (!container) return;
  try {
    const coords = await geocodeAddress(address);
    if (!coords) throw new Error('no coords');
    const m = L.map('exec-pf-venue-map').setView([coords.lat, coords.lon], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19}).addTo(m);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19, attribution:' OSM'}).addTo(m);
    const vIcon = L.divIcon({html:'<div style="font-size:28px;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.7));"></div>',className:'',iconAnchor:[14,28]});
    L.marker([coords.lat, coords.lon], {icon:vIcon}).addTo(m).bindPopup(address).openPopup();
  } catch(e) {
    container.innerHTML = '<div style="color:var(--text-dim);font-size:12px;text-align:center;padding:20px;">Map unavailable for this address.</div>';
  }
}

function renderExecReviewDesign(res) {
  const el = document.getElementById('exec-pf-review-design');
  if (!el) return;
  const design = res.design || res.decor || res.designDetails || {};
  const items = design.items || design.selectedItems || design.choices || [];
  const arr = Array.isArray(items) ? items : [];
  let html = '';
  if (design.theme || design.colorPalette || design.notes) {
    html += `<div style="margin-bottom:16px;">
      ${design.theme ? execReviewRow('Theme', escHtml(design.theme)) : ''}
      ${design.colorPalette ? execReviewRow('Color Palette', escHtml(design.colorPalette)) : ''}
      ${design.notes ? execReviewRow('Design Notes', escHtml(design.notes)) : ''}
    </div>`;
  }
  if (arr.length) {
    html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;">
      ${arr.map(i => `<div style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px 14px;">
        <div style="font-size:12px;font-weight:600;color:var(--cream);">${escHtml(i.name||i.item||'—')}</div>
        ${i.quantity||i.qty ? `<div style="font-size:10px;color:var(--text-dim);margin-top:3px;">Qty: ${i.quantity||i.qty}</div>` : ''}
      </div>`).join('')}
    </div>`;
  }
  if (!html) html = '<div style="color:var(--text-dim);font-size:12px;padding:20px;text-align:center;">No design data on file.</div>';
  el.innerHTML = html;
}

function renderExecReviewPersonnel(res) {
  const el = document.getElementById('exec-pf-review-personnel');
  if (!el) return;
  const personnel = res.personnel || res.externalPersonnel || [];
  const arr = Array.isArray(personnel) ? personnel : [];
  if (!arr.length) { el.innerHTML = '<div style="color:var(--text-dim);font-size:12px;padding:20px;text-align:center;">No external personnel on file.</div>'; return; }
  el.innerHTML = `<div style="display:flex;flex-direction:column;gap:10px;">
    ${arr.map(p => `<div style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:14px 16px;display:flex;justify-content:space-between;align-items:flex-start;">
      <div>
        <div style="font-size:13px;font-weight:700;color:var(--cream);">${escHtml(p.name||'—')}</div>
        <div style="font-size:11px;color:var(--gold);margin-top:2px;">${escHtml(p.role||p.type||'—')}</div>
        ${p.email ? `<div style="font-size:11px;color:var(--text-dim);margin-top:4px;"> ${escHtml(p.email)}</div>` : ''}
        ${p.phone ? `<div style="font-size:11px;color:var(--text-dim);margin-top:2px;"> ${escHtml(p.phone)}</div>` : ''}
      </div>
      <span class="badge ${p.status==='confirmed'?'confirmed':'pending'}">${escHtml(p.status||'—')}</span>
    </div>`).join('')}
  </div>`;
}

// ── Execution Plan Preview ─────────────────────────────────────────
function renderExecPlanPreview(res) {
  const el = document.getElementById('exec-pf-plan-preview');
  if (!el) return;
  if (!res.executionPlan || !res.executionPlan.phases || !res.executionPlan.phases.length) {
    el.innerHTML = '<div style="color:var(--text-dim);font-size:12px;padding:10px;text-align:center;">No Execution Day Strategy found.<br><span style="font-size:11px;">Go to Reservation Details → Logistics Timeline to create one.</span></div>';
    return;
  }
  const phases = res.executionPlan.phases;
  const assignments = (res.staffing && res.staffing.assignments) || [];
  const staffMap = {};
  assignments.forEach(a => { staffMap[a.staffId] = a.staffName; });
  const colors = {departure:'var(--gold)',deployment:'var(--blue)',execution:'var(--green)',bashout:'var(--red)',restorage:'#a855f7'};

  el.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px;">
      ${phases.map(p => {
        const accent = colors[p.id] || 'var(--gold)';
        const staffInPhase = new Set();
        (p.tasks||[]).forEach(t => (t.staffIds||[]).forEach(id => staffInPhase.add(staffMap[id]||id)));
        return `<div style="background:var(--bg3);border:1px solid var(--border);border-left:4px solid ${accent};border-radius:0 10px 10px 0;padding:14px 18px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <div>
              <div style="font-size:12px;font-weight:800;color:${accent};text-transform:uppercase;letter-spacing:1px;">${escHtml(p.name)}</div>
              <div style="font-size:11px;color:var(--text-dim);margin-top:2px;"> ${p.start} – ${p.end}</div>
            </div>
            <div style="font-size:11px;color:var(--text-dim);">${(p.tasks||[]).length} activities</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;">
            ${(p.tasks||[]).map(t => {
              const staffNames = (t.staffIds||[]).map(id => staffMap[id]||id);
              return `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 10px;background:rgba(255,255,255,0.02);border-radius:6px;">
                <span style="font-size:11px;color:var(--cream);">• ${escHtml(t.text||'—')}</span>
                ${staffNames.length ? `<div style="display:flex;gap:4px;flex-wrap:wrap;">${staffNames.map(n => `<span style="font-size:9px;background:${accent}18;color:${accent};padding:2px 7px;border-radius:10px;">${escHtml(n)}</span>`).join('')}</div>` : ''}
              </div>`;
            }).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

// ── Confirm Preflight → Enter Live Execution ───────────────────────
function confirmPreflightAndBegin() {
  if (!execPreflightResId) return;
  activeExecDayResId = execPreflightResId;
  closeExecPreflight();
  openExecLivePanel(activeExecDayResId);
}
window.confirmPreflightAndBegin = confirmPreflightAndBegin;


// ── Live Execution Panel ───────────────────────────────────────────
function openExecLivePanel(resId) {
  const res = RESERVATIONS.find(r => r.id === resId);
  if (!res) return;
  activeExecDayResId = resId;
  execLiveLogEntries = [];
  execLiveActivities = [];
  execLiveActivePhaseIdx = 0;

  const overlay = document.getElementById('exec-live-overlay');
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  document.getElementById('exec-live-title').textContent = (res.client||'Client') + "'s Event";
  document.getElementById('exec-live-subtitle').textContent = (res.date||'—') + ' · ' + (res.time||'—') + ' · ' + (res.venue||'—');
  
  const noteEl = document.getElementById('exec-live-status-note');
  if (noteEl) noteEl.value = res.statusNote || '';

  // Close chat drawer initially
  execLiveChatOpen = false;
  document.getElementById('exec-live-chat-drawer').style.right = '-420px';
  initExecLiveChat(res);

  switchExecLiveView('departure');

  renderExecLivePhases(res);
  addExecLiveLog('active', 'Execution Day started');

  // Init map with venue
  setTimeout(() => initExecLiveMap(res), 400);
}

function stopExecLive() {
  if (!confirm('End Execution Day session?')) return;
  stopExecLiveTracking();
  document.getElementById('exec-live-overlay').style.display = 'none';
  document.body.style.overflow = '';
  if (execLiveMap) { execLiveMap.remove(); execLiveMap = null; execLiveAdminMarker = null; execLiveVenueMarker = null; execLiveRouteLayer = null; }
}
window.stopExecLive = stopExecLive;

// ── Map Init ──────────────────────────────────────────────────────
async function initExecLiveMap(res) {
  const container = document.getElementById('exec-live-map');
  if (!container) return;
  if (execLiveMap) { execLiveMap.remove(); execLiveMap = null; }

  execLiveMap = L.map('exec-live-map', {zoomControl:true, attributionControl:false}).setView([14.5995, 120.9842], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19}).addTo(execLiveMap);

  // Dark tile filter via CSS (already done in admin.css for leaflet)
  if (res.venue) {
    try {
      const coords = await geocodeAddress(res.venue);
      if (coords) {
        const vIcon = L.divIcon({html:'<div style="font-size:28px;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.8));"></div>',className:'',iconAnchor:[14,28]});
        execLiveVenueMarker = L.marker([coords.lat, coords.lon], {icon:vIcon}).addTo(execLiveMap)
          .bindPopup('<div style="font-size:12px;color:#c9a96e;font-weight:700;"> Venue</div><div style="font-size:11px;">' + (res.venue||'') + '</div>');
        execLiveMap.setView([coords.lat, coords.lon], 14);
        document.getElementById('exec-live-pin-venue').textContent = coords.lat.toFixed(5) + ', ' + coords.lon.toFixed(5);
        execLiveMap._venueLL = [coords.lat, coords.lon];
        addExecLiveLog('done', 'Venue located: ' + (res.venue||'').slice(0,40));
        document.getElementById('exec-live-pins-section').style.display = '';
        document.getElementById('exec-live-log-section').style.display = '';
        
        // Auto-detect admin location and auto-start tracking
        detectExecLiveLocation(true);
      }
    } catch(e) { addExecLiveLog('done', 'Could not geocode venue.'); }
  } else {
    detectExecLiveLocation(true);
  }
}

// ── GPS Detect ────────────────────────────────────────────────────
function detectExecLiveLocation(autoStart = false) {
  const btn = document.getElementById('exec-live-gps-btn');
  const errEl = document.getElementById('exec-live-loc-error');
  const display = document.getElementById('exec-live-loc-display');
  if (!navigator.geolocation) { errEl.textContent = 'Geolocation not supported.'; return; }
  btn.textContent = ''; errEl.textContent = 'Requesting GPS…';
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude, lng = pos.coords.longitude;
    execLiveMap._adminLL = [lat, lng];
    btn.textContent = ''; errEl.textContent = '';
    fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng, {headers:{'Accept-Language':'en','User-Agent':'SmartServe/1.0'}})
      .then(r => r.json()).then(d => { display.value = (d.display_name||'').slice(0,70); })
      .catch(() => { display.value = lat.toFixed(5) + ', ' + lng.toFixed(5); });
    document.getElementById('exec-live-pin-admin').textContent = lat.toFixed(5) + ', ' + lng.toFixed(5);
    document.getElementById('exec-live-track-btn').disabled = false;
    addExecLiveLog('done', 'Admin location detected');
    if (autoStart) {
      setTimeout(() => startExecLiveTracking(), 500);
    }
  }, err => {
    btn.textContent = '';
    errEl.textContent = err.message;
  }, {enableHighAccuracy:true, timeout:12000});
}
window.detectExecLiveLocation = detectExecLiveLocation;

// ── Live Tracking ─────────────────────────────────────────────────
function startExecLiveTracking() {
  if (!execLiveMap) return;
  if (!execLiveMap._adminLL) { alert('Detect your location first.'); return; }
  document.getElementById('exec-live-track-btn').style.display = 'none';
  document.getElementById('exec-live-stop-track-btn').style.display = '';
  document.getElementById('exec-live-eta-section').style.display = '';
  document.getElementById('exec-live-speed-badge').style.display = '';
  document.getElementById('exec-live-map-eta-badge').style.display = '';

  const dotOrb = document.getElementById('exec-live-dot-orb');
  const dotLabel = document.getElementById('exec-live-label');
  if (dotOrb) { dotOrb.style.background = 'var(--green)'; dotOrb.style.animation = 'pulse 1.4s infinite'; }
  if (dotLabel) dotLabel.textContent = 'Live';

  const aIcon = L.divIcon({html:'<div style="font-size:26px;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.8));"></div>',className:'',iconAnchor:[13,26]});
  execLiveAdminMarker = L.marker(execLiveMap._adminLL, {icon:aIcon}).addTo(execLiveMap).bindPopup(' Admin — Live');

  if (execLiveMap._venueLL) {
    fetchExecRoute(execLiveMap._adminLL, execLiveMap._venueLL, route => {
      if (route) {
        drawExecRoute(route.coords);
        updateExecETA(route.distanceM, route.durationS);
        execLiveMap.fitBounds(L.latLngBounds([execLiveMap._adminLL, execLiveMap._venueLL]).pad(0.15));
      }
    });
  }

  execLiveWatchId = navigator.geolocation.watchPosition(
    pos => onExecGPSUpdate(pos),
    err => addExecLiveLog('done', 'GPS: ' + err.message),
    {enableHighAccuracy:true, maximumAge:2000, timeout:15000}
  );
  addExecLiveLog('active', 'Live tracking started');
}
window.startExecLiveTracking = startExecLiveTracking;

function stopExecLiveTracking() {
  if (execLiveWatchId !== null) { navigator.geolocation.clearWatch(execLiveWatchId); execLiveWatchId = null; }
  const dotOrb = document.getElementById('exec-live-dot-orb');
  const dotLabel = document.getElementById('exec-live-label');
  if (dotOrb) { dotOrb.style.background = 'var(--text-dim)'; dotOrb.style.animation = ''; }
  if (dotLabel) dotLabel.textContent = 'Stopped';
  document.getElementById('exec-live-track-btn').style.display = '';
  document.getElementById('exec-live-stop-track-btn').style.display = 'none';
  document.getElementById('exec-live-speed-badge').style.display = 'none';
  addExecLiveLog('done', 'Tracking stopped');
}
window.stopExecLiveTracking = stopExecLiveTracking;

function onExecGPSUpdate(pos) {
  const lat = pos.coords.latitude, lng = pos.coords.longitude;
  const newLL = [lat, lng];
  const now = Date.now();
  const reportedSpd = pos.coords.speed != null && pos.coords.speed >= 0 ? Math.round(pos.coords.speed * 3.6) : null;
  if (execLiveLastUpdate && execLivePrevLL) {
    const dt = now - execLiveLastUpdate;
    const km = execLiveHaversine(execLivePrevLL, newLL);
    const calcSpd = Math.min(km / (dt/3600000), 200);
    execLiveSpeedKmh = reportedSpd !== null ? reportedSpd : Math.round(calcSpd);
  } else if (reportedSpd !== null) execLiveSpeedKmh = reportedSpd;

  const spdEl = document.getElementById('exec-live-speed-val');
  const spdEl2 = document.getElementById('exec-live-speed');
  if (spdEl) spdEl.textContent = execLiveSpeedKmh || 0;
  if (spdEl2) spdEl2.textContent = (execLiveSpeedKmh||0) + ' km/h';

  execLivePrevLL = execLiveMap._adminLL;
  execLiveMap._adminLL = newLL;
  execLiveLastUpdate = now;
  if (execLiveAdminMarker) execLiveAdminMarker.setLatLng(newLL);
  document.getElementById('exec-live-pin-admin').textContent = lat.toFixed(5) + ', ' + lng.toFixed(5);
  document.getElementById('exec-live-loc-display').value = lat.toFixed(5) + ', ' + lng.toFixed(5);

  const venueLL = execLiveMap._venueLL;
  if (!venueLL) return;
  const straightKm = execLiveHaversine(newLL, venueLL);
  const movedEnough = !execLiveLastFetchLL || execLiveHaversine(execLiveLastFetchLL, newLL) >= 0.03;
  if (movedEnough) {
    execLiveLastFetchLL = newLL;
    fetchExecRoute(newLL, venueLL, route => {
      if (route) { drawExecRoute(route.coords); updateExecETA(route.distanceM, route.durationS); }
      else { updateExecETA(straightKm*1000, (straightKm/25)*3600); }
    });
  }
  if (straightKm < 0.15) {
    addExecLiveLog('done', ' Arrived at venue!');
    showExecStatusBanner('ok', '', 'Arrived at Destination', 'Within 150m of venue — auto-detected', '');
    stopExecLiveTracking();
    
    // Auto transition to Deployment Phase View!
    setTimeout(() => {
      alert("Arrived at Venue. Transitioning to Deployment Interface.");
      switchExecLiveView('deployment');
      
      // Auto-switch active phase to deployment if it exists
      const res = RESERVATIONS.find(r => r.id === activeExecDayResId);
      if (res && res.executionPlan && res.executionPlan.phases) {
        const depIdx = res.executionPlan.phases.findIndex(p => p.id === 'deployment');
        if (depIdx !== -1) selectExecLivePhase(depIdx);
      }
    }, 1500);
  }
}

function fetchExecRoute(fromLL, toLL, cb) {
  const url = 'https://router.project-osrm.org/route/v1/driving/' + fromLL[1]+','+fromLL[0]+';'+toLL[1]+','+toLL[0]+'?overview=full&geometries=geojson&steps=false';
  fetch(url).then(r=>r.json()).then(d=>{
    if (!d.routes||!d.routes.length){cb(null);return;}
    const rt = d.routes[0];
    cb({coords:rt.geometry.coordinates.map(c=>[c[1],c[0]]), distanceM:rt.distance, durationS:rt.duration});
  }).catch(()=>cb(null));
}

function drawExecRoute(coords) {
  if (execLiveRouteLayer) execLiveMap.removeLayer(execLiveRouteLayer);
  execLiveRouteLayer = L.polyline(coords, {color:'#3b82f6',weight:5,opacity:0.85}).addTo(execLiveMap);
}

function execLiveHaversine(a, b) {
  const R=6371, dLat=(b[0]-a[0])*Math.PI/180, dLon=(b[1]-a[1])*Math.PI/180;
  const s1=Math.sin(dLat/2),s2=Math.sin(dLon/2);
  return R*2*Math.atan2(Math.sqrt(s1*s1+Math.cos(a[0]*Math.PI/180)*Math.cos(b[0]*Math.PI/180)*s2*s2),Math.sqrt(1-(s1*s1+Math.cos(a[0]*Math.PI/180)*Math.cos(b[0]*Math.PI/180)*s2*s2)));
}

function updateExecETA(distM, durS) {
  const BUFFER = 10;
  const rawMin = durS/60;
  const etaMin = rawMin + BUFFER;
  const display = etaMin < 1 ? '<1' : Math.round(etaMin).toString();
  const arrivalTs = new Date(Date.now() + etaMin*60000);
  const arrStr = arrivalTs.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
  const distKm = (distM||0)/1000;

  document.getElementById('exec-live-eta-min').textContent = display;
  document.getElementById('exec-live-eta-range').textContent = Math.max(1,Math.round(etaMin*0.92))+'–'+Math.round(etaMin*1.15)+' min (incl. +'+BUFFER+' min buffer)';
  document.getElementById('exec-live-eta-dist').textContent = distKm.toFixed(2)+' km';
  document.getElementById('exec-live-eta-time').textContent = arrStr;
  const mapEta = document.getElementById('exec-live-map-eta-val');
  if (mapEta) mapEta.textContent = display;

  // Smart Deficit Check
  const res = RESERVATIONS.find(r => r.id === activeExecDayResId);
  if (res && res.executionPlan && res.executionPlan.phases) {
    const deployPhase = res.executionPlan.phases.find(p => p.id === 'deployment');
    if (deployPhase && deployPhase.start) {
      updateSmartDeficitTracker(res, etaMin, arrivalTs, deployPhase);
    }
  }
}

function updateSmartDeficitTracker(res, etaMin, arrivalTs, deployPhase) {
  const panel = document.getElementById('exec-live-deficit-panel');
  const stats = document.getElementById('exec-deficit-stats');
  const prepWrap = document.getElementById('exec-deficit-prep-tasks');
  const prepList = document.getElementById('exec-deficit-prep-list');
  if (!panel || !stats) return;

  panel.style.display = 'block';

  // Parse deployment start time
  const parts = deployPhase.start.split(':');
  const startMinTotal = parseInt(parts[0]) * 60 + parseInt(parts[1]);
  
  const now = new Date();
  const nowMinTotal = now.getHours() * 60 + now.getMinutes();
  
  const timeRemainingMin = startMinTotal - nowMinTotal;
  const deficitMin = Math.round(etaMin - timeRemainingMin);
  
  const fmtMin = m => m > 60 ? Math.floor(m/60)+'h '+(m%60)+'m' : m+' mins';

  if (deficitMin > 0) {
    // LATE
    panel.style.borderLeft = '4px solid var(--red)';
    stats.innerHTML = `
      <div style="text-align:right;">
        <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;">Time Remaining</div>
        <div style="font-size:14px;color:var(--cream);font-weight:700;">${timeRemainingMin > 0 ? fmtMin(timeRemainingMin) : 'Expired'}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;">Required Travel</div>
        <div style="font-size:14px;color:var(--cream);font-weight:700;">${Math.round(etaMin)} mins</div>
      </div>
      <div style="text-align:right;background:rgba(239,68,68,0.15);padding:8px 12px;border-radius:8px;border:1px solid rgba(239,68,68,0.3);">
        <div style="font-size:10px;color:var(--red);text-transform:uppercase;font-weight:800;">Deficit</div>
        <div style="font-size:18px;color:var(--red);font-weight:800;font-family:'Arial';">${deficitMin} mins</div>
      </div>
    `;
    
    // Emergency Prep Tasks
    prepWrap.style.display = 'block';
    const assignments = (res.staffing && res.staffing.assignments) || [];
    const staffMap = {}; assignments.forEach(a => staffMap[a.staffId] = a.staffName);
    
    prepList.innerHTML = (deployPhase.tasks || []).map(t => {
      const s = (t.staffIds||[]).map(id=>staffMap[id]||id);
      return `<div style="background:rgba(255,255,255,0.03);border:1px solid var(--red);border-radius:8px;padding:10px;display:flex;align-items:flex-start;gap:10px;box-shadow:inset 0 0 10px rgba(239,68,68,0.05);">
        <div style="width:6px;height:6px;background:var(--red);border-radius:50%;margin-top:5px;flex-shrink:0;"></div>
        <div>
          <div style="font-size:12px;color:var(--cream);font-weight:600;margin-bottom:4px;">${escHtml(t.text)}</div>
          ${s.length ? `<div style="display:flex;gap:4px;flex-wrap:wrap;">${s.map(n=>`<span style="font-size:9px;background:rgba(239,68,68,0.15);color:var(--red);padding:2px 6px;border-radius:4px;font-weight:700;">${escHtml(n)}</span>`).join('')}</div>` : ''}
        </div>
      </div>`;
    }).join('');
    
    showExecStatusBanner('late', '', 'Delayed Arrival', `Deployment starts at ${deployPhase.start}`, `-${deficitMin} mins`);
  } else {
    // EARLY / ON TIME
    const extra = Math.abs(deficitMin);
    panel.style.borderLeft = '4px solid var(--green)';
    stats.innerHTML = `
      <div style="text-align:right;">
        <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;">Time Remaining</div>
        <div style="font-size:14px;color:var(--cream);font-weight:700;">${fmtMin(timeRemainingMin)}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;">Required Travel</div>
        <div style="font-size:14px;color:var(--cream);font-weight:700;">${Math.round(etaMin)} mins</div>
      </div>
      <div style="text-align:right;background:rgba(34,197,94,0.15);padding:8px 12px;border-radius:8px;border:1px solid rgba(34,197,94,0.3);">
        <div style="font-size:10px;color:var(--green);text-transform:uppercase;font-weight:800;">Buffer Time</div>
        <div style="font-size:18px;color:var(--green);font-weight:800;font-family:'Arial';">+${extra} mins</div>
      </div>
    `;
    prepWrap.style.display = 'none';
    showExecStatusBanner('ok', '', 'On Schedule', `Arrival well before deployment starts (${deployPhase.start})`, `+${extra} min buffer`);
  }
}

function checkExecDelayStatus(etaMin, arrivalTs, deadlineTime) {
  const parts = deadlineTime.split(':');
  const endMin = parseInt(parts[0])*60 + parseInt(parts[1]);
  const arrMin = arrivalTs.getHours()*60 + arrivalTs.getMinutes();
  const over = arrMin - endMin;
  const margin = endMin - arrMin;
  const arrTimeStr = arrivalTs.toTimeString().slice(0,5);
  const fmt = t => { const p=t.split(':'),h=parseInt(p[0]),m=p[1],ap=h>=12?'PM':'AM'; return (h%12||12)+':'+m+' '+ap; };

  if (over > 0) {
    showExecStatusBanner('late','','Running Late','Projected '+fmt(arrTimeStr)+' — '+Math.round(over)+' min past deadline ('+fmt(deadlineTime)+')','+'+ Math.round(over)+' min late');
  } else if (margin <= 8) {
    showExecStatusBanner('warn','️','Cutting It Close','Arriving ~'+fmt(arrTimeStr)+' — only '+Math.round(margin)+' min before deadline',Math.round(margin)+' min margin');
  } else {
    showExecStatusBanner('ok','','On Time','Projected '+fmt(arrTimeStr)+' — '+Math.round(margin)+' min before deadline ('+fmt(deadlineTime)+')',Math.round(margin)+' min to spare');
  }
}

function showExecStatusBanner(status, icon, title, sub, time) {
  const banner = document.getElementById('exec-live-status-banner');
  if (!banner) return;
  banner.style.display = 'flex';
  const configs = {
    ok:   {bg:'rgba(34,197,94,0.15)',  border:'rgba(34,197,94,0.4)',  color:'var(--green)'},
    warn: {bg:'rgba(212,175,55,0.15)', border:'rgba(212,175,55,0.4)', color:'var(--gold)'},
    late: {bg:'rgba(239,68,68,0.18)',  border:'rgba(239,68,68,0.5)',  color:'var(--red)'}
  };
  const cfg = configs[status] || configs.ok;
  banner.style.background = cfg.bg;
  banner.style.borderColor = cfg.border;
  banner.style.color = cfg.color;
  document.getElementById('exec-live-banner-icon').textContent = icon;
  document.getElementById('exec-live-banner-title').textContent = title;
  document.getElementById('exec-live-banner-sub').textContent = sub;
  document.getElementById('exec-live-banner-time').textContent = time;
}


// ── Phase Timeline ────────────────────────────────────────────────
function renderExecLivePhases(res) {
  const container = document.getElementById('exec-live-phases');
  if (!container) return;
  if (!res.executionPlan || !res.executionPlan.phases || !res.executionPlan.phases.length) {
    container.innerHTML = '<div style="color:var(--text-dim);font-size:12px;padding:10px;">No execution plan found. Create one in Reservation Details → Logistics Timeline.</div>';
    return;
  }
  const colors = {departure:'var(--gold)',deployment:'#5b9bd5',execution:'var(--green)',bashout:'var(--red)',restorage:'#a855f7'};
  const now = new Date();
  const nowMin = now.getHours()*60 + now.getMinutes();

  const toMin = t => { if (!t) return 0; const p=t.split(':'); return parseInt(p[0])*60+parseInt(p[1]); };

  // Auto-detect current phase
  let autoPhaseIdx = 0;
  res.executionPlan.phases.forEach((p, i) => {
    const s = toMin(p.start), e = toMin(p.end);
    if (nowMin >= s && nowMin < e) autoPhaseIdx = i;
  });
  if (execLiveActivePhaseIdx === 0) execLiveActivePhaseIdx = autoPhaseIdx;

  // Update top badge
  const phaseBadge = document.getElementById('exec-live-current-phase-badge');
  const curPhase = res.executionPlan.phases[execLiveActivePhaseIdx];
  if (phaseBadge && curPhase) phaseBadge.textContent = curPhase.name + ' · ' + curPhase.start + ' – ' + curPhase.end;

  container.innerHTML = res.executionPlan.phases.map((p, idx) => {
    const accent = colors[p.id] || 'var(--gold)';
    const isActive = idx === execLiveActivePhaseIdx;
    const sMin = toMin(p.start), eMin = toMin(p.end);
    let phaseStatus = 'upcoming';
    if (nowMin > eMin) phaseStatus = 'done';
    else if (nowMin >= sMin) phaseStatus = 'active';
    const statusDot = phaseStatus === 'done' ? '✓' : phaseStatus === 'active' ? '●' : '○';
    return `<div onclick="selectExecLivePhase(${idx})"
      style="min-width:140px;flex-shrink:0;cursor:pointer;border-radius:12px;padding:12px 14px;
             background:${isActive ? 'rgba(255,255,255,0.06)' : 'var(--bg3)'};
             border:1px solid ${isActive ? accent : 'var(--border)'};
             border-top:3px solid ${accent};
             transition:all 0.2s;">
      <div style="font-size:10px;font-weight:800;color:${isActive?accent:'var(--cream)'};text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px;">${escHtml(p.name)}</div>
      <div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;">${p.start} – ${p.end}</div>
      <div style="font-size:10px;color:${phaseStatus==='active'?accent:phaseStatus==='done'?'var(--green)':'var(--text-dim)'};">${statusDot} ${phaseStatus.charAt(0).toUpperCase()+phaseStatus.slice(1)}</div>
      <div style="font-size:9px;color:var(--text-dim);margin-top:4px;">${(p.tasks||[]).length} activities</div>
    </div>`;
  }).join('');

  renderExecLivePhaseDetail(res);
}

function selectExecLivePhase(idx) {
  execLiveActivePhaseIdx = idx;
  const res = RESERVATIONS.find(r => r.id === activeExecDayResId);
  if (res) renderExecLivePhases(res);
}
window.selectExecLivePhase = selectExecLivePhase;

function renderExecLivePhaseDetail(res) {
  const container = document.getElementById('exec-live-phase-detail');
  if (!container || !res.executionPlan || !res.executionPlan.phases) return;
  const p = res.executionPlan.phases[execLiveActivePhaseIdx];
  if (!p) return;
  const colors = {departure:'var(--gold)',deployment:'#5b9bd5',execution:'var(--green)',bashout:'var(--red)',restorage:'#a855f7'};
  const accent = colors[p.id] || 'var(--gold)';
  const assignments = (res.staffing && res.staffing.assignments) || [];
  const staffMap = {};
  assignments.forEach(a => { staffMap[a.staffId] = a.staffName; });
  if (typeof renderExecLiveBashoutUI === 'function') renderExecLiveBashoutUI(res);
  if (typeof renderExecLiveRestorageUI === 'function') renderExecLiveRestorageUI(res);

  container.innerHTML = `
    <div style="background:var(--bg3);border:1px solid var(--border);border-left:4px solid ${accent};border-radius:0 12px 12px 0;padding:18px 20px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <div>
          <div style="font-size:10px;color:${accent};text-transform:uppercase;font-weight:800;letter-spacing:1px;margin-bottom:3px;">Active Phase</div>
          <div style="font-size:17px;font-weight:800;color:var(--cream);text-transform:uppercase;">${escHtml(p.name)}</div>
          <div style="font-size:11px;color:var(--text-dim);margin-top:2px;"> ${p.start} – ${p.end}</div>
        </div>
        <div style="text-align:right;font-size:11px;color:var(--text-dim);">${(p.tasks||[]).length} activities</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        ${(p.tasks||[]).map((t,tIdx) => {
          const staffNames = (t.staffIds||[]).map(id => staffMap[id]||id);
          return `<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:12px 14px;display:flex;align-items:flex-start;gap:12px;">
            <div style="width:8px;height:8px;border-radius:50%;background:${accent};margin-top:5px;flex-shrink:0;"></div>
            <div style="flex:1;">
              <div style="font-size:12px;font-weight:600;color:var(--cream);margin-bottom:6px;">${escHtml(t.text||'—')}</div>
              ${staffNames.length ? `<div style="display:flex;gap:5px;flex-wrap:wrap;">${staffNames.map(n=>`<span style="font-size:9px;background:${accent}18;color:${accent};padding:2px 8px;border-radius:10px;font-weight:600;">${escHtml(n)}</span>`).join('')}</div>` : '<div style="font-size:10px;color:var(--text-dim);">No staff assigned</div>'}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
    ${p.id === 'execution' && p.agenda && p.agenda.length > 0 ? `
      <div style="margin-top:20px; background:var(--bg3); border:1px solid var(--border); border-radius:12px; padding:18px 20px;">
        <div style="font-size:10px; color:var(--gold); text-transform:uppercase; font-weight:800; letter-spacing:1px; margin-bottom:12px;">Event Program Flow</div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${p.agenda.map(a => {
            const typeColors = {
              'Arrival': { bg: 'rgba(34,197,94,0.15)', text: '#4ade80', border: 'rgba(34,197,94,0.3)' },
              'Program': { bg: 'rgba(168,85,247,0.15)', text: '#c084fc', border: 'rgba(168,85,247,0.3)' },
              'Catering': { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
              'Buffer': { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
              'Custom': { bg: 'rgba(255,255,255,0.05)', text: 'var(--text-dim)', border: 'rgba(255,255,255,0.1)' }
            };
            const c = typeColors[a.type || 'Custom'] || typeColors['Custom'];
            return `
              <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:10px; padding:12px 14px; display:flex; align-items:center; justify-content:space-between;">
                <div style="display:flex; align-items:center; gap:12px;">
                  <div style="font-size:12px; font-weight:800; color:var(--gold);">${a.time || '--:--'}</div>
                  <div style="font-size:13px; font-weight:600; color:var(--cream);">${escHtml(a.text)}</div>
                </div>
                <div style="font-size:8px; font-weight:800; color:${c.text}; background:${c.bg}; border:1px solid ${c.border}; padding:3px 8px; border-radius:10px; text-transform:uppercase;">${a.type}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    ` : ''}
    ${p.id === 'deployment' ? `
      <div style="margin-top:20px; background:var(--bg3); border:1px solid var(--border); border-radius:12px; padding:15px;">
        <div style="font-size:11px; font-weight:800; color:var(--gold); text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">
          Venue Layout Reference
        </div>
        <div style="width:100%; height:400px; background:#fff; border:1px solid var(--border); border-radius:8px; overflow:hidden;">
          <svg id="exec-layout-canvas" width="100%" height="100%" viewBox="0 0 1200 800" style="cursor:grab;"></svg>
        </div>
      </div>
    ` : ''}`;

  if (p.id === 'deployment') {
    setTimeout(async () => {
      try {
        const { getDoc, doc } = window.firebaseFns;
        const layoutSnap = await getDoc(doc(window.firebaseDB, 'layout', res.id));
        if (layoutSnap.exists()) {
          const layoutData = layoutSnap.data();
          if (layoutData && layoutData.seatingElements) {
             if (window.renderExecReadOnlySeatingCanvas) {
               window.renderExecReadOnlySeatingCanvas('exec-layout-canvas', layoutData.seatingElements);
             }
          }
        } else {
          // Fallback to res.seatingLayout
          const resDoc = await getDoc(doc(window.firebaseDB, 'reservations', res.id));
          if (resDoc.exists() && resDoc.data().seatingLayout) {
             if (window.renderExecReadOnlySeatingCanvas) {
               window.renderExecReadOnlySeatingCanvas('exec-layout-canvas', resDoc.data().seatingLayout);
             }
          }
        }
      } catch (e) { console.error('Failed to load layout:', e); }
    }, 50);
  }
}

window.renderExecReadOnlySeatingCanvas = function(canvasId, elements) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  canvas.innerHTML = '';
  const sorted = [...elements].sort((a, b) => {
    if (a.type.includes('table') && b.type === 'chair') return -1;
    if (a.type === 'chair' && b.type.includes('table')) return 1;
    return 0;
  });

  sorted.forEach(el => {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("transform", `translate(${el.x}, ${el.y})`);
    
    if (el.type.includes('table')) {
      const shape = (el.type === 'table-round')
        ? document.createElementNS("http://www.w3.org/2000/svg", "circle")
        : document.createElementNS("http://www.w3.org/2000/svg", "rect");
      if (el.type === 'table-round') { shape.setAttribute("r", "45"); }
      else { shape.setAttribute("width", "130"); shape.setAttribute("height", "80"); shape.setAttribute("x", "-65"); shape.setAttribute("y", "-40"); }
      
      shape.setAttribute("class", `table ${el.isVip ? 'table-vip' : ''}`);
      group.appendChild(shape);
      
      if (el.label) {
        const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
        txt.setAttribute("y", "5"); txt.setAttribute("class", "label");
        txt.textContent = el.label;
        group.appendChild(txt);
      }
    } else {
      const chair = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      chair.setAttribute("r", "16");
      const isLocked = el.parentId !== null;
      chair.setAttribute("class", `chair ${isLocked ? 'chair-locked' : ''} ${el.guest ? 'chair-taken' : ''}`);
      group.appendChild(chair);
      if (el.guest) {
        const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
        txt.setAttribute("y", "5"); txt.setAttribute("class", "label");
        txt.textContent = el.guest.charAt(0).toUpperCase();
        group.appendChild(txt);
      }
    }
    canvas.appendChild(group);
  });

  // Add panning to read-only canvas
  let isPan = false, startX = 0, startY = 0, viewX = 0, viewY = 0, viewW = 1200, viewH = 800;
  canvas.onmousedown = (e) => {
    isPan = true;
    startX = e.clientX; startY = e.clientY;
    canvas.style.cursor = 'grabbing';
  };
  window.addEventListener('mousemove', (e) => {
    if (isPan) {
      const dx = e.clientX - startX; const dy = e.clientY - startY;
      viewX -= dx; viewY -= dy;
      canvas.setAttribute('viewBox', `${viewX} ${viewY} ${viewW} ${viewH}`);
      startX = e.clientX; startY = e.clientY;
    }
  });
  window.addEventListener('mouseup', () => { 
    if (isPan) { isPan = false; canvas.style.cursor = 'grab'; }
  });
};

// ── Activity Log ──────────────────────────────────────────────────
function addExecLiveActivity() {
  const input = document.getElementById('exec-live-activity-input');
  if (!input || !input.value.trim()) return;
  const text = input.value.trim();
  const now = new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
  execLiveActivities.unshift({ text, time: now });
  input.value = '';
  renderExecLiveActivityList();
}
window.addExecLiveActivity = addExecLiveActivity;

function renderExecLiveActivityList() {
  const el = document.getElementById('exec-live-activity-list');
  if (!el) return;
  if (!execLiveActivities.length) { el.innerHTML = '<div style="color:var(--text-dim);font-size:11px;">No activities logged yet.</div>'; return; }
  el.innerHTML = execLiveActivities.map(a =>
    `<div style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
      <div style="width:6px;height:6px;border-radius:50%;background:var(--gold);margin-top:5px;flex-shrink:0;"></div>
      <div style="flex:1;font-size:11px;color:var(--cream);">${escHtml(a.text)}</div>
      <div style="font-size:10px;color:var(--text-dim);white-space:nowrap;">${a.time}</div>
    </div>`
  ).join('');
}

// ── Session Log ───────────────────────────────────────────────────
function addExecLiveLog(dot, text) {
  const now = new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  execLiveLogEntries.unshift({ dot, text, time: now });
  const el = document.getElementById('exec-live-step-log');
  if (!el) return;
  el.innerHTML = execLiveLogEntries.slice(0,10).map((e,i) =>
    `<div style="display:flex;gap:10px;align-items:flex-start;padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:11px;">
      <div style="width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-top:3px;background:${i===0?'var(--gold)':'var(--green)'};${i===0?'animation:pulse 1.4s infinite':''}"></div>
      <div><div style="color:var(--text-dim);">${escHtml(e.text)}</div><div style="font-size:9px;color:var(--text-dim);margin-top:1px;">${e.time}</div></div>
    </div>`
  ).join('');
}

// ── Window expose ─────────────────────────────────────────────────

async function saveExecLiveNote() {
  const res = RESERVATIONS.find(r => r.id === activeExecDayResId);
  if (!res) return;
  const note = document.getElementById('exec-live-status-note').value.trim();
  try {
    const { doc, updateDoc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'reservations', res.id), { statusNote: note });
    res.statusNote = note;
    showToast('Status note saved.');
  } catch(e) {
    console.error(e);
    alert('Failed to save status note.');
  }
}
window.saveExecLiveNote = saveExecLiveNote;



// ── Seating Canvas Box Selection & Bulk Tools ─────────────────────

let seatingClipboard = [];

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('resd-seating-canvas');
  if (canvas) {
    canvas.addEventListener('mousedown', (e) => {
      if (seatingMode !== 'admin' || draggingSeatingEl) return;
      const CTM = canvas.getScreenCTM();
      
      if (e.shiftKey) {
        seatingDragBox = {
          startX: (e.clientX - CTM.e) / CTM.a,
          startY: (e.clientY - CTM.f) / CTM.d,
          currentX: (e.clientX - CTM.e) / CTM.a,
          currentY: (e.clientY - CTM.f) / CTM.d
        };
      } else {
        selectedSeatingIds = [];
        seatingPanState = {
          startX: e.clientX,
          startY: e.clientY,
          startViewX: seatingViewBox.x,
          startViewY: seatingViewBox.y
        };
        canvas.style.cursor = 'grabbing';
      }
      renderSeating();
    });
  }
});

window.addEventListener('mousemove', (e) => {
  if (seatingPanState && seatingMode === 'admin') {
    const dx = e.clientX - seatingPanState.startX;
    const dy = e.clientY - seatingPanState.startY;
    
    // Scale dx/dy by zoom level (1 / seatingZoomLevel)
    seatingViewBox.x = seatingPanState.startViewX - (dx / seatingZoomLevel);
    seatingViewBox.y = seatingPanState.startViewY - (dy / seatingZoomLevel);
    
    const canvas = document.getElementById('resd-seating-canvas') || document.getElementById('seating-canvas');
    if (canvas) {
      canvas.setAttribute('viewBox', `${seatingViewBox.x} ${seatingViewBox.y} ${seatingViewBox.w} ${seatingViewBox.h}`);
    }
  } else if (seatingDragBox && seatingMode === 'admin') {
    const canvas = getSeatingDomRefs().canvas;
    if (!canvas) return;
    const CTM = canvas.getScreenCTM();
    seatingDragBox.currentX = (e.clientX - CTM.e) / CTM.a;
    seatingDragBox.currentY = (e.clientY - CTM.f) / CTM.d;
    renderSeating();
  }
});

window.addEventListener('mouseup', (e) => {
  if (seatingPanState) {
    seatingPanState = null;
    const canvas = document.getElementById('resd-seating-canvas') || document.getElementById('seating-canvas');
    if (canvas) canvas.style.cursor = 'default';
  }
  if (seatingDragBox) {
    // Finish drag box
    const x1 = Math.min(seatingDragBox.startX, seatingDragBox.currentX);
    const x2 = Math.max(seatingDragBox.startX, seatingDragBox.currentX);
    const y1 = Math.min(seatingDragBox.startY, seatingDragBox.currentY);
    const y2 = Math.max(seatingDragBox.startY, seatingDragBox.currentY);

    seatingElements.forEach(el => {
      if (el.type.includes('table')) {
        // Table bounds approximation
        if (el.x >= x1 && el.x <= x2 && el.y >= y1 && el.y <= y2) {
          if (!selectedSeatingIds.includes(el.id)) selectedSeatingIds.push(el.id);
        }
      }
    });
    seatingDragBox = null;
    renderSeating();
  }
});

function copySeatingElements() {
  if (!selectedSeatingIds.length) {
    showToast('Select elements to copy first.');
    return;
  }
  // Deep clone selected tables AND their attached chairs
  seatingClipboard = [];
  const selectedTables = seatingElements.filter(el => selectedSeatingIds.includes(el.id));
  
  selectedTables.forEach(t => {
    const cloneTable = JSON.parse(JSON.stringify(t));
    cloneTable._originalId = t.id; // temporary reference mapping
    seatingClipboard.push(cloneTable);
    
    // Grab its chairs
    const childChairs = seatingElements.filter(c => c.parentId === t.id);
    childChairs.forEach(c => {
      const cloneChair = JSON.parse(JSON.stringify(c));
      cloneChair._originalParentId = t.id;
      seatingClipboard.push(cloneChair);
    });
  });
  
  showToast(`Copied ${selectedTables.length} table(s) to clipboard.`);
}

function pasteSeatingElements() {
  saveSeatingHistoryState();
  if (!seatingClipboard.length) {
    showToast('Clipboard is empty.');
    return;
  }
  
  const idMap = {}; // maps old id to new id
  const newSelection = [];
  
  seatingClipboard.forEach(item => {
    const newId = 'el_' + Date.now() + Math.random().toString(36).substring(2);
    const newItem = JSON.parse(JSON.stringify(item));
    newItem.id = newId;
    
    // Offset so they don't overlap perfectly
    newItem.x += 60;
    newItem.y += 60;
    
    if (newItem.type.includes('table')) {
      idMap[newItem._originalId] = newId;
      newSelection.push(newId);
    } else if (newItem.type === 'chair') {
      newItem.parentId = idMap[newItem._originalParentId] || null;
    }
    
    delete newItem._originalId;
    delete newItem._originalParentId;
    
    seatingElements.push(newItem);
  });
  
  selectedSeatingIds = newSelection;
  renderSeating();
  showToast('Pasted elements.');
}

function deleteSelectedSeatingElements() {
  saveSeatingHistoryState();
  if (!selectedSeatingIds.length) return;
  if (!confirm(`Delete ${selectedSeatingIds.length} table(s) and their chairs?`)) return;
  
  seatingElements = seatingElements.filter(el => {
    // Delete if it's a selected table, or if it's a chair belonging to a selected table
    if (selectedSeatingIds.includes(el.id)) return false;
    if (el.parentId && selectedSeatingIds.includes(el.parentId)) return false;
    return true;
  });
  
  selectedSeatingIds = [];
  renderSeating();
}
window.copySeatingElements = copySeatingElements;
window.pasteSeatingElements = pasteSeatingElements;
window.deleteSelectedSeatingElements = deleteSelectedSeatingElements;


// ── Global Seating Keyboard Shortcuts ────────────────────────────────
window.addEventListener('keydown', (e) => {
  const canvas = document.getElementById('resd-seating-canvas') || document.getElementById('seating-canvas');
  if (!canvas || canvas.offsetParent === null) return; // Only active if canvas is visible
  if (seatingMode !== 'admin') return;

  // Don't fire if user is typing in an input field
  if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
    e.preventDefault();
    copySeatingElements();
  }
  else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
    e.preventDefault();
    pasteSeatingElements();
  }
  else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
    e.preventDefault();
    undoSeating();
  }
  else if (e.key === 'Delete' || e.key === 'Backspace') {
    if (selectedSeatingIds.length > 0) {
      e.preventDefault();
      deleteSelectedSeatingElements();
    }
  }
});

// ── Guest List QR Logic ─────────────────────────────────────────────
window.undoSeating = undoSeating;
window.generateGuestAttendanceQR = function() {
  if (!activeResDetailId) return;
  const dummyUrl = "https://smartserve.app/attendance?resId=" + activeResDetailId;
  showQRModal(dummyUrl, "Guest List Attendance Gateway");
};


// ── Venue Layout Zoom Controls ──────────────────────────────────────────
let seatingZoomLevel = 1.0;

function zoomSeating(delta) {
  const oldZoom = seatingZoomLevel;
  seatingZoomLevel += delta;
  if (seatingZoomLevel < 0.3) seatingZoomLevel = 0.3;
  if (seatingZoomLevel > 3.0) seatingZoomLevel = 3.0;
  if (oldZoom === seatingZoomLevel) return;

  const canvas = document.getElementById('resd-seating-canvas') || document.getElementById('seating-canvas');
  if (canvas) {
    const baseW = 1200;
    const baseH = 800;
    const oldW = baseW / oldZoom;
    const oldH = baseH / oldZoom;
    const newW = baseW / seatingZoomLevel;
    const newH = baseH / seatingZoomLevel;
    
    // Adjust x and y so that the center of the screen stays the same
    const centerX = seatingViewBox.x + (oldW / 2);
    const centerY = seatingViewBox.y + (oldH / 2);
    
    seatingViewBox.w = newW;
    seatingViewBox.h = newH;
    seatingViewBox.x = centerX - (newW / 2);
    seatingViewBox.y = centerY - (newH / 2);
    
    canvas.setAttribute('viewBox', `${seatingViewBox.x} ${seatingViewBox.y} ${seatingViewBox.w} ${seatingViewBox.h}`);
    canvas.style.transform = 'none';
  }
}
window.zoomSeating = zoomSeating;

// ── VIP Table Controls ────────────────────────────────────────────────
function toggleVipTables() {
  if (!selectedSeatingIds.length) {
    showToast('Select a table first.');
    return;
  }
  saveSeatingHistoryState();
  selectedSeatingIds.forEach(id => {
    const el = seatingElements.find(e => e.id === id);
    if (el && el.type.includes('table')) {
      el.isVip = !el.isVip;
    }
  });
  renderSeating();
  showToast('Toggled VIP status on selected tables.');
}
window.toggleVipTables = toggleVipTables;

// ── Global Reservation Analytics ──────────────────────────────────────
function updateGlobalResdAnalytics() {
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  const extra = getActiveReservationExtra();
  if (!res || !extra) return;

  const totalPax = res.pax || 0;
  
  // Listed Guests
  const guests = extra.guests || [];
  const listedPax = guests.filter(g => (g.name || '').trim().length > 0).length;
  const targetVipPax = guests.filter(g => g.role === 'VIP' && (g.name || '').trim().length > 0).length;

  // Venue Layout Stats
  let cCount = 0;
  let vipChairCount = 0;
  
  seatingElements.forEach(el => {
    if (el.type === 'chair') {
      cCount++;
      // Check if attached to VIP table
      if (el.parentId) {
        const parent = seatingElements.find(p => p.id === el.parentId);
        if (parent && parent.isVip) {
          vipChairCount++;
        }
      }
    }
  });

  const gaChairs = document.getElementById('resd-ga-chairs');
  const gaPax = document.getElementById('resd-ga-pax');
  const gaVipChairs = document.getElementById('resd-ga-vip-chairs');
  const gaVipPax = document.getElementById('resd-ga-vip-pax');
  const gaListed = document.getElementById('resd-ga-listed');

  if (gaChairs) gaChairs.textContent = cCount;
  if (gaPax) gaPax.textContent = totalPax;
  
  if (gaChairs && cCount < totalPax) gaChairs.style.color = 'var(--red)';
  else if (gaChairs) gaChairs.style.color = 'var(--gold)';

  if (gaVipChairs) gaVipChairs.textContent = vipChairCount;
  if (gaVipPax) gaVipPax.textContent = targetVipPax;

  if (gaVipChairs && vipChairCount < targetVipPax) gaVipChairs.style.color = 'var(--red)';
  else if (gaVipChairs) gaVipChairs.style.color = 'var(--gold)';

  if (gaListed) gaListed.textContent = `${listedPax} / ${totalPax}`;
}
window.updateGlobalResdAnalytics = updateGlobalResdAnalytics;

window.addAgendaToPhase = function(pIdx) {
  const res = RESERVATIONS.find(function(r) { return r.id === activeResDetailId; });
  if (!res || !res.executionPlan || !res.executionPlan.phases) return;
  const p = res.executionPlan.phases[pIdx];
  if (!p.agenda) p.agenda = [];
  p.agenda.push({ text: 'New Agenda Item', time: p.start, type: 'Program' });
  renderExecutionPlannerPhases();
};

window.removeAgendaFromPhase = function(pIdx, aIdx) {
  const res = RESERVATIONS.find(function(r) { return r.id === activeResDetailId; });
  if (!res || !res.executionPlan || !res.executionPlan.phases) return;
  const p = res.executionPlan.phases[pIdx];
  if (p.agenda) p.agenda.splice(aIdx, 1);
  renderExecutionPlannerPhases();
};

window.updateExecAgendaTime = function(pIdx, aIdx, val) {
  const res = RESERVATIONS.find(function(r) { return r.id === activeResDetailId; });
  if (res && res.executionPlan && res.executionPlan.phases[pIdx]) {
    const p = res.executionPlan.phases[pIdx];
    const item = p.agenda && p.agenda[aIdx];
    if (item) {
      if (val < p.start) val = p.start;
      if (val > p.end) val = p.end;
      item.time = val;
      renderExecutionPlannerPhases();
    }
  }
};

window.updateExecAgendaType = function(pIdx, aIdx, val) {
  const res = RESERVATIONS.find(function(r) { return r.id === activeResDetailId; });
  if (res && res.executionPlan && res.executionPlan.phases[pIdx]) {
    const p = res.executionPlan.phases[pIdx];
    if (p.agenda && p.agenda[aIdx]) {
      p.agenda[aIdx].type = val;
      renderExecutionPlannerPhases();
    }
  }
};

window.updateExecAgendaField = function(pIdx, aIdx, val) {
  const res = RESERVATIONS.find(function(r) { return r.id === activeResDetailId; });
  if (res && res.executionPlan && res.executionPlan.phases[pIdx]) {
    const p = res.executionPlan.phases[pIdx];
    if (p.agenda && p.agenda[aIdx]) p.agenda[aIdx].text = val;
  }
};
// ── Execution Agenda in Reservation Details / Meeting Hub ──
window.renderResdAgenda = function(res) {
  const section = document.getElementById('resd-execution-agenda-section');
  const list = document.getElementById('resd-agenda-list');
  if (!section || !list) return;

  if (!res) {
    section.style.display = 'none';
    return;
  }

  // If no execution plan, we can initialize a basic one if the reservation is confirmed
  if (!res.executionPlan || !res.executionPlan.phases) {
    list.innerHTML = `
      <div style="text-align:center; padding:30px; border:1px dashed var(--border); border-radius:12px; background:rgba(255,255,255,0.02);">
        <div style="font-size:13px; color:var(--text-dim); margin-bottom:15px;">No Execution Agenda found. This is likely a new reservation.</div>
        <button class="btn-primary" onclick="initAgendaFromResd('${res.id}')">Initialize Execution Flow</button>
      </div>
    `;
    section.style.display = 'block';
    return;
  }

  const pIdx = res.executionPlan.phases.findIndex(p => p.id === 'execution');
  if (pIdx === -1) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  const p = res.executionPlan.phases[pIdx];
  const agenda = p.agenda || [];

  if (agenda.length === 0) {
    list.innerHTML = '<div style="font-size:12px; color:var(--text-dim); text-align:center; padding:20px; border:1px dashed var(--border); border-radius:10px;">No agenda items yet. Start building the event flow!</div>';
  } else {
    list.innerHTML = agenda.map((a, aIdx) => `
      <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:10px; padding:12px 15px; display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
        <input type="time" value="${a.time || p.start}" min="${p.start}" max="${p.end}" 
               onchange="updateResdAgendaTime(${pIdx}, ${aIdx}, this.value)" 
               style="background:rgba(0,0,0,0.2); border:1px solid var(--border); color:var(--gold); padding:5px 8px; border-radius:6px; font-size:12px; font-weight:700;">
        
        <select onchange="updateResdAgendaType(${pIdx}, ${aIdx}, this.value)" 
                style="background:rgba(0,0,0,0.2); border:1px solid var(--border); color:var(--cream); padding:5px 8px; border-radius:6px; font-size:12px; width:100px;">
          <option value="Arrival" ${a.type==='Arrival'?'selected':''}>Arrival</option>
          <option value="Program" ${a.type==='Program'?'selected':''}>Program</option>
          <option value="Catering" ${a.type==='Catering'?'selected':''}>Catering</option>
          <option value="Buffer" ${a.type==='Buffer'?'selected':''}>Buffer</option>
          <option value="Custom" ${a.type==='Custom'||!a.type?'selected':''}>Custom</option>
        </select>

        <input type="text" value="${escHtml(a.text || '')}" oninput="updateResdAgendaField(${pIdx}, ${aIdx}, this.value)" class="input-field" 
               style="padding:6px; font-size:13px; flex:1; min-width:150px; font-weight:600; background:transparent; border:none; border-bottom:1px solid var(--border); border-radius:0;" placeholder="Event activity...">
        
        <button onclick="removeAgendaFromPhase(${pIdx}, ${aIdx}); renderResdAgenda(RESERVATIONS.find(r=>r.id===activeResDetailId))" style="background:none; border:none; color:var(--red); cursor:pointer; font-size:14px; opacity:0.6;">✕</button>
      </div>
    `).join('');
  }
};

window.addAgendaInResd = function() {
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  if (!res || !res.executionPlan) return;
  const pIdx = res.executionPlan.phases.findIndex(p => p.id === 'execution');
  if (pIdx === -1) return;
  addAgendaToPhase(pIdx);
  renderResdAgenda(res);
};

window.updateResdAgendaTime = function(pIdx, aIdx, val) {
  updateExecAgendaTime(pIdx, aIdx, val);
  renderResdAgenda(RESERVATIONS.find(r => r.id === activeResDetailId));
};

window.updateResdAgendaType = function(pIdx, aIdx, val) {
  updateExecAgendaType(pIdx, aIdx, val);
  renderResdAgenda(RESERVATIONS.find(r => r.id === activeResDetailId));
};

window.saveAgendaInResd = async function() {
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  if (!res) return;
  
  try {
    const { doc, updateDoc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'reservations', res.id), {
      executionPlan: res.executionPlan
    });
    showToast('Execution Agenda saved successfully!');
  } catch (err) {
    console.error(err);
    alert('Failed to save agenda.');
  }
};
window.updateResdAgendaField = function(pIdx, aIdx, val) {
  updateExecAgendaField(pIdx, aIdx, val);
};
window.initAgendaFromResd = function(resId) {
  const res = RESERVATIONS.find(r => r.id === resId);
  if (!res) return;
  
  const tStart = res.timeStart || '08:00';
  const tEnd = res.timeEnd || '12:00';
  
  res.executionPlan = {
    flexibility: 'flexible',
    phases: [
      { id: 'departure', name: 'Departure', start: '05:00', end: '06:00', tasks: [{ text: 'Count equipment', staffIds: [] }] },
      { id: 'deployment', name: 'Deployment', start: '06:00', end: tStart, tasks: [{ text: 'Count equipment', staffIds: [] }, { text: 'Set up venue', staffIds: [] }] },
      { id: 'execution', name: 'Execution', start: tStart, end: tEnd, tasks: [{ text: 'Count equipment', staffIds: [] }, { text: 'Serve guests', staffIds: [] }], agenda: [] },
      { id: 'bashout', name: 'Bashout', start: tEnd, end: '14:00', tasks: [{ text: 'Count equipment', staffIds: [] }, { text: 'Pack equipment', staffIds: [] }] },
      { id: 'restorage', name: 'Restorage', start: '14:00', end: '15:00', tasks: [{ text: 'Count equipment', staffIds: [] }, { text: 'Unload transport', staffIds: [] }] }
    ]
  };
  renderResdAgenda(res);
};
window.addMinutesToTime = function(tStr, mins) {
  let [h, m] = tStr.split(':').map(Number);
  let total = h * 60 + m + mins;
  let nh = Math.floor(total / 60) % 24;
  let nm = total % 60;
  return `${nh.toString().padStart(2, '0')}:${nm.toString().padStart(2, '0')}`;
};

window.getTimeDiffMins = function(t1, t2) {
  let [h1, m1] = t1.split(':').map(Number);
  let [h2, m2] = t2.split(':').map(Number);
  return (h2 * 60 + m2) - (h1 * 60 + m1);
};
window.startExecLiveCountdownTimer = function() {
  if (window.execLiveCountdownInterval) clearInterval(window.execLiveCountdownInterval);
  
  const tick = () => {
    const res = RESERVATIONS.find(r => r.id === activeExecDayResId);
    if (!res || !res.executionPlan || !res.executionPlan.phases) return;
    const p = res.executionPlan.phases[execLiveActivePhaseIdx];
    if (!p) return;
    
    const now = new Date();
    const nowStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const diff = window.getTimeDiffMins(nowStr, p.end);
    
    const countdownEl = document.getElementById('exec-board-countdown');
    const detailCountdownEl = document.getElementById('exec-detail-countdown');
    
    let timeText = '';
    let isRed = diff < 15;
    
    if (diff > 0) {
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      timeText = `${h > 0 ? h + 'h ' : ''}${m}m Remaining`;
    } else {
      timeText = 'OVERTIME';
      isRed = true;
    }

    if (countdownEl) {
      countdownEl.style.display = 'block';
      countdownEl.textContent = timeText;
      if (diff > 0) {
        countdownEl.style.color = isRed ? 'var(--red)' : 'var(--gold)';
        countdownEl.style.background = isRed ? 'rgba(239,68,68,0.1)' : 'rgba(196,154,60,0.1)';
        countdownEl.style.borderColor = isRed ? 'rgba(239,68,68,0.3)' : 'rgba(196,154,60,0.3)';
      } else {
        countdownEl.style.color = '#fff';
        countdownEl.style.background = 'var(--red)';
        countdownEl.style.borderColor = 'var(--red)';
      }
    }
    
    if (detailCountdownEl) {
      detailCountdownEl.style.display = 'inline';
      detailCountdownEl.textContent = '(' + timeText + ')';
      detailCountdownEl.style.color = isRed ? 'var(--red)' : 'var(--gold)';
    }
  };

  tick();
  window.execLiveCountdownInterval = setInterval(tick, 30000);
};

window.extendCurrentPhase = function(mins) {
  const res = RESERVATIONS.find(r => r.id === activeExecDayResId);
  if (!res || !res.executionPlan) return;
  
  if (!res.executionPlan.totalExtensionsAdded) res.executionPlan.totalExtensionsAdded = 0;
  res.executionPlan.totalExtensionsAdded += mins;

  const pIdx = execLiveActivePhaseIdx;
  const p = res.executionPlan.phases[pIdx];
  const newEnd = window.addMinutesToTime(p.end, mins);
  
  const oldId = activeResDetailId;
  activeResDetailId = res.id;
  window.updateExecPhaseField(pIdx, 'end', newEnd);
  activeResDetailId = oldId;

  renderExecLiveDeploymentBoard(res);
  renderExecLivePhases(res);
  showToast(`Event extended by ${mins} minutes. Total extensions: ${res.executionPlan.totalExtensionsAdded}m (${Math.floor(res.executionPlan.totalExtensionsAdded/60)}h total).`);
};
window.updateActualPax = function(resId, val) {
  const res = RESERVATIONS.find(r => r.id === activeExecDayResId);
  if (res && res.executionPlan) {
    res.executionPlan.actualPaxReported = parseInt(val) || 0;
    renderExecLiveBashoutUI(res);
  }
};

window.updateBrokenFee = function(val) {
  const res = RESERVATIONS.find(r => r.id === activeExecDayResId);
  if (res && res.executionPlan) {
    res.executionPlan.brokenEquipFee = parseFloat(val) || 0;
    renderExecLiveBashoutUI(res);
  }
};

window.applyBashoutBilling = async function(resId) {
  const res = RESERVATIONS.find(r => r.id === resId);
  if (!res || !res.executionPlan) return;
  
  const extMins = res.executionPlan.totalExtensionsAdded || 0;
  const extHours = Math.floor(extMins / 60);
  
  const originalPax = parseInt(res.pax) || 0;
  const actualPax = res.executionPlan.actualPaxReported || originalPax;
  const extraPax = Math.max(0, actualPax - originalPax);
  const brokenFee = res.executionPlan.brokenEquipFee || 0;
  
  const assessmentData = {
    overtimeHrs: extHours,
    extraPax: extraPax,
    brokenEquipFee: brokenFee,
    notes: (res.paymentAssessment?.notes || '') + `\nAuto-billed from Bashout phase.`,
    lastUpdated: new Date().toISOString(),
    updatedBy: 'Bashout System'
  };

  try {
    const { doc, updateDoc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'reservations', res.id), {
      paymentAssessment: assessmentData
    });
    showToast('Billing applied. Final amount synced with Payment Assessment.');
  } catch(e) { console.error(e); alert('Failed to sync billing.'); }
};

window.renderExecLiveBashoutUI = function(res) {
  const container = document.getElementById('exec-board-bashout-ui');
  if (!container) return;
  
  const p = res.executionPlan.phases[execLiveActivePhaseIdx];
  if (!p || p.id !== 'bashout') {
    container.style.display = 'none';
    return;
  }
  
  container.style.display = 'block';
  
  const extMins = res.executionPlan.totalExtensionsAdded || 0;
  const extHours = Math.floor(extMins / 60);
  const extFee = extHours * 1000;
  
  const originalPax = parseInt(res.pax) || 0;
  const actualPax = res.executionPlan.actualPaxReported || originalPax;
  const extraPax = Math.max(0, actualPax - originalPax);
  const extraPaxFee = extraPax * 450;
  const brokenFee = res.executionPlan.brokenEquipFee || 0;
  
  const subtotalExtra = extFee + extraPaxFee + brokenFee;
  const rawAmt = res.amount || res.totalPrice || 0;
  const basePrice = typeof rawAmt === 'string' ? parseFloat(rawAmt.replace(/[^0-9.]/g, '')) || 0 : Number(rawAmt);
  const grandTotal = basePrice + subtotalExtra;

  // Calculate Amount Paid So Far
  const initialAmount = res.initialFeeAmount || 0;
  const initialPaid = res.initialFeeStatus === 'paid';
  const dpAmount = res.downpaymentAmount || (basePrice * 0.5);
  const dpPaid = res.paymentStatus === 'paid' || res.downpaymentStatus === 'paid';
  
  let paidSoFar = 0;
  if (initialPaid) paidSoFar += initialAmount;
  if (dpPaid) paidSoFar += dpAmount;
  if (res.payments) {
      res.payments.forEach(py => { if (py.status === 'paid' && py.type !== 'initial' && py.type !== 'downpayment') paidSoFar += py.amount; });
  }

  const balanceDue = Math.max(0, grandTotal - paidSoFar);

  container.innerHTML = `
    <div style="background:rgba(196,154,60,0.05); border:1px solid rgba(212,175,55,0.2); border-radius:15px; padding:25px; display:grid; grid-template-columns:1.4fr 1fr; gap:30px; box-shadow:0 8px 32px rgba(0,0,0,0.2);">
       <div>
          <div style="font-size:12px; color:var(--gold); font-weight:800; text-transform:uppercase; margin-bottom:15px; letter-spacing:1px;">Bashout Phase Billing & Assessment</div>
          <div style="display:flex; flex-direction:column; gap:10px;">
             <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02); padding:10px 15px; border-radius:8px;">
                <div style="font-size:13px; color:var(--text-dim);">Event Overtime Fee (${extHours}h added)</div>
                <div style="font-size:14px; font-weight:700; color:var(--cream);">₱ ${extFee.toLocaleString()}</div>
             </div>
             <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02); padding:10px 15px; border-radius:8px;">
                <div style="font-size:13px; color:var(--text-dim);">
                   Extra Pax Adjustment (${extraPax} extra)
                   <div style="font-size:10px; color:var(--gold); margin-top:2px;">Target: ${originalPax} | Actual: <input type="number" value="${actualPax}" onchange="updateActualPax('${res.id}', this.value)" style="width:50px; background:transparent; border:none; border-bottom:1px solid var(--gold); color:var(--gold); text-align:center; font-weight:700;"></div>
                </div>
                <div style="font-size:14px; font-weight:700; color:var(--cream);">₱ ${extraPaxFee.toLocaleString()}</div>
             </div>
             <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02); padding:10px 15px; border-radius:8px;">
                <div style="font-size:13px; color:var(--text-dim);">Broken/Lost Equipment Claims</div>
                <input type="number" value="${brokenFee}" onchange="updateBrokenFee(this.value)" style="width:100px; background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.1); color:var(--red); padding:6px; border-radius:6px; text-align:right; font-weight:700;">
             </div>
             
             <div style="margin-top:10px; padding:12px 15px; border-top:1px dashed rgba(255,255,255,0.1); display:flex; justify-content:space-between; font-size:12px;">
                <span style="color:var(--text-dim);">Event Grand Total:</span>
                <span style="color:var(--cream);">₱ ${grandTotal.toLocaleString()}</span>
             </div>
             <div style="padding:0 15px; display:flex; justify-content:space-between; font-size:12px;">
                <span style="color:var(--text-dim);">Amount Paid So Far:</span>
                <span style="color:var(--green); font-weight:700;">- ₱ ${paidSoFar.toLocaleString()}</span>
             </div>
          </div>
       </div>

       <div style="border-left:1px solid rgba(255,255,255,0.05); padding-left:30px; display:flex; flex-direction:column; justify-content:center;">
          <div style="font-size:11px; color:var(--gold); text-transform:uppercase; margin-bottom:8px; letter-spacing:1px; font-weight:800;">Remaining Balance Due</div>
          <div style="font-size:42px; font-weight:800; color:var(--gold); font-family:'Arial'; margin-bottom:20px;">₱ ${balanceDue.toLocaleString()}</div>
          
          <div style="display:flex; flex-direction:column; gap:12px;">
             <button onclick="applyBashoutBilling('${res.id}')" class="btn-primary" style="background:var(--green); color:#fff; padding:14px; font-weight:800; letter-spacing:1px; box-shadow:0 4px 15px rgba(34,197,94,0.3);">Sync with Billing Panel</button>
             <button onclick="showSection('payment-hub')" class="btn-primary" style="background:rgba(212,175,55,0.1); border:1px solid var(--gold); color:var(--gold); padding:12px; font-size:12px;">Open Payment Gateway</button>
          </div>
       </div>
    </div>
  `;
};
window.renderExecLiveRestorageUI = function(res) {
  const container = document.getElementById('exec-board-restorage-ui');
  if (!container) return;
  
  const p = res.executionPlan.phases[execLiveActivePhaseIdx];
  if (!p || p.id !== 'restorage') {
    container.style.display = 'none';
    return;
  }
  
  container.style.display = 'block';
  container.innerHTML = `
    <div style="background:rgba(34,197,94,0.05); border:1px solid rgba(34,197,94,0.2); border-radius:15px; padding:30px; display:flex; flex-direction:column; align-items:center; text-align:center; box-shadow:0 8px 32px rgba(0,0,0,0.1);">
       <div style="font-size:40px; margin-bottom:15px;"></div>
       <div style="font-size:18px; font-weight:800; color:var(--cream); margin-bottom:8px;">Final Phase: Restorage & Cleanup</div>
       <div style="font-size:13px; color:var(--text-dim); max-width:450px; margin-bottom:25px;">Ensure all inventory is accounted for and transport is unloaded. Once done, mark the entire reservation as completed.</div>
       
       <button onclick="completeReservationExecution('${res.id}')" class="btn-primary" style="background:var(--green); color:#fff; padding:15px 40px; font-size:14px; font-weight:800; border-radius:12px; box-shadow:0 10px 25px rgba(34,197,94,0.3);">
         Mark Reservation as Completed
       </button>
    </div>
  `;
};

window.completeReservationExecution = async function(resId) {
  const res = RESERVATIONS.find(r => r.id === resId);
  if (!res) return;
  
  try {
    const { doc, updateDoc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'reservations', resId), {
      status: 'completed',
      'executionPlan.completedAt': new Date().toISOString()
    });
    
    // Update local state
    res.status = 'completed';
    if(!res.executionPlan) res.executionPlan = {};
    res.executionPlan.completedAt = new Date().toISOString();

    window.showCompletionSuccessModal(res);

  } catch(e) { console.error(e); alert('Failed to complete reservation.'); }
};



window.showCompletionSuccessModal = function(res) {
  const toast = document.createElement('div');
  toast.style = 'position:fixed;top:24px;left:50%;transform:translateX(-50%);z-index:99999;background:var(--green);color:#fff;padding:14px 32px;border-radius:12px;font-weight:700;font-size:14px;box-shadow:0 8px 32px rgba(0,0,0,0.4);transition:opacity 0.5s;white-space:nowrap;';
  toast.textContent = 'Reservation completed - redirecting to Final Summary...';
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; }, 2200);
  setTimeout(() => {
    toast.remove();
    if (typeof stopExecLive === 'function') stopExecLive();
    activeResDetailId = res.id;
    showSection('res-details', document.getElementById('nav-res-details'));
    renderReservationDetailsHandling();
    setTimeout(() => {
      switchResDetailsTab('summary', document.getElementById('resd-tab-summary'));
    }, 150);
  }, 2600);
};

window.renderReservationSummary = function(res) {
  const container = document.getElementById('resd-summary-content');
  if (!container) return;

  const isCompleted = res.status === 'completed';
  const statusBanner = !isCompleted ? `
    <div style="background:rgba(212,175,55,0.08);border:1px solid rgba(212,175,55,0.3);border-radius:10px;padding:12px 18px;font-size:13px;color:var(--gold);margin-bottom:20px;display:flex;align-items:center;gap:10px;">
      <div style="width:8px;height:8px;border-radius:50%;background:var(--gold);flex-shrink:0;"></div>
      <span>This reservation is not yet completed. Financial figures below are projections based on confirmed booking data.</span>
    </div>` : '';

  const assess    = res.paymentAssessment || {};
  const plan      = res.executionPlan    || {};
  const rawPkg    = res.totalPrice || res.amount || 85000;
  const pkgPrice  = typeof rawPkg === 'string' ? parseFloat(rawPkg.replace(/[^0-9.]/g,'')) || 85000 : Number(rawPkg) || 85000;
  const surcharge = res.logisticsSurcharge || 0;
  const overtimeHrs = assess.overtimeHrs  || 0;
  const extraPax    = assess.extraPax     || 0;
  const brokenFee   = assess.brokenEquipFee || 0;
  const overtimeFee  = overtimeHrs * 1000;
  const extraPaxFee  = extraPax * 450;
  const totalRevenue = pkgPrice + surcharge + overtimeFee + extraPaxFee + brokenFee;
  const costIngredients = Math.round(pkgPrice * 0.38);
  const costEquipment   = Math.round(pkgPrice * 0.12);
  const costPersonnel   = Math.round(pkgPrice * 0.18);
  const costLogistics   = Math.round(pkgPrice * 0.07);
  const costMisc        = Math.round(pkgPrice * 0.04);
  const totalExpenses   = costIngredients + costEquipment + costPersonnel + costLogistics + costMisc;
  const netProfit       = totalRevenue - totalExpenses;
  const profitMargin    = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0.0';
  const totalDamages    = brokenFee;
  const itemsServed     = (res.packageItems || []).length;
  const completedAt     = plan.completedAt ? new Date(plan.completedAt).toLocaleString('en-PH',{dateStyle:'long',timeStyle:'short'}) : (isCompleted ? new Date().toLocaleString() : 'Pending');
  const phases = plan.phases && plan.phases.length ? plan.phases : [
    {name:'Departure',start:'06:00',end:'07:00'},
    {name:'Deployment',start:'07:00',end:'08:00'},
    {name:'Execution',start:res.timeStart||'08:00',end:res.timeEnd||'13:00'},
    {name:'Bashout',start:res.timeEnd||'13:00',end:'15:00'},
    {name:'Restorage',start:'15:00',end:'16:00'}
  ];
  const fmt = n => '&#8369;' + Number(n).toLocaleString();
  const card = (label, value, color, sub='') =>
    `<div style="background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:14px;padding:20px;text-align:center;">
       <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;font-weight:700;">${label}</div>
       <div style="font-size:22px;font-weight:800;color:${color};">${value}</div>
       ${sub ? `<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">${sub}</div>` : ''}
     </div>`;
  const row = (label, amount, color='var(--cream)') =>
    `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:rgba(255,255,255,0.02);border-radius:8px;border:1px solid rgba(255,255,255,0.04);">
       <div style="color:var(--text-mid);font-size:13px;">${label}</div>
       <div style="color:${color};font-weight:700;font-size:13px;">${fmt(amount)}</div>
     </div>`;
  const totalRow = (label, amount, color) =>
    `<div style="display:flex;justify-content:space-between;align-items:center;padding:11px 14px;background:rgba(255,255,255,0.05);border-radius:8px;border:1px solid rgba(255,255,255,0.1);margin-top:4px;">
       <div style="color:${color};font-weight:800;font-size:13px;">${label}</div>
       <div style="color:${color};font-weight:800;font-size:14px;">${fmt(amount)}</div>
     </div>`;

  container.innerHTML = `
  <div style="display:flex;flex-direction:column;gap:26px;">
    ${statusBanner}
    <!-- HEADER -->
    <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:20px;border-bottom:1px solid var(--border);">
      <div>
        <div style="font-size:11px;color:var(--gold);text-transform:uppercase;letter-spacing:2px;font-weight:700;margin-bottom:6px;">Final Event Report</div>
        <div style="font-size:24px;font-weight:800;color:var(--cream);font-family:'Arial',sans-serif;">${res.client}'s ${res.type || 'Event'}</div>
        <div style="font-size:12px;color:var(--text-dim);margin-top:5px;">${res.date} | ${res.venue} | Completed ${completedAt}</div>
      </div>
      <div style="background:${isCompleted?'rgba(45,138,78,0.1)':'rgba(212,175,55,0.08)'};border:1px solid ${isCompleted?'var(--green)':'var(--gold)'};border-radius:12px;padding:12px 22px;text-align:center;">
        <div style="font-size:10px;color:${isCompleted?'var(--green)':'var(--gold)'};font-weight:800;letter-spacing:1.5px;text-transform:uppercase;">Status</div>
        <div style="font-size:16px;font-weight:800;color:${isCompleted?'var(--green)':'var(--gold)'};margin-top:2px;">${isCompleted?'COMPLETED':(res.status||'ACTIVE').toUpperCase()}</div>
      </div>
    </div>
    <!-- KPI ROW 1 -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;">
      ${card('Total Revenue',  fmt(totalRevenue), 'var(--gold)',  'Package + surcharges')}
      ${card('Net Profit',     fmt(netProfit),    'var(--green)', 'Margin: ' + profitMargin + '%')}
      ${card('Total Expenses', fmt(totalExpenses),'var(--red)',   'Operational cost')}
      ${card('Total Damages',  fmt(totalDamages), 'var(--amber,#d97706)', 'Equipment damage')}
    </div>
    <!-- KPI ROW 2 -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;">
      ${card('Items Served',       itemsServed,      'var(--cream)', 'Menu items')}
      ${card('Staff Deployed',     '8',              'var(--cream)', 'Personnel (placeholder)')}
      ${card('Event Delay',  overtimeHrs > 0 ? overtimeHrs + ' hrs' : 'None', overtimeHrs > 0 ? 'var(--amber,#d97706)' : 'var(--green)', 'Overtime recorded')}
      ${card('Overtime Hours',     overtimeHrs + ' hrs', overtimeHrs > 0 ? 'var(--amber,#d97706)' : 'var(--green)', 'Beyond agreed time')}
    </div>
    <!-- MAIN GRID -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;">
      <!-- LEFT -->
      <div style="display:flex;flex-direction:column;gap:18px;">
        <div class="panel" style="padding:22px;">
          <div style="font-size:11px;color:var(--gold);font-weight:800;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;">Event Details</div>
          <div style="display:grid;grid-template-columns:130px 1fr;gap:9px 14px;font-size:13px;">
            <div style="color:var(--text-dim);">Client</div><div style="color:var(--cream);font-weight:600;">${res.client || '—'}</div>
            <div style="color:var(--text-dim);">Event Type</div><div style="color:var(--cream);font-weight:600;">${res.type || '—'}</div>
            <div style="color:var(--text-dim);">Theme</div><div style="color:var(--cream);font-weight:600;">${res.theme || '—'}</div>
            <div style="color:var(--text-dim);">Date</div><div style="color:var(--cream);font-weight:600;">${res.date || '—'}</div>
            <div style="color:var(--text-dim);">Time Range</div><div style="color:var(--cream);font-weight:600;">${res.time || '08:00 AM - 01:00 PM'}</div>
            <div style="color:var(--text-dim);">Venue</div><div style="color:var(--cream);font-weight:600;">${res.venue || '—'}</div>
            <div style="color:var(--text-dim);">Guest Count</div><div style="color:var(--cream);font-weight:600;">${res.pax || '—'} pax${res.vipCount ? ' (' + res.vipCount + ' VIP)' : ''}</div>
            <div style="color:var(--text-dim);">Package</div><div style="color:var(--cream);font-weight:600;">${res.packageName || 'Custom Package'}</div>
          </div>
        </div>
        <div class="panel" style="padding:22px;">
          <div style="font-size:11px;color:var(--gold);font-weight:800;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;">Cost Breakdown <span style="font-size:10px;font-weight:400;color:var(--text-dim);text-transform:none;letter-spacing:0;">(estimated)</span></div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${row('Ingredients and Food',    costIngredients)}
            ${row('Equipment and Utilities', costEquipment)}
            ${row('Personnel and Labor',     costPersonnel)}
            ${row('Logistics and Transport', costLogistics)}
            ${row('Miscellaneous',           costMisc)}
            ${totalRow('Total Expenses', totalExpenses, 'var(--red)')}
          </div>
        </div>
      </div>
      <!-- RIGHT -->
      <div style="display:flex;flex-direction:column;gap:18px;">
        <div class="panel" style="padding:22px;">
          <div style="font-size:11px;color:var(--gold);font-weight:800;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;">Revenue Breakdown</div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${row('Package Price',         pkgPrice)}
            ${row('Logistics Surcharge',   surcharge)}
            ${row('Overtime Charges',      overtimeFee,  overtimeFee  > 0 ? 'var(--amber,#d97706)' : 'var(--text-dim)')}
            ${row('Extra Guest Charges',   extraPaxFee,  extraPaxFee  > 0 ? 'var(--amber,#d97706)' : 'var(--text-dim)')}
            ${row('Equipment Damage Fee',  brokenFee,    brokenFee    > 0 ? 'var(--red)' : 'var(--text-dim)')}
            ${totalRow('Total Revenue', totalRevenue, 'var(--gold)')}
          </div>
        </div>
        <div class="panel" style="padding:22px;">
          <div style="font-size:11px;color:var(--gold);font-weight:800;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;">Execution Phase Timeline</div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${phases.map((p,i) => `
              <div style="display:flex;align-items:center;gap:12px;padding:11px 14px;background:rgba(45,138,78,0.05);border:1px solid rgba(45,138,78,0.15);border-radius:10px;">
                <div style="width:26px;height:26px;background:rgba(45,138,78,0.15);border:1px solid var(--green);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <div style="width:8px;height:8px;background:var(--green);border-radius:50%;"></div>
                </div>
                <div style="flex:1;">
                  <div style="font-size:12px;font-weight:700;color:var(--cream);">${p.name || 'Phase ' + (i+1)}</div>
                  <div style="font-size:11px;color:var(--text-dim);">${p.start || '—'} to ${p.end || '—'}</div>
                </div>
                <div style="font-size:10px;font-weight:800;color:var(--green);letter-spacing:0.5px;">COMPLETE</div>
              </div>`).join('')}
          </div>
        </div>
        <div class="panel" style="padding:22px;">
          <div style="font-size:11px;color:var(--gold);font-weight:800;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;">Payment Summary</div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${row('Initial Reservation Fee', res.initialFeeAmount || 1500, 'var(--green)')}
            ${row('Downpayment (50%)', Math.round(pkgPrice * 0.5), res.paymentStatus === 'paid' ? 'var(--green)' : 'var(--amber,#d97706)')}
            ${row('Final Payment (50%)', Math.round(pkgPrice * 0.5), 'var(--green)')}
            ${overtimeFee  > 0 ? row('Overtime Fee Charged',     overtimeFee,  'var(--amber,#d97706)') : ''}
            ${extraPaxFee  > 0 ? row('Extra Guest Fee Charged',   extraPaxFee,  'var(--amber,#d97706)') : ''}
            ${brokenFee    > 0 ? row('Equipment Damage Charged',  brokenFee,    'var(--red)')            : ''}
          </div>
        </div>
      </div>
    </div>
    <!-- FOOTER -->
    <div style="background:rgba(196,154,60,0.05);border:1px solid rgba(196,154,60,0.15);border-radius:12px;padding:16px 22px;font-size:12px;color:var(--text-dim);line-height:1.8;">
      <strong style="color:var(--gold);">Note:</strong> Cost breakdown values are estimated based on standard industry percentages and will be replaced with actual procurement data once the procurement records are finalized. Revenue figures are sourced directly from the confirmed reservation record.
    </div>
  </div>`;
};

// =====================================================================

// DECOR FULLSCREEN PANEL LOGIC
// =====================================================================
function openDecorPanel() {
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  if (!res) { alert('Please select a reservation first.'); return; }
  const panel = document.getElementById('proc-decor-detail-panel');
  if (panel) panel.style.display = 'flex';
  renderDecorPanel();
}

function closeDecorPanel() {
  const panel = document.getElementById('proc-decor-detail-panel');
  if (panel) panel.style.display = 'none';
}

async function renderDecorPanel() {
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  const subEl = document.getElementById('pdd-sub');
  const bodyEl = document.getElementById('pdd-body');
  if (!res || !subEl || !bodyEl) return;

  subEl.textContent = `${res.client} - ${res.type || 'Event'} (${res.date}) — ${res.pax} pax`;
  bodyEl.innerHTML = '<div style="text-align:center;padding:80px;color:var(--text-dim);">Loading...</div>';

  const procData = await fetchProcurementData(res.id);
  const itemNames = (res.packageItems || []).map(ri => typeof ri === 'string' ? ri : (ri && ri.name ? ri.name : ''));
  const items = itemNames.map(n => CAT.find(c => c.name === n)).filter(Boolean);
  const decorItems = items.filter(i => i.cat === 'decoration' && i.name !== 'Letter Standee');

  if (!decorItems.length) {
    bodyEl.innerHTML = '<div style="text-align:center;padding:100px;color:var(--text-dim);">No aesthetic items in this package.</div>';
    return;
  }

  const supplierGroups = {};
  const nonSupplierItems = [];
  let totalCost = 0;

  decorItems.forEach(item => {
    const components = DECOR_COMPONENTS[item.name] || [];
    if (components.length > 0) {
      components.forEach(c => {
        totalCost += c.cost;
        if (c.supplier) {
          if (!supplierGroups[c.supplier]) supplierGroups[c.supplier] = [];
          supplierGroups[c.supplier].push({ item: item.name, ...c });
        } else {
          nonSupplierItems.push({ item: item.name, ...c });
        }
      });
    } else {
      totalCost += item.price || 0;
      nonSupplierItems.push({ item: item.name, name: item.name, cost: item.price || 0 });
    }
  });

  const cancelledItems = [];
  Object.keys(procData.poStatuses || {}).forEach(sup => {
    if (procData.poStatuses[sup] === 'Cancelled' && supplierGroups[sup]) {
      supplierGroups[sup].forEach(c => cancelledItems.push({ ...c, originalSupplier: sup }));
      delete supplierGroups[sup];
    }
  });

  const finalizedCost = res.finalizedDecorCost || 0;

  let html = `
    <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:16px; margin-bottom:24px;">
      <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border); padding:20px; border-radius:12px;">
        <div style="font-size:24px; font-weight:700; color:var(--cream);">₱${totalCost.toLocaleString()}</div>
        <div style="font-size:10px; color:var(--text-dim); text-transform:uppercase; letter-spacing:1px; margin-top:4px;">Est. Total Cost</div>
      </div>
      <div style="background:rgba(255,255,255,0.02); border:1px solid ${finalizedCost > 0 ? 'rgba(74,222,128,0.3)' : 'var(--border)'}; padding:20px; border-radius:12px;">
        <div style="font-size:24px; font-weight:700; color:${finalizedCost > 0 ? '#4ade80' : 'var(--cream)'};">${finalizedCost > 0 ? '₱' + finalizedCost.toLocaleString() : 'PENDING'}</div>
        <div style="font-size:10px; color:${finalizedCost > 0 ? '#4ade80' : 'var(--text-dim)'}; text-transform:uppercase; letter-spacing:1px; margin-top:4px;">PO Finalized Cost</div>
      </div>
      <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border); padding:20px; border-radius:12px;">
        <div style="font-size:24px; font-weight:700; color:var(--cream);">${Object.keys(supplierGroups).length}</div>
        <div style="font-size:10px; color:var(--text-dim); text-transform:uppercase; letter-spacing:1px; margin-top:4px;">Suppliers</div>
      </div>
      <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border); padding:20px; border-radius:12px;">
        <div style="font-size:24px; font-weight:700; color:var(--cream);">${nonSupplierItems.length + cancelledItems.length}</div>
        <div style="font-size:10px; color:var(--text-dim); text-transform:uppercase; letter-spacing:1px; margin-top:4px;">Shopping Items</div>
      </div>
    </div>
  `;

  html += `<div style="display:grid; grid-template-columns: 3fr 1fr; gap:32px;">`;

  // Left col
  html += `<div>`;
  
  html += `<div style="font-size:11px; color:var(--text-dim); text-transform:uppercase; letter-spacing:1px; margin-bottom:16px; border-bottom:1px solid var(--border); padding-bottom:8px;">Vendor Purchase Orders</div>`;
  
  if (Object.keys(supplierGroups).length === 0) {
    html += `<div style="padding:40px; text-align:center; color:var(--text-dim); border:1px dashed var(--border); border-radius:12px;">No 3rd-party vendor items for this package.</div>`;
  } else {
    html += `<div style="display:flex; flex-direction:column; gap:16px;">`;
    Object.keys(supplierGroups).sort().forEach(sup => {
      const items = supplierGroups[sup];
      let supTotal = 0;
      items.forEach(c => supTotal += c.cost);
      
      const status = procData.poStatuses?.[sup] || 'Draft';
      
      let badgeStyle = `background:rgba(255,255,255,0.1); color:var(--cream);`;
      if (status === 'Completed') badgeStyle = `background:rgba(74,222,128,0.2); color:#4ade80; border:1px solid rgba(74,222,128,0.3);`;
      else if (status === 'Cancelled') badgeStyle = `background:rgba(239,68,68,0.2); color:#ef4444; border:1px solid rgba(239,68,68,0.3);`;
      else if (status === 'Pending') badgeStyle = `background:rgba(250,204,21,0.2); color:#facc15; border:1px solid rgba(250,204,21,0.3);`;

      html += `<div style="background:rgba(196,154,60,0.03); border:1px solid rgba(196,154,60,0.2); border-radius:12px; padding:24px;">`;
      html += `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px;">
          <div>
            <div style="font-size:18px; font-weight:700; color:var(--gold); margin-bottom:6px;">${escHtml(sup)}</div>
            <div style="display:inline-block; padding:4px 10px; border-radius:4px; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:1px; ${badgeStyle}">${status}</div>
          </div>
          <div style="background:rgba(196,154,60,0.1); padding:8px 16px; border-radius:8px; font-size:18px; font-weight:800; color:var(--cream);">₱${supTotal.toLocaleString()}</div>
        </div>
      `;

      html += `<table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
        <thead>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
            <th style="text-align:left; padding:8px 0; font-size:10px; color:var(--text-dim); text-transform:uppercase;">Component</th>
            <th style="text-align:left; padding:8px 0; font-size:10px; color:var(--text-dim); text-transform:uppercase;">Item</th>
            <th style="text-align:right; padding:8px 0; font-size:10px; color:var(--text-dim); text-transform:uppercase;">Cost</th>
          </tr>
        </thead>
        <tbody>
      `;
      items.forEach(c => {
        html += `<tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
          <td style="padding:12px 0; font-size:13px; color:var(--cream);">${escHtml(c.name)}</td>
          <td style="padding:12px 0; font-size:12px; color:var(--text-mid);">${escHtml(c.item)}</td>
          <td style="padding:12px 0; font-size:13px; font-weight:700; color:var(--gold); text-align:right;">₱${c.cost.toLocaleString()}</td>
        </tr>`;
      });
      html += `</tbody></table>`;

      html += `<div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:16px; display:flex; justify-content:space-between; align-items:center;">`;
      if (status === 'Pending') {
        html += `
          <div style="font-size:12px; color:var(--text-dim);">Awaiting supplier confirmation</div>
          <div style="display:flex; gap:10px;">
            <button onclick="handleDecorPOCancelled('${sup.replace(/'/g, "\\'")}')" style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#ef4444; padding:8px 16px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;">✕ Order Cancelled</button>
            <button onclick="handleDecorPOReceived('${sup.replace(/'/g, "\\'")}')" style="background:rgba(74,222,128,0.1); border:1px solid rgba(74,222,128,0.3); color:#4ade80; padding:8px 16px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;">✓ Order Received</button>
          </div>
        `;
      } else if (status === 'Completed') {
        html += `<div style="width:100%; background:rgba(74,222,128,0.1); color:#4ade80; padding:12px; border-radius:6px; text-align:center; font-size:12px; font-weight:700;">✓ PO Completed &amp; Cost Finalized at ₱${supTotal.toLocaleString()}</div>`;
      } else if (status === 'Cancelled') {
        html += `<div style="width:100%; background:rgba(239,68,68,0.1); color:#ef4444; padding:12px; border-radius:6px; text-align:center; font-size:12px; font-weight:700;">✕ PO Cancelled - Items moved to shopping list</div>`;
      } else {
        html += `
          <div style="font-size:12px; color:var(--text-dim);">Draft Stage</div>
          <button class="btn-primary" onclick="exportDecorPO('${sup.replace(/'/g, "\\'")}')">Generate &amp; Export PO</button>
        `;
      }
      html += `</div></div>`;
    });
    html += `</div>`;
  }
  html += `</div>`; // End left col

  // Right col (Shopping list)
  html += `<div>`;
  html += `<div style="font-size:11px; color:var(--text-dim); text-transform:uppercase; letter-spacing:1px; margin-bottom:16px; border-bottom:1px solid var(--border); padding-bottom:8px;">General Shopping / Market</div>`;
  
  const allShop = [...nonSupplierItems, ...cancelledItems];
  if (allShop.length === 0) {
    html += `<div style="padding:40px; text-align:center; color:var(--text-dim); border:1px dashed var(--border); border-radius:12px;">No shopping items needed.</div>`;
  } else {
    html += `<div style="display:flex; flex-direction:column; gap:12px;">`;
    allShop.forEach(c => {
      const isCancelled = !!c.originalSupplier;
      html += `
        <div style="background:rgba(255,255,255,0.02); border:1px solid ${isCancelled ? 'rgba(239,68,68,0.3)' : 'var(--border)'}; border-radius:8px; padding:12px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <div style="font-size:13px; font-weight:700; color:var(--cream);">${escHtml(c.name)}</div>
            <div style="font-size:13px; font-weight:700; color:var(--gold);">₱${c.cost.toLocaleString()}</div>
          </div>
          <div style="font-size:11px; color:var(--text-dim);">For: ${escHtml(c.item)}</div>
          ${isCancelled ? `<div style="font-size:10px; color:#ef4444; margin-top:6px;"> Cancelled from ${escHtml(c.originalSupplier)}</div>` : ''}
        </div>
      `;
    });
    html += `</div>`;
  }
  html += `</div>`; // End right col

  html += `</div>`; // End grid

  bodyEl.innerHTML = html;
}

window.openDecorPanel = openDecorPanel;
window.closeDecorPanel = closeDecorPanel;

async function exportDecorPO(supplierName) {
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  if (!res) return;

  // Immediately set PO status to Pending
  try {
    const { updateDoc, doc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'procurement', res.id), {
      [`poStatuses.${supplierName}`]: 'Pending'
    });
  } catch(e) { console.error('Failed to set PO status to Pending:', e); }

  renderProcurementTab();
  if (document.getElementById('proc-decor-detail-panel').style.display === 'flex') {
    openDecorPanel();
  }

  alert(`Decor Purchase Order generated for ${supplierName}. Status set to PENDING.`);
}
window.exportDecorPO = exportDecorPO;

async function handleDecorPOReceived(supplier) {
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  if (!res) return;
  if (!confirm(`Mark the decor order from "${supplier}" as RECEIVED and finalize its cost?`)) return;

  // Calculate cost
  const itemNames = (res.packageItems || []).map(ri => typeof ri === 'string' ? ri : (ri && ri.name ? ri.name : ''));
  const items = itemNames.map(n => CAT.find(c => c.name === n)).filter(Boolean);
  const decorItems = items.filter(i => i.cat === 'decoration' && i.name !== 'Letter Standee');
  
  let supplierTotal = 0;
  decorItems.forEach(item => {
    const components = DECOR_COMPONENTS[item.name] || [];
    components.forEach(c => {
      if (c.supplier === supplier) supplierTotal += c.cost;
    });
  });

  try {
    const { updateDoc, doc } = window.firebaseFns;
    
    await updateDoc(doc(window.firebaseDB, 'procurement', res.id), {
      [`poStatuses.${supplier}`]: 'Completed'
    });

    const currentTotal = res.finalizedDecorCost || 0;
    const newTotal = currentTotal + supplierTotal;
    
    await updateDoc(doc(window.firebaseDB, 'reservations', res.id), {
      finalizedDecorCost: newTotal
    });

    res.finalizedDecorCost = newTotal;

  } catch(e) {
    console.error('Failed to update PO status:', e);
    alert('Failed to update PO status. See console.');
  }

  renderProcurementTab();
  if (document.getElementById('proc-decor-detail-panel').style.display === 'flex') {
    openDecorPanel();
  }
}
window.handleDecorPOReceived = handleDecorPOReceived;

async function handleDecorPOCancelled(supplier) {
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  if (!res) return;
  if (!confirm(`Cancel the decor order from "${supplier}"? Items will be moved to the General Shopping List.`)) return;

  try {
    const { updateDoc, doc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'procurement', res.id), {
      [`poStatuses.${supplier}`]: 'Cancelled'
    });
  } catch(e) {
    console.error('Failed to cancel PO:', e);
    alert('Failed to cancel PO. See console.');
  }

  renderProcurementTab();
  if (document.getElementById('proc-decor-detail-panel').style.display === 'flex') {
    openDecorPanel();
  }
}
window.handleDecorPOCancelled = handleDecorPOCancelled;

// =====================================================================
// CUSTOMER PROVIDED EQUIPMENT – SAVE
// =====================================================================
window.saveMtModeCustomerEquip = async function() {
  const res = RESERVATIONS.find(r => r.id === activeResDetailId);
  if (!res) { alert('No active reservation selected.'); return; }

  const getNum = id => parseInt(document.getElementById(id)?.value || '0') || 0;
  const getStr = id => document.getElementById(id)?.value?.trim() || '';

  const cpe = {
    tables:     getNum('cpe-tables'),
    chairs:     getNum('cpe-chairs'),
    plates:     getNum('cpe-plates'),
    forks:      getNum('cpe-forks'),
    spoons:     getNum('cpe-spoons'),
    knives:     getNum('cpe-knives'),
    glasses:    getNum('cpe-glasses'),
    chafing:    getNum('cpe-chafing'),
    dispensers: getNum('cpe-dispensers'),
    other:      getStr('cpe-other'),
    savedAt:    new Date().toISOString()
  };

  try {
    const { updateDoc, doc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'reservations', res.id), {
      customerProvidedEquip: cpe
    });
    res.customerProvidedEquip = cpe;
    alert('Customer provided equipment saved successfully!');
  } catch(e) {
    console.error('Failed to save customer equipment:', e);
    alert('Failed to save. See console for details.');
  }
};

// =====================================================================
// EQUIPMENT CYCLE – INNER SUB-TAB NAVIGATION
// =====================================================================
window.switchEqCycleTab = function(tabKey, btn) {
  // Update tab button styles
  document.querySelectorAll('.eq-cycle-tab').forEach(t => {
    t.classList.remove('active');
    t.style.borderBottomColor = 'transparent';
    t.style.color = 'var(--text-mid)';
  });
  btn.classList.add('active');
  btn.style.borderBottomColor = 'var(--gold)';
  btn.style.color = 'var(--gold)';

  // Hide all panels
  document.querySelectorAll('.eqc-panel').forEach(p => p.style.display = 'none');

  // Show the selected panel
  const panel = document.getElementById(`eqc-panel-${tabKey}`);
  if (!panel) return;
  panel.style.display = 'block';

  // Lazy-load content by cloning the existing standalone section's content into the panel
  const source = document.getElementById(`section-${tabKey}`);
  if (source && !panel.dataset.loaded) {
    panel.innerHTML = source.innerHTML;
    source.innerHTML = ''; // Destroy original to prevent ID duplication
    panel.dataset.loaded = 'true';
  }
  
  // Re-run any init functions that the section needs
  if (tabKey === 'allocation' && typeof renderAllocationSection === 'function') renderAllocationSection();
  if (tabKey === 'scheduling' && typeof renderSchedulingSection === 'function') renderSchedulingSection();
  if (tabKey === 'lifecycle' && typeof renderLifecycleSection === 'function') renderLifecycleSection();
  if (tabKey === 'equip-issues' && typeof renderEquipIssues === 'function') renderEquipIssues();
  if (tabKey === 'rentals' && typeof renderRentalCards === 'function') {
    if(typeof renderRentalNeeds === 'function') renderRentalNeeds();
    renderRentalCards();
  }
};



// =====================================================================
// EQUIPMENT CYCLE - MANIFEST QR CODE GENERATOR
// =====================================================================
window.generateSchedQR = function() {
  const res = RESERVATIONS.find(r => r.id === currentEqcReservationId);
  if (!res) { alert('No reservation selected.'); return; }
  const manifest = res.equipmentManifest ||
    (_schedAssignRows.length > 0 ? _schedAssignRows.map(r => ({ name: r.name, assignedQty: r.assignQty })) : null);
  if (!manifest || manifest.length === 0) { alert('No equipment assignment found. Save an assignment first.'); return; }
  const lines = manifest.map(item => item.name + ': ' + (item.assignedQty !== undefined ? item.assignedQty : (item.assignQty || 0)) + ' unit(s)');
  const nl = String.fromCharCode(10);
  const payload = 'HALDENS-EQUIP-MANIFEST' + nl + 'Reservation: ' + (res.client || res.name) + nl + 'Date: ' + res.date + nl + 'Pax: ' + res.pax + nl + '---' + nl + lines.join(nl);
  document.getElementById('qrModalTitle').textContent = 'Equipment Manifest QR';
  document.getElementById('qrModalSubtitle').textContent = 'Assigned equipment for ' + (res.client || res.name);
  document.getElementById('qrLabelId').textContent = res.id;
  document.getElementById('qrLabelName').textContent = (res.client || res.name) + ' - Equipment Manifest';
  const metaRows = manifest.slice(0, 8).map(item => {
    const qty = item.assignedQty !== undefined ? item.assignedQty : (item.assignQty || 0);
    return '<div style="display:flex;justify-content:space-between;font-size:11px;">' +
      '<span style="color:var(--text-dim);">' + item.name + '</span>' +
      '<span style="color:var(--gold);font-weight:500;">' + qty + ' units</span></div>';
  });
  if (manifest.length > 8) metaRows.push('<div style="font-size:10px;color:var(--text-dim);text-align:center;margin-top:4px;">+' + (manifest.length - 8) + ' more items</div>');
  document.getElementById('qrModalMeta').innerHTML = metaRows.join('');
  const qrContainer = document.getElementById('qrcode');
  qrContainer.innerHTML = '';
  try {
    if (typeof QRCode !== 'undefined') {
      new QRCode(qrContainer, { text: payload, width: 200, height: 200, colorDark: '#111111', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.L });
    } else if (typeof drawFallbackCanvas === 'function') { drawFallbackCanvas(qrContainer, payload); }
  } catch(e) { if (typeof drawFallbackCanvas === 'function') drawFallbackCanvas(qrContainer, payload); }
  currentQRData = { id: res.id, name: res.client || res.name, category: 'Equipment Manifest', isIndividual: false };
  const modal = document.getElementById('qrModal');
  const modalContent = document.getElementById('qrModalContent');
  if (modal) { modal.style.display = 'flex'; modal.classList.add('on'); }
  if (modalContent) modalContent.classList.add('open');
  document.body.style.overflow = 'hidden';
};

// =====================================================================
// PROCUREMENT HUB - EVENT EQUIPMENT CARD REDIRECT
// =====================================================================
window.openEquipmentCycleScheduling = function(reservationId) {
  const navBtn = document.getElementById('nav-equip-cycle');
  if (typeof showSection === 'function' && navBtn) showSection('equip-cycle', navBtn);
  currentEqcReservationId = reservationId;
  const sel = document.getElementById('eqc-reservation-select');
  if (sel) {
    if (typeof populateEqcDropdown === 'function') populateEqcDropdown();
    sel.value = reservationId;
    currentEqcReservationId = reservationId;
  }
  setTimeout(function() {
    const schedBtn = document.getElementById('eqc-tab-scheduling');
    if (schedBtn && typeof switchEqCycleTab === 'function') switchEqCycleTab('scheduling', schedBtn);
  }, 150);
};

// ==========================================
// ITEMS & PACKAGES MODULE
// ==========================================

let adminCatalog = [];
let adminPackages = [];

// Defaults to fall back to if localStorage is empty
const defaultCatalog = [
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
  { id: 'eq7', name: 'Round Banquet Tables', cat: 'equipment', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800', price: 500, batchSize: 20, desc: '60-inch round table, serves 20 pax batch', rating: 4.8, reviews: 60 },
  { id: 'eq10', name: 'Premium Utensils Set', cat: 'equipment', image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800', price: 80, isIndividual: true, desc: 'Spoons, forks, and bowls (per pax)', rating: 4.7, reviews: 25 },
  { id: 'eq2', name: 'Lights and Sound System', cat: 'equipment', image: 'https://images.unsplash.com/photo-1558231580-994d580436a5?auto=format&fit=crop&q=80&w=800', price: 8500, desc: 'Professional audio setup with lights, mixer, and speakers', rating: 4.8, reviews: 45 },
  { id: 'eq3', name: 'HD Projector & Screen', cat: 'equipment', image: 'https://images.unsplash.com/photo-1485846234645-ec686646738c?auto=format&fit=crop&q=80&w=800', price: 3500, desc: '4K projector + 80-inch tripod screen, full-day rental', rating: 4.6, reviews: 18 },
  { id: 'eq4', name: 'Cocktail Tables', cat: 'equipment', image: 'https://images.unsplash.com/photo-1466067531433-f5a401c17319?auto=format&fit=crop&q=80&w=800', price: 800, desc: 'High-top tables with elegant spandex covers (per table)', rating: 4.8, reviews: 29 },
  { id: 'eq5', name: 'Heavy Duty Marquee Tent', cat: 'equipment', image: 'https://images.unsplash.com/photo-1523413363574-c3c4e30467c0?auto=format&fit=crop&q=80&w=800', price: 12000, desc: '6x12m waterproof marquee tent for outdoor events', rating: 4.5, reviews: 12 },
  { id: 'eq6', name: 'LED Stage Lights', cat: 'equipment', image: 'https://images.unsplash.com/photo-1514300074170-efdfc066741d?auto=format&fit=crop&q=80&w=800', price: 4000, desc: 'Set of 8 RGB PAR lights for stage lighting effects', rating: 4.7, reviews: 22 },
  { id: 'eq8', name: 'Generator Set (15kva)', cat: 'equipment', image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800', price: 8000, desc: '15kva silent generator, ideal for outdoor events', rating: 4.5, reviews: 9 },
  { id: 'eq9', name: 'Wireless Microphone Set', cat: 'equipment', image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&q=80&w=800', price: 1500, desc: '2 wireless UHF handheld microphones with stands', rating: 4.8, reviews: 35 },
  // DECORATION
  { id: 'dc1', name: 'Entrance Stylist Setup', cat: 'decoration', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800', price: 15000, desc: 'Grand entrance styling with drapes and lighting', rating: 5.0, reviews: 22 },
  { id: 'dc2', name: 'Balloon Setup', cat: 'decoration', image: 'https://images.unsplash.com/photo-1525268771113-32d9e9021a97?auto=format&fit=crop&q=80&w=800', price: 5000, desc: 'Assorted balloon decor for pillars and walls', rating: 4.8, reviews: 34 },
  { id: 'dc3', name: 'Balloon Drops Ceiling', cat: 'decoration', image: 'https://images.unsplash.com/photo-1530103043477-c7f44b4131de?auto=format&fit=crop&q=80&w=800', price: 8000, desc: 'Ceiling net with balloon release mechanism', rating: 4.9, reviews: 15 },
  { id: 'dc4', name: 'Table Centerpiece', cat: 'decoration', image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc1b?auto=format&fit=crop&q=80&w=800', price: 1200, batchSize: 10, desc: 'Elegant floral and candle arrangement per table', rating: 4.7, reviews: 56 },
  { id: 'dc5', name: 'Letter Standee', cat: 'decoration', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800', price: 500, isIndividual: true, desc: 'Large 4ft lighted letter standee (per character)', rating: 4.9, reviews: 120 },
  { id: 'dc6', name: '2x4 Photo Standee', cat: 'decoration', image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&q=80&w=800', price: 2500, desc: 'Life-size photo standee on high-quality foamboard', rating: 4.6, reviews: 28 },
  // ENTERTAINMENT
  { id: 'en1', name: 'Photo Booth Setup', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800', price: 6000, desc: 'Fun photo booth with props and 4-hour unlimited prints', rating: 4.9, reviews: 128 },
  { id: 'en2', name: 'Event Coordinator', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800', price: 15000, desc: 'Professional event coordinator, on-the-day management', rating: 4.8, reviews: 43 },
  { id: 'en3', name: 'Party Host / Emcee', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800', price: 5000, desc: 'Professional party host to run your event program', rating: 4.7, reviews: 67 },
  { id: 'en4', name: 'Kids Magician', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&q=80&w=800', price: 4000, desc: 'Interactive 1-hour magic show for children', rating: 5.0, reviews: 92 },
  // PHOTOGRAPHY
  { id: 'ph1', name: 'Event Photography', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1452868977680-bd2b2b33af24?auto=format&fit=crop&q=80&w=800', price: 12000, desc: '8-hour photo coverage, 500+ edited shots on USB', rating: 4.9, reviews: 87 },
  { id: 'ph2', name: 'Photo & Video Bundle', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800', price: 22000, desc: 'Full event photo + cinematic video, 8hrs, highlight reel included', rating: 5.0, reviews: 62 },
  { id: 'ph3', name: 'Same-Day Edit Video', cat: 'entertainment', image: 'https://images.unsplash.com/photo-1601506521793-dc748fc80b67?auto=format&fit=crop&q=80&w=800', price: 8000, desc: '3-5 minute highlight video ready before the event ends', rating: 4.8, reviews: 31 },
];

const defaultPackages = [
  {
    id: 'pkg-wedding',
    name: 'Royal Wedding Package',
    pricePerHead: 1200,
    desc: 'A complete, worry-free luxury wedding experience with premium catering and full service.',
    theme: 'Royal / Classic White',
    occasion: 'Wedding',
    itemIds: ['f1', 'f2', 'f6', 'f8', 'f15', 'd1', 'd7', 'dr4', 'dr5', 'dc1', 'dc3', 'eq1', 'eq7', 'eq10', 'eq2', 'ph2'],
    items: ['Pork Belly Lechon', 'Beef Caldereta', 'Seafood Paella', 'Beef Kare-Kare', 'Beef Pares', 'Mango Bravo Cake', 'Halo-Halo Station', 'Cucumber Lemonade', 'Brewed Coffee Station', 'Entrance Stylist Setup', 'Balloon Drops Ceiling', 'Tiffany Chairs', 'Round Banquet Tables', 'Premium Utensils', 'Lights and Sound System', 'Photo & Video Bundle'],
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
    badge: 'Most Popular',
    rating: 5.0,
    reviews: 42
  },
  {
    id: 'pkg-debut',
    name: 'Debut Grand Celebration',
    pricePerHead: 950,
    desc: 'Celebrate her 18th year with style, music, and an unforgettable buffet.',
    theme: 'Enchanted / Modern',
    occasion: '18th Birthday (Debut)',
    itemIds: ['f3', 'f4', 'f9', 'f12', 'f13', 'd3', 'd6', 'dr2', 'dr3', 'dc1', 'dc4', 'eq1', 'eq7', 'en2', 'en1'],
    items: ['Garlic Butter Chicken', 'Lumpia Shanghai', 'Pork Sinigang', 'Crispy Fried Chicken', 'Lechon Kawali', 'Leche Flan Tower', 'Buko Pandan Salad', 'Iced Tea & Lemonade', 'Sago\'t Gulaman', 'Entrance Stylist Setup', 'Table Centerpiece', 'Tiffany Chairs', 'Round Banquet Tables', 'Event Coordinator', 'Photo Booth Setup'],
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800',
    badge: 'Best Seller',
    rating: 4.9,
    reviews: 61
  },
  {
    id: 'pkg-kiddie',
    name: 'Kiddie Wonderland',
    pricePerHead: 650,
    desc: 'Fun-filled party with magic, games, and kid-approved Filipino dishes.',
    theme: 'Colorful Carnival',
    occasion: 'Birthday Party',
    itemIds: ['f11', 'f12', 'f4', 'f10', 'd9', 'dr1', 'dc2', 'en4', 'en3', 'en1'],
    items: ['Filipino Style Spaghetti', 'Crispy Fried Chicken', 'Lumpia Shanghai', 'Pancit Bihon', 'Puto & Kutsinta', 'Soft Drinks Bar', 'Balloon Setup', 'Kids Magician', 'Party Host / Emcee', 'Photo Booth'],
    image: 'https://images.unsplash.com/photo-1530103043477-c7f44b4131de?auto=format&fit=crop&q=80&w=800',
    badge: 'Fan Favorite',
    rating: 4.8,
    reviews: 115
  },
  {
    id: 'pkg-corp',
    name: 'Corporate Elite',
    pricePerHead: 850,
    desc: 'Professional catering and full technical setup for conferences and seminars.',
    theme: 'Professional / Sleek',
    occasion: 'Corporate Event',
    itemIds: ['f2', 'f14', 'f15', 'f12', 'd5', 'dr5', 'eq2', 'eq3', 'eq6', 'eq8', 'ph1'],
    items: ['Beef Caldereta', 'Mixed Veggie Chopsuey', 'Beef Pares', 'Fried Chicken', 'Fresh Fruit Buffet', 'Brewed Coffee Station', 'Lights and Sound System', 'HD Projector & Screen', 'LED Stage Lights', 'Generator Set', 'Event Photography'],
    image: 'https://images.unsplash.com/photo-1505373676874-bc4831343753?auto=format&fit=crop&q=80&w=800',
    badge: 'Corporate',
    rating: 4.7,
    reviews: 34
  },
  {
    id: 'pkg-bday',
    name: 'Grand Birthday Bash',
    pricePerHead: 750,
    desc: 'The ultimate birthday celebration for all ages with full decor and emcee.',
    theme: 'Celebration / Festive',
    occasion: 'Birthday',
    itemIds: ['f7', 'f10', 'f4', 'f12', 'f16', 'd1', 'dr2', 'dc2', 'en3', 'ph1'],
    items: ['Classic Chicken Adobo', 'Pancit Bihon', 'Lumpia Shanghai', 'Crispy Fried Chicken', 'Bicol Express', 'Mango Bravo Cake', 'Iced Tea & Lemonade', 'Balloon Setup', 'Party Host / Emcee', 'Event Photography'],
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5ac?auto=format&fit=crop&q=80&w=800',
    badge: 'Celebration',
    rating: 4.8,
    reviews: 78
  },
  {
    id: 'pkg-dinner',
    name: 'Intimate Soiree',
    pricePerHead: 1100,
    desc: 'Perfect for anniversaries, reunions, or high-end small gatherings.',
    theme: 'Minimalist / Intimate',
    occasion: 'Private Dinner',
    itemIds: ['f6', 'f8', 'd1', 'dr4', 'dc3', 'en2'],
    items: ['Seafood Paella', 'Beef Kare-Kare', 'Mango Bravo Cake', 'Cucumber Lemonade', 'Balloon Drops Ceiling', 'Event Coordinator'],
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800',
    badge: 'Intimate',
    rating: 4.9,
    reviews: 29
  }
];

function initAdminPackages() {
  const savedCat = localStorage.getItem('halden_catalog');
  if (savedCat && JSON.parse(savedCat).length > 10) {
    try { adminCatalog = JSON.parse(savedCat); } catch(e) { adminCatalog = [...defaultCatalog]; }
  } else {
    // If not found, we might want to try to fetch app.js default or just use the local default
    // We will just use local default if nothing is synced yet.
    adminCatalog = [...defaultCatalog];
    saveCatalogToStorage();
  }

  const savedPkgs = localStorage.getItem('halden_packages');
  if (savedPkgs) {
    try { adminPackages = JSON.parse(savedPkgs); } catch(e) { adminPackages = [...defaultPackages]; }
  } else {
    adminPackages = [...defaultPackages];
    savePackagesToStorage();
  }

  renderAdminCatalog();
  renderAdminPackages();
  populatePackageModalItems();
}

function saveCatalogToStorage() {
  localStorage.setItem('halden_catalog', JSON.stringify(adminCatalog));
}

function savePackagesToStorage() {
  localStorage.setItem('halden_packages', JSON.stringify(adminPackages));
}

// Ensure the module is initialized when switched to
const oldShowSection = window.showSection;
window.showSection = function(id, btn) {
  if (oldShowSection) oldShowSection(id, btn);
  if (id === 'packages') {
    initAdminPackages();
  }
};

function switchPackageTab(tab) {
  document.getElementById('btn-tab-catalog').classList.toggle('active', tab === 'catalog');
  document.getElementById('btn-tab-premade').classList.toggle('active', tab === 'premade');
  document.getElementById('pkg-pane-catalog').style.display = tab === 'catalog' ? 'block' : 'none';
  document.getElementById('pkg-pane-premade').style.display = tab === 'premade' ? 'block' : 'none';
}

function renderAdminCatalog() {
  const grid = document.getElementById('admin-catalog-grid');
  if (!grid) return;

  const searchQ = (document.getElementById('admin-cat-search')?.value || '').toLowerCase();
  const filterCat = document.getElementById('admin-cat-filter')?.value || 'all';
  let items = adminCatalog;
  if (filterCat !== 'all') items = items.filter(i => i.cat === filterCat);
  if (searchQ) items = items.filter(i => i.name.toLowerCase().includes(searchQ) || i.desc.toLowerCase().includes(searchQ));
  grid.innerHTML = items.map(item => `
    <div class="admin-cat-card ${item.hidden ? 'hidden' : ''}">
      ${item.hidden ? '<div class="admin-cat-badge">Hidden</div>' : ''}
      <div class="admin-cat-info">
        <div style="font-size:10px; color:var(--gold); text-transform:uppercase; font-weight:700; margin-bottom:4px;">${item.cat}</div>
        <div class="admin-cat-title">${item.name}</div>
        <div class="admin-cat-price">₱${item.price.toLocaleString()} ${item.isIndividual ? '/ pax' : (item.batchSize ? '(serves ' + item.batchSize + ')' : '')}</div>
        <div class="admin-cat-desc">${item.desc}</div>
        ${item.ingredients ? `<div style="font-size:10px; color:var(--text-dim); margin-top:4px;"><strong>Ingredients:</strong> ${item.ingredients.join(', ')}</div>` : ''}
      </div>
      <div class="admin-cat-actions">
        <button class="btn-outline" onclick="openEditCatalogModal('${item.id}')">Edit</button>
        <button class="btn-outline" onclick="toggleCatalogVisibility('${item.id}')">${item.hidden ? 'Show in Web' : 'Hide in Web'}</button>
      </div>
    </div>
  `).join('');
}

function renderAdminPackages() {
  const grid = document.getElementById('admin-premade-grid');
  if (!grid) return;

  grid.innerHTML = adminPackages.map(p => `
    <div class="admin-cat-card ${p.hidden ? 'hidden' : ''}">
      ${p.hidden ? '<div class="admin-cat-badge" style="background:#666;">Hidden</div>' : ''}
      ${p.limitedDate ? `<div class="admin-cat-badge" style="background:var(--red); ${p.hidden ? 'right:70px;' : ''}">Until ${p.limitedDate}</div>` : ''}
      <div class="admin-cat-info">
        <div style="font-size:10px; color:var(--gold); text-transform:uppercase; font-weight:700; margin-bottom:4px;">${p.occasion}</div>
        <div class="admin-cat-title">${p.name}</div>
        <div class="admin-cat-price">₱${p.pricePerHead.toLocaleString()} / pax</div>
        <div class="admin-cat-desc">${p.desc}</div>
        <div style="font-size:11px; color:var(--text-dim); margin-top:8px;"><strong>Included:</strong> ${p.items.slice(0, 4).join(', ')}${p.items.length > 4 ? '...' : ''}</div>
      </div>
      <div class="admin-cat-actions">
        <button class="btn-outline" onclick="openEditPremadeModal('${p.id}')">Edit</button>
        <button class="btn-outline" onclick="togglePackageVisibility('${p.id}')">${p.hidden ? 'Show in Web' : 'Hide in Web'}</button>
      </div>
    </div>
  `).join('');
}

// ======================== CATALOG MODAL LOGIC ========================
function toggleConsumableFields() {
  const cat = document.getElementById('ac-item-cat').value;
  const isConsumable = ['food', 'dessert', 'drink'].includes(cat);
  document.getElementById('ac-consumable-fields').style.display = isConsumable ? 'block' : 'none';
}

function openAddCatalogModal() {
  document.getElementById('ac-item-id').value = '';
  document.getElementById('ac-item-name').value = '';
  document.getElementById('ac-item-desc').value = '';
  document.getElementById('ac-item-price').value = '';
  document.getElementById('ac-item-pax').value = '';
  document.getElementById('ac-item-ingredients').value = '';
  document.getElementById('ac-item-cat').value = 'food';
  document.getElementById('admin-catalog-modal-title').textContent = 'Add Catalog Item';
  toggleConsumableFields();
  document.getElementById('admin-catalog-modal-overlay').classList.add('on');
  document.getElementById('admin-catalog-modal').classList.add('open');
}

function openEditCatalogModal(id) {
  const item = adminCatalog.find(i => i.id === id);
  if(!item) return;
  document.getElementById('ac-item-id').value = item.id;
  document.getElementById('ac-item-name').value = item.name;
  document.getElementById('ac-item-desc').value = item.desc;
  document.getElementById('ac-item-price').value = item.price;
  document.getElementById('ac-item-cat').value = item.cat;
  
  if (item.batchSize) document.getElementById('ac-item-pax').value = item.batchSize;
  else document.getElementById('ac-item-pax').value = '';

  if (item.ingredients) document.getElementById('ac-item-ingredients').value = item.ingredients.join(', ');
  else document.getElementById('ac-item-ingredients').value = '';

  document.getElementById('admin-catalog-modal-title').textContent = 'Edit Catalog Item';
  toggleConsumableFields();
  document.getElementById('admin-catalog-modal-overlay').classList.add('on');
  document.getElementById('admin-catalog-modal').classList.add('open');
}

function closeAdminCatalogModal() {
  document.getElementById('admin-catalog-modal-overlay').classList.remove('on');
  document.getElementById('admin-catalog-modal').classList.remove('open');
}

function saveAdminCatalogItem() {
  const id = document.getElementById('ac-item-id').value;
  const name = document.getElementById('ac-item-name').value.trim();
  const desc = document.getElementById('ac-item-desc').value.trim();
  const price = parseFloat(document.getElementById('ac-item-price').value) || 0;
  const cat = document.getElementById('ac-item-cat').value;

  if(!name) return alert('Name is required');

  const isConsumable = ['food', 'dessert', 'drink'].includes(cat);
  const pax = parseInt(document.getElementById('ac-item-pax').value) || 0;
  const ingrRaw = document.getElementById('ac-item-ingredients').value;
  const ingredients = ingrRaw ? ingrRaw.split(',').map(s=>s.trim()).filter(s=>s) : [];

  let item = {
    id: id || ('cat_' + Date.now()),
    name, desc, price, cat,
    rating: 5.0, reviews: 0
  };

  if(isConsumable && pax > 0) item.batchSize = pax;
  if(!isConsumable) item.isIndividual = true; // simplifying logic
  if(isConsumable && ingredients.length > 0) item.ingredients = ingredients;

  if (id) {
    const idx = adminCatalog.findIndex(i => i.id === id);
    if(idx > -1) {
      item.hidden = adminCatalog[idx].hidden;
      item.image = adminCatalog[idx].image || '';
      adminCatalog[idx] = Object.assign(adminCatalog[idx], item);
    }
  } else {
    adminCatalog.push(item);
  }

  saveCatalogToStorage();
  renderAdminCatalog();
  populatePackageModalItems(); // update choices for packages
  closeAdminCatalogModal();
}

function toggleCatalogVisibility(id) {
  const idx = adminCatalog.findIndex(i => i.id === id);
  if(idx > -1) {
    adminCatalog[idx].hidden = !adminCatalog[idx].hidden;
    saveCatalogToStorage();
    renderAdminCatalog();
  }
}


// ======================== PRE-MADE PACKAGE MODAL LOGIC ========================
function toggleLimitedDate() {
  const isLimited = document.getElementById('ap-pkg-is-limited').checked;
  document.getElementById('ap-pkg-date-container').style.display = isLimited ? 'block' : 'none';
}

function populatePackageModalItems() {
  const list = document.getElementById('ap-pkg-items-list');
  if(!list) return;
  list.innerHTML = adminCatalog.map(item => `
    <label style="display:flex; align-items:center; gap:8px; font-size:12px; color:var(--text-dim);">
      <input type="checkbox" class="ap-pkg-item-cb" value="${item.id}" data-name="${item.name.replace(/"/g,'&quot;')}">
      ${item.name} <span style="color:var(--gold);font-size:10px;">[${item.cat}]</span>
    </label>
  `).join('');
}

function openAddPremadeModal() {
  document.getElementById('ap-pkg-id').value = '';
  document.getElementById('ap-pkg-name').value = '';
  document.getElementById('ap-pkg-desc').value = '';
  document.getElementById('ap-pkg-price').value = '';
  document.getElementById('ap-pkg-cat').value = 'Wedding';
  document.getElementById('ap-pkg-is-limited').checked = false;
  document.getElementById('ap-pkg-end-date').value = '';
  toggleLimitedDate();

  document.querySelectorAll('.ap-pkg-item-cb').forEach(cb => cb.checked = false);

  document.getElementById('admin-pkg-modal-title').textContent = 'Add Pre-made Package';
  document.getElementById('admin-pkg-modal-overlay').classList.add('on');
  document.getElementById('admin-pkg-modal').classList.add('open');
}

function openEditPremadeModal(id) {
  const p = adminPackages.find(i => i.id === id);
  if(!p) return;
  document.getElementById('ap-pkg-id').value = p.id;
  document.getElementById('ap-pkg-name').value = p.name;
  document.getElementById('ap-pkg-desc').value = p.desc;
  document.getElementById('ap-pkg-price').value = p.pricePerHead;
  document.getElementById('ap-pkg-cat').value = p.occasion;
  
  if (p.limitedDate) {
    document.getElementById('ap-pkg-is-limited').checked = true;
    document.getElementById('ap-pkg-end-date').value = p.limitedDate;
  } else {
    document.getElementById('ap-pkg-is-limited').checked = false;
    document.getElementById('ap-pkg-end-date').value = '';
  }
  toggleLimitedDate();

  document.querySelectorAll('.ap-pkg-item-cb').forEach(cb => {
    cb.checked = p.itemIds.includes(cb.value);
  });

  document.getElementById('admin-pkg-modal-title').textContent = 'Edit Pre-made Package';
  document.getElementById('admin-pkg-modal-overlay').classList.add('on');
  document.getElementById('admin-pkg-modal').classList.add('open');
}

function closeAdminPkgModal() {
  document.getElementById('admin-pkg-modal-overlay').classList.remove('on');
  document.getElementById('admin-pkg-modal').classList.remove('open');
}

function saveAdminPkg() {
  const id = document.getElementById('ap-pkg-id').value;
  const name = document.getElementById('ap-pkg-name').value.trim();
  const desc = document.getElementById('ap-pkg-desc').value.trim();
  const pricePerHead = parseFloat(document.getElementById('ap-pkg-price').value) || 0;
  const occasion = document.getElementById('ap-pkg-cat').value;
  const isLimited = document.getElementById('ap-pkg-is-limited').checked;
  const limitedDate = document.getElementById('ap-pkg-end-date').value;

  if(!name) return alert('Name is required');

  let itemIds = [];
  let itemsName = [];
  document.querySelectorAll('.ap-pkg-item-cb:checked').forEach(cb => {
    itemIds.push(cb.value);
    itemsName.push(cb.getAttribute('data-name'));
  });

  let pkg = {
    id: id || ('pkg_' + Date.now()),
    name, desc, pricePerHead, occasion,
    theme: 'Custom Theme', badge: 'New', rating: 5.0, reviews: 0,
    itemIds, items: itemsName
  };

  if(isLimited && limitedDate) pkg.limitedDate = limitedDate;

  if (id) {
    const idx = adminPackages.findIndex(i => i.id === id);
    if(idx > -1) {
      pkg.hidden = adminPackages[idx].hidden;
      pkg.image = adminPackages[idx].image || '';
      adminPackages[idx] = Object.assign(adminPackages[idx], pkg);
    }
  } else {
    adminPackages.push(pkg);
  }

  savePackagesToStorage();
  renderAdminPackages();
  closeAdminPkgModal();
}

function togglePackageVisibility(id) {
  const idx = adminPackages.findIndex(i => i.id === id);
  if(idx > -1) {
    adminPackages[idx].hidden = !adminPackages[idx].hidden;
    savePackagesToStorage();
    renderAdminPackages();
  }
}

// ==========================================
// TOP CUSTOMER ANALYTICS LOGIC
// ==========================================
// We'll calculate the top customer by finding the user with the most past/active reservations
function updateTopCustomerStat() {
  setTimeout(() => {
    // Assuming ALL_RESERVATIONS exists from admin.js
    if (typeof ALL_RESERVATIONS !== 'undefined' && ALL_RESERVATIONS.length > 0) {
      const counts = {};
      ALL_RESERVATIONS.forEach(r => {
        if(r.customer && r.customer.email) {
          counts[r.customer.email] = (counts[r.customer.email] || 0) + 1;
        }
      });
      let topUserEmail = null;
      let topCount = 0;
      for (const [email, count] of Object.entries(counts)) {
        if (count > topCount) {
          topCount = count;
          topUserEmail = email;
        }
      }
      if (topUserEmail) {
        // Find name
        const res = ALL_RESERVATIONS.find(r => r.customer && r.customer.email === topUserEmail);
        const name = res.customer.name || topUserEmail.split('@')[0];
        const nameEl = document.getElementById('top-customer-name');
        const countEl = document.getElementById('top-customer-bookings');
        if (nameEl) nameEl.textContent = name;
        if (countEl) countEl.textContent = topCount + ' return bookings';
      }
    }
  }, 3000); // Wait a bit for ALL_RESERVATIONS to be populated
}

// Hook into existing init
const oldInitData = window.initData;
if (typeof oldInitData === 'function') {
  window.initData = async function() {
    await oldInitData();
    updateTopCustomerStat();
    initAdminPackages(); // initialize in background
  }
} else {
  // if no initData, just run
  document.addEventListener('DOMContentLoaded', () => {
    updateTopCustomerStat();
    initAdminPackages();
  });
}


function toggleAdminChatPanel() {
  const panel = document.getElementById('admin-chat-drawer');
  if (panel) {
    if (panel.classList.contains('open')) {
      panel.classList.remove('open');
    } else {
      panel.classList.add('open');
      renderAdminChatInbox(); // Refresh chats when opened
    }
  }
}
