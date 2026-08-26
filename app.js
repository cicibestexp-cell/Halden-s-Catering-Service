window.toggleOther = function (id) { const select = document.getElementById(id); const otherInput = document.getElementById(id + '-other'); if (select && otherInput) { if (select.value === 'Others') { otherInput.style.display = 'block'; otherInput.focus(); } else { otherInput.style.display = 'none'; otherInput.value = ''; } } }; window.getSmartV = function (id) { if (id === 'cpkg-timeframe') { const start = document.getElementById('cpkg-timeframe-start')?.value || ''; const end = document.getElementById('cpkg-timeframe-end')?.value || ''; if (start && end) return start + ' - ' + end; return ''; } const el = document.getElementById(id); if (!el) return ''; if (el.tagName === 'SELECT') { if (el.value === 'Others') { const otherEl = document.getElementById(id + '-other'); return (otherEl?.value || '').trim(); } } return (el.value || '').trim(); }; window.smartAssign = function (id, val) { if (id === 'cpkg-timeframe') { if (val && val.includes('-')) { const parts = val.split('-'); const sEl = document.getElementById('cpkg-timeframe-start'); const eEl = document.getElementById('cpkg-timeframe-end'); if (sEl) sEl.value = parts[0].trim(); if (eEl) eEl.value = parts[1].trim(); } return; } const el = document.getElementById(id); if (!el) return; if (el.tagName === 'SELECT' && document.getElementById(id + '-other')) { const opts = Array.from(el.options).map(o => o.value); if (val && !opts.includes(val)) { el.value = 'Others'; const otherEl = document.getElementById(id + '-other'); if (otherEl) { otherEl.style.display = 'block'; otherEl.value = val; } } else { el.value = val || ''; const otherEl = document.getElementById(id + '-other'); if (otherEl) { otherEl.style.display = 'none'; otherEl.value = ''; } } return; } el.value = val || ''; };
// ===== GLOBAL EXPOSURE (Early) =====
window.openErrorModal = function (msg) {
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

window.closeErrorModal = function () {
  const overlay = document.getElementById('error-overlay');
  if (overlay) {
    overlay.classList.remove('on');
    overlay.style.display = 'none'; // Re-hide
  }
};

// ===== DATA =====
let CAT = [
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

  // EQUIPMENT, Decorations & Entertainment are all loaded from Supabase

];


// ===== SUPABASE EQUIPMENT LOADER =====
// Fetches live equipment from the Supabase equipment_inventory table,
// removes the hardcoded eq1-eq10 items from CAT, and injects the
// real inventory so both the Full Catalog and Custom Package Builder
// always reflect what's actually in the database.
async function loadEquipmentFromSupabase() {
  try {
    // Supabase must already be initialized on the page (via index.html script block)
    const supabaseClient = window.supabaseClient || window.supabase;
    if (!supabaseClient) {
      console.warn('[Equipment Loader] Supabase client not found on window. Skipping live equipment load.');
      return;
    }

    const { data: rows, error } = await supabaseClient
      .from('equipment_inventory')
      .select('id, name, category, type, total_qty, available_qty, status, condition, value, notes, price, pricing_type, allocation_type, description')
      .neq('status', 'disposed')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('[Equipment Loader] Supabase error:', error.message);
      return;
    }

    if (!rows || rows.length === 0) {
      console.warn('[Equipment Loader] No equipment rows returned from Supabase.');
      return;
    }

    // 1. Strip out ALL hardcoded equipment items (eq1–eq10, etc.)
    CAT = CAT.filter(item => item.cat !== 'equipment');

    // 2. Map each Supabase row → CAT item format
    const supabaseEquipItems = rows.map(row => {
      // Build a readable description from the database fields if description is missing
      const qtyText = `${row.available_qty ?? row.total_qty ?? 0} units available`;
      const condText = row.condition ? ` • Condition: ${row.condition}` : '';
      const notesText = row.notes ? ` • ${row.notes}` : '';
      const typeText = row.type ? `${row.type} ` : '';
      const defaultDesc = `${typeText}(${qtyText}${condText}${notesText})`;
      
      const finalDesc = row.description ? row.description : defaultDesc;

      return {
        id: `eq-sb-${row.id}`,
        supabaseId: row.id,
        name: row.name,
        cat: 'equipment',
        category: row.category,
        type: row.type,
        image: getEquipmentImage(row.category, row.type),
        price: parseFloat(row.price) || 0, // Now uses row.price instead of row.value
        desc: finalDesc,
        rating: 4.5,
        reviews: 0,
        totalQty: row.total_qty || 0,
        availableQty: row.available_qty || 0,
        status: row.status,
        condition: row.condition,
        pricingType: row.pricing_type || 'fixed',
        allocationType: row.allocation_type || 'fixed'
      };
    });

    // 3. Merge into CAT
    CAT.push(...supabaseEquipItems);

    // 4. Re-render both catalog views
    renderFullCatalog();
    renderCat();

    console.log(`[Equipment Loader] ✅ Loaded ${supabaseEquipItems.length} equipment items from Supabase.`);

  } catch (err) {
    console.error('[Equipment Loader] Unexpected error:', err);
  }
}

// Helper: pick a relevant stock image based on category/type
function getEquipmentImage(category, type) {
  const t = (type || '').toLowerCase();
  const c = (category || '').toLowerCase();

  if (t.includes('chair')) return 'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&q=80&w=800';
  if (t.includes('table')) return 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800';
  if (t.includes('linen') || t.includes('cloth') || t.includes('napkin') || t.includes('runner') || t.includes('cover')) return 'https://images.unsplash.com/photo-1530103043477-c7f44b4131de?auto=format&fit=crop&q=80&w=800';
  if (t.includes('plate') || t.includes('bowl') || t.includes('saucer')) return 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800';
  if (t.includes('glass') || t.includes('flute') || t.includes('cup')) return 'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?auto=format&fit=crop&q=80&w=800';
  if (t.includes('spoon') || t.includes('fork') || t.includes('knife') || t.includes('tong') || t.includes('serving')) return 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800';
  if (t.includes('tray')) return 'https://images.unsplash.com/photo-1576402187878-974f70c890a5?auto=format&fit=crop&q=80&w=800';
  if (t.includes('chafing') || t.includes('warmer') || t.includes('pan') || t.includes('lid')) return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800';
  if (t.includes('basket') || t.includes('bucket') || t.includes('pitcher')) return 'https://images.unsplash.com/photo-1466027397211-20d0f2449a3e?auto=format&fit=crop&q=80&w=800';
  if (c.includes('av') || t.includes('speaker') || t.includes('microphone')) return 'https://images.unsplash.com/photo-1558231580-994d580436a5?auto=format&fit=crop&q=80&w=800';
  if (c.includes('lighting') || t.includes('light')) return 'https://images.unsplash.com/photo-1514300074170-efdfc066741d?auto=format&fit=crop&q=80&w=800';
  if (c.includes('power') || t.includes('generator')) return 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800';
  if (c.includes('tent')) return 'https://images.unsplash.com/photo-1523413363574-c3c4e30467c0?auto=format&fit=crop&q=80&w=800';

  // Generic fallback
  return 'https://images.unsplash.com/photo-1466027397211-20d0f2449a3e?auto=format&fit=crop&q=80&w=800';
}

// Helper: pick a relevant stock image based on menu item category/name
function getFoodImage(category, name) {
  const c = (category || '').toLowerCase();
  const n = (name || '').toLowerCase();

  // Beef
  if (c === 'beef') {
    if (n.includes('kare')) return 'https://images.unsplash.com/photo-1626509135521-e0066d40096d?auto=format&fit=crop&q=80&w=800';
    if (n.includes('roast')) return 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800';
    if (n.includes('lengua')) return 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800';
    return 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800';
  }
  // Pork
  if (c === 'pork') {
    if (n.includes('barbecue') || n.includes('bbq') || n.includes('liempo')) return 'https://images.unsplash.com/photo-1544333346-64e4fe1820af?auto=format&fit=crop&q=80&w=800';
    if (n.includes('kare')) return 'https://images.unsplash.com/photo-1626509135521-e0066d40096d?auto=format&fit=crop&q=80&w=800';
    if (n.includes('bicol')) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800';
    return 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&q=80&w=800';
  }
  // Chicken
  if (c === 'chicken') {
    if (n.includes('teriyaki') || n.includes('galbi') || n.includes('bbq') || n.includes('glazed')) return 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=800';
    if (n.includes('fried') || n.includes('crispy') || n.includes('oriental') || n.includes('strip')) return 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=800';
    return 'https://images.unsplash.com/photo-1541696490-8744a5db0223?auto=format&fit=crop&q=80&w=800';
  }
  // Dessert
  if (c === 'dessert') {
    if (n.includes('mango')) return 'https://images.unsplash.com/photo-1535141123063-3bb4cada2f59?auto=format&fit=crop&q=80&w=800';
    if (n.includes('buko') || n.includes('pandan')) return 'https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?auto=format&fit=crop&q=80&w=800';
    if (n.includes('tapioca') || n.includes('cocktail')) return 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800';
    return 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800';
  }
  // Drinks
  if (c === 'drinks' || category === 'Drinks') {
    if (n.includes('coffee') || n.includes('tea')) return 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800';
    if (n.includes('lemonade') || n.includes('juice')) return 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800';
    if (n.includes('mango')) return 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=800';
    return 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?auto=format&fit=crop&q=80&w=800';
  }
  // Decoration
  if (c === 'decoration' || category === 'Decoration') {
    if (n.includes('balloon') && n.includes('drop')) return 'https://images.unsplash.com/photo-1530103043477-c7f44b4131de?auto=format&fit=crop&q=80&w=800';
    if (n.includes('balloon')) return 'https://images.unsplash.com/photo-1525268771113-32d9e9021a97?auto=format&fit=crop&q=80&w=800';
    if (n.includes('entrance')) return 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800';
    if (n.includes('centerpiece')) return 'https://images.unsplash.com/photo-1490750967868-88df5691cc1b?auto=format&fit=crop&q=80&w=800';
    if (n.includes('letter') || n.includes('standee')) return 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800';
    if (n.includes('photo standee')) return 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&q=80&w=800';
    return 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800';
  }
  // Entertainment / Addons
  if (c === 'entertainment' || category === 'Entertainment') {
    if (n.includes('photo booth')) return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800';
    if (n.includes('coordinator')) return 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800';
    if (n.includes('emcee') || n.includes('host')) return 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800';
    if (n.includes('magician')) return 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&q=80&w=800';
    if (n.includes('video') || n.includes('bundle')) return 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800';
    if (n.includes('photo') || n.includes('photography')) return 'https://images.unsplash.com/photo-1452868977680-bd2b2b33af24?auto=format&fit=crop&q=80&w=800';
    return 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800';
  }
  // Fish
  if (c === 'fish') {
    if (n.includes('tempura')) return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800';
    if (n.includes('sweet') || n.includes('sour')) return 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&q=80&w=800';
    return 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800';
  }
  // Shrimp / Seafood
  if (c === 'shrimp') {
    if (n.includes('tempura')) return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800';
    if (n.includes('mixed') || n.includes('seafood')) return 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&q=80&w=800';
    return 'https://images.unsplash.com/photo-1565680018434-b72f4e804e01?auto=format&fit=crop&q=80&w=800';
  }
  // Pasta
  if (c === 'pasta') {
    if (n.includes('lasagna')) return 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800';
    if (n.includes('seafood')) return 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&q=80&w=800';
    if (n.includes('alfredo') || n.includes('white') || n.includes('cream')) return 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=800';
    return 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800';
  }
  // Pancit / Noodles
  if (c === 'pancit / noodles' || c === 'pancit' || c === 'noodles') {
    return 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800';
  }
  // Vegetables
  if (c === 'vegetables' || c === 'veggie' || c === 'veggies') {
    return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800';
  }
  // Soup
  if (c === 'soup') {
    if (n.includes('bulalo') || n.includes('beef')) return 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800';
    if (n.includes('tinola') || n.includes('chicken')) return 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&q=80&w=800';
    if (n.includes('seafood')) return 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&q=80&w=800';
    return 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&q=80&w=800';
  }
  // Generic food fallback
  return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800';
}

// ===== SUPABASE MENU ITEMS LOADER =====
// Fetches live menu items from the Supabase menu_items table,
// replaces the hardcoded food & dessert entries in CAT, and re-renders the catalog.
async function loadMenuItemsFromSupabase() {
  try {
    const sb = window.supabaseClient || window.supabase;
    if (!sb) {
      console.warn('[Menu Loader] Supabase client not found. Keeping hardcoded food items.');
      return;
    }

    const { data: rows, error } = await sb
      .from('menu_items')
      .select('id, name, category, identify, ingredients, description, price_per_pax, is_available')
      .eq('is_available', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('[Menu Loader] Supabase error:', error.message);
      return;
    }

    if (!rows || rows.length === 0) {
      console.warn('[Menu Loader] No menu rows returned. Keeping hardcoded food items.');
      return;
    }

    // 1. Strip out hardcoded food, dessert, drink, decoration, and entertainment items
    CAT = CAT.filter(item =>
      item.cat !== 'food' && item.cat !== 'dessert' && item.cat !== 'drink' &&
      item.cat !== 'decoration' && item.cat !== 'entertainment'
    );

    // 2. Map each Supabase row → CAT item format
    const menuItems = rows.map(row => {
      let cat = 'food';
      if (row.identify === 'desserts') cat = 'dessert';
      else if (row.identify === 'drinks' || row.identify === 'drinks_package') cat = 'drink';
      else if (row.identify === 'decoration') cat = 'decoration';
      else if (row.identify === 'addon') cat = 'entertainment';

      const isDrink = cat === 'drink';
      const isDecorOrAddon = cat === 'decoration' || cat === 'entertainment';

      // For decorations/addons, ingredients field stores the pricingType ('fixed', 'per_character')
      const storedPricingType = (row.ingredients || '').trim();
      let allocationType, pricingType, ingredientList;

      if (isDecorOrAddon) {
        allocationType = storedPricingType || 'fixed';
        pricingType = storedPricingType || 'fixed';
        ingredientList = [];
      } else if (isDrink) {
        allocationType = (row.identify === 'drinks_package') ? 'per_5_pax' : 'per_10_pax';
        pricingType = allocationType;
        ingredientList = (row.identify !== 'drinks_package' && row.ingredients) ? row.ingredients.split(',').map(s => s.trim()) : [];
      } else {
        allocationType = 'per_pax';
        pricingType = 'per_pax';
        ingredientList = row.ingredients ? row.ingredients.split(',').map(s => s.trim()) : [];
      }

      return {
        id: `mi-sb-${row.id}`,
        supabaseId: row.id,
        identify: row.identify,
        name: row.name,
        cat: cat,
        subcategory: row.category,
        image: getFoodImage(row.category, row.name),
        price: parseFloat(row.price_per_pax) || 0,
        isPerPax: !isDrink && !isDecorOrAddon,
        allocationType,
        pricingType,
        desc: row.description || '',
        rating: 4.7,
        reviews: 0,
        ingredients: ingredientList
      };
    });

    // 3. Merge into CAT
    CAT.push(...menuItems);

    // 4. Re-render both catalog views
    renderFullCatalog();
    renderCat();

    console.log(`[Menu Loader] ✅ Loaded ${menuItems.length} menu items from Supabase.`);

  } catch (err) {
    console.error('[Menu Loader] Unexpected error:', err);
  }
}

// ===== SUPABASE PACKAGES LOADER =====
async function loadPackagesFromSupabase() {
  try {
    const sb = window.supabaseClient || window.supabase;
    if (!sb) { console.warn('[Pkg Loader] Supabase client not found.'); return; }

    // Load packages
    const { data: pkgRows, error: pkgErr } = await sb
      .from('premade_packages')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });
    if (pkgErr) { console.error('[Pkg Loader] Error loading packages:', pkgErr.message); return; }
    if (!pkgRows || pkgRows.length === 0) { console.warn('[Pkg Loader] No packages found in Supabase.'); return; }

    // Load all package items in one query
    const { data: itemRows, error: itemErr } = await sb
      .from('premade_package_items')
      .select('*')
      .order('display_order', { ascending: true });
    if (itemErr) { console.error('[Pkg Loader] Error loading package items:', itemErr.message); return; }

    // Build package objects
    const supabasePkgs = pkgRows.map(row => {
      const pkgItems = (itemRows || []).filter(i => i.package_id === row.id);
      const mainItems = pkgItems.filter(i => !i.is_freebie);
      const freebieItems = pkgItems.filter(i => i.is_freebie);

      // Resolve item names to CAT ids (best-effort, fallback to name)
      const resolveItemIds = (items) => items.map(pi => {
        const catItem = CAT.find(c => c.name.toLowerCase() === pi.item_name.toLowerCase());
        return catItem ? catItem.id : null;
      }).filter(Boolean);

      return {
        id: 'sb-pkg-' + row.slug,
        slug: row.slug,
        name: row.name,
        badge: row.badge || 'Majorly Set',
        pricingMode: row.pricing_mode,   // 'majorly_set' | 'per_head' | 'tiered'
        fixedPrice: parseFloat(row.fixed_price) || 0,
        fixedPax: parseInt(row.fixed_pax) || 0,
        pricePerHead: parseFloat(row.price_per_head) || 0,
        priceTiers: row.price_tiers || [],
        desc: row.description || '',
        theme: row.theme || '',
        occasion: row.occasion || 'Birthday',
        image: row.image_url || 'https://images.unsplash.com/photo-1464349095431-e9a21285b5ac?auto=format&fit=crop&q=80&w=800',
        rating: parseFloat(row.rating) || 4.8,
        reviews: parseInt(row.reviews) || 0,
        hidden: false,
        fromSupabase: true,
        // items list for display (all items)
        items: pkgItems.map(i => i.item_name),
        // item IDs resolved from CAT for workspace loading
        itemIds: resolveItemIds(mainItems),
        freeItemIds: resolveItemIds(mainItems.filter(i => i.is_free)),
        freebieItems: freebieItems.map(i => i.item_name),
        freebieItemIds: resolveItemIds(freebieItems),
      };
    });

    // Replace PKGS: keep hardcoded but hidden, add Supabase ones
    // Remove any previously loaded Supabase packages to avoid duplicates on reload
    PKGS = PKGS.filter(p => !p.fromSupabase);
    PKGS.push(...supabasePkgs);

    renderPkgs();
    console.log(`[Pkg Loader] ✅ Loaded ${supabasePkgs.length} package(s) from Supabase.`);
  } catch (err) {
    console.error('[Pkg Loader] Unexpected error:', err);
  }
}

// Auto-run when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // === DAY 4: SESSION EXPIRY CHECK ===
  // If a session exists, check if it's older than 7 days (604,800,000 ms)
  const sessionStart = localStorage.getItem('session_start');
  if (sessionStart) {
    const age = Date.now() - parseInt(sessionStart, 10);
    if (age > 7 * 24 * 60 * 60 * 1000) {
      console.log('[Auth] Session expired (older than 7 days). Logging out.');
      if (typeof executeLogOut === 'function') {
        executeLogOut();
        return; // Stop execution
      }
    }
  }

  // === RESTORE CUSTOM JWT ON PAGE LOAD ===
  // If the user was previously logged in with our custom auth system,
  // re-inject their JWT into the Supabase client so RLS policies work correctly.
  const savedToken = localStorage.getItem('supabase.auth.token');
  if (savedToken && window.supabaseClient && window.supabase && typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_ANON !== 'undefined') {
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
      global: { headers: { Authorization: `Bearer ${savedToken}` } }
    });
    console.log('[Auth] Custom JWT restored from localStorage.');
  }

  // Small delay so Supabase client has time to initialize from the inline script in index.html
  setTimeout(() => {
    // Run both loaders in parallel, then apply any pending modify-reservation
    // only AFTER both have finished so CAT has all food + equipment items.
    Promise.all([
      loadEquipmentFromSupabase(),
      loadMenuItemsFromSupabase().then(() => {
        // Load packages after menu items so item IDs can be resolved against CAT
        return loadPackagesFromSupabase();
      })
    ]).then(() => {
      if (window._pendingModifyRes) {
        const res = window._pendingModifyRes;
        window._pendingModifyRes = null;
        applyModifyResData(res);
      }
    });
  }, 600);
});

window.loadEquipmentFromSupabase = loadEquipmentFromSupabase;
window.loadMenuItemsFromSupabase = loadMenuItemsFromSupabase;
window.loadPackagesFromSupabase = loadPackagesFromSupabase;

// All packages now come from Supabase
let PKGS = [];

const DECOR_COMPONENTS = {
  'Entrance Stylist Setup': [
    { name: 'Entrance Arch Structure', cost: 5000 },
    { name: 'Fabric Drapes (100m)', cost: 3500 },
    { name: 'Floral Accents (Premium)', cost: 4000 },
    { name: 'Spotlight / Pinlight Set', cost: 2500 }
  ],
  'Balloon Setup': [
    { name: 'Latex Balloons (Bulk 500pcs)', cost: 1500 },
    { name: 'Balloon Ribbons & Sticks', cost: 800 },
    { name: 'Balloon Weights', cost: 500 },
    { name: 'Balloon Inflator Rental', cost: 2200 }
  ],
  'Balloon Drops Ceiling': [
    { name: 'Balloon Release Net (Giant)', cost: 2500 },
    { name: 'Balloon Mix (500pcs)', cost: 1500 },
    { name: 'Pull Cord & Rigging', cost: 1000 },
    { name: 'Ceiling Hooks / Clips', cost: 3000 }
  ],
  'Table Centerpiece': [
    { name: 'Crystal Vase Rental', cost: 300 },
    { name: 'Mirror Base', cost: 200 },
    { name: 'Fresh Flower Arrangement', cost: 500 },
    { name: 'Votive Candles (Set of 3)', cost: 200 }
  ],
  '2x4 Photo Standee': [
    { name: 'Large Format Printing', cost: 1500 },
    { name: 'Foamboard Backing', cost: 500 },
    { name: 'Collapsible Stand', cost: 500 }
  ],
  'Lights and Sound System': [
    { name: 'Amplifier & Mixer Combo', cost: 3500 },
    { name: 'Passive Speakers (Pair)', cost: 3000 },
    { name: 'Microphone Set (2 Wireless)', cost: 2000 }
  ]
};

// Load from localStorage if available
try {
  const savedCat = localStorage.getItem('halden_catalog');
  if (savedCat) {
    const parsed = JSON.parse(savedCat);
    if (parsed.length > 10) {
      const existingIds = new Set(parsed.map(c => c.id));
      const newItems = CAT.filter(c => !existingIds.has(c.id));
      CAT = [...parsed, ...newItems];
      
      // FORCIBLY REMOVE Same-Day Edit Video from cached memory
      CAT = CAT.filter(c => c.id !== 'ph3' && c.name !== 'Same-Day Edit Video');
      
      localStorage.setItem('halden_catalog', JSON.stringify(CAT));
    } else {
      localStorage.removeItem('halden_catalog');
    }
  } else {
    // If no cache, also ensure it's not in the base CAT
    CAT = CAT.filter(c => c.id !== 'ph3' && c.name !== 'Same-Day Edit Video');
  }
  // Packages are now exclusively loaded from Supabase. We no longer load from localStorage.
  localStorage.removeItem('halden_packages');
} catch (e) {
  console.error("Error loading custom catalog from localStorage", e);
}

let activePkg = null;
window.activeTier = null; // Type 3: selected pax-tier object for tiered packages
let cart = [];           // finalized packages only
let selectedCartIdx = null; // index of the currently selected cart item for checkout
let preferredMeetingTimes = []; // proposed meeting slots
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

  let items = PKGS.filter(p => !p.hidden);

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
    let priceDisplay = '';
    if (p.pricingMode === 'majorly_set' || p.pricingMode === 'majorly set') {
      priceDisplay = `&#8369;${(p.fixedPrice || 0).toLocaleString()} <span style="font-size:12px; font-weight:500; color:var(--text-dim);">fixed / ${p.fixedPax || 0} pax</span>`;
    } else if (p.pricingMode === 'tiered' && p.priceTiers && p.priceTiers.length > 0) {
      priceDisplay = `&#8369;${p.priceTiers[0].price.toLocaleString()} <span style="font-size:12px; font-weight:500; color:var(--text-dim);">starting</span>`;
    } else {
      priceDisplay = `&#8369;${(p.pricePerHead || 0).toLocaleString()} <span style="font-size:12px; font-weight:500; color:var(--text-dim);">/ pax</span>`;
    }

    return `
      <div class="cat-card pkg-catalog-card">
        <div class="cat-thumb" style="background:url('${p.image}') center/cover;height:180px;">
          <div class="pkg-cat-badge">${p.badge || 'Dynamically Set'}</div>
        </div>
        <div class="cat-info">
          <div class="cat-n">${p.name}</div>
          <div class="cat-d">${p.desc}</div>
          <ul class="pkg-inc-list">${p.items.slice(0, 6).map(it => `<li>${it}</li>`).join('')}${p.items.length > 6 ? `<li style="list-style:none; opacity:0.6; padding-left:0;">+ ${p.items.length - 6} more items...</li>` : ''}</ul>
          <div class="pkg-footer-row" style="margin-top:15px;">
            <div class="cat-p">${priceDisplay}</div>
            <button class="btn-add" onclick="openPkgModal('${p.id}')">View Details</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

function getDynamicPrice(item, pax) {
  if (item.cat === 'drink' && item.identify !== 'drinks_package') return 0;
  if (item.isFree) return 0;
  
  const p = parseInt(pax) || 0;
  if (p <= 0) return item.price;
  
  if (item.isIndividual) return item.price * p;
  if (item.batchSize) return Math.ceil(p / item.batchSize) * item.price;
  
  const alloc = item.allocationType || item.pricingType;
  
  if (alloc === 'included') return 0;
  if (alloc === 'per_pax') return item.price * p;
  if (alloc === 'per_5_pax') return Math.ceil(p / 5) * item.price;
  if (alloc === 'per_10_pax') return Math.ceil(p / 10) * item.price;
  if (alloc === 'per_20_pax') return Math.ceil(p / 20) * item.price;
  
  if (alloc === 'per_menu_item') {
    const foodItemCount = customPkgItems.filter(i => !i.isAutoAdded && (i.cat === 'food' || i.cat === 'dessert')).length;
    return item.price * (foodItemCount > 0 ? foodItemCount : 1);
  }
  
  if (alloc === 'per_character') {
    return item.price * (p > 0 ? p : 1);
  }
  
  return item.price;
}
window.getDynamicPrice = getDynamicPrice;

function getBatchInfo(item, pax) {
  if (!item) return '';
  const p = parseInt(pax) || 0;
  
  const alloc = item.allocationType || item.pricingType;
  
  if (alloc === 'included') return 'included';
  if (alloc === 'per_menu_item') {
    const foodItemCount = customPkgItems.filter(i => !i.isAutoAdded && (i.cat === 'food' || i.cat === 'dessert')).length;
    return `per menu item (${foodItemCount}x)`;
  }
  if (alloc === 'per_pax' || item.isIndividual) return 'per pax';
  if (alloc === 'per_5_pax') return `per 5 pax (${Math.ceil(p / 5) || 1} units for ${p || 5} pax)`;
  if (alloc === 'per_10_pax') return `per 10 pax (${Math.ceil(p / 10) || 1} batches for ${p || 10} pax)`;
  if (alloc === 'per_20_pax') return `per 20 pax (${Math.ceil(p / 20) || 1} batches for ${p || 20} pax)`;
  if (alloc === 'per_character') return `per character (₱${item.price.toLocaleString()} each)`;
  
  if (item.batchSize) return `batch of ${item.batchSize}`;
  
  return 'flat rate (fixed)';
}

// ===== CATALOG =====
function renderCat() {
  const grid = document.getElementById('cat-grid');
  if (!grid) return;
  let items = curCat === 'all' ? CAT : CAT.filter(i => i.cat === curCat);

  const noteEl = document.getElementById('free-choice-note');
  if (noteEl) {
    const hasFreeChoice = customPkgItems.some(c => c.name === 'Free Choices of Food From Menu');
    noteEl.style.display = (activePkg && hasFreeChoice) ? 'block' : 'none';
  }
  
  const hasUnlimitedDrinks = customPkgItems.some(c => c.identify === 'drinks_package');
  if (!hasUnlimitedDrinks) {
    items = items.filter(i => !i.hidden && !(i.cat === 'drink' && i.identify !== 'drinks_package'));
  } else {
    items = items.filter(i => !i.hidden);
  }
  // Hide Free Choices placeholder from catalog view
  items = items.filter(i => i.name !== 'Free Choices of Food From Menu');

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
    const batchInfo = getBatchInfo(item, p);
    return `
      <div class="cat-card ${isPick ? 'ai-pick' : ''} ${isDim ? 'dimmed' : ''}" onclick="openDishModal('${item.id}')" style="padding:16px;">
        <div class="cat-info">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div class="cat-cat-lbl" style="margin:0;">${(item.subcategory || item.cat).toUpperCase()}</div>
            ${isPick ? '<span style="font-size:10px; color:var(--gold); font-weight:700;"> AI RECOMMENDED</span>' : ''}
          </div>
          <div class="cat-n">${item.name}</div>
          <div class="cat-d">${item.desc}</div>
          ${(item.cat === 'drink' && item.identify !== 'drinks_package') ? '' : `<div class="cat-p" style="color:var(--primary); font-weight:700; margin-top:8px;">&#8369;${dp.toLocaleString()} <span style="font-size:10px; color:var(--text-dim); font-weight:400;">${batchInfo}</span></div>`}
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
  // Hide the unlimited drinks package and Free Choice placeholder from the full catalog view
  items = items.filter(i => !i.hidden && i.identify !== 'drinks_package' && i.name !== 'Free Choices of Food From Menu');

  // Search Filter
  if (fullSearch.trim()) {
    const q = fullSearch.toLowerCase();
    items = items.filter(i => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q));
  }
  grid.innerHTML = items.map(item => {
    const pax = document.getElementById('cpkg-pax')?.value || 0;
    const p = parseInt(pax) || 0;
    const dp = getDynamicPrice(item, p);
    const batchInfo = getBatchInfo(item, p);
    return `
      <div class="full-cat-card" onclick="openDishModal('${item.id}')" style="padding:20px;">
        <div class="full-cat-info">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <div class="cat-cat-lbl">${(item.subcategory || item.cat).toUpperCase()}</div>
          </div>
          <div class="full-cat-name">${item.name}</div>
          ${(item.cat === 'drink' && item.identify !== 'drinks_package') ? '' : `<div class="full-cat-price" style="color:var(--primary); font-weight:700; margin-bottom:8px;">&#8369;${dp.toLocaleString()} <span style="font-size:10px; color:var(--text-dim); font-weight:400;">${batchInfo}</span></div>`}
          <div class="full-cat-desc">${item.desc}</div>
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

  document.getElementById('pm-title').textContent = p.name;
  document.getElementById('pm-desc').textContent = p.desc;
  document.getElementById('pm-badge').textContent = p.badge || 'MAJORITY SET';
  document.getElementById('pm-theme').textContent = p.theme;
  document.getElementById('pm-occasion').textContent = p.occasion;
  const btn = document.getElementById('pm-select-btn');
  const tierSelector = document.getElementById('pm-tier-selector');

  const priceEl = document.getElementById('pm-price');
  const priceSubEl = document.getElementById('pm-price-sub');

  if (p.pricingMode === 'tiered') {
    if (tierSelector) tierSelector.style.display = 'block';
    const select = document.getElementById('pm-tier-select');
    if (select) {
      select.innerHTML = p.priceTiers.map((t, idx) => `<option value="${idx}">${t.label} — \u20b1${t.price.toLocaleString()}</option>`).join('');
    }
    window.pmSelectedTier = p.priceTiers[0];
    
    // Update main price block
    priceEl.textContent = '\u20b1' + p.priceTiers[0].price.toLocaleString();
    priceSubEl.textContent = 'fixed for ' + p.priceTiers[0].label;
    
    btn.textContent = 'Select Package';
    btn.onclick = () => { applyPremadePkg(p.id, window.pmSelectedTier); closePkgModal(); };
  } else if (p.pricingMode === 'majorly_set') {
    if (tierSelector) tierSelector.style.display = 'none';
    priceEl.textContent = '\u20b1' + (p.fixedPrice || 0).toLocaleString();
    priceSubEl.textContent = 'fixed for ' + (p.fixedPax || 0) + ' pax';
    
    btn.textContent = 'Select this Package';
    btn.onclick = () => { applyPremadePkg(p.id); closePkgModal(); };
  } else {
    if (tierSelector) tierSelector.style.display = 'none';
    priceEl.textContent = '\u20b1' + (p.pricePerHead || 0).toLocaleString();
    priceSubEl.textContent = 'per pax';
    
    btn.textContent = 'Select and Customize';
    btn.onclick = () => { applyPremadePkg(p.id); closePkgModal(); };
  }

  // Grouping helper
  const getGroup = (name) => {
    const item = CAT.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (!item) return 'Other';
    const id = item.identify || item.cat;
    if (id === 'meals') return 'Food';
    if (id === 'desserts' || id === 'dessert') return 'Desserts';
    if (id === 'drinks' || id === 'drinks_package' || id === 'drink') return 'Drinks';
    if (id === 'equipment') return 'Equipment';
    if (id === 'decoration') return 'Decorations';
    if (id === 'addon' || id === 'entertainment') return 'Add-ons';
    return 'Other';
  };
  const groupOrder = { 'Food': 1, 'Desserts': 2, 'Drinks': 3, 'Equipment': 4, 'Decorations': 5, 'Add-ons': 6, 'Other': 7 };

  const getGroupIcon = (g) => {
    switch (g) {
      case 'Food': return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 13a10 10 0 0 0-20 0M2 13h20M12 3v2"/></svg>';
      case 'Desserts': return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16h16"/><path d="M4 12h16"/><path d="M12 3l-1.5 4"/></svg>';
      case 'Drinks': return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 5h12l-1.5 16h-9z"/><path d="M8 2l2 3M16 2l-2 3"/></svg>';
      case 'Equipment': return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>';
      case 'Decorations': return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>';
      case 'Add-ons': return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>';
      default: return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/></svg>';
    }
  };

  const renderGroupedItems = (names, isFreebie = false) => {
    const groups = {};
    names.forEach(n => {
      const g = getGroup(n);
      if (!groups[g]) groups[g] = [];
      groups[g].push(n);
    });

    const sortedGroups = Object.keys(groups).sort((a, b) => groupOrder[a] - groupOrder[b]);

    let html = '';
    sortedGroups.forEach(g => {
      html += `
        <div style="display:flex; align-items:center; border-bottom: 1px dashed rgba(203,161,83,0.3); padding: 18px 0;">
          <div style="display:flex; align-items:center; width: 150px; gap: 15px; flex-shrink:0;">
            <div style="width:40px; height:40px; border-radius:50%; border:1px solid rgba(203,161,83,0.4); display:flex; align-items:center; justify-content:center; color:#cba153;">
              ${getGroupIcon(g)}
            </div>
            <div class="pm-cat-title" style="font-weight:800; color:#3d2b1a; font-size:12px; letter-spacing:1px; text-transform:uppercase;">${g}</div>
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:10px; flex:1;">
      `;
      groups[g].sort((a,b) => a.localeCompare(b)).forEach(it => {
        const checkIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="#cba153" style="min-width:14px;"><circle cx="12" cy="12" r="12"/><path d="M7 12l3 3 7-7" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        const pillBg = isFreebie ? '#f9f1e1' : '#fdfbf7';
        const pillBorder = isFreebie ? 'border: 1px solid #cba153;' : 'border: 1px solid rgba(203,161,83,0.25);';
        const pillClass = isFreebie ? 'pm-pill pm-pill-freebie' : 'pm-pill';
        
        html += `
          <span class="${pillClass}" style="display:inline-flex; align-items:center; gap:8px; padding: 6px 14px; border-radius: 20px; font-size:13px; color:#5c4f44; background:${pillBg}; ${pillBorder}">
            ${checkIcon}
            ${it}
          </span>
        `;
      });
      html += `</div></div>`;
    });
    return html;
  };

  // Main items
  const mainItemNames = p.items ? p.items.filter(it => !((p.freebieItems || []).includes(it))) : [];
  const itemGrid = document.getElementById('pm-items');
  itemGrid.className = '';
  itemGrid.innerHTML = renderGroupedItems(mainItemNames, false);

  // Freebies section
  let freebiesHtml = '';
  if (p.freebieItems && p.freebieItems.length > 0) {
    freebiesHtml = `
      <div style="margin-top:20px;">
        <div style="position:relative; text-align:center; margin-bottom:10px; margin-top: 30px;">
          <div style="position:absolute; top:50%; left:0; right:0; height:1px; background:rgba(203,161,83,0.4); z-index:1;"></div>
          <span style="position:relative; z-index:2; background:#fcf9f2; padding:0 15px; color:#cba153; font-size:11px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase;">FREEBIES INCLUDED</span>
        </div>
        ${renderGroupedItems(p.freebieItems, true)}
      </div>`;
  }

  // Inject freebies after pm-items
  let freebiesEl = document.getElementById('pm-freebies');
  if (!freebiesEl) {
    freebiesEl = document.createElement('div');
    freebiesEl.id = 'pm-freebies';
    itemGrid.parentNode.insertBefore(freebiesEl, itemGrid.nextSibling);
  }
  freebiesEl.innerHTML = freebiesHtml;

  document.getElementById('pkg-modal-overlay').classList.add('on');
  document.body.style.overflow = 'hidden';
}
function closePkgModal() {
  document.getElementById('pkg-modal-overlay').classList.remove('on');
  document.body.style.overflow = '';
  document.body.style.overflow = '';
}
window.openPkgModal = openPkgModal;
window.closePkgModal = closePkgModal;

window.onPmTierChange = function () {
  const p = PKGS.find(x => x.name === document.getElementById('pm-title').textContent);
  if (!p || p.pricingMode !== 'tiered') return;
  const select = document.getElementById('pm-tier-select');
  const tier = p.priceTiers[select.value];
  
  const priceEl = document.getElementById('pm-price');
  const priceSubEl = document.getElementById('pm-price-sub');
  
  if (priceEl) priceEl.textContent = '\u20b1' + tier.price.toLocaleString();
  if (priceSubEl) priceSubEl.textContent = 'fixed for ' + tier.label;
  
  window.pmSelectedTier = tier;
};

function applyPremadePkg(id, tier = null) {
  const p = PKGS.find(x => x.id === id);
  if (!p) return;

  activePkg = p;
  window.activeTier = tier;
  document.querySelector('.cpkg-title').textContent = p.name;

  // Fill text fields
  const themeEl = document.getElementById('cpkg-theme');
  const occEl = document.getElementById('cpkg-occasion');
  const paxEl = document.getElementById('cpkg-pax');
  if (themeEl) themeEl.value = p.theme;
  if (occEl) occEl.value = p.occasion;
  if (tier && paxEl) paxEl.value = tier.pax;
  // For majorly_set: lock pax to fixedPax
  if (p.pricingMode === 'majorly_set' && paxEl && p.fixedPax) {
    paxEl.value = p.fixedPax;
    paxEl.readOnly = true;
    paxEl.title = 'Pax is fixed for this package';
  } else if (paxEl) {
    paxEl.readOnly = false;
    paxEl.title = '';
  }

  // Add items to package
  customPkgItems = [];
  const freeIds = new Set(p.freeItemIds || []);
  const freebieIds = new Set(p.freebieItemIds || []);

  p.itemIds.forEach(iid => {
    const item = CAT.find(i => i.id === iid);
    if (item) {
      const newItem = { ...item };
      if (freeIds.has(iid) || freebieIds.has(iid)) {
        newItem.isFree = true;
      } else if (item.name.toLowerCase().includes('rice') ||
        (item.cat === 'dessert' && item.price < 1500)) {
        newItem.isFree = true;
      }
      customPkgItems.push(newItem);
    }
  });

  // Add freebie items too (shown as free)
  (p.freebieItemIds || []).forEach(iid => {
    if (customPkgItems.find(c => c.id === iid)) return; // already added
    const item = CAT.find(i => i.id === iid);
    if (item) {
      customPkgItems.push({ ...item, isFree: true, isFreebie: true });
    }
  });

  renderCat();
  renderCustomPkg();
  updateDawContextBar();

  // Scroll to workspace
  go('#catalog');

  // Show a mini notification
  if (typeof openErrorModal === 'function') {
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

window.jumpFullCat = function (cat) {
  curFullCat = cat;
  document.querySelectorAll('#fbtns-full .fb').forEach(b => {
    const matches = b.getAttribute('onclick')?.includes(`'${cat}'`) || (cat === 'all' && b.textContent.trim() === 'All');
    b.classList.toggle('active', !!matches);
  });
  renderFullCatalog();
  go('#full-catalog');
};
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
    if (customPkgItems[idx].isAutoAdded) {
      if (typeof openErrorModal === 'function') openErrorModal("This item was automatically allocated by the system and cannot be manually removed.");
      else alert("This item was automatically allocated by the system and cannot be manually removed.");
      return;
    }

    if (activePkg && !customPkgItems[idx].isFreeChoiceApplied) {
      const isSpecificDrink = customPkgItems[idx].cat === 'drink' && customPkgItems[idx].identify !== 'drinks_package';
      if (!isSpecificDrink) {
        if (typeof openErrorModal === 'function') openErrorModal("You cannot remove items from a pre-made package.");
        else alert("You cannot remove items from a pre-made package.");
        return;
      }
    }

    const removedItem = customPkgItems[idx];
    customPkgItems.splice(idx, 1);
    
    if (removedItem.isFreeChoiceApplied) {
      const placeholder = CAT.find(i => i.name === 'Free Choices of Food From Menu');
      if (placeholder) customPkgItems.push({...placeholder, isFree: true});
    }
    
    // If we removed drinks_package, remove all individual drinks too
    if (item.identify === 'drinks_package') {
      customPkgItems = customPkgItems.filter(c => !(c.cat === 'drink' && c.identify !== 'drinks_package'));
    }
  } else {
    // Check max drinks
    if (item.cat === 'drink' && item.identify !== 'drinks_package') {
      const currentDrinks = customPkgItems.filter(c => c.cat === 'drink' && c.identify !== 'drinks_package');
      if (currentDrinks.length >= 2) {
        if (typeof openErrorModal === 'function') openErrorModal("You can only select up to 2 types of drinks.");
        else alert("You can only select up to 2 types of drinks.");
        return;
      }
    }

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
    
    const freeChoiceIdx = customPkgItems.findIndex(c => c.name === 'Free Choices of Food From Menu');
    if (freeChoiceIdx > -1 && ['food', 'dessert'].includes(item.cat)) {
      customPkgItems.splice(freeChoiceIdx, 1);
      customPkgItems.push({...item, isFree: true, isFreeChoiceApplied: true});
      if (typeof openErrorModal === 'function') openErrorModal(`You've used your free choice for: ${item.name}`);
    } else {
      if (activePkg) {
        const isSpecificDrink = item.cat === 'drink' && item.identify !== 'drinks_package';
        if (!isSpecificDrink) {
          if (typeof openErrorModal === 'function') openErrorModal("You cannot add extra items to a pre-made package.");
          else alert("You cannot add extra items to a pre-made package.");
          return;
        }
      }
      customPkgItems.push(item);
    }
  }
  renderCat(); renderCustomPkg();
}

function removePkgItem(id) {
  const item = customPkgItems.find(c => c.id === id);
  if (item && item.isAutoAdded) {
    if (typeof openErrorModal === 'function') openErrorModal("This item was automatically allocated by the system and cannot be manually removed.");
    else alert("This item was automatically allocated by the system and cannot be manually removed.");
    return;
  }
  if (activePkg && item && !item.isFreeChoiceApplied) {
    if (!(item.cat === 'drink' && item.identify !== 'drinks_package')) {
      if (typeof openErrorModal === 'function') openErrorModal("You cannot remove items from a pre-made package.");
      else alert("You cannot remove items from a pre-made package.");
      return;
    }
  }
  if (item && item.isFreeChoiceApplied) {
    const placeholder = CAT.find(i => i.name === 'Free Choices of Food From Menu');
    if (placeholder) customPkgItems.push({...placeholder, isFree: true});
  }
  customPkgItems = customPkgItems.filter(c => c.id !== id);
  
  if (item && item.identify === 'drinks_package') {
    customPkgItems = customPkgItems.filter(c => !(c.cat === 'drink' && c.identify !== 'drinks_package'));
  }
  
  renderCat(); renderCustomPkg();
}
window.toggleItem = toggleItem;
window.removePkgItem = removePkgItem;
let editingPkgName = "";

function openNamePkgModal() {
  const overlay = document.getElementById('name-pkg-modal-overlay');
  const input = document.getElementById('cpkg-name-input');
  if (!overlay || !input) return;

  const occasion = window.getSmartV('cpkg-occasion') || "";
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
  const getV = window.getSmartV;

  const desc = getV('cpkg-desc');
  const theme = getV('cpkg-theme');
  const pax = getV('cpkg-pax');
  const date = getV('cpkg-date');
  const occasion = getV('cpkg-occasion');
  const venueLocation = getV('cpkg-venue-location');
  const venue = getV('cpkg-venue');
  const timeframe = getV('cpkg-timeframe');

  if (!desc || !theme || !pax || !date || !occasion || !venueLocation || !venue || !timeframe) {
    const msg = 'Please fill in all event details including Date, Time Frame, and Venue Location before finalizing your package.';
    if (typeof openErrorModal === 'function') openErrorModal(msg);
    else alert(msg);
    return;
  }

  let errors = [];

  // ── PAX validation ──
  const paxNum = parseInt(pax);
  if (isNaN(paxNum) || paxNum < 10) {
    errors.push('Guest count too few. It is not efficient to book a catering service for such a small number of people. Please enter at least 10 guests.');
  } else if (paxNum > 150) {
    errors.push('The business cannot cater to a guest count above 150. Please reconsider and lower your guest count.');
  }

  // ── VIP count validation ──
  const vipEnabled = document.getElementById('cpkg-vip-check')?.checked;
  const vipCountStr = document.getElementById('cpkg-vip-count')?.value;
  const vipCount = parseInt(vipCountStr) || 0;
  if (vipEnabled) {
    if (!vipCountStr || vipCount <= 0) {
      errors.push('You have chosen to include VIPs but have not specified the number of VIPs. Please enter a valid VIP count.');
    } else if (vipCount > 20) {
      errors.push('VIPs cannot be above 20. Please reduce the VIP count to 20 or fewer.');
    }
  }

  // ── Meeting slot validation ──
  if (typeof preferredMeetingTimes !== 'undefined' && preferredMeetingTimes.length === 0) {
    errors.push('You must add at least one preferred time slot for a meeting before you can finalize your package.');
  }

  // ── Event date validation ──
  const eventDate = new Date(date + 'T00:00:00');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();
  const eventDateMs = eventDate.getTime();

  if (isNaN(eventDateMs) || eventDateMs < todayMs) {
    errors.push('The event date you selected has already passed. Please select a valid future date.');
  } else {
    const minDaysAhead = 10.5; // 1.5 weeks
    const msPerDay = 86400000;
    if ((eventDateMs - todayMs) < minDaysAhead * msPerDay) {
      errors.push('Your reservation is happening too soon. The business requires at least 2 weeks of preparation for your event and thus cannot cater to your event on this date. Please select a later date.');
    }
    const maxDaysAhead = 60; // ~2 months
    if ((eventDateMs - todayMs) > maxDaysAhead * msPerDay) {
      errors.push('The event date you selected is far too long into the future. The business is not accepting bookings that are more than 2 months away at this time. Please select a date within 2 months from now.');
    }
  }

  // ── Timeframe validation (min 2 hours) ──
  let tfStart = null, tfEnd = null;
  const tfParts = timeframe.split('-').map(s => s.trim());
  if (tfParts.length < 2) {
    errors.push('Please select a valid event time frame with a start and end time.');
  } else {
    const toMinutes = (t) => {
      const [h, m] = t.split(':').map(Number);
      return (isNaN(h) || isNaN(m)) ? null : h * 60 + m;
    };
    tfStart = toMinutes(tfParts[0]);
    tfEnd = toMinutes(tfParts[1]);
    if (tfStart === null || tfEnd === null) {
      errors.push('Please select a valid event time frame with a start and end time.');
    } else {
      const tfDuration = tfEnd - tfStart;
      if (tfDuration < 120) {
        errors.push('The event time frame is a little too short for an event. Please make it reasonably longer for the service to be worth it. (Minimum: 2 hours)');
      }
    }
  }

  // ── Strict category validation ──
  const hasFood = customPkgItems.some(i => i.cat === 'food' || i.cat === 'dessert');
  const hasEquip = customPkgItems.some(i => i.cat === 'equipment' || i.cat === 'decoration');
  const hasUnlimitedDrinks = customPkgItems.some(i => i.identify === 'drinks_package');
  const hasSpecificDrink = customPkgItems.some(i => i.cat === 'drink' && i.identify !== 'drinks_package');

  if (!hasFood || !hasEquip) {
    errors.push('Food and Equipment selections are absolutely required. Please select at least one item from each category before finalizing.');
  }
  if (!hasUnlimitedDrinks) {
    errors.push('An Unlimited Drinks package is required for all events. Please add the Unlimited Drinks item from the Drinks tab before finalizing.');
  } else if (!hasSpecificDrink) {
    errors.push('You have selected the Unlimited Drinks package, but you must also select at least one specific type of drink to serve. Please add your drink choices from the Drinks tab.');
  }

  if (errors.length > 0) {
    if (typeof openErrorModal === 'function') openErrorModal(errors.join(' also '));
    else alert(errors.join('\n\n'));
    return;
  }

  // ── Auth gate — must be logged in to finalize (runs AFTER all validation passes) ──
  if (!currentUser) {
    window.pendingFinalize = true;
    openAuth();
    showAuthMsg('login-msg', 'success', 'Please log in or create an account to save and finalize your package. Your selections will be preserved.');
    return;
  }

  // ── Check conflicts (3-day buffer and same-day capacity) ──
  (async () => {
    try {
      const sb = window.supabaseClient || window.supabase;
      if (sb) {
        const { data: approvedRes, error } = await sb
          .from('reservations')
          .select('date, timeframe, status')
          .in('status', ['approved', 'confirmed']);
          
        if (!error && approvedRes) {
          const msPerDay = 86400000;
          
          // 1. Check 3-day buffer rule against ANY approved reservation
          for (const res of approvedRes) {
            const resDate = new Date(res.date);
            if (!isNaN(resDate.getTime())) {
              const diffDays = Math.abs(resDate.getTime() - eventDateMs) / msPerDay;
              if (diffDays <= 3) {
                if (typeof openErrorModal === 'function') {
                  openErrorModal('The date chosen is too close to an approved reservation and thus is not available to be booked. Please change the date.');
                } else {
                  alert('The date chosen is too close to an approved reservation and thus is not available to be booked. Please change the date.');
                }
                return;
              }
            }
          }
          
          // 2. We can keep the same-day/timeframe logic just in case, though the 3-day buffer 
          // implicitly blocks same-day bookings anyway since diffDays = 0 <= 3.
        }
      }
    } catch (e) {
      console.warn('Could not check reservation conflicts:', e);
      // Allow through if Firestore check fails — don't block user unnecessarily
    }

    // All validations passed — open the name modal
    openNamePkgModal();
  })();
}


function finalizePackageInternal(name) {
  const getV = window.getSmartV;
  const desc = getV('cpkg-desc');
  const theme = getV('cpkg-theme');
  const pax = getV('cpkg-pax');
  const date = getV('cpkg-date');
  const occasion = getV('cpkg-occasion');
  const venueLocation = getV('cpkg-venue-location');
  const venue = getV('cpkg-venue');
  const timeframe = getV('cpkg-timeframe');

  let total = 0;
  if (activePkg) {
    if (activePkg.pricingMode === 'tiered' && window.activeTier) {
      total = window.activeTier.price;
    } else if (activePkg.pricingMode === 'majorly_set' || activePkg.pricingMode === 'majorly set') {
      total = activePkg.fixedPrice || 0;
      customPkgItems.forEach(item => {
        if (!activePkg.itemIds.includes(item.id) && !item.isFree) {
          total += getDynamicPrice(item, parseInt(pax));
        }
      });
    } else {
      total = (activePkg.pricePerHead || 0) * parseInt(pax);
      customPkgItems.forEach(item => {
        if (!activePkg.itemIds.includes(item.id) && !item.isFree) {
          total += getDynamicPrice(item, parseInt(pax));
        }
      });
    }
  } else {
    total = customPkgItems.reduce((s, i) => s + getDynamicPrice(i, pax), 0);
  }

  const summary = {
    id: 'custom_' + Date.now(),
    isCustom: true,
    pricingMode: activePkg?.pricingMode || 'item-based',
    activePkgId: activePkg?.id || null,
    selectedTier: window.activeTier || null,
    pricePerHead: activePkg?.pricePerHead || 0,
    name: name.trim(),
    desc, theme, pax, date, time: timeframe, occasion, venue, venueLocation,
    isVIP: document.getElementById('cpkg-vip-check')?.checked || false,
    vipCount: parseInt(document.getElementById('cpkg-vip-count')?.value) || 0,
    vipService: document.getElementById('cpkg-vip-service')?.value || '',
    meetingTimes: [...preferredMeetingTimes],
    items: customPkgItems.map(i => ({ ...i, snapshotPrice: getDynamicPrice(i, pax) })),
    total,
    price: total,
    icon: ''
  };

  if (cart.length >= 2) {
    if (typeof openErrorModal === 'function') openErrorModal('Your cart already has 2 packages. Please remove or checkout a package before adding another.');
    else alert('Your cart already has 2 packages. Please remove or checkout one first.');
    return;
  }

  cart.push(summary);
  saveCartToSupabase();
  renderCart();
  const drawer = document.getElementById('cart-drawer');
  if (drawer) drawer.classList.add('open');

  // Full reset — clear all state so the workspace is completely blank
  customPkgItems = [];
  activePkg = null;
  window.activeTier = null;
  preferredMeetingTimes = [];
  renderMeetingTimes();

  const titleEl = document.querySelector('.cpkg-title');
  if (titleEl) titleEl.textContent = 'Custom Package';

  ['cpkg-desc', 'cpkg-theme', 'cpkg-pax', 'cpkg-date', 'cpkg-timeframe', 'cpkg-occasion', 'cpkg-venue-location', 'cpkg-venue', 'cpkg-budget'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  // Reset VIP fields
  const vipCheck = document.getElementById('cpkg-vip-check');
  if (vipCheck) { vipCheck.checked = false; toggleVIPFields(); }

  renderCustomPkg();  // auto-allocator will see 0 pax + empty items → no system additions
  renderCat();

  // Close items view if open
  const panel = document.getElementById('cpkg-panel');
  const view = document.getElementById('cpkg-selected-items-view');
  if (panel) panel.classList.remove('view-items-open');
  if (view) view.classList.remove('open');

  console.log('Finalize successful');
}


function runEquipmentAutoAllocation() {
  if (activePkg) return;
  if (window._blockAutoAlloc) return;

  const pax = document.getElementById('cpkg-pax')?.value || 0;
  const pCount = parseInt(pax) || 0;

  customPkgItems = customPkgItems.filter(item => !item.isAutoAdded);

  if (pCount <= 0 && customPkgItems.length === 0) {
    renderAutoAllocations([]);
    return;
  }

  const autoAdded = [];

  const addAutoItem = (name, reason) => {
    if (customPkgItems.find(i => i.name === name)) return;
    const catItem = CAT.find(i => i.name === name);
    if (catItem) {
      const cloned = { ...catItem, isAutoAdded: true, autoReason: reason };
      customPkgItems.push(cloned);
      autoAdded.push(cloned);
    }
  };

  if (pCount > 0) {
    ['Tiffany Chair', 'Round Banquet Table (60")', 'Table Cloth', 'Table Runner',
      'Chair Cover', 'Cloth Napkin', 'Dinner Plate', 'Rice Bowl', 'Spoon', 'Fork', 'Water Glass']
      .forEach(n => addAutoItem(n, 'Auto-allocated based on guest count.'));
  }

  let foodCount = 0, hasSoup = false, hasDessert = false, hasSteak = false, hasSalad = false, hasCoffee = false;
  customPkgItems.forEach(i => {
    if (!i.isAutoAdded && (i.cat === 'food' || i.cat === 'dessert')) foodCount++;
    if (i.subcategory === 'Soup') hasSoup = true;
    if (i.cat === 'dessert') hasDessert = true;
    const n = i.name.toLowerCase();
    if (n.includes('steak') || n.includes('roast') || n.includes('lengua')) hasSteak = true;
    if (n.includes('salad') || n.includes('appetizer')) hasSalad = true;
    if (n.includes('coffee')) hasCoffee = true;
  });

  if (foodCount > 0) {
    ['Serving Spoon', 'Serving Fork', 'Serving Tray', 'Food Pan (Full Size)',
      'Chafing Dish', 'Chafing Dish Lid', 'Serving Tongs']
      .forEach(n => addAutoItem(n, `Auto-allocated for ${foodCount} menu item(s).`));
  }
  if (hasSoup) { addAutoItem('Soup Bowl', 'Required for soup.'); addAutoItem('Soup Spoon', 'Required for soup.'); }
  if (hasDessert) { addAutoItem('Dessert Plate', 'Required for dessert.'); addAutoItem('Teaspoon', 'Required for dessert.'); }
  if (hasSteak) addAutoItem('Dinner Knife', 'Required for meat entrées.');
  if (hasSalad) addAutoItem('Salad Plate', 'Required for salad/appetizer.');
  if (hasCoffee) addAutoItem('Coffee Cup', 'Required for coffee service.');

  renderAutoAllocations(autoAdded);
}

function renderAutoAllocations(autoAdded) {
  const fab = document.getElementById('auto-alloc-fab');
  const badge = document.getElementById('auto-alloc-badge');
  const list = document.getElementById('auto-alloc-list');
  if (!fab || !list) return;

  if (autoAdded.length === 0) {
    fab.style.display = 'none';
    list.innerHTML = '';
    return;
  }

  fab.style.display = 'flex';
  if (badge) badge.textContent = autoAdded.length;
  
  list.innerHTML = autoAdded.map(item => `
    <div style="display:flex; justify-content:space-between; align-items:center; background:var(--cream); padding:10px; border-radius:8px; border:1px solid var(--border);">
      <div>
        <div style="font-weight:700; font-size:13px; color:var(--text);">${item.name}</div>
        <div style="font-size:11px; color:var(--text-dim); margin-top:2px;">${item.autoReason}</div>
      </div>
      <div style="background:rgba(212,175,55,0.1); color:var(--gold); font-size:10px; font-weight:700; padding:4px 8px; border-radius:4px;">
        AUTO
      </div>
    </div>
  `).join('');
}

window.openAutoAllocModal = function() {
  const overlay = document.getElementById('auto-alloc-overlay');
  const modal = document.getElementById('auto-alloc-modal');
  if (overlay) overlay.style.display = 'block';
  if (modal) modal.classList.add('open');
}

window.closeAutoAllocModal = function() {
  const overlay = document.getElementById('auto-alloc-overlay');
  const modal = document.getElementById('auto-alloc-modal');
  if (overlay) overlay.style.display = 'none';
  if (modal) modal.classList.remove('open');
}

function renderCustomPkg() {
  runEquipmentAutoAllocation();
  const tot = document.getElementById('cpkg-total');
  const cnt = document.getElementById('cpkg-count');
  if (!tot || !cnt) return;

  const pax = document.getElementById('cpkg-pax')?.value || 0;
  const pCount = parseInt(pax) || 0;

  let totalAmt = 0;
  if (activePkg) {
    if (activePkg.pricingMode === 'tiered' && window.activeTier) {
      totalAmt = window.activeTier.price;
    } else if (activePkg.pricingMode === 'majorly_set' || activePkg.pricingMode === 'majorly set') {
      totalAmt = activePkg.fixedPrice || 0;
      // Add cost for items that are NOT part of the original package template
      customPkgItems.forEach(item => {
        const isOriginal = activePkg.itemIds.includes(item.id);
        if (!isOriginal && !item.isFree) {
          totalAmt += getDynamicPrice(item, pCount);
        }
      });
    } else {
      // Fixed per-head pricing for active package
      totalAmt = (activePkg.pricePerHead || 0) * pCount;
      // Add cost for items that are NOT part of the original package template
      customPkgItems.forEach(item => {
        // Check if item is in the original package template
        const isOriginal = activePkg.itemIds.includes(item.id);
        if (!isOriginal && !item.isFree) {
          totalAmt += getDynamicPrice(item, pCount);
        }
      });
    }
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
        } else if (item.cat === 'drink' && item.identify !== 'drinks_package') {
          priceDisplay = '<span style="color:var(--primary); font-size:11px; font-weight:700; text-transform:uppercase;">Included</span>';
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
function selectCartPkg(idx) {
  if (selectedCartIdx === idx) {
    selectedCartIdx = null; // deselect if clicking again
  } else {
    selectedCartIdx = idx;
  }
  renderCart();
}
window.selectCartPkg = selectCartPkg;

function checkoutSelected() {
  if (selectedCartIdx === null) return;
  startCheckout('cartItem', selectedCartIdx);
}
window.checkoutSelected = checkoutSelected;

function renderCart() {
  const badge = document.getElementById('c-badge');
  if (badge) badge.textContent = cart.length;
  const el = document.getElementById('cart-items');
  const tot = document.getElementById('cart-tot');
  const checkoutBtn = document.getElementById('btn-cart-checkout');
  if (!el) return;

  // Clamp selectedCartIdx if cart shrank
  if (selectedCartIdx !== null && selectedCartIdx >= cart.length) {
    selectedCartIdx = null;
  }

  if (!cart.length) {
    el.innerHTML = `<div class="cart-empty"><div></div><p>No finalized packages yet.<br>Build and finalize a package from the catalog.</p></div>`;
    if (tot) tot.textContent = '—';
    if (checkoutBtn) { checkoutBtn.disabled = true; checkoutBtn.textContent = ' Select a Package to Checkout'; checkoutBtn.style.opacity = '0.45'; checkoutBtn.style.cursor = 'not-allowed'; }
    return;
  }

  // Update footer button state
  if (checkoutBtn) {
    if (selectedCartIdx !== null) {
      checkoutBtn.disabled = false;
      checkoutBtn.textContent = '✓ Checkout Selected Package';
      checkoutBtn.style.opacity = '1';
      checkoutBtn.style.cursor = 'pointer';
      const selPkg = cart[selectedCartIdx];
      if (tot) tot.textContent = selPkg ? '₱' + selPkg.price.toLocaleString() : '—';
    } else {
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = ' Select a Package to Checkout';
      checkoutBtn.style.opacity = '0.45';
      checkoutBtn.style.cursor = 'not-allowed';
      if (tot) tot.textContent = '—';
    }
  }

  el.innerHTML = cart.map((pkg, pi) => {
    const isSelected = selectedCartIdx === pi;
    const selStyle = isSelected
      ? 'border:1px solid #cba153; background:#fbf7ef; box-shadow:0 0 10px rgba(203,161,83,0.2);'
      : 'border:1px solid rgba(203,161,83,0.2); background:#fffdf9;';

    if (pkg.isCustom) {
      let typeBadge = '';
      if (pkg.pricingMode === 'tiered' && pkg.selectedTier) typeBadge = `<span style="color:#cba153; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:1px;">Fixed: ${pkg.selectedTier.label}</span>`;
      else if (pkg.activePkgId) typeBadge = `<span style="color:#8a7060; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:1px;">Base Package Applied</span>`;
      else typeBadge = `<span style="color:#8a7060; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:1px;">Custom Build</span>`;

      return `<div class="c-item chk-new-summary" onclick="selectCartPkg(${pi})" style="display:flex; flex-direction:column; padding:20px; border-radius:12px; cursor:pointer; transition:0.2s; margin-bottom:10px; width:100%; box-sizing:border-box; ${selStyle}">
        ${isSelected ? '<div style="font-size:10px; font-weight:800; color:#cba153; text-align:right; width:100%; padding-bottom:10px; text-transform:uppercase; letter-spacing:1px;">✓ Selected for Checkout</div>' : ''}
        <div style="display:flex; justify-content:space-between; align-items:flex-start; width:100%; margin-bottom:12px;">
          <div>
            ${typeBadge}
            <div style="font-family:'Times New Roman', serif; font-size:20px; font-weight:700; color:#3d2b1a; margin-top:4px;">${pkg.name}</div>
            <div style="font-size:12px; color:#5c4f44; margin-top:2px;">${pkg.occasion} &middot; ${pkg.pax} pax &middot; ${pkg.venue}</div>
          </div>
          <div style="font-family:'Times New Roman', serif; font-size:18px; font-weight:700; color:#cba153;">₱${pkg.total.toLocaleString()}</div>
        </div>
        <div style="border-top:1px dashed rgba(203,161,83,0.3); margin:10px 0;"></div>
        <div style="font-size:13px; color:#5c4f44; line-height:1.6; margin-bottom:15px;">
          ${pkg.items.map(i => `&bull; ${i.name}`).join('<br>')}
        </div>
        <div style="display:flex; gap:10px; width:100%;">
          <button class="btn-modify-cpkg" onclick="event.stopPropagation();modifyCartPkg(${pi})" style="flex:1; background:#fffdf9; color:#cba153; border:1px solid rgba(203,161,83,0.4); padding:8px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; transition:0.2s;">Modify</button>
          <button class="btn-remove-cpkg" onclick="event.stopPropagation();removeCartPkg(${pi})" style="flex:1; background:transparent; color:#d9534f; border:1px solid rgba(217,83,79,0.3); padding:8px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; transition:0.2s;">Remove</button>
        </div>
      </div>`;
    }
    return `<div class="c-item chk-new-summary" onclick="selectCartPkg(${pi})" style="display:flex; flex-direction:column; padding:20px; border-radius:12px; cursor:pointer; transition:0.2s; margin-bottom:10px; width:100%; box-sizing:border-box; ${selStyle}">
      ${isSelected ? '<div style="font-size:10px; font-weight:800; color:#cba153; text-align:right; width:100%; padding-bottom:10px; text-transform:uppercase; letter-spacing:1px;">✓ Selected for Checkout</div>' : ''}
      <div style="display:flex; justify-content:space-between; align-items:flex-start; width:100%;">
        <div>
          <div style="color:#8a7060; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:1px;">${pkg.tagline || 'Premade Package'}</div>
          <div style="font-family:'Times New Roman', serif; font-size:20px; font-weight:700; color:#3d2b1a; margin-top:4px;">${pkg.name}</div>
        </div>
        <div style="font-family:'Times New Roman', serif; font-size:18px; font-weight:700; color:#cba153;">${typeof pkg.price === 'number' ? '₱' + pkg.price.toLocaleString() : pkg.price}</div>
      </div>
      <div style="display:flex; justify-content:flex-end; margin-top:15px; width:100%;">
        <button class="c-rm" onclick="event.stopPropagation();removeCartPkg(${pi})" style="background:transparent; color:#d9534f; border:1px solid rgba(217,83,79,0.3); padding:6px 12px; border-radius:8px; font-size:11px; font-weight:700; cursor:pointer; transition:0.2s;">Remove Package</button>
      </div>
    </div>`;
  }).join('');
}
window.renderCart = renderCart;

function removeCartPkg(idx) {
  if (selectedCartIdx === idx) selectedCartIdx = null;
  else if (selectedCartIdx !== null && selectedCartIdx > idx) selectedCartIdx--;
  cart.splice(idx, 1);
  saveCartToSupabase();
  renderCart();
}
window.removeCartPkg = removeCartPkg;

// ===== SUPABASE CART PERSISTENCE =====
async function saveCartToSupabase() {
  const sb = window.supabaseClient || window.supabase;
  if (!currentUser || !sb) return;
  try {
    const uid = currentUser.uid || currentUser.id || currentUser.email;
    if (!uid) return;
    const { error } = await sb
      .from('customer_cart')
      .upsert({ user_id: uid, cart_data: JSON.stringify(cart), updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    if (error) console.warn('Could not save cart to Supabase:', error.message);
  } catch (err) {
    console.warn('Could not save cart to Supabase:', err);
  }
}

async function loadCartFromSupabase() {
  const sb = window.supabaseClient || window.supabase;
  if (!currentUser || !sb) return;
  try {
    const uid = currentUser.uid || currentUser.id || currentUser.email;
    if (!uid) return;
    const { data, error } = await sb
      .from('customer_cart')
      .select('cart_data')
      .eq('user_id', uid)
      .maybeSingle();
    if (error || !data) return;
    const loaded = JSON.parse(data.cart_data || '[]');
    if (Array.isArray(loaded) && loaded.length > 0) {
      // In-memory packages take priority; merge up to max 2
      const combined = [...cart];
      for (const pkg of loaded) {
        if (combined.length >= 2) break;
        if (!combined.find(c => c.name === pkg.name)) combined.push(pkg);
      }
      cart = combined.slice(0, 2);
      renderCart();
    }
  } catch (err) {
    console.warn('Could not load cart from Supabase:', err);
  }
}
window.saveCartToSupabase = saveCartToSupabase;
window.loadCartFromSupabase = loadCartFromSupabase;

function modifyCartPkg(idx) {
  const pkg = cart[idx];
  if (!pkg || !pkg.isCustom) return;

  const safeAssign = window.smartAssign;

  if (pkg.activePkgId) {
    activePkg = PKGS.find(p => p.id === pkg.activePkgId);
  } else {
    activePkg = null;
  }
  window.activeTier = pkg.selectedTier || null;

  safeAssign('cpkg-desc', pkg.desc);
  safeAssign('cpkg-theme', pkg.theme);
  safeAssign('cpkg-pax', pkg.pax);
  safeAssign('cpkg-occasion', pkg.occasion);
  safeAssign('cpkg-venue-location', pkg.venueLocation);
  safeAssign('cpkg-venue', pkg.venue);
  safeAssign('cpkg-date', pkg.date);
  safeAssign('cpkg-timeframe', pkg.time);
  safeAssign('map-search-input', pkg.venue);

  editingPkgName = pkg.name;
  customPkgItems = [...pkg.items];

  const vipCheck = document.getElementById('cpkg-vip-check');
  if (vipCheck) {
    vipCheck.checked = pkg.isVIP || false;
    toggleVIPFields();
  }
  safeAssign('cpkg-vip-count', pkg.vipCount);
  safeAssign('cpkg-vip-service', pkg.vipService);

  preferredMeetingTimes = pkg.meetingTimes ? [...pkg.meetingTimes] : [];
  renderMeetingTimes();

  cart.splice(idx, 1);
  renderCart();
  renderCustomPkg();
  renderCat();
  if (typeof updateDawContextBar === 'function') updateDawContextBar();

  document.getElementById('cart-drawer').classList.remove('open');
  const overlay = document.getElementById('cart-overlay');
  if (overlay) overlay.classList.remove('on');
  go('#builder');
}
window.modifyCartPkg = modifyCartPkg;

function toggleCart() { 
  document.getElementById('cart-drawer').classList.toggle('open'); 
  const overlay = document.getElementById('cart-overlay');
  if (overlay) overlay.classList.toggle('on');
}
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

function closeDataPanel() {
  clearTimeout(dataPanelTimeout);
  const workspace = document.querySelector('.catalog-workspace');
  if (workspace) workspace.classList.remove('show-data');
}

window.openDataPanel = openDataPanel;
window.closeDataPanelDelay = closeDataPanelDelay;
window.closeDataPanel = closeDataPanel;

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
    const cityInput = document.getElementById('cpkg-venue-location').value.trim().toLowerCase();

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
        const prettyCity = matchKey.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
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
  const theme = window.getSmartV('cpkg-theme').trim();
  const pax = document.getElementById('cpkg-pax')?.value.trim();
  const date = document.getElementById('cpkg-date')?.value.trim();
  const occasion = window.getSmartV('cpkg-occasion').trim();
  const venue = document.getElementById('cpkg-venue')?.value.trim();
  const hasForm = desc || theme || pax || date || occasion || venue;
  const hasItems = customPkgItems.length > 0;
  if (!hasForm && !hasItems) return null;
  let ctx = "[CURRENT CUSTOM PACKAGE]\n";
  if (occasion) ctx += `Occasion: ${occasion}\n`;
  if (date) ctx += `Date: ${date}\n`;
  const time = window.getSmartV('cpkg-timeframe').trim();
  if (time) ctx += `Time Frame: ${time}\n`;
  if (desc) ctx += `Description: ${desc}\n`;
  if (theme) ctx += `Theme: ${theme}\n`;
  if (pax) ctx += `Guests: ${pax} pax\n`;
  if (venue) ctx += `Venue: ${venue}\n`;
  if (hasItems) {
    ctx += `Items selected (${customPkgItems.length}): ${customPkgItems.map(i => `${i.name} (₱${getDynamicPrice(i, pax).toLocaleString()})`).join(', ')}\n`;
    ctx += `Current total: ₱${customPkgItems.reduce((s, i) => s + getDynamicPrice(i, pax), 0).toLocaleString()}\n`;
  }
  return ctx;
}

function updateDawContextBar() {
  const bar = document.getElementById('daw-context-bar');
  if (!bar) return;
  const ctx = getCustomPkgContext();
  if (ctx) {
    const cnt = customPkgItems.length;
    const occasion = window.getSmartV('cpkg-occasion').trim();
    bar.textContent = `Reading your package${occasion ? (' — ' + occasion) : ''}${cnt ? (' · ' + cnt + ' item' + (cnt !== 1 ? 's' : '')) : ''}`;
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
window.closeDeskAI = closeDeskAI;

// ===== AI =====
const API_URL = 'https://halden-s-catering-service.vercel.app/api/chat';

const SYS_BASE = `You are Hal'Serve AI, the premier event planning assistant for Halden's Catering Services. You are warm, hospitable, direct, accommodating, and natural in conversation.

CRITICAL RULE: NEVER output internal monologue, reasoning steps, thinking processes, or safety/system evaluation tags (like "User Safety: safe"). Output ONLY the clean, friendly reply that the customer reads.

RULE 1 — SIMPLE GREETINGS ("hi", "hello", "hey", "heyy", "good morning", "good afternoon", or casual greetings with no specific event question):
   Output ONLY this exact sentence:
   Hello there! Welcome to Halden's Catering Services. How may I assist you with your event planning today?
   Do NOT include a JSON block for simple greetings.

RULE 2 — CATERING & EVENT REQUESTS:
   - INTRO: 1 short, warm acknowledgement sentence.
   - BODY: List 3 to 6 matching items using bullet points with "• " symbol. Keep each bullet short and concise (1 line max per item).
   - CLOSING: 1 short recommendation sentence.
   - End with a JSON block: {"recommended_names":["Item Name 1","Item Name 2",...]} listing 3 to 6 exact matching names from the LIVE CATALOG.

RULE 3 — NO MARKDOWN CLUTTER: No asterisks (**), no hashtags (###). Clean, readable text. Use ₱ for prices.

RULE 4 — BE DIRECT & CONCISE: Answer EXACTLY what the customer asks. Keep descriptions short and punchy so responses are complete and never cut off.

RULE 5 — OFF-TOPIC & FOLLOW-UPS:
   - If the user asks about unrelated topics: "I'm sorry, but I'm specialized specifically in assisting with Halden's catering and event planning! Is there anything regarding your upcoming event or menu that I can help you with?"
   - If the user asks follow-ups like "why not?": Explain naturally and politely in 1 short sentence (e.g., "As Halden's AI assistant, I'm designed specifically to help you explore our menu, packages, and event services!"). Do NOT dump safety tags or system codes.`;

// Build a live catalog snapshot from the actual CAT array (populated from Supabase)
// Called just before the first AI message so it always reflects current DB state.
function buildAICatalogContext() {
  const groups = { food: [], dessert: [], drink: [], equipment: [], decoration: [], entertainment: [] };
  (CAT || []).forEach(item => {
    const cat = (item.cat || '').toLowerCase();
    if (groups[cat]) groups[cat].push(item.name);
  });
  let catalog = '\nLIVE CATALOG (use these exact names in recommended_names):\n';
  if (groups.food.length)          catalog += `Food: ${groups.food.join(', ')}\n`;
  if (groups.dessert.length)        catalog += `Desserts: ${groups.dessert.join(', ')}\n`;
  if (groups.drink.length)          catalog += `Drinks: ${groups.drink.join(', ')}\n`;
  if (groups.equipment.length)      catalog += `Equipment: ${groups.equipment.join(', ')}\n`;
  if (groups.decoration.length)     catalog += `Decorations: ${groups.decoration.join(', ')}\n`;
  if (groups.entertainment.length)  catalog += `Add-ons/Entertainment: ${groups.entertainment.join(', ')}\n`;
  return catalog;
}

let hist = [{ role: 'system', content: SYS_BASE }];
let _aiCatalogInjected = false;
let initialized = { desk: false, mob: false };

function initAI(panel) {
  if (initialized[panel]) return;
  initialized[panel] = true;
  const msgsId = panel === 'desk' ? 'ai-msgs-desk' : 'ai-msgs-mob';
  addBot("Hi there! I'm Halden's AI Event Planner.\n\nDescribe your event below — the occasion, number of guests, budget, and any theme ideas — and I'll instantly highlight the most suitable items from our catalog for you.", msgsId);
}

function formatAiMessageText(txt) {
  if (!txt) return '';
  let clean = txt;
  // 1. Strip raw markdown headers (e.g. ### or ##)
  clean = clean.replace(/#{1,6}\s?/g, '');
  // 2. Convert **bold** to <strong>bold</strong> and *italic* to <em>italic</em>
  clean = clean.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  clean = clean.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // 3. Clean up bullet points to use standard clean bullet symbol
  clean = clean.replace(/^[\s]*[\*\-]\s+/gm, '• ');
  // 4. Clean line breaks
  return clean.replace(/\n/g, '<br>');
}

function addBot(txt, msgsId) {
  const c = document.getElementById(msgsId);
  if (!c) return;
  const d = document.createElement('div');
  d.className = 'ai-msg bot';
  d.innerHTML = `<div class="ai-msg-ico"></div><div class="ai-bub">${formatAiMessageText(txt)}</div>`;
  c.appendChild(d); c.scrollTop = c.scrollHeight;
}

function addUser(txt, msgsId) {
  const c = document.getElementById(msgsId);
  if (!c) return;
  const d = document.createElement('div');
  d.className = 'ai-msg user';
  d.innerHTML = `<div class="ai-msg-ico"></div><div class="ai-bub">${txt.replace(/\n/g, '<br>')}</div>`;
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

// ===== AI CONVERSATIONS MANAGEMENT (SUPABASE PERSISTENCE) =====
let customerConvs = [];
let currentConversationId = null;

async function loadCustomerAIConversations() {
  const sb = window.supabaseClient || window.supabase;
  if (!currentUser || !sb) {
    customerConvs = [];
    currentConversationId = null;
    updateAIConvsButtons();
    return;
  }

  try {
    const uid = currentUser.id || currentUser.uid || currentUser.email;
    if (!uid) { updateAIConvsButtons(); return; }

    const { data, error } = await sb
      .from('ai_conversations')
      .select('id, user_id, title, messages, created_at, updated_at')
      .eq('user_id', String(uid))
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Could not load AI conversations:', error.message);
      customerConvs = [];
    } else {
      customerConvs = data || [];
    }
  } catch (err) {
    console.warn('Error loading AI conversations:', err);
    customerConvs = [];
  }

  updateAIConvsButtons();
}
window.loadCustomerAIConversations = loadCustomerAIConversations;

function updateAIConvsButtons() {
  const btnDesk = document.getElementById('btn-see-convs-desk');
  const btnMob = document.getElementById('btn-see-convs-mob');
  const btnNewDesk = document.getElementById('btn-new-conv-desk');
  const btnNewMob = document.getElementById('btn-new-conv-mob');

  const hasConvs = !!(currentUser && customerConvs.length > 0);

  [btnDesk, btnMob].forEach(btn => {
    if (!btn) return;
    if (hasConvs) {
      btn.classList.remove('locked');
      btn.title = "View your saved conversations";
    } else {
      btn.classList.add('locked');
      btn.title = !currentUser 
        ? "Log in and start a conversation to view chat history" 
        : "Start a conversation to view chat history";
    }
  });

  const isFull = customerConvs.length >= 5;
  [btnNewDesk, btnNewMob].forEach(btn => {
    if (!btn) return;
    btn.disabled = isFull;
    btn.title = isFull ? "Maximum 5 conversations allowed. Delete one to start a new chat." : "Start a new conversation";
  });
}

function toggleAIConvsView(panel) {
  const btn = document.getElementById('btn-see-convs-' + panel);
  if (btn && btn.classList.contains('locked')) return;

  const chatBody = document.getElementById('ai-chat-body-' + panel);
  const convsPanel = document.getElementById('ai-convs-panel-' + panel);
  if (!chatBody || !convsPanel) return;

  const isConvsShowing = convsPanel.style.display !== 'none';

  if (isConvsShowing) {
    convsPanel.style.display = 'none';
    chatBody.style.display = 'flex';
  } else {
    renderAIConvsList(panel);
    chatBody.style.display = 'none';
    convsPanel.style.display = 'flex';
  }
}
window.toggleAIConvsView = toggleAIConvsView;

function renderAIConvsList(panel) {
  const titleEl = document.getElementById('ai-convs-title-' + panel);
  const itemsEl = document.getElementById('ai-convs-items-' + panel);
  if (!itemsEl) return;

  if (titleEl) titleEl.textContent = `Conversations (${customerConvs.length}/5)`;

  if (!customerConvs || customerConvs.length === 0) {
    itemsEl.innerHTML = `<div style="text-align:center; padding:30px 10px; color:var(--text-dim,#888); font-size:12px;">No saved conversations yet. Chat with the AI while logged in to save your conversations.</div>`;
    return;
  }

  itemsEl.innerHTML = customerConvs.map(c => {
    const isActive = c.id === currentConversationId;
    const msgCount = Array.isArray(c.messages) ? c.messages.length : 0;
    const dateStr = c.created_at ? new Date(c.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
    const safeTitle = (c.title || 'Conversation').replace(/"/g, '&quot;');

    return `<div class="ai-conv-card ${isActive ? 'active' : ''}" onclick="selectAIConversation('${c.id}', '${panel}')">
      <div style="flex:1; overflow:hidden;">
        <div class="acc-title">${safeTitle}</div>
        <div class="acc-meta">${dateStr} · ${msgCount} msgs</div>
      </div>
      <button class="btn-del-conv" onclick="deleteAIConversation('${c.id}', event)">Delete</button>
    </div>`;
  }).join('');
}

function startNewAIConversation(panel) {
  if (customerConvs.length >= 5) {
    if (typeof openErrorModal === 'function') openErrorModal("You have reached the maximum limit of 5 conversations. Please delete an existing conversation first.");
    else alert("Maximum 5 conversations allowed. Please delete one first.");
    return;
  }

  currentConversationId = null;
  hist = [{ role: 'system', content: SYS_BASE + buildAICatalogContext() }];
  
  const msgsDesk = document.getElementById('ai-msgs-desk');
  const msgsMob = document.getElementById('ai-msgs-mob');
  if (msgsDesk) msgsDesk.innerHTML = '';
  if (msgsMob) msgsMob.innerHTML = '';

  initialized.desk = false;
  initialized.mob = false;

  const chatBody = document.getElementById('ai-chat-body-' + panel);
  const convsPanel = document.getElementById('ai-convs-panel-' + panel);
  if (convsPanel) convsPanel.style.display = 'none';
  if (chatBody) chatBody.style.display = 'flex';

  initAI(panel);
}
window.startNewAIConversation = startNewAIConversation;

function selectAIConversation(convId, panel) {
  const conv = customerConvs.find(c => c.id === convId);
  if (!conv) return;

  currentConversationId = conv.id;
  hist = [{ role: 'system', content: SYS_BASE + buildAICatalogContext() }];

  const msgsId = panel === 'desk' ? 'ai-msgs-desk' : 'ai-msgs-mob';
  const c = document.getElementById(msgsId);
  if (c) c.innerHTML = '';

  const msgs = Array.isArray(conv.messages) ? conv.messages : [];
  msgs.forEach(m => {
    hist.push({ role: m.role, content: m.content });
    if (m.role === 'user') addUser(m.content, msgsId);
    else if (m.role === 'assistant') addBot(m.content, msgsId);
  });

  const chatBody = document.getElementById('ai-chat-body-' + panel);
  const convsPanel = document.getElementById('ai-convs-panel-' + panel);
  if (convsPanel) convsPanel.style.display = 'none';
  if (chatBody) chatBody.style.display = 'flex';
}
window.selectAIConversation = selectAIConversation;

async function deleteAIConversation(convId, ev) {
  if (ev) ev.stopPropagation();
  const sb = window.supabaseClient || window.supabase;
  if (!sb) return;

  try {
    const { error } = await sb.from('ai_conversations').delete().eq('id', convId);
    if (error) console.warn('Could not delete conversation:', error.message);
  } catch (err) {
    console.warn('Error deleting conversation:', err);
  }

  customerConvs = customerConvs.filter(c => c.id !== convId);

  if (currentConversationId === convId) {
    startNewAIConversation('desk');
  }

  updateAIConvsButtons();
  const activePanel = document.getElementById('ai-convs-panel-desk')?.style.display !== 'none' ? 'desk' : 'mob';
  renderAIConvsList(activePanel);
}
window.deleteAIConversation = deleteAIConversation;

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
  // Inject the live catalog into the system message on the very first real send
  // (Supabase loaders have finished by then, so CAT is fully populated)
  if (!_aiCatalogInjected) {
    hist[0] = { role: 'system', content: SYS_BASE + buildAICatalogContext() };
    _aiCatalogInjected = true;
  }
  hist.push({ role: 'user', content: userContent });

  try {
    // 20-MESSAGE TRUNCATION RULE: Take at most the last 20 messages to prevent payload overload
    const conversationTrajectory = hist.slice(1);
    const recentMessages = conversationTrajectory.slice(-20);
    const apiPayloadMessages = [hist[0], ...recentMessages];

    const models = [
      'openrouter/free',
      'google/gemma-3n-e4b-it:free',
      'nvidia/llama-3.1-nemotron-ultra-253b-v1:free'
    ];
    let reply = null;
    let lastError = null;

    for (let model of models) {
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ model: model, messages: apiPayloadMessages, max_tokens: 1200 })
        });
        const data = await res.json();
        
        if (data.choices?.[0]?.message?.content) {
          reply = data.choices[0].message.content;
          break; // Success, stop trying other models
        }
        
        if (data.error) {
          console.warn(`Model ${model} failed:`, data.error);
          lastError = data.error;
        }
      } catch (e) {
        console.warn(`Model ${model} failed due to a network error, trying next...`, e);
        lastError = { message: "Network connection failed" };
      }
    }

    if (!reply) {
      reply = lastError?.metadata?.raw || lastError?.message || "Sorry, I couldn't connect to any AI models. Please try again.";
    }


    // ---- AGGRESSIVE THINKING PROCESS, SAFETY TAGS & MONOLOGUE SANITIZER ----
    // 1. Strip standard <think>...</think> tags (DeepSeek R1, Qwen, etc.)
    reply = reply.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

    // 2. Strip raw model safety evaluation metadata (e.g., "User Safety: safe\nResponse Safety: safe")
    reply = reply.replace(/(?:User|Response)\s+Safety\s*:\s*\w+/gi, '').trim();

    // 3. Strip any block starting with "Thinking Process:", "Thought Process:", etc. up to the real response
    reply = reply.replace(/^(?:Thinking|Thought|Reasoning)\s+Process:[\s\S]*?(?=\n\n(?:Hello|Hi|Welcome|Sure|Of course|Certainly|Here|Regarding|For|I understand|Great|Overall|As Halden|\bI'm\b)|\n\n[A-Z][a-z]+)/i, '').trim();

    // 4. Detect any remaining internal monologue patterns
    const leakPatterns = [
      /thinking\s+process\s*:/i,
      /thought\s+process\s*:/i,
      /\b1\.\s+(analyze|check|identify|understand|formulate|consider|plan|process|evaluate|determine|read)/i,
      /^step\s+1\s*:/im,
      /I should acknowledge/i,
      /Let me think/i,
      /Let me re-read/i,
      /There'?s a conflict between/i,
      /chain.of.thought/i,
      /Analyze User Input/i,
      /Identify Intent/i,
      /Formulate Response/i,
      /Output Generation/i,
      /User Input:/i,
      /User Intent:/i,
      /User Safety:/i,
      /Response Safety:/i
    ];

    if (leakPatterns.some(p => p.test(reply))) {
      // Find where clean conversational response actually starts
      const cleanStart = reply.search(/(Hello there!|Hi there!|Welcome to Halden|Of course|Certainly!|Sure!|Great question|I understand|Here are|Here's what|Regarding|For your|To assist|I'm sorry|As Halden's|I am designed|I specialize)/i);
      if (cleanStart !== -1) {
        reply = reply.substring(cleanStart).trim();
      } else {
        // Fallback: take only paragraphs that don't match any leak patterns
        const paragraphs = reply.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
        const cleanParagraphs = paragraphs.filter(p => !leakPatterns.some(pat => pat.test(p)));
        if (cleanParagraphs.length > 0) {
          reply = cleanParagraphs.join('\n\n');
        } else {
          reply = "Hello there! Welcome to Halden's Catering Services. How may I assist you with your event planning today?";
        }
      }
    }

    // 5. Clean up any trailing cut-off line if truncated mid-sentence
    const replyLines = reply.split('\n');
    if (replyLines.length > 1) {
      const lastLine = replyLines[replyLines.length - 1].trim();
      if (lastLine && !/[.!?}"\]]$/.test(lastLine)) {
        replyLines.pop();
        reply = replyLines.join('\n').trim();
      }
    }

    // Final safety check: if response is empty or just whitespace after stripping
    if (!reply || reply.length < 5) {
      reply = "Hello there! Welcome to Halden's Catering Services. How may I assist you with your event planning today?";
    }


    hist.push({ role: 'assistant', content: reply });
    hideTyping(msgsId);

    // Match either recommended_names (new) or recommended_ids (legacy fallback)
    const m = reply.match(/\{\s*"recommended_(?:names|ids)"\s*:\s*\[.*?\]\s*\}/s);
    let clean = reply;
    if (m) {
      try {
        const p = JSON.parse(m[0]);
        const picks = p.recommended_names || p.recommended_ids || [];
        if (picks.length) applyPicks(picks, txt);
        clean = reply.replace(m[0], '').trim();
      } catch (e) { }
    }
    addBot(clean, msgsId);

    // SUPABASE PERSISTENCE FOR LOGGED IN USERS
    const sb = window.supabaseClient || window.supabase;
    if (currentUser && sb) {
      const uid = currentUser.id || currentUser.uid || currentUser.email;
      const msgTrajectory = hist.slice(1).map(m => ({ role: m.role, content: m.content }));

      if (currentConversationId) {
        await sb.from('ai_conversations')
          .update({ messages: msgTrajectory, updated_at: new Date().toISOString() })
          .eq('id', currentConversationId);
      } else {
        if (customerConvs.length < 5) {
          const firstMsgTitle = txt.substring(0, 30) + (txt.length > 30 ? '...' : '');
          const { data, error } = await sb.from('ai_conversations')
            .insert([{ user_id: String(uid), title: firstMsgTitle, messages: msgTrajectory }])
            .select('id')
            .single();

          if (data && data.id) {
            currentConversationId = data.id;
            await loadCustomerAIConversations();
          }
        }
      }
    }

    if (aiPicks && panel === 'desk') {
      const notif = document.getElementById('ai-notif-desk');
      if (notif) { notif.textContent = aiPicks.length; notif.classList.add('on'); }
    }
  } catch (e) {
    hideTyping(msgsId);
    addBot("I'm having trouble connecting right now. Please try again in a moment.", msgsId);
  }
  btn.disabled = false;
}

function applyPicks(names, query) {
  // The AI now returns item NAMES instead of hardcoded IDs.
  // Resolve each name against the live CAT array to get real IDs.
  const nameSet = new Set((names || []).map(n => (n || '').toLowerCase().trim()));
  const matchedIds = (CAT || [])
    .filter(item => nameSet.has((item.name || '').toLowerCase().trim()))
    .map(item => item.id);

  aiPicks = matchedIds.length > 0 ? matchedIds : null;
  const banner = document.getElementById('ai-banner');
  if (!aiPicks) { banner.classList.remove('on'); return; }
  banner.classList.add('on');
  document.getElementById('aib-title').textContent = ` ${aiPicks.length} items recommended for you`;
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
    notif.textContent = aiPicks.length;
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
    attribution: ' OpenStreetMap'
  }).addTo(leafletMap);

  // Also add click event to map to easily drop pin
  leafletMap.on('click', function (e) {
    if (mapMarker) {
      leafletMap.removeLayer(mapMarker);
    }
    mapMarker = L.marker(e.latlng).addTo(leafletMap);

    // Reverse geocode
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
      .then(r => r.json())
      .then(data => {
        if (data && data.display_name) {
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
  if (!document.getElementById('auth-overlay').classList.contains('on') && !document.getElementById('checkout-overlay')?.classList.contains('on') && !document.getElementById('profile-overlay')?.classList.contains('on') && !document.getElementById('mob-overlay')?.classList.contains('on')) {
    document.body.style.overflow = '';
  }
}
window.openMapModal = openMapModal;
window.closeMapModal = closeMapModal;

async function searchLocation() {
  const q = document.getElementById('map-search-input').value.trim();
  if (!q) return;

  const btn = document.querySelector('.btn-map-search');
  btn.textContent = '...';
  btn.disabled = true;

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`);
    const data = await res.json();

    if (data && data.length > 0) {
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

      if (mapMarker) leafletMap.removeLayer(mapMarker);
      mapMarker = L.marker([lat, lon]).addTo(leafletMap);

      // Auto fill input with formatted display name
      document.getElementById('map-search-input').value = displayName;
    } else {
      alert("Location not found. Try a different search term or click on the map to drop a pin.");
    }
  } catch (e) {
    console.error(e);
    alert("Error searching for location.");
  }

  btn.textContent = 'Search';
  btn.disabled = false;
}
window.searchLocation = searchLocation;

function confirmLocation() {
  const val = document.getElementById('map-search-input').value.trim();
  if (!val) {
    alert("Please search and select a location first.");
    return;
  }
  document.getElementById('cpkg-venue').value = val;

  // Auto-parse the NCR city from the confirmed location and update the Venue Location dropdown
  const ncrCities = ['Quezon City','Caloocan','Las Pi\u00f1as','Makati','Malabon',
    'Mandaluyong','Marikina','Muntinlupa','Navotas','Para\u00f1aque','Pasay','Pasig','San Juan','Taguig','Valenzuela','Manila'];
  const matched = ncrCities.find(c => val.toLowerCase().includes(c.toLowerCase()));
  const venueLocEl = document.getElementById('cpkg-venue-location');
  if (venueLocEl && matched) {
    venueLocEl.value = matched;
    venueLocEl.disabled = true;
    venueLocEl.style.opacity = '0.6';
    venueLocEl.style.cursor = 'not-allowed';
    // Show overlay to handle click error message
    const overlayEl = document.getElementById('cpkg-venue-overlay');
    if (overlayEl) overlayEl.style.display = 'block';

    // Manually trigger change to update insights if needed
    openDataPanel('city');
    renderCustomPkg();
  }

  closeMapModal();
}
window.confirmLocation = confirmLocation;

function removeLocation() {
  document.getElementById('map-search-input').value = '';
  document.getElementById('cpkg-venue').value = '';
  
  const venueLocEl = document.getElementById('cpkg-venue-location');
  if (venueLocEl) {
    venueLocEl.value = '';
    venueLocEl.disabled = false;
    venueLocEl.style.opacity = '1';
    venueLocEl.style.cursor = 'pointer';
    
    // Hide overlay
    const overlayEl = document.getElementById('cpkg-venue-overlay');
    if (overlayEl) overlayEl.style.display = 'none';

    // Clear insights
    openDataPanel('city');
    renderCustomPkg();
  }
  
  if (mapMarker && leafletMap) {
    leafletMap.removeLayer(mapMarker);
    mapMarker = null;
  }
  lastMapCoords = null;
  
  closeMapModal();
}
window.removeLocation = removeLocation;

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
    attribution: ' OpenStreetMap'
  }).addTo(chkLeafletMap);
}

function closeCheckoutMap() {
  document.getElementById('chk-map-modal').classList.remove('open');
  document.getElementById('chk-map-overlay').classList.remove('on');
}
window.closeCheckoutMap = closeCheckoutMap;

async function openCheckoutMap() {
  const venueStr = document.getElementById('chk-venue').value?.trim();
  if (!venueStr) {
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

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        lastMapCoords = { lat, lon };

        chkLeafletMap.setView([lat, lon], 16);

        if (chkMapMarker) chkLeafletMap.removeLayer(chkMapMarker);
        chkMapMarker = L.marker([lat, lon]).addTo(chkLeafletMap);
      }
    } catch (e) { }
  }, 100);
}
window.openCheckoutMap = openCheckoutMap;

// ===== AUTH PROMPT FUNCTIONS =====
window.checkAuthPrompt = function () {
  const userType = localStorage.getItem('halden_user_type');
  const isLoggedIn = localStorage.getItem('halden_logged_in') === 'true';

  // Show auth prompt if user hasn't made a choice and isn't logged in
  if (!userType && !isLoggedIn) {
    const authModal = document.getElementById('authPromptModal');
    if (authModal) {
      authModal.style.display = 'flex';
      setTimeout(() => {
        authModal.classList.remove('hidden');
      }, 100);
    }
  }
};

window.continueAsGuest = function () {
  const authModal = document.getElementById('authPromptModal');
  if (authModal) {
    authModal.classList.add('hidden');
    setTimeout(() => {
      authModal.style.display = 'none';
    }, 300);
  }
  // Store guest preference
  localStorage.setItem('halden_user_type', 'guest');
};
// Register as stub target for early calls from index.html
window._continueAsGuestReady = window.continueAsGuest;

window.goToLogin = function () {
  const authModal = document.getElementById('authPromptModal');
  if (authModal) {
    authModal.classList.add('hidden');
    setTimeout(() => {
      authModal.style.display = 'none';
      // Open the existing login/signup panel
      if (typeof openAuth === 'function') {
        openAuth();
      }
    }, 300);
  }
  // Store account preference
  localStorage.setItem('halden_user_type', 'account');
};
window._goToLoginReady = window.goToLogin;

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
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
  const tb = document.getElementById('tab-' + tab);
  if (tb) tb.classList.add('active');
  document.getElementById('panel-' + tab).classList.add('active');

  // Reset forgot password state
  if (tab === 'login' || tab === 'signup') {
    const step1 = document.getElementById('forgot-step-1');
    const step2 = document.getElementById('forgot-step-2');
    const step3 = document.getElementById('forgot-step-3');
    const subtitle = document.getElementById('forgot-subtitle');
    const msg = document.getElementById('forgot-msg');
    if (step1) step1.style.display = 'block';
    if (step2) step2.style.display = 'none';
    if (step3) step3.style.display = 'none';
    if (subtitle) subtitle.textContent = 'Enter your email address to receive a verification code.';
    if (msg) { msg.textContent = ''; msg.className = 'auth-msg'; }
  }
}

let forgotPasswordOtp = null;
let forgotPasswordUserId = null;
let forgotPasswordEmail = null;

async function doForgotPassword() {
  const email = document.getElementById('forgot-email').value.trim();
  if (!email) return showAuthMsg('forgot-msg', 'error', 'Please enter your email.');

  const btn = document.getElementById('forgot-btn');
  btn.disabled = true;
  btn.textContent = 'Sending...';
  clearAuthMsg('forgot-msg');

  try {
    // 1. Check if email exists using the secure RPC (bypasses RLS)
    const { data: foundUser, error } = await window.supabaseClient.rpc('check_email_exists', {
      lookup_email: email.toLowerCase()
    });
      
    if (error) throw new Error(error.message);

    if (!foundUser) {
      showAuthMsg('forgot-msg', 'error', 'Email not found in our system.');
      btn.disabled = false;
      btn.textContent = 'Send Recovery Code';
      return;
    }

    // 2. Generate OTP and send via EmailJS
    forgotPasswordOtp = Math.floor(100000 + Math.random() * 900000).toString();
    forgotPasswordEmail = email.toLowerCase();
    forgotPasswordUserId = foundUser.id;

    const emailJsServiceId = "service_8hcbt1e";
    const emailJsTemplateId = "template_zwfupwo";

    if (!window.emailjs) {
      showAuthMsg('forgot-msg', 'error', 'EmailJS failed to load. Please check your internet connection.');
      btn.disabled = false;
      btn.textContent = 'Send Recovery Code';
      return;
    }

    await window.emailjs.send(emailJsServiceId, emailJsTemplateId, { 
      to_email: forgotPasswordEmail, 
      to_name: foundUser.name || 'User', 
      otp_code: forgotPasswordOtp 
    }); 

    showAuthMsg('forgot-msg', 'success', `Verification code sent to ${email}. Check your inbox.`);
    
    // Transition to Step 2
    document.getElementById('forgot-step-1').style.display = 'none';
    document.getElementById('forgot-step-2').style.display = 'block';
    const subtitle = document.getElementById('forgot-subtitle');
    if (subtitle) subtitle.textContent = 'Enter the 6-digit verification code sent to your email.';
    
  } catch (err) {
    showAuthMsg('forgot-msg', 'error', 'Error: ' + err.message);
  }

  btn.disabled = false;
  btn.textContent = 'Send Recovery Code';
}
window.doForgotPassword = doForgotPassword;

function verifyOtpOnly() {
  const enteredOtp = document.getElementById('forgot-otp').value.trim();
  
  if (enteredOtp.length !== 6) {
    return showAuthMsg('forgot-msg', 'error', 'Please enter the full 6-digit code.');
  }
  
  if (enteredOtp !== forgotPasswordOtp) {
    return showAuthMsg('forgot-msg', 'error', 'Incorrect code. Please try again.');
  }
  
  clearAuthMsg('forgot-msg');
  document.getElementById('forgot-step-2').style.display = 'none';
  document.getElementById('forgot-step-3').style.display = 'block';
  const subtitle = document.getElementById('forgot-subtitle');
  if (subtitle) subtitle.textContent = 'Enter your new password.';
}
window.verifyOtpOnly = verifyOtpOnly;

async function verifyForgotPasswordOtp() {
  const newPass = document.getElementById('forgot-new-password').value;
  const confirmPass = document.getElementById('forgot-confirm-password').value;

  if (!newPass || newPass.length < 8 || !/\d/.test(newPass) || !/[!@#$%^&*()_+\-=\[\]{};:'\"\\|,.<>/?]/.test(newPass)) {
    return showAuthMsg('forgot-msg', 'error', 'Password must be at least 6 characters.');
  }
  if (newPass !== confirmPass) {
    return showAuthMsg('forgot-msg', 'error', 'Passwords do not match.');
  }

  const btn = document.getElementById('forgot-verify-btn');
  btn.disabled = true;
  btn.textContent = 'Resetting...';

  try {
    // === DAY 8: Update via custom RPC (updates bcrypt vault) AND Supabase native (updates auth) ===
    const { error: rpcError } = await window.supabaseClient.rpc('reset_password', {
      user_email: forgotPasswordEmail,
      new_password: newPass
    });
    if (rpcError) throw new Error(rpcError.message);

    // Also update the Supabase Native Auth password so login stays in sync
    // (This requires the user to be signed in — for anonymous reset we use the RPC only)
    // The RPC is the authoritative source; native auth is kept in sync best-effort.
    try {
      await window.supabaseClient.auth.updateUser({ password: newPass });
    } catch (e) { /* non-fatal: user may not have an active session */ }

    // Success, transition back to login
    showAuthMsg('forgot-msg', 'success', 'Password reset successfully! You can now login.');
    setTimeout(() => {
      document.getElementById('forgot-email').value = '';
      document.getElementById('forgot-otp').value = '';
      document.getElementById('forgot-new-password').value = '';
      if (document.getElementById('forgot-confirm-password')) document.getElementById('forgot-confirm-password').value = '';
      switchAuthTab('login');
      const loginMsg = document.getElementById('login-msg');
      if (loginMsg) {
        loginMsg.className = 'auth-msg success';
        loginMsg.textContent = 'Password reset successful. Please login with your new password.';
      }
    }, 2000);

  } catch (err) {
    showAuthMsg('forgot-msg', 'error', 'Failed to update password: ' + err.message);
  }

  btn.disabled = false;
  btn.textContent = 'Reset Password';
}
window.verifyForgotPasswordOtp = verifyForgotPasswordOtp;

function showAuthMsg(id, type, text) {
  const el = document.getElementById(id);
  el.className = 'auth-msg ' + type;
  el.textContent = text;
}
function clearAuthMsg(id) { const el = document.getElementById(id); el.className = 'auth-msg'; el.textContent = ''; }

function setLoggedIn(user, isPassive = false) {
  currentUser = user;
  // Mark as logged in so the splash screen skips on refresh
  localStorage.setItem('halden_logged_in', 'true');
  localStorage.setItem('halden_user_type', 'account');

  // Load user's saved cart and AI conversations from Supabase
  loadCartFromSupabase();
  loadCustomerAIConversations();

  if (!window.CUSTOMER_PAGE) {
    // Don't wipe the signup panel while the user is viewing the Step 3 success screen
    const onSignupStep3 = (signupStep === 3);

    const authLoggedIn = document.getElementById('auth-logged-in');
    if (authLoggedIn && !onSignupStep3) authLoggedIn.classList.add('on');
    const panelLogin = document.getElementById('panel-login');
    if (panelLogin && !onSignupStep3) panelLogin.classList.remove('active');
    const panelSignup = document.getElementById('panel-signup');
    if (panelSignup && !onSignupStep3) panelSignup.classList.remove('active');
    const authDisplayName = document.getElementById('auth-display-name');
    if (authDisplayName) authDisplayName.textContent = user.displayName || 'Welcome back!';
    const authDisplayEmail = document.getElementById('auth-display-email');
    if (authDisplayEmail) authDisplayEmail.textContent = user.email;
    const btnAuth = document.querySelector('.btn-auth');
    if (btnAuth) btnAuth.innerHTML = ' <span class="auth-label">Log Out</span>';
    const mobAuthBtn = document.getElementById('mob-auth-btn');
    if (mobAuthBtn) mobAuthBtn.innerHTML = 'Log Out';
  }

  if (!isPassive) {
    if (pendingCheckout) {
      const intent = pendingCheckout;
      pendingCheckout = null;
      closeAuth();
      setTimeout(() => { openCheckout(intent); }, 400);
    } else if (window.pendingFinalize) {
      window.pendingFinalize = false;
      closeAuth();
      // Resume the finalization — name package modal will open
      setTimeout(() => { openNamePkgModal(); }, 400);
    } else {
      // Just close the auth drawer
      closeAuth();
      // Auto-open Dashboard setting check
      if (localStorage.getItem('halden_auto_open_dash') === 'true') {
        window.location.href = 'customer.html';
      }
    }
  }

  // Safety Auto-Sync every 15 seconds
  setInterval(() => {
    if (currentUser) {
      console.log("Auto-Sync check for live meetings...");
      initCustomerMeetingListener();
    }
  }, 15000);

  // Toggle Profile button
  const pBtn = document.getElementById('btn-profile');
  const mPBtn = document.getElementById('mob-profile-link');
  if (pBtn) pBtn.style.display = 'flex';
  if (mPBtn) mPBtn.style.display = 'block';
}

function setLoggedOut() {
  currentUser = null;
  // Clear session flags so splash shows on next visit
  localStorage.removeItem('halden_customer');
  localStorage.removeItem('halden_logged_in');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('currentUserId');
  localStorage.removeItem('session_start');
  localStorage.removeItem('sb-nukbdmyqizrnkmbusdtm-auth-token');
  localStorage.removeItem('halden_auto_open_dash');
  localStorage.setItem('halden_user_type', '');

  // Clear cart upon logout
  cart = [];
  selectedCartIdx = null;
  renderCart();

  if (!window.CUSTOMER_PAGE) {
    const authLoggedIn = document.getElementById('auth-logged-in');
    if (authLoggedIn) authLoggedIn.classList.remove('on');
    const panelLogin = document.getElementById('panel-login');
    if (panelLogin) panelLogin.classList.add('active');
    const btnAuth = document.querySelector('.btn-auth');
    if (btnAuth) btnAuth.innerHTML = ' <span class="auth-label">Login / Sign Up</span>';
    const mobAuthBtn = document.getElementById('mob-auth-btn');
    if (mobAuthBtn) mobAuthBtn.innerHTML = 'Login / Sign Up';
  }

  // Toggle Profile button
  const pBtn = document.getElementById('btn-profile');
  const mPBtn = document.getElementById('mob-profile-link');
  if (pBtn) pBtn.style.display = 'none';
  if (mPBtn) mPBtn.style.display = 'none';

  // Reset Login form state
  const loginEmail = document.getElementById('login-email');
  if (loginEmail) loginEmail.value = '';
  const loginPass = document.getElementById('login-password');
  if (loginPass) loginPass.value = '';
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Login to My Account';
  }
  const loginMsg = document.getElementById('login-msg');
  if (loginMsg) {
    loginMsg.textContent = '';
    loginMsg.className = 'auth-msg';
  }
}

function confirmLogOut() {
  const modal = document.getElementById('logout-overlay');
  if (modal) {
    modal.classList.add('on');
  }
}
window.confirmLogOut = confirmLogOut;

function closeLogoutModal() {
  const modal = document.getElementById('logout-overlay');
  if (modal) {
    modal.classList.remove('on');
  }
}
window.closeLogoutModal = closeLogoutModal;

async function executeLogOut() {
  closeLogoutModal();
  const overlay = document.getElementById('logout-overlay');
  if (overlay) overlay.classList.remove('on');

  // === DAY 8: Sign out of Supabase Native Auth (invalidates real JWT) ===
  try { await window.supabaseClient.auth.signOut(); } catch (e) { /* non-fatal */ }

  // Clear all stored user data
  localStorage.removeItem('halden_customer');
  localStorage.removeItem('halden_logged_in');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('currentUserId');
  localStorage.removeItem('supabase.auth.token');
  localStorage.removeItem('halden_auto_open_dash');
  localStorage.setItem('halden_user_type', '');
  sessionStorage.removeItem('halden_admin');
  sessionStorage.removeItem('halden_staff');

  window.location.href = 'index.html';
}
window.executeLogOut = executeLogOut;

function handleAuthAction() {
  if (currentUser) {
    confirmLogOut();
  } else {
    openAuth();
  }
}
window.handleAuthAction = handleAuthAction;

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
    alert('Google connection failed. Please try again.');
  } finally {
    btns.forEach(b => { b.disabled = false; b.innerHTML = '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G"> Continue with Google'; });
  }
}
window.doGoogleLogin = doGoogleLogin;

// ===== LOGIN — Dual Auth (Native Auth with RPC fallback) =====
async function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value;

  if (!email || !pass) {
    return showAuthMsg('login-msg', 'error', 'Please enter your email and password.');
  }

  // === DAY 4: RATE LIMITING ===
  const lockoutUntil = localStorage.getItem('login_lockout_until');
  if (lockoutUntil && Date.now() < parseInt(lockoutUntil, 10)) {
    const remainingSeconds = Math.ceil((parseInt(lockoutUntil, 10) - Date.now()) / 1000);
    return showAuthMsg('login-msg', 'error', `Too many failed attempts. Please try again in ${remainingSeconds} seconds.`);
  }

  const btn = document.getElementById('login-btn');
  btn.disabled = true;
  btn.textContent = 'Logging in...';
  clearAuthMsg('login-msg');

  try {
    // === DAY 8: Use Supabase Native Auth — generates a real JWT ===
    const { data: authData, error: authError } = await window.supabaseClient.auth.signInWithPassword({
      email: email.toLowerCase(),
      password: pass
    });

    if (authError) throw new Error(authError.message);
    if (!authData || !authData.user) throw new Error('Invalid email or password.');

    // Fetch the full user profile from public.users (contains role, name, phone)
    const { data: profileData, error: profileError } = await window.supabaseClient
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profileData) throw new Error('Could not load user profile.');

    currentUser = profileData;
    currentUserId = profileData.id;

    // Reset rate limit on success
    localStorage.removeItem('login_attempts');
    localStorage.removeItem('login_lockout_until');

    // Store a clean flat user object (no token wrapper) so session restore works
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('currentUserId', currentUserId);
    localStorage.setItem('session_start', Date.now().toString());

    // Update last_login timestamp in Supabase (fire and forget)
    try {
      window.supabaseClient.from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', currentUserId)
        .then(() => {});
    } catch (e) { console.warn('Failed to update last_login', e); }

    // Update UI
    if (document.getElementById('logged-in-user')) {
      document.getElementById('logged-in-user').textContent = currentUser.name || currentUser.email;
    }

    // Role-based redirects
    const userRole = (currentUser.role || '').toLowerCase();
    if (userRole === 'admin') {
      sessionStorage.setItem('halden_admin', JSON.stringify(currentUser));
      window.location.href = 'admin.html';
      return;
    } else if (userRole === 'staff') {
      sessionStorage.setItem('halden_staff', JSON.stringify(currentUser));
      window.location.href = 'staff.html';
      return;
    }

    // For customers
    localStorage.setItem('halden_customer', JSON.stringify(currentUser));
    const dName = currentUser.name || (currentUser.fname ? `${currentUser.fname} ${currentUser.lname}` : 'User');
    if (typeof setLoggedIn === 'function') setLoggedIn({ displayName: dName, email: currentUser.email, uid: currentUser.id });

    closeAuth();
    if (typeof updateHeader === 'function') updateHeader();

    // Re-fetch everything as authenticated user
    if (typeof fetchCartItems === 'function') fetchCartItems();
    if (typeof loadCustomerCatalogFromSupabase === 'function') loadCustomerCatalogFromSupabase();
    if (typeof loadAllItemsFromSupabase === 'function') loadAllItemsFromSupabase();
    if (typeof loadAllPackagesFromSupabase === 'function') loadAllPackagesFromSupabase();

    if (pendingCheckout) {
      setTimeout(() => {
        openCheckoutModal(pendingCheckout.src, pendingCheckout.cartIdx);
        pendingCheckout = null;
      }, 500);
    }

  } catch (err) {
    console.error(err);
    const msg = err.message || '';
    const isInvalidCreds = msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('credentials') || msg.toLowerCase().includes('password');
    if (isInvalidCreds) {
      // === DAY 4: RATE LIMITING (Track Failed Attempts) ===
      let attempts = parseInt(localStorage.getItem('login_attempts') || '0', 10);
      attempts++;
      localStorage.setItem('login_attempts', attempts);
      if (attempts >= 5) {
        localStorage.setItem('login_lockout_until', (Date.now() + 60000).toString());
        showAuthMsg('login-msg', 'error', 'Too many failed attempts. Please try again in 60 seconds.');
      } else {
        showAuthMsg('login-msg', 'error', `Invalid email or password. (${5 - attempts} attempts remaining)`);
      }
    } else {
      showAuthMsg('login-msg', 'error', 'Login failed: ' + msg);
    }
  }

  btn.disabled = false;
  btn.textContent = 'Login to My Account';
}

// ===== SIGNUP =====
let signupData = {};
let signupStep = 1;
const EYE_OPEN = `<svg viewBox="0 0 24 24"><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>`;
const EYE_CLOSED = `<svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
function initPassToggles() {
  document.querySelectorAll('.pass-toggle').forEach(btn => {
    if (!btn.innerHTML.trim()) btn.innerHTML = EYE_OPEN;
  });
}
function togglePassVisibility(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const isHidden = el.type === 'password';
  el.type = isHidden ? 'text' : 'password';
  const btn = el.closest('.pass-input-wrap')?.querySelector('.pass-toggle');
  if (btn) btn.innerHTML = isHidden ? EYE_CLOSED : EYE_OPEN;
}
window.togglePassVisibility = togglePassVisibility;
document.addEventListener('DOMContentLoaded', initPassToggles);

function goToSignupStep(step) {
  signupStep = step;
  document.querySelectorAll('.signup-stage').forEach(s => s.classList.remove('active'));
  document.getElementById('signup-stage-' + step).classList.add('active');
  document.querySelectorAll('.signup-step').forEach((dot, idx) => { dot.classList.remove('active', 'done'); if (idx + 1 < step) dot.classList.add('done'); if (idx + 1 === step) dot.classList.add('active'); });
  if (step === 2) sendOtpEmail();
}
window.goToSignupStep = goToSignupStep;

// ===== TERMS AND CONDITIONS =====
function openTermsModal() {
  const modal = document.getElementById('terms-overlay');
  if (modal) modal.classList.add('on');
  setTimeout(checkTermsScroll, 100);
}
window.openTermsModal = openTermsModal;

function closeTermsModal() {
  const modal = document.getElementById('terms-overlay');
  if (modal) modal.classList.remove('on');
}
window.closeTermsModal = closeTermsModal;

function checkTermsScroll() {
  const content = document.getElementById('terms-content');
  const btnAccept = document.getElementById('btn-accept-terms');
  if (content && btnAccept) {
    if (content.scrollTop + content.clientHeight >= content.scrollHeight - 10) {
      btnAccept.disabled = false;
      btnAccept.style.opacity = '1';
      btnAccept.style.cursor = 'pointer';
      btnAccept.style.pointerEvents = 'auto';
    }
  }
}
window.checkTermsScroll = checkTermsScroll;

function acceptTerms() {
  closeTermsModal();
  const btnTerms = document.getElementById('btn-terms');
  const btnNext = document.getElementById('btn-signup-next');
  if (btnTerms) {
    btnTerms.classList.add('accepted');
    btnTerms.textContent = 'Terms Accepted ✓';
  }
  if (btnNext) {
    btnNext.disabled = false;
  }
}
window.acceptTerms = acceptTerms;

async function validateSignupStep1() {
  const fname = document.getElementById('signup-fname').value.trim(), lname = document.getElementById('signup-lname').value.trim(), mname = document.getElementById('signup-mname').value.trim();
  const phone = document.getElementById('signup-phone').value.trim(), email = document.getElementById('signup-email').value.trim();
  const pass = document.getElementById('signup-password').value, cpass = document.getElementById('signup-confirm-password').value;
  if (!fname || !lname || !phone || !email || !pass || !cpass) { showAuthMsg('signup-msg-1', 'error', 'Please fill in all required fields.'); return; }
  if (phone.length < 10) { showAuthMsg('signup-msg-1', 'error', 'Please enter a valid phone number.'); return; }
  if (!email.includes('@')) { showAuthMsg('signup-msg-1', 'error', 'Please enter a valid email.'); return; }
  if (!pass || pass.length < 8 || !/\d/.test(pass) || !/[!@#$%^&*()_+\-=\[\]{};:'"\\|,.<>/?]/.test(pass)) { showAuthMsg('signup-msg-1', 'error', 'Password must be at least 8 characters with 1 number and 1 special character.'); return; }
  if (pass !== cpass) { showAuthMsg('signup-msg-1', 'error', 'Passwords do not match.'); return; }

  // --- Check if email is already registered before going to step 2 ---
  const btn = document.getElementById('btn-signup-next');
  if (btn) { btn.disabled = true; btn.textContent = 'Checking...'; }
  try {
    const { data: emailExists } = await window.supabaseClient.rpc('check_email_exists', { lookup_email: email.toLowerCase() });
    if (emailExists && emailExists.id) {
      showAuthMsg('signup-msg-1', 'error', 'This email is already registered. Please log in instead.');
      if (btn) { btn.disabled = false; btn.textContent = 'Next: Verify Email →'; }
      return;
    }
  } catch (e) {
    // Non-fatal: if the RPC fails, proceed optimistically (Supabase signUp will catch it)
    console.warn('Email check failed, proceeding:', e);
  }
  if (btn) { btn.disabled = false; btn.textContent = 'Next: Verify Email →'; }

  signupData = { fname, lname, mname, phone, email, pass }; clearAuthMsg('signup-msg-1'); goToSignupStep(2);
}
window.validateSignupStep1 = validateSignupStep1;
let currentOtp = null, otpEmail = null;
function generateOtp() { return Math.floor(100000 + Math.random() * 900000).toString(); }
async function sendOtpEmail() {
  otpEmail = signupData.email || document.getElementById('signup-email')?.value?.trim();
  currentOtp = generateOtp();
  const desc = document.getElementById('otp-sent-desc');
  if (desc) desc.textContent = `A 6-digit code has been sent to ${otpEmail}. Check your inbox.`;
  
  const emailJsServiceId = "service_8hcbt1e";
  const emailJsTemplateId = "template_zwfupwo";

  if (!window.emailjs) {
    showAuthMsg('signup-msg-2', 'error', 'EmailJS failed to load. Please check your internet connection.');
    return;
  }

  showAuthMsg('signup-msg-2', 'success', `Sending email to ${otpEmail}...`);
  try { 
    await window.emailjs.send(emailJsServiceId, emailJsTemplateId, { 
      to_email: otpEmail, 
      to_name: signupData.fname || 'User', 
      otp_code: currentOtp 
    }); 
    showAuthMsg('signup-msg-2', 'success', `Verification code sent to ${otpEmail}`); 
  } catch (e) { 
    console.error(e);
    showAuthMsg('signup-msg-2', 'error', `Failed to send email: ${e.text || e.message}`); 
  }
}
window.sendOtpEmail = sendOtpEmail;
window.resendOtpEmail = async function () { clearAuthMsg('signup-msg-2'); await sendOtpEmail(); };

async function sendOtpToPhone() { 
  const phone = signupData.phone || document.getElementById('signup-phone')?.value?.trim(); 
  if (!phone) { showAuthMsg('signup-msg-2', 'error', 'No phone number on file.'); return; } 

  const proxyUrl = "https://sms-proxy-sigma.vercel.app/api/send-sms";

  // Normalize Philippine number: 09xxxxxxxxx → 639xxxxxxxxx
  let normalizedPhone = phone.replace(/\s+/g, '');
  if (normalizedPhone.startsWith('0')) {
    normalizedPhone = '63' + normalizedPhone.slice(1);
  }

  showAuthMsg('signup-msg-2', 'success', `Sending SMS to ${phone}...`);
  try {
    const res = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        number: normalizedPhone,
        message: `Your Halden's verification code is: ${currentOtp}`
      })
    });

    const data = await res.json();

    if (res.ok) {
      showAuthMsg('signup-msg-2', 'success', `SMS sent successfully to ${phone}.`);
    } else {
      throw new Error(data.error || 'Unknown error');
    }
  } catch (err) {
    console.error(err);
    showAuthMsg('signup-msg-2', 'error', `Failed to send SMS: ${err.message}`);
  }
}
window.sendOtpToPhone = sendOtpToPhone;
window.verifyOtp = async function () {
  const entered = (document.getElementById('otp-input')?.value || '').trim();
  if (entered.length !== 6) { showAuthMsg('signup-msg-2', 'error', 'Please enter the full 6-digit code.'); return; }
  if (entered !== currentOtp) { showAuthMsg('signup-msg-2', 'error', 'Incorrect code. Please try again or resend.'); return; }
  clearAuthMsg('signup-msg-2'); showAuthMsg('signup-msg-2', 'success', 'Code verified! Creating your account...');
  try {
    const { fname, lname, mname, phone, email, pass } = signupData;

    // === DAY 8: Sign up via Supabase Native Auth (generates real JWT) ===
    const { data: authData, error: authError } = await window.supabaseClient.auth.signUp({
      email: email.toLowerCase(),
      password: pass,
      options: {
        data: { role: 'customer', name: `${fname} ${lname}`, phone }
      }
    });

    if (authError) throw new Error(authError.message);
    if (!authData || !authData.user) throw new Error('Signup failed. Please try again.');

    const newId = authData.user.id;

    // Create the public profile using register_user RPC (stores bcrypt hash in vault too)
    const { error: dbError } = await window.supabaseClient.rpc('register_user', {
      p_id: newId,
      p_name: `${fname} ${lname}`,
      p_fname: fname,
      p_lname: lname,
      p_mname: mname,
      p_phone: phone,
      p_email: email.toLowerCase(),
      p_password: pass,
      p_role: 'customer'
    });

    if (dbError) {
      console.error('Profile creation error:', dbError);
      // Non-fatal: auth user was created, profile may already exist
    }

    const nameEl = document.getElementById('verified-name-display'); if (nameEl) nameEl.textContent = `${fname} ${lname}`;
    currentOtp = null; goToSignupStep(3);
  } catch (err) { console.error(err); showAuthMsg('signup-msg-2', 'error', 'Account creation failed: ' + err.message); }
};
function startCheckout(src, cartIdx = '') {
  let pkgName = '', pkgPrice = '', itemsList = [];
  if (src === 'pkg') {
    // Legacy premade package checkout — pkgName is passed in cartIdx position
    pkgName = cartIdx;
    const p = PKGS.find(x => x.name === pkgName);
    if (p && p.inc) itemsList = p.inc;
  }
  const intent = { src, pkgName, pkgPrice, itemsList, cartIdx };
  if (src === 'cartItem') {
    const idx = parseInt(cartIdx);
    const pkg = cart[idx];
    if (!pkg) { alert('Package not found.'); return; }
    if (!currentUser) {
      pendingCheckout = intent;
      openAuth();
      showAuthMsg('login-msg', 'success', 'Please log in or sign up to continue with your reservation.');
      toggleCart();
      return;
    }
    toggleCart();
    openCheckout(intent);
    return;
  }
  if (!currentUser) { pendingCheckout = intent; openAuth(); showAuthMsg('login-msg', 'success', 'Please log in or sign up to continue with your reservation.'); return; }
  openCheckout(intent);
}
window.startCheckout = startCheckout;
function openCheckout(intent) {
  document.getElementById('chk-modal-box').classList.add('open');
  document.getElementById('chk-modal-overlay').classList.add('on');
  document.body.style.overflow = 'hidden';
  const msgEl = document.getElementById('chk-msg');
  msgEl.className = 'auth-msg'; msgEl.textContent = ''; msgEl.style.display = 'none';
  document.getElementById('btn-confirm-res').disabled = false;
  const sumEl = document.getElementById('chk-summary');
  let html = '', totalNum = 0, totalStr = '₱0';
  let allCheckoutItems = [];
  if (intent.src === 'pkg') {
    if (intent.itemsList) { intent.itemsList.forEach(inc => { html += `<div style="margin-bottom:6px; color:#5c4f44; font-size:14px;">&bull; ${inc}</div>`; allCheckoutItems.push(inc); }); }
    html += `<div style="border-top:1px dashed rgba(203,161,83,0.4); margin: 15px 0;"></div>`;
    html += `<div style="display:flex; justify-content:space-between; align-items:center;">
               <span style="font-size:18px; color:#5c4f44; font-family:'Times New Roman', serif;">Estimated Total</span>
               <span id="chk-final-amt" style="font-size:24px; font-weight:700; color:#cba153; font-family:'Times New Roman', serif;">${intent.pkgPrice}</span>
             </div>`;
  } else if (intent.src === 'cartItem') {
    const idx = parseInt(intent.cartIdx);
    const c = cart[idx];
    if (!c) { sumEl.innerHTML = '<p>Error: Package not found.</p>'; return; }
    totalNum = c.price;
    if (c.items && c.items.length) {
      c.items.forEach(inc => { html += `<div style="margin-bottom:6px; color:#5c4f44; font-size:14px;">&bull; ${inc.name}</div>`; allCheckoutItems.push(inc.name); });
    }
    html += `<div style="border-top:1px dashed rgba(203,161,83,0.4); margin: 15px 0;"></div>`;
    totalStr = '₱' + totalNum.toLocaleString();
    html += `<div style="display:flex; justify-content:space-between; align-items:center;">
               <span style="font-size:18px; color:#5c4f44; font-family:'Times New Roman', serif;">Estimated Total</span>
               <span id="chk-final-amt" style="font-size:24px; font-weight:700; color:#cba153; font-family:'Times New Roman', serif;">${totalStr}</span>
             </div>`;
  } else {
    cart.forEach(c => {
      totalNum += c.price;
      if (c.items && c.items.length) { 
        c.items.forEach(inc => { html += `<div style="margin-bottom:6px; color:#5c4f44; font-size:14px;">&bull; ${inc.name}</div>`; allCheckoutItems.push(inc.name); }); 
      }
    });
    html += `<div style="border-top:1px dashed rgba(203,161,83,0.4); margin: 15px 0;"></div>`;
    totalStr = '₱' + totalNum.toLocaleString();
    html += `<div style="display:flex; justify-content:space-between; align-items:center;">
               <span style="font-size:18px; color:#5c4f44; font-family:'Times New Roman', serif;">Estimated Total</span>
               <span id="chk-final-amt" style="font-size:24px; font-weight:700; color:#cba153; font-family:'Times New Roman', serif;">${totalStr}</span>
             </div>`;
  }

  // Determine the source package for VIP/meeting/venue details
  const sourcePkg = intent.src === 'cartItem' ? cart[parseInt(intent.cartIdx)] : (cart.length > 0 ? cart[0] : null);
  let pkgTitle = intent.src === 'pkg' ? intent.pkgName : (sourcePkg ? sourcePkg.name : '');
  window.pendingPackageName = pkgTitle;

  // Build packageItems directly from the cart item's items array (most reliable source)
  // allCheckoutItems may be empty if built through an unexpected code path
  if (sourcePkg && Array.isArray(sourcePkg.items) && sourcePkg.items.length > 0) {
    window.pendingPackageItems = sourcePkg.items.map(i => (typeof i === 'object' ? i.name : String(i))).filter(Boolean);
  } else {
    window.pendingPackageItems = allCheckoutItems;
  }
  console.log('[Checkout] pendingPackageItems count:', window.pendingPackageItems.length, '| from sourcePkg.items:', sourcePkg?.items?.length || 0);

  window.pendingCheckoutCartIdx = intent.src === 'cartItem' ? parseInt(intent.cartIdx) : null;

  if (sourcePkg) {
    window.pendingIsVIP = sourcePkg.isVIP || false;
    window.pendingVipCount = sourcePkg.vipCount || 0;
    window.pendingVipService = sourcePkg.vipService || '';
    window.pendingProposedMeetings = sourcePkg.meetingTimes || [];
    window.pendingPricingMode = sourcePkg.pricingMode || 'item-based';
    window.pendingSelectedTier = sourcePkg.selectedTier || null;
    window.pendingDesc = sourcePkg.desc || sourcePkg.description || '';
    window.pendingVenueLocation = sourcePkg.venueLocation || '';
    window.pendingActivePkgId = sourcePkg.activePkgId || null;
    window.pendingPricePerHead = sourcePkg.pricePerHead || 0;
  } else {
    window.pendingIsVIP = false;
    window.pendingVipCount = 0;
    window.pendingVipService = '';
    window.pendingProposedMeetings = [];
    window.pendingPricingMode = 'item-based';
    window.pendingSelectedTier = null;
    window.pendingDesc = '';
    window.pendingVenueLocation = '';
    window.pendingActivePkgId = null;
    window.pendingPricePerHead = 0;
  }
  const venueInput = document.getElementById('chk-venue');
  const dateInput = document.getElementById('chk-date');
  const timeframeInput = document.getElementById('chk-timeframe');
  const typeInput = document.getElementById('chk-type');
  const themeInput = document.getElementById('chk-theme');
  const paxInput = document.getElementById('chk-pax');

  if (sourcePkg) {
    if (venueInput) venueInput.value = sourcePkg.venue || '';
    if (dateInput) dateInput.value = sourcePkg.date || '';
    if (timeframeInput) timeframeInput.value = sourcePkg.time || '';
    if (typeInput) typeInput.value = sourcePkg.occasion || '';
    if (themeInput) themeInput.value = sourcePkg.theme || '';
    if (paxInput) paxInput.value = sourcePkg.pax || '';
  } else {
    if (venueInput) venueInput.value = '';
    if (dateInput) dateInput.value = '';
    if (timeframeInput) timeframeInput.value = '';
    if (typeInput) typeInput.value = intent.pkgName || '';
    if (themeInput) themeInput.value = '';
    if (paxInput) paxInput.value = '50';
  }

  sumEl.innerHTML = html;
  // Render extra info (VIP/Meeting Times)
  const extraInfo = document.getElementById('chk-extra-info');
  if (extraInfo) {
    let extraHtml = '';
    let hasExtra = false;
    cart.forEach((pkg, idx) => {
      if (pkg.isVIP || (pkg.meetingTimes && pkg.meetingTimes.length > 0)) {
        hasExtra = true;
        extraHtml += `<div style="margin-bottom:10px; color:#5c4f44; font-size:13px; line-height:1.6; display:flex; justify-content:space-between; align-items:flex-start;">`;
        extraHtml += `<div>`;
        extraHtml += `<div style="font-size:11px; color:#cba153; text-transform:uppercase; font-weight:800; letter-spacing:1px; margin-bottom:4px;">${pkg.name}</div>`;
        if (pkg.isVIP) {
          extraHtml += `<strong>VIPs:</strong> ${pkg.vipCount} pax (${pkg.vipService})<br/>`;
        }
        if (pkg.meetingTimes && pkg.meetingTimes.length > 0) {
          extraHtml += `<strong>Proposed Meetings:</strong><br/>`;
          pkg.meetingTimes.forEach(mt => {
            extraHtml += `&nbsp;&bull; ${mt.date} (${mt.start} - ${mt.end})<br/>`;
          });
        }
        extraHtml += `</div>`;
        extraHtml += `</div>`;
      }
    });
    if (hasExtra) {
      extraInfo.style.display = 'block';
      extraInfo.innerHTML = extraHtml;
    } else {
      extraInfo.style.display = 'none';
      extraInfo.innerHTML = '';
    }
  }
}

function toggleVIPFields() {
  const check = document.getElementById('cpkg-vip-check');
  const fields = document.getElementById('cpkg-vip-fields');
  if (fields && check) {
    fields.style.display = check.checked ? 'block' : 'none';
  }
}

function openMeetingTimeModal() {
  document.getElementById('mt-time-overlay').classList.add('on');
  document.getElementById('mt-time-modal').classList.add('open');
}

function closeMeetingTimeModal() {
  document.getElementById('mt-time-overlay').classList.remove('on');
  document.getElementById('mt-time-modal').classList.remove('open');
}

function addMeetingTimeSlot() {
  const dateVal = document.getElementById('mt-date-input').value;
  const start = document.getElementById('mt-start-input').value;
  const end = document.getElementById('mt-end-input').value;

  let errors = [];

  if (!dateVal) {
    errors.push('Please select a date for the meeting.');
  }

  // ── Duplicate check ──
  const isDuplicate = preferredMeetingTimes.some(mt => mt.date === dateVal && mt.start === start && mt.end === end);
  if (isDuplicate) {
    errors.push('That specific meeting time has already been inputted. Please choose a different time or date.');
  }

  // ── Limit check ──
  if (preferredMeetingTimes.length >= 3) {
    errors.push('You can only propose a maximum of 3 preferred meeting times.');
  }

  // ── Meeting date must not be in the past ──
  const meetDate = new Date(dateVal + 'T00:00:00');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (!isNaN(meetDate.getTime())) {
    if (meetDate < today) {
      errors.push('The meeting date you selected has already passed. Please select a current or future date.');
    }

    // ── Meeting date must be within the current week (Mon–Sun of this week) ──
    const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    // Start of this week = Monday
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    startOfWeek.setHours(0, 0, 0, 0);
    // End of this week = Sunday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    if (meetDate < startOfWeek || meetDate > endOfWeek) {
      errors.push('Meeting schedule needs to be within this week of you submitting this reservation. Please select a date within the current week so the meeting can happen promptly.');
    }
  }

  // ── Meeting timeframe must be at least 2 hours ──
  const toMinutes = (t) => {
    const [h, m] = t.split(':').map(Number);
    return (isNaN(h) || isNaN(m)) ? null : h * 60 + m;
  };
  const startMin = toMinutes(start);
  const endMin = toMinutes(end);
  if (startMin !== null && endMin !== null) {
    if ((endMin - startMin) < 120) {
      errors.push('The meeting time frame is too short. A meeting session must be at least 2 hours long to be productive and worthwhile.');
    }
  }

  if (errors.length > 0) {
    if (typeof openErrorModal === 'function') openErrorModal(errors.join(' also '));
    else alert(errors.join('\n\n'));
    return;
  }

  preferredMeetingTimes.push({ date: dateVal, start, end });
  renderMeetingTimes();
  closeMeetingTimeModal();
}


function removeMeetingTimeSlot(idx) {
  preferredMeetingTimes.splice(idx, 1);
  renderMeetingTimes();
}

function renderMeetingTimes() {
  const list = document.getElementById('meeting-times-list');
  if (!list) return;

  if (preferredMeetingTimes.length === 0) {
    list.innerHTML = '';
    return;
  }

  list.innerHTML = preferredMeetingTimes.map((mt, idx) => `
    <div class="mt-list-item">
      <div class="mt-info">
        <div class="mt-date">${mt.date}</div>
        <div class="mt-time">${mt.start} - ${mt.end}</div>
      </div>
      <button class="btn-rm-mt" onclick="removeMeetingTimeSlot(${idx})"></button>
    </div>
  `).join('');
}

window.toggleVIPFields = toggleVIPFields;
window.openMeetingTimeModal = openMeetingTimeModal;
window.closeMeetingTimeModal = closeMeetingTimeModal;
window.addMeetingTimeSlot = addMeetingTimeSlot;
window.removeMeetingTimeSlot = removeMeetingTimeSlot;

function closeCheckout() {
  document.getElementById('chk-modal-box').classList.remove('open');
  document.getElementById('chk-modal-overlay').classList.remove('on');
  document.body.style.overflow = '';
}
window.closeCheckout = closeCheckout;

// ===== ORDER CONFIRMATION (ARE YOU SURE?) =====
function openOrderConfirmation() {
  const packageName = window.pendingPackageName || 'Custom Event';
  const pax = document.getElementById('chk-pax').value || '50';
  const totalStr = document.getElementById('chk-final-amt').textContent || '₱0';

  const nameEl = document.getElementById('oc-package-name');
  const paxEl = document.getElementById('oc-guest-count');
  const priceEl = document.getElementById('oc-total-price');
  const confirmBtn = document.getElementById('oc-confirm-btn');

  if (nameEl) nameEl.textContent = packageName;
  if (paxEl) paxEl.textContent = pax + ' Pax';
  if (priceEl) priceEl.textContent = totalStr;

  if (confirmBtn) {
    confirmBtn.onclick = () => {
      closeOrderConfirmation();
      submitReservation();
    };
  }

  const overlay = document.getElementById('order-confirm-overlay');
  if (overlay) {
    overlay.classList.add('on');
    overlay.style.display = 'flex';
  }
}

function closeOrderConfirmation() {
  const overlay = document.getElementById('order-confirm-overlay');
  if (overlay) {
    overlay.classList.remove('on');
    overlay.style.display = 'none';
  }
}

window.openOrderConfirmation = openOrderConfirmation;
window.closeOrderConfirmation = closeOrderConfirmation;

async function submitReservation() {
  const dateObj = document.getElementById('chk-date').value;
  const time = document.getElementById('chk-timeframe').value;
  const type = document.getElementById('chk-type').value;
  const theme = document.getElementById('chk-theme').value;
  const pax = document.getElementById('chk-pax').value;
  const venueStr = document.getElementById('chk-venue').value.trim();
  const paymentMethod = document.getElementById('chk-payment-method').value;
  const amountStr = document.getElementById('chk-final-amt').textContent;
  const msgEl = document.getElementById('chk-msg');
  // Grab description and venue location from the cart package (stored on window.pendingDesc / pendingVenueLocation)
  const descVal = window.pendingDesc || '';
  const cityVal = window.pendingVenueLocation || '';

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
    const _debugCartIdx = window.pendingCheckoutCartIdx;
    const _debugCartItem = (typeof _debugCartIdx === 'number' && _debugCartIdx !== null && cart[_debugCartIdx])
      ? cart[_debugCartIdx]
      : (cart.length > 0 ? cart[0] : null);
    console.log('[submitReservation] city:', cityVal, '| cart item:', _debugCartItem?.name, '| cart items count:', _debugCartItem?.items?.length || 0, '| pendingPackageItems:', (window.pendingPackageItems||[]).length);
    const resRef = await addDoc(collection(window.firebaseDB, 'reservations'), {
      "mandatory-meeting concluded": "none",
      client: currentUser.displayName || currentUser.name || 'Guest',
      email: currentUser.email,
      type,
      theme,
      packageName: window.pendingPackageName || 'Custom Event',
      paymentMethod,
      packageItems: (() => {
        // Build item list directly from the cart item being checked out (most reliable)
        const cidx = window.pendingCheckoutCartIdx;
        const cartItem = (typeof cidx === 'number' && cidx !== null && cart[cidx])
          ? cart[cidx]
          : (cart.length > 0 ? cart[0] : null);
        if (cartItem && Array.isArray(cartItem.items) && cartItem.items.length > 0) {
          return cartItem.items.map(i => typeof i === 'object' ? (i.name || '') : String(i)).filter(Boolean);
        }
        return window.pendingPackageItems || [];
      })(),
      description: descVal,
      venueLocation: cityVal,
      date: fmtDate,
      time: time || 'TBD',
      pax: parseInt(pax),
      amount: amountStr.replace('Starting ', ''),
      venue: venueStr || 'TBD',
      coords: lastMapCoords,
      status: 'pending',
      createdAt: new Date().toISOString(),
      isVIP: window.pendingIsVIP || false,
      vipCount: window.pendingVipCount || 0,
      vipService: window.pendingVipService || '',
      proposedMeetingTimes: window.pendingProposedMeetings || [],
      pricingMode: window.pendingPricingMode || 'item-based',
      selectedTier: window.pendingSelectedTier || null,
      activePkgId: window.pendingActivePkgId || null,
      pricePerHead: window.pendingPricePerHead || 0,
      packageOrigin: (() => {
        const mode = window.pendingPricingMode || '';
        if (mode === 'majorly_set') return 'majorly set';
        if (mode === 'tiered')      return 'majorly set';
        if (mode === 'per_head')    return 'dynamically set';
        return 'custom';
      })(),
      freeChoiceFoodItem: (() => {
        const cidx = window.pendingCheckoutCartIdx;
        const cartItem = (typeof cidx === 'number' && cidx !== null && cart[cidx])
          ? cart[cidx]
          : (cart.length > 0 ? cart[0] : null);
        if (cartItem && Array.isArray(cartItem.items)) {
          const fc = cartItem.items.find(i => i.isFreeChoiceApplied);
          if (fc) return fc.name;
        }
        return null;
      })()
    });

    // Reservation saved —  payment happens later via the customer dashboard
    msgEl.className = 'auth-msg success';
    msgEl.textContent = 'Reservation submitted successfully! Awaiting admin approval.';
    msgEl.style.display = 'block';

    if (typeof window.pendingCheckoutCartIdx === 'number' && window.pendingCheckoutCartIdx !== null) {
      removeCartPkg(window.pendingCheckoutCartIdx);
      window.pendingCheckoutCartIdx = null;
    } else {
      cart = [];
      if (typeof saveCartToSupabase === 'function') saveCartToSupabase();
      renderCart();
    }
    lastMapCoords = null;
    renderCat();

    setTimeout(() => {
      if (typeof closeCheckout === 'function') closeCheckout();
      window.location.href = 'customer.html';
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

function closeResWaitModal() {
  document.getElementById('res-wait-overlay').classList.remove('on');
  document.getElementById('res-wait-modal').classList.remove('open');
  openProfile();
}
window.closeResWaitModal = closeResWaitModal;

// ===== CUSTOMER MEETING HUB SYNC =====
let liveMeetingUnsubscribe = null;
let activeCustomerMeeting = null;
let activeCustomerReservation = null;
let meetingRoomUnsub = null;    // for MTG- room join listener (meetings doc)
let reservationRoomUnsub = null; // for live reservation doc sync during meeting

function updateJoinButton(mt) {
  const joinBtn = document.getElementById('cp-btn-live-join');
  if (mt) {
    window.pendingActiveMeeting = mt;
    if (joinBtn) {
      joinBtn.disabled = false;
      joinBtn.style.opacity = '1';
      joinBtn.style.cursor = 'pointer';
    }
  } else {
    window.pendingActiveMeeting = null;
    if (joinBtn) {
      joinBtn.disabled = true;
      joinBtn.style.opacity = '0.6';
      joinBtn.style.cursor = 'not-allowed';
    }
  }
}

function initCustomerMeetingListener() {
  if (!currentUser || !window.firebaseDB) return;
  const { collection, query, where, onSnapshot } = window.firebaseFns;
  const db = window.firebaseDB;

  if (liveMeetingUnsubscribe) liveMeetingUnsubscribe();

  // We query specifically by email to comply with common Firestore Security Rules
  const userEmail = (currentUser.email || "").toLowerCase().trim();
  const q = query(collection(db, 'meetings'),
    where('status', '==', 'live'),
    where('customerEmail', '==', userEmail)
  );

  console.log("Starting Meeting Sync for:", userEmail);

  liveMeetingUnsubscribe = onSnapshot(q, (snap) => {
    console.log("Meeting Snapshot Update - Matches Found:", snap.size);
    const userName = (currentUser.displayName || currentUser.name || "").toLowerCase().trim();
    const myMeetingDoc = snap.docs.find(d => {
      const data = d.data();
      const emailMatch = (data.customerEmail || "").toLowerCase().trim() === userEmail;
      const nameMatch = (data.customerName || "").toLowerCase().trim() === userName;
      return emailMatch || nameMatch;
    });

    if (myMeetingDoc) {
      const mt = { id: myMeetingDoc.id, ...myMeetingDoc.data() };
      console.log("Match Found! Meeting ID:", mt.id);
      if (!activeCustomerMeeting || activeCustomerMeeting.id !== mt.id) {
        updateJoinButton(mt);
        const notifMsg = 'A meeting is live! Click "Join Live Meeting" in the top bar to enter.';
        // Show toast
        const t = document.createElement('div');
        t.className = 'toast';
        t.textContent = notifMsg;
        document.body.appendChild(t);
        setTimeout(() => t.classList.add('show'), 10);
        setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 5000);
      } else {
        updateCustomerMeetingUI(mt);
      }
    } else {
      // but only if we don't have a match yet
      if (!activeCustomerMeeting) {
        checkNameFallback();
      } else {
        updateJoinButton(null);
        closeCustomerMeetingHub();
      }
    }
  }, (err) => {
    console.error("Meeting Listener Error (Check Rules/Indexes):", err);
  });
}

async function checkNameFallback() {
  const { collection, getDocs, query, where } = window.firebaseFns;
  const userName = (currentUser.displayName || currentUser.name || "").toLowerCase().trim();
  if (!userName) return;

  const q = query(collection(window.firebaseDB, 'meetings'),
    where('status', '==', 'live'),
    where('customerName', '==', userName)
  );

  try {
    const snap = await getDocs(q);
    if (!snap.empty) {
      const mt = { id: snap.docs[0].id, ...snap.docs[0].data() };
      updateJoinButton(mt);
    } else {
      updateJoinButton(null);
    }
  } catch (e) { }
}

window.joinLiveMeeting = async function() {
  const mt = window.pendingActiveMeeting;
  if (!mt) return;
  const btn = document.getElementById('cp-btn-live-join');
  if (btn) { btn.disabled = true; btn.textContent = 'Joining...'; }
  
  try {
    openCustomerMeetingHub(mt);
    startMeetingRoomListener(mt.id);
    if (btn) { btn.disabled = false; btn.innerHTML = 'Join Live Meeting &rarr;'; }
  } catch (e) {
    console.error('joinLiveMeeting error:', e);
    if (btn) { btn.disabled = false; btn.innerHTML = 'Join Live Meeting &rarr;'; }
    const errorDiv = document.getElementById('meeting-join-error');
    if (errorDiv) { errorDiv.textContent = ' Could not join meeting. Please try again.'; errorDiv.style.display = 'block'; setTimeout(() => errorDiv.style.display = 'none', 4000); }
  }
};

async function openCustomerMeetingHub(meeting) {
  activeCustomerMeeting = meeting;
  activeCustomerReservation = null;
  const overlay = document.getElementById('c-mt-mode-overlay');
  if (overlay) overlay.style.display = 'flex';

  document.getElementById('c-mt-mode-subtitle').textContent = meeting.agenda + ' with Halden Events';

  const videoBtn = document.getElementById('c-mt-video-btn');
  const roomIdDisplay = document.getElementById('c-mt-room-id');
  if (meeting.roomId) {
    if (videoBtn) videoBtn.style.display = 'block';
    if (roomIdDisplay) {
      roomIdDisplay.textContent = meeting.roomId;
      roomIdDisplay.style.display = 'block';
    }
  } else {
    if (videoBtn) videoBtn.style.display = 'none';
    if (roomIdDisplay) roomIdDisplay.style.display = 'none';
  }

  // Populate Agenda checklist
  const agendaContainer = document.getElementById('c-mt-agenda');
  const topics = (meeting.agenda || '').split(',').map(t => t.trim()).filter(t => t);
  agendaContainer.innerHTML = topics.map(t => `
    <div style="display:flex; align-items:center; gap:12px; padding:12px; background:rgba(255,255,255,0.03); border-radius:10px; border:1px solid rgba(255,255,255,0.05);">
      <i class="fas fa-check-circle" style="color:var(--primary); opacity:0.3;"></i>
      <span style="font-size:14px; color:var(--text);">${t}</span>
    </div>
  `).join('');

  // Show/hide nav buttons based on agenda
  const ag = (meeting.agenda || '').toUpperCase();
  const navBtns = { venue: 'VENUE', food: 'FOOD', design: 'DESIGN', rundown: 'RUNDOWN', payment: 'PAYMENT', logistics: 'ADDITIONAL' };
  Object.entries(navBtns).forEach(([key, kw]) => {
    const el = document.getElementById('btn-c-mt-nav-' + key);
    if (el) el.style.display = ag.includes(kw) ? 'inline-block' : 'none';
  });

  // Fetch linked reservation for full panel rendering
  if (meeting.reservationId && window.firebaseDB) {
    try {
      const { doc, getDoc } = window.firebaseFns;
      const rSnap = await getDoc(doc(window.firebaseDB, 'reservations', meeting.reservationId));
      if (rSnap.exists()) activeCustomerReservation = { id: rSnap.id, ...rSnap.data() };
    } catch (e) { console.warn('Could not fetch reservation for customer hub:', e); }
  }

  updateCustomerMeetingUI(meeting);
  toggleCustomerMtPanel(meeting.activeTab || 'res');
}

function updateCustomerMeetingUI(meeting) {
  activeCustomerMeeting = meeting;

  // --- isModifying banner ---
  let banner = document.getElementById('c-mt-modifying-banner');
  const content = document.getElementById('c-mt-content');
  if (meeting.isModifying) {
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'c-mt-modifying-banner';
      banner.style.cssText = 'display:flex; align-items:center; gap:10px; background:rgba(196,154,60,0.12); border:1px solid rgba(196,154,60,0.4); border-radius:10px; padding:10px 16px; margin-bottom:14px; font-size:13px; color:#c49a3c; font-weight:600;';
      banner.innerHTML = '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#c49a3c;animation:pulse 1.2s infinite;"></span> Admin is modifying the package — updates will appear here automatically.';
      if (content && content.parentNode) content.parentNode.insertBefore(banner, content);
    }
    banner.style.display = 'flex';

    // If liveDraft exists in the meeting, show it in the panel immediately
    if (meeting.liveDraft) {
      renderCustomerLiveDraft(meeting.liveDraft);
    }
  } else {
    const wasModifying = banner && banner.style.display !== 'none';
    if (banner) banner.style.display = 'none';
    // Clear any live draft overlay
    const draftOverlay = document.getElementById('c-mt-live-draft-overlay');
    if (draftOverlay) draftOverlay.remove();

    // If we just exited modify mode, restore the normal view
    if (wasModifying) {
      toggleCustomerMtPanel(meeting.activeTab || 'res');
    }

    // If the reservation listener isn't attached yet, attach it now that we know the reservationId
    if (meeting.reservationId && window._attachReservationListener && !reservationRoomUnsub) {
      window._attachReservationListener(meeting.reservationId);
    }
  }

  // Real-time Notes Sync
  const notesEl = document.getElementById('c-mt-notes');
  if (notesEl) {
    const newNotes = meeting.notes || "The admin is currently updating meeting notes...";
    if (notesEl.textContent !== newNotes) notesEl.textContent = newNotes;
  }

  // Real-time Tab Following
  const currentActive = document.querySelector('#c-mt-nav .btn-outline.active');
  const currentTabId = currentActive ? currentActive.id.replace('btn-c-mt-nav-', '') : '';

  if (meeting.activeTab && currentTabId !== meeting.activeTab) {
    // Admin switched to a different tab — follow them
    console.log("Admin switched tab to:", meeting.activeTab);
    toggleCustomerMtPanel(meeting.activeTab);
  } else {
    // Admin is on the same tab OR activeTab not set — still re-render live panels
    const liveRenderTabs = ['food', 'logistics'];
    if (liveRenderTabs.includes(currentTabId)) {
      toggleCustomerMtPanel(currentTabId);
    }
  }

  // Sync Video Room
  const videoBtn = document.getElementById('c-mt-video-btn');
  const roomIdDisplay = document.getElementById('c-mt-room-id');
  if (videoBtn) {
    if (meeting.isVideoEnabled && meeting.roomId) {
      videoBtn.style.display = 'block';
      if (roomIdDisplay) {
        roomIdDisplay.textContent = meeting.roomId;
        roomIdDisplay.style.display = 'block';
      }
    } else {
      videoBtn.style.display = 'none';
      if (roomIdDisplay) roomIdDisplay.style.display = 'none';
    }
  }

  // ===== Shared Documents Sync =====
  syncCustomerSharedDocs(meeting);

  // ===== Live Design Tab Doc Sync =====
  // Re-render the design upload list in real time when admin uploads pictures
  const designListEl = document.getElementById('c-design-upload-list');
  if (designListEl && window.renderCustomerUploadList) {
    window.renderCustomerUploadList('c-design-upload-list', 'design');
  }

  // ===== Live Design Notes Sync =====
  // When admin types notes for a decoration item, update it in real time on customer side
  if (meeting.designNotes && typeof meeting.designNotes === 'object') {
    Object.entries(meeting.designNotes).forEach(function([itemName, note]) {
      const safeId = 'c-dnote-' + itemName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      const noteEl = document.getElementById(safeId);
      if (noteEl && note) noteEl.textContent = note;
    });
  }

  // ===== Initial Fee Payment Modal Sync =====
  renderCustomerInitialFeeModal(meeting);
}

function syncCustomerSharedDocs(meeting) {
  const docsContainer = document.getElementById('c-mt-shared-docs-main');
  if (!docsContainer) return;

  // Helper to render one document tile
  const renderDocTile = (d) => {
    const isPDF = d.type === 'application/pdf' || (d.name || '').toLowerCase().endsWith('.pdf');
    const isImg = d.type && d.type.startsWith('image/');
    const previewUrl = isPDF ? d.url.replace('/upload/', '/upload/pg_1,f_jpg,w_200,c_limit/') : d.url;
    return `
      <a href="${d.url}" target="_blank" style="display:flex; flex-direction:column; gap:8px; text-decoration:none;">
        <div style="aspect-ratio:1; background:rgba(196,154,60,0.06); border:1px solid rgba(196,154,60,0.2); border-radius:8px; overflow:hidden; display:flex; align-items:center; justify-content:center; transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          ${(isImg || isPDF)
            ? `<img src="${previewUrl}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'" />`
            : `<div style="font-size:24px; color:#c49a3c; font-weight:800;">DOC</div>`}
        </div>
        <div style="font-size:11px; font-weight:600; color:#333; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; text-align:center;">${d.name}</div>
      </a>
    `;
  };

  // Always include the reservation's signed contract if it exists
  const res = activeCustomerReservation || {};
  const contractUrl = res.contractUrl || res.signedContractUrl || null;
  const contractDoc = contractUrl ? [{ url: contractUrl, name: 'Signed Contract', type: contractUrl.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/png' }] : [];

  // Only show explicitly 'res'-tagged docs in Shared Documents (contract docs only, no design pics)
  const sharedDocs = meeting.sharedDocuments
    ? meeting.sharedDocuments.filter(d => d.agenda === 'res')
    : [];
  const allDocs = [...contractDoc, ...sharedDocs];

  if (allDocs.length > 0) {
    docsContainer.innerHTML = `
      <div style="font-size:11px; color:#c49a3c; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:14px;">Shared Documents</div>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(90px, 1fr)); gap:14px;">
      ${allDocs.map(d => renderDocTile(d)).join('')}
      </div>
    `;
  } else {
    docsContainer.innerHTML = `
      <div style="font-size:11px; color:#c49a3c; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:14px;">Shared Documents</div>
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:30px 10px; border:1px dashed rgba(196,154,60,0.3); border-radius:12px; background:rgba(196,154,60,0.02); gap:10px; text-align:center;">
         <div style="font-size:13px; color:#888;">Any documents or pictures shared by the coordinator will appear here.</div>
      </div>
    `;
  }
}


window.renderCustomerInitialFeeModal = function(meeting) {
  let modal = document.getElementById('c-mt-initial-fee-modal');
  const feeStatus = meeting.initialFeeStatus;

  // If no fee triggered, or if not the active reservation, remove modal if exists
  if (!feeStatus || feeStatus === 'declined_24h') {
    if (modal) modal.remove();
    return;
  }

  // Prevent "paid" from constantly reappearing for the same meeting
  if (feeStatus === 'paid' && localStorage.getItem('fee_paid_' + meeting.id)) {
    if (modal) modal.remove();
    return;
  }

  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'c-mt-initial-fee-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:999999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);';
    document.body.appendChild(modal);
  }

  if (feeStatus === 'triggered') {
    modal.innerHTML = `
      <div style="background:#fdfaf5; padding:32px; border-radius:16px; width:90%; max-width:440px; border:1px solid #e8dcc8; text-align:center; box-shadow:0 12px 40px rgba(0,0,0,0.3);">
        <div style="width:48px; height:48px; border-radius:50%; background:rgba(196,154,60,0.15); display:flex; align-items:center; justify-content:center; margin:0 auto 16px;">
          <i class="fas fa-file-invoice-dollar" style="color:#c49a3c; font-size:20px;"></i>
        </div>
        <h2 style="margin:0 0 8px 0; font-size:22px; color:#111;">Initial Reservation Fee</h2>
        <p style="margin:0 0 24px 0; font-size:13px; color:#666; line-height:1.5;">To secure your event date and slot, please settle the initial fee of <b>&#8369;5,000.00</b>. This amount is non-refundable and will be deducted from your total contract price.</p>
        
        <div style="font-size:32px; font-weight:800; color:#c49a3c; margin-bottom:28px;">&#8369;5,000.00</div>
        
        <div style="display:flex; flex-direction:column; gap:12px;">
          <button class="btn-primary" onclick="payInitialFeeOnline('${meeting.reservationId}', '${meeting.id}')" style="width:100%; justify-content:center; background:#c49a3c; color:#000; padding:14px; font-size:14px;">
            <i class="fas fa-credit-card"></i> Pay Online
          </button>
          <button class="btn-primary" onclick="selectInitialFeeCash('${meeting.id}')" style="width:100%; justify-content:center; background:rgba(196,154,60,0.1); border:1px solid rgba(196,154,60,0.3); color:#000; padding:14px; font-size:14px;">
            <i class="fas fa-money-bill-wave"></i> Pay in Person (Cash)
          </button>
          <button class="btn-primary" onclick="selectInitialFeeGcash('${meeting.id}')" style="width:100%; justify-content:center; background:rgba(0,123,255,0.1); border:1px solid rgba(0,123,255,0.3); color:#007bff; padding:14px; font-size:14px;">
            <i class="fas fa-mobile-alt"></i> Pay through GCash
          </button>
          <button onclick="postponeInitialFee('${meeting.id}')" style="width:100%; justify-content:center; background:transparent; border:none; color:#666; padding:8px; font-size:13px; text-decoration:underline; cursor:pointer; font-weight:500;">
            I can't pay right now
          </button>
        </div>
      </div>
    `;
  } else if (feeStatus === 'cash_pending') {
    modal.innerHTML = `
      <div style="background:#fdfaf5; padding:32px; border-radius:16px; width:90%; max-width:440px; border:1px solid #e8dcc8; text-align:center; box-shadow:0 12px 40px rgba(0,0,0,0.3);">
        <div style="width:48px; height:48px; border-radius:50%; background:rgba(196,154,60,0.15); display:flex; align-items:center; justify-content:center; margin:0 auto 16px;">
          <i class="fas fa-hourglass-half" style="color:#c49a3c; font-size:20px; animation: pulse 2s infinite;"></i>
        </div>
        <h2 style="margin:0 0 8px 0; font-size:22px; color:#111;">Pending Cash Payment</h2>
        <p style="margin:0 0 24px 0; font-size:13px; color:#666; line-height:1.5;">Please proceed to hand over the <b>&#8369;5,000.00</b> cash to our staff. We will confirm your payment here shortly.</p>
      </div>
    `;
  } else if (feeStatus === 'gcash_pending' || feeStatus === 'gcash_dismissed') {
    const errorNotice = feeStatus === 'gcash_dismissed' 
      ? `<div style="background:rgba(255,80,80,0.1); color:#e23636; border:1px solid rgba(255,80,80,0.3); padding:10px; border-radius:8px; font-size:12px; margin-bottom:16px;">The admin could not verify your payment. Please re-upload a clear screenshot of your GCash proof.</div>` 
      : '';
    modal.innerHTML = `
      <div style="background:#fdfaf5; padding:32px; border-radius:16px; width:90%; max-width:440px; border:1px solid #e8dcc8; text-align:center; box-shadow:0 12px 40px rgba(0,0,0,0.3);">
        ${errorNotice}
        <div style="width:48px; height:48px; border-radius:50%; background:rgba(0,123,255,0.15); display:flex; align-items:center; justify-content:center; margin:0 auto 16px;">
          <i class="fas fa-mobile-alt" style="color:#007bff; font-size:20px;"></i>
        </div>
        <h2 style="margin:0 0 8px 0; font-size:22px; color:#111;">GCash Payment</h2>
        <p style="margin:0 0 16px 0; font-size:13px; color:#666; line-height:1.5;">Please send <b>&#8369;5,000.00</b> to the GCash account below, then upload the screenshot proof.</p>
        
        <div style="background:#fff; border:1px solid #ddd; border-radius:12px; padding:16px; margin-bottom:20px;">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=09123456789" alt="GCash QR" style="width:150px; height:150px; object-fit:contain; margin-bottom:10px; background:#f5f5f5; border-radius:8px;" />
          <div style="font-size:14px; font-weight:700; color:#333;">Alden Lopenario</div>
          <div style="font-size:13px; color:#666;">0912 345 6789</div>
        </div>

        <input type="file" id="c-mt-gcash-upload" accept="image/*" style="display:none;" onchange="uploadGcashProof(event, '${meeting.id}')" />
        <div style="display:flex; gap:10px;">
          <button onclick="cancelInitialFeeGcash('${meeting.id}')" style="flex:1; justify-content:center; background:transparent; border:1px solid #ddd; color:#666; padding:14px; font-size:14px; border-radius:8px; cursor:pointer; display:flex; align-items:center; gap:8px;">
            <i class="fas fa-arrow-left"></i> Back
          </button>
          <button class="btn-primary" onclick="document.getElementById('c-mt-gcash-upload').click()" style="flex:2; justify-content:center; background:#007bff; color:#fff; padding:14px; font-size:14px;">
            <i class="fas fa-upload"></i> Upload Screenshot Proof
          </button>
        </div>
      </div>
    `;
  } else if (feeStatus === 'gcash_proof_uploaded') {
    modal.innerHTML = `
      <div style="background:#fdfaf5; padding:32px; border-radius:16px; width:90%; max-width:440px; border:1px solid #e8dcc8; text-align:center; box-shadow:0 12px 40px rgba(0,0,0,0.3);">
        <div style="width:48px; height:48px; border-radius:50%; background:rgba(196,154,60,0.15); display:flex; align-items:center; justify-content:center; margin:0 auto 16px;">
          <i class="fas fa-hourglass-half" style="color:#c49a3c; font-size:20px; animation: pulse 2s infinite;"></i>
        </div>
        <h2 style="margin:0 0 8px 0; font-size:22px; color:#111;">Verifying Payment</h2>
        <p style="margin:0 0 24px 0; font-size:13px; color:#666; line-height:1.5;">Your screenshot has been sent to the admin. Please wait while they verify your GCash payment.</p>
      </div>
    `;
  } else if (feeStatus === 'paid') {
    localStorage.setItem('fee_paid_' + meeting.id, 'true');
    modal.innerHTML = `
      <div style="background:#fdfaf5; padding:32px; border-radius:16px; width:90%; max-width:440px; border:1px solid #e8dcc8; text-align:center; box-shadow:0 12px 40px rgba(0,0,0,0.3);">
        <div style="width:48px; height:48px; border-radius:50%; background:rgba(46,160,67,0.15); display:flex; align-items:center; justify-content:center; margin:0 auto 16px;">
          <i class="fas fa-check" style="color:#2ea043; font-size:20px;"></i>
        </div>
        <h2 style="margin:0 0 8px 0; font-size:22px; color:#111;">Payment Successful!</h2>
        <p style="margin:0 0 24px 0; font-size:13px; color:#666; line-height:1.5;">Thank you for committing and trusting our services. Your event date is now fully secured.</p>
        <button class="btn-primary" onclick="document.getElementById('c-mt-initial-fee-modal').remove()" style="width:100%; justify-content:center; background:#2ea043; color:#fff; padding:14px; font-size:14px;">
          Continue to Meeting
        </button>
      </div>
    `;
    setTimeout(() => { const m = document.getElementById('c-mt-initial-fee-modal'); if (m) m.remove(); }, 6000);
  }
};

window.payInitialFeeOnline = async function(resId, meetingId) {
  const btn = event.target.closest('button');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...'; }
  
  try {
    const apiRes = await fetch('/api/paymongo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ name: 'Initial Reservation Fee', price: 5000 }],
        customerInfo: { name: currentUser?.displayName || 'Customer', email: currentUser?.email, type: 'Event' },
        reservationId: resId,
        meetingId: meetingId,
        paymentType: 'initial_fee'
      })
    });
    const data = await apiRes.json();
    if (data.checkout_url) {
      window.location.href = data.checkout_url;
    } else {
      throw new Error(data.error || 'Could not create payment session. Try again.');
    }
  } catch (e) {
    alert('Payment error: ' + e.message);
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-credit-card"></i> Pay Online'; }
  }
};

window.selectInitialFeeCash = async function(meetingId) {
  const btn = event.target.closest('button');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...'; }
  
  try {
    const sb = window.supabaseClient;
    if (sb) {
      await sb.from('meetings').update({ initial_fee_status: 'cash_pending' }).eq('id', meetingId);
    }
  } catch(e) {
    alert('Failed to select cash payment.');
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-money-bill-wave"></i> Pay in Person (Cash)'; }
  }
};

window.selectInitialFeeGcash = async function(meetingId) {
  const btn = event.target.closest('button');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...'; }
  
  try {
    const sb = window.supabaseClient;
    if (sb) {
      await sb.from('meetings').update({ initial_fee_status: 'gcash_pending' }).eq('id', meetingId);
    }
  } catch(e) {
    alert('Failed to select GCash payment.');
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-mobile-alt"></i> Pay through GCash'; }
  }
};

window.cancelInitialFeeGcash = async function(meetingId) {
  const btn = event.target.closest('button');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>'; }
  
  try {
    const sb = window.supabaseClient;
    if (sb) {
      await sb.from('meetings').update({ initial_fee_status: 'triggered' }).eq('id', meetingId);
    }
  } catch(e) {
    alert('Failed to go back.');
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-arrow-left"></i> Back'; }
  }
};


window.uploadCustomerMtFile = async function(event, agenda) {
  const file = event.target.files[0];
  if (!file || !activeCustomerMeeting) return;
  const mtId = activeCustomerMeeting.id;
  
  const progEl = document.getElementById('c-' + agenda + '-upload-progress');
  if (progEl) progEl.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Uploading...';

  const formData = new FormData();
  formData.append('upload_preset', 'test_default');
  formData.append('folder', 'catering');
  formData.append('file', file);

  try {
    const url = 'https://api.cloudinary.com/v1_1/dg8ytmck5/auto/upload';
    const res = await fetch(url, { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Cloudinary upload failed');
    const data = await res.json();
    
    // Append to existing shared documents
    let docs = activeCustomerMeeting.sharedDocuments || [];
    docs.push({
      url: data.secure_url,
      name: file.name,
      type: file.type,
      agenda: agenda,
      delete_token: data.delete_token
    });
    
    // Update Supabase
    const { error } = await window.supabaseClient.from('meetings').update({ shared_documents: docs }).eq('id', mtId);
    if (error) throw error;
    
    // Update Firebase as fallback
    const { doc, updateDoc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'meetings', mtId), { sharedDocuments: docs });
    
    // Update local meeting cache so renderCustomerUploadList works immediately
    activeCustomerMeeting.sharedDocuments = docs;
    
    // Re-render the upload list so the newly uploaded file appears right away
    if (window.renderCustomerUploadList) {
      window.renderCustomerUploadList('c-' + agenda + '-upload-list', agenda);
    }
    
    if (progEl) progEl.innerHTML = '<span style="color:#27ae60;">Upload successful!</span>';
    setTimeout(() => { if(progEl) progEl.innerHTML = ''; }, 3000);
  } catch (e) {
    if (progEl) progEl.innerHTML = '<span style="color:var(--red);">Upload failed: ' + e.message + '</span>';
  }
  
  event.target.value = ''; // reset input
};

window.renderCustomerUploadList = function(containerId, agenda) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const docs = (activeCustomerMeeting && activeCustomerMeeting.sharedDocuments) || [];
  const filtered = docs.filter(d => {
    if (agenda === 'design') {
      // Show design-tagged docs AND legacy untagged docs, but NOT explicitly 'res'-tagged
      return d.agenda === 'design' || (d.agenda !== 'res');
    }
    return (d.agenda || 'res') === agenda;
  });
  
  if (filtered.length === 0) {
    container.innerHTML = '<div style="color:#aaa; font-size:12px; text-align:center;">No reference pictures uploaded.</div>';
    return;
  }
  
  container.innerHTML = filtered.map(d => {
    const isPDF = d.type === 'application/pdf' || (d.name && d.name.toLowerCase().endsWith('.pdf'));
    const isImg = d.type && d.type.startsWith('image/');
    let previewHtml = '';

    if (isImg || isPDF) {
      const displayUrl = isPDF ? d.url.replace('/upload/', '/upload/pg_1,f_jpg,w_400,c_limit/') : d.url;
      previewHtml = `<img src="${displayUrl}" style="width:50px; height:50px; object-fit:cover; border-radius:4px; border:1px solid #ddd;" />`;
    } else {
      previewHtml = `<div style="width:50px; height:50px; background:#f0f0f0; display:flex; align-items:center; justify-content:center; font-size:20px; border-radius:4px; color:#aaa;"><i class="fas fa-file"></i></div>`;
    }

    return `
      <div style="display:flex; align-items:center; gap:12px; padding:10px; background:#fff; border:1px solid #eee; border-radius:8px;">
        ${previewHtml}
        <div style="flex:1; overflow:hidden;">
          <div style="font-size:12px; font-weight:600; color:#333; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${d.name}</div>
          <a href="${d.url}" target="_blank" style="font-size:10px; color:#c49a3c; text-decoration:none;">View Full</a>
        </div>
      </div>
    `;
  }).join('');
};

window.uploadGcashProof = async function(event, meetingId) {
  const file = event.target.files[0];
  if (!file) return;

  const btn = event.target.nextElementSibling; // The upload button
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Uploading...'; }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'test_default');
  formData.append('folder', 'catering');

  try {
    const url = 'https://api.cloudinary.com/v1_1/dg8ytmck5/auto/upload';
    const res = await fetch(url, { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Cloudinary upload failed');
    const data = await res.json();
    const proofUrl = data.secure_url;

    const sb = window.supabaseClient;
    if (sb) {
      await sb.from('meetings').update({ 
        initial_fee_status: 'gcash_proof_uploaded',
        initial_fee_received_by: proofUrl
      }).eq('id', meetingId);
    }
  } catch(e) {
    alert('Upload failed: ' + e.message);
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-upload"></i> Upload Screenshot Proof'; }
  }
};

window.postponeInitialFee = async function(meetingId) {
  const btn = event.target.closest('button');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...'; }
  
  try {
    const sb = window.supabaseClient;
    if (sb) {
      const deadline = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      await sb.from('meetings').update({ 
        initial_fee_status: 'declined_24h',
        initial_fee_deadline: deadline
      }).eq('id', meetingId);
    }
  } catch(e) {
    alert('Failed to postpone payment.');
    if (btn) { btn.disabled = false; btn.innerHTML = "I can't pay right now"; }
  }
};

// Renders the live draft modification view over the reservation panel
function renderCustomerLiveDraft(draft) {
  const content = document.getElementById('c-mt-content');
  if (!content) return;

  // Always force the nav to 'res' tab so the live view shows correctly
  document.querySelectorAll('#c-mt-nav .btn-outline').forEach(b => b.classList.remove('active'));
  const resBtn = document.getElementById('btn-c-mt-nav-res');
  if (resBtn) resBtn.classList.add('active');
  const title = document.getElementById('c-mt-panel-title');
  if (title) title.textContent = 'Package Modification — Live';

  const res = activeCustomerReservation || {};
  const items = draft.items || [];
  const total = draft.total || 0;
  const vipCount = parseInt(draft.vip || 0);

  function fmtT(t) {
    if (!t) return '—';
    const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!m) return t;
    if (m[3]) return t.toUpperCase();
    let h = parseInt(m[1]); const min = m[2];
    const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
    return h + ':' + min + ' ' + ap;
  }
  function fmtTRange(s) {
    if (!s) return '—';
    if (s.includes(' - ')) return s.split(' - ').map(p => fmtT(p.trim())).join(' – ');
    return fmtT(s);
  }

  // Group items by category for catalog display
  let catalogItems = window.customerCatalogItems || [];
  
  if (window.cMtCatalogCat && window.cMtCatalogCat !== 'all') {
    catalogItems = catalogItems.filter(i => i.cat === window.cMtCatalogCat);
  }
  if (window.cMtCatalogSearch && window.cMtCatalogSearch.trim()) {
    const q = window.cMtCatalogSearch.toLowerCase();
    catalogItems = catalogItems.filter(i => i.name.toLowerCase().includes(q) || (i.desc || '').toLowerCase().includes(q));
  }

  const addedNames = new Set(items.map(it => it.name.toLowerCase()));

  const catalogHTML = `
    <div style="margin-bottom:12px;">
      <input type="text" placeholder="Search catalog..." style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid rgba(196,154,60,0.3); font-size:13px; background:#fff;" oninput="updateCustomerCatalogFilter('search', this.value)" value="${window.cMtCatalogSearch || ''}">
    </div>
    <div style="display:flex; gap:6px; margin-bottom:14px; overflow-x:auto; padding-bottom:4px; font-size:11px;">
      ${['all','drink','food','dessert','decoration','entertainment','equipment'].map(c => `
        <button onclick="updateCustomerCatalogFilter('cat', '${c}')" style="background:${window.cMtCatalogCat===c?'#c49a3c':'rgba(196,154,60,0.1)'}; color:${window.cMtCatalogCat===c?'#fff':'#a08030'}; border:none; padding:4px 10px; border-radius:12px; cursor:pointer; text-transform:capitalize; white-space:nowrap; font-weight:700;">${c}</button>
      `).join('')}
    </div>
    <div style="display:flex; flex-direction:column; gap:8px;">
      ${catalogItems.map(it => {
        const isAdded = addedNames.has(it.name.toLowerCase());
        return `
          <div style="background:#fff; border-radius:8px; border:1px solid #e8dcc8; padding:12px;">
            <div style="font-size:10px; color:#a08030; text-transform:uppercase; font-weight:800; letter-spacing:1px; margin-bottom:4px;">${it.cat}</div>
            <div style="color:#333; font-weight:700; font-size:14px; margin-bottom:4px;">${it.name}</div>
            <div style="font-size:11px; color:#777; line-height:1.4; margin-bottom:10px;">${it.desc || ''}</div>
            ${it.price > 0 ? `<div style="font-size:13px; font-weight:800; color:#c49a3c; margin-bottom:10px;">₱${it.price.toLocaleString()}</div>` : ''}
            ${isAdded 
              ? `<div style="background:rgba(76,175,80,0.1); color:#2e7d32; text-align:center; padding:6px; border-radius:6px; font-size:12px; font-weight:700;">✓ Added to Package</div>`
              : `<div style="background:#f9f9f9; color:#aaa; text-align:center; padding:6px; border-radius:6px; font-size:12px; font-weight:600;">Available (Admin control)</div>`
            }
          </div>
        `;
      }).join('') || '<div style="color:#aaa; font-size:13px; padding:16px; text-align:center;">No items found.</div>'}
    </div>
  `;

  content.innerHTML = `
    <div style="border:2px solid rgba(196,154,60,0.55); border-radius:14px; overflow:hidden; background:#fffdf7;">
      <!-- Header bar -->
      <div style="background:linear-gradient(135deg,rgba(196,154,60,0.18),rgba(196,154,60,0.05)); padding:12px 20px; border-bottom:1px solid rgba(196,154,60,0.25); display:flex; align-items:center; gap:10px;">
        <span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:#c49a3c;animation:pulse 1.2s infinite;flex-shrink:0;"></span>
        <div style="flex:1;">
          <div style="font-size:13px; font-weight:800; color:#c49a3c;">LIVE PACKAGE MODIFICATION IN PROGRESS</div>
          <div style="font-size:11px; color:#a08030; margin-top:1px;">The admin is building your updated package. All changes below are happening right now.</div>
        </div>
        <div style="background:rgba(196,154,60,0.1); border:1px solid rgba(196,154,60,0.3); border-radius:8px; padding:6px 14px; text-align:center; flex-shrink:0;">
          <div style="font-size:10px; color:#888; text-transform:uppercase; font-weight:700;">Running Total</div>
          <div style="font-size:18px; font-weight:800; color:#c49a3c;">₱${total.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1.1fr 1fr;">
        <!-- Left: Details + item list -->
        <div style="padding:18px 20px; border-right:1px solid rgba(196,154,60,0.15);">
          <div style="font-size:11px; color:#c49a3c; font-weight:700; text-transform:uppercase; margin-bottom:10px; letter-spacing:1px;">Event Details</div>
          <div style="display:grid; grid-template-columns:120px 1fr; gap:7px 12px; font-size:13px; align-items:start; margin-bottom:16px;">
            <div style="color:#888; font-size:11px; font-weight:700; text-transform:uppercase;">Event Date</div><div style="color:#333; font-weight:600;">${draft.date || '—'}</div>
            <div style="color:#888; font-size:11px; font-weight:700; text-transform:uppercase;">Time</div><div style="color:#333; font-weight:600;">${fmtTRange(draft.time)}</div>
            <div style="color:#888; font-size:11px; font-weight:700; text-transform:uppercase;">Guest Count</div><div style="color:#333; font-weight:600;">${draft.pax || '—'} pax</div>
            <div style="color:#888; font-size:11px; font-weight:700; text-transform:uppercase;">VIPs</div><div style="color:#333; font-weight:600;">${vipCount > 0 ? vipCount + ' VIP guest' + (vipCount > 1 ? 's' : '') : 'None'}</div>
            <div style="color:#888; font-size:11px; font-weight:700; text-transform:uppercase;">Theme / Motif</div><div style="color:#333; font-weight:600;">${draft.theme || '—'}</div>
            <div style="color:#888; font-size:11px; font-weight:700; text-transform:uppercase;">Event Type</div><div style="color:#333; font-weight:600;">${draft.type || '—'}</div>
            <div style="color:#888; font-size:11px; font-weight:700; text-transform:uppercase;">Venue</div><div style="color:#333; font-weight:600; line-height:1.4;">${draft.venue || '—'}</div>
            ${draft.venueAddr ? `<div style="color:#888; font-size:11px; font-weight:700; text-transform:uppercase;">Address</div><div style="color:#555; font-size:12px; line-height:1.4;">${draft.venueAddr}</div>` : ''}
          </div>

          <div style="font-size:11px; color:#c49a3c; font-weight:700; text-transform:uppercase; margin-bottom:8px; letter-spacing:1px; display:flex; align-items:center; gap:8px;">
            Current Items
            <span style="background:rgba(196,154,60,0.15); border-radius:99px; padding:2px 9px; font-size:10px;">${items.length}</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:16px; max-height:240px; overflow-y:auto; padding-right:6px;">
            ${(() => {
              if (items.length === 0) return '<div style="color:#bbb; font-size:13px; padding:10px 0; text-align:center;">No items yet.</div>';
              const grouped = {};
              items.forEach(it => {
                const cat = (it.cat || 'OTHER').toUpperCase();
                if (!grouped[cat]) grouped[cat] = [];
                grouped[cat].push(it);
              });
              return Object.keys(grouped).map(cat => `
                <div>
                  <div style="font-size:10px; color:#aaa; font-weight:700; letter-spacing:1px; margin-bottom:8px; text-transform:uppercase; border-bottom:1px solid #eee; padding-bottom:4px;">${cat}</div>
                  <div style="display:flex; flex-direction:column; gap:5px;">
                    ${grouped[cat].map(it => {
                      let priceHtml = '';
                      const origin = draft.packageOrigin || res.packageOrigin || 'custom';
                      if (origin === 'custom' && !(it.cat === 'drink' && it.identify !== 'drinks_package')) {
                        const p = parseInt(draft.pax || res.pax) || 0;
                        const dp = window.getDynamicPrice ? window.getDynamicPrice(it, p) : (it.price || 0);
                        if (it.isIndividual || it.batchSize) {
                          const rule = it.isIndividual ? 'per head' : `per ${it.batchSize} pax`;
                          priceHtml = `
                            <div style="text-align:right;">
                              <div style="font-size:12px; color:#c49a3c; font-weight:700; white-space:nowrap;">&#8369;${dp.toLocaleString()} <span style="font-size:10px; color:#aaa; font-weight:normal;">(&#8369;${(it.price || 0).toLocaleString()})</span></div>
                              <div style="font-size:9px; color:#aaa; font-style:italic;">${rule}</div>
                            </div>
                          `;
                        } else if (dp > 0) {
                          priceHtml = `<div style="font-size:12px; color:#c49a3c; font-weight:700; white-space:nowrap;">&#8369;${dp.toLocaleString()}</div>`;
                        }
                      } else if (it.price > 0) {
                        priceHtml = `<div style="font-size:12px; color:#c49a3c; font-weight:700; white-space:nowrap;">&#8369;${it.price.toLocaleString()}</div>`;
                      }
                      return `
                      <div style="display:flex; justify-content:space-between; align-items:center; padding:7px 11px; background:#fdfaf5; border-radius:7px; border:1px solid #ede8db; font-size:13px;">
                        <div>
                          <div style="color:#333; font-weight:600;">${it.name}</div>
                        </div>
                        ${priceHtml}
                      </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              `).join('');
            })()}
          </div>
        </div>

        <!-- Right: Live catalog-style breakdown -->
        <div style="padding:18px 20px; background:rgba(249,246,240,0.6);">
          <div style="font-size:11px; color:#c49a3c; font-weight:700; text-transform:uppercase; margin-bottom:12px; letter-spacing:1px; display:flex; align-items:center; gap:7px;">
            <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#c49a3c;animation:pulse 1.2s infinite;"></span>
            Full Item Catalog
          </div>
          <div style="max-height:440px; overflow-y:auto;">${window.customerCatalogItems.length > 0 ? catalogHTML : '<div style="color:#aaa; font-size:13px; padding:16px; text-align:center;">Loading catalog...</div>'}</div>
        </div>
      </div>
    </div>
  `;
}


window.closeCustomerMeetingHub = function () {
  activeCustomerMeeting = null;
  activeCustomerReservation = null;
  if (meetingRoomUnsub) { meetingRoomUnsub(); meetingRoomUnsub = null; }
  if (reservationRoomUnsub) { reservationRoomUnsub(); reservationRoomUnsub = null; }
  window._attachReservationListener = null;
  const overlay = document.getElementById('c-mt-mode-overlay');
  if (overlay) overlay.style.display = 'none';
  // Remove the modifying banner if it exists
  const banner = document.getElementById('c-mt-modifying-banner');
  if (banner) banner.remove();
}

// ===== MEETING ROOM JOIN (by MTG- ID) =====

window.joinMeetingRoom = async function (passedRoomId) {
  const input = document.getElementById('meeting-room-id-input');
  const errorDiv = document.getElementById('meeting-join-error');
  
  const roomId = (passedRoomId || (input ? input.value : '')).trim().toUpperCase();
  if (!roomId) return;
  
  if (!roomId.startsWith('MTG-')) {
    if (errorDiv) { errorDiv.textContent = ' Please enter a valid Meeting Room ID (e.g. MTG-XXXXXXXX)'; errorDiv.style.display = 'block'; setTimeout(() => errorDiv.style.display = 'none', 4000); }
    return;
  }
  const btn = document.querySelector('[onclick="joinMeetingRoom()"]');
  if (btn) { btn.disabled = true; btn.textContent = 'Joining...'; }
  try {
    await waitForFirebase();
    const { collection, getDocs, query, where } = window.firebaseFns;
    // First try: live meetings only
    let snap = await getDocs(query(collection(window.firebaseDB, 'meetings'), where('meetingRoomId', '==', roomId), where('status', '==', 'live')));
    // Fallback: any status (in case admin hasn't set live yet)
    if (snap.empty) snap = await getDocs(query(collection(window.firebaseDB, 'meetings'), where('meetingRoomId', '==', roomId)));
    if (snap.empty) {
      if (errorDiv) { errorDiv.textContent = ' Meeting room not found or session has ended.'; errorDiv.style.display = 'block'; setTimeout(() => errorDiv.style.display = 'none', 5000); }
      if (btn) { btn.disabled = false; btn.textContent = 'Join →'; }
      return;
    }
    const mt = { id: snap.docs[0].id, ...snap.docs[0].data() };
    openCustomerMeetingHub(mt);
    startMeetingRoomListener(mt.id);
    if (btn) { btn.disabled = false; btn.textContent = 'Join →'; }
    if (input) input.value = '';
    if (errorDiv) errorDiv.style.display = 'none';
  } catch (e) {
    console.error('joinMeetingRoom error:', e);
    if (errorDiv) { errorDiv.textContent = ' Could not join meeting. Please try again.'; errorDiv.style.display = 'block'; }
    if (btn) { btn.disabled = false; btn.textContent = 'Join →'; }
  }
};


function startMeetingRoomListener(meetingId) {
  if (meetingRoomUnsub) { meetingRoomUnsub(); meetingRoomUnsub = null; }
  if (reservationRoomUnsub) { reservationRoomUnsub(); reservationRoomUnsub = null; }

  const sb = window.supabaseClient;
  if (!sb) { console.error('[startMeetingRoomListener] No supabaseClient'); return; }

  // Helper: fetch meeting row and call updateCustomerMeetingUI
  const fetchAndUpdate = async () => {
    const { data, error } = await sb.from('meetings').select('*').eq('id', meetingId).single();
    if (error) { console.error('[meetingListener] fetch error:', error.message); return; }
    if (!data) return;

    if (data.status === 'completed') {
      const overlay = document.getElementById('c-mt-mode-overlay');
      if (overlay && overlay.style.display !== 'none') {
        overlay.style.display = 'none';
        showMeetingCompletedPopup(data);
        return; // Don't keep updating the room UI after completion
      }
    }

    // Normalise: map snake_case DB columns to camelCase so existing UI code works
    updateCustomerMeetingUI({
      id: data.id,
      reservationId: data.reservation_id,
      agenda: data.topic,
      status: data.status,
      meetingRoomId: data.room_id,
      notes: data.meeting_notes || data.notes || '',
      activeTab: data.active_tab || '',
      isModifying: !!data.is_modifying,
      liveDraft: data.live_draft || null,
      isLive: !!data.is_live,
      sharedDocuments: data.shared_documents || data.sharedDocuments || null,
      designNotes: data.design_notes || {},
      downpaymentAmount: data.downpayment_amount ?? null,
      downpaymentDueDate: data.downpayment_due_date || null,
      nextMeetingDate: data.next_meeting_date || null,
      nextMeetingTime: data.next_meeting_time || null,
      nextMeetingAgendas: data.next_meeting_agendas || null,
      initialFeeStatus: data.initial_fee_status || null,
      initialFeeMethod: data.initial_fee_method || null,
      initialFeePaidAt: data.initial_fee_paid_at || null,
      initialFeeDeadline: data.initial_fee_deadline || null,
      live_draft_logistics: data.live_draft_logistics || null,
    });
  };

  // Initial fetch
  fetchAndUpdate();

  // Subscribe to realtime changes on this specific meeting row
  const channel = sb.channel('meeting-room-' + meetingId)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'meetings',
      filter: `id=eq.${meetingId}`
    }, () => { fetchAndUpdate(); })
    .subscribe();

  // Unsub function
  meetingRoomUnsub = () => { sb.removeChannel(channel); };

function showMeetingCompletedPopup(data) {
  // Check if we already have a wrapper, else create one
  let popupWrap = document.getElementById('mtg-completed-popup-wrap');
  if (!popupWrap) {
    popupWrap = document.createElement('div');
    popupWrap.id = 'mtg-completed-popup-wrap';
    popupWrap.style.position = 'fixed';
    popupWrap.style.top = '0';
    popupWrap.style.left = '0';
    popupWrap.style.width = '100vw';
    popupWrap.style.height = '100vh';
    popupWrap.style.backgroundColor = 'rgba(0,0,0,0.5)';
    popupWrap.style.display = 'flex';
    popupWrap.style.justifyContent = 'center';
    popupWrap.style.alignItems = 'center';
    popupWrap.style.zIndex = '999999';
    document.body.appendChild(popupWrap);
  }

  // Parse the agenda — Supabase column is 'agenda'; 'topic' is a legacy alias
  let agendas = [];
  const _agendaSource = data.agenda || data.topic || '';
  if (_agendaSource) {
    agendas = _agendaSource.split(',').map(s => s.trim()).filter(Boolean);
  }

  let agendaHTML = agendas.map(a => `<div style="background:rgba(196,154,60,0.1); color:var(--gold); padding:8px 12px; border-radius:8px; font-size:13px; font-weight:600; margin-bottom:8px;">${a}</div>`).join('');

  popupWrap.innerHTML = `
    <div style="background:var(--bg3); border:1px solid var(--border); border-radius:16px; padding:30px; width:400px; max-width:90%; position:relative; box-shadow:0 10px 30px rgba(0,0,0,0.2);">
      <button onclick="document.getElementById('mtg-completed-popup-wrap').style.display='none'" style="position:absolute; top:20px; right:20px; background:none; border:none; color:var(--text-dim); font-size:24px; cursor:pointer; line-height:1;">&times;</button>
      
      <div style="text-align:center; margin-bottom:20px;">
        <div style="width:60px; height:60px; background:var(--green-bg); color:var(--green); border-radius:50%; display:flex; justify-content:center; align-items:center; font-size:28px; font-weight:bold; margin:0 auto 16px auto;">✓</div>
        <h3 style="margin:0; font-family:'Playfair Display', serif; color:var(--text); font-size:22px;">Meeting Completed</h3>
        <p style="margin:10px 0 0 0; font-size:13px; color:var(--text-dim);">The admin has marked this session as completed.</p>
      </div>

      <div style="margin-top:24px;">
        <div style="font-size:11px; color:var(--text-dim); font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:12px;">Completed Agenda</div>
        ${agendaHTML || '<div style="font-size:13px; color:var(--text-mid);">No specific agenda items.</div>'}
      </div>
      
      <button onclick="document.getElementById('mtg-completed-popup-wrap').style.display='none'" class="btn-primary" style="width:100%; margin-top:30px; padding:12px; border-radius:10px; font-weight:700;">Close</button>
    </div>
  `;
  popupWrap.style.display = 'flex';
}

  // --- Listener 2: reservation doc (package items, pax, theme, etc.) ---
  // We attach it as soon as we have the reservation ID
  const attachReservationListener = (reservationId) => {
    if (!reservationId) return;
    if (reservationRoomUnsub) { reservationRoomUnsub(); reservationRoomUnsub = null; }
    reservationRoomUnsub = onSnapshot(doc(window.firebaseDB, 'reservations', reservationId), (rSnap) => {
      if (!rSnap.exists()) return;
      const freshRes = { id: rSnap.id, ...rSnap.data() };
      activeCustomerReservation = freshRes;
      // Re-render whichever panel is currently active
      const activeBtn = document.querySelector('#c-mt-nav .btn-outline.active');
      const currentPanel = activeBtn ? activeBtn.id.replace('btn-c-mt-nav-', '') : 'res';
      toggleCustomerMtPanel(currentPanel);
    });
  };

  // If we already have the reservation ID from when the hub was opened, attach now.
  // Otherwise the meeting listener will populate it on first fire.
  if (activeCustomerMeeting && activeCustomerMeeting.reservationId) {
    attachReservationListener(activeCustomerMeeting.reservationId);
  }

  // Expose so updateCustomerMeetingUI can attach it once meeting doc arrives
  window._attachReservationListener = attachReservationListener;
}

window.toggleCustomerMtPanel = function (panel) {
  document.querySelectorAll('#c-mt-nav .btn-outline').forEach(b => b.classList.remove('active'));
  const navBtn = document.getElementById('btn-c-mt-nav-' + panel);
  if (navBtn) navBtn.classList.add('active');

  const title = document.getElementById('c-mt-panel-title');
  const content = document.getElementById('c-mt-content');
  const mt = activeCustomerMeeting || {};
  const res = activeCustomerReservation || {};
  const panelTitles = { res: 'Reservation Review', food: 'Food Tasting', design: 'Design & Decoration', rundown: 'Final Program Rundown', logistics: 'Additional Reservation Details', payment: 'Payment Assessment' };
  if (title) title.textContent = panelTitles[panel] || 'Reservation Review';
  if (!content) return;

  // ===== RESERVATION PANEL =====
  if (panel === 'res') {
    // If admin is currently modifying and a draft exists, show live draft instead
    if (mt.isModifying && mt.liveDraft) {
      renderCustomerLiveDraft(mt.liveDraft);
      return;
    }

    const items = res.packageItems || [];
    const vipCount = parseInt(res.vipCount || 0);

    // Helper to format time to 12-hour AM/PM
    function fmtTime(t) {
      if (!t) return '—';
      const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
      if (!m) return t;
      let h = parseInt(m[1]), min = m[2], ap = m[3];
      if (ap) return `${t.toUpperCase()}`;
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      return `${h}:${min} ${ampm}`;
    }

    // Parse "HH:MM - HH:MM" or "HH:MM AM - HH:MM PM" style time strings
    function fmtTimeRange(timeStr) {
      if (!timeStr) return '—';
      if (timeStr.includes(' - ')) {
        const parts = timeStr.split(' - ');
        return parts.map(p => fmtTime(p.trim())).join(' – ');
      }
      return fmtTime(timeStr);
    }

    content.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:28px;">
        <div>
          <div style="font-size:11px; color:#c49a3c; font-weight:700; text-transform:uppercase; margin-bottom:14px; letter-spacing:1px;">Event Details</div>
          <div style="display:grid; grid-template-columns:140px 1fr; gap:10px 14px; font-size:13px; align-items:start;">
            <div style="color:#888; font-size:11px; font-weight:700; text-transform:uppercase;">Event Type</div><div style="color:#333; font-weight:600;">${res.type || mt.agenda || '—'}</div>
            <div style="color:#888; font-size:11px; font-weight:700; text-transform:uppercase;">Theme / Motif</div><div style="color:#333; font-weight:600;">${res.theme || '—'}</div>
            <div style="color:#888; font-size:11px; font-weight:700; text-transform:uppercase;">Event Date</div><div style="color:#333; font-weight:600;">${res.date || mt.date || '—'}</div>
            <div style="color:#888; font-size:11px; font-weight:700; text-transform:uppercase;">Time</div><div style="color:#333; font-weight:600;">${fmtTimeRange(res.time || mt.time)}</div>
            <div style="color:#888; font-size:11px; font-weight:700; text-transform:uppercase;">Guest Count</div><div style="color:#333; font-weight:600;">${res.pax || '—'} pax</div>
            <div style="color:#888; font-size:11px; font-weight:700; text-transform:uppercase;">VIPs</div><div style="color:#333; font-weight:600;">${vipCount > 0 ? `${vipCount} VIP guest${vipCount > 1 ? 's' : ''}` : 'None'}</div>
            <div style="color:#888; font-size:11px; font-weight:700; text-transform:uppercase;">Venue Location</div><div style="color:#333; font-weight:600;">${res.venueLocation || res.city || '—'}</div>
            <div style="color:#888; font-size:11px; font-weight:700; text-transform:uppercase;">Venue</div><div style="color:#333; font-weight:600; line-height:1.4;">${res.venue || '—'}</div>
            ${res.venueAddr ? `<div style="color:#888; font-size:11px; font-weight:700; text-transform:uppercase;">Address</div><div style="color:#333; line-height:1.4; font-size:12px;">${res.venueAddr}</div>` : ''}
            ${res.notes ? `<div style="color:#888; font-size:11px; font-weight:700; text-transform:uppercase;">Notes</div><div style="color:#333; line-height:1.4;">${res.notes}</div>` : ''}
          </div>
          <div style="margin-top:24px; padding-top:20px; border-top:1px solid #eee;">
            <div style="font-size:11px; color:#c49a3c; font-weight:700; text-transform:uppercase; margin-bottom:10px; letter-spacing:1px;">Package Configuration</div>
            <div style="background:#fdfaf5; padding:16px; border-radius:10px; border:1px solid #f5efdf;">
              <div style="font-size:18px; font-weight:700; color:#333; margin-bottom:4px;">${res.packageName || 'Custom Package'}</div>
              <div style="display:inline-block; font-size:11px; color:#c49a3c; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; margin-bottom:12px;">${(res.packageOrigin || res.pricingMode || 'Custom')}</div>
              <div>
                ${(() => {
                  const origin = (res.packageOrigin || res.pricingMode || 'custom').toLowerCase();
                  if (origin === 'custom') {
                    return '<div style="font-size:13px; color:#888; font-style:italic;">"User freely customized the package"</div>';
                  } else if (origin === 'dynamically set') {
                    const parseCurr = (v) => { if(!v) return 0; return parseFloat(String(v).replace(/[^\d.-]/g, '')) || 0; };
                    let pph = parseCurr(res.pricePerHead);
                    if (pph === 0 && parseInt(res.pax) > 0 && res.amount) {
                      pph = parseCurr(res.amount) / parseInt(res.pax);
                    }
                    if (pph > 0) return '<div style="font-size:15px; color:#c49a3c; font-weight:700;">&#8369;' + pph.toLocaleString() + ' <span style="font-size:12px; color:#888; font-weight:normal;">per pax base</span></div>';
                    return '<div style="font-size:13px; color:#888; font-style:italic;">Dynamically priced based on pax</div>';
                  } else {
                    if (res.priceTiers && res.priceTiers.length > 0) {
                      const tiersHtml = res.priceTiers.map(t => '<div style="font-size:12px; color:#555; margin-bottom:3px;"><span style="color:#333; font-weight:600;">' + t.label + '</span> — &#8369;' + t.price.toLocaleString() + '</div>').join('');
                      return '<div><div style="font-size:10px; color:#c49a3c; text-transform:uppercase; font-weight:700; margin-bottom:8px; letter-spacing:0.5px;">Set Pax Pricing Tiers</div>' + tiersHtml + '</div>';
                    }
                    const parseCurr = (v) => { if(!v) return 0; return parseFloat(String(v).replace(/[^\d.-]/g, '')) || 0; };
                    const fixedPrice = parseCurr(res.fixedPrice || res.packagePrice || res.amount || 0);
                    return '<div style="font-size:15px; color:#c49a3c; font-weight:700;">&#8369;' + fixedPrice.toLocaleString() + ' <span style="font-size:12px; color:#888; font-weight:normal;">Fixed Package Price</span></div>';
                  }
                })()}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div style="font-size:11px; color:#c49a3c; font-weight:700; text-transform:uppercase; margin-bottom:14px; letter-spacing:1px;">Included Items By Category</div>
          <div style="display:flex; flex-direction:column; gap:16px; max-height:380px; overflow-y:auto; padding-right:6px;">
            ${(() => {
              if (items.length === 0) return '<div style="color:#aaa; font-size:13px;">No items listed.</div>';
              const grouped = {};
              items.forEach(item => {
                const name = typeof item === 'string' ? item : (item.name || 'Unknown');
                let cat = 'OTHER';
                let priceObj = typeof item === 'object' ? item : CAT.find(c => c.name === name);

                if (priceObj && priceObj.cat) {
                  cat = priceObj.cat.toUpperCase();
                }
                if (!grouped[cat]) grouped[cat] = [];
                grouped[cat].push({ name, obj: priceObj });
              });
              return Object.keys(grouped).map(cat => `
                <div>
                  <div style="font-size:10px; color:#aaa; font-weight:700; letter-spacing:1px; margin-bottom:8px; text-transform:uppercase; border-bottom:1px solid #eee; padding-bottom:4px;">${cat}</div>
                  <div style="display:flex; flex-direction:column; gap:6px;">
                    ${grouped[cat].map(it => {
                      let priceHtml = '';
                      const origin = res.packageOrigin || res.pricingMode || 'custom';
                      if (origin === 'custom' && it.obj && !(it.obj.cat === 'drink' && it.obj.identify !== 'drinks_package')) {
                        const p = parseInt(res.pax) || 0;
                        const dp = window.getDynamicPrice ? window.getDynamicPrice(it.obj, p) : (it.obj.price || 0);
                        if (it.obj.isIndividual || it.obj.batchSize) {
                          const rule = it.obj.isIndividual ? 'per head' : `per ${it.obj.batchSize} pax`;
                          priceHtml = `
                            <div style="text-align:right;">
                              <div style="font-size:13px; color:#c49a3c; font-weight:600;">&#8369;${dp.toLocaleString()} <span style="font-size:10px; color:#aaa; font-weight:normal;">(&#8369;${(it.obj.price || 0).toLocaleString()})</span></div>
                              <div style="font-size:9px; color:#aaa; font-style:italic;">${rule}</div>
                            </div>
                          `;
                        } else if (dp > 0) {
                          priceHtml = `<div style="font-size:13px; color:#c49a3c; font-weight:600;">&#8369;${dp.toLocaleString()}</div>`;
                        }
                      }
                      return `
                      <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:rgba(196,154,60,0.04); border-radius:8px; border:1px solid #f5efdf; font-size:13px; color:#333; font-weight:500;">
                        <div>${it.name}</div>
                        ${priceHtml}
                      </div>`;
                    }).join('')}
                  </div>
                </div>
              `).join('');
            })()}
          </div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:24px;">

        <!-- LEFT: Shared Documents + Next Meeting -->
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div id="c-mt-shared-docs-main" style="padding:20px; background:#fdfaf5; border:1px solid #e8dcc8; border-radius:12px;"></div>

          <!-- Next Meeting Card -->
          <div style="padding:20px; background:#fdfaf5; border:1px solid #e8dcc8; border-radius:12px;">
            <div style="font-size:11px; color:#c49a3c; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:14px; display:flex; align-items:center; gap:8px;">
              <i class="fas fa-calendar-alt" style="font-size:12px;"></i>
              Next Meeting Schedule
            </div>
            ${mt.nextMeetingDate ? `
              <div style="display:flex; flex-direction:column; gap:10px;">
                <div style="display:flex; align-items:center; gap:12px; background:#fff; border:1px solid rgba(196,154,60,0.2); border-radius:10px; padding:14px 16px;">
                  <div style="width:36px; height:36px; border-radius:8px; background:rgba(196,154,60,0.1); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                    <i class="fas fa-calendar-day" style="color:#c49a3c; font-size:14px;"></i>
                  </div>
                  <div>
                    <div style="font-size:10px; color:#aaa; text-transform:uppercase; font-weight:700; letter-spacing:1px; margin-bottom:2px;">Date &amp; Time</div>
                    <div style="font-size:15px; font-weight:700; color:#333;">${new Date(mt.nextMeetingDate).toLocaleDateString('en-PH', {weekday:'short', month:'long', day:'numeric', year:'numeric'})}</div>
                    <div style="font-size:12px; color:#c49a3c; font-weight:600; margin-top:2px;">${mt.nextMeetingTime || ''}</div>
                  </div>
                </div>
                ${mt.nextMeetingAgendas ? `
                <div style="background:#fff; border:1px solid rgba(196,154,60,0.2); border-radius:10px; padding:14px 16px;">
                  <div style="font-size:10px; color:#aaa; text-transform:uppercase; font-weight:700; letter-spacing:1px; margin-bottom:8px;">Topics to Discuss</div>
                  <div style="display:flex; flex-direction:column; gap:5px;">
                    ${mt.nextMeetingAgendas.split(', ').map(a => `
                      <div style="display:flex; align-items:center; gap:8px; font-size:13px; color:#333;">
                        <div style="width:6px; height:6px; border-radius:50%; background:#c49a3c; flex-shrink:0;"></div>
                        ${a}
                      </div>
                    `).join('')}
                  </div>
                </div>` : ''}
              </div>
            ` : `
              <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px 10px; text-align:center; gap:8px;">
                <div style="width:36px; height:36px; border-radius:50%; background:rgba(196,154,60,0.08); display:flex; align-items:center; justify-content:center;">
                  <i class="fas fa-clock" style="color:#c49a3c; font-size:14px;"></i>
                </div>
                <div style="font-size:13px; color:#aaa; font-style:italic;">No next meeting scheduled yet</div>
              </div>
            `}
          </div>
        </div>

        <!-- RIGHT: Downpayment Schedule -->
        <div style="padding:20px; background:#fdfaf5; border:1px solid #e8dcc8; border-radius:12px;">
          <div style="font-size:11px; color:#c49a3c; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:14px;">Downpayment Schedule</div>
          <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="background:#fff; border:1px solid rgba(196,154,60,0.2); border-radius:10px; padding:14px 16px;">
              <div style="font-size:10px; color:#aaa; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Total Package Price</div>
              <div style="font-size:15px; font-weight:700; color:#333;">&#8369;${(parseFloat(String(res.amount || res.price || res.total || 0).replace(/[^\d.-]/g,'')) || 0).toLocaleString(undefined, {minimumFractionDigits:2})}</div>
            </div>
            <div style="background:#fff; border:1px solid rgba(196,154,60,0.2); border-radius:10px; padding:14px 16px;">
              <div style="font-size:10px; color:#aaa; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Downpayment Amount (50%)</div>
              <div style="font-size:22px; font-weight:700; color:#c49a3c;">&#8369;${(() => { const rawDp = mt.downpaymentAmount ?? res.downpaymentAmount; const stored = (rawDp !== null && parseFloat(rawDp) > 0) ? parseFloat(rawDp) : null; const resTotal = parseFloat(String(res.amount || res.price || res.total || 0).replace(/[^\d.-]/g,'')) || 0; const dp = stored != null ? stored : Math.round(resTotal / 2); return isNaN(dp) ? '—' : dp.toLocaleString(undefined, {minimumFractionDigits:2}); })()}</div>
              <div style="font-size:11px; color:#aaa; margin-top:4px;">Automatically set to 50% of package total</div>
            </div>
            <div style="background:#fff; border:1px solid rgba(196,154,60,0.2); border-radius:10px; padding:14px 16px;">
              <div style="font-size:10px; color:#aaa; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Due Date</div>
              ${(mt.downpaymentDueDate || res.downpaymentDueDate)
                ? `<div style="font-size:16px; font-weight:700; color:#333;">${new Date(mt.downpaymentDueDate || res.downpaymentDueDate).toLocaleDateString('en-PH', {year:'numeric',month:'long',day:'numeric'})}</div>`
                : `<div style="font-size:13px; color:#aaa; font-style:italic;">Not yet set by coordinator</div>`
              }
            </div>
          </div>
        </div>

      </div>
    `;

    // ===== FOOD TASTING PANEL =====
  } else if (panel === 'food') {
    const allItems = res.packageItems || [];
    // Filter to only food-tasteable items
    const dishes = allItems.filter(dishName => {
      const name = typeof dishName === 'string' ? dishName : (dishName.name || '');
      if (name.toLowerCase().includes('unlimited drinks')) return false;
      const found = CAT.find(c => c.name === name);
      if (!found) return true; 
      return ['food', 'dessert', 'drink'].includes((found.cat || '').toLowerCase());
    });

    const liveFood = (mt.liveDraft && mt.liveDraft.foodTastingLive) ? mt.liveDraft.foodTastingLive : [];

    content.innerHTML = `
      <div>
        <div style="font-size:11px; color:#c49a3c; font-weight:700; text-transform:uppercase; margin-bottom:16px; letter-spacing:1px;">Dishes to be Tasted</div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${dishes.length > 0 ? dishes.map(dish => {
            const dishName = typeof dish === 'string' ? dish : (dish.name || dish);
            const liveMatch = liveFood.find(f => f.dish === dishName);
            
            let statusText = 'Pending Adjustments';
            let statusColor = '#e67e22';
            let subtitleText = 'Awaiting tasting feedback';
            let subtitleColor = '#e67e22';
            let triedBadge = '';

            if (liveMatch) {
              if (liveMatch.tried) {
                triedBadge = '<span style="font-size:10px; font-weight:700; background:rgba(39,174,96,0.1); color:#27ae60; padding:2px 6px; border-radius:4px; margin-left:8px;">✓ Tried</span>';
              }
              if (liveMatch.decision === 'approved') {
                statusText = 'Approved';
                statusColor = '#27ae60';
                subtitleText = liveMatch.remarks || 'No adjustments needed';
                subtitleColor = '#555';
              } else if (liveMatch.decision === 'pending') {
                statusText = 'Pending Adjustments';
                statusColor = '#e67e22';
                subtitleText = liveMatch.remarks || 'Awaiting revisions';
                subtitleColor = '#e67e22';
              } else if (liveMatch.decision === 'rejected') {
                statusText = 'Rejected / Swapped';
                statusColor = '#e74c3c';
                subtitleText = liveMatch.remarks || 'Needs replacement';
                subtitleColor = '#e74c3c';
              }
            }

            return `
            <div style="display:grid; grid-template-columns:1.5fr 0.6fr 1fr; gap:14px; align-items:center; background:#fdfaf5; padding:14px 16px; border-radius:10px; border:1px solid #e8dcc8;">
              <div style="font-weight:600; color:#333; display:flex; align-items:center;">
                ${dishName} ${triedBadge}
              </div>
              <div style="font-size:12px; color:${statusColor}; font-weight:600;">${statusText}</div>
              <div style="font-size:12px; color:${subtitleColor}; font-style:italic;">${subtitleText}</div>
            </div>
          `}).join('') : '<div style="color:#aaa; padding:20px; text-align:center;">No dishes listed in this package.</div>'}
        </div>
      </div>
    `;
    // ===== DESIGN PANEL =====
  } else if (panel === 'design') {
    // Filter decoration items from the reservation package
    const allItems = res.packageItems || [];
    const decorItems = allItems.filter(item => {
      const name = typeof item === 'string' ? item : (item.name || '');
      const found = CAT.find(c => c.name === name);
      return found && (found.cat || '').toLowerCase() === 'decoration';
    });

    content.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:20px;">
        <div style="padding:18px; background:#fdfaf5; border:1px solid #e8dcc8; border-radius:12px;">
          <div style="font-size:11px; color:#c49a3c; font-weight:700; text-transform:uppercase; margin-bottom:10px; letter-spacing:1px;">Event Theme</div>
          <div style="font-size:16px; font-weight:700; color:#333;">${res.theme || '—'}</div>
          ${res.type ? `<div style="font-size:13px; color:#888; margin-top:4px;">${res.type}</div>` : ''}
        </div>

        <div>
          <div style="font-size:11px; color:#c49a3c; font-weight:700; text-transform:uppercase; margin-bottom:14px; letter-spacing:1px;">Decoration Items Being Discussed</div>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${decorItems.length > 0 ? decorItems.map(item => {
              const nm = typeof item === 'string' ? item : (item.name || item);
              return `
                <div class="design-row" style="background:#fdfaf5; padding:20px; border-radius:12px; border:1px solid #e8dcc8; margin-bottom:10px;">
                  <div style="font-weight:700; color:#c49a3c; font-size:15px; margin-bottom:10px;">${nm}</div>
                  
                  <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:10px;">
                    <div>
                      <div style="font-size:11px; color:#888; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">Description / Notes</div>
                      <div id="c-dnote-${nm.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}" style="font-size:13px; color:#333; padding:12px; background:rgba(196,154,60,0.05); border:1px solid rgba(196,154,60,0.2); border-radius:8px; min-height:80px;">
                        ${(activeCustomerMeeting && activeCustomerMeeting.designNotes && activeCustomerMeeting.designNotes[nm]) || 'No notes from the coordinator yet.'}
                      </div>
                    </div>
                    <div>
                      <div style="font-size:11px; color:#888; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">Catalog Options</div>
                      <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:10px;">
                        ${[1,2,3,4].map(idx => `
                          <div style="width:100%; aspect-ratio:1; border-radius:6px; border:2px dashed #e8dcc8; background:#fff; display:flex; align-items:center; justify-content:center;">
                            <i class="fas fa-image" style="color:#e8dcc8; font-size:20px;"></i>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join('') : '<div style="color:#aaa; padding:16px; text-align:center; font-size:13px;">No decoration items in this package.</div>'}
          </div>
        </div>

        <div style="padding:18px; background:#fdfaf5; border:1px solid #e8dcc8; border-radius:12px;">
          <div style="font-size:11px; color:#c49a3c; font-weight:700; text-transform:uppercase; margin-bottom:10px; letter-spacing:1px;">Upload Reference Pictures</div>
          <div style="font-size:12px; color:#888; margin-bottom:14px;">Upload reference images or inspiration photos for the decorations. The coordinator will be able to view them.</div>
          <input type="file" id="c-design-upload-input" accept="image/*,application/pdf" style="display:none;" onchange="uploadCustomerMtFile(event, 'design')">
          <button onclick="document.getElementById('c-design-upload-input').click()" style="padding:8px 18px; background:#c49a3c; color:#000; font-size:12px; font-weight:700; border:none; border-radius:8px; cursor:pointer;">+ Upload Picture</button>
          <div id="c-design-upload-progress" style="margin-top:10px; font-size:11px; color:#c49a3c; font-weight:600; min-height:18px;"></div>
          <div id="c-design-upload-list" style="margin-top:14px; display:flex; flex-direction:column; gap:10px;"></div>
        </div>
      </div>
    `;
    if (window.renderCustomerUploadList) window.renderCustomerUploadList('c-design-upload-list', 'design');
    // ===== RUNDOWN PANEL =====
  } else if (panel === 'rundown') {
    content.innerHTML = `
      <div>
        <div style="font-size:11px; color:#c49a3c; font-weight:700; text-transform:uppercase; margin-bottom:16px; letter-spacing:1px;">Final Program Rundown</div>
        <div style="padding:18px; background:#fdfaf5; border:1px solid #e8dcc8; border-radius:12px; margin-bottom:16px;">
          <div style="display:grid; grid-template-columns:130px 1fr; gap:10px 14px; font-size:13px;">
            <div style="color:#888; font-size:11px; font-weight:700; text-transform:uppercase;">Event Date</div><div style="color:#333; font-weight:600;">${res.date || mt.date || '—'}</div>
            <div style="color:#888; font-size:11px; font-weight:700; text-transform:uppercase;">Time</div><div style="color:#333; font-weight:600;">${window._fmtTimeframe ? window._fmtTimeframe(res.time || mt.time) : (res.time || mt.time || '—')}</div>
            <div style="color:#888; font-size:11px; font-weight:700; text-transform:uppercase;">Venue</div><div style="color:#333; font-weight:600;">${res.venue || '—'}</div>
            <div style="color:#888; font-size:11px; font-weight:700; text-transform:uppercase;">Guest Count</div><div style="color:#333; font-weight:600;">${res.pax || '—'} pax</div>
          </div>
        </div>
        <div style="padding:18px; background:rgba(196,154,60,0.04); border:1px dashed rgba(196,154,60,0.3); border-radius:12px; text-align:center;">
          
          <div style="font-size:13px; font-weight:700; color:#c49a3c; margin-bottom:5px;">Rundown Being Finalized</div>
          <div style="font-size:12px; color:#888;">The coordinator is reviewing the final program rundown. The detailed timeline will be shared with you once finalized.</div>
        </div>
      </div>
    `;
    // ===== PAYMENT ASSESSMENT PANEL =====
  } else if (panel === 'payment') {
    const assess = res.paymentAssessment || {};
    const pkgPrice = res.totalPrice || 0;
    const surcharge = res.logisticsSurcharge || 0;
    const subtotal = pkgPrice + surcharge;

    const overtimeHrs = assess.overtimeHrs || 0;
    const overtimeTotal = overtimeHrs * 1000;
    const extraPax = assess.extraPax || 0;
    const extraPaxTotal = extraPax * 450;
    const additionalTotal = overtimeTotal + extraPaxTotal;
    const grandTotal = subtotal + additionalTotal;

    const initialPaid = res.initialFeeStatus === 'paid';
    const dpPaid = res.paymentStatus === 'paid' || res.downpaymentStatus === 'paid';
    let paidSoFar = 0;
    if (initialPaid) paidSoFar += (res.initialFeeAmount || 0);
    if (dpPaid) paidSoFar += (res.downpaymentAmount || (subtotal * 0.5));
    if (res.payments) {
      res.payments.forEach(p => { if (p.status === 'paid' && p.type !== 'initial' && p.type !== 'downpayment') paidSoFar += p.amount; });
    }
    const balanceDue = Math.max(0, grandTotal - paidSoFar);

    content.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:28px;">
        <!-- LEFT: Cost & Fulfillment -->
        <div style="display:flex; flex-direction:column; gap:20px;">
          <div style="background:#fdfaf5; border:1px solid #e8dcc8; border-radius:12px; padding:18px;">
            <div style="font-size:11px; color:#c49a3c; font-weight:700; text-transform:uppercase; margin-bottom:12px; letter-spacing:1px;">Event Cost Breakdown</div>
            <div style="display:grid; grid-template-columns:1fr auto; gap:8px 16px; font-size:13px;">
              <div style="color:#888;">Package Price</div><div style="color:#333; font-weight:600;">₱${pkgPrice.toLocaleString()}</div>
              <div style="color:#888;">Venue Surcharge</div><div style="color:#333; font-weight:600;">₱${surcharge.toLocaleString()}</div>
              <div style="height:1px; background:#eee; grid-column:1/-1; margin:4px 0;"></div>
              <div style="color:#c49a3c; font-weight:700;">Subtotal</div><div style="color:#c49a3c; font-weight:700;">₱${subtotal.toLocaleString()}</div>
            </div>
          </div>
          
          <div style="background:#fff; border:1px solid #eee; border-radius:12px; padding:18px;">
            <div style="font-size:11px; color:#c49a3c; font-weight:700; text-transform:uppercase; margin-bottom:12px; letter-spacing:1px;">Payment Fulfillment Status</div>
            <div style="display:flex; flex-direction:column; gap:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size:12px; color:#333;">Initial Reservation Fee</div>
                <div style="font-size:11px; font-weight:700; color:${initialPaid ? '#27ae60' : '#888'};">${initialPaid ? ' Paid' : 'Pending'}</div>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size:12px; color:#333;">Downpayment (50%)</div>
                <div style="font-size:11px; font-weight:700; color:${dpPaid ? '#27ae60' : '#888'};">${dpPaid ? ' Paid' : 'Pending'}</div>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size:12px; color:#333;">Final Payment (50%)</div>
                <div style="font-size:11px; font-weight:700; color:#888;">Pending</div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: Adjustments & Total -->
        <div style="display:flex; flex-direction:column; gap:20px;">
          <div style="background:#fff; border:1px solid #eee; border-radius:12px; padding:18px;">
            <div style="font-size:11px; color:#c49a3c; font-weight:700; text-transform:uppercase; margin-bottom:12px; letter-spacing:1px;">Additional Adjustments</div>
            <div style="display:grid; grid-template-columns:1fr auto; gap:8px 16px; font-size:13px;">
              <div style="color:#888;">Overtime (${overtimeHrs} hrs)</div><div style="color:#333; font-weight:600;">₱${overtimeTotal.toLocaleString()}</div>
              <div style="color:#888;">Extra Guests (${extraPax} pax)</div><div style="color:#333; font-weight:600;">₱${extraPaxTotal.toLocaleString()}</div>
              ${assess.notes ? `<div style="grid-column:1/-1; margin-top:10px; padding-top:10px; border-top:1px solid #eee; font-size:12px; color:#666; line-height:1.4;"><strong>Notes:</strong> ${assess.notes}</div>` : ''}
            </div>
          </div>

          <div style="background:#fdfaf5; border:1px solid #c49a3c; border-radius:12px; padding:20px;">
            <div style="font-size:11px; color:#c49a3c; font-weight:700; text-transform:uppercase; margin-bottom:14px; letter-spacing:1px;">Grand Total Summary</div>
            <div style="display:grid; grid-template-columns:1fr auto; gap:8px 16px; font-size:14px;">
              <div style="color:#333; font-weight:700;">Grand Total</div><div style="color:#333; font-weight:700;">₱${grandTotal.toLocaleString()}</div>
              <div style="color:#27ae60;">Amount Paid</div><div style="color:#27ae60; font-weight:600;">- ₱${paidSoFar.toLocaleString()}</div>
              <div style="height:1px; background:#c49a3c; grid-column:1/-1; margin:6px 0;"></div>
              <div style="color:#c49a3c; font-weight:800; font-size:16px;">Balance Due</div><div style="color:#c49a3c; font-weight:800; font-size:16px;">₱${balanceDue.toLocaleString()}</div>
            </div>
          </div>
          <div style="font-size:10px; color:#888; line-height:1.5; padding:0 5px;">
            * Balance due is the remaining amount to be settled on or before the event day. Overtime is charged at ₱1,000/hr and extra pax at ₱450/head.
          </div>
        </div>
      </div>
    `;
  } else if (panel === 'logistics') {
    const log = mt.live_draft_logistics || { eventFlow: [], guests: [], seatingElements: [] };
    console.log('[Customer Logistics] mt.live_draft_logistics =', mt.live_draft_logistics, '| log =', log);
    const ef = log.eventFlow || [];
    const gl = log.guests || [];
    const se = log.seatingElements || [];
    const pax = parseInt(mt.live_draft ? mt.live_draft.pax : (res && res.pax ? res.pax : 0)) || 0;
    // Helper: convert HH:MM 24h to 12h AM/PM display
    const fmt12h = (t) => {
      if (!t) return '—';
      const [hStr, mStr] = t.split(':');
      let h = parseInt(hStr, 10), m = parseInt(mStr, 10) || 0;
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      return `${h}:${String(m).padStart(2, '0')} ${ampm}`;
    };
    
    const totalChairs = se.filter(el => el.type === 'chair').length;
    const totalTables = se.filter(el => el.type && el.type.includes('table')).length;
    
    // Build table letter labels (A1, A2...) same as admin's getTableLabels()
    const tableEls = se.filter(el => el.type && el.type.includes('table'));
    const tableLabels = {};
    tableEls.forEach((t, i) => { tableLabels[t.id] = 'A' + (i + 1); });

    // Build a VIP lookup: which table IDs are VIP
    const vipTableIds = new Set(tableEls.filter(t => t.isVip).map(t => t.id));
    // VIP chairs = chairs whose parent table is VIP
    const vipChairs = se.filter(el => el.type === 'chair' && el.parentId && vipTableIds.has(el.parentId)).length;

    // Sort: tables first, then chairs (same as admin's sorted array)
    const sorted = [...se].sort((a, b) => {
      const aT = a.type && a.type.includes('table');
      const bT = b.type && b.type.includes('table');
      if (aT && !bT) return -1;
      if (!aT && bT) return 1;
      return 0;
    });

    // Compute bounding box to auto-fit viewBox around placed elements
    const renderSVG = () => {
      if (!se.length) return '<div style="display:flex;align-items:center;justify-content:center;height:200px;color:#aaa;font-size:13px;">No elements placed yet.</div>';

      // Find bounds with padding
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      se.forEach(el => {
        const r = el.type && el.type.includes('table') ? 65 : 20;
        minX = Math.min(minX, el.x - r);
        minY = Math.min(minY, el.y - r);
        maxX = Math.max(maxX, el.x + r);
        maxY = Math.max(maxY, el.y + r);
      });
      const pad = 40;
      minX -= pad; minY -= pad; maxX += pad; maxY += pad;
      const vw = maxX - minX, vh = maxY - minY;

      let svgParts = [`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="${minX} ${minY} ${vw} ${vh}" style="background:#fdfaf5; border-radius:8px; display:block;">`];
      
      // Inline styles to match admin's CSS classes (light theme)
      svgParts.push(`<style>
        .c-tbl { fill: #c49a3c; stroke: #9a6d08; stroke-width: 2; }
        .c-chr { fill: #fdfaf5; stroke: #c49a3c; stroke-width: 2; }
        .c-chr-taken { fill: #c49a3c; stroke: #9a6d08; stroke-width: 2; }
        .c-chr-vip { fill: #9a6d08; stroke: #5c3d00; stroke-width: 2; }
        .c-lbl { font-size: 14px; font-family: 'DM Sans', sans-serif; font-weight: 800; text-anchor: middle; dominant-baseline: middle; pointer-events: none; fill: #fff; }
        .c-glbl { font-size: 11px; font-family: 'DM Sans', sans-serif; font-weight: 700; text-anchor: middle; pointer-events: none; fill: #c49a3c; }
        .c-ginit { font-size: 10px; font-family: 'DM Sans', sans-serif; font-weight: 800; text-anchor: middle; dominant-baseline: middle; pointer-events: none; fill: #fff; }
      </style>`);

      sorted.forEach(el => {
        if (el.type === 'table-round') {
          const lbl = tableLabels[el.id] || '';
          svgParts.push(`<g transform="translate(${el.x},${el.y})">
            <circle r="45" class="c-tbl"/>
            ${lbl ? `<text class="c-lbl" y="5">${lbl}</text>` : ''}
          </g>`);
        } else if (el.type === 'table-rect') {
          const lbl = tableLabels[el.id] || '';
          svgParts.push(`<g transform="translate(${el.x},${el.y})">
            <rect x="-65" y="-40" width="130" height="80" rx="6" class="c-tbl"/>
            ${lbl ? `<text class="c-lbl" y="5">${lbl}</text>` : ''}
          </g>`);
        } else if (el.type === 'chair') {
          const hasPerson = !!el.guest;
          const isVip = !!el.vip;
          const cls = isVip ? 'c-chr-vip' : (hasPerson ? 'c-chr-taken' : 'c-chr');
          const initial = hasPerson ? el.guest.charAt(0).toUpperCase() : '';
          const guestName = hasPerson ? el.guest : '';
          svgParts.push(`<g transform="translate(${el.x},${el.y})">
            <circle r="16" class="${cls}"/>
            ${hasPerson ? `<text class="c-ginit" y="1">${initial}</text>
            <text class="c-glbl" y="30">${guestName}</text>` : ''}
          </g>`);
        }
      });

      svgParts.push('</svg>');
      return svgParts.join('\n');
    };

    content.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:20px; font-family:'Inter', sans-serif;">
        <!-- TOP: Agenda -->
        <div style="background:#fdfaf5; border:1px solid #e8dcc8; border-radius:12px; padding:20px;">
          <div style="font-size:11px; color:#c49a3c; font-weight:800; text-transform:uppercase; margin-bottom:4px; letter-spacing:1px;">EXECUTION AGENDA</div>
          <div style="font-size:14px; font-weight:700; color:#333; margin-bottom:16px;">Event Program Flow</div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${ef.length ? ef.map(p => `
              <div style="display:flex; gap:16px; padding:12px 16px; background:#fff; border:1px solid #e8dcc8; border-radius:8px; align-items:center;">
                <div style="font-size:12px; font-weight:800; color:#c49a3c; width:100px;">${fmt12h(p.time)}</div>
                <div style="font-size:11px; color:#888; width:70px;">${p.type || ''}</div>
                <div style="font-size:13px; color:#333; font-weight:600;">${p.text || '—'}</div>
              </div>
            `).join('') : '<div style="font-size:12px; color:#888;">No agenda items added yet.</div>'}
          </div>
        </div>

        <!-- MIDDLE: Capacity Bar -->
        <div style="display:flex; justify-content:space-between; align-items:center; background:#fdfaf5; border:1px solid #e8dcc8; border-radius:12px; padding:16px 24px;">
          <div style="display:flex; flex-direction:column; align-items:flex-start;">
            <div style="font-size:10px; font-weight:800; color:#c49a3c; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">TOTAL CAPACITY</div>
            <div style="font-size:15px; font-weight:800; color:#b12f2f;">${totalChairs} <span style="font-size:12px; font-weight:600; color:#333;">/ ${pax} Chairs</span></div>
          </div>
          <div style="display:flex; flex-direction:column; align-items:flex-start;">
            <div style="font-size:10px; font-weight:800; color:#c49a3c; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">VIP CAPACITY</div>
            <div style="font-size:15px; font-weight:800; color:#c49a3c;">${vipChairs} <span style="font-size:12px; font-weight:600; color:#333;">Chairs</span></div>
          </div>
          <div style="display:flex; flex-direction:column; align-items:flex-start;">
            <div style="font-size:10px; font-weight:800; color:#c49a3c; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">TABLES PLACED</div>
            <div style="font-size:15px; font-weight:800; color:#b12f2f;">${totalTables} <span style="font-size:12px; font-weight:600; color:#333;">Tables</span></div>
          </div>
          <div style="display:flex; flex-direction:column; align-items:flex-end;">
            <div style="font-size:10px; font-weight:800; color:#c49a3c; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">GUEST LIST PROGRESS</div>
            <div style="font-size:15px; font-weight:800; color:#333;">${gl.length} <span style="font-size:12px; font-weight:600; color:#333;">/ ${pax} Names Listed</span></div>
          </div>
        </div>

        <!-- BOTTOM: Guests & Venue -->
        <div style="display:grid; grid-template-columns:1fr 1.2fr; gap:20px;">
          <!-- GUEST LIST -->
          <div style="border:1px solid #e8dcc8; border-radius:12px; overflow:hidden; display:flex; flex-direction:column; background:#fff;">
            <div style="background:#4a3b2c; padding:16px; color:#fff;">
              <div style="font-size:15px; font-weight:700;">List of Guests</div>
              <div style="font-size:11px; opacity:0.8; margin-top:2px;">Provided by customer</div>
            </div>
            <div style="padding:16px; display:flex; flex-direction:column; gap:10px; max-height:355px; overflow-y:auto; background:#fff;">
              ${gl.length ? gl.map(g => `
                <div style="display:grid; grid-template-columns:1.5fr 1fr 1fr; gap:12px; padding:12px; border-radius:8px; background:#fdfaf5; border:1px solid #e8dcc8; align-items:center;">
                  <div style="font-size:13px; font-weight:700; color:#333;">${g.name || 'Unnamed'}</div>
                  <div style="font-size:12px; font-weight:600; color:#555;">${g.role || 'Ordinary'}</div>
                  <div style="font-size:12px; font-weight:700; color:${(g.tableSeat && g.tableSeat !== 'Any') ? '#c49a3c' : '#aaa'};">${(g.tableSeat && g.tableSeat !== 'Any') ? g.tableSeat : 'Unassigned'}</div>
                </div>
              `).join('') : '<div style="font-size:12px; color:#888; text-align:center; padding:20px;">No guests listed yet.</div>'}
            </div>
          </div>
          
          <!-- VENUE LAYOUT -->
          <div style="border:1px solid #e8dcc8; border-radius:12px; overflow:hidden; display:flex; flex-direction:column; background:#fff;">
            <div style="background:#4a3b2c; padding:16px; color:#fff;">
              <div style="font-size:15px; font-weight:700;">Venue Layout</div>
              <div style="font-size:11px; opacity:0.8; margin-top:2px;">Live view of the layout being designed by the admin</div>
            </div>
            <div style="padding:16px; background:#fdfaf5; min-height:280px;">
              ${renderSVG()}
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    content.innerHTML = `<div style="padding:60px; text-align:center; color:#aaa;">Loading ${panel} details...</div>`;
  }
  
  if (activeCustomerMeeting) {
    syncCustomerSharedDocs(activeCustomerMeeting);
  }
}

// ===== SIGN OUT =====
async function signOut() {
  try { await window.firebaseFns.signOut(window.firebaseAuth); } catch (e) { }
  setLoggedOut(); closeAuth();
}

// ===== DASHBOARD & PROFILE =====
let activeResDetailId = null;
let resDetailsActiveTab = 'details';
let resDetailMode = 'view';
let resdModifyMode = false;

function escHtml(str) { return str ? String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : ''; }
function escAttr(str) { return str ? String(str).replace(/"/g, '&quot;') : ''; }
function safeNum(val) { if (!val) return 0; if (typeof val === 'number') return val; return parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0; }

const ALLOC_RULES = [
  { ruleType: 'per_pax', ratio: 1.1, name: 'Glassware' },
  { ruleType: 'per_table', ratio: 1, name: 'Table Linens' },
  { ruleType: 'per_pax', ratio: 1, name: 'Dinner Plates' },
  { ruleType: 'per_pax', ratio: 1, name: 'Forks' },
  { ruleType: 'per_pax', ratio: 1, name: 'Spoons' }
];

function switchDashTab(tabId, btn) {
  document.querySelectorAll('.dash-tab, .cp-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.dash-nav-item, .cp-nav-item').forEach(b => b.classList.remove('active'));

  const tab = document.getElementById(`dash-tab-${tabId}`);
  if (tab) tab.classList.add('active');
  if (btn) btn.classList.add('active');

  if (tabId === 'chat') {
    scrollChatToBottom();
    listenToCustomerChat();
  }
  if (tabId === 'calendar') renderCustomerCalendar();
  if (tabId === 'meetings') {
    renderCustomerMeetings();
    setTimeout(() => {
      const mapEl = document.getElementById('office-map');
      if (mapEl && mapEl._leaflet_id) {
        // Trigger resize
        window.dispatchEvent(new Event('resize'));
      }
    }, 200);
  }
  if (tabId === 'flags') renderCustomerFlags();
  if (tabId === 'resdetails') initCustomerResDetails();
  if (tabId === 'payments') renderCustomerPayments();
  if (tabId === 'reviews') renderCustomerReviews();
}
window.switchDashTab = switchDashTab;

function openProfile() {
  if (!currentUser) return;
  window.location.href = 'customer.html';
}
window.openProfile = openProfile;

function closeProfile() {
  window.location.href = 'index.html';
}
window.closeProfile = closeProfile;

let profileResUnsub = null;

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

  if (profileResUnsub) profileResUnsub();

  try {
    await waitForFirebase();
    const { collection, query, where, onSnapshot } = window.firebaseFns;
    const q = query(collection(window.firebaseDB, 'reservations'), where('email', '==', currentUser.email));

    profileResUnsub = onSnapshot(q, (snap) => {
      const groups = { processing: [], approved: [], rejected: [] };
      let pendingRes = null;
      let paymentRes = null;

      snap.forEach(doc => {
        const res = { id: doc.id, ...doc.data() };
        const status = (res.status || 'pending').toLowerCase();

        if (status === 'pending' || status === 'processing' || status === 'confirmed') {
          pendingRes = res;
        }

        if (res.customerHidden) return; // Skip hidden reservations

        if (res.paymentRequested && res.paymentStatus !== 'paid') {
          paymentRes = res;
        }

        if (['pending', 'processing', 'preparing', 'on-going'].includes(status)) groups.processing.push(res);
        else if (['confirmed', 'approved', 'completed'].includes(status)) groups.approved.push(res);
        else if (['cancelled', 'rejected'].includes(status)) groups.rejected.push(res);
      });

      // Build a cache for the modify-reservation delegated handler
      window._profileResCache = {};
      [...groups.processing, ...groups.approved, ...groups.rejected].forEach(r => {
        window._profileResCache[r.id] = r;
      });

      // Render highlighted flag
      const flagContainer = document.getElementById('dash-res-flags');
      if (flagContainer) {
        if (paymentRes) {
          flagContainer.innerHTML = `
            <div style="background: #eef2ff; border: 2px solid #4f46e5; border-radius: 16px; padding: 24px; display: flex; align-items: flex-start; gap: 20px; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(79, 70, 229, 0.1); animation: slideDown 0.5s ease-out;">
              <div style="font-size: 32px; background: #4f46e5; color: #fff; width: 60px; height: 60px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"></div>
              <div style="flex: 1;">
                <div style="font-weight: 800; color: #3730a3; margin-bottom: 6px; font-size: 17px; text-transform: uppercase; letter-spacing: 0.5px;">Payment Required</div>
                <p style="font-size: 14px; color: #312e81; line-height: 1.6; margin: 0; font-weight: 500;">
                  A payment of ₱${Number(paymentRes.paymentAmount).toLocaleString()} is required to finalize your contract.
                </p>
                <button class="btn-primary" style="margin-top:15px; background:#4f46e5; color:#fff;" onclick="openPaymentModal('${paymentRes.id}', '${paymentRes.paymentAmount}')">Make Payment Now</button>
              </div>
            </div>
          `;
          if (!activePaymentResId && !window.hasAutoOpenedPaymentModal) {
            openPaymentModal(paymentRes.id, paymentRes.paymentAmount);
            window.hasAutoOpenedPaymentModal = true;
          }
          if (activePaymentResId === paymentRes.id && paymentRes.cashPaymentStatus === 'waiting_for_admin') {
            document.getElementById('pay-selection-area').style.display = 'none';
            document.getElementById('pay-btn-submit').style.display = 'none';
            document.getElementById('pay-waiting-area').style.display = 'block';
          }
        } else if (pendingRes) {
          if (activePaymentResId) closePaymentModal();
          flagContainer.innerHTML = `
            <div style="background: #fffdf0; border: 2px solid #c49a3c; border-radius: 16px; padding: 24px; display: flex; align-items: flex-start; gap: 20px; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(196, 154, 60, 0.1); animation: slideDown 0.5s ease-out;">
              <div style="font-size: 32px; background: #c49a3c; color: #fff; width: 60px; height: 60px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"></div>
              <div style="flex: 1;">
                <div style="font-weight: 800; color: #8a6820; margin-bottom: 6px; font-size: 17px; text-transform: uppercase; letter-spacing: 0.5px;">Action Required: Awaiting Review</div>
                <p style="font-size: 14px; color: #4a3728; line-height: 1.6; margin: 0; font-weight: 500;">
                  Please wait for the admin to review your reservation. Once it is approved or rejected, you will receive a notification within the system and an email will be sent to your provided Gmail.
                </p>
              </div>
            </div>
          `;
        } else {
          if (activePaymentResId) closePaymentModal();
          flagContainer.innerHTML = '';
        }
      }

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
            const paid = res.paymentStatus === 'paid';

            return `
              <div class="dash-res-card approved" style="cursor:pointer; background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:20px; box-shadow:0 2px 8px rgba(0,0,0,0.03); margin-bottom:14px; position:relative; overflow:hidden;" onclick="openCustomerResModal('${res.id}')">
                <div class="drc-map-side" style="border-radius:12px; overflow:hidden; border:none; top:16px; right:16px; height:calc(100% - 32px); width:180px;">
                  <img src="${mapUrl}" alt="Venue Location" style="border-radius:12px; filter:none; width:100%; height:100%; object-fit:cover;" onerror="this.src='https://placehold.co/400x300?text=Location+Map'">
                </div>
                <div class="drc-content" style="margin-right:200px; margin-top:0;">
                  <div style="font-size:16px; font-weight:700; color:#1a202c; margin-bottom:2px;">${res.packageName || 'Custom Package'}</div>
                  <div style="font-size:12px; color:#718096; margin-bottom:12px;">${res.type || 'Event'}</div>
                  
                  <div style="font-size:12px; color:#2d3748; display:flex; gap:12px; align-items:center; margin-bottom:10px;">
                    <span>${res.date || ''}</span>
                    <span style="color:#cbd5e0;">|</span>
                    <span>${res.pax || 0} pax</span>
                    <span style="color:#cbd5e0;">|</span>
                    <span style="font-weight:600;">₱${Number(res.amount || 0).toLocaleString()}</span>
                  </div>
                  
                  <div style="font-size:12px; color:#718096; line-height:1.4;">${res.venue || res.venueAddress || "Halden's Private Venue"}</div>
                </div>
              </div>
            `;
          }

          const isPending = ['pending', 'processing'].includes((res.status || '').toLowerCase());
          const isCancelled = ['cancelled', 'rejected'].includes((res.status || '').toLowerCase());
          const statusColor = isPending ? '#f39c12' : isCancelled ? '#e74c3c' : '#27ae60';
          const statusText = isPending ? 'PROCESSING' : isCancelled ? 'CANCELLED' : (res.status || 'STATUS').toUpperCase();

          return `
            <div class="dash-res-card" style="cursor:pointer; background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:20px; box-shadow:0 2px 8px rgba(0,0,0,0.03); margin-bottom:14px;" onclick="openCustomerResModal('${res.id}')">
              <div style="font-size:11px; font-weight:700; color:${statusColor}; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">${statusText}</div>
              <div style="font-size:16px; font-weight:700; color:#1a202c; margin-bottom:2px;">${res.packageName || 'Custom Package'}</div>
              <div style="font-size:12px; color:#718096; margin-bottom:12px;">${res.type || 'Event'} ${statusText}</div>
              
              <div style="font-size:12px; color:#2d3748; display:flex; gap:12px; align-items:center; margin-bottom:6px;">
                <span>${res.date || ''}</span>
                <span style="color:#cbd5e0;">|</span>
                <span>${res.pax || 0} pax</span>
                <span style="color:#cbd5e0;">|</span>
                <span style="font-weight:600;">₱${Number(res.amount || 0).toLocaleString()}</span>
              </div>
              
              ${isPending ? `
                <button onclick="event.stopPropagation(); window.confirmCancelPendingReservation('${res.id}')" style="margin-top:10px; width:100%; padding:9px; font-size:12px; font-weight:600; background:rgba(239,68,68,0.1); color:var(--red); border:1px solid var(--red); border-radius:8px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s;">Cancel Reservation</button>
              ` : ''}
              ${isCancelled ? `
                <button class="btn-modify-res" data-res-id="${res.id}" style="margin-top:10px; width:100%; padding:9px; font-size:12px; font-weight:600; background:linear-gradient(135deg,#c49a3c,#e8c66a); color:#1a120b; border:none; border-radius:8px; cursor:pointer; font-family:'DM Sans',sans-serif; letter-spacing:0.3px; transition:opacity 0.18s;">✏ Modify Reservation</button>
                <button onclick="event.stopPropagation(); window.deleteRejectedReservation('${res.id}')" style="margin-top:8px; width:100%; padding:9px; font-size:12px; font-weight:600; background:transparent; color:var(--red); border:1px solid var(--red); border-radius:8px; cursor:pointer; font-family:'DM Sans',sans-serif; letter-spacing:0.3px; transition:opacity 0.18s;">🗑 Delete Record</button>
              ` : ''}
            </div>
          `;
        }).join('') || `<div style="padding:10px; font-size:12px; color:var(--text-dim);">No ${key} reservations.</div>`;
      });
    });

  } catch (err) {
    console.error(err);
  }
}

window.confirmCancelPendingReservation = function (resId) {
  let modal = document.getElementById('cancel-res-modal-overlay');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'cancel-res-modal-overlay';
  modal.style.cssText = 'position:fixed; inset:0; z-index:99999; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px);';

  modal.innerHTML = `
    <div style="background:var(--cp-bg2, #18120c); border:1px solid var(--cp-border, rgba(180,140,60,0.3)); border-radius:16px; padding:28px 24px; width:90%; max-width:420px; text-align:center; box-shadow:0 12px 40px rgba(0,0,0,0.5);">
      <h3 style="color:var(--cream, #fff); font-size:18px; margin:0 0 12px 0; font-weight:700;">Cancel Reservation</h3>
      <p style="color:var(--cp-text-dim, #b8a692); font-size:13px; line-height:1.6; margin:0 0 24px 0;">Are you sure you want to cancel this pending reservation? This action cannot be undone.</p>
      <div style="display:flex; gap:12px; justify-content:center;">
        <button onclick="document.getElementById('cancel-res-modal-overlay').remove()" style="flex:1; padding:10px 16px; background:transparent; color:var(--cream, #fff); border:1px solid var(--cp-border, rgba(255,255,255,0.2)); border-radius:8px; font-weight:600; cursor:pointer;">No, Keep It</button>
        <button onclick="window.executeCancelPendingReservation('${resId}')" style="flex:1; padding:10px 16px; background:var(--red, #ef4444); color:#fff; border:none; border-radius:8px; font-weight:700; cursor:pointer;">Yes, Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
};

window.executeCancelPendingReservation = async function (resId) {
  const modal = document.getElementById('cancel-res-modal-overlay');
  if (modal) modal.remove();

  try {
    const { updateDoc, doc } = window.firebaseFns;
    if (window.firebaseDB) {
      await updateDoc(doc(window.firebaseDB, 'reservations', resId), {
        status: 'cancelled',
        cancelledAt: new Date().toISOString()
      });
    }

    if (window.supabaseClient) {
      await window.supabaseClient.from('reservations').update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString()
      }).eq('id', resId);
    }

    if (typeof renderProfileReservations === 'function') {
      renderProfileReservations();
    }
  } catch (e) {
    console.error('Failed to cancel reservation:', e);
    alert('Failed to cancel reservation. Please try again.');
  }
};

window.deleteRejectedReservation = async function(id) {
  if (!confirm("Are you sure you want to permanently hide this reservation from your portal?")) return;
  try {
    const { doc, updateDoc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'reservations', id), {
      customerHidden: true,
      updatedAt: new Date().toISOString()
    });
  } catch (e) {
    console.error('Error hiding reservation:', e);
    alert('Failed to delete the record. Please try again.');
  }
};

// ── Helpers ──────────────────────────────────────────────────────────
function _fmtTimeAmPm(t) {
  if (!t) return 'TBD';
  const parts = t.split(':');
  if (parts.length < 2) return t;
  let h = parseInt(parts[0]);
  const m = parts[1];
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

function _fmtTimeRange(t) {
  if (!t || t === 'TBD') return 'TBD';
  const parts = t.split(':');
  if (parts.length < 2) return t;
  let h = parseInt(parts[0], 10);
  let m = parts[1];
  let endH = h + 1;
  const formatHour = (hour, min) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    let hr12 = hour % 12 || 12;
    return `${hr12}:${min} ${ampm}`;
  };
  return `${formatHour(h, m)} - ${formatHour(endH, m)}`;
}

function _fmtTimeframe(tf) {
  if (!tf) return 'TBD';
  const sep = tf.includes(' - ') ? ' - ' : (tf.includes('-') ? '-' : null);
  if (sep) {
    const [s, e] = tf.split(sep).map(x => x.trim());
    return `${_fmtTimeAmPm(s)} – ${_fmtTimeAmPm(e)}`;
  }
  return _fmtTimeAmPm(tf);
}

function _statusStyle(status) {
  const s = (status || '').toLowerCase();
  if (['confirmed','approved','completed'].includes(s)) return 'background:rgba(46,204,113,0.15);color:#2ecc71;border:1px solid #2ecc71;';
  if (['pending','processing','preparing','on-going'].includes(s)) return 'background:rgba(230,153,26,0.15);color:#e6991a;border:1px solid #e6991a;';
  if (['cancelled','rejected'].includes(s)) return 'background:rgba(231,76,60,0.15);color:#e74c3c;border:1px solid #e74c3c;';
  return 'background:rgba(255,255,255,0.1);color:var(--cp-text);border:1px solid var(--cp-border);';
}

function _catLabel(cat) {
  const map = {
    food: 'Food', dessert: 'Desserts', drink: 'Drinks',
    decoration: 'Decorations', equipment: 'Equipment', entertainment: 'Add-ons'
  };
  return map[cat] || (cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'Other');
}

function _renderCrmItemGroup(label, items, isFree) {
  if (!items.length) return '';
  const pillStyle = isFree
    ? 'background:rgba(196,154,60,0.12); border:1px solid rgba(196,154,60,0.35); color:var(--cp-gold);'
    : 'background:var(--cp-bg2); border:1px solid var(--cp-border); color:var(--cp-text);';
  const pills = items.map(i => `<span style="${pillStyle} padding:5px 12px; border-radius:20px; font-size:12px; font-weight:500; display:inline-block;">${i.name || i}</span>`).join('');
  const freeTag = isFree ? ' <span style="font-size:9px;background:rgba(196,154,60,0.2);padding:2px 7px;border-radius:10px;border:1px solid rgba(196,154,60,0.3);">FREE</span>' : '';
  return `
    <div>
      <div style="color:var(--cp-gold); font-size:10px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:8px;">${label}${freeTag}</div>
      <div style="display:flex; flex-wrap:wrap; gap:7px;">${pills}</div>
    </div>`;
}

// ── Main modal open ──────────────────────────────────────────────────
window.openCustomerResModal = async function(resId) {
  const res = window._profileResCache && window._profileResCache[resId];
  if (!res) return;

  // Show overlay immediately while we load
  document.getElementById('customer-res-detail-overlay').classList.add('on');

  // ── Origin badge ──
  const originMap = {
    'majorly set': 'Majority Set', 'majorly_set': 'Majority Set',
    'dynamically set': 'Dynamically Set', 'per_head': 'Dynamically Set',
    'custom': 'Custom Build', 'item-based': 'Custom Build'
  };
  const originLabel = originMap[res.packageOrigin || res.pricingMode] || 'Custom Build';
  const el = n => document.getElementById(n);

  el('crm-origin-badge').textContent = originLabel;
  el('crm-status-badge').setAttribute('style',
    `color:var(--cp-gold); font-size:10px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase;`);
  el('crm-status-badge').textContent = res.status;

  // ── Title / package name ──
  el('crm-title').textContent = res.packageName || res.type || 'Reservation';
  el('crm-desc').textContent = res.description || res.desc || 'No description provided.';

  // ── Price / pax ──
  const amtNum = parseFloat(String(res.amount || '0').replace(/[^0-9.]/g, ''));
  el('crm-price').textContent = '₱' + amtNum.toLocaleString();
  el('crm-pax').textContent = (res.pax || '—') + ' Pax';

  // ── Info grid ──
  el('crm-theme').textContent   = res.theme   || 'N/A';
  el('crm-occasion').textContent = res.type   || 'N/A';

  // Format date nicely
  const rawDate = res.date || '';
  let niceDate = rawDate;
  if (rawDate) {
    const d = new Date(rawDate + 'T00:00:00');
    if (!isNaN(d)) niceDate = d.toLocaleDateString('en-PH', { year:'numeric', month:'long', day:'numeric' });
  }
  el('crm-date').textContent = niceDate || '—';
  el('crm-time').textContent = _fmtTimeframe(res.time || res.timeframe);

  // ── Venue ──
  el('crm-venue-loc').textContent  = res.venueLocation || res.venue_location || '—';
  el('crm-venue-addr').textContent = res.venue || 'No specific address';

  // ── VIP ──
  if (res.isVIP && res.vipCount > 0) {
    el('crm-vip').textContent = `${res.vipCount} VIP${res.vipCount > 1 ? 's' : ''} — ${res.vipService || 'Standard'}`;
  } else {
    el('crm-vip').textContent = 'None';
  }

  // ── Proposed Meeting Times ──
  const meetings = res.proposedMeetingTimes || res.meeting_times || [];
  if (meetings.length > 0) {
    el('crm-meetings-wrap').style.display = 'block';
    el('crm-meetings').innerHTML = meetings.map(mt => {
      const dateStr = mt.date || '';
      const startStr = _fmtTimeAmPm(mt.start || mt.from || '');
      const endStr   = _fmtTimeAmPm(mt.end || mt.to || '');
      return `<div style="display:flex; align-items:center; gap:10px; padding:8px 12px; background:var(--cp-bg2); border-radius:8px; border:1px solid var(--cp-border); font-size:13px;">
        <span style="color:var(--cp-text); font-weight:600;">${dateStr}</span>
        <span style="color:var(--cp-text-mid);">${startStr} – ${endStr}</span>
      </div>`;
    }).join('');
  } else {
    el('crm-meetings-wrap').style.display = 'none';
  }

  // ── Items: fetch from reservation_items table ──
  const itemsContainer = el('crm-items');
  itemsContainer.innerHTML = '<div style="text-align:center;color:var(--cp-text-mid);padding:20px;">Loading items...</div>';

  try {
    const { data: riRows, error } = await window.supabaseClient
      .from('reservation_items')
      .select('name, cat, is_free, price, dynamic_price')
      .eq('reservation_id', resId);

    if (error) throw error;

    if (riRows && riRows.length > 0) {
      // Separate freebies from paid items, then group by category
      const paidItems  = riRows.filter(i => !i.is_free);
      const freeItems  = riRows.filter(i =>  i.is_free);

      // Group paid by category
      const catOrder = ['food','dessert','drink','decoration','equipment','entertainment'];
      const grouped  = {};
      paidItems.forEach(i => {
        const c = (i.cat || 'other').toLowerCase();
        if (!grouped[c]) grouped[c] = [];
        grouped[c].push(i);
      });

      let html = '';
      // Render in preferred order first, then any extras
      catOrder.forEach(c => {
        if (grouped[c]) {
          html += _renderCrmItemGroup(_catLabel(c), grouped[c], false);
          delete grouped[c];
        }
      });
      // Any remaining unknown categories
      Object.keys(grouped).forEach(c => {
        html += _renderCrmItemGroup(_catLabel(c), grouped[c], false);
      });

      // Freebies as their own group
      if (freeItems.length > 0) {
        html += `<div style="position:relative;text-align:center;margin:8px 0;">
          <div style="position:absolute;top:50%;left:0;right:0;height:1px;background:rgba(196,154,60,0.3);"></div>
          <span style="position:relative;background:var(--cp-sidebar);padding:0 12px;color:var(--cp-gold);font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;">Freebies Included</span>
        </div>`;
        // Group freebies by category too
        const freeGrouped = {};
        freeItems.forEach(i => {
          const c = (i.cat || 'other').toLowerCase();
          if (!freeGrouped[c]) freeGrouped[c] = [];
          freeGrouped[c].push(i);
        });
        catOrder.forEach(c => {
          if (freeGrouped[c]) { html += _renderCrmItemGroup(_catLabel(c), freeGrouped[c], true); delete freeGrouped[c]; }
        });
        Object.keys(freeGrouped).forEach(c => {
          html += _renderCrmItemGroup(_catLabel(c), freeGrouped[c], true);
        });
      }

      itemsContainer.innerHTML = html || '<div style="color:var(--cp-text-mid);font-size:13px;font-style:italic;">No categorized items found.</div>';

    } else {
      // Fallback to packageItems string array from the reservation doc itself
      const fallback = res.packageItems || res.items || [];
      if (fallback.length > 0) {
        const catOrder = ['food','dessert','drink','decoration','equipment','entertainment'];
        const grouped = {};
        const uncategorized = [];
        
        fallback.forEach(i => {
          const n = typeof i === 'string' ? i : (i.name || '');
          if (!n) return;
          // Look up category in the global CAT array
          const found = (typeof CAT !== 'undefined' ? CAT : []).find(c => c.name.toLowerCase() === n.toLowerCase());
          const c = found ? (found.cat || 'other').toLowerCase() : 'other';
          if (c === 'other') {
             uncategorized.push({name: n});
          } else {
             if (!grouped[c]) grouped[c] = [];
             grouped[c].push({name: n});
          }
        });

        let html = '';
        catOrder.forEach(c => {
          if (grouped[c]) html += _renderCrmItemGroup(_catLabel(c), grouped[c], false);
        });
        if (uncategorized.length > 0) {
          html += _renderCrmItemGroup('Other Items', uncategorized, false);
        }
        itemsContainer.innerHTML = html;
      } else {
        itemsContainer.innerHTML = '<div style="color:var(--cp-text-mid);font-size:13px;font-style:italic;text-align:center;padding:20px;">No items found for this reservation.</div>';
      }
    }
  } catch (err) {
    console.error('Error fetching reservation_items:', err);
    itemsContainer.innerHTML = '<div style="color:#e74c3c;font-size:13px;text-align:center;padding:20px;">Could not load items. Please try again.</div>';
  }
};

window.closeCustomerResModal = function() {
  document.getElementById('customer-res-detail-overlay').classList.remove('on');
};

// Delegated click handler for "Modify Reservation" buttons rendered inside reservations
document.addEventListener('click', function(e) {
  const btn = e.target.closest('.btn-modify-res');
  if (!btn) return;
  e.stopPropagation();
  const resId = btn.getAttribute('data-res-id');
  if (!resId || !window._profileResCache) return;
  const res = window._profileResCache[resId];
  if (!res) return;
  try {
    sessionStorage.setItem('halden_modify_res', JSON.stringify(res));
    window.location.href = 'index.html';
  } catch(err) {
    console.error('Modify reservation redirect error:', err);
  }
});

// ===== PAYMONGO: PAY AN EXISTING CONFIRMED RESERVATION =====
async function payReservation(resId, amountStr, type, date) {
  const btn = window.event?.target || null;
  if (btn) { btn.disabled = true; btn.textContent = ' Processing...'; }
  try {
    const amount = parseFloat((amountStr || '').replace(/[^0-9.]/g, '')) || 1;
    const apiRes = await fetch('/api/paymongo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ name: `${type} - ${date}`, price: amount }],
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
  } catch (e) {
    alert(' Payment error: ' + e.message);
    if (btn) { btn.disabled = false; btn.textContent = 'Pay Now'; }
  }
}
window.payReservation = payReservation;

// Handle PayMongo redirect-back: ?payment=success&resId=xxx or ?payment=cancel
(async function handlePaymentReturn() {
  const params = new URLSearchParams(window.location.search);
  const payment = params.get('payment');
  const resId = params.get('resId');
  const type = params.get('type');
  const meetingId = params.get('meetingId');
  if (!payment) return;

  // Clean URL without reload
  window.history.replaceState({}, '', window.location.pathname);

  if (payment === 'success' && resId) {
    try {
      await new Promise(r => setTimeout(r, 1500));  // wait for Firebase to init
      
      // If it's the initial fee, mark it in Supabase meetings row too
      if (type === 'initial_fee' && meetingId) {
        const sb = window.supabaseClient;
        if (sb) {
          const now = new Date().toISOString();
          await sb.from('meetings').update({
            initial_fee_status: 'paid',
            initial_fee_method: 'online',
            initial_fee_paid_at: now
          }).eq('id', meetingId);
        }
      }

      // Mark reservation as paid in Firestore
      const { doc, updateDoc } = window.firebaseFns || {};
      if (doc && updateDoc && window.firebaseDB) {
        // If initial fee, set paymentAmount too just in case
        const updateData = { paymentStatus: 'paid', paidAt: new Date().toISOString() };
        if (type === 'initial_fee') updateData.paymentAmount = '5000';
        await updateDoc(doc(window.firebaseDB, 'reservations', resId), updateData);
      }
    } catch (e) { console.warn('[PayMongo return] Could not mark paid:', e); }

    // Show a toast/banner notification
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:99999;background:linear-gradient(135deg,#2d8a4e,#3aaa60);color:#fff;padding:14px 28px;border-radius:14px;font-family:Arial,sans-serif;font-size:14px;font-weight:700;box-shadow:0 8px 32px rgba(0,0,0,0.4);text-align:center;';
    toast.innerHTML = ' Payment successful! Thank you for booking with Halden\'s.';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 6000);

  } else if (payment === 'cancel') {
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:99999;background:#1a1007;border:1px solid #c49a3c;color:#e8dcc8;padding:14px 28px;border-radius:14px;font-family:Arial,sans-serif;font-size:14px;font-weight:600;box-shadow:0 8px 32px rgba(0,0,0,0.4);text-align:center;';
    toast.innerHTML = '\ufe0f Payment cancelled. Your reservation is saved \u2014 you can pay later from your bookings.';
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
        <div class="chat-text">${escapeHTML(msg.text)}</div>
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
  const dots = document.querySelectorAll('.hero-dot');
  const label = document.getElementById('hero-hud-label');
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
  let _firstAuthCheck = true;

  const restoreFromLocalStorage = () => {
    const manualCustomerData = localStorage.getItem('halden_customer');
    if (!manualCustomerData) return false;
    try {
      const parsed = JSON.parse(manualCustomerData);
      // Handle both flat {id, name, role...} and wrapped {user: {...}, token: "..."} shapes
      const userObj = (parsed && parsed.user && parsed.user.id) ? parsed.user : parsed;
      if (!userObj || !userObj.email) return false;

      currentUser = userObj;
      currentUserId = userObj.id;
      setLoggedIn({ displayName: userObj.name, email: userObj.email, uid: userObj.id || userObj.uid }, true);
      listenToCustomerChat();
      initCustomerMeetingListener();

      if (_firstAuthCheck) {
        _firstAuthCheck = false;
        const nameEl = document.getElementById('dash-user-name');
        const emailEl = document.getElementById('dash-user-email');
        if (nameEl) nameEl.textContent = userObj.name || 'Customer';
        if (emailEl) emailEl.textContent = userObj.email;
        if (typeof renderProfileReservations === 'function') renderProfileReservations();
        if (typeof listenForDirectives === 'function') listenForDirectives();
      }
      return true;
    } catch (e) { return false; }
  };

  // Try Supabase native session first (only works after proper native auth login)
  window.supabaseClient.auth.onAuthStateChange(async (event, session) => {
    if (session && session.user) {
      // Real Supabase native session — fetch profile from DB
      try {
        const { data: profileData } = await window.supabaseClient
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileData) {
          currentUser = profileData;
          currentUserId = profileData.id;
          localStorage.setItem('currentUser', JSON.stringify(profileData));
          localStorage.setItem('currentUserId', profileData.id);

          // Role-based routing: do NOT drop admins/staff into the customer dashboard
          if (profileData.role === 'admin') {
            sessionStorage.setItem('halden_admin', JSON.stringify(profileData));
            if (!window.location.href.includes('admin.html')) window.location.href = 'admin.html';
            return;
          } else if (profileData.role === 'staff') {
            sessionStorage.setItem('halden_staff', JSON.stringify(profileData));
            if (!window.location.href.includes('staff.html')) window.location.href = 'staff.html';
            return;
          }

          // Also keep halden_customer in sync with a clean flat object
          localStorage.setItem('halden_customer', JSON.stringify(profileData));

          const dName = profileData.name || profileData.email;
          setLoggedIn({ displayName: dName, email: profileData.email, uid: profileData.id }, true);
          listenToCustomerChat();
          initCustomerMeetingListener();

          if (_firstAuthCheck) {
            _firstAuthCheck = false;
            const nameEl = document.getElementById('dash-user-name');
            const emailEl = document.getElementById('dash-user-email');
            if (nameEl) nameEl.textContent = dName || 'Customer';
            if (emailEl) emailEl.textContent = profileData.email;
            if (typeof renderProfileReservations === 'function') renderProfileReservations();
            if (typeof listenForDirectives === 'function') listenForDirectives();
          }
          return;
        }
      } catch (e) { console.warn('Session restore: profile fetch failed', e); }
    }

    // No native session — fall back to localStorage (RPC login path)
    const restored = restoreFromLocalStorage();
    if (!restored) {
      setLoggedOut();
      _firstAuthCheck = false;
      localStorage.removeItem('halden_logged_in');

      if (!window.CUSTOMER_PAGE) {
        const splash = document.getElementById('authPromptModal');
        if (splash) { splash.style.display = 'flex'; splash.classList.remove('hidden'); }
      }
    }
  });
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

  reservations.forEach(function (ev) {
    const status = String(ev.status || '').toLowerCase();
    if (!activeStatuses.includes(status)) return;

    const eventDate = _normalizeDateKey(ev.date);
    if (!eventDate) return;

    events.push({
      id: ev.id,
      title: ' ' + (ev.type || 'Private Event'),
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
          <div class="ev-cal-event-meta"> ${r.pax || '—'} pax</div>
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
    eventDidMount: function (info) {
      // Tooltips
      if (info.event.extendedProps.type === 'event') {
        info.el.title = info.event.extendedProps.eventType + ' — ' + info.event.extendedProps.pax + ' pax';
      } else {
        info.el.title = 'Preparation in progress';
      }
    },
    // No click handler — this is public, read-only
    eventClick: function (info) { info.jsEvent.preventDefault(); }
  });
  _publicCalendar.render();
}

window.initPublicCalendar = initPublicCalendar;

// ===== INITIAL RENDER =====
window.addEventListener('DOMContentLoaded', () => {
  // If on customer dashboard page, skip the index-only initialization
  if (window.CUSTOMER_PAGE) {
    return;
  }

  // IMMEDIATE session restore — check localStorage before Firebase even loads.
  // If the user was logged in, show their dashboard right away.
  const wasLoggedIn = localStorage.getItem('halden_logged_in') === 'true';
  const isAdmin = localStorage.getItem('halden_user_type') === 'admin';
  const isStaff = localStorage.getItem('halden_user_type') === 'staff';

  if (wasLoggedIn && !isAdmin && !isStaff) {
    // Hide splash immediately — don't let it flash
    const splash = document.getElementById('authPromptModal');
    if (splash) { splash.classList.add('hidden'); splash.style.display = 'none'; }
  } else {
    // Not logged in — run the normal splash check
    checkAuthPrompt();
  }

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
  if (!el) return;
  if (custCalendar) {
    custCalendar.destroy();
    custCalendar = null;
  }

  custCalendar = new FullCalendar.Calendar(el, {
    initialView: 'dayGridMonth',
    headerToolbar: { left: 'prev,next', center: 'title', right: 'today' },
    height: 'auto',
    events: async function (info, successCallback, failureCallback) {
      try {
        const { collection, getDocs, query, where } = window.firebaseFns;
        const db = window.firebaseDB;

        // Same helper used in admin.js — converts "Jul 31, 2026" or any format to "2026-07-31"
        function normalizeDateKey(dateStr) {
          if (!dateStr) return dateStr;
          if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
          const d = new Date(dateStr);
          if (isNaN(d.getTime())) return dateStr;
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${y}-${m}-${day}`;
        }

        // Reservations
        const resSnap = await getDocs(query(collection(db, 'reservations'), where('email', '==', currentUser.email)));

        // Meetings
        let mtSnap = await getDocs(query(collection(db, 'meetings'), where('customerEmail', '==', (currentUser.email || '').toLowerCase().trim())));
        if (mtSnap.empty) {
          mtSnap = await getDocs(query(collection(db, 'meetings'), where('clientName', '==', currentUser.displayName || currentUser.name || 'Customer')));
        }
        
        const todayStr = new Date().toISOString().split('T')[0];

        const mtEvents = mtSnap.docs
          .filter(d => {
            const data = d.data();
            const s = (data.status || '').toLowerCase();
            if (s === 'cancelled' || s === 'rejected' || s === 'expired') return false;
            if (data.date < todayStr) return false; // Hide past meetings
            
            const parentRes = resSnap.docs.find(r => r.id === data.reservationId);
            if (!parentRes) return false; // Parent reservation was deleted
            const pStatus = (parentRes.data().status || '').toLowerCase();
            if (pStatus === 'cancelled' || pStatus === 'rejected') return false;
            return true;
          })
          .map(d => ({
            title: `Meeting: ${d.data().agenda || 'Scheduled'}`,
            start: d.data().date,
            color: 'var(--gold)',
            textColor: '#000'
          }));
        
        function getReservationPrepStartDate(res) {
          const eventDate = normalizeDateKey(res.date);
          if (!eventDate) return eventDate;
          const eventObj = new Date(eventDate + 'T00:00:00');
          if (isNaN(eventObj.getTime())) return eventDate;

          const minPrepObj = new Date(eventObj);
          minPrepObj.setDate(minPrepObj.getDate() - 7);

          const rawSubmitted = res.submittedDate || res.createdAt || res.requestedAt || res.bookedAt;
          const submitted = rawSubmitted ? normalizeDateKey(rawSubmitted) : null;
          if (submitted) {
            const submittedObj = new Date(submitted + 'T00:00:00');
            if (!isNaN(submittedObj.getTime()) && submittedObj < eventObj) {
              return (submittedObj > minPrepObj ? submittedObj : minPrepObj).toISOString().split('T')[0];
            }
          }
          return eventDate;
        }

        const resEvents = [];
        resSnap.docs.forEach(d => {
          const ev = { id: d.id, ...d.data() };
          if ((ev.status || '').toLowerCase() !== 'confirmed') return;
          
          const eventDate = normalizeDateKey(ev.date);
          if (!eventDate) return; // skip if date can't be parsed
          const prepStart = getReservationPrepStartDate(ev);
          
          if (prepStart && prepStart !== eventDate) {
            resEvents.push({
              title: '',
              start: prepStart,
              end: eventDate,
              allDay: true,
              color: '#d35400',
              textColor: '#fff',
              className: 'prep-event'
            });
          }
          resEvents.push({
            title: `Event: ${ev.packageName || ev.eventType || ev.type || 'Reservation'}`,
            start: eventDate,
            color: '#d35400',
            textColor: '#fff'
          });
        });

        successCallback([...mtEvents, ...resEvents]);
      } catch (e) { failureCallback(e); }
    }
  });
  custCalendar.render();
}

async function renderCustomerMeetings() {
  const container = document.getElementById('customer-meetings-list');
  if (!container) return;

  // Show placeholder immediately
  container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-dim); font-size:13px;">Loading your meetings...</div>`;
  setTimeout(initOfficeMap, 100);

  try {
    const user = window.auth?.currentUser || JSON.parse(localStorage.getItem('halden_customer') || 'null');
    if (!user) { container.innerHTML = `<div class="cp-res-empty">Please log in to view meetings.</div>`; return; }

    const { collection, getDocs, query, where, updateDoc, doc } = window.firebaseFns;
    const db = window.firebaseDB;

    const userEmail = (user.email || '').toLowerCase().trim();
    const userName = (user.displayName || user.name || '').toLowerCase().trim();

    let q = query(collection(db, 'meetings'), where('customerEmail', '==', userEmail));
    // Fallback: If we had a way to cleanly do OR queries we would. Since Supabase adapter has limits, 
    // we'll try email. If the initial fetch is empty, we fall back to name-based query permanently for this session.
    let initialSnap = await getDocs(q);
    if (initialSnap.empty && userName) {
      q = query(collection(db, 'meetings'), where('clientName', '==', user.displayName || user.name || 'Customer'));
    }

    const resSnap = await getDocs(query(collection(db, 'reservations'), where('email', '==', userEmail)));

    if (window.customerMeetingsUnsub) {
      window.customerMeetingsUnsub();
      window.customerMeetingsUnsub = null;
    }

    window.customerMeetingsUnsub = onSnapshot(q, async (snap) => {
      if (snap.empty) {
        container.innerHTML = `<div class="cp-res-empty">No meetings scheduled yet.</div>`;
        return;
      }

    const meetings = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(m => {
      const parentRes = resSnap.docs.find(r => r.id === m.reservationId);
      if (!parentRes) return false; // Parent reservation was deleted
      const rData = parentRes.data();
      if (rData.status === 'cancelled') return false;
      m._reservationName = rData.packageName || 'Custom Package';

      // Filter out past meetings
      if (m.date) {
        try {
          const mDate = new Date(m.date);
          mDate.setHours(23, 59, 59, 999);
          if (mDate.getTime() < Date.now()) return false;
        } catch(e) {}
      }

      return true;
    });

    if (meetings.length === 0) {
      container.innerHTML = `<div class="cp-res-empty">No active meetings found.</div>`;
      return;
    }

    const now = Date.now();
    let cards = '';

    for (const m of meetings) {
      const status = (m.status || '').toLowerCase();

      // ── Check for expired awaiting_customer (> 24h) ──
      if (status === 'awaiting_customer' && m.createdAt) {
        const created = new Date(m.createdAt).getTime();
        if ((now - created) > 24 * 60 * 60 * 1000) {
          // Auto-cancel
          try {
            await updateDoc(doc(db, 'meetings', m.id), { 
              status: 'expired', 
              updatedAt: new Date().toISOString()
            });
            if (m.reservationId) {
              await updateDoc(doc(db, 'reservations', m.reservationId), {
                status: 'cancelled',
                cancellationNote: 'Automatically cancelled: customer did not select a proposed meeting schedule within 24 hours.',
                updatedAt: new Date().toISOString()
              });
            }
          } catch (e) { console.warn('Auto-cancel failed:', e); }
          cards += `
            <div style="background:var(--bg3); border:1px solid var(--red); border-radius:16px; overflow:hidden; margin-bottom:20px; opacity:0.7;">
              <div style="padding:16px 20px; background:rgba(231,76,60,0.08);">
                <div style="font-size:13px; font-weight:700; color:var(--red);">Meeting Expired &amp; Reservation Cancelled</div>
                <div style="font-size:12px; color:var(--text-dim); margin-top:4px;">You did not select a meeting time within 24 hours. Your reservation was automatically cancelled.</div>
              </div>
            </div>`;
          continue;
        }

        // ── ACTION REQUIRED: awaiting_customer card ──
        const expiresAt = created + 24 * 60 * 60 * 1000;
        const remaining = Math.max(0, expiresAt - now);
        const hrs = Math.floor(remaining / 3600000);
        const mins = Math.floor((remaining % 3600000) / 60000);
        const countdownId = `cmt-countdown-${m.id}`;
        const slots = Array.isArray(m.adminProposedTimes) ? m.adminProposedTimes : [];

        // Start live countdown
        if (remaining > 0) {
          setTimeout(() => {
            let rem = remaining;
            const tick = setInterval(() => {
              rem -= 60000;
              const el = document.getElementById(countdownId);
              if (!el || rem <= 0) { clearInterval(tick); return; }
              const h = Math.floor(rem / 3600000), mn = Math.floor((rem % 3600000) / 60000);
              el.textContent = `${h}h ${mn}m remaining`;
            }, 60000);
          }, 0);
        }

        cards += `
          <div style="background:var(--bg3); border:2px solid #e67e22; border-radius:16px; overflow:hidden; margin-bottom:20px; box-shadow:0 8px 32px rgba(230,126,34,0.18);">
            <div style="padding:16px 20px; background:rgba(230,126,34,0.10); display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-size:14px; font-weight:800; color:#e67e22;">ACTION REQUIRED - Choose a Meeting Time</div>
                <div style="font-size:12px; color:var(--text-mid); margin-top:4px;">The organizer has proposed meeting times for: <strong>${m.agenda || 'Consultation'}</strong></div>
              </div>
              <div style="text-align:right; min-width:120px;">
                <div style="font-size:11px; color:var(--text-dim);">Expires in</div>
                <div id="${countdownId}" style="font-size:16px; font-weight:800; color:#e67e22;">${hrs}h ${mins}m</div>
              </div>
            </div>
            <div style="padding:20px;">
              <div style="font-size:12px; color:var(--text-dim); margin-bottom:12px; padding:10px; background:rgba(231,76,60,0.08); border-radius:8px; border:1px solid rgba(231,76,60,0.2);">
                <strong style="color:#c0392b;">Important:</strong> If you do not select a time within the deadline, your reservation will be automatically cancelled.
              </div>
              <div style="font-size:12px; font-weight:700; color:var(--text); margin-bottom:10px;">Select one of the proposed times:</div>
              <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px;">
                ${slots.map((s, idx) => `
                  <label style="display:flex; align-items:center; gap:12px; padding:12px 16px; border:2px solid var(--border); border-radius:10px; cursor:pointer; transition:border-color 0.2s;"
                    onmouseover="this.style.borderColor='#e67e22'" onmouseout="this.style.borderColor='var(--border)'">
                    <input type="radio" name="cmt_slot_${m.id}" value="${idx}"
                      style="width:16px; height:16px; accent-color:#e67e22;"
                      onchange="document.getElementById('cmt-select-btn-${m.id}').disabled=false;" />
                    <div>
                      <div style="font-size:14px; font-weight:700; color:var(--text);">${s.date}</div>
                      <div style="font-size:12px; color:var(--text-dim);">${s.start} – ${s.end}</div>
                    </div>
                  </label>
                `).join('')}
              </div>
              <button id="cmt-select-btn-${m.id}" disabled
                onclick="selectAdminProposedTime('${m.id}', '${m.reservationId || ''}', ${JSON.stringify(slots).replace(/"/g, '&quot;')})"
                style="width:100%; padding:14px; background:#e67e22; color:#fff; border:none; border-radius:12px; font-weight:800; font-size:14px; cursor:pointer; opacity:0.5; transition:opacity 0.2s;"
                onmouseover="if(!this.disabled)this.style.opacity='0.85'" onmouseout="if(!this.disabled)this.style.opacity='1'">
                Confirm Selected Time
              </button>
            </div>
          </div>`;
        continue;
      }

      if (status === 'expired' || status === 'cancelled') continue;

      // ── Normal meeting card (scheduled / live / completed) ──
      const roomId = m.meetingRoomId || m.roomId || `MTG-${m.id.substring(0,8).toUpperCase()}`;
      const dateStr = m.date || 'TBD';
      const time = m.time || 'TBD';
      const isLive = status === 'live';

      cards += `
        <div style="background:var(--bg3); border:1px solid ${isLive ? 'var(--gold)' : 'var(--border)'}; border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.12); margin-bottom:20px;">
          <div style="padding:20px; border-bottom:1px solid rgba(0,0,0,0.05); display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.02);">
            <div style="display:flex; align-items:center; gap:12px;">
              <div style="background:var(--gold); color:#000; padding:4px 10px; border-radius:6px; font-size:10px; font-weight:800; letter-spacing:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:180px;">${m._reservationName || roomId}</div>
              <div style="font-size:12px; font-weight:700; color:var(--text-dim); text-transform:uppercase;">${m.type || 'Consultation'}</div>
            </div>
            <div class="badge ${isLive ? 'live' : (status === 'completed' ? 'confirmed' : 'pending')}" style="padding:6px 14px; border-radius:10px; font-size:10px; font-weight:800;">${status.toUpperCase()}</div>
          </div>
          <div style="padding:24px; display:grid; grid-template-columns:1fr 1fr; gap:30px;">
            <div>
              <div style="margin-bottom:20px;">
                <div style="font-size:11px; color:var(--gold); font-weight:700; text-transform:uppercase; margin-bottom:5px;">Meeting Schedule</div>
                <div style="font-size:16px; font-weight:700; color:var(--text); display:flex; align-items:center; gap:10px;">
                  <span>${dateStr}</span><span style="color:var(--border);">|</span><span>${_fmtTimeRange(time)}</span>
                </div>
              </div>
              <div>
                <div style="font-size:11px; color:var(--gold); font-weight:700; text-transform:uppercase; margin-bottom:5px;">Discussion Agenda</div>
                <div style="font-size:13px; color:var(--text-mid); line-height:1.6; background:rgba(0,0,0,0.03); padding:12px; border-radius:10px; border:1px solid rgba(0,0,0,0.05);">
                  ${m.agenda || 'General consultation.'}
                </div>
              </div>
            </div>
            <div style="display:flex; flex-direction:column; justify-content:space-between;">
              <div style="background:rgba(231,76,60,0.08); border:1px solid rgba(231,76,60,0.2); padding:15px; border-radius:12px;">
                <p style="margin:0; font-size:11px; color:#c0392b; line-height:1.4; font-weight:600;">
                  <strong>IMPORTANT:</strong> Failure to attend the scheduled meeting may lead to automatic cancellation of your reservation.
                </p>
              </div>
              <div style="display:flex; gap:12px; margin-top:20px;">
                ${isLive ? `<button onclick="joinMeetingRoom('${roomId}')" style="flex:1.5; background:var(--gold); color:#000; border:none; padding:14px; border-radius:12px; font-weight:800; cursor:pointer; box-shadow:0 6px 15px rgba(196,154,60,0.3);">Join Live Room →</button>` : ''}
                <button onclick="showMeetingDetails('${m.id}')" style="flex:1; background:var(--bg2); color:var(--text); border:1px solid var(--border); padding:14px; border-radius:12px; font-weight:700; cursor:pointer; transition:background 0.3s;">Details &amp; Maps</button>
              </div>
            </div>
          </div>
        </div>`;
    }

    container.innerHTML = cards || `<div class="cp-res-empty">No active meetings found.</div>`;
    }); // End of onSnapshot
  } catch (e) {
    console.error('renderCustomerMeetings error:', e);
    container.innerHTML = `<div class="cp-res-empty">Failed to load meetings. Please refresh.</div>`;
  }
}

async function selectAdminProposedTime(meetingId, reservationId, slots) {
  const selected = document.querySelector(`input[name="cmt_slot_${meetingId}"]:checked`);
  if (!selected) { alert('Please select a time slot first.'); return; }

  const idx = parseInt(selected.value);
  const slot = Array.isArray(slots) ? slots[idx] : null;
  if (!slot) { alert('Invalid selection. Please try again.'); return; }

  const btn = document.getElementById(`cmt-select-btn-${meetingId}`);
  if (btn) { btn.textContent = 'Confirming...'; btn.disabled = true; }

  try {
    const { updateDoc, doc } = window.firebaseFns;
    const db = window.firebaseDB;

    await updateDoc(doc(db, 'meetings', meetingId), {
      status: 'scheduled',
      date: slot.date,
      time: slot.start,
      timeEnd: slot.end,
      timeType: 'customer_selected',
      updatedAt: new Date().toISOString()
    });

    // Show success toast
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = `Meeting confirmed for ${slot.date} at ${slot.start}!`;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 5000);

    // Re-render
    await renderCustomerMeetings();
  } catch (e) {
    console.error('selectAdminProposedTime error:', e);
    alert('Failed to confirm time. Please try again.');
    if (btn) { btn.textContent = 'Confirm Selected Time'; btn.disabled = false; }
  }
}
window.selectAdminProposedTime = selectAdminProposedTime;



function initOfficeMap() {
  const container = document.getElementById('office-map');
  if (!container || container._leaflet_id) return;

  const map = L.map('office-map', { zoomControl: false }).setView([14.6156, 120.9942], 16);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  L.marker([14.6156, 120.9942]).addTo(map).bindPopup("<b>Halden's Office</b><br>18 Basilio St");

  // Force recalculation of container size
  setTimeout(() => map.invalidateSize(), 200);
}

window.showMeetingDetails = async function (meetingId) {
  const { doc, getDoc } = window.firebaseFns;
  const mSnap = await getDoc(doc(window.firebaseDB, 'meetings', meetingId));
  if (!mSnap.exists()) return;
  const m = mSnap.data();

  const modal = document.createElement('div');
  modal.id = 'meeting-details-modal';
  modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); backdrop-filter:blur(15px); z-index:5000; display:flex; align-items:center; justify-content:center; padding:20px;";
  modal.innerHTML = `
    <div style="background:var(--bg); border:1px solid var(--gold); border-radius:32px; width:100%; max-width:850px; max-height:90vh; overflow-y:auto; position:relative; box-shadow:0 40px 100px rgba(0,0,0,0.6); animation: modalIn 0.4s cubic-bezier(0.19, 1, 0.22, 1);">
      <button onclick="this.closest('#meeting-details-modal').remove()" style="position:absolute; top:25px; right:25px; background:rgba(255,255,255,0.08); border:none; color:var(--text); width:40px; height:40px; border-radius:50%; cursor:pointer; font-size:24px; display:flex; align-items:center; justify-content:center; transition: background 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'">&times;</button>
      
      <div style="padding:50px;">
        <div style="display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:40px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:30px;">
          <div>
            <div style="font-size:13px; color:var(--gold); font-weight:800; text-transform:uppercase; letter-spacing:3px; margin-bottom:12px;">Consultation Brief</div>
            <h1 style="margin:0; font-size:42px; font-family:Arial,sans-serif; color:var(--text); letter-spacing:-0.5px;">${m.agenda || 'Planning Session'}</h1>
          </div>
          <div style="text-align:right;">
             <div style="font-size:18px; font-weight:800; color:var(--text);">${m.date}</div>
             <div style="font-size:14px; color:var(--gold); font-weight:600;">${_fmtTimeRange(m.time)}</div>
          </div>
        </div>
        
        <div style="display:grid; grid-template-columns: 1.2fr 0.8fr; gap:40px;">
           <div>
              <div style="margin-bottom:35px;">
                <h3 style="color:var(--gold); font-size:18px; margin-bottom:18px; display:flex; align-items:center; gap:10px;">
                   <span style="background:rgba(196,154,60,0.1); padding:8px; border-radius:8px;"></span> Meeting Agenda
                </h3>
                <div style="color:var(--text-mid); line-height:1.8; font-size:15px; background:rgba(255,255,255,0.02); padding:20px; border-radius:18px; border:1px solid rgba(255,255,255,0.05);">
                  ${m.agenda_detail || 'We will review your event requirements, finalize the menu tasting schedule, and discuss venue logistics for your upcoming reservation.'}
                </div>
              </div>
              
              <div>
                <h3 style="color:var(--gold); font-size:18px; margin-bottom:18px; display:flex; align-items:center; gap:10px;">
                   <span style="background:rgba(196,154,60,0.1); padding:8px; border-radius:8px;"></span> Participants
                </h3>
                <div style="display:flex; flex-direction:column; gap:12px;">
                   <div style="background:rgba(255,255,255,0.03); padding:12px 20px; border-radius:14px; font-size:14px; border:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between; align-items:center;">
                     <span>${m.clientName}</span>
                      <span style="font-size:11px; color:var(--text-dim); text-transform:uppercase; font-weight:700;">Client</span>
                   </div>
                   <div style="background:rgba(196,154,60,0.05); padding:12px 20px; border-radius:14px; font-size:14px; border:1px solid rgba(196,154,60,0.1); display:flex; justify-content:space-between; align-items:center;">
                      <span style="color:var(--gold); font-weight:600;">Alden Lopenario</span>
                      <span style="font-size:11px; color:var(--gold); text-transform:uppercase; font-weight:700;">Host</span>
                   </div>
                </div>
              </div>
           </div>
           
           <div>
              <h3 style="color:var(--gold); font-size:18px; margin-bottom:18px; display:flex; align-items:center; gap:10px;">
                 <span style="background:rgba(196,154,60,0.1); padding:8px; border-radius:8px;"></span> Venue Details
              </h3>
              <div style="background:var(--bg3); border-radius:20px; padding:20px; margin-bottom:20px; border:1px solid rgba(255,255,255,0.05);">
                 <div style="font-weight:800; font-size:16px; color:var(--text); margin-bottom:6px;">Halden's Main Office</div>
                 <div style="font-size:13px; color:var(--text-dim); line-height:1.5;">18 Basilio St, Manila,<br/>Metro Manila, Philippines</div>
              </div>
              <div id="meeting-office-map" style="width:100%; height:250px; border-radius:24px; background:#111; border:1px solid rgba(255,255,255,0.1); box-shadow:0 10px 30px rgba(0,0,0,0.3);"></div>
              <div style="margin-top:15px; font-size:12px; color:var(--text-dim); text-align:center; font-style:italic;">
                "Please arrive 15 minutes before the scheduled time."
              </div>
           </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  setTimeout(() => {
    const map = L.map('meeting-office-map', { zoomControl: false }).setView([14.6156, 120.9942], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    L.marker([14.6156, 120.9942]).addTo(map).bindPopup("<b>Halden's Office</b><br>18 Basilio St").openPopup();
    setTimeout(() => map.invalidateSize(), 200);
  }, 300);
}

window.toggleDashChat = function () {
  const panel = document.getElementById('dash-chat-side-panel');
  if (!panel) return;
  if (panel.style.right === '0px') {
    panel.style.right = '-60%';
  } else {
    panel.style.right = '0px';
    initDashChat();
  }
}

async function initDashChat() {
  const container = document.getElementById('dash-chat-messages');
  if (!container) return;
  container.innerHTML = '<div style="color:var(--text-dim); font-size:12px; text-align:center; padding:40px;">Initializing secure connection...</div>';

  const currentUser = window.auth?.currentUser || JSON.parse(localStorage.getItem('halden_customer'));
  if (!currentUser) return;

  const { collection, query, where, orderBy, onSnapshot } = window.firebaseFns;
  const q = query(collection(window.firebaseDB, 'chat_messages'), where('clientId', '==', currentUser.uid), orderBy('timestamp', 'asc'));

  onSnapshot(q, (snap) => {
    container.innerHTML = '';
    if (snap.empty) {
      container.innerHTML = `
        <div style="text-align:center; padding:60px 20px;">
          <div style="font-size:50px; margin-bottom:20px; filter:drop-shadow(0 10px 10px rgba(0,0,0,0.3));"></div>
          <div style="font-weight:800; color:var(--gold); font-size:22px; margin-bottom:10px; font-family:Arial,sans-serif;">Welcome!</div>
          <div style="font-size:14px; color:var(--text-dim); line-height:1.6;">How can we assist you with your event today? Our specialist team is ready to help.</div>
        </div>
      `;
    }
    snap.forEach(doc => {
      const m = doc.data();
      const isMe = m.senderId === currentUser.uid;
      const div = document.createElement('div');
      div.style = `max-width:85%; padding:15px 20px; border-radius:20px; font-size:14px; line-height:1.6; position:relative; ${isMe ? 'align-self:flex-end; background:var(--gold); color:#1a1007; border-bottom-right-radius:4px; font-weight:500; box-shadow:0 8px 20px rgba(196,154,60,0.2);' : 'align-self:flex-start; background:var(--bg3); color:var(--text); border-bottom-left-radius:4px; border:1px solid var(--border); box-shadow:0 8px 20px rgba(0,0,0,0.1);'}`;
      div.textContent = m.text;
      container.appendChild(div);
    });
    container.scrollTop = container.scrollHeight;
  });
}

window.sendDashChatMessage = async function () {
  const input = document.getElementById('dash-chat-input');
  const text = input.value.trim();
  if (!text) return;

  const currentUser = window.auth?.currentUser || JSON.parse(localStorage.getItem('halden_customer'));
  if (!currentUser) return;

  const { collection, addDoc, serverTimestamp } = window.firebaseFns;
  try {
    await addDoc(collection(window.firebaseDB, 'chat_messages'), {
      clientId: currentUser.uid,
      senderId: currentUser.uid,
      senderName: currentUser.displayName || currentUser.name || 'Customer',
      text: text,
      timestamp: serverTimestamp()
    });
    input.value = '';
  } catch (e) {
    console.error(e);
  }
}

async function renderCustomerFlags() {
  const container = document.getElementById('customer-flags-list');
  if (!container) return;

  const { collection, getDocs, query, where } = window.firebaseFns;
  const resSnap = await getDocs(query(collection(window.firebaseDB, 'reservations'), where('email', '==', currentUser.email)));

  let flags = [];
  resSnap.forEach(d => {
    const data = d.data();
    if (data.paymentRequested && data.paymentStatus !== 'paid') {
      flags.push({ id: d.id, type: 'payment', title: 'Payment Required', text: `Reservation for ${data.date} requires initial deposit.`, amount: data.amount });
    }
  });

  const badge = document.getElementById('flag-badge');
  // System notifications
  flags.push({ id: 'notif-meeting', type: 'meeting', title: ' Meeting Scheduled', text: 'Your final consultation meeting has been scheduled for November 5, 2025 at 2:00 PM. Please ensure you are available.' });
  flags.push({ id: 'notif-confirm', type: 'info', title: ' ReservationConfirmed', text: 'Your reservation has been approved and confirmed by the admin. Check your Reservation Details tab for the full overview.' });
  flags.push({ id: 'notif-review', type: 'info', title: ' Event Completed – Leave a Review!', text: 'Your event has been marked as fulfilled. Visit the Summary & Feedback tab to rate your experience.' });
  if (flags.length > 0) {
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
  if (directiveUnsub) directiveUnsub();
  const { collection, query, where, onSnapshot } = window.firebaseFns;
  const q = query(collection(window.firebaseDB, 'reservations'), where('email', '==', currentUser.email));

  directiveUnsub = onSnapshot(q, (snap) => {
    snap.docChanges().forEach(change => {
      if (change.type === "modified") {
        const data = change.doc.data();
        if (data.paymentRequested && data.paymentStatus !== 'paid') {
          openPaymentModal(change.doc.id, data.amount);
        }
      }
    });
    renderCustomerFlags();
  });
}

function openPaymentModal(resId, amount, label = 'Reservation Payment') {
  activePaymentResId = resId;
  window.currentPaymentMethod = null;
  window.activePaymentAmount = amount;
  window.activePaymentLabel = label;

  document.getElementById('pay-amt-display').textContent = '₱' + Number(amount).toLocaleString();
  document.getElementById('pay-selection-area').style.display = 'block';
  document.getElementById('pay-waiting-area').style.display = 'none';
  document.getElementById('pay-btn-submit').style.display = 'block';
  document.getElementById('pay-btn-submit').textContent = 'Select a Method';
  document.getElementById('pay-btn-submit').disabled = true;
  document.querySelectorAll('.pay-opt').forEach(el => el.style.borderColor = '#eee');
  document.getElementById('payment-overlay').classList.add('on');
  document.getElementById('payment-modal').classList.add('open');
}

function closePaymentModal() {
  document.getElementById('payment-overlay').classList.remove('on');
  document.getElementById('payment-modal').classList.remove('open');
  activePaymentResId = null;
  window.currentPaymentMethod = null;
}

function selectPaymentOption(mode) {
  window.currentPaymentMethod = mode;
  document.querySelectorAll('.pay-opt').forEach(el => el.style.borderColor = '#eee');
  document.getElementById('pay-opt-' + mode).style.borderColor = '#4f46e5';

  const btn = document.getElementById('pay-btn-submit');
  btn.disabled = false;
  if (mode === 'online') {
    btn.textContent = 'Proceed to Pay Online';
  } else {
    btn.textContent = 'Confirm Cash Payment';
  }
}

async function submitPaymentModal() {
  if (!activePaymentResId || !window.currentPaymentMethod) return;
  const btn = document.getElementById('pay-btn-submit');
  btn.disabled = true;

  try {
    const { updateDoc, doc, getDoc } = window.firebaseFns;
    const resRef = doc(window.firebaseDB, 'reservations', activePaymentResId);
    const resSnap = await getDoc(resRef);
    const resData = resSnap.data();

    if (window.currentPaymentMethod === 'cash') {
      btn.textContent = 'Notifying Admin...';
      await updateDoc(resRef, {
        paymentMethod: 'cash',
        cashPaymentStatus: 'waiting_for_admin',
        pendingCashAmount: window.activePaymentAmount || resData.paymentAmount,
        pendingCashLabel: window.activePaymentLabel || 'General Payment'
      });
      document.getElementById('pay-selection-area').style.display = 'none';
      btn.style.display = 'none';
      document.getElementById('pay-waiting-area').style.display = 'block';
    } else {
      btn.textContent = 'Redirecting to Gateway...';

      const finalAmt = window.activePaymentAmount || resData.paymentAmount || 0;
      const finalLabel = window.activePaymentLabel || ('Payment for ' + resData.type);

      const payload = {
        items: [
          { name: finalLabel, amount: parseInt(finalAmt) * 100, quantity: 1 }
        ],
        customerInfo: {
          name: resData.client, email: resData.email, phone: resData.phone || ''
        },
        reservationId: activePaymentResId
      };

      const response = await fetch('/api/paymongo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to initialize payment gateway.');
        btn.disabled = false;
        btn.textContent = 'Proceed to Pay Online';
      }
    }
  } catch (e) {
    console.error(e);
    alert('Payment processing failed.');
    btn.disabled = false;
    btn.textContent = 'Proceed to Pay Online';
  }
}

window.openPaymentModal = openPaymentModal;
window.closePaymentModal = closePaymentModal;
window.selectPaymentOption = selectPaymentOption;
window.submitPaymentModal = submitPaymentModal;

// finishSignup — closes auth drawer and reloads state
function finishSignup() {
  closeAuth();
  location.reload();
}
window.finishSignup = finishSignup;


function openDishModal(id) {
  const item = CAT.find(i => i.id === id);
  if (!item) return;
  document.getElementById('dm-title').textContent = item.name;

  const descEl = document.getElementById('dm-desc');
  if (descEl) descEl.textContent = item.desc || '';

  const pax = document.getElementById('cpkg-pax')?.value || 0;
  const p = parseInt(pax) || 0;
  const dp = getDynamicPrice(item, p);

  const batchInfo = getBatchInfo(item, p);

  const priceEl = document.getElementById('dm-price-info');
  if (priceEl) {
    if (item.cat === 'drink' && item.identify !== 'drinks_package') {
      priceEl.innerHTML = '';
    } else {
      priceEl.innerHTML = `&#8369;${dp.toLocaleString()} <span style="font-size:12px; color:var(--text-dim); font-weight:400;">${batchInfo}</span>`;
    }
  }

  const isDish = ['food', 'dessert', 'drink'].includes(item.cat);
  const disclaimer = document.getElementById('dm-allergy-disclaimer');
  if (disclaimer) disclaimer.style.display = isDish ? 'flex' : 'none';

  const labelEl = document.querySelector('.dm-label');
  const ingGrid = document.getElementById('dm-ingredients');

  if (item.cat === 'decoration') {
    if (labelEl) labelEl.style.display = 'none';
    if (ingGrid) ingGrid.style.display = 'none';
  } else {
    if (labelEl) {
      labelEl.style.display = 'inline-block';
      labelEl.textContent = 'INGREDIENTS & HIGHLIGHTS';
    }
    if (ingGrid) {
      ingGrid.style.display = ''; 
      if (item.ingredients) {
        ingGrid.innerHTML = item.ingredients.map(ing => `<span class="ingredient-pill">${ing}</span>`).join('');
      } else {
        const type = ['food', 'dessert', 'drink'].includes(item.cat) ? 'Ingredients' : 'Components';
        ingGrid.innerHTML = `<p style="font-size:12px;color:#888;">${type} list not available for this item.</p>`;
      }
    }
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
function closeResWaitModal() {
  const ov = document.getElementById('res-wait-overlay');
  const md = document.getElementById('res-wait-modal');
  if (md) {
    md.style.opacity = '0';
    md.style.transform = 'scale(0.9)';
  }
  setTimeout(() => {
    if (ov) ov.style.display = 'none';
    openProfile();
  }, 300);
}
window.closeResWaitModal = closeResWaitModal;

// Populate the Reservation Details dropdown when the tab opens
window.initCustomerResDetails = async function () {
  const selector = document.getElementById('resd-approved-selector');
  if (!selector || !currentUser) return;

  const userEmail = (currentUser.email || '').trim();
  const { collection, query, where, onSnapshot } = window.firebaseFns;

  if (window._customerResListenerUnsub) {
    window._customerResListenerUnsub();
  }
  if (window._customerResListenerUnsub2) {
    window._customerResListenerUnsub2();
  }

  const processRes = (myRes) => {
    if (myRes.length === 0) {
      selector.innerHTML = '<option value="">No confirmed reservations found.</option>';
      const contentEl = document.getElementById('resd-content');
      if (contentEl) {
        contentEl.innerHTML = `
          <div style="text-align:center; padding:100px 20px; color:var(--text-dim);">
            <div style="font-size:16px; font-weight:600; color:var(--text-mid);">No Reservation Selected</div>
            <div style="font-size:13px; margin-top:5px;">Once your reservation is confirmed, you can track all logistics and planning details here.</div>
          </div>
        `;
      }
      return;
    }

    const currentVal = selector.value;
    selector.innerHTML = '<option value="">-- Select a Reservation --</option>' +
      myRes.map(r => `<option value="${r.id}">${r.packageName || r.type || 'Event'} : ${r.date}</option>`).join('');
    
    if (currentVal && myRes.find(r => r.id === currentVal)) {
      selector.value = currentVal;
    }

    if (!window.RESERVATIONS) window.RESERVATIONS = [];
    myRes.forEach(r => {
      const idx = window.RESERVATIONS.findIndex(x => x.id === r.id);
      if (idx !== -1) window.RESERVATIONS[idx] = r;
      else window.RESERVATIONS.push(r);
    });

    if (activeResDetailId && window.switchResDetailsTab && resDetailsActiveTab) {
      window.switchResDetailsTab(resDetailsActiveTab);
    }
  };

  const q = query(collection(window.firebaseDB, 'reservations'), where('email', '==', userEmail));
  window._customerResListenerUnsub = onSnapshot(q, (snap) => {
    let myRes = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(r =>
      ['approved', 'confirmed', 'procurement', 'procuring', 'preparing', 'on-going', 'completed'].includes((r.status || '').toLowerCase())
    );

    if (myRes.length > 0) {
      processRes(myRes);
    } else {
      const q2 = query(collection(window.firebaseDB, 'reservations'), where('customerEmail', '==', userEmail));
      window._customerResListenerUnsub2 = onSnapshot(q2, (snap2) => {
        let myRes2 = snap2.docs.map(d => ({ id: d.id, ...d.data() })).filter(r =>
          ['approved', 'confirmed', 'procurement', 'procuring', 'preparing', 'on-going', 'completed'].includes((r.status || '').toLowerCase())
        );
        processRes(myRes2);
      });
    }
  });
};



window.customerSelectReservation = function (resId) {
  if (!resId) return;
  activeResDetailId = resId;

  if (typeof window.switchResDetailsTab === 'function') {
    const curTab = resDetailsActiveTab || 'details';
    const tabBtn = document.getElementById('resd-tab-' + curTab);
    window.switchResDetailsTab(curTab, tabBtn);
  } else {
    renderReservationDetailContent();
  }
};


window.activePaymentResId = null;
window.renderCustomerPayments = async function () {
  const container = document.getElementById('dash-tab-payments');
  if (!container) return;

  if (!currentUser) return;
  const userEmail = (currentUser.email || '').trim();
  const { collection, getDocs, query, where } = window.firebaseFns;

  container.innerHTML = `
    <div style="padding:40px; text-align:center;">
       <div class="spinner" style="margin:0 auto 20px;"></div>
       <div style="color:var(--text-dim); font-weight:600;">Generating Statements...</div>
    </div>
  `;

  try {
    const q = query(collection(window.firebaseDB, 'reservations'), where('email', '==', userEmail));
    const snap = await getDocs(q);
    let myRes = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(r =>
      ['approved', 'confirmed', 'procuring', 'preparing', 'on-going', 'completed'].includes((r.status || '').toLowerCase())
    );

    if (myRes.length === 0) {
      container.innerHTML = `
        <div style="padding:80px 40px; text-align:center; background:var(--bg2); border-radius:24px; border:1px dashed var(--border);">
           <h3 style="color:var(--gold);">No Pending Payments</h3>
           <p style="color:var(--text-dim); max-width:400px; margin:10px auto;">Once your reservations are approved, your billing statements will appear here.</p>
        </div>
      `;
      return;
    }

    if (!window.activePaymentResId || !myRes.find(r => r.id === window.activePaymentResId)) {
      window.activePaymentResId = myRes[0].id;
    }

    let topDropdownHtml = `
      <div class="cp-sel-bar" style="margin-bottom:24px; background:var(--bg3); border-radius:12px; padding:16px 20px; border:1px solid var(--border);">
        <div class="cp-sel-lbl" style="margin-bottom:8px; font-size:10px; color:var(--gold); font-weight:700; letter-spacing:1px; text-transform:uppercase;">ACTIVE RESERVATION PAYMENT</div>
        <select class="cp-sel-field" onchange="window.activePaymentResId = this.value; window.renderCustomerPayments()" style="width:100%; max-width:100%; height:44px; background:var(--bg2); color:var(--cream); border:1px solid var(--border); border-radius:8px; padding:0 12px; outline:none; cursor:pointer;">
          ${myRes.map(r => `<option value="${r.id}" ${r.id === window.activePaymentResId ? 'selected' : ''}>${r.packageName || r.type || 'Event'} : ${r.date}</option>`).join('')}
        </select>
      </div>
      <div id="c-payment-tab-inner"></div>
    `;

    container.innerHTML = topDropdownHtml;
    await renderPaymentTab('c-payment-tab-inner', window.activePaymentResId);

  } catch (e) {
    console.error("renderCustomerPayments error:", e);
    container.innerHTML = '<div style="padding:40px; text-align:center; color:var(--red);">Failed to retrieve billing statements. Please try again later.</div>';
  }
};

window.payInstallment = function (resId, amount, label) {
  openPaymentModal(resId, amount, label);
};

window.renderCustomerReviews = async function () {
  const container = document.getElementById('c-reviews-list');
  if (!container) return;

  // helper: toggle phase log
  window.togglePhaseLog = function (id) {
    const el = document.getElementById(id);
    const arrow = document.getElementById(id + '-arrow');
    if (!el) return;
    const open = el.style.display !== 'none';
    el.style.display = open ? 'none' : 'flex';
    if (arrow) arrow.style.transform = open ? 'rotate(0deg)' : 'rotate(180deg)';
  };

  // ── RESERVATION SUMMARY ──
  const resSummaryHtml = `
  <div style="background:var(--bg2); border:1px solid var(--gold); border-radius:20px; padding:32px; margin-bottom:28px; box-shadow:0 12px 40px rgba(0,0,0,0.08);">
    <div style="display:flex; align-items:center; gap:14px; margin-bottom:24px; flex-wrap:wrap;">
      <div style="width:48px;height:48px;background:var(--gold);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;"></div>
      <div style="flex:1;">
        <div style="font-size:11px;color:var(--gold);font-weight:800;text-transform:uppercase;letter-spacing:2px;">Event Complete</div>
        <h2 style="margin:4px 0 0;font-size:20px;color:var(--text);">Reservation Summary</h2>
      </div>
      <span style="background:rgba(34,197,94,0.12);color:#16a34a;border:1px solid rgba(34,197,94,0.3);padding:6px 14px;border-radius:20px;font-size:11px;font-weight:700;"> SUCCESSFULLY FULFILLED</span>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:24px;">
      ${[['Event', 'Anniversary Gala'], ['Date', 'October 12, 2025'], ['Venue', 'Grand Ballroom, Makati'], ['Guests', '150 pax'], ['Package', 'Premium Gold Package'], ['Theme', 'Rustic Elegance']].map(([k, v]) => `
      <div style="background:var(--bg3);border-radius:12px;padding:14px;border:1px solid var(--border);">
        <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;">${k}</div>
        <div style="font-size:13px;font-weight:700;color:var(--text);">${v}</div>
      </div>`).join('')}
    </div>
  </div>`;

  // ── PHASES ──
  const phases = [
    {
      id: 'ph1', icon: '', label: 'Departure', color: 'var(--gold)', time: '07:30 AM – 08:45 AM',
      summary: 'Team departed from HQ with all equipment and staff on time.',
      logs: [
        { time: '07:30 AM', text: 'Team assembly at HQ. Head chef and 12 staff confirmed present.' },
        { time: '07:40 AM', text: '3 vehicles loaded: Vehicle A (catering equipment), Vehicle B (décor & linen), Vehicle C (kitchen supplies & perishables).' },
        { time: '07:55 AM', text: 'Inventory checklist signed off by operations lead. All items verified against reservation manifest.' },
        { time: '08:20 AM', text: 'Convoy departed HQ en route to Grand Ballroom, Makati. No traffic delays reported.' },
        { time: '08:45 AM', text: 'Team arrived at venue. Venue coordinator met at loading bay. Unloading commenced.' },
      ]
    },
    {
      id: 'ph2', icon: '', label: 'Deployment', color: 'var(--gold)', time: '09:00 AM – 11:30 AM',
      summary: 'Full venue setup completed ahead of schedule.',
      logs: [
        { time: '09:00 AM', text: 'Kitchen station assembly started. Gas lines connected and burners tested. All units operational.' },
        { time: '09:20 AM', text: '15 round tables and 150 chairs arranged per the approved floor plan. VIP section (3 tables) dressed with premium linen.' },
        { time: '09:50 AM', text: 'Rustic Elegance décor installed — floral centerpieces, fairy light canopy, and wooden arch backdrop erected.' },
        { time: '10:15 AM', text: 'Audio-visual equipment tested. Background music playlist synced and mic levels checked.' },
        { time: '10:45 AM', text: 'Chafing dishes, buffet stations, and warming equipment set up. Food warmers pre-heated.' },
        { time: '11:00 AM', text: 'Final walkthrough conducted by event coordinator. Minor adjustments made to chair alignment in VIP row.' },
        { time: '11:30 AM', text: 'Setup fully complete. Staff briefed on service sequence, guest flow, and emergency protocols.' },
      ]
    },
    {
      id: 'ph3', icon: '', label: 'Execution', color: '#16a34a', time: '12:00 PM – 05:00 PM',
      summary: 'Event executed flawlessly with outstanding guest reception.',
      logs: [
        { time: '12:00 PM', text: 'Doors opened. Guests began arriving. Welcome drinks and canapés served by roving staff.' },
        { time: '12:30 PM', text: 'Program commenced. Emcee introduced the opening segment. All 150 guests seated.' },
        { time: '01:00 PM', text: 'Buffet line opened. All 8 main courses served at optimal temperature. Cold section maintained at ≤4°C.' },
        { time: '02:00 PM', text: 'Dessert station unveiled. 3-tier anniversary cake presented to applause. Photo opportunity facilitated.' },
        { time: '02:30 PM', text: 'Mid-program check: staff rotation completed. Fresh supplies restocked at buffet stations.' },
        { time: '03:30 PM', text: 'Special program segment: speeches and anniversary tribute. Catering team on standby.' },
        { time: '04:30 PM', text: 'Final service round — coffee and petit fours served. Guest satisfaction: highly positive.' },
        { time: '05:00 PM', text: 'Program concluded. Staff began quiet clearing of main dining area.' },
      ]
    },
    {
      id: 'ph4', icon: '', label: 'Bashout', color: 'var(--gold)', time: '05:00 PM – 06:30 PM',
      summary: 'Efficient post-event teardown completed within agreed timeframe.',
      logs: [
        { time: '05:00 PM', text: 'Bashout initiated. Kitchen team began breaking down cooking stations and sealing leftover food.' },
        { time: '05:15 PM', text: 'Tables cleared. Linen collected, sorted by type, and bagged for laundry return.' },
        { time: '05:30 PM', text: 'Décor dismantled carefully. Floral arrangements donated to venue per client request.' },
        { time: '05:50 PM', text: 'All equipment wiped, disassembled, and packed into transport crates. No damage reported.' },
        { time: '06:10 PM', text: 'Venue floor swept and mopped. Venue coordinator confirmed restoration to pre-event state.' },
        { time: '06:30 PM', text: 'Venue officially handed back. Coordinator signed off on exit checklist.' },
      ]
    },
    {
      id: 'ph5', icon: '', label: 'Restorage', color: 'var(--gold)', time: '07:00 PM – 08:00 PM',
      summary: 'All assets inventoried, cleaned, and stored. Event archived.',
      logs: [
        { time: '07:00 PM', text: 'Convoy arrived back at HQ. All 3 vehicles unloaded and equipment inspected for damage.' },
        { time: '07:15 PM', text: 'Chafing dishes, cookware, and serving equipment washed, dried, and returned to storage racks.' },
        { time: '07:30 PM', text: 'Décor props catalogued and shelved. Reusable items logged back into inventory system.' },
        { time: '07:45 PM', text: 'Post-event report filed by operations lead. Final guest count confirmed: 147 attended.' },
        { time: '08:00 PM', text: 'Event officially closed. Reservation marked as FULFILLED. Staff dismissed with commendation.' },
      ]
    }
  ];

  const phasesRow = `
  <div style="margin-bottom:24px;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
      <div style="flex:1;height:1px;background:var(--border);"></div>
      <span style="font-size:11px;color:var(--gold);font-weight:800;text-transform:uppercase;letter-spacing:2px;white-space:nowrap;"> Execution Day Log</span>
      <div style="flex:1;height:1px;background:var(--border);"></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:16px;">
      ${phases.map(p => `
      <div onclick="togglePhaseLog('${p.id}-logs')" style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:16px 12px;cursor:pointer;transition:all 0.2s;text-align:center;position:relative;"
        onmouseenter="this.style.borderColor='var(--gold)';this.style.background='var(--bg3)'"
        onmouseleave="this.style.borderColor='var(--border)';this.style.background='var(--bg2)'">
        <div style="font-size:26px;margin-bottom:6px;">${p.icon}</div>
        <div style="font-size:11px;font-weight:800;color:var(--gold);text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;">${p.label}</div>
        <div style="font-size:10px;color:var(--text-dim);">${p.time}</div>
        <div id="${p.id}-logs-arrow" style="position:absolute;top:10px;right:10px;font-size:10px;color:var(--text-dim);transition:transform 0.2s;">▼</div>
      </div>`).join('')}
    </div>
    ${phases.map(p => `
    <div id="${p.id}-logs" style="display:none;flex-direction:column;gap:0;background:var(--bg2);border:1px solid var(--border);border-radius:14px;margin-bottom:12px;overflow:hidden;">
      <div style="background:rgba(196,154,60,0.08);border-bottom:1px solid var(--border);padding:14px 20px;display:flex;align-items:center;gap:10px;">
        <span style="font-size:20px;">${p.icon}</span>
        <div>
          <div style="font-size:11px;color:var(--gold);font-weight:800;text-transform:uppercase;letter-spacing:1px;">${p.label}</div>
          <div style="font-size:12px;color:var(--text-dim);">${p.summary}</div>
        </div>
        <span style="margin-left:auto;font-size:11px;font-weight:700;color:var(--gold);">${p.time}</span>
      </div>
      <div style="padding:8px 20px;">
        ${p.logs.map((log, i) => `
        <div style="display:flex;gap:12px;padding:10px 0;${i < p.logs.length - 1 ? 'border-bottom:1px solid rgba(0,0,0,0.05);' : ''}">
          <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;">
            <div style="width:7px;height:7px;border-radius:50%;background:${p.color};margin-top:5px;"></div>
            ${i < p.logs.length - 1 ? '<div style="width:1px;flex:1;background:var(--border);margin-top:3px;"></div>' : ''}
          </div>
          <div>
            <span style="font-size:10px;font-weight:800;color:var(--gold);margin-right:8px;">${log.time}</span>
            <span style="font-size:12px;color:var(--text);">${log.text}</span>
          </div>
        </div>`).join('')}
      </div>
    </div>`).join('')}
  </div>`;

  container.innerHTML = resSummaryHtml + phasesRow + `
    <div style="background:var(--bg2); padding:24px; border-radius:16px; margin-bottom:24px; border:1px solid var(--border);">
      <h3 style="margin-bottom:8px;color:var(--text);">Write a Review</h3>
      <p style="font-size:12px; color:var(--text-dim); margin-bottom:15px;">We hope your event was spectacular! Share your thoughts below.</p>
      <div id="star-rating" style="display:flex; gap:8px; margin-bottom:16px; font-size:28px; color:#ddd; cursor:pointer;">
        <span onclick="setReviewStars(1)"></span><span onclick="setReviewStars(2)"></span>
        <span onclick="setReviewStars(3)"></span><span onclick="setReviewStars(4)"></span>
        <span onclick="setReviewStars(5)"></span>
      </div>
      <textarea id="review-text" placeholder="Share your experience..." style="width:100%; height:100px; padding:12px; border-radius:12px; border:1px solid var(--border); background:var(--bg3); margin-bottom:12px; font-family:inherit; color:var(--text); resize:vertical;"></textarea>
      <button class="btn-primary" onclick="submitCustomerReview()">Submit Review</button>
    </div>
    <div id="reviews-feed">
      <div style="padding:20px; background:var(--bg2); border-radius:16px; border:1px solid var(--border);">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <div style="color:var(--gold); font-size:18px;"></div>
          <div style="font-size:12px; color:var(--text-dim);">Oct 12, 2025</div>
        </div>
        <div style="font-size:13px; color:var(--text); line-height:1.6;">${escapeHTML("The service was excellent and the food was amazing! Our guests couldn't stop complimenting the food. Highly recommend Halden's!")}</div>
      </div>
    </div>
  `;
};

window.setReviewStars = function (n) {
  const stars = document.getElementById('star-rating').querySelectorAll('span');
  stars.forEach((s, i) => s.style.color = i < n ? '#f1c40f' : '#ddd');
};

window.submitCustomerReview = function () {
  alert('Thank you! Your review has been submitted.');
  document.getElementById('review-text').value = '';
  setReviewStars(0);
};

window.initResdMap = async function (address) {
  const mapEl = document.getElementById('resd-map');
  if (!mapEl) return;

  if (window.resdMapObj) {
    try {
      window.resdMapObj.remove();
    } catch(e) {}
    window.resdMapObj = null;
  }

  try {
    const url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(address);
    const resp = await fetch(url);
    const data = await resp.json();

    let lat = 14.5995, lon = 120.9842; // Default Manila
    if (data && data.length > 0) {
      lat = parseFloat(data[0].lat);
      lon = parseFloat(data[0].lon);
    }

    const curMapEl = document.getElementById('resd-map');
    if (!curMapEl) return;

    window.resdMapObj = L.map(curMapEl).setView([lat, lon], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(window.resdMapObj);
    L.marker([lat, lon]).addTo(window.resdMapObj).bindPopup(address).openPopup();

    const etaEl = document.getElementById('resd-map-eta');
    if (etaEl) etaEl.textContent = '35 - 50 mins';
  } catch (e) {
    console.error('Map error safely caught:', e);
  }
};

// Each rule defines how much of an asset is needed for one event.
window.ALLOC_RULES = [
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

function getReservationNeedsMarkup(res) {
  const pax = parseInt(res.pax) || 0;
  const tables = Math.ceil(pax * 0.125);
  const lines = [];
  (window.ALLOC_RULES || []).forEach(function (rule) {
    let qty = 0;
    if (rule.ruleType === 'per_pax') qty = Math.ceil(pax * rule.ratio);
    else if (rule.ruleType === 'per_table') qty = Math.ceil(tables * rule.ratio);
    else if (rule.ruleType === 'flat') qty = rule.ratio;
    if (rule.isFragile) qty = Math.ceil(qty * 1.1);
    if (qty > 0) lines.push(`<div class="req-item" style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border);"><div class="req-info"><span class="req-name" style="font-weight:600; color:var(--cream);">${String(rule.name || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span><br/><span class="req-cat" style="font-size:10px; color:var(--text-dim);">${String(rule.category || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')} · ${String(rule.note || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span></div><span class="req-val" style="font-size:14px; font-weight:700; color:var(--gold);">${qty}</span></div>`);
  });
  return lines.length ? lines.join('') : '<div style="font-size:12px;color:var(--text-dim);">No computed requirements available.</div>';
}

window.zoomDoc = function (btn, delta) {
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

window.changeContractSlide = function (dir, totalSlides) {
  const container = document.getElementById('contract-carousel-container');
  if (!container) return;
  const slides = container.querySelectorAll('.contract-slide-img');
  if (!slides || slides.length === 0) return;
  
  let currentIdx = 0;
  slides.forEach((slide) => {
    if (slide.style.display === 'block') {
      currentIdx = parseInt(slide.getAttribute('data-idx') || '0', 10);
      slide.style.display = 'none';
      slide.style.transform = 'scale(1)';
      slide.setAttribute('data-zoom', '1');
    }
  });

  let nextIdx = currentIdx + dir;
  if (nextIdx < 0) nextIdx = slides.length - 1;
  if (nextIdx >= slides.length) nextIdx = 0;

  const nextSlide = container.querySelector(`.contract-slide-img[data-idx="${nextIdx}"]`);
  if (nextSlide) nextSlide.style.display = 'block';

  const indicator = document.getElementById('contract-slide-indicator');
  if (indicator) indicator.textContent = `${nextIdx + 1} / ${totalSlides}`;

  const activeImg = container.querySelector('.contract-slide-img[style*="display: block"]') || nextSlide;
  if (activeImg) {
    const viewBtn = document.querySelector('.panel-hdr button[onclick="openCurrentContractDoc()"]');
    if (viewBtn) viewBtn.setAttribute('data-current-url', activeImg.src);
  }
};

window.openCurrentContractDoc = function() {
  const viewBtn = document.querySelector('button[onclick="openCurrentContractDoc()"]');
  if (viewBtn && viewBtn.getAttribute('data-current-url')) {
    window.open(viewBtn.getAttribute('data-current-url'), '_blank');
    return;
  }
  const container = document.getElementById('contract-carousel-container');
  if (container) {
    const visible = container.querySelector('.contract-slide-img[style*="display: block"]')
                 || container.querySelector('.contract-slide-img');
    if (visible && visible.src) {
      window.open(visible.src, '_blank');
      return;
    }
  }
  const anyImg = document.querySelector('.contract-slide-img');
  if (anyImg && anyImg.src) window.open(anyImg.src, '_blank');
};

window.renderReservationDetailContent = async function () {
  if (!activeResDetailId) return;
  const res = (window.RESERVATIONS || []).find(r => r.id === activeResDetailId);
  const titleEl = document.getElementById('resd-title');
  const subtitleEl = document.getElementById('resd-subtitle');
  const contentEl = document.getElementById('resd-content');
  if (!res || !titleEl || !subtitleEl || !contentEl) return;

  const isCustomerSide = !window.location.pathname.includes('admin');
  const isContractFinalized = res && (res.contractFinalizedAt || res.contract_finalized_at || res.contractUrl || (res.contractUrls && res.contractUrls.length > 0));

  if (isCustomerSide && !isContractFinalized) {
    titleEl.textContent = (res.client || 'Client') + ' — ' + (res.packageName || res.type || 'Reservation');
    subtitleEl.textContent = (res.date || '—') + ' · ' + (res.pax || '—') + ' pax';
    contentEl.innerHTML = `
      <div style="background:var(--cp-bg3, #1e1510); border:1px solid var(--cp-gold, #c49a3c); border-radius:16px; padding:32px 24px; text-align:center; max-width:650px; margin:40px auto; box-shadow:0 8px 32px rgba(0,0,0,0.25);">
        <h3 style="color:var(--gold, #c49a3c); font-size:18px; margin-bottom:12px; font-weight:700;">Contract Pending Finalization</h3>
        <p style="color:var(--cp-text-mid, #d4c5a8); font-size:14px; line-height:1.7; margin:0;">
          Details here will only be available once a contract has been made for your reservation, please wait for the admin to notify of the scheduling of your meeting either through your email or your phone number. once that is done, please go to the meetings tab to see your schedule. thank you.
        </p>
      </div>
    `;
    return;
  } else {
    contentEl.innerHTML = '';
  }

  const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const safeNum = v => typeof v === 'number' ? v : parseFloat(String(v || '0').replace(/[^0-9.-]+/g,"")) || 0;

  titleEl.textContent = (res.client || 'Client') + ' — ' + (res.packageName || res.type || 'Reservation');
  subtitleEl.textContent = (res.date || '—') + ' · ' + (res.pax || '—') + ' pax';

  const venueTitle = res.venueName || res.venue || 'Venue Location';
  const venueAddr = res.venueAddress || res.venueAddr || res.venueName || res.venue || '';

  const _pkgObj = (window.PKGS || []).find(p => p.name === res.packageName);
  let _pkgDesc = res.description || res.packageDescription || (_pkgObj ? _pkgObj.description : '') || '—';
  const _custEmail = res.customerEmail || res.email || '—';
  let _custPhone = res.phone || res.contactNumber || '—';

  if (window.supabaseClient) {
    if (_custEmail && _custEmail !== '—' && (_custPhone === '—' || !_custPhone)) {
      try {
        const { data: suData } = await window.supabaseClient.from('users').select('phone').eq('email', _custEmail).maybeSingle();
        if (suData && suData.phone) _custPhone = suData.phone;
      } catch (e) {}
    }
    if (!_pkgDesc || _pkgDesc === '—') {
      try {
        const { data: srData } = await window.supabaseClient.from('reservations').select('description').eq('id', res.id).maybeSingle();
        if (srData && srData.description) _pkgDesc = srData.description;
      } catch (e) {}
    }
  }

  let _resdPaymentData = null;
  try {
    if (window.supabaseClient) {
      const { data: _pd } = await window.supabaseClient
        .from('reservation_payments')
        .select('initial_fee_status, initial_fee_method, initial_fee_received, initial_fee_change, initial_fee_paid_at')
        .eq('reservation_id', res.id)
        .maybeSingle();
      _resdPaymentData = _pd || null;
    }
  } catch(e) {}
  const _initFeePaid = _resdPaymentData?.initial_fee_status === 'paid' || res.initialFeeStatus === 'paid' || res.paymentStatus === 'paid';

  const _pkgOrigin = res.packageOrigin || '';
  const _pkgMode = (res.pricingMode || res.pricing_mode || '').toLowerCase();
  let _pkgCatLabel = 'CUSTOM';
  if (_pkgOrigin === 'majorly set' || _pkgMode === 'majorly_set' || _pkgMode === 'tiered') _pkgCatLabel = 'MAJORLY SET';
  else if (_pkgOrigin === 'dynamically set' || _pkgMode === 'per_head' || _pkgMode === 'dynamically set') _pkgCatLabel = 'DYNAMICALLY SET';

  const _statusMap = { confirmed: 'Confirmed (Planning)', procuring: 'Procurement', preparing: 'Preparation', 'on-going': 'On-going', completed: 'Completed', cancelled: 'Cancelled' };
  const _statusLabel = _statusMap[res.status] || (res.status || '—');
  const _venueCity = res.city || res.venueLocation || '';

  const _cUrls = (res.contractUrls && res.contractUrls.length > 0) ? res.contractUrls : (res.contractUrl ? [res.contractUrl] : []);
  const _cViewLink = _cUrls.length > 0
    ? '<button onclick="openCurrentContractDoc()" class="btn-primary" style="font-size:10px; padding:4px 10px; background:var(--gold); color:#000; border:none; cursor:pointer; font-weight:700; border-radius:4px;">View' + (_cUrls.length > 1 ? ' (' + _cUrls.length + ' docs)' : '') + '</button>'
    : '';
  let _cContent = '<div style="color:var(--text-dim); font-size:13px; text-align:center;">No signed contract<br/>uploaded yet.</div>';
  if (_cUrls.length > 0) {
    const slides = _cUrls.map((url, idx) => {
      const isPdf = url.toLowerCase().includes('.pdf');
      const imgSrc = isPdf ? url.replace('/upload/','/upload/pg_1,f_jpg,w_800,c_limit/') : url;
      return `<img src="${imgSrc}" class="doc-zoom-img contract-slide-img" style="max-width:100%; max-height:300px; border-radius:4px; box-shadow:0 10px 25px rgba(0,0,0,0.5); display: ${idx === 0 ? 'block' : 'none'};" data-idx="${idx}" />`;
    }).join('');
    let controls = '<div class="doc-zoom-controls"><button class="btn-zoom" onclick="zoomDoc(this,0.2)">+</button><button class="btn-zoom" onclick="zoomDoc(this,-0.2)">-</button></div>';
    if (_cUrls.length > 1) {
      controls += `
        <div style="position:absolute; top:50%; left:5px; transform:translateY(-50%); z-index:10;">
          <button onclick="changeContractSlide(-1, ${_cUrls.length})" style="background:rgba(0,0,0,0.7); color:var(--gold); border:1px solid var(--gold); border-radius:50%; width:32px; height:32px; cursor:pointer; font-weight:bold; font-size:14px; display:flex; align-items:center; justify-content:center;">&lt;</button>
        </div>
        <div style="position:absolute; top:50%; right:5px; transform:translateY(-50%); z-index:10;">
          <button onclick="changeContractSlide(1, ${_cUrls.length})" style="background:rgba(0,0,0,0.7); color:var(--gold); border:1px solid var(--gold); border-radius:50%; width:32px; height:32px; cursor:pointer; font-weight:bold; font-size:14px; display:flex; align-items:center; justify-content:center;">&gt;</button>
        </div>
        <div style="position:absolute; bottom:5px; left:50%; transform:translateX(-50%); color:var(--gold); font-size:11px; font-weight:bold; background:rgba(0,0,0,0.7); padding:4px 10px; border-radius:12px; z-index:10; border:1px solid var(--gold);">
          <span id="contract-slide-indicator">1 / ${_cUrls.length}</span>
        </div>
      `;
    }
    _cContent = `<div id="contract-carousel-container" style="position:relative; width:100%; height:100%; display:flex; align-items:center; justify-content:center;">${slides}${controls}</div>`;
  }

  const mediaHeader = `
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:30px;">
      <div class="panel" style="margin:0; padding:0; overflow:hidden; border:1px solid var(--border); background:var(--bg3); display:flex; flex-direction:column;">
        <div class="panel-hdr" style="background:rgba(255,255,255,0.02); padding:10px 15px;">
           <div class="panel-title" style="font-size:12px;"> Signed Contract</div>
           ${_cViewLink}
        </div>
        <div class="doc-zoom-container" style="flex:1; min-height:320px; padding:15px;">
           ${_cContent}
        </div>
      </div>
      <div class="panel" style="margin:0; padding:0; overflow:hidden; border:1px solid var(--border); background:var(--bg3); display:flex; flex-direction:column;">
        <div class="panel-hdr" style="background:rgba(255,255,255,0.02); padding:10px 15px;">
           <div class="panel-title" style="font-size:12px;"> GPS Venue Location</div>
        </div>
        <div id="resd-map" style="flex:1; background:var(--bg); min-height:320px; position:relative;">
           <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; color:var(--text-dim); font-size:12px; z-index:10;">Loading Map...</div>
        </div>
        <div style="padding:15px; background:rgba(0,0,0,0.2); border-top:1px solid var(--border);">
            <div style="margin-bottom:10px;">
                <div style="font-size:11px; font-weight:700; color:var(--gold);">${esc(venueTitle)}</div>
                <div style="font-size:10px; color:var(--text-mid); line-height:1.3; margin-top:2px;">${esc(venueAddr || 'Address not specified')}</div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; padding-top:10px; border-top:1px solid rgba(255,255,255,0.05);">
                <div style="font-size:11px; color:var(--text-dim);">Est. Travel (with 10m buffer)</div>
                <div style="font-size:12px; color:var(--cream); font-weight:700;" id="resd-map-eta">Calculating...</div>
            </div>
            ${res.venueSurcharge ? `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; color:var(--red);">
                <div style="font-size:11px;">Out-of-Manila Surcharge (5%)</div>
                <div style="font-size:12px; font-weight:700;">₱${Number(res.venueSurcharge).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
            ` : ''}
        </div>
      </div>
    </div>
  `;

  const detailGrid = `
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:25px; margin-bottom:40px;">
       <div class="panel" style="margin:0; background:rgba(255,255,255,0.02);">
          <div class="panel-hdr" style="padding:12px 18px; background:rgba(255,255,255,0.03);"><div class="panel-title" style="font-size:11px; color:var(--gold);">Event Profile</div></div>
          <div style="padding:18px; display:grid; grid-template-columns:130px 1fr; gap:12px; font-size:13px;">
             <div style="color:var(--text-dim);">Package Name</div><div style="font-weight:600; color:var(--cream);">${esc(res.packageName || '—')}</div>
             <div style="color:var(--text-dim);">Package Category</div><div style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--gold); letter-spacing:1px;">${_pkgCatLabel}</div>
             <div style="color:var(--text-dim);">Package Desc.</div><div style="font-size:11px; line-height:1.4; color:var(--cream);">${esc(_pkgDesc)}</div>
             <div style="color:var(--text-dim);">Customer Email</div><div>${esc(_custEmail)}</div>
             <div style="color:var(--text-dim);">Customer Phone</div><div>${esc(_custPhone)}</div>
             <div style="color:var(--text-dim);">Event Type</div><div>${esc(res.type || '—')}</div>
             <div style="color:var(--text-dim);">Theme</div><div>${esc(res.theme || '—')}</div>
             <div style="color:var(--text-dim);">Guest Count</div><div>${esc(String(res.pax || '0'))} pax</div>
             <div style="color:var(--text-dim);">VIP Count</div><div>${esc(String(res.vipCount || '0'))} VIP</div>
          </div>
       </div>
       <div class="panel" style="margin:0; background:rgba(255,255,255,0.02);">
          <div class="panel-hdr" style="padding:12px 18px; background:rgba(255,255,255,0.03);"><div class="panel-title" style="font-size:11px; color:var(--gold);">Venue &amp; Timing</div></div>
          <div style="padding:18px; display:grid; grid-template-columns:130px 1fr; gap:12px; font-size:13px;">
             <div style="color:var(--text-dim);">Venue Name</div><div>${esc(res.venueName || res.venue || '—')}</div>
             <div style="color:var(--text-dim);">Venue City</div><div>${esc(_venueCity || '—')}</div>
             <div style="color:var(--text-dim);">Full Address</div><div style="font-size:11px; line-height:1.4;">${esc(venueAddr || '—')}</div>
             <div style="color:var(--text-dim);">Date</div><div>${esc(res.date || '—')}</div>
             <div style="color:var(--text-dim);">Time Range</div><div>${esc((() => {
               const _rt = res.time || res.timeframe || '';
               if (!_rt) return '—';
               const _sep = _rt.toLowerCase().includes(' to ') ? / to /i : (_rt.includes('-') ? /-/ : null);
               if (!_sep) return _rt;
               const _tp = _rt.split(_sep).map(p => p.trim());
               const _f = (s) => {
                 if (!s) return '';
                 if (/^\d{1,2}:\d{2}$/.test(s)) { let hh=parseInt(s),mm=s.split(':')[1]; const ap=hh>=12?'PM':'AM'; hh=hh%12||12; return hh+':'+mm+' '+ap; }
                 const mx = s.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?/i);
                 if (!mx) return s;
                 let hh=parseInt(mx[1]),mm=mx[2]||'00',ap=(mx[3]||'').toUpperCase();
                 if (!ap) ap=hh>=12?'PM':'AM'; hh=hh%12||12;
                 return hh+':'+mm+' '+ap;
               };
               return _tp.length >= 2 ? _f(_tp[0]) + ' to ' + _f(_tp[_tp.length-1]) : _rt;
             })())}</div>
          </div>
       </div>
       <div class="panel" style="margin:0; background:rgba(255,255,255,0.02);">
          <div class="panel-hdr" style="padding:12px 18px; background:rgba(255,255,255,0.03);"><div class="panel-title" style="font-size:11px; color:var(--gold);">Financial &amp; Status</div></div>
          <div style="padding:18px; display:grid; grid-template-columns:130px 1fr; gap:12px; font-size:13px; align-items:center;">
             <div style="color:var(--text-dim);">Current Stage</div><div style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--gold); letter-spacing:1px;">${_statusLabel}</div>
             <div style="color:var(--text-dim);">Total Amount</div><div style="font-weight:700; color:var(--cream);">₱${safeNum(res.amount).toLocaleString()}</div>
             
             <div style="color:var(--text-dim);">Initial Fee</div>
             <div style="display:flex; justify-content:space-between; align-items:center;">
               <span>₱${safeNum(res.paymentAmount || 5000).toLocaleString()}</span>
               <span style="font-size:10px; font-weight:700; text-transform:uppercase; color:${_initFeePaid ? 'var(--green)' : 'var(--gold)'}; background:rgba(255,255,255,0.05); padding:3px 8px; border-radius:4px;">${_initFeePaid ? 'PAID' : 'PENDING'}</span>
             </div>
             
             <div style="color:var(--text-dim);">Downpayment</div>
             <div style="display:flex; justify-content:space-between; align-items:center;">
               <span>₱${safeNum(res.downpaymentAmount).toLocaleString()}</span>
               <span style="font-size:10px; font-weight:700; text-transform:uppercase; color:${res.downpaymentStatus === 'paid' ? 'var(--green)' : 'var(--gold)'}; background:rgba(255,255,255,0.05); padding:3px 8px; border-radius:4px;">${res.downpaymentStatus === 'paid' ? 'PAID' : 'PENDING'}</span>
             </div>
             
             <div style="color:var(--text-dim);">Downpayment Due</div><div>${esc(res.downpaymentDueDate || '—')}</div>
             
             <div style="color:var(--text-dim);">Final Payment</div>
             <div style="display:flex; justify-content:space-between; align-items:center;">
               <span>₱${(safeNum(res.amount) * 0.5).toLocaleString()}</span>
               <span style="font-size:10px; font-weight:700; text-transform:uppercase; color:${res.finalPaymentStatus === 'paid' ? 'var(--green)' : 'var(--gold)'}; background:rgba(255,255,255,0.05); padding:3px 8px; border-radius:4px;">${res.finalPaymentStatus === 'paid' ? 'PAID' : 'PENDING'}</span>
             </div>
          </div>
       </div>
    </div>
  `;

  const packageContent = `
    <div style="margin-bottom:40px;">
      <div style="font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">
         <span>Included Items by Category</span>
         <span style="color:var(--gold); font-weight:700;">Package: ${esc(res.packageName || 'Package')}</span>
      </div>
      <div style="display:grid; grid-template-columns:1fr; gap:20px; align-items:start;">
         <div class="panel" style="margin:0;">
            <div class="panel-hdr" style="background:var(--bg3);"><div class="panel-title" style="font-size:11px;">Current Package Contents</div></div>
            <div id="resd-needs-list" style="padding:0 15px 15px 15px;">
               ${(() => {
                 const items = res.packageItems || [];
                 if (!items.length) return '<div style="font-size:12px;color:var(--text-dim);padding-top:15px;">No items found.</div>';
                 const grouped = {};
                 items.forEach(itemName => {
                   let catStr = 'Other';
                   if (typeof CAT !== 'undefined') {
                     const cItem = CAT.find(c => c.name === itemName);
                     if (cItem && cItem.cat) catStr = cItem.cat;
                   }
                   if (!grouped[catStr]) grouped[catStr] = [];
                   grouped[catStr].push(itemName);
                 });
                 const order = ['food', 'dessert', 'drink', 'equipment', 'entertainment', 'decoration', 'other'];
                 const sortedCats = Object.keys(grouped).sort((a, b) => {
                   const idxA = order.indexOf(a.toLowerCase());
                   const idxB = order.indexOf(b.toLowerCase());
                   if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                   if (idxA !== -1) return -1;
                   if (idxB !== -1) return 1;
                   return a.localeCompare(b);
                 });
                 return sortedCats.map(cat => {
                   let displayCat = cat;
                   if(cat.toLowerCase() === 'entertainment') displayCat = 'ADD-ONS';
                   if(cat.toLowerCase() === 'dessert') displayCat = 'DESSERTS';
                   if(cat.toLowerCase() === 'drink') displayCat = 'DRINKS';
                   if(cat.toLowerCase() === 'decoration') displayCat = 'DECORATIONS';
                   
                   return `
                     <div style="font-size:11px;font-weight:800;color:var(--gold);margin:15px 0 8px 0;text-transform:uppercase;letter-spacing:1px;">${esc(displayCat)}</div>
                     <div style="display:flex; flex-wrap:wrap; gap:8px;">
                       ${grouped[cat].map(itemName => `
                         <div style="padding:6px 14px; background:var(--bg2); border:1px solid var(--border); border-radius:20px; font-size:12px; color:var(--text); white-space:normal; line-height:1.2;">
                           ${esc(itemName)}
                         </div>
                       `).join('')}
                     </div>
                   `;
                 }).join('');
               })()}
            </div>
         </div>
      </div>
    </div>
  `;

  const meetingsSection = `
    <div style="margin-top:40px;">
       <div style="font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:15px;">Meetings Concluded History</div>
       <div id="resd-meetings-history">
          <div style="text-align:center; padding:20px; color:var(--text-dim); font-style:italic;">Loading history...</div>
       </div>
    </div>
  `;

  contentEl.innerHTML = mediaHeader + detailGrid + packageContent + meetingsSection;

  if (venueAddr && typeof initResdMap === 'function') {
    setTimeout(() => initResdMap(venueAddr), 80);
  }

  if (typeof fetchResdMeetingsHistory === 'function') {
    fetchResdMeetingsHistory(res.id);
  }
};





// Read-only lock: disable admin action buttons in the customer view
function _applyCustomerReadOnly() {
  // Selectors for buttons that should be blocked for customers
  const blockSelectors = [
    'button[onclick*="saveGuestList"]',
    'button[onclick*="addGuestRow"]',
    'button[onclick*="saveAgendaInResd"]',
    'button[onclick*="addAgendaInResd"]',
    'button[onclick*="renderResdStatusEditor"]',
    'button[onclick*="openDecorPanel"]',
    'button[onclick*="markContractFinalized"]',
    'button[onclick*="concludeDesignMeeting"]',
    'button[onclick*="requestPaymongoPayment"]',
    'button[onclick*="saveDownpaymentSchedule"]',
    'button[onclick*="initAgendaFromResd"]',
    'button[onclick*="completeReservationExecution"]',
    'button[onclick*="applyBashoutBilling"]',
    'button[onclick*="updateDoc"]',
    'button[onclick*="scheduleNextMeeting"]',
    'button[onclick*="renderResdStatus"]',
    'button[onclick*="exportDecorPO"]',
    'button[onclick*="handleDecorPO"]',
    // Generic: any btn-primary inside resd-panes that's an edit/save type
  ];
  const container = document.getElementById('dash-tab-resdetails');
  if (!container) return;

  blockSelectors.forEach(sel => {
    container.querySelectorAll(sel).forEach(btn => {
      btn.disabled = true;
      btn.style.opacity = '0.35';
      btn.style.cursor = 'not-allowed';
      btn.title = 'Read-only in customer view';
    });
  });

  // Also disable all text inputs and textareas inside panes (except the selector dropdown)
  ['resd-pane-details', 'resd-pane-extra', 'resd-pane-design', 'resd-pane-food',
    'resd-pane-staff', 'resd-pane-personnel', 'resd-pane-rundown'].forEach(paneId => {
      const pane = document.getElementById(paneId);
      if (!pane) return;
      pane.querySelectorAll('input:not([type=hidden]), textarea, select').forEach(el => {
        el.disabled = true;
        el.style.cursor = 'not-allowed';
      });
      pane.querySelectorAll('button').forEach(btn => {
        // Don't disable tab navigation buttons
        if (btn.classList.contains('tab-btn') || btn.classList.contains('chip')) return;
        btn.disabled = true;
        btn.style.opacity = '0.35';
        btn.style.cursor = 'not-allowed';
      });
    });
}
window._applyCustomerReadOnly = _applyCustomerReadOnly;





window.renderDesignTab = async function () {
  const container = document.getElementById('resd-pane-design');
  if (!container || !activeResDetailId) return;

  container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-dim);">Loading design data...</div>';

  try {
    // Pull decoration selections from Supabase reservation_decorations
    const { data: decorData, error: decorErr } = await window.supabaseClient
      .from('reservation_decorations')
      .select('*')
      .eq('reservation_id', activeResDetailId)
      .order('created_at', { ascending: false });

    if (decorErr) throw decorErr;

    // Pull design-tagged uploaded photos from both Firebase (MEETINGS array) and Supabase
    let uploadedPhotos = [];
    try {
      const seenUrls = new Set();
      const _addPic = (d) => {
        // Include design-tagged docs and legacy untagged docs; exclude 'res'-tagged docs
        if (d && d.url && (d.agenda === 'design' || d.agenda !== 'res') && !seenUrls.has(d.url)) {
          seenUrls.add(d.url);
          uploadedPhotos.push(d);
        }
      };

      // Source 1: window.MEETINGS (Firebase in-memory — always synced by syncMtDocsToSupabase)
      if (window.MEETINGS && window.MEETINGS.length > 0) {
        window.MEETINGS
          .filter(m => m.reservationId === activeResDetailId || m.reservation_id === activeResDetailId)
          .forEach(m => (m.sharedDocuments || m.shared_documents || []).forEach(_addPic));
      }

      // Source 2: Supabase — handles any docs saved by the customer side
      if (window.supabaseClient) {
        const { data: mtRows } = await window.supabaseClient
          .from('meetings')
          .select('shared_documents, id')
          .or(`reservation_id.eq.${activeResDetailId},reservationId.eq.${activeResDetailId}`);
        if (mtRows && mtRows.length > 0) {
          mtRows.forEach(row => (row.shared_documents || []).forEach(_addPic));
        }
      }
    } catch (e2) { console.warn('[renderDesignTab] Could not load meeting photos:', e2); }

    if (!decorData || decorData.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding:100px 20px; color:var(--text-dim);">No Design Assessment records found.</div>';
      return;
    }

    // Group by item_name — keep most recent entry per item
    const latestByItem = {};
    decorData.forEach(d => { if (!latestByItem[d.item_name]) latestByItem[d.item_name] = d; });

    let html = `
      <div class="panel" style="background:var(--bg3,#fff); padding:25px; border:1px solid var(--border,#eaeaea); border-radius:12px; margin-bottom:25px;">
        <h3 style="color:var(--gold,#c49a3c); font-size:14px; margin-bottom:20px; text-transform:uppercase;">Final Design Selection</h3>
        <div style="display:flex; flex-direction:column; gap:20px;">
          ${Object.values(latestByItem).map(item => `
            <div style="display:grid; grid-template-columns: 150px 1fr 2fr; gap:20px; align-items:start; padding-bottom:20px; border-bottom:1px solid var(--border,#eaeaea);">
               <div style="width:100%; aspect-ratio:1; background:var(--bg2,#fdfdfd); border-radius:8px; display:flex; align-items:center; justify-content:center; color:var(--text-dim,#888); font-size:12px; font-weight:600;">
                 ${item.selected_image_url
                   ? (item.selected_image_url.startsWith('http')
                       ? `<img src="${item.selected_image_url}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;" />`
                       : `<div style="text-align:center; padding:8px;"><div style="font-size:20px; margin-bottom:4px;">✓</div><div style="font-size:11px;">${item.selected_image_url}</div></div>`)
                   : '—'}
               </div>
               <div>
                  <div style="font-weight:700; color:var(--cream,#1a1007);">${item.item_name}</div>
               </div>
               <div style="font-size:13px; color:var(--text-mid,#666); font-style:italic;">"${item.notes || 'No specific notes.'}"</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    if (uploadedPhotos.length > 0) {
      html += `
        <div class="panel" style="background:var(--bg3,#fff); padding:25px; border:1px solid var(--border,#eaeaea); border-radius:12px;">
          <h3 style="color:var(--gold,#c49a3c); font-size:14px; margin-bottom:20px; text-transform:uppercase;">Reference Photos</h3>
          <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap:15px;">
            ${uploadedPhotos.map(file => {
              const isPDF = (file.type === 'application/pdf') || ((file.name || '').toLowerCase().endsWith('.pdf'));
              const displayUrl = isPDF ? file.url.replace('/upload/', '/upload/pg_1,f_jpg,w_400,c_limit/') : file.url;
              return `
                <div style="border:1px solid var(--border,#eaeaea); border-radius:10px; overflow:hidden; background:var(--bg,#fff);">
                  <a href="${file.url}" target="_blank">
                    <img src="${displayUrl}" style="width:100%; height:140px; object-fit:cover;" />
                  </a>
                  <div style="padding:8px; font-size:11px; color:var(--text-dim,#888); text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${file.name}</div>
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
    container.innerHTML = '<div style="color:var(--red,#c0392b); padding:20px;">Error loading design data.</div>';
  }
};



window.renderFoodTastedTab = async function () {
  const container = document.getElementById('resd-food-content');
  if (!container || !activeResDetailId) return;
  container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-dim);">Loading food tasting data...</div>';
  const _escFt = s => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  try {
    const { data, error } = await window.supabaseClient
      .from('foodtaste')
      .select('*')
      .eq('reservation_id', activeResDetailId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('[renderFoodTastedTab] Supabase error:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      container.innerHTML = '<div style="text-align:center;padding:100px 20px;color:var(--text-dim);">No Food Tasting records found for this reservation.</div>'; 
      return; 
    }

    const row = data[0];
    let dishes = [];
    if (Array.isArray(row.dishes)) {
      dishes = row.dishes;
    } else if (typeof row.dishes === 'string' && row.dishes.trim()) {
      try { dishes = JSON.parse(row.dishes); } catch(e) { dishes = []; }
    }

    container.innerHTML = `<div class="panel" style="background:var(--bg3);padding:25px;border:1px solid var(--border);border-radius:12px;">
      <h3 style="color:var(--gold);font-size:14px;margin-bottom:20px;text-transform:uppercase;">Food Tasting Results</h3>
      <table class="inv-table">
        <thead><tr><th>Dish Name</th><th>Status</th><th>Decision</th><th>Remarks / Adjustments</th></tr></thead>
        <tbody>
          ${dishes.map(item => `<tr>
            <td style="font-weight:600;color:var(--cream);">${_escFt(item.dish || '')}</td>
            <td><span style="text-transform:uppercase;color:var(--gold);font-size:11px;letter-spacing:1px;">${item.tried ? 'TRIED' : 'NOT TRIED'}</span></td>
            <td><span style="text-transform:uppercase;color:var(--gold);font-size:11px;letter-spacing:1px;">${_escFt(item.decision || '\u2014').toUpperCase()}</span></td>
            <td style="font-size:12px;color:var(--text-mid);">${_escFt(item.remarks || '\u2014')}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  } catch (e) { 
    console.error(e); 
    container.innerHTML = '<div style="color:var(--red);padding:20px;">Error loading food tasting data.</div>'; 
  }
};

window.renderStaffAllocationTab = async function () {
  const container = document.getElementById('resd-staff-content');
  if (!container || !activeResDetailId) return;
  const res = (window.RESERVATIONS || []).find(r => r.id === activeResDetailId);
  if (!res) return;
  container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-dim);">Loading staff allocation...</div>';
  try {
    const { collection, getDocs, query, where } = window.firebaseFns;
    const staffQuery = query(collection(window.firebaseDB, 'users'), where('role', '==', 'staff'));
    const staffSnap = await getDocs(staffQuery);
    const allStaff = [];
    staffSnap.forEach(d => allStaff.push({ id: d.id, ...d.data() }));
    if (!res.executionPlan || !res.executionPlan.phases) {
      container.innerHTML = '<div style="text-align:center;padding:100px 20px;color:var(--text-dim);">No staff execution plan found for this reservation yet.</div>';
      return;
    }
    const phases = res.executionPlan.phases;
    const assignedStaffIds = new Set();
    phases.forEach(p => p.tasks.forEach(t => (t.staffIds || []).forEach(id => assignedStaffIds.add(id))));
    const formatTimePart = t => { if (!t || !t.includes(':')) return t; let [h, m] = t.split(':'); const hh = parseInt(h); return `${hh % 12 || 12}:${m} ${hh >= 12 ? 'PM' : 'AM'}`; };
    const toMins = t => { let [h, m] = t.split(':'); return parseInt(h) * 60 + parseInt(m); };
    const startStr = phases[0].start, endStr = phases[phases.length - 1].end;
    let diff = toMins(endStr) - toMins(startStr); if (diff < 0) diff += 1440;
    const totalHours = diff / 60;
    container.innerHTML = `
      <div class="talent-analytics-banner" style="margin-bottom:25px;background:rgba(196,154,60,0.02);">
        <div class="t-stat-block"><div class="t-stat-lbl">Deployment Window</div><div class="t-stat-val">${formatTimePart(startStr)} - ${formatTimePart(endStr)}</div></div>
        <div class="t-stat-block"><div class="t-stat-lbl">Total Work Hours</div><div class="t-stat-val">${totalHours.toFixed(1)} Hours</div></div>
        <div class="t-stat-block"><div class="t-stat-lbl">Staff Allocated</div><div class="t-stat-val">${assignedStaffIds.size} Members</div></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:20px;">
        ${phases.map(p => `
          <div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;overflow:hidden;">
            <div style="padding:12px 18px;background:var(--bg3);border-bottom:1px solid var(--border);">
              <div style="font-weight:700;font-size:14px;color:var(--gold);">${p.name} <span style="font-size:11px;font-weight:400;color:var(--text-dim);margin-left:8px;">(${formatTimePart(p.start)} - ${formatTimePart(p.end)})</span></div>
            </div>
            <div style="padding:15px;display:flex;flex-direction:column;gap:12px;">
              ${p.tasks.map(t => `
                <div>
                  <div style="font-size:12px;font-weight:600;color:var(--cream);margin-bottom:6px;">${t.text}</div>
                  <div style="display:flex;flex-wrap:wrap;gap:6px;">
                    ${allStaff.filter(s => (t.staffIds || []).includes(s.id)).map(s => `<span style="padding:4px 12px;border-radius:15px;font-size:11px;background:var(--gold);color:#000;font-weight:700;">${s.name}</span>`).join('') || '<span style="font-size:11px;color:var(--text-dim);">No staff assigned yet</span>'}
                  </div>
                </div>`).join('')}
            </div>
          </div>`).join('')}
      </div>`;
  } catch (e) { console.error(e); container.innerHTML = '<div style="color:var(--red);padding:20px;">Error loading staff data.</div>'; }
};

window.renderPersonnelTab = function () {
  const container = document.getElementById('resd-personnel-container');
  if (!container) return;
  const res = (window.RESERVATIONS || []).find(r => r.id === activeResDetailId);
  if (!res) { container.innerHTML = '<div style="text-align:center;padding:100px 20px;color:var(--text-dim);">No reservation selected.</div>'; return; }
  const hiredData = res.hiredPersonnel || {};
  const entries = Object.entries(hiredData);
  if (entries.length === 0) { container.innerHTML = '<div style="text-align:center;padding:100px 20px;color:var(--text-dim);">No talent or personnel have been assigned to this reservation yet.</div>'; return; }
  container.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:16px;">
      ${entries.map(([roleId, p]) => `
        <div class="panel" style="margin:0;padding:20px;border-top:4px solid var(--gold);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <div style="font-size:14px;font-weight:700;color:var(--cream);">${roleId}</div>
            <span class="badge confirmed">HIRED</span>
          </div>
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:48px;height:48px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px;color:#000;">${(p.name || '?')[0]}</div>
            <div>
              <div style="font-size:13px;font-weight:700;">${p.name || '—'}</div>
              <div style="font-size:11px;color:var(--text-dim);">${p.phone || ''} ${p.email ? '· ' + p.email : ''}</div>
              ${p.rate ? `<div style="font-size:11px;color:var(--gold);margin-top:2px;">Rate: ₱${p.rate.toLocaleString()}</div>` : ''}
            </div>
          </div>
          ${p.followedUp ? '<div style="margin-top:12px;font-size:11px;color:var(--green);"> Follow-up Completed</div>' : ''}
        </div>`).join('')}
    </div>`;
};

window.renderFinalRundownTab = function () {
  const container = document.getElementById('resd-rundown-content');
  if (!container) return;
  const res = (window.RESERVATIONS || []).find(r => r.id === activeResDetailId);
  if (!res || !res.finalRundown) {
    container.innerHTML = '<div style="text-align:center;padding:100px 20px;color:var(--text-dim);"><div style="font-size:40px;margin-bottom:15px;"></div><div style="font-size:14px;font-weight:600;color:var(--cream);">No Final Rundown Generated Yet</div><div style="font-size:12px;margin-top:8px;opacity:0.6;">The admin will generate this after all meeting approvals are complete.</div></div>';
    return;
  }
  const rundown = res.finalRundown;
  container.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:30px;">
      <div style="display:flex;flex-direction:column;gap:25px;">
        <div class="panel" style="background:rgba(255,255,255,0.02);padding:25px;border:1px solid var(--border);">
          <h3 style="color:var(--gold);font-size:13px;text-transform:uppercase;margin-bottom:15px;">Venue Details</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;font-size:13px;color:var(--text-mid);">
            <div><strong>Venue:</strong> ${res.venue || '—'}</div>
            <div><strong>Type:</strong> ${rundown.venue?.type || '—'}</div>
            <div><strong>Decision:</strong> ${rundown.venue?.finalDecision || '—'}</div>
            <div><strong>Capacity:</strong> ${rundown.venue?.capacity || '—'}</div>
          </div>
        </div>
        <div class="panel" style="background:rgba(255,255,255,0.02);padding:25px;border:1px solid var(--border);">
          <h3 style="color:var(--gold);font-size:13px;text-transform:uppercase;margin-bottom:15px;">Approved Menu</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            ${(rundown.food || []).map(f => `<div style="padding:8px 12px;background:rgba(255,255,255,0.03);border-radius:6px;font-size:12px;color:var(--cream);border:1px solid rgba(255,255,255,0.05);">${f.dish} <span style="color:var(--green);font-size:10px;margin-left:8px;"></span></div>`).join('') || '<div style="color:var(--text-dim);font-size:12px);">No menu data.</div>'}
          </div>
        </div>
        <div class="panel" style="background:rgba(255,255,255,0.02);padding:25px;border:1px solid var(--border);">
          <h3 style="color:var(--gold);font-size:13px;text-transform:uppercase;margin-bottom:15px;">Talent & Personnel</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
            ${Object.entries(rundown.personnel || {}).map(([role, p]) => `<div style="padding:10px;background:rgba(255,255,255,0.03);border-radius:8px;border:1px solid var(--border);"><div style="font-size:10px;color:var(--gold);font-weight:700;">${role}</div><div style="font-size:13px;font-weight:600;color:var(--cream);">${p.name}</div></div>`).join('') || '<div style="color:var(--text-dim);font-size:12px;">No personnel assigned.</div>'}
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:25px;">
        <div class="panel" style="background:rgba(255,255,255,0.02);padding:25px;border:1px solid var(--border);">
          <h3 style="color:var(--gold);font-size:13px;text-transform:uppercase;margin-bottom:15px;">Program Rundown</h3>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${(rundown.timeline || []).map(p => `<div style="display:flex;gap:12px;font-size:12px;padding:10px;background:rgba(255,255,255,0.01);border-radius:6px;"><div style="width:85px;color:var(--gold);font-weight:700;">${p.start}</div><div style="flex:1;color:var(--cream);font-weight:600;">${p.name}</div></div>`).join('') || '<div style="color:var(--text-dim);font-size:12px;">No timeline data.</div>'}
          </div>
        </div>
        <div class="panel" style="background:rgba(255,255,255,0.02);padding:25px;border:1px solid var(--border);">
          <h3 style="color:var(--gold);font-size:13px;text-transform:uppercase;margin-bottom:15px;">Final Design Aesthetic</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;">
            ${(rundown.designs || []).map(item => `<div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;background:var(--bg2);"><img src="${item.selectedImg || ''}" style="width:100%;height:100px;object-fit:cover;" /><div style="padding:8px;font-size:10px;color:var(--text-dim);">${item.itemName || ''}</div></div>`).join('') || '<div style="color:var(--text-dim);font-size:12px;">No design selections recorded.</div>'}
          </div>
        </div>
      </div>
    </div>`;
};

// Final touch: Update switchResDetailsTab to handle all tabs
window.switchResDetailsTab = function (tabId, btn) {
  resDetailsActiveTab = tabId || 'details';

  // Hide all panes
  const panes = [
    'resd-pane-details', 'resd-pane-timeline', 'resd-pane-procurement', 'resd-pane-payment',
    'resd-pane-extra', 'resd-pane-design', 'resd-pane-venue',
    'resd-pane-food', 'resd-pane-staff', 'resd-pane-personnel',
    'resd-pane-rundown', 'resd-pane-summary'
  ];
  panes.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  // Show target pane
  const target = document.getElementById('resd-pane-' + resDetailsActiveTab);
  if (target) target.style.display = 'block';

  // Active tab button state
  document.querySelectorAll('.tab-btn, .cp-stab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  else {
    const fallbackBtn = document.getElementById('resd-tab-' + resDetailsActiveTab);
    if (fallbackBtn) fallbackBtn.classList.add('active');
  }

  // Contract finalization check for Customer side
  const isCustomerSide = !window.location.pathname.includes('admin');
  const selRes = (window.RESERVATIONS || []).find(r => r.id === activeResDetailId);
  const isContractFinalized = selRes && (selRes.contractFinalizedAt || selRes.contract_finalized_at || selRes.contractUrl || (selRes.contractUrls && selRes.contractUrls.length > 0));

  if (isCustomerSide && selRes && !isContractFinalized) {
    // Write into #resd-content only — preserves the card/pane DOM structure
    const contentEl = document.getElementById('resd-content');
    if (contentEl) {
      contentEl.innerHTML = `
        <div style="background:var(--cp-bg3, #1e1510); border:1px solid var(--cp-gold, #c49a3c); border-radius:16px; padding:32px 24px; text-align:center; max-width:650px; margin:40px auto; box-shadow:0 8px 32px rgba(0,0,0,0.25);">
          <h3 style="color:var(--gold, #c49a3c); font-size:18px; margin-bottom:12px; font-weight:700;">Contract Pending Finalization</h3>
          <p style="color:var(--cp-text-mid, #d4c5a8); font-size:14px; line-height:1.7; margin:0;">
            Details here will only be available once a contract has been made for your reservation, please wait for the admin to notify of the scheduling of your meeting either through your email or your phone number. once that is done, please go to the meetings tab to see your schedule. thank you.
          </p>
        </div>
      `;
    }
    // For all other panes (payment, timeline, etc.) also show the pending message
    if (target && resDetailsActiveTab !== 'details') {
      target.innerHTML = `
        <div style="background:var(--cp-bg3, #1e1510); border:1px solid var(--cp-gold, #c49a3c); border-radius:16px; padding:32px 24px; text-align:center; max-width:650px; margin:40px auto; box-shadow:0 8px 32px rgba(0,0,0,0.25);">
          <h3 style="color:var(--gold, #c49a3c); font-size:18px; margin-bottom:12px; font-weight:700;">Contract Pending Finalization</h3>
          <p style="color:var(--cp-text-mid, #d4c5a8); font-size:14px; line-height:1.7; margin:0;">
            Details here will only be available once a contract has been made for your reservation, please wait for the admin to notify of the scheduling of your meeting either through your email or your phone number. once that is done, please go to the meetings tab to see your schedule. thank you.
          </p>
        </div>
      `;
    }
    return;
  }

  // Contract IS finalized (or admin side) — clear any leftover pending message from #resd-content
  const _contentEl = document.getElementById('resd-content');
  if (_contentEl && _contentEl.querySelector('h3') && _contentEl.querySelector('h3').textContent.includes('Contract Pending')) {
    _contentEl.innerHTML = '';
  }
  // Also clear other panes that may have the stuck pending message
  if (target && target.querySelector && target.querySelector('h3') && target.querySelector('h3').textContent.includes('Contract Pending')) {
    target.innerHTML = '';
  }

  if (resDetailsActiveTab === 'details') renderReservationDetailContent();
  if (resDetailsActiveTab === 'timeline') renderReservationTimelineView();
  if (resDetailsActiveTab === 'procurement') renderProcurementTab();
  if (resDetailsActiveTab === 'payment') renderPaymentTab();
  if (resDetailsActiveTab === 'extra') renderExtraReservationDetails();
  if (resDetailsActiveTab === 'design') renderDesignTab();
  if (resDetailsActiveTab === 'food') renderFoodTastedTab();
  if (resDetailsActiveTab === 'staff') renderStaffAllocationTab();
  if (resDetailsActiveTab === 'personnel') renderPersonnelTab();
  if (resDetailsActiveTab === 'rundown') renderFinalRundownTab();
  if (resDetailsActiveTab === 'venue') {
    // Venue tab: re-use the map from the main detail pane logic
    if (typeof renderReservationDetailContent === 'function') {
      const res = (window.RESERVATIONS || []).find(r => r.id === activeResDetailId);
      const venueContent = document.getElementById('resd-venue-content');
      if (res && venueContent) {
        const venueAddr = res.venueAddress || res.venueAddr || res.venueName || res.venue || '';
        const venueTitle = res.venueName || res.venue || 'Venue Location';
        venueContent.innerHTML = `
          <div class="panel" style="margin:0 0 20px 0;">
            <div class="panel-hdr"><div class="panel-title" style="font-size:12px;">Venue Details</div></div>
            <div style="padding:18px; display:grid; grid-template-columns:140px 1fr; gap:12px; font-size:13px;">
              <div style="color:var(--text-dim);">Venue Name</div><div>${venueTitle}</div>
              <div style="color:var(--text-dim);">Full Address</div><div style="font-size:11px;line-height:1.5;">${venueAddr || '—'}</div>
              <div style="color:var(--text-dim);">Date</div><div>${res.date || '—'}</div>
              <div style="color:var(--text-dim);">Time</div><div>${res.time || '—'}</div>
            </div>
          </div>`;
        const mapContainer = document.getElementById('resd-venue-map-container');
        if (mapContainer && venueAddr) {
          mapContainer.style.display = 'block';
          if (typeof initResdMap === 'function') setTimeout(() => initResdMap(venueAddr), 80);
        }
      }
    }
  }
  if (resDetailsActiveTab === 'summary') {
    const _sRes = (window.RESERVATIONS || []).find(r => r.id === activeResDetailId);
    if (_sRes && typeof window.renderReservationSummary === 'function') window.renderReservationSummary(_sRes);
    else {
      const sc = document.getElementById('resd-summary-content');
      if (sc) sc.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-dim);">Summary data is being compiled — please check back once the event is completed.</div>';
    }
  }
};

window.renderPaymentTab = async function(overrideContainerId, overrideResId) {
  const container = (overrideContainerId && document.getElementById(overrideContainerId)) || document.getElementById('resd-pane-payment');
  const targetId = overrideResId || activeResDetailId;
  if (!container || !targetId) return;

  const res = (window.RESERVATIONS || []).find(r => r.id === targetId);
  if (!res) { container.innerHTML = '<div style="padding:40px; text-align:center; color:var(--text-dim);">No reservation selected.</div>'; return; }

  container.innerHTML = '<div style="padding:40px; text-align:center; color:var(--text-dim);"><i class="fas fa-circle-notch fa-spin"></i> Loading payment details...</div>';

  // Fetch payment data from new dedicated table
  let paymentData = null;
  try {
    if (window.supabaseClient) {
      const { data } = await window.supabaseClient
        .from('reservation_payments')
        .select('*')
        .eq('reservation_id', targetId)
        .maybeSingle();
      paymentData = data;
    }
  } catch(e) { /* ignore */ }
  
  // Always fetch from meetings too — needed for GCash proof URL and legacy status
  let mtData = null;
  try {
    if (window.supabaseClient) {
      const { data } = await window.supabaseClient
        .from('meetings')
        .select('initial_fee_status, initial_fee_method, initial_fee_received, initial_fee_change, initial_fee_received_by, initial_fee_paid_at')
        .eq('reservation_id', targetId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      mtData = data;
    }
  } catch(e) { /* ignore */ }

  // Merge: paymentData takes priority, but fill any gaps from mtData
  const combinedData = Object.assign({}, mtData || {}, paymentData || {});

  const safeN = (v) => parseFloat(v) || 0;
  const fmt = (n) => '\u20B1' + safeN(n).toLocaleString('en-US', { minimumFractionDigits: 2 });
  const fmtDate = (d) => { if (!d) return '—'; try { return new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }); } catch(e) { return d; } };
  const fmtDT = (d) => { if (!d) return '—'; try { return new Date(d).toLocaleString('en-US', { dateStyle:'medium', timeStyle:'short' }); } catch(e) { return d; } };

  const total = safeN(res.amount);
  const half = total > 0 ? Math.ceil(total / 2) : 0;
  const initFeeAmt = 5000;
  const dpAmt = safeN(res.downpaymentAmount || res.downpayment_amount || half);
  const finalAmt = dpAmt;
  const grandTotal = total + initFeeAmt;

  const initPaid = combinedData.initial_fee_status === 'paid' || res.initialFeeStatus === 'paid' || res.paymentStatus === 'paid';
  const dpPaid = res.downpaymentStatus === 'paid';
  const finalPaid = res.finalPaymentStatus === 'paid';

  const badge = (paid) => paid
    ? '<span style="display:inline-block; color:var(--cp-green, #2ea043); font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:1px;">PAID</span>'
    : '<span style="display:inline-block; color:var(--cp-gold, #c49a3c); font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:1px;">PENDING</span>';

  let initExtra = '';
  const feeMethod = combinedData.initial_fee_method || res.initialFeeMethod || '';

  if (initPaid && feeMethod === 'cash' && combinedData.initial_fee_received) {
    initExtra = `
      <div style="margin-top:14px; background:var(--cp-bg3, rgba(255,255,255,0.03)); border:1px dashed var(--cp-border, rgba(255,255,255,0.1)); border-radius:8px; padding:14px; font-size:12px;">
        <div style="font-weight:700; color:var(--cp-gold, #c49a3c); margin-bottom:10px; text-transform:uppercase; letter-spacing:1px; font-size:10px;">POS Transaction Receipt</div>
        <div style="display:flex; justify-content:space-between; margin-bottom:5px;"><span style="color:var(--cp-text-dim, rgba(255,255,255,0.5));">Amount Due</span><span>${fmt(initFeeAmt)}</span></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:5px;"><span style="color:var(--cp-text-dim, rgba(255,255,255,0.5));">Cash Received</span><span>${fmt(combinedData.initial_fee_received)}</span></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:5px;"><span style="color:var(--cp-text-dim, rgba(255,255,255,0.5));">Change Given</span><span>${fmt(combinedData.initial_fee_change)}</span></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:5px;"><span style="color:var(--cp-text-dim, rgba(255,255,255,0.5));">Payment Method</span><span>Cash</span></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:5px;"><span style="color:var(--cp-text-dim, rgba(255,255,255,0.5));">Received By</span><span>${combinedData.initial_fee_received_by || 'Admin'}</span></div>
        <div style="display:flex; justify-content:space-between; font-weight:700; color:var(--cp-green, #2ea043);"><span style="color:var(--cp-text-dim, rgba(255,255,255,0.5));">Received At</span><span>${fmtDT(combinedData.initial_fee_paid_at)}</span></div>
      </div>`;
  } else if (initPaid && feeMethod === 'gcash') {
    const proofUrl = (combinedData.initial_fee_received_by && combinedData.initial_fee_received_by.startsWith('http')) ? combinedData.initial_fee_received_by : null;
    const gcashReceived = parseFloat(combinedData.initial_fee_received) || 0;
    const gcashChange = parseFloat(combinedData.initial_fee_change) || 0;
    initExtra = `
      <div style="margin-top:14px; background:rgba(0,123,255,0.05); border:1px solid rgba(0,123,255,0.2); border-radius:8px; padding:14px; font-size:12px;">
        <div style="font-weight:700; color:#007bff; margin-bottom:8px; font-size:10px; text-transform:uppercase; letter-spacing:1px;"><i class="fas fa-mobile-alt" style="margin-right:6px;"></i>GCash Payment</div>
        ${proofUrl ? `<a href="${proofUrl}" target="_blank"><img src="${proofUrl}" alt="GCash Proof" style="width:100%; border-radius:8px; max-height:220px; object-fit:contain; border:1px solid var(--cp-border, rgba(255,255,255,0.1)); background:#000; margin-bottom:10px;" /></a>` : '<div style="color:var(--cp-text-dim, rgba(255,255,255,0.5)); margin-bottom:8px;">Payment confirmed via GCash.</div>'}
        <div style="display:flex; justify-content:space-between; margin-bottom:5px;"><span style="color:var(--cp-text-dim, rgba(255,255,255,0.5));">Amount Due</span><span>${fmt(initFeeAmt)}</span></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:5px;"><span style="color:var(--cp-text-dim, rgba(255,255,255,0.5));">Amount Paid</span><span>${fmt(gcashReceived || initFeeAmt)}</span></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:5px;"><span style="color:var(--cp-text-dim, rgba(255,255,255,0.5));">Change</span><span>${fmt(gcashChange)}</span></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:5px;"><span style="color:var(--cp-text-dim, rgba(255,255,255,0.5));">Payment Method</span><span>GCash</span></div>
        <div style="display:flex; justify-content:space-between; font-weight:700; color:var(--cp-green, #2ea043);"><span style="color:var(--cp-text-dim, rgba(255,255,255,0.5));">Confirmed</span><span>${fmtDT(combinedData.initial_fee_paid_at)}</span></div>
      </div>`;
  } else if (!initPaid) {
    initExtra = `<div style="margin-top:12px; font-size:12px; color:#6b5742; font-style:italic;">Initial fee has not been collected yet.</div>`;
  }

  const dpDue = res.downpaymentDueDate || res.downpaymentDue || res.downpayment_due || null;

  const cardStyle = 'background:var(--cp-card, #f9f4ec); border:1px solid var(--cp-border, rgba(180,140,60,0.2)); border-radius:14px; padding:22px; margin-bottom:18px;';
  const labelStyle = 'font-size:10px; color:#6b5742; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;';
  const amtStyle = 'font-size:26px; font-weight:800; color:#1a0e06; margin-bottom:12px;';
  const rowStyle = 'display:flex; align-items:center; justify-content:space-between;';

  container.innerHTML = `
    <div style="padding:24px 0;">
      <div style="font-size:11px; color:var(--cp-gold, #c49a3c); font-weight:700; text-transform:uppercase; letter-spacing:2px; margin-bottom:20px;">Payment Overview</div>

      <div style="${cardStyle}">
        <div style="${labelStyle}">Initial Reservation Fee</div>
        <div style="${rowStyle}">
          <div style="${amtStyle}">${fmt(initFeeAmt)}</div>
          ${badge(initPaid)}
        </div>
        <div style="font-size:12px; color:#6b5742;">Secures the event date &bull; Non-refundable</div>
        ${!initPaid ? `<div style="margin-top:12px;"><button onclick="openPaymentModal('${res.id}', 5000, 'Initial Reservation Fee')" style="font-size:12px; padding:8px 18px; background:var(--gold, #c49a3c); color:#000; border:none; border-radius:8px; font-weight:700; cursor:pointer;">Pay Online</button></div>` : ''}
        ${initExtra}
      </div>

      <div style="${cardStyle}">
        <div style="${labelStyle}">Downpayment</div>
        <div style="${rowStyle}">
          <div style="${amtStyle}">${fmt(dpAmt)}</div>
          ${badge(dpPaid)}
        </div>
        ${dpDue ? `<div style="margin-top:8px; font-size:12px; color:#6b5742;">Due by: <span style="color:#1a0e06; font-weight:600;">${fmtDate(dpDue)}</span></div>` : ''}
        ${!dpPaid ? `<div style="margin-top:10px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;"><span style="font-size:12px; color:#6b5742; font-style:italic;">Downpayment has not been collected yet.</span><button onclick="openPaymentModal('${res.id}', ${dpAmt}, 'Downpayment')" style="font-size:12px; padding:8px 18px; background:var(--gold, #c49a3c); color:#000; border:none; border-radius:8px; font-weight:700; cursor:pointer;">Pay Online</button></div>` : '<div style="margin-top:10px; font-size:12px; color:#1a7a36;">Downpayment received.</div>'}
      </div>

      <div style="${cardStyle}">
        <div style="${labelStyle}">Final Payment</div>
        <div style="${rowStyle}">
          <div style="${amtStyle}">${fmt(finalAmt)}</div>
          ${badge(finalPaid)}
        </div>
        ${!finalPaid ? '<div style="margin-top:10px; font-size:12px; color:#6b5742; font-style:italic;">Final payment has not been collected yet.</div>' : '<div style="margin-top:10px; font-size:12px; color:#1a7a36;">Final payment received.</div>'}
      </div>

      <div style="background:rgba(212,175,55,0.07); border:1px solid rgba(212,175,55,0.25); border-radius:12px; padding:16px 20px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span style="font-size:12px; color:#6b5742;">Total Contract Value</span>
          <div style="font-size:10px; color:#6b5742; margin-top:2px;">Reservation (${fmt(total)}) + Initial Fee (${fmt(initFeeAmt)})</div>
        </div>
        <span style="font-size:20px; font-weight:800; color:var(--cp-gold, #c49a3c);">${fmt(grandTotal)}</span>
      </div>
    </div>
  `;
};

// Fallback if admin.js not loaded — prevents crash in customer detail view
// Always override with the correct admin-mirrored version
window.fetchResdMeetingsHistory = async function (resId) {
  const historyEl = document.getElementById('resd-meetings-history');
  if (!historyEl) return;

  try {
    const { data: meetings, error } = await window.supabaseClient
      .from('meetings')
      .select('*')
      .or(`reservationId.eq.${resId},reservation_id.eq.${resId}`)
      .order('concluded_at', { ascending: false });

    if (error) throw error;

    const res = window.RESERVATIONS ? window.RESERVATIONS.find(r => r.id === resId) : null;
    const concludedStr = res ? String(res['mandatory-meeting concluded'] || '').toLowerCase() : '';
    const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    const validMeetings = (meetings || []).filter(mt => {
      const agendaVal = (mt.topic || mt.agenda || '').trim();
      if (!agendaVal) return false;
      const isStatusCompleted = mt.status === 'completed' || !!mt.concluded_at;
      const isAgendaConcluded = concludedStr.includes(agendaVal.toLowerCase());
      return isStatusCompleted || isAgendaConcluded;
    });

    if (validMeetings.length === 0) {
      historyEl.innerHTML = '<div style="padding:20px; text-align:center; background:rgba(255,255,255,0.02); border-radius:12px; color:var(--text-dim); font-size:13px;">No completed meetings found for this reservation.</div>';
      return;
    }

    const expandedEntries = [];
    validMeetings.forEach(mt => {
      const agendaVal = (mt.topic || mt.agenda || '').trim();
      const agendaItems = agendaVal.split(',').map(s => s.trim()).filter(Boolean);
      const isContract = agendaItems.some(a => a.toLowerCase().includes('contract'));
      agendaItems.forEach(ag => expandedEntries.push({ ...mt, _displayAgenda: ag, _isContractEntry: isContract && ag.toLowerCase().includes('contract') }));
    });

    historyEl.innerHTML = expandedEntries.map(entry => {
      let dateDisplay = 'Unknown Date';
      let timeDisplay = '';
      if (entry.concluded_at) {
        const dObj = new Date(entry.concluded_at);
        dateDisplay = dObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        timeDisplay = dObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      }
      const _showDocLink = entry._isContractEntry && (entry.contractUrl || res?.contractUrl);

      return `
        <div class="panel" style="margin-bottom:12px; background:rgba(255,255,255,0.03);">
          <div style="padding:15px 20px; display:flex; justify-content:space-between; align-items:center;">
             <div style="display:flex; align-items:center; gap:15px;">
                <div style="width:40px; height:40px; border-radius:50%; background:var(--gold); color:#000; display:flex; justify-content:center; align-items:center; font-weight:700;">MT</div>
                <div>
                   <div style="font-size:14px; font-weight:700; color:var(--cream);">${esc(entry._displayAgenda)}</div>
                   <div style="font-size:11px; color:var(--text-dim);">${esc(dateDisplay)} — ${esc(timeDisplay)}</div>
                </div>
             </div>
             ${_showDocLink ? `<a href="${entry.contractUrl || res?.contractUrl}" target="_blank" class="btn-outline" style="font-size:10px; padding:5px 12px;">View Snapshot Document</a>` : ''}
          </div>
          ${entry.notes ? `<div style="padding:0 20px 15px 75px; font-size:12px; color:var(--text-mid); line-height:1.5;"><strong>Notes:</strong> ${esc(entry.notes)}</div>` : ''}
        </div>
      `;
    }).join('');

  } catch (e) {
    console.error(e);
    historyEl.innerHTML = '<div style="color:var(--red);">Error loading meeting history.</div>';
  }
};

window.renderBookingSummary = function (data) {
  const ov = document.getElementById('res-wait-overlay');
  const md = document.getElementById('res-wait-modal');
  if (!ov || !md) return;

  document.getElementById('bs-package-name').textContent = data.packageName;
  document.getElementById('bs-res-id').textContent = '#RES-' + data.id.substring(0, 8).toUpperCase();
  document.getElementById('bs-occasion').textContent = data.type;
  document.getElementById('bs-theme').textContent = data.theme;
  document.getElementById('bs-date').textContent = data.date;
  document.getElementById('bs-time').textContent = data.time;
  document.getElementById('bs-pax').textContent = data.pax + ' Guests';
  document.getElementById('bs-vip').textContent = (data.vipCount || 0) + ' VIPs';
  document.getElementById('bs-address').textContent = data.venue;

  // Extract city from venue if possible
  const ncrCitiesMatch = ['Quezon City','Caloocan','Las Pinas','Makati','Malabon','Mandaluyong','Marikina','Muntinlupa','Navotas','Paranaque','Pasay','Pasig','San Juan','Taguig','Valenzuela','Manila'];
  const cityMatch = ncrCitiesMatch.find(c => data.venue.toLowerCase().includes(c.toLowerCase()));
  document.getElementById('bs-venue-location').textContent = cityMatch ? cityMatch : 'Metro Manila';

  // Meeting Hub (First proposed time)
  const meeting = Array.isArray(data.proposedMeetingTimes) && data.proposedMeetingTimes[0]
    ? `${data.proposedMeetingTimes[0].date} | ${data.proposedMeetingTimes[0].time}`
    : 'TBD';
  document.getElementById('bs-meeting').textContent = meeting;

  // Items List
  const list = document.getElementById('bs-items-list');
  if (list) {
    list.innerHTML = (data.packageItems || []).map(item =>
      `<span class="item-tag">${typeof item === 'string' ? item : item.name}</span>`
    ).join('');
  }

  ov.style.display = 'flex';
  setTimeout(() => {
    md.style.opacity = '1';
    md.style.transform = 'scale(1)';
  }, 50);
};

window.renderExtraReservationDetails = async function () {
  const res = (window.RESERVATIONS || []).find(r => r.id === activeResDetailId);
  if (!res) return;

  const pax = res.pax || 0;
  let guests = res.guestList || [];
  let seatingEls = res.seatingLayout || res.seatingElements || [];

  // ── Fetch live data from Supabase additional_reservation_details ──
  if (window.supabaseClient && activeResDetailId) {
    try {
      const { data: ardData } = await window.supabaseClient
        .from('additional_reservation_details')
        .select('guest_list, seating_elements')
        .eq('reservation_id', activeResDetailId)
        .maybeSingle();
      if (ardData) {
        if (Array.isArray(ardData.guest_list) && ardData.guest_list.length > 0) {
          guests = ardData.guest_list;
        }
        if (Array.isArray(ardData.seating_elements) && ardData.seating_elements.length > 0) {
          seatingEls = ardData.seating_elements;
        }
      }
    } catch (e) {
      console.warn('[renderExtraReservationDetails] Could not fetch Supabase data:', e);
    }
  }

  const listedPax = guests.filter(g => (g.name || '').trim().length > 0).length;
  const chairCount = seatingEls.filter(e => e.type === 'chair').length;
  const tableCount = seatingEls.filter(e => e.type && e.type.includes('table')).length;
  const reqTables = pax > 0 ? Math.ceil(pax / 5) : 0;
  const vipChairCount = seatingEls.filter(e => e.type === 'chair' && (() => { const p = seatingEls.find(x => x.id === e.parentId); return p && p.isVip; })()).length;
  const vipPax = parseInt(res.vipCount) || 0;

  // Container that wraps the whole guest & seating area
  const paneEl = document.getElementById('resd-pane-extra');
  if (!paneEl) return;

  // Format time helpers for agenda
  const formatTime12h = (t24) => {
    if (!t24) return '12:00 PM';
    let [h, m] = t24.split(':');
    h = parseInt(h);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  const timeRange = res.time || '08:00 AM - 05:00 PM';
  let evStart12 = '08:00 AM';
  let evEnd12 = '05:00 PM';
  if (timeRange.includes('-')) {
    const parts = timeRange.split('-');
    evStart12 = parts[0].trim();
    evEnd12 = parts[1].trim();
  }
  
  let agendaHtml = '';
  if (!res.executionPlan || !res.executionPlan.phases || !res.executionPlan.phases.find(p => p.id === 'execution')) {
    agendaHtml = `
      <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(196,154,60,0.25); border-radius:10px; padding:12px 15px; display:flex; align-items:center; gap:12px; opacity:0.7;">
        <span style="font-size:12px; color:var(--gold,#c49a3c); font-weight:700; min-width:80px;">${evStart12}</span>
        <span style="font-size:12px; color:var(--text-dim); font-style:italic;">Beginning of Event</span>
      </div>
      <div style="text-align:center; padding:20px; border:1px dashed var(--border); border-radius:12px; background:rgba(255,255,255,0.02); color:var(--text-dim); font-size:13px;">
        No Event Program Flow has been set up yet.
      </div>
      <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(196,154,60,0.25); border-radius:10px; padding:12px 15px; display:flex; align-items:center; gap:12px; opacity:0.7;">
        <span style="font-size:12px; color:var(--gold,#c49a3c); font-weight:700; min-width:80px;">${evEnd12}</span>
        <span style="font-size:12px; color:var(--text-dim); font-style:italic;">End of Event</span>
      </div>
    `;
  } else {
    const pIdx = res.executionPlan.phases.findIndex(p => p.id === 'execution');
    const p = res.executionPlan.phases[pIdx];
    const agenda = p.agenda || [];
    
    agendaHtml = `
      <div style="background:rgba(196,154,60,0.06); border:1px solid rgba(196,154,60,0.3); border-radius:10px; padding:12px 15px; display:flex; align-items:center; gap:12px;">
        <span style="font-size:13px; color:var(--gold,#c49a3c); font-weight:800; min-width:80px; letter-spacing:0.5px;">${evStart12}</span>
        <span style="font-size:13px; color:var(--cream,#1a1007); font-style:italic; font-weight:600;">Beginning of Event</span>
      </div>
      ${agenda.map(item => `
        <div style="background:var(--card,#fff); border:1px solid var(--border); border-radius:10px; padding:12px 15px; display:flex; align-items:center; justify-content:space-between;">
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="font-size:13px; color:var(--gold,#c49a3c); font-weight:800; min-width:80px; letter-spacing:0.5px;">${formatTime12h(item.time)}</span>
            <span style="font-size:13px; color:var(--cream,#1a1007); font-weight:600;">${item.text}</span>
          </div>
          <span class="badge pending" style="font-size:10px; background:rgba(0,0,0,0.04); color:var(--text-dim);">${item.type || 'Program'}</span>
        </div>
      `).join('')}
      <div style="background:rgba(196,154,60,0.06); border:1px solid rgba(196,154,60,0.3); border-radius:10px; padding:12px 15px; display:flex; align-items:center; gap:12px;">
        <span style="font-size:13px; color:var(--gold,#c49a3c); font-weight:800; min-width:80px; letter-spacing:0.5px;">${evEnd12}</span>
        <span style="font-size:13px; color:var(--cream,#1a1007); font-style:italic; font-weight:600;">End of Event</span>
      </div>
    `;
  }

  paneEl.innerHTML = `
      <!-- Event Program Flow (Execution Agenda) -->
      <div style="margin-bottom:24px; background:rgba(196,154,60,0.03); border:1px solid rgba(196,154,60,0.2); border-radius:12px; padding:20px;">
        <div style="margin-bottom:15px;">
          <div style="font-size:11px; color:var(--gold,#c49a3c); font-weight:800; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Execution Agenda</div>
          <div style="font-size:14px; font-weight:700; color:var(--cream,#1a1007);">Event Program Flow</div>
        </div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${agendaHtml}
        </div>
      </div>

      <!-- Analytics Strip -->
      <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(196,154,60,0.08); border:1px solid rgba(196,154,60,0.3); padding:14px 22px; border-radius:12px; margin-bottom:20px; flex-wrap:wrap; gap:14px;">
        <div style="display:flex; gap:28px; flex-wrap:wrap;">
          <div>
            <div style="font-size:10px; color:var(--text-dim); text-transform:uppercase; letter-spacing:1px; margin-bottom:3px;">Total Capacity</div>
            <div style="font-size:18px; font-weight:800; color:${chairCount < pax ? 'var(--red,#c0392b)' : 'var(--gold,#c49a3c)'}; font-family:'Arial';">${chairCount} / ${pax} <span style="font-size:11px; color:var(--text-dim); font-family:inherit;">Chairs</span></div>
          </div>
          <div>
            <div style="font-size:10px; color:var(--text-dim); text-transform:uppercase; letter-spacing:1px; margin-bottom:3px;">VIP Capacity</div>
            <div style="font-size:18px; font-weight:800; color:${vipChairCount < vipPax ? 'var(--red,#c0392b)' : 'var(--gold,#c49a3c)'}; font-family:'Arial';">${vipChairCount} / ${vipPax} <span style="font-size:11px; color:var(--text-dim); font-family:inherit;">Chairs</span></div>
          </div>
          <div>
            <div style="font-size:10px; color:var(--text-dim); text-transform:uppercase; letter-spacing:1px; margin-bottom:3px;">Tables Placed</div>
            <div style="font-size:18px; font-weight:800; color:${tableCount < reqTables ? 'var(--red,#c0392b)' : 'var(--gold,#c49a3c)'}; font-family:'Arial';">${tableCount} / ${reqTables} <span style="font-size:11px; color:var(--text-dim); font-family:inherit;">Tables</span></div>
          </div>
        </div>
        <div style="border-left:1px solid rgba(196,154,60,0.3); padding-left:28px;">
          <div style="font-size:10px; color:var(--text-dim); text-transform:uppercase; letter-spacing:1px; margin-bottom:3px;">Guest List Progress</div>
          <div style="font-size:18px; font-weight:700; color:var(--cream,#1a1007);">${listedPax} <span style="font-size:12px; color:var(--text-dim);">/ ${pax} Names Listed</span></div>
        </div>
      </div>

      <!-- Two-col layout: Guest List + Seating -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; align-items:start;">

        <!-- Guest List Panel -->
        <div style="border:1px solid var(--border); border-radius:14px; overflow:hidden; background:var(--card,#fff);">
          <div style="padding:14px 18px; background:rgba(61,43,26,0.85); border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between;">
            <div>
              <div style="font-size:14px; font-weight:700; color:#e8bf6a;">List of Guests</div>
              <div style="font-size:11px; color:#faf7f2; margin-top:2px;">Provided by coordinator</div>
            </div>
            <div style="font-size:12px; font-weight:700; color:var(--gold,#c49a3c);">${listedPax} / ${pax}</div>
          </div>
          <div style="padding:14px; max-height:420px; overflow-y:auto;">
            ${guests.length === 0
              ? '<div style="padding:30px; text-align:center; color:var(--text-dim); font-size:12px;">No guests listed yet.</div>'
              : `<table style="width:100%; border-collapse:collapse; font-size:12px;">
                  <thead>
                    <tr style="border-bottom:1px solid var(--border);">
                      <th style="padding:10px 12px; text-align:left; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--text-dim); opacity:0.8;">#</th>
                      <th style="padding:10px 12px; text-align:left; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--text-dim); opacity:0.8;">Name</th>
                      <th style="padding:10px 12px; text-align:left; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--text-dim); opacity:0.8;">Role</th>
                      <th style="padding:10px 12px; text-align:left; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--text-dim); opacity:0.8;">Table</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${guests.filter(g => (g.name||'').trim()).map((g, i) => `
                      <tr style="border-bottom:1px solid rgba(196,154,60,0.06);">
                        <td style="padding:10px 12px; font-size:11px; color:var(--text-dim);">${i + 1}</td>
                        <td style="padding:10px 12px; font-weight:600; color:var(--cream,#1a1007);">${g.name || '—'}</td>
                        <td style="padding:10px 12px;">
                          <span style="font-size:10px; font-weight:700; color:${g.role === 'VIP' ? 'var(--gold,#c49a3c)' : 'var(--text-dim)'}; text-transform:uppercase;">${g.role || 'Ordinary'}</span>
                        </td>
                        <td style="padding:10px 12px; font-size:11px; color:var(--text-dim);">${g.tableSeat || '—'}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>`
            }
          </div>
        </div>

        <!-- Venue Layout Panel -->
        <div style="border:1px solid var(--border); border-radius:14px; overflow:hidden; background:var(--card,#fff);">
          <div style="padding:14px 18px; background:rgba(61,43,26,0.85); border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between;">
            <div>
              <div style="font-size:14px; font-weight:700; color:#e8bf6a;">Venue Layout</div>
              <div style="font-size:11px; color:#faf7f2; margin-top:2px;">Seating plan designed by coordinator</div>
            </div>
            ${seatingEls.length > 0 ? `
            <div style="display:flex; gap:8px; align-items:center;">
              <button id="cust-zoom-out-btn" onclick="window._custSeatingZoom(-0.15)" style="background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.3); color:#fff; padding:4px 12px; border-radius:6px; cursor:pointer; font-size:12px; font-weight:700;">Zoom Out</button>
              <button id="cust-zoom-in-btn"  onclick="window._custSeatingZoom(0.15)"  style="background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.3); color:#fff; padding:4px 12px; border-radius:6px; cursor:pointer; font-size:12px; font-weight:700;">Zoom In</button>
              <button id="cust-zoom-rst-btn" onclick="window._custSeatingReset()"    style="background:rgba(196,154,60,0.25); border:1px solid rgba(196,154,60,0.6); color:#e8bf6a; padding:4px 12px; border-radius:6px; cursor:pointer; font-size:12px; font-weight:700;">Reset</button>
            </div>` : ''}
          </div>
          <div style="padding:14px;">
            ${seatingEls.length === 0
              ? '<div style="padding:30px; text-align:center; color:var(--text-dim); font-size:12px;">Seating layout has not been configured yet by the coordinator.</div>'
              : `<div style="position:relative; overflow:hidden; border:1px solid var(--border); border-radius:8px; background:#f5f0e8;">
                   <svg id="resd-seating-svg" viewBox="0 0 1200 800" style="width:100%; height:420px; display:block; cursor:grab; user-select:none;"></svg>
                 </div>
                 <div style="margin-top:8px; font-size:11px; color:var(--text-dim); text-align:center;">${tableCount} table(s) &bull; ${chairCount} chair(s) set up</div>`
            }
          </div>
        </div>
      </div>
    </div>
  `;

  if (seatingEls.length > 0) {
    const svg = document.getElementById('resd-seating-svg');
    if (svg) {
      // Build table labels (A1, A2...) matching admin logic
      const tables = seatingEls.filter(e => e.type && e.type.includes('table'));
      const tableLabels = {};
      tables.forEach((t, i) => { tableLabels[t.id] = 'A' + (i + 1); });

      const sorted = [...seatingEls].sort((a, b) => {
        if (a.type.includes('table') && b.type === 'chair') return -1;
        if (a.type === 'chair' && b.type.includes('table')) return 1;
        return 0;
      });

      let svgContent = '';
      sorted.forEach(el => {
        if (el.type.includes('table')) {
          const isVip = el.isVip;
          const fillColor = isVip ? '#f1c40f' : '#8a7a5a';
          const textColor = isVip ? '#000' : '#fff';
          const label = tableLabels[el.id] || el.label || '';

          if (el.type === 'table-round') {
            svgContent += `<circle cx="${el.x}" cy="${el.y}" r="45" fill="${fillColor}" stroke="${isVip ? '#b8950a' : '#5a4a3a'}" stroke-width="2"/>`;
          } else {
            svgContent += `<rect x="${el.x - 65}" y="${el.y - 40}" width="130" height="80" rx="6" fill="${fillColor}" stroke="${isVip ? '#b8950a' : '#5a4a3a'}" stroke-width="2"/>`;
          }
          if (label) {
            svgContent += `<text x="${el.x}" y="${el.y + 6}" text-anchor="middle" fill="${textColor}" font-weight="800" font-size="16" pointer-events="none">${label}</text>`;
          }
        } else {
          // Chair
          const isLocked = el.parentId !== null;
          const fillColor = el.guest ? '#2ecc71' : (isLocked ? '#3498db' : '#cccccc');
          svgContent += `<circle cx="${el.x}" cy="${el.y}" r="16" fill="${fillColor}" stroke="#fff" stroke-width="1.5"/>`;
          if (el.guest) {
            // First initial inside chair
            svgContent += `<text x="${el.x}" y="${el.y + 5}" text-anchor="middle" fill="#000" font-size="11" font-weight="bold" pointer-events="none">${el.guest.charAt(0).toUpperCase()}</text>`;
            // Full name below chair (truncated to 8 chars)
            const shortName = el.guest.length > 8 ? el.guest.substring(0, 7) + '…' : el.guest;
            svgContent += `<text x="${el.x}" y="${el.y + 32}" text-anchor="middle" fill="#7a5a2a" font-size="10" font-weight="600" pointer-events="none">${shortName}</text>`;
          }
        }
      });

      svg.innerHTML = svgContent;

      // ── Pan-only (no drag of elements) ──
      let isPan = false, startX = 0, startY = 0;
      let viewX = 0, viewY = 0, viewW = 1200, viewH = 800;

      svg.onmousedown = (e) => {
        isPan = true;
        startX = e.clientX; startY = e.clientY;
        svg.style.cursor = 'grabbing';
        e.preventDefault();
      };
      window.addEventListener('mousemove', (e) => {
        if (!isPan) return;
        const dx = (e.clientX - startX) * (viewW / svg.clientWidth);
        const dy = (e.clientY - startY) * (viewH / svg.clientHeight);
        viewX -= dx; viewY -= dy;
        svg.setAttribute('viewBox', `${viewX} ${viewY} ${viewW} ${viewH}`);
        startX = e.clientX; startY = e.clientY;
      });
      window.addEventListener('mouseup', () => {
        if (isPan) { isPan = false; svg.style.cursor = 'grab'; }
      });

      // ── Zoom controls ──
      window._custSeatingZoom = function(delta) {
        const factor = 1 - delta;
        const cx = viewX + viewW / 2;
        const cy = viewY + viewH / 2;
        viewW = Math.max(300, Math.min(2400, viewW * factor));
        viewH = Math.max(200, Math.min(1600, viewH * factor));
        viewX = cx - viewW / 2;
        viewY = cy - viewH / 2;
        svg.setAttribute('viewBox', `${viewX} ${viewY} ${viewW} ${viewH}`);
      };
      window._custSeatingReset = function() {
        viewX = 0; viewY = 0; viewW = 1200; viewH = 800;
        svg.setAttribute('viewBox', `${viewX} ${viewY} ${viewW} ${viewH}`);
      };
    }
  }
};

window.RECIPE_DATA = {
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

window.getIngredientsForDish = function (dishName, pax) {
  const recipe = RECIPE_DATA[dishName] || [{ name: 'Standard Ingredients (Generic)', qty20: 1, unit: 'set', cost: 500, supplier: '' }];
  const ratio = (parseInt(pax) || 20) / 20;
  return recipe.map(ing => ({ ...ing, totalQty: (ing.qty20 * ratio).toFixed(2), totalCost: (ing.cost * ratio) }));
};

// Shared Supabase fetch for all package items
async function fetchMenuItemsForPackage(res) {
  const itemNames = (res.packageItems || []).map(ri =>
    typeof ri === 'string' ? ri : (ri && ri.name ? ri.name : '')
  ).filter(Boolean);
  if (!itemNames.length) return [];
  const { data, error } = await window.supabaseClient
    .from('menu_items')
    .select('name, ingredients, identify, description, category')
    .in('name', itemNames);
  if (error) throw error;
  return data || [];
}

const _procDataCache = {};
async function fetchProcurementData(resId) {
  if (_procDataCache[resId]) return _procDataCache[resId];
  try {
    const { doc, getDoc } = window.firebaseFns;
    const snap = await getDoc(doc(window.firebaseDB, 'procurement', resId));
    const data = snap.exists() ? snap.data() : { sorted: {}, assignments: {}, poStatuses: {} };
    _procDataCache[resId] = data;
    return data;
  } catch (e) { return { sorted: {}, assignments: {}, poStatuses: {} }; }
}

window.renderProcurementTab = async function () {
  const res = (window.RESERVATIONS || []).find(r => r.id === activeResDetailId);
  if (!res) return;

  ['food', 'equipment', 'decoration', 'personnel'].forEach(cat => {
    const list = document.getElementById(`proc-${cat === 'personnel' ? 'pers' : cat}-list`);
    if (list) list.innerHTML = '<div style="font-size:12px; color:var(--text-dim); padding:20px; text-align:center;">Loading items...</div>';
  });

  const procData = await fetchProcurementData(res.id);
  const itemNames = (res.packageItems || []).map(ri => (typeof ri === 'string' ? ri : (ri && ri.name ? ri.name : '')));
  const items = itemNames.map(name => CAT.find(c => c.name === name)).filter(Boolean);
  const pax = parseInt(res.pax) || 0;

  renderProcFood(res, items, pax, procData);
  renderProcEquip(items, procData);
  renderProcDecor(res, items);
  renderProcPersonnel(items, procData);
  renderProcAnalyticsCustomer(res, items);
};

function renderProcAnalyticsCustomer(res, items) {
  const container = document.getElementById('proc-analytics-container');
  if (!container) return;

  const foodCount = (items || []).filter(i => ['food', 'dessert', 'drink'].includes(i.cat)).length;
  const equipCount = (items || []).filter(i => i.cat === 'equipment').length;
  const decorCount = (items || []).filter(i => i.cat === 'decoration').length;
  const catAddonCount = (items || []).filter(i => ['other', 'others', 'addon', 'add-on', 'entertainment'].includes((i.cat || '').toLowerCase())).length;

  container.innerHTML = `
    <div class="proc-analytics-bar" style="display:grid; gap:15px; margin-bottom:20px; grid-template-columns: repeat(5, 1fr);">
      <div class="proc-stat-box cp-card" style="border-color: var(--gold); background: rgba(196,154,60,0.08); padding:15px; text-align:center;">
        <div class="proc-stat-val" style="font-size:17px; font-weight:800; color:var(--gold);">₱${Math.round(res.amount || 0).toLocaleString()}</div>
        <div class="proc-stat-lbl" style="font-size:10px; color:var(--text-dim); text-transform:uppercase; margin-top:5px;">Reservation Total</div>
      </div>
      <div class="proc-stat-box cp-card" style="padding:15px; text-align:center;">
        <div class="proc-stat-val" id="proc-stat-food" style="font-size:17px; font-weight:800; color:var(--cream);">${foodCount}</div>
        <div class="proc-stat-lbl" style="font-size:10px; color:var(--text-dim); text-transform:uppercase; margin-top:5px;">Total Food Items</div>
      </div>
      <div class="proc-stat-box cp-card" style="padding:15px; text-align:center;">
        <div class="proc-stat-val" id="proc-stat-equip" style="font-size:17px; font-weight:800; color:var(--cream);">${equipCount}</div>
        <div class="proc-stat-lbl" style="font-size:10px; color:var(--text-dim); text-transform:uppercase; margin-top:5px;">Total Equipment</div>
      </div>
      <div class="proc-stat-box cp-card" style="padding:15px; text-align:center;">
        <div class="proc-stat-val" id="proc-stat-decor" style="font-size:17px; font-weight:800; color:var(--cream);">${decorCount}</div>
        <div class="proc-stat-lbl" style="font-size:10px; color:var(--text-dim); text-transform:uppercase; margin-top:5px;">Total Decorations</div>
      </div>
      <div class="proc-stat-box cp-card" style="padding:15px; text-align:center;">
        <div class="proc-stat-val" id="proc-stat-addon" style="font-size:17px; font-weight:800; color:var(--cream);">...</div>
        <div class="proc-stat-lbl" style="font-size:10px; color:var(--text-dim); text-transform:uppercase; margin-top:5px;">Total Add-ons</div>
      </div>
    </div>
  `;

  setTimeout(async () => {
    try {
      if (!window.supabaseClient) {
        const addonEl = document.getElementById('proc-stat-addon');
        if (addonEl) addonEl.innerText = catAddonCount;
        return;
      }
      const allItems = await fetchMenuItemsForPackage(res);
      let addonCount = 0;
      allItems.forEach(i => {
        if ((i.identify || '').toLowerCase() === 'addon') addonCount++;
      });
      if (addonCount < catAddonCount) addonCount = catAddonCount;
      const addonEl = document.getElementById('proc-stat-addon');
      if (addonEl) addonEl.innerText = addonCount;
    } catch (e) {
      const addonEl = document.getElementById('proc-stat-addon');
      if (addonEl) addonEl.innerText = catAddonCount;
    }
  }, 0);
}

function renderProcFood(res, items, pax, procData) {
  const list = document.getElementById('proc-food-list');
  if (!list) return;

  const targetCats = ['food', 'dessert', 'drink'];
  const excludedItems = ['Unlimited Drinks', 'Free Choices of Food From Menu'];
  const foodItems = items.filter(i => targetCats.includes(i.cat) && !excludedItems.includes(i.name));

  if (!foodItems.length) {
    list.innerHTML = '<div style="font-size:11px; color:var(--text-dim); font-style:italic;">No food, dessert, or drink items in package.</div>';
    return;
  }

  let html = '';
  foodItems.forEach((dish, idx) => {
    html += `
      <div class="proc-item-card" id="proc-food-card-${idx}" style="margin-bottom: 12px; padding: 12px; background: rgba(0,0,0,0.1); border: 1px solid var(--border); border-left: 3px solid var(--gold); border-radius: 6px;">
        <div style="font-size:13px; font-weight:700; color:var(--gold); margin-bottom:8px;">${escHtml(dish.name)}</div>
        <div class="proc-ing-body" style="display:flex; flex-direction:column; gap:6px;">
          <div style="font-size:11px; color:var(--text-dim); font-style:italic; padding-left:10px;">Loading ingredients...</div>
        </div>
      </div>
    `;
  });
  list.innerHTML = html;

  setTimeout(async () => {
    try {
      if (!window.supabaseClient) return;
      const names = foodItems.map(i => i.name);
      const { data: menuRows, error } = await window.supabaseClient.from('menu_items').select('name, ingredients').in('name', names);
      if (error) throw error;

      const ingMap = {};
      (menuRows || []).forEach(row => { ingMap[row.name] = row.ingredients || ''; });

      foodItems.forEach((dish, idx) => {
        const card = list.querySelector(`#proc-food-card-${idx} .proc-ing-body`);
        if (!card) return;
        const rawIngs = (ingMap[dish.name] || '').split(',').map(s => s.trim()).filter(Boolean);
        if (!rawIngs.length) {
          card.innerHTML = `<div style="font-size:11px; color:var(--text-dim); font-style:italic; padding-left:10px;">No ingredients listed.</div>`;
        } else {
          card.innerHTML = rawIngs.map(ing => `
            <div style="display:flex; align-items:center; gap:6px; padding-left:10px;">
              <span style="color:var(--gold); font-size:14px; line-height:1;">•</span>
              <div style="font-size:12px; color:var(--cream);">${escHtml(ing)}</div>
            </div>
          `).join('');
        }
      });
    } catch (e) { console.error('Failed to load food ingredients:', e); }
  }, 0);
}

function renderProcEquip(items, procData) {
  const list = document.getElementById('proc-equip-list');
  if (!list) return;
  const equipItems = items.filter(i => i.cat === 'equipment');

  const activeRes = (window.RESERVATIONS || []).find(r => r.id === activeResDetailId);
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
      <div class="proc-item-card" style="margin-bottom:12px; padding:12px; background:rgba(0,0,0,0.1); border:1px solid var(--border); border-left:3px solid var(--gold); border-radius:6px;">
        <div class="proc-item-title" style="font-size:13px; font-weight:700; color:var(--gold); margin-bottom:4px;">${escHtml(item.name)}</div>
        <div style="font-size:11px; color:var(--text-mid);">${escHtml(item.desc || 'Event asset')}</div>
        ${extra}
      </div>
    `;
  }).join('');
}

function renderProcDecor(res, catItems) {
  const list = document.getElementById('proc-decor-list');
  if (!list) return;
  list.innerHTML = '<div style="font-size:11px; color:var(--text-dim); font-style:italic;">Loading decor items...</div>';

  setTimeout(async () => {
    try {
      if (!window.supabaseClient) return;
      const allItems = await fetchMenuItemsForPackage(res);
      let decorItems = allItems.filter(i => (i.identify || '').toLowerCase() === 'decoration');
      
      if (catItems && catItems.length) {
        const foundNames = new Set(decorItems.map(d => d.name));
        const catDecor = catItems.filter(i => i.cat === 'decoration' && !foundNames.has(i.name));
        catDecor.forEach(ci => decorItems.push({ name: ci.name, description: ci.desc || '', ingredients: '' }));
      }

      if (!decorItems.length) {
        list.innerHTML = '<div style="font-size:11px; color:var(--text-dim); font-style:italic;">No decoration items in this package.</div>';
        return;
      }

      let html = '';
      decorItems.forEach(item => {
        html += `
          <div class="proc-item-card" style="margin-bottom: 12px; padding: 12px; background: rgba(0,0,0,0.1); border: 1px solid var(--border); border-left: 3px solid var(--gold); border-radius: 6px;">
            <div style="font-size:13px; font-weight:700; color:var(--gold); margin-bottom:4px;">${escHtml(item.name)}</div>
            ${item.description ? `<div style="font-size:11px; color:var(--text-mid);">${escHtml(item.description)}</div>` : ''}
          </div>
        `;
      });
      list.innerHTML = html;
    } catch (e) {
      console.error('Failed to load decor items:', e);
      list.innerHTML = '<div style="font-size:11px; color:var(--red); font-style:italic;">Error loading decor items.</div>';
    }
  }, 0);
}

function renderProcPersonnel(items, procData) {
  const list = document.getElementById('proc-pers-list');
  if (!list) return;
  const personnelItems = items.filter(i => i.cat === 'entertainment' || i.cat === 'photography');

  if (!personnelItems.length) {
    list.innerHTML = '<div style="font-size:11px; color:var(--text-dim); font-style:italic;">No personnel/fun items in package.</div>';
    return;
  }

  list.innerHTML = '<div style="font-size:11px; color:var(--text-dim); font-style:italic;"><i class="fas fa-circle-notch fa-spin"></i> Loading personnel...</div>';

  setTimeout(async () => {
    try {
      if (!window.supabaseClient) return;
      const { data: personnelRows } = await window.supabaseClient.from('personnel').select('*');
      const poolData = personnelRows || [];

      const assignments = procData.assignments || {};

      list.innerHTML = personnelItems.map(item => {
        const assignedEmail = assignments[item.id] || '';
        let assignedContact = poolData.find(c => c.email === assignedEmail);

        return `
          <div class="proc-item-card" style="margin-bottom:12px; padding:12px; background:rgba(0,0,0,0.1); border:1px solid var(--border); border-left:3px solid var(--gold); border-radius:6px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
              <div class="proc-item-title" style="margin:0; font-size:13px; font-weight:700; color:var(--gold);">${escHtml(item.name)}</div>
            </div>
            <div style="font-size:11px; color:var(--text-dim);">
              ${assignedContact 
                ? `Assigned: <span style="color:var(--cream);font-weight:700;">${escHtml(assignedContact.full_name || assignedContact.name)}</span>`
                : 'Pending assignment by admin'}
            </div>
          </div>
        `;
      }).join('');
    } catch (e) {
      console.error("ProcPersonnel error:", e);
      list.innerHTML = '<div style="font-size:11px; color:var(--red); font-style:italic;">Failed to load personnel.</div>';
    }
  }, 0);
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

let activeMilestoneId = null;

// HELPER FOR TIMELINE TASKS
const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function getTimelineTasks() {
  const res = window.RESERVATIONS ? window.RESERVATIONS.find(r => r.id === activeResDetailId) : null;
  if (!res) return [];
  // Firebase stores logisticsMilestones & timelineTasks directly on the reservation doc
  return Array.isArray(res.timelineTasks) ? res.timelineTasks : [];
}

// Helper: Normalize date
function normalizeDateKey(val) {
  if (!val) return '';
  const d = new Date(val);
  if (isNaN(d.valueOf())) return val;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getReservationPrepStartDate(res) {
  const d = new Date(res.date);
  d.setDate(d.getDate() - 10);
  return d.toISOString().split('T')[0];
}

function renderTimelineAnalytics(res, tasks) {
  const container = document.getElementById('resd-timeline-analytics');
  if (!container) return;

  if (!res) {
    container.style.display = 'none';
    return;
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const eventDateStr = normalizeDateKey(res.date) || res.date;

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

let activeLogisticsMilestoneId = null;

window.setActiveLogisticsMilestone = function(id) {
  if (activeLogisticsMilestoneId === id) {
    activeLogisticsMilestoneId = null; // Toggle off
  } else {
    activeLogisticsMilestoneId = id;
  }
  const res = window.RESERVATIONS.find(function (r) { return r.id === activeResDetailId; });
  if (res) {
    renderLogisticsMilestones(res);
  }
}

function renderLogisticsMilestones(res) {
  const el = document.getElementById('resd-timeline-milestones');
  if (!el) return;
  // Firebase stores logisticsMilestones directly on the reservation doc
  const logisticsMilestones = Array.isArray(res.logisticsMilestones) ? res.logisticsMilestones : [];
  const timelineTasks = Array.isArray(res.timelineTasks) ? res.timelineTasks : [];
  if (!logisticsMilestones.length) {
    el.innerHTML = '<div style="font-size:12px;color:var(--text-dim);padding:20px;text-align:center;background:rgba(255,255,255,0.02);border-radius:12px;">No milestones generated. Milestones will appear after contract finalization.</div>';
    return;
  }

  el.innerHTML = logisticsMilestones.map(function (m) {
    const status = m.status || 'upcoming';
    const tasks = timelineTasks.filter(t => t.milestoneId === m.id);
    const doneTasks = tasks.filter(t => t.status === 'done').length;
    const progress = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0;
    const color = m.color || 'var(--gold)';
    const isActive = m.id === activeLogisticsMilestoneId;
    const borderStyle = isActive ? `border:1px solid ${color};` : `border:1px solid var(--border);`;
    const bgStyle = isActive ? `background:rgba(255,255,255,0.05);` : `background:var(--bg3);`;

    const content = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
        <div style="overflow:hidden;flex:1;margin-right:10px;">
          <div style="font-size:13px;font-weight:700;color:var(--cream);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${esc(m.label)}">${esc(m.label)}</div>
          <div style="font-size:10px;color:var(--text-dim);margin-top:2px;">${m.startDate} - ${m.endDate}</div>
        </div>
        <span style="font-size:9px; font-weight:700; color:${color};">${esc(status.toUpperCase())}</span>
      </div>
      
      <div style="height:4px;background:rgba(255,255,255,0.05);border-radius:2px;overflow:hidden;margin-bottom:6px;">
        <div style="height:100%;width:${progress}%;background:${color};transition:width 0.3s ease;"></div>
      </div>
      <div style="font-size:9px;color:var(--text-dim);">
        ${doneTasks}/${tasks.length} Activities (${progress}%)
      </div>
    `;

    let tasksListHtml = '';
    if (isActive) {
      if (tasks.length > 0) {
        tasksListHtml = `<div style="margin-top:12px; padding-top:12px; border-top:1px dashed var(--border); display:flex; flex-direction:column; gap:8px;">
          <div style="font-size:10px; color:var(--text-dim); text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Activities</div>
          ${tasks.map(t => {
            const isDone = t.status === 'done' || t.autoCheck;
            return `
              <div style="display:flex; align-items:flex-start; gap:8px; text-align:left;">
                <div style="width:12px; height:12px; border-radius:50%; border:1px solid ${isDone ? 'var(--green)' : 'var(--text-dim)'}; background:${isDone ? 'var(--green)' : 'transparent'}; margin-top:2px; flex-shrink:0;"></div>
                <div style="flex:1;">
                  <div style="font-size:11px; color:${isDone ? 'var(--text-dim)' : 'var(--cream)'}; text-decoration:${isDone ? 'line-through' : 'none'};">${esc(t.title)}</div>
                  <div style="font-size:9px; color:var(--text-dim);">${t.date || 'No Date'}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>`;
      } else {
        tasksListHtml = `<div style="margin-top:12px; padding-top:12px; border-top:1px dashed var(--border); font-size:10px; color:var(--text-dim); text-align:center;">No activities scheduled.</div>`;
      }
    }

    return `<div onclick="setActiveLogisticsMilestone('${m.id}')" style="${borderStyle}border-left:4px solid ${color};border-radius:8px;padding:12px;cursor:pointer;min-width:240px;flex:0 0 240px;${bgStyle}transition:all 0.2s;">
      ${content}
      ${tasksListHtml}
    </div>`;
  }).join('');
}

window.changeTimelineChecklistDate = function(dir) {
  const tasks = getTimelineTasks().slice().sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const dates = [...new Set(tasks.map(t => t.date))].filter(Boolean);
  let curIdx = dates.indexOf(window._activeTimelineChecklistDate);
  if (curIdx === -1) return;
  curIdx += dir;
  if (curIdx >= 0 && curIdx < dates.length) {
    window._activeTimelineChecklistDate = dates[curIdx];
    renderLogisticsActivities();
  }
};

function renderLogisticsActivities() {
  const el = document.getElementById('resd-timeline-activities');
  if (!el) return;

  const tasks = getTimelineTasks().slice().sort((a, b) => String(a.date).localeCompare(String(b.date)));
  if (!tasks.length) {
    el.innerHTML = '<div style="font-size:12px;color:var(--text-dim);padding:20px;text-align:center;background:rgba(255,255,255,0.02);border-radius:12px;border:1px dashed var(--border);">No activities planned yet.</div>';
    return;
  }

  const dates = [...new Set(tasks.map(t => t.date))].filter(Boolean);
  if (!window._activeTimelineChecklistDate || !dates.includes(window._activeTimelineChecklistDate)) {
    const today = normalizeDateKey(new Date());
    const idx = dates.findIndex(d => d >= today);
    window._activeTimelineChecklistDate = dates[idx !== -1 ? idx : dates.length - 1];
  }

  const activeDate = window._activeTimelineChecklistDate;
  const curIdx = dates.indexOf(activeDate);
  const dayTasks = tasks.filter(t => t.date === activeDate);
  const doneCount = dayTasks.filter(t => t.status === 'done' || t.autoCheck).length;

  const dObj = new Date(activeDate + 'T00:00:00');
  const dateLabel = dObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();

  const todayKey = normalizeDateKey(new Date());
  let badgeHtml = '';
  if (activeDate === todayKey) badgeHtml = `<span style="color:#000;font-size:9px;font-weight:700;margin-left:8px;">TODAY</span>`;
  else if (activeDate < todayKey && doneCount < dayTasks.length) badgeHtml = `<span style="color:#000;font-size:9px;font-weight:700;margin-left:8px;">OVERDUE</span>`;

  let html = `
    <div class="panel" style="margin:0;"><div class="panel-body" style="padding:18px;">
      <div style="margin-bottom:15px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--border); padding-bottom:10px;">
        <button onclick="changeTimelineChecklistDate(-1)" ${curIdx <= 0 ? 'disabled style="opacity:0.3;cursor:default;"' : 'style="cursor:pointer;"'} class="btn-outline">&#8592;</button>
        <div style="text-align:center;">
          <div style="font-size:14px; font-weight:800; color:var(--cream);">${dateLabel} ${badgeHtml}</div>
          <div style="font-size:10px; color:var(--text-dim); margin-top:2px;">${doneCount}/${dayTasks.length} done</div>
        </div>
        <button onclick="changeTimelineChecklistDate(1)" ${curIdx >= dates.length - 1 ? 'disabled style="opacity:0.3;cursor:default;"' : 'style="cursor:pointer;"'} class="btn-outline">&#8594;</button>
      </div>
      <div style="display:flex; flex-direction:column; gap:8px;">
  `;

  html += dayTasks.map(t => {
    const isDone = t.status === 'done' || t.autoCheck;
    const bg = isDone ? 'rgba(45, 138, 78, 0.05)' : 'var(--bg2)';
    const bColor = isDone ? '#2d8a4e' : 'var(--border)';
    const textColor = isDone ? 'var(--text-dim)' : 'var(--cream)';
    const msLabel = t.milestoneId ? t.milestoneId.toUpperCase() : '';
    const msColor = t.color || 'var(--gold)';
    return `<div style="display:flex; align-items:center; gap:12px; padding:12px 16px; background:${bg}; border:1px solid ${bColor}; border-radius:8px; transition:all 0.2s;">
      <input type="checkbox"
        ${isDone ? 'checked' : ''} disabled
        style="cursor:default; width:18px; height:18px; accent-color:#2d8a4e; margin:0; opacity:0.7;">
      <div style="flex:1; display:flex; align-items:center; gap:10px;">
        <div style="font-size:13px; font-weight:600; color:${textColor}; ${isDone ? 'text-decoration:line-through;' : ''}">${esc(t.title || 'Activity')}</div>
        ${msLabel ? `<span style="font-size:9px; font-weight:700; color:${msColor}; border:1px solid ${msColor}; padding:1px 5px; border-radius:4px; opacity:0.8;">${msLabel}</span>` : ''}
      </div>
    </div>`;
  }).join('');

  html += `</div></div></div>`;
  el.innerHTML = html;
}

// Ensure the render function maps calendar events properly
async function renderReservationTimelineView() {
  const container = document.getElementById('resd-pane-timeline');
  if (!container) return;
  const calEl = document.getElementById('resd-timeline-calendar');
  const summary = document.getElementById('resd-timeline-summary');

  const res = (window.RESERVATIONS || []).find(r => r.id === activeResDetailId);
  if (!res) {
    if (summary) summary.textContent = 'Select a reservation to view timeline.';
    return;
  }

  const startDate = getReservationPrepStartDate(res);
  const eventDate = normalizeDateKey(res.date);
  if (summary) summary.textContent = `Coverage: ${startDate} to ${eventDate}. View daily activities and progress milestones.`;

  const tasks = getTimelineTasks();
  renderTimelineAnalytics(res, tasks);

  // Firebase stores logisticsMilestones directly on the reservation doc (no extraInfo wrapper)
  const milestones = Array.isArray(res.logisticsMilestones) ? res.logisticsMilestones : [];

  const today = new Date().toISOString().split('T')[0];
  const taskEvents = tasks.map(function (t) {
    const m = milestones.find(x => x.id === t.milestoneId);
    const mColor = m ? m.color : '#8a7a5a';

    let color = mColor;
    if (t.status === 'done') color = '#2d8a4e';
    else if (t.status === 'in-progress') color = '#d97706';
    else if (t.status !== 'done' && t.date && t.date < today) color = '#c0392b'; // Delayed: red

    return {
      id: t.id,
      title: t.title || 'Activity',
      start: t.date,
      allDay: true,
      color: color,
      textColor: '#fff',
      sortOrder: 2,
      editable: false,
      extendedProps: { status: t.status, milestoneId: t.milestoneId }
    };
  });

  const milestoneEvents = milestones.map(m => {
    let endPlusOne = m.endDate;
    try {
      const d = new Date(m.endDate + 'T00:00:00');
      d.setDate(d.getDate() + 1);
      endPlusOne = d.toISOString().split('T')[0];
    } catch (e) { }

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
      editable: false,
      className: 'milestone-event-block'
    };
  });

  const coverageEvents = [{
    title: 'EVENT DAY: ' + res.type,
    start: res.date,
    allDay: true,
    color: 'var(--gold)',
    textColor: '#000',
    sortOrder: 0,
    extendedProps: { type: 'event' }
  }];

  const allEvents = coverageEvents.concat(taskEvents).concat(milestoneEvents);

  if (window.resTimelineCalendar) {
    try {
      window.resTimelineCalendar.destroy();
    } catch (e) {}
    window.resTimelineCalendar = null;
  }

  try {
    window.resTimelineCalendar = new FullCalendar.Calendar(calEl, {
      initialView: 'dayGridMonth',
      headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,listWeek' },
      height: 520,
      editable: false, // Customer view is read-only
      events: allEvents,
      eventOrder: 'sortOrder,start',
      eventClick: function (info) {} // Read-only, no smart redirection
    });
    window.resTimelineCalendar.render();
  } catch (e) {
    console.warn('[resTimelineCalendar Safe Catch]:', e);
  }

  renderLogisticsMilestones(res);
  renderLogisticsActivities();

  const logsContainer = document.getElementById('resd-activity-logs');
  if (logsContainer) {
    // Check if there are completed tasks
    const completedTasks = tasks.filter(t => t.status === 'done' || t.autoCheck);
    if (completedTasks.length > 0) {
      logsContainer.innerHTML = completedTasks.map(t => `
        <div style="background:var(--bg); border:1px solid var(--border); border-radius:10px; padding:12px; display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div style="display:flex; gap:12px; align-items:center;">
            <div style="width:8px; height:8px; border-radius:50%; background:var(--green);"></div>
            <div>
              <div style="font-size:13px; font-weight:600; color:var(--text);">${esc(t.title)}</div>
              <div style="font-size:11px; color:var(--text-dim);">Completed on ${esc(t.date)}</div>
            </div>
          </div>
          <div style="font-size:10px; font-weight:800; color:var(--text-dim); text-transform:uppercase;">VERIFIED</div>
        </div>
      `).join('');
    } else {
      logsContainer.innerHTML = '<div style="padding:15px; text-align:center; color:var(--text-dim);">No completed activities to log yet.</div>';
    }
  }

  // Payment Timeline — paymentRecords also lives directly on the reservation doc
  const payContainer = document.getElementById('resd-payment-list');
  if (payContainer) {
    const paymentRecords = res.paymentRecords || {};
    if (Object.keys(paymentRecords).length > 0) {
      const records = Object.keys(paymentRecords).map(k => ({ key: k, record: paymentRecords[k] }));
      payContainer.innerHTML = records.map(r => {
        const st = r.record.status || 'pending';
        const cls = st === 'paid' ? 'confirmed' : (st === 'gateway_triggered' ? 'pending' : (st === 'cancelled' ? 'cancelled' : 'warning'));
        return `<div style="border:1px solid var(--border);border-radius:8px;padding:10px;margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;gap:8px;align-items:center;">
            <div style="font-size:12px;font-weight:700;color:var(--cream);text-transform:capitalize;">${r.key.replace(/_/g, ' ')}</div>
            <span class="badge ${cls}" style="font-size:10px;">${esc(st)}</span>
          </div>
        </div>`;
      }).join('');
    } else {
      payContainer.innerHTML = '<div style="font-size:12px;color:var(--text-dim);">Payment dates will auto-generate after contract finalization.</div>';
    }
  }
}

window.renderReservationTimelineView = renderReservationTimelineView;


window.renderReservationSummary = function (res) {
  const container = document.getElementById('resd-summary-content');
  if (!container) return;

  const items = Array.isArray(res.packageItems) ? res.packageItems : [];

  container.innerHTML = `
    <div class="summary-mini-card" style="margin:0; width:100%; max-width:none; border:1px solid var(--border); box-shadow:none; text-align:left;">
      <div class="summary-section-title">Reservation Summary</div>
      <div style="margin-bottom: 30px">
        <div style="font-size: 24px; font-weight: 800; color: var(--text); font-family: Arial, serif;">${res.packageName || res.type || 'Custom Event'}</div>
        <div style="font-size: 13px; color: var(--text-dim); margin-top: 4px">Status: <span class="badge ${res.status || 'pending'}" style="text-transform:uppercase; font-size:10px;">${res.status || 'Pending'}</span></div>
      </div>

      <div class="summary-grid" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));">
        <div class="info-field"><div class="info-label">Occasion</div><div class="info-value">${res.type || '—'}</div></div>
        <div class="info-field"><div class="info-label">Theme</div><div class="info-value">${res.theme || '—'}</div></div>
        <div class="info-field"><div class="info-label">Date</div><div class="info-value">${res.date || '—'}</div></div>
        <div class="info-field"><div class="info-label">Time</div><div class="info-value">${res.time || '—'}</div></div>
        <div class="info-field"><div class="info-label">Pax</div><div class="info-value">${res.pax || '0'} Guests</div></div>
        <div class="info-field"><div class="info-label">VIP</div><div class="info-value">${res.vipCount || 0} Members</div></div>
        <div class="info-field"><div class="info-label">Total Amount</div><div class="info-value" style="color:var(--gold);">₱${Number(res.amount || 0).toLocaleString()}</div></div>
      </div>

      <div class="info-label" style="margin-bottom: 8px">Venue Location</div>
      <div class="venue-box" style="display:flex; align-items:center; gap:12px;">
        <div style="font-size:18px;">ðŸ“</div>
        <div class="info-value" style="font-weight: 600; line-height: 1.4; font-size:13px;">${res.venue || 'TBD'}</div>
      </div>

      <div class="summary-section-title">Included Items</div>
      <div style="display: flex; flex-wrap: wrap; gap: 8px">
        ${items.map(item => `<span class="item-tag">${typeof item === 'string' ? item : item.name}</span>`).join('')}
        ${items.length === 0 ? '<div style="font-size:12px; color:var(--text-dim);">No items recorded.</div>' : ''}
      </div>
    </div>
  `;
};

// ==========================================
// UI SCALE CONTROL
// ==========================================
let currentUIScale = parseFloat(localStorage.getItem('halden_ui_scale')) || 1.0;

function applyUIScale() {
  document.body.style.zoom = currentUIScale;
  const label = document.getElementById('ui-scale-label');
  if (label) {
    label.textContent = Math.round(currentUIScale * 100) + '%';
  }
}

window.changeUIScale = function (delta) {
  currentUIScale += delta;
  if (currentUIScale < 0.5) currentUIScale = 0.5;
  if (currentUIScale > 2.0) currentUIScale = 2.0;
  localStorage.setItem('halden_ui_scale', currentUIScale);
  applyUIScale();
};

document.addEventListener('DOMContentLoaded', () => {
  applyUIScale();
  
  // Initialize auto-open dash checkbox
  const chk = document.getElementById('auto-open-dash-chk');
  if (chk) {
    chk.checked = (localStorage.getItem('halden_auto_open_dash') === 'true');
  }
});

// ===== AUTO-OPEN DASHBOARD SETTING =====
function toggleAutoOpenDash(checked) {
  if (checked) {
    localStorage.setItem('halden_auto_open_dash', 'true');
  } else {
    localStorage.setItem('halden_auto_open_dash', 'false');
  }
}
window.toggleAutoOpenDash = toggleAutoOpenDash;

// ===== MODIFY CANCELLED RESERVATION =====
window.modifyCancelledReservation = function(resStr) {
  try {
    const res = JSON.parse(resStr);
    sessionStorage.setItem('halden_modify_res', JSON.stringify(res));
    window.location.href = 'index.html';
  } catch(e) {
    console.error('modifyCancelledReservation parse error:', e);
  }
};

function applyModifyResData(res) {
  console.log('[ModifyRes] START — res.packageName:', res.packageName, '| activePkgId:', res.activePkgId, '| packageItems count:', (res.packageItems || []).length);

  // ═══════════════════════════════════════════════════════════
  // PHASE 1: Lock down auto-allocation IMMEDIATELY.
  // This flag must stay true until we're 100% done restoring.
  // ═══════════════════════════════════════════════════════════
  window._blockAutoAlloc = true;
  activePkg = null;
  customPkgItems = [];

  // ═══════════════════════════════════════════════════════════
  // PHASE 2: Populate customPkgItems from the saved reservation.
  // We do this BEFORE touching any form fields so that any
  // accidental renders triggered by field-change events already
  // have the correct items in memory.
  // ═══════════════════════════════════════════════════════════
  let isPremade = false;
  let matchedPkg = null;

  if (typeof PKGS !== 'undefined' && PKGS.length > 0) {
    // Try 1: exact activePkgId match
    if (res.activePkgId && res.activePkgId !== 'null' && res.activePkgId !== 'undefined') {
      matchedPkg = PKGS.find(p => p.id === res.activePkgId);
    }
    // Try 2: packageName match (strip the forced " Package" suffix from cart names)
    if (!matchedPkg && res.packageName) {
      const stripped = res.packageName.replace(/\s*package\s*$/i, '').trim();
      matchedPkg = PKGS.find(p =>
        p.name.toLowerCase() === res.packageName.toLowerCase() ||
        p.name.toLowerCase() === stripped.toLowerCase()
      );
    }
    console.log('[ModifyRes] PKGS count:', PKGS.length, '| matchedPkg:', matchedPkg?.name || 'none');
  }

  if (matchedPkg) {
    // ── Premade package: load items directly from PKGS entry ──
    isPremade = true;
    activePkg = matchedPkg;
    window.activeTier = res.selectedTier || null;

    const freeIds = new Set(matchedPkg.freeItemIds || []);
    const freebieIds = new Set(matchedPkg.freebieItemIds || []);

    (matchedPkg.itemIds || []).forEach(iid => {
      const item = typeof CAT !== 'undefined' ? CAT.find(i => i.id === iid) : null;
      if (item) {
        const newItem = { ...item };
        if (freeIds.has(iid) || freebieIds.has(iid)) {
          newItem.isFree = true;
        } else if (item.name.toLowerCase().includes('rice') || (item.cat === 'dessert' && item.price < 1500)) {
          newItem.isFree = true;
        }
        customPkgItems.push(newItem);
      }
    });
    (matchedPkg.freebieItemIds || []).forEach(iid => {
      if (customPkgItems.find(c => c.id === iid)) return;
      const item = typeof CAT !== 'undefined' ? CAT.find(i => i.id === iid) : null;
      if (item) customPkgItems.push({ ...item, isFree: true, isFreebie: true });
    });

    console.log('[ModifyRes] Premade restore — items loaded:', customPkgItems.length);
  } else {
    // ── Custom package: restore items from saved packageItems list ──
    const saved = res.packageItems || res.items || [];
    console.log('[ModifyRes] saved packageItems:', saved.length, '| first 5:', saved.slice(0,5));
    if (Array.isArray(saved) && saved.length > 0) {
      saved.forEach(entry => {
        const name = typeof entry === 'object' ? (entry.name || '') : String(entry);
        if (!name) return;
        const catItem = typeof CAT !== 'undefined'
          ? CAT.find(c => c.name.toLowerCase() === name.toLowerCase())
          : null;
        if (catItem) {
          customPkgItems.push({ ...catItem });
        } else {
          console.warn('[ModifyRes] No CAT match for:', name);
          customPkgItems.push({
            id: 'restored_' + name.replace(/\s+/g, '_'),
            name,
            price: typeof entry === 'object' ? (entry.price || 0) : 0,
            cat: typeof entry === 'object' ? (entry.cat || 'food') : 'food',
            isFree: false
          });
        }
      });
    }
    console.log('[ModifyRes] Custom restore — items loaded:', customPkgItems.length, 'from', saved.length, 'saved entries');
  }

  // ═══════════════════════════════════════════════════════════
  // PHASE 3: Fill all form fields.
  // Items are already in customPkgItems so any accidental
  // renders triggered here will show correct data.
  // ═══════════════════════════════════════════════════════════
  const sa = window.smartAssign;
  const setV = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };

  if (sa) {
    sa('cpkg-desc',     res.description || '');
    sa('cpkg-occasion', res.type        || '');
    sa('cpkg-theme',    res.theme       || '');
    sa('cpkg-venue',    res.venue       || '');
  } else {
    setV('cpkg-desc',     res.description || '');
    setV('cpkg-occasion', res.type        || '');
    setV('cpkg-theme',    res.theme       || '');
    setV('cpkg-venue',    res.venue       || '');
  }

  // Robust time restore
  if (res.time && res.time !== 'TBD') {
    const parseTimeTo24H = (str) => {
      if (!str) return '';
      if (/^\d{2}:\d{2}$/.test(str.trim())) return str.trim();
      const match = str.trim().match(/(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?/i);
      if (!match) return '';
      let h = parseInt(match[1], 10);
      let m = match[2] || '00';
      let ap = (match[3] || '').toUpperCase();
      if (ap === 'PM' && h < 12) h += 12;
      if (ap === 'AM' && h === 12) h = 0;
      return h.toString().padStart(2, '0') + ':' + m;
    };

    const _mSep = res.time.toLowerCase().includes(' to ') ? / to /i : /-/;
    const parts = res.time.split(_mSep).map(s => s.trim());
    const sEl = document.getElementById('cpkg-timeframe-start');
    const eEl = document.getElementById('cpkg-timeframe-end');
    if (sEl && parts[0]) sEl.value = parseTimeTo24H(parts[0]);
    if (eEl && parts[1]) eEl.value = parseTimeTo24H(parts[1]);
  }
  // City is always a <select> — handle explicitly regardless of smartAssign
  const citySelectEl = document.getElementById('cpkg-venue-location');
  if (citySelectEl && res.venueLocation) {
    citySelectEl.value = res.venueLocation;
    // Don't dispatch change event here — field is disabled and read-only
    console.log('[ModifyRes] venueLocation set to:', citySelectEl.value, '(res.venueLocation was:', res.venueLocation, ')');
  }

  if (isPremade && matchedPkg) {
    // Lock the workspace title to the premade package name
    const titleEl = document.querySelector('.cpkg-title');
    if (titleEl) titleEl.textContent = matchedPkg.name;
    // Set pricingMode fields
    const paxEl = document.getElementById('cpkg-pax');
    if (paxEl) {
      if (matchedPkg.pricingMode === 'majorly_set' && matchedPkg.fixedPax) {
        paxEl.value = matchedPkg.fixedPax;
        paxEl.readOnly = true;
      } else if (res.pax) {
        paxEl.value = res.pax;
        paxEl.readOnly = false;
      }
    }
  } else {
    const paxEl = document.getElementById('cpkg-pax');
    if (paxEl && res.pax) paxEl.value = res.pax;
  }

  // Date
  const dateEl = document.getElementById('cpkg-date');
  if (dateEl && res.date) {
    const parsed = new Date(res.date);
    if (!isNaN(parsed.getTime())) dateEl.value = parsed.toISOString().split('T')[0];
  }

  // VIP
  const vipCheck = document.getElementById('cpkg-vip-check');
  if (vipCheck) {
    vipCheck.checked = res.isVIP || false;
    if (typeof toggleVIPFields === 'function') toggleVIPFields();
  }
  const vipCountEl = document.getElementById('cpkg-vip-count');
  if (vipCountEl && res.vipCount) vipCountEl.value = res.vipCount;
  const vipServiceEl = document.getElementById('cpkg-vip-service');
  if (vipServiceEl && res.vipService) vipServiceEl.value = res.vipService;

  // Map coords
  if (res.coords) window.lastMapCoords = res.coords;

  // Meeting times
  if (Array.isArray(res.proposedMeetingTimes) && res.proposedMeetingTimes.length > 0) {
    preferredMeetingTimes = res.proposedMeetingTimes.map(mt => {
      if (typeof mt === 'object' && mt.date) return mt;
      return { date: String(mt), start: '', end: '' };
    });
    if (typeof renderMeetingTimes === 'function') renderMeetingTimes();
  }

  // ═══════════════════════════════════════════════════════════
  // PHASE 4: Render the workspace.
  // _blockAutoAlloc is still true so auto-allocation is skipped.
  // ═══════════════════════════════════════════════════════════
  if (typeof renderCat === 'function') renderCat();
  if (typeof renderCustomPkg === 'function') renderCustomPkg();
  if (typeof updateCatTotals === 'function') updateCatTotals();
  if (typeof updateDawContextBar === 'function') updateDawContextBar();

  // ═══════════════════════════════════════════════════════════
  // PHASE 5: Keep the block alive for 3 seconds to catch any
  // late-firing event-driven re-renders, then release.
  // ═══════════════════════════════════════════════════════════
  setTimeout(() => {
    window._blockAutoAlloc = false;
    console.log('[ModifyRes] DONE — block released. Final item count:', customPkgItems.length);
    // Scroll to workspace
    const panel = document.getElementById('cpkg-panel');
    if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else {
      const sec = document.getElementById('catalog');
      if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 3000);
}



document.addEventListener('DOMContentLoaded', () => {
  const modStr = sessionStorage.getItem('halden_modify_res');
  if (modStr && !window.CUSTOMER_PAGE) {
    try {
      const res = JSON.parse(modStr);
      sessionStorage.removeItem('halden_modify_res');
      // Store for pickup by loadMenuItemsFromSupabase after CAT is fully built
      window._pendingModifyRes = res;
    } catch(e) {
      console.error('halden_modify_res restore error:', e);
    }
  }
});

// ===== CUSTOMER CATALOG LOADER =====
window.customerCatalogItems = [];
async function loadCustomerCatalogFromSupabase() {
  if (!window.CUSTOMER_PAGE) return;
  const sb = window.supabaseClient || window.supabase;
  if (!sb) return;

  try {
    const { data: menuRows } = await sb.from('menu_items')
      .select('id, name, category, identify, description, price_per_pax, is_available')
      .eq('is_available', true);

    const { data: equipRows } = await sb.from('equipment_inventory')
      .select('id, name, category, type, price, description, status, pricing_type, allocation_type')
      .neq('status', 'disposed');

    let items = [];
    if (menuRows && menuRows.length > 0) {
      items = items.concat(menuRows.map(row => {
        let cat = 'food';
        if (row.identify === 'desserts') cat = 'dessert';
        else if (row.identify === 'drinks' || row.identify === 'drinks_package') cat = 'drink';
        else if (row.identify === 'decoration') cat = 'decoration';
        else if (row.identify === 'addon') cat = 'entertainment';

        return {
          id: `sb-${row.id}`,
          name: row.name,
          cat: cat,
          desc: row.description || '',
          price: parseFloat(row.price_per_pax) || 0,
        };
      }));
    }

    if (equipRows && equipRows.length > 0) {
      items = items.concat(equipRows.map(row => ({
        id: `sb-${row.id}`,
        name: row.name,
        cat: 'equipment',
        desc: row.description || '',
        price: parseFloat(row.price) || 0,
        pricingType: row.pricing_type || 'fixed',
        allocationType: row.allocation_type || 'fixed',
      })));
    }
    
    window.customerCatalogItems = items;
    console.log('[Customer Catalog] Loaded', items.length, 'items from Supabase.');
    
    // If the modal was already open before this loaded, re-render it
    if (activeCustomerMeeting && activeCustomerMeeting.liveDraft) {
      renderCustomerLiveDraft(activeCustomerMeeting.liveDraft);
    }
  } catch (e) {
    console.error('Failed to load customer catalog:', e);
  }
}

document.addEventListener('DOMContentLoaded', loadCustomerCatalogFromSupabase);
// If it's already loaded but script runs late:
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  loadCustomerCatalogFromSupabase();
}

window.cMtCatalogCat = 'all';
window.cMtCatalogSearch = '';
window.updateCustomerCatalogFilter = function(type, val) {
  if (type === 'search') window.cMtCatalogSearch = val;
  if (type === 'cat') window.cMtCatalogCat = val;
  if (activeCustomerMeeting && activeCustomerMeeting.liveDraft) {
    renderCustomerLiveDraft(activeCustomerMeeting.liveDraft);
  }
}

// ── LiveKit Video Call (Customer Side) ──────────────────────────────────
const LIVEKIT_URL = 'wss://hal-serve-ggy4y9lw.livekit.cloud';
const LIVEKIT_API_KEY = 'APIQPB6TR76wNB2';
const LIVEKIT_API_SECRET_DEV = 'EkD8U39LMVcOnfHm4V6ChfkzHeFoW4faXZr9NPTQGT1D';

let _lkRoom = null;
let _lkMicEnabled = true;
let _lkCamEnabled = true;
let _lkScreenShare = false;

async function getLiveKitToken(roomName, identity) {
  try {
    const resp = await fetch(`/api/livekit-token?room=${encodeURIComponent(roomName)}&identity=${encodeURIComponent(identity)}`);
    if (resp.ok) {
      const { token } = await resp.json();
      if (token) return token;
    }
  } catch (e) {}

  if (!LIVEKIT_API_SECRET_DEV) {
    throw new Error('No Vercel token endpoint found and LIVEKIT_API_SECRET_DEV is not set in app.js.');
  }
  return _generateLkTokenLocally(LIVEKIT_API_KEY, LIVEKIT_API_SECRET_DEV, roomName, identity);
}

async function _generateLkTokenLocally(apiKey, apiSecret, room, identity) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    iss: apiKey, sub: identity, identity, nbf: now, exp: now + 7200,
    video: { roomJoin: true, room, canPublish: true, canSubscribe: true, canPublishData: true },
  };
  const b64url = obj => btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const sigInput = `${b64url(header)}.${b64url(payload)}`;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(apiSecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(sigInput));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${sigInput}.${sigB64}`;
}

window.enterCustomerVideo = function () {
  if (!activeCustomerMeeting || !activeCustomerMeeting.roomId) return;
  const overlay = document.getElementById('vcall-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  overlay.classList.remove('vcall-minimized');

  if (window.LivekitClient) {
    _lkConnect();
  } else {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/livekit-client/dist/livekit-client.umd.min.js';
    s.onload = _lkConnect;
    s.onerror = () => alert('Failed to load LiveKit SDK');
    document.head.appendChild(s);
  }
};

async function _lkConnect() {
  if (_lkRoom) {
    try { await _lkRoom.disconnect(); } catch (e) { }
    _lkRoom = null;
  }
  _lkMicEnabled = true; _lkCamEnabled = true; _lkScreenShare = false;
  
  const grid = document.getElementById('vcall-video-grid');
  if (grid) grid.innerHTML = '<div id="vcall-empty-msg" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;color:#4a6070;"><p style="font-size:11px;letter-spacing:1px;">Connecting...</p></div>';

  try {
    const roomName = activeCustomerMeeting.roomId;
    const actualName = (window.currentUser && (window.currentUser.displayName || window.currentUser.name))
      || (window.__sbUser && window.__sbUser.displayName)
      || 'Customer';
    const identity = 'customer_' + (actualName.trim().replace(/\s+/g, '_') || 'Customer') + '_' + (Date.now() % 1000);
    const token = await getLiveKitToken(roomName, identity);

    _lkRoom = new window.LivekitClient.Room({ adaptiveStream: true, dynacast: true });
    _lkSetupEvents(_lkRoom);
    await _lkRoom.connect(LIVEKIT_URL, token);
    await _lkRoom.localParticipant.enableCameraAndMicrophone();

    _lkRenderAll();
    _lkUpdateCount();

    ['mic','cam','screen'].forEach(type => {
      const b = document.getElementById(`vcall-btn-${type}`);
      if (b) { b.style.borderColor = '#1e2a35'; b.style.color = '#e8edf2'; }
    });
  } catch (err) {
    console.error('LiveKit connect error:', err);
    alert('Video call error: ' + (err.message || err));
  }
}

function _lkSetupEvents(room) {
  const LK = window.LivekitClient;
  room.on(LK.RoomEvent.ParticipantConnected, (p) => { _lkRenderParticipant(p); _lkUpdateCount(); });
  room.on(LK.RoomEvent.ParticipantDisconnected, (p) => {
    document.getElementById('lk-tile-' + p.sid)?.remove();
    _lkUpdateCount(); _lkUpdateGrid();
  });
  room.on(LK.RoomEvent.TrackSubscribed, (track, pub, p) => _lkAttachTrack(track, p));
  room.on(LK.RoomEvent.TrackUnsubscribed, (track, pub, p) => {
    track.detach().forEach(el => el.remove());
    _lkEnsureAvatar(document.getElementById('lk-tile-' + p.sid), p);
  });
  // Handle local camera becoming ready
  room.on(LK.RoomEvent.LocalTrackPublished, () => _lkRefreshLocalTile());
  room.on(LK.RoomEvent.LocalTrackUnpublished, () => _lkRefreshLocalTile());
  room.on(LK.RoomEvent.TrackMuted, (pub, p) => {
    if (pub.source === LK.Track.Source.Microphone) {
      const mt = document.getElementById('lk-muted-' + p.sid);
      if (mt) mt.style.display = 'flex';
    } else if (pub.source === LK.Track.Source.Camera) {
      _lkEnsureAvatar(document.getElementById('lk-tile-' + p.sid), p);
    }
  });
  room.on(LK.RoomEvent.TrackUnmuted, (pub, p) => {
    if (pub.source === LK.Track.Source.Microphone) {
      const mt = document.getElementById('lk-muted-' + p.sid);
      if (mt) mt.style.display = 'none';
    } else if (pub.source === LK.Track.Source.Camera) {
      const tile = document.getElementById('lk-tile-' + p.sid);
      if (tile) { tile.querySelector('.lk-avatar')?.remove(); }
    }
  });
  room.on(LK.RoomEvent.LocalTrackUnpublished, (pub) => {
    if (pub.source === LK.Track.Source.ScreenShare) {
      _lkScreenShare = false;
      const b = document.getElementById('vcall-btn-screen');
      if (b) { b.style.color = '#e8edf2'; b.style.background = '#161d25'; }
    }
  });
}

function _lkRenderAll() {
  document.getElementById('vcall-video-grid').innerHTML = '';
  _lkRenderLocal();
  for (const [, p] of _lkRoom.remoteParticipants) _lkRenderParticipant(p);
  _lkUpdateGrid();
}

function _lkRenderLocal() {
  const p = _lkRoom.localParticipant;
  const tile = _lkCreateTile(p.sid, (p.identity || 'Customer') + ' (you)');
  document.getElementById('vcall-video-grid').appendChild(tile);
  const LK = window.LivekitClient;
  const camPub = p.getTrackPublication(LK.Track.Source.Camera);
  if (camPub && camPub.track) {
    const v = camPub.track.attach();
    v.muted = true;
    v.style.cssText = 'width:100%;height:100%;object-fit:cover;position:absolute;inset:0;';
    tile.querySelector('.lk-avatar') && (tile.querySelector('.lk-avatar').style.display = 'none');
    tile.insertBefore(v, tile.querySelector('.lk-overlay'));
  }
  document.getElementById('vcall-empty-msg')?.remove();
}

function _lkRefreshLocalTile() {
  if (!_lkRoom) return;
  const LK = window.LivekitClient;
  const p = _lkRoom.localParticipant;
  const tile = document.getElementById('lk-tile-' + p.sid);
  if (!tile) return;
  tile.querySelector('video')?.remove();
  const camPub = p.getTrackPublication(LK.Track.Source.Camera);
  const screenPub = p.getTrackPublication(LK.Track.Source.ScreenShare);
  const active = screenPub || camPub;
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

function _lkCreateTile(sid, rawName) {
  const tile = document.createElement('div');
  tile.id = 'lk-tile-' + sid;
  tile.className = 'vcall-video-box';
  
  let dName = rawName || '?';
  const isYou = dName.includes('(you)');
  if (isYou) dName = dName.replace(' (you)', '');
  if (dName.startsWith('customer_')) dName = dName.substring(9).replace(/_\d+$/, '').replace(/_/g, ' ');
  if (dName.startsWith('admin_')) dName = dName.substring(6).replace(/_\d+$/, '').replace(/_/g, ' ');
  if (isYou) dName += ' (you)';

  const init = dName.charAt(0).toUpperCase();
  tile.innerHTML = `
    <div class="lk-avatar vid-avatar">
      <div style="width:100%;height:100%;border-radius:50%;background:linear-gradient(135deg,#7b61ff,#00e5ff);display:flex;align-items:center;justify-content:center;color:#fff;">${init}</div>
    </div>
    <div class="lk-overlay" style="position:absolute;bottom:0;left:0;right:0;padding:6px 10px;background:linear-gradient(transparent,rgba(0,0,0,0.7));display:flex;align-items:center;justify-content:space-between;z-index:2;">
      <div style="font-size:11px;font-weight:600;color:#fff;">${dName}</div>
      <div id="lk-muted-${sid}" style="width:20px;height:20px;background:#ff3b5c;border-radius:50%;display:none;align-items:center;justify-content:center;">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/></svg>
      </div>
    </div>`;
  return tile;
}

function _lkAttachTrack(track, p) {
  const tile = document.getElementById('lk-tile-' + p.sid);
  if (!tile) return;
  const el = track.attach();
  if (track.kind === 'video') {
    el.style.cssText = 'width:100%;height:100%;object-fit:cover;position:absolute;inset:0;';
    tile.querySelector('.lk-avatar')?.remove();
    tile.insertBefore(el, tile.querySelector('.lk-overlay'));
  } else {
    tile.appendChild(el);
  }
}

function _lkEnsureAvatar(tile, p) {
  if (tile.querySelector('.lk-avatar')) return;
  const name = p.identity || '?';
  const init = name.charAt(0).toUpperCase();
  const av = document.createElement('div');
  av.className = 'lk-avatar vid-avatar';
  av.innerHTML = `<div style="width:100%;height:100%;border-radius:50%;background:linear-gradient(135deg,#7b61ff,#00e5ff);display:flex;align-items:center;justify-content:center;color:#fff;">${init}</div>`;
  tile.insertBefore(av, tile.querySelector('.lk-overlay'));
}

function _lkUpdateGrid() {
  const grid = document.getElementById('vcall-video-grid');
  if (!grid) return;
  const count = grid.children.length;
  if (count <= 1) grid.style.gridTemplateColumns = '1fr';
  else if (count <= 2) grid.style.gridTemplateColumns = '1fr 1fr';
  else if (count <= 4) grid.style.gridTemplateColumns = '1fr 1fr';
  else grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
}

function _lkUpdateCount() {
  const pc = document.getElementById('vcall-participant-count');
  const remoteCount = _lkRoom?.remoteParticipants?.size || 0;
  if (pc && _lkRoom) pc.textContent = `(${remoteCount + 1} participant${remoteCount === 0 ? '' : 's'})`;
}

window.vcallToggleMic = async function () {
  if (!_lkRoom) return;
  _lkMicEnabled = !_lkMicEnabled;
  await _lkRoom.localParticipant.setMicrophoneEnabled(_lkMicEnabled);
  const btn = document.getElementById('vcall-btn-mic');
  if (btn) {
    btn.style.color = _lkMicEnabled ? '#e8edf2' : '#ff3b5c';
    btn.style.borderColor = _lkMicEnabled ? '#1e2a35' : '#ff3b5c';
    btn.textContent = _lkMicEnabled ? 'Mic On' : 'Mic Off';
  }
};

window.vcallToggleCam = async function () {
  if (!_lkRoom) return;
  _lkCamEnabled = !_lkCamEnabled;
  await _lkRoom.localParticipant.setCameraEnabled(_lkCamEnabled);
  const btn = document.getElementById('vcall-btn-cam');
  if (btn) {
    btn.style.color = _lkCamEnabled ? '#e8edf2' : '#ff3b5c';
    btn.style.borderColor = _lkCamEnabled ? '#1e2a35' : '#ff3b5c';
  }
};

window.vcallToggleScreen = async function () {
  if (!_lkRoom) return;
  const btn = document.getElementById('vcall-btn-screen');
  if (!_lkScreenShare) {
    try {
      await _lkRoom.localParticipant.setScreenShareEnabled(true);
      _lkScreenShare = true;
      if (btn) { btn.style.color = '#00e5ff'; btn.style.borderColor = '#00e5ff'; }
    } catch (e) { console.error('Screen share failed:', e); }
  } else {
    await _lkRoom.localParticipant.setScreenShareEnabled(false);
    _lkScreenShare = false;
    if (btn) { btn.style.color = '#e8edf2'; btn.style.borderColor = '#1e2a35'; }
  }
};

window.minimizeVideoCall = function () {
  const overlay = document.getElementById('vcall-overlay');
  if (overlay) overlay.classList.add('vcall-minimized');
};

window.maximizeVideoCall = function () {
  const overlay = document.getElementById('vcall-overlay');
  if (overlay) overlay.classList.remove('vcall-minimized');
};

window.leaveVideoRoom = async function () {
  if (_lkRoom) { try { await _lkRoom.disconnect(); } catch (e) {} }
  _lkRoom = null;
  document.querySelectorAll('audio').forEach(a => a.remove());
  const overlay = document.getElementById('vcall-overlay');
  if (overlay) {
    overlay.style.display = 'none';
    overlay.classList.remove('vcall-minimized');
  }
};

// === DAY 5: XSS SANITIZATION ===
window.escapeHTML = function(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
};


