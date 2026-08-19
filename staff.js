// GLOBAL DATA
let RESERVATIONS = [];
let ANNOUNCEMENTS = [];
let ACTIVITY_LOG = [];
let USERS = [];
let LAST_SYNCED = null;

function checkAuth() {
  const logged = sessionStorage.getItem('halden_staff');
  if (!logged) {
    window.location.href = 'index.html';
    return;
  }
  try {
    const u = JSON.parse(logged);
    const nameEl = document.getElementById('admin-name');
    if (nameEl) nameEl.textContent = u.name || 'Staff Member';
  } catch (e) { }
}

function adminLogout() {
  sessionStorage.removeItem('halden_staff');
  window.location.href = 'index.html';
}

// ===== NAVIGATION =====
function showSection(id, btn) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  // Show target section
  const target = document.getElementById('section-' + id);
  if (target) target.classList.add('active');

  // Update sidebar active state
  if (btn) {
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
    btn.classList.add('active');
  }

  // Section-specific triggers
  if (id === 'dashboard') renderStaffDashboard();
  if (id === 'execution-day') renderStaffExecutionDay();
  if (id === 'payroll') renderPayroll();
}

// ===== LOAD FROM FIRESTORE =====
async function loadData() {
  const list = document.getElementById('staff-assigned-list');
  if (list) list.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text-dim);">Loading assignments...</div>`;

  try {
    const { collection, getDocs } = window.firebaseFns;
    const db = window.firebaseDB;

    // Load reservations
    const resSnap = await getDocs(collection(db, 'reservations'));
    RESERVATIONS = resSnap.docs.map(d => {
      const data = d.data();
      return { id: d.id, ...data, amount: '₱' + Number(data.amount || 0).toLocaleString() };
    });

    // Load users (for ID -> Name mapping)
    try {
      const { query, where } = window.firebaseFns;
      const usersSnap = await getDocs(query(collection(db, 'users'), where('role', '!=', 'customer')));
      USERS = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch(e) { console.error('Error loading users:', e); USERS = []; }

    // Load announcements
    try {
      const annSnap = await getDocs(collection(db, 'announcements'));
      ANNOUNCEMENTS = annSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      ANNOUNCEMENTS.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } catch(e) { ANNOUNCEMENTS = []; }

    // Load activity log from localStorage
    try {
      const stored = localStorage.getItem('halden_staff_activity');
      ACTIVITY_LOG = stored ? JSON.parse(stored) : [];
    } catch(e) { ACTIVITY_LOG = []; }

    LAST_SYNCED = new Date();
    updateLastSynced();

    renderStaffDashboard();
    renderStaffExecutionDay();

  } catch(err) {
    console.error('Firestore load error:', err);
    if (list) list.innerHTML = `<div style="text-align:center;padding:24px;color:var(--red);"> Failed to load data.</div>`;
  }
}

function updateLastSynced() {
  const el = document.getElementById('staff-last-synced');
  if (!el || !LAST_SYNCED) return;
  const t = LAST_SYNCED;
  el.textContent = ' Last synced: ' + t.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}

function logActivity(msg) {
  ACTIVITY_LOG.unshift({ msg, time: new Date().toISOString() });
  if (ACTIVITY_LOG.length > 20) ACTIVITY_LOG.pop();
  try { localStorage.setItem('halden_staff_activity', JSON.stringify(ACTIVITY_LOG)); } catch(e){}
}

// ===== STAFF DASHBOARD LOGIC =====
function getStaffAssigned(staffId, staffName, staffEmail) {
  return RESERVATIONS.filter(res => {
    if (res.staffIds && Array.isArray(res.staffIds)) {
       if (staffId && res.staffIds.includes(staffId)) return true;
       if (res.staffIds.some(sid => sid && sid.toLowerCase() === staffName)) return true;
       if (res.staffIds.some(sid => sid && sid.toLowerCase() === staffEmail)) return true;
    }
    if (!res.executionPlan || !res.executionPlan.phases) return false;
    return res.executionPlan.phases.some(p =>
      p.tasks && p.tasks.some(t => {
        const ids = (t.staffIds || []).filter(id => id).map(id => id.toLowerCase());
        return (staffId && ids.includes(staffId.toLowerCase())) ||
               (staffName && ids.includes(staffName)) ||
               (staffEmail && ids.includes(staffEmail));
      })
    );
  });
}

function renderStaffDashboard() {
  const logged = sessionStorage.getItem('halden_staff');
  if (!logged) return;
  const staff = JSON.parse(logged);
  const staffId = staff.id || "";
  const staffName = (staff.name || "").toLowerCase();
  const staffEmail = (staff.email || "").toLowerCase();

  const assigned = getStaffAssigned(staffId, staffName, staffEmail);

  // Analytics
  const evVal = document.getElementById('staff-stat-events');
  if (evVal) evVal.textContent = assigned.length;
  const dayVal = document.getElementById('staff-stat-days');
  if (dayVal) dayVal.textContent = new Set(assigned.map(r => r.date)).size;
  const taskVal = document.getElementById('staff-stat-tasks');
  if (taskVal) {
    let c = 0;
    assigned.forEach(res => (res.executionPlan?.phases || []).forEach(p =>
      (p.tasks || []).forEach(t => {
        const ids = (t.staffIds || []).filter(Boolean).map(x => x.toLowerCase());
        if (((staffId && ids.includes(staffId.toLowerCase())) || ids.includes(staffName) || ids.includes(staffEmail)) && t.status === 'done') c++;
      })
    ));
    taskVal.textContent = c;
  }

  // --- Shift Reminder Banner ---
  const shiftBanner = document.getElementById('staff-shift-banner');
  if (shiftBanner) {
    const upcoming = assigned
      .filter(r => r.date)
      .map(r => ({ ...r, diff: Math.ceil((new Date(r.date + 'T00:00:00') - new Date().setHours(0,0,0,0)) / 86400000) }))
      .filter(r => r.diff >= 0)
      .sort((a, b) => a.diff - b.diff);
    if (upcoming.length > 0) {
      const next = upcoming[0];
      const label = next.diff === 0 ? ' TODAY' : next.diff === 1 ? ' TOMORROW' : ` IN ${next.diff} DAYS`;
      shiftBanner.style.display = 'flex';
      shiftBanner.innerHTML = `
        <div style="font-size:18px;"></div>
        <div style="flex:1;">
          <div style="font-size:12px; font-weight:800; color:var(--gold); text-transform:uppercase; letter-spacing:1px; margin-bottom:2px;">Next Shift</div>
          <div style="font-size:15px; font-weight:700; color:var(--cream);">${next.client}'s Event &mdash; ${next.date}</div>
        </div>
        <div style="background:rgba(212,175,55,0.15); border:1px solid var(--gold); color:var(--gold); padding:6px 14px; border-radius:20px; font-size:11px; font-weight:800;">${label}</div>
      `;
    } else {
      shiftBanner.style.display = 'none';
    }
  }

  // --- Assigned List ---
  const list = document.getElementById('staff-assigned-list');
  if (!list) return;
  if (assigned.length === 0) {
    list.innerHTML = `<div style="text-align:center;padding:60px;color:var(--text-dim);"><div style="font-size:40px;margin-bottom:15px;"></div><div>No active assignments found.</div></div>`;
  } else {
    list.innerHTML = assigned.map(res => {
      const diff = res.date ? Math.ceil((new Date(res.date+'T00:00:00') - new Date().setHours(0,0,0,0)) / 86400000) : null;
      const status = diff === null ? '' : diff < 0 ? '<span style="background:rgba(34,197,94,0.15);color:var(--green);padding:2px 8px;border-radius:10px;font-size:10px;font-weight:800;">✓ DONE</span>' :
        diff === 0 ? '<span style="background:rgba(239,68,68,0.15);color:var(--red);padding:2px 8px;border-radius:10px;font-size:10px;font-weight:800;">● TODAY</span>' :
        `<span style="background:rgba(212,175,55,0.1);color:var(--gold);padding:2px 8px;border-radius:10px;font-size:10px;font-weight:800;">${diff}d away</span>`;
      return `<div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <span style="font-size:15px;font-weight:700;color:var(--gold);">${res.client}</span>${status}
          </div>
          <div style="font-size:12px;color:var(--text-dim);">${res.packageName||res.type} &middot; ${res.date} &middot; ${res.pax} pax</div>
        </div>
        <button onclick="viewStaffExecutionStrategy('${res.id}')" style="background:var(--bg3);border:1px solid var(--border);color:var(--gold);padding:8px 14px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">View Plan</button>
      </div>`;
    }).join('');
  }

  // --- Announcements Board ---
  const annEl = document.getElementById('staff-announcements');
  if (annEl) {
    if (ANNOUNCEMENTS.length === 0) {
      annEl.innerHTML = `<div style="padding:20px;color:var(--text-dim);font-size:13px;text-align:center;">No announcements from management.</div>`;
    } else {
      annEl.innerHTML = ANNOUNCEMENTS.slice(0, 5).map(a => `
        <div style="padding:14px 18px;border-bottom:1px solid var(--border);">
          <div style="font-size:13px;color:var(--cream);font-weight:600;margin-bottom:4px;">${a.message || a.text || ''}</div>
          <div style="font-size:11px;color:var(--text-dim);">${a.author ? 'From: ' + a.author + ' &middot; ' : ''}${a.createdAt ? new Date(a.createdAt.toDate ? a.createdAt.toDate() : a.createdAt).toLocaleDateString() : ''}</div>
        </div>
      `).join('');
    }
  }

  // --- Recent Activity Feed ---
  const actEl = document.getElementById('staff-activity-feed');
  if (actEl) {
    if (ACTIVITY_LOG.length === 0) {
      actEl.innerHTML = `<div style="padding:20px;color:var(--text-dim);font-size:13px;text-align:center;">No recent activity yet.</div>`;
    } else {
      actEl.innerHTML = ACTIVITY_LOG.slice(0, 8).map(a => `
        <div style="padding:10px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px;">
          <div style="width:6px;height:6px;border-radius:50%;background:var(--green);flex-shrink:0;"></div>
          <div style="flex:1;">
            <div style="font-size:13px;color:var(--cream);">${a.msg}</div>
            <div style="font-size:11px;color:var(--text-dim);">${new Date(a.time).toLocaleString([], {month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</div>
          </div>
        </div>
      `).join('');
    }
  }
}

// ===== STAFF EXECUTION DAY LOGIC =====
let activeStaffExecutionResId = null;

function renderStaffExecutionDay() {
  const logged = sessionStorage.getItem('halden_staff');
  if (!logged) return;
  const staff = JSON.parse(logged);
  const staffId = staff.id || "";
  const staffName = (staff.name || "").toLowerCase();
  const staffEmail = (staff.email || "").toLowerCase();

  const container = document.getElementById('staff-execution-list');
  if (!container) return;

  // Filter reservations where current staff is assigned
  const assigned = RESERVATIONS.filter(res => {
    if (res.staffIds && Array.isArray(res.staffIds)) {
       if (staffId && res.staffIds.includes(staffId)) return true;
       if (res.staffIds.some(sid => sid && sid.toLowerCase() === staffName)) return true;
       if (res.staffIds.some(sid => sid && sid.toLowerCase() === staffEmail)) return true;
    }
    if (!res.executionPlan || !res.executionPlan.phases) return false;
    return res.executionPlan.phases.some(p => 
      p.tasks && p.tasks.some(t => {
        const ids = (t.staffIds || []).filter(id => id).map(id => id.toLowerCase());
        return (staffId && ids.includes(staffId.toLowerCase())) || 
               (staffName && ids.includes(staffName)) || 
               (staffEmail && ids.includes(staffEmail));
      })
    );
  });

  if (assigned.length === 0) {
    container.innerHTML = '<div style="padding:20px; color:var(--text-dim); font-size:12px; text-align:center;">No assigned events found.</div>';
    return;
  }

  container.innerHTML = assigned.map(res => {
    const isActive = activeStaffExecutionResId === res.id;
    return `
      <div onclick="selectStaffExecutionEvent('${res.id}')" 
           style="padding:15px 20px; cursor:pointer; border-bottom:1px solid var(--border); transition:all 0.2s;
                  ${isActive ? 'background:rgba(212,175,55,0.1); border-left:4px solid var(--gold);' : 'border-left:4px solid transparent;'}">
        <div style="font-weight:700; color:${isActive ? 'var(--gold)' : 'var(--cream)'}; font-size:14px; margin-bottom:4px;">${res.client}</div>
        <div style="font-size:11px; color:var(--text-dim);">${res.type} &middot; ${res.date}</div>
      </div>
    `;
  }).join('');

  if (activeStaffExecutionResId) renderStaffExecutionDetail();
}

function selectStaffExecutionEvent(id) {
  activeStaffExecutionResId = id;
  renderStaffExecutionDay();
}

function renderStaffExecutionDetail() {
  const res = RESERVATIONS.find(r => r.id === activeStaffExecutionResId);
  const emptyView = document.getElementById('staff-execution-detail-empty');
  const detailView = document.getElementById('staff-execution-detail-view');
  if (!res) { emptyView.style.display='flex'; detailView.style.display='none'; return; }
  emptyView.style.display = 'none';
  detailView.style.display = 'flex';

  // Event status
  let daysDiff = null;
  if (res.date) {
    const today = new Date(); today.setHours(0,0,0,0);
    daysDiff = Math.ceil((new Date(res.date+'T00:00:00') - today) / 86400000);
  }
  const statusLabel = daysDiff === null ? {txt:'Unknown', color:'var(--text-dim)', bg:'rgba(255,255,255,0.05)'} :
    daysDiff < 0  ? {txt:'✓ Completed', color:'var(--green)', bg:'rgba(34,197,94,0.1)'} :
    daysDiff === 0 ? {txt:'● In Progress', color:'var(--red)', bg:'rgba(239,68,68,0.1)'} :
    {txt:` Upcoming · ${daysDiff}d`, color:'var(--gold)', bg:'rgba(212,175,55,0.1)'};

  // Co-staff list (excluding current staff)
  const logged = JSON.parse(sessionStorage.getItem('halden_staff') || '{}');
  const myId = logged.id || "";
  const coStaff = (res.staffIds || []).filter(sid => sid && sid !== myId);

  // Contact info from executionPlan or reservation
  const coordinator = res.coordinator || res.executionPlan?.coordinator || null;
  const contactName = coordinator?.name || res.contactName || null;
  const contactPhone = coordinator?.phone || res.contactPhone || null;

  // Notes / special instructions
  const notes = res.executionPlan?.notes || res.specialNotes || res.notes || null;

  detailView.innerHTML = `
    <div style="padding:28px; border-bottom:1px solid var(--border); background:rgba(255,255,255,0.01);">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px;">
        <div>
          <h2 style="font-family:'Arial';font-size:26px;color:var(--gold);margin-bottom:4px;">${res.client}'s Event</h2>
          <p style="font-size:13px;color:var(--text-dim);">${res.packageName||res.type} &mdash; ${res.date}</p>
        </div>
        <div style="text-align:right;">
          <div style="background:${statusLabel.bg};color:${statusLabel.color};padding:6px 14px;border-radius:20px;font-size:12px;font-weight:800;margin-bottom:8px;">${statusLabel.txt}</div>
          ${daysDiff !== null && daysDiff >= 0 ? `<div style="font-size:28px;font-weight:700;color:var(--cream);">${daysDiff}</div><div style="font-size:11px;color:var(--text-dim);">days away</div>` : ''}
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:14px;background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:18px;margin-bottom:16px;">
        <div><div style="font-size:10px;font-weight:800;color:var(--gold);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Venue</div><div style="font-size:13px;color:var(--cream);">${res.venue||'—'}</div></div>
        <div><div style="font-size:10px;font-weight:800;color:var(--gold);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Time</div><div style="font-size:13px;color:var(--cream);">${res.timeRange||'—'}</div></div>
        <div><div style="font-size:10px;font-weight:800;color:var(--gold);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Pax</div><div style="font-size:13px;color:var(--cream);">${res.pax||'—'}</div></div>
        <div><div style="font-size:10px;font-weight:800;color:var(--gold);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Type</div><div style="font-size:13px;color:var(--cream);">${res.type||'—'}</div></div>
      </div>

      ${notes ? `
        <div style="background:rgba(217,119,6,0.08);border:1px solid rgba(217,119,6,0.3);border-radius:10px;padding:14px 18px;margin-bottom:16px;">
          <div style="font-size:10px;font-weight:800;color:var(--amber);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;"> Special Instructions</div>
          <div style="font-size:13px;color:var(--cream);line-height:1.6;">${notes}</div>
        </div>` : ''}

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
        ${contactName || contactPhone ? `
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:14px 18px;">
          <div style="font-size:10px;font-weight:800;color:var(--gold);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;"> Contact</div>
          <div style="font-size:13px;font-weight:700;color:var(--cream);margin-bottom:2px;">${contactName||'—'}</div>
          ${contactPhone ? `<a href="tel:${contactPhone}" style="font-size:12px;color:var(--gold);text-decoration:none;">${contactPhone}</a>` : ''}
        </div>` : ''}
        ${coStaff.length > 0 ? `
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:14px 18px;">
          <div style="font-size:10px;font-weight:800;color:var(--gold);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;"> Co-Staff</div>
          <div style="display:flex;flex-direction:column;gap:4px;">${coStaff.map(s=>{
            const u = USERS.find(u => u.id === s);
            return `<div style="font-size:12px;color:var(--cream);">· ${u ? u.name : s}</div>`;
          }).join('')}</div>
        </div>` : ''}
      </div>
    </div>

    <div style="flex:1;padding:28px;overflow-y:auto;background:rgba(0,0,0,0.1);">
      <button onclick="startStaffExecutionDay('${res.id}')" 
              style="width:100%;background:var(--green);color:#fff;border:none;padding:18px;border-radius:12px;font-weight:700;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:all 0.2s;"
              onmouseover="this.style.filter='brightness(1.1)'" onmouseout="this.style.filter='none'">
        <span></span> Start Execution Day
      </button>
      <p style="text-align:center;font-size:11px;color:var(--text-dim);margin-top:12px;">This will open your real-time task dashboard.</p>
    </div>
  `;
}

// ===== STAFF EXECUTION LIVE VIEW =====
let activeStaffLivePhaseIdx = 0;

function startStaffExecutionDay(resId) {
  activeStaffExecutionResId = resId;
  activeStaffLivePhaseIdx = 0;
  showSection('execution-live');
  renderStaffExecutionLive();
}

function selectStaffLivePhase(idx) {
  activeStaffLivePhaseIdx = idx;
  renderStaffExecutionLive();
}

function renderStaffExecutionLive() {
  const res = RESERVATIONS.find(r => r.id === activeStaffExecutionResId);
  if (!res || !res.executionPlan) return;

  const container = document.getElementById('staff-execution-live-container');
  if (!container) return;

  const staffData = JSON.parse(sessionStorage.getItem('halden_staff') || '{}');
  const staffId = staffData.id || "";
  const staffName = (staffData.name || "").toLowerCase();
  const staffEmail = (staffData.email || "").toLowerCase();

  const p = res.executionPlan.phases[activeStaffLivePhaseIdx];
  if (!p) return;

  const colors = {departure:'var(--gold)', deployment:'#5b9bd5', execution:'var(--green)', bashout:'var(--red)', restorage:'#a855f7'};
  const accent = colors[p.id] || 'var(--gold)';

  // Filter tasks for this staff member
  const myTasks = (p.tasks || []).filter(t => {
     const ids = (t.staffIds || []).filter(id => id).map(id => id.toLowerCase());
     return (staffId && ids.includes(staffId.toLowerCase())) || 
            (staffName && ids.includes(staffName)) || 
            (staffEmail && ids.includes(staffEmail));
  });

  let html = `
    <div style="background:var(--bg2); border-bottom:1px solid var(--border); padding:16px 24px; display:flex; justify-content:space-between; align-items:center;">
       <div style="display:flex; align-items:center; gap:16px;">
          <button onclick="showSection('execution-day')" style="background:none; border:none; color:var(--text-dim); cursor:pointer; font-size:20px;">←</button>
          <div>
             <div style="font-size:11px; font-weight:800; color:var(--gold); text-transform:uppercase; letter-spacing:1px; margin-bottom:2px;">Live Execution</div>
             <div style="font-size:18px; font-weight:700; color:var(--cream);">${res.client}'s Event</div>
          </div>
       </div>
       <div style="text-align:right;">
          <div style="font-size:10px; color:var(--text-dim); text-transform:uppercase; font-weight:800;">Status</div>
          <div style="font-size:14px; font-weight:700; color:var(--green);">● SYSTEM LIVE</div>
       </div>
    </div>

    <div style="flex:1; display:grid; grid-template-columns: 1fr 350px; overflow:hidden;">
       <div style="padding:40px; overflow-y:auto; background:var(--bg);">
          <div style="max-width:800px; margin:0 auto;">
             <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:30px;">
                <div>
                   <h2 style="font-size:32px; font-family:'Arial'; color:var(--cream); margin-bottom:8px;">${p.name} Phase</h2>
                   <div style="font-size:14px; color:var(--text-dim);">My assigned logistical responsibilities for this period.</div>
                </div>
                <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:12px; padding:12px 20px; text-align:center;">
                   <div style="font-size:10px; color:var(--text-dim); text-transform:uppercase; font-weight:800; margin-bottom:4px;">Window</div>
                   <div style="font-size:16px; font-weight:700; color:var(--gold);">${p.start} — ${p.end}</div>
                </div>
             </div>

             <div style="display:flex; flex-direction:column; gap:15px;">
                ${myTasks.length === 0 ? `
                   <div style="padding:60px; text-align:center; background:rgba(255,255,255,0.02); border:1px dashed var(--border); border-radius:16px;">
                      <div style="font-size:32px; margin-bottom:15px; opacity:0.3;"></div>
                      <div style="color:var(--text-dim);">No specific tasks assigned to you for this phase.</div>
                      <div style="font-size:12px; color:var(--gold); margin-top:8px;">Supporting team as general backup.</div>
                   </div>
                ` : myTasks.map((t, idx) => {
                   const tIdx = p.tasks.indexOf(t);
                   const isDone = t.status === 'done';
                   
                   let extraHtml = '';
                   if (t.text === 'Count equipment') {
                     if (res.equipmentManifest && res.equipmentManifest.length > 0) {
                       const checks = p.equipmentChecks || {};
                       const listHtml = res.equipmentManifest.map(eq => {
                         const safeId = (eq.assetId || eq.name).replace(/[^a-zA-Z0-9]/g, '-');
                         const chk = checks[safeId] || { condition: 'fine', status: 'present' };
                         return `
                           <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.2); padding:10px 15px; border-radius:8px; margin-bottom:8px;" onclick="event.stopPropagation()">
                             <div style="flex:1;">
                               <div style="font-size:13px; font-weight:700; color:var(--cream);">${eq.name}</div>
                               <div style="font-size:10px; color:var(--text-dim);">Expected: ${eq.assignedQty !== undefined ? eq.assignedQty : eq.assignQty || 0} unit(s)</div>
                             </div>
                             <div style="display:flex; gap:10px; align-items:center;">
                               <button style="background:none; border:1.5px solid var(--border); color:var(--gold); border-radius:6px; width:34px; height:34px; display:flex; align-items:center; justify-content:center; cursor:pointer;" title="Upload Evidence">📸</button>
                               <select id="eq-chk-cond-${activeStaffLivePhaseIdx}-${safeId}" style="background:var(--bg); border:1px solid var(--border); color:var(--cream); font-size:11px; padding:6px; border-radius:6px; cursor:pointer;">
                                 <option value="fine" ${chk.condition==='fine'?'selected':''}>Fine</option>
                                 <option value="broken" ${chk.condition==='broken'?'selected':''}>Broken</option>
                               </select>
                               <select id="eq-chk-stat-${activeStaffLivePhaseIdx}-${safeId}" style="background:var(--bg); border:1px solid var(--border); color:var(--cream); font-size:11px; padding:6px; border-radius:6px; cursor:pointer;">
                                 <option value="present" ${chk.status==='present'?'selected':''}>Present</option>
                                 <option value="missing" ${chk.status==='missing'?'selected':''}>Missing</option>
                               </select>
                             </div>
                           </div>
                         `;
                       }).join('');

                       extraHtml = `
                         <div style="margin-top:20px; padding-top:20px; border-top:1px dashed var(--border); width:100%;" onclick="event.stopPropagation()">
                           <div style="font-size:11px; color:var(--gold); font-weight:800; text-transform:uppercase; margin-bottom:12px;">Equipment Condition Checklist</div>
                           <div style="max-height:250px; overflow-y:auto; padding-right:5px; margin-bottom:15px;">
                             ${listHtml}
                           </div>
                           <button onclick="saveStaffEquipmentChecks(${activeStaffLivePhaseIdx}, ${tIdx})" class="btn-primary" style="width:100%; background:var(--gold); color:#000; font-size:13px; padding:12px; font-weight:800; border:none; border-radius:8px; cursor:pointer; margin-top:5px;"> Save Checklist & Mark Done</button>
                         </div>
                       `;
                     } else {
                       extraHtml = `<div style="margin-top:15px; font-size:11px; color:var(--text-dim); font-style:italic;">No equipment assignment found for this reservation.</div>`;
                     }
                   }

                   return `
                      <div ${t.text === 'Count equipment' ? '' : `onclick="toggleStaffTaskStatus(${activeStaffLivePhaseIdx}, ${tIdx})"`}
                           style="background:${isDone ? 'rgba(34,197,94,0.05)' : 'var(--bg2)'}; 
                                  border:1px solid ${isDone ? 'var(--green)' : 'var(--border)'}; 
                                  border-radius:16px; padding:20px; display:flex; flex-direction:column; transition:all 0.2s; ${t.text !== 'Count equipment' ? 'cursor:pointer;' : ''}">
                         
                         <div style="display:flex; align-items:center; gap:20px; ${t.text === 'Count equipment' ? 'cursor:pointer;' : ''}"
                              ${t.text === 'Count equipment' ? `onclick="toggleStaffTaskStatus(${activeStaffLivePhaseIdx}, ${tIdx})"` : ''}>
                           <div style="width:32px; height:32px; border-radius:10px; border:2px solid ${isDone ? 'var(--green)' : 'var(--text-dim)'}; 
                                       background:${isDone ? 'var(--green)' : 'transparent'}; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                              ${isDone ? '<span style="color:#000; font-weight:900;">✓</span>' : ''}
                           </div>
                           <div style="flex:1;">
                              <div style="font-size:16px; font-weight:700; color:${isDone ? 'var(--text-dim)' : 'var(--cream)'}; 
                                          text-decoration:${isDone ? 'line-through' : 'none'};">${t.text}</div>
                           </div>
                           ${isDone ? '<div style="font-size:10px; font-weight:800; color:var(--green); text-transform:uppercase;">Completed</div>' : ''}
                         </div>
                         ${extraHtml}
                      </div>
                   `;
                }).join('')}
             </div>
          </div>
       </div>

       <div style="background:var(--bg2); border-left:1px solid var(--border); display:flex; flex-direction:column;">
          <div style="padding:30px; border-bottom:1px solid var(--border);">
             <div style="font-size:11px; font-weight:800; color:var(--text-dim); text-transform:uppercase; letter-spacing:1.5px; margin-bottom:20px;">Phase Progress</div>
             <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span id="staff-live-progress-text" style="font-size:24px; font-weight:700; color:var(--cream);">0%</span>
                <span style="font-size:12px; color:var(--text-dim);">tasks done</span>
             </div>
             <div style="height:8px; background:rgba(255,255,255,0.05); border-radius:4px; overflow:hidden;">
                <div id="staff-live-progress-bar" style="height:100%; width:0%; background:var(--gold); transition:width 0.3s;"></div>
             </div>
          </div>

          <div style="flex:1; padding:30px; overflow-y:auto;">
             <div style="font-size:11px; font-weight:800; color:var(--text-dim); text-transform:uppercase; letter-spacing:1.5px; margin-bottom:20px;">Execution Flow</div>
             <div style="display:flex; flex-direction:column; gap:12px;">
                ${res.executionPlan.phases.map((ph, idx) => {
                   const isActive = idx === activeStaffLivePhaseIdx;
                   const phAccent = colors[ph.id] || 'var(--gold)';
                   return `
                      <div onclick="selectStaffLivePhase(${idx})"
                           style="padding:15px; border-radius:12px; background:${isActive ? 'rgba(255,255,255,0.03)' : 'transparent'}; 
                                  border:1px solid ${isActive ? phAccent : 'var(--border)'}; cursor:pointer; opacity:${isActive ? 1 : 0.6}; transition:all 0.2s;">
                         <div style="font-size:10px; font-weight:800; color:${isActive ? phAccent : 'var(--text-dim)'}; text-transform:uppercase; margin-bottom:4px;">${ph.name}</div>
                         <div style="font-size:12px; color:var(--cream); font-weight:600;">${ph.start} — ${ph.end}</div>
                      </div>
                   `;
                }).join('')}
             </div>
          </div>
       </div>
    </div>
  `;

  container.innerHTML = html;

  const total = myTasks.length;
  const done = myTasks.filter(t => t.status === 'done').length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 100;
  
  const pTxt = document.getElementById('staff-live-progress-text');
  const pBar = document.getElementById('staff-live-progress-bar');
  if (pTxt) pTxt.textContent = pct + '%';
  if (pBar) {
     pBar.style.width = pct + '%';
     pBar.style.background = pct === 100 ? 'var(--green)' : 'var(--gold)';
  }
}

async function toggleStaffTaskStatus(pIdx, tIdx) {
  const res = RESERVATIONS.find(r => r.id === activeStaffExecutionResId);
  if (!res || !res.executionPlan) return;
  const t = res.executionPlan.phases[pIdx].tasks[tIdx];
  if (!t) return;

  const wasDone = t.status === 'done';
  t.status = wasDone ? 'pending' : 'done';
  if (!wasDone) {
    t.completedAt = new Date().toISOString();
    logActivity(`Completed "${t.text}" on ${res.client}'s event`);
  } else {
    delete t.completedAt;
  }
  renderStaffExecutionLive();
  renderStaffDashboard();

  try {
    const { doc, updateDoc } = window.firebaseFns;
    await updateDoc(doc(window.firebaseDB, 'reservations', res.id), { executionPlan: res.executionPlan });
  } catch(e) { console.error("Failed to save task status", e); }
}

// ===== PAYROLL MODULE =====
function renderPayroll() {
  const logged = sessionStorage.getItem('halden_staff');
  if (!logged) return;
  const staff = JSON.parse(logged);
  
  // Placeholder payroll data
  const payrollData = {
    totalEarnings: 45000,
    hoursWorked: 72,
    eventsCompleted: 5,
    pendingPayment: 15000,
    earnings: [
      {
        id: 1,
        eventName: "Santos Wedding Reception",
        date: "2026-05-12",
        hours: 8,
        rate: 2500,
        overtime: 2,
        overtimeRate: 375,
        total: 5750,
        status: "paid"
      },
      {
        id: 2,
        eventName: "Cruz Corporate Event",
        date: "2026-05-08",
        hours: 12,
        rate: 2500,
        overtime: 4,
        overtimeRate: 375,
        total: 9000,
        status: "paid"
      },
      {
        id: 3,
        eventName: "Reyes Birthday Party",
        date: "2026-05-05",
        hours: 6,
        rate: 2500,
        overtime: 0,
        overtimeRate: 375,
        total: 3750,
        status: "pending"
      },
      {
        id: 4,
        eventName: "Luna Anniversary Dinner",
        date: "2026-05-03",
        hours: 10,
        rate: 2500,
        overtime: 2,
        overtimeRate: 375,
        total: 8250,
        status: "paid"
      },
      {
        id: 5,
        eventName: "Villanueva Graduation",
        date: "2026-05-01",
        hours: 8,
        rate: 2500,
        overtime: 0,
        overtimeRate: 375,
        total: 5000,
        status: "pending"
      }
    ],
    paymentHistory: [
      {
        id: 1,
        period: "April 16-30, 2026",
        amount: 32500,
        paidDate: "2026-05-02",
        status: "completed",
        method: "Bank Transfer"
      },
      {
        id: 2,
        period: "April 1-15, 2026",
        amount: 28000,
        paidDate: "2026-04-18",
        status: "completed",
        method: "Bank Transfer"
      },
      {
        id: 3,
        period: "March 16-31, 2026",
        amount: 31000,
        paidDate: "2026-04-02",
        status: "completed",
        method: "Bank Transfer"
      }
    ]
  };

  // Update summary cards
  const totalEarningsEl = document.getElementById('payroll-total-earnings');
  const hoursWorkedEl = document.getElementById('payroll-hours-worked');
  const eventsCompletedEl = document.getElementById('payroll-events-completed');
  const pendingPaymentEl = document.getElementById('payroll-pending');

  if (totalEarningsEl) totalEarningsEl.textContent = '₱' + payrollData.totalEarnings.toLocaleString();
  if (hoursWorkedEl) hoursWorkedEl.textContent = payrollData.hoursWorked + 'h';
  if (eventsCompletedEl) eventsCompletedEl.textContent = payrollData.eventsCompleted;
  if (pendingPaymentEl) pendingPaymentEl.textContent = '₱' + payrollData.pendingPayment.toLocaleString();

  // Render earnings breakdown
  const earningsListEl = document.getElementById('payroll-earnings-list');
  if (earningsListEl) {
    earningsListEl.innerHTML = payrollData.earnings.map(earning => `
      <div style="background:var(--bg2); border:1px solid var(--border); border-radius:12px; padding:20px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
        <div style="flex:1;">
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
            <span style="font-size:15px; font-weight:700; color:var(--cream);">${earning.eventName}</span>
            <span style="font-size:11px; padding:4px 10px; border-radius:20px; font-weight:800; ${earning.status === 'paid' ? 'background:rgba(34,197,94,0.1); color:var(--green);' : 'background:rgba(239,68,68,0.1); color:var(--red);'};">
              ${earning.status === 'paid' ? '✓ PAID' : ' PENDING'}
            </span>
          </div>
          <div style="font-size:12px; color:var(--text-dim); margin-bottom:4px;">${earning.date} · ${earning.hours}h regular ${earning.overtime > 0 ? `+ ${earning.overtime}h overtime` : ''}</div>
          <div style="font-size:11px; color:var(--text-mid);">
            Base: ₱${earning.rate.toLocaleString()}/h · Overtime: ₱${earning.overtimeRate.toLocaleString()}/h
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:18px; font-weight:700; color:var(--gold);">₱${earning.total.toLocaleString()}</div>
          <div style="font-size:10px; color:var(--text-dim);">Total Earnings</div>
        </div>
      </div>
    `).join('');
  }

  // Render payment history
  const paymentHistoryEl = document.getElementById('payroll-payment-history');
  if (paymentHistoryEl) {
    paymentHistoryEl.innerHTML = payrollData.paymentHistory.map(payment => `
      <div style="background:var(--bg2); border:1px solid var(--border); border-radius:12px; padding:16px 20px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
        <div style="flex:1;">
          <div style="font-size:14px; font-weight:700; color:var(--cream); margin-bottom:4px;">${payment.period}</div>
          <div style="font-size:12px; color:var(--text-dim);">Paid: ${payment.paidDate} · ${payment.method}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:16px; font-weight:700; color:var(--green);">₱${payment.amount.toLocaleString()}</div>
          <div style="font-size:10px; color:var(--text-dim);">Disbursed</div>
        </div>
      </div>
    `).join('');
  }
}

// ===== STRATEGY MODAL =====
function viewStaffExecutionStrategy(resId) {
  const staffData = JSON.parse(sessionStorage.getItem('halden_staff') || '{}');
  const staffId = staffData.id || "";
  const staffName = (staffData.name || "").toLowerCase();
  const staffEmail = (staffData.email || "").toLowerCase();

  const res = RESERVATIONS.find(r => r.id === resId);
  if (!res || !res.executionPlan) return;
  
  const content = document.getElementById('staff-strategy-content');
  if (!content) return;
  
  const phases = res.executionPlan.phases;
  
  let html = `
    <div style="padding:30px; background:var(--bg2);">
       <div style="margin-bottom:30px;">
          <h2 style="font-family:'Arial'; font-size:24px; color:var(--gold);">${res.client}'s Event Strategy</h2>
          <p style="font-size:13px; color:var(--text-dim);">Assigned tasks and logistical flow for this event.</p>
       </div>
       <div style="display:flex; flex-direction:column; gap:25px;">
  `;
  
  phases.forEach(p => {
    html += `
      <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:16px; overflow:hidden;">
         <div style="padding:15px 20px; background:rgba(255,255,255,0.03); border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
            <div>
               <div style="font-size:11px; color:var(--gold); font-weight:800; text-transform:uppercase; letter-spacing:1px;">Phase</div>
               <div style="font-size:16px; font-weight:700; color:var(--cream);">${p.name}</div>
            </div>
            <div style="text-align:right;">
               <div style="font-size:11px; color:var(--text-dim); font-weight:800; text-transform:uppercase; letter-spacing:1px;">Time Period</div>
               <div style="font-size:14px; font-weight:600; color:var(--cream);">${p.start} — ${p.end}</div>
            </div>
         </div>
         <div style="padding:20px;">
            <div style="font-size:11px; color:var(--text-dim); text-transform:uppercase; margin-bottom:12px; font-weight:800;">Logistical Activities</div>
            <div style="display:flex; flex-direction:column; gap:10px;">
               ${p.tasks ? p.tasks.map(t => {
                 const ids = (t.staffIds || []).filter(id => id).map(id => id.toLowerCase());
                 const isMyTask = (staffId && ids.includes(staffId.toLowerCase())) || 
                                  (staffName && ids.includes(staffName)) || 
                                  (staffEmail && ids.includes(staffEmail));
                 return `
                  <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.1); padding:10px 15px; border-radius:8px; border:1px solid rgba(255,255,255,0.03);">
                     <span style="font-size:13px; color:var(--text);">${t.text}</span>
                     ${isMyTask 
                        ? '<span style="font-size:10px; background:var(--gold); color:#000; padding:2px 8px; border-radius:10px; font-weight:800; text-transform:uppercase;">My Task</span>' 
                        : '<span style="font-size:10px; color:var(--text-dim);">Support Team</span>'}
                  </div>
                `;
               }).join('') : ''}
            </div>
         </div>
      </div>
    `;
  });

  html += `</div></div>`;
  content.innerHTML = html;
  
  document.getElementById('staff-strategy-overlay').classList.add('on');
  document.getElementById('staff-strategy-modal').classList.add('open');
}

function closeStaffStrategy() {
  document.getElementById('staff-strategy-overlay').classList.remove('on');
  document.getElementById('staff-strategy-modal').classList.remove('open');
}

// ===== INIT =====
function waitForFirebase(attempts = 0) {
  if (window.firebaseFns && window.firebaseDB) {
    loadData();
  } else if (attempts < 20) {
    setTimeout(() => waitForFirebase(attempts + 1), 150);
  } else {
    console.error('Firebase did not initialize in time.');
  }
}

waitForFirebase();
checkAuth();

// EXPORTS
window.showSection = showSection;
window.startStaffExecutionDay = startStaffExecutionDay;
window.selectStaffLivePhase = selectStaffLivePhase;
window.toggleStaffTaskStatus = toggleStaffTaskStatus;
window.viewStaffExecutionStrategy = viewStaffExecutionStrategy;
window.closeStaffStrategy = closeStaffStrategy;
window.selectStaffExecutionEvent = selectStaffExecutionEvent;
window.adminLogout = adminLogout;
window.logActivity = logActivity;

window.saveStaffEquipmentChecks = async function(pIdx, tIdx) {
  const res = RESERVATIONS.find(r => r.id === activeStaffExecutionResId);
  if (!res || !res.executionPlan) return;

  const p = res.executionPlan.phases[pIdx];
  if (!p) return;

  let totalPcs = 0, presentPcs = 0, missingPcs = 0, damaged = 0, broken = 0;
  let checklistData = [];

  const checks = p.equipmentChecks || {};
  
  if (res.equipmentManifest) {
    res.equipmentManifest.forEach(eq => {
      const safeId = (eq.assetId || eq.name).replace(/[^a-zA-Z0-9]/g, '-');
      const condEl = document.getElementById(`eq-chk-cond-${pIdx}-${safeId}`);
      const statEl = document.getElementById(`eq-chk-stat-${pIdx}-${safeId}`);
      if (condEl && statEl) {
        checks[safeId] = {
          condition: condEl.value,
          status: statEl.value,
          lastUpdated: new Date().toISOString()
        };

        const totalQty = parseInt(eq.assignedQty || eq.assignQty) || parseInt(eq.requiredQty) || 1;
        const presentQty = statEl.value === 'missing' ? 0 : totalQty;
        const missingQty = totalQty - presentQty;
        const condition = condEl.value === 'fine' ? 'excellent' : 'broken';

        totalPcs += totalQty;
        presentPcs += presentQty;
        missingPcs += missingQty;
        if (condition === 'broken') broken++;

        checklistData.push({
          assetId: eq.assetId || 'EQ-???',
          name: eq.name,
          category: eq.category || 'Equipment',
          source: 'inventory',
          totalQty,
          presentQty,
          missingQty,
          condition,
          liableParty: 'none'
        });
      }
    });
  }

  p.equipmentChecks = checks;

  // Also mark the task as done if not already done
  const t = p.tasks[tIdx];
  if (t && t.status !== 'done') {
    t.status = 'done';
    t.completedAt = new Date().toISOString();
    logActivity(`Completed "${t.text}" on ${res.client}'s event`);
  }

  renderStaffExecutionLive();
  renderStaffDashboard();

  try {
    const { doc, updateDoc, collection, addDoc } = window.firebaseFns;
    
    // Save to execution plan
    await updateDoc(doc(window.firebaseDB, 'reservations', res.id), { executionPlan: res.executionPlan });

    // Auto-Log to deploymentLogs for Admin Lifecycle
    const record = {
      reservationId: res.id,
      eventName: res.client || res.name,
      eventDate: res.date,
      stage: p.id,
      timestamp: new Date().toISOString(),
      loggedAt: new Date().toISOString(),
      loggedBy: 'Staff',
      liableParty: 'see-per-item',
      checklist: checklistData,
      summary: { totalPcs, presentPcs, missingPcs, damaged, broken }
    };

    await addDoc(collection(window.firebaseDB, 'deploymentLogs'), record);

    // Show Execution Summary Panel instead of alert
    showExecutionSummaryPanel(res, p, { totalPcs, presentPcs, missingPcs, damaged, broken, checklistData });
  } catch(e) {
    console.error("Failed to save checklist", e);
    alert('Saved locally, but failed to sync to server.');
  }
};

// ===== EXECUTION SUMMARY PANEL =====
// Called after Save Checklist & Mark Done in the Restorage phase

let EXECUTION_PERFORMANCE_LOG = (() => {
  try { return JSON.parse(localStorage.getItem('halden_exec_perf_log') || '[]'); } catch(e){ return []; }
})();

function saveToExecutionPerformanceLog(entry) {
  EXECUTION_PERFORMANCE_LOG.unshift(entry);
  if (EXECUTION_PERFORMANCE_LOG.length > 50) EXECUTION_PERFORMANCE_LOG.pop();
  try { localStorage.setItem('halden_exec_perf_log', JSON.stringify(EXECUTION_PERFORMANCE_LOG)); } catch(e){}
}

function showExecutionSummaryPanel(res, phase, stats) {
  const logged = sessionStorage.getItem('halden_staff');
  const staff = logged ? JSON.parse(logged) : {};
  const staffName = staff.name || 'Staff Member';
  const staffId = staff.id || 'STF-001';

  // Build assignment rows from phase tasks
  const phaseDefs = [
    { name: 'Departure',   start: '05:00', end: '06:00' },
    { name: 'Deployment',  start: '06:00', end: '08:00' },
    { name: 'Execution',   start: '08:00', end: '15:00' },
    { name: 'Bashout',     start: '15:00', end: '16:00' },
    { name: 'Restorage',   start: '16:00', end: '17:00' },
  ];

  // Gather tasks across all phases assigned to this staff
  const allPhases = (res.executionPlan?.phases || []);
  const assignedTasks = [];
  let totalTasksDone = 0;

  allPhases.forEach((p, pi) => {
    const phaseDef = phaseDefs[pi] || {};
    (p.tasks || []).forEach(t => {
      const ids = (t.staffIds || []).map(x => (x||'').toLowerCase());
      const matchesSelf = ids.includes((staff.id||'').toLowerCase()) ||
                          ids.includes((staff.name||'').toLowerCase()) ||
                          ids.includes((staff.email||'').toLowerCase());
      if (matchesSelf) {
        totalTasksDone++;
        assignedTasks.push({
          phase: p.name || phaseDef.name || `Phase ${pi+1}`,
          task: t.text || 'Task',
          status: t.status || 'done',
          window: `${phaseDef.start} – ${phaseDef.end}`,
          completedAt: t.completedAt ? new Date(t.completedAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : 'Completed'
        });
      }
    });
  });

  // If no tasks found (simple phase only), show the Restorage phase tasks
  if (assignedTasks.length === 0) {
    (phase.tasks || []).forEach(t => {
      totalTasksDone++;
      assignedTasks.push({
        phase: phase.name || 'Restorage',
        task: t.text || 'Task',
        status: t.status || 'done',
        window: '16:00 – 17:00',
        completedAt: t.completedAt ? new Date(t.completedAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : 'Completed'
      });
    });
  }

  // Working hours: based on phase definitions (5 phases = 12 hrs total, staff typically covers Departure to Restorage)
  const startTime = new Date(); startTime.setHours(5, 0, 0, 0);
  const endTime = new Date(); endTime.setHours(17, 0, 0, 0);
  const workingHours = ((endTime - startTime) / 3600000).toFixed(1); // 12.0

  // Estimated salary (placeholder: ₱600/hour)
  const hourlyRate = 600;
  const estimatedSalary = (parseFloat(workingHours) * hourlyRate).toLocaleString();

  // Inventory summary
  const { totalPcs = 0, presentPcs = 0, missingPcs = 0, damaged = 0, broken = 0, checklistData = [] } = stats;

  // Create the performance record
  const perfRecord = {
    id: 'PERF-' + Date.now(),
    timestamp: new Date().toISOString(),
    staffName,
    staffId,
    eventName: res.client || 'Unknown Event',
    eventDate: res.date || 'N/A',
    packageName: res.packageName || res.type || 'N/A',
    totalTasksDone,
    assignedTasks,
    workingHours: parseFloat(workingHours),
    estimatedSalary: parseFloat(workingHours) * hourlyRate,
    inventory: { totalPcs, presentPcs, missingPcs, damaged, broken }
  };
  saveToExecutionPerformanceLog(perfRecord);

  // Build HTML for the panel
  const taskRows = assignedTasks.map(t => `
    <div style="display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid rgba(196,154,60,0.1);">
      <div style="width:8px;height:8px;border-radius:50%;background:#27ae60;flex-shrink:0;margin-top:5px;"></div>
      <div style="flex:1;">
        <div style="font-size:13px;font-weight:700;color:var(--text);">${t.task}</div>
        <div style="font-size:11px;color:var(--text-dim);">${t.phase} &nbsp;·&nbsp; ${t.window}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:10px;font-weight:800;color:#27ae60;text-transform:uppercase;">Done</div>
        <div style="font-size:10px;color:var(--text-dim);">${t.completedAt}</div>
      </div>
    </div>
  `).join('');

  const panelHTML = `
  <div id="exec-summary-overlay" style="
    position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:9999;
    display:flex;align-items:center;justify-content:center;padding:20px;
    backdrop-filter:blur(4px);
  ">
    <div style="
      background:var(--bg);border:1px solid var(--border);border-radius:24px;
      width:100%;max-width:700px;max-height:90vh;overflow-y:auto;
      box-shadow:0 40px 80px rgba(0,0,0,0.5);
    ">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#1a1007,#2d1f0a);padding:28px;border-radius:24px 24px 0 0;position:relative;">
        <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:var(--gold);margin-bottom:8px;">Execution Complete</div>
        <div style="font-size:26px;font-weight:900;color:#fff;margin-bottom:4px;">Execution Summary</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.6);">${res.client}'s Event &nbsp;·&nbsp; ${res.date || 'Today'} &nbsp;·&nbsp; ${res.packageName || res.type || 'Custom Package'}</div>
        <div style="position:absolute;top:24px;right:24px;">
          <span style="background:rgba(39,174,96,0.2);border:1px solid #27ae60;color:#27ae60;padding:6px 14px;border-radius:20px;font-size:11px;font-weight:800;text-transform:uppercase;">All Done</span>
        </div>
      </div>

      <div style="padding:24px;">

        <!-- Staff Identity -->
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:20px;display:flex;gap:16px;align-items:center;">
          <div style="width:48px;height:48px;background:var(--gold);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;color:#000;">${staffName.charAt(0).toUpperCase()}</div>
          <div>
            <div style="font-size:16px;font-weight:800;color:var(--text);">${staffName}</div>
            <div style="font-size:11px;color:var(--text-dim);">Staff ID: ${staffId}</div>
          </div>
          <div style="margin-left:auto;text-align:right;">
            <div style="font-size:10px;font-weight:800;text-transform:uppercase;color:var(--text-dim);margin-bottom:2px;">Report ID</div>
            <div style="font-size:12px;font-weight:700;color:var(--gold);">${perfRecord.id}</div>
          </div>
        </div>

        <!-- Stats Row -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px;">
          <div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:16px;text-align:center;">
            <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--text-dim);margin-bottom:6px;">Tasks Completed</div>
            <div style="font-size:32px;font-weight:900;color:var(--gold);">${totalTasksDone}</div>
            <div style="font-size:10px;color:var(--text-dim);">assignments done</div>
          </div>
          <div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:16px;text-align:center;">
            <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--text-dim);margin-bottom:6px;">Working Hours</div>
            <div style="font-size:32px;font-weight:900;color:#3498db;">${workingHours}</div>
            <div style="font-size:10px;color:var(--text-dim);">hrs (05:00 – 17:00)</div>
          </div>
          <div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:16px;text-align:center;">
            <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--text-dim);margin-bottom:6px;">Est. Salary</div>
            <div style="font-size:26px;font-weight:900;color:#27ae60;">&#8369;${estimatedSalary}</div>
            <div style="font-size:10px;color:var(--text-dim);">at &#8369;${hourlyRate}/hr</div>
          </div>
        </div>

        <!-- Task Assignments Log -->
        <div style="margin-bottom:20px;">
          <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:var(--gold);margin-bottom:12px;">Assignment Log</div>
          <div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:16px;">
            ${taskRows || '<div style="text-align:center;color:var(--text-dim);font-size:13px;padding:20px;">No individual task data found — checklist completed.</div>'}
          </div>
        </div>

        <!-- Inventory Summary -->
        <div style="margin-bottom:20px;">
          <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:var(--gold);margin-bottom:12px;">Inventory Condition</div>
          <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;">
            ${[
              ['Total', totalPcs, '#c49a3c'],
              ['Present', presentPcs, '#27ae60'],
              ['Missing', missingPcs, '#e74c3c'],
              ['Damaged', damaged, '#e67e22'],
              ['Broken', broken, '#c0392b'],
            ].map(([lbl,val,clr]) => `
              <div style="border:1px solid var(--border);border-radius:10px;padding:12px;text-align:center;background:var(--bg2);">
                <div style="font-size:9px;font-weight:800;text-transform:uppercase;color:var(--text-dim);margin-bottom:4px;">${lbl}</div>
                <div style="font-size:22px;font-weight:900;color:${clr};">${val}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Phase Timeline -->
        <div style="margin-bottom:24px;">
          <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:var(--gold);margin-bottom:12px;">Phase Coverage</div>
          <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;">
            ${phaseDefs.map(pd => `
              <div style="border:2px solid var(--gold);border-radius:10px;padding:10px;text-align:center;">
                <div style="font-size:9px;font-weight:800;text-transform:uppercase;color:var(--gold);margin-bottom:2px;">${pd.name}</div>
                <div style="font-size:9px;color:var(--text-dim);">${pd.start} – ${pd.end}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Actions -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <button onclick="document.getElementById('exec-summary-overlay').remove();renderExecutionPerformance();" 
            style="padding:14px;background:var(--gold);color:#000;border:none;border-radius:12px;font-weight:800;font-size:13px;cursor:pointer;">
            Save to Performance Log
          </button>
          <button onclick="document.getElementById('exec-summary-overlay').remove();" 
            style="padding:14px;background:var(--bg2);color:var(--text);border:1px solid var(--border);border-radius:12px;font-weight:700;font-size:13px;cursor:pointer;">
            Close
          </button>
        </div>

      </div>
    </div>
  </div>`;

  // Inject panel into body
  const overlay = document.createElement('div');
  overlay.innerHTML = panelHTML;
  document.body.appendChild(overlay.firstElementChild);
}

// ===== EXECUTION PERFORMANCE MODULE =====
function renderExecutionPerformance() {
  const log = EXECUTION_PERFORMANCE_LOG;
  const container = document.getElementById('exec-performance-container');
  if (!container) return;

  if (log.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:60px;color:var(--text-dim);">
      <div style="font-size:48px;margin-bottom:16px;">-</div>
      <div style="font-size:15px;font-weight:700;">No performance records yet</div>
      <div style="font-size:12px;margin-top:6px;">Records are saved automatically after completing the Restorage phase checklist.</div>
    </div>`;
    return;
  }

  container.innerHTML = log.map(rec => {
    const date = new Date(rec.timestamp).toLocaleString([], {month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'});
    return `
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:20px;margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;">
        <div>
          <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--gold);">Execution Record</div>
          <div style="font-size:17px;font-weight:800;color:var(--text);margin-top:2px;">${rec.eventName}'s Event</div>
          <div style="font-size:12px;color:var(--text-dim);margin-top:2px;">${rec.packageName} &nbsp;·&nbsp; ${rec.eventDate} &nbsp;·&nbsp; ${date}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:9px;font-weight:800;text-transform:uppercase;color:var(--text-dim);">Record ID</div>
          <div style="font-size:11px;font-weight:700;color:var(--gold);">${rec.id}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px;">
        <div style="border:1px solid var(--border);border-radius:10px;padding:12px;text-align:center;">
          <div style="font-size:9px;text-transform:uppercase;color:var(--text-dim);font-weight:800;margin-bottom:4px;">Tasks Done</div>
          <div style="font-size:24px;font-weight:900;color:var(--gold);">${rec.totalTasksDone}</div>
        </div>
        <div style="border:1px solid var(--border);border-radius:10px;padding:12px;text-align:center;">
          <div style="font-size:9px;text-transform:uppercase;color:var(--text-dim);font-weight:800;margin-bottom:4px;">Hours Worked</div>
          <div style="font-size:24px;font-weight:900;color:#3498db;">${rec.workingHours}</div>
        </div>
        <div style="border:1px solid var(--border);border-radius:10px;padding:12px;text-align:center;">
          <div style="font-size:9px;text-transform:uppercase;color:var(--text-dim);font-weight:800;margin-bottom:4px;">Est. Salary</div>
          <div style="font-size:18px;font-weight:900;color:#27ae60;">&#8369;${Number(rec.estimatedSalary).toLocaleString()}</div>
        </div>
        <div style="border:1px solid var(--border);border-radius:10px;padding:12px;text-align:center;">
          <div style="font-size:9px;text-transform:uppercase;color:var(--text-dim);font-weight:800;margin-bottom:4px;">Items OK</div>
          <div style="font-size:24px;font-weight:900;color:#27ae60;">${rec.inventory?.presentPcs ?? '-'}</div>
        </div>
      </div>
      <details style="cursor:pointer;">
        <summary style="font-size:11px;font-weight:700;color:var(--gold);outline:none;">View Assignment Details</summary>
        <div style="margin-top:10px;border-top:1px solid var(--border);padding-top:10px;">
          ${(rec.assignedTasks || []).map(t => `
            <div style="display:flex;gap:10px;align-items:center;padding:7px 0;border-bottom:1px solid rgba(196,154,60,0.08);">
              <div style="width:6px;height:6px;border-radius:50%;background:#27ae60;flex-shrink:0;"></div>
              <div style="flex:1;font-size:12px;font-weight:600;color:var(--text);">${t.task}</div>
              <div style="font-size:10px;color:var(--text-dim);">${t.phase} &nbsp;${t.window}</div>
              <div style="font-size:10px;font-weight:800;color:#27ae60;">${t.completedAt}</div>
            </div>
          `).join('') || '<div style="color:var(--text-dim);font-size:12px;padding:8px;">No task details recorded.</div>'}
        </div>
      </details>
    </div>`;
  }).join('');
}

window.showExecutionSummaryPanel = showExecutionSummaryPanel;
window.renderExecutionPerformance = renderExecutionPerformance;
