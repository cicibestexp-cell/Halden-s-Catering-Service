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

// ===== DATA =====
const INVENTORY = [
  {name:'Chicken',     cat:'Protein',   stock:8,   unit:'kg', min:30, status:'critical'},
  {name:'Pork',        cat:'Protein',   stock:25,  unit:'kg', min:20, status:'ok'},
  {name:'Beef',        cat:'Protein',   stock:15,  unit:'kg', min:15, status:'ok'},
  {name:'Fish',        cat:'Protein',   stock:18,  unit:'kg', min:12, status:'ok'},
  {name:'Steamed Rice',cat:'Staple',    stock:20,  unit:'kg', min:30, status:'low'},
  {name:'Pasta',       cat:'Staple',    stock:12,  unit:'kg', min:8,  status:'ok'},
  {name:'Vegetables',  cat:'Produce',   stock:22,  unit:'kg', min:15, status:'ok'},
  {name:'Cooking Oil', cat:'Pantry',    stock:8,   unit:'L',  min:6,  status:'ok'},
  {name:'Flour',       cat:'Pantry',    stock:10,  unit:'kg', min:5,  status:'ok'},
  {name:'Soft Drinks', cat:'Beverages', stock:120, unit:'pcs',min:80, status:'ok'},
];

const RESERVATIONS = [
  {client:'Santos Family',     type:'Kiddie Party',      date:'Mar 17, 2026', pax:80,  amount:'₱85,000',  status:'confirmed'},
  {client:'Reyes Wedding',     type:'Wedding Reception', date:'Mar 19, 2026', pax:150, amount:'₱120,000', status:'confirmed'},
  {client:'Cruz Corporate',    type:'Corporate Lunch',   date:'Mar 21, 2026', pax:60,  amount:'₱42,000',  status:'pending'},
  {client:'Dela Cruz Family',  type:'Birthday Party',    date:'Mar 24, 2026', pax:50,  amount:'₱35,000',  status:'pending'},
  {client:'Mendoza Reunion',   type:'Family Gathering',  date:'Mar 27, 2026', pax:40,  amount:'₱28,000',  status:'pending'},
  {client:'Garcia Wedding',    type:'Wedding Reception', date:'Apr 2, 2026',  pax:120, amount:'₱95,000',  status:'confirmed'},
  {client:'Lim Birthday',      type:'Birthday Party',    date:'Apr 5, 2026',  pax:30,  amount:'₱22,000',  status:'confirmed'},
  {client:'Tan Corporate',     type:'Corporate Dinner',  date:'Apr 8, 2026',  pax:80,  amount:'₱58,000',  status:'cancelled'},
];

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

// ===== RENDER DASHBOARD =====
function renderDashboard() {
  // Upcoming reservations
  const upcoming = RESERVATIONS.filter(r => r.status === 'confirmed').slice(0, 3);
  document.getElementById('dash-reservations').innerHTML = upcoming.map(r => {
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
  }).join('');

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
        <td><span class="badge ${item.status}">${item.status==='ok'?'✓ OK':item.status==='low'?'⚠ Low':'🚨 Critical'}</span></td>
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
function renderReservations(filter = 'all') {
  const filtered = filter === 'all' ? RESERVATIONS : RESERVATIONS.filter(r => r.status === filter);
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
          ? `<button class="btn-approve">Approve</button><button class="btn-reject">Reject</button>`
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
  document.getElementById('events-body').innerHTML = confirmed.map(ev => {
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
  }).join('');
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

// ===== INIT =====
renderDashboard();
renderInventory();
renderForecast();
renderReservations();
renderEvents();
renderInsights();
