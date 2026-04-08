// ===== DATA =====
const CAT = [
  { id: 'f1', name: 'Pork Dish', cat: 'food', icon: '🥩', price: 2500, desc: 'Tender slow-cooked pork, serves ~20 pax' },
  { id: 'f2', name: 'Beef Dish', cat: 'food', icon: '🥩', price: 3000, desc: 'Premium beef dish, serves ~20 pax' },
  { id: 'f3', name: 'Chicken Dish', cat: 'food', icon: '🍗', price: 2200, desc: 'Classic Filipino chicken recipe, serves ~20 pax' },
  { id: 'f4', name: 'Fish Dish', cat: 'food', icon: '🐟', price: 2000, desc: 'Fresh fish fillet, serves ~20 pax' },
  { id: 'f5', name: 'Vegetable Dish', cat: 'food', icon: '🥦', price: 1200, desc: 'Seasonal vegetables, serves ~20 pax' },
  { id: 'f6', name: 'Pasta', cat: 'food', icon: '🍝', price: 1800, desc: 'Creamy or tomato-based pasta, serves ~20 pax' },
  { id: 'f7', name: 'Special Pancit Canton', cat: 'food', icon: '🍜', price: 1500, desc: 'Savory stir-fried noodles, serves ~20 pax' },
  { id: 'f8', name: 'Soup', cat: 'food', icon: '🍲', price: 1000, desc: 'Hearty Filipino soup, serves ~20 pax' },
  { id: 'f9', name: 'Steamed Rice (Unlimited)', cat: 'food', icon: '🍚', price: 2000, desc: 'Unlimited steamed rice for all guests' },
  { id: 'd1', name: 'Dessert Selection', cat: 'dessert', icon: '🍮', price: 1500, desc: 'Assorted Filipino desserts, serves ~20 pax' },
  { id: 'd2', name: 'Spaghetti (Kids)', cat: 'dessert', icon: '🍝', price: 1200, desc: 'Sweet Filipino spaghetti for kids' },
  { id: 'd3', name: 'Fried Chicken (Kids)', cat: 'dessert', icon: '🍗', price: 1400, desc: 'Crispy fried chicken for kids' },
  { id: 'd4', name: 'Hotdog & Mallows (Kids)', cat: 'dessert', icon: '🌭', price: 900, desc: 'Kid-favorite hotdog with marshmallows' },
  { id: 'd5', name: 'Unlimited Drinks', cat: 'dessert', icon: '🥤', price: 1800, desc: 'Assorted soft drinks & juice, unlimited' },
  { id: 'dc1', name: 'Theme Stage Backdrop', cat: 'decoration', icon: '🎭', price: 5000, desc: 'Custom printed theme backdrop for stage' },
  { id: 'dc2', name: 'Ceiling Balloon Treatment', cat: 'decoration', icon: '🎈', price: 3500, desc: 'Balloon ceiling arrangement in theme colors' },
  { id: 'dc3', name: 'Table Centerpiece', cat: 'decoration', icon: '💐', price: 2500, desc: 'Themed centerpiece per table (10 tables)' },
  { id: 'dc4', name: 'Entrance Theme Setup', cat: 'decoration', icon: '🚪', price: 3000, desc: 'Decorated entrance arch with theme elements' },
  { id: 'dc5', name: 'Styro Name Cutouts', cat: 'decoration', icon: '✂️', price: 1500, desc: 'Custom name/letters in styrofoam' },
  { id: 'eq1', name: 'Complete Catering Setup', cat: 'equipment', icon: '🍽️', price: 5000, desc: 'Full catering equipment & centerpiece' },
  { id: 'eq2', name: 'Tables & Chairs w/ Cover', cat: 'equipment', icon: '🪑', price: 4500, desc: 'Themed tables and chairs with ribbon covers' },
  { id: 'eq3', name: 'VIP Long Table Setup', cat: 'equipment', icon: '🎪', price: 2000, desc: 'Special long table for VIP guests' },
  { id: 'eq4', name: 'Utensils & Glassware', cat: 'equipment', icon: '🥄', price: 1500, desc: 'Complete utensil and glassware set' },
  { id: 'eq5', name: 'Waiter in Uniform', cat: 'equipment', icon: '🤵', price: 2500, desc: 'Professionally uniformed waiter service' },
  { id: 'eq6', name: 'Full Lights & Sounds Setup', cat: 'equipment', icon: '💡', price: 8000, desc: 'Complete audio-visual setup for events' },
  { id: 'en1', name: '2x Clowns / Magician', cat: 'entertainment', icon: '🤡', price: 6000, desc: '2 professional clowns or magicians' },
  { id: 'en2', name: 'Game Prizes (20 pcs)', cat: 'entertainment', icon: '🎁', price: 2000, desc: '20 assorted game prizes for guests' },
  { id: 'en3', name: 'Face Painting (3hrs)', cat: 'entertainment', icon: '🎨', price: 3500, desc: 'Professional face painting, 3 hours' },
  { id: 'en4', name: '2x3 Photo Standee', cat: 'entertainment', icon: '🖼️', price: 2500, desc: 'Custom printed 2x3 ft photo standee' },
  { id: 'ph1', name: 'Photobooth (2hrs Unlimited)', cat: 'photography', icon: '📷', price: 7000, desc: 'Unlimited photobooth sessions for 2 hours' },
  { id: 'ph2', name: 'Photographer (Unlimited)', cat: 'photography', icon: '📸', price: 8000, desc: 'Professional photographer, unlimited shots' },
  { id: 'ph3', name: 'Videographer (MTV Style)', cat: 'photography', icon: '🎬', price: 10000, desc: 'Professional videographer, MTV-style output' },
];

// Add mock ratings and reviews to CAT items
CAT.forEach(item => {
  item.rating = (4.2 + (Math.random() * 0.8)).toFixed(1); // 4.2 to 5.0
  item.reviews = Math.floor(Math.random() * 150) + 12; // 12 to 162 reviews
});

const PKGS = [
  { name: 'Kiddie Party Package B', tagline: '100 pax Plus • 30 Kids', price: '₱85,000', pax: '100 pax + 30 kids', icon: '🎉', image: 'https://res.cloudinary.com/dg8ytmck5/image/upload/v1774324108/halden_kiddie_party_vhghct.png', badge: 'Popular', inc: ['Complete Catering Setup & Centerpiece', 'Tables & Chairs with Theme Cover', 'VIP Long Table Setup', 'Full Catering Equipment, Utensils & Glassware', 'Waiter in Uniform', '5 Main Dishes (Pork/Beef, Chicken, Veggies, Fish, Pasta)', 'Special Pancit Canton, Soup & Dessert', 'Unlimited Drinks & Steamed Rice', 'Full Lights & Sounds Setup', 'Theme Backdrop, Balloon Ceiling, Centerpieces', 'Entrance Setup, Styro Name Cutouts', 'Photobooth (2hrs) + Photographer + MTV Videographer', '2 Clowns/Magician + 2x3 Photo Standee', 'Face Painting (3hrs) + 20 Game Prizes', 'FREE Kiddie Meals: Spaghetti, Fried Chicken, Hotdog & Mallows'] },
  { name: 'Simple Celebration Package', tagline: 'Budget-Friendly • 50 pax', price: 'Starting ₱25,000', pax: '50 pax', icon: '🌸', image: 'https://res.cloudinary.com/dg8ytmck5/image/upload/v1774323089/halden3_selh2o.png', badge: 'Starter', inc: ['Basic Catering Setup', 'Tables & Chairs', '3 Main Dishes (Choice of menu)', 'Steamed Rice (Unlimited)', 'Soup & Dessert', 'Unlimited Drinks', 'Waiter in Uniform'] },
  { name: 'Custom Package', tagline: 'Fully Personalized • Any size', price: 'Quote on request', pax: 'Any size', icon: '✦', badge: 'Best Value', inc: ['Choose any items from our full catalog', 'AI-powered recommendations based on your budget', 'Flexible guest count', 'Mix & match food, decor, entertainment & more', 'Personalized quotation from our team'] },
];

// ===== STATE =====
let cart = [];           // finalized packages only
let customPkgItems = []; // items being built in the sidebar
let curCat = 'all';
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
  document.getElementById('pkgs-grid').innerHTML = PKGS.map(p => `
    <div class="package-card">
      <div class="pkg-img" ${p.image ? `style="background: url('${p.image}') center/cover;"` : ''}>
        ${p.image ? '' : (p.icon || '')}
        <span class="pkg-badge">${p.badge}</span>
      </div>
      <div class="pkg-body">
        <div class="pkg-name">${p.name}</div>
        <div class="pkg-tagline">${p.tagline}</div>
        <div class="pkg-price">${p.price} <span>/ ${p.pax}</span></div>
        <ul class="pkg-list">${p.inc.map(i => `<li>${i}</li>`).join('')}</ul>
        <button class="btn-pkg" onclick="startCheckout('pkg', '${p.name}', '${p.price}')">Inquire / Book This Package</button>
      </div>
    </div>`).join('');
}

// ===== CATALOG =====
function renderCat() {
  const grid = document.getElementById('cat-grid');
  let items = curCat === 'all' ? CAT : CAT.filter(i => i.cat === curCat);
  if (!items.length) { grid.innerHTML = `<div class="cat-empty"><div>🔍</div><p>No items here.</p></div>`; return; }
  if (aiPicks) items = [...items].sort((a, b) => aiPicks.includes(b.id) - aiPicks.includes(a.id));
  const pickCount = aiPicks ? items.filter(i => aiPicks.includes(i.id)).length : items.length;
  document.getElementById('cat-count').innerHTML = aiPicks
    ? `<strong>${pickCount} AI picks</strong> · ${items.length} shown`
    : `<strong>${items.length}</strong> items`;
  grid.innerHTML = items.map(item => {
    const inPkg = customPkgItems.find(c => c.id === item.id);
    const isPick = aiPicks && aiPicks.includes(item.id);
    const isDim = aiPicks && !isPick;
    return `
      <div class="cat-card ${isPick ? 'ai-pick' : ''} ${isDim ? 'dimmed' : ''}">
        <div class="cat-thumb">${item.icon}<div class="pick-badge">✦ AI Pick</div></div>
        <div class="cat-info">
          <div class="cat-cat-lbl">${item.cat}</div>
          <div class="cat-n">${item.name}</div>
          <div class="cat-d">${item.desc}</div>
          <div class="cat-p">₱${item.price.toLocaleString()}</div>
          <button class="btn-add ${inPkg ? 'added' : ''}" onclick="toggleItem('${item.id}')">
            ${inPkg ? '✓ Added' : '+ Add to Package'}
          </button>
        </div>
      </div>`;
  }).join('');
}

// ===== FULL CATALOG (READ ONLY) =====
let curFullCat = 'all';
function setFullCat(c, btn) {
  curFullCat = c;
  const btns = document.getElementById('fbtns-full').querySelectorAll('.fb');
  btns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderFullCatalog();
}
window.setFullCat = setFullCat;

function renderFullCatalog() {
  const grid = document.getElementById('full-grid');
  if (!grid) return;
  const items = curFullCat === 'all' ? CAT : CAT.filter(i => i.cat === curFullCat);
  
  grid.innerHTML = items.map(item => {
    const ratingVal = parseFloat(item.rating);
    const fullStars = Math.floor(ratingVal);
    const hasHalf = ratingVal % 1 >= 0.5;
    
    let starsHtml = '';
    for(let i=1; i<=5; i++) {
      if(i <= fullStars) starsHtml += '★';
      else if(i === fullStars + 1 && hasHalf) starsHtml += '½';
      else starsHtml += '☆';
    }

    return `
      <div class="full-cat-card">
        <div class="full-cat-img">${item.icon}</div>
        <div class="full-cat-body">
          <div class="full-cat-cat">${item.cat}</div>
          <div class="full-cat-name">${item.name}</div>
          <div class="full-cat-price">₱${item.price.toLocaleString()}</div>
          <div class="full-cat-desc">${item.desc}</div>
          <div class="full-cat-rating">
            <div class="stars-row">${starsHtml}</div>
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

// ===== CUSTOM PACKAGE =====
function toggleItem(id) {
  const item = CAT.find(i => i.id === id);
  const idx = customPkgItems.findIndex(c => c.id === id);
  if (idx > -1) customPkgItems.splice(idx, 1);
  else customPkgItems.push(item);
  renderCat(); renderCustomPkg();
}

function removePkgItem(id) {
  customPkgItems = customPkgItems.filter(c => c.id !== id);
  renderCat(); renderCustomPkg();
}

function renderCustomPkg() {
  const tot = document.getElementById('cpkg-total');
  const cnt = document.getElementById('cpkg-count');
  if (!tot || !cnt) return;

  const totalAmt = customPkgItems.reduce((s, i) => s + i.price, 0);
  tot.textContent = '₱' + totalAmt.toLocaleString();
  cnt.textContent = customPkgItems.length;

  const cats = {
    food: document.getElementById('cpkg-list-food'),
    equipment: document.getElementById('cpkg-list-equipment'),
    fun: document.getElementById('cpkg-list-fun'),
    addons: document.getElementById('cpkg-list-addons')
  };

  // Group items by category rule
  const groups = { food: [], equipment: [], fun: [], addons: [] };
  customPkgItems.forEach(item => {
    if (item.cat === 'food' || item.cat === 'dessert') groups.food.push(item);
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
      el.innerHTML = groups[key].map(item => `
        <div class="cpkg-item-row">
          <div class="cpkg-item-icon">${item.icon}</div>
          <div class="cpkg-item-inf">
            <div class="cpkg-item-name">${item.name}</div>
            <div class="cpkg-item-price">₱${item.price.toLocaleString()}</div>
          </div>
          <button class="cpkg-item-rm" onclick="removePkgItem('${item.id}')">✕</button>
        </div>`).join('');
    }
  });
}

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

function openErrorModal(msg) {
  const overlay = document.getElementById('error-overlay');
  const msgEl = document.getElementById('error-msg');
  if (overlay && msgEl) {
    msgEl.textContent = msg;
    overlay.classList.add('on');
  }
}
window.openErrorModal = openErrorModal;

function closeErrorModal() {
  document.getElementById('error-overlay')?.classList.remove('on');
}
window.closeErrorModal = closeErrorModal;

function finalizePackage() {
  const desc = document.getElementById('cpkg-desc')?.value.trim();
  const theme = document.getElementById('cpkg-theme')?.value.trim();
  const pax = document.getElementById('cpkg-pax')?.value.trim();
  const occasion = document.getElementById('cpkg-occasion')?.value.trim();
  const city = document.getElementById('cpkg-city')?.value.trim();
  const venue = document.getElementById('cpkg-venue')?.value.trim();

  if (!desc || !theme || !pax || !occasion || !city) {
    openErrorModal('Please fill in all event details (Description, Theme, Pax, Occasion, and City) before finalizing your package.');
    return;
  }

  const hasFood = customPkgItems.some(i => i.cat === 'food' || i.cat === 'dessert');
  const hasEquip = customPkgItems.some(i => i.cat === 'equipment' || i.cat === 'decoration');

  if (!hasFood || !hasEquip) {
    openErrorModal('Food and Equipment selections are absolutely required. Please select at least one item from each category before finalizing.');
    return;
  }

  const name = prompt('Give your package a name:', `${occasion} Package`);
  if (!name) return;

  const total = customPkgItems.reduce((s, i) => s + i.price, 0);
  const summary = {
    id: 'custom_' + Date.now(),
    isCustom: true,
    name: name.trim(),
    desc, theme, pax, occasion,
    city,                          // ← FIX: was missing from summary
    venue: venue || city,          // ← FIX: fall back to city if map wasn't used
    items: [...customPkgItems],
    total,
    price: total,
    icon: '📋'
  };

  cart.push(summary);
  renderCart();
  document.getElementById('cart-drawer').classList.add('open');

  customPkgItems = [];
  renderCustomPkg();
  ['cpkg-desc','cpkg-theme','cpkg-pax','cpkg-occasion','cpkg-city','cpkg-venue'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  document.getElementById('cpkg-panel').classList.remove('view-items-open');
  document.getElementById('cpkg-selected-items-view').classList.remove('open');

  renderCat();
}

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
      <button class="c-rm" onclick="removeCartPkg(${pi})">✕</button>
    </div>`;
  }).join('');
}

function removeCartPkg(idx) {
  cart.splice(idx, 1);
  renderCart();
}

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
  safeAssign('map-search-input', pkg.venue); 

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
  const occasion = document.getElementById('cpkg-occasion')?.value.trim();
  const venue = document.getElementById('cpkg-venue')?.value.trim();
  const hasForm = desc || theme || pax || occasion || venue;
  const hasItems = customPkgItems.length > 0;
  if (!hasForm && !hasItems) return null;
  let ctx = "[CURRENT CUSTOM PACKAGE]\n";
  if (occasion) ctx += `Occasion: ${occasion}\n`;
  if (desc) ctx += `Description: ${desc}\n`;
  if (theme) ctx += `Theme: ${theme}\n`;
  if (pax) ctx += `Guests: ${pax} pax\n`;
  if (venue) ctx += `Venue: ${venue}\n`;
  if (hasItems) {
    ctx += `Items selected (${customPkgItems.length}): ${customPkgItems.map(i => `${i.name} (₱${i.price.toLocaleString()})`).join(', ')}\n`;
    ctx += `Current total: ₱${customPkgItems.reduce((s,i) => s+i.price, 0).toLocaleString()}\n`;
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
    bar.textContent = `Reading your package${occasion ? (' — ' + occasion) : ''}${cnt ? (' · ' + cnt + ' item' + (cnt!==1?'s':'')) : ''}`;
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

const SYS = `You are Halden's AI Event Planning Assistant for Halden's Event Management and Catering Service, a premium catering business in the Philippines, Please be limited to only answer in regards to anything about catering matters, if its not a catering matter then reply with I'm sorry I am only able to provide you with assistance in regards to planning your events, anything unrelated is something I can't help you with.

Your job: (1) Have a warm, helpful conversation to understand the client's event, and (2) after EVERY reply where you understand the event needs, output a JSON block of recommended catalog IDs so the website can highlight those items in real time.

CATALOG IDs:
food: f1=Pork Dish(₱2500), f2=Beef Dish(₱3000), f3=Chicken Dish(₱2200), f4=Fish Dish(₱2000), f5=Vegetable Dish(₱1200), f6=Pasta(₱1800), f7=Pancit Canton(₱1500), f8=Soup(₱1000), f9=Steamed Rice(₱2000)
dessert: d1=Dessert Selection(₱1500), d2=Spaghetti Kids(₱1200), d3=Fried Chicken Kids(₱1400), d4=Hotdog&Mallows Kids(₱900), d5=Unlimited Drinks(₱1800)
decoration: dc1=Theme Backdrop(₱5000), dc2=Ceiling Balloons(₱3500), dc3=Table Centerpiece(₱2500), dc4=Entrance Setup(₱3000), dc5=Styro Name(₱1500)
equipment: eq1=Catering Setup(₱5000), eq2=Tables&Chairs(₱4500), eq3=VIP Long Table(₱2000), eq4=Utensils(₱1500), eq5=Waiter(₱2500), eq6=Lights&Sounds(₱8000)
entertainment: en1=Clowns/Magician(₱6000), en2=Game Prizes(₱2000), en3=Face Painting(₱3500), en4=Photo Standee(₱2500)
photography: ph1=Photobooth(₱7000), ph2=Photographer(₱8000), ph3=Videographer(₱10000)

RULES:
- ALWAYS end every response with: {"recommended_ids":["id1","id2",...]}
- Include 5 to 12 IDs most relevant to the event
- do the filter function too if they talk in filipino/tagalog
- Kiddie party → always include: f3,f9,d5,d2,d3,d4,en1,en3,eq2,dc2
- Wedding → always include: f1,f2,f3,f9,d5,eq1,eq2,eq5,eq6,ph2,ph3,dc1
- Corporate → include: f2,f3,f9,d5,eq1,eq2,eq5,eq6
- Budget events (under ₱20k) → focus on food only
- Large events (100+ pax) → always include eq1,eq2,eq5,eq6
- Keep replies concise, warm, professional. Use ₱ for prices. Ask ONE question if needed. JSON always goes on its own line at the end.`;

let hist = [{ role: 'system', content: SYS }];
let initialized = { desk: false, mob: false };

function initAI(panel) {
  if (initialized[panel]) return;
  initialized[panel] = true;
  const msgsId = panel === 'desk' ? 'ai-msgs-desk' : 'ai-msgs-mob';
  addBot("Hi there! 👋 I'm Halden's AI Event Planner.\n\nDescribe your event below — the occasion, number of guests, budget, and any theme ideas — and I'll instantly highlight the most suitable items from our catalog for you. ✦", msgsId);
}

function addBot(txt, msgsId) {
  const c = document.getElementById(msgsId);
  if (!c) return;
  const d = document.createElement('div');
  d.className = 'ai-msg bot';
  d.innerHTML = `<div class="ai-msg-ico">✦</div><div class="ai-bub">${txt.replace(/\n/g, '<br>')}</div>`;
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
  d.innerHTML = `<div class="ai-msg-ico">✦</div><div class="ai-bub typing-dots"><span></span><span></span><span></span></div>`;
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
  if (panel === 'desk') {
    const ctx = getCustomPkgContext();
    if (ctx) userContent = ctx + '\nUser message: ' + txt;
    updateDawContextBar();
  }
  hist.push({ role: 'user', content: userContent });

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'HTTP-Referer': location.href, 'X-Title': "Halden's AI Planner" },
      body: JSON.stringify({ model: 'arcee-ai/trinity-large-preview:free', messages: hist, max_tokens: 900 })
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
  document.getElementById('aib-title').textContent = `✦ ${ids.length} items recommended for you`;
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
      
      leafletMap.flyTo([lat, lon], 16);
      
      if(mapMarker) leafletMap.removeLayer(mapMarker);
      mapMarker = L.marker([lat, lon]).addTo(leafletMap);
      
      // Auto fill input with formatted display name
      document.getElementById('map-search-input').value = data[0].display_name;
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
renderPkgs();
renderFullCatalog();
renderCat();
initAI('desk');
document.getElementById('mob-ai-fab').addEventListener('click', () => { setTimeout(() => initAI('mob'), 50); });

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
  document.getElementById('tab-' + tab).classList.add('active');
  document.getElementById('panel-' + tab).classList.add('active');
}

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
    const { collection, getDocs } = window.firebaseFns;
    const snapshot = await getDocs(collection(window.firebaseDB, 'users'));
    let foundUser = null;
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.email?.trim().toLowerCase() === email.toLowerCase() && data.password?.trim() === pass) foundUser = data;
    });
    if (!foundUser) { showAuthMsg('login-msg', 'error', 'Invalid email or password.'); btn.disabled = false; btn.textContent = 'Login to My Account'; return; }
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
async function doSignup() {
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const pass = document.getElementById('signup-password').value;
  if (!name || !email || !pass) { showAuthMsg('signup-msg', 'error', 'Please fill in all fields.'); return; }
  if (pass.length < 6) { showAuthMsg('signup-msg', 'error', 'Password must be at least 6 characters.'); return; }
  const btn = document.getElementById('signup-btn');
  btn.disabled = true; btn.textContent = 'Creating account...';
  clearAuthMsg('signup-msg');
  try {
    await waitForFirebase();
    const { createUserWithEmailAndPassword, updateProfile } = window.firebaseFns;
    const userCred = await createUserWithEmailAndPassword(window.firebaseAuth, email, pass);
    await updateProfile(userCred.user, { displayName: name });
    const { collection, addDoc } = window.firebaseFns;
    await addDoc(collection(window.firebaseDB, 'users'), { uid: userCred.user.uid, name, password: pass, email, role: 'customer', createdAt: new Date() });
    showAuthMsg('signup-msg', 'success', 'Account created! You can now log in.');
    btn.disabled = false; btn.textContent = 'Create My Account';
    setTimeout(() => switchAuthTab('login'), 1500);
  } catch (err) {
    let msg = 'Something went wrong. Please try again.';
    if (err.code === 'auth/email-already-in-use') msg = 'This email is already registered. Try logging in.';
    if (err.code === 'auth/invalid-email') msg = 'Please enter a valid email address.';
    showAuthMsg('signup-msg', 'error', msg);
    btn.disabled = false; btn.textContent = 'Create My Account';
  }
}

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
  if (venueInput) {
    if (intent.src === 'cart') {
      const customPkgWithVenue = cart.find(c => c.venue);
      if (customPkgWithVenue) venueInput.value = customPkgWithVenue.venue;
    } else {
      venueInput.value = '';
    }
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

    /* --- PAYMONGO TEMPORARILY DISABLED ---
    // 2. Call our backend to create a PayMongo Checkout Session
    const apiRes = await fetch('/api/paymongo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{
          name: \`\${type} Reservation - \${fmtDate}\`,
          price: amount
        }],
        customerInfo: {
          name: currentUser.displayName || currentUser.name || 'Guest',
          email: currentUser.email,
          type: type,
          reservationId: resRef.id
        }
      })
    });

    const apiData = await apiRes.json();

    if (apiData.checkout_url) {
      msgEl.className = 'auth-msg success'; 
      msgEl.textContent = 'Redirecting to secure payment...'; 
      msgEl.style.display = 'block';
      
      // Clear cart before redirect
      cart = []; 
      renderCart(); 
      renderCat();

      // 3. Redirect to PayMongo
      setTimeout(() => {
        window.location.href = apiData.checkout_url;
      }, 1000);
    } else {
      throw new Error(apiData.error || 'Failed to create checkout session');
    }
    --- END PAYMONGO BLOCK --- */

    // Direct Success Workflow (since PayMongo is disabled)
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
}
window.switchDashTab = switchDashTab;

function openProfile() {
  if (!currentUser) return;
  document.getElementById('dash-overlay').classList.add('on');
  document.body.style.overflow = 'hidden';

  document.getElementById('dash-user-name').textContent = currentUser.displayName || 'Customer';
  document.getElementById('dash-user-email').textContent = currentUser.email;

  renderProfileReservations();
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
          // Static map using Yandex (OSM-based) as a free fallback for mini-thumbnails
          const mapUrl = `https://static-maps.yandex.ru/1.x/?ll=${lon},${lat}&z=14&l=map&pt=${lon},${lat},pm2rdl&size=400,300`;
          
          return `
            <div class="dash-res-card approved">
              <div class="drc-map-side">
                <img src="${mapUrl}" alt="Venue Location" onerror="this.src='https://placehold.co/400x300?text=Location+Map'">
              </div>
              <div class="drc-content">
                <div class="drc-hdr">
                  <div class="drc-type">${res.type} ✦ Confirmed</div>
                </div>
                <div class="drc-date"><span>📅</span> ${res.date}</div>
                <div class="drc-meta">
                  <span>👥 ${res.pax} pax</span>
                  <span>💰 ${res.amount}</span>
                </div>
                <div class="drc-venue"><i>📍</i> <span>${res.venue || 'Halden\'s Private Venue'}</span></div>
                <div class="drc-status approved" style="margin-top:15px; display:inline-block;">${res.status}</div>
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

// ===== CHAT LOGIC =====
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
        <p>Hello! How can we help you with your event planning today? ✦</p>
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

// ===== DESKTOP HERO SLIDESHOW =====
function initHeroSlideshow() {
  const slider = document.getElementById('hero-slider');
  if (!slider) return;
  slider.innerHTML = HERO_IMAGES.map((img, i) =>
    `<div class="hero-slide ${i === 0 ? 'active' : ''}" style="background-image: url('${img.url}')"></div>`
  ).join('');
  let cur = 0;
  const slides = slider.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  setInterval(() => { slides[cur].classList.remove('active'); cur = (cur + 1) % slides.length; slides[cur].classList.add('active'); }, 4000);
}

window.addEventListener('load', () => {
  setTimeout(initHeroSlideshow, 50);
  setTimeout(initMobileHeroCarousel, 80);   // mobile hero bg carousel
  setTimeout(initMobileFadeCarousel, 100);  // mobile moments square
  setTimeout(initCarousel, 100);            // desktop strip carousel
  setTimeout(initScrollReveal, 100);
});

// ===== RESTORE SESSION =====
window.addEventListener('load', () => {
  const { onAuthStateChanged } = window.firebaseFns || {};
  if (!onAuthStateChanged || !window.firebaseAuth) return;
  onAuthStateChanged(window.firebaseAuth, (user) => {
    if (user) {
      setLoggedIn({ displayName: user.displayName, email: user.email, uid: user.uid });
      listenToCustomerChat(); // start listening on login
    }
    else setLoggedOut();
  });
});
// ===== EXPOSE GLOBALS =====
window.finalizePackage = finalizePackage;
window.toggleItem = toggleItem;
window.removePkgItem = removePkgItem;
window.renderCustomPkg = renderCustomPkg;
window.toggleSelectedItemsView = toggleSelectedItemsView;
window.openErrorModal = openErrorModal;
window.closeErrorModal = closeErrorModal;
window.setCat = setCat;
window.jumpCat = jumpCat;
window.renderCat = renderCat;
window.toggleCart = toggleCart;
window.removeCartPkg = removeCartPkg;
window.modifyCartPkg = modifyCartPkg;
window.openAuth = openAuth;
window.closeAuth = closeAuth;
window.switchAuthTab = switchAuthTab;
window.ar = ar;
window.go = go;
