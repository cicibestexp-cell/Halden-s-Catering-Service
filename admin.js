// ===== AUTH GUARD =====
function checkAuth() {
  const logged = sessionStorage.getItem('halden_admin');
  if (!logged) { window.location.href = 'index.html'; return; }
  try {
    const u = JSON.parse(logged);
    document.getElementById('admin-name').textContent = u.name || 'Administrator';
  } catch(e) {}
}

function adminLogout() {
  sessionStorage.removeItem('halden_admin');
  window.location.href = 'index.html';
}

checkAuth();

// Set today's date in dashboard header
document.getElementById('dash-date').textContent =
  "Here's what's happening with Halden's today — " +
  new Date().toLocaleDateString('en-US', {weekday:'long', year:'numeric', month:'long', day:'numeric'});

// ===== NAVIGATION =====
function showSection(name, el) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById('section-' + name).classList.add('active');
  if (el) el.classList.add('active');
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
  document.getElementById('inv-tbody').innerHTML = `
    <tr><td colspan="4" style="text-align:center;padding:24px;color:var(--text-dim);">
      Loading inventory...
    </td></tr>`;
  document.getElementById('res-tbody').innerHTML = `
    <tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-dim);">
      Loading reservations...
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

    // Render everything with live data
    renderDashboard();
    renderInventory();
    renderForecast();
    renderReservations();
    renderEvents();
    renderInsights();

  } catch(err) {
    console.error('Firestore load error:', err);
    document.getElementById('inv-tbody').innerHTML = `
      <tr><td colspan="4" style="text-align:center;padding:24px;color:var(--red);">
        ⚠ Failed to load inventory. Check your Firebase connection.
      </td></tr>`;
    document.getElementById('res-tbody').innerHTML = `
      <tr><td colspan="7" style="text-align:center;padding:24px;color:var(--red);">
        ⚠ Failed to load reservations. Check your Firebase connection.
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
    renderDashboard();
  } catch(err) {
    alert('Failed to update stock. Please try again.');
    console.error(err);
  }
}

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
          <div class="res-details"><span>👥 ${r.pax} pax</span><span>🎉 ${r.type}</span></div>
        </div>
        <div class="res-right">
          <div class="res-price">${r.amount}</div>
          <span class="badge ${r.status}">${r.status.charAt(0).toUpperCase()+r.status.slice(1)}</span>
        </div>
      </div>`;
  }).join('') : `<div style="text-align:center;padding:20px;color:var(--text-dim);font-size:13px;">No upcoming confirmed reservations.</div>`;

  // Booking chart
  document.getElementById('booking-chart').innerHTML = CHART_WEEKS.map(w => `
    <div class="chart-bar-wrap">
      <div class="chart-bar ${w.highlight?'highlight':''}" style="height:${w.pct}%"></div>
      <div class="chart-lbl">${w.label}</div>
    </div>`).join('');

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

// ===== RENDER FORECAST =====
function renderForecast() {
  document.getElementById('forecast-bars').innerHTML = FORECAST.map(f => `
    <div class="forecast-item">
      <div class="forecast-name">${f.name}</div>
      <div class="forecast-bar-wrap"><div class="forecast-bar" style="width:${f.pct}%"></div></div>
      <div class="forecast-qty">${f.needed} ${f.unit}</div>
      ${f.pct >= 80 ? '<div class="forecast-alert">RESTOCK</div>' : ''}
    </div>`).join('');
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
      <td><div class="item-name">${r.client}</div></td>
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
function renderEvents() {
  const confirmed = RESERVATIONS.filter(r => r.status === 'confirmed');
  document.getElementById('events-body').innerHTML = confirmed.length ? confirmed.map(ev => {
    const parts = ev.date.split(' ');
    return `
      <div style="display:flex;gap:16px;align-items:flex-start;padding:16px 0;border-bottom:1px solid rgba(196,154,60,0.06);">
        <div class="res-date-box">
          <div class="res-date-day">${parts[1].replace(',','')}</div>
          <div class="res-date-mon">${parts[0]}</div>
        </div>
        <div style="flex:1;">
          <div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:4px;">${ev.client} — ${ev.type}</div>
          <div style="font-size:12px;color:var(--text-dim);margin-bottom:10px;">${ev.pax} guests · ${ev.amount}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <span class="prep-tag done">✓ Reservation Confirmed</span>
            <span class="prep-tag done">✓ Payment Received</span>
            <span class="prep-tag pending">⏳ Ingredient Prep</span>
            <span class="prep-tag todo">◯ Equipment Setup</span>
          </div>
        </div>
      </div>`;
  }).join('') : `<div style="text-align:center;padding:24px;color:var(--text-dim);font-size:13px;">No confirmed events yet.</div>`;
}

// ===== RENDER INSIGHTS =====
function renderInsights() {
  const topItems = [
    {name:'Chicken Dish',    count:38, pct:90},
    {name:'Steamed Rice',    count:36, pct:86},
    {name:'Unlimited Drinks',count:34, pct:81},
    {name:'Pork Dish',       count:28, pct:67},
    {name:'Pasta',           count:22, pct:52},
  ];
  document.getElementById('top-items').innerHTML = topItems.map(i => `
    <div style="margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
        <span style="font-size:13px;font-weight:500;color:var(--text);">${i.name}</span>
        <span style="font-size:12px;color:var(--text-dim);">${i.count} orders</span>
      </div>
      <div style="height:5px;background:rgba(196,154,60,0.08);border-radius:3px;">
        <div style="height:100%;width:${i.pct}%;background:linear-gradient(to right,#8a6820,#c49a3c);border-radius:3px;"></div>
      </div>
    </div>`).join('');

  const types = [
    {name:'Birthday Party',    pct:38, color:'#c49a3c'},
    {name:'Wedding',           pct:28, color:'#7c6fcd'},
    {name:'Corporate',         pct:20, color:'#2d8a4e'},
    {name:'Family Gathering',  pct:14, color:'#d97706'},
  ];
  document.getElementById('event-types').innerHTML = types.map(t => `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
      <div style="width:10px;height:10px;border-radius:50%;background:${t.color};flex-shrink:0;"></div>
      <div style="flex:1;font-size:13px;color:var(--text);">${t.name}</div>
      <div style="font-size:13px;font-weight:600;color:var(--text-mid);">${t.pct}%</div>
      <div style="width:80px;height:5px;background:rgba(196,154,60,0.08);border-radius:3px;">
        <div style="height:100%;width:${t.pct}%;background:${t.color};border-radius:3px;opacity:0.8;"></div>
      </div>
    </div>`).join('');
}

// ===== INIT — wait for Firebase to be ready, then load =====
// Firebase SDK loads as a module so we wait briefly for window.firebaseFns to be available
function waitForFirebase(attempts = 0) {
  if (window.firebaseFns && window.firebaseDB) {
    loadData();
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
