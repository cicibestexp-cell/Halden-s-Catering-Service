// ===== AUTH GUARD (STAFF) =====
function checkAuth() {
  const logged = sessionStorage.getItem('halden_staff');
  if (!logged) { window.location.href = 'index.html'; return; }
  try {
    const u = JSON.parse(logged);
    document.getElementById('admin-name').textContent = u.name || 'Staff Member';
  } catch(e) {}
}

function adminLogout() {
  sessionStorage.removeItem('halden_staff');
  window.location.href = 'index.html';
}

checkAuth();

// ===== NAVIGATION =====
function showSection(name, el) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById('section-' + name).classList.add('active');
  if (el) el.classList.add('active');

  if (name === 'events' && window.calendar) {
    setTimeout(() => window.calendar.render(), 10);
  }
  if (name === 'chat') {
    initAdminChat();
  }
}

// ===== LIVE DATA (loaded from Firestore) =====
let INVENTORY = [];
let RESERVATIONS = [];

// Static data that doesn't need Firestore yet
const FORECAST = [
  {name:'Chicken',     needed:45, available:8,   pct:95, unit:'kg'},
  {name:'Steamed Rice',needed:60, available:20,  pct:85, unit:'kg'},
  {name:'Pork',        needed:30, available:25,  pct:60, unit:'kg'},
  {name:'Beef',        needed:20, available:15,  pct:55, unit:'kg'},
  {name:'Vegetables',  needed:25, available:22,  pct:40, unit:'kg'},
  {name:'Soft Drinks', needed:90, available:120, pct:30, unit:'pcs'},
];

const ACTIVITY = [
  {dot:'green', title:'Santos reservation confirmed',   sub:'Payment received — ₱85,000',          time:'2h ago'},
  {dot:'amber', title:'Low stock detected',             sub:'Chicken inventory below threshold',     time:'5h ago'},
  {dot:'gold',  title:'New reservation submitted',      sub:'Cruz Corporate — awaiting approval',    time:'Yesterday'},
  {dot:'green', title:'Inventory restocked',            sub:'Pork +25kg, Vegetables +15kg',          time:'2 days ago'},
];

const CHART_WEEKS = [
  {label:'W1', pct:35, highlight:false},
  {label:'W2', pct:55, highlight:false},
  {label:'W3', pct:80, highlight:true},
  {label:'W4', pct:45, highlight:false},
];

// ===== LOAD FROM FIRESTORE =====
async function loadData() {
  // Show loading state
  const invTbody = document.getElementById('inv-tbody');
  if (invTbody) invTbody.innerHTML = `
    <tr><td colspan="4" style="text-align:center;padding:24px;color:var(--text-dim);">
      Loading inventory...
    </td></tr>`;

  try {
    const { collection, getDocs } = window.firebaseFns;
    const db = window.firebaseDB;

    // Load reservations
    const resSnap = await getDocs(collection(db, 'reservations'));
    RESERVATIONS = resSnap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        client: data.client,
        type: data.type,
        date: data.date,
        pax: data.pax,
        // Format amount back to ₱ display string
        amount: '₱' + Number(data.amount).toLocaleString(),
        status: data.status,
      };
    });

    // Sort reservations by status: pending first, then confirmed, then cancelled
    RESERVATIONS.sort((a, b) => {
      const order = { pending: 0, confirmed: 1, cancelled: 2 };
      return (order[a.status] ?? 3) - (order[b.status] ?? 3);
    });

    // Load inventory
    const invSnap = await getDocs(collection(db, 'inventory'));
    INVENTORY = invSnap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        name: data.name,
        cat: data.cat,
        stock: data.stock,
        unit: data.unit,
        min: data.min,
        status: data.status,
      };
    });

    // Sort inventory: critical first, then low, then ok
    INVENTORY.sort((a, b) => {
      const order = { critical: 0, low: 1, ok: 2 };
      return (order[a.status] ?? 3) - (order[b.status] ?? 3);
    });

    // Render staff-accessible sections only
    renderInventory();
    renderPendingDispatch();
    renderForecast();
    renderEvents();
    renderInsights();

  } catch(err) {
    console.error('Firestore load error:', err);
    const invTbody = document.getElementById('inv-tbody');
    if (invTbody) invTbody.innerHTML = `
      <tr><td colspan="4" style="text-align:center;padding:24px;color:var(--red);">
        ⚠ Failed to load inventory. Check your Firebase connection.
      </td></tr>`;
  }
}

// ===== UPDATE RESERVATION STATUS IN FIRESTORE =====
async function updateReservationStatus(id, newStatus) {
  try {
    const { doc, updateDoc } = window.firebaseFns;
    const db = window.firebaseDB;
    await updateDoc(doc(db, 'reservations', id), { status: newStatus });

    // Update local array too so UI refreshes instantly without re-fetching
    const res = RESERVATIONS.find(r => r.id === id);
    if (res) res.status = newStatus;

    renderReservations(currentFilter);
    renderDashboard();
    renderEvents();
    renderPendingDispatch();
    renderForecast();
  } catch(err) {
    alert('Failed to update reservation. Please try again.');
    console.error(err);
  }
}

// ===== UPDATE INVENTORY STOCK IN FIRESTORE =====
async function updateStock(id, newStock) {
  try {
    const { doc, updateDoc } = window.firebaseFns;
    const db = window.firebaseDB;

    // Recalculate status based on new stock vs min
    const item = INVENTORY.find(i => i.id === id);
    if (!item) return;
    const ratio = newStock / item.min;
    const newStatus = ratio <= 0.3 ? 'critical' : ratio < 1 ? 'low' : 'ok';

    await updateDoc(doc(db, 'inventory', id), {
      stock: newStock,
      status: newStatus
    });

    // Update local array
    item.stock = newStock;
    item.status = newStatus;

    renderInventory();
    renderPendingDispatch();
    renderDashboard();
    renderForecast();
  } catch(err) {
    alert('Failed to update stock. Please try again.');
    console.error(err);
  }
}

// ===== ADD STOCK MODAL logic =====
function openAddStock() {
  document.getElementById('add-stock-overlay').classList.add('on');
  document.getElementById('add-stock-modal').classList.add('open');
}

function closeAddStock() {
  document.getElementById('add-stock-overlay').classList.remove('on');
  document.getElementById('add-stock-modal').classList.remove('open');
}

async function submitAddStock() {
  const name = document.getElementById('add-stock-name').value.trim();
  const cat = document.getElementById('add-stock-cat').value;
  const unit = document.getElementById('add-stock-unit').value.trim();
  const qty = parseInt(document.getElementById('add-stock-qty').value) || 0;
  const min = parseInt(document.getElementById('add-stock-min').value) || 0;

  if (!name || !unit || !cat) {
    alert("Please fill in item name, category, and unit.");
    return;
  }

  const btn = document.getElementById('btn-submit-stock');
  btn.disabled = true;
  btn.textContent = 'Adding...';

  try {
    const { collection, addDoc } = window.firebaseFns;
    const db = window.firebaseDB;
    
    const ratio = min > 0 ? (qty / min) : Infinity;
    const status = ratio <= 0.3 ? 'critical' : (ratio < 1 ? 'low' : 'ok');

    const newItem = { name, cat, unit, stock: qty, min, status };
    const docRef = await addDoc(collection(db, 'inventory'), newItem);
    
    newItem.id = docRef.id;
    INVENTORY.push(newItem);
    
    document.getElementById('add-stock-name').value = '';
    document.getElementById('add-stock-unit').value = '';
    document.getElementById('add-stock-qty').value = '';
    document.getElementById('add-stock-min').value = '';
    
    closeAddStock();
    renderInventory();
    renderPendingDispatch();
    renderDashboard();
    renderForecast();

  } catch (err) {
    console.error(err);
    alert("Error adding stock.");
  }
  
  btn.disabled = false;
  btn.textContent = 'Add Item';
}

window.openAddStock = openAddStock;
window.closeAddStock = closeAddStock;
window.submitAddStock = submitAddStock;

// ===== RESTOCK MODAL logic =====
function openRestockModal() {
  const itemSelect = document.getElementById('restock-item-select');
  
  // Populate dropdown with latest inventory
  let options = '<option value="">Choose an item...</option>';
  INVENTORY.forEach(inv => {
    options += `<option value="${inv.id}" data-unit="${inv.unit}">${inv.name} (Current: ${inv.stock} ${inv.unit})</option>`;
  });
  itemSelect.innerHTML = options;
  
  document.getElementById('restock-qty-input').value = '';
  document.getElementById('restock-unit-display').value = '';

  document.getElementById('restock-overlay').classList.add('on');
  document.getElementById('restock-modal').classList.add('open');
}

function closeRestockModal() {
  document.getElementById('restock-overlay').classList.remove('on');
  document.getElementById('restock-modal').classList.remove('open');
}

function updateRestockUnit() {
  const select = document.getElementById('restock-item-select');
  const selected = select.options[select.selectedIndex];
  if (selected && selected.value) {
    document.getElementById('restock-unit-display').value = selected.getAttribute('data-unit');
  } else {
    document.getElementById('restock-unit-display').value = '';
  }
}

async function submitRestock() {
  const itemId = document.getElementById('restock-item-select').value;
  const qtyInput = parseInt(document.getElementById('restock-qty-input').value) || 0;

  if (!itemId || qtyInput <= 0) {
    alert("Please select an item and enter a valid quantity.");
    return;
  }

  const btn = document.getElementById('btn-submit-restock');
  btn.disabled = true;
  btn.textContent = 'Updating...';

  try {
    const item = INVENTORY.find(i => i.id === itemId);
    if (!item) throw new Error("Item not found locally");
    
    const newStock = (item.stock || 0) + qtyInput;
    await updateStock(itemId, newStock);
    
    closeRestockModal();
  } catch(err) {
    console.error(err);
    alert('Failed to restock layout');
  }
  
  btn.disabled = false;
  btn.textContent = 'Confirm Restock';
}

window.openRestockModal = openRestockModal;
window.closeRestockModal = closeRestockModal;
window.updateRestockUnit = updateRestockUnit;
window.submitRestock = submitRestock;

// ===== EVENT DETAILS MODAL logic =====
let currentEditingEventId = null;

function openEventDetails(id) {
  const ev = RESERVATIONS.find(r => r.id === id);
  if (!ev) return;
  
  currentEditingEventId = id;
  
  document.getElementById('ed-title').textContent = ev.client + ' — ' + (ev.packageName || ev.type);
  document.getElementById('ed-date').textContent = ev.date;
  document.getElementById('ed-amount').textContent = ev.amount;
  document.getElementById('ed-pax').textContent = ev.pax + ' pax';
  document.getElementById('ed-status').value = ev.status;
  
  const reqs = calculateEventIngredients(ev);
  
  const stocksList = document.getElementById('ed-stocks-list');
  let stocksHtml = '';
  
  INVENTORY.forEach(inv => {
    const needed = reqs[inv.name] || 0;
    if (needed > 0) {
      const hasEnough = inv.stock >= needed;
      const color = hasEnough ? 'var(--text-mid)' : 'var(--red)';
      stocksHtml += `
        <div style="background:var(--bg3); border:1px solid var(--border); padding:10px 14px; border-radius:10px; margin-bottom:8px;">
          <div style="font-size:14px; font-weight:600; color:var(--text); margin-bottom:4px;">${inv.name}</div>
          <div style="display:flex; justify-content:space-between; font-size:12px;">
            <span>Needed: <strong style="color:var(--cream);">${needed} ${inv.unit}</strong></span>
            <span style="color:${color}; font-weight:600;">${inv.stock||0} ${inv.unit} available</span>
          </div>
        </div>
      `;
    }
  });
  
  stocksList.innerHTML = stocksHtml || '<div>No mapped ingredients found.</div>';

  showSection('event-details');
}

function backToCalendar() {
  currentEditingEventId = null;
  showSection('events', document.querySelector('.sidebar-item[onclick*="events"]'));
}

function changeEventStatus() {
  if (!currentEditingEventId) return;
  const newStatus = document.getElementById('ed-status').value;
  updateReservationStatus(currentEditingEventId, newStatus);
}

window.openEventDetails = openEventDetails;
window.backToCalendar = backToCalendar;
window.changeEventStatus = changeEventStatus;

// ===== RENDER DASHBOARD =====
function renderDashboard() {
  // Stats counters
  const pendingCount = RESERVATIONS.filter(r => r.status === 'pending').length;
  const criticalCount = INVENTORY.filter(i => i.status === 'critical').length;
  const lowCount = INVENTORY.filter(i => i.status === 'low').length;

  // Update stat cards dynamically
  const statCards = document.querySelectorAll('.stat-card .stat-value');
  if (statCards[1]) statCards[1].textContent = pendingCount;
  if (statCards[2]) statCards[2].textContent = criticalCount + lowCount;

  // Update sidebar badges
  const resBadge = document.querySelector('.sidebar-item[onclick*="reservations"] .sidebar-badge');
  const invBadge = document.querySelector('.sidebar-item[onclick*="inventory"] .sidebar-badge');
  if (resBadge) resBadge.textContent = pendingCount;
  if (invBadge) invBadge.textContent = criticalCount + lowCount;

  // Upcoming confirmed reservations (next 3)
  const upcoming = RESERVATIONS.filter(r => r.status === 'confirmed').slice(0, 3);
  document.getElementById('dash-reservations').innerHTML = upcoming.length ? upcoming.map(r => {
    const parts = r.date.split(' ');
    return `
      <div class="res-item">
        <div class="res-date-box">
          <div class="res-date-day">${parts[1].replace(',','')}</div>
          <div class="res-date-mon">${parts[0]}</div>
        </div>
        <div class="res-info">
          <div class="res-name">${r.client}</div>
          <div style="font-size:11px;color:var(--gold);margin-top:2px;">${r.packageName || r.type}</div>
          <div class="res-details"><span>👥 ${r.pax} pax</span><span>🎉 ${r.type}</span></div>
        </div>
        <div class="res-right">
          <div class="res-price">${r.amount}</div>
          <span class="badge ${r.status}">${r.status.charAt(0).toUpperCase()+r.status.slice(1)}</span>
        </div>
      </div>`;
  }).join('') : `<div style="text-align:center;padding:20px;color:var(--text-dim);font-size:13px;">No upcoming confirmed reservations.</div>`;

  // Booking chart (Chart.js)
  const ctxBookings = document.getElementById('booking-chart');
  if (ctxBookings) {
    if (window.bookingChartInst) window.bookingChartInst.destroy();
    window.bookingChartInst = new Chart(ctxBookings, {
      type: 'bar',
      data: {
        labels: CHART_WEEKS.map(w => w.label),
        datasets: [{
          data: CHART_WEEKS.map(w => w.pct),
          backgroundColor: CHART_WEEKS.map(w => w.highlight ? '#e8bf6a' : '#c49a3c'),
          borderRadius: 4
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#a89070', font: {family: "'DM Sans', sans-serif"} } },
          y: { display: false }
        }
      }
    });
  }

  // Activity log
  document.getElementById('activity-log').innerHTML = ACTIVITY.map(a => `
    <div class="timeline-item">
      <div class="timeline-dot ${a.dot}"></div>
      <div class="timeline-content">
        <div class="timeline-title">${a.title}</div>
        <div class="timeline-sub">${a.sub}</div>
      </div>
      <div class="timeline-time">${a.time}</div>
    </div>`).join('');
}

// ===== RENDER INVENTORY =====
function renderInventory() {
  if (!INVENTORY.length) {
    document.getElementById('inv-tbody').innerHTML = `
      <tr><td colspan="4" style="text-align:center;padding:24px;color:var(--text-dim);">No inventory items found.</td></tr>`;
    return;
  }
  document.getElementById('inv-tbody').innerHTML = INVENTORY.map(item => {
    const pct = Math.min(100, Math.round((item.stock / item.min) * 100));
    return `
      <tr>
        <td><div class="item-name">${item.name}</div><div class="item-cat">${item.cat}</div></td>
        <td>
          <div class="stock-bar-wrap">
            <div class="stock-bar-bg"><div class="stock-bar-fill ${item.status}" style="width:${pct}%"></div></div>
            <div class="stock-num ${item.status}">${item.stock} ${item.unit}</div>
          </div>
        </td>
        <td style="font-size:12px;color:var(--text-dim);">${item.min} ${item.unit}</td>
        <td>
          <span class="badge ${item.status}">${item.status==='ok'?'✓ OK':item.status==='low'?'⚠ Low':'🚨 Critical'}</span>
        </td>
      </tr>`;
  }).join('');
}

// ===== EXTRAPOLATION LOGIC =====
function calculateEventIngredients(reservation) {
  const req = { 'Chicken': 0, 'Steamed Rice': 0, 'Pork': 0, 'Beef': 0, 'Vegetables': 0, 'Soft Drinks': 0 };
  const items = reservation.packageItems || [];
  
  if (!items.length) {
     req['Chicken'] += Math.ceil(reservation.pax * 0.4);
     req['Pork'] += Math.ceil(reservation.pax * 0.3);
     req['Steamed Rice'] += Math.ceil(reservation.pax * 0.3);
     return req;
  }

  items.forEach(item => {
    let lower = item.toLowerCase();
    
    // Meat logic
    if (lower.includes('chicken')) req['Chicken'] += reservation.pax * 0.4;
    if (lower.includes('pork')) req['Pork'] += reservation.pax * 0.3;
    if (lower.includes('beef')) req['Beef'] += reservation.pax * 0.2;
    
    // Veggies
    if (lower.includes('vegetable') || lower.includes('pancit') || lower.includes('soup')) req['Vegetables'] += reservation.pax * 0.2;
    
    // Rice
    if (lower.includes('rice')) req['Steamed Rice'] += reservation.pax * 0.3;
    
    // Drinks
    if (lower.includes('drinks')) req['Soft Drinks'] += reservation.pax * 1.5;

    // Handling generic pre-made package strings
    if (lower.includes('main dishes') || lower.includes('catering setup')) {
       req['Chicken'] += reservation.pax * 0.2;
       req['Pork'] += reservation.pax * 0.15;
    }
  });

  for (let k in req) { req[k] = Math.ceil(req[k]); }
  return req;
}

// ===== RENDER PENDING DISPATCH =====
function renderPendingDispatch() {
  const pendingList = document.getElementById('pending-dispatch-list');
  if (!pendingList) return;

  const confirmed = RESERVATIONS.filter(r => r.status === 'confirmed');

  if (confirmed.length === 0) {
    pendingList.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-dim);font-size:13px;">No confirmed events pending dispatch.</div>`;
    return;
  }

  let html = '';
  confirmed.forEach(r => {
     const reqs = calculateEventIngredients(r);
     
     let reqsHtml = '';
     INVENTORY.forEach(inv => {
        const val = reqs[inv.name] || 0;
        if (val > 0) {
           reqsHtml += `<div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px; padding-left:10px;">
              <span style="color:var(--text-dim);">&bull; ${inv.name}</span>
              <span style="font-weight:600; color:var(--cream);">${val} ${inv.unit}</span>
           </div>`;
        }
     });

     if (!reqsHtml) reqsHtml = `<div style="font-size:12px; color:var(--text-dim); padding-left:10px;">No exact ingredients mapped yet.</div>`;

     html += `
       <div style="background:var(--bg2); border: 1px solid var(--border); border-radius:10px; padding:12px 14px; margin-bottom:12px;">
         <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
            <div>
               <div style="font-weight:600; font-size:14px; color:var(--gold);">${r.client}</div>
               <div style="font-size:12px; color:var(--text); margin-top:2px; margin-bottom:4px;">${r.packageName || r.type}</div>
               <div style="font-size:11px; color:var(--text-dim);">${r.type} &middot; ${r.date} &middot; ${r.pax} pax</div>
            </div>
            <div style="font-size:10px; background:var(--gold); color:#000; padding:2px 6px; border-radius:4px; font-weight:700;">Approved</div>
         </div>
         <div style="background:var(--bg3); padding:10px; border-radius:6px; margin-bottom:8px;">
            <div style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:var(--gold); margin-bottom:6px;">Package Components</div>
            <ul style="margin:0; padding-left:14px; font-size:12px; color:var(--cream);">
               ${r.packageItems && r.packageItems.length ? r.packageItems.map(i => `<li style="margin-bottom:3px;">${i}</li>`).join('') : `<li>No specific items selected (Standard/Generic)</li>`}
            </ul>
         </div>
         <div style="background:var(--bg3); padding:10px; border-radius:6px;">
            <div style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:var(--gold); margin-bottom:8px;">Required Ingredients</div>
            ${reqsHtml}
         </div>
       </div>
     `;
  });

  pendingList.innerHTML = html;
}

// ===== RENDER FORECAST =====
function renderForecast() {
  const upcoming = RESERVATIONS.filter(r => r.status === 'confirmed');
  
  // Precompute grand totals
  const grandTotalReq = {};
  upcoming.forEach(r => {
     const reqs = calculateEventIngredients(r);
     for (let k in reqs) {
        grandTotalReq[k] = (grandTotalReq[k] || 0) + reqs[k];
     }
  });

  const dynamicForecast = INVENTORY.map(inv => {
    const needed = grandTotalReq[inv.name] || 0;
    const available = inv.stock || 0;
    const minThreshold = inv.min || 0;
    
    const eventShortfall = Math.max(0, needed - available);
    const dangerPct = needed > 0 ? Math.min(100, (eventShortfall / needed) * 100) : 0;
    const isBelowMin = available < minThreshold;
    
    return {
      name: inv.name, needed, available, minThreshold, eventShortfall, pct: dangerPct, unit: inv.unit, isBelowMin
    };
  }).filter(f => f.needed > 0 || f.isBelowMin).sort((a,b) => b.pct - a.pct);

  const topForecasts = dynamicForecast.slice(0, 6);
  
  const fbEl = document.getElementById('forecast-bars');
  if (fbEl) {
    if (!topForecasts.length) {
      fbEl.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-dim);font-size:13px;">Sufficient stock for all upcoming events.</div>`;
    } else {
      let fhtml = '';
      topForecasts.forEach(f => {
        const isCritical = f.eventShortfall > 0;
        const barWidth = isCritical ? f.pct : 0;
        const barColor = f.pct > 70 ? 'var(--red)' : (f.pct > 30 ? 'var(--amber)' : 'var(--gold)');

        fhtml += `
        <div class="forecast-item" style="margin-bottom:18px; display:block;">
          <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
            <span style="font-size:13px;font-weight:600;color:var(--text);">${f.name}</span>
            <span style="font-size:12px;color:var(--text-dim);">Need ${f.needed} ${f.unit} &middot; Have ${f.available} ${f.unit}</span>
          </div>
          <div style="height:8px;background:rgba(196,154,60,0.1);border-radius:4px;overflow:hidden;">
            <div style="height:100%;width:${barWidth}%;background:${barColor};border-radius:4px;"></div>
          </div>
          ${isCritical ? `<div style="font-size:11px;color:${barColor};margin-top:4px;font-weight:600;">Shortfall: ${f.eventShortfall} ${f.unit}</div>` : `<div style="font-size:11px;color:var(--green);margin-top:4px;font-weight:600;">Sufficient Stock</div>`}
        </div>`;
      });
      fbEl.innerHTML = fhtml;
    }
  }

  const alertsEl = document.getElementById('dynamic-alerts');
  if (alertsEl) {
    const criticals = dynamicForecast.filter(f => f.eventShortfall > 0);
    const warnings = dynamicForecast.filter(f => f.isBelowMin && f.eventShortfall === 0);
    
    let html = '';
    criticals.forEach(c => {
      html += `<div class="alert-item critical" style="margin-bottom:8px;"><div class="alert-icon">🚨</div><div class="alert-text"><div class="alert-title">${c.name} — Critical Shortfall</div><div class="alert-sub">${c.available}${c.unit} available. Approved events require ${c.needed}${c.unit}. You lack <strong style="color:var(--red);">${c.eventShortfall}${c.unit}</strong> to fulfill obligations.</div></div><span class="alert-action">Restock</span></div>`;
    });
    warnings.forEach(w => {
      html += `<div class="alert-item low" style="margin-bottom:8px;"><div class="alert-icon">⚠️</div><div class="alert-text"><div class="alert-title">${w.name} — Low (But sufficient for events)</div><div class="alert-sub">${w.available}${w.unit} available. Fulfills current quota, but drops below minimum baseline (${w.minThreshold}${w.unit}).</div></div><span class="alert-action">Restock</span></div>`;
    });
    
    if (!html) html = `<div style="text-align:center;padding:20px;color:var(--text-dim);font-size:13px;">Inventory levels fully satisfy current bookings.</div>`;
    
    alertsEl.innerHTML = html;
  }
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

  document.getElementById('res-tbody').innerHTML = filtered.map(r => `
    <tr>
      <td>
        <div class="item-name">${r.client}</div>
        <div style="font-size:11px;color:var(--gold);margin-top:2px;">${r.packageName || r.type}</div>
      </td>
      <td style="font-size:12px;color:var(--text-mid);">${r.type}</td>
      <td style="font-size:12px;color:var(--text-mid);">${r.date}</td>
      <td style="font-size:13px;">${r.pax}</td>
      <td><div style="font-family:'Playfair Display',serif;font-size:14px;font-weight:600;color:var(--cream);">${r.amount}</div></td>
      <td><span class="badge ${r.status}">${r.status.charAt(0).toUpperCase()+r.status.slice(1)}</span></td>
      <td>
        ${r.status === 'pending'
          ? `<button class="btn-approve" onclick="updateReservationStatus('${r.id}','confirmed')">Approve</button>
             <button class="btn-reject"  onclick="updateReservationStatus('${r.id}','cancelled')">Reject</button>`
          : `<button class="btn-view">View</button>`}
      </td>
    </tr>`).join('');
}

function filterRes(filter, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderReservations(filter);
}

// ===== RENDER EVENTS =====
window.calendar = null;
function renderEvents() {
  const confirmed = RESERVATIONS.filter(r => r.status === 'confirmed');
  const eventsData = confirmed.map(ev => {
    return {
      id: ev.id,
      title: ev.client + ' — ' + (ev.packageName || ev.type),
      start: new Date(ev.date),
      allDay: true,
      extendedProps: { pax: ev.pax, amount: ev.amount }
    };
  });

  const calEl = document.getElementById('calendar');
  if (!calEl) return;

  if (!window.calendar) {
    window.calendar = new FullCalendar.Calendar(calEl, {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,listWeek'
      },
      height: 650,
      events: eventsData,
      eventClick: function(info) {
        openEventDetails(info.event.id);
      }
    });
    if (document.getElementById('section-events').classList.contains('active')) {
      window.calendar.render();
    }
  } else {
    window.calendar.removeAllEvents();
    window.calendar.addEventSource(eventsData);
  }
}

// ===== RENDER INSIGHTS =====
function renderInsights() {
  const topItems = [
    {name:'Chicken Dish',    count:38},
    {name:'Steamed Rice',    count:36},
    {name:'Unlimited Drinks',count:34},
    {name:'Pork Dish',       count:28},
    {name:'Pasta',           count:22},
  ];

  const ctxTop = document.getElementById('top-items-chart');
  if (ctxTop) {
    if (window.topItemsChartInst) window.topItemsChartInst.destroy();
    window.topItemsChartInst = new Chart(ctxTop, {
      type: 'bar',
      data: {
        labels: topItems.map(i => i.name),
        datasets: [{
          data: topItems.map(i => i.count),
          backgroundColor: '#c49a3c',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: 'y',
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ctx.raw + ' orders' } } },
        scales: {
          x: { display: false },
          y: { grid: { display: false }, ticks: { color: '#a89070', font: {family: "'DM Sans', sans-serif"} } }
        }
      }
    });
  }

  const types = [
    {name:'Birthday Party',    pct:38, color:'#c49a3c'},
    {name:'Wedding',           pct:28, color:'#7c6fcd'},
    {name:'Corporate',         pct:20, color:'#2d8a4e'},
    {name:'Family Gathering',  pct:14, color:'#d97706'},
  ];

  const ctxTypes = document.getElementById('event-types-chart');
  if (ctxTypes) {
    if (window.eventTypesChartInst) window.eventTypesChartInst.destroy();
    window.eventTypesChartInst = new Chart(ctxTypes, {
      type: 'doughnut',
      data: {
        labels: types.map(t => t.name),
        datasets: [{
          data: types.map(t => t.pct),
          backgroundColor: types.map(t => t.color),
          borderWidth: 0
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { color: '#e8dcc8', font: {family: "'DM Sans', sans-serif", size: 12} } },
          tooltip: { callbacks: { label: (ctx) => ' ' + ctx.raw + '%' } }
        },
        cutout: '70%'
      }
    });
  }
}
// ===== ADMIN CHAT SUPPORT LOGIC (Shared with Staff) =====
let activeCustomerId = null;
let activeChatUnsub = null;
let conversationsUnsub = null;

function initAdminChat() {
  if (conversationsUnsub) return; // already listening
  
  const { collection, onSnapshot, query, orderBy } = window.firebaseFns;
  const q = query(collection(window.firebaseDB, 'messages'), orderBy('timestamp', 'desc'));
  
  conversationsUnsub = onSnapshot(q, (snap) => {
    const convoMap = new Map();
    snap.forEach(doc => {
      const msg = doc.data();
      if (!convoMap.has(msg.uid)) {
        convoMap.set(msg.uid, {
          uid: msg.uid,
          name: msg.userName,
          email: msg.userEmail,
          lastMsg: msg.text,
          time: msg.timestamp,
          hasNew: msg.sender === 'customer'
        });
      }
    });

    renderChatInbox(Array.from(convoMap.values()));
    
    // Global notification dot logic
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
        <div class="ii-name">
          ${c.name} 
          ${c.hasNew ? '<span class="ii-dot"></span>' : ''}
        </div>
        <div class="ii-msg">${c.lastMsg}</div>
        <div class="ii-time">${timeStr}</div>
      </div>
    `;
  }).join('');
}

async function openConversation(uid, name) {
  activeCustomerId = uid;
  document.querySelector('.ach-name').textContent = name;
  document.querySelector('.ach-status').textContent = 'Direct Support Channel';
  document.getElementById('admin-chat-input-row').style.display = 'flex';
  
  renderChatInbox([]); // refresh list to show active

  if (activeChatUnsub) activeChatUnsub();

  const { collection, query, where, orderBy, onSnapshot } = window.firebaseFns;
  const q = query(
    collection(window.firebaseDB, 'messages'),
    where('uid', '==', uid),
    orderBy('timestamp', 'asc')
  );

  activeChatUnsub = onSnapshot(q, (snap) => {
    const box = document.getElementById('admin-chat-box');
    box.innerHTML = '';
    
    snap.forEach(doc => {
      const msg = doc.data();
      const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${msg.sender}`;
      bubble.innerHTML = `
        <div class="chat-text">${msg.text}</div>
        <div class="chat-time">${time}</div>
      `;
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
      text: text,
      sender: 'staff',
      timestamp: Date.now()
    });
    input.value = '';
  } catch (err) {
    console.error('Send error:', err);
  }
}
window.sendAdminMsg = sendAdminMsg;

// ===== INIT — wait for Firebase to be ready, then load =====
// Firebase SDK loads as a module so we wait briefly for window.firebaseFns to be available
function waitForFirebase(attempts = 0) {
  if (window.firebaseFns && window.firebaseDB) {
    loadData();
    initAdminChat();
  } else if (attempts < 20) {
    setTimeout(() => waitForFirebase(attempts + 1), 150);
  } else {
    console.error('Firebase did not initialize in time.');
    // Fallback: render empty states so the page doesn't just break
    renderForecast();
    renderInsights();
  }
}

waitForFirebase();
