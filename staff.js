// GLOBAL DATA
let RESERVATIONS = [];
let ANNOUNCEMENTS = [];
let ACTIVITY_LOG = [];
let USERS = [];
let LAST_SYNCED = null;

function toggleSidebarGroup(group) {
  const content = document.getElementById('sg-' + group);
  const toggle = document.getElementById('sgt-' + group);
  if (!content) return;
  const isOpen = content.classList.contains('open');
  
  // Close all
  document.querySelectorAll('.sg-items').forEach(el => el.classList.remove('open'));
  document.querySelectorAll('.sg-toggle').forEach(el => el.classList.remove('open'));
  
  // Toggle the clicked one
  if (!isOpen) {
    content.classList.add('open');
    toggle?.classList.add('open');
  }
}
window.toggleSidebarGroup = toggleSidebarGroup;


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
  localStorage.removeItem('halden_staff');
  localStorage.removeItem('halden_logged_in');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('currentUserId');
  localStorage.removeItem('session_start');
  localStorage.removeItem('sb-nukbdmyqizrnkmbusdtm-auth-token');
  localStorage.setItem('halden_user_type', '');
  
  if (window.supabaseClient && window.supabaseClient.auth) {
    window.supabaseClient.auth.signOut().catch(() => { }).finally(() => {
      window.location.href = 'index.html';
    });
  } else {
    window.location.href = 'index.html';
  }
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

    // Load reservations from Firebase
    const resSnap = await getDocs(collection(db, 'reservations'));
    RESERVATIONS = resSnap.docs.map(d => {
      const data = d.data();
      return { id: d.id, ...data, amount: '₱' + Number(data.amount || 0).toLocaleString() };
    });

    // Also load from Supabase (bypassing Firebase security rules issues)
    try {
      if (window.supabaseClient) {
        const { data: sbRes } = await window.supabaseClient.from('reservations').select('*');
        if (sbRes && sbRes.length > 0) {
          const combinedMap = new Map();
          RESERVATIONS.forEach(r => combinedMap.set(r.id, r));
          sbRes.forEach(r => combinedMap.set(r.id, r));
          RESERVATIONS = Array.from(combinedMap.values());
        }
      }
    } catch(e) { console.warn('Supabase reservations fetch failed:', e); }

    // Load assigned reservation IDs from reservation_staff_assignments (Supabase)
    window.STAFF_ASSIGNED_RES_IDS = new Set();
    try {
      if (window.supabaseClient) {
        // Await getSession() so the Supabase client fully restores its JWT
        // before we run the query : without this, auth.uid() is null on page load
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        const staffUid = session?.user?.id || '';
        if (staffUid) {
          const { data: assignRows } = await window.supabaseClient
            .from('reservation_staff_assignments')
            .select('reservation_id')
            .eq('staff_id', staffUid);
          if (assignRows) assignRows.forEach(r => window.STAFF_ASSIGNED_RES_IDS.add(r.reservation_id));
        }
      }
    } catch(e) { console.warn('Could not load staff assignments from Supabase:', e); }

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
    // Check reservation_staff_assignments table (Supabase-saved assignments)
    if (window.STAFF_ASSIGNED_RES_IDS && window.STAFF_ASSIGNED_RES_IDS.has(res.id)) return true;
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

  // ── Shared helpers ──────────────────────────────────────────
  const to12hr = (t) => {
    if (!t) return '';
    const m = String(t).match(/(\d{1,2}):(\d{2})/);
    if (!m) return t;
    let h = parseInt(m[1]), min = m[2];
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${min} ${ampm}`;
  };

  // Parse "H:MM AM/PM to H:MM AM/PM" or "H:MM AM/PM - H:MM AM/PM" or bare HH:MM HH:MM
  const parseTimeRange = (tf) => {
    if (!tf) return null;
    const hasMeridiem = /\b(AM|PM)\b/i.test(tf);
    if (!hasMeridiem) {
      const m24 = String(tf).match(/(\d{1,2}:\d{2})/g);
      if (m24 && m24.length >= 2) return { s: m24[0], e: m24[1] };
    }
    const mAP = String(tf).match(/(\d{1,2}(?::\d{2})?\s*(?:AM|PM))/gi);
    if (mAP && mAP.length >= 2) {
      const cvt = s => {
        const x = s.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
        if (!x) return null;
        let h = parseInt(x[1]), mn = x[2] || '00', ap = x[3].toUpperCase();
        if (ap === 'PM' && h !== 12) h += 12;
        if (ap === 'AM' && h === 12) h = 0;
        return `${String(h).padStart(2,'0')}:${mn}`;
      };
      return { s: cvt(mAP[0]), e: cvt(mAP[1]) };
    }
    return null;
  };

  const getWorkHours = (res) => {
    const tfRaw = res.time || res.timeframe || res.time_range || '';
    const tFrom = res.time_from || res.timeFrom || null;
    const tTo   = res.time_to   || res.timeTo   || null;
    let s24 = null, e24 = null;
    if (tFrom && tTo) {
      s24 = tFrom.length <= 5 ? tFrom : tFrom.substring(0,5);
      e24 = tTo.length   <= 5 ? tTo   : tTo.substring(0,5);
    } else {
      const tf = parseTimeRange(tfRaw);
      if (tf) { s24 = tf.s; e24 = tf.e; }
    }
    if (!s24 || !e24) return null;
    const toMins = t => { const [h,m] = t.split(':'); return parseInt(h)*60+parseInt(m); };
    let diff = toMins(e24) - toMins(s24);
    if (diff < 0) diff += 1440;
    return (diff / 60).toFixed(1);
  };

  const getTimeDisplay = (res) => {
    const tfRaw = res.time || res.timeframe || res.time_range || '';
    const tFrom = res.time_from || res.timeFrom || null;
    const tTo   = res.time_to   || res.timeTo   || null;
    if (tFrom && tTo) {
      const s24 = tFrom.length <= 5 ? tFrom : tFrom.substring(0,5);
      const e24 = tTo.length   <= 5 ? tTo   : tTo.substring(0,5);
      return `${to12hr(s24)} – ${to12hr(e24)}`;
    }
    const tf = parseTimeRange(tfRaw);
    if (tf) return `${to12hr(tf.s)} – ${to12hr(tf.e)}`;
    return tfRaw || '–';
  };

  const getCallTime = (res) => {
    const raw = res.call_time || res.callTime || res.calltime || '';
    if (!raw) return null;
    // may already be 12hr, or HH:MM
    if (/^\d{1,2}:\d{2}$/.test(raw.trim())) return to12hr(raw.trim());
    return raw;
  };

  const getPackageName = (res) =>
    res.package_name || res.packageName || res.type || res.occasion || res.event_type || '';

  const hoursVal = document.getElementById('staff-stat-hours');
  if (hoursVal) {
    let totalHrs = 0;
    assigned.forEach(res => {
      totalHrs += parseFloat(getWorkHours(res)) || 0;
    });
    hoursVal.textContent = totalHrs.toFixed(1);
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
      const label = next.diff === 0 ? 'TODAY' : next.diff === 1 ? 'TOMORROW' : `IN ${next.diff} DAYS`;
      const pkgName = getPackageName(next);
      const callT   = getCallTime(next);
      const timeDisp = getTimeDisplay(next);
      shiftBanner.style.display = 'flex';
      shiftBanner.innerHTML = `
        <div style="font-size:20px; color:var(--gold); font-weight:900;">&#9658;</div>
        <div style="flex:1;">
          <div style="font-size:12px; font-weight:800; color:var(--gold); text-transform:uppercase; letter-spacing:1px; margin-bottom:2px;">Next Shift</div>
          <div style="font-size:15px; font-weight:700; color:var(--cream);">${next.client || next.clientName || 'Client'}'s Event${pkgName ? ' &mdash; ' + pkgName : ''}</div>
          <div style="font-size:12px; color:var(--text-dim); margin-top:2px;">${next.date}${timeDisp ? ' &middot; ' + timeDisp : ''}${callT ? ' &middot; Call: ' + callT : ''}</div>
        </div>
        <div style="color:var(--gold); font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:1px;">${label}</div>
      `;
    } else {
      shiftBanner.style.display = 'none';
    }
  }

  // --- Assigned List ---
  const list = document.getElementById('staff-assigned-list');
  if (!list) return;
  if (assigned.length === 0) {
    list.innerHTML = `<div style="text-align:center;padding:60px;color:var(--text-dim);"><div style="font-size:36px;margin-bottom:15px;color:var(--border);">[ ]</div><div>No active assignments found.</div></div>`;
  } else {
    list.innerHTML = assigned.map(res => {
      const pkgName    = getPackageName(res);
      const timeDisp   = getTimeDisplay(res);
      const callT      = getCallTime(res);
      const workHours  = getWorkHours(res);
      const address    = res.venue || res.address || res.venueAddress || res.venue_address || res.venueName || '–';
      const safeId     = res.id.replace(/[^a-zA-Z0-9_-]/g, '_');
      const resIdEsc   = (res.id || '').replace(/'/g, "\\'");
      return `
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;margin-bottom:12px;overflow:hidden;">
          <div style="padding:20px;display:flex;justify-content:space-between;align-items:center;">
            <div style="flex:1;">
              <div style="font-size:15px;font-weight:700;color:var(--gold);margin-bottom:2px;">${res.client || res.clientName || '–'}${pkgName ? ' &mdash; <span style="color:var(--cream);font-weight:600;">' + pkgName + '</span>' : ''}</div>
              <div style="font-size:12px;color:var(--cream);margin-bottom:2px;">
                Date: ${res.date || '–'}&nbsp;&nbsp;Time: ${timeDisp}
                ${callT ? `&nbsp;&nbsp; Call: <b>${callT}</b>` : ''}
                ${workHours ? `  |  <b>${workHours} hrs work</b>` : ''}
              </div>
              <div style="font-size:11px;color:var(--text-dim);">${address}</div>
            </div>
            <button onclick="toggleStaffViewPlan('${resIdEsc}')" id="btn-vp-${safeId}"
              style="background:var(--bg3);border:1px solid var(--border);color:var(--gold);padding:8px 14px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;flex-shrink:0;margin-left:16px;transition:all 0.2s;"
              onmouseover="this.style.borderColor='var(--gold)'" onmouseout="this.style.borderColor='var(--border)'">
              View Plan
            </button>
          </div>
          <div id="vp-expand-${safeId}" style="display:none;border-top:1px solid var(--border);">
            <!-- Roles injected here by toggleStaffViewPlan -->
            <div id="vp-roles-${safeId}"></div>
            <div style="padding:16px 20px;">
              <div style="font-size:11px;font-weight:800;color:var(--gold);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Venue Location</div>
              <div id="vp-map-${safeId}" style="height:260px;border-radius:10px;overflow:hidden;border:1px solid var(--border);background:var(--bg3);"></div>
              <div style="font-size:12px;color:var(--text-dim);margin-top:8px;">${address}</div>
            </div>
          </div>
        </div>`;
    }).join('');
  }

  // Init dashboard calendar
  if (typeof initStaffCalendar === 'function') {
    initStaffCalendar();
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
        <div><div style="font-size:10px;font-weight:800;color:var(--gold);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Venue</div><div style="font-size:13px;color:var(--cream);">${res.venue||':'}</div></div>
        <div><div style="font-size:10px;font-weight:800;color:var(--gold);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Time</div><div style="font-size:13px;color:var(--cream);">${res.timeRange||':'}</div></div>
        <div><div style="font-size:10px;font-weight:800;color:var(--gold);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Pax</div><div style="font-size:13px;color:var(--cream);">${res.pax||':'}</div></div>
        <div><div style="font-size:10px;font-weight:800;color:var(--gold);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Type</div><div style="font-size:13px;color:var(--cream);">${res.type||':'}</div></div>
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
          <div style="font-size:13px;font-weight:700;color:var(--cream);margin-bottom:2px;">${contactName||':'}</div>
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
                   <div style="font-size:16px; font-weight:700; color:var(--gold);">${p.start} : ${p.end}</div>
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
                         <div style="font-size:12px; color:var(--cream); font-weight:600;">${ph.start} : ${ph.end}</div>
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
               <div style="font-size:14px; font-weight:600; color:var(--cream);">${p.start} : ${p.end}</div>
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
            ${taskRows || '<div style="text-align:center;color:var(--text-dim);font-size:13px;padding:20px;">No individual task data found : checklist completed.</div>'}
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

// ===== PROFILE & CALENDAR MODULE =====

async function loadStaffProfile() {
  const logged = sessionStorage.getItem('halden_staff');
  if (!logged) return;
  const staff = JSON.parse(logged);

  try {
    const staffId = staff.id || staff.uid;
    if (!staffId) {
       console.error("No valid staff ID found.");
       return;
    }
    const { data, error } = await window.supabaseClient.from('users').select('*').eq('id', staffId).single();
    if (error) {
      console.error('Error fetching staff profile:', error);
      return;
    }

    const currentMonth = new Date().toISOString().slice(0, 7); // e.g., "2026-09"
    let statusToDisplay = data.availability || 'unknown';

    // Removed last_availability_month auto-switch due to schema constraints

    const nameParts = (data.name || '').split(' ');
    const fname = nameParts[0] || '';
    const lname = nameParts.length > 1 ? nameParts.slice(-1)[0] : '';
    const mname = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';

    // Populate Display View
    document.getElementById('prof-fname').textContent = fname || ':';
    document.getElementById('prof-mname').textContent = mname || ':';
    document.getElementById('prof-lname').textContent = lname || ':';
    document.getElementById('prof-email').textContent = data.email || ':';
    document.getElementById('prof-phone').textContent = data.phone || ':';

    // Populate Edit View
    document.getElementById('edit-fname').value = fname;
    document.getElementById('edit-mname').value = mname;
    document.getElementById('edit-lname').value = lname;
    document.getElementById('edit-phone').value = data.phone || '';

    // Availability Toggle
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById('avail-month-label').textContent = monthNames[new Date().getMonth()];
    
    const isAvail = statusToDisplay === 'Available';
    document.getElementById('avail-toggle').checked = isAvail;
    const availText = document.getElementById('avail-status-text');
    availText.textContent = isAvail ? 'Available' : 'Unavailable';
    availText.style.color = isAvail ? 'var(--green)' : 'var(--text-dim)';

    // Init Calendar
    initStaffCalendar();
  } catch (err) {
    console.error('Profile load error:', err);
  }
}

function toggleEditProfile(isEditing = true) {
  document.getElementById('profile-display-view').style.display = isEditing ? 'none' : 'flex';
  document.getElementById('profile-edit-view').style.display = isEditing ? 'flex' : 'none';
  document.getElementById('btn-edit-profile').style.display = isEditing ? 'none' : 'block';
}

async function saveProfile() {
  const logged = sessionStorage.getItem('halden_staff');
  if (!logged) return;
  const staff = JSON.parse(logged);

  const btn = document.getElementById('btn-save-profile');
  btn.textContent = 'Saving...';
  btn.disabled = true;

  const fname = document.getElementById('edit-fname').value.trim();
  const mname = document.getElementById('edit-mname').value.trim();
  const lname = document.getElementById('edit-lname').value.trim();
  
  const payload = {
    name: [fname, mname, lname].filter(Boolean).join(' '),
    phone: document.getElementById('edit-phone').value.trim()
  };

  const staffId = staff.id || staff.uid;
  const { error } = await window.supabaseClient.from('users').update(payload).eq('id', staffId);
  
  if (!error) {
    // Update local cache
    staff.name = payload.name;
    sessionStorage.setItem('halden_staff', JSON.stringify(staff));
    document.getElementById('admin-name').textContent = staff.name;

    await loadStaffProfile();
    toggleEditProfile(false);
  } else {
    alert('Failed to save profile changes.');
  }

  btn.textContent = 'Save Changes';
  btn.disabled = false;
}

async function toggleAvailability(checkbox) {
  const logged = sessionStorage.getItem('halden_staff');
  if (!logged) return;
  const staff = JSON.parse(logged);

  const isAvail = checkbox.checked;
  const newStatus = isAvail ? 'Available' : 'Unavailable';
  const availText = document.getElementById('avail-status-text');
  
  availText.textContent = 'Saving...';
  availText.style.color = 'var(--text-dim)';
  checkbox.disabled = true;

  const currentMonth = new Date().toISOString().slice(0, 7);
  const staffId = staff.id || staff.uid;
  const { error } = await window.supabaseClient.from('users').update({
    availability: newStatus
  }).eq('id', staffId);

  if (!error) {
    availText.textContent = newStatus;
    availText.style.color = isAvail ? 'var(--green)' : 'var(--text-dim)';
  } else {
    alert('Failed to update availability.');
    checkbox.checked = !isAvail; // Revert
    availText.textContent = !isAvail ? 'Available' : 'Unavailable';
    availText.style.color = !isAvail ? 'var(--green)' : 'var(--text-dim)';
  }
  
  checkbox.disabled = false;
}

let staffCalendarInstances = [];
async function initStaffCalendar() {
  const containers = [
    document.getElementById('staff-calendar-container'),
    document.getElementById('staff-dashboard-calendar-container')
  ].filter(Boolean);

  if (containers.length === 0) return;

  // Destroy previous instances
  staffCalendarInstances.forEach(inst => inst.destroy());
  staffCalendarInstances = [];

  try {
    // Ensure Supabase session is restored before querying
    if (window.supabaseClient) {
      await window.supabaseClient.auth.getSession();
    }

    const { data: resData, error } = await window.supabaseClient
      .from('reservations')
      .select('*');

    if (error) throw error;

    const sbData = resData || [];
    const allCandidates = [];
    if (typeof RESERVATIONS !== 'undefined' && Array.isArray(RESERVATIONS)) allCandidates.push(...RESERVATIONS);
    allCandidates.push(...sbData);

    const combinedMap = new Map();
    
    // Add fallback cache to match index.html calendar behavior
    try {
      const cached = localStorage.getItem('halden_public_calendar_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) allCandidates.push(...parsed);
      }
    } catch(e) {}

    allCandidates.forEach(r => {
      if (r && r.id) {
        combinedMap.set(r.id, Object.assign({}, combinedMap.get(r.id) || {}, r));
      }
    });

    const activeStatuses = ['confirmed', 'approved', 'procurement', 'procuring', 'preparing', 'on-going', 'paid', 'downpayment_paid', 'initial_fee_paid', 'scheduled'];
    const finalRes = Array.from(combinedMap.values()).filter(ev => {
      const status = String(ev.status || ev.reservation_status || '').toLowerCase().trim();
      const isAct = activeStatuses.includes(status) || ev.confirmed || ev.is_confirmed;
      const isDone = status === 'cancelled' || status === 'canceled' || status === 'rejected' || status === 'completed';
      return isAct && !isDone;
    });

    const assignedIds = window.STAFF_ASSIGNED_RES_IDS || new Set();
    const events = [];
    finalRes.forEach(r => {
      let tStr = r.timeframe || r.time || '';
      
      let rawDate = r.date || r.event_date || r.reservation_date;
      let startStr = null;
      if (rawDate) {
        if (typeof rawDate === 'object' && rawDate.seconds) {
          startStr = new Date(rawDate.seconds * 1000).toISOString().split('T')[0];
        } else {
          const s = String(rawDate).trim();
          if (/^\d{4}-\d{2}-\d{2}$/.test(s)) startStr = s;
          else {
            const d = new Date(s);
            if (!isNaN(d.getTime())) startStr = d.toISOString().split('T')[0];
          }
        }
      }
      
      if (!startStr) return;

      if (tStr.includes('-')) {
        let startTime = tStr.split('-')[0].trim();
        if (startTime.match(/am|pm/i)) {
          const isPM = startTime.toLowerCase().includes('pm');
          let [h, m] = startTime.toLowerCase().replace(/am|pm/, '').trim().split(':');
          if (!m) m = '00';
          let hi = parseInt(h);
          if (isPM && hi < 12) hi += 12;
          if (!isPM && hi === 12) hi = 0;
          startStr += `T${hi.toString().padStart(2,'0')}:${m}:00`;
        }
      }

      const isAssigned = assignedIds.has(r.id);
      events.push({
        id: r.id,
        title: `${r.client || r.client_name || r.name || 'Client'} - ${r.type || r.packageName || r.package_name || r.occasion || 'Event'}`,
        start: startStr,
        allDay: !tStr,
        backgroundColor: isAssigned ? '#22c55e' : '#c49a3c',
        borderColor:     isAssigned ? '#16a34a' : '#a07830',
        textColor: isAssigned ? '#fff' : '#000'
      });
    });

    containers.forEach(container => {
      const calendar = new FullCalendar.Calendar(container, {
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'title',
          right: 'prev,next today'
        },
        events: events,
        height: 450,
        themeSystem: 'standard'
      });
      calendar.render();
      staffCalendarInstances.push(calendar);
    });
  } catch (err) {
    console.error('Calendar init error:', err);
  }
}

// ===== VIEW PLAN — INLINE GPS MAP =====
const _vpMapInstances = {}; // resId -> L.Map instance

async function toggleStaffViewPlan(resId) {
  const safeId   = resId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const expandEl = document.getElementById('vp-expand-' + safeId);
  const mapEl    = document.getElementById('vp-map-'    + safeId);
  const btnEl    = document.getElementById('btn-vp-'    + safeId);
  if (!expandEl) return;

  const isOpen = expandEl.style.display !== 'none';

  if (isOpen) {
    expandEl.style.display = 'none';
    if (btnEl) btnEl.textContent = 'View Plan';
    return;
  }

  // Expand
  expandEl.style.display = 'block';
  if (btnEl) btnEl.textContent = 'Close Plan';

  // Already fully rendered — just re-show
  if (_vpMapInstances[resId]) {
    _vpMapInstances[resId].invalidateSize();
    return;
  }

  const res     = (RESERVATIONS || []).find(r => r.id === resId);
  const address = (res && (res.venue || res.address || res.venueAddress ||
                           res.venue_address || res.venueName)) || '';

  // --- Show roles section first ---
  const rolesContainerId = 'vp-roles-' + safeId;
  let rolesHtml = '';
  try {
    const staffData  = JSON.parse(sessionStorage.getItem('halden_staff') || '{}');
    const myStaffId  = staffData.id || '';
    if (myStaffId && window.supabaseClient) {
      const { data: asgn } = await window.supabaseClient
        .from('reservation_staff_assignments')
        .select('roles')
        .eq('reservation_id', resId)
        .eq('staff_id', myStaffId)
        .single();

      const roles = (asgn && Array.isArray(asgn.roles) ? asgn.roles : []).filter(Boolean);
      if (roles.length > 0) {
        let roleRows = [];
        if (window.supabaseClient) {
          const { data } = await window.supabaseClient
            .from('staff_roles')
            .select('role_name, description')
            .in('role_name', roles);
          roleRows = data || [];
        }
        
        // Fallback to defaults if not found in DB
        const fallbackRoles = {
          'Setup & Styling': 'Tables, chairs, cloths, table settings, basic setup',
          'Food Service': 'Serve food, refill food, refill rice, food heating',
          'Beverage Service': 'Juice, water, glasses, beverage station',
          'Table / Guest Service': 'Waiter duties, handing food, assisting guests',
          'Sanitation': 'Washing plates/glasses, cleaning spills, maintaining cleanliness',
          'Equipment / Logistics': 'Equipment movement, counting, loading/unloading',
          'Event Floater': 'Assist wherever the event manager assigns',
          'Event Coordinator/Manager': 'Directs staff and oversees execution'
        };

        const descMap = {};
        roles.forEach(r => { descMap[r] = fallbackRoles[r] || ''; }); // prime with fallbacks
        roleRows.forEach(r => { if (r.description) descMap[r.role_name] = r.description; }); // override with DB

        rolesHtml = `
          <div style="padding:16px 20px; border-bottom:1px solid var(--border);">
            <div style="font-size:11px;font-weight:800;color:var(--gold);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Your Assigned Roles</div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${roles.map(r => `
                <div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:10px 14px;">
                  <div style="font-size:13px;font-weight:700;color:var(--cream);">${r}</div>
                  ${descMap[r] ? `<div style="font-size:11px;color:var(--text-dim);margin-top:3px;">${descMap[r]}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>`;
      } else {
        rolesHtml = `<div style="padding:12px 20px;border-bottom:1px solid var(--border);font-size:12px;color:var(--text-dim);">No roles assigned for this event yet.</div>`;
      }
    }
  } catch (e) { console.warn('Could not load roles:', e); }

  // Inject roles HTML before the map section
  const rolesEl = document.getElementById(rolesContainerId);
  if (rolesEl) rolesEl.innerHTML = rolesHtml;

  if (!address || !mapEl) return;

  // Show loading state in map
  mapEl.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-dim);font-size:13px;">Loading map...</div>';

  try {
    const geoUrl = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' +
                   encodeURIComponent(address);
    const resp = await fetch(geoUrl, { headers: { 'Accept-Language': 'en' } });
    const geo  = await resp.json();

    if (!geo || geo.length === 0) {
      mapEl.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-dim);font-size:13px;">Could not locate venue on map.</div>';
      return;
    }

    const lat = parseFloat(geo[0].lat);
    const lon = parseFloat(geo[0].lon);

    mapEl.innerHTML = '';
    const map = L.map(mapEl).setView([lat, lon], 16);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    const goldIcon = L.divIcon({
      html: '<div style="background:#c49a3c;width:20px;height:20px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>',
      className: '',
      iconSize:   [20, 20],
      iconAnchor: [10, 10]
    });
    L.marker([lat, lon], { icon: goldIcon })
      .addTo(map)
      .bindPopup(`<b>${(res && res.client) || 'Venue'}</b><br>${address}`)
      .openPopup();

    _vpMapInstances[resId] = map;
    setTimeout(() => map.invalidateSize(), 150);

  } catch (err) {
    console.error('Map init error:', err);
    mapEl.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-dim);font-size:13px;">Map unavailable.</div>';
  }
}

// Attach to window
window.loadStaffProfile    = loadStaffProfile;
window.toggleEditProfile   = toggleEditProfile;
window.saveProfile         = saveProfile;
window.toggleAvailability  = toggleAvailability;
window.toggleStaffViewPlan = toggleStaffViewPlan;



// ==========================================
// ROUTINE CHECKS LOGIC PORTED FROM ADMIN
// ==========================================


function getStaffName() {
  try {
    const raw = sessionStorage.getItem('halden_staff');
    if(raw) {
      const u = JSON.parse(raw);
      return u.name || 'Unknown Staff';
    }
  } catch(e) {}
  return 'Staff';
}
const ROUTINE_CHECK_LOGS = [
  {
    id: 'CHK-001',
    date: '2026-04-06',
    checkedBy: 'Staff - ' + getStaffName(),
    totalItems: 44,
    issuesFound: 2,
    flagsCreated: 2,
    notes: '2 chipped wine glasses found. Chafing dish #3 has a loose handle : flagged for repair.',
    status: 'Completed'
  }
];

// Initialize with any saved logs from local storage (if running locally)
try {
  const localLogs = JSON.parse(localStorage.getItem('rc_saved_logs') || '[]');
  if (Array.isArray(localLogs)) {
    // Deduplicate by id before loading : only push entries not already present
    localLogs.forEach(l => {
      if (l && l.id && !ROUTINE_CHECK_LOGS.find(existing => existing.id === l.id)) {
        ROUTINE_CHECK_LOGS.push(l);
      }
    });
    // Write the deduplicated list back to localStorage to clean it up
    const deduped = [];
    const seen = new Set();
    localLogs.forEach(l => { if (l && l.id && !seen.has(l.id)) { seen.add(l.id); deduped.push(l); } });
    if (deduped.length !== localLogs.length) localStorage.setItem('rc_saved_logs', JSON.stringify(deduped));
  }
} catch (e) { }

let lastRoutineCheckDate = localStorage.getItem('rc_last_check_date') || '2026-04-06';
let activeRoutineCheck = null; // stores current in-progress check

// ----- HELPERS -----
function daysSinceLastCheck() {
  if (!lastRoutineCheckDate) return 9999;
  // Append T00:00:00 so JS parses it as local midnight, preventing timezone offset bugs that result in -1 on the same day
  const diff = Date.now() - new Date(lastRoutineCheckDate + 'T00:00:00').getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
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
      `Last inspection was ${days} day${days !== 1 ? 's' : ''} ago : weekly check required. Click here to begin. →`;
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
    if (a.status === 'Disabled') return false;
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
        <td><code style="font-size:11px; color:var(--gold);">${a.id}</code></td>
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
        <td><span style="font-size:12px;font-weight:600;color:${condColors[a.condition] || 'var(--text)'};">�:� ${a.condition}</span></td>
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
    EIM_ASSETS.filter(a => a.status !== 'Disabled').map(a => `<option value="${a.id}" ${a.id === preselect ? 'selected' : ''}>${a.id} : ${a.name}</option>`).join('');
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

// ----- SESSION KEYS -----
const RC_SESSION_KEY = 'rc_active_session';
const RC_ITEMS_KEY = 'rc_checked_items';
const RC_EXPIRY_MS = 48 * 60 * 60 * 1000; // 48 hours
let _rcTimerInterval = null;

// ----- HELPERS -----
function getRcSession() { try { return JSON.parse(localStorage.getItem(RC_SESSION_KEY) || 'null'); } catch (e) { return null; } }
function getRcCheckedItems() { try { return JSON.parse(localStorage.getItem(RC_ITEMS_KEY) || '{}'); } catch (e) { return {}; } }
function getRcSavedLogs() { try { return JSON.parse(localStorage.getItem('rc_saved_logs') || '[]'); } catch (e) { return []; } }

function saveRcSession(s) { localStorage.setItem(RC_SESSION_KEY, JSON.stringify(s)); }
function saveRcCheckedItems(c) { localStorage.setItem(RC_ITEMS_KEY, JSON.stringify(c)); }
function saveRcSavedLogs(l) { localStorage.setItem('rc_saved_logs', JSON.stringify(l)); }

function clearRcSession() { localStorage.removeItem(RC_SESSION_KEY); localStorage.removeItem(RC_ITEMS_KEY); }

function rcSupabase() { return window.supabaseClient || null; }

async function fetchSupabaseScanLogs() {
  const sb = rcSupabase();
  if (!sb) return [];
  const { data } = await sb.from('routine_check').select('*').order('checked_at', { ascending: false }).limit(500);

  const allRows = data || [];

  // ── Group all individual item rows by their session ID ──────────────────
  // notes format: "Routine check : RCS-123..." or "SESSION:RCS-123..."
  const sessionItemsMap = {}; // sessionId -> [rows]
  const masterLogMap = {}; // sessionId -> masterRow

  allRows.forEach(row => {
    // Skip the SESSION-ACTIVE marker
    if (row.asset_id === 'SESSION-ACTIVE' || row.notes === 'SESSION-ACTIVE') return;

    // MASTER-LOG rows store full JSON in notes
    if (row.asset_id === 'MASTER-LOG' && row.notes && row.notes.startsWith('{')) {
      try {
        const parsed = JSON.parse(row.notes);
        if (parsed.id) masterLogMap[parsed.id] = { row, parsed };
      } catch (e) { }
      return;
    }

    // Individual item rows: extract session ID from notes
    let sid = null;
    if (row.notes) {
      // "Routine check : RCS-xxx" style
      const m1 = row.notes.match(/Routine check\s*[\u2014\-]\s*(\S+)/);
      if (m1) sid = m1[1];
      // "SESSION:RCS-xxx" style
      const m2 = row.notes.match(/SESSION:(\S+)/);
      if (m2) sid = m2[1];
    }
    if (sid) {
      if (!sessionItemsMap[sid]) sessionItemsMap[sid] = [];
      sessionItemsMap[sid].push(row);
    }
  });

  const parsedLogs = [];
  const seenIds = new Set();

  // ── Emit one entry per session with a MASTER-LOG ─────────────────────────
  Object.entries(masterLogMap).forEach(([sid, { row, parsed }]) => {
    if (seenIds.has(sid)) return;
    seenIds.add(sid);

    if (!parsed.itemBreakdown || !parsed.itemBreakdown.length) {
      const individualRows = sessionItemsMap[sid] || [];
      if (individualRows.length) {
        parsed.itemBreakdown = individualRows.map(r => {
          let brokenQty = 0, missingQty = 0, retiredQty = 0;
          const incidents = typeof r.incidents === 'string' ? ((() => { try { return JSON.parse(r.incidents); } catch (e) { return []; } })()) : (r.incidents || []);
          incidents.forEach(inc => {
            const q = parseInt(inc.qty) || 0;
            const t = (inc.type || '').toLowerCase();
            if (t === 'broken' || t === 'damaged') brokenQty += q;
            else if (t === 'missing') missingQty += q;
            else if (t === 'trash' || t === 'retired') retiredQty += q;
            else brokenQty += q;
          });
          const totalQty = parseInt(r.quantity) || 0;
          const goodQty = r.status === 'good' && !incidents.length
            ? totalQty
            : Math.max(0, totalQty - brokenQty - missingQty - retiredQty);
          return { assetId: r.asset_id || '', assetName: r.equipment_name || r.asset_id || '', goodQty, brokenQty, missingQty, retiredQty };
        });
      }
    }
    parsedLogs.push({ ...parsed, fromScan: false });
  });

  // ── Sessions WITHOUT a MASTER-LOG: group item rows → one entry per session ─
  Object.entries(sessionItemsMap).forEach(([sid, rows]) => {
    if (seenIds.has(sid)) return; // already handled above
    seenIds.add(sid);

    const earliest = rows.reduce((a, b) => (a.checked_at < b.checked_at ? a : b));
    const rawDate = earliest.checked_at || '';
    // Use local date from the timestamp
    const localDate = rawDate ? new Date(rawDate).toLocaleDateString('en-CA') : rawDate.split('T')[0];
    const issuesFound = rows.filter(r => r.status === 'incident').length;
    const itemBreakdown = rows.map(r => {
      let brokenQty = 0, missingQty = 0, retiredQty = 0;
      const incidents = typeof r.incidents === 'string' ? ((() => { try { return JSON.parse(r.incidents); } catch (e) { return []; } })()) : (r.incidents || []);
      incidents.forEach(inc => {
        const q = parseInt(inc.qty) || 0;
        const t = (inc.type || '').toLowerCase();
        if (t === 'broken' || t === 'damaged') brokenQty += q;
        else if (t === 'missing') missingQty += q;
        else if (t === 'trash' || t === 'retired') retiredQty += q;
        else brokenQty += q;
      });
      const totalQty = parseInt(r.quantity) || 0;
      const goodQty = r.status === 'good' && !incidents.length
        ? totalQty
        : Math.max(0, totalQty - brokenQty - missingQty - retiredQty);
      return { assetId: r.asset_id || '', assetName: r.equipment_name || r.asset_id || '', goodQty, brokenQty, missingQty, retiredQty };
    });

    parsedLogs.push({
      id: sid,
      date: localDate,
      checkedBy: earliest.checked_by || 'Admin',
      totalItems: rows.length,
      issuesFound,
      flagsCreated: 0,
      notes: issuesFound > 0 ? `${issuesFound} issue(s) found` : 'No issues found',
      status: issuesFound > 0 ? 'Issues Found' : 'Completed',
      itemBreakdown,
      fromScan: false
    });
  });

  return parsedLogs.slice(0, 50);
}


// Counts how many reservations an equipment item is currently allocated to
function countAllocationsForEquip(assetId) {
  if (!assetId) return 0;
  const key = (assetId || '').toUpperCase();
  const seen = new Set();
  // EIM_ASSETS rows loaded from Supabase carry allocated_reservation_id
  (EIM_ASSETS || []).forEach(a => {
    if ((a.id || '').toUpperCase() === key && a.allocated_reservation_id) {
      seen.add(a.allocated_reservation_id);
    }
  });
  // Also scan any Supabase-returned rows cached on the asset objects
  (EIM_ASSETS || []).forEach(a => {
    if ((a.asset_id || '').toUpperCase() === key && a.allocated_reservation_id) {
      seen.add(a.allocated_reservation_id);
    }
  });
  return seen.size;
}

// ====================================================================
// RENDER: Section header, history
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
    daysSinceEl.textContent = days !== null ? days : '\u2014';
    daysSinceEl.style.color = overdue ? 'var(--red)' : 'var(--green)';
  }
  if (badgeEl) {
    badgeEl.innerHTML = overdue
      ? '<span class="badge critical" style="font-size:12px; padding:5px 14px;">OVERDUE</span>'
      : '<span class="badge confirmed" style="font-size:12px; padding:5px 14px;">On Schedule</span>';
  }
  if (itemCountEl) {
    const trackedRentals = RENTED_EQUIPMENT.filter(r => r.trackingType === 'rental' || r.reservationId || r.forEvent).length;
    itemCountEl.textContent = EIM_ASSETS.length + trackedRentals;
  }

  // Show/hide checklist container
  const container = document.getElementById('routine-checklist-container');
  if (container) container.style.display = activeRoutineCheck ? 'block' : 'none';

  // Start button label
  const startBtn = document.getElementById('btn-start-check');
  if (startBtn) startBtn.textContent = activeRoutineCheck ? 'Reset Check' : '+ Start New Check';

  // Render local data immediately, then async-refresh from Supabase
  renderRoutineHistory();
  refreshRoutineHistory(); // pulls cloud logs + updates lastRoutineCheckDate
  if (activeRoutineCheck) renderActiveChecklist();
}



async function refreshRoutineHistory() {
  const scanLogs = await fetchSupabaseScanLogs();
  scanLogs.forEach(log => {
    if (!ROUTINE_CHECK_LOGS.find(l => l.id === log.id)) ROUTINE_CHECK_LOGS.push(log);
  });

  // Deduplicate the entire array by id : keeps the LAST occurrence (most complete)
  const seenById = new Map();
  ROUTINE_CHECK_LOGS.forEach(l => seenById.set(l.id, l));
  ROUTINE_CHECK_LOGS.length = 0;
  seenById.forEach(l => ROUTINE_CHECK_LOGS.push(l));

  // Update lastRoutineCheckDate from the most recently dated submitted log
  const submittedLogs = ROUTINE_CHECK_LOGS.filter(l => l.date);
  if (submittedLogs.length) {
    const mostRecent = submittedLogs.reduce((a, b) => new Date(a.date) > new Date(b.date) ? a : b);
    if (mostRecent.date > lastRoutineCheckDate) {
      lastRoutineCheckDate = mostRecent.date;
      localStorage.setItem('rc_last_check_date', lastRoutineCheckDate);
    }
  }

  // Directly update the stats header DOM after cloud sync
  const days = lastRoutineCheckDate ? daysSinceLastCheck() : null;
  const overdue = isRoutineCheckOverdue();
  const lastDateEl = document.getElementById('routine-last-date');
  const daysSinceEl = document.getElementById('routine-days-since');
  const badgeEl = document.getElementById('routine-due-badge');
  if (lastDateEl && lastRoutineCheckDate) {
    lastDateEl.textContent = new Date(lastRoutineCheckDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
  }
  if (daysSinceEl) {
    daysSinceEl.textContent = days !== null ? days : '\u2014';
    daysSinceEl.style.color = overdue ? 'var(--red)' : 'var(--green)';
  }
  if (badgeEl) {
    badgeEl.innerHTML = overdue
      ? '<span class="badge critical" style="font-size:12px; padding:5px 14px;">OVERDUE</span>'
      : '<span class="badge confirmed" style="font-size:12px; padding:5px 14px;">On Schedule</span>';
  }

  // Re-render the history list with cloud data
  renderRoutineHistory();
}

window.refreshRoutineHistory = refreshRoutineHistory;

function renderRoutineHistory() {
  const container = document.getElementById('routine-history-container');
  if (!container) return;
  if (!ROUTINE_CHECK_LOGS.length) {
    container.innerHTML = '<div style="text-align:center; padding:24px; color:var(--text-dim); font-size:13px;">No inspection history yet.</div>';
    return;
  }
  // Deduplicate by id before rendering : one entry per unique session
  const uniqueLogs = new Map();
  ROUTINE_CHECK_LOGS.forEach(l => uniqueLogs.set(l.id, l));
  // Only show logs that have item-level breakdown data
  const sorted = [...uniqueLogs.values()]
    .filter(log => log.itemBreakdown && log.itemBreakdown.length > 0)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  if (!sorted.length) {
    container.innerHTML = '<div style="text-align:center; padding:24px; color:var(--text-dim); font-size:13px;">No inspection history yet.</div>';
    return;
  }
  container.innerHTML = sorted.map((log, idx) => {
    const dateStr = new Date(log.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const uid = `rc-hist-${idx}`;

    // Build item breakdown table if available
    let itemTableHtml = '';
    if (log.itemBreakdown && log.itemBreakdown.length) {
      const rows = log.itemBreakdown.map(item => {
        const asset = (window.EIM_ASSETS || []).find(a => a.assetId === item.assetId || a.id === item.assetId || a.supabaseId === item.assetId);
        const totalQty = parseInt(item.quantity || asset?.quantity || asset?.total_qty || asset?.good_qty || 1);
        const broken = parseInt(item.brokenQty) || 0;
        const missing = parseInt(item.missingQty) || 0;
        const retired = parseInt(item.retiredQty) || 0;
        const calculatedGood = Math.max(0, totalQty - broken - missing - retired);
        const gCount = (item.goodQty != null && item.goodQty > 1 && item.goodQty === calculatedGood) ? item.goodQty : calculatedGood;
        return `
        <tr>
          <td style="padding:7px 10px; font-size:12px; color:var(--cream);">${item.assetName}</td>
          <td style="padding:7px 10px; font-size:12px; color:var(--text-mid); text-align:center;">${item.assetId}</td>
          <td style="padding:7px 10px; font-size:12px; color:#4caf7d; text-align:center; font-weight:600;">${gCount}</td>
          <td style="padding:7px 10px; font-size:12px; color:#e05c4e; text-align:center; font-weight:600;">${broken}</td>
          <td style="padding:7px 10px; font-size:12px; color:#f5a623; text-align:center; font-weight:600;">${missing}</td>
          <td style="padding:7px 10px; font-size:12px; color:#a3988b; text-align:center; font-weight:600;">${retired}</td>
        </tr>`;
      }).join('');
      itemTableHtml = `
        <div id="${uid}-body" style="display:none; border-top:1px solid var(--border); overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse;">
            <thead>
              <tr style="background:rgba(0,0,0,0.2);">
                <th style="padding:8px 10px; font-size:11px; color:var(--text-dim); text-align:left; font-weight:600;">ITEM</th>
                <th style="padding:8px 10px; font-size:11px; color:var(--text-dim); text-align:center; font-weight:600;">ASSET ID</th>
                <th style="padding:8px 10px; font-size:11px; color:#4caf7d; text-align:center; font-weight:600;">GOOD</th>
                <th style="padding:8px 10px; font-size:11px; color:#e05c4e; text-align:center; font-weight:600;">BROKEN</th>
                <th style="padding:8px 10px; font-size:11px; color:#f5a623; text-align:center; font-weight:600;">MISSING</th>
                <th style="padding:8px 10px; font-size:11px; color:#a3988b; text-align:center; font-weight:600;">RETIRED</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>`;
    } else {
      itemTableHtml = `<div id="${uid}-body" style="display:none; border-top:1px solid var(--border); padding:14px 22px; font-size:12px; color:var(--text-dim); font-style:italic;">No item-level detail available for this session.</div>`;
    }

    return `
      <div style="border-bottom:1px solid var(--border);">
        <div onclick="document.getElementById('${uid}-body').style.display = document.getElementById('${uid}-body').style.display === 'none' ? 'block' : 'none'; this.querySelector('.rc-hist-chevron').classList.toggle('open');"
             style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px; padding:14px 22px; cursor:pointer; transition:background 0.15s;">
          <div style="display:flex; align-items:center; gap:10px; flex:1; min-width:0;">
            <span class="rc-hist-chevron" style="font-size:11px; color:var(--text-dim); transition:transform 0.2s; display:inline-block;">▶</span>
            <div>
              <div style="font-size:13px; font-weight:700; color:var(--cream);">${log.id} <span style="color:var(--text-dim); font-weight:400; font-size:12px;">: ${dateStr}</span></div>
              <div style="font-size:12px; color:var(--text-mid); margin-top:3px;">Checked by: ${log.checkedBy} · ${log.totalItems} items · ${log.issuesFound} issue${log.issuesFound !== 1 ? 's' : ''} found · ${log.flagsCreated} flag${log.flagsCreated !== 1 ? 's' : ''} created</div>
              ${log.notes ? `<div style="font-size:11px; color:var(--text-dim); margin-top:3px; font-style:italic;">"${log.notes}"</div>` : ''}
            </div>
          </div>
          <span class="badge confirmed">Completed</span>
        </div>
        ${itemTableHtml}
      </div>`;
  }).join('');
}

// Add chevron open style
if (!document.getElementById('rc-hist-chevron-style')) {
  const s = document.createElement('style');
  s.id = 'rc-hist-chevron-style';
  s.textContent = '.rc-hist-chevron.open { transform: rotate(90deg); }';
  document.head.appendChild(s);
}

function showRcConfirmModal(title, msg, onConfirm) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:99999; display:flex; align-items:center; justify-content:center; padding:20px;';

  const modal = document.createElement('div');
  modal.style.cssText = 'background:#1f1914; border:1px solid rgba(196, 154, 60, 0.3); border-radius:12px; width:100%; max-width:320px; padding:24px; box-shadow:0 10px 40px rgba(0,0,0,0.8); text-align:center;';

  modal.innerHTML = `
    <div style="font-size:16px; font-weight:700; color:#f8f5f0; margin-bottom:8px;">${title}</div>
    <div style="font-size:13px; color:#a3988b; margin-bottom:24px; line-height:1.5;">${msg}</div>
    <div style="display:flex; gap:12px;">
      <button class="btn-outline" style="flex:1; justify-content:center; padding:10px; background:transparent; border:1px solid #c49a3c; color:#c49a3c; border-radius:6px; font-size:13px; cursor:pointer;" id="rc-modal-no">No</button>
      <button class="btn-primary" style="flex:1; justify-content:center; background:#e05c4e; color:#fff; border:none; padding:10px; border-radius:6px; font-size:13px; font-weight:700; cursor:pointer;" id="rc-modal-yes">Yes</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  document.getElementById('rc-modal-no').onclick = () => overlay.remove();
  document.getElementById('rc-modal-yes').onclick = () => {
    overlay.remove();
    if (onConfirm) onConfirm();
  };
}

// ====================================================================
// SESSION: Start, restore, expire
// ====================================================================
async function startNewRoutineCheck(isSilentLoad = false, forceReset = false) {
  // If clicked by user and there's already an active check, confirm first
  if (!forceReset && !isSilentLoad && activeRoutineCheck) {
    showRcConfirmModal(
      'Reset Routine Check?',
      'Are you sure you want to reset the current inspection? All unsaved progress will be lost.',
      () => startNewRoutineCheck(false, true)
    );
    return;
  }

  // Check for existing unexpired session
  const existing = getRcSession();
  if (existing && !forceReset) {
    const age = Date.now() - new Date(existing.startedAt).getTime();
    if (age < RC_EXPIRY_MS) {
      // Restore session
      const rentalItems = RENTED_EQUIPMENT
        .filter(r => r.trackingType === 'rental' || r.reservationId || r.forEvent)
        .map((r, i) => ({
          idx: EIM_ASSETS.length + i,
          assetId: r.id, assetName: r.name,
          category: (r.category || r.type || 'Rented') + ' (Rental)',
          quantity: r.quantity || 1, unitType: r.unitType || 'pcs',
          expectedCondition: r.condition || 'Good',
          supabaseId: null, checked: false, incidents: []
        }));
      activeRoutineCheck = {
        id: existing.id,
        date: existing.date,
        checkedBy: existing.startedBy || 'Admin',
        startedAt: existing.startedAt,
        items: EIM_ASSETS.map((a, i) => ({
          idx: i, assetId: a.id, assetName: a.name, category: a.category,
          quantity: a.total_qty || a.quantity || 1, unitType: a.unitType,
          expectedCondition: a.condition,
          supabaseId: null, checked: false, incidents: [],
          status: a.status
        })).filter(x => x.status !== 'Disabled').concat(rentalItems)
      };
      // Restore state from localStorage
      const saved = getRcCheckedItems();
      activeRoutineCheck.items.forEach(item => {
        const state = saved[item.assetId];
        if (state) {
          item.checked = true;
          item.incidents = state.incidents || [];
          item.supabaseId = state.routineCheckRowId || null;
          item.status = state.status || 'good';
        }
      });
      renderRoutineCheckSection();
      startSessionTimer();
      document.getElementById('routine-checklist-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    } else {
      // Expired : clean up
      await wipeSessionFromSupabase(existing.id);
      clearRcSession();
    }
  }

  // Create fresh session
  const sessionId = 'RCS-' + Date.now();
  const rentalChecklistItems = RENTED_EQUIPMENT
    .filter(r => r.trackingType === 'rental' || r.reservationId || r.forEvent)
    .map((r, i) => ({
      idx: EIM_ASSETS.length + i,
      assetId: r.id, assetName: r.name,
      category: (r.category || r.type || 'Rented') + ' (Rental)',
      quantity: r.quantity || 1, unitType: r.unitType || 'pcs',
      expectedCondition: r.condition || 'Good',
      supabaseId: null, checked: false, incidents: []
    }));
  const now = new Date().toISOString();
  // Use LOCAL date so timezone doesn't shift the date (e.g. UTC+8 at 2 AM = still today locally)
  const _localNow = new Date();
  const localDate = _localNow.getFullYear() + '-'
    + String(_localNow.getMonth() + 1).padStart(2, '0') + '-'
    + String(_localNow.getDate()).padStart(2, '0');
  activeRoutineCheck = {
    id: sessionId,
    date: localDate,
    checkedBy: 'Staff - ' + getStaffName(),
    startedAt: now,
    items: EIM_ASSETS.map((a, i) => ({
      idx: i, assetId: a.id, assetName: a.name, category: a.category,
      quantity: a.total_qty || a.quantity || 1, unitType: a.unitType,
      expectedCondition: a.condition,
      supabaseId: null, checked: false, incidents: [],
      status: a.status
    })).filter(x => x.status !== 'Disabled').concat(rentalChecklistItems)
  };
  saveRcSession({ id: sessionId, startedAt: now, date: localDate, startedBy: 'Admin' });
  saveRcCheckedItems({});
  // Push SESSION-ACTIVE marker so scan.html can detect active session
  const sbRc = rcSupabase();
  if (sbRc) {
    // Remove any stale SESSION-ACTIVE markers first, then insert fresh one
    (async () => {
      try { await sbRc.from('routine_check').delete().eq('asset_id', 'SESSION-ACTIVE'); } catch (e) { }
      try {
        await sbRc.from('routine_check').insert({
          asset_id: 'SESSION-ACTIVE',
          equipment_name: JSON.stringify({ id: sessionId, startedAt: now, date: activeRoutineCheck.date }),
          notes: 'SESSION-ACTIVE'
        });
      } catch (e) { console.warn('[RC] SESSION-ACTIVE insert failed', e); }
    })();
  }
  renderRoutineCheckSection();
  startSessionTimer();
  document.getElementById('routine-checklist-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ====================================================================
// SESSION TIMER: 48-hour countdown
// ====================================================================
function startSessionTimer() {
  clearInterval(_rcTimerInterval);
  const timerEl = document.getElementById('rc-session-timer');
  if (!timerEl) return;
  timerEl.style.display = 'inline';

  function tick() {
    const session = getRcSession();
    if (!session) { timerEl.style.display = 'none'; return; }
    const elapsed = Date.now() - new Date(session.startedAt).getTime();
    const remaining = RC_EXPIRY_MS - elapsed;
    if (remaining <= 0) {
      timerEl.textContent = 'Session expired';
      timerEl.classList.add('urgent');
      clearInterval(_rcTimerInterval);
      autoExpireSession();
      return;
    }
    const h = Math.floor(remaining / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    const pad = n => String(n).padStart(2, '0');
    timerEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)} remaining`;
    timerEl.classList.toggle('urgent', remaining < 3600000); // red when < 1 hour
  }
  tick();
  _rcTimerInterval = setInterval(tick, 1000);
}

async function autoExpireSession() {
  const session = getRcSession();
  if (!session) return;
  await wipeSessionFromSupabase(session.id);
  clearRcSession();
  activeRoutineCheck = null;
  clearInterval(_rcTimerInterval);
  renderRoutineCheckSection();
}

async function checkAndExpireSession() {
  const session = getRcSession();
  if (!session) return;
  const age = Date.now() - new Date(session.startedAt).getTime();
  if (age >= RC_EXPIRY_MS) {
    await wipeSessionFromSupabase(session.id);
    clearRcSession();
  } else if (!activeRoutineCheck) {
    // Silently restore session on page load
    startNewRoutineCheck(true);
  }
}

async function wipeSessionFromSupabase(sessionId) {
  const sb = rcSupabase();
  if (!sb || !sessionId) return;
  // Fetch all rows for this session
  const { data } = await sb.from('routine_check').select('id, notes, asset_id').like('notes', `SESSION:${sessionId}%`);
  if (data && data.length) {
    const ids = data.map(r => r.id);
    await sb.from('routine_check').delete().in('id', ids);
  }

  // Revert equipment_inventory counts for any items that had incidents
  const checked = getRcCheckedItems();
  const revertPromises = Object.entries(checked).map(async ([assetId, state]) => {
    if (!state._eqId || state._origGood == null) return;
    try {
      await sb.from('equipment_inventory').update({
        good_qty: state._origGood, maintenance_qty: state._origMaint,
        missing_qty: state._origMiss, retired_qty: state._origRet,
        available_qty: state._origGood
      }).eq('id', state._eqId);
      const eimEntry = (window.EIM_ASSETS || []).find(a => a.id === state._eqId);
      if (eimEntry) {
        eimEntry.good_qty = state._origGood; eimEntry.maintenance_qty = state._origMaint;
        eimEntry.missing_qty = state._origMiss; eimEntry.retired_qty = state._origRet;
        eimEntry.available_qty = state._origGood;
      }
    } catch (e) { console.warn('[RC Wipe] revert failed for', assetId, e); }
  });
  await Promise.all(revertPromises);
}

let rcFilterCategory = 'All';

function toggleRoutineCheckBody(e) {
  // Prevent toggle if clicking on buttons
  if (e && e.target && e.target.closest('button')) return;
  const body = document.getElementById('routine-check-body');
  const icon = document.getElementById('rc-toggle-icon');
  if (body) {
    const isHidden = body.style.display === 'none';
    body.style.display = isHidden ? 'block' : 'none';
    if (icon) {
      icon.className = isHidden ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
    }
  }
}

window.setRcFilter = function (cat) {
  rcFilterCategory = cat;
  renderActiveChecklist();
};

window.addEventListener('storage', function (e) {
  if (e.key === 'rc_checked_items' && activeRoutineCheck) {
    const saved = getRcCheckedItems();
    activeRoutineCheck.items.forEach(item => {
      const state = saved[item.assetId];
      if (state) {
        item.checked = true;
        item.incidents = state.incidents || [];
        item.supabaseId = state.routineCheckRowId || null;
        item.status = state.status || 'good';
      } else {
        item.checked = false;
        item.incidents = [];
        item.supabaseId = null;
        item.status = null;
      }
    });
    renderActiveChecklist();
  }
});

// ====================================================================
// RENDER: Checklist rows
// ====================================================================
function renderActiveChecklist() {
  const container = document.getElementById('routine-checklist-items');
  const filterBar = document.getElementById('rc-filter-bar');
  if (!container || !activeRoutineCheck) return;

  const checked = activeRoutineCheck.items.filter(i => i.checked).length;
  const total = activeRoutineCheck.items.length;
  const progEl = document.getElementById('routine-check-progress');
  if (progEl) progEl.textContent = `${checked} / ${total} items marked`;

  // Build filter bar
  if (filterBar) {
    const categories = new Set();
    activeRoutineCheck.items.forEach(i => categories.add(i.category || 'Uncategorized'));
    const sortedCats = Array.from(categories).sort();

    let html = `<button class="rc-filter-btn ${rcFilterCategory === 'All' ? 'active' : ''}" onclick="setRcFilter('All')">All</button>`;
    sortedCats.forEach(c => {
      html += `<button class="rc-filter-btn ${rcFilterCategory === c ? 'active' : ''}" onclick="setRcFilter('${c}')">${c}</button>`;
    });
    // Mark All as Okay button on the right
    const allGood = activeRoutineCheck.items.every(i => i.checked && i.status === 'good');
    html += `<button class="rc-filter-btn" id="btn-mark-all-okay" onclick="markAllItemsOkay()" style="margin-left:auto;background:#000;color:#fff;border:2px solid #000;font-weight:700;padding:6px 14px;border-radius:6px;cursor:pointer;"><i class="${allGood ? 'fas fa-undo' : 'fas fa-check-double'}"></i> ${allGood ? 'Unmark All' : 'Mark All as Okay'}</button>`;
    filterBar.innerHTML = html;
  }

  // Filter items
  let displayItems = activeRoutineCheck.items;
  if (rcFilterCategory !== 'All') {
    displayItems = displayItems.filter(i => (i.category || 'Uncategorized') === rcFilterCategory);
  }

  container.innerHTML = displayItems.map(item => {
    const i = item.idx; // Preserve original index for logic
    const isOk = item.checked && item.status === 'good';
    const hasIncident = item.checked && item.status === 'incident';

    // Auto-compute allocations for this asset
    const allocCount = countAllocationsForEquip(item.assetId);

    const incidentPanelOpen = hasIncident ? 'open' : '';
    let incidentEntries = '';
    if (hasIncident && item.incidents) {
      const usedTypes = item.incidents.map(inc => inc.type === 'trash' || inc.type === 'retired' ? 'trash' : inc.type);
      item.incidents.forEach((inc, incIdx) => {
        const myType = inc.type === 'trash' || inc.type === 'retired' ? 'trash' : inc.type;
        const otherUsed = usedTypes.filter((_, k) => k !== incIdx);
        const disabledBroken = otherUsed.includes('broken') ? 'disabled' : '';
        const disabledMissing = otherUsed.includes('missing') ? 'disabled' : '';
        const disabledTrash = otherUsed.includes('trash') ? 'disabled' : '';
        incidentEntries += `
          <div class="ri-incident-entry" id="ri-inc-entry-${i}-${incIdx}">
            <select class="rc-input" style="width:160px;" onchange="updateRcIncidentField(${i}, ${incIdx}, 'type', this.value)">
              <option value="broken" ${myType === 'broken' ? 'selected' : ''} ${disabledBroken}>Broken / Damaged</option>
              <option value="missing" ${myType === 'missing' ? 'selected' : ''} ${disabledMissing}>Missing</option>
              <option value="trash" ${myType === 'trash' ? 'selected' : ''} ${disabledTrash}>Retired / Disposed</option>
            </select>
            <input type="number" class="rc-input" style="width:70px;" min="1" value="${inc.qty || 1}" onchange="updateRcIncidentField(${i}, ${incIdx}, 'qty', this.value)" />
            <button class="ri-inc-remove" style="font-size: 18px; font-weight: bold;" onclick="removeRcIncident(${i}, ${incIdx})" title="Remove">&times;</button>
          </div>
        `;
      });
    }

    return `
      <div class="ri-row ${isOk ? 'ri-checked' : ''} ${hasIncident ? 'ri-has-incident' : ''}" id="ri-row-${i}">
        <label class="ri-chk-wrap">
          <input type="checkbox" id="ri-chk-${i}" ${item.checked ? 'checked' : ''} disabled />
          <div class="ri-chk-box"><i class="fas fa-check"></i></div>
        </label>
        
        <div class="ri-item-info">
          <div class="ri-asset-id">${item.assetId}</div>
          <div class="ri-asset-name">${item.assetName}</div>
          <div class="ri-asset-cat">${item.category || 'Uncategorized'}</div>
        </div>

        <div class="ri-stats">
          <div class="ri-stat-line"><strong>${item.quantity || ':'} ${item.unitType || 'pcs'}</strong></div>
          <div class="ri-stat-line">Expected: <strong>${item.expectedCondition || 'Good'}</strong></div>
          <div class="ri-stat-line">Allocated to: <strong>${allocCount} event${allocCount !== 1 ? 's' : ''}</strong></div>
        </div>

        <div class="ri-controls">
          <div class="ri-ctrl-row">
            <label class="ri-ok-label ${isOk ? 'is-checked' : ''}" id="ri-ok-label-${i}">
              <input type="checkbox" id="ri-ok-chk-${i}" ${isOk ? 'checked' : ''} ${hasIncident ? 'disabled' : ''}
                onchange="markItemOkay(${i}, this.checked)" />
              Mark as Okay
            </label>
            <button class="ri-incident-btn ${hasIncident ? 'has-reports' : ''} ${incidentPanelOpen}" 
              id="ri-inc-btn-${i}" onclick="toggleRcIncidentPanel(${i})" ${isOk ? 'disabled' : ''}>
              ${hasIncident ? `Incident (${item.incidents.length})` : 'Report Incident'}
            </button>
            <button class="ri-qr-btn" onclick="window.open('scan.html?eq='+encodeURIComponent('${item.assetId}'),'_blank')" title="Scan with camera">
              <i class="fas fa-camera"></i> Scan
            </button>
          </div>
        </div>
        
        <div class="ri-incident-panel ${incidentPanelOpen}" id="ri-inc-panel-${i}">
          <div id="ri-inc-entries-${i}">${incidentEntries}</div>
          <button class="ri-add-inc-btn" onclick="addRcIncident(${i})">+ Add Another</button>
        </div>
      </div>`;
  }).join('');
}

// ====================================================================
// ITEM ACTIONS: OK, incident, auto-save
// ====================================================================

function toggleRICheck(i) {
  if (!activeRoutineCheck) return;
  const item = activeRoutineCheck.items[i];
  item.checked = !item.checked;
  renderActiveChecklist();
}

async function markItemOkay(i, checked) {
  if (!activeRoutineCheck) return;
  const item = activeRoutineCheck.items[i];

  if (checked) {
    // Cannot mark ok if incidents exist
    if (item.incidents && item.incidents.length > 0) {
      document.getElementById(`ri-ok-chk-${i}`).checked = false;
      return;
    }
    item.checked = true;
    item.incidents = [];
    item.status = 'good';
    await autoSaveItem(i);
  } else {
    // Uncheck : remove from Supabase
    item.checked = false;
    item.status = null;
    await deleteItemSave(i);
  }
  renderActiveChecklist();
}

async function toggleRcIncidentPanel(i) {
  const panel = document.getElementById(`ri-inc-panel-${i}`);
  const btn = document.getElementById(`ri-inc-btn-${i}`);
  if (!panel) return;
  const isOpen = panel.classList.contains('open');
  if (isOpen) {
    panel.classList.remove('open');
    btn && btn.classList.remove('open');
  } else {
    const item = activeRoutineCheck.items[i];
    // Uncheck OK if incident panel is being opened
    if (item.status === 'good') {
      item.checked = false;
      item.status = null;
      await deleteItemSave(i);
    }
    // Seed a default incident row if none exist
    if (!item.incidents || item.incidents.length === 0) {
      item.incidents = [{ type: 'broken', qty: 1 }];
    }
    // Mark as incident so renderActiveChecklist shows the entries
    item.checked = true;
    item.status = 'incident';
    renderActiveChecklist();
    // Re-open the panel after re-render
    const panelAfter = document.getElementById(`ri-inc-panel-${i}`);
    if (panelAfter) panelAfter.classList.add('open');
    const btnAfter = document.getElementById(`ri-inc-btn-${i}`);
    if (btnAfter) btnAfter.classList.add('open');
  }
}

function addRcIncident(i) {
  if (!activeRoutineCheck) return;
  const item = activeRoutineCheck.items[i];
  if (!item.incidents) item.incidents = [];
  // Only allow max 3 (one per type); pick the first unused type
  const allTypes = ['broken', 'missing', 'trash'];
  const usedTypes = item.incidents.map(inc => inc.type === 'retired' ? 'trash' : inc.type);
  const nextType = allTypes.find(t => !usedTypes.includes(t));
  if (!nextType) return; // all 3 types already used
  item.incidents.push({ type: nextType, qty: 1 });
  item.checked = true;
  item.status = 'incident';
  renderActiveChecklist();
  // Re-open panels
  const panel = document.getElementById(`ri-inc-panel-${i}`);
  if (panel) panel.classList.add('open');
  const btn = document.getElementById(`ri-inc-btn-${i}`);
  if (btn) btn.classList.add('open');
  autoSaveItem(i);
}

function removeRcIncident(i, j) {
  if (!activeRoutineCheck) return;
  const item = activeRoutineCheck.items[i];
  item.incidents.splice(j, 1);
  if (item.incidents.length === 0) {
    item.checked = false;
    item.status = null;
    deleteItemSave(i);
  } else {
    autoSaveItem(i);
  }
  renderActiveChecklist();
  const panel = document.getElementById(`ri-inc-panel-${i}`);
  if (panel && item.incidents.length > 0) panel.classList.add('open');
}

function updateRcIncidentField(i, j, field, value) {
  if (!activeRoutineCheck) return;
  const item = activeRoutineCheck.items[i];
  if (!item.incidents || !item.incidents[j]) return;
  if (field === 'qty') {
    value = Math.min(Math.max(1, value), item.quantity || 9999);
  }
  item.incidents[j][field] = value;
  item.checked = true;
  item.status = 'incident';
  if (field === 'type') refreshRcIncidentTypeOptions(i);
  autoSaveItem(i);
}

// ====================================================================
// SUPABASE AUTO-SAVE
// ====================================================================
async function autoSaveItem(i) {
  if (!activeRoutineCheck) return;
  const item = activeRoutineCheck.items[i];
  const checked = getRcCheckedItems();
  checked[item.assetId] = {
    status: item.incidents && item.incidents.length > 0 ? 'incident' : 'good',
    incidents: item.incidents || [],
    routineCheckRowId: item.supabaseId || null
  };
  saveRcCheckedItems(checked);

  // Flash saved dot
  const row = document.getElementById(`ri-row-${i}`);
  if (row) {
    let dot = row.querySelector('.ri-saved-dot');
    if (!dot) { dot = document.createElement('span'); dot.className = 'ri-saved-dot'; row.appendChild(dot); }
    dot.classList.add('show');
    setTimeout(() => dot.classList.remove('show'), 1500);
  }
}

async function deleteItemSave(i) {
  const item = activeRoutineCheck?.items[i];
  if (!item) return;
  const checked = getRcCheckedItems();
  delete checked[item.assetId];
  saveRcCheckedItems(checked);
}

// ====================================================================
// CANCEL & SUBMIT
// ====================================================================
async function cancelRoutineCheck() {
  showRcConfirmModal(
    'Cancel Inspection?',
    'Are you sure you want to cancel this inspection? All saved progress for this session will be removed.',
    async () => {
      clearInterval(_rcTimerInterval);
      const session = getRcSession();
      if (session) await wipeSessionFromSupabase(session.id);
      // Remove SESSION-ACTIVE marker from Supabase
      const sbRc2 = rcSupabase();
      if (sbRc2) { (async () => { try { await sbRc2.from('routine_check').delete().eq('asset_id', 'SESSION-ACTIVE'); } catch (e) { } })(); }
      clearRcSession();
      activeRoutineCheck = null;
      renderRoutineCheckSection();
    }
  );
}

async function submitRoutineCheck() {
  if (!activeRoutineCheck) return;
  const unchecked = activeRoutineCheck.items.filter(i => !i.checked);
  if (unchecked.length > 0) {
    const names = unchecked.slice(0, 3).map(i => i.assetName).join(', ');
    const more = unchecked.length > 3 ? ` and ${unchecked.length - 3} more` : '';
    alert(`Cannot submit : ${unchecked.length} item${unchecked.length > 1 ? 's' : ''} not yet checked:\n${names}${more}\n\nPlease mark all equipment before submitting.`);
    return;
  }

  const sb = rcSupabase();
  const ses = getRcSession();

  let flagsCreated = 0;
  let issuesFound = 0;

  // Build per-item breakdown and commit saves to Supabase + equipment_inventory
  const itemBreakdown = await Promise.all(activeRoutineCheck.items.map(async (item) => {
    const asset = (window.EIM_ASSETS || []).find(a => a.assetId === item.assetId || a.id === item.assetId || a.supabaseId === item.assetId);
    const totalPcs = parseInt(item.quantity || asset?.quantity || asset?.total_qty || asset?.good_qty || 1);

    let brokenQty = 0, missingQty = 0, retiredQty = 0;
    if (item.incidents && item.incidents.length > 0) {
      issuesFound++;
      item.incidents.forEach(inc => {
        const q = parseInt(inc.qty) || 0;
        const t = (inc.type || '').toLowerCase();
        if (t === 'broken' || t === 'damaged') brokenQty += q;
        else if (t === 'missing') missingQty += q;
        else if (t === 'trash' || t === 'retired') retiredQty += q;
        else brokenQty += q;
      });

      const alreadyFlagged = EQUIPMENT_FLAGS.find(f => f.assetId === item.assetId && f.status === 'Flagged');
      if (!alreadyFlagged) {
        EQUIPMENT_FLAGS.push({
          id: 'FLAG-' + String(EQUIPMENT_FLAGS.length + 1).padStart(3, '0'),
          assetId: item.assetId, assetName: item.assetName,
          issue: `Routine check (${activeRoutineCheck.id}): ${item.incidents.map(inc => inc.type + ' x' + inc.qty).join(', ')}`,
          flagType: 'damage', severity: 'High',
          reportedDate: activeRoutineCheck.date,
          reportedBy: activeRoutineCheck.checkedBy + ' (Routine Check)',
          status: 'Flagged'
        });
        flagsCreated++;
      }
    }

    const goodQty = Math.max(0, totalPcs - brokenQty - missingQty - retiredQty);

    // Save individual item routine check row to Supabase on Submit
    if (sb) {
      try {
        let eqId = asset?.supabaseId || asset?.id || null;
        if (!eqId) {
          const { data: eqRow } = await sb.from('equipment_inventory').select('id, good_qty, maintenance_qty, missing_qty, retired_qty').ilike('asset_id', item.assetId).maybeSingle();
          if (eqRow) eqId = eqRow.id;
        }

        const payload = {
          equipment_id: eqId || null,
          asset_id: item.assetId,
          equipment_name: item.assetName,
          checked_by: activeRoutineCheck.checkedBy || 'Admin',
          checked_at: new Date().toISOString(),
          status: item.incidents && item.incidents.length > 0 ? 'incident' : 'good',
          incidents: item.incidents && item.incidents.length > 0 ? item.incidents : null,
          notes: 'Routine check : ' + activeRoutineCheck.id
        };
        await sb.from('routine_check').insert(payload);

        // Update equipment inventory quantities in Supabase if incidents were logged
        if (eqId && (brokenQty > 0 || missingQty > 0 || retiredQty > 0)) {
          const curGood = asset?.good_qty ?? totalPcs;
          const curMaint = asset?.maintenance_qty ?? 0;
          const curMiss = asset?.missing_qty ?? 0;
          const curRet = asset?.retired_qty ?? 0;

          const newGood = Math.max(0, curGood - (brokenQty + missingQty + retiredQty));
          const newMaint = curMaint + brokenQty;
          const newMiss = curMiss + missingQty;
          const newRet = curRet + retiredQty;

          await sb.from('equipment_inventory').update({
            good_qty: newGood,
            maintenance_qty: newMaint,
            missing_qty: newMiss,
            retired_qty: newRet,
            available_qty: newGood
          }).eq('id', eqId);

          if (asset) {
            asset.good_qty = newGood;
            asset.maintenance_qty = newMaint;
            asset.missing_qty = newMiss;
            asset.retired_qty = newRet;
            asset.available_qty = newGood;
          }
        }
      } catch (err) {
        console.warn('[RC Submit] DB save error for item', item.assetId, err);
      }
    }

    return { assetId: item.assetId, assetName: item.assetName, quantity: totalPcs, goodQty, brokenQty, missingQty, retiredQty };
  }));

  const logEntry = {
    id: activeRoutineCheck.id,
    date: activeRoutineCheck.date,
    checkedBy: activeRoutineCheck.checkedBy,
    totalItems: activeRoutineCheck.items.length,
    issuesFound,
    flagsCreated,
    notes: flagsCreated > 0 ? `${flagsCreated} flag${flagsCreated > 1 ? 's' : ''} auto-created.` : 'No issues found.',
    status: 'Completed',
    itemBreakdown
  };

  // Upsert into in-memory array & local storage
  const existingIdx = ROUTINE_CHECK_LOGS.findIndex(l => l.id === logEntry.id);
  if (existingIdx >= 0) ROUTINE_CHECK_LOGS.splice(existingIdx, 1);
  ROUTINE_CHECK_LOGS.push(logEntry);

  const existingSaved = getRcSavedLogs().filter(l => l.id !== logEntry.id);
  existingSaved.push(logEntry);
  saveRcSavedLogs(existingSaved);

  // Persist Master Log entry to Supabase
  if (sb) {
    try {
      await sb.from('routine_check').insert({
        id: logEntry.id,
        asset_id: 'MASTER-LOG',
        equipment_name: 'Routine Check Session',
        status: 'good',
        checked_by: logEntry.checkedBy,
        notes: JSON.stringify(logEntry)
      });
    } catch (e) { console.error('[RC Submit] Master log save error:', e); }
  }

  lastRoutineCheckDate = activeRoutineCheck.date;
  localStorage.setItem('rc_last_check_date', lastRoutineCheckDate);

  // Clean up session markers
  if (sb) { (async () => { try { await sb.from('routine_check').delete().eq('asset_id', 'SESSION-ACTIVE'); } catch (e) { } })(); }

  clearInterval(_rcTimerInterval);
  clearRcSession();
  activeRoutineCheck = null;
  updateRoutineAlertBanner();
  renderEIMStats();
  renderRoutineCheckSection();

  const timerEl = document.getElementById('rc-session-timer');
  if (timerEl) timerEl.style.display = 'none';

  if (flagsCreated > 0) {
    alert('Routine check submitted. ' + flagsCreated + ' new issue flag' + (flagsCreated > 1 ? 's were' : ' was') + ' created.');
  } else {
    alert('Routine check completed : no critical issues found.');
  }
}

function updateRICondition(i, val) {
  if (!activeRoutineCheck) return;
  activeRoutineCheck.items[i].foundCondition = val;
}

function updateRINotes(i, val) {
  if (!activeRoutineCheck) return;
  activeRoutineCheck.items[i].notes = val;
}

function forceRoutineCheck() {
  showSection('routine-check', document.getElementById('nav-routine-check'));
  setTimeout(() => {
    if (!activeRoutineCheck) startNewRoutineCheck();
    document.getElementById('routine-checklist-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 200);
}
window.forceRoutineCheck = forceRoutineCheck;



window.EIM_ASSETS = [];
window.RENTED_EQUIPMENT = [];

async function loadRoutineChecks() {
  if (window.supabaseClient) {
    // Fetch equipment inventory to populate EIM_ASSETS
    const { data: eqData } = await window.supabaseClient.from('equipment_inventory').select('*').order('name');
    if (eqData) {
      window.EIM_ASSETS = eqData;
    }
    // Note: If you have a separate rentals table, you can fetch it here.
    // Assuming staff doesn't need to track rented equipment in this basic port,
    // window.RENTED_EQUIPMENT remains empty to prevent ReferenceErrors.
  }

  // Then render section
  renderRoutineCheckSection();
  refreshRoutineHistory().then(() => {
    renderRoutineHistory();
  });
}
